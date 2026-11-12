import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { entryCoverBackdropAsset } from "../../src/shared/assets/entryCoverAssets";

const brand = "/assets/runtime/cover-intro/brand/okua-emblem-material-v03.png";

test("OBS03 Portada conserva el emblema auténtico en material y la marca DOM", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 667, height: 375 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/portada");
    const root = page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro');
    await expect(root).toBeVisible({ timeout: 25_000 });
    const logo = root.locator(`img[data-runtime-asset="${brand}"]`);
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("alt", "");
    await expect(logo).toHaveAttribute("aria-hidden", "true");
    await expect(root.locator(".cover-intro__brand-name")).toHaveText("OKÚA");
    await expect(root.locator(".cover-intro__brand-subtitle")).toHaveText("JARDÍN BIOSONORO");
    const geometry = await logo.evaluate((element) => {
      const image = element as HTMLImageElement;
      const rect = image.getBoundingClientRect();
      return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
        x: rect.x, y: rect.y, width: rect.width, height: rect.height,
        overflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(geometry.naturalWidth).toBe(116);
    expect(geometry.naturalHeight).toBe(142);
    expect(geometry.width / geometry.height).toBeCloseTo(116 / 142, 2);
    expect(geometry.x).toBeGreaterThanOrEqual(0);
    expect(geometry.y).toBeGreaterThanOrEqual(0);
    expect(geometry.x + geometry.width).toBeLessThanOrEqual(viewport.width);
    expect(geometry.y + geometry.height).toBeLessThanOrEqual(viewport.height);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { name: "Exposición Interactiva", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Empieza aquí", exact: true })).toBeVisible();
    await expect(root.locator('[data-portal-id="portal-1"]')).toBeVisible();
    await expect(root.locator('[data-portal-id="portal-1"]')).toBeDisabled();
    const png = await page.screenshot({ path: info.outputPath(`cover-brand-${viewport.width}x${viewport.height}.png`), fullPage: true });
    await info.attach(`cover-brand-${viewport.width}x${viewport.height}`, { body: JSON.stringify({ configuredViewport: viewport, fullPage: true, imagePixels: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, geometry }), contentType: "application/json" });
  }
});

test("OBS03 Carga consume las hojas registradas durante preparación real sin omisión", async ({ page }, info) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Hold a real destination request briefly so the zero-minimum loading screen
  // can be inspected. No ready flag, journey fact or navigation is injected.
  await page.route(`**${entryCoverBackdropAsset}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.continue();
  });
  await page.goto("/carga", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main.loading-initial[data-loading-preload-status='loading']")).toBeVisible();
  await expect(page.locator('[data-runtime-asset="/assets/runtime/loading-initial/lia/lia_loading_16f_okua_v03.png"]')).toHaveCount(1);
  await expect(page.locator('[data-runtime-asset="/assets/runtime/loading-initial/plant/plant_growth_4f_okua_v03.png"]')).toHaveCount(1);
  await expect(page.locator('[data-lia-frame-count="16"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bienvenido a OKÚA", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /omitir|saltar/i })).toHaveCount(0);
  const png = await page.screenshot({ path: info.outputPath("loading-brand-375x667.png"), fullPage: true });
  await info.attach("loading-brand-capture", { body: JSON.stringify({ configuredViewport: { width: 375, height: 667 }, fullPage: true, imagePixels: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, qualification: "Natural animation during a delayed real destination request; no progress or readiness injected" }), contentType: "application/json" });
  await expect(page).toHaveURL(/\/inicio$/, { timeout: 15_000 });
  await expect(page.locator("audio,video")).toHaveCount(0);
});

test("OBS03 Portada 390×844 registra título y marca sobre el fondo compuesto para medir contraste", async ({ page }, info) => {
  const viewport = { width: 390, height: 844 };
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const indexBefore = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
  await page.goto("/portada");
  const root = page.locator('.gvo-prepared-tree[data-journey-active="true"] main.cover-intro');
  await expect(root).toBeVisible({ timeout: 25_000 });
  await expect(root).toHaveAttribute("data-journey-active", "true");
  await expect(root.getByRole("button", { name: "Empieza aquí", exact: true })).toBeEnabled();
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))); });
  const selectors = [".cover-intro__title", ".cover-intro__brand-name", ".cover-intro__brand-subtitle"];
  const samples = await root.evaluate((scope, selectors) => {
    const describe = (node: Element) => {
      const style = getComputedStyle(node);
      return { tag: node.tagName, id: node.id, className: node.className, rect: node.getBoundingClientRect().toJSON(), color: style.color, textFillColor: style.webkitTextFillColor, opacity: style.opacity, backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage, backgroundBlendMode: style.backgroundBlendMode, mixBlendMode: style.mixBlendMode, filter: style.filter, backdropFilter: style.backdropFilter, textShadow: style.textShadow, fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight, lineHeight: style.lineHeight, transform: style.transform, visibility: style.visibility };
    };
    return selectors.map((selector) => {
      const node = scope.querySelector(selector)!;
      const ancestorChain = []; let effectiveOpacity = 1;
      for (let current: Element | null = node; current; current = current.parentElement) { ancestorChain.push(describe(current)); effectiveOpacity *= Number(getComputedStyle(current).opacity); }
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), lineFragments = [];
      while (walker.nextNode()) {
        const text = walker.currentNode as Text;
        if (!text.textContent?.trim()) continue;
        const element = text.parentElement!, range = document.createRange(); range.selectNodeContents(text);
        for (const rect of Array.from(range.getClientRects())) lineFragments.push({ text: text.textContent.trim(), rect: rect.toJSON(), element: describe(element), insideViewport: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight });
      }
      return { selector, target: describe(node), ancestorChain, effectiveOpacity, lineFragments };
    });
  }, selectors);
  expect(samples.every((sample) => sample.lineFragments.length && sample.lineFragments.every((line) => line.insideViewport))).toBe(true);
  const normal = info.outputPath("cover-heading-wordmark-390x844-normal.png");
  const transparent = info.outputPath("cover-heading-wordmark-390x844-glyph-fill-transparent.png");
  const normalPng = await page.screenshot({ path: normal, fullPage: false, scale: "css" });
  let style;
  try {
    // Evidence only: suppress glyph fill while retaining all geometry, artwork,
    // gradients and shadows. Do not alter runtime CSS or declare contrast here.
    style = await page.addStyleTag({ content: ".cover-intro__header, .cover-intro__header * { -webkit-text-fill-color: transparent !important; }" });
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const transparentPng = await page.screenshot({ path: transparent, fullPage: false, scale: "css" });
    expect([transparentPng.readUInt32BE(16), transparentPng.readUInt32BE(20)]).toEqual([390, 844]);
    for (const sample of samples) {
      const rect = await root.locator(sample.selector).evaluate((node) => node.getBoundingClientRect().toJSON());
      expect(rect).toEqual(sample.target.rect);
    }
  } finally {
    if (style) await style.evaluate((node) => node.remove());
  }
  await expect(root).toHaveAttribute("data-journey-active", "true");
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  const indexAfter = createHash("sha256").update(await (await page.request.get("/")).body()).digest("hex");
  expect(indexAfter).toBe(indexBefore);
  expect([normalPng.readUInt32BE(16), normalPng.readUInt32BE(20)]).toEqual([390, 844]);
  await info.attach("OBS03-cover-heading-composite-evidence", { body: JSON.stringify({ qualification: "Real Portada with no progress seed or introduction bypass. PNG viewport pair and resolved CSS/ranges for later offline composite contrast measurement; no contrast PASS or universal certification inferred. Glyph shadows are retained and must be reported as a limitation.", viewport, fullPage: false, imagePixels: { width: 390, height: 844 }, indexBefore, indexAfter, normal, glyphFillTransparent: transparent, restored: true, samples }, null, 2), contentType: "application/json" });
});
