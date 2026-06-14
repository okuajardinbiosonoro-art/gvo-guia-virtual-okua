import type { TransitionWorldConfig } from "./transitionWorld.types";
import {
  worldFourEntryRoute,
  worldOneEntryRoute,
  worldThreeEntryRoute,
  worldTwoEntryRoute,
} from "../../app/routes";
import {
  worldOneToWorldTwoTransitionCopy,
  worldThreeToWorldFourTransitionCopy,
  worldTwoToWorldThreeTransitionCopy,
} from "../../content/transitionEditorialSlots";

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

export const worldTwoToWorldThreeTransition: TransitionWorldConfig = {
  id: "world-2-to-world-3",
  fromRoute: worldTwoEntryRoute,
  toRoute: worldThreeEntryRoute,
  targetPreload: "none",
  title: worldTwoToWorldThreeTransitionCopy.title.text,
  titleSlotId: worldTwoToWorldThreeTransitionCopy.title.id,
  subtitle: worldTwoToWorldThreeTransitionCopy.subtitle.text,
  subtitleSlotId: worldTwoToWorldThreeTransitionCopy.subtitle.id,
  durationMs: 2300,
  reducedMotionDurationMs: 1000,
  portalLabel: "Portal de transicion hacia Mundo III",
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

export const worldThreeToWorldFourTransition: TransitionWorldConfig = {
  id: "world-3-to-world-4",
  fromRoute: worldThreeEntryRoute,
  toRoute: worldFourEntryRoute,
  targetPreload: "none",
  title: worldThreeToWorldFourTransitionCopy.title.text,
  titleSlotId: worldThreeToWorldFourTransitionCopy.title.id,
  subtitle: worldThreeToWorldFourTransitionCopy.subtitle.text,
  subtitleSlotId: worldThreeToWorldFourTransitionCopy.subtitle.id,
  durationMs: 2300,
  reducedMotionDurationMs: 1000,
  portalLabel: "Portal de transicion hacia Mundo IV",
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
  worldTwoToWorldThree: worldTwoToWorldThreeTransition,
  worldThreeToWorldFour: worldThreeToWorldFourTransition,
} as const;
