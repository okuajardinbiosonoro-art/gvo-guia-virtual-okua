// @vitest-environment node
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import {
  world5LiaAssetSources,
  world5SpaceAssetSources,
  world5SystemAssetSources,
} from "./world5RuntimeAssets";

const runtimeRoot = path.resolve(
  "public/assets/gvo/stations/world-5/present-map/runtime",
);
const mirrorRoot = path.resolve("public/assets/gvo/current-used/world-5-root");

const approvedAssets = [
  [
    "system/world5_sub_system_environment_portrait_v01.webp",
    "webp",
    1440,
    1920,
    false,
    91210,
    "f9c5978400f3deb37e027cdbc9aeb0d6754e6fa04441be641f83561496326bcb",
  ],
  [
    "system/world5_sub_system_environment_landscape_v01.webp",
    "webp",
    1920,
    1080,
    false,
    51930,
    "9af9fef48649cbfcd650513eb5f7662fedc584079800616f7e6c4ab652c231d3",
  ],
  [
    "system/world5_sub_system_focus_v01.webp",
    "webp",
    1536,
    1536,
    true,
    185742,
    "680392b58b8a6c9b13c5aa36783ff481303b31712f3646471dcc4375ae3390b2",
  ],
  [
    "lia/lia_pose_explain_calm_v1.png",
    "png",
    1086,
    1448,
    true,
    727614,
    "17020fcdce68624db85ff173869d693d77a009e408859e323fc238d2f90b7064",
  ],
  [
    "lia/lia_pose_greeting_v1.png",
    "png",
    1086,
    1448,
    true,
    702541,
    "7a25a54fbc96852d0c5e26b4de1fd470ae708eccdef7ef7352d37806e89c0ad5",
  ],
  [
    "lia/lia_world5_lead_forward_v01.webp",
    "webp",
    1536,
    1536,
    true,
    120244,
    "58696a77f16bde395fb093771790377f3b44fc788ff9d1b661080e92806a009e",
  ],
  [
    "lia/lia_world5_attend_neutral_v01.webp",
    "webp",
    1536,
    1536,
    true,
    135910,
    "bfd5c5e3eb4de9b9a908c6daa7730ea9005af912abb58ce735c81ddcaa451316",
  ],
] as const;

describe("assets runtime ST5-020B", () => {
  it.each(approvedAssets)(
    "valida nombre, formato, canvas, alpha, bytes, hash y espejo de %s",
    async (relativeFile, format, width, height, alpha, bytes, sha256) => {
      const runtimeFile = path.join(runtimeRoot, relativeFile);
      const mirrorFile = path.join(mirrorRoot, relativeFile);
      const [runtimeBuffer, mirrorBuffer, runtimeStat] = await Promise.all([
        readFile(runtimeFile),
        readFile(mirrorFile),
        stat(runtimeFile),
      ]);
      const metadata = await sharp(runtimeBuffer).metadata();

      expect(metadata).toMatchObject({
        format,
        width,
        height,
        hasAlpha: alpha,
      });
      expect(runtimeStat.size).toBe(bytes);
      expect(createHash("sha256").update(runtimeBuffer).digest("hex")).toBe(
        sha256,
      );
      expect(mirrorBuffer.equals(runtimeBuffer)).toBe(true);
    },
  );

  it.each([
    [
      "world5_sub_space_environment_portrait_v01.webp",
      "webp",
      1440,
      1920,
      false,
      109230,
      "2d5cf7921187a67a7aea092d7dcb84c9b4435620168187dbbb6e928a4d6f48b3",
    ],
    [
      "world5_sub_space_environment_landscape_v01.webp",
      "webp",
      1920,
      1080,
      false,
      73372,
      "53d57b96d5bc0ed13694361892a11cb8568e7c4da61d95bee1a6a44ef0ee7bd8",
    ],
    [
      "world5_sub_space_focus_v01.webp",
      "webp",
      1536,
      1536,
      true,
      141948,
      "fdd48fbc8e9f439e9d51c21c2bb3cb7406423ddcbb50aa0a3a218ea6deb71f66",
    ],
  ] as const)(
    "valida asset ST5-020F y espejo space de %s",
    async (relativeFile, format, width, height, alpha, bytes, sha256) => {
      const runtimeFile = path.join(runtimeRoot, relativeFile);
      const mirrorFile = path.join(mirrorRoot, "space", relativeFile);
      const [runtimeBuffer, mirrorBuffer, runtimeStat] = await Promise.all([
        readFile(runtimeFile),
        readFile(mirrorFile),
        stat(runtimeFile),
      ]);
      const metadata = await sharp(runtimeBuffer).metadata();

      expect(metadata).toMatchObject({
        format,
        width,
        height,
        hasAlpha: alpha,
      });
      expect(runtimeStat.size).toBe(bytes);
      expect(createHash("sha256").update(runtimeBuffer).digest("hex")).toBe(
        sha256,
      );
      expect(mirrorBuffer.equals(runtimeBuffer)).toBe(true);
    },
  );

  it("registra bundles tipados exactos y únicamente URLs locales", () => {
    expect(
      screenAssetBundles.world5System.assets.map(({ src }) => src),
    ).toEqual([...world5SystemAssetSources]);
    expect(screenAssetBundles.world5Lia.assets.map(({ src }) => src)).toEqual([
      ...world5LiaAssetSources,
    ]);
    expect(screenAssetBundles.world5Space.assets.map(({ src }) => src)).toEqual(
      [...world5SpaceAssetSources],
    );
    for (const bundle of [
      screenAssetBundles.world5System,
      screenAssetBundles.world5Space,
      screenAssetBundles.world5Lia,
    ]) {
      for (const asset of bundle.assets) {
        expect(asset.src).toMatch(/^\/assets\//);
        expect(asset.src).not.toMatch(/^https?:\/\//);
      }
    }
  });
});
