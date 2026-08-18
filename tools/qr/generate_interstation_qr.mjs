import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import QRCode from "qrcode";

const require = createRequire(import.meta.url);
const qrcodeVersion = require("qrcode/package.json").version;
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outputDirectory = join(repositoryRoot, "docs/assets/qr/interstation");

const qrDefinitions = [
  { stem: "gvo_qr_world1_to_world2_v01", payload: "/qr/w2" },
  { stem: "gvo_qr_world2_to_world3_v01", payload: "/qr/w3" },
  { stem: "gvo_qr_world3_to_world4_v01", payload: "/qr/w4" },
  { stem: "gvo_qr_world4_to_world5_v01", payload: "/qr/w5" },
];

const options = {
  color: { dark: "#000000ff", light: "#ffffffff" },
  errorCorrectionLevel: "H",
  margin: 4,
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

const files = [];
for (const definition of qrDefinitions) {
  const svgFilename = `${definition.stem}.svg`;
  const pngFilename = `${definition.stem}.png`;
  const svgPath = join(outputDirectory, svgFilename);
  const pngPath = join(outputDirectory, pngFilename);

  const svg = await QRCode.toString(definition.payload, {
    ...options,
    type: "svg",
  });
  await writeFile(svgPath, svg, "utf8");
  await QRCode.toFile(pngPath, definition.payload, {
    ...options,
    type: "png",
    width: 2048,
  });

  const svgBytes = await readFile(svgPath);
  const pngBytes = await readFile(pngPath);
  files.push(
    {
      dimensions: "vector",
      ecc: "H",
      filename: svgFilename,
      format: "svg",
      marginModules: 4,
      payload: definition.payload,
      sha256: sha256(svgBytes),
    },
    {
      dimensions: "2048x2048",
      ecc: "H",
      filename: pngFilename,
      format: "png",
      marginModules: 4,
      payload: definition.payload,
      sha256: sha256(pngBytes),
    },
  );
}

const manifest = {
  contract: "GVO_DEBT_015_INTERSTATION_QR_V01",
  generator: { package: "qrcode", version: qrcodeVersion },
  files,
};
await writeFile(
  join(outputDirectory, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

const readme = `# QR físicos entre estaciones

Paquete reproducible de GVO_DEBT_015. Contiene exclusivamente los cuatro tokens host-independent del recorrido normal:

| Origen | Destino | Payload |
| --- | --- | --- |
| Mundo I | Mundo II | \`/qr/w2\` |
| Mundo II | Mundo III | \`/qr/w3\` |
| Mundo III | Mundo IV | \`/qr/w4\` |
| Mundo IV | Mundo V | \`/qr/w5\` |

Cada SVG es el master vectorial. Cada PNG es 2048×2048, negro sobre blanco opaco, ECC H y margen de cuatro módulos. No contienen logo, decoración, URL absoluta, IP, hostname, Wi-Fi ni \`/qr/start\`.

Regenerar desde la raíz del repositorio:

\`\`\`text
node tools/qr/generate_interstation_qr.mjs
node tools/qa/gvo_debt_015_verify_interstation_qr.mjs
\`\`\`

Estos archivos son material físico/documental y no se cargan en runtime; por ello no pertenecen a \`public/assets/gvo/current-used/<pantalla>/\`.
`;
await writeFile(join(outputDirectory, "README.md"), readme, "utf8");

console.log(`GVO_DEBT_015_QR_GENERATED count=${files.length}`);
