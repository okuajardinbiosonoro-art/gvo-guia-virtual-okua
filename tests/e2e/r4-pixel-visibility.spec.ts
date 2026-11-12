import { createHash } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

// R3-valid prior-access fixture. No earned journey/practice claim.
async function priorAccess(page: Page, locale: "es" | "en") {
  await page.addInitScript((locale) => {
    const steps = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof steps, closed: boolean) => ({ contentRevision: "OBS03.2", presentedStepIds: closed ? steps[id] : [], confirmedStepIds: closed ? steps[id] : [], assistedPresentedStepIds: [], activeStepId: closed ? null : steps[id][0], interactionEvidence: [], outcome: null, closed });
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", locale);
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", true), stations: { 1: room(1, true), 2: room(2, true), 3: room(3, false), 4: room(4, false), 5: room(5, false) }, legacyRouteCredit: 2, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2], updatedAt: "2026-10-23T12:00:00.000Z" }));
  }, locale);
}

type PixelSample = { ms: number; scrollY: number; mode: string | null; position: string; animationName: string; animationDuration: string; currentTime: number | null; frameRect: { x: number; y: number; width: number; height: number; top: number; right: number; bottom: number; left: number }; effectiveOpacity: number; viewportVisible: boolean };
type PixelJournal = { done: boolean; timedOut: boolean; samples: PixelSample[] };
declare global { interface Window { __r4PixelVisibility?: PixelJournal } }

