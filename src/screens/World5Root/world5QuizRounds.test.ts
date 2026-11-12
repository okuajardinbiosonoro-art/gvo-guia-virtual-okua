import { describe, expect, it } from "vitest";
import type { ProgressStorage } from "../../domain/progress/progress.types";
import {
  hasWorld5ParticipationProof, mutateWorld5Rounds, readWorld5Rounds, recoverWorld5Quiz,
  WORLD5_QUIZ_AREA_ORDER, WORLD5_QUIZ_STORAGE_KEY, WORLD5_ROUNDS_STORAGE_KEY,
  WORLD5_QUIZ_RECOVERY_KEY, type World5RoundCommand,
} from "./world5Quiz";

function memory() {
  const values = new Map<string, string>();
  const storage: ProgressStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, raw) => { values.set(key, raw); },
    removeItem: key => { values.delete(key); },
  };
  let serial = 0;
  function command(action: { kind: "answer"; area: typeof WORLD5_QUIZ_AREA_ORDER[number]; side: "agreement" | "disagreement" } | { kind: "skip"; area: typeof WORLD5_QUIZ_AREA_ORDER[number] } | { kind: "finish_round" | "begin_retry" }): World5RoundCommand {
    const read = readWorld5Rounds(storage);
    return { ...action, actionId: `event-${++serial}`, expectedRaw: read.raw, roundId: read.round?.roundId ?? null };
  }
  const commit = (event: World5RoundCommand, canCommit = () => true) => mutateWorld5Rounds(event, { storage, canCommit });
  function round(score: number) {
    WORLD5_QUIZ_AREA_ORDER.forEach((area, index) => expect(commit(command({ kind: "answer", area, side: index < score ? "agreement" : "disagreement" })).ok).toBe(true));
    expect(readWorld5Rounds(storage).eligible).toBe(false);
    expect(commit(command({ kind: "finish_round" })).ok).toBe(true);
    return readWorld5Rounds(storage);
  }
  return { storage, values, command, commit, round };
}
const legacy = (correctAnswers = [...WORLD5_QUIZ_AREA_ORDER]) => JSON.stringify({ schemaVersion: 1, correctAnswers, answeredQuestions: [...WORLD5_QUIZ_AREA_ORDER], skippedQuestions: [] });

