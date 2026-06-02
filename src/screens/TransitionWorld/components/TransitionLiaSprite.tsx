import { transitionRootAssetUrlsById } from "../../../assets/transition-world/root/transition-root-assets";
import styles from "../TransitionWorld.module.css";

export function TransitionLiaSprite() {
  const liaAsset = transitionRootAssetUrlsById.lia_transition_root_master;

  return (
    <div
      className={styles.liaSprite}
      data-testid="transition-world-lia-sprite"
      role="img"
      aria-label="Lía en versión pixelart aprobada para transición."
      data-asset-id={liaAsset.id}
    >
      <picture
        className={styles.liaPicture}
        data-testid="transition-world-lia-real"
        data-asset-id={liaAsset.id}
        aria-hidden="true"
      >
        <source srcSet={liaAsset.urls.webp} type="image/webp" />
        <img
          src={liaAsset.urls.png}
          alt=""
          draggable={false}
          decoding="async"
        />
      </picture>
    </div>
  );
}
