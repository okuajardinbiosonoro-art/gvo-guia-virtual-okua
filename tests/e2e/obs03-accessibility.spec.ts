import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

type Locale = "es" | "en";
type Scene = "I-More" | "III-step-by-step" | "IV-panel" | "V-question";
const viewport = { width: 390, height: 844 };
const scenes = {
  "I-More": { station: 1, root: "main.world1-root-screen", content: ".world1-root-narrative", samples: [".world1-root-narrative__body", ".world1-reading-expanded", ".world1-reading-more-toggle"] },
  "III-step-by-step": { station: 3, root: "main.s3-practice-screen", content: ".s3-practice-paper", samples: [".s3-practice-page-heading h2", ".s3-practice-instructions p", ".s3-practice-page-nav button"] },
  "IV-panel": { station: 4, root: "main.s4-ordering", content: ".s4-ordering-panel", samples: [".s4-ordering-panel > p", ".s4-ordering-description h2", ".s4-ordering-description p:last-child"] },
  "V-question": { station: 5, root: "main.s5-quiz", content: ".s5-question-unit", samples: [".s5-quiz-question", ".s5-question-prompt p:last-child", ".s5-quiz-option span"] },
} as const;

/** Declared synthetic persisted state copied from the R3-valid layout harness.
 * It supplies prior access only. No UI-earned journey, visitor score, reading,
 * practice, physical device or physical camera evidence is claimed. */
async function installDeclaredFixture(page: Page, locale: Locale) {
  await page.addInitScript((language) => {
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const station = Number(/^\/estacion\/(\d)/.exec(location.pathname)?.[1] ?? 0);
    const partial: Record<number, number> = { 1: 3, 2: 2, 3: 1, 4: 0, 5: 3 };
    const room = (id: keyof typeof order, count: number) => ({ contentRevision: "OBS03.2", presentedStepIds: order[id].slice(0, count), confirmedStepIds: order[id].slice(0, count), assistedPresentedStepIds: [], activeStepId: order[id][count] ?? null, interactionEvidence: [], outcome: id === 4 && count === 4 ? "solved" : null, closed: count === order[id].length });
    const stations = Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, room(id as 1 | 2 | 3 | 4 | 5, station > id ? order[id as 1 | 2 | 3 | 4 | 5].length : station === id ? partial[id] : 0)]));
    const prefix = Math.max(0, station - 1);
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem("gvo.language.v1", language);
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify({ schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover", 4), stations, legacyRouteCredit: prefix, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: false }));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, i) => i + 1), updatedAt: "2026-10-23T12:00:00.000Z" }));
    const answers = station === 5 ? ["plantas", "sistema", "espacio"] : [];
    localStorage.setItem("gvo.station5.quiz.v1", JSON.stringify({ schemaVersion: 1, correctAnswers: answers, answeredQuestions: answers, skippedQuestions: [] }));
  }, locale);
}

async function settle(page: Page) {
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
}

