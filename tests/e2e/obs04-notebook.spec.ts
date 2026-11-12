import { writeFileSync } from "node:fs";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { getStation3Content } from "../../src/screens/World3Root/station3Content";

type Locale = "es" | "en";
type Cut = { name: string; width: number; height: number; text200?: boolean };
const cuts: Cut[] = [
  { name: "portrait390", width: 390, height: 844 },
  { name: "portrait428", width: 428, height: 926 },
  { name: "narrow280", width: 280, height: 653 },
  { name: "narrow320", width: 320, height: 568 },
  { name: "shortLandscape", width: 568, height: 280 },
  { name: "text200", width: 390, height: 844, text200: true },
];
const essentialKey = "gvo.journey.essential.v1";
const progressKey = "gvo.progress.v1";
const rootSelector = ".gvo-prepared-tree[data-journey-active='true'] main.s3-practice-screen";
const stepIds = ["INTRO", "PASO A PASO", "BENEFICIOS"];
const clipDurations = { planta: 650, prototipo: 1100, senal: 850 };
type Journal = { stop: () => void; frames: Array<Record<string, unknown>> };
type FirstPaint = {
  at: number;
  sourceId: string;
  scrollTop: number;
  scrollLeft: number;
  documentScrollY: number;
  qualification: string;
  targets: Array<{ tag: string; text: string | null; opacity: number; visible: boolean; lines: Array<{ rect: { left: number; right: number; top: number; bottom: number; width: number; height: number }; fits: boolean }>; clip: { left: number; top: number; right: number; bottom: number }; clipChain: Array<Record<string, unknown>> }>;
};
declare global { interface Window { __obs04NotebookMotion?: Journal; __obs04NotebookFirstPaint?: { records: Record<string, FirstPaint>; stop: () => void }; } }

/** A fresh Playwright context receives only declared prior access. These two
 * acquired bits and closed prior rooms are fixture data, never visitor evidence.
 * III itself starts empty and is traversed with actual controls. */
async function fixture(page: Page, locale: Locale) {
  await page.addInitScript((language) => {
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof order, closed = false) => ({ contentRevision: "OBS03.2", presentedStepIds: closed ? [...order[id]] : [], confirmedStepIds: closed ? [...order[id]] : [], assistedPresentedStepIds: [], activeStepId: closed ? null : order[id][0], interactionEvidence: [], outcome: null, closed });
    localStorage.setItem("gvo.language.v1", language);
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2], updatedAt: "2026-10-24T12:00:00.000Z" }));
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", true), stations: { 1: room(1, true), 2: room(2, true), 3: room(3), 4: room(4), 5: room(5) }, legacyRouteCredit: 2, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
  }, locale);
}

async function settle(page: Page) {
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
}
async function stable(root: Locator) {
  await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0);
  await expect(root.locator(".s3-practice-paper")).toHaveAttribute("aria-busy", "false");
  await settle(root.page());
}
async function facts(page: Page) {
  return page.evaluate(({ essentialKey, progressKey }) => ({ essential: JSON.parse(localStorage.getItem(essentialKey) ?? "null"), progressRaw: localStorage.getItem(progressKey), legacy: ["gvo.station3.v1", "gvo.station3.practice.v2"].map((key) => ({ key, raw: localStorage.getItem(key) })) }), { essentialKey, progressKey });
}

/** Range fragments approximate DOM glyph/line geometry, not raster ink. Only
 * real overflow:auto/scroll ancestors and the outer document may be scrolled.
 * No overflow, size, position, font or visibility CSS is injected here. */
