import type { LoadingInitialPhase } from "./LoadingInitial.types";

interface LoadingInitialTimelineStep {
  phase: LoadingInitialPhase;
  start: number;
  end: number;
}

export const loadingInitialTimeline = {
  durationSeconds: 12,
  maxDurationSeconds: 15,
  steps: [
    { phase: "loading_initial_enter", start: 0, end: 0.4 },
    { phase: "lia_entry_idle", start: 0.4, end: 1.8 },
    { phase: "lia_prepare_watering", start: 1.8, end: 3.4 },
    { phase: "lia_watering", start: 3.4, end: 6.8 },
    { phase: "plant_growth", start: 3.4, end: 6.8 },
    { phase: "loading_complete", start: 6.8, end: 10.8 },
    { phase: "transition_to_intro", start: 10.8, end: 12 },
  ] satisfies LoadingInitialTimelineStep[],
} as const;
