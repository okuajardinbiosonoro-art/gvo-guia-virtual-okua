import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test, type Locator, type Page, type Route, type TestInfo } from "@playwright/test";

type Room = { presentedStepIds: string[]; confirmedStepIds: string[]; closed: boolean };
type Essential = { cover: Room; stations: Record<string, Room>; pendingTransition: { from: string | number; to: string; phase: string } | null };
const targetAsset = "/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png";
const qualification = "Declared OBS03.2 closed-Cover fixture, not an earned introduction or full journey. Real portal gesture and compiled production preparation. No DEV flags, runtime API calls, CSS overrides, fake clock or forced readiness. SW blocked only for deterministic destination-only network faults.";
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const sourceFiles = [
  "src/app/router.tsx", "src/app/journey/JourneyPreparation.tsx",
  "src/screens/TransitionWorld/TransitionWorld.tsx", "src/screens/TransitionWorld/TransitionWorld.module.css",
  "tests/e2e/obs04-transition-visibility.spec.ts",
];

async function seedDeclaredClosedCover(page: Page) {
  await page.addInitScript(() => {
    const order = {
      cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"],
      1: ["intro", "relacion", "percepcion", "mediacion"],
      2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"],
      3: ["INTRO", "PASO A PASO", "BENEFICIOS"],
      4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"],
      5: ["plantas", "sistema", "espacio", "visitante", "resultado"],
    };
    const room = (id: keyof typeof order, closed: boolean) => ({
      contentRevision: "OBS03.2", presentedStepIds: closed ? [...order[id]] : [],
      confirmedStepIds: closed ? [...order[id]] : [], assistedPresentedStepIds: [],
      activeStepId: closed ? null : order[id][0], interactionEvidence: [], outcome: null, closed,
    });
    // Only initial fixture injection; no destination receipt or fact is seeded.
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem("gvo.language.v1", "es");
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [], updatedAt: "2026-10-24T00:00:00.000Z" }));
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({
      schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", true),
      stations: Object.fromEntries(([1, 2, 3, 4, 5] as const).map((id) => [id, room(id, false)])),
      legacyRouteCredit: 0, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" },
      pendingTransition: null, finalReached: false,
    }));
  });
}

async function facts(page: Page) {
  return page.evaluate(() => ({
    at: performance.now(), pathname: location.pathname,
    essential: JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null") as Essential | null,
    progress: JSON.parse(localStorage.getItem("gvo.progress.v1") ?? "null") as { completedStations: number[] } | null,
    activeTargets: document.querySelectorAll('.gvo-prepared-tree[data-journey-active="true"] main.world1-root-screen').length,
  }));
}

async function visibility(locator: Locator) {
  return locator.evaluate((element) => {
    let effectiveOpacity = 1;
    const ancestors = [];
    for (let current: Element | null = element; current; current = current.parentElement) {
      const css = getComputedStyle(current);
      effectiveOpacity *= Number(css.opacity);
      ancestors.push({ tag: current.tagName, className: current.className, opacity: css.opacity, display: css.display, visibility: css.visibility });
    }
    const rect = element.getBoundingClientRect();
    return {
      at: performance.now(), effectiveOpacity, ancestors, rect: rect.toJSON(),
      viewport: { width: innerWidth, height: innerHeight }, documentVisibility: document.visibilityState,
      images: Array.from(element.querySelectorAll("img")).map((image) => ({ src: image.src, currentSrc: image.currentSrc, complete: image.complete, width: image.naturalWidth, height: image.naturalHeight })),
    };
  });
}

async function captureBeforeAssertion(page: Page, info: TestInfo, transition: Locator, phase: string) {
  const sample = {
    phase, qualification, facts: await facts(page),
    stage: await visibility(transition.locator(":scope > section")),
    portal: await visibility(transition.getByTestId("transition-world-portal")),
    lia: await visibility(transition.getByTestId("transition-world-lia-sprite")),
    progress: await visibility(transition.getByRole("progressbar")),
  };
  // Both raw CSS/ancestor evidence and PNG are retained BEFORE the expected RED.
  await info.attach(`${phase}-effective-opacity`, { body: JSON.stringify(sample, null, 2), contentType: "application/json" });
  await page.screenshot({ path: info.outputPath(`${phase}-viewport.png`), fullPage: false, scale: "css" });
  return sample;
}

