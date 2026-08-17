import { expect, test, type Page } from "@playwright/test";

const PROGRESS_KEY = "gvo.progress.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";

const completeProgress = {
  completedStations: [1, 2, 3, 4, 5],
  schemaVersion: 1,
  updatedAt: "2026-08-16T12:00:00.000Z",
};

const worldRoutes = [
  { id: "portal-1", route: "/estacion/1", world: 1 },
  { id: "portal-2", route: "/estacion/2", world: 2 },
  { id: "portal-3", route: "/estacion/3", world: 3 },
  { id: "portal-4", route: "/estacion/4", world: 4 },
  { id: "portal-5", route: "/estacion/5", world: 5 },
] as const;

async function seedCompleteProgress(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, progress }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(key, JSON.stringify(progress));
    },
    { key: PROGRESS_KEY, progress: completeProgress },
  );
}

async function waitForCover(page: Page) {
  await expect(page.locator("[data-critical-assets-ready='true']")).toBeVisible(
    {
      timeout: 30_000,
    },
  );
}

async function openCoverFromFinal(page: Page) {
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await expect(
    page.locator("[data-final-root='mirador_editorial_final']"),
  ).toBeVisible({
    timeout: 30_000,
  });
  await page.locator("[data-final-action='safe_navigation_portada']").click();
  await page.waitForURL("**/portada");
  await waitForCover(page);
  await expect(page.locator("[data-cover-revisit='active']")).toBeVisible();
}

async function installFullscreenStub(page: Page, supported = true) {
  await page.addInitScript((fullscreenSupported) => {
    let fullscreenElement: Element | null = null;
    const testWindow = window as Window & {
      __gvoRejectFullscreen?: boolean;
    };

    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      configurable: true,
      get: () => fullscreenSupported,
    });
    Object.defineProperty(Document.prototype, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement,
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: async () => {
        if (!fullscreenSupported || testWindow.__gvoRejectFullscreen) {
          document.dispatchEvent(new Event("fullscreenerror"));
          throw new DOMException("Denied by DEBT_014 stub", "NotAllowedError");
        }
        fullscreenElement = document.documentElement;
        document.dispatchEvent(new Event("fullscreenchange"));
      },
    });
    Object.defineProperty(Document.prototype, "exitFullscreen", {
      configurable: true,
      value: async () => {
        fullscreenElement = null;
        document.dispatchEvent(new Event("fullscreenchange"));
      },
    });
    Object.defineProperty(Navigator.prototype, "userActivation", {
      configurable: true,
      get: () => ({ isActive: true }),
    });
  }, supported);
}

