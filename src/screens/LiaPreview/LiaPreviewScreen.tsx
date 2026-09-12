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
export function LiaPreviewScreen() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [targetLabel, setTargetLabel] = useState("");
  const [targetReply, setTargetReply] = useState<LiaReply | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    input.current?.focus({ preventScroll: true });
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
    input.current?.focus({ preventScroll: true });
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
        input.current?.focus({ preventScroll: true });
      }
    }
  }
  const last = turns.at(-1);
  const experienceState = sourcesOpen
    ? "showing_sources"
    : loading
      ? "thinking"
      : message
        ? "listening"
        : last?.unavailable
          ? "unavailable"
          : last?.reply?.state === "abstain"
            ? "uncertain"
            : last?.reply?.state === "refused"
              ? "safe_refusal"
              : turns.length
                ? "explaining"
                : "greeting";
  const presenceLabel = sourcesOpen
    ? copy.showingSources
    : loading
      ? copy.loading
      : message
        ? copy.listening
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
            <span
              className="lia-preview__avatar"
              aria-hidden="true"
              style={{
                backgroundImage: `url("${turns.length ? liaPreviewAssets.avatar : liaPreviewAssets.greeting}")`,
                backgroundSize: `${turns.length ? 600 : 400}% 100%`,
              }}
            />
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
                              setSourcesOpen(event.currentTarget.open)
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
