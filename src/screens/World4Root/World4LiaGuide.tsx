import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

import {
  WORLD4_ARTBOARD,
  WORLD4_NODE_ANCHORS,
  WORLD4_Z_ORDER,
} from "./world4Geometry";
import type { Station4NodeId } from "./station4Content";
import { world4SharedLiaAssets } from "./world4RuntimeAssets";

export type World4LiaGuideMode = "entry" | "guide" | "closure";

export type World4LiaMotionTrace = {
  durationMs: number;
  fromNodeId: Station4NodeId | null;
  mode: World4LiaGuideMode;
  reducedMotion: boolean;
  toNodeId: Station4NodeId;
};

export type World4LiaGuideProps = {
  active?: boolean;
  className?: string;
  durationMs?: number;
  mode?: World4LiaGuideMode;
  motionKey?: number | string;
  nodeId: Station4NodeId;
  onTravelCancel?: (trace: World4LiaMotionTrace) => void;
  onTravelComplete?: (trace: World4LiaMotionTrace) => void;
  onTravelStart?: (trace: World4LiaMotionTrace) => void;
  reducedMotion: boolean;
};

type LiaOffset = {
  dx: number;
  dy: number;
  mirror: boolean;
};

export type World4LiaGuidePosition = LiaOffset & {
  nodeId: Station4NodeId;
  x: number;
  xPercent: number;
  y: number;
  yPercent: number;
};

type LiaGuideStyle = CSSProperties & {
  "--s4-lia-anchor-x": string;
  "--s4-lia-anchor-y": string;
  "--s4-lia-offset-x": string;
  "--s4-lia-offset-y": string;
};

const WORLD4_LIA_OFFSETS = {
  planta: { dx: 72, dy: -112, mirror: false },
  bionosificador: { dx: 68, dy: -104, mirror: false },
  esp32: { dx: 64, dy: -102, mirror: false },
  midi: { dx: 58, dy: -98, mirror: false },
  wifi_udp: { dx: -58, dy: -98, mirror: true },
  router: { dx: -64, dy: -102, mirror: true },
  sistema_central: { dx: -68, dy: -104, mirror: true },
  sonido: { dx: -72, dy: -112, mirror: true },
} as const satisfies Record<Station4NodeId, LiaOffset>;

export const WORLD4_LIA_GUIDE_POSITIONS = Object.fromEntries(
  WORLD4_NODE_ANCHORS.map((anchor) => {
    const offset = WORLD4_LIA_OFFSETS[anchor.id];
    const x = anchor.x + offset.dx;
    const y = anchor.y + offset.dy;

    return [
      anchor.id,
      {
        ...offset,
        nodeId: anchor.id,
        x,
        xPercent: (x / WORLD4_ARTBOARD.width) * 100,
        y,
        yPercent: (y / WORLD4_ARTBOARD.height) * 100,
      },
    ];
  }),
) as Readonly<Record<Station4NodeId, World4LiaGuidePosition>>;

const STANDARD_TRAVEL_DURATION_MS = 720;
const REDUCED_CROSSFADE_DURATION_MS = 150;
const STANDARD_TRAVEL_LIFT_ARTBOARD_PX = 20;

function assetForMode(mode: World4LiaGuideMode) {
  return mode === "guide"
    ? world4SharedLiaAssets.guide
    : world4SharedLiaAssets.closure;
}

