import { expect, test } from "@playwright/test";

const viewports = [
  [360, 640], [390, 844], [430, 932], [768, 1024], [844, 390], [1440, 900],
] as const;

test("ST5-020B recorre Sistema, integra Lía y no usa red externa", async ({ page }) => {
  const consoleErrors: string[] = [];
  const externalRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(`${message.location().url}: ${message.text()}`);
  });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4174")) externalRequests.push(request.url());
  });

  await page.goto("/estacion/5");
  await page.evaluate(() => localStorage.setItem("gvo.station5.v1", JSON.stringify({
    schemaVersion: 1,
    completedAreas: ["plantas"],
    updatedAt: "2026-07-30T12:00:00.000Z",
  })));
  await page.reload();

  await expect(page.locator('[data-station5-area="sistema"]')).toBeEnabled();
  await expect(page.locator('[data-station5-lia="attend"]')).toHaveCount(1);
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page).toHaveURL(/\/estacion\/5\/sistema$/);
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "system_intro");
  await expect(page.getByRole("heading", { name: "Sistema" })).toBeFocused();
  await expect(page.locator('.s5-system-focus [data-runtime-asset$="world5_sub_system_focus_v01.webp"]')).toHaveCount(1);
  await expect(page.locator('[data-station5-lia="explain"]')).toHaveCount(1);

  const connector = page.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." });
  await connector.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "system_resolved");
  await expect(page.getByRole("status")).toContainText("Mediación visible.");
  await expect(page.locator('[data-world5-connection="general"]')).toHaveCount(0);
  await expect(page.locator('[data-station5-lia="explain"]')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Volver al mapa" })).toBeEnabled();

  const stored = await page.evaluate(() => ({
    station5: localStorage.getItem("gvo.station5.v1"),
    global: localStorage.getItem("gvo.progress.v1"),
  }));
  expect(JSON.parse(stored.station5 ?? "{}").completedAreas).toEqual(["plantas", "sistema"]);
  expect(stored.global).toBeNull();

  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_overview");
  await expect(page.locator('[data-station5-area="sistema"]')).toBeFocused();
  await expect(page.locator('[data-station5-area="espacio"]')).toHaveAttribute("data-area-state", "locked");
  await expect(page.locator('[data-station5-area="espacio"]')).toBeEnabled();
  await expect(page.locator("[data-station-complete]")).toHaveAttribute("data-station-complete", "false");
  await page.screenshot({ path: "docs/visual/world5/st5-020b/map_after_system_390x844.png", fullPage: false });

  await page.reload();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_overview");
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("ST5-020B protege Sistema fuera de orden y las rutas futuras", async ({ page }) => {
  await page.goto("/estacion/5/sistema");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.getByRole("status")).toContainText("Completa Plantas");

  await page.goto("/estacion/5/espacio");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.locator('[data-station5-scene="espacio"]')).toHaveCount(0);

  await page.goto("/estacion/5/visitante");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.locator('[data-station5-scene="visitante"]')).toHaveCount(0);
});

test("ST5-020B conserva responsive, targets y background landscape nativo", async ({ page }) => {
  await page.goto("/estacion/5");
  await page.evaluate(() => localStorage.setItem("gvo.station5.v1", JSON.stringify({
    schemaVersion: 1,
    completedAreas: ["plantas"],
    updatedAt: "2026-07-30T12:00:00.000Z",
  })));
  await page.reload();

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      controls: [...document.querySelectorAll("button:not([disabled])")].map((button) => {
        const rect = button.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      }),
    }));
    expect(metrics.scrollWidth, `${width}x${height} sin overflow horizontal`).toBeLessThanOrEqual(metrics.clientWidth);
    expect(Math.min(...metrics.controls), `${width}x${height} conserva targets`).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 844, height: 390 });
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "system_intro");
  await expect(page.locator('[data-projected-stage="system"] .s5-media-background source[srcset$="world5_sub_system_environment_landscape_v01.webp"]')).toHaveCount(1);
  await page.screenshot({ path: "docs/visual/world5/st5-020b/system_844x390.png", fullPage: false });
});

test("ST5-020B reduced motion conserva semántica y persistencia", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await page.evaluate(() => localStorage.setItem("gvo.station5.v1", JSON.stringify({
    schemaVersion: 1,
    completedAreas: ["plantas"],
    updatedAt: "2026-07-30T12:00:00.000Z",
  })));
  await page.reload();
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-reduced-motion", "true");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "system_intro");
  await page.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }).press("Space");
  await expect(page.getByRole("status")).toContainText("Mediación visible.");
  await page.screenshot({ path: "docs/visual/world5/st5-020b/reduced_motion_system_390x844.png", fullPage: false });
});
