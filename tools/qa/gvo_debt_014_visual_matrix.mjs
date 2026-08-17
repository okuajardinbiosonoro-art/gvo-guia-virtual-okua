/* global Document, Element, Event, HTMLElement, HTMLImageElement, Navigator, URL, document, getComputedStyle, localStorage, sessionStorage, window */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl = process.env.GVO_DEBT_014_BASE_URL ?? "http://127.0.0.1:5173";
const outputDirectory = path.resolve(
  "test-results",
  "gvo-debt-014",
  "visual-matrix",
);
const progressKey = "gvo.progress.v1";
const reviewContextKey = "gvo.final.reviewContext.v1";

const completeProgress = {
  completedStations: [1, 2, 3, 4, 5],
  schemaVersion: 1,
  updatedAt: "2026-08-16T12:00:00.000Z",
};
const coverRevisitContext = {
  mode: "final-cover-revisit",
  origin: "/final",
  startedAt: "2026-08-16T12:00:00.000Z",
  timestamp: 1_787_000_000_000,
  version: 1,
};

const scenarios = [
  {
    id: "inicio-local-fullscreen-portrait-390x844",
    kind: "inicio",
    route: "/inicio",
    viewport: { width: 390, height: 844 },
  },
  ...[
    { name: "portrait-390x844", width: 390, height: 844 },
    { name: "landscape-844x390", width: 844, height: 390 },
    { name: "desktop-1440x900", width: 1440, height: 900 },
  ].map(({ name, width, height }) => ({
    id: `cover-normal-${name}`,
    kind: "cover-normal",
    route: "/portada?resetIntro=1",
    viewport: { width, height },
  })),
  {
    id: "cover-revisit-portrait-390x844",
    kind: "cover-revisit",
    route: "/portada",
    viewport: { width: 390, height: 844 },
  },
  ...[1, 2, 3, 4, 5].map((world) => ({
    id: `world-${world}-global-fullscreen-390x844`,
    kind: "world",
    route: `/estacion/${world}`,
    viewport: { width: 390, height: 844 },
  })),
  {
    id: "final-global-fullscreen-landscape-844x390",
    kind: "final",
    route: "/final",
    viewport: { width: 844, height: 390 },
  },
];

