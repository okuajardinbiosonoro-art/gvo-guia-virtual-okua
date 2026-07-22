import "./ImmersiveModeControl.css";

import { useCallback, useEffect, useState } from "react";

import {
  exitImmersiveMode,
  isFullscreenAvailable,
  isImmersiveMode,
  requestImmersiveMode,
} from "./immersiveMode";

export type ImmersiveModeControlProps = {
  className?: string;
};

type ImmersiveControlState = "inactive" | "pending" | "active" | "error";

export function ImmersiveModeControl({ className }: ImmersiveModeControlProps) {
  const [supported, setSupported] = useState(isFullscreenAvailable);
  const [active, setActive] = useState(isImmersiveMode);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  const syncGrantedState = useCallback(() => {
    setActive(isImmersiveMode());
    setSupported(isFullscreenAvailable());
    setPending(false);
    setFailed(false);
  }, []);

  useEffect(() => {
    const handleFullscreenError = () => {
      setActive(isImmersiveMode());
      setPending(false);
      setFailed(true);
    };

    document.addEventListener("fullscreenchange", syncGrantedState);
    document.addEventListener("fullscreenerror", handleFullscreenError);

    return () => {
      document.removeEventListener("fullscreenchange", syncGrantedState);
      document.removeEventListener("fullscreenerror", handleFullscreenError);
    };
  }, [syncGrantedState]);

  const handleActivation = async () => {
    if (pending) {
      return;
    }

    setPending(true);
    setFailed(false);

    const succeeded = active
      ? await exitImmersiveMode()
      : await requestImmersiveMode();

    setActive(isImmersiveMode());
    setPending(false);
    setFailed(!succeeded);
  };

  if (!supported) {
    return null;
  }

  const label = active
    ? "Salir de pantalla completa"
    : "Activar pantalla completa";
  const state: ImmersiveControlState = pending
    ? "pending"
    : failed
      ? "error"
      : active
        ? "active"
        : "inactive";

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
      disabled={pending}
      onClick={handleActivation}
    >
      {label}
    </button>
  );
}
