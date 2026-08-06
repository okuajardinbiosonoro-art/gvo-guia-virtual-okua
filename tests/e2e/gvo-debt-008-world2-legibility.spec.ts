import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { expect, test, type Locator, type Page } from "@playwright/test";

const PHASE = process.env.GVO_DEBT_008_PHASE === "before" ? "before" : "after";
const EVIDENCE_DIRECTORY = path.resolve(
  "test-results/evidence/gvo-debt-008",
  PHASE,
);
const SCREENSHOT_DIRECTORY = path.join(EVIDENCE_DIRECTORY, "screenshots");
const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const WORLD2_CHECKPOINT_KEY = "gvo.station2.v1";
const WORLD5_PROGRESS_KEY = "gvo.station5.v1";
const SIGNAL_BEFORE_REVEAL_CHECKPOINT = {
  activeLayerId: "senal",
  capture: {
    currentStepId: "contact",
    visitedStepIds: ["contact"],
  },
  completedRequiredInteractions: ["plant_contact_readout_seen"],
  highestUnlockedLayerOrder: 3,
  mappingFirstRunComplete: false,
  resultState: "not_started",
  schemaVersion: 1,
  updatedAt: "2026-08-06T17:02:00.000Z",
  visitedLayerIds: ["planta_viva", "senal"],
} as const;

const VIEWPORTS = [
  { height: 640, name: "portrait-360x640", width: 360 },
  { height: 844, name: "portrait-390x844", width: 390 },
  { height: 915, name: "portrait-412x915", width: 412 },
  { height: 390, name: "landscape-844x390", width: 844 },
  { height: 412, name: "landscape-915x412", width: 915 },
  { height: 1024, name: "tablet-768x1024", width: 768 },
] as const;

const LAYERS = [
  "planta_viva",
  "senal",
  "captura",
  "acondicionamiento",
  "mapeo",
  "resultado_mediado",
] as const;

const REQUIRED_TEXT = [
  { minimum: 10, selector: ".world2-scene-title p" },
  { minimum: 12, selector: ".world2-scene-title span" },
  { minimum: 18, selector: ".world2-scene-title h1" },
  {
    minimum: 12,
    selector:
      ".world2-plant-contact-readout strong, .world2-signal-cinema__readout strong, .world2-capture-readout strong",
  },
  {
    minimum: 12,
    selector:
      ".world2-plant-contact-readout p, .world2-signal-cinema__readout p, .world2-capture-readout p",
  },
  { minimum: 10, selector: ".world2-layer-callout" },
  { minimum: 10, selector: ".world2-conditioning-cinema__label" },
  {
    minimum: 11,
    selector: ".world2-conditioning-cinema__label--filter",
  },
  { minimum: 10, selector: ".world2-dialogue__eyebrow" },
  { minimum: 16, selector: ".world2-dialogue__title" },
  { minimum: 14, selector: ".world2-dialogue__copy" },
  { minimum: 12, selector: ".world2-dialogue__hint" },
  { minimum: 12, selector: ".world2-layer-button__order" },
  { minimum: 10, selector: ".world2-layer-button__label" },
  { minimum: 10, selector: ".world2-layer-button__state-badge" },
  { minimum: 10, selector: ".world2-capture-timeline__eyebrow" },
  { minimum: 12, selector: ".world2-capture-timeline__progress" },
  { minimum: 11, selector: ".world2-capture-timeline__step-label" },
  { minimum: 12, selector: ".world2-capture-timeline__readout strong" },
  { minimum: 12, selector: ".world2-capture-timeline__readout p" },
  { minimum: 11, selector: ".world2-capture-timeline__control-label" },
  { minimum: 12, selector: ".world2-mapping-sequence__header" },
  { minimum: 11, selector: ".world2-mapping-sequence__header > strong" },
  { minimum: 10, selector: ".world2-mapping-sequence__eyebrow" },
  {
    minimum: 11,
    selector:
      ".world2-mapping-sequence__source > strong, .world2-mapping-sequence__output > strong",
  },
  { minimum: 10, selector: ".world2-mapping-sequence__core small" },
  { minimum: 11, selector: ".world2-mapping-sequence__core strong" },
  { minimum: 12, selector: ".world2-mapping-sequence__microcopy" },
  { minimum: 12, selector: ".world2-sonic-convergence__label" },
  { minimum: 12, selector: ".world2-sonic-convergence__copy" },
] as const;

