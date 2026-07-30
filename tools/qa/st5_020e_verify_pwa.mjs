import fs from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve(
  "public/assets/gvo/stations/world-5/present-map/runtime/manifest.json",
);
const serviceWorkerPath = path.resolve("dist/sw.js");
const outputPath = path.resolve(
  "docs/visual/world5/st5-020e/pwa_precache.json",
);

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const serviceWorker = await fs.readFile(serviceWorkerPath, "utf8");
const runtimeBase = "assets/gvo/stations/world-5/present-map/runtime/";
const assets = manifest.assets.map((asset) => ({
  id: asset.id,
  file: asset.file,
  precached: serviceWorker.includes(`${runtimeBase}${asset.file}`),
}));
const shellEntries = ["index.html", "manifest.webmanifest", "registerSW.js"].map(
  (file) => ({
    file,
    precached: serviceWorker.includes(`url:"${file}"`),
  }),
);

const result = {
  mode: "generateSW",
  runtimeAssetCount: assets.length,
  runtimeAssetsPrecached: assets.filter((asset) => asset.precached).length,
  assets,
  shellEntries,
  navigateFallback: serviceWorker.includes(
    'createHandlerBoundToURL("/index.html")',
  ),
  pass:
    assets.length === 18 &&
    assets.every((asset) => asset.precached) &&
    shellEntries.every((entry) => entry.precached) &&
    serviceWorker.includes('createHandlerBoundToURL("/index.html")'),
  note: "Verificación estática del precache generado; no declara un probe offline de navegador.",
};

await fs.writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
