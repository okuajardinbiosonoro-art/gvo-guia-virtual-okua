import type { CSSProperties } from "react";

import { WORLD4_ARTBOARD, WORLD4_NODE_ANCHORS } from "./world4Geometry";

export type World4RoutePulseProps = {
  chainComplete: boolean;
  chainSweepActive?: boolean;
  completedNodeIndex: number;
  reducedMotion: boolean;
  runId?: number | string;
  targetNodeIndex: number | null;
  transferActive: boolean;
  transferDurationMs?: number;
};

type World4RouteSegment = {
  d: string;
  fromId: (typeof WORLD4_NODE_ANCHORS)[number]["id"];
  fromOrder: number;
  index: number;
  toId: (typeof WORLD4_NODE_ANCHORS)[number]["id"];
  toOrder: number;
};

function segmentPath(
  from: (typeof WORLD4_NODE_ANCHORS)[number],
  to: (typeof WORLD4_NODE_ANCHORS)[number],
) {
  const deltaX = to.x - from.x;
  return [
    `M ${from.x} ${from.y}`,
    `C ${from.x + deltaX * 0.34} ${from.y}`,
    `${to.x - deltaX * 0.34} ${to.y}`,
    `${to.x} ${to.y}`,
  ].join(" ");
}

export const WORLD4_ROUTE_SEGMENTS: readonly World4RouteSegment[] =
  WORLD4_NODE_ANCHORS.slice(0, -1).map((from, index) => {
    const to = WORLD4_NODE_ANCHORS[index + 1];
    return {
      d: segmentPath(from, to),
      fromId: from.id,
      fromOrder: from.order,
      index,
      toId: to.id,
      toOrder: to.order,
    };
  });

export const WORLD4_ROUTE_CHAIN_PATH = WORLD4_ROUTE_SEGMENTS.map(
  (segment, index) =>
    index === 0 ? segment.d : segment.d.replace(/^M [^C]+/, ""),
)
  .join(" ")
  .trim();

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 7,
  width: "100%",
  height: "100%",
  overflow: "visible",
  pointerEvents: "none",
};

/**
 * Active route overlay. The approved passive PNG stays beneath this SVG; this
 * component owns only the seven semantic transfers and the node-1 local pulse.
 */
