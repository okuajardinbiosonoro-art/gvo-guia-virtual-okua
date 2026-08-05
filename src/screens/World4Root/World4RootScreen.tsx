import "./World4RootScreen.css";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { worldFourToWorldFiveTransitionRoute } from "../../app/routes";
import { OrientationHint } from "../../components/OrientationHint/OrientationHint";
import {
  markStationCompleted,
  readProgress,
} from "../../domain/progress/progress.storage";
import {
  getDisplayMode,
  ImmersiveModeControl,
  type ImmersiveDisplayMode,
} from "../../shared/immersive";
import {
  PROGRESS_SAVE_ERROR_COPY,
  PROGRESS_SAVE_RETRY_LABEL,
} from "../../shared/progress/progressSaveError";
import { station4Exit, station4Lia, station4Nodes } from "./station4Content";
import { useWorld4MotionController } from "./useWorld4MotionController";
import { WORLD4_BACKPLATE_SLICES } from "./world4AssetManifest";
import type { World4AmbientDensity } from "./World4AmbientLayer";
import type { World4NodeVisualState } from "./World4NodeStack";
import { World4Stage } from "./World4Stage";
import { World4TapHint } from "./World4TapHint";

const NODE_COUNT = station4Nodes.length;
const LAST_INDEX = NODE_COUNT - 1;
const STATION_ID = 4;

type Station4Phase =
  | "entering"
  | "reading"
  | "moving"
  | "chain"
  | "exit_ready"
  | "exiting";

type CardMotion = "stable" | "out" | "in";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

type VisualViewportMetrics = {
  height: number;
  width: number;
};

function readVisualViewport(): VisualViewportMetrics {
  if (typeof window === "undefined") {
    return { height: 0, width: 0 };
  }

  return {
    height: Math.round(window.visualViewport?.height ?? window.innerHeight),
    width: Math.round(window.visualViewport?.width ?? window.innerWidth),
  };
}

function useVisualViewportMetrics() {
  const [metrics, setMetrics] = useState(readVisualViewport);

  useEffect(() => {
    const updateMetrics = () => setMetrics(readVisualViewport());
    const visualViewport = window.visualViewport;

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    visualViewport?.addEventListener("resize", updateMetrics);
    visualViewport?.addEventListener("scroll", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      visualViewport?.removeEventListener("resize", updateMetrics);
      visualViewport?.removeEventListener("scroll", updateMetrics);
    };
  }, []);

  return metrics;
}

function useGrantedDisplayMode(): ImmersiveDisplayMode {
  const [displayMode, setDisplayMode] = useState(getDisplayMode);

  useEffect(() => {
    const updateDisplayMode = () => setDisplayMode(getDisplayMode());
    const displayQueries =
      typeof window.matchMedia === "function"
        ? ["fullscreen", "standalone", "minimal-ui"].map((mode) =>
            window.matchMedia(`(display-mode: ${mode})`),
          )
        : [];

    document.addEventListener("fullscreenchange", updateDisplayMode);
    displayQueries.forEach((query) =>
      query.addEventListener("change", updateDisplayMode),
    );

    return () => {
      document.removeEventListener("fullscreenchange", updateDisplayMode);
      displayQueries.forEach((query) =>
        query.removeEventListener("change", updateDisplayMode),
      );
    };
  }, []);

  return displayMode;
}

function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return visible;
}

function completedBeforeMount() {
  return (
    readProgress().progress?.completedStations.includes(STATION_ID) ?? false
  );
}

function ambientDensityForViewport({
  height,
  width,
}: VisualViewportMetrics): World4AmbientDensity {
  if (width <= 480 && height > width) {
    return "compact-portrait";
  }
  if (height <= 480 && width > height) {
    return "mobile-landscape";
  }
  return "full";
}

