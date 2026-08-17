import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const assets = [
  {
    id: "entry-cover-background",
    runtime:
      "public/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png",
    mirror:
      "public/assets/gvo/current-used/cover-intro/background/cover_bg_archivo_vivo_base_v1.png",
    sha256: "D1AB1AD83C48883CF725E6FCB9AA34778AF8660CE15277B6A58F3231098E13C8",
  },
  {
    id: "world-1-root",
    runtime:
      "public/assets/gvo/stations/final-root/access/final_access_world1_root_v01.webp",
    mirror:
      "public/assets/gvo/current-used/final-root/access/final_access_world1_root_v01.webp",
    sha256: "F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046",
  },
  {
    id: "world-2-pulse",
    runtime:
      "public/assets/gvo/stations/final-root/access/final_access_world2_pulse_v01.webp",
    mirror:
      "public/assets/gvo/current-used/final-root/access/final_access_world2_pulse_v01.webp",
    sha256: "6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6",
  },
  {
    id: "world-3-notebook",
    runtime:
      "public/assets/gvo/stations/final-root/access/final_access_world3_notebook_v01.webp",
    mirror:
      "public/assets/gvo/current-used/final-root/access/final_access_world3_notebook_v01.webp",
    sha256: "2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3",
  },
  {
    id: "world-4-system",
    runtime:
      "public/assets/gvo/stations/final-root/access/final_access_world4_system_v01.webp",
    mirror:
      "public/assets/gvo/current-used/final-root/access/final_access_world4_system_v01.webp",
    sha256: "5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D",
  },
  {
    id: "world-5-map",
    runtime:
      "public/assets/gvo/stations/final-root/access/final_access_world5_map_v01.webp",
    mirror:
      "public/assets/gvo/current-used/final-root/access/final_access_world5_map_v01.webp",
    sha256: "A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F",
  },
];

const digest = (buffer) =>
  createHash("sha256").update(buffer).digest("hex").toUpperCase();

for (const asset of assets) {
  const runtime = await readFile(asset.runtime);
  const mirror = await readFile(asset.mirror);
  const runtimeHash = digest(runtime);
  const mirrorHash = digest(mirror);

  if (!runtime.equals(mirror)) {
    throw new Error(`${asset.id}: runtime y mirror no son byte-idénticos`);
  }
  if (runtimeHash !== asset.sha256 || mirrorHash !== asset.sha256) {
    throw new Error(`${asset.id}: SHA-256 inesperado`);
  }
}

const runtimeManifest = await readFile(
  "public/assets/runtime/cover-intro/manifest.json",
  "utf8",
);
const mirrorManifest = await readFile(
  "public/assets/gvo/current-used/cover-intro/manifest.json",
  "utf8",
);

if (runtimeManifest !== mirrorManifest) {
  throw new Error("cover-intro: manifests runtime/current-used divergentes");
}

const parsedManifest = JSON.parse(runtimeManifest);
const stationRepresentations = Object.values(
  parsedManifest.assets?.stationRepresentations ?? {},
);

if (
  parsedManifest.rules?.portalInteriorsDeferred !== false ||
  stationRepresentations.length !== 5 ||
  parsedManifest.reuse?.binaryMutation !== false
) {
  throw new Error("cover-intro: contrato v2 incompleto");
}

console.log(
  `GVO_DEBT_013 asset verification PASS: ${assets.length}/${assets.length} pares y manifest v2`,
);
