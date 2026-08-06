import { expect, test, type Page } from "@playwright/test";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD1_CHECKPOINT_KEY = "gvo.station1.v1";
const WORLD2_CHECKPOINT_KEY = "gvo.station2.v1";
const WORLD4_CHECKPOINT_KEY = "gvo.station4.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const COVER_PROGRESS_KEY = "gvo.coverIntro.introCompleted.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";
const SYNTHETIC_GLOBAL_FAILURE_KEY = "gvo-debt-004:fail-global-write";

test.setTimeout(120_000);

async function openCleanOrigin(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ localKeys, reviewKey, syntheticFailureKey }) => {
      localKeys.forEach((key) => localStorage.removeItem(key));
      sessionStorage.removeItem(reviewKey);
      sessionStorage.removeItem(syntheticFailureKey);
    },
    {
      localKeys: [
        GLOBAL_PROGRESS_KEY,
        WORLD1_CHECKPOINT_KEY,
        WORLD2_CHECKPOINT_KEY,
        WORLD4_CHECKPOINT_KEY,
        WORLD5_PROGRESS_KEY,
        COVER_PROGRESS_KEY,
      ],
      reviewKey: REVIEW_CONTEXT_KEY,
      syntheticFailureKey: SYNTHETIC_GLOBAL_FAILURE_KEY,
    },
  );
}

async function completedStations(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).completedStations : null;
  }, GLOBAL_PROGRESS_KEY);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await openCleanOrigin(page);
});

test("GVO_DEBT_004 W1 conserva active/highest, retry, reload, nueva pestaña y revisita", async ({
  context,
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/estacion/1", { waitUntil: "domcontentloaded" });
  const root = page.locator(".world1-root-screen");
  await expect(root).toHaveAttribute("data-world1-root-state", "intro");
  await expect(root).toHaveAttribute("data-world1-highest-reached", "intro");

  await page.evaluate((key) => {
    const scope = window as typeof window & {
      __gvoDebt004FailWorld1?: boolean;
    };
    const nativeSetItem = Storage.prototype.setItem;
    scope.__gvoDebt004FailWorld1 = true;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === key && scope.__gvoDebt004FailWorld1) {
        throw new Error("Synthetic GVO_DEBT_004 W1 write failure");
      }
      nativeSetItem.call(this, storageKey, value);
    };
  }, WORLD1_CHECKPOINT_KEY);

  await page.getByRole("button", { name: "Explorar RELACIÓN" }).click();
  await expect(root).toHaveAttribute("data-world1-root-state", "intro");
  await expect(
    page.getByText("No fue posible guardar tu progreso. Intenta nuevamente."),
  ).toBeVisible();
  await page.evaluate(() => {
    const scope = window as typeof window & {
      __gvoDebt004FailWorld1?: boolean;
    };
    scope.__gvoDebt004FailWorld1 = false;
  });
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(root).toHaveAttribute("data-world1-root-state", "relation");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-world1-root-state", "relation");
  await page.getByRole("button", { name: "Explorar PERCEPCIÓN" }).click();
  await page.getByRole("button", { name: "Explorar RELACIÓN" }).click();
  await expect(root).toHaveAttribute(
    "data-world1-highest-reached",
    "perception",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  const perception = page.locator('[data-world1-root-node="perception"]');
  await expect(perception).toHaveAttribute("data-node-state", "completed");
  await expect(perception).toBeEnabled();
  await perception.click();
  await page.getByRole("button", { name: "Explorar MEDIACIÓN" }).click();
  await page.getByRole("button", { name: "Cerrar raíz" }).click();
  await expect(root).toHaveAttribute(
    "data-world1-root-state",
    "ready_to_continue",
  );
  expect(await completedStations(page)).toBeNull();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute(
    "data-world1-root-state",
    "ready_to_continue",
  );
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page).toHaveURL(/\/estacion\/2$/, { timeout: 10_000 });
  expect(await completedStations(page)).toEqual([1]);

  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-08-05T14:00:00.000Z",
      }),
    );
  }, GLOBAL_PROGRESS_KEY);
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="1"]').click();
  await expect(page).toHaveURL(/\/estacion\/1$/);
  await expect(root).toHaveAttribute(
    "data-world1-highest-reached",
    "ready_to_continue",
  );

  const reopened = await context.newPage();
  await reopened.emulateMedia({ reducedMotion: "reduce" });
  await reopened.goto("/estacion/1", { waitUntil: "domcontentloaded" });
  await expect(reopened.locator(".world1-root-screen")).toHaveAttribute(
    "data-world1-root-state",
    "ready_to_continue",
  );
  await reopened.close();
});

