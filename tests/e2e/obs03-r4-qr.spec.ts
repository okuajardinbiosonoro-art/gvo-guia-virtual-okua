import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const QRCode = require("qrcode") as {
  toDataURL(
    value: string,
    options: { width: number; margin: number },
  ): Promise<string>;
};
type Locale = "es" | "en";
type CameraRecord = {
  audio: boolean | MediaTrackConstraints | undefined;
  stopCalls: number;
  tracks: MediaStreamTrack[];
  requestedAt: number;
  frame: "blank" | "wrong-canonical";
  outcome: "pending" | "rejected" | "granted";
};
type CameraLab = {
  records: CameraRecord[];
  emitWrong: (() => void) | null;
  holdNext: boolean;
  failPending: (() => void) | null;
};
declare global {
  interface Window {
    __obs03R4QrLab?: CameraLab;
  }
}

async function fixture(page: Page, locale: Locale) {
  await page.addInitScript((language) => {
    // SYNTHETIC ACCESS ONLY: closed Cover/I expose the real exit UI. No QR,
    // route-credit II, quiz points or local activity is earned by this fixture.
    const order = {
      cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"],
      1: ["intro", "relacion", "percepcion", "mediacion"],
      2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"],
      3: ["INTRO", "PASO A PASO", "BENEFICIOS"],
      4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"],
      5: ["plantas", "sistema", "espacio", "visitante", "resultado"],
    };
    const room = (id: keyof typeof order, closed: boolean) => ({
      contentRevision: "OBS03.2",
      presentedStepIds: closed ? order[id] : [],
      confirmedStepIds: closed ? order[id] : [],
      assistedPresentedStepIds: [],
      activeStepId: closed ? null : order[id][0],
      interactionEvidence: [],
      outcome: null,
      closed,
    });
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("gvo.language.v1", language);
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [],
        updatedAt: "2026-10-23T12:00:00.000Z",
      }),
    );
    localStorage.setItem(
      "gvo.journey.essential.v1",
      JSON.stringify({
        schemaVersion: 1,
        contractRevision: "OBS03.2",
        revision: 0,
        cover: room("cover", true),
        stations: {
          1: room(1, true),
          2: room(2, false),
          3: room(3, false),
          4: room(4, false),
          5: room(5, false),
        },
        legacyRouteCredit: 0,
        migrationEvidence: {
          source: "captured_before_mount",
          globalStatus: "ok",
        },
        pendingTransition: null,
        finalReached: false,
      }),
    );
  }, locale);
}
async function installCamera(page: Page) {
  const wrongQr = await QRCode.toDataURL("/qr/w3", { width: 512, margin: 4 });
  await page.addInitScript((wrongImage) => {
    const lab: CameraLab = {
      records: [],
      emitWrong: null,
      holdNext: true,
      failPending: null,
    };
    window.__obs03R4QrLab = lab;
    const devices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: devices,
    });
    Object.defineProperty(devices, "getUserMedia", {
      configurable: true,
      value: async (constraints: MediaStreamConstraints) => {
        if (constraints.audio !== false)
          throw new Error("R4 QR lab requires audio:false");
        const record: CameraRecord = {
          audio: constraints.audio,
          stopCalls: 0,
          tracks: [],
          requestedAt: performance.now(),
          frame: "blank",
          outcome: "pending",
        };
        lab.records.push(record);
        if (lab.holdNext) {
          lab.holdNext = false;
          await new Promise<never>((_resolve, reject) => {
            void _resolve;
            lab.failPending = () => {
              record.outcome = "rejected";
              lab.failPending = null;
              reject(
                new DOMException(
                  "R4 camera laboratory recoverable error",
                  "AbortError",
                ),
              );
            };
          });
        }
        const image = new Image();
        image.src = wrongImage;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 640;
        const draw = canvas.getContext("2d")!;
        const paint = () => {
          draw.fillStyle = "white";
          draw.fillRect(0, 0, 640, 640);
          if (record.frame === "wrong-canonical")
            draw.drawImage(image, 64, 64, 512, 512);
        };
        lab.emitWrong = () => {
          record.frame = "wrong-canonical";
          paint();
        };
        paint();
        const stream = canvas.captureStream(12),
          timer = window.setInterval(paint, 80);
        record.tracks = stream.getTracks();
        record.outcome = "granted";
        for (const track of record.tracks) {
          const original = track.stop.bind(track);
          track.stop = () => {
            record.stopCalls++;
            original();
            if (record.tracks.every((t) => t.readyState === "ended"))
              window.clearInterval(timer);
          };
        }
        return stream;
      },
    });
  }, wrongQr);
}
async function labState(page: Page) {
  return page.evaluate(
    () =>
      window.__obs03R4QrLab?.records.map((r) => ({
        audio: r.audio,
        stopCalls: r.stopCalls,
        requestedAt: r.requestedAt,
        frame: r.frame,
        outcome: r.outcome,
        trackStates: r.tracks.map((t) => t.readyState),
      })) ?? [],
  );
}
async function facts(page: Page) {
  return page.evaluate(() =>
    Object.fromEntries(
      [
        "gvo.journey.essential.v1",
        "gvo.progress.v1",
        "gvo.station5.quiz.v1",
        "gvo.station4.ordering.v1",
        "gvo.station3.practice.v2",
      ].map((key) => [key, localStorage.getItem(key)]),
    ),
  );
}
async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}
async function geometry(dialog: Locator) {
  return dialog.evaluate((node) => {
    const rect = (el: Element) => el.getBoundingClientRect().toJSON();
    const scanner = node.querySelector(".interstation-qr-gate__scanner")!;
    const s = getComputedStyle(node);
    return {
      overlay: rect(node),
      scanner: rect(scanner),
      cameraStatus: node.getAttribute("data-camera-status"),
      scanStatus: node.getAttribute("data-qr-scan-status"),
      position: s.position,
      left: s.left,
      right: s.right,
      top: s.top,
      bottom: s.bottom,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        dpr: devicePixelRatio,
      },
      documentScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overlayScrollWidth: node.scrollWidth,
      overlayClientWidth: node.clientWidth,
      paragraphs: Array.from(node.querySelectorAll("p")).map((p) => ({
        text: p.innerText,
        rect: rect(p),
        color: getComputedStyle(p).color,
      })),
      scroll: {
        documentX: scrollX,
        documentY: scrollY,
        overlayY: node.scrollTop,
      },
    };
  });
}
function assertGeometry(g: Awaited<ReturnType<typeof geometry>>) {
  expect(g.position).toBe("fixed");
  expect(g.overlay.x).toBeCloseTo(0, 1);
  expect(g.overlay.y).toBeCloseTo(0, 1);
  expect(g.overlay.width).toBeCloseTo(g.viewport.width, 1);
  expect(g.overlay.height).toBeCloseTo(g.viewport.height, 1);
  expect(g.documentScrollWidth).toBeLessThanOrEqual(g.viewport.width + 1);
  expect(g.bodyScrollWidth).toBeLessThanOrEqual(g.viewport.width + 1);
  expect(g.overlayScrollWidth).toBeLessThanOrEqual(g.overlayClientWidth + 1);
  expect(g.scanner.x).toBeGreaterThanOrEqual(0);
  expect(g.scanner.right).toBeLessThanOrEqual(g.viewport.width + 1);
  for (const p of g.paragraphs) {
    expect(p.color).toBe("rgb(248, 246, 233)");
    expect(p.rect.left).toBeGreaterThanOrEqual(0);
    expect(p.rect.right).toBeLessThanOrEqual(g.viewport.width + 1);
  }
}
async function closeTarget(button: Locator) {
  await button.focus();
  await button.scrollIntoViewIfNeeded();
  return button.evaluate((node) => {
    const r = node.getBoundingClientRect(),
      xs = [0.25, 0.75],
      ys = [0.25, 0.75];
    return {
      focused: document.activeElement === node,
      rect: r.toJSON(),
      visible:
        r.left >= 0 &&
        r.right <= innerWidth + 1 &&
        r.top >= 0 &&
        r.bottom <= innerHeight + 1,
      hits: xs.flatMap((x) =>
        ys.map((y) => {
          const hit = document.elementFromPoint(
            r.left + r.width * x,
            r.top + r.height * y,
          );
          return {
            inside: !!hit && (node === hit || node.contains(hit)),
            tag: hit?.tagName,
            className: hit?.getAttribute("class"),
          };
        }),
      ),
    };
  });
}

