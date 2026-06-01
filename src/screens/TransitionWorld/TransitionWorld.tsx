import type { CSSProperties } from "react";

import { TransitionBackground } from "./components/TransitionBackground";
import { TransitionFade } from "./components/TransitionFade";
import { TransitionLiaSprite } from "./components/TransitionLiaSprite";
import { TransitionPortal } from "./components/TransitionPortal";
import { TransitionProgress } from "./components/TransitionProgress";
import { TransitionText } from "./components/TransitionText";
import styles from "./TransitionWorld.module.css";
import {
  introToStationOneTransition,
  TRANSITION_WORLD_VERSION,
} from "./transitionWorld.config";
import type { TransitionWorldProps } from "./transitionWorld.types";

export function TransitionWorld({
  config = introToStationOneTransition,
  variant = "preview",
  isReducedMotion = false,
}: TransitionWorldProps) {
  const effectiveDurationMs = isReducedMotion
    ? config.reducedMotionDurationMs
    : config.durationMs;
  const accessibleStatus = `${config.title.replace("...", ".")} ${config.subtitle.replace("...", ".")}`;
  const style = {
    "--transition-text": config.palette.text,
    "--transition-text-soft": config.palette.textSoft,
  } as CSSProperties;

  return (
    <main
      className={styles.transitionWorld}
      data-transition-world-version={TRANSITION_WORLD_VERSION}
      data-transition-world-id={config.id}
      data-transition-world-variant={variant}
      data-transition-from-route={config.fromRoute}
      data-transition-to-route={config.toRoute}
      data-duration-ms={config.durationMs}
      data-reduced-motion-duration-ms={config.reducedMotionDurationMs}
      data-reduced-motion={isReducedMotion ? "true" : "false"}
      aria-labelledby="transition-world-title"
      aria-describedby="transition-world-subtitle"
      style={style}
    >
      <TransitionBackground palette={config.palette} />
      <TransitionFade />
      <section
        className={styles.stage}
        role="status"
        aria-live="polite"
        aria-label={accessibleStatus}
      >
        <div className={styles.visualStack} aria-hidden="false">
          <TransitionPortal
            label={config.portalLabel}
            palette={config.palette}
            state={config.portalState}
          />
          <TransitionLiaSprite />
        </div>
        <TransitionText title={config.title} subtitle={config.subtitle} />
        <TransitionProgress
          durationMs={effectiveDurationMs}
          isReducedMotion={isReducedMotion}
          palette={config.palette}
        />
      </section>
    </main>
  );
}
