import type { World2LayerId } from "../../content/world2EditorialSlots";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

export type World2LiaLayerProfileId = World2LayerId | "ready_to_continue";

export type World2LiaPlacement =
  | "plant-side"
  | "signal-side"
  | "module-side"
  | "observer-side"
  | "aside";

export type World2LiaMotionProfile =
  | "plant-observer"
  | "signal-witness"
  | "acquisition-guide"
  | "conditioning-guide"
  | "mapping-guide"
  | "result-guide"
  | "ready-guide";

export type World2LiaLayerProfile = {
  attentionTarget: string;
  haloOpacity: number;
  layerProfile: string;
  layerId: World2LiaLayerProfileId;
  motionProfile: World2LiaMotionProfile;
  placement: World2LiaPlacement;
  pose: string;
  scale: number;
  showSpark: boolean;
  tilt: string;
  x: string;
  y: string;
};

export const world2LiaLayerProfiles: Record<
  World2LayerId,
  World2LiaLayerProfile
> = {
  planta_viva: {
    attentionTarget: "plant-contact",
    haloOpacity: 0.28,
    layerProfile: "plant-observer",
    layerId: "planta_viva",
    motionProfile: "plant-observer",
    placement: "plant-side",
    pose: world2RuntimeAssets.liaIdle,
    scale: 0.9,
    showSpark: false,
    tilt: "-0.9deg",
    x: "-2%",
    y: "3%",
  },
  senal: {
    attentionTarget: "clean-technical-waveform",
    haloOpacity: 0.24,
    layerProfile: "signal-witness-r2",
    layerId: "senal",
    motionProfile: "signal-witness",
    placement: "signal-side",
    pose: world2RuntimeAssets.liaPoint,
    scale: 0.76,
    showSpark: true,
    tilt: "-2.1deg",
    x: "-4%",
    y: "3%",
  },
  captura: {
    attentionTarget: "acquisition-module",
    haloOpacity: 0.22,
    layerProfile: "acquisition-guide",
    layerId: "captura",
    motionProfile: "acquisition-guide",
    placement: "module-side",
    pose: world2RuntimeAssets.liaExplainCalm,
    scale: 0.76,
    showSpark: true,
    tilt: "1.2deg",
    x: "-5%",
    y: "4%",
  },
  acondicionamiento: {
    attentionTarget: "conditioning-filter",
    haloOpacity: 0.22,
    layerProfile: "conditioning-guide",
    layerId: "acondicionamiento",
    motionProfile: "conditioning-guide",
    placement: "observer-side",
    pose: world2RuntimeAssets.liaExplainCalm,
    scale: 0.74,
    showSpark: true,
    tilt: "0.8deg",
    x: "-4%",
    y: "5%",
  },
  mapeo: {
    attentionTarget: "mapping-module",
    haloOpacity: 0.28,
    layerProfile: "mapping-guide",
    layerId: "mapeo",
    motionProfile: "mapping-guide",
    placement: "aside",
    pose: world2RuntimeAssets.liaPoint,
    scale: 0.86,
    showSpark: true,
    tilt: "-1.6deg",
    x: "-5%",
    y: "1%",
  },
  resultado_mediado: {
    attentionTarget: "mediated-result",
    haloOpacity: 0.22,
    layerProfile: "result-guide",
    layerId: "resultado_mediado",
    motionProfile: "result-guide",
    placement: "aside",
    pose: world2RuntimeAssets.liaGreeting,
    scale: 0.78,
    showSpark: true,
    tilt: "0.8deg",
    x: "-3%",
    y: "3%",
  },
};

export const world2LiaReadyProfile: World2LiaLayerProfile = {
  attentionTarget: "world2-transition",
  haloOpacity: 0.22,
  layerProfile: "ready-guide",
  layerId: "ready_to_continue",
  motionProfile: "ready-guide",
  placement: "aside",
  pose: world2RuntimeAssets.liaGreeting,
  scale: 0.78,
  showSpark: true,
  tilt: "0.4deg",
  x: "10%",
  y: "6%",
};
