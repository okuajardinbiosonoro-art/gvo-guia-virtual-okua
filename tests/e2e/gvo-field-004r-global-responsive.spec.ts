import { expect, test, type Page } from "@playwright/test";

const progressKey = "gvo.progress.v1";
const completeProgress = {
  completedStations: [1, 2, 3, 4, 5],
  schemaVersion: 1,
  updatedAt: "2026-08-25T12:00:00.000Z",
};

const coverViewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "820x1180", width: 820, height: 1180 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
  { name: "3440x1440", width: 3440, height: 1440 },
] as const;

const representativeViewports = [
  { name: "375x667", width: 375, height: 667 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "3440x1440", width: 3440, height: 1440 },
] as const;

const journeyRoutes = [
  "/inicio",
  "/portada",
  "/transition/intro-to-station-1",
  "/estacion/1",
  "/transition/world-1-to-world-2",
  "/estacion/2",
  "/transition/world-2-to-world-3",
  "/estacion/3",
  "/transition/world-3-to-world-4",
  "/estacion/4",
  "/transition/world-4-to-world-5",
  "/estacion/5",
  "/transition/world-5-to-final",
  "/final",
] as const;

type Rect = Readonly<{
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}>;

async function waitForRouteReady(page: Page, route: string) {
  const stationSelectors: Readonly<Record<string, string>> = {
    "/estacion/1": "main[data-world1-root-version]",
    "/estacion/2": "main[data-world2-state]",
    "/estacion/3": "main[data-station3-state]",
    "/estacion/4": "main[data-station4-state]",
    "/estacion/5": "main.s5-screen",
  };
  const selector =
    route === "/inicio"
      ? "[data-initial-experience]"
      : route === "/portada"
        ? "main[data-critical-assets-ready='true']"
        : route.startsWith("/transition/")
          ? "main[data-transition-world-id][data-critical-assets-ready='true']"
          : route === "/final"
            ? "[data-final-root]"
            : (stationSelectors[route] ?? "main");

  await page.locator(selector).first().waitFor({
    state: "visible",
    timeout: 30_000,
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

async function openFreshCover(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto("/portada?resetIntro=1", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page, "/portada");
}

async function openRevisitCover(page: Page) {
  await page.evaluate(
    ({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)),
    { key: progressKey, progress: completeProgress },
  );
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-action="safe_navigation_portada"]').click();
  await waitForRouteReady(page, "/portada");
}

async function readCoverGeometry(page: Page) {
  return page.evaluate(() => {
    const rect = (element: Element | null): Rect | null => {
      if (!element) return null;
      const bounds = element.getBoundingClientRect();
      return {
        bottom: bounds.bottom,
        height: bounds.height,
        left: bounds.left,
        right: bounds.right,
        top: bounds.top,
        width: bounds.width,
      };
    };
    const portals = Array.from(
      document.querySelectorAll<HTMLElement>("[data-portal-id]"),
    ).map((portal) => {
      const art = portal.querySelector(".cover-intro__portal-art");
      const frame = portal.querySelector(".cover-intro__portal-frame");
      const interior = portal.querySelector(".cover-intro__portal-interior");
      return {
        id: portal.dataset.portalId,
        portal: rect(portal),
        art: rect(art),
        frame: rect(frame),
        interior: rect(interior),
        artAspectRatio: art ? getComputedStyle(art).aspectRatio : null,
        artTransformOrigin: art ? getComputedStyle(art).transformOrigin : null,
        frameObjectFit: frame ? getComputedStyle(frame).objectFit : null,
        interiorObjectFit: interior
          ? getComputedStyle(interior).objectFit
          : null,
      };
    });
    return {
      viewport: { width: innerWidth, height: innerHeight },
      horizontalOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      stage: rect(document.querySelector(".cover-intro__stage")),
      cta: rect(document.querySelector(".cover-intro__cta")),
      dialogue: rect(document.querySelector("[role='dialog']")),
      portals,
    };
  });
}

function expectInside(inner: Rect | null, outer: Rect | null, tolerance = 1) {
  expect(inner).not.toBeNull();
  expect(outer).not.toBeNull();
  expect(inner!.left).toBeGreaterThanOrEqual(outer!.left - tolerance);
  expect(inner!.top).toBeGreaterThanOrEqual(outer!.top - tolerance);
  expect(inner!.right).toBeLessThanOrEqual(outer!.right + tolerance);
  expect(inner!.bottom).toBeLessThanOrEqual(outer!.bottom + tolerance);
  expect(inner!.width).toBeGreaterThan(0);
  expect(inner!.height).toBeGreaterThan(0);
}

function expectSameRect(first: Rect | null, second: Rect | null) {
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  for (const key of ["left", "top", "right", "bottom"] as const) {
    expect(Math.abs(first![key] - second![key])).toBeLessThanOrEqual(0.5);
  }
}

test.describe("GVO_FIELD_004R responsive gates", () => {
  test.describe.configure({ timeout: 240_000 });

  test("Portada mantiene contrato local marco/interior en toda la matriz", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const viewport of coverViewports) {
      await page.setViewportSize(viewport);
      await openFreshCover(page);
      await page.locator(".cover-intro__cta").scrollIntoViewIfNeeded();
      const initialGeometry = await readCoverGeometry(page);
      expect(initialGeometry.portals).toHaveLength(0);
      await openRevisitCover(page);
      const geometry = await readCoverGeometry(page);
      const viewportRect: Rect = {
        bottom: viewport.height,
        height: viewport.height,
        left: 0,
        right: viewport.width,
        top: 0,
        width: viewport.width,
      };

      expect(geometry.horizontalOverflow, viewport.name).toBeLessThanOrEqual(1);
      expect(geometry.portals, viewport.name).toHaveLength(5);
      expectInside(initialGeometry.cta, viewportRect);

      for (const portal of geometry.portals) {
        expectInside(portal.portal, geometry.stage);
        expectInside(portal.art, portal.portal);
        expectSameRect(portal.frame, portal.art);
        expectInside(portal.interior, portal.art);
        expect(portal.artAspectRatio).toBe("941 / 1672");
        expect(portal.artTransformOrigin).not.toBe("0px 0px");
        expect(portal.frameObjectFit).toBe("contain");
        expect(portal.interiorObjectFit).toBe("cover");
      }
    }
  });

  test("diálogo permanece completamente utilizable en anchors representativos", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const viewport of representativeViewports) {
      await page.setViewportSize(viewport);
      await openFreshCover(page);
      await page.getByRole("button", { name: "Empieza aquí" }).click();
      await page.locator("[role='dialog']").waitFor({ state: "visible" });
      const geometry = await readCoverGeometry(page);
      const viewportRect: Rect = {
        bottom: viewport.height,
        height: viewport.height,
        left: 0,
        right: viewport.width,
        top: 0,
        width: viewport.width,
      };
      expectInside(geometry.dialogue, viewportRect);
      expect(geometry.horizontalOverflow, viewport.name).toBeLessThanOrEqual(1);
    }
  });

  test("rutas principales no introducen overflow horizontal", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    // Reduced-motion transitions can finish before the next automation IPC.
    // Capture their ready geometry in the browser where that frame occurs.
    await page.addInitScript(() => {
      const expectedRoute = location.pathname;
      if (!expectedRoute.startsWith("/transition/")) return;
      const scope = window as typeof window & {
        __gvoField004TransitionGeometry?: {
          actualRoute: string;
          horizontalOverflow: number;
          horizontallyLostControls: number;
          main: { width: number; height: number };
        };
      };
      const recordReadyGeometry = () => {
        if (
          location.pathname !== expectedRoute ||
          document.fonts.status !== "loaded"
        )
          return;
        if (
          !document.querySelector(
            "main[data-transition-world-id][data-critical-assets-ready='true']",
          )
        )
          return;
        const root = document.documentElement;
        const main = document.querySelector("main")!.getBoundingClientRect();
        const horizontallyLostControls = Array.from(
          document.querySelectorAll<HTMLElement>(
            "button, a[href], input, select, textarea, [role='button']",
          ),
        ).filter((element) => {
          const style = getComputedStyle(element);
          const bounds = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) > 0 &&
            bounds.width > 0 &&
            bounds.height > 0 &&
            (bounds.right < -1 || bounds.left > innerWidth + 1)
          );
        }).length;
        scope.__gvoField004TransitionGeometry = {
          actualRoute: location.pathname,
          horizontalOverflow: root.scrollWidth - root.clientWidth,
          horizontallyLostControls,
          main: { width: main.width, height: main.height },
        };
        observer.disconnect();
      };
      const observer = new MutationObserver(recordReadyGeometry);
      observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-critical-assets-ready"],
      });
      void document.fonts.ready.then(recordReadyGeometry);
      document.fonts.addEventListener("loadingdone", recordReadyGeometry, {
        once: true,
      });
    });
    await page.addInitScript(
      ({ key, progress }) => {
        localStorage.setItem(key, JSON.stringify(progress));
      },
      { key: progressKey, progress: completeProgress },
    );

    for (const viewport of representativeViewports) {
      await page.setViewportSize(viewport);
      for (const route of journeyRoutes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        if (!route.startsWith("/transition/"))
          await waitForRouteReady(page, route);
        // Observe readiness and geometry in one browser task, before a timed
        // transition can advance between separate automation round trips.
        const geometry = await page
          .waitForFunction(
            (expectedRoute) => {
              if (expectedRoute.startsWith("/transition/")) {
                const recorded = (
                  window as typeof window & {
                    __gvoField004TransitionGeometry?: {
                      actualRoute: string;
                      horizontalOverflow: number;
                      horizontallyLostControls: number;
                      main: { width: number; height: number };
                    };
                  }
                ).__gvoField004TransitionGeometry;
                return recorded?.actualRoute === expectedRoute
                  ? recorded
                  : false;
              }
              if (
                location.pathname !== expectedRoute ||
                document.fonts.status !== "loaded"
              )
                return false;
              const root = document.documentElement;
              const main = document
                .querySelector("main")
                ?.getBoundingClientRect();
              const horizontallyLostControls = Array.from(
                document.querySelectorAll<HTMLElement>(
                  "button, a[href], input, select, textarea, [role='button']",
                ),
              )
                .filter((element) => {
                  const style = getComputedStyle(element);
                  const bounds = element.getBoundingClientRect();
                  return (
                    style.display !== "none" &&
                    style.visibility !== "hidden" &&
                    Number(style.opacity) > 0 &&
                    bounds.width > 0 &&
                    bounds.height > 0
                  );
                })
                .filter((element) => {
                  const bounds = element.getBoundingClientRect();
                  return bounds.right < -1 || bounds.left > innerWidth + 1;
                }).length;
              return {
                actualRoute: location.pathname,
                horizontalOverflow: root.scrollWidth - root.clientWidth,
                horizontallyLostControls,
                main: main
                  ? { width: main.width, height: main.height }
                  : { width: 0, height: 0 },
              };
            },
            route,
            { timeout: 15_000 },
          )
          .catch((error: unknown) => {
            throw new Error(
              `${viewport.name} ${route}: ready geometry was not observed`,
              { cause: error },
            );
          });
        const audit = await geometry.jsonValue();
        await geometry.dispose();
        if (!audit) throw new Error("Route geometry was not observed");

        expect(audit.actualRoute, `${viewport.name} ${route}`).toBe(route);
        expect(
          audit.horizontalOverflow,
          `${viewport.name} ${route}`,
        ).toBeLessThanOrEqual(1);
        expect(
          audit.horizontallyLostControls,
          `${viewport.name} ${route}`,
        ).toBe(0);
        expect(audit.main.width, `${viewport.name} ${route}`).toBeGreaterThan(
          0,
        );
        expect(audit.main.height, `${viewport.name} ${route}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  for (const cycle of [
    {
      name: "375x667-667x375-375x667",
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 },
    },
    {
      name: "390x844-844x390-390x844",
      portrait: { width: 390, height: 844 },
      landscape: { width: 844, height: 390 },
    },
  ] as const) {
    test(`recupera geometría tras orientación ${cycle.name}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize(cycle.portrait);
      await openFreshCover(page);
      await page.getByRole("button", { name: "Empieza aquí" }).click();
      await page.locator("[role='dialog']").waitFor({ state: "visible" });
      const before = await readCoverGeometry(page);

      await page.setViewportSize(cycle.landscape);
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const landscape = await readCoverGeometry(page);
      expect(landscape.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(landscape.portals).toHaveLength(0);
      expect(landscape.dialogue).not.toBeNull();
      for (const portal of landscape.portals) {
        expectInside(portal.interior, portal.art);
      }

      await page.setViewportSize(cycle.portrait);
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const recovered = await readCoverGeometry(page);
      expect(recovered.horizontalOverflow).toBeLessThanOrEqual(1);
      expect(recovered.portals).toHaveLength(0);
      expectSameRect(recovered.stage, before.stage);
      expectSameRect(recovered.dialogue, before.dialogue);
      recovered.portals.forEach((portal, index) => {
        expectSameRect(portal.portal, before.portals[index].portal);
        expectSameRect(portal.art, before.portals[index].art);
        expectInside(portal.interior, portal.art);
      });
    });
  }
});
