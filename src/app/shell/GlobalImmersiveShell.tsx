import "./GlobalImmersiveShell.css";

import { Outlet, useLocation } from "react-router-dom";

import { ImmersiveModeControl } from "../../shared/immersive";
import {
  stationEntryRoutes,
  worldFivePlantsRoute,
  worldFiveSpaceRoute,
  worldFiveSystemRoute,
  worldFiveVisitorRoute,
} from "../routes";

const authorizedPaths = new Set([
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
  const authorized = isImmersiveShellAuthorizedPath(location.pathname);

  return (
    <div
      className="gvo-immersive-shell"
      data-gvo-immersive-shell={authorized ? "active" : "inactive"}
    >
      <Outlet />
      {authorized ? (
        <div
          aria-label="Control de visualización"
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
