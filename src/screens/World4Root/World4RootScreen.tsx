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
  readWorld4Checkpoint,
  removeWorld4Checkpoint,
  type World4ResumeMode,
  type World4SettledIndex,
  writeWorld4Checkpoint,
} from "../../domain/checkpoints/world4Checkpoint";
import {
  markStationCompleted,
  readProgress,
} from "../../domain/progress/progress.storage";
import {
  getDisplayMode,
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
type CheckpointRecoveryStatus =
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable"
  | null;
type InitialResumeMode = World4ResumeMode | "fresh" | "completed";
type PendingCheckpointAction =
  | Readonly<{ kind: "step"; target: World4SettledIndex }>
  | Readonly<{ kind: "completion_retry" }>
  | Readonly<{ kind: "cleanup" }>;

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

function readInitialWorld4State() {
  const completed = completedBeforeMount();
  const checkpoint = readWorld4Checkpoint();
  const recoveryStatus: CheckpointRecoveryStatus =
    checkpoint.status === "empty" || checkpoint.status === "ok"
      ? null
      : checkpoint.status;

  if (completed) {
    return {
      activeIndex: LAST_INDEX,
      completionFailed: false,
      persistedRevisit: true,
      progress: LAST_INDEX,
      recoveryStatus,
      resumeMode: "completed" as const,
    };
  }

  if (checkpoint.status === "ok") {
    const progress = checkpoint.checkpoint.highestSettledIndex;
    return {
      activeIndex: progress < 0 ? 0 : progress,
      completionFailed: checkpoint.checkpoint.resumeMode === "completion_retry",
      persistedRevisit: false,
      progress,
      recoveryStatus: null,
      resumeMode: checkpoint.checkpoint.resumeMode,
    };
  }

  return {
    activeIndex: 0,
    completionFailed: false,
    persistedRevisit: false,
    progress: -1,
    recoveryStatus,
    resumeMode: "fresh" as const,
  };
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
  const [initialState] = useState(readInitialWorld4State);
  const [persistedRevisit] = useState(initialState.persistedRevisit);
  const initialProgress = initialState.progress;
  const [resumeMode, setResumeMode] = useState<InitialResumeMode>(
    initialState.resumeMode,
  );
  const [checkpointRecoveryStatus, setCheckpointRecoveryStatus] =
    useState<CheckpointRecoveryStatus>(initialState.recoveryStatus);
  const [checkpointResetConfirmation, setCheckpointResetConfirmation] =
    useState(false);
  const [pendingCheckpointAction, setPendingCheckpointAction] =
    useState<PendingCheckpointAction | null>(null);
  const [phase, setPhase] = useState<Station4Phase>("entering");
  const [activeIndex, setActiveIndex] = useState(initialState.activeIndex);
  const [progress, setProgress] = useState(initialProgress);
  const [revisitActiveIndex, setRevisitActiveIndex] = useState<number | null>(
    null,
  );
  const [cardMotion, setCardMotion] = useState<CardMotion>("stable");
  const [liaNote, setLiaNote] = useState<string | null>(null);
  const [lockedAlt, setLockedAlt] = useState(false);
  const [tapHintDismissSignal, setTapHintDismissSignal] = useState(0);
  const [completionFailed, setCompletionFailed] = useState(
    initialState.completionFailed,
  );
  const progressRef = useRef(initialProgress);
  const entryStartedRef = useRef(false);
  const chainStartedRef = useRef(false);
  const stationMarkedRef = useRef(persistedRevisit);
  const navigationStartedRef = useRef(false);
  const tapHintAnchorRef = useRef<HTMLButtonElement>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const checkpointRetryButtonRef = useRef<HTMLButtonElement>(null);

  const checkpointInputBlocked =
    checkpointRecoveryStatus !== null || pendingCheckpointAction !== null;

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
    if (completionFailed && phase === "exit_ready") {
      retryButtonRef.current?.focus({ preventScroll: true });
    }
  }, [completionFailed, phase]);

  useEffect(() => {
    if (pendingCheckpointAction) {
      checkpointRetryButtonRef.current?.focus({ preventScroll: true });
    }
  }, [pendingCheckpointAction]);

  const onEntrySettled = useCallback(() => {
    setCardMotion("stable");
    if (persistedRevisit || resumeMode === "completion_retry") {
      setPhase("exit_ready");
      return;
    }
    setPhase(resumeMode === "chain_pending" ? "chain" : "reading");
  }, [persistedRevisit, resumeMode]);

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
        const nextMode: World4ResumeMode =
          target === LAST_INDEX ? "chain_pending" : "reading";
        const written = writeWorld4Checkpoint({
          highestSettledIndex: target as World4SettledIndex,
          resumeMode: nextMode,
        });
        if (!written.ok) {
          if (
            written.reason === "corrupt" ||
            written.reason === "unknown_version"
          ) {
            setCheckpointRecoveryStatus(written.reason);
            setCheckpointResetConfirmation(false);
          } else {
            setPendingCheckpointAction({
              kind: "step",
              target: target as World4SettledIndex,
            });
          }
          setLiaNote(PROGRESS_SAVE_ERROR_COPY);
          setPhase("reading");
          return;
        }

        progressRef.current = target;
        setProgress(target);
        setRevisitActiveIndex(null);
        setResumeMode(nextMode);
        if (target === LAST_INDEX) {
          chainStartedRef.current = false;
          setPhase("chain");
        } else setPhase("reading");
        return;
      }

      setRevisitActiveIndex(target);
      setPhase("exit_ready");
    },
    [],
  );

  const onChainSettled = useCallback(() => {
    if (!persistStationCompletion()) {
      const written = writeWorld4Checkpoint({
        highestSettledIndex: LAST_INDEX as World4SettledIndex,
        resumeMode: "completion_retry",
      });
      if (!written.ok) {
        if (
          written.reason === "corrupt" ||
          written.reason === "unknown_version"
        ) {
          setCheckpointRecoveryStatus(written.reason);
          setCheckpointResetConfirmation(false);
        } else {
          setPendingCheckpointAction({ kind: "completion_retry" });
        }
      } else {
        setResumeMode("completion_retry");
      }
      setPhase("exit_ready");
      return;
    }

    const removed = removeWorld4Checkpoint();
    if (!removed.ok) {
      setPendingCheckpointAction({ kind: "cleanup" });
      setLiaNote(PROGRESS_SAVE_ERROR_COPY);
    } else {
      setResumeMode("completed");
    }
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
    if (
      phase !== "entering" ||
      entryStartedRef.current ||
      !documentVisible ||
      checkpointRecoveryStatus
    ) {
      return;
    }
    entryStartedRef.current = true;
    motion.startEntry(
      persistedRevisit || resumeMode !== "fresh" ? "abbreviated" : "full",
    );
    return () => {
      entryStartedRef.current = false;
    };
  }, [
    checkpointRecoveryStatus,
    documentVisible,
    motion.startEntry,
    persistedRevisit,
    phase,
    resumeMode,
  ]);

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
    if (
      pendingCheckpointAction?.kind === "step" &&
      pendingCheckpointAction.target === index
    ) {
      return "active";
    }
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

    if (
      motion.inputLocked ||
      checkpointInputBlocked ||
      (phase !== "reading" && phase !== "exit_ready")
    ) {
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

    const completionRetryOnly =
      completionFailed || resumeMode === "completion_retry";
    if (!persistStationCompletion()) {
      return;
    }

    const removed = removeWorld4Checkpoint();
    if (!removed.ok) {
      setPendingCheckpointAction({ kind: "cleanup" });
      setLiaNote(PROGRESS_SAVE_ERROR_COPY);
      return;
    }
    setResumeMode("completed");
    if (completionRetryOnly) {
      setLiaNote(null);
      return;
    }

    const epoch = motion.startExit();
    if (epoch === null) {
      return;
    }

    navigationStartedRef.current = true;
    setPhase("exiting");
  }

  function applyPersistedStep(target: World4SettledIndex) {
    progressRef.current = target;
    setProgress(target);
    setRevisitActiveIndex(null);
    setLiaNote(null);
    setPendingCheckpointAction(null);
    if (target === LAST_INDEX) {
      setResumeMode("chain_pending");
      chainStartedRef.current = false;
      setPhase("chain");
    } else {
      setResumeMode("reading");
      setPhase("reading");
    }
  }

  function retryPendingCheckpoint() {
    if (!pendingCheckpointAction) return;
    if (pendingCheckpointAction.kind === "cleanup") {
      const removed = removeWorld4Checkpoint();
      if (removed.ok) {
        setPendingCheckpointAction(null);
        setLiaNote(null);
        setResumeMode("completed");
        retryButtonRef.current?.focus({ preventScroll: true });
      }
      return;
    }

    const target =
      pendingCheckpointAction.kind === "step"
        ? pendingCheckpointAction.target
        : (LAST_INDEX as World4SettledIndex);
    const nextMode: World4ResumeMode =
      pendingCheckpointAction.kind === "completion_retry"
        ? "completion_retry"
        : target === LAST_INDEX
          ? "chain_pending"
          : "reading";
    const written = writeWorld4Checkpoint({
      highestSettledIndex: target,
      resumeMode: nextMode,
    });
    if (!written.ok) {
      if (
        written.reason === "corrupt" ||
        written.reason === "unknown_version"
      ) {
        setCheckpointRecoveryStatus(written.reason);
        setCheckpointResetConfirmation(false);
        setPendingCheckpointAction(null);
      }
      return;
    }

    if (pendingCheckpointAction.kind === "completion_retry") {
      setPendingCheckpointAction(null);
      setResumeMode("completion_retry");
      setCompletionFailed(true);
      setLiaNote(PROGRESS_SAVE_ERROR_COPY);
      retryButtonRef.current?.focus({ preventScroll: true });
      return;
    }
    applyPersistedStep(target);
  }

  function applyRecoveredWorld4State() {
    const completed = completedBeforeMount();
    const safeProgress = completed ? LAST_INDEX : -1;
    progressRef.current = safeProgress;
    stationMarkedRef.current = completed;
    entryStartedRef.current = false;
    chainStartedRef.current = false;
    setProgress(safeProgress);
    setActiveIndex(completed ? LAST_INDEX : 0);
    setRevisitActiveIndex(null);
    setCardMotion("stable");
    setCompletionFailed(false);
    setLiaNote(null);
    setPendingCheckpointAction(null);
    setResumeMode(completed ? "completed" : "fresh");
    setPhase("entering");
  }

  function retryCheckpointRead() {
    const checkpoint = readWorld4Checkpoint();
    if (
      checkpoint.status === "corrupt" ||
      checkpoint.status === "unknown_version" ||
      checkpoint.status === "storage_unavailable"
    ) {
      setCheckpointRecoveryStatus(checkpoint.status);
      return;
    }
    setCheckpointRecoveryStatus(null);
    if (checkpoint.status === "ok" && !completedBeforeMount()) {
      const restoredProgress = checkpoint.checkpoint.highestSettledIndex;
      progressRef.current = restoredProgress;
      entryStartedRef.current = false;
      chainStartedRef.current = false;
      setProgress(restoredProgress);
      setActiveIndex(restoredProgress < 0 ? 0 : restoredProgress);
      setCompletionFailed(
        checkpoint.checkpoint.resumeMode === "completion_retry",
      );
      setResumeMode(checkpoint.checkpoint.resumeMode);
      setPhase("entering");
      return;
    }
    applyRecoveredWorld4State();
  }

  function confirmCheckpointReset() {
    const removed = removeWorld4Checkpoint();
    if (!removed.ok) {
      setCheckpointRecoveryStatus("storage_unavailable");
      setCheckpointResetConfirmation(false);
      return;
    }
    setCheckpointRecoveryStatus(null);
    setCheckpointResetConfirmation(false);
    applyRecoveredWorld4State();
  }

  const station4State = useMemo(() => {
    if (checkpointRecoveryStatus || pendingCheckpointAction) {
      return "station4_checkpoint_blocked";
    }
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
  }, [
    activeIndex,
    checkpointRecoveryStatus,
    motion.motionKind,
    motion.motionNodeIndex,
    pendingCheckpointAction,
    phase,
    progress,
  ]);

  const statusMessage = useMemo(() => {
    if (checkpointRecoveryStatus) {
      return checkpointResetConfirmation
        ? "¿Restablecer el avance guardado de este mundo? El progreso global del recorrido se conservará."
        : "No fue posible recuperar el avance de este mundo.";
    }
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
  }, [
    checkpointRecoveryStatus,
    checkpointResetConfirmation,
    liaNote,
    persistedRevisit,
    phase,
    progress,
  ]);

  const activeNode = station4Nodes[activeIndex];
  const nodeStates = station4Nodes.map((_, index) => nodeVisualState(index));
  const chainComplete =
    phase === "chain" || phase === "exit_ready" || phase === "exiting";
  const ambientDensity = ambientDensityForViewport(visualViewport);
  const tapHintActive =
    phase === "reading" &&
    progress < 0 &&
    motion.motionKind === null &&
    !motion.inputLocked &&
    !checkpointInputBlocked;
  const renderedEntryMode =
    motion.entryMode ??
    (phase === "entering"
      ? persistedRevisit || resumeMode !== "fresh"
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
      data-station4-checkpoint-blocked={checkpointInputBlocked}
      data-station4-checkpoint-recovery={checkpointRecoveryStatus ?? "none"}
      data-station4-resume-mode={resumeMode}
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

            {checkpointRecoveryStatus === "storage_unavailable" ? (
              <button
                className="s4-exit"
                data-station4-action="retry-checkpoint-read"
                onClick={retryCheckpointRead}
                type="button"
              >
                <span className="s4-exit__label">Reintentar</span>
              </button>
            ) : checkpointRecoveryStatus && !checkpointResetConfirmation ? (
              <button
                className="s4-exit"
                data-station4-action="reset-world-checkpoint"
                onClick={() => setCheckpointResetConfirmation(true)}
                type="button"
              >
                <span className="s4-exit__label">
                  Restablecer avance de este mundo
                </span>
              </button>
            ) : checkpointRecoveryStatus && checkpointResetConfirmation ? (
              <>
                <button
                  className="s4-exit"
                  onClick={() => setCheckpointResetConfirmation(false)}
                  type="button"
                >
                  <span className="s4-exit__label">Cancelar</span>
                </button>
                <button
                  className="s4-exit"
                  onClick={confirmCheckpointReset}
                  type="button"
                >
                  <span className="s4-exit__label">Restablecer</span>
                </button>
              </>
            ) : pendingCheckpointAction && phase !== "exit_ready" ? (
              <button
                ref={checkpointRetryButtonRef}
                className="s4-exit"
                data-station4-action="retry-checkpoint-write"
                onClick={retryPendingCheckpoint}
                type="button"
              >
                <span className="s4-exit__label">
                  {PROGRESS_SAVE_RETRY_LABEL}
                </span>
              </button>
            ) : phase === "exit_ready" ||
              phase === "exiting" ||
              motion.visualPhase === "exit_reveal" ? (
              <button
                ref={retryButtonRef}
                aria-label={
                  completionFailed || pendingCheckpointAction
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
                onClick={
                  pendingCheckpointAction ? retryPendingCheckpoint : handleExit
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (pendingCheckpointAction) retryPendingCheckpoint();
                    else handleExit();
                  }
                }}
                type="button"
              >
                <span className="s4-exit__label">
                  {completionFailed || pendingCheckpointAction
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
          inputLocked={motion.inputLocked || checkpointInputBlocked}
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
