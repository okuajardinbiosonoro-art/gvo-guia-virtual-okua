import { playJourneySound } from "../../app/audio/journeySound";
import "./World5QuizExperience.css";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import {
  canUseUiStep, captureJourneyMutationToken, closeEssentialRoom,
  confirmEssentialStep, getJourneyRuntimeContext, isJourneyMutationTokenCurrent,
  markEssentialPresented, useEssentialFlow,
} from "../../app/journey/journeyEssential";
import { acceptJourneyIntent } from "../../app/journey/journeyIntent";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { worldFiveEntryRoute, worldFiveToFinalTransitionRoute } from "../../app/routes";
import { LiaJourneyMotion } from "../../components/LiaJourneyMotion/LiaJourneyMotion";
import { type Station5AreaId } from "./station5Content";
import {
  WORLD5_QUIZ_AREA_ORDER, WORLD5_QUIZ_STORAGE_KEY, WORLD5_ROUNDS_STORAGE_KEY,
  mutateWorld5Rounds, readWorld5Rounds, recoverWorld5Quiz,
  type World5RoundCommand, type World5RoundsRead,
} from "./world5Quiz";
import { resolveWorld5QuizView, type World5QuizView } from "./world5QuizView";
import { alreadyCreditedPoint, getWorld5AreaTitle, getWorld5Question, world5QuizCopy } from "./world5QuizContent";
import { getWorld5GalleryEnvironment, world5NavigationAssets, world5OptionAssets } from "./world5RuntimeAssets";

type NewRoundAction =
  | { kind: "answer"; area: Station5AreaId; side: "agreement" | "disagreement" }
  | { kind: "skip"; area: Station5AreaId }
  | { kind: "finish_round" | "begin_retry" };

const celebrationPieces = [
  [7, 27, 24], [12, 58, -29], [16, 11, 48], [22, 39, -37],
  [28, 77, 31], [34, 16, 62], [64, 12, -44], [72, 73, 51],
  [78, 28, -19], [84, 51, 26], [88, 9, -53], [93, 67, 38],
] as const;

