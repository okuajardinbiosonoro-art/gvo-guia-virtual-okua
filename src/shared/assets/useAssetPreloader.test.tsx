import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAssetPreloader } from "./useAssetPreloader";
import type { PreloadImagesOptions, PreloadSummary } from "./assetPreloader";
import type { ScreenAssetBundle } from "./screenAssetBundles";

const { load } = vi.hoisted(() => ({ load: vi.fn() }));
vi.mock("./assetPreloader", () => ({ preloadImages: load }));
const bundle: ScreenAssetBundle = { id: "coverIntroCritical", route: "/portada", description: "test", assets: [{ id: "a", src: "/a.png", kind: "image" }] };
function summary(status: PreloadSummary["status"]): PreloadSummary {
  const ready = status === "ready";
  return { status, total: 1, completed: 1, loaded: ready ? 1 : 0, decoded: ready ? 1 : 0, failed: status === "error" ? 1 : 0, timedOut: status === "timeout" ? 1 : 0, aborted: status === "aborted" ? 1 : 0, progress: ready ? 1 : 0, skipped: 0, results: [] };
}
afterEach(() => { cleanup(); load.mockReset(); });

describe("useAssetPreloader preparation contract", () => {
  it.each(["error", "timeout", "aborted"] as const)("%s never becomes ready even in test mode", async (status) => {
    load.mockResolvedValue(summary(status));
    const { result } = renderHook(() => useAssetPreloader(bundle));
    await waitFor(() => expect(result.current.status).toBe(status));
    expect(result.current.ready).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("retry/unmount aborts the owned attempt and late completion cannot overwrite the current one", async () => {
    const pending: { resolve: (value: PreloadSummary) => void; options: PreloadImagesOptions }[] = [];
    load.mockImplementation((_srcs: string[], options: PreloadImagesOptions) => new Promise<PreloadSummary>((resolve) => pending.push({ resolve, options })));
    const { result, rerender, unmount } = renderHook(({ retryKey }) => useAssetPreloader(bundle, { retryKey }), { initialProps: { retryKey: 0 } });
    rerender({ retryKey: 1 });
    expect(pending[0].options.signal?.aborted).toBe(true);
    await act(async () => pending[1].resolve(summary("ready")));
    expect(result.current.ready).toBe(true);
    await act(async () => pending[0].resolve(summary("error")));
    expect(result.current.ready).toBe(true);
    unmount();
    expect(pending[1].options.signal?.aborted).toBe(true);
  });

  it("uses incremental real progress without declaring readiness before the summary", async () => {
    let finish: ((value: PreloadSummary) => void) | undefined;
    let options: PreloadImagesOptions | undefined;
    load.mockImplementation((_srcs: string[], value: PreloadImagesOptions) => { options = value; return new Promise<PreloadSummary>((resolve) => { finish = resolve; }); });
    const { result } = renderHook(() => useAssetPreloader(bundle));
    act(() => options?.onProgress?.({ ...summary("ready"), progress: 0.5 }));
    expect(result.current).toMatchObject({ status: "loading", progress: 0.5, ready: false });
    await act(async () => finish?.(summary("ready")));
    expect(result.current.ready).toBe(true);
  });

  it("a new context never observes the prior bundle ready during its first render", async () => {
    let finish: ((value: PreloadSummary) => void) | undefined;
    load.mockResolvedValueOnce(summary("ready")).mockImplementation(() => new Promise<PreloadSummary>((resolve) => { finish = resolve; }));
    const seen: { context: string; ready: boolean; status: string; sourceKey: string; summary: PreloadSummary | null }[] = [];
    const { result, rerender } = renderHook(({ contextKey }) => {
      const value = useAssetPreloader(bundle, { contextKey });
      seen.push({ context: contextKey, ready: value.ready, status: value.status, sourceKey: value.sourceKey, summary: value.summary });
      return value;
    }, { initialProps: { contextKey: "first" } });
    await waitFor(() => expect(result.current.ready).toBe(true));
    const firstKey = result.current.sourceKey;
    rerender({ contextKey: "next" });
    expect(seen.find((item) => item.context === "next")).toMatchObject({ ready: false, status: "loading", summary: null });
    expect(result.current.sourceKey).not.toBe(firstKey);
    await act(async () => finish?.(summary("ready")));
    expect(result.current.ready).toBe(true);
  });
});
