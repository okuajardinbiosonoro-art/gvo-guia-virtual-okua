import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { relative, resolve } from "node:path";

import { NON_DEPLOYABLE_PUBLIC_ARTIFACTS } from "../vite/exclude-nondeployable-public.mjs";

const distRoot = resolve("dist");
const publicRoot = resolve("public");

const walk = async (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  if (!(await stat(directory)).isDirectory()) {
    return [directory];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
};

const toPosixRelative = (root, file) =>
  relative(root, file).replaceAll("\\", "/");

const collectExcludedSourceFiles = async () => {
  const files = new Set();

  for (const relativePath of NON_DEPLOYABLE_PUBLIC_ARTIFACTS) {
    const source = resolve(publicRoot, relativePath);
    const sourceFiles = await walk(source);

    if (sourceFiles.length > 0) {
      sourceFiles.forEach((file) => files.add(file));
    } else if (existsSync(source)) {
      files.add(source);
    }
  }

  return [...files];
};

const classifyDeployedResource = (url) => {
  if (
    ["index.html", "manifest.webmanifest", "registerSW.js"].includes(url) ||
    /^assets\/index-[^/]+\.(?:js|css)$/.test(url) ||
    /^assets\/pixelify-[^/]+\.woff2$/.test(url) ||
    url === "assets/runtime/gvo-icon.svg" ||
    url === "assets/runtime/loading-initial-pre-portada.png" ||
    url.startsWith("assets/runtime/loading-initial/") ||
    url.startsWith("assets/runtime/cover-intro/")
  ) {
    return "A_FIRST_ACCESS";
  }

  if (
    /^assets\/(?:transition_|portal_|lia_transition_|symbol_root)/.test(url)
  ) {
    return "B_JOURNEY_SHARED";
  }

  if (
    url.startsWith("assets/gvo/stations/") ||
    url.startsWith("assets/gvo/shared/gesture-hints/") ||
    url.startsWith("assets/gvo/shared/lia/current-used/portada-intro/")
  ) {
    return "C_STATION_SPECIFIC";
  }

  return "INFRASTRUCTURE";
};

if (!existsSync(resolve(distRoot, "sw.js"))) {
  throw new Error(
    "Falta dist/sw.js. Ejecute npm run build antes del verificador.",
  );
}

const distFiles = await walk(distRoot);
const distByUrl = new Map(
  await Promise.all(
    distFiles.map(async (file) => [
      toPosixRelative(distRoot, file),
      (await stat(file)).size,
    ]),
  ),
);
const serviceWorker = await readFile(resolve(distRoot, "sw.js"), "utf8");
const precacheEntries = [
  ...serviceWorker.matchAll(/\{url:"([^"]+)",revision:(?:"[^"]*"|null)\}/g),
].map((match) => match[1]);
const uniquePrecacheEntries = [...new Set(precacheEntries)];
const duplicatePrecacheUrls = precacheEntries.filter(
  (url, index) => precacheEntries.indexOf(url) !== index,
);
const missingPrecacheFiles = uniquePrecacheEntries.filter(
  (url) => !distByUrl.has(url),
);
const unexpectedPrecacheEntries = uniquePrecacheEntries.filter(
  (url) => classifyDeployedResource(url) !== "A_FIRST_ACCESS",
);
const excludedSourceFiles = await collectExcludedSourceFiles();
const leakedNonDeployablePaths = NON_DEPLOYABLE_PUBLIC_ARTIFACTS.filter(
  (relativePath) => existsSync(resolve(distRoot, relativePath)),
);

const categoryRows = [...distByUrl.entries()].reduce((rows, [url, bytes]) => {
  const category = classifyDeployedResource(url);
  const current = rows[category] ?? { files: 0, bytes: 0 };
  current.files += 1;
  current.bytes += bytes;
  rows[category] = current;
  return rows;
}, {});

