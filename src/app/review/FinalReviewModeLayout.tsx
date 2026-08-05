import "./FinalReviewModeLayout.css";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { finalEntryRoute, stationEntryRoutes } from "../routes";
import { finalEditorialSlots } from "../../content/finalEditorialSlots";
import type { ProgressStorage } from "../../domain/progress/progress.types";
import {
  canOpenFinal,
  mostAdvancedAvailableStation,
  readProgress,
} from "../../domain/progress/progress.storage";
import {
  clearFinalReviewContext,
  finalReviewWorldForPathname,
  resolveFinalReviewContext,
} from "./finalReviewContext";
import type {
  FinalReviewContext,
  FinalReviewWorld,
} from "./finalReviewContext";

type FinalReviewModeLayoutProps = {
  children: ReactNode;
  progressStorage?: ProgressStorage | null;
  storage?: ProgressStorage | null;
  world: FinalReviewWorld;
};

function defaultSessionStorage(): ProgressStorage | null {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

function defaultProgressStorage(): ProgressStorage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function resolveAuthorizedFinalReviewContext(
  state: unknown,
  world: FinalReviewWorld,
  storage: ProgressStorage | null,
  progressStorage: ProgressStorage | null,
): FinalReviewContext | null {
  if (!canOpenFinal(readProgress(progressStorage))) {
    clearFinalReviewContext(storage);
    return null;
  }

  return resolveFinalReviewContext(state, world, storage);
}

export function FinalReviewModeLayout({
  children,
  progressStorage = defaultProgressStorage(),
  storage = defaultSessionStorage(),
  world,
}: FinalReviewModeLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [context, setContext] = useState<FinalReviewContext | null>(() => {
    if (finalReviewWorldForPathname(location.pathname) !== world) {
      clearFinalReviewContext(storage);
      return null;
    }

    return resolveAuthorizedFinalReviewContext(
      location.state,
      world,
      storage,
      progressStorage,
    );
  });

  useEffect(() => {
    if (finalReviewWorldForPathname(location.pathname) !== world) {
      clearFinalReviewContext(storage);
      setContext(null);
      return;
    }

    setContext(
      resolveAuthorizedFinalReviewContext(
        location.state,
        world,
        storage,
        progressStorage,
      ),
    );
  }, [location.pathname, location.state, progressStorage, storage, world]);

  function returnToFinal() {
    clearFinalReviewContext(storage);
    setContext(null);
    const progress = readProgress(progressStorage);
    navigate(
      canOpenFinal(progress)
        ? finalEntryRoute
        : stationEntryRoutes[mostAdvancedAvailableStation(progress)],
      canOpenFinal(progress) ? undefined : { replace: true },
    );
  }

  return (
    <div
      className="final-review-mode-layout"
      data-final-review-active={context ? "true" : "false"}
      data-final-review-world={context?.world ?? "none"}
    >
      {children}
      {context ? (
        <button
          aria-label={
            finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text
          }
          className="final-review-return-control"
          data-editorial-status="FINAL"
          data-final-review-return="active"
          data-final-slot-id="FINAL_RETURN_TO_MIRADOR_BTN_01"
          data-final-accessible-slot-id="FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01"
          type="button"
          onClick={returnToFinal}
        >
          {finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text}
        </button>
      ) : null}
    </div>
  );
}

export function FinalReviewContextInvalidator({
  children,
  storage = defaultSessionStorage(),
}: {
  children: ReactNode;
  storage?: ProgressStorage | null;
}) {
  useEffect(() => {
    clearFinalReviewContext(storage);
  }, [storage]);

  return children;
}
