import type {
  LoadingInitialSparkleSlot,
  LoadingInitialWaterStream,
} from "./LoadingInitial.types";

export const loadingInitialWaterStreams = [
  {
    id: "waterStreamA",
    className: "loading-initial__water-stream--a",
    delayMs: 0,
  },
  {
    id: "waterStreamB",
    className: "loading-initial__water-stream--b",
    delayMs: 180,
  },
  {
    id: "waterStreamC",
    className: "loading-initial__water-stream--c",
    delayMs: 340,
  },
] satisfies LoadingInitialWaterStream[];

export const loadingInitialSparkleSlots = [
  {
    id: "sparkle-lilac-upper-left",
    assetIndex: 0,
    className: "loading-initial__sparkle--upper-left",
    x: "22%",
    y: "35%",
    delayMs: 600,
    durationMs: 2800,
  },
  {
    id: "sparkle-amber-upper-right",
    assetIndex: 1,
    className: "loading-initial__sparkle--upper-right",
    x: "72%",
    y: "28%",
    delayMs: 1400,
    durationMs: 3200,
  },
  {
    id: "sparkle-lilac-middle-right",
    assetIndex: 2,
    className: "loading-initial__sparkle--middle-right",
    x: "66%",
    y: "48%",
    delayMs: 2100,
    durationMs: 3000,
  },
  {
    id: "sparkle-white-middle-left",
    assetIndex: 3,
    className: "loading-initial__sparkle--middle-left",
    x: "28%",
    y: "55%",
    delayMs: 2900,
    durationMs: 2600,
  },
  {
    id: "sparkle-amber-lower-right",
    assetIndex: 1,
    className: "loading-initial__sparkle--lower-right",
    x: "78%",
    y: "62%",
    delayMs: 3400,
    durationMs: 3400,
  },
  {
    id: "sparkle-lilac-lower-left",
    assetIndex: 0,
    className: "loading-initial__sparkle--lower-left",
    x: "18%",
    y: "66%",
    delayMs: 4100,
    durationMs: 2800,
  },
] satisfies LoadingInitialSparkleSlot[];
