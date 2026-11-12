import "./CoverIntroScreen.css";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { readLanguagePreference, type GvoLanguage } from "../../app/preferences/languagePreference";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { closeEssentialRoom, confirmEssentialStep, markEssentialPresented, useEssentialFlow } from "../../app/journey/journeyEssential";
import { beginFinalReview } from "../../app/review/finalReviewContext";
import { stationEntryRoutes } from "../../app/routes";
import { coverIntroAssets } from "./coverIntroAssets";
import { coverPortalInteriorAssets } from "./coverPortalInteriorAssets";
import { LiaJourneyMotion } from "../../components/LiaJourneyMotion/LiaJourneyMotion";
import { coverIntroCopyByLocale, coverIntroDialogues, coverIntroPortals } from "./coverIntroContent";
import type { CoverIntroPhase } from "./coverIntroState";

export type CoverIntroScreenProps = {
  locale?: GvoLanguage;
  onPortalEnter?: () => void | Promise<void>;
  onRevisitRoom?: (world: 1 | 2 | 3 | 4 | 5) => void;
};
const englishRooms = ["Root", "Invisible pulse", "Practice notebook", "Biosonic system", "OKÚA, sensory art"] as const;

export function CoverIntroScreen({ locale = readLanguagePreference() ?? "es", onPortalEnter, onRevisitRoom }: CoverIntroScreenProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { active, attemptId } = useJourneyActivity();
  const flow = useEssentialFlow("cover");
  const copy = coverIntroCopyByLocale[locale];
  const [started, setStarted] = useState(() => flow.confirmedStepIds.length > 0 && !flow.closed);
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingRef = useRef(false);
  const enteringRef = useRef(false);
  const portalRef = useRef<HTMLButtonElement>(null);
  const dialogueActionRef = useRef<HTMLButtonElement>(null);
  const justClosedRef = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const coverRevisitActive = flow.readOnly && flow.exitReady;
  const portalReady = flow.closed || coverRevisitActive;
  const dialogueIndex = Math.max(0, coverIntroDialogues.findIndex((dialogue) => dialogue.stepId === flow.activeStepId));
  const dialogueVisible = started && !portalReady;
  const dialogue = dialogueVisible ? coverIntroDialogues[dialogueIndex] : null;
  const lastDialogue = dialogueIndex === coverIntroDialogues.length - 1;
  const phase: CoverIntroPhase = opening ? "portal_1_opening_placeholder"
    : portalReady ? "portal_1_ready"
    : dialogueVisible ? dialogueIndex === 0 ? "intro_dialogue_started" : "intro_dialogue_active" : "portada_idle";
  const liaAction = portalReady ? "present" : dialogueVisible ? dialogueIndex === 0 ? "respond" : "present" : "attention";

  useEffect(() => {
    if (flow.confirmedStepIds.length > 0 && !flow.closed) setStarted(true);
  }, [flow.confirmedStepIds.length, flow.closed]);

  useEffect(() => {
    if (!active || !dialogue || flow.readOnly || flow.presentedStepIds.includes(dialogue.stepId)) return;
    let current = true;
    void markEssentialPresented({ screen: "cover", stepId: dialogue.stepId, contentRevision: flow.contentRevision, attemptId, mode: "standard" }).then((result) => {
      if (current && !result.ok && activeRef.current) setError(copy.saveError);
    });
    return () => { current = false; };
  }, [active, attemptId, dialogue, flow.readOnly, flow.presentedStepIds, flow.contentRevision, copy.saveError]);

  useEffect(() => {
    if (!active) return;
    if (flow.closed && justClosedRef.current) {
      justClosedRef.current = false;
      portalRef.current?.focus({ preventScroll: true });
    } else if (dialogueVisible) dialogueActionRef.current?.focus({ preventScroll: true });
  }, [active, dialogueIndex, dialogueVisible, flow.closed]);

  useEffect(() => {
    // Resetting the journey/presentation belongs to the shared root controller.
    // Merely opening a URL must not clear legacy or current presentation evidence.
    enteringRef.current = false;
    setOpening(false);
  }, [location.key]);

  async function advanceDialogue() {
    if (!active || !dialogue || flow.readOnly || savingRef.current) return;
    savingRef.current = true;
    setSaving(true); setError(null);
    try {
      if (!flow.presentedStepIds.includes(dialogue.stepId)) {
        const presented = await markEssentialPresented({ screen: "cover", stepId: dialogue.stepId, contentRevision: flow.contentRevision, attemptId, mode: "standard" });
        if (!presented.ok) { setError(copy.saveError); return; }
      }
      if (lastDialogue) justClosedRef.current = true;
      const result = lastDialogue
        ? await closeEssentialRoom({ screen: "cover", contentRevision: flow.contentRevision, attemptId, cause: "visitor_close" })
        : await confirmEssentialStep({ screen: "cover", stepId: dialogue.stepId, contentRevision: flow.contentRevision, attemptId, cause: "visitor_advance" });
      if (!result.ok) { justClosedRef.current = false; setError(copy.saveError); }
    } finally { savingRef.current = false; setSaving(false); }
  }

  async function enterPortal() {
    if (!active || !flow.exitReady || coverRevisitActive || enteringRef.current) return;
    if (!onPortalEnter) { setError(copy.unavailable); return; }
    enteringRef.current = true; setOpening(true); setError(null);
    try { await onPortalEnter(); }
    catch { enteringRef.current = false; setOpening(false); setError(copy.unavailable); }
  }

  function revisit(world: 1 | 2 | 3 | 4 | 5) {
    if (!active || !coverRevisitActive) return;
    if (onRevisitRoom) onRevisitRoom(world);
    else navigate(stationEntryRoutes[world], { state: beginFinalReview(world) });
  }

  const stageStyle = { "--cover-background-image": `url(${coverIntroAssets.background})` } as CSSProperties;
  return (
    <main className={`cover-intro cover-intro--${phase}`} style={stageStyle} lang={locale}
      aria-labelledby="cover-intro-title" data-cover-phase={phase}
      data-cover-revisit={coverRevisitActive ? "active" : "inactive"}
      data-intro-completed={flow.closed ? "true" : "false"} data-journey-active={active ? "true" : "false"}
      data-essential-revision={flow.contentRevision} data-essential-exit-ready={flow.exitReady ? "true" : "false"}>
      <div className="cover-intro__scrim" aria-hidden="true" />
      <div className="cover-intro__stage" data-cover-intro-version="OBS03.2">
        <header className="cover-intro__header">
          <img className="cover-intro__brand-logo" src={coverIntroAssets.brandLogo} alt="" aria-hidden="true"
            width={116} height={142} data-runtime-asset={coverIntroAssets.brandLogo} draggable={false} />
          <p className="cover-intro__brand-name">{copy.logo}</p>
          <p className="cover-intro__brand-subtitle">{copy.subtitle}</p>
        </header>
        <section className="cover-intro__scene" aria-label={copy.scene}>
          <div className="cover-intro__lia-stage cover-lia-stage" data-testid="cover-lia-stage">
            <div className="cover-intro__lia-wrap cover-lia-layer" data-lia-state={`rig-${liaAction}`} role="img" aria-label={copy.liaAlt}>
              <LiaJourneyMotion className="cover-intro__lia" action={liaAction} active={active}
                target={portalReady ? "portal-1" : dialogue?.stepId ?? "start-dialogue"} replayKey={dialogue?.stepId ?? phase} direction="left" />
            </div>
          </div>
          {dialogue ? <section className="cover-intro__dialogue cover-dialogue-dock cover-dialogue-panel"
            role="dialog" aria-live="polite" aria-label={copy.dialogueLabel} data-dialogue-id={dialogue.id}
            data-dialogue-step={copy.step(dialogueIndex)} data-source-ids={dialogue.sourceIds.join(" ")} data-testid="cover-dialogue-panel">
            <div className="cover-intro__dialogue-meta"><span className="cover-intro__dialogue-speaker">Lía</span>
              <span className="cover-intro__dialogue-step">{copy.step(dialogueIndex)}</span></div>
            <p className="cover-intro__dialogue-text">{locale === "en" ? dialogue.en : dialogue.text}</p>
            <div className="cover-intro__dialogue-actions">
              <button ref={dialogueActionRef} type="button" className="cover-intro__dialogue-button"
                disabled={!active || saving} aria-label={error ? copy.retry : lastDialogue ? copy.dialogueFinish : copy.nextLabel}
                onClick={() => void advanceDialogue()}>
                {saving ? copy.saving : error ? copy.retry : lastDialogue ? copy.dialogueFinish : copy.dialogueNext}
              </button>
            </div>
          </section> : null}
          <div className={`cover-intro__portal-stage cover-portal-stage cover-activation-stage${portalReady ? " cover-portal-stage--ready" : ""}${opening ? " cover-portal-stage--opening" : ""}`}
            aria-label={copy.portals} data-testid="cover-portal-stage">
            <div className="cover-intro__portal-group cover-portals-group">
              {opening ? <div className="cover-intro__portal-activation-rig" data-testid="cover-portal-activation-rig" aria-hidden="true">
                <img className="cover-intro__portal-activation-glow" src={coverIntroAssets.portal1Glow} alt="" />
                <img className="cover-intro__portal-activation-frame cover-intro__portal-activation-frame--back" src={coverIntroAssets.portal1Frame} alt="" />
                <img className="cover-intro__portal-activation-lia" src={coverIntroAssets.liaActivatePortal1} alt="" data-testid="cover-activation-lia" />
                <span className="cover-intro__portal-activation-contact" data-testid="cover-activation-contact-light" />
                <img className="cover-intro__portal-activation-frame cover-intro__portal-activation-frame--front" src={coverIntroAssets.portal1Frame} alt="" data-testid="cover-activation-portal-front" />
              </div> : null}
              {coverIntroPortals.map((portal, index) => {
                if (!coverRevisitActive && portal.world !== 1) return null;
                const available = coverRevisitActive || portalReady;
                const label = coverRevisitActive ? locale === "en" ? `Review Room ${portal.roman} · ${englishRooms[index]}` : portal.reviewAriaLabel
                  : portalReady ? copy.portalReady : copy.portalLocked;
                return <button key={portal.id} ref={portal.world === 1 ? portalRef : undefined} type="button"
                  className={`cover-intro__portal cover-intro__portal--${available ? "available" : "locked"} ${portal.world === 1 ? "cover-intro__portal--primary" : "cover-intro__portal--locked-secondary"}${coverRevisitActive ? " cover-intro__portal--review-available" : ""}${portalReady && portal.world === 1 ? " cover-intro__portal--ready" : ""}`}
                  aria-label={label} aria-disabled={!available || !active ? "true" : undefined}
                  disabled={!available || !active || opening} data-portal-id={portal.id}
                  data-portal-state={coverRevisitActive ? "available" : portalReady ? "ready" : "locked"}
                  onClick={() => coverRevisitActive ? revisit(portal.world) : void enterPortal()}>
                  <span className="cover-intro__portal-art" aria-hidden="true">
                    {portal.world === 1 ? <img className="cover-intro__portal-glow" src={coverIntroAssets.portal1Glow} alt="" data-runtime-asset={coverIntroAssets.portal1Glow} /> : null}
                    <img className="cover-intro__portal-interior" src={coverPortalInteriorAssets[index].src} alt="" decoding="async"
                      data-cover-portal-interior={coverPortalInteriorAssets[index].id} data-portal-clip={portal.world === 1 ? "primary-safe" : "base"}
                      data-runtime-asset={coverPortalInteriorAssets[index].src} />
                    <img className="cover-intro__portal-frame" src={portal.world === 1 ? coverIntroAssets.portal1Frame : coverIntroAssets.lockedFrame}
                      alt="" data-runtime-asset={portal.world === 1 ? coverIntroAssets.portal1Frame : coverIntroAssets.lockedFrame} />
                  </span>
                  <span className="cover-intro__portal-roman" aria-hidden="true">{portal.roman}</span>
                  {!available ? <img className="cover-intro__portal-lock" src={coverIntroAssets.lock} alt="" aria-hidden="true" /> : null}
                  <span className="cover-intro__portal-title">{locale === "en" ? `Room ${portal.roman} · ${englishRooms[index]}` : portal.title}</span>
                </button>;
              })}
            </div>
          </div>
        </section>
        <footer className="cover-intro__footer">
          <h1 id="cover-intro-title" className="cover-intro__title">{copy.archiveTitle}</h1>
          {!started && !portalReady ? <button type="button" className="cover-intro__cta" disabled={!active}
            onClick={() => { if (active) { setError(null); setStarted(true); } }}>{copy.cta}</button> : null}
          {portalReady && !coverRevisitActive && !opening ? <p className="cover-intro__portal-announcement" role="status">{copy.portalAnnouncement}</p> : null}
          {opening ? <p className="cover-intro__opening" role="status">{copy.openingWorldOne}</p> : null}
          {error ? <p className="cover-intro__blocked-message" role="alert">{error}</p> : null}
        </footer>
      </div>
    </main>
  );
}
