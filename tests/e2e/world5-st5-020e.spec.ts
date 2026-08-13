import { expect, test, type Page } from "@playwright/test";

import { installWorldFiveAccessFixture } from "./support/journeyFixtures";

test.beforeEach(async ({ page }) => {
  await installWorldFiveAccessFixture(page);
});

const root = (page: Page) => page.locator("[data-station5-state]");

async function seedProgress(page: Page, completedAreas: string[]) {
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await page.evaluate((areas) => {
    localStorage.clear();
    if (areas.length) {
      localStorage.setItem(
        "gvo.station5.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedAreas: areas,
          updatedAt: "2026-07-30T12:00:00.000Z",
        }),
      );
    }
  }, completedAreas);
}

test("ST5-020E compone encabezado y cuatro clusters dentro del recinto", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await expect(root(page)).toHaveAttribute(
    "aria-labelledby",
    "station5-map-title",
  );
  await expect(page.locator("#station5-title")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { level: 1, name: "MUNDO PRESENTE" }),
  ).toBeVisible();
  await expect(page.getByText("ESTACIÓN V", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Mapa del presente", { exact: true }),
  ).toHaveCount(0);

  const geometry = await page.evaluate(() => {
    const artboard = document
      .querySelector<HTMLElement>('[data-media-canvas="map"]')!
      .getBoundingClientRect();
    return [...document.querySelectorAll<HTMLElement>(".s5-sector")].map(
      (sector) => {
        const image = sector.querySelector("img")!.getBoundingClientRect();
        const label = sector
          .querySelector<HTMLElement>(".s5-sector__label")!
          .getBoundingClientRect();
        return {
          area: sector.dataset.station5Area,
          target: sector.getBoundingClientRect().toJSON(),
          image: image.toJSON(),
          label: label.toJSON(),
          labelGap: label.top - image.bottom,
          normalizedCenter: {
            x:
              ((image.left + image.right) / 2 - artboard.left) / artboard.width,
            y:
              ((image.top + image.bottom) / 2 - artboard.top) / artboard.height,
          },
        };
      },
    );
  });

  expect(geometry).toHaveLength(4);
  for (const sector of geometry) {
    expect(
      Math.min(sector.target.width, sector.target.height),
    ).toBeGreaterThanOrEqual(44);
    expect(sector.normalizedCenter.y).toBeGreaterThan(0.4);
    expect(sector.normalizedCenter.y).toBeLessThan(0.9);
  }
});

