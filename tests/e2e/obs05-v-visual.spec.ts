import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import sharp from "sharp";
import { getWorld5Question, world5QuizCopy } from "../../src/screens/World5Root/world5QuizContent";
import type { World5RoundLedger } from "../../src/screens/World5Root/world5Quiz";

const fixturePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes = readFileSync(fixturePath);
const prior = JSON.parse(fixtureBytes.toString("utf8")).normalScans[3].after;
const sourcePaths = ["World5RootScreen.tsx", "World5QuizExperience.css", "world5QuizView.ts", "world5Quiz.ts", "station5Content.ts", "world5QuizContent.ts"].map((name) => `src/screens/World5Root/${name}`);
const sources = sourcePaths.map((path) => { const bytes = readFileSync(path); return { path, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") }; });
const active = ".gvo-prepared-tree[data-journey-active='true'] main.s5-quiz";
const areas = ["plantas", "sistema", "espacio", "visitante"] as const;
type Row = Record<string, unknown>;
type Profile = { name: string; group: "smoke" | "matrix"; locale: "es" | "en"; width: number; height: number; text200: boolean; motion: "reduce" | "no-preference"; score: 0 | 4 };
// All seven requested sizes in both locales, plus six enlarged-text cases.
// Motion and scores are distributed, rather than crossing every combination.
const profiles: Profile[] = [
  { name: "es390", group: "smoke", locale: "es", width: 390, height: 844, text200: false, motion: "no-preference", score: 4 },
  { name: "en390", group: "smoke", locale: "en", width: 390, height: 844, text200: false, motion: "reduce", score: 4 },
  { name: "en280", group: "smoke", locale: "en", width: 280, height: 653, text200: false, motion: "no-preference", score: 4 },
  { name: "es390-text200", group: "smoke", locale: "es", width: 390, height: 844, text200: true, motion: "reduce", score: 4 },
  { name: "es568-short", group: "smoke", locale: "es", width: 568, height: 280, text200: false, motion: "no-preference", score: 4 },
  ...([280, 320, 428, 568, 844, 1024] as const).flatMap((width) => (["es", "en"] as const).flatMap((locale): Profile[] => {
    if ((width === 280 && locale === "en") || (width === 568 && locale === "es")) return [];
    return [{ name: `${locale}${width}`, group: "matrix", locale, width, height: { 280: 653, 320: 568, 428: 926, 568: 280, 844: 390, 1024: 768 }[width], text200: false, motion: locale === "es" ? "no-preference" : "reduce", score: width === 568 ? 0 : 4 }];
  })),
  { name: "en390-text200", group: "matrix", locale: "en", width: 390, height: 844, text200: true, motion: "no-preference", score: 4 },
  ...([280, 568] as const).flatMap((width) => (["es", "en"] as const).map((locale): Profile => ({ name: `${locale}${width}-text200`, group: "matrix", locale, width, height: width === 280 ? 653 : 280, text200: true, motion: locale === "es" ? "no-preference" : "reduce", score: 4 }))),
];

async function controlGeometry(control: Locator) {
  await control.scrollIntoViewIfNeeded();
  return control.evaluate((element) => {
    const r = element.getBoundingClientRect();
    const visible = { left: Math.max(0, r.left), top: Math.max(0, r.top), right: Math.min(innerWidth, r.right), bottom: Math.min(innerHeight, r.bottom) };
    const points = [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]].map(([a, b]) => {
      const x = visible.left + (visible.right - visible.left) * a, y = visible.top + (visible.bottom - visible.top) * b, hit = document.elementFromPoint(x, y);
      return { x, y, hit: { tag: hit?.tagName, class: hit?.className }, matches: !!hit && (hit === element || element.contains(hit)) };
    });
    return { name: element.getAttribute("aria-label") ?? element.textContent, rect: r.toJSON(), visible, points };
  });
}
async function tap(control: Locator, rows: Row[], perform = true) {
  await expect(control).toBeEnabled();
  const geometry = await controlGeometry(control); rows.push({ phase: "native-control-hit", ...geometry });
  expect(geometry.rect.width).toBeGreaterThanOrEqual(44); expect(geometry.rect.height).toBeGreaterThanOrEqual(44);
  expect(geometry.visible.right - geometry.visible.left).toBeGreaterThanOrEqual(44);
  expect(geometry.visible.bottom - geometry.visible.top).toBeGreaterThanOrEqual(44);
  // On a document-flow target taller than a short viewport, the five samples
  // explicitly concern its visible intersection, not its offscreen corners.
  expect(geometry.points.every((point) => point.matches), String(geometry.name)).toBe(true);
  if (perform) await control.tap();
}
async function measure(page: Page, phase: string) {
  return page.locator(active).evaluate((main, phase) => {
    const rect = (node: Element) => node.getBoundingClientRect().toJSON();
    const intersection = (a: DOMRect | DOMRectReadOnly, b: DOMRect | DOMRectReadOnly) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const dock = document.querySelector(".gvo-immersive-shell__control")!.getBoundingClientRect();
    const texts = Array.from(main.querySelectorAll(".s5-quiz-nav-title,.s5-question-prompt h2,.s5-question-prompt p,.s5-question-response p,.s5-quiz-option > span"))
      .filter((node) => getComputedStyle(node).clipPath === "none").map((node) => {
      const range = document.createRange(); range.selectNodeContents(node);
      const fragments = Array.from(range.getClientRects()).map((r) => r.toJSON());
      const clips: Row[] = [];
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent), bounds = parent.getBoundingClientRect();
        for (const r of fragments) {
          const dx = Math.max(0, bounds.left - r.left, r.right - bounds.right), dy = Math.max(0, bounds.top - r.top, r.bottom - bounds.bottom);
          if ((/^(hidden|clip)$/.test(style.overflowX) && dx > 2) || (/^(hidden|clip)$/.test(style.overflowY) && dy > 2)) clips.push({ class: parent.className, rect: bounds.toJSON(), overflowX: style.overflowX, overflowY: style.overflowY, dx, dy });
        }
      }
      const glyphs: { text: string; rect: ReturnType<DOMRect["toJSON"]>; dockOverlap: number }[] = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = walker.nextNode())) for (let i = 0; i < textNode.textContent!.length; i++) {
        if (!textNode.textContent![i].trim()) continue;
        const glyph = document.createRange(); glyph.setStart(textNode, i); glyph.setEnd(textNode, i + 1);
        for (const bounds of glyph.getClientRects()) glyphs.push({ text: textNode.textContent![i], rect: bounds.toJSON(), dockOverlap: intersection(bounds, dock) });
      }
      return { text: node.textContent, fragments, clips, glyphs };
    });
    const lia = main.querySelector(".s5-quiz-lia")!, liaRect = lia.getBoundingClientRect();
    const answers = Array.from(main.querySelectorAll("[data-answer]")).map((option) => {
      const label = option.querySelector("span")!.getBoundingClientRect();
      return { rect: rect(option), label: label.toJSON(), labelOverLia: intersection(label, liaRect), disabled: (option as HTMLButtonElement).disabled };
    });
    const prompt = main.querySelector(".s5-question-prompt")!, options = main.querySelector(".s5-quiz-options"), response = main.querySelector(".s5-question-response")!;
    const backdrop = main.querySelector(".s5-quiz-backdrop")!, panel = main.querySelector(".s5-gallery-journey")!;
    return { phase, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scrollY, documentWidth: document.documentElement.scrollWidth, dock: dock.toJSON(), texts, answers,
      gallery: main.querySelector(".s5-quiz-gallery")?.getAttribute("src"), sharedSurfaces: main.querySelectorAll(".s5-gallery-journey").length,
      galleryPosition: getComputedStyle(backdrop).position, galleryRect: rect(backdrop),
      assembly: rect(panel), blockClearance: parseFloat(getComputedStyle(panel).marginTop),
      plaques: { marquee: rect(main.querySelector(".s5-gallery-marquee")!), prompt: rect(prompt), response: rect(response) },
      environmentImages: main.querySelectorAll("img[src*='_environment_']").length,
      unifiedPanel: panel.contains(prompt) && (!options || panel.contains(options)) && panel.contains(response),
      questionHeight: response.getBoundingClientRect().bottom - prompt.getBoundingClientRect().top,
      promptFrame: { borderImageSource: getComputedStyle(prompt).borderImageSource, background: getComputedStyle(prompt).backgroundColor },
      optionsLayout: options ? { position: getComputedStyle(options).position, columns: getComputedStyle(options).gridTemplateColumns } : null,
      lia: { rect: liaRect.toJSON(), action: lia.getAttribute("data-lia-action"), petals: lia.querySelectorAll("[data-lia-rig-layer^='petal-']").length, body: lia.querySelectorAll("[data-lia-rig-layer='body']").length, rigs: main.querySelectorAll(".gvo-lia-journey").length, pointerEvents: getComputedStyle(lia).pointerEvents },
      actualDomOrder: !!options && !!(prompt.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(options.compareDocumentPosition(response) & Node.DOCUMENT_POSITION_FOLLOWING),
      focus: { class: document.activeElement?.className, tag: document.activeElement?.tagName },
    };
  }, phase);
}
function assertGeometry(row: Awaited<ReturnType<typeof measure>>, profile: Profile, question = true) {
  expect(row.documentWidth).toBeLessThanOrEqual(profile.width);
  expect(row.sharedSurfaces).toBe(1);
  expect(row.unifiedPanel).toBe(true);
  expect(row.galleryPosition).toBe("sticky");
  expect(row.environmentImages).toBe(1);
  expect(row.gallery).toMatch(/world5_sub_system_environment_(portrait|landscape)_v03\.webp$/);
  expect(Math.abs(row.assembly.x + row.assembly.width / 2 - row.viewport.width / 2)).toBeLessThanOrEqual(2);
  if (row.assembly.height + 2 * row.blockClearance <= row.viewport.height) {
    expect(Math.abs(row.assembly.y + row.assembly.height / 2 - row.viewport.height / 2)).toBeLessThanOrEqual(3);
  }
  expect(row.promptFrame.borderImageSource).toBe("none");
  expect(row.lia.petals).toBe(5); expect(row.lia.body).toBe(1); expect(row.lia.rigs).toBe(1); expect(row.lia.pointerEvents).toBe("none");
  for (const text of row.texts) {
    expect(text.clips, String(text.text)).toEqual([]);
    expect(text.glyphs.filter((glyph) => glyph.dockOverlap > .25), `${row.phase}: ${text.text}`).toEqual([]);
  }
  if (question) {
    expect(row.actualDomOrder).toBe(true); expect(row.answers).toHaveLength(2);
    if (profile.width === 390 && !profile.text200) expect(row.questionHeight).toBeLessThan(profile.height - 72);
    for (const answer of row.answers) { expect(answer.rect.width).toBeGreaterThanOrEqual(96); expect(answer.rect.height).toBeGreaterThanOrEqual(96); expect(answer.labelOverLia).toBe(0); }
    if (profile.width <= 340 || profile.text200) expect(row.optionsLayout!.position).toBe("relative");
  }
}

