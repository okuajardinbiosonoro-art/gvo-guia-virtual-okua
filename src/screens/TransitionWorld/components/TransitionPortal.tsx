import type { CSSProperties } from "react";

import styles from "../TransitionWorld.module.css";
import type {
  TransitionPortalState,
  TransitionWorldPalette,
} from "../transitionWorld.types";

type TransitionPortalProps = {
  label: string;
  palette: TransitionWorldPalette;
  state: TransitionPortalState;
};

export function TransitionPortal({ label, palette, state }: TransitionPortalProps) {
  const style = {
    "--transition-portal-core": palette.portalCore,
    "--transition-portal-edge": palette.portalEdge,
    "--transition-portal-glow": palette.portalGlow,
  } as CSSProperties;

  return (
    <div
      className={styles.portal}
      data-testid="transition-world-portal"
      data-portal-state={state}
      role="img"
      aria-label={label}
      style={style}
    >
      <span className={styles.portalGlow} aria-hidden="true" />
      <svg
        className={styles.portalSvg}
        viewBox="0 0 180 260"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path
          className={styles.portalAura}
          d="M90 4 134 20 166 64 170 132 144 212 92 252 38 224 12 154 16 70 48 24Z"
        />
        <path
          className={styles.portalGoldFrame}
          d="M90 14 128 30 154 68 158 132 134 198 90 232 46 206 24 148 28 78 52 34Z"
        />
        <path
          className={styles.portalLavenderFrame}
          d="M90 30 119 42 140 76 144 132 123 186 90 211 56 190 40 144 44 86 62 48Z"
        />
        <path
          className={styles.portalCore}
          d="M90 48 112 58 128 86 132 132 116 174 90 194 64 178 50 140 54 94 68 64Z"
        />
        <rect
          className={styles.portalHighlightOne}
          x="76"
          y="66"
          width="10"
          height="10"
        />
        <rect
          className={styles.portalHighlightTwo}
          x="104"
          y="82"
          width="8"
          height="8"
        />
        <g className={styles.portalRootMark}>
          <rect x="86" y="126" width="8" height="52" />
          <rect
            x="66"
            y="162"
            width="8"
            height="34"
            transform="rotate(45 70 162)"
          />
          <rect
            x="106"
            y="162"
            width="8"
            height="34"
            transform="rotate(-45 110 162)"
          />
          <rect
            x="76"
            y="144"
            width="8"
            height="24"
            transform="rotate(45 80 144)"
          />
          <rect
            x="96"
            y="144"
            width="8"
            height="24"
            transform="rotate(-45 100 144)"
          />
        </g>
      </svg>
    </div>
  );
}
