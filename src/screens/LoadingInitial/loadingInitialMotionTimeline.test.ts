import { describe, expect, it } from "vitest";

import {
  WATER_DELAY_AFTER_TILT_MS,
  loadingInitialMotionTimeline,
} from "./loadingInitialMotionTimeline";
import { LIA_FRAME_REGISTRATION } from "./liaFrameRegistration";

describe("loadingInitialMotionTimeline", () => {
  it("mantiene timeline V13 de 12000ms y reduced motion de 1300ms", () => {
    expect(loadingInitialMotionTimeline.version).toBe("v13");
    expect(loadingInitialMotionTimeline.totalDurationMs).toBe(12000);
    expect(loadingInitialMotionTimeline.reducedMotionDurationMs).toBe(1300);
    expect(loadingInitialMotionTimeline.phases.at(0)?.startMs).toBe(0);
    expect(loadingInitialMotionTimeline.phases.at(-1)?.endMs).toBe(12000);
  });

  it("retrasa el agua despues de la inclinacion y deja crecer planta despues de cada pulso", () => {
    expect(WATER_DELAY_AFTER_TILT_MS).toBeGreaterThanOrEqual(120);
    expect(WATER_DELAY_AFTER_TILT_MS).toBeLessThanOrEqual(180);

    for (const pulse of loadingInitialMotionTimeline.waterPulses) {
      expect(pulse.waterStartMs - pulse.gestureStartMs).toBeGreaterThanOrEqual(
        120,
      );
      expect(pulse.waterStartMs - pulse.gestureStartMs).toBeLessThanOrEqual(
        180,
      );
      expect(pulse.waterEndMs).toBeGreaterThan(pulse.waterStartMs);
      expect(pulse.plantSettlesAfterMs).toBeGreaterThan(pulse.waterEndMs);
    }
  });

  it("define registration para los 16 frames sin offsets agresivos", () => {
    expect(LIA_FRAME_REGISTRATION.map((frame) => frame.frame)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
    ]);
    expect(new Set(LIA_FRAME_REGISTRATION.map((frame) => frame.phase))).toEqual(
      new Set(["idle", "prepare", "watering", "observe"]),
    );
  });
});
