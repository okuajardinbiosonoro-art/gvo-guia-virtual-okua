/* eslint-disable */
const { chromium } = require("playwright");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = __dirname;
const baseUrl = "http://127.0.0.1:5185/estacion/2";
const viewports = [
  { width: 360, height: 560 },
  { width: 360, height: 640 },
  { width: 375, height: 559 },
  { width: 375, height: 667 },
  { width: 390, height: 650 },
  { width: 390, height: 844 },
  { width: 430, height: 740 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
];

const requiredClosureShots = new Map([
  ["360x560", "world2_016V_R2_360x560_closure_centered.png"],
  ["375x667", "world2_016V_R2_375x667_closure_centered.png"],
  ["390x844", "world2_016V_R2_390x844_closure_centered.png"],
  ["430x932", "world2_016V_R2_430x932_closure_centered.png"],
  ["1024x768", "world2_016V_R2_1024x768_closure_centered.png"],
]);

function roundBox(box) {
  if (!box) return null;
  return Object.fromEntries(
    Object.entries(box).map(([key, value]) => [key, Number(value.toFixed(2))]),
  );
}

function intersects(a, b) {
  return Boolean(
    a &&
      b &&
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y,
  );
}

async function swipeLeft(page) {
  const zone = page.locator('[data-world2-capture-interaction="swipe-timeline"]');
  const box = await zone.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width * 0.72, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.28, y, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(500);
}

async function prepareMapping(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[data-world2-runtime-version="016V-R2"]').waitFor();
  await page.locator('[data-critical-assets-ready="true"]').waitFor();
  await page.locator('[data-plant-contact-hotspot="016J"]').click();
  await page.locator('[data-world2-layer="senal"]').click();
  await page.locator('[data-world2-signal-reveal-control="onda-medida"]').click();
  await page.locator('[data-world2-layer="captura"]').click();
  await swipeLeft(page);
  await swipeLeft(page);
  await page.locator('[data-world2-capture-readout="system"]').waitFor();
  await page.locator('[data-world2-layer="acondicionamiento"]').click();
  await page.locator('[data-conditioning-cinema="016T-R2"]').waitFor();
  await page.locator('[data-world2-layer="mapeo"]').click();
  await page.locator('[data-mapping-pedagogy="016U-R5"]').waitFor();
  await page.waitForTimeout(300);
}

async function enterOption6(page) {
  await page.clock.install();
  await page.locator('[data-world2-layer="resultado_mediado"]').click();
  await page.locator('[data-world2-option6-stage="intensity"]').waitFor();
}

async function sceneScreenshot(page) {
  const box = await page.locator('[data-world2-zone="scene"]').boundingBox();
  return page.screenshot({ type: "png", clip: box });
}

async function measureOption6(page, viewport, stage) {
  const selectors = {
    primaryScene: '[data-world2-option6-primary-scene="sonic-core"]',
    lia: '[data-lia-layer-id="resultado_mediado"]',
    dialogue: '[data-world2-zone="dialogue"]',
    nav: '[data-world2-zone="nav"]',
    sceneZone: '[data-world2-zone="scene"]',
  };
  const boxes = {};
  for (const [name, selector] of Object.entries(selectors)) {
    boxes[name] = roundBox(await page.locator(selector).boundingBox());
  }
  const state = await page.locator('[data-world2-option6-mode="final-sonic-convergence"]').evaluate(
    (panel) => ({
      stage: panel.dataset.world2Option6Stage,
      complete: panel.dataset.world2Option6Complete,
      simultaneousMarker: panel.dataset.world2Option6SimultaneousPrimaryScenes,
      primarySceneCount: panel.querySelectorAll("[data-world2-option6-primary-scene]").length,
      legacyPanelCount: panel.querySelectorAll(".world2-mediated-panel, .world2-mediated-chip, .world2-mediated-flow").length,
      visibleTextCount: [...panel.querySelectorAll("p")].filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
      }).length,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      journeyState: document.querySelector("[data-world2-state]")?.dataset.world2State,
    }),
  );
  const checks = {
    expectedStage: state.stage === stage,
    onePrimaryScene: state.primarySceneCount === 1 && state.simultaneousMarker === "1",
    noLegacyPanel: state.legacyPanelCount === 0,
    lowTextLoad: state.visibleTextCount <= (stage === "resolved" ? 2 : 1),
    sceneInsideZone:
      boxes.primaryScene.x >= boxes.sceneZone.x - 1 &&
      boxes.primaryScene.y >= boxes.sceneZone.y - 1 &&
      boxes.primaryScene.x + boxes.primaryScene.width <= boxes.sceneZone.x + boxes.sceneZone.width + 1 &&
      boxes.primaryScene.y + boxes.primaryScene.height <= boxes.sceneZone.y + boxes.sceneZone.height + 1,
    clearOfDialogue: !intersects(boxes.primaryScene, boxes.dialogue),
    clearOfNav: !intersects(boxes.primaryScene, boxes.nav),
    liaDoesNotCoverCore: !intersects(
      {
        x: boxes.primaryScene.x + boxes.primaryScene.width * 0.34,
        y: boxes.primaryScene.y + boxes.primaryScene.height * 0.28,
        width: boxes.primaryScene.width * 0.32,
        height: boxes.primaryScene.height * 0.44,
      },
      boxes.lia,
    ),
    noHorizontalOverflow: state.documentWidth <= state.viewportWidth,
    gateStillClosed: stage !== "resolved" || state.journeyState === "resultado_mediado",
  };
  return {
    viewport: `${viewport.width}x${viewport.height}`,
    stage,
    boxes,
    state,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

async function measureClosure(page, viewport) {
  const selectors = {
    panel: '[data-world2-closure-layout="centered-balanced"]',
    title: '[data-world2-closure-layout="centered-balanced"] .world2-dialogue__title',
    message: '[data-world2-closure-layout="centered-balanced"] .world2-dialogue__copy',
    button: '[data-world2-closure-layout="centered-balanced"] .world2-action--continue',
    content: '[data-world2-closure-layout="centered-balanced"] .world2-dialogue__content',
    lia: '[data-lia-layer-id="ready_to_continue"]',
    nav: '[data-world2-zone="nav"]',
  };
  const boxes = {};
  for (const [name, selector] of Object.entries(selectors)) {
    boxes[name] = roundBox(await page.locator(selector).boundingBox());
  }
  boxes.block = roundBox({
    x: Math.min(boxes.title.x, boxes.message.x, boxes.button.x),
    y: boxes.title.y,
    width:
      Math.max(
        boxes.title.x + boxes.title.width,
        boxes.message.x + boxes.message.width,
        boxes.button.x + boxes.button.width,
      ) - Math.min(boxes.title.x, boxes.message.x, boxes.button.x),
    height: boxes.button.y + boxes.button.height - boxes.title.y,
  });
  const state = await page.evaluate(() => {
    const panel = document.querySelector('[data-world2-closure-layout="centered-balanced"]');
    const title = panel.querySelector(".world2-dialogue__title");
    const content = panel.querySelector(".world2-dialogue__content");
    const recurrence = [...document.querySelectorAll("p")].filter((element) =>
      /^RECORRIDO COMPLET(O|ADO)$/i.test(element.textContent.trim()),
    );
    return {
      layout: panel.dataset.world2ClosureLayout,
      titleCountMarker: panel.dataset.world2ClosureTitleCount,
      titleCount: recurrence.length,
      titleClipped:
        title.scrollWidth > title.clientWidth + 1 || title.scrollHeight > title.clientHeight + 1,
      internalOverflow:
        content.scrollWidth > content.clientWidth + 1 || content.scrollHeight > content.clientHeight + 1,
      state: document.querySelector("[data-world2-state]")?.dataset.world2State,
      activeLayerContent: document.querySelector("[data-world2-state]")?.dataset
        .world2ActiveLayerContent,
      overlayVisible: document.querySelector("[data-world2-state]")?.dataset
        .world2Option6OverlayVisible,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
    };
  });
  const titleMessageGap = boxes.message.y - (boxes.title.y + boxes.title.height);
  const messageButtonGap = boxes.button.y - (boxes.message.y + boxes.message.height);
  const verticalCenterOffsetRatio = Number(
    (
      (boxes.block.y + boxes.block.height / 2 -
        (boxes.panel.y + boxes.panel.height / 2)) /
      boxes.panel.height
    ).toFixed(4),
  );
  const checks = {
    readyState: state.state === "ready_to_continue",
    centeredLayout:
      state.layout === "centered-balanced" &&
      Math.abs(verticalCenterOffsetRatio) <= 0.08,
    closureContentMarker:
      state.activeLayerContent === "closure" && state.overlayVisible === "true",
    oneTitle: state.titleCount === 1 && state.titleCountMarker === "1",
    titleLegible: !state.titleClipped,
    noInternalOverflow: !state.internalOverflow,
    separatedZones: titleMessageGap >= 4 && messageButtonGap >= 8,
    buttonInsideViewport:
      boxes.button.x >= 0 &&
      boxes.button.y >= 0 &&
      boxes.button.x + boxes.button.width <= viewport.width &&
      boxes.button.y + boxes.button.height <= viewport.height,
    buttonInsidePanel:
      boxes.button.x >= boxes.panel.x &&
      boxes.button.y >= boxes.panel.y &&
      boxes.button.x + boxes.button.width <= boxes.panel.x + boxes.panel.width &&
      boxes.button.y + boxes.button.height <= boxes.panel.y + boxes.panel.height,
    noOverlap:
      !intersects(boxes.title, boxes.message) &&
      !intersects(boxes.message, boxes.button) &&
      !intersects(boxes.button, boxes.nav) &&
      !intersects(boxes.button, boxes.lia),
    noHorizontalOverflow: state.documentWidth <= state.viewportWidth,
  };
  return {
    viewport: `${viewport.width}x${viewport.height}`,
    boxes,
    state,
    titleMessageGap: Number(titleMessageGap.toFixed(2)),
    messageButtonGap: Number(messageButtonGap.toFixed(2)),
    verticalCenterOffsetRatio,
    panelContentHeightRatio: Number((boxes.content.height / boxes.panel.height).toFixed(4)),
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

async function makeBeforeAfter(current) {
  const beforePath = path.join(outDir, "..", "016U-R5", "world2_016U_R5_layer_6_regression_check.png");
  const before = await sharp(beforePath).resize(390, 844, { fit: "cover" }).png().toBuffer();
  const after = await sharp(current).resize(390, 844, { fit: "cover" }).png().toBuffer();
  const labels = Buffer.from('<svg width="780" height="844" xmlns="http://www.w3.org/2000/svg"><rect width="780" height="38" fill="#07111ddd"/><text x="18" y="25" fill="#fff" font-family="Arial" font-size="16">ANTES · 016U-R5</text><text x="408" y="25" fill="#fff" font-family="Arial" font-size="16">DESPUÉS · 016V</text><line x1="390" y1="0" x2="390" y2="844" stroke="#a7edf0" stroke-width="2"/></svg>');
  await sharp({ create: { width: 780, height: 844, channels: 4, background: "#07111d" } })
    .composite([{ input: before, left: 0, top: 0 }, { input: after, left: 390, top: 0 }, { input: labels, left: 0, top: 0 }])
    .png()
    .toFile(path.join(outDir, "world2_016V_R2_layer_6_before_after.png"));
}

async function makeContactSheet(items) {
  const columns = 5;
  const thumbWidth = 210;
  const thumbHeight = 300;
  const labelHeight = 22;
  const gap = 10;
  const header = 42;
  const rows = Math.ceil(items.length / columns);
  const width = gap + columns * (thumbWidth + gap);
  const height = header + rows * (thumbHeight + labelHeight + gap);
  const composites = [{
    input: Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#07111d"/><text x="12" y="27" fill="#fff" font-family="Arial" font-size="19" font-weight="700">016V-R2 · Revisión posterior al cierre</text></svg>`),
    left: 0,
    top: 0,
  }];
  for (let index = 0; index < items.length; index += 1) {
    const left = gap + (index % columns) * (thumbWidth + gap);
    const top = header + Math.floor(index / columns) * (thumbHeight + labelHeight + gap);
    composites.push({ input: await sharp(items[index].buffer).resize({ width: thumbWidth, height: thumbHeight, fit: "contain", background: "#07111d" }).png().toBuffer(), left, top });
    composites.push({ input: Buffer.from(`<svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#101d2b"/><text x="6" y="15" fill="#d9e8f5" font-family="Arial" font-size="11">${items[index].label}</text></svg>`), left, top: top + thumbHeight });
  }
  await sharp({ create: { width, height, channels: 4, background: "#07111d" } }).composite(composites).png().toFile(path.join(outDir, "world2_016V_R2_post_completion_revisit_contact_sheet.png"));
}

async function makeBalanceOverlay(buffer, measurement, viewport) {
  const { panel, block } = measurement.boxes;
  const panelCenter = panel.y + panel.height / 2;
  const blockCenter = block.y + block.height / 2;
  const svg = Buffer.from(`<svg width="${viewport.width}" height="${viewport.height}" xmlns="http://www.w3.org/2000/svg"><rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" fill="none" stroke="#ffffff" stroke-width="2"/><rect x="${block.x}" y="${block.y}" width="${block.width}" height="${block.height}" fill="none" stroke="#f3c677" stroke-width="2"/><line x1="${panel.x}" y1="${panelCenter}" x2="${panel.x + panel.width}" y2="${panelCenter}" stroke="#a7edf0" stroke-dasharray="5 4"/><line x1="${block.x}" y1="${blockCenter}" x2="${block.x + block.width}" y2="${blockCenter}" stroke="#f3c677" stroke-dasharray="5 4"/><text x="${panel.x + 8}" y="${panelCenter - 6}" fill="#a7edf0" font-family="Arial" font-size="12">centro panel ${panelCenter.toFixed(1)}</text><text x="${block.x + 8}" y="${blockCenter - 6}" fill="#f3c677" font-family="Arial" font-size="12">centro bloque ${blockCenter.toFixed(1)}</text></svg>`);
  await sharp(buffer).composite([{ input: svg, left: 0, top: 0 }]).png().toFile(path.join(outDir, "world2_016V_R2_closure_vertical_balance_overlay.png"));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const option6Measurements = [];
  const closureMeasurements = [];
  const revisitMeasurements = [];
  const revisitContactItems = [];

  for (const viewport of viewports) {
    const key = `${viewport.width}x${viewport.height}`;
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await prepareMapping(page);
    if (key === "390x844") {
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_layer_5_regression_check.png"), await page.screenshot({ type: "png" }));
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_nav_stable_row_check.png"), await page.screenshot({ type: "png" }));
    }
    await enterOption6(page);
    option6Measurements.push(await measureOption6(page, viewport, "intensity"));
    if (key === "360x640") fs.writeFileSync(path.join(outDir, "world2_016V_R2_360x640_layer_6_intensity_phase.png"), await sceneScreenshot(page));

    await page.clock.fastForward(2100);
    await page.locator('[data-world2-option6-stage="rhythm"]').waitFor();
    option6Measurements.push(await measureOption6(page, viewport, "rhythm"));
    if (key === "360x640") fs.writeFileSync(path.join(outDir, "world2_016V_R2_360x640_layer_6_rhythm_phase.png"), await sceneScreenshot(page));

    await page.clock.fastForward(2100);
    await page.locator('[data-world2-option6-stage="pitch"]').waitFor();
    option6Measurements.push(await measureOption6(page, viewport, "pitch"));
    if (key === "360x640") fs.writeFileSync(path.join(outDir, "world2_016V_R2_360x640_layer_6_pitch_phase.png"), await sceneScreenshot(page));

    await page.clock.fastForward(2100);
    await page.locator('[data-world2-option6-stage="resolved"]').waitFor();
    option6Measurements.push(await measureOption6(page, viewport, "resolved"));
    const resolved = await page.screenshot({ type: "png" });
    const resolvedNames = new Map([
      ["360x640", "world2_016V_R2_360x640_layer_6_resolved_phase.png"],
      ["390x844", "world2_016V_R2_390x844_layer_6_resolved_phase.png"],
      ["430x932", "world2_016V_R2_430x932_layer_6_resolved_phase.png"],
      ["1024x768", "world2_016V_R2_1024x768_layer_6_resolved_phase.png"],
    ]);
    if (resolvedNames.has(key)) fs.writeFileSync(path.join(outDir, resolvedNames.get(key)), resolved);
    if (key === "390x844") {
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_layer_6_lia_guidance_detail.png"), await sceneScreenshot(page));
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_layer_6_single_scene_detail.png"), await sceneScreenshot(page));
    }

    await page.clock.fastForward(9000);
    await page.locator('[data-world2-closure-layout="centered-balanced"]').waitFor();
    const closureMeasurement = await measureClosure(page, viewport);
    closureMeasurements.push(closureMeasurement);
    const closure = await page.screenshot({ type: "png" });
    if (requiredClosureShots.has(key)) fs.writeFileSync(path.join(outDir, requiredClosureShots.get(key)), closure);
    if (key === "390x844") {
      const titleBox = await page.locator('[data-world2-closure-layout="centered-balanced"] .world2-dialogue__title').boundingBox();
      const buttonBox = await page.locator('[data-world2-closure-layout="centered-balanced"] .world2-action--continue').boundingBox();
      const clip = (box, pad) => ({ x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: Math.min(viewport.width - Math.max(0, box.x - pad), box.width + pad * 2), height: Math.min(viewport.height - Math.max(0, box.y - pad), box.height + pad * 2) });
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_closure_title_legibility_detail.png"), await page.screenshot({ type: "png", clip: clip(titleBox, 18) }));
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_closure_cta_alignment_detail.png"), await page.screenshot({ type: "png", clip: clip(buttonBox, 18) }));
      await makeBalanceOverlay(closure, closureMeasurement, viewport);

      const revisitTargets = [
        ["planta_viva", "plant", '[data-plant-contact-hotspot="016J"]'],
        ["senal", "signal", '[data-signal-cinema="016J"]'],
        ["captura", "capture", '[data-world2-capture-timeline="016R"]'],
        ["acondicionamiento", "conditioning", '[data-conditioning-cinema="016T-R2"]'],
        ["mapeo", "mapping", '[data-mapping-pedagogy="016U-R5"]'],
      ];
      for (let index = 0; index < revisitTargets.length; index += 1) {
        const [layerId, content, selector] = revisitTargets[index];
        await page.locator(`[data-world2-layer="${layerId}"]`).click();
        await page.locator(selector).waitFor();
        const state = await page.evaluate(
          ({ expectedContent, expectedLayer }) => {
            const root = document.querySelector("[data-world2-state]");
            return {
              activeLayer: root.dataset.world2ActiveLayer,
              activeLayerContent: root.dataset.world2ActiveLayerContent,
              overlayVisible: root.dataset.world2Option6OverlayVisible,
              highestUnlocked: root.dataset.world2HighestUnlockedLayer,
              visitedLayers: root.dataset.world2VisitedLayers,
              closureCount: document.querySelectorAll("[data-world2-closure-layout]").length,
              option6Count: document.querySelectorAll('[data-world2-option6-mode="final-sonic-convergence"]').length,
              lockedCount: document.querySelectorAll('[data-layer-state="locked"]').length,
              pass:
                root.dataset.world2ActiveLayer === expectedLayer &&
                root.dataset.world2ActiveLayerContent === expectedContent &&
                root.dataset.world2Option6OverlayVisible === "false" &&
                root.dataset.world2HighestUnlockedLayer === "6" &&
                root.dataset.world2VisitedLayers === "1,2,3,4,5,6" &&
                document.querySelectorAll("[data-world2-closure-layout]").length === 0 &&
                document.querySelectorAll('[data-world2-option6-mode="final-sonic-convergence"]').length === 0 &&
                document.querySelectorAll('[data-layer-state="locked"]').length === 0,
            };
          },
          { expectedContent: content, expectedLayer: layerId },
        );
        const screenshot = await page.screenshot({ type: "png" });
        fs.writeFileSync(path.join(outDir, `world2_016V_R2_after_completion_revisit_option${index + 1}.png`), screenshot);
        revisitContactItems.push({ buffer: screenshot, label: `opción ${index + 1}` });
        revisitMeasurements.push({ option: index + 1, layerId, state, pass: state.pass });
      }

      await page.locator('[data-world2-layer="resultado_mediado"]').click();
      await page.locator('[data-world2-closure-layout="centered-balanced"]').waitFor();
      const returnState = await page.evaluate(() => {
        const root = document.querySelector("[data-world2-state]");
        return {
          activeLayer: root.dataset.world2ActiveLayer,
          activeLayerContent: root.dataset.world2ActiveLayerContent,
          overlayVisible: root.dataset.world2Option6OverlayVisible,
          option6Complete: document.querySelector('[data-world2-option6-complete="true"]') !== null,
          closureVisible: document.querySelector('[data-world2-closure-layout="centered-balanced"]') !== null,
          continueVisible: document.querySelector('[data-world2-exit-action="navigate_to_transition"]') !== null,
          pass:
            root.dataset.world2ActiveLayer === "resultado_mediado" &&
            root.dataset.world2ActiveLayerContent === "closure" &&
            root.dataset.world2Option6OverlayVisible === "true" &&
            document.querySelector('[data-world2-option6-complete="true"]') !== null &&
            document.querySelector('[data-world2-closure-layout="centered-balanced"]') !== null &&
            document.querySelector('[data-world2-exit-action="navigate_to_transition"]') !== null,
        };
      });
      const returnShot = await page.screenshot({ type: "png" });
      fs.writeFileSync(path.join(outDir, "world2_016V_R2_return_to_option6_closure.png"), returnShot);
      revisitContactItems.push({ buffer: returnShot, label: "retorno cierre" });
      revisitMeasurements.push({ option: 6, layerId: "resultado_mediado", state: returnState, pass: returnState.pass });
    }
    await page.close();
  }

  await browser.close();
  await makeContactSheet(revisitContactItems);
  const failedOption6 = option6Measurements.filter((measurement) => !measurement.pass);
  const failedClosures = closureMeasurements.filter((measurement) => !measurement.pass);
  const failedRevisits = revisitMeasurements.filter((measurement) => !measurement.pass);
  const failed = failedOption6.length + failedClosures.length + failedRevisits.length;
  const output = {
    ticket: "016V-R2",
    generatedAt: new Date().toISOString(),
    baseUrl,
    viewports: viewports.map(({ width, height }) => `${width}x${height}`),
    result: { passed: option6Measurements.length + closureMeasurements.length + revisitMeasurements.length - failed, total: option6Measurements.length + closureMeasurements.length + revisitMeasurements.length, failed },
    option6Measurements,
    closureMeasurements,
    revisitMeasurements,
  };
  fs.writeFileSync(path.join(outDir, "layout_measurements.json"), `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output.result));
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
