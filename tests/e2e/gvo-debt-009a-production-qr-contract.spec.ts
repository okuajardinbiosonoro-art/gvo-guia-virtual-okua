import { expect, test, type Page } from "@playwright/test";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const CHECKPOINT_SENTINEL_KEY = "gvo.debt009a.checkpoint.sentinel";

async function installStorageSnapshot(page: Page, completedStations: number[]) {
  const snapshot = {
    [CHECKPOINT_SENTINEL_KEY]: "preserve-exactly",
    [GLOBAL_PROGRESS_KEY]: JSON.stringify({
      completedStations,
      schemaVersion: 1,
      updatedAt: "2026-08-13T12:00:00.000Z",
    }),
  };

  await page.addInitScript((initialStorage) => {
    for (const [key, value] of Object.entries(initialStorage)) {
      localStorage.setItem(key, value);
    }

    const mediaDevices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: mediaDevices,
    });
    Object.defineProperty(mediaDevices, "getUserMedia", {
      configurable: true,
      value: async () => {
        throw new Error("DEBT 009A must never request camera access");
      },
    });
  }, snapshot);

  return snapshot;
}

async function readStorageSnapshot(page: Page) {
  return page.evaluate(
    ({ checkpointKey, progressKey }) => ({
      [checkpointKey]: localStorage.getItem(checkpointKey),
      [progressKey]: localStorage.getItem(progressKey),
    }),
    {
      checkpointKey: CHECKPOINT_SENTINEL_KEY,
      progressKey: GLOBAL_PROGRESS_KEY,
    },
  );
}

test("QR-START abre el inicio del recorrido sin QR de Mundo I", async ({
  page,
}) => {
  const snapshot = await installStorageSnapshot(page, [1, 2]);

  await page.goto("/qr/start?station=5", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".loading-initial")).toBeAttached();
  expect(await readStorageSnapshot(page)).toEqual(snapshot);
});

test("QR-W2 a QR-W5 resuelven mediante el guard canónico", async ({ page }) => {
  const snapshot = await installStorageSnapshot(page, [1, 2, 3, 4, 5]);

  for (const stationId of [2, 3, 4, 5]) {
    await page.goto(`/qr/w${stationId}`, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(new RegExp(`/estacion/${stationId}$`));
    expect(await readStorageSnapshot(page)).toEqual(snapshot);
  }
});

test("progreso insuficiente aplica fallback sin conceder saltos", async ({
  page,
}) => {
  const snapshot = await installStorageSnapshot(page, [1]);

  await page.goto("/qr/w5?completedStations=1,2,3,4", {
    waitUntil: "domcontentloaded",
  });

  await expect(page).toHaveURL(/\/estacion\/2$/);
  expect(await readStorageSnapshot(page)).toEqual(snapshot);
});

test("identificadores legacy, inválidos y manipulados caen al fallback", async ({
  page,
}) => {
  const snapshot = await installStorageSnapshot(page, [1, 2]);

  for (const route of [
    "/qr",
    "/qr/1",
    "/qr/2",
    "/qr/w1",
    "/qr/w6",
    "/qr/W3",
    "/qr/w2/extra",
    "/qr/%2e%2e%2festacion%2f5",
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/estacion\/3$/);
    expect(await readStorageSnapshot(page)).toEqual(snapshot);
  }
});

test("storage corrupto falla cerrado y conserva la evidencia cruda", async ({
  page,
}) => {
  await installStorageSnapshot(page, []);
  await page.addInitScript((progressKey) => {
    localStorage.setItem(progressKey, "{corrupto");
  }, GLOBAL_PROGRESS_KEY);

  await page.goto("/qr/w5", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/estacion\/1$/);
  expect(await readStorageSnapshot(page)).toEqual({
    [CHECKPOINT_SENTINEL_KEY]: "preserve-exactly",
    [GLOBAL_PROGRESS_KEY]: "{corrupto",
  });
});
