import { readFile } from "node:fs/promises";
import path from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const statusDoc = await readFile(
  path.join("docs", "status", "CURRENT_STATE.md"),
  "utf8",
).catch(() => "Estado documental pendiente.");

console.log("GVO - Guia Virtual OKUA");
console.log(`Repositorio tecnico: ${packageJson.name}`);
console.log("Estado: FIELD DEPLOYMENT PREPARATION");
console.log(
  "Rutas base: /, /carga, /inicio, /portada, /estacion/1..5, /final, /qr/start, /qr/w2..w5",
);
console.log(
  "Scripts clave: dev, build, test, lint, check, status, audit:assets",
);
console.log("");
console.log(statusDoc.trim());
