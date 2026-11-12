import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import type { VerifiedEssentialSnapshot } from "../../src/app/journey/journeyEssential";
import type { World4OrderingState } from "../../src/domain/checkpoints/world4OrderingCheckpoint";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as { toDataURL(value: string, options: { width: number; margin: number }): Promise<string> };
const ESSENTIAL = "gvo.journey.essential.v1";
const PROGRESS = "gvo.progress.v1";
const roots = { cover: "main.cover-intro", 1: "main.world1-root-screen", 2: "main.world2-root-screen", 3: "main.s3-practice-screen", 4: "main.s4-ordering", 5: "main.s5-quiz", final: "main.final-root-shell" } as const;
type CameraRecord = { pathname: string; payload: string | null; audio: boolean | MediaTrackConstraints | undefined; startedAt: number; qrPaintedAt: number | null; ended: boolean; stops: number };
type CameraLab = { initialLocalKeys: string[]; records: CameraRecord[]; errors: string[]; devHookDefined: boolean };
type MusicSample = { ms: number; stage: string; complete: string | null; motionActive: string | null };
type MusicJournal = { startedAt: number | null; samples: MusicSample[]; stop: () => void };
type World2SweepSample = { at: number; segmentId: number; segmentMs: number; documentWidth: number; bodyWidth: number; viewportWidth: number; titleText: string | null; titleWidth: number; pseudoWidth: number; transform: string; opacity: number; animationName: string; animationDuration: string; backgroundPosition: string; backgroundSize: string; active: boolean; visible: string; roomState: string | null };
type World2SweepJournal = { samples: World2SweepSample[]; segmentCount: number; lastSegmentStartedAt: number; stop: () => void };
declare global { interface Window { __obs03CameraLab?: CameraLab; __obs03MusicJournal?: MusicJournal; __obs03World2SweepJournal?: World2SweepJournal; } }

async function installCanvasCamera(page: Page) {
  const frames = Object.fromEntries(await Promise.all([2, 3, 4, 5].map(async (world) => [`/qr/w${world}`, await QRCode.toDataURL(`/qr/w${world}`, { width: 512, margin: 4 })])));
  await page.addInitScript((qrFrames) => {
    const lab: CameraLab = { initialLocalKeys: Object.keys(localStorage), records: [], errors: [], devHookDefined: "__GVO_QR_TEST_MODE__" in window };
    window.__obs03CameraLab = lab;
    const devices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: devices });
    Object.defineProperty(devices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
      const pathname = location.pathname;
      const match = /^\/estacion\/([1-4])$/.exec(pathname);
      const payload = match ? `/qr/w${Number(match[1]) + 1}` : null;
      const record: CameraRecord = { pathname, payload, audio: constraints.audio, startedAt: performance.now(), qrPaintedAt: null, ended: false, stops: 0 };
      lab.records.push(record);
      if (constraints.audio !== false) throw new Error("OBS03 camera lab requires audio:false");
      const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 640;
      const draw = canvas.getContext("2d")!;
      const image = new Image(); let decoded = false;
      if (payload) { image.src = qrFrames[payload]; void image.decode().then(() => { decoded = true; }).catch((error) => lab.errors.push(String(error))); }
      const paint = () => {
        draw.fillStyle = "white"; draw.fillRect(0, 0, 640, 640);
        // Real blank frames precede the canonical QR. No decode event/hook is injected.
        if (decoded && performance.now() - record.startedAt >= 600) { draw.drawImage(image, 64, 64, 512, 512); record.qrPaintedAt ??= performance.now(); }
      };
      paint(); const stream = canvas.captureStream(12);
      const timer = window.setInterval(paint, 80);
      for (const track of stream.getTracks()) {
        const originalStop = track.stop.bind(track);
        track.stop = () => { if (!record.ended) { record.stops++; record.ended = true; window.clearInterval(timer); } originalStop(); };
      }
      return stream;
    } });
  }, frames);
}
async function ready(page: Page, root: string) {
  await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${root}`)).toBeVisible({ timeout: 25_000 });
  await expect(page.locator('.gvo-preparation-curtain')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  if (root === roots[4]) {
    await expect(page.locator(root)).toHaveAttribute('data-journey-active', 'true');
    await expect(page.locator(root).getByRole('button', { name: /^(Comenzar|Start)$/ })).toBeEnabled();
  }
  expect(await page.locator(root).evaluate(async (node) => {
    const readyNow = () => node.isConnected && node.closest('.gvo-prepared-tree')?.getAttribute('data-journey-active') === 'true' && !node.closest('[inert],[aria-hidden="true"]') && !document.querySelector('.gvo-preparation-curtain');
    if (!readyNow()) return false;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return readyNow();
  })).toBe(true);
}
async function click(page: Page, selector: string, label: string) {
  const button = page.locator(selector).getByRole("button", { name: label, exact: true });
  await expect(button).toBeEnabled({ timeout: 20_000 }); await button.click();
}
async function snapshot(page: Page) {
  return page.evaluate(({ essential, progress }) => ({ essential: JSON.parse(localStorage.getItem(essential) ?? "null") as VerifiedEssentialSnapshot | null, progress: JSON.parse(localStorage.getItem(progress) ?? "null") as { completedStations: number[] } | null, legacyPracticeRaw: localStorage.getItem("gvo.station3.practice.v2"), ordering: JSON.parse(localStorage.getItem("gvo.station4.ordering.v1") ?? "null") as World4OrderingState | null, quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1") ?? "null"), camera: window.__obs03CameraLab ?? null }), { essential: ESSENTIAL, progress: PROGRESS });
}
async function scanNext(page: Page, world: 1 | 2 | 3 | 4, evidence: unknown[]) {
  const before = await snapshot(page);
  expect(before.essential?.stations[world].closed).toBe(true);
  expect(before.progress?.completedStations ?? []).toEqual(Array.from({ length: world - 1 }, (_, i) => i + 1));
  const gate = page.locator('[data-interstation-qr-action="open"]'); await expect(gate).toBeVisible(); await gate.click();
  await expect(page.locator('[data-interstation-qr-gate="active"] video')).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/estacion/${world + 1}(?:/[^?#]*)?(?:[?#].*)?$`), { timeout: 30_000 });
  await ready(page, roots[(world + 1) as 2 | 3 | 4 | 5]);
  const after = await snapshot(page);
  expect(after.progress?.completedStations).toEqual(Array.from({ length: world }, (_, i) => i + 1));
  const scanned = after.camera?.records.filter((record) => record.payload) ?? [];
  expect(scanned.at(-1)).toMatchObject({ payload: `/qr/w${world + 1}`, ended: true, stops: 1 });
  expect(scanned.at(-1)?.qrPaintedAt).not.toBeNull();
  evidence.push({ world, before, after, transport: "canvas.captureStream→real ZXing production decoder", physicalCameraValidated: false });
}
async function capture(page: Page, info: TestInfo, name: string) {
  // Passive evidence guard: never silently re-wait if a ready scene becomes a
  // preparation curtain during capture. Keep both native viewport and full page.
  await page.evaluate(() => {
    const state = () => ({ at: performance.now(), active: document.querySelector('.gvo-prepared-tree')?.getAttribute('data-journey-active'), curtain: !!document.querySelector('.gvo-preparation-curtain'), visible: document.visibilityState, width: innerWidth, height: innerHeight, main: document.querySelector('.gvo-prepared-tree main')?.className, mainActive: document.querySelector('.gvo-prepared-tree main')?.getAttribute('data-journey-active') });
    const samples: Array<ReturnType<typeof state> & { event: string }> = [];
    const record = (event: string) => samples.push({ event, ...state() });
    const observer = new MutationObserver(() => record('mutation'));
    observer.observe(document.body, {subtree:true,childList:true,attributes:true,attributeFilter:['data-journey-active','inert','aria-hidden']});
    const events = ['resize','storage','gvo:journey-reset','gvo:journey-reset-start','visibilitychange'];
    const handlers = events.map(event => { const listener=()=>record(event); window.addEventListener(event,listener); return {event,listener}; });
    record('before');
    (window as Window & {__obs03CaptureJournal?: {stop:()=>unknown}}).__obs03CaptureJournal={stop:()=>{record('after');observer.disconnect();for(const {event,listener} of handlers)window.removeEventListener(event,listener);return samples;}};
  });
  let shotError: unknown;
  try {
    await page.screenshot({ path: info.outputPath(`${name}-viewport.png`), fullPage:false, scale:'css' });
    await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage:true, scale:'css' });
  } catch (error) { shotError=error; }
  const journal = await page.evaluate(() => (window as Window & {__obs03CaptureJournal?: {stop:()=>Array<{active:string|null|undefined;curtain:boolean;visible:string}>}}).__obs03CaptureJournal!.stop());
  await info.attach(`${name}-capture-continuity`,{body:JSON.stringify({qualification:'Passive DOM/event journal; no readiness, CSS, viewport or semantic mutation injected. A curtain/inactive sample is a failure, never silently recaptured.',journal},null,2),contentType:'application/json'});
  expect(journal.filter(sample=>sample.active!=='true'||sample.curtain||sample.visible!=='visible')).toEqual([]);
  if(shotError)throw shotError;
}

