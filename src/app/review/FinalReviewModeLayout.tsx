import "./FinalReviewModeLayout.css";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { finalEntryRoute } from "../routes";
import { finalEditorialSlots } from "../../content/finalEditorialSlots";
import type { ProgressStorage } from "../../domain/progress/progress.types";
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
  storage?: ProgressStorage | null;
  world: FinalReviewWorld;
};

function defaultSessionStorage(): ProgressStorage | null {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

export function FinalReviewModeLayout({
  children,
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

    return resolveFinalReviewContext(location.state, world, storage);
  });

  useEffect(() => {
    if (finalReviewWorldForPathname(location.pathname) !== world) {
      clearFinalReviewContext(storage);
      setContext(null);
      return;
    }

    setContext(resolveFinalReviewContext(location.state, world, storage));
  }, [location.pathname, location.state, storage, world]);

  function returnToFinal() {
    clearFinalReviewContext(storage);
    setContext(null);
    navigate(finalEntryRoute);
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
