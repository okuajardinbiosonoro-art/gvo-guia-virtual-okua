import { expect, test, type Page } from "@playwright/test";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD1_CHECKPOINT_KEY = "gvo.station1.v1";
const WORLD2_CHECKPOINT_KEY = "gvo.station2.v1";
const WORLD3_CHECKPOINT_KEY = "gvo.station3.v1";
const WORLD4_CHECKPOINT_KEY = "gvo.station4.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const COVER_PROGRESS_KEY = "gvo.coverIntro.introCompleted.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";

type RecordId = "planta" | "prototipo" | "senal";

async function seedWorld3(
  page: Page,
  completedRecordIds: readonly RecordId[] = [],
) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ globalKey, world3Key, completedIds }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        globalKey,
        JSON.stringify({
          completedStations: [1, 2],
          schemaVersion: 1,
          updatedAt: "2026-08-05T18:00:00.000Z",
        }),
      );
      if (completedIds.length > 0) {
        localStorage.setItem(
          world3Key,
          JSON.stringify({
            completedRecordIds: completedIds,
            schemaVersion: 1,
            updatedAt: "2026-08-05T18:01:00.000Z",
          }),
        );
      }
    },
    {
      completedIds: completedRecordIds,
      globalKey: GLOBAL_PROGRESS_KEY,
      world3Key: WORLD3_CHECKPOINT_KEY,
    },
  );
  await page.goto("/estacion/3", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station3-state]")).not.toHaveAttribute(
    "data-station3-state",
    "station3_entering",
    { timeout: 5_000 },
  );
}

async function openRecordAndWaitForSave(page: Page, recordId: RecordId) {
  await page
    .locator(`.s3-page--base [data-station3-record="${recordId}"]`)
    .first()
    .click();
  const save = page.locator(`[data-station3-record-confirm="${recordId}"]`);
  await expect(save).toBeVisible({ timeout: 35_000 });
  return save;
}

async function setSyntheticStorageFailure(
  page: Page,
  storageKey: string | null,
) {
  await page.evaluate((key) => {
    const scope = window as typeof window & {
      __gvoDebt006FailKey?: string | null;
      __gvoDebt006StorageInstalled?: boolean;
    };
    scope.__gvoDebt006FailKey = key;
    if (scope.__gvoDebt006StorageInstalled) return;

    const originalSetItem = Storage.prototype.setItem;
    scope.__gvoDebt006StorageInstalled = true;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === scope.__gvoDebt006FailKey) {
        throw new Error("Synthetic GVO_DEBT_006 storage failure");
      }
      return originalSetItem.call(this, storageKey, value);
    };
  }, storageKey);
}

async function readWorld3Prefix(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).completedRecordIds : null;
  }, WORLD3_CHECKPOINT_KEY);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
});

test("GVO_DEBT_006 guarda, reabre, reintenta y completa Mundo III por UI real", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await seedWorld3(page);
  expect(await readWorld3Prefix(page)).toBeNull();

  const plantSave = await openRecordAndWaitForSave(page, "planta");
  await setSyntheticStorageFailure(page, WORLD3_CHECKPOINT_KEY);
  await plantSave.click();
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused();
  await expect(
    page.locator('.s3-page--base [data-station3-record="prototipo"]'),
  ).toHaveAttribute("data-record-state", "locked");
  expect(await readWorld3Prefix(page)).toBeNull();

  await setSyntheticStorageFailure(page, null);
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_prototype_unlocked",
    { timeout: 10_000 },
  );
  expect(await readWorld3Prefix(page)).toEqual(["planta"]);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_prototype_unlocked",
    { timeout: 5_000 },
  );
  await expect(
    page.locator('.s3-page--base [data-station3-record="planta"]'),
  ).toHaveAttribute("data-record-state", "completed");

  const prototypeSave = await openRecordAndWaitForSave(page, "prototipo");
  await prototypeSave.click();
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_signal_unlocked",
    { timeout: 10_000 },
  );
  expect(await readWorld3Prefix(page)).toEqual(["planta", "prototipo"]);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_signal_unlocked",
    { timeout: 5_000 },
  );
  await page.locator('.s3-page--base [data-station3-record="planta"]').click();
  await expect(
    page.locator('[data-station3-plant-sequence-step="summary"]'),
  ).toBeVisible({ timeout: 5_000 });
  await page.getByRole("button", { name: "Volver al índice" }).click();
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_signal_unlocked",
    { timeout: 5_000 },
  );

  const signalSave = await openRecordAndWaitForSave(page, "senal");
  await setSyntheticStorageFailure(page, WORLD3_CHECKPOINT_KEY);
  await signalSave.click();
  await expect(page.locator(".s3-stamp")).toHaveCount(0);
  await expect(page.locator(".s3-footer")).toHaveAttribute(
    "data-cta-visible",
    "false",
  );
  await setSyntheticStorageFailure(page, null);
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_ready_to_continue",
    { timeout: 10_000 },
  );
  expect(await readWorld3Prefix(page)).toEqual([
    "planta",
    "prototipo",
    "senal",
  ]);

  await setSyntheticStorageFailure(page, GLOBAL_PROGRESS_KEY);
  await page.getByRole("button", { name: "Continuar a Mundo IV." }).click();
  await expect(page).toHaveURL(/\/estacion\/3$/);
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused();
  await expect(page.locator(".s3-stamp")).toHaveAttribute(
    "data-stamp-stage",
    "ready",
  );
  expect(await readWorld3Prefix(page)).toEqual([
    "planta",
    "prototipo",
    "senal",
  ]);

  await setSyntheticStorageFailure(page, null);
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page).toHaveURL(/\/estacion\/4$/, { timeout: 10_000 });

  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        completedStations: [1, 2, 3, 4, 5],
        schemaVersion: 1,
        updatedAt: "2026-08-05T18:30:00.000Z",
      }),
    );
  }, GLOBAL_PROGRESS_KEY);
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="3"]').click();
  await expect(page).toHaveURL(/\/estacion\/3$/);
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_ready_to_continue",
    { timeout: 5_000 },
  );
  await expect(page.locator(".s3-stamp")).toHaveAttribute(
    "data-stamp-stage",
    "ready",
  );
});

