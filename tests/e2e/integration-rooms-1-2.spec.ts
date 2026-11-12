import { expect, test } from "@playwright/test";
import {
  installInterstationQrTestMode,
  scanInterstationQrForTest,
} from "./support/interstation-qr";

test.use({ video: "on" });

test.beforeEach(async ({ page }) => {
  await installInterstationQrTestMode(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test("integración I: Lía presenta tres puntos, cierre manual y títulos por llegada", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/estacion/1");
  const root = page.locator(".world1-root-screen");
  await expect(root).toBeVisible();
  await expect(page.locator('[data-world1-title-revealed="true"]')).toHaveCount(
    0,
  );
  await page.screenshot({ path: testInfo.outputPath("sala-1-inicio.png") });
  for (const [index, concept] of [
    "relation",
    "perception",
    "mediation",
  ].entries()) {
    const node = page.locator(`[data-world1-root-node="${concept}"]`);
    await node.click();
    await expect(root).toHaveAttribute("data-world1-lia-arrival", "arriving");
    await expect(node.locator("[data-world1-title-revealed]")).toHaveAttribute(
      "data-world1-title-revealed",
      "true",
    );
    await expect(
      page.locator('[data-world1-title-revealed="true"]'),
    ).toHaveCount(index + 1);
    expect(
      await page.evaluate(() => localStorage.getItem("gvo.progress.v1")),
    ).toBeNull();
    if (index === 1) {
      const more = page.getByText("Más", { exact: true });
      await more.click();
      await expect(page.locator(".world1-reading-more")).toHaveAttribute(
        "open",
        "",
      );
      await more.click();
    }
    await page.screenshot({
      path: testInfo.outputPath(`sala-1-${concept}.png`),
    });
    const beforeClose = await page.locator(".world1-root-lia").boundingBox();
    await page.getByRole("button", { name: "Cerrar", exact: true }).click();
    if (index < 2) {
      await expect
        .poll(
          async () => (await page.locator(".world1-root-lia").boundingBox())!.x,
        )
        .toBeGreaterThan(beforeClose!.x + 40);
    }
  }
  await expect(root).toHaveAttribute(
    "data-world1-root-state",
    "ready_to_continue",
  );
  await scanInterstationQrForTest(page, 1);
  await expect(page).toHaveURL(/\/estacion\/2$/);
});

test("integración I-II: omitir y recargar preserva visitas reales y exige QR", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/estacion/1");
  await page.locator('[data-interstation-qr-action="open"]').click();
  await page.getByRole("button", { name: "Cerrar cámara" }).click();
  await page.reload();
  await expect(page.locator(".world1-root-screen")).toHaveAttribute(
    "data-world1-visited-concepts",
    "",
  );
  await scanInterstationQrForTest(page, 1);
  await expect(page).toHaveURL(/\/estacion\/2$/);
  await page.locator('[data-interstation-qr-action="open"]').click();
  await page.getByRole("button", { name: "Cerrar cámara" }).click();
  await page.reload();
  await expect(page.locator("[data-world2-state]")).toHaveAttribute(
    "data-world2-state",
    "planta_viva",
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("gvo.station2.v1") ?? "null"),
    ),
  ).toMatchObject({
    visitedLayerIds: ["planta_viva"],
    completedRequiredInteractions: [],
    activityContinued: true,
    resultState: "not_started",
  });
  await page.screenshot({
    path: testInfo.outputPath("sala-2-continuacion-opcional.png"),
  });
  await scanInterstationQrForTest(page, 2);
  await expect(page).toHaveURL(/\/estacion\/3$/);
});

test("integración II: guía continua, ampliaciones y resultado sin cierre automático", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() =>
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1],
        updatedAt: new Date().toISOString(),
      }),
    ),
  );
  await page.goto("/estacion/2");
  const actor = page.locator(".world2-lia-field");
  await actor.evaluate((element) => {
    element.setAttribute("data-continuity-probe", "same-actor");
  });
  await page.locator('[data-plant-contact-hotspot="016J"]').click();
  await page.locator('[data-world2-layer="senal"]').click();
  await expect(actor).toHaveAttribute("data-continuity-probe", "same-actor");
  await page
    .locator('[data-world2-signal-reveal-control="onda-medida"]')
    .click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath("sala-2-senal.png"),
    fullPage: true,
  });
  await page.locator('[data-world2-layer="captura"]').click();
  await page
    .getByRole("button", { name: "Mostrar paso 2: Señal tomada" })
    .click();
  await page
    .getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })
    .click();
  await page.locator('[data-world2-layer="acondicionamiento"]').click();
  await page.locator('[data-world2-layer="mapeo"]').click();
  await page
    .getByRole("button", { name: "Revisar relación 3 de 3: RANGO a altura" })
    .click();
  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  const core = page.getByRole("button", { name: "Mostrar resultado sonoro" });
  await core.focus();
  await core.press("Enter");
  await expect(page.locator("[data-world2-state]")).toHaveAttribute(
    "data-world2-state",
    "resultado_mediado",
  );
  await expect(
    page.getByRole("button", { name: "Escanea el QR para abrir Sala III" }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("sala-2-resultado.png") });
  await scanInterstationQrForTest(page, 2);
  await expect(page).toHaveURL(/\/estacion\/3$/);
});

for (const viewport of [
  { width: 280, height: 640 },
  { width: 375, height: 667 },
  { width: 667, height: 375 },
  { width: 640, height: 280 },
  { width: 1920, height: 1080 },
]) {
  test(`acabado I ${viewport.width}x${viewport.height}: escena, Más y QR sin desbordamiento`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/estacion/1");
    for (const concept of ["relation", "perception", "mediation"]) {
      const seed = page.locator(`[data-world1-root-node="${concept}"]`);
      await seed.focus();
      await seed.press("Enter");
    }
    await page.getByText("Más", { exact: true }).click();
    const qr = page.locator('[data-interstation-qr-action="open"]');
    await qr.scrollIntoViewIfNeeded();
    const box = await qr.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box!.y).toBeGreaterThanOrEqual(-1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(
      page.getByRole("button", {
        name: /Mostrar ahora|Continuar sin explorar más/,
      }),
    ).toHaveCount(0);
    await page.screenshot({
      path: testInfo.outputPath(
        `sala-1-${viewport.width}x${viewport.height}.png`,
      ),
      fullPage: true,
    });
  });
}
