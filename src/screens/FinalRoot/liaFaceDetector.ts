import { drawPortraitFrame, photoOpening, type DetectedPhotoFace } from "./finalLiaPhotoLayout";

const trackingAssets = "/assets/gvo/stations/final-root/photo/tracking";
const detectorModule = `${trackingAssets}/pico.module.js`;
const width = 256;
const height = Math.round(width * photoOpening.height / photoOpening.width);

type RegionClassifier = (row: number, column: number, scale: number, pixels: Uint8Array, width: number) => number;
type Detection = [row: number, column: number, size: number, score: number];
type Pico = {
  unpack_cascade: (bytes: Int8Array) => RegionClassifier;
  run_cascade: (
    image: { pixels: Uint8Array; nrows: number; ncols: number; ldim: number },
    classify: RegionClassifier,
    settings: { shiftfactor: number; minsize: number; maxsize: number; scalefactor: number },
  ) => Detection[];
  cluster_detections: (detections: Detection[], threshold: number) => Detection[];
};

type ScanFaces = (frame: HTMLCanvasElement | HTMLVideoElement, mirrored?: boolean) => DetectedPhotoFace[];
let loading: Promise<ScanFaces | undefined> | undefined;

export function getLocalFaceDetector(): Promise<ScanFaces | undefined> {
  loading ??= (async () => {
    const [module, response] = await Promise.all([
      import(/* @vite-ignore */ detectorModule) as Promise<{ default: Pico }>,
      fetch(`${trackingAssets}/facefinder.bin`),
    ]);
    if (!response.ok) return undefined;
    const bytes = new Int8Array(await response.arrayBuffer());
    if (bytes.length !== 239632) return undefined;

    const pico = module.default;
    const classify = pico.unpack_cascade(bytes);
    const scratch = document.createElement("canvas");
    scratch.width = width;
    scratch.height = height;
    const context = scratch.getContext("2d", { alpha: false, willReadFrequently: true });
    if (!context) return undefined;
    const pixels = new Uint8Array(width * height);

    return (frame: Parameters<ScanFaces>[0], mirrored = false) => {
      drawPortraitFrame(context, frame, width, height, mirrored);
      const rgba = context.getImageData(0, 0, width, height).data;
      for (let i = 0; i < pixels.length; i++) {
        const offset = i * 4;
        pixels[i] = (2 * rgba[offset] + 7 * rgba[offset + 1] + rgba[offset + 2]) / 10;
      }
      const detections = pico.run_cascade({ pixels, nrows: height, ncols: width, ldim: width }, classify, {
        shiftfactor: 0.12, minsize: 30, maxsize: 224, scalefactor: 1.18,
      });
      return pico.cluster_detections(detections, 0.2)
        .filter(([, , , score]) => score >= 18)
        .map(([row, column, size, confidence]) => ({
          x: (column - size / 2) / width,
          y: (row - size / 2) / height,
          width: size / width,
          height: size / height,
          confidence,
        }));
    };
  })().catch(() => undefined);
  return loading;
}

export async function scanPhotoFaces(frame: HTMLCanvasElement): Promise<DetectedPhotoFace[]> {
  let timer: number | undefined;
  const deadline = new Promise<undefined>((resolve) => { timer = window.setTimeout(resolve, 450); });
  try {
    const scan = await Promise.race([getLocalFaceDetector(), deadline]);
    return scan?.(frame) ?? [];
  } catch {
    return [];
  } finally {
    window.clearTimeout(timer);
  }
}
