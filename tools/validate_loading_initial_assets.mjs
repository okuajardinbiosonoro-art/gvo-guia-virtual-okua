import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const runtimeRoot = path.join(
  repoRoot,
  "public",
  "assets",
  "runtime",
  "loading-initial",
);
const sourceRoot =
  process.env.GVO_LOADING_SOURCE_ROOT ??
  path.resolve(repoRoot, "..", "GVO_archivos_iniciales", "carga_inicial_v2");

const expectedImages = [
  ["lia/lia_loading_16f.png", 2560, 2560],
  ["plant/plant_growth_4f.png", 3072, 768],
  ["water/water_flow_5f.png", 5120, 768],
  ["ground/ground_halo_01_orbital_ring.png", 960, 256],
];

const expectedSparkles = [
  "sparkles/sparkle_01_lilac_small.png",
  "sparkles/sparkle_02_amber_small.png",
  "sparkles/sparkle_03_lilac_medium.png",
  "sparkles/sparkle_04_micro_white.png",
];

const expectedJson = [
  {
    file: "lia/lia_loading_16f.json",
    asset_id: "lia_loading_16f",
    columns: 4,
    rows: 4,
    frame_width: 640,
    frame_height: 640,
    total_frames: 16,
    frame_order: Array.from({ length: 16 }, (_, index) => index + 1),
    source_count: 4,
  },
  {
    file: "plant/plant_growth_4f.json",
    asset_id: "plant_growth_4f",
    columns: 4,
    rows: 1,
    frame_width: 768,
    frame_height: 768,
    total_frames: 4,
    frame_order: [1, 2, 3, 4],
    source_count: 4,
  },
  {
    file: "water/water_flow_5f.json",
    asset_id: "water_flow_5f",
    columns: 5,
    rows: 1,
    frame_width: 1024,
    frame_height: 768,
    total_frames: 5,
    frame_order: [1, 2, 3, 4, 5],
    source_count: 5,
  },
];

function runtimePath(relativePath) {
  return path.join(runtimeRoot, relativePath);
}

async function assertFileExists(filePath) {
  const fileStat = await stat(filePath);

  if (!fileStat.isFile()) {
    throw new Error(`${filePath} no es archivo.`);
  }
}

async function assertVisibleAlpha(filePath, label, minimumPixels) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let visiblePixels = 0;

  for (let index = 3; index < data.length; index += info.channels) {
    if (data[index] > 8) {
      visiblePixels += 1;
    }
  }

  if (visiblePixels < minimumPixels) {
    throw new Error(`${label}: alpha visible insuficiente (${visiblePixels}).`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${expected}, recibido ${actual}`);
  }
}

function assertArrayEqual(actual, expected, label) {
  if (
    !Array.isArray(actual) ||
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    throw new Error(`${label}: orden inesperado.`);
  }
}

for (const [relativePath, width, height] of expectedImages) {
  const filePath = runtimePath(relativePath);
  await assertFileExists(filePath);
  const metadata = await sharp(filePath).metadata();

  assertEqual(metadata.width, width, `${relativePath} width`);
  assertEqual(metadata.height, height, `${relativePath} height`);
  assertEqual(metadata.format, "png", `${relativePath} formato`);
  await assertVisibleAlpha(filePath, relativePath, 1000);
}

for (const relativePath of expectedSparkles) {
  const filePath = runtimePath(relativePath);
  await assertFileExists(filePath);
  const metadata = await sharp(filePath).metadata();

  assertEqual(metadata.format, "png", `${relativePath} formato`);

  if (metadata.width > 240 || metadata.height > 240) {
    throw new Error(`${relativePath}: sparkle excede 240px.`);
  }

  await assertVisibleAlpha(filePath, relativePath, 20);
}

for (const expected of expectedJson) {
  const filePath = runtimePath(expected.file);
  await assertFileExists(filePath);
  const content = JSON.parse(await readFile(filePath, "utf8"));

  for (const field of [
    "asset_id",
    "columns",
    "rows",
    "frame_width",
    "frame_height",
    "total_frames",
  ]) {
    assertEqual(content[field], expected[field], `${expected.file} ${field}`);
  }

  assertArrayEqual(
    content.frame_order,
    expected.frame_order,
    `${expected.file} frame_order`,
  );

  if (!Array.isArray(content.source_files)) {
    throw new Error(`${expected.file}: source_files debe ser array.`);
  }

  assertEqual(
    content.source_files.length,
    expected.source_count,
    `${expected.file} source_files`,
  );

  for (const sourceFile of content.source_files) {
    if (/portada|estacion|final|transicion/i.test(sourceFile)) {
      throw new Error(
        `${expected.file}: source fuera de alcance ${sourceFile}`,
      );
    }

    await assertFileExists(path.join(sourceRoot, sourceFile));
  }
}

const screenFiles = [
  "src/screens/LoadingInitial/LoadingInitialScreen.tsx",
  "src/screens/LoadingInitial/loadingInitialAssets.ts",
  "src/screens/LoadingInitial/loadingInitialCopy.ts",
];

for (const relativePath of screenFiles) {
  const content = await readFile(path.join(repoRoot, relativePath), "utf8");
  const rejectedCopyParts = ["Lía cuida", "planta joven", "mientras se"];

  if (rejectedCopyParts.every((part) => content.includes(part))) {
    throw new Error(`${relativePath}: contiene texto largo rechazado.`);
  }

  if (/loading-initial-pre-portada\.png/i.test(content)) {
    throw new Error(`${relativePath}: usa asset crudo pre-portada.`);
  }
}

console.log("Validacion de assets runtime de carga inicial OK.");