function assertNoTargetCredit(current: Awaited<ReturnType<typeof facts>>, baseline: Awaited<ReturnType<typeof facts>>) {
  expect(current.activeTargets).toBe(0);
  expect(current.progress).toEqual(baseline.progress);
  expect(current.essential?.cover).toEqual(baseline.essential?.cover);
  expect(current.essential?.stations).toEqual(baseline.essential?.stations);
  expect(current.essential?.pendingTransition).toMatchObject({ from: "cover", to: "/estacion/1", phase: "pending" });
}

test.describe("OBS04 INC04-00 compiled transition visibility", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  for (const mode of ["loading", "404"] as const) {
    test(`${mode}: real stage and recovery remain painted while destination is not ready`, async ({ page }, info) => {
      const expectedIndex = process.env.GVO_OBS04_EXPECTED_INDEX_SHA256 ?? process.env.GVO_OBS03_EXPECTED_INDEX_SHA256;
      if (!expectedIndex || !/^[a-f0-9]{64}$/.test(expectedIndex)) throw new Error("Supply the exact root-approved compiled candidate SHA; no stale fallback is allowed");
      const indexBefore = hash(await (await page.request.get("/")).body());
      expect(indexBefore).toBe(expectedIndex);
      const sourceCut = sourceFiles.map((source) => { const bytes = readFileSync(source); return { source, bytes: bytes.length, sha256: hash(bytes) }; });
      await seedDeclaredClosedCover(page);
      const faults: { url: string; action: string; atHostMs: number }[] = [];
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      let release: () => void = () => undefined;
      const held = new Promise<void>((resolve) => { release = resolve; });
      let armed = false, allowTarget = false;
      const matches = (url: URL) => url.pathname === targetAsset;
      const handler = async (route: Route) => {
        if (!armed || allowTarget) { await route.continue(); return; }
        faults.push({ url: route.request().url(), action: mode === "404" ? "HTTP404" : "held-until-finally", atHostMs: performance.now() });
        if (mode === "404") { await route.fulfill({ status: 404, contentType: "text/plain", headers: { "cache-control": "no-store" }, body: "OBS04 destination-only declared fault" }); return; }
        await held;
        try { await route.continue(); } catch { /* Test/context teardown may cancel the intentionally held request. */ }
      };
      await page.route(matches, handler);
      let baseline: Awaited<ReturnType<typeof facts>> | null = null;
      try {
        await page.goto("/portada");
        await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro')).toBeVisible();
        const portal = page.locator("main.cover-intro").getByRole("button", { name: "Sala I · Raíz, lista para abrir.", exact: true });
        await expect(portal).toBeEnabled();
        baseline = await facts(page);
        expect(baseline.essential?.cover.closed).toBe(true);
        expect(baseline.essential?.pendingTransition).toBeNull();
        expect(baseline.progress?.completedStations).toEqual([]);
        armed = true;
        await portal.click();
        await expect(page).toHaveURL(/\/estacion\/1$/);
        await expect.poll(() => faults.length).toBeGreaterThan(0);
        const transition = page.locator('.gvo-preparation-curtain main[data-transition-to-route="/estacion/1"]');
        await expect(transition).toHaveAttribute("data-target-assets-ready", "false");
        if (mode === "loading") {
          await expect(transition).toHaveAttribute("data-critical-assets-status", "loading");
          const sample = await captureBeforeAssertion(page, info, transition, "01-pending");
          assertNoTargetCredit(sample.facts, baseline);
          expect(sample.stage.documentVisibility).toBe("visible");
          expect(sample.stage.rect.width).toBeGreaterThan(0);
          expect(sample.stage.rect.height).toBeGreaterThan(0);
          expect(sample.stage.effectiveOpacity).toBeGreaterThanOrEqual(0.9);
        } else {
          await expect(transition).toHaveAttribute("data-critical-assets-status", /error|timeout/, { timeout: 18_000 });
          const retry = transition.getByRole("button", { name: "Reintentar", exact: true });
          await expect(retry).toHaveCount(1);
          const sample = await captureBeforeAssertion(page, info, transition, "02-resource-error");
          const recovery = { retry: await visibility(retry), back: await visibility(transition.getByRole("button", { name: "Volver", exact: true })) };
          await info.attach("02-recovery-effective-opacity", { body: JSON.stringify(recovery, null, 2), contentType: "application/json" });
          assertNoTargetCredit(sample.facts, baseline);
          expect(sample.stage.effectiveOpacity).toBeGreaterThanOrEqual(0.9);
          expect(recovery.retry.effectiveOpacity).toBeGreaterThanOrEqual(0.9);
          expect(recovery.back.effectiveOpacity).toBeGreaterThanOrEqual(0.9);
          allowTarget = true;
          await retry.click();
          await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.world1-root-screen')).toBeVisible();
          const after = await facts(page);
          expect(after.progress?.completedStations).toEqual([]);
          expect(after.essential?.stations["1"].confirmedStepIds).toEqual([]);
          expect(after.essential?.stations["1"].closed).toBe(false);
        }
        await expect(page.getByRole("button", { name: /omitir|saltar/i })).toHaveCount(0);
        expect(pageErrors).toEqual([]);
      } finally {
        const finalFactsBeforeRelease = await facts(page);
        const indexAfter = hash(await (await page.request.get("/")).body());
        await info.attach("OBS04-stage-visibility-run-facts", { body: JSON.stringify({ qualification, mode, targetAsset, indexBefore, indexAfter, sourceCut, faults, pageErrors, baseline, finalFactsBeforeRelease, limits: "Opacity/PNG consumer regression only; fixture is not earned entry, temporal choreography or physical camera evidence. Host fault clock and browser sample clock are separate monotonic clocks." }, null, 2), contentType: "application/json" });
        release();
        await page.unroute(matches, handler);
        expect(indexAfter).toBe(indexBefore);
      }
    });
  }
});

