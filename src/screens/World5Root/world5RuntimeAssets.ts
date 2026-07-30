const world5RuntimeBase = "/assets/gvo/stations/world-5/present-map/runtime";

export const world5RuntimeAssets = {
  mapEnvironmentPortrait: `${world5RuntimeBase}/world5_map_environment_portrait_v01.webp`,
  mapEnvironmentLandscape: `${world5RuntimeBase}/world5_map_environment_landscape_v01.webp`,
  mapRimPortrait: `${world5RuntimeBase}/world5_map_rim_portrait_v01.webp`,
  mapRimLandscape: `${world5RuntimeBase}/world5_map_rim_landscape_v01.webp`,
  mapSectorPlants: `${world5RuntimeBase}/world5_map_sector_plants_v01.webp`,
  mapSectorSystem: `${world5RuntimeBase}/world5_map_sector_system_v01.webp`,
  mapSectorSpace: `${world5RuntimeBase}/world5_map_sector_space_v01.webp`,
  mapSectorVisitor: `${world5RuntimeBase}/world5_map_sector_visitor_v01.webp`,
  plantsEnvironmentPortrait: `${world5RuntimeBase}/world5_sub_plants_environment_portrait_v01.webp`,
  plantsEnvironmentLandscape: `${world5RuntimeBase}/world5_sub_plants_environment_landscape_v01.webp`,
  plantsFocus: `${world5RuntimeBase}/world5_sub_plants_focus_v01.webp`,
  systemEnvironmentPortrait: `${world5RuntimeBase}/system/world5_sub_system_environment_portrait_v01.webp`,
  systemEnvironmentLandscape: `${world5RuntimeBase}/system/world5_sub_system_environment_landscape_v01.webp`,
  systemFocus: `${world5RuntimeBase}/system/world5_sub_system_focus_v01.webp`,
  spaceEnvironmentPortrait: `${world5RuntimeBase}/world5_sub_space_environment_portrait_v01.webp`,
  spaceEnvironmentLandscape: `${world5RuntimeBase}/world5_sub_space_environment_landscape_v01.webp`,
  spaceFocus: `${world5RuntimeBase}/world5_sub_space_focus_v01.webp`,
  liaExplainCalm: `${world5RuntimeBase}/lia/lia_pose_explain_calm_v1.png`,
  liaGreeting: `${world5RuntimeBase}/lia/lia_pose_greeting_v1.png`,
  liaLeadForward: `${world5RuntimeBase}/lia/lia_world5_lead_forward_v01.webp`,
  liaAttendNeutral: `${world5RuntimeBase}/lia/lia_world5_attend_neutral_v01.webp`,
} as const;

export const world5MapCriticalAssetSources = [
  world5RuntimeAssets.mapEnvironmentPortrait,
  world5RuntimeAssets.mapEnvironmentLandscape,
  world5RuntimeAssets.mapRimPortrait,
  world5RuntimeAssets.mapRimLandscape,
  world5RuntimeAssets.mapSectorPlants,
  world5RuntimeAssets.mapSectorSystem,
  world5RuntimeAssets.mapSectorSpace,
  world5RuntimeAssets.mapSectorVisitor,
] as const;

export const world5PlantsAssetSources = [
  world5RuntimeAssets.plantsEnvironmentPortrait,
  world5RuntimeAssets.plantsEnvironmentLandscape,
  world5RuntimeAssets.plantsFocus,
] as const;

export const world5SystemAssetSources = [
  world5RuntimeAssets.systemEnvironmentPortrait,
  world5RuntimeAssets.systemEnvironmentLandscape,
  world5RuntimeAssets.systemFocus,
] as const;

export const world5SpaceAssetSources = [
  world5RuntimeAssets.spaceEnvironmentPortrait,
  world5RuntimeAssets.spaceEnvironmentLandscape,
  world5RuntimeAssets.spaceFocus,
] as const;

export const world5LiaAssetSources = [
  world5RuntimeAssets.liaExplainCalm,
  world5RuntimeAssets.liaGreeting,
  world5RuntimeAssets.liaLeadForward,
  world5RuntimeAssets.liaAttendNeutral,
] as const;