const requiredShellEntries = [
  "index.html",
  "manifest.webmanifest",
  "registerSW.js",
];
const requiredRuntimeAssets = [
  "assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/background/world2_background_base_mobile_v01.webp",
  "assets/gvo/stations/world-3/notebook-pixel/runtime/environment/world3_ambient_texture_v01.webp",
  "assets/gvo/stations/world-4/system-table/runtime/environment/world4_environment_base_v01.webp",
  "assets/gvo/stations/world-5/present-map/runtime/world5_map_environment_portrait_v01.webp",
  "assets/gvo/stations/final-root/environment/final_environment_portrait_v01.webp",
];
const checks = {
  buildPresent: distFiles.length > 0,
  shellPrecached: requiredShellEntries.every((url) =>
    uniquePrecacheEntries.includes(url),
  ),
  appBundlePrecached: uniquePrecacheEntries.some((url) =>
    /^assets\/index-[^/]+\.js$/.test(url),
  ),
  criticalVisualsPrecached:
    uniquePrecacheEntries.some((url) =>
      url.startsWith("assets/runtime/loading-initial/"),
    ) &&
    uniquePrecacheEntries.some((url) =>
      url.startsWith("assets/runtime/cover-intro/"),
    ),
  noDuplicatePrecacheUrls: duplicatePrecacheUrls.length === 0,
  noMissingPrecacheFiles: missingPrecacheFiles.length === 0,
  onlyFirstAccessPrecached: unexpectedPrecacheEntries.length === 0,
  precacheUnder25MiB:
    uniquePrecacheEntries.reduce(
      (sum, url) => sum + (distByUrl.get(url) ?? 0),
      0,
    ) <
    25 * 1024 * 1024,
  deploymentUnder130MiB:
    [...distByUrl.values()].reduce((sum, bytes) => sum + bytes, 0) <
    130 * 1024 * 1024,
  nonDeployableSourcesPreserved: NON_DEPLOYABLE_PUBLIC_ARTIFACTS.every(
    (relativePath) => existsSync(resolve(publicRoot, relativePath)),
  ),
  noNonDeployableLeak: leakedNonDeployablePaths.length === 0,
  stationRuntimeAssetsDeployed: requiredRuntimeAssets.every((url) =>
    distByUrl.has(url),
  ),
  runtimeCacheConfigured:
    serviceWorker.includes("gvo-runtime-assets-v1") &&
    serviceWorker.includes("StaleWhileRevalidate"),
  localAssetMatcherConfigured:
    serviceWorker.includes('pathname.startsWith("/assets/")') &&
    serviceWorker.includes("location.origin"),
  navigateFallbackConfigured: serviceWorker.includes(
    'createHandlerBoundToURL("/index.html")',
  ),
  outdatedPrecacheCleanupConfigured: serviceWorker.includes(
    "cleanupOutdatedCaches",
  ),
};

const precacheBytes = uniquePrecacheEntries.reduce(
  (sum, url) => sum + (distByUrl.get(url) ?? 0),
  0,
);
const result = {
  ticket: "GVO_DEBT_010",
  state: "PENDING_HUMAN_REVIEW",
  dist: {
    files: distFiles.length,
    bytes: [...distByUrl.values()].reduce((sum, bytes) => sum + bytes, 0),
    sha256Inventory: createHash("sha256")
      .update(
        [...distByUrl.entries()]
          .sort(([left], [right]) => left.localeCompare(right, "en"))
          .map(([url, bytes]) => `${url}\0${bytes}\n`)
          .join(""),
      )
      .digest("hex"),
  },
  precache: {
    entries: precacheEntries.length,
    uniqueEntries: uniquePrecacheEntries.length,
    bytes: precacheBytes,
    duplicateUrls: duplicatePrecacheUrls,
    missingFiles: missingPrecacheFiles,
    unexpectedEntries: unexpectedPrecacheEntries,
  },
  deployedCategories: categoryRows,
  nonDeployableSources: {
    paths: NON_DEPLOYABLE_PUBLIC_ARTIFACTS.length,
    files: excludedSourceFiles.length,
    bytes: (
      await Promise.all(
        excludedSourceFiles.map(async (file) => (await stat(file)).size),
      )
    ).reduce((sum, bytes) => sum + bytes, 0),
    leakedPaths: leakedNonDeployablePaths,
  },
  checks,
  pass: Object.values(checks).every(Boolean),
};

console.log(JSON.stringify(result, null, 2));

if (!result.pass) {
  process.exitCode = 1;
}
