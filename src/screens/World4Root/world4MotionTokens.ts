export const WORLD4_VISUAL_PHASES = [
  "station_enter",
  "idle",
  "node_departing",
  "lia_travel",
  "route_transfer",
  "node_arrival",
  "node_active",
  "node_settle",
  "chain_complete",
  "exit_reveal",
  "exiting",
] as const;

export type World4VisualPhase = (typeof WORLD4_VISUAL_PHASES)[number];

export type World4MotionMode = "standard" | "reduced";
export type World4EntryMode = "full" | "abbreviated";

export const WORLD4_MOTION_NODE_COUNT = 8;

export const WORLD4_MOTION_EASING = {
  standard: "cubic-bezier(.22, .61, .36, 1)",
  enter: "cubic-bezier(.16, 1, .3, 1)",
  settle: "cubic-bezier(.34, 1.25, .64, 1)",
} as const;

/**
 * Chosen deterministic points inside the ranges fixed by the 018D contract.
 * Values are offsets from the beginning of each choreography, in milliseconds.
 */
export const WORLD4_MOTION_TIMELINES = {
  standard: {
    entry: {
      full: 1400,
      abbreviated: 240,
    },
    node: {
      liaTravel: 80,
      routeTransfer: 140,
      cardSwap: 380,
      nodeArrival: 280,
      nodeActive: 380,
      nodeSettle: 900,
      complete: 1180,
    },
    chain: {
      exitReveal: 1040,
      complete: 1280,
    },
    exit: {
      complete: 650,
    },
  },
  reduced: {
    entry: {
      full: 160,
      abbreviated: 160,
    },
    node: {
      liaTravel: 40,
      routeTransfer: 60,
      cardSwap: 100,
      nodeArrival: 100,
      nodeActive: 120,
      nodeSettle: 160,
      complete: 180,
    },
    chain: {
      exitReveal: 120,
      complete: 260,
    },
    exit: {
      complete: 160,
    },
  },
} as const;

export const WORLD4_MOTION_DURATION_RANGES = {
  micro: [120, 220],
  cardOut: [100, 140],
  cardIn: [150, 190],
  liaTravel: [620, 820],
  routePulse: [520, 760],
  nodeFx: [620, 980],
  settle: [160, 240],
  fullStep: [1050, 1450],
} as const;
