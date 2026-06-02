import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const transitionWorldOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "transition-world",
  "validation",
  "t003e5",
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
        '[data-testid="transition-world-lia-real"] img',
        '[data-testid="transition-world-lia-guide"] img',
        '[data-testid="transition-world-lia-exit"] img',
        '[data-testid="transition-world-progress-real"] img',
      ].join(","),
    )
    .evaluateAll((images) =>
      images.map((image) => ({
        complete: (image as HTMLImageElement).complete,
        naturalWidth: (image as HTMLImageElement).naturalWidth,
      })),
    );

  expect(loadedImages.length).toBeGreaterThanOrEqual(4);
  for (const image of loadedImages) {
    expect(image.complete).toBe(true);
    expect(image.naturalWidth).toBeGreaterThan(0);
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
    version: "T003E5_MOTION_FOUNDATION",
    id: "intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/mundo-i-raiz",
    durationMs: "2300",
    reducedMotionDurationMs: "1000",
    motionMode: "css-timeline",
    motionState: "preview-sequence",
  });

  await page.waitForTimeout(2400);
  await expect(page).toHaveURL(/\/dev\/transition-world$/);
});

test("genera capturas de revision visual T003E5 en mobile", async ({ page }) => {
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
        `transition-world-t003e5-start-${viewport.width}x${viewport.height}.png`,
      ),
    });
    await page.waitForTimeout(980);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003e5-mid-${viewport.width}x${viewport.height}.png`,
      ),
    });
    await page.waitForTimeout(1300);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003e5-final-${viewport.width}x${viewport.height}.png`,
      ),
    });
  }
});
