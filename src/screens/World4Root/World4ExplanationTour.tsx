import { useEffect, useRef, useState } from "react";
import { playJourneySound } from "../../app/audio/journeySound";
import {
  confirmWorld4ExplanationStep,
  getJourneyRuntimeContext,
  markWorld4ExplanationPresented,
  refreshWorld4ExplanationFlow,
  type useWorld4ExplanationFlow,
} from "../../app/journey/journeyEssential";
import { WORLD4_ORDERING_TARGET } from "../../domain/checkpoints/world4OrderingCheckpoint";
import { World4LiaGuide } from "./World4LiaGuide";
import { station4Lia } from "./station4Content";
import {
  getWorld4OrderingNodes,
  world4OrderingCopy,
  world4OrderingObjectAssets,
  type World4OrderingLocale,
} from "./world4OrderingContent";
import { world4RuntimeAssets } from "./world4RuntimeAssets";
import "./World4OrderingGame.css";

type Props = {
  active: boolean;
  attemptId: string | null;
  flow: ReturnType<typeof useWorld4ExplanationFlow>;
  locale: World4OrderingLocale;
  reducedMotion: boolean;
  readOnly?: boolean;
  onReturn?: () => void;
};

const copy = {
  es: {
    introduction: station4Lia.intro,
    step: "Paso",
    next: "Siguiente",
    game: "Continuar al juego",
    back: "Volver a la mesa",
    retry: "Reintentar lectura y guardado",
    error:
      "No pudimos verificar el recorrido explicativo. Los datos originales se conservan. Reintenta para continuar.",
    assets: "Reintentar carga de imágenes",
  },
  en: {
    introduction: "Now let's see how the whole system connects.",
    step: "Step",
    next: "Next",
    game: "Continue to the game",
    back: "Return to the table",
    retry: "Retry reading and saving",
    error:
      "We could not verify the explanatory tour. The original data is preserved. Retry to continue.",
    assets: "Retry loading images",
  },
} as const;