function earnedFacts(state: Awaited<ReturnType<typeof snapshot>>) {
  // Revision and pendingTransition are technical transport, not new earned facts.
  return { progress: state.progress, cover: state.essential?.cover, stations: state.essential?.stations, finalReached: state.essential?.finalReached, quiz: state.quiz, ordering: state.ordering, legacyPracticeRaw: state.legacyPracticeRaw };
}

async function preferences(page: Page) {
  return page.evaluate(() => {
    const matches = (key: string) => key === "gvo.language.v1" || /^gvo[:.].*(?:hint|preference|accessibility|theme)/i.test(key);
    const read = (storage: Storage) => Object.fromEntries(Object.keys(storage).filter(matches).sort().map((key) => [key, storage.getItem(key)]));
    return { local: read(localStorage), session: read(sessionStorage) };
  });
}

async function armMusicJournal(page: Page) {
  await page.evaluate(() => {
    window.__obs03MusicJournal?.stop();
    const journal: MusicJournal = { startedAt: null, samples: [], stop: () => {} };
    const record = () => {
      const scene = document.querySelector('[data-world2-option6-stage]');
      if (!scene) return;
      const now = performance.now(); journal.startedAt ??= now;
      const sample = { ms: now - journal.startedAt, stage: scene.getAttribute('data-world2-option6-stage')!, complete: scene.getAttribute('data-world2-option6-complete'), motionActive: scene.getAttribute('data-motion-active') };
      const last = journal.samples.at(-1);
      if (!last || last.stage !== sample.stage || last.complete !== sample.complete || last.motionActive !== sample.motionActive) journal.samples.push(sample);
    };
    const observer = new MutationObserver(record);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-world2-option6-stage', 'data-world2-option6-complete', 'data-motion-active'] });
    journal.stop = () => { record(); observer.disconnect(); };
    window.__obs03MusicJournal = journal;
    record();
  });
}

async function world2InitialHeaderGeometry(page: Page, info: TestInfo, phase: string) {
  // Resting initial viewport only; scrolled fixed overlays are not this assertion.
  await page.evaluate(() => window.scrollTo(0,0));
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  const result = await page.locator(`${roots[2]} .world2-scene-title h1`).evaluate((title) => {
    const rect = title.getBoundingClientRect(), header = title.parentElement!, css = getComputedStyle(header);
    const range = document.createRange(); range.selectNodeContents(title);
    const textFragments = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0).map((r) => r.toJSON());
    const intersection = (a: { left: number; right: number; top: number; bottom: number }, b: DOMRect) => Math.max(0, Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const controls = Array.from(document.querySelectorAll<HTMLElement>('[data-final-review-return="active"],.gvo-immersive-shell__control')).filter((node) => node.getBoundingClientRect().width > 0 && getComputedStyle(node).visibility !== 'hidden').map((node) => {
      const r=node.getBoundingClientRect();return {className:node.className,label:node.getAttribute('aria-label')??node.textContent,rect:r.toJSON(),blockIntersectionArea:intersection(rect,r),textFragmentIntersections:textFragments.map((fragment,index)=>({index,rect:fragment,intersectionArea:intersection(fragment,r)}))};
    });
    return {scroll:{x:scrollX,y:scrollY},viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},rootFontPx:parseFloat(getComputedStyle(document.documentElement).fontSize),title:{text:title.textContent,rect:rect.toJSON(),textFragments,fontSize:getComputedStyle(title).fontSize,lineHeight:getComputedStyle(title).lineHeight},header:{rect:header.getBoundingClientRect().toJSON(),paddingBlockStart:css.paddingBlockStart},reviewPlacement:document.querySelector('.final-review-mode-layout')?.getAttribute('data-final-review-placement'),controls};
  });
  await info.attach(`OBS03-II-initial-title-clearance-${phase}`,{body:JSON.stringify({phase,result,qualification:"Actual resting initial viewport h1block plus Range.selectNodeContents(h1).getClientRects text-line fragments and control rectangles, recorded before assertions. Text-line intersections are asserted; empty block-space overlap remains diagnostic. Not a test of content deliberately scrolled beneath fixed controls."},null,2),contentType:"application/json"});
  await page.screenshot({path:info.outputPath(`II-initial-title-${phase}-viewport.png`)});
  expect(result.scroll.x).toBe(0);expect(result.scroll.y).toBe(0);
  expect(result.title.rect.left).toBeGreaterThanOrEqual(0);expect(result.title.rect.right).toBeLessThanOrEqual(result.viewport.width);
  expect(result.title.rect.top).toBeGreaterThanOrEqual(0);expect(result.title.rect.bottom).toBeLessThanOrEqual(result.viewport.height);
  expect(result.controls.length).toBeGreaterThan(0);
  expect(result.title.textFragments.length).toBeGreaterThan(0);
  for(const control of result.controls)for(const fragment of control.textFragmentIntersections)expect(fragment.intersectionArea,`Initial title line${fragment.index} overlaps ${control.label}`).toBe(0);
  return result;
}

async function world2ExitAncestry(page: Page) {
  return page.locator(`${roots[2]} [data-interstation-qr-action="open"]`).evaluate((target) => {
    const describe = (node: Element) => {
      const css = getComputedStyle(node), box = node.getBoundingClientRect(), element = node as HTMLElement;
      const fields = ['display','position','inset','top','right','bottom','left','height','minHeight','maxHeight','width','minWidth','maxWidth','gridTemplateRows','gridTemplateColumns','gridArea','gridRowStart','gridRowEnd','alignSelf','alignItems','alignContent','justifySelf','overflow','overflowX','overflowY','boxSizing','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','gap','rowGap','columnGap','fontSize','lineHeight','transform'] as const;
      return {tag:node.tagName,className:node.getAttribute('class'),id:node.id,data: {...element.dataset},rect:box.toJSON(),clientHeight:element.clientHeight,scrollHeight:element.scrollHeight,offsetHeight:element.offsetHeight,clientWidth:element.clientWidth,scrollWidth:element.scrollWidth,offsetWidth:element.offsetWidth,scrollTop:element.scrollTop,styles:Object.fromEntries(fields.map((field)=>[field,css[field]]))};
    };
    const ancestry=[];let node:Element|null=target;
    while(node){ancestry.push(describe(node));node=node.parentElement;}
    const otherSelectors=['.world2-layer-nav','.world2-layer-nav__items','.world2-scene-zone','.world2-scene-field','.world2-dialogue__copy-block','.world2-dialogue__eyebrow','.world2-dialogue__title','.world2-dialogue__copy'];
    return {at:performance.now(),url:location.href,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},scroll:{x:scrollX,y:scrollY},document:{clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth},ancestry,related:otherSelectors.flatMap((selector)=>Array.from(document.querySelectorAll(selector)).map((n)=>({selector,...describe(n)})))};
  });
}