async function readingGeometry(paragraph: Locator) {
  return paragraph.evaluate(async (element) => {
    const describe = (r: DOMRect) => ({ x: r.x, y: r.y, width: r.width, height: r.height, left: r.left, top: r.top, right: r.right, bottom: r.bottom });
    const lines: Array<Record<string, unknown>> = [];
    const chain = [];
    for (let current = element.parentElement; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      chain.push({ tag: current.tagName, class: current.className, overflowX: style.overflowX, overflowY: style.overflowY, clientWidth: current.clientWidth, clientHeight: current.clientHeight, scrollWidth: current.scrollWidth, scrollHeight: current.scrollHeight, rect: describe(current.getBoundingClientRect()) });
    }
    const range = document.createRange(); range.selectNodeContents(element);
    const initial = Array.from(range.getClientRects()).map(describe);
    for (let index = 0; index < initial.length; index++) {
      for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const r = range.getClientRects()[index]; if (!r) continue;
        const style = getComputedStyle(ancestor), box = ancestor.getBoundingClientRect();
        const sx = box.width / (ancestor.offsetWidth || box.width || 1), sy = box.height / (ancestor.offsetHeight || box.height || 1);
        if (/^(auto|scroll)$/.test(style.overflowY) && ancestor.scrollHeight > ancestor.clientHeight + 1) ancestor.scrollTop += ((r.top + r.bottom) / 2 - (box.top + (ancestor.clientTop + ancestor.clientHeight / 2) * sy)) / sy;
        if (/^(auto|scroll)$/.test(style.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) ancestor.scrollLeft += ((r.left + r.right) / 2 - (box.left + (ancestor.clientLeft + ancestor.clientWidth / 2) * sx)) / sx;
      }
      const before = range.getClientRects()[index];
      if (before && document.documentElement.scrollHeight > innerHeight + 1) window.scrollBy(0, (before.top + before.bottom) / 2 - innerHeight / 2);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const r = range.getClientRects()[index]; if (!r || r.width < 0.1 || r.height < 0.1) continue;
      const clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
      const clipChain = [];
      for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const s = getComputedStyle(ancestor), box = ancestor.getBoundingClientRect();
        const sx = box.width / (ancestor.offsetWidth || box.width || 1), sy = box.height / (ancestor.offsetHeight || box.height || 1);
        if (s.overflowX !== "visible") { clip.left = Math.max(clip.left, box.left + ancestor.clientLeft * sx); clip.right = Math.min(clip.right, box.left + (ancestor.clientLeft + ancestor.clientWidth) * sx); }
        if (s.overflowY !== "visible") { clip.top = Math.max(clip.top, box.top + ancestor.clientTop * sy); clip.bottom = Math.min(clip.bottom, box.top + (ancestor.clientTop + ancestor.clientHeight) * sy); }
        if (s.overflowX !== "visible" || s.overflowY !== "visible") clipChain.push({ class: ancestor.className, overflowX: s.overflowX, overflowY: s.overflowY, rect: describe(box) });
      }
      lines.push({ index, rect: describe(r), clip, clipChain, reachable: r.left >= clip.left - 1 && r.right <= clip.right + 1 && r.top >= clip.top - 1 && r.bottom <= clip.bottom + 1 });
    }
    const scroll = element.closest<HTMLElement>(".s3-practice-scroll")!;
    return { text: element.textContent, font: { size: getComputedStyle(element).fontSize, lineHeight: getComputedStyle(element).lineHeight, family: getComputedStyle(element).fontFamily }, initial, lines, chain, paperOverflow: scroll.scrollHeight > scroll.clientHeight + 2, horizontalOverflow: scroll.scrollWidth > scroll.clientWidth + 2, readingViewport: { width: scroll.clientWidth, height: scroll.clientHeight, scrollHeight: scroll.scrollHeight }, document: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight } };
  });
}

