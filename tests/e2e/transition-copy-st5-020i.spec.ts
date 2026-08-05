import { expect, test, type Frame, type Page } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { evidenceDirectory } from "./support/evidence";

const evidenceDir = evidenceDirectory("transition-copy-st5-020i");
const globalProgressKey = "gvo.progress.v1";
const storageProbeKey = "st5-020i.storage-probe";

const viewports = [
  { name: "375x667", width: 375, height: 667 },
  { name: "667x375", width: 667, height: 375 },
  { name: "1024x768", width: 1024, height: 768 },
] as const;

const transitions = [
  {
    id: "intro-to-station-1",
    route: "/transition/intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/estacion/1",
    title: "Abriendo Mundo I",
    subtitle: "Preparando la raíz.",
    titleSlotId: "TRANS_COVER_W1_TITLE_01",
    subtitleSlotId: "TRANS_COVER_W1_SUB_01",
    targetPreload: "world1RootInitial",
  },
  {
    id: "world-1-to-world-2",
    route: "/transition/world-1-to-world-2",
    fromRoute: "/estacion/1",
    toRoute: "/estacion/2",
    title: "Abriendo Mundo II",
    subtitle: "Preparando el pulso invisible.",
    titleSlotId: "TRANS_W1_W2_TITLE_01",
    subtitleSlotId: "TRANS_W1_W2_SUB_01",
    targetPreload: "none",
  },
  {
    id: "world-2-to-world-3",
    route: "/transition/world-2-to-world-3",
    fromRoute: "/estacion/2",
    toRoute: "/estacion/3",
    title: "Abriendo Mundo III",
    subtitle: "Preparando el cuaderno de pruebas.",
    titleSlotId: "TRANS_W2_W3_TITLE_01",
    subtitleSlotId: "TRANS_W2_W3_SUB_01",
    targetPreload: "none",
  },
  {
    id: "world-3-to-world-4",
    route: "/transition/world-3-to-world-4",
    fromRoute: "/estacion/3",
    toRoute: "/estacion/4",
    title: "Abriendo Mundo IV",
    subtitle: "Preparando la mesa de sistema.",
    titleSlotId: "TRANS_W3_W4_TITLE_01",
    subtitleSlotId: "TRANS_W3_W4_SUB_01",
    targetPreload: "none",
  },
  {
    id: "world-4-to-world-5",
    route: "/transition/world-4-to-world-5",
    fromRoute: "/estacion/4",
    toRoute: "/estacion/5",
    title: "Abriendo Mundo V",
    subtitle: "Preparando el mapa del presente.",
    titleSlotId: "TRANS_W4_W5_TITLE_01",
    subtitleSlotId: "TRANS_W4_W5_SUB_01",
    targetPreload: "none",
  },
  {
    id: "world-5-to-final",
    route: "/transition/world-5-to-final",
    fromRoute: "/estacion/5",
    toRoute: "/final",
    title: "Abriendo el Mirador",
    subtitle: "Preparando el cierre del recorrido.",
    titleSlotId: "TRANS_W5_FINAL_TITLE_01",
    subtitleSlotId: "TRANS_W5_FINAL_SUB_01",
    targetPreload: "none",
  },
] as const;

type Telemetry = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  responses404: string[];
  externalRequests: string[];
};

function attachTelemetry(page: Page): Telemetry {
  const telemetry: Telemetry = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    responses404: [],
    externalRequests: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error")
      telemetry.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => telemetry.pageErrors.push(String(error)));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "unknown";
    if (
      failure.includes("ERR_ABORTED") &&
      (request.url().startsWith("http://127.0.0.1:") ||
        request.url().startsWith("http://localhost:"))
    ) {
      return;
    }
    telemetry.failedRequests.push(`${request.url()} :: ${failure}`);
  });
  page.on("response", (response) => {
    if (response.status() === 404) telemetry.responses404.push(response.url());
  });
  page.on("request", (request) => {
    const url = request.url();
    if (url.startsWith("data:") || url.startsWith("blob:")) return;
    const hostname = new URL(url).hostname;
    if (!["127.0.0.1", "localhost"].includes(hostname)) {
      telemetry.externalRequests.push(url);
    }
  });

  return telemetry;
}

function expectTelemetryClean(telemetry: Telemetry) {
  expect(telemetry).toEqual({
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    responses404: [],
    externalRequests: [],
  });
}

