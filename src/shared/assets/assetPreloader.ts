export type AssetPreloadStatus = "loaded" | "decoded" | "failed" | "timeout" | "aborted";
export type PreloadImageOptions = {
  decode?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** Absolute performance.now() deadline shared by the preparation attempt. */
  deadlineAt?: number;
  /** Reuse successful decoding from the route preparation during this visit. */
  reuseVerified?: boolean;
};
export type PreloadImageResult = {
  src: string; status: AssetPreloadStatus; ok: boolean; decoded: boolean;
  decodeFallback?: boolean; durationMs: number; error?: string;
};
export type PreloadProgress = {
  total: number; completed: number; loaded: number; decoded: number;
  failed: number; timedOut: number; aborted: number;
  /** Successes / declared images; errors do not advance progress. */
  progress: number;
};
export type PreloadImagesOptions = PreloadImageOptions & {
  concurrency?: number;
  onProgress?: (progress: PreloadProgress) => void;
};
export type PreloadSummaryStatus = "ready" | "error" | "timeout" | "aborted";
export type PreloadSummary = PreloadProgress & {
  status: PreloadSummaryStatus; skipped: number; results: PreloadImageResult[];
};
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_ATTEMPT_MS = 15000;
const DEFAULT_CONCURRENCY = 2;
const imagePreloadCache = new Map<string, Promise<PreloadImageResult>>();
const verifiedImages = new Map<string, PreloadImageResult>();
function now() { return typeof performance === "undefined" ? Date.now() : performance.now(); }

