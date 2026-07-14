import { useEffect, useMemo, useRef, useState } from "react";

import { PixelTypewriterText } from "./PixelTypewriterText";
import type { Station3PrototypeNarrativeStep } from "./station3Content";

export const PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS = 36;
export const PROTOTYPE_NARRATIVE_EXIT_MS = 300;
export const PROTOTYPE_NARRATIVE_READY_DELAY_MS = 120;

export type PrototypeNarrativeStage =
  | "assembly"
  | "testing"
  | "learning"
  | "summary";

type PrototypeNarrativeSequenceState =
  | "typing"
  | "holding"
  | "exiting"
  | "summary";

type PrototypeNarrativeSequenceProps = {
  active: boolean;
  steps: readonly Station3PrototypeNarrativeStep[];
  reducedMotion: boolean;
  revisit: boolean;
  startStage?: PrototypeNarrativeStage;
  onComplete: () => void;
  onStageChange?: (stage: PrototypeNarrativeStage) => void;
};

export function PrototypeNarrativeSequence({
  active,
  steps,
  reducedMotion,
  revisit,
  startStage = "assembly",
  onComplete,
  onStageChange,
}: PrototypeNarrativeSequenceProps) {
  const [stepIndex, setStepIndex] = useState(() => {
    if (startStage === "summary") {
      return Math.max(0, steps.length - 1);
    }
    const resumedIndex = steps.findIndex((step) => step.id === startStage);
    return resumedIndex >= 0 ? resumedIndex : 0;
  });
  const [sequenceState, setSequenceState] =
    useState<PrototypeNarrativeSequenceState>(
      revisit || startStage === "summary" ? "summary" : "typing",
    );
  const onCompleteRef = useRef(onComplete);
  const onStageChangeRef = useRef(onStageChange);
  const completionNotifiedRef = useRef(revisit);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStageChangeRef.current = onStageChange;
  }, [onComplete, onStageChange]);

  useEffect(() => {
    if (revisit) {
      completionNotifiedRef.current = true;
      setSequenceState("summary");
    }
  }, [revisit]);

  useEffect(() => {
    if (sequenceState === "summary") {
      onStageChangeRef.current?.("summary");
      return;
    }
    onStageChangeRef.current?.(steps[stepIndex]?.id ?? "assembly");
  }, [sequenceState, stepIndex, steps]);

  useEffect(() => {
    if (
      !active ||
      revisit ||
      sequenceState !== "holding" ||
      !steps[stepIndex]
    ) {
      return undefined;
    }

    const holdTimeout = window.setTimeout(
      () => setSequenceState("exiting"),
      steps[stepIndex].holdMs,
    );
    return () => window.clearTimeout(holdTimeout);
  }, [active, revisit, sequenceState, stepIndex, steps]);

  useEffect(() => {
    if (!active || revisit || sequenceState !== "exiting") {
      return undefined;
    }

    const exitTimeout = window.setTimeout(() => {
      if (stepIndex === steps.length - 1) {
        setSequenceState("summary");
        return;
      }
      setStepIndex((current) => current + 1);
      setSequenceState("typing");
    }, PROTOTYPE_NARRATIVE_EXIT_MS);
    return () => window.clearTimeout(exitTimeout);
  }, [active, revisit, sequenceState, stepIndex, steps.length]);

  useEffect(() => {
    if (
      !active ||
      revisit ||
      sequenceState !== "summary" ||
      completionNotifiedRef.current
    ) {
      return undefined;
    }

    const readyTimeout = window.setTimeout(() => {
      completionNotifiedRef.current = true;
      onCompleteRef.current();
    }, PROTOTYPE_NARRATIVE_READY_DELAY_MS);
    return () => window.clearTimeout(readyTimeout);
  }, [active, revisit, sequenceState]);

  const currentStep = steps[stepIndex];
  const currentFragments = useMemo(
    () => (currentStep ? [currentStep.text] : []),
    [currentStep],
  );
  const stage = sequenceState === "summary" ? "summary" : currentStep?.id;
  const stepMarker = sequenceState === "summary" ? "summary" : String(stepIndex + 1);

  return (
    <section
      className="s3-prototype-narrative"
      data-station3-prototype-sequence-stage={stage}
      data-station3-prototype-sequence-step={stepMarker}
      data-station3-prototype-sequence-state={sequenceState}
      data-station3-prototype-sequence-motion={reducedMotion ? "reduced" : "normal"}
      data-station3-prototype-typewriter={reducedMotion ? "instant-reduced" : "animated"}
      data-station3-prototype-summary={sequenceState === "summary" ? "visible" : "hidden"}
      data-station3-prototype-show-all="absent"
      data-station3-prototype-zone="prototype-build-log"
      aria-label="Bitácora de construcción del prototipo"
    >
      <div
        className="s3-prototype-narrative__live"
        aria-live="polite"
        aria-atomic="true"
      >
        {sequenceState === "summary" ? (
          <ol className="s3-prototype-narrative__summary">
            {steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
        ) : currentStep ? (
          <div
            className="s3-prototype-narrative__message"
            data-station3-prototype-message={currentStep.id}
            data-station3-prototype-message-exiting={sequenceState === "exiting"}
          >
            <PixelTypewriterText
              key={currentStep.id}
              blockId={`prototype-${currentStep.id}`}
              fragments={currentFragments}
              instant={reducedMotion}
              speedMs={PROTOTYPE_NARRATIVE_TYPEWRITER_SPEED_MS}
              startKey={currentStep.id}
              onComplete={() => setSequenceState("holding")}
              allowManualComplete={false}
              showCompleteControl={false}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
