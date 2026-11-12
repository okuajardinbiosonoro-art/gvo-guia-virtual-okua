import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const sourcePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const sourceBytes = readFileSync(sourcePath);
const state = JSON.parse(sourceBytes.toString("utf8")).normalScans[0].after;
const root = ".gvo-prepared-tree[data-journey-active='true'] main.world2-root-screen";

test("OBS04 II passive Mapping390 actor/result diagnostic", async ({ page, request }, info) => {
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  await page.addInitScript((state) => {
    // Isolated declared prior-access fixture. No physical/earned claim.
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", "es");
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering], ["gvo.station5.quiz.v1", state.quiz]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
  }, state);
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto("/estacion/2"); await expect(page.locator(root)).toBeVisible();
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  for (let step = 0; step < 2; step++) await page.locator(root + " .world2-reading-advance").click();
  await page.locator(root + " .world2-reading-assist").click();
  for (let step = 0; step < 2; step++) await page.locator(root + " .world2-reading-advance").click();
  await expect(page.locator(root)).toHaveAttribute("data-world2-state", "mapeo");
  await page.locator(".world2-mapping-sequence__core[type='button']").click();
  const result = page.locator(".world2-mapping-result"); await expect(result).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const sampled = await page.locator(root).evaluate(async (element) => {
    const actor = element.querySelector("[data-world2-lia-actor]")!;
    const paintedRig = actor.querySelector("[data-lia-target]") ?? actor.querySelector(".world2-scene-asset--lia")!;
    const result = element.querySelector(".world2-mapping-result")!;
    const describe = (node: Element) => {
      const style = getComputedStyle(node);
      return { tag: node.tagName, class: node.className, rect: node.getBoundingClientRect().toJSON(), clientHeight: node.clientHeight, scrollHeight: node.scrollHeight,
        position: style.position, top: style.top, right: style.right, bottom: style.bottom, left: style.left, width: style.width, height: style.height,
        transform: style.transform, transformOrigin: style.transformOrigin, overflowX: style.overflowX, overflowY: style.overflowY,
        transition: style.transition, profileX: style.getPropertyValue("--world2-lia-profile-x"), profileY: style.getPropertyValue("--world2-lia-profile-y"), profileScale: style.getPropertyValue("--world2-lia-profile-scale") };
    };
    const frames: Array<Record<string, unknown>> = [], start = performance.now();
    await new Promise<void>((done) => {
      const sample = () => {
        const range = document.createRange(); range.selectNodeContents(result);
        frames.push({ ms: performance.now() - start, actor: describe(actor), rig: describe(paintedRig), result: describe(result), textFragments: Array.from(range.getClientRects()).map((r) => r.toJSON()) });
        if (performance.now() - start >= 750) done(); else requestAnimationFrame(sample);
      }; requestAnimationFrame(sample);
    });
    const clipContext = []; for (let node = result.parentElement; node; node = node.parentElement) clipContext.push(describe(node));
    const actorClipContext = []; for (let node = actor.parentElement; node; node = node.parentElement) actorClipContext.push(describe(node));
    return { viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scroll: { x: scrollX, y: scrollY }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, frames, clipContext, actorClipContext };
  });
  await result.scrollIntoViewIfNeeded();
  const afterScroll = await page.locator(root).evaluate((element) => ({ scrollY, actor: element.querySelector("[data-world2-lia-actor]")!.getBoundingClientRect().toJSON(), result: element.querySelector(".world2-mapping-result")!.getBoundingClientRect().toJSON() }));
  await page.screenshot({ path: info.outputPath("Mapping390-actor-result-viewport.png"), scale: "css" });
  const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  const path = info.outputPath("Mapping390-actor-result.json");
  writeFileSync(path, JSON.stringify({ qualification: "Passive DOM/Range/computed styles and750ms native frame sampling. Real UI from declared prior-access fixture; no CSS overrides, alternative anchors, fake clock or product state API. Rectangles include transparent raster bounds, not painted alpha coverage.", fixtureSource: sourcePath, fixtureSha256: createHash("sha256").update(sourceBytes).digest("hex"), indexBefore, indexAfter, sampled, afterScroll, errors }, null, 2));
  await info.attach("OBS04-II-Mapping-Lia-diagnostic", { path, contentType: "application/json" });
  expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
});