type Rect = Readonly<{
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}>;

function overlapArea(
  first: { height: number; width: number; x: number; y: number },
  second: { height: number; width: number; x: number; y: number },
) {
  const width = Math.max(
    0,
    Math.min(first.x + first.width, second.x + second.width) -
      Math.max(first.x, second.x),
  );
  const height = Math.max(
    0,
    Math.min(first.y + first.height, second.y + second.height) -
      Math.max(first.y, second.y),
  );
  return width * height;
}

type TextMetric = Readonly<{
  clipped: boolean;
  color: string;
  fontSize: number;
  lineHeight: string;
  minimum: number;
  rect: Rect;
  selector: string;
  text: string;
}>;

type ControlMetric = Readonly<{
  height: number;
  label: string;
  selector: string;
  width: number;
}>;

type Geometry = Readonly<{
  collisions: ReadonlyArray<{
    area: number;
    first: string;
    second: string;
  }>;
  controls: readonly ControlMetric[];
  document: {
    clientHeight: number;
    clientWidth: number;
    horizontalOverflow: number;
    scrollHeight: number;
    scrollWidth: number;
  };
  layer: string;
  marker: string | null;
  stage: Rect;
  text: readonly TextMetric[];
  viewport: { height: number; width: number };
}>;

async function seedCompletedWorld2(page: Page) {
  await page.goto("/portada", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ checkpointKey, progressKey }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          completedStations: [1],
          schemaVersion: 1,
          updatedAt: "2026-08-06T17:00:00.000Z",
        }),
      );
      localStorage.setItem(
        checkpointKey,
        JSON.stringify({
          activeLayerId: "planta_viva",
          capture: {
            currentStepId: "contact",
            visitedStepIds: ["contact", "signal", "system"],
          },
          completedRequiredInteractions: [
            "plant_contact_readout_seen",
            "signal_measured_wave_seen",
            "capture_data_readout_seen",
          ],
          highestUnlockedLayerOrder: 6,
          mappingFirstRunComplete: true,
          resultState: "ready_to_continue",
          schemaVersion: 1,
          updatedAt: "2026-08-06T17:01:00.000Z",
          visitedLayerIds: [
            "planta_viva",
            "senal",
            "captura",
            "acondicionamiento",
            "mapeo",
            "resultado_mediado",
          ],
        }),
      );
    },
    { checkpointKey: WORLD2_CHECKPOINT_KEY, progressKey: GLOBAL_PROGRESS_KEY },
  );
  await page.goto("/estacion/2", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-world2-state]")).toBeVisible();
}

async function writeSignalBeforeReveal(page: Page) {
  await page.evaluate(({ checkpoint, checkpointKey }) => {
    localStorage.setItem(
      checkpointKey,
      JSON.stringify(checkpoint),
    );
  }, {
    checkpoint: SIGNAL_BEFORE_REVEAL_CHECKPOINT,
    checkpointKey: WORLD2_CHECKPOINT_KEY,
  });
}

async function seedSignalBeforeReveal(page: Page) {
  await seedCompletedWorld2(page);
  await writeSignalBeforeReveal(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-world2-state]")).toHaveAttribute(
    "data-world2-active-layer",
    "senal",
  );
}

