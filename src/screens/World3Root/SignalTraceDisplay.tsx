import { useEffect, useState } from "react";

import { world3RuntimeAssets } from "./world3RuntimeAssets";

export type SignalTraceStage =
  | "entering"
  | "capturing"
  | "inspecting"
  | "evidence"
  | "summary"
  | "ready"
  | "confirmed"
  | "revisit";

export const SIGNAL_TRACE_REVEAL_MS = 2200;

export const SIGNAL_CAPTURE_TRACE_POINTS = [
  [0, 78], [20, 76], [40, 58], [60, 84], [80, 72], [100, 66], [120, 89],
  [140, 74], [160, 62], [180, 80], [200, 92], [220, 70], [240, 57],
  [260, 73], [280, 87], [300, 72], [320, 78],
] as const;

export const SIGNAL_INSPECTION_TRACE_POINTS = [
  [0, 78], [20, 76], [40, 58], [60, 84], [80, 72], [90, 69], [96, 82],
  [102, 61], [108, 88], [114, 64], [120, 91], [128, 76], [140, 74],
  [160, 62], [180, 80], [192, 94], [200, 119], [208, 104], [220, 70],
  [240, 57], [260, 73], [280, 87], [300, 72], [320, 78],
] as const;

export const SIGNAL_EVIDENCE_TRACE_POINTS = SIGNAL_INSPECTION_TRACE_POINTS;

type SignalTraceDisplayProps = {
  stage: SignalTraceStage;
  reducedMotion: boolean;
};

function tracePoints(stage: SignalTraceStage) {
  if (stage === "capturing" || stage === "entering") {
    return SIGNAL_CAPTURE_TRACE_POINTS;
  }
  if (stage === "inspecting") {
    return SIGNAL_INSPECTION_TRACE_POINTS;
  }
  return SIGNAL_EVIDENCE_TRACE_POINTS;
}

function asPolylinePoints(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export function SignalTraceDisplay({
  stage,
  reducedMotion,
}: SignalTraceDisplayProps) {
  const revealApplies = stage === "capturing" && !reducedMotion;
  const [revealComplete, setRevealComplete] = useState(!revealApplies);
  const frozen = ["evidence", "summary", "ready", "confirmed", "revisit"].includes(
    stage,
  );
  const inspectionVisible = stage === "inspecting" || frozen;
  const cursorState = frozen
    ? "stopped"
    : reducedMotion
      ? "stopped"
      : stage === "entering"
        ? "idle"
        : "scanning";
  const regionState =
    stage === "inspecting"
      ? "noise,amplitude-limit"
      : frozen
        ? "noise,drop,limit"
        : "none";

  useEffect(() => {
    if (!revealApplies) {
      setRevealComplete(true);
      return undefined;
    }
    setRevealComplete(false);
    const timeout = window.setTimeout(
      () => setRevealComplete(true),
      SIGNAL_TRACE_REVEAL_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [revealApplies]);

  return (
    <div
      className="s3-signal-device"
      data-station3-signal-device="approved-runtime-asset"
      data-station3-signal-trace-stage={stage}
      data-station3-signal-trace-motion={reducedMotion ? "reduced" : "normal"}
      data-station3-signal-trace-reveal={
        revealComplete ? "complete" : "revealing-once"
      }
      data-station3-signal-trace-loop="absent"
      data-station3-signal-cursor={cursorState}
      data-station3-signal-cursor-motion={
        reducedMotion ? "static" : frozen ? "stopped" : "active-once"
      }
      data-station3-signal-region={
        stage === "inspecting" ? "noise" : frozen ? "evidence" : "none"
      }
      data-station3-signal-regions={regionState}
      data-station3-signal-evidence={frozen ? "frozen" : "collecting"}
      aria-hidden="true"
    >
      <img
        alt=""
        className="s3-signal-device__asset"
        decoding="async"
        draggable="false"
        loading="eager"
        src={world3RuntimeAssets.records.senal}
      />
      <div
        className="s3-signal-screen-viewport"
        data-station3-signal-screen-viewport="device-relative"
      >
        <svg
          className="s3-signal-trace"
          data-station3-signal-svg="deterministic"
          viewBox="0 0 320 150"
          preserveAspectRatio="none"
          shapeRendering="crispEdges"
          focusable="false"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="s3-signal-trace-reveal" clipPathUnits="userSpaceOnUse">
              <rect
                className="s3-signal-trace__reveal"
                data-station3-signal-reveal-mask={
                  revealComplete ? "complete" : "active-once"
                }
                x="0"
                y="0"
                width="320"
                height="150"
              />
            </clipPath>
          </defs>
          <g className="s3-signal-trace__grid">
            {[32, 64, 96, 128].map((y) => (
              <line key={`y-${y}`} x1="0" y1={y} x2="320" y2={y} />
            ))}
            {[40, 80, 120, 160, 200, 240, 280].map((x) => (
              <line key={`x-${x}`} x1={x} y1="0" x2={x} y2="150" />
            ))}
          </g>
          <polyline
            className="s3-signal-trace__line"
            data-station3-signal-trace={
              stage === "capturing" || stage === "entering"
                ? "capturing"
                : stage === "inspecting"
                  ? "inspecting"
                  : "evidence"
            }
            clipPath="url(#s3-signal-trace-reveal)"
            points={asPolylinePoints(tracePoints(stage))}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
          {inspectionVisible ? (
            <g className="s3-signal-trace__regions">
              <rect
                className="s3-signal-region s3-signal-region--noise"
                data-station3-signal-region="noise"
                x="89"
                y="43"
                width="39"
                height="56"
              />
              {frozen ? (
                <rect
                  className="s3-signal-region s3-signal-region--drop"
                  data-station3-signal-region="drop"
                  x="187"
                  y="88"
                  width="26"
                  height="38"
                />
              ) : null}
              <rect
                className="s3-signal-region s3-signal-region--limit"
                data-station3-signal-region="limit"
                x="255"
                y="55"
                width="37"
                height="43"
              />
              <line className="s3-signal-bracket" x1="178" y1="53" x2="178" y2="120" />
              <line className="s3-signal-bracket" x1="173" y1="53" x2="184" y2="53" />
              <line className="s3-signal-bracket" x1="173" y1="120" x2="184" y2="120" />
              {[105, 199, 274].map((x, index) => (
                <rect
                  className="s3-signal-checkpoint"
                  data-station3-signal-checkpoint={index + 1}
                  key={x}
                  x={x - 2}
                  y={index === 1 ? 115 : 69}
                  width="4"
                  height="4"
                />
              ))}
            </g>
          ) : null}
          <line
            className="s3-signal-cursor"
            data-station3-signal-cursor-line={cursorState}
            x1={frozen ? "292" : "44"}
            y1="19"
            x2={frozen ? "292" : "44"}
            y2="132"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
