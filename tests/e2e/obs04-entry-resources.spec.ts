import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test, type Page, type Route, type TestInfo } from "@playwright/test";

const atlas = "/assets/runtime/loading-initial/lia/lia_loading_16f_okua_v03.png";
const sourceFiles = ["src/app/journey/EntryPreparationHost.tsx", "src/app/journey/EntryPreparationHost.css", "src/app/journey/preparedImages.ts", "src/app/journey/journeyResources.ts", "src/app/journey/JourneyActivation.tsx", "src/screens/LoadingInitial/LoadingInitialScreen.tsx", "src/screens/LoadingInitial/LoadingInitialScreen.css", "src/screens/InitialExperience/InitialExperienceScreen.tsx", "src/screens/Cover/CoverIntroScreen.tsx", "src/screens/Cover/CoverIntroScreen.css", "tests/e2e/obs04-entry-resources.spec.ts"];
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
type Paint = { at: number; host: boolean; resource: string | null; presentation: string | null; loadingReady: boolean; rootOpacity: number; sceneOpacity: number; sceneVisibility: string | null; rootAnimation: string | null; haloAnimation: string | null; haloOpacity: number; liaTransform: string | null; liaBackgroundPosition: string | null; coverCount: number; activeCover: boolean; initialVisible: boolean; cardVisible: boolean; reduced: boolean; viewport: { width: number; height: number } };
type Journal = { firstHostAt: number | null; firstOwnFrameAt: number | null; initialAt: number | null; errorAt: number | null; startAt: number | null; camera: { at: number; audio: boolean | MediaTrackConstraints | undefined }[]; samples: Paint[] };
declare global { interface Window { __obs04ResourceObserver?: { read: () => Journal; stop: () => Journal }; } }

async function identity(page: Page) {
  const expected = process.env.GVO_OBS04_EXPECTED_INDEX_SHA256 ?? process.env.GVO_OBS03_EXPECTED_INDEX_SHA256;
  if (!expected || !/^[a-f0-9]{64}$/.test(expected)) throw Error("Exact root-approved compiled index SHA is required; no stale fallback");
  const index = sha(await (await page.request.get("/")).body()); expect(index).toBe(expected);
  return { index, sources: sourceFiles.map((path) => { const bytes = readFileSync(path); return { path, bytes: bytes.length, sha256: sha(bytes) }; }) };
}
async function installObserver(page: Page, camera: boolean) {
  await page.addInitScript(({ camera }) => {
    localStorage.clear(); sessionStorage.clear();
    const journal: Journal = { firstHostAt: null, firstOwnFrameAt: null, initialAt: null, errorAt: null, startAt: null, camera: [], samples: [] };
    if (camera) {
      // Explicit lab-only camera preflight fixture. No QR decode, progress or readiness injection.
      const devices = navigator.mediaDevices ?? {};
      Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: devices });
      Object.defineProperty(devices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
        journal.camera.push({ at: performance.now(), audio: constraints.audio });
        const canvas = document.createElement("canvas"); canvas.width = 64; canvas.height = 64;
        const draw = canvas.getContext("2d")!; draw.fillStyle = "white"; draw.fillRect(0, 0, 64, 64);
        return canvas.captureStream(1);
      } });
    }
    const opacity = (element: Element | null) => {
      if (!element) return 0;
      let value = 1;
      for (let node: Element | null = element; node; node = node.parentElement) {
        const css = getComputedStyle(node);
        if (css.display === "none" || css.visibility !== "visible") return 0;
        value *= Number(css.opacity);
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 ? value : 0;
    };
    let stopped = false;
    const sample = () => {
      const host = document.querySelector(".entry-preparation-host"), loading = document.querySelector("main.loading-initial");
      const scene = loading?.querySelector(".loading-initial__scene") ?? null;
      const halo = loading?.querySelector(".loading-initial__halo") ?? null;
      const lia = loading?.querySelector(".loading-initial__lia") ?? null;
      const at = performance.now();
      const current: Paint = {
        at, host: Boolean(host), resource: host?.getAttribute("data-entry-resource-state") ?? null, presentation: host?.getAttribute("data-entry-presentation") ?? null,
        loadingReady: loading?.getAttribute("data-presentation-ready") === "true", rootOpacity: opacity(loading), sceneOpacity: opacity(scene), sceneVisibility: scene ? getComputedStyle(scene).visibility : null,
        rootAnimation: loading ? getComputedStyle(loading).animationName : null, haloAnimation: halo ? getComputedStyle(halo).animationName : null, haloOpacity: opacity(halo),
        liaTransform: lia ? getComputedStyle(lia).transform : null, liaBackgroundPosition: lia ? getComputedStyle(lia).backgroundPosition : null,
        coverCount: document.querySelectorAll("main.cover-intro").length, activeCover: opacity(document.querySelector('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro')) > 0.01,
        initialVisible: opacity(document.querySelector("main.initial-experience")) > 0.01, cardVisible: opacity(document.querySelector(".gvo-preparation-card")) > 0.01,
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, viewport: { width: innerWidth, height: innerHeight },
      };
      if (current.host && journal.firstHostAt === null) journal.firstHostAt = at;
      if (current.loadingReady && current.sceneOpacity >= 0.9 && journal.firstOwnFrameAt === null) journal.firstOwnFrameAt = at;
      if (current.initialVisible && journal.initialAt === null) journal.initialAt = at;
      if (/error|timeout/.test(current.resource ?? "") && journal.errorAt === null) journal.errorAt = at;
      journal.samples.push(current);
    };
    const frame = () => { if (!stopped) { sample(); requestAnimationFrame(frame); } };
    document.addEventListener("click", (event) => { if ((event.target as Element | null)?.closest('[data-initial-experience-action="start"]')) { journal.startAt = performance.now(); sample(); } }, true);
    requestAnimationFrame(frame);
    window.__obs04ResourceObserver = { read: () => journal, stop: () => { sample(); stopped = true; return journal; } };
  }, { camera });
}
async function facts(page: Page) {
  return page.evaluate(() => ({ at: performance.now(), path: location.pathname, essentialRaw: localStorage.getItem("gvo.journey.essential.v1"), progressRaw: localStorage.getItem("gvo.progress.v1"), globalActiveTargets: document.querySelectorAll('.gvo-prepared-tree[data-journey-active="true"] main').length }));
}
async function snapshot(page: Page, info: TestInfo, name: string) {
  const data = { facts: await facts(page), journal: await page.evaluate(() => window.__obs04ResourceObserver!.read()) };
  await info.attach(`${name}-raw`, { body: JSON.stringify(data, null, 2), contentType: "application/json" });
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: false, scale: "css" });
  return data;
}