type EntrySample = { at: number; loading: boolean; loadingOpacity: number; initial: boolean; coverActive: boolean; preparationCardVisible: boolean; afterEnter: boolean };
type EntryEvidence = { visibleLoadingMs: number; firstLoadingPaintAt: number | null; initialAt: number | null; enterAt: number | null; coverAt: number | null; samples: EntrySample[]; cameraRequests: { at: number; audio: boolean | MediaTrackConstraints | undefined }[] };
declare global { interface Window { __obs04EntryObserver?: { state: () => EntryEvidence; stop: () => EntryEvidence }; } }

test("entry: complete natural minimum and prepared Cover handoff without a second loading card", async ({ page }, info) => {
  test.setTimeout(60_000);
  const expectedIndex = process.env.GVO_OBS04_EXPECTED_INDEX_SHA256 ?? process.env.GVO_OBS03_EXPECTED_INDEX_SHA256;
  if (!expectedIndex || !/^[a-f0-9]{64}$/.test(expectedIndex)) throw new Error("Supply the exact root-approved compiled candidate SHA");
  const indexBefore = hash(await (await page.request.get("/")).body());
  expect(indexBefore).toBe(expectedIndex);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    // No progress seed. Canvas is only a declared laboratory camera-preflight source.
    localStorage.clear(); sessionStorage.clear();
    const data: EntryEvidence = { visibleLoadingMs: 0, firstLoadingPaintAt: null, initialAt: null, enterAt: null, coverAt: null, samples: [], cameraRequests: [] };
    const devices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: devices });
    Object.defineProperty(devices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
      data.cameraRequests.push({ at: performance.now(), audio: constraints.audio });
      const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 64;
      const draw = canvas.getContext("2d")!; draw.fillStyle = "white"; draw.fillRect(0, 0, 64, 64);
      return canvas.captureStream(1);
    } });
    const opacity = (element: Element | null) => {
      if (!element) return 0;
      let alpha = 1;
      for (let node: Element | null = element; node; node = node.parentElement) {
        const css = getComputedStyle(node);
        if (css.display === "none" || css.visibility !== "visible") return 0;
        alpha *= Number(css.opacity);
      }
      const r = element.getBoundingClientRect();
      return r.width > 0 && r.height > 0 ? alpha : 0;
    };
    let stopped = false, previous: EntrySample | null = null;
    const record = () => {
      const at = performance.now(), loading = document.querySelector("main.loading-initial");
      const loadingOpacity = opacity(loading);
      const initial = document.querySelector('main.initial-experience');
      const cover = document.querySelector('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro');
      const card = document.querySelector('.gvo-preparation-card');
      const sample: EntrySample = { at, loading: document.visibilityState === "visible" && loadingOpacity > 0.01, loadingOpacity, initial: opacity(initial) > 0.01, coverActive: opacity(cover) > 0.01, preparationCardVisible: opacity(card) > 0.01, afterEnter: data.enterAt !== null };
      if (sample.loading && data.firstLoadingPaintAt === null) data.firstLoadingPaintAt = at;
      if (sample.initial && data.initialAt === null) data.initialAt = at;
      if (sample.coverActive && data.coverAt === null) data.coverAt = at;
      if (sample.loading && previous?.loading) data.visibleLoadingMs += at - previous.at;
      if (!previous || at - previous.at >= 100 || sample.loading !== previous.loading || sample.initial !== previous.initial || sample.coverActive !== previous.coverActive || sample.preparationCardVisible !== previous.preparationCardVisible || sample.afterEnter !== previous.afterEnter) data.samples.push(sample);
      previous = sample;
    };
    const frame = () => { if (stopped) return; record(); requestAnimationFrame(frame); };
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest('[data-initial-experience-action="start"]')) { data.enterAt = performance.now(); record(); }
    }, true);
    const observer = new MutationObserver(record);
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-journey-active", "inert", "aria-hidden"] });
    requestAnimationFrame(frame);
    window.__obs04EntryObserver = { state: () => data, stop: () => { record(); stopped = true; observer.disconnect(); return data; } };
  });
  const brand = "/assets/runtime/cover-intro/brand/okua-emblem-material-v03.png";
  let armed = false, release: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const lateRequests: { url: string; atHostMs: number }[] = [];
  const matches = (url: URL) => url.pathname === brand;
  const handler = async (route: Route) => {
    if (armed) { lateRequests.push({ url: route.request().url(), atHostMs: performance.now() }); await gate; }
    try { await route.continue(); } catch { /* Teardown can cancel the declared hold. */ }
  };
  await page.route(matches, handler);
  let journal: EntryEvidence | null = null;
  try {
    await page.goto("/");
    await expect(page.locator('[data-language-option="es"]')).toBeEnabled({ timeout: 35_000 });
    await page.screenshot({ path: info.outputPath("entry-01-initial-after-loading.png"), fullPage: false, scale: "css" });
    await page.locator('[data-language-option="es"]').click();
    armed = true;
    await page.locator('[data-initial-experience-action="start"]').click();
    await expect.poll(async () => lateRequests.length > 0 || await page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro').count() > 0).toBe(true);
    if (lateRequests.length) {
      // Baseline evidence: this resource should have been prepared by first load.
      await expect(page.locator('.gvo-preparation-card')).toBeVisible();
      await info.attach("entry-02-second-loading-opacity", { body: JSON.stringify(await visibility(page.locator('.gvo-preparation-card')), null, 2), contentType: "application/json" });
      await page.screenshot({ path: info.outputPath("entry-02-second-loading-card.png"), fullPage: false, scale: "css" });
      release();
    }
    await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro')).toBeVisible();
    await page.screenshot({ path: info.outputPath("entry-03-cover-active.png"), fullPage: false, scale: "css" });
    journal = await page.evaluate(() => window.__obs04EntryObserver!.stop());
    const finalFacts = await facts(page);
    await info.attach("OBS04-entry-minimum-and-handoff", { body: JSON.stringify({ qualification: "Fresh local storage, actual entry UI and compiled production resource requests; canvas laboratory camera preflight only. Passive rAF/DOM opacity journal, no clock/CSS/readiness/progress injection. Brand request is held only if it first occurs after entry gesture; prewarm requests before gesture pass untouched.", indexBefore, journal, lateRequests, finalFacts, nominalVisibleMinimumMs: 12000, frameObservationAllowanceMs: 100 }, null, 2), contentType: "application/json" });
    expect.soft(journal.visibleLoadingMs, "Complete natural presentation must survive warm/fast resources").toBeGreaterThanOrEqual(11_900);
    expect.soft(lateRequests, "Cover brand must already be prepared by initial load").toHaveLength(0);
    expect.soft(journal.samples.filter((sample) => sample.afterEnter && sample.preparationCardVisible), "No visible second loading card between initial UI and Cover").toEqual([]);
    expect(finalFacts.essential?.cover.confirmedStepIds ?? []).toEqual([]);
    expect(finalFacts.progress?.completedStations ?? []).toEqual([]);
    expect(journal.cameraRequests).toHaveLength(1);
    expect(journal.cameraRequests[0].audio).toBe(false);
  } finally {
    if (!journal) journal = await page.evaluate(() => window.__obs04EntryObserver?.stop() ?? null);
    await info.attach("OBS04-entry-finally", { body: JSON.stringify({ indexBefore, indexAfter: hash(await (await page.request.get("/")).body()), journal, lateRequests }, null, 2), contentType: "application/json" });
    release(); await page.unroute(matches, handler);
  }
});
