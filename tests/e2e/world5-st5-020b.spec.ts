import { mkdirSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

import { evidenceDirectory, evidencePath } from "./support/evidence";
import { installWorldFiveAccessFixture } from "./support/journeyFixtures";
import { isLocalTestRequest } from "./support/local-network";

const evidenceScope = "world5-st5-020b" as const;

test.beforeAll(() => {
  mkdirSync(evidenceDirectory(evidenceScope), { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await installWorldFiveAccessFixture(page);
});

const viewports = [
  [360, 640],
  [390, 844],
  [430, 932],
  [768, 1024],
  [844, 390],
  [1440, 900],
] as const;

type WorldFiveArea = "plantas" | "sistema" | "espacio" | "visitante";

async function seedOutOfOrderFixture(
  page: Page,
  completedAreas: WorldFiveArea[],
) {
  await page.goto("/estacion/5");
  await page.evaluate((areas) => {
    window.localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4],
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
    window.localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: areas,
        updatedAt: "2026-08-05T12:00:00.000Z",
      }),
    );
  }, completedAreas);
}

async function expectInactiveScene(
  page: Page,
  area: Exclude<WorldFiveArea, "plantas">,
  heading: "Sistema" | "Espacio" | "Visitante",
) {
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  const scene = page.locator(`[data-station5-scene="${area}"]`);
  await expect(scene).toHaveCount(1);
  await expect(scene).toHaveAttribute("aria-hidden", "true");
  await expect(scene).toHaveAttribute("inert", "");
  await expect(scene.locator("[data-runtime-asset]")).toHaveCount(0);
  await expect(scene.locator("img[src], source[srcset]")).toHaveCount(0);
  await expect(scene.locator("button[data-anchor-id]")).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: heading, exact: true }),
  ).toHaveCount(0);
}

test("ST5-020B recorre Sistema, integra Lía y no usa red externa", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const externalRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error")
      consoleErrors.push(`${message.location().url}: ${message.text()}`);
  });
  page.on("request", (request) => {
    if (!isLocalTestRequest(request.url()))
      externalRequests.push(request.url());
  });

  await page.goto("/estacion/5");
  await page.evaluate(() =>
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: ["plantas"],
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    ),
  );
  await page.reload();

  await expect(page.locator('[data-station5-area="sistema"]')).toBeEnabled();
  await expect(page.locator('[data-station5-lia="attend"]')).toHaveCount(1);
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page).toHaveURL(/\/estacion\/5\/sistema$/);
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  await expect(page.getByRole("heading", { name: "Sistema" })).toBeFocused();
  await expect(
    page.locator(
      '.s5-system-focus [data-runtime-asset$="world5_sub_system_focus_v01.webp"]',
    ),
  ).toHaveCount(1);
  await expect(page.locator('[data-station5-lia="explain"]')).toHaveCount(1);

  const connector = page.getByRole("button", {
    name: "Hacer visible la mediación desde el conector del sistema.",
  });
  await connector.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "system_resolved",
  );
  await expect(page.getByRole("status")).toContainText("Mediación visible.");
  await expect(page.locator('[data-world5-connection="general"]')).toHaveCount(
    0,
  );
  await expect(page.locator('[data-station5-lia="explain"]')).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Volver al mapa" }),
  ).toBeEnabled();

  const stored = await page.evaluate(() => ({
    station5: localStorage.getItem("gvo.station5.v1"),
    global: localStorage.getItem("gvo.progress.v1"),
  }));
  expect(JSON.parse(stored.station5 ?? "{}").completedAreas).toEqual([
    "plantas",
    "sistema",
  ]);
  expect(JSON.parse(stored.global ?? "{}").completedStations).toEqual([
    1, 2, 3, 4,
  ]);

  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await expect(page.locator('[data-station5-area="sistema"]')).toBeFocused();
  await expect(page.locator('[data-station5-area="sistema"]')).toHaveAttribute(
    "data-area-state",
    "completed",
  );
  await expect(page.locator('[data-station5-area="espacio"]')).toHaveAttribute(
    "data-area-state",
    "available",
  );
  await expect(page.locator('[data-station5-area="espacio"]')).toBeEnabled();
  await expect(
    page.locator('[data-station5-area="visitante"]'),
  ).toHaveAttribute("data-area-state", "locked");
  await expect(page.locator("[data-station-complete]")).toHaveAttribute(
    "data-station-complete",
    "false",
  );
  await page.screenshot({
    path: evidencePath(evidenceScope, "map_after_system_390x844.png"),
    fullPage: false,
  });

  await page.reload();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  expect(consoleErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test("ST5-020B protege las tres entradas fuera de orden con wrappers inactivos", async ({
  page,
}) => {
  // 020B conserva las garantías de Sistema; Espacio y Visitante siguen el
  // contrato secuencial y de wrappers estables publicado posteriormente.
  await seedOutOfOrderFixture(page, []);
  await page.goto("/estacion/5/sistema");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.getByRole("status")).toContainText("Completa Plantas");
  await expectInactiveScene(page, "sistema", "Sistema");

  await seedOutOfOrderFixture(page, ["plantas"]);
  await page.goto("/estacion/5/espacio");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.getByRole("status")).toContainText("Completa Sistema");
  await expectInactiveScene(page, "espacio", "Espacio");

  await seedOutOfOrderFixture(page, ["plantas", "sistema"]);
  await page.goto("/estacion/5/visitante");
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.getByRole("status")).toContainText("Completa Espacio");
  await expectInactiveScene(page, "visitante", "Visitante");
});

test("ST5-020B conserva responsive, targets y background landscape nativo", async ({
  page,
}) => {
  await page.goto("/estacion/5");
  await page.evaluate(() =>
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: ["plantas"],
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    ),
  );
  await page.reload();

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      controls: [...document.querySelectorAll("button:not([disabled])")].map(
        (button) => {
          const rect = button.getBoundingClientRect();
          return Math.min(rect.width, rect.height);
        },
      ),
    }));
    expect(
      metrics.scrollWidth,
      `${width}x${height} sin overflow horizontal`,
    ).toBeLessThanOrEqual(metrics.clientWidth);
    expect(
      Math.min(...metrics.controls),
      `${width}x${height} conserva targets`,
    ).toBeGreaterThanOrEqual(44);
  }

  await page.setViewportSize({ width: 844, height: 390 });
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  await expect(
    page.locator(
      '[data-projected-stage="system"] .s5-media-background source[srcset$="world5_sub_system_environment_landscape_v01.webp"]',
    ),
  ).toHaveCount(1);
  await page.screenshot({
    path: evidencePath(evidenceScope, "system_844x390.png"),
    fullPage: false,
  });
});

test("ST5-020B reduced motion conserva semántica y persistencia", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await page.evaluate(() =>
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: ["plantas"],
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    ),
  );
  await page.reload();
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-reduced-motion",
    "true",
  );
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  await page
    .getByRole("button", {
      name: "Hacer visible la mediación desde el conector del sistema.",
    })
    .press("Space");
  await expect(page.getByRole("status")).toContainText("Mediación visible.");
  await page.screenshot({
    path: evidencePath(evidenceScope, "reduced_motion_system_390x844.png"),
    fullPage: false,
  });
});
