import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import { GvoProgressBar, GvoProgressFrame } from "../../../components/progress";
import styles from "../TransitionWorld.module.css";
import type { TransitionWorldPalette } from "../transitionWorld.types";

type TransitionProgressProps = {
  durationMs: number;
  isReducedMotion: boolean;
  palette: TransitionWorldPalette;
  progress?: number;
  label?: string;
};

export function TransitionProgress({
  durationMs,
  isReducedMotion,
  palette,
  progress = 0,
  label = "Preparando tu recorrido",
}: TransitionProgressProps) {
  const trackAsset =
    transitionRootAssetUrlsById.transition_root_progress_track_base;
  const fillAsset =
    transitionRootAssetUrlsById.transition_root_progress_fill_segment;
  const sparkAsset = transitionRootAssetUrlsById.transition_root_progress_spark;
  const style = {
    "--gvo-progress-duration": `${durationMs}ms`,
    "--transition-progress-duration": `${durationMs}ms`,
    "--transition-progress-track": palette.progressTrack,
    "--transition-progress-fill": palette.progressFill,
    "--transition-real-fill": `${91.2 * Math.max(0, Math.min(1, progress))}%`,
    "--transition-real-spark": `${3.6 + 91.2 * Math.max(0, Math.min(1, progress))}%`,
  } as CSSProperties;

  return (
    <GvoProgressBar
      variant="transition-world"
      className={styles.progress}
      testId="transition-world-progress"
      dataMotionLayer="progress"
      dataProgressMotion="fill-and-spark"
      dataProgressSparkAlignment="channel-centered"
      isReducedMotion={isReducedMotion}
      ariaValueNow={Math.round(100 * Math.max(0, Math.min(1, progress)))}
      ariaValueText={label}
      style={style}
      dataProgressPreview="real"
    >
      <GvoProgressFrame
        fillAsset={fillAsset}
        sparkAsset={sparkAsset}
        testIdPrefix="transition-world-progress"
        trackAsset={trackAsset}
      />
    </GvoProgressBar>
  );
}
