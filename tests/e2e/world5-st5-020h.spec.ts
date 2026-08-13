import {
  chromium,
  expect,
  firefox,
  test,
  webkit,
  type Page,
} from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { evidenceDirectory } from "./support/evidence";

const stationProgressKey = "gvo.station5.v1";
const globalProgressKey = "gvo.progress.v1";
const closeCopy = "Ir al cierre";
const closeErrorCopy =
  "No fue posible guardar tu progreso. Intenta nuevamente.";
const evidenceDir = evidenceDirectory("world5-st5-020h");
const finalRootSelector = '[data-final-root="mirador_editorial_final"]';
// The legacy 020G/020H raster contract isolates station content. DEBT_009
// validates the transversal shell independently across both orientations.
const stationOnlyScreenshotStyle =
  ".gvo-immersive-shell__dock { visibility: hidden !important; }";

const completedAreas = ["plantas", "sistema", "espacio", "visitante"];
const previousStations = [1, 2, 3, 4];

const viewports = [
  ["360x560", 360, 560],
  ["360x640", 360, 640],
  ["375x548", 375, 548],
  ["375x667", 375, 667],
  ["390x844", 390, 844],
  ["667x320", 667, 320],
  ["667x375", 667, 375],
  ["736x414", 736, 414],
  ["844x390", 844, 390],
  ["768x1024", 768, 1024],
  ["1024x768", 1024, 768],
].map(([name, width, height]) => ({
  name: String(name),
  width: Number(width),
  height: Number(height),
}));

const priorityViewports = new Set(["360x560", "375x667", "667x320", "667x375"]);

type Telemetry = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  responses404: string[];
  externalRequests: string[];
};

type EvidenceState =
  | "01_overview_three_of_four"
  | "02_overview_four_of_four"
  | "03_overview_four_of_four_focus"
  | "04_closure_error"
  | "05_transition_world_five_to_final"
  | "06_final_arrival";

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
    try {
      const parsed = new URL(url);
      if (!["127.0.0.1", "localhost"].includes(parsed.hostname)) {
        telemetry.externalRequests.push(url);
      }
    } catch {
      telemetry.externalRequests.push(url);
    }
  });

  return telemetry;
}

function telemetrySnapshot(telemetry: Telemetry): Telemetry {
  return {
    consoleErrors: [...telemetry.consoleErrors],
    pageErrors: [...telemetry.pageErrors],
    failedRequests: [...telemetry.failedRequests],
    responses404: [...telemetry.responses404],
    externalRequests: [...telemetry.externalRequests],
  };
}

function expectTelemetryClean(telemetry: Telemetry) {
  expect(telemetry.consoleErrors).toEqual([]);
  expect(telemetry.pageErrors).toEqual([]);
  expect(telemetry.failedRequests).toEqual([]);
  expect(telemetry.responses404).toEqual([]);
  expect(telemetry.externalRequests).toEqual([]);
}

async function installGlobalStorageFailureSwitch(page: Page) {
  await page.addInitScript((key) => {
    const scope = window as typeof window & {
      __gvoGlobalStorageFailure?: boolean;
      __setGvoGlobalStorageFailure?: (value: boolean) => void;
    };
    const originalSetItem = Storage.prototype.setItem;
    scope.__gvoGlobalStorageFailure = false;
    scope.__setGvoGlobalStorageFailure = (value: boolean) => {
      scope.__gvoGlobalStorageFailure = value;
    };
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === key && scope.__gvoGlobalStorageFailure) {
        throw new DOMException(
          "Synthetic ST5-020H storage failure",
          "QuotaExceededError",
        );
      }
      return originalSetItem.call(this, storageKey, value);
    };
  }, globalProgressKey);
}

async function setGlobalStorageFailure(page: Page, value: boolean) {
  await page.evaluate((nextValue) => {
    const scope = window as typeof window & {
      __setGvoGlobalStorageFailure?: (next: boolean) => void;
    };
    scope.__setGvoGlobalStorageFailure?.(nextValue);
  }, value);
}

async function seedProgress(
  page: Page,
  areas: string[],
  stations: number[],
  destination = "/estacion/5",
  baseURL = "",
) {
  await page.goto(`${baseURL}/estacion/5`, { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ areaKey, globalKey, seededAreas, seededStations }) => {
      localStorage.clear();
      if (seededAreas.length) {
        localStorage.setItem(
          areaKey,
          JSON.stringify({
            schemaVersion: 1,
            completedAreas: seededAreas,
            updatedAt: "2026-07-30T12:00:00.000Z",
          }),
        );
      }
      if (seededStations.length) {
        localStorage.setItem(
          globalKey,
          JSON.stringify({
            completedStations: seededStations,
            updatedAt: "2026-07-30T12:00:00.000Z",
          }),
        );
      }
    },
    {
      areaKey: stationProgressKey,
      globalKey: globalProgressKey,
      seededAreas: areas,
      seededStations: stations,
    },
  );
  await page.goto(`${baseURL}${destination}`, {
    waitUntil: "domcontentloaded",
  });
}

