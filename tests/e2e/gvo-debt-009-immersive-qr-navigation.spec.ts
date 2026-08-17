import { expect, test, type Page } from "@playwright/test";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";

type RuntimeSpyState = {
  camera: number;
  exitFullscreen: number;
  requestFullscreen: number;
};

async function installRuntimeContract(page: Page, completedStations: number[]) {
  const rawProgress = JSON.stringify({
    completedStations,
    schemaVersion: 1,
    updatedAt: "2026-08-06T12:00:00.000Z",
  });

  await page.addInitScript(
    ({ progressKey, progressValue }) => {
      localStorage.setItem(progressKey, progressValue);

      let fullscreenElement: Element | null = null;
      const state: RuntimeSpyState = {
        camera: 0,
        exitFullscreen: 0,
        requestFullscreen: 0,
      };
      Object.defineProperty(window, "__gvoDebt009Runtime", {
        configurable: true,
        value: state,
      });
      Object.defineProperty(Document.prototype, "fullscreenEnabled", {
        configurable: true,
        get: () => true,
      });
      Object.defineProperty(Document.prototype, "fullscreenElement", {
        configurable: true,
        get: () => fullscreenElement,
      });
      Object.defineProperty(Element.prototype, "requestFullscreen", {
        configurable: true,
        value: async () => {
          state.requestFullscreen += 1;
          fullscreenElement = document.documentElement;
          document.dispatchEvent(new Event("fullscreenchange"));
        },
      });
      Object.defineProperty(Document.prototype, "exitFullscreen", {
        configurable: true,
        value: async () => {
          state.exitFullscreen += 1;
          fullscreenElement = null;
          document.dispatchEvent(new Event("fullscreenchange"));
        },
      });
      Object.defineProperty(
        Object.getPrototypeOf(navigator),
        "userActivation",
        {
          configurable: true,
          get: () => undefined,
        },
      );

      const mediaDevices = navigator.mediaDevices ?? {};
      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: mediaDevices,
      });
      Object.defineProperty(mediaDevices, "getUserMedia", {
        configurable: true,
        value: async () => {
          state.camera += 1;
          throw new DOMException("Camera blocked by test", "NotAllowedError");
        },
      });
    },
    { progressKey: GLOBAL_PROGRESS_KEY, progressValue: rawProgress },
  );

  return rawProgress;
}

async function runtimeState(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __gvoDebt009Runtime: RuntimeSpyState;
        }
      ).__gvoDebt009Runtime,
  );
}

test("las cinco rutas QR de producción resuelven inicio y W2-W5", async ({
  page,
}) => {
  await installRuntimeContract(page, [1, 2, 3, 4, 5]);

  for (const stationId of [2, 3, 4, 5]) {
    await page.goto(`/qr/w${stationId}`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(new RegExp(`/estacion/${stationId}$`));
    await expect(
      page.locator('[data-gvo-immersive-shell="active"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-gvo-immersive-control="fullscreen"]'),
    ).toHaveCount(1);
  }

  // Start owns the real loading timeline, so it is asserted last to avoid
  // racing its intentional redirect while the same page checks W2-W5.
  await page.goto("/qr/start", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.locator('[data-gvo-immersive-shell="inactive"]'),
  ).toBeAttached();

  expect((await runtimeState(page)).camera).toBe(0);
});

test("QR adelantado aplica fallback sin conceder ni modificar progreso", async ({
  page,
}) => {
  const rawProgress = await installRuntimeContract(page, [1]);

  await page.goto("/qr/w5?completedStations=1,2,3,4", {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveURL(/\/estacion\/2$/);
  expect(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      GLOBAL_PROGRESS_KEY,
    ),
  ).toBe(rawProgress);
  expect(await runtimeState(page)).toEqual({
    camera: 0,
    exitFullscreen: 0,
    requestFullscreen: 0,
  });
});

test("QR inválido o manipulado cae al destino seguro y preserva bytes", async ({
  page,
}) => {
  const rawProgress = await installRuntimeContract(page, [1, 2]);

  for (const route of [
    "/qr",
    "/qr/not-a-station",
    "/qr/1",
    "/qr/w1",
    "/qr/W2",
    "/qr/w5/extra",
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/estacion\/3$/);
    expect(
      await page.evaluate(
        (key) => localStorage.getItem(key),
        GLOBAL_PROGRESS_KEY,
      ),
    ).toBe(rawProgress);
  }

  expect((await runtimeState(page)).camera).toBe(0);
});

test("progreso corrupto falla cerrado y el QR no reescribe la evidencia", async ({
  page,
}) => {
  await installRuntimeContract(page, []);
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{corrupto");
  }, GLOBAL_PROGRESS_KEY);

  await page.goto("/qr/w5", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/estacion\/1$/);
  expect(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      GLOBAL_PROGRESS_KEY,
    ),
  ).toBe("{corrupto");
});

