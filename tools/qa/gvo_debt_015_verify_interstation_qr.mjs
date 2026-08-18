import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BinaryBitmap,
  HybridBinarizer,
  QRCodeReader,
  RGBLuminanceSource,
} from "@zxing/library";
import sharp from "sharp";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const qrDirectory = join(repositoryRoot, "docs/assets/qr/interstation");
const definitions = [
  { stem: "gvo_qr_world1_to_world2_v01", payload: "/qr/w2" },
  { stem: "gvo_qr_world2_to_world3_v01", payload: "/qr/w3" },
  { stem: "gvo_qr_world3_to_world4_v01", payload: "/qr/w4" },
  { stem: "gvo_qr_world4_to_world5_v01", payload: "/qr/w5" },
];
const expectedFiles = [
  ...definitions.flatMap(({ stem }) => [`${stem}.png`, `${stem}.svg`]),
  "README.md",
  "manifest.json",
].sort();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function decodeQr(input) {
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const source = new RGBLuminanceSource(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
  );
  return new QRCodeReader()
    .decode(new BinaryBitmap(new HybridBinarizer(source)))
    .getText();
}

const actualFiles = (await readdir(qrDirectory)).sort();
assert(
  JSON.stringify(actualFiles) === JSON.stringify(expectedFiles),
  `Inventario inesperado: ${actualFiles.join(", ")}`,
);

const manifest = JSON.parse(
  await readFile(join(qrDirectory, "manifest.json"), "utf8"),
);
assert(
  manifest.contract === "GVO_DEBT_015_INTERSTATION_QR_V01",
  "Contrato de manifest inválido",
);
assert(manifest.generator?.package === "qrcode", "Generador no registrado");
assert(
  typeof manifest.generator?.version === "string",
  "Versión de generador ausente",
);
assert(
  Array.isArray(manifest.files) && manifest.files.length === 8,
  "Manifest debe registrar ocho outputs",
);

const decodedPayloads = new Set();
const pngHashes = new Set();
const svgHashes = new Set();
for (const definition of definitions) {
  assert(
    !/^(?:https?:|wifi:|WIFI:|\/\/)/.test(definition.payload) &&
      !/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(definition.payload) &&
      !/(?:localhost|\.local|\/qr\/start)/i.test(definition.payload),
    `Payload prohibido: ${definition.payload}`,
  );

  for (const format of ["png", "svg"]) {
    const filename = `${definition.stem}.${format}`;
    const path = join(qrDirectory, filename);
    const bytes = await readFile(path);
    const record = manifest.files.find((item) => item.filename === filename);
    assert(record, `Falta registro manifest: ${filename}`);
    assert(
      record.payload === definition.payload,
      `Payload manifest inválido: ${filename}`,
    );
    assert(record.ecc === "H", `ECC inválido: ${filename}`);
    assert(record.marginModules >= 4, `Quiet zone insuficiente: ${filename}`);
    assert(record.sha256 === sha256(bytes), `SHA-256 inválido: ${filename}`);

    const decoded = await decodeQr(bytes);
    assert(
      decoded === definition.payload,
      `Decode inválido ${filename}: ${decoded}`,
    );
    decodedPayloads.add(decoded);

    if (format === "png") {
      const metadata = await sharp(bytes).metadata();
      assert(
        metadata.width === 2048 && metadata.height === 2048,
        `Dimensiones PNG inválidas: ${filename}`,
      );
      const { data } = await sharp(bytes)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];
        const alpha = data[index + 3];
        assert(alpha === 255, `PNG no opaco: ${filename}`);
        assert(
          red === green && green === blue && (red === 0 || red === 255),
          `PNG no binario B/N: ${filename}`,
        );
      }
      pngHashes.add(record.sha256);
    } else {
      const svg = bytes.toString("utf8");
      assert(
        !/<(?:image|script|foreignObject)\b/i.test(svg),
        `SVG contiene elemento prohibido: ${filename}`,
      );
      assert(
        /shape-rendering="crispEdges"/.test(svg),
        `SVG sin render binario: ${filename}`,
      );
      svgHashes.add(record.sha256);
    }
  }
}

assert(
  decodedPayloads.size === 4,
  "Los payloads decodificados deben ser distintos",
);
assert(pngHashes.size === 4, "Los cuatro PNG deben ser distintos");
assert(svgHashes.size === 4, "Los cuatro SVG deben ser distintos");

console.log(
  "GVO_DEBT_015_INTERSTATION_QR_VERIFY_PASS svg=4 png=4 decoded=8 dimensions=2048x2048 ecc=H margin=4",
);
