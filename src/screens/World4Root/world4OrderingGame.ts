import {
  WORLD4_ORDERING_TARGET,
  isWorld4OrderingSolved,
  type World4OrderingId,
  type World4OrderingState,
} from "../../domain/checkpoints/world4OrderingCheckpoint";

export type World4OrderingAction =
  | { type: "start"; random?: () => number }
  | { type: "select"; id: World4OrderingId }
  | {
      type:
        | "cancel"
        | "pause"
        | "resume"
        | "help"
        | "tick"
        | "settle_auto"
        | "next_review"
        | "review"
        | "close";
    };

function assist(
  state: World4OrderingState,
  timeout: boolean,
): World4OrderingState {
  return {
    ...state,
    phase: "auto_ordering",
    permutation: [...WORLD4_ORDERING_TARGET],
    selectedObjectId: null,
    reviewIndex: 0,
    confirmedReviewSteps: [],
    outcome: timeout ? "assisted_timeout" : "assisted_requested",
    remainingActiveMs: timeout ? 0 : state.remainingActiveMs,
  };
}

/** Elapsed time is a monotonic active-segment delta supplied by the view. */
export function reduceWorld4Ordering(
  state: World4OrderingState,
  action: World4OrderingAction,
  elapsedMs = 0,
): World4OrderingState {
  let next = state;
  if (next.phase === "playing") {
    next = {
      ...next,
      remainingActiveMs: Math.max(
        0,
        next.remainingActiveMs - Math.max(0, elapsedMs),
      ),
    };
    if (next.remainingActiveMs <= 0) return assist(next, true);
  }
  if (action.type === "start" && next.phase === "introduction") {
    const permutation: World4OrderingId[] = [...WORLD4_ORDERING_TARGET];
    const random = action.random ?? Math.random;
    for (let index = permutation.length - 1; index > 0; index -= 1) {
      const target = Math.min(
        index,
        Math.max(0, Math.floor(random() * (index + 1))),
      );
      [permutation[index], permutation[target]] = [
        permutation[target],
        permutation[index],
      ];
    }
    if (isWorld4OrderingSolved(permutation))
      permutation.push(permutation.shift()!);
    return { ...next, permutation, phase: "playing" };
  }
  if (
    action.type === "help" &&
    ["introduction", "playing", "paused"].includes(next.phase)
  )
    return assist(next, false);
  if (action.type === "pause" && next.phase === "playing")
    return { ...next, phase: "paused" };
  if (action.type === "resume" && next.phase === "paused")
    return { ...next, phase: "playing" };
  if (action.type === "cancel" && next.phase === "playing")
    return { ...next, selectedObjectId: null };
  if (action.type === "select" && next.phase === "playing") {
    if (!next.selectedObjectId) return { ...next, selectedObjectId: action.id };
    if (next.selectedObjectId === action.id)
      return { ...next, selectedObjectId: null };
    const permutation = [...next.permutation];
    const first = permutation.indexOf(next.selectedObjectId);
    const second = permutation.indexOf(action.id);
    [permutation[first], permutation[second]] = [
      permutation[second],
      permutation[first],
    ];
    const solved = isWorld4OrderingSolved(permutation);
    return {
      ...next,
      permutation,
      selectedObjectId: null,
      phase: solved ? "success" : "playing",
      outcome: solved ? "solved_by_visitor" : null,
    };
  }
  if (action.type === "settle_auto" && next.phase === "auto_ordering")
    return { ...next, phase: "review" };
  if (action.type === "review" && next.phase === "success")
    return {
      ...next,
      phase: "review",
      reviewIndex: 0,
      confirmedReviewSteps: [],
    };
  if (
    action.type === "next_review" &&
    next.phase === "review" &&
    next.reviewIndex < 7
  )
    return {
      ...next,
      reviewIndex: next.reviewIndex + 1,
      confirmedReviewSteps: WORLD4_ORDERING_TARGET.slice(
        0,
        next.reviewIndex + 1,
      ),
    };
  if (
    action.type === "close" &&
    (next.phase === "success" ||
      (next.phase === "review" && next.reviewIndex === 7))
  )
    return {
      ...next,
      phase: "closed",
      closed: true,
      confirmedReviewSteps:
        next.phase === "review"
          ? [...WORLD4_ORDERING_TARGET]
          : next.confirmedReviewSteps,
    };
  return next;
}
