import { transitionRootAssetUrlsById } from "../../assets/transition-world/root/transition-root-assets";
import { coverIntroAssets } from "../../screens/Cover/coverIntroAssets";
import { loadingInitialAssets } from "../../screens/LoadingInitial/loadingInitialAssets";
import { world1RootAssets } from "../../screens/World1Root/world1RootAssets";

export type ScreenAssetBundleId =
  | "loadingInitialCritical"
  | "coverIntroCritical"
  | "transitionRootCritical"
  | "world1RootInitial"
  | "world1RootRelation"
  | "world1RootPerception"
  | "world1RootMediation"
  | "world1RootReady";

export type ScreenAssetPreloadItem = {
  id: string;
  src: string;
  kind: "image";
  estimatedKb?: number;
  notes?: string;
};

export type ScreenAssetBundle = {
  id: ScreenAssetBundleId;
  route: string;
  description: string;
  assets: readonly ScreenAssetPreloadItem[];
};

function image(
  id: string,
  src: string,
  estimatedKb?: number,
  notes?: string,
): ScreenAssetPreloadItem {
  return { id, src, kind: "image", estimatedKb, notes };
}

const coverRigInitialAssets = [
  image("cover_lia_rig_shadow", coverIntroAssets.liaRigShadow),
  image("cover_lia_rig_body", coverIntroAssets.liaRigBody),
  image("cover_lia_rig_petal_left_lower", coverIntroAssets.liaRigPetalLeftLower),
  image("cover_lia_rig_petal_right_lower", coverIntroAssets.liaRigPetalRightLower),
  image("cover_lia_rig_petal_left_upper", coverIntroAssets.liaRigPetalLeftUpper),
  image("cover_lia_rig_petal_right_upper", coverIntroAssets.liaRigPetalRightUpper),
  image("cover_lia_rig_petal_top", coverIntroAssets.liaRigPetalTop),
  image("cover_lia_rig_collar", coverIntroAssets.liaRigCollar),
  image("cover_lia_rig_collar_glow", coverIntroAssets.liaRigCollarGlow),
  image("cover_lia_rig_head_clean", coverIntroAssets.liaRigHeadClean),
  image("cover_lia_rig_eyes_neutral", coverIntroAssets.liaRigEyesNeutral),
  image("cover_lia_rig_eyes_blink_25", coverIntroAssets.liaRigEyesBlink25),
  image("cover_lia_rig_eyes_blink_50", coverIntroAssets.liaRigEyesBlink50),
  image("cover_lia_rig_eyes_closed", coverIntroAssets.liaRigEyesClosed),
] as const;