export function World5RootScreen() {
  const navigate = useNavigate(), location = useLocation();
  const activity = useJourneyActivity(), essential = useEssentialFlow(5);
  const locale = readLanguagePreference() ?? "es", copy = world5QuizCopy[locale];
  const [roundRead, setRoundRead] = useState(readWorld5Rounds);
  const rounds = useRef(roundRead);
  rounds.current = roundRead;
  const resolveView = (read: World5RoundsRead, pathname = location.pathname) => resolveWorld5QuizView({
    pathname, read, readOnly: essential.readOnly, pendingStepId: essential.firstPendingStepId,
    canUseStep: (id) => canUseUiStep(5, id, getJourneyRuntimeContext()),
  });
  const [view, setView] = useState<World5QuizView>(() => resolveView(roundRead));
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false), [presented, setPresented] = useState(false);
  const [saveError, setSaveError] = useState(false), [assetError, setAssetError] = useState(false);
  const [awardedArea, setAwardedArea] = useState<Station5AreaId | null>(null);
  const [presentationRetry, setPresentationRetry] = useState(0);
  const [visible, setVisible] = useState(() => !document.hidden);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(() => window.innerWidth >= window.innerHeight ? "landscape" : "portrait");
  const heading = useRef<HTMLHeadingElement>(null), advanceButton = useRef<HTMLButtonElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const answeredFocusOrigin = useRef<HTMLElement | null>(null);
  const [feedbackOwnsFocus, setFeedbackOwnsFocus] = useState(false);
  const unitId = useId(), titleId = unitId + "-title", questionId = unitId + "-question", instructionId = unitId + "-instruction";
  const pendingCommand = useRef<World5RoundCommand | null>(null);
  const retryKind = useRef<"present" | "advance" | "close" | "command">("present");
  const lastActivatedAssetAttempt = useRef<string | null>(null);
  const activeRef = useRef(activity.active);
  activeRef.current = activity.active;
  const lock = useRef(false);
  const input = { screen: 5 as const, contentRevision: essential.contentRevision, attemptId: activity.attemptId };
  const isCurrentAttempt = () => {
    const context = getJourneyRuntimeContext();
    return Boolean(input.attemptId && context.active && context.authorized && context.attemptId === input.attemptId && context.screen === 5 && context.mode === "normal");
  };
  // A new deliberate gesture captures its own authority. A saved command keeps
  // its identity across technical retries; an old callback keeps its old attempt.
  function captureCommitGuard() {
    const token = captureJourneyMutationToken(), attemptId = input.attemptId;
    return () => {
      const context = getJourneyRuntimeContext();
      return Boolean(isJourneyMutationTokenCurrent(token) && attemptId && activeRef.current && !document.hidden && context.active && context.authorized && context.screen === 5 && context.mode === "normal" && context.attemptId === attemptId);
    };
  }
  function updateRead(read: World5RoundsRead) { rounds.current = read; setRoundRead(read); }
  const storageIssue = roundRead.status === "corrupt" || roundRead.status === "unavailable";
  const available = activity.active && visible && !essential.readOnly && !busy && !storageIssue && !assetError;
  const mutable = available && !saveError;
  const area = view === "resultado" ? null : view;
  const question = area ? getWorld5Question(area, locale) : null;
  const quiz = essential.readOnly && roundRead.status === "legacy" ? roundRead.legacyQuiz : roundRead.quiz;
  const correct = area !== null && quiz.correctAnswers.includes(area);
  const incorrect = area !== null && quiz.answeredQuestions.includes(area) && !correct && !quiz.skippedQuestions.includes(area);
  const skipped = area !== null && quiz.skippedQuestions.includes(area);
  const resolved = correct || incorrect || skipped;
  const answeredSide = area ? roundRead.round?.outcomes[area]?.choice : null;
  const prizeEligible = !essential.readOnly && roundRead.eligible && (essential.confirmed.includes("visitante") || essential.closed);
  const historicalWin = essential.readOnly && roundRead.eligible;
  const background = getWorld5GalleryEnvironment(orientation);
  const legacyOnly = roundRead.status === "legacy" && !roundRead.ledger;
  const showLegacyHistory = legacyOnly && (roundRead.legacyQuiz.answeredQuestions.length > 0 || roundRead.legacyQuiz.skippedQuestions.length > 0);

  useLayoutEffect(() => {
    const origin = answeredFocusOrigin.current;
    if (!resolved || !origin) return;
    answeredFocusOrigin.current = null;
    if (!activity.active || !visible || !isCurrentAttempt()) return;
    const focusLost = !origin.isConnected || (origin instanceof HTMLButtonElement && origin.disabled);
    if (focusLost && (document.activeElement === origin || document.activeElement === document.body)) feedback.current?.focus();
  }, [resolved, activity.active, visible, activity.attemptId]);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    const token = activity.attemptId, runtime = getJourneyRuntimeContext();
    if (!activity.active || !visible || document.hidden || !token || !runtime.active || !runtime.authorized || runtime.screen !== 5 || runtime.attemptId !== token || lastActivatedAssetAttempt.current === token) return;
    lastActivatedAssetAttempt.current = token;
    setAssetError(false);
    // Re-preparation may restore a failed readback. Re-read without replacing
    // the pending command: the visitor still retries its original action ID.
    if (pendingCommand.current) updateRead(readWorld5Rounds());
  }, [activity.active, activity.attemptId, visible]);
  useEffect(() => {
    const resize = () => setOrientation(window.innerWidth >= window.innerHeight ? "landscape" : "portrait");
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const read = readWorld5Rounds();
    updateRead(read); setView(resolveView(read));
    setAwardedArea(null); setAssetError(false); setSaveError(false);
    setFeedbackOwnsFocus(false); answeredFocusOrigin.current = null;
    pendingCommand.current = null;
    // Navigation restores verified round state; semantic writes alone must not
    // replace the visible question before its explicit Next gesture.
  }, [location.pathname, location.key, essential.readOnly]);
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== null && event.key !== WORLD5_ROUNDS_STORAGE_KEY && event.key !== WORLD5_QUIZ_STORAGE_KEY) return;
      const pending = pendingCommand.current !== null, read = readWorld5Rounds();
      pendingCommand.current = null;
      updateRead(read); setView(resolveView(read));
      setSaveError(pending); retryKind.current = "present";
      setAwardedArea(null);
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, [location.pathname, essential.readOnly, essential.firstPendingStepId]);
  useEffect(() => {
    setPresented(false);
    if (!activity.active || !visible || essential.readOnly || storageIssue || assetError) return;
    let cancelled = false;
    void markEssentialPresented({ ...input, stepId: view, mode: "standard" }).then((result) => {
      if (cancelled || !activeRef.current || document.hidden || !isCurrentAttempt()) return;
      setPresented(result.ok);
      if (pendingCommand.current) {
        // Preparation cannot hide an unresolved write or replace its retry ID.
        setSaveError(true);
      } else {
        setSaveError(!result.ok); retryKind.current = "present";
        if (result.ok) heading.current?.focus();
      }
    });
    return () => { cancelled = true; };
  }, [activity.active, visible, activity.attemptId, essential.readOnly, essential.contentRevision, view, storageIssue, assetError, presentationRetry]);

  function fail(kind: typeof retryKind.current) { retryKind.current = kind; setSaveError(true); }
  function command(action: NewRoundAction): World5RoundCommand {
    const read = rounds.current;
    return { ...action, actionId: crypto.randomUUID(), expectedRaw: read.raw, roundId: read.round?.roundId ?? null };
  }
  function commit(action: World5RoundCommand, canCommit = captureCommitGuard()) {
    if (!canCommit()) return null;
    const result = mutateWorld5Rounds(action, { canCommit });
    if (!canCommit()) return null;
    updateRead(result.read);
    if (!result.ok) {
      if (result.reason === "conflict") {
        pendingCommand.current = null; setView(resolveView(result.read)); fail("present");
      } else { pendingCommand.current = action; fail("command"); }
      return null;
    }
    pendingCommand.current = null; setSaveError(false);
    return result;
  }
  function applyAnswer(action: World5RoundCommand) {
    const result = commit(action);
    if (!result) return false;
    if (action.kind === "answer") {
      const feedback = result.read.round?.outcomes[action.area]?.kind;
      if (feedback === "correct" || feedback === "incorrect") playJourneySound(feedback);
    }
    const focused = document.activeElement;
    if (action.kind === "answer" && focused instanceof HTMLElement && (focused.matches("[data-answer]") || focused.closest(".s5-quiz-error"))) {
      answeredFocusOrigin.current = focused;
      setFeedbackOwnsFocus(true);
    }
    setAwardedArea(result.awarded && "area" in action ? action.area : null);
    return true;
  }
  function answer(side: "agreement" | "disagreement") {
    if (!mutable || !presented || !area || lock.current || pendingCommand.current || rounds.current.round?.outcomes[area]) return;
    lock.current = true;
    applyAnswer(command({ kind: "answer", area, side }));
    lock.current = false;
  }
  async function advance(skip = false) {
    if (!activity.active || document.hidden || essential.readOnly || !presented || !area || lock.current || storageIssue || assetError) return;
    const canCommit = captureCommitGuard(); if (!canCommit()) return;
    lock.current = true; setBusy(true);
    try {
      if (skip && !rounds.current.round?.outcomes[area]) {
        const saved = pendingCommand.current?.kind === "skip" ? pendingCommand.current : command({ kind: "skip", area });
        if (!commit(saved, canCommit)) { retryKind.current = "advance"; return; }
      }
      if (!rounds.current.round?.outcomes[area]) return;
      if (area === "visitante") {
        const read = rounds.current;
        const saved = pendingCommand.current?.kind === "finish_round" ? pendingCommand.current : read.complete && read.round?.completionReceipt ? { kind: "finish_round" as const, actionId: read.round.completionReceipt, expectedRaw: read.raw, roundId: read.round.roundId } : command({ kind: "finish_round" });
        if (!commit(saved, canCommit)) { retryKind.current = "advance"; return; }
      }
      if (!canCommit()) return;
      const result = await confirmEssentialStep({ ...input, stepId: area, cause: "visitor_advance" });
      if (!canCommit()) return;
      if (result.ok) {
        setSaveError(false);
        const next = WORLD5_QUIZ_AREA_ORDER[WORLD5_QUIZ_AREA_ORDER.indexOf(area) + 1];
        playJourneySound("interaction", { replace: true });
        navigate(next ? "/estacion/5/" + next : worldFiveEntryRoute, { replace: true });
      } else fail("advance");
    } finally { lock.current = false; setBusy(false); }
  }
  function beginRetry(saved?: World5RoundCommand) {
    if (!activity.active || document.hidden || essential.readOnly || lock.current || (!saved && !rounds.current.canRetry)) return;
    const canCommit = captureCommitGuard(); if (!canCommit()) return;
    lock.current = true;
    const result = commit(saved ?? command({ kind: "begin_retry" }), canCommit);
    if (result && canCommit()) {
      playJourneySound("interaction", { replace: true });
      setAwardedArea(null); setFeedbackOwnsFocus(false);
      setView("plantas"); navigate("/estacion/5/plantas", { replace: true });
    }
    lock.current = false;
  }
  async function close(retryingSave = false) {
    if (!(retryingSave ? available : mutable) || !presented || view !== "resultado" || !rounds.current.complete || lock.current) return;
    const canCommit = captureCommitGuard(); if (!canCommit()) return;
    lock.current = true; setBusy(true);
    try {
      const result = await closeEssentialRoom({ ...input, cause: "visitor_close" });
      if (!canCommit()) return;
      if (result.ok && acceptJourneyIntent({ from: 5, to: "/final", kind: "result_closure", attemptId: input.attemptId })) {
        if (!result.alreadyApplied) playJourneySound("roomComplete");
        navigate(worldFiveToFinalTransitionRoute);
      }
      else fail("close");
    } finally { lock.current = false; setBusy(false); }
  }
  async function retry() {
    const canCommit = captureCommitGuard(); if (!canCommit() || essential.readOnly) return;
    if (storageIssue) {
      const read = readWorld5Rounds(); updateRead(read);
      if (read.status !== "corrupt" && read.status !== "unavailable") {
        setSaveError(pendingCommand.current !== null);
        if (!pendingCommand.current) setView(resolveView(read));
        setPresentationRetry((value) => value + 1);
      }
      return;
    }
    if (retryKind.current === "advance") await advance(pendingCommand.current?.kind === "skip");
    else if (retryKind.current === "close") await close(true);
    else if (pendingCommand.current) {
      const saved = pendingCommand.current;
      if (saved.kind === "begin_retry") beginRetry(saved);
      else if (saved.kind === "finish_round" || saved.kind === "skip") await advance(saved.kind === "skip");
      else applyAnswer(saved);
    } else { setSaveError(false); setPresentationRetry((value) => value + 1); }
  }
  function resetLocal() {
    const canCommit = captureCommitGuard(); if (!canCommit() || roundRead.status !== "corrupt") return;
    if (!recoverWorld5Quiz({ canCommit })) { setSaveError(true); return; }
    const read = readWorld5Rounds(); updateRead(read);
    pendingCommand.current = null; setSaveError(false); setConfirmReset(false);
    setAwardedArea(null); setView(resolveView(read)); setPresentationRetry((value) => value + 1);
  }
  function openQuestion(id: Station5AreaId) {
    if (!activity.active || !visible || busy || pendingCommand.current || !canUseUiStep(5, id, getJourneyRuntimeContext())) return;
    if (!essential.readOnly) {
      if (id === view) heading.current?.focus();
      return;
    }
    const path = "/estacion/5/" + id;
    if (view === id || resolveView(rounds.current, path) !== id) return;
    playJourneySound("interaction", { replace: true });
    navigate(path, { replace: true });
  }
  const lia = (
    <LiaJourneyMotion
      className="s5-quiz-lia"
      active={activity.active && visible}
      action={
        view === "resultado"
          ? prizeEligible ? "respond" : "attention"
          : correct ? "respond" : answeredSide ? "attention" : "present"
      }
      target={view}
      replayKey={`${view}-${awardedArea}-${resolved}`}
      direction={
        answeredSide ? answeredSide === "agreement" ? "left" : "right"
        : area && WORLD5_QUIZ_AREA_ORDER.indexOf(area) % 2
          ? "left"
          : "right"
      }
    />
  );
  return (
    <main
      className="s5-quiz"
      data-station5-area={view}
      data-station5-state={
        view === "resultado" ? "result" : resolved ? "resolved" : "question"
      }
      data-prize-eligible={view === "resultado" ? prizeEligible : undefined}
      data-station5-readonly={essential.readOnly}
      data-motion-active={activity.active && visible}
      aria-labelledby="station5-title"
    >
      <div className="s5-quiz-backdrop" aria-hidden="true">
        <img
          className="s5-quiz-gallery"
          src={background}
          alt=""
          data-runtime-asset={background}
          onError={() => setAssetError(true)}
        />
      </div>
      <div className="s5-gallery-journey">
        <div className="s5-gallery-marquee">
        <header className="s5-quiz-header">
          <h1 id="station5-title">{copy.room} · {copy.title}</h1>
          {!essential.readOnly || roundRead.ledger ? <p className="s5-quiz-round">{copy.round(roundRead.roundNumber)}</p> : null}
          {view === "plantas" ? (
            <div className="s5-quiz-introduction">
              <p>{copy.introduction} {copy.guidance}</p>
              <p>{copy.prizeCondition}</p>
            </div>
          ) : null}
          {showLegacyHistory ? <p className="s5-quiz-legacy">{copy.legacyHistory(roundRead.legacyQuiz.correctAnswers.length)}</p> : null}
        </header>
        <nav className="s5-quiz-nav" aria-label={copy.review}>
          {WORLD5_QUIZ_AREA_ORDER.map((id, index) => (
            <button
              key={id}
              type="button"
              aria-current={view === id ? "step" : undefined}
              disabled={
                !activity.active ||
                !visible ||
                busy || !!pendingCommand.current ||
                !canUseUiStep(5, id, getJourneyRuntimeContext()) ||
                (!essential.readOnly && view !== id)
              }
              onClick={() => openQuestion(id)}
            >
              <img src={world5NavigationAssets[id]} alt="" draggable={false} data-runtime-asset={world5NavigationAssets[id]} onError={() => setAssetError(true)} />
              <span className="s5-quiz-nav-caption"><span>{index + 1}</span><span className="s5-quiz-nav-title">{getWorld5AreaTitle(id, locale)}</span></span>
            </button>
          ))}
        </nav>
        </div>
        <article
          className="s5-question-unit"
          aria-labelledby={titleId}
          data-answer-accepted={!essential.readOnly ? answeredSide ?? undefined : undefined}
          aria-busy={busy}
        >
          <header className="s5-question-prompt s5-quiz-reading">
            <div>
              <h2 id={titleId} ref={heading} tabIndex={-1}>
                {question?.title ?? copy.result}
              </h2>
              {essential.readOnly ? <p>{copy.readonly}</p> : null}
              {question ? (
                <>
                <p
                  id={questionId}
                  className="s5-quiz-question"
                  data-source-id={question.sourceId}
                >
                  {question.question}
                </p>
                <p id={instructionId} hidden>{question.instruction}</p>
                </>
              ) : null}
            </div>
            {question ? lia : null}
          </header>
          <section
            className={`s5-quiz-scene${view === "resultado" ? " s5-quiz-scene--result" : ""}`}
            aria-label={area ? getWorld5AreaTitle(area, locale) : copy.result}
          >
            {area && question ? (
              <div
                className="s5-quiz-options"
                role="group"
                aria-labelledby={questionId}
                aria-describedby={instructionId}
              >
                {(["agreement", "disagreement"] as const).map((side) => (
                  <button
                    type="button"
                    key={side}
                    className="s5-quiz-option"
                    disabled={
                      !mutable || !presented || resolved || !!pendingCommand.current
                    }
                    aria-label={question[side]}
                    data-answer={side}
                    data-answer-selected={answeredSide === side ? "true" : undefined}
                    onClick={() => answer(side)}
                  >
                    <img
                      src={world5OptionAssets[area][side]}
                      alt=""
                      draggable={false}
                      data-runtime-asset={world5OptionAssets[area][side]}
                      onError={() => setAssetError(true)}
                    />
                    <span>{question[side]}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {view === "resultado" && !essential.readOnly && prizeEligible ? (
              <div className="s5-quiz-confetti" data-station5-celebration="" aria-hidden="true">
                {celebrationPieces.map(([x, y, rotation]) => (
                  <span key={x} style={{ left: `${x}%`, top: `${y}%`, rotate: `${rotation}deg` }} />
                ))}
              </div>
            ) : null}
            {view === "resultado" ? lia : null}
          </section>
          <div className="s5-question-response s5-quiz-reading">
            {question ? (
              <>
                <div
                  ref={feedback}
                  tabIndex={-1}
                  className="s5-quiz-feedback"
                  role="status"
                  aria-live={feedbackOwnsFocus ? "off" : "polite"}
                  aria-atomic="true"
                >
                  {resolved ? (
                    correct ? (
                      <>
                        <p>{question.feedback}</p>
                        {awardedArea !== area ? <p className="s5-quiz-point-context">{copy.credited}</p> : null}
                        <p>
                          {awardedArea === area
                            ? question.point
                            : alreadyCreditedPoint(question.point, locale)}
                        </p>
                      </>
                    ) : (
                      <p>{incorrect ? copy.wrong : copy.skipped}</p>
                    )
                  ) : null}
                </div>
                {!essential.readOnly ? (
                  <button
                    ref={advanceButton}
                    type="button"
                    className="s5-quiz-advance"
                    disabled={!mutable || !presented || !!pendingCommand.current}
                    onClick={() => void advance(!resolved)}
                  >
                    {resolved ? copy.next : copy.pass}
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <p className="s5-quiz-result" role="status">
                  {essential.readOnly && !roundRead.ledger
                    ? legacyOnly ? copy.legacyOutcome(roundRead.legacyQuiz.correctAnswers.length) : copy.noRound
                    : copy.outcome(roundRead.score)}
                </p>
                <p>{prizeEligible ? copy.prize : historicalWin ? copy.readonlyPrize : essential.readOnly && legacyOnly ? copy.legacyNoPrize : copy.noPrize}</p>
                {roundRead.complete && !roundRead.eligible && roundRead.roundNumber === 4 ? <p>{copy.exhausted}</p> : null}
                {!essential.readOnly ? (
                  <div className="s5-quiz-result-actions">
                  {roundRead.canRetry ? (
                    <button
                      type="button"
                      className="s5-quiz-retry-round"
                      disabled={!mutable || !presented || !!pendingCommand.current}
                      onClick={() => beginRetry()}
                    >
                      {copy.retryRound}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="s5-quiz-advance gvo-journey-exit"
                    disabled={!mutable || !presented || !roundRead.complete}
                    onClick={() => void close()}
                  >
                    {copy.close}
                  </button>
                  </div>
                ) : null}
              </>
            )}
            {assetError ? <p role="alert">{copy.assets}</p> : null}
            {storageIssue || saveError ? (
              <div className="s5-quiz-error" role="alert">
                <p>{storageIssue ? copy.recovery : copy.error}</p>
                <button
                  type="button"
                  disabled={!activity.active || busy || essential.readOnly}
                  onClick={() => void retry()}
                >
                  {copy.retry}
                </button>
                {roundRead.status === "corrupt" && !essential.readOnly ? (
                  <>
                    {confirmReset ? (
                      <>
                        <button
                          type="button"
                          disabled={!activity.active}
                          onClick={resetLocal}
                        >
                          {copy.confirmReset}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                        >
                          {copy.cancel}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={!activity.active}
                        onClick={() => setConfirmReset(true)}
                      >
                        {copy.reset}
                      </button>
                    )}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </main>
  );
}
