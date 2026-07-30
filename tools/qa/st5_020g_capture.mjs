/* global document, getComputedStyle, localStorage */

import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.ST5_BASE_URL ?? "http://127.0.0.1:4173";
const outDir = path.resolve("docs/visual/world5/st5-020g");
const progressKey = "gvo.station5.v1";

const viewports = [
  ["360x560", 360, 560],
  ["360x640", 360, 640],
  ["375x548", 375, 548],
  ["375x667", 375, 667],
  ["390x844", 390, 844],
  ["667x320", 667, 320],
  ["667x375", 667, 375],
  ["736x414", 736, 414],
  ["844x390", 844, 390],
  ["768x1024", 768, 1024],
  ["1024x768", 1024, 768],
].map(([name, width, height]) => ({ name, width, height }));

const scenarios = [
  ["01_overview_visitor_available", "/estacion/5", ["plantas", "sistema", "espacio"], "map_overview"],
  ["02_visitor_intro", "/estacion/5/visitante", ["plantas", "sistema", "espacio"], "visitor_intro"],
  ["03_visitor_resolved", "/estacion/5/visitante", ["plantas", "sistema", "espacio", "visitante"], "visitor_resolved"],
  ["04_overview_four_of_four", "/estacion/5", ["plantas", "sistema", "espacio", "visitante"], "map_overview"],
  ["05_visitor_revisit_resolved", "/estacion/5/visitante", ["plantas", "sistema", "espacio", "visitante"], "visitor_resolved"],
  ["06_plants_intro", "/estacion/5/plantas", [], "plants_intro"],
  ["07_plants_resolved", "/estacion/5/plantas", ["plantas"], "plants_resolved"],
  ["08_system_intro", "/estacion/5/sistema", ["plantas"], "system_intro"],
  ["09_system_resolved", "/estacion/5/sistema", ["plantas", "sistema"], "system_resolved"],
  ["10_space_intro", "/estacion/5/espacio", ["plantas", "sistema"], "space_intro"],
  ["11_space_resolved", "/estacion/5/espacio", ["plantas", "sistema", "espacio"], "space_resolved"],
].map(([id, route, progress, expected, click]) => ({ id, route, progress, expected, click }));

async function prepare(page, scenario) {
  await page.goto(`${baseURL}/estacion/5`, { waitUntil: "domcontentloaded" });
  await page.evaluate(({ key, areas }) => {
    localStorage.clear();
    if (areas.length) {
      localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          completedAreas: areas,
          updatedAt: "2026-07-30T12:00:00.000Z",
        }),
      );
    }
  }, { key: progressKey, areas: scenario.progress });
  await page.goto(`${baseURL}${scenario.route}`, { waitUntil: "domcontentloaded" });
  if (scenario.click) {
    await page.locator(`[data-station5-area="${scenario.click}"]`).click();
  }
  await page.waitForFunction(
    (expected) => document.querySelector("[data-station5-state]")?.getAttribute("data-station5-state") === expected,
    scenario.expected,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((image) => image.src).map((image) => image.decode().catch(() => undefined)));
  });
}

