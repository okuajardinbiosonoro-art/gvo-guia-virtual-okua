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
      data-motion-layer="portal"
      data-motion-sequence="inactive-activating-open"
      role="img"
      aria-label={label}
      style={style}
    >
      <span className={styles.portalGlow} aria-hidden="true" />
      <picture
        className={`${styles.portalPicture} ${styles.portalLayer} ${styles.portalLayerInactive}`}
        data-testid="transition-world-portal-inactive"
        data-asset-id={portalAssets.inactive.id}
        aria-hidden="true"
      >
        <source srcSet={portalAssets.inactive.urls.webp} type="image/webp" />
        <img
          src={portalAssets.inactive.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <picture
        className={`${styles.portalPicture} ${styles.portalLayer} ${styles.portalLayerActivating}`}
        data-testid="transition-world-portal-activating"
        data-asset-id={portalAssets.activating.id}
        aria-hidden="true"
      >
        <source srcSet={portalAssets.activating.urls.webp} type="image/webp" />
        <img
          src={portalAssets.activating.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <picture
        className={`${styles.portalPicture} ${styles.portalLayer} ${styles.portalLayerOpen}`}
        data-testid="transition-world-portal-real"
        data-asset-id={portalAssets.open.id}
        aria-hidden="true"
      >
        <source srcSet={portalAssets.open.urls.webp} type="image/webp" />
        <img
          src={portalAssets.open.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
    </div>
  );
}
