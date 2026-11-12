import { beforeEach, describe, expect, it } from "vitest";
import { interstationQrContracts } from "../qr/interstationQr";
import { createFinalReviewContext } from "../review/finalReviewContext";
import { markStationCompleted } from "../../domain/progress/progress.storage";
import { freshWorld4OrderingState, WORLD4_ORDERING_STORAGE_KEY, WORLD4_ORDERING_TARGET } from "../../domain/checkpoints/world4OrderingCheckpoint";
import { freshWorld4ExplanationCheckpoint, WORLD4_EXPLANATION_STORAGE_KEY } from "../../domain/checkpoints/world4ExplanationCheckpoint";
import * as essential from "./journeyEssential";
import { hasCurrentFinalRight, navigationStateForReceipt, validateJourneyReceipt } from "./journeyReceipt";
import { acceptJourneyIntent, acceptQrRouteIntent, pendingJourneyNavigationState } from "./journeyIntent";
import { captureValidatedJourneyReviewContext, resolveJourneyAccess } from "./journeyAccess";

// Synthetic durable closure records for predicate/admission tests. They are not
// evidence that a physical visitor completed any activity or game.
function fixture(origin: 1 | 2 | 3 | 4 | 5, prefix = origin - 1) {
  localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, i) => i + 1), updatedAt: null }));
  essential.invalidateJourneyEssential();
  const snapshot = structuredClone(essential.readEssentialSnapshot()!);
  for (const screen of ["cover", 1, 2, 3, 4, 5] as const) {
    if (screen !== "cover" && screen > origin) continue;
    const room = screen === "cover" ? snapshot.cover : snapshot.stations[screen];
    Object.assign(room, { presentedStepIds: [...essential.essentialSteps[screen]], confirmedStepIds: [...essential.essentialSteps[screen]], activeStepId: null, closed: true, ...(screen === 4 ? { outcome: "solved" } : {}) });
  }
  localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot));
  essential.invalidateJourneyEssential();
  return essential.readEssentialSnapshot()!;
}
function qr(snapshot: essential.VerifiedEssentialSnapshot, from: 1 | 2 | 3 | 4 = 1): essential.JourneyReceipt {
  return { transactionId: crypto.randomUUID(), from, to: `/estacion/${from + 1}`, kind: "qr", canonicalPayload: interstationQrContracts[from].payload, acceptedAuthorizationKind: "normal", essentialRevision: snapshot.revision, phase: "pending" };
}
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); essential.invalidateJourneyEssential();
  essential.setJourneyRuntimeContext({ active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false });
});

