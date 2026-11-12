import { useEffect, useRef, useState, type CSSProperties } from "react";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { resolveEditorialText, type EditorialSlotId } from "../../content/editorial";
import { TransitionBackground } from "./components/TransitionBackground";
import { TransitionFade } from "./components/TransitionFade";
import { TransitionLiaSprite } from "./components/TransitionLiaSprite";
import { TransitionPortal } from "./components/TransitionPortal";
import { TransitionProgress } from "./components/TransitionProgress";
import { TransitionSparkles } from "./components/TransitionSparkles";
import { TransitionText } from "./components/TransitionText";
import styles from "./TransitionWorld.module.css";
import { introToStationOneTransition, TRANSITION_WORLD_VERSION } from "./transitionWorld.config";
import type { TransitionWorldProps } from "./transitionWorld.types";
import { capturePreparedImage, waitForPreparedImages, twoPreparedFrames } from "../../app/journey/preparedImages";

const englishDestinations: Record<string, string> = {
  "/estacion/1": "Room I · Root", "/estacion/2": "Room II · Invisible pulse",
  "/estacion/3": "Room III · Practice notebook", "/estacion/4": "Room IV · Biosonic system",
  "/estacion/5": "Room V · OKÚA, sensory art", "/final": "the Lookout",
};

