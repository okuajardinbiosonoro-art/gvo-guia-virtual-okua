import "./World2RootScreen.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";

import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import { GestureHint } from "../../components/GestureHint/GestureHint";
import {
  world2EditorialSlots,
  world2LayerDefinitions,
  type World2LayerId,
} from "../../content/world2EditorialSlots";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import {
  captureTimelineSteps,
  type CaptureTimelineStepId,
  World2CaptureTimeline,
} from "./World2CaptureTimeline";
import { World2LiaActor } from "./World2LiaActor";
import { World2MappingPanel } from "./World2MappingPanel";
import { World2MediatedResultPanel } from "./World2MediatedResultPanel";
import {
  world2LiaLayerProfiles,
  world2LiaReadyProfile,
} from "./world2LiaLayerProfiles";
import { world2RuntimeAssets } from "./world2RuntimeAssets";
import { world2SemanticAssetManifest } from "./world2SemanticAssetManifest";

const world2LayerCount = world2LayerDefinitions.length;
const preparedExitTarget = worldTwoToWorldThreeTransitionRoute;

type LayerStatus =
  | "locked"
  | "next"
  | "next-but-gated"
  | "active"
  | "completed";
type PlantContactReadoutState = "idle" | "expanded";
type RequiredInteractionId =
  | "plant_contact_readout_seen"
  | "signal_measured_wave_seen"
  | "capture_data_readout_seen";
type SignalRevealState = "idle" | "expanded";

type LayerCopy = {
  accessibleLabel: string;
  ambient: string;
  dialogue: string;
  hint: string;
  navLabel: string;
  title: string;
};

type LayerGlyphStyle = CSSProperties & {
  "--world2-layer-glyph": string;
  "--world2-layer-glyph-position": string;
};

type World2FocusStyle = CSSProperties & {
  "--world2-focus-scale": string;
  "--world2-focus-x": string;
  "--world2-focus-y": string;
  "--world2-focus-brightness": string;
  "--world2-focus-spot-x": string;
  "--world2-focus-spot-y": string;
  "--world2-lia-shift-x": string;
  "--world2-lia-shift-y": string;
  "--world2-lia-scale": string;
};

type World2RootStyle = CSSProperties & {
  "--world2-visual-vh": string;
};

type LayerVisualAsset = {
  asset: string;
  role:
    | "aura"
    | "origin"
    | "wave"
    | "focus"
    | "field"
    | "trail"
    | "contact-node"
    | "semantic-signal"
    | "acquisition-chain"
    | "conditioning-chain"
    | "support-wave";
};

type LayerCallout = {
  anchor: "contact" | "input" | "data" | "noise" | "filter" | "stable";
  label: string;
};

const layerCopy: Record<World2LayerId, LayerCopy> = {
  planta_viva: {
    accessibleLabel: "Planta viva",
    ambient: "La planta está viva antes de cualquier dato.",
    dialogue:
      "La planta está viva antes de cualquier dato. Su pulso aún no es música: es presencia, variación y cuidado.",
    hint: "Toca Señal para escuchar lo invisible.",
    navLabel: "Planta",
    title: "La vida antes de la señal",
  },
  senal: {
    accessibleLabel: "Señal bioeléctrica",
    ambient: "La señal aparece, pero todavía no canta.",
    dialogue:
      "La variación aparece como una señal pequeña. Todavía no canta: primero debe ser leída.",
    hint: "Toca Captura para recibirla.",
    navLabel: "Señal",
    title: "Pulso bioeléctrico",
  },
  captura: {
    accessibleLabel: "Captura",
    ambient: "El pulso se sostiene sin convertirlo todavía.",
    dialogue:
      "El sistema recibe el pulso sin convertirlo aún. Capturar es sostener la señal para poder comprenderla.",
    hint: "Toca Acond. para ordenarla.",
    navLabel: "Captura",
    title: "Captura cuidadosa",
  },
  acondicionamiento: {
    accessibleLabel: "Acondicionamiento",
    ambient: "La señal gana una forma que puede viajar.",
    dialogue:
      "El pulso se limpia y se ordena. No cambia su origen: gana una forma que puede viajar.",
    hint: "Toca Mapeo para darle forma.",
    navLabel: "Acond.",
    title: "Señal preparada",
  },
  mapeo: {
    accessibleLabel: "Mapeo",
    ambient: "La señal encuentra correspondencias sensibles.",
    dialogue:
      "La señal encuentra correspondencias. Algunos cambios se vuelven altura, ritmo, brillo o silencio.",
    hint: "Toca Resultado para oír la mediación.",
    navLabel: "Mapeo",
    title: "Del dato al gesto",
  },
  resultado_mediado: {
    accessibleLabel: "Resultado mediado",
    ambient: "La escucha final es una traducción sensible.",
    dialogue:
      "Lo que escuchamos no sale directo de la planta. Es una traducción sensible entre vida, datos y escucha.",
    hint: "Has llegado al resultado mediado.",
    navLabel: "Música",
    title: "Música mediada",
  },
};

const cleanMessages = {
  intro: "Aquí empieza el pulso invisible. Vamos capa por capa.",
  locked: "Primero necesitamos entender la capa anterior.",
  review: "Puedes revisar cualquier capa ya abierta sin perder el recorrido.",
  complete:
    "El pulso invisible ya está mediado. Podemos continuar con el recorrido.",
  lockedHint: "Sigue la capa disponible.",
} as const;

