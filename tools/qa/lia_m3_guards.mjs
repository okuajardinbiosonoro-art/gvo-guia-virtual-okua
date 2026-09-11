import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  validateApiBase,
  liaPreviewProxy,
  validLocalHeaders,
} from "../vite/lia-preview-proxy.mjs";
const read = (path) => readFileSync(path, "utf8");
const host = "127.0.0.1:49153";
const origin = `https://${host}`;
for (const version of [1, 2]) {
  const headers = version === 2 ? { ":authority": host, ":scheme": "https", origin } : { host, origin };
  const request = (h) => ({ httpVersionMajor: version, headers: h, rawHeaders: Object.entries(h).flat() });
  assert.equal(validLocalHeaders(request(headers), host, origin), true);
  assert.equal(validLocalHeaders(request({ ...headers, origin: "https://foreign.invalid" }), host, origin), false);
  assert.equal(validLocalHeaders(request({ ...headers, "sec-fetch-site": "cross-site" }), host, origin), false);
  assert.equal(validLocalHeaders(request({ ...headers, [version === 2 ? ":authority" : "host"]: "foreign.invalid" }), host, origin), false);
  const duplicate = request(headers);
  duplicate.rawHeaders.push("origin", origin);
  assert.equal(validLocalHeaders(duplicate, host, origin), false);
  const ambiguous = request({ ...headers, [version === 2 ? "host" : ":authority"]: host });
  assert.equal(validLocalHeaders(ambiguous, host, origin), false);
}
assert.equal(validateApiBase(), "/lia-api");
assert.equal(validateApiBase("/lia-api-v2"), "/lia-api-v2");
for (const value of [
  "https://remote.invalid",
  "//remote",
  "/assets",
  "/lia-api/../x",
  "/lia-api?x",
  "/lia-api#x",
])
  assert.throws(() => validateApiBase(value));
for (const upstream of [
  "https://127.0.0.1:49152",
  "http://localhost:49152",
  "http://192.0.2.1:49152",
  "http://127.0.0.1:80",
  "http://127.0.0.1:49152/path",
]) {
  assert.throws(() =>
    liaPreviewProxy({ enabled: true, base: "/lia-api", upstream }),
  );
}
const manifest = JSON.parse(
  read("public/assets/gvo/current-used/lia-preview/manifest.json"),
);
const asset = manifest.assets[0];
for (const path of [asset.runtime_path, asset.current_used_mirror]) {
  const data = readFileSync(path);
  assert.equal(data.length, asset.bytes);
  assert.equal(
    createHash("sha256").update(data).digest("hex").toUpperCase(),
    asset.sha256,
  );
}
assert.equal(asset.human_approval, "HUMAN_APPROVED_CANONICAL_REUSE");
const config = read("src/features/lia-preview/config.ts");
assert.match(config, /VITE_LIA_PREVIEW_ENABLED === "true"/);
const screen = read("src/screens/LiaPreview/LiaPreviewScreen.tsx");
assert.doesNotMatch(
  screen,
  /localStorage|sessionStorage|indexedDB|dangerouslySetInnerHTML/,
);
const vite = read("vite.config.ts");
assert.match(vite, /navigateFallbackDenylist/);
assert.equal((vite.match(/handler: "NetworkOnly"/g) ?? []).length, 2);
console.log(
  "PASS: M3 relative proxy, disabled default, memory-only UI and approved asset guards",
);
