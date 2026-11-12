import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { expect, test, type Browser, type Locator, type Page, type TestInfo } from "@playwright/test";

const sourcePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const sourceBytes = readFileSync(resolve(sourcePath));
const source = JSON.parse(sourceBytes.toString("utf8"));
const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as { toDataURL: (value: string, options: object) => Promise<string> };
const root = ".gvo-prepared-tree[data-journey-active='true'] main.world2-root-screen";
const profiles = [
  { name: "es-390", locale: "es", width: 390, height: 844, text200: false },
  { name: "en-390", locale: "en", width: 390, height: 844, text200: false },
  { name: "es-short", locale: "es", width: 568, height: 280, text200: false },
  { name: "en-short", locale: "en", width: 568, height: 280, text200: false },
  { name: "es-text200", locale: "es", width: 390, height: 844, text200: true },
  { name: "en-text200", locale: "en", width: 390, height: 844, text200: true },
] as const;
type Profile = typeof profiles[number];
type RecordRow = Record<string, unknown>;
declare global {
  interface Window {
    __obs04IIFlow?: { mode: "blank" | "wrong"; tracks: Array<{ audio: unknown; stopped: boolean }> };
  }
}

async function fixture(browser: Browser, baseURL: string, profile: Profile, review: boolean) {
  const context = await browser.newContext({
    baseURL, viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: 1,
    reducedMotion: review ? "reduce" : "no-preference", serviceWorkers: "block",
  });
  const state = structuredClone(review ? source.endEarned : source.normalScans[0].after);
  const wrongFrame = await QRCode.toDataURL("/qr/w5", { width: 512, margin: 4 });
  await context.addInitScript(({ state, profile, wrongFrame }) => {
    // Declared access fixtures in a fresh lab context. Never user browser data.
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", profile.locale);
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering], ["gvo.station5.quiz.v1", state.quiz]])
      if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
    if (profile.text200) {
      const apply = () => document.documentElement.style.fontSize = "200%";
      if (document.documentElement) apply();
      else new MutationObserver((_, observer) => { if (document.documentElement) { apply(); observer.disconnect(); } }).observe(document, { childList: true, subtree: true });
    }
    const lab = window.__obs04IIFlow = { mode: "blank", tracks: [] } as NonNullable<Window["__obs04IIFlow"]>;
    const devices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: devices });
    Object.defineProperty(devices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
      const row = { audio: constraints.audio, stopped: false }; lab.tracks.push(row);
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 640;
      const draw = canvas.getContext("2d")!; const image = new Image(); image.src = wrongFrame; await image.decode();
      const paint = () => { draw.fillStyle = "white"; draw.fillRect(0, 0, 640, 640); if (lab.mode === "wrong") draw.drawImage(image, 64, 64, 512, 512); };
      paint(); const stream = canvas.captureStream(12), timer = setInterval(paint, 80);
      for (const track of stream.getTracks()) { const stop = track.stop.bind(track); track.stop = () => { row.stopped = true; clearInterval(timer); stop(); }; }
      return stream;
    } });
  }, { state, profile, wrongFrame });
  return { context, page: await context.newPage() };
}

async function ready(page: Page) {
  await expect(page.locator(root)).toBeVisible();
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))); });
}
async function facts(page: Page) {
  return page.evaluate(() => {
    const snapshot = JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null");
    return { cover: snapshot?.cover, stations: snapshot?.stations, finalReached: snapshot?.finalReached,
      raw: ["gvo.progress.v1", "gvo.station4.ordering.v1", "gvo.station4.explanation.v1", "gvo.station5.quiz.v1", "gvo.station2.v1", "gvo.station3.practice.v2"].map((key) => [key, localStorage.getItem(key)]) };
  });
}