// Actual native-viewport painted footprint. The pair pauses/restores existing
// animations and hides only the guide for one QA PNG; no app facts are changed.
// This is an explicit image-difference intervention, not a native-user claim.
async function paintedGuide(page: Page, outputPath: (name: string) => string) {
  const actor = page.locator(`${active} .s5-quiz-lia`);
  await actor.scrollIntoViewIfNeeded();
  const animationState = await page.evaluate(() => {
    const animations = document.getAnimations();
    (window as unknown as { __obs05Paused: Animation[] }).__obs05Paused = animations.filter((animation) => animation.playState === "running");
    const data = animations.map((animation) => ({ currentTime: animation.currentTime, playState: animation.playState }));
    for (const animation of animations) animation.pause();
    return data;
  });
  const metadata = await actor.evaluate((node) => ({ rect: node.getBoundingClientRect().toJSON(), scrollY, visibility: (node as HTMLElement).style.visibility }));
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const offsets = [...new Set([Math.min(maxScroll, Math.max(0, metadata.rect.top + metadata.scrollY - 12)), Math.min(maxScroll, Math.max(0, metadata.rect.bottom + metadata.scrollY - profileSafeHeight(page)))])];
  // Each tile is still the selected viewport, even when the hero is taller.
  const tiles: Row[] = [];
  let union: { left: number; top: number; right: number; bottom: number } | null = null;
  try {
    for (const [index, offset] of offsets.entries()) {
      await page.evaluate((offset) => scrollTo(0, offset), offset);
      const position = await actor.evaluate((node) => ({ rect: node.getBoundingClientRect().toJSON(), scrollY }));
      const visiblePath = outputPath(`V-result-guide-visible-tile${index + 1}.png`), hiddenPath = outputPath(`V-result-guide-hidden-QA-tile${index + 1}.png`);
      await page.screenshot({ path: visiblePath, scale: "css" });
      await actor.evaluate((node) => { (node as HTMLElement).style.visibility = "hidden"; });
      await page.screenshot({ path: hiddenPath, scale: "css" });
      await actor.evaluate((node, visibility) => { (node as HTMLElement).style.visibility = visibility; }, metadata.visibility);
      const visible = await sharp(visiblePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const hidden = await sharp(hiddenPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      expect(hidden.info).toEqual(visible.info);
      let left = visible.info.width, top = visible.info.height, right = -1, bottom = -1, pixels = 0;
      for (let y = 0; y < visible.info.height; y++) for (let x = 0; x < visible.info.width; x++) {
        const i = (y * visible.info.width + x) * 4;
        const delta = Math.max(...[0, 1, 2].map((channel) => Math.abs(visible.data[i + channel] - hidden.data[i + channel])));
        if (delta <= 8) continue;
        left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); pixels++;
      }
      const bounds = right < 0 ? null : { left, top: top + position.scrollY, right: right + 1, bottom: bottom + 1 + position.scrollY };
      if (bounds) union = union ? { left: Math.min(union.left, bounds.left), top: Math.min(union.top, bounds.top), right: Math.max(union.right, bounds.right), bottom: Math.max(union.bottom, bounds.bottom) } : bounds;
      tiles.push({ position, visible: { path: visiblePath, sha256: createHash("sha256").update(readFileSync(visiblePath)).digest("hex") }, hidden: { path: hiddenPath, sha256: createHash("sha256").update(readFileSync(hiddenPath)).digest("hex") }, dimensions: visible.info, pixelsWithRgbDifferenceOver8: pixels, documentPaintBounds: bounds });
    }
  } finally {
    await actor.evaluate((node, visibility) => { (node as HTMLElement).style.visibility = visibility; }, metadata.visibility);
    await page.evaluate(() => { for (const animation of (window as unknown as { __obs05Paused: Animation[] }).__obs05Paused) animation.play(); delete (window as unknown as { __obs05Paused?: Animation[] }).__obs05Paused; });
  }
  return { method: "Native viewport visible/QA-hidden PNG difference; existing animations paused identically and restored; RGB max-channel difference >8. Bounding box includes guide glow, not an inferred container or claimed exact source alpha.", animationState, tiles, union, width: union ? union.right - union.left : 0, height: union ? union.bottom - union.top : 0, oldWholeCanvasUpperBound: { width: 80.515625, height: 143.0625, source: "OBS05 baseline build06 result measured container, not a measured old opaque footprint" } };
}
function profileSafeHeight(page: Page) { return (page.viewportSize()?.height ?? 844) - 12; }

for (const profile of profiles) test(`OBS05 V visual ${profile.group} ${profile.name}`, async ({ browser, baseURL, request }, info) => {
  if (!baseURL) throw Error("Explicit root-approved compiled loopback candidate required");
  const context = await browser.newContext({ baseURL, viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: "block", reducedMotion: profile.motion });
  await context.addInitScript(({ state, profile }) => {
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", profile.locale);
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
    if (profile.text200) {
      const apply = () => { document.documentElement.style.fontSize = "200%"; };
      if (document.documentElement) apply(); else new MutationObserver((_, observer) => { if (document.documentElement) { apply(); observer.disconnect(); } }).observe(document, { childList: true, subtree: true });
    }
  }, { state: prior, profile });
  const page = await context.newPage(), rows: Row[] = [], errors: string[] = [];
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  expect(indexBefore).toBe(process.env.GVO_OBS05_EXPECTED_INDEX_SHA256);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const save = () => writeFileSync(info.outputPath("OBS05-V-visual-journal.json"), JSON.stringify({ profile, indexBefore, sources, fixture: { path: fixturePath, sha256: createHash("sha256").update(fixtureBytes).digest("hex"), selection: "normalScans[3].after" }, qualification: "Declared prior access to I-IV only in an isolated context. No seeded quiz/rounds, real DOM native Chromium emulated touch/focus/wheel, four current-round outcomes and explicit Next. CSS root200 is not native zoom; no physical-device, subjective-reading or human approval claim. Result paint-pair intervention separately qualified.", rows, errors }, null, 2));
  const sample = async (phase: string, question = true, screenshot = true) => {
    const row = await measure(page, phase); rows.push(row); save();
    if (screenshot) await page.screenshot({ path: info.outputPath(`${phase}-viewport.png`), scale: "css" });
    assertGeometry(row, profile, question); return row;
  };
  try {
    await page.goto("/estacion/5"); await expect(page.locator(active)).toBeVisible(); await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0); await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => localStorage.getItem("gvo.station5.quiz.v2"))).toBeNull();
    for (const [index, area] of areas.entries()) {
      const source = getWorld5Question(area, profile.locale);
      await expect(page.locator(active)).toHaveAttribute("data-station5-area", area);
      await expect(page.locator(".s5-quiz-question")).toHaveText(source.question);
      await expect(page.locator(".s5-quiz-question")).toHaveAttribute("data-source-id", source.sourceId);
      await expect(page.getByRole("group", { name: source.question })).toHaveAccessibleDescription(source.instruction);
      await page.locator(".s5-question-prompt h2").focus(); await sample(`${area}-prompt-focus`);
      const option = page.locator(`[data-answer='${profile.score === 4 ? "agreement" : "disagreement"}']`);
      await option.focus(); await sample(`${area}-option-focus`, true, false); await tap(option, rows);
      await expect(page.locator("[data-answer='agreement']")).toBeDisabled(); await expect(page.locator("[data-answer='disagreement']")).toBeDisabled();
      await expect(page.locator(".s5-quiz-feedback")).toBeFocused(); await sample(`${area}-feedback`);
      const questionText = page.locator(".s5-quiz-question");
      const scroll = await questionText.evaluate((node) => {
        const top = node.getBoundingClientRect().top, requested = scrollY + top - 18;
        const target = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, requested));
        return { requested, target, delta: target - scrollY, expectedTop: scrollY + top - target };
      });
      rows.push({ phase: `${area}-ordinary-scroll-target`, ...scroll });
      await page.mouse.move(profile.width / 2, profile.height / 2); await page.mouse.wheel(0, scroll.delta);
      await expect.poll(async () => Math.abs((await questionText.boundingBox())!.y - scroll.expectedTop)).toBeLessThan(3);
      await sample(`${area}-ordinary-scroll`, true, false);
      const ledger = await page.evaluate(() => JSON.parse(localStorage.getItem("gvo.station5.quiz.v2")!) as World5RoundLedger);
      expect(ledger.rounds).toHaveLength(1); expect(Object.keys(ledger.rounds[0].outcomes)).toEqual(areas.slice(0, index + 1));
      expect(ledger.rounds[0].outcomes[area]?.kind).toBe(profile.score === 4 ? "correct" : "incorrect");
      await tap(page.locator(".s5-quiz-advance"), rows);
    }
    await expect(page.locator(active)).toHaveAttribute("data-station5-state", "result");
    await expect(page.locator(".s5-quiz-result")).toHaveText(world5QuizCopy[profile.locale].outcome(profile.score));
    await expect(page.locator(active)).toHaveAttribute("data-prize-eligible", String(profile.score === 4));
    expect(await page.getByText(world5QuizCopy[profile.locale].prize, { exact: true }).count()).toBe(profile.score === 4 ? 1 : 0);
    await expect(page.locator(".s5-quiz-lia")).toHaveAttribute("data-lia-action", profile.score === 4 ? "respond" : "attention");
    expect(await page.locator(".s5-quiz-scene--result .s5-quiz-environment").count()).toBe(0);
    await page.locator(".s5-quiz-lia").scrollIntoViewIfNeeded(); await sample("result-hero", false);
    const paint = await paintedGuide(page, (name) => info.outputPath(name)); rows.push({ phase: "result-actual-painted-footprint", paint }); save();
    // Exceeding the whole former canvas is a conservative comparison: this
    // does not invent an old opaque-pixel measurement.
    expect(paint.width).toBeGreaterThan(paint.oldWholeCanvasUpperBound.width); expect(paint.height).toBeGreaterThan(paint.oldWholeCanvasUpperBound.height);
    await tap(page.getByRole("button", { name: world5QuizCopy[profile.locale].close, exact: true }), rows, false);
    await sample("result-manual-close-ready", false);
    const final = await page.evaluate(() => ({ essential: JSON.parse(localStorage.getItem("gvo.journey.essential.v1")!), progress: JSON.parse(localStorage.getItem("gvo.progress.v1")!), v1Raw: localStorage.getItem("gvo.station5.quiz.v1"), ledger: JSON.parse(localStorage.getItem("gvo.station5.quiz.v2")!) as World5RoundLedger }));
    expect(final.progress.completedStations).toEqual([1, 2, 3, 4]); expect(final.essential.stations[5].closed).toBe(false); expect(final.ledger.rounds[0].status).toBe("complete"); expect(final.v1Raw).toBeNull();
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex"); expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
    rows.push({ phase: "round-complete-awaiting-manual-close", final, indexAfter });
  } catch (error) { await page.screenshot({ path: info.outputPath("V-failure-viewport.png"), scale: "css" }).catch(() => {}); throw error; }
  finally { save(); await info.attach("OBS05-V-visual-evidence", { path: info.outputPath("OBS05-V-visual-journal.json"), contentType: "application/json" }); await context.close(); }
});