async function contrastSample(
  target: Locator,
  page: Page,
  info: TestInfo,
  stem: string,
  rootSelector: string,
) {
  await target.scrollIntoViewIfNeeded();
  await settle(page);
  const sample = await target.evaluate((node) => {
    const describe = (element: Element) => {
      const s = getComputedStyle(element);
      return {
        tag: element.tagName,
        id: element.id,
        className: element.className,
        rect: element.getBoundingClientRect().toJSON(),
        color: s.color,
        textFillColor: s.webkitTextFillColor,
        opacity: s.opacity,
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        backgroundBlendMode: s.backgroundBlendMode,
        mixBlendMode: s.mixBlendMode,
        filter: s.filter,
        backdropFilter: s.backdropFilter,
        textShadow: s.textShadow,
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        transform: s.transform,
        overflowX: s.overflowX,
        overflowY: s.overflowY,
        visibility: s.visibility,
      };
    };
    const chain = [];
    let effectiveOpacity = 1;
    for (
      let current: Element | null = node;
      current;
      current = current.parentElement
    ) {
      chain.push(describe(current));
      effectiveOpacity *= Number(getComputedStyle(current).opacity);
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT),
      fragments = [];
    while (walker.nextNode()) {
      const text = walker.currentNode as Text,
        element = text.parentElement!;
      if (
        !text.textContent?.trim() ||
        element.closest(
          '.sr-only,[inert],[aria-hidden="true"],[hidden],:disabled',
        ) ||
        getComputedStyle(element).visibility !== "visible"
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of Array.from(range.getClientRects())) {
        const x = Math.max(
            0,
            Math.min(innerWidth - 1, rect.x + rect.width / 2),
          ),
          y = Math.max(0, Math.min(innerHeight - 1, rect.y + rect.height / 2));
        fragments.push({
          text: text.textContent.trim(),
          rect: rect.toJSON(),
          element: describe(element),
          midpoint: { x, y },
          insideViewport:
            rect.left >= 0 &&
            rect.right <= innerWidth &&
            rect.top >= 0 &&
            rect.bottom <= innerHeight,
          paintedStackAtMidpoint: document
            .elementsFromPoint(x, y)
            .slice(0, 12)
            .map(describe),
        });
      }
    }
    return {
      target: describe(node),
      effectiveOpacity,
      ancestorChain: chain,
      lineFragments: fragments,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        devicePixelRatio,
        visualViewport: visualViewport
          ? {
              width: visualViewport.width,
              height: visualViewport.height,
              scale: visualViewport.scale,
              offsetLeft: visualViewport.offsetLeft,
              offsetTop: visualViewport.offsetTop,
            }
          : null,
      },
      documentBackground: {
        html: describe(document.documentElement),
        body: describe(document.body),
      },
      scroll: { x: scrollX, y: scrollY },
    };
  });
  const normal = info.outputPath(`${stem}-normal.png`),
    background = info.outputPath(`${stem}-glyph-fill-transparent.png`);
  await page.screenshot({ path: normal, fullPage: false, scale: "css" });
  let transparentStyle;
  let transparentGeometry;
  try {
    // Test-only glyph fill suppression preserves box geometry and backgrounds,
    // including artwork/gradients/alpha. Shadows are intentionally not removed:
    // their resolved values remain in JSON and limit subsequent pixel sampling.
    transparentStyle = await page.addStyleTag({
      content: `${rootSelector}, ${rootSelector} * { -webkit-text-fill-color: transparent !important; }`,
    });
    await settle(page);
    transparentGeometry = await target.evaluate((node) =>
      node.getBoundingClientRect().toJSON(),
    );
    await page.screenshot({ path: background, fullPage: false, scale: "css" });
  } finally {
    if (transparentStyle)
      await transparentStyle.evaluate((node) => node.remove());
    await settle(page);
  }
  expect(transparentGeometry!.x).toBeCloseTo(sample.target.rect.x, 2);
  expect(transparentGeometry!.y).toBeCloseTo(sample.target.rect.y, 2);
  expect(transparentGeometry!.width).toBeCloseTo(sample.target.rect.width, 2);
  expect(transparentGeometry!.height).toBeCloseTo(sample.target.rect.height, 2);
  return {
    normal,
    glyphFillTransparent: background,
    transparencyRestored: true,
    method:
      "Resolved CSS foreground/opacity/layer chain and actual viewport PNG pair. No flat/dominant-colour substitute or universal WCAG result. Text-shadow/filter/blend effects are retained and must be considered when sampling.",
    ...sample,
  };
}

