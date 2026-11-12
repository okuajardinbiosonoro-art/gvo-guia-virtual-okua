import { beforeEach, describe, expect, it, vi } from "vitest";
import { GVO_PROGRESS_STORAGE_KEY } from "../domain/progress/progress.storage";
import { requireFinalAccess, requireQrAccess, requireStationAccess, requireTransitionAccess } from "./router";
import { interstationQrContracts } from "./qr/interstationQr";
import { createFinalReviewContext } from "./review/finalReviewContext";
import * as essential from "./journey/journeyEssential";
import { acceptJourneyIntent } from "./journey/journeyIntent";
import { freshWorld4OrderingState, WORLD4_ORDERING_STORAGE_KEY, WORLD4_ORDERING_TARGET } from "../domain/checkpoints/world4OrderingCheckpoint";
import { freshWorld4ExplanationCheckpoint, WORLD4_EXPLANATION_STORAGE_KEY } from "../domain/checkpoints/world4ExplanationCheckpoint";

function expectReplace(result: Response | null, destination: string) {
  expect(result).toBeInstanceOf(Response);
  expect(result?.status).toBe(302);
  expect(result?.headers.get("Location")).toBe(destination);
  expect(result?.headers.get("X-Remix-Replace")).toBe("true");
}
function seedProgress(completedStations: number[]) {
  localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, completedStations, updatedAt: null }));
  essential.invalidateJourneyEssential();
}
// Synthetic schema-valid durable closures isolate router decisions. The room
// suites exercise actual visitor gestures; no physical completion is claimed.
function closeEssentials(until: 0 | 1 | 2 | 3 | 4 | 5, finalReached = false) {
  const snapshot = structuredClone(essential.readEssentialSnapshot()!);
  for (const screen of ["cover", 1, 2, 3, 4, 5] as const) {
    if (screen !== "cover" && screen > until) continue;
    const room = screen === "cover" ? snapshot.cover : snapshot.stations[screen];
    Object.assign(room, { presentedStepIds: [...essential.essentialSteps[screen]], confirmedStepIds: [...essential.essentialSteps[screen]], activeStepId: null, closed: true, ...(screen === 4 ? { outcome: "solved" } : {}) });
  }
  snapshot.finalReached = finalReached;
  localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot)); essential.invalidateJourneyEssential();
}
beforeEach(() => {
  vi.restoreAllMocks(); localStorage.clear(); sessionStorage.clear();
  window.history.replaceState(null, "", "/");
  essential.invalidateJourneyEssential();
  essential.setJourneyRuntimeContext({ active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false });
});

