import { Buffer } from "node:buffer";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const manifestPath = path.join(
  "public",
  "assets",
  "runtime",
  "cover-intro",
  "manifest.json",
);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const warningSizeBytes = 3 * 1024 * 1024;
const errorSizeBytes = 8 * 1024 * 1024;

function collectAssetPaths(value, paths = new Set()) {
  if (typeof value === "string") {
    if (value.startsWith("/assets/")) {
      paths.add(value);
    }

    return paths;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectAssetPaths(item, paths);
    }

    return paths;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectAssetPaths(item, paths);
    }
  }

  return paths;
}

function toLocalPath(webPath) {
  return path.join("public", webPath.replace(/^\/+/, ""));
}

function readPngDimensions(buffer) {
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(pngSignature)) {
    throw new Error("no es PNG valido");
  }

  const chunkType = buffer.subarray(12, 16).toString("ascii");
  if (chunkType !== "IHDR") {
    throw new Error("PNG sin cabecera IHDR");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

const findings = [];
const warnings = [];
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const assetPaths = [...collectAssetPaths(manifest)].sort();

console.log(`Validando assets de Portada / Intro: ${assetPaths.length} rutas`);

for (const webPath of assetPaths) {
  const localPath = toLocalPath(webPath);

  if (path.extname(localPath).toLowerCase() !== ".png") {
    findings.push(`${webPath}: no es PNG`);
    continue;
  }

  try {
    const [buffer, fileStat] = await Promise.all([
      readFile(localPath),
      stat(localPath),
    ]);
    const dimensions = readPngDimensions(buffer);
    const sizeMb = fileStat.size / 1024 / 1024;

    if (fileStat.size > errorSizeBytes) {
      findings.push(
        `${webPath}: pesa ${sizeMb.toFixed(2)} MB, supera el maximo de 8 MB`,
      );
    } else if (fileStat.size > warningSizeBytes) {
      warnings.push(
        `${webPath}: pesa ${sizeMb.toFixed(2)} MB, revisar antes de runtime final`,
      );
    }

    console.log(
      `OK ${webPath} - ${dimensions.width}x${dimensions.height} - ${fileStat.size} bytes`,
    );
  } catch (error) {
    findings.push(`${webPath}: ${error.message}`);
  }
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (findings.length > 0) {
  console.error("Validacion de assets de Portada / Intro fallida:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Validacion de assets de Portada / Intro OK.");
