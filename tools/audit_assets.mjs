import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["src", "public", "assets"];
const forbiddenPatterns = [
  {
    name: "URL externa",
    pattern: /https?:\/\/(?!www\.w3\.org\/2000\/svg)/i,
  },
  {
    name: "CDN",
    pattern: /\bcdn\./i,
  },
  {
    name: "Etiqueta audio",
    pattern: /<audio\b/i,
  },
  {
    name: "API de audio",
    pattern: /\b(new Audio|AudioContext|webkitAudioContext)\b/,
  },
];

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const findings = [];

for (const root of roots) {
  const files = await collectFiles(root);

  for (const file of files) {
    const content = await readFile(file, "utf8");

    for (const forbiddenPattern of forbiddenPatterns) {
      if (forbiddenPattern.pattern.test(content)) {
        findings.push(`${file}: ${forbiddenPattern.name}`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error("Auditoria de assets fallida:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Auditoria de assets OK: sin URLs externas, CDN ni uso de audio.");
