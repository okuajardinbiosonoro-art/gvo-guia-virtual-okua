import "./ImmersiveModeControl.css";

import { useCallback, useEffect, useState } from "react";

import { readLanguagePreference } from "../../app/preferences/languagePreference";
import {
  exitFullscreen,
  getFullscreenCapability,
  isFullscreenActive,
  requestFullscreenFromUserGesture,
  subscribeFullscreenEvents,
  type FullscreenCapability,
} from "./immersiveMode";

export type ImmersiveModeControlProps = {
  className?: string;
};

type ImmersiveControlState =
  | "blocked"
  | "inactive"
  | "pending"
  | "active"
  | "error";

const fullscreenCopy = {
  es: {
    enter: "Activar pantalla completa",
    exit: "Salir de pantalla completa",
    blocked: "Pantalla completa bloqueada en este contexto",
  },
  en: {
    enter: "Enter fullscreen",
    exit: "Exit fullscreen",
    blocked: "Fullscreen blocked in this context",
  },
} as const;

function resolveControlLanguage() {
  const stored = readLanguagePreference();
  if (stored) {
    return stored;
  }

  return typeof document !== "undefined" &&
    document.documentElement.lang.toLowerCase().startsWith("en")
    ? "en"
    : "es";
}

export function ImmersiveModeControl({ className }: ImmersiveModeControlProps) {
  const [capability, setCapability] = useState<FullscreenCapability>(
    getFullscreenCapability,
  );
  const [active, setActive] = useState(isFullscreenActive);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const syncGrantedState = useCallback(() => {
    setActive(isFullscreenActive());
    setCapability(getFullscreenCapability());
    setPending(false);
    setFailed(false);
  }, []);

  useEffect(() => {
    const handleFullscreenError = () => {
      setActive(isFullscreenActive());
      setCapability(getFullscreenCapability());
      setPending(false);
      setFailed(true);
    };

    return subscribeFullscreenEvents(
      syncGrantedState,
      handleFullscreenError,
    );
  }, [syncGrantedState]);

  const handleActivation = async () => {
    if (pending || capability !== "supported") {
      return;
    }

    const activation = active
      ? exitFullscreen()
      : requestFullscreenFromUserGesture();
    setPending(true);
    setFailed(false);

    const succeeded = await activation;

    setActive(isFullscreenActive());
    setCapability(getFullscreenCapability());
    setPending(false);
    setFailed(!succeeded);
  };

  const copy = fullscreenCopy[resolveControlLanguage()];
  const label =
    capability === "supported"
      ? active
        ? copy.exit
        : copy.enter
      : capability === "blocked-by-context"
        ? copy.blocked
        : copy.enter;
  const state: ImmersiveControlState =
    capability === "blocked-by-context"
        ? "blocked"
        : pending
          ? "pending"
          : failed
            ? "error"
            : active
              ? "active"
              : "inactive";

  if (capability === "unavailable-on-platform") {
    return null;
  }

  return (
    <button
      type="button"
      className={["gvo-immersive-mode-control", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
      aria-pressed={active}
      data-gvo-immersive-control="fullscreen"
      data-gvo-immersive-state={state}
      data-gvo-fullscreen-capability={capability}
      disabled={capability !== "supported" || pending}
      onClick={handleActivation}
    >
      {label}
    </button>
  );
}
