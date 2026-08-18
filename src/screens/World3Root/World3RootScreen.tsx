import "./World3RootScreen.css";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { InterstationQrGate } from "../../app/qr/InterstationQrGate";
import { worldThreeToWorldFourTransitionRoute } from "../../app/routes";
import {
  readProgress,
  markStationCompleted,
} from "../../domain/progress/progress.storage";
import {
  readWorld3Checkpoint,
  removeWorld3Checkpoint,
  WORLD3_RECORD_ORDER,
  writeWorld3Checkpoint,
  type Station3RecordId,
} from "../../domain/checkpoints/world3Checkpoint";
import {
  PROGRESS_SAVE_ERROR_COPY,
  PROGRESS_SAVE_RETRY_LABEL,
} from "../../shared/progress/progressSaveError";
import { GestureHint } from "../../components/GestureHint/GestureHint";
import { PlantNotebookAnnotations } from "./PlantNotebookAnnotations";
import {
  PlantNarrativeSequence,
  type PlantNarrativeStage,
} from "./PlantNarrativeSequence";
import { PrototypeNotebookAnnotations } from "./PrototypeNotebookAnnotations";
import {
  PrototypeNarrativeSequence,
  type PrototypeNarrativeStage,
} from "./PrototypeNarrativeSequence";
import {
  PrototypeTestRoute,
  type PrototypeTestRouteStage,
} from "./PrototypeTestRoute";
import { SignalNotebookAnnotations } from "./SignalNotebookAnnotations";
import {
  SignalNarrativeSequence,
  type SignalNarrativeStage,
} from "./SignalNarrativeSequence";
import {
  SignalTraceDisplay,
  type SignalTraceStage,
} from "./SignalTraceDisplay";
import { World3LiaActor, type World3LiaPose } from "./World3LiaActor";
import { World3IndexNotebookMarks } from "./World3IndexNotebookMarks";
import { World3PageTurnLayer } from "./World3PageTurnLayer";
import {
  station3Lia,
  station3Records,
  station3Stamp,
  type Station3RecordContent,
} from "./station3Content";
import { PixelCheck } from "./station3PixelArt";
import { world3RuntimeAssets } from "./world3RuntimeAssets";

type PlantPagePhase =
  | "entering"
  | "observing"
  | "ready"
  | "confirmed"
  | "revisit";

type PrototypePagePhase = PrototypeTestRouteStage;

type SignalPagePhase = SignalTraceStage;

type Station3Phase =
  | { kind: "entering" }
  | { kind: "index" }
  | {
      kind: "turning";
      record: Station3RecordId;
      dir: "open" | "close";
      plantPhase?: PlantPagePhase;
      prototypePhase?: PrototypePagePhase;
      signalPhase?: SignalPagePhase;
    }
  | { kind: "page"; record: "planta"; plantPhase: PlantPagePhase }
  | {
      kind: "page";
      record: "prototipo";
      prototypePhase: PrototypePagePhase;
    }
  | { kind: "page"; record: "senal"; signalPhase: SignalPagePhase };

type RecordVisualState = "locked" | "available" | "completed";

type ReturnModality = "pointer" | "keyboard";

type StampStage = "hidden" | "unlocking" | "ready";

type World3RecoveryStatus =
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable";

type PendingRecordSave = Readonly<{
  completedRecordIds: readonly Station3RecordId[];
  recordId: Station3RecordId;
}>;

type World3InitialState = Readonly<{
  completedRecordIds: readonly Station3RecordId[];
  recoveryStatus: World3RecoveryStatus | null;
  stampStage: StampStage;
}>;

type World3IndexLayout =
  | "compact-scroll"
  | "portrait-balanced"
  | "tablet-portrait"
  | "tablet-landscape";

const ticketStateName: Record<Station3RecordId, string> = {
  planta: "plant",
  prototipo: "prototype",
  senal: "signal",
};

const recordStateLabel: Record<RecordVisualState, string> = {
  locked: "Bloqueado. Activa para recibir orientación",
  available: "Disponible",
  completed: "Completado",
};

const recordStateVisualLabel: Record<RecordVisualState, string> = {
  locked: "Bloqueado",
  available: "Disponible",
  completed: "Completado",
};

const recordIndexAssets: Record<Station3RecordId, string> =
  world3RuntimeAssets.records;

function resolveWorld3InitialState(): World3InitialState {
  const progress = readProgress();
  if (progress.progress?.completedStations.includes(3)) {
    return {
      completedRecordIds: [...WORLD3_RECORD_ORDER],
      recoveryStatus: null,
      stampStage: "ready",
    };
  }

  const checkpoint = readWorld3Checkpoint();
  if (checkpoint.status === "ok") {
    return {
      completedRecordIds: [...checkpoint.checkpoint.completedRecordIds],
      recoveryStatus: null,
      stampStage:
        checkpoint.checkpoint.completedRecordIds.length ===
        WORLD3_RECORD_ORDER.length
          ? "ready"
          : "hidden",
    };
  }

  return {
    completedRecordIds: [],
    recoveryStatus: checkpoint.status === "empty" ? null : checkpoint.status,
    stampStage: "hidden",
  };
}

function resolveQaMotionOverride() {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return null;
  }
  const value = new URLSearchParams(window.location.search).get("gvoQaMotion");
  if (value === "normal") {
    return false;
  }
  if (value === "reduced") {
    return true;
  }
  return null;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    const qaOverride = resolveQaMotionOverride();
    if (qaOverride !== null) {
      return qaOverride;
    }
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const qaOverride = resolveQaMotionOverride();
    if (qaOverride !== null) {
      setReduced(qaOverride);
      return;
    }
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

function resolveWorld3IndexLayout(
  width: number,
  height: number,
): World3IndexLayout {
  if (width >= 900 && width > height) {
    return "tablet-landscape";
  }
  if (width >= 700) {
    return "tablet-portrait";
  }
  if (height <= 620 || (width >= 390 && height <= 650)) {
    return "compact-scroll";
  }
  return "portrait-balanced";
}

