/* global Buffer, document, getComputedStyle, localStorage */

import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const baseURL = process.env.ST5_BASE_URL ?? "http://127.0.0.1:4174";
const outDir = path.resolve("docs/visual/world5/st5-020d");

const viewports = [
  { name: "360x560", width: 360, height: 560 },
  { name: "360x640", width: 360, height: 640 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "844x390", width: 844, height: 390 },
  { name: "1024x768", width: 1024, height: 768 },
];

const scenarios = [
  {
    id: "01_overview_new",
    route: "/estacion/5",
    progress: [],
    expected: "map_overview",
  },
  {
    id: "02_overview_after_plants",
    route: "/estacion/5",
    progress: ["plantas"],
    expected: "map_overview",
  },
  {
    id: "03_plants_intro",
    route: "/estacion/5/plantas",
    progress: [],
    expected: "plants_intro",
  },
  {
    id: "04_plants_resolved",
    route: "/estacion/5/plantas",
    progress: ["plantas"],
    expected: "plants_resolved",
  },
  {
    id: "05_overview_after_system",
    route: "/estacion/5",
    progress: ["plantas", "sistema"],
    expected: "map_overview",
  },
  {
    id: "06_system_intro",
    route: "/estacion/5/sistema",
    progress: ["plantas"],
    expected: "system_intro",
  },
  {
    id: "07_system_resolved",
    route: "/estacion/5/sistema",
    progress: ["plantas", "sistema"],
    expected: "system_resolved",
  },
  {
    id: "08_space_blocked",
    route: "/estacion/5",
    progress: ["plantas", "sistema"],
    expected: "map_blocked_feedback",
    click: "espacio",
  },
];

const forbidden = [
  ".s5-map__nexus",
  ".s5-map__links",
  ".s5-sector__status",
  ".s5-vital-pulse",
  ".s5-resolved-check",
  ".s5-system-connection",
  ".s5-system-indicator",
].join(",");

const alphaBounds = {
  attend: { source: [1536, 1536], box: [423, 311, 1113, 1102] },
  lead: { source: [1536, 1536], box: [368, 278, 1158, 1147] },
  explain: { source: [1086, 1448], box: [90, 163, 987, 1212] },
};

async function prepareScenario(page, scenario) {
  await page.goto(`${baseURL}/estacion/5`, { waitUntil: "domcontentloaded" });
  await page.evaluate((completedAreas) => {
    localStorage.clear();
    if (completedAreas.length) {
      localStorage.setItem(
        "gvo.station5.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedAreas,
          updatedAt: "2026-07-30T12:00:00.000Z",
        }),
      );
    }
  }, scenario.progress);
  await page.goto(`${baseURL}${scenario.route}`, {
    waitUntil: "domcontentloaded",
  });
  if (scenario.click) {
    await page.locator(`[data-station5-area="${scenario.click}"]`).click();
  }
  await page.locator("[data-station5-state]").waitFor({ state: "visible" });
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector("[data-station5-state]")
        ?.getAttribute("data-station5-state") === expected,
    scenario.expected,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(80);
}

