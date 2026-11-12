import "./GlobalImmersiveShell.css";

import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { Outlet, useLocation } from "react-router-dom";

import {
  getFullscreenCapability,
  ImmersiveModeControl,
} from "../../shared/immersive";
import { applyDocumentLanguage, readLanguagePreference } from "../preferences/languagePreference";
import { JourneyPreparation } from "../journey/JourneyPreparation";
import {
  isJourneySoundMuted, stopJourneySound, stopJourneySoundOnNavigation,
  subscribeToJourneySound, toggleJourneySound, unlockJourneySound,
} from "../audio/journeySound";
import {
  coverIntroRoute,
  finalEntryRoute,
  stationEntryRoutes,
  worldFivePlantsRoute,
  worldFiveSpaceRoute,
  worldFiveSystemRoute,
  worldFiveVisitorRoute,
} from "../routes";

const authorizedPaths = new Set([
  coverIntroRoute,
  finalEntryRoute,
  ...Object.values(stationEntryRoutes),
  worldFivePlantsRoute,
  worldFiveSystemRoute,
  worldFiveSpaceRoute,
  worldFiveVisitorRoute,
]);

function normalizePathname(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

export function isImmersiveShellAuthorizedPath(pathname: string) {
  return authorizedPaths.has(normalizePathname(pathname));
}

export function GlobalImmersiveShell() {
  const location = useLocation();
  const locale = readLanguagePreference() ?? "es";
  const authorized = isImmersiveShellAuthorizedPath(location.pathname);
  const fullscreenAvailableOnPlatform =
    getFullscreenCapability() !== "unavailable-on-platform";
  const muted = useSyncExternalStore(subscribeToJourneySound, isJourneySoundMuted);
  const soundLabel = locale === "en" ? "Journey sound" : "Sonido del recorrido";

  useEffect(() => {
    applyDocumentLanguage();
  }, []);

  useEffect(() => {
    stopJourneySoundOnNavigation();
  }, [location.pathname]);

  useEffect(() => {
    const stopWhenHidden = () => { if (document.hidden) stopJourneySound(); };
    const stopOnExit = () => stopJourneySound();
    document.addEventListener("visibilitychange", stopWhenHidden);
    window.addEventListener("pagehide", stopOnExit);
    return () => {
      document.removeEventListener("visibilitychange", stopWhenHidden);
      window.removeEventListener("pagehide", stopOnExit);
      stopJourneySound();
    };
  }, []);

  function activateSound(event: MouseEvent) {
    if ((authorized || normalizePathname(location.pathname) === "/inicio") && event.nativeEvent.isTrusted) unlockJourneySound();
  }

  return (
    <div
      className="gvo-immersive-shell"
      data-gvo-immersive-shell={authorized ? "active" : "inactive"}
      onClickCapture={activateSound}
    >
      <JourneyPreparation><Outlet /></JourneyPreparation>
      {authorized ? (
        <div
          aria-label={locale === "en" ? "Display controls" : "Control de visualización"}
          className="gvo-immersive-shell__dock"
          data-gvo-immersive-safe-area="top-inline-end"
          role="group"
        >
          <button type="button" className="gvo-immersive-mode-control gvo-immersive-shell__sound"
            aria-label={soundLabel} aria-pressed={!muted} title={soundLabel} onClick={toggleJourneySound}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9z" />
              {muted ? <path d="m16 10 5 5m0-5-5 5" /> : <path d="M16 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10" />}
            </svg>
          </button>
          {fullscreenAvailableOnPlatform ? <ImmersiveModeControl className="gvo-immersive-shell__control" /> : null}
        </div>
      ) : null}
    </div>
  );
}
