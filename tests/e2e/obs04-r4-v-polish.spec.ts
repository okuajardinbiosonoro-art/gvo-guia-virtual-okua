import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const fixturePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes = readFileSync(fixturePath);
const prior = JSON.parse(fixtureBytes.toString("utf8")).normalScans[3].after;
const profiles = [
  { name: "en390", locale: "en", width: 390, height: 844, text200: false },
  { name: "es390", locale: "es", width: 390, height: 844, text200: false },
  { name: "en280", locale: "en", width: 280, height: 653, text200: false },
  { name: "es390-text200", locale: "es", width: 390, height: 844, text200: true },
] as const;
const active = ".gvo-prepared-tree[data-journey-active='true'] main.s5-quiz";

async function geometry(page: Page, phase: string) {
  return page.locator(active).evaluate((main, phase) => {
    const dock = document.querySelector(".gvo-immersive-shell__control")!.getBoundingClientRect();
    const fragments = Array.from(main.querySelectorAll(".s5-question-prompt h2,.s5-question-prompt p")).flatMap((element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), output = [];
      let node;
      while ((node = walker.nextNode())) for (let i = 0; i < node.textContent!.length; i++) {
        if (!node.textContent![i].trim()) continue;
        const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1);
        for (const rect of range.getClientRects()) output.push({ text: node.textContent![i], rect: rect.toJSON(), overlap: Math.max(0, Math.min(rect.right, dock.right) - Math.max(rect.left, dock.left)) * Math.max(0, Math.min(rect.bottom, dock.bottom) - Math.max(rect.top, dock.top)) });
      }
      return output;
    });
    return { phase, scrollY, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, documentWidth: document.documentElement.scrollWidth, dock: dock.toJSON(), prompt: main.querySelector(".s5-question-prompt")!.getBoundingClientRect().toJSON(), fragments, overlapping: fragments.filter((fragment) => fragment.overlap > .25), options: Array.from(main.querySelectorAll("[data-answer]")).map((option) => option.getBoundingClientRect().toJSON()), focus: document.activeElement?.className };
  }, phase);
}

for (const profile of profiles) test(`OBS04 R4 V prompt fixed-control safe strip ${profile.name}`, async ({ browser, baseURL, request }, info) => {
  if (!baseURL) throw Error("Explicit root-approved compiled loopback candidate required");
  const context = await browser.newContext({ baseURL, viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: 1, hasTouch: true, reducedMotion: "no-preference", serviceWorkers: "block" });
  await context.addInitScript(({ prior, profile }) => {
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", profile.locale);
    for (const [key, value] of [["gvo.journey.essential.v1", prior.essential], ["gvo.progress.v1", prior.progress], ["gvo.station4.ordering.v1", prior.ordering]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (prior.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", prior.legacyPracticeRaw);
    if (profile.text200) {
      const apply = () => document.documentElement.style.fontSize = "200%";
      if (document.documentElement) apply(); else new MutationObserver((_, observer) => { if (document.documentElement) { apply(); observer.disconnect(); } }).observe(document, { childList: true, subtree: true });
    }
  }, { prior, profile });
  const page = await context.newPage(), rows: Awaited<ReturnType<typeof geometry>>[] = [], errors: string[] = [];
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  expect(indexBefore).toBe(process.env.GVO_OBS04_EXPECTED_INDEX_SHA256);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const save = () => writeFileSync(info.outputPath("V-prompt-corner-journal.json"), JSON.stringify({ profile, indexBefore, fixture: { path: fixturePath, sha256: createHash("sha256").update(fixtureBytes).digest("hex"), selection: "normalScans[3].after" }, qualification: "Declared acquired I–IV prior-access fixture. Chromium emulated touch and ordinary wheel; CSS root font200 is not native browser zoom or physical-device approval.", rows, errors }, null, 2));
  const sample = async (phase: string) => {
    const row = await geometry(page, phase); rows.push(row); save();
    await page.screenshot({ path: info.outputPath(`${phase}-viewport.png`), scale: "css" });
    expect(row.documentWidth).toBeLessThanOrEqual(profile.width);
    for (const option of row.options) { expect(option.width).toBeGreaterThanOrEqual(96); expect(option.height).toBeGreaterThanOrEqual(96); }
  };
  try {
    await page.goto("/estacion/5"); await expect(page.locator(active)).toBeVisible(); await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0); await page.evaluate(() => document.fonts.ready);
    for (const area of ["plantas", "sistema"] as const) {
      await expect(page.locator(active)).toHaveAttribute("data-station5-area", area);
      await page.locator(".s5-question-prompt h2").focus(); await sample(`${area}-question-focus`);
      for (const side of ["disagreement", "agreement"] as const) {
        const option = page.locator(`[data-answer='${side}']`); await option.scrollIntoViewIfNeeded(); await option.tap();
      }
      await expect(page.locator("[data-answer='agreement']")).toBeDisabled(); await sample(`${area}-after-answer`);
      // Ordinary wheel aligns the existing instruction with the fixed corner, a
      // transient position explicitly observed in R4. No product/CSS mutation.
      const delta = await page.locator(".s5-question-prompt p").last().evaluate((element) => element.getBoundingClientRect().top - 18);
      await page.mouse.move(profile.width / 2, profile.height / 2); await page.mouse.wheel(0, delta);
      await expect.poll(async () => Math.abs((await page.locator(".s5-question-prompt p").last().boundingBox())!.y - 18)).toBeLessThan(3);
      await sample(`${area}-ordinary-scroll`);
      if (area === "plantas") { await page.locator(".s5-quiz-advance").scrollIntoViewIfNeeded(); await page.locator(".s5-quiz-advance").tap(); }
    }
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex"); expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
    expect(rows.filter((row) => row.overlapping.length > 0).map((row) => ({ phase: row.phase, characters: row.overlapping })), "Actual non-whitespace character ranges must not intersect the fixed fullscreen control in any measured phase").toEqual([]);
  } finally { save(); await info.attach("OBS04-R4-V-prompt-corner-evidence", { path: info.outputPath("V-prompt-corner-journal.json"), contentType: "application/json" }); await context.close(); }
});
