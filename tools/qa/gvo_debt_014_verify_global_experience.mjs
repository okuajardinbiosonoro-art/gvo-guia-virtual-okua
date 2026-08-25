import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();

const approvedRuntimeAssets = [
  {
    portal: "portal_1",
    filename: "cover_portal_world1_root_interior_v01.webp",
    sha256: "31a0635850af15531ee75dc9c2a3e4d1edfe322fa9d4569d6d94513434255c92",
  },
  {
    portal: "portal_2",
    filename: "cover_portal_world2_pulse_interior_v01.webp",
    sha256: "50c605cdc891f8b21d9ed792d299a8be14a28954a78d1bd25c85bb1915f3a941",
  },
  {
    portal: "portal_3",
    filename: "cover_portal_world3_notebook_interior_v01.webp",
    sha256: "d2298b810e358474b75fe3df60ff92b0ece15a2b7b06c85bdaf2aaf8cbdd6659",
  },
  {
    portal: "portal_4",
    filename: "cover_portal_world4_system_interior_v01.webp",
    sha256: "96a961322fe58371c60b078df03a11b240f6672929359afed539bf485e1ce939",
  },
  {
    portal: "portal_5",
    filename: "cover_portal_world5_map_interior_v01.webp",
    sha256: "cc95e888b472d8e14295f8b9623144262f699d7583d5a2b1062085cdd5019563",
  },
];

function fail(message) {
  throw new Error(`GVO_DEBT_014 QA FAIL: ${message}`);
}

async function source(relativePath) {
  return readFile(path.join(repoRoot, relativePath), "utf8");
}

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
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

const worldDirectories = [1, 2, 3, 4, 5].map((world) =>
  path.join(repoRoot, "src", "screens", `World${world}Root`),
);
const worldSources = await Promise.all(
  worldDirectories.map(async (directory) => {
    const files = (await listFiles(directory)).filter((file) =>
      /\.(?:ts|tsx)$/.test(file),
    );
    return Promise.all(
      files.map(async (file) => ({
        file,
        content: await readFile(file, "utf8"),
      })),
    );
  }),
);
for (const file of worldSources.flat()) {
  if (
    file.content.includes("ImmersiveModeControl") ||
    file.content.includes('data-gvo-immersive-control="fullscreen"') ||
    file.content.includes("data-gvo-immersive-control='fullscreen'")
  ) {
    fail(
      `control fullscreen local detectado: ${path.relative(repoRoot, file.file)}`,
    );
  }
}

const allSourceFiles = (await listFiles(path.join(repoRoot, "src"))).filter(
  (file) => /\.(?:ts|tsx)$/.test(file) && !file.endsWith(".test.tsx"),
);
const immersiveControlRenderers = [];
for (const file of allSourceFiles) {
  const content = await readFile(file, "utf8");
  if (content.includes("<ImmersiveModeControl")) {
    immersiveControlRenderers.push(path.relative(repoRoot, file));
  }
}
if (
  immersiveControlRenderers.length !== 1 ||
  immersiveControlRenderers[0] !==
    path.join("src", "app", "shell", "GlobalImmersiveShell.tsx")
) {
  fail(
    `autoridad ImmersiveModeControl inesperada: ${immersiveControlRenderers.join(", ")}`,
  );
}

const [shell, control, cover, coverCss, finalRoot, reviewContext, registry] =
  await Promise.all([
    source("src/app/shell/GlobalImmersiveShell.tsx"),
    source("src/shared/immersive/ImmersiveModeControl.tsx"),
    source("src/screens/Cover/CoverIntroScreen.tsx"),
    source("src/screens/Cover/CoverIntroScreen.css"),
    source("src/screens/FinalRoot/FinalRootScreen.tsx"),
    source("src/app/review/finalReviewContext.ts"),
    source("src/screens/Cover/coverPortalInteriorAssets.ts"),
  ]);

