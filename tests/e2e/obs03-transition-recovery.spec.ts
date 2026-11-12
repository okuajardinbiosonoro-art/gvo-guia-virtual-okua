import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import type { VerifiedEssentialSnapshot } from "../../src/app/journey/journeyEssential";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as { toDataURL(value: string, options: { width: number; margin: number }): Promise<string> };
type Origin = "cover" | 1 | 2 | 3 | 4 | 5;
type Destination = 1 | 2 | 3 | 4 | 5 | "final";
type Scenario = { id: string; qaId: string; from: Origin; to: Destination; exclusiveAsset: string; fault: "404" | "hold15s"; recovery: "retry" | "back-to-source" };
const roots: Record<Origin | "final", string> = { cover: "main.cover-intro", 1: "main.world1-root-screen", 2: "main.world2-root-screen", 3: "main.s3-practice-screen", 4: "main.s4-ordering", 5: "main.s5-quiz", final: "main.final-root-shell" };

// Deliberately independent, literal consumer URLs. A changed/missing target
// request must fail this test instead of silently faulting another resource.
const scenarios: Scenario[] = [
  { id: "cover-I", qaId: "QA-T01-FAIL", from: "cover", to: 1, exclusiveAsset: "/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png", fault: "404", recovery: "retry" },
  { id: "I-II", qaId: "QA-T02-FAIL", from: 1, to: 2, exclusiveAsset: "/assets/gvo/stations/world-2/pulse-invisible/runtime/background/world2_background_base_mobile_v01.webp", fault: "404", recovery: "retry" },
  { id: "II-III", qaId: "QA-T03-FAIL", from: 2, to: 3, exclusiveAsset: "/assets/gvo/stations/world-3/notebook-pixel/runtime/notebook/world3_notebook_open_base_v01.png", fault: "hold15s", recovery: "retry" },
  { id: "III-IV", qaId: "QA-T04-FAIL", from: 3, to: 4, exclusiveAsset: "/assets/gvo/stations/world-4/system-table/runtime/environment/world4_table_environment_portrait_v02.webp", fault: "404", recovery: "back-to-source" },
  { id: "IV-V", qaId: "QA-T05-FAIL", from: 4, to: 5, exclusiveAsset: "/assets/gvo/stations/world-5/present-map/runtime/world5_sub_plants_environment_portrait_v01.webp", fault: "404", recovery: "retry" },
  { id: "V-Mirador", qaId: "QA-T06-FAIL", from: 5, to: "final", exclusiveAsset: "/assets/gvo/stations/final-root/environment/final_environment_portrait_v01.webp", fault: "404", recovery: "retry" },
];
type CameraRecord = { payload: string; startedAt: number; qrPaintedAt: number | null; stopped: boolean; stops: number; audio: boolean | MediaTrackConstraints | undefined };
type RecoveryLab = {
  qualification: string; initialEssential: unknown; initialProgress: unknown;
  writes: { key: string; before: string | null; after: string; at: number }[];
  intents: { id: string; at: number }[];
  reveals: { route: string; root: string; at: number }[];
  camera: CameraRecord[]; errors: string[];
};
declare global { interface Window { __obs03RecoveryLab?: RecoveryLab; } }
const routeFor = (screen: Origin | "final") => screen === "cover" ? "/portada" : screen === "final" ? "/final" : `/estacion/${screen}`;
const prefixFor = (from: Origin) => from === "cover" ? 0 : from - 1;
const bits = (length: number) => Array.from({ length }, (_, index) => index + 1);