async function openWorld2ReviewFromMirador(page: Page) {
  await seedCompletedWorld2(page);
  await page.evaluate(
    ({ progressKey, world5Key }) => {
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          completedStations: [1, 2, 3, 4, 5],
          schemaVersion: 1,
          updatedAt: "2026-08-06T17:03:00.000Z",
        }),
      );
      localStorage.setItem(
        world5Key,
        JSON.stringify({
          completedAreas: ["plantas", "sistema", "espacio", "visitante"],
          schemaVersion: 1,
          updatedAt: "2026-08-06T17:03:00.000Z",
        }),
      );
    },
    { progressKey: GLOBAL_PROGRESS_KEY, world5Key: WORLD5_PROGRESS_KEY },
  );
  await page.goto("/final", { waitUntil: "domcontentloaded" });
  await page.locator('[data-final-review-world="2"]').click();
  await expect(page.locator('[data-final-review-active="true"]')).toBeVisible();
  await expect(page.locator("[data-world2-state]")).toBeVisible();
}

async function activateLayer(page: Page, layer: (typeof LAYERS)[number]) {
  const root = page.locator("[data-world2-state]");
  if ((await root.getAttribute("data-world2-active-layer")) !== layer) {
    await page.locator(`[data-world2-layer="${layer}"]`).click();
  }
  await expect(root).toHaveAttribute("data-world2-active-layer", layer);

  if (layer === "captura") {
    await expect(
      page.locator('[data-world2-capture-timeline="016R"]'),
    ).toBeVisible();
  }
  if (layer === "mapeo") {
    await expect(
      page.locator('[data-world2-mapping-mode="sequential-pedagogic-r2"]'),
    ).toBeVisible();
  }
  if (layer === "resultado_mediado") {
    await expect(
      page.locator('[data-world2-option6-mode="final-sonic-convergence"]'),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible();
  }
}

async function measureGeometry(page: Page, layer: string): Promise<Geometry> {
  return page.evaluate(
    ({ layerId, requiredText }) => {
      const root = document.querySelector<HTMLElement>("[data-world2-state]");
      const stage = document.querySelector<HTMLElement>(".world2-stage");
      if (!root || !stage) throw new Error("World II root or stage missing");

      const isVisible = (element: HTMLElement) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0 &&
          rect.width > 0 &&
          rect.height > 0 &&
          !element.closest('[aria-hidden="true"]')
        );
      };

      const isClipped = (element: HTMLElement) => {
        const elementRect = element.getBoundingClientRect();
        let ancestor = element.parentElement;
        while (ancestor && ancestor !== document.body) {
          const style = getComputedStyle(ancestor);
          const clipsX = [style.overflow, style.overflowX].some((value) =>
            ["hidden", "clip"].includes(value),
          );
          const clipsY = [style.overflow, style.overflowY].some((value) =>
            ["hidden", "clip"].includes(value),
          );
          if (clipsX || clipsY) {
            const ancestorRect = ancestor.getBoundingClientRect();
            if (
              (clipsX &&
                (elementRect.left < ancestorRect.left - 1 ||
                  elementRect.right > ancestorRect.right + 1)) ||
              (clipsY &&
                (elementRect.top < ancestorRect.top - 1 ||
                  elementRect.bottom > ancestorRect.bottom + 1))
            ) {
              return true;
            }
          }
          ancestor = ancestor.parentElement;
        }
        return false;
      };

      const text = requiredText.flatMap(({ minimum, selector }) =>
        Array.from(document.querySelectorAll<HTMLElement>(selector))
          .filter(isVisible)
          .map((element) => {
            const style = getComputedStyle(element);
            return {
              clipped: isClipped(element),
              color: style.color,
              fontSize: Number.parseFloat(style.fontSize),
              lineHeight: style.lineHeight,
              minimum,
              rect: {
                bottom: element.getBoundingClientRect().bottom,
                height: element.getBoundingClientRect().height,
                left: element.getBoundingClientRect().left,
                right: element.getBoundingClientRect().right,
                top: element.getBoundingClientRect().top,
                width: element.getBoundingClientRect().width,
              },
              selector,
              text: (element.textContent ?? "").trim().replace(/\s+/g, " "),
            };
          }),
      );

      const controls = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [role="button"]:not([aria-disabled="true"]), input, select, textarea',
        ),
      )
        .filter(isVisible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            height: rect.height,
            label:
              element.getAttribute("aria-label") ??
              (element.textContent ?? "").trim().replace(/\s+/g, " "),
            selector:
              element.getAttribute("data-world2-layer") ??
              element.getAttribute("data-world2-capture-control") ??
              element.getAttribute("data-mapping-progress-step") ??
              element.className,
            width: rect.width,
          };
        });

      const collisionElements = Array.from(
        root.querySelectorAll<HTMLElement>(
          [
            ".world2-scene-title h1",
            ".world2-dialogue__eyebrow",
            ".world2-dialogue__title",
            ".world2-dialogue__copy",
            ".world2-dialogue__hint",
            ".world2-capture-timeline__header",
            ".world2-capture-timeline__readout",
            ".world2-capture-timeline__controls",
            ".world2-mapping-sequence__header",
            ".world2-mapping-sequence__relation",
            ".world2-mapping-sequence__microcopy",
            ".world2-sonic-convergence__label",
            ".world2-sonic-convergence__copy",
            ".world2-layer-button",
          ].join(","),
        ),
      ).filter(isVisible);
      const collisions: Array<{
        area: number;
        first: string;
        second: string;
      }> = [];
      collisionElements.forEach((first, firstIndex) => {
        collisionElements.slice(firstIndex + 1).forEach((second) => {
          if (first.contains(second) || second.contains(first)) return;
          const firstRect = first.getBoundingClientRect();
          const secondRect = second.getBoundingClientRect();
          const width = Math.max(
            0,
            Math.min(firstRect.right, secondRect.right) -
              Math.max(firstRect.left, secondRect.left),
          );
          const height = Math.max(
            0,
            Math.min(firstRect.bottom, secondRect.bottom) -
              Math.max(firstRect.top, secondRect.top),
          );
          const area = width * height;
          if (area > 1) {
            collisions.push({
              area,
              first: first.className,
              second: second.className,
            });
          }
        });
      });

      const rootElement = document.documentElement;
      return {
        collisions,
        controls,
        document: {
          clientHeight: rootElement.clientHeight,
          clientWidth: rootElement.clientWidth,
          horizontalOverflow: Math.max(
            0,
            rootElement.scrollWidth - rootElement.clientWidth,
          ),
          scrollHeight: rootElement.scrollHeight,
          scrollWidth: rootElement.scrollWidth,
        },
        layer: layerId,
        marker: root.getAttribute("data-world2-legibility"),
        stage: {
          bottom: stage.getBoundingClientRect().bottom,
          height: stage.getBoundingClientRect().height,
          left: stage.getBoundingClientRect().left,
          right: stage.getBoundingClientRect().right,
          top: stage.getBoundingClientRect().top,
          width: stage.getBoundingClientRect().width,
        },
        text,
        viewport: { height: innerHeight, width: innerWidth },
      };
    },
    { layerId: layer, requiredText: REQUIRED_TEXT },
  );
}

