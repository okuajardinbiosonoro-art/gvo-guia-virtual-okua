import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";
import {
  BinaryBitmap,
  HybridBinarizer,
  QRCodeReader,
  RGBLuminanceSource,
} from "@zxing/library";
import sharp from "sharp";

const PROGRESS_KEY = "gvo.progress.v1";
const WORLD1_KEY = "gvo.station1.v1";

type CameraMode = "grant" | "deny";

type CameraTestState = {
  constraints: MediaStreamConstraints | null;
  mode: CameraMode;
  rejects: number;
  requests: number;
  resolves: number;
  stops: number;
};

async function installCameraContract(page: Page, mode: CameraMode = "grant") {
  await page.addInitScript((cameraMode) => {
    const state: CameraTestState = {
      constraints: null as MediaStreamConstraints | null,
      mode: cameraMode,
      rejects: 0,
      requests: 0,
      resolves: 0,
      stops: 0,
    };
    Object.defineProperty(window, "__GVO_QR_TEST_MODE__", {
      configurable: true,
      value: true,
      writable: true,
    });
    Object.defineProperty(window, "__gvoDebt015Camera", {
      configurable: true,
      value: state,
    });
    const syntheticMediaDevices = {
      getUserMedia: async (constraints: MediaStreamConstraints) => {
        state.requests += 1;
        state.constraints = constraints;
        if (cameraMode === "deny") {
          state.rejects += 1;
          throw new DOMException("Denied by GVO_DEBT_015", "NotAllowedError");
        }
        state.resolves += 1;
        return {
          getTracks: () => [{ stop: () => (state.stops += 1) }],
        } as unknown as MediaStream;
      },
    };
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: syntheticMediaDevices,
    });
  }, mode);
}

async function seedWorld1Ready(page: Page, failProgressWrite = false) {
  await page.addInitScript(
    ({ checkpointKey, progressKey, shouldFail }) => {
      localStorage.setItem(
        checkpointKey,
        JSON.stringify({
          activeConcept: "ready_to_continue",
          highestReachedConcept: "ready_to_continue",
          schemaVersion: 1,
          updatedAt: "2026-08-17T12:00:00.000Z",
        }),
      );
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          completedStations: [],
          schemaVersion: 1,
          updatedAt: null,
        }),
      );
      const failureState = { failProgressWrite: shouldFail };
      Object.defineProperty(window, "__gvoDebt015Storage", {
        configurable: true,
        value: failureState,
      });
      const nativeSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function setItem(key, value) {
        if (key === progressKey && failureState.failProgressWrite) {
          throw new DOMException("Blocked by test", "QuotaExceededError");
        }
        nativeSetItem.call(this, key, value);
      };
    },
    {
      checkpointKey: WORLD1_KEY,
      progressKey: PROGRESS_KEY,
      shouldFail: failProgressWrite,
    },
  );
}

async function cameraState(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __gvoDebt015Camera?: CameraTestState;
        }
      ).__gvoDebt015Camera,
  );
}

async function emitQr(page: Page, payload: string) {
  await page.evaluate((nextPayload) => {
    window.dispatchEvent(
      new CustomEvent("gvo:qr-test-payload", {
        detail: { payload: nextPayload },
      }),
    );
  }, payload);
}

async function expectFullyInsideViewport(page: Page, selector: string) {
  const geometry = await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      height: window.innerHeight,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: window.innerWidth,
    };
  });

  expect(geometry.left).toBeGreaterThanOrEqual(0);
  expect(geometry.top).toBeGreaterThanOrEqual(0);
  expect(geometry.right).toBeLessThanOrEqual(geometry.width);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.height);
}

async function openWorld1Scanner(page: Page) {
  const world1 = page.locator(".world1-root-screen");
  await expect(world1).toHaveAttribute(
    "data-world1-root-state",
    "ready_to_continue",
  );
  await expect(world1).toHaveAttribute("data-critical-assets-ready", "true");
  const previous = await cameraState(page);
  expect(previous).toBeDefined();
  await page
    .getByRole("button", { name: "Escanea el QR para abrir Mundo 2" })
    .click();
  await expect
    .poll(async () => {
      const current = await cameraState(page);
      return current
        ? {
            rejects: current.rejects,
            requests: current.requests,
            resolves: current.resolves,
          }
        : null;
    })
    .toEqual({
      rejects: previous!.rejects,
      requests: previous!.requests + 1,
      resolves: previous!.resolves + 1,
    });
  await expect(page.locator("[data-interstation-qr-gate]")).toHaveAttribute(
    "data-camera-status",
    "camera-granted",
    { timeout: 15_000 },
  );
}

