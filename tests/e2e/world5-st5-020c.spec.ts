import { expect, test, type Page } from "@playwright/test";

const viewports = [
  [360, 560],
  [360, 640],
  [375, 667],
  [390, 844],
  [430, 932],
  [768, 1024],
  [844, 390],
  [1024, 768],
] as const;

const forbiddenProcedural = [
  ".s5-map__nexus",
  ".s5-map__links",
  ".s5-sector__status",
  ".s5-vital-pulse",
  ".s5-resolved-check",
  ".s5-system-connection",
  ".s5-system-indicator",
].join(",");

async function assertNormalViewport(page: Page) {
  const result = await page.evaluate((forbidden) => {
    const visibleSelectors = [
      ".s5-title",
      ".s5-editorial-card",
      ".s5-lia",
      '[data-station5-scene]:not([aria-hidden="true"]) .s5-back',
      '[data-station5-scene="plantas"][aria-hidden="false"] .s5-plants-focus',
      '[data-station5-scene="sistema"][aria-hidden="false"] .s5-system-focus',
    ];
    const boxes = visibleSelectors.flatMap((selector) =>
      [...document.querySelectorAll<HTMLElement>(selector)].map((node) => {
        const rect = node.getBoundingClientRect();
        return { selector, left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      }),
    );
    const targets = [...document.querySelectorAll<HTMLElement>("button:not([disabled])")].map((node) => {
      const rect = node.getBoundingClientRect();
      return Math.min(rect.width, rect.height);
    });
    return {
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      boxes,
      targets,
      forbiddenCount: document.querySelectorAll(forbidden).length,
    };
  }, forbiddenProcedural);

  expect(result.scrollWidth).toBeLessThanOrEqual(result.clientWidth + 1);
  expect(result.scrollHeight).toBeLessThanOrEqual(result.clientHeight + 1);
  expect(result.forbiddenCount).toBe(0);
  expect(result.targets.length).toBeGreaterThan(0);
  expect(Math.min(...result.targets)).toBeGreaterThanOrEqual(44);
  for (const box of result.boxes) {
    expect(box.left, `${box.selector} left`).toBeGreaterThanOrEqual(-1);
    expect(box.top, `${box.selector} top`).toBeGreaterThanOrEqual(-1);
    expect(box.right, `${box.selector} right`).toBeLessThanOrEqual(result.clientWidth + 1);
    expect(box.bottom, `${box.selector} bottom`).toBeLessThanOrEqual(result.clientHeight + 1);
  }
}

async function seedPlants(page: Page) {
  await page.evaluate(() => localStorage.setItem("gvo.station5.v1", JSON.stringify({
    schemaVersion: 1,
    completedAreas: ["plantas"],
    updatedAt: "2026-07-30T12:00:00.000Z",
  })));
}

for (const [width, height] of viewports) {
  test(`ST5-020C integra mapa, Plantas y Sistema sin scroll a ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/estacion/5");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText("ESTACIÓN V · MUNDO V")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Mapa del presente" })).toBeVisible();
    await assertNormalViewport(page);

    await page.locator('[data-station5-area="plantas"]').click();
    await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "substation_plantas_interactive");
    await assertNormalViewport(page);
    await expect(page.locator(".s5-plants-focus")).toBeInViewport();
    await expect(page.locator(".s5-lia")).toBeInViewport();

    await page.getByRole("button", { name: "← Mapa" }).click();
    await seedPlants(page);
    await page.reload();
    await page.locator('[data-station5-area="sistema"]').click();
    await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "substation_sistema_interactive");
    await assertNormalViewport(page);
    await expect(page.locator(".s5-system-focus")).toBeInViewport();
    await expect(page.locator(".s5-lia")).toBeInViewport();
  });
}

test("ST5-020C permite flujo completo sólo con teclado", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-station5-area="plantas"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "substation_plantas_interactive");
  await page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }).focus();
  await expect(page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." })).toBeFocused();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Volver al mapa" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "map_plantas_completed");

  await page.locator('[data-station5-area="sistema"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "substation_sistema_interactive");
  await page.getByRole("button", { name: "Hacer visible la mediación desde el conector del sistema." }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Mediación visible.");
  await expect(page.getByRole("button", { name: "Volver al mapa" })).toBeEnabled();
});

test("ST5-020C reflow 200% conserva contenido y controles", async ({ page }) => {
  await page.setViewportSize({ width: 195, height: 422 });
  await page.goto("/estacion/5/plantas");
  const required = [
    page.getByText("ESTACIÓN V · MUNDO V"),
    page.getByRole("heading", { level: 1, name: "Mapa del presente" }),
    page.getByRole("button", { name: "← Mapa" }),
    page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }),
    page.locator(".s5-lia"),
  ];
  for (const element of required) {
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
  }
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight);
  const target = await page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }).boundingBox();
  expect(target).not.toBeNull();
  expect(Math.min(target?.width ?? 0, target?.height ?? 0)).toBeGreaterThanOrEqual(44);
});

test("ST5-020C mantiene reduced motion, consola y red local limpias", async ({ page }) => {
  const errors: string[] = [];
  const failedResponses: string[] = [];
  const external: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() === 404) failedResponses.push(response.url()); });
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4174")) external.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/estacion/5");
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-reduced-motion", "true");
  await page.locator('[data-station5-area="plantas"]').click();
  await expect(page.locator("[data-station5-state]")).toHaveAttribute("data-station5-state", "substation_plantas_interactive");
  await page.getByRole("button", { name: "Reconocer la vitalidad desde la hoja." }).press("Enter");
  await expect(page.getByRole("status")).toContainText("Vitalidad reconocida");
  expect(errors).toEqual([]);
  expect(failedResponses).toEqual([]);
  expect(external).toEqual([]);
});