async function armMotionJournal(page: Page, id: string, duration: number, reduced: boolean) {
  await page.evaluate(({ id, duration, reduced }) => {
    const journal: PixelJournal = { done: false, timedOut: false, samples: [] };
    window.__r4PixelVisibility = journal;
    const armedAt = performance.now(); let first: number | null = null;
    const tick = () => {
      const actor = document.querySelector<HTMLElement>(`[data-station3-lia="pixel-registered-clip"][data-lia-clip="${id}"]`);
      const frame = actor?.querySelector<HTMLElement>(".s3-lia-clip__frame");
      const eligible = actor?.dataset.liaClipStatus === "ready" && actor.dataset.liaActive === "true" && actor.dataset.liaTarget !== "index" && (reduced || actor.dataset.liaClipMode === "play");
      if (actor && frame && eligible) {
        const now = performance.now(); first ??= now;
        const r = frame.getBoundingClientRect(), style = getComputedStyle(frame);
        let opacity = 1, visible = true;
        for (let node: Element | null = frame; node; node = node.parentElement) {
          const s = getComputedStyle(node); opacity *= Number(s.opacity);
          visible &&= s.visibility === "visible" && s.display !== "none";
        }
        const animation = frame.getAnimations()[0];
        journal.samples.push({ ms: now - first, scrollY, mode: actor.dataset.liaClipMode ?? null, position: style.backgroundPosition, animationName: style.animationName, animationDuration: style.animationDuration, currentTime: animation ? Number(animation.currentTime) : null, frameRect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, right: r.right, bottom: r.bottom, left: r.left }, effectiveOpacity: opacity, viewportVisible: visible && opacity > 0 && r.width > 0 && r.height > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 });
        if (now - first >= (reduced ? 180 : duration + 180)) { journal.done = true; return; }
      }
      if (performance.now() - armedAt > 7000) { journal.done = true; journal.timedOut = true; return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { id, duration, reduced });
}

for (const locale of ["es", "en"] as const) for (const reduced of [false, true]) test(`R4 pixel clips 568×280 ${locale} · ${reduced ? "reduced static" : "natural visible sequence"}`, async ({ page }, info) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 568, height: 280 });
  await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
  await priorAccess(page, locale);
  const errors: string[] = [], reports = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const indexBefore = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
  if (process.env.GVO_OBS03_EXPECTED_INDEX_SHA256) expect(indexBefore).toBe(process.env.GVO_OBS03_EXPECTED_INDEX_SHA256);
  await page.goto("/estacion/3");
  const root = page.locator('.gvo-prepared-tree[data-journey-active="true"] main.s3-practice-screen');
  await expect(root).toBeVisible({ timeout: 25_000 });
  const profiles = [{ id: "intro", target: "planta", duration: 650 }, { id: "listening", target: "prototipo", duration: 1100 }, { id: "accompanying", target: "senal", duration: 850 }];
  try {
    for (const [index, clip] of profiles.entries()) {
      // Do not scroll actor into view or alter CSS. Ordinary page/action clicks
      // must reproduce any document scroll that previously moved it to y≈−428.
      await armMotionJournal(page, clip.id, clip.duration, reduced);
      const action = index === 0 ? root.locator('[data-station3-record="planta"]') : root.locator("[data-station3-page-next]");
      await expect(action).toBeEnabled(); await action.click();
      await expect(root.locator(`[data-station3-page="${clip.target}"] h2`)).toBeVisible();
      await expect.poll(() => page.evaluate(() => window.__r4PixelVisibility?.done), { timeout: 9000 }).toBe(true);
      const journal = (await page.evaluate(() => window.__r4PixelVisibility))!;
      const actor = root.locator(`[data-lia-clip="${clip.id}"][data-lia-target="${clip.target}"]`);
      await expect(actor).toHaveAttribute("data-lia-clip-status", "ready");
      await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0);
      const positions = [...new Set(journal.samples.map((sample) => sample.position))];
      const screenshot = info.outputPath(`${index + 1}-${clip.id}-568x280-native.png`);
      const png = await page.screenshot({ path: screenshot, fullPage: false, scale: "css", animations: "allow" });
      const heading = await root.locator(".s3-title h1").evaluate((title) => {
        const control = document.querySelector('[data-gvo-immersive-control="fullscreen"]');
        const text = title.getBoundingClientRect(), button = control?.getBoundingClientRect();
        const intersection = button ? Math.max(0, Math.min(text.right, button.right) - Math.max(text.left, button.left)) * Math.max(0, Math.min(text.bottom, button.bottom) - Math.max(text.top, button.top)) : 0;
        return { title: title.textContent, titleRect: text.toJSON(), controlRect: button?.toJSON() ?? null, intersection, titleInsideViewport: text.left >= -1 && text.right <= innerWidth + 1 && text.top >= -1 && text.bottom <= innerHeight + 1 };
      });
      reports.push({ clip, journal, positions, heading, screenshot, imagePixels: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, fullPage: false, css: await actor.evaluate((element) => ({ source: getComputedStyle(element.querySelector(".s3-lia-clip__frame")!).backgroundImage, pointerEvents: getComputedStyle(element).pointerEvents })) });
      expect.soft(heading.intersection, "Room title must not intersect fullscreen control").toBe(0);
      expect.soft(heading.titleInsideViewport).toBe(true);
      expect.soft(journal.timedOut, `${clip.id}: actual clip did not start`).toBe(false);
      expect.soft(journal.samples.length, `${clip.id}: no temporal samples`).toBeGreaterThan(2);
      expect.soft(journal.samples.every((sample) => sample.viewportVisible), `${clip.id}: frame must be vertically and horizontally visible during its real action`).toBe(true);
      if (reduced) {
        expect.soft(positions).toEqual(["100% 0%"]);
        expect.soft(journal.samples.every((sample) => sample.animationName === "none")).toBe(true);
      } else {
        expect.soft(positions.length).toBeGreaterThanOrEqual(4);
        expect.soft(journal.samples.at(-1)?.position).toBe("100% 100%");
        expect.soft(journal.samples.some((sample) => Math.abs(parseFloat(sample.animationDuration) * 1000 - clip.duration) < 1)).toBe(true);
      }
    }
  } finally {
    const indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
    const state = await page.evaluate(() => ({ essential: JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null"), progress: JSON.parse(localStorage.getItem("gvo.progress.v1") ?? "null"), practiceRaw: localStorage.getItem("gvo.station3.practice.v2") }));
    await info.attach("R4-three-clips-viewport-evidence", { body: JSON.stringify({ qualification: "Declared R3-valid prior access [1,2], ordinary ordered notebook UI, observer armed before each action. No actor scrollIntoView, CSS force, animation replay or semantic write hook. Rects include vertical viewport bounds during the actual650/1100/850ms clips and title/fullscreen intersection; PNGs are568×280 native viewport. Video follows root config. Does not certify human artistic acceptance or practice.", viewport: { width: 568, height: 280 }, locale, reduced, indexBefore, indexAfter, reports, state, errors }, null, 2), contentType: "application/json" });
    expect(indexAfter).toBe(indexBefore); expect(state.progress.completedStations).toEqual([1, 2]);
    expect(state.essential.stations[3].closed).toBe(false); expect(state.practiceRaw).toBeNull(); expect(errors).toEqual([]);
  }
});
