import { describe, expect, it } from "vitest";

import {
  mapArtboards,
  mapRecessMaskLandscape,
  mapRecessMaskPortrait,
  mapSectorAlphaBboxes,
  mapSectorPlacements,
  plantsSourceGeometry,
} from "./station5Geometry";

function pointInPolygon(x: number, y: number, polygon: readonly (readonly [number, number])[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

describe("ST5-020E source geometry", () => {
  it.each(["portrait", "landscape"] as const)(
    "keeps every transformed alpha bbox inside the documented %s recess",
    (orientation) => {
      const polygon =
        orientation === "portrait"
          ? mapRecessMaskPortrait
          : mapRecessMaskLandscape;
      const placements = mapSectorPlacements[orientation];

      for (const [area, placement] of Object.entries(placements)) {
        const [left, top, right, bottom] =
          mapSectorAlphaBboxes[area as keyof typeof mapSectorAlphaBboxes];
        const scale = placement.assetSize / 1536;
        const corners = [
          [placement.x + left * scale, placement.y + top * scale],
          [placement.x + right * scale, placement.y + top * scale],
          [placement.x + right * scale, placement.y + bottom * scale],
          [placement.x + left * scale, placement.y + bottom * scale],
        ] as const;
        expect(corners.every(([x, y]) => pointInPolygon(x, y, polygon))).toBe(
          true,
        );
      }
    },
  );

  it("documents source artboards and the perceptual Plants contact authorities", () => {
    expect(mapArtboards.portrait).toEqual({ width: 1440, height: 2560 });
    expect(mapArtboards.landscape).toEqual({ width: 2560, height: 1440 });
    expect(plantsSourceGeometry.P_PLANT_BASE).toEqual([772, 1280]);
    expect(plantsSourceGeometry.portrait.SOIL_DARK_BAND).toEqual([
      360, 1132, 1080, 1266,
    ]);
    expect(
      plantsSourceGeometry.portrait.SOIL_TO_PLANTER_FRONT_BOUNDARY,
    ).toEqual([720, 1267]);
  });
});
