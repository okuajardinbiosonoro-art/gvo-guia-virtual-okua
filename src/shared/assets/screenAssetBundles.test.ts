import { describe, expect, it } from "vitest";

import { coverIntroAssets } from "../../screens/Cover/coverIntroAssets";
import { screenAssetBundles } from "./screenAssetBundles";

describe("screenAssetBundles", () => {
  it("aísla la pose de activación de Lía en su bundle de Portada", () => {
    expect(screenAssetBundles.coverIntroActivation.assets).toEqual([
      expect.objectContaining({
        id: "cover_lia_activate_portal_1",
        kind: "image",
        src: coverIntroAssets.liaActivatePortal1,
      }),
    ]);
    expect(screenAssetBundles.coverIntroCritical.assets).not.toContainEqual(
      expect.objectContaining({ src: coverIntroAssets.liaActivatePortal1 }),
    );
  });
});
