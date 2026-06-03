import type { CSSProperties } from "react";

import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import styles from "../TransitionWorld.module.css";

export function TransitionLiaSprite() {
  const idleAsset = transitionRootAssetUrlsById.lia_transition_root_idle_4f;
  const guideAsset = transitionRootAssetUrlsById.lia_transition_root_guide_2f;
  const exitAsset = transitionRootAssetUrlsById.lia_transition_root_exit_1f;
  const idleStyle = {
    backgroundImage: `url(${idleAsset.urls.webp})`,
  } as CSSProperties;
  const guideStyle = {
    backgroundImage: `url(${guideAsset.urls.webp})`,
  } as CSSProperties;
  const exitStyle = {
    backgroundImage: `url(${exitAsset.urls.webp})`,
  } as CSSProperties;

  return (
    <div
      className={styles.liaSprite}
      data-testid="transition-world-lia-sprite"
      data-motion-layer="lia"
      data-lia-motion="idle-guide-exit"
      data-lia-placement="left-of-portal"
      data-lia-sprite-mode="cropped-background"
      role="img"
      aria-label="Lía en versión pixelart aprobada para transición."
      data-asset-id={idleAsset.id}
    >
      <span
        className={`${styles.liaFrameViewport} ${styles.liaIdleLayer}`}
        data-testid="transition-world-lia-real"
        data-asset-id={idleAsset.id}
        data-frame-count="4"
        data-frame-size="256x256"
        aria-hidden="true"
        style={idleStyle}
      />
      <span
        className={`${styles.liaFrameViewport} ${styles.liaGuideLayer}`}
        data-testid="transition-world-lia-guide"
        data-asset-id={guideAsset.id}
        data-frame-count="2"
        data-frame-size="256x256"
        aria-hidden="true"
        style={guideStyle}
      />
      <span
        className={`${styles.liaFrameViewport} ${styles.liaExitLayer}`}
        data-testid="transition-world-lia-exit"
        data-asset-id={exitAsset.id}
        data-frame-count="1"
        data-frame-size="256x256"
        aria-hidden="true"
        style={exitStyle}
      />
    </div>
  );
}
