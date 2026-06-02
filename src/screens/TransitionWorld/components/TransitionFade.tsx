import styles from "../TransitionWorld.module.css";

export function TransitionFade() {
  return (
    <div
      className={styles.fade}
      data-testid="transition-world-fade"
      data-motion-layer="final-fade"
      data-motion-effect="portal-centered-flash"
      aria-hidden="true"
    />
  );
}
