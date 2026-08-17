import { describe, expect, it } from "vitest";

import {
  entryCoverBackdropAsset,
  entryCoverStationAssets,
} from "./entryCoverAssets";

describe("entryCoverAssets", () => {
  it("registra fondo local y cinco representaciones locales únicas", () => {
    expect(entryCoverBackdropAsset).toBe(
      "/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png",
    );
    expect(entryCoverStationAssets).toHaveLength(5);
    expect(new Set(entryCoverStationAssets.map((asset) => asset.id)).size).toBe(
      5,
    );
    expect(
      new Set(entryCoverStationAssets.map((asset) => asset.portalId)).size,
    ).toBe(5);

    for (const asset of entryCoverStationAssets) {
      expect(asset.src).toMatch(
        /^\/assets\/gvo\/stations\/final-root\/access\/final_access_world[1-5]_.*\.webp$/,
      );
      expect(asset.src).not.toMatch(/^https?:\/\//);
    }
  });
});