async function world2ExitGeometry(page: Page, info: TestInfo, phase: string) {
  const button = page.locator(`${roots[2]} [data-interstation-qr-action="open"]`);
  await expect(button).toBeVisible(); await expect(button).toBeEnabled();
  const diagnostic = process.env.GVO_OBS03_II_DIAGNOSTIC === "1";
  if (diagnostic) {
    await info.attach(`OBS03-II-ancestry-${phase}-before-scroll`,{body:JSON.stringify(await world2ExitAncestry(page),null,2),contentType:"application/json"});
    await page.screenshot({path:info.outputPath(`II-diagnostic-${phase}-before-scroll-viewport.png`)});
    await page.screenshot({path:info.outputPath(`II-diagnostic-${phase}-before-scroll-fullpage.png`),fullPage:true});
  }
  await button.scrollIntoViewIfNeeded(); await button.focus(); await expect(button).toBeFocused();
  if (diagnostic) {
    await info.attach(`OBS03-II-ancestry-${phase}-after-scroll`,{body:JSON.stringify(await world2ExitAncestry(page),null,2),contentType:"application/json"});
    await page.screenshot({path:info.outputPath(`II-diagnostic-${phase}-after-scroll-viewport.png`)});
    await page.screenshot({path:info.outputPath(`II-diagnostic-${phase}-after-scroll-fullpage.png`),fullPage:true});
  }
  const geometry = await button.evaluate((target) => {
    const button = target as HTMLElement, room = button.closest('main')!;
    const rect = button.getBoundingClientRect();
    const text = Array.from(room.querySelectorAll<HTMLElement>('.world2-sonic-convergence__label,.world2-sonic-convergence__copy,.world2-dialogue__copy-block p')).filter((node) => node.getBoundingClientRect().width > 0 && getComputedStyle(node).visibility !== 'hidden');
    const records = text.map((node) => { const r = node.getBoundingClientRect(); return { text: node.textContent, className: node.className, rect: r.toJSON(), intersectionArea: Math.max(0, Math.min(r.right, rect.right) - Math.max(r.left, rect.left)) * Math.max(0, Math.min(r.bottom, rect.bottom) - Math.max(r.top, rect.top)) }; });
    const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y]) => {
      const point = { x: rect.left + rect.width * x, y: rect.top + rect.height * y }, hit = document.elementFromPoint(point.x, point.y);
      return { ...point, targetHit: hit === button || !!hit && button.contains(hit), hitTag: hit?.tagName, hitClass: hit?.getAttribute('class'), hitText: hit?.textContent?.trim().slice(0,120) };
    });
    return { viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, rootFontPx: parseFloat(getComputedStyle(document.documentElement).fontSize), scrollY, documentScrollWidth: document.documentElement.scrollWidth, button: rect.toJSON(), accessibleLabel: button.getAttribute('aria-label'), text: button.textContent, inDialogueActions: !!button.closest('.world2-dialogue__actions'), standaloneExitParagraphs: room.querySelectorAll('.world2-scene-exit > p').length, comparedTexts: records, points };
  });
  await info.attach(`OBS03-II-exit-geometry-${phase}`, { body: JSON.stringify({ phase, geometry, qualification: "Actual native DOM measurements recorded before assertions; a recorded geometry is not by itself PASS." }, null, 2), contentType: "application/json" });
  expect(geometry.inDialogueActions).toBe(true); expect(geometry.standaloneExitParagraphs).toBe(0);
  expect(geometry.documentScrollWidth).toBeLessThanOrEqual(geometry.viewport.width + 1);
  expect(geometry.button.left).toBeGreaterThanOrEqual(0); expect(geometry.button.right).toBeLessThanOrEqual(geometry.viewport.width);
  expect(geometry.button.top).toBeGreaterThanOrEqual(0); expect(geometry.button.bottom).toBeLessThanOrEqual(geometry.viewport.height);
  expect(geometry.button.width).toBeGreaterThanOrEqual(44); expect(geometry.button.height).toBeGreaterThanOrEqual(44);
  expect(geometry.comparedTexts.length).toBeGreaterThan(0);
  for (const text of geometry.comparedTexts) expect(text.intersectionArea, `QR overlaps ${text.text}`).toBe(0);
  for (const point of geometry.points) expect(point.targetHit, `QR hit${point.x},${point.y}: ${point.hitClass}`).toBe(true);
  return geometry;
}

async function captureMusicSequence(page: Page, info: TestInfo) {
  const scene = page.locator(`${roots[2]} [data-world2-option6-stage]`);
  const frames = [];
  for (const stage of ["intensity", "rhythm", "pitch", "resolved"]) {
    // Observe the existing natural9s sequence; never press Ver resultado or alter its clock.
    await expect(scene).toHaveAttribute("data-world2-option6-stage", stage, { timeout: 12_000 });
    const before = await scene.evaluate((node) => ({ at: performance.now(), stage: node.getAttribute("data-world2-option6-stage"), rect: node.getBoundingClientRect().toJSON(), scrollY, viewport: [innerWidth, innerHeight] }));
    const filename = `02-music-natural-${stage}.png`;
    await scene.screenshot({ path: info.outputPath(filename) });
    const after = await scene.getAttribute("data-world2-option6-stage");
    frames.push({ filename, before, stageAfterScreenshot: after });
  }
  await expect(scene).toHaveAttribute("data-world2-option6-complete", "true", { timeout: 12_000 });
  await expect(page.locator(roots[2]).getByRole("button", { name: "Cerrar Música", exact: true })).toBeEnabled({ timeout: 12_000 });
  const journal = await page.evaluate(() => { const journal = window.__obs03MusicJournal; journal?.stop(); return journal ? { startedAt: journal.startedAt, samples: journal.samples } : null; });
  expect([...new Set(journal?.samples.map((sample) => sample.stage))]).toEqual(["intensity", "rhythm", "pitch", "resolved"]);
  await capture(page, info, "02-music-natural-before-manual-close");
  await info.attach("OBS03-Music-natural-sequence-journal", { body: JSON.stringify({ qualification: "Real UI stage screenshots and passive DOM observation during the existing natural sequence; no assisted result, fake clock, audio, paced reading or physical performance claim", source: "src/screens/World2Root/World2MediatedResultPanel.tsx:stageSequence", sourceStageDelaysMs: [2100, 4200, 6300], sourceCompletionMs: 9000, frames, journal }, null, 2), contentType: "application/json" });
}

async function focusedGeometry(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    const rect = element?.getBoundingClientRect();
    return { tag: element?.tagName, label: element?.getAttribute("aria-label") ?? element?.textContent?.trim(), scrollY, viewport: { width: innerWidth, height: innerHeight }, rect: rect ? { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height } : null };
  });
}

