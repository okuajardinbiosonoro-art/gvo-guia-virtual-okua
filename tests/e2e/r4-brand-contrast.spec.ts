import { createHash } from "node:crypto";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import { entryCoverBackdropAsset } from "../../src/shared/assets/entryCoverAssets";

type Locale = "es" | "en";
const viewports = [{ width: 390, height: 844 }, { width: 568, height: 280 }] as const;

type EntryCameraRecord = { audioFalse: boolean; stops: number; ended: boolean; constraints: MediaStreamConstraints };
declare global { interface Window { __r4EntryCameraLab?: { requests: EntryCameraRecord[] } } }
async function installEntryCameraLab(page: Page) {
  await page.addInitScript(() => {
    const requests: EntryCameraRecord[] = [];
    window.__r4EntryCameraLab = { requests };
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
      const record: EntryCameraRecord = { audioFalse: constraints.audio === false, constraints, stops: 0, ended: false };
      requests.push(record);
      const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 480;
      const context = canvas.getContext("2d")!;
      const stream = canvas.captureStream(12), track = stream.getVideoTracks()[0];
      const stop = track.stop.bind(track); let running = true, frame = 0;
      const draw = () => { if (!running) return; context.fillStyle = "#27323f"; context.fillRect(0, 0, 640, 480); frame = requestAnimationFrame(draw); };
      draw();
      track.stop = () => { running = false; cancelAnimationFrame(frame); record.stops++; stop(); record.ended = track.readyState === "ended"; };
      return stream;
    } });
  });
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
}

async function facts(page: Page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("gvo.journey.essential.v1");
    const essential = raw ? JSON.parse(raw) : null;
    return {
      cover: essential?.cover ?? null,
      globalProgressRaw: localStorage.getItem("gvo.progress.v1"),
      globalCompletedStations: JSON.parse(localStorage.getItem("gvo.progress.v1") ?? "null")?.completedStations ?? [],
      quizRaw: localStorage.getItem("gvo.station5.quiz.v1"),
      practiceRaw: localStorage.getItem("gvo.station3.practice.v2"),
      language: localStorage.getItem("gvo.language.v1"),
    };
  });
}

async function captureState(page: Page, root: Locator, info: TestInfo, stem: string, selectors: string[], paired: boolean) {
  await settle(page);
  const samples = await root.evaluate((scope, selectors) => {
    const describe = (node: Element, pseudo: string | null = null) => {
      const s = getComputedStyle(node, pseudo);
      return { tag: node.tagName, id: node.id, className: node.className, rect: node.getBoundingClientRect().toJSON(), color: s.color, textFillColor: s.webkitTextFillColor, opacity: s.opacity, backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage, backgroundBlendMode: s.backgroundBlendMode, mixBlendMode: s.mixBlendMode, filter: s.filter, backdropFilter: s.backdropFilter, textShadow: s.textShadow, fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, transform: s.transform, visibility: s.visibility, animationName: s.animationName, content: s.content, pointerEvents: s.pointerEvents };
    };
    return selectors.map((selector) => {
      const node = scope.querySelector(selector);
      if (!node) throw new Error(`Missing visible contrast target: ${selector}`);
      const ancestorChain = []; let effectiveOpacity = 1;
      for (let current: Element | null = node; current; current = current.parentElement) {
        ancestorChain.push(describe(current)); effectiveOpacity *= Number(getComputedStyle(current).opacity);
      }
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), lineFragments = [];
      while (walker.nextNode()) {
        const text = walker.currentNode as Text, element = text.parentElement!;
        if (!text.textContent?.trim() || element.closest('[inert],[hidden],[aria-hidden="true"],:disabled')) continue;
        const range = document.createRange(); range.selectNodeContents(text);
        for (const rect of Array.from(range.getClientRects())) lineFragments.push({ text: text.textContent.trim(), rect: rect.toJSON(), element: describe(element), insideViewport: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight });
      }
      return { selector, target: describe(node), pseudoBefore: describe(node, "::before"), ancestorChain, effectiveOpacity, lineFragments };
    });
  }, selectors);
  for (const sample of samples) {
    expect(sample.lineFragments.length).toBeGreaterThan(0);
    expect(sample.lineFragments.every((line) => line.insideViewport)).toBe(true);
    expect(sample.effectiveOpacity).toBe(1);
  }
  const normal = info.outputPath(`${stem}-normal.png`);
  const png = await page.screenshot({ path: normal, fullPage: false, scale: "css", animations: "allow" });
  const viewport = page.viewportSize()!;
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([viewport.width, viewport.height]);
  let glyphFillTransparent: string | null = null;
  let style;
  const initialFacts = await facts(page);
  try {
    if (paired) {
      glyphFillTransparent = info.outputPath(`${stem}-glyph-fill-transparent.png`);
      // Evidence only: retain geometry, background artwork, alpha and shadows.
      style = await page.addStyleTag({ content: selectors.map((selector) => `${selector} { -webkit-text-fill-color: transparent !important; }`).join("\n") });
      await settle(page);
      const background = await page.screenshot({ path: glyphFillTransparent, fullPage: false, scale: "css", animations: "allow" });
      expect([background.readUInt32BE(16), background.readUInt32BE(20)]).toEqual([viewport.width, viewport.height]);
      for (const sample of samples) expect(await root.locator(sample.selector).evaluate((node) => node.getBoundingClientRect().toJSON())).toEqual(sample.target.rect);
    }
  } finally {
    if (style) await style.evaluate((node) => node.remove());
  }
  expect(await facts(page)).toEqual(initialFacts);
  return { stem, viewport, fullPage: false, scale: "css", normal, glyphFillTransparent, paired, glyphFillRestored: true, samples };
}

