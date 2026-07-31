import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ticket = "ST5-020H";
const baseline = "ddd6859efa3bdb3c5415b9bb6ec2cd13faac707a";
const runtimeRoot = path.resolve(
  "public/assets/gvo/stations/world-5/present-map/runtime",
);
const mirrorRoot = path.resolve("public/assets/gvo/current-used/world-5-root");
const outDir = path.resolve("docs/visual/world5/st5-020h");
const manifest = JSON.parse(
  await fs.readFile(path.join(runtimeRoot, "manifest.json"), "utf8"),
);

function mirrorFile(file) {
  if (file.startsWith("lia/") || file.startsWith("system/")) return file;
  if (file.startsWith("world5_sub_space_")) return `space/${file}`;
  if (file.startsWith("world5_sub_visitor_")) return `visitor/${file}`;
  return file;
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const assets = [];
for (const asset of manifest.assets) {
  const runtimeBuffer = await fs.readFile(path.join(runtimeRoot, asset.file));
  const mirrorRelative = mirrorFile(asset.file);
  const mirrorBuffer = await fs.readFile(path.join(mirrorRoot, mirrorRelative));
  const sha256 = createHash("sha256")
    .update(runtimeBuffer)
    .digest("hex")
    .toUpperCase();
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

const assetAudit = {
  ticket,
  frozenManifestTicket: manifest.ticket,
  frozenManifestStatus: manifest.status,
  assetCount: assets.length,
  identicalPairs: assets.filter((asset) => asset.mirrorIdentical).length,
  newAssets: 0,
  assets,
};
assetAudit.pass =
  manifest.ticket === "ST5-020G" &&
  assets.length === 24 &&
  assets.every(
    (asset) => asset.bytesMatch && asset.hashMatch && asset.mirrorIdentical,
  );

const serviceWorker = await fs.readFile(path.resolve("dist/sw.js"), "utf8");
const runtimeBase = "assets/gvo/stations/world-5/present-map/runtime/";
const precachedAssets = manifest.assets.map((asset) => ({
  id: asset.id,
  file: asset.file,
  precached: serviceWorker.includes(`${runtimeBase}${asset.file}`),
}));
const shellEntries = [
  "index.html",
  "manifest.webmanifest",
  "registerSW.js",
].map((file) => ({ file, precached: serviceWorker.includes(`url:"${file}"`) }));
const pwaPrecache = {
  ticket,
  mode: "generateSW",
  runtimeAssetCount: precachedAssets.length,
  runtimeAssetsPrecached: precachedAssets.filter((asset) => asset.precached)
    .length,
  assets: precachedAssets,
  shellEntries,
  navigateFallback: serviceWorker.includes(
    'createHandlerBoundToURL("/index.html")',
  ),
  note: "Static verification of the generated precache; installed-PWA relaunch remains a manual platform check.",
};
pwaPrecache.pass =
  precachedAssets.length === 24 &&
  precachedAssets.every((asset) => asset.precached) &&
  shellEntries.every((entry) => entry.precached) &&
  pwaPrecache.navigateFallback;

const frozenScopes = [
  "src/screens/TransitionWorld",
  "src/content/transitionEditorialSlots.ts",
  "src/screens/FinalRoot",
  "public/assets/gvo/stations/world-5",
  "public/assets/gvo/current-used/world-5-root",
  "public/assets/gvo/shared/lia",
  "package.json",
  "package-lock.json",
];
const frozenFiles = git(
  "ls-tree",
  "-r",
  "--name-only",
  baseline,
  "--",
  ...frozenScopes,
)
  .split(/\r?\n/)
  .filter(Boolean);
const changedFiles = git("diff", "--name-only", baseline, "--", ...frozenScopes)
  .split(/\r?\n/)
  .filter(Boolean);
const frozenContracts = {
  ticket,
  baseline,
  scopes: frozenScopes,
  baselineFileCount: frozenFiles.length,
  changedFiles,
  finalRootByteIdentical: !changedFiles.some((file) =>
    file.startsWith("src/screens/FinalRoot/"),
  ),
  transitionWorldByteIdentical: !changedFiles.some(
    (file) =>
      file.startsWith("src/screens/TransitionWorld/") ||
      file === "src/content/transitionEditorialSlots.ts",
  ),
  packageFilesByteIdentical: !changedFiles.some(
    (file) => file === "package.json" || file === "package-lock.json",
  ),
  worldFiveAssetsByteIdentical: !changedFiles.some(
    (file) =>
      file.startsWith("public/assets/gvo/stations/world-5/") ||
      file.startsWith("public/assets/gvo/current-used/world-5-root/") ||
      file.startsWith("public/assets/gvo/shared/lia/"),
  ),
};
frozenContracts.pass = changedFiles.length === 0;

await fs.mkdir(outDir, { recursive: true });
for (const [file, value] of [
  ["asset_audit.json", assetAudit],
  ["pwa_precache.json", pwaPrecache],
  ["frozen_contracts.json", frozenContracts],
]) {
  await fs.writeFile(
    path.join(outDir, file),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

const result = {
  ticket,
  assetAudit: assetAudit.pass,
  pwaPrecache: pwaPrecache.pass,
  frozenContracts: frozenContracts.pass,
  pass: assetAudit.pass && pwaPrecache.pass && frozenContracts.pass,
};
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
