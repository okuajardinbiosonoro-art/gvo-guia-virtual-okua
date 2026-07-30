/* global Buffer, document, getComputedStyle, localStorage */

import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const baseURL = process.env.ST5_BASE_URL ?? "http://127.0.0.1:4173";
const outDir = path.resolve("docs/visual/world5/st5-020e");
const runtimeDir = path.resolve(
  "public/assets/gvo/stations/world-5/present-map/runtime",
);
const previousDir = path.resolve("docs/visual/world5/st5-020d");

const viewports = [
  ["320x568", 320, 568],
  ["360x560", 360, 560],
  ["360x640", 360, 640],
  ["375x548", 375, 548],
  ["375x667", 375, 667],
  ["390x844", 390, 844],
  ["430x932", 430, 932],
  ["768x1024", 768, 1024],
  ["844x390", 844, 390],
  ["1024x768", 1024, 768],
].map(([name, width, height]) => ({ name, width, height }));

const scenarios = [
  ["01_overview_new", "/estacion/5", [], "map_overview"],
  ["02_overview_after_plants", "/estacion/5", ["plantas"], "map_overview"],
  ["03_plants_intro", "/estacion/5/plantas", [], "plants_intro"],
  ["04_plants_resolved", "/estacion/5/plantas", ["plantas"], "plants_resolved"],
  ["05_overview_after_system", "/estacion/5", ["plantas", "sistema"], "map_overview"],
  ["06_system_intro", "/estacion/5/sistema", ["plantas"], "system_intro"],
  ["07_system_resolved", "/estacion/5/sistema", ["plantas", "sistema"], "system_resolved"],
  ["08_space_blocked", "/estacion/5", ["plantas", "sistema"], "map_blocked_feedback", "espacio"],
].map(([id, route, progress, expected, click]) => ({
  id,
  route,
  progress,
  expected,
  click,
}));

const sectorAlpha = {
  plantas: [336, 192, 1379, 1274],
  sistema: [369, 483, 1404, 1092],
  espacio: [189, 508, 1404, 1131],
  visitante: [264, 333, 1388, 1258],
};
const sectorFiles = {
  plantas: "world5_map_sector_plants_v01.webp",
  sistema: "world5_map_sector_system_v01.webp",
  espacio: "world5_map_sector_space_v01.webp",
  visitante: "world5_map_sector_visitor_v01.webp",
};
const liaAlpha = {
  attend: { source: [1536, 1536], box: [423, 311, 1113, 1102] },
  lead: { source: [1536, 1536], box: [368, 278, 1158, 1147] },
  explain: { source: [1086, 1448], box: [90, 163, 987, 1212] },
};
const forbidden = [
  ".s5-map__nexus",
  ".s5-map__links",
  ".s5-sector__status",
  ".s5-vital-pulse",
  ".s5-resolved-check",
  ".s5-system-connection",
  ".s5-system-indicator",
  "audio",
  "video",
  "canvas",
  "svg",
].join(",");

async function prepare(page, scenario) {
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
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector("[data-station5-state]")
        ?.getAttribute("data-station5-state") === expected,
    scenario.expected,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => image.src)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
  await page.waitForTimeout(50);
}