async function observeSceneClock(page: Page, root: Locator, reduced: boolean) {
  const result = await root.evaluate(async (scope) => {
    const animations = scope.getAnimations({ subtree: true }).filter((animation) => {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      return target instanceof Element && /loading-initial__(?:lia|plant|water)/.test(target.className);
    });
    const before = animations.map((animation) => ({ target: ((animation.effect as KeyframeEffect).target as Element).className, currentTime: Number(animation.currentTime), playState: animation.playState }));
    const started = performance.now();
    while (performance.now() - started < 180) await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    return { elapsedMs: performance.now() - started, before, after: animations.map((animation) => ({ currentTime: Number(animation.currentTime), playState: animation.playState })) };
  });
  if (!reduced) expect(result.before.some((animation, index) => animation.playState === "running" && result.after[index].currentTime > animation.currentTime + 50)).toBe(true);
  const text = await root.locator(".loading-initial__copy h1, .loading-initial__copy p").evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent, opacity: getComputedStyle(node).opacity, animationName: getComputedStyle(node).animationName })));
  expect(text.every((node) => node.opacity === "1" && node.animationName === "none")).toBe(true);
  return { qualification: "Natural scene animation clock advances; not every pose/frame or a visitor-completion claim. Reduced motion is recorded separately.", reduced, ...result, text };
}

async function closeCoverDialogs(root: Locator) {
  await root.locator(".cover-intro__cta").click();
  const panel = root.locator('[role="dialog"][data-dialogue-id]');
  await expect(panel).toBeVisible();
  const firstStep = (await panel.getAttribute("data-dialogue-step"))!.match(/\d+/g)!.map(Number);
  expect(firstStep[0]).toBe(1);
  const declaredTotal = firstStep[1];
  expect(declaredTotal).toBeGreaterThan(0); expect(declaredTotal).toBeLessThanOrEqual(12);
  const visited: Array<{ id: string; step: string; text: string; action: string }> = [];
  for (let index = 0; index < declaredTotal; index++) {
    await expect(panel).toBeVisible();
    const step = (await panel.getAttribute("data-dialogue-step"))!;
    expect(step.match(/\d+/g)!.map(Number)).toEqual([index + 1, declaredTotal]);
    const id = (await panel.getAttribute("data-dialogue-id"))!;
    const action = panel.getByRole("button");
    await expect(action).toBeEnabled();
    visited.push({ id, step, text: (await panel.locator(".cover-intro__dialogue-text").innerText()), action: (await action.getAttribute("aria-label")) ?? (await action.innerText()) });
    await action.click();
    if (index < declaredTotal - 1) await expect(panel).not.toHaveAttribute("data-dialogue-id", id);
  }
  await expect(panel).toHaveCount(0);
  await expect(root).toHaveAttribute("data-cover-phase", "portal_1_ready");
  expect(new Set(visited.map((entry) => entry.id)).size).toBe(declaredTotal);
  return { declaredTotalFromVisibleDom: declaredTotal, manuallyConfirmedDialogs: visited };
}