/** Native geometry, not an image-contrast or physical-reading certification. */
async function geometry(page: Page) {
  return page.locator(root).evaluate((element) => {
    const rect = (node: Element) => node.getBoundingClientRect().toJSON();
    const describe = (node: Element) => {
      const style = getComputedStyle(node);
      return { class: node.className, rect: rect(node), clientHeight: node.clientHeight, scrollHeight: node.scrollHeight, clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
        position: style.position, top: style.top, right: style.right, bottom: style.bottom, transform: style.transform, height: style.height, minHeight: style.minHeight, gridRows: style.gridTemplateRows, overflowX: style.overflowX, overflowY: style.overflowY };
    };
    const selectors = [".world2-stage", ".world2-scene-zone", ".world2-scene-field", ".world2-semantic-focus", ".world2-mapping-panel", ".world2-dialogue", ".world2-dialogue__content", ".world2-dialogue__safe", ".world2-layer-nav"];
    const boxes = selectors.flatMap((selector) => Array.from(element.querySelectorAll(selector)).map((node) => ({ selector, ...describe(node) })));
    const texts = Array.from(element.querySelectorAll(".world2-dialogue__copy,.world2-dialogue__title,.world2-mapping-result,.world2-plant-contact-readout,.world2-signal-cinema__readout,[data-world2-capture-readout]")).map((node) => {
      const range = document.createRange(); range.selectNodeContents(node);
      const fragments = Array.from(range.getClientRects()).map((r) => r.toJSON());
      const chain = []; const permanentClips = [];
      for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor), bounds = ancestor.getBoundingClientRect(); chain.push(describe(ancestor));
        for (const fragment of fragments) {
          const dx = Math.max(0, bounds.left - fragment.left, fragment.right - bounds.right), dy = Math.max(0, bounds.top - fragment.top, fragment.bottom - bounds.bottom);
          if ((/^(hidden|clip)$/.test(style.overflowX) && dx > 2) || (/^(hidden|clip)$/.test(style.overflowY) && dy > 2)) permanentClips.push({ class: ancestor.className, dx, dy });
        }
      }
      return { text: node.textContent, fragments, chain, permanentClips };
    });
    const dialogue = element.querySelector(".world2-dialogue")!.getBoundingClientRect(), navigation = element.querySelector(".world2-layer-nav")!.getBoundingClientRect();
    const wrapper = element.closest(".final-review-mode-layout")!;
    const mapping = element.querySelector("[data-world2-scene-layer='mapeo']"), actor = mapping?.querySelector("[data-world2-lia-actor]"), rig = actor?.querySelector(".world2-scene-asset--lia"), result = mapping?.querySelector(".world2-mapping-result");
    const field = mapping?.querySelector(".world2-scene-field");
    let mappingGuide = null;
    if (actor && rig && result && field) {
      const range = document.createRange(); range.selectNodeContents(result);
      const fragments = Array.from(range.getClientRects()).map((r) => r.toJSON()), rigRect = rig.getBoundingClientRect(), fieldRect = field.getBoundingClientRect();
      mappingGuide = { actor: describe(actor), rig: describe(rig), result: describe(result), field: describe(field), fragments,
        rigWithinField: rigRect.top >= fieldRect.top - 1 && rigRect.bottom <= fieldRect.bottom + 1 && rigRect.left >= fieldRect.left - 1 && rigRect.right <= fieldRect.right + 1,
        resultSeparation: Math.min(...fragments.map((fragment) => fragment.top)) - rigRect.bottom };
    }
    return { viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scroll: { x: scrollX, y: scrollY },
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      roomState: element.getAttribute("data-world2-state"), boxes, texts, mappingGuide, wrapper: describe(wrapper), navigationAfterDialogue: navigation.top >= dialogue.bottom - 1 };
  });
}
async function initialTitle(page: Page, records: RecordRow[], label: string, info: TestInfo) {
  await page.evaluate(() => scrollTo(0, 0));
  const measured = await page.locator(root + " h1").evaluate((title) => {
    const range = document.createRange(); range.selectNodeContents(title);
    const fragments = Array.from(range.getClientRects()).map((rect) => rect.toJSON());
    const controls = Array.from(document.querySelectorAll(".final-review-return-control,[data-gvo-immersive-control='fullscreen']")).filter((node) => {
      const rect = node.getBoundingClientRect(), style = getComputedStyle(node); return rect.width && rect.height && style.visibility !== "hidden";
    }).map((node) => ({ class: node.className, rect: node.getBoundingClientRect().toJSON() }));
    return { fragments, controls, scrollY, overlaps: fragments.flatMap((fragment) => controls.flatMap((control) => {
      const area = Math.max(0, Math.min(fragment.right, control.rect.right) - Math.max(fragment.left, control.rect.left)) * Math.max(0, Math.min(fragment.bottom, control.rect.bottom) - Math.max(fragment.top, control.rect.top));
      return area > 1 ? [{ area, fragment, control }] : [];
    })) };
  });
  records.push({ kind: "initial-title", label, ...measured });
  writeFileSync(info.outputPath("II-journal.json"), JSON.stringify(records, null, 2));
  if (label === "review-entry") await page.screenshot({ path: info.outputPath("review-initial-viewport.png"), scale: "css" });
  expect(measured.scrollY).toBe(0); expect(measured.overlaps, label + " title glyph fragments vs fixed controls").toEqual([]);
}
async function observe(page: Page, records: RecordRow[], label: string, info: TestInfo, screenshot = false) {
  const mappingActor = page.locator(root + " [data-world2-scene-layer='mapeo'] [data-world2-lia-actor]");
  if (await mappingActor.count()) await mappingActor.evaluate(async (node) => {
    // Observe the actual finite placement transition; never finish/cancel motion.
    await Promise.allSettled(node.getAnimations().filter((animation) => {
      const end = animation.effect?.getComputedTiming().endTime;
      return typeof end === "number" && Number.isFinite(end);
    }).map((animation) => animation.finished));
  });
  const measured = await geometry(page); records.push({ kind: "state", label, ...measured });
  // Persist every state before assertions, including a real failing geometry.
  writeFileSync(info.outputPath("II-journal.json"), JSON.stringify(records, null, 2));
  if (screenshot) await page.screenshot({ path: info.outputPath(label + "-viewport.png"), scale: "css" });
  expect(measured.document.width, label + " document width").toBeLessThanOrEqual(measured.viewport.width);
  expect(measured.navigationAfterDialogue, label + " navigation must follow the whole card").toBe(true);
  for (const text of measured.texts) expect(text.permanentClips, label + ": " + text.text).toEqual([]);
  const hasMeasuredMappingAnchor = measured.viewport.width <= 420 || (
    measured.viewport.width > 420 && measured.viewport.width <= 899 &&
    measured.viewport.height <= 420 && measured.viewport.width > measured.viewport.height
  );
  if (measured.mappingGuide && hasMeasuredMappingAnchor) {
    expect(measured.mappingGuide.rigWithinField, label + " Mapping guide within scene").toBe(true);
    expect(measured.mappingGuide.resultSeparation, label + " Mapping guide clear of result lines").toBeGreaterThanOrEqual(8);
  }
}
async function hitGeometry(control: Locator) {
  await control.scrollIntoViewIfNeeded(); await control.focus();
  return control.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    return { name: node.getAttribute("aria-label") ?? node.textContent, rect: bounds.toJSON(), pointerEvents: getComputedStyle(node).pointerEvents,
      focused: document.activeElement === node, scrollY,
      points: [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]].map(([x, y]) => {
        const px = bounds.left + bounds.width * x, py = bounds.top + bounds.height * y, hit = document.elementFromPoint(px, py);
        return { x: px, y: py, hit: hit?.className, matches: !!hit && (node === hit || node.contains(hit)) };
      }) };
  });
}
async function click(control: Locator, records: RecordRow[], setupPolicy?: "mirador-compound-link-center") {
  await expect(control).toBeEnabled(); const measured = await hitGeometry(control); records.push({ kind: "before-native-pointer", setupPolicy, ...measured });
  expect(measured.rect.width).toBeGreaterThanOrEqual(44); expect(measured.rect.height).toBeGreaterThanOrEqual(44);
  // The Mirador compound-link artwork is setup outside II: retain all five raw hits,
  // but require its native center only. Every II control and the return dock remain strict.
  const nativeHits = setupPolicy === "mirador-compound-link-center" ? measured.points[0].matches : measured.points.every((point) => point.matches);
  expect(nativeHits, `Native hit ${measured.name}`).toBe(true);
  await control.click(); // No force, Enter fallback, fake time or readiness hook.
}

