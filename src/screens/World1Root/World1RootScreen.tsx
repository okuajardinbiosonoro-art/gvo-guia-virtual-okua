import "./World1RootScreen.css";

import type { CSSProperties, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { worldOneToWorldTwoTransitionRoute } from "../../app/routes";
import { GestureHint } from "../../components/GestureHint/GestureHint";
import {
  WORLD1_REQUIRED_SLOT_COUNT,
  type World1ConceptId,
  world1ConceptCopy,
  world1EditorialSlots,
} from "../../content/world1EditorialSlots";
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
): RefObject<HTMLElement | null> {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || typeof window === "undefined") {
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
        (1 + slowPulse * 0.008).toFixed(4),
      );
      root.style.setProperty(
        "--world1-js-lia-y",
        `${(-1.4 - slowPulse * 1.2).toFixed(2)}px`,
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
  }, [activeConcept]);

  return rootRef;
}

function getNodeState(
  nodeId: World1Node["id"],
  concept: World1Concept,
): World1NodeState {
  if (concept === "intro") {
    return nodeId === "relation" ? "available" : "locked";
  }

  if (concept === "relation") {
    if (nodeId === "relation") {
      return "active";
    }

    return nodeId === "perception" ? "available" : "locked";
  }

  if (concept === "perception") {
    if (nodeId === "relation") {
      return "completed";
    }

    return nodeId === "perception" ? "active" : "available";
  }

  if (concept === "mediation") {
    return nodeId === "mediation" ? "active" : "completed";
  }

  return "completed";
}