/** Explanation confirmations are separate from game moves and its assisted review. */
export function World4ExplanationTour({
  active,
  attemptId,
  flow,
  locale,
  reducedMotion,
  readOnly = false,
  onReturn,
}: Props) {
  const nodes = getWorld4OrderingNodes(locale);
  const text = copy[locale];
  const [previewIndex, setPreviewIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [assetError, setAssetError] = useState(false);
  const [assetAttempt, setAssetAttempt] = useState(0);
  const [retry, setRetry] = useState(0);
  const [visible, setVisible] = useState(() => !document.hidden);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusAfterAdvance = useRef<HTMLElement | null>(null);
  const mounted = useRef(false);
  const operation = useRef(0);
  const current = useRef({ active, attemptId });
  current.current = { active, attemptId };
  const index = readOnly
    ? previewIndex
    : Math.max(0, WORLD4_ORDERING_TARGET.indexOf(flow.activeStepId ?? "sonido"));
  const node = nodes[index];
  const blocked = !readOnly && ["invalid", "unavailable"].includes(flow.status);
  const presented = readOnly || flow.presentedStepIds.includes(node.id);
  const enabled = active && visible && !busy && !blocked && !assetError;

  function isCurrent(capturedAttempt: string | null) {
    const runtime = getJourneyRuntimeContext();
    return (
      mounted.current &&
      current.current.active &&
      capturedAttempt !== null &&
      current.current.attemptId === capturedAttempt &&
      runtime.active &&
      runtime.authorized &&
      runtime.screen === 4 &&
      runtime.attemptId === capturedAttempt &&
      !document.hidden
    );
  }

  useEffect(() => {
    mounted.current = true;
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => {
      mounted.current = false;
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    operation.current += 1;
    setBusy(false);
  }, [active, attemptId, visible]);

  useEffect(() => {
    if (readOnly || !active || !visible || blocked || presented || assetError)
      return;
    const capturedAttempt = attemptId;
    const stepId = node.id;
    const contentRevision = flow.contentRevision;
    let cancelled = false;
    void markWorld4ExplanationPresented({
      stepId,
      contentRevision,
      attemptId: capturedAttempt,
    }).then((result) => {
      if (cancelled || !isCurrent(capturedAttempt)) return;
      setSaveError(!result.ok);
    });
    return () => {
      cancelled = true;
    };
    // Presentation is keyed to the captured step/attempt, never a later token.
  }, [active, assetError, attemptId, blocked, flow.contentRevision, node.id, presented, readOnly, retry, visible]);

  useEffect(() => {
    const trigger = focusAfterAdvance.current;
    if (!trigger || !active || !visible) return;
    focusAfterAdvance.current = null;
    if (document.activeElement === trigger || document.activeElement === document.body)
      headingRef.current?.focus();
  }, [active, index, visible]);

  async function advance(trigger: HTMLButtonElement) {
    if (!enabled || !presented || !isCurrent(attemptId)) return;
    playJourneySound("interaction", { replace: true });
    if (readOnly) {
      if (index === 7) onReturn?.();
      else {
        focusAfterAdvance.current = trigger;
        setPreviewIndex(index + 1);
      }
      return;
    }
    const capturedAttempt = attemptId;
    const stepId = node.id;
    const transaction = ++operation.current;
    setBusy(true);
    const result = await confirmWorld4ExplanationStep({
      stepId,
      contentRevision: flow.contentRevision,
      attemptId: capturedAttempt,
    });
    if (transaction !== operation.current || !isCurrent(capturedAttempt)) return;
    setSaveError(!result.ok);
    setBusy(false);
    if (result.ok) {
      if (index < 7) {
        // The verified store may render the next step before this promise resumes.
        // Focus only while the visitor still owns the advance control (or native blur).
        if (document.activeElement === trigger || document.activeElement === document.body)
          headingRef.current?.focus();
      }
    }
  }

  return (
    <main
      className="s4-ordering s4-explanation"
      aria-labelledby="s4-explanation-title"
      data-station4-explanation-step={node.id}
      data-station4-explanation-readonly={readOnly}
      data-journey-active={active}
    >
      <header><h1 id="s4-explanation-title">{world4OrderingCopy[locale].title}</h1></header>
      <div className="s4-ordering-layout s4-explanation-layout">
        <article className="s4-ordering-panel s4-explanation-panel" aria-busy={busy}>
          {index === 0 ? <p>{readOnly ? world4OrderingCopy[locale].readonly : text.introduction}</p> : null}
          <p className="s4-explanation-progress">{text.step} {index + 1}/8</p>
          <div className="s4-explanation-description">
            <h2 ref={headingRef} tabIndex={-1}>{node.title}</h2>
            <p data-station4-explanation-text={node.id}>{node.text}</p>
          </div>
          <button
            type="button"
            disabled={!enabled || !presented}
            onClick={(event) => void advance(event.currentTarget)}
          >
            {index < 7 ? text.next : readOnly ? text.back : text.game}
          </button>
          {readOnly && index < 7 ? (
            <button className="s4-ordering-text-action" type="button" disabled={!active || !visible} onClick={onReturn}>{text.back}</button>
          ) : null}
          {blocked || saveError ? (
            <div role="alert">
              <p>{text.error}</p>
              <button type="button" disabled={!active || !visible || busy} onClick={() => {
                refreshWorld4ExplanationFlow();
                setSaveError(false);
                setRetry((value) => value + 1);
              }}>{text.retry}</button>
            </div>
          ) : null}
          {assetError ? (
            <div role="alert">
              <p>{world4OrderingCopy[locale].assetsError}</p>
              <button type="button" disabled={!active || !visible} onClick={() => {
                setAssetError(false);
                setAssetAttempt((value) => value + 1);
              }}>{text.assets}</button>
            </div>
          ) : null}
        </article>
        <section className="s4-ordering-stage s4-explanation-stage" aria-label={locale === "es" ? "Recorrido de los ocho componentes" : "Eight-component tour"}>
          <img key={`table-${assetAttempt}`} className="s4-ordering-table" src={world4RuntimeAssets.environment.portraitTable} alt="" onError={() => setAssetError(true)} />
          <ol className="s4-ordering-grid">
            {nodes.map((item, position) => (
              <li key={item.id}>
                <span className="s4-ordering-number" aria-hidden="true">{position + 1}</span>
                <button
                  type="button"
                  data-explanation-object={item.id}
                  aria-label={`${text.step} ${position + 1}: ${item.title}`}
                  aria-current={position === index ? "step" : undefined}
                  className={position === index ? "is-presented" : undefined}
                  disabled={!active || !visible || (!readOnly && position !== index)}
                  onClick={() => {
                    if (!isCurrent(attemptId)) return;
                    if (readOnly) setPreviewIndex(position);
                    headingRef.current?.focus();
                  }}
                >
                  <img key={assetAttempt} src={world4OrderingObjectAssets[item.id]} alt="" draggable="false" data-runtime-asset={world4OrderingObjectAssets[item.id]} onError={() => setAssetError(true)} />
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <World4LiaGuide articulated active={active && visible} nodeId={node.id} reducedMotion={reducedMotion} portrait mode="guide" motionKey={`explanation-${node.id}`} />
        </section>
      </div>
    </main>
  );
}