const requiredInteractionCopy: Record<
  RequiredInteractionId,
  {
    gateMessage: string;
    triggerLabel: string;
  }
> = {
  plant_contact_readout_seen: {
    gateMessage: "Primero toca Punto de lectura.",
    triggerLabel: "Punto de lectura",
  },
  signal_measured_wave_seen: {
    gateMessage: "Primero toca Onda medida.",
    triggerLabel: "Onda medida",
  },
  capture_data_readout_seen: {
    gateMessage: "Primero recorre los tres pasos de Captura.",
    triggerLabel: "secuencia de Captura",
  },
};

const requiredInteractionGateByLayer: Partial<
  Record<World2LayerId, RequiredInteractionId>
> = {
  acondicionamiento: "capture_data_readout_seen",
  captura: "signal_measured_wave_seen",
  senal: "plant_contact_readout_seen",
};

const requiredInteractionOrder: RequiredInteractionId[] = [
  "plant_contact_readout_seen",
  "signal_measured_wave_seen",
  "capture_data_readout_seen",
];

const visualAssetsByLayer: Record<World2LayerId, LayerVisualAsset[]> = {
  planta_viva: [
    { asset: world2RuntimeAssets.plantAura, role: "aura" },
    {
      asset: world2RuntimeAssets.plantBioelectricContactNode,
      role: "contact-node",
    },
  ],
  senal: [
    {
      asset: world2RuntimeAssets.signalProbeCableWaveformUnified,
      role: "semantic-signal",
    },
  ],
  captura: [
    {
      asset: world2RuntimeAssets.captureAcquisitionChain,
      role: "acquisition-chain",
    },
    { asset: world2RuntimeAssets.microCaptureReticle, role: "field" },
  ],
  acondicionamiento: [
    {
      asset: world2RuntimeAssets.conditioningNoisyToClean,
      role: "conditioning-chain",
    },
    {
      asset: world2RuntimeAssets.signalWaveformNoisyRaw,
      role: "support-wave",
    },
  ],
  mapeo: [],
  resultado_mediado: [],
};

const focusProfileByLayer: Record<World2LayerId, World2FocusStyle> = {
  planta_viva: {
    "--world2-focus-scale": "1.13",
    "--world2-focus-x": "-8%",
    "--world2-focus-y": "4%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "23%",
    "--world2-focus-spot-y": "57%",
    "--world2-lia-shift-x": "6%",
    "--world2-lia-shift-y": "3%",
    "--world2-lia-scale": "0.9",
  },
  senal: {
    "--world2-focus-scale": "1.09",
    "--world2-focus-x": "3%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.05",
    "--world2-focus-spot-x": "58%",
    "--world2-focus-spot-y": "39%",
    "--world2-lia-shift-x": "-10%",
    "--world2-lia-shift-y": "-2%",
    "--world2-lia-scale": "0.92",
  },
  captura: {
    "--world2-focus-scale": "1.07",
    "--world2-focus-x": "2%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "52%",
    "--world2-focus-spot-y": "43%",
    "--world2-lia-shift-x": "-11%",
    "--world2-lia-shift-y": "-3%",
    "--world2-lia-scale": "0.88",
  },
  acondicionamiento: {
    "--world2-focus-scale": "1.06",
    "--world2-focus-x": "1%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "54%",
    "--world2-focus-spot-y": "45%",
    "--world2-lia-shift-x": "-10%",
    "--world2-lia-shift-y": "-2%",
    "--world2-lia-scale": "0.88",
  },
  mapeo: {
    "--world2-focus-scale": "1.1",
    "--world2-focus-x": "1%",
    "--world2-focus-y": "-6%",
    "--world2-focus-brightness": "1.02",
    "--world2-focus-spot-x": "45%",
    "--world2-focus-spot-y": "34%",
    "--world2-lia-shift-x": "2%",
    "--world2-lia-shift-y": "1%",
    "--world2-lia-scale": "0.88",
  },
  resultado_mediado: {
    "--world2-focus-scale": "1.11",
    "--world2-focus-x": "3%",
    "--world2-focus-y": "-4%",
    "--world2-focus-brightness": "1.03",
    "--world2-focus-spot-x": "54%",
    "--world2-focus-spot-y": "38%",
    "--world2-lia-shift-x": "-2%",
    "--world2-lia-shift-y": "2%",
    "--world2-lia-scale": "0.95",
  },
};

const visualCalloutsByLayer: Partial<Record<World2LayerId, LayerCallout[]>> = {
  planta_viva: [{ anchor: "contact", label: "punto de lectura" }],
};

const focusTargetByLayer: Record<World2LayerId, string> = {
  planta_viva: "plant-contact",
  senal: "clean-technical-waveform",
  captura: "acquisition-chain",
  acondicionamiento: "noise-filter-stable-signal",
  mapeo: "mapping-module",
  resultado_mediado: "mediated-microstory",
};

function getLayerIndex(layerId: World2LayerId) {
  return world2LayerDefinitions.findIndex((layer) => layer.id === layerId);
}