export function World1RootScreen() {
  const navigate = useNavigate();
  const [activeConcept, setActiveConcept] = useState<World1Concept>("intro");
  const [narrativeNeedsScroll, setNarrativeNeedsScroll] = useState(false);
  const [isSmallMobileHeight, setIsSmallMobileHeight] = useState(false);
  const [dismissedNarrativeHints, setDismissedNarrativeHints] = useState<
    ReadonlySet<World1Concept>
  >(() => new Set<World1Concept>());
  const narrativeViewportRef = useRef<HTMLDivElement>(null);
  const narrativeTrackRef = useRef<HTMLDivElement>(null);
  const narrativeSwipeAnchorRef = useRef<HTMLSpanElement>(null);
  const motionRootRef = useWorld1MotionRoot(activeConcept);
  const initialPreload = useAssetPreloader(
    screenAssetBundles.world1RootInitial,
    {
      timeoutMs: 9000,
    },
  );
  const relationPreload = useAssetPreloader(
    screenAssetBundles.world1RootRelation,
    {
      enabled: activeConcept === "intro",
      timeoutMs: 8000,
    },
  );
  const perceptionPreload = useAssetPreloader(
    screenAssetBundles.world1RootPerception,
    {
      enabled: activeConcept === "relation",
      timeoutMs: 8000,
    },
  );
  const mediationPreload = useAssetPreloader(
    screenAssetBundles.world1RootMediation,
    {
      enabled: activeConcept === "perception",
      timeoutMs: 8000,
    },
  );
  const readyPreload = useAssetPreloader(screenAssetBundles.world1RootReady, {
    enabled: activeConcept === "mediation",
    timeoutMs: 8000,
  });
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
  const liaAssetByConcept: Record<World1Concept, string> = {
    intro: world1RootAssets.liaIdle,
    relation: world1RootAssets.liaPointRelation,
    perception: world1RootAssets.liaLookPerception,
    mediation: world1RootAssets.liaGuideMediation,
    ready_to_continue: world1RootAssets.liaReadyContinue,
  };
  const liaPoseByConcept: Record<World1Concept, string> = {
    intro: "idle",
    relation: "point_relation",
    perception: "look_perception",
    mediation: "guide_mediation",
    ready_to_continue: "ready_continue",
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
      style={backgroundLayerStyle}
      data-world1-root-version="004E-5A-static-ready"
      data-world1-mobile-stabilization="004F-1C"
      data-world1-root-state={activeConcept}
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
      {initialPreload.ready ? null : (
        <p className="world1-root-preload-status" role="status">
          Preparando raíz...
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
          <img
            className="world1-root-lia"
            src={liaAssetByConcept[activeConcept]}
            alt="Lía, guía visual de OKÚA"
            data-runtime-asset={liaAssetByConcept[activeConcept]}
            data-world1-lia-pose={liaPoseByConcept[activeConcept]}
          />
          <span
            className="world1-root-lia-expression"
            aria-hidden="true"
            data-world1-motion-element="lia-expression"
          >
            <span className="world1-root-lia-expression__core" />
            <span className="world1-root-lia-expression__look" />
            <span className="world1-root-lia-expression__gesture" />
          </span>

          <div
            className="world1-root-nodes"
            aria-label="Nodos conceptuales de Mundo I"
          >
            {conceptNodes.map((node) => {
              const nodeState = getNodeState(node.id, activeConcept);
              const isLocked = nodeState === "locked";
              const isPressed = nodeState === "active";
              const isClickable = nodeState === "available" || isPressed;

              return (
                <button
                  className={`world1-root-node world1-root-node--${node.id}`}
                  key={node.id}
                  type="button"
                  data-world1-root-node={node.id}
                  data-node-state={nodeState}
                  aria-label={isLocked ? node.lockedName : node.accessibleName}
                  aria-disabled={!isClickable ? "true" : undefined}
                  aria-pressed={isClickable ? isPressed : undefined}
                  disabled={!isClickable}
                  onClick={
                    isClickable
                      ? () =>
                          setActiveConcept(
                            node.id === "mediation"
                              ? "mediation"
                              : node.id === "perception"
                                ? "perception"
                                : "relation",
                          )
                      : undefined
                  }
                >
                  <span className="world1-root-node__label">{node.label}</span>
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

          <div
            className="world1-root-narrative"
            aria-live="polite"
            data-world1-narrative-state={activeConcept}
            data-world1-narrative-duration-ms={copy.durationMs}
          >
            <div
              ref={narrativeViewportRef}
              className="world1-root-narrative__viewport"
              tabIndex={0}
              aria-label="Narrativa de Mundo I con desplazamiento vertical manual"
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
                  data-world1-slot-id={copy.eyebrow.slotId}
                  data-editorial-status={copy.eyebrow.status}
                >
                  {copy.eyebrow.text}
                </p>
                <h1
                  id="world1-root-title"
                  data-world1-slot-id={copy.title.slotId}
                  data-editorial-status={copy.title.status}
                >
                  {copy.title.text}
                </h1>
                <p
                  className="world1-root-narrative__body"
                  data-world1-slot-id={copy.body.slotId}
                  data-editorial-status={copy.body.status}
                >
                  {copy.body.text}
                </p>
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
                  active={!narrativeHintDismissed}
                  anchorRef={narrativeSwipeAnchorRef}
                  className="world1-root-gesture-hint"
                  completed={narrativeHintDismissed}
                  delayMs={2800}
                  direction="up"
                  targetLabel={`Lectura vertical: ${copy.title.text}`}
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
            {activeConcept === "mediation" ? (
              <button
                className="world1-root-narrative__action"
                type="button"
                data-world1-slot-id="W1_CLOSE_ROOT_BTN_01"
                data-editorial-status={
                  world1EditorialSlots.W1_CLOSE_ROOT_BTN_01.status
                }
                onClick={() => {
                  setActiveConcept("ready_to_continue");
                }}
              >
                {world1EditorialSlots.W1_CLOSE_ROOT_BTN_01.text}
              </button>
            ) : null}
          </div>

          {isReadyToContinue ? (
            <button
              className="world1-root-continue world1-root-continue--ready"
              type="button"
              aria-disabled="false"
              data-world1-exit-target={worldOneToWorldTwoTransitionRoute}
              data-world1-slot-id="W1_CONTINUE_BTN_01"
              data-editorial-status={
                world1EditorialSlots.W1_CONTINUE_BTN_01.status
              }
              onClick={() => navigate(worldOneToWorldTwoTransitionRoute)}
            >
              {world1EditorialSlots.W1_CONTINUE_BTN_01.text}
            </button>
          ) : null}
        </div>
      </World1RootStageFrame>
    </main>
  );
}
