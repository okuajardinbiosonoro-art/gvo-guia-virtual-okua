import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PreloadImagesOptions, PreloadSummary } from "../../shared/assets/assetPreloader";
import * as progressStorage from "../../domain/progress/progress.storage";
import { interstationQrContracts } from "../qr/interstationQr";
import { JourneyPreparation } from "./JourneyPreparation";
import { useJourneyActivity } from "./JourneyActivation";
import * as essential from "./journeyEssential";
import * as access from "./journeyAccess";
import { createFinalReviewContext } from "../review/finalReviewContext";
import { acceptJourneyIntent, receiptStartedAt } from "./journeyIntent";

const { images, manifest } = vi.hoisted(() => ({ images: vi.fn(), manifest: vi.fn() }));
vi.mock("../../shared/assets/assetPreloader", () => ({ preloadImages: images }));
vi.mock("../routeModules", () => ({ routeModuleForDestination: () => null, preloadJourneyRouteModule: () => Promise.resolve() }));
vi.mock("./journeyResources", () => ({ getJourneyResourceManifest: manifest, getTransitionResourceSources: () => [] }));
// Entry has its own real-host suite. Keep this suite isolated to route preparation.
vi.mock("./EntryPreparationHost", () => ({ EntryPreparationHost: () => null }));
// Authorization is a separate root-owned boundary. These tests exercise the real
// preparation/provider/store lifecycle, assuming authorization already validated.
vi.mock("./journeyAccess", async () => {
  const actual = await vi.importActual<typeof import("./journeyEssential")>("./journeyEssential");
  return { resolveJourneyAccess: (route: string) => ({ active: false, attemptId: null,
    screen: route === "/estacion/2" ? 2 : 1, mode: "normal", reviewReturnAllowed: false,
    authorized: route !== "/estacion/2" || Boolean(actual.readEssentialSnapshot()?.pendingTransition) || actual.coherentProgressPrefixLength() >= 1,
  }) };
});
vi.mock("../../screens/TransitionWorld/TransitionWorld", () => ({
  TransitionWorld: ({ preloadStatus, onRetry, onBack, canRetry, onComplete, shellAssetsReady, attemptId }: { preloadStatus: string; onRetry?: () => void; onBack?: () => void; canRetry?: boolean; onComplete?: () => void; shellAssetsReady?: boolean; attemptId?: string }) => {
    useEffect(() => { if (!shellAssetsReady) return; const media = matchMedia("(prefers-reduced-motion: reduce)"); const timer = setTimeout(() => onComplete?.(), media.matches ? 1000 : 2300); return () => clearTimeout(timer); }, [shellAssetsReady, attemptId]);
    return <section data-testid="transition-curtain" data-status={preloadStatus}>{preloadStatus}{preloadStatus !== "loading" ? <>{canRetry && onRetry ? <button onClick={onRetry}>Reintentar</button> : null}{onBack ? <button onClick={onBack}>Volver</button> : null}</> : null}</section>;
  },
}));

