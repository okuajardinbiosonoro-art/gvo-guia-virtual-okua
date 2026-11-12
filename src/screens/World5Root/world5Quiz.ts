import type { ProgressStorage } from "../../domain/progress/progress.types";
import type { Station5AreaId } from "./station5Content";

/** Separate from historical area exploration: visiting an area is not an answer. */
export const WORLD5_QUIZ_STORAGE_KEY = "gvo.station5.quiz.v1";
export const WORLD5_QUIZ_AREA_ORDER = [
  "plantas",
  "sistema",
  "espacio",
  "visitante",
] as const;
export type World5Quiz = {
  schemaVersion: 1;
  correctAnswers: Station5AreaId[];
  answeredQuestions: Station5AreaId[];
  skippedQuestions: Station5AreaId[];
};
export type World5QuizRead = {
  status: "ok" | "empty" | "unavailable" | "corrupt";
  quiz: World5Quiz;
};
export type World5QuizWrite =
  | { ok: true; quiz: World5Quiz; awarded: boolean }
  | { ok: false; quiz: World5Quiz };
export const emptyWorld5Quiz = (): World5Quiz => ({
  schemaVersion: 1,
  correctAnswers: [],
  answeredQuestions: [],
  skippedQuestions: [],
});
function defaultStorage(): ProgressStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
function isArea(value: unknown): value is Station5AreaId {
  return (
    typeof value === "string" &&
    (WORLD5_QUIZ_AREA_ORDER as readonly string[]).includes(value)
  );
}
function valid(value: unknown): value is World5Quiz {
  if (!value || typeof value !== "object") return false;
  const quiz = value as Partial<World5Quiz>;
  return (
    quiz.schemaVersion === 1 &&
    Array.isArray(quiz.correctAnswers) &&
    Array.isArray(quiz.answeredQuestions) &&
    Array.isArray(quiz.skippedQuestions) &&
    quiz.correctAnswers.every(isArea) &&
    quiz.answeredQuestions.every(isArea) &&
    new Set(quiz.answeredQuestions).size === quiz.answeredQuestions.length &&
    quiz.correctAnswers.every((id) => quiz.answeredQuestions!.includes(id)) &&
    quiz.skippedQuestions.every(isArea) &&
    new Set(quiz.correctAnswers).size === quiz.correctAnswers.length &&
    new Set(quiz.skippedQuestions).size === quiz.skippedQuestions.length &&
    !quiz.correctAnswers.some((id) => quiz.skippedQuestions!.includes(id))
  );
}
export function readWorld5Quiz(storage = defaultStorage()): World5QuizRead {
  if (!storage) return { status: "unavailable", quiz: emptyWorld5Quiz() };
  let raw: string | null;
  try {
    raw = storage.getItem(WORLD5_QUIZ_STORAGE_KEY);
  } catch {
    return { status: "unavailable", quiz: emptyWorld5Quiz() };
  }
  if (raw === null) return { status: "empty", quiz: emptyWorld5Quiz() };
  try {
    const parsed: unknown = JSON.parse(raw);
    return valid(parsed)
      ? { status: "ok", quiz: parsed }
      : { status: "corrupt", quiz: emptyWorld5Quiz() };
  } catch {
    return { status: "corrupt", quiz: emptyWorld5Quiz() };
  }
}
/** Explicit local recovery; the journey and historical area evidence are preserved. */
export function removeWorld5Quiz(storage = defaultStorage()): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(WORLD5_QUIZ_STORAGE_KEY);
    return storage.getItem(WORLD5_QUIZ_STORAGE_KEY) === null;
  } catch {
    return false;
  }
}
export function updateWorld5Quiz(
  action:
    | { kind: "correct" | "incorrect" | "skip"; area: Station5AreaId }
    | { kind: "skip_remaining" },
  storage = defaultStorage(),
): World5QuizWrite {
  const read = readWorld5Quiz(storage);
  if (!storage || read.status === "unavailable" || read.status === "corrupt")
    return { ok: false, quiz: read.quiz };
  const current = read.quiz;
  const correct = new Set(current.correctAnswers);
  const answered = new Set(current.answeredQuestions);
  const skipped = new Set(current.skippedQuestions);
  let awarded = false;
  if (action.kind === "correct") {
    awarded = !correct.has(action.area);
    correct.add(action.area);
    answered.add(action.area);
    skipped.delete(action.area);
  } else if (action.kind === "incorrect") {
    answered.add(action.area);
    skipped.delete(action.area);
  } else if (action.kind === "skip") {
    if (!correct.has(action.area)) skipped.add(action.area);
  } else {
    WORLD5_QUIZ_AREA_ORDER.forEach((id) => {
      if (!correct.has(id)) skipped.add(id);
    });
  }
  const next: World5Quiz = {
    schemaVersion: 1,
    answeredQuestions: WORLD5_QUIZ_AREA_ORDER.filter((id) => answered.has(id)),
    correctAnswers: WORLD5_QUIZ_AREA_ORDER.filter((id) => correct.has(id)),
    skippedQuestions: WORLD5_QUIZ_AREA_ORDER.filter((id) => skipped.has(id)),
  };
  try {
    storage.setItem(WORLD5_QUIZ_STORAGE_KEY, JSON.stringify(next));
    const verified = readWorld5Quiz(storage);
    if (
      verified.status !== "ok" ||
      JSON.stringify(verified.quiz) !== JSON.stringify(next)
    )
      return { ok: false, quiz: current };
    return { ok: true, quiz: verified.quiz, awarded };
  } catch {
    return { ok: false, quiz: current };
  }
}

