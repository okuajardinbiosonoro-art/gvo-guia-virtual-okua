import "./CoverIntroScreen.css";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { coverIntroAssets } from "./coverIntroAssets";
import {
  coverIntroDialogues,
  coverIntroPortals,
  coverIntroText,
  coverIntroTransitionText,
  coverIntroWorldOnePlaceholderRoute,
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
} from "./coverIntroState";
import type { CoverIntroPhase, CoverIntroState } from "./coverIntroState";

const liaPoseByState = {
  idle: coverIntroAssets.liaIdle,
  greeting: coverIntroAssets.liaGreeting,
  explainCalm: coverIntroAssets.liaExplainCalm,
  pointPortal1: coverIntroAssets.liaPointPortal1,
  activatePortal1: coverIntroAssets.liaActivatePortal1,
} satisfies Record<CoverIntroDialoguePose | "idle" | "activatePortal1", string>;

function createInitialCoverIntroState(): CoverIntroState {
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
  return phase === "intro_dialogue_started" || phase === "intro_dialogue_active";
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

export function CoverIntroScreen() {
  const [coverState, setCoverState] = useState<CoverIntroState>(
    createInitialCoverIntroState,
  );
  const blockedMessageTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

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
      setCoverState((current) => {
        if (current.phase !== "portal_1_opening_placeholder") {
          return current;
        }

        return {
          ...current,
          phase: "transition_to_station_1_placeholder",
          blockedPortalMessage: null,
          blockedPortalId: null,
        };
      });
      transitionTimeoutRef.current = null;
    }, 650);

    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [coverState.phase]);

  const stageStyle = {
    "--cover-background-image": `url(${coverIntroAssets.background})`,
  } as CSSProperties;
  const dialogueIsVisible = isDialoguePhase(coverState.phase);
  const activeDialogue = dialogueIsVisible
    ? coverIntroDialogues[coverState.activeDialogueIndex]
    : null;
  const activeDialogueStep = activeDialogue
    ? `${coverState.activeDialogueIndex + 1}/${coverIntroDialogues.length}`
    : null;
  const activeLiaPose = getLiaPoseSource(
    coverState.phase,
    activeDialogue?.liaPose,
  );
  const portalOneReady =
    coverState.phase === "portal_1_ready" ||
    coverState.phase === "portal_1_opening_placeholder" ||
    coverState.phase === "transition_to_station_1_placeholder";
  const portalOneOpening =
    coverState.phase === "portal_1_opening_placeholder" ||
    coverState.phase === "transition_to_station_1_placeholder";
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
      <div className="cover-intro__stage" data-cover-intro-version="002I">
        <header className="cover-intro__header">
          <p className="cover-intro__brand">{coverIntroText.logo}</p>
          <p className="cover-intro__subtitle">{coverIntroText.subtitle}</p>
        </header>

        <section className="cover-intro__scene" aria-label="Archivo Vivo OKÚA">
          <div className="cover-intro__lia-stage cover-lia-stage">
            <div
              className="cover-intro__lia-wrap cover-lia-layer"
              data-lia-state={activeDialogue?.liaPose ?? coverState.phase}
            >
              <img
                key={activeLiaPose}
                className="cover-intro__lia"
                src={activeLiaPose}
                alt="Lía, guía visual de OKÚA."
                data-runtime-asset={activeLiaPose}
                data-lia-pose={activeDialogue?.liaPose ?? coverState.phase}
              />
            </div>
          </div>

          {activeDialogue ? (
            <section
              className="cover-intro__dialogue"
              role="dialog"
              aria-live="polite"
              aria-label="Diálogo de Lía"
              data-dialogue-id={activeDialogue.id}
              data-dialogue-step={activeDialogueStep}
            >
              <div className="cover-intro__dialogue-meta">
                <span className="cover-intro__dialogue-speaker">Lía</span>
                <span
                  className="cover-intro__dialogue-step"
                  aria-label={`Diálogo ${activeDialogueStep}`}
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
            className="cover-intro__portal-stage cover-portal-stage cover-activation-stage"
            aria-label="Portales del recorrido"
          >
            <div className="cover-intro__portal-group cover-portal-group">
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
          >
            {ctaText}
          </button>
        </footer>

        {coverState.phase === "transition_to_station_1_placeholder" ? (
          <section
            className="cover-intro__transition-overlay"
            role="dialog"
            aria-live="polite"
            aria-label="Transición hacia Mundo I"
          >
            <div className="cover-intro__transition-card">
              <p className="cover-intro__transition-eyebrow">
                {coverIntroTransitionText.opening}
              </p>
              <p className="cover-intro__transition-title">
                {coverIntroTransitionText.preparing}
              </p>
              <p className="cover-intro__transition-copy">
                {coverIntroTransitionText.pending}
              </p>
              <span
                className="cover-intro__transition-indicator"
                aria-hidden="true"
              />
              <a
                className="cover-intro__transition-link"
                href={coverIntroWorldOnePlaceholderRoute}
                aria-label={coverIntroTransitionText.continue}
              >
                {coverIntroTransitionText.continue}
              </a>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
