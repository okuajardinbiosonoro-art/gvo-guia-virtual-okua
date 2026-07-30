import { chromium, webkit } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

async function probe(name, browserType, launchOptions = {}) {
  try {
    const browser = await browserType.launch({ headless: true, ...launchOptions });
    const version = browser.version();
    await browser.close();
    return { name, available: true, version };
  } catch (error) {
    const message = String(error);
    return {
      name,
      available: false,
      reason: message.includes("Executable doesn't exist")
        ? "Playwright browser executable is not installed in this environment."
        : message.split("\n")[0],
    };
  }
}

const result = {
  chromium: await probe("Chromium", chromium, { channel: "chromium" }),
  webkit: await probe("WebKit", webkit),
  policy:
    "Chromium is mandatory. WebKit critical validation is executed only when its Playwright engine is already available.",
};
result.pass = result.chromium.available;

const outputPath = path.resolve(
  "docs/visual/world5/st5-020e/browser_matrix.json",
);
await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
