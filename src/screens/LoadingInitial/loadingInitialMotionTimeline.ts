export const LOADING_INITIAL_MOTION_TIMELINE_VERSION = "v13";
export const WATER_DELAY_AFTER_TILT_MS = 160;

export const loadingInitialMotionTimeline = {
  version: LOADING_INITIAL_MOTION_TIMELINE_VERSION,
  totalDurationMs: 12000,
  reducedMotionDurationMs: 1300,
  phases: [
    { id: "initial_enter", startMs: 0, endMs: 900 },
    { id: "lia_entry_idle", startMs: 900, endMs: 3100 },
    { id: "lia_settle_hold", startMs: 3100, endMs: 4200 },
    { id: "lia_prepare_watering", startMs: 4200, endMs: 5200 },
    { id: "lia_watering", startMs: 5200, endMs: 8200 },
    { id: "observe_settle", startMs: 8200, endMs: 10100 },
    { id: "final_hold", startMs: 10100, endMs: 12000 },
  ],
  waterPulses: [
    {
      id: "watering_pulse_1",
      gestureStartMs: 5200,
      waterStartMs: 5360,
      waterEndMs: 6100,
      plantSettlesAfterMs: 6240,
    },
    {
      id: "watering_pulse_2",
      gestureStartMs: 6240,
      waterStartMs: 6360,
      waterEndMs: 6900,
      plantSettlesAfterMs: 7440,
    },
    {
      id: "watering_pulse_3",
      gestureStartMs: 7200,
      waterStartMs: 7320,
      waterEndMs: 8100,
      plantSettlesAfterMs: 8600,
    },
  ],
} as const;
