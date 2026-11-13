import type { ProgressStorage } from "../progress/progress.types";
import { LEGACY_WORLD4_ORDERING_TARGET, WORLD4_ORDERING_TARGET, isWorld4OrderingId, readWorld4OrderingCheckpoint, type World4OrderingId } from "./world4OrderingCheckpoint";

export const WORLD4_EXPLANATION_STORAGE_KEY = "gvo.station4.explanation.v1";
export const WORLD4_EXPLANATION_REVISION = "GVO-IV-6";
export type World4ExplanationCheckpoint = Readonly<{
  schemaVersion: 1;
  contentRevision: typeof WORLD4_EXPLANATION_REVISION;
  revision: number;
  presentedStepIds: readonly World4OrderingId[];
  confirmedStepIds: readonly World4OrderingId[];
  activeStepId: World4OrderingId | null;
  complete: boolean;
}>;
export type World4ExplanationRead = {
  status: "empty" | "ok" | "invalid" | "unavailable";
  checkpoint: World4ExplanationCheckpoint;
  raw: string | null;
};
export function freshWorld4ExplanationCheckpoint(): World4ExplanationCheckpoint {
  return { schemaVersion: 1, contentRevision: WORLD4_EXPLANATION_REVISION, revision: 0,
    presentedStepIds: [], confirmedStepIds: [], activeStepId: WORLD4_ORDERING_TARGET[0], complete: false };
}
export function isWorld4ExplanationCheckpoint(value: unknown): value is World4ExplanationCheckpoint {
  return matchesExplanationContract(value, WORLD4_EXPLANATION_REVISION, WORLD4_ORDERING_TARGET);
}
function matchesExplanationContract(value: unknown, revision: string, target: readonly string[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const state = value as World4ExplanationCheckpoint;
  if (Object.keys(state).sort().join() !== Object.keys(freshWorld4ExplanationCheckpoint()).sort().join() ||
      state.schemaVersion !== 1 || state.contentRevision !== revision ||
      !Number.isSafeInteger(state.revision) || state.revision < 0 ||
      !Array.isArray(state.presentedStepIds) || !Array.isArray(state.confirmedStepIds)) return false;
  const presented = state.presentedStepIds, confirmed = state.confirmedStepIds;
  return presented.length <= target.length && confirmed.length <= presented.length && presented.length <= confirmed.length + 1 &&
    presented.every((id, index) => id === target[index]) &&
    confirmed.every((id, index) => id === target[index]) &&
    state.activeStepId === (target[confirmed.length] ?? null) &&
    state.complete === (confirmed.length === target.length);
}
function browserStorage(): ProgressStorage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; } catch { return null; }
}
export function readWorld4ExplanationCheckpoint(storage: ProgressStorage | null = browserStorage()): World4ExplanationRead {
  const checkpoint = freshWorld4ExplanationCheckpoint();
  if (!storage) return { status: "unavailable", checkpoint, raw: null };
  let raw: string | null = null;
  try {
    raw = storage.getItem(WORLD4_EXPLANATION_STORAGE_KEY);
    if (raw === null) return { status: "empty", checkpoint, raw };
    const parsed: unknown = JSON.parse(raw);
    if (isWorld4ExplanationCheckpoint(parsed)) return { status: "ok", checkpoint: parsed, raw };
    if (matchesExplanationContract(parsed, "OBS04-IV-1", LEGACY_WORLD4_ORDERING_TARGET)) {
      const previous = parsed as Omit<World4ExplanationCheckpoint, "presentedStepIds" | "confirmedStepIds"> & {
        presentedStepIds: unknown[]; confirmedStepIds: unknown[];
      };
      const confirmedStepIds = previous.confirmedStepIds.filter(isWorld4OrderingId);
      const adapted: World4ExplanationCheckpoint = {
        ...previous,
        contentRevision: WORLD4_EXPLANATION_REVISION,
        presentedStepIds: previous.presentedStepIds.filter(isWorld4OrderingId),
        confirmedStepIds,
        activeStepId: WORLD4_ORDERING_TARGET[confirmedStepIds.length] ?? null,
        complete: confirmedStepIds.length === WORLD4_ORDERING_TARGET.length,
      };
      return { status: "ok", checkpoint: adapted, raw };
    }
    return { status: "invalid", checkpoint, raw };
  } catch { return { status: raw === null ? "unavailable" : "invalid", checkpoint, raw }; }
}
/** A synchronous compare/readback boundary, fenced by the caller's reset/attempt token. */
export function writeWorld4ExplanationCheckpoint(
  next: World4ExplanationCheckpoint,
  expectedRaw: string | null,
  isCurrent: () => boolean,
  storage: ProgressStorage | null = browserStorage(),
): { ok: boolean; reason?: string } {
  if (!storage || !isWorld4ExplanationCheckpoint(next)) return { ok: false, reason: "storage_unverified" };
  const raw = JSON.stringify(next);
  try {
    if (!isCurrent()) return { ok: false, reason: "stale_revision" };
    if (storage.getItem(WORLD4_EXPLANATION_STORAGE_KEY) !== expectedRaw) return { ok: false, reason: "stale_revision" };
    if (!isCurrent()) return { ok: false, reason: "stale_revision" };
    storage.setItem(WORLD4_EXPLANATION_STORAGE_KEY, raw);
    if (!isCurrent()) {
      // A reset may be reentrant in a storage backend. Remove only our own late
      // bytes; never restore a pre-reset value or overwrite another writer.
      if (storage.getItem(WORLD4_EXPLANATION_STORAGE_KEY) === raw) storage.removeItem(WORLD4_EXPLANATION_STORAGE_KEY);
      return { ok: false, reason: "stale_revision" };
    }
    const matches = storage.getItem(WORLD4_EXPLANATION_STORAGE_KEY) === raw;
    if (!isCurrent()) {
      if (storage.getItem(WORLD4_EXPLANATION_STORAGE_KEY) === raw) storage.removeItem(WORLD4_EXPLANATION_STORAGE_KEY);
      return { ok: false, reason: "stale_revision" };
    }
    return matches ? { ok: true } : { ok: false, reason: "storage_unverified" };
  } catch { return { ok: false, reason: "storage_unverified" }; }
}
/** New advances require both real explanatory confirmations and the existing game closure. */
export function hasWorld4NewAdvanceProof(expectedOutcome?: string | null) {
  const explanation = readWorld4ExplanationCheckpoint(), game = readWorld4OrderingCheckpoint();
  return explanation.status === "ok" && explanation.checkpoint.complete && game.status === "ok" && game.checkpoint.closed &&
    (expectedOutcome === undefined || expectedOutcome === (game.checkpoint.outcome === "solved_by_visitor" ? "solved" : "assisted_review_completed")) &&
    (game.checkpoint.outcome === "solved_by_visitor" ||
      (["assisted_timeout", "assisted_requested"].includes(game.checkpoint.outcome ?? "") && game.checkpoint.confirmedReviewSteps.length === WORLD4_ORDERING_TARGET.length));
}
