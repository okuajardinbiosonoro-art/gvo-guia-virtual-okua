/* global document, HTMLElement, HTMLImageElement, requestAnimationFrame, URL, window */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl = process.env.GVO_DEBT_013_BASE_URL ?? "http://127.0.0.1:4177";
const label = process.env.GVO_DEBT_013_OUTPUT_LABEL ?? "current";
const expectAssets = process.env.GVO_DEBT_013_EXPECT_ASSETS === "1";
const outputDirectory = path.resolve("test-results", "gvo-debt-013", label);

const scenarios = [
  {
    id: "inicio-portrait-390x844",
    route: "/inicio",
    viewport: { width: 390, height: 844 },
    readySelector: "[data-initial-experience='debt-012']",
  },
  {
    id: "inicio-landscape-844x390",
    route: "/inicio",
    viewport: { width: 844, height: 390 },
    readySelector: "[data-initial-experience='debt-012']",
  },
  {
    id: "inicio-desktop-1440x900",
    route: "/inicio",
    viewport: { width: 1440, height: 900 },
    readySelector: "[data-initial-experience='debt-012']",
  },
  {
    id: "portada-portrait-390x844",
    route: "/portada?resetIntro=1",
    viewport: { width: 390, height: 844 },
    readySelector: "[data-cover-phase='portada_idle']",
  },
  {
    id: "portada-desktop-1440x900",
    route: "/portada?resetIntro=1",
    viewport: { width: 1440, height: 900 },
    readySelector: "[data-cover-phase='portada_idle']",
  },
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const externalRequests = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("request", (request) => {
      const url = new URL(request.url());
      const allowedOrigin = new URL(baseUrl).origin;

      if (url.origin !== allowedOrigin && !url.protocol.startsWith("data")) {
        externalRequests.push(request.url());
      }
    });

    await page.goto(`${baseUrl}${scenario.route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.locator(scenario.readySelector).waitFor({
      state: "visible",
      timeout: 30_000,
    });

    if (scenario.route.startsWith("/portada")) {
      await page
        .locator("[data-critical-assets-ready='true']")
        .waitFor({ state: "visible", timeout: 20_000 });
    }

    await page.evaluate(async () => {
      await document.fonts.ready;
      const images = Array.from(document.images);
      await Promise.all(
        images.map(async (image) => {
          if (!image.complete) {
            await new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            });
          }

          await image.decode().catch(() => undefined);
        }),
      );
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });

    const metrics = await page.evaluate(() => {
      const rect = (element) => {
        if (!(element instanceof HTMLElement)) {
          return null;
        }

        const bounds = element.getBoundingClientRect();
        return {
          left: bounds.left,
          top: bounds.top,
          right: bounds.right,
          bottom: bounds.bottom,
          width: bounds.width,
          height: bounds.height,
        };
      };
      const controls = Array.from(document.querySelectorAll("button")).map(
        (button) => ({
          label: button.getAttribute("aria-label") ?? button.textContent?.trim(),
          ...rect(button),
        }),
      );
      const stationAssets = Array.from(
        document.querySelectorAll("[data-entry-cover-station-asset]"),
      ).map((asset) => ({
        id: asset.getAttribute("data-entry-cover-station-asset"),
        src: asset instanceof HTMLImageElement ? asset.currentSrc || asset.src : null,
        complete: asset instanceof HTMLImageElement ? asset.complete : null,
        naturalWidth:
          asset instanceof HTMLImageElement ? asset.naturalWidth : null,
        ...rect(asset),
      }));

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
        },
        controls,
        stationAssets,
        audioCount: document.querySelectorAll("audio").length,
        videoCount: document.querySelectorAll("video").length,
        primaryCta: rect(
          document.querySelector(
            "[data-initial-experience-action='start'], .cover-intro__cta",
          ),
        ),
        languageSelector: rect(
          document.querySelector(".initial-experience__languages"),
        ),
        fullscreenControl: rect(
          document.querySelector("[data-initial-fullscreen-action='request']"),
        ),
        lia: rect(document.querySelector("[data-testid='cover-lia-stage']")),
        portalStage: rect(
          document.querySelector("[data-testid='cover-portal-stage']"),
        ),
        ariaLiveCount: document.querySelectorAll("[aria-live]").length,
        smallControls: controls.filter(
          (control) => control.width < 44 || control.height < 44,
        ),
      };
    });

    if (metrics.document.scrollWidth > metrics.viewport.width + 1) {
      throw new Error(`${scenario.id}: overflow horizontal`);
    }
    if (
      expectAssets &&
      metrics.controls.some(
        (control) => control.width < 44 || control.height < 44,
      )
    ) {
      throw new Error(`${scenario.id}: control menor de 44x44`);
    }
    if (metrics.audioCount !== 0 || metrics.videoCount !== 0) {
      throw new Error(`${scenario.id}: audio o video fuera de alcance`);
    }
    if (consoleErrors.length > 0) {
      throw new Error(`${scenario.id}: errores de consola: ${consoleErrors.join(" | ")}`);
    }
    if (externalRequests.length > 0) {
      throw new Error(
        `${scenario.id}: solicitudes externas: ${externalRequests.join(" | ")}`,
      );
    }
    if (expectAssets) {
      if (metrics.stationAssets.length !== 5) {
        throw new Error(
          `${scenario.id}: se esperaban 5 representaciones y llegaron ${metrics.stationAssets.length}`,
        );
      }
      if (
        metrics.stationAssets.some(
          (asset) =>
            !asset.complete || !asset.naturalWidth || !asset.src?.startsWith(baseUrl),
        )
      ) {
        throw new Error(`${scenario.id}: asset local incompleto`);
      }
    }

    await page.screenshot({
      path: path.join(outputDirectory, `${scenario.id}.png`),
      fullPage: false,
    });

    results.push({
      id: scenario.id,
      route: scenario.route,
      viewport: scenario.viewport,
      consoleErrors,
      externalRequests,
      metrics,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDirectory, "matrix.json"),
  `${JSON.stringify({ baseUrl, expectAssets, results }, null, 2)}\n`,
  "utf8",
);

console.log(
  `GVO_DEBT_013 visual matrix PASS: ${results.length}/${scenarios.length} escenarios`,
);