export function World4RootScreen() {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const displayMode = useGrantedDisplayMode();
  const visualViewport = useVisualViewportMetrics();
  const documentVisible = useDocumentVisible();
  const [persistedRevisit] = useState(completedBeforeMount);
  const initialProgress = persistedRevisit ? LAST_INDEX : -1;
  const [phase, setPhase] = useState<Station4Phase>("entering");
  const [activeIndex, setActiveIndex] = useState(
    persistedRevisit ? LAST_INDEX : 0,
  );
  const [progress, setProgress] = useState(initialProgress);
  const [revisitActiveIndex, setRevisitActiveIndex] = useState<number | null>(
    null,
  );
  const [cardMotion, setCardMotion] = useState<CardMotion>("stable");
  const [liaNote, setLiaNote] = useState<string | null>(null);
  const [lockedAlt, setLockedAlt] = useState(false);
  const [tapHintDismissSignal, setTapHintDismissSignal] = useState(0);
  const [completionFailed, setCompletionFailed] = useState(false);
  const progressRef = useRef(initialProgress);
  const entryStartedRef = useRef(false);
  const chainStartedRef = useRef(false);
  const stationMarkedRef = useRef(persistedRevisit);
  const navigationStartedRef = useRef(false);
  const tapHintAnchorRef = useRef<HTMLButtonElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  const persistStationCompletion = useCallback(() => {
    if (stationMarkedRef.current) {
      setCompletionFailed(false);
      return true;
    }

    const result = markStationCompleted(STATION_ID);
    if (!result.ok) {
      setCompletionFailed(true);
      setLiaNote(PROGRESS_SAVE_ERROR_COPY);
      return false;
    }

    stationMarkedRef.current = true;
    setCompletionFailed(false);
    setLiaNote(null);
    return true;
  }, []);

  useEffect(() => {
    if (completionFailed) {
      retryButtonRef.current?.focus({ preventScroll: true });
    }
  }, [completionFailed]);

  const onEntrySettled = useCallback(() => {
    setCardMotion("stable");
    setPhase(persistedRevisit ? "exit_ready" : "reading");
  }, [persistedRevisit]);

  const onCardSwap = useCallback((context: { nodeIndex: number | null }) => {
    if (context.nodeIndex === null) {
      return;
    }
    setActiveIndex(context.nodeIndex);
    setCardMotion("in");
  }, []);

  const onStepSettled = useCallback(
    (completion: { nodeIndex: number | null }) => {
      const target = completion.nodeIndex;
      if (target === null) {
        return;
      }

      setActiveIndex(target);
      setCardMotion("stable");
      setTapHintDismissSignal((value) => value + 1);

      if (target > progressRef.current) {
        progressRef.current = target;
        setProgress(target);
        setRevisitActiveIndex(null);

        if (target === LAST_INDEX) {
          chainStartedRef.current = false;
          setPhase("chain");
        } else {
          setPhase("reading");
        }
        return;
      }

      setRevisitActiveIndex(target);
      setPhase("exit_ready");
    },
    [],
  );

  const onChainSettled = useCallback(() => {
    persistStationCompletion();
    setPhase("exit_ready");
  }, [persistStationCompletion]);

  const onExitSettled = useCallback(() => {
    navigate(worldFourToWorldFiveTransitionRoute);
  }, [navigate]);

  const motion = useWorld4MotionController({
    reducedMotion,
    onCardSwap,
    onChainSettled,
    onEntrySettled,
    onExitSettled,
    onStepSettled,
  });

  useEffect(() => {
    if (phase !== "entering" || entryStartedRef.current || !documentVisible) {
      return;
    }
    entryStartedRef.current = true;
    motion.startEntry(persistedRevisit ? "abbreviated" : "full");
    return () => {
      entryStartedRef.current = false;
    };
  }, [documentVisible, motion.startEntry, persistedRevisit, phase]);

  useEffect(() => {
    if (phase !== "chain" || chainStartedRef.current || !documentVisible) {
      return;
    }
    const epoch = motion.startChainComplete();
    if (epoch !== null) {
      chainStartedRef.current = true;
    }
  }, [documentVisible, motion.startChainComplete, phase]);

  function nodeVisualState(index: number): World4NodeVisualState {
    if (phase === "entering") {
      return persistedRevisit ? "completed" : "locked";
    }

    if (phase === "chain") {
      return "completed";
    }

    if (phase === "exit_ready" || phase === "exiting") {
      if (motion.motionKind === "node_step") {
        if (motion.motionNodeIndex !== index) {
          return "completed";
        }
        return ["node_arrival", "node_active", "node_settle"].includes(
          motion.visualPhase,
        )
          ? "active"
          : "completed";
      }
      return revisitActiveIndex === index ? "active" : "completed";
    }

    if (motion.motionKind === "node_step" && motion.motionNodeIndex === index) {
      return ["node_arrival", "node_active", "node_settle"].includes(
        motion.visualPhase,
      )
        ? "active"
        : "available";
    }

    if (index < progress || (index === progress && index !== activeIndex)) {
      return "completed";
    }
    if (index === activeIndex && progress >= 0) {
      return "active";
    }
    if (index === progress + 1) {
      return "available";
    }
    return "locked";
  }

  function tapNode(index: number) {
    setTapHintDismissSignal((value) => value + 1);

    if (motion.inputLocked || (phase !== "reading" && phase !== "exit_ready")) {
      return;
    }

    const state = nodeVisualState(index);
    if (state === "locked") {
      setLiaNote(lockedAlt ? station4Lia.lockedAlt : station4Lia.locked);
      setLockedAlt((value) => !value);
      return;
    }
    if (state === "active") {
      return;
    }
    if (state === "completed" && !stationMarkedRef.current) {
      return;
    }

    const epoch = motion.startNodeStep(index);
    if (epoch === null) {
      return;
    }

    setLiaNote(null);
    setRevisitActiveIndex(null);
    setCardMotion("out");
    if (phase === "reading") {
      setPhase("moving");
    }
  }

  function handleExit() {
    setTapHintDismissSignal((value) => value + 1);
    if (
      phase !== "exit_ready" ||
      motion.inputLocked ||
      navigationStartedRef.current
    ) {
      return;
    }

    if (!persistStationCompletion()) {
      return;
    }

    const epoch = motion.startExit();
    if (epoch === null) {
      return;
    }

    navigationStartedRef.current = true;
    setPhase("exiting");
  }

  const station4State = useMemo(() => {
    if (phase === "entering") {
      return "station4_entering";
    }
    if (phase === "exiting") {
      return "station4_exiting";
    }
    if (motion.motionKind === "node_step" && motion.motionNodeIndex !== null) {
      return `station4_node_${motion.motionNodeIndex + 1}_activating`;
    }
    if (phase === "chain") {
      return "station4_chain_completed";
    }
    if (phase === "exit_ready") {
      return "station4_ready_to_exit";
    }
    if (progress < 0) {
      return "station4_node_1_available";
    }
    return `station4_node_${activeIndex + 1}_active`;
  }, [activeIndex, motion.motionKind, motion.motionNodeIndex, phase, progress]);

  const statusMessage = useMemo(() => {
    if (liaNote) {
      return liaNote;
    }
    if (phase === "chain") {
      return station4Lia.chainComplete;
    }
    if (phase === "exit_ready" || phase === "exiting") {
      return station4Lia.revisit;
    }
    if (phase === "reading" && progress >= 0 && progress < LAST_INDEX) {
      return station4Lia.nextHint;
    }
    if (phase === "entering" && persistedRevisit) {
      return station4Lia.revisit;
    }
    if (phase === "entering" || (phase === "reading" && progress < 0)) {
      return station4Lia.intro;
    }
    return null;
  }, [liaNote, persistedRevisit, phase, progress]);

  const activeNode = station4Nodes[activeIndex];
  const nodeStates = station4Nodes.map((_, index) => nodeVisualState(index));
  const chainComplete =
    phase === "chain" || phase === "exit_ready" || phase === "exiting";
  const ambientDensity = ambientDensityForViewport(visualViewport);
  const tapHintActive =
    phase === "reading" &&
    progress < 0 &&
    motion.motionKind === null &&
    !motion.inputLocked;
  const renderedEntryMode =
    motion.entryMode ??
    (phase === "entering"
      ? persistedRevisit
        ? "abbreviated"
        : "full"
      : "none");
  const viewportStyle = {
    "--s4-visual-viewport-height": `${visualViewport.height}px`,
    "--s4-visual-viewport-width": `${visualViewport.width}px`,
  } as CSSProperties;

  return (
    <main
      aria-labelledby="station4-title"
      className="s4-screen"
      data-display-mode={displayMode}
      data-layout-contract="controls-stage-gap-then-trailing-space"
      data-qr-camera="blocked"
      data-sensitive-permissions="blocked"
      data-station4-active-node={activeNode.id}
      data-station4-card-motion={cardMotion}
      data-station4-document-visibility={documentVisible ? "visible" : "hidden"}
      data-station4-entry-mode={renderedEntryMode}
      data-station4-input-locked={motion.inputLocked}
      data-station4-motion-epoch={motion.motionEpoch}
      data-station4-motion-kind={motion.motionKind ?? "none"}
      data-station4-motion-node={
        motion.motionNodeIndex === null ? "none" : motion.motionNodeIndex + 1
      }
      data-station4-motion-phase={motion.visualPhase}
      data-station4-progress={progress + 1}
      data-station4-reduced-motion={reducedMotion}
      data-station4-revisit={chainComplete}
      data-station4-state={station4State}
      data-visual-viewport-height={visualViewport.height}
      data-visual-viewport-width={visualViewport.width}
      style={viewportStyle}
    >
      <ImmersiveModeControl className="s4-immersive-control" />

      <header className="s4-title">
        <svg
          aria-hidden="true"
          className="s4-title__leaf"
          focusable="false"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 3 C13 8 16 10 19 11 C16 12 13 14 12 19 C11 14 8 12 5 11 C8 10 11 8 12 3 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="12" cy="21.4" fill="currentColor" r="0.9" />
        </svg>
        <h1 id="station4-title">Estación IV</h1>
        <p className="s4-title__sub">Operación técnica</p>
        <p className="s4-title__table-name">
          <span aria-hidden="true" className="s4-title__rule" />
          Mesa de sistema
          <span aria-hidden="true" className="s4-title__rule" />
        </p>
      </header>

      <OrientationHint
        className="s4-orientation-hint"
        dataHook="world4-stage"
        storageKey="gvo:world4:orientation-hint:dismissed"
      />

      <section className="s4-experience">
        <div className="s4-panel">
          <article
            aria-atomic="true"
            aria-live="polite"
            className="s4-card"
            data-backplate={WORLD4_BACKPLATE_SLICES.textCard.asset}
            data-border-image-slice={
              WORLD4_BACKPLATE_SLICES.textCard.borderImageSlice
            }
            data-runtime-asset={WORLD4_BACKPLATE_SLICES.textCard.asset}
            data-stage-layer="z12"
            data-station4-card={activeNode.id}
            data-station4-card-motion={cardMotion}
          >
            <p className="s4-card__step">Paso {activeNode.order} de 8</p>
            <h2 className="s4-card__title">{activeNode.title}</h2>
            <p className="s4-card__text">{activeNode.text}</p>
            <p className="s4-card__learning">{activeNode.learning}</p>
          </article>

          <div className="s4-panel__controls">
            <p
              className="s4-status"
              data-station4-status={statusMessage ? "visible" : "empty"}
              role="status"
            >
              {statusMessage}
            </p>

            {phase === "exit_ready" ||
            phase === "exiting" ||
            motion.visualPhase === "exit_reveal" ? (
              <button
                ref={retryButtonRef}
                aria-label={
                  completionFailed
                    ? PROGRESS_SAVE_RETRY_LABEL
                    : station4Exit.accessibleLabel
                }
                className="s4-exit"
                data-backplate={WORLD4_BACKPLATE_SLICES.openWorld5.asset}
                data-border-image-slice={
                  WORLD4_BACKPLATE_SLICES.openWorld5.borderImageSlice
                }
                data-runtime-asset={WORLD4_BACKPLATE_SLICES.openWorld5.asset}
                data-stage-layer="z12"
                data-station4-action="open-world5"
                disabled={phase === "exiting" || motion.inputLocked}
                onClick={handleExit}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleExit();
                  }
                }}
                type="button"
              >
                <span className="s4-exit__label">
                  {completionFailed
                    ? PROGRESS_SAVE_RETRY_LABEL
                    : station4Exit.label}
                </span>
                <span aria-hidden="true" className="s4-exit__arrow">
                  ›
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <World4Stage
          activeIndex={activeIndex}
          ambientDensity={ambientDensity}
          chainComplete={chainComplete}
          firstPassEntry={phase === "entering" && !persistedRevisit}
          inputLocked={motion.inputLocked}
          motionEpoch={motion.motionEpoch}
          motionNodeIndex={motion.motionNodeIndex}
          nodeStates={nodeStates}
          onNodeActivate={tapNode}
          progress={progress}
          reducedMotion={reducedMotion}
          revisitActive={
            revisitActiveIndex !== null ||
            (phase === "exit_ready" && motion.motionKind === "node_step")
          }
          tapHintAnchorRef={tapHintAnchorRef}
          visualPhase={motion.visualPhase}
        />
      </section>

      <World4TapHint
        active={tapHintActive}
        anchorRef={tapHintAnchorRef}
        dismissSignal={tapHintDismissSignal}
        reducedMotion={reducedMotion}
        targetLabel={station4Nodes[0].accessibleLabel}
      />

      <footer aria-hidden="true" className="s4-footer">
        <span className="s4-footer__dot" />
        <span className="s4-footer__dot" />
        <span className="s4-footer__station">IV</span>
        <span className="s4-footer__dot" />
        <span className="s4-footer__dot" />
      </footer>

      <div
        aria-hidden="true"
        className="s4-trailing-space"
        data-station4-trailing-space="true"
      />
    </main>
  );
}
