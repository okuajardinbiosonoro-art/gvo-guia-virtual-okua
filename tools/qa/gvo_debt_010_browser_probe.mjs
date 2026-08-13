/* global caches, fetch, navigator, setTimeout */

import { chromium } from "@playwright/test";

const baseUrl = process.env.GVO_DEBT_010_PREVIEW_URL ?? "http://127.0.0.1:4175";
const cachedStationAsset =
  "/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png";
const browser = await chromium.launch({ channel: "chromium", headless: true });
const context = await browser.newContext({ serviceWorkers: "allow" });
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await page.locator("#app > *").first().waitFor({ state: "visible" });

  const online = await page.evaluate(async (assetUrl) => {
    const response = await fetch(assetUrl);
    await response.arrayBuffer();
    const cache = await caches.open("gvo-runtime-assets-v1");

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const match = await cache.match(assetUrl);
      if (match) {
        return { status: response.status, cached: true };
      }
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
    }

    return { status: response.status, cached: false };
  }, cachedStationAsset);
  const controller = await page.evaluate(
    () => navigator.serviceWorker.controller?.scriptURL ?? null,
  );

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#app > *").first().waitFor({ state: "visible" });
  const offline = await page.evaluate(async (assetUrl) => {
    const cache = await caches.open("gvo-runtime-assets-v1");
    const cachedResponse = await cache.match(assetUrl);

    try {
      const response = await fetch(assetUrl);
      return {
        cachedBeforeFetch: Boolean(cachedResponse),
        status: response.status,
        bytes: (await response.arrayBuffer()).byteLength,
      };
    } catch (error) {
      return {
        cachedBeforeFetch: Boolean(cachedResponse),
        status: null,
        bytes: cachedResponse
          ? (await cachedResponse.arrayBuffer()).byteLength
          : 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, cachedStationAsset);
  await context.setOffline(false);

  const result = {
    controller,
    shellReloadOffline: true,
    runtimeAssetOnline: online,
    runtimeAssetOffline: offline,
    cacheNames: await page.evaluate(() => caches.keys()),
    pass:
      controller?.endsWith("/sw.js") === true &&
      online.status === 200 &&
      online.cached &&
      offline.status === 200 &&
      offline.bytes > 0,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.pass) {
    process.exitCode = 1;
  }
} finally {
  await context.setOffline(false);
  await browser.close();
}
