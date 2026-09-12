import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const copy = read("src/content/liaPreviewCopy.ts");
assert.match(copy, /status: "FINAL_COPY"/);
assert.match(copy, /entry: "Conversar con Lía"/);
assert.match(copy, /title: "Conversar con Lía"/);
const screen = read("src/screens/LiaPreview/LiaPreviewScreen.tsx");
assert.match(
  screen,
  /import\.meta\.env\.DEV\s*&&\s*import\.meta\.env\.VITE_LIA_TARGET_SIMULATION === "true"/,
);
assert.match(
  screen,
  /lazy\(\(\) => import\("\.\.\/\.\.\/features\/lia-preview\/TargetReview"\)\)/,
);
assert.doesNotMatch(
  screen,
  /dangerouslySetInnerHTML|localStorage|sessionStorage/,
);
const target = read("src/features/lia-preview/TargetReview.tsx");
assert.match(target, /TARGET_SIMULATION/);
assert.doesNotMatch(
  target,
  /\bfetch\s*\(|\baskLia\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/,
);
const manifest = JSON.parse(
  read("public/assets/gvo/current-used/lia-preview/manifest.json"),
);
assert.equal(manifest.assets.length, 4);
for (const item of manifest.assets) {
  const runtime = fs.readFileSync(path.join(root, item.runtime_path));
  assert.equal(
    crypto.createHash("sha256").update(runtime).digest("hex").toUpperCase(),
    item.sha256,
  );
  assert.deepEqual(
    runtime,
    fs.readFileSync(path.join(root, item.current_used_mirror)),
  );
  assert.equal(item.human_approval, "HUMAN_APPROVED_CANONICAL_REUSE");
}
function files(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? files(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}
if (process.argv.includes("--production")) {
  const assets = files(path.join(root, "dist"));
  assert.ok(assets.some((name) => name.endsWith(".js")));
  for (const file of assets.filter((name) => /\.(?:js|html)$/.test(name))) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(
      source,
      /TARGET_SIMULATION|TARGET · explicación|Ejemplo para revisar|Laboratorio local de conversación/,
    );
  }
}
console.log(
  JSON.stringify({
    status: "PASS",
    copy: "FINAL_COPY",
    canonical_assets: 4,
    dev_only_target: true,
    production_checked: process.argv.includes("--production"),
  }),
);
