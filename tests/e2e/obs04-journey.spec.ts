import { createHash } from "node:crypto";
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
type TransitionSample = { at: number; id: string; motion: string | null; opacity: number; allImagesReady: boolean; portalOpacity: number; liaOpacity: number; progress: string | null };
declare global { interface Window { __obs03CameraLab?: CameraLab; __obs03MusicJournal?: MusicJournal; __obs03World2SweepJournal?: World2SweepJournal; __obs04TransitionSamples?: TransitionSample[]; } }

async function installTransitionJournal(page: Page) {
  await page.addInitScript(() => {
    window.__obs04TransitionSamples = [];
    const opacity = (node: Element | null) => {
      if (!node) return 0;
      let result = 1;
      for (let n: Element | null = node; n; n = n.parentElement) {
        const css = getComputedStyle(n);
        if (css.display === 'none' || css.visibility === 'hidden') return 0;
        result *= Number(css.opacity);
      }
      return result;
    };
    let last = 0;
    const sample = (now: number) => {
      if (now - last >= 60) {
        last = now;
        for (const main of document.querySelectorAll('[data-transition-world-variant="runtime"]')) {
          const images = Array.from(main.querySelectorAll('img')).filter(img => img.getBoundingClientRect().width > 0 && getComputedStyle(img).display !== 'none');
          window.__obs04TransitionSamples!.push({ at: now, id: main.getAttribute('data-transition-world-id')!, motion: main.getAttribute('data-motion-state'), opacity: opacity(main.querySelector(':scope > section')), allImagesReady: images.length > 0 && images.every(img => img.complete && img.naturalWidth > 0), portalOpacity: opacity(main.querySelector('[data-testid="transition-world-portal"]')), liaOpacity: opacity(main.querySelector('[data-testid="transition-world-lia-sprite"]')), progress: main.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') ?? null });
        }
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}
async function captureTransition(page: Page, info: TestInfo, id: string) {
  const main = page.locator('[data-transition-world-variant="runtime"]');
  await expect(main).toBeVisible();
  await expect(main).toHaveAttribute('data-shell-assets-ready', 'true');
  await expect(main).toHaveAttribute('data-motion-state', 'runtime-sequence');
  const observed = await main.evaluate(node => ({id:node.getAttribute('data-transition-world-id'), at:performance.now()}));
  // Wait for a passive sample of THIS live stage after observing its runtime
  // state. The global last sample can still belong to waiting/the previous room.
  await expect.poll(() => page.evaluate(({id,at}) => window.__obs04TransitionSamples?.some(sample=>sample.id===id&&sample.at>=at&&['runtime-sequence','holding'].includes(sample.motion??''))??false, observed)).toBe(true);
  const beforeScreenshot = await main.evaluate(node=>({id:node.getAttribute('data-transition-world-id'),motion:node.getAttribute('data-motion-state'),at:performance.now()}));
  await page.screenshot({path:info.outputPath(`transition-${id}-viewport.png`), fullPage:false});
  const record = await page.evaluate(({id,at}) => ({sample:window.__obs04TransitionSamples?.find(sample=>sample.id===id&&sample.at>=at&&['runtime-sequence','holding'].includes(sample.motion??'')),atAfterScreenshot:performance.now(),currentStageId:document.querySelector('[data-transition-world-variant="runtime"]')?.getAttribute('data-transition-world-id')??null}), observed);
  const sample = record.sample;
  await info.attach(`OBS04-transition-${id}-paint`, { body: JSON.stringify({qualification:'Actual uninterrupted fresh UI transition; passive per-frame styles and PNG, no readiness/clock/CSS override. Sample is bound to the observed stage and time; screenshot interval is retained even if native delivery completes during capture.',observed,beforeScreenshot,...record},null,2),contentType:'application/json' });
  expect(sample?.id).toBe(observed.id);
  expect(sample?.opacity).toBeGreaterThanOrEqual(.9); expect(sample?.allImagesReady).toBe(true);
  // R4: retain the early witness and also observe the designed middle frame.
  // This waits in the real timeline; it never changes readiness or animation.
  await page.waitForFunction(({id,notBefore}) => {
    const stage=document.querySelector('[data-transition-world-variant="runtime"]');
    const lia=stage?.querySelector('[data-testid="transition-world-lia-sprite"]');
    return performance.now()>=notBefore&&stage?.getAttribute('data-transition-world-id')===id&&!!lia&&Number(getComputedStyle(lia).opacity)>=.8;
  },{id:observed.id,notBefore:observed.at+1100},{timeout:2000});
  const middle = await main.evaluate(node => {
    const lia=node.querySelector<HTMLElement>('[data-testid="transition-world-lia-sprite"]')!;
    let opacity=1;for(let current:Element|null=lia;current;current=current.parentElement){const css=getComputedStyle(current);opacity*=css.display==='none'||css.visibility==='hidden'?0:Number(css.opacity);}
    return {at:performance.now(),id:node.getAttribute('data-transition-world-id'),motion:node.getAttribute('data-motion-state'),viewport:{width:innerWidth,height:innerHeight},liaOpacity:opacity,liaRect:lia.getBoundingClientRect().toJSON(),layers:Array.from(lia.querySelectorAll<HTMLElement>('*')).map(layer=>({className:layer.className,background:getComputedStyle(layer).backgroundImage,rect:layer.getBoundingClientRect().toJSON()})).filter(layer=>layer.background!=='none')};
  });
  expect(middle.id).toBe(observed.id); expect(middle.liaOpacity).toBeGreaterThanOrEqual(.8);
  await page.screenshot({path:info.outputPath(`transition-${id}-middle-viewport.png`),fullPage:false,scale:'css'});
  const afterMiddle=await main.evaluate(node=>({at:performance.now(),id:node.getAttribute('data-transition-world-id'),motion:node.getAttribute('data-motion-state')}));
  expect(afterMiddle.id).toBe(observed.id);
  await info.attach(`OBS04-R4-transition-${id}-middle-native`,{body:JSON.stringify({qualification:'Additional native viewport around1100ms after observing this live stage; no fake clock, speed, CSS or readiness mutation. One sampled middle frame is not whole-animation pixel certification.',observed,middle,afterMiddle},null,2),contentType:'application/json'});
}

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
  if (root === roots[4] && await page.locator("[data-station4-explanation-step]").count() === 0) {
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
  return page.evaluate(({ essential, progress }) => ({ essential: JSON.parse(localStorage.getItem(essential) ?? "null") as VerifiedEssentialSnapshot | null, progress: JSON.parse(localStorage.getItem(progress) ?? "null") as { completedStations: number[] } | null, explanation: JSON.parse(localStorage.getItem("gvo.station4.explanation.v1") ?? "null"), legacyPracticeRaw: localStorage.getItem("gvo.station3.practice.v2"), ordering: JSON.parse(localStorage.getItem("gvo.station4.ordering.v1") ?? "null") as World4OrderingState | null, quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1") ?? "null"), camera: window.__obs03CameraLab ?? null }), { essential: ESSENTIAL, progress: PROGRESS });
}
async function scanNext(page: Page, world: 1 | 2 | 3 | 4, evidence: unknown[], info: TestInfo) {
  // Close writes are asynchronous. Await their real UI guard, then assert its
  // stored proof; never race a legitimate in-flight write with an early snapshot.
  const gate = page.locator('[data-interstation-qr-action="open"]'); await expect(gate).toBeVisible(); await expect(gate).toBeEnabled();
  const before = await snapshot(page);
  expect(before.essential?.stations[world].closed).toBe(true);
  expect(before.progress?.completedStations ?? []).toEqual(Array.from({ length: world - 1 }, (_, i) => i + 1));
  await gate.click();
  await expect(page.locator('[data-interstation-qr-gate="active"] video')).toBeVisible();
  await captureTransition(page, info, `${world}-to-${world + 1}`);
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
  // preparation curtain during capture. Keep the native viewport unchanged.
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
    // In fresh02 the native1×1 resize occurred inside the beyond-viewport
    // capture interval; use viewport-only evidence without changing guards.
  } catch (error) { shotError=error; }
  const journal = await page.evaluate(() => (window as Window & {__obs03CaptureJournal?: {stop:()=>Array<{active:string|null|undefined;curtain:boolean;visible:string;width:number;height:number}>}}).__obs03CaptureJournal!.stop());
  await info.attach(`${name}-capture-continuity`,{body:JSON.stringify({qualification:'Passive DOM/event journal; no readiness, CSS, viewport or semantic mutation injected. A curtain/inactive sample is a failure, never silently recaptured.',journal},null,2),contentType:'application/json'});
  expect(journal.filter(sample=>sample.active!=='true'||sample.curtain||sample.visible!=='visible')).toEqual([]);
  expect(journal.every(sample=>sample.width===journal[0].width&&sample.height===journal[0].height)).toBe(true);
  if(shotError)throw shotError;
}

function earnedFacts(state: Awaited<ReturnType<typeof snapshot>>) {
  // Revision and pendingTransition are technical transport, not new earned facts.
  return { progress: state.progress, cover: state.essential?.cover, stations: state.essential?.stations, finalReached: state.essential?.finalReached, quiz: state.quiz, ordering: state.ordering, explanation: state.explanation, legacyPracticeRaw: state.legacyPracticeRaw };
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
  await info.attach("OBS04-Music-natural-sequence-journal", { body: JSON.stringify({ qualification: "Real UI stage screenshots and passive DOM observation during the existing natural sequence; no assisted result, fake clock, audio, paced reading or physical performance claim", source: "src/screens/World2Root/World2MediatedResultPanel.tsx:stageSequence", sourceStageDelaysMs: [2100, 4200, 6300], sourceCompletionMs: 9000, frames, journal }, null, 2), contentType: "application/json" });
}

test.describe("OBS04 production journey · earned through UI", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  test("fresh entry → five rooms → Lookout, four real decoder scans, no seeded progress", async ({ page, baseURL }, info) => {
    test.setTimeout(240_000);
    await installCanvasCamera(page);
    await installTransitionJournal(page);
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
      // R2 permits resource proof by15s plus a complete12s visible presentation.
      await expect(page.locator('[data-language-option="es"]')).toBeEnabled({ timeout: 35_000 });
      expect(await page.evaluate(() => window.__obs03CameraLab?.initialLocalKeys)).toEqual([]);
      expect(await page.evaluate(() => "__GVO_QR_TEST_MODE__" in window)).toBe(false);
      await page.locator('[data-language-option="es"]').click();
      await page.locator('[data-initial-experience-action="start"]').click();
      await expect(page).toHaveURL(/\/portada$/); await ready(page, roots.cover);
      await click(page, roots.cover, "Empieza aquí");
      for (let i = 0; i < 3; i++) await click(page, roots.cover, "Siguiente diálogo de Lía");
      await click(page, roots.cover, "¡Adelante!"); await capture(page, info, "00-cover-essential-closed");
      await click(page, roots.cover, "Sala I · Raíz, lista para abrir.");
      await captureTransition(page, info, 'cover-to-1');
      await expect(page).toHaveURL(/\/estacion\/1$/); await ready(page, roots[1]);
      expect(await page.locator('[data-interstation-qr-action="open"]').count()).toBe(0);
      await capture(page, info, "01-root-initial");
      for (let i = 0; i < 3; i++) await click(page, roots[1], "Continuar");
      await click(page, roots[1], "Cerrar"); await scanNext(page, 1, evidence, info);

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
      await info.attach("OBS04-II-normal-close-exit-geometry", { body: JSON.stringify({ qualification: "Actual unseeded journey after manual Music close; QR focus/hitpoints and zero intersection with scene/dialogue text", geometry: normalExitGeometry }, null, 2), contentType: "application/json" });
      const pulse = await snapshot(page);
      expect(pulse.essential?.stations[2].interactionEvidence.filter((fact) => fact.kind === "capture_step").map((fact) => fact.id)).toEqual(["contact", "signal", "system"]);
      await scanNext(page, 2, evidence, info);

      await capture(page, info, "03-original-notebook-index");
      const intro = page.locator(roots[3]).getByRole("button", { name: /^Página 1 de 3/ }); await expect(intro).toBeEnabled(); await intro.click();
      for (let leaf = 1; leaf < 4; leaf++) {
        await page.locator('[data-station3-folio-next]').click();
        await expect(page.locator('[data-station3-page-turn]')).toHaveCount(0);
        await expect(page.locator('.s3-practice-paper')).toHaveAttribute('aria-busy', 'false');
        expect((await snapshot(page)).essential?.stations[3].confirmedStepIds).toEqual([]);
        await capture(page, info, `03-intro-leaf-${leaf + 1}`);
      }
      await click(page, roots[3], "PASO A PASO →");
      await expect(page.locator(`${roots[3]} [data-station3-page="prototipo"]`).getByRole("heading", { name: "PASO A PASO", exact: true })).toBeVisible();
      await expect(page.locator(`${roots[3]} [data-station3-page-turn]`)).toHaveCount(0);
      await capture(page, info, "03-notebook-practice-optional");
      await page.locator('[data-station3-folio-next]').click();
      await expect(page.locator('[data-station3-page-turn]')).toHaveCount(0);
      await expect(page.locator('.s3-practice-paper')).toHaveAttribute('aria-busy', 'false');
      expect((await snapshot(page)).essential?.stations[3].confirmedStepIds).toEqual(['INTRO']);
      await capture(page, info, "03-practice-leaf-2");
      await click(page, roots[3], "BENEFICIOS →");
      await expect(page.locator(`${roots[3]} [data-station3-page="senal"]`).getByRole("heading", { name: "BENEFICIOS", exact: true })).toBeVisible();
      await expect(page.locator('[data-station3-page-turn]')).toHaveCount(0);
      await capture(page, info, "03-benefits-leaf");
      await click(page, roots[3], "Cerrar cuaderno");
      expect((await snapshot(page)).legacyPracticeRaw).toBeNull(); await scanNext(page, 3, evidence, info);

      for (const [index, id] of ['planta','bionosificador','esp32','midi','wifi_udp','router','sistema_central','sonido'].entries()) {
        await expect(page.locator('[data-station4-explanation-step]')).toHaveAttribute('data-station4-explanation-step', id);
        await expect(page.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
        expect((await snapshot(page)).ordering).toBeNull();
        await capture(page, info, `04-tour-${index + 1}-${id}`);
        await click(page, roots[4], index < 7 ? 'Siguiente' : 'Continuar al juego');
      }
      await expect(page.locator('[data-station4-explanation-step]')).toHaveCount(0);
      await expect(page.locator(roots[4]).getByRole('button', {name:'Comenzar',exact:true})).toBeEnabled();
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
      expect((await snapshot(page)).essential?.stations[4].outcome).toBe("assisted_review_completed"); await scanNext(page, 4, evidence, info);

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
      await captureTransition(page, info, '5-to-lookout');
      await expect(page).toHaveURL(/\/final$/); await ready(page, roots.final); await capture(page, info, "06-lookout-normal-arrival");
      const end = await snapshot(page);
      expect(end.progress?.completedStations).toEqual([1, 2, 3, 4, 5]); expect(end.essential?.finalReached).toBe(true);
      expect(end.quiz.correctAnswers).toEqual(["plantas", "sistema", "espacio", "visitante"]);
      expect(end.camera?.records.filter((record) => record.payload).map((record) => record.payload)).toEqual(["/qr/w2", "/qr/w3", "/qr/w4", "/qr/w5"]);
      expect(end.camera?.records.every((record) => record.ended && record.audio === false)).toBe(true);
      expect(end.camera?.errors).toEqual([]); expect(external).toEqual([]); expect(httpErrors).toEqual([]); expect(pageErrors).toEqual([]);
      const transitionJournal = await page.evaluate(() => window.__obs04TransitionSamples);
      await info.attach('OBS04-six-natural-transition-timelines',{body:JSON.stringify({qualification:'Passive60ms cadence samples of six real fresh UI stages; no synthetic visibility, speedup or clock override.',samples:transitionJournal},null,2),contentType:'application/json'});
      const transitionIds = [...new Set(transitionJournal?.map(sample => sample.id))];
      expect(transitionIds).toHaveLength(6);
      for (const id of transitionIds) {
        const painted = transitionJournal!.filter(s => s.id === id && ['runtime-sequence','holding'].includes(s.motion ?? '') && s.opacity >= .9 && s.allImagesReady);
        expect(painted.length).toBeGreaterThan(10);
        expect(painted.at(-1)!.at - painted[0].at, `visible stage span ${id}`).toBeGreaterThanOrEqual(2100);
        expect(Math.max(...painted.map(s=>s.portalOpacity))).toBeGreaterThanOrEqual(.8);
        expect(Math.max(...painted.map(s=>s.liaOpacity))).toBeGreaterThanOrEqual(.8);
      }
      // Preserve the earned complete journey before any review or destructive reset.
      endEarned = end;
      phase = "earned_complete_before_review";
      await info.attach("OBS04-earned-complete-before-review", { body: JSON.stringify({ qualification: "Fresh normal journey earned only through UI, four canonical canvas-camera/production-ZXing scans; this snapshot predates review and reset", state: endEarned, normalScans: evidence }, null, 2), contentType: "application/json" });

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
      await info.attach("OBS04-II-readonly-exit-geometry", { body: JSON.stringify({ qualification: "Actual earned review context after optional QR transport; QR focus/hitpoints and zero intersection with scene/dialogue text", geometry: reviewExitGeometry }, null, 2), contentType: "application/json" });
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
      expect(postReset.explanation).toBeNull(); expect(postReset.quiz).toBeNull(); expect(postReset.ordering).toBeNull(); expect(postReset.legacyPracticeRaw).toBeNull();
      expect(await page.evaluate(() => sessionStorage.getItem("gvo.final.reviewContext.v1"))).toBeNull();
      expect(await preferences(page)).toEqual(preservedPreferences);
      await expect(page.locator("html")).toHaveAttribute("lang", "es");
      await expect(page.locator(roots.cover).getByRole("button", { name: "Empieza aquí", exact: true })).toBeEnabled();
      await capture(page, info, "10-post-reset-fresh-cover-preserved-language");
      phase = "post_reset_complete";
      await info.attach("OBS04-earned-review-return-reset", { body: JSON.stringify({ qualification: "Real UI extension after the independently preserved earned journey: one optional review QR, readonly transport/return and explicit confirmed reset. No seeded state, runtime API calls or DEV decode hook", endEarned, normalCameraRecords: normalCameras, reviewCameraRecords: reviewCameras, reviewEvidence, preservedPreferences, postReset, preferenceCoverage: "Only preferences actually created by this fresh UI journey are compared; absent optional preferences are not claimed as exercised" }, null, 2), contentType: "application/json" });
      expect(external).toEqual([]); expect(httpErrors).toEqual([]); expect(pageErrors).toEqual([]);
    } finally {
      const transitionJournal = await page.evaluate(() => window.__obs04TransitionSamples ?? []);
      const music = await page.evaluate(() => { const journal = window.__obs03MusicJournal; journal?.stop(); return journal ? { startedAt: journal.startedAt, samples: journal.samples } : null; });
      const indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
      await info.attach("OBS04-production-journey-evidence", { body: JSON.stringify({ qualification: "Real UI journey, lab canvas camera, real ZXing decoder; not physical camera or paced reading validation", extensionQualification: "Review/reset assertions run only after the earned normal journey passes; finalSnapshot may intentionally be post-reset and is never substituted for endEarned", indexBefore, indexAfter, external, httpErrors, pageErrors, normalScans: evidence, endEarned, reviewEvidence, postReset, music, transitionJournal, finalSnapshot: { phase, state: await snapshot(page) } }, null, 2), contentType: "application/json" });
      expect(indexAfter).toBe(indexBefore);
    }
  });
});