async function measure(page, viewport, scenario, telemetry) {
  return page.evaluate(
    ({ viewport, scenario, forbidden, telemetry, alphaBounds }) => {
      const safeRect = (node) => {
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        };
      };
      const root = document.querySelector("[data-station5-state]");
      const activeArea = root?.getAttribute("data-active-area") ?? "map";
      const canvasName =
        activeArea === "map"
          ? "map"
          : activeArea === "plantas"
            ? "plants"
            : "system";
      const canvas = document.querySelector(
        `[data-media-canvas="${canvasName}"]`,
      );
      const card = document.querySelector(".s5-story-card");
      const lia = document.querySelector(".s5-lia");
      const liaImage = lia?.querySelector("img");
      const liaRole = lia?.getAttribute("data-station5-lia");
      const liaAlpha = liaRole ? alphaBounds[liaRole] : null;
      const liaRect = safeRect(lia);
      const liaImageRect = safeRect(liaImage);
      let visibleLia = null;
      if (liaAlpha && liaRect && liaImageRect) {
        const [sourceWidth, sourceHeight] = liaAlpha.source;
        const [x1, y1, x2, y2] = liaAlpha.box;
        const alphaRect = {
          left: liaImageRect.left + (x1 / sourceWidth) * liaImageRect.width,
          top: liaImageRect.top + (y1 / sourceHeight) * liaImageRect.height,
          right: liaImageRect.left + (x2 / sourceWidth) * liaImageRect.width,
          bottom: liaImageRect.top + (y2 / sourceHeight) * liaImageRect.height,
        };
        visibleLia = {
          left: Math.max(alphaRect.left, liaRect.left),
          top: Math.max(alphaRect.top, liaRect.top),
          right: Math.min(alphaRect.right, liaRect.right),
          bottom: Math.min(alphaRect.bottom, liaRect.bottom),
          width: Math.max(
            0,
            Math.min(alphaRect.right, liaRect.right) -
              Math.max(alphaRect.left, liaRect.left),
          ),
          height: Math.max(
            0,
            Math.min(alphaRect.bottom, liaRect.bottom) -
              Math.max(alphaRect.top, liaRect.top),
          ),
        };
      }

      const targets = [...document.querySelectorAll("button")]
        .filter(
          (node) =>
            node.checkVisibility() &&
            !node.disabled &&
            !node.closest("[inert]"),
        )
        .map((node) => ({
          label:
            node.getAttribute("aria-label") ?? node.textContent?.trim() ?? "",
          ...safeRect(node),
        }));
      const plantImage =
        activeArea === "plantas"
          ? document.querySelector(".s5-plants-focus > img")
          : null;
      const plantImageRect = safeRect(plantImage);
      const canvasRect = safeRect(canvas);
      const plantContactY = plantImageRect
        ? plantImageRect.top + plantImageRect.height * (1303 / 1536)
        : null;
      const expectedPlantY = canvasRect
        ? canvasRect.top +
          canvasRect.height * (viewport.width > viewport.height ? 0.58 : 0.69)
        : null;
      const systemFocus = document.querySelector(".s5-system-focus");
      const expectedRatio =
        viewport.width > viewport.height
          ? 1920 / 1080
          : canvasName === "map"
            ? 1440 / 2560
            : 1440 / 1920;
      const bodyFontSizes = [
        ...document.querySelectorAll(".s5-lead,.s5-support,.s5-status-copy"),
      ]
        .filter((node) => node.checkVisibility())
        .map((node) => Number.parseFloat(getComputedStyle(node).fontSize));

      return {
        viewport: {
          ...viewport,
          orientation:
            viewport.width > viewport.height ? "landscape" : "portrait",
        },
        scene: scenario.id,
        runtimeState: root?.getAttribute("data-station5-state"),
        dimensions: {
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
        },
        boxes: {
          root: safeRect(root),
          stage: safeRect(document.querySelector(".s5-stage")),
          card: safeRect(card),
          artboard: canvasRect,
          lia: liaRect,
          liaVisibleAlpha: visibleLia,
          plantsFocus: safeRect(document.querySelector(".s5-plants-focus")),
          systemFocus: safeRect(systemFocus),
        },
        projection: canvasRect && {
          name: canvasName,
          actualRatio: canvasRect.width / canvasRect.height,
          expectedRatio,
          ratioDrift: Math.abs(
            canvasRect.width / canvasRect.height - expectedRatio,
          ),
          fit: document
            .querySelector(`[data-projected-stage="${canvasName}"]`)
            ?.getAttribute("data-projection-fit"),
        },
        plantContact:
          plantContactY === null
            ? null
            : {
                actualY: plantContactY,
                expectedY: expectedPlantY,
                driftPx:
                  expectedPlantY === null
                    ? null
                    : plantContactY - expectedPlantY,
              },
        systemRotation:
          systemFocus?.getAttribute("data-system-rotation") ?? null,
        minBodyFontSize: Math.min(...bodyFontSizes),
        targets,
        titleHierarchy: [...document.querySelectorAll("h1,h2,h3")]
          .filter((node) => node.checkVisibility())
          .map((node) => `${node.tagName}:${node.textContent?.trim()}`),
        forbiddenProceduralCount: document.querySelectorAll(forbidden).length,
        telemetry,
      };
    },
    { viewport, scenario, forbidden, telemetry, alphaBounds },
  );
}

