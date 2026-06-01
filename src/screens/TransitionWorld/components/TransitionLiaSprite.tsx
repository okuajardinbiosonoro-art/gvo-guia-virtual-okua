import styles from "../TransitionWorld.module.css";

export function TransitionLiaSprite() {
  return (
    <div
      className={styles.liaFallback}
      data-testid="transition-world-lia-fallback"
      role="img"
      aria-label="Lía en versión pixelart temporal para transición."
    >
      <svg
        className={styles.liaSvg}
        viewBox="0 0 72 86"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path
          className={styles.liaPetalSoft}
          d="M34 2 45 14 42 34 30 34 27 14Z"
        />
        <path
          className={styles.liaPetalLavender}
          d="M10 22 28 16 36 30 26 44 8 38Z"
        />
        <path
          className={styles.liaPetalSoft}
          d="M62 22 44 16 36 30 46 44 64 38Z"
        />
        <path
          className={styles.liaPetalSoft}
          d="M14 48 31 38 39 52 29 68 10 62Z"
        />
        <path
          className={styles.liaPetalLavender}
          d="M58 48 41 38 33 52 43 68 62 62Z"
        />
        <path
          className={styles.liaHead}
          d="M28 28 44 28 54 40 50 56 36 64 22 56 18 40Z"
        />
        <rect className={styles.liaEyes} x="28" y="43" width="5" height="3" />
        <rect className={styles.liaEyes} x="39" y="43" width="5" height="3" />
        <rect className={styles.liaCollar} x="31" y="58" width="10" height="10" />
        <path className={styles.liaBulb} d="M28 66 44 66 48 78 36 84 24 78Z" />
      </svg>
    </div>
  );
}
