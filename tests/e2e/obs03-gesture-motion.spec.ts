import { expect, test, type Page, type TestInfo } from "@playwright/test";

const essentialKey = "gvo.journey.essential.v1";
const handV03 = "/assets/gvo/shared/gesture-hints/runtime/gvo_gesture_hand_swipe_v03.webp";
type Consumer = "I-up" | "II-left";

/** Synthetic persisted layout context, not UI-earned progress. The room shapes
 * follow OBS03.2/R3 and the existing declared-layout harness. No DEV hook,
 * component mount, fake clock, CSS injection or visibility override is used. */
async function installGestureFixture(page: Page, consumer: Consumer) {
  await page.addInitScript((which) => {
    const orders = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof orders, count: number) => ({ contentRevision: "OBS03.2", presentedStepIds: orders[id].slice(0, count), confirmedStepIds: orders[id].slice(0, count), assistedPresentedStepIds: [], activeStepId: orders[id][count] ?? null, interactionEvidence: [] as { kind: string; id: string; contentRevision: string; origin: string }[], outcome: null, closed: count === orders[id].length });
    const stations = { 1: room(1, which === "II-left" ? 4 : 3), 2: room(2, which === "II-left" ? 2 : 0), 3: room(3, 0), 4: room(4, 0), 5: room(5, 0) };
    if (which === "II-left") stations[2].interactionEvidence = ["plant_contact_readout_seen", "signal_measured_wave_seen"].map((id) => ({ kind: "required_interaction", id, contentRevision: "OBS03.2", origin: "visitor_ui" }));
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", "es");
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", 4), stations, legacyRouteCredit: which === "II-left" ? 1 : 0, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: which === "II-left" ? [1] : [], updatedAt: "2026-10-23T12:00:00.000Z" }));
  }, consumer);
}

async function semanticState(page: Page, station: 1 | 2) {
  return page.evaluate(({ key, station }) => {
    const snapshot = JSON.parse(localStorage.getItem(key) ?? "null");
    return { room: snapshot?.stations[station] ?? null, globalRaw: localStorage.getItem("gvo.progress.v1"), legacyII: localStorage.getItem("gvo.station2.v1"), practiceIII: localStorage.getItem("gvo.station3.practice.v2") };
  }, { key: essentialKey, station });
}

