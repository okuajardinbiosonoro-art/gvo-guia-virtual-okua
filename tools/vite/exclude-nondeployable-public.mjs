import { rm } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

export const NON_DEPLOYABLE_PUBLIC_ARTIFACTS = [
  "assets/gvo/current-used",
  // Lossless WebP replacements are served in GVO 1.1.3.
  "assets/runtime/loading-initial/lia/lia_loading_16f_okua_v03.png",
  "assets/runtime/loading-initial/plant/plant_growth_4f_okua_v03.png",
  "assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png",
  // Preserve the original Sala I artwork in public/ for editorial work.
  // Visitors receive the same compositions at their original dimensions in WebP.
  "assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png",
  "assets/gvo/stations/world-1-root/light/world1_root_ambient_light_kit_approved_v1.png",
  "assets/gvo/stations/world-1-root/plant/world1_root_young_plant_approved_v1.png",
  "assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png",
  "assets/gvo/stations/world-1-root/nodes/world1_root_node_state_kit_approved_v1.png",
  "assets/gvo/stations/world-1-root/roots/world1_root_active_relation_approved_v1.png",
  "assets/gvo/stations/world-1-root/roots/world1_root_active_perception_approved_v1.png",
  "assets/gvo/stations/world-1-root/roots/world1_root_active_mediation_approved_v1.png",
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
  // Sala II renders the derived WebP files. Keep the PNG masters in the repo.
  "assets/gvo/stations/world-2/pulse-invisible/runtime/plant/world2_main_living_plant_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/plant/world2_plant_stage_anchor_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/plant/world2_living_plant_aura_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/plant/world2_plant_bioelectric_contact_node_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_waveform_clean_technical_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/signal/world2_signal_probe_cable_waveform_unified_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/capture/world2_capture_acquisition_chain_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/conditioning/world2_conditioning_noisy_to_clean_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/dialogue/world2_dialogue_card_mobile_safe_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/lia-fx/world2_lia_presence_halo_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/navigation/world2_layer_icon_glyphs_atlas_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/navigation/world2_layer_nav_token_base_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/navigation/world2_layer_nav_token_active_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/navigation/world2_layer_nav_connector_inactive_v01.png",
  "assets/gvo/stations/world-2/pulse-invisible/runtime/navigation/world2_layer_nav_connector_active_v01.png",
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
