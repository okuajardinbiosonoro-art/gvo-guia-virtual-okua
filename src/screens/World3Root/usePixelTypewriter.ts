import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type PixelTypewriterOptions = {
  /** Milisegundos entre caracteres. */
  speedMs?: number;
  /** Pausa extra al terminar cada fragmento. */
  fragmentPauseMs?: number;
  /** true → texto completo inmediato (reduced motion / tests). */
  instant?: boolean;
  /** Reinicia la escritura cuando cambia el mensaje. */
  startKey?: string | number;
  /** Se invoca una sola vez cuando todo el texto queda visible. */
  onComplete?: () => void;
};

export type PixelTypewriterState = {
  /** Fragmentos visibles (recortados al avance actual). */
  rendered: string[];
  /** Índice del fragmento que se está escribiendo (-1 si terminó). */
  writingIndex: number;
  done: boolean;
  visibleChars: number;
  /** Completa todo el texto de inmediato (tap / "Mostrar todo"). */
  complete: () => void;
};

/**
 * Typewriter pixel silencioso: las letras aparecen progresivamente,
 * sin audio, sin lápiz, sin teclado, sin personaje escribiendo.
 */
export function usePixelTypewriter(
  fragments: readonly string[],
  {
    speedMs = 26,
    fragmentPauseMs = 320,
    instant = false,
    startKey = 0,
    onComplete,
  }: PixelTypewriterOptions = {},
): PixelTypewriterState {
  const totals = useMemo(() => {
    let sum = 0;
    return fragments.map((fragment) => {
      sum += fragment.length;
      return sum;
    });
  }, [fragments]);
  const totalChars = totals.length > 0 ? totals[totals.length - 1] : 0;
  const [visibleChars, setVisibleChars] = useState(instant ? totalChars : 0);
  const timeoutRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const completionNotifiedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const clearPending = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    completionNotifiedRef.current = false;
    if (instant) {
      setVisibleChars(totalChars);
      return;
    }

    setVisibleChars(0);
    let current = 0;

    const step = () => {
      current += 1;
      setVisibleChars(current);

      if (current >= totalChars) {
        timeoutRef.current = null;
        return;
      }

      const finishedFragment = totals.includes(current);
      timeoutRef.current = window.setTimeout(
        step,
        finishedFragment ? fragmentPauseMs : speedMs,
      );
    };

    timeoutRef.current = window.setTimeout(step, speedMs);

    return clearPending;
  }, [clearPending, fragmentPauseMs, instant, speedMs, startKey, totalChars, totals]);

  useEffect(() => {
    if (
      visibleChars >= totalChars &&
      totalChars > 0 &&
      !completionNotifiedRef.current
    ) {
      completionNotifiedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [totalChars, visibleChars]);

  const complete = useCallback(() => {
    clearPending();
    setVisibleChars(totalChars);
  }, [clearPending, totalChars]);

  let consumed = 0;
  let writingIndex = -1;
  const rendered = fragments.map((fragment, index) => {
    const start = consumed;
    consumed += fragment.length;
    const visibleInFragment = Math.min(
      Math.max(visibleChars - start, 0),
      fragment.length,
    );
    if (
      writingIndex === -1 &&
      visibleInFragment > 0 &&
      visibleInFragment < fragment.length
    ) {
      writingIndex = index;
    }
    return fragment.slice(0, visibleInFragment);
  });

  return {
    rendered,
    writingIndex,
    done: visibleChars >= totalChars,
    visibleChars,
    complete,
  };
}