describe("OBS03 global journey guards and localized legacy recovery", () => {
  it("starts at the unconfirmed cover, then I, without redirecting to a denied acquired route", () => {
    seedProgress([1]);
    expectReplace(requireStationAccess(1), "/portada");
    expectReplace(requireStationAccess(2), "/portada");
    closeEssentials(0);
    expect(requireStationAccess(1)).toBeNull();
    expectReplace(requireStationAccess(2), "/estacion/1");
    expectReplace(requireFinalAccess(), "/estacion/1");
    expect(essential.coherentProgressPrefixLength()).toBe(1);
  });

  it("after recovering I essence, legacy resume uses an explicit gesture with no new QR or bit", () => {
    seedProgress([1]); closeEssentials(1);
    essential.setJourneyRuntimeContext({ active: true, attemptId: "recovered-I", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false });
    const before = localStorage.getItem(GVO_PROGRESS_STORAGE_KEY);
    expect(acceptJourneyIntent({ from: 1, to: "/estacion/2", kind: "legacy_resume", attemptId: "recovered-I" })).toBe(true);
    expect(requireTransitionAccess(1)).toBeNull();
    expect(requireStationAccess(2)).toBeNull();
    expect(essential.readEssentialSnapshot()?.pendingTransition?.kind).toBe("legacy_resume");
    expect(localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(before);
  });

  it.each([{ completed: [] }, { completed: [5] }, { completed: [4, 5] }, { completed: [1, 4, 5] }])("preserves scattered route bytes $completed while recovering the first missing essence", ({ completed }) => {
    seedProgress(completed); const raw = localStorage.getItem(GVO_PROGRESS_STORAGE_KEY);
    expectReplace(requireStationAccess(5), "/portada");
    expectReplace(requireFinalAccess(), "/portada");
    closeEssentials(0);
    expectReplace(requireStationAccess(5), "/estacion/1");
    expect(localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(raw);
  });

  it.each([1, 2, 3, 4] as const)("OS w%s admits and resumes its canonical precommit transition without credit in the loader", (origin) => {
    seedProgress(Array.from({ length: origin - 1 }, (_, index) => index + 1)); closeEssentials(origin);
    if (origin === 4) {
      // Declared durable preconditions for this positive router predicate;
      // this fixture is not evidence of a visitor completing the tour/game.
      localStorage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, JSON.stringify({ ...freshWorld4ExplanationCheckpoint(), revision: 16, presentedStepIds: [...WORLD4_ORDERING_TARGET], confirmedStepIds: [...WORLD4_ORDERING_TARGET], activeStepId: null, complete: true }));
      localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, JSON.stringify({ ...freshWorld4OrderingState(), phase: "closed", closed: true, outcome: "solved_by_visitor" }));
    }
    const before = localStorage.getItem(GVO_PROGRESS_STORAGE_KEY);
    const contract = interstationQrContracts[origin];
    expectReplace(requireQrAccess(`w${origin + 1}`), contract.transitionRoute);
    const receipt = essential.readEssentialSnapshot()?.pendingTransition;
    expect(receipt).toMatchObject({ from: origin, to: `/estacion/${origin + 1}`, phase: "pending", canonicalPayload: contract.payload });
    expectReplace(requireQrAccess(`w${origin + 1}`), contract.transitionRoute);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.transactionId).toBe(receipt?.transactionId);
    expect(requireTransitionAccess(origin)).toBeNull();
    expect(localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(before);
    expect(essential.getJourneyRuntimeContext().active).toBe(false);
  });

  it.each([1, 2, 3, 4] as const)("rejects w%s if the canonical source is not closed or is ahead of sequence", (origin) => {
    seedProgress(Array.from({ length: origin - 1 }, (_, index) => index + 1)); closeEssentials((origin - 1) as 0 | 1 | 2 | 3);
    expectReplace(requireQrAccess(`w${origin + 1}`), `/estacion/${origin}`);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toBeNull();
    expectReplace(requireTransitionAccess(origin), `/estacion/${origin}`);
    seedProgress([]);
    expectReplace(requireQrAccess(`w${origin + 1}`), "/estacion/1");
  });

  it("does not admit invalid pending by matching from/to alone and preserves its raw plus acquired bits", () => {
    seedProgress([1]); closeEssentials(2);
    const snapshot = structuredClone(essential.readEssentialSnapshot()!);
    snapshot.pendingTransition = { transactionId: "invalid", from: 2, to: "/estacion/2", kind: "qr", acceptedAuthorizationKind: "normal", canonicalPayload: "wrong", essentialRevision: snapshot.revision, phase: "pending" };
    const raw = JSON.stringify(snapshot), progress = localStorage.getItem(GVO_PROGRESS_STORAGE_KEY);
    localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, raw); essential.invalidateJourneyEssential();
    expectReplace(requireStationAccess(2), "/portada");
    expectReplace(requireTransitionAccess(2), "/portada");
    expectReplace(requireQrAccess("w3"), "/portada");
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBe(raw);
    expect(localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe(progress);
  });

  it("requires an explicit V result receipt for its transition; final arrival is not inferred from closure", () => {
    seedProgress([1, 2, 3, 4]); closeEssentials(5);
    expectReplace(requireTransitionAccess(5), "/estacion/5");
    expectReplace(requireFinalAccess(), "/estacion/5");
    essential.setJourneyRuntimeContext({ active: true, attemptId: "result", screen: 5, mode: "normal", authorized: true, reviewReturnAllowed: false });
    expect(acceptJourneyIntent({ from: 5, to: "/final", kind: "result_closure", attemptId: "result" })).toBe(true);
    expect(requireTransitionAccess(5)).toBeNull(); expect(requireFinalAccess()).toBeNull();
    expect(essential.readEssentialSnapshot()?.finalReached).toBe(false);
    expect(essential.coherentProgressPrefixLength()).toBe(4);
  });

  it("retains the validated legacy-review exception and rejects malformed navigation context", () => {
    seedProgress([1, 2, 3, 4, 5]);
    window.history.replaceState({ usr: { finalReview: createFinalReviewContext(3) } }, "", "/estacion/3");
    expect(requireStationAccess(3)).toBeNull(); expect(requireFinalAccess()).toBeNull();
    window.history.replaceState({ usr: { finalReview: null } }, "", "/estacion/3");
    expectReplace(requireStationAccess(3), "/portada");
    expectReplace(requireFinalAccess(), "/portada");
  });

  it("unknown/start QR and corrupt storage never grant route credit", () => {
    expectReplace(requireQrAccess("start"), "/");
    expectReplace(requireQrAccess("unknown"), "/portada");
    localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, "{broken"); essential.invalidateJourneyEssential();
    expectReplace(requireFinalAccess(), "/portada");
    expectReplace(requireQrAccess("w5"), "/portada");
    expect(localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBe("{broken");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); }); essential.invalidateJourneyEssential();
    expectReplace(requireStationAccess(5), "/portada");
  });
});
