import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const sourceRoot =
  process.env.GVO_LOADING_SOURCE_ROOT ??
  path.resolve(repoRoot, "..", "GVO_archivos_iniciales", "carga_inicial_v2");
const runtimeRoot = path.join(
  repoRoot,
  "public",
  "assets",
  "runtime",
  "loading-initial",
);
const referenceTarget = path.join(
  repoRoot,
  "assets",
  "reference",
  "screens",
  "loading-initial",
  "loading_initial_master_reference_v2.png",
);

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const pngOptions = { compressionLevel: 9, adaptiveFiltering: false };

const sourceFiles = {
  reference: "02_aprobadas/reference/loading_initial_master_reference_v2.png",
  liaRows: [
    "03_sprites_editables/lia_anim_rows/lia_anim_row_01_entry_idle_4frames.png",
    "03_sprites_editables/lia_anim_rows/lia_anim_row_02_prepare_watering_4frames.png",
    "03_sprites_editables/lia_anim_rows/lia_anim_row_03_watering_motion_4frames.png",
    "03_sprites_editables/lia_anim_rows/lia_anim_row_04_observe_glow_4frames.png",
  ],
  plant: [
    "02_aprobadas/plant/plant_state_01_brote_minimo.png",
    "02_aprobadas/plant/plant_state_02_dos_hojas.png",
    "02_aprobadas/plant/plant_state_03_crecimiento_sutil.png",
    "02_aprobadas/plant/plant_state_04_plantita_sana.png",
  ],
  water: [
    "02_aprobadas/water/water_flow_01_start.png",
    "02_aprobadas/water/water_flow_02_soft_arc.png",
    "02_aprobadas/water/water_flow_03_medium_arc.png",
    "02_aprobadas/water/water_flow_04_full_arc.png",
    "02_aprobadas/water/water_flow_05_taper_end.png",
  ],
  sparkles: [
    "02_aprobadas/sparkles/sparkle_01_lilac_small.png",
    "02_aprobadas/sparkles/sparkle_02_amber_small.png",
    "02_aprobadas/sparkles/sparkle_03_lilac_medium.png",
    "02_aprobadas/sparkles/sparkle_04_micro_white.png",
  ],
  ground: "02_aprobadas/ground/ground_halo_01_orbital_ring.png",
};

function sourcePath(relativePath) {
  return path.join(sourceRoot, relativePath);
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function assertFileExists(filePath, label) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      throw new Error(`${label} no es un archivo`);
    }
  } catch (error) {
    throw new Error(`${label} no encontrado: ${filePath}`, { cause: error });
  }
}

async function assertSourcesExist() {
  try {
    const rootStat = await stat(sourceRoot);
    if (!rootStat.isDirectory()) {
      throw new Error("La ruta existe pero no es carpeta.");
    }
  } catch (error) {
    console.error("BLOCKED_LOCAL_ASSET_SOURCE_MISSING");
    console.error(`No existe la carpeta fuente: ${sourceRoot}`);
    throw error;
  }

  const required = [
    sourceFiles.reference,
    ...sourceFiles.liaRows,
    ...sourceFiles.plant,
    ...sourceFiles.water,
    ...sourceFiles.sparkles,
    sourceFiles.ground,
  ];

  for (const relativePath of required) {
    await assertFileExists(sourcePath(relativePath), relativePath);
  }
}

async function ensureOutputDirs() {
  await Promise.all([
    mkdir(path.join(runtimeRoot, "lia"), { recursive: true }),
    mkdir(path.join(runtimeRoot, "plant"), { recursive: true }),
    mkdir(path.join(runtimeRoot, "water"), { recursive: true }),
    mkdir(path.join(runtimeRoot, "sparkles"), { recursive: true }),
    mkdir(path.join(runtimeRoot, "ground"), { recursive: true }),
    mkdir(path.dirname(referenceTarget), { recursive: true }),
  ]);
}

