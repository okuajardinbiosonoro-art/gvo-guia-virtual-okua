import { expect, test, type Page } from "@playwright/test";

const LANGUAGE_KEY = "gvo.language.v1";
const JOURNEY_SENTINELS = {
  "gvo.progress.v1": "global-progress-sentinel",
  "gvo.station1.v1": "world-one-sentinel",
  "gvo.station2.v1": "world-two-sentinel",
  "gvo.station3.v1": "world-three-sentinel",
  "gvo.station4.v1": "world-four-sentinel",
  "gvo.station5.v1": "world-five-sentinel",
} as const;

async function seedJourneySentinels(page: Page) {
  await page.addInitScript((sentinels) => {
    for (const [key, value] of Object.entries(sentinels)) {
      localStorage.setItem(key, value);
    }
  }, JOURNEY_SENTINELS);
}

async function readJourneySentinels(page: Page) {
  return page.evaluate(
    (keys) =>
      Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)])),
    Object.keys(JOURNEY_SENTINELS),
  );
}

async function installFullscreenStub(page: Page, outcome: "grant" | "deny") {
  await page.addInitScript((fullscreenOutcome) => {
    let fullscreenElement: Element | null = null;
    const state = { requests: 0 };

    Object.defineProperty(window, "__gvoDebt012Fullscreen", {
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
        state.requests += 1;
        if (fullscreenOutcome === "deny") {
          throw new DOMException("Denied by DEBT_012", "NotAllowedError");
        }
        fullscreenElement = document.documentElement;
        document.dispatchEvent(new Event("fullscreenchange"));
      },
    });
  }, outcome);
}

async function fullscreenRequests(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __gvoDebt012Fullscreen?: { requests: number };
        }
      ).__gvoDebt012Fullscreen?.requests ?? 0,
  );
}

test("la primera carga termina en una selección explícita y no muta el recorrido", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await seedJourneySentinels(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".loading-initial")).toBeAttached();
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 90_000 });

  const initial = page.locator('[data-initial-experience="debt-012"]');
  await expect(initial).toBeVisible({ timeout: 60_000 });
  await expect(initial).toHaveAttribute("data-initial-language", "unselected");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Iniciar / Start" }),
  ).toBeDisabled();
  const mobileGeometry = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    buttons: [...document.querySelectorAll<HTMLButtonElement>("button")].map(
      (button) => {
        const rect = button.getBoundingClientRect();
        return { height: rect.height, width: rect.width };
      },
    ),
  }));
  expect(mobileGeometry.documentWidth).toBeLessThanOrEqual(
    mobileGeometry.viewportWidth,
  );
  expect(
    mobileGeometry.buttons.every(
      ({ height, width }) => height >= 44 && width >= 44,
    ),
  ).toBe(true);
  await expect(page.locator("audio, video")).toHaveCount(0);
  expect(await readJourneySentinels(page)).toEqual(JOURNEY_SENTINELS);
});

test("English persiste tras reload y actualiza el idioma del documento", async ({
  page,
}) => {
  await seedJourneySentinels(page);
  await page.goto("/inicio");

  const english = page.getByRole("button", { name: "English" });
  await english.focus();
  await page.keyboard.press("Enter");
  await expect(english).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), LANGUAGE_KEY),
  ).toBe("en");

  await page.reload();
  await expect(page.getByRole("button", { name: "English" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Start journey" }),
  ).toBeEnabled();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await readJourneySentinels(page)).toEqual(JOURNEY_SENTINELS);
});

test("touch selecciona Español y Space inicia Portada sin fullscreen automático", async ({
  page,
}) => {
  await seedJourneySentinels(page);
  await installFullscreenStub(page, "grant");
  await page.goto("/inicio");

  await page.getByRole("button", { name: "Español" }).tap();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  expect(await fullscreenRequests(page)).toBe(0);

  const start = page.getByRole("button", { name: "Iniciar recorrido" });
  await start.focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/\/portada$/);
  await expect(page.locator(".cover-intro")).toBeAttached();
  expect(await fullscreenRequests(page)).toBe(0);
  expect(await readJourneySentinels(page)).toEqual(JOURNEY_SENTINELS);
});

test("Enter solicita Fullscreen API una sola vez mediante gesto explícito", async ({
  page,
}) => {
  await installFullscreenStub(page, "grant");
  await page.goto("/inicio");

  const fullscreen = page.getByRole("button", {
    name: "Pantalla completa / Fullscreen",
  });
  expect(await fullscreenRequests(page)).toBe(0);
  await fullscreen.focus();
  await page.keyboard.press("Enter");

  await expect(fullscreen).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-initial-experience]")).toHaveAttribute(
    "data-initial-fullscreen-state",
    "active",
  );
  expect(await fullscreenRequests(page)).toBe(1);
});

test("la denegación de fullscreen informa y nunca bloquea la entrada", async ({
  page,
}) => {
  await seedJourneySentinels(page);
  await installFullscreenStub(page, "deny");
  await page.goto("/inicio");

  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("button", { name: "Enter fullscreen" }).click();
  await expect(
    page.locator("[data-initial-fullscreen-status]"),
  ).toHaveAttribute("data-initial-fullscreen-status", "error");
  await expect(
    page.getByText("Fullscreen could not be enabled.", { exact: false }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start journey" }).click();
  await expect(page).toHaveURL(/\/portada$/);
  expect(await fullscreenRequests(page)).toBe(1);
  expect(await readJourneySentinels(page)).toEqual(JOURNEY_SENTINELS);
});

test("sin Fullscreen API conserva un fallback visible y el botón de recorrido", async ({
  page,
}) => {
  await seedJourneySentinels(page);
  await page.addInitScript(() => {
    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      configurable: true,
      get: () => false,
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(Document.prototype, "exitFullscreen", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(Element.prototype, "webkitRequestFullscreen", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(Element.prototype, "webkitRequestFullScreen", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(Document.prototype, "webkitExitFullscreen", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(Document.prototype, "webkitCancelFullScreen", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/inicio");

  await page.getByRole("button", { name: "Español" }).click();
  await expect(
    page.getByRole("button", { name: "Activar pantalla completa" }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "La vista de navegador ya está optimizada para este dispositivo.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Iniciar recorrido" }).click();
  await expect(page).toHaveURL(/\/portada$/);
  expect(await readJourneySentinels(page)).toEqual(JOURNEY_SENTINELS);
});
