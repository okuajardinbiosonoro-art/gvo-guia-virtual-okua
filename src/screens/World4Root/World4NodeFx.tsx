import type { CSSProperties, ReactNode } from "react";

import { world4NodeAssetManifest } from "./world4AssetManifest";
import { WORLD4_NODE_STACK } from "./world4Geometry";
import {
  getWorld4NodeFxConfig,
  type World4NodeFxPrimitive,
} from "./world4NodeFxConfig";
import type { Station4NodeId } from "./station4Content";

export type World4NodeFxPhase =
  | "idle"
  | "arrival"
  | "active"
  | "settling"
  | "completed";

export type World4NodeFxProps = {
  active: boolean;
  nodeId: Station4NodeId;
  phase?: World4NodeFxPhase;
  reducedMotion: boolean;
  runId?: number | string;
};

type FxStyle = CSSProperties & {
  "--st4-fx-delay"?: string;
  "--st4-fx-duration"?: string;
};

const svgUnit = (value: number) => value * 100;
const svgPoint = ([x, y]: readonly [number, number]) =>
  `${svgUnit(x)},${svgUnit(y)}`;

function primitiveStyle(
  primitive: World4NodeFxPrimitive,
  reducedMotion: boolean,
): FxStyle {
  return {
    "--st4-fx-delay": `${reducedMotion ? 0 : primitive.delayMs}ms`,
    "--st4-fx-duration": `${reducedMotion ? 140 : primitive.durationMs}ms`,
    opacity:
      reducedMotion && primitive.reducedFallback === "hidden"
        ? 0
        : (primitive.opacity ?? 1),
    transformBox: "fill-box",
    transformOrigin: "center",
  };
}

function commonPrimitiveProps(
  primitive: World4NodeFxPrimitive,
  reducedMotion: boolean,
) {
  return {
    className: `s4-node-fx__primitive s4-node-fx__primitive--${primitive.id}`,
    "data-world4-fx-cycles": primitive.cycles ?? 1,
    "data-world4-fx-motion": reducedMotion
      ? primitive.reducedFallback
      : primitive.motion,
    "data-world4-fx-primitive": primitive.id,
    "data-world4-fx-role": primitive.role,
    fill: primitive.fill ?? "none",
    stroke: primitive.stroke ?? "none",
    strokeWidth: svgUnit(primitive.strokeWidth ?? 0),
    style: primitiveStyle(primitive, reducedMotion),
  };
}

function renderPrimitive(
  primitive: World4NodeFxPrimitive,
  reducedMotion: boolean,
): ReactNode {
  const common = commonPrimitiveProps(primitive, reducedMotion);

  if (primitive.kind === "circle") {
    return (
      <circle
        {...common}
        cx={svgUnit(primitive.center[0])}
        cy={svgUnit(primitive.center[1])}
        key={primitive.id}
        r={svgUnit(primitive.radius)}
      />
    );
  }

  if (primitive.kind === "rect") {
    return (
      <rect
        {...common}
        height={svgUnit(primitive.size[1])}
        key={primitive.id}
        rx={svgUnit(primitive.radius ?? 0)}
        width={svgUnit(primitive.size[0])}
        x={svgUnit(primitive.origin[0])}
        y={svgUnit(primitive.origin[1])}
      />
    );
  }

  if (primitive.kind === "line") {
    return (
      <line
        {...common}
        key={primitive.id}
        x1={svgUnit(primitive.from[0])}
        x2={svgUnit(primitive.to[0])}
        y1={svgUnit(primitive.from[1])}
        y2={svgUnit(primitive.to[1])}
      />
    );
  }

  if (primitive.kind === "arc") {
    const d = `M ${svgPoint(primitive.from)} Q ${svgPoint(
      primitive.control,
    )} ${svgPoint(primitive.to)}`;
    return <path {...common} d={d} key={primitive.id} />;
  }

  const points = primitive.points.map(svgPoint).join(" ");
  return primitive.closed ? (
    <polygon {...common} key={primitive.id} points={points} />
  ) : (
    <polyline {...common} key={primitive.id} points={points} />
  );
}

