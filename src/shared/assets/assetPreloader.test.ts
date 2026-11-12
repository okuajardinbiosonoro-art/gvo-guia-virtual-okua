import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearAssetPreloadCache,
  isLocalAssetSource,
  preloadImage,
  preloadImages,
  type PreloadProgress,
} from "./assetPreloader";
import { screenAssetBundles } from "./screenAssetBundles";

class MockImage {
  static created = 0;
  static failuresRemaining = 0;
  static hold = false;
  static instances: MockImage[] = [];

  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  decoding = "auto";
  complete = false;
  naturalWidth = 0;
  naturalHeight = 0;
  #src = "";

  constructor() {
    MockImage.created += 1;
    MockImage.instances.push(this);
  }

  get src() {
    return this.#src;
  }

  set src(value: string) {
    this.#src = value;
    if (MockImage.hold) return;
    queueMicrotask(() => {
      if (MockImage.failuresRemaining > 0) {
        MockImage.failuresRemaining -= 1;
        this.onerror?.();
        return;
      }

      this.complete = true;
      this.naturalWidth = 1;
      this.naturalHeight = 1;
      this.onload?.();
    });
  }

  decode() {
    return Promise.resolve();
  }

  succeed() {
    this.complete = true;
    this.naturalWidth = 1;
    this.naturalHeight = 1;
    this.onload?.();
  }
}

describe("assetPreloader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearAssetPreloadCache();
    MockImage.created = 0;
    MockImage.failuresRemaining = 0;
    MockImage.hold = false;
    MockImage.instances = [];
    vi.useRealTimers();
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

  it("una ruta crítica vacía falla y no cuenta como preparación correcta", async () => {
    const summary = await preloadImages(["", "   "]);

    expect(summary.status).toBe("error");
    expect(summary.skipped).toBe(0);
    expect(summary.failed).toBe(1);
    expect(summary.progress).toBe(0);
  });

  it("un decode rechazado no se transforma en loaded ni ready", async () => {
    class RejectedDecode extends MockImage { decode() { return Promise.reject(new Error("decode rejected")); } }
    vi.stubGlobal("Image", RejectedDecode);
    const summary = await preloadImages(["/assets/rejected.png"]);
    expect(summary).toMatchObject({ status: "error", loaded: 0, failed: 1, progress: 0 });
    expect(summary.results[0].error).toBe("asset_decode_failed");
  });

  it("sin decode exige load completo y dimensiones positivas, y registra fallback", async () => {
    class NoDecode extends MockImage { constructor() { super(); Object.defineProperty(this, "decode", { value: undefined }); } }
    vi.stubGlobal("Image", NoDecode);
    const summary = await preloadImages(["/assets/fallback.png"]);
    expect(summary.status).toBe("ready");
    expect(summary.results[0]).toMatchObject({ status: "loaded", decoded: false, decodeFallback: true });
    MockImage.hold = true;
    const invalid = preloadImage("/assets/zero.png", { deadlineAt: performance.now() + 1000 });
    const image = MockImage.instances.at(-1)!;
    image.complete = true;
    image.onload?.();
    expect(await invalid).toMatchObject({ ok: false, error: "invalid_image_dimensions" });
  });

  it("la cola completa comparte 15 s y no suma un timeout nuevo por imagen", async () => {
    vi.useFakeTimers();
    MockImage.hold = true;
    vi.stubGlobal("Image", MockImage);
    const promise = preloadImages(["/a.png", "/b.png", "/c.png", "/d.png", "/e.png"], { deadlineAt: performance.now() + 15000 });
    expect(MockImage.created).toBe(2);
    await vi.advanceTimersByTimeAsync(8000);
    expect(MockImage.created).toBe(4);
    await vi.advanceTimersByTimeAsync(7000);
    expect(await promise).toMatchObject({ status: "timeout", timedOut: 5, loaded: 0, progress: 0 });
    expect(MockImage.created).toBe(4);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("abortar asienta la cola y descarta un decode tardío del intento anterior", async () => {
    MockImage.hold = true;
    let resolveDecode: (() => void) | undefined;
    class LateDecode extends MockImage { decode() { return new Promise<void>((resolve) => { resolveDecode = resolve; }); } }
    vi.stubGlobal("Image", LateDecode);
    const controller = new AbortController();
    const updates: PreloadProgress[] = [];
    const promise = preloadImages(["/late.png", "/queued.png"], { concurrency: 1, signal: controller.signal, onProgress: (value) => updates.push(value) });
    MockImage.instances[0].succeed();
    controller.abort();
    expect(await promise).toMatchObject({ status: "aborted", aborted: 2, loaded: 0 });
    const count = updates.length;
    resolveDecode?.();
    await Promise.resolve();
    expect(updates).toHaveLength(count);
    expect(updates.every((value) => value.progress === 0)).toBe(true);
    expect(MockImage.instances[0].onload).toBeNull();
  });

  it("publica progreso incremental por éxito, con denominador estable y concurrencia dos", async () => {
    MockImage.hold = true;
    vi.stubGlobal("Image", MockImage);
    const updates: PreloadProgress[] = [];
    const promise = preloadImages(["/one.png", "/two.png", "/three.png"], { onProgress: (value) => updates.push(value) });
    expect(MockImage.created).toBe(2);
    MockImage.instances[0].succeed();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(MockImage.created).toBe(3);
    expect(updates.at(-1)).toMatchObject({ progress: 1 / 3, total: 3 });
    MockImage.instances[1].onerror?.();
    MockImage.instances[2].succeed();
    expect(await promise).toMatchObject({ status: "error", loaded: 2, failed: 1, progress: 2 / 3 });
    expect(updates.every((value) => value.total === 3)).toBe(true);
  });

  it("un intento controlado no hereda el decode ni el deadline de otro", async () => {
    vi.stubGlobal("Image", MockImage);
    await preloadImage("/assets/revalidate.png");
    expect(await preloadImage("/assets/revalidate.png", { deadlineAt: performance.now() - 1 })).toMatchObject({ status: "timeout", ok: false });
    expect(await preloadImage("/assets/revalidate.png", { deadlineAt: performance.now() + 1000 })).toMatchObject({ status: "decoded", ok: true });
    expect(MockImage.created).toBe(2);
  });

  it("rechaza URLs externas como assets no locales", () => {
    const externalProtocol = "https:";
    const externalAsset = `${externalProtocol}//example.invalid/asset.png`;

    expect(isLocalAssetSource("/assets/local.png")).toBe(true);
    expect(isLocalAssetSource("assets/local.png")).toBe(true);
    expect(isLocalAssetSource(externalAsset)).toBe(false);
    expect(isLocalAssetSource("//example.invalid/asset.png")).toBe(false);
    expect(isLocalAssetSource("javascript:alert(1)")).toBe(false);
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
    ).toContain(
      "/assets/runtime/loading-initial/lia/lia_loading_16f_okua_v03.png",
    );
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