export function World4LiaGuide({
  active = true,
  className,
  durationMs = STANDARD_TRAVEL_DURATION_MS,
  mode = "guide",
  motionKey = 0,
  nodeId,
  onTravelCancel,
  onTravelComplete,
  onTravelStart,
  reducedMotion,
}: World4LiaGuideProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const currentAnimationRef = useRef<Animation | null>(null);
  const previousPositionRef = useRef<World4LiaGuidePosition | null>(null);
  const previousAssetRef = useRef<string | null>(null);
  const previousMotionKeyRef = useRef<number | string | null>(null);
  const onTravelCancelRef = useRef(onTravelCancel);
  const onTravelCompleteRef = useRef(onTravelComplete);
  const onTravelStartRef = useRef(onTravelStart);

  onTravelCancelRef.current = onTravelCancel;
  onTravelCompleteRef.current = onTravelComplete;
  onTravelStartRef.current = onTravelStart;

  const position = WORLD4_LIA_GUIDE_POSITIONS[nodeId];
  const asset = assetForMode(mode);
  const effectiveDurationMs = reducedMotion
    ? REDUCED_CROSSFADE_DURATION_MS
    : mode === "entry" && durationMs < 620
      ? Math.min(300, Math.max(120, durationMs))
      : Math.min(820, Math.max(620, durationMs));

  useLayoutEffect(() => {
    const traveler = travelerRef.current;
    const previousPosition = previousPositionRef.current;
    const previousAsset = previousAssetRef.current;
    const previousMotionKey = previousMotionKeyRef.current;
    previousPositionRef.current = position;
    previousAssetRef.current = asset;
    previousMotionKeyRef.current = motionKey;

    currentAnimationRef.current?.cancel();
    currentAnimationRef.current = null;

    if (!active || !traveler) {
      return;
    }

    const trace: World4LiaMotionTrace = {
      durationMs: effectiveDurationMs,
      fromNodeId: previousPosition?.nodeId ?? null,
      mode,
      reducedMotion,
      toNodeId: nodeId,
    };
    const stageRect = rootRef.current?.parentElement?.getBoundingClientRect();
    const scaleX = stageRect ? stageRect.width / WORLD4_ARTBOARD.width : 1;
    const scaleY = stageRect ? stageRect.height / WORLD4_ARTBOARD.height : 1;
    const origin = previousPosition ?? {
      ...position,
      y: position.y + 12,
    };
    const deltaX = (origin.x - position.x) * scaleX;
    const deltaY = (origin.y - position.y) * scaleY;
    const lift = STANDARD_TRAVEL_LIFT_ARTBOARD_PX * scaleY;
    const changedNode = previousPosition?.nodeId !== nodeId;
    const changedAsset = previousAsset !== asset;
    const changedMotionRun = previousMotionKey !== motionKey;

    if (
      previousPosition &&
      !changedNode &&
      !changedAsset &&
      !changedMotionRun
    ) {
      return;
    }

    if (typeof traveler.animate !== "function") {
      onTravelStartRef.current?.(trace);
      onTravelCompleteRef.current?.(trace);
      return;
    }

    const keyframes: Keyframe[] = reducedMotion
      ? [{ opacity: 0.35 }, { opacity: 0.82 }, { opacity: 1 }]
      : [
          {
            opacity: previousPosition ? 1 : 0,
            transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
          },
          {
            opacity: 1,
            transform: changedNode
              ? `translate3d(${deltaX / 2}px, ${deltaY / 2 - lift}px, 0)`
              : "translate3d(0, -2px, 0)",
          },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ];

    onTravelStartRef.current?.(trace);
    const animation = traveler.animate(keyframes, {
      duration: effectiveDurationMs,
      easing: reducedMotion
        ? "cubic-bezier(.16, 1, .3, 1)"
        : "cubic-bezier(.22, .61, .36, 1)",
      fill: "both",
    });
    currentAnimationRef.current = animation;
    let settled = false;

    const handleFinish = () => {
      if (settled) return;
      settled = true;
      currentAnimationRef.current = null;
      animation.cancel();
      onTravelCompleteRef.current?.(trace);
    };
    const handleCancel = () => {
      if (settled) return;
      settled = true;
      if (currentAnimationRef.current === animation) {
        currentAnimationRef.current = null;
      }
      onTravelCancelRef.current?.(trace);
    };

    animation.addEventListener("finish", handleFinish, { once: true });
    animation.addEventListener("cancel", handleCancel, { once: true });

    return () => {
      animation.removeEventListener("finish", handleFinish);
      animation.removeEventListener("cancel", handleCancel);
      if (!settled) {
        animation.cancel();
        handleCancel();
      }
    };
  }, [
    active,
    asset,
    effectiveDurationMs,
    mode,
    motionKey,
    nodeId,
    position,
    reducedMotion,
  ]);

  useEffect(() => {
    const finishToStableGeometry = () => {
      const animation = currentAnimationRef.current;
      if (!animation) {
        return;
      }
      try {
        animation.finish();
      } catch {
        animation.cancel();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        currentAnimationRef.current?.cancel();
      }
    };
    const visualViewport = window.visualViewport;

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", finishToStableGeometry);
    window.addEventListener("resize", finishToStableGeometry);
    visualViewport?.addEventListener("resize", finishToStableGeometry);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", finishToStableGeometry);
      window.removeEventListener("resize", finishToStableGeometry);
      visualViewport?.removeEventListener("resize", finishToStableGeometry);
      currentAnimationRef.current?.cancel();
      currentAnimationRef.current = null;
    };
  }, []);

  const style = {
    "--s4-lia-anchor-x": `${position.xPercent}%`,
    "--s4-lia-anchor-y": `${position.yPercent}%`,
    "--s4-lia-offset-x": `${position.dx}px`,
    "--s4-lia-offset-y": `${position.dy}px`,
    left: `${position.xPercent}%`,
    pointerEvents: "none",
    position: "absolute",
    top: `${position.yPercent}%`,
    transform: "translate(-50%, -100%)",
    zIndex: WORLD4_Z_ORDER.lia,
  } as LiaGuideStyle;

  return (
    <div
      aria-hidden="true"
      className={["s4-lia-guide", className].filter(Boolean).join(" ")}
      data-lia-offset-dx={position.dx}
      data-lia-offset-dy={position.dy}
      data-lia-pose={mode === "guide" ? "explain_calm" : "greeting"}
      data-lia-source="repo-existing-2-5d"
      data-stage-layer={`z${WORLD4_Z_ORDER.lia}`}
      data-station4-lia="motion-guide"
      data-station4-lia-duration-ms={effectiveDurationMs}
      data-station4-lia-mirrored={position.mirror}
      data-station4-lia-mode={mode}
      data-station4-lia-resize-strategy="finish-to-stable"
      data-station4-lia-motion={
        reducedMotion ? "crossfade" : "three-keyframe-travel"
      }
      data-station4-lia-node={nodeId}
      ref={rootRef}
      style={style}
    >
      <div className="s4-lia-guide__traveler" ref={travelerRef}>
        <img
          alt=""
          className="s4-lia-guide__image"
          data-runtime-asset={asset}
          draggable={false}
          src={asset}
          style={{ transform: position.mirror ? "scaleX(-1)" : "none" }}
        />
        <span aria-hidden="true" className="s4-lia-guide__collar-glow" />
      </div>
    </div>
  );
}
