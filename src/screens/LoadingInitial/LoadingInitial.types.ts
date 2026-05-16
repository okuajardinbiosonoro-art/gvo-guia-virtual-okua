export type LoadingInitialPhase =
  | "loading_initial_enter"
  | "lia_entry_idle"
  | "lia_prepare_watering"
  | "lia_watering"
  | "plant_growth"
  | "loading_complete"
  | "transition_to_intro";

export interface LoadingInitialRuntimeAsset {
  assetId: string;
  src: string;
}

export interface LoadingInitialWaterStream {
  id: "waterStreamA" | "waterStreamB" | "waterStreamC";
  className: string;
  delayMs: number;
}

export interface LoadingInitialSparkleSlot {
  id: string;
  assetIndex: number;
  className: string;
  x: string;
  y: string;
  delayMs: number;
  durationMs: number;
}
