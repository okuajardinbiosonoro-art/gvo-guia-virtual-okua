export type TransitionWorldVariant = "preview" | "runtime";

export type TransitionPortalState = "inactive" | "activating" | "open";

export type TransitionWorldPalette = {
  background: string;
  mist: string;
  portalCore: string;
  portalEdge: string;
  portalGlow: string;
  text: string;
  textSoft: string;
  progressTrack: string;
  progressFill: string;
};

export type TransitionWorldConfig = {
  id: string;
  fromRoute: string;
  toRoute: string;
  title: string;
  subtitle: string;
  durationMs: number;
  reducedMotionDurationMs: number;
  portalLabel: string;
  portalState: TransitionPortalState;
  portalSymbol: "root";
  palette: TransitionWorldPalette;
};

export type TransitionWorldProps = {
  config?: TransitionWorldConfig;
  variant?: TransitionWorldVariant;
  isReducedMotion?: boolean;
};
