import "./CoverIntroScreen.css";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { coverToWorldOneTransitionRoute } from "../../app/routes";
import { coverIntroAssets } from "./coverIntroAssets";
import { LiaHybridAvatar } from "./LiaHybridAvatar";
import type { LiaRigExpression } from "./LiaHybridAvatar";
import {
  coverIntroDialogues,
  coverIntroPortals,
  coverIntroText,
  coverIntroTransitionText,
  lockedPortalMessages,
} from "./coverIntroContent";
import type {
  CoverIntroDialoguePose,
  LockedPortalId,
} from "./coverIntroContent";
import {
  COVER_INTRO_INITIAL_STATE,
  persistCoverIntroCompleted,
  readCoverIntroCompleted,
  resetCoverIntroCompleted,
} from "./coverIntroState";
import type { CoverIntroPhase, CoverIntroState } from "./coverIntroState";

const liaPoseByState = {
  idle: coverIntroAssets.liaIdle,
  greeting: coverIntroAssets.liaGreeting,
  explainCalm: coverIntroAssets.liaExplainCalm,
  pointPortal1: coverIntroAssets.liaPointPortal1,
  activatePortal1: coverIntroAssets.liaActivatePortal1,
} satisfies Record<CoverIntroDialoguePose | "idle" | "activatePortal1", string>;

const PORTAL_ACTIVATION_TO_TRANSITION_MS = 920;

function createInitialCoverIntroState(): CoverIntroState {
  const shouldResetIntro =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("resetIntro") === "1";

  if (shouldResetIntro) {
    resetCoverIntroCompleted();
    return COVER_INTRO_INITIAL_STATE;
  }

  const introCompleted = readCoverIntroCompleted();

  if (introCompleted) {
    return {
      ...COVER_INTRO_INITIAL_STATE,
      phase: "portal_1_ready",
      activeDialogueIndex: coverIntroDialogues.length - 1,
      introCompleted: true,
    };
  }

  return COVER_INTRO_INITIAL_STATE;
}

function isDialoguePhase(phase: CoverIntroPhase) {
  return (
    phase === "intro_dialogue_started" || phase === "intro_dialogue_active"
  );
}

function getLiaPoseSource(
  phase: CoverIntroPhase,
  dialoguePose?: CoverIntroDialoguePose,
) {
  if (
    phase === "portal_1_opening_placeholder" ||
    phase === "transition_to_station_1_placeholder"
  ) {
    return liaPoseByState.activatePortal1;
  }

  if (phase === "portal_1_ready" || phase === "intro_dialogue_completed") {
    return liaPoseByState.pointPortal1;
  }

  if (dialoguePose) {
    return liaPoseByState[dialoguePose];
  }

  return liaPoseByState.idle;
}

function getLiaPoseName(
  phase: CoverIntroPhase,
  dialoguePose?: CoverIntroDialoguePose,
) {
  if (
    phase === "portal_1_opening_placeholder" ||
    phase === "transition_to_station_1_placeholder"
  ) {
    return "activatePortal1";
  }

  if (phase === "portal_1_ready" || phase === "intro_dialogue_completed") {
    return "pointPortal1";
  }

  if (dialoguePose) {
    return dialoguePose;
  }

  return "idle";
}

function getLiaRigExpression(
  phase: CoverIntroPhase,
  activeDialogueIndex: number,
  hasBlockedPortalMessage: boolean,
): LiaRigExpression | null {
  if (phase === "portada_idle") {
    return hasBlockedPortalMessage ? "attentive" : "neutral";
  }

  if (!isDialoguePhase(phase)) {
    return null;
  }

  if (activeDialogueIndex === 0) {
    return "happy";
  }

  if (activeDialogueIndex >= 1 && activeDialogueIndex <= 3) {
    return "attentive";
  }

  return null;
}

