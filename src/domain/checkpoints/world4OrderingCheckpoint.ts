import type { ProgressStorage } from "../progress/progress.types";
import { createVersionedCheckpointStore } from "./checkpointStore";

export const WORLD4_ORDERING_STORAGE_KEY = "gvo.station4.ordering.v1";
export const WORLD4_ORDERING_REVISION = "OBS03.2";
export const WORLD4_ORDERING_DURATION_MS = 90_000;
export const WORLD4_ORDERING_TARGET = [
  "planta",
  "bionosificador",
  "esp32",
  "midi",
  "wifi_udp",
  "router",
  "sistema_central",
  "sonido",
] as const;
export type World4OrderingId = (typeof WORLD4_ORDERING_TARGET)[number];
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
    permutation.length === 8 &&
    WORLD4_ORDERING_TARGET.every((id, index) => permutation[index] === id)
  );
}

export function isWorld4OrderingState(
  value: unknown,
): value is World4OrderingState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const state = value as World4OrderingState;
  if (
    Object.keys(state).sort().join() !==
    Object.keys(freshWorld4OrderingState()).sort().join()
  )
    return false;
  if (
    state.schemaVersion !== 1 ||
    state.contractRevision !== WORLD4_ORDERING_REVISION ||
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
    state.permutation.length !== 8 ||
    new Set(state.permutation).size !== 8 ||
    !WORLD4_ORDERING_TARGET.every((id) => state.permutation.includes(id)) ||
    !(
      state.selectedObjectId === null ||
      WORLD4_ORDERING_TARGET.includes(state.selectedObjectId)
    ) ||
    !Number.isFinite(state.remainingActiveMs) ||
    state.remainingActiveMs < 0 ||
    state.remainingActiveMs > WORLD4_ORDERING_DURATION_MS ||
    !Number.isInteger(state.reviewIndex) ||
    state.reviewIndex < 0 ||
    state.reviewIndex > 7 ||
    !Array.isArray(state.confirmedReviewSteps) ||
    state.confirmedReviewSteps.length > 8 ||
    !state.confirmedReviewSteps.every(
      (id, index) => id === WORLD4_ORDERING_TARGET[index],
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
    !isWorld4OrderingSolved(state.permutation) ||
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
    (state.confirmedReviewSteps.length !== 8 || state.reviewIndex !== 7)
  )
    return false;
  return state.confirmedReviewSteps.length <= state.reviewIndex + 1;
}

const sameState = (left: World4OrderingState, right: World4OrderingState) =>
  JSON.stringify(left) === JSON.stringify(right);
const store = createVersionedCheckpointStore<World4OrderingState>({
  key: WORLD4_ORDERING_STORAGE_KEY,
  schemaVersion: 1,
  isCheckpoint: isWorld4OrderingState,
  matches: sameState,
  sameStableState: sameState,
});
export const readWorld4OrderingCheckpoint = store.read;
export const removeWorld4OrderingCheckpoint = store.remove;
export function writeWorld4OrderingCheckpoint(
  state: World4OrderingState,
  storage?: ProgressStorage | null,
) {
  return store.write(state, storage);
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
