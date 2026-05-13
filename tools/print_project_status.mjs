import { readFile } from "node:fs/promises";
import path from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const statusDoc = await readFile(
  path.join("docs", "status", "ESTADO_ACTUAL_PROYECTO.md"),
  "utf8",
).catch(() => "Estado documental pendiente.");

console.log("GVO - Guia Virtual OKUA");
console.log(`Repositorio tecnico: ${packageJson.name}`);
console.log("Estado: repositorio base tecnico");
console.log(
  "Rutas base: /, /carga, /portada, /estacion/1..5, /final, /qr/:stationId",
);
console.log(
  "Scripts clave: dev, build, test, lint, check, status, audit:assets",
);
console.log("");
console.log(statusDoc.trim());
