const world5RuntimeBase =
  "/assets/gvo/stations/world-5/present-map/runtime";

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
