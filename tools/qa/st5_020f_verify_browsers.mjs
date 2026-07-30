/* global document, localStorage */

import { chromium, firefox, webkit } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

async function probe(name, browserType, launchOptions = {}) {
  try {
    const browser = await browserType.launch({ headless: true, ...launchOptions });
    const version = browser.version();
    const page = await browser.newPage({ viewport: { width: 667, height: 320 } });
    await page.goto("http://127.0.0.1:4173/estacion/5");
    await page.evaluate(() => localStorage.setItem("gvo.station5.v1", JSON.stringify({ schemaVersion: 1, completedAreas: ["plantas", "sistema"], updatedAt: "2026-07-30T12:00:00.000Z" })));
    await page.goto("http://127.0.0.1:4173/estacion/5/espacio");
    const state = await page.locator("[data-station5-state]").getAttribute("data-station5-state");
    const dimensions = await page.evaluate(() => ({ client: [document.documentElement.clientWidth, document.documentElement.clientHeight], scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight] }));
    await browser.close();
    return { name, available: true, version, state, dimensions, pass: state === "space_intro" && dimensions.client.join("x") === dimensions.scroll.join("x") };
  } catch (error) {
    const message = String(error);
    return { name, available: false, pass: null, reason: message.includes("Executable doesn't exist") ? "Playwright browser executable is not installed in this environment." : message.split("\n")[0] };
  }
}

const result = {
  chromium: await probe("Chromium", chromium, { channel: "chromium" }),
  firefox: await probe("Firefox", firefox),
  webkit: await probe("WebKit", webkit),
};
result.pass = result.chromium.pass === true && [result.firefox, result.webkit].filter((entry) => entry.available).every((entry) => entry.pass === true);
result.policy = "Chromium is mandatory; Firefox and WebKit are exercised when their Playwright engines are installed.";
await fs.mkdir(path.resolve("docs/visual/world5/st5-020f"), { recursive: true });
await fs.writeFile(path.resolve("docs/visual/world5/st5-020f/browser_matrix.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