async function controlGeometry(control: Locator) {
  await control.scrollIntoViewIfNeeded();
  return control.evaluate((element) => {
    const r = element.getBoundingClientRect(), points = [[r.left + r.width / 4, r.top + r.height / 4], [r.right - r.width / 4, r.bottom - r.height / 4], [r.left + r.width / 2, r.top + r.height / 2]];
    return { name: element.getAttribute("aria-label") ?? element.textContent, rect: r.toJSON(), target48: r.width >= 48 && r.height >= 48, viewport: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1, points: points.map(([x, y]) => { const hit = document.elementFromPoint(x, y); return { x, y, matches: !!hit && (element === hit || element.contains(hit)), hit: hit?.tagName, class: hit?.getAttribute("class") }; }) };
  });
}
async function click(control: Locator, records: Array<Record<string, unknown>>) {
  await expect(control).toBeEnabled();
  const measured = await controlGeometry(control); records.push({ kind: "control-before-native-click", ...measured });
  expect(measured.target48, `48px target: ${measured.name}`).toBe(true);
  expect(measured.viewport, `reachable control: ${measured.name}`).toBe(true);
  expect(measured.points.every((p) => p.matches), `unobstructed control: ${measured.name}`).toBe(true);
  await control.click();
}
async function geometry(root: Locator) {
  return root.evaluate((node) => {
    const paper = node.querySelector<HTMLElement>(".s3-practice-paper")!, notebook = node.querySelector<HTMLElement>(".s3-practice-notebook")!, base = node.querySelector<HTMLImageElement>(".s3-practice-base")!, nav = node.querySelector<HTMLElement>(".s3-practice-paper-actions")!;
    const p = paper.getBoundingClientRect(), b = notebook.getBoundingClientRect(), a = nav.getBoundingClientRect(), image = base.getBoundingClientRect();
    const intersection = (r: DOMRect, q: DOMRect) => Math.max(0, Math.min(r.right, q.right) - Math.max(r.left, q.left)) * Math.max(0, Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top));
    const actor = node.querySelector<HTMLElement>(".s3-lia-clip")!, actorRect = actor.getBoundingClientRect();
    let effectiveOpacity = 1;
    for (let ancestor: Element | null = actor; ancestor; ancestor = ancestor.parentElement) effectiveOpacity *= Number(getComputedStyle(ancestor).opacity);
    const title = node.querySelector(".s3-title h1")!, titleRange = document.createRange(); titleRange.selectNodeContents(title);
    const fullscreen = document.querySelector('[data-gvo-immersive-control="fullscreen"]')?.getBoundingClientRect();
    return { paper: p.toJSON(), notebook: b.toJSON(), actions: a.toJSON(), navWithinPaper: paper.contains(nav), navPaperIntersection: intersection(p, a), actor: { rect: actorRect.toJSON(), effectiveOpacity, viewportVisible: actorRect.left >= -1 && actorRect.top >= -1 && actorRect.right <= innerWidth + 1 && actorRect.bottom <= innerHeight + 1 && effectiveOpacity > 0 }, titleFragments: Array.from(titleRange.getClientRects()).map((r) => ({ rect: r.toJSON(), fullscreenIntersection: fullscreen ? intersection(r, fullscreen) : 0 })), original: { src: base.currentSrc, naturalWidth: base.naturalWidth, naturalHeight: base.naturalHeight, renderedRatio: image.width / image.height, originalRatio: base.naturalWidth / base.naturalHeight }, registration: { left: (p.left - b.left) / b.width, top: (p.top - b.top) / b.height, width: p.width / b.width, height: p.height / b.height }, index: Array.from(node.querySelectorAll<HTMLElement>(".s3-practice-index li")).map((li, index) => { const number = li.querySelector<HTMLElement>(".s3-practice-number")!, nr = number.getBoundingClientRect(), r = li.getBoundingClientRect(), pseudo = getComputedStyle(li, "::before"); return { number: number.textContent, state: li.querySelector("button")?.getAttribute("data-record-state"), current: li.querySelector("button")?.getAttribute("aria-current"), numberRect: nr.toJSON(), separator: index === 0 ? null : { x: r.left + parseFloat(pseudo.left), borderWidth: pseudo.borderTopWidth }, numberWhiteSpace: getComputedStyle(number).whiteSpace }; }) };
  });
}
/** Passive first eligible rAF after the authentic turn. Capture every h2/h3/p
 * before any test reading/scroll probe. scrollHeight is not a text-ink test:
 * padding or a line box may extend while every actual Range fragment fits. */
