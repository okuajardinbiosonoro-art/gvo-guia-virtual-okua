import "./CoverIntroScreen.css";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { coverIntroAssets } from "./coverIntroAssets";
import {
  coverIntroDialogues,
  coverIntroPortals,
  coverIntroText,
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
  if (phase === "portal_1_opening_placeholder") {
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

  useEffect(() => {
    return () => {
      if (blockedMessageTimeoutRef.current !== null) {
        window.clearTimeout(blockedMessageTimeoutRef.current);
      }
    };
  }, []);

  const stageStyle = {
    "--cover-background-image": `url(${coverIntroAssets.background})`,
  } as CSSProperties;
  const dialogueIsVisible = isDialoguePhase(coverState.phase);
  const activeDialogue = dialogueIsVisible
    ? coverIntroDialogues[coverState.activeDialogueIndex]
    : null;
  const activeLiaPose = getLiaPoseSource(
    coverState.phase,
    activeDialogue?.liaPose,
  );
  const portalOneReady =
    coverState.phase === "portal_1_ready" ||
    coverState.phase === "portal_1_opening_placeholder";
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
        current.phase === "portal_1_opening_placeholder"
      ) {
        return current;
      }

      if (current.introCompleted) {
        return {
          ...current,
          phase: "portal_1_ready",
          blockedPortalMessage: null,
        };
      }

      return {
        phase: "intro_dialogue_started",
        activeDialogueIndex: 0,
        blockedPortalMessage: null,
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
          introCompleted: true,
        };
      }

      return {
        ...current,
        phase: "intro_dialogue_active",
        activeDialogueIndex: current.activeDialogueIndex + 1,
        blockedPortalMessage: null,
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
      };
    });
  }

  function handlePortalOneClick() {
    if (coverState.phase === "portal_1_ready") {
      openPortalOnePlaceholder();
      return;
    }

    if (coverState.phase === "portal_1_opening_placeholder") {
      return;
    }

    startIntroDialogue();
  }

  function showBlockedPortalMessage(portalId: LockedPortalId) {
    if (
      isDialoguePhase(coverState.phase) ||
      coverState.phase === "portal_1_opening_placeholder"
    ) {
      return;
    }

    if (blockedMessageTimeoutRef.current !== null) {
      window.clearTimeout(blockedMessageTimeoutRef.current);
    }

    setCoverState((current) => ({
      ...current,
      blockedPortalMessage: lockedPortalMessages[portalId],
    }));

    blockedMessageTimeoutRef.current = window.setTimeout(() => {
      setCoverState((current) => ({
        ...current,
        blockedPortalMessage: null,
      }));
      blockedMessageTimeoutRef.current = null;
    }, 1800);
  }

  function handleCtaClick() {
    if (coverState.phase === "portal_1_ready") {
      openPortalOnePlaceholder();
      return;
    }

    if (coverState.phase === "portal_1_opening_placeholder") {
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
      <div className="cover-intro__stage" data-cover-intro-version="002E">
        <header className="cover-intro__header">
          <p className="cover-intro__brand">{coverIntroText.logo}</p>
          <p className="cover-intro__subtitle">{coverIntroText.subtitle}</p>
        </header>

        <section className="cover-intro__scene" aria-label="Archivo Vivo OKÚA">
          <img
            className="cover-intro__lia"
            src={activeLiaPose}
            alt="Lía, guía visual de OKÚA."
            data-runtime-asset={activeLiaPose}
            data-lia-pose={activeDialogue?.liaPose ?? coverState.phase}
          />

          {activeDialogue ? (
            <div
              className="cover-intro__dialogue"
              role="dialog"
              aria-live="polite"
              aria-label="Diálogo de Lía"
              data-dialogue-id={activeDialogue.id}
            >
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
            </div>
          ) : null}

          <div
            className="cover-intro__portals"
            aria-label="Portales del recorrido"
          >
            {coverIntroPortals.map((portal) => {
              const available = portal.state === "available";
              const frameSrc = available
                ? coverIntroAssets.portal1Frame
                : coverIntroAssets.lockedFrame;
              const portalClassNames = [
                "cover-intro__portal",
                `cover-intro__portal--${portal.state}`,
                portal.id === "portal-1" && portalOneReady
                  ? "cover-intro__portal--ready"
                  : "",
                portal.id === "portal-1" &&
                coverState.phase === "portal_1_opening_placeholder"
                  ? "cover-intro__portal--opening"
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
        </section>

        <footer className="cover-intro__footer">
          {coverState.blockedPortalMessage ? (
            <p className="cover-intro__blocked-message" role="status">
              {coverState.blockedPortalMessage}
            </p>
          ) : null}
          {coverState.phase === "portal_1_opening_placeholder" ? (
            <p className="cover-intro__opening" role="status">
              {coverIntroText.openingWorldOne}
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
      </div>
    </main>
  );
}