test.describe("OBS04 compiled entry resource boundaries", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("own atlas held past the real deadline keeps animation/Cover unstarted and exposes finite recovery", async ({ page }, info) => {
    test.setTimeout(60_000); await page.emulateMedia({ reducedMotion: "no-preference" });
    const cut = await identity(page); await installObserver(page, false);
    const requests: { path: string; type: string; atHostMs: number }[] = [], failures: { path: string; error: string | null }[] = [], pageErrors: string[] = [];
    page.on("request", (request) => requests.push({ path: new URL(request.url()).pathname, type: request.resourceType(), atHostMs: performance.now() }));
    page.on("requestfailed", (request) => failures.push({ path: new URL(request.url()).pathname, error: request.failure()?.errorText ?? null }));
    page.on("pageerror", (error) => pageErrors.push(error.message));
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => { release = resolve; });
    const faults: { path: string; action: string; atHostMs: number }[] = [];
    const matches = (url: URL) => url.pathname === atlas;
    const handler = async (route: Route) => { faults.push({ path: atlas, action: "HOLD_UNTIL_AFTER_TERMINAL_TIMEOUT", atHostMs: performance.now() }); await held; try { await route.continue(); } catch { /* The aborted preloader may already have cancelled its request. */ } };
    await page.route(matches, handler);
    let baseline: Awaited<ReturnType<typeof facts>> | null = null;
    try {
      await page.goto("/");
      const loading = page.locator("main.loading-initial");
      await expect(loading).toHaveAttribute("data-presentation-ready", "false");
      await expect.poll(() => faults.length).toBeGreaterThan(0);
      await expect.poll(() => page.evaluate(() => window.__obs04ResourceObserver!.read().firstHostAt)).not.toBeNull();
      baseline = await facts(page);
      const pending = await snapshot(page, info, "own-atlas-01-pending");
      await expect(loading).toHaveAttribute("data-preload-status", "timeout", { timeout: 18_000 });
      const retry = loading.getByRole("button", { name: "Reintentar", exact: true });
      await expect(retry).toBeVisible();
      await expect.poll(() => page.evaluate(() => window.__obs04ResourceObserver!.read().errorAt)).not.toBeNull();
      const error = await snapshot(page, info, "own-atlas-02-terminal");
      const beforeReleaseRequests = [...requests];
      expect(pending.journal.firstOwnFrameAt).toBeNull(); expect(error.journal.firstOwnFrameAt).toBeNull();
      expect(error.journal.samples.every((sample) => !sample.loadingReady && sample.coverCount === 0 && !sample.activeCover && !sample.initialVisible)).toBe(true);
      expect(error.journal.errorAt! - error.journal.firstHostAt!).toBeGreaterThanOrEqual(14_000);
      expect(error.journal.errorAt! - error.journal.firstHostAt!).toBeLessThanOrEqual(18_000);
      expect(error.journal.samples.at(-1)?.rootOpacity).toBeGreaterThanOrEqual(0.9);
      expect(beforeReleaseRequests.filter((request) => request.path.includes("/cover-intro/") || request.path.includes("/articulated-v03/"))).toEqual([]);
      expect(error.facts.essentialRaw).toBe(baseline.essentialRaw); expect(error.facts.progressRaw).toBe(baseline.progressRaw);
      expect(error.facts.globalActiveTargets).toBe(0); await expect(loading.getByRole("status")).toContainText("No fue posible preparar");
      release(); await page.waitForLoadState("networkidle");
      const late = await snapshot(page, info, "own-atlas-03-late-release");
      expect(late.facts.path).toBe("/"); expect(late.facts.essentialRaw).toBe(baseline.essentialRaw); expect(late.facts.progressRaw).toBe(baseline.progressRaw); expect(late.facts.globalActiveTargets).toBe(0);
      await expect(retry).toBeEnabled(); expect(late.journal.firstOwnFrameAt).toBeNull();
      expect(pageErrors).toEqual([]);
    } finally {
      release(); await page.unroute(matches, handler);
      const journal = await page.evaluate(() => window.__obs04ResourceObserver?.stop() ?? null);
      await info.attach("OBS04-own-atlas-boundary", { body: JSON.stringify({ qualification: "Fresh storage, one real own sprite HTTP hold, real absolute production timer; no DEV/clock/readiness/semantic injection. Browser first-host sample is an observation near T0, not an exported controller timestamp; 18s is measurement tolerance over the 15s technical cap. Cancelled native requests after abort are retained as diagnostics.", cut, indexAfter: sha(await (await page.request.get("/")).body()), atlas, faults, requests, failures, pageErrors, baseline, journal }, null, 2), contentType: "application/json" });
      expect(sha(await (await page.request.get("/")).body())).toBe(cut.index);
    }
  });

  test("reduced final image lasts 1.2s then EN/landscape revalidate and activate the same prepared Cover", async ({ page }, info) => {
    test.setTimeout(60_000); await page.emulateMedia({ reducedMotion: "reduce" });
    const cut = await identity(page); await installObserver(page, true);
    const requests: { path: string; type: string; afterStart: boolean; status?: number; fromServiceWorker?: boolean }[] = [], pageErrors: string[] = [];
    let start = false;
    page.on("request", (request) => { if (["image", "font", "stylesheet", "script"].includes(request.resourceType())) requests.push({ path: new URL(request.url()).pathname, type: request.resourceType(), afterStart: start }); });
    page.on("response", (response) => { const path = new URL(response.url()).pathname; const record = requests.findLast((request) => request.path === path && request.status === undefined); if (record) { record.status = response.status(); record.fromServiceWorker = response.fromServiceWorker(); } });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    let journal: Journal | null = null;
    try {
      await page.goto("/");
      await expect.poll(() => page.evaluate(() => window.__obs04ResourceObserver!.read().firstOwnFrameAt)).not.toBeNull();
      await snapshot(page, info, "reduced-01-real-static-frame");
      const english = page.locator('[data-language-option="en"]');
      await expect(english).toBeEnabled({ timeout: 30_000 });
      await expect.poll(() => page.evaluate(() => window.__obs04ResourceObserver!.read().initialAt)).not.toBeNull();
      const cover = await page.locator("main.cover-intro").elementHandle();
      if (!cover) throw Error("The actual inactive Cover must exist before entering /inicio");
      const initial = await snapshot(page, info, "reduced-02-initial");
      const stable = initial.journal.samples.filter((sample) => sample.loadingReady && sample.sceneOpacity >= 0.9 && !sample.initialVisible);
      expect(stable.length).toBeGreaterThan(1);
      expect(initial.journal.initialAt! - initial.journal.firstOwnFrameAt!).toBeGreaterThanOrEqual(1150);
      expect(stable.every((sample) => sample.reduced && sample.rootAnimation === "none" && sample.haloAnimation === "none" && sample.rootOpacity >= 0.99 && sample.sceneOpacity >= 0.99)).toBe(true);
      expect(new Set(stable.map((sample) => sample.liaTransform)).size).toBe(1);
      expect(new Set(stable.map((sample) => sample.liaBackgroundPosition)).size).toBe(1);
      const before = await facts(page);
      await english.click(); await page.setViewportSize({ width: 568, height: 280 });
      await expect(page.locator("main.initial-experience")).toHaveAttribute("data-initial-language", "en");
      await expect(page.locator("main.cover-intro")).toHaveAttribute("lang", "en");
      const startButton = page.getByRole("button", { name: "Start journey", exact: true });
      await expect(startButton).toBeEnabled();
      const beforeStart = await snapshot(page, info, "reduced-03-en-landscape-before-start");
      const geometry = await cover.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { connected: element.isConnected, isSameCurrentNode: element === document.querySelector("main.cover-intro"), count: document.querySelectorAll("main.cover-intro").length, viewport: { width: innerWidth, height: innerHeight }, rect: rect.toJSON(), fonts: { status: document.fonts.status, regular: document.fonts.check('400 16px "Pixelify Sans Variable"', "Interactive Exhibition · Listening and living signals."), bold: document.fonts.check('700 16px "Pixelify Sans Variable"', "Interactive Exhibition · Listening and living signals.") }, images: Array.from(element.querySelectorAll("img")).map((image) => ({ src: image.src, currentSrc: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })) };
      });
      await info.attach("reduced-03-real-tree-fonts-and-geometry", { body: JSON.stringify(geometry, null, 2), contentType: "application/json" });
      expect(geometry.connected && geometry.isSameCurrentNode && geometry.fonts.regular && geometry.fonts.bold).toBe(true); expect(geometry.count).toBe(1);
      expect(geometry.viewport).toEqual({ width: 568, height: 280 }); expect(geometry.rect.width).toBeGreaterThan(0); expect(geometry.rect.height).toBeGreaterThan(0);
      expect(geometry.images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)).toBe(true);
      expect(beforeStart.facts.essentialRaw).toBe(before.essentialRaw); expect(beforeStart.facts.progressRaw).toBe(before.progressRaw);
      start = true; await startButton.click();
      await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro')).toBeVisible();
      await expect(page.getByRole("heading", { name: "Interactive Exhibition", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Start here", exact: true })).toBeEnabled();
      await expect(page.getByRole("button", { name: "Room I · Root. Complete the introduction to open the portal.", exact: true })).toBeDisabled();
      await page.waitForLoadState("networkidle");
      const active = await snapshot(page, info, "reduced-04-same-cover-active");
      const identical = await cover.evaluate((element) => element.isConnected && element === document.querySelector("main.cover-intro"));
      journal = await page.evaluate(() => window.__obs04ResourceObserver!.stop());
      const earlyPaths = new Set(requests.filter((request) => !request.afterStart).map((request) => request.path));
      const late = requests.filter((request) => request.afterStart);
      const resourceTimings = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => { const resource = entry as PerformanceResourceTiming; return { path: new URL(resource.name).pathname, startTime: resource.startTime, transferSize: resource.transferSize, encodedBodySize: resource.encodedBodySize, decodedBodySize: resource.decodedBodySize }; }));
      const unexplainedLate = late.filter((request) => {
        const timing = resourceTimings.findLast((entry) => entry.path === request.path);
        return !earlyPaths.has(request.path) || request.fromServiceWorker || !(request.status === 304 || request.status === 200 && timing?.transferSize === 0);
      });
      await info.attach("reduced-04-request-classification", { body: JSON.stringify({ requests, late, resourceTimings, unexplainedLate, rule: "Normally zero post-Start resource requests. Any exception must be an initial-known source with actual HTTP304 validation or HTTP200 plus resource transferSize0, and no SW; every actual request is retained, not silently dropped. A fresh HTTP200 network body is not explained by URL equality." }, null, 2), contentType: "application/json" });
      expect(identical).toBe(true); expect(active.facts.essentialRaw).toBe(before.essentialRaw); expect(active.facts.progressRaw).toBe(before.progressRaw);
      expect(unexplainedLate).toEqual([]); expect(journal.samples.filter((sample) => journal!.startAt !== null && sample.at >= journal!.startAt! && sample.cardVisible)).toEqual([]);
      expect(journal.camera).toHaveLength(1); expect(journal.camera[0].audio).toBe(false); expect(pageErrors).toEqual([]);
    } finally {
      journal ??= await page.evaluate(() => window.__obs04ResourceObserver?.stop() ?? null);
      const indexAfter = sha(await (await page.request.get("/")).body());
      await info.attach("OBS04-reduced-and-prepared-cover", { body: JSON.stringify({ qualification: "Fresh storage; actual reduced CSS, native frame sampling, UI English selection, viewport rotation and real Start/camera preflight path. Canvas only supplies laboratory preflight camera. ElementHandle identity is read-only DOM evidence; no runtime readiness API/flags/fake clocks or semantic facts are injected. Nominal stable minimum1200ms; observer allowance50ms. Geometry/font/IMG checks cover this sampled state, not universal layout/WCAG/physical-device certification.", cut, indexAfter, requests, pageErrors, journal }, null, 2), contentType: "application/json" });
      expect(indexAfter).toBe(cut.index);
    }
  });
});
