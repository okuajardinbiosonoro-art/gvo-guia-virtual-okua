const finalAccessRuntimeBase = "/assets/gvo/stations/final-root/access";

export const entryCoverBackdropAsset =
  "/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png";

export const entryCoverStationAssets = [
  {
    id: "world-1-root",
    portalId: "portal-1",
    src: `${finalAccessRuntimeBase}/final_access_world1_root_v01.webp`,
  },
  {
    id: "world-2-pulse",
    portalId: "portal-2",
    src: `${finalAccessRuntimeBase}/final_access_world2_pulse_v01.webp`,
  },
  {
    id: "world-3-notebook",
    portalId: "portal-3",
    src: `${finalAccessRuntimeBase}/final_access_world3_notebook_v01.webp`,
  },
  {
    id: "world-4-system",
    portalId: "portal-4",
    src: `${finalAccessRuntimeBase}/final_access_world4_system_v01.webp`,
  },
  {
    id: "world-5-map",
    portalId: "portal-5",
    src: `${finalAccessRuntimeBase}/final_access_world5_map_v01.webp`,
  },
] as const;

export type EntryCoverStationAsset = (typeof entryCoverStationAssets)[number];