async function alphaBounds(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const alpha = data[(y * info.width + x) * info.channels + 3];

      if (alpha > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return null;
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    sourceWidth: info.width,
    sourceHeight: info.height,
  };
}

function paddedBounds(bounds, padding) {
  const left = Math.max(0, bounds.left - padding);
  const top = Math.max(0, bounds.top - padding);
  const right = Math.min(
    bounds.sourceWidth,
    bounds.left + bounds.width + padding,
  );
  const bottom = Math.min(
    bounds.sourceHeight,
    bounds.top + bounds.height + padding,
  );

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  };
}

function createTransparentCanvas(width, height) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: transparent,
    },
  });
}

async function renderTrimmedToCanvas(
  inputBuffer,
  {
    width,
    height,
    maxWidth,
    maxHeight,
    padding = 24,
    anchor = "center",
    bottomPadding = 0,
  },
) {
  const bounds = await alphaBounds(inputBuffer);

  if (!bounds) {
    return createTransparentCanvas(width, height).png(pngOptions).toBuffer();
  }

  const crop = paddedBounds(bounds, padding);
  const resized = await sharp(inputBuffer)
    .extract(crop)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      kernel: sharp.kernel.nearest,
      withoutEnlargement: false,
    })
    .png(pngOptions)
    .toBuffer();
  const resizedMeta = await sharp(resized).metadata();

  const left = Math.round((width - resizedMeta.width) / 2);
  const top =
    anchor === "bottom"
      ? Math.round(height - resizedMeta.height - bottomPadding)
      : Math.round((height - resizedMeta.height) / 2);

  return createTransparentCanvas(width, height)
    .composite([{ input: resized, left, top: Math.max(0, top) }])
    .png(pngOptions)
    .toBuffer();
}

async function writeSpriteSheet(frames, { columns, rows, cell, output }) {
  const sheet = createTransparentCanvas(
    columns * cell.width,
    rows * cell.height,
  );
  const composites = frames.map((input, index) => ({
    input,
    left: (index % columns) * cell.width,
    top: Math.floor(index / columns) * cell.height,
  }));

  await sheet.composite(composites).png(pngOptions).toFile(output);
}