async function makeSheet(
  entries,
  output,
  columns = 4,
  cellWidth = 240,
  cellHeight = 440,
) {
  const rows = Math.ceil(entries.length / columns);
  const composites = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const image = await sharp(entry.file)
      .resize({
        width: cellWidth - 12,
        height: cellHeight - 38,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();
    const meta = await sharp(image).metadata();
    const x =
      (index % columns) * cellWidth +
      Math.round((cellWidth - (meta.width ?? 0)) / 2);
    const y = Math.floor(index / columns) * cellHeight + 30;
    composites.push({ input: image, left: x, top: y });
    const label = Buffer.from(
      `<svg width="${cellWidth}" height="30"><rect width="100%" height="100%" fill="#24362d"/><text x="8" y="20" fill="#f4ecdc" font-family="Arial" font-size="13">${entry.label}</text></svg>`,
    );
    composites.push({
      input: label,
      left: (index % columns) * cellWidth,
      top: Math.floor(index / columns) * cellHeight,
    });
  }
  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: "#f4ecdc",
    },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(output);
}

async function makeSideBySide(leftFile, rightFile, output) {
  const height = 900;
  const left = await sharp(leftFile)
    .resize({ height, fit: "inside" })
    .jpeg()
    .toBuffer();
  const right = await sharp(rightFile)
    .resize({ height, fit: "inside" })
    .jpeg()
    .toBuffer();
  const lm = await sharp(left).metadata();
  const rm = await sharp(right).metadata();
  await sharp({
    create: {
      width: (lm.width ?? 0) + (rm.width ?? 0) + 24,
      height,
      channels: 3,
      background: "#f4ecdc",
    },
  })
    .composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: (lm.width ?? 0) + 24, top: 0 },
    ])
    .jpeg({ quality: 90 })
    .toFile(output);
}

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const metrics = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "no-preference",
    });
    const viewportEntries = [];
    for (const scenario of scenarios) {
      const page = await context.newPage();
      const telemetry = {
        consoleErrors: [],
        pageErrors: [],
        failedResponses: [],
        externalRequests: [],
      };
      page.on("console", (message) => {
        if (message.type() === "error")
          telemetry.consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => telemetry.pageErrors.push(error.message));
      page.on("response", (response) => {
        if (response.status() === 404)
          telemetry.failedResponses.push(response.url());
      });
      page.on("request", (request) => {
        if (!request.url().startsWith(baseURL))
          telemetry.externalRequests.push(request.url());
      });
      await prepareScenario(page, scenario);
      const filename = `${viewport.name}_${scenario.id}.png`;
      const file = path.join(outDir, filename);
      await page.screenshot({ path: file, fullPage: false });
      metrics.push(await measure(page, viewport, scenario, telemetry));
      viewportEntries.push({
        file,
        label: `${viewport.name} · ${scenario.id}`,
      });
      await page.close();
    }
    await context.close();
    await makeSheet(
      viewportEntries,
      path.join(outDir, `contact_sheet_${viewport.name}.jpg`),
      4,
      240,
      viewport.width > viewport.height ? 260 : 440,
    );
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outDir, "metrics.json"),
  `${JSON.stringify(metrics, null, 2)}\n`,
);

const plants = viewports.map((viewport) => ({
  file: path.join(outDir, `${viewport.name}_03_plants_intro.png`),
  label: `${viewport.name} · contacto Plantas`,
}));
const cards = viewports.map((viewport) => ({
  file: path.join(outDir, `${viewport.name}_01_overview_new.png`),
  label: `${viewport.name} · tarjeta + Lía`,
}));
await makeSheet(
  plants,
  path.join(outDir, "contact_sheet_plants_multi_viewport.jpg"),
  4,
  240,
  440,
);
await makeSheet(
  cards,
  path.join(outDir, "contact_sheet_card_lia_multi_viewport.jpg"),
  4,
  240,
  440,
);