async function measure(page, viewport, scenario, telemetry) {
  return page.evaluate(
    ({ viewport, scenario, telemetry, sectorAlpha, liaAlpha, forbidden }) => {
      const rect = (node) => {
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return {
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          width: box.width,
          height: box.height,
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
      const canvas = rect(
        document.querySelector(`[data-media-canvas="${canvasName}"]`),
      );
      const stage = rect(document.querySelector(".s5-stage"));
      const card = rect(document.querySelector(".s5-story-card"));
      const lia = document.querySelector(".s5-lia");
      const liaBox = rect(lia);
      const liaImage = rect(lia?.querySelector("img"));
      const role = lia?.getAttribute("data-station5-lia");
      let liaVisibleAlpha = null;
      if (liaBox && liaImage && role && liaAlpha[role]) {
        const [sourceWidth, sourceHeight] = liaAlpha[role].source;
        const [x1, y1, x2, y2] = liaAlpha[role].box;
        const alphaBox = {
          left: liaImage.left + (x1 / sourceWidth) * liaImage.width,
          top: liaImage.top + (y1 / sourceHeight) * liaImage.height,
          right: liaImage.left + (x2 / sourceWidth) * liaImage.width,
          bottom: liaImage.top + (y2 / sourceHeight) * liaImage.height,
        };
        liaVisibleAlpha = {
          width: Math.max(
            0,
            Math.min(alphaBox.right, liaBox.right) -
              Math.max(alphaBox.left, liaBox.left),
          ),
          height: Math.max(
            0,
            Math.min(alphaBox.bottom, liaBox.bottom) -
              Math.max(alphaBox.top, liaBox.top),
          ),
        };
      }

      const sectors = canvasName === "map" && canvas
        ? [...document.querySelectorAll(".s5-sector")].map((node) => {
            const area = node.getAttribute("data-station5-area");
            const image = rect(node.querySelector("img"));
            const label = rect(node.querySelector(".s5-sector__label"));
            const target = rect(node);
            const alpha = sectorAlpha[area];
            const alphaBox = image && alpha
              ? {
                  left: image.left + (alpha[0] / 1536) * image.width,
                  top: image.top + (alpha[1] / 1536) * image.height,
                  right: image.left + (alpha[2] / 1536) * image.width,
                  bottom: image.top + (alpha[3] / 1536) * image.height,
                }
              : null;
            return {
              area,
              target,
              image,
              alphaBox,
              label,
              labelDistancePx:
                alphaBox && label ? label.top - alphaBox.bottom : null,
              sourcePlacement: image
                ? {
                    x: ((image.left - canvas.left) / canvas.width) *
                      (viewport.width > viewport.height ? 2560 : 1440),
                    y: ((image.top - canvas.top) / canvas.height) *
                      (viewport.width > viewport.height ? 1440 : 2560),
                    size: (image.width / canvas.width) *
                      (viewport.width > viewport.height ? 2560 : 1440),
                  }
                : null,
            };
          })
        : [];

      const focusImage = rect(
        document.querySelector(".s5-plants-focus > img"),
      );
      const plantContact =
        canvasName === "plants" && canvas && focusImage
          ? (() => {
              const portrait = viewport.height >= viewport.width;
              const sourceHeight = portrait ? 1920 : 1080;
              const baseY = focusImage.top + focusImage.height * (1280 / 1536);
              const boundaryY =
                canvas.top +
                canvas.height * ((portrait ? 1267 : 755) / sourceHeight);
              const soilTopY =
                canvas.top +
                canvas.height * ((portrait ? 1132 : 680) / sourceHeight);
              return {
                base: {
                  x: focusImage.left + focusImage.width * (772 / 1536),
                  y: baseY,
                },
                soilBand: {
                  top: soilTopY,
                  bottom: boundaryY,
                },
                boundaryY,
                insertionPx: boundaryY - baseY,
                projectedSourceY:
                  ((baseY - canvas.top) / canvas.height) * sourceHeight,
              };
            })()
          : null;

      const bodySizes = [
        ...document.querySelectorAll(
          ".s5-lead,.s5-support,.s5-status-copy",
        ),
      ]
        .filter((node) => node.checkVisibility())
        .map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
      const targets = [...document.querySelectorAll("button")]
        .filter(
          (node) =>
            node.checkVisibility() && !node.disabled && !node.closest("[inert]"),
        )
        .map((node) => ({
          label: node.getAttribute("aria-label") ?? node.textContent?.trim(),
          ...rect(node),
        }));
      return {
        viewport,
        scene: scenario.id,
        runtimeState: root?.getAttribute("data-station5-state"),
        boxes: {
          stage,
          card,
          canvas,
          lia: liaBox,
          liaVisibleAlpha,
          systemFocus: rect(document.querySelector(".s5-system-focus")),
        },
        sectors,
        plantContact,
        stageShare:
          stage?.height / (document.documentElement.clientHeight - 16),
        dimensions: {
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
        },
        minBodyFontSize: Math.min(...bodySizes),
        targets,
        headings: [...document.querySelectorAll("h1,h2,h3")]
          .filter((node) => node.checkVisibility())
          .map((node) => `${node.tagName}:${node.textContent?.trim()}`),
        forbiddenCount: document.querySelectorAll(forbidden).length,
        systemRotation: document
          .querySelector(".s5-system-focus")
          ?.getAttribute("data-system-rotation"),
        telemetry,
      };
    },
    { viewport, scenario, telemetry, sectorAlpha, liaAlpha, forbidden },
  );
}

async function makeSheet(entries, output, cellHeight) {
  const columns = 4;
  const cellWidth = 240;
  const rows = Math.ceil(entries.length / columns);
  const composite = [];
  for (let index = 0; index < entries.length; index += 1) {
    const image = await sharp(entries[index].file)
      .resize({
        width: cellWidth - 12,
        height: cellHeight - 38,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png()
      .toBuffer();
    const meta = await sharp(image).metadata();
    composite.push({
      input: image,
      left:
        (index % columns) * cellWidth +
        Math.round((cellWidth - (meta.width ?? 0)) / 2),
      top: Math.floor(index / columns) * cellHeight + 30,
    });
    composite.push({
      input: Buffer.from(
        `<svg width="${cellWidth}" height="30"><rect width="100%" height="100%" fill="#24362d"/><text x="8" y="20" fill="#f4ecdc" font-family="Arial" font-size="12">${entries[index].label}</text></svg>`,
      ),
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
    .composite(composite)
    .jpeg({ quality: 90 })
    .toFile(output);
}

async function sideBySide(leftFile, rightFile, output, labels) {
  const height = 780;
  const left = await sharp(leftFile).resize({ height, fit: "inside" }).png().toBuffer();
  const right = await sharp(rightFile).resize({ height, fit: "inside" }).png().toBuffer();
  const leftMeta = await sharp(left).metadata();
  const rightMeta = await sharp(right).metadata();
  const gap = 20;
  const header = 32;
  const width = (leftMeta.width ?? 0) + (rightMeta.width ?? 0) + gap;
  const label = Buffer.from(
    `<svg width="${width}" height="${header}"><rect width="100%" height="100%" fill="#24362d"/><text x="8" y="22" fill="white" font-family="Arial" font-size="14">${labels[0]}</text><text x="${(leftMeta.width ?? 0) + gap + 8}" y="22" fill="white" font-family="Arial" font-size="14">${labels[1]}</text></svg>`,
  );
  await sharp({
    create: {
      width,
      height: height + header,
      channels: 3,
      background: "#f4ecdc",
    },
  })
    .composite([
      { input: label, left: 0, top: 0 },
      { input: left, left: 0, top: header },
      { input: right, left: (leftMeta.width ?? 0) + gap, top: header },
    ])
    .jpeg({ quality: 92 })
    .toFile(output);
}

async function overlayOverview(metric, source, output) {
  const { width, height } = await sharp(source).metadata();
  const canvas = metric.boxes.canvas;
  const polygonText =
    metric.viewport.width > metric.viewport.height
      ? "470,195 720,155 990,205 1260,300 1335,520 1390,760 1335,1010 1150,1230 850,1300 590,1250 330,1130 235,900 245,650 285,390"
      : "360,1105 650,1055 900,1090 1115,1190 1210,1390 1200,1620 1240,1890 1130,2115 900,2240 650,2200 415,2240 220,2090 150,1860 165,1580 160,1340 245,1175";
  const sourceWidth = metric.viewport.width > metric.viewport.height ? 2560 : 1440;
  const sourceHeight = metric.viewport.width > metric.viewport.height ? 1440 : 2560;
  const points = polygonText
    .split(" ")
    .map((pair) => pair.split(",").map(Number))
    .map(([x, y]) =>
      `${canvas.left + (x / sourceWidth) * canvas.width},${canvas.top + (y / sourceHeight) * canvas.height}`,
    )
    .join(" ");
  const boxes = metric.sectors
    .map(
      (sector) =>
        `<rect x="${sector.alphaBox.left}" y="${sector.alphaBox.top}" width="${sector.alphaBox.right - sector.alphaBox.left}" height="${sector.alphaBox.bottom - sector.alphaBox.top}"/><rect x="${sector.label.left}" y="${sector.label.top}" width="${sector.label.width}" height="${sector.label.height}" stroke="#1565c0"/><rect x="${sector.target.left}" y="${sector.target.top}" width="${sector.target.width}" height="${sector.target.height}" stroke="#6a1b9a"/>`,
    )
    .join("");
  const svg = Buffer.from(
    `<svg width="${width}" height="${height}"><g fill="none" stroke="#d32f2f" stroke-width="2"><polygon points="${points}"/>${boxes}</g><g font-family="Arial" font-size="12" font-weight="700"><text x="10" y="20" fill="#d32f2f">cavidad + alpha bbox</text><text x="10" y="36" fill="#1565c0">rótulos</text><text x="10" y="52" fill="#6a1b9a">targets</text></g></svg>`,
  );
  const rendered = await sharp(source)
    .composite([{ input: svg, left: 0, top: 0 }])
    .png()
    .toBuffer();
  await fs.writeFile(output, rendered);
}

async function overlayPlants(metric, source, output) {
  const { width, height } = await sharp(source).metadata();
  const contact = metric.plantContact;
  const canvas = metric.boxes.canvas;
  const svg = Buffer.from(
    `<svg width="${width}" height="${height}"><g fill="none" stroke-width="2"><rect x="${canvas.left}" y="${contact.soilBand.top}" width="${canvas.width}" height="${contact.soilBand.bottom - contact.soilBand.top}" stroke="#795548" fill="#795548" fill-opacity=".16"/><line x1="${canvas.left}" y1="${contact.boundaryY}" x2="${canvas.right}" y2="${contact.boundaryY}" stroke="#d32f2f"/><circle cx="${contact.base.x}" cy="${contact.base.y}" r="5" stroke="#2e7d32" fill="#2e7d32"/></g><g font-family="Arial" font-size="12" font-weight="700"><text x="10" y="20" fill="#795548">SOIL_DARK_BAND</text><text x="10" y="36" fill="#d32f2f">tierra / cara frontal</text><text x="10" y="52" fill="#2e7d32">P_PLANT_BASE · inserción ${contact.insertionPx.toFixed(2)} px</text></g></svg>`,
  );
  const rendered = await sharp(source)
    .composite([{ input: svg, left: 0, top: 0 }])
    .png()
    .toBuffer();
  await fs.writeFile(output, rendered);
}

async function overlaySystem(metric, source, output) {
  const { width, height } = await sharp(source).metadata();
  const canvas = metric.boxes.canvas;
  const focus = metric.boxes.systemFocus;
  const centerX = focus.left + focus.width / 2;
  const centerY = focus.top + focus.height / 2;
  const svg = Buffer.from(
    `<svg width="${width}" height="${height}"><g fill="none" stroke-width="2"><rect x="${canvas.left}" y="${canvas.top}" width="${canvas.width}" height="${canvas.height}" stroke="#1565c0"/><rect x="${focus.left}" y="${focus.top}" width="${focus.width}" height="${focus.height}" stroke="#d32f2f"/><line x1="${centerX}" y1="${focus.top}" x2="${centerX}" y2="${focus.bottom}" stroke="#2e7d32"/><line x1="${focus.left}" y1="${centerY}" x2="${focus.right}" y2="${centerY}" stroke="#2e7d32"/></g><g font-family="Arial" font-size="12" font-weight="700"><text x="10" y="20" fill="#1565c0">mediaCanvas proyectado</text><text x="10" y="36" fill="#d32f2f">bbox Sistema</text><text x="10" y="52" fill="#2e7d32">ejes · -2.5° portrait / -2° landscape</text></g></svg>`,
  );
  const rendered = await sharp(source)
    .composite([{ input: svg, left: 0, top: 0 }])
    .png()
    .toBuffer();
  await fs.writeFile(output, rendered);
}

async function exactSourceGeometry(metrics) {
  const results = {};
  for (const orientation of ["portrait", "landscape"]) {
    const metric = metrics.find(
      (entry) =>
        entry.scene === "01_overview_new" &&
        (entry.viewport.width > entry.viewport.height
          ? "landscape"
          : "portrait") === orientation,
    );
    const rimFile =
      orientation === "portrait"
        ? "world5_map_rim_portrait_v01.webp"
        : "world5_map_rim_landscape_v01.webp";
    const rim = await sharp(path.join(runtimeDir, rimFile))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const mask = new Uint8Array(rim.info.width * rim.info.height);
    for (let y = 0; y < rim.info.height; y += 1) {
      const runs = [];
      let start = -1;
      for (let x = 0; x < rim.info.width; x += 1) {
        const alpha = rim.data[(y * rim.info.width + x) * 4 + 3];
        if (alpha > 32 && start < 0) start = x;
        if ((alpha <= 32 || x === rim.info.width - 1) && start >= 0) {
          const end = alpha > 32 && x === rim.info.width - 1 ? x : x - 1;
          if (end - start >= 2) runs.push([start, end]);
          start = -1;
        }
      }
      if (runs.length >= 2) {
        for (let x = runs[0][1] + 1; x < runs.at(-1)[0]; x += 1) {
          mask[y * rim.info.width + x] = 1;
        }
      }
    }
    results[orientation] = {};
    for (const sector of metric.sectors) {
      const asset = await sharp(path.join(runtimeDir, sectorFiles[sector.area]))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const placement = sector.sourcePlacement;
      let opaque = 0;
      let inside = 0;
      let clipped = 0;
      for (let y = 0; y < asset.info.height; y += 1) {
        for (let x = 0; x < asset.info.width; x += 1) {
          if (asset.data[(y * asset.info.width + x) * 4 + 3] <= 8) continue;
          opaque += 1;
          const targetX = Math.round(placement.x + (x / 1536) * placement.size);
          const targetY = Math.round(placement.y + (y / 1536) * placement.size);
          if (
            targetX < 0 ||
            targetY < 0 ||
            targetX >= rim.info.width ||
            targetY >= rim.info.height
          ) {
            clipped += 1;
          } else if (mask[targetY * rim.info.width + targetX]) {
            inside += 1;
          }
        }
      }
      results[orientation][sector.area] = {
        opaquePixels: opaque,
        opaquePixelsInsideRecess: inside,
        opaquePixelsInsideRecessPercent: (inside / opaque) * 100,
        alphaClippingPixels: clipped,
        sourcePlacement: placement,
      };
    }
  }
  return results;
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
    const entries = [];
    for (const scenario of scenarios) {
      const page = await context.newPage();
      const telemetry = {
        consoleErrors: [],
        pageErrors: [],
        responses404: [],
        externalRequests: [],
      };
      page.on("console", (message) => {
        if (message.type() === "error") telemetry.consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => telemetry.pageErrors.push(error.message));
      page.on("response", (response) => {
        if (response.status() === 404) telemetry.responses404.push(response.url());
      });
      page.on("request", (request) => {
        if (!request.url().startsWith(baseURL)) telemetry.externalRequests.push(request.url());
      });
      await prepare(page, scenario);
      const file = path.join(outDir, `${viewport.name}_${scenario.id}.png`);
      await page.screenshot({ path: file, fullPage: false });
      metrics.push(await measure(page, viewport, scenario, telemetry));
      entries.push({ file, label: `${viewport.name} · ${scenario.id}` });
      await page.close();
    }
    await context.close();
    await makeSheet(
      entries,
      path.join(outDir, `contact_sheet_${viewport.name}.jpg`),
      viewport.width > viewport.height ? 260 : 440,
    );
  }

  const dynamic = {};
  for (const sequence of [
    { key: "375", width: 375, heights: [548, 667, 548] },
    { key: "360", width: 360, heights: [560, 640, 560] },
  ]) {
    const dynamicPage = await browser.newPage({
      viewport: { width: sequence.width, height: sequence.heights[0] },
    });
    await prepare(dynamicPage, scenarios[2]);
    dynamic[sequence.key] = [];
    for (const height of sequence.heights) {
      await dynamicPage.setViewportSize({ width: sequence.width, height });
      await dynamicPage.waitForTimeout(80);
      const data = await measure(
        dynamicPage,
        {
          name: `${sequence.width}x${height}`,
          width: sequence.width,
          height,
        },
        scenarios[2],
        {
          consoleErrors: [],
          pageErrors: [],
          responses404: [],
          externalRequests: [],
        },
      );
      const file = path.join(
        outDir,
        `dynamic_${sequence.width}x${height}_${dynamic[sequence.key].length + 1}.png`,
      );
      await dynamicPage.screenshot({ path: file, fullPage: false });
      dynamic[sequence.key].push({ ...data, file: path.basename(file) });
    }
    await dynamicPage.close();
  }
  await fs.writeFile(
    path.join(outDir, "dynamic_viewport.json"),
    `${JSON.stringify(dynamic, null, 2)}\n`,
  );

  const reflowPage = await browser.newPage({ viewport: { width: 195, height: 422 } });
  await prepare(reflowPage, scenarios[2]);
  await reflowPage.screenshot({
    path: path.join(outDir, "reflow_200pct_proxy_195x422.png"),
    fullPage: true,
  });
  const reflow = await reflowPage.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    headings: [...document.querySelectorAll("h1,h2")].map((node) => node.textContent?.trim()),
  }));
  await reflowPage.close();
  await fs.writeFile(
    path.join(outDir, "reflow_200pct.json"),
    `${JSON.stringify(reflow, null, 2)}\n`,
  );
} finally {
  await browser.close();
}

const sourceGeometry = await exactSourceGeometry(metrics);
await fs.writeFile(
  path.join(outDir, "metrics.json"),
  `${JSON.stringify({ sourceGeometry, captures: metrics }, null, 2)}\n`,
);

for (const viewport of viewports) {
  const overviewMetric = metrics.find(
    (entry) =>
      entry.viewport.name === viewport.name && entry.scene === "01_overview_new",
  );
  const plantsMetric = metrics.find(
    (entry) =>
      entry.viewport.name === viewport.name && entry.scene === "03_plants_intro",
  );
  await overlayOverview(
    overviewMetric,
    path.join(outDir, `${viewport.name}_01_overview_new.png`),
    path.join(outDir, `qa_${viewport.name}_overview_overlay.png`),
  );
  await overlayPlants(
    plantsMetric,
    path.join(outDir, `${viewport.name}_03_plants_intro.png`),
    path.join(outDir, `qa_${viewport.name}_plants_overlay.png`),
  );
  const systemMetric = metrics.find(
    (entry) =>
      entry.viewport.name === viewport.name && entry.scene === "06_system_intro",
  );
  await overlaySystem(
    systemMetric,
    path.join(outDir, `${viewport.name}_06_system_intro.png`),
    path.join(outDir, `qa_${viewport.name}_system_projection_overlay.png`),
  );
}

for (const viewport of ["360x560", "375x548", "375x667"]) {
  const previous =
    viewport === "375x548"
      ? path.join(previousDir, "375x667_01_overview_new.png")
      : path.join(previousDir, `${viewport}_01_overview_new.png`);
  await sideBySide(
    previous,
    path.join(outDir, `${viewport}_01_overview_new.png`),
    path.join(outDir, `comparison_020d_020e_overview_${viewport}.jpg`),
    [viewport === "375x548" ? "020D 375x667 proxy" : "020D", "020E"],
  );
}
await sideBySide(
  path.join(previousDir, "375x667_03_plants_intro.png"),
  path.join(outDir, "375x667_03_plants_intro.png"),
  path.join(outDir, "comparison_020d_020e_plants_375x667.jpg"),
  ["020D", "020E"],
);
await sideBySide(
  path.join(previousDir, "375x667_06_system_intro.png"),
  path.join(outDir, "375x667_06_system_intro.png"),
  path.join(outDir, "comparison_020d_020e_system_375x667.jpg"),
  ["020D", "020E"],
);

const allSectorMetrics = metrics.flatMap((entry) => entry.sectors);
const plantMetrics = metrics
  .filter((entry) => entry.plantContact)
  .map((entry) => ({
    ...entry.plantContact,
    viewport: entry.viewport,
  }));
const sourceEntries = Object.values(sourceGeometry).flatMap((entry) =>
  Object.values(entry),
);
const summary = {
  captureCount: metrics.length,
  viewportCount: viewports.length,
  stateCount: scenarios.length,
  sourceGeometry,
  minimumOpaquePixelsInsideRecessPercent: Math.min(
    ...sourceEntries.map((entry) => entry.opaquePixelsInsideRecessPercent),
  ),
  alphaClippingPixels: sourceEntries.reduce(
    (sum, entry) => sum + entry.alphaClippingPixels,
    0,
  ),
  labelDistancePx: {
    min: Math.min(...allSectorMetrics.map((entry) => entry.labelDistancePx)),
    max: Math.max(...allSectorMetrics.map((entry) => entry.labelDistancePx)),
  },
  stageAndCard: metrics
    .filter(
      (entry) =>
        entry.scene === "01_overview_new" &&
        ["360x560", "375x548", "375x667"].includes(entry.viewport.name),
    )
    .map((entry) => ({
      viewport: entry.viewport.name,
      stageHeight: entry.boxes.stage.height,
      stageShare: entry.stageShare,
      cardHeight: entry.boxes.card.height,
    })),
  minVisibleLiaHeight: Math.min(
    ...metrics.map(
      (entry) => entry.boxes.liaVisibleAlpha?.height ?? Number.POSITIVE_INFINITY,
    ),
  ),
  plantInsertionPx: {
    min: Math.min(...plantMetrics.map((entry) => entry.insertionPx)),
    max: Math.max(...plantMetrics.map((entry) => entry.insertionPx)),
  },
  smallMobilePlantInsertionPx: {
    min: Math.min(
      ...plantMetrics
        .filter((entry) => entry.viewport.width <= 375)
        .map((entry) => entry.insertionPx),
    ),
    max: Math.max(
      ...plantMetrics
        .filter((entry) => entry.viewport.width <= 375)
        .map((entry) => entry.insertionPx),
    ),
  },
  minTargetDimension: Math.min(
    ...metrics.flatMap((entry) =>
      entry.targets.map((target) => Math.min(target.width, target.height)),
    ),
  ),
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
  minBodyFontSize: Math.min(...metrics.map((entry) => entry.minBodyFontSize)),
  forbiddenCount: metrics.reduce((sum, entry) => sum + entry.forbiddenCount, 0),
  consoleAndPageErrors: metrics.reduce(
    (sum, entry) =>
      sum +
      entry.telemetry.consoleErrors.length +
      entry.telemetry.pageErrors.length,
    0,
  ),
  responses404: metrics.reduce(
    (sum, entry) => sum + entry.telemetry.responses404.length,
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