async function observeFirstPaint(page: Page) {
  await page.evaluate(() => {
    const records: Record<string, FirstPaint> = {}; let running = true, raf = 0;
    const tick = () => {
      const root = document.querySelector<HTMLElement>('main.s3-practice-screen[data-journey-active="true"]');
      const article = root?.querySelector<HTMLElement>("[data-station3-folio-source]");
      const sourceId = article?.dataset.station3FolioSource;
      if (root && article && sourceId && !records[sourceId] && !root.querySelector("[data-station3-page-turn]") && root.querySelector(".s3-practice-paper")?.getAttribute("aria-busy") === "false" && root.dataset.criticalAssetsReady === "true") {
        const viewport = root.querySelector<HTMLElement>(".s3-practice-scroll")!;
        const targets = Array.from(article.querySelectorAll<HTMLElement>("h2,h3,p")).map((element) => {
          const clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
          const clipChain = []; let opacity = 1, visible = true;
          for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
            const style = getComputedStyle(ancestor), r = ancestor.getBoundingClientRect();
            opacity *= Number(style.opacity); visible &&= style.visibility === "visible" && style.display !== "none";
            const sx = r.width / (ancestor.offsetWidth || r.width || 1), sy = r.height / (ancestor.offsetHeight || r.height || 1);
            if (style.overflowX !== "visible") { clip.left = Math.max(clip.left, r.left + ancestor.clientLeft * sx); clip.right = Math.min(clip.right, r.left + (ancestor.clientLeft + ancestor.clientWidth) * sx); }
            if (style.overflowY !== "visible") { clip.top = Math.max(clip.top, r.top + ancestor.clientTop * sy); clip.bottom = Math.min(clip.bottom, r.top + (ancestor.clientTop + ancestor.clientHeight) * sy); }
            if (style.overflowX !== "visible" || style.overflowY !== "visible") clipChain.push({ class: ancestor.className, overflowX: style.overflowX, overflowY: style.overflowY, rect: r.toJSON() });
          }
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), lines = [];
          while (walker.nextNode()) {
            if (!walker.currentNode.textContent?.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(walker.currentNode);
            for (const r of range.getClientRects()) if (r.width > 0.1 && r.height > 0.1) lines.push({ rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }, fits: r.left >= clip.left - 1 && r.right <= clip.right + 1 && r.top >= clip.top - 1 && r.bottom <= clip.bottom + 1 });
          }
          return { tag: element.tagName, text: element.textContent, opacity, visible, lines, clip, clipChain };
        });
        records[sourceId] = { at: performance.now(), sourceId, scrollTop: viewport.scrollTop, scrollLeft: viewport.scrollLeft, documentScrollY: scrollY, qualification: "FIRST_ELIGIBLE_POST_TURN_RAF_READONLY_BEFORE_TEST_SCROLL; DOM Range fragments, not raster ink or native zoom certification", targets };
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    window.__obs04NotebookFirstPaint = { records, stop: () => { running = false; cancelAnimationFrame(raf); } }; raf = requestAnimationFrame(tick);
  });
}
async function startMotionJournal(page: Page) {
  await page.evaluate(() => {
    window.__obs04NotebookMotion?.stop();
    const frames: Array<Record<string, unknown>> = [], identities = new WeakMap<Element, number>(); let serial = 0, running = true, raf = 0;
    const tick = () => {
      const root = document.querySelector("main.s3-practice-screen"), lia = root?.querySelector<HTMLElement>(".s3-lia-clip"), frame = lia?.querySelector<HTMLElement>(".s3-lia-clip__frame"), motif = root?.querySelector<HTMLElement>(".s3-practice-motif-response");
      if (frame && !identities.has(frame)) identities.set(frame, ++serial);
      const style = frame ? getComputedStyle(frame) : null;
      const r = lia?.getBoundingClientRect();
      frames.push({ at: performance.now(), turn: !!root?.querySelector("[data-station3-page-turn]"), target: lia?.dataset.liaTarget, enabled: lia?.dataset.liaMotionEnabled, mode: lia?.dataset.liaClipMode, action: lia?.dataset.liaAction, instance: frame ? identities.get(frame) : null, source: frame?.dataset.runtimeAsset, rect: r?.toJSON(), viewportVisible: !!r && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1, backgroundPosition: style?.backgroundPosition, animationName: style?.animationName, animationDuration: style?.animationDuration, animationState: frame?.getAnimations().map((a) => a.playState), motifAnimation: motif ? getComputedStyle(motif).animationName : null });
      if (running) raf = requestAnimationFrame(tick);
    };
    window.__obs04NotebookMotion = { frames, stop: () => { running = false; cancelAnimationFrame(raf); } }; raf = requestAnimationFrame(tick);
  });
}
async function finishMotion(page: Page, id: string, duration: number) {
  const frame = page.locator(`[data-lia-target="${id}"] .s3-lia-clip__frame`);
  await expect.poll(() => frame.evaluate((node) => node.getAnimations().some((a) => a.playState === "finished"))).toBe(true);
  const data = await page.evaluate(() => { window.__obs04NotebookMotion!.stop(); return window.__obs04NotebookMotion!.frames; });
  const target = data.filter((sample) => sample.target === id);
  expect(target.some((sample) => sample.turn && sample.mode === "stable" && sample.enabled === "false")).toBe(true);
  const playing = target.filter((sample) => sample.mode === "play");
  expect(playing.length).toBeGreaterThan(2);
  expect(playing.every((sample) => !sample.turn)).toBe(true);
  expect(playing.every((sample) => sample.viewportVisible)).toBe(true);
  expect(new Set(playing.map((sample) => sample.backgroundPosition)).size).toBeGreaterThanOrEqual(3);
  expect(playing.every((sample) => sample.animationDuration === `${duration / 1000}s`)).toBe(true);
  expect(new Set(playing.map((sample) => sample.instance)).size).toBe(1);
  expect(playing.every((sample) => typeof sample.source === "string" && /lia_world3_(intro|listening|accompanying)_6f_v03\.webp$/.test(sample.source))).toBe(true);
  return data;
}