async function writeJson(output, data) {
  await writeFile(
    `${output}.json`,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

async function buildLia() {
  const cell = { width: 640, height: 640 };
  const frames = [];

  for (const rowFile of sourceFiles.liaRows) {
    const rowPath = sourcePath(rowFile);
    const rowMeta = await sharp(rowPath).metadata();

    for (let frameIndex = 0; frameIndex < 4; frameIndex += 1) {
      const left = Math.round((frameIndex * rowMeta.width) / 4);
      const right = Math.round(((frameIndex + 1) * rowMeta.width) / 4);
      const frameBuffer = await sharp(rowPath)
        .extract({
          left,
          top: 0,
          width: right - left,
          height: rowMeta.height,
        })
        .ensureAlpha()
        .png(pngOptions)
        .toBuffer();

      frames.push(
        await renderTrimmedToCanvas(frameBuffer, {
          ...cell,
          maxWidth: 528,
          maxHeight: 528,
          padding: 30,
          anchor: "bottom",
          bottomPadding: 54,
        }),
      );
    }
  }

  const output = path.join(runtimeRoot, "lia", "lia_loading_16f.png");
  await writeSpriteSheet(frames, { columns: 4, rows: 4, cell, output });
  await writeJson(path.join(runtimeRoot, "lia", "lia_loading_16f"), {
    asset_id: "lia_loading_16f",
    columns: 4,
    rows: 4,
    frame_width: cell.width,
    frame_height: cell.height,
    total_frames: 16,
    frame_order: Array.from({ length: 16 }, (_, index) => index + 1),
    source_files: sourceFiles.liaRows.map(toPosix),
  });
}

async function renderFullCanvasToCell(inputPath, cell) {
  return sharp(inputPath)
    .ensureAlpha()
    .resize({
      width: cell.width,
      height: cell.height,
      fit: "contain",
      background: transparent,
      kernel: sharp.kernel.nearest,
    })
    .png(pngOptions)
    .toBuffer();
}

async function buildPlant() {
  const cell = { width: 768, height: 768 };
  const frames = await Promise.all(
    sourceFiles.plant.map((relativePath) =>
      renderFullCanvasToCell(sourcePath(relativePath), cell),
    ),
  );
  const output = path.join(runtimeRoot, "plant", "plant_growth_4f.png");

  await writeSpriteSheet(frames, { columns: 4, rows: 1, cell, output });
  await writeJson(path.join(runtimeRoot, "plant", "plant_growth_4f"), {
    asset_id: "plant_growth_4f",
    columns: 4,
    rows: 1,
    frame_width: cell.width,
    frame_height: cell.height,
    total_frames: 4,
    frame_order: [1, 2, 3, 4],
    source_files: sourceFiles.plant.map(toPosix),
  });
}

async function buildWater() {
  const cell = { width: 1024, height: 768 };
  const frames = await Promise.all(
    sourceFiles.water.map((relativePath) =>
      renderFullCanvasToCell(sourcePath(relativePath), cell),
    ),
  );
  const output = path.join(runtimeRoot, "water", "water_flow_5f.png");

  await writeSpriteSheet(frames, { columns: 5, rows: 1, cell, output });
  await writeJson(path.join(runtimeRoot, "water", "water_flow_5f"), {
    asset_id: "water_flow_5f",
    columns: 5,
    rows: 1,
    frame_width: cell.width,
    frame_height: cell.height,
    total_frames: 5,
    frame_order: [1, 2, 3, 4, 5],
    source_files: sourceFiles.water.map(toPosix),
  });
}

async function writeTrimmedPng(relativePath, outputPath, maxSize) {
  const input = await sharp(sourcePath(relativePath))
    .ensureAlpha()
    .png(pngOptions)
    .toBuffer();
  const bounds = await alphaBounds(input);

  if (!bounds) {
    await createTransparentCanvas(maxSize.width, maxSize.height)
      .png(pngOptions)
      .toFile(outputPath);
    return;
  }

  const crop = paddedBounds(
    bounds,
    Math.round(Math.max(bounds.width, bounds.height) * 0.12),
  );

  await sharp(input)
    .extract(crop)
    .resize({
      width: maxSize.width,
      height: maxSize.height,
      fit: "inside",
      kernel: sharp.kernel.nearest,
      withoutEnlargement: true,
    })
    .png(pngOptions)
    .toFile(outputPath);
}

async function buildSparkles() {
  for (const relativePath of sourceFiles.sparkles) {
    const outputPath = path.join(
      runtimeRoot,
      "sparkles",
      path.basename(relativePath),
    );
    await writeTrimmedPng(relativePath, outputPath, {
      width: 240,
      height: 240,
    });
  }
}

async function buildGround() {
  const input = await sharp(sourcePath(sourceFiles.ground))
    .ensureAlpha()
    .png(pngOptions)
    .toBuffer();
  const output = await renderTrimmedToCanvas(input, {
    width: 960,
    height: 256,
    maxWidth: 900,
    maxHeight: 190,
    padding: 34,
    anchor: "center",
  });

  await sharp(output)
    .png(pngOptions)
    .toFile(
      path.join(runtimeRoot, "ground", "ground_halo_01_orbital_ring.png"),
    );
}

async function copyReference() {
  await sharp(sourcePath(sourceFiles.reference))
    .png(pngOptions)
    .toFile(referenceTarget);
}

await assertSourcesExist();
await ensureOutputDirs();
await copyReference();
await buildLia();
await buildPlant();
await buildWater();
await buildSparkles();
await buildGround();

console.log("Assets runtime de carga inicial normalizados correctamente.");
console.log(`Fuente: ${sourceRoot}`);
console.log(`Salida: ${runtimeRoot}`);
