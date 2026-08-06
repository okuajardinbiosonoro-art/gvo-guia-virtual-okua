import { useEffect, useRef, useState } from "react";

export type SonicConvergenceStage =
  | "intensity"
  | "rhythm"
  | "pitch"
  | "resolved";

type World2MediatedResultPanelProps = {
  complete: boolean;
  onComplete: () => void;
};

const stageSequence: Array<{
  delay: number;
  stage: SonicConvergenceStage;
}> = [
  { delay: 2100, stage: "rhythm" },
  { delay: 4200, stage: "pitch" },
  { delay: 6300, stage: "resolved" },
];

const stageLabels: Record<SonicConvergenceStage, string> = {
  intensity: "INTENSIDAD",
  rhythm: "RITMO",
  pitch: "ALTURA",
  resolved: "RESULTADO SONORO",
};

export function World2MediatedResultPanel({
  complete,
  onComplete,
}: World2MediatedResultPanelProps) {
  const [stage, setStage] = useState<SonicConvergenceStage>(
    complete ? "resolved" : "intensity",
  );
  const [sequenceFinished, setSequenceFinished] = useState(complete);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (complete) {
      setStage("resolved");
      setSequenceFinished(true);
      return;
    }

    if (sequenceFinished) {
      return;
    }

    const stageTimers = stageSequence.map(({ delay, stage: nextStage }) =>
      window.setTimeout(() => setStage(nextStage), delay),
    );
    const completionTimer = window.setTimeout(() => {
      setSequenceFinished(true);
      onCompleteRef.current();
    }, 9000);

    return () => {
      stageTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completionTimer);
    };
  }, [complete, sequenceFinished]);

  return (
    <div
      className="world2-sonic-convergence"
      role="group"
      aria-label="Convergencia sonora final de intensidad, ritmo y altura"
      data-world2-layer-visual="resultado_mediado"
      data-world2-option6-mode="final-sonic-convergence"
      data-world2-option6-stage={stage}
      data-world2-option6-simultaneous-primary-scenes="1"
      data-world2-option6-complete={complete}
      data-world2-option6-lia-role="activator-guide"
    >
      <div
        className="world2-sonic-convergence__scene"
        data-world2-option6-primary-scene="sonic-core"
      >
        <span className="world2-sonic-convergence__orbit" aria-hidden="true" />
        <span className="world2-sonic-convergence__energy" aria-hidden="true" />
        <div className="world2-sonic-convergence__core" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <svg
          className="world2-sonic-convergence__wave"
          viewBox="0 0 320 110"
          focusable="false"
          aria-hidden="true"
        >
          <path
            className="world2-sonic-convergence__wave-soft"
            d="M6 61 C42 38 68 42 98 60 S151 82 180 54 231 30 259 57 294 77 314 52"
            pathLength="1"
          />
          <path
            className="world2-sonic-convergence__wave-main"
            d="M6 58 C38 58 47 28 70 58 S105 86 128 54 164 20 190 57 225 91 249 50 285 26 314 58"
            pathLength="1"
          />
        </svg>
        <div className="world2-sonic-convergence__notation" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="world2-sonic-convergence__label" key={stage}>
          {stageLabels[stage]}
        </p>
      </div>
      {stage === "resolved" ? (
        <p className="world2-sonic-convergence__copy">
          Los parámetros se integran y dan forma al sonido.
        </p>
      ) : null}
    </div>
  );
}
