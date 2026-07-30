/* global Buffer */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("docs/visual/world5/st5-020g");

async function makeSheet(viewport) {
  const files = (await fs.readdir(dir))
    .filter((file) => file.startsWith(`${viewport}_`) && file.endsWith(".png"))
    .sort();
  const [viewportWidth, viewportHeight] = viewport.split("x").map(Number);
  const landscape = viewportWidth > viewportHeight;
  const columns = landscape ? 4 : 5;
  const thumbnailWidth = landscape ? 260 : 220;
  const thumbnailHeight = landscape ? 160 : 300;
  const cellWidth = thumbnailWidth + 10;
  const cellHeight = thumbnailHeight + 40;
  const layers = [];
  for (let index = 0; index < files.length; index += 1) {
    const image = await sharp(path.join(dir, files[index]))
      .resize({ width: thumbnailWidth, height: thumbnailHeight, fit: "inside" })
      .png()
      .toBuffer();
    layers.push({ input: image, left: (index % columns) * cellWidth + 5, top: Math.floor(index / columns) * cellHeight + 34 });
    layers.push({
      input: Buffer.from(`<svg width="${cellWidth}" height="30"><rect width="100%" height="100%" fill="#24362d"/><text x="6" y="20" fill="white" font-family="Arial" font-size="11">${files[index].replace(`${viewport}_`, "").replace(".png", "")}</text></svg>`),
      left: (index % columns) * cellWidth,
      top: Math.floor(index / columns) * cellHeight,
    });
  }
  const width = columns * cellWidth;
  const height = Math.ceil(files.length / columns) * cellHeight;
  await sharp({ create: { width, height, channels: 3, background: "#f4ecdc" } })
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

async function overlayVisitor(viewport, scene) {
  const metrics = JSON.parse(await fs.readFile(path.join(dir, "metrics.json"), "utf8"));
  const metric = metrics.find((entry) => entry.viewport.name === viewport && entry.scene === scene);
  const source = path.join(dir, `${viewport}_${scene}.png`);
  const metadata = await sharp(source).metadata();
  const { socket, visitorAlpha, visitorAnchor, expectedAnchor } = metric.boxes;
  const overlay = Buffer.from(`<svg width="${metadata.width}" height="${metadata.height}"><g fill="none" stroke-width="2"><rect x="${socket.left}" y="${socket.top}" width="${socket.width}" height="${socket.height}" stroke="#d32f2f"/><rect x="${visitorAlpha.left}" y="${visitorAlpha.top}" width="${visitorAlpha.width}" height="${visitorAlpha.height}" stroke="#2e7d32"/><circle cx="${visitorAnchor.x}" cy="${visitorAnchor.y}" r="5" stroke="#1565c0"/><circle cx="${expectedAnchor.x}" cy="${expectedAnchor.y}" r="2" stroke="#ff8f00"/></g><g font-family="Arial" font-size="12" font-weight="700"><text x="10" y="18" fill="#d32f2f">socket aprobado</text><text x="10" y="34" fill="#2e7d32">bbox alfa Visitante</text><text x="10" y="50" fill="#1565c0">ancla proyectada / objetivo</text></g></svg>`);
  await sharp(source).composite([{ input: overlay, left: 0, top: 0 }]).png().toFile(path.join(dir, `qa_${viewport}_visitor_socket_overlay.png`));
}

await makeSheet("375x667");
await makeSheet("667x375");
for (const viewport of ["375x667", "667x375"]) {
  await compare(path.resolve(`docs/visual/world5/st5-020f/${viewport}_04_overview_after_space.png`), path.join(dir, `${viewport}_01_overview_visitor_available.png`), `comparison_020f_020g_overview_${viewport}.jpg`, ["020F 3/4", "020G Visitante disponible"]);
  await compare(path.resolve(`docs/visual/world5/st5-020f/${viewport}_05_plants_intro.png`), path.join(dir, `${viewport}_06_plants_intro.png`), `comparison_020f_020g_plants_${viewport}.jpg`, ["020F Plantas", "020G Plantas"]);
  await compare(path.resolve(`docs/visual/world5/st5-020f/${viewport}_07_system_intro.png`), path.join(dir, `${viewport}_08_system_intro.png`), `comparison_020f_020g_system_${viewport}.jpg`, ["020F Sistema", "020G Sistema"]);
  await compare(path.resolve(`docs/visual/world5/st5-020f/${viewport}_02_space_intro.png`), path.join(dir, `${viewport}_10_space_intro.png`), `comparison_020f_020g_space_${viewport}.jpg`, ["020F Espacio", "020G Espacio"]);
}
await overlayVisitor("375x667", "02_visitor_intro");
await overlayVisitor("667x375", "02_visitor_intro");
