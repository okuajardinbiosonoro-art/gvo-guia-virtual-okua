import transitionRootManifestRaw from "./asset-manifest.transition-root.json?raw";

export type TransitionRootAsset = {
  id: string;
  type: string;
  png: string;
  webp: string;
  expectedWidth: number;
  expectedHeight: number;
  frameCount?: number;
  frameWidth?: number;
  frameHeight?: number;
  status: "approved";
  source: "chatgpt-images-photopea";
  runtimeReady: true;
  notes: string;
};

export type TransitionRootAssetManifest = {
  screen: "transition-world-root";
  version: string;
  status: string;
  transition: {
    id: "intro-to-station-1";
    fromRoute: "/portada";
    toRoute: "/mundo-i-raiz";
    durationMs: 2300;
    reducedMotionDurationMs: 1000;
  };
  assets: TransitionRootAsset[];
};

export const transitionRootAssetManifest = JSON.parse(
  transitionRootManifestRaw,
) as TransitionRootAssetManifest;

export const transitionRootAssetsById = Object.fromEntries(
  transitionRootAssetManifest.assets.map((asset) => [asset.id, asset]),
) as Record<string, TransitionRootAsset>;

export const transitionRootAssetRuntimeBase =
  "src/assets/transition-world/root/runtime";
