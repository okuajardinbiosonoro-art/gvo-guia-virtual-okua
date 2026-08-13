import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  expect,
  test,
  type Frame,
  type Locator,
  type Page,
} from "@playwright/test";

const EVIDENCE_DIRECTORY = path.resolve("test-results/evidence/gvo-debt-007a");
const SCREENSHOT_DIRECTORY = path.join(EVIDENCE_DIRECTORY, "screenshots-after");
const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";

const VIEWPORTS = [
  { name: "portrait-360x640", width: 360, height: 640 },
  { name: "portrait-390x844", width: 390, height: 844 },
  { name: "portrait-412x915", width: 412, height: 915 },
  { name: "landscape-844x390", width: 844, height: 390 },
  { name: "landscape-915x412", width: 915, height: 412 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "desktop-1280x720", width: 1280, height: 720 },
] as const;

const REVIEW_ROUTES = [
  { path: "/estacion/1", world: 1 },
  { path: "/estacion/2", world: 2 },
  { path: "/estacion/3", world: 3 },
  { path: "/estacion/4", world: 4 },
  { path: "/estacion/5", world: 5 },
  { path: "/estacion/5/plantas", world: 5 },
  { path: "/estacion/5/sistema", world: 5 },
  { path: "/estacion/5/espacio", world: 5 },
  { path: "/estacion/5/visitante", world: 5 },
] as const;

const SCREENSHOT_CASES = new Map([
  ["portrait-390x844:/estacion/1", "world1-portrait.png"],
  ["portrait-390x844:/estacion/2", "world2-portrait.png"],
  ["landscape-844x390:/estacion/2", "world2-landscape.png"],
  ["portrait-390x844:/estacion/3", "world3-portrait.png"],
  ["portrait-390x844:/estacion/4", "world4-portrait-reserved.png"],
  ["landscape-844x390:/estacion/4", "world4-landscape.png"],
  ["portrait-390x844:/estacion/5", "world5-overview-portrait.png"],
  ["portrait-390x844:/estacion/5/plantas", "world5-subroute-portrait.png"],
  ["tablet-768x1024:/estacion/2", "tablet-portrait.png"],
  ["desktop-1280x720:/estacion/5", "desktop-landscape.png"],
]);

type Rect = Readonly<{
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}>;

type CollisionEntry = Readonly<{
  intersectionArea: number;
  rect: Rect;
  selector: string;
  tag: string;
  text: string;
}>;

async function seedCompletedJourney(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ globalKey, world5Key }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        globalKey,
        JSON.stringify({
          completedStations: [1, 2, 3, 4, 5],
          schemaVersion: 1,
          updatedAt: "2026-08-06T12:00:00.000Z",
        }),
      );
      localStorage.setItem(
        world5Key,
        JSON.stringify({
          completedAreas: ["plantas", "sistema", "espacio", "visitante"],
          schemaVersion: 1,
          updatedAt: "2026-08-06T12:00:00.000Z",
        }),
      );
    },
    { globalKey: GLOBAL_PROGRESS_KEY, world5Key: WORLD5_PROGRESS_KEY },
  );
}

async function startReview(page: Page, world: number) {
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  const access = page.locator(`[data-final-review-world="${world}"]`);
  await expect(access).toBeVisible({ timeout: 20_000 });
  await access.click();
  await expect(page.locator('[data-final-review-active="true"]')).toBeVisible();
}

async function openReviewRoute(page: Page, world: number, route: string) {
  await startReview(page, world);
  if (!page.url().endsWith(route)) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('[data-final-review-active="true"]'),
    ).toBeVisible();
  }
}

async function expectRectInsideViewport(page: Page, locator: Locator) {
  const rect = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(rect).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.y).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(viewport!.width + 0.5);
  expect(rect!.y + rect!.height).toBeLessThanOrEqual(viewport!.height + 0.5);
}

