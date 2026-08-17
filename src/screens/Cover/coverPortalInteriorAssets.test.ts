import { describe, expect, it } from "vitest";

import { entryCoverStationAssets } from "../../shared/assets/entryCoverAssets";
import { coverPortalInteriorAssets } from "./coverPortalInteriorAssets";

describe("coverPortalInteriorAssets", () => {
  it("declara cinco interiores dedicados de Portada sin reutilizar Mirador", () => {
    expect(coverPortalInteriorAssets).toHaveLength(5);
    expect(coverPortalInteriorAssets.map((asset) => asset.portalId)).toEqual([
      "portal-1",
      "portal-2",
      "portal-3",
      "portal-4",
      "portal-5",
    ]);

    for (const asset of coverPortalInteriorAssets) {
      expect(asset.src).toMatch(
        /^\/assets\/runtime\/cover-intro\/portals\/portal_[1-5]\/interior\/.+\.webp$/,
      );
      expect(asset.src).not.toContain("/stations/final-root/access/");
    }

    expect(
      coverPortalInteriorAssets.some((coverAsset) =>
        entryCoverStationAssets.some(
          (initialAsset) => initialAsset.src === coverAsset.src,
        ),
      ),
    ).toBe(false);
  });
});