function fail(message) {
  throw new Error(`GVO_DEBT_014 visual matrix FAIL: ${message}`);
}

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const externalRequests = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("request", (request) => {
      const requestUrl = new URL(request.url());
      if (
        requestUrl.origin !== new URL(baseUrl).origin &&
        !requestUrl.protocol.startsWith("data")
      ) {
        externalRequests.push(request.url());
      }
    });

    await page.addInitScript(
      ({ contextKey, progress, progressStorageKey, revisit, scenarioKind }) => {
        let fullscreenElement = null;
        Object.defineProperty(Document.prototype, "fullscreenEnabled", {
          configurable: true,
          get: () => true,
        });
        Object.defineProperty(Document.prototype, "fullscreenElement", {
          configurable: true,
          get: () => fullscreenElement,
        });
        Object.defineProperty(Element.prototype, "requestFullscreen", {
          configurable: true,
          value: async () => {
            fullscreenElement = document.documentElement;
            document.dispatchEvent(new Event("fullscreenchange"));
          },
        });
        Object.defineProperty(Document.prototype, "exitFullscreen", {
          configurable: true,
          value: async () => {
            fullscreenElement = null;
            document.dispatchEvent(new Event("fullscreenchange"));
          },
        });
        Object.defineProperty(Navigator.prototype, "userActivation", {
          configurable: true,
          get: () => ({ isActive: true }),
        });

        localStorage.clear();
        sessionStorage.clear();
        if (
          scenarioKind === "world" ||
          scenarioKind === "final" ||
          scenarioKind === "cover-revisit"
        ) {
          localStorage.setItem(progressStorageKey, JSON.stringify(progress));
        }
        if (scenarioKind === "cover-revisit") {
          sessionStorage.setItem(contextKey, JSON.stringify(revisit));
        }
      },
      {
        contextKey: reviewContextKey,
        progress: completeProgress,
        progressStorageKey: progressKey,
        revisit: coverRevisitContext,
        scenarioKind: scenario.kind,
      },
    );

    await page.goto(`${baseUrl}${scenario.route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    const readinessSelector =
      scenario.kind === "inicio"
        ? "[data-initial-experience='debt-012']"
        : scenario.kind.startsWith("cover")
          ? "[data-critical-assets-ready='true']"
          : scenario.kind === "final"
            ? "[data-final-root='mirador_editorial_final']"
            : "main";
    await page.locator(readinessSelector).first().waitFor({
      state: "visible",
      timeout: 30_000,
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map(async (image) => {
          if (!image.complete) {
            await new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            });
          }
          await image.decode().catch(() => undefined);
        }),
      );
    });

    const metrics = await page.evaluate(() => {
      const intersects = (first, second) =>
        first &&
        second &&
        first.left < second.right &&
        first.right > second.left &&
        first.top < second.bottom &&
        first.bottom > second.top;
      const rect = (element) => {
        if (!(element instanceof HTMLElement)) return null;
        const bounds = element.getBoundingClientRect();
        return {
          left: bounds.left,
          top: bounds.top,
          right: bounds.right,
          bottom: bounds.bottom,
          width: bounds.width,
          height: bounds.height,
        };
      };
      const globalControl = document.querySelector(
        "[data-gvo-immersive-control='fullscreen']",
      );
      const globalRect = rect(globalControl);
      const interactiveCollisions = Array.from(
        document.querySelectorAll("button, a[href], [role='button']"),
      )
        .filter(
          (element) =>
            element !== globalControl &&
            !element.contains(globalControl) &&
            getComputedStyle(element).visibility !== "hidden" &&
            getComputedStyle(element).display !== "none" &&
            Number(getComputedStyle(element).opacity) > 0,
        )
        .map((element) => ({
          label:
            element.getAttribute("aria-label") ?? element.textContent?.trim(),
          rect: rect(element),
        }))
        .filter((entry) => intersects(globalRect, entry.rect));

      const portal = document.querySelector("[data-portal-id='portal-1']");
      const frame = portal?.querySelector(".cover-intro__portal-frame");
      const interior = portal?.querySelector(
        "[data-portal-clip='primary-safe']",
      );
      let portalOne = null;
      if (
        frame instanceof HTMLImageElement &&
        interior instanceof HTMLImageElement
      ) {
        const frameBox = frame.getBoundingClientRect();
        const interiorBox = interior.getBoundingClientRect();
        const scale = Math.min(
          frameBox.width / frame.naturalWidth,
          frameBox.height / frame.naturalHeight,
        );
        const renderedWidth = frame.naturalWidth * scale;
        const renderedHeight = frame.naturalHeight * scale;
        const slot = {
          left: frameBox.left + (frameBox.width - renderedWidth) / 2,
          right: frameBox.right - (frameBox.width - renderedWidth) / 2,
          top: frameBox.top + (frameBox.height - renderedHeight) / 2,
          bottom: frameBox.bottom - (frameBox.height - renderedHeight) / 2,
        };
        const visibleInterior = {
          left: interiorBox.left,
          right: interiorBox.right,
          top: interiorBox.top + 1,
          bottom: interiorBox.bottom - 1,
        };
        portalOne = {
          slot,
          interior: visibleInterior,
          overflow: {
            top: Math.max(0, slot.top - visibleInterior.top),
            right: Math.max(0, visibleInterior.right - slot.right),
            bottom: Math.max(0, visibleInterior.bottom - slot.bottom),
            left: Math.max(0, slot.left - visibleInterior.left),
          },
          clipPath: getComputedStyle(interior).clipPath,
          objectFit: getComputedStyle(interior).objectFit,
        };
      }

      return {
        path: window.location.pathname,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        globalControls: document.querySelectorAll(
          "[data-gvo-immersive-control='fullscreen']",
        ).length,
        localInitialControls: document.querySelectorAll(
          "[data-initial-fullscreen-action='request']",
        ).length,
        fullscreenState: globalControl?.getAttribute(
          "data-gvo-immersive-state",
        ),
        interactiveCollisions,
        revisit: document
          .querySelector("[data-cover-revisit]")
          ?.getAttribute("data-cover-revisit"),
        availablePortals: document.querySelectorAll(
          "[data-portal-state='available']",
        ).length,
        lockedPortals: document.querySelectorAll("[data-portal-state='locked']")
          .length,
        locks: document.querySelectorAll(".cover-intro__portal-lock").length,
        portalOne,
      };
    });

    if (consoleErrors.length || externalRequests.length) {
      fail(
        `${scenario.id}: console=${consoleErrors.join(" | ")} external=${externalRequests.join(" | ")}`,
      );
    }
    if (metrics.scrollWidth > metrics.viewport.width + 1) {
      fail(`${scenario.id}: overflow horizontal`);
    }
    if (metrics.interactiveCollisions.length) {
      fail(`${scenario.id}: fullscreen solapa controles interactivos`);
    }
    if (scenario.kind === "inicio") {
      if (metrics.globalControls !== 0 || metrics.localInitialControls !== 1) {
        fail(`${scenario.id}: /inicio no conserva autoridad local única`);
      }
    } else if (
      metrics.globalControls !== 1 ||
      metrics.localInitialControls !== 0
    ) {
      fail(`${scenario.id}: no hay exactamente un control global`);
    }
    if (scenario.kind === "cover-normal") {
      if (metrics.lockedPortals !== 4 || metrics.locks !== 4) {
        fail(`${scenario.id}: gating normal alterado`);
      }
      if (
        !metrics.portalOne ||
        metrics.portalOne.objectFit !== "cover" ||
        Math.max(...Object.values(metrics.portalOne.overflow)) > 0.25
      ) {
        fail(`${scenario.id}: Portal I fuera de slot`);
      }
    }
    if (
      scenario.kind === "cover-revisit" &&
      (metrics.revisit !== "active" ||
        metrics.availablePortals !== 5 ||
        metrics.locks !== 0)
    ) {
      fail(`${scenario.id}: revisita no desbloquea I–V`);
    }

    await page.screenshot({
      path: path.join(outputDirectory, `${scenario.id}.png`),
      fullPage: false,
    });
    results.push({
      ...scenario,
      consoleErrors,
      externalRequests,
      metrics,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDirectory, "matrix.json"),
  `${JSON.stringify({ baseUrl, results }, null, 2)}\n`,
  "utf8",
);

console.log(
  `GVO_DEBT_014 visual matrix PASS: ${results.length}/${scenarios.length} escenarios`,
);
