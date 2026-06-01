import type { TransitionWorldConfig } from "./transitionWorld.types";

export const TRANSITION_WORLD_VERSION = "T003B_STATIC_BASE";

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
    background: "#172b27",
    mist: "#d8c7ff",
    portalCore: "#f5df91",
    portalEdge: "#8f72c9",
    portalGlow: "#d9ad62",
    text: "#f1e7ff",
    textSoft: "#d8cbe6",
    progressTrack: "#6f5c8d",
    progressFill: "#e8bd6f",
  },
};

export const transitionWorldConfigs = {
  introToStationOne: introToStationOneTransition,
} as const;
