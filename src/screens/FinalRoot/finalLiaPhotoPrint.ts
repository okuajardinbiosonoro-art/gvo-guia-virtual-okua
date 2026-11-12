import { drawPortraitFrame, photoCanvas, photoOpening as opening, photoPaper as print, planLiaPlacement, type LiaPhotoPose, type PhotoPlacement, type PhotoRect } from "./finalLiaPhotoLayout";
import { scanPhotoFaces } from "./liaFaceDetector";

const photoAssets = "/assets/gvo/stations/final-root/photo";
const brandAssets = "/assets/runtime/cover-intro/brand";
const { width, height } = photoCanvas;

export async function loadPhotoImage(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

function photoSurface(photo: HTMLImageElement | HTMLCanvasElement) {
  const surface = document.createElement("canvas");
  surface.width = opening.width;
  surface.height = opening.height;
  const context = surface.getContext("2d", { alpha: false, willReadFrequently: true });
  if (!context) throw new Error("Canvas unavailable");
  drawPortraitFrame(context, photo, surface.width, surface.height);
  return { surface, context };
}

function applyFilm(context: CanvasRenderingContext2D, width: number, height: number) {
  const film = context.getImageData(0, 0, width, height);
  for (let offset = 0; offset < film.data.length; offset += 4) {
    const red = film.data[offset];
    const green = film.data[offset + 1];
    const blue = film.data[offset + 2];
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    const grain = ((Math.imul(offset + 1, 1597334677) >>> 27) - 16) * 0.31;
    film.data[offset] = red * 0.83 + luminance * 0.13 + 15 + grain;
    film.data[offset + 1] = green * 0.83 + luminance * 0.13 + 8 + grain;
    film.data[offset + 2] = blue * 0.83 + luminance * 0.13 + 2 + grain;
  }
  context.putImageData(film, 0, 0);

  const light = context.createRadialGradient(width / 2, 445, 260, width / 2, 485, 740);
  light.addColorStop(0, "rgba(56, 26, 43, 0)");
  light.addColorStop(1, "rgba(56, 26, 43, .39)");
  context.fillStyle = light;
  context.fillRect(0, 0, width, height);
}

export function drawLiaOnPortrait(context: CanvasRenderingContext2D, lia: HTMLImageElement, placement: PhotoRect, width: number, height: number) {
  const x = placement.x * width;
  const y = placement.y * height;
  const boxWidth = placement.width * width;
  const boxHeight = placement.height * height;
  const scale = Math.min(boxWidth / lia.naturalWidth, boxHeight / lia.naturalHeight);
  const spriteWidth = lia.naturalWidth * scale;
  const spriteHeight = lia.naturalHeight * scale;

  // Clip the artwork and its shadow to the tested placement rectangle.
  context.save();
  context.beginPath();
  context.rect(x, y, boxWidth, boxHeight);
  context.clip();
  context.shadowColor = "rgba(28, 12, 32, .56)";
  context.shadowBlur = boxWidth * 0.044;
  context.shadowOffsetY = boxWidth * 0.025;
  context.drawImage(lia, x + (boxWidth - spriteWidth) / 2, y + (boxHeight - spriteHeight) / 2, spriteWidth, spriteHeight);
  context.restore();
}

function paperGrain(context: CanvasRenderingContext2D) {
  context.fillStyle = "rgba(136, 90, 64, .075)";
  for (let y = 12; y < print.height - 12; y += 7) {
    for (let x = 12; x < print.width - 12; x += 7) {
      const noise = Math.imul(x * 193 + y * 173, 2654435761) >>> 27;
      if (noise < 7) context.fillRect(x, y, 2 + noise % 3, 2);
    }
  }
}

function drawCorner(context: CanvasRenderingContext2D, x: number, y: number, flipX: number, flipY: number) {
  context.save();
  context.translate(x, y);
  context.scale(flipX, flipY);
  context.fillStyle = "#c49b6866";
  context.fillRect(0, 0, 39, 3);
  context.fillRect(0, 0, 3, 39);
  context.fillRect(8, 8, 6, 6);
  context.restore();
}

function logoInk(logo: HTMLImageElement) {
  const surface = document.createElement("canvas");
  surface.width = logo.naturalWidth;
  surface.height = logo.naturalHeight;
  const context = surface.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas unavailable");
  context.drawImage(logo, 0, 0);
  const mark = context.getImageData(0, 0, surface.width, surface.height);
  for (let offset = 0; offset < mark.data.length; offset += 4) {
    const brightness = (mark.data[offset] + mark.data[offset + 1] + mark.data[offset + 2]) / 3;
    const inkCoverage = Math.min(1, Math.max(0, (246 - brightness) / 215));
    mark.data[offset] = 47;
    mark.data[offset + 1] = 38;
    mark.data[offset + 2] = 41;
    mark.data[offset + 3] *= inkCoverage;
  }
  context.putImageData(mark, 0, 0);
  return surface;
}

export async function makeFinalLiaPhoto(source: string | HTMLCanvasElement, poseAsset: string | undefined, pose: LiaPhotoPose, placement: PhotoPlacement, signal: AbortSignal) {
  const [photo, lia, logo, emblem, engraving] = await Promise.all([
    typeof source === "string" ? loadPhotoImage(source) : source,
    poseAsset ? loadPhotoImage(poseAsset).catch(() => undefined) : undefined,
    loadPhotoImage(`${brandAssets}/okua-jardin-biosonoro-logo-v01.png`),
    loadPhotoImage(`${brandAssets}/okua-emblem-material-v03.png`),
    loadPhotoImage(`${photoAssets}/okua-photo-engraving-v01.webp`),
  ]);
  signal.throwIfAborted();
  const { surface, context: photoContext } = photoSurface(photo);
  const sprite = lia ? planLiaPlacement(await scanPhotoFaces(surface), placement, pose) : undefined;
  signal.throwIfAborted();
  applyFilm(photoContext, opening.width, opening.height);
  if (lia && sprite) drawLiaOnPortrait(photoContext, lia, sprite, opening.width, opening.height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("Canvas unavailable");

  const backdrop = context.createRadialGradient(700, 500, 70, 535, 850, 1180);
  backdrop.addColorStop(0, "#704c54");
  backdrop.addColorStop(0.56, "#48313e");
  backdrop.addColorStop(1, "#251c28");
  context.fillStyle = backdrop;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#c49b683d";
  context.lineWidth = 2;
  context.strokeRect(46, 145, width - 92, height - 290);
  drawCorner(context, 46, 145, 1, 1);
  drawCorner(context, width - 46, 145, -1, 1);
  drawCorner(context, 46, height - 145, 1, -1);
  drawCorner(context, width - 46, height - 145, -1, -1);

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(print.rotation);
  context.translate(-print.width / 2, -print.height / 2);
  const paper = context.createLinearGradient(0, 0, print.width, print.height);
  paper.addColorStop(0, "#fff0d5");
  paper.addColorStop(0.5, "#f0dec3");
  paper.addColorStop(1, "#e0bc96");
  context.shadowColor = "rgba(20, 10, 21, .78)";
  context.shadowBlur = 48;
  context.shadowOffsetY = 24;
  context.fillStyle = paper;
  context.fillRect(0, 0, print.width, print.height);
  context.shadowColor = "transparent";
  paperGrain(context);
  context.strokeStyle = "#9e6c4b6c";
  context.lineWidth = 2;
  context.strokeRect(12, 12, print.width - 24, print.height - 24);

  context.fillStyle = "#644858";
  context.fillRect(opening.x - 3, opening.y - 3, opening.width + 6, opening.height + 6);
  context.drawImage(surface, opening.x, opening.y);

  context.fillStyle = "#996f5070";
  context.fillRect(50, 1101, 812, 2);
  context.drawImage(logoInk(logo), 59, 1131, 209, 209 * logo.naturalHeight / logo.naturalWidth);
  const sealHeight = 105;
  context.drawImage(emblem, 588, 1146, sealHeight * emblem.naturalWidth / emblem.naturalHeight, sealHeight);
  const engravingWidth = 138;
  context.globalAlpha = 0.8;
  context.drawImage(engraving, 784, 1174, engravingWidth, engravingWidth * engraving.naturalHeight / engraving.naturalWidth);
  context.restore();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result?.type === "image/jpeg") resolve(result);
      else reject(new Error("JPEG unavailable"));
    }, "image/jpeg", 0.92);
  });
  return new File([blob], "OKUA-foto-con-Lia.jpg", { type: "image/jpeg" });
}
