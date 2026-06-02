import type { TransitionWorldConfig } from "./transitionWorld.types";

export const TRANSITION_WORLD_VERSION = "T003E4A_PROGRESS_FILL_ALIGNMENT";

export const introToStationOneTransition: TransitionWorldConfig = {
  id: "intro-to-station-1",
  fromRoute: "/portada",
  toRoute: "/mundo-i-raiz",
  title: "Abriendo Mundo I: Raíz...",
  subtitle: "Preparando recorrido...",
  durationMs: 2300,
  reducedMotionDurationMs: 1000,
  portalLabel: "Portal de transición hacia Mundo I: Raíz",
  portalState: "open",
  portalSymbol: "root",
  palette: {
    background: "#F7EFD8",
    mist: "#E6DCF7",
    portalCore: "#FFF5C8",
    portalEdge: "#C9B8E8",
    portalGlow: "#E3A33E",
    text: "#4E3F35",
    textSoft: "#7E6248",
    progressTrack: "#D7C9A8",
    progressFill: "#E3A33E",
  },
};

export const transitionWorldConfigs = {
  introToStationOne: introToStationOneTransition,
} as const;