async function scanner(page: Page, locale: string, records: RecordRow[]) {
  const before = await facts(page);
  await click(page.locator("[data-interstation-qr-action='open']"), records);
  const overlay = page.locator("[data-interstation-qr-gate='active'][role='dialog']"); await expect(overlay.locator("video")).toBeVisible();
  await page.evaluate(() => { window.__obs04IIFlow!.mode = "wrong"; });
  await expect(overlay).toContainText(locale === "es" ? "otra estación" : "another station");
  await click(overlay.locator("[data-interstation-qr-action='close']"), records);
  await expect(overlay).toHaveCount(0);
  await expect(page.locator("[data-interstation-qr-gate='active'] video")).toHaveCount(0);
  await expect(page.locator("[data-interstation-qr-action='open']")).toBeVisible();
  expect(await facts(page)).toEqual(before);
  const tracks = await page.evaluate(() => window.__obs04IIFlow!.tracks); records.push({ kind: "production-ZXing-wrong-canonical-lab", tracks });
  expect(tracks.length).toBeGreaterThan(0); expect(tracks.every((track) => track.stopped && track.audio === false)).toBe(true);
}

for (const profile of profiles) {
  test(`OBS04 II intrinsic flow ${profile.name}`, async ({ browser, baseURL, request }, info) => {
    if (!baseURL) throw Error("Explicit compiled loopback candidate required");
    const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
    const records: RecordRow[] = [{ qualification: "DECLARED access fixtures from real fresh06; no clean earned journey claim. Normal=no-preference, review=reduce. Native pointer only; CSS200 is root font scaling, not physical zoom.", profile, indexBefore, fixtureSource: sourcePath, fixtureSha256: createHash("sha256").update(sourceBytes).digest("hex") }];
    const errors: string[] = [];
    const normal = await fixture(browser, baseURL, profile, false);
    try {
      const page = normal.page;
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto("/estacion/2"); await ready(page);
      await initialTitle(page, records, "normal-entry", info);
      await click(page.locator("[data-plant-contact-hotspot]"), records); await observe(page, records, "normal-plant-readout", info);
      await click(page.locator(root + " .world2-reading-advance"), records);
      await click(page.locator("[data-world2-signal-reveal-control]"), records); await observe(page, records, "normal-signal-expanded", info);
      await click(page.locator(root + " .world2-reading-advance"), records);
      for (const step of [0, 1, 2]) {
        await click(page.locator(".world2-capture-timeline__step-control").nth(step), records);
        await expect(page.locator(".world2-capture-timeline[data-world2-capture-step]")).toHaveAttribute("data-world2-capture-step", ["contact", "signal", "system"][step]);
      }
      await observe(page, records, "normal-capture-system", info);
      await click(page.locator(root + " .world2-reading-advance"), records); await observe(page, records, "normal-conditioning", info);
      await click(page.locator(root + " .world2-reading-advance"), records);
      await expect(page.locator("[data-world2-mapping-step]")).toHaveAttribute("data-world2-mapping-step", "1");
      await observe(page, records, "normal-mapping-first", info);
      const result = page.locator(".world2-mapping-sequence__core[type='button']");
      if (profile.name === "es-390") {
        const poison = await page.addStyleTag({ content: ".world2-mapping-sequence__core[type='button']{pointer-events:none!important}" });
        const red = await hitGeometry(result); records.push({ kind: "isolated-negative-pointer-rule", ...red });
        expect(red.points.every((point) => point.matches)).toBe(false); await poison.evaluate((node) => node.remove());
      }
      await click(result, records);
      await expect(page.locator("[data-mapping-result='all-correspondences']")).toBeVisible();
      await observe(page, records, "normal-mapping-result", info, true);
      for (let step = 1; step <= 3; step++) {
        await click(page.locator(`[data-mapping-progress-step='${step}']`), records);
        await expect(page.locator("[data-world2-mapping-step]")).toHaveAttribute("data-world2-mapping-step", String(step));
      }
      await click(page.locator(root + " .world2-reading-advance"), records);
      for (const stage of ["intensity", "rhythm", "pitch", "resolved"]) {
        await expect(page.locator("[data-world2-option6-stage]")).toHaveAttribute("data-world2-option6-stage", stage);
        records.push({ kind: "natural-music-stage", stage });
      }
      await click(page.locator(root + " .world2-reading-advance"), records);
      await expect(page.locator(root)).toHaveAttribute("data-world2-state", "ready_to_continue");
      await observe(page, records, "normal-closed", info, true); await scanner(page, profile.locale, records);
    } catch (error) {
      await normal.page.screenshot({ path: info.outputPath("normal-failure-viewport.png"), scale: "css" }).catch(() => {});
      throw error;
    } finally {
      await normal.context.close();
      const path = info.outputPath("II-journal.json"); writeFileSync(path, JSON.stringify({ records, errors }, null, 2));
      await info.attach("OBS04-II-normal-evidence", { path, contentType: "application/json" });
    }

    const review = await fixture(browser, baseURL, profile, true);
    try {
      const page = review.page;
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      await page.goto("/final"); await expect(page.locator(".gvo-prepared-tree[data-journey-active='true'] main.final-root-shell")).toBeVisible();
      await click(page.locator("a[data-final-access-id='ii']"), records, "mirador-compound-link-center"); await ready(page);
      await initialTitle(page, records, "review-entry", info);
      const before = await facts(page); await observe(page, records, "review-closed-entry", info);
      for (const layer of ["planta_viva", "senal", "captura", "acondicionamiento", "mapeo", "resultado_mediado"]) {
        await click(page.locator(`.world2-layer-button[data-world2-layer='${layer}']`), records);
        await initialTitle(page, records, "review-selected-" + layer, info);
        if (layer === "planta_viva") await click(page.locator("[data-plant-contact-hotspot]"), records);
        if (layer === "senal") await click(page.locator("[data-world2-signal-reveal-control]"), records);
        if (layer === "captura") for (let step = 0; step < 3; step++) await click(page.locator(".world2-capture-timeline__step-control").nth(step), records);
        if (layer === "mapeo") for (let step = 1; step <= 3; step++) await click(page.locator(`[data-mapping-progress-step='${step}']`), records);
        await page.locator(root + " .world2-dialogue").scrollIntoViewIfNeeded();
        await observe(page, records, "review-" + layer, info, layer === "senal" || layer === "mapeo");
        if (profile.name === "es-short" && layer === "senal") {
          const poison = await page.addStyleTag({ content: ".final-review-mode-layout[data-final-review-active='true'][data-final-review-world='2']{height:100dvh!important;overflow:hidden!important;grid-template-rows:var(--gvo-final-review-clearance-top) minmax(0,1fr)!important}" });
          const red = await geometry(page); records.push({ kind: "isolated-negative-wrapper-rule", ...red });
          expect(red.texts.some((text) => text.permanentClips.length > 0)).toBe(true); await poison.evaluate((node) => node.remove());
        }
      }
      await click(page.locator(root + " .world2-reading-advance"), records);
      await expect(page.locator(root)).toHaveAttribute("data-world2-state", "ready_to_continue");
      await observe(page, records, "review-returned-to-closed", info); await scanner(page, profile.locale, records);
      expect(await facts(page)).toEqual(before);
      const dock = page.locator(".final-review-return-control"); await click(dock, records);
      await expect(page.locator(".gvo-prepared-tree[data-journey-active='true'] main.final-root-shell")).toBeVisible();
      expect(errors).toEqual([]);
      const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex"); expect(indexAfter).toBe(indexBefore);
      records.push({ kind: "completion", indexAfter, readOnlyFactsUnchanged: true, errors });
    } catch (error) {
      await review.page.screenshot({ path: info.outputPath("review-failure-viewport.png"), scale: "css" }).catch(() => {});
      throw error;
    } finally {
      await review.context.close();
      const path = info.outputPath("II-journal.json"); writeFileSync(path, JSON.stringify({ records, errors }, null, 2));
      await info.attach("OBS04-II-flow-evidence", { path, contentType: "application/json" });
    }
  });
}
