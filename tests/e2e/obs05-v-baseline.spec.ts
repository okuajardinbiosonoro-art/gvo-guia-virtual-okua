import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { getWorld5Question } from "../../src/screens/World5Root/world5QuizContent";

const fixturePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes = readFileSync(fixturePath);
// Actual preserved arrival after fourth QR: acquired Iâ€“IV, V not closed, quiz empty.
// This is declared prior access in isolated contexts, not a new earned journey.
const prior = JSON.parse(fixtureBytes.toString("utf8")).normalScans[3].after;
const profiles = [
  { name: "es390", locale: "es", width: 390, height: 844, text200: false },
] as const;
const root = ".gvo-prepared-tree[data-journey-active='true'] main.s5-quiz";
type Row = Record<string, unknown>;

async function tap(control: Locator, rows: Row[]) {
  await expect(control).toBeEnabled(); await control.scrollIntoViewIfNeeded();
  const geometry = await control.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { rect: rect.toJSON(), name: element.getAttribute("aria-label") ?? element.textContent,
      points: [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]].map(([a, b]) => {
        const x = rect.left + rect.width * a, y = rect.top + rect.height * b, hit = document.elementFromPoint(x, y);
        return { x, y, class: hit?.className, matches: !!hit && (hit === element || element.contains(hit)) };
      }) };
  });
  rows.push({ kind: "before-native-emulated-touch", ...geometry });
  expect(geometry.rect.width).toBeGreaterThanOrEqual(44); expect(geometry.rect.height).toBeGreaterThanOrEqual(44);
  expect(geometry.points.every((point) => point.matches), String(geometry.name)).toBe(true);
  await control.tap(); // Emulated browser touchscreen, never a physical-device claim.
}
async function measure(page: Page) {
  return page.locator(root).evaluate((element) => {
    const describe = (node: Element) => ({ class: node.className, rect: node.getBoundingClientRect().toJSON(), scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight });
    const texts = Array.from(element.querySelectorAll(".s5-quiz-nav-title,.s5-question-prompt h2,.s5-question-prompt p,.s5-question-response p,.s5-quiz-option > span")).map((node) => {
      const range = document.createRange(); range.selectNodeContents(node);
      const fragments = Array.from(range.getClientRects()).map((rect) => rect.toJSON());
      const clips = [];
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent), rect = parent.getBoundingClientRect();
        for (const fragment of fragments) {
          const dx = Math.max(0, rect.left - fragment.left, fragment.right - rect.right), dy = Math.max(0, rect.top - fragment.top, fragment.bottom - rect.bottom);
          if ((/^(hidden|clip)$/.test(style.overflowX) && dx > 2) || (/^(hidden|clip)$/.test(style.overflowY) && dy > 2)) clips.push({ ...describe(parent), dx, dy });
        }
      }
      return { text: node.textContent, fragments, clips };
    });
    const lia = element.querySelector(".s5-quiz-lia")!.getBoundingClientRect();
    const answers = Array.from(element.querySelectorAll("[data-answer]")).map((node) => {
      const label = node.querySelector("span")!.getBoundingClientRect();
      return { ...describe(node), label: label.toJSON(), labelOverLia: Math.max(0, Math.min(label.right, lia.right) - Math.max(label.left, lia.left)) * Math.max(0, Math.min(label.bottom, lia.bottom) - Math.max(label.top, lia.top)) };
    });
    const prompt = element.querySelector(".s5-question-prompt")!, options = element.querySelector(".s5-quiz-options"), response = element.querySelector(".s5-question-response")!;
    return { viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scrollY,
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      gallery: element.querySelector(".s5-quiz-gallery")?.getAttribute("src"),
      nav: describe(element.querySelector(".s5-quiz-nav")!), texts, answers, lia: lia.toJSON(),
      actualDomOrder: !!options && !!(prompt.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(options.compareDocumentPosition(response) & Node.DOCUMENT_POSITION_FOLLOWING) };
  });
}

