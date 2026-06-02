import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
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
  const portalAssets = {
    inactive: transitionRootAssetUrlsById.portal_root_inactive,
    activating: transitionRootAssetUrlsById.portal_root_activating,
    open: transitionRootAssetUrlsById.portal_root_open,
  } as const;
  const portalAsset = portalAssets[state];
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
      <picture
        className={styles.portalPicture}
        data-testid="transition-world-portal-real"
        data-asset-id={portalAsset.id}
        aria-hidden="true"
      >
        <source srcSet={portalAsset.urls.webp} type="image/webp" />
        <img
          src={portalAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
    </div>
  );
}