export function TransitionWorld({
  config = introToStationOneTransition, variant = "preview", isReducedMotion: reducedOverride,
  onComplete, attemptId = null, preloadStatus = "loading", preloadProgress = 0,
  onRetry, onBack, canRetry = true, locale = readLanguagePreference() ?? "es",
  shellAssetsReady = true, deadlineAt, onVisualError,
}: TransitionWorldProps) {
  const completionRef = useRef(onComplete), errorRef = useRef(onVisualError), root = useRef<HTMLElement>(null);
  const statusRef = useRef(preloadStatus); statusRef.current = preloadStatus;
  completionRef.current = onComplete; errorRef.current = onVisualError;
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const [preferredReduced, setPreferredReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [started, setStarted] = useState(false), [complete, setComplete] = useState(false);
  const isReducedMotion = reducedOverride ?? preferredReduced;
  const durationMs = isReducedMotion ? config.reducedMotionDurationMs : config.durationMs;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = () => setVisible(document.visibilityState !== "hidden");
    const preference = () => setPreferredReduced(media.matches);
    document.addEventListener("visibilitychange", visibility); media.addEventListener("change", preference);
    return () => { document.removeEventListener("visibilitychange", visibility); media.removeEventListener("change", preference); };
  }, []);
  useEffect(() => {
    setStarted(false); setComplete(false);
    if (variant !== "runtime" || !shellAssetsReady) return;
    const controller = new AbortController(); let raf = 0, elapsed = 0, last: number | null = null, disposed = false;
    const bound = deadlineAt ?? performance.now() + 15000;
    const timer = window.setTimeout(() => { if (!disposed) { controller.abort(); errorRef.current?.(); } }, Math.max(0, bound - performance.now()));
    const live = () => !controller.signal.aborted && Boolean(root.current?.isConnected);
    void (async () => {
      try {
        if (!await twoPreparedFrames(controller.signal)) return;
        if (!live()) return;
        const images = Array.from(root.current!.querySelectorAll("img")).filter((img) => img.getBoundingClientRect().width > 0 && getComputedStyle(img).display !== "none").map(capturePreparedImage);
        if (!await waitForPreparedImages(images, { controller, deadlineAt: bound }, live)) { if (live()) errorRef.current?.(); return; }
        if (!await twoPreparedFrames(controller.signal)) return;
        if (!live()) return;
        clearTimeout(timer);
        setStarted(true);
        const frame = (now: number) => {
          if (!live()) return;
          if (document.visibilityState === "visible" && !/error|timeout|aborted/.test(statusRef.current)) {
            if (last !== null) elapsed += now - last;
            last = now;
            if (elapsed >= durationMs) { setComplete(true); completionRef.current?.(); return; }
          } else last = null;
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      } catch { if (live()) errorRef.current?.(); }
    })();
    return () => { disposed = true; clearTimeout(timer); controller.abort(); cancelAnimationFrame(raf); };
  }, [attemptId, config.id, durationMs, shellAssetsReady, variant]);

  function localized(slot: string | undefined, fallback: string, english: string) {
    if (!slot) return locale === "en" ? english : fallback;
    const resolved = resolveEditorialText(slot as EditorialSlotId, { locale });
    return locale === "en" && resolved.fallbackUsed ? english : resolved.text;
  }
  const destination = englishDestinations[config.toRoute] ?? config.toRoute;
  const title = localized(config.titleSlotId, config.title, `Opening ${destination}`);
  const subtitle = localized(config.subtitleSlotId, config.subtitle,
    config.toRoute === "/final" ? "Preparing the end of your journey." : "Preparing your journey");
  const failed = /error|timeout|aborted/.test(preloadStatus);
  const copy = locale === "en"
    ? { error: "The next view could not be prepared.", retry: "Retry", back: "Back", exhausted: "This attempt has ended. Go back to start again." }
    : { error: "No fue posible preparar la siguiente vista.", retry: "Reintentar", back: "Volver", exhausted: "Este intento terminó. Vuelve para comenzar de nuevo." };
  const style = { "--transition-text": config.palette.text, "--transition-text-soft": config.palette.textSoft } as CSSProperties;

  return (
    <main ref={root} className={styles.transitionWorld} lang={locale} style={style}
      data-transition-world-version={TRANSITION_WORLD_VERSION} data-transition-world-id={config.id}
      data-transition-world-variant={variant} data-transition-from-route={config.fromRoute}
      data-transition-to-route={config.toRoute} data-duration-ms={config.durationMs}
      data-reduced-motion-duration-ms={config.reducedMotionDurationMs} data-reduced-motion={isReducedMotion ? "true" : "false"}
      data-motion-mode="css-timeline" data-motion-state={failed ? "paused" : complete ? "holding" : variant === "runtime" ? started ? "runtime-sequence" : "waiting" : "preview-sequence"}
      data-presentation-paused={!visible} data-shell-assets-ready={shellAssetsReady}
      data-navigation-locked={failed ? "false" : "true"} data-critical-assets-ready={preloadStatus === "ready" ? "true" : "false"}
      data-critical-assets-status={preloadStatus} data-target-preload={config.targetPreload}
      data-target-assets-ready={preloadStatus === "ready" ? "true" : "false"}
      aria-labelledby="transition-world-title" aria-describedby="transition-world-subtitle">
      <TransitionBackground palette={config.palette} />
      <TransitionSparkles />
      <TransitionFade />
      <section className={styles.stage} aria-live="polite">
        <div className={styles.visualStack} data-motion-layer="visual-stack">
          <TransitionPortal label={locale === "en" ? `Portal to ${destination}` : config.portalLabel} palette={config.palette} state={config.portalState} />
          <TransitionLiaSprite />
        </div>
        <TransitionText editorialCopyStatus={config.editorialCopyStatus} title={title} titleSlotId={config.titleSlotId} subtitle={subtitle} subtitleSlotId={config.subtitleSlotId} />
        <TransitionProgress durationMs={durationMs} isReducedMotion={isReducedMotion} palette={config.palette} progress={preloadProgress} label={subtitle} />
        {failed ? <div className={styles.recovery} role="group" aria-label={copy.error}>
          <p role="status">{copy.error}</p>
          {onRetry && canRetry ? <button type="button" onClick={onRetry}>{copy.retry}</button> : null}
          {onBack ? <button type="button" onClick={onBack}>{copy.back}</button> : null}
          {!canRetry ? <p>{copy.exhausted}</p> : null}
        </div> : null}
      </section>
    </main>
  );
}
