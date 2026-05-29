export type CoverIntroPhase =
  | "portada_idle"
  | "intro_dialogue_started"
  | "intro_dialogue_active"
  | "intro_dialogue_completed"
  | "portal_1_ready"
  | "portal_1_opening_placeholder";

export type CoverIntroState = {
  phase: CoverIntroPhase;
  activeDialogueIndex: number;
  blockedPortalMessage: string | null;
  blockedPortalId: string | null;
  introCompleted: boolean;
};

export const COVER_INTRO_STORAGE_KEY = "gvo.coverIntro.introCompleted.v1";

export const COVER_INTRO_INITIAL_STATE: CoverIntroState = {
  phase: "portada_idle",
  activeDialogueIndex: 0,
  blockedPortalMessage: null,
  blockedPortalId: null,
  introCompleted: false,
};

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readCoverIntroCompleted(): boolean {
  try {
    return getLocalStorage()?.getItem(COVER_INTRO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function persistCoverIntroCompleted() {
  try {
    getLocalStorage()?.setItem(COVER_INTRO_STORAGE_KEY, "true");
  } catch {
    // Persistence is a convenience for the cover intro, not a navigation gate.
  }
}