test("GVO_DEBT_006 reinicia narrativa incompleta y restaura prefix en otra pestaña", async ({
  page,
  context,
}) => {
  test.setTimeout(60_000);
  await seedWorld3(page, ["planta"]);
  await page
    .locator('.s3-page--base [data-station3-record="prototipo"]')
    .click();
  await expect(
    page.locator('[data-station3-prototype-phase="assembly"]'),
  ).toBeVisible({ timeout: 5_000 });

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_prototype_unlocked",
    { timeout: 5_000 },
  );
  expect(await readWorld3Prefix(page)).toEqual(["planta"]);
  await page
    .locator('.s3-page--base [data-station3-record="prototipo"]')
    .click();
  await expect(
    page.locator('[data-station3-prototype-phase="assembly"]'),
  ).toBeVisible({ timeout: 5_000 });
  await expect(
    page.locator('[data-station3-prototype-sequence-step="1"]'),
  ).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        completedRecordIds: ["planta", "prototipo"],
        schemaVersion: 1,
        updatedAt: "2026-08-05T18:40:00.000Z",
      }),
    );
  }, WORLD3_CHECKPOINT_KEY);
  const reopened = await context.newPage();
  await reopened.emulateMedia({ reducedMotion: "reduce" });
  await reopened.setViewportSize({ width: 390, height: 844 });
  await reopened.goto("/estacion/3", { waitUntil: "domcontentloaded" });
  await expect(reopened.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_signal_unlocked",
    { timeout: 5_000 },
  );
  expect(await readWorld3Prefix(reopened)).toEqual(["planta", "prototipo"]);
  await reopened.close();
});

test("GVO_DEBT_006 reset real elimina ocho keys y preserva familias ajenas", async ({
  page,
}) => {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ localKeys, reviewKey }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        localKeys[0],
        JSON.stringify({
          completedStations: [1, 2, 3, 4, 5],
          schemaVersion: 1,
          updatedAt: "2026-08-05T19:00:00.000Z",
        }),
      );
      for (const key of localKeys.slice(1)) {
        localStorage.setItem(key, `fixture:${key}`);
      }
      sessionStorage.setItem(reviewKey, "review-context");
      localStorage.setItem("unrelated.token", "preserved");
      sessionStorage.setItem("gvo:orientation-hint:dismissed", "1");
    },
    {
      localKeys: [
        GLOBAL_PROGRESS_KEY,
        WORLD1_CHECKPOINT_KEY,
        WORLD2_CHECKPOINT_KEY,
        WORLD3_CHECKPOINT_KEY,
        WORLD4_CHECKPOINT_KEY,
        WORLD5_PROGRESS_KEY,
        COVER_PROGRESS_KEY,
      ],
      reviewKey: REVIEW_CONTEXT_KEY,
    },
  );
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-action="open_restart_confirmation"]').click();
  await page
    .locator('[data-final-action="confirm_restart_transaction"]')
    .click();
  await expect(page).toHaveURL(/\/portada$/, { timeout: 10_000 });

  expect(
    await page.evaluate(
      ({ localKeys, reviewKey }) => ({
        local: localKeys.map((key) => localStorage.getItem(key)),
        orientation: sessionStorage.getItem("gvo:orientation-hint:dismissed"),
        review: sessionStorage.getItem(reviewKey),
        unrelated: localStorage.getItem("unrelated.token"),
      }),
      {
        localKeys: [
          GLOBAL_PROGRESS_KEY,
          WORLD1_CHECKPOINT_KEY,
          WORLD2_CHECKPOINT_KEY,
          WORLD3_CHECKPOINT_KEY,
          WORLD4_CHECKPOINT_KEY,
          WORLD5_PROGRESS_KEY,
          COVER_PROGRESS_KEY,
        ],
        reviewKey: REVIEW_CONTEXT_KEY,
      },
    ),
  ).toEqual({
    local: [null, null, null, null, null, null, null],
    orientation: "1",
    review: null,
    unrelated: "preserved",
  });
});
