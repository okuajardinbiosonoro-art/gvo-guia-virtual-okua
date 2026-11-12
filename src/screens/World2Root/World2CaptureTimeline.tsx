import "./World2CaptureTimeline.css";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { GestureHint } from "../../components/GestureHint/GestureHint";
import type { CaptureTimelineStepId } from "../../domain/checkpoints/world2Checkpoint";
import { getWorld2Content } from "../../content/world2EditorialSlots";

export type { CaptureTimelineStepId } from "../../domain/checkpoints/world2Checkpoint";

export const captureTimelineSteps = getWorld2Content("es").capture;

type World2CaptureTimelineProps = {
  asset: string;
  completed: boolean;
  currentStepId: CaptureTimelineStepId;
  hasInteracted: boolean;
  readoutPlacement?: "scene" | "dialogue";
  onSelectStep: (stepId: CaptureTimelineStepId) => void;
  visitedStepIds: ReadonlySet<CaptureTimelineStepId>;
  active?: boolean;
  locale?: "es" | "en";
};

type PointerStart = {
  id: number;
  x: number;
  y: number;
};

const minimumSwipeDistance = 38;

export function World2CaptureTimeline({
  asset,
  completed,
  currentStepId,
  hasInteracted,
  readoutPlacement = "scene",
  onSelectStep,
  visitedStepIds,
  active = true,
  locale = "es",
}: World2CaptureTimelineProps) {
  const captureTimelineSteps = getWorld2Content(locale).capture;
  const en = locale === "en";
  const swipeZoneRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const currentStepIndex = captureTimelineSteps.findIndex(
    (step) => step.id === currentStepId,
  );
  const currentStep = captureTimelineSteps[currentStepIndex];

  function selectStepAtIndex(index: number) {
    if (!active) return;
    const boundedIndex = Math.max(
      0,
      Math.min(captureTimelineSteps.length - 1, index),
    );
    onSelectStep(captureTimelineSteps[boundedIndex].id);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!active || !event.isPrimary || event.button !== 0) {
      return;
    }

    pointerStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const pointerStart = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!pointerStart || pointerStart.id !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= minimumSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (!isHorizontalSwipe) {
      return;
    }

    event.preventDefault();
    selectStepAtIndex(currentStepIndex + (deltaX < 0 ? 1 : -1));
  }

  return (
    <section
      className="world2-capture-timeline"
      data-world2-capture-complete={completed ? "true" : "false"}
      data-world2-capture-gesture="swipe-horizontal"
      data-world2-capture-step={currentStep.id}
      data-world2-capture-timeline="016R"
      data-world2-capture-typography="gvo-app-ui-016S1"
      data-world2-capture-visited={captureTimelineSteps
        .filter((step) => visitedStepIds.has(step.id))
        .map((step) => step.id)
        .join(",")}
      aria-label={en ? "Capture in three steps: contact, captured signal and data to the system" : "Captura en tres pasos: contacto, señal tomada y datos al sistema"}
    >
      <div className="world2-capture-timeline__header">
        <strong
          className="world2-capture-timeline__progress"
          data-world2-capture-progress={`${currentStepIndex + 1}/3`}
        >
          {currentStepIndex + 1} / 3
        </strong>
      </div>

      <div
        ref={swipeZoneRef}
        className="world2-capture-timeline__swipe-zone"
        data-world2-capture-interaction="swipe-timeline"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            selectStepAtIndex(currentStepIndex + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectStepAtIndex(currentStepIndex - 1);
          }
        }}
        onPointerCancel={() => {
          pointerStartRef.current = null;
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        role="group"
        tabIndex={active ? 0 : -1}
        aria-label={en ? `Swipe area. Step ${currentStepIndex + 1} of 3: ${currentStep.label}. Swipe left to move forward and right to go back.` : `Zona de deslizamiento. Paso ${currentStepIndex + 1} de 3: ${currentStep.label}. Desliza a la izquierda para avanzar y a la derecha para volver.`}
      >
        <img
          className="world2-capture-timeline__asset"
          src={asset}
          alt=""
          aria-hidden="true"
          data-runtime-asset={asset}
          data-world2-layer-visual="captura"
          data-world2-visual-role="acquisition-chain-timeline"
          draggable={false}
        />
        <span className="world2-capture-timeline__focus" aria-hidden="true" />
        <span
          className="world2-capture-timeline__step-label"
          data-world2-capture-label={currentStep.id}
        >
          {currentStep.label}
        </span>
      </div>

      <GestureHint
        active={active && !hasInteracted && currentStepIndex === 0 && !completed}
        anchorRef={swipeZoneRef}
        className="world2-gesture-hint world2-gesture-hint--capture-swipe"
        completed={completed || hasInteracted}
        delayMs={2800}
        direction="left"
        targetLabel={en ? "Capture sequence" : "Secuencia de Captura"}
        variant="swipe-horizontal"
      />

      {readoutPlacement === "scene" ? (
        <div
          className="world2-capture-timeline__readout"
          data-world2-capture-readout={currentStep.id}
          data-world2-capture-readout-style="local-lia-note"
          data-world2-capture-readout-typography="gvo-app-ui"
          role="note"
          aria-live="polite"
        >
          <strong>{currentStep.label}</strong>
          <p>{currentStep.readout}</p>
        </div>
      ) : null}

      <div
        className="world2-capture-timeline__controls"
        role="group"
        aria-label={en ? "Choose a Capture step" : "Elegir paso de Captura"}
      >
        {captureTimelineSteps.map((step, index) => (
          <button
            className="world2-capture-timeline__step-control"
            type="button"
            data-world2-capture-control={step.id}
            data-world2-capture-interaction={
              step.id === "system" ? "datos-al-sistema" : undefined
            }
            data-world2-required-interaction={
              step.id === "system" ? "capture_data_readout_seen" : undefined
            }
            data-world2-capture-control-visited={
              visitedStepIds.has(step.id) ? "true" : "false"
            }
            aria-label={en ? `Show step ${index + 1}: ${step.label}` : `Mostrar paso ${index + 1}: ${step.label}`}
            disabled={!active}
            aria-pressed={step.id === currentStep.id}
            onClick={() => onSelectStep(step.id)}
            key={step.id}
          >
            <span>{index + 1}</span>
            <span className="world2-capture-timeline__control-label">
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