test("/inicio grant usa sólo cámara environment, detiene stream y abre Portada", async ({
  page,
}) => {
  await installCameraContract(page);
  await page.goto("/inicio");
  await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: "Iniciar recorrido" }).click();

  await expect(page).toHaveURL(/\/portada$/);
  expect(await cameraState(page)).toEqual({
    constraints: {
      audio: false,
      video: { facingMode: { ideal: "environment" } },
    },
    mode: "grant",
    rejects: 0,
    requests: 1,
    resolves: 1,
    stops: 1,
  });
});

test("el servidor E2E usa HTTPS y expone secure context", async ({ page }) => {
  await page.goto("/inicio");

  expect(
    await page.evaluate(() => ({
      protocol: location.protocol,
      secureContext: window.isSecureContext,
    })),
  ).toEqual({ protocol: "https:", secureContext: true });
});

test("iPhone SE 2 mantiene entrada y scanner QR íntegros en portrait y landscape", async ({
  page,
}) => {
  await installCameraContract(page);
  await seedWorld1Ready(page);
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/inicio");
  await page.getByRole("button", { name: "Español" }).click();

  for (const selector of [
    '[data-language-option="es"]',
    '[data-language-option="en"]',
    '[data-initial-fullscreen-action="request"]',
    '[data-initial-experience-action="start"]',
  ]) {
    await expectFullyInsideViewport(page, selector);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);

  await page.goto("/estacion/1");
  await expectFullyInsideViewport(
    page,
    '[data-interstation-qr-action="open"]',
  );
  await openWorld1Scanner(page);
  await expectFullyInsideViewport(page, ".interstation-qr-gate__scanner");
  await expectFullyInsideViewport(
    page,
    '[data-interstation-qr-action="close"]',
  );
  await page.locator('[data-interstation-qr-action="close"]').click();

  await page.setViewportSize({ width: 667, height: 375 });
  await expectFullyInsideViewport(
    page,
    '[data-interstation-qr-action="open"]',
  );
  await openWorld1Scanner(page);
  await expectFullyInsideViewport(page, ".interstation-qr-gate__scanner");
  await expectFullyInsideViewport(
    page,
    '[data-interstation-qr-action="close"]',
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(667);
});

test("/inicio deny permanece, informa y ofrece retry sin permiso persistido", async ({
  page,
}) => {
  await installCameraContract(page, "deny");
  await page.goto("/inicio");
  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("button", { name: "Start journey" }).click();

  await expect(page).toHaveURL(/\/inicio$/);
  await expect(page.locator("[data-initial-camera-status]")).toHaveAttribute(
    "data-initial-camera-status",
    "camera-denied",
  );
  await expect(
    page.getByRole("button", { name: "Retry camera" }),
  ).toBeEnabled();
  expect(
    await page.evaluate(() => localStorage.getItem("gvo.camera.permission")),
  ).toBeNull();
  expect(await cameraState(page)).toEqual({
    constraints: {
      audio: false,
      video: { facingMode: { ideal: "environment" } },
    },
    mode: "deny",
    rejects: 1,
    requests: 1,
    resolves: 0,
    stops: 0,
  });
});

test("origen inseguro conserva diagnóstico separado y no llama getUserMedia", async ({
  page,
}) => {
  await installCameraContract(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: false,
    });
  });
  await page.goto("/inicio");
  await page.getByRole("button", { name: "Español" }).click();
  await page.getByRole("button", { name: "Reintentar cámara" }).click();

  await expect(page.locator("[data-initial-camera-status]")).toHaveAttribute(
    "data-initial-camera-status",
    "camera-blocked-insecure-context",
  );
  expect((await cameraState(page))?.requests).toBe(0);
});

