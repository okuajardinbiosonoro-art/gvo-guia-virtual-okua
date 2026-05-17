export type LiaFramePhase = "idle" | "prepare" | "watering" | "observe";

export interface LiaFrameRegistration {
  frame: number;
  phase: LiaFramePhase;
  xPx: number;
  yPx: number;
  scale: number;
  rotateDeg: number;
}

export const LIA_FRAME_REGISTRATION_VERSION = "v13";
export const LIA_FRAME_REGISTRATION_ANCHOR = "visor-collar";

export const LIA_FRAME_REGISTRATION = [
  { frame: 1, phase: "idle", xPx: 0, yPx: 0, scale: 1, rotateDeg: 0 },
  { frame: 2, phase: "idle", xPx: -1, yPx: 1, scale: 1, rotateDeg: 0 },
  { frame: 3, phase: "idle", xPx: 0, yPx: 0, scale: 1, rotateDeg: 0 },
  { frame: 4, phase: "idle", xPx: 1, yPx: -1, scale: 1, rotateDeg: 0 },
  { frame: 5, phase: "prepare", xPx: 1, yPx: 0, scale: 1, rotateDeg: 0.08 },
  { frame: 6, phase: "prepare", xPx: 0, yPx: 1, scale: 1, rotateDeg: 0.12 },
  { frame: 7, phase: "prepare", xPx: -1, yPx: 1, scale: 1, rotateDeg: 0.12 },
  { frame: 8, phase: "prepare", xPx: -1, yPx: 0, scale: 1, rotateDeg: 0.08 },
  {
    frame: 9,
    phase: "watering",
    xPx: -1,
    yPx: 1,
    scale: 0.998,
    rotateDeg: -0.18,
  },
  {
    frame: 10,
    phase: "watering",
    xPx: -2,
    yPx: 0,
    scale: 0.998,
    rotateDeg: -0.28,
  },
  {
    frame: 11,
    phase: "watering",
    xPx: -1,
    yPx: -1,
    scale: 1,
    rotateDeg: -0.22,
  },
  {
    frame: 12,
    phase: "watering",
    xPx: 0,
    yPx: 0,
    scale: 1.002,
    rotateDeg: -0.12,
  },
  { frame: 13, phase: "observe", xPx: 0, yPx: 0, scale: 1, rotateDeg: 0.06 },
  { frame: 14, phase: "observe", xPx: 1, yPx: 0, scale: 1, rotateDeg: 0.04 },
  { frame: 15, phase: "observe", xPx: 0, yPx: -1, scale: 1, rotateDeg: 0 },
  { frame: 16, phase: "observe", xPx: 0, yPx: 0, scale: 1, rotateDeg: 0 },
] satisfies LiaFrameRegistration[];

export const liaFrameRegistrationCssVariables = Object.fromEntries(
  LIA_FRAME_REGISTRATION.flatMap((registration) => {
    const frameId = registration.frame.toString().padStart(2, "0");

    return [
      [`--lia-reg-frame-${frameId}-x`, `${registration.xPx}px`],
      [`--lia-reg-frame-${frameId}-y`, `${registration.yPx}px`],
      [`--lia-reg-frame-${frameId}-scale`, `${registration.scale}`],
      [`--lia-reg-frame-${frameId}-rotate`, `${registration.rotateDeg}deg`],
    ];
  }),
);
