/* global document, Document, Element, getComputedStyle, HTMLElement, HTMLImageElement, localStorage, requestAnimationFrame, URL, window */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl = process.env.GVO_DEBT_013C_BASE_URL ?? "http://127.0.0.1:5173";
const outputDirectory = path.resolve(
  "test-results",
  "gvo-debt-013c",
  "visual-matrix",
);
const coverCompletedKey = "gvo.coverIntro.introCompleted.v1";

const scenarios = [
  {
    id: "inicio-es-portrait-390x844",
    kind: "inicio",
    route: "/inicio",
    viewport: { width: 390, height: 844 },
    language: "es",
  },
  {
    id: "inicio-en-landscape-844x390",
    kind: "inicio",
    route: "/inicio",
    viewport: { width: 844, height: 390 },
    language: "en",
  },
  {
    id: "inicio-fallback-desktop-1440x900",
    kind: "inicio-fallback",
    route: "/inicio",
    viewport: { width: 1440, height: 900 },
    language: "es",
  },
  {
    id: "portada-idle-portrait-390x844",
    kind: "cover-idle",
    route: "/portada?resetIntro=1",
    viewport: { width: 390, height: 844 },
  },
  {
    id: "portada-idle-landscape-844x390",
    kind: "cover-idle",
    route: "/portada?resetIntro=1",
    viewport: { width: 844, height: 390 },
  },
  {
    id: "portada-idle-desktop-1440x900",
    kind: "cover-idle",
    route: "/portada?resetIntro=1",
    viewport: { width: 1440, height: 900 },
  },
  {
    id: "portada-opening-portrait-390x844",
    kind: "cover-opening",
    route: "/portada",
    viewport: { width: 390, height: 844 },
  },
  {
    id: "portada-handoff-portrait-390x844",
    kind: "cover-handoff",
    route: "/portada",
    viewport: { width: 390, height: 844 },
  },
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

async function settleImages(page) {
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
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

function intersects(first, second) {
  return (
    first &&
    second &&
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  );
}

try {
  for (const scenario of scenarios) {
    const context = await browser.newContext({
      viewport: scenario.viewport,
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
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

    if (scenario.kind === "inicio-fallback") {
      await page.addInitScript(() => {
        Object.defineProperty(Document.prototype, "fullscreenEnabled", {
          configurable: true,
          get: () => false,
        });
        Object.defineProperty(Element.prototype, "requestFullscreen", {
          configurable: true,
          value: undefined,
        });
      });
    }
    if (
      scenario.kind === "cover-opening" ||
      scenario.kind === "cover-handoff"
    ) {
      await page.addInitScript(
        (key) => localStorage.setItem(key, "true"),
        coverCompletedKey,
      );
    }

    await page.goto(`${baseUrl}${scenario.route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (scenario.kind.startsWith("inicio")) {
      await page
        .locator("[data-initial-experience='debt-012']")
        .waitFor({ state: "visible", timeout: 30_000 });
      const languageName = scenario.language === "en" ? "English" : "Español";
      await page.getByRole("button", { name: languageName }).click();
      if (scenario.language === "en") {
        await page.reload({ waitUntil: "domcontentloaded" });
        await page
          .locator("[data-initial-language='en']")
          .waitFor({ state: "visible", timeout: 20_000 });
      }
    } else {
      await page
        .locator("[data-critical-assets-ready='true']")
        .waitFor({ state: "visible", timeout: 30_000 });
      if (
        scenario.kind === "cover-opening" ||
        scenario.kind === "cover-handoff"
      ) {
        const portalOne = page.locator("[data-portal-id='portal-1']");
        await portalOne.waitFor({ state: "visible", timeout: 20_000 });
        await portalOne.click();
        if (scenario.kind === "cover-opening") {
          await page
            .locator("[data-cover-phase='portal_1_opening_placeholder']")
            .waitFor({ state: "visible", timeout: 5_000 });
        } else {
          await page.waitForURL("**/transition/intro-to-station-1", {
            timeout: 10_000,
          });
          await page
            .locator("[data-transition-world-version]")
            .first()
            .waitFor({ state: "visible", timeout: 20_000 });
        }
      } else {
        await page
          .locator("[data-cover-phase='portada_idle']")
          .waitFor({ state: "visible", timeout: 20_000 });
      }
    }

    await settleImages(page);

    const metrics = await page.evaluate(() => {
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
      const coverInteriors = Array.from(
        document.querySelectorAll("[data-cover-portal-interior]"),
      ).map((image) => {
        const style = getComputedStyle(image);
        const portal = image.closest("[data-portal-id]");
        const frame = portal?.querySelector(".cover-intro__portal-frame");
        const lock = portal?.querySelector(".cover-intro__portal-lock");
        return {
          id: image.getAttribute("data-cover-portal-interior"),
          src: image.getAttribute("data-runtime-asset"),
          complete: image instanceof HTMLImageElement ? image.complete : false,
          naturalWidth:
            image instanceof HTMLImageElement ? image.naturalWidth : 0,
          naturalHeight:
            image instanceof HTMLImageElement ? image.naturalHeight : 0,
          objectFit: style.objectFit,
          pointerEvents: style.pointerEvents,
          zIndex: Number(style.zIndex),
          frameZIndex: frame ? Number(getComputedStyle(frame).zIndex) : null,
          lockZIndex: lock ? Number(getComputedStyle(lock).zIndex) : null,
          rect: rect(image),
          portalRect: rect(portal),
        };
      });
      const initialAssets = Array.from(
        document.querySelectorAll("[data-entry-cover-station-asset]"),
      ).map((image) => ({
        id: image.getAttribute("data-entry-cover-station-asset"),
        src: image.getAttribute("data-runtime-asset"),
        complete: image instanceof HTMLImageElement ? image.complete : false,
        naturalWidth:
          image instanceof HTMLImageElement ? image.naturalWidth : 0,
        naturalHeight:
          image instanceof HTMLImageElement ? image.naturalHeight : 0,
      }));
      const controls = Array.from(document.querySelectorAll("button")).map(
        (button) => ({
          label:
            button.getAttribute("aria-label") ?? button.textContent?.trim(),
          rect: rect(button),
        }),
      );

      return {
        currentPath: window.location.pathname,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        coverInteriors,
        initialAssets,
        lockedPortals: document.querySelectorAll(
          "[data-portal-state='locked'][aria-disabled='true']",
        ).length,
        locks: document.querySelectorAll(".cover-intro__portal-lock").length,
        cta: rect(
          document.querySelector(
            "[data-initial-experience-action='start'], .cover-intro__cta",
          ),
        ),
        lia: rect(document.querySelector("[data-testid='cover-lia-stage']")),
        dialogue: rect(document.querySelector("[role='dialog']")),
        controls,
        audioCount: document.querySelectorAll("audio").length,
        videoCount: document.querySelectorAll("video").length,
        htmlLanguage: document.documentElement.lang,
        fullscreenState: document
          .querySelector("[data-initial-experience]")
          ?.getAttribute("data-initial-fullscreen-state"),
      };
    });

    if (metrics.scrollWidth > metrics.viewport.width + 1) {
      throw new Error(`${scenario.id}: overflow horizontal`);
    }
    if (metrics.audioCount !== 0 || metrics.videoCount !== 0) {
      throw new Error(`${scenario.id}: audio/video fuera de alcance`);
    }
    if (consoleErrors.length || externalRequests.length) {
      throw new Error(
        `${scenario.id}: console=${consoleErrors.join(" | ")} external=${externalRequests.join(" | ")}`,
      );
    }

    if (scenario.kind.startsWith("inicio")) {
      if (
        metrics.initialAssets.length !== 5 ||
        metrics.initialAssets.some(
          (asset) =>
            !asset.complete ||
            asset.naturalWidth !== 1024 ||
            asset.naturalHeight !== 1024 ||
            !asset.src?.startsWith("/assets/gvo/stations/final-root/access/"),
        )
      ) {
        throw new Error(
          `${scenario.id}: regresión en representaciones de /inicio`,
        );
      }
      if (metrics.htmlLanguage !== scenario.language) {
        throw new Error(`${scenario.id}: idioma DOM inesperado`);
      }
      if (
        scenario.kind === "inicio-fallback" &&
        metrics.fullscreenState !== "unsupported"
      ) {
        throw new Error(`${scenario.id}: fallback fullscreen ausente`);
      }
    }

    if (
      scenario.kind.startsWith("cover-") &&
      scenario.kind !== "cover-handoff"
    ) {
      if (
        metrics.coverInteriors.length !== 5 ||
        metrics.coverInteriors.some(
          (asset) =>
            !asset.complete ||
            asset.naturalWidth !== 1024 ||
            asset.naturalHeight !== 1872 ||
            asset.objectFit !== "cover" ||
            asset.pointerEvents !== "none" ||
            !asset.src?.startsWith("/assets/runtime/cover-intro/portals/") ||
            asset.src.includes("/final-root/access/"),
        )
      ) {
        throw new Error(
          `${scenario.id}: interior dedicado incompleto o incorrecto`,
        );
      }
      if (
        metrics.coverInteriors.some(
          (asset) =>
            asset.frameZIndex <= asset.zIndex ||
            (asset.lockZIndex !== null && asset.lockZIndex <= asset.zIndex),
        )
      ) {
        throw new Error(
          `${scenario.id}: orden de capas interior/frame/lock inválido`,
        );
      }
      if (metrics.lockedPortals !== 4 || metrics.locks !== 4) {
        throw new Error(`${scenario.id}: estado bloqueado II–V no preservado`);
      }
      if (
        metrics.coverInteriors.some((asset) =>
          intersects(asset.rect, metrics.cta),
        )
      ) {
        throw new Error(`${scenario.id}: interior colisiona con CTA`);
      }
    }
    if (
      scenario.kind === "cover-handoff" &&
      metrics.currentPath !== "/transition/intro-to-station-1"
    ) {
      throw new Error(
        `${scenario.id}: handoff no alcanzó la transición esperada`,
      );
    }

    const undersizedControls = metrics.controls.filter(
      (control) =>
        control.rect && (control.rect.width < 44 || control.rect.height < 44),
    );
    if (undersizedControls.length) {
      throw new Error(`${scenario.id}: control menor de 44x44`);
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
  `GVO_DEBT_013C visual matrix PASS: ${results.length}/${scenarios.length} escenarios`,
);
