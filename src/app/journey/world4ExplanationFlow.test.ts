import { beforeEach, describe, expect, it, vi } from "vitest";
import * as journey from "./journeyEssential";
import { acceptQrRouteIntent } from "./journeyIntent";
import { validateJourneyReceipt } from "./journeyReceipt";
import { resolveJourneyAccess, essentialRecoveryRoute } from "./journeyAccess";
import { interstationQrContracts } from "../qr/interstationQr";
import { resetGvoJourney } from "../reset/resetGvoJourney";
import { WORLD4_ORDERING_TARGET, WORLD4_ORDERING_STORAGE_KEY, freshWorld4OrderingState, type World4OrderingId } from "../../domain/checkpoints/world4OrderingCheckpoint";
import { WORLD4_EXPLANATION_STORAGE_KEY as key, WORLD4_EXPLANATION_REVISION as revision, freshWorld4ExplanationCheckpoint, readWorld4ExplanationCheckpoint, writeWorld4ExplanationCheckpoint, isWorld4ExplanationCheckpoint } from "../../domain/checkpoints/world4ExplanationCheckpoint";

const input = (stepId: World4OrderingId = WORLD4_ORDERING_TARGET[0]) => ({ stepId, contentRevision: revision, attemptId: "iv" });
function activate(mode: journey.EssentialAccessMode = "normal") {
  journey.setJourneyRuntimeContext({ active: true, attemptId: "iv", screen: 4, mode, authorized: true, reviewReturnAllowed: mode !== "normal" });
}
function fixture(prefix = 3, closed = false) {
  localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: Array.from({ length: prefix }, (_, i) => i + 1), updatedAt: null }));
  journey.invalidateJourneyEssential();
  const snapshot = structuredClone(journey.readEssentialSnapshot()!);
  for (const screen of ["cover", 1, 2, 3, ...(closed ? [4] : [])] as journey.EssentialScreen[]) {
    const room = screen === "cover" ? snapshot.cover : snapshot.stations[screen];
    Object.assign(room, { presentedStepIds: [...journey.essentialSteps[screen]], confirmedStepIds: [...journey.essentialSteps[screen]], activeStepId: null, closed: true, ...(screen === 4 ? { outcome: "solved" } : {}) });
  }
  localStorage.setItem(journey.ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot));
  journey.invalidateJourneyEssential(); activate();
  return journey.readEssentialSnapshot()!;
}
async function completeTour() {
  for (const stepId of WORLD4_ORDERING_TARGET) {
    expect((await journey.markWorld4ExplanationPresented(input(stepId))).ok).toBe(true);
    expect((await journey.confirmWorld4ExplanationStep(input(stepId))).ok).toBe(true);
  }
}
function solvedGame() {
  localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, JSON.stringify({ ...freshWorld4OrderingState(), phase: "closed", closed: true, outcome: "solved_by_visitor" }));
}
beforeEach(() => { vi.restoreAllMocks(); localStorage.clear(); sessionStorage.clear(); journey.invalidateJourneyEssential(); activate(); });
describe("OBS04 independent IV explanatory proof", () => {
  it("requires eight ordered presentations and explicit confirmations without spending the game clock or other stores", async () => {
    fixture(); solvedGame();
    const oldGame = localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY), oldEssential = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    expect(readWorld4ExplanationCheckpoint().status).toBe("empty"); expect(localStorage.getItem(key)).toBeNull();
    expect(await journey.confirmWorld4ExplanationStep(input())).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(await journey.markWorld4ExplanationPresented(input("midi"))).toMatchObject({ ok: false, reason: "out_of_order" });
    await completeTour();
    expect(readWorld4ExplanationCheckpoint().checkpoint).toMatchObject({ complete: true, revision: 16, activeStepId: null });
    expect(localStorage.getItem(WORLD4_ORDERING_STORAGE_KEY)).toBe(oldGame);
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(oldEssential);
  });
  it.each(["inactive", "hidden", "attempt", "review", "revision"])("rejects %s callbacks without auxiliary writes", async (kind) => {
    fixture();
    if (kind === "inactive") journey.setJourneyRuntimeContext({ ...journey.getJourneyRuntimeContext(), active: false });
    if (kind === "hidden") vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    if (kind === "review") activate("obs03_review");
    const value = { ...input(), ...(kind === "attempt" ? { attemptId: "old" } : {}), ...(kind === "revision" ? { contentRevision: "old" as typeof revision } : {}) };
    expect((await journey.markWorld4ExplanationPresented(value)).ok).toBe(false); expect(localStorage.getItem(key)).toBeNull();
  });
  it("preserves invalid/unknown auxiliary bytes and refuses unavailable storage", async () => {
    fixture();
    for (const raw of ["{broken", JSON.stringify({ ...freshWorld4ExplanationCheckpoint(), contentRevision: "future" })]) {
      localStorage.setItem(key, raw);
      expect(await journey.markWorld4ExplanationPresented(input())).toMatchObject({ ok: false, reason: "storage_unverified" });
      expect(localStorage.getItem(key)).toBe(raw);
    }
    expect(readWorld4ExplanationCheckpoint(null).status).toBe("unavailable");
    expect(writeWorld4ExplanationCheckpoint(freshWorld4ExplanationCheckpoint(), null, () => true, null).ok).toBe(false);
  });
  it("rejects impossible prefix/active/complete states", () => {
    const fresh = freshWorld4ExplanationCheckpoint();
    for (const bad of [{ ...fresh, confirmedStepIds: ["planta"] }, { ...fresh, presentedStepIds: ["midi"] }, { ...fresh, complete: true }, { ...fresh, activeStepId: "router" }, { ...fresh, revision: -1 }, { ...fresh, extra: true }]) expect(isWorld4ExplanationCheckpoint(bad)).toBe(false);
  });
  it("requires tour AND valid game at QR admission/receipt/exit, preserving old unacquired receipt and other rooms", async () => {
    const snapshot = fixture(3, true);
    const receipt: journey.JourneyReceipt = { transactionId: "old-iv", from: 4, to: "/estacion/5", kind: "qr", canonicalPayload: interstationQrContracts[4].payload, acceptedAuthorizationKind: "normal", essentialRevision: snapshot.revision, phase: "pending" };
    const raw = JSON.stringify({ ...snapshot, pendingTransition: receipt }); localStorage.setItem(journey.ESSENTIAL_STORAGE_KEY, raw); journey.invalidateJourneyEssential(); activate();
    expect(journey.readEssentialSnapshot()?.stations[3].closed).toBe(true);
    expect(validateJourneyReceipt(receipt, snapshot, 3)).toBe(false); expect(resolveJourneyAccess("/estacion/5", null).authorized).toBe(false);
    expect(essentialRecoveryRoute()).toBe("/estacion/4"); expect(acceptQrRouteIntent(4)).toBe(false); expect(journey.isEssentialExitReady(4)).toBe(false);
    solvedGame(); expect(acceptQrRouteIntent(4)).toBe(false);
    await completeTour(); expect(validateJourneyReceipt(receipt, snapshot, 3)).toBe(true); expect(journey.isEssentialExitReady(4)).toBe(true); expect(acceptQrRouteIntent(4)).toBe(true);
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(raw); expect(journey.coherentProgressPrefixLength()).toBe(3);
    localStorage.setItem(WORLD4_ORDERING_STORAGE_KEY, JSON.stringify(freshWorld4OrderingState()));
    expect(journey.isEssentialExitReady(4)).toBe(false); expect(validateJourneyReceipt(receipt, snapshot, 3)).toBe(false);
  });
  it("does not revoke already acquired IV credit or write proof in a legitimate readonly visit", async () => {
    fixture(4, true); solvedGame(); expect(journey.isEssentialExitReady(4)).toBe(true);
    expect(await journey.markWorld4ExplanationPresented(input())).toMatchObject({ ok: false, reason: "read_only_review" });
    activate("legacy_review_compatible"); expect(journey.isEssentialExitReady(4)).toBe(true);
    expect((await journey.confirmWorld4ExplanationStep(input())).ok).toBe(false); expect(localStorage.getItem(key)).toBeNull();
  });
  it("rejects CAS contention and removes only its own late write after a reset", () => {
    const next = { ...freshWorld4ExplanationCheckpoint(), revision: 1, presentedStepIds: ["planta"] as const };
    const values = new Map<string, string>([[key, "foreign"]]); let current = true;
    const storage = { getItem: (k: string) => values.get(k) ?? null, removeItem: (k: string) => { values.delete(k); }, setItem: (k: string, v: string) => { current = false; values.clear(); values.set(k, v); } };
    expect(writeWorld4ExplanationCheckpoint(next, null, () => current, storage)).toMatchObject({ ok: false, reason: "stale_revision" }); expect(values.get(key)).toBe("foreign");
    values.clear(); expect(writeWorld4ExplanationCheckpoint(next, null, () => current, storage).ok).toBe(false); expect(values.has(key)).toBe(false);
    current = true; storage.setItem = (k, v) => { current = false; values.set(k, v); values.set(k, "other-writer"); };
    expect(writeWorld4ExplanationCheckpoint(next, null, () => current, storage).ok).toBe(false); expect(values.get(key)).toBe("other-writer");
  });
  it("resets the auxiliary key and fences old callbacks while preserving preferences", async () => {
    fixture(); await journey.markWorld4ExplanationPresented(input()); localStorage.setItem("gvo.language.v1", "en");
    expect((await resetGvoJourney()).ok).toBe(true); expect(localStorage.getItem(key)).toBeNull();
    expect((await journey.confirmWorld4ExplanationStep(input())).ok).toBe(false); expect(localStorage.getItem(key)).toBeNull(); expect(localStorage.getItem("gvo.language.v1")).toBe("en");
  });
});
