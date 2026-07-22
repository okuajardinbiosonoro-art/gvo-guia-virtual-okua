export type ImmersiveDisplayMode =
  | "fullscreen"
  | "standalone"
  | "minimal-ui"
  | "browser";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type NavigatorWithUserActivation = Navigator & {
  userActivation?: {
    isActive: boolean;
  };
};

function getCurrentDocument() {
  return typeof document === "undefined" ? null : document;
}

function hasFullscreenSupport(currentDocument: Document) {
  return Boolean(
    currentDocument.fullscreenEnabled &&
    typeof currentDocument.documentElement.requestFullscreen === "function",
  );
}

function hasExplicitUserActivation() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const activation = (navigator as NavigatorWithUserActivation).userActivation;
  return activation ? activation.isActive : true;
}

/**
 * Requests the standard Fullscreen API without allowing a rejection to escape
 * into the caller's navigation or interaction flow.
 *
 * Browsers that expose User Activation must confirm an active gesture. In
 * browsers without that signal, the caller remains responsible for invoking
 * this function directly from an explicit user action.
 */
export async function requestImmersiveMode(): Promise<boolean> {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return false;
  }

  if (currentDocument.fullscreenElement) {
    return true;
  }

  if (!hasFullscreenSupport(currentDocument) || !hasExplicitUserActivation()) {
    return false;
  }

  try {
    await currentDocument.documentElement.requestFullscreen();
    return Boolean(currentDocument.fullscreenElement);
  } catch {
    return false;
  }
}

/** Exits standard fullscreen when active and treats an already-exited state as success. */
export async function exitImmersiveMode(): Promise<boolean> {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return false;
  }

  if (!currentDocument.fullscreenElement) {
    return true;
  }

  if (typeof currentDocument.exitFullscreen !== "function") {
    return false;
  }

  try {
    await currentDocument.exitFullscreen();
    return !currentDocument.fullscreenElement;
  } catch {
    return false;
  }
}

/** Reports the fullscreen state actually granted by the document. */
export function isImmersiveMode(): boolean {
  return Boolean(getCurrentDocument()?.fullscreenElement);
}

/** Reports the display mode currently granted to this browsing context. */
export function getDisplayMode(): ImmersiveDisplayMode {
  if (typeof window === "undefined") {
    return "browser";
  }

  if (isImmersiveMode()) {
    return "fullscreen";
  }

  if (typeof window.matchMedia === "function") {
    const modes = ["fullscreen", "standalone", "minimal-ui"] as const;

    for (const mode of modes) {
      try {
        if (window.matchMedia(`(display-mode: ${mode})`).matches) {
          return mode;
        }
      } catch {
        // An incomplete matchMedia implementation is equivalent to no match.
      }
    }
  }

  if ((window.navigator as NavigatorWithStandalone).standalone === true) {
    return "standalone";
  }

  return "browser";
}

export function isFullscreenAvailable(): boolean {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return false;
  }

  if (currentDocument.fullscreenElement) {
    return typeof currentDocument.exitFullscreen === "function";
  }

  return hasFullscreenSupport(currentDocument);
}
