import type { CSSProperties } from "react";

import styles from "../TransitionWorld.module.css";
import type { TransitionWorldPalette } from "../transitionWorld.types";

type TransitionBackgroundProps = {
  palette: TransitionWorldPalette;
};

export function TransitionBackground({ palette }: TransitionBackgroundProps) {
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
      <span className={styles.backgroundGrid} />
      <span className={styles.backgroundMistOne} />
      <span className={styles.backgroundMistTwo} />
      <span className={styles.backgroundPixelOne} />
      <span className={styles.backgroundPixelTwo} />
      <span className={styles.backgroundPixelThree} />
    </div>
  );
}