async function storedProgress(page: Page) {
  return page.evaluate(
    ({ areaKey, globalKey }) => ({
      station: JSON.parse(localStorage.getItem(areaKey) ?? "null"),
      global: JSON.parse(localStorage.getItem(globalKey) ?? "null"),
    }),
    { areaKey: stationProgressKey, globalKey: globalProgressKey },
  );
}

async function expectStationState(page: Page, expected: string) {
  await expect(page.locator("[data-station5-state]")).toHaveAttribute(
    "data-station5-state",
    expected,
  );
}

async function expectFinal(page: Page) {
  await expect(page).toHaveURL(/\/final$/);
  const finalRoot = page.locator(finalRootSelector);
  await expect(finalRoot).toBeVisible();
  await expect(finalRoot).toHaveAttribute(
    "data-final-screen",
    "editorial_final_complete_experience",
  );
}

async function settleStationVisuals(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => image.src)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
}

async function completeCleanJourney(page: Page) {
  for (const [area, intro, action] of [
    ["plantas", "plants_intro", "Reconocer la vitalidad desde la hoja."],
    [
      "sistema",
      "system_intro",
      "Hacer visible la mediación desde el conector del sistema.",
    ],
    ["espacio", "space_intro", "Activar el recorrido de Espacio."],
    [
      "visitante",
      "visitor_intro",
      "Reconocer la presencia del visitante dentro del recorrido.",
    ],
  ] as const) {
    await page.locator(`[data-station5-area="${area}"]`).click();
    await expectStationState(page, intro);
    await page.getByRole("button", { name: action }).click();
    await expectStationState(page, intro.replace("_intro", "_resolved"));
    await page.getByRole("button", { name: "Volver al mapa" }).click();
    await expectStationState(page, "map_overview");
  }
}