/** OBS05: the v1 record above is historical, never a source of same-round prizes. */
export const WORLD5_ROUNDS_STORAGE_KEY = "gvo.station5.quiz.v2";
export const WORLD5_QUIZ_RECOVERY_KEY = "gvo.station5.quiz.recovery.v1";
export const WORLD5_ROUNDS_REVISION = "OBS05-V-1";
export type World5RoundOutcome = {
  kind: "correct" | "incorrect" | "skipped";
  choice: "agreement" | "disagreement" | null;
  actionId: string;
};
export type World5Round = {
  roundId: string;
  roundIndex: number;
  status: "active" | "complete";
  startedByActionId: string | null;
  outcomes: Partial<Record<Station5AreaId, World5RoundOutcome>>;
  completionReceipt: string | null;
};
export type World5RoundLedger = {
  schemaVersion: 2;
  policy: "COMPLETE_ROUND";
  contentRevision: typeof WORLD5_ROUNDS_REVISION;
  revision: number;
  rounds: World5Round[];
  seenActionIds: string[];
  // Exact source bytes provide provenance without inferring historical rounds.
  legacySource: { status: "ok" | "empty"; raw: string | null };
};
export type World5RoundsRead = {
  status: "ok" | "empty" | "legacy" | "corrupt" | "unavailable";
  raw: string | null;
  ledger: World5RoundLedger | null;
  quiz: World5Quiz;
  legacyQuiz: World5Quiz;
  round: World5Round | null;
  roundNumber: number;
  score: number;
  complete: boolean;
  eligible: boolean;
  canRetry: boolean;
};
export type World5RoundCommand = {
  actionId: string;
  expectedRaw: string | null;
  roundId: string | null;
} & (
  | { kind: "answer"; area: Station5AreaId; side: "agreement" | "disagreement" }
  | { kind: "skip"; area: Station5AreaId }
  | { kind: "finish_round" | "begin_retry" }
);
export type World5RoundsWrite =
  | { ok: true; read: World5RoundsRead; alreadyApplied: boolean; awarded: boolean }
  | { ok: false; read: World5RoundsRead; reason: "inactive" | "storage_unverified" | "conflict" | "out_of_order" };
