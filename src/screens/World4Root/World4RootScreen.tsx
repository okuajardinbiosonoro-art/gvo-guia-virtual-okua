import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InterstationQrGate } from "../../app/qr/InterstationQrGate";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import {
  closeEssentialRoom,
  confirmEssentialStep,
  getJourneyRuntimeContext,
  isEssentialExitReady,
  markEssentialPresented,
  recordEssentialOutcome,
  useEssentialFlow,
  useWorld4ExplanationFlow,
} from "../../app/journey/journeyEssential";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { worldFourToWorldFiveTransitionRoute } from "../../app/routes";
import { World4OrderingGame } from "./World4OrderingExperience";
import { World4ExplanationTour } from "./World4ExplanationTour";
import type { World4OrderingOutcome } from "../../domain/checkpoints/world4OrderingCheckpoint";

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = (event: MediaQueryListEvent) => setReduced(event.matches);
    query?.addEventListener("change", update);
    return () => query?.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function World4RootScreen() {
  const navigate = useNavigate();
  const activity = useJourneyActivity();
  const essential = useEssentialFlow(4);
  const explanation = useWorld4ExplanationFlow();
  const [exploringExplanation, setExploringExplanation] = useState(false);
  const previousExplanation = useRef({
    required: explanation.required,
    attemptId: activity.attemptId,
  });
  const reducedMotion = useReducedMotion();
  const locale = readLanguagePreference() ?? "es";
  useEffect(() => {
    const previous = previousExplanation.current;
    previousExplanation.current = {
      required: explanation.required,
      attemptId: activity.attemptId,
    };
    const runtime = getJourneyRuntimeContext();
    if (
      previous.required && !explanation.required && !exploringExplanation &&
      activity.active && !document.hidden &&
      previous.attemptId === activity.attemptId &&
      runtime.active && runtime.attemptId === activity.attemptId &&
      document.activeElement === document.body
    ) {
      document.querySelector<HTMLHeadingElement>("#s4-ordering-title")?.focus();
    }
  }, [activity.active, activity.attemptId, explanation.required, exploringExplanation]);
  const input = {
    screen: 4 as const,
    contentRevision: essential.contentRevision,
    attemptId: activity.attemptId,
  };
  const present = async (stepId: string, assisted = false) =>
    !document.hidden &&
    (
      await markEssentialPresented({
        ...input,
        stepId,
        mode: assisted ? "assisted" : "standard",
      })
    ).ok;
  const confirm = async (stepId: string) =>
    !document.hidden &&
    (await confirmEssentialStep({ ...input, stepId, cause: "visitor_advance" }))
      .ok;

  async function presented(
    stage: "introduction" | "objects" | "review" | "success",
    _index?: number,
    outcome?: World4OrderingOutcome | null,
  ) {
    if (stage === "introduction") return present("introduccion_mesa");
    if (stage === "objects") {
      // The single Start/help gesture confirms the already-visible pieces;
      // their presentation itself never records a visitor advance.
      if (!(await present("presentacion_8"))) return false;
      return confirm("presentacion_8");
    }
    return present("orden_resuelto", outcome !== "solved_by_visitor");
  }
  async function closed(outcome: World4OrderingOutcome) {
    if (document.hidden) return false;
    if (
      !(
        await recordEssentialOutcome({
          ...input,
          outcome:
            outcome === "solved_by_visitor"
              ? "solved"
              : "assisted_review_completed",
        })
      ).ok
    )
      return false;
    // Recovery of a genuinely closed local game is acknowledged only by this
    // explicit Close gesture, after its outcome has been verified above. The
    // auxiliary explanatory tour has its own facts; no game data stands in for it.
    for (const stepId of ["introduccion_mesa", "presentacion_8"]) {
      if (essential.confirmedStepIds.includes(stepId)) continue;
      if (!(await present(stepId, outcome !== "solved_by_visitor"))) return false;
      if (!(await confirm(stepId))) return false;
    }
    if (!(await present("orden_resuelto", outcome !== "solved_by_visitor")))
      return false;
    if (!(await confirm("orden_resuelto"))) return false;
    if (!(await present("cierre", outcome !== "solved_by_visitor")))
      return false;
    return (await closeEssentialRoom({ ...input, cause: "visitor_close" })).ok;
  }
  if (explanation.required || exploringExplanation) {
    return (
      <World4ExplanationTour
        active={activity.active}
        attemptId={activity.attemptId}
        flow={explanation}
        locale={locale}
        reducedMotion={reducedMotion}
        readOnly={exploringExplanation}
        onReturn={() => setExploringExplanation(false)}
      />
    );
  }
  return (
    <World4OrderingGame
      attemptId={activity.attemptId}
      active={activity.active}
      readOnly={essential.readOnly}
      locale={locale}
      reducedMotion={reducedMotion}
      resourcesReady={true}
      closureVerified={essential.exitReady}
      onPresented={presented}
      onAdvance={async (stage) =>
        stage === "introduction" ? confirm("introduccion_mesa") : true
      }
      onClosed={closed}
      explanationAction={essential.readOnly ? (
        <button
          className="s4-ordering-text-action"
          type="button"
          disabled={!activity.active}
          onClick={() => {
            if (!document.hidden) setExploringExplanation(true);
          }}
        >
          {locale === "es" ? "Recorrer la explicación" : "Explore the explanation"}
        </button>
      ) : null}
      exit={
        essential.exitReady ? (
          <InterstationQrGate
            originWorld={4}
            presentation="scene"
            ready={essential.exitReady}
            persistCompletion={() => isEssentialExitReady(4)}
            onCompleted={() => navigate(worldFourToWorldFiveTransitionRoute)}
          />
        ) : null
      }
    />
  );
}
