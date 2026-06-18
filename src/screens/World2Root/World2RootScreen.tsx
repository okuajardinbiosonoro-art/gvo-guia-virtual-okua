import "./World2RootScreen.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import { MobileShell } from "../../components/layout/MobileShell";
import {
  world2EditorialSlots,
  world2LayerDefinitions,
  type World2LayerId,
} from "../../content/world2EditorialSlots";
import { getStationById } from "../../data/stations";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

const worldTwoStation = getStationById(2);
const world2LayerCount = world2LayerDefinitions.length;
const preparedExitTarget = worldTwoToWorldThreeTransitionRoute;

type LayerStatus = "locked" | "available" | "active" | "completed";

type LayerVisual = {
  src: string;
  className: string;
  alt: string;
};

const layerVisuals: Record<World2LayerId, LayerVisual> = {
  planta_viva: {
    src: world2RuntimeAssets.plantAura,
    className: "world2-root-layer-visual world2-root-layer-visual--plant-aura",
    alt: "Aura suave alrededor de la planta viva.",
  },
  senal: {
    src: world2RuntimeAssets.signalThreads,
    className: "world2-root-layer-visual world2-root-layer-visual--signal",
    alt: "Hilos de señal bioeléctrica alrededor de la planta.",
  },
  captura: {
    src: world2RuntimeAssets.captureContact,
    className: "world2-root-layer-visual world2-root-layer-visual--capture",
    alt: "Contacto de captura de la señal viva.",
  },
  acondicionamiento: {
    src: world2RuntimeAssets.conditioningField,
    className:
      "world2-root-layer-visual world2-root-layer-visual--conditioning",
    alt: "Campo de acondicionamiento de la señal.",
  },
  mapeo: {
    src: world2RuntimeAssets.mappingConstellation,
    className: "world2-root-layer-visual world2-root-layer-visual--mapping",
    alt: "Constelación de mapeo de la señal.",
  },
  resultado_mediado: {
    src: world2RuntimeAssets.mediatedResult,
    className: "world2-root-layer-visual world2-root-layer-visual--result",
    alt: "Resultado mediado de la señal preparada.",
  },
};

const liaPoseByLayer: Record<World2LayerId, string> = {
  planta_viva: world2RuntimeAssets.liaGreeting,
  senal: world2RuntimeAssets.liaPoint,
  captura: world2RuntimeAssets.liaExplainCalm,
  acondicionamiento: world2RuntimeAssets.liaExplainCalm,
  mapeo: world2RuntimeAssets.liaPoint,
  resultado_mediado: world2RuntimeAssets.liaActivate,
};

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

