import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const manifestPath = "public/assets/gvo/current-used/shared/lia/articulated-v03/manifest.json";
const motionCssPath = "src/components/LiaJourneyMotion/LiaJourneyMotion.css";
const manifestRaw = readFileSync(resolve(process.cwd(), manifestPath), "utf8");
const manifest = JSON.parse(manifestRaw) as { records: { runtime: string; dimensions: number[]; sha256: string }[] };
const registered = new Map(manifest.records.map((record) => [record.runtime.slice("public".length), record]));
const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const nominalMs = { attention: 1150, present: 1450, respond: 900 } as const;
type Action = keyof typeof nominalMs;
type Layer = { name: string; src: string; natural: number[]; complete: boolean; pointerEvents: string; rotate: number; scale: string; translate: string; animationName: string; animationMs: number | null; durationMs: number | null; playState: string | null };
type Frame = { ms: number; action: string; active: boolean; instance: number; direction: string; target: string; pointerEvents: string; mode: string | null; expression: string | null; petalCount: number; jointFace: boolean; jointRectError: number; layers: Layer[] };

/** Explicit R3-valid synthetic prior access, not an earned journey. The only
 * setup writes happen before the initial page load. No DEV hooks, fake clocks,
 * animation seeking, CSS injection, DOM mutation or runtime API calls. */
async function installPriorFixture(page: Page) {
  await page.addInitScript(() => {
    const target = location.pathname === "/portada" ? 0 : location.pathname.startsWith("/estacion/5") ? 5 : 1;
    const prefix = Math.max(0, target - 1);
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof order, closed: boolean) => ({ contentRevision: "OBS03.2", presentedStepIds: closed ? [...order[id]] : [], confirmedStepIds: closed ? [...order[id]] : [], assistedPresentedStepIds: [], activeStepId: closed ? null : order[id][0], interactionEvidence: [], outcome: id === 4 && closed ? "solved" : null, closed });
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", "es");
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", target !== 0), stations: Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, room(id as 1 | 2 | 3 | 4 | 5, id < target)])), legacyRouteCredit: prefix, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, index) => index + 1), updatedAt: "2026-10-23T12:00:00.000Z" }));
    localStorage.setItem("gvo.station5.quiz.v1", JSON.stringify({ schemaVersion: 1, correctAnswers: [], answeredQuestions: [], skippedQuestions: [] }));
  });
}

async function facts(page: Page) {
  return page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null");
    return { essentialRaw: localStorage.getItem("gvo.journey.essential.v1"), globalRaw: localStorage.getItem("gvo.progress.v1"), cover: state?.cover, stations: state?.stations, pendingTransition: state?.pendingTransition, finalReached: state?.finalReached, legacyRouteCredit: state?.legacyRouteCredit, quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1") ?? "null") };
  });
}

async function activeRoom(page: Page, station: "cover" | 1 | 5) {
  const root = page.locator(`.gvo-prepared-tree[data-journey-active="true"] main.${station === "cover" ? "cover-intro" : station === 1 ? "world1-root-screen" : "s5-quiz"}`);
  await expect(root).toBeVisible({ timeout: 25_000 });
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  expect(await root.evaluate((node) => !node.closest('[inert],[aria-hidden="true"]'))).toBe(true);
  return root;
}

/** Read computed CSS on natural rAFs, starting before readiness/click. Stop only
 * after a complete natural action plus a settled tail, or the bounded read-only
 * observation deadline. No Animation.currentTime writes or DOM/style changes. */