test.describe("OBS03 I280 focal · declared layout fixture", () => {
  for (const locale of ["es", "en"] as const) test(`280×640 ${locale} · complete conceptual hit areas`, async ({ page }, info) => {
    await page.setViewportSize({ width: 280, height: 640 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installDeclaredLayoutFixture(page, locale);
    await page.goto("/estacion/1"); await ready(page, roots[1]);
    await click(page, roots[1], locale === "es" ? "+ Más" : "+ More");
    const records = [];
    for (const id of ["relation", "perception", "mediation"]) {
      const node = page.locator(`${roots[1]} [data-world1-root-node="${id}"]`);
      await expect(node).toBeEnabled(); await node.focus(); await expect(node).toBeFocused();
      const record = await focusedGeometry(page); records.push({ id, ...record });
      expect(record.rect).not.toBeNull();
      expect(record.rect!.x).toBeGreaterThanOrEqual(0);
      expect(record.rect!.right).toBeLessThanOrEqual(280);
      expect(record.rect!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(281);
    await page.screenshot({ path: info.outputPath(`I280-${locale}-viewport.png`) });
    await info.attach("OBS03-I280-fixture-geometry", { body: JSON.stringify({ qualification: "Synthetic persisted fixture; geometric keyboard focus coverage only, no earned progress", locale, records }, null, 2), contentType: "application/json" });
  });
});

test.describe("OBS03 production journey · earned through UI", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  test("fresh entry → five rooms → Lookout, four real decoder scans, no seeded progress", async ({ page, baseURL }, info) => {
    test.setTimeout(240_000);
    await installCanvasCamera(page);
    const external: string[] = [], httpErrors: unknown[] = [], pageErrors: string[] = [], evidence: unknown[] = [];
    const reviewEvidence: unknown[] = [];
    let phase = "normal_journey";
    let endEarned: Awaited<ReturnType<typeof snapshot>> | null = null;
    let postReset: Awaited<ReturnType<typeof snapshot>> | null = null;
    page.on("request", (request) => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL!).origin) external.push(request.url()); });
    page.on("response", (response) => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const indexBefore = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
    if (process.env.GVO_OBS03_EXPECTED_INDEX_SHA256) expect(indexBefore).toBe(process.env.GVO_OBS03_EXPECTED_INDEX_SHA256);
    try {
      await page.goto("/");
      await expect(page.locator('[data-language-option="es"]')).toBeEnabled({ timeout: 25_000 });
      expect(await page.evaluate(() => window.__obs03CameraLab?.initialLocalKeys)).toEqual([]);
      expect(await page.evaluate(() => "__GVO_QR_TEST_MODE__" in window)).toBe(false);
      await page.locator('[data-language-option="es"]').click();
      await page.locator('[data-initial-experience-action="start"]').click();
      await expect(page).toHaveURL(/\/portada$/); await ready(page, roots.cover);
      await click(page, roots.cover, "Empieza aquí");
      for (let i = 0; i < 3; i++) await click(page, roots.cover, "Siguiente diálogo de Lía");
      await click(page, roots.cover, "¡Adelante!"); await capture(page, info, "00-cover-essential-closed");
      await click(page, roots.cover, "Sala I · Raíz, lista para abrir.");
      await expect(page).toHaveURL(/\/estacion\/1$/); await ready(page, roots[1]);
      expect(await page.locator('[data-interstation-qr-action="open"]').count()).toBe(0);
      await capture(page, info, "01-root-initial");
      for (let i = 0; i < 3; i++) await click(page, roots[1], "Continuar");
      await click(page, roots[1], "Cerrar"); await scanNext(page, 1, evidence);

      await capture(page, info, "02-pulse-initial");
      await click(page, roots[2], "Abrir Punto de lectura"); await click(page, roots[2], "Continuar");
      await click(page, roots[2], "Expandir señal medida"); await click(page, roots[2], "Continuar");
      for (const label of ["Mostrar paso 1: Contacto", "Mostrar paso 2: Señal tomada", "Mostrar paso 3: Datos al sistema"]) await click(page, roots[2], label);
      await click(page, roots[2], "Continuar"); // Capture confirmed after actual three microactions.
      await click(page, roots[2], "Continuar"); // Conditioning.
      await armMusicJournal(page);
      await click(page, roots[2], "Continuar"); // Mapping: wait for its real finite presentation.
      await captureMusicSequence(page, info);
      expect((await snapshot(page)).essential?.stations[2].closed).toBe(false);
      await click(page, roots[2], "Cerrar Música"); // Convergence never closes itself.
      const normalExitGeometry = await world2ExitGeometry(page, info, "normal");
      await info.attach("OBS03-II-normal-close-exit-geometry", { body: JSON.stringify({ qualification: "Actual unseeded journey after manual Music close; QR focus/hitpoints and zero intersection with scene/dialogue text", geometry: normalExitGeometry }, null, 2), contentType: "application/json" });
      const pulse = await snapshot(page);
      expect(pulse.essential?.stations[2].interactionEvidence.filter((fact) => fact.kind === "capture_step").map((fact) => fact.id)).toEqual(["contact", "signal", "system"]);
      await scanNext(page, 2, evidence);

      await capture(page, info, "03-original-notebook-index");
      const intro = page.locator(roots[3]).getByRole("button", { name: /^Página 1 de 3/ }); await expect(intro).toBeEnabled(); await intro.click();
      await click(page, roots[3], "PASO A PASO →");
      await expect(page.locator(`${roots[3]} [data-station3-page="prototipo"]`).getByRole("heading", { name: "PASO A PASO", exact: true })).toBeVisible();
      await expect(page.locator(`${roots[3]} [data-station3-page-turn]`)).toHaveCount(0);
      await capture(page, info, "03-notebook-practice-optional");
      await click(page, roots[3], "BENEFICIOS →"); await click(page, roots[3], "Cerrar cuaderno");
      expect((await snapshot(page)).legacyPracticeRaw).toBeNull(); await scanNext(page, 3, evidence);

      await capture(page, info, "04-eight-objects");
      await expect(page.locator(`${roots[4]} [data-ordering-object]`)).toHaveCount(8);
      await click(page, roots[4], "Ayúdame a ordenar");
      await expect(page.locator(roots[4])).toHaveAttribute("data-station4-ordering-phase", "review");
      for (let i = 0; i < 8; i++) {
        await expect(page.locator(roots[4]).getByText(`Repaso ${i + 1}/8`, { exact: true })).toBeVisible();
        await expect(page.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
        if (i < 7) await click(page, roots[4], "Siguiente");
      }
      await click(page, roots[4], "Cerrar");
      expect((await snapshot(page)).essential?.stations[4].outcome).toBe("assisted_review_completed"); await scanNext(page, 4, evidence);

      for (const area of ["plantas", "sistema", "espacio", "visitante"]) {
        await expect(page.locator(roots[5])).toHaveAttribute("data-station5-area", area);
        const answer = page.locator(`${roots[5]} button[data-answer="agreement"]:visible`); await expect(answer).toBeEnabled();
        await expect(page.locator(`${roots[5]} .s5-question-unit`)).toHaveAttribute('aria-busy','false');
        await capture(page, info, `05-${area}-two-options-before-answer`);
        await answer.click();
        await expect(page.locator(`${roots[5]} .s5-quiz-feedback`)).toBeVisible();
        if (area === "plantas") await capture(page, info, "05-question-feedback");
        await click(page, roots[5], "Siguiente");
      }
      await expect(page.locator(roots[5])).toHaveAttribute("data-station5-area", "resultado");
      await expect(page.locator(`${roots[5]} .s5-quiz-result`)).toContainText("4 puntos");
      await click(page, roots[5], "Ir al Mirador");
      await expect(page).toHaveURL(/\/final$/); await ready(page, roots.final); await capture(page, info, "06-lookout-normal-arrival");
      const end = await snapshot(page);
      expect(end.progress?.completedStations).toEqual([1, 2, 3, 4, 5]); expect(end.essential?.finalReached).toBe(true);
      expect(end.quiz.correctAnswers).toEqual(["plantas", "sistema", "espacio", "visitante"]);
      expect(end.camera?.records.filter((record) => record.payload).map((record) => record.payload)).toEqual(["/qr/w2", "/qr/w3", "/qr/w4", "/qr/w5"]);
      expect(end.camera?.records.every((record) => record.ended && record.audio === false)).toBe(true);
      expect(end.camera?.errors).toEqual([]); expect(external).toEqual([]); expect(httpErrors).toEqual([]); expect(pageErrors).toEqual([]);
      // Preserve the earned complete journey before any review or destructive reset.
      endEarned = end;
      phase = "earned_complete_before_review";
      await info.attach("OBS03-earned-complete-before-review", { body: JSON.stringify({ qualification: "Fresh normal journey earned only through UI, four canonical canvas-camera/production-ZXing scans; this snapshot predates review and reset", state: endEarned, normalScans: evidence }, null, 2), contentType: "application/json" });

      phase = "review_I";
      await page.locator(`${roots.final} a[data-final-access-id="i"]`).click();
      await expect(page).toHaveURL(/\/estacion\/1$/); await ready(page, roots[1]);
      await expect(page.locator('.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="1"]')).toBeVisible();
      const reviewQr = page.locator('[data-interstation-qr-action="open"]');
      // No local practice, Continue or completion gesture is required in validated review.
      await expect(reviewQr).toBeVisible(); await expect(reviewQr).toBeEnabled();
      const inReviewI = await snapshot(page);
      expect(earnedFacts(inReviewI)).toEqual(earnedFacts(endEarned));
      await capture(page, info, "07-review-I-immediate-optional-QR");
      reviewEvidence.push({ phase, state: inReviewI, earnedFactsUnchanged: true });

      phase = "review_QR_I_to_II";
      await reviewQr.click();
      await expect(page.locator('[data-interstation-qr-gate="active"] video')).toBeVisible();
      await expect(page).toHaveURL(/\/estacion\/2$/, { timeout: 30_000 }); await ready(page, roots[2]);
      await expect(page.locator('.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="2"]')).toBeVisible();
      await expect(page.locator('[data-final-review-return="active"]')).toBeVisible();
      const inReviewII = await snapshot(page);
      expect(earnedFacts(inReviewII)).toEqual(earnedFacts(endEarned));
      const normalCameras = endEarned.camera!.records.filter((record) => record.payload);
      const reviewCameras = inReviewII.camera!.records.filter((record) => record.payload).slice(normalCameras.length);
      expect(normalCameras).toHaveLength(4); expect(reviewCameras).toHaveLength(1);
      expect(reviewCameras[0]).toMatchObject({ pathname: "/estacion/1", payload: "/qr/w2", ended: true, stops: 1, audio: false });
      expect(reviewCameras[0].qrPaintedAt).not.toBeNull();
      expect(inReviewII.camera?.errors).toEqual([]);
      const reviewExitGeometry = await world2ExitGeometry(page, info, "readonly");
      await info.attach("OBS03-II-readonly-exit-geometry", { body: JSON.stringify({ qualification: "Actual earned review context after optional QR transport; QR focus/hitpoints and zero intersection with scene/dialogue text", geometry: reviewExitGeometry }, null, 2), contentType: "application/json" });
      await capture(page, info, "08-review-II-context-transported");
      reviewEvidence.push({ phase, transport: "canvas.captureStream→real ZXing production decoder", reviewCameras, state: inReviewII, earnedFactsUnchanged: true, physicalCameraValidated: false });

      phase = "review_return_to_Mirador";
      await page.locator('[data-final-review-return="active"]').click();
      await expect(page).toHaveURL(/\/final$/); await ready(page, roots.final);
      const returned = await snapshot(page);
      expect(earnedFacts(returned)).toEqual(earnedFacts(endEarned));
      reviewEvidence.push({ phase, state: returned, earnedFactsUnchanged: true });

      phase = "reset_confirmation";
      const preservedPreferences = await preferences(page);
      expect(preservedPreferences.local["gvo.language.v1"]).toBe("es");
      await page.locator(`${roots.final} [data-final-action="open_restart_confirmation"]`).click();
      await expect(page.locator('[data-final-reset-state="confirm"]')).toBeVisible();
      expect(earnedFacts(await snapshot(page))).toEqual(earnedFacts(endEarned));
      await capture(page, info, "09-reset-explicit-confirmation");
      phase = "reset_transaction";
      await page.locator('[data-final-action="confirm_restart_transaction"]').click();
      await expect(page).toHaveURL(/\/portada$/); await ready(page, roots.cover);
      phase = "post_reset_validation";
      await expect(page.locator(roots.cover)).toHaveAttribute("data-cover-phase", "portada_idle");
      postReset = await snapshot(page);
      expect(postReset.progress).toBeNull(); expect(postReset.essential).toBeNull();
      expect(postReset.quiz).toBeNull(); expect(postReset.ordering).toBeNull(); expect(postReset.legacyPracticeRaw).toBeNull();
      expect(await page.evaluate(() => sessionStorage.getItem("gvo.final.reviewContext.v1"))).toBeNull();
      expect(await preferences(page)).toEqual(preservedPreferences);
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
      await expect(page.locator(roots.cover).getByRole("button", { name: "Empieza aquí", exact: true })).toBeEnabled();
      await capture(page, info, "10-post-reset-fresh-cover-preserved-language");
      phase = "post_reset_complete";
      await info.attach("OBS03-earned-review-return-reset", { body: JSON.stringify({ qualification: "Real UI extension after the independently preserved earned journey: one optional review QR, readonly transport/return and explicit confirmed reset. No seeded state, runtime API calls or DEV decode hook", endEarned, normalCameraRecords: normalCameras, reviewCameraRecords: reviewCameras, reviewEvidence, preservedPreferences, postReset, preferenceCoverage: "Only preferences actually created by this fresh UI journey are compared; absent optional preferences are not claimed as exercised" }, null, 2), contentType: "application/json" });
      expect(external).toEqual([]); expect(httpErrors).toEqual([]); expect(pageErrors).toEqual([]);
    } finally {
      const music = await page.evaluate(() => { const journal = window.__obs03MusicJournal; journal?.stop(); return journal ? { startedAt: journal.startedAt, samples: journal.samples } : null; });
      const indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
      await info.attach("OBS03-production-journey-evidence", { body: JSON.stringify({ qualification: "Real UI journey, lab canvas camera, real ZXing decoder; not physical camera or paced reading validation", extensionQualification: "Review/reset assertions run only after the earned normal journey passes; finalSnapshot may intentionally be post-reset and is never substituted for endEarned", indexBefore, indexAfter, external, httpErrors, pageErrors, normalScans: evidence, endEarned, reviewEvidence, postReset, music, finalSnapshot: { phase, state: await snapshot(page) } }, null, 2), contentType: "application/json" });
      expect(indexAfter).toBe(indexBefore);
    }
  });
});

const sizes = [{ width: 280, height: 640 }, { width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1920, height: 1080 }, { width: 568, height: 280 }, { width: 844, height: 390 }];
const fixtureScenes = [{ route: "/inicio", root: "main.initial-experience" }, { route: "/portada", root: roots.cover }, { route: "/estacion/1", root: roots[1] }, { route: "/estacion/2", root: roots[2] }, { route: "/estacion/3", root: roots[3] }, { route: "/estacion/4", root: roots[4] }, { route: "/estacion/5", root: roots[5] }, { route: "/final", root: roots.final }];

async function installDeclaredLayoutFixture(page: Page, locale: "es" | "en", world5ConfirmedCount: 1 | 3 = 3) {
  await page.addInitScript(({ language, world5ConfirmedCount }) => {
    // TEST FIXTURE ONLY. These records are fabricated for layout coverage.
    // They are never evidence of a completed visitor journey or UI-earned points.
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const route = location.pathname, isFinal = route === "/final", station = Number(/^\/estacion\/(\d)/.exec(route)?.[1] ?? 0);
    const partial: Record<number, number> = { 1: 3, 2: 2, 3: 1, 4: 0, 5: world5ConfirmedCount };
    const room = (id: keyof typeof order, count: number) => ({ contentRevision: "OBS03.2", presentedStepIds: order[id].slice(0, count), confirmedStepIds: order[id].slice(0, count), assistedPresentedStepIds: [], activeStepId: order[id][count] ?? null, interactionEvidence: [], outcome: id === 4 && count === 4 ? "solved" : null, closed: count === order[id].length });
    const rooms = Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, room(id as 1 | 2 | 3 | 4 | 5, isFinal || (station > id) ? order[id as 1 | 2 | 3 | 4 | 5].length : station === id ? partial[id] : 0)]));
    const prefix = isFinal ? 5 : Math.max(0, station - 1);
    const essential = { schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", station || isFinal ? 4 : route === "/portada" ? 2 : 0), stations: rooms, legacyRouteCredit: prefix, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: isFinal };
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", language); localStorage.setItem("gvo.journey.essential.v1", JSON.stringify(essential));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, i) => i + 1), updatedAt: "2026-10-23T12:00:00.000Z" }));
    const answers = isFinal ? ["plantas", "sistema", "espacio", "visitante"] : station === 5 ? ["plantas", "sistema", "espacio"].slice(0, world5ConfirmedCount) : [];
    localStorage.setItem("gvo.station5.quiz.v1", JSON.stringify({ schemaVersion: 1, correctAnswers: answers, answeredQuestions: answers, skippedQuestions: [] }));
  }, { language: locale, world5ConfirmedCount });
}

