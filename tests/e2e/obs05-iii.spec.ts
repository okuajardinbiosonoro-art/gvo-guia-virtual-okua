import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const fixtureSourcePath = "tests/e2e/obs04-notebook.spec.ts";
const fixtureSourceSha256 = createHash("sha256").update(readFileSync(fixtureSourcePath)).digest("hex");
const rootSelector = ".gvo-prepared-tree[data-journey-active='true'] main.s3-practice-screen";
const cuts = [
  { name: "narrow280", width: 280, height: 568 },
  { name: "portrait390", width: 390, height: 844 },
  { name: "portrait428", width: 428, height: 926 },
  { name: "short568", width: 568, height: 280 },
  { name: "landscape844", width: 844, height: 390 },
] as const;
// These five run first; the remaining 35 retain identical criteria and are
// selected by a disjoint title prefix, without duplicating profile cases.
const smokeProfiles = new Set([
  "narrow280:es:natural:text200",
  "portrait390:es:natural:normal",
  "portrait428:en:natural:normal",
  "short568:en:reduced:text200",
  "landscape844:en:natural:normal",
]);

/** Same declared prior-access shape as the OBS04 notebook focal. This isolated
 * context does not claim that the visitor earned I/II or any III progress. */
async function installPriorAccess(page: Page, locale: "es" | "en", text200: boolean) {
  await page.addInitScript(({ locale, text200 }) => {
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof order, closed = false) => ({ contentRevision: "OBS03.2", presentedStepIds: closed ? [...order[id]] : [], confirmedStepIds: closed ? [...order[id]] : [], assistedPresentedStepIds: [], activeStepId: closed ? null : order[id][0], interactionEvidence: [], outcome: null, closed });
    localStorage.setItem("gvo.language.v1", locale);
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2], updatedAt: "2026-10-24T12:00:00.000Z" }));
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", true), stations: { 1: room(1, true), 2: room(2, true), 3: room(3), 4: room(4), 5: room(5) }, legacyRouteCredit: 2, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
    if (text200) {
      const apply = () => { document.documentElement.style.fontSize = "200%"; };
      if (document.documentElement) apply();
      else new MutationObserver((_, observer) => { if (document.documentElement) { apply(); observer.disconnect(); } }).observe(document, { childList: true, subtree: true });
    }
  }, { locale, text200 });
}

async function facts(page: Page) {
  return page.evaluate(() => ["gvo.language.v1", "gvo.progress.v1", "gvo.journey.essential.v1", "gvo.station2.v1", "gvo.station3.v1", "gvo.station3.practice.v2", "gvo.station4.ordering.v1", "gvo.station4.explanation.v1", "gvo.station5.quiz.v1"].map((key) => ({ key, raw: localStorage.getItem(key) })));
}

