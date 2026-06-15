import "./World4RootScreen.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { worldFourToWorldFiveTransitionRoute } from "../../app/routes";
import { MobileShell } from "../../components/layout/MobileShell";
import {
  WORLD4_REQUIRED_SLOT_COUNT,
  world4EditorialSlots,
  world4NodeDefinitions,
} from "../../content/world4EditorialSlots";
import type { World4NodeId } from "../../content/world4EditorialSlots";

const world4NodeCount = world4NodeDefinitions.length;
const preparedExitTarget = worldFourToWorldFiveTransitionRoute;

type NodeInteractionState = "available" | "completed" | "locked";

function getNodeInteractionState(
  nodeIndex: number,
  currentNodeIndex: number,
): NodeInteractionState {
  if (currentNodeIndex >= world4NodeCount || nodeIndex < currentNodeIndex) {
    return "completed";
  }

  if (nodeIndex === currentNodeIndex || (currentNodeIndex === -1 && nodeIndex === 0)) {
    return "available";
  }

  return "locked";
}

export function World4RootScreen() {
  const navigate = useNavigate();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(-1);
  const [activeNodeId, setActiveNodeId] = useState<World4NodeId | null>(null);
  const activeNode = useMemo(
    () =>
      world4NodeDefinitions.find((node) => node.id === activeNodeId) ?? null,
    [activeNodeId],
  );
  const activeNodeIndex = activeNode
    ? world4NodeDefinitions.findIndex((node) => node.id === activeNode.id)
    : -1;
  const world4State =
    currentNodeIndex === -1
      ? "intro"
      : currentNodeIndex >= world4NodeCount
        ? "ready_to_continue"
        : world4NodeDefinitions[currentNodeIndex].id;
  const isReadyToContinue = world4State === "ready_to_continue";
  const confirmSlot =
    activeNode && activeNodeIndex === currentNodeIndex
      ? world4EditorialSlots[activeNode.confirmSlot]
      : null;

  function startExperience() {
    setCurrentNodeIndex(0);
    setActiveNodeId(world4NodeDefinitions[0].id);
  }

  function selectNode(nodeId: World4NodeId, nodeIndex: number) {
    const state = getNodeInteractionState(nodeIndex, currentNodeIndex);

    if (state === "locked") {
      return;
    }

    setActiveNodeId(nodeId);
  }

  function confirmActiveNode() {
    if (!activeNode || activeNodeIndex !== currentNodeIndex) {
      return;
    }

    if (currentNodeIndex >= world4NodeCount - 1) {
      setCurrentNodeIndex(world4NodeCount);
      setActiveNodeId(null);
      return;
    }

    const nextIndex = currentNodeIndex + 1;
    setCurrentNodeIndex(nextIndex);
    setActiveNodeId(world4NodeDefinitions[nextIndex].id);
  }

  return (
    <MobileShell eyebrow="Mundo IV temporal" title="Mundo IV: Mesa de Sistema">
      <div
        className="world4-root-experience"
        data-world4-experience="temporary"
        data-world4-editorial-source="excel_pending"
        data-world4-state={world4State}
        data-world4-slot-count={WORLD4_REQUIRED_SLOT_COUNT}
        data-world4-full-experience="temporary_complete"
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-daily-counter="not_implemented"
        data-world4-exit-target={isReadyToContinue ? preparedExitTarget : undefined}
        data-world4-exit-mode={
          isReadyToContinue ? "prepared_transition_world5_entry" : undefined
        }
      >
        <section
          className="world4-root-scene"
          aria-label={world4EditorialSlots.W4_ACCESSIBLE_SCENE_01.text}
          data-world4-slot-id="W4_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="world4-root-copy">
            <p className="world4-root-copy__eyebrow">
              Estación IV temporal
            </p>
            <h2>Mesa de sistema</h2>
            <p
              className="world4-root-copy__text world4-root-copy__text--lia"
              data-world4-slot-id="W4_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world4EditorialSlots.W4_INTRO_LIA_01.text}
            </p>
            <p
              className="world4-root-copy__text"
              data-world4-slot-id="W4_INTRO_SYS_01"
              data-editorial-status="TEMP"
            >
              {world4EditorialSlots.W4_INTRO_SYS_01.text}
            </p>
            {currentNodeIndex === -1 ? (
              <button
                className="world4-root-primary-action"
                type="button"
                onClick={startExperience}
              >
                Iniciar mesa temporal
              </button>
            ) : null}
          </div>
        </section>

        <section className="world4-root-nodes" aria-label="Nodos de Mundo IV">
          {world4NodeDefinitions.map((node, index) => {
            const state = getNodeInteractionState(index, currentNodeIndex);
            const isLocked = state === "locked";
            const isActive = activeNodeId === node.id;
            const accessibleSlot = world4EditorialSlots[node.accessibleSlot];

            return (
              <button
                className={`world4-root-node world4-root-node--${state}${isActive ? " world4-root-node--active" : ""}`}
                data-world4-node={node.id}
                data-node-state={state}
                data-world4-technical-node={node.label}
                data-testid="world4-technical-node"
                disabled={isLocked}
                key={node.id}
                type="button"
                aria-describedby={`world4-accessible-${node.id}`}
                aria-pressed={isActive}
                onClick={() => selectNode(node.id, index)}
              >
                <span className="world4-root-node__order">
                  {String(node.order).padStart(2, "0")}
                </span>
                <span className="world4-root-node__label">{node.label}</span>
                <span
                  className="world4-root-node__state"
                  data-world4-slot-id={
                    state === "completed"
                      ? "W4_NODE_REPEAT_01"
                      : state === "locked"
                        ? "W4_NODE_LOCKED_01"
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
                  className="world4-root-sr-only"
                  id={`world4-accessible-${node.id}`}
                  data-world4-slot-id={accessibleSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {accessibleSlot.text}
                </span>
              </button>
            );
          })}
        </section>

        <section
          className="world4-root-detail"
          aria-live="polite"
          data-world4-detail-state={world4State}
        >
          {activeNode ? (
            <>
              <p className="world4-root-detail__eyebrow">
                Nodo {activeNode.order} / {world4NodeCount}
              </p>
              <h2>{activeNode.label}</h2>
              <p
                className="world4-root-copy__text"
                data-world4-slot-id={activeNode.hintSlot}
                data-editorial-status="TEMP"
              >
                {world4EditorialSlots[activeNode.hintSlot].text}
              </p>
              <p
                className="world4-root-copy__text world4-root-copy__text--system"
                data-world4-slot-id={activeNode.cardSlot}
                data-editorial-status="TEMP"
              >
                {world4EditorialSlots[activeNode.cardSlot].text}
              </p>
              {activeNodeIndex < currentNodeIndex ||
              currentNodeIndex >= world4NodeCount ? (
                <p
                  className="world4-root-note"
                  data-world4-slot-id="W4_NODE_REPEAT_01"
                  data-editorial-status="TEMP"
                >
                  {world4EditorialSlots.W4_NODE_REPEAT_01.text}
                </p>
              ) : null}
              {confirmSlot ? (
                <button
                  className="world4-root-primary-action"
                  type="button"
                  onClick={confirmActiveNode}
                  data-world4-confirm-node={activeNode.id}
                  data-world4-slot-id={confirmSlot.slotId}
                  data-editorial-status="TEMP"
                >
                  {confirmSlot.text}
                </button>
              ) : null}
              {isReadyToContinue ? (
                <>
                  <p
                    className="world4-root-copy__text"
                    data-world4-slot-id="W4_COMPLETE_SYS_01"
                    data-editorial-status="TEMP"
                  >
                    {world4EditorialSlots.W4_COMPLETE_SYS_01.text}
                  </p>
                  <button
                    className="world4-root-primary-action world4-root-primary-action--continue"
                    type="button"
                    data-world4-slot-id="W4_CONTINUE_BTN_01"
                    data-world4-exit-action="navigate_to_world5_transition"
                    data-editorial-status="TEMP"
                    onClick={() => navigate(worldFourToWorldFiveTransitionRoute)}
                  >
                    {world4EditorialSlots.W4_CONTINUE_BTN_01.text}
                  </button>
                  <p className="world4-root-note">
                    Salida temporal hacia entrada base Mundo V; la experiencia
                    completa queda pendiente.
                  </p>
                </>
              ) : null}
            </>
          ) : isReadyToContinue ? (
            <>
              <p className="world4-root-detail__eyebrow">
                LISTO PARA CONTINUAR
              </p>
              <h2>Cadena técnica completa</h2>
              <p
                className="world4-root-copy__text world4-root-copy__text--lia"
                data-world4-slot-id="W4_COMPLETE_LIA_01"
                data-editorial-status="TEMP"
              >
                {world4EditorialSlots.W4_COMPLETE_LIA_01.text}
              </p>
              <p
                className="world4-root-copy__text"
                data-world4-slot-id="W4_COMPLETE_SYS_01"
                data-editorial-status="TEMP"
              >
                {world4EditorialSlots.W4_COMPLETE_SYS_01.text}
              </p>
              <button
                className="world4-root-primary-action world4-root-primary-action--continue"
                type="button"
                data-world4-slot-id="W4_CONTINUE_BTN_01"
                data-world4-exit-action="navigate_to_world5_transition"
                data-editorial-status="TEMP"
                onClick={() => navigate(worldFourToWorldFiveTransitionRoute)}
              >
                {world4EditorialSlots.W4_CONTINUE_BTN_01.text}
              </button>
              <p className="world4-root-note">
                Salida temporal hacia entrada base Mundo V; la experiencia
                completa queda pendiente.
              </p>
            </>
          ) : (
            <>
              <p className="world4-root-detail__eyebrow">INTRO</p>
              <h2>Secuencia técnica temporal</h2>
              <p
                className="world4-root-note"
                data-world4-slot-id="W4_NODE_LOCKED_01"
                data-editorial-status="TEMP"
              >
                {world4EditorialSlots.W4_NODE_LOCKED_01.text}
              </p>
            </>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
