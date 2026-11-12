import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ESSENTIAL_STORAGE_KEY, invalidateJourneyEssential, readEssentialSnapshot } from "../../app/journey/journeyEssential";
import { preloadImages, type PreloadImagesOptions, type PreloadSummary } from "../../shared/assets/assetPreloader";
import { getBundleSources, screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { World1RootScreen } from "./World1RootScreen";
import { renderJourneyRoom, seedEssentialRoom, setMotionPreference, settleRoom } from "./obs03TestFixture";

// Exercise the real hook and screen. Only the underlying resource result is
// controlled: the first initial-bundle request fails, subsequent requests work.
vi.mock("../../shared/assets/assetPreloader", async (original) => ({
  ...await original<typeof import("../../shared/assets/assetPreloader")>(),
  preloadImages: vi.fn(),
}));
vi.mock("../../app/qr/InterstationQrGate", () => ({ InterstationQrGate: () => <span>unexpected-QR</span> }));

beforeEach(() => {
  localStorage.clear(); invalidateJourneyEssential(); vi.useFakeTimers(); setMotionPreference(true);
});

it.each(["error", "timeout"] as const)("R4 restored Relation: an initial-bundle %s remains locally recoverable", async (failure) => {
  seedEssentialRoom(1, ["intro"]);
  const initialSources = JSON.stringify(getBundleSources(screenAssetBundles.world1RootInitial));
  let initialCalls = 0;
  vi.mocked(preloadImages).mockImplementation(async (sources: readonly string[]): Promise<PreloadSummary> => {
    const fail = JSON.stringify(sources) === initialSources && ++initialCalls === 1;
    return resourceSummary(sources, fail ? failure : "ready");
  });
  renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
  const before = structuredClone(readEssentialSnapshot()!.stations[1]);
  const globalBefore = localStorage.getItem("gvo.progress.v1");
  expect(before.confirmedStepIds).toEqual(["intro"]);
  const unavailableContinue = screen.queryByRole("button", { name: "Continuar" });
  if (unavailableContinue) expect(unavailableContinue).toBeDisabled();
  expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await settleRoom();
  expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  expect(readEssentialSnapshot()!.stations[1]).toMatchObject({ confirmedStepIds: before.confirmedStepIds, closed: false });
  expect(readEssentialSnapshot()!.stations[1].presentedStepIds).toContain("relacion");
  expect(localStorage.getItem("gvo.progress.v1")).toBe(globalBefore);
  expect(screen.queryByText("unexpected-QR")).toBeNull();
});

function resourceSummary(sources: readonly string[], status: "ready" | "error" | "timeout"): PreloadSummary {
  const total = sources.length, failed = status === "error" ? 1 : 0, timedOut = status === "timeout" ? 1 : 0;
  const loaded = total - failed - timedOut;
  return { status, total, completed: total, loaded, decoded: loaded, failed, timedOut, aborted: 0, progress: total ? loaded / total : 1, skipped: 0,
    results: sources.map((src, index) => ({ src, status: index === 0 && status !== "ready" ? status === "timeout" ? "timeout" : "failed" : "decoded", ok: index !== 0 || status === "ready", decoded: index !== 0 || status === "ready", durationMs: 1 })) };
}

it("R4 EN pending resources stay unconfirmed and expose localized functional status", async () => {
  localStorage.setItem("gvo.language.v1", "en");
  vi.mocked(preloadImages).mockImplementation(() => new Promise<PreloadSummary>(() => {}));
  const { container } = renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
  expect(screen.getByRole("status")).toHaveTextContent("Preparing Root...");
  expect(container.querySelector(".world1-root-nodes")).toHaveAttribute("aria-label", "Room I concept nodes");
  expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  expect(readEssentialSnapshot()!.stations[1]).toMatchObject({ presentedStepIds: [], confirmedStepIds: [], closed: false });
  expect(screen.queryByText("unexpected-QR")).toBeNull();
});

it("R4 EN unverified saved progress uses localized recovery copy and preserves its bytes", async () => {
  localStorage.setItem("gvo.language.v1", "en");
  localStorage.setItem(ESSENTIAL_STORAGE_KEY, "{broken"); invalidateJourneyEssential();
  vi.mocked(preloadImages).mockImplementation(async (sources: readonly string[]) => resourceSummary(sources, "ready"));
  renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
  expect(screen.getByText("It was not possible to recover your saved progress in this room.")).toBeVisible();
  expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe("{broken");
  expect(screen.queryByText("unexpected-QR")).toBeNull();
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.mocked(preloadImages).mockReset(); });

it("R4 initial-bundle recovery: Retry restores the actual introduction without confirming it", async () => {
  const initialSources = JSON.stringify(getBundleSources(screenAssetBundles.world1RootInitial));
  let initialCalls = 0;
  vi.mocked(preloadImages).mockImplementation(async (sources: readonly string[], options: PreloadImagesOptions = {}): Promise<PreloadSummary> => {
    const fail = JSON.stringify(sources) === initialSources && ++initialCalls === 1;
    const total = sources.length, failed = fail ? 1 : 0, loaded = total - failed;
    return { status: options.signal?.aborted ? "aborted" : fail ? "error" : "ready", total, completed: total, loaded, decoded: loaded, failed, timedOut: 0, aborted: 0, progress: total ? loaded / total : 1, skipped: 0,
      results: sources.map((src, index) => ({ src, status: fail && index === 0 ? "failed" : "decoded", ok: !fail || index !== 0, decoded: !fail || index !== 0, durationMs: 1 })) };
  });
  renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
  expect(screen.getByRole("button", { name: "Reintentar" })).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
  expect(readEssentialSnapshot()!.stations[1].presentedStepIds).toEqual([]);
  const progressBefore = localStorage.getItem("gvo.progress.v1");
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await settleRoom();
  expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
  expect(readEssentialSnapshot()!.stations[1]).toMatchObject({ presentedStepIds: ["intro"], confirmedStepIds: [], closed: false });
  expect(localStorage.getItem("gvo.progress.v1")).toBe(progressBefore);
  expect(screen.queryByText("unexpected-QR")).toBeNull();
});
