/* global Buffer */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("docs/visual/world5/st5-020f");

async function makeSheet(viewport) {
  const files = (await fs.readdir(dir))
    .filter((file) => file.startsWith(`${viewport}_`) && file.endsWith(".png"))
    .sort();
  const layers = [];
  for (let index = 0; index < files.length; index += 1) {
    const image = await sharp(path.join(dir, files[index]))
      .resize({ width: 220, height: 300, fit: "inside" })
      .png()
      .toBuffer();
    layers.push({ input: image, left: (index % 5) * 230 + 5, top: Math.floor(index / 5) * 340 + 34 });
    layers.push({
      input: Buffer.from(`<svg width="230" height="30"><rect width="100%" height="100%" fill="#24362d"/><text x="6" y="20" fill="white" font-family="Arial" font-size="11">${files[index].replace(`${viewport}_`, "").replace(".png", "")}</text></svg>`),
      left: (index % 5) * 230,
      top: Math.floor(index / 5) * 340,
    });
  }
  await sharp({ create: { width: 1150, height: 680, channels: 3, background: "#f4ecdc" } })
    .composite(layers)
    .jpeg({ quality: 90 })
    .toFile(path.join(dir, `contact_sheet_${viewport}.jpg`));
}

async function compare(leftFile, rightFile, output, labels) {
  const height = 667;
  const left = await sharp(leftFile).resize({ height, fit: "inside" }).png().toBuffer();
  const right = await sharp(rightFile).resize({ height, fit: "inside" }).png().toBuffer();
  const leftMeta = await sharp(left).metadata();
  const rightMeta = await sharp(right).metadata();
  const gap = 16;
  const header = 32;
  const width = (leftMeta.width ?? 0) + (rightMeta.width ?? 0) + gap;
  const label = Buffer.from(`<svg width="${width}" height="${header}"><rect width="100%" height="100%" fill="#24362d"/><text x="8" y="22" fill="white" font-family="Arial" font-size="13">${labels[0]}</text><text x="${(leftMeta.width ?? 0) + gap + 8}" y="22" fill="white" font-family="Arial" font-size="13">${labels[1]}</text></svg>`);
  await sharp({ create: { width, height: height + header, channels: 3, background: "#f4ecdc" } })
    .composite([{ input: label, left: 0, top: 0 }, { input: left, left: 0, top: header }, { input: right, left: (leftMeta.width ?? 0) + gap, top: header }])
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, output));
}

async function overlaySpace(viewport, scene) {
  const metrics = JSON.parse(await fs.readFile(path.join(dir, "metrics.json"), "utf8"));
  const metric = metrics.find((entry) => entry.viewport.name === viewport && entry.scene === scene);
  const source = path.join(dir, `${viewport}_${scene}.png`);
  const metadata = await sharp(source).metadata();
  const { socket, spaceAlpha } = metric.boxes;
  const overlay = Buffer.from(`<svg width="${metadata.width}" height="${metadata.height}"><g fill="none" stroke-width="2"><rect x="${socket.left}" y="${socket.top}" width="${socket.width}" height="${socket.height}" stroke="#d32f2f"/><rect x="${spaceAlpha.left}" y="${spaceAlpha.top}" width="${spaceAlpha.width}" height="${spaceAlpha.height}" stroke="#2e7d32"/></g><g font-family="Arial" font-size="12" font-weight="700"><text x="10" y="18" fill="#d32f2f">socket aprobado</text><text x="10" y="34" fill="#2e7d32">bbox alfa del recorrido</text></g></svg>`);
  await sharp(source).composite([{ input: overlay, left: 0, top: 0 }]).png().toFile(path.join(dir, `qa_${viewport}_space_socket_overlay.png`));
}

await makeSheet("375x667");
await makeSheet("667x375");
await compare("C:/Users/JOSE DAVID/AppData/Local/Temp/st5-020f-baseline/667x375_plantas.png", path.join(dir, "667x375_05_plants_intro.png"), "comparison_020e_020f_plants_667x375.jpg", ["020E baseline", "020F rail corregido"]);
await compare("C:/Users/JOSE DAVID/AppData/Local/Temp/st5-020f-baseline/667x375_sistema.png", path.join(dir, "667x375_07_system_intro.png"), "comparison_020e_020f_system_667x375.jpg", ["020E baseline", "020F rail corregido"]);
await compare(path.resolve("docs/visual/world5/st5-020e/844x390_05_overview_after_system.png"), path.join(dir, "844x390_01_overview_space_available.png"), "comparison_020e_020f_overview_844x390.jpg", ["020E overview", "020F overview"]);
await overlaySpace("375x667", "02_space_intro");
await overlaySpace("667x375", "02_space_intro");