const ready: PreloadSummary = { status: "ready", total: 1, completed: 1, loaded: 1, decoded: 1, failed: 0, timedOut: 0, aborted: 0, skipped: 0, progress: 1, results: [] };
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => { resolve = complete; });
  return { promise, resolve };
}
let mounted = 0, unmounted = 0;
let semanticEvents: string[] = [];
let throwOnRender = false;
let destinationImageSource: string | null = null;
let destinationImageSources: string[] = [];
let onDestinationLayout: ((element: HTMLElement) => void) | null = null;
let failMountedDestination: (() => void) | null = null;
function Probe({ room = 1 }: { room?: 1 | 2 }) {
  const { active, attemptId } = useJourneyActivity();
  const element = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);
  useLayoutEffect(() => { if (element.current) onDestinationLayout?.(element.current); });
  useEffect(() => { failMountedDestination = () => setFailed(true); return () => { failMountedDestination = null; }; }, []);
  useEffect(() => { mounted++; return () => { unmounted++; }; }, []);
  useEffect(() => {
    if (!active) return;
    semanticEvents.push(attemptId ?? "missing-attempt");
    void essential.markEssentialPresented({ screen: room, stepId: room === 1 ? "intro" : "planta", contentRevision: "OBS03.2", attemptId, mode: "standard" });
  }, [active, attemptId, room]);
  if (throwOnRender || failed) throw new Error("intentional first-render failure");
  return <main ref={element} data-testid="real-destination" data-active={active}>Real destination{destinationImageSource ? <img data-testid="destination-image" src={destinationImageSource} alt="" /> : null}{destinationImageSources.map((src, index) => <img key={src} data-testid={`destination-image-${index}`} src={src} alt="" />)}</main>;
}
function mount(route = "/estacion/1") {
  const router = createMemoryRouter([{ element: <JourneyPreparation><Outlet /></JourneyPreparation>, children: [
    { path: "/estacion/1", element: <Probe /> },
    { path: "/estacion/2", element: <Probe room={2} /> },
  ] }], { initialEntries: [route] });
  return { ...render(<RouterProvider router={router} />), router };
}
async function flush() { await act(async () => { await vi.advanceTimersByTimeAsync(0); }); }
async function advance(ms: number) { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); }
function resize(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
  window.dispatchEvent(new Event("resize"));
}
function seedPending() {
  const snapshot = structuredClone(essential.readEssentialSnapshot()!);
  Object.assign(snapshot.cover, { presentedStepIds: [...essential.essentialSteps.cover], confirmedStepIds: [...essential.essentialSteps.cover], activeStepId: null, closed: true });
  const room = snapshot.stations[1];
  room.presentedStepIds = [...essential.essentialSteps[1]];
  room.confirmedStepIds = [...essential.essentialSteps[1]];
  room.activeStepId = null; room.closed = true;
  localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot));
  essential.invalidateJourneyEssential();
  const receipt: essential.JourneyReceipt = { transactionId: crypto.randomUUID(), from: 1, to: "/estacion/2", kind: "qr", acceptedAuthorizationKind: "normal", canonicalPayload: interstationQrContracts[1].payload, essentialRevision: snapshot.revision, phase: "pending" };
  expect(essential.persistJourneyReceipt(receipt, essential.captureJourneyMutationToken()).ok).toBe(true);
  return receipt;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  localStorage.clear(); sessionStorage.clear();
  essential.invalidateJourneyEssential();
  essential.setJourneyRuntimeContext({ active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false });
  mounted = 0; unmounted = 0; semanticEvents = []; throwOnRender = false; destinationImageSource = null; destinationImageSources = []; onDestinationLayout = null; failMountedDestination = null;
  resize(390, 844);
  const face: { family: string; status: string; load: () => Promise<unknown> } = { family: "Pixelify Sans Variable", status: "loaded", load: () => Promise.resolve() };
  face.load = () => Promise.resolve(face);
  Object.defineProperty(document, "fonts", { configurable: true, value: {
    ready: Promise.resolve(), load: vi.fn(() => Promise.resolve([face])), check: () => true,
    [Symbol.iterator]: () => [face][Symbol.iterator](),
  } });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ x: 0, y: 0, top: 0, left: 0, right: 390, bottom: 844, width: 390, height: 844, toJSON: () => ({}) });
  images.mockReset(); images.mockResolvedValue(ready);
  manifest.mockReset(); manifest.mockImplementation(({ route, locale, orientation }: { route: string; locale: string; orientation: string }) => ({ route, images: ["/critical.png"], contextKey: JSON.stringify({ route, locale, orientation }) }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); Reflect.deleteProperty(document, "fonts"); });

