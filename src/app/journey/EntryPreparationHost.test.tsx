import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { createMemoryRouter, RouterProvider, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreloadImagesOptions, PreloadSummary } from "../../shared/assets/assetPreloader";
import { EntryPreparationHost } from "./EntryPreparationHost";
import { useJourneyActivity } from "./JourneyActivation";
import { invalidateJourneyEssential, setJourneyRuntimeContext } from "./journeyEssential";

const { preload, coverMount, coverUnmount, coverActivity } = vi.hoisted(() => ({ preload: vi.fn(), coverMount: vi.fn(), coverUnmount: vi.fn(), coverActivity: vi.fn() }));
vi.mock("../../shared/assets/assetPreloader", () => ({ preloadImages: preload }));
vi.mock("./journeyResources", () => ({ getEntryResourceManifest: () => ({ revision: "fixture", key: "fixture-v1", own: ["/own.png"], cover: ["/cover.png"], all: ["/own.png", "/cover.png"] }) }));
// Small consumers isolate the actual host/provider/preloader proof and routing.
// Real Cover, camera preflight and writer content retain their own consumer tests.
vi.mock("../../screens/Cover", () => ({ CoverIntroScreen: function Cover() {
  const activity = useJourneyActivity();
  useEffect(() => { coverMount(); return () => { coverUnmount(); }; }, []);
  useEffect(() => { if (activity.active) coverActivity(activity.attemptId); }, [activity.active, activity.attemptId]);
  return <main data-testid="cover-tree"><header><h1>Cover</h1></header><section className="cover-intro__scene"><img src="/cover.png" alt="" /></section><footer><p>Literal fixture</p></footer></main>;
} }));
vi.mock("../../screens/LoadingInitial", () => ({ LoadingInitialScreen: ({ preloadStatus, presentationReady, presentationPaused, onRetry, canRetry }: { preloadStatus: string; presentationReady: boolean; presentationPaused: boolean; onRetry: () => void; canRetry: boolean }) =>
  <main data-testid="loading" data-status={preloadStatus} data-started={presentationReady} data-paused={presentationPaused}><img src="/own.png" alt="" />Loading{preloadStatus === "error" || preloadStatus === "timeout" ? canRetry ? <button onClick={onRetry}>Retry resources</button> : <p>Ended</p> : null}</main> }));
vi.mock("../../screens/InitialExperience", () => ({ InitialExperienceScreen: ({ preparationStatus, onEnterCover, onLocaleChange, onRetryPreparation, canRetryPreparation }: { preparationStatus: string; onEnterCover: () => Promise<void>; onLocaleChange: (locale: "es" | "en") => void; onRetryPreparation: () => void; canRetryPreparation: boolean }) =>
  <main data-testid="initial" data-status={preparationStatus}><button disabled={preparationStatus !== "ready"} onClick={() => { void onEnterCover().catch(() => undefined); }}>Start</button><button onClick={() => onLocaleChange("en")}>English</button>{preparationStatus === "error" && canRetryPreparation ? <button onClick={onRetryPreparation}>Retry resources</button> : null}</main> }));

const ready: PreloadSummary = { status: "ready", total: 1, completed: 1, loaded: 1, decoded: 1, failed: 0, timedOut: 0, aborted: 0, skipped: 0, progress: 1, results: [] };
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>((done) => { resolve = done; }); return { promise, resolve }; }
function Path() { return <output data-testid="path">{useLocation().pathname}</output>; }
function mount(path = "/") {
  const router = createMemoryRouter([{ path: "*", element: <><EntryPreparationHost /><Path /></> }], { initialEntries: [path] });
  return { ...render(<RouterProvider router={router} />), router };
}
async function advance(ms: number) { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); }
async function flush() { await advance(0); }
let hidden = false, reduced = false, coverComplete = true;
let fontEvents: EventTarget;
beforeEach(() => {
  vi.useFakeTimers(); localStorage.clear(); sessionStorage.clear(); invalidateJourneyEssential();
  setJourneyRuntimeContext({ active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false });
  hidden = false; reduced = false; coverComplete = true;
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => hidden ? "hidden" : "visible" });
  vi.stubGlobal("matchMedia", () => ({ get matches() { return reduced; }, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => setTimeout(() => callback(performance.now()), 16));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ x:0,y:0,width:390,height:844,top:0,left:0,right:390,bottom:844,toJSON:()=>({}) });
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockImplementation(function(this: HTMLImageElement) { return !this.src.endsWith("/cover.png") || coverComplete; });
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockImplementation(function(this: HTMLImageElement) { return this.complete ? 640 : 0; });
  vi.spyOn(HTMLImageElement.prototype, "naturalHeight", "get").mockImplementation(function(this: HTMLImageElement) { return this.complete ? 640 : 0; });
  fontEvents = new EventTarget();
  Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve(), load: vi.fn(() => Promise.resolve([])), check: () => true, [Symbol.iterator]: () => [][Symbol.iterator](), addEventListener: fontEvents.addEventListener.bind(fontEvents), removeEventListener: fontEvents.removeEventListener.bind(fontEvents) } });
  preload.mockReset(); preload.mockResolvedValue(ready); coverMount.mockClear(); coverUnmount.mockClear(); coverActivity.mockClear();
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); Reflect.deleteProperty(document, "fonts"); Reflect.deleteProperty(document, "visibilityState"); });