function expectReadable(geometry: Geometry) {
  expect(geometry.marker).toBe("debt-008-responsive");
  expect(geometry.document.horizontalOverflow).toBeLessThanOrEqual(1);
  expect(geometry.collisions).toEqual([]);
  expect(geometry.text.filter((metric) => metric.clipped)).toEqual([]);
  expect(
    geometry.text.filter((metric) => metric.fontSize + 0.01 < metric.minimum),
  ).toEqual([]);
  expect(
    geometry.controls.filter(
      (control) => control.width < 43.5 || control.height < 43.5,
    ),
  ).toEqual([]);
}

async function saveEvidence(name: string, value: unknown, page?: Page) {
  await mkdir(EVIDENCE_DIRECTORY, { recursive: true });
  await writeFile(
    path.join(EVIDENCE_DIRECTORY, `${name}.json`),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
  if (page) {
    await mkdir(SCREENSHOT_DIRECTORY, { recursive: true });
    await page.screenshot({
      animations: "disabled",
      fullPage: true,
      path: path.join(SCREENSHOT_DIRECTORY, `${name}.png`),
    });
  }
}

test.setTimeout(150_000);

for (const viewport of VIEWPORTS) {
  test(`${viewport.name}: seis capas conservan legibilidad y geometría`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(viewport);
    await seedCompletedWorld2(page);

    const rows: Geometry[] = [];
    for (const layer of LAYERS) {
      await activateLayer(page, layer);
      const geometry = await measureGeometry(page, layer);
      rows.push(geometry);
      if (PHASE === "after") expectReadable(geometry);
      const screenshot =
        viewport.name === "portrait-390x844" ||
        viewport.name === "landscape-844x390";
      if (screenshot) {
        await saveEvidence(`${viewport.name}-${layer}`, geometry, page);
      }
    }
    await saveEvidence(viewport.name, rows);
  });
}

