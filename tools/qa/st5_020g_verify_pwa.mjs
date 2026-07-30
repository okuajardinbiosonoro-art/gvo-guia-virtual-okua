import fs from "node:fs/promises";
import path from "node:path";

const manifest = JSON.parse(await fs.readFile(path.resolve("public/assets/gvo/stations/world-5/present-map/runtime/manifest.json"), "utf8"));
const serviceWorker = await fs.readFile(path.resolve("dist/sw.js"), "utf8");
const runtimeBase = "assets/gvo/stations/world-5/present-map/runtime/";
const assets = manifest.assets.map((asset) => ({ id: asset.id, file: asset.file, precached: serviceWorker.includes(`${runtimeBase}${asset.file}`) }));
const shellEntries = ["index.html", "manifest.webmanifest", "registerSW.js"].map((file) => ({ file, precached: serviceWorker.includes(`url:"${file}"`) }));
const result = {
  mode: "generateSW",
  runtimeAssetCount: assets.length,
  runtimeAssetsPrecached: assets.filter((asset) => asset.precached).length,
  assets,
  shellEntries,
  navigateFallback: serviceWorker.includes('createHandlerBoundToURL("/index.html")'),
};
result.pass = assets.length === 24 && assets.every((asset) => asset.precached) && shellEntries.every((entry) => entry.precached) && result.navigateFallback;
result.note = "Static verification of the generated precache; installed-PWA relaunch remains a manual platform check.";
await fs.mkdir(path.resolve("docs/visual/world5/st5-020g"), { recursive: true });
await fs.writeFile(path.resolve("docs/visual/world5/st5-020g/pwa_precache.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
