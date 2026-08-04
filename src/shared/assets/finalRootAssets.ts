const finalRootRuntimeBase = "/assets/gvo/stations/final-root";

export const finalRootAssets = {
  environment: {
    portrait: `${finalRootRuntimeBase}/environment/final_environment_portrait_v01.webp`,
    landscape: `${finalRootRuntimeBase}/environment/final_environment_landscape_v01.webp`,
    valleyDepthPortrait: `${finalRootRuntimeBase}/environment/final_valley_depth_portrait_v01.webp`,
    valleyDepthLandscape: `${finalRootRuntimeBase}/environment/final_valley_depth_landscape_v01.webp`,
    miradorForegroundPortrait: `${finalRootRuntimeBase}/environment/final_mirador_foreground_portrait_v01.webp`,
    miradorForegroundLandscape: `${finalRootRuntimeBase}/environment/final_mirador_foreground_landscape_v01.webp`,
  },
  access: {
    world1Root: `${finalRootRuntimeBase}/access/final_access_world1_root_v01.webp`,
    world2Pulse: `${finalRootRuntimeBase}/access/final_access_world2_pulse_v01.webp`,
    world3Notebook: `${finalRootRuntimeBase}/access/final_access_world3_notebook_v01.webp`,
    world4System: `${finalRootRuntimeBase}/access/final_access_world4_system_v01.webp`,
    world5Map: `${finalRootRuntimeBase}/access/final_access_world5_map_v01.webp`,
    labelBackplate: `${finalRootRuntimeBase}/access/final_access_label_backplate_v01.png`,
  },
  ui: {
    titleBackplate: `${finalRootRuntimeBase}/ui/final_title_backplate_v01.png`,
    creditsBackplate: `${finalRootRuntimeBase}/ui/final_credits_backplate_v01.png`,
    actionBackplate: `${finalRootRuntimeBase}/ui/final_action_backplate_v01.png`,
    restartDialogBackplate: `${finalRootRuntimeBase}/ui/final_restart_dialog_backplate_v01.png`,
  },
  lia: {
    idleContemplative6f: `${finalRootRuntimeBase}/lia/final_lia_idle_contemplative_6f_v01.webp`,
    greeting4f: `${finalRootRuntimeBase}/lia/final_lia_greeting_4f_v01.webp`,
    glowShadow: `${finalRootRuntimeBase}/lia/final_lia_glow_shadow_v01.png`,
  },
} as const;

export const finalRootAssetCategories = [
  "environment",
  "access",
  "ui",
  "lia",
] as const;

export const finalRootAssetPaths = [
  ...Object.values(finalRootAssets.environment),
  ...Object.values(finalRootAssets.access),
  ...Object.values(finalRootAssets.ui),
  ...Object.values(finalRootAssets.lia),
] as const;

export type FinalRootAssetCategory = (typeof finalRootAssetCategories)[number];
export type FinalRootAssetPath = (typeof finalRootAssetPaths)[number];