for (const cut of cuts) for (const locale of ["es", "en"] as const) {
  test(`OBS04 III · ${cut.name} · ${locale} · seven literal leaves and scene controls`, async ({ page }, info: TestInfo) => {
    await page.setViewportSize({ width: cut.width, height: cut.height });
    await fixture(page, locale);
    const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    const evidence: Record<string, unknown> = { declaration: "SYNTHETIC_PRIOR_ACCESS_ONLY_NOT_A_FULL_EARNED_JOURNEY", locale, viewport: cut, textAmplification: cut.text200 ? "CSS html font-size200% text/reflow probe; NOT native browser zoom" : "normal runtime typography", controls: [], leaves: [], motion: [], pageErrors: errors };
    const controls = evidence.controls as Array<Record<string, unknown>>, leaves = evidence.leaves as Array<Record<string, unknown>>, motion = evidence.motion as unknown[];
    try {
      await page.goto("/estacion/3");
      const root = page.locator(rootSelector); await expect(root).toBeVisible({ timeout: 25_000 }); await stable(root);
      const before = await facts(page); evidence.before = before;
      const baselineFont = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
      if (cut.text200) { await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await settle(page); }
      evidence.htmlFont = { before: baselineFont, actual: await page.evaluate(() => getComputedStyle(document.documentElement).fontSize) };
      if (cut.text200) expect(parseFloat((evidence.htmlFont as { actual: string }).actual)).toBeCloseTo(parseFloat(baselineFont) * 2, 1);
      const initial = await geometry(root); evidence.index = initial;
      expect(initial.original.renderedRatio).toBeCloseTo(initial.original.originalRatio, 3);
      expect(initial.registration.left).toBeCloseTo(163 / 892, 3); expect(initial.registration.top).toBeCloseTo(143 / 989, 3);
      expect(initial.registration.width).toBeCloseTo(650 / 892, 3); expect(initial.registration.height).toBeCloseTo(772 / 989, 3);
      expect(initial.index.map((record) => record.number)).toEqual(["01", "02", "03"]);
      expect(initial.index.map((record) => record.state)).toEqual(["current", "locked", "locked"]);
      for (const row of initial.index) { expect(row.numberWhiteSpace).toBe("nowrap"); if (row.separator) expect(row.separator.x).toBeGreaterThanOrEqual(row.numberRect.right + 1); }
      await expect(root.locator('[data-station3-record="planta"]')).toHaveAttribute("aria-current", "page");
      await expect(root.locator('[data-station3-record="prototipo"]')).toBeDisabled();
      await expect(root.locator('[data-station3-record="senal"]')).toBeDisabled();
      await expect(root.locator(".s3-practice-kicker")).toHaveCount(0);
      if (cut.name === "portrait390" || (cut.name === "portrait428" && locale === "es")) await page.screenshot({ path: info.outputPath("00-index.png"), fullPage: false });
      await observeFirstPaint(page);
      const temporal = cut.name === "portrait390";
      if (temporal) await startMotionJournal(page);
      await click(root.locator('[data-station3-record="planta"]'), controls); await stable(root);
      const records = getStation3Content(locale).records;
      for (let chapter = 0; chapter < records.length; chapter++) {
        const record = records[chapter];
        for (let leaf = 0; leaf < record.folios.length; leaf++) {
          await expect(root).toHaveAttribute("data-station3-folio", String(leaf + 1));
          await expect(root).toHaveAttribute("data-station3-folio-count", String(record.folios.length));
          const article = root.locator(`[data-station3-page="${record.id}"]`), paragraph = article.locator(".s3-practice-instructions p");
          await expect(article).toHaveAttribute("data-station3-folio-source", record.folios[leaf].sourceId);
          expect(await paragraph.textContent()).toBe(record.folios[leaf].text);
          await expect.poll(() => page.evaluate((id) => !!window.__obs04NotebookFirstPaint?.records[id], record.folios[leaf].sourceId)).toBe(true);
          const firstPaint = await page.evaluate((id) => window.__obs04NotebookFirstPaint!.records[id], record.folios[leaf].sourceId);
          if (["portrait390", "portrait428"].includes(cut.name)) {
            expect.soft(firstPaint.scrollTop, `normal initial reading position: ${record.id}/${leaf + 1}`).toBe(0);
            expect.soft(firstPaint.targets.every((target) => target.visible && target.opacity > 0 && target.lines.length > 0 && target.lines.every((line) => line.fits)), `all initial heading/body fragments fit actual clip: ${record.id}/${leaf + 1}`).toBe(true);
          }
          if (leaf === 0 && temporal) motion.push({ chapter: record.id, samples: await finishMotion(page, record.id, clipDurations[record.id]) });
          const sceneBeforeReading = await geometry(root);
          expect(sceneBeforeReading.actor.viewportVisible, `current actor initially visible: ${record.id}/${leaf + 1}`).toBe(true);
          expect(sceneBeforeReading.titleFragments.every((fragment) => fragment.fullscreenIntersection === 0)).toBe(true);
          const headings = [];
          if (leaf === 0) for (const heading of await article.locator("h2,h3").all()) {
            const headingGeometry = await readingGeometry(heading); headings.push(headingGeometry);
            expect(headingGeometry.lines.every((line) => line.reachable), `chapter heading reachable: ${record.id}`).toBe(true);
          }
          const measured = await readingGeometry(paragraph);
          const navTargets = await root.locator(".s3-practice-page-nav button").evaluateAll((buttons) => buttons.map((button) => { const r = button.getBoundingClientRect(); return { label: button.textContent, disabled: (button as HTMLButtonElement).disabled, rect: r.toJSON(), target48: r.width >= 48 && r.height >= 48 }; }));
          leaves.push({ chapter: record.id, leaf: leaf + 1, sourceId: record.folios[leaf].sourceId, firstPaint, sceneBeforeReading, headings, navTargets, ...measured });
          expect(navTargets.every((target) => target.target48)).toBe(true);
          expect(measured.lines.length).toBeGreaterThan(0);
          expect(measured.lines.every((line) => line.reachable), `all DOM text fragments reachable: ${record.id}/${leaf + 1}`).toBe(true);
          expect(measured.horizontalOverflow, `no inner horizontal text clipping: ${record.id}/${leaf + 1}`).toBe(false);
          expect(measured.document.scrollWidth).toBeLessThanOrEqual(cut.width + 1);
          // Retain scrollHeight/padding as metadata. Normal fit is asserted
          // above from first-paint h2/h3/p fragments, before probe scrolling.
          const layout = await geometry(root); expect(layout.navWithinPaper).toBe(false); expect(layout.navPaperIntersection).toBe(0);
          const current = await facts(page); expect(current.essential.stations[3].confirmedStepIds).toEqual(stepIds.slice(0, chapter)); expect(current.essential.stations[3].closed).toBe(false);
          await expect(page.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
          if (cut.name === "portrait390" || (leaf === 0 && cut.name !== "portrait428" && locale === "es" && chapter === 0)) await page.screenshot({ path: info.outputPath(`chapter-${record.id}-leaf${leaf + 1}.png`), fullPage: false });
          if (chapter === 0 && leaf === 0) {
            const motif = article.locator(".s3-practice-motif-button");
            const beforeMotif = (await facts(page)).essential.stations[3];
            const unselected = await motif.evaluate((node) => ({ border: getComputedStyle(node).borderTopColor, background: getComputedStyle(node).backgroundColor }));
            await click(motif, controls); await expect(motif).toHaveAttribute("aria-pressed", "true");
            const selected = await motif.evaluate((node) => ({ border: getComputedStyle(node).borderTopColor, background: getComputedStyle(node).backgroundColor }));
            evidence.selection = { unselected, selected }; expect(selected).not.toEqual(unselected);
            await expect(root.locator('[data-lia-target="planta"]')).toHaveAttribute("data-lia-action", "respond");
            await click(motif, controls); await expect(motif).toHaveAttribute("aria-pressed", "false");
            await expect(root.locator('[data-lia-target="planta"]')).toHaveAttribute("data-lia-clip-mode", "stable");
            expect((await facts(page)).essential.stations[3]).toEqual(beforeMotif);
          }
          if (leaf + 1 < record.folios.length) { await click(root.locator("[data-station3-folio-next]"), controls); await stable(root); }
        }
        if (temporal && chapter < 2) await startMotionJournal(page);
        await click(root.locator(`[data-station3-confirm-chapter="${stepIds[chapter]}"]`), controls); await stable(root);
        if (chapter === 0) {
          await click(root.locator(".s3-practice-index-tab"), controls); await stable(root);
          await expect(root.locator('[data-station3-record="planta"]')).toHaveAttribute("data-record-state", "completed");
          await expect(root.locator('[data-station3-record="prototipo"]')).toHaveAttribute("data-record-state", "current");
          await expect(root.locator('[data-station3-record="senal"]')).toHaveAttribute("data-record-state", "locked");
          if (temporal) {
            // A prior chapter can be current while the next pending chapter is
            // available. The consulted chapter retains its independent stamp.
            await click(root.locator('[data-station3-record="planta"]'), controls); await stable(root);
            await click(root.locator(".s3-practice-index-tab"), controls); await stable(root);
            await expect(root.locator('[data-station3-record="planta"]')).toHaveAttribute("data-record-state", "current");
            await expect(root.locator('[data-station3-record="planta"]')).toHaveAttribute("data-record-confirmed", "true");
            await expect(root.locator('[data-station3-record="prototipo"]')).toHaveAttribute("data-record-state", "available");
            expect((await facts(page)).essential.stations[3].confirmedStepIds).toEqual(["INTRO"]);
          }
          if (temporal) await startMotionJournal(page);
          await click(root.locator('[data-station3-record="prototipo"]'), controls); await stable(root);
        }
      }
      await expect(page.locator('[data-interstation-qr-action="open"]')).toBeVisible();
      const after = await facts(page); evidence.after = after;
      expect(after.essential.stations[3].confirmedStepIds).toEqual(stepIds); expect(after.essential.stations[3].closed).toBe(true);
      expect(after.progressRaw).toBe(before.progressRaw); expect(after.legacy).toEqual(before.legacy);
      expect(after.essential.stations[1]).toEqual(before.essential.stations[1]); expect(after.essential.stations[2]).toEqual(before.essential.stations[2]);
      expect(after.essential.pendingTransition).toBeNull(); expect(after.essential.finalReached).toBe(false);
      expect(errors).toEqual([]);
    } finally {
      evidence.finalState = await facts(page).catch((error) => ({ unavailable: String(error) }));
      await page.evaluate(() => { window.__obs04NotebookMotion?.stop(); window.__obs04NotebookFirstPaint?.stop(); }).catch(() => undefined);
      const path = info.outputPath("OBS04-NOTEBOOK-EVIDENCE.json"); writeFileSync(path, JSON.stringify(evidence, null, 2) + "\n");
      await info.attach("OBS04-NOTEBOOK-EVIDENCE", { path, contentType: "application/json" });
    }
  });
}
