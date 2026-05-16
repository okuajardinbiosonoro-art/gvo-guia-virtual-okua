import type { LoadingInitialRuntimeAsset } from "./LoadingInitial.types";

const loadingRuntimeBase = "/assets/runtime/loading-initial";

export const loadingInitialAssets = {
  lia: {
    assetId: "lia_loading_16f",
    src: `${loadingRuntimeBase}/lia/lia_loading_16f.png`,
    metadata: `${loadingRuntimeBase}/lia/lia_loading_16f.json`,
  },
  plant: {
    assetId: "plant_growth_4f",
    src: `${loadingRuntimeBase}/plant/plant_growth_4f.png`,
    metadata: `${loadingRuntimeBase}/plant/plant_growth_4f.json`,
  },
  water: {
    assetId: "water_flow_5f",
    src: `${loadingRuntimeBase}/water/water_flow_5f.png`,
    metadata: `${loadingRuntimeBase}/water/water_flow_5f.json`,
  },
  sparkles: [
    {
      assetId: "sparkle_01_lilac_small",
      src: `${loadingRuntimeBase}/sparkles/sparkle_01_lilac_small.png`,
    },
    {
      assetId: "sparkle_02_amber_small",
      src: `${loadingRuntimeBase}/sparkles/sparkle_02_amber_small.png`,
    },
    {
      assetId: "sparkle_03_lilac_medium",
      src: `${loadingRuntimeBase}/sparkles/sparkle_03_lilac_medium.png`,
    },
    {
      assetId: "sparkle_04_micro_white",
      src: `${loadingRuntimeBase}/sparkles/sparkle_04_micro_white.png`,
    },
  ] satisfies LoadingInitialRuntimeAsset[],
  ground: {
    assetId: "ground_halo_01_orbital_ring",
    src: `${loadingRuntimeBase}/ground/ground_halo_01_orbital_ring.png`,
  },
} as const;