async function measure(page, viewport, scenario, telemetry) {
  return page.evaluate(({ viewport, scenario, telemetry }) => {
    const box = (node) => {
      if (!node) return null;
      const value = node.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
    };
    const visible = (node) => node.checkVisibility() && !node.closest("[inert]");
    const insideViewport = (value) => value && value.left >= -0.5 && value.top >= -0.5 && value.right <= viewport.width + 0.5 && value.bottom <= viewport.height + 0.5;
    const root = document.querySelector("[data-station5-state]");
    const stage = box(document.querySelector(".s5-stage"));
    const card = box(document.querySelector(".s5-story-card"));
    const liaBox = box(document.querySelector(".s5-lia"));
    const liaImage = box(document.querySelector(".s5-lia img"));
    const focus = box(document.querySelector(".s5-visitor-focus"));
    const canvas = box(document.querySelector('[data-media-canvas="visitor"]'));
    let visitorAlpha = null;
    let socket = null;
    let visitorAnchor = null;
    let expectedAnchor = null;
    if (focus && canvas && root?.getAttribute("data-active-area") === "visitante") {
      visitorAlpha = {
        left: focus.left + focus.width * (288 / 1536),
        top: focus.top + focus.height * (330 / 1536),
        right: focus.left + focus.width * (1376 / 1536),
        bottom: focus.top + focus.height * (1403 / 1536),
      };
      visitorAlpha.width = visitorAlpha.right - visitorAlpha.left;
      visitorAlpha.height = visitorAlpha.bottom - visitorAlpha.top;
      const landscape = viewport.width > viewport.height;
      const sourceWidth = landscape ? 1920 : 1440;
      const sourceHeight = landscape ? 1080 : 1920;
      const normalized = landscape ? [0.15, 0.22, 0.40, 0.66] : [0.23, 0.42, 0.54, 0.34];
      socket = {
        left: canvas.left + normalized[0] * sourceWidth * (canvas.width / sourceWidth),
        top: canvas.top + normalized[1] * sourceHeight * (canvas.height / sourceHeight),
        right: canvas.left + (normalized[0] + normalized[2]) * sourceWidth * (canvas.width / sourceWidth),
        bottom: canvas.top + (normalized[1] + normalized[3]) * sourceHeight * (canvas.height / sourceHeight),
      };
      socket.width = socket.right - socket.left;
      socket.height = socket.bottom - socket.top;
      visitorAnchor = {
        x: focus.left + focus.width * (768 / 1536),
        y: focus.top + focus.height * (1000 / 1536),
      };
      expectedAnchor = {
        x: canvas.left + canvas.width * (landscape ? 797 / 1920 : 0.5),
        y: canvas.top + canvas.height * (landscape ? 0.55 : 1171 / 1920),
      };
    }
    let liaVisibleAlpha = null;
    if (liaBox && liaImage) {
      const alpha = { left: liaImage.left + liaImage.width * (90 / 1086), top: liaImage.top + liaImage.height * (163 / 1448), right: liaImage.left + liaImage.width * (987 / 1086), bottom: liaImage.top + liaImage.height * (1212 / 1448) };
      liaVisibleAlpha = { width: Math.max(0, Math.min(alpha.right, liaBox.right) - Math.max(alpha.left, liaBox.left)), height: Math.max(0, Math.min(alpha.bottom, liaBox.bottom) - Math.max(alpha.top, liaBox.top)) };
    }
    const text = [...document.querySelectorAll(".s5-kicker,.s5-editorial h1,.s5-editorial h2,.s5-lead,.s5-support,.s5-status-copy")]
      .filter(visible)
      .map((node) => ({ text: node.textContent?.trim(), role: node.className || node.tagName, fontSize: Number.parseFloat(getComputedStyle(node).fontSize), box: box(node) }));
    const targets = [...document.querySelectorAll("button")]
      .filter((node) => visible(node) && !node.disabled)
      .map((node) => ({ label: node.getAttribute("aria-label") ?? node.textContent?.trim(), box: box(node) }));
    const dimensions = { clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight };
    const shortLandscapeSubstation = viewport.width >= 600 && viewport.height <= 450 && root?.getAttribute("data-active-area") !== "map";
    const bodyText = text.filter((entry) => /s5-(lead|support|status-copy)/.test(entry.role));
    const checks = {
      expectedState: root?.getAttribute("data-station5-state") === scenario.expected,
      noOverflow: dimensions.clientWidth === dimensions.scrollWidth && dimensions.clientHeight === dimensions.scrollHeight,
      textInsideViewport: text.every((entry) => insideViewport(entry.box)),
      bodyAtLeast14: bodyText.every((entry) => entry.fontSize >= 14),
      targetsAtLeast44: targets.every((entry) => entry.box.width >= 44 && entry.box.height >= 44),
      landscapeRail: !shortLandscapeSubstation || (stage.width / (stage.width + card.width) >= 0.58 && card.width >= 260),
      liaLandscapeVisible: !shortLandscapeSubstation || (liaVisibleAlpha && liaVisibleAlpha.height >= 80),
      visitorAlphaInsideSocket: !visitorAlpha || (visitorAlpha.left >= socket.left - 1 && visitorAlpha.top >= socket.top - 1 && visitorAlpha.right <= socket.right + 1 && visitorAlpha.bottom <= socket.bottom + 1),
      visitorAlphaInsideStage: !visitorAlpha || (visitorAlpha.left >= stage.left - 1 && visitorAlpha.top >= stage.top - 1 && visitorAlpha.right <= stage.right + 1 && visitorAlpha.bottom <= stage.bottom + 1),
      visitorAnchorDriftAtMost2: !visitorAnchor || (Math.hypot(visitorAnchor.x - expectedAnchor.x, visitorAnchor.y - expectedAnchor.y) <= 2),
      fourOfFourState: scenario.id !== "04_overview_four_of_four" || (root?.getAttribute("data-station-complete") === "true" && document.querySelector("[data-map-complete]")?.getAttribute("data-map-complete") === "true"),
      finalNavigationAbsent: !document.body.textContent?.includes("Ir al cierre") && !document.location.pathname.includes("world-5-to-final") && document.location.pathname !== "/final",
      forbiddenAbsent: document.querySelectorAll("audio,video,canvas,iframe,svg,.s5-resolved-check,.s5-system-connection").length === 0,
    };
    return { viewport, scene: scenario.id, runtimeState: root?.getAttribute("data-station5-state"), boxes: { stage, card, lia: liaBox, liaVisibleAlpha, focus, visitorAlpha, visitorAnchor, expectedAnchor, socket }, dimensions, text, targets, telemetry, checks, pass: Object.values(checks).every(Boolean) };
  }, { viewport, scenario, telemetry });
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const metrics = [];
try {
  for (const viewport of viewports) {
    for (const scenario of scenarios) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const telemetry = { consoleErrors: [], pageErrors: [], failedRequests: [], externalRequests: [] };
      page.on("console", (message) => { if (message.type() === "error") telemetry.consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => telemetry.pageErrors.push(String(error)));
      page.on("requestfailed", (request) => {
        const failure = request.failure()?.errorText ?? "unknown";
        if (!(failure.includes("ERR_ABORTED") && request.url().includes("pixelify-sans"))) telemetry.failedRequests.push(`${request.url()} :: ${failure}`);
      });
      page.on("request", (request) => { if (!request.url().startsWith(baseURL) && !request.url().startsWith("data:") && !request.url().startsWith("blob:")) telemetry.externalRequests.push(request.url()); });
      await prepare(page, scenario);
      await page.screenshot({ path: path.join(outDir, `${viewport.name}_${scenario.id}.png`) });
      metrics.push(await measure(page, viewport, scenario, telemetry));
      await page.close();
    }
  }

  const dynamic = [];
  const sequences = [
    ["portrait_landscape_portrait", [[375, 667], [667, 375], [375, 667]]],
    ["short_landscape", [[667, 375], [667, 320], [667, 375]]],
  ];
  for (const scenario of [scenarios[1], scenarios[2], scenarios[3]]) {
    for (const [sequenceName, dimensions] of sequences) {
      const page = await browser.newPage({ viewport: { width: dimensions[0][0], height: dimensions[0][1] } });
      await prepare(page, scenario);
      for (let index = 0; index < dimensions.length; index += 1) {
        const [width, height] = dimensions[index];
        await page.setViewportSize({ width, height });
        await page.waitForTimeout(50);
        const data = await measure(page, { name: `${width}x${height}`, width, height }, scenario, { consoleErrors: [], pageErrors: [], failedRequests: [], externalRequests: [] });
        dynamic.push({ ...data, sequence: sequenceName, step: index + 1 });
        await page.screenshot({ path: path.join(outDir, `dynamic_${scenario.id}_${sequenceName}_${index + 1}_${width}x${height}.png`) });
      }
      await page.close();
    }
  }

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await prepare(reduced, scenarios[1]);
  await reduced.screenshot({ path: path.join(outDir, "reduced_motion_visitor_390x844.png") });
  await reduced.close();

  const summary = {
    ticket: "ST5-020G",
    captureCount: metrics.length,
    viewportCount: viewports.length,
    scenarioCount: scenarios.length,
    passed: metrics.filter((entry) => entry.pass).length,
    failed: metrics.filter((entry) => !entry.pass).map((entry) => ({ viewport: entry.viewport.name, scene: entry.scene, checks: entry.checks })),
    minBodyFontSize: Math.min(...metrics.flatMap((entry) => entry.text.filter((item) => /s5-(lead|support|status-copy)/.test(item.role)).map((item) => item.fontSize))),
    minTarget: Math.min(...metrics.flatMap((entry) => entry.targets.flatMap((item) => [item.box.width, item.box.height]))),
    maxScrollOverflow: Math.max(...metrics.map((entry) => Math.max(entry.dimensions.scrollWidth - entry.dimensions.clientWidth, entry.dimensions.scrollHeight - entry.dimensions.clientHeight))),
    minLandscapeRailWidth: Math.min(...metrics.filter((entry) => entry.viewport.width >= 600 && entry.viewport.height <= 450 && !entry.scene.includes("overview")).map((entry) => entry.boxes.card.width)),
    minLandscapeLiaVisibleAlphaHeight: Math.min(...metrics.filter((entry) => entry.viewport.width >= 600 && entry.viewport.height <= 450 && !entry.scene.includes("overview")).map((entry) => entry.boxes.liaVisibleAlpha?.height ?? 0)),
    maxVisitorAnchorDrift: Math.max(...metrics.filter((entry) => entry.boxes.visitorAnchor).map((entry) => Math.hypot(entry.boxes.visitorAnchor.x - entry.boxes.expectedAnchor.x, entry.boxes.visitorAnchor.y - entry.boxes.expectedAnchor.y))),
    consoleErrors: metrics.flatMap((entry) => entry.telemetry.consoleErrors),
    pageErrors: metrics.flatMap((entry) => entry.telemetry.pageErrors),
    failedRequests: metrics.flatMap((entry) => entry.telemetry.failedRequests),
    externalRequests: metrics.flatMap((entry) => entry.telemetry.externalRequests),
    dynamicPass: dynamic.every((entry) => entry.pass),
    pass: metrics.every((entry) => entry.pass) && dynamic.every((entry) => entry.pass),
  };
  await fs.writeFile(path.join(outDir, "metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
  await fs.writeFile(path.join(outDir, "dynamic_viewport.json"), `${JSON.stringify(dynamic, null, 2)}\n`);
  await fs.writeFile(path.join(outDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.pass) process.exitCode = 1;
} finally {
  await browser.close();
}
