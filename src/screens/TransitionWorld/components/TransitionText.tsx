import styles from "../TransitionWorld.module.css";

type TransitionTextProps = {
  title: string;
  subtitle: string;
};

export function TransitionText({ title, subtitle }: TransitionTextProps) {
  return (
    <div className={styles.copy}>
      <h1 id="transition-world-title" className={styles.title}>
        {title}
      </h1>
      <p id="transition-world-subtitle" className={styles.subtitle}>
        {subtitle}
      </p>
    </div>
  );
}