/**
 * Transparent semantic overlay aligned to the approved object's full canvas.
 * The nested SVG is then cropped to the object's alpha bbox, so all FX config
 * remains stable while the existing node stack scales responsively.
 */
export function World4NodeFx({
  active,
  nodeId,
  phase = active ? "active" : "idle",
  reducedMotion,
  runId = 0,
}: World4NodeFxProps) {
  const object = world4NodeAssetManifest[nodeId];
  const config = getWorld4NodeFxConfig(nodeId);
  const [alphaLeft, alphaTop, alphaRight, alphaBottom] = object.alphaBounds;
  const alphaWidth = alphaRight - alphaLeft;
  const alphaHeight = alphaBottom - alphaTop;
  const visibleCenterX = (alphaLeft + alphaRight) / 2 / object.canvas.width;
  const visibleBaselineY = alphaBottom / object.canvas.height;

  const rootStyle: CSSProperties = {
    position: "absolute",
    top: "42.105263%",
    left: "50%",
    zIndex: 2,
    width: `${
      (object.fullCanvasWidth / WORLD4_NODE_STACK.haloFullCanvasWidth) * 100
    }%`,
    aspectRatio: "1 / 1",
    transform: `translate(${visibleCenterX * -100}%, ${
      visibleBaselineY * -100
    }%)`,
    opacity: active ? 1 : 0,
    visibility: active ? "visible" : "hidden",
    pointerEvents: "none",
  };

  const svgStyle: CSSProperties = {
    position: "absolute",
    top: `${(alphaTop / object.canvas.height) * 100}%`,
    left: `${(alphaLeft / object.canvas.width) * 100}%`,
    width: `${(alphaWidth / object.canvas.width) * 100}%`,
    height: `${(alphaHeight / object.canvas.height) * 100}%`,
    overflow: "visible",
  };

  const alphaMaskStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, transparent 6%, rgb(184 221 255 / 42%) 52%, rgb(255 244 218 / 18%) 76%, transparent 96%)",
    maskImage: `url("${object.asset}")`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "100% 100%",
    opacity: reducedMotion ? 0.18 : 0.26,
    pointerEvents: "none",
    WebkitMaskImage: `url("${object.asset}")`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
  };

  return (
    <div
      aria-hidden="true"
      className={`s4-node-fx s4-node-fx--${nodeId}`}
      data-world4-fx-alpha-bbox={object.alphaBounds.join(",")}
      data-world4-fx-coordinate-space={config.coordinateSpace}
      data-world4-fx-duration-ms={config.durationMs}
      data-world4-fx-node={nodeId}
      data-world4-fx-phase={phase}
      data-world4-fx-primitive-count={config.primitives.length}
      data-world4-fx-reduced-motion={reducedMotion}
      data-world4-fx-root-amplitude={config.rootMotionAmplitude}
      data-world4-fx-root-motion={
        reducedMotion ? config.reducedFallback : config.rootMotion
      }
      data-world4-fx-run={runId}
      data-world4-node-fx-active={active}
      style={rootStyle}
    >
      <span
        aria-hidden="true"
        className="s4-node-fx__alpha-mask-highlight"
        data-runtime-asset={object.asset}
        data-world4-fx-alpha-mask={nodeId}
        data-world4-fx-alpha-mask-source="approved-node-raster"
        data-world4-fx-mask-motion={
          reducedMotion ? "static-highlight" : "rise-once"
        }
        style={alphaMaskStyle}
      />
      <svg
        aria-hidden="true"
        className="s4-node-fx__alpha-overlay"
        focusable="false"
        preserveAspectRatio="none"
        style={svgStyle}
        viewBox="0 0 100 100"
      >
        {config.primitives.map((primitive) =>
          renderPrimitive(primitive, reducedMotion),
        )}
      </svg>
    </div>
  );
}
