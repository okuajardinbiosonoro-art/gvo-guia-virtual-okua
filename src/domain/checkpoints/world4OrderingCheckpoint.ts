import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD4_ORDERING_STORAGE_KEY = "gvo.station4.ordering.v1";
export const WORLD4_ORDERING_REVISION = "GVO-IV-6";
export const WORLD4_ORDERING_DURATION_MS = 90_000;
export const LEGACY_WORLD4_ORDERING_TARGET = [
  "planta",
  "bionosificador",
  "esp32",
  "midi",
  "wifi_udp",
  "router",
  "sistema_central",
  "sonido",
] as const;
export const WORLD4_ORDERING_TARGET = LEGACY_WORLD4_ORDERING_TARGET.filter(
  (id) => id !== "midi" && id !== "wifi_udp",
);
export const WORLD4_ORDERING_LAST_INDEX = WORLD4_ORDERING_TARGET.length - 1;
export type World4OrderingId = (typeof WORLD4_ORDERING_TARGET)[number];
export function isWorld4OrderingId(id: unknown): id is World4OrderingId {
  return WORLD4_ORDERING_TARGET.some((item) => item === id);
}
export type World4OrderingOutcome =
  | "solved_by_visitor"
  | "assisted_timeout"
  | "assisted_requested";
export type World4OrderingPhase =
  | "introduction"
  | "playing"
  | "paused"
  | "auto_ordering"
  | "review"
  | "success"
  | "closed";
export type World4OrderingState = Readonly<{
  schemaVersion: 1;
  contractRevision: typeof WORLD4_ORDERING_REVISION;
  phase: World4OrderingPhase;
  permutation: readonly World4OrderingId[];
  selectedObjectId: World4OrderingId | null;
  remainingActiveMs: number;
  reviewIndex: number;
  confirmedReviewSteps: readonly World4OrderingId[];
  outcome: World4OrderingOutcome | null;
  closed: boolean;
}>;

export function freshWorld4OrderingState(): World4OrderingState {
  return {
    schemaVersion: 1,
    contractRevision: WORLD4_ORDERING_REVISION,
    phase: "introduction",
    permutation: [...WORLD4_ORDERING_TARGET],
    selectedObjectId: null,
    remainingActiveMs: WORLD4_ORDERING_DURATION_MS,
    reviewIndex: 0,
    confirmedReviewSteps: [],
    outcome: null,
    closed: false,
  };
}

export function isWorld4OrderingSolved(
  permutation: readonly World4OrderingId[],
) {
  return (
    permutation.length === WORLD4_ORDERING_TARGET.length &&
    WORLD4_ORDERING_TARGET.every((id, index) => permutation[index] === id)
  );
}

export function isWorld4OrderingState(
  value: unknown,
): value is World4OrderingState {
  return matchesOrderingContract(value, WORLD4_ORDERING_REVISION, WORLD4_ORDERING_TARGET);
}

type LegacyOrderingState = Omit<World4OrderingState, "contractRevision" | "permutation" | "selectedObjectId" | "confirmedReviewSteps"> & {
  contractRevision: "OBS03.2";
  permutation: readonly (typeof LEGACY_WORLD4_ORDERING_TARGET)[number][];
  selectedObjectId: (typeof LEGACY_WORLD4_ORDERING_TARGET)[number] | null;
  confirmedReviewSteps: readonly (typeof LEGACY_WORLD4_ORDERING_TARGET)[number][];
};