test.describe("OBS03 V Sistema art focal · declared fixture before answer", () => {
  for (const size of [{ width: 390, height: 844 }, { width: 568, height: 280 }]) {
    test(`${size.width}×${size.height} es · two system alternatives on final environment`, async ({ page }, info) => {
      await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: "reduce" });
      await installDeclaredLayoutFixture(page, "es", 1); await page.goto("/estacion/5"); await ready(page, roots[5]);
      const room = page.locator(roots[5]), group = room.locator(".s5-quiz-options"), options = group.getByRole("button");
      await expect(room).toHaveAttribute("data-station5-area", "sistema");
      await expect(options).toHaveCount(2); await expect(options.nth(0)).toBeEnabled(); await expect(options.nth(1)).toBeEnabled();
      await expect(options.nth(0).locator("img")).toHaveAttribute("src", /world5_option_system_agree_v03\.webp$/);
      await expect(options.nth(1).locator("img")).toHaveAttribute("src", /world5_option_system_disagree_v03\.webp$/);
      await group.scrollIntoViewIfNeeded();
      const geometry = await group.evaluate((node) => ({ scrollY, viewport: { width: innerWidth, height: innerHeight }, group: node.getBoundingClientRect().toJSON(), alternatives: Array.from(node.querySelectorAll("button")).map((button) => ({ name: button.getAttribute("aria-label"), rect: button.getBoundingClientRect().toJSON(), image: button.querySelector("img")?.currentSrc })) }));
      await page.screenshot({ path: info.outputPath("V-Sistema-before-answer-viewport.png") });
      await capture(page, info, "V-Sistema-before-answer-full-page");
      const state = await snapshot(page); expect(state.quiz.correctAnswers).toEqual(["plantas"]); expect(state.quiz.answeredQuestions).toEqual(["plantas"]); expect(state.progress?.completedStations).toEqual([1, 2, 3, 4]);
      await info.attach("OBS03-V-Sistema-art-before-answer", { body: JSON.stringify({ qualification: "Declared prior-progress fixture for source-art/background comparison at actual CSS size; no answer clicked or earned journey claimed", size, geometry, state }, null, 2), contentType: "application/json" });
    });
  }
});

