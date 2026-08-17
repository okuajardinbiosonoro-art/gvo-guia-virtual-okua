import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const repoRoot = process.cwd();
const packageFilename = "GVO_COVER_PORTAL_INTERIORS_APPROVED_V01.zip";
const packagePath = path.join(
  process.env.USERPROFILE ?? "",
  "Downloads",
  packageFilename,
);
const expectedPackageSha256 =
  "b70b2604dd5e960a0057c10d269f756c18e3cd47411d84348b395e0f119a78cc";

const portals = [
  {
    portal: "portal_1",
    source: {
      name: "cover_portal_world1_root_interior_source_v01.png",
      width: 927,
      height: 1697,
      channels: 3,
      sha256:
        "082e4cdeff2162434ad2360af2b0cfa1364b61132897e12a3889ca6716a57699",
    },
    master: {
      name: "cover_portal_world1_root_interior_master_v01.png",
      width: 2048,
      height: 3744,
      channels: 3,
      sha256:
        "16d0ae890201666b747ae06d896d72684ebac49dbd9d5e558944164ffae61739",
    },
    runtime: {
      name: "cover_portal_world1_root_interior_v01.webp",
      width: 1024,
      height: 1872,
      channels: 3,
      bytes: 182100,
      sha256:
        "31a0635850af15531ee75dc9c2a3e4d1edfe322fa9d4569d6d94513434255c92",
    },
  },
  {
    portal: "portal_2",
    source: {
      name: "cover_portal_world2_pulse_interior_source_v01.png",
      width: 927,
      height: 1697,
      channels: 3,
      sha256:
        "b50483344074ae11647aa24e2face8e37233bcde81a21a638aaee7ac35ccb89e",
    },
    master: {
      name: "cover_portal_world2_pulse_interior_master_v01.png",
      width: 2048,
      height: 3744,
      channels: 3,
      sha256:
        "82d48d58e17b7552f2cc03b9387aed165c3c676a983cb106d21f9c771cd56421",
    },
    runtime: {
      name: "cover_portal_world2_pulse_interior_v01.webp",
      width: 1024,
      height: 1872,
      channels: 3,
      bytes: 160624,
      sha256:
        "50c605cdc891f8b21d9ed792d299a8be14a28954a78d1bd25c85bb1915f3a941",
    },
  },
  {
    portal: "portal_3",
    source: {
      name: "cover_portal_world3_notebook_interior_source_v01.png",
      width: 941,
      height: 1672,
      channels: 3,
      sha256:
        "896485e3bf97c0d6b6e6e6c1a51d81cb47cfc6a7a9b728e49d3cc07ab4f787f1",
    },
    master: {
      name: "cover_portal_world3_notebook_interior_master_v01.png",
      width: 2048,
      height: 3744,
      channels: 3,
      sha256:
        "7c3d229a5d12c830904ac90e036fb217dbfde8fb09f6217e6b9e268bc2471998",
    },
    runtime: {
      name: "cover_portal_world3_notebook_interior_v01.webp",
      width: 1024,
      height: 1872,
      channels: 3,
      bytes: 97608,
      sha256:
        "d2298b810e358474b75fe3df60ff92b0ece15a2b7b06c85bdaf2aaf8cbdd6659",
    },
  },
  {
    portal: "portal_4",
    source: {
      name: "cover_portal_world4_system_interior_source_v01.png",
      width: 941,
      height: 1672,
      channels: 3,
      sha256:
        "aa7f3cfb83716d1c7958bbd706a31cac9ce9ff8fbc8f03251341d4deb7043727",
    },
    master: {
      name: "cover_portal_world4_system_interior_master_v01.png",
      width: 2048,
      height: 3744,
      channels: 3,
      sha256:
        "35a7892bf8584be96a16994cd76a5c2066a443b11781bc012d9cfef4b152684d",
    },
    runtime: {
      name: "cover_portal_world4_system_interior_v01.webp",
      width: 1024,
      height: 1872,
      channels: 3,
      bytes: 80136,
      sha256:
        "96a961322fe58371c60b078df03a11b240f6672929359afed539bf485e1ce939",
    },
  },
  {
    portal: "portal_5",
    source: {
      name: "cover_portal_world5_map_interior_source_v01.png",
      width: 928,
      height: 1695,
      channels: 3,
      sha256:
        "643a0934f9efb3fcbf1b1b587ab48652337121989a1e8683104919bc1bc97a20",
    },
    master: {
      name: "cover_portal_world5_map_interior_master_v01.png",
      width: 2048,
      height: 3744,
      channels: 4,
      sha256:
        "cf6daa1e205b16707cc6c6feb39bc56576af3f6b93c7b5c4856d678a462790b5",
    },
    runtime: {
      name: "cover_portal_world5_map_interior_v01.webp",
      width: 1024,
      height: 1872,
      channels: 4,
      bytes: 187046,
      sha256:
        "cc95e888b472d8e14295f8b9623144262f699d7583d5a2b1062085cdd5019563",
    },
  },
];

