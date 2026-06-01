import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

const transitionWorldOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "transition-world",
  "validation",
  "t003c",
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
  await expect(page.getByTestId("transition-world-portal")).toBeVisible();
  await expect(page.getByTestId("transition-world-lia-fallback")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("a")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.getByText(/Cargando assets/i)).toHaveCount(0);

  const routeData = await page.locator("main").evaluate((element) => ({
    version: element.getAttribute("data-transition-world-version"),
    id: element.getAttribute("data-transition-world-id"),
    fromRoute: element.getAttribute("data-transition-from-route"),
    toRoute: element.getAttribute("data-transition-to-route"),
    durationMs: element.getAttribute("data-duration-ms"),
    reducedMotionDurationMs: element.getAttribute(
      "data-reduced-motion-duration-ms",
    ),
  }));

  expect(routeData).toEqual({
    version: "T003C_VISUAL_ALIGNMENT",
    id: "intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/mundo-i-raiz",
    durationMs: "2300",
    reducedMotionDurationMs: "1000",
  });
});

test("genera capturas de revision visual T003C en mobile", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/dev/transition-world");
    await expect(
      page.getByRole("heading", { name: "Abriendo Mundo I: Raíz..." }),
    ).toBeVisible();
    await expect(page.getByTestId("transition-world-portal")).toBeVisible();
    await page.waitForTimeout(2400);
    await page.screenshot({
      fullPage: true,
      path: path.join(
        transitionWorldOutputDir,
        `transition-world-t003c-${viewport.width}x${viewport.height}.png`,
      ),
    });
  }
});
