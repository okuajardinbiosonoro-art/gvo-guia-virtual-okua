import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import styles from "../TransitionWorld.module.css";
import type { TransitionWorldPalette } from "../transitionWorld.types";

type TransitionBackgroundProps = {
  palette: TransitionWorldPalette;
};

export function TransitionBackground({ palette }: TransitionBackgroundProps) {
  const backgroundAsset =
    transitionRootAssetUrlsById.transition_root_background;
  const style = {
    "--transition-bg": palette.background,
    "--transition-mist": palette.mist,
  } as CSSProperties;

  return (
    <div
      className={styles.background}
      data-testid="transition-world-background"
      aria-hidden="true"
      style={style}
    >
      <picture
        className={styles.backgroundImage}
        data-testid="transition-world-background-real"
      >
        <source srcSet={backgroundAsset.urls.webp} type="image/webp" />
        <img
          src={backgroundAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <span className={styles.backgroundGrid} />
      <span className={styles.backgroundMistOne} />
      <span className={styles.backgroundMistTwo} />
      <span className={styles.backgroundPixelOne} />
      <span className={styles.backgroundPixelTwo} />
      <span className={styles.backgroundPixelThree} />
    </div>
  );
}
