/* global console, process */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const assetRoot = path.join(repoRoot, "src", "assets", "transition-world", "root");
const runtimeRoot = path.join(assetRoot, "runtime");
const manifestPath = path.join(assetRoot, "asset-manifest.transition-root.json");

const forbiddenNamePattern = /(mockup|candidate|rejected|rechazad|review_board|review-board)/i;

function readPngDimensions(filePath) {
  const buffer = readFileSync(filePath);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error(`No es PNG valido: ${path.relative(repoRoot, filePath)}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function walkFiles(dir) {
  const files = [];
  if (!existsSync(dir)) {
    return files;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

if (!existsSync(manifestPath)) {
  fail("No existe asset-manifest.transition-root.json");
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];

  if (manifest.status !== "approved_assets_ingested") {
    fail(`Estado de manifest inesperado: ${manifest.status}`);
  }

  for (const asset of assets) {
    const label = asset.id ?? "(sin id)";
    if (asset.status !== "approved") {
      fail(`${label} no esta approved`);
    }
    if (asset.runtimeReady !== true) {
      fail(`${label} no esta runtimeReady`);
    }
    if (asset.source !== "chatgpt-images-photopea") {
      fail(`${label} no declara source chatgpt-images-photopea`);
    }
    if (!asset.png || !asset.webp) {
      fail(`${label} debe declarar png y webp`);
      continue;
    }

    const pngPath = path.join(assetRoot, asset.png);
    const webpPath = path.join(assetRoot, asset.webp);

    if (!existsSync(pngPath)) {
      fail(`${label} PNG faltante: ${asset.png}`);
    } else {
      const dimensions = readPngDimensions(pngPath);
      if (
        dimensions.width !== asset.expectedWidth ||
        dimensions.height !== asset.expectedHeight
      ) {
        fail(
          `${label} dimensiones PNG ${dimensions.width}x${dimensions.height}, esperadas ${asset.expectedWidth}x${asset.expectedHeight}`,
        );
      }
    }

    if (!existsSync(webpPath)) {
      fail(`${label} WebP faltante: ${asset.webp}`);
    } else if (statSync(webpPath).size <= 0) {
      fail(`${label} WebP vacio: ${asset.webp}`);
    }

    if (asset.frameCount) {
      const expectedSheetWidth = asset.frameCount * asset.frameWidth;
      if (asset.expectedWidth !== expectedSheetWidth) {
        fail(
          `${label} frameCount/frameWidth no coincide con expectedWidth (${asset.expectedWidth} vs ${expectedSheetWidth})`,
        );
      }
      if (asset.expectedHeight !== asset.frameHeight) {
        fail(`${label} frameHeight no coincide con expectedHeight`);
      }
    }
  }
}

const runtimeFiles = walkFiles(runtimeRoot);
for (const filePath of runtimeFiles) {
  const relative = path.relative(runtimeRoot, filePath);
  const fileName = path.basename(filePath);
  if (/\s/.test(fileName)) {
    fail(`Nombre con espacios en runtime: ${relative}`);
  }
  if (/\.psd$/i.test(fileName)) {
    fail(`PSD no permitido en runtime: ${relative}`);
  }
  if (forbiddenNamePattern.test(fileName)) {
    fail(`Nombre no permitido en runtime: ${relative}`);
  }
  if (!/\.(png|webp|md)$/i.test(fileName)) {
    fail(`Extension no permitida en runtime: ${relative}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(
  `Transition root assets OK: ${runtimeFiles.filter((file) => /\.(png|webp)$/i.test(file)).length} archivos runtime validados.`,
);
