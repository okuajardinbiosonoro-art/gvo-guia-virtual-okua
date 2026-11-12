import { useEffect, useRef, type RefObject } from "react";
import { photoOpening, planLiaPlacement, type LiaPhotoPose, type PhotoPlacement } from "./finalLiaPhotoLayout";
import { drawLiaOnPortrait, loadPhotoImage } from "./finalLiaPhotoPrint";
import { getLocalFaceDetector } from "./liaFaceDetector";

const width = photoOpening.width / 2;
const height = photoOpening.height / 2;

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  ready: boolean;
  asset: string | undefined;
  pose: LiaPhotoPose;
  placement: PhotoPlacement;
};

export function FinalLiaLivePreview({ videoRef, ready, asset, pose, placement }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!asset || !ready) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !video || !context) return;

    let live = true;
    let timer: number | undefined;
    let scan: Awaited<ReturnType<typeof getLocalFaceDetector>>;
    void getLocalFaceDetector().then((result) => { scan = result; });

    void loadPhotoImage(asset).then((lia) => {
      if (!live) return;
      // The video remains the browser's live preview. The canvas only paints
      // Lía, so face detection never sets the display frame rate.
      function updateOverlay() {
        if (!video || !context || !live) return;
        const started = performance.now();
        if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
          let faces: ReturnType<NonNullable<typeof scan>> = [];
          try {
            faces = scan?.(video, true) ?? [];
          } catch {
            scan = undefined;
          }
          const next = planLiaPlacement(faces, placement, pose);
          context.clearRect(0, 0, width, height);
          if (next) drawLiaOnPortrait(context, lia, next, width, height);
        }
        timer = window.setTimeout(updateOverlay, Math.max(240, (performance.now() - started) * 4));
      }
      updateOverlay();
    }, () => {});

    return () => {
      live = false;
      window.clearTimeout(timer);
      context.clearRect(0, 0, width, height);
    };
  }, [asset, placement, pose, ready, videoRef]);

  return (
    <>
      <video ref={videoRef} autoPlay muted playsInline aria-hidden="true" />
      <canvas ref={canvasRef} width={width} height={height} hidden={!asset} aria-hidden="true" />
    </>
  );
}