export const screenAssetBundles = {
  loadingInitialCritical: {
    id: "loadingInitialCritical",
    route: "/, /carga",
    description: "Assets visibles de la carga inicial pre-portada.",
    assets: [
      image("loading_lia_16f", loadingInitialAssets.lia.src, 2519),
      image("loading_plant_4f", loadingInitialAssets.plant.src, 563),
      image("loading_water_5f", loadingInitialAssets.water.src, 123),
      image("loading_ground_halo", loadingInitialAssets.ground.src, 61),
      ...loadingInitialAssets.sparkles.map((sparkle) =>
        image(`loading_${sparkle.assetId}`, sparkle.src),
      ),
    ],
  },
  coverIntroCritical: {
    id: "coverIntroCritical",
    route: "/portada",
    description:
      "Primer frame estable de Portada / Intro sin cargar todas las poses secundarias.",
    assets: [
      image("cover_background", coverIntroAssets.background, 2994),
      ...coverRigInitialAssets,
      image("cover_portal_1_frame", coverIntroAssets.portal1Frame),
      image("cover_portal_1_glow", coverIntroAssets.portal1Glow, 440),
      image("cover_locked_frame", coverIntroAssets.lockedFrame),
      image("cover_lock", coverIntroAssets.lock, 430),
    ],
  },
  transitionRootCritical: {
    id: "transitionRootCritical",
    route: "/transition/intro-to-station-1",
    description:
      "Assets criticos visibles de la transicion Portada / Intro a Mundo I.",
    assets: [
      image(
        "transition_background_webp",
        transitionRootAssetUrlsById.transition_root_background.urls.webp,
      ),
      image(
        "transition_portal_inactive_webp",
        transitionRootAssetUrlsById.portal_root_inactive.urls.webp,
      ),
      image(
        "transition_portal_activating_webp",
        transitionRootAssetUrlsById.portal_root_activating.urls.webp,
      ),
      image(
        "transition_portal_open_webp",
        transitionRootAssetUrlsById.portal_root_open.urls.webp,
      ),
      image(
        "transition_lia_idle_webp",
        transitionRootAssetUrlsById.lia_transition_root_idle_4f.urls.webp,
      ),
      image(
        "transition_lia_guide_webp",
        transitionRootAssetUrlsById.lia_transition_root_guide_2f.urls.webp,
      ),
      image(
        "transition_lia_exit_webp",
        transitionRootAssetUrlsById.lia_transition_root_exit_1f.urls.webp,
      ),
      image(
        "transition_progress_track_webp",
        transitionRootAssetUrlsById.transition_root_progress_track_base.urls.webp,
      ),
      image(
        "transition_progress_fill_webp",
        transitionRootAssetUrlsById.transition_root_progress_fill_segment.urls.webp,
      ),
      image(
        "transition_progress_spark_png",
        transitionRootAssetUrlsById.transition_root_progress_spark.urls.png,
      ),
      ...loadingInitialAssets.sparkles.map((sparkle) =>
        image(`transition_${sparkle.assetId}`, sparkle.src),
      ),
    ],
  },
  world1RootInitial: {
    id: "world1RootInitial",
    route: "/estacion/1",
    description: "Composicion inicial visible de Mundo I: Raiz.",
    assets: [
      image("world1_background", world1RootAssets.background, 2077),
      image("world1_ambient_light", world1RootAssets.ambientLight),
      image("world1_plant", world1RootAssets.plant, 797),
      image("world1_roots_base", world1RootAssets.rootsBase),
      image("world1_node_kit", world1RootAssets.nodeKit),
      image("world1_lia_idle", world1RootAssets.liaIdle, 720),
    ],
  },
  world1RootRelation: {
    id: "world1RootRelation",
    route: "/estacion/1#relation",
    description: "Assets del estado RELACION.",
    assets: [
      image("world1_active_relation", world1RootAssets.activeRelation, 1270),
      image("world1_lia_point_relation", world1RootAssets.liaPointRelation, 641),
    ],
  },
  world1RootPerception: {
    id: "world1RootPerception",
    route: "/estacion/1#perception",
    description: "Assets del estado PERCEPCION.",
    assets: [
      image("world1_active_perception", world1RootAssets.activePerception, 1288),
      image("world1_lia_look_perception", world1RootAssets.liaLookPerception, 681),
    ],
  },
  world1RootMediation: {
    id: "world1RootMediation",
    route: "/estacion/1#mediation",
    description: "Assets del estado MEDIACION.",
    assets: [
      image("world1_active_mediation", world1RootAssets.activeMediation, 1414),
      image("world1_lia_guide_mediation", world1RootAssets.liaGuideMediation, 586),
    ],
  },
  world1RootReady: {
    id: "world1RootReady",
    route: "/estacion/1#ready_to_continue",
    description: "Assets del estado LISTO PARA CONTINUAR.",
    assets: [
      image("world1_exit_path", world1RootAssets.exitPath, 2141),
      image("world1_lia_ready_continue", world1RootAssets.liaReadyContinue, 820),
    ],
  },
} as const satisfies Record<ScreenAssetBundleId, ScreenAssetBundle>;

export function getBundleSources(bundle: ScreenAssetBundle) {
  return bundle.assets.map((asset) => asset.src);
}

export function getBundleEstimatedKb(bundle: ScreenAssetBundle) {
  return bundle.assets.reduce(
    (total, asset) => total + (asset.estimatedKb ?? 0),
    0,
  );
}