test.describe("GVO_DEBT_014 global experience", () => {
  test("Portal I remains inside its rendered frame slot in all required viewports", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    for (const viewport of [
      { name: "portrait", width: 390, height: 844 },
      { name: "landscape", width: 844, height: 390 },
      { name: "desktop", width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/portada?resetIntro=1", {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator("[data-portal-id='portal-1']")).toBeVisible({
        timeout: 20_000,
      });
      await page.waitForFunction(() =>
        Array.from(
          document.querySelectorAll<HTMLImageElement>(
            "[data-portal-id='portal-1'] img",
          ),
        ).every((image) => image.complete && image.naturalWidth > 0),
      );

      const geometry = await page
        .locator("[data-portal-id='portal-1']")
        .evaluate((portal) => {
          const frame = portal.querySelector<HTMLImageElement>(
            ".cover-intro__portal-frame",
          );
          const interior = portal.querySelector<HTMLImageElement>(
            "[data-portal-clip='primary-safe']",
          );
          if (!frame || !interior) throw new Error("Portal I geometry missing");

          const frameBox = frame.getBoundingClientRect();
          const interiorBox = interior.getBoundingClientRect();
          const scale = Math.min(
            frameBox.width / frame.naturalWidth,
            frameBox.height / frame.naturalHeight,
          );
          const renderedWidth = frame.naturalWidth * scale;
          const renderedHeight = frame.naturalHeight * scale;
          const slot = {
            left: frameBox.left + (frameBox.width - renderedWidth) / 2,
            right: frameBox.right - (frameBox.width - renderedWidth) / 2,
            top: frameBox.top + (frameBox.height - renderedHeight) / 2,
            bottom: frameBox.bottom - (frameBox.height - renderedHeight) / 2,
          };
          const visibleInterior = {
            left: interiorBox.left,
            right: interiorBox.right,
            top: interiorBox.top + 1,
            bottom: interiorBox.bottom - 1,
          };

          return {
            clipPath: getComputedStyle(interior).clipPath,
            objectFit: getComputedStyle(interior).objectFit,
            overflow: {
              top: Math.max(0, slot.top - visibleInterior.top),
              right: Math.max(0, visibleInterior.right - slot.right),
              bottom: Math.max(0, visibleInterior.bottom - slot.bottom),
              left: Math.max(0, slot.left - visibleInterior.left),
            },
          };
        });

      expect(geometry.objectFit, viewport.name).toBe("cover");
      expect(geometry.clipPath, viewport.name).toContain("inset(1px");
      expect(
        Math.max(...Object.values(geometry.overflow)),
        viewport.name,
      ).toBeLessThanOrEqual(0.25);
    }
  });

  test("normal sessions preserve gating even with complete progress but no revisit context", async ({
    page,
  }) => {
    await page.goto("/portada?resetIntro=1", { waitUntil: "domcontentloaded" });
    await waitForCover(page);
    await expect(page.locator("[data-portal-state='locked']")).toHaveCount(4);
    await expect(page.locator(".cover-intro__portal-lock")).toHaveCount(4);

    await page.evaluate(
      ({ contextKey, key, progress }) => {
        localStorage.setItem(key, JSON.stringify(progress));
        sessionStorage.removeItem(contextKey);
      },
      {
        contextKey: REVIEW_CONTEXT_KEY,
        key: PROGRESS_KEY,
        progress: completeProgress,
      },
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForCover(page);
    await expect(page.locator("[data-cover-revisit='inactive']")).toBeVisible();
    await expect(page.locator("[data-portal-state='locked']")).toHaveCount(4);
  });

  test("Mirador unlocks I–V and each portal opens its canonical World with coherent return", async ({
    page,
  }) => {
    await seedCompleteProgress(page);

    for (const world of worldRoutes) {
      await openCoverFromFinal(page);
      await expect(page.locator("[data-portal-state='available']")).toHaveCount(
        5,
      );
      await expect(page.locator(".cover-intro__portal-lock")).toHaveCount(0);
      await page.locator(`[data-portal-id="${world.id}"]`).click();
      await page.waitForURL(`**${world.route}`);
      await expect(
        page.locator("[data-final-review-active='true']"),
      ).toBeVisible({
        timeout: 30_000,
      });
      await expect(
        page.locator("[data-final-review-return='active']"),
      ).toBeVisible();
      await page.locator("[data-final-review-return='active']").click();
      await page.waitForURL("**/final");
      await expect(
        page.locator("[data-final-root='mirador_editorial_final']"),
      ).toBeVisible({
        timeout: 30_000,
      });
    }
  });

  test("one shared control persists state through SPA navigation and exits cleanly", async ({
    page,
  }) => {
    await installFullscreenStub(page);
    await seedCompleteProgress(page);

    await page.goto("/inicio", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator("[data-gvo-immersive-control='fullscreen']"),
    ).toHaveCount(0);
    await expect(
      page.locator("[data-initial-fullscreen-action='request']"),
    ).toHaveCount(1);

    for (const route of [
      "/portada",
      "/estacion/1",
      "/estacion/2",
      "/estacion/3",
      "/estacion/4",
      "/estacion/5",
      "/estacion/5/plantas",
      "/final",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator("[data-gvo-immersive-control='fullscreen']"),
      ).toHaveCount(1);
    }

    await expect(
      page.locator("[data-gvo-immersive-state='inactive']"),
    ).toBeVisible();
    await page.locator("[data-gvo-immersive-control='fullscreen']").click();
    await expect(
      page.locator("[data-gvo-immersive-state='active']"),
    ).toBeVisible();

    await page.locator("[data-final-action='safe_navigation_portada']").click();
    await page.waitForURL("**/portada");
    await expect(
      page.locator("[data-gvo-immersive-state='active']"),
    ).toBeVisible();
    await page.locator("[data-portal-id='portal-2']").click();
    await page.waitForURL("**/estacion/2");
    await expect(
      page.locator("[data-gvo-immersive-state='active']"),
    ).toBeVisible();

    await page.locator("[data-gvo-immersive-control='fullscreen']").click();
    await expect(
      page.locator("[data-gvo-immersive-state='inactive']"),
    ).toBeVisible();
  });

  test("unsupported and rejected fullscreen remain non-blocking", async ({
    page,
  }) => {
    await installFullscreenStub(page, false);
    await page.goto("/portada", { waitUntil: "domcontentloaded" });
    await waitForCover(page);
    await expect(
      page.locator("[data-gvo-immersive-state='blocked']"),
    ).toBeDisabled();
    await expect(
      page.locator("[data-gvo-immersive-control='fullscreen']"),
    ).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "blocked-by-context",
    );
    await expect(page.locator("[data-portal-id='portal-1']")).toBeVisible();

    const rejectionPage = await page.context().newPage();
    await installFullscreenStub(rejectionPage);
    await rejectionPage.goto("/portada", { waitUntil: "domcontentloaded" });
    await waitForCover(rejectionPage);
    await rejectionPage.evaluate(() => {
      (
        window as Window & { __gvoRejectFullscreen?: boolean }
      ).__gvoRejectFullscreen = true;
    });
    await rejectionPage
      .locator("[data-gvo-immersive-control='fullscreen']")
      .click();
    await expect(
      rejectionPage.locator("[data-gvo-immersive-state='error']"),
    ).toBeVisible();
    await expect(
      rejectionPage.locator("[data-portal-id='portal-1']"),
    ).toBeVisible();
    await rejectionPage.close();
  });
});
