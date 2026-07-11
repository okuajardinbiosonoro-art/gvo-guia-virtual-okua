import { world2RuntimeAssets } from "./world2RuntimeAssets";

export type World2LayerSemanticAsset = {
  layerId: number;
  concept: string;
  primaryAsset?: string;
  supportAssets?: string[];
  visualMode: "asset" | "component" | "hybrid";
  motionPlan: string;
  mobilePlacement: string;
  semanticAcceptance: string;
  reuseScope: "world2" | "multi_station";
};

export const world2SemanticAssetManifest = [
  {
    layerId: 1,
    concept: "Planta viva antes de senal",
    primaryAsset: world2RuntimeAssets.plant,
    supportAssets: [
      world2RuntimeAssets.plantAura,
      world2RuntimeAssets.plantBioelectricContactNode,
    ],
    visualMode: "hybrid",
    motionPlan:
      "Respiracion vegetal calma y pulso pequeno en punto de contacto.",
    mobilePlacement:
      "Planta protagonista a la izquierda; contacto compacto sobre la planta.",
    semanticAcceptance:
      "La planta puede medirse sin parecer que canta directamente.",
    reuseScope: "world2",
  },
  {
    layerId: 2,
    concept: "Senal bioelectrica medida",
    primaryAsset: world2RuntimeAssets.signalWaveformCleanTechnical,
    supportAssets: [
      world2RuntimeAssets.signalOriginContact,
      world2RuntimeAssets.pulseCore,
    ],
    visualMode: "asset",
    motionPlan: "Revelado horizontal suave y deriva tecnica de baja opacidad.",
    mobilePlacement:
      "Waveform entre planta y Lia sin cubrir dialogo ni navegacion.",
    semanticAcceptance:
      "La senal se entiende como medicion tecnica en menos de dos segundos.",
    reuseScope: "world2",
  },
  {
    layerId: 3,
    concept: "Cadena de captura y adquisicion",
    primaryAsset: world2RuntimeAssets.captureAcquisitionChain,
    supportAssets: [world2RuntimeAssets.microCaptureReticle],
    visualMode: "asset",
    motionPlan:
      "Camara interna hacia adquisicion; callouts contacto, entrada y datos.",
    mobilePlacement:
      "Microescena ampliada y crop controlado para leer sensor, cable, modulo y datos.",
    semanticAcceptance:
      "Comunica planta contactada, electrodo, modulo de entrada y datos capturados.",
    reuseScope: "world2",
  },
  {
    layerId: 4,
    concept: "Acondicionamiento de senal",
    primaryAsset: world2RuntimeAssets.conditioningNoisyToClean,
    supportAssets: [
      world2RuntimeAssets.signalWaveformNoisyRaw,
      world2RuntimeAssets.signalWaveformCleanTechnical,
    ],
    visualMode: "asset",
    motionPlan:
      "Foco cinematografico con lectura ruido, filtro y senal estable.",
    mobilePlacement:
      "Diagrama ancho y ampliado en escena, con soporte reducido para no competir con dialogo.",
    semanticAcceptance:
      "Se lee izquierda a derecha: ruido, filtro, senal estable.",
    reuseScope: "world2",
  },
  {
    layerId: 5,
    concept: "Mapeo de rasgos de senal a parametros musicales",
    visualMode: "component",
    motionPlan:
      "Una sola entrada de senal alimenta reglas y parametros musicales.",
    mobilePlacement:
      "Modulo integrado dentro de escena con asset de senal unico y chips legibles.",
    semanticAcceptance:
      "Explica asignacion de rasgos a parametros sin duplicidad visual de waveform.",
    reuseScope: "world2",
  },
  {
    layerId: 6,
    concept: "Resultado musical mediado por sistema",
    supportAssets: [world2RuntimeAssets.readyPath],
    visualMode: "component",
    motionPlan:
      "Microhistoria de tres zonas: parametros, mediacion y gesto sonoro calmado.",
    mobilePlacement:
      "Modulo escenico compacto con chips, traductor central y gesto armonico suave.",
    semanticAcceptance:
      "La musica emerge como gesto mediado del sistema, no como canto directo de planta.",
    reuseScope: "world2",
  },
] as const satisfies readonly World2LayerSemanticAsset[];
