// @vitest-environment node
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  finalRootAssetCategories,
  finalRootAssetPaths,
  finalRootAssets,
} from "./finalRootAssets";

type RuntimeManifestAsset = {
  id: string;
  filename: string;
  relative_path: string;
  category: "environment" | "access" | "ui" | "lia";
  consumer: "FinalRoot";
  canvas: [number, number];
  format: "png" | "webp";
  mode: "RGB" | "RGBA";
  alpha: boolean;
  alpha_bbox: [number, number, number, number];
  bytes: number;
  sha256: string;
  human_approval: "HUMAN_APPROVED";
  source_package_sha256: string;
  runtime_status: "HUMAN_APPROVED / REGISTERED / NOT_YET_COMPOSED";
  current_used_mirror: string;
  precache_expected: true;
};

type RuntimeManifest = {
  runtime_asset_count: 19;
  source_package_sha256: string;
  assets: RuntimeManifestAsset[];
};

const packageSha256 =
  "4E2AB2A95437411EC9519AF77D46BCFAD3E44B5B88F2A2B17EDC83402348644F";
const runtimeRoot = path.resolve("public/assets/gvo/stations/final-root");
const mirrorRoot = path.resolve("public/assets/gvo/current-used/final-root");
const productionSourceRoot = path.resolve(
  "docs/assets/final-root/production-sources/lia",
);

const expectedFilenames = {
  environment: [
    "final_environment_portrait_v01.webp",
    "final_environment_landscape_v01.webp",
    "final_valley_depth_portrait_v01.webp",
    "final_valley_depth_landscape_v01.webp",
    "final_mirador_foreground_portrait_v01.webp",
    "final_mirador_foreground_landscape_v01.webp",
  ],
  access: [
    "final_access_world1_root_v01.webp",
    "final_access_world2_pulse_v01.webp",
    "final_access_world3_notebook_v01.webp",
    "final_access_world4_system_v01.webp",
    "final_access_world5_map_v01.webp",
    "final_access_label_backplate_v01.png",
  ],
  ui: [
    "final_title_backplate_v01.png",
    "final_credits_backplate_v01.png",
    "final_action_backplate_v01.png",
    "final_restart_dialog_backplate_v01.png",
  ],
  lia: [
    "final_lia_idle_contemplative_6f_v01.webp",
    "final_lia_greeting_4f_v01.webp",
    "final_lia_glow_shadow_v01.png",
  ],
} as const;

const expectedProductionSources = [
  [
    "final_lia_idle_master_v01.png",
    236589,
    "9ACB9A44C1E2C0DC32CA5078A9ED826BE5F8648F36C80207B99439D158A56FCF",
  ],
  [
    "final_lia_idle_3x2_sheet_v01.png",
    81383,
    "C032E39C0C3BFCBBFE06AD95827637864AF9C3502E4729DA3EB8AD8537F5565A",
  ],
  [
    "final_lia_greeting_2x2_sheet_deterministic_v01.png",
    107432,
    "1104EFCD73E16A9806FB919F94EBA730D1B5AE7B42218548D9B74EB7EF48A697",
  ],
  [
    "final_lia_idle_contemplative_6f_metrics.json",
    6552,
    "125B8BEFDC2DD4677F37F7AAA538E3CCA80A1E77421C4B88612E24BBA293E3A7",
  ],
  [
    "final_lia_greeting_4f_metrics.json",
    2816,
    "09B3A94427B4DF3586F4E924E537E1B980561BDF123235071F77972ADCBF6DAC",
  ],
] as const;

function sha256(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex").toUpperCase();
}

async function alphaBoundingBox(buffer: Buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = 0;
  let bottom = 0;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * info.channels + 3];
      if (alpha === 0) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x + 1);
      bottom = Math.max(bottom, y + 1);
    }
  }

  return [left, top, right, bottom];
}

