import { playJourneySound } from "../../app/audio/journeySound";
import "./World1RootScreen.css";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readLanguagePreference } from "../../app/preferences/languagePreference";

import { InterstationQrGate } from "../../app/qr/InterstationQrGate";
import { worldOneToWorldTwoTransitionRoute } from "../../app/routes";
import { GestureHint } from "../../components/GestureHint/GestureHint";
import { LiaJourneyMotion } from "../../components/LiaJourneyMotion/LiaJourneyMotion";
import {
  WORLD1_REQUIRED_SLOT_COUNT,
  type World1ConceptId,
  getWorld1Editorial,
} from "../../content/world1EditorialSlots";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { canUseUiStep, closeEssentialRoom, confirmEssentialStep, invalidateJourneyEssential, isEssentialExitReady, markEssentialPresented, useEssentialFlow, type EssentialWriteResult } from "../../app/journey/journeyEssential";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";

import { World1RootStageFrame } from "./layout";
import { world1RootAssets } from "./world1RootAssets";

type NodeOrbStyle = CSSProperties & {
  "--world1-node-kit": string;
};

type BackgroundLayerStyle = CSSProperties & {
  "--world1-root-background": string;
};

type EnergySparkStyle = CSSProperties & {
  "--world1-energy-delay": string;
  "--world1-energy-size": string;
  "--world1-energy-x": string;
  "--world1-energy-y": string;
};

const nodeOrbStyle = {
  "--world1-node-kit": `url(${world1RootAssets.nodeKit})`,
} as NodeOrbStyle;

const backgroundLayerStyle = {
  "--world1-root-background": `url(${world1RootAssets.background})`,
} as BackgroundLayerStyle;

type World1Concept = World1ConceptId;
type World1NodeState = "locked" | "available" | "active" | "completed";
type CompletionPhase = "idle" | "persisting" | "error" | "complete";
type CheckpointRecoveryStatus =
  | "corrupt"
  | "unknown_version"
  | "storage_unavailable"
  | null;



type World1Node = {
  id: "relation" | "perception" | "mediation";
  label: string;
  accessibleName: string;
  lockedName?: string;
};

const conceptNodes: ReadonlyArray<World1Node> = [
  {
    id: "relation",
    label: "RELACIÓN",
    accessibleName: "Explorar RELACIÓN",
  },
  {
    id: "perception",
    label: "PERCEPCIÓN",
    accessibleName: "Explorar PERCEPCIÓN",
    lockedName: "PERCEPCIÓN bloqueada en esta fase",
  },
  {
    id: "mediation",
    label: "MEDIACIÓN",
    accessibleName: "Explorar MEDIACIÓN",
    lockedName: "MEDIACIÓN bloqueada en esta fase",
  },
];

const nodeParticleSlots = [1, 2, 3] as const;

const energySparkSlots = [
  { delay: "0ms", id: 1, size: "3px", x: "22%", y: "57%" },
  { delay: "360ms", id: 2, size: "2px", x: "34%", y: "63%" },
  { delay: "720ms", id: 3, size: "3px", x: "46%", y: "68%" },
  { delay: "1080ms", id: 4, size: "2px", x: "58%", y: "67%" },
  { delay: "1440ms", id: 5, size: "3px", x: "70%", y: "63%" },
  { delay: "1800ms", id: 6, size: "2px", x: "82%", y: "57%" },
] as const;

const conceptMotionOffset: Record<World1Concept, number> = {
  intro: 0,
  relation: 0.9,
  perception: 1.8,
  mediation: 2.7,
  ready_to_continue: 3.6,
};

const world1SwipeHintMaxWidth = 480;
const world1SwipeHintMaxHeight = 844;

function setStillMotionVariables(root: HTMLElement) {
  root.style.setProperty("--world1-js-energy-opacity", "0.48");
  root.style.setProperty("--world1-js-glow-opacity", "0.62");
  root.style.setProperty("--world1-js-leaf-light-opacity", "0.36");
  root.style.setProperty("--world1-js-lia-attention-scale", "1");
  root.style.setProperty("--world1-js-lia-expression-opacity", "0.62");
  root.style.setProperty("--world1-js-lia-expression-shift", "0px");
  root.style.setProperty("--world1-js-lia-halo-scale", "1");
  root.style.setProperty("--world1-js-lia-scale", "1");
  root.style.setProperty("--world1-js-lia-y", "0px");
  root.style.setProperty("--world1-js-node-drift-x", "0px");
  root.style.setProperty("--world1-js-node-drift-y", "0px");
  root.style.setProperty("--world1-js-plant-aura-scale", "1");
}

