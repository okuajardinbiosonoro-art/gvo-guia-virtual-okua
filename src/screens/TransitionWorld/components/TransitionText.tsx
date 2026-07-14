import styles from "../TransitionWorld.module.css";

type TransitionTextProps = {
  editorialCopyStatus?: "final" | "temporary";
  subtitleSlotId?: string;
  title: string;
  titleSlotId?: string;
  subtitle: string;
};

export function TransitionText({
  editorialCopyStatus,
  subtitle,
  subtitleSlotId,
  title,
  titleSlotId,
}: TransitionTextProps) {
  return (
    <div
      className={styles.copy}
      data-editorial-copy={
        titleSlotId || subtitleSlotId ? editorialCopyStatus : undefined
      }
      data-subtitle-slot={subtitleSlotId}
      data-title-slot={titleSlotId}
    >
      <h1 id="transition-world-title" className={styles.title}>
        {title}
      </h1>
      <p id="transition-world-subtitle" className={styles.subtitle}>
        {subtitle}
      </p>
    </div>
  );
}