async function observe(page: Page, selector: string, expectedAction: Action, reduced: boolean) {
  return page.evaluate(async ({ selector, expectedAction, reduced, duration }) => {
    const started = performance.now(), instances = new WeakMap<Element, number>();
    const samples: Frame[] = []; let nextInstance = 0, lastSample = -100, activeSince: number | null = null, settledAt: number | null = null;
    const degrees = (value: string) => value === "none" ? 0 : Number.parseFloat(value.split(" ").at(-1)!);
    while (performance.now() - started < 20_000) {
      await new Promise<void>((done) => requestAnimationFrame(() => done()));
      const ms = performance.now() - started;
      if (ms - lastSample < 25) continue;
      const shell = document.querySelector<HTMLElement>(selector), rig = shell?.querySelector<HTMLElement>('[data-lia-avatar-mode="articulated-v03"]');
      if (!shell || !rig) continue;
      lastSample = ms;
      if (!instances.has(rig)) instances.set(rig, ++nextInstance);
      const action = shell.dataset.liaAction ?? "missing", active = shell.dataset.liaActive === "true", face = rig.querySelector<HTMLElement>(".gvo-lia-journey__face")!;
      const head = face.querySelector<HTMLImageElement>('[data-lia-rig-layer="head-clean"]')!, eyes = face.querySelector<HTMLImageElement>(".lia-hybrid__eye--base")!;
      const a = head.getBoundingClientRect(), b = eyes.getBoundingClientRect();
      const layers = Array.from(rig.querySelectorAll<HTMLImageElement>("img")).map((image) => {
        const css = getComputedStyle(image), animation = image.getAnimations().find((item) => (item as CSSAnimation).animationName.startsWith("gvo-lia-")), timing = animation?.effect?.getTiming();
        return { name: image.dataset.liaRigLayer!, src: new URL(image.currentSrc || image.src).pathname, natural: [image.naturalWidth, image.naturalHeight], complete: image.complete, pointerEvents: css.pointerEvents, rotate: degrees(css.rotate), scale: css.scale, translate: css.translate, animationName: css.animationName, animationMs: typeof animation?.currentTime === "number" ? animation.currentTime : null, durationMs: typeof timing?.duration === "number" ? timing.duration : null, playState: animation?.playState ?? null };
      });
      const css = getComputedStyle(face), animation = face.getAnimations().find((item) => (item as CSSAnimation).animationName.startsWith("gvo-lia-")), timing = animation?.effect?.getTiming();
      layers.push({ name: "joint-face", src: "", natural: [], complete: true, pointerEvents: css.pointerEvents, rotate: degrees(css.rotate), scale: css.scale, translate: css.translate, animationName: css.animationName, animationMs: typeof animation?.currentTime === "number" ? animation.currentTime : null, durationMs: typeof timing?.duration === "number" ? timing.duration : null, playState: animation?.playState ?? null });
      samples.push({ ms, action, active, instance: instances.get(rig)!, direction: shell.dataset.liaDirection ?? "missing", target: shell.dataset.liaTarget ?? "missing", pointerEvents: getComputedStyle(shell).pointerEvents, mode: rig.getAttribute("data-lia-avatar-mode"), expression: rig.getAttribute("data-lia-expression"), petalCount: rig.querySelectorAll('[data-lia-rig-layer^="petal-"]').length, jointFace: head.parentElement === face && eyes.parentElement === face && Array.from(rig.querySelectorAll(".lia-hybrid__eye")).every((eye) => eye.parentElement === face), jointRectError: Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.width - b.width), Math.abs(a.height - b.height)), layers });
      if (active && action === expectedAction) {
        activeSince ??= ms;
        const actionAnimations = layers.filter((layer) => layer.durationMs !== null);
        const finished = reduced ? ms - activeSince >= duration : actionAnimations.length > 0 && actionAnimations.every((layer) => layer.playState === "finished");
        if (finished) settledAt ??= ms; else settledAt = null;
        if (settledAt !== null && ms - settledAt >= 250) break;
      } else settledAt = null;
    }
    return { observedForMs: performance.now() - started, expectedAction, nominalDurationMs: duration, reduced, samples };
  }, { selector, expectedAction, reduced, duration: nominalMs[expectedAction] });
}

