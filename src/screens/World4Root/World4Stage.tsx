import type { RefObject } from "react";

import { WORLD4_NODE_ANCHORS, WORLD4_Z_ORDER } from "./world4Geometry";
import { WORLD4_RUNTIME_LAYER_DECISIONS } from "./world4AssetManifest";
import { World4NodeStack, type World4NodeVisualState } from "./World4NodeStack";
import type { World4NodeFxPhase } from "./World4NodeFx";
import { station4Nodes, type Station4NodeContent } from "./station4Content";
import { world4RuntimeAssets } from "./world4RuntimeAssets";
import {
  World4AmbientLayer,
  type World4AmbientDensity,
} from "./World4AmbientLayer";
import { World4LiaGuide, type World4LiaGuideMode } from "./World4LiaGuide";
import { World4RoutePulse } from "./World4RoutePulse";
import type { World4VisualPhase } from "./world4MotionTokens";

type World4StageProps = {
  activeIndex: number;
  ambientDensity: World4AmbientDensity;
  chainComplete: boolean;
  firstPassEntry: boolean;
  inputLocked: boolean;
  motionEpoch: number;
  motionNodeIndex: number | null;
  nodeStates: readonly World4NodeVisualState[];
  onNodeActivate: (index: number) => void;
  progress: number;
  reducedMotion: boolean;
  revisitActive: boolean;
  tapHintAnchorRef: RefObject<HTMLButtonElement | null>;
  visualPhase: World4VisualPhase;
};

type StageLayerProps = {
  className: string;
  layer: number;
  name: string;
  src: string;
};

function StageLayer({ className, layer, name, src }: StageLayerProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      data-runtime-asset={src}
      data-stage-layer={`z${layer}`}
      data-stage-layer-name={name}
      draggable={false}
      src={src}
    />
  );
}

export function World4Stage({
  activeIndex,
  ambientDensity,
  chainComplete,
  firstPassEntry,
  inputLocked,
  motionEpoch,
  motionNodeIndex,
  nodeStates,
  onNodeActivate,
  progress,
  reducedMotion,
  revisitActive,
  tapHintAnchorRef,
  visualPhase,
}: World4StageProps) {
  const transferActive =
    motionNodeIndex !== null &&
    ["route_transfer", "node_arrival", "node_active", "node_settle"].includes(
      visualPhase,
    );
  const fxActive =
    motionNodeIndex !== null &&
    ["node_arrival", "node_active", "node_settle"].includes(visualPhase);
  const fxPhase: World4NodeFxPhase =
    visualPhase === "node_arrival"
      ? "arrival"
      : visualPhase === "node_settle"
        ? "settling"
        : fxActive
          ? "active"
          : "idle";
  const liaTravelActive =
    motionNodeIndex !== null &&
    [
      "lia_travel",
      "route_transfer",
      "node_arrival",
      "node_active",
      "node_settle",
    ].includes(visualPhase);
  const liaIndex = liaTravelActive ? motionNodeIndex : activeIndex;
  const liaMode: World4LiaGuideMode =
    visualPhase === "station_enter" ||
    (progress < 0 && motionNodeIndex === null)
      ? "entry"
      : visualPhase === "exiting" ||
          visualPhase === "chain_complete" ||
          visualPhase === "exit_reveal" ||
          (chainComplete && !revisitActive && motionNodeIndex === null)
        ? "closure"
        : "guide";

  return (
    <div
      aria-label="Mesa de sistema con la cadena técnica de ocho pasos"
      className="s4-stage"
      data-artboard-height="1024"
      data-artboard-width="1536"
      data-disabled-runtime-asset={world4RuntimeAssets.table.frontEdge}
      data-disabled-stage-layer="z5"
      data-front-edge-decision={WORLD4_RUNTIME_LAYER_DECISIONS.tableFrontEdge}
      data-rear-plane-decision={WORLD4_RUNTIME_LAYER_DECISIONS.rearDepthPlane}
      data-stage-aspect-ratio="3/2"
      role="group"
    >
      <StageLayer
        className="s4-stage__square-layer s4-stage__environment"
        layer={WORLD4_Z_ORDER.environment}
        name="environment"
        src={world4RuntimeAssets.environment.base}
      />
      <StageLayer
        className="s4-stage__square-layer s4-stage__rear-plane"
        layer={WORLD4_Z_ORDER.rearDepthPlane}
        name="rear-depth-plane"
        src={world4RuntimeAssets.environment.rearDepthPlane}
      />
      <StageLayer
        className="s4-stage__square-layer s4-stage__haze"
        layer={WORLD4_Z_ORDER.haze}
        name="haze"
        src={world4RuntimeAssets.environment.haze}
      />

      <World4AmbientLayer
        density={ambientDensity}
        reducedMotion={reducedMotion}
      />

      <div
        aria-hidden="true"
        className="s4-table-assembly"
        data-table-registration="shared-full-artboard"
      >
        <StageLayer
          className="s4-stage__full-layer s4-stage__table-shadow"
          layer={WORLD4_Z_ORDER.tableContactShadow}
          name="table-contact-shadow"
          src={world4RuntimeAssets.table.contactShadow}
        />
        <StageLayer
          className="s4-stage__full-layer s4-stage__table-lower"
          layer={WORLD4_Z_ORDER.tableLowerBase}
          name="table-lower-base"
          src={world4RuntimeAssets.table.lowerBase}
        />
        <StageLayer
          className="s4-stage__full-layer s4-stage__table-top"
          layer={WORLD4_Z_ORDER.tableTop}
          name="tabletop"
          src={world4RuntimeAssets.table.top}
        />
      </div>

      <StageLayer
        className="s4-stage__full-layer s4-stage__route"
        layer={WORLD4_Z_ORDER.passiveRoute}
        name="passive-route"
        src={world4RuntimeAssets.route.passive}
      />

      <World4RoutePulse
        chainComplete={chainComplete}
        chainSweepActive={visualPhase === "chain_complete"}
        completedNodeIndex={progress}
        reducedMotion={reducedMotion}
        runId={motionEpoch}
        targetNodeIndex={motionNodeIndex}
        transferActive={transferActive}
      />

      <span
        aria-hidden="true"
        className="s4-table-sweep"
        data-station4-table-sweep={
          (visualPhase === "station_enter" && firstPassEntry) ||
          visualPhase === "route_transfer"
            ? "active"
            : "idle"
        }
      />

      <div className="s4-node-chain" data-node-count={station4Nodes.length}>
        {station4Nodes.map((node: Station4NodeContent, index) => (
          <World4NodeStack
            allowCompletedActivation={chainComplete}
            anchor={WORLD4_NODE_ANCHORS[index]}
            buttonRef={index === 0 ? tapHintAnchorRef : undefined}
            fxActive={fxActive && motionNodeIndex === index}
            fxPhase={fxPhase}
            fxRunId={motionEpoch}
            index={index}
            entryInvitation={firstPassEntry && index === 0}
            inputLocked={inputLocked}
            key={node.id}
            node={node}
            onActivate={onNodeActivate}
            reducedMotion={reducedMotion}
            state={nodeStates[index]}
          />
        ))}
      </div>

      <World4LiaGuide
        active
        durationMs={
          visualPhase === "station_enter" && !firstPassEntry ? 180 : undefined
        }
        mode={liaMode}
        motionKey={motionEpoch}
        nodeId={station4Nodes[liaIndex].id}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