for (const required of [
  "coverIntroRoute",
  "finalEntryRoute",
  "...Object.values(stationEntryRoutes)",
]) {
  if (!shell.includes(required)) {
    fail(`shell no declara ${required}`);
  }
}
if (shell.includes("initialExperienceRoute")) {
  fail("shell global invade /inicio y duplica su CTA aprobada");
}
for (const state of ["blocked", "inactive", "pending", "active", "error"]) {
  if (!control.includes(`"${state}"`)) {
    fail(`estado fullscreen ausente: ${state}`);
  }
}
if (!shell.includes('"unavailable-on-platform"')) {
  fail("shell no oculta el control cuando la plataforma carece de Fullscreen API");
}
for (const label of [
  "Activar pantalla completa",
  "Salir de pantalla completa",
  "Enter fullscreen",
  "Exit fullscreen",
]) {
  if (!control.includes(label)) {
    fail(`label fullscreen ausente: ${label}`);
  }
}

if (
  !cover.includes("resolveFinalCoverRevisitContext") ||
  !cover.includes("isCoverRevisitUnlocked") ||
  !cover.includes("beginFinalReview(world)") ||
  !cover.includes("stationEntryRoutes[world]")
) {
  fail("Portada no usa contexto canónico + progreso + entradas canónicas");
}
if (
  !reviewContext.includes('mode: "final-cover-revisit"') ||
  !reviewContext.includes('"gvo.final.reviewContext.v1"') ||
  !finalRoot.includes("beginFinalCoverRevisit()")
) {
  fail("handoff Mirador → Portada no reutiliza la autoridad canónica");
}
if (
  !cover.includes('className="cover-intro__portal-art"') ||
  !coverCss.includes(".cover-intro__portal-art") ||
  !coverCss.includes("aspect-ratio: 941 / 1672") ||
  !coverCss.includes("calc(var(--portal-height) * 0.562799)") ||
  !coverCss.includes("top: 2.3%") ||
  !coverCss.includes("height: 95.4%") ||
  !coverCss.includes(
    ".cover-intro__portal--primary .cover-intro__portal-interior",
  ) ||
  !coverCss.includes("top: 5.4%") ||
  !coverCss.includes("height: 89.2%") ||
  !coverCss.includes("clip-path: inset(1px 0 round 50% / 18%)")
) {
  fail("contrato local de marco/interior y clip Portal I ausente");
}
if ((registry.match(/id: "cover-portal-/g) ?? []).length !== 5) {
  fail("registry no conserva cinco interiores HUMAN_APPROVED");
}

for (const asset of approvedRuntimeAssets) {
  const relativeAssetPath = path.join(
    "cover-intro",
    "portals",
    asset.portal,
    "interior",
    asset.filename,
  );
  const runtimePath = path.join(
    repoRoot,
    "public",
    "assets",
    "runtime",
    relativeAssetPath,
  );
  const mirrorPath = path.join(
    repoRoot,
    "public",
    "assets",
    "gvo",
    "current-used",
    relativeAssetPath,
  );
  const [runtimeHash, mirrorHash] = await Promise.all([
    sha256(runtimePath),
    sha256(mirrorPath),
  ]);
  if (runtimeHash !== asset.sha256 || mirrorHash !== asset.sha256) {
    fail(`${asset.portal}: runtime/current-used no preserva SHA-256 aprobado`);
  }
}

const [runtimeManifest, mirrorManifest] = await Promise.all([
  source("public/assets/runtime/cover-intro/manifest.json"),
  source("public/assets/gvo/current-used/cover-intro/manifest.json"),
]);
if (runtimeManifest !== mirrorManifest) {
  fail("manifests runtime/current-used dejaron de ser equivalentes");
}

console.log(
  "GVO_DEBT_014 verifier PASS: shell global único; /inicio sin duplicado; revisita canónica; contrato local marco/interior + clip Portal I; 5 runtime + 5 mirrors SHA-256 preservados",
);
