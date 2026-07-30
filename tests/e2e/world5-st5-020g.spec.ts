import { expect, test, type Page } from "@playwright/test";

const progressKey = "gvo.station5.v1";

async function seed(page: Page, areas: string[]) {
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ key, completedAreas }) => {
      localStorage.clear();
      if (completedAreas.length) {
        localStorage.setItem(
          key,
          JSON.stringify({
            schemaVersion: 1,
            completedAreas,
            updatedAt: "2026-07-30T12:00:00.000Z",
          }),
        );
      }
    },
    { key: progressKey, completedAreas: areas },
  );
}

async function expectState(page: Page, state: string) {
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    state,
  );
}

test("ST5-020G completa Visitante, conserva 4/4 y permite revisita libre", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 667 });
  await seed(page, ["plantas", "sistema", "espacio"]);
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Toca Visitante para completar el mapa.")).toBeVisible();
  await expect(page.locator('[data-station5-area="visitante"]')).toHaveAttribute(
    "data-area-state",
    "available",
  );

  await page.locator('[data-station5-area="visitante"]').click();
  await expectState(page, "visitor_intro");
  await page
    .getByRole("button", {
      name: "Reconocer la presencia del visitante dentro del recorrido.",
    })
    .click();
  await expectState(page, "visitor_resolved");
  await expect(page.locator("[data-station-complete]")).toHaveAttribute(
    "data-station-complete",
    "true",
  );
  expect(
    await page.evaluate((key) => {
      const value = JSON.parse(localStorage.getItem(key) ?? "{}");
      return value.completedAreas;
    }, progressKey),
  ).toEqual(["plantas", "sistema", "espacio", "visitante"]);
  await expect(page.getByText("Ir al cierre")).toHaveCount(0);
  await expect(page).not.toHaveURL(/\/transition\/world-5-to-final|\/final/);

  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expectState(page, "map_overview");
  await expect(
    page.getByText(
      "Plantas, sistema, espacio y visitante ya forman el presente de OKÚA.",
    ),
  ).toBeVisible();
  await expect(page.locator("[data-map-complete]")).toHaveAttribute(
    "data-map-complete",
    "true",
  );
  await expect(page.locator('[data-station5-area="visitante"]')).toBeFocused();

  for (const [area, expected] of [
    ["sistema", "system_resolved"],
    ["visitante", "visitor_resolved"],
    ["plantas", "plants_resolved"],
    ["espacio", "space_resolved"],
  ] as const) {
    await page.locator(`[data-station5-area="${area}"]`).click();
    await expectState(page, expected);
    await page.getByRole("button", { name: "Volver al mapa" }).click();
    await expectState(page, "map_overview");
  }

  await page.reload({ waitUntil: "domcontentloaded" });
  await expectState(page, "map_overview");
  await expect(page.locator("[data-station-complete]")).toHaveAttribute(
    "data-station-complete",
    "true",
  );
  await expect(page).not.toHaveURL(/\/transition\/world-5-to-final|\/final/);
});

test("ST5-020G completa el recorrido limpio 0/4 a 4/4", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, []);
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });

  for (const [area, intro, action] of [
    ["plantas", "plants_intro", "Reconocer la vitalidad desde la hoja."],
    [
      "sistema",
      "system_intro",
      "Hacer visible la mediación desde el conector del sistema.",
    ],
    ["espacio", "space_intro", "Activar el recorrido de Espacio."],
    [
      "visitante",
      "visitor_intro",
      "Reconocer la presencia del visitante dentro del recorrido.",
    ],
  ] as const) {
    await page.locator(`[data-station5-area="${area}"]`).click();
    await expectState(page, intro);
    await page.getByRole("button", { name: action }).click();
    await expectState(page, intro.replace("_intro", "_resolved"));
    await page.getByRole("button", { name: "Volver al mapa" }).click();
    await expectState(page, "map_overview");
  }

  expect(
    await page.evaluate((key) => {
      const value = JSON.parse(localStorage.getItem(key) ?? "{}");
      return value.completedAreas;
    }, progressKey),
  ).toEqual(["plantas", "sistema", "espacio", "visitante"]);
});

test("ST5-020G conserva Visitante y 4/4 en reflow dinámico y reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seed(page, ["plantas", "sistema", "espacio"]);
  await page.goto("/estacion/5/visitante", { waitUntil: "domcontentloaded" });

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 667, height: 375 },
    { width: 375, height: 667 },
  ]) {
    await page.setViewportSize(viewport);
    await expectState(page, "visitor_intro");
    await expect(page.getByText("Toca la presencia dentro del aro.")).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      client: [document.documentElement.clientWidth, document.documentElement.clientHeight],
      scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
    }));
    expect(dimensions.client).toEqual(dimensions.scroll);
  }
});