test("ST5-020E recupera stage y compacta tarjeta en móviles contractuales", async ({
  page,
}) => {
  for (const viewport of [
    { width: 360, height: 560, maxCard: 150 },
    { width: 375, height: 548, maxCard: 150 },
    { width: 375, height: 667, maxCard: 160 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
    await expect(root(page)).toHaveAttribute(
      "data-station5-state",
      "map_overview",
    );
    const measured = await page.evaluate(() => {
      const stage = document
        .querySelector(".s5-stage")!
        .getBoundingClientRect();
      const card = document
        .querySelector(".s5-story-card")!
        .getBoundingClientRect();
      return {
        stageHeight: stage.height,
        cardHeight: card.height,
        availableHeight: document.documentElement.clientHeight - 16,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(measured.cardHeight).toBeLessThanOrEqual(viewport.maxCard);
    expect(
      measured.stageHeight / measured.availableHeight,
    ).toBeGreaterThanOrEqual(0.68);
    expect(measured.scrollHeight).toBeLessThanOrEqual(
      measured.clientHeight + 1,
    );
    expect(measured.scrollWidth).toBeLessThanOrEqual(measured.clientWidth + 1);
  }
});

test("ST5-020E asienta P_PLANT_BASE dentro de SOIL_DARK_BAND", async ({
  page,
}) => {
  for (const height of [548, 667, 548]) {
    await page.setViewportSize({ width: 375, height });
    await page.goto("/estacion/5/plantas", { waitUntil: "domcontentloaded" });
    await expect(root(page)).toHaveAttribute(
      "data-station5-state",
      "plants_intro",
    );
    await expect(root(page)).toHaveAttribute(
      "aria-labelledby",
      "station5-title",
    );
    await expect(page.locator("#station5-title")).toHaveCount(1);
    const contact = await page.evaluate(() => {
      const canvas = document
        .querySelector<HTMLElement>('[data-media-canvas="plants"]')!
        .getBoundingClientRect();
      const focusImage = document
        .querySelector<HTMLElement>(".s5-plants-focus > img")!
        .getBoundingClientRect();
      const baseY = focusImage.top + focusImage.height * (1280 / 1536);
      const boundaryY = canvas.top + canvas.height * (1267 / 1920);
      const soilTopY = canvas.top + canvas.height * (1132 / 1920);
      return {
        baseY,
        boundaryY,
        soilTopY,
        insertionPx: boundaryY - baseY,
        normalizedSourceY: (baseY - canvas.top) / canvas.height,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      };
    });
    expect(contact.baseY).toBeGreaterThan(contact.soilTopY);
    expect(contact.baseY).toBeLessThan(contact.boundaryY);
    expect(contact.insertionPx).toBeGreaterThanOrEqual(6);
    expect(contact.insertionPx).toBeLessThanOrEqual(14);
    expect(contact.normalizedSourceY).toBeCloseTo(0.6384, 2);
    expect(contact.scrollHeight).toBeLessThanOrEqual(contact.clientHeight + 1);
  }
});

test("ST5-020E conserva estado y proyección en 360x560 → 360x640 → 360x560", async ({
  page,
}) => {
  await seedProgress(page, ["plantas"]);
  await page.setViewportSize({ width: 360, height: 560 });
  await page.goto("/estacion/5/sistema", { waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  const samples = [];
  for (const height of [560, 640, 560]) {
    await page.setViewportSize({ width: 360, height });
    samples.push(
      await page.evaluate(() => {
        const canvas = document
          .querySelector<HTMLElement>('[data-media-canvas="system"]')!
          .getBoundingClientRect();
        const focus = document
          .querySelector<HTMLElement>(".s5-system-focus")!
          .getBoundingClientRect();
        return {
          state: document
            .querySelector("[data-station5-state]")!
            .getAttribute("data-station5-state"),
          x: (focus.left - canvas.left) / canvas.width,
          y: (focus.top - canvas.top) / canvas.height,
          width: focus.width / canvas.width,
        };
      }),
    );
  }
  expect(samples[0]).toEqual(samples[2]);
  expect(samples.every((sample) => sample.state === "system_intro")).toBe(true);
});

test("ST5-020E conserva el contacto de Plantas en 360x560 → 360x640 → 360x560", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 560 });
  await page.goto("/estacion/5/plantas", { waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
  const samples = [];
  for (const height of [560, 640, 560]) {
    await page.setViewportSize({ width: 360, height });
    samples.push(
      await page.evaluate(() => {
        const canvas = document
          .querySelector<HTMLElement>('[data-media-canvas="plants"]')!
          .getBoundingClientRect();
        const image = document
          .querySelector<HTMLElement>(".s5-plants-focus > img")!
          .getBoundingClientRect();
        const baseY = image.top + image.height * (1280 / 1536);
        const boundaryY = canvas.top + canvas.height * (1267 / 1920);
        return {
          state: document
            .querySelector("[data-station5-state]")!
            .getAttribute("data-station5-state"),
          normalizedSourceY: (baseY - canvas.top) / canvas.height,
          insertionPx: boundaryY - baseY,
        };
      }),
    );
  }
  expect(samples[0]).toEqual(samples[2]);
  expect(samples.every((sample) => sample.state === "plants_intro")).toBe(true);
  expect(samples.every((sample) => sample.insertionPx >= 6)).toBe(true);
  expect(samples.every((sample) => sample.insertionPx <= 14)).toBe(true);
  expect(
    samples.every(
      (sample) => Math.abs(sample.normalizedSourceY - 0.6384) < 0.01,
    ),
  ).toBe(true);
});