for (const profile of profiles) test(`OBS05 V visual baseline four questions and result ${profile.name}`, async ({ browser, baseURL, request }, info) => {
  if (!baseURL) throw Error("Root-approved loopback candidate required");
  const context = await browser.newContext({ baseURL, viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: 1, hasTouch: true, serviceWorkers: "block", reducedMotion: "no-preference" });
  await context.addInitScript(({ state, profile }) => {
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", profile.locale);
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
    if (profile.text200) {
      const apply = () => document.documentElement.style.fontSize = "200%";
      if (document.documentElement) apply(); else new MutationObserver((_, observer) => { if (document.documentElement) { apply(); observer.disconnect(); } }).observe(document, { childList: true, subtree: true });
    }
  }, { state: prior, profile });
  const page = await context.newPage(), rows: Row[] = [], errors: string[] = [];
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  rows.push({ profile, indexBefore, fixture: { path: fixturePath, sha256: createHash("sha256").update(fixtureBytes).digest("hex"), selection: "normalScans[3].after" }, qualification: "Declared acquired Iâ€“IV / empty quiz prior-access fixture. Four real UI question pairs through Chromium emulated touch; not physical touch, new earned journey, native zoom or human approval." });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const save = () => writeFileSync(info.outputPath("V-gallery-journal.json"), JSON.stringify({ rows, errors }, null, 2));
  try {
    await page.goto("/estacion/5"); await expect(page.locator(root)).toBeVisible(); await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0); await page.evaluate(() => document.fonts.ready);
    for (const [index, area] of (["plantas", "sistema", "espacio", "visitante"] as const).entries()) {
      const source = getWorld5Question(area, profile.locale);
      await expect(page.locator(root)).toHaveAttribute("data-station5-area", area);
      await expect(page.locator(".s5-quiz-question")).toHaveText(source.question);
      await expect(page.locator(".s5-quiz-question")).toHaveAttribute("data-source-id", source.sourceId);
      await expect(page.getByRole("group", { name: source.question })).toHaveAccessibleDescription(source.instruction);
      const before = await measure(page); rows.push({ kind: "before-answer", area, ...before }); save();
      expect(before.document.width).toBeLessThanOrEqual(profile.width); expect(before.actualDomOrder).toBe(true);
      expect(before.gallery).toMatch(/world5_map_environment_(portrait|landscape)_v01\.webp$/);
      expect(before.answers).toHaveLength(2);
      for (const answer of before.answers) { expect(answer.rect.width).toBeGreaterThanOrEqual(96); expect(answer.rect.height).toBeGreaterThanOrEqual(96); expect(answer.labelOverLia).toBe(0); }
      for (const text of before.texts) expect(text.clips, String(text.text)).toEqual([]);
      await tap(page.locator("[data-answer='disagreement']"), rows);
      await expect(page.locator(root)).toHaveAttribute("data-station5-state", "resolved");
      await tap(page.locator("[data-answer='agreement']"), rows);
      await expect(page.locator("[data-answer='agreement']")).toBeDisabled();
      const after = await measure(page); rows.push({ kind: "after-correct", area, ...after }); save();
      for (const text of after.texts) expect(text.clips, String(text.text)).toEqual([]);
      await page.screenshot({ path: info.outputPath(`V-${index + 1}-${area}-viewport.png`), scale: "css" });
      const quiz = await page.evaluate(() => JSON.parse(localStorage.getItem("gvo.station5.quiz.v1")!));
      expect(quiz.correctAnswers).toEqual(["plantas", "sistema", "espacio", "visitante"].slice(0, index + 1));
      await tap(page.locator(".s5-quiz-advance"), rows);
    }
    await expect(page.locator(root)).toHaveAttribute("data-station5-state", "result");
    const close = page.getByRole("button", { name: profile.locale === "es" ? "Ir al Mirador" : "Go to the Lookout" });
    await expect(close).toBeVisible();
    await page.locator(".s5-quiz-scene").scrollIntoViewIfNeeded();
    const resultGeometry = await measure(page);
    const resultSourceState = await page.locator(root).evaluate((element) => ({
      state: element.getAttribute("data-station5-state"),
      environment: element.querySelector(".s5-quiz-environment")?.getAttribute("src"),
      lia: { rect: element.querySelector(".s5-quiz-lia")!.getBoundingClientRect().toJSON(), computedWidth: getComputedStyle(element.querySelector(".s5-quiz-lia")!).width, petals: element.querySelectorAll("[data-lia-rig-layer^='petal-']").length },
      resultText: element.querySelector(".s5-question-response")?.textContent,
    }));
    rows.push({ kind: "OBS05-baseline-result-awaiting-manual-close", resultGeometry, resultSourceState }); save();
    await page.screenshot({ path: info.outputPath("V-5-result-lia-viewport.png"), scale: "css" });
    const final = await page.evaluate(() => ({ essential: JSON.parse(localStorage.getItem("gvo.journey.essential.v1")!), progress: JSON.parse(localStorage.getItem("gvo.progress.v1")!), quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1")!) }));
    expect(final.progress.completedStations).toEqual([1, 2, 3, 4]); expect(final.essential.stations[5].closed).toBe(false); expect(final.quiz.correctAnswers).toHaveLength(4);
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex"); expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
    rows.push({ kind: "result-awaits-manual-closure", final, indexAfter });
  } catch (error) { await page.screenshot({ path: info.outputPath("V-failure-viewport.png"), scale: "css" }).catch(() => {}); throw error; }
  finally { save(); await info.attach("OBS04-V-gallery-evidence", { path: info.outputPath("V-gallery-journal.json"), contentType: "application/json" }); await context.close(); }
});
