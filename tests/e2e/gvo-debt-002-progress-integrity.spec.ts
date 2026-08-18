import { expect, test, type Page } from "@playwright/test";

import {
  installInterstationQrTestMode,
  scanInterstationQrForTest,
} from "./support/interstation-qr";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD1_CHECKPOINT_KEY = "gvo.station1.v1";
const WORLD2_CHECKPOINT_KEY = "gvo.station2.v1";
const WORLD3_CHECKPOINT_KEY = "gvo.station3.v1";
const WORLD4_CHECKPOINT_KEY = "gvo.station4.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const COVER_PROGRESS_KEY = "gvo.coverIntro.introCompleted.v1";
const REVIEW_CONTEXT_KEY = "gvo.final.reviewContext.v1";

type JourneyFixture = {
  completedStations?: number[];
  legacy?: boolean;
  world5Areas?: string[];
  coverComplete?: boolean;
};

async function seedJourney(page: Page, fixture: JourneyFixture = {}) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({
      completedStations,
      legacy,
      world5Areas,
      coverComplete,
      globalKey,
      world1Key,
      world2Key,
      world3Key,
      world4Key,
      world5Key,
      coverKey,
      reviewKey,
    }) => {
      localStorage.removeItem(globalKey);
      localStorage.removeItem(world1Key);
      localStorage.removeItem(world2Key);
      localStorage.removeItem(world3Key);
      localStorage.removeItem(world4Key);
      localStorage.removeItem(world5Key);
      localStorage.removeItem(coverKey);
      sessionStorage.removeItem(reviewKey);

      if (completedStations !== undefined) {
        localStorage.setItem(
          globalKey,
          JSON.stringify({
            ...(legacy ? {} : { schemaVersion: 1 }),
            completedStations,
            updatedAt: "2026-08-05T12:00:00.000Z",
          }),
        );
      }
      if (world5Areas !== undefined) {
        localStorage.setItem(
          world5Key,
          JSON.stringify({
            schemaVersion: 1,
            completedAreas: world5Areas,
            updatedAt: "2026-08-05T12:00:00.000Z",
          }),
        );
      }
      if (coverComplete) {
        localStorage.setItem(coverKey, "true");
      }
    },
    {
      ...fixture,
      globalKey: GLOBAL_PROGRESS_KEY,
      world1Key: WORLD1_CHECKPOINT_KEY,
      world2Key: WORLD2_CHECKPOINT_KEY,
      world3Key: WORLD3_CHECKPOINT_KEY,
      world4Key: WORLD4_CHECKPOINT_KEY,
      world5Key: WORLD5_PROGRESS_KEY,
      coverKey: COVER_PROGRESS_KEY,
      reviewKey: REVIEW_CONTEXT_KEY,
    },
  );
}

async function readCompletedStations(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).completedStations : null;
  }, GLOBAL_PROGRESS_KEY);
}

async function gotoGuarded(page: Page, route: string) {
  try {
    await page.goto(route, { waitUntil: "commit", timeout: 15_000 });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("ERR_ABORTED")) {
      throw error;
    }
  }
}

async function expectTransitionThenDestination(
  page: Page,
  transitionId: string,
  destination: RegExp,
) {
  await expect(page).toHaveURL(new RegExp(`/transition/${transitionId}$`), {
    timeout: 5_000,
  });
  const transition = page.locator(
    `[data-transition-world-id="${transitionId}"]`,
  );
  await expect(transition).toBeVisible();
  await expect(transition).toHaveAttribute("data-duration-ms", "2300");
  await expect(transition).toHaveAttribute(
    "data-critical-assets-ready",
    "true",
    {
      timeout: 15_000,
    },
  );
  await expect(page).toHaveURL(destination, { timeout: 20_000 });
}

async function completeWorld3Record(
  page: Page,
  record: "planta" | "prototipo" | "senal",
) {
  await page
    .locator(`.s3-page--base [data-station3-record="${record}"]`)
    .first()
    .click();
  const confirm = page.locator(`[data-station3-record-confirm="${record}"]`);
  await expect(confirm).toBeVisible({ timeout: 35_000 });
  await confirm.click();
  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    /station3_(index|prototype_unlocked|signal_unlocked|adjusted_unlocked|ready_to_continue)/,
    { timeout: 10_000 },
  );
}

