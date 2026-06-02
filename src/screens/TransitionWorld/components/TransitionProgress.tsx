import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
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
      data-progress-preview="0.64"
    >
      <span
        className={styles.progressFrame}
        data-testid="transition-world-progress-real"
        aria-hidden="true"
      >
        <picture
          className={styles.progressTrackPicture}
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
        <span className={styles.progressFillClip}>
          <picture
            className={styles.progressFillPicture}
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
          className={styles.progressSparkPicture}
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
    </div>
  );
}