for (const viewport of viewports) for (const locale of ["es", "en"] as const) for (const reduced of [false, true]) {
  test(`R4 entry contrast ${locale} ${viewport.width}×${viewport.height} ${reduced ? "reduced PNG pairs" : "natural motion"}`, async ({ page }, info) => {
    test.setTimeout(90_000);
    await page.setViewportSize(viewport); await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    await installEntryCameraLab(page);
    const pageErrors: string[] = [], states: unknown[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const indexBefore = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
    const expected = process.env.GVO_OBS03_EXPECTED_INDEX_SHA256;
    if (expected) expect(indexBefore).toBe(expected);
    // Fresh Playwright context, no storage fixture or semantic progress seed.
    await page.goto("/");
    await expect(page.locator(`[data-language-option="${locale}"]`)).toBeEnabled({ timeout: 25_000 });
    await page.locator(`[data-language-option="${locale}"]`).click();
    const before = await facts(page);
    expect(before.globalCompletedStations).toEqual([]); expect(before.cover?.confirmedStepIds ?? []).toEqual([]);
    let release = () => {};
    const held = new Promise<void>((resolve) => { release = resolve; });
    const pattern = `**${entryCoverBackdropAsset}`;
    let heldRequests = 0;
    await page.route(pattern, async (route) => {
      heldRequests++; await held;
      await route.fulfill({ status: 404, contentType: "text/plain", headers: { "cache-control": "no-store" }, body: "Declared R4 QA resource failure" });
    });
    let dialogs: Awaited<ReturnType<typeof closeCoverDialogs>> | null = null;
    let clock: Awaited<ReturnType<typeof observeSceneClock>> | null = null;
    try {
      await page.goto("/carga", { waitUntil: "domcontentloaded" });
      const loading = page.locator('main.loading-initial[data-loading-preload-status="loading"]');
      await expect(loading).toBeVisible(); await expect(loading).toHaveAttribute("lang", locale);
      await expect.poll(() => heldRequests).toBeGreaterThan(0);
      await expect.poll(() => loading.locator(".loading-initial__copy").evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1);
      await expect.poll(() => loading.evaluate((node) => Number(getComputedStyle(node).opacity))).toBe(1);
      clock = await observeSceneClock(page, loading, reduced);
      states.push(await captureState(page, loading, info, "01-loading-settled", [".loading-initial__copy h1", ".loading-initial__copy p"], reduced));
      release();
      const failed = page.locator('main.loading-initial[data-preparation-failed="true"]');
      await expect(failed).toBeVisible();
      await expect(failed).toHaveCSS("opacity", "1"); await expect(failed).toHaveCSS("animation-name", "none");
      await expect(failed.locator(".loading-initial__copy")).toHaveCSS("opacity", "1");
      await expect(failed.locator(".loading-initial__copy")).toHaveCSS("animation-name", "none");
      await expect(failed.locator("#loading-initial-description")).toHaveText(locale === "es" ? "No fue posible preparar el recorrido. Puedes reintentar o volver." : "The journey could not be prepared. You can retry or go back.");
      const retry = failed.getByRole("button", { name: locale === "es" ? "Reintentar" : "Retry", exact: true });
      await expect(retry).toBeEnabled();
      states.push(await captureState(page, failed, info, "02-loading-resource-error", ["#loading-initial-description", ".loading-initial__recovery button:nth-child(1)", ".loading-initial__recovery button:nth-child(2)"], reduced));
      await page.unroute(pattern); await retry.click();
      await expect(page).toHaveURL(/\/inicio$/);
      await expect(page.locator('[data-initial-experience-action="start"]')).toBeEnabled();
      await page.locator('[data-initial-experience-action="start"]').click();
      await expect(page).toHaveURL(/\/portada$/);
      const cover = page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro');
      await expect(cover).toBeVisible({ timeout: 25_000 }); await expect(cover).toHaveAttribute("lang", locale);
      dialogs = await closeCoverDialogs(cover);
      const announcement = cover.locator(".cover-intro__portal-announcement");
      await expect(announcement).toBeVisible(); await expect(announcement).toHaveAttribute("role", "status");
      await expect(cover.locator('[data-portal-id="portal-1"]')).toBeEnabled();
      states.push(await captureState(page, cover, info, "03-portal-ready-announcement", [".cover-intro__portal-announcement"], reduced));
      const after = await facts(page);
      expect(after.cover?.confirmedStepIds).toHaveLength(dialogs.declaredTotalFromVisibleDom);
      expect(after.cover?.closed).toBe(true); expect(after.globalCompletedStations).toEqual([]);
      expect(after.quizRaw).toBe(before.quizRaw); expect(after.practiceRaw).toBe(before.practiceRaw);
      const camera = await page.evaluate(() => window.__r4EntryCameraLab);
      expect(camera?.requests.length).toBeGreaterThan(0);
      expect(camera?.requests.every((request) => request.audioFalse && request.stops === 1 && request.ended)).toBe(true);
      expect(pageErrors).toEqual([]);
    } finally {
      release(); await page.unroute(pattern);
      const indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
      await info.attach("R4-entry-state-contrast-evidence", { body: JSON.stringify({ qualification: "Fresh UI context, language chosen by UI, real loading held by delaying its actual destination asset, then failing that request with declared404 to observe real error/retry. Actual Cover dialogs confirmed by UI using the visible DOM total. LAB getUserMedia returns a real canvas captureStream solely for the start-camera permission gate, withaudiofalse/trackstopjournal; noQR orDEVhook. No forced readiness/error state, journey fixture, reading/practice claim or physical camera. Reduced-motion pairs retain layout/artwork/shadows for the existing offline composite sampler; natural mode separately records settled opaque text and advancing scene clocks. This browser test alone does not claim contrast PASS.", locale: locale as Locale, viewport, reduced, fullPage: false, indexBefore, indexAfter, indexStable: indexAfter === indexBefore, heldRequests, before, after: await facts(page), cameraLab: await page.evaluate(() => window.__r4EntryCameraLab), clock, dialogs, states, pageErrors }, null, 2), contentType: "application/json" });
      expect(indexAfter).toBe(indexBefore);
    }
  });
}