async function measureReviewGeometry(page: Page, route: string) {
  return page.evaluate((routePath) => {
    const layout = document.querySelector<HTMLElement>(
      '.final-review-mode-layout[data-final-review-active="true"]',
    );
    const dock = document.querySelector<HTMLElement>(
      '[data-final-review-dock="active"]',
    );
    const control = document.querySelector<HTMLElement>(
      '[data-final-review-return="active"]',
    );
    if (!layout || !dock || !control) {
      throw new Error("Active review layout, dock or control missing");
    }

    const toRect = (rect: DOMRect): Rect => ({
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    });
    const controlRect = control.getBoundingClientRect();
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        'button, a[href], h1, h2, h3, [role="button"], [role="heading"], [tabindex="0"], input, [aria-live]',
      ),
    ).filter((element) => {
      if (element === control || control.contains(element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < innerHeight &&
        rect.left < innerWidth
      );
    });
    const controls: CollisionEntry[] = candidates.map((element) => {
      const rect = element.getBoundingClientRect();
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
        intersectionArea: width * height,
        rect: toRect(rect),
        selector:
          element.getAttribute("data-world2-layer") ??
          element.getAttribute("data-station3-record") ??
          element.getAttribute("data-station4-node") ??
          element.getAttribute("data-station5-area") ??
          element.getAttribute("data-station5-action") ??
          element.getAttribute("data-world1-root-node") ??
          element.getAttribute("data-world1-exit-target") ??
          (typeof element.className === "string"
            ? element.className
            : element.tagName.toLowerCase()),
        tag: element.tagName.toLowerCase(),
        text: (element.getAttribute("aria-label") ?? element.textContent ?? "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 120),
      };
    });
    const layoutStyle = getComputedStyle(layout);
    const dockStyle = getComputedStyle(dock);
    const controlStyle = getComputedStyle(control);
    const layoutRect = layout.getBoundingClientRect();
    const reservedBlockSize =
      layout.dataset.finalReviewClearanceMode === "reserved"
        ? Number.parseFloat(layoutStyle.gridTemplateRows) || 0
        : 0;

    return {
      route: routePath,
      viewport: {
        height: innerHeight,
        orientation: innerWidth >= innerHeight ? "landscape" : "portrait",
        width: innerWidth,
      },
      visualViewport: window.visualViewport
        ? {
            height: window.visualViewport.height,
            offsetLeft: window.visualViewport.offsetLeft,
            offsetTop: window.visualViewport.offsetTop,
            width: window.visualViewport.width,
          }
        : null,
      placement: dock.dataset.finalReviewDockPlacement,
      clearanceMode: layout.dataset.finalReviewClearanceMode,
      layoutRect: toRect(layoutRect),
      dockRect: toRect(dock.getBoundingClientRect()),
      controlRect: toRect(controlRect),
      occupiedArea: {
        dock: controlRect.width * controlRect.height,
        reserved: reservedBlockSize * layoutRect.width,
        reservedBlockSize,
      },
      clearance: {
        bottom: layoutStyle.getPropertyValue(
          "--gvo-final-review-clearance-bottom",
        ),
        gridRows: layoutStyle.gridTemplateRows,
        left: layoutStyle.getPropertyValue("--gvo-final-review-clearance-left"),
        right: layoutStyle.getPropertyValue(
          "--gvo-final-review-clearance-right",
        ),
        top: layoutStyle.getPropertyValue("--gvo-final-review-clearance-top"),
      },
      pointerEvents: {
        dock: dockStyle.pointerEvents,
        control: controlStyle.pointerEvents,
      },
      controlStyle: {
        display: controlStyle.display,
        minBlockSize: controlStyle.minBlockSize,
        minInlineSize: controlStyle.minInlineSize,
        overflowWrap: controlStyle.overflowWrap,
        zIndex: dockStyle.zIndex,
      },
      scroll: {
        bodyWidth: document.body.scrollWidth,
        documentWidth: document.documentElement.scrollWidth,
      },
      controls,
      collisions: controls.filter((item) => item.intersectionArea > 0),
    };
  }, route);
}

async function assertRouteCriticalControls(page: Page, route: string) {
  if (route === "/estacion/1") {
    await expect(page.locator("[data-world1-root-node]")).toHaveCount(3);
  } else if (route === "/estacion/2") {
    await expect(page.locator(".world2-layer-nav")).toBeVisible();
    await expect(page.locator("[data-world2-layer]")).toHaveCount(6);
  } else if (route === "/estacion/3") {
    await expect(
      page.locator(".s3-page--base [data-station3-record]"),
    ).toHaveCount(3);
  } else if (route === "/estacion/4") {
    await expect(page.locator("[data-station4-node]")).toHaveCount(8);
    await expect(
      page.locator('[data-gvo-immersive-control="fullscreen"]'),
    ).toBeVisible();
  } else if (route === "/estacion/5") {
    await expect(page.locator("[data-station5-area]")).toHaveCount(4);
  } else {
    await expect(
      page.locator('[data-station5-scene][aria-hidden="false"]'),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Volver al mapa" }),
    ).toBeVisible();
  }
}

test.describe.configure({ mode: "serial" });
test.setTimeout(180_000);

