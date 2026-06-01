import type { CSSProperties } from "react";

import styles from "../TransitionWorld.module.css";
import type { TransitionWorldPalette } from "../transitionWorld.types";

type TransitionProgressProps = {
  durationMs: number;
  isReducedMotion: boolean;
  palette: TransitionWorldPalette;
};

export function TransitionProgress({
  durationMs,
  isReducedMotion,
  palette,
}: TransitionProgressProps) {
  const style = {
    "--transition-progress-duration": `${durationMs}ms`,
    "--transition-progress-track": palette.progressTrack,
    "--transition-progress-fill": palette.progressFill,
  } as CSSProperties;

  return (
    <div
      className={styles.progress}
      data-testid="transition-world-progress"
      data-reduced-motion={isReducedMotion ? "true" : "false"}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={72}
      aria-valuetext="Preparando recorrido"
      style={style}
    >
      <span className={styles.progressCap} aria-hidden="true" />
      <span className={styles.progressTrack} aria-hidden="true">
        <span className={styles.progressFill} />
        <span className={styles.progressMarker} />
      </span>
      <span className={styles.progressCap} aria-hidden="true" />
    </div>
  );
}
