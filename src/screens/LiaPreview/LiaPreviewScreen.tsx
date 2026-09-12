import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import { finalEntryRoute } from "../../app/routes";
import { liaPreviewCopy as copy } from "../../content/liaPreviewCopy";
import { askLia, type LiaReply } from "../../features/lia-preview/client";
import {
  markLiaReturn,
  MAX_MESSAGE_CHARS,
  MAX_TURNS,
} from "../../features/lia-preview/config";
import { liaPreviewAssets } from "../../shared/assets/liaPreviewAssets";
import {
  presenceFor,
  type PresenceState,
} from "../../features/lia-preview/presence";
import "./LiaPreviewScreen.css";

const TargetReview =
  import.meta.env.DEV && import.meta.env.VITE_LIA_TARGET_SIMULATION === "true"
    ? lazy(() => import("../../features/lia-preview/TargetReview"))
    : null;

type Turn = {
  id: number;
  question: string;
  reply?: LiaReply;
  unavailable?: boolean;
  target?: boolean;
};
function PresenceArtwork({ state }: { state: PresenceState }) {
  const requested = presenceFor(state);
  const [visible, setVisible] = useState(requested);
  useEffect(() => {
    // Warm only the approved local image resources; no visitor data is retained.
    for (const next of ["greeting", "listening", "explaining"] as const) {
      const preload = new Image();
      preload.src = presenceFor(next).url;
      void preload.decode?.().catch(() => undefined);
    }
  }, []);
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.src = requested.url;
    if (image.decode) {
      // Keep the previous complete pose until the next one can be painted whole.
      void image
        .decode()
        .then(() => {
          if (active) setVisible(requested);
        })
        .catch(() => undefined);
    } else setVisible(requested);
    return () => {
      active = false;
    };
  }, [requested]);
  return (
    <span
      key={visible.id}
      className="lia-preview__avatar"
      aria-hidden="true"
      data-asset-id={visible.id}
      style={{
        backgroundImage: `url("${visible.url}")`,
        backgroundSize: `${visible.frames * 100}% 100%`,
      }}
    />
  );
}
export function LiaPreviewScreen() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  const [targetReply, setTargetReply] = useState<LiaReply | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [inputEngaged, setInputEngaged] = useState(false);
  const restoringFocus = useRef(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  function restoreInputFocus() {
    restoringFocus.current = true;
    input.current?.focus({ preventScroll: true });
    restoringFocus.current = false;
  }
  useEffect(() => {
    restoreInputFocus();
    return () => {
      generation.current++;
      request.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (turns.length || loading)
      end.current?.scrollIntoView?.({ block: "nearest", behavior: "instant" });
  }, [turns, loading]);
  function clear() {
    generation.current++;
    request.current?.abort();
    request.current = null;
    setTurns([]);
    setSourcesOpen(false);
    setMessage("");
    setLoading(false);
    setNotice(copy.cleared);
    setInputEngaged(false);
    restoreInputFocus();
  }
  function back() {
    request.current?.abort();
    setNotice(copy.farewell);
    markLiaReturn();
    navigate(finalEntryRoute);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      request.current ||
      !message.trim() ||
      [...message].length > MAX_MESSAGE_CHARS
    )
      return;
    const id = ++generation.current;
    const question = message.trim();
    setInputEngaged(false);
    if (targetReply && TargetReview) {
      setTurns((old) => [
        ...old.slice(-(MAX_TURNS - 1)),
        { id, question, reply: targetReply, target: true },
      ]);
      setMessage("");
      setNotice(copy[targetReply.state]);
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setTurns((old) => [...old.slice(-(MAX_TURNS - 1)), { id, question }]);
    setMessage("");
    setLoading(true);
    setNotice(copy.loading);
    try {
      const reply = await askLia(question, controller.signal);
      if (id !== generation.current) return;
      setTurns((old) => old.map((t) => (t.id === id ? { ...t, reply } : t)));
      setNotice(copy[reply.state]);
    } catch {
      if (id !== generation.current) return;
      setTurns((old) =>
        old.map((t) => (t.id === id ? { ...t, unavailable: true } : t)),
      );
      setNotice(copy.unavailable);
    } finally {
      if (id === generation.current) {
        request.current = null;
        setLoading(false);
        restoreInputFocus();
      }
    }
  }
  const last = turns.at(-1);
  const experienceState: PresenceState = loading
    ? "thinking"
    : message
      ? "user_typing"
      : inputEngaged
        ? "input_focus"
        : sourcesOpen
          ? "showing_sources"
          : last?.unavailable
            ? "unavailable"
            : last?.reply?.state === "abstain"
              ? "uncertain"
              : last?.reply?.state === "refused"
                ? "safe_refusal"
                : turns.length
                  ? "explaining"
                  : "greeting";
  const presenceLabel = loading
    ? copy.loading
    : message || inputEngaged
      ? copy.listening
      : sourcesOpen
        ? copy.showingSources
        : last?.unavailable
          ? copy.unavailable
          : last?.reply
            ? copy[last.reply.state]
            : copy.greeting;
  return (
    <main
      className="lia-preview"
      data-experience-state={experienceState}
      style={
        {
          "--lia-valley": `url("${liaPreviewAssets.valley}")`,
          "--lia-valley-portrait": `url("${liaPreviewAssets.valleyPortrait}")`,
        } as CSSProperties
      }
      data-lia-preview
      data-copy-status={copy.status}
      aria-labelledby="lia-title"
    >
      <div className="lia-preview__page">
        <nav className="lia-preview__navigation" aria-label={copy.title}>
          <button type="button" onClick={back}>
            {copy.back}
          </button>
          <span className="lia-preview__badge">{copy.badge}</span>
        </nav>
        <div className="lia-preview__layout">
          <header className="lia-preview__header">
            <div
              className="lia-preview__stage"
              data-presence-cue={experienceState}
            >
              <PresenceArtwork state={experienceState} />
            </div>
            <div>
              <span className="lia-preview__chapter">{copy.chapter}</span>
              <h1 id="lia-title">{copy.title}</h1>
              <p>{copy.presence}</p>
              <p className="lia-preview__presence-state">{presenceLabel}</p>
            </div>
          </header>
          <div className="lia-preview__journal">
            <div className="lia-preview__journal-top">{copy.reading}</div>
            <section
              className="lia-preview__conversation"
              aria-label={copy.title}
            >
              {!turns.length && (
                <div className="lia-preview__empty">
                  <h2>{copy.empty}</h2>
                  <p>{copy.scope}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMessage(copy.suggestion);
                      input.current?.focus({ preventScroll: true });
                    }}
                  >
                    {copy.suggestion}
                  </button>
                </div>
              )}
              <ol className="lia-preview__turns">
                {turns.map((turn) => (
                  <li key={turn.id}>
                    <div className="lia-preview__question">
                      <span>{copy.you}</span>
                      <p>{turn.question}</p>
                    </div>
                    {(turn.reply || turn.unavailable) && (
                      <div
                        className="lia-preview__answer"
                        data-lia-state={turn.reply?.state ?? "unavailable"}
                      >
                        <span>{copy.lia}</span>
                        {turn.target && (
                          <strong className="lia-preview__target-badge">
                            {targetLabel}
                          </strong>
                        )}
                        <p>{turn.reply?.answer ?? copy.unavailable}</p>
                        {!!turn.reply?.citations.length && (
                          <details
                            onToggle={(event) =>
                              setSourcesOpen(
                                !!event.currentTarget
                                  .closest("ol")
                                  ?.querySelector("details[open]"),
                              )
                            }
                          >
                            <summary>
                              {copy.sources} ({turn.reply.citations.length})
                            </summary>
                            <ul>
                              {turn.reply.citations.map((citation, index) => (
                                <li key={index}>
                                  <strong>{citation.label}</strong>
                                  <blockquote>{citation.excerpt}</blockquote>
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
              <p
                className="lia-preview__status"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                data-loading={loading}
              >
                {notice}
              </p>
              <div ref={end} />
            </section>
            <form className="lia-preview__composer" onSubmit={submit}>
              <label htmlFor="lia-question">{copy.prompt}</label>
              <textarea
                id="lia-question"
                ref={input}
                value={message}
                maxLength={MAX_MESSAGE_CHARS}
                rows={3}
                placeholder={copy.placeholder}
                aria-describedby="lia-limit"
                onFocus={() => {
                  if (!restoringFocus.current) setInputEngaged(true);
                }}
                onPointerDown={() => setInputEngaged(true)}
                onBlur={() => setInputEngaged(false)}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="lia-preview__composer-actions">
                <span id="lia-limit">
                  {[...message].length}/{MAX_MESSAGE_CHARS} {copy.counter}
                </span>
                <button type="submit" disabled={loading || !message.trim()}>
                  {copy.send}
                </button>
              </div>
              <div className="lia-preview__footer">
                <p>{copy.session}</p>
                <button type="button" onClick={clear}>
                  {copy.clear}
                </button>
              </div>
            </form>
          </div>
        </div>
        {TargetReview && (
          <Suspense fallback={null}>
            <TargetReview
              onChange={(reply, label) => {
                clear();
                setTargetReply(reply);
                setTargetLabel(label);
              }}
            />
          </Suspense>
        )}
      </div>
    </main>
  );
}
