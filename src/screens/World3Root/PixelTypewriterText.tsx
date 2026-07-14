import { usePixelTypewriter } from "./usePixelTypewriter";

type PixelTypewriterTextProps = {
  fragments: readonly string[];
  /** true → texto completo inmediato (reduced motion). */
  instant?: boolean;
  /** Identificador del bloque para data-attributes. */
  blockId: string;
  speedMs?: number;
  startKey?: string | number;
  onComplete?: () => void;
  allowManualComplete?: boolean;
  showCompleteControl?: boolean;
};

/**
 * Bloque de apuntes con revelado letra a letra, completamente silencioso.
 * El texto íntegro está disponible para lectores de pantalla desde el inicio;
 * la animación es solo visual. Tap sobre el texto o "Mostrar todo" completa.
 */
export function PixelTypewriterText({
  fragments,
  instant = false,
  blockId,
  speedMs,
  startKey,
  onComplete,
  allowManualComplete = true,
  showCompleteControl = true,
}: PixelTypewriterTextProps) {
  const typewriter = usePixelTypewriter(fragments, {
    instant,
    speedMs,
    startKey,
    onComplete,
  });

  return (
    <div
      className="s3-typewriter"
      data-station3-typewriter={blockId}
      data-typewriter-done={typewriter.done}
      data-typewriter-instant={instant}
      data-typewriter-visible-chars={typewriter.visibleChars}
    >
      <p className="s3-sr-only">{fragments.join(" ")}</p>
      <div
        className="s3-typewriter__fragments"
        aria-hidden="true"
        onClick={allowManualComplete ? typewriter.complete : undefined}
      >
        {typewriter.rendered.map((text, index) => (
          <p
            className="s3-typewriter__fragment"
            data-fragment-writing={typewriter.writingIndex === index}
            key={`${blockId}-fragment-${index}`}
          >
            {text}
            {typewriter.writingIndex === index ? (
              <span className="s3-typewriter__caret" />
            ) : null}
          </p>
        ))}
      </div>
      {showCompleteControl && !typewriter.done ? (
        <button
          className="s3-typewriter__skip"
          type="button"
          onClick={typewriter.complete}
          data-station3-action="show-all-text"
        >
          Mostrar todo
        </button>
      ) : null}
    </div>
  );
}