export function World2RootScreen() {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);
  const [activeLayerId, setActiveLayerId] = useState<World2LayerId>("planta_viva");
  const [softMessage, setSoftMessage] = useState<string | null>(null);
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
  const isReadyToContinue = completedCount >= world2LayerCount;
  const world2State = isReadyToContinue ? "ready_to_continue" : activeLayer.id;
  const confirmSlot =
    activeLayerIndex === completedCount && !isReadyToContinue
      ? world2EditorialSlots[activeLayer.confirmSlot]
      : null;
  const activeDialogue =
    softMessage ??
    (isReadyToContinue
      ? world2EditorialSlots.W2_COMPLETE_LIA_01.text
      : world2EditorialSlots[activeLayer.hintSlot].text);
  const activeAmbient =
    isReadyToContinue
      ? world2EditorialSlots.W2_COMPLETE_AMB_01.text
      : world2EditorialSlots[activeLayer.ambientSlot].text;
  const activeLiaPose = isReadyToContinue
    ? world2RuntimeAssets.liaActivate
    : liaPoseByLayer[activeLayer.id];
  const layerVisual = layerVisuals[activeLayer.id];

  function selectLayer(layerId: World2LayerId, layerIndex: number) {
    const status = getLayerStatus(layerIndex, activeLayerId, completedCount);

    if (status === "locked") {
      setSoftMessage(world2EditorialSlots.W2_LAYER_LOCKED_01.text);
      return;
    }

    setSoftMessage(
      layerIndex < completedCount
        ? "TEMP — Puedes revisar cualquier capa del pulso invisible."
        : null,
    );
    setActiveLayerId(layerId);
  }

  function confirmActiveLayer() {
    if (activeLayerIndex !== completedCount || isReadyToContinue) {
      return;
    }

    const nextCompletedCount = completedCount + 1;
    setCompletedCount(nextCompletedCount);
    setSoftMessage(null);

    if (nextCompletedCount < world2LayerCount) {
      setActiveLayerId(world2LayerDefinitions[nextCompletedCount].id);
    }
  }

  return (
    <MobileShell
      eyebrow="Mundo II"
      title={worldTwoStation?.world ?? "Mundo II"}
    >
      <div
        className="world2-root-experience"
        data-world2-experience="runtime-base"
        data-world2-runtime-version="015A"
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
      >
        <section
          className="world2-root-stage"
          aria-label={world2EditorialSlots.W2_ACCESSIBLE_SCENE_01.text}
          data-world2-slot-id="W2_ACCESSIBLE_SCENE_01"
        >
          {initialPreload.ready ? null : (
            <p className="world2-root-preload-status" role="status">
              Preparando pulso invisible...
            </p>
          )}
          <div className="world2-root-stage__visual" aria-hidden="true">
            <img
              className="world2-root-img world2-root-img--background"
              src={world2RuntimeAssets.background}
              alt=""
              data-runtime-asset={world2RuntimeAssets.background}
              fetchPriority="high"
            />
            <img
              className="world2-root-img world2-root-img--haze"
              src={world2RuntimeAssets.ambientHaze}
              alt=""
              data-runtime-asset={world2RuntimeAssets.ambientHaze}
            />
            <img
              className="world2-root-img world2-root-img--foreground"
              src={world2RuntimeAssets.foregroundSilhouette}
              alt=""
              data-runtime-asset={world2RuntimeAssets.foregroundSilhouette}
              loading="lazy"
            />
            <img
              className="world2-root-img world2-root-img--route"
              src={world2RuntimeAssets.routeBase}
              alt=""
              data-runtime-asset={world2RuntimeAssets.routeBase}
              loading="lazy"
            />
            {completedCount > 0 || activeLayer.id !== "planta_viva" ? (
              <img
                className="world2-root-img world2-root-img--route-active"
                src={world2RuntimeAssets.routeActive}
                alt=""
                data-runtime-asset={world2RuntimeAssets.routeActive}
                loading="lazy"
              />
            ) : null}
            <img
              className="world2-root-img world2-root-img--plant"
              src={world2RuntimeAssets.plant}
              alt=""
              data-runtime-asset={world2RuntimeAssets.plant}
              fetchPriority="high"
            />
            <img
              className={layerVisual.className}
              src={layerVisual.src}
              alt=""
              data-runtime-asset={layerVisual.src}
              data-world2-layer-visual={activeLayer.id}
              loading="lazy"
            />
            {activeLayer.id !== "planta_viva" || completedCount > 1 ? (
              <img
                className="world2-root-layer-visual world2-root-layer-visual--waveform"
                src={world2RuntimeAssets.rawWaveform}
                alt=""
                data-runtime-asset={world2RuntimeAssets.rawWaveform}
                loading="lazy"
              />
            ) : null}
            <img
              className="world2-root-img world2-root-img--lia-halo"
              src={world2RuntimeAssets.liaHalo}
              alt=""
              data-runtime-asset={world2RuntimeAssets.liaHalo}
              loading="lazy"
            />
            <img
              className="world2-root-img world2-root-img--lia"
              src={activeLiaPose}
              alt=""
              data-runtime-asset={activeLiaPose}
              data-lia-source="repo-existing-2-5d"
            />
            <img
              className="world2-root-img world2-root-img--lia-wisps"
              src={world2RuntimeAssets.liaWisps}
              alt=""
              data-runtime-asset={world2RuntimeAssets.liaWisps}
              loading="lazy"
            />
            <img
              className="world2-root-img world2-root-img--lia-trail"
              src={world2RuntimeAssets.liaSparkleTrail}
              alt=""
              data-runtime-asset={world2RuntimeAssets.liaSparkleTrail}
              loading="lazy"
            />
            <div
              className="world2-root-micro-scene"
              data-world2-micro-scene={activeLayer.id}
            >
              <img
                className="world2-root-micro-scene__frame"
                src={world2RuntimeAssets.microFrame}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microFrame}
                loading="lazy"
              />
              <img
                className="world2-root-micro-scene__base"
                src={world2RuntimeAssets.microBase}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microBase}
                loading="lazy"
              />
              <img
                className="world2-root-micro-scene__focus"
                src={world2RuntimeAssets.microFocusGlow}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microFocusGlow}
                loading="lazy"
              />
              <img
                className="world2-root-micro-scene__reticle"
                src={world2RuntimeAssets.microCaptureReticle}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microCaptureReticle}
                loading="lazy"
              />
              <img
                className="world2-root-micro-scene__connector"
                src={world2RuntimeAssets.microConnector}
                alt=""
                data-runtime-asset={world2RuntimeAssets.microConnector}
                loading="lazy"
              />
            </div>
          </div>

          <article
            className="world2-root-dialogue"
            aria-live="polite"
            data-world2-dialogue-layer={activeLayer.id}
          >
            <img
              className="world2-root-dialogue__asset world2-root-dialogue__asset--backplate"
              src={world2RuntimeAssets.dialogueBackplate}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world2RuntimeAssets.dialogueBackplate}
            />
            <img
              className="world2-root-dialogue__asset world2-root-dialogue__asset--glow"
              src={world2RuntimeAssets.dialogueGlow}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world2RuntimeAssets.dialogueGlow}
              loading="lazy"
            />
            <img
              className="world2-root-dialogue__asset world2-root-dialogue__asset--title"
              src={world2RuntimeAssets.dialogueTitleGlow}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world2RuntimeAssets.dialogueTitleGlow}
              loading="lazy"
            />
            <img
              className="world2-root-dialogue__asset world2-root-dialogue__asset--tail"
              src={world2RuntimeAssets.dialogueTail}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world2RuntimeAssets.dialogueTail}
              loading="lazy"
            />
            <img
              className="world2-root-dialogue__asset world2-root-dialogue__asset--lia-focus"
              src={world2RuntimeAssets.liaDialogueGlow}
              alt=""
              aria-hidden="true"
              data-runtime-asset={world2RuntimeAssets.liaDialogueGlow}
              loading="lazy"
            />
            <div className="world2-root-dialogue__content">
              <p className="world2-root-dialogue__eyebrow">
                {isReadyToContinue
                  ? "Resultado mediado"
                  : `Capa ${activeLayer.order} de ${world2LayerCount}`}
              </p>
              <h2>{isReadyToContinue ? "La señal ya fue mediada" : activeLayer.label}</h2>
              <p
                className="world2-root-copy world2-root-copy--lia"
                data-world2-slot-id={
                  isReadyToContinue
                    ? "W2_COMPLETE_LIA_01"
                    : activeLayer.hintSlot
                }
                data-editorial-status="TEMP"
              >
                {activeDialogue}
              </p>
              <p
                className="world2-root-copy world2-root-copy--ambient"
                data-world2-slot-id={
                  isReadyToContinue
                    ? "W2_COMPLETE_AMB_01"
                    : activeLayer.ambientSlot
                }
                data-editorial-status="TEMP"
              >
                {activeAmbient}
              </p>
              {activeLayerIndex < completedCount && !isReadyToContinue ? (
                <p
                  className="world2-root-review-note"
                  data-world2-slot-id="W2_LAYER_REPEAT_01"
                  data-editorial-status="TEMP"
                >
                  {world2EditorialSlots.W2_LAYER_REPEAT_01.text}
                </p>
              ) : null}
              {confirmSlot ? (
                <button
                  className="world2-root-primary-action"
                  type="button"
                  onClick={confirmActiveLayer}
                  data-world2-confirm-layer={activeLayer.id}
                  data-world2-slot-id={confirmSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {confirmSlot.text}
                </button>
              ) : null}
              {isReadyToContinue ? (
                <button
                  className="world2-root-primary-action world2-root-primary-action--continue"
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
                  <span>{world2EditorialSlots.W2_CONTINUE_BTN_01.text}</span>
                </button>
              ) : (
                <p className="world2-root-continue-note">
                  Aún falta completar el recorrido de la señal.
                </p>
              )}
            </div>
          </article>
        </section>

        <nav className="world2-root-layer-nav" aria-label="Capas de Mundo II">
          {world2LayerDefinitions.map((layer, index) => {
            const status = getLayerStatus(index, activeLayerId, completedCount);
            const accessibleSlot = world2EditorialSlots[layer.accessibleSlot];
            const isLocked = status === "locked";
            const isCompleted = status === "completed";

            return (
              <button
                className={`world2-root-layer-button world2-root-layer-button--${status}`}
                data-world2-layer={layer.id}
                data-layer-state={status}
                data-layer-locked={isLocked}
                key={layer.id}
                type="button"
                aria-pressed={status === "active"}
                aria-label={`Capa ${layer.order} de ${world2LayerCount}. ${layer.label}. ${getStatusLabel(status)}.`}
                aria-describedby={`world2-accessible-${layer.id}`}
                onClick={() => selectLayer(layer.id, index)}
              >
                <img
                  className="world2-root-layer-button__frame"
                  src={world2RuntimeAssets.layerNavFrame}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world2RuntimeAssets.layerNavFrame}
                />
                {status === "active" ? (
                  <img
                    className="world2-root-layer-button__active"
                    src={world2RuntimeAssets.layerActiveGlow}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={world2RuntimeAssets.layerActiveGlow}
                  />
                ) : null}
                {index > 0 && index <= completedCount ? (
                  <img
                    className="world2-root-layer-button__connector"
                    src={world2RuntimeAssets.layerConnector}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={world2RuntimeAssets.layerConnector}
                  />
                ) : null}
                <img
                  className="world2-root-layer-button__glyphs"
                  src={world2RuntimeAssets.layerGlyphAtlas}
                  alt=""
                  aria-hidden="true"
                  data-runtime-asset={world2RuntimeAssets.layerGlyphAtlas}
                />
                <span className="world2-root-layer-button__order">
                  {layer.order}
                </span>
                <span className="world2-root-layer-button__label">
                  {layer.label}
                </span>
                {isLocked || isCompleted ? (
                  <img
                    className="world2-root-layer-button__state-icon"
                    src={
                      isCompleted
                        ? world2RuntimeAssets.layerCompleteGlyph
                        : world2RuntimeAssets.layerLockGlyph
                    }
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={
                      isCompleted
                        ? world2RuntimeAssets.layerCompleteGlyph
                        : world2RuntimeAssets.layerLockGlyph
                    }
                  />
                ) : null}
                <span
                  className="world2-root-sr-only"
                  id={`world2-accessible-${layer.id}`}
                  data-world2-slot-id={accessibleSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {accessibleSlot.text}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </MobileShell>
  );
}
