import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const approved = {
  "LIA-M4-GREETING-A":
    "3C4A4C454758D3C5380ED9405C4AD534D97FCCA553281CCDBF2E56CAE939D4F3",
  "LIA-M4-LISTENING-A":
    "B08125CA85720D50EEEF8A4DDABB52645CE41D5C5C98F53CC3D266503F1DF714",
  "LIA-M4-EXPLAINING-A":
    "89297153A015937E82D2B020A159C4254100ABE10016BEE89C6AC81B41A11C6F",
};
const rejected = [
  "LIA-M4-FAREWELL-A",
  "LIA-M4-THINKING-A",
  "LIA-M4-THINKING-B",
  "LIA-M4-UNCERTAIN-A",
  "1C3231DAC47E4B2A572572E440545E0880C0B04488C6D27F9EC101831E685405",
  "0A3AEF8744F29BE3DF3A58C851DDF948A8778482DFC61A7936B98E9AD7C509DA",
  "97205D9D61503270BA8668F669609FE322408DF8F3BE0671021D68C2A3C2BC32",
  "17B7058E4BB412FF449321B25D86E2762B73CCAB80222F57F79E585C67B87A58",
];
const digest = (data) =>
  crypto.createHash("sha256").update(data).digest("hex").toUpperCase();
const manifestPath = "public/assets/gvo/current-used/lia-preview/manifest.json";
const options = { lossless: true, effort: 6, force: true };

export function assertRuntimeSelection(manifest) {
  const serialized = JSON.stringify(manifest).toUpperCase();
  for (const value of rejected)
    assert.ok(!serialized.includes(value), `Unapproved candidate: ${value}`);
  const derived = manifest.assets.filter((asset) => asset.source_sha256);
  assert.equal(derived.length, 3);
  assert.equal(new Set(derived.map((asset) => asset.asset_id)).size, 3);
  for (const item of derived) {
    assert.equal(item.source_sha256, approved[item.asset_id]);
    assert.ok(approved[item.asset_id]);
    for (const value of [
      item.source_path,
      item.runtime_path,
      item.current_used_mirror,
    ]) {
      assert.ok(
        !/^(?:[a-z]:|\/)|\\|\.\./i.test(value),
        "Only repository-relative asset paths",
      );
    }
  }
}

async function pixelsEqual(source, runtime) {
  const a = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const b = await sharp(runtime)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  assert.deepEqual(a.info, b.info);
  let transparent = 0,
    visible = 0;
  for (let n = 0; n < a.data.length; n += 4) {
    assert.equal(a.data[n + 3], b.data[n + 3], "Alpha must be identical");
    if (a.data[n + 3] === 0) transparent++;
    else {
      visible++;
      for (let c = 0; c < 3; c++)
        assert.equal(
          a.data[n + c],
          b.data[n + c],
          "Visible pixels must be identical",
        );
    }
  }
  assert.ok(transparent > 0 && visible > 0, "Real alpha required");
  return {
    width: a.info.width,
    height: a.info.height,
    transparent_pixels: transparent,
    visible_pixels: visible,
    alpha_identical: true,
    visible_pixels_identical: true,
  };
}

export async function validateAssets() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assertRuntimeSelection(manifest);
  for (const item of manifest.assets.filter((asset) => asset.source_sha256)) {
    const source = fs.readFileSync(item.source_path);
    const runtime = fs.readFileSync(item.runtime_path);
    assert.equal(digest(source), approved[item.asset_id]);
    assert.equal(digest(runtime), item.sha256);
    assert.deepEqual(runtime, fs.readFileSync(item.current_used_mirror));
    await pixelsEqual(source, runtime);
  }
  // Inject each prohibited identifier and digest, including through unrelated metadata.
  for (const value of rejected) {
    assert.throws(() => assertRuntimeSelection({ ...manifest, note: value }));
  }
  const badSource = globalThis.structuredClone(manifest);
  badSource.assets.find((asset) => asset.source_sha256).source_sha256 =
    "UNKNOWN";
  assert.throws(() => assertRuntimeSelection(badSource));
}

async function derive() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.assets = manifest.assets.filter((asset) => !asset.source_sha256);
  for (const [id, expected] of Object.entries(approved)) {
    const sourcePath = `assets-source/lia-m4/${id}.png`;
    const source = fs.readFileSync(sourcePath);
    assert.equal(digest(source), expected);
    const runtimePath = `public/assets/gvo/lia-preview/lia/${id.toLowerCase()}.webp`;
    const mirror = `public/assets/gvo/current-used/lia-preview/lia/${id.toLowerCase()}.webp`;
    const data = await sharp(source).webp(options).toBuffer();
    assert.deepEqual(
      data,
      await sharp(source).webp(options).toBuffer(),
      "Deterministic output",
    );
    const pixels = await pixelsEqual(source, data);
    for (const name of [runtimePath, mirror]) {
      fs.mkdirSync(path.dirname(name), { recursive: true });
      fs.writeFileSync(name, data);
    }
    manifest.assets.push({
      asset_id: id,
      source_path: sourcePath,
      source_sha256: expected,
      runtime_path: runtimePath,
      current_used_mirror: mirror,
      sha256: digest(data),
      bytes: data.length,
      format: "webp",
      dimensions: [pixels.width, pixels.height],
      human_approval: "HUMAN_APPROVED_SOURCE_DERIVATION",
      consumer: "LiaPreview",
      function: id.split("-")[2].toLowerCase(),
      derivation: {
        recipe: "tools/assets/derive_lia_m4_assets.mjs",
        version: 1,
        sharp: sharp.versions.sharp,
        vips: sharp.versions.vips,
        options,
        crop: false,
        resize: false,
        redraw: false,
        ...pixels,
      },
    });
  }
  manifest.ticket = "LIA-M4-FINAL-01";
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  await validateAssets();
  console.log(
    JSON.stringify({
      result: "PASS",
      source_originals_preserved: 3,
      derivatives: 3,
      rejected_guard_cases: rejected.length,
      new_images_generated: false,
    }),
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  if (process.argv.includes("--check")) await validateAssets();
  else await derive();
}