async function prepare(page: Page, scene: Scene, locale: Locale) {
  const definition = scenes[scene];
  await installDeclaredFixture(page, locale); await page.goto(`/estacion/${definition.station}`);
  await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${definition.root}`)).toBeVisible({ timeout: 25_000 });
  await settle(page);
  const room = page.locator(definition.root);
  if (scene === "I-More") {
    const more = room.locator(".world1-reading-more-toggle");
    await expect(more).toBeEnabled(); await expect(more).toHaveAccessibleName(locale === "es" ? "+ Más" : "+ More"); await expect(more).toHaveAttribute("aria-expanded", "false");
    await more.click(); await expect(more).toHaveAttribute("aria-expanded", "true"); await expect(more).toHaveAccessibleName(locale === "es" ? "Menos" : "Less");
    await expect(room.locator(".world1-reading-expanded")).toBeVisible();
  } else if (scene === "III-step-by-step") {
    await expect(room.locator('[data-station3-page="prototipo"] h2')).toBeVisible();
    await expect(room.locator("[data-station3-page-turn]")).toHaveCount(0);
  } else if (scene === "IV-panel") {
    // A real help gesture from the declared introduction creates the review
    // panel. No advance/close/QR action is performed in this focal test.
    await expect(room.locator("[data-ordering-object]")).toHaveCount(8);
    const help = room.getByRole("button", { name: locale === "es" ? "Ayúdame a ordenar" : "Help me arrange them", exact: true });
    await expect(help).toBeEnabled(); await help.click();
    await expect(room).toHaveAttribute("data-station4-ordering-phase", "review");
    await expect(room.locator(".s4-ordering-description h2")).toBeVisible();
    await expect(page.locator('[data-interstation-qr-action="open"]')).toHaveCount(0);
  } else {
    await expect(room).toHaveAttribute("data-station5-area", "visitante");
    await expect(room.locator(".s5-quiz-option")).toHaveCount(2);
    await expect(room.locator(".s5-quiz-option").first()).toBeEnabled();
    await expect(room.locator(".s5-question-unit")).toHaveAttribute("aria-busy", "false");
  }
  await settle(page);
  return room;
}

async function facts(page: Page) {
  return page.evaluate(() => {
    const snapshot = JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null");
    return { confirmed: Object.fromEntries(Object.entries(snapshot?.stations ?? {}).map(([id, room]) => [id, (room as { confirmedStepIds: string[] }).confirmedStepIds])), closed: Object.fromEntries(Object.entries(snapshot?.stations ?? {}).map(([id, room]) => [id, (room as { closed: boolean }).closed])), progressRaw: localStorage.getItem("gvo.progress.v1"), quizRaw: localStorage.getItem("gvo.station5.quiz.v1"), practiceRaw: localStorage.getItem("gvo.station3.practice.v2") };
  });
}

/** Reaches individual line fragments through actual overflow:auto/scroll
 * ancestors only. It does not make hidden/clipped ancestors scrollable and
 * never changes CSS to conceal overflow or force target visibility. */
async function measureReachability(content: Locator, root: Locator) {
  const text = await content.evaluate(async (scope) => {
    const excluded = (element: Element) => Boolean(element.closest('[inert],[aria-hidden="true"],[hidden],:disabled'));
    const visible = (element: Element) => { const s = getComputedStyle(element); return !excluded(element) && s.display !== "none" && s.visibility === "visible" && Number(s.opacity) > 0; };
    const rectJson = (rect: DOMRect) => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom });
    const clip = (element: Element) => {
      const value = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
      for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor), r = ancestor.getBoundingClientRect();
        const scaleX = r.width / (ancestor.offsetWidth || r.width || 1), scaleY = r.height / (ancestor.offsetHeight || r.height || 1);
        if (style.overflowX !== "visible") { value.left = Math.max(value.left, r.left + ancestor.clientLeft * scaleX); value.right = Math.min(value.right, r.left + (ancestor.clientLeft + ancestor.clientWidth) * scaleX); }
        if (style.overflowY !== "visible") { value.top = Math.max(value.top, r.top + ancestor.clientTop * scaleY); value.bottom = Math.min(value.bottom, r.top + (ancestor.clientTop + ancestor.clientHeight) * scaleY); }
      }
      return value;
    };
    const records: Array<Record<string, unknown>> = [], skipped: Array<Record<string, unknown>> = [];
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = []; while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const element = node.parentElement!;
      if (!visible(element)) { skipped.push({ tag: element.tagName, text: node.textContent?.trim(), reason: "disabled/inert/aria-hidden/hidden/non-visible" }); continue; }
      const range = document.createRange(); range.selectNodeContents(node);
      const count = range.getClientRects().length;
      for (let line = 0; line < count; line++) {
        for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor), current = range.getClientRects()[line];
          if (!current) continue;
          const box = ancestor.getBoundingClientRect(), scaleX = box.width / (ancestor.offsetWidth || box.width || 1), scaleY = box.height / (ancestor.offsetHeight || box.height || 1);
          if (/^(auto|scroll)$/.test(style.overflowY) && ancestor.scrollHeight > ancestor.clientHeight + 1) ancestor.scrollTop += ((current.top + current.bottom) / 2 - (box.top + (ancestor.clientTop + ancestor.clientHeight / 2) * scaleY)) / scaleY;
          if (/^(auto|scroll)$/.test(style.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) ancestor.scrollLeft += ((current.left + current.right) / 2 - (box.left + (ancestor.clientLeft + ancestor.clientWidth / 2) * scaleX)) / scaleX;
        }
        const beforeDocumentScroll = range.getClientRects()[line];
        if (beforeDocumentScroll && document.documentElement.scrollHeight > innerHeight + 1) window.scrollBy(0, (beforeDocumentScroll.top + beforeDocumentScroll.bottom) / 2 - innerHeight / 2);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const rect = range.getClientRects()[line]; if (!rect || rect.width < 0.1 || rect.height < 0.1) continue;
        const bounds = clip(element);
        records.push({ tag: element.tagName, className: element.className, text: node.textContent?.trim(), line, rect: rectJson(rect), reachableClip: bounds, reachable: rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1 });
      }
    }
    return { records, skipped };
  });
  const controls = [];
  for (const control of await root.locator("button,input,select,textarea,[role='button']").all()) {
    if (!await control.isVisible() || !await control.isEnabled() || await control.evaluate((node) => Boolean(node.closest('[inert],[aria-hidden="true"]')))) continue;
    await control.focus(); await settle(root.page());
    controls.push(await control.evaluate((node) => {
      // Interior quarter points avoid declaring an ordinary rounded corner
      // outside the painted hit shape to be an overlay/product obstruction.
      const r = node.getBoundingClientRect(); const points = [[r.left + r.width / 4, r.top + r.height / 4], [r.right - r.width / 4, r.top + r.height / 4], [r.left + r.width / 4, r.bottom - r.height / 4], [r.right - r.width / 4, r.bottom - r.height / 4], [r.x + r.width / 2, r.y + r.height / 2]];
      const label = node.classList.contains("s5-quiz-option") ? node.querySelector(":scope > span") : null;
      let labelBackplate = null;
      if (label) {
        const plate = label.getBoundingClientRect(), range = document.createRange();
        range.selectNodeContents(label);
        const fragments = Array.from(range.getClientRects());
        labelBackplate = {
          rect: plate.toJSON(),
          fragments: fragments.map((fragment) => fragment.toJSON()),
          containsAllText: fragments.length > 0 && fragments.every((fragment) => fragment.left >= plate.left - 1 && fragment.right <= plate.right + 1 && fragment.top >= plate.top - 1 && fragment.bottom <= plate.bottom + 1),
        };
      }
      return { label: node.getAttribute("aria-label") ?? node.textContent?.trim(), className: node.className, option: node.classList.contains("s5-quiz-option"), labelBackplate, focused: document.activeElement === node, rect: r.toJSON(), insideViewport: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1, pointHits: points.map(([x, y]) => {
        const hit = document.elementFromPoint(x, y);
        return {
          x, y, hit: hit?.tagName,
          containedByTarget: !!hit && (node === hit || node.contains(hit)),
          hitId: hit?.id ?? null,
          hitClass: hit?.getAttribute("class") ?? null,
          hitAriaLabel: hit?.getAttribute("aria-label") ?? null,
          hitImmersiveControl: hit?.closest("[data-gvo-immersive-control]")?.getAttribute("data-gvo-immersive-control") ?? null,
          hitRect: hit?.getBoundingClientRect().toJSON() ?? null,
        };
      }), target44: r.width >= 44 && r.height >= 44, target48: r.width >= 48 && r.height >= 48, option96: !node.classList.contains("s5-quiz-option") || r.width >= 96 && r.height >= 96 };
    }));
  }
  return { text, controls, document: await root.page().evaluate(() => ({ viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, scrollX, scrollY })) };
}

async function contrastSample(target: Locator, page: Page, info: TestInfo, stem: string, rootSelector: string) {
  await target.scrollIntoViewIfNeeded(); await settle(page);
  const sample = await target.evaluate((node) => {
    const describe = (element: Element) => { const s = getComputedStyle(element); return { tag: element.tagName, id: element.id, className: element.className, rect: element.getBoundingClientRect().toJSON(), color: s.color, textFillColor: s.webkitTextFillColor, opacity: s.opacity, backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage, backgroundBlendMode: s.backgroundBlendMode, mixBlendMode: s.mixBlendMode, filter: s.filter, backdropFilter: s.backdropFilter, textShadow: s.textShadow, fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, transform: s.transform, overflowX: s.overflowX, overflowY: s.overflowY, visibility: s.visibility }; };
    const chain = []; let effectiveOpacity = 1;
    for (let current: Element | null = node; current; current = current.parentElement) { chain.push(describe(current)); effectiveOpacity *= Number(getComputedStyle(current).opacity); }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), fragments = [];
    while (walker.nextNode()) {
      const text = walker.currentNode as Text, element = text.parentElement!;
      if (!text.textContent?.trim() || element.closest('[inert],[aria-hidden="true"],[hidden],:disabled') || getComputedStyle(element).visibility !== "visible") continue;
      const range = document.createRange(); range.selectNodeContents(text);
      for (const rect of Array.from(range.getClientRects())) {
        const x = Math.max(0, Math.min(innerWidth - 1, rect.x + rect.width / 2)), y = Math.max(0, Math.min(innerHeight - 1, rect.y + rect.height / 2));
        fragments.push({ text: text.textContent.trim(), rect: rect.toJSON(), element: describe(element), midpoint: { x, y }, insideViewport: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight, paintedStackAtMidpoint: document.elementsFromPoint(x, y).slice(0, 12).map(describe) });
      }
    }
    return { target: describe(node), effectiveOpacity, ancestorChain: chain, lineFragments: fragments, viewport: { width: innerWidth, height: innerHeight, devicePixelRatio, visualViewport: visualViewport ? { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, offsetTop: visualViewport.offsetTop } : null }, documentBackground: { html: describe(document.documentElement), body: describe(document.body) }, scroll: { x: scrollX, y: scrollY } };
  });
  const normal = info.outputPath(`${stem}-normal.png`), background = info.outputPath(`${stem}-glyph-fill-transparent.png`);
  await page.screenshot({ path: normal, fullPage: false, scale: "css" });
  let transparentStyle;
  let transparentGeometry;
  try {
    // Test-only glyph fill suppression preserves box geometry and backgrounds,
    // including artwork/gradients/alpha. Shadows are intentionally not removed:
    // their resolved values remain in JSON and limit subsequent pixel sampling.
    transparentStyle = await page.addStyleTag({ content: `${rootSelector}, ${rootSelector} * { -webkit-text-fill-color: transparent !important; }` });
    await settle(page);
    transparentGeometry = await target.evaluate((node) => node.getBoundingClientRect().toJSON());
    await page.screenshot({ path: background, fullPage: false, scale: "css" });
  } finally {
    if (transparentStyle) await transparentStyle.evaluate((node) => node.remove());
    await settle(page);
  }
  expect(transparentGeometry!.x).toBeCloseTo(sample.target.rect.x, 2); expect(transparentGeometry!.y).toBeCloseTo(sample.target.rect.y, 2);
  expect(transparentGeometry!.width).toBeCloseTo(sample.target.rect.width, 2); expect(transparentGeometry!.height).toBeCloseTo(sample.target.rect.height, 2);
  return { normal, glyphFillTransparent: background, transparencyRestored: true, method: "Resolved CSS foreground/opacity/layer chain and actual viewport PNG pair. No flat/dominant-colour substitute or universal WCAG result. Text-shadow/filter/blend effects are retained and must be considered when sampling.", ...sample };
}

test.describe("OBS03 accessibility focal · declared fixtures, CSS text enlargement and composite sampling", () => {
  for (const scene of Object.keys(scenes) as Scene[]) for (const locale of ["es", "en"] as const) {
    test(`${scene} ${locale} · 390×844 text enlargement 200% and background evidence`, async ({ page }, info) => {
      test.setTimeout(180_000); await page.setViewportSize(viewport); await page.emulateMedia({ reducedMotion: "reduce" });
      const pageErrors: string[] = []; page.on("pageerror", (error) => pageErrors.push(error.message));
      const definition = scenes[scene], room = await prepare(page, scene, locale), content = room.locator(definition.content);
      const beforeFacts = await facts(page);
      const initialHtmlStyle = await page.locator("html").getAttribute("style");
      const baselineRootFont = await page.locator("html").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
      const phases = [];
      try {
        for (const enlarged of [false, true]) {
          if (enlarged) { await page.evaluate(() => document.documentElement.style.setProperty("font-size", "200%", "important")); await settle(page); }
          const actualRootFont = await page.locator("html").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
          const reachability = await measureReachability(content, room);
          const samples = [];
          for (let index = 0; index < definition.samples.length; index++) {
            const target = room.locator(definition.samples[index]).first();
            await expect(target).toBeVisible();
            samples.push(await contrastSample(target, page, info, `${scene}-${locale}-${enlarged ? "text-200-percent" : "baseline"}-sample-${index + 1}`, definition.root));
          }
          phases.push({ label: enlarged ? "CSS_ROOT_FONT_SIZE_200_PERCENT_NOT_NATIVE_BROWSER_ZOOM" : "UNMODIFIED_BASELINE", baselineRootFontPx: baselineRootFont, actualRootFontPx: actualRootFont, actualRootFontRatio: actualRootFont / baselineRootFont, reachability, contrastSamples: samples });
        }
      } finally {
        await page.evaluate((prior) => { if (prior === null) document.documentElement.removeAttribute("style"); else document.documentElement.setAttribute("style", prior); }, initialHtmlStyle);
        await settle(page);
        await info.attach("OBS03-text-enlargement-composite-evidence", { body: JSON.stringify({ qualification: "Declared synthetic prior-state fixture, real consumers and ordinary UI preparation. CSS html font-size:200% exercises text enlargement/reflow; this is NOT native browser zoom, mobile pinch zoom, physical-device validation, universal WCAG certification or earned journey evidence. Actual per-sample computed font sizes are recorded: px/vw/cqw/clamp text need not double with the root font. Disabled/inert/aria-hidden text and controls are excluded and documented. Only recorded glyph range areas can support later composite contrast sampling.", scene, locale, viewport, phases, beforeFacts, afterFacts: await facts(page), pageErrors, originalHtmlStyleRestored: await page.locator("html").getAttribute("style") === initialHtmlStyle, sourceCodeOnlyUntilRootRuns: "Execution is not implied by preparing this spec" }, null, 2), contentType: "application/json" });
      }
      expect(phases).toHaveLength(2);
      expect(phases[1].actualRootFontRatio).toBeCloseTo(2, 2);
      for (const phase of phases) {
        expect(phase.reachability.document.scrollWidth, `${phase.label}: horizontal document overflow`).toBeLessThanOrEqual(viewport.width + 1);
        for (const line of phase.reachability.text.records) expect(line.reachable, `${phase.label}: unreachable text ${String(line.text).slice(0, 100)} line ${line.line}`).toBe(true);
        for (const control of phase.reachability.controls) {
          expect(control.focused, `${phase.label}: keyboard focus ${control.label}`).toBe(true);
          expect(control.insideViewport, `${phase.label}: clipped control ${control.label}`).toBe(true);
          expect(control.pointHits.every((point) => point.containedByTarget), `${phase.label}: covered/clipped target ${control.label}`).toBe(true);
          expect(control.target44, `${phase.label}: global 44px floor ${control.label}`).toBe(true);
          expect(control.option96, `${phase.label}: V answer option 96px ${control.label}`).toBe(true);
          if (control.option) {
            expect(control.labelBackplate, `${phase.label}: missing answer label backplate ${control.label}`).not.toBeNull();
            expect(control.labelBackplate!.containsAllText, `${phase.label}: answer text outside its backplate ${control.label}`).toBe(true);
          }
          // 48px is recorded for every eligible control, not converted into an
          // unsupported universal certification or silently substituted for44.
        }
      }
      expect(await facts(page)).toEqual(beforeFacts); expect(pageErrors).toEqual([]);
    });
  }
});