describe("R3 central receipt authority", () => {
  it.each(["pending", "commit_verification_pending", "committed_pending_reveal", "revealed_pending_cleanup"] as const)("validates canonical %s and rejects every malformed variant without changing bytes", (phase) => {
    const prefix = phase === "pending" || phase === "commit_verification_pending" ? 0 : 1;
    const snapshot = fixture(1, prefix), receipt = { ...qr(snapshot), phase };
    const prior = localStorage.getItem("gvo.progress.v1");
    expect(validateJourneyReceipt(receipt, snapshot, prefix, "/estacion/2")).toBe(true);
    const variants: unknown[] = [
      { ...receipt, transactionId: " " }, { ...receipt, from: undefined }, { ...receipt, from: 2 },
      { ...receipt, to: "/estacion/1" }, { ...receipt, kind: "invented" },
      { ...receipt, acceptedAuthorizationKind: "obs03_review" }, { ...receipt, acceptedAuthorizationKind: undefined },
      { ...receipt, essentialRevision: snapshot.revision + 1 }, { ...receipt, essentialRevision: -1 },
      { ...receipt, canonicalPayload: "wrong" }, { ...receipt, phase: "unknown" },
    ];
    for (const malformed of variants) {
      expect(validateJourneyReceipt(malformed, snapshot, prefix)).toBe(false);
      const raw = JSON.stringify({ ...snapshot, pendingTransition: malformed });
      expect(essential.parseEssentialSnapshot(raw)).toBeNull();
    }
    const raw = JSON.stringify({ ...snapshot, pendingTransition: { ...receipt, canonicalPayload: "wrong" } });
    localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, raw); essential.invalidateJourneyEssential();
    expect(essential.readEssentialSnapshot()).toBeNull();
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBe(raw);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(prior);
  });

  it("does not let a valid acquired route process an invalid receipt or skip missing source closure", () => {
    const snapshot = fixture(2, 1), receipt = { ...qr(snapshot, 2), to: "/estacion/2" };
    expect(resolveJourneyAccess("/estacion/2", null).authorized).toBe(true);
    expect(validateJourneyReceipt(receipt, snapshot, 1, "/estacion/2")).toBe(false);
    snapshot.stations[1].closed = false;
    expect(validateJourneyReceipt(qr(snapshot, 2), snapshot, 1)).toBe(false);
  });

  it("requires the UI attempt captured before a reset, even after reactivating the same origin", () => {
    fixture(1);
    const old = { from: 1, to: "/estacion/2", kind: "qr", canonicalPayload: interstationQrContracts[1].payload, attemptId: "old" } as const;
    essential.setJourneyRuntimeContext({ active: true, attemptId: "old", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false });
    const oldMutationToken = essential.captureJourneyMutationToken(), receipt = qr(essential.readEssentialSnapshot()!);
    const serial = essential.beginJourneyReset(); essential.finishJourneyReset(serial);
    essential.setJourneyRuntimeContext({ active: true, attemptId: "new", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false });
    expect(acceptJourneyIntent(old)).toBe(false);
    expect(essential.persistJourneyReceipt(receipt, oldMutationToken)).toMatchObject({ ok: false, reason: "stale_revision" });
    expect(acceptJourneyIntent({ ...old, attemptId: "new" })).toBe(true);
    const current = essential.readEssentialSnapshot()?.pendingTransition;
    expect(current).toMatchObject({ kind: "qr", from: 1, to: "/estacion/2" });
    expect(essential.persistJourneyReceipt(null, oldMutationToken)).toMatchObject({ ok: false, reason: "stale_revision" });
    expect(essential.readEssentialSnapshot()?.pendingTransition).toEqual(current);
    expect(essential.coherentProgressPrefixLength()).toBe(0);
  });

  it.each([1, 2, 3, 4] as const)("OS QR origin%s admits or resumes a canonical receipt without source activity or credit", (origin) => {
    fixture(origin);
    // Declared durable proof fixture for the new IV contract; not an earned tour.
    if (origin === 4) {
      localStorage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, JSON.stringify({ ...freshWorld4ExplanationCheckpoint(), revision: 16, presentedStepIds: [...WORLD4_ORDERING_TARGET], confirmedStepIds: [...WORLD4_ORDERING_TARGET], activeStepId: null, complete: true }));
      localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, JSON.stringify({ ...freshWorld4OrderingState(), phase: "closed", closed: true, outcome: "solved_by_visitor" }));
    }
    expect(acceptQrRouteIntent(origin)).toBe(true);
    const first = essential.readEssentialSnapshot()?.pendingTransition;
    expect(first).toMatchObject({ from: origin, to: `/estacion/${origin + 1}`, canonicalPayload: interstationQrContracts[origin].payload, kind: "qr" });
    expect(acceptQrRouteIntent(origin)).toBe(true);
    expect(essential.readEssentialSnapshot()?.pendingTransition?.transactionId).toBe(first?.transactionId);
    expect(essential.getJourneyRuntimeContext().active).toBe(false);
    expect(essential.coherentProgressPrefixLength()).toBe(origin - 1);
  });

  it("transports only validated review rights to the concordant target with blocked session storage", () => {
    const snapshot = fixture(1, 5), reviewContext = createFinalReviewContext(1);
    const context = captureValidatedJourneyReviewContext("/estacion/1", { finalReview: reviewContext });
    expect(context).toEqual(reviewContext);
    essential.setJourneyRuntimeContext({ active: true, attemptId: "review", screen: 1, mode: "legacy_review_compatible", authorized: true, reviewReturnAllowed: true });
    const before = localStorage.getItem("gvo.progress.v1");
    expect(acceptJourneyIntent({ from: 1, to: "/estacion/2", kind: "qr", attemptId: "review", canonicalPayload: interstationQrContracts[1].payload, reviewContext: context })).toBe(true);
    const receipt = essential.readEssentialSnapshot()!.pendingTransition!;
    expect(receipt.kind).toBe("review_navigation");
    sessionStorage.clear();
    expect(pendingJourneyNavigationState()).toEqual({ finalReview: { ...reviewContext, world: 2 } });
    expect(navigationStateForReceipt(receipt)).toEqual(pendingJourneyNavigationState());
    expect(resolveJourneyAccess("/estacion/2", null)).toMatchObject({ authorized: true, mode: "legacy_review_compatible", reviewReturnAllowed: true });
    expect(localStorage.getItem("gvo.progress.v1")).toBe(before);
    expect(essential.readEssentialSnapshot()!.stations[2]).toEqual(snapshot.stations[2]);
    expect(validateJourneyReceipt({ ...receipt, reviewContext: createFinalReviewContext(3) }, essential.readEssentialSnapshot()!, 5)).toBe(false);
  });

  it.each(["cover", 1, 2, 3, 4, 5] as const)("does not turn finalReached plus missing %s closure into current final authority", (screen) => {
    const snapshot = fixture(5, 5); snapshot.finalReached = true;
    (screen === "cover" ? snapshot.cover : snapshot.stations[screen]).closed = false;
    expect(hasCurrentFinalRight(snapshot, 5)).toBe(false);
    const raw = JSON.stringify(snapshot);
    expect(essential.parseEssentialSnapshot(raw)).toBeNull();
    localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, raw); essential.invalidateJourneyEssential();
    expect(resolveJourneyAccess("/final", { finalReview: createFinalReviewContext(1) }).authorized).toBe(false);
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBe(raw);
  });

  it("preserves a coherent durable final fact while denying its authority if external route credit is incomplete", () => {
    const snapshot = fixture(5, 5); snapshot.finalReached = true;
    const raw = JSON.stringify(snapshot); localStorage.setItem(essential.ESSENTIAL_STORAGE_KEY, raw);
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2, 3, 4], updatedAt: null })); essential.invalidateJourneyEssential();
    expect(essential.readEssentialSnapshot()?.finalReached).toBe(true);
    expect(resolveJourneyAccess("/final", null).authorized).toBe(false);
    expect(resolveJourneyAccess("/estacion/1", { finalReview: createFinalReviewContext(1) }).mode).toBe("normal");
    expect(localStorage.getItem(essential.ESSENTIAL_STORAGE_KEY)).toBe(raw);
  });

  it("an acquired continuation resumes the same indeterminate QR receipt without demanding another QR", () => {
    fixture(1);
    expect(acceptQrRouteIntent(1)).toBe(true);
    const receipt = essential.readEssentialSnapshot()!.pendingTransition!;
    expect(essential.persistJourneyReceipt({ ...receipt, phase: "commit_verification_pending" }, essential.captureJourneyMutationToken()).ok).toBe(true);
    expect(markStationCompleted(1).ok).toBe(true);
    const credited = localStorage.getItem("gvo.progress.v1");
    essential.setJourneyRuntimeContext({ active: true, attemptId: "resume", screen: 1, mode: "normal", authorized: true, reviewReturnAllowed: false });
    expect(acceptJourneyIntent({ from: 1, to: "/estacion/2", kind: "legacy_resume", attemptId: "resume" })).toBe(true);
    expect(essential.readEssentialSnapshot()?.pendingTransition).toMatchObject({ transactionId: receipt.transactionId, kind: "qr", phase: "commit_verification_pending" });
    expect(localStorage.getItem("gvo.progress.v1")).toBe(credited);
  });
});