function useWorld3IndexLayout() {
  const [layout, setLayout] = useState<World3IndexLayout>(() =>
    typeof window === "undefined"
      ? "portrait-balanced"
      : resolveWorld3IndexLayout(window.innerWidth, window.innerHeight),
  );

  useEffect(() => {
    const update = () =>
      setLayout(
        resolveWorld3IndexLayout(window.innerWidth, window.innerHeight),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return layout;
}

type Station3IndexReturnFrame = {
  label: string;
  atMs: number;
  stationState: string | undefined;
  indexEntry: string | undefined;
  indexVisible: string | undefined;
  fontStatus: FontFaceSetLoadStatus | "unsupported";
  layoutMarker: string | undefined;
  scrollY: number;
  activeElement: string | null;
  regions: Record<
    string,
    {
      top: number;
      left: number;
      width: number;
      height: number;
      transform: string;
      transformOrigin: string;
      opacity: string;
      animationDuration: string;
      animationTimingFunction: string;
      overflow: string;
      marginTop: string;
      marginBottom: string;
      paddingTop: string;
      paddingBottom: string;
      fontFamily: string;
      className: string;
      scrollTop: number;
    } | null
  >;
  records: Array<{
    id: string | undefined;
    top: number;
    left: number;
    width: number;
    height: number;
    transform: string;
  }>;
};

type Station3IndexReturnTrace = {
  record: Station3RecordId;
  direction: "open" | "close";
  startedAt: number;
  frames: Station3IndexReturnFrame[];
};

function resetWorld3NotebookScroll() {
  for (const selector of [".s3-notebook", ".s3-page--base"]) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.scrollTop = 0;
      element.scrollLeft = 0;
    }
  }
}

function beginPageTurnTrace(
  record: Station3RecordId,
  direction: "open" | "close",
  duration: number,
) {
  if (!import.meta.env.DEV || typeof document === "undefined") {
    return;
  }

  const startedAt = performance.now();
  const trace: Station3IndexReturnTrace = {
    record,
    direction,
    startedAt,
    frames: [],
  };
  const traceWindow = window as typeof window & {
    __gvoStation3IndexReturnTraces?: Station3IndexReturnTrace[];
    __gvoStation3PageTurnTraces?: Station3IndexReturnTrace[];
  };
  traceWindow.__gvoStation3PageTurnTraces ??= [];
  traceWindow.__gvoStation3PageTurnTraces.push(trace);
  if (direction === "close") {
    traceWindow.__gvoStation3IndexReturnTraces ??= [];
    traceWindow.__gvoStation3IndexReturnTraces.push(trace);
  }

  const capture = (label: string) => {
    const root = document.querySelector<HTMLElement>(".s3-screen");
    const indexLayer = document.querySelector<HTMLElement>(
      '[data-station3-index-layer="mounted"]',
    );
    const records = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".s3-page-layer--index [data-station3-record]",
      ),
    ).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        id: element.dataset.station3Record,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        transform: getComputedStyle(element).transform,
      };
    });
    const measureRegion = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        transform: style.transform,
        transformOrigin: style.transformOrigin,
        opacity: style.opacity,
        animationDuration: style.animationDuration,
        animationTimingFunction: style.animationTimingFunction,
        overflow: style.overflow,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        fontFamily: style.fontFamily,
        className: element.className,
        scrollTop: element.scrollTop,
      };
    };

    trace.frames.push({
      label,
      atMs: performance.now() - startedAt,
      stationState: root?.dataset.station3State,
      indexEntry: document.querySelector<HTMLElement>(
        "[data-station3-index-entry]",
      )?.dataset.station3IndexEntry,
      indexVisible: indexLayer?.dataset.station3LayerVisible,
      fontStatus: document.fonts?.status ?? "unsupported",
      layoutMarker: root?.dataset.world3IndexLayout,
      scrollY: window.scrollY,
      activeElement:
        document.activeElement instanceof HTMLElement
          ? (document.activeElement.dataset.station3Record ??
            document.activeElement.dataset.station3Action ??
            document.activeElement.tagName.toLowerCase())
          : null,
      regions: {
        header: measureRegion(".s3-title"),
        notebook: measureRegion(".s3-notebook"),
        pageViewport: measureRegion("[data-station3-notebook-page-viewport]"),
        page: measureRegion(".s3-page--base"),
        pageTurn: measureRegion("[data-station3-page-turn]"),
        pageTurnPlane: measureRegion("[data-station3-page-turn-plane]"),
        pageTurnFront: measureRegion(".s3-page-turn__face--front"),
        pageTurnBack: measureRegion(".s3-page-turn__face--back"),
        pageTurnAsset: measureRegion("[data-station3-turn-texture]"),
        indexLayer: measureRegion(".s3-page-layer--index"),
        detailLayer: measureRegion(".s3-page-layer--detail"),
        index: measureRegion(".s3-page-layer--index .s3-index"),
        list: measureRegion(".s3-page-layer--index .s3-index__records"),
        lia: measureRegion(".s3-lia"),
        dialog: measureRegion(".s3-lia-note"),
        cta: measureRegion(".s3-guide-rail [data-station3-action]"),
        footer: measureRegion(".s3-footer"),
      },
      records,
    });
    root?.setAttribute(
      "data-station3-page-turn-frame-trace",
      JSON.stringify(trace),
    );
    if (direction === "close") {
      root?.setAttribute(
        "data-station3-index-frame-trace",
        JSON.stringify(trace),
      );
    }
  };

  capture("T-1");
  queueMicrotask(() => {
    capture("T0");
    capture("0%");
    let raf = 0;
    const captureRaf = () => {
      raf += 1;
      capture(`RAF${raf}`);
      if (raf < 4) {
        window.requestAnimationFrame(captureRaf);
      }
    };
    window.requestAnimationFrame(captureRaf);
  });

  for (const delay of [100, 300, 500]) {
    window.setTimeout(() => capture(`${delay}ms`), delay);
  }
  for (const progress of [10, 25, 50, 75, 90, 100]) {
    const delay =
      progress === 100
        ? Math.max(0, duration - 1)
        : Math.round((duration * progress) / 100);
    window.setTimeout(() => capture(`${progress}%`), delay);
  }
  window.setTimeout(() => capture("fin"), duration + 32);
}

