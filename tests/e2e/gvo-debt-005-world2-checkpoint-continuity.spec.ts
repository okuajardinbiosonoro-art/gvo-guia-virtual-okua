import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD1_CHECKPOINT_KEY = "gvo.station1.v1";
const WORLD2_CHECKPOINT_KEY = "gvo.station2.v1";
const WORLD4_CHECKPOINT_KEY = "gvo.station4.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const COVER_PROGRESS_KEY = "gvo.coverIntro.introCompleted.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";

const localJourneyKeys = [
  GLOBAL_PROGRESS_KEY,
  WORLD1_CHECKPOINT_KEY,
  WORLD2_CHECKPOINT_KEY,
  WORLD4_CHECKPOINT_KEY,
  WORLD5_PROGRESS_KEY,
  COVER_PROGRESS_KEY,
];

test.setTimeout(150_000);

async function openWorld2Fresh(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ globalKey, localKeys, reviewKey }) => {
      localKeys.forEach((key) => localStorage.removeItem(key));
      sessionStorage.removeItem(reviewKey);
      localStorage.setItem(
        globalKey,
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1],
          updatedAt: "2026-08-05T19:00:00.000Z",
        }),
      );
    },
    {
      globalKey: GLOBAL_PROGRESS_KEY,
      localKeys: localJourneyKeys,
      reviewKey: REVIEW_CONTEXT_KEY,
    },
  );
  await page.goto("/estacion/2", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/estacion\/2$/);
}

async function completeCaptureThroughMapping(page: Page) {
  const root = page.locator("[data-world2-state]");
  if ((await root.getAttribute("data-world2-active-layer")) === "planta_viva") {
    const contact = page.locator('[data-plant-contact-hotspot="016J"]');
    if ((await contact.getAttribute("aria-expanded")) !== "true") {
      await contact.click();
    }
    await page.locator('[data-world2-layer="senal"]').click();
  }

  const signal = page.locator(
    '[data-world2-signal-reveal-control="onda-medida"]',
  );
  if (await signal.isVisible()) {
    if ((await signal.getAttribute("aria-pressed")) !== "true") {
      await signal.click();
    }
    await page.locator('[data-world2-layer="captura"]').click();
  }

  const capture = page.locator('[data-world2-capture-timeline="016R"]');
  if (await capture.isVisible()) {
    if ((await capture.getAttribute("data-world2-capture-complete")) !== "true") {
      await page
        .getByRole("button", { name: "Mostrar paso 2: Señal tomada" })
        .click();
      await page
        .getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })
        .click();
    }
    await page.locator('[data-world2-layer="acondicionamiento"]').click();
  }

  await page.locator('[data-world2-layer="mapeo"]').click();
  await expect(root).toHaveAttribute("data-world2-active-layer", "mapeo");
}

async function installWorld2WriteFailureSwitch(page: Page) {
  await page.evaluate((checkpointKey) => {
    const scope = window as typeof window & {
      __gvoDebt005FailWorld2Writes?: number;
    };
    const nativeSetItem = Storage.prototype.setItem;
    scope.__gvoDebt005FailWorld2Writes = 0;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      const remaining = scope.__gvoDebt005FailWorld2Writes ?? 0;
      if (storageKey === checkpointKey && remaining > 0) {
        scope.__gvoDebt005FailWorld2Writes = remaining - 1;
        throw new Error("Synthetic GVO_DEBT_005 W2 write failure");
      }
      nativeSetItem.call(this, storageKey, value);
    };
  }, WORLD2_CHECKPOINT_KEY);
}

async function failNextWorld2Write(page: Page, count = 1) {
  await page.evaluate((nextCount) => {
    const scope = window as typeof window & {
      __gvoDebt005FailWorld2Writes?: number;
    };
    scope.__gvoDebt005FailWorld2Writes = nextCount;
  }, count);
}

async function completedStations(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).completedStations : null;
  }, GLOBAL_PROGRESS_KEY);
}

async function expectSameWorld2State(page: Page, expected: string) {
  await expect(page.locator("[data-world2-state]")).toHaveAttribute(
    "data-world2-active-layer",
    expected,
  );
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
});

