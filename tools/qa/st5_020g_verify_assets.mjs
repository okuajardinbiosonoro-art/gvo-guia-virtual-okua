import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const runtimeRoot = path.resolve(
  "public/assets/gvo/stations/world-5/present-map/runtime",
);
const mirrorRoot = path.resolve("public/assets/gvo/current-used/world-5-root");
const outDir = path.resolve("docs/visual/world5/st5-020g");
const manifest = JSON.parse(
  await fs.readFile(path.join(runtimeRoot, "manifest.json"), "utf8"),
);

function mirrorFile(file) {
  if (file.startsWith("lia/") || file.startsWith("system/")) return file;
  if (file.startsWith("world5_sub_space_")) return `space/${file}`;
  if (file.startsWith("world5_sub_visitor_")) return `visitor/${file}`;
  return file;
}

const assets = [];
for (const asset of manifest.assets) {
  const runtimeBuffer = await fs.readFile(path.join(runtimeRoot, asset.file));
  const mirrorRelative = mirrorFile(asset.file);
  const mirrorBuffer = await fs.readFile(path.join(mirrorRoot, mirrorRelative));
  const sha256 = createHash("sha256").update(runtimeBuffer).digest("hex").toUpperCase();
  assets.push({
    id: asset.id,
    file: asset.file,
    mirrorFile: mirrorRelative,
    bytes: runtimeBuffer.byteLength,
    sha256,
    bytesMatch: runtimeBuffer.byteLength === asset.bytes,
    hashMatch: sha256 === asset.sha256,
    mirrorIdentical: runtimeBuffer.equals(mirrorBuffer),
  });
}

const result = {
  ticket: manifest.ticket,
  status: manifest.status,
  assetCount: assets.length,
  identicalPairs: assets.filter((asset) => asset.mirrorIdentical).length,
  assets,
};
result.pass =
  result.ticket === "ST5-020G" &&
  assets.length === 24 &&
  assets.every(
    (asset) => asset.bytesMatch && asset.hashMatch && asset.mirrorIdentical,
  );

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(
  path.join(outDir, "asset_audit.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
