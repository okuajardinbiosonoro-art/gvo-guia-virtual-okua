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

const runtimeAssetUrls = import.meta.glob<string>("./runtime/**/*.{png,webp}", {
  eager: true,
  import: "default",
  query: "?url",
});

function resolveRuntimeAssetUrl(assetPath: string) {
  const assetUrl = runtimeAssetUrls[`./${assetPath}`];
  if (!assetUrl) {
    throw new Error(`No se encontro asset runtime aprobado: ${assetPath}`);
  }
  return assetUrl;
}

export type TransitionRootAssetUrls = TransitionRootAsset & {
  urls: {
    png: string;
    webp: string;
  };
};

export const transitionRootAssetUrlsById = Object.fromEntries(
  transitionRootAssetManifest.assets.map((asset) => [
    asset.id,
    {
      ...asset,
      urls: {
        png: resolveRuntimeAssetUrl(asset.png),
        webp: resolveRuntimeAssetUrl(asset.webp),
      },
    },
  ]),
) as Record<string, TransitionRootAssetUrls>;

export const transitionRootAssetRuntimeBase =
  "src/assets/transition-world/root/runtime";