function assertRig(samples: Frame[]) {
  const active = samples.filter((sample) => sample.active);
  expect(active.length).toBeGreaterThan(8);
  const decoded = (layer: Layer) => layer.complete && layer.natural[0] === 432 && layer.natural[1] === 768;
  const readinessDiagnostics: unknown[] = [];
  for (const instance of new Set(active.map((sample) => sample.instance))) {
    const frames = active.filter((sample) => sample.instance === instance);
    const pending = frames.filter((frame) => frame.layers.some((layer) => layer.src && !decoded(layer)));
    const firstDecoded = frames.find((frame) => frame.layers.filter((layer) => layer.src).every(decoded));
    expect(firstDecoded, `Rig instance${instance} must resolve its actual DOM images`).toBeDefined();
    if (pending.length) {
      // A new keyed respond rig can expose its already-preloaded happy-eye IMG
      // at complete=false/natural0 on the first read-only rAF before paint.
      // Keep these samples and bound them; this is not proof of a visible gap.
      expect(pending.length, "At most two leading pending samples on a new rig").toBeLessThanOrEqual(2);
      expect(firstDecoded!.ms - pending[0].ms, "New happy-eye DOM IMG must resolve within100ms").toBeLessThanOrEqual(100);
      for (const frame of pending) {
        expect(frame.ms, "No undecoded recurrence after the first complete sample").toBeLessThan(firstDecoded!.ms);
        expect(frame.action).toBe("respond");
        for (const layer of frame.layers.filter((item) => item.src && !decoded(item))) expect(layer).toMatchObject({ name: "eyes-happy", complete: false, natural: [0, 0] });
      }
    }
    readinessDiagnostics.push({ instance, activeFrames: frames.length, allActiveSamplesDecoded: pending.length === 0, leadingPendingFrames: pending.length, firstPendingMs: pending[0]?.ms ?? null, firstDecodedMs: firstDecoded!.ms, pendingDurationUpperBoundMs: pending.length ? firstDecoded!.ms - pending[0].ms : 0, allowance: "Only newly-remounted respond eyes-happy: max2 leading rAF samples and<=100ms; no recurrence, broken image or wrong dimensions permitted. Prepaint observation is not evidence of a visible frame gap." });
  }
  for (const sample of active) {
    expect(sample).toMatchObject({ pointerEvents: "none", mode: "articulated-v03", petalCount: 5, jointFace: true });
    expect(sample.jointRectError).toBeLessThan(0.1);
    for (const layer of sample.layers.filter((item) => item.src)) {
      expect(registered.has(layer.src), `Registered ${layer.name}: ${layer.src}`).toBe(true);
      expect(layer.pointerEvents).toBe("none");
      // Leading new-IMG state is checked explicitly above; all remaining
      // samples retain the complete432×768 assertion, without changing timing.
      if (decoded(layer)) expect(layer).toMatchObject({ natural: [432, 768], complete: true });
    }
  }
  return readinessDiagnostics;
}

function assertNaturalAction(samples: Frame[], action: Action, reduced: boolean) {
  const frames = samples.filter((sample) => sample.active && sample.action === action);
  expect(frames.length).toBeGreaterThan(8);
  for (const frame of frames) expect(frame.expression).toBe(action === "attention" ? "neutral" : action === "present" ? "attentive" : "happy");
  const last = frames.at(-1)!, face = last.layers.find((layer) => layer.name === "joint-face")!;
  if (reduced) {
    for (const frame of frames) for (const layer of frame.layers) expect(layer.animationName).toBe("none");
    const reference = frames[0].layers.map(({ name, rotate, translate, scale }) => ({ name, rotate, translate, scale }));
    for (const frame of frames) expect(frame.layers.map(({ name, rotate, translate, scale }) => ({ name, rotate, translate, scale }))).toEqual(reference);
    expect(face.rotate).toBeCloseTo(0, 2);
    if (action === "attention") for (const layer of last.layers.filter((item) => item.name.startsWith("petal-"))) expect(layer.rotate).toBeCloseTo(0, 2);
    if (action === "present") expect(last.layers.find((layer) => layer.name === (last.direction === "left" ? "petal-left-upper" : "petal-right-upper"))!.rotate).toBeCloseTo(last.direction === "left" ? 12 : -12, 2);
    if (action === "respond") {
      expect(last.layers.find((layer) => layer.name === "petal-left-lower")!.rotate).toBeCloseTo(-6, 2);
      expect(last.layers.find((layer) => layer.name === "petal-right-lower")!.rotate).toBeCloseTo(6, 2);
    }
    return;
  }
  const actionLayers = frames.flatMap((frame) => frame.layers.filter((layer) => layer.durationMs !== null));
  expect(actionLayers.length).toBeGreaterThan(12);
  expect(actionLayers.every((layer) => layer.durationMs === nominalMs[action])).toBe(true);
  expect(Math.max(...frames.map((frame) => Math.abs(frame.layers.find((layer) => layer.name === "joint-face")!.rotate)))).toBeGreaterThan(action === "respond" ? 1 : 3);
  expect(Math.max(...actionLayers.filter((layer) => layer.name.startsWith("petal-")).map((layer) => Math.abs(layer.rotate)))).toBeGreaterThan(action === "respond" ? 7 : 10);
  expect(last.layers.filter((layer) => layer.durationMs !== null).every((layer) => layer.playState === "finished")).toBe(true);
  // Attention deliberately settles at ±4°/±3°; present/respond settle at base.
  expect(face.rotate).toBeCloseTo(action === "attention" ? (last.direction === "left" ? -3 : 3) : 0, 1);
  const finalAngles = action === "attention" ? { "petal-left-upper": 4, "petal-right-upper": -4 } : action === "present" ? { [last.direction === "left" ? "petal-left-upper" : "petal-right-upper"]: 0 } : { "petal-left-lower": 0, "petal-right-lower": 0 };
  for (const [name, angle] of Object.entries(finalAngles)) expect(last.layers.find((layer) => layer.name === name)!.rotate).toBeCloseTo(angle, 1);
  if (action === "present") {
    const scale = last.layers.find((layer) => layer.name === "petal-top")!.scale;
    for (const component of scale === "none" ? [1] : scale.split(" ").map(Number.parseFloat)) expect(component).toBeCloseTo(1, 2);
  }
  if (action === "respond") for (const component of face.translate === "none" ? [0] : face.translate.split(" ").map(Number.parseFloat)) expect(component).toBeCloseTo(0, 2);
  const tail = frames.filter((frame) => frame.instance === last.instance && frame.layers.find((layer) => layer.name === "joint-face")!.playState === "finished");
  expect(tail.at(-1)!.ms - tail[0].ms).toBeGreaterThanOrEqual(200);
  for (const frame of tail) expect(frame.layers.find((layer) => layer.name === "joint-face")!.rotate).toBeCloseTo(face.rotate, 2);
}

