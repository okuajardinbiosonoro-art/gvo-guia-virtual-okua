import "./FinalReviewModeLayout.css";

import type { CSSProperties, ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

type ReviewDockMetrics = Readonly<{
  blockSize: number;
  clearanceRequired: boolean;
  inlineSize: number;
  placement: "below-end" | "top-end" | "top-start";
  visualOffsetLeft: number;
  visualOffsetRight: number;
  visualOffsetTop: number;
}>;

type ReviewLayoutStyle = CSSProperties & {
  "--gvo-final-review-dock-block-size": string;
  "--gvo-final-review-dock-inline-size": string;
  "--gvo-final-review-visual-offset-left": string;
  "--gvo-final-review-visual-offset-right": string;
  "--gvo-final-review-visual-offset-top": string;
};

const FinalReviewModeContext = createContext(false);

export function useFinalReviewMode(): boolean {
  return useContext(FinalReviewModeContext);
}

const DEFAULT_REVIEW_DOCK_METRICS: ReviewDockMetrics = {
  blockSize: 44,
  clearanceRequired: false,
  inlineSize: 176,
  placement: "top-end",
  visualOffsetLeft: 0,
  visualOffsetRight: 0,
  visualOffsetTop: 0,
};

function initialReviewDockMetrics(world: FinalReviewWorld): ReviewDockMetrics {
  const landscape =
    typeof window !== "undefined" && window.innerWidth >= window.innerHeight;
  return {
    ...DEFAULT_REVIEW_DOCK_METRICS,
    clearanceRequired:
      (world === 2 && landscape) ||
      (world === 4 && !landscape) ||
      (world === 5 && landscape),
    placement:
      landscape || world === 4
        ? "top-start"
        : (world === 2 && window.innerWidth <= 412) ||
            (world === 3 && window.innerWidth <= 360)
          ? "below-end"
          : "top-end",
  };
}

function hasVisibleWorld2Capture(dock: HTMLElement): boolean {
  const capture = dock.parentElement?.querySelector<HTMLElement>(
    "[data-world2-capture-timeline]",
  );
  if (!capture) {
    return false;
  }

  const rect = capture.getBoundingClientRect();
  const style = window.getComputedStyle(capture);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number(style.opacity) > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

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
  const dockRef = useRef<HTMLDivElement>(null);
  const [dockMetrics, setDockMetrics] = useState<ReviewDockMetrics>(() =>
    initialReviewDockMetrics(world),
  );
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

  const measureReviewDock = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) {
      return;
    }

    const rect = dock.getBoundingClientRect();
    const viewport = window.visualViewport;
    const landscape = window.innerWidth >= window.innerHeight;
    const world2CaptureVisible = world === 2 && hasVisibleWorld2Capture(dock);
    const nextMetrics: ReviewDockMetrics = {
      blockSize: Math.max(44, Math.ceil(rect.height)),
      clearanceRequired:
        (world === 2 && (landscape || world2CaptureVisible)) ||
        (world === 4 && !landscape) ||
        (world === 5 && landscape),
      inlineSize: Math.max(44, Math.ceil(rect.width)),
      placement:
        landscape || world === 4
          ? "top-start"
          : world2CaptureVisible
            ? "top-end"
            : (world === 2 && window.innerWidth <= 412) ||
                (world === 3 && window.innerWidth <= 360)
              ? "below-end"
              : "top-end",
      visualOffsetLeft: viewport
        ? Math.max(0, Math.ceil(viewport.offsetLeft))
        : 0,
      visualOffsetRight: viewport
        ? Math.max(
            0,
            Math.ceil(
              window.innerWidth - (viewport.offsetLeft + viewport.width),
            ),
          )
        : 0,
      visualOffsetTop: viewport
        ? Math.max(0, Math.ceil(viewport.offsetTop))
        : 0,
    };

    setDockMetrics((current) =>
      current.blockSize === nextMetrics.blockSize &&
      current.clearanceRequired === nextMetrics.clearanceRequired &&
      current.inlineSize === nextMetrics.inlineSize &&
      current.placement === nextMetrics.placement &&
      current.visualOffsetLeft === nextMetrics.visualOffsetLeft &&
      current.visualOffsetRight === nextMetrics.visualOffsetRight &&
      current.visualOffsetTop === nextMetrics.visualOffsetTop
        ? current
        : nextMetrics,
    );
  }, [world]);

  useEffect(() => {
    if (!context) {
      setDockMetrics(initialReviewDockMetrics(world));
      return;
    }

    measureReviewDock();
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measureReviewDock);
    if (dockRef.current) {
      resizeObserver?.observe(dockRef.current);
    }

    const viewport = window.visualViewport;
    const orientation = window.screen.orientation;
    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(measureReviewDock);
    if (dockRef.current?.parentElement) {
      mutationObserver?.observe(dockRef.current.parentElement, {
        attributeFilter: [
          "aria-hidden",
          "class",
          "data-world2-capture-step",
          "hidden",
        ],
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    window.addEventListener("resize", measureReviewDock);
    viewport?.addEventListener("resize", measureReviewDock);
    viewport?.addEventListener("scroll", measureReviewDock);
    orientation?.addEventListener?.("change", measureReviewDock);
    document.fonts?.addEventListener?.("loadingdone", measureReviewDock);
    void document.fonts?.ready.then(measureReviewDock);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", measureReviewDock);
      viewport?.removeEventListener("resize", measureReviewDock);
      viewport?.removeEventListener("scroll", measureReviewDock);
      orientation?.removeEventListener?.("change", measureReviewDock);
      document.fonts?.removeEventListener?.("loadingdone", measureReviewDock);
    };
  }, [context, measureReviewDock, world]);

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

  const layoutStyle: ReviewLayoutStyle = {
    "--gvo-final-review-dock-block-size": context
      ? `${dockMetrics.blockSize}px`
      : "0px",
    "--gvo-final-review-dock-inline-size": context
      ? `${dockMetrics.inlineSize}px`
      : "0px",
    "--gvo-final-review-visual-offset-left": context
      ? `${dockMetrics.visualOffsetLeft}px`
      : "0px",
    "--gvo-final-review-visual-offset-right": context
      ? `${dockMetrics.visualOffsetRight}px`
      : "0px",
    "--gvo-final-review-visual-offset-top": context
      ? `${dockMetrics.visualOffsetTop}px`
      : "0px",
  };

  return (
    <FinalReviewModeContext.Provider value={context !== null}>
      <div
        className="final-review-mode-layout"
        data-final-review-active={context ? "true" : "false"}
        data-final-review-clearance-mode={
          context && dockMetrics.clearanceRequired ? "reserved" : "floating"
        }
        data-final-review-placement={context ? dockMetrics.placement : "none"}
        data-final-review-world={context?.world ?? "none"}
        style={layoutStyle}
      >
        {children}
        {context ? (
          <div
            className="final-review-return-dock"
            data-final-review-clearance={`${dockMetrics.blockSize}x${dockMetrics.inlineSize}`}
            data-final-review-dock="active"
            data-final-review-dock-placement={dockMetrics.placement}
            ref={dockRef}
          >
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
          </div>
        ) : null}
      </div>
    </FinalReviewModeContext.Provider>
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
