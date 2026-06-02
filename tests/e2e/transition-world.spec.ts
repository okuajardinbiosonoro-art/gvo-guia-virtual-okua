import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const transitionWorldOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "transition-world",
  "validation",
  "t003e7c",
);

test.beforeAll(() => {
  mkdirSync(transitionWorldOutputDir, { recursive: true });
});

test("preview tecnico de transicion entre mundos conserva base no interactiva", async ({
  page,
}) => {
  await page.goto("/dev/transition-world");

  await expect(
    page.getByRole("heading", { name: "Abriendo Mundo I: Raíz..." }),
  ).toBeVisible();
  await expect(page.getByText("Preparando recorrido...")).toBeVisible();
  await expect(page.getByTestId("transition-world-background-real")).toBeVisible();
  await expect(page.getByTestId("transition-world-sparkles")).toBeVisible();
  await expect(page.getByTestId("transition-world-sparkle")).toHaveCount(8);
  await expect(page.getByTestId("transition-world-portal")).toBeVisible();
  await expect(page.getByTestId("transition-world-portal-inactive")).toBeVisible();
  await expect(
    page.getByTestId("transition-world-portal-activating"),
  ).toBeVisible();
  await expect(page.getByTestId("transition-world-portal-real")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-sprite")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-real")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-guide")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-exit")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByTestId("transition-world-progress-real")).toBeVisible();
  await expect(page.getByTestId("transition-world-progress-track")).toBeVisible();
  await expect(page.getByTestId("transition-world-progress-fill")).toBeVisible();
  await expect(page.getByTestId("transition-world-progress-spark")).toBeVisible();
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("a")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.getByText(/Cargando assets/i)).toHaveCount(0);
  await expect(page.getByText(/\d+%/)).toHaveCount(0);

  const loadedImages = await page
    .locator(
      [
        '[data-testid="transition-world-background-real"] img',
        '[data-testid="transition-world-portal-real"] img',
        '[data-testid="transition-world-progress-real"] img',
      ].join(","),
    )
    .evaluateAll((images) =>
      images.map((image) => ({
        complete: (image as HTMLImageElement).complete,
        naturalWidth: (image as HTMLImageElement).naturalWidth,
      })),
    );

  expect(loadedImages.length).toBeGreaterThanOrEqual(3);
  for (const image of loadedImages) {
    expect(image.complete).toBe(true);
    expect(image.naturalWidth).toBeGreaterThan(0);
  }

  const liaBackgrounds = await page
    .locator(
      [
        '[data-testid="transition-world-lia-real"]',
        '[data-testid="transition-world-lia-guide"]',
        '[data-testid="transition-world-lia-exit"]',
      ].join(","),
    )
    .evaluateAll((layers) =>
      layers.map((layer) => ({
        asset: layer.getAttribute("data-asset-id"),
        frameCount: layer.getAttribute("data-frame-count"),
        backgroundImage: getComputedStyle(layer).backgroundImage,
      })),
    );

  expect(liaBackgrounds).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        asset: "lia_transition_root_idle_4f",
        frameCount: "4",
      }),
      expect.objectContaining({
        asset: "lia_transition_root_guide_2f",
        frameCount: "2",
      }),
      expect.objectContaining({
        asset: "lia_transition_root_exit_1f",
        frameCount: "1",
      }),
    ]),
  );

  for (const layer of liaBackgrounds) {
    expect(layer.backgroundImage).toContain("lia_transition_root");
  }

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );

  expect(hasHorizontalOverflow).toBe(false);

  const routeData = await page.locator("main").evaluate((element) => ({
    version: element.getAttribute("data-transition-world-version"),
    id: element.getAttribute("data-transition-world-id"),
    fromRoute: element.getAttribute("data-transition-from-route"),
    toRoute: element.getAttribute("data-transition-to-route"),
    durationMs: element.getAttribute("data-duration-ms"),
    reducedMotionDurationMs: element.getAttribute(
      "data-reduced-motion-duration-ms",
    ),
    motionMode: element.getAttribute("data-motion-mode"),
    motionState: element.getAttribute("data-motion-state"),
  }));

  expect(routeData).toEqual({
    version: "T003E7C_TYPOGRAPHY_TOKENS",
    id: "intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/mundo-i-raiz",
    durationMs: "2300",
    reducedMotionDurationMs: "1000",
    motionMode: "css-timeline",
    motionState: "preview-sequence",
  });

  const motionGeometry = await page.evaluate(() => {
    const portal = document.querySelector(
      '[data-testid="transition-world-portal"]',
    )?.getBoundingClientRect();
    const lia = document.querySelector(
      '[data-testid="transition-world-lia-sprite"]',
    )?.getBoundingClientRect();
    const progress = document.querySelector(
      '[data-testid="transition-world-progress-real"]',
    )?.getBoundingClientRect();
    const spark = document.querySelector(
      '[data-testid="transition-world-progress-spark"]',
    )?.getBoundingClientRect();

    return {
      liaCenterX: lia ? lia.left + lia.width / 2 : null,
      portalCenterX: portal ? portal.left + portal.width / 2 : null,
      progressCenterY: progress ? progress.top + progress.height / 2 : null,
      sparkCenterY: spark ? spark.top + spark.height / 2 : null,
    };
  });

  expect(motionGeometry.liaCenterX).not.toBeNull();
  expect(motionGeometry.portalCenterX).not.toBeNull();
  expect(motionGeometry.sparkCenterY).not.toBeNull();
  expect(motionGeometry.progressCenterY).not.toBeNull();
  expect(motionGeometry.liaCenterX as number).toBeLessThan(
    motionGeometry.portalCenterX as number,
  );
  expect(
    Math.abs(
      (motionGeometry.sparkCenterY as number) -
        (motionGeometry.progressCenterY as number),
    ),
  ).toBeLessThanOrEqual(6);

  const sparkleData = await page
    .locator('[data-testid="transition-world-sparkle"]')
    .evaluateAll((sparkles) =>
      sparkles.map((sparkle) => ({
        slot: sparkle.getAttribute("data-transition-sparkle-slot"),
        loadingSlot: sparkle.getAttribute("data-loading-sparkle-slot"),
        assetId: sparkle.getAttribute("data-asset-id"),
        runtimeAsset: sparkle.getAttribute("data-runtime-asset"),
        pointerEvents: getComputedStyle(sparkle).pointerEvents,
        width: Math.round(parseFloat(getComputedStyle(sparkle).width)),
        height: Math.round(parseFloat(getComputedStyle(sparkle).height)),
      })),
    );

  expect(sparkleData).toHaveLength(8);
  expect(sparkleData.map((sparkle) => sparkle.slot)).toEqual([
    "sparkle-lilac-upper-left",
    "sparkle-amber-upper-right",
    "sparkle-white-upper-air",
    "sparkle-white-middle-left",
    "sparkle-amber-middle-right",
    "sparkle-lilac-lower-left",
    "sparkle-lilac-lower-right",
    "sparkle-lilac-bottom-right",
  ]);
  for (const sparkle of sparkleData) {
    expect(sparkle.assetId).toMatch(/^sparkle_0[1-4]_/);
    expect(sparkle.runtimeAsset).toContain(
      "/assets/runtime/loading-initial/sparkles/",
    );
    expect(sparkle.pointerEvents).toBe("none");
    expect(sparkle.width).toBeGreaterThanOrEqual(12);
    expect(sparkle.height).toBeGreaterThanOrEqual(12);
  }

  await page.waitForTimeout(2400);
  await expect(page).toHaveURL(/\/dev\/transition-world$/);
});

test("genera capturas de revision visual T003E7C en mobile", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/dev/transition-world");
    await expect(
      page.getByRole("heading", { name: "Abriendo Mundo I: Raíz..." }),
    ).toBeVisible();
    await expect(page.getByTestId("transition-world-portal-real")).toBeVisible();
    await expect(page.getByTestId("transition-world-lia-real")).toBeVisible();
    await page.waitForTimeout(120);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003e7c-start-${viewport.width}x${viewport.height}.png`,
      ),
    });
    await page.waitForTimeout(980);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003e7c-mid-${viewport.width}x${viewport.height}.png`,
      ),
    });
    await page.waitForTimeout(1300);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003e7c-final-${viewport.width}x${viewport.height}.png`,
      ),
    });
  }
});