for (const cut of cuts) for (const locale of ["es", "en"] as const) for (const motion of ["natural", "reduced"] as const) for (const text200 of [false, true]) {
const batch = smokeProfiles.has(`${cut.name}:${locale}:${motion}:${text200 ? "text200" : "normal"}`) ? "smoke" : "matrix";
test(`OBS05 III ${batch} · ${cut.name} · ${locale} · ${motion} · ${text200 ? "text200" : "normal"}`, async ({ page, request }, info) => {
  const errors: string[] = [];
  const evidence: Record<string, unknown> = {
    qualification: "DECLARED_PRIOR_ACCESS_FIXTURE_NOT_A_FULL_UI_EARNED_JOURNEY; III begins unconfirmed. Initial DOM/geometry observation does not write facts. The normal natural390 cases then confirm only INTRO through native UI to check completed/current states. CSS200 is a declared text probe; no clock/readiness override.",
    fixture: { source: fixtureSourcePath, sourceSha256: fixtureSourceSha256, priorCompletedStations: [1, 2], IIIConfirmed: [] },
    profile: { locale, ...cut, motion, text200, amplificationQualification: text200 ? "Declared CSS root-font200% text/reflow probe, not native browser zoom" : "Runtime typography" },
  };
  const indexBefore = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
  expect(indexBefore).toBe(process.env.GVO_OBS05_EXPECTED_INDEX_SHA256);
  await page.setViewportSize({ width: cut.width, height: cut.height });
  await page.emulateMedia({ reducedMotion: motion === "reduced" ? "reduce" : "no-preference" });
  await installPriorAccess(page, locale, text200);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  try {
    await page.goto("/estacion/3");
    const root = page.locator(rootSelector);
    await expect(root).toBeVisible({ timeout: 25_000 });
    await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
    await expect(root.locator(".s3-practice-paper")).toHaveAttribute("aria-busy", "false");
    await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
    const before = await facts(page);
    const geometry = await root.evaluate((main) => {
      const title = main.querySelector<HTMLElement>(".s3-title h1")!, range = document.createRange(); range.selectNodeContents(title);
      const titleRect = range.getBoundingClientRect(), paper = main.querySelector<HTMLElement>(".s3-practice-paper")!.getBoundingClientRect();
      const header = main.querySelector<HTMLElement>(".s3-title")!, headerRect = header.getBoundingClientRect(), headerCss = getComputedStyle(header), titleCss = getComputedStyle(title);
      const scroll = main.querySelector<HTMLElement>(".s3-practice-scroll")!, scrollRect = scroll.getBoundingClientRect();
      const controls = Array.from(document.querySelectorAll<HTMLElement>("[data-gvo-immersive-control='fullscreen'],.final-review-return-control")).filter((node) => { const r = node.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map((node) => ({ className: node.className, rect: node.getBoundingClientRect().toJSON() }));
      const fragments = Array.from(range.getClientRects()).map((rect) => ({ rect: rect.toJSON(), controlIntersections: controls.map((control) => ({ className: control.className, area: Math.max(0, Math.min(rect.right, control.rect.right) - Math.max(rect.left, control.rect.left)) * Math.max(0, Math.min(rect.bottom, control.rect.bottom) - Math.max(rect.top, control.rect.top)) })) }));
      const numbers = Array.from(main.querySelectorAll<HTMLElement>(".s3-practice-index li")).map((row, index) => {
        const number = row.querySelector<HTMLElement>(".s3-practice-number")!, nr = number.getBoundingClientRect(), rr = row.getBoundingClientRect(), style = getComputedStyle(number);
        const separator = getComputedStyle(row, "::before");
        return { text: number.textContent, rect: nr.toJSON(), rowRect: rr.toJSON(), relativeToRow: { left: nr.left - rr.left, top: nr.top - rr.top }, relativeToPaper: { left: nr.left - paper.left, top: nr.top - paper.top }, backgroundColor: style.backgroundColor, outline: style.outline, outlineStyle: style.outlineStyle, boxShadow: style.boxShadow, padding: style.padding, minWidth: style.minWidth, separatorX: index === 0 ? null : rr.left + parseFloat(separator.left), state: row.querySelector("button")?.getAttribute("data-record-state"), ariaCurrent: row.querySelector("button")?.getAttribute("aria-current") };
      });
      const indexCopy = main.querySelector<HTMLElement>(".s3-practice-index-copy")!;
      const firstTitle = indexCopy.querySelector<HTMLElement>("strong")!;
      const shortWord = document.createRange();
      shortWord.setStart(firstTitle.firstChild!, 0);
      shortWord.setEnd(firstTitle.firstChild!, Math.min(5, firstTitle.textContent!.length));
      const indexLegibility = { copyWidth: indexCopy.getBoundingClientRect().width, fontSize: getComputedStyle(firstTitle).fontSize, firstFiveGlyphFragments: Array.from(shortWord.getClientRects()).filter(rect => rect.width > 0 && rect.height > 0).map(rect => rect.toJSON()) };
      return { indexLegibility, at: performance.now(), viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, documentWidth: document.documentElement.scrollWidth, htmlFontSize: getComputedStyle(document.documentElement).fontSize, active: main.closest(".gvo-prepared-tree")?.getAttribute("data-journey-active"), curtain: !!document.querySelector(".gvo-preparation-curtain"), title: { text: title.textContent, rect: titleRect.toJSON(), center: (titleRect.left + titleRect.right) / 2, viewportCenter: innerWidth / 2, offset: (titleRect.left + titleRect.right) / 2 - innerWidth / 2, fragments, gridColumnStart: titleCss.gridColumnStart, gridColumnEnd: titleCss.gridColumnEnd, gridRowStart: titleCss.gridRowStart, fontSize: titleCss.fontSize, headerFontSize: headerCss.fontSize, headerRect: headerRect.toJSON() }, isolatedConnect: Array.from(main.querySelectorAll<HTMLElement>(".s3-practice-kicker")).map((node) => ({ text: node.textContent, sourceId: node.getAttribute("data-editorial-source-id"), rect: node.getBoundingClientRect().toJSON() })), paper: paper.toJSON(), indexOrigin: { firstRowTop: main.querySelector(".s3-practice-index li")!.getBoundingClientRect().top - scrollRect.top + scroll.scrollTop, scrollPaddingTop: parseFloat(getComputedStyle(scroll).paddingTop) }, numbers, QRCount: main.querySelectorAll("[data-interstation-qr-action='open']").length };
    });
    evidence.before = before; evidence.geometry = geometry;
    const pngPath = info.outputPath("III-index-native-viewport.png");
    await page.screenshot({ path: pngPath, fullPage: false, scale: "css" });
    evidence.nativePng = { path: pngPath, fullPage: false, scale: "css" };
    const after = await facts(page); evidence.after = after;
    const criteria = {
      titleCenteredWithin1CssPx: Math.abs(geometry.title.offset) <= 1,
      noIsolatedConnectKicker: geometry.isolatedConnect.length === 0,
      shortChapterLabelRemainsReadable: geometry.indexLegibility.firstFiveGlyphFragments.length === 1,
      allNumberBackgroundsTransparent: geometry.numbers.every((number) => number.backgroundColor === "rgba(0, 0, 0, 0)" || number.backgroundColor === "transparent"),
      noNumberDecorativeOutlineOrShadow: geometry.numbers.every((number) => number.outlineStyle === "none" && number.boxShadow === "none"),
      numberColumnsAndSeparatorsPreserved: geometry.numbers.every((number) => Math.abs(number.relativeToRow.left) <= 1 && (number.separatorX === null || number.separatorX >= number.rect.right + 1)),
      noEmptyKickerSpacer: Math.abs(geometry.indexOrigin.firstRowTop - geometry.indexOrigin.scrollPaddingTop) <= 1,
      digitsAndOrderPreserved: geometry.numbers.map((number) => number.text).join(",") === "01,02,03",
      currentLockedSemanticsPreserved: geometry.numbers.map((number) => number.state).join(",") === "current,locked,locked" && geometry.numbers[0]?.ariaCurrent === "page",
      factsUnchanged: JSON.stringify(after) === JSON.stringify(before),
      noPrematureQR: geometry.QRCount === 0,
      activeDeclaredViewport: geometry.active === "true" && !geometry.curtain && geometry.viewport.width === cut.width && geometry.viewport.height === cut.height && geometry.documentWidth <= cut.width,
      declaredTextAmplification: Math.abs(parseFloat(geometry.htmlFontSize) - (text200 ? 32 : 16)) < 0.1,
      fullWidthFallbackWhenNeeded: geometry.title.headerRect.width >= 112 + 16 * parseFloat(geometry.title.headerFontSize) || (geometry.title.gridRowStart === "2" && geometry.title.gridColumnStart === "1" && geometry.title.gridColumnEnd === "-1"),
      headingClearOfFixedControls: geometry.title.fragments.every((fragment) => fragment.controlIntersections.every((control) => control.area === 0)),
      noPageOrHttpErrors: errors.length === 0,
    };
    evidence.criteria = criteria;
    evidence.recordedBeforeCompositionAssertion = true;
    writeFileSync(info.outputPath("OBS05-III-COMPOSITION-EVIDENCE.json"), JSON.stringify(evidence, null, 2) + "\n");
    // Evaluate the complete recorded composition together. One RED metric must
    // not prevent capture of the other requested visual criteria and facts.
    expect(criteria).toEqual(Object.fromEntries(Object.keys(criteria).map((key) => [key, true])));
    if (cut.name === "portrait390" && motion === "natural" && !text200) {
      const first = root.locator('[data-station3-record="planta"]');
      await first.press("Tab"); await page.keyboard.press("Shift+Tab"); await expect(first).toBeFocused();
      evidence.keyboardFocus = await first.evaluate((button) => ({ outline: getComputedStyle(button).outline, outlineStyle: getComputedStyle(button).outlineStyle, outlineWidth: getComputedStyle(button).outlineWidth }));
      expect((evidence.keyboardFocus as { outlineStyle: string }).outlineStyle).not.toBe("none");
      await first.click();
      await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0); await expect(root.locator(".s3-practice-paper")).toHaveAttribute("aria-busy", "false");
      for (let leaf = 1; leaf < 3; leaf++) {
        await root.getByRole("button", { name: locale === "es" ? "Siguiente →" : "Next →", exact: true }).click();
        await expect(root).toHaveAttribute("data-station3-folio", String(leaf + 1));
        await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0);
      }
      await root.getByRole("button", { name: locale === "es" ? "Volver al índice" : "Back to index", exact: true }).click();
      await expect(root.locator('[data-station3-page="index"]')).toBeVisible();
      await expect(root.locator("[data-station3-page-turn]")).toHaveCount(0);
      const records = root.locator(".s3-practice-index button");
      await expect(records.nth(0)).toHaveAttribute("data-record-state", "completed");
      await expect(records.nth(1)).toHaveAttribute("data-record-state", "current");
      await expect(records.nth(2)).toHaveAttribute("data-record-state", "locked");
      evidence.afterIntroManualConfirmation = await facts(page);
      await page.screenshot({ path: info.outputPath("III-index-current-completed-native-viewport.png"), fullPage: false, scale: "css" });
      expect((await facts(page)).find((fact) => fact.key === "gvo.progress.v1")?.raw).toBe(before.find((fact) => fact.key === "gvo.progress.v1")?.raw);
      await expect(root.locator("[data-interstation-qr-action='open']")).toHaveCount(0);
    }
  } finally {
    const indexAfter = createHash("sha256").update(await (await request.get("/")).body()).digest("hex");
    evidence.index = { before: indexBefore, after: indexAfter, stable: indexBefore === indexAfter }; evidence.errors = errors;
    const output = info.outputPath("OBS05-III-COMPOSITION-EVIDENCE.json");
    writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
    await info.attach("OBS05-III-COMPOSITION-EVIDENCE", { path: output, contentType: "application/json" });
    expect(indexAfter).toBe(indexBefore);
  }
});
}
