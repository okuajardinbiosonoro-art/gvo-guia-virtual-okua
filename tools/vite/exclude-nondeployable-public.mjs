import { rm } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

export const NON_DEPLOYABLE_PUBLIC_ARTIFACTS = [
  "assets/gvo/current-used",
  "assets/gvo/shared/lia/README_LIA_ASSETS.md",
  "assets/gvo/shared/lia/asset_manifest_lia_v1.json",
  "assets/gvo/shared/lia/approved",
  "assets/gvo/shared/lia/candidates",
  "assets/gvo/shared/lia/current-used/carga-inicial",
  "assets/gvo/shared/lia/current-used/transition-world",
  "assets/gvo/shared/lia/current-used/unknown",
  "assets/gvo/shared/lia/future",
  "assets/gvo/stations/world-1-root/README_WORLD1_ROOT_ASSETS.md",
  "assets/gvo/stations/world-2/pulse-invisible/README.md",
];

const resolveOutputTarget = (outputDirectory, relativePath) => {
  const target = resolve(outputDirectory, relativePath);
  const relativeTarget = relative(outputDirectory, target);

  if (
    relativeTarget === "" ||
    relativeTarget.startsWith("..") ||
    isAbsolute(relativeTarget)
  ) {
    throw new Error(
      `Ruta de exclusión de despliegue no segura: ${relativePath}`,
    );
  }

  return target;
};

export const excludeNonDeployablePublicArtifacts = () => ({
  name: "gvo-exclude-nondeployable-public-artifacts",
  apply: "build",
  async writeBundle(outputOptions) {
    if (!outputOptions.dir) {
      throw new Error("GVO requiere un directorio de salida para el build.");
    }

    const outputDirectory = resolve(outputOptions.dir);

    await Promise.all(
      NON_DEPLOYABLE_PUBLIC_ARTIFACTS.map((relativePath) =>
        rm(resolveOutputTarget(outputDirectory, relativePath), {
          force: true,
          recursive: true,
        }),
      ),
    );
  },
});
