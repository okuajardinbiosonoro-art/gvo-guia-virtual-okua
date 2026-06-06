export type AssetPreloadStatus =
  | "loaded"
  | "decoded"
  | "failed"
  | "timeout"
  | "skipped";

export type PreloadImageOptions = {
  decode?: boolean;
  timeoutMs?: number;
};

export type PreloadImageResult = {
  src: string;
  status: AssetPreloadStatus;
  ok: boolean;
  decoded: boolean;
  durationMs: number;
  error?: string;
};

export type PreloadImagesOptions = PreloadImageOptions & {
  concurrency?: number;
};

export type PreloadSummaryStatus = "ready" | "error" | "timeout";

export type PreloadSummary = {
  status: PreloadSummaryStatus;
  total: number;
  loaded: number;
  decoded: number;
  failed: number;
  timedOut: number;
  skipped: number;
  progress: number;
  results: PreloadImageResult[];
};

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_CONCURRENCY = 4;

const imagePreloadCache = new Map<string, Promise<PreloadImageResult>>();

function now() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

export function isLocalAssetSource(src: string) {
  if (!src.trim()) {
    return true;
  }

  if (/^(data:|blob:)/i.test(src)) {
    return true;
  }

  if (!/^https?:\/\//i.test(src)) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  try {
    return new URL(src).origin === window.location.origin;
  } catch {
    return false;
  }
}

function createResult(
  src: string,
  startedAt: number,
  status: AssetPreloadStatus,
  ok: boolean,
  decoded = false,
  error?: string,
): PreloadImageResult {
  return {
    src,
    status,
    ok,
    decoded,
    durationMs: Math.max(0, Math.round(now() - startedAt)),
    ...(error ? { error } : {}),
  };
}

export function preloadImage(
  src: string,
  options: PreloadImageOptions = {},
): Promise<PreloadImageResult> {
  const normalizedSrc = src.trim();
  const cacheKey = `${normalizedSrc}|decode:${options.decode !== false}`;

  if (imagePreloadCache.has(cacheKey)) {
    return imagePreloadCache.get(cacheKey)!;
  }

  const promise = loadImage(normalizedSrc, options);
  imagePreloadCache.set(cacheKey, promise);

  return promise;
}

function loadImage(
  src: string,
  { decode = true, timeoutMs = DEFAULT_TIMEOUT_MS }: PreloadImageOptions,
) {
  const startedAt = now();

  if (!src) {
    return Promise.resolve(createResult(src, startedAt, "skipped", true));
  }

  if (!isLocalAssetSource(src)) {
    return Promise.resolve(
      createResult(
        src,
        startedAt,
        "failed",
        false,
        false,
        "external_asset_rejected",
      ),
    );
  }

  if (typeof window === "undefined" || typeof window.Image === "undefined") {
    return Promise.resolve(createResult(src, startedAt, "skipped", true));
  }

  return new Promise<PreloadImageResult>((resolve) => {
    const image = new window.Image();
    let settled = false;
    let timeoutId: number | null = null;

    function settle(result: PreloadImageResult) {
      if (settled) {
        return;
      }

      settled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      resolve(result);
    }

    timeoutId = window.setTimeout(() => {
      settle(
        createResult(
          src,
          startedAt,
          "timeout",
          false,
          false,
          "asset_preload_timeout",
        ),
      );
    }, timeoutMs);

    image.onload = () => {
      if (!decode || typeof image.decode !== "function") {
        settle(createResult(src, startedAt, "loaded", true));
        return;
      }

      image
        .decode()
        .then(() => {
          settle(createResult(src, startedAt, "decoded", true, true));
        })
        .catch(() => {
          settle(createResult(src, startedAt, "loaded", true));
        });
    };

    image.onerror = () => {
      settle(
        createResult(
          src,
          startedAt,
          "failed",
          false,
          false,
          "asset_preload_error",
        ),
      );
    };

    image.decoding = "async";
    image.src = src;
  });
}

export async function preloadImages(
  srcs: readonly string[],
  options: PreloadImagesOptions = {},
): Promise<PreloadSummary> {
  const uniqueSrcs = [...new Set(srcs.map((src) => src.trim()))];
  const concurrency = Math.max(1, options.concurrency ?? DEFAULT_CONCURRENCY);
  const results: PreloadImageResult[] = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < uniqueSrcs.length) {
      const src = uniqueSrcs[nextIndex];
      nextIndex += 1;
      results.push(await preloadImage(src, options));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, uniqueSrcs.length) }, () =>
      worker(),
    ),
  );

  const loaded = results.filter((result) => result.ok).length;
  const decoded = results.filter((result) => result.decoded).length;
  const failed = results.filter((result) => result.status === "failed").length;
  const timedOut = results.filter(
    (result) => result.status === "timeout",
  ).length;
  const skipped = results.filter(
    (result) => result.status === "skipped",
  ).length;
  const status: PreloadSummaryStatus =
    timedOut > 0 ? "timeout" : failed > 0 ? "error" : "ready";

  return {
    status,
    total: uniqueSrcs.length,
    loaded,
    decoded,
    failed,
    timedOut,
    skipped,
    progress:
      uniqueSrcs.length === 0
        ? 1
        : Math.min(1, (loaded + failed + timedOut) / uniqueSrcs.length),
    results,
  };
}

export function clearAssetPreloadCache() {
  imagePreloadCache.clear();
}