test("GVO_DEBT_005 recorrido parcial restaura readouts, Captura, visited y gates", async ({
  page,
}) => {
  await openWorld2Fresh(page);
  const root = page.locator("[data-world2-state]");
  await expect(root).toHaveAttribute("data-world2-active-layer", "planta_viva");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), WORLD2_CHECKPOINT_KEY),
  ).toBeNull();

  await page.locator('[data-plant-contact-hotspot="016J"]').click();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(
    page.locator('[data-plant-contact-hotspot="016J"]'),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('[data-world2-layer="senal"]')).toHaveAttribute(
    "data-layer-state",
    "next",
  );

  await page.locator('[data-world2-layer="senal"]').click();
  await page
    .locator('[data-world2-signal-reveal-control="onda-medida"]')
    .click();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expectSameWorld2State(page, "senal");
  await expect(
    page.locator('[data-world2-signal-reveal-control="onda-medida"]'),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-world2-layer="captura"]')).toHaveAttribute(
    "data-layer-state",
    "next",
  );

  await page.locator('[data-world2-layer="captura"]').click();
  const timeline = page.locator('[data-world2-capture-timeline="016R"]');
  await page
    .getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })
    .click();
  await expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
  await page
    .getByRole("button", { name: "Mostrar paso 2: Señal tomada" })
    .click();
  await page
    .getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })
    .click();
  await page
    .getByRole("button", { name: "Mostrar paso 1: Contacto" })
    .click();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
  await expect(timeline).toHaveAttribute(
    "data-world2-capture-visited",
    "contact,signal,system",
  );
  await expect(page.locator('[data-world2-layer="acondicionamiento"]')).toHaveAttribute(
    "data-layer-state",
    "next",
  );
  await expect(root).toHaveAttribute("data-world2-visited-layers", "1,2,3");
  await expect(root).toHaveAttribute("data-world2-highest-unlocked-layer", "4");
});

test("GVO_DEBT_005 Mapeo y Resultado reinician pending y conservan complete", async ({
  page,
}) => {
  await openWorld2Fresh(page);
  await completeCaptureThroughMapping(page);
  const mapping = page.locator(
    '[data-world2-mapping-mode="sequential-pedagogic-r2"]',
  );
  await expect(mapping).toHaveAttribute("data-world2-mapping-step", "1");
  await expect(mapping).toHaveAttribute("data-world2-mapping-step", "2", {
    timeout: 5_000,
  });

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(mapping).toHaveAttribute("data-world2-mapping-step", "1");
  await expect(mapping).toHaveAttribute(
    "data-world2-mapping-review-enabled",
    "true",
    { timeout: 12_000 },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(mapping).toHaveAttribute("data-world2-mapping-step", "3");
  await expect(mapping).toHaveAttribute("data-world2-mapping-controls", "review");

  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  const result = page.locator(
    '[data-world2-option6-mode="final-sonic-convergence"]',
  );
  await expect(result).toHaveAttribute("data-world2-option6-stage", "rhythm", {
    timeout: 3_500,
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(result).toHaveAttribute("data-world2-option6-stage", "intensity");
  await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible({
    timeout: 12_000,
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(result).toHaveAttribute("data-world2-option6-stage", "resolved");
  await expect(result).toHaveAttribute("data-world2-option6-complete", "true");

  expect(await completedStations(page)).toEqual([1]);
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect.poll(() => completedStations(page)).toEqual([1, 2]);
  await expect(page).toHaveURL(/\/(transition\/world-2-to-world-3|estacion\/3)$/i, {
    timeout: 10_000,
  });
});

test("GVO_DEBT_005 error y retry preservan UI y no repiten timers", async ({
  page,
}) => {
  await openWorld2Fresh(page);
  await installWorld2WriteFailureSwitch(page);
  await failNextWorld2Write(page);
  const contact = page.locator('[data-plant-contact-hotspot="016J"]');
  await contact.dblclick();
  await expect(contact).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator('[data-world2-layer="senal"]')).toHaveAttribute(
    "data-layer-state",
    "next-but-gated",
  );
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused();
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(contact).toHaveAttribute("aria-expanded", "true");

  await completeCaptureThroughMapping(page);
  await expect(
    page.locator('[data-world2-mapping-review-enabled="true"]'),
  ).toBeVisible({ timeout: 12_000 });
  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  await failNextWorld2Write(page);
  const result = page.locator(
    '[data-world2-option6-mode="final-sonic-convergence"]',
  );
  await expect(result).toHaveAttribute("data-world2-option6-stage", "resolved", {
    timeout: 7_000,
  });
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused({
    timeout: 4_000,
  });
  await expect(page.getByRole("button", { name: "Continuar" })).toHaveCount(0);
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible();
  await expect(result).toHaveAttribute("data-world2-option6-stage", "resolved");
  await page.waitForTimeout(2_500);
  await expect(result).toHaveAttribute("data-world2-option6-stage", "resolved");
});

async function seedCompletedReviewState(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ globalKey, checkpointKey }) => {
      localStorage.setItem(
        globalKey,
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3, 4, 5],
          updatedAt: "2026-08-05T20:00:00.000Z",
        }),
      );
      localStorage.setItem(
        checkpointKey,
        JSON.stringify({
          activeLayerId: "senal",
          visitedLayerIds: [
            "planta_viva",
            "senal",
            "captura",
            "acondicionamiento",
            "mapeo",
            "resultado_mediado",
          ],
          highestUnlockedLayerOrder: 6,
          completedRequiredInteractions: [
            "plant_contact_readout_seen",
            "signal_measured_wave_seen",
            "capture_data_readout_seen",
          ],
          capture: {
            currentStepId: "contact",
            visitedStepIds: ["contact", "signal", "system"],
          },
          mappingFirstRunComplete: true,
          resultState: "ready_to_continue",
          schemaVersion: 1,
          updatedAt: "2026-08-05T20:01:00.000Z",
        }),
      );
    },
    { checkpointKey: WORLD2_CHECKPOINT_KEY, globalKey: GLOBAL_PROGRESS_KEY },
  );
}