for (const viewport of VIEWPORTS) {
  test(`matriz geométrica ${viewport.name}: nueve rutas sin colisión`, async ({
    page,
  }) => {
    const matrix: unknown[] = [];
    await mkdir(SCREENSHOT_DIRECTORY, { recursive: true });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await seedCompletedJourney(page);

    let activeWorld: number | null = null;
    for (const route of REVIEW_ROUTES) {
      if (activeWorld !== route.world) {
        await openReviewRoute(page, route.world, route.path);
        activeWorld = route.world;
      } else {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await expect(
          page.locator('[data-final-review-active="true"]'),
        ).toBeVisible();
      }
      await page.waitForTimeout(250);

      const control = page.locator('[data-final-review-return="active"]');
      const dock = page.locator('[data-final-review-dock="active"]');
      await expect(control).toBeVisible();
      await expect(dock).toHaveAttribute(
        "data-final-review-dock-placement",
        viewport.width >= viewport.height || route.world === 4
          ? "top-start"
          : (route.world === 2 && viewport.width <= 412) ||
              (route.world === 3 && viewport.width <= 360)
            ? "below-end"
            : "top-end",
      );
      const expectedClearanceMode =
        (route.world === 2 && viewport.width >= viewport.height) ||
        (route.world === 4 && viewport.width < viewport.height) ||
        (route.world === 5 && viewport.width >= viewport.height)
          ? "reserved"
          : "floating";
      await expect(
        page.locator('[data-final-review-active="true"]'),
      ).toHaveAttribute(
        "data-final-review-clearance-mode",
        expectedClearanceMode,
      );
      await expectRectInsideViewport(page, control);
      await assertRouteCriticalControls(page, route.path);

      const geometry = await measureReviewGeometry(page, route.path);
      expect(geometry.controlRect.width).toBeGreaterThanOrEqual(44);
      expect(geometry.controlRect.height).toBeGreaterThanOrEqual(44);
      expect(geometry.collisions, `${viewport.name} ${route.path}`).toEqual([]);
      expect(geometry.pointerEvents).toEqual({ dock: "none", control: "auto" });
      expect(geometry.controlStyle.display).not.toBe("none");
      expect(geometry.scroll.documentWidth).toBeLessThanOrEqual(
        viewport.width + 1,
      );
      expect(geometry.scroll.bodyWidth).toBeLessThanOrEqual(viewport.width + 1);
      expect(geometry.clearanceMode).toBe(expectedClearanceMode);
      expect(geometry.occupiedArea.reservedBlockSize).toBe(
        expectedClearanceMode === "reserved" ? 66 : 0,
      );
      matrix.push({
        phase: "compact-final",
        viewport: viewport.name,
        ...geometry,
      });

      const screenshotName = SCREENSHOT_CASES.get(
        `${viewport.name}:${route.path}`,
      );
      if (screenshotName) {
        await page.screenshot({
          animations: "disabled",
          path: path.join(SCREENSHOT_DIRECTORY, screenshotName),
        });
      }
    }

    await writeFile(
      path.join(EVIDENCE_DIRECTORY, `after-${viewport.name}.json`),
      `${JSON.stringify(matrix, null, 2)}\n`,
      "utf8",
    );
  });
}

test("Mundo II conserva nav, Captura y CTA accionables durante revisita", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await seedCompletedJourney(page);
  await openReviewRoute(page, 2, "/estacion/2");

  const nav = page.locator(".world2-layer-nav");
  const layerButtons = page.locator("[data-world2-layer]");
  await expect(nav).toBeVisible();
  await expect(layerButtons).toHaveCount(6);
  for (const button of await layerButtons.all()) {
    await expect(button).toBeVisible();
    await expectRectInsideViewport(page, button);
  }

  await page.locator('[data-world2-layer="captura"]').click();
  const timeline = page.locator('[data-world2-capture-timeline="016R"]');
  await expect(timeline).toBeVisible();
  const step = page.locator('[data-world2-capture-control="signal"]');
  await expect(step).toBeVisible();
  await expect(
    page.locator('[data-final-review-active="true"]'),
  ).toHaveAttribute("data-final-review-clearance-mode", "reserved");
  await expect(
    page.locator('[data-final-review-dock="active"]'),
  ).toHaveAttribute("data-final-review-dock-placement", "top-end");
  await mkdir(SCREENSHOT_DIRECTORY, { recursive: true });
  await page.screenshot({
    animations: "disabled",
    path: path.join(
      SCREENSHOT_DIRECTORY,
      "world2-capture-portrait-reserved.png",
    ),
  });
  await step.click();
  await expect(timeline).toHaveAttribute("data-world2-capture-step", "signal");
  expect(
    (await measureReviewGeometry(page, "/estacion/2#captura")).collisions,
  ).toEqual([]);

  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeVisible();
  await expect(
    page.locator('[data-final-review-active="true"]'),
  ).toHaveAttribute("data-final-review-clearance-mode", "floating");
  await expect(
    page.locator('[data-final-review-dock="active"]'),
  ).toHaveAttribute("data-final-review-dock-placement", "below-end");
  expect(
    (await measureReviewGeometry(page, "/estacion/2#resultado_mediado"))
      .collisions,
  ).toEqual([]);
});