test("W1 no tiene CTA de avance; wrong/unknown no escriben y QR correcto completa por transición", async ({
  page,
}) => {
  await installCameraContract(page);
  await seedWorld1Ready(page);
  await page.goto("/estacion/1");

  await expect(page.getByRole("button", { name: "Continuar" })).toHaveCount(0);
  await openWorld1Scanner(page);
  const progressBefore = await page.evaluate(
    (key) => localStorage.getItem(key),
    PROGRESS_KEY,
  );

  await emitQr(page, "/qr/w3");
  await expect(page.getByText(/pertenece a otra estación/i)).toBeVisible();
  await emitQr(page, ["https:", "", "example.test", "qr", "w2"].join("/"));
  await expect(page.getByText(/QR no reconocido/i)).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY),
  ).toBe(progressBefore);
  await expect(page).toHaveURL(/\/estacion\/1$/);

  await emitQr(page, "  /qr/w2\n");
  await expect(page).toHaveURL(/\/transition\/world-1-to-world-2$/);
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key) ?? "{}"),
      PROGRESS_KEY,
    ),
  ).toMatchObject({ completedStations: [1], schemaVersion: 1 });
  expect((await cameraState(page))?.stops).toBe(1);
});

test("write verification failure bloquea ruta y retry completa sin reescanear", async ({
  page,
}) => {
  await installCameraContract(page);
  await seedWorld1Ready(page, true);
  await page.goto("/estacion/1");
  await openWorld1Scanner(page);
  await emitQr(page, "/qr/w2");

  await expect(page).toHaveURL(/\/estacion\/1$/);
  await expect(
    page.getByRole("button", { name: "Reintentar guardado verificado" }),
  ).toBeVisible();
  expect((await cameraState(page))?.stops).toBe(1);

  await page.evaluate(() => {
    (
      window as typeof window & {
        __gvoDebt015Storage?: { failProgressWrite: boolean };
      }
    ).__gvoDebt015Storage!.failProgressWrite = false;
  });
  await page
    .getByRole("button", { name: "Reintentar guardado verificado" })
    .click();
  await expect(page).toHaveURL(/\/transition\/world-1-to-world-2$/);
});

test("revisita desde Mirador conserva dock, no exige QR y no abre cámara", async ({
  page,
}) => {
  await installCameraContract(page);
  await page.addInitScript(
    ({ progressKey }) => {
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          completedStations: [1, 2, 3, 4, 5],
          schemaVersion: 1,
          updatedAt: "2026-08-17T12:00:00.000Z",
        }),
      );
      sessionStorage.setItem(
        "gvo.final.reviewContext.v1",
        JSON.stringify({
          mode: "final-review",
          origin: "/final",
          startedAt: "2026-08-17T12:00:00.000Z",
          timestamp: Date.parse("2026-08-17T12:00:00.000Z"),
          version: 1,
          world: 1,
        }),
      );
    },
    { progressKey: PROGRESS_KEY },
  );
  await page.goto("/estacion/1");

  await expect(
    page.locator("[data-final-review-return='active']"),
  ).toBeVisible();
  await expect(page.locator("[data-interstation-qr-gate]")).toHaveCount(0);
  expect((await cameraState(page))?.requests).toBe(0);
});

test("W5→Final permanece operativo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((progressKey) => {
    localStorage.setItem(
      progressKey,
      JSON.stringify({
        completedStations: [1, 2, 3, 4, 5],
        schemaVersion: 1,
        updatedAt: "2026-08-17T12:00:00.000Z",
      }),
    );
  }, PROGRESS_KEY);
  await page.goto("/transition/world-5-to-final");
  await expect(page).toHaveURL(/\/final$/, { timeout: 20_000 });
});

test("los cuatro PNG generados decodifican exactamente los payloads canónicos", async () => {
  const definitions = [
    ["gvo_qr_world1_to_world2_v01.png", "/qr/w2"],
    ["gvo_qr_world2_to_world3_v01.png", "/qr/w3"],
    ["gvo_qr_world3_to_world4_v01.png", "/qr/w4"],
    ["gvo_qr_world4_to_world5_v01.png", "/qr/w5"],
  ] as const;

  for (const [filename, payload] of definitions) {
    const input = await readFile(
      join(process.cwd(), "docs/assets/qr/interstation", filename),
    );
    const { data, info } = await sharp(input)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const source = new RGBLuminanceSource(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
    );
    const decoded = new QRCodeReader()
      .decode(new BinaryBitmap(new HybridBinarizer(source)))
      .getText();
    expect(decoded).toBe(payload);
  }
});
