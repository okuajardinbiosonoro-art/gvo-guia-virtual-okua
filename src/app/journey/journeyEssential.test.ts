import { beforeEach, describe, expect, it, vi } from "vitest";
import * as journey from "./journeyEssential";
import {
  WORLD5_QUIZ_AREA_ORDER,
  WORLD5_QUIZ_STORAGE_KEY,
  WORLD5_ROUNDS_STORAGE_KEY,
  hasWorld5ParticipationProof,
  mutateWorld5Rounds,
  readWorld5Rounds,
  updateWorld5Quiz,
  type World5RoundCommand,
} from "../../screens/World5Root/world5Quiz";

const revision = journey.ESSENTIAL_CONTENT_REVISION;
function activate(screen: journey.EssentialScreen, mode: journey.EssentialAccessMode = "normal") {
  journey.setJourneyRuntimeContext({ active: true, screen, mode, authorized: true, attemptId: "unit", reviewReturnAllowed: mode !== "normal" });
}
beforeEach(() => {
  localStorage.clear(); journey.invalidateJourneyEssential();
  journey.setJourneyRuntimeContext({ active: false, screen: null, mode: "normal", authorized: false, attemptId: null, reviewReturnAllowed: false });
});
describe("OBS03 essential semantic authority", () => {
  it("never presents or writes while the real target tree is inactive", async () => {
    expect(await journey.markEssentialPresented({ screen: 1, stepId: "intro", contentRevision: revision, attemptId: "unit", mode: "standard" })).toMatchObject({ ok: false, reason: "inactive" });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBeNull();
  });
  it("requires presentation, ordered explicit confirmations and a manual final close", async () => {
    activate("cover");
    expect(await journey.confirmEssentialStep({ screen: "cover", stepId: "saludo", contentRevision: revision, attemptId: "unit", cause: "visitor_advance" })).toMatchObject({ ok: false, reason: "out_of_order" });
    for (const id of journey.essentialSteps.cover) {
      const shown = await journey.markEssentialPresented({ screen: "cover", stepId: id, contentRevision: revision, attemptId: "unit", mode: "standard" });
      expect(shown.ok).toBe(true);
      expect(journey.readEssentialSnapshot()?.cover.closed).toBe(false);
      if (id !== "raiz") expect((await journey.confirmEssentialStep({ screen: "cover", stepId: id, contentRevision: revision, attemptId: "unit", cause: "visitor_advance" })).ok).toBe(true);
    }
    expect((await journey.closeEssentialRoom({ screen: "cover", contentRevision: revision, attemptId: "unit", cause: "visitor_close" })).ok).toBe(true);
    expect(journey.readEssentialSnapshot()?.cover.closed).toBe(true);
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("does not enable a future concept from a forged presentation event", async () => {
    activate(1);
    expect(await journey.markEssentialPresented({ screen: 1, stepId: "mediacion", contentRevision: revision, attemptId: "unit", mode: "standard" })).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(journey.canUseUiStep(1, "mediacion")).toBe(false);
  });
  it("leaves all room stores untouched in visible legacy review", async () => {
    activate(2, "legacy_review_compatible");
    expect(journey.isEssentialExitReady(2)).toBe(true);
    expect(await journey.markEssentialPresented({ screen: 2, stepId: "planta", contentRevision: revision, attemptId: "unit", mode: "standard" })).toMatchObject({ ok: false, reason: "read_only_review" });
    expect(await journey.recordWorld2UiFact({ kind: "capture_step", id: "contact", contentRevision: revision, attemptId: "unit" })).toMatchObject({ ok: false, reason: "read_only_review" });
    expect(localStorage.length).toBe(0);
  });
  it("stores assisted presentation separately from manual II evidence and preserves v1 bytes", async () => {
    localStorage.setItem("gvo.station2.v1", "historical bytes"); activate(2);
    await journey.markEssentialPresented({ screen: 2, stepId: "planta", contentRevision: revision, attemptId: "unit", mode: "assisted" });
    const room = journey.readEssentialSnapshot()!.stations[2];
    expect(room.assistedPresentedStepIds).toEqual(["planta"]);
    expect(room.confirmedStepIds).toEqual([]); expect(room.interactionEvidence).toEqual([]);
    expect(localStorage.getItem("gvo.station2.v1")).toBe("historical bytes");
  });
  it("keeps corrupt essential bytes and valid global route credit without inventing closure", async () => {
    localStorage.setItem(journey.ESSENTIAL_STORAGE_KEY, "{broken");
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 4, 5], updatedAt: null }));
    journey.invalidateJourneyEssential(); activate(1);
    expect(journey.coherentProgressPrefixLength()).toBe(1);
    expect(journey.readEssentialSnapshot()).toBeNull();
    expect(await journey.markEssentialPresented({ screen: 1, stepId: "intro", contentRevision: revision, attemptId: "unit", mode: "standard" })).toMatchObject({ ok: false, reason: "storage_unverified" });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe("{broken");
  });
  it("makes repeated writes idempotent and refuses a stale external revision", async () => {
    activate(1);
    const input = { screen: 1 as const, stepId: "intro", contentRevision: revision, attemptId: "unit", mode: "standard" as const };
    await journey.markEssentialPresented(input);
    const before = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    expect(await journey.markEssentialPresented(input)).toMatchObject({ ok: true, alreadyApplied: true });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(before);
    const external = JSON.parse(before!); external.revision++;
    localStorage.setItem(journey.ESSENTIAL_STORAGE_KEY, JSON.stringify(external));
    expect(await journey.confirmEssentialStep({ screen: 1, stepId: "intro", contentRevision: revision, attemptId: "unit", cause: "visitor_advance" })).toMatchObject({ ok: false, reason: "stale_revision" });
  });
  it("does not advance the last verified snapshot after a failed storage write", async () => {
    activate(1); const previous = journey.readEssentialSnapshot();
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    expect(await journey.markEssentialPresented({ screen: 1, stepId: "intro", contentRevision: revision, attemptId: "unit", mode: "standard" })).toMatchObject({ ok: false, reason: "storage_unverified" });
    expect(journey.readEssentialSnapshot()).toBe(previous); spy.mockRestore();
  });
});

