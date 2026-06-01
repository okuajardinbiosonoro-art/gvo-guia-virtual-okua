import styles from "../TransitionWorld.module.css";

export function TransitionFade() {
  return (
    <div
      className={styles.fade}
      data-testid="transition-world-fade"
      aria-hidden="true"
    />
  );
}