test.describe("OBS03 IV V visual focal · declared fixtures", () => {
  for (const size of [{ width: 390, height: 844 }, { width: 568, height: 280 }]) for (const locale of ["es", "en"] as const) {
    test(`IV ${size.width}×${size.height} ${locale} · DOM preparation, sticky focus and assisted close`, async ({ page }, info) => {
      await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: "reduce" });
      await installDeclaredLayoutFixture(page, locale); await page.goto("/estacion/4"); await ready(page, roots[4]);
      const room = page.locator(roots[4]), preparation = room.locator(".s4-ordering-preparation"), objects = room.locator("[data-ordering-object]");
      const start = room.getByRole("button", { name: locale === "es" ? "Comenzar" : "Start", exact: true });
      await expect(start).toBeEnabled(); await expect(objects).toHaveCount(8);
      expect(await preparation.evaluate((node) => Boolean(node.compareDocumentPosition(document.querySelector(".s4-ordering-stage")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
      const titleClearance = await room.locator("h1").evaluate((title) => {
        const a = title.getBoundingClientRect(), b = document.querySelector(".gvo-immersive-shell__dock")?.getBoundingClientRect();
        return b ? Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) : 0;
      });
      expect(titleClearance).toBe(0);
      await page.screenshot({ path: info.outputPath("IV-introduction-viewport.png") });
      await start.focus(); await start.click(); await expect(room).toHaveAttribute("data-station4-ordering-phase", "playing");
      await expect(objects.first()).toBeFocused(); await objects.first().click();
      const selected = (await snapshot(page)).ordering;
      await objects.last().focus(); await expect(objects.last()).toBeFocused();
      const focusedLast = await focusedGeometry(page);
      const sticky = await preparation.boundingBox(); expect(sticky).not.toBeNull();
      expect(await preparation.evaluate((node) => getComputedStyle(node).position)).toBe("sticky");
      expect(focusedLast.rect!.y).toBeGreaterThanOrEqual(sticky!.y + sticky!.height - 1);
      expect(focusedLast.rect!.bottom).toBeLessThanOrEqual(size.height + 1);
      await page.screenshot({ path: info.outputPath("IV-last-row-focused-viewport.png") });
      await click(page, roots[4], locale === "es" ? "Pausar" : "Pause");
      await expect(room).toHaveAttribute("data-station4-ordering-phase", "paused");
      const paused = (await snapshot(page)).ordering;
      expect(paused?.permutation).toEqual(selected?.permutation); expect(paused?.selectedObjectId).toBe(selected?.selectedObjectId);
      await click(page, roots[4], locale === "es" ? "Retomar" : "Resume");
      await expect(room).toHaveAttribute("data-station4-ordering-phase", "playing");
      const resumed = (await snapshot(page)).ordering;
      expect(resumed?.permutation).toEqual(paused?.permutation); expect(resumed?.selectedObjectId).toBe(paused?.selectedObjectId);
      expect(resumed!.remainingActiveMs).toBeLessThanOrEqual(paused!.remainingActiveMs);
      expect(resumed!.remainingActiveMs).toBeGreaterThanOrEqual(paused!.remainingActiveMs - 1000);
      await click(page, roots[4], locale === "es" ? "Ayúdame a ordenar" : "Help me arrange them");
      await expect(room).toHaveAttribute("data-station4-ordering-phase", "review");
      for (let index = 0; index < 8; index++) {
        await expect(room.getByText(`${locale === "es" ? "Repaso" : "Review"} ${index + 1}/8`, { exact: true })).toBeVisible();
        await expect(page.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
        if (index < 7) await click(page, roots[4], locale === "es" ? "Siguiente" : "Next");
      }
      await click(page, roots[4], locale === "es" ? "Cerrar" : "Close");
      await expect(page.locator('[data-interstation-qr-action="open"]')).toBeVisible();
      const end = await snapshot(page); expect(end.essential?.stations[4].outcome).toBe("assisted_review_completed");
      expect(end.progress?.completedStations).toEqual([1, 2, 3]);
      await info.attach("OBS03-IV-layout-focus-fixture", { body: JSON.stringify({ qualification: "Declared persisted layout fixture, followed by real game UI; no QR/global credit or physical validation", size, locale, titleClearance, focusedLast, selected, paused, resumed, end }, null, 2), contentType: "application/json" });
    });

    test(`V ${size.width}×${size.height} ${locale} · DOM keyboard, wrong/correct art and skip`, async ({ page }, info) => {
      await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: "reduce" });
      await installDeclaredLayoutFixture(page, locale); await page.goto("/estacion/5"); await ready(page, roots[5]);
      const room = page.locator(roots[5]), unit = room.locator(".s5-question-unit"), title = unit.locator(".s5-question-prompt h2"), group = unit.getByRole("group"), options = group.getByRole("button"), advance = unit.locator(".s5-quiz-advance"), feedback = unit.locator(".s5-quiz-feedback");
      await expect(room).toHaveAttribute("data-station5-area", "visitante"); await expect(options).toHaveCount(2); await expect(options.first()).toBeEnabled();
      const domOrder = await unit.evaluate((node) => {
        const prompt = node.querySelector(".s5-question-prompt")!, scene = node.querySelector(".s5-quiz-scene")!, response = node.querySelector(".s5-question-response")!;
        return Boolean(prompt.compareDocumentPosition(scene) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(scene.compareDocumentPosition(response) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      expect(domOrder).toBe(true); await expect(group).toHaveAccessibleName(/\S/);
      const focusRecords = [];
      await title.focus(); focusRecords.push(await focusedGeometry(page));
      for (const target of [options.nth(0), options.nth(1), advance]) { await page.keyboard.press("Tab"); await expect(target).toBeFocused(); focusRecords.push(await focusedGeometry(page)); }
      await expect(advance).toHaveText(locale === "es" ? "Pasar pregunta" : "Pass question");
      await options.nth(1).click(); await expect(feedback).toContainText(locale === "es" ? "Esta respuesta no es correcta." : "This answer is incorrect.");
      await expect(options).toHaveCount(2); await expect(advance).toHaveCount(1); expect((await snapshot(page)).quiz.correctAnswers).toHaveLength(3);
      await options.nth(0).click(); await expect(options.nth(0)).toBeDisabled(); await expect(options.nth(1)).toBeDisabled(); await expect(feedback).toBeFocused(); await expect(feedback).toHaveAttribute("aria-live", "off");
      for (const option of await options.all()) expect(await option.evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1);
      const correct = await snapshot(page); expect(correct.quiz.correctAnswers).toEqual(["plantas", "sistema", "espacio", "visitante"]);
      await page.screenshot({ path: info.outputPath("V-correct-feedback-viewport.png") });
      // Reload reapplies the declared fixture; this separate omission is not earned credit.
      await page.reload(); await ready(page, roots[5]); await expect(advance).toBeEnabled(); await advance.click();
      await expect(room).toHaveAttribute("data-station5-area", "resultado");
      const skipped = await snapshot(page); expect(skipped.quiz.correctAnswers).toHaveLength(3); expect(skipped.quiz.skippedQuestions).toContain("visitante"); expect(skipped.progress?.completedStations).toEqual([1, 2, 3, 4]);
      await info.attach("OBS03-V-layout-focus-fixture", { body: JSON.stringify({ qualification: "Declared persisted layout fixture, real keyboard/answer/skip UI afterwards; no earned journey or physical validation", size, locale, domOrder, focusRecords, correct, skipped }, null, 2), contentType: "application/json" });
    });
  }
});

test.describe("OBS03 responsive smoke · synthetic declared fixtures, no earned-journey claim", () => {
  for (const size of sizes) for (const locale of ["es", "en"] as const) {
    test(`${size.width}×${size.height} ${locale} · eight fixture scenes`, async ({ page }, info) => {
      test.setTimeout(240_000); await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: "reduce" });
      await installDeclaredLayoutFixture(page, locale);
      const records: unknown[] = [];
      for (const scene of fixtureScenes) {
        await page.goto(scene.route); await ready(page, scene.root);
        if (scene.route === "/estacion/1") { const more = page.locator(scene.root).getByRole("button", { name: locale === "es" ? "+ Más" : "+ More", exact: true }); await expect(more).toBeEnabled(); await more.click(); }
        const result = await page.locator(scene.root).evaluate((root) => {
          const images = Array.from(root.querySelectorAll<HTMLImageElement>("img")).filter((image) => image.getBoundingClientRect().width > 0 && getComputedStyle(image).display !== "none");
          const controls = Array.from(root.querySelectorAll<HTMLElement>("button,input,select,textarea")).filter((node) => node.getBoundingClientRect().width > 0 && !node.closest('[aria-hidden="true"],[inert]'));
          return { route: location.pathname, innerWidth, scrollWidth: document.documentElement.scrollWidth, language: document.documentElement.lang, brokenImages: images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.currentSrc || image.src), controls: controls.map((node) => { const r = node.getBoundingClientRect(); return { label: node.getAttribute("aria-label") ?? node.textContent?.trim(), x: r.x, y: r.y, width: r.width, height: r.height }; }) };
        });
        records.push(result); expect(result.language).toBe(locale); expect(result.scrollWidth).toBeLessThanOrEqual(size.width + 1); expect(result.brokenImages).toEqual([]);
        for (const control of result.controls) { expect(control.x, `${scene.route}: ${control.label}`).toBeGreaterThanOrEqual(-1); expect(control.x + control.width, `${scene.route}: ${control.label}`).toBeLessThanOrEqual(size.width + 1); expect(control.height, `${scene.route}: ${control.label}`).toBeGreaterThanOrEqual(44); }
        await capture(page, info, `fixture-${scene.route.replaceAll("/", "_")}-${locale}-${size.width}x${size.height}`);
      }
      await info.attach("OBS03-declared-responsive-fixtures", { body: JSON.stringify({ qualification: "Synthetic persisted shapes for layout only. No earned progression, actual visitor score or physical validation claimed.", size, locale, scenes: records }, null, 2), contentType: "application/json" });
    });
  }
});

async function installDeclaredWorld2ExitFixture(page: Page, locale: "es" | "en", mode: "closing" | "review", text200: boolean) {
  type State = Awaited<ReturnType<typeof snapshot>>;
  const source = JSON.parse(readFileSync(new URL("../../docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-source/production-journey.json", import.meta.url), "utf8")) as { endEarned: State; normalScans: Array<{ after: State }> };
  const state = structuredClone(mode === "review" ? source.endEarned : source.normalScans[0].after);
  if (mode === "closing") {
    const completed = source.endEarned.essential!.stations[2];
    state.essential!.stations[2] = { ...completed, presentedStepIds: completed.presentedStepIds.filter((id) => id !== "musica"), confirmedStepIds: completed.confirmedStepIds.filter((id) => id !== "musica"), activeStepId: "musica", closed: false };
  }
  await page.addInitScript(({ language, state, text200 }) => {
    // SYNTHETIC test access/checkpoint derived from the real preserved build06 attachment.
    // It qualifies only closing/review layout; never an earned visitor journey.
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", language);
    for (const [key,value] of [["gvo.journey.essential.v1",state.essential],["gvo.progress.v1",state.progress],["gvo.station4.ordering.v1",state.ordering],["gvo.station5.quiz.v1",state.quiz]] as const) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2",state.legacyPracticeRaw);
    if (text200) {
      const apply = () => document.documentElement.style.fontSize = "200%";
      if (document.documentElement) apply(); else new MutationObserver((_, observer) => { if(document.documentElement) { apply(); observer.disconnect(); } }).observe(document, {childList:true,subtree:true});
    }
  }, { language: locale, state, text200 });
}

test.describe("OBS03 II exit flow focal · declared closing/review fixtures", () => {
  for (const profile of [{ width: 390, height: 844, text200: false }, { width: 568, height: 280, text200: false }, { width: 390, height: 844, text200: true }]) for (const locale of ["es", "en"] as const) {
    test(`${profile.width}×${profile.height} ${locale} text${profile.text200 ? 200 : 100} · native close and readonly QR do not cover scene text`, async ({ page }, info) => {
      const records = [];
      for (const mode of ["closing", "review"] as const) {
        const scenePage = mode === "closing" ? page : await page.context().newPage();
        await scenePage.setViewportSize(profile); await scenePage.emulateMedia({reducedMotion:"reduce"});
        await installDeclaredWorld2ExitFixture(scenePage,locale,mode,profile.text200);
        if (mode === "closing") {
          await scenePage.goto("/estacion/2"); await ready(scenePage,roots[2]);
          expect((await snapshot(scenePage)).essential?.stations[2].closed).toBe(false);
          await expect(scenePage.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
          const close = scenePage.locator(roots[2]).getByRole('button',{name:locale === "es" ? "Cerrar Música" : "Close Music",exact:true});
          await expect(close).toBeEnabled(); await close.click();
          await expect(scenePage.locator('[data-interstation-qr-action="open"]')).toBeVisible();
          expect((await snapshot(scenePage)).essential?.stations[2].closed).toBe(true);
          expect((await snapshot(scenePage)).progress?.completedStations).toEqual([1]);
        } else {
          await scenePage.goto("/final"); await ready(scenePage,roots.final);
          await scenePage.locator(`${roots.final} a[data-final-access-id="ii"]`).click();
          await expect(scenePage).toHaveURL(/\/estacion\/2$/); await ready(scenePage,roots[2]);
          await expect(scenePage.locator('.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="2"]')).toBeVisible();
        }
        const initialHeader = await world2InitialHeaderGeometry(scenePage, info, mode);
        const before = await snapshot(scenePage), geometry = await world2ExitGeometry(scenePage, info, mode), after = await snapshot(scenePage);
        expect(earnedFacts(after)).toEqual(earnedFacts(before));
        expect(geometry.rootFontPx).toBe(profile.text200 ? 32 : 16);
        await capture(scenePage, info, `II-${locale}-${profile.width}x${profile.height}-text${profile.text200 ? 200 : 100}-${mode}-exit-flow`);
        records.push({mode,initialHeader,geometry,before,after,earnedFactsUnchanged:true});
        await scenePage.close();
      }
      await info.attach("OBS03-II-exit-flow-declared-fixtures",{body:JSON.stringify({qualification:"SYNTHETIC closing/review layout checkpoints derived from the real preserved build06 earned attachment. Native manual Music close and Mirador readonly UI access, zero overlap/hitpoint/facts checks; not an unseeded journey, camera/QR decoder or physical device proof.",locale,profile,records},null,2),contentType:"application/json"});
    });
  }
});

async function world2ReviewOverflowDiagnostic(page: Page) {
  return page.evaluate(() => {
    const cssFields=['display','position','width','minWidth','maxWidth','height','minHeight','maxHeight','overflow','overflowX','overflowY','left','right','top','bottom','inset','transform','transformOrigin','transition','animation','animationName','opacity','visibility','whiteSpace','overflowWrap','fontSize','gridTemplateColumns','gridTemplateRows','contain','filter','paddingLeft','paddingRight','marginLeft','marginRight'] as const;
    const describe=(node:Element)=>{const r=node.getBoundingClientRect(),css=getComputedStyle(node),h=node as HTMLElement;return {tag:node.tagName,id:node.id,className:node.getAttribute('class'),text:node.textContent?.trim().slice(0,160),rect:r.toJSON(),clientWidth:h.clientWidth,scrollWidth:h.scrollWidth,offsetWidth:h.offsetWidth,styles:Object.fromEntries(cssFields.map(k=>[k,css[k]]))};};
    const all=Array.from(document.querySelectorAll('*')).filter(n=>{const r=n.getBoundingClientRect();return r.width>.5&&(r.left<-.5||r.right>innerWidth+.5);});
    const offenders=all.map(node=>{const ancestors=[];let p=node.parentElement;while(p){ancestors.push(describe(p));p=p.parentElement;}return {...describe(node),ancestors};});
    const pseudoDecorations=Array.from(document.querySelectorAll('.world2-dialogue__title')).map(title=>{
      const r=title.getBoundingClientRect(),css=getComputedStyle(title,'::after'),matrix=new DOMMatrixReadOnly(css.transform==='none'?undefined:css.transform);
      return {title:describe(title),pseudo:'::after',computed:Object.fromEntries(['content','position','width','height','left','right','top','bottom','inset','transform','transformOrigin','opacity','animation','animationName','animationDuration','animationFillMode','overflow'].map(key=>[key,css.getPropertyValue(key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()))])),pureTranslate:matrix.a===1&&matrix.b===0&&matrix.c===0&&matrix.d===1,derivedBorderRightForPureTranslate:r.left+parseFloat(css.left)+parseFloat(css.width)+matrix.m41};
    });
    return {at:performance.now(),url:location.href,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},scroll:{x:scrollX,y:scrollY},widths:{document:document.documentElement.scrollWidth,body:document.body.scrollWidth,client:document.documentElement.clientWidth},rootFontPx:parseFloat(getComputedStyle(document.documentElement).fontSize),hovered:Array.from(document.querySelectorAll(':hover')).map(n=>({tag:n.tagName,className:n.getAttribute('class')})),activeElement:document.activeElement?describe(document.activeElement):null,stylesheets:Array.from(document.styleSheets).map(s=>s.href),offenderCount:offenders.length,offenders,pseudoDecorations};
  });
}

