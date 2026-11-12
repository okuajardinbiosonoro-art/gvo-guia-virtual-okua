import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import type { VerifiedEssentialSnapshot } from "../../src/app/journey/journeyEssential";

const fixturePath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes = readFileSync(fixturePath);
const fixtureSha256 = createHash("sha256").update(fixtureBytes).digest("hex");
const earned = (JSON.parse(fixtureBytes.toString("utf8")) as { endEarned: {
  essential: VerifiedEssentialSnapshot;
  progress: { completedStations: number[] };
  ordering: unknown;
  quiz: unknown;
  legacyPracticeRaw: string | null;
} }).endEarned;
if (!earned.essential.finalReached || earned.progress.completedStations.join(",") !== "1,2,3,4,5") throw new Error("Preserved fresh06 fixture is not an earned final state");

const profiles = [
  { name: "desktop-es", locale: "es", width: 1440, height: 900 },
  { name: "tablet-en", locale: "en", width: 768, height: 1024 },
] as const;
const roots = { 1: "main.world1-root-screen", 2: "main.world2-root-screen", 3: "main.s3-practice-screen", 4: "main.s4-ordering", 5: "main.s5-quiz", final: "main.final-root-shell" };
const accessIds = ["i", "ii", "iii", "iv", "v"];
type Row = Record<string, unknown>;

/** Replays a preserved earned result only inside a new Playwright context.
 * This is declared review access, not a second UI-earned journey. No new IV
 * explanation is fabricated: existing acquired credit authorizes consultation. */