describe("JourneyPreparation independent lifecycle regression", () => {
  it("waits for the mounted DOM image load and decode within the same preparation budget", async () => {
    destinationImageSource = "/critical.png";
    let complete = false;
    const decoding = deferred<void>(), decode = vi.fn(() => decoding.promise);
    onDestinationLayout = (element) => {
      const image = element.querySelector<HTMLImageElement>("img")!;
      Object.defineProperties(image, {
        complete: { configurable: true, get: () => complete },
        naturalWidth: { configurable: true, get: () => complete ? 640 : 0 },
        naturalHeight: { configurable: true, get: () => complete ? 640 : 0 },
        decode: { configurable: true, value: decode },
      });
    };
    mount(); await flush();
    const tree = screen.getByTestId("real-destination"), image = screen.getByTestId("destination-image");
    const originalBudget = (images.mock.calls[0][1] as PreloadImagesOptions).deadlineAt;
    await advance(1000);
    expect(tree).toHaveAttribute("data-active", "false");
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
    expect(semanticEvents).toEqual([]);
    complete = true; fireEvent.load(image); await flush();
    expect(decode).toHaveBeenCalledTimes(1);
    await advance(1000);
    expect(tree).toHaveAttribute("data-active", "false");
    expect(semanticEvents).toEqual([]);
    await act(async () => decoding.resolve()); await advance(100);
    expect(screen.getByTestId("real-destination")).toBe(tree);
    expect(tree).toHaveAttribute("data-active", "true");
    expect((images.mock.calls[0][1] as PreloadImagesOptions).deadlineAt).toBe(originalBudget);
    expect(images).toHaveBeenCalledTimes(1);
    expect(mounted).toBe(1); expect(unmounted).toBe(0);
    expect(semanticEvents).toHaveLength(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });

  it("loads resources before first mount and activates the exact same real tree without remount", async () => {
    const loading = deferred<PreloadSummary>(); images.mockReturnValue(loading.promise);
    const { container } = mount(); await flush();
    expect(images).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(mounted).toBe(0); expect(semanticEvents).toEqual([]);
    await act(async () => loading.resolve(ready));
    const tree = screen.getByTestId("real-destination");
    expect(tree).toHaveAttribute("data-active", "false");
    expect(container.querySelector(".gvo-prepared-tree")).toHaveAttribute("inert");
    expect(semanticEvents).toEqual([]);
    await advance(100);
    expect(screen.getByTestId("real-destination")).toBe(tree);
    expect(tree).toHaveAttribute("data-active", "true");
    expect(mounted).toBe(1); expect(unmounted).toBe(0);
    expect(semanticEvents).toHaveLength(1);
    expect(essential.readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual(["intro"]);
  });

  it.each(["error", "timeout"] as const)("%s never mounts or grants semantic/global progress", async (status) => {
    images.mockResolvedValue({ ...ready, status, loaded: 0, decoded: 0, failed: status === "error" ? 1 : 0, timedOut: status === "timeout" ? 1 : 0, progress: 0 });
    mount(); await flush();
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(mounted).toBe(0); expect(semanticEvents).toEqual([]);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(essential.readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual([]);
  });

  it("a hung resource reaches the shared deadline with finite recovery and no target mount", async () => {
    images.mockReturnValue(new Promise<PreloadSummary>(() => undefined));
    mount(); await flush();
    const options = images.mock.calls[0][1] as PreloadImagesOptions;
    await advance(15000);
    expect(options.signal?.aborted).toBe(true);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Volver" })).toBeEnabled();
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(semanticEvents).toEqual([]);
  });

  it("orientation keeps the absolute budget even after a manual retry; retry alone renews it", async () => {
    images.mockImplementation(() => new Promise<PreloadSummary>(() => undefined));
    mount(); await flush();
    const first = images.mock.calls[0][1] as PreloadImagesOptions;
    await advance(5000);
    act(() => resize(844, 390)); await flush();
    const rotated = images.mock.calls.at(-1)![1] as PreloadImagesOptions;
    expect(first.signal?.aborted).toBe(true);
    expect(rotated.deadlineAt).toBe(first.deadlineAt);
    await advance(10000);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await flush();
    const retried = images.mock.calls.at(-1)![1] as PreloadImagesOptions;
    expect(retried.deadlineAt).toBeGreaterThan(first.deadlineAt!);
    await advance(1000);
    act(() => resize(390, 844)); await flush();
    expect((images.mock.calls.at(-1)![1] as PreloadImagesOptions).deadlineAt).toBe(retried.deadlineAt);
    expect(semanticEvents).toEqual([]);
  });

  it("a first-render exception remains covered and recoverable without semantic effects", async () => {
    throwOnRender = true;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mount(); await flush(); await advance(100);
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(semanticEvents).toEqual([]); expect(mounted).toBe(0);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(consoleError).toHaveBeenCalled();
  });

  it("an indeterminate commit keeps the actual credit, stays covered and reconciles without another global write", async () => {
    // JSDOM does not provide this browser API. Use normal motion so the real
    // nominal-transition delay runs before the indeterminate write is exercised.
    const matchMedia = vi.fn((media: string): MediaQueryList => ({
      matches: false, media, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    }));
    vi.stubGlobal("matchMedia", matchMedia);
    seedPending();
    const original = progressStorage.markStationCompleted;
    const commit = vi.spyOn(progressStorage, "markStationCompleted").mockImplementation((id) => {
      expect(original(id).ok).toBe(true);
      return { ok: false, reason: "verification_failed" };
    });
    mount("/estacion/2"); await flush(); await advance(2500);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(commit).toHaveBeenCalledTimes(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([1]);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("commit_verification_pending");
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(semanticEvents).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await flush(); await advance(100);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    await advance(2400);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    expect(commit).toHaveBeenCalledTimes(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([1]);
  });

  it("late resources after reset cannot recreate the old receipt, credit or semantic effects", async () => {
    seedPending();
    const loading = deferred<PreloadSummary>(); images.mockReturnValue(loading.promise);
    mount("/estacion/2"); await flush();
    const options = images.mock.calls[0][1] as PreloadImagesOptions;
    act(() => { localStorage.clear(); essential.invalidateJourneyEssential(); window.dispatchEvent(new Event("gvo:journey-reset")); });
    await flush();
    expect(options.signal?.aborted).toBe(true);
    await act(async () => loading.resolve(ready)); await advance(20000);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toBeNull();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(semanticEvents).toEqual([]);
    expect(screen.queryByTestId("real-destination")).toBeNull();
  });

  it("revalidates an invalid receipt even when route access is independently allowed", async () => {
    seedPending();
    const malformed = structuredClone(essential.readEssentialSnapshot()!);
    malformed.pendingTransition!.canonicalPayload = "wrong";
    const read = vi.spyOn(essential, "readEssentialSnapshot").mockReturnValue(malformed);
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    mount("/estacion/2"); await flush(); await advance(2500);
    expect(commit).not.toHaveBeenCalled();
    expect(semanticEvents).toEqual([]);
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    read.mockRestore();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });

  it.each(["phase exceeds deadline", "nominal returns expired"] as const)("%s never starts a new global write", async (scenario) => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    const original = essential.persistJourneyReceipt;
    let clock = 14999;
    mount("/estacion/2"); await flush(); await advance(100);
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    vi.spyOn(essential, "persistJourneyReceipt").mockImplementation((receipt, token) => {
      const result = original(receipt, token);
      if (receipt?.phase === "commit_verification_pending" && scenario === "phase exceeds deadline") clock = 15001;
      return result;
    });
    if (scenario === "nominal returns expired") clock = 15001;
    await advance(2500);
    expect(commit).not.toHaveBeenCalled();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(semanticEvents).toEqual([]);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe(scenario === "phase exceeds deadline" ? "commit_verification_pending" : "pending");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
  });

  it("a write started within deadline may finish late; recovery keeps its bit without another write", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    const original = progressStorage.markStationCompleted;
    let clock = 14999;
    const commit = vi.spyOn(progressStorage, "markStationCompleted").mockImplementation((id) => {
      expect(performance.now()).toBeLessThan(15000);
      const result = original(id); clock = 15001; return result;
    });
    mount("/estacion/2"); await flush(); await advance(100);
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    await advance(2500);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([1]);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("committed_pending_reveal");
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(semanticEvents).toEqual([]);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await flush(); await advance(100);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    await advance(2400);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it("an activation frame queued before reset cannot clean up or re-create the old receipt afterward", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    const persist = vi.spyOn(essential, "persistJourneyReceipt");
    mount("/estacion/2"); await flush(); await advance(2300);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("committed_pending_reveal");
    const beforeResetWrites = persist.mock.calls.length;
    const beforeResetEvents = semanticEvents.length;
    act(() => {
      const serial = essential.beginJourneyReset();
      localStorage.clear(); essential.finishJourneyReset(serial);
    });
    await flush(); await advance(100);
    expect(persist).toHaveBeenCalledTimes(beforeResetWrites);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toBeNull();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(semanticEvents).toHaveLength(beforeResetEvents);
  });

  it("a validated read-only review transition prepares its target without granting another bit or presentation", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2, 3, 4, 5], updatedAt: null })); essential.invalidateJourneyEssential();
    const receipt = { ...seedPending(), kind: "review_navigation" as const, acceptedAuthorizationKind: "legacy_review_compatible" as const, reviewContext: createFinalReviewContext(1) };
    expect(essential.persistJourneyReceipt(receipt, essential.captureJourneyMutationToken()).ok).toBe(true);
    vi.spyOn(access, "resolveJourneyAccess").mockReturnValue({ active: false, attemptId: null, screen: 2, mode: "legacy_review_compatible", authorized: true, reviewReturnAllowed: true });
    const targetBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]);
    const routeBefore = localStorage.getItem("gvo.progress.v1");
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    mount("/estacion/2"); await flush(); await advance(2500);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    expect(commit).not.toHaveBeenCalled();
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(targetBefore);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(routeBefore);
    expect(essential.readEssentialSnapshot()?.finalReached).toBe(false);
  });

  it("persisted receipt changes after the phase write prevent credit even without a storage event", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    const original = essential.persistJourneyReceipt;
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    let changedRaw = "";
    vi.spyOn(essential, "persistJourneyReceipt").mockImplementation((receipt, token) => {
      const result = original(receipt, token);
      if (receipt?.phase === "commit_verification_pending") {
        const changed = JSON.parse(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)!);
        changed.pendingTransition.canonicalPayload = "changed-after-phase";
        changedRaw = JSON.stringify(changed);
        localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, changedRaw);
      }
      return result;
    });
    mount("/estacion/2"); await flush(); await advance(2500);
    expect(commit).not.toHaveBeenCalled();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBe(changedRaw);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(semanticEvents).toEqual([]);
  });

  it("a delayed activation commit never publishes active to the child after its deadline", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    let clock = 14999, delayed = false;
    onDestinationLayout = (element) => {
      // React runs child layout effects before the activity provider's layout
      // gate. Model time spent committing the first candidate reveal.
      if (element.closest(".gvo-prepared-tree")?.getAttribute("data-journey-active") === "true") { clock = 15001; delayed = true; }
    };
    mount("/estacion/2"); await flush(); await advance(100);
    vi.spyOn(performance, "now").mockImplementation(() => clock);
    await advance(2500);
    expect(delayed).toBe(true);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([1]);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("committed_pending_reveal");
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(essential.getJourneyRuntimeContext().active).toBe(false);
    expect(semanticEvents).toEqual([]);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
  });

  it("a render error during nominal wait aborts that attempt instead of granting credit or ready", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    seedPending();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    mount("/estacion/2"); await flush(); await advance(100);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(failMountedDestination).not.toBeNull();
    act(() => failMountedDestination?.());
    await advance(2500);
    expect(commit).not.toHaveBeenCalled();
    expect(screen.queryByTestId("real-destination")).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("pending");
    expect(semanticEvents).toEqual([]);
  });

  it("orientation after a delivered tree and twenty seconds gets a new budget without remount or duplicate facts", async () => {
    mount(); await flush(); await advance(100);
    const tree = screen.getByTestId("real-destination");
    expect(tree).toHaveAttribute("data-active", "true");
    const first = images.mock.calls[0][1] as PreloadImagesOptions;
    await advance(20000);
    act(() => resize(844, 390)); await flush();
    const adapted = images.mock.calls.at(-1)![1] as PreloadImagesOptions;
    expect(adapted.deadlineAt).toBeGreaterThan(first.deadlineAt!);
    expect(tree).toHaveAttribute("data-active", "false");
    await advance(100);
    expect(screen.getByTestId("real-destination")).toBe(tree);
    expect(tree).toHaveAttribute("data-active", "true");
    expect(mounted).toBe(1); expect(unmounted).toBe(0);
    expect(essential.readEssentialSnapshot()?.stations[1].presentedStepIds).toEqual(["intro"]);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });
});