test("GVO_DEBT_004 W4 restaura reading, chain_pending, completion_retry y revisita", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.addInitScript(
    ({ globalKey, syntheticFailureKey }) => {
      const nativeSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItem(storageKey, value) {
        if (
          storageKey === globalKey &&
          sessionStorage.getItem(syntheticFailureKey) === "true"
        ) {
          throw new Error("Synthetic GVO_DEBT_004 global write failure");
        }
        nativeSetItem.call(this, storageKey, value);
      };
    },
    {
      globalKey: GLOBAL_PROGRESS_KEY,
      syntheticFailureKey: SYNTHETIC_GLOBAL_FAILURE_KEY,
    },
  );
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3],
        updatedAt: "2026-08-05T14:00:00.000Z",
      }),
    );
  }, GLOBAL_PROGRESS_KEY);
  await page.goto("/estacion/4", { waitUntil: "domcontentloaded" });
  const root = page.locator("[data-station4-state]");
  const plant = page.locator('[data-station4-node="planta"]');
  await expect(plant).toHaveAttribute("data-node-state", "available");
  await plant.click();
  await expect(root).toHaveAttribute("data-station4-progress", "1");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-station4-entry-mode", "abbreviated");
  await expect(root).toHaveAttribute("data-station4-progress", "1");
  await expect(
    page.locator('[data-station4-node="bionosificador"]'),
  ).toHaveAttribute("data-node-state", "available");

  await page.evaluate(
    ({ checkpointKey, syntheticFailureKey }) => {
      localStorage.setItem(
        checkpointKey,
        JSON.stringify({
          highestSettledIndex: 7,
          resumeMode: "chain_pending",
          schemaVersion: 1,
          updatedAt: "2026-08-05T14:01:00.000Z",
        }),
      );
      sessionStorage.setItem(syntheticFailureKey, "true");
    },
    {
      checkpointKey: WORLD4_CHECKPOINT_KEY,
      syntheticFailureKey: SYNTHETIC_GLOBAL_FAILURE_KEY,
    },
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute(
    "data-station4-resume-mode",
    "chain_pending",
  );
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw).resumeMode : null;
      }, WORLD4_CHECKPOINT_KEY),
    )
    .toBe("completion_retry");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute(
    "data-station4-resume-mode",
    "completion_retry",
  );
  await expect(root).toHaveAttribute("data-station4-motion-kind", "none");
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused();
  await page.evaluate(
    (key) => sessionStorage.setItem(key, "false"),
    SYNTHETIC_GLOBAL_FAILURE_KEY,
  );
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page).toHaveURL(/\/estacion\/4$/);
  expect(await completedStations(page)).toEqual([1, 2, 3, 4]);
  expect(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      WORLD4_CHECKPOINT_KEY,
    ),
  ).toBeNull();

  await page
    .getByRole("button", {
      name: "Abrir Mundo V. Ir al Mapa del presente.",
    })
    .click();
  await expect(page).toHaveURL(/\/estacion\/5$/, { timeout: 10_000 });

  await page.goto("/estacion/4", { waitUntil: "domcontentloaded" });
  await expect(root).toHaveAttribute("data-station4-progress", "8");
  await expect(plant).toHaveAttribute("data-node-state", "completed");
  await plant.click();
  await expect(plant).toHaveAttribute("data-node-state", "active");
});

test("GVO_DEBT_004 reset real elimina siete keys y preserva familias ajenas", async ({
  page,
}) => {
  const sevenKeys = [
    GLOBAL_PROGRESS_KEY,
    WORLD1_CHECKPOINT_KEY,
    WORLD2_CHECKPOINT_KEY,
    WORLD4_CHECKPOINT_KEY,
    WORLD5_PROGRESS_KEY,
    COVER_PROGRESS_KEY,
  ];
  await page.evaluate(
    ({ localKeys, reviewKey }) => {
      localStorage.setItem(
        localKeys[0],
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3, 4, 5],
          updatedAt: "2026-08-05T14:00:00.000Z",
        }),
      );
      localStorage.setItem(localKeys[1], "{corrupt-world-one");
      localStorage.setItem(localKeys[2], '{"schemaVersion":99}');
      localStorage.setItem(localKeys[3], '{"schemaVersion":77}');
      localStorage.setItem(localKeys[4], "world-five-state");
      localStorage.setItem(localKeys[5], "true");
      sessionStorage.setItem(reviewKey, "review-context");
      localStorage.setItem("gvo:accessibility:contrast", "high");
      sessionStorage.setItem("gvo:world4:tap-hint:shown", "1");
    },
    { localKeys: sevenKeys, reviewKey: REVIEW_CONTEXT_KEY },
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
        review: sessionStorage.getItem(reviewKey),
      }),
      { localKeys: sevenKeys, reviewKey: REVIEW_CONTEXT_KEY },
    ),
  ).toEqual({ local: [null, null, null, null, null, null], review: null });
  expect(
    await page.evaluate(() => ({
      contrast: localStorage.getItem("gvo:accessibility:contrast"),
      tapHint: sessionStorage.getItem("gvo:world4:tap-hint:shown"),
    })),
  ).toEqual({ contrast: "high", tapHint: "1" });
});