test("teclado Enter y Space vuelven una sola vez y limpian contexto", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await seedCompletedJourney(page);

  for (const key of ["Enter", "Space"] as const) {
    await openReviewRoute(page, 1, "/estacion/1");
    const returnControl = page.locator('[data-final-review-return="active"]');
    await returnControl.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(returnControl).toBeFocused();
    const outline = await returnControl.evaluate((element) => {
      const style = getComputedStyle(element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline.style).not.toBe("none");
    expect(Number.parseFloat(outline.width)).toBeGreaterThan(0);

    let finalNavigations = 0;
    const listener = (frame: Frame) => {
      if (frame.url().endsWith("/final")) finalNavigations += 1;
    };
    page.on("framenavigated", listener);
    await page.keyboard.press(key);
    await expect(page).toHaveURL(/\/final$/);
    page.off("framenavigated", listener);
    expect(finalNavigations).toBe(1);
    expect(
      await page.evaluate(
        (storageKey) => sessionStorage.getItem(storageKey),
        REVIEW_CONTEXT_KEY,
      ),
    ).toBeNull();
  }
});

test("reload conserva dock; entrada normal e inválida mantienen clearance cero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await seedCompletedJourney(page);
  await openReviewRoute(page, 3, "/estacion/3");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator('[data-final-review-dock="active"]')).toBeVisible();

  for (const route of REVIEW_ROUTES.filter(
    (candidate, index, routes) =>
      routes.findIndex(({ world }) => world === candidate.world) === index,
  )) {
    await page.goto("/final", { waitUntil: "domcontentloaded" });
    await page.evaluate((storageKey) => {
      sessionStorage.removeItem(storageKey);
    }, REVIEW_CONTEXT_KEY);
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    const normalLayout = page.locator(".final-review-mode-layout");
    await expect(normalLayout).toHaveAttribute(
      "data-final-review-active",
      "false",
    );
    await expect(page.locator("[data-final-review-dock]")).toHaveCount(0);
    expect(
      await normalLayout.evaluate((element) => {
        const style = getComputedStyle(element);
        return ["top", "right", "bottom", "left"].map((side) =>
          style.getPropertyValue(`--gvo-final-review-clearance-${side}`),
        );
      }),
    ).toEqual(["0px", "0px", "0px", "0px"]);
  }

  await page.evaluate((storageKey) => {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        mode: "final-review",
        origin: "/final",
        startedAt: "2026-08-06T12:00:00.000Z",
        timestamp: 1_785_849_600_000,
        version: 1,
        world: 2,
      }),
    );
  }, REVIEW_CONTEXT_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-final-review-dock]")).toHaveCount(0);
  expect(
    await page.evaluate(
      (storageKey) => sessionStorage.getItem(storageKey),
      REVIEW_CONTEXT_KEY,
    ),
  ).toBeNull();
});

test("reflow equivalente a 320 CSS px permanece visible y sin overflow", async ({
  page,
}) => {
  await mkdir(SCREENSHOT_DIRECTORY, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 640 });
  await seedCompletedJourney(page);
  await openReviewRoute(page, 2, "/estacion/2");

  const control = page.locator('[data-final-review-return="active"]');
  await expect(control).toBeVisible();
  await expectRectInsideViewport(page, control);
  const geometry = await measureReviewGeometry(page, "/estacion/2#reflow-320");
  expect(geometry.collisions).toEqual([]);
  expect(geometry.scroll.documentWidth).toBeLessThanOrEqual(321);
  expect(geometry.scroll.bodyWidth).toBeLessThanOrEqual(321);
  await expect(page.locator(".world2-layer-nav")).toBeVisible();
  await page.screenshot({
    animations: "disabled",
    path: path.join(SCREENSHOT_DIRECTORY, "zoom-reflow-320.png"),
  });
});

test("CSS conserva safe-area, target mínimo y dock no bloqueante", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedCompletedJourney(page);
  await openReviewRoute(page, 1, "/estacion/1");

  const contract = await page.evaluate(() => {
    const css = Array.from(document.styleSheets)
      .flatMap((sheet) => {
        try {
          return Array.from(sheet.cssRules, (rule) => rule.cssText);
        } catch {
          return [];
        }
      })
      .join("\n");
    return {
      hasDisplayNoneResolution:
        /final-review-return-(?:dock|control)[^{]*\{[^}]*display:\s*none/i.test(
          css,
        ),
      hasSafeAreaBottom: css.includes("env(safe-area-inset-bottom"),
      hasSafeAreaLeft: css.includes("env(safe-area-inset-left"),
      hasSafeAreaRight: css.includes("env(safe-area-inset-right"),
      hasSafeAreaTop: css.includes("env(safe-area-inset-top"),
    };
  });

  expect(contract).toEqual({
    hasDisplayNoneResolution: false,
    hasSafeAreaBottom: true,
    hasSafeAreaLeft: true,
    hasSafeAreaRight: true,
    hasSafeAreaTop: true,
  });
});
