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
      <span className={styles.portalFrame} aria-hidden="true">
        <span className={styles.portalInner} />
        <span className={styles.portalRoot}>
          <span />
          <span />
          <span />
        </span>
      </span>
    </div>
  );
}
