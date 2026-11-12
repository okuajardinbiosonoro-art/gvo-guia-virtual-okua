import "./GlobalImmersiveShell.css";

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import {
  getFullscreenCapability,
  ImmersiveModeControl,
} from "../../shared/immersive";
import { applyDocumentLanguage, readLanguagePreference } from "../preferences/languagePreference";
import { JourneyPreparation } from "../journey/JourneyPreparation";
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

  useEffect(() => {
    applyDocumentLanguage();
  }, []);

  return (
    <div
      className="gvo-immersive-shell"
      data-gvo-immersive-shell={authorized ? "active" : "inactive"}
    >
      <JourneyPreparation><Outlet /></JourneyPreparation>
      {authorized && fullscreenAvailableOnPlatform ? (
        <div
          aria-label={locale === "en" ? "Display controls" : "Control de visualización"}
          className="gvo-immersive-shell__dock"
          data-gvo-immersive-safe-area="top-inline-end"
          role="group"
        >
          <ImmersiveModeControl className="gvo-immersive-shell__control" />
        </div>
      ) : null}
    </div>
  );
}
