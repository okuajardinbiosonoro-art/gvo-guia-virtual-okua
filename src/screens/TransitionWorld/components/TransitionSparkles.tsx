import type { CSSProperties } from "react";

import styles from "../TransitionWorld.module.css";

const transitionWorldSparkleSlots = [
  {
    id: "upper-left-air",
    x: "15%",
    y: "18%",
    size: "7px",
    delay: "180ms",
    duration: "3200ms",
    tone: "lilac",
  },
  {
    id: "upper-right-air",
    x: "86%",
    y: "19%",
    size: "8px",
    delay: "760ms",
    duration: "3400ms",
    tone: "amber",
  },
  {
    id: "far-left-mist",
    x: "9%",
    y: "34%",
    size: "6px",
    delay: "1120ms",
    duration: "2800ms",
    tone: "pearl",
  },
  {
    id: "far-right-mist",
    x: "91%",
    y: "37%",
    size: "7px",
    delay: "520ms",
    duration: "3000ms",
    tone: "lilac",
  },
  {
    id: "left-lower-air",
    x: "13%",
    y: "58%",
    size: "6px",
    delay: "1560ms",
    duration: "3600ms",
    tone: "amber",
  },
  {
    id: "right-lower-air",
    x: "88%",
    y: "61%",
    size: "8px",
    delay: "940ms",
    duration: "3100ms",
    tone: "pearl",
  },
  {
    id: "bottom-left-edge",
    x: "22%",
    y: "80%",
    size: "5px",
    delay: "2100ms",
    duration: "3300ms",
    tone: "lilac",
  },
  {
    id: "bottom-right-edge",
    x: "78%",
    y: "81%",
    size: "5px",
    delay: "1340ms",
    duration: "2900ms",
    tone: "amber",
  },
] as const;

export function TransitionSparkles() {
  return (
    <div
      className={styles.transitionSparkles}
      data-testid="transition-world-sparkles"
      data-sparkle-reference="loading-initial-deterministic-slots"
      data-sparkle-layer="ambient-background"
      data-sparkle-count={transitionWorldSparkleSlots.length}
      aria-hidden="true"
    >
      {transitionWorldSparkleSlots.map((slot) => {
        const style = {
          "--transition-sparkle-x": slot.x,
          "--transition-sparkle-y": slot.y,
          "--transition-sparkle-size": slot.size,
          "--transition-sparkle-delay": slot.delay,
          "--transition-sparkle-duration": slot.duration,
        } as CSSProperties;

        return (
          <span
            key={slot.id}
            className={styles.transitionSparkle}
            data-testid="transition-world-sparkle"
            data-transition-sparkle-slot={slot.id}
            data-transition-sparkle-tone={slot.tone}
            style={style}
          />
        );
      })}
    </div>
  );
}