export function CoverIntroScreen() {
  const navigate = useNavigate();
  const [coverState, setCoverState] = useState<CoverIntroState>(
    createInitialCoverIntroState,
  );
  const blockedMessageTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const portalHandoffStartedRef = useRef(false);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("resetIntro") === "1") {
      url.searchParams.delete("resetIntro");
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, []);

  useEffect(() => {
    return () => {
      if (blockedMessageTimeoutRef.current !== null) {
        window.clearTimeout(blockedMessageTimeoutRef.current);
      }

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    if (coverState.phase !== "portal_1_opening_placeholder") {
      return;
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      navigate(coverToWorldOneTransitionRoute);
      transitionTimeoutRef.current = null;
    }, PORTAL_ACTIVATION_TO_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [coverState.phase, navigate]);

  const stageStyle = {
    "--cover-background-image": `url(${coverIntroAssets.background})`,
  } as CSSProperties;
  const dialogueIsVisible = isDialoguePhase(coverState.phase);
  const activeDialogue = dialogueIsVisible
    ? coverIntroDialogues[coverState.activeDialogueIndex]
    : null;
  const activeDialogueStep = activeDialogue
    ? `Paso ${coverState.activeDialogueIndex + 1} de ${coverIntroDialogues.length}`
    : null;
  const activeLiaPose = getLiaPoseSource(
    coverState.phase,
    activeDialogue?.liaPose,
  );
  const activeLiaPoseName = getLiaPoseName(
    coverState.phase,
    activeDialogue?.liaPose,
  );
  const liaRigExpression = getLiaRigExpression(
    coverState.phase,
    coverState.activeDialogueIndex,
    Boolean(coverState.blockedPortalMessage),
  );
  const liaAvatarMode = liaRigExpression ? "rig-idle" : "pose";
  const activeLiaStateName = liaRigExpression
    ? `rig-${liaRigExpression}`
    : activeLiaPoseName;
  const portalOneReady =
    coverState.phase === "portal_1_ready" ||
    coverState.phase === "portal_1_opening_placeholder" ||
    coverState.phase === "transition_to_station_1_placeholder";
  const portalOneOpening =
    coverState.phase === "portal_1_opening_placeholder" ||
    coverState.phase === "transition_to_station_1_placeholder";
  const portalStageClassNames = [
    "cover-intro__portal-stage",
    "cover-portal-stage",
    "cover-activation-stage",
    dialogueIsVisible ? "cover-portal-stage--dialogue-active" : "",
    portalOneReady ? "cover-portal-stage--ready" : "",
    portalOneOpening ? "cover-portal-stage--opening" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const ctaText = portalOneReady
    ? coverIntroText.enterWorldOne
    : coverIntroText.cta;
  const ctaLabel = portalOneReady
    ? coverIntroText.enterWorldOne
    : coverIntroText.cta;

  function startIntroDialogue() {
    setCoverState((current) => {
      if (
        isDialoguePhase(current.phase) ||
        current.phase === "portal_1_opening_placeholder" ||
        current.phase === "transition_to_station_1_placeholder"
      ) {
        return current;
      }

      if (current.introCompleted) {
        return {
          ...current,
          phase: "portal_1_ready",
          blockedPortalMessage: null,
          blockedPortalId: null,
        };
      }

      return {
        phase: "intro_dialogue_started",
        activeDialogueIndex: 0,
        blockedPortalMessage: null,
        blockedPortalId: null,
        introCompleted: false,
      };
    });
  }

  function advanceDialogue() {
    setCoverState((current) => {
      if (!isDialoguePhase(current.phase)) {
        return current;
      }

      const isLastDialogue =
        current.activeDialogueIndex >= coverIntroDialogues.length - 1;

      if (isLastDialogue) {
        persistCoverIntroCompleted();
        return {
          ...current,
          phase: "portal_1_ready",
          activeDialogueIndex: coverIntroDialogues.length - 1,
          blockedPortalMessage: null,
          blockedPortalId: null,
          introCompleted: true,
        };
      }

      return {
        ...current,
        phase: "intro_dialogue_active",
        activeDialogueIndex: current.activeDialogueIndex + 1,
        blockedPortalMessage: null,
        blockedPortalId: null,
      };
    });
  }

  function openPortalOnePlaceholder() {
    if (
      portalHandoffStartedRef.current ||
      coverState.phase !== "portal_1_ready"
    ) {
      return;
    }

    portalHandoffStartedRef.current = true;
    setCoverState((current) => {
      if (current.phase !== "portal_1_ready") {
        return current;
      }

      return {
        ...current,
        phase: "portal_1_opening_placeholder",
        blockedPortalMessage: null,
        blockedPortalId: null,
      };
    });
  }

  function handlePortalOneClick() {
    if (coverState.phase === "portal_1_ready") {
      openPortalOnePlaceholder();
      return;
    }

    if (
      coverState.phase === "portal_1_opening_placeholder" ||
      coverState.phase === "transition_to_station_1_placeholder"
    ) {
      return;
    }

    startIntroDialogue();
  }

  function showBlockedPortalMessage(portalId: LockedPortalId) {
    if (
      isDialoguePhase(coverState.phase) ||
      coverState.phase === "portal_1_opening_placeholder" ||
      coverState.phase === "transition_to_station_1_placeholder"
    ) {
      return;
    }

    if (blockedMessageTimeoutRef.current !== null) {
      window.clearTimeout(blockedMessageTimeoutRef.current);
    }

    setCoverState((current) => ({
      ...current,
      blockedPortalMessage: lockedPortalMessages[portalId],
      blockedPortalId: portalId,
    }));

    blockedMessageTimeoutRef.current = window.setTimeout(() => {
      setCoverState((current) => ({
        ...current,
        blockedPortalMessage: null,
        blockedPortalId: null,
      }));
      blockedMessageTimeoutRef.current = null;
    }, 1800);
  }

  function handleCtaClick() {
    if (coverState.phase === "portal_1_ready") {
      openPortalOnePlaceholder();
      return;
    }

    if (
      coverState.phase === "portal_1_opening_placeholder" ||
      coverState.phase === "transition_to_station_1_placeholder"
    ) {
      return;
    }

    startIntroDialogue();
  }

  return (
    <main
      className={`cover-intro cover-intro--${coverState.phase}`}
      aria-labelledby="cover-intro-title"
      style={stageStyle}
      data-cover-phase={coverState.phase}
      data-intro-completed={coverState.introCompleted ? "true" : "false"}
    >
      <div className="cover-intro__scrim" aria-hidden="true" />
      <div className="cover-intro__stage" data-cover-intro-version="002J-FIX">
        <header className="cover-intro__header">
          <p className="cover-intro__brand">{coverIntroText.logo}</p>
          <p className="cover-intro__subtitle">{coverIntroText.subtitle}</p>
        </header>

        <section className="cover-intro__scene" aria-label="Archivo Vivo OKÚA">
          <div
            className="cover-intro__lia-stage cover-lia-stage"
            data-testid="cover-lia-stage"
          >
            <div
              className="cover-intro__lia-wrap cover-lia-layer"
              data-lia-state={activeLiaStateName}
            >
              {liaAvatarMode === "rig-idle" ? (
                <LiaHybridAvatar
                  key="lia-rig-idle"
                  className="cover-intro__lia"
                  mode="rig-idle"
                  expression={liaRigExpression ?? "neutral"}
                />
              ) : (
                <LiaHybridAvatar
                  key={activeLiaPose}
                  className="cover-intro__lia"
                  mode="pose"
                  poseName={activeLiaPoseName}
                  poseSrc={activeLiaPose}
                />
              )}
            </div>
          </div>

          {activeDialogue ? (
            <section
              className="cover-intro__dialogue cover-dialogue-dock cover-dialogue-panel"
              role="dialog"
              aria-live="polite"
              aria-label="Diálogo de Lía"
              data-dialogue-id={activeDialogue.id}
              data-dialogue-step={activeDialogueStep}
              data-testid="cover-dialogue-panel"
            >
              <div className="cover-intro__dialogue-meta">
                <span className="cover-intro__dialogue-speaker">Lía</span>
                <span
                  className="cover-intro__dialogue-step"
                  aria-label={activeDialogueStep ?? undefined}
                >
                  {activeDialogueStep}
                </span>
              </div>
              <p className="cover-intro__dialogue-text">
                {activeDialogue.text}
              </p>
              <button
                type="button"
                className="cover-intro__dialogue-button"
                aria-label={
                  coverState.activeDialogueIndex ===
                  coverIntroDialogues.length - 1
                    ? coverIntroText.dialogueFinish
                    : "Siguiente diálogo de Lía"
                }
                onClick={advanceDialogue}
              >
                {coverState.activeDialogueIndex ===
                coverIntroDialogues.length - 1
                  ? coverIntroText.dialogueFinish
                  : coverIntroText.dialogueNext}
              </button>
            </section>
          ) : null}

          <div
            className={portalStageClassNames}
            aria-label="Portales del recorrido"
            data-testid="cover-portal-stage"
          >
            <div className="cover-intro__portal-group cover-portal-group">
              {portalOneOpening ? (
                <div
                  className="cover-intro__portal-activation-rig cover-activation-stage"
                  data-testid="cover-portal-activation-rig"
                  data-activation-stage="portal-i"
                  aria-hidden="true"
                >
                  <img
                    className="cover-intro__portal-activation-glow"
                    src={coverIntroAssets.portal1Glow}
                    alt=""
                    data-runtime-asset={coverIntroAssets.portal1Glow}
                  />
                  <img
                    className="cover-intro__portal-activation-frame cover-intro__portal-activation-frame--back"
                    src={coverIntroAssets.portal1Frame}
                    alt=""
                    data-runtime-asset={coverIntroAssets.portal1Frame}
                  />
                  <img
                    className="cover-intro__portal-activation-lia"
                    src={coverIntroAssets.liaActivatePortal1}
                    alt=""
                    data-testid="cover-activation-lia"
                    data-runtime-asset={coverIntroAssets.liaActivatePortal1}
                  />
                  <span
                    className="cover-intro__portal-activation-contact"
                    data-testid="cover-activation-contact-light"
                  />
                  <img
                    className="cover-intro__portal-activation-frame cover-intro__portal-activation-frame--front"
                    src={coverIntroAssets.portal1Frame}
                    alt=""
                    data-testid="cover-activation-portal-front"
                    data-runtime-asset={coverIntroAssets.portal1Frame}
                  />
                </div>
              ) : null}
              {coverIntroPortals.map((portal) => {
                const available = portal.state === "available";
                const frameSrc = available
                  ? coverIntroAssets.portal1Frame
                  : coverIntroAssets.lockedFrame;
                const portalClassNames = [
                  "cover-intro__portal",
                  `cover-intro__portal--${portal.state}`,
                  portal.id === "portal-1"
                    ? "cover-intro__portal--primary"
                    : "cover-intro__portal--locked-secondary",
                  portal.id === "portal-1" && portalOneReady
                    ? "cover-intro__portal--ready"
                    : "",
                  portal.id === "portal-1" && portalOneOpening
                    ? "cover-intro__portal--opening"
                    : "",
                  portal.id === coverState.blockedPortalId
                    ? "cover-intro__portal--blocked-feedback"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                const ariaLabel =
                  portal.id === "portal-1"
                    ? portalOneReady
                      ? "Estación I, Mundo Raíz, lista para abrir."
                      : "Estación I, Mundo Raíz, disponible. Inicia la introducción de Lía."
                    : portal.ariaLabel;

                return (
                  <button
                    key={portal.id}
                    type="button"
                    className={portalClassNames}
                    aria-label={ariaLabel}
                    aria-disabled={available ? undefined : "true"}
                    data-portal-id={portal.id}
                    data-portal-state={
                      portal.id === "portal-1" && portalOneReady
                        ? "ready"
                        : portal.state
                    }
                    disabled={portal.id === "portal-1" && portalOneOpening}
                    onClick={
                      portal.id === "portal-1"
                        ? handlePortalOneClick
                        : () => showBlockedPortalMessage(portal.id)
                    }
                  >
                    {available ? (
                      <img
                        className="cover-intro__portal-glow"
                        src={coverIntroAssets.portal1Glow}
                        alt=""
                        aria-hidden="true"
                        data-runtime-asset={coverIntroAssets.portal1Glow}
                      />
                    ) : null}
                    <img
                      className="cover-intro__portal-frame"
                      src={frameSrc}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={frameSrc}
                    />
                    <span
                      className="cover-intro__portal-roman"
                      aria-hidden="true"
                    >
                      {portal.roman}
                    </span>
                    {available ? null : (
                      <img
                        className="cover-intro__portal-lock"
                        src={coverIntroAssets.lock}
                        alt=""
                        aria-hidden="true"
                        data-runtime-asset={coverIntroAssets.lock}
                      />
                    )}
                    <span className="cover-intro__portal-title">
                      {portal.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="cover-intro__footer">
          {coverState.blockedPortalMessage ? (
            <p className="cover-intro__blocked-message" role="status">
              {coverState.blockedPortalMessage}
            </p>
          ) : null}
          {coverState.phase === "portal_1_opening_placeholder" ? (
            <p className="cover-intro__opening" role="status">
              {coverIntroTransitionText.opening}
            </p>
          ) : null}
          <h1 id="cover-intro-title" className="cover-intro__title">
            {coverIntroText.archiveTitle}
          </h1>
          <button
            type="button"
            className="cover-intro__cta"
            aria-label={ctaLabel}
            onClick={handleCtaClick}
            disabled={portalOneOpening}
          >
            {ctaText}
          </button>
        </footer>
      </div>
    </main>
  );
}
