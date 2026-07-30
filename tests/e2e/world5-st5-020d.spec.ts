import { expect, test, type Page } from "@playwright/test";

const root = (page: Page) => page.locator("[data-station5-state]");

async function clearProgress(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

async function seedProgress(page: Page, completedAreas: string[]) {
  await page.evaluate((areas) => {
    localStorage.setItem(
      "gvo.station5.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedAreas: areas,
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    );
  }, completedAreas);
}

test("ST5-020D conserva overview y persiste Plantas/Sistema solo desde el foco", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await clearProgress(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );

  await page.locator('[data-station5-area="plantas"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("gvo.station5.v1")),
  ).toBeNull();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
  await page
    .getByRole("button", { name: "Reconocer la vitalidad desde la hoja." })
    .click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_resolved",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_resolved",
  );
  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await expect(
    page.getByRole("heading", { name: "MUNDO PRESENTE" }),
  ).toBeVisible();

  await page.locator('[data-station5-area="sistema"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );
  await page
    .getByRole("button", {
      name: "Hacer visible la mediación desde el conector del sistema.",
    })
    .click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_resolved",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_resolved",
  );
  await page.getByRole("button", { name: "Volver al mapa" }).click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await expect(
    page.getByRole("heading", { name: "MUNDO PRESENTE" }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/visual/world5/st5-020d/refresh_completed_overview_390x844.png",
    fullPage: false,
  });
  await expect(page.getByRole("heading", { name: "Espacio" })).toHaveCount(0);

  await page.locator('[data-station5-area="espacio"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_blocked_feedback",
  );
  await expect(page).toHaveURL(/\/estacion\/5$/);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("gvo.station5.v1") ?? "{}"),
  );
  expect(stored.completedAreas).toEqual(["plantas", "sistema"]);
});

test("ST5-020D cancela Back durante transición y permite flujo por teclado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await clearProgress(page);
  await page.reload({ waitUntil: "domcontentloaded" });

  await page.locator('[data-station5-area="plantas"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "transitioning",
  );
  await page.goBack();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("gvo.station5.v1")),
  ).toBeNull();

  await page.locator('[data-station5-area="plantas"]').focus();
  await page.keyboard.press("Enter");
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
  const leaf = page.getByRole("button", {
    name: "Reconocer la vitalidad desde la hoja.",
  });
  await leaf.focus();
  await page.keyboard.press("Space");
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_resolved",
  );
  await page.getByRole("button", { name: "Volver al mapa" }).press("Enter");
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "map_overview",
  );
  await expect(page.locator('[data-station5-area="plantas"]')).toBeFocused();
});

test("ST5-020D reduced motion y storage error fallan cerrado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "gvo.station5.v1") throw new Error("ST5 QA storage blocked");
      return original.call(this, key, value);
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await expect(root(page)).toHaveAttribute(
    "data-station5-reduced-motion",
    "true",
  );
  await page.locator('[data-station5-area="plantas"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
  await page
    .getByRole("button", { name: "Reconocer la vitalidad desde la hoja." })
    .click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "storage_error",
  );
  await expect(
    page.getByRole("button", { name: "Volver al mapa" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Reintentar guardado" }).click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "plants_intro",
  );
});

test("ST5-020D conserva anclajes tras 390x844 → 390x700 → 390x844", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await seedProgress(page, ["plantas"]);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator('[data-station5-area="sistema"]').click();
  await expect(root(page)).toHaveAttribute(
    "data-station5-state",
    "system_intro",
  );

  for (const height of [844, 700, 844]) {
    await page.setViewportSize({ width: 390, height });
    const result = await page.evaluate(() => {
      const canvas = document
        .querySelector<HTMLElement>('[data-media-canvas="system"]')
        ?.getBoundingClientRect();
      const focus = document
        .querySelector<HTMLElement>(".s5-system-focus")
        ?.getBoundingClientRect();
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        canvas: canvas && { width: canvas.width, height: canvas.height },
        focus: focus && { width: focus.width, height: focus.height },
      };
    });
    expect(result.scrollWidth).toBeLessThanOrEqual(result.clientWidth + 1);
    expect(result.canvas?.width).toBeGreaterThan(0);
    expect(result.focus?.width).toBeGreaterThanOrEqual(44);
  }
});

test("ST5-020D refluye a 200% con scroll vertical controlado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 195, height: 422 });
  await page.goto("/estacion/5/plantas", { waitUntil: "domcontentloaded" });
  const required = [
    page.getByRole("heading", { name: "Plantas" }),
    page.getByRole("button", { name: "← Mapa" }),
    page.getByRole("button", {
      name: "Reconocer la vitalidad desde la hoja.",
    }),
    page.locator(".s5-lia"),
  ];
  for (const element of required) {
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
  }
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight);
  const target = await page
    .getByRole("button", { name: "Reconocer la vitalidad desde la hoja." })
    .boundingBox();
  expect(
    Math.min(target?.width ?? 0, target?.height ?? 0),
  ).toBeGreaterThanOrEqual(44);
});
