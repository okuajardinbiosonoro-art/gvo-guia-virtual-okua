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
        viewBox="0 0 180 284"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path
          className={styles.portalAura}
          d="M90 4 124 14 150 44 162 92 162 218 138 260 90 280 42 260 18 218 18 92 30 44 56 14Z"
        />
        <path
          className={styles.portalGoldFrame}
          d="M90 18 120 28 142 56 152 98 152 210 130 244 90 262 50 244 28 210 28 98 38 56 60 28Z"
        />
        <path
          className={styles.portalLavenderFrame}
          d="M90 38 114 48 132 74 140 108 140 202 120 230 90 244 60 230 40 202 40 108 48 74 66 48Z"
        />
        <path
          className={styles.portalCore}
          d="M90 58 108 66 122 88 128 116 128 192 112 214 90 226 68 214 52 192 52 116 58 88 72 66Z"
        />
        <rect
          className={styles.portalHighlightOne}
          x="76"
          y="82"
          width="10"
          height="10"
        />
        <rect
          className={styles.portalHighlightTwo}
          x="104"
          y="102"
          width="8"
          height="8"
        />
        <g className={styles.portalRootMark}>
          <rect x="86" y="142" width="8" height="58" />
          <rect
            x="66"
            y="184"
            width="8"
            height="34"
            transform="rotate(45 70 162)"
          />
          <rect
            x="106"
            y="184"
            width="8"
            height="34"
            transform="rotate(-45 110 162)"
          />
          <rect
            x="76"
            y="164"
            width="8"
            height="24"
            transform="rotate(45 80 144)"
          />
          <rect
            x="96"
            y="164"
            width="8"
            height="24"
            transform="rotate(-45 100 144)"
          />
        </g>
      </svg>
    </div>
  );
}