async function storageSnapshot(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      Array.from({ length: localStorage.length }, (_, index) =>
        localStorage.key(index),
      )
        .filter((key): key is string => key !== null)
        .sort()
        .map((key) => [key, localStorage.getItem(key)]),
    ),
  );
}

async function seedGuardedJourney(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ progressKey, probeKey }) => {
      localStorage.clear();
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          completedStations: [1, 2, 3, 4, 5],
          updatedAt: "2026-07-30T12:00:00.000Z",
        }),
      );
      localStorage.setItem(probeKey, "storage-must-remain-byte-identical");
    },
    { progressKey: globalProgressKey, probeKey: storageProbeKey },
  );
}

async function readGeometrySnapshot(page: Page) {
  return page.evaluate(() => {
    const readRect = (selector: string) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect();
      return rect
        ? {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            right: rect.right,
            bottom: rect.bottom,
          }
        : null;
    };
    const scrollingElement = document.scrollingElement;

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      documentScroll: {
        scrollHeight: scrollingElement?.scrollHeight ?? null,
        clientHeight: scrollingElement?.clientHeight ?? null,
        scrollWidth: scrollingElement?.scrollWidth ?? null,
        clientWidth: scrollingElement?.clientWidth ?? null,
      },
      horizontalOverflow: scrollingElement
        ? scrollingElement.scrollWidth - scrollingElement.clientWidth
        : null,
      verticalOverflow: scrollingElement
        ? scrollingElement.scrollHeight - scrollingElement.clientHeight
        : null,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      title: readRect("#transition-world-title"),
      subtitle: readRect("#transition-world-subtitle"),
      portal: readRect('[data-testid="transition-world-portal"]'),
      lia: readRect('[data-testid="transition-world-lia-sprite"]'),
      progress: readRect('[data-testid="transition-world-progress"]'),
    };
  });
}

function rectMaximumDrift(
  before: Awaited<ReturnType<typeof readGeometrySnapshot>>,
  after: Awaited<ReturnType<typeof readGeometrySnapshot>>,
  key: "portal" | "lia" | "progress",
) {
  const beforeRect = before[key];
  const afterRect = after[key];
  expect(beforeRect).not.toBeNull();
  expect(afterRect).not.toBeNull();

  return Math.max(
    ...(["x", "y", "width", "height", "right", "bottom"] as const).map((edge) =>
      Math.abs((afterRect?.[edge] ?? 0) - (beforeRect?.[edge] ?? 0)),
    ),
  );
}