describe("R4 absolute deadline identity", () => {
  function controlledClock() {
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    return { now: () => now, tick: async (ms: number) => { now += ms; await advance(ms); } };
  }

  function seedClosedCoverBeforeMount() {
    const snapshot = structuredClone(essential.readEssentialSnapshot()!);
    Object.assign(snapshot.cover, { presentedStepIds: [...essential.essentialSteps.cover], confirmedStepIds: [...essential.essentialSteps.cover], activeStepId: null, closed: true });
    localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot));
    essential.invalidateJourneyEssential();
  }

  async function acceptFromDeliveredOrigin() {
    const context = essential.getJourneyRuntimeContext();
    expect(context).toMatchObject({ active: true, screen: 1, authorized: true });
    const acceptedAt = performance.now();
    await act(async () => {
      for (const stepId of essential.essentialSteps[1]) {
        expect((await essential.markEssentialPresented({ screen: 1, stepId, contentRevision: "OBS03.2", attemptId: context.attemptId, mode: "standard" })).ok).toBe(true);
        const last = stepId === essential.essentialSteps[1].at(-1);
        const result = last
          ? await essential.closeEssentialRoom({ screen: 1, contentRevision: "OBS03.2", attemptId: context.attemptId, cause: "visitor_close" })
          : await essential.confirmEssentialStep({ screen: 1, stepId, contentRevision: "OBS03.2", attemptId: context.attemptId, cause: "visitor_advance" });
        expect(result.ok).toBe(true);
      }
      expect(acceptJourneyIntent({ from: 1, to: "/estacion/2", kind: "qr", canonicalPayload: interstationQrContracts[1].payload, attemptId: context.attemptId })).toBe(true);
    });
    const receipt = essential.readEssentialSnapshot()?.pendingTransition;
    expect(receipt).not.toBeNull();
    if (!receipt) throw new Error("A valid accepted transition receipt must exist");
    expect(receiptStartedAt(receipt.transactionId)).toBe(acceptedAt);
    return { receipt, acceptedAt };
  }

  beforeEach(() => { vi.stubGlobal("matchMedia", () => ({ matches: false })); });

  it("new transition retains its acceptance deadline after leaving an already delivered origin", async () => {
    const clock = controlledClock(); seedClosedCoverBeforeMount();
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    const { router } = mount(); await flush(); await clock.tick(100);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    const originOptions = images.mock.calls[0][1] as PreloadImagesOptions;
    const { receipt, acceptedAt } = await acceptFromDeliveredOrigin();
    const targetBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]), eventsBefore = semanticEvents.length;
    const loading = deferred<PreloadSummary>(); images.mockReturnValue(loading.promise);
    // Time spent in routing/module/transition work belongs to the new receipt,
    // not a fresh window beginning when the destination controller is reached.
    await clock.tick(12_000);
    await act(async () => { await router.navigate("/estacion/2"); }); await flush();
    const destinationOptions = images.mock.calls.at(-1)![1] as PreloadImagesOptions;
    expect(originOptions.signal?.aborted).toBe(true);
    expect(destinationOptions.deadlineAt).toBe(acceptedAt + 15_000);
    expect(destinationOptions.deadlineAt! - clock.now()).toBe(3000);
    await clock.tick(3000);
    expect(destinationOptions.signal?.aborted).toBe(true);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Volver" })).toBeEnabled();
    expect(screen.queryByTestId("real-destination")).toBeNull();
    await act(async () => loading.resolve(ready)); await clock.tick(100);
    expect(commit).not.toHaveBeenCalled();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toMatchObject({ transactionId: receipt.transactionId, phase: "pending" });
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(targetBefore);
    expect(semanticEvents).toHaveLength(eventsBefore);
    expect(screen.queryByTestId("real-destination")).toBeNull();
  });

  it("an already expired new receipt gets no renewed window or credit from the previous delivered tree", async () => {
    const clock = controlledClock(); seedClosedCoverBeforeMount();
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    const { router } = mount(); await flush(); await clock.tick(100);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "true");
    const { receipt, acceptedAt } = await acceptFromDeliveredOrigin();
    const targetBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]), eventsBefore = semanticEvents.length;
    await clock.tick(15_001);
    await act(async () => { await router.navigate("/estacion/2"); }); await flush(); await clock.tick(100);
    for (const call of images.mock.calls.slice(1)) expect((call[1] as PreloadImagesOptions).deadlineAt).toBe(acceptedAt + 15_000);
    expect(commit).not.toHaveBeenCalled();
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toMatchObject({ transactionId: receipt.transactionId, phase: "pending" });
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(targetBefore);
    expect(essential.getJourneyRuntimeContext().active).toBe(false);
    expect(document.querySelector('[data-testid="real-destination"][data-active="true"]')).toBeNull();
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(semanticEvents).toHaveLength(eventsBefore);
  });

  it("orientation after a delivered QR target and receipt cleanup gets a fresh adaptation budget without remount or duplicate credit", async () => {
    const clock = controlledClock(); seedClosedCoverBeforeMount();
    const commit = vi.spyOn(progressStorage, "markStationCompleted");
    const { router } = mount(); await flush(); await clock.tick(100);
    await acceptFromDeliveredOrigin();
    await act(async () => { await router.navigate("/estacion/2"); }); await flush(); await clock.tick(2500);
    const tree = screen.getByTestId("real-destination");
    expect(tree).toHaveAttribute("data-active", "true");
    // Activation publishes at the end of the preceding act. Let the real
    // controller's queued post-activation rAF acknowledge and clear its receipt;
    // never delete it from the fixture to manufacture the adaptation scenario.
    await clock.tick(32);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toBeNull();
    expect(commit).toHaveBeenCalledTimes(1);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([1]);
    const destinationBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]);
    const progressBefore = localStorage.getItem("gvo.progress.v1"), mountsBefore = mounted, unmountsBefore = unmounted;
    const originalDeadline = (images.mock.calls.at(-1)![1] as PreloadImagesOptions).deadlineAt;
    await clock.tick(20_000);
    act(() => resize(844, 390)); await flush();
    const adaptation = images.mock.calls.at(-1)![1] as PreloadImagesOptions;
    expect(adaptation.deadlineAt).toBe(clock.now() + 15_000);
    expect(adaptation.deadlineAt).toBeGreaterThan(originalDeadline!);
    expect(tree).toHaveAttribute("data-active", "false");
    await clock.tick(100);
    expect(screen.getByTestId("real-destination")).toBe(tree);
    expect(tree).toHaveAttribute("data-active", "true");
    expect(mounted).toBe(mountsBefore); expect(unmounted).toBe(unmountsBefore);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(destinationBefore);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(progressBefore);
  });
});