test("el shell ofrece un único botón nativo, safe-area y target 44x44", async ({
  page,
}) => {
  await installRuntimeContract(page, [1, 2]);
  await page.goto("/estacion/3", { waitUntil: "domcontentloaded" });

  const dock = page.locator(".gvo-immersive-shell__dock");
  const control = page.getByRole("button", {
    name: "Activar pantalla completa",
  });
  await expect(control).toBeVisible();
  await expect(control).toHaveAttribute("type", "button");
  await expect(control).toHaveAttribute("aria-pressed", "false");
  await expect(dock).toHaveAttribute(
    "data-gvo-immersive-safe-area",
    "top-inline-end",
  );

  const metrics = await page.evaluate(() => {
    const dockElement = document.querySelector<HTMLElement>(
      ".gvo-immersive-shell__dock",
    );
    const controlElement = document.querySelector<HTMLElement>(
      '[data-gvo-immersive-control="fullscreen"]',
    );
    if (!dockElement || !controlElement) throw new Error("Shell missing");
    const rect = controlElement.getBoundingClientRect();
    return {
      dockPointerEvents: getComputedStyle(dockElement).pointerEvents,
      height: rect.height,
      right: rect.right,
      top: rect.top,
      width: rect.width,
      viewportWidth: innerWidth,
    };
  });

  expect(metrics.width).toBeGreaterThanOrEqual(44);
  expect(metrics.height).toBeGreaterThanOrEqual(44);
  expect(metrics.top).toBeGreaterThanOrEqual(0);
  expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(metrics.dockPointerEvents).toBe("none");
  expect(await runtimeState(page)).toMatchObject({
    camera: 0,
    requestFullscreen: 0,
  });
});

test("Enter, Space y touch alternan sólo por gesto explícito", async ({
  page,
}) => {
  await installRuntimeContract(page, [1, 2]);
  await page.goto("/estacion/3", { waitUntil: "domcontentloaded" });

  let control = page.getByRole("button", {
    name: "Activar pantalla completa",
  });
  await control.press("Enter");
  await expect
    .poll(async () => (await runtimeState(page)).requestFullscreen)
    .toBe(1);
  control = page.getByRole("button", { name: "Salir de pantalla completa" });
  await expect(control).toHaveAttribute("aria-pressed", "true");

  await control.press("Space");
  control = page.getByRole("button", {
    name: "Activar pantalla completa",
  });
  await expect(control).toHaveAttribute("aria-pressed", "false");
  expect(await runtimeState(page)).toMatchObject({ exitFullscreen: 1 });

  await control.tap();
  await expect(
    page.getByRole("button", { name: "Salir de pantalla completa" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await runtimeState(page)).toMatchObject({
    camera: 0,
    requestFullscreen: 2,
  });
});

test("reduced motion elimina transiciones y el estado no depende sólo de color", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installRuntimeContract(page, [1, 2]);
  await page.goto("/estacion/3", { waitUntil: "domcontentloaded" });

  const control = page.getByRole("button", {
    name: "Activar pantalla completa",
  });
  const before = await control.evaluate((element) => ({
    glyph: getComputedStyle(element, "::before").content,
    transitionDuration: getComputedStyle(element).transitionDuration,
  }));
  expect(
    before.transitionDuration.split(",").every((value) => value === "0s"),
  ).toBe(true);

  await control.tap();
  await expect
    .poll(async () => (await runtimeState(page)).requestFullscreen)
    .toBe(1);
  const active = page.getByRole("button", {
    name: "Salir de pantalla completa",
  });
  await expect(active).toHaveAttribute("aria-pressed", "true");
  const afterGlyph = await active.evaluate(
    (element) => getComputedStyle(element, "::before").content,
  );
  expect(afterGlyph).not.toBe(before.glyph);
});

test("DEBT_014 extiende el control a Portada/Final y no colisiona con revisita", async ({
  page,
}) => {
  await installRuntimeContract(page, [1, 2, 3, 4, 5]);

  for (const route of ["/carga", "/inicio", "/estacion/6"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('[data-gvo-immersive-shell="inactive"]'),
    ).toBeAttached();
    await expect(
      page.locator('[data-gvo-immersive-control="fullscreen"]'),
    ).toHaveCount(0);
  }

  for (const route of ["/portada", "/final"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('[data-gvo-immersive-shell="active"]'),
    ).toBeAttached();
    await expect(
      page.locator('[data-gvo-immersive-control="fullscreen"]'),
    ).toHaveCount(1);
  }

  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="1"]').click();
  await expect(page).toHaveURL(/\/estacion\/1$/);
  await Promise.all([
    expect(
      page.locator('[data-gvo-immersive-control="fullscreen"]'),
    ).toBeVisible(),
    expect(page.locator('[data-final-review-return="active"]')).toBeVisible(),
  ]);
  const intersection = await page.evaluate(() => {
    const immersive = document
      .querySelector('[data-gvo-immersive-control="fullscreen"]')
      ?.getBoundingClientRect();
    const review = document
      .querySelector('[data-final-review-return="active"]')
      ?.getBoundingClientRect();
    if (!immersive || !review) throw new Error("Review controls missing");
    const width = Math.max(
      0,
      Math.min(immersive.right, review.right) -
        Math.max(immersive.left, review.left),
    );
    const height = Math.max(
      0,
      Math.min(immersive.bottom, review.bottom) -
        Math.max(immersive.top, review.top),
    );
    return width * height;
  });
  expect(intersection).toBe(0);
});