export function isLocalAssetSource(src: string) {
  if (!src.trim()) return false;
  if (/^(data:|blob:)/i.test(src)) return true;
  try {
    const origin = typeof window === "undefined" ? "http://gvo.invalid" : window.location.origin;
    const url = new URL(src, `${origin}/`);
    return /^(https?:)$/.test(url.protocol) && url.origin === origin;
  } catch { return false; }
}
function result(src: string, startedAt: number, status: AssetPreloadStatus, error?: string, decodeFallback = false): PreloadImageResult {
  return {
    src, status, ok: status === "loaded" || status === "decoded", decoded: status === "decoded",
    durationMs: Math.max(0, Math.round(now() - startedAt)),
    ...(error ? { error } : {}), ...(decodeFallback ? { decodeFallback: true } : {}),
  };
}
export function preloadImage(src: string, options: PreloadImageOptions = {}): Promise<PreloadImageResult> {
  const normalized = src.trim();
  // A controlled attempt never inherits an in-flight request with another deadline.
  const controlled = options.signal !== undefined || options.deadlineAt !== undefined;
  const cacheKey = `${normalized}|decode:${options.decode !== false}`;
  if (options.reuseVerified && !options.signal?.aborted && (options.deadlineAt === undefined || now() < options.deadlineAt)) {
    const verified = verifiedImages.get(cacheKey);
    if (verified) return Promise.resolve(verified);
  }
  if (!controlled && imagePreloadCache.has(cacheKey)) return imagePreloadCache.get(cacheKey)!;
  const promise = loadImage(normalized, options);
  if (options.reuseVerified) void promise.then((loaded) => { if (loaded.ok) verifiedImages.set(cacheKey, loaded); });
  if (!controlled) {
    imagePreloadCache.set(cacheKey, promise);
    void promise.then((loaded) => {
      if (!loaded.ok && imagePreloadCache.get(cacheKey) === promise) imagePreloadCache.delete(cacheKey);
    });
  }
  return promise;
}
function loadImage(src: string, { decode = true, timeoutMs = DEFAULT_TIMEOUT_MS, signal, deadlineAt }: PreloadImageOptions) {
  const startedAt = now();
  if (signal?.aborted) return Promise.resolve(result(src, startedAt, "aborted", "asset_preload_aborted"));
  if (deadlineAt !== undefined && startedAt >= deadlineAt) return Promise.resolve(result(src, startedAt, "timeout", "attempt_deadline_exceeded"));
  if (!src || !isLocalAssetSource(src)) return Promise.resolve(result(src, startedAt, "failed", src ? "external_asset_rejected" : "empty_critical_asset"));
  if (typeof window === "undefined" || typeof window.Image !== "function") return Promise.resolve(result(src, startedAt, "failed", "image_api_unavailable"));
  return new Promise<PreloadImageResult>((resolve) => {
    const image = new window.Image();
    let settled = false;
    let decoding = false;
    function settle(loaded: PreloadImageResult) {
      if (settled) return;
      settled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abort);
      image.onload = null; image.onerror = null;
      if ((loaded.status === "aborted" || loaded.status === "timeout") && typeof image.removeAttribute === "function") image.removeAttribute("src");
      resolve(loaded);
    }
    function abort() { settle(result(src, startedAt, "aborted", "asset_preload_aborted")); }
    function succeed(status: "loaded" | "decoded", fallback = false) {
      if (signal?.aborted) { abort(); return; }
      if (deadlineAt !== undefined && now() >= deadlineAt) { settle(result(src, startedAt, "timeout", "attempt_deadline_exceeded")); return; }
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) { settle(result(src, startedAt, "failed", "invalid_image_dimensions")); return; }
      settle(result(src, startedAt, status, undefined, fallback));
    }
    const remaining = deadlineAt === undefined ? timeoutMs : Math.min(timeoutMs, deadlineAt - startedAt);
    const timeoutId = window.setTimeout(() => settle(result(src, startedAt, "timeout", "asset_preload_timeout")), Math.max(0, remaining));
    signal?.addEventListener("abort", abort, { once: true });
    image.onload = () => {
      if (settled || decoding) return;
      if (!decode) { succeed("loaded"); return; }
      if (typeof image.decode !== "function") { succeed("loaded", true); return; }
      decoding = true;
      try { void image.decode().then(() => succeed("decoded")).catch(() => settle(result(src, startedAt, "failed", "asset_decode_failed"))); }
      catch { settle(result(src, startedAt, "failed", "asset_decode_failed")); }
    };
    image.onerror = () => settle(result(src, startedAt, "failed", "asset_preload_error"));
    image.decoding = "async"; image.src = src;
  });
}
function progressOf(total: number, results: readonly PreloadImageResult[]): PreloadProgress {
  const loaded = results.filter((item) => item.ok).length;
  return {
    total, completed: results.length, loaded,
    decoded: results.filter((item) => item.decoded).length,
    failed: results.filter((item) => item.status === "failed").length,
    timedOut: results.filter((item) => item.status === "timeout").length,
    aborted: results.filter((item) => item.status === "aborted").length,
    progress: total === 0 ? 1 : loaded / total,
  };
}
export async function preloadImages(srcs: readonly string[], options: PreloadImagesOptions = {}): Promise<PreloadSummary> {
  const sources = [...new Set(srcs.map((src) => src.trim()))];
  const concurrency = Math.max(1, Math.floor(options.concurrency ?? DEFAULT_CONCURRENCY));
  const deadlineAt = options.deadlineAt ?? now() + DEFAULT_ATTEMPT_MS;
  const results: PreloadImageResult[] = [];
  let nextIndex = 0;
  const publish = () => options.onProgress?.(progressOf(sources.length, results));
  publish();
  async function worker() {
    while (nextIndex < sources.length) {
      const src = sources[nextIndex++];
      results.push(await preloadImage(src, { ...options, deadlineAt }));
      publish();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, sources.length) }, () => worker()));
  const progress = progressOf(sources.length, results);
  const status: PreloadSummaryStatus = progress.aborted > 0 || options.signal?.aborted ? "aborted"
    : progress.timedOut > 0 ? "timeout" : progress.failed > 0 ? "error" : "ready";
  return { ...progress, status, skipped: 0, results };
}
export function clearAssetPreloadCache() { imagePreloadCache.clear(); verifiedImages.clear(); }
