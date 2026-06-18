import "./World2RootScreen.css";

import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import {
  world2EditorialSlots,
  world2LayerDefinitions,
  type World2LayerId,
} from "../../content/world2EditorialSlots";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

const world2LayerCount = world2LayerDefinitions.length;
const preparedExitTarget = worldTwoToWorldThreeTransitionRoute;

type LayerStatus = "locked" | "available" | "active" | "completed";

type LayerVisual = {
  src: string;
  className: string;
};

type LayerCopy = {
  accessibleLabel: string;
  ambient: string;
  dialogue: string;
  navLabel: string;
  title: string;
};

type LayerGlyphStyle = CSSProperties & {
  "--world2-layer-glyph": string;
  "--world2-layer-glyph-position": string;
  "--world2-layer-frame": string;
};

const layerCopy: Record<World2LayerId, LayerCopy> = {
  planta_viva: {
    accessibleLabel: "Planta viva",
    ambient: "Antes de cualquier sonido, hay vida y relación.",
    dialogue:
      "Esta es la planta viva. Antes de cualquier sonido, hay vida y relación.",
    navLabel: "Planta",
    title: "Planta viva",
  },
  senal: {
    accessibleLabel: "Señal bioeléctrica",
    ambient: "La señal existe como dato antes de volverse música.",
    dialogue: "Esto es señal. No es música todavía.",
    navLabel: "Señal",
    title: "Señal",
  },
  captura: {
    accessibleLabel: "Captura",
    ambient: "La variación se recibe con cuidado para poder leerse.",
    dialogue: "El sistema capta la señal para que pueda ser leída.",
    navLabel: "Captura",
    title: "Captura",
  },
  acondicionamiento: {
    accessibleLabel: "Acondicionamiento",
    ambient: "La señal se ordena antes de interpretarse.",
    dialogue: "La señal se prepara antes de interpretarse.",
    navLabel: "Acond.",
    title: "Acondicionamiento",
  },
  mapeo: {
    accessibleLabel: "Mapeo",
    ambient: "Los datos toman forma para volverse comprensibles.",
    dialogue: "Aquí la señal se interpreta y se mapea.",
    navLabel: "Mapeo",
    title: "Mapeo",
  },
  resultado_mediado: {
    accessibleLabel: "Resultado mediado",
    ambient: "Lo que escuchamos es una mediación, no una voz directa.",
    dialogue:
      "El sonido final es mediado. No sale directamente de la planta.",
    navLabel: "Resultado",
    title: "Resultado mediado",
  },
};

const cleanMessages = {
  intro: "Aquí empieza el pulso invisible. Vamos capa por capa.",
  locked:
    "Vamos paso a paso. Primero necesitamos entender la capa anterior.",
  review: "Puedes revisar cualquier capa ya abierta sin perder el recorrido.",
  complete:
    "El pulso invisible ya está mediado. Podemos continuar con el recorrido.",
} as const;

const layerVisuals: Record<World2LayerId, LayerVisual> = {
  planta_viva: {
    src: world2RuntimeAssets.plantAura,
    className: "world2-layer-asset world2-layer-asset--plant-aura",
  },
  senal: {
    src: world2RuntimeAssets.signalThreads,
    className: "world2-layer-asset world2-layer-asset--signal-threads",
  },
  captura: {
    src: world2RuntimeAssets.captureContact,
    className: "world2-layer-asset world2-layer-asset--capture-contact",
  },
  acondicionamiento: {
    src: world2RuntimeAssets.conditioningField,
    className: "world2-layer-asset world2-layer-asset--conditioning",
  },
  mapeo: {
    src: world2RuntimeAssets.mappingConstellation,
    className: "world2-layer-asset world2-layer-asset--mapping",
  },
  resultado_mediado: {
    src: world2RuntimeAssets.mediatedResult,
    className: "world2-layer-asset world2-layer-asset--result",
  },
};