test.describe("OBS03 R4 QR modal · actual portal, declared access and real ZXing lab stream", () => {
  for (const locale of ["es", "en"] as const)
    test(`${locale} · pending/error/retry/incorrect QR, containment and text200 evidence`, async ({
      page,
    }, info) => {
      test.setTimeout(240000);
      const pageErrors: string[] = [];
      page.on("pageerror", (e) => pageErrors.push(e.message));
      await fixture(page, locale);
      await installCamera(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/estacion/1");
      await expect(
        page.locator(
          '.gvo-prepared-tree[data-journey-active="true"] main.world1-root-screen',
        ),
      ).toBeVisible({ timeout: 25000 });
      await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
      await settle(page);
      const originalHtmlStyle = await page
          .locator("html")
          .getAttribute("style"),
        phases: Array<Record<string, unknown>> = [];
      const before = await facts(page),
        baselineFont = await page
          .locator("html")
          .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      const sizes = [
        { width: 280, height: 640 },
        { width: 320, height: 568 },
        { width: 390, height: 844 },
        { width: 568, height: 280 },
        { width: 390, height: 844, enlarged: true },
      ];
      let stage = "preparation";
      try {
        for (const [index, size] of sizes.entries()) {
          stage = `viewport_${index + 1}`;
          await page.setViewportSize({
            width: size.width,
            height: size.height,
          });
          if ("enlarged" in size)
            await page.evaluate(() =>
              document.documentElement.style.setProperty(
                "font-size",
                "200%",
                "important",
              ),
            );
          await settle(page);
          await page.evaluate(() => {
            window.__obs03R4QrLab!.holdNext = true;
          });
          const open = page.locator('[data-interstation-qr-action="open"]');
          await expect(open).toBeEnabled();
          await open.focus();
          await open.click();
          const dialog = page.getByRole("dialog");
          await expect(dialog).toHaveAttribute("aria-modal", "true");
          await expect(dialog).toHaveAttribute(
            "data-camera-status",
            "camera-permission-pending",
          );
          await expect(dialog).toHaveAttribute(
            "data-qr-scan-status",
            "reading",
          );
          await expect(dialog.locator("h2")).toBeFocused();
          expect(
            await page.evaluate(() => "__GVO_QR_TEST_MODE__" in window),
          ).toBe(false);
          const stateGeometries: Array<Record<string, unknown>> = [];
          const phase: { [key: string]: unknown; contrastSamples: unknown[] } =
            {
              viewport: size,
              label:
                "enlarged" in size
                  ? "CSS_ROOT_FONT_200_PERCENT_NOT_NATIVE_ZOOM"
                  : "UNMODIFIED_BASELINE",
              baselineRootFontPx: baselineFont,
              actualRootFontPx: await page
                .locator("html")
                .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
              initialPendingGeometry: await geometry(dialog),
              stateGeometries,
              contrastSamples: [],
            };
          phases.push(phase);
          assertGeometry(
            phase.initialPendingGeometry as Awaited<
              ReturnType<typeof geometry>
            >,
          );
          for (const state of [
            "permission-pending",
            "camera-error",
            "reading",
            "wrong-qr",
          ] as const) {
            stage = `viewport_${index + 1}_${state}`;
            if (state === "permission-pending")
              await expect
                .poll(() =>
                  page.evaluate(
                    () => window.__obs03R4QrLab!.failPending !== null,
                  ),
                )
                .toBe(true);
            else if (state === "camera-error") {
              // Reject the pending API request; the unmodified camera error classifier
              // and native gate recovery UI produce the visible error, never a status hook.
              await page.evaluate(() => window.__obs03R4QrLab!.failPending!());
              await expect(dialog).toHaveAttribute(
                "data-camera-status",
                "camera-error",
              );
              const retry = dialog.locator(
                '[data-interstation-qr-action="retry-camera"]',
              );
              await expect(retry).toHaveAccessibleName(
                locale === "en" ? "Retry camera" : "Reintentar cámara",
              );
              const target = await closeTarget(retry);
              phase.errorRetryTarget = target;
              expect(target.focused).toBe(true);
              expect(target.visible).toBe(true);
              expect(target.rect.width).toBeGreaterThanOrEqual(44);
              expect(target.rect.height).toBeGreaterThanOrEqual(44);
              expect(target.hits.every((hit) => hit.inside)).toBe(true);
            } else if (state === "reading") {
              await dialog
                .locator('[data-interstation-qr-action="retry-camera"]')
                .click();
              await expect(dialog).toHaveAttribute(
                "data-camera-status",
                "camera-granted",
              );
              await expect(dialog).toHaveAttribute(
                "data-qr-scan-status",
                "reading",
              );
              await expect(dialog.locator("video")).toBeVisible();
            } else {
              await page.evaluate(() => window.__obs03R4QrLab!.emitWrong!());
              await expect(dialog).toHaveAttribute(
                "data-qr-scan-status",
                "wrong-qr",
                { timeout: 20000 },
              );
            }
            for (const [sampleIndex, selector] of [
              "[data-camera-status-message]",
              "[data-qr-scan-message]",
            ].entries()) {
              const target = dialog.locator(selector);
              await expect(target).toBeVisible();
              const captured = await contrastSample(
                target,
                page,
                info,
                `QR-${locale}-${size.width}x${size.height}-${"enlarged" in size ? "text200" : "base"}-${state}-p${sampleIndex + 1}`,
                ".interstation-qr-gate--open",
              );
              phase.contrastSamples.push({
                scanState: state,
                selector,
                ...captured,
              });
              expect(captured.lineFragments.length).toBeGreaterThan(0);
              for (const fragment of captured.lineFragments)
                expect(
                  fragment.insideViewport,
                  `Visible message line outside viewport: ${fragment.text}`,
                ).toBe(true);
            }
            const measured = await geometry(dialog);
            stateGeometries.push({ state, ...measured });
            assertGeometry(measured);
            expect(await facts(page)).toEqual(before);
            await expect(page).toHaveURL(/\/estacion\/1$/);
          }
          const close = dialog.locator('[data-interstation-qr-action="close"]');
          const control = await closeTarget(close);
          phase.closeTarget = control;
          expect(control.focused).toBe(true);
          expect(control.visible).toBe(true);
          expect(control.rect.width).toBeGreaterThanOrEqual(44);
          expect(control.rect.height).toBeGreaterThanOrEqual(44);
          expect(control.hits.every((hit) => hit.inside)).toBe(true);
          await page.keyboard.press("Tab");
          await expect(close).toBeFocused();
          await page.keyboard.press("Shift+Tab");
          await expect(close).toBeFocused();
          await close.click();
          await expect(dialog).toHaveCount(0);
          await expect(open).toBeFocused();
          await expect
            .poll(async () => {
              const records = await labState(page);
              return records.every((r) =>
                r.trackStates.every((s) => s === "ended"),
              );
            })
            .toBe(true);
          phase.afterCloseCamera = await labState(page);
          expect(await facts(page)).toEqual(before);
        }
        const camera = await labState(page);
        expect(camera).toHaveLength(10);
        expect(camera.filter((r) => r.outcome === "rejected")).toHaveLength(5);
        expect(camera.filter((r) => r.outcome === "granted")).toHaveLength(5);
        expect(phases).toHaveLength(5);
        expect(
          (phases[4].actualRootFontPx as number) / baselineFont,
        ).toBeCloseTo(2, 2);
        expect(pageErrors).toEqual([]);
        stage = "completed";
      } finally {
        await page.evaluate((prior) => {
          if (prior === null) document.documentElement.removeAttribute("style");
          else document.documentElement.setAttribute("style", prior);
        }, originalHtmlStyle);
        await info.attach("OBS03-R4-QR-composite-evidence", {
          contentType: "application/json",
          body: JSON.stringify(
            {
              qualification:
                "Synthetic closed Cover/I prerequisite only; real native opener/portal, pending getUserMedia rejected AbortError, native camera-error and Retry camera, canvas.captureStream blank then canonical wrong /qr/w3 read by production ZXing. No QR decode event or DEV hook, no valid advance, global credit, physical camera or human approval. CSS root-font200 is text reflow, not native zoom. Exact PNG pairs preserve backgrounds/shadows; clipped sr-only labels excluded from painted glyph samples. Contrast remains pending offline sampling, never inferred from a geometry PASS.",
              scene: "QR-modal",
              locale,
              stage,
              beforeFacts: before,
              afterFacts: await facts(page),
              phases,
              camera: await labState(page),
              pageErrors,
              originalHtmlStyleRestored:
                (await page.locator("html").getAttribute("style")) ===
                originalHtmlStyle,
            },
            null,
            2,
          ),
        });
      }
    });
});