describe("Sala V OBS05 — four complete, independently scored rounds", () => {
  it("reads without writes and does not create a round on activation or legacy review", () => {
    const m = memory();
    for (let i = 0; i < 4; i++) expect(readWorld5Rounds(m.storage)).toMatchObject({ status: "empty", roundNumber: 1, score: 0, eligible: false });
    expect(m.values.size).toBe(0);
    m.storage.setItem(WORLD5_QUIZ_STORAGE_KEY, legacy());
    expect(readWorld5Rounds(m.storage)).toMatchObject({ status: "legacy", score: 0, eligible: false, ledger: null });
    expect(readWorld5Rounds(m.storage).legacyQuiz.correctAnswers).toHaveLength(4);
    expect(m.values.size).toBe(1);
  });
  it.each([0, 1, 2, 3, 4])("qualifies only a completed round with four correct: score %i", score => {
    const m = memory(), result = m.round(score);
    expect(result).toMatchObject({ score, complete: true, eligible: score === 4, canRetry: score !== 4 });
    expect(result.round?.completionReceipt).toBeTruthy();
  });
  it("seals wrong and skipped slots, rejects other choices, and keeps Next participation proof", () => {
    const m = memory();
    expect(m.commit(m.command({ kind: "answer", area: "plantas", side: "disagreement" })).ok).toBe(true);
    const wrongRaw = readWorld5Rounds(m.storage).raw;
    expect(m.commit(m.command({ kind: "answer", area: "plantas", side: "agreement" }))).toMatchObject({ ok: false, reason: "out_of_order" });
    expect(m.commit(m.command({ kind: "skip", area: "plantas" })).ok).toBe(false);
    expect(readWorld5Rounds(m.storage).raw).toBe(wrongRaw);
    expect(hasWorld5ParticipationProof("plantas", m.storage)).toBe(true);
    expect(m.commit(m.command({ kind: "skip", area: "sistema" })).ok).toBe(true);
    expect(m.commit(m.command({ kind: "answer", area: "sistema", side: "agreement" })).ok).toBe(false);
    expect(hasWorld5ParticipationProof("sistema", m.storage)).toBe(true);
    expect(readWorld5Rounds(m.storage).score).toBe(0);
  });
  it("rejects future questions, early finish/retry, and a fifth round after three whole retries", () => {
    const m = memory();
    for (const action of [{ kind: "answer", area: "visitante", side: "agreement" }, { kind: "finish_round" }, { kind: "begin_retry" }] as const) expect(m.commit(m.command(action)).ok).toBe(false);
    expect(m.values.size).toBe(0);
    for (let index = 0; index < 4; index++) {
      const result = m.round(index % 4);
      expect(result.roundNumber).toBe(index + 1);
      const before = result.raw;
      if (index < 3) {
        expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(true);
        expect(readWorld5Rounds(m.storage)).toMatchObject({ roundNumber: index + 2, score: 0, complete: false });
      } else {
        expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(false);
        expect(readWorld5Rounds(m.storage).raw).toBe(before);
      }
    }
    expect(readWorld5Rounds(m.storage).ledger?.seenActionIds).toHaveLength(23);
  });
  it.each([1, 2, 3, 4])("allows a verified win in round %i and prevents any further retry", winningRound => {
    const m = memory();
    for (let n = 1; n < winningRound; n++) { m.round(0); expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(true); }
    expect(m.round(4)).toMatchObject({ eligible: true, roundNumber: winningRound, canRetry: false });
    expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(false);
  });
  it("does not combine three old correct answers with one correct in another round", () => {
    const m = memory(); m.round(3); m.commit(m.command({ kind: "begin_retry" }));
    WORLD5_QUIZ_AREA_ORDER.forEach(area => m.commit(m.command({ kind: "answer", area, side: area === "visitante" ? "agreement" : "disagreement" })));
    m.commit(m.command({ kind: "finish_round" }));
    expect(readWorld5Rounds(m.storage)).toMatchObject({ score: 1, eligible: false });
    expect(new Set(readWorld5Rounds(m.storage).ledger!.rounds.flatMap(r => Object.entries(r.outcomes).filter(([, o]) => o.kind === "correct").map(([area]) => area))).size).toBe(4);
  });
  it("preserves legacy bytes and credits separately, including unsorted historical answer/skip overlap", () => {
    const m = memory(); const raw = JSON.stringify({ schemaVersion: 1, correctAnswers: ["espacio"], answeredQuestions: ["espacio", "plantas"], skippedQuestions: ["plantas"] });
    m.storage.setItem(WORLD5_QUIZ_STORAGE_KEY, raw);
    expect(hasWorld5ParticipationProof("plantas", m.storage)).toBe(true);
    expect(m.commit(m.command({ kind: "answer", area: "plantas", side: "disagreement" })).ok).toBe(true);
    expect(m.storage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe(raw);
    expect(readWorld5Rounds(m.storage)).toMatchObject({ score: 0, eligible: false });
    expect(readWorld5Rounds(m.storage).ledger?.legacySource.raw).toBe(raw);
    expect(readWorld5Rounds(m.storage).legacyQuiz.correctAnswers).toEqual(["espacio"]);
    expect(hasWorld5ParticipationProof("espacio", m.storage)).toBe(false);
  });
  it("makes identical commands idempotent, rejects ID reuse with another payload/round and stale reads", () => {
    const m = memory(), event = m.command({ kind: "answer", area: "plantas", side: "agreement" });
    const stale = m.command({ kind: "answer", area: "plantas", side: "disagreement" });
    expect(m.commit(event)).toMatchObject({ ok: true, alreadyApplied: false });
    const raw = readWorld5Rounds(m.storage).raw;
    expect(m.commit(event)).toMatchObject({ ok: true, alreadyApplied: true, awarded: false });
    expect(m.commit({ ...event, side: "disagreement" } as World5RoundCommand).ok).toBe(false);
    expect(m.commit({ ...event, roundId: "other-round" }).ok).toBe(false);
    expect(m.commit(stale)).toMatchObject({ ok: false, reason: "conflict" });
    expect(readWorld5Rounds(m.storage).raw).toBe(raw);
  });
  it("replays finish and begin_retry only once, including unknown commit recovery", () => {
    const m = memory(); m.round(0);
    const finish = readWorld5Rounds(m.storage).round!.completionReceipt!;
    const replay: World5RoundCommand = { kind: "finish_round", actionId: finish, expectedRaw: null, roundId: readWorld5Rounds(m.storage).round!.roundId };
    expect(m.commit(replay)).toMatchObject({ ok: true, alreadyApplied: true });
    const retry = m.command({ kind: "begin_retry" });
    const originalSet = m.storage.setItem, originalGet = m.storage.getItem;
    let readbackFails = true, wrote = false;
    m.storage.setItem = (key, raw) => { originalSet(key, raw); wrote = true; };
    m.storage.getItem = key => { if (wrote && readbackFails && key === WORLD5_ROUNDS_STORAGE_KEY) throw Error("readback unavailable"); return originalGet(key); };
    expect(m.commit(retry)).toMatchObject({ ok: false, reason: "storage_unverified" });
    readbackFails = false;
    const raw = readWorld5Rounds(m.storage).raw;
    expect(m.commit(retry)).toMatchObject({ ok: true, alreadyApplied: true });
    expect(readWorld5Rounds(m.storage)).toMatchObject({ roundNumber: 2, score: 0 });
    expect(readWorld5Rounds(m.storage).raw).toBe(raw);
    expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(false);
  });
  it("does not spend an action on failed/drop writes; the same action can later be saved", () => {
    const m = memory(), event = m.command({ kind: "answer", area: "plantas", side: "agreement" });
    const set = m.storage.setItem;
    m.storage.setItem = () => {};
    expect(m.commit(event)).toMatchObject({ ok: false, reason: "storage_unverified" });
    expect(readWorld5Rounds(m.storage).ledger).toBeNull();
    m.storage.setItem = set;
    expect(m.commit(event)).toMatchObject({ ok: true });
    expect(readWorld5Rounds(m.storage).ledger?.revision).toBe(1);
  });
  it("rejects inactive and reset-revoked writers before they can recreate removed data", () => {
    const m = memory(), event = m.command({ kind: "answer", area: "plantas", side: "agreement" });
    expect(m.commit(event, () => false)).toMatchObject({ ok: false, reason: "inactive" });
    let current = true; const get = m.storage.getItem; let reads = 0;
    m.storage.getItem = key => { if (++reads === 5) current = false; return get(key); };
    expect(m.commit(event, () => current).ok).toBe(false);
    expect(m.values.size).toBe(0);
  });
  it.each(["kind-choice", "extra-outcome", "duplicate-event", "false-flag", "reordered-slots"])("rejects corrupt v2 %s without falling back to four legacy points", mutation => {
    const m = memory(); m.round(4); m.storage.setItem(WORLD5_QUIZ_STORAGE_KEY, legacy());
    const ledger = JSON.parse(m.storage.getItem(WORLD5_ROUNDS_STORAGE_KEY)!);
    if (mutation === "kind-choice") ledger.rounds[0].outcomes.plantas.choice = "disagreement";
    if (mutation === "extra-outcome") ledger.rounds[0].outcomes.future = ledger.rounds[0].outcomes.plantas;
    if (mutation === "duplicate-event") ledger.seenActionIds[1] = ledger.seenActionIds[0];
    if (mutation === "false-flag") ledger.eligible = true;
    if (mutation === "reordered-slots") ledger.rounds[0].outcomes = { visitante: ledger.rounds[0].outcomes.visitante, ...ledger.rounds[0].outcomes };
    const raw = JSON.stringify(ledger); m.storage.setItem(WORLD5_ROUNDS_STORAGE_KEY, raw);
    expect(readWorld5Rounds(m.storage)).toMatchObject({ status: "corrupt", eligible: false, score: 0 });
    expect(m.commit(m.command({ kind: "begin_retry" })).ok).toBe(false);
    expect(hasWorld5ParticipationProof("plantas", m.storage)).toBe(false);
    expect(m.storage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(raw);
  });
  it("preserves unreadable/corrupt records and recovers only after verified backup", () => {
    const m = memory(); const raw = "{broken-v2"; m.storage.setItem(WORLD5_ROUNDS_STORAGE_KEY, raw);
    const set = m.storage.setItem;
    m.storage.setItem = () => {};
    expect(recoverWorld5Quiz({ storage: m.storage, canCommit: () => true })).toBe(false);
    expect(m.storage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBe(raw);
    m.storage.setItem = set;
    expect(recoverWorld5Quiz({ storage: m.storage, canCommit: () => true })).toBe(true);
    expect(JSON.parse(m.storage.getItem(WORLD5_QUIZ_RECOVERY_KEY)!)).toEqual({ schemaVersion: 1, key: WORLD5_ROUNDS_STORAGE_KEY, raw });
    expect(m.storage.getItem(WORLD5_ROUNDS_STORAGE_KEY)).toBeNull();
    m.storage.setItem(WORLD5_QUIZ_STORAGE_KEY, "{another-broken-raw");
    expect(recoverWorld5Quiz({ storage: m.storage, canCommit: () => true })).toBe(false);
    expect(m.storage.getItem(WORLD5_QUIZ_STORAGE_KEY)).toBe("{another-broken-raw");
  });
  it("never resets a healthy quota or invents a score when storage is unavailable", () => {
    const m = memory(); m.round(0); const raw = readWorld5Rounds(m.storage).raw;
    expect(recoverWorld5Quiz({ storage: m.storage, canCommit: () => true })).toBe(false);
    expect(readWorld5Rounds(m.storage).raw).toBe(raw);
    expect(readWorld5Rounds(null)).toMatchObject({ status: "unavailable", eligible: false, score: 0 });
    m.storage.getItem = () => { throw Error("unavailable"); };
    expect(readWorld5Rounds(m.storage)).toMatchObject({ status: "unavailable", eligible: false });
    expect(m.commit({ kind: "begin_retry", actionId: "unknown", expectedRaw: null, roundId: null }).ok).toBe(false);
  });
  it("does not delete a healthy ledger that replaced corrupt bytes during recovery", () => {
    const m = memory(); m.round(0);
    const healthy = m.storage.getItem(WORLD5_ROUNDS_STORAGE_KEY)!;
    m.storage.setItem(WORLD5_ROUNDS_STORAGE_KEY, "{corrupt-before-other-writer");
    const get = m.storage.getItem; let reads = 0;
    m.storage.getItem = key => {
      if (key === WORLD5_ROUNDS_STORAGE_KEY && ++reads === 2) m.values.set(key, healthy);
      return get(key);
    };
    expect(recoverWorld5Quiz({ storage: m.storage, canCommit: () => true })).toBe(false);
    expect(m.values.get(WORLD5_ROUNDS_STORAGE_KEY)).toBe(healthy);
    expect(m.values.has(WORLD5_QUIZ_RECOVERY_KEY)).toBe(false);
  });
});