async function installDeclaredHarness(page: Page, from: Origin) {
  const payload = typeof from === "number" && from < 5 ? `/qr/w${from + 1}` : null;
  const qrData = payload ? await QRCode.toDataURL(payload, { width: 512, margin: 4 }) : null;
  await page.addInitScript(({ from, payload, qrData }) => {
    // Synthetic closed-source fixture only. No destination receipt/confirmation
    // is seeded. All transition actions and decoder callbacks below are real UI.
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const through = from === "cover" ? 0 : from, prefix = Math.max(0, through - 1);
    const room = (id: keyof typeof order, closed: boolean) => ({ contentRevision: "OBS03.2", presentedStepIds: closed ? [...order[id]] : [], confirmedStepIds: closed ? [...order[id]] : [], assistedPresentedStepIds: [], activeStepId: closed ? null : order[id][0], interactionEvidence: [], outcome: id === 4 && closed ? "assisted_review_completed" : null, closed });
    const essential = { schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", true), stations: Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, room(id as 1 | 2 | 3 | 4 | 5, id <= through)])), legacyRouteCredit: prefix, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false };
    const progress = { schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, index) => index + 1), updatedAt: "2026-10-24T00:00:00.000Z" };
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem("gvo.language.v1", "es");
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify(essential));
    localStorage.setItem("gvo.progress.v1", JSON.stringify(progress));
    localStorage.setItem("gvo.station5.quiz.v1", JSON.stringify({ schemaVersion: 1, correctAnswers: [], answeredQuestions: from === 5 ? ["plantas", "sistema", "espacio", "visitante"] : [], skippedQuestions: from === 5 ? ["plantas", "sistema", "espacio", "visitante"] : [] }));
    if (through >= 4) {
      const permutation = ["planta", "bionosificador", "esp32", "midi", "wifi_udp", "router", "sistema_central", "sonido"];
      localStorage.setItem("gvo.station4.ordering.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", phase: "closed", permutation, selectedObjectId: null, remainingActiveMs: 90_000, reviewIndex: 7, confirmedReviewSteps: permutation, outcome: "assisted_requested", closed: true }));
    }
    const lab: RecoveryLab = { qualification: "Declared closed-source fixture; real gestures and canvas camera through production ZXing; no earned full journey, physical camera or human approval", initialEssential: essential, initialProgress: progress, writes: [], intents: [], reveals: [], camera: [], errors: [] };
    window.__obs03RecoveryLab = lab;
    const nativeSet = Storage.prototype.setItem, nativeGet = Storage.prototype.getItem;
    Storage.prototype.setItem = function (this: Storage, key: string, value: string) {
      const before = nativeGet.call(this, key);
      nativeSet.call(this, key, value);
      // Observation delegates unchanged to native Storage. It grants no state.
      if (this !== localStorage || !["gvo.progress.v1", "gvo.journey.essential.v1"].includes(key)) return;
      const at = performance.now(); lab.writes.push({ key, before, after: String(value), at });
      if (key === "gvo.journey.essential.v1") {
        const previous = JSON.parse(before ?? "null"), next = JSON.parse(String(value));
        const id = next?.pendingTransition?.transactionId;
        if (id && id !== previous?.pendingTransition?.transactionId) lab.intents.push({ id, at });
      }
    };
    new MutationObserver(() => {
      const main = document.querySelector('.gvo-prepared-tree[data-journey-active="true"] main');
      if (!main) return;
      const record = { route: location.pathname, root: main.className, at: performance.now() }, previous = lab.reveals.at(-1);
      if (!previous || previous.route !== record.route || previous.root !== record.root) lab.reveals.push(record);
    }).observe(document, { childList: true, attributes: true, subtree: true, attributeFilter: ["data-journey-active"] });
    if (!payload || !qrData) return;
    const devices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: devices });
    Object.defineProperty(devices, "getUserMedia", { configurable: true, value: async (constraints: MediaStreamConstraints) => {
      const record: CameraRecord = { payload, startedAt: performance.now(), qrPaintedAt: null, stopped: false, stops: 0, audio: constraints.audio };
      lab.camera.push(record);
      if (constraints.audio !== false) throw new Error("Recovery camera harness requires audio:false");
      const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 640;
      const draw = canvas.getContext("2d")!, image = new Image(); let decoded = false;
      image.src = qrData; void image.decode().then(() => { decoded = true; }).catch((error) => lab.errors.push(String(error)));
      const paint = () => { draw.fillStyle = "white"; draw.fillRect(0, 0, 640, 640); if (decoded && performance.now() - record.startedAt >= 600) { draw.drawImage(image, 64, 64, 512, 512); record.qrPaintedAt ??= performance.now(); } };
      paint(); const stream = canvas.captureStream(12), timer = window.setInterval(paint, 80);
      for (const track of stream.getTracks()) { const stop = track.stop.bind(track); track.stop = () => { if (!record.stopped) { record.stops++; record.stopped = true; clearInterval(timer); } stop(); }; }
      return stream;
    } });
  }, { from, payload, qrData });
}

