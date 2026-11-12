import { expect, test } from "@playwright/test";
import {
  installInterstationQrTestMode,
  scanInterstationQrForTest,
} from "./support/interstation-qr";

for (const [width, height, reduced] of [
  [280, 568, false],
  [320, 568, false],
  [390, 844, false],
  [844, 390, false],
  [568, 280, false],
  [1920, 1080, false],
  [390, 844, true],
] as const) {
  test(`Sala IV: composición ${width}x${height}, movimiento reducido ${reduced}, sin overflow ni progreso por foco`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() =>
      localStorage.setItem(
        "gvo.progress.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3],
          updatedAt: "2026-10-23T12:00:00.000Z",
        }),
      ),
    );
    await page.goto("/estacion/4");
    const screen = page.locator(".s4-screen");
    await expect(screen).toBeVisible();
    const stage = page.locator(".s4-stage");
    await expect(stage).toHaveAttribute(
      "data-stage-layout",
      height > width ? "portrait" : "wide",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const last = page.locator('[data-station4-node="sonido"]');
    await last.focus();
    const bounds = await last.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height);
    await expect(screen).toHaveAttribute("data-station4-progress", "0");
    const plant = page.locator('[data-station4-node="planta"]');
    await plant.focus();
    await plant.press("Enter");
    await expect(screen).toHaveAttribute("data-station4-progress", "1");
    await expect(
      page.getByRole("button", { name: "Escanea el QR para abrir Sala V" }),
    ).toBeVisible();
  });
}
test("Sala IV: continuar conserva omisión y permite retomar tras QR y revisita", async ({
  page,
}) => {
  await installInterstationQrTestMode(page);
  await page.addInitScript(() =>
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3],
        updatedAt: "2026-10-23T12:00:00.000Z",
      }),
    ),
  );
  await page.goto("/estacion/4");
  await page
    .getByRole("button", {
      name: "Escanea el QR para abrir Sala V",
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Cerrar cámara", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("gvo.progress.v1")!).completedStations,
    ),
  ).toEqual([1, 2, 3]);
  await expect(page.locator("[data-station4-progress]")).toHaveAttribute(
    "data-station4-progress",
    "0",
  );
  await expect(page.locator('[data-node-state="completed"]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator("[data-station4-resume-mode]")).toHaveAttribute(
    "data-station4-resume-mode",
    "activity_skipped",
  );
  await scanInterstationQrForTest(page, 4);
  await expect(page).toHaveURL(/\/estacion\/5$/);
  const checkpoint = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("gvo.station4.v1")!),
  );
  expect(checkpoint).toMatchObject({
    highestSettledIndex: -1,
    resumeMode: "activity_skipped",
  });
  await page.goto("/estacion/4");
  await page.locator('[data-station4-node="planta"]').click();
  await expect(page.locator("[data-station4-progress]")).toHaveAttribute(
    "data-station4-progress",
    "1",
  );
});