function matchesOrderingContract(value: unknown, revision: string, target: readonly string[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const state = value as World4OrderingState | LegacyOrderingState;
  const count = target.length;
  if (
    Object.keys(state).sort().join() !==
    Object.keys(freshWorld4OrderingState()).sort().join()
  )
    return false;
  if (
    state.schemaVersion !== 1 ||
    state.contractRevision !== revision ||
    ![
      "introduction",
      "playing",
      "paused",
      "auto_ordering",
      "review",
      "success",
      "closed",
    ].includes(state.phase) ||
    !Array.isArray(state.permutation) ||
    state.permutation.length !== count ||
    new Set(state.permutation).size !== count ||
    !target.every((id) => state.permutation.some((piece) => piece === id)) ||
    !(
      state.selectedObjectId === null ||
      target.includes(state.selectedObjectId)
    ) ||
    !Number.isFinite(state.remainingActiveMs) ||
    state.remainingActiveMs < 0 ||
    state.remainingActiveMs > WORLD4_ORDERING_DURATION_MS ||
    !Number.isInteger(state.reviewIndex) ||
    state.reviewIndex < 0 ||
    state.reviewIndex >= count ||
    !Array.isArray(state.confirmedReviewSteps) ||
    state.confirmedReviewSteps.length > count ||
    !state.confirmedReviewSteps.every(
      (id, index) => id === target[index],
    ) ||
    ![
      null,
      "solved_by_visitor",
      "assisted_timeout",
      "assisted_requested",
    ].includes(state.outcome) ||
    state.closed !== (state.phase === "closed")
  )
    return false;
  if (["introduction", "playing", "paused"].includes(state.phase))
    return (
      state.outcome === null &&
      state.confirmedReviewSteps.length === 0 &&
      state.reviewIndex === 0
    );
  if (
    !state.outcome ||
    !target.every((id, index) => state.permutation[index] === id) ||
    state.selectedObjectId !== null
  )
    return false;
  if (state.phase === "success" && state.outcome !== "solved_by_visitor")
    return false;
  if (
    state.phase === "review" &&
    state.confirmedReviewSteps.length !== state.reviewIndex
  )
    return false;
  if (
    state.phase === "auto_ordering" &&
    (state.outcome === "solved_by_visitor" ||
      state.reviewIndex !== 0 ||
      state.confirmedReviewSteps.length !== 0)
  )
    return false;
  if (state.outcome === "solved_by_visitor" && state.remainingActiveMs <= 0)
    return false;
  if (state.outcome === "assisted_timeout" && state.remainingActiveMs !== 0)
    return false;
  if (
    state.closed &&
    state.outcome !== "solved_by_visitor" &&
    (state.confirmedReviewSteps.length !== count || state.reviewIndex !== count - 1)
  )
    return false;
  return state.confirmedReviewSteps.length <= state.reviewIndex + 1;
}

type StoredOrderingState = World4OrderingState | LegacyOrderingState;
const sameState = (left: StoredOrderingState, right: StoredOrderingState) =>
  JSON.stringify(left) === JSON.stringify(right);
const store = createVersionedCheckpointStore<StoredOrderingState>({
  key: WORLD4_ORDERING_STORAGE_KEY,
  schemaVersion: 1,
  isCheckpoint: (value): value is StoredOrderingState =>
    isWorld4OrderingState(value) || matchesOrderingContract(value, "OBS03.2", LEGACY_WORLD4_ORDERING_TARGET),
  matches: sameState,
  sameStableState: sameState,
});
function adaptOrderingState(state: StoredOrderingState): World4OrderingState {
  if (state.contractRevision === WORLD4_ORDERING_REVISION) return state;
  const permutation = state.permutation.filter(isWorld4OrderingId);
  const confirmedReviewSteps = state.confirmedReviewSteps.filter(isWorld4OrderingId);
  // A puzzle still in progress needs a real move even if the removed pieces
  // were the only ones out of place.
  const reseed = (state.phase === "playing" || state.phase === "paused") && isWorld4OrderingSolved(permutation);
  if (reseed) permutation.push(permutation.shift()!);
  return {
    ...state,
    contractRevision: WORLD4_ORDERING_REVISION,
    permutation,
    confirmedReviewSteps,
    selectedObjectId: !reseed && isWorld4OrderingId(state.selectedObjectId) ? state.selectedObjectId : null,
    reviewIndex: state.phase === "review" || state.closed
      ? Math.min(confirmedReviewSteps.length, WORLD4_ORDERING_LAST_INDEX)
      : 0,
  };
}

export function readWorld4OrderingCheckpoint(storage?: ProgressStorage | null) {
  const result = store.read(storage);
  return result.status === "ok" ? { ...result, checkpoint: adaptOrderingState(result.checkpoint) } : result;
}
export const removeWorld4OrderingCheckpoint = store.remove;
export function writeWorld4OrderingCheckpoint(
  state: World4OrderingState,
  storage?: ProgressStorage | null,
) {
  const result = store.write(state, storage);
  return result.ok ? { ...result, checkpoint: adaptOrderingState(result.checkpoint) } : result;
}

/** A reload never spends hidden/wall-clock time or replays an interrupted auto-order. */
export function restoreWorld4OrderingState(
  state: World4OrderingState,
): World4OrderingState {
  if (state.phase === "playing")
    return { ...state, phase: "paused", selectedObjectId: null };
  if (state.phase === "auto_ordering")
    return {
      ...state,
      phase: "review",
      permutation: [...WORLD4_ORDERING_TARGET],
    };
  return state;
}