const actionIdValid = (id: unknown): id is string => typeof id === "string" && id.length > 0 && id.length <= 160;
const exactKeys = (value: object, keys: readonly string[]) => Object.keys(value).length === keys.length && Object.keys(value).every(key => keys.includes(key));
const roundScore = (round: World5Round) => Object.values(round.outcomes).filter(value => value.kind === "correct").length;
function parseRoundLedger(raw: string): World5RoundLedger | null {
  try {
    const l = JSON.parse(raw) as World5RoundLedger;
    if (!l || !exactKeys(l, ["schemaVersion", "policy", "contentRevision", "revision", "rounds", "seenActionIds", "legacySource"]) || l.schemaVersion !== 2 || l.policy !== "COMPLETE_ROUND" || l.contentRevision !== WORLD5_ROUNDS_REVISION || !Number.isSafeInteger(l.revision) || !Array.isArray(l.rounds) || l.rounds.length < 1 || l.rounds.length > 4 || !Array.isArray(l.seenActionIds) || l.seenActionIds.length > 23 || !l.seenActionIds.every(actionIdValid) || new Set(l.seenActionIds).size !== l.seenActionIds.length || l.revision !== l.seenActionIds.length) return null;
    if (!l.legacySource || !exactKeys(l.legacySource, ["status", "raw"]) || !["ok", "empty"].includes(l.legacySource.status) || (l.legacySource.status === "empty" ? l.legacySource.raw !== null : typeof l.legacySource.raw !== "string")) return null;
    if (l.legacySource.status === "ok") {
      if (!valid(JSON.parse(l.legacySource.raw!))) return null;
    }
    const events: string[] = [], roundIds = new Set<string>();
    for (const [index, r] of l.rounds.entries()) {
      if (!r || !exactKeys(r, ["roundId", "roundIndex", "status", "startedByActionId", "outcomes", "completionReceipt"]) || r.roundIndex !== index || typeof r.roundId !== "string" || r.roundId.length < 1 || r.roundId.length > 192 || roundIds.has(r.roundId) || !["active", "complete"].includes(r.status) || !r.outcomes || typeof r.outcomes !== "object" || Array.isArray(r.outcomes)) return null;
      roundIds.add(r.roundId);
      if (index === 0 ? r.startedByActionId !== null : !actionIdValid(r.startedByActionId)) return null;
      if (r.startedByActionId) events.push(r.startedByActionId);
      const keys = Object.keys(r.outcomes);
      if (keys.some((key, i) => key !== WORLD5_QUIZ_AREA_ORDER[i])) return null;
      for (const id of keys as Station5AreaId[]) {
        const o = r.outcomes[id]!;
        if (!o || !exactKeys(o, ["kind", "choice", "actionId"]) || !actionIdValid(o.actionId) || !(o.kind === "correct" ? o.choice === "agreement" : o.kind === "incorrect" ? o.choice === "disagreement" : o.kind === "skipped" && o.choice === null)) return null;
        events.push(o.actionId);
      }
      if (r.status === "complete") {
        if (keys.length !== 4 || !actionIdValid(r.completionReceipt)) return null;
        events.push(r.completionReceipt);
      } else if (r.completionReceipt !== null || index !== l.rounds.length - 1 || (index === 0 && keys.length === 0)) return null;
      if (index < l.rounds.length - 1 && (r.status !== "complete" || roundScore(r) === 4)) return null;
    }
    return JSON.stringify(events) === JSON.stringify(l.seenActionIds) ? l : null;
  } catch { return null; }
}
function roundProjection(round: World5Round | null): World5Quiz {
  const quiz = emptyWorld5Quiz();
  for (const id of WORLD5_QUIZ_AREA_ORDER) {
    const outcome = round?.outcomes[id];
    if (outcome?.kind === "skipped") quiz.skippedQuestions.push(id);
    else if (outcome) {
      quiz.answeredQuestions.push(id);
      if (outcome.kind === "correct") quiz.correctAnswers.push(id);
    }
  }
  return quiz;
}
export function readWorld5Rounds(storage = defaultStorage()): World5RoundsRead {
  let raw: string | null = null, ledger: World5RoundLedger | null = null;
  let status: World5RoundsRead["status"] = "unavailable", legacyQuiz = emptyWorld5Quiz();
  try {
    if (storage) {
      raw = storage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
      if (raw !== null) {
        ledger = parseRoundLedger(raw);
        status = ledger ? "ok" : "corrupt";
        if (ledger?.legacySource.status === "ok") legacyQuiz = JSON.parse(ledger.legacySource.raw!) as World5Quiz;
      } else {
        const legacy = readWorld5Quiz(storage);
        legacyQuiz = legacy.quiz;
        status = legacy.status === "ok" ? "legacy" : legacy.status;
      }
    }
  } catch { status = "unavailable"; }
  const round = ledger?.rounds.at(-1) ?? null;
  const quiz = roundProjection(round), score = quiz.correctAnswers.length;
  const complete = status === "ok" && round?.status === "complete";
  const eligible = complete && score === 4;
  return { status, raw, ledger, round, quiz, legacyQuiz, roundNumber: (round?.roundIndex ?? 0) + 1, score, complete, eligible, canRetry: Boolean(complete && !eligible && ledger!.rounds.length < 4) };
}
/** First essential confirmations require an actual outcome, never a route or score. */
export function hasWorld5ParticipationProof(area: Station5AreaId, storage = defaultStorage()): boolean {
  const read = readWorld5Rounds(storage);
  if (read.status === "ok") return Boolean(read.round?.outcomes[area]);
  if (read.status !== "legacy") return false;
  return [...read.legacyQuiz.answeredQuestions, ...read.legacyQuiz.skippedQuestions].includes(area);
}
/** A caller-owned guard avoids a dependency cycle with journeyEssential. */
export function mutateWorld5Rounds(
  command: World5RoundCommand,
  dependencies: { canCommit: () => boolean; storage?: ProgressStorage | null },
): World5RoundsWrite {
  const storage = dependencies.storage === undefined ? defaultStorage() : dependencies.storage;
  const read = readWorld5Rounds(storage);
  const fail = (reason: Extract<World5RoundsWrite, { ok: false }>["reason"]): World5RoundsWrite => ({ ok: false, read, reason });
  if (!dependencies.canCommit()) return fail("inactive");
  if (!storage || read.status === "corrupt" || read.status === "unavailable") return fail("storage_unverified");
  if (!actionIdValid(command.actionId)) return fail("conflict");
  if (read.ledger?.seenActionIds.includes(command.actionId)) {
    // A duplicate must name the same operation, not merely reuse its identifier.
    const round = read.ledger.rounds.find(r => r.startedByActionId === command.actionId || r.completionReceipt === command.actionId || Object.values(r.outcomes).some(o => o.actionId === command.actionId));
    const outcome = round && "area" in command ? round.outcomes[command.area] : null;
    const sameRound = round && (command.roundId === round.roundId || (command.roundId === null && round.roundIndex === 0 && round.roundId === `${command.actionId}:round:0`));
    let same = false;
    if (command.kind === "begin_retry") {
      same = Boolean(round?.startedByActionId === command.actionId && read.ledger.rounds[round.roundIndex - 1]?.roundId === command.roundId);
    } else if (command.kind === "finish_round") {
      same = Boolean(sameRound && round?.completionReceipt === command.actionId);
    } else if (command.kind === "skip") {
      same = Boolean(sameRound && outcome?.actionId === command.actionId && outcome.kind === "skipped");
    } else if (command.kind === "answer") {
      same = Boolean(sameRound && outcome?.actionId === command.actionId && outcome.choice === command.side);
    }
    return same ? { ok: true, read, alreadyApplied: true, awarded: false } : fail("conflict");
  }
  if (read.raw !== command.expectedRaw || (read.round?.roundId ?? null) !== command.roundId) return fail("conflict");
  let legacyRaw: string | null = null;
  try { if (!read.ledger) legacyRaw = storage.getItem(WORLD5_QUIZ_STORAGE_KEY); } catch { return fail("storage_unverified"); }
  const next: World5RoundLedger = read.ledger ? structuredClone(read.ledger) : {
    schemaVersion: 2, policy: "COMPLETE_ROUND", contentRevision: WORLD5_ROUNDS_REVISION, revision: 0,
    rounds: [{ roundId: `${command.actionId}:round:0`, roundIndex: 0, status: "active", startedByActionId: null, outcomes: {}, completionReceipt: null }],
    seenActionIds: [], legacySource: { status: read.status === "legacy" ? "ok" : "empty", raw: legacyRaw },
  };
  const round = next.rounds.at(-1)!;
  let awarded = false;
  if (command.kind === "answer" || command.kind === "skip") {
    const expectedArea = WORLD5_QUIZ_AREA_ORDER.find(id => !round.outcomes[id]);
    if (round.status !== "active" || command.area !== expectedArea) return fail("out_of_order");
    const kind = command.kind === "skip" ? "skipped" : command.side === "agreement" ? "correct" : "incorrect";
    round.outcomes[command.area] = { kind, choice: command.kind === "skip" ? null : command.side, actionId: command.actionId };
    awarded = kind === "correct";
  } else if (command.kind === "finish_round") {
    if (!read.ledger || round.status !== "active" || Object.keys(round.outcomes).length !== 4) return fail("out_of_order");
    round.status = "complete";
    round.completionReceipt = command.actionId;
  } else {
    if (!read.canRetry) return fail("out_of_order");
    next.rounds.push({ roundId: `${command.actionId}:round:${next.rounds.length}`, roundIndex: next.rounds.length, status: "active", startedByActionId: command.actionId, outcomes: {}, completionReceipt: null });
  }
  next.seenActionIds.push(command.actionId);
  next.revision++;
  const raw = JSON.stringify(next);
  if (!parseRoundLedger(raw)) return fail("out_of_order");
  try {
    if (!dependencies.canCommit()) return fail("inactive");
    if (storage.getItem(WORLD5_ROUNDS_STORAGE_KEY) !== read.raw || (!read.ledger && storage.getItem(WORLD5_QUIZ_STORAGE_KEY) !== legacyRaw)) return fail("conflict");
    if (!dependencies.canCommit()) return fail("inactive");
    storage.setItem(WORLD5_ROUNDS_STORAGE_KEY, raw);
    if (!dependencies.canCommit()) return fail("inactive");
    if (storage.getItem(WORLD5_ROUNDS_STORAGE_KEY) !== raw) return fail("storage_unverified");
    const verified = readWorld5Rounds(storage);
    if (!dependencies.canCommit()) return fail("inactive");
    if (verified.status !== "ok" || verified.raw !== raw) return fail("storage_unverified");
    return { ok: true, read: verified, alreadyApplied: false, awarded };
  } catch { return fail("storage_unverified"); }
}
/** Recovery is available only for corrupt bytes, never to reset a healthy quota. */
export function recoverWorld5Quiz(dependencies: { canCommit: () => boolean; storage?: ProgressStorage | null }): boolean {
  const storage = dependencies.storage === undefined ? defaultStorage() : dependencies.storage;
  if (!storage || !dependencies.canCommit()) return false;
  try {
    const observedV2 = storage.getItem(WORLD5_ROUNDS_STORAGE_KEY);
    const key = observedV2 !== null ? WORLD5_ROUNDS_STORAGE_KEY : WORLD5_QUIZ_STORAGE_KEY;
    const raw = observedV2 ?? storage.getItem(key);
    if (raw === null) return false;
    if (key === WORLD5_ROUNDS_STORAGE_KEY) {
      if (parseRoundLedger(raw)) return false;
    } else {
      try { if (valid(JSON.parse(raw))) return false; } catch { /* Preserve these exact corrupt bytes in the backup. */ }
    }
    const backup = JSON.stringify({ schemaVersion: 1, key, raw });
    const oldBackup = storage.getItem(WORLD5_QUIZ_RECOVERY_KEY);
    if (oldBackup !== null && oldBackup !== backup) return false;
    if (!dependencies.canCommit() || storage.getItem(WORLD5_ROUNDS_STORAGE_KEY) !== observedV2 || storage.getItem(key) !== raw) return false;
    storage.setItem(WORLD5_QUIZ_RECOVERY_KEY, backup);
    if (storage.getItem(WORLD5_QUIZ_RECOVERY_KEY) !== backup || !dependencies.canCommit() || storage.getItem(WORLD5_ROUNDS_STORAGE_KEY) !== observedV2 || storage.getItem(key) !== raw) return false;
    storage.removeItem(key);
    return dependencies.canCommit() && storage.getItem(key) === null;
  } catch { return false; }
}
