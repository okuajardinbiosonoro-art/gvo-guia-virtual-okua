import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const roots = ["src", "public", "assets"];
const binaryAssetExtensions = new Set([
  ".aac",
  ".avif",
  ".flac",
  ".gif",
  ".jpeg",
  ".jpg",
  ".m4a",
  ".mp3",
  ".ogg",
  ".opus",
  ".png",
  ".wav",
  ".webp",
  ".woff",
  ".woff2",
]);
const forbiddenPatterns = [
  {
    name: "URL externa",
    pattern: /https?:\/\/(?!www\.w3\.org\/2000\/svg)/i,
  },
  {
    name: "CDN",
    pattern: /\bcdn\./i,
  },
];

const documentaryImagesThread = "gvo-provenance:images-1";
const documentaryThreadManifests = new Map([
  "public/assets/gvo/current-used/world-3-root/lia/clips/INTRO-pilot-manifest.json",
  "public/assets/gvo/current-used/world-3-root/lia/clips/OBS03-clips-manifest.json",
  "public/assets/gvo/current-used/world-4-root/objects/OBS03-seven-manifest.json",
  "public/assets/gvo/current-used/world-5-root/options/OBS03-six-manifest.json",
  "public/assets/gvo/current-used/world-5-root/system/OBS03-cleanplates-manifest.json",
].map((file) => [file, documentaryImagesThread]));
documentaryThreadManifests.set(
  "public/assets/gvo/current-used/world-3-root/editorial-2026-11-11.json",
  "gvo-provenance:images-2",
);

export function externalResourceScanContent(file, content) {
  const normalized = file.replaceAll("\\", "/");
  if (normalized === "src/shared/assets/assetPreloader.ts") {
    // Exact SSR-only URL-parser base, never a fetch URL. Preserve all other
    // occurrences and any changed conditional for the ordinary URL audit.
    const fallback = 'const origin = typeof window === "undefined" ? "http://gvo.invalid" : window.location.origin;';
    return content.replace(fallback, fallback.replace('"http://gvo.invalid"', '"[SSR parser base]"'));
  }
  const picoPath = "final-root/photo/tracking/pico.module.js";
  if (normalized === `public/assets/gvo/stations/${picoPath}` || normalized === `public/assets/gvo/current-used/${picoPath}`) {
    // The vendored first-line comment attributes the license and cannot load a URL.
    return content.replace(/^\/\* This library is released under the MIT license, see https:\/\/github\.com\/nenadmarkus\/picojs \*\//, "");
  }
  if (normalized === "public/assets/gvo/current-used/final-root/photo/tracking/manifest.json") {
    JSON.parse(content);
    return content
      .replace(/^  "picojs_source": "https:\/\/github\.com\/nenadmarkus\/picojs",$/m, "")
      .replace(/^  "cascade_source": "https:\/\/github\.com\/nenadmarkus\/pico\/tree\/7d550c78b2c31a4e1dfc5bcdfe9da013297b5cc8\/rnt\/cascades",$/m, "");
  }
  const legacyGenerated = normalized === "public/assets/gvo/current-used/world-3-root/integration-2026-10-23.json";
  const allowedThread = legacyGenerated ? documentaryImagesThread : documentaryThreadManifests.get(normalized);
  if (!allowedThread) return content;
  JSON.parse(content); // Malformed documentary JSON fails; never ignore it whole.

  // Walk original JSON string-token spans instead of serializing JSON.parse:
  // that would drop duplicate keys and could hide an unrelated/earlier URL.
  const tokens = [...content.matchAll(/"(?:\\.|[^"\\])*"|[{}[\]:,]|[^\s{}[\]:,]+/g)];
  const spans = [];
  let index = 0;
  function value(pointer) {
    const token = tokens[index++];
    if (token[0] === "{") {
      while (tokens[index][0] !== "}") {
        const key = JSON.parse(tokens[index++][0]);
        index++; // Colon; syntax was already validated by JSON.parse.
        value([...pointer, key]);
        if (tokens[index][0] === ",") index++;
      }
      index++;
    } else if (token[0] === "[") {
      let item = 0;
      while (tokens[index][0] !== "]") {
        value([...pointer, item++]);
        if (tokens[index][0] === ",") index++;
      }
      index++;
    } else if (token[0].startsWith('"') && JSON.parse(token[0]) === allowedThread) {
      const permitted = legacyGenerated
        ? pointer.length === 3 && pointer[0] === "generated" && typeof pointer[1] === "number" && pointer[2] === "images_chat_url"
        : pointer.length === 1 && pointer[0] === "thread";
      if (permitted) spans.push({ start: token.index, end: token.index + token[0].length });
    }
  }
  value([]);
  for (const span of spans.reverse()) content = content.slice(0, span.start) + '"[documentary ChatGPT Images provenance]"' + content.slice(span.end);
  return content;
}

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

async function auditAssets() {
const findings = [];

for (const root of roots) {
  const files = await collectFiles(root);

  for (const file of files) {
    if (binaryAssetExtensions.has(path.extname(file).toLowerCase())) {
      continue;
    }

    const content = await readFile(file, "utf8");

    for (const forbiddenPattern of forbiddenPatterns) {
      const auditedContent = forbiddenPattern.name === "URL externa"
        ? externalResourceScanContent(file, content)
        : content;
      if (forbiddenPattern.pattern.test(auditedContent)) {
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

console.log("Auditoria de assets OK: sin URLs externas ni CDN.");
}

// Expose the pure scan filter for offline negative controls, without launching
// the full repository audit when that filter is imported.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await auditAssets();
