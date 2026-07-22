import "./OrientationHint.css";

import { useEffect, useState } from "react";

const COMPACT_PORTRAIT_QUERY = "(max-width: 480px) and (orientation: portrait)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_MESSAGE = "Gira el dispositivo para ver mejor la mesa.";
const DEFAULT_STORAGE_KEY = "gvo:orientation-hint:dismissed";

const dismissedInMemory = new Set<string>();

export type OrientationHintProps = {
  className?: string;
  dataHook?: string;
  dismissLabel?: string;
  message?: string;
  storageKey?: string;
};

function mediaQueryMatches(query: string) {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(query).matches
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => mediaQueryMatches(query));

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setMatches(false);
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

function wasDismissed(storageKey: string) {
  if (dismissedInMemory.has(storageKey)) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function persistDismissal(storageKey: string) {
  dismissedInMemory.add(storageKey);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // La memoria del modulo conserva el descarte durante la sesion SPA.
  }
}

export function OrientationHint({
  className,
  dataHook,
  dismissLabel = "Descartar ayuda de orientación",
  message = DEFAULT_MESSAGE,
  storageKey = DEFAULT_STORAGE_KEY,
}: OrientationHintProps) {
  const compactPortrait = useMediaQuery(COMPACT_PORTRAIT_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [dismissed, setDismissed] = useState(() => wasDismissed(storageKey));

  useEffect(() => {
    setDismissed(wasDismissed(storageKey));
  }, [storageKey]);

  if (!compactPortrait || dismissed) {
    return null;
  }

  const classes = ["gvo-orientation-hint", className].filter(Boolean).join(" ");

  return (
    <aside
      aria-label="Recomendación de orientación"
      className={classes}
      data-gvo-orientation-hint="compact-portrait"
      data-gvo-orientation-hook={dataHook}
      data-gvo-orientation-motion={reducedMotion ? "reduced" : "standard"}
    >
      <p aria-live="polite" className="gvo-orientation-hint__message">
        {message}
      </p>
      <button
        aria-label={dismissLabel}
        className="gvo-orientation-hint__dismiss"
        onClick={() => {
          persistDismissal(storageKey);
          setDismissed(true);
        }}
        type="button"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}
