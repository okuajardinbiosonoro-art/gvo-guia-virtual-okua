import { expect, test, type Page } from "@playwright/test";

async function seed(page: Page, areas: string[]) {
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await page.evaluate((completedAreas) => {
    localStorage.clear();
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({ schemaVersion: 1, completedAreas, updatedAt: "2026-07-30T12:00:00.000Z" }),
    );
  }, areas);
}

test("ST5-020F completa Espacio desde el recorrido y conserva Visitante protegido", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await seed(page, ["plantas", "sistema"]);
  await page.goto("/estacion/5/espacio", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "space_intro");
  const walkway = page.getByRole("button", { name: "Activar el recorrido de Espacio." });
  await expect(walkway).toBeVisible();
  await walkway.click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "space_resolved");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gvo.station5.v1") ?? "{}").completedAreas)).toEqual(["plantas", "sistema", "espacio"]);
  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_overview");
  await expect(page.locator('[data-station5-area="visitante"]')).toHaveAttribute("data-area-state", "locked");
  await page.locator('[data-station5-area="visitante"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_blocked_feedback");
  await expect(page).toHaveURL(/\/estacion\/5$/);
});

test("ST5-020F mantiene escena, rail y copy visibles a 667x320", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 320 });
  for (const [route, areas, expected] of [
    ["/estacion/5/plantas", [], "plants_intro"],
    ["/estacion/5/sistema", ["plantas"], "system_intro"],
    ["/estacion/5/espacio", ["plantas", "sistema"], "space_intro"],
  ] as const) {
    await seed(page, [...areas]);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", expected);
    const metric = await page.evaluate(() => {
      const stage = document.querySelector(".s5-stage")!.getBoundingClientRect();
      const card = document.querySelector(".s5-story-card")!.getBoundingClientRect();
      const body = [...document.querySelectorAll(".s5-lead,.s5-support,.s5-status-copy")].filter((node) => (node as HTMLElement).checkVisibility());
      return { stageWidth: stage.width, cardWidth: card.width, client: [document.documentElement.clientWidth, document.documentElement.clientHeight], scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight], minFont: Math.min(...body.map((node) => Number.parseFloat(getComputedStyle(node).fontSize))) };
    });
    expect(metric.stageWidth / (metric.stageWidth + metric.cardWidth)).toBeGreaterThanOrEqual(0.58);
    expect(metric.cardWidth).toBeGreaterThanOrEqual(260);
    expect(metric.client).toEqual(metric.scroll);
    expect(metric.minFont).toBeGreaterThanOrEqual(14);
  }
});

test("ST5-020F conserva Espacio en reflow dinámico y reduced motion", async ({ page }) => {
  await seed(page, ["plantas", "sistema"]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/estacion/5/espacio", { waitUntil: "domcontentloaded" });
  for (const viewport of [{ width: 375, height: 667 }, { width: 667, height: 375 }, { width: 375, height: 667 }]) {
    await page.setViewportSize(viewport);
    await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "space_intro");
    await expect(page.getByText("Toca el recorrido de madera.")).toBeVisible();
    const dimensions = await page.evaluate(() => ({ client: [document.documentElement.clientWidth, document.documentElement.clientHeight], scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight] }));
    expect(dimensions.client).toEqual(dimensions.scroll);
  }
});