async function prepareConsumer(page: Page, info: TestInfo, consumer: Consumer) {
  const station = consumer === "I-up" ? 1 : 2;
  const root = station === 1 ? "main.world1-root-screen" : "main.world2-root-screen";
  await installGestureFixture(page, consumer); await page.goto(`/estacion/${station}`);
  await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${root}`)).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => document.fonts.ready);
  let precondition: unknown;
  if (station === 1) {
    // The accessible name deliberately changes from «+ Más» to «Menos».
    // Keep the stable consumer locator and verify both semantic states.
    const more = page.locator(`${root} .world1-reading-more-toggle`);
    await expect(more).toBeVisible(); await expect(more).toBeEnabled(); await expect(more).toHaveAccessibleName("+ Más"); await expect(more).toHaveAttribute("aria-expanded", "false");
    await more.click(); await expect(more).toHaveAttribute("aria-expanded", "true"); await expect(more).toHaveAccessibleName("Menos");
    await expect(page.locator(`${root} .world1-reading-expanded:not([hidden])`)).toBeVisible();
    // Actual expanded writer text must overflow; a layout which needs no scroll
    // must not be reported as a missing-hint product failure.
    try {
      await expect.poll(() => page.locator(`${root} [data-world1-scroll-viewport]`).evaluate((node) => node.scrollHeight - node.clientHeight), { message: "Fixture precondition: real expanded mediation content must overflow before expecting the up hint" }).toBeGreaterThan(2);
    } catch (error) {
      const diagnostic = await page.locator(root).evaluate((node) => {
        const viewport = node.querySelector<HTMLElement>("[data-world1-scroll-viewport]")!;
        return { rootState: node.getAttribute("data-world1-root-state"), hintCondition: node.getAttribute("data-world1-swipe-hint-state"), scrollHeight: viewport.scrollHeight, clientHeight: viewport.clientHeight, scrollTop: viewport.scrollTop, expandedCharacters: node.querySelector(".world1-reading-expanded:not([hidden])")?.textContent?.length ?? 0, viewport: [innerWidth, innerHeight] };
      });
      await info.attach("I-hint-overflow-precondition-not-met", { body: JSON.stringify({ classification: "Fixture/layout precondition, not yet a missing-gesture product assertion", diagnostic }, null, 2), contentType: "application/json" });
      throw error;
    }
    precondition = await page.locator(root).evaluate((node) => {
      const viewport = node.querySelector<HTMLElement>("[data-world1-scroll-viewport]")!;
      return { state: node.getAttribute("data-world1-root-state"), hintCondition: node.getAttribute("data-world1-swipe-hint-state"), scrollTop: viewport.scrollTop, scrollHeight: viewport.scrollHeight, clientHeight: viewport.clientHeight, viewport: [innerWidth, innerHeight], moreExpanded: node.querySelector(".world1-reading-more-toggle")?.getAttribute("aria-expanded") };
    });
    await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "null")?.stations[1].presentedStepIds.includes("mediacion"), essentialKey)).toBe(true);
  } else {
    await expect(page.locator(root)).toHaveAttribute("data-world2-active-layer-content", "capture");
    await expect(page.locator('[data-world2-capture-interaction="swipe-timeline"]')).toBeVisible();
    precondition = await page.locator('[data-world2-capture-interaction="swipe-timeline"]').evaluate((node) => ({ label: node.getAttribute("aria-label"), rect: node.getBoundingClientRect().toJSON(), tabIndex: (node as HTMLElement).tabIndex }));
  }
  await info.attach("gesture-consumer-precondition", { body: JSON.stringify({ qualification: "Declared synthetic prior-state fixture; current real consumer, natural text overflow and no earned-journey claim", consumer, precondition }, null, 2), contentType: "application/json" });
  return { station: station as 1 | 2, hint: consumer === "I-up" ? ".gvo-gesture-hint.world1-root-gesture-hint" : ".gvo-gesture-hint.world2-gesture-hint--capture-swipe", anchor: consumer === "I-up" ? "[data-world1-swipe-hint-anchor]" : '[data-world2-capture-interaction="swipe-timeline"]' };
}

async function sampleReadOnly(page: Page, hintSelector: string, anchorSelector: string) {
  return page.evaluate(async ({ hintSelector, anchorSelector }) => {
    const began = performance.now();
    const samples: Array<Record<string, unknown> & { ms: number; state: string; opacity?: number; animationMs?: number | null; durationMs?: number | null; tipTrailDistance?: number; sourceTipDistance?: number; staticAnchorDistance?: number; tip?: { x: number; y: number }; motionOpacity?: number; motionTranslate?: string; motionScale?: string; motionName?: string }> = [];
    const centre = (node: Element) => { const r = node.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
    const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
    const rotation = (node: Element) => { const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform); return { matrix, degrees: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI }; };
    let lastSample = -100;
    while (performance.now() - began < 6500) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const ms = performance.now() - began;
      if (ms - lastSample < 40) continue;
      lastSample = ms;
      const hint = document.querySelector<HTMLElement>(hintSelector), anchor = document.querySelector(anchorSelector);
      if (!hint || !anchor) { samples.push({ ms, state: "absent" }); continue; }
      const motion = hint.querySelector<HTMLElement>(".gvo-gesture-hint__motion")!, direction = hint.querySelector<HTMLElement>(".gvo-gesture-hint__direction")!, hand = hint.querySelector<HTMLImageElement>("img")!, fingertip = hint.querySelector(".gvo-gesture-hint__fingertip")!, trail = hint.querySelector(".gvo-gesture-hint__fingertip-trail")!, origin = hint.querySelector(".gvo-gesture-hint__fingertip-trail-origin")!;
      const style = getComputedStyle(hint), m = getComputedStyle(motion), box = hint.getBoundingClientRect(), target = centre(anchor), tip = centre(fingertip);
      const px = parseFloat(style.getPropertyValue("--gvo-gesture-fingertip-x")) / 100, py = parseFloat(style.getPropertyValue("--gvo-gesture-fingertip-y")) / 100;
      const staticPoint = { x: box.x + box.width * px, y: box.y + box.height * py };
      // Independently project the registered source fingertip315,152 /1024
      // through the actual artwork/direction transforms and motion scale/shift.
      const dir = rotation(direction), art = rotation(hand), trailRotation = rotation(trail);
      const rotated = dir.matrix.multiply(art.matrix).transformPoint(new DOMPoint((315 / 1024 - 0.5) * box.width, (152 / 1024 - 0.5) * box.height));
      const translate = m.translate === "none" ? [0, 0] : m.translate.split(" ").map(Number.parseFloat), scale = m.scale === "none" ? [1, 1] : m.scale.split(" ").map(Number.parseFloat);
      const projected = { x: box.x + box.width / 2 + rotated.x * scale[0] + translate[0], y: box.y + box.height / 2 + rotated.y * (scale[1] ?? scale[0]) + (translate[1] ?? 0) };
      const animation = motion.getAnimations().find((animation) => (animation as CSSAnimation).animationName === "gvo-gesture-swipe-unidirectional-r3");
      const timing = animation?.effect?.getTiming();
      samples.push({ ms, state: hint.getAttribute("data-gvo-gesture-state") ?? "missing-state", opacity: Number(style.opacity), pointerEvents: style.pointerEvents, asset: hand.currentSrc, naturalSize: [hand.naturalWidth, hand.naturalHeight], anchor: target, tip, trailOrigin: centre(origin), tipTrailDistance: distance(tip, centre(origin)), sourceTipDistance: distance(projected, tip), staticAnchorDistance: distance(staticPoint, target), directionDegrees: dir.degrees, artworkDegrees: art.degrees, trailDegrees: trailRotation.degrees, motionName: m.animationName, animationMs: animation && typeof animation.currentTime === "number" ? animation.currentTime : null, durationMs: typeof timing?.duration === "number" ? timing.duration : null, motionOpacity: Number(m.opacity), motionTranslate: m.translate, motionScale: m.scale, rootRect: box.toJSON() });
    }
    return { observedForMs: performance.now() - began, samples };
  }, { hintSelector, anchorSelector });
}

test.describe("OBS03 gesture motion · real I and II consumers, declared fixtures", () => {
  for (const consumer of ["I-up", "II-left"] as const) for (const reducedMotion of [false, true]) {
    test(`${consumer} 320×568 · ${reducedMotion ? "reduced static" : "two natural swipe cycles"}`, async ({ page }, info) => {
      test.setTimeout(45_000); await page.setViewportSize({ width: 320, height: 568 }); await page.emulateMedia({ reducedMotion: reducedMotion ? "reduce" : "no-preference" });
      const pageErrors: string[] = []; page.on("pageerror", (error) => pageErrors.push(error.message));
      const { station, hint: selector, anchor } = await prepareConsumer(page, info, consumer), hint = page.locator(selector);
      await expect(hint).toHaveCount(1); await expect(hint).toHaveAttribute("data-gvo-gesture-anchor-state", "ready");
      await expect(hint).toHaveAttribute("data-gvo-gesture-direction", consumer === "I-up" ? "up" : "left");
      await expect(hint.locator("img")).toHaveAttribute("src", handV03);
      const before = await semanticState(page, station), sampling = sampleReadOnly(page, selector, anchor);
      let captureError: unknown;
      try {
        await expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible", { timeout: 6000 });
        await expect.poll(() => hint.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0.5);
        if (!reducedMotion) await expect.poll(() => hint.locator(".gvo-gesture-hint__motion").evaluate((node) => Number(getComputedStyle(node).opacity))).toBeGreaterThan(0.9);
        await page.screenshot({ path: info.outputPath(`${consumer}-${reducedMotion ? "reduced" : "motion"}-viewport-320x568.png`), fullPage: false, scale: "css" });
      } catch (error) { captureError = error; }
      const observation = await sampling, after = await semanticState(page, station);
      await info.attach("gesture-motion-readonly-samples", { body: JSON.stringify({ qualification: "Synthetic declared fixture, real consumer and elapsed browser time. No fake clock, CSS injection, earned reading/practice or physical camera/usability claim. Screenshot CSS viewport320×568, no scaling overlay.", consumer, reducedMotion, sourceFingertip: [315, 152, 1024], expectedCycleMs: 1100, expectedVisibleWindowMs: 2200, before, after, pageErrors, ...observation }, null, 2), contentType: "application/json" });
      if (captureError) throw captureError;
      const visible = observation.samples.filter((sample) => sample.state === "visible"), first = visible[0], last = visible.at(-1);
      expect(visible.length).toBeGreaterThan(10); expect(last).toBeDefined();
      const hiddenAfter = observation.samples.find((sample) => sample.ms > last!.ms && sample.state === "waiting"); expect(hiddenAfter).toBeDefined();
      const visibleWindowMs = hiddenAfter!.ms - first.ms;
      expect(visibleWindowMs).toBeGreaterThanOrEqual(2000); expect(visibleWindowMs).toBeLessThanOrEqual(2500);
      expect(observation.samples.at(-1)?.state).toBe("waiting"); expect(observation.samples.at(-1)?.opacity).toBeLessThan(0.01);
      for (const sample of visible) {
        expect(sample.pointerEvents).toBe("none"); expect(sample.naturalSize).toEqual([256, 256]); expect(String(sample.asset)).toContain(handV03);
        expect(sample.tipTrailDistance).toBeLessThan(1); expect(sample.sourceTipDistance).toBeLessThan(1); expect(sample.staticAnchorDistance).toBeLessThan(1);
        expect(sample.directionDegrees as number).toBeCloseTo(consumer === "I-up" ? 0 : -90, 2); expect(sample.artworkDegrees as number).toBeCloseTo(30, 2); expect(sample.trailDegrees as number).toBeCloseTo(consumer === "I-up" ? 90 : 0, 2);
      }
      if (reducedMotion) {
        expect(visible.every((sample) => sample.motionName === "none" && sample.animationMs === null)).toBe(true);
        const reference = first.tip!; expect(Math.max(...visible.map((sample) => Math.hypot(sample.tip!.x - reference.x, sample.tip!.y - reference.y)))).toBeLessThan(1);
      } else {
        expect(visible.every((sample) => sample.durationMs === 1100)).toBe(true);
        const animationTimes = visible.map((sample) => sample.animationMs ?? 0);
        expect(Math.max(...animationTimes)).toBeGreaterThan(1900); expect(Math.max(...animationTimes)).toBeLessThan(2400);
        expect(new Set(animationTimes.map((ms) => Math.floor(ms / 1100)))).toEqual(new Set([0, 1]));
        const axis = consumer === "I-up" ? "y" : "x"; const positions = visible.map((sample) => sample.tip![axis]); expect(Math.max(...positions) - Math.min(...positions)).toBeGreaterThan(8);
      }
      // Hint appearance/timeout is not a reading action or a completion event.
      expect(after.room.confirmedStepIds).toEqual(before.room.confirmedStepIds); expect(after.room.closed).toBe(false); expect(after.room.interactionEvidence).toEqual(before.room.interactionEvidence); expect(after.globalRaw).toBe(before.globalRaw); expect(after.legacyII).toBe(before.legacyII); expect(after.practiceIII).toBe(before.practiceIII); expect(pageErrors).toEqual([]);
    });
  }
});
