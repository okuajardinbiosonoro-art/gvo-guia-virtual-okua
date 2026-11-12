import { useEffect, useMemo, useRef, useState } from "react";
import { type PreloadImagesOptions, type PreloadSummary, preloadImages } from "./assetPreloader";
import { type ScreenAssetBundle, getBundleSources } from "./screenAssetBundles";

export type AssetPreloaderHookStatus = "idle" | "loading" | "ready" | "error" | "timeout" | "aborted";
export type AssetPreloaderState = {
  status: AssetPreloaderHookStatus; progress: number; ready: boolean;
  failed: number; timedOut: number; total: number; summary: PreloadSummary | null;
  sourceKey: string;
};
export type UseAssetPreloaderOptions = PreloadImagesOptions & { enabled?: boolean; retryKey?: number | string; contextKey?: string };
const IDLE: AssetPreloaderState = { status: "idle", progress: 0, ready: false, failed: 0, timedOut: 0, total: 0, summary: null, sourceKey: "" };

export function useAssetPreloader(bundle: ScreenAssetBundle, {
  enabled = true, decode = true, timeoutMs = 8000, concurrency = 2,
  retryKey = 0, contextKey = "", signal, deadlineAt, onProgress,
}: UseAssetPreloaderOptions = {}) {
  const sources = useMemo(() => getBundleSources(bundle), [bundle]);
  const sourceKey = JSON.stringify([bundle.id, sources, decode, timeoutMs, concurrency, retryKey, contextKey, deadlineAt]);
  const [current, setCurrent] = useState<{ key: string; signal: AbortSignal | undefined; state: AssetPreloaderState }>({ key: "", signal: undefined, state: IDLE });
  const generationRef = useRef(0);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  useEffect(() => {
    const generation = ++generationRef.current;
    const setState = (state: AssetPreloaderState) => setCurrent({ key: sourceKey, signal, state: { ...state, sourceKey } });
    if (!enabled) { setState(IDLE); return; }
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener("abort", cancel, { once: true });
    if (signal?.aborted) cancel();
    setState({ ...IDLE, status: "loading", total: sources.length });
    void preloadImages(sources, {
      decode, timeoutMs, concurrency, deadlineAt, signal: controller.signal,
      onProgress: (progress) => {
        if (generationRef.current !== generation || controller.signal.aborted) return;
        setState({ ...IDLE, ...progress, status: "loading", ready: false });
        onProgressRef.current?.(progress);
      },
    }).then((summary) => {
      if (generationRef.current !== generation) return;
      setState({ status: summary.status, progress: summary.progress, ready: summary.status === "ready", failed: summary.failed, timedOut: summary.timedOut, total: summary.total, summary, sourceKey });
    }).catch(() => {
      if (generationRef.current !== generation) return;
      setState({ ...IDLE, status: "error", failed: sources.length, total: sources.length });
    });
    return () => { generationRef.current += 1; signal?.removeEventListener("abort", cancel); controller.abort(); };
  }, [bundle.id, sources, sourceKey, enabled, decode, timeoutMs, concurrency, retryKey, contextKey, signal, deadlineAt]);
  if (!enabled) return { ...IDLE, sourceKey };
  // Effects run after render. Never expose the previous destination's ready/summary
  // during the render which introduces a different bundle, context or attempt.
  if (current.key !== sourceKey || current.signal !== signal) return { ...IDLE, sourceKey, status: "loading" as const, total: sources.length };
  return current.state;
}
