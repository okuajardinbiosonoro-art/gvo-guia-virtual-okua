import { useEffect, useRef, useState } from "react";

export type SonicConvergenceStage =
  | "intensity"
  | "rhythm"
  | "pitch"
  | "resolved";

type World2MediatedResultPanelProps = {
  complete: boolean;
  active?: boolean;
  locale?: "es" | "en";
  showResultRequested?: boolean;
  onComplete: (mode: "standard" | "assisted") => void;
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
  active = true,
  locale = "es",
  showResultRequested = false,
  onComplete,
}: World2MediatedResultPanelProps) {
  const [stage, setStage] = useState<SonicConvergenceStage>(
    complete ? "resolved" : "intensity",
  );
  const [sequenceFinished, setSequenceFinished] = useState(complete);
  const onCompleteRef = useRef(onComplete);
  const completionMode = useRef<"standard" | "assisted">("standard");
  const notified = useRef(complete);
  const elapsed = useRef(0);
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const en = locale === "en";

  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (active && showResultRequested) {
      completionMode.current = "assisted";
      setStage("resolved");
      setSequenceFinished(true);
    }
  }, [active, showResultRequested]);

  useEffect(() => {
    if (!active || !visible) return;
    if (complete) {
      setStage("resolved");
      setSequenceFinished(true);
      return;
    }

    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
      !sequenceFinished
    ) {
      setStage("resolved");
      setSequenceFinished(true);
      return;
    }

    if (sequenceFinished) {
      return;
    }

    const started = window.performance.now();
    const stageTimers = stageSequence.filter(({ delay }) => delay > elapsed.current).map(({ delay, stage: nextStage }) =>
      window.setTimeout(() => setStage(nextStage), delay - elapsed.current),
    );
    const completionTimer = window.setTimeout(() => {
      setSequenceFinished(true);
    }, Math.max(0, 9000 - elapsed.current));

    return () => {
      stageTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completionTimer);
      elapsed.current = Math.min(9000, elapsed.current + window.performance.now() - started);
    };
  }, [active, visible, complete, sequenceFinished]);

  useEffect(() => {
    if (!active || !visible || !sequenceFinished || stage !== "resolved" || notified.current) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        notified.current = true;
        onCompleteRef.current(completionMode.current);
      });
    });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [active, visible, sequenceFinished, stage]);

  return (
    <div
      className="world2-sonic-convergence"
      role="group"
      aria-label={en ? "Final convergence of intensity, rhythm and pitch" : "Convergencia sonora final de intensidad, ritmo y altura"}
      data-world2-layer-visual="resultado_mediado"
      data-world2-option6-mode="final-sonic-convergence"
      data-world2-option6-stage={stage}
      data-world2-option6-simultaneous-primary-scenes="1"
      data-world2-option6-complete={complete}
      data-world2-option6-lia-role="activator-guide"
      data-lia-action={stage === "resolved" ? "respond" : "present"}
      data-lia-target={stage}
      data-motion-active={active && visible}
    >
      <div
        className="world2-sonic-convergence__scene"
        data-world2-option6-primary-scene="sonic-core"
      >
        <span className="world2-sonic-convergence__orbit" aria-hidden="true" />
        <span className="world2-sonic-convergence__energy" aria-hidden="true" />
        <button
          className="world2-sonic-convergence__core"
          type="button"
          aria-label={en ? "Show result" : "Ver resultado"}
          disabled={!active}
          aria-pressed={sequenceFinished}
          onClick={() => {
            if (sequenceFinished) return;
            completionMode.current = "assisted";
            setStage("resolved");
            setSequenceFinished(true);
          }}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          {!sequenceFinished ? <span className="world2-sonic-convergence__prompt">{en ? "Show result" : "Ver resultado"}</span> : null}
        </button>
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
          {en ? { intensity: "INTENSITY", rhythm: "RHYTHM", pitch: "PITCH", resolved: "SONIC RESULT" }[stage] : stageLabels[stage]}
        </p>
      </div>
      {stage === "resolved" ? (
        <p className="world2-sonic-convergence__copy">
          {en ? "The parameters come together and give shape to the sound." : "Los parámetros se integran y dan forma al sonido."}
        </p>
      ) : null}
    </div>
  );
}
