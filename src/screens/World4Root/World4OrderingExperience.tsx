import { playJourneySound } from "../../app/audio/journeySound";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { getJourneyRuntimeContext } from "../../app/journey/journeyEssential";
import {
  WORLD4_ORDERING_TARGET,
  freshWorld4OrderingState,
  readWorld4OrderingCheckpoint,
  removeWorld4OrderingCheckpoint,
  restoreWorld4OrderingState,
  writeWorld4OrderingCheckpoint,
  type World4OrderingOutcome,
  type World4OrderingState,
} from "../../domain/checkpoints/world4OrderingCheckpoint";
import {
  reduceWorld4Ordering,
  type World4OrderingAction,
} from "./world4OrderingGame";
import {
  getWorld4OrderingNodes,
  world4OrderingCopy,
  world4OrderingObjectAssets,
  type World4OrderingLocale,
} from "./world4OrderingContent";
import { World4LiaGuide } from "./World4LiaGuide";
import { world4RuntimeAssets } from "./world4RuntimeAssets";
import "./World4OrderingGame.css";

export type World4OrderingGameProps = {
  attemptId: string | null;
  active: boolean;
  readOnly: boolean;
  locale: World4OrderingLocale;
  reducedMotion: boolean;
  resourcesReady: boolean;
  closureVerified: boolean;
  /** Root binds these to the single OBS03 essential facade; local state never grants a QR. */
  onPresented: (
    stage: "introduction" | "objects" | "review" | "success",
    index?: number,
    outcome?: World4OrderingOutcome | null,
  ) => Promise<boolean>;
  onAdvance: (
    stage: "introduction" | "review",
    index?: number,
  ) => Promise<boolean>;
  onClosed: (outcome: World4OrderingOutcome) => Promise<boolean>;
  exit: ReactNode;
  explanationAction?: ReactNode;
};

function restore() {
  const saved = readWorld4OrderingCheckpoint();
  return {
    state:
      saved.status === "ok"
        ? restoreWorld4OrderingState(saved.checkpoint)
        : freshWorld4OrderingState(),
    recovery:
      saved.status === "ok" || saved.status === "empty" ? null : saved.status,
  };
}
function isCurrentAttempt(id: string | null) {
  const context = getJourneyRuntimeContext();
  return Boolean(
    id &&
    context.active &&
    context.attemptId === id &&
    context.screen === 4 &&
    context.mode === "normal",
  );
}