async function snapshot(page: Page) {
  return page.evaluate(() => ({ at: performance.now(), route: location.pathname,
    essential: JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null") as VerifiedEssentialSnapshot | null,
    progress: JSON.parse(localStorage.getItem("gvo.progress.v1") ?? "null") as { completedStations: number[] } | null,
    quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1") ?? "null"), lab: window.__obs03RecoveryLab ?? null,
  }));
}
async function active(page: Page, screen: Origin | "final") { await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${roots[screen]}`)).toBeVisible({ timeout: 25_000 }); }
async function trigger(page: Page, scenario: Scenario) {
  if (scenario.from === "cover") await page.locator(roots.cover).getByRole("button", { name: "Sala I · Raíz, lista para abrir.", exact: true }).click();
  else if (scenario.from === 5) await page.locator(roots[5]).getByRole("button", { name: "Ir al Mirador", exact: true }).click();
  else {
    const gate = page.locator('[data-interstation-qr-action="open"]'); await expect(gate).toBeEnabled(); await gate.click();
    await expect(page.locator('[data-interstation-qr-gate="active"] video')).toBeVisible();
  }
  await expect(page).toHaveURL(new RegExp(`${routeFor(scenario.to)}$`), { timeout: 20_000 });
}
function completed(raw: string | null) { return (JSON.parse(raw ?? "null") as { completedStations?: number[] } | null)?.completedStations ?? []; }

test.describe("OBS03 transition recovery · six declared-source fixtures on compiled candidate", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  for (const scenario of scenarios) test(`${scenario.qaId} ${scenario.id} · ${scenario.fault} · ${scenario.recovery}`, async ({ page, baseURL }, info: TestInfo) => {
    test.setTimeout(90_000);
    await installDeclaredHarness(page, scenario.from);
    const indexBody = await (await page.request.get("/")).body();
    expect(indexBody.toString("utf8")).not.toContain("/@vite/client");
    expect(indexBody.toString("utf8")).toMatch(/\bsrc=["']\/assets\/[^"']+\.js["']/);
    const indexBefore = createHash("sha256").update(indexBody).digest("hex");
    if (process.env.GVO_OBS03_EXPECTED_INDEX_SHA256) expect(indexBefore).toBe(process.env.GVO_OBS03_EXPECTED_INDEX_SHA256);
    const phases: unknown[] = [], httpErrors: { url: string; status: number }[] = [], requestFailures: { url: string; error: string | null }[] = [], pageErrors: string[] = [];
    const faults: { url: string; mode: Scenario["fault"]; startedAt: number; endedAt?: number; heldMs?: number; routeOutcome?: string }[] = [];
    const holds: Promise<void>[] = [];
    let allowTarget = false, armed = false, indexAfter: string | null = null;
    page.on("response", (response) => { if (response.status() >= 400) httpErrors.push({ url: response.url(), status: response.status() }); });
    page.on("requestfailed", (request) => requestFailures.push({ url: request.url(), error: request.failure()?.errorText ?? null }));
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const capture = async (phase: string) => { const state = await snapshot(page), png = await page.screenshot({ path: info.outputPath(`${phase}.png`), fullPage: true }); phases.push({ phase, state, configuredViewport: { width: 390, height: 844 }, fullPage: true, imagePixels: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) } }); return state; };
    const assertNoTargetCredit = async (baseline: Awaited<ReturnType<typeof snapshot>>) => {
      const current = await snapshot(page);
      expect(current.progress?.completedStations).toEqual(bits(prefixFor(scenario.from)));
      expect(current.essential?.finalReached).toBe(false);
      if (scenario.to !== "final") {
        expect(current.essential?.stations[scenario.to].confirmedStepIds).toEqual(baseline.essential?.stations[scenario.to].confirmedStepIds);
        expect(current.essential?.stations[scenario.to].closed).toBe(false);
      }
      expect(current.lab?.reveals.filter((record) => record.root.split(" ").includes(roots[scenario.to].replace("main.", "")))).toEqual([]);
      await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${roots[scenario.to]}`)).toHaveCount(0);
      return current;
    };
    try {
      await page.goto(routeFor(scenario.from)); await active(page, scenario.from);
      expect(await page.evaluate(() => "__GVO_QR_TEST_MODE__" in window)).toBe(false);
      const baseline = await capture("01-source-closed-fixture");
      expect(baseline.essential?.cover.closed).toBe(true);
      if (scenario.from !== "cover") expect(baseline.essential?.stations[scenario.from].closed).toBe(true);
      expect(baseline.essential?.pendingTransition).toBeNull();
      expect(baseline.progress?.completedStations).toEqual(bits(prefixFor(scenario.from)));
      await page.route((url) => url.pathname === scenario.exclusiveAsset, async (route) => {
        if (!armed || allowTarget) { await route.continue(); return; }
        const fault = { url: route.request().url(), mode: scenario.fault, startedAt: performance.now() } as typeof faults[number]; faults.push(fault);
        if (scenario.fault === "404") { await route.fulfill({ status: 404, contentType: "text/plain", headers: { "cache-control": "no-store" }, body: "OBS03 declared destination-only fault" }); fault.endedAt = performance.now(); fault.routeOutcome = "HTTP404"; return; }
        const held = (async () => {
          const releaseAt = fault.startedAt + 15_000;
          while (performance.now() < releaseAt) await new Promise((resolve) => setTimeout(resolve, Math.ceil(releaseAt - performance.now())));
          fault.endedAt = performance.now(); fault.heldMs = fault.endedAt - fault.startedAt;
          try { await route.continue(); fault.routeOutcome = "continued-after-real15s-hold"; }
          catch (error) { fault.routeOutcome = `request-already-cancelled-after-hold: ${String(error)}`; }
        })(); holds.push(held); await held;
      });
      armed = true; await trigger(page, scenario);
      const transition = page.locator(`.gvo-preparation-curtain [data-transition-to-route="${routeFor(scenario.to)}"]`);
      await expect(transition).toBeVisible();
      await expect(transition.getByRole("button", { name: "Reintentar", exact: true })).toBeVisible({ timeout: 18_000 });
      expect(faults.length).toBeGreaterThan(0);
      await expect(transition).toHaveAttribute("data-target-assets-ready", "false");
      await expect(page.getByRole("button", { name: /omitir|saltar/i })).toHaveCount(0);
      const failure = await assertNoTargetCredit(baseline), receipt = failure.essential?.pendingTransition;
      expect(receipt?.from).toBe(scenario.from); expect(receipt?.to).toBe(routeFor(scenario.to)); expect(receipt?.phase).toBe("pending");
      const accepted = failure.lab?.intents.find((intent) => intent.id === receipt?.transactionId);
      expect(accepted).toBeDefined();
      const observedErrorAfterIntentMs = failure.at - accepted!.at;
      expect(observedErrorAfterIntentMs).toBeLessThanOrEqual(18_000); //15s hard budget +3s observation/scheduling tolerance, not normal latency.
      await capture("02-finite-failure-no-credit");
      phases.push({ phase: "failure-timing", observedErrorAfterIntentMs, hardBudgetMs: 15_000, observationToleranceMs: 3000, interpretation: "Upper bound; not a typical transition duration" });
      if (scenario.fault === "hold15s") {
        await Promise.all(holds);
        expect(faults.every((fault) => (fault.heldMs ?? 0) >= 15_000)).toBe(true);
        await assertNoTargetCredit(baseline); await capture("03-real15s-released-still-manual-recovery");
      }
      if (scenario.recovery === "back-to-source") {
        await transition.getByRole("button", { name: "Volver", exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${routeFor(scenario.from)}$`)); await active(page, scenario.from);
        const returned = await capture("03-back-to-source");
        expect(returned.essential?.pendingTransition).toBeNull();
        expect(returned.progress?.completedStations).toEqual(baseline.progress?.completedStations);
        if (scenario.from !== "cover") expect(returned.essential?.stations[scenario.from].closed).toBe(true);
        allowTarget = true; await trigger(page, scenario);
      } else { allowTarget = true; await transition.getByRole("button", { name: "Reintentar", exact: true }).click(); }
      await active(page, scenario.to);
      expect(await page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${roots[scenario.to]} img`).evaluateAll((images) => images.filter((image) => image.getBoundingClientRect().width > 0 && getComputedStyle(image).display !== "none").every((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0))).toBe(true);
      await expect.poll(async () => (await snapshot(page)).essential?.pendingTransition, { timeout: 5000 }).toBeNull();
      const recovered = await capture("04-recovered-same-segment");
      const expectedBits = bits(scenario.from === "cover" ? 0 : scenario.from);
      expect(recovered.progress?.completedStations).toEqual(expectedBits);
      if (scenario.to === "final") expect(recovered.essential?.finalReached).toBe(true);
      else { expect(recovered.essential?.stations[scenario.to].confirmedStepIds).toEqual(baseline.essential?.stations[scenario.to].confirmedStepIds); expect(recovered.essential?.stations[scenario.to].closed).toBe(false); }
      const creditIntroductions = recovered.lab!.writes.filter((write) => write.key === "gvo.progress.v1" && typeof scenario.from === "number" && !completed(write.before).includes(scenario.from) && completed(write.after).includes(scenario.from));
      expect(creditIntroductions).toHaveLength(scenario.from === "cover" ? 0 : 1);
      expect(recovered.lab?.intents).toHaveLength(scenario.recovery === "back-to-source" ? 2 : 1);
      if (scenario.recovery === "retry") expect(recovered.lab?.intents[0].id).toBe(receipt?.transactionId);
      else expect(recovered.lab?.intents[1].id).not.toBe(receipt?.transactionId);
      const camera = recovered.lab!.camera;
      expect(camera).toHaveLength(typeof scenario.from === "number" && scenario.from < 5 ? scenario.recovery === "back-to-source" ? 2 : 1 : 0);
      expect(camera.every((record) => record.stopped && record.stops === 1 && record.qrPaintedAt !== null && record.audio === false)).toBe(true);
      expect(recovered.lab?.errors).toEqual([]); expect(pageErrors).toEqual([]);
      expect(httpErrors.filter((error) => new URL(error.url).pathname !== scenario.exclusiveAsset)).toEqual([]);
      expect(requestFailures.filter((failure) => new URL(failure.url).pathname !== scenario.exclusiveAsset && !failure.error?.includes("ERR_ABORTED"))).toEqual([]);
      if (scenario.fault === "404") expect(httpErrors.some((error) => new URL(error.url).pathname === scenario.exclusiveAsset && error.status === 404)).toBe(true);
      await expect(page.getByRole("button", { name: /omitir|saltar/i })).toHaveCount(0);
      indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex"); expect(indexAfter).toBe(indexBefore);
    } finally {
      if (!indexAfter) indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
      await info.attach("OBS03-transition-recovery-evidence", { body: JSON.stringify({ qualification: "Synthetic closed-source fixtures, real UI recovery and production decoder through canvas camera. Service workers blocked only for deterministic network faults. Not an earned whole journey or physical camera/deployment approval.", scenario, baseURL, indexBefore, indexAfter, faults, httpErrors, requestFailures, pageErrors, phases, final: await snapshot(page) }, null, 2), contentType: "application/json" });
      expect(indexAfter).toBe(indexBefore);
    }
  });
});