// Separate from the preserved Mapping390 historical diagnostic: this case samples
// only after the native result scroll, so the actual painted overlap can be inspected.
test("OBS04 II passive Mapping568 visible-result actor diagnostic", async ({ page, request }, info) => {
  await page.setViewportSize({ width: 568, height: 280 });
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  await page.addInitScript((state) => {
    // Isolated declared prior-access fixture. No physical/earned claim.
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", "es");
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering], ["gvo.station5.quiz.v1", state.quiz]]) if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
  }, state);
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto("/estacion/2"); await expect(page.locator(root)).toBeVisible();
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  for (let step = 0; step < 2; step++) await page.locator(root + " .world2-reading-advance").click();
  await page.locator(root + " .world2-reading-assist").click();
  for (let step = 0; step < 2; step++) await page.locator(root + " .world2-reading-advance").click();
  await expect(page.locator(root)).toHaveAttribute("data-world2-state", "mapeo");
  await page.locator(".world2-mapping-sequence__core[type='button']").click();
  const result = page.locator(root + " .world2-mapping-result"); await expect(result).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const beforeScroll = await result.evaluate((node) => ({ scrollY, rect: node.getBoundingClientRect().toJSON() }));
  // Browser-native scrolling, without temporary CSS, forced clicks or clock changes.
  await result.evaluate((node) => node.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }));
  const sampled = await page.locator(root).evaluate(async (element) => {
    const actor = element.querySelector("[data-world2-lia-actor]")!;
    const rig = actor.querySelector("[data-lia-target]") ?? actor.querySelector(".world2-scene-asset--lia")!;
    const result = element.querySelector(".world2-mapping-result")!;
    const describe = (node: Element) => {
      const style = getComputedStyle(node);
      return { tag: node.tagName, class: node.className, rect: node.getBoundingClientRect().toJSON(), clientHeight: node.clientHeight, scrollHeight: node.scrollHeight,
        position: style.position, top: style.top, right: style.right, bottom: style.bottom, left: style.left, width: style.width, height: style.height,
        transform: style.transform, transformOrigin: style.transformOrigin, overflowX: style.overflowX, overflowY: style.overflowY,
        transition: style.transition, profileX: style.getPropertyValue("--world2-lia-profile-x"), profileY: style.getPropertyValue("--world2-lia-profile-y"), profileScale: style.getPropertyValue("--world2-lia-profile-scale") };
    };
    const frames: Array<Record<string, unknown>> = [], start = performance.now();
    await new Promise<void>((done) => {
      const sample = () => {
        const range = document.createRange(); range.selectNodeContents(result);
        frames.push({ ms: performance.now() - start, scrollY, actor: describe(actor), rig: describe(rig), result: describe(result), textFragments: Array.from(range.getClientRects()).map((r) => r.toJSON()) });
        if (performance.now() - start >= 750) done(); else requestAnimationFrame(sample);
      }; requestAnimationFrame(sample);
    });
    const clipContext = []; for (let node = result.parentElement; node; node = node.parentElement) clipContext.push(describe(node));
    const actorClipContext = []; for (let node = actor.parentElement; node; node = node.parentElement) actorClipContext.push(describe(node));
    const resultRect = result.getBoundingClientRect();
    return { viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scroll: { x: scrollX, y: scrollY }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      resultFullyInViewport: resultRect.top >= 0 && resultRect.bottom <= innerHeight && resultRect.left >= 0 && resultRect.right <= innerWidth,
      frames, clipContext, actorClipContext, images: Array.from(actor.querySelectorAll("img")).map((image) => ({ src: image.getAttribute("src"), currentSrc: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })) };
  });
  await page.screenshot({ path: info.outputPath("Mapping568-visible-result-viewport.png"), scale: "css" });
  const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  const path = info.outputPath("Mapping568-visible-result.json");
  writeFileSync(path, JSON.stringify({ qualification: "Passive750ms DOM/Range/computed styles after native scroll places the complete result in viewport. Real UI from declared prior-access fixture, Chromium568x280/DPR1; no CSS overrides, alternative anchors, fake clock or product state API. Transparent raster bounds do not prove painted collision; inspect native PNG.", fixtureSource: sourcePath, fixtureSha256: createHash("sha256").update(sourceBytes).digest("hex"), indexBefore, indexAfter, beforeScroll, sampled, errors }, null, 2));
  await info.attach("OBS04-II-Mapping568-visible-result-diagnostic", { path, contentType: "application/json" });
  expect(sampled.resultFullyInViewport).toBe(true); expect(sampled.document.width).toBeLessThanOrEqual(sampled.viewport.width);
  expect(indexAfter).toBe(indexBefore); expect(errors).toEqual([]);
});