function fail(message) {
  throw new Error(`GVO_DEBT_013C QA FAIL: ${message}`);
}

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

async function assertFile(filePath, expected, label) {
  await access(filePath).catch(() => fail(`${label} no existe: ${filePath}`));
  const [metadata, fileStats, actualSha256] = await Promise.all([
    sharp(filePath).metadata(),
    stat(filePath),
    sha256(filePath),
  ]);

  if (
    metadata.width !== expected.width ||
    metadata.height !== expected.height ||
    metadata.channels !== expected.channels
  ) {
    fail(
      `${label} metadata ${metadata.width}x${metadata.height}/${metadata.channels} != ${expected.width}x${expected.height}/${expected.channels}`,
    );
  }
  if (actualSha256 !== expected.sha256) {
    fail(`${label} SHA-256 ${actualSha256} != ${expected.sha256}`);
  }
  if (expected.bytes && fileStats.size !== expected.bytes) {
    fail(`${label} bytes ${fileStats.size} != ${expected.bytes}`);
  }

  return {
    label,
    dimensions: `${metadata.width}x${metadata.height}`,
    channels: metadata.channels,
    bytes: fileStats.size,
    sha256: actualSha256,
  };
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

const packageSha256 = await sha256(packagePath).catch(() =>
  fail(`paquete aprobado ausente: ${packagePath}`),
);
if (packageSha256 !== expectedPackageSha256) {
  fail(`SHA-256 del ZIP ${packageSha256} != ${expectedPackageSha256}`);
}

const verifiedFiles = [];
for (const portal of portals) {
  const productionDirectory = path.join(
    repoRoot,
    "docs",
    "assets",
    "cover-intro",
    "production-sources",
    portal.portal,
  );
  const runtimeDirectory = path.join(
    repoRoot,
    "public",
    "assets",
    "runtime",
    "cover-intro",
    "portals",
    portal.portal,
    "interior",
  );
  const mirrorDirectory = path.join(
    repoRoot,
    "public",
    "assets",
    "gvo",
    "current-used",
    "cover-intro",
    "portals",
    portal.portal,
    "interior",
  );

  verifiedFiles.push(
    await assertFile(
      path.join(productionDirectory, portal.source.name),
      portal.source,
      `${portal.portal}/source`,
    ),
    await assertFile(
      path.join(productionDirectory, portal.master.name),
      portal.master,
      `${portal.portal}/master`,
    ),
  );
  const runtimeResult = await assertFile(
    path.join(runtimeDirectory, portal.runtime.name),
    portal.runtime,
    `${portal.portal}/runtime`,
  );
  const mirrorResult = await assertFile(
    path.join(mirrorDirectory, portal.runtime.name),
    portal.runtime,
    `${portal.portal}/current-used`,
  );
  if (runtimeResult.sha256 !== mirrorResult.sha256) {
    fail(`${portal.portal} runtime/current-used no son byte-idénticos`);
  }
  verifiedFiles.push(runtimeResult, mirrorResult);
}

const runtimeManifestPath = path.join(
  repoRoot,
  "public/assets/runtime/cover-intro/manifest.json",
);
const mirrorManifestPath = path.join(
  repoRoot,
  "public/assets/gvo/current-used/cover-intro/manifest.json",
);
const [runtimeManifestBytes, mirrorManifestBytes] = await Promise.all([
  readFile(runtimeManifestPath, "utf8"),
  readFile(mirrorManifestPath, "utf8"),
]);
if (runtimeManifestBytes !== mirrorManifestBytes) {
  fail(
    "manifest runtime y manifest current-used no son textualmente equivalentes",
  );
}
const manifest = JSON.parse(runtimeManifestBytes);
if (manifest.version !== "v3") {
  fail(`versión de manifest inesperada: ${manifest.version}`);
}
if (Object.keys(manifest.assets?.portalInteriors ?? {}).length !== 5) {
  fail("manifest no declara exactamente cinco portalInteriors dedicados");
}
if (runtimeManifestBytes.includes("/stations/final-root/access/")) {
  fail("manifest de Portada todavía referencia interiores del Mirador");
}

const [coverSource, coverRegistry, initialRegistry, coverCss] =
  await Promise.all([
    readFile(
      path.join(repoRoot, "src/screens/Cover/CoverIntroScreen.tsx"),
      "utf8",
    ),
    readFile(
      path.join(repoRoot, "src/screens/Cover/coverPortalInteriorAssets.ts"),
      "utf8",
    ),
    readFile(
      path.join(repoRoot, "src/shared/assets/entryCoverAssets.ts"),
      "utf8",
    ),
    readFile(
      path.join(repoRoot, "src/screens/Cover/CoverIntroScreen.css"),
      "utf8",
    ),
  ]);
if (
  coverSource.includes("entryCoverStationAssets") ||
  coverSource.includes("/stations/final-root/access/") ||
  coverRegistry.includes("/stations/final-root/access/")
) {
  fail("CoverIntroScreen conserva acoplamiento a representaciones del Mirador");
}
if ((coverRegistry.match(/\/interior\/.+\.webp/g) ?? []).length !== 5) {
  fail(
    "registro tipado de Portada no contiene exactamente cinco WebP dedicados",
  );
}
if (
  !initialRegistry.includes(
    'const finalAccessRuntimeBase = "/assets/gvo/stations/final-root/access"',
  ) ||
  (initialRegistry.match(/final_access_world[1-5]_[a-z0-9_]+_v01\.webp/g) ?? [])
    .length !== 5
) {
  fail("/inicio no conserva las cinco representaciones aprobadas del Mirador");
}
if (
  !/\.cover-intro__portal-interior\s*\{[\s\S]*?object-fit:\s*cover;/.test(
    coverCss,
  )
) {
  fail("el interior de Portada no declara object-fit: cover");
}

const publicFiles = await listFiles(path.join(repoRoot, "public"));
const deployedProductionFiles = publicFiles.filter((filePath) =>
  /cover_portal_.+_interior_(?:source|master)_v01\.png$/i.test(filePath),
);
if (deployedProductionFiles.length > 0) {
  fail(
    `fuentes/masters se desplegarían bajo public: ${deployedProductionFiles.join(", ")}`,
  );
}

const portalFivePath = path.join(
  repoRoot,
  "public/assets/runtime/cover-intro/portals/portal_5/interior/cover_portal_world5_map_interior_v01.webp",
);
const { data: portalFivePixels, info: portalFiveInfo } = await sharp(
  portalFivePath,
)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
let transparentPixels = 0;
let transparentEdgePixels = 0;
for (let y = 0; y < portalFiveInfo.height; y += 1) {
  for (let x = 0; x < portalFiveInfo.width; x += 1) {
    const alpha = portalFivePixels[(y * portalFiveInfo.width + x) * 4 + 3];
    if (alpha === 0) {
      transparentPixels += 1;
      if (
        x === 0 ||
        y === 0 ||
        x === portalFiveInfo.width - 1 ||
        y === portalFiveInfo.height - 1
      ) {
        transparentEdgePixels += 1;
      }
    }
  }
}
if (transparentPixels !== 1024 || transparentEdgePixels !== 1024) {
  fail(
    `alpha de Portal V cambió: transparent=${transparentPixels}, edge=${transparentEdgePixels}`,
  );
}

const runtimeTotalBytes = portals.reduce(
  (total, portal) => total + portal.runtime.bytes,
  0,
);

console.log(
  JSON.stringify(
    {
      ticket: "GVO_DEBT_013C",
      status: "PASS",
      package: {
        path: packagePath,
        sha256: packageSha256,
      },
      verifiedApprovedFiles: 15,
      verifiedRepositoryFiles: verifiedFiles.length,
      runtimeMirrorPairs: 5,
      runtimeTotalBytes,
      manifestsEquivalent: true,
      coverMiradorCoupling: false,
      initialExperienceMiradorAssetsPreserved: 5,
      sourcesAndMastersOutsidePublic: true,
      portalFiveAlpha: {
        transparentPixels,
        transparentEdgePixels,
        visuallyRequiresFrameQa: true,
      },
    },
    null,
    2,
  ),
);