function useWorld1MotionRoot(
  activeConcept: World1Concept,
  active: boolean,
): RefObject<HTMLElement | null> {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || !active || typeof window === "undefined") {
      return undefined;
    }

    const reducedMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    let animationFrameId = 0;
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;
    const motionOffset = conceptMotionOffset[activeConcept];

    const cancelPendingFrame = () => {
      if (
        animationFrameId &&
        typeof window.cancelAnimationFrame === "function"
      ) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };

    const scheduleFrame = (callback: FrameRequestCallback) => {
      if (typeof window.requestAnimationFrame === "function") {
        animationFrameId = window.requestAnimationFrame(callback);
        return;
      }

      timeoutId = window.setTimeout(() => {
        callback(window.performance.now());
      }, 34);
    };

    const updateMotionVariables = (time: number) => {
      if (reducedMotion?.matches) {
        setStillMotionVariables(root);
        return;
      }

      const seconds = time / 1000 + motionOffset;
      const slowPulse = 0.5 + Math.sin(seconds * 1.18) * 0.5;
      const guidePulse = activeConcept === "intro"
        ? 0.5 + Math.sin(seconds * 2.15) * 0.5
        : slowPulse;
      const quickPulse = 0.5 + Math.sin(seconds * 2.4 + 0.7) * 0.5;
      const attentionPulse = 0.5 + Math.sin(seconds * 1.64 + 0.35) * 0.5;
      const leafPulse = 0.5 + Math.sin(seconds * 1.36 + 1.2) * 0.5;

      root.style.setProperty(
        "--world1-js-energy-opacity",
        (0.22 + quickPulse * 0.2).toFixed(3),
      );
      root.style.setProperty(
        "--world1-js-glow-opacity",
        (0.5 + slowPulse * 0.34).toFixed(3),
      );
      root.style.setProperty(
        "--world1-js-leaf-light-opacity",
        (0.26 + leafPulse * 0.3).toFixed(3),
      );
      root.style.setProperty(
        "--world1-js-lia-attention-scale",
        (0.98 + attentionPulse * 0.055).toFixed(4),
      );
      root.style.setProperty(
        "--world1-js-lia-expression-opacity",
        (0.38 + attentionPulse * 0.44).toFixed(3),
      );
      root.style.setProperty(
        "--world1-js-lia-expression-shift",
        `${(Math.sin(seconds * 1.18 + 0.4) * 1.2).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--world1-js-lia-halo-scale",
        (1.01 + slowPulse * 0.055).toFixed(4),
      );
      root.style.setProperty(
        "--world1-js-lia-scale",
        (1 + guidePulse * 0.008).toFixed(4),
      );
      root.style.setProperty(
        "--world1-js-lia-y",
        `${(-1.4 - guidePulse * (activeConcept === "intro" ? 4.2 : 1.2)).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--world1-js-node-drift-x",
        `${Math.sin(seconds * 0.82) * 1.8}px`,
      );
      root.style.setProperty(
        "--world1-js-node-drift-y",
        `${Math.cos(seconds * 0.76) * 1.2}px`,
      );
      root.style.setProperty(
        "--world1-js-plant-aura-scale",
        (1.02 + slowPulse * 0.09).toFixed(4),
      );

      scheduleFrame(updateMotionVariables);
    };

    setStillMotionVariables(root);
    scheduleFrame(updateMotionVariables);

    return cancelPendingFrame;
  }, [activeConcept, active]);

  return rootRef;
}