export function World4OrderingGame({
  attemptId,
  active,
  readOnly,
  locale,
  reducedMotion,
  resourcesReady,
  closureVerified,
  onPresented,
  onAdvance,
  onClosed,
  exit,
  explanationAction,
}: World4OrderingGameProps) {
  const [initial] = useState(restore);
  const [state, setState] = useState(initial.state);
  const stateRef = useRef(state);
  const [pending, setPending] = useState<World4OrderingState | null>(null);
  const [recovery, setRecovery] = useState(initial.recovery);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [presented, setPresented] = useState(false);
  const [semanticError, setSemanticError] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [assetError, setAssetError] = useState(false);
  const [viewRemaining, setViewRemaining] = useState(state.remainingActiveMs);
  const [visible, setVisible] = useState(() => !document.hidden);
  const lastClock = useRef<number | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const playColumnRef = useRef<HTMLDivElement>(null);
  const focusFirstAfterStart = useRef<string | null>(null);
  const previousRects = useRef(new Map<string, DOMRect>());
  const pieceAnimations = useRef<Animation[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const callbacks = useRef({ onPresented, onAdvance, onClosed });
  callbacks.current = { onPresented, onAdvance, onClosed };
  const copy = world4OrderingCopy[locale];
  const howToSwapId = useId();
  const timeNoticeId = useId();
  const nodes = getWorld4OrderingNodes(locale);
  const mutable =
    active &&
    visible &&
    !readOnly &&
    resourcesReady &&
    !assetError &&
    !pending &&
    !recovery &&
    !busy;

  const timedPhase = !readOnly && ["playing", "paused"].includes(state.phase);
  useLayoutEffect(() => {
    if (!active || !visible || !timedPhase) return;
    const controls = controlsRef.current;
    const column = playColumnRef.current;
    if (!controls || !column) return;
    const measure = () =>
      column.style.setProperty(
        "--s4-controls-height",
        `${controls.getBoundingClientRect().height}px`,
      );
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(controls);
    return () => observer.disconnect();
  }, [active, visible, timedPhase, locale]);
  useEffect(() => {
    if (
      focusFirstAfterStart.current !== attemptId ||
      state.phase !== "playing" ||
      !mutable ||
      !isCurrentAttempt(attemptId)
    )
      return;
    focusFirstAfterStart.current = null;
    const first = buttonRefs.current.find(
      (button) => button && !button.disabled,
    );
    first?.focus({ preventScroll: true });
    first?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [state.phase, mutable, attemptId]);

  useLayoutEffect(() => {
    pieceAnimations.current.forEach((animation) => animation.cancel());
    pieceAnimations.current = [];
    const nextRects = new Map<string, DOMRect>();
    state.permutation.forEach((id, index) => {
      const button = buttonRefs.current[index];
      if (!button) return;
      const next = button.getBoundingClientRect();
      nextRects.set(id, next);
      const previous = previousRects.current.get(id);
      if (
        !active ||
        !visible ||
        reducedMotion ||
        !previous ||
        typeof button.animate !== "function"
      )
        return;
      const dx = previous.left - next.left;
      const dy = previous.top - next.top;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      pieceAnimations.current.push(
        button.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.85 },
            { transform: "translate(0, 0)", opacity: 1 },
          ],
          {
            duration: state.phase === "auto_ordering" ? 700 : 250,
            easing: "cubic-bezier(.22,.61,.36,1)",
          },
        ),
      );
    });
    previousRects.current = nextRects;
    return () =>
      pieceAnimations.current.forEach((animation) => animation.cancel());
  }, [active, visible, reducedMotion, state.permutation, state.phase]);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    setBusy(false);
    setPresented(false);
  }, [attemptId]);
  useEffect(() => {
    if (!active || !visible) {
      setBusy(false);
      setPresented(false);
    }
  }, [active, visible]);

  const save = useCallback(
    (next: World4OrderingState) => {
      if (
        !activeRef.current ||
        readOnlyRef.current ||
        !isCurrentAttempt(attemptId)
      )
        return false;
      const result = writeWorld4OrderingCheckpoint(next);
      if (!result.ok) {
        lastClock.current = null;
        setPending(next);
        return false;
      }
      const previous = stateRef.current;
      stateRef.current = next;
      setState(next);
      setViewRemaining(next.remainingActiveMs);
      setPending(null);
      if (previous.phase === "introduction" && next.phase === "playing") playJourneySound("gameStart");
      else if (previous.phase === "playing" && next.outcome === "solved_by_visitor") playJourneySound("gameSolved");
      else if (previous.phase === "playing" && next.outcome === "assisted_timeout") playJourneySound("gameTimeout");
      else if (previous.phase === "playing" && next.phase === "playing" && next.permutation !== previous.permutation) playJourneySound("gameSwap");
      return true;
    },
    [attemptId],
  );
  const send = useCallback(
    (action: World4OrderingAction) => {
      if (
        !activeRef.current ||
        readOnlyRef.current ||
        !isCurrentAttempt(attemptId)
      )
        return false;
      const now = performance.now();
      const elapsed =
        lastClock.current === null ? 0 : Math.max(0, now - lastClock.current);
      lastClock.current = null;
      const next = reduceWorld4Ordering(stateRef.current, action, elapsed);
      const saved = save(next);
      if (saved && next.phase === "playing")
        lastClock.current = performance.now();
      return saved;
    },
    [save, attemptId],
  );

  useEffect(
    () => () => {
      // A real route exit checkpoints the last active fraction, without recreating
      // a record removed by reset or overwriting a newer/external checkpoint.
      const current = stateRef.current;
      if (
        !activeRef.current ||
        !isCurrentAttempt(attemptId) ||
        readOnlyRef.current ||
        current.phase !== "playing" ||
        lastClock.current === null
      )
        return;
      const stored = readWorld4OrderingCheckpoint();
      if (
        stored.status !== "ok" ||
        JSON.stringify(stored.checkpoint) !== JSON.stringify(current)
      )
        return;
      const elapsed = Math.max(0, performance.now() - lastClock.current);
      writeWorld4OrderingCheckpoint(
        reduceWorld4Ordering(current, { type: "pause" }, elapsed),
      );
      lastClock.current = null;
    },
    [attemptId],
  );

  useEffect(() => {
    if (
      !active ||
      !visible ||
      readOnly ||
      pending ||
      recovery ||
      busy ||
      state.phase !== "playing"
    ) {
      lastClock.current = null;
      return;
    }
    lastClock.current = performance.now();
    const timer = window.setInterval(() => send({ type: "tick" }), 1000);
    const pause = () => {
      if (document.hidden) send({ type: "pause" });
    };
    const pagehide = () => send({ type: "pause" });
    document.addEventListener("visibilitychange", pause);
    window.addEventListener("pagehide", pagehide);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", pause);
      window.removeEventListener("pagehide", pagehide);
    };
  }, [active, visible, readOnly, pending, recovery, busy, state.phase, send]);

  useEffect(() => {
    if (active || stateRef.current.phase !== "playing") return;
    // Preparation/deactivation performs no semantic write. A stored playing
    // segment is restored paused on reload, never charged wall-clock time.
    const paused = {
      ...stateRef.current,
      phase: "paused" as const,
      selectedObjectId: null,
    };
    lastClock.current = null;
    stateRef.current = paused;
    setState(paused);
  }, [active]);

  useEffect(() => {
    if (
      !active ||
      !visible ||
      readOnly ||
      pending ||
      recovery ||
      state.phase !== "auto_ordering"
    )
      return;
    const timer = window.setTimeout(
      () => send({ type: "settle_auto" }),
      reducedMotion ? 0 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [
    active,
    visible,
    readOnly,
    pending,
    recovery,
    state.phase,
    reducedMotion,
    send,
  ]);

  const stage =
    state.phase === "review"
      ? "review"
      : state.phase === "success"
        ? "success"
        : "introduction";
  useEffect(() => {
    setPresented(false);
    if (
      !active ||
      !visible ||
      readOnly ||
      !resourcesReady ||
      assetError ||
      recovery ||
      pending ||
      !["introduction", "review", "success"].includes(state.phase)
    )
      return;
    let cancelled = false;
    void callbacks.current
      .onPresented(
        stage,
        stage === "review" ? state.reviewIndex : undefined,
        state.outcome,
      )
      .then((ok) => {
        if (!cancelled && activeRef.current && isCurrentAttempt(attemptId)) {
          setPresented(ok);
          setSemanticError(!ok);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    active,
    attemptId,
    visible,
    readOnly,
    resourcesReady,
    assetError,
    recovery,
    pending,
    stage,
    state.phase,
    state.reviewIndex,
    state.outcome,
  ]);

  useEffect(() => {
    if (active && visible && ["review", "success"].includes(state.phase))
      headingRef.current?.focus();
  }, [active, visible, state.phase, state.reviewIndex]);

  async function start() {
    if (!mutable || !presented) return;
    const trigger = startButtonRef.current;
    const startedWithFocus =
      trigger !== null && document.activeElement === trigger;
    const transaction = callbacks.current;
    setBusy(true);
    const confirmed = await transaction.onAdvance("introduction");
    if (!isCurrentAttempt(attemptId)) return;
    const objects = confirmed && (await transaction.onPresented("objects"));
    if (!isCurrentAttempt(attemptId)) return;
    if (activeRef.current && objects) {
      // A real browser blurs Comenzar as soon as busy disables it. Preserve its
      // original focus intent, unless another usable control has since claimed focus.
      const currentFocus = document.activeElement;
      focusFirstAfterStart.current =
        startedWithFocus &&
        (currentFocus === document.body || currentFocus === trigger)
          ? attemptId
          : null;
      if (!send({ type: "start" })) focusFirstAfterStart.current = null;
    }
    setSemanticError(!objects);
    setBusy(false);
  }
  async function advanceReview() {
    if (!mutable || (!presented && !state.closed)) return;
    const transaction = callbacks.current;
    setBusy(true);
    if (state.phase === "review" && state.reviewIndex < 7) {
      if (await transaction.onAdvance("review", state.reviewIndex)) {
        playJourneySound("interaction", { replace: true });
        send({ type: "next_review" });
      }
    } else if (state.outcome) {
      // Verified local closure is retained if the root acknowledgement fails;
      // retrying cannot turn an assisted result into a visitor success.
      const next = reduceWorld4Ordering(stateRef.current, { type: "close" });
      if (save(next)) {
        const closed = await transaction.onClosed(next.outcome!);
        if (!isCurrentAttempt(attemptId)) return;
        if (closed) playJourneySound("roomComplete");
        setSemanticError(!closed);
        if (!closed) setAnnouncement(copy.saveError);
      }
    }
    setBusy(false);
  }
  function choose(index: number) {
    if (!active || !visible || !resourcesReady) return;
    if (readOnly || state.phase === "introduction") {
      setPreviewIndex(index);
      return;
    }
    if (!mutable || state.phase !== "playing") return;
    const selected = state.selectedObjectId;
    const id = state.permutation[index];
    if (send({ type: "select", id }))
      setAnnouncement(
        selected && selected !== id
          ? copy.swapped
          : `${nodes.find((node) => node.id === id)!.title}${selected === id ? "" : ` · ${copy.selected}`}`,
      );
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!active || !visible) return;
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -2,
      ArrowDown: 2,
    };
    if (event.key === "Escape") {
      event.preventDefault();
      if (mutable) send({ type: "cancel" });
      return;
    }
    if (!(event.key in moves)) return;
    event.preventDefault();
    const target =
      buttonRefs.current[Math.max(0, Math.min(7, index + moves[event.key]))];
    target?.focus({ preventScroll: true });
    target?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }
  const shownIndex = state.phase === "review" ? state.reviewIndex
    : readOnly || state.phase === "introduction" ? previewIndex
    : null;
  const description =
    shownIndex === null
      ? null
      : nodes.find((node) => node.id === state.permutation[shownIndex])!;
  const liaIndex =
    state.phase === "review"
      ? state.reviewIndex
      : state.selectedObjectId
        ? state.permutation.indexOf(state.selectedObjectId)
        : (previewIndex ?? 0);
  const showSolvedBoard = !readOnly && !pending && !recovery &&
    state.outcome === "solved_by_visitor" &&
    (state.phase === "success" || (state.closed && closureVerified));
  const guidance = readOnly
    ? copy.readonly
    : state.phase === "introduction"
      ? copy.ready
      : state.phase === "paused"
        ? copy.paused
        : state.phase === "auto_ordering"
          ? copy.assisting
          : state.phase === "review"
            ? copy.assisted
            : state.selectedObjectId ? copy.awaitingSwap : copy.playing;
  return (
    <main
      className="s4-ordering"
      aria-labelledby="s4-ordering-title"
      data-station4-ordering-phase={state.phase}
      data-station4-ordering-solved={showSolvedBoard ? "true" : undefined}
      data-station4-outcome={state.outcome ?? "none"}
      data-station4-ordering-closed={state.closed}
      data-journey-active={active}
    >
      <header>
        <h1 id="s4-ordering-title" tabIndex={-1}>{copy.title}</h1>
      </header>
      <div className="s4-ordering-layout">
        <div className="s4-ordering-play-column" ref={playColumnRef}>
          {!readOnly &&
          ["introduction", "playing", "paused"].includes(state.phase) ? (
            <div
              className={`s4-ordering-preparation${timedPhase ? " s4-ordering-preparation--sticky" : ""}`}
              ref={controlsRef}
            >
              {state.phase === "introduction" && !readOnly ? (
                <>
                  <p data-editorial-source-id="TXT_4_70469f939a19">{copy.invitation}</p>
                  <p>{copy.introduction}</p>
                  <p id={timeNoticeId}>{copy.ready}</p>
                  <div className="s4-ordering-how-to" id={howToSwapId}>
                    <h2>{copy.swapHeading}</h2>
                    <div className="s4-ordering-swap-example" aria-hidden="true">
                      <span data-example-piece="a" /><span data-example-piece="b" />
                      <span className="s4-ordering-swap-arrow">→</span>
                      <span data-example-piece="b" /><span data-example-piece="a" />
                    </div>
                    <ol>
                      {copy.swapSteps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>
                  <button
                    ref={startButtonRef}
                    type="button"
                    aria-describedby={`${howToSwapId} ${timeNoticeId}`}
                    disabled={!mutable || !presented}
                    onClick={() => void start()}
                  >
                    {copy.start}
                  </button>
                </>
              ) : null}
              {!readOnly && ["playing", "paused"].includes(state.phase) ? (
                <div className="s4-ordering-clock">
                  <span aria-label={copy.timer}>
                    {Math.ceil(viewRemaining / 1000)} s
                  </span>
                  <button
                    type="button"
                    disabled={!mutable}
                    onClick={() =>
                      send({
                        type: state.phase === "paused" ? "resume" : "pause",
                      })
                    }
                  >
                    {state.phase === "paused" ? copy.resume : copy.pause}
                  </button>
                </div>
              ) : null}
              {!readOnly &&
              ["playing", "paused"].includes(state.phase) ? (
                <button
                  type="button"
                  className="s4-ordering-text-action"
                  disabled={!mutable}
                  onClick={() => send({ type: "help" })}
                >
                  {copy.help}
                </button>
              ) : null}
            </div>
          ) : null}
          {timedPhase ? (
            <p className="s4-ordering-play-guidance">{guidance}</p>
          ) : null}
          <section
            className="s4-ordering-stage"
            aria-label={
              locale === "es"
                ? "Mesa de ocho posiciones"
                : "Eight-position table"
            }
          >
            <img
              className="s4-ordering-table"
              src={world4RuntimeAssets.environment.portraitTable}
              alt=""
            />
            <ol className="s4-ordering-grid">
              {state.permutation.map((id, index) => {
                const node = nodes.find((node) => node.id === id)!;
                return (
                  <li key={index} data-ordering-position={index + 1}>
                    <span className="s4-ordering-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      ref={(element) => {
                        buttonRefs.current[index] = element;
                      }}
                      data-ordering-object={id}
                      aria-label={`${copy.position} ${index + 1}: ${node.title}`}
                      aria-pressed={state.selectedObjectId === id}
                      disabled={
                        !active ||
                        !visible ||
                        !resourcesReady ||
                        (!readOnly && !!pending) ||
                        (!readOnly && !!recovery) ||
                        busy ||
                        (!readOnly &&
                          [
                            "paused",
                            "auto_ordering",
                            "review",
                            "success",
                            "closed",
                          ].includes(state.phase))
                      }
                      onClick={() => choose(index)}
                      onKeyDown={(event) => keyDown(event, index)}
                      className={
                        shownIndex === index ? "is-presented" : undefined
                      }
                    >
                      <img
                        src={world4OrderingObjectAssets[id]}
                        alt=""
                        draggable="false"
                        data-runtime-asset={world4OrderingObjectAssets[id]}
                        onError={() => setAssetError(true)}
                      />
                      <span>{node.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <World4LiaGuide
              articulated
              active={active && visible}
              nodeId={WORLD4_ORDERING_TARGET[liaIndex]}
              reducedMotion={reducedMotion}
              portrait
              mode={
                state.closed || state.phase === "success" ? "closure" : "guide"
              }
              motionKey={`${state.phase}-${liaIndex}`}
            />
          </section>
        </div>
        <article
          className={`s4-ordering-panel${!readOnly && ["introduction", "playing", "paused"].includes(state.phase) && !description && !pending && !recovery && !semanticError && resourcesReady && !assetError && !announcement && !closureVerified ? " s4-ordering-panel--idle" : ""}`}
          aria-busy={busy}
        >
          {readOnly || state.phase === "auto_ordering" || state.phase === "review" ? (
            <p>{guidance}</p>
          ) : null}
          {!resourcesReady || assetError ? (
            <p role="status">
              {assetError ? copy.assetsError : copy.assetsPending}
            </p>
          ) : null}
          {description ? (
            <div className="s4-ordering-description">
              <p>
                {state.phase === "review"
                  ? `${copy.reviewCount} ${state.reviewIndex + 1}/8`
                  : ""}
              </p>
              <h2 ref={headingRef} tabIndex={-1}>
                {description.title}
              </h2>
              <p>{description.text}</p>
            </div>
          ) : null}
          {!readOnly && (state.phase === "success" || state.closed) ? (
            <div className="s4-ordering-description">
              <h2 ref={headingRef} tabIndex={-1}>
                {state.closed ? copy.complete : copy.solved}
              </h2>
              <p data-editorial-source-id="TXT_4_282340ba7f44">{copy.conclusion}</p>
            </div>
          ) : null}
          {!readOnly &&
          (state.phase === "review" || state.phase === "success") ? (
            <>
              <button
                type="button"
                disabled={!mutable || !presented}
                onClick={() => void advanceReview()}
              >
                {state.phase === "review" && state.reviewIndex < 7
                  ? copy.next
                  : copy.close}
              </button>
              {state.phase === "success" ? (
                <button
                  type="button"
                  className="s4-ordering-text-action"
                  disabled={!mutable}
                  onClick={() => send({ type: "review" })}
                >
                  {copy.review}
                </button>
              ) : null}
            </>
          ) : null}
          {pending ? (
            <div role="alert">
              <p>{copy.saveError}</p>
              <button
                type="button"
                disabled={!active || readOnly}
                onClick={() => save(pending)}
              >
                {copy.retry}
              </button>
            </div>
          ) : null}
          {semanticError && !state.closed ? (
            <div role="alert">
              <p>{copy.saveError}</p>
              <button
                type="button"
                disabled={!active || readOnly || busy}
                onClick={async () => {
                  setBusy(true);
                  const ok = await callbacks.current.onPresented(
                    stage,
                    stage === "review" ? state.reviewIndex : undefined,
                    state.outcome,
                  );
                  if (!isCurrentAttempt(attemptId)) return;
                  setPresented(ok);
                  setSemanticError(!ok);
                  setBusy(false);
                }}
              >
                {copy.retry}
              </button>
            </div>
          ) : null}
          {state.closed && !readOnly && !closureVerified ? (
            <button
              type="button"
              disabled={!mutable}
              onClick={() => void advanceReview()}
            >
              {semanticError ? copy.retry : copy.close}
            </button>
          ) : null}
          {recovery ? (
            <div role="alert">
              <p>{copy.recoverError}</p>
              <button
                type="button"
                disabled={!active || readOnly}
                onClick={() => {
                  const restored = restore();
                  if (!restored.recovery) {
                    stateRef.current = restored.state;
                    setState(restored.state);
                    setViewRemaining(restored.state.remainingActiveMs);
                  }
                  setRecovery(restored.recovery);
                }}
              >
                {locale === "es" ? "Reintentar" : "Retry"}
              </button>
              {recovery !== "storage_unavailable" ? (
                <button
                  type="button"
                  disabled={!active || readOnly}
                  onClick={() => {
                    if (!confirmReset) {
                      setConfirmReset(true);
                      return;
                    }
                    if (removeWorld4OrderingCheckpoint().ok) {
                      const fresh = freshWorld4OrderingState();
                      stateRef.current = fresh;
                      setState(fresh);
                      setRecovery(null);
                      setConfirmReset(false);
                    }
                  }}
                >
                  {confirmReset ? copy.confirmReset : copy.reset}
                </button>
              ) : null}
            </div>
          ) : null}
          <p className="s4-ordering-status" role="status" aria-live="polite">
            {state.outcome && announcement === copy.swapped ? "" : announcement}
          </p>
          {explanationAction}
          {closureVerified ? exit : null}
        </article>
      </div>
    </main>
  );
}
