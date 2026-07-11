import { useEffect, useState } from "react";

type World2MappingPanelProps = {
  cleanSignalAsset: string;
  firstRunComplete: boolean;
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
  onFirstRunComplete,
}: World2MappingPanelProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    firstRunComplete ? mappingRelations.length - 1 : 0,
  );
  const [localFirstRunComplete, setLocalFirstRunComplete] =
    useState(firstRunComplete);
  const [animationRevision, setAnimationRevision] = useState(0);
  const reviewEnabled = firstRunComplete || localFirstRunComplete;
  const activeRelation =
    mappingRelations[activeStepIndex] ?? mappingRelations[0];

  useEffect(() => {
    if (reviewEnabled) {
      return;
    }

    const timers = mappingRelations
      .slice(1)
      .map((_, index) =>
        window.setTimeout(
          () => setActiveStepIndex(index + 1),
          (index + 1) * mappingStepDurationMs,
        ),
      );

    const completionTimer = window.setTimeout(() => {
      setLocalFirstRunComplete(true);
      onFirstRunComplete();
    }, mappingAutoplayMs);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completionTimer);
    };
  }, [onFirstRunComplete, reviewEnabled]);

  function reviewStep(index: number) {
    if (!reviewEnabled) {
      return;
    }

    setActiveStepIndex(index);
    setAnimationRevision((currentRevision) => currentRevision + 1);
  }

  return (
    <div
      className="world2-mapping-panel"
      role="group"
      aria-label="Mapeo secuencial: un rasgo de la señal se interpreta como un parámetro sonoro"
      data-mapping-pedagogy="016U-R5"
      data-mapping-autoplay={`${mappingAutoplayMs}ms`}
      data-mapping-step-duration={`${mappingStepDurationMs}ms`}
      data-world2-mapping-component="sequential-react-dom"
      data-world2-mapping-controls={reviewEnabled ? "review" : "locked"}
      data-world2-mapping-first-run={reviewEnabled ? "complete" : "active"}
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
    >
      <header className="world2-mapping-sequence__header">
        <span>MAPEO</span>
        <div
          className="world2-mapping-sequence__progress"
          aria-label={`Relación ${activeStepIndex + 1} de ${mappingRelations.length}`}
        >
          {mappingRelations.map((relation, index) => (
            <button
              type="button"
              aria-label={`Revisar relación ${index + 1} de 3: ${relation.featureLabel} a ${relation.output}`}
              aria-pressed={index === activeStepIndex}
              data-active={index === activeStepIndex}
              data-mapping-progress-step={index + 1}
              disabled={!reviewEnabled}
              key={relation.id}
              onClick={() => reviewStep(index)}
            />
          ))}
        </div>
        <strong>{activeStepIndex + 1} / 3</strong>
      </header>

      <div
        className="world2-mapping-sequence__relation"
        aria-label={`${activeRelation.featureLabel} se interpreta mediante mapeo como ${activeRelation.output}`}
        data-mapping-active-relation={activeRelation.id}
        data-mapping-animation-revision={animationRevision}
        key={`${activeRelation.id}-${animationRevision}`}
      >
        <section
          className="world2-mapping-sequence__source"
          data-mapping-zone="feature"
        >
          <span className="world2-mapping-sequence__eyebrow">RASGO</span>
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
          <strong>{activeRelation.featureLabel}</strong>
        </section>

        <span
          className="world2-mapping-sequence__flow world2-mapping-sequence__flow--input"
          aria-hidden="true"
          data-mapping-flow="feature-to-interpretation"
        >
          <span />
        </span>

        <section
          className="world2-mapping-sequence__core"
          data-mapping-zone="interpretation"
        >
          <span
            className="world2-mapping-sequence__core-ring"
            aria-hidden="true"
          />
          <small>INTERPRETAR</small>
          <strong>MAPEO</strong>
        </section>

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
          <span className="world2-mapping-sequence__eyebrow">PARÁMETRO</span>
          <MappingOutputIcon mode={activeRelation.output} />
          <strong>{activeRelation.output.toUpperCase()}</strong>
        </section>
      </div>

      <p
        className="world2-mapping-sequence__microcopy"
        data-world2-mapping-support-copy-relation={activeRelation.id}
        data-world2-mapping-support-copy-revision={animationRevision}
        key={`support-copy-${activeRelation.id}-${animationRevision}`}
      >
        {activeRelation.microcopy}
      </p>
    </div>
  );
}
