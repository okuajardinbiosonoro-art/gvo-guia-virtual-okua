import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import styles from "../TransitionWorld.module.css";

export function TransitionLiaSprite() {
  const idleAsset = transitionRootAssetUrlsById.lia_transition_root_idle_4f;
  const guideAsset = transitionRootAssetUrlsById.lia_transition_root_guide_2f;
  const exitAsset = transitionRootAssetUrlsById.lia_transition_root_exit_1f;

  return (
    <div
      className={styles.liaSprite}
      data-testid="transition-world-lia-sprite"
      data-motion-layer="lia"
      data-lia-motion="idle-guide-exit"
      role="img"
      aria-label="Lía en versión pixelart aprobada para transición."
      data-asset-id={idleAsset.id}
    >
      <picture
        className={`${styles.liaPicture} ${styles.liaLayer} ${styles.liaIdleLayer}`}
        data-testid="transition-world-lia-real"
        data-asset-id={idleAsset.id}
        aria-hidden="true"
      >
        <source srcSet={idleAsset.urls.webp} type="image/webp" />
        <img
          src={idleAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <picture
        className={`${styles.liaPicture} ${styles.liaLayer} ${styles.liaGuideLayer}`}
        data-testid="transition-world-lia-guide"
        data-asset-id={guideAsset.id}
        aria-hidden="true"
      >
        <source srcSet={guideAsset.urls.webp} type="image/webp" />
        <img
          src={guideAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
      <picture
        className={`${styles.liaPicture} ${styles.liaLayer} ${styles.liaExitLayer}`}
        data-testid="transition-world-lia-exit"
        data-asset-id={exitAsset.id}
        aria-hidden="true"
      >
        <source srcSet={exitAsset.urls.webp} type="image/webp" />
        <img
          src={exitAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
    </div>
  );
}
