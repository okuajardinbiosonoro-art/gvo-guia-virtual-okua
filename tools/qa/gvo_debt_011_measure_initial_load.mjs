/* global performance, URL */

import { chromium } from "@playwright/test";

const baseUrl = process.env.GVO_DEBT_011_PREVIEW_URL ?? "http://127.0.0.1:4176";
const label = process.argv[2] ?? "measurement";
const iterations = Number.parseInt(
  process.env.GVO_DEBT_011_ITERATIONS ?? "5",
  10,
);

const median = (values) => {
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 0
    ? (ordered[middle - 1] + ordered[middle]) / 2
    : ordered[middle];
};

const browser = await chromium.launch({ channel: "chromium", headless: true });
const samples = [];

try {
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();

    await page.goto(`${baseUrl}/?gvoDebt011=${label}-${iteration}`, {
      waitUntil: "load",
    });
    await page.locator("#app > *").first().waitFor({ state: "visible" });
    await page.waitForTimeout(100);

    samples.push(
      await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const resources = performance.getEntriesByType("resource");
        const scripts = resources.filter(
          (entry) =>
            entry.initiatorType === "script" &&
            new URL(entry.name).pathname.startsWith("/assets/"),
        );
        const styles = resources.filter(
          (entry) =>
            entry.initiatorType === "link" &&
            new URL(entry.name).pathname.endsWith(".css"),
        );
        const firstContentfulPaint = performance
          .getEntriesByName("first-contentful-paint")
          .at(0);

        return {
          domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
          loadMs: Math.round(navigation.loadEventEnd),
          firstContentfulPaintMs: firstContentfulPaint
            ? Math.round(firstContentfulPaint.startTime)
            : null,
          initialScriptCount: scripts.length,
          initialScriptEncodedBytes: scripts.reduce(
            (sum, entry) => sum + entry.encodedBodySize,
            0,
          ),
          initialScriptDecodedBytes: scripts.reduce(
            (sum, entry) => sum + entry.decodedBodySize,
            0,
          ),
          initialStyleEncodedBytes: styles.reduce(
            (sum, entry) => sum + entry.encodedBodySize,
            0,
          ),
          scriptPaths: scripts.map((entry) => new URL(entry.name).pathname),
        };
      }),
    );

    await context.close();
  }
} finally {
  await browser.close();
}

const result = {
  ticket: "GVO_DEBT_011",
  label,
  iterations,
  medians: {
    domContentLoadedMs: median(
      samples.map((sample) => sample.domContentLoadedMs),
    ),
    loadMs: median(samples.map((sample) => sample.loadMs)),
    firstContentfulPaintMs: median(
      samples
        .map((sample) => sample.firstContentfulPaintMs)
        .filter((value) => value !== null),
    ),
    initialScriptEncodedBytes: median(
      samples.map((sample) => sample.initialScriptEncodedBytes),
    ),
    initialScriptDecodedBytes: median(
      samples.map((sample) => sample.initialScriptDecodedBytes),
    ),
    initialStyleEncodedBytes: median(
      samples.map((sample) => sample.initialStyleEncodedBytes),
    ),
  },
  initialScriptCount: samples[0]?.initialScriptCount ?? 0,
  scriptPaths: samples[0]?.scriptPaths ?? [],
  samples,
};

console.log(JSON.stringify(result, null, 2));