test.beforeEach(async ({ page }) => {
  await installInterstationQrTestMode(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
});

test("GVO_DEBT_002 bloquea entradas directas y transiciones hacia el destino seguro", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await seedJourney(page);

  await page.goto("/estacion/1", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/estacion\/1$/);

  for (const route of [
    "/estacion/2",
    "/estacion/3",
    "/estacion/4",
    "/estacion/5",
    "/estacion/5/visitante",
    "/final",
  ]) {
    await gotoGuarded(page, route);
    await expect(page).toHaveURL(/\/estacion\/1$/);
  }

  await seedJourney(page, { completedStations: [1] });
  await gotoGuarded(page, "/transition/world-3-to-world-4");
  await expect(page).toHaveURL(/\/estacion\/2$/);
});

test("GVO_DEBT_002 completa W1, W2 y W3 sólo desde sus cierres UI reales", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await seedJourney(page);
  await page.goto("/estacion/1", { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "Explorar RELACIÓN" }).click();
  await page.getByRole("button", { name: "Explorar PERCEPCIÓN" }).click();
  await page.getByRole("button", { name: "Explorar MEDIACIÓN" }).click();
  expect(await readCompletedStations(page)).toBeNull();
  await page.getByRole("button", { name: "Cerrar raíz" }).click();
  expect(await readCompletedStations(page)).toBeNull();
  await scanInterstationQrForTest(page, 1);
  await expectTransitionThenDestination(
    page,
    "world-1-to-world-2",
    /\/estacion\/2$/,
  );
  expect(await readCompletedStations(page)).toEqual([1]);

  await page.locator('[data-plant-contact-hotspot="016J"]').click();
  await page.locator('[data-world2-layer="senal"]').click();
  await page
    .locator('[data-world2-signal-reveal-control="onda-medida"]')
    .click();
  await page.locator('[data-world2-layer="captura"]').click();
  await page
    .getByRole("button", { name: "Mostrar paso 2: Señal tomada" })
    .click();
  await page
    .getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })
    .click();
  await page.locator('[data-world2-layer="acondicionamiento"]').click();
  await page.locator('[data-world2-layer="mapeo"]').click();
  expect(await readCompletedStations(page)).toEqual([1]);
  await expect(
    page.locator('[data-world2-mapping-review-enabled="true"]'),
  ).toBeVisible({ timeout: 15_000 });
  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  await scanInterstationQrForTest(page, 2);
  await expectTransitionThenDestination(
    page,
    "world-2-to-world-3",
    /\/estacion\/3$/,
  );
  expect(await readCompletedStations(page)).toEqual([1, 2]);

  await expect(page.locator("[data-station3-state]")).toHaveAttribute(
    "data-station3-state",
    "station3_index",
    { timeout: 5_000 },
  );
  await completeWorld3Record(page, "planta");
  expect(await readCompletedStations(page)).toEqual([1, 2]);
  await completeWorld3Record(page, "prototipo");
  expect(await readCompletedStations(page)).toEqual([1, 2]);
  await completeWorld3Record(page, "senal");
  await scanInterstationQrForTest(page, 3);
  await expect(page).toHaveURL(/\/transition\/world-3-to-world-4$/, {
    timeout: 5_000,
  });
  expect(await readCompletedStations(page)).toEqual([1, 2, 3]);
});

test("GVO_DEBT_002 conserva completion de W4 y W5 sin regresión", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await seedJourney(page, { completedStations: [1, 2, 3] });
  await page.goto("/estacion/4", { waitUntil: "domcontentloaded" });

  for (const node of [
    "planta",
    "bionosificador",
    "esp32",
    "midi",
    "wifi_udp",
    "router",
    "sistema_central",
    "sonido",
  ]) {
    const control = page.locator(`[data-station4-node="${node}"]`);
    await expect(control).toHaveAttribute("data-node-state", "available", {
      timeout: 10_000,
    });
    await control.click();
  }

  await expect.poll(() => readCompletedStations(page)).toEqual([1, 2, 3]);
  await scanInterstationQrForTest(page, 4);
  await expectTransitionThenDestination(
    page,
    "world-4-to-world-5",
    /\/estacion\/5$/,
  );

  await seedJourney(page, {
    completedStations: [1, 2, 3, 4],
    world5Areas: ["plantas", "sistema", "espacio", "visitante"],
  });
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Ir al cierre" }).click();
  await expectTransitionThenDestination(page, "world-5-to-final", /\/final$/);
  expect(await readCompletedStations(page)).toEqual([1, 2, 3, 4, 5]);
});

test("GVO_DEBT_002 preserva legacy disperso sin desbloquear huecos", async ({
  page,
}) => {
  await seedJourney(page, {
    completedStations: [4, 5],
    legacy: true,
    world5Areas: ["plantas", "sistema", "espacio", "visitante"],
  });
  const rawBefore = await page.evaluate(
    (key) => localStorage.getItem(key),
    GLOBAL_PROGRESS_KEY,
  );

  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/estacion\/1$/);
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/estacion\/1$/);
  expect(
    await page.evaluate(
      (key) => localStorage.getItem(key),
      GLOBAL_PROGRESS_KEY,
    ),
  ).toBe(rawBefore);
});

