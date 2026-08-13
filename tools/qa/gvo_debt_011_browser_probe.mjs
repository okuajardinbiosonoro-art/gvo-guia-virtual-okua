/* global URL, caches, localStorage, navigator */

import { chromium } from "@playwright/test";

const baseUrl = process.env.GVO_DEBT_011_PREVIEW_URL ?? "http://127.0.0.1:4176";
const browser = await chromium.launch({ channel: "chromium", headless: true });
const context = await browser.newContext({ serviceWorkers: "allow" });
const page = await context.newPage();

try {
  await page.addInitScript(() => {
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        completedStations: [1, 2, 3, 4, 5],
        schemaVersion: 1,
        updatedAt: "2026-08-13T12:00:00.000Z",
      }),
    );
  });

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await page.goto(`${baseUrl}/estacion/3`, { waitUntil: "domcontentloaded" });
  await page.locator(".s3-screen").waitFor({ state: "attached" });

  const cachedRouteFiles = await page.evaluate(async () => {
    const cache = await caches.open("gvo-runtime-assets-v1");
    const keys = await cache.keys();
    return keys
      .map((request) => new URL(request.url).pathname)
      .filter((pathname) => /World3RootScreen-.+\.(?:css|js)$/.test(pathname));
  });

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator(".s3-screen").waitFor({ state: "attached" });

  const result = {
    controller: await page.evaluate(
      () => navigator.serviceWorker.controller?.scriptURL ?? null,
    ),
    cachedRouteFiles,
    offlineRoute: new URL(page.url()).pathname,
    offlineWorldThreeVisible: await page.locator(".s3-screen").isVisible(),
    pass:
      cachedRouteFiles.some((pathname) => pathname.endsWith(".js")) &&
      cachedRouteFiles.some((pathname) => pathname.endsWith(".css")) &&
      new URL(page.url()).pathname === "/estacion/3",
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.pass) {
    process.exitCode = 1;
  }
} finally {
  await context.setOffline(false);
  await browser.close();
}
