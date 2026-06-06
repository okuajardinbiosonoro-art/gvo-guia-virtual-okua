import { useEffect, useMemo, useState } from "react";

import {
  type PreloadSummary,
  preloadImages,
} from "./assetPreloader";
import {
  type ScreenAssetBundle,
  getBundleSources,
} from "./screenAssetBundles";

export type AssetPreloaderHookStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "timeout";

export type AssetPreloaderState = {
  status: AssetPreloaderHookStatus;
  progress: number;
  ready: boolean;
  failed: number;
  timedOut: number;
  total: number;
  summary: PreloadSummary | null;
};

type UseAssetPreloaderOptions = {
  enabled?: boolean;
  decode?: boolean;
  timeoutMs?: number;
  concurrency?: number;
};

const TEST_READY_STATE: AssetPreloaderState = {
  status: "ready",
  progress: 1,
  ready: true,
  failed: 0,
  timedOut: 0,
  total: 0,
  summary: null,
};

const IDLE_STATE: AssetPreloaderState = {
  status: "idle",
  progress: 0,
  ready: false,
  failed: 0,
  timedOut: 0,
  total: 0,
  summary: null,
};

function isTestEnvironment() {
  return import.meta.env.MODE === "test";
}

export function useAssetPreloader(
  bundle: ScreenAssetBundle,
  {
    enabled = true,
    decode = true,
    timeoutMs = 8000,
    concurrency = 4,
  }: UseAssetPreloaderOptions = {},
) {
  const sources = useMemo(() => getBundleSources(bundle), [bundle]);
  const sourceKey = sources.join("|");
  const [state, setState] = useState<AssetPreloaderState>(() =>
    isTestEnvironment() && enabled
      ? { ...TEST_READY_STATE, total: sources.length }
      : IDLE_STATE,
  );

  useEffect(() => {
    if (!enabled) {
      setState(IDLE_STATE);
      return undefined;
    }

    if (isTestEnvironment()) {
      setState({ ...TEST_READY_STATE, total: sources.length });
      return undefined;
    }

    let cancelled = false;

    setState({
      status: "loading",
      progress: 0,
      ready: false,
      failed: 0,
      timedOut: 0,
      total: sources.length,
      summary: null,
    });

    preloadImages(sources, { decode, timeoutMs, concurrency })
      .then((summary) => {
        if (cancelled) {
          return;
        }

        setState({
          status: summary.status,
          progress: summary.progress,
          ready: true,
          failed: summary.failed,
          timedOut: summary.timedOut,
          total: summary.total,
          summary,
        });

        if (
          import.meta.env.DEV &&
          (summary.failed > 0 || summary.timedOut > 0)
        ) {
          console.warn("GVO asset preload fallback", {
            bundle: bundle.id,
            status: summary.status,
            failed: summary.failed,
            timedOut: summary.timedOut,
          });
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setState({
          status: "error",
          progress: 1,
          ready: true,
          failed: sources.length,
          timedOut: 0,
          total: sources.length,
          summary: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [bundle.id, concurrency, decode, enabled, sourceKey, sources, timeoutMs]);

  return state;
}

