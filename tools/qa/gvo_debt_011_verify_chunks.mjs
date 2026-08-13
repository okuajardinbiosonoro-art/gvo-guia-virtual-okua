import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const baselineInitialJsBytes = 818_393;
const distRoot = path.resolve("dist");
const assetsRoot = path.join(distRoot, "assets");
const expectedRouteModules = [
  "TransitionWorld",
  "World1RootScreen",
  "World2RootScreen",
  "World3RootScreen",
  "World4RootScreen",
  "World5RootScreen",
  "FinalRootScreen",
];

const [indexHtml, serviceWorker, assetNames] = await Promise.all([
  readFile(path.join(distRoot, "index.html"), "utf8"),
  readFile(path.join(distRoot, "sw.js"), "utf8"),
  readdir(assetsRoot),
]);
const initialScript = indexHtml.match(/assets\/(index-[^"']+\.js)/)?.[1];

if (!initialScript) {
  throw new Error("No se encontró el script inicial de index.html.");
}

const initialJsBytes = (await stat(path.join(assetsRoot, initialScript))).size;
const routeChunks = [];

for (const moduleName of expectedRouteModules) {
  const js = assetNames.find(
    (name) => name.startsWith(`${moduleName}-`) && name.endsWith(".js"),
  );
  const css = assetNames.find(
    (name) => name.startsWith(`${moduleName}-`) && name.endsWith(".css"),
  );

  if (!js || !css) {
    throw new Error(`Chunk JS/CSS ausente para ${moduleName}.`);
  }

  routeChunks.push({
    moduleName,
    js,
    jsBytes: (await stat(path.join(assetsRoot, js))).size,
    css,
    cssBytes: (await stat(path.join(assetsRoot, css))).size,
  });
}

const precachedRouteChunks = routeChunks.flatMap(({ js, css }) =>
  [js, css].filter((name) => serviceWorker.includes(`assets/${name}`)),
);
const reductionBytes = baselineInitialJsBytes - initialJsBytes;
const reductionPercent = (reductionBytes / baselineInitialJsBytes) * 100;
const pass =
  reductionBytes > 0 &&
  precachedRouteChunks.length === 0 &&
  serviceWorker.includes(`assets/${initialScript}`) &&
  serviceWorker.includes("gvo-runtime-assets-v1");

const result = {
  baselineInitialJsBytes,
  initialScript,
  initialJsBytes,
  reductionBytes,
  reductionPercent: Number(reductionPercent.toFixed(2)),
  routeChunks,
  precachedRouteChunks,
  runtimeCache: serviceWorker.includes("gvo-runtime-assets-v1"),
  pass,
};

console.log(JSON.stringify(result, null, 2));

if (!pass) {
  process.exitCode = 1;
}