export function World3RootScreen() {
  const navigate = useNavigate();
  const [initialWorld3State] = useState(resolveWorld3InitialState);
  const completionLockRef = useRef(false);
  const recordSaveLockRef = useRef(false);
  const recordRetryButtonRef = useRef<HTMLButtonElement | null>(null);
  const recordButtonRefs = useRef<
    Partial<Record<Station3RecordId, HTMLButtonElement | null>>
  >({});
  const pageViewportRef = useRef<HTMLDivElement | null>(null);
  const indexGuideAnchorRef = useRef<HTMLSpanElement | null>(null);
  const returnModalityRef = useRef<ReturnModality>("pointer");
  const reducedMotion = usePrefersReducedMotion();
  const indexLayout = useWorld3IndexLayout();
  const [phase, setPhase] = useState<Station3Phase>({ kind: "entering" });
  const [completed, setCompleted] = useState<ReadonlySet<Station3RecordId>>(
    () => new Set(initialWorld3State.completedRecordIds),
  );
  const [stampStage, setStampStage] = useState<StampStage>(
    initialWorld3State.stampStage,
  );
  const [liaMessage, setLiaMessage] = useState<string | null>(
    initialWorld3State.completedRecordIds.length === WORLD3_RECORD_ORDER.length
      ? station3Lia.revisit
      : station3Lia.intro,
  );
  const [checkpointRecovery, setCheckpointRecovery] =
    useState<World3RecoveryStatus | null>(initialWorld3State.recoveryStatus);
  const [checkpointRecoveryConfirming, setCheckpointRecoveryConfirming] =
    useState(false);
  const [pendingRecordSave, setPendingRecordSave] =
    useState<PendingRecordSave | null>(null);
  const [recordSavePersisting, setRecordSavePersisting] = useState(false);
  const [lockedNudgeAlt, setLockedNudgeAlt] = useState(false);
  const [restoreRecordFocus, setRestoreRecordFocus] =
    useState<Station3RecordId | null>(null);
  const [returnModality, setReturnModality] =
    useState<ReturnModality>("pointer");
  const [highlightedRecord, setHighlightedRecord] =
    useState<Station3RecordId | null>(null);
  const [hasReturnedToIndex, setHasReturnedToIndex] = useState(false);
  const [newlyAvailableRecord, setNewlyAvailableRecord] =
    useState<Station3RecordId | null>(null);
  const [plantAnnotationStage, setPlantAnnotationStage] =
    useState<PlantNarrativeStage>("step-1");
  const [prototypeAnnotationStage, setPrototypeAnnotationStage] =
    useState<PrototypeNarrativeStage>("assembly");
  const [signalAnnotationStage, setSignalAnnotationStage] =
    useState<SignalNarrativeStage>("capturing");
  const [exiting, setExiting] = useState(false);
  const [completionPersisting, setCompletionPersisting] = useState(false);
  const [completionFailed, setCompletionFailed] = useState(false);
  const [pageGeometry, setPageGeometry] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const enterMs = reducedMotion ? 60 : 900;
  const turnMs = reducedMotion ? 120 : 680;
  const stampMs = reducedMotion ? 320 : 1500;
  const revisitMode = completed.size === station3Records.length;

  useEffect(() => {
    if (completionFailed) {
      document
        .querySelector<HTMLButtonElement>(
          '[data-interstation-qr-action="retry-completion"]',
        )
        ?.focus({ preventScroll: true });
    }
  }, [completionFailed]);

  useEffect(() => {
    if (pendingRecordSave) {
      recordRetryButtonRef.current?.focus({ preventScroll: true });
    }
  }, [pendingRecordSave]);

  useLayoutEffect(() => {
    if (phase.kind === "turning") {
      return;
    }
    const viewport = pageViewportRef.current;
    if (!viewport) {
      return;
    }

    const measure = () => {
      const rect = viewport.getBoundingClientRect();
      setPageGeometry((current) =>
        current &&
        Math.abs(current.width - rect.width) < 0.01 &&
        Math.abs(current.height - rect.height) < 0.01
          ? current
          : { width: rect.width, height: rect.height },
      );
    };
    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [phase.kind, indexLayout]);

  useEffect(() => {
    if (phase.kind === "entering") {
      const timeout = window.setTimeout(
        () => setPhase({ kind: "index" }),
        enterMs,
      );
      return () => window.clearTimeout(timeout);
    }

    if (phase.kind === "turning") {
      const { record, dir } = phase;
      const timeout = window.setTimeout(() => {
        if (dir === "open") {
          if (record === "planta") {
            const plantPhase: PlantPagePhase = completed.has("planta")
              ? "revisit"
              : "entering";
            setPhase({ kind: "page", record, plantPhase });
          } else if (record === "prototipo") {
            const prototypePhase: PrototypePagePhase = completed.has(
              "prototipo",
            )
              ? "revisit"
              : "entering";
            setPhase({ kind: "page", record, prototypePhase });
          } else {
            const signalPhase: SignalPagePhase = completed.has("senal")
              ? "revisit"
              : "entering";
            setPhase({ kind: "page", record, signalPhase });
          }
          return;
        }
        setPhase({ kind: "index" });
        setHasReturnedToIndex(true);
        if (returnModalityRef.current === "keyboard") {
          setRestoreRecordFocus(record);
        } else {
          setRestoreRecordFocus(null);
          setHighlightedRecord(null);
        }
        if (completed.size === station3Records.length) {
          if (stampStage === "hidden") {
            setStampStage("unlocking");
            setLiaMessage(station3Lia.adjusted);
          } else {
            setLiaMessage(station3Lia.revisit);
          }
        } else {
          setLiaMessage(null);
        }
      }, turnMs);
      return () => window.clearTimeout(timeout);
    }

    if (phase.kind === "page" && phase.record === "planta") {
      if (phase.plantPhase === "entering") {
        const timeout = window.setTimeout(
          () =>
            setPhase({
              kind: "page",
              record: "planta",
              plantPhase: "observing",
            }),
          120,
        );
        return () => window.clearTimeout(timeout);
      }

      if (phase.plantPhase === "observing") {
        return undefined;
      }

      if (phase.plantPhase === "ready" || phase.plantPhase === "revisit") {
        setLiaMessage(null);
        return undefined;
      }

      setLiaMessage(null);
      const confirmationTimeout = window.setTimeout(() => {
        setCompleted((current) => new Set(current).add("planta"));
        setNewlyAvailableRecord("prototipo");
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("planta", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "planta",
          dir: "close",
          plantPhase: "confirmed",
        });
      }, 680);
      return () => window.clearTimeout(confirmationTimeout);
    }

    if (phase.kind === "page" && phase.record === "prototipo") {
      if (phase.prototypePhase === "entering") {
        const timeout = window.setTimeout(
          () =>
            setPhase({
              kind: "page",
              record: "prototipo",
              prototypePhase: "assembly",
            }),
          120,
        );
        return () => window.clearTimeout(timeout);
      }

      setLiaMessage(null);
      if (phase.prototypePhase !== "confirmed") {
        return undefined;
      }

      const confirmationTimeout = window.setTimeout(() => {
        setCompleted((current) => new Set(current).add("prototipo"));
        setNewlyAvailableRecord("senal");
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("prototipo", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "prototipo",
          dir: "close",
          prototypePhase: "confirmed",
        });
      }, 800);
      return () => window.clearTimeout(confirmationTimeout);
    }

    if (phase.kind === "page" && phase.record === "senal") {
      if (phase.signalPhase === "entering") {
        const timeout = window.setTimeout(
          () =>
            setPhase({
              kind: "page",
              record: "senal",
              signalPhase: "capturing",
            }),
          120,
        );
        return () => window.clearTimeout(timeout);
      }

      setLiaMessage(null);
      if (phase.signalPhase !== "confirmed") {
        return undefined;
      }

      const confirmationTimeout = window.setTimeout(() => {
        setCompleted((current) => new Set(current).add("senal"));
        setNewlyAvailableRecord(null);
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("senal", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "senal",
          dir: "close",
          signalPhase: "confirmed",
        });
      }, 800);
      return () => window.clearTimeout(confirmationTimeout);
    }

    return undefined;
  }, [phase, enterMs, turnMs, completed, stampStage, reducedMotion]);

  useLayoutEffect(() => {
    if (phase.kind !== "index" || restoreRecordFocus === null) {
      return;
    }
    recordButtonRefs.current[restoreRecordFocus]?.focus({
      preventScroll: true,
    });
    setHighlightedRecord(restoreRecordFocus);
    setRestoreRecordFocus(null);
  }, [phase, restoreRecordFocus]);

  useEffect(() => {
    if (stampStage !== "unlocking") {
      return;
    }
    const timeout = window.setTimeout(() => setStampStage("ready"), stampMs);
    return () => window.clearTimeout(timeout);
  }, [stampStage, stampMs]);

  const plantVisualPhase: PlantPagePhase | null =
    (phase.kind === "page" || phase.kind === "turning") &&
    phase.record === "planta"
      ? phase.kind === "page"
        ? phase.plantPhase
        : (phase.plantPhase ??
          (phase.dir === "open" ? "entering" : "confirmed"))
      : null;
  const plantRevisit = plantVisualPhase === "revisit";

  const prototypeVisualPhase: PrototypePagePhase | null =
    (phase.kind === "page" || phase.kind === "turning") &&
    phase.record === "prototipo"
      ? phase.kind === "page"
        ? phase.prototypePhase
        : (phase.prototypePhase ??
          (phase.dir === "open" ? "entering" : "confirmed"))
      : null;
  const prototypeRevisit = prototypeVisualPhase === "revisit";
  const prototypeRecord = station3Records[1];
  const prototypeShowRegistered =
    prototypeVisualPhase === "confirmed" || prototypeRevisit;
  const prototypeShowAction =
    prototypeVisualPhase === "ready" || prototypeRevisit;
  const prototypeStaticSummary =
    prototypeVisualPhase === "ready" ||
    prototypeVisualPhase === "confirmed" ||
    prototypeRevisit;
  const prototypeNarrativeStartStage: PrototypeNarrativeStage =
    prototypeVisualPhase === "testing" ||
    prototypeVisualPhase === "learning" ||
    prototypeVisualPhase === "summary"
      ? prototypeVisualPhase
      : prototypeVisualPhase === "ready" ||
          prototypeVisualPhase === "confirmed" ||
          prototypeVisualPhase === "revisit"
        ? "summary"
        : "assembly";

  const signalVisualPhase: SignalPagePhase | null =
    (phase.kind === "page" || phase.kind === "turning") &&
    phase.record === "senal"
      ? phase.kind === "page"
        ? phase.signalPhase
        : (phase.signalPhase ??
          (phase.dir === "open" ? "entering" : "confirmed"))
      : null;
  const signalRevisit = signalVisualPhase === "revisit";
  const signalRecord = station3Records[2];
  const signalShowRegistered =
    signalVisualPhase === "confirmed" || signalRevisit;
  const signalShowAction = signalVisualPhase === "ready" || signalRevisit;
  const signalStaticSummary =
    signalVisualPhase === "ready" ||
    signalVisualPhase === "confirmed" ||
    signalRevisit;
  const signalNarrativeStartStage: SignalNarrativeStage =
    signalVisualPhase === "inspecting" ||
    signalVisualPhase === "evidence" ||
    signalVisualPhase === "summary"
      ? signalVisualPhase
      : signalVisualPhase === "ready" ||
          signalVisualPhase === "confirmed" ||
          signalVisualPhase === "revisit"
        ? "summary"
        : "capturing";

  function recordVisualState(record: Station3RecordContent): RecordVisualState {
    if (completed.has(record.id)) {
      return "completed";
    }
    if (revisitMode || record.order === completed.size + 1) {
      return "available";
    }
    return "locked";
  }

  const station3State = useMemo(() => {
    if (exiting) {
      return "station3_exiting";
    }
    if (phase.kind === "entering") {
      return "station3_entering";
    }
    if (phase.kind === "turning") {
      return phase.dir === "open"
        ? `station3_turning_to_${ticketStateName[phase.record]}`
        : `station3_returning_from_${ticketStateName[phase.record]}`;
    }
    if (phase.kind === "page") {
      return `station3_${ticketStateName[phase.record]}_page`;
    }
    if (stampStage === "unlocking") {
      return "station3_adjusted_unlocked";
    }
    if (stampStage === "ready") {
      return "station3_ready_to_continue";
    }
    if (completed.has("prototipo")) {
      return "station3_signal_unlocked";
    }
    if (completed.has("planta")) {
      return "station3_prototype_unlocked";
    }
    return "station3_index";
  }, [exiting, phase, stampStage, completed]);

  const liaPose: World3LiaPose = useMemo(() => {
    if (exiting) {
      return "closure";
    }
    if (phase.kind === "turning" && phase.dir === "close") {
      return "confirming";
    }
    if (
      phase.kind === "page" &&
      phase.record === "planta" &&
      phase.plantPhase === "confirmed"
    ) {
      return "confirming";
    }
    if (phase.kind === "page" && phase.record === "prototipo") {
      if (phase.prototypePhase === "confirmed") {
        return "confirming";
      }
      if (
        phase.prototypePhase === "assembly" ||
        phase.prototypePhase === "entering"
      ) {
        return "pointing";
      }
      return "observing";
    }
    if (phase.kind === "page" && phase.record === "senal") {
      if (phase.signalPhase === "confirmed") {
        return "confirming";
      }
      if (phase.signalPhase === "inspecting") {
        return "pointing";
      }
      return "observing";
    }
    if (phase.kind === "page" || phase.kind === "turning") {
      return phase.record === "prototipo" ? "pointing" : "observing";
    }
    if (stampStage === "unlocking") {
      return "confirming";
    }
    if (stampStage === "ready") {
      return "closure";
    }
    if (
      phase.kind === "index" &&
      (liaMessage === station3Lia.locked ||
        liaMessage === station3Lia.lockedAlt)
    ) {
      return "pointing";
    }
    return "idle";
  }, [exiting, phase, stampStage, liaMessage]);

  function freezePageGeometry() {
    const rect = pageViewportRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    setPageGeometry({ width: rect.width, height: rect.height });
  }

  function openRecord(record: Station3RecordContent) {
    if (phase.kind !== "index" || exiting || checkpointRecovery) {
      return;
    }
    const state = recordVisualState(record);
    if (state === "locked") {
      setLiaMessage(
        lockedNudgeAlt ? station3Lia.lockedAlt : station3Lia.locked,
      );
      setLockedNudgeAlt((value) => !value);
      return;
    }
    setReturnModality(returnModalityRef.current);
    setHighlightedRecord(null);
    if (record.id === "planta") {
      setPlantAnnotationStage(completed.has("planta") ? "summary" : "step-1");
    }
    if (record.id === "prototipo") {
      setPrototypeAnnotationStage(
        completed.has("prototipo") ? "summary" : "assembly",
      );
    }
    if (record.id === "senal") {
      setSignalAnnotationStage(
        completed.has("senal") ? "summary" : "capturing",
      );
    }
    setLiaMessage(null);
    freezePageGeometry();
    beginPageTurnTrace(record.id, "open", turnMs);
    setPhase({
      kind: "turning",
      record: record.id,
      dir: "open",
      plantPhase: record.id === "planta" ? "entering" : undefined,
      prototypePhase: record.id === "prototipo" ? "entering" : undefined,
      signalPhase: record.id === "senal" ? "entering" : undefined,
    });
  }

  function applyRecoveredState(recordIds: readonly Station3RecordId[]) {
    setCompleted(new Set(recordIds));
    setStampStage(
      recordIds.length === WORLD3_RECORD_ORDER.length ? "ready" : "hidden",
    );
    setCheckpointRecovery(null);
    setCheckpointRecoveryConfirming(false);
    setPendingRecordSave(null);
    setNewlyAvailableRecord(null);
    setLiaMessage(
      recordIds.length === WORLD3_RECORD_ORDER.length
        ? station3Lia.revisit
        : station3Lia.intro,
    );
  }

  function retryCheckpointRecovery() {
    const progress = readProgress();
    if (progress.progress?.completedStations.includes(3)) {
      applyRecoveredState(WORLD3_RECORD_ORDER);
      return;
    }

    const checkpoint = readWorld3Checkpoint();
    if (checkpoint.status === "ok") {
      applyRecoveredState(checkpoint.checkpoint.completedRecordIds);
      return;
    }
    if (checkpoint.status === "empty") {
      applyRecoveredState([]);
      return;
    }

    setCheckpointRecovery(checkpoint.status);
    setCheckpointRecoveryConfirming(false);
  }

  function discardInvalidCheckpoint() {
    const result = removeWorld3Checkpoint();
    if (!result.ok) {
      setCheckpointRecovery("storage_unavailable");
      setCheckpointRecoveryConfirming(false);
      return;
    }
    applyRecoveredState([]);
  }

  function persistRecord(
    recordId: Station3RecordId,
    completedRecordIds: readonly Station3RecordId[],
  ) {
    if (recordSaveLockRef.current) {
      return;
    }

    recordSaveLockRef.current = true;
    setRecordSavePersisting(true);
    const result = writeWorld3Checkpoint({ completedRecordIds });
    recordSaveLockRef.current = false;
    setRecordSavePersisting(false);

    if (!result.ok) {
      setPendingRecordSave({ completedRecordIds, recordId });
      setLiaMessage(PROGRESS_SAVE_ERROR_COPY);
      return;
    }

    setPendingRecordSave(null);
    setPhase((current) => {
      if (current.kind !== "page") {
        return current;
      }
      if (
        recordId === "planta" &&
        current.record === "planta" &&
        current.plantPhase === "ready"
      ) {
        return { kind: "page", record: "planta", plantPhase: "confirmed" };
      }
      if (
        recordId === "prototipo" &&
        current.record === "prototipo" &&
        current.prototypePhase === "ready"
      ) {
        return {
          kind: "page",
          record: "prototipo",
          prototypePhase: "confirmed",
        };
      }
      if (
        recordId === "senal" &&
        current.record === "senal" &&
        current.signalPhase === "ready"
      ) {
        return { kind: "page", record: "senal", signalPhase: "confirmed" };
      }
      return current;
    });
  }

  function retryPendingRecordSave() {
    if (!pendingRecordSave) {
      return;
    }
    persistRecord(
      pendingRecordSave.recordId,
      pendingRecordSave.completedRecordIds,
    );
  }

  function closeRecord(record: Station3RecordContent) {
    if (phase.kind !== "page" || checkpointRecovery || recordSavePersisting) {
      return;
    }
    if (record.id === "planta" && phase.record === "planta") {
      if (phase.plantPhase === "ready") {
        persistRecord("planta", ["planta"]);
        return;
      }
      if (phase.plantPhase === "revisit") {
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("planta", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "planta",
          dir: "close",
          plantPhase: "revisit",
        });
      }
      return;
    }
    if (record.id === "prototipo" && phase.record === "prototipo") {
      if (phase.prototypePhase === "ready") {
        persistRecord("prototipo", ["planta", "prototipo"]);
        return;
      }
      if (phase.prototypePhase === "revisit") {
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("prototipo", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "prototipo",
          dir: "close",
          prototypePhase: "revisit",
        });
      }
      return;
    }
    if (record.id === "senal" && phase.record === "senal") {
      if (phase.signalPhase === "ready") {
        persistRecord("senal", ["planta", "prototipo", "senal"]);
        return;
      }
      if (phase.signalPhase === "revisit") {
        resetWorld3NotebookScroll();
        freezePageGeometry();
        beginPageTurnTrace("senal", "close", turnMs);
        setPhase({
          kind: "turning",
          record: "senal",
          dir: "close",
          signalPhase: "revisit",
        });
      }
      return;
    }
    resetWorld3NotebookScroll();
    freezePageGeometry();
    beginPageTurnTrace(record.id, "close", turnMs);
    setPhase({ kind: "turning", record: record.id, dir: "close" });
  }

  function markPrototypeReturnModality(modality: ReturnModality) {
    returnModalityRef.current = modality;
    setReturnModality(modality);
    if (modality === "pointer") {
      setHighlightedRecord(null);
    }
  }

  function handlePrototypeReturnKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      markPrototypeReturnModality("keyboard");
    }
  }

  function markSignalReturnModality(modality: ReturnModality) {
    returnModalityRef.current = modality;
    setReturnModality(modality);
    if (modality === "pointer") {
      setHighlightedRecord(null);
    }
  }

  function handleSignalReturnKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      markSignalReturnModality("keyboard");
    }
  }

  function completePlantNarrative() {
    setPhase((current) =>
      current.kind === "page" &&
      current.record === "planta" &&
      current.plantPhase === "observing"
        ? { kind: "page", record: "planta", plantPhase: "ready" }
        : current,
    );
  }

  function handlePrototypeStageChange(stage: PrototypeNarrativeStage) {
    setPrototypeAnnotationStage(stage);
    setPhase((current) => {
      if (
        current.kind !== "page" ||
        current.record !== "prototipo" ||
        current.prototypePhase === "ready" ||
        current.prototypePhase === "confirmed" ||
        current.prototypePhase === "revisit"
      ) {
        return current;
      }
      return {
        kind: "page",
        record: "prototipo",
        prototypePhase: stage,
      };
    });
  }

  function completePrototypeNarrative() {
    setPhase((current) =>
      current.kind === "page" &&
      current.record === "prototipo" &&
      current.prototypePhase === "summary"
        ? { kind: "page", record: "prototipo", prototypePhase: "ready" }
        : current,
    );
  }

  function handleSignalStageChange(stage: SignalNarrativeStage) {
    setSignalAnnotationStage(stage);
    setPhase((current) => {
      if (
        current.kind !== "page" ||
        current.record !== "senal" ||
        current.signalPhase === "ready" ||
        current.signalPhase === "confirmed" ||
        current.signalPhase === "revisit"
      ) {
        return current;
      }
      return {
        kind: "page",
        record: "senal",
        signalPhase: stage,
      };
    });
  }

  function completeSignalNarrative() {
    setPhase((current) =>
      current.kind === "page" &&
      current.record === "senal" &&
      current.signalPhase === "summary"
        ? { kind: "page", record: "senal", signalPhase: "ready" }
        : current,
    );
  }

  function persistCompletionAfterQr() {
    if (exiting || completionLockRef.current) {
      return false;
    }
    if (stampStage !== "ready") {
      setLiaMessage(station3Lia.continueLocked);
      return false;
    }

    completionLockRef.current = true;
    setCompletionPersisting(true);
    setCompletionFailed(false);
    const result = markStationCompleted(3);
    if (!result.ok) {
      completionLockRef.current = false;
      setCompletionPersisting(false);
      setCompletionFailed(true);
      setLiaMessage(PROGRESS_SAVE_ERROR_COPY);
      return false;
    }

    setCompletionPersisting(false);
    return true;
  }

  function startTransitionAfterQr() {
    setExiting(true);
    window.setTimeout(
      () => navigate(worldThreeToWorldFourTransitionRoute),
      reducedMotion ? 0 : 280,
    );
  }

  const turning = phase.kind === "turning";
  const activeRecord: Station3RecordId | null =
    phase.kind === "page" || phase.kind === "turning" ? phase.record : null;
  const indexIsInteractive =
    phase.kind === "index" && !exiting && checkpointRecovery === null;
  const indexIsVisible =
    phase.kind === "entering" ||
    phase.kind === "index" ||
    (phase.kind === "turning" && phase.dir === "close");
  const detailIsInteractive = phase.kind === "page";
  const detailIsVisible =
    activeRecord !== null &&
    !(phase.kind === "turning" && phase.dir === "close");
  const indexGuideTarget = indexIsInteractive
    ? (station3Records.find(
        (record) =>
          !completed.has(record.id) &&
          recordVisualState(record) === "available",
      ) ?? null)
    : null;

  function renderIndexPage(decorative = false) {
    const indexEntry =
      hasReturnedToIndex || (phase.kind === "turning" && phase.dir === "close")
        ? "return-stable"
        : "initial";

    return (
      <div
        className={`s3-index${decorative ? " s3-index--decorative" : ""}`}
        data-station3-page={decorative ? undefined : "index"}
        data-station3-index-entry={decorative ? undefined : indexEntry}
      >
        <div className="s3-index__margin" aria-hidden="true" />
        <World3IndexNotebookMarks completedCount={completed.size} />
        <ul className="s3-index__records">
          {station3Records.map((record) => {
            const state = recordVisualState(record);
            return (
              <li className="s3-index__row" key={record.id}>
                <button
                  className={`s3-record s3-record--${state}${
                    newlyAvailableRecord === record.id
                      ? " s3-record--newly-available"
                      : ""
                  }`}
                  ref={
                    decorative
                      ? undefined
                      : (element) => {
                          recordButtonRefs.current[record.id] = element;
                        }
                  }
                  type="button"
                  aria-label={`${record.accessibleLabel} ${recordStateLabel[state]}.`}
                  aria-hidden={decorative || undefined}
                  disabled={!decorative && checkpointRecovery !== null}
                  tabIndex={decorative ? -1 : undefined}
                  data-station3-record={record.id}
                  data-record-state={state}
                  data-soft-locked={state === "locked"}
                  data-station3-record-highlight={
                    highlightedRecord === record.id ? "keyboard-focus" : "none"
                  }
                  data-record-newly-available={
                    newlyAvailableRecord === record.id
                  }
                  onPointerDown={
                    decorative
                      ? undefined
                      : () => {
                          returnModalityRef.current = "pointer";
                          setReturnModality("pointer");
                          setHighlightedRecord(null);
                        }
                  }
                  onKeyDown={
                    decorative
                      ? undefined
                      : (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            returnModalityRef.current = "keyboard";
                            setReturnModality("keyboard");
                          }
                        }
                  }
                  onClick={decorative ? undefined : () => openRecord(record)}
                  onAnimationEnd={
                    decorative
                      ? undefined
                      : (event) => {
                          if (
                            event.animationName ===
                              "s3-record-available-once" &&
                            newlyAvailableRecord === record.id
                          ) {
                            setNewlyAvailableRecord(null);
                          }
                        }
                  }
                >
                  <span className="s3-record__marker" aria-hidden="true" />
                  {!decorative && indexGuideTarget?.id === record.id ? (
                    <span
                      className="s3-record__guide-anchor"
                      ref={indexGuideAnchorRef}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="s3-record__art" aria-hidden="true">
                    <img
                      alt=""
                      className={`s3-record__asset s3-record__asset--${record.id}`}
                      decoding="async"
                      draggable="false"
                      loading="eager"
                      src={recordIndexAssets[record.id]}
                    />
                  </span>
                  <span className="s3-record__label" aria-hidden="true">
                    <span className="s3-record__title">{record.label}</span>
                    <span className="s3-record__trace" />
                    <span className="s3-record__glyphs">
                      {record.indexCopy}
                    </span>
                    <span className="s3-record__state">
                      {recordStateVisualLabel[state]}
                    </span>
                  </span>
                  <span className="s3-record__check" aria-hidden="true">
                    <PixelCheck
                      className="s3-check"
                      checked={completed.has(record.id)}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {!decorative && indexGuideTarget ? (
          <GestureHint
            active={indexIsInteractive}
            anchorRef={indexGuideAnchorRef}
            className={`s3-index__gesture s3-index__gesture--${
              reducedMotion ? "reduced" : "normal"
            }`}
            delayMs={1800}
            direction="right"
            targetLabel={`Abrir registro ${indexGuideTarget.label}`}
            variant="tap"
          />
        ) : null}
        {stampStage !== "hidden" ? (
          <div
            className="s3-stamp"
            data-stamp-stage={stampStage}
            role="img"
            aria-label={station3Stamp.accessibleLabel}
          >
            <span className="s3-stamp__text" aria-hidden="true">
              {station3Stamp.label}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  function renderDetailPage(recordId: Station3RecordId) {
    const record = station3Records.find((entry) => entry.id === recordId);
    if (!record) {
      return null;
    }
    const isPageActive = phase.kind === "page" && phase.record === recordId;

    if (record.id === "planta" && record.plantPage && plantVisualPhase) {
      const showNarrative = plantVisualPhase !== "entering";
      const showRegistered =
        plantVisualPhase === "confirmed" || plantVisualPhase === "revisit";
      const summaryComposition =
        plantAnnotationStage === "summary" ||
        plantVisualPhase === "ready" ||
        showRegistered;
      const pulsesVisible = plantVisualPhase === "observing" && !reducedMotion;

      return (
        <div
          className="s3-detail s3-detail--planta s3-plant-page"
          data-station3-page="planta"
          data-station3-plant-phase={plantVisualPhase}
          data-station3-plant-revisit={plantRevisit}
          data-station3-plant-composition={
            summaryComposition ? "summary-first" : "sequence"
          }
          data-station3-editorial-source={record.plantPage.editorialSource}
          aria-label="Registro 1 de 3. Planta"
        >
          <div className="s3-index__margin" aria-hidden="true" />
          <header className="s3-plant__header">
            <span className="s3-plant__registro">Registro 1 de 3</span>
            <h2 className="s3-plant__title">{record.pageTitle}</h2>
          </header>
          {showNarrative ? (
            <PlantNarrativeSequence
              active={isPageActive}
              steps={record.plantPage.narrativeSteps}
              reducedMotion={reducedMotion}
              revisit={plantVisualPhase === "revisit"}
              onComplete={completePlantNarrative}
              onStageChange={setPlantAnnotationStage}
            />
          ) : (
            <div
              className="s3-plant-narrative s3-plant-narrative--pending"
              data-station3-plant-zone="plant-narrative-summary"
              aria-hidden="true"
            />
          )}
          <div
            className="s3-plant__scene"
            data-station3-plant-ground="absent"
            data-station3-plant-zone="plant-visual"
          >
            {showNarrative ? (
              <PlantNotebookAnnotations
                stage={plantAnnotationStage}
                reducedMotion={reducedMotion}
              />
            ) : null}
            <div
              className="s3-plant__visual"
              data-station3-plant-visual="shifted-wrapper"
            >
              <img
                alt=""
                aria-hidden="true"
                className="s3-plant__asset"
                decoding="async"
                draggable="false"
                loading="eager"
                src={recordIndexAssets.planta}
              />
              <div
                className="s3-plant__pulses"
                data-station3-plant-pulses={pulsesVisible ? "active" : "rest"}
                data-station3-plant-pulse-origin="pot-base"
                aria-hidden="true"
              >
                {pulsesVisible ? (
                  <>
                    <span className="s3-plant__pulse s3-plant__pulse--one" />
                    <span className="s3-plant__pulse s3-plant__pulse--two" />
                    <span className="s3-plant__pulse s3-plant__pulse--three" />
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div
            className="s3-plant__registered"
            data-plant-registered={showRegistered}
            data-station3-plant-zone="plant-confirmation"
            role={showRegistered ? "status" : undefined}
          >
            {showRegistered ? (
              <>
                <PixelCheck className="s3-plant__registered-check" checked />
                <span>{record.plantPage.registeredLabel}</span>
              </>
            ) : null}
          </div>
        </div>
      );
    }

    if (
      record.id === "prototipo" &&
      record.prototypePage &&
      prototypeVisualPhase
    ) {
      const showNarrative = prototypeVisualPhase !== "entering";
      const summaryComposition =
        prototypeVisualPhase === "summary" ||
        prototypeVisualPhase === "ready" ||
        prototypeShowRegistered;
      const visualStage: PrototypeNarrativeStage = summaryComposition
        ? "summary"
        : prototypeAnnotationStage;
      const stepMarker =
        prototypeVisualPhase === "entering"
          ? "0"
          : prototypeVisualPhase === "assembly"
            ? "1"
            : prototypeVisualPhase === "testing"
              ? "2"
              : prototypeVisualPhase === "learning"
                ? "3"
                : "summary";
      const narrativeInNotebook = indexLayout !== "tablet-landscape";

      return (
        <div
          className="s3-detail s3-detail--prototipo s3-prototype-page"
          data-station3-page="prototipo"
          data-station3-prototype-phase={prototypeVisualPhase}
          data-station3-prototype-step={stepMarker}
          data-station3-prototype-revisit={prototypeRevisit}
          data-station3-prototype-composition={
            summaryComposition ? "summary" : "sequence"
          }
          data-station3-editorial-source={record.prototypePage.editorialSource}
          aria-label="Registro 2 de 3. Prototipo"
        >
          <div className="s3-index__margin" aria-hidden="true" />
          <header
            className="s3-prototype__header"
            data-station3-prototype-zone="prototype-header"
          >
            <span className="s3-prototype__registro">Registro 2 de 3</span>
            <h2 className="s3-prototype__title">{record.pageTitle}</h2>
          </header>

          <div
            className="s3-prototype__workbench"
            data-station3-prototype-zone="prototype-workbench"
          >
            <div className="s3-prototype__visual">
              <img
                alt=""
                aria-hidden="true"
                className="s3-prototype__asset"
                decoding="async"
                draggable="false"
                loading="eager"
                src={recordIndexAssets.prototipo}
              />
              <PrototypeNotebookAnnotations
                stage={visualStage}
                reducedMotion={reducedMotion}
              />
              <PrototypeTestRoute
                stage={prototypeVisualPhase}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          {narrativeInNotebook && showNarrative ? (
            <PrototypeNarrativeSequence
              active={isPageActive}
              steps={record.prototypePage.narrativeSteps}
              reducedMotion={reducedMotion}
              revisit={prototypeStaticSummary}
              startStage={prototypeNarrativeStartStage}
              onComplete={completePrototypeNarrative}
              onStageChange={handlePrototypeStageChange}
            />
          ) : narrativeInNotebook ? (
            <div
              className="s3-prototype-narrative s3-prototype-narrative--pending"
              data-station3-prototype-zone="prototype-build-log"
              aria-hidden="true"
            />
          ) : null}

          {narrativeInNotebook ? (
            <>
              <div
                className="s3-prototype__registered"
                data-station3-prototype-registered={prototypeShowRegistered}
                data-station3-prototype-zone="prototype-confirmation"
                role={prototypeShowRegistered ? "status" : undefined}
              >
                {prototypeShowRegistered ? (
                  <>
                    <PixelCheck
                      className="s3-prototype__registered-check"
                      checked
                    />
                    <span>{record.prototypePage.registeredLabel}</span>
                  </>
                ) : null}
              </div>

              <div
                className="s3-prototype__actions"
                data-station3-prototype-zone="prototype-action"
              >
                {prototypeShowAction ? (
                  <button
                    ref={
                      pendingRecordSave?.recordId === "prototipo"
                        ? recordRetryButtonRef
                        : undefined
                    }
                    className="s3-detail__confirm s3-prototype__action"
                    type="button"
                    aria-busy={recordSavePersisting ? "true" : undefined}
                    data-station3-action={
                      pendingRecordSave?.recordId === "prototipo"
                        ? "retry-record-save"
                        : "close-record"
                    }
                    data-station3-record-confirm="prototipo"
                    disabled={recordSavePersisting}
                    onPointerDown={() => markPrototypeReturnModality("pointer")}
                    onKeyDown={handlePrototypeReturnKeyDown}
                    onClick={
                      pendingRecordSave?.recordId === "prototipo"
                        ? retryPendingRecordSave
                        : () => closeRecord(record)
                    }
                  >
                    {pendingRecordSave?.recordId === "prototipo"
                      ? PROGRESS_SAVE_RETRY_LABEL
                      : prototypeRevisit
                        ? record.prototypePage.revisitLabel
                        : record.confirmLabel}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      );
    }

    if (record.id === "senal" && record.signalPage && signalVisualPhase) {
      const showNarrative = signalVisualPhase !== "entering";
      const summaryComposition =
        signalVisualPhase === "summary" ||
        signalVisualPhase === "ready" ||
        signalShowRegistered;
      const visualStage: SignalNarrativeStage = summaryComposition
        ? "summary"
        : signalAnnotationStage;
      const stepMarker =
        signalVisualPhase === "entering"
          ? "0"
          : signalVisualPhase === "capturing"
            ? "1"
            : signalVisualPhase === "inspecting"
              ? "2"
              : signalVisualPhase === "evidence"
                ? "3"
                : "summary";
      const narrativeInNotebook = indexLayout !== "tablet-landscape";

      return (
        <div
          className="s3-detail s3-detail--senal s3-signal-page"
          data-station3-page="senal"
          data-station3-signal-phase={signalVisualPhase}
          data-station3-signal-step={stepMarker}
          data-station3-signal-revisit={signalRevisit}
          data-station3-signal-composition={
            summaryComposition ? "summary" : "sequence"
          }
          data-station3-editorial-source={record.signalPage.editorialSource}
          aria-label="Registro 3 de 3. Señal"
        >
          <div className="s3-index__margin" aria-hidden="true" />
          <header
            className="s3-signal__header"
            data-station3-signal-zone="signal-header"
          >
            <span className="s3-signal__registro">Registro 3 de 3</span>
            <h2 className="s3-signal__title">{record.pageTitle}</h2>
          </header>

          <div
            className="s3-signal__analysis"
            data-station3-signal-zone="signal-analysis-stage"
          >
            {indexLayout !== "tablet-landscape" ? (
              <World3LiaActor pose={liaPose} reducedMotion={reducedMotion} />
            ) : null}
            <div className="s3-signal__visual">
              <SignalTraceDisplay
                stage={signalVisualPhase}
                reducedMotion={reducedMotion}
              />
              <SignalNotebookAnnotations
                stage={visualStage}
                reducedMotion={reducedMotion}
              />
            </div>
          </div>

          {narrativeInNotebook && showNarrative ? (
            <SignalNarrativeSequence
              active={isPageActive}
              steps={record.signalPage.narrativeSteps}
              reducedMotion={reducedMotion}
              revisit={signalStaticSummary}
              startStage={signalNarrativeStartStage}
              onComplete={completeSignalNarrative}
              onStageChange={handleSignalStageChange}
            />
          ) : narrativeInNotebook ? (
            <div
              className="s3-signal-narrative s3-signal-narrative--pending"
              data-station3-signal-zone="signal-observation-log"
              aria-hidden="true"
            />
          ) : null}

          {narrativeInNotebook ? (
            <>
              <div
                className="s3-signal__registered"
                data-station3-signal-registered={signalShowRegistered}
                data-station3-signal-zone="signal-confirmation"
                role={signalShowRegistered ? "status" : undefined}
              >
                {signalShowRegistered ? (
                  <>
                    <PixelCheck
                      className="s3-signal__registered-check"
                      checked
                    />
                    <span>{record.signalPage.registeredLabel}</span>
                  </>
                ) : null}
              </div>

              <div
                className="s3-signal__actions"
                data-station3-signal-zone="signal-action"
              >
                {signalShowAction ? (
                  <button
                    ref={
                      pendingRecordSave?.recordId === "senal"
                        ? recordRetryButtonRef
                        : undefined
                    }
                    className="s3-detail__confirm s3-signal__action"
                    type="button"
                    aria-busy={recordSavePersisting ? "true" : undefined}
                    data-station3-action={
                      pendingRecordSave?.recordId === "senal"
                        ? "retry-record-save"
                        : "close-record"
                    }
                    data-station3-record-confirm="senal"
                    disabled={recordSavePersisting}
                    onPointerDown={() => markSignalReturnModality("pointer")}
                    onKeyDown={handleSignalReturnKeyDown}
                    onClick={
                      pendingRecordSave?.recordId === "senal"
                        ? retryPendingRecordSave
                        : () => closeRecord(record)
                    }
                  >
                    {pendingRecordSave?.recordId === "senal"
                      ? PROGRESS_SAVE_RETRY_LABEL
                      : signalRevisit
                        ? record.signalPage.revisitLabel
                        : record.confirmLabel}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      );
    }

    return null;
  }

  return (
    <main
      className="s3-screen"
      data-station3-state={station3State}
      data-station3-revisit={revisitMode}
      data-station3-completed-count={completed.size}
      data-station3-reduced-motion={reducedMotion}
      data-station3-checkpoint-recovery={checkpointRecovery ?? "none"}
      data-station3-record-save={
        recordSavePersisting
          ? "persisting"
          : pendingRecordSave
            ? `retry-${pendingRecordSave.recordId}`
            : "idle"
      }
      data-world3-index-layout={indexLayout}
      data-station3-return-modality={returnModality}
      data-station3-record-highlight={
        highlightedRecord ? "keyboard-focus" : "none"
      }
      data-sensitive-permissions="camera-on-explicit-gesture"
      data-qr-camera="interstation-gate"
      aria-labelledby="station3-title"
    >
      <div
        className="s3-environment"
        style={{
          backgroundImage: `url(${world3RuntimeAssets.environment.ambientTexture})`,
        }}
        aria-hidden="true"
      />
      <div className="s3-frame" aria-hidden="true">
        <span className="s3-frame__corner s3-frame__corner--tl" />
        <span className="s3-frame__corner s3-frame__corner--tr" />
        <span className="s3-frame__corner s3-frame__corner--bl" />
        <span className="s3-frame__corner s3-frame__corner--br" />
      </div>

      <header className="s3-title">
        <span className="s3-title__leaf" aria-hidden="true" />
        <h1 id="station3-title">
          Mundo III:
          <br />
          Cuaderno Pixel de Pruebas
        </h1>
        <p className="s3-title__station">
          <span aria-hidden="true">···◦ </span>
          ESTACIÓN III
          <span aria-hidden="true"> ◦···</span>
        </p>
      </header>

      <div className="s3-composition">
        {phase.kind === "page" && phase.record === "senal" ? null : (
          <World3LiaActor pose={liaPose} reducedMotion={reducedMotion} />
        )}

        <section className="s3-book-zone" aria-label="Cuaderno de pruebas">
          <div className="s3-notebook">
            <img
              alt=""
              className="s3-notebook__asset"
              decoding="async"
              draggable="false"
              fetchPriority="high"
              src={world3RuntimeAssets.notebook.openBase}
            />
            <div className="s3-spiral" aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => (
                <span className="s3-spiral__ring" key={`ring-${index}`} />
              ))}
            </div>
            <div
              className="s3-book"
              ref={pageViewportRef}
              data-station3-notebook-page-viewport="true"
              data-station3-page-geometry={
                turning || pageGeometry ? "stable" : "resizing"
              }
              data-book-turning={turning ? phase.dir : undefined}
            >
              <div className="s3-page s3-page--base">
                <div
                  className="s3-page-layer s3-page-layer--index"
                  data-station3-index-layer="mounted"
                  data-station3-layer-visible={indexIsVisible}
                  aria-hidden={!indexIsInteractive}
                  inert={!indexIsInteractive}
                >
                  {renderIndexPage()}
                </div>
                {activeRecord ? (
                  <div
                    className="s3-page-layer s3-page-layer--detail"
                    data-station3-detail-layer={activeRecord}
                    data-station3-layer-visible={detailIsVisible}
                    aria-hidden={!detailIsInteractive}
                    inert={!detailIsInteractive}
                  >
                    {renderDetailPage(activeRecord)}
                  </div>
                ) : null}
              </div>
              {turning ? (
                <World3PageTurnLayer
                  asset={world3RuntimeAssets.notebook.turnPage}
                  direction={phase.dir}
                  height={pageGeometry?.height ?? null}
                  reducedMotion={reducedMotion}
                  width={pageGeometry?.width ?? null}
                />
              ) : null}
            </div>
          </div>
        </section>

        <aside className="s3-guide-rail" aria-label="Orientación de Lía">
          <div
            className="s3-lia-note"
            role="status"
            aria-atomic="true"
            data-station3-lia-note={liaMessage ? "visible" : "empty"}
          >
            {liaMessage ? (
              <p className="s3-lia-note__text">{liaMessage}</p>
            ) : null}
          </div>

          {checkpointRecovery ? (
            <div
              className="s3-prototype__actions"
              data-station3-checkpoint-recovery-action={checkpointRecovery}
              role="alert"
            >
              <p>
                {checkpointRecovery === "storage_unavailable"
                  ? "No fue posible acceder al guardado de Mundo III. Reintenta antes de continuar."
                  : "El guardado de Mundo III no puede leerse de forma segura. Puedes conservarlo o descartarlo con confirmación."}
              </p>
              {checkpointRecovery === "storage_unavailable" ? (
                <button
                  className="s3-detail__confirm"
                  type="button"
                  data-station3-action="retry-checkpoint-read"
                  onClick={retryCheckpointRecovery}
                >
                  Reintentar acceso al guardado
                </button>
              ) : checkpointRecoveryConfirming ? (
                <>
                  <button
                    className="s3-detail__confirm"
                    type="button"
                    data-station3-action="confirm-discard-checkpoint"
                    onClick={discardInvalidCheckpoint}
                  >
                    Confirmar descarte
                  </button>
                  <button
                    className="s3-detail__confirm"
                    type="button"
                    data-station3-action="cancel-discard-checkpoint"
                    onClick={() => setCheckpointRecoveryConfirming(false)}
                  >
                    Conservar guardado
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="s3-detail__confirm"
                    type="button"
                    data-station3-action="retry-checkpoint-read"
                    onClick={retryCheckpointRecovery}
                  >
                    Reintentar lectura
                  </button>
                  <button
                    className="s3-detail__confirm"
                    type="button"
                    data-station3-action="request-discard-checkpoint"
                    onClick={() => setCheckpointRecoveryConfirming(true)}
                  >
                    Descartar guardado inválido
                  </button>
                </>
              )}
            </div>
          ) : null}

          {phase.kind === "page" &&
          phase.record === "planta" &&
          (phase.plantPhase === "ready" || phase.plantPhase === "revisit") ? (
            <button
              ref={
                pendingRecordSave?.recordId === "planta"
                  ? recordRetryButtonRef
                  : undefined
              }
              className="s3-detail__confirm s3-plant__action"
              type="button"
              aria-busy={recordSavePersisting ? "true" : undefined}
              data-station3-action={
                pendingRecordSave?.recordId === "planta"
                  ? "retry-record-save"
                  : "close-record"
              }
              data-station3-record-confirm="planta"
              disabled={recordSavePersisting}
              onClick={
                pendingRecordSave?.recordId === "planta"
                  ? retryPendingRecordSave
                  : () => closeRecord(station3Records[0])
              }
            >
              {pendingRecordSave?.recordId === "planta"
                ? PROGRESS_SAVE_RETRY_LABEL
                : phase.plantPhase === "revisit"
                  ? station3Records[0].plantPage?.revisitLabel
                  : station3Records[0].confirmLabel}
            </button>
          ) : null}

          {indexLayout === "tablet-landscape" &&
          phase.kind === "page" &&
          phase.record === "prototipo" &&
          prototypeVisualPhase !== "entering" &&
          prototypeRecord.prototypePage ? (
            <div
              className="s3-prototype-guide"
              data-station3-prototype-guide="build-log-confirmation-action"
            >
              <PrototypeNarrativeSequence
                active
                steps={prototypeRecord.prototypePage.narrativeSteps}
                reducedMotion={reducedMotion}
                revisit={prototypeStaticSummary}
                startStage={prototypeNarrativeStartStage}
                onComplete={completePrototypeNarrative}
                onStageChange={handlePrototypeStageChange}
              />
              <div
                className="s3-prototype__registered"
                data-station3-prototype-registered={prototypeShowRegistered}
                data-station3-prototype-zone="prototype-confirmation"
                role={prototypeShowRegistered ? "status" : undefined}
              >
                {prototypeShowRegistered ? (
                  <>
                    <PixelCheck
                      className="s3-prototype__registered-check"
                      checked
                    />
                    <span>{prototypeRecord.prototypePage.registeredLabel}</span>
                  </>
                ) : null}
              </div>
              <div
                className="s3-prototype__actions"
                data-station3-prototype-zone="prototype-action"
              >
                {prototypeShowAction ? (
                  <button
                    ref={
                      pendingRecordSave?.recordId === "prototipo"
                        ? recordRetryButtonRef
                        : undefined
                    }
                    className="s3-detail__confirm s3-prototype__action"
                    type="button"
                    aria-busy={recordSavePersisting ? "true" : undefined}
                    data-station3-action={
                      pendingRecordSave?.recordId === "prototipo"
                        ? "retry-record-save"
                        : "close-record"
                    }
                    data-station3-record-confirm="prototipo"
                    disabled={recordSavePersisting}
                    onPointerDown={() => markPrototypeReturnModality("pointer")}
                    onKeyDown={handlePrototypeReturnKeyDown}
                    onClick={
                      pendingRecordSave?.recordId === "prototipo"
                        ? retryPendingRecordSave
                        : () => closeRecord(prototypeRecord)
                    }
                  >
                    {pendingRecordSave?.recordId === "prototipo"
                      ? PROGRESS_SAVE_RETRY_LABEL
                      : prototypeRevisit
                        ? prototypeRecord.prototypePage.revisitLabel
                        : prototypeRecord.confirmLabel}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {indexLayout === "tablet-landscape" &&
          phase.kind === "page" &&
          phase.record === "senal" &&
          signalVisualPhase !== "entering" &&
          signalRecord.signalPage ? (
            <div
              className="s3-signal-guide"
              data-station3-signal-guide="actor-observation-confirmation-action"
            >
              <World3LiaActor pose={liaPose} reducedMotion={reducedMotion} />
              <SignalNarrativeSequence
                active
                steps={signalRecord.signalPage.narrativeSteps}
                reducedMotion={reducedMotion}
                revisit={signalStaticSummary}
                startStage={signalNarrativeStartStage}
                onComplete={completeSignalNarrative}
                onStageChange={handleSignalStageChange}
              />
              <div
                className="s3-signal__registered"
                data-station3-signal-registered={signalShowRegistered}
                data-station3-signal-zone="signal-confirmation"
                role={signalShowRegistered ? "status" : undefined}
              >
                {signalShowRegistered ? (
                  <>
                    <PixelCheck
                      className="s3-signal__registered-check"
                      checked
                    />
                    <span>{signalRecord.signalPage.registeredLabel}</span>
                  </>
                ) : null}
              </div>
              <div
                className="s3-signal__actions"
                data-station3-signal-zone="signal-action"
              >
                {signalShowAction ? (
                  <button
                    ref={
                      pendingRecordSave?.recordId === "senal"
                        ? recordRetryButtonRef
                        : undefined
                    }
                    className="s3-detail__confirm s3-signal__action"
                    type="button"
                    aria-busy={recordSavePersisting ? "true" : undefined}
                    data-station3-action={
                      pendingRecordSave?.recordId === "senal"
                        ? "retry-record-save"
                        : "close-record"
                    }
                    data-station3-record-confirm="senal"
                    disabled={recordSavePersisting}
                    onPointerDown={() => markSignalReturnModality("pointer")}
                    onKeyDown={handleSignalReturnKeyDown}
                    onClick={
                      pendingRecordSave?.recordId === "senal"
                        ? retryPendingRecordSave
                        : () => closeRecord(signalRecord)
                    }
                  >
                    {pendingRecordSave?.recordId === "senal"
                      ? PROGRESS_SAVE_RETRY_LABEL
                      : signalRevisit
                        ? signalRecord.signalPage.revisitLabel
                        : signalRecord.confirmLabel}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <footer
            className="s3-footer"
            data-cta-visible={stampStage === "ready"}
          >
            <InterstationQrGate
              originWorld={3}
              ready={stampStage === "ready" && !completionPersisting}
              persistCompletion={persistCompletionAfterQr}
              onCompleted={startTransitionAfterQr}
            />
            <div className="s3-indicator" aria-hidden="true">
              <span className="s3-indicator__dot" />
              <span className="s3-indicator__dot" />
              <span className="s3-indicator__station">III</span>
              <span className="s3-indicator__dot" />
              <span className="s3-indicator__dot" />
            </div>
          </footer>
        </aside>
      </div>
    </main>
  );
}
