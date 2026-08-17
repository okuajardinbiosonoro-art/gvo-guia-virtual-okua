export type ImmersiveDisplayMode =
  | "fullscreen"
  | "standalone"
  | "minimal-ui"
  | "browser";

export type FullscreenCapability =
  | "supported"
  | "unavailable-on-platform"
  | "blocked-by-context";

export type FullscreenMethod = "standard" | "webkit" | "none";

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

type FullscreenPolicy = {
  allowsFeature?: (feature: string) => boolean;
};

type DocumentWithFullscreenPolicy = Document & {
  permissionsPolicy?: FullscreenPolicy;
  featurePolicy?: FullscreenPolicy;
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitCancelFullScreen?: () => Promise<void> | void;
};

type ElementWithFullscreenCompatibility = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
};

function getCurrentDocument() {
  return typeof document === "undefined" ? null : document;
}

function policyAllowsFullscreen(currentDocument: Document): boolean | null {
  const documentWithPolicy = currentDocument as DocumentWithFullscreenPolicy;
  const policy =
    documentWithPolicy.permissionsPolicy ?? documentWithPolicy.featurePolicy;
  if (typeof policy?.allowsFeature !== "function") {
    return null;
  }

  try {
    return policy.allowsFeature("fullscreen");
  } catch {
    return null;
  }
}

function getFullscreenElement(currentDocument: Document): Element | null {
  const compatibleDocument = currentDocument as DocumentWithFullscreenPolicy;
  return (
    currentDocument.fullscreenElement ??
    compatibleDocument.webkitFullscreenElement ??
    null
  );
}

export function getFullscreenRequestMethod(): FullscreenMethod {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return "none";
  }

  const element =
    currentDocument.documentElement as ElementWithFullscreenCompatibility;
  if (typeof element.requestFullscreen === "function") {
    return "standard";
  }

  if (
    typeof element.webkitRequestFullscreen === "function" ||
    typeof element.webkitRequestFullScreen === "function"
  ) {
    return "webkit";
  }

  return "none";
}

export function getFullscreenExitMethod(): FullscreenMethod {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return "none";
  }

  const compatibleDocument = currentDocument as DocumentWithFullscreenPolicy;
  if (typeof currentDocument.exitFullscreen === "function") {
    return "standard";
  }

  if (
    typeof compatibleDocument.webkitExitFullscreen === "function" ||
    typeof compatibleDocument.webkitCancelFullScreen === "function"
  ) {
    return "webkit";
  }

  return "none";
}

/** Distinguishes platform absence from a capable API blocked by this context. */
export function getFullscreenCapability(): FullscreenCapability {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return "unavailable-on-platform";
  }

  if (getFullscreenElement(currentDocument)) {
    return getFullscreenExitMethod() !== "none"
      ? "supported"
      : "unavailable-on-platform";
  }

  const requestMethod = getFullscreenRequestMethod();
  const exitMethod = getFullscreenExitMethod();
  if (requestMethod === "none" || exitMethod === "none") {
    return "unavailable-on-platform";
  }

  const compatibleDocument = currentDocument as DocumentWithFullscreenPolicy;
  const fullscreenExplicitlyDisabled =
    requestMethod === "standard"
      ? currentDocument.fullscreenEnabled === false
      : compatibleDocument.webkitFullscreenEnabled === false;
  if (
    fullscreenExplicitlyDisabled ||
    policyAllowsFullscreen(currentDocument) === false
  ) {
    return "blocked-by-context";
  }

  return "supported";
}

/**
 * Requests the standard Fullscreen API without allowing a rejection to escape
 * into the caller's navigation or interaction flow.
 *
 * The caller must invoke this directly from an explicit user action. Transient
 * user activation is intentionally not preflighted: the click that calls this
 * function is what grants activation, and the browser remains the authority.
 */
export async function requestFullscreenFromUserGesture(): Promise<boolean> {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return false;
  }

  if (getFullscreenElement(currentDocument)) {
    return true;
  }

  if (getFullscreenCapability() !== "supported") {
    return false;
  }

  try {
    const element =
      currentDocument.documentElement as ElementWithFullscreenCompatibility;
    const method = getFullscreenRequestMethod();
    const request =
      method === "standard"
        ? element.requestFullscreen.bind(element)
        : element.webkitRequestFullscreen?.bind(element) ??
          element.webkitRequestFullScreen?.bind(element);
    if (!request) {
      return false;
    }

    await Promise.resolve(request());
    return Boolean(getFullscreenElement(currentDocument));
  } catch {
    return false;
  }
}

/** Exits standard fullscreen when active and treats an already-exited state as success. */
export async function exitFullscreen(): Promise<boolean> {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return false;
  }

  if (!getFullscreenElement(currentDocument)) {
    return true;
  }

  const compatibleDocument = currentDocument as DocumentWithFullscreenPolicy;
  const method = getFullscreenExitMethod();
  const exit =
    method === "standard"
      ? currentDocument.exitFullscreen.bind(currentDocument)
      : compatibleDocument.webkitExitFullscreen?.bind(compatibleDocument) ??
        compatibleDocument.webkitCancelFullScreen?.bind(compatibleDocument);
  if (!exit) {
    return false;
  }

  try {
    await Promise.resolve(exit());
    return !getFullscreenElement(currentDocument);
  } catch {
    return false;
  }
}

/** Reports the fullscreen state actually granted by the document. */
export function isFullscreenActive(): boolean {
  const currentDocument = getCurrentDocument();
  return currentDocument ? Boolean(getFullscreenElement(currentDocument)) : false;
}

export function subscribeFullscreenEvents(
  onChange: () => void,
  onError: () => void,
): () => void {
  const currentDocument = getCurrentDocument();
  if (!currentDocument) {
    return () => undefined;
  }

  const changeEvents = ["fullscreenchange", "webkitfullscreenchange"];
  const errorEvents = ["fullscreenerror", "webkitfullscreenerror"];
  changeEvents.forEach((eventName) =>
    currentDocument.addEventListener(eventName, onChange),
  );
  errorEvents.forEach((eventName) =>
    currentDocument.addEventListener(eventName, onError),
  );

  return () => {
    changeEvents.forEach((eventName) =>
      currentDocument.removeEventListener(eventName, onChange),
    );
    errorEvents.forEach((eventName) =>
      currentDocument.removeEventListener(eventName, onError),
    );
  };
}

/** Reports the display mode currently granted to this browsing context. */
export function getDisplayMode(): ImmersiveDisplayMode {
  if (typeof window === "undefined") {
    return "browser";
  }

  if (isFullscreenActive()) {
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

export function isFullscreenSupported(): boolean {
  return getFullscreenCapability() === "supported";
}

/** Compatibility aliases retained for existing callers outside this ticket. */
export const requestImmersiveMode = requestFullscreenFromUserGesture;
export const exitImmersiveMode = exitFullscreen;
export const isImmersiveMode = isFullscreenActive;
export const isFullscreenAvailable = isFullscreenSupported;
