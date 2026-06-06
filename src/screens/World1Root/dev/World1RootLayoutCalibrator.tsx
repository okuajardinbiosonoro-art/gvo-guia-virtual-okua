import "./World1RootLayoutCalibrator.css";

import type { CSSProperties, ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { world1RootAssets } from "../world1RootAssets";

type VisualState =
  | "base_intro"
  | "relation_active"
  | "perception_preview"
  | "mediation_preview"
  | "all_roots_reference";

type NodeState = "locked" | "available" | "active" | "completed";

type NodeId = "relation" | "perception" | "mediation";

type LiaPose =
  | "idle"
  | "pointRelation"
  | "lookPerception"
  | "guideMediation"
  | "readyContinue"
  | "exit"
  | "teleportOut"
  | "teleportInRelation"
  | "teleportInPerception"
  | "teleportInMediation";

type ActiveRootId = "relation" | "perception" | "mediation";

type LayoutValues = {
  stageScale: number;
  stageOffsetY: number;
  plantX: number;
  plantY: number;
  plantWidth: number;
  plantAnchorX: number;
  plantAnchorY: number;
  rootOriginX: number;
  rootOriginY: number;
  rootsTop: number;
  rootsWidth: number;
  activeRelationX: number;
  activeRelationY: number;
  activeRelationWidth: number;
  activeRelationOpacity: number;
  activePerceptionX: number;
  activePerceptionY: number;
  activePerceptionWidth: number;
  activePerceptionOpacity: number;
  activeMediationX: number;
  activeMediationY: number;
  activeMediationWidth: number;
  activeMediationOpacity: number;
  nodeRelationX: number;
  nodeRelationY: number;
  nodeRelationScale: number;
  nodePerceptionX: number;
  nodePerceptionY: number;
  nodePerceptionScale: number;
  nodeMediationX: number;
  nodeMediationY: number;
  nodeMediationScale: number;
  liaIdleX: number;
  liaIdleY: number;
  liaIdleWidth: number;
  liaPointRelationX: number;
  liaPointRelationY: number;
  liaPointRelationWidth: number;
  liaLookPerceptionX: number;
  liaLookPerceptionY: number;
  liaLookPerceptionWidth: number;
  liaGuideMediationX: number;
  liaGuideMediationY: number;
  liaGuideMediationWidth: number;
  liaReadyContinueX: number;
  liaReadyContinueY: number;
  liaReadyContinueWidth: number;
  liaExitX: number;
  liaExitY: number;
  liaExitWidth: number;
  liaTeleportOutX: number;
  liaTeleportOutY: number;
  liaTeleportOutWidth: number;
  liaTeleportInRelationX: number;
  liaTeleportInRelationY: number;
  liaTeleportInRelationWidth: number;
  liaTeleportInPerceptionX: number;
  liaTeleportInPerceptionY: number;
  liaTeleportInPerceptionWidth: number;
  liaTeleportInMediationX: number;
  liaTeleportInMediationY: number;
  liaTeleportInMediationWidth: number;
  dialogPanelY: number;
  dialogPanelHeight: number;
  dialogPanelOpacity: number;
  dialogTextScale: number;
};

type ToggleValues = {
  showBackground: boolean;
  showAmbientLight: boolean;
  showPlant: boolean;
  showRoots: boolean;
  showNodes: boolean;
  showLia: boolean;
  showActiveRelation: boolean;
  showActivePerception: boolean;
  showActiveMediation: boolean;
  showSafeArea: boolean;
  showMobileFrame: boolean;
  showTextBlock: boolean;
  showDialoguePanel: boolean;
  showContinueButton: boolean;
  showIntroCopy: boolean;
  showRelationCopy: boolean;
  showGuides: boolean;
  showGrid: boolean;
  showStageCenter: boolean;
  showRootOrigin: boolean;
  showPlantAnchor: boolean;
  showNodeAnchors: boolean;
  showLiaBounds: boolean;
  showRootBounds: boolean;
  showActiveRootBounds: boolean;
  showTextSafeZone: boolean;
};

type NodeStateMap = Record<NodeId, NodeState>;

type CalibratorPreset = {
  visualState: VisualState;
  values: LayoutValues;
  toggles: ToggleValues;
  nodeStates: NodeStateMap;
};

type SavedPresetMap = Record<string, CalibratorPreset>;

type CalibratorStyle = CSSProperties & Record<`--${string}`, string | number>;

const LOCAL_STORAGE_KEY = "gvo-dev-world1-layout-calibrator-v2";

const visualStates: ReadonlyArray<{
  id: VisualState;
  label: string;
  description: string;
}> = [
  {
    id: "base_intro",
    label: "base_intro",
    description: "Estado inicial sin raiz activa.",
  },
  {
    id: "relation_active",
    label: "relation_active",
    description: "RELACION activa con Lia apuntando.",
  },
  {
    id: "perception_preview",
    label: "perception_preview",
    description: "Preview dev de PERCEPCION, sin runtime.",
  },
  {
    id: "mediation_preview",
    label: "mediation_preview",
    description: "Preview dev de MEDIACION, sin runtime.",
  },
  {
    id: "all_roots_reference",
    label: "all_roots_reference",
    description: "Referencia diagnostica con raices superpuestas.",
  },
];

const activeRootSpecs: ReadonlyArray<{
  id: ActiveRootId;
  label: string;
  asset: string;
  xKey: keyof LayoutValues;
  yKey: keyof LayoutValues;
  widthKey: keyof LayoutValues;
  opacityKey: keyof LayoutValues;
  toggleKey: keyof ToggleValues;
}> = [
  {
    id: "relation",
    label: "RELACION",
    asset: world1RootAssets.activeRelation,
    xKey: "activeRelationX",
    yKey: "activeRelationY",
    widthKey: "activeRelationWidth",
    opacityKey: "activeRelationOpacity",
    toggleKey: "showActiveRelation",
  },
  {
    id: "perception",
    label: "PERCEPCION",
    asset: world1RootAssets.activePerception,
    xKey: "activePerceptionX",
    yKey: "activePerceptionY",
    widthKey: "activePerceptionWidth",
    opacityKey: "activePerceptionOpacity",
    toggleKey: "showActivePerception",
  },
  {
    id: "mediation",
    label: "MEDIACION",
    asset: world1RootAssets.activeMediation,
    xKey: "activeMediationX",
    yKey: "activeMediationY",
    widthKey: "activeMediationWidth",
    opacityKey: "activeMediationOpacity",
    toggleKey: "showActiveMediation",
  },
];

const nodeSpecs: ReadonlyArray<{
  id: NodeId;
  label: string;
  xKey: keyof LayoutValues;
  yKey: keyof LayoutValues;
  scaleKey: keyof LayoutValues;
}> = [
  {
    id: "relation",
    label: "RELACION",
    xKey: "nodeRelationX",
    yKey: "nodeRelationY",
    scaleKey: "nodeRelationScale",
  },
  {
    id: "perception",
    label: "PERCEPCION",
    xKey: "nodePerceptionX",
    yKey: "nodePerceptionY",
    scaleKey: "nodePerceptionScale",
  },
  {
    id: "mediation",
    label: "MEDIACION",
    xKey: "nodeMediationX",
    yKey: "nodeMediationY",
    scaleKey: "nodeMediationScale",
  },
];

const liaPoseSpecs: ReadonlyArray<{
  id: LiaPose;
  label: string;
  asset: string;
  xKey: keyof LayoutValues;
  yKey: keyof LayoutValues;
  widthKey: keyof LayoutValues;
}> = [
  {
    id: "idle",
    label: "idle",
    asset: world1RootAssets.liaIdle,
    xKey: "liaIdleX",
    yKey: "liaIdleY",
    widthKey: "liaIdleWidth",
  },
  {
    id: "pointRelation",
    label: "point relation",
    asset: world1RootAssets.liaPointRelation,
    xKey: "liaPointRelationX",
    yKey: "liaPointRelationY",
    widthKey: "liaPointRelationWidth",
  },
  {
    id: "lookPerception",
    label: "look perception",
    asset: world1RootAssets.liaLookPerception,
    xKey: "liaLookPerceptionX",
    yKey: "liaLookPerceptionY",
    widthKey: "liaLookPerceptionWidth",
  },
  {
    id: "guideMediation",
    label: "guide mediation",
    asset: world1RootAssets.liaGuideMediation,
    xKey: "liaGuideMediationX",
    yKey: "liaGuideMediationY",
    widthKey: "liaGuideMediationWidth",
  },
  {
    id: "readyContinue",
    label: "ready continue",
    asset: world1RootAssets.liaReadyContinue,
    xKey: "liaReadyContinueX",
    yKey: "liaReadyContinueY",
    widthKey: "liaReadyContinueWidth",
  },
  {
    id: "exit",
    label: "exit",
    asset: world1RootAssets.liaExit,
    xKey: "liaExitX",
    yKey: "liaExitY",
    widthKey: "liaExitWidth",
  },
  {
    id: "teleportOut",
    label: "teleport out",
    asset: world1RootAssets.liaTeleportOut,
    xKey: "liaTeleportOutX",
    yKey: "liaTeleportOutY",
    widthKey: "liaTeleportOutWidth",
  },
  {
    id: "teleportInRelation",
    label: "teleport in relation",
    asset: world1RootAssets.liaTeleportInRelation,
    xKey: "liaTeleportInRelationX",
    yKey: "liaTeleportInRelationY",
    widthKey: "liaTeleportInRelationWidth",
  },
  {
    id: "teleportInPerception",
    label: "teleport in perception",
    asset: world1RootAssets.liaTeleportInPerception,
    xKey: "liaTeleportInPerceptionX",
    yKey: "liaTeleportInPerceptionY",
    widthKey: "liaTeleportInPerceptionWidth",
  },
  {
    id: "teleportInMediation",
    label: "teleport in mediation",
    asset: world1RootAssets.liaTeleportInMediation,
    xKey: "liaTeleportInMediationX",
    yKey: "liaTeleportInMediationY",
    widthKey: "liaTeleportInMediationWidth",
  },
];

const nodeStateOptions: ReadonlyArray<NodeState> = [
  "locked",
  "available",
  "active",
  "completed",
];

const defaultValues: LayoutValues = {
  stageScale: 1,
  stageOffsetY: 0,
  plantX: 50.5,
  plantY: 33.5,
  plantWidth: 40,
  plantAnchorX: 56.9,
  plantAnchorY: 93.2,
  rootOriginX: 50.8,
  rootOriginY: 35.9,
  rootsTop: 20.3,
  rootsWidth: 100,
  activeRelationX: 50,
  activeRelationY: 50,
  activeRelationWidth: 100,
  activeRelationOpacity: 0.92,
  activePerceptionX: 50,
  activePerceptionY: 50,
  activePerceptionWidth: 100,
  activePerceptionOpacity: 0.72,
  activeMediationX: 50,
  activeMediationY: 50,
  activeMediationWidth: 100,
  activeMediationOpacity: 0.72,
  nodeRelationX: 8,
  nodeRelationY: 62,
  nodeRelationScale: 1,
  nodePerceptionX: 50,
  nodePerceptionY: 60,
  nodePerceptionScale: 1,
  nodeMediationX: 92,
  nodeMediationY: 62,
  nodeMediationScale: 1,
  liaIdleX: 78,
  liaIdleY: 12.5,
  liaIdleWidth: 25,
  liaPointRelationX: 78,
  liaPointRelationY: 12.5,
  liaPointRelationWidth: 25,
  liaLookPerceptionX: 76,
  liaLookPerceptionY: 12.5,
  liaLookPerceptionWidth: 25,
  liaGuideMediationX: 77,
  liaGuideMediationY: 12.5,
  liaGuideMediationWidth: 25,
  liaReadyContinueX: 78,
  liaReadyContinueY: 12.5,
  liaReadyContinueWidth: 25,
  liaExitX: 78,
  liaExitY: 12.5,
  liaExitWidth: 25,
  liaTeleportOutX: 78,
  liaTeleportOutY: 12.5,
  liaTeleportOutWidth: 25,
  liaTeleportInRelationX: 78,
  liaTeleportInRelationY: 12.5,
  liaTeleportInRelationWidth: 25,
  liaTeleportInPerceptionX: 76,
  liaTeleportInPerceptionY: 12.5,
  liaTeleportInPerceptionWidth: 25,
  liaTeleportInMediationX: 77,
  liaTeleportInMediationY: 12.5,
  liaTeleportInMediationWidth: 25,
  dialogPanelY: 48,
  dialogPanelHeight: 18,
  dialogPanelOpacity: 0.86,
  dialogTextScale: 1,
};

const defaultToggles: ToggleValues = {
  showBackground: true,
  showAmbientLight: true,
  showPlant: true,
  showRoots: true,
  showNodes: true,
  showLia: true,
  showActiveRelation: true,
  showActivePerception: true,
  showActiveMediation: true,
  showSafeArea: true,
  showMobileFrame: true,
  showTextBlock: true,
  showDialoguePanel: true,
  showContinueButton: true,
  showIntroCopy: true,
  showRelationCopy: true,
  showGuides: true,
  showGrid: false,
  showStageCenter: true,
  showRootOrigin: true,
  showPlantAnchor: true,
  showNodeAnchors: true,
  showLiaBounds: true,
  showRootBounds: true,
  showActiveRootBounds: true,
  showTextSafeZone: true,
};

const baseNodeStates: NodeStateMap = {
  relation: "available",
  perception: "locked",
  mediation: "locked",
};

const presetValues: Record<
  "current-runtime" | "relation-active-current" | "recommended-start" | "compact-360" | "wide-430",
  CalibratorPreset
> = {
  "current-runtime": {
    visualState: "base_intro",
    values: defaultValues,
    toggles: defaultToggles,
    nodeStates: baseNodeStates,
  },
  "relation-active-current": {
    visualState: "relation_active",
    values: {
      ...defaultValues,
      activeRelationOpacity: 1,
      nodeRelationScale: 1.06,
      liaPointRelationX: 78,
      liaPointRelationY: 12.5,
    },
    toggles: defaultToggles,
    nodeStates: {
      relation: "active",
      perception: "locked",
      mediation: "locked",
    },
  },
  "recommended-start": {
    visualState: "relation_active",
    values: {
      ...defaultValues,
      stageScale: 0.98,
      activeRelationX: 50,
      activeRelationY: 50,
      activeRelationWidth: 98,
      nodeRelationScale: 1.08,
      dialogPanelOpacity: 0.8,
    },
    toggles: defaultToggles,
    nodeStates: {
      relation: "active",
      perception: "locked",
      mediation: "locked",
    },
  },
  "compact-360": {
    visualState: "relation_active",
    values: {
      ...defaultValues,
      stageScale: 0.96,
      plantWidth: 39,
      nodeRelationX: 6,
      nodePerceptionY: 58,
      nodeMediationX: 94,
      liaPointRelationX: 77,
      liaPointRelationWidth: 24,
      dialogPanelY: 47,
      dialogPanelHeight: 19,
    },
    toggles: defaultToggles,
    nodeStates: {
      relation: "active",
      perception: "locked",
      mediation: "locked",
    },
  },
  "wide-430": {
    visualState: "all_roots_reference",
    values: {
      ...defaultValues,
      stageScale: 1,
      activeRelationOpacity: 0.68,
      activePerceptionOpacity: 0.62,
      activeMediationOpacity: 0.62,
      liaReadyContinueX: 78,
    },
    toggles: defaultToggles,
    nodeStates: {
      relation: "completed",
      perception: "active",
      mediation: "available",
    },
  },
};

const controlGroups: ReadonlyArray<{
  title: string;
  controls: ReadonlyArray<{
    key: keyof LayoutValues;
    label: string;
    min: number;
    max: number;
    step: number;
  }>;
}> = [
  {
    title: "Escena / Stage",
    controls: [
      { key: "stageScale", label: "stageScale", min: 0.86, max: 1.08, step: 0.01 },
      { key: "stageOffsetY", label: "stageOffsetY", min: -80, max: 80, step: 1 },
    ],
  },
  {
    title: "Planta y raiz base",
    controls: [
      { key: "plantX", label: "plantX", min: 35, max: 65, step: 0.1 },
      { key: "plantY", label: "plantY", min: 20, max: 45, step: 0.1 },
      { key: "plantWidth", label: "plantWidth", min: 25, max: 56, step: 0.1 },
      { key: "plantAnchorX", label: "plantAnchorX", min: 40, max: 70, step: 0.1 },
      { key: "plantAnchorY", label: "plantAnchorY", min: 75, max: 100, step: 0.1 },
      { key: "rootOriginX", label: "rootOriginX", min: 42, max: 58, step: 0.1 },
      { key: "rootOriginY", label: "rootOriginY", min: 25, max: 45, step: 0.1 },
      { key: "rootsTop", label: "rootsTop", min: 10, max: 32, step: 0.1 },
      { key: "rootsWidth", label: "rootsWidth", min: 82, max: 116, step: 0.1 },
    ],
  },
  {
    title: "Raices activas",
    controls: [
      { key: "activeRelationX", label: "activeRelationX", min: 35, max: 65, step: 0.1 },
      { key: "activeRelationY", label: "activeRelationY", min: 35, max: 65, step: 0.1 },
      { key: "activeRelationWidth", label: "activeRelationWidth", min: 70, max: 115, step: 0.1 },
      { key: "activeRelationOpacity", label: "activeRelationOpacity", min: 0, max: 1, step: 0.01 },
      { key: "activePerceptionX", label: "activePerceptionX", min: 35, max: 65, step: 0.1 },
      { key: "activePerceptionY", label: "activePerceptionY", min: 35, max: 65, step: 0.1 },
      { key: "activePerceptionWidth", label: "activePerceptionWidth", min: 70, max: 115, step: 0.1 },
      { key: "activePerceptionOpacity", label: "activePerceptionOpacity", min: 0, max: 1, step: 0.01 },
      { key: "activeMediationX", label: "activeMediationX", min: 35, max: 65, step: 0.1 },
      { key: "activeMediationY", label: "activeMediationY", min: 35, max: 65, step: 0.1 },
      { key: "activeMediationWidth", label: "activeMediationWidth", min: 70, max: 115, step: 0.1 },
      { key: "activeMediationOpacity", label: "activeMediationOpacity", min: 0, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Nodos",
    controls: [
      { key: "nodeRelationX", label: "nodeRelationX", min: 0, max: 24, step: 0.1 },
      { key: "nodeRelationY", label: "nodeRelationY", min: 48, max: 74, step: 0.1 },
      { key: "nodeRelationScale", label: "nodeRelationScale", min: 0.72, max: 1.22, step: 0.01 },
      { key: "nodePerceptionX", label: "nodePerceptionX", min: 35, max: 65, step: 0.1 },
      { key: "nodePerceptionY", label: "nodePerceptionY", min: 48, max: 74, step: 0.1 },
      { key: "nodePerceptionScale", label: "nodePerceptionScale", min: 0.72, max: 1.22, step: 0.01 },
      { key: "nodeMediationX", label: "nodeMediationX", min: 76, max: 100, step: 0.1 },
      { key: "nodeMediationY", label: "nodeMediationY", min: 48, max: 74, step: 0.1 },
      { key: "nodeMediationScale", label: "nodeMediationScale", min: 0.72, max: 1.22, step: 0.01 },
    ],
  },
  {
    title: "Lia",
    controls: liaPoseSpecs.flatMap((pose) => [
      { key: pose.xKey, label: pose.xKey, min: 50, max: 92, step: 0.1 },
      { key: pose.yKey, label: pose.yKey, min: 2, max: 34, step: 0.1 },
      { key: pose.widthKey, label: pose.widthKey, min: 15, max: 38, step: 0.1 },
    ]),
  },
  {
    title: "Dialogo / panel inferior",
    controls: [
      { key: "dialogPanelY", label: "dialogPanelY", min: 36, max: 64, step: 0.1 },
      { key: "dialogPanelHeight", label: "dialogPanelHeight", min: 10, max: 28, step: 0.1 },
      { key: "dialogPanelOpacity", label: "dialogPanelOpacity", min: 0, max: 1, step: 0.01 },
      { key: "dialogTextScale", label: "dialogTextScale", min: 0.8, max: 1.2, step: 0.01 },
    ],
  },
];

const stageToggleControls: ReadonlyArray<{ key: keyof ToggleValues; label: string }> = [
  { key: "showSafeArea", label: "safe area" },
  { key: "showMobileFrame", label: "mobile frame" },
  { key: "showTextBlock", label: "text block" },
  { key: "showDialoguePanel", label: "dialogue panel" },
  { key: "showContinueButton", label: "continue button" },
];

const layerToggleControls: ReadonlyArray<{ key: keyof ToggleValues; label: string }> = [
  { key: "showBackground", label: "background" },
  { key: "showAmbientLight", label: "ambient light" },
  { key: "showPlant", label: "plant" },
  { key: "showRoots", label: "base roots" },
  { key: "showNodes", label: "nodes" },
  { key: "showLia", label: "Lia" },
  { key: "showActiveRelation", label: "active relation" },
  { key: "showActivePerception", label: "active perception" },
  { key: "showActiveMediation", label: "active mediation" },
  { key: "showIntroCopy", label: "intro copy" },
  { key: "showRelationCopy", label: "relation copy" },
];

const guideToggleControls: ReadonlyArray<{ key: keyof ToggleValues; label: string }> = [
  { key: "showGuides", label: "guides" },
  { key: "showGrid", label: "grid" },
  { key: "showStageCenter", label: "stage center" },
  { key: "showRootOrigin", label: "root origin" },
  { key: "showPlantAnchor", label: "plant anchor" },
  { key: "showNodeAnchors", label: "node anchors" },
  { key: "showLiaBounds", label: "Lia bounds" },
  { key: "showRootBounds", label: "root bounds" },
  { key: "showActiveRootBounds", label: "active root bounds" },
  { key: "showTextSafeZone", label: "text safe zone" },
];

function format(value: number) {
  return Number(value.toFixed(2));
}

function formatCssValue(value: number, unit: "%" | "px" | "number" = "%") {
  const formatted = format(value);

  if (unit === "px") {
    return `${formatted}px`;
  }

  if (unit === "number") {
    return String(formatted);
  }

  return `${formatted}%`;
}

function readSavedPresets(): SavedPresetMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as SavedPresetMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistSavedPresets(presetsToSave: SavedPresetMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presetsToSave));
}

function defaultNodeStatesForState(state: VisualState): NodeStateMap {
  if (state === "relation_active") {
    return {
      relation: "active",
      perception: "locked",
      mediation: "locked",
    };
  }

  if (state === "perception_preview") {
    return {
      relation: "completed",
      perception: "active",
      mediation: "locked",
    };
  }

  if (state === "mediation_preview") {
    return {
      relation: "completed",
      perception: "completed",
      mediation: "active",
    };
  }

  if (state === "all_roots_reference") {
    return {
      relation: "completed",
      perception: "active",
      mediation: "available",
    };
  }

  return baseNodeStates;
}

function visibleActiveRootsForState(
  state: VisualState,
  toggles: ToggleValues,
): ReadonlyArray<ActiveRootId> {
  const activeRoots = activeRootSpecs
    .filter((root) => toggles[root.toggleKey])
    .map((root) => root.id);

  if (state === "relation_active") {
    return activeRoots.filter((root) => root === "relation");
  }

  if (state === "perception_preview") {
    return activeRoots.filter((root) => root === "perception");
  }

  if (state === "mediation_preview") {
    return activeRoots.filter((root) => root === "mediation");
  }

  if (state === "all_roots_reference") {
    return activeRoots;
  }

  return [];
}

function currentLiaPoseForState(state: VisualState): LiaPose {
  if (state === "relation_active") {
    return "pointRelation";
  }

  if (state === "perception_preview") {
    return "lookPerception";
  }

  if (state === "mediation_preview") {
    return "guideMediation";
  }

  if (state === "all_roots_reference") {
    return "readyContinue";
  }

  return "idle";
}

function makePresetSnapshot(
  visualState: VisualState,
  values: LayoutValues,
  toggles: ToggleValues,
  nodeStates: NodeStateMap,
): CalibratorPreset {
  return {
    visualState,
    values: { ...values },
    toggles: { ...toggles },
    nodeStates: { ...nodeStates },
  };
}

function readInitialState() {
  if (typeof window === "undefined") {
    return {
      visualState: "base_intro" as VisualState,
      values: defaultValues,
    };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedState = params.get("state") as VisualState | null;
  const visualState =
    requestedState && visualStates.some((state) => state.id === requestedState)
      ? requestedState
      : "base_intro";
  const values = { ...defaultValues };

  for (const key of Object.keys(values) as Array<keyof LayoutValues>) {
    const parsedValue = Number.parseFloat(params.get(key) ?? "");
    if (Number.isFinite(parsedValue)) {
      values[key] = parsedValue;
    }
  }

  return { visualState, values };
}

function useStageSize() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const update = () => {
      setSize({
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
    };

    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);

      return () => {
        window.removeEventListener("resize", update);
      };
    }

    const observer = new ResizeObserver(update);
    observer.observe(stage);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { stageRef, size };
}

function NumberControl({
  control,
  onChange,
  value,
}: {
  control: {
    key: keyof LayoutValues;
    label: string;
    min: number;
    max: number;
    step: number;
  };
  onChange: (key: keyof LayoutValues) => (event: ChangeEvent<HTMLInputElement>) => void;
  value: number;
}) {
  return (
    <label className="world1-calibrator__control">
      <span>{control.label}</span>
      <input
        aria-label={control.label}
        max={control.max}
        min={control.min}
        onChange={onChange(control.key)}
        step={control.step}
        type="range"
        value={value}
      />
      <input
        aria-label={`${control.label} value`}
        max={control.max}
        min={control.min}
        onChange={onChange(control.key)}
        step={control.step}
        type="number"
        value={value}
      />
    </label>
  );
}

export function World1RootLayoutCalibrator() {
  const initialState = useMemo(readInitialState, []);
  const [visualState, setVisualState] = useState<VisualState>(
    initialState.visualState,
  );
  const [values, setValues] = useState<LayoutValues>(initialState.values);
  const [toggles, setToggles] = useState<ToggleValues>(defaultToggles);
  const [nodeStates, setNodeStates] = useState<NodeStateMap>(() =>
    defaultNodeStatesForState(initialState.visualState),
  );
  const [savedPresets, setSavedPresets] =
    useState<SavedPresetMap>(readSavedPresets);
  const [selectedSavedPreset, setSelectedSavedPreset] = useState("");
  const [presetDraftName, setPresetDraftName] = useState("manual-calibration");
  const [importJson, setImportJson] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const { stageRef, size } = useStageSize();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams();
    params.set("state", visualState);
    for (const [key, value] of Object.entries(values)) {
      params.set(key, String(format(value)));
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [values, visualState]);

  const style = useMemo<CalibratorStyle>(
    () =>
      ({
        "--cal-stage-scale": formatCssValue(values.stageScale, "number"),
        "--cal-stage-offset-y": formatCssValue(values.stageOffsetY, "px"),
        "--cal-plant-x": formatCssValue(values.plantX),
        "--cal-plant-y": formatCssValue(values.plantY),
        "--cal-plant-width": formatCssValue(values.plantWidth),
        "--cal-plant-anchor-x": formatCssValue(values.plantAnchorX),
        "--cal-plant-anchor-y": formatCssValue(values.plantAnchorY),
        "--cal-root-origin-x": formatCssValue(values.rootOriginX),
        "--cal-root-origin-y": formatCssValue(values.rootOriginY),
        "--cal-roots-top": formatCssValue(values.rootsTop),
        "--cal-roots-width": formatCssValue(values.rootsWidth),
        "--cal-active-relation-x": formatCssValue(values.activeRelationX),
        "--cal-active-relation-y": formatCssValue(values.activeRelationY),
        "--cal-active-relation-width": formatCssValue(values.activeRelationWidth),
        "--cal-active-relation-opacity": formatCssValue(
          values.activeRelationOpacity,
          "number",
        ),
        "--cal-active-perception-x": formatCssValue(values.activePerceptionX),
        "--cal-active-perception-y": formatCssValue(values.activePerceptionY),
        "--cal-active-perception-width": formatCssValue(
          values.activePerceptionWidth,
        ),
        "--cal-active-perception-opacity": formatCssValue(
          values.activePerceptionOpacity,
          "number",
        ),
        "--cal-active-mediation-x": formatCssValue(values.activeMediationX),
        "--cal-active-mediation-y": formatCssValue(values.activeMediationY),
        "--cal-active-mediation-width": formatCssValue(
          values.activeMediationWidth,
        ),
        "--cal-active-mediation-opacity": formatCssValue(
          values.activeMediationOpacity,
          "number",
        ),
        "--cal-node-relation-x": formatCssValue(values.nodeRelationX),
        "--cal-node-relation-y": formatCssValue(values.nodeRelationY),
        "--cal-node-relation-scale": formatCssValue(
          values.nodeRelationScale,
          "number",
        ),
        "--cal-node-perception-x": formatCssValue(values.nodePerceptionX),
        "--cal-node-perception-y": formatCssValue(values.nodePerceptionY),
        "--cal-node-perception-scale": formatCssValue(
          values.nodePerceptionScale,
          "number",
        ),
        "--cal-node-mediation-x": formatCssValue(values.nodeMediationX),
        "--cal-node-mediation-y": formatCssValue(values.nodeMediationY),
        "--cal-node-mediation-scale": formatCssValue(
          values.nodeMediationScale,
          "number",
        ),
        "--cal-dialog-panel-y": formatCssValue(values.dialogPanelY),
        "--cal-dialog-panel-height": formatCssValue(values.dialogPanelHeight),
        "--cal-dialog-panel-opacity": formatCssValue(
          values.dialogPanelOpacity,
          "number",
        ),
        "--cal-dialog-text-scale": formatCssValue(
          values.dialogTextScale,
          "number",
        ),
        "--cal-node-kit": `url(${world1RootAssets.nodeKit})`,
      }) as CalibratorStyle,
    [values],
  );

  const currentLiaPose = currentLiaPoseForState(visualState);
  const currentLiaSpec = liaPoseSpecs.find((pose) => pose.id === currentLiaPose);
  const activeRoots = visibleActiveRootsForState(visualState, toggles);
  const deltaX = ((values.plantX - values.rootOriginX) / 100) * size.width;
  const deltaY = ((values.plantY - values.rootOriginY) / 100) * size.height;

  const cssExport = [
    "/* Mundo I base */",
    `--world1-stage-scale: ${formatCssValue(values.stageScale, "number")};`,
    `--world1-stage-offset-y: ${formatCssValue(values.stageOffsetY, "px")};`,
    `--world1-plant-x: ${formatCssValue(values.plantX)};`,
    `--world1-plant-y: ${formatCssValue(values.plantY)};`,
    `--world1-plant-width: ${formatCssValue(values.plantWidth)};`,
    `--world1-plant-anchor-x: ${formatCssValue(values.plantAnchorX)};`,
    `--world1-plant-anchor-y: ${formatCssValue(values.plantAnchorY)};`,
    `--world1-root-origin-x: ${formatCssValue(values.rootOriginX)};`,
    `--world1-root-origin-y: ${formatCssValue(values.rootOriginY)};`,
    `--world1-roots-top: ${formatCssValue(values.rootsTop)};`,
    `--world1-roots-width: ${formatCssValue(values.rootsWidth)};`,
    "",
    "/* Active roots */",
    `--world1-active-relation-x: ${formatCssValue(values.activeRelationX)};`,
    `--world1-active-relation-y: ${formatCssValue(values.activeRelationY)};`,
    `--world1-active-relation-width: ${formatCssValue(values.activeRelationWidth)};`,
    `--world1-active-relation-opacity: ${formatCssValue(values.activeRelationOpacity, "number")};`,
    `--world1-active-perception-x: ${formatCssValue(values.activePerceptionX)};`,
    `--world1-active-perception-y: ${formatCssValue(values.activePerceptionY)};`,
    `--world1-active-perception-width: ${formatCssValue(values.activePerceptionWidth)};`,
    `--world1-active-perception-opacity: ${formatCssValue(values.activePerceptionOpacity, "number")};`,
    `--world1-active-mediation-x: ${formatCssValue(values.activeMediationX)};`,
    `--world1-active-mediation-y: ${formatCssValue(values.activeMediationY)};`,
    `--world1-active-mediation-width: ${formatCssValue(values.activeMediationWidth)};`,
    `--world1-active-mediation-opacity: ${formatCssValue(values.activeMediationOpacity, "number")};`,
    "",
    "/* Nodes */",
    `--world1-node-relation-x: ${formatCssValue(values.nodeRelationX)};`,
    `--world1-node-relation-y: ${formatCssValue(values.nodeRelationY)};`,
    `--world1-node-relation-scale: ${formatCssValue(values.nodeRelationScale, "number")};`,
    `--world1-node-perception-x: ${formatCssValue(values.nodePerceptionX)};`,
    `--world1-node-perception-y: ${formatCssValue(values.nodePerceptionY)};`,
    `--world1-node-perception-scale: ${formatCssValue(values.nodePerceptionScale, "number")};`,
    `--world1-node-mediation-x: ${formatCssValue(values.nodeMediationX)};`,
    `--world1-node-mediation-y: ${formatCssValue(values.nodeMediationY)};`,
    `--world1-node-mediation-scale: ${formatCssValue(values.nodeMediationScale, "number")};`,
    "",
    "/* Lia */",
    ...liaPoseSpecs.flatMap((pose) => [
      `--world1-lia-${pose.id}-x: ${formatCssValue(values[pose.xKey])};`,
      `--world1-lia-${pose.id}-y: ${formatCssValue(values[pose.yKey])};`,
      `--world1-lia-${pose.id}-width: ${formatCssValue(values[pose.widthKey])};`,
    ]),
  ].join("\n");

  const jsonExport = JSON.stringify(
    {
      screen: "world1-root",
      devRoute: "/dev/world1-root-layout",
      state: visualState,
      storageKey: LOCAL_STORAGE_KEY,
      values: {
        stage: {
          scale: values.stageScale,
          offsetY: values.stageOffsetY,
        },
        plant: {
          x: formatCssValue(values.plantX),
          y: formatCssValue(values.plantY),
          width: formatCssValue(values.plantWidth),
          anchorX: formatCssValue(values.plantAnchorX),
          anchorY: formatCssValue(values.plantAnchorY),
        },
        roots: {
          originX: formatCssValue(values.rootOriginX),
          originY: formatCssValue(values.rootOriginY),
          top: formatCssValue(values.rootsTop),
          width: formatCssValue(values.rootsWidth),
        },
        activeRoots: Object.fromEntries(
          activeRootSpecs.map((root) => [
            root.id,
            {
              x: formatCssValue(values[root.xKey]),
              y: formatCssValue(values[root.yKey]),
              width: formatCssValue(values[root.widthKey]),
              opacity: format(values[root.opacityKey]),
            },
          ]),
        ),
        nodes: Object.fromEntries(
          nodeSpecs.map((node) => [
            node.id,
            {
              x: formatCssValue(values[node.xKey]),
              y: formatCssValue(values[node.yKey]),
              scale: format(values[node.scaleKey]),
              state: nodeStates[node.id],
            },
          ]),
        ),
        lia: Object.fromEntries(
          liaPoseSpecs.map((pose) => [
            pose.id,
            {
              x: formatCssValue(values[pose.xKey]),
              y: formatCssValue(values[pose.yKey]),
              width: formatCssValue(values[pose.widthKey]),
            },
          ]),
        ),
        dialog: {
          panelY: formatCssValue(values.dialogPanelY),
          height: formatCssValue(values.dialogPanelHeight),
          opacity: format(values.dialogPanelOpacity),
          textScale: format(values.dialogTextScale),
        },
        flat: Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, format(value)]),
        ),
      },
      toggles,
      nodeStates,
    },
    null,
    2,
  );

  const updateValue =
    (key: keyof LayoutValues) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number.parseFloat(event.target.value);
      if (!Number.isFinite(nextValue)) {
        return;
      }
      setValues((current) => ({ ...current, [key]: nextValue }));
    };

  const applyPreset = (preset: CalibratorPreset) => {
    setVisualState(preset.visualState);
    setValues({ ...preset.values });
    setToggles({ ...preset.toggles });
    setNodeStates({ ...preset.nodeStates });
  };

  const changeVisualState = (nextState: VisualState) => {
    setVisualState(nextState);
    setNodeStates(defaultNodeStatesForState(nextState));
  };

  const saveCurrentPreset = () => {
    const presetName = presetDraftName.trim() || "manual-calibration";
    const nextPresets = {
      ...savedPresets,
      [presetName]: makePresetSnapshot(visualState, values, toggles, nodeStates),
    };
    setSavedPresets(nextPresets);
    setSelectedSavedPreset(presetName);
    persistSavedPresets(nextPresets);
  };

  const loadSavedPreset = () => {
    const preset = savedPresets[selectedSavedPreset];
    if (!preset) {
      return;
    }
    applyPreset(preset);
    setPresetDraftName(selectedSavedPreset);
  };

  const resetSavedPreset = () => {
    if (!selectedSavedPreset) {
      return;
    }
    const nextPresets = { ...savedPresets };
    delete nextPresets[selectedSavedPreset];
    setSavedPresets(nextPresets);
    setSelectedSavedPreset("");
    persistSavedPresets(nextPresets);
  };

  const duplicatePreset = () => {
    const sourcePreset =
      savedPresets[selectedSavedPreset] ??
      makePresetSnapshot(visualState, values, toggles, nodeStates);
    const baseName = selectedSavedPreset || presetDraftName || "manual-calibration";
    const duplicateName = `${baseName}-copy`;
    const nextPresets = {
      ...savedPresets,
      [duplicateName]: sourcePreset,
    };
    setSavedPresets(nextPresets);
    setSelectedSavedPreset(duplicateName);
    setPresetDraftName(duplicateName);
    persistSavedPresets(nextPresets);
  };

  const renamePreset = () => {
    const nextName = presetDraftName.trim();
    if (!selectedSavedPreset || !nextName || !savedPresets[selectedSavedPreset]) {
      return;
    }

    const nextPresets = { ...savedPresets };
    nextPresets[nextName] = nextPresets[selectedSavedPreset];
    if (nextName !== selectedSavedPreset) {
      delete nextPresets[selectedSavedPreset];
    }
    setSavedPresets(nextPresets);
    setSelectedSavedPreset(nextName);
    persistSavedPresets(nextPresets);
  };

  const importFromJson = () => {
    try {
      const parsed = JSON.parse(importJson) as Partial<CalibratorPreset> & {
        state?: VisualState;
        values?: Partial<LayoutValues> & { flat?: Partial<LayoutValues> };
      };
      const importedValues =
        parsed.values && "flat" in parsed.values
          ? parsed.values.flat
          : parsed.values;
      const importedState = parsed.visualState ?? parsed.state;

      if (importedValues) {
        setValues((current) => ({ ...current, ...importedValues }));
      }

      if (importedState && visualStates.some((state) => state.id === importedState)) {
        setVisualState(importedState);
      }

      if (parsed.toggles) {
        setToggles((current) => ({ ...current, ...parsed.toggles }));
      }

      if (parsed.nodeStates) {
        setNodeStates((current) => ({ ...current, ...parsed.nodeStates }));
      }

      setImportStatus("JSON importado en el calibrador dev.");
    } catch {
      setImportStatus("No se pudo importar el JSON pegado.");
    }
  };

  return (
    <main
      className="world1-calibrator"
      data-testid="world1-layout-calibrator"
      data-calibrator-visual-state={visualState}
    >
      <section className="world1-calibrator__preview" aria-label="Preview Mundo I">
        <div
          className="world1-calibrator__stage-shell"
          data-show-frame={toggles.showMobileFrame ? "true" : "false"}
        >
          <div
            className="world1-calibrator__stage"
            data-testid="world1-calibrator-stage"
            ref={stageRef}
            style={style}
          >
            <div className="world1-calibrator__stage-scale">
              {toggles.showBackground ? (
                <img
                  className="world1-calibrator__layer world1-calibrator__layer--background"
                  src={world1RootAssets.background}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world1RootAssets.background}
                />
              ) : null}
              {toggles.showAmbientLight ? (
                <img
                  className="world1-calibrator__layer world1-calibrator__layer--ambient"
                  src={world1RootAssets.ambientLight}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world1RootAssets.ambientLight}
                />
              ) : null}
              {toggles.showRoots ? (
                <img
                  className="world1-calibrator__roots"
                  src={world1RootAssets.rootsBase}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world1RootAssets.rootsBase}
                />
              ) : null}
              {activeRootSpecs.map((root) =>
                activeRoots.includes(root.id) ? (
                  <img
                    className={`world1-calibrator__active-root world1-calibrator__active-root--${root.id}`}
                    key={root.id}
                    src={root.asset}
                    alt=""
                    aria-hidden="true"
                    data-calibrator-active-root={root.id}
                    data-runtime-asset={root.asset}
                  />
                ) : null,
              )}
              {toggles.showPlant ? (
                <img
                  className="world1-calibrator__plant"
                  src={world1RootAssets.plant}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world1RootAssets.plant}
                />
              ) : null}
              {toggles.showLia && currentLiaSpec ? (
                <img
                  className={`world1-calibrator__lia world1-calibrator__lia--${currentLiaSpec.id}`}
                  src={currentLiaSpec.asset}
                  alt=""
                  aria-hidden="true"
                  data-calibrator-lia-pose={currentLiaSpec.id}
                  data-runtime-asset={currentLiaSpec.asset}
                  style={
                    {
                      "--cal-lia-x": formatCssValue(values[currentLiaSpec.xKey]),
                      "--cal-lia-y": formatCssValue(values[currentLiaSpec.yKey]),
                      "--cal-lia-width": formatCssValue(
                        values[currentLiaSpec.widthKey],
                      ),
                    } as CalibratorStyle
                  }
                />
              ) : null}
              {toggles.showNodes ? (
                <div className="world1-calibrator__nodes" aria-hidden="true">
                  {nodeSpecs.map((node) => (
                    <div
                      className={`world1-calibrator__node world1-calibrator__node--${node.id}`}
                      data-node-state={nodeStates[node.id]}
                      key={node.id}
                      style={
                        {
                          "--cal-node-x": formatCssValue(values[node.xKey]),
                          "--cal-node-y": formatCssValue(values[node.yKey]),
                          "--cal-node-scale": formatCssValue(
                            values[node.scaleKey],
                            "number",
                          ),
                        } as CalibratorStyle
                      }
                    >
                      <span className="world1-calibrator__node-label">
                        {node.label}
                      </span>
                      <span
                        className={`world1-calibrator__orb world1-calibrator__orb--${nodeStates[node.id]}`}
                      ></span>
                    </div>
                  ))}
                </div>
              ) : null}
              {toggles.showTextBlock && toggles.showDialoguePanel ? (
                <div className="world1-calibrator__dialog-panel">
                  {toggles.showIntroCopy ? (
                    <>
                      <p className="world1-calibrator__eyebrow">Mundo I: Raiz</p>
                      <strong>Antes de escuchar, necesitamos aprender a mirar.</strong>
                    </>
                  ) : null}
                  {toggles.showRelationCopy ? (
                    <p>
                      RELACION: La planta no esta aislada; vive conectada con
                      tierra, luz, agua y cuidado.
                    </p>
                  ) : null}
                </div>
              ) : null}
              {toggles.showContinueButton ? (
                <span className="world1-calibrator__continue">Continuar</span>
              ) : null}
              {toggles.showGuides ? (
                <>
                  {toggles.showGrid ? (
                    <div className="world1-calibrator__grid" aria-hidden="true"></div>
                  ) : null}
                  <svg
                    className="world1-calibrator__guides"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {toggles.showStageCenter ? (
                      <>
                        <line
                          className="world1-calibrator__guide-center"
                          x1="50"
                          y1="0"
                          x2="50"
                          y2="100"
                        />
                        <line
                          className="world1-calibrator__guide-center"
                          x1="0"
                          y1="50"
                          x2="100"
                          y2="50"
                        />
                      </>
                    ) : null}
                    <line
                      className="world1-calibrator__guide-connector"
                      x1={values.rootOriginX}
                      y1={values.rootOriginY}
                      x2={values.plantX}
                      y2={values.plantY}
                    />
                  </svg>
                  <div className="world1-calibrator__anchor-layer" aria-hidden="true">
                    {toggles.showRootOrigin ? (
                      <span className="world1-calibrator__anchor world1-calibrator__anchor--root"></span>
                    ) : null}
                    {toggles.showPlantAnchor ? (
                      <span className="world1-calibrator__anchor world1-calibrator__anchor--plant"></span>
                    ) : null}
                    {toggles.showNodeAnchors
                      ? nodeSpecs.map((node) => (
                          <span
                            className={`world1-calibrator__anchor world1-calibrator__anchor--node world1-calibrator__anchor--node-${node.id}`}
                            key={node.id}
                            style={
                              {
                                "--cal-anchor-x": formatCssValue(values[node.xKey]),
                                "--cal-anchor-y": formatCssValue(values[node.yKey]),
                              } as CalibratorStyle
                            }
                          ></span>
                        ))
                      : null}
                  </div>
                  {toggles.showRootBounds ? (
                    <span className="world1-calibrator__bounds world1-calibrator__bounds--roots"></span>
                  ) : null}
                  {toggles.showActiveRootBounds
                    ? activeRootSpecs.map((root) =>
                        activeRoots.includes(root.id) ? (
                          <span
                            className={`world1-calibrator__bounds world1-calibrator__bounds--active-${root.id}`}
                            key={root.id}
                          ></span>
                        ) : null,
                      )
                    : null}
                  {toggles.showLiaBounds && currentLiaSpec ? (
                    <span
                      className="world1-calibrator__bounds world1-calibrator__bounds--lia"
                      style={
                        {
                          "--cal-lia-x": formatCssValue(values[currentLiaSpec.xKey]),
                          "--cal-lia-y": formatCssValue(values[currentLiaSpec.yKey]),
                          "--cal-lia-width": formatCssValue(
                            values[currentLiaSpec.widthKey],
                          ),
                        } as CalibratorStyle
                      }
                    ></span>
                  ) : null}
                  {toggles.showTextSafeZone ? (
                    <span className="world1-calibrator__bounds world1-calibrator__bounds--text"></span>
                  ) : null}
                  {toggles.showSafeArea ? (
                    <span className="world1-calibrator__safe-area"></span>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="world1-calibrator__panel">
        <header className="world1-calibrator__header">
          <p className="world1-calibrator__warning">Calibrador Mundo I — solo desarrollo</p>
          <h1>Calibrador Mundo I — solo desarrollo</h1>
          <p>
            Estos valores no se aplican automaticamente al runtime. Copia el
            bloque CSS/JSON y usalo en un ticket posterior.
          </p>
          <dl className="world1-calibrator__metrics">
            <div>
              <dt>Viewport stage</dt>
              <dd>
                {size.width}px x {size.height}px
              </dd>
            </div>
            <div>
              <dt>Delta planta-raiz</dt>
              <dd>
                X {deltaX.toFixed(1)}px / Y {deltaY.toFixed(1)}px
              </dd>
            </div>
            <div>
              <dt>Estado visual</dt>
              <dd>{visualState}</dd>
            </div>
          </dl>
        </header>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Estados visuales</legend>
          <div className="world1-calibrator__state-grid">
            {visualStates.map((state) => (
              <button
                className="world1-calibrator__state-button"
                data-active={visualState === state.id ? "true" : "false"}
                key={state.id}
                type="button"
                onClick={() => changeVisualState(state.id)}
              >
                <span>{state.label}</span>
                <small>{state.description}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Presets internos</legend>
          <div className="world1-calibrator__preset-row">
            {Object.entries(presetValues).map(([presetName, preset]) => (
              <button
                className="world1-calibrator__preset"
                key={presetName}
                type="button"
                onClick={() => applyPreset(preset)}
              >
                {presetName}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Capas visibles</legend>
          <div className="world1-calibrator__toggle-grid">
            {layerToggleControls.map((control) => (
              <label className="world1-calibrator__toggle" key={control.key}>
                <input
                  checked={toggles[control.key]}
                  onChange={(event) =>
                    setToggles((current) => ({
                      ...current,
                      [control.key]: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span>{control.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Escena / Stage toggles</legend>
          <div className="world1-calibrator__toggle-grid">
            {stageToggleControls.map((control) => (
              <label className="world1-calibrator__toggle" key={control.key}>
                <input
                  checked={toggles[control.key]}
                  onChange={(event) =>
                    setToggles((current) => ({
                      ...current,
                      [control.key]: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span>{control.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {controlGroups.map((group) => (
          <fieldset className="world1-calibrator__fieldset" key={group.title}>
            <legend>{group.title}</legend>
            {group.controls.map((control) => (
              <NumberControl
                control={control}
                key={control.key}
                onChange={updateValue}
                value={values[control.key]}
              />
            ))}
            {group.title === "Nodos" ? (
              <div className="world1-calibrator__state-selects">
                {nodeSpecs.map((node) => (
                  <label className="world1-calibrator__select-label" key={node.id}>
                    <span>{node.label} state</span>
                    <select
                      aria-label={`${node.id} node state`}
                      onChange={(event) =>
                        setNodeStates((current) => ({
                          ...current,
                          [node.id]: event.target.value as NodeState,
                        }))
                      }
                      value={nodeStates[node.id]}
                    >
                      {nodeStateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            ) : null}
          </fieldset>
        ))}

        <fieldset className="world1-calibrator__fieldset">
          <legend>Guias y debugging</legend>
          <div className="world1-calibrator__toggle-grid">
            {guideToggleControls.map((control) => (
              <label className="world1-calibrator__toggle" key={control.key}>
                <input
                  checked={toggles[control.key]}
                  onChange={(event) =>
                    setToggles((current) => ({
                      ...current,
                      [control.key]: event.target.checked,
                    }))
                  }
                  type="checkbox"
                />
                <span>{control.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="world1-calibrator__fieldset">
          <legend>Guardar / cargar / exportar</legend>
          <div className="world1-calibrator__save-grid">
            <label className="world1-calibrator__select-label">
              <span>Nombre de preset</span>
              <input
                aria-label="presetDraftName"
                onChange={(event) => setPresetDraftName(event.target.value)}
                type="text"
                value={presetDraftName}
              />
            </label>
            <label className="world1-calibrator__select-label">
              <span>Preset guardado</span>
              <select
                aria-label="savedPresetName"
                onChange={(event) => setSelectedSavedPreset(event.target.value)}
                value={selectedSavedPreset}
              >
                <option value="">Sin seleccionar</option>
                {Object.keys(savedPresets).map((presetName) => (
                  <option key={presetName} value={presetName}>
                    {presetName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="world1-calibrator__preset-row">
            <button type="button" onClick={saveCurrentPreset}>
              Guardar preset actual
            </button>
            <button type="button" onClick={loadSavedPreset}>
              Cargar preset guardado
            </button>
            <button type="button" onClick={resetSavedPreset}>
              Resetear preset guardado
            </button>
            <button type="button" onClick={duplicatePreset}>
              Duplicar preset
            </button>
            <button type="button" onClick={renamePreset}>
              Renombrar preset
            </button>
          </div>
          <label className="world1-calibrator__import">
            <span>Importar JSON</span>
            <textarea
              aria-label="importJson"
              onChange={(event) => setImportJson(event.target.value)}
              rows={5}
              value={importJson}
            ></textarea>
          </label>
          <button type="button" onClick={importFromJson}>
            Importar JSON
          </button>
          {importStatus ? (
            <p className="world1-calibrator__import-status">{importStatus}</p>
          ) : null}
        </fieldset>

        <section className="world1-calibrator__exports" aria-label="Exportacion">
          <h2>CSS</h2>
          <pre>{cssExport}</pre>
          <h2>JSON</h2>
          <pre>{jsonExport}</pre>
        </section>
      </section>
    </main>
  );
}
