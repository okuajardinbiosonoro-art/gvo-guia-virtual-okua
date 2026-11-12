import { mkdir, writeFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const evidence =
  "docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/responsive";
const viewports = [
  { width: 280, height: 653 },
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 600, height: 960 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 568, height: 280 },
  { width: 844, height: 390 },
];
const routes = [
  ["/carga", ".loading-initial"],
  ["/inicio", "[data-initial-experience]"],
  ["/portada?resetIntro=1", "main[data-critical-assets-ready='true']"],
  [
    "/transition/intro-to-station-1",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/estacion/1", "main[data-world1-root-version]"],
  [
    "/transition/world-1-to-world-2",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/estacion/2", "main[data-world2-state]"],
  [
    "/transition/world-2-to-world-3",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/estacion/3", "main[data-station3-state]"],
  [
    "/transition/world-3-to-world-4",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/estacion/4", "main[data-station4-state]"],
  [
    "/transition/world-4-to-world-5",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/estacion/5", "main.s5-screen"],
  [
    "/transition/world-5-to-final",
    "main[data-transition-world-id][data-critical-assets-ready='true']",
  ],
  ["/final", "[data-final-root]"],
] as const;

test.use({ deviceScaleFactor: 1 });
test.setTimeout(180000);

for (const viewport of viewports) {
  test(`matriz final fluida: 15 rutas ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await mkdir(evidence, { recursive: true });
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/carga");
    await page.evaluate(() =>
      localStorage.setItem(
        "gvo.progress.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3, 4, 5],
          updatedAt: "2026-10-23T12:00:00Z",
        }),
      ),
    );
    const measurements: unknown[] = [];

    for (const [route, selector] of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator(selector).first()).toBeVisible({
        timeout: 30000,
      });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      const geometry = await page.evaluate(() => {
        const issues: Array<{
          kind: string;
          text: string;
          left?: number;
          right?: number;
          scrollWidth?: number;
          clientWidth?: number;
          clipper?: string;
        }> = [];
        const root = document.documentElement;
        if (root.scrollWidth > root.clientWidth + 1) {
          issues.push({
            kind: "document-horizontal-overflow",
            text: "html",
            scrollWidth: root.scrollWidth,
            clientWidth: root.clientWidth,
          });
        }
        if (document.body.scrollWidth > innerWidth + 1) {
          issues.push({
            kind: "body-horizontal-overflow",
            text: "body",
            scrollWidth: document.body.scrollWidth,
            clientWidth: innerWidth,
          });
        }
        for (const element of document.querySelectorAll<HTMLElement>(
          "h1,h2,p,button,a[href],input,select,textarea",
        )) {
          if (element.closest('[aria-hidden="true"],[hidden]')) continue;
          if (
            !element.checkVisibility({
              checkOpacity: true,
              checkVisibilityCSS: true,
            })
          )
            continue;
          const rect = element.getBoundingClientRect();
          if (rect.width <= 1 && rect.height <= 1) continue;
          // Screen-reader copy can have large descendant text boxes inside its
          // deliberate 1px clipped wrapper. It is not painted visitor content.
          let visuallyHidden = false;
          for (
            let ancestor: HTMLElement | null = element;
            ancestor;
            ancestor = ancestor.parentElement
          ) {
            const bounds = ancestor.getBoundingClientRect();
            const style = getComputedStyle(ancestor);
            if (
              bounds.width <= 1 &&
              bounds.height <= 1 &&
              (style.clipPath !== "none" || style.clip !== "auto")
            ) {
              visuallyHidden = true;
              break;
            }
          }
          if (visuallyHidden) continue;
          const text = `${element.tagName} ${(element.textContent ?? element.getAttribute("aria-label") ?? "").trim().slice(0, 100)}`;
          if (rect.left < -1 || rect.right > innerWidth + 1) {
            issues.push({
              kind: "visible-content-outside-width",
              text,
              left: rect.left,
              right: rect.right,
            });
          }
          // Text may intentionally sit outside a hotspot with overflow:visible.
          // Measure painted text and clipping ancestors, not scrollWidth alone.
          const walker = document.createTreeWalker(
            element,
            window.NodeFilter.SHOW_TEXT,
          );
          while (walker.nextNode()) {
            const node = walker.currentNode;
            const parent = node.parentElement;
            if (
              !parent ||
              !node.textContent?.trim() ||
              parent.closest('[aria-hidden="true"],[hidden]')
            )
              continue;
            if (
              !parent.checkVisibility({
                checkOpacity: true,
                checkVisibilityCSS: true,
              })
            )
              continue;
            const parentRect = parent.getBoundingClientRect();
            if (parentRect.width <= 1 && parentRect.height <= 1) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const line of range.getClientRects()) {
              if (line.width <= 1) continue;
              if (line.left < -1 || line.right > innerWidth + 1) {
                issues.push({
                  kind: "painted-text-outside-width",
                  text,
                  left: line.left,
                  right: line.right,
                });
              }
              let ancestor: HTMLElement | null = parent;
              while (ancestor) {
                if (
                  ["hidden", "clip", "auto", "scroll"].includes(
                    getComputedStyle(ancestor).overflowX,
                  )
                ) {
                  const bounds = ancestor.getBoundingClientRect();
                  if (
                    line.left < bounds.left - 1 ||
                    line.right > bounds.right + 1
                  ) {
                    issues.push({
                      kind: "painted-text-clipped-by-ancestor",
                      text,
                      left: line.left,
                      right: line.right,
                      clipper: `${ancestor.tagName}.${ancestor.className}`,
                    });
                    break;
                  }
                }
                ancestor = ancestor.parentElement;
              }
            }
          }
        }
        return {
          route: location.pathname,
          viewport: { width: innerWidth, height: innerHeight },
          devicePixelRatio,
          document: { width: root.scrollWidth, height: root.scrollHeight },
          htmlMinWidth: getComputedStyle(root).minWidth,
          bodyMinWidth: getComputedStyle(document.body).minWidth,
          htmlOverflowX: getComputedStyle(root).overflowX,
          bodyOverflowX: getComputedStyle(document.body).overflowX,
          issues,
        };
      });
      const expectedPath = route.split("?")[0];
      expect.soft(geometry.route, route).toBe(expectedPath);
      expect.soft(geometry.viewport, route).toEqual(viewport);
      expect.soft(geometry.htmlMinWidth, route).toBe("0px");
      expect.soft(geometry.bodyMinWidth, route).toBe("0px");
      expect
        .soft(["hidden", "clip"].includes(geometry.htmlOverflowX), route)
        .toBe(false);
      expect
        .soft(["hidden", "clip"].includes(geometry.bodyOverflowX), route)
        .toBe(false);
      expect
        .soft(
          geometry.issues,
          `${route} at ${viewport.width}×${viewport.height}`,
        )
        .toEqual([]);
      const record: Record<string, unknown> = {
        configuredViewport: viewport,
        ...geometry,
      };
      if (
        !route.startsWith("/transition/") &&
        (viewport.width === 280 ||
          viewport.width === 1920 ||
          viewport.height <= 390 ||
          geometry.issues.length)
      ) {
        const name = `${viewport.width}x${viewport.height}-${expectedPath.replaceAll("/", "-").replace(/^-/, "")}.png`;
        const image = await page.screenshot({
          path: `${evidence}/${name}`,
          fullPage: true,
        });
        record.capture = {
          file: name,
          fullPage: true,
          pixels: {
            width: image.readUInt32BE(16),
            height: image.readUInt32BE(20),
          },
          routeAfterCapture: new URL(page.url()).pathname,
        };
      }
      measurements.push(record);
      await writeFile(
        `${evidence}/matrix-${viewport.width}x${viewport.height}.json`,
        JSON.stringify(measurements, null, 2),
      );
    }
  });
}