describe("GVO_FINAL_021I approved FinalRoot assets", () => {
  it("exports the four exact categories and nineteen exact filenames", () => {
    expect(finalRootAssetCategories).toEqual([
      "environment",
      "access",
      "ui",
      "lia",
    ]);
    for (const category of finalRootAssetCategories) {
      expect(
        Object.values(finalRootAssets[category]).map((assetPath) =>
          path.posix.basename(assetPath),
        ),
      ).toEqual(expectedFilenames[category]);
    }
  });

  it("exports nineteen unique local canonical paths without current-used", () => {
    expect(finalRootAssetPaths).toHaveLength(19);
    expect(new Set(finalRootAssetPaths).size).toBe(19);
    for (const assetPath of finalRootAssetPaths) {
      expect(assetPath).toMatch(/^\/assets\/gvo\/stations\/final-root\//);
      expect(assetPath).not.toMatch(/^https?:\/\//);
      expect(assetPath).not.toContain("current-used");
    }
  });

  it("validates manifest, binary metadata, alpha bbox and byte-identical mirrors", async () => {
    const manifestBuffer = await readFile(
      path.join(runtimeRoot, "manifest.json"),
    );
    const mirrorManifestBuffer = await readFile(
      path.join(mirrorRoot, "manifest.json"),
    );
    const manifest = JSON.parse(manifestBuffer.toString()) as RuntimeManifest;

    expect(mirrorManifestBuffer.equals(manifestBuffer)).toBe(true);
    expect(manifest.runtime_asset_count).toBe(19);
    expect(manifest.assets).toHaveLength(19);
    expect(manifest.source_package_sha256).toBe(packageSha256);
    expect(new Set(manifest.assets.map(({ id }) => id)).size).toBe(19);

    for (const asset of manifest.assets) {
      const runtimeBuffer = await readFile(
        path.join(runtimeRoot, asset.relative_path),
      );
      const mirrorBuffer = await readFile(
        path.join(mirrorRoot, asset.relative_path),
      );
      const metadata = await sharp(runtimeBuffer).metadata();

      expect(runtimeBuffer).toHaveLength(asset.bytes);
      expect(sha256(runtimeBuffer)).toBe(asset.sha256);
      expect(mirrorBuffer.equals(runtimeBuffer)).toBe(true);
      expect(metadata).toMatchObject({
        format: asset.format,
        width: asset.canvas[0],
        height: asset.canvas[1],
        hasAlpha: asset.alpha,
      });
      expect(asset.mode).toBe(asset.alpha ? "RGBA" : "RGB");
      expect(await alphaBoundingBox(runtimeBuffer)).toEqual(asset.alpha_bbox);
      expect(asset.consumer).toBe("FinalRoot");
      expect(asset.human_approval).toBe("HUMAN_APPROVED");
      expect(asset.source_package_sha256).toBe(packageSha256);
      expect(asset.runtime_status).toBe(
        "HUMAN_APPROVED / REGISTERED / NOT_YET_COMPOSED",
      );
      expect(asset.current_used_mirror).toBe(
        `public/assets/gvo/current-used/final-root/${asset.relative_path}`,
      );
      expect(asset.precache_expected).toBe(true);
    }
  });

  it("preserves exactly five approved production sources outside public", async () => {
    const sourceFiles = (await readdir(productionSourceRoot)).sort();
    expect(sourceFiles).toEqual(
      expectedProductionSources.map(([filename]) => filename).sort(),
    );
    for (const [filename, bytes, expectedHash] of expectedProductionSources) {
      const buffer = await readFile(path.join(productionSourceRoot, filename));
      expect(buffer).toHaveLength(bytes);
      expect(sha256(buffer)).toBe(expectedHash);
      expect(path.join(productionSourceRoot, filename)).not.toContain(
        `${path.sep}public${path.sep}`,
      );
    }
  });

  it("contains no rejected or noncanonical asset in either registered tree", async () => {
    const allowed = new Set([
      ...Object.values(expectedFilenames).flat(),
      "manifest.json",
      "README.md",
    ]);
    for (const root of [runtimeRoot, mirrorRoot]) {
      for (const category of finalRootAssetCategories) {
        for (const filename of await readdir(path.join(root, category))) {
          expect(allowed.has(filename)).toBe(true);
          expect(filename).not.toMatch(/\bI(?:3|4|17|19|20)\b/i);
          expect(filename).not.toMatch(/(?:preview|contact.?sheet|candidate)/i);
        }
      }
    }
  });

  it("does not consume the registry from the current FinalRoot screen", async () => {
    const finalRootSource = await readFile(
      path.resolve("src/screens/FinalRoot/FinalRootScreen.tsx"),
      "utf8",
    );
    expect(finalRootSource).not.toContain("finalRootAssets");
    expect(finalRootSource).not.toContain("/assets/gvo/stations/final-root/");
  });
});
