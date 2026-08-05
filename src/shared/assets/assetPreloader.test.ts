import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearAssetPreloadCache,
  isLocalAssetSource,
  preloadImage,
  preloadImages,
} from "./assetPreloader";
import { screenAssetBundles } from "./screenAssetBundles";

class MockImage {
  static created = 0;
  static failuresRemaining = 0;

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  decoding = "auto";
  complete = false;
  naturalWidth = 0;
  #src = "";

  constructor() {
    MockImage.created += 1;
  }

  get src() {
    return this.#src;
  }

  set src(value: string) {
    this.#src = value;
    queueMicrotask(() => {
      if (MockImage.failuresRemaining > 0) {
        MockImage.failuresRemaining -= 1;
        this.onerror?.();
        return;
      }

      this.complete = true;
      this.naturalWidth = 1;
      this.onload?.();
    });
  }

  decode() {
    return Promise.resolve();
  }
}

describe("assetPreloader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearAssetPreloadCache();
    MockImage.created = 0;
    MockImage.failuresRemaining = 0;
  });

  it("preloadImage maneja una carga exitosa con decode", async () => {
    vi.stubGlobal("Image", MockImage);

    const result = await preloadImage("/assets/example.png");

    expect(result.ok).toBe(true);
    expect(result.status).toBe("decoded");
    expect(result.decoded).toBe(true);
  });

  it("preloadImages deduplica rutas repetidas", async () => {
    vi.stubGlobal("Image", MockImage);

    const summary = await preloadImages([
      "/assets/example.png",
      "/assets/example.png",
      "/assets/other.png",
    ]);

    expect(summary.total).toBe(2);
    expect(MockImage.created).toBe(2);
    expect(summary.status).toBe("ready");
  });

  it("conserva éxitos en caché y permite reintentar un resultado fallido", async () => {
    vi.stubGlobal("Image", MockImage);

    const successfulSource = "/assets/success.png";
    await preloadImage(successfulSource);
    await preloadImage(successfulSource);
    expect(MockImage.created).toBe(1);

    MockImage.failuresRemaining = 1;
    const firstAttempt = await preloadImage("/assets/retry.png");
    const secondAttempt = await preloadImage("/assets/retry.png");

    expect(firstAttempt.status).toBe("failed");
    expect(secondAttempt.status).toBe("decoded");
    expect(MockImage.created).toBe(3);
  });

  it("preloadImages no falla fatalmente con rutas vacias", async () => {
    const summary = await preloadImages(["", "   "]);

    expect(summary.status).toBe("ready");
    expect(summary.skipped).toBe(1);
    expect(summary.failed).toBe(0);
  });

  it("rechaza URLs externas como assets no locales", () => {
    const externalProtocol = "https:";
    const externalAsset = `${externalProtocol}//example.invalid/asset.png`;

    expect(isLocalAssetSource("/assets/local.png")).toBe(true);
    expect(isLocalAssetSource("assets/local.png")).toBe(true);
    expect(isLocalAssetSource(externalAsset)).toBe(false);
  });

  it("los bundles criticos no contienen URLs externas", () => {
    for (const bundle of Object.values(screenAssetBundles)) {
      for (const asset of bundle.assets) {
        expect(asset.src).not.toMatch(/^https?:\/\//);
        expect(isLocalAssetSource(asset.src)).toBe(true);
      }
    }
  });

  it("los bundles contienen rutas locales esperadas por pantalla", () => {
    expect(
      screenAssetBundles.loadingInitialCritical.assets.map(
        (asset) => asset.src,
      ),
    ).toContain("/assets/runtime/loading-initial/lia/lia_loading_16f.png");
    expect(
      screenAssetBundles.coverIntroCritical.assets.map((asset) => asset.src),
    ).toContain(
      "/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png",
    );
    expect(
      screenAssetBundles.transitionRootCritical.assets.some((asset) =>
        asset.src.includes("transition_root_background_v1"),
      ),
    ).toBe(true);
    expect(
      screenAssetBundles.world1RootInitial.assets.map((asset) => asset.src),
    ).toContain(
      "/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png",
    );
  });
});