export function World1RootScreen() {
  const locale = readLanguagePreference() ?? "es";
  const { conceptCopy: world1ConceptCopy, slots: world1EditorialSlots, details: world1OptionalDetails, ui } = getWorld1Editorial(locale);
  const navigate = useNavigate();
  const flow = useEssentialFlow(1);
  const activity = useJourneyActivity();
  // This render's token is captured by every action/timeout; the ref is only a
  // cancellation fence, never a source of a newer token for an old callback.
  const attemptId = activity.attemptId;
  const attemptRef = useRef(attemptId);
  attemptRef.current = attemptId;
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const activeRef = useRef(activity.active);
  activeRef.current = activity.active;
  const stepByConcept = { intro: "intro", relation: "relacion", perception: "percepcion", mediation: "mediacion", ready_to_continue: "mediacion" } as const;
  const conceptByStep: Record<string, World1Concept> = { intro: "intro", relacion: "relation", percepcion: "perception", mediacion: "mediation" };
  const [selection, setSelection] = useState<World1Concept | null>(null);
  const activeConcept = selection ?? (flow.closed ? "ready_to_continue" : conceptByStep[flow.activeStepId ?? "intro"] ?? "intro");
  const highestReachedConcept: World1Concept = flow.closed ? "ready_to_continue" : conceptByStep[flow.confirmedStepIds.at(-1) ?? "intro"] ?? "intro";
  const visitedConcepts = flow.presentedStepIds.map((id) => conceptByStep[id]).filter(Boolean);
  const activityContinued = flow.closed;
  const [panelClosed, setPanelClosed] = useState(false);
  const [presentedConcept, setPresentedConcept] = useState<World1Concept | null>(null);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const checkpointRecoveryStatus: CheckpointRecoveryStatus = flow.storageVerified ? null : "storage_unavailable";
  const checkpointResetConfirmation = false;
  const [checkpointSaveFailed, setCheckpointSaveFailed] = useState(false);
  const completionPhase: CompletionPhase = checkpointSaveFailed ? "error" : "idle";
  const [saving, setSaving] = useState(false);
  const [assetRetry, setAssetRetry] = useState(0);
  const savingRef = useRef(false);
  const retryActionRef = useRef<null | (() => Promise<void>)>(null);
  const presentedRequestRef = useRef("");
  const [narrativeNeedsScroll, setNarrativeNeedsScroll] = useState(false);
  const [isSmallMobileHeight, setIsSmallMobileHeight] = useState(false);
  const [dismissedNarrativeHints, setDismissedNarrativeHints] = useState<ReadonlySet<World1Concept>>(() => new Set());
  const narrativeViewportRef = useRef<HTMLDivElement>(null);
  const narrativeTrackRef = useRef<HTMLDivElement>(null);
  const narrativeSwipeAnchorRef = useRef<HTMLSpanElement>(null);
  const motionRootRef = useWorld1MotionRoot(activeConcept, activity.active && visible);
  const initialPreload = useAssetPreloader(screenAssetBundles.world1RootInitial, { timeoutMs: 9000, concurrency: 2, retryKey: assetRetry, reuseVerified: assetRetry === 0 });
  const relationPreload = useAssetPreloader(screenAssetBundles.world1RootRelation, { enabled: activeConcept === "intro" || activeConcept === "relation", concurrency: 2, retryKey: assetRetry, reuseVerified: assetRetry === 0 });
  const perceptionPreload = useAssetPreloader(screenAssetBundles.world1RootPerception, { enabled: activeConcept === "relation" || activeConcept === "perception", concurrency: 2, retryKey: assetRetry, reuseVerified: assetRetry === 0 });
  const mediationPreload = useAssetPreloader(screenAssetBundles.world1RootMediation, { enabled: activeConcept === "perception" || activeConcept === "mediation", concurrency: 2, retryKey: assetRetry, reuseVerified: assetRetry === 0 });
  const readyPreload = useAssetPreloader(screenAssetBundles.world1RootReady, { enabled: activeConcept === "mediation" || activeConcept === "ready_to_continue", concurrency: 2, retryKey: assetRetry });
  const statePreload = { intro: initialPreload, relation: relationPreload, perception: perceptionPreload, mediation: mediationPreload, ready_to_continue: readyPreload }[activeConcept];
  const resourcesReady = initialPreload.status === "ready" && statePreload.status === "ready";
  const nextPreload = { intro: relationPreload, relation: perceptionPreload, perception: mediationPreload, mediation: readyPreload, ready_to_continue: readyPreload }[activeConcept];
  const advanceAssetsReady = resourcesReady && nextPreload.status === "ready";
  const assetFailed = [initialPreload.status, statePreload.status, nextPreload.status].some((status) => status === "error" || status === "timeout");

  async function perform(action: () => Promise<EssentialWriteResult>, next?: () => void) {
    if (attemptRef.current !== attemptId || savingRef.current || !activeRef.current || flow.readOnly) return;
    savingRef.current = true;
    setSaving(true);
    const result = await action();
    if (attemptRef.current !== attemptId) return;
    savingRef.current = false;
    setSaving(false);
    if (!result.ok) {
      setCheckpointSaveFailed(true);
      retryActionRef.current = () => perform(action, next);
      return;
    }
    setCheckpointSaveFailed(false);
    retryActionRef.current = null;
    if (activeRef.current) next?.();
  }
  function activateConcept(concept: World1Concept) {
    if (attemptRef.current !== attemptId || !activity.active || saving || checkpointSaveFailed || !canUseUiStep(1, stepByConcept[concept])) return;
    playJourneySound("interaction");
    setSelection(concept);
    setPanelClosed(false);
    setExpandedDetails(false);
    if (concept === activeConcept && resourcesReady) setPresentedConcept(concept);
  }
  async function closeConcept() {
    if (attemptRef.current !== attemptId || !activity.active || !advanceAssetsReady) return;
    if (flow.readOnly || flow.confirmedStepIds.includes(stepByConcept[activeConcept])) {
      setSelection(null);
      setPanelClosed(false);
      setExpandedDetails(false);
      return;
    }
    const action = activeConcept === "mediation"
      ? () => closeEssentialRoom({ screen: 1, contentRevision: flow.contentRevision, attemptId, cause: "visitor_close" })
      : () => confirmEssentialStep({ screen: 1, stepId: stepByConcept[activeConcept], contentRevision: flow.contentRevision, attemptId, cause: "visitor_advance" });
    await perform(action, () => {
      playJourneySound(activeConcept === "mediation" ? "roomComplete" : "interaction");
      setSelection(null); setExpandedDetails(false); setPanelClosed(false);
    });
  }
  const retryPendingCheckpoint = () => { void retryActionRef.current?.(); };
  const retryCheckpointRead = () => { invalidateJourneyEssential(); presentedRequestRef.current = ""; setCheckpointSaveFailed(false); };

  useEffect(() => {
    savingRef.current = false; retryActionRef.current = null; presentedRequestRef.current = "";
    setSaving(false); setCheckpointSaveFailed(false); setSelection(null);
    setPanelClosed(false); setExpandedDetails(false); setPresentedConcept(null);
  }, [attemptId]);

  useEffect(() => {
    if (!activity.active || !visible || !resourcesReady || saving || checkpointSaveFailed || presentedConcept !== activeConcept || flow.readOnly || activeConcept === "ready_to_continue" || flow.presentedStepIds.includes(stepByConcept[activeConcept])) return;
    const request = attemptId + ":" + activeConcept + ":" + flow.contentRevision;
    if (presentedRequestRef.current === request) return;
    let frame = 0;
    const first = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        if (attemptRef.current !== attemptId || !activeRef.current || document.visibilityState === "hidden") return;
        presentedRequestRef.current = request;
        void perform(() => markEssentialPresented({ screen: 1, stepId: stepByConcept[activeConcept], contentRevision: flow.contentRevision, attemptId, mode: "standard" }));
      });
    });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(frame); };
  }, [attemptId, activity.active, visible, resourcesReady, saving, checkpointSaveFailed, presentedConcept, activeConcept, flow.contentRevision, flow.readOnly, flow.presentedStepIds]);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const guideTarget = panelClosed
    ? activeConcept === "relation"
      ? "perception"
      : "mediation"
    : activeConcept === "intro"
      ? "relation"
      : activeConcept;
  const guideX = {
    relation: "16%",
    perception: "50%",
    mediation: "84%",
    ready_to_continue: "77%",
    intro: "16%",
  }[guideTarget];

  useEffect(() => {
    if (!activity.active || !visible || !resourcesReady) return;
    if (
      activeConcept === "intro" ||
      activeConcept === "ready_to_continue" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setPresentedConcept(activeConcept);
      return;
    }
    setPresentedConcept(null);
    const arrival = window.setTimeout(
      () => { if (attemptRef.current === attemptId) setPresentedConcept(activeConcept); },
      480,
    );
    return () => window.clearTimeout(arrival);
  }, [attemptId, activeConcept, activity.active, visible, resourcesReady]);

  const copy = world1ConceptCopy[activeConcept];
  const isReadyToContinue = activeConcept === "ready_to_continue";
  const shouldRenderNarrativeHint =
    !isReadyToContinue && isSmallMobileHeight && narrativeNeedsScroll;
  const narrativeHintDismissed = dismissedNarrativeHints.has(activeConcept);
  const activeRoot =
    activeConcept === "intro" || isReadyToContinue
      ? null
      : {
          concept: activeConcept,
          asset: {
            relation: world1RootAssets.activeRelation,
            perception: world1RootAssets.activePerception,
            mediation: world1RootAssets.activeMediation,
          }[activeConcept],
        };

  useEffect(() => {
    const viewport = narrativeViewportRef.current;
    const track = narrativeTrackRef.current;

    if (!viewport || !track || typeof window === "undefined") {
      return undefined;
    }

    viewport.scrollTop = 0;

    let animationFrameId = 0;
    const measureNarrative = () => {
      const effectiveWidth = Math.round(
        window.visualViewport?.width ?? window.innerWidth,
      );
      const effectiveHeight = Math.round(
        window.visualViewport?.height ?? window.innerHeight,
      );
      const nextSmallMobileHeight =
        effectiveWidth <= world1SwipeHintMaxWidth &&
        effectiveHeight <= world1SwipeHintMaxHeight;
      const nextNeedsScroll =
        !isReadyToContinue && viewport.scrollHeight > viewport.clientHeight + 2;

      setIsSmallMobileHeight((current) =>
        current === nextSmallMobileHeight ? current : nextSmallMobileHeight,
      );
      setNarrativeNeedsScroll((current) =>
        current === nextNeedsScroll ? current : nextNeedsScroll,
      );
    };
    const scheduleMeasure = () => {
      if (typeof window.requestAnimationFrame === "function") {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = window.requestAnimationFrame(measureNarrative);
      } else {
        measureNarrative();
      }
    };

    measureNarrative();
    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("scroll", scheduleMeasure);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleMeasure);
    resizeObserver?.observe(viewport);
    resizeObserver?.observe(track);

    return () => {
      window.cancelAnimationFrame?.(animationFrameId);
      window.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("scroll", scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [activeConcept, isReadyToContinue]);

  function dismissNarrativeHint() {
    setDismissedNarrativeHints((currentDismissedHints) => {
      if (currentDismissedHints.has(activeConcept)) {
        return currentDismissedHints;
      }

      const nextDismissedHints = new Set(currentDismissedHints);
      nextDismissedHints.add(activeConcept);
      return nextDismissedHints;
    });
  }

  return (
    <main
      className="world1-root-screen"
      ref={motionRootRef}
      style={
        { ...backgroundLayerStyle, "--world1-guide-x": guideX } as CSSProperties
      }
      data-world1-guide-target={guideTarget}
      data-journey-active={activity.active}
      data-lia-action={saving ? "respond" : presentedConcept === activeConcept ? "present" : "attention"}
      data-lia-target={activeConcept}
      data-world1-lia-arrival={
        presentedConcept === activeConcept ? "presenting" : "arriving"
      }
      data-world1-activity-continued={activityContinued}
      data-world1-visited-concepts={visitedConcepts.join(",")}
      data-world1-root-version="004E-5A-static-ready"
      data-world1-mobile-stabilization="004F-1C"
      data-world1-root-state={activeConcept}
      data-world1-highest-reached={highestReachedConcept}
      data-world1-checkpoint-recovery={checkpointRecoveryStatus ?? "none"}
      data-world1-layout-mode="full-bleed-prudent"
      data-world1-narrative-motion="manual-scroll"
      data-world1-narrative-control="vertical-manual"
      data-world1-swipe-hint-system="016S5"
      data-world1-swipe-hint-state={
        shouldRenderNarrativeHint
          ? narrativeHintDismissed
            ? "completed"
            : "pending"
          : "inactive"
      }
      data-world1-motion-driver="js-raf-css-vars"
      data-world1-motion-layer="css-js-procedural"
      data-world1-slot-count={WORLD1_REQUIRED_SLOT_COUNT}
      data-world1-exit-ready={isReadyToContinue ? "true" : undefined}
      data-critical-assets-ready={initialPreload.ready ? "true" : "false"}
      data-critical-assets-status={initialPreload.status}
      data-world1-relation-preload-ready={
        relationPreload.ready ? "true" : "false"
      }
      data-world1-perception-preload-ready={
        perceptionPreload.ready ? "true" : "false"
      }
      data-world1-mediation-preload-ready={
        mediationPreload.ready ? "true" : "false"
      }
      data-world1-ready-preload-ready={readyPreload.ready ? "true" : "false"}
      aria-labelledby="world1-root-title"
    >
      <h1
        id="world1-root-title"
        className="world1-room-heading"
        data-world1-slot-id="W1_INTRO_EYEBROW_01"
        data-editorial-status="REVIEW"
        data-editorial-source="editorial_excel"
      >
        {locale === "en" ? "Room I · Root" : "Sala I · Raíz"}
      </h1>
      {initialPreload.ready ? null : (
        <p className="world1-root-preload-status" role="status">
          {locale === "en" ? "Preparing Root..." : "Preparando raíz..."}
        </p>
      )}
      <World1RootStageFrame
        className="world1-root-stage"
        data-testid="world1-root-stage"
        aria-label={world1EditorialSlots.W1_ACCESSIBLE_SCENE_01.text}
        data-world1-slot-id="W1_ACCESSIBLE_SCENE_01"
        data-editorial-status={
          world1EditorialSlots.W1_ACCESSIBLE_SCENE_01.status
        }
      >
        <div
          className="world1-root-stage-coordinate-layer"
          data-world1-stage-coordinate-layer="true"
          data-runtime-asset={world1RootAssets.background}
          style={backgroundLayerStyle}
        >
          <img
            className="world1-root-layer world1-root-layer--ambient"
            src={world1RootAssets.ambientLight}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.ambientLight}
          />
          <img
            className="world1-root-layer world1-root-layer--roots"
            src={world1RootAssets.rootsBase}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.rootsBase}
          />
          {activeRoot ? (
            <img
              className={`world1-root-layer world1-root-layer--active-${activeRoot.concept}`}
              src={activeRoot.asset}
              alt=""
              aria-hidden="true"
              data-runtime-asset={activeRoot.asset}
              data-world1-root-active={activeRoot.concept}
              data-world1-active-roots-calibration="manual-calibration"
              data-world1-relation-calibration={
                activeRoot.concept === "relation"
                  ? "manual-calibration"
                  : undefined
              }
            />
          ) : null}
          <span
            className="world1-root-plant-aura"
            aria-hidden="true"
            data-world1-motion-element="plant-pulse"
          />
          <span
            className="world1-root-plant-leaf-motion world1-root-plant-leaf-motion--left"
            aria-hidden="true"
            data-world1-motion-element="plant-leaf-light"
          />
          <span
            className="world1-root-plant-leaf-motion world1-root-plant-leaf-motion--right"
            aria-hidden="true"
            data-world1-motion-element="plant-leaf-light"
          />
          <img
            className="world1-root-plant"
            src={world1RootAssets.plant}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world1RootAssets.plant}
          />
          <span
            className="world1-root-lia-halo"
            aria-hidden="true"
            data-world1-motion-element="lia-halo"
          />
          <span
            className="world1-root-lia-presence"
            aria-hidden="true"
            data-world1-motion-element="lia-presence"
          >
            <span className="world1-root-lia-presence__aura" />
            <span className="world1-root-lia-presence__glint" />
            <span className="world1-root-lia-presence__ground" />
          </span>
          <LiaJourneyMotion
            className="world1-root-lia"
            active={activity.active && visible && resourcesReady}
            action={saving ? "respond" : presentedConcept === activeConcept ? "present" : "attention"}
            target={activeConcept}
            direction={activeConcept === "relation" ? "left" : "right"}
            replayKey={`${activeConcept}:${expandedDetails}:${presentedConcept}`}
          />

          <div
            className="world1-root-nodes"
            aria-label={locale === "en" ? "Room I concept nodes" : "Nodos conceptuales de Mundo I"}
          >
            {conceptNodes.map((node) => {
              const allowed = canUseUiStep(1, stepByConcept[node.id]);
              const nodeState: World1NodeState = !allowed ? "locked" : node.id === activeConcept ? "active" : flow.confirmedStepIds.includes(stepByConcept[node.id]) ? "completed" : "available";
              const isLocked = !allowed;
              const isPressed = nodeState === "active";
              const isClickable = activity.active && !isLocked && !checkpointRecoveryStatus && !saving;

              return (
                <button
                  className={`world1-root-node world1-root-node--${node.id}`}
                  key={node.id}
                  type="button"
                  data-world1-root-node={node.id}
                  data-node-state={nodeState}
                  aria-label={locale === "en" ? `${isLocked ? "Locked" : "Explore"} ${ui.nodes[conceptNodes.indexOf(node)]}` : isLocked ? node.lockedName : node.accessibleName}
                  aria-disabled={!isClickable ? "true" : undefined}
                  aria-pressed={isClickable ? isPressed : undefined}
                  disabled={!isClickable}
                  onClick={
                    isClickable ? () => activateConcept(node.id) : undefined
                  }
                >
                  <span
                    className="world1-root-node__label"
                    data-world1-title-revealed={
                      presentedConcept === node.id ||
                      (visitedConcepts.includes(node.id) &&
                        activeConcept !== node.id)
                        ? "true"
                        : "false"
                    }
                    aria-hidden="true"
                  >
                    {presentedConcept === node.id ||
                    (visitedConcepts.includes(node.id) &&
                      activeConcept !== node.id)
                      ? ui.nodes[conceptNodes.indexOf(node)]
                      : ""}
                  </span>
                  <span
                    className="world1-root-node__orb-shell"
                    aria-hidden="true"
                  >
                    <span
                      className="world1-root-node__halo"
                      data-world1-motion-element="node-halo"
                    />
                    <span
                      className="world1-root-node__ring"
                      data-world1-motion-element="node-ring"
                    />
                    <span
                      className={`world1-root-node__orb world1-root-node__orb--${nodeState}`}
                      data-runtime-asset={world1RootAssets.nodeKit}
                      data-node-frame={nodeState}
                      style={nodeOrbStyle}
                    />
                    <span
                      className="world1-root-node__particles"
                      data-world1-motion-element="node-particles"
                    >
                      {nodeParticleSlots.map((slot) => (
                        <span
                          className="world1-root-node__particle"
                          data-world1-particle-slot={slot}
                          key={slot}
                        />
                      ))}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="world1-root-energy-field"
            aria-hidden="true"
            data-world1-motion-element="js-energy-field"
            data-world1-energy-state={activeConcept}
          >
            {energySparkSlots.map((spark) => {
              const sparkStyle = {
                "--world1-energy-delay": spark.delay,
                "--world1-energy-size": spark.size,
                "--world1-energy-x": spark.x,
                "--world1-energy-y": spark.y,
              } as EnergySparkStyle;

              return (
                <span
                  className="world1-root-energy-field__spark"
                  data-world1-energy-spark={spark.id}
                  key={spark.id}
                  style={sparkStyle}
                />
              );
            })}
          </div>

        </div>
          <div
            className="world1-root-narrative"
            aria-live="polite"
            data-world1-reading-visible={
              presentedConcept === activeConcept ||
              checkpointRecoveryStatus !== null ||
              checkpointSaveFailed ||
              completionPhase === "error"
            }
            data-world1-narrative-state={activeConcept}
            data-world1-narrative-duration-ms={copy.durationMs}
          >
            <div
              ref={narrativeViewportRef}
              className="world1-root-narrative__viewport"
              tabIndex={0}
              aria-label={locale === "en" ? "Room I narrative with manual vertical scrolling" : "Narrativa de Sala I con desplazamiento vertical manual"}
              data-world1-scroll-viewport="manual"
              onScroll={(event) => {
                if (event.currentTarget.scrollTop > 6) {
                  dismissNarrativeHint();
                }
              }}
            >
              <div
                ref={narrativeTrackRef}
                className="world1-root-narrative__track"
                key={`world1-narrative-${activeConcept}`}
              >
                <p
                  className="world1-root-narrative__eyebrow"
                  data-world1-slot-id={
                    activeConcept === "intro" ? undefined : copy.eyebrow.slotId
                  }
                  data-editorial-status={copy.eyebrow.status}
                >
                  {panelClosed
                    ? ui.advance
                    : activeConcept === "intro"
                      ? (locale === "en" ? "Before we begin" : "Antes de comenzar")
                      : presentedConcept === activeConcept
                        ? copy.eyebrow.text
                        : ""}
                </p>
                <h2
                  id="world1-concept-title"
                  data-world1-slot-id={copy.title.slotId}
                  data-editorial-status={copy.title.status}
                >
                  {panelClosed
                    ? ui.advance
                    : presentedConcept === activeConcept
                      ? copy.title.text
                      : ""}
                </h2>
                <p
                  className="world1-root-narrative__body"
                  data-world1-slot-id={
                    completionPhase === "error" ||
                    checkpointSaveFailed ||
                    checkpointRecoveryStatus
                      ? undefined
                      : copy.body.slotId
                  }
                  data-editorial-status={
                    completionPhase === "error" ||
                    checkpointSaveFailed ||
                    checkpointRecoveryStatus
                      ? "TEMP"
                      : copy.body.status
                  }
                  data-progress-save-error={
                    completionPhase === "error" ? "true" : undefined
                  }
                >
                  {checkpointRecoveryStatus
                    ? checkpointResetConfirmation
                      ? "¿Restablecer el avance guardado de este mundo?"
                      : locale === "en" ? "It was not possible to recover your saved progress in this room." : "No fue posible recuperar el avance de este mundo."
                    : checkpointSaveFailed || completionPhase === "error"
                      ? ui.saveError
                      : panelClosed
                        ? ui.advance
                        : presentedConcept === activeConcept
                          ? copy.body.text
                          : ""}
                </p>
                {!panelClosed &&
                presentedConcept === activeConcept &&
                activeConcept in world1OptionalDetails ? (
                  <p id={`world1-expanded-${activeConcept}`} className="world1-reading-expanded" hidden={!expandedDetails}>
                    {world1OptionalDetails[activeConcept]}
                  </p>
                ) : null}
                {checkpointResetConfirmation ? (
                  <p
                    className="world1-root-narrative__body"
                    data-editorial-status="TEMP"
                  >
                    El progreso global del recorrido se conservará.
                  </p>
                ) : null}
              </div>
            </div>
            {shouldRenderNarrativeHint ? (
              <>
                <span
                  ref={narrativeSwipeAnchorRef}
                  className="world1-root-narrative__gesture-anchor"
                  data-world1-swipe-hint-anchor={activeConcept}
                  aria-hidden="true"
                />
                <GestureHint
                  active={activity.active && !narrativeHintDismissed}
                  anchorRef={narrativeSwipeAnchorRef}
                  className="world1-root-gesture-hint"
                  completed={narrativeHintDismissed}
                  delayMs={2800}
                  direction="up"
                  targetLabel={`${locale === "en" ? "Vertical reading" : "Lectura vertical"}: ${copy.title.text}`}
                  variant="swipe-vertical"
                />
              </>
            ) : null}
            <span
              className="world1-root-narrative__scroll-cue"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
            <div className="world1-reading-actions">
              {!panelClosed && !isReadyToContinue && world1OptionalDetails[activeConcept] ? (
                <button className="world1-reading-more-toggle" type="button" disabled={!activity.active} aria-expanded={expandedDetails} aria-controls={`world1-expanded-${activeConcept}`} onClick={() => setExpandedDetails((value) => !value)}>
                  {expandedDetails ? ui.less : ui.more}
                </button>
              ) : null}
            {assetFailed ? <button className="world1-root-narrative__action" onClick={() => setAssetRetry((value) => value + 1)} type="button">{ui.retry}</button> : checkpointRecoveryStatus || checkpointSaveFailed ? (
              <button className="world1-root-narrative__action" onClick={checkpointSaveFailed ? retryPendingCheckpoint : retryCheckpointRead} type="button">{ui.retry}</button>
            ) : !isReadyToContinue &&
              !panelClosed ? (
              <button
                className="world1-reading-close"
                type="button"
                aria-label={activeConcept === "mediation" ? ui.close : ui.advance}
                data-world1-slot-id="W1_CLOSE_ROOT_BTN_01"
                onClick={() => { void closeConcept(); }}
                disabled={!activity.active || saving || !advanceAssetsReady || (!flow.readOnly && !flow.presentedStepIds.includes(stepByConcept[activeConcept]))}
              >
                <span>{activeConcept === "mediation" ? ui.close : ui.advance}</span>
              </button>
            ) : null}
            </div>
          </div>
      </World1RootStageFrame>
      {flow.exitReady && activity.active ? <div className="world1-scene-exit">
        <InterstationQrGate originWorld={1} ready={flow.exitReady && resourcesReady && !saving && !checkpointSaveFailed} presentation="scene" persistCompletion={() => attemptRef.current === attemptId && isEssentialExitReady(1)} onCompleted={() => { if (attemptRef.current === attemptId && activeRef.current) navigate(worldOneToWorldTwoTransitionRoute); }} />
      </div> : null}
    </main>
  );
}