describe("OBS04 single entry host", () => {
  it("prioritizes own resources, then mounts one inactive Cover and retains it through the 6s minimum, /inicio and Start", async () => {
    const own = deferred<PreloadSummary>(); preload.mockReturnValueOnce(own.promise);
    mount(); await flush();
    expect(preload.mock.calls[0][0]).toEqual(["/own.png"]);
    expect(screen.queryByTestId("cover-tree")).toBeNull(); expect(coverActivity).not.toHaveBeenCalled();
    await act(async () => own.resolve(ready)); await advance(100);
    const cover = screen.getByTestId("cover-tree");
    expect(preload.mock.calls[1][0]).toEqual(["/cover.png"]);
    expect((preload.mock.calls[1][1] as PreloadImagesOptions).deadlineAt).toBe((preload.mock.calls[0][1] as PreloadImagesOptions).deadlineAt);
    expect(screen.getByTestId("loading")).toHaveAttribute("data-started", "true");
    expect(coverActivity).not.toHaveBeenCalled();
    await advance(5900); expect(screen.getByTestId("path")).toHaveTextContent(/^\/$/);
    await advance(150); expect(screen.getByTestId("path")).toHaveTextContent("/inicio");
    expect(screen.queryByTestId("loading")).toBeNull();
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Start" })); await flush();
    expect(screen.getByTestId("path")).toHaveTextContent("/portada"); expect(screen.getByTestId("cover-tree")).toBe(cover);
    expect(coverMount).toHaveBeenCalledTimes(1); expect(coverUnmount).not.toHaveBeenCalled(); expect(coverActivity).toHaveBeenCalledTimes(1);
    expect(preload).toHaveBeenCalledTimes(2); expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("uses the 1200ms reduced static minimum and pauses only visible presentation while hidden", async () => {
    reduced = true; mount(); await flush(); await advance(100);
    hidden = true; act(() => document.dispatchEvent(new Event("visibilitychange"))); await advance(5000);
    expect(screen.getByTestId("path")).toHaveTextContent(/^\/$/); expect(screen.getByTestId("loading")).toHaveAttribute("data-paused", "true");
    hidden = false; act(() => document.dispatchEvent(new Event("visibilitychange"))); await advance(1000);
    expect(screen.getByTestId("path")).toHaveTextContent(/^\/$/);
    await advance(300); expect(screen.getByTestId("path")).toHaveTextContent("/inicio");
    expect(preload).toHaveBeenCalledTimes(2); expect(coverActivity).not.toHaveBeenCalled();
  });
  it("includes actual mounted Cover image proof inside the original deadline and ignores its late load after timeout", async () => {
    coverComplete = false; mount(); await advance(100);
    const image = screen.getByTestId("cover-tree").querySelector("img")!;
    await advance(14900);
    expect(screen.getByTestId("loading")).toHaveAttribute("data-status", "timeout");
    expect(screen.getByRole("button", { name: "Retry resources" })).toBeEnabled();
    coverComplete = true; fireEvent.load(image); await advance(1000);
    expect(screen.getByTestId("path")).toHaveTextContent(/^\/$/); expect(coverActivity).not.toHaveBeenCalled();
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("keeps a completed presentation on resource retry without remounting its prepared Cover", async () => {
    coverComplete = false; mount(); await flush(); await advance(100); await advance(14900);
    const cover = screen.getByTestId("cover-tree");
    // The visible presentation ended while Cover's actual IMG was still pending.
    expect(document.querySelector("[data-entry-presentation]")).toHaveAttribute("data-entry-presentation", "complete");
    coverComplete = true; fireEvent.click(screen.getByRole("button", { name: "Retry resources" })); await flush(); await advance(100);
    expect(screen.getByTestId("path")).toHaveTextContent("/inicio"); expect(screen.getByTestId("cover-tree")).toBe(cover);
    expect(coverMount).toHaveBeenCalledTimes(1); expect(preload).toHaveBeenCalledTimes(4); expect(coverActivity).not.toHaveBeenCalled();
  });
  it("rechecks changed fonts before Start and reports a finite local error when cached frame proof cannot finish", async () => {
    mount("/inicio"); await flush(); await advance(100);
    expect(screen.getByTestId("loading")).toHaveAttribute("data-started", "true");
    expect(screen.queryByTestId("initial")).toBeNull();
    await advance(5900);
    expect(screen.queryByTestId("initial")).toBeNull();
    await advance(200);
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
    expect(screen.getByTestId("path")).toHaveTextContent("/inicio");
    expect(screen.queryByTestId("loading")).toBeNull();
    expect(coverMount).toHaveBeenCalledTimes(1);
    vi.stubGlobal("requestAnimationFrame", () => 987);
    act(() => fontEvents.dispatchEvent(new Event("loadingdone"))); await flush();
    expect(screen.getByRole("button", { name: "Start" })).toBeDisabled();
    await advance(3000);
    expect(screen.getByTestId("initial")).toHaveAttribute("data-status", "error");
    expect(screen.getByRole("button", { name: "Retry resources" })).toBeEnabled(); expect(coverActivity).not.toHaveBeenCalled();
  });
  it("ignores unrelated storage keys but invalidates entry on journey reset without reviving a stale proof", async () => {
    mount("/inicio"); await flush(); await advance(100); await advance(12200);
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "unrelated.preference" })));
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled(); expect(preload).toHaveBeenCalledTimes(2);
    act(() => window.dispatchEvent(new Event("gvo:journey-reset-start"))); await advance(100);
    expect(screen.getByRole("button", { name: "Start" })).toBeDisabled(); expect(screen.getByTestId("initial")).toHaveAttribute("data-status", "error");
    expect(coverActivity).not.toHaveBeenCalled(); expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
});
