import "./World3RootScreen.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MobileShell } from "../../components/layout/MobileShell";
import { worldThreeToWorldFourTransitionRoute } from "../../app/routes";
import {
  WORLD3_REQUIRED_SLOT_COUNT,
  world3BlockDefinitions,
  world3EditorialSlots,
} from "../../content/world3EditorialSlots";
import type { World3BlockId } from "../../content/world3EditorialSlots";

const world3BlockCount = world3BlockDefinitions.length;
const preparedExitTarget = worldThreeToWorldFourTransitionRoute;

type BlockInteractionState = "available" | "completed" | "locked";

function getBlockInteractionState(
  blockIndex: number,
  currentBlockIndex: number,
): BlockInteractionState {
  if (currentBlockIndex >= world3BlockCount || blockIndex < currentBlockIndex) {
    return "completed";
  }

  if (blockIndex === currentBlockIndex || (currentBlockIndex === -1 && blockIndex === 0)) {
    return "available";
  }

  return "locked";
}

export function World3RootScreen() {
  const navigate = useNavigate();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  const [activeBlockId, setActiveBlockId] = useState<World3BlockId | null>(null);
  const activeBlock = useMemo(
    () =>
      world3BlockDefinitions.find((block) => block.id === activeBlockId) ??
      null,
    [activeBlockId],
  );
  const activeBlockIndex = activeBlock
    ? world3BlockDefinitions.findIndex((block) => block.id === activeBlock.id)
    : -1;
  const world3State =
    currentBlockIndex === -1
      ? "intro"
      : currentBlockIndex >= world3BlockCount
        ? "ready_to_continue"
        : world3BlockDefinitions[currentBlockIndex].id;
  const isReadyToContinue = world3State === "ready_to_continue";
  const confirmSlot =
    activeBlock && activeBlockIndex === currentBlockIndex
      ? world3EditorialSlots[activeBlock.confirmSlot]
      : null;

  function startExperience() {
    setCurrentBlockIndex(0);
    setActiveBlockId(world3BlockDefinitions[0].id);
  }

  function selectBlock(blockId: World3BlockId, blockIndex: number) {
    const state = getBlockInteractionState(blockIndex, currentBlockIndex);

    if (state === "locked") {
      return;
    }

    setActiveBlockId(blockId);
  }

  function confirmActiveBlock() {
    if (!activeBlock || activeBlockIndex !== currentBlockIndex) {
      return;
    }

    if (currentBlockIndex >= world3BlockCount - 1) {
      setCurrentBlockIndex(world3BlockCount);
      setActiveBlockId(null);
      return;
    }

    const nextIndex = currentBlockIndex + 1;
    setCurrentBlockIndex(nextIndex);
    setActiveBlockId(world3BlockDefinitions[nextIndex].id);
  }

  return (
    <MobileShell eyebrow="Mundo III temporal" title="Mundo III: Cuaderno Pixel">
      <div
        className="world3-root-experience"
        data-world3-experience="temporary"
        data-world3-editorial-source="excel_pending"
        data-world3-state={world3State}
        data-world3-slot-count={WORLD3_REQUIRED_SLOT_COUNT}
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-world3-exit-target={
          isReadyToContinue ? preparedExitTarget : undefined
        }
        data-world3-exit-mode={
          isReadyToContinue ? "prepared_transition_placeholder" : undefined
        }
      >
        <section
          className="world3-root-scene"
          aria-label={world3EditorialSlots.W3_ACCESSIBLE_SCENE_01.text}
          data-world3-slot-id="W3_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="world3-root-sequence" aria-hidden="true">
            {world3BlockDefinitions.map((block, index) => {
              const state = getBlockInteractionState(index, currentBlockIndex);
              return (
                <span
                  className={`world3-root-sequence__step world3-root-sequence__step--${state}`}
                  data-world3-sequence-step={block.id}
                  data-step-state={state}
                  key={block.id}
                >
                  {block.label}
                </span>
              );
            })}
          </div>

          <div className="world3-root-copy">
            <p className="world3-root-copy__eyebrow">
              Estación III temporal
            </p>
            <h2>Cuaderno de pruebas y ajustes</h2>
            <p
              className="world3-root-copy__text world3-root-copy__text--lia"
              data-world3-slot-id="W3_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world3EditorialSlots.W3_INTRO_LIA_01.text}
            </p>
            <p
              className="world3-root-copy__text"
              data-world3-slot-id="W3_INTRO_AMB_01"
              data-editorial-status="TEMP"
            >
              {world3EditorialSlots.W3_INTRO_AMB_01.text}
            </p>
            {currentBlockIndex === -1 ? (
              <button
                className="world3-root-primary-action"
                type="button"
                onClick={startExperience}
              >
                Abrir cuaderno temporal
              </button>
            ) : null}
          </div>
        </section>

        <section className="world3-root-blocks" aria-label="Bloques de Mundo III">
          {world3BlockDefinitions.map((block, index) => {
            const state = getBlockInteractionState(index, currentBlockIndex);
            const isLocked = state === "locked";
            const isActive = activeBlockId === block.id;
            const accessibleSlot = world3EditorialSlots[block.accessibleSlot];

            return (
              <button
                className={`world3-root-block world3-root-block--${state}${isActive ? " world3-root-block--active" : ""}`}
                data-world3-block={block.id}
                data-block-state={state}
                disabled={isLocked}
                key={block.id}
                type="button"
                aria-describedby={`world3-accessible-${block.id}`}
                aria-pressed={isActive}
                onClick={() => selectBlock(block.id, index)}
              >
                <span className="world3-root-block__order">
                  {String(block.order).padStart(2, "0")}
                </span>
                <span className="world3-root-block__label">{block.label}</span>
                <span
                  className="world3-root-block__state"
                  data-world3-slot-id={
                    state === "completed"
                      ? "W3_BLOCK_REPEAT_01"
                      : state === "locked"
                        ? "W3_BLOCK_LOCKED_01"
                        : undefined
                  }
                >
                  {state === "completed"
                    ? "Releer"
                    : state === "locked"
                      ? "Bloqueado"
                      : "Disponible"}
                </span>
                <span
                  className="world3-root-sr-only"
                  id={`world3-accessible-${block.id}`}
                  data-world3-slot-id={accessibleSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {accessibleSlot.text}
                </span>
              </button>
            );
          })}
        </section>

        <section
          className="world3-root-detail"
          aria-live="polite"
          data-world3-detail-state={world3State}
        >
          {activeBlock ? (
            <>
              <p className="world3-root-detail__eyebrow">
                Registro {activeBlock.order} / {world3BlockCount}
              </p>
              <h2>{activeBlock.label}</h2>
              <p
                className="world3-root-copy__text"
                data-world3-slot-id={activeBlock.hintSlot}
                data-editorial-status="TEMP"
              >
                {world3EditorialSlots[activeBlock.hintSlot].text}
              </p>
              <p
                className="world3-root-copy__text world3-root-copy__text--ambient"
                data-world3-slot-id={activeBlock.noteSlot}
                data-editorial-status="TEMP"
              >
                {world3EditorialSlots[activeBlock.noteSlot].text}
              </p>
              {activeBlockIndex < currentBlockIndex ||
              currentBlockIndex >= world3BlockCount ? (
                <p
                  className="world3-root-note"
                  data-world3-slot-id="W3_BLOCK_REPEAT_01"
                  data-editorial-status="TEMP"
                >
                  {world3EditorialSlots.W3_BLOCK_REPEAT_01.text}
                </p>
              ) : null}
              {confirmSlot ? (
                <button
                  className="world3-root-primary-action"
                  type="button"
                  onClick={confirmActiveBlock}
                  data-world3-confirm-block={activeBlock.id}
                  data-world3-slot-id={confirmSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {confirmSlot.text}
                </button>
              ) : null}
            </>
          ) : isReadyToContinue ? (
            <>
              <p className="world3-root-detail__eyebrow">
                LISTO PARA CONTINUAR
              </p>
              <h2>Prueba convertida en ajuste</h2>
              <p
                className="world3-root-copy__text world3-root-copy__text--lia"
                data-world3-slot-id="W3_COMPLETE_LIA_01"
                data-editorial-status="TEMP"
              >
                {world3EditorialSlots.W3_COMPLETE_LIA_01.text}
              </p>
              <button
                className="world3-root-primary-action world3-root-primary-action--continue"
                type="button"
                data-world3-slot-id="W3_CONTINUE_BTN_01"
                data-world3-exit-action="navigate_to_transition_placeholder"
                data-editorial-status="TEMP"
                onClick={() => navigate(worldThreeToWorldFourTransitionRoute)}
              >
                {world3EditorialSlots.W3_CONTINUE_BTN_01.text}
              </button>
              <p className="world3-root-note">
                Salida preparada hacia transición temporal; Mundo IV permanece
                como placeholder.
              </p>
            </>
          ) : (
            <>
              <p className="world3-root-detail__eyebrow">INTRO</p>
              <h2>Secuencia temporal</h2>
              <p
                className="world3-root-note"
                data-world3-slot-id="W3_BLOCK_LOCKED_01"
                data-editorial-status="TEMP"
              >
                {world3EditorialSlots.W3_BLOCK_LOCKED_01.text}
              </p>
            </>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
