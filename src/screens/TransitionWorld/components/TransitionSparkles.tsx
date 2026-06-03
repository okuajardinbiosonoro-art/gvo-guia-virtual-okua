import type { CSSProperties } from "react";

import { loadingInitialAssets } from "../../LoadingInitial/loadingInitialAssets";
import styles from "../TransitionWorld.module.css";

const transitionWorldSparkleSlots = [
  {
    id: "sparkle-lilac-upper-left",
    sourceSlot: "sparkle-lilac-upper-far-left",
    sourceClass: "loading-initial__sparkle--upper-far-left",
    assetIndex: 0,
    x: "14%",
    y: "18%",
    size: "18px",
    delayMs: 600,
    durationMs: 3200,
  },
  {
    id: "sparkle-amber-upper-right",
    sourceSlot: "sparkle-amber-upper-far-right",
    sourceClass: "loading-initial__sparkle--upper-far-right",
    assetIndex: 1,
    x: "86%",
    y: "19%",
    size: "18px",
    delayMs: 1100,
    durationMs: 3400,
  },
  {
    id: "sparkle-white-upper-air",
    sourceSlot: "sparkle-white-upper-center",
    sourceClass: "loading-initial__sparkle--upper-center",
    assetIndex: 3,
    x: "50%",
    y: "12%",
    size: "12px",
    delayMs: 1700,
    durationMs: 3000,
  },
  {
    id: "sparkle-white-middle-left",
    sourceSlot: "sparkle-white-middle-far-left",
    sourceClass: "loading-initial__sparkle--middle-far-left",
    assetIndex: 3,
    x: "8%",
    y: "40%",
    size: "12px",
    delayMs: 2300,
    durationMs: 2600,
  },
  {
    id: "sparkle-amber-middle-right",
    sourceSlot: "sparkle-amber-middle-far-right",
    sourceClass: "loading-initial__sparkle--middle-far-right",
    assetIndex: 1,
    x: "91%",
    y: "41%",
    size: "22px",
    delayMs: 2900,
    durationMs: 3400,
  },
  {
    id: "sparkle-lilac-lower-left",
    sourceSlot: "sparkle-lilac-lower-left",
    sourceClass: "loading-initial__sparkle--lower-left",
    assetIndex: 2,
    x: "12%",
    y: "64%",
    size: "18px",
    delayMs: 3500,
    durationMs: 3000,
  },
  {
    id: "sparkle-lilac-lower-right",
    sourceSlot: "sparkle-lilac-lower-right",
    sourceClass: "loading-initial__sparkle--lower-right",
    assetIndex: 0,
    x: "88%",
    y: "66%",
    size: "22px",
    delayMs: 4100,
    durationMs: 2800,
  },
  {
    id: "sparkle-lilac-bottom-right",
    sourceSlot: "sparkle-lilac-bottom-right",
    sourceClass: "loading-initial__sparkle--bottom-right",
    assetIndex: 2,
    x: "78%",
    y: "82%",
    size: "22px",
    delayMs: 5400,
    durationMs: 3200,
  },
] as const;

export function TransitionSparkles() {
  return (
    <div
      className={styles.transitionSparkles}
      data-testid="transition-world-sparkles"
      data-sparkle-reference="loading-initial-runtime-assets-and-css"
      data-sparkle-layer="ambient-background"
      data-sparkle-count={transitionWorldSparkleSlots.length}
      aria-hidden="true"
    >
      {transitionWorldSparkleSlots.map((slot) => {
        const sparkle = loadingInitialAssets.sparkles[slot.assetIndex];
        const style = {
          "--transition-sparkle-x": slot.x,
          "--transition-sparkle-y": slot.y,
          "--transition-sparkle-size": slot.size,
          "--transition-sparkle-delay": `${slot.delayMs}ms`,
          "--transition-sparkle-duration": `${slot.durationMs}ms`,
        } as CSSProperties;

        return (
          <img
            key={slot.id}
            className={styles.transitionSparkle}
            src={sparkle.src}
            alt=""
            draggable="false"
            data-testid="transition-world-sparkle"
            data-transition-sparkle-slot={slot.id}
            data-loading-sparkle-slot={slot.sourceSlot}
            data-loading-sparkle-class={slot.sourceClass}
            data-asset-id={sparkle.assetId}
            data-runtime-asset={sparkle.src}
            style={style}
          />
        );
      })}
    </div>
  );
}
