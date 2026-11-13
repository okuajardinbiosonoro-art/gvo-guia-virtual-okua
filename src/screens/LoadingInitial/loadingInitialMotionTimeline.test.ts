import { describe, expect, it } from "vitest";

import {
  WATER_DELAY_AFTER_TILT_MS,
  loadingInitialMotionTimeline,
} from "./loadingInitialMotionTimeline";
import { LIA_FRAME_REGISTRATION } from "./liaFrameRegistration";

describe("loadingInitialMotionTimeline", () => {
  it("mantiene timeline natural V14 de 6000ms y mínimo estático reducido de 1200ms OBS04", () => {
    expect(loadingInitialMotionTimeline.version).toBe("v14");
    expect(loadingInitialMotionTimeline.totalDurationMs).toBe(6000);
    expect(loadingInitialMotionTimeline.reducedMotionDurationMs).toBe(1200);
    expect(loadingInitialMotionTimeline.phases.at(0)?.startMs).toBe(0);
    expect(loadingInitialMotionTimeline.phases.at(-1)?.endMs).toBe(6000);
  });

  it("retrasa el agua despues de la inclinacion y deja crecer planta despues de cada pulso", () => {
    expect(WATER_DELAY_AFTER_TILT_MS).toBeGreaterThanOrEqual(60);
    expect(WATER_DELAY_AFTER_TILT_MS).toBeLessThanOrEqual(90);

    for (const pulse of loadingInitialMotionTimeline.waterPulses) {
      expect(pulse.waterStartMs - pulse.gestureStartMs).toBeGreaterThanOrEqual(
        60,
      );
      expect(pulse.waterStartMs - pulse.gestureStartMs).toBeLessThanOrEqual(
        90,
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
