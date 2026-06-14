import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import { GvoProgressBar } from "../../../components/progress";
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
      <span
        className={styles.progressTrackFrame}
        data-testid="transition-world-progress-real"
        aria-hidden="true"
      >
        <span className={styles.progressFillClip}>
          <picture
            className={styles.progressFillPicture}
            data-testid="transition-world-progress-fill"
            data-asset-id={fillAsset.id}
          >
            <source srcSet={fillAsset.urls.webp} type="image/webp" />
            <img
              src={fillAsset.urls.png}
              alt=""
              draggable={false}
              decoding="async"
            />
          </picture>
        </span>
        <picture
          className={styles.progressTrackPicture}
          data-testid="transition-world-progress-track"
          data-asset-id={trackAsset.id}
        >
          <source srcSet={trackAsset.urls.webp} type="image/webp" />
          <img
            src={trackAsset.urls.png}
            alt=""
            draggable={false}
            decoding="async"
          />
        </picture>
        <picture
          className={styles.progressSparkPicture}
          data-testid="transition-world-progress-spark"
          data-asset-id={sparkAsset.id}
        >
          <source srcSet={sparkAsset.urls.webp} type="image/webp" />
          <img
            src={sparkAsset.urls.png}
            alt=""
            draggable={false}
            decoding="async"
          />
        </picture>
      </span>
    </GvoProgressBar>
  );
}