function getLayerStatus(
  layerId: World2LayerId,
  activeLayerId: World2LayerId,
  visitedLayerIds: ReadonlySet<World2LayerId>,
  highestUnlockedLayerOrder: number,
  completedRequiredInteractions: ReadonlySet<RequiredInteractionId>,
): LayerStatus {
  const layerOrder = getLayerIndex(layerId) + 1;

  if (layerId === activeLayerId) {
    return "active";
  }

  if (visitedLayerIds.has(layerId)) {
    return "completed";
  }

  if (layerOrder <= highestUnlockedLayerOrder) {
    if (getRequiredInteractionGate(layerId, completedRequiredInteractions)) {
      return "next-but-gated";
    }

    return "next";
  }

  return "locked";
}

function getRequiredInteractionGate(
  layerId: World2LayerId,
  completedRequiredInteractions: ReadonlySet<RequiredInteractionId>,
) {
  const requiredInteractionId = requiredInteractionGateByLayer[layerId];

  return requiredInteractionId &&
    !completedRequiredInteractions.has(requiredInteractionId)
    ? requiredInteractionId
    : null;
}

function getStatusLabel(status: LayerStatus) {
  return {
    active: "activo",
    completed: "completado",
    locked: "bloqueado",
    next: "disponible",
    "next-but-gated": "pendiente de interacción",
  }[status];
}

function getLayerGlyphStyle(index: number): LayerGlyphStyle {
  return {
    "--world2-layer-glyph": `url(${world2RuntimeAssets.layerGlyphAtlas})`,
    "--world2-layer-glyph-position": `${index * 20}% 0%`,
  };
}

