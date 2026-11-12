import { expect, test, type Page } from "@playwright/test";
import {
  installInterstationQrTestMode,
  scanInterstationQrForTest,
} from "./support/interstation-qr";
const key = "gvo.station3.practice.v2";
async function seed(page: Page, complete = false) {
  await page.goto("/portada");
  await page.evaluate(
    ({ complete }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        "gvo.progress.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedStations: complete ? [1, 2, 3, 4, 5] : [1, 2],
          updatedAt: new Date().toISOString(),
        }),
      );
      localStorage.setItem(
        "gvo.station3.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedRecordIds: ["planta", "prototipo"],
          updatedAt: "2026-08-05T18:00:00.000Z",
        }),
      );
    },
    { complete },
  );
  await page.goto("/estacion/3");
}
async function read(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k)!), key);
}
async function failWrites(page: Page, failKey: string | null) {
  await page.evaluate((k) => {
    const w = window as typeof window & {
      __failPractice?: string | null;
      __origPracticeSet?: typeof Storage.prototype.setItem;
    };
    w.__failPractice = k;
    if (!w.__origPracticeSet) {
      w.__origPracticeSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name, value) {
        if (name === w.__failPractice) throw new Error("test quota");
        return w.__origPracticeSet!.call(this, name, value);
      };
    }
  }, failKey);
}
test("Sala III conserva visitas sin certificar lectura o práctica y solo avanza con QR correcto", async ({
  page,
}) => {
  await installInterstationQrTestMode(page);
  await seed(page);
  const old = await page.evaluate(() =>
    localStorage.getItem("gvo.station3.v1"),
  );
  await expect(
    page.getByRole("heading", { name: "Sala III · Cuaderno de práctica" }),
  ).toBeVisible();
  await page.locator('[data-station3-record="planta"]').click();
  expect((await read(page)).reviewedPages).toEqual([]);
  await page.getByRole("button", { name: "Paso a paso →" }).click();
  await page.reload();
  expect((await read(page)).reviewedPages).toEqual([]);
  expect((await read(page)).visitedPages).toEqual(["planta", "prototipo"]);
  await page.locator('[data-station3-record="prototipo"]').click();
  await page.getByRole("button", { name: "Beneficios →" }).click();
  const gate = page.locator('[data-interstation-origin-world="3"]');
  await gate.locator('[data-interstation-qr-action="open"]').click();
  expect(await read(page)).toMatchObject({
    reviewedPages: [],
    visitedPages: ["planta", "prototipo", "senal"],
    skippedPages: [],
    practiceStatus: "not_started",
    activityContinued: true,
  });
  expect(
    await page.evaluate(() => localStorage.getItem("gvo.station3.v1")),
  ).toBe(old);
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("gvo:qr-test-payload", { detail: { payload: "/qr/w5" } }),
    ),
  );
  await expect(page).toHaveURL(/\/estacion\/3$/);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("gvo.progress.v1")!).completedStations,
    ),
  ).toEqual([1, 2]);
  await page.locator('[data-interstation-qr-action="close"]').click();
  await expect(
    page.getByRole("heading", { name: "BENEFICIOS", exact: true }),
  ).toBeVisible();
  await failWrites(page, "gvo.progress.v1");
  await scanInterstationQrForTest(page, 3);
  await expect(page).toHaveURL(/\/estacion\/3$/);
  await failWrites(page, null);
  await page
    .locator('[data-interstation-qr-action="retry-completion"]')
    .click();
  await expect(page).toHaveURL(
    /\/(transition\/world-3-to-world-4|estacion\/4)$/,
  );
});
test("Sala III omisión fail-closed, retry, recarga y otra pestaña no certifican práctica", async ({
  page,
  context,
}) => {
  await seed(page);
  await failWrites(page, key);
  await page.locator('[data-interstation-qr-action="open"]').click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.locator('[data-interstation-qr-action="open"]'),
  ).toHaveCount(0);
  await failWrites(page, null);
  await page.getByRole("button", { name: "Reintentar", exact: true }).click();
  await page.reload();
  expect(await read(page)).toMatchObject({
    reviewedPages: [],
    visitedPages: [],
    practiceStatus: "not_started",
  });
  const other = await context.newPage();
  await other.goto("/estacion/3");
  await other.locator('[data-station3-record="prototipo"]').click();
  await other.getByRole("button", { name: "Beneficios →" }).click();
  await page.reload();
  expect((await read(page)).practiceStatus).toBe("not_started");
  expect((await read(page)).visitedPages).toEqual(["prototipo", "senal"]);
  expect((await read(page)).reviewedPages).toEqual([]);
  await other.close();
});
test("reset real elimina práctica y trivia junto al recorrido y preserva preferencias", async ({
  page,
}) => {
  await seed(page, true);
  const localKeys = [
    "gvo.progress.v1",
    "gvo.station1.v1",
    "gvo.station2.v1",
    "gvo.station3.v1",
    key,
    "gvo.station4.v1",
    "gvo.station5.v1",
    "gvo.station5.quiz.v1",
    "gvo.coverIntro.introCompleted.v1",
  ];
  await page.evaluate((keys) => {
    for (const k of keys.filter((x) => x !== "gvo.progress.v1"))
      localStorage.setItem(k, "raw-sentinel");
    localStorage.setItem("unrelated.token", "preserved");
    localStorage.setItem("gvo.language.v1", "es");
    sessionStorage.setItem("gvo.final.reviewContext.v1", "raw-review");
    sessionStorage.setItem("gvo:orientation-hint:dismissed", "1");
  }, localKeys);
  await page.goto("/final");
  await page.locator('[data-final-action="open_restart_confirmation"]').click();
  await page
    .locator('[data-final-action="confirm_restart_transaction"]')
    .click();
  await expect(page).toHaveURL(/\/portada$/);
  expect(
    await page.evaluate(
      (keys) => ({
        values: keys.map((k) => localStorage.getItem(k)),
        review: sessionStorage.getItem("gvo.final.reviewContext.v1"),
        unrelated: localStorage.getItem("unrelated.token"),
        orientation: sessionStorage.getItem("gvo:orientation-hint:dismissed"),
      }),
      localKeys,
    ),
  ).toEqual({
    values: localKeys.map(() => null),
    review: null,
    unrelated: "preserved",
    orientation: "1",
  });
});
test("práctica revisable sin esperas en portrait, landscape y movimiento reducido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seed(page);
  for (const size of [
    { width: 280, height: 653 },
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(size);
    for (const id of ["planta", "prototipo", "senal"]) {
      await page.locator(`[data-station3-record="${id}"]`).click();
      await expect(
        page.getByRole("button", { name: "← Índice" }),
      ).toBeEnabled();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("button", { name: "← Índice" }).click();
    }
  }
  expect((await read(page)).practiceStatus).toBe("not_started");
  expect((await read(page)).reviewedPages).toEqual([]);
});
