import type { GvoLanguage } from "../../app/preferences/languagePreference";

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
  editorialCopyStatus?: "final" | "review" | "temporary";
  id: string;
  fromRoute: string;
  subtitleSlotId?: string;
  targetPreload: "world1RootInitial" | "world2RootInitial" | "world3RootInitial" | "world4RootInitial" | "world5MapCritical" | "finalRootInitial";
  toRoute: string;
  title: string;
  titleSlotId?: string;
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
  onComplete?: () => void;
  shellAssetsReady?: boolean;
  deadlineAt?: number;
  onVisualError?: () => void;
  /** Nominal ceremony notification only; the root controller owns readiness/navigation. */
  attemptId?: string | null;
  preloadStatus?: string;
  preloadProgress?: number;
  onRetry?: () => void;
  onBack?: () => void;
  canRetry?: boolean;
  locale?: GvoLanguage;
};
