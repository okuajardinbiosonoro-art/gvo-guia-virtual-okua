import type { LoadingInitialPhase } from "./LoadingInitial.types";

interface LoadingInitialTimelineStep {
  phase: LoadingInitialPhase;
  startMs: number;
  endMs: number;
}

export const TOTAL_DURATION_MS = 12000;
export const REDUCED_MOTION_DURATION_MS = 12000;

export const loadingInitialTimeline = {
  durationMs: TOTAL_DURATION_MS,
  durationSeconds: TOTAL_DURATION_MS / 1000,
  reducedMotionDurationMs: REDUCED_MOTION_DURATION_MS,
  maxDurationMs: 15000,
  maxDurationSeconds: 15,
  steps: [
    { phase: "loading_initial_enter", startMs: 0, endMs: 900 },
    { phase: "lia_entry_idle", startMs: 900, endMs: 4200 },
    { phase: "lia_prepare_watering", startMs: 4200, endMs: 5200 },
    { phase: "lia_watering", startMs: 5200, endMs: 8200 },
    { phase: "plant_growth", startMs: 6240, endMs: 8600 },
    { phase: "loading_complete", startMs: 8200, endMs: 10100 },
    { phase: "transition_to_intro", startMs: 10100, endMs: 12000 },
  ] satisfies LoadingInitialTimelineStep[],
} as const;
