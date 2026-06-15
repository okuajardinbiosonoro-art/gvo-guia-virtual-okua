import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import { GvoProgressBar, GvoProgressFrame } from "../../../components/progress";
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
      ariaValueNow={72}
      ariaValueText="Preparando recorrido"
      style={style}
      dataProgressPreview="motion"
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