async function installFixture(page: Page, locale: "es" | "en") {
  await page.addInitScript(({ state, language }) => {
    localStorage.setItem("gvo.language.v1", language);
    for (const [key, value] of [["gvo.journey.essential.v1", state.essential], ["gvo.progress.v1", state.progress], ["gvo.station4.ordering.v1", state.ordering], ["gvo.station5.quiz.v1", state.quiz]] as const) {
      if (value !== null) localStorage.setItem(key, JSON.stringify(value));
    }
    if (state.legacyPracticeRaw !== null) localStorage.setItem("gvo.station3.practice.v2", state.legacyPracticeRaw);
  }, { state: earned, language: locale });
}
async function facts(page: Page) {
  return page.evaluate(() => ["gvo.journey.essential.v1", "gvo.progress.v1", "gvo.station4.ordering.v1", "gvo.station4.explanation.v1", "gvo.station5.quiz.v1", "gvo.station2.v1", "gvo.station3.v1", "gvo.station3.practice.v2", "gvo.language.v1"].map((key) => ({ key, raw: localStorage.getItem(key) })));
}
async function ready(page: Page, selector: string) {
  const root = page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${selector}`);
  await expect(root).toBeVisible({ timeout: 25_000 });
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
  return root;
}
async function target(control: Locator) {
  await control.scrollIntoViewIfNeeded();
  return control.evaluate((node) => {
    const r = node.getBoundingClientRect();
    return { label: node.getAttribute("aria-label") ?? node.textContent, class: node.className, rect: r.toJSON(), target44: r.width >= 44 && r.height >= 44, viewport: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1,
      points: [[.5, .5], [.25, .25], [.75, .25], [.25, .75], [.75, .75]].map(([a, b]) => { const x = r.left + r.width * a, y = r.top + r.height * b, hit = document.elementFromPoint(x, y); return { x, y, hit: hit?.tagName, hitClass: hit?.getAttribute("class"), matches: !!hit && (node === hit || node.contains(hit)) }; }) };
  });
}
async function click(control: Locator, rows: Row[]) {
  await expect(control).toBeEnabled(); const measured = await target(control); rows.push({ kind: "before-native-click", ...measured });
  expect(measured.target44, String(measured.label)).toBe(true); expect(measured.viewport).toBe(true);
  expect(measured.points.every((p) => p.matches), `Native pointer target: ${measured.label}`).toBe(true);
  await control.click(); // No force, Enter fallback, fake time or readiness hook.
}

/** Reach text through real scroll ancestors. Range geometry is not raster ink
 * or universal contrast certification. Deliberate SR-only copy is inventoried
 * as excluded; disabled but visually rendered labels remain text candidates. */
async function textGeometry(root: Locator) {
  return root.evaluate(async (scope) => {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT), nodes: Text[] = [], excluded = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text, element = node.parentElement;
      if (!element || !node.textContent?.trim()) continue;
      const s = getComputedStyle(element);
      if (element.closest(".final-root-sr-only,.world2-root-sr-only,.sr-only,[hidden],[inert]") || s.display === "none" || s.visibility !== "visible") { excluded.push({ text: node.textContent, class: element.className, reason: "SR-only/hidden/inert/non-rendered" }); continue; }
      let opacity = 1; for (let a: Element | null = element; a; a = a.parentElement) opacity *= Number(getComputedStyle(a).opacity);
      if (opacity <= 0) { excluded.push({ text: node.textContent, class: element.className, reason: "effective opacity0 at sample" }); continue; }
      nodes.push(node);
    }
    const lines = [];
    for (const node of nodes) {
      const element = node.parentElement!, range = document.createRange(); range.selectNodeContents(node);
      const count = range.getClientRects().length;
      for (let index = 0; index < count; index++) {
        for (let a = element.parentElement; a; a = a.parentElement) {
          const r = range.getClientRects()[index]; if (!r) continue;
          const s = getComputedStyle(a), b = a.getBoundingClientRect(), sx = b.width / (a.offsetWidth || b.width || 1), sy = b.height / (a.offsetHeight || b.height || 1);
          if (/^(auto|scroll)$/.test(s.overflowY) && a.scrollHeight > a.clientHeight + 1) a.scrollTop += ((r.top + r.bottom) / 2 - (b.top + (a.clientTop + a.clientHeight / 2) * sy)) / sy;
          if (/^(auto|scroll)$/.test(s.overflowX) && a.scrollWidth > a.clientWidth + 1) a.scrollLeft += ((r.left + r.right) / 2 - (b.left + (a.clientLeft + a.clientWidth / 2) * sx)) / sx;
        }
        const before = range.getClientRects()[index];
        if (before && document.documentElement.scrollHeight > innerHeight + 1) window.scrollBy(0, (before.top + before.bottom) / 2 - innerHeight / 2);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const r = range.getClientRects()[index]; if (!r || r.width < .1 || r.height < .1) continue;
        const clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight }, chain = [];
        for (let a = element.parentElement; a; a = a.parentElement) {
          const s = getComputedStyle(a), b = a.getBoundingClientRect(), sx = b.width / (a.offsetWidth || b.width || 1), sy = b.height / (a.offsetHeight || b.height || 1);
          if (s.overflowX !== "visible") { clip.left = Math.max(clip.left, b.left + a.clientLeft * sx); clip.right = Math.min(clip.right, b.left + (a.clientLeft + a.clientWidth) * sx); }
          if (s.overflowY !== "visible") { clip.top = Math.max(clip.top, b.top + a.clientTop * sy); clip.bottom = Math.min(clip.bottom, b.top + (a.clientTop + a.clientHeight) * sy); }
          if (s.overflowX !== "visible" || s.overflowY !== "visible") chain.push({ class: a.className, overflowX: s.overflowX, overflowY: s.overflowY, rect: b.toJSON() });
        }
        lines.push({ text: node.textContent, tag: element.tagName, class: element.className, index, rect: r.toJSON(), clip, chain, reachable: r.left >= clip.left - 1 && r.right <= clip.right + 1 && r.top >= clip.top - 1 && r.bottom <= clip.bottom + 1 });
      }
    }
    return { lines, excluded };
  });
}
async function capture(page: Page, root: Locator, label: string, rows: Row[], info: TestInfo) {
  const initial = await root.evaluate((node) => {
    const box = node.getBoundingClientRect(), title = node.querySelector("h1"), range = document.createRange();
    if (title) range.selectNodeContents(title);
    const controls = Array.from(document.querySelectorAll(".final-review-return-control,[data-gvo-immersive-control='fullscreen']")).filter((control) => { const r = control.getBoundingClientRect(); return r.width && r.height && getComputedStyle(control).visibility === "visible"; }).map((control) => ({ class: control.className, rect: control.getBoundingClientRect().toJSON() }));
    return { main: box.toJSON(), viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, documentWidth: document.documentElement.scrollWidth, scrollY,
      title: title?.textContent, titleFragments: title ? Array.from(range.getClientRects()).map((r) => ({ rect: r.toJSON(), collisions: controls.flatMap((c) => { const area = Math.max(0, Math.min(r.right, c.rect.right) - Math.max(r.left, c.rect.left)) * Math.max(0, Math.min(r.bottom, c.rect.bottom) - Math.max(r.top, c.rect.top)); return area > 1 ? [{ ...c, area }] : []; }) })) : [], controls };
  });
  rows.push({ kind: "initial-scene", label, ...initial });
  const image = info.outputPath(label + "-native-viewport.png"); await page.screenshot({ path: image, fullPage: false, scale: "css" });
  rows.push({ kind: "native-viewport-capture", label, path: image, fullPage: false });
  const text = await textGeometry(root); rows.push({ kind: "text-reachability", label, ...text });
  const controls = [];
  for (const control of await root.locator("button,a[href],[role='button']").all()) {
    if (!await control.isVisible() || !await control.isEnabled() || await control.getAttribute("aria-disabled") === "true") continue;
    controls.push(await target(control));
  }
  rows.push({ kind: "basic-44px-controls", label, controls });
  expect(initial.main.left).toBeGreaterThanOrEqual(-1); expect(initial.main.right).toBeLessThanOrEqual(initial.viewport.width + 1);
  expect(initial.main.width).toBeLessThanOrEqual(initial.viewport.width + 1); expect(initial.documentWidth).toBeLessThanOrEqual(initial.viewport.width + 1);
  expect(initial.titleFragments.every((fragment) => fragment.collisions.length === 0), label + " heading vs fixed controls").toBe(true);
  expect(text.lines.length).toBeGreaterThan(0); expect(text.lines.every((line) => line.reachable), label + " actual text clip chains").toBe(true);
  expect(controls.every((control) => control.target44), label + " basic44px targets").toBe(true);
}

for (const profile of profiles) test(`OBS04 wide screens · ${profile.name} · Mirador and five readonly rooms`, async ({ page, request }, info) => {
  await page.setViewportSize({ width: profile.width, height: profile.height }); await installFixture(page, profile.locale);
  const rows: Row[] = [{ qualification: "DECLARED fixture from actual fresh06.endEarned in a new isolated context; readonly consultation only, no new earned journey/camera/field or asset-generation claim", profile, fixturePath, fixtureSha256, sourceOriginalIndex: "47f05eb54200552e388d066fcfa16c4c656db60314ffcfee764f0192dea5aad2" }];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  if (process.env.GVO_OBS03_EXPECTED_INDEX_SHA256) expect(indexBefore).toBe(process.env.GVO_OBS03_EXPECTED_INDEX_SHA256);
  let baseline: Awaited<ReturnType<typeof facts>> | null = null;
  try {
    await page.goto("/final"); let final = await ready(page, roots.final); baseline = await facts(page);
    await capture(page, final, "00-mirador", rows, info);
    for (const world of [1, 2, 3, 4, 5] as const) {
      await click(final.locator(`[data-final-access-id="${accessIds[world - 1]}"]`), rows);
      let root = await ready(page, roots[world]);
      await expect(page.locator(`.final-review-mode-layout[data-final-review-active="true"][data-final-review-world="${world}"]`)).toBeVisible();
      await expect(page.locator(".final-review-return-control")).toBeVisible();
      if (world === 1) {
        await click(root.locator('[data-world1-root-node="relation"]'), rows);
        await expect(root.locator('[data-world1-reading-visible="true"][data-world1-narrative-state="relation"]')).toBeVisible();
      } else if (world === 2) {
        await click(root.locator('[data-world2-layer="mapeo"]'), rows);
        await expect(root).toHaveAttribute("data-world2-state", "mapeo");
        await click(root.getByRole("button", { name: profile.locale === "es" ? "Ver resultado" : "Show result", exact: true }), rows);
        await expect(root.locator('[data-mapping-result="all-correspondences"]')).toBeVisible();
      } else if (world === 3) {
        await click(root.locator('[data-station3-record="planta"]'), rows);
        await expect(root.locator('[data-station3-page="planta"]')).toBeVisible();
        await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0);
        await expect(root.locator(".s3-practice-paper")).toHaveAttribute("aria-busy", "false");
        await expect(root).toHaveAttribute("data-station3-folio", "1");
      } else if (world === 4) {
        const tour = root.getByRole("button", { name: profile.locale === "es" ? "Recorrer la explicación" : "Explore the explanation", exact: true });
        rows.push({ kind: "optional-IV-tour-availability", count: await tour.count() });
        if (await tour.count()) { await click(tour, rows); root = await ready(page, roots[4]); await expect(root).toHaveAttribute("data-station4-explanation-readonly", "true"); }
      } else {
        await expect(root).toHaveAttribute("data-station5-state", "result");
        await expect(root.locator(".s5-quiz-result")).toBeVisible();
        await expect(root.locator(".s5-quiz-nav button")).toHaveCount(4);
        expect(await root.locator(".s5-quiz-gallery").evaluate((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      }
      await capture(page, root, `0${world}-room-${world}`, rows, info);
      expect(await facts(page), `Room${world} readonly facts`).toEqual(baseline);
      await click(page.locator(".final-review-return-control"), rows); final = await ready(page, roots.final);
      await expect(page).toHaveURL(/\/final$/); expect(await facts(page)).toEqual(baseline);
      rows.push({ kind: "UI-return-to-Mirador", world, factsUnchanged: true });
    }
    expect(errors).toEqual([]);
  } finally {
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
    rows.push({ kind: "final", indexBefore, indexAfter, indexStable: indexAfter === indexBefore, errors, baseline, finalFacts: await facts(page).catch(() => null) });
    const path = info.outputPath("OBS04-WIDE-SCREENS-EVIDENCE.json"); writeFileSync(path, JSON.stringify(rows, null, 2) + "\n");
    await info.attach("OBS04-WIDE-SCREENS-EVIDENCE", { path, contentType: "application/json" });
    expect(indexAfter).toBe(indexBefore);
  }
});
