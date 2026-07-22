import type { CSSProperties, RefObject } from "react";

import {
  WORLD4_HALO_SPRITE,
  world4NodeAssetManifest,
} from "./world4AssetManifest";
import { WORLD4_NODE_ANCHORS, WORLD4_NODE_STACK } from "./world4Geometry";
import type { Station4NodeContent } from "./station4Content";
import { world4RuntimeAssets } from "./world4RuntimeAssets";
import { World4NodeFx, type World4NodeFxPhase } from "./World4NodeFx";

export type World4NodeVisualState =
  | "locked"
  | "available"
  | "active"
  | "completed";

type World4NodeAnchor = (typeof WORLD4_NODE_ANCHORS)[number];

type World4NodeStackProps = {
  allowCompletedActivation: boolean;
  anchor: World4NodeAnchor;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  fxActive: boolean;
  fxPhase: World4NodeFxPhase;
  fxRunId: number;
  index: number;
  entryInvitation: boolean;
  inputLocked: boolean;
  node: Station4NodeContent;
  onActivate: (index: number) => void;
  reducedMotion: boolean;
  state: World4NodeVisualState;
};

const nodeStateLabel: Record<World4NodeVisualState, string> = {
  locked: "Bloqueado",
  available: "Disponible",
  active: "Activo",
  completed: "Completado",
};

function haloCellForState(state: World4NodeVisualState) {
  if (state === "locked") {
    return null;
  }
  return WORLD4_HALO_SPRITE.cells[state];
}

export function World4NodeStack({
  allowCompletedActivation,
  anchor,
  buttonRef,
  fxActive,
  fxPhase,
  fxRunId,
  index,
  entryInvitation,
  inputLocked,
  node,
  onActivate,
  reducedMotion,
  state,
}: World4NodeStackProps) {
  const object = world4NodeAssetManifest[node.id];
  const [alphaLeft, , alphaRight, alphaBottom] = object.alphaBounds;
  const visibleCenterX = (alphaLeft + alphaRight) / 2 / object.canvas.width;
  const visibleBaselineY = alphaBottom / object.canvas.height;
  const invitationHalo = entryInvitation && state === "locked";
  const haloCell = invitationHalo
    ? WORLD4_HALO_SPRITE.cells.available
    : haloCellForState(state);
  const haloPosition = haloCell === null ? "0%" : `${haloCell * 50}%`;

  const style = {
    left: `${anchor.xPercent}%`,
    top: `${anchor.yPercent}%`,
    "--s4-object-width": `${
      (object.fullCanvasWidth / WORLD4_NODE_STACK.haloFullCanvasWidth) * 100
    }%`,
    "--s4-object-shift-x": `${visibleCenterX * -100}%`,
    "--s4-object-shift-y": `${visibleBaselineY * -100}%`,
    "--s4-node-index": index,
  } as CSSProperties;

  return (
    <div
      className={`s4-node-stack s4-node-stack--${state}`}
      data-anchor-x={anchor.x}
      data-anchor-x-normalized={(anchor.x / 1536).toFixed(9)}
      data-anchor-y={anchor.y}
      data-anchor-y-normalized={(anchor.y / 1024).toFixed(9)}
      data-active-fx={fxActive ? node.id : "none"}
      data-node-order={node.order}
      data-node-input-locked={inputLocked}
      data-stack-state={state}
      data-object-alpha-bbox={object.alphaBounds.join(",")}
      data-object-full-canvas-width={object.fullCanvasWidth}
      data-station4-stack={node.id}
      style={style}
    >
      {haloCell !== null ? (
        <span
          aria-hidden="true"
          className={
            invitationHalo
              ? "s4-node-stack__halo s4-node-stack__halo--entry-invitation"
              : "s4-node-stack__halo"
          }
          data-entry-invitation={invitationHalo}
          data-halo-cell={haloCell}
          data-local-layer="z0"
          data-runtime-asset={WORLD4_HALO_SPRITE.asset}
          data-stage-layer="z8"
          style={{ backgroundPosition: `${haloPosition} 0%` }}
        />
      ) : null}

      <img
        alt=""
        aria-hidden="true"
        className="s4-node-stack__pedestal"
        data-local-layer="z1"
        data-runtime-asset={world4RuntimeAssets.nodes.pedestal}
        data-stage-layer="z9"
        draggable={false}
        src={world4RuntimeAssets.nodes.pedestal}
      />

      <img
        alt=""
        aria-hidden="true"
        className="s4-node-stack__object"
        data-alpha-aware="visible-bottom-center"
        data-local-layer="z2"
        data-runtime-asset={object.asset}
        data-stage-layer="z10"
        draggable={false}
        src={object.asset}
      />

      {fxActive ? (
        <World4NodeFx
          active
          nodeId={node.id}
          phase={fxPhase}
          reducedMotion={reducedMotion}
          runId={fxRunId}
        />
      ) : null}

      <button
        aria-current={state === "active" ? "step" : undefined}
        aria-describedby={`s4-node-state-${node.id}`}
        aria-disabled={
          state === "locked" ||
          inputLocked ||
          (state === "completed" && !allowCompletedActivation)
        }
        aria-label={node.accessibleLabel}
        className="s4-node-stack__hit"
        data-hit-target-min={WORLD4_NODE_STACK.minimumHitTargetCssPx}
        data-local-layer="z3"
        data-node-state={state}
        data-station4-node={node.id}
        onClick={() => onActivate(index)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onActivate(index);
          }
        }}
        ref={buttonRef}
        type="button"
      >
        <span className="s4-sr-only" id={`s4-node-state-${node.id}`}>
          {nodeStateLabel[state]}.
        </span>
      </button>

      <span aria-hidden="true" className="s4-node-stack__number">
        {node.order}
      </span>

      {state === "completed" ? (
        <span
          aria-hidden="true"
          className="s4-node-stack__completed-mark"
          data-station4-completed-mark={node.id}
        >
          ✓
        </span>
      ) : null}
    </div>
  );
}