const liaPoseByLayer: Record<World2LayerId, string> = {
  planta_viva: world2RuntimeAssets.liaIdle,
  senal: world2RuntimeAssets.liaPoint,
  captura: world2RuntimeAssets.liaExplainCalm,
  acondicionamiento: world2RuntimeAssets.liaExplainCalm,
  mapeo: world2RuntimeAssets.liaPoint,
  resultado_mediado: world2RuntimeAssets.liaGreeting,
};

const microSceneLayers = new Set<World2LayerId>([
  "captura",
  "mapeo",
  "resultado_mediado",
]);

function getLayerIndex(layerId: World2LayerId) {
  return world2LayerDefinitions.findIndex((layer) => layer.id === layerId);
}

function getLayerStatus(
  layerIndex: number,
  activeLayerId: World2LayerId,
  completedCount: number,
): LayerStatus {
  const activeLayerIndex = getLayerIndex(activeLayerId);

  if (layerIndex === activeLayerIndex) {
    return "active";
  }

  if (layerIndex < completedCount) {
    return "completed";
  }

  if (layerIndex === completedCount) {
    return "available";
  }

  return "locked";
}

function getStatusLabel(status: LayerStatus) {
  return {
    active: "activo",
    available: "disponible",
    completed: "completado",
    locked: "bloqueado",
  }[status];
}

function getLayerGlyphStyle(index: number): LayerGlyphStyle {
  return {
    "--world2-layer-glyph": `url(${world2RuntimeAssets.layerGlyphAtlas})`,
    "--world2-layer-glyph-position": `${index * 20}% 0%`,
    "--world2-layer-frame": `url(${world2RuntimeAssets.layerNavFrame})`,
  };
}

