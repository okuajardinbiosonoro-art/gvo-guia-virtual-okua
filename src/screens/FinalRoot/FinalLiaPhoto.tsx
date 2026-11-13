import "./FinalLiaPhoto.css";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from "react";
import { makeFinalLiaPhoto } from "./finalLiaPhotoPrint";
import { defaultPhotoPlacement, photoPlacementAt, type PhotoPlacement } from "./finalLiaPhotoLayout";
import { useFinalLiaCamera } from "./useFinalLiaCamera";
import { FinalLiaLivePreview } from "./FinalLiaLivePreview";
import { getLocalFaceDetector } from "./liaFaceDetector";

const photoAssetBase = "/assets/gvo/stations/final-root/photo";

const poses = [
  { kind: "shoulder", asset: `${photoAssetBase}/lia-photo-shoulder-v03.webp`, es: "Al hombro", en: "By your shoulder" },
  { kind: "peek", asset: `${photoAssetBase}/lia-photo-peek-v03.webp`, es: "Se asoma arriba", en: "Peeking from above" },
  { kind: "shoulder", asset: undefined, es: "Sin Lía", en: "Without Lía" },
] as const;

type Pose = (typeof poses)[number];
type Locale = "es" | "en";
type PhotoSource = File | HTMLCanvasElement;
type PhotoOutput = { url: string; file: File };
type PhotoResult = { source: PhotoSource; pose: Pose; placement: PhotoPlacement; output: PhotoOutput | "error" };

const copy = {
  es: {
    title: "Una foto con Lía",
    invitation: "Llévate un recuerdo del jardín.",
    close: "Cerrar",
    camera: "Tomar foto",
    retake: "Tomar otra foto",
    shutter: "Capturar foto",
    cameraBack: "Volver",
    liveView: "Encuadre en vivo con Lía",
    liveViewPlain: "Encuadre en vivo",
    openingCamera: "Abriendo la cámara…",
    deniedCamera: "Permite el acceso a la cámara en tu navegador o elige una foto.",
    unavailableCamera: "La cámara no está disponible. Intenta de nuevo o elige una foto.",
    library: "Elegir foto",
    pose: "Personaliza tu foto",
    play: "Toca a Lía",
    preview: "Vista previa de tu foto con Lía",
    previewPlain: "Vista previa de tu Polaroid",
    move: "Toca un lado para ubicar a Lía.",
    moveKeyboard: "Usa las flechas para mover a Lía.",
    preparing: "Preparando tu foto…",
    error: "No pudimos abrir esa foto. Prueba con otra imagen.",
    share: "Compartir",
    save: "Guardar foto",
    shareError: "Puedes guardar la foto y compartirla desde tu dispositivo.",
  },
  en: {
    title: "A photo with Lía",
    invitation: "Take a little piece of the garden with you.",
    close: "Close",
    camera: "Take photo",
    retake: "Take another photo",
    shutter: "Capture photo",
    cameraBack: "Back",
    liveView: "Live view with Lía",
    liveViewPlain: "Live view",
    openingCamera: "Opening the camera…",
    deniedCamera: "Allow camera access in your browser or choose a photo.",
    unavailableCamera: "The camera is unavailable. Try again or choose a photo.",
    library: "Choose photo",
    pose: "Make it yours",
    play: "Tap Lía",
    preview: "Preview of your photo with Lía",
    previewPlain: "Preview of your instant photo",
    move: "Tap a side to position Lía.",
    moveKeyboard: "Use the arrow keys to move Lía.",
    preparing: "Preparing your photo…",
    error: "We couldn't open that photo. Try another image.",
    share: "Share",
    save: "Save photo",
    shareError: "You can save the photo and share it from your device.",
  },
} as const;

function canSharePhoto(file: File) {
  try {
    return typeof navigator.share === "function" && navigator.canShare?.({ files: [file] }) === true;
  } catch {
    return false;
  }
}