await makeSideBySide(
  path.resolve(
    "docs/visual/world5/st5-020c/contact_sheet_portrait_flow_390x844.jpg",
  ),
  path.join(outDir, "contact_sheet_390x844.jpg"),
  path.join(outDir, "comparison_020c_020d_flow_390x844.jpg"),
);

await makeSideBySide(
  path.resolve("docs/visual/world5/st5-020c/detail_system_socket_390x844.png"),
  path.join(outDir, "390x844_06_system_intro.png"),
  path.join(outDir, "comparison_020c_020d_system_390x844.jpg"),
);

const systemMetric = metrics.find(
  (entry) =>
    entry.viewport.name === "390x844" && entry.scene === "06_system_intro",
);
if (systemMetric?.boxes?.artboard && systemMetric?.boxes?.systemFocus) {
  const source = path.join(outDir, "390x844_06_system_intro.png");
  const { width, height } = await sharp(source).metadata();
  const canvas = systemMetric.boxes.artboard;
  const focus = systemMetric.boxes.systemFocus;
  const overlay = Buffer.from(
    `<svg width="${width}" height="${height}"><g fill="none" stroke-width="2"><rect x="${canvas.left}" y="${canvas.top}" width="${canvas.width}" height="${canvas.height}" stroke="#1769aa"/><line x1="${canvas.left}" y1="${canvas.top + canvas.height * 0.74}" x2="${canvas.right}" y2="${canvas.top + canvas.height * 0.74}" stroke="#d32f2f"/><rect x="${focus.left}" y="${focus.top}" width="${focus.width}" height="${focus.height}" stroke="#2e7d32"/></g><g font-family="Arial" font-size="13" font-weight="700"><text x="12" y="24" fill="#1769aa">mediaCanvas cover</text><text x="12" y="42" fill="#d32f2f">plano/base 74%</text><text x="12" y="60" fill="#2e7d32">foco uniforme · Z -2.5°</text></g></svg>`,
  );
  await sharp(source)
    .composite([{ input: overlay, left: 0, top: 0 }])
    .png()
    .toFile(path.join(outDir, "qa_system_projection_axes_390x844.png"));
}

const summary = {
  captureCount: metrics.length,
  viewportCount: viewports.length,
  stateCount: scenarios.length,
  maxHorizontalOverflow: Math.max(
    ...metrics.map(
      (entry) => entry.dimensions.scrollWidth - entry.dimensions.clientWidth,
    ),
  ),
  maxVerticalOverflow: Math.max(
    ...metrics.map(
      (entry) => entry.dimensions.scrollHeight - entry.dimensions.clientHeight,
    ),
  ),
  minVisibleLiaHeight: Math.min(
    ...metrics.map(
      (entry) =>
        entry.boxes.liaVisibleAlpha?.height ?? Number.POSITIVE_INFINITY,
    ),
  ),
  minTargetDimension: Math.min(
    ...metrics.flatMap((entry) =>
      entry.targets.map((target) => Math.min(target.width, target.height)),
    ),
  ),
  maxPlantContactDriftPx: Math.max(
    ...metrics.map((entry) => Math.abs(entry.plantContact?.driftPx ?? 0)),
  ),
  maxProjectionRatioDrift: Math.max(
    ...metrics.map((entry) => entry.projection?.ratioDrift ?? 0),
  ),
  minBodyFontSize: Math.min(...metrics.map((entry) => entry.minBodyFontSize)),
  forbiddenProceduralCount: metrics.reduce(
    (sum, entry) => sum + entry.forbiddenProceduralCount,
    0,
  ),
  consoleErrors: metrics.reduce(
    (sum, entry) =>
      sum +
      entry.telemetry.consoleErrors.length +
      entry.telemetry.pageErrors.length,
    0,
  ),
  failedResponses: metrics.reduce(
    (sum, entry) => sum + entry.telemetry.failedResponses.length,
    0,
  ),
  externalRequests: metrics.reduce(
    (sum, entry) => sum + entry.telemetry.externalRequests.length,
    0,
  ),
};
await fs.writeFile(
  path.join(outDir, "summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
