import type { LoadingInitialPhase } from "./LoadingInitial.types";

interface LoadingInitialTimelineStep {
  phase: LoadingInitialPhase;
  startMs: number;
  endMs: number;
}

export const TOTAL_DURATION_MS = 12000;
export const REDUCED_MOTION_DURATION_MS = 1300;

export const loadingInitialTimeline = {
  durationMs: TOTAL_DURATION_MS,
  durationSeconds: TOTAL_DURATION_MS / 1000,
  reducedMotionDurationMs: REDUCED_MOTION_DURATION_MS,
  maxDurationMs: 15000,
  maxDurationSeconds: 15,
  steps: [
    { phase: "loading_initial_enter", startMs: 0, endMs: 800 },
    { phase: "lia_entry_idle", startMs: 800, endMs: 3200 },
    { phase: "lia_prepare_watering", startMs: 3200, endMs: 4600 },
    { phase: "lia_watering", startMs: 4600, endMs: 8400 },
    { phase: "plant_growth", startMs: 5000, endMs: 8000 },
    { phase: "loading_complete", startMs: 8400, endMs: 10400 },
    { phase: "transition_to_intro", startMs: 10400, endMs: 12000 },
  ] satisfies LoadingInitialTimelineStep[],
} as const;
