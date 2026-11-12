export type PhotoPlacement = { x: number; y: number };
export type PhotoRect = PhotoPlacement & { width: number; height: number };
export type DetectedPhotoFace = PhotoRect & { confidence: number };
export type LiaPhotoPose = "shoulder" | "peek";

export const defaultPhotoPlacement = {
  shoulder: { x: 0.79, y: 0.57 },
  peek: { x: 0.22, y: 0.17 },
} as const satisfies Record<LiaPhotoPose, PhotoPlacement>;

export const photoCanvas = { width: 1080, height: 1920 };
export const photoPaper = { width: 912, height: 1300, rotation: -4 * Math.PI / 180 };
export const photoOpening = { x: 42, y: 45, width: 828, height: 1010 };

export function portraitCover(sourceWidth: number, sourceHeight: number, width: number, height: number): PhotoRect {
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  return { x: (width - sourceWidth * scale) / 2, y: (height - sourceHeight * scale) * 0.43, width: sourceWidth * scale, height: sourceHeight * scale };
}

export function drawPortraitFrame(
  context: CanvasRenderingContext2D,
  source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  width: number,
  height: number,
  mirrored = false,
) {
  const sourceWidth = "videoWidth" in source ? source.videoWidth : "naturalWidth" in source ? source.naturalWidth : source.width;
  const sourceHeight = "videoHeight" in source ? source.videoHeight : "naturalHeight" in source ? source.naturalHeight : source.height;
  const crop = portraitCover(sourceWidth, sourceHeight, width, height);
  context.save();
  if (mirrored) {
    context.translate(width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(source, crop.x, crop.y, crop.width, crop.height);
  context.restore();
}

export function protectedFace(face: DetectedPhotoFace): PhotoRect {
  // Pico's square includes hair and some of the background. Keep the central
  // face clear while allowing the artwork to sit against hair and clothing.
  return {
    x: face.x + face.width * 0.13,
    y: face.y + face.height * 0.11,
    width: face.width * 0.74,
    height: face.height * 0.98,
  };
}

export function photoRectsOverlap(a: PhotoRect, b: PhotoRect) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function liaPlacementClearsFaces(sprite: PhotoRect, faces: readonly DetectedPhotoFace[], pose: LiaPhotoPose) {
  // The shoulder sprite has only its central upper petal in the top eighth.
  // Bounds include transparent padding and a little room for the shadow.
  const artwork = pose === "shoulder" ? [
    { x: sprite.x + sprite.width * 0.36, y: sprite.y, width: sprite.width * 0.28, height: sprite.height * 0.125 },
    { ...sprite, y: sprite.y + sprite.height * 0.125, height: sprite.height * 0.875 },
  ] : [sprite];
  return faces.every((face) => {
    const main = { ...protectedFace(face), height: face.height * 0.74 };
    const chin = {
      x: face.x + face.width * 0.23,
      y: face.y + face.height * 0.85,
      width: face.width * 0.54,
      height: face.height * 0.24,
    };
    return artwork.every((part) => !photoRectsOverlap(part, main) && !photoRectsOverlap(part, chin));
  });
}

export function planLiaPlacement(faces: readonly DetectedPhotoFace[], preference: PhotoPlacement, pose: LiaPhotoPose): PhotoRect | undefined {
  const anchors = faces.filter((face) => face.confidence >= 42);
  const firstSide = preference.x < 0.5 ? -1 : 1;
  const outerMargin = 0.022;
  const shoulder = pose === "shoulder";
  const largestWidth = shoulder ? 0.76 : 0.60;
  const minimumWidth = shoulder ? 0.32 : 0.24;
  const heightFor = (width: number) => width * photoOpening.width / photoOpening.height;
  const fits = (sprite: PhotoRect) => liaPlacementClearsFaces(sprite, faces, pose);
  const verticalOffset = (preference.y - defaultPhotoPlacement[pose].y) * 0.7;
  const fitInFrame = (value: number, size: number) => Math.max(outerMargin, Math.min(1 - size - outerMargin, value));
  const anchor = anchors.reduce<DetectedPhotoFace | undefined>((largest, face) =>
    !largest || face.width * face.height > largest.width * largest.height ? face : largest, undefined);
  const face = anchor && protectedFace(anchor);

  const startWidth = face ? largestWidth : shoulder ? 0.58 : 0.46;
  for (let width = startWidth; width >= minimumWidth - 0.001; width -= 0.02) {
    const height = heightFor(width);
    if (!face) {
      const y = fitInFrame((shoulder ? 0.61 : 0.065) + verticalOffset, height);
      for (const side of [firstSide, -firstSide]) {
        const sprite = { x: side < 0 ? outerMargin : 1 - width - outerMargin, y, width, height };
        if (fits(sprite)) return sprite;
      }
      continue;
    }
    const center = face.x + face.width / 2;
    const bottom = face.y + face.height;
    const gap = 0.012;
    const y = fitInFrame((shoulder ? bottom + height * 0.15 : face.y + face.height * 0.17) + verticalOffset - height / 2, height);
    const aboveY = face.y - height - gap + Math.min(0, verticalOffset);
    if (!shoulder && Math.abs(verticalOffset) < 0.08 && aboveY >= outerMargin) {
      const above = { x: fitInFrame(center + firstSide * face.width * 0.16 - width / 2, width), y: aboveY, width, height };
      if (fits(above)) return above;
    }

    for (const side of [firstSide, -firstSide]) {
      const x = side < 0 ? face.x - width - gap : face.x + face.width + gap;
      const sprite = { x: fitInFrame(x, width), y, width, height };
      if (fits(sprite)) return sprite;
    }

    if (shoulder) {
      const preferredSide = preference.x === defaultPhotoPlacement.shoulder.x && Math.abs(center - 0.5) > 0.08
        ? center < 0.5 ? 1 : -1
        : firstSide;
      const belowY = fitInFrame(bottom + gap + Math.max(0, verticalOffset), height);
      for (const side of [preferredSide, -preferredSide]) {
        const x = fitInFrame(center + side * 0.33 - width / 2, width);
        const below = { x, y: belowY, width, height };
        if (fits(below)) return below;
      }
    }
  }
}

export function photoPlacementAt(previewX: number, previewY: number): PhotoPlacement | undefined {
  const x = (previewX - 0.5) * photoCanvas.width;
  const y = (previewY - 0.5) * photoCanvas.height;
  const cosine = Math.cos(photoPaper.rotation);
  const sine = Math.sin(photoPaper.rotation);
  const position = {
    x: (x * cosine + y * sine + photoPaper.width / 2 - photoOpening.x) / photoOpening.width,
    y: (-x * sine + y * cosine + photoPaper.height / 2 - photoOpening.y) / photoOpening.height,
  };
  return position.x >= 0 && position.x <= 1 && position.y >= 0 && position.y <= 1 ? position : undefined;
}
