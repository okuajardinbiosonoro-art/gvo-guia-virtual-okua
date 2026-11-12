import { useEffect, useRef, useState } from "react";
import { playJourneySound, stopJourneySound } from "../../app/audio/journeySound";

type World2MappingPanelProps = {
  cleanSignalAsset: string;
  firstRunComplete: boolean;
  interactionBlocked?: boolean;
  active?: boolean;
  locale?: "es" | "en";
  showResultRequested?: boolean;
  onPresented?: (mode: "standard" | "assisted") => void;
  onFirstRunComplete: () => void;
};

type MappingRelation = {
  feature: "amplitud" | "variacion" | "rango";
  featureLabel: string;
  id: "amplitude-intensity" | "variation-rhythm" | "range-pitch";
  microcopy: string;
  output: "intensidad" | "ritmo" | "altura";
};

const mappingStepDurationMs = 3200;
const mappingAutoplayMs = mappingStepDurationMs * 3;
const relationSounds = ["intensity", "rhythm", "pitch"] as const;

const mappingRelations: MappingRelation[] = [
  {
    feature: "amplitud",
    featureLabel: "AMPLITUD",
    id: "amplitude-intensity",
    microcopy: "Más fuerza, más intensidad.",
    output: "intensidad",
  },
  {
    feature: "variacion",
    featureLabel: "VARIACIÓN",
    id: "variation-rhythm",
    microcopy: "El cambio organiza el ritmo.",
    output: "ritmo",
  },
  {
    feature: "rango",
    featureLabel: "RANGO",
    id: "range-pitch",
    microcopy: "El rango orienta la altura.",
    output: "altura",
  },
];