test("GVO_DEBT_002 bloquea navegación, enfoca retry y verifica al reintentar", async ({
  page,
}) => {
  await seedJourney(page, {
    completedStations: [1, 2, 3, 4],
    world5Areas: ["plantas", "sistema", "espacio", "visitante"],
  });
  await page.goto("/estacion/5", { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => {
    const scope = window as typeof window & { __gvoDebt002FailWrite?: boolean };
    const originalSetItem = Storage.prototype.setItem;
    scope.__gvoDebt002FailWrite = true;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === key && scope.__gvoDebt002FailWrite) {
        throw new Error("Synthetic GVO_DEBT_002 storage failure");
      }
      return originalSetItem.call(this, storageKey, value);
    };
  }, GLOBAL_PROGRESS_KEY);

  await page.getByRole("button", { name: "Ir al cierre" }).click();
  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.getByRole("status")).toContainText(
    "No fue posible guardar tu progreso. Intenta nuevamente.",
  );
  await expect(page.getByRole("button", { name: "Reintentar" })).toBeFocused();
  expect(await readCompletedStations(page)).toEqual([1, 2, 3, 4]);

  await page.evaluate(() => {
    const scope = window as typeof window & { __gvoDebt002FailWrite?: boolean };
    scope.__gvoDebt002FailWrite = false;
  });
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page).toHaveURL(/\/final$/, { timeout: 10_000 });
  expect(await readCompletedStations(page)).toEqual([1, 2, 3, 4, 5]);
});

test("GVO_DEBT_002 conserva revisita y la invalida si Final deja de estar autorizado", async ({
  page,
}) => {
  await seedJourney(page, { completedStations: [1, 2, 3, 4, 5] });
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="1"]').click();
  await expect(page).toHaveURL(/\/estacion\/1$/);
  await expect(
    page.getByRole("button", { name: "Volver al Mirador" }),
  ).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("button", { name: "Volver al Mirador" }),
  ).toBeVisible();
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1],
        updatedAt: "2026-08-05T12:05:00.000Z",
      }),
    );
  }, GLOBAL_PROGRESS_KEY);
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/estacion\/1$/);
  await expect(
    page.getByRole("button", { name: "Volver al Mirador" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      (key) => sessionStorage.getItem(key),
      REVIEW_CONTEXT_KEY,
    ),
  ).toBeNull();
});

test("GVO_DEBT_002 conserva la allowlist de reset y reinicia los guards", async ({
  page,
}) => {
  await seedJourney(page, {
    completedStations: [1, 2, 3, 4, 5],
    world5Areas: ["plantas", "sistema", "espacio", "visitante"],
    coverComplete: true,
  });
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ world1Key, world2Key, world3Key, world4Key }) => {
      localStorage.setItem(world1Key, "world-one-checkpoint");
      localStorage.setItem(world2Key, "world-two-checkpoint");
      localStorage.setItem(world3Key, "world-three-checkpoint");
      localStorage.setItem(world4Key, "world-four-checkpoint");
    },
    {
      world1Key: WORLD1_CHECKPOINT_KEY,
      world2Key: WORLD2_CHECKPOINT_KEY,
      world3Key: WORLD3_CHECKPOINT_KEY,
      world4Key: WORLD4_CHECKPOINT_KEY,
    },
  );
  await page.locator('[data-final-action="open_restart_confirmation"]').click();
  await page
    .locator('[data-final-action="confirm_restart_transaction"]')
    .click();
  await expect(page).toHaveURL(/\/portada$/, { timeout: 10_000 });

  expect(
    await page.evaluate(
      (keys) => keys.map((key) => localStorage.getItem(key)),
      [
        GLOBAL_PROGRESS_KEY,
        WORLD1_CHECKPOINT_KEY,
        WORLD2_CHECKPOINT_KEY,
        WORLD3_CHECKPOINT_KEY,
        WORLD4_CHECKPOINT_KEY,
        WORLD5_PROGRESS_KEY,
        COVER_PROGRESS_KEY,
      ],
    ),
  ).toEqual([null, null, null, null, null, null, null]);
  expect(
    await page.evaluate(
      (key) => sessionStorage.getItem(key),
      REVIEW_CONTEXT_KEY,
    ),
  ).toBeNull();

  await page.goto("/estacion/2", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/estacion\/1$/);
});