describe("OBS05 V essential confirmations with the real round writer", () => {
  // Only command transport is supplied here; persisted ledgers come from the
  // production writer, never a hand-authored v2 snapshot or mocked proof.
  type RoundAction = World5RoundCommand extends infer Command
    ? Command extends World5RoundCommand
      ? Omit<Command, "actionId" | "expectedRaw" | "roundId">
      : never
    : never;
  function writeRound(action: RoundAction, actionId: string) {
    const read = readWorld5Rounds();
    const token = journey.captureJourneyMutationToken();
    const attemptId = journey.getJourneyRuntimeContext().attemptId;
    return mutateWorld5Rounds({
      ...action, actionId, expectedRaw: read.raw, roundId: read.round?.roundId ?? null,
    }, { canCommit: () => {
      const context = journey.getJourneyRuntimeContext();
      return journey.isJourneyMutationTokenCurrent(token) && context.active &&
        context.authorized && context.screen === 5 && context.mode === "normal" &&
        attemptId !== null && context.attemptId === attemptId && document.visibilityState !== "hidden";
    } });
  }
  const present = (stepId: string) => journey.markEssentialPresented({ screen: 5, stepId, contentRevision: revision, attemptId: "unit", mode: "standard" });
  const confirm = (stepId: string) => journey.confirmEssentialStep({ screen: 5, stepId, contentRevision: revision, attemptId: "unit", cause: "visitor_advance" });

  it("preserves genuine v1 participation when v2 has not started, without migrating its bytes", async () => {
    expect(updateWorld5Quiz({ kind: "incorrect", area: "plantas" }).ok).toBe(true);
    expect(updateWorld5Quiz({ kind: "skip", area: "sistema" }).ok).toBe(true);
    const legacyRaw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    activate(5);
    for (const area of ["plantas", "sistema"]) {
      expect((await present(area)).ok).toBe(true);
      expect((await confirm(area)).ok).toBe(true);
    }
    expect(readWorld5Rounds().status).toBe("legacy");
    expect(journey.readEssentialSnapshot()!.stations[5].confirmedStepIds).toEqual(["plantas", "sistema"]);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(legacyRaw);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });

  it("does not fall back to valid v1 proof when v2 bytes are corrupt", async () => {
    expect(updateWorld5Quiz({ kind: "correct", area: "plantas" }).ok).toBe(true);
    const legacyRaw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    const corruptRaw = '{"schemaVersion":2,"rounds":';
    localStorage.setItem(WORLD5_ROUNDS_STORAGE_KEY, corruptRaw);
    activate(5);
    expect((await present("plantas")).ok).toBe(true);
    const essentialRaw = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    expect(readWorld5Rounds().status).toBe("corrupt");
    expect(await confirm("plantas")).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(journey.readEssentialSnapshot()!.stations[5].confirmedStepIds).toEqual([]);
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(essentialRaw);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(legacyRaw);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(corruptRaw);
  });

  it.each(["correct", "incorrect", "skipped"] as const)("requires a verified current %s outcome for a first confirmation", async (kind) => {
    activate(5);
    expect((await present("plantas")).ok).toBe(true);
    const essentialRaw = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    expect(await confirm("plantas")).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(essentialRaw);
    const result = writeRound(kind === "skipped"
      ? { kind: "skip", area: "plantas" }
      : { kind: "answer", area: "plantas", side: kind === "correct" ? "agreement" : "disagreement" }, `first-${kind}`);
    expect(result.ok).toBe(true);
    expect(readWorld5Rounds().round?.outcomes.plantas?.kind).toBe(kind);
    const roundRaw = localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
    expect((await confirm("plantas")).ok).toBe(true);
    expect(journey.readEssentialSnapshot()!.stations[5].confirmedStepIds).toEqual(["plantas"]);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(roundRaw);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });

  it("rejects proof from another area and stops using historical v1 proof once v2 starts", async () => {
    expect(updateWorld5Quiz({ kind: "correct", area: "sistema" }).ok).toBe(true);
    const legacyRaw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    activate(5);
    expect((await present("plantas")).ok).toBe(true);
    expect(writeRound({ kind: "answer", area: "plantas", side: "disagreement" }, "plants-only").ok).toBe(true);
    expect((await confirm("plantas")).ok).toBe(true);
    expect((await present("sistema")).ok).toBe(true);
    const essentialRaw = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    expect(hasWorld5ParticipationProof("plantas")).toBe(true);
    expect(hasWorld5ParticipationProof("sistema")).toBe(false);
    expect(await confirm("sistema")).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(essentialRaw);
    expect(writeRound({ kind: "skip", area: "sistema" }, "system-now-skipped").ok).toBe(true);
    expect((await confirm("sistema")).ok).toBe(true);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(legacyRaw);
  });

  it("keeps already confirmed V steps and closure idempotent in blank round two without a reset", async () => {
    // Declared acquired-route fixture: this unit test does not earn global QR credit.
    const progressRaw = JSON.stringify({ schemaVersion: 1, completedStations: [1, 2, 3, 4], updatedAt: null });
    localStorage.setItem("gvo.progress.v1", progressRaw);
    expect(updateWorld5Quiz({ kind: "skip_remaining" }).ok).toBe(true);
    const legacyRaw = localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY);
    activate(5);
    for (const area of WORLD5_QUIZ_AREA_ORDER) {
      expect((await present(area)).ok).toBe(true);
      expect(writeRound({ kind: "answer", area, side: "disagreement" }, `round-one-${area}`).ok).toBe(true);
      expect((await confirm(area)).ok).toBe(true);
    }
    expect(writeRound({ kind: "finish_round" }, "finish-first").ok).toBe(true);
    expect((await present("resultado")).ok).toBe(true);
    expect((await journey.closeEssentialRoom({ screen: 5, contentRevision: revision, attemptId: "unit", cause: "visitor_close" })).ok).toBe(true);
    const essentialRaw = localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY);
    const firstRound = structuredClone(readWorld5Rounds().round);
    const token = journey.captureJourneyMutationToken();
    expect(writeRound({ kind: "begin_retry" }, "retry-whole-quiz").ok).toBe(true);
    expect(readWorld5Rounds()).toMatchObject({ roundNumber: 2, score: 0, complete: false });
    expect(readWorld5Rounds().round?.outcomes).toEqual({});
    expect(readWorld5Rounds().ledger?.rounds[0]).toEqual(firstRound);
    const roundRaw = localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
    for (const area of WORLD5_QUIZ_AREA_ORDER) {
      expect(hasWorld5ParticipationProof(area)).toBe(false);
      expect(await present(area)).toMatchObject({ ok: true, alreadyApplied: true });
      expect(await confirm(area)).toMatchObject({ ok: true, alreadyApplied: true });
    }
    expect(await journey.closeEssentialRoom({ screen: 5, contentRevision: revision, attemptId: "unit", cause: "visitor_close" })).toMatchObject({ ok: true, alreadyApplied: true });
    expect(journey.isJourneyMutationTokenCurrent(token)).toBe(true);
    expect(journey.readEssentialSnapshot()!.stations[5]).toMatchObject({ closed: true, confirmedStepIds: [...journey.essentialSteps[5]] });
    expect(localStorage.getItem(journey.ESSENTIAL_STORAGE_KEY)).toBe(essentialRaw);
    expect(localStorage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(roundRaw);
    expect(localStorage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(legacyRaw);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(progressRaw);
  });
});