test.describe("OBS03 II review QR overflow diagnostic · declared earned fixture",()=>{
  test("390 es no-preference · Mirador to I to production QR to II, passive offenders",async({page},info)=>{
    await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:"no-preference"});
    await installCanvasCamera(page);await installDeclaredWorld2ExitFixture(page,"es","review",false);
    await page.goto("/final");await ready(page,roots.final);
    await page.locator(`${roots.final} a[data-final-access-id="i"]`).click();await expect(page).toHaveURL(/\/estacion\/1$/);await ready(page,roots[1]);
    const before=await snapshot(page);const qr=page.locator('[data-interstation-qr-action="open"]');await expect(qr).toBeEnabled();await qr.click();
    await expect(page.locator('[data-interstation-qr-gate="active"] video')).toBeVisible();
    await expect(page).toHaveURL(/\/estacion\/2$/,{timeout:30_000});await ready(page,roots[2]);
    await expect(page.locator('.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="2"]')).toBeVisible();
    const samples=[];
    samples.push({phase:"ready-before-idle",diagnostic:await world2ReviewOverflowDiagnostic(page)});
    await page.screenshot({path:info.outputPath('II-QR-diagnostic-ready-viewport.png')});
    // A measured finite idle window separates transient arrival overflow from stable layout.
    const idleWidths=await page.evaluate(async()=>{const samples=[];const start=performance.now();while(performance.now()-start<1200){samples.push({ms:performance.now()-start,width:document.documentElement.scrollWidth});await new Promise(requestAnimationFrame);}return samples;});
    samples.push({phase:"after1200ms-idle",diagnostic:await world2ReviewOverflowDiagnostic(page)});
    await page.screenshot({path:info.outputPath('II-QR-diagnostic-after-idle-viewport.png')});
    // Authorized QA-only causal probe; remove/restore only this decoration, never ship this style.
    const causalProbe=[];
    await page.evaluate(()=>{const style=document.createElement('style');style.id='obs03-causal-title-sweep';style.textContent='.world2-dialogue__title::after { content:none !important; }';document.head.append(style);});
    causalProbe.push({phase:'only-title-after-content-none',diagnostic:await world2ReviewOverflowDiagnostic(page)});
    await page.evaluate(()=>document.querySelector('#obs03-causal-title-sweep')?.remove());
    causalProbe.push({phase:'original-title-after-restored',diagnostic:await world2ReviewOverflowDiagnostic(page)});
    const after=await snapshot(page);expect(earnedFacts(after)).toEqual(earnedFacts(before));
    await info.attach('OBS03-II-review-QR-overflow-diagnostic',{body:JSON.stringify({qualification:"DECLARED actual earned-shape fixture, not a fresh full journey. Native Mirador→I and one canvas-camera/production-ZXing QR→II. Passive DOM offenders/ancestry/computedCSS before/after finite1200ms idle. AuthorizedQA-only stylesheet removes only title::after content then restores it before unchanged final assertions. No app/source/state/guard mutation; not a forcedPASS.",samples,idleWidths,causalProbe,before,after,earnedFactsUnchanged:true},null,2),contentType:"application/json"});
    const geometry=await world2ExitGeometry(page,info,"readonly-QR-diagnostic");
    await info.attach('OBS03-II-review-QR-overflow-final-geometry',{body:JSON.stringify(geometry,null,2),contentType:"application/json"});
  });
});

