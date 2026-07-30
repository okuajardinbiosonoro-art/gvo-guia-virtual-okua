import type { CSSProperties } from "react";

import type { Station5AreaId } from "./station5Content";

type SourcePoint = readonly [x: number, y: number];
type SourcePlacement = Readonly<{
  x: number;
  y: number;
  assetSize: number;
  clusterHeight: number;
  labelTop: number;
}>;

export const mapArtboards = {
  portrait: { width: 1440, height: 2560 },
  landscape: { width: 2560, height: 1440 },
} as const;

// Safe inner contours sampled from the transparent center of MAP-03 / MAP-04.
// They are documentary/runtime geometry, never a drawn runtime shape.
export const mapRecessMaskPortrait: readonly SourcePoint[] = [
  [360, 1105],
  [650, 1055],
  [900, 1090],
  [1115, 1190],
  [1210, 1390],
  [1200, 1620],
  [1240, 1890],
  [1130, 2115],
  [900, 2240],
  [650, 2200],
  [415, 2240],
  [220, 2090],
  [150, 1860],
  [165, 1580],
  [160, 1340],
  [245, 1175],
] as const;

export const mapRecessMaskLandscape: readonly SourcePoint[] = [
  [470, 195],
  [720, 155],
  [990, 205],
  [1260, 300],
  [1335, 520],
  [1390, 760],
  [1335, 1010],
  [1150, 1230],
  [850, 1300],
  [590, 1250],
  [330, 1130],
  [235, 900],
  [245, 650],
  [285, 390],
] as const;

export const mapSectorAlphaBboxes = {
  plantas: [336, 192, 1379, 1274],
  sistema: [369, 483, 1404, 1092],
  espacio: [189, 508, 1404, 1131],
  visitante: [264, 333, 1388, 1258],
} as const satisfies Record<Station5AreaId, readonly [number, number, number, number]>;

export const mapSectorPlacements = {
  portrait: {
    plantas: { x: 230, y: 1130, assetSize: 430, clusterHeight: 510, labelTop: 386 },
    sistema: { x: 750, y: 1130, assetSize: 430, clusterHeight: 510, labelTop: 336 },
    espacio: { x: 230, y: 1650, assetSize: 430, clusterHeight: 510, labelTop: 347 },
    visitante: { x: 750, y: 1650, assetSize: 430, clusterHeight: 510, labelTop: 382 },
  },
  landscape: {
    plantas: { x: 300, y: 250, assetSize: 400, clusterHeight: 460, labelTop: 362 },
    sistema: { x: 870, y: 250, assetSize: 400, clusterHeight: 460, labelTop: 314 },
    espacio: { x: 260, y: 760, assetSize: 400, clusterHeight: 460, labelTop: 326 },
    visitante: { x: 870, y: 760, assetSize: 400, clusterHeight: 460, labelTop: 358 },
  },
} as const satisfies Record<"portrait" | "landscape", Record<Station5AreaId, SourcePlacement>>;

export const plantsSourceGeometry = {
  focusCanvas: { width: 1536, height: 1536 },
  P_PLANT_BASE: [772, 1280] as const,
  P_MAIN_LEAF_TARGET: [768, 215, 430, 706] as const,
  portrait: {
    environment: { width: 1440, height: 1920 },
    SOIL_DARK_BAND: [360, 1132, 1080, 1266] as const,
    SOIL_TO_PLANTER_FRONT_BOUNDARY: [720, 1267] as const,
    projectedBaseY: 0.6384,
  },
  landscape: {
    environment: { width: 1920, height: 1080 },
    SOIL_DARK_BAND: [260, 680, 1040, 790] as const,
    SOIL_TO_PLANTER_FRONT_BOUNDARY: [710, 755] as const,
    projectedBaseY: 0.657,
  },
} as const;

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

export function sectorSourceStyle(area: Station5AreaId): CSSProperties {
  const portrait = mapSectorPlacements.portrait[area];
  const landscape = mapSectorPlacements.landscape[area];
  return {
    "--s5-sector-p-x": percent(portrait.x, mapArtboards.portrait.width),
    "--s5-sector-p-y": percent(portrait.y, mapArtboards.portrait.height),
    "--s5-sector-p-w": percent(portrait.assetSize, mapArtboards.portrait.width),
    "--s5-sector-p-h": percent(portrait.clusterHeight, mapArtboards.portrait.height),
    "--s5-sector-p-label-y": percent(portrait.labelTop, portrait.clusterHeight),
    "--s5-sector-l-x": percent(landscape.x, mapArtboards.landscape.width),
    "--s5-sector-l-y": percent(landscape.y, mapArtboards.landscape.height),
    "--s5-sector-l-w": percent(landscape.assetSize, mapArtboards.landscape.width),
    "--s5-sector-l-h": percent(landscape.clusterHeight, mapArtboards.landscape.height),
    "--s5-sector-l-label-y": percent(landscape.labelTop, landscape.clusterHeight),
  } as CSSProperties;
}

export function serializeSourcePolygon(points: readonly SourcePoint[]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}
