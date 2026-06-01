import styles from "../TransitionWorld.module.css";

export function TransitionLiaSprite() {
  return (
    <div
      className={styles.liaFallback}
      data-testid="transition-world-lia-fallback"
      role="img"
      aria-label="Lía en versión pixelart temporal para transición."
    >
      <span className={styles.liaPetalTop} />
      <span className={styles.liaPetalLeft} />
      <span className={styles.liaPetalRight} />
      <span className={styles.liaBody} />
      <span className={styles.liaCollar} />
    </div>
  );
}