test("zoom de texto 200% conserva lectura, controles y flujo", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 844, width: 390 });
  await seedCompletedWorld2(page);
  await page.addStyleTag({ content: ":root { font-size: 200% !important; }" });

  const rows: Geometry[] = [];
  for (const layer of ["captura", "mapeo", "resultado_mediado"] as const) {
    await activateLayer(page, layer);
    const geometry = await measureGeometry(page, `zoom-200-${layer}`);
    rows.push(geometry);
    if (PHASE === "after") expectReadable(geometry);
  }
  await saveEvidence("zoom-200", rows, page);
});

test("reflow a 320 CSS px conserva lectura y no crea overflow horizontal", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 800, width: 320 });
  await seedCompletedWorld2(page);

  const rows: Geometry[] = [];
  for (const layer of ["planta_viva", "captura", "mapeo"] as const) {
    await activateLayer(page, layer);
    const geometry = await measureGeometry(page, `reflow-320-${layer}`);
    rows.push(geometry);
    if (PHASE === "after") expectReadable(geometry);
  }
  await saveEvidence("reflow-320", rows, page);
});

async function expectTarget(locator: Locator) {
  const rect = await locator.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.width).toBeGreaterThanOrEqual(43.5);
  expect(rect!.height).toBeGreaterThanOrEqual(43.5);
}

test("seis capas conservan teclado, touch y estados actuales", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 844, width: 390 });
  await seedCompletedWorld2(page);

  const root = page.locator("[data-world2-state]");
  const layerButtons = page.locator("[data-world2-layer]");
  await expect(layerButtons).toHaveCount(6);

  const signal = page.locator('[data-world2-layer="senal"]');
  await signal.focus();
  await signal.press("Enter");
  await expect(root).toHaveAttribute("data-world2-active-layer", "senal");

  const capture = page.locator('[data-world2-layer="captura"]');
  await capture.tap();
  await expect(root).toHaveAttribute("data-world2-active-layer", "captura");

  if (PHASE === "after") {
    for (const button of await layerButtons.all()) await expectTarget(button);
    await expect(root).toHaveAttribute(
      "data-world2-legibility",
      "debt-008-responsive",
    );
  }
});

test("refinamientos humanos: Planta despeja a Lía y Señal conserva el contacto antes de revelar", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 844, width: 390 });
  await seedCompletedWorld2(page);

  const plantReadout = page.locator(".world2-plant-contact-readout");
  const plantLia = page.locator(
    '[data-world2-scene-layer="planta_viva"] .world2-lia-field',
  );
  await expect(plantReadout).toBeVisible();
  await expect(plantLia).toBeVisible();
  const [plantReadoutRect, plantLiaRect] = await Promise.all([
    plantReadout.boundingBox(),
    plantLia.boundingBox(),
  ]);
  expect(plantReadoutRect).not.toBeNull();
  expect(plantLiaRect).not.toBeNull();
  if (PHASE === "after") {
    expect(plantReadoutRect!.x + plantReadoutRect!.width).toBeLessThanOrEqual(
      plantLiaRect!.x + 1,
    );
  }

  await seedSignalBeforeReveal(page);
  const signalCinema = page.locator('[data-signal-cinema="016J"]');
  const signalProbe = page.locator(".world2-signal-cinema__static-base");
  await expect(signalCinema).toHaveAttribute("data-signal-reveal-state", "idle");
  await expect(signalProbe).toBeVisible();
  await expect(page.getByRole("button", { name: "Onda medida" })).toBeVisible();
  if (PHASE === "after") {
    await expect(signalCinema).toHaveAttribute(
      "data-world2-signal-contact-alignment",
      "probe-to-plant",
    );
  }
  await saveEvidence("portrait-390x844-senal-before-reveal", {
    plantLia: plantLiaRect,
    plantReadout: plantReadoutRect,
    signalProbe: await signalProbe.boundingBox(),
  }, page);
});