async function installPassiveWorld2NaturalSweepJournal(page: Page) {
  await page.addInitScript(() => {
    let current: Element | null = null, running=true, frame=0;
    const journal: World2SweepJournal={samples:[],segmentCount:0,lastSegmentStartedAt:0,stop:()=>{running=false;cancelAnimationFrame(frame);}};
    window.__obs03World2SweepJournal=journal;
    const sample=()=>{
      if(!running)return;
      const title=document.querySelector('.world2-root-screen .world2-dialogue__title'),now=performance.now();
      if(title){
        if(title!==current){current=title;journal.segmentCount++;journal.lastSegmentStartedAt=now;}
        const elapsed=now-journal.lastSegmentStartedAt;
        if(elapsed<=1800){const pseudo=getComputedStyle(title,'::after');journal.samples.push({at:now,segmentId:journal.segmentCount,segmentMs:elapsed,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,viewportWidth:innerWidth,titleText:title.textContent,titleWidth:title.getBoundingClientRect().width,pseudoWidth:parseFloat(pseudo.width),transform:pseudo.transform,opacity:Number(pseudo.opacity),animationName:pseudo.animationName,animationDuration:pseudo.animationDuration,backgroundPosition:pseudo.backgroundPosition,backgroundSize:pseudo.backgroundSize,active:title.closest('.gvo-prepared-tree')?.getAttribute('data-journey-active')==='true',visible:document.visibilityState,roomState:title.closest('main')?.getAttribute('data-world2-state')??null});}
      }else current=null;
      frame=requestAnimationFrame(sample);
    };
    frame=requestAnimationFrame(sample);
  });
}
async function finishWorld2NaturalSweepJournal(page: Page, info: TestInfo, phase: string) {
  await page.waitForFunction(()=>{const j=window.__obs03World2SweepJournal;return !!j&&j.segmentCount>0&&performance.now()-j.lastSegmentStartedAt>=1700;});
  const result=await page.evaluate(()=>{const j=window.__obs03World2SweepJournal!;j.stop();return {samples:j.samples,segmentCount:j.segmentCount,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches};});
  await info.attach(`OBS03-II-natural-sweep-${phase}`,{body:JSON.stringify({phase,...result,qualification:"Passive requestAnimationFrame samples of actual title DOM segments during/after the1080ms sweep. Declared access fixture, real native close/review UI; no stylesheet probe, fake clock, animation restart or forcedready. Visible/active flags retained; geometry/motion is not paced human reading."},null,2),contentType:"application/json"});
  expect(result.reducedMotion).toBe(false);expect(result.samples.length).toBeGreaterThan(1);
  for(const frame of result.samples){expect(frame.documentWidth,`${phase} segment${frame.segmentId} ms${frame.segmentMs}`).toBeLessThanOrEqual(frame.viewportWidth);expect(frame.bodyWidth).toBeLessThanOrEqual(frame.viewportWidth);expect(frame.transform).toBe('none');expect(Math.abs(frame.pseudoWidth-frame.titleWidth)).toBeLessThanOrEqual(1);}
  const segments=[...new Set(result.samples.map(s=>s.segmentId))];
  for(const id of segments){const frames=result.samples.filter(s=>s.segmentId===id);expect(Math.max(...frames.map(f=>f.segmentMs))).toBeGreaterThanOrEqual(1080);expect(frames.some(f=>f.animationName==='world2-dialogue-electric-sweep')).toBe(true);}
  return result;
}
test.describe('OBS03 II natural sweep focal · declared closing/review fixtures',()=>{
  for(const locale of ['es','en'] as const)test(`390×844 ${locale} no-preference · bounded sweep during and after native close and review`,async({page},info)=>{
    const records=[];
    for(const mode of ['closing','review'] as const){
      const scenePage=mode==='closing'?page:await page.context().newPage();
      await scenePage.setViewportSize({width:390,height:844});await scenePage.emulateMedia({reducedMotion:'no-preference'});
      await installPassiveWorld2NaturalSweepJournal(scenePage);await installDeclaredWorld2ExitFixture(scenePage,locale,mode,false);
      if(mode==='closing'){
        await scenePage.goto('/estacion/2');await ready(scenePage,roots[2]);
        const close=scenePage.locator(roots[2]).getByRole('button',{name:locale==='es'?'Cerrar Música':'Close Music',exact:true});await expect(close).toBeEnabled();await close.click();await expect(scenePage.locator('[data-interstation-qr-action="open"]')).toBeVisible();
      }else{
        await scenePage.goto('/final');await ready(scenePage,roots.final);await scenePage.locator(`${roots.final} a[data-final-access-id="ii"]`).click();await expect(scenePage).toHaveURL(/\/estacion\/2$/);await ready(scenePage,roots[2]);await expect(scenePage.locator('.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="2"]')).toBeVisible();
      }
      const journal=await finishWorld2NaturalSweepJournal(scenePage,info,mode);
      if(mode==='closing'){expect(journal.segmentCount).toBeGreaterThanOrEqual(2);expect(journal.samples.some(s=>s.active&&s.visible==='visible'&&s.opacity>.01)).toBe(true);}
      const before=await snapshot(scenePage),header=await world2InitialHeaderGeometry(scenePage,info,`natural-${mode}`),geometry=await world2ExitGeometry(scenePage,info,`natural-${mode}`),after=await snapshot(scenePage);
      expect(earnedFacts(after)).toEqual(earnedFacts(before));
      records.push({mode,journal,header,geometry,before,after,earnedFactsUnchanged:true});await scenePage.close();
    }
    await info.attach('OBS03-II-natural-sweep-declared-fixtures',{body:JSON.stringify({qualification:"Two natural-motion ES/EN layout cases use declared access/checkpoints, not a fresh journey. Each captures real DOM sweep during/after native Music close and readonly UI entry fromMirador. No temporary stylesheet/animation manipulation in these regression cases.",locale,records},null,2),contentType:'application/json'});
  });
});
