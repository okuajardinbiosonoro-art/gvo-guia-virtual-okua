import type { TransitionWorldConfig } from "./transitionWorld.types";
import { worldOneEntryRoute, worldTwoEntryRoute } from "../../app/routes";
import { worldOneToWorldTwoTransitionCopy } from "../../content/transitionEditorialSlots";

export const TRANSITION_WORLD_VERSION = "T003E7C_TYPOGRAPHY_TOKENS";

export const introToStationOneTransition: TransitionWorldConfig = {
  id: "intro-to-station-1",
  fromRoute: "/portada",
  toRoute: worldOneEntryRoute,
  targetPreload: "world1RootInitial",
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

export const worldOneToWorldTwoTransition: TransitionWorldConfig = {
  id: "world-1-to-world-2",
  fromRoute: worldOneEntryRoute,
  toRoute: worldTwoEntryRoute,
  targetPreload: "none",
  title: worldOneToWorldTwoTransitionCopy.title.text,
  titleSlotId: worldOneToWorldTwoTransitionCopy.title.id,
  subtitle: worldOneToWorldTwoTransitionCopy.subtitle.text,
  subtitleSlotId: worldOneToWorldTwoTransitionCopy.subtitle.id,
  durationMs: 2300,
  reducedMotionDurationMs: 1000,
  portalLabel: "Portal de transicion hacia Mundo II",
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
  worldOneToWorldTwo: worldOneToWorldTwoTransition,
} as const;