export default function FinalLiaPhoto({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const labels = copy[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cameraTriggerRef = useRef<HTMLButtonElement>(null);
  const cameraBackRef = useRef<HTMLButtonElement>(null);
  const cameraWasOpen = useRef(false);
  const libraryRef = useRef<HTMLInputElement>(null);
  const outputUrlRef = useRef<string>(undefined);
  const camera = useFinalLiaCamera();
  const cameraOpen = camera.state.phase === "opening" || camera.state.phase === "live";
  const [photo, setPhoto] = useState<PhotoSource>();
  const [pose, setPose] = useState<Pose>(poses[0]);
  const [customPlacement, setCustomPlacement] = useState<PhotoPlacement>();
  const [posePlay, setPosePlay] = useState(0);
  const [result, setResult] = useState<PhotoResult>();
  const [shareState, setShareState] = useState<"idle" | "busy" | "error">("idle");
  const placement = customPlacement ?? defaultPhotoPlacement[pose.kind];
  const preview = result?.source === photo && result?.output !== "error" ? result?.output : undefined;
  const current = result?.source === photo && result?.pose === pose && result.placement === placement ? result.output : undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    void getLocalFaceDetector();
    return () => {
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (cameraOpen) cameraBackRef.current?.focus();
    else if (cameraWasOpen.current) cameraTriggerRef.current?.focus();
    cameraWasOpen.current = cameraOpen;
  }, [cameraOpen]);

  useEffect(() => {
    if (!photo || cameraOpen) return;
    const source = photo instanceof File ? URL.createObjectURL(photo) : photo;
    const controller = new AbortController();
    void makeFinalLiaPhoto(source, pose.asset, pose.kind, placement, locale, controller.signal).then((file) => {
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(file);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = url;
      setResult({ source: photo, pose, placement, output: { url, file } });
    }, () => {
      if (!controller.signal.aborted) setResult({ source: photo, pose, placement, output: "error" });
    }).finally(() => {
      if (typeof source === "string") URL.revokeObjectURL(source);
    });
    return () => {
      controller.abort();
      if (typeof source === "string") URL.revokeObjectURL(source);
    };
  }, [photo, pose, placement, cameraOpen, locale]);

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    camera.cancel();
    setCustomPlacement(undefined);
    setShareState("idle");
    setPhoto(file);
  }

  function capturePhoto() {
    const frame = camera.capture();
    if (!frame) return;
    setShareState("idle");
    setPhoto(frame);
  }

  function moveLia(event: MouseEvent<HTMLButtonElement>, live = false) {
    if (!pose.asset || event.detail === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const next = live ? { x, y } : photoPlacementAt(x, y);
    if (!next) return;
    setShareState("idle");
    setCustomPlacement(next);
  }

  function moveLiaWithKeys(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!pose.asset || !direction) return;
    event.preventDefault();
    const x = direction[0] === 0 ? placement.x : direction[0] < 0 ? 0.2 : 0.8;
    const y = Math.max(0, Math.min(1, placement.y + direction[1] * 0.06));
    if (x === placement.x && y === placement.y) return;
    setShareState("idle");
    setCustomPlacement({ x, y });
  }

  async function sharePhoto(file: File) {
    setShareState("busy");
    try {
      await navigator.share({ files: [file] });
      setShareState("idle");
    } catch (error) {
      setShareState(error instanceof Error && error.name === "AbortError" ? "idle" : "error");
    }
  }

  return (
    <dialog className="final-lia-photo" ref={dialogRef} onClose={() => { camera.cancel(); onClose(); }} aria-labelledby="final-lia-photo-title">
      <div className="final-lia-photo__header">
        <div>
          <h2 id="final-lia-photo-title">{labels.title}</h2>
          <p>{labels.invitation}</p>
        </div>
        <button type="button" className="final-lia-photo__close" aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className={`final-lia-photo__studio${cameraOpen ? " final-lia-photo__studio--live" : ""}`}>
        {cameraOpen ? (
          <div className="final-lia-photo__live">
            <button type="button" className="final-lia-photo__live-frame" aria-label={pose.asset ? labels.liveView : labels.liveViewPlain} aria-describedby={pose.asset ? "final-lia-photo-live-help" : undefined} aria-disabled={!pose.asset} tabIndex={pose.asset ? 0 : -1} onClick={(event) => moveLia(event, true)} onKeyDown={moveLiaWithKeys}>
              <FinalLiaLivePreview videoRef={camera.videoRef} ready={camera.ready} asset={pose.asset} pose={pose.kind} placement={placement} />
            </button>
            {pose.asset && <p id="final-lia-photo-live-help">{labels.move}<span className="final-root-sr-only"> {labels.moveKeyboard}</span></p>}
          </div>
        ) : preview ? (
          <div className="final-lia-photo__placement">
            <button type="button" className="final-lia-photo__placement-button" aria-label={pose.asset ? labels.preview : labels.previewPlain} aria-describedby={pose.asset ? "final-lia-photo-move" : undefined} aria-disabled={!pose.asset} tabIndex={pose.asset ? 0 : -1} disabled={shareState === "busy"} onClick={(event) => moveLia(event)} onKeyDown={moveLiaWithKeys}>
              <img className="final-lia-photo__preview" src={preview.url} alt="" width="1080" height="1920" key={preview.url} />
            </button>
            {pose.asset && <p id="final-lia-photo-move">{labels.move}<span className="final-root-sr-only"> {labels.moveKeyboard}</span></p>}
          </div>
        ) : pose.asset ? (
          <button type="button" className="final-lia-photo__sample" onClick={() => setPosePlay((count) => count + 1)}>
            <img className="final-lia-photo__pose-art" src={pose.asset} alt="" data-play={posePlay > 0} key={posePlay} />
            <span>{labels.play}</span>
          </button>
        ) : <div className="final-lia-photo__sample final-lia-photo__empty-print" aria-hidden="true" />}
        <div className="final-lia-photo__controls">
          <input hidden ref={libraryRef} type="file" accept="image/*" onChange={selectPhoto} />
          <div className="final-lia-photo__buttons">
            {cameraOpen ? (
              <>
                <button type="button" ref={cameraBackRef} onClick={camera.cancel}>{labels.cameraBack}</button>
                <button type="button" className="final-lia-photo__primary final-lia-photo__shutter" disabled={!camera.ready} onClick={capturePhoto}>
                  <span aria-hidden="true" />{labels.shutter}
                </button>
              </>
            ) : (
              <>
                <button type="button" ref={cameraTriggerRef} className="final-lia-photo__primary" disabled={shareState === "busy"} onClick={() => { setShareState("idle"); void camera.open(); }}>{photo ? labels.retake : labels.camera}</button>
                <button type="button" disabled={shareState === "busy"} onClick={() => libraryRef.current?.click()}>{labels.library}</button>
              </>
            )}
          </div>
          <fieldset className="final-lia-photo__poses" disabled={shareState === "busy"}>
            <legend>{labels.pose}</legend>
            {poses.map((option) => (
              <label key={option.es}>
                <input type="radio" name="final-lia-photo-pose" checked={pose === option} onChange={() => {
                  setShareState("idle");
                  setPose(option);
                  setCustomPlacement(undefined);
                  setPosePlay((count) => count + 1);
                }} />
                {option.asset && <img className="final-lia-photo__pose-art" src={option.asset} alt="" />}
                <span>{option[locale]}</span>
              </label>
            ))}
          </fieldset>
          <div role="status" className="final-lia-photo__status">
            {cameraOpen && !camera.ready ? labels.openingCamera : camera.state.phase === "error" ? (
              camera.state.reason === "camera-denied" ? labels.deniedCamera : labels.unavailableCamera
            ) : current === "error" ? labels.error : photo && !current ? labels.preparing : shareState === "error" ? labels.shareError : ""}
          </div>
          {!cameraOpen && current && current !== "error" && (
            <div className="final-lia-photo__buttons">
              {canSharePhoto(current.file) && (
                <button type="button" className="final-lia-photo__primary" disabled={shareState === "busy"} onClick={() => void sharePhoto(current.file)}>{labels.share}</button>
              )}
              <a href={current.url} download={current.file.name}>{labels.save}</a>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