export function World2RootScreen() {
  const navigate = useNavigate();
  const plantContactHotspotRef = useRef<HTMLButtonElement>(null);
  const signalRevealControlRef = useRef<HTMLButtonElement>(null);
  const [visualViewportHeight, setVisualViewportHeight] = useState<
    number | null
  >(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return Math.round(window.visualViewport?.height ?? window.innerHeight);
  });
  const [activeLayerId, setActiveLayerId] =
    useState<World2LayerId>("planta_viva");
  const [visitedLayerIds, setVisitedLayerIds] = useState<
    ReadonlySet<World2LayerId>
  >(() => new Set<World2LayerId>(["planta_viva"]));
  const [highestUnlockedLayerOrder, setHighestUnlockedLayerOrder] = useState(
    Math.min(2, world2LayerCount),
  );
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [sonicConvergenceComplete, setSonicConvergenceComplete] =
    useState(false);
  const [softMessage, setSoftMessage] = useState<string | null>(null);
  const [signalRevealState, setSignalRevealState] =
    useState<SignalRevealState>("idle");
  const [plantContactReadoutState, setPlantContactReadoutState] =
    useState<PlantContactReadoutState>("idle");
  const [captureTimelineStepId, setCaptureTimelineStepId] =
    useState<CaptureTimelineStepId>("contact");
  const [captureVisitedStepIds, setCaptureVisitedStepIds] = useState<
    ReadonlySet<CaptureTimelineStepId>
  >(() => new Set<CaptureTimelineStepId>(["contact"]));
  const [captureTimelineInteracted, setCaptureTimelineInteracted] =
    useState(false);
  const [mappingFirstRunComplete, setMappingFirstRunComplete] = useState(false);
  const [completedRequiredInteractions, setCompletedRequiredInteractions] =
    useState<ReadonlySet<RequiredInteractionId>>(
      () => new Set<RequiredInteractionId>(),
    );
  const initialPreload = useAssetPreloader(
    screenAssetBundles.world2RootInitial,
    {
      timeoutMs: 9000,
    },
  );
  const activeLayer = useMemo(
    () =>
      world2LayerDefinitions.find((layer) => layer.id === activeLayerId) ??
      world2LayerDefinitions[0],
    [activeLayerId],
  );
  const visitedLayerOrderList = useMemo(
    () =>
      world2LayerDefinitions
        .filter((layer) => visitedLayerIds.has(layer.id))
        .map((layer) => layer.order)
        .join(","),
    [visitedLayerIds],
  );
  const completedRequiredInteractionList = useMemo(
    () =>
      requiredInteractionOrder
        .filter((interactionId) =>
          completedRequiredInteractions.has(interactionId),
        )
        .join(","),
    [completedRequiredInteractions],
  );
  const activeCopy = layerCopy[activeLayer.id];
  const isReadyToContinue =
    journeyComplete && activeLayer.id === "resultado_mediado";
  const world2State = isReadyToContinue ? "ready_to_continue" : activeLayer.id;
  const isLockedMessage = softMessage === cleanMessages.locked;
  const activeDialogue =
    softMessage ??
    (isReadyToContinue ? cleanMessages.complete : activeCopy.dialogue);
  const activeAmbient = isReadyToContinue
    ? "La ruta de mediación queda completa para continuar."
    : activeCopy.ambient;
  const activeHint = isLockedMessage
    ? cleanMessages.lockedHint
    : isReadyToContinue
      ? activeAmbient
      : activeCopy.hint;
  const activeLiaProfile = isReadyToContinue
    ? world2LiaReadyProfile
    : world2LiaLayerProfiles[activeLayer.id];
  const activeVisualAssets = isReadyToContinue
    ? visualAssetsByLayer.resultado_mediado
    : visualAssetsByLayer[activeLayer.id];
  const activeFocusProfile = focusProfileByLayer[activeLayer.id];
  const activeCallouts = visualCalloutsByLayer[activeLayer.id] ?? [];
  const activeLayerContent = isReadyToContinue
    ? "closure"
    : {
        acondicionamiento: "conditioning",
        captura: "capture",
        mapeo: "mapping",
        planta_viva: "plant",
        resultado_mediado: "result",
        senal: "signal",
      }[activeLayer.id];
  const showSignalCinema = activeLayer.id === "senal" && !isReadyToContinue;
  const showAcquisitionCinema =
    activeLayer.id === "captura" && !isReadyToContinue;
  const showConditioningCinema =
    activeLayer.id === "acondicionamiento" && !isReadyToContinue;
  const captureTimelineCompleted = completedRequiredInteractions.has(
    "capture_data_readout_seen",
  );
  const sceneHasSemanticComponent =
    activeLayer.id === "planta_viva" ||
    activeLayer.id === "senal" ||
    activeLayer.id === "captura" ||
    activeLayer.id === "mapeo" ||
    activeLayer.id === "resultado_mediado" ||
    isReadyToContinue;
  const world2RootStyle: World2RootStyle | undefined = visualViewportHeight
    ? ({
        "--world2-visual-vh": `${visualViewportHeight}px`,
      } as World2RootStyle)
    : undefined;

  useEffect(() => {
    const updateVisualViewportHeight = () => {
      setVisualViewportHeight(
        Math.round(window.visualViewport?.height ?? window.innerHeight),
      );
    };

    updateVisualViewportHeight();
    window.addEventListener("resize", updateVisualViewportHeight);
    window.visualViewport?.addEventListener(
      "resize",
      updateVisualViewportHeight,
    );
    window.visualViewport?.addEventListener(
      "scroll",
      updateVisualViewportHeight,
    );

    return () => {
      window.removeEventListener("resize", updateVisualViewportHeight);
      window.visualViewport?.removeEventListener(
        "resize",
        updateVisualViewportHeight,
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        updateVisualViewportHeight,
      );
    };
  }, []);

  function completeRequiredInteraction(interactionId: RequiredInteractionId) {
    setCompletedRequiredInteractions((currentCompletedInteractions) => {
      if (currentCompletedInteractions.has(interactionId)) {
        return currentCompletedInteractions;
      }

      const nextCompletedInteractions = new Set(currentCompletedInteractions);
      nextCompletedInteractions.add(interactionId);
      return nextCompletedInteractions;
    });
  }

  function selectLayer(layerId: World2LayerId, layerIndex: number) {
    const layerOrder = layerIndex + 1;
    const status = getLayerStatus(
      layerId,
      activeLayerId,
      visitedLayerIds,
      highestUnlockedLayerOrder,
      completedRequiredInteractions,
    );
    const requiredInteractionGate = getRequiredInteractionGate(
      layerId,
      completedRequiredInteractions,
    );

    if (status === "locked") {
      setSoftMessage(cleanMessages.locked);
      return;
    }

    if (status === "next-but-gated" && requiredInteractionGate) {
      setSoftMessage(
        requiredInteractionCopy[requiredInteractionGate].gateMessage,
      );
      return;
    }

    if (layerId !== "senal") {
      setSignalRevealState("idle");
    }

    setVisitedLayerIds((currentVisitedLayerIds) => {
      const nextVisitedLayerIds = new Set(currentVisitedLayerIds);
      nextVisitedLayerIds.add(layerId);
      return nextVisitedLayerIds;
    });
    setHighestUnlockedLayerOrder((currentHighestUnlockedLayerOrder) =>
      Math.max(
        currentHighestUnlockedLayerOrder,
        Math.min(layerOrder + 1, world2LayerCount),
      ),
    );
    setActiveLayerId(layerId);
    setSoftMessage(
      journeyComplete && layerId === "resultado_mediado"
        ? cleanMessages.complete
        : status === "completed"
          ? cleanMessages.review
          : null,
    );
  }

  function expandPlantContactReadout() {
    setPlantContactReadoutState("expanded");
    completeRequiredInteraction("plant_contact_readout_seen");
  }

  function expandSignalReveal() {
    setSignalRevealState("expanded");
    completeRequiredInteraction("signal_measured_wave_seen");
  }

  function selectCaptureTimelineStep(stepId: CaptureTimelineStepId) {
    const nextVisitedStepIds = new Set(captureVisitedStepIds);
    nextVisitedStepIds.add(stepId);

    setCaptureTimelineInteracted(true);
    setCaptureTimelineStepId(stepId);
    setCaptureVisitedStepIds(nextVisitedStepIds);
    if (nextVisitedStepIds.size === captureTimelineSteps.length) {
      completeRequiredInteraction("capture_data_readout_seen");
    }
    setSoftMessage(null);
  }

  const completeMappingFirstRun = useCallback(() => {
    setMappingFirstRunComplete(true);
  }, []);

  const completeSonicConvergence = useCallback(() => {
    setSonicConvergenceComplete(true);
    setJourneyComplete(true);
    setSoftMessage(cleanMessages.complete);
  }, []);

  return (
    <main
      className="world2-root-screen"
      style={world2RootStyle}
      data-world2-experience="option6-closure-centering-post-completion-revisit-fix-r2"
      data-world2-runtime-version="016V-R2"
      data-world2-post-completion-revisit="enabled"
      data-world2-active-layer-content={activeLayerContent}
      data-world2-option6-overlay-visible={
        activeLayer.id === "resultado_mediado" ? "true" : "false"
      }
      data-world2-editorial-source="excel_pending"
      data-world2-option12-visual-polish="016K"
      data-world2-option3-capture-final-polish="016L"
      data-world2-option3-capture-swipe-timeline="016R"
      data-world2-responsive-parity="016M"
      data-world2-required-interactions="016R"
      data-capture-cinema="016R"
      data-world2-completed-required-interactions={
        completedRequiredInteractionList || "none"
      }
      data-world2-state={world2State}
      data-world2-active-layer={activeLayer.id}
      data-world2-current-layer={activeLayer.order}
      data-world2-highest-unlocked-layer={highestUnlockedLayerOrder}
      data-world2-visited-layers={visitedLayerOrderList}
      data-world2-completed-count={visitedLayerIds.size}
      data-world2-semantic-layer-count={world2SemanticAssetManifest.length}
      data-world2-slot-count={Object.keys(world2EditorialSlots).length}
      data-world2-label-system="015V"
      data-world2-nav-mode="stable-visible-row"
      data-sensitive-permissions="blocked"
      data-qr-camera="blocked"
      data-critical-assets-ready={initialPreload.ready ? "true" : "false"}
      data-critical-assets-status={initialPreload.status}
      data-world2-exit-target={
        isReadyToContinue ? preparedExitTarget : undefined
      }
      aria-labelledby="world2-root-title"
    >
      {initialPreload.ready ? null : (
        <p className="world2-root-preload-status" role="status">
          Preparando pulso invisible...
        </p>
      )}
      <section
        className="world2-stage"
        aria-label="Escena interactiva de Mundo II con seis capas: planta viva, señal, captura, acondicionamiento, mapeo y resultado mediado."
        data-world2-layout="adaptive-zones"
        data-world2-slot-id="W2_ACCESSIBLE_SCENE_01"
      >
        <img
          className="world2-scene-asset world2-scene-asset--background"
          src={world2RuntimeAssets.background}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.background}
          fetchPriority="high"
        />
        <header className="world2-scene-title" data-world2-zone="header">
          <p>ESTACIÓN II</p>
          <span>MUNDO II</span>
          <h1 id="world2-root-title">Lía y el pulso invisible</h1>
        </header>

        <section
          className="world2-scene-zone"
          aria-hidden={sceneHasSemanticComponent ? undefined : true}
          data-world2-zone="scene"
          data-world2-scene-layer={activeLayer.id}
          data-active-layer={activeLayer.order}
          data-active-layer-id={activeLayer.id}
          data-world2-focus-profile={activeLayer.id}
          data-world2-focus-target={focusTargetByLayer[activeLayer.id]}
          data-world2-cinematic-layer-focus="015V"
          data-plant-contact-readout-state={
            activeLayer.id === "planta_viva"
              ? plantContactReadoutState
              : undefined
          }
          data-capture-readout-state={
            activeLayer.id === "captura"
              ? captureTimelineCompleted
                ? "expanded"
                : "idle"
              : undefined
          }
          data-world2-capture-step={
            activeLayer.id === "captura" ? captureTimelineStepId : undefined
          }
          style={activeFocusProfile}
        >
          <div className="world2-scene-field">
            <div
              className="world2-semantic-focus"
              data-world2-semantic-focus={activeLayer.id}
            >
              <img
                className="world2-scene-asset world2-scene-asset--plant-anchor"
                src={world2RuntimeAssets.plantStageAnchor}
                alt=""
                aria-hidden="true"
                data-runtime-asset={world2RuntimeAssets.plantStageAnchor}
                fetchPriority="high"
              />
              <img
                className="world2-scene-asset world2-scene-asset--plant"
                src={world2RuntimeAssets.plant}
                alt=""
                aria-hidden="true"
                data-runtime-asset={world2RuntimeAssets.plant}
                fetchPriority="high"
              />
              <span
                className="world2-contact-pulse"
                aria-hidden="true"
                data-world2-focus-pulse={activeLayer.id}
              />
              {activeLayer.id === "planta_viva" && !isReadyToContinue ? (
                <>
                  <button
                    ref={plantContactHotspotRef}
                    className="world2-plant-contact-hotspot"
                    type="button"
                    data-plant-contact-hotspot="016J"
                    data-plant-contact-readout-state={plantContactReadoutState}
                    aria-label="Abrir Punto de lectura"
                    aria-expanded={plantContactReadoutState === "expanded"}
                    onClick={expandPlantContactReadout}
                  >
                    <span
                      className="world2-plant-contact-hotspot__ring"
                      aria-hidden="true"
                    />
                    <span
                      className="world2-plant-contact-hotspot__cue"
                      aria-hidden="true"
                    />
                  </button>
                  <GestureHint
                    active={plantContactReadoutState === "idle"}
                    anchorRef={plantContactHotspotRef}
                    className="world2-gesture-hint world2-gesture-hint--plant-contact"
                    completed={plantContactReadoutState === "expanded"}
                    targetLabel="Punto de lectura"
                    variant="tap"
                  />
                </>
              ) : null}
              <span
                className="world2-focus-thread"
                aria-hidden="true"
                data-world2-focus-thread={activeLayer.id}
              />
              {activeLayer.id === "planta_viva" &&
              plantContactReadoutState === "expanded" &&
              !isReadyToContinue ? (
                <div
                  className="world2-plant-contact-readout"
                  data-plant-contact-readout-state={plantContactReadoutState}
                  data-world2-plant-readout-style="local-lia-note"
                  data-world2-required-interaction="plant_contact_readout_seen"
                  role="note"
                >
                  <strong>Punto de lectura</strong>
                  <p>
                    Este punto marca el primer contacto entre la planta y el
                    sistema. Aquí todavía no hay música: solo se prepara la
                    lectura de una pequeña variación bioeléctrica que después
                    será interpretada.
                  </p>
                </div>
              ) : null}
              {showSignalCinema ? (
                <div
                  className="world2-signal-cinema"
                  data-signal-cinema="016J"
                  data-signal-reveal-state={signalRevealState}
                  data-world2-signal-base-mode="static-unified-probe-leaf-attached"
                  data-world2-signal-expanded-mode="scene-focus-large-projected-waveform-moving-alpha-mask"
                  data-world2-signal-contact-source="unified-image-asset"
                  data-world2-primary-signal-asset={
                    world2RuntimeAssets.signalProbeCableWaveformUnified
                  }
                  data-world2-expanded-signal-asset={
                    world2RuntimeAssets.signalWaveformCleanTechnical
                  }
                  data-world2-signal-read-style="scene-focus-large-projected-waveform-moving-alpha-mask"
                  data-world2-signal-readout-safe-area="016I"
                  data-world2-signal-scan="moving-alpha-mask"
                  data-world2-reduced-motion-safe="visible-content"
                  key={`world2-signal-cinema-${activeLayer.id}`}
                >
                  <span className="world2-signal-cinema__ambient" />
                  <img
                    className="world2-signal-cinema__static-base"
                    src={world2RuntimeAssets.signalProbeCableWaveformUnified}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={
                      world2RuntimeAssets.signalProbeCableWaveformUnified
                    }
                    data-world2-layer-visual={activeLayer.id}
                    data-world2-visual-role="unified-probe-cable-waveform"
                    data-world2-signal-base="static-unified-probe-leaf-attached"
                    loading="lazy"
                  />
                  <div
                    className="world2-signal-cinema__projection"
                    aria-hidden="true"
                    data-world2-signal-projection="expanded-clean-waveform"
                  >
                    <img
                      className="world2-signal-cinema__projected-wave world2-signal-cinema__projected-wave--base"
                      src={world2RuntimeAssets.signalWaveformCleanTechnical}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.signalWaveformCleanTechnical
                      }
                      data-world2-signal-projection-layer="base"
                      loading="lazy"
                    />
                    <img
                      className="world2-signal-cinema__projected-wave world2-signal-cinema__projected-wave--scan"
                      src={world2RuntimeAssets.signalWaveformCleanTechnical}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.signalWaveformCleanTechnical
                      }
                      data-world2-signal-reveal="projected-clean-waveform"
                      data-world2-signal-scan="moving-alpha-mask"
                      loading="lazy"
                    />
                  </div>
                  <button
                    ref={signalRevealControlRef}
                    className="world2-signal-cinema__label world2-micro-label world2-micro-label--bright world2-micro-label--asset-anchored world2-micro-label--subtle-motion"
                    type="button"
                    data-world2-label-anchor="signal-waveform"
                    data-world2-signal-reveal-control="onda-medida"
                    aria-label="Expandir señal medida"
                    aria-pressed={signalRevealState === "expanded"}
                    onClick={expandSignalReveal}
                  >
                    <span
                      className="world2-signal-cinema__cue"
                      data-world2-signal-cue="onda-medida"
                      aria-hidden="true"
                    />
                    <span className="world2-micro-label__text">
                      onda medida
                    </span>
                  </button>
                  <GestureHint
                    active={signalRevealState === "idle"}
                    anchorRef={signalRevealControlRef}
                    className="world2-gesture-hint world2-gesture-hint--signal-wave"
                    completed={signalRevealState === "expanded"}
                    targetLabel="Onda medida"
                    variant="tap"
                  />
                  {signalRevealState === "expanded" ? (
                    <div
                      className="world2-signal-cinema__readout"
                      data-world2-signal-readout="expanded"
                      data-world2-signal-readout-safe-area="016I"
                      data-world2-signal-readout-style="local-lia-note"
                    >
                      <strong>Onda medida</strong>
                      <p>
                        Desde el contacto con la planta emergen variaciones
                        eléctricas sutiles. Aunque no se ven ni se escuchan
                        directamente, ya contienen información viva: pequeños
                        cambios y pausas que el sistema empieza a reconocer
                        antes de transformarlos en datos y, más adelante, en
                        sonido.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : showAcquisitionCinema ? (
                <World2CaptureTimeline
                  asset={world2RuntimeAssets.captureAcquisitionChain}
                  completed={captureTimelineCompleted}
                  currentStepId={captureTimelineStepId}
                  hasInteracted={captureTimelineInteracted}
                  onSelectStep={selectCaptureTimelineStep}
                  visitedStepIds={captureVisitedStepIds}
                />
              ) : showConditioningCinema ? (
                <div
                  className="world2-conditioning-cinema"
                  data-conditioning-cinema="016T-R2"
                  data-world2-conditioning-animation="moving-alpha-mask-transformation"
                  data-world2-conditioning-sequence="integrated-noise-filter-stable"
                  data-world2-conditioning-interactions="none"
                  data-world2-conditioning-pulse-count="1"
                  data-world2-conditioning-source-copies="2"
                  data-world2-primary-conditioning-asset={
                    world2RuntimeAssets.conditioningNoisyToClean
                  }
                  key={`world2-conditioning-cinema-${activeLayer.id}`}
                  aria-hidden="true"
                >
                  <span className="world2-conditioning-cinema__ambient" />
                  <div
                    className="world2-conditioning-cinema__stage"
                    data-world2-conditioning-stage="asset-moving-mask-flow"
                  >
                    <img
                      className="world2-layer-asset world2-layer-asset--conditioning-chain world2-conditioning-cinema__asset world2-conditioning-cinema__asset--base"
                      src={world2RuntimeAssets.conditioningNoisyToClean}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.conditioningNoisyToClean
                      }
                      data-world2-layer-visual={activeLayer.id}
                      data-world2-visual-role="conditioning-asset-base"
                      loading="lazy"
                    />
                    <img
                      className="world2-layer-asset world2-layer-asset--conditioning-chain world2-conditioning-cinema__asset world2-conditioning-cinema__asset--scan"
                      src={world2RuntimeAssets.conditioningNoisyToClean}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.conditioningNoisyToClean
                      }
                      data-world2-layer-visual={activeLayer.id}
                      data-world2-visual-role="conditioning-asset-intense-scan"
                      data-world2-conditioning-flow="single-moving-alpha-mask"
                      data-world2-conditioning-mask="soft-vertical-window"
                      loading="lazy"
                    />
                    <span
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--noise"
                      data-world2-label-anchor="conditioning-noise"
                    >
                      RUIDO
                    </span>
                    <span
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--filter"
                      data-world2-label-anchor="conditioning-filter"
                      data-world2-label-legibility="uppercase-explicit"
                    >
                      FILTRO
                    </span>
                    <span
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--stable"
                      data-world2-label-anchor="conditioning-stable"
                    >
                      SEÑAL ESTABLE
                    </span>
                  </div>
                </div>
              ) : (
                activeVisualAssets.map((visual) => (
                  <img
                    className={`world2-layer-asset world2-layer-asset--${visual.role}`}
                    src={visual.asset}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={visual.asset}
                    data-world2-layer-visual={
                      isReadyToContinue ? "ready_to_continue" : activeLayer.id
                    }
                    data-world2-visual-role={visual.role}
                    key={`${activeLayer.id}-${visual.role}-${visual.asset}`}
                    loading="lazy"
                  />
                ))
              )}
              {activeLayer.id === "mapeo" && !isReadyToContinue ? (
                <World2MappingPanel
                  cleanSignalAsset={
                    world2RuntimeAssets.signalWaveformCleanTechnical
                  }
                  firstRunComplete={mappingFirstRunComplete}
                  onFirstRunComplete={completeMappingFirstRun}
                />
              ) : null}
              {activeLayer.id === "resultado_mediado" || isReadyToContinue ? (
                <World2MediatedResultPanel
                  complete={sonicConvergenceComplete}
                  onComplete={completeSonicConvergence}
                />
              ) : null}
              {activeCallouts.length > 0 ? (
                <div className="world2-layer-callouts" aria-hidden="true">
                  {activeCallouts.map((callout) => (
                    <span
                      className={`world2-layer-callout world2-layer-callout--${callout.anchor} world2-micro-label world2-micro-label--bright world2-micro-label--asset-anchored world2-micro-label--subtle-motion`}
                      data-world2-callout={callout.anchor}
                      data-world2-label-anchor={`plant-${callout.anchor}`}
                      key={`${activeLayer.id}-${callout.anchor}`}
                    >
                      <span className="world2-micro-label__text">
                        {callout.label}
                      </span>
                    </span>
                  ))}
                </div>
              ) : null}
              <World2LiaActor profile={activeLiaProfile} />
            </div>
          </div>
        </section>

        <article
          className="world2-dialogue"
          aria-live="polite"
          data-world2-zone="dialogue"
          data-world2-dialogue-layer={activeLayer.id}
          data-world2-dialogue-suppressed={
            activeLayer.id === "resultado_mediado" && !isReadyToContinue
              ? "option6-sequence"
              : undefined
          }
          data-world2-closure-layout={
            isReadyToContinue ? "centered-balanced" : undefined
          }
          data-world2-closure-title-count={isReadyToContinue ? "1" : undefined}
        >
          <img
            className="world2-dialogue__asset world2-dialogue__asset--backplate"
            src={world2RuntimeAssets.dialogueCard}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world2RuntimeAssets.dialogueCard}
          />
          <div className="world2-dialogue__content">
            <div className="world2-dialogue__safe">
              <div className="world2-dialogue__copy-block">
                <p className="world2-dialogue__eyebrow">
                  {isReadyToContinue
                    ? "ESTACIÓN II"
                    : `Capa ${activeLayer.order} de ${world2LayerCount}`}
                </p>
                <p
                  className="world2-dialogue__title"
                  data-world2-text-sweep={activeLayer.id}
                  key={`world2-title-${world2State}-${activeDialogue}`}
                >
                  {isLockedMessage
                    ? "Paso a paso"
                    : isReadyToContinue
                      ? "Recorrido completo"
                      : activeCopy.title}
                </p>
                <p
                  className="world2-dialogue__copy"
                  data-world2-slot-id={
                    isReadyToContinue
                      ? "W2_COMPLETE_LIA_01"
                      : activeLayer.hintSlot
                  }
                  data-world2-text-sweep={activeLayer.id}
                  data-editorial-status="TEMP"
                  key={`world2-copy-${world2State}-${activeDialogue}`}
                >
                  {activeDialogue}
                </p>
              </div>
              {isReadyToContinue ? null : (
                <p className="world2-dialogue__hint">{activeHint}</p>
              )}
              <div className="world2-dialogue__actions">
                {isReadyToContinue ? (
                  <button
                    className="world2-action world2-action--continue"
                    type="button"
                    data-world2-slot-id="W2_CONTINUE_BTN_01"
                    data-world2-exit-action="navigate_to_transition"
                    data-editorial-status="TEMP"
                    onClick={() =>
                      navigate(worldTwoToWorldThreeTransitionRoute)
                    }
                  >
                    <img
                      src={world2RuntimeAssets.ctaButton}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={world2RuntimeAssets.ctaButton}
                      loading="lazy"
                    />
                    <span>Continuar</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        <nav
          className="world2-layer-nav world2-layer-nav--stable"
          aria-label="Capas de Mundo II"
          data-world2-zone="nav"
          data-world2-nav-mode="stable-visible-row"
        >
          <div className="world2-layer-nav__items" id="world2-layer-nav-items">
            {world2LayerDefinitions.map((layer, index) => {
              const status = getLayerStatus(
                layer.id,
                activeLayerId,
                visitedLayerIds,
                highestUnlockedLayerOrder,
                completedRequiredInteractions,
              );
              const requiredInteractionGate = getRequiredInteractionGate(
                layer.id,
                completedRequiredInteractions,
              );
              const accessibleSlot = world2EditorialSlots[layer.accessibleSlot];
              const isLocked = status === "locked";
              const isGated = status === "next-but-gated";
              const copy = layerCopy[layer.id];
              const connectorSrc =
                layer.order < highestUnlockedLayerOrder
                  ? world2RuntimeAssets.layerConnector
                  : world2RuntimeAssets.layerNavConnectorInactive;

              return (
                <div className="world2-layer-nav__item" key={layer.id}>
                  <button
                    className={`world2-layer-button world2-layer-button--${status}`}
                    data-world2-layer={layer.id}
                    data-layer-id={layer.order}
                    data-layer-state={status}
                    data-layer-locked={isLocked || isGated}
                    type="button"
                    aria-pressed={status === "active"}
                    aria-disabled={isLocked || isGated}
                    aria-label={
                      isGated && requiredInteractionGate
                        ? `Capa ${layer.order} de ${world2LayerCount}. ${copy.accessibleLabel}. Primero toca ${requiredInteractionCopy[requiredInteractionGate].triggerLabel}.`
                        : status === "next"
                          ? `Siguiente capa. Capa ${layer.order} de ${world2LayerCount}. ${copy.accessibleLabel} disponible.`
                          : `Capa ${layer.order} de ${world2LayerCount}. ${copy.accessibleLabel}. ${getStatusLabel(status)}.`
                    }
                    aria-describedby={`world2-accessible-${layer.id}`}
                    onClick={() => selectLayer(layer.id, index)}
                  >
                    <img
                      className="world2-layer-button__token world2-layer-button__token--base"
                      src={world2RuntimeAssets.layerNavTokenBase}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={world2RuntimeAssets.layerNavTokenBase}
                      loading="lazy"
                    />
                    {status === "active" ? (
                      <img
                        className="world2-layer-button__token world2-layer-button__token--active"
                        src={world2RuntimeAssets.layerNavTokenActive}
                        alt=""
                        aria-hidden="true"
                        data-runtime-asset={
                          world2RuntimeAssets.layerNavTokenActive
                        }
                        loading="lazy"
                      />
                    ) : null}
                    <span
                      className="world2-layer-button__glyph"
                      aria-hidden="true"
                      data-runtime-asset={world2RuntimeAssets.layerGlyphAtlas}
                      style={getLayerGlyphStyle(index)}
                    />
                    <span className="world2-layer-button__order">
                      {layer.order}
                    </span>
                    <span className="world2-layer-button__label">
                      {copy.navLabel}
                    </span>
                    {isLocked ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--locked"
                        aria-hidden="true"
                      >
                        -
                      </span>
                    ) : null}
                    {status === "completed" ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--complete"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    ) : null}
                    {status === "next" ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--next"
                        aria-hidden="true"
                      >
                        &gt;
                      </span>
                    ) : null}
                    {isGated ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--gated"
                        aria-hidden="true"
                      >
                        !
                      </span>
                    ) : null}
                    <span
                      className="world2-root-sr-only"
                      id={`world2-accessible-${layer.id}`}
                      data-world2-slot-id={accessibleSlot.slotId}
                      data-editorial-status="TEMP"
                    >
                      {`${copy.title}: ${copy.dialogue}`}
                    </span>
                  </button>
                  {index < world2LayerCount - 1 ? (
                    <img
                      className="world2-layer-nav__connector"
                      src={connectorSrc}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={connectorSrc}
                      loading="lazy"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>
      </section>
    </main>
  );
}