export function World4RoutePulse({
  chainComplete,
  chainSweepActive = chainComplete,
  completedNodeIndex,
  reducedMotion,
  runId = 0,
  targetNodeIndex,
  transferActive,
  transferDurationMs = 640,
}: World4RoutePulseProps) {
  const boundedCompletedNodeIndex = Math.max(
    0,
    Math.min(WORLD4_NODE_ANCHORS.length - 1, completedNodeIndex),
  );
  const boundedTargetNodeIndex =
    targetNodeIndex === null
      ? null
      : Math.max(0, Math.min(WORLD4_NODE_ANCHORS.length - 1, targetNodeIndex));
  const activeSegmentIndex =
    transferActive &&
    boundedTargetNodeIndex !== null &&
    boundedTargetNodeIndex > 0
      ? boundedTargetNodeIndex - 1
      : null;
  const nodeOnePulseActive = transferActive && boundedTargetNodeIndex === 0;
  const completedSegmentCount = chainComplete
    ? WORLD4_ROUTE_SEGMENTS.length
    : boundedCompletedNodeIndex;
  const transferDuration = Math.max(520, Math.min(760, transferDurationMs));

  return (
    <svg
      aria-hidden="true"
      className="s4-route-pulse"
      data-world4-route-active-segment={
        activeSegmentIndex === null ? "none" : activeSegmentIndex + 1
      }
      data-world4-route-chain-complete={chainComplete}
      data-world4-route-chain-sweep={chainSweepActive}
      data-world4-route-completed-count={completedSegmentCount}
      data-world4-route-local-pulse={nodeOnePulseActive}
      data-world4-route-overlay="018d"
      data-world4-route-reduced-motion={reducedMotion}
      data-world4-route-run={runId}
      data-world4-route-segment-count={WORLD4_ROUTE_SEGMENTS.length}
      focusable="false"
      pointerEvents="none"
      preserveAspectRatio="xMidYMid meet"
      style={overlayStyle}
      viewBox={`0 0 ${WORLD4_ARTBOARD.width} ${WORLD4_ARTBOARD.height}`}
    >
      <g
        className="s4-route-pulse__completed"
        data-world4-route-layer="completed"
        fill="none"
        pointerEvents="none"
        stroke="#a7a8cf"
        strokeLinecap="round"
        strokeWidth="4"
      >
        {WORLD4_ROUTE_SEGMENTS.map((segment) => {
          const completed = segment.index < completedSegmentCount;
          return (
            <path
              className="s4-route-pulse__segment"
              d={segment.d}
              data-world4-route-segment={segment.index + 1}
              data-world4-route-segment-from={segment.fromId}
              data-world4-route-segment-state={
                completed
                  ? "completed"
                  : activeSegmentIndex === segment.index
                    ? "active"
                    : "idle"
              }
              data-world4-route-segment-to={segment.toId}
              key={`${segment.fromId}-${segment.toId}`}
              opacity={completed ? 0.28 : 0}
            />
          );
        })}
      </g>

      {activeSegmentIndex === null ? null : (
        <g
          className="s4-route-pulse__transfer"
          data-world4-route-transfer="active"
          fill="none"
          pointerEvents="none"
        >
          <path
            className="s4-route-pulse__active-segment"
            d={WORLD4_ROUTE_SEGMENTS[activeSegmentIndex].d}
            data-world4-route-active-path={activeSegmentIndex + 1}
            opacity="0.76"
            stroke="#c8c7ff"
            strokeLinecap="round"
            strokeWidth="4"
          />
          {reducedMotion ? null : (
            <circle
              className="s4-route-pulse__traveler"
              data-world4-route-traveler={activeSegmentIndex + 1}
              fill="#fff4da"
              r="4"
              stroke="#b8ddff"
              strokeWidth="2"
            >
              <animateMotion
                begin="0s"
                dur={`${transferDuration}ms`}
                fill="freeze"
                path={WORLD4_ROUTE_SEGMENTS[activeSegmentIndex].d}
                repeatCount="1"
              />
            </circle>
          )}
        </g>
      )}

      {nodeOnePulseActive ? (
        <g
          className="s4-route-pulse__node-one"
          data-world4-route-node1-pulse={reducedMotion ? "static" : "active"}
          pointerEvents="none"
        >
          <circle
            cx={WORLD4_NODE_ANCHORS[0].x}
            cy={WORLD4_NODE_ANCHORS[0].y}
            fill="none"
            opacity={reducedMotion ? 0.62 : 0.78}
            r="8"
            stroke="#c8c7ff"
            strokeWidth="3"
          >
            {reducedMotion ? null : (
              <>
                <animate
                  attributeName="r"
                  begin="0s"
                  dur={`${transferDuration}ms`}
                  fill="freeze"
                  from="4"
                  to="9"
                />
                <animate
                  attributeName="opacity"
                  begin="0s"
                  dur={`${transferDuration}ms`}
                  fill="freeze"
                  from="0.82"
                  to="0.2"
                />
              </>
            )}
          </circle>
        </g>
      ) : null}

      {chainSweepActive ? (
        <path
          className="s4-route-pulse__chain-sweep"
          d={WORLD4_ROUTE_CHAIN_PATH}
          data-world4-route-chain-sweep-path="left-to-right-once"
          fill="none"
          opacity={reducedMotion ? 0.36 : 0.68}
          pathLength="1"
          stroke="#d6d4ff"
          strokeDasharray="1"
          strokeDashoffset={reducedMotion ? 0 : 1}
          strokeLinecap="round"
          strokeWidth="5"
        >
          {reducedMotion ? null : (
            <animate
              attributeName="stroke-dashoffset"
              begin="0s"
              dur="920ms"
              fill="freeze"
              from="1"
              to="0"
            />
          )}
        </path>
      ) : null}
    </svg>
  );
}