test("regreso desde Mirador conserva los refinamientos y separa los controles", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ height: 844, width: 390 });
  await openWorld2ReviewFromMirador(page);

  const plantReadout = page.locator(".world2-plant-contact-readout");
  const plantLia = page.locator(
    '[data-world2-scene-layer="planta_viva"] .world2-lia-field',
  );
  const [plantReadoutRect, plantLiaRect] = await Promise.all([
    plantReadout.boundingBox(),
    plantLia.boundingBox(),
  ]);
  expect(plantReadoutRect).not.toBeNull();
  expect(plantLiaRect).not.toBeNull();
  expect(plantReadoutRect!.x + plantReadoutRect!.width).toBeLessThanOrEqual(
    plantLiaRect!.x + 1,
  );
  await saveEvidence("review-portrait-390x844-planta_viva", {
    plantLia: plantLiaRect,
    plantReadout: plantReadoutRect,
  }, page);

  await page.locator('[data-world2-layer="senal"]').click();
  const signalCinema = page.locator('[data-signal-cinema="016J"]');
  await expect(signalCinema).toHaveAttribute(
    "data-signal-reveal-state",
    "expanded",
  );
  const [reviewDockRect, signalControlRect] = await Promise.all([
    page.locator('[data-final-review-dock="active"]').boundingBox(),
    page.locator(".world2-signal-cinema__label").boundingBox(),
  ]);
  expect(reviewDockRect).not.toBeNull();
  expect(signalControlRect).not.toBeNull();
  expect(overlapArea(reviewDockRect!, signalControlRect!)).toBe(0);
  await saveEvidence("review-portrait-390x844-senal-expanded", {
    reviewDock: reviewDockRect,
    signalControl: signalControlRect,
    signalProbe: await page
      .locator(".world2-signal-cinema__static-base")
      .boundingBox(),
  }, page);

  await page.locator('[data-world2-layer="captura"]').click();
  await expect(
    page.locator('[data-world2-capture-timeline="016R"]'),
  ).toBeVisible();
  const [captureControlsRect, captureReadoutTextRect] = await Promise.all([
    page.locator(".world2-capture-timeline__controls").boundingBox(),
    page.locator(".world2-capture-timeline__readout p").boundingBox(),
  ]);
  expect(captureControlsRect).not.toBeNull();
  expect(captureReadoutTextRect).not.toBeNull();
  expect(
    captureReadoutTextRect!.y + captureReadoutTextRect!.height,
  ).toBeLessThanOrEqual(captureControlsRect!.y);
  await saveEvidence("review-portrait-390x844-captura", {
    controls: captureControlsRect,
    readout: await page
      .locator(".world2-capture-timeline__readout")
      .boundingBox(),
    readoutText: captureReadoutTextRect,
  }, page);

  const remainingReviewLayers: Geometry[] = [];
  for (const layer of [
    "acondicionamiento",
    "mapeo",
    "resultado_mediado",
  ] as const) {
    await activateLayer(page, layer);
    const geometry = await measureGeometry(page, `review-${layer}`);
    remainingReviewLayers.push(geometry);
    await saveEvidence(`review-portrait-390x844-${layer}`, geometry, page);
    if (PHASE === "after") expectReadable(geometry);
  }
  await saveEvidence(
    "review-portrait-390x844-remaining-layers",
    remainingReviewLayers,
  );
});