async function captureEvidence(
  page: Page,
  viewport: (typeof viewports)[number],
  state: EvidenceState,
  telemetry: Telemetry,
) {
  if (state !== "05_transition_world_five_to_final") {
    await settleStationVisuals(page);
  }

  const fileName = `${viewport.name}_${state}.png`;
  await page.screenshot({
    path: path.join(evidenceDir, fileName),
    scale: "css",
  });
  const measurement = await page.evaluate(() => {
    const rect = (element: Element | null) => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return {
        left: value.left,
        top: value.top,
        right: value.right,
        bottom: value.bottom,
        width: value.width,
        height: value.height,
      };
    };
    const visible = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        box.width > 0 &&
        box.height > 0
      );
    };
    const overlapArea = (
      left: ReturnType<typeof rect>,
      right: ReturnType<typeof rect>,
    ) => {
      if (!left || !right) return 0;
      return (
        Math.max(
          0,
          Math.min(left.right, right.right) - Math.max(left.left, right.left),
        ) *
        Math.max(
          0,
          Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top),
        )
      );
    };
    const closeButton = [...document.querySelectorAll("button")].find(
      (button) =>
        button.textContent?.trim() === "Ir al cierre" ||
        button.textContent?.trim() === "Reintentar",
    );
    const closeRect = rect(closeButton ?? null);
    const liaRect = rect(document.querySelector(".s5-lia"));
    const stageRect = rect(document.querySelector(".s5-stage"));
    const cardRect = rect(document.querySelector(".s5-story-card"));
    const text = [
      ...document.querySelectorAll(
        ".s5-lead,.s5-support,.s5-status-copy,[role='alert'],[role='status']",
      ),
    ]
      .filter(visible)
      .map((element) => ({
        text: element.textContent?.trim() ?? "",
        fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
        box: rect(element),
      }));
    const dimensions = {
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    };
    return {
      route: location.pathname,
      stationState: document
        .querySelector("[data-station5-state]")
        ?.getAttribute("data-station5-state"),
      closeState: document
        .querySelector("[data-world5-close-state]")
        ?.getAttribute("data-world5-close-state"),
      closeReady: document
        .querySelector("[data-world5-close-ready]")
        ?.getAttribute("data-world5-close-ready"),
      globalComplete: document
        .querySelector("[data-world5-global-complete]")
        ?.getAttribute("data-world5-global-complete"),
      exitTarget: document
        .querySelector("[data-world5-exit-target]")
        ?.getAttribute("data-world5-exit-target"),
      closeButton: closeRect
        ? {
            box: closeRect,
            visible: visible(closeButton ?? null),
            focused: document.activeElement === closeButton,
            disabled:
              closeButton instanceof HTMLButtonElement
                ? closeButton.disabled
                : false,
          }
        : null,
      boxes: {
        stage: stageRect,
        card: cardRect,
        lia: liaRect,
        closeLiaOverlapArea: overlapArea(closeRect, liaRect),
        closeStageOverlapArea: overlapArea(closeRect, stageRect),
      },
      text,
      dimensions,
      hasClosureError: document.body.textContent?.includes(
        "No fue posible guardar tu progreso. Intenta nuevamente.",
      ),
      transition: {
        id: document
          .querySelector("[data-transition-world-id]")
          ?.getAttribute("data-transition-world-id"),
        from: document
          .querySelector("[data-transition-from-route]")
          ?.getAttribute("data-transition-from-route"),
        to: document
          .querySelector("[data-transition-to-route]")
          ?.getAttribute("data-transition-to-route"),
        duration: document
          .querySelector("[data-duration-ms]")
          ?.getAttribute("data-duration-ms"),
      },
      finalVisible: visible(
        document.querySelector('[data-final-root="mirador_editorial_final"]'),
      ),
    };
  });

  const stationEvidence =
    state.startsWith("0") &&
    !state.includes("transition") &&
    !state.includes("final_arrival");
  const textInsideViewport = measurement.text.every(
    (entry) =>
      entry.box &&
      entry.box.left >= -0.5 &&
      entry.box.top >= -0.5 &&
      entry.box.right <= viewport.width + 0.5 &&
      entry.box.bottom <= viewport.height + 0.5,
  );
  const bodyFonts = measurement.text
    .map((entry) => entry.fontSize)
    .filter(Number.isFinite);
  const minBodyFontSize = bodyFonts.length ? Math.min(...bodyFonts) : null;
  const telemetryData = telemetrySnapshot(telemetry);
  const checks: Record<string, boolean> = {
    noHorizontalOverflow:
      measurement.dimensions.scrollWidth === measurement.dimensions.clientWidth,
    telemetryClean: Object.values(telemetryData).every(
      (entries) => entries.length === 0,
    ),
  };

  if (stationEvidence) {
    checks.stationOverview = measurement.stationState === "map_overview";
    checks.noVerticalOverflow =
      measurement.dimensions.scrollHeight ===
      measurement.dimensions.clientHeight;
    checks.textInsideViewport = textInsideViewport;
    checks.bodyAtLeast14 = minBodyFontSize === null || minBodyFontSize >= 14;
  }
  if (state === "01_overview_three_of_four") {
    checks.closeAbsent = measurement.closeButton === null;
  }
  if (
    state === "02_overview_four_of_four" ||
    state === "03_overview_four_of_four_focus" ||
    state === "04_closure_error"
  ) {
    checks.closeVisible = measurement.closeButton?.visible === true;
    checks.closeTargetAtLeast44 =
      (measurement.closeButton?.box.width ?? 0) >= 44 &&
      (measurement.closeButton?.box.height ?? 0) >= 44;
    checks.closeDoesNotOverlapLia = measurement.boxes.closeLiaOverlapArea === 0;
    checks.closeDoesNotOverlapMap =
      measurement.boxes.closeStageOverlapArea === 0;
  }
  if (state === "03_overview_four_of_four_focus") {
    checks.closeFocused = measurement.closeButton?.focused === true;
  }
  if (state === "04_closure_error") {
    checks.closureErrorVisible = measurement.hasClosureError === true;
    checks.stayedInStationFive = measurement.route === "/estacion/5";
  }
  if (state === "05_transition_world_five_to_final") {
    checks.transitionRoute =
      measurement.route === "/transition/world-5-to-final";
    checks.transitionContract =
      measurement.transition.id === "world-5-to-final" &&
      measurement.transition.from === "/estacion/5" &&
      measurement.transition.to === "/final" &&
      measurement.transition.duration === "2300";
  }
  if (state === "06_final_arrival") {
    checks.finalRoute = measurement.route === "/final";
    checks.finalVisible = measurement.finalVisible;
  }

  return {
    viewport,
    state,
    screenshot: fileName,
    ...measurement,
    minBodyFontSize,
    telemetry: telemetryData,
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

async function makeContactSheet(viewport: string) {
  const files = (await fs.readdir(evidenceDir))
    .filter(
      (file) =>
        file.startsWith(`${viewport}_`) && /_0[1-6]_[^.]+\.png$/.test(file),
    )
    .sort();
  const landscape =
    Number(viewport.split("x")[0]) > Number(viewport.split("x")[1]);
  const columns = landscape ? 3 : 3;
  const thumbnailWidth = landscape ? 300 : 200;
  const thumbnailHeight = landscape ? 180 : 356;
  const cellWidth = thumbnailWidth + 12;
  const cellHeight = thumbnailHeight + 38;
  const layers: sharp.OverlayOptions[] = [];

  expect(
    files,
    `Se esperaban seis capturas productoras para ${viewport}.`,
  ).toHaveLength(6);

  for (let index = 0; index < files.length; index += 1) {
    const image = await sharp(path.join(evidenceDir, files[index]))
      .resize({ width: thumbnailWidth, height: thumbnailHeight, fit: "inside" })
      .png()
      .toBuffer();
    const left = (index % columns) * cellWidth + 6;
    const top = Math.floor(index / columns) * cellHeight;
    layers.push({
      input: Buffer.from(
        `<svg width="${cellWidth}" height="32"><rect width="100%" height="100%" fill="#24362d"/><text x="6" y="21" fill="white" font-family="Arial" font-size="11">${files[index].replace(`${viewport}_`, "").replace(".png", "")}</text></svg>`,
      ),
      left: (index % columns) * cellWidth,
      top,
    });
    layers.push({ input: image, left, top: top + 32 });
  }

  await sharp({
    create: {
      width: columns * cellWidth,
      height: Math.ceil(files.length / columns) * cellHeight,
      channels: 3,
      background: "#f4ecdc",
    },
  })
    .composite(layers)
    .jpeg({ quality: 92 })
    .toFile(path.join(evidenceDir, `contact_sheet_${viewport}.jpg`));
}

async function comparePngs(
  baseline: string,
  current: string,
  output: string,
  labels: [string, string],
) {
  const leftRaw = await sharp(baseline)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rightRaw = await sharp(current)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (
    leftRaw.info.width !== rightRaw.info.width ||
    leftRaw.info.height !== rightRaw.info.height ||
    leftRaw.info.channels !== rightRaw.info.channels
  ) {
    throw new Error(`Comparison dimensions differ for ${output}`);
  }
  let changedPixels = 0;
  let absoluteChannelDelta = 0;
  let channelsOverTwenty = 0;
  for (
    let offset = 0;
    offset < leftRaw.data.length;
    offset += leftRaw.info.channels
  ) {
    let changed = false;
    for (let channel = 0; channel < leftRaw.info.channels; channel += 1) {
      const delta = Math.abs(
        leftRaw.data[offset + channel] - rightRaw.data[offset + channel],
      );
      absoluteChannelDelta += delta;
      if (delta > 20) channelsOverTwenty += 1;
      if (delta !== 0) {
        changed = true;
      }
    }
    if (changed) changedPixels += 1;
  }

  const height = leftRaw.info.height;
  const left = await sharp(baseline).png().toBuffer();
  const right = await sharp(current).png().toBuffer();
  const gap = 16;
  const header = 34;
  const width = leftRaw.info.width * 2 + gap;
  const label = Buffer.from(
    `<svg width="${width}" height="${header}"><rect width="100%" height="100%" fill="#24362d"/><text x="8" y="23" fill="white" font-family="Arial" font-size="13">${labels[0]}</text><text x="${leftRaw.info.width + gap + 8}" y="23" fill="white" font-family="Arial" font-size="13">${labels[1]}</text></svg>`,
  );
  await sharp({
    create: {
      width,
      height: height + header,
      channels: 3,
      background: "#f4ecdc",
    },
  })
    .composite([
      { input: label, left: 0, top: 0 },
      { input: left, left: 0, top: header },
      { input: right, left: leftRaw.info.width + gap, top: header },
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(evidenceDir, output));

  const meanAbsoluteChannelDelta = absoluteChannelDelta / leftRaw.data.length;
  const channelsOverTwentyRatio = channelsOverTwenty / leftRaw.data.length;
  return {
    output,
    baseline: path.relative(process.cwd(), baseline).replaceAll("\\", "/"),
    current: path.relative(process.cwd(), current).replaceAll("\\", "/"),
    width: leftRaw.info.width,
    height,
    changedPixels,
    totalPixels: leftRaw.info.width * height,
    exactMatch: changedPixels === 0,
    meanAbsoluteChannelDelta,
    channelsOverTwentyRatio,
    perceptualMatch:
      meanAbsoluteChannelDelta <= 1 && channelsOverTwentyRatio <= 0.001,
  };
}

test.describe("ST5-020H — cierre controlado de Estación V", () => {
  test.beforeAll(async () => {
    await fs.mkdir(evidenceDir, { recursive: true });
  });

  test("cierra desde 4/4, verifica progreso global y llega a Final por la transición", async ({
    page,
  }) => {
    const telemetry = attachTelemetry(page);
    await seedProgress(page, completedAreas, previousStations);
    await expectStationState(page, "map_overview");
    await expect(page.getByRole("button", { name: closeCopy })).toBeVisible();

    const before = await storedProgress(page);
    expect(before.station.completedAreas).toEqual(completedAreas);
    expect(before.global.completedStations).toEqual(previousStations);

    await page.getByRole("button", { name: closeCopy }).click();
    await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
    const transition = page.locator(
      '[data-transition-world-id="world-5-to-final"]',
    );
    await expect(transition).toHaveAttribute(
      "data-transition-from-route",
      "/estacion/5",
    );
    await expect(transition).toHaveAttribute(
      "data-transition-to-route",
      "/final",
    );
    await expect(transition).toHaveAttribute("data-duration-ms", "2300");

    const afterClose = await storedProgress(page);
    expect(afterClose.station.completedAreas).toEqual(completedAreas);
    expect(afterClose.global.completedStations).toEqual([1, 2, 3, 4, 5]);

    await expectFinal(page);
    const afterArrival = await storedProgress(page);
    expect(afterArrival.station.completedAreas).toEqual(completedAreas);
    expect(afterArrival.global.completedStations).toEqual([1, 2, 3, 4, 5]);
    expectTelemetryClean(telemetry);
  });

  test("recorre 0/4 a 4/4 sin cerrar globalmente antes del CTA", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const telemetry = attachTelemetry(page);
    await seedProgress(page, [], previousStations);
    await expect(page.getByRole("button", { name: closeCopy })).toHaveCount(0);

    await completeCleanJourney(page);
    const fourOfFour = await storedProgress(page);
    expect(fourOfFour.station.completedAreas).toEqual(completedAreas);
    expect(fourOfFour.global.completedStations).toEqual(previousStations);
    await expect(page.getByRole("button", { name: closeCopy })).toBeVisible();

    await page.getByRole("button", { name: closeCopy }).click();
    await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
    expect((await storedProgress(page)).global.completedStations).toEqual([
      1, 2, 3, 4, 5,
    ]);
    await expectFinal(page);
    expectTelemetryClean(telemetry);
  });

  test("un fallo global no navega, conserva 4/4 y el retry completa el cierre", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installGlobalStorageFailureSwitch(page);
    const telemetry = attachTelemetry(page);
    await seedProgress(page, completedAreas, previousStations);
    await setGlobalStorageFailure(page, true);

    await page.getByRole("button", { name: closeCopy }).click();
    await expect(page).toHaveURL(/\/estacion\/5$/);
    await expect(page.locator(".s5-status-copy")).toHaveText(closeErrorCopy);
    const failed = await storedProgress(page);
    expect(failed.station.completedAreas).toEqual(completedAreas);
    expect(failed.global.completedStations).toEqual(previousStations);

    await setGlobalStorageFailure(page, false);
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
    expect((await storedProgress(page)).global.completedStations).toEqual([
      1, 2, 3, 4, 5,
    ]);
    await expectFinal(page);
    expectTelemetryClean(telemetry);
  });

  test("protege transición y Final antes del cierre y permite ambas después", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const telemetry = attachTelemetry(page);
    await seedProgress(page, completedAreas, previousStations);

    await page.goto("/transition/world-5-to-final", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(/\/estacion\/5$/);
    await expect(page.getByRole("button", { name: closeCopy })).toBeVisible();

    await page.goto("/final", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/estacion\/5$/);
    await expect(page.locator(finalRootSelector)).toHaveCount(0);

    await seedProgress(page, completedAreas, [1, 2, 3, 4, 5]);
    await page.goto("/final", { waitUntil: "domcontentloaded" });
    await expectFinal(page);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectFinal(page);

    await page.goto("/transition/world-5-to-final", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
    await expect(
      page.locator('[data-transition-world-id="world-5-to-final"]'),
    ).toBeVisible();
    await expectFinal(page);
    expectTelemetryClean(telemetry);
  });

  test("reduced motion conserva la transición contractual de 1000ms", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const telemetry = attachTelemetry(page);
    const navigations: { url: string; at: number }[] = [];
    page.on("framenavigated", (frame) => {
      if (frame === page.mainFrame()) {
        navigations.push({ url: frame.url(), at: Date.now() });
      }
    });
    await seedProgress(page, completedAreas, previousStations);

    await page.getByRole("button", { name: closeCopy }).click();
    await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
    const transition = page.locator(
      '[data-transition-world-id="world-5-to-final"]',
    );
    await expect(transition).toHaveAttribute("data-reduced-motion", "true");
    await expect(transition).toHaveAttribute(
      "data-reduced-motion-duration-ms",
      "1000",
    );
    await expectFinal(page);

    const transitionNavigation = navigations.find((entry) =>
      entry.url.endsWith("/transition/world-5-to-final"),
    );
    const finalNavigation = navigations.find(
      (entry) =>
        entry.url.endsWith("/final") &&
        (!transitionNavigation || entry.at >= transitionNavigation.at),
    );
    expect(transitionNavigation).toBeDefined();
    expect(finalNavigation).toBeDefined();
    const elapsed = finalNavigation!.at - transitionNavigation!.at;
    expect(elapsed).toBeGreaterThanOrEqual(850);
    expect(elapsed).toBeLessThan(1800);
    expectTelemetryClean(telemetry);
  });

  test("genera capturas, métricas y resumen en los once viewports", async ({
    browser,
  }, testInfo) => {
    test.setTimeout(240_000);
    const baseURL = String(
      testInfo.project.use.baseURL ?? "http://127.0.0.1:4174",
    );
    const metrics: Awaited<ReturnType<typeof captureEvidence>>[] = [];

    for (const viewport of viewports) {
      const page = await browser.newPage({
        baseURL,
        viewport: { width: viewport.width, height: viewport.height },
      });
      await installGlobalStorageFailureSwitch(page);
      const telemetry = attachTelemetry(page);
      try {
        if (priorityViewports.has(viewport.name)) {
          await seedProgress(
            page,
            completedAreas.slice(0, 3),
            previousStations,
          );
          await expectStationState(page, "map_overview");
          await expect(
            page.getByRole("button", { name: closeCopy }),
          ).toHaveCount(0);
          metrics.push(
            await captureEvidence(
              page,
              viewport,
              "01_overview_three_of_four",
              telemetry,
            ),
          );
        }

        await seedProgress(page, completedAreas, previousStations);
        await expect(
          page.getByRole("button", { name: closeCopy }),
        ).toBeVisible();
        metrics.push(
          await captureEvidence(
            page,
            viewport,
            "02_overview_four_of_four",
            telemetry,
          ),
        );

        if (priorityViewports.has(viewport.name)) {
          await page.getByRole("button", { name: closeCopy }).focus();
          await expect(
            page.getByRole("button", { name: closeCopy }),
          ).toBeFocused();
          metrics.push(
            await captureEvidence(
              page,
              viewport,
              "03_overview_four_of_four_focus",
              telemetry,
            ),
          );

          await setGlobalStorageFailure(page, true);
          await page.getByRole("button", { name: closeCopy }).click();
          await expect(page.locator(".s5-status-copy")).toHaveText(
            closeErrorCopy,
          );
          metrics.push(
            await captureEvidence(
              page,
              viewport,
              "04_closure_error",
              telemetry,
            ),
          );
          await setGlobalStorageFailure(page, false);
          await page.getByRole("button", { name: "Reintentar" }).click();
        } else {
          await page.getByRole("button", { name: closeCopy }).click();
        }

        await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
        await expect(
          page.locator('[data-transition-world-id="world-5-to-final"]'),
        ).toBeVisible();
        metrics.push(
          await captureEvidence(
            page,
            viewport,
            "05_transition_world_five_to_final",
            telemetry,
          ),
        );

        await expectFinal(page);
        metrics.push(
          await captureEvidence(page, viewport, "06_final_arrival", telemetry),
        );
        expectTelemetryClean(telemetry);
      } finally {
        await page.close();
      }
    }

    const allTelemetry = {
      consoleErrors: metrics.flatMap((entry) => entry.telemetry.consoleErrors),
      pageErrors: metrics.flatMap((entry) => entry.telemetry.pageErrors),
      failedRequests: metrics.flatMap(
        (entry) => entry.telemetry.failedRequests,
      ),
      responses404: metrics.flatMap((entry) => entry.telemetry.responses404),
      externalRequests: metrics.flatMap(
        (entry) => entry.telemetry.externalRequests,
      ),
    };
    const summary = {
      ticket: "ST5-020H",
      viewportCount: viewports.length,
      priorityViewportCount: priorityViewports.size,
      captureCount: metrics.length,
      passed: metrics.filter((entry) => entry.pass).length,
      failed: metrics
        .filter((entry) => !entry.pass)
        .map((entry) => ({
          viewport: entry.viewport.name,
          state: entry.state,
          checks: entry.checks,
        })),
      minBodyFontSize: Math.min(
        ...metrics
          .map((entry) => entry.minBodyFontSize)
          .filter((value): value is number => value !== null),
      ),
      minCloseTarget: Math.min(
        ...metrics
          .filter((entry) => entry.closeButton)
          .flatMap((entry) => [
            entry.closeButton!.box.width,
            entry.closeButton!.box.height,
          ]),
      ),
      maxHorizontalOverflow: Math.max(
        ...metrics.map(
          (entry) =>
            entry.dimensions.scrollWidth - entry.dimensions.clientWidth,
        ),
      ),
      telemetry: Object.fromEntries(
        Object.entries(allTelemetry).map(([key, values]) => [
          key,
          [...new Set(values)],
        ]),
      ),
      browserMatrix: "browser_matrix.json",
      finalEvidenceScope: "Arrival only; this is not human approval of Final.",
      pass:
        metrics.every((entry) => entry.pass) &&
        Object.values(allTelemetry).every((entries) => entries.length === 0),
    };

    await fs.writeFile(
      path.join(evidenceDir, "metrics.json"),
      `${JSON.stringify(metrics, null, 2)}\n`,
    );
    await fs.writeFile(
      path.join(evidenceDir, "summary.json"),
      `${JSON.stringify(summary, null, 2)}\n`,
    );

    expect(summary.captureCount).toBe(45);
    expect(summary.pass).toBe(true);
  });

  test("genera evidencia dinámica, reduced motion y regresiones protegidas", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await fs.mkdir(evidenceDir, { recursive: true });
    await installGlobalStorageFailureSwitch(page);
    const telemetry = attachTelemetry(page);
    const dynamic: Array<Record<string, unknown>> = [];
    const sequences = [
      [
        "portrait_landscape_portrait",
        [
          [375, 667],
          [667, 375],
          [375, 667],
        ],
      ],
      [
        "short_landscape",
        [
          [667, 375],
          [667, 320],
          [667, 375],
        ],
      ],
    ] as const;

    for (const state of ["overview", "closure_error"] as const) {
      for (const [sequence, dimensions] of sequences) {
        await setGlobalStorageFailure(page, false);
        await seedProgress(page, completedAreas, previousStations);
        if (state === "closure_error") {
          await setGlobalStorageFailure(page, true);
          await page.getByRole("button", { name: closeCopy }).click();
          await expect(page.locator(".s5-status-copy")).toHaveText(
            closeErrorCopy,
          );
        } else {
          await page.getByRole("button", { name: closeCopy }).focus();
        }
        for (let index = 0; index < dimensions.length; index += 1) {
          const [width, height] = dimensions[index];
          await page.setViewportSize({ width, height });
          await settleStationVisuals(page);
          const sample = await page.evaluate(
            (expectedFocusCopy) => ({
              route: location.pathname,
              state: document
                .querySelector("[data-world5-close-state]")
                ?.getAttribute("data-world5-close-state"),
              focused:
                document.activeElement?.textContent?.trim() ===
                expectedFocusCopy,
              client: [
                document.documentElement.clientWidth,
                document.documentElement.clientHeight,
              ],
              scroll: [
                document.documentElement.scrollWidth,
                document.documentElement.scrollHeight,
              ],
            }),
            state === "closure_error" ? "Reintentar" : "Ir al cierre",
          );
          const file = `dynamic_${state}_${sequence}_${index + 1}_${width}x${height}.png`;
          await page.screenshot({
            path: path.join(evidenceDir, file),
            scale: "css",
          });
          dynamic.push({
            state,
            sequence,
            step: index + 1,
            width,
            height,
            file,
            ...sample,
          });
          expect(sample.route).toBe("/estacion/5");
          expect(sample.client[0]).toBe(sample.scroll[0]);
          expect(sample.focused).toBe(true);
        }
      }
    }

    for (const [sequence, dimensions] of sequences) {
      await setGlobalStorageFailure(page, false);
      await seedProgress(
        page,
        completedAreas,
        [...previousStations, 5],
        "/transition/world-5-to-final",
      );
      for (let index = 0; index < dimensions.length; index += 1) {
        const [width, height] = dimensions[index];
        await page.setViewportSize({ width, height });
        await expect(page).toHaveURL(/\/transition\/world-5-to-final$/);
        const file = `dynamic_transition_${sequence}_${index + 1}_${width}x${height}.png`;
        await page.screenshot({
          path: path.join(evidenceDir, file),
          scale: "css",
        });
        const dimensionsNow = await page.evaluate(() => ({
          client: [
            document.documentElement.clientWidth,
            document.documentElement.clientHeight,
          ],
          scroll: [
            document.documentElement.scrollWidth,
            document.documentElement.scrollHeight,
          ],
        }));
        dynamic.push({
          state: "transition",
          sequence,
          step: index + 1,
          width,
          height,
          file,
          route: new URL(page.url()).pathname,
          ...dimensionsNow,
        });
        expect(dimensionsNow.client[0]).toBe(dimensionsNow.scroll[0]);
      }
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await setGlobalStorageFailure(page, false);
    await seedProgress(page, completedAreas, previousStations);
    await page.setViewportSize({ width: 390, height: 844 });
    await settleStationVisuals(page);
    await page.screenshot({
      path: path.join(evidenceDir, "reduced_motion_overview_close_390x844.png"),
      scale: "css",
    });
    await expect(
      page.locator("[data-station5-reduced-motion]"),
    ).toHaveAttribute("data-station5-reduced-motion", "true");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 375, height: 667 });
    for (const [id, route, areas, expected] of [
      ["plants", "/estacion/5/plantas", [], "plants_intro"],
      ["system", "/estacion/5/sistema", ["plantas"], "system_intro"],
      ["space", "/estacion/5/espacio", ["plantas", "sistema"], "space_intro"],
      [
        "visitor",
        "/estacion/5/visitante",
        ["plantas", "sistema", "espacio"],
        "visitor_intro",
      ],
    ] as const) {
      await seedProgress(page, [...areas], previousStations, route);
      await expectStationState(page, expected);
      await settleStationVisuals(page);
      await page.screenshot({
        path: path.join(evidenceDir, `protected_${id}_intro_375x667.png`),
        scale: "css",
        style: stationOnlyScreenshotStyle,
      });
    }

    await fs.writeFile(
      path.join(evidenceDir, "dynamic_viewport.json"),
      `${JSON.stringify({ pass: true, samples: dynamic, telemetry: telemetrySnapshot(telemetry) }, null, 2)}\n`,
    );
    expectTelemetryClean(telemetry);
  });

  test("genera contact sheets y comparaciones 020G/020H", async () => {
    await makeContactSheet("375x667");
    await makeContactSheet("667x375");
    const baselineDir = path.resolve("docs/visual/world5/st5-020g");
    const comparisons = [
      await comparePngs(
        path.join(baselineDir, "375x667_04_overview_four_of_four.png"),
        path.join(evidenceDir, "375x667_02_overview_four_of_four.png"),
        "comparison_020g_020h_overview_375x667.jpg",
        ["020G overview 4/4", "020H overview 4/4 + CTA"],
      ),
      await comparePngs(
        path.join(baselineDir, "667x375_04_overview_four_of_four.png"),
        path.join(evidenceDir, "667x375_02_overview_four_of_four.png"),
        "comparison_020g_020h_overview_667x375.jpg",
        ["020G overview 4/4", "020H overview 4/4 + CTA"],
      ),
      await comparePngs(
        path.join(baselineDir, "375x667_06_plants_intro.png"),
        path.join(evidenceDir, "protected_plants_intro_375x667.png"),
        "comparison_020g_020h_plants_375x667.jpg",
        ["020G Plantas", "020H Plantas"],
      ),
      await comparePngs(
        path.join(baselineDir, "375x667_08_system_intro.png"),
        path.join(evidenceDir, "protected_system_intro_375x667.png"),
        "comparison_020g_020h_system_375x667.jpg",
        ["020G Sistema", "020H Sistema"],
      ),
      await comparePngs(
        path.join(baselineDir, "375x667_10_space_intro.png"),
        path.join(evidenceDir, "protected_space_intro_375x667.png"),
        "comparison_020g_020h_space_375x667.jpg",
        ["020G Espacio", "020H Espacio"],
      ),
      await comparePngs(
        path.join(baselineDir, "375x667_02_visitor_intro.png"),
        path.join(evidenceDir, "protected_visitor_intro_375x667.png"),
        "comparison_020g_020h_visitor_375x667.jpg",
        ["020G Visitante", "020H Visitante"],
      ),
    ];
    const protectedComparisons = comparisons.slice(2);
    const result = {
      ticket: "ST5-020H",
      comparisons,
      protectedExactMatches: protectedComparisons.filter(
        (entry) => entry.exactMatch,
      ).length,
      protectedPerceptualMatches: protectedComparisons.filter(
        (entry) => entry.perceptualMatch,
      ).length,
      protectedCount: protectedComparisons.length,
      rasterTolerance: {
        meanAbsoluteChannelDeltaMax: 1,
        channelsOverTwentyRatioMax: 0.001,
      },
      pass: protectedComparisons.every((entry) => entry.perceptualMatch),
    };
    await fs.writeFile(
      path.join(evidenceDir, "comparison_summary.json"),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    expect(result.pass).toBe(true);
  });

  test("genera matriz real de navegadores para el CTA 4/4", async ({
    browser: projectBrowser,
  }, testInfo) => {
    test.setTimeout(120_000);
    const baseURL = String(
      testInfo.project.use.baseURL ?? "http://127.0.0.1:4174",
    );

    async function probe(
      name: string,
      launch: () => ReturnType<typeof chromium.launch>,
    ) {
      try {
        const browser = await launch();
        const version = browser.version();
        const page = await browser.newPage({
          baseURL,
          viewport: { width: 667, height: 320 },
        });
        const telemetry = attachTelemetry(page);
        try {
          await seedProgress(
            page,
            completedAreas,
            previousStations,
            "/estacion/5",
            baseURL,
          );
          await expectStationState(page, "map_overview");
          const closeButton = page.getByRole("button", { name: closeCopy });
          const closeVisible = await closeButton.isVisible();
          const closeBox = await closeButton.boundingBox();
          const dimensions = await page.evaluate(() => ({
            client: [
              document.documentElement.clientWidth,
              document.documentElement.clientHeight,
            ],
            scroll: [
              document.documentElement.scrollWidth,
              document.documentElement.scrollHeight,
            ],
          }));
          const telemetryData = telemetrySnapshot(telemetry);
          return {
            name,
            available: true,
            version,
            route: new URL(page.url()).pathname,
            closeVisible,
            closeBox,
            dimensions,
            telemetry: telemetryData,
            pass:
              closeVisible &&
              (closeBox?.width ?? 0) >= 44 &&
              (closeBox?.height ?? 0) >= 44 &&
              dimensions.client.join("x") === dimensions.scroll.join("x") &&
              Object.values(telemetryData).every(
                (entries) => entries.length === 0,
              ),
          };
        } finally {
          await browser.close();
        }
      } catch (error) {
        const message = String(error);
        return {
          name,
          available: false,
          pass: null,
          reason: message.includes("Executable doesn't exist")
            ? "Playwright browser executable is not installed in this environment."
            : message.split("\n")[0],
        };
      }
    }

    async function probeOptional(
      name: string,
      browserType: typeof firefox | typeof webkit,
    ) {
      const executablePath = browserType.executablePath();
      try {
        await fs.access(executablePath);
      } catch {
        return {
          name,
          available: false,
          pass: null,
          reason:
            "Playwright browser executable is not installed in this environment.",
        };
      }

      return probe(name, () =>
        browserType.launch({ headless: true, executablePath }),
      );
    }

    const result = {
      runnerBrowserVersion: projectBrowser.version(),
      chromium: await probe("Chromium", () =>
        chromium.launch({ headless: true, channel: "chromium" }),
      ),
      firefox: await probeOptional("Firefox", firefox),
      webkit: await probeOptional("WebKit", webkit),
      policy:
        "Chromium is mandatory; Firefox and WebKit are exercised when their Playwright engines are installed.",
    };
    const matrix = {
      ...result,
      pass:
        result.chromium.pass === true &&
        [result.firefox, result.webkit]
          .filter((entry) => entry.available)
          .every((entry) => entry.pass === true),
    };
    await fs.writeFile(
      path.join(evidenceDir, "browser_matrix.json"),
      `${JSON.stringify(matrix, null, 2)}\n`,
    );

    expect(matrix.chromium.available).toBe(true);
    expect(matrix.chromium.pass).toBe(true);
    expect(matrix.pass).toBe(true);
  });
});