function MappingOutputIcon({ mode }: { mode: MappingRelation["output"] }) {
  const semanticVisual = {
    altura: "ascending-pitch-levels",
    intensidad: "intensity-bars",
    ritmo: "accented-beat-sequence",
  }[mode];

  return (
    <span
      className={`world2-mapping-sequence__output-icon world2-mapping-sequence__output-icon--${mode}`}
      data-mapping-parameter-visual={semanticVisual}
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export function World2MappingPanel({
  cleanSignalAsset,
  firstRunComplete,
  interactionBlocked = false,
  active = true,
  locale = "es",
  showResultRequested = false,
  onPresented,
  onFirstRunComplete,
}: World2MappingPanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    firstRunComplete ? mappingRelations.length - 1 : 0,
  );
  const [autoplayFinished, setAutoplayFinished] = useState(firstRunComplete);
  const [animationRevision, setAnimationRevision] = useState(0);
  const onFirstRunCompleteRef = useRef(onFirstRunComplete);
  const reviewEnabled = true;
  const manualSelectionRef = useRef(false);
  const manualSteps = useRef(new Set<number>());
  const [manualReview, setManualReview] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const presentedRef = useRef(onPresented);
  const notified = useRef(false);
  const elapsed = useRef(0);
  const en = locale === "en";
  const translate = (es: string, english: string) => en ? english : es;
  const activeRelation =
    mappingRelations[activeStepIndex] ?? mappingRelations[0];

  useEffect(() => {
    onFirstRunCompleteRef.current = onFirstRunComplete;
    presentedRef.current = onPresented;
  }, [onFirstRunComplete, onPresented]);

  const relationSound = active && (manualReview || (!firstRunComplete && !assisted))
    ? relationSounds[activeStepIndex] : undefined;
  useEffect(() => {
    if (!relationSound) return;
    playJourneySound(relationSound);
    return () => stopJourneySound(relationSound);
  }, [relationSound, animationRevision]);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (active && showResultRequested) {
      setAssisted(true);
      setActiveStepIndex(2);
      setAutoplayFinished(true);
    }
  }, [active, showResultRequested]);

  useEffect(() => {
    if (!active || !visible) return;
    if (firstRunComplete) {
      if (!manualSelectionRef.current)
        setActiveStepIndex(mappingRelations.length - 1);
      setAutoplayFinished(true);
      return;
    }

    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches &&
      !autoplayFinished
    ) {
      setActiveStepIndex(mappingRelations.length - 1);
      setAutoplayFinished(true);
      return;
    }

    if (autoplayFinished || manualReview) {
      return;
    }

    const started = window.performance.now();
    const timers = mappingRelations
      .slice(1)
      .map((_, index) => ({ index: index + 1, at: (index + 1) * mappingStepDurationMs }))
      .filter(({ at }) => at > elapsed.current)
      .map(({ index, at }) => window.setTimeout(() => setActiveStepIndex(index), at - elapsed.current));

    const completionTimer = window.setTimeout(() => {
      setAutoplayFinished(true);
    }, Math.max(0, mappingAutoplayMs - elapsed.current));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completionTimer);
      elapsed.current = Math.min(mappingAutoplayMs, elapsed.current + window.performance.now() - started);
    };
  }, [active, visible, autoplayFinished, firstRunComplete, manualReview]);

  useEffect(() => {
    if (!active || !visible || !autoplayFinished || notified.current) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        notified.current = true;
        presentedRef.current?.(assisted ? "assisted" : "standard");
      });
    });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [active, visible, autoplayFinished, assisted]);

  function reviewStep(index: number) {
    if (interactionBlocked || !active) return;
    manualSelectionRef.current = true;
    setManualReview(true);
    manualSteps.current.add(index);
    setActiveStepIndex(index);
    setAnimationRevision((currentRevision) => currentRevision + 1);
    if (manualSteps.current.size === mappingRelations.length) {
      setAutoplayFinished(true);
      if (!firstRunComplete) onFirstRunCompleteRef.current();
    }
  }


  return (
    <div
      className="world2-mapping-panel"
      role="group"
      aria-label={translate("Mapeo secuencial: un rasgo de la señal se interpreta como un parámetro sonoro", "Sequential mapping: a signal feature is interpreted as a sound parameter")}
      data-mapping-pedagogy="016U-R5"
      data-mapping-autoplay={`${mappingAutoplayMs}ms`}
      data-mapping-step-duration={`${mappingStepDurationMs}ms`}
      data-world2-mapping-component="sequential-react-dom"
      data-world2-mapping-controls={interactionBlocked ? "blocked" : "review"}
      data-world2-mapping-first-run={firstRunComplete ? "complete" : "active"}
      data-world2-mapping-lia-role="guide"
      data-world2-mapping-mode="sequential-pedagogic-r2"
      data-world2-mapping-layout="full-width-horizontal"
      data-world2-mapping-composition-centered="true"
      data-world2-mapping-parameter-polish="restored-centered-circular"
      data-world2-mapping-support-copy-animation="consistent-restarting-double-pulse-glow"
      data-world2-mapping-support-copy-min-scale="1"
      data-world2-mapping-relation={activeRelation.id}
      data-world2-mapping-review-enabled={reviewEnabled}
      data-world2-mapping-step={activeStepIndex + 1}
      data-world2-mapping-step-count={mappingRelations.length}
      data-world2-mapping-simultaneous-relations="1"
      data-world2-layer-visual="mapeo"
      data-motion-active={active && visible}
      data-mapping-result-presented={autoplayFinished}
      data-lia-action={autoplayFinished ? "respond" : "present"}
    >
      <header className="world2-mapping-sequence__header">
        <div
          className="world2-mapping-sequence__progress"
          aria-label={en ? `Relationship ${activeStepIndex + 1} of ${mappingRelations.length}` : `Relación ${activeStepIndex + 1} de ${mappingRelations.length}`}
        >
          {mappingRelations.map((relation, index) => (
            <button
              type="button"
              aria-label={en ? `Review relationship ${index + 1} of 3: ${["amplitude to intensity", "variation to rhythm", "range to pitch"][index]}` : `Revisar relación ${index + 1} de 3: ${relation.featureLabel} a ${relation.output}`}
              aria-pressed={index === activeStepIndex}
              data-active={index === activeStepIndex}
              data-mapping-progress-step={index + 1}
              disabled={interactionBlocked || !active}
              key={relation.id}
              onClick={() => reviewStep(index)}
            />
          ))}
        </div>
        <strong>{activeStepIndex + 1} / 3</strong>
      </header>

      <div
        className="world2-mapping-sequence__relation"
        aria-label={en ? ["Amplitude is mapped to intensity", "Variation is mapped to rhythm", "Range is mapped to pitch"][activeStepIndex] : `${activeRelation.featureLabel} se interpreta mediante mapeo como ${activeRelation.output}`}
        data-mapping-active-relation={activeRelation.id}
        data-mapping-animation-revision={animationRevision}
        key={`${activeRelation.id}-${animationRevision}`}
      >
        <section
          className="world2-mapping-sequence__source"
          data-mapping-zone="feature"
        >
          <span className="world2-mapping-sequence__eyebrow">{translate("RASGO", "FEATURE")}</span>
          <div className="world2-mapping-sequence__wave">
            <img
              src={cleanSignalAsset}
              alt=""
              aria-hidden="true"
              data-runtime-asset={cleanSignalAsset}
              data-world2-mapping-input="clean-signal"
              loading="lazy"
            />
            <span
              className={`world2-mapping-sequence__feature-accent world2-mapping-sequence__feature-accent--${activeRelation.feature}`}
              data-world2-feature-accent={activeRelation.feature}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </div>
          <strong>{en ? ["AMPLITUDE", "VARIATION", "RANGE"][activeStepIndex] : activeRelation.featureLabel}</strong>
        </section>

        <span
          className="world2-mapping-sequence__flow world2-mapping-sequence__flow--input"
          aria-hidden="true"
          data-mapping-flow="feature-to-interpretation"
        >
          <span />
        </span>

        <button
          className="world2-mapping-sequence__core"
          data-mapping-zone="interpretation"
          type="button"
          disabled={!active || interactionBlocked}
          aria-label={translate("Ver resultado", "Show result")}
          onClick={() => { setAssisted(true); setActiveStepIndex(2); setAutoplayFinished(true); }}
        >
          <span
            className="world2-mapping-sequence__core-ring"
            aria-hidden="true"
          />
          <small>{translate("VER RESULTADO", "SHOW RESULT")}</small>
          <strong>{translate("MAPEO", "MAPPING")}</strong>
        </button>

        <span
          className="world2-mapping-sequence__flow world2-mapping-sequence__flow--output"
          aria-hidden="true"
          data-mapping-flow="interpretation-to-parameter"
        >
          <span />
        </span>

        <section
          className="world2-mapping-sequence__output"
          data-mapping-output={activeRelation.output}
          data-mapping-zone="parameter"
        >
          <span className="world2-mapping-sequence__eyebrow">{translate("PARÁMETRO", "PARAMETER")}</span>
          <MappingOutputIcon mode={activeRelation.output} />
          <strong>{en ? ["INTENSITY", "RHYTHM", "PITCH"][activeStepIndex] : activeRelation.output.toUpperCase()}</strong>
        </section>
      </div>

      <p
        className="world2-mapping-sequence__microcopy"
        data-world2-mapping-support-copy-relation={activeRelation.id}
        data-world2-mapping-support-copy-revision={animationRevision}
        key={`support-copy-${activeRelation.id}-${animationRevision}`}
      >
        <strong>{en ? ["Amplitude → Intensity", "Variation → Rhythm", "Range → Pitch"][activeStepIndex] : `${activeRelation.featureLabel[0]}${activeRelation.featureLabel.slice(1).toLowerCase()} → ${activeRelation.output[0].toUpperCase()}${activeRelation.output.slice(1)}`}</strong>
        <span>{en ? ["More strength, more intensity.", "Change organises rhythm.", "Range guides pitch."][activeStepIndex] : activeRelation.microcopy}</span>
      </p>
      {autoplayFinished && (assisted || !manualReview) ? <p className="world2-mapping-result" data-mapping-result="all-correspondences">
        {translate("Amplitud → Intensidad · Variación → Ritmo · Rango → Altura", "Amplitude → Intensity · Variation → Rhythm · Range → Pitch")}
      </p> : null}
    </div>
  );
}
