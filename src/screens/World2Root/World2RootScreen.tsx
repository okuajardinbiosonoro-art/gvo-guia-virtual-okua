import "./World2RootScreen.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MobileShell } from "../../components/layout/MobileShell";
import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import { world2EditorialSlots, world2LayerDefinitions } from "../../content/world2EditorialSlots";
import type { World2LayerId } from "../../content/world2EditorialSlots";
import { getStationById } from "../../data/stations";

const worldTwoStation = getStationById(2);
const world2LayerCount = world2LayerDefinitions.length;
const preparedExitTarget = worldTwoToWorldThreeTransitionRoute;

type LayerInteractionState = "available" | "completed" | "locked";

function getLayerInteractionState(
  layerIndex: number,
  currentLayerIndex: number,
): LayerInteractionState {
  if (currentLayerIndex >= world2LayerCount || layerIndex < currentLayerIndex) {
    return "completed";
  }

  if (layerIndex === currentLayerIndex || (currentLayerIndex === -1 && layerIndex === 0)) {
    return "available";
  }

  return "locked";
}

export function World2RootScreen() {
  const navigate = useNavigate();
  const [currentLayerIndex, setCurrentLayerIndex] = useState(-1);
  const [activeLayerId, setActiveLayerId] = useState<World2LayerId | null>(null);
  const activeLayer = useMemo(
    () =>
      world2LayerDefinitions.find((layer) => layer.id === activeLayerId) ??
      null,
    [activeLayerId],
  );
  const activeLayerIndex = activeLayer
    ? world2LayerDefinitions.findIndex((layer) => layer.id === activeLayer.id)
    : -1;
  const world2State =
    currentLayerIndex === -1
      ? "intro"
      : currentLayerIndex >= world2LayerCount
        ? "ready_to_continue"
        : world2LayerDefinitions[currentLayerIndex].id;
  const isReadyToContinue = world2State === "ready_to_continue";
  const confirmSlot =
    activeLayer && activeLayerIndex === currentLayerIndex
      ? world2EditorialSlots[activeLayer.confirmSlot]
      : null;

  function startExperience() {
    setCurrentLayerIndex(0);
    setActiveLayerId(world2LayerDefinitions[0].id);
  }

  function selectLayer(layerId: World2LayerId, layerIndex: number) {
    const state = getLayerInteractionState(layerIndex, currentLayerIndex);

    if (state === "locked") {
      return;
    }

    setActiveLayerId(layerId);
  }

  function confirmActiveLayer() {
    if (!activeLayer || activeLayerIndex !== currentLayerIndex) {
      return;
    }

    if (currentLayerIndex >= world2LayerCount - 1) {
      setCurrentLayerIndex(world2LayerCount);
      setActiveLayerId(null);
      return;
    }

    const nextIndex = currentLayerIndex + 1;
    setCurrentLayerIndex(nextIndex);
    setActiveLayerId(world2LayerDefinitions[nextIndex].id);
  }

  return (
    <MobileShell
      eyebrow="Mundo II temporal"
      title={worldTwoStation?.world ?? "Mundo II"}
    >
      <div
        className="world2-root-experience"
        data-world2-experience="temporary"
        data-world2-editorial-source="excel_pending"
        data-world2-state={world2State}
        data-world2-slot-count={Object.keys(world2EditorialSlots).length}
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-world2-exit-target={
          isReadyToContinue ? preparedExitTarget : undefined
        }
        data-world2-exit-mode={
          isReadyToContinue ? "prepared_no_navigation" : undefined
        }
      >
        <section
          className="world2-root-scene"
          aria-label={world2EditorialSlots.W2_ACCESSIBLE_SCENE_01.text}
          data-world2-slot-id="W2_ACCESSIBLE_SCENE_01"
        >
          <div className="world2-root-pulse" aria-hidden="true">
            {world2LayerDefinitions.map((layer, index) => {
              const state = getLayerInteractionState(index, currentLayerIndex);
              return (
                <span
                  className={`world2-root-pulse__node world2-root-pulse__node--${state}`}
                  data-world2-pulse-node={layer.id}
                  data-node-state={state}
                  key={layer.id}
                />
              );
            })}
          </div>

          <div className="world2-root-intro">
            <p
              className="world2-root-copy world2-root-copy--lia"
              data-world2-slot-id="W2_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world2EditorialSlots.W2_INTRO_LIA_01.text}
            </p>
            <p
              className="world2-root-copy"
              data-world2-slot-id="W2_INTRO_AMB_01"
              data-editorial-status="TEMP"
            >
              {world2EditorialSlots.W2_INTRO_AMB_01.text}
            </p>
            {currentLayerIndex === -1 ? (
              <button
                className="world2-root-primary-action"
                type="button"
                onClick={startExperience}
              >
                Iniciar lectura temporal
              </button>
            ) : null}
          </div>
        </section>

        <section className="world2-root-layers" aria-label="Capas de Mundo II">
          {world2LayerDefinitions.map((layer, index) => {
            const state = getLayerInteractionState(index, currentLayerIndex);
            const isLocked = state === "locked";
            const isActive = activeLayerId === layer.id;
            const accessibleSlot = world2EditorialSlots[layer.accessibleSlot];

            return (
              <button
                className={`world2-root-layer world2-root-layer--${state}${isActive ? " world2-root-layer--active" : ""}`}
                data-world2-layer={layer.id}
                data-layer-state={state}
                disabled={isLocked}
                key={layer.id}
                type="button"
                aria-describedby={`world2-accessible-${layer.id}`}
                aria-pressed={isActive}
                onClick={() => selectLayer(layer.id, index)}
              >
                <span className="world2-root-layer__order">
                  {String(layer.order).padStart(2, "0")}
                </span>
                <span className="world2-root-layer__label">{layer.label}</span>
                <span
                  className="world2-root-layer__state"
                  data-world2-slot-id={
                    state === "completed"
                      ? "W2_LAYER_REPEAT_01"
                      : state === "locked"
                        ? "W2_LAYER_LOCKED_01"
                        : undefined
                  }
                >
                  {state === "completed"
                    ? "Releer"
                    : state === "locked"
                      ? "Bloqueada"
                      : "Disponible"}
                </span>
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
        </section>

        <section
          className="world2-root-detail"
          aria-live="polite"
          data-world2-detail-state={world2State}
        >
          {activeLayer ? (
            <>
              <p className="world2-root-detail__eyebrow">
                Capa {activeLayer.order} / {world2LayerCount}
              </p>
              <h2>{activeLayer.label}</h2>
              <p
                className="world2-root-copy"
                data-world2-slot-id={activeLayer.hintSlot}
                data-editorial-status="TEMP"
              >
                {world2EditorialSlots[activeLayer.hintSlot].text}
              </p>
              <p
                className="world2-root-copy world2-root-copy--ambient"
                data-world2-slot-id={activeLayer.ambientSlot}
                data-editorial-status="TEMP"
              >
                {world2EditorialSlots[activeLayer.ambientSlot].text}
              </p>
              {activeLayerIndex < currentLayerIndex ||
              currentLayerIndex >= world2LayerCount ? (
                <p
                  className="world2-root-repeat"
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
            </>
          ) : isReadyToContinue ? (
            <>
              <p className="world2-root-detail__eyebrow">
                LISTO PARA CONTINUAR
              </p>
              <h2>Camino temporal completo</h2>
              <p
                className="world2-root-copy world2-root-copy--lia"
                data-world2-slot-id="W2_COMPLETE_LIA_01"
                data-editorial-status="TEMP"
              >
                {world2EditorialSlots.W2_COMPLETE_LIA_01.text}
              </p>
              <p
                className="world2-root-copy"
                data-world2-slot-id="W2_COMPLETE_AMB_01"
                data-editorial-status="TEMP"
              >
                {world2EditorialSlots.W2_COMPLETE_AMB_01.text}
              </p>
              <button
                className="world2-root-primary-action world2-root-primary-action--continue"
                type="button"
                data-world2-slot-id="W2_CONTINUE_BTN_01"
                data-world2-exit-action="navigate_to_transition"
                data-editorial-status="TEMP"
                onClick={() => navigate(worldTwoToWorldThreeTransitionRoute)}
              >
                {world2EditorialSlots.W2_CONTINUE_BTN_01.text}
              </button>
            </>
          ) : (
            <>
              <p className="world2-root-detail__eyebrow">INTRO</p>
              <h2>Secuencia temporal</h2>
              <p className="world2-root-copy">
                La experiencia abre una lectura por capas sin presentar textos
                finales ni audio real.
              </p>
              <p
                className="world2-root-repeat"
                data-world2-slot-id="W2_LAYER_LOCKED_01"
                data-editorial-status="TEMP"
              >
                {world2EditorialSlots.W2_LAYER_LOCKED_01.text}
              </p>
            </>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