describe("R4 mounted-image decode queue", () => {
  function mountedImageQueue(count = 8) {
    destinationImageSources = Array.from({ length: count }, (_, index) => `/mounted-${index}.png`);
    const currentSources = destinationImageSources.map((src) => new URL(src, window.location.href).href);
    const pending = Array.from({ length: count }, () => deferred<void>());
    let inFlight = 0, maximum = 0;
    const decodes = pending.map((item) => vi.fn(() => {
      inFlight++; maximum = Math.max(maximum, inFlight);
      return item.promise.finally(() => { inFlight--; });
    }));
    const elements: HTMLImageElement[] = [], removals: Array<ReturnType<typeof vi.spyOn>> = [];
    const configured = new WeakSet<HTMLImageElement>();
    onDestinationLayout = (element) => {
      element.querySelectorAll<HTMLImageElement>("img").forEach((image, index) => {
        if (configured.has(image)) return;
        configured.add(image); elements[index] = image;
        Object.defineProperties(image, {
          complete: { configurable: true, value: true },
          naturalWidth: { configurable: true, value: 640 },
          naturalHeight: { configurable: true, value: 640 },
          currentSrc: { configurable: true, get: () => currentSources[index] },
          decode: { configurable: true, value: decodes[index] },
        });
        removals[index] = vi.spyOn(image, "removeEventListener");
      });
    };
    manifest.mockImplementation(({ route, locale, orientation }: { route: string; locale: string; orientation: string }) => ({ route, images: [...destinationImageSources], contextKey: JSON.stringify({ route, locale, orientation }) }));
    return { pending, decodes, elements, removals, calls: () => decodes.reduce((total, decode) => total + decode.mock.calls.length, 0), maximum: () => maximum, inFlight: () => inFlight, changeCurrentSource: (index: number) => { currentSources[index] = new URL("/changed-after-capture.png", window.location.href).href; } };
  }

  it("never starts more than two explicit mounted-IMG decodes and advances the queue only on settlement", async () => {
    const queue = mountedImageQueue();
    mount(); await flush(); await advance(64);
    const tree = screen.getByTestId("real-destination");
    const originalDeadline = (images.mock.calls[0][1] as PreloadImagesOptions).deadlineAt;
    expect(queue.calls()).toBe(2); expect(queue.inFlight()).toBe(2); expect(queue.maximum()).toBe(2);
    expect(tree).toHaveAttribute("data-active", "false"); expect(semanticEvents).toEqual([]);
    await act(async () => queue.pending[0].resolve());
    expect(queue.calls()).toBe(3); expect(queue.inFlight()).toBe(2); expect(queue.decodes[2]).toHaveBeenCalledTimes(1);
    await act(async () => queue.pending[1].resolve());
    expect(queue.calls()).toBe(4); expect(queue.inFlight()).toBe(2);
    await act(async () => { for (const pending of queue.pending.slice(2)) pending.resolve(); }); await advance(100);
    expect(queue.calls()).toBe(8); expect(queue.maximum()).toBe(2); expect(queue.inFlight()).toBe(0);
    for (const decode of queue.decodes) expect(decode).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("real-destination")).toBe(tree); expect(tree).toHaveAttribute("data-active", "true");
    expect(images).toHaveBeenCalledTimes(1); expect((images.mock.calls[0][1] as PreloadImagesOptions).deadlineAt).toBe(originalDeadline);
    expect(essential.readEssentialSnapshot()?.stations[1]).toMatchObject({ presentedStepIds: ["intro"], confirmedStepIds: [], closed: false });
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });

  it("deadline abort stops queued decodes, removes listeners and ignores late native decode settlements", async () => {
    let now = 0; vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.stubGlobal("matchMedia", () => ({ matches: false })); seedPending();
    const queue = mountedImageQueue(), commit = vi.spyOn(progressStorage, "markStationCompleted");
    const targetBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]);
    mount("/estacion/2"); await flush(); now = 64; await advance(64);
    const options = images.mock.calls[0][1] as PreloadImagesOptions;
    expect(queue.calls()).toBe(2); expect(options.deadlineAt).toBe(15_000);
    now = 15_000; await advance(14_936);
    expect(options.signal?.aborted).toBe(true);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    expect(queue.calls()).toBe(2);
    for (const remove of queue.removals.slice(0, 2)) {
      expect(remove.mock.calls.some((call: unknown[]) => call[0] === "load")).toBe(true);
      expect(remove.mock.calls.some((call: unknown[]) => call[0] === "error")).toBe(true);
    }
    for (const image of queue.elements) fireEvent.load(image);
    await act(async () => { for (const pending of queue.pending) pending.resolve(); }); now = 15_100; await advance(100);
    expect(queue.calls()).toBe(2); expect(queue.maximum()).toBe(2); expect(queue.inFlight()).toBe(0);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(targetBefore);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("pending");
    expect(commit).not.toHaveBeenCalled(); expect(semanticEvents).toEqual([]);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });

  it("rejects a queued IMG whose captured currentSrc changes before its decode slot opens", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false })); seedPending();
    const queue = mountedImageQueue(), commit = vi.spyOn(progressStorage, "markStationCompleted");
    const targetBefore = structuredClone(essential.readEssentialSnapshot()!.stations[2]);
    mount("/estacion/2"); await flush(); await advance(64);
    expect(queue.calls()).toBe(2);
    queue.changeCurrentSource(2);
    await act(async () => queue.pending[0].resolve()); await advance(64);
    expect(queue.decodes[2]).not.toHaveBeenCalled(); expect(queue.calls()).toBe(2);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
    await act(async () => { for (const pending of queue.pending) pending.resolve(); }); await advance(100);
    expect(queue.calls()).toBe(2); expect(queue.maximum()).toBe(2);
    expect(screen.getByTestId("real-destination")).toHaveAttribute("data-active", "false");
    expect(essential.readEssentialSnapshot()?.stations[2]).toEqual(targetBefore);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.phase).toBe("pending");
    expect(commit).not.toHaveBeenCalled(); expect(semanticEvents).toEqual([]);
    expect(progressStorage.readProgress().progress?.completedStations).toEqual([]);
  });
});
