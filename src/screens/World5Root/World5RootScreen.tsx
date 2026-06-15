import "./World5RootScreen.css";

import { useMemo, useState } from "react";

import { MobileShell } from "../../components/layout/MobileShell";
import {
  WORLD5_REQUIRED_SLOT_COUNT,
  world5AreaDefinitions,
  world5EditorialSlots,
} from "../../content/world5EditorialSlots";
import type { World5AreaId } from "../../content/world5EditorialSlots";

const world5AreaCount = world5AreaDefinitions.length;
const preparedExitTarget = "/transition/world-5-to-final";

type AreaInteractionState = "available" | "completed" | "locked";

function getAreaInteractionState(
  areaIndex: number,
  currentAreaIndex: number,
): AreaInteractionState {
  if (currentAreaIndex >= world5AreaCount || areaIndex < currentAreaIndex) {
    return "completed";
  }

  if (areaIndex === currentAreaIndex || (currentAreaIndex === -1 && areaIndex === 0)) {
    return "available";
  }

  return "locked";
}

export function World5RootScreen() {
  const [currentAreaIndex, setCurrentAreaIndex] = useState(-1);
  const [activeAreaId, setActiveAreaId] = useState<World5AreaId | null>(null);
  const [exitAcknowledged, setExitAcknowledged] = useState(false);
  const activeArea = useMemo(
    () => world5AreaDefinitions.find((area) => area.id === activeAreaId) ?? null,
    [activeAreaId],
  );
  const activeAreaIndex = activeArea
    ? world5AreaDefinitions.findIndex((area) => area.id === activeArea.id)
    : -1;
  const world5State =
    currentAreaIndex === -1
      ? "intro"
      : currentAreaIndex >= world5AreaCount
        ? "ready_to_continue"
        : world5AreaDefinitions[currentAreaIndex].id;
  const isReadyToContinue = world5State === "ready_to_continue";
  const confirmSlot =
    activeArea && activeAreaIndex === currentAreaIndex
      ? world5EditorialSlots[activeArea.confirmSlot]
      : null;

  function startExperience() {
    setCurrentAreaIndex(0);
    setActiveAreaId(world5AreaDefinitions[0].id);
    setExitAcknowledged(false);
  }

  function selectArea(areaId: World5AreaId, areaIndex: number) {
    const state = getAreaInteractionState(areaIndex, currentAreaIndex);

    if (state === "locked") {
      return;
    }

    setActiveAreaId(areaId);
    setExitAcknowledged(false);
  }

  function confirmActiveArea() {
    if (!activeArea || activeAreaIndex !== currentAreaIndex) {
      return;
    }

    if (currentAreaIndex >= world5AreaCount - 1) {
      setCurrentAreaIndex(world5AreaCount);
      setActiveAreaId(null);
      return;
    }

    const nextIndex = currentAreaIndex + 1;
    setCurrentAreaIndex(nextIndex);
    setActiveAreaId(world5AreaDefinitions[nextIndex].id);
  }

  return (
    <MobileShell eyebrow="Mundo V temporal" title="Mundo V: Mapa del Presente">
      <div
        className="world5-root-experience"
        data-world5-experience="temporary"
        data-world5-editorial-source="excel_pending"
        data-world5-state={world5State}
        data-world5-slot-count={WORLD5_REQUIRED_SLOT_COUNT}
        data-world5-full-experience="temporary_complete"
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-daily-counter="not_implemented"
        data-final-screen="not_implemented"
        data-review-free-mode="not_implemented"
        data-world5-exit-target={isReadyToContinue ? preparedExitTarget : undefined}
        data-world5-exit-mode={
          isReadyToContinue ? "prepared_no_navigation" : undefined
        }
      >
        <section
          className="world5-root-scene"
          aria-label={world5EditorialSlots.W5_ACCESSIBLE_SCENE_01.text}
          data-world5-slot-id="W5_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="world5-root-map" aria-hidden="true">
            {world5AreaDefinitions.map((area, index) => {
              const state = getAreaInteractionState(index, currentAreaIndex);
              return (
              <span
                className={`world5-root-map__area world5-root-map__area--${state}`}
                data-world5-area={area.label}
                data-world5-area-order={area.order}
                data-area-state={state}
                key={area.id}
              >
                {area.label}
              </span>
              );
            })}
          </div>

          <div className="world5-root-copy">
            <p className="world5-root-copy__eyebrow">
              Estación V en preparación
            </p>
            <h2>Mapa del presente</h2>
            <p
              className="world5-root-copy__text world5-root-copy__text--lia"
              data-world5-slot-id="W5_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world5EditorialSlots.W5_INTRO_LIA_01.text}
            </p>
            <p
              className="world5-root-copy__text"
              data-world5-slot-id="W5_INTRO_AMB_01"
              data-editorial-status="TEMP"
            >
              {world5EditorialSlots.W5_INTRO_AMB_01.text}
            </p>
            {currentAreaIndex === -1 ? (
              <button
                className="world5-root-primary-action"
                type="button"
                onClick={startExperience}
              >
                Iniciar mapa temporal
              </button>
            ) : null}
          </div>
        </section>

        <section className="world5-root-areas" aria-label="Áreas de Mundo V">
          {world5AreaDefinitions.map((area, index) => {
            const state = getAreaInteractionState(index, currentAreaIndex);
            const isLocked = state === "locked";
            const isActive = activeAreaId === area.id;
            const accessibleSlot = world5EditorialSlots[area.accessibleSlot];

            return (
            <button
              className={`world5-root-area world5-root-area--${state}${isActive ? " world5-root-area--active" : ""}`}
              data-world5-area-id={area.id}
              data-world5-protected-area={area.label}
              data-area-state={state}
              disabled={isLocked}
              key={area.id}
              type="button"
              aria-describedby={`world5-accessible-${area.id}`}
              aria-pressed={isActive}
              onClick={() => selectArea(area.id, index)}
            >
              <span className="world5-root-area__order">
                {String(area.order).padStart(2, "0")}
              </span>
              <span className="world5-root-area__label">{area.label}</span>
              <span
                className="world5-root-area__state"
                data-world5-slot-id={
                  state === "completed"
                    ? "W5_AREA_REPEAT_01"
                    : state === "locked"
                      ? "W5_AREA_LOCKED_01"
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
                className="world5-root-sr-only"
                id={`world5-accessible-${area.id}`}
                data-world5-slot-id={accessibleSlot.slotId}
                data-editorial-status="TEMP"
              >
                {accessibleSlot.text}
              </span>
            </button>
            );
          })}
        </section>

        <section
          className="world5-root-detail"
          aria-live="polite"
          data-world5-detail-state={world5State}
        >
          {activeArea ? (
            <>
              <p className="world5-root-detail__eyebrow">
                Área {activeArea.order} / {world5AreaCount}
              </p>
              <h2>{activeArea.label}</h2>
              <p
                className="world5-root-copy__text"
                data-world5-slot-id={activeArea.hintSlot}
                data-editorial-status="TEMP"
              >
                {world5EditorialSlots[activeArea.hintSlot].text}
              </p>
              <p
                className="world5-root-copy__text world5-root-copy__text--ambient"
                data-world5-slot-id={activeArea.ambientSlot}
                data-editorial-status="TEMP"
              >
                {world5EditorialSlots[activeArea.ambientSlot].text}
              </p>
              {activeAreaIndex < currentAreaIndex ||
              currentAreaIndex >= world5AreaCount ? (
                <p
                  className="world5-root-note"
                  data-world5-slot-id="W5_AREA_REPEAT_01"
                  data-editorial-status="TEMP"
                >
                  {world5EditorialSlots.W5_AREA_REPEAT_01.text}
                </p>
              ) : null}
              {confirmSlot ? (
                <button
                  className="world5-root-primary-action"
                  type="button"
                  onClick={confirmActiveArea}
                  data-world5-confirm-area={activeArea.id}
                  data-world5-slot-id={confirmSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {confirmSlot.text}
                </button>
              ) : null}
            </>
          ) : isReadyToContinue ? (
            <>
              <p className="world5-root-detail__eyebrow">
                LISTO PARA CONTINUAR
              </p>
              <h2>Mapa del presente completo</h2>
              <p
                className="world5-root-copy__text world5-root-copy__text--lia"
                data-world5-slot-id="W5_COMPLETE_LIA_01"
                data-editorial-status="TEMP"
              >
                {world5EditorialSlots.W5_COMPLETE_LIA_01.text}
              </p>
              <p
                className="world5-root-copy__text"
                data-world5-slot-id="W5_COMPLETE_AMB_01"
                data-editorial-status="TEMP"
              >
                {world5EditorialSlots.W5_COMPLETE_AMB_01.text}
              </p>
              <button
                className="world5-root-primary-action world5-root-primary-action--continue"
                type="button"
                data-world5-slot-id="W5_FINAL_BTN_01"
                data-world5-exit-action="prepared_for_012b"
                data-editorial-status="TEMP"
                onClick={() => setExitAcknowledged(true)}
              >
                {world5EditorialSlots.W5_FINAL_BTN_01.text}
              </button>
              <p className="world5-root-note">
                Salida preparada hacia el siguiente tramo; no se construye el
                cierre completo en 012A.
              </p>
              {exitAcknowledged ? (
                <p className="world5-root-note" role="status">
                  Continuidad registrada: falta ticket específico para la
                  transición posterior.
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="world5-root-detail__eyebrow">INTRO</p>
              <h2>Secuencia temporal</h2>
              <p
                className="world5-root-note"
                data-world5-slot-id="W5_AREA_LOCKED_01"
                data-editorial-status="TEMP"
              >
                {world5EditorialSlots.W5_AREA_LOCKED_01.text}
              </p>
            </>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