test.describe("667x375 ST5-020I-C geometry", () => {
  test.use({
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
    screen: { width: 667, height: 375 },
    viewport: { width: 667, height: 375 },
  });

  test("reconcilia la altura sin deriva visual", async ({ page }) => {
    test.setTimeout(90000);
    await fs.mkdir(evidenceDir, { recursive: true });
    // El preview usa la misma composición sin el temporizador de navegación runtime.
    await page.goto("/dev/transition-world", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll<HTMLImageElement>("img")]
          .filter((image) => image.currentSrc || image.src)
          .every((image) => image.complete && image.naturalWidth > 0),
      undefined,
      { timeout: 30_000 },
    );
    const main = page.locator(
      'main[data-transition-world-id="intro-to-station-1"]',
    );
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute("data-critical-assets-ready", "true");

    await page.addStyleTag({
      content: `
        main[data-transition-world-id] *,
        main[data-transition-world-id] *::before,
        main[data-transition-world-id] *::after {
          animation-play-state: paused !important;
        }
      `,
    });
    const previousHeightContract = await page.addStyleTag({
      content: `
        @media (orientation: landscape) and (max-height: 430px) {
          main[data-transition-world-id] {
            height: auto !important;
          }

          main[data-transition-world-id] > section[role="status"] {
            height: auto !important;
            min-height: 100svh !important;
            align-self: center !important;
          }
        }
      `,
    });
    await page.waitForTimeout(50);

    const before = await readGeometrySnapshot(page);
    const beforeScreenshot = path.join(
      evidenceDir,
      "667x375_before-st5-020i-b.png",
    );
    await page.screenshot({ path: beforeScreenshot, scale: "css" });

    const protectedBeforeScreenshot = path.join(
      evidenceDir,
      "667x375_before-st5-020i-c-protected.png",
    );
    const protectedAfterScreenshot = path.join(
      evidenceDir,
      "667x375_after-st5-020i-c-protected.png",
    );
    const protectedCompositionIsolation = await page.addStyleTag({
      content: `
        main[data-transition-world-id] > :not(section[role="status"]) {
          visibility: hidden !important;
        }
      `,
    });
    await page.screenshot({
      path: protectedBeforeScreenshot,
      scale: "css",
    });

    await previousHeightContract.evaluate((style) => style.remove());
    await page.waitForTimeout(50);

    const after = await readGeometrySnapshot(page);
    await page.screenshot({
      path: protectedAfterScreenshot,
      scale: "css",
    });
    await protectedCompositionIsolation.evaluate((style) => style.remove());
    const afterScreenshot = path.join(
      evidenceDir,
      "667x375_after-st5-020i-b.png",
    );
    await page.screenshot({ path: afterScreenshot, scale: "css" });

    const drift = {
      portal: rectMaximumDrift(before, after, "portal"),
      lia: rectMaximumDrift(before, after, "lia"),
      progress: rectMaximumDrift(before, after, "progress"),
    };
    const [beforePixels, afterPixels] = await Promise.all(
      [protectedBeforeScreenshot, protectedAfterScreenshot].map((imagePath) =>
        sharp(imagePath).ensureAlpha().raw().toBuffer(),
      ),
    );
    let differingChannels = 0;
    let maximumChannelDelta = 0;
    for (let index = 0; index < beforePixels.length; index += 1) {
      const delta = Math.abs(beforePixels[index] - afterPixels[index]);
      if (delta > 0) differingChannels += 1;
      maximumChannelDelta = Math.max(maximumChannelDelta, delta);
    }

    await fs.writeFile(
      path.join(evidenceDir, "667x375_st5-020i-b_geometry.json"),
      `${JSON.stringify(
        {
          state: "ST5_020I_C_GEOMETRY_PASS",
          before,
          after,
          drift,
          pixelComparison: {
            scope: "stage protegida sobre fondo plano",
            differingChannels,
            maximumChannelDelta,
          },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    expect(before.viewport).toEqual({ width: 667, height: 375 });
    expect(before.verticalOverflow).toBe(177);
    expect(after.verticalOverflow ?? Infinity).toBeLessThanOrEqual(1);
    expect(after.horizontalOverflow ?? Infinity).toBeLessThanOrEqual(1);
    expect(after.scroll).toEqual({ x: 0, y: 0 });
    expect(drift.portal).toBeLessThanOrEqual(1);
    expect(drift.lia).toBeLessThanOrEqual(1);
    expect(drift.progress).toBeLessThanOrEqual(1);
    expect(differingChannels).toBe(0);
    expect(maximumChannelDelta).toBe(0);
  });
});

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      screen: viewport,
      viewport,
    });

    test("ST5-020I audita las seis transiciones", async ({ page }) => {
      test.setTimeout(90000);
      await fs.mkdir(evidenceDir, { recursive: true });
      const telemetry = attachTelemetry(page);
      const measurements = [];

      await seedGuardedJourney(page);

      for (const [index, transition] of transitions.entries()) {
        const storageBefore = await storageSnapshot(page);
        let destinationNavigations = 0;
        const countDestinationNavigation = (frame: Frame) => {
          if (
            frame === page.mainFrame() &&
            new URL(frame.url()).pathname === transition.toRoute
          ) {
            destinationNavigations += 1;
          }
        };
        page.on("framenavigated", countDestinationNavigation);

        await page.goto(transition.route, { waitUntil: "domcontentloaded" });
        const main = page.locator(
          `main[data-transition-world-id="${transition.id}"]`,
        );
        await expect(main).toBeVisible();
        await expect(main).toHaveAttribute(
          "data-critical-assets-ready",
          "true",
        );

        const runtimeSnapshot = await main.evaluate((element) => {
          const readRect = (selector: string) => {
            const rect = document
              .querySelector(selector)
              ?.getBoundingClientRect();
            return rect
              ? {
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                  right: rect.right,
                  bottom: rect.bottom,
                }
              : null;
          };
          const titleElement = document.querySelector(
            "#transition-world-title",
          );
          const subtitleElement = document.querySelector(
            "#transition-world-subtitle",
          );
          const portalElement = document.querySelector(
            '[data-testid="transition-world-portal"]',
          );
          const liaElement = document.querySelector(
            '[data-testid="transition-world-lia-sprite"]',
          );
          const progressElement = document.querySelector(
            '[data-testid="transition-world-progress"]',
          );
          const overlaps = (
            first: ReturnType<typeof readRect>,
            second: ReturnType<typeof readRect>,
          ) =>
            Boolean(
              first &&
              second &&
              first.x < second.right &&
              first.right > second.x &&
              first.y < second.bottom &&
              first.bottom > second.y,
            );
          const titleRect = readRect("#transition-world-title");
          const subtitleRect = readRect("#transition-world-subtitle");
          const portalRect = readRect(
            '[data-testid="transition-world-portal"]',
          );
          const liaRect = readRect(
            '[data-testid="transition-world-lia-sprite"]',
          );
          const progressRect = readRect(
            '[data-testid="transition-world-progress"]',
          );
          const portalVisibleRect = portalRect
            ? {
                x: portalRect.x + portalRect.width * (105 / 512),
                y: portalRect.y + portalRect.height * (60 / 768),
                width: portalRect.width * (310 / 512),
                height: portalRect.height * (642 / 768),
                right: portalRect.x + portalRect.width * (415 / 512),
                bottom: portalRect.y + portalRect.height * (702 / 768),
              }
            : null;
          const scrollingElement = document.scrollingElement;
          const stageElement = element.querySelector<HTMLElement>(
            'section[role="status"]',
          );

          return {
            title: titleElement?.textContent ?? null,
            subtitle: subtitleElement?.textContent ?? null,
            fromRoute: element.getAttribute("data-transition-from-route"),
            toRoute: element.getAttribute("data-transition-to-route"),
            durationMs: element.getAttribute("data-duration-ms"),
            reducedMotionDurationMs: element.getAttribute(
              "data-reduced-motion-duration-ms",
            ),
            targetPreload: element.getAttribute("data-target-preload"),
            portalState: document
              .querySelector('[data-testid="transition-world-portal"]')
              ?.getAttribute("data-portal-state"),
            editorialCopyStatus: document
              .querySelector("[data-editorial-copy]")
              ?.getAttribute("data-editorial-copy"),
            titleSlotId: document
              .querySelector("[data-title-slot]")
              ?.getAttribute("data-title-slot"),
            subtitleSlotId: document
              .querySelector("[data-subtitle-slot]")
              ?.getAttribute("data-subtitle-slot"),
            interactiveControlCount: element.querySelectorAll(
              'button, a, input, select, textarea, [role="button"], [role="link"], [data-hotspot]',
            ).length,
            containsForbiddenCopy:
              /\b(?:TEMP|TODO|TBD|PLACEHOLDER|PROVISIONAL|DRAFT|LOREM)\b|MUNDO SIGUIENTE|SIGUIENTE MUNDO|CARGANDO\.\.\./iu.test(
                element.textContent ?? "",
              ),
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            landscapeCompactMediaQueryActive: window.matchMedia(
              "(orientation: landscape) and (max-height: 430px)",
            ).matches,
            documentScroll: {
              scrollHeight: scrollingElement?.scrollHeight ?? null,
              clientHeight: scrollingElement?.clientHeight ?? null,
              scrollWidth: scrollingElement?.scrollWidth ?? null,
              clientWidth: scrollingElement?.clientWidth ?? null,
            },
            horizontalOverflow: scrollingElement
              ? scrollingElement.scrollWidth - scrollingElement.clientWidth
              : null,
            verticalOverflow: scrollingElement
              ? scrollingElement.scrollHeight - scrollingElement.clientHeight
              : null,
            scroll: {
              x: window.scrollX,
              y: window.scrollY,
            },
            internalScroll: {
              rootX: element.scrollLeft,
              rootY: element.scrollTop,
              stageX: stageElement?.scrollLeft ?? null,
              stageY: stageElement?.scrollTop ?? null,
            },
            fontSizes: {
              title: titleElement
                ? Number.parseFloat(getComputedStyle(titleElement).fontSize)
                : null,
              subtitle: subtitleElement
                ? Number.parseFloat(getComputedStyle(subtitleElement).fontSize)
                : null,
            },
            titleRect,
            subtitleRect,
            portalRect,
            portalVisibleRect,
            liaRect,
            progressRect,
            copyOverlapsVisuals: {
              titlePortal: overlaps(titleRect, portalVisibleRect),
              titleLia: overlaps(titleRect, liaRect),
              titleProgress: overlaps(titleRect, progressRect),
              subtitlePortal: overlaps(subtitleRect, portalVisibleRect),
              subtitleLia: overlaps(subtitleRect, liaRect),
              subtitleProgress: overlaps(subtitleRect, progressRect),
              titleSubtitle: overlaps(titleRect, subtitleRect),
            },
            visualElementsPresent: {
              portal: portalElement !== null,
              lia: liaElement !== null,
              progress: progressElement !== null,
            },
          };
        });

        const screenshotName = `${viewport.name}_${String(index + 1).padStart(2, "0")}_${transition.id}.png`;
        await page.screenshot({
          path: path.join(evidenceDir, screenshotName),
          scale: "css",
        });

        expect(runtimeSnapshot).toMatchObject({
          title: transition.title,
          subtitle: transition.subtitle,
          fromRoute: transition.fromRoute,
          toRoute: transition.toRoute,
          durationMs: "2300",
          reducedMotionDurationMs: "1000",
          targetPreload: transition.targetPreload,
          portalState: "open",
          editorialCopyStatus: "final",
          titleSlotId: transition.titleSlotId,
          subtitleSlotId: transition.subtitleSlotId,
          interactiveControlCount: 0,
          containsForbiddenCopy: false,
          landscapeCompactMediaQueryActive: viewport.name === "667x375",
          viewport: {
            width: viewport.width,
            height: viewport.height,
          },
          scroll: { x: 0, y: 0 },
          internalScroll: {
            rootX: 0,
            rootY: 0,
            stageX: 0,
            stageY: 0,
          },
          copyOverlapsVisuals: {
            titlePortal: false,
            titleLia: false,
            titleProgress: false,
            subtitlePortal: false,
            subtitleLia: false,
            subtitleProgress: false,
            titleSubtitle: false,
          },
          visualElementsPresent: {
            portal: true,
            lia: true,
            progress: true,
          },
        });
        expect(runtimeSnapshot.horizontalOverflow).not.toBeNull();
        expect(runtimeSnapshot.verticalOverflow).not.toBeNull();
        expect(
          runtimeSnapshot.horizontalOverflow ?? Infinity,
        ).toBeLessThanOrEqual(1);
        expect(
          runtimeSnapshot.verticalOverflow ?? Infinity,
        ).toBeLessThanOrEqual(1);
        expect(runtimeSnapshot.fontSizes.title).toBeGreaterThanOrEqual(17.28);
        expect(runtimeSnapshot.fontSizes.subtitle).toBeGreaterThanOrEqual(
          14.08,
        );
        if (viewport.name === "667x375") {
          expect(runtimeSnapshot.fontSizes.title).toBeGreaterThanOrEqual(18);
          expect(runtimeSnapshot.fontSizes.subtitle).toBeGreaterThanOrEqual(14);
        }
        for (const rect of [
          runtimeSnapshot.titleRect,
          runtimeSnapshot.subtitleRect,
        ]) {
          expect(rect).not.toBeNull();
          expect(rect?.x).toBeGreaterThanOrEqual(0);
          expect(rect?.y).toBeGreaterThanOrEqual(0);
          expect(rect?.right).toBeLessThanOrEqual(viewport.width);
          expect(rect?.bottom).toBeLessThanOrEqual(viewport.height);
        }

        await expect(page).toHaveURL(
          new RegExp(`${transition.toRoute.replace("/", "\\/")}$`),
          { timeout: 12000 },
        );
        await page.waitForTimeout(250);
        expect(destinationNavigations).toBe(1);
        expect(await storageSnapshot(page)).toEqual(storageBefore);
        expectTelemetryClean(telemetry);
        page.off("framenavigated", countDestinationNavigation);

        measurements.push({
          ...transition,
          screenshot: screenshotName,
          viewport,
          runtimeSnapshot,
          destinationNavigations,
          storageUnchanged: true,
        });
      }

      await fs.writeFile(
        path.join(evidenceDir, `${viewport.name}_metrics.json`),
        `${JSON.stringify(
          {
            state: "ST5_020I_BROWSER_PASS",
            browser: "chromium",
            measurements,
            telemetry,
          },
          null,
          2,
        )}\n`,
        "utf8",
      );
    });
  });
}
