import { useEffect, useMemo, useRef, useState } from "react";

import { PixelTypewriterText } from "./PixelTypewriterText";
import type { Station3PlantNarrativeStep } from "./station3Content";

export const PLANT_NARRATIVE_TYPEWRITER_SPEED_MS = 36;
export const PLANT_NARRATIVE_EXIT_MS = 300;

export type PlantNarrativeStage =
  | "step-1"
  | "step-2"
  | "step-3"
  | "summary";

type PlantNarrativeSequenceState =
  | "typing"
  | "holding"
  | "exiting"
  | "summary";

type PlantNarrativeSequenceProps = {
  active: boolean;
  steps: readonly Station3PlantNarrativeStep[];
  reducedMotion: boolean;
  revisit: boolean;
  onComplete: () => void;
  onStageChange?: (stage: PlantNarrativeStage) => void;
};

export function PlantNarrativeSequence({
  active,
  steps,
  reducedMotion,
  revisit,
  onComplete,
  onStageChange,
}: PlantNarrativeSequenceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [sequenceState, setSequenceState] =
    useState<PlantNarrativeSequenceState>(revisit ? "summary" : "typing");
  const onCompleteRef = useRef(onComplete);
  const onStageChangeRef = useRef(onStageChange);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStageChangeRef.current = onStageChange;
  }, [onComplete, onStageChange]);

  useEffect(() => {
    if (revisit) {
      setSequenceState("summary");
      onStageChangeRef.current?.("summary");
    }
  }, [revisit]);

  useEffect(() => {
    if (sequenceState === "summary") {
      onStageChangeRef.current?.("summary");
      return;
    }
    onStageChangeRef.current?.(`step-${stepIndex + 1}` as PlantNarrativeStage);
  }, [sequenceState, stepIndex]);

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
        onCompleteRef.current();
        return;
      }
      setStepIndex((current) => current + 1);
      setSequenceState("typing");
    }, PLANT_NARRATIVE_EXIT_MS);
    return () => window.clearTimeout(exitTimeout);
  }, [active, revisit, sequenceState, stepIndex, steps.length]);

  const currentStep = steps[stepIndex];
  const currentFragments = useMemo(
    () => (currentStep ? [currentStep.text] : []),
    [currentStep],
  );
  const stepMarker = sequenceState === "summary" ? "summary" : String(stepIndex + 1);
  const typedComplete = sequenceState !== "typing";

  return (
    <section
      className="s3-plant-narrative"
      data-station3-plant-sequence-step={stepMarker}
      data-station3-plant-sequence-state={sequenceState}
      data-station3-plant-sequence-motion={reducedMotion ? "reduced" : "normal"}
      data-station3-plant-typed-complete={typedComplete}
      data-station3-plant-typewriter={reducedMotion ? "instant-reduced" : "animated"}
      data-station3-plant-summary={sequenceState === "summary" ? "visible" : "hidden"}
      data-station3-plant-show-all="absent"
      data-station3-plant-zone="plant-narrative-summary"
      aria-label="Pistas de la planta"
    >
      <div className="s3-plant-narrative__live" aria-live="polite" aria-atomic="true">
        {sequenceState === "summary" ? (
          <ol className="s3-plant-narrative__summary">
            {steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
        ) : currentStep ? (
          <div
            className="s3-plant-narrative__message"
            data-station3-plant-message={currentStep.id}
            data-station3-plant-message-exiting={sequenceState === "exiting"}
          >
            <PixelTypewriterText
              key={currentStep.id}
              blockId={`plant-${currentStep.id}`}
              fragments={currentFragments}
              instant={reducedMotion}
              speedMs={PLANT_NARRATIVE_TYPEWRITER_SPEED_MS}
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