async function expectWorld2Review(page: Page) {
  await expect(page).toHaveURL(/\/estacion\/2$/);
  await expectSameWorld2State(page, "senal");
  await expect(page.locator("[data-world2-state]")).toHaveAttribute(
    "data-world2-result-state",
    "ready_to_continue",
  );
}

async function openReopenedWorld2(context: BrowserContext) {
  const reopened = await context.newPage();
  await reopened.emulateMedia({ reducedMotion: "reduce" });
  await reopened.goto("/estacion/2", { waitUntil: "domcontentloaded" });
  return reopened;
}

test("GVO_DEBT_005 reapertura, revisita desde Final y reset de siete keys", async ({
  context,
  page,
}) => {
  await seedCompletedReviewState(page);
  await page.goto("/estacion/2", { waitUntil: "domcontentloaded" });
  await expectWorld2Review(page);

  const reopened = await openReopenedWorld2(context);
  await expectWorld2Review(reopened);
  await reopened.close();

  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="2"]').click();
  await expectWorld2Review(page);
  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible();
  await expect(
    page.locator('[data-world2-option6-stage="resolved"]'),
  ).toBeVisible();

  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ localKeys, reviewKey }) => {
      localKeys.forEach((key) => {
        if (!localStorage.getItem(key)) localStorage.setItem(key, `raw:${key}`);
      });
      sessionStorage.setItem(reviewKey, "review-context");
      localStorage.setItem("gvo:accessibility:contrast", "high");
      sessionStorage.setItem("gvo:world4:tap-hint:shown", "1");
    },
    { localKeys: localJourneyKeys, reviewKey: REVIEW_CONTEXT_KEY },
  );
  await page.locator('[data-final-action="open_restart_confirmation"]').click();
  await page
    .locator('[data-final-action="confirm_restart_transaction"]')
    .click();
  await expect(page).toHaveURL(/\/portada$/, { timeout: 10_000 });
  expect(
    await page.evaluate(
      ({ localKeys, reviewKey }) => ({
        local: localKeys.map((key) => localStorage.getItem(key)),
        review: sessionStorage.getItem(reviewKey),
        contrast: localStorage.getItem("gvo:accessibility:contrast"),
        hint: sessionStorage.getItem("gvo:world4:tap-hint:shown"),
      }),
      { localKeys: localJourneyKeys, reviewKey: REVIEW_CONTEXT_KEY },
    ),
  ).toEqual({
    local: [null, null, null, null, null, null],
    review: null,
    contrast: "high",
    hint: "1",
  });
});