export function World2RootScreen() {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);
  const [activeLayerId, setActiveLayerId] =
    useState<World2LayerId>("planta_viva");
  const [softMessage, setSoftMessage] = useState<string | null>(
    cleanMessages.intro,
  );
  const initialPreload = useAssetPreloader(screenAssetBundles.world2RootInitial, {
    timeoutMs: 9000,
  });
  const activeLayer = useMemo(
    () =>
      world2LayerDefinitions.find((layer) => layer.id === activeLayerId) ??
      world2LayerDefinitions[0],
    [activeLayerId],
  );
  const activeLayerIndex = getLayerIndex(activeLayer.id);
  const activeCopy = layerCopy[activeLayer.id];
  const isReadyToContinue = completedCount >= world2LayerCount;
  const world2State = isReadyToContinue ? "ready_to_continue" : activeLayer.id;
  const confirmSlot =
    activeLayerIndex === completedCount && !isReadyToContinue
      ? world2EditorialSlots[activeLayer.confirmSlot]
      : null;
  const activeDialogue =
    softMessage ??
    (isReadyToContinue ? cleanMessages.complete : activeCopy.dialogue);
  const activeAmbient = isReadyToContinue
    ? "La ruta de mediación queda completa para continuar."
    : activeCopy.ambient;
  const activeLiaPose = isReadyToContinue
    ? world2RuntimeAssets.liaGreeting
    : liaPoseByLayer[activeLayer.id];
  const layerVisual = layerVisuals[activeLayer.id];
  const showRouteBase = activeLayer.id !== "planta_viva" || completedCount > 0;
  const showWaveform =
    activeLayer.id !== "planta_viva" || completedCount >= 2;
  const showMicroScene = microSceneLayers.has(activeLayer.id) && !isReadyToContinue;
  const showLiaHalo = activeLayer.id !== "planta_viva" && !isReadyToContinue;
  const showRouteActive =
    completedCount > 0 && activeLayer.id !== "planta_viva";

  function selectLayer(layerId: World2LayerId, layerIndex: number) {
    const status = getLayerStatus(layerIndex, activeLayerId, completedCount);

    if (status === "locked") {
      setSoftMessage(cleanMessages.locked);
      return;
    }

    setSoftMessage(layerIndex < completedCount ? cleanMessages.review : null);
    setActiveLayerId(layerId);
  }

  function confirmActiveLayer() {
    if (activeLayerIndex !== completedCount || isReadyToContinue) {
      return;
    }

    const nextCompletedCount = completedCount + 1;
    setCompletedCount(nextCompletedCount);

    if (nextCompletedCount < world2LayerCount) {
      setActiveLayerId(world2LayerDefinitions[nextCompletedCount].id);
      setSoftMessage(null);
      return;
    }

    setSoftMessage(cleanMessages.complete);
  }

  return (
    <main
      className="world2-root-screen"
      data-world2-experience="visual-composition-reset"
      data-world2-runtime-version="015C"
      data-world2-editorial-source="excel_pending"
      data-world2-state={world2State}
      data-world2-active-layer={activeLayer.id}
      data-world2-completed-count={completedCount}
      data-world2-slot-count={Object.keys(world2EditorialSlots).length}
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
        <img
          className="world2-scene-asset world2-scene-asset--haze"
          src={world2RuntimeAssets.ambientHaze}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.ambientHaze}
          fetchPriority="high"
        />
        <img
          className="world2-scene-asset world2-scene-asset--silhouette"
          src={world2RuntimeAssets.foregroundSilhouette}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.foregroundSilhouette}
          loading="lazy"
        />

        <header className="world2-scene-title">
          <p>ESTACIÓN II</p>
          <span>MUNDO II</span>
          <h1 id="world2-root-title">Lía y el pulso invisible</h1>
        </header>

        <div className="world2-route-field" aria-hidden="true">
          {showRouteBase ? (
            <img
              className="world2-scene-asset world2-scene-asset--route-base"
              src={world2RuntimeAssets.routeBase}
              alt=""
              data-runtime-asset={world2RuntimeAssets.routeBase}
              loading="lazy"
            />
          ) : null}
          {showRouteActive ? (
            <img
              className="world2-scene-asset world2-scene-asset--route-active"
              src={
                isReadyToContinue
                  ? world2RuntimeAssets.readyPath
                  : world2RuntimeAssets.routeActive
              }
              alt=""
              data-runtime-asset={
                isReadyToContinue
                  ? world2RuntimeAssets.readyPath
                  : world2RuntimeAssets.routeActive
              }
              data-world2-route-progress={world2State}
              loading="lazy"
            />
          ) : null}
        </div>

        <img
          className="world2-scene-asset world2-scene-asset--plant"
          src={world2RuntimeAssets.plant}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.plant}
          fetchPriority="high"
        />
        <img
          className={layerVisual.className}
          src={layerVisual.src}
          alt=""
          aria-hidden="true"
          data-runtime-asset={layerVisual.src}
          data-world2-layer-visual={activeLayer.id}
          loading="lazy"
        />
        {showWaveform ? (
          <img
            className="world2-layer-asset world2-layer-asset--waveform"
            src={world2RuntimeAssets.rawWaveform}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world2RuntimeAssets.rawWaveform}
            loading="lazy"
          />
        ) : null}

        {showMicroScene ? (
          <div
            className="world2-micro-scene world2-micro-scene--visible"
            data-world2-micro-scene={activeLayer.id}
            aria-hidden="true"
          >
            <img
              className="world2-micro-scene__asset world2-micro-scene__asset--frame"
              src={world2RuntimeAssets.microFrame}
              alt=""
              data-runtime-asset={world2RuntimeAssets.microFrame}
              loading="lazy"
            />
            {activeLayer.id === "captura" ? (
              <img
                className="world2-micro-scene__asset world2-micro-scene__asset--reticle"
                src={world2RuntimeAssets.microCaptureReticle}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microCaptureReticle}
                loading="lazy"
              />
            ) : (
              <img
                className="world2-micro-scene__asset world2-micro-scene__asset--base"
                src={world2RuntimeAssets.microBase}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microBase}
                loading="lazy"
              />
            )}
          </div>
        ) : null}

        <div className="world2-lia-field" aria-hidden="true">
          {showLiaHalo ? (
            <img
              className="world2-scene-asset world2-scene-asset--lia-halo"
              src={world2RuntimeAssets.liaHalo}
              alt=""
              data-runtime-asset={world2RuntimeAssets.liaHalo}
              loading="lazy"
            />
          ) : null}
          <img
            className="world2-scene-asset world2-scene-asset--lia"
            src={activeLiaPose}
            alt=""
            data-runtime-asset={activeLiaPose}
            data-lia-source="repo-existing-2-5d"
            fetchPriority="high"
          />
          {activeLayer.id === "senal" ? (
            <img
              className="world2-scene-asset world2-scene-asset--lia-wisps"
              src={world2RuntimeAssets.liaWisps}
              alt=""
              data-runtime-asset={world2RuntimeAssets.liaWisps}
              loading="lazy"
            />
          ) : null}
        </div>

        <article
          className="world2-dialogue"
          aria-live="polite"
          data-world2-dialogue-layer={activeLayer.id}
        >
          <img
            className="world2-dialogue__asset world2-dialogue__asset--backplate"
            src={world2RuntimeAssets.dialogueBackplate}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world2RuntimeAssets.dialogueBackplate}
          />
          <img
            className="world2-dialogue__asset world2-dialogue__asset--tail"
            src={world2RuntimeAssets.dialogueTail}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world2RuntimeAssets.dialogueTail}
            loading="lazy"
          />
          <div className="world2-dialogue__content">
            <p className="world2-dialogue__eyebrow">
              {isReadyToContinue ? "Recorrido completo" : activeCopy.title}
            </p>
            <p
              className="world2-dialogue__copy"
              data-world2-slot-id={
                isReadyToContinue
                  ? "W2_COMPLETE_LIA_01"
                  : activeLayer.hintSlot
              }
              data-editorial-status="TEMP"
            >
              {activeDialogue}
            </p>
            <p className="world2-dialogue__ambient">{activeAmbient}</p>
            <div className="world2-dialogue__actions">
              {confirmSlot ? (
                <button
                  className="world2-action world2-action--next"
                  type="button"
                  onClick={confirmActiveLayer}
                  data-world2-confirm-layer={activeLayer.id}
                  data-world2-slot-id={confirmSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  Siguiente
                </button>
              ) : null}
              {isReadyToContinue ? (
                <button
                  className="world2-action world2-action--continue"
                  type="button"
                  data-world2-slot-id="W2_CONTINUE_BTN_01"
                  data-world2-exit-action="navigate_to_transition"
                  data-editorial-status="TEMP"
                  onClick={() => navigate(worldTwoToWorldThreeTransitionRoute)}
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
        </article>

        <nav className="world2-layer-nav" aria-label="Capas de Mundo II">
          {world2LayerDefinitions.map((layer, index) => {
            const status = getLayerStatus(index, activeLayerId, completedCount);
            const accessibleSlot = world2EditorialSlots[layer.accessibleSlot];
            const isLocked = status === "locked";
            const copy = layerCopy[layer.id];

            return (
              <button
                className={`world2-layer-button world2-layer-button--${status}`}
                data-world2-layer={layer.id}
                data-layer-state={status}
                data-layer-locked={isLocked}
                key={layer.id}
                type="button"
                aria-pressed={status === "active"}
                aria-label={`Capa ${layer.order} de ${world2LayerCount}. ${copy.accessibleLabel}. ${getStatusLabel(status)}.`}
                aria-describedby={`world2-accessible-${layer.id}`}
                onClick={() => selectLayer(layer.id, index)}
              >
                <span className="world2-layer-button__frame" aria-hidden="true" />
                {status === "active" ? (
                  <img
                    className="world2-layer-button__active"
                    src={world2RuntimeAssets.layerActiveGlow}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={world2RuntimeAssets.layerActiveGlow}
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
                    className="world2-layer-button__state-icon"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                ) : null}
                {status === "completed" ? (
                  <span
                    className="world2-layer-button__state-icon world2-layer-button__state-icon--complete"
                    aria-hidden="true"
                  >
                    ✓
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
            );
          })}
        </nav>
      </section>
    </main>
  );
}
