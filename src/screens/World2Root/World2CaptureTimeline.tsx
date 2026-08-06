import "./World2CaptureTimeline.css";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { GestureHint } from "../../components/GestureHint/GestureHint";
import type { CaptureTimelineStepId } from "../../domain/checkpoints/world2Checkpoint";

export type { CaptureTimelineStepId } from "../../domain/checkpoints/world2Checkpoint";

type CaptureTimelineStep = {
  id: CaptureTimelineStepId;
  label: string;
  readout: string;
};

export const captureTimelineSteps: readonly CaptureTimelineStep[] = [
  {
    id: "contact",
    label: "Contacto",
    readout:
      "Aquí comienza la lectura. El electrodo entra en contacto con la planta sin producir música todavía: solo permite percibir una variación bioeléctrica muy pequeña.",
  },
  {
    id: "signal",
    label: "Señal tomada",
    readout:
      "La variación viaja por el sensor como una señal medible. En este punto aún conserva su forma original y todavía no ha sido limpiada ni transformada.",
  },
  {
    id: "system",
    label: "Datos al sistema",
    readout:
      "El sistema recibe y registra la señal. Ahora puede conservarla como datos para ordenarla, analizarla y prepararla en la siguiente etapa.",
  },
] as const;

type World2CaptureTimelineProps = {
  asset: string;
  completed: boolean;
  currentStepId: CaptureTimelineStepId;
  hasInteracted: boolean;
  onSelectStep: (stepId: CaptureTimelineStepId) => void;
  visitedStepIds: ReadonlySet<CaptureTimelineStepId>;
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
  onSelectStep,
  visitedStepIds,
}: World2CaptureTimelineProps) {
  const swipeZoneRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const currentStepIndex = captureTimelineSteps.findIndex(
    (step) => step.id === currentStepId,
  );
  const currentStep = captureTimelineSteps[currentStepIndex];

  function selectStepAtIndex(index: number) {
    const boundedIndex = Math.max(
      0,
      Math.min(captureTimelineSteps.length - 1, index),
    );
    onSelectStep(captureTimelineSteps[boundedIndex].id);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) {
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
      aria-label="Captura en tres pasos: contacto, señal tomada y datos al sistema"
    >
      <div className="world2-capture-timeline__header">
        <span className="world2-capture-timeline__eyebrow">CAPTURA</span>
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
        tabIndex={0}
        aria-label={`Zona de deslizamiento. Paso ${currentStepIndex + 1} de 3: ${currentStep.label}. Desliza a la izquierda para avanzar y a la derecha para volver.`}
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
        active={!hasInteracted && currentStepIndex === 0 && !completed}
        anchorRef={swipeZoneRef}
        className="world2-gesture-hint world2-gesture-hint--capture-swipe"
        completed={completed || hasInteracted}
        delayMs={2800}
        direction="left"
        targetLabel="Secuencia de Captura"
        variant="swipe-horizontal"
      />

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

      <div
        className="world2-capture-timeline__controls"
        role="group"
        aria-label="Elegir paso de Captura"
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
            aria-label={`Mostrar paso ${index + 1}: ${step.label}`}
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