for (const reduced of [false, true]) test(`OBS03 soft Lía · ${reduced ? "reduced static" : "natural finite motion"} · declared Cover/I/V prior-state fixtures`, async ({ page, baseURL }, info) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  const errors: string[] = [], external: string[] = [], httpErrors: string[] = [], phases: unknown[] = [], captures: unknown[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`); });
  page.on("request", (request) => { const url = new URL(request.url()); if (/^https?:$/.test(url.protocol) && url.origin !== new URL(baseURL!).origin) external.push(request.url()); });
  const indexBody = await (await page.request.get("/")).body(), indexBefore = digest(indexBody);
  expect(indexBody.toString("utf8")).not.toContain("/@vite/client");
  const capture = async (name: string) => {
    const png = await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: false, scale: "css", animations: "allow" });
    const imagePixels = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }; expect(imagePixels).toEqual({ width: 390, height: 844 });
    captures.push({ name, configuredViewport: { width: 390, height: 844 }, imagePixels, fullPage: false, sha256: digest(png) });
  };
  try {
    await installPriorFixture(page); await page.goto("/portada", { waitUntil: "commit" });
    const coverObservation = observe(page, "main.cover-intro .gvo-lia-journey", "attention", reduced);
    const cover = await activeRoom(page, "cover"); await expect(cover).toHaveAttribute("data-cover-phase", "portada_idle");
    await expect(cover.locator(".cover-intro__dialogue")).toHaveCount(0);
    await expect(cover.locator(".cover-intro__cta")).toBeEnabled();
    await expect(cover.locator('[data-portal-id="portal-1"]')).toBeDisabled();
    const beforeCover = await facts(page), attentionComplete = await coverObservation;
    assertRig(attentionComplete.samples); assertNaturalAction(attentionComplete.samples, "attention", reduced);
    const afterCover = await facts(page); expect(afterCover).toEqual(beforeCover);
    expect(afterCover.cover).toMatchObject({ presentedStepIds: [], confirmedStepIds: [], closed: false });
    await expect(cover).toHaveAttribute("data-cover-phase", "portada_idle");
    await expect(cover.locator(".cover-intro__dialogue")).toHaveCount(0);
    await capture("00-Cover-idle-attention-natural-settled");
    phases.push({ phase: "Cover_idle_complete_attention_before_dialogue", before: beforeCover, after: afterCover, observation: attentionComplete, qualification: "Actual stable Cover consumer before any dialogue gesture; full1150ms attention action and finite deliberate endpoint in normal mode, actual static CSS in reduced mode. Baseline raw essential/global and all earned facts unchanged." });

    await page.goto("/estacion/1", { waitUntil: "commit" });
    const introObservation = observe(page, "main.world1-root-screen .gvo-lia-journey", "present", reduced);
    const rootI = await activeRoom(page, 1); await expect(rootI).toHaveAttribute("data-world1-root-state", "intro");
    const initialI = await facts(page), intro = await introObservation;
    assertRig(intro.samples); assertNaturalAction(intro.samples, "present", reduced);
    const afterI = await facts(page);
    expect(afterI.globalRaw).toBe(initialI.globalRaw); expect(afterI.quiz).toEqual(initialI.quiz);
    expect(afterI.cover).toEqual(initialI.cover); expect(afterI.legacyRouteCredit).toBe(initialI.legacyRouteCredit);
    for (const id of [1, 2, 3, 4, 5]) {
      expect(afterI.stations[id].confirmedStepIds).toEqual(initialI.stations[id].confirmedStepIds);
      expect(afterI.stations[id].closed).toBe(initialI.stations[id].closed);
    }
    expect(afterI.stations[1].confirmedStepIds).toEqual([]); expect(afterI.stations[1].closed).toBe(false);
    expect(afterI.pendingTransition).toBeNull(); expect(afterI.finalReached).toBe(false);
    await capture("01-I-intro-natural-settled");
    const attention = intro.samples.filter((sample) => sample.active && sample.action === "attention");
    phases.push({ phase: "I_intro_lifecycle", initial: initialI, final: afterI, observation: intro, attentionObservedActiveFrames: attention.length, attentionQualification: "Diagnostic only: real I intro immediately sets presentedConcept after activation/resourcesReady, so attention may be absent or interrupted before1150ms. This case does not claim a complete attention action or add a scene to force it." });

    // New isolated synthetic fixture is installed before this document load.
    // No facts are written by the harness after V has mounted.
    await page.goto("/estacion/5", { waitUntil: "commit" });
    const pendingObservation = observe(page, "main.s5-quiz .gvo-lia-journey", "present", reduced);
    const rootV = await activeRoom(page, 5); const agreement = rootV.locator('[data-answer="agreement"]');
    await expect(agreement).toBeEnabled(); await expect(rootV.locator(".gvo-lia-journey")).toHaveAttribute("data-lia-target", "plantas");
    const initialV = await facts(page), pending = await pendingObservation;
    assertRig(pending.samples); assertNaturalAction(pending.samples, "present", reduced);
    const beforeAnswer = await facts(page); expect(beforeAnswer).toEqual(initialV);
    await capture("02-V-unanswered-natural-settled");
    const responseObservation = observe(page, "main.s5-quiz .gvo-lia-journey", "respond", reduced);
    await agreement.click();
    await expect(rootV.locator(".gvo-lia-journey")).toHaveAttribute("data-lia-action", "respond");
    await expect(rootV.locator(".s5-quiz-feedback")).toContainText("¡Correcto!");
    const response = await responseObservation;
    const afterAnswer = await facts(page);
    const responsePhase = { phase: "V_pending_present_then_real_correct_answer_respond", before: initialV, after: afterAnswer, pendingObservation: pending, responseObservation: response, readinessDiagnostics: [] as unknown[] };
    // Preserve every raw response sample before assertions so a failing guard
    // cannot discard the only evidence of a transient or genuine load failure.
    phases.push(responsePhase);
    responsePhase.readinessDiagnostics = assertRig(response.samples); assertNaturalAction(response.samples, "respond", reduced);
    expect(afterAnswer.quiz).toEqual({ schemaVersion: 1, correctAnswers: ["plantas"], answeredQuestions: ["plantas"], skippedQuestions: [] });
    expect(afterAnswer.globalRaw).toBe(beforeAnswer.globalRaw); expect(afterAnswer.cover).toEqual(beforeAnswer.cover); expect(afterAnswer.stations).toEqual(beforeAnswer.stations);
    expect(afterAnswer.stations[5].confirmedStepIds).toEqual([]); expect(afterAnswer.stations[5].closed).toBe(false); expect(afterAnswer.pendingTransition).toBeNull(); expect(afterAnswer.finalReached).toBe(false); expect(afterAnswer.legacyRouteCredit).toBe(4);
    await capture("03-V-one-real-correct-answer-natural-settled");
    expect(errors).toEqual([]); expect(httpErrors).toEqual([]); expect(external).toEqual([]);
  } finally {
    const indexAfter = digest(await (await page.request.get("/")).body());
    await info.attach("soft-Lia-natural-CSS-and-fixture-evidence", { body: JSON.stringify({ qualification: "Synthetic declared prior-state access only; natural CSS/rAF observation, stable Cover idle before any dialogue gesture, and ordinary V answer UI. No full earned journey, global credit, room closure, physical-device or human motion approval claimed. Complete attention is checked in its real stable Cover consumer; I-intro attention remains diagnostic. Reduced case uses the actual prefers-reduced-motion media path, not a performance-mode claim. Every raw response sample is retained; a newly-remounted happy-eye IMG may be pending only within the explicit max2-leading-samples/100ms bound. No claim that all active rAF samples are decoded, nor proof of an actual visible frame gap.", reduced, nominalMs, sources: { manifest: { path: manifestPath, sha256: digest(manifestRaw) }, css: { path: motionCssPath, sha256: digest(readFileSync(resolve(process.cwd(), motionCssPath))) } }, compiledIndexBefore: indexBefore, compiledIndexAfter: indexAfter, phases, captures, errors, httpErrors, external }, null, 2), contentType: "application/json" });
    expect(indexAfter).toBe(indexBefore);
  }
});