test("el control no cubre interacciones en rutas y orientaciones autorizadas", async ({
  page,
}) => {
  await installRuntimeContract(page, [1, 2, 3, 4, 5]);
  const routes = [
    "/estacion/1",
    "/estacion/2",
    "/estacion/3",
    "/estacion/4",
    "/estacion/5",
    "/estacion/5/plantas",
    "/estacion/5/sistema",
    "/estacion/5/espacio",
    "/estacion/5/visitante",
  ];

  for (const viewport of [
    { height: 844, width: 390 },
    { height: 390, width: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator('[data-gvo-immersive-control="fullscreen"]'),
      ).toBeVisible();
      const geometry = await page.evaluate(() => {
        const immersive = document.querySelector<HTMLElement>(
          '[data-gvo-immersive-control="fullscreen"]',
        );
        if (!immersive) throw new Error("Immersive control missing");
        const controlRect = immersive.getBoundingClientRect();
        const intersections = Array.from(
          document.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [role="button"], [tabindex="0"]',
          ),
        )
          .filter((candidate) => candidate !== immersive)
          .map((candidate) => {
            const style = getComputedStyle(candidate);
            const rect = candidate.getBoundingClientRect();
            const width = Math.max(
              0,
              Math.min(controlRect.right, rect.right) -
                Math.max(controlRect.left, rect.left),
            );
            const height = Math.max(
              0,
              Math.min(controlRect.bottom, rect.bottom) -
                Math.max(controlRect.top, rect.top),
            );
            return {
              area:
                style.display === "none" ||
                style.visibility === "hidden" ||
                Number(style.opacity) === 0
                  ? 0
                  : width * height,
              label:
                candidate.getAttribute("aria-label") ??
                candidate.textContent?.trim().slice(0, 80) ??
                candidate.tagName,
            };
          })
          .filter((candidate) => candidate.area > 0.25);
        return {
          bottom: controlRect.bottom,
          intersections,
          left: controlRect.left,
          right: controlRect.right,
          top: controlRect.top,
        };
      });

      expect(
        geometry.intersections,
        `${route} ${viewport.width}x${viewport.height}`,
      ).toEqual([]);
      expect(geometry.left).toBeGreaterThanOrEqual(0);
      expect(geometry.top).toBeGreaterThanOrEqual(0);
      expect(geometry.right).toBeLessThanOrEqual(viewport.width + 0.5);
      expect(geometry.bottom).toBeLessThanOrEqual(viewport.height + 0.5);
    }
  }
});
