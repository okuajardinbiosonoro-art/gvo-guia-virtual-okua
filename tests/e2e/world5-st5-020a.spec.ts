import { expect, test } from "@playwright/test";

const viewports = [
  [360, 560], [360, 640], [375, 559], [375, 667], [390, 650], [390, 844],
  [430, 740], [430, 932], [768, 1024], [1024, 768], [844, 390], [1440, 900],
] as const;

test("ST5-020A recorre y persiste solo Plantas sin red externa", async ({ page }) => {
  const consoleErrors: string[] = [];
  const externalRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(`${message.location().url}: ${message.text()}`);
  });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4174")) externalRequests.push(request.url());
  });

  await page.goto("/estacion/5");
  const sectors = page.locator("[data-station5-area]");
  await expect(sectors).toHaveCount(4);
  await expect(page.locator('[data-station5-area="plantas"]')).toBeEnabled();
  await expect(page.locator('[data-station5-area="sistema"]')).toBeEnabled();
  await expect(page.locator('[data-station5-area="sistema"]')).toHaveAttribute("data-area-state", "locked");
  await expect(page.locator('[data-station5-area="espacio"]')).toBeEnabled();
  await expect(page.locator('[data-station5-area="visitante"]')).toBeEnabled();
  await expect(page.locator('[data-runtime-asset$="world5_map_environment_portrait_v01.webp"]')).toHaveCount(1);

  await page.locator('[data-station5-area="plantas"]').click();
  await expect(page).toHaveURL(/\/estacion\/5\/plantas$/);
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "plants_intro");
  await expect(page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." })).toHaveCount(1);

  await page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }).click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "plants_resolved");
  await expect(page.getByRole("status")).toContainText("Vitalidad reconocida");
  await expect(page.getByRole("button", { name: "Volver al mapa" })).toBeEnabled();

  const stored = await page.evaluate(() => ({
    station5: window.localStorage.getItem("gvo.station5.v1"),
    global: window.localStorage.getItem("gvo.progress.v1"),
  }));
  expect(JSON.parse(stored.station5 ?? "{}").completedAreas).toEqual(["plantas"]);
  expect(stored.global).toBeNull();

  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_overview");
  await expect(page.locator('[data-station5-area="plantas"]')).toBeFocused();
  await expect(page.locator('[data-station5-area="sistema"]')).toBeEnabled();

  await page.goto("/estacion/5/plantas", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "plants_resolved");
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("ST5-020A refluye en viewports requeridos y conserva controles de 44 px", async ({ page }) => {
  await page.goto("/estacion/5");
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      controls: [...document.querySelectorAll("button")].map((button) => {
        const rect = button.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      }),
    }));
    expect(metrics.scrollWidth, `${width}x${height} no debe desbordar horizontalmente`).toBeLessThanOrEqual(metrics.clientWidth);
    expect(Math.min(...metrics.controls), `${width}x${height} debe conservar targets de 44 px`).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('[data-projected-stage="map"] .s5-media-background source[srcset$="world5_map_environment_landscape_v01.webp"]')).toHaveCount(1);
});

test("ST5-020A reduced motion conserva comprensión y persistencia", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-reduced-motion", "true");
  await page.locator('[data-station5-area="plantas"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "plants_intro");
  await page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }).click();
  await expect(page.getByRole("status")).toContainText("Vitalidad reconocida");
  await expect(page.getByRole("button", { name: "Volver al mapa" })).toBeEnabled();
});
