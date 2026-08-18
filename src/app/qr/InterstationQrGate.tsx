import "./InterstationQrGate.css";

import type { IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { readLanguagePreference } from "../preferences/languagePreference";
import { useFinalReviewMode } from "../review/FinalReviewModeLayout";
import {
  inspectCameraCapability,
  requestCameraStream,
  stopCameraStream,
  type CameraStatus,
} from "./camera";
import {
  interstationQrContracts,
  validateInterstationQrPayload,
  type InterstationQrOriginWorld,
} from "./interstationQr";

type InterstationQrGateProps = Readonly<{
  onCompleted: () => void;
  originWorld: InterstationQrOriginWorld;
  persistCompletion: () => boolean;
  ready: boolean;
}>;

type ScanStatus =
  | "closed"
  | "reading"
  | "wrong-qr"
  | "unknown-qr"
  | "completion-error"
  | "completed";

declare global {
  interface Window {
    __GVO_QR_TEST_MODE__?: boolean;
  }
}

const copy = {
  es: {
    open: (world: number) => `Escanea el QR para abrir Mundo ${world}`,
    title: (world: number) => `QR hacia Mundo ${world}`,
    reading: "Apunta la cámara al código QR de la siguiente estación.",
    wrong: "Este QR pertenece a otra estación. Tu progreso no cambió.",
    unknown:
      "QR no reconocido. Sólo se acepta el código de la siguiente estación.",
    retry: "Reintentar cámara",
    retryCompletion: "Reintentar guardado verificado",
    close: "Cerrar cámara",
    camera: "Estado de cámara",
    read: "Estado de lectura",
  },
  en: {
    open: (world: number) => `Scan the QR to open World ${world}`,
    title: (world: number) => `QR to World ${world}`,
    reading: "Point the camera at the next station QR code.",
    wrong: "This QR belongs to another station. Your progress was not changed.",
    unknown: "Unknown QR. Only the next station code is accepted.",
    retry: "Retry camera",
    retryCompletion: "Retry verified save",
    close: "Close camera",
    camera: "Camera status",
    read: "Scan status",
  },
} as const;

const cameraStatusCopy: Record<CameraStatus, { es: string; en: string }> = {
  "camera-supported": { es: "Cámara disponible.", en: "Camera available." },
  "camera-permission-pending": {
    es: "Esperando permiso de cámara…",
    en: "Waiting for camera permission…",
  },
  "camera-granted": {
    es: "Permiso de cámara concedido.",
    en: "Camera permission granted.",
  },
  "camera-denied": {
    es: "Permiso de cámara denegado.",
    en: "Camera permission denied.",
  },
  "camera-not-found": { es: "No se encontró cámara.", en: "No camera found." },
  "camera-in-use": {
    es: "La cámara está siendo usada por otra aplicación.",
    en: "The camera is in use by another application.",
  },
  "camera-blocked-insecure-context": {
    es: "La cámara está bloqueada porque esta dirección no es un origen seguro.",
    en: "Camera is blocked because this address is not a secure origin.",
  },
  "camera-unsupported": {
    es: "Este navegador no ofrece acceso compatible a la cámara.",
    en: "This browser does not provide compatible camera access.",
  },
  "camera-error": {
    es: "No fue posible iniciar la cámara.",
    en: "The camera could not be started.",
  },
};

export function InterstationQrGate({
  onCompleted,
  originWorld,
  persistCompletion,
  ready,
}: InterstationQrGateProps) {
  const reviewMode = useFinalReviewMode();
  const language = readLanguagePreference() ?? "es";
  const localizedCopy = copy[language];
  const contract = interstationQrContracts[originWorld];
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const activeRequestRef = useRef(0);
  const acceptedPayloadRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>(
    () => inspectCameraCapability().status,
  );
  const [scanStatus, setScanStatus] = useState<ScanStatus>("closed");

  const stopScanner = useCallback(() => {
    activeRequestRef.current += 1;
    controlsRef.current?.stop();
    controlsRef.current = null;
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const completeAfterValidQr = useCallback(() => {
    stopScanner();
    acceptedPayloadRef.current = true;
    setCameraStatus("camera-granted");
    if (!persistCompletion()) {
      setScanStatus("completion-error");
      return;
    }

    setScanStatus("completed");
    onCompleted();
  }, [onCompleted, persistCompletion, stopScanner]);

  const consumePayload = useCallback(
    (payload: string) => {
      if (acceptedPayloadRef.current) {
        return;
      }

      const validation = validateInterstationQrPayload(originWorld, payload);
      if (validation === "valid") {
        completeAfterValidQr();
        return;
      }
      setScanStatus(validation === "wrong" ? "wrong-qr" : "unknown-qr");
    },
    [completeAfterValidQr, originWorld],
  );

  const startScanner = useCallback(async () => {
    stopScanner();
    acceptedPayloadRef.current = false;
    setOpen(true);
    setScanStatus("reading");
    setCameraStatus("camera-permission-pending");
    const requestId = activeRequestRef.current;
    const result = await requestCameraStream();
    if (requestId !== activeRequestRef.current) {
      if (result.ok) stopCameraStream(result.stream);
      return;
    }
    if (!result.ok) {
      setCameraStatus(result.status);
      return;
    }

    streamRef.current = result.stream;
    setCameraStatus("camera-granted");

    if (import.meta.env.DEV && window.__GVO_QR_TEST_MODE__ === true) {
      return;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = result.stream;
    }

    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      if (requestId !== activeRequestRef.current || !videoRef.current) {
        stopCameraStream(result.stream);
        return;
      }
      const reader = new BrowserQRCodeReader();
      controlsRef.current = await reader.decodeFromStream(
        result.stream,
        videoRef.current,
        (decoded, error) => {
          if (decoded) {
            consumePayload(decoded.getText());
            return;
          }
          const errorName = error?.constructor.name ?? "";
          if (
            error &&
            ![
              "NotFoundException",
              "ChecksumException",
              "FormatException",
            ].includes(errorName)
          ) {
            stopScanner();
            setCameraStatus("camera-error");
          }
        },
      );
    } catch {
      stopScanner();
      setCameraStatus("camera-error");
    }
  }, [consumePayload, stopScanner]);

  const closeScanner = useCallback(() => {
    stopScanner();
    setOpen(false);
    setScanStatus("closed");
  }, [stopScanner]);

  const retryCompletion = () => {
    if (!acceptedPayloadRef.current || !persistCompletion()) {
      setScanStatus("completion-error");
      return;
    }
    setScanStatus("completed");
    onCompleted();
  };

  useEffect(() => {
    if (reviewMode || !ready) closeScanner();
  }, [closeScanner, ready, reviewMode]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") closeScanner();
    };
    const handleTestPayload = (event: Event) => {
      if (!import.meta.env.DEV || !window.__GVO_QR_TEST_MODE__) return;
      const payload = (event as CustomEvent<{ payload?: unknown }>).detail
        ?.payload;
      if (typeof payload === "string") consumePayload(payload);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("gvo:qr-test-payload", handleTestPayload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("gvo:qr-test-payload", handleTestPayload);
      stopScanner();
    };
  }, [closeScanner, consumePayload, stopScanner]);

  if (!ready || reviewMode) {
    return null;
  }

  const retryableCamera =
    cameraStatus !== "camera-granted" &&
    cameraStatus !== "camera-permission-pending";
  const scanMessage =
    scanStatus === "wrong-qr"
      ? localizedCopy.wrong
      : scanStatus === "unknown-qr"
        ? localizedCopy.unknown
        : localizedCopy.reading;

  const gate = (
    <section
      aria-label={localizedCopy.title(contract.nextWorld)}
      aria-modal={open ? "true" : undefined}
      className={`interstation-qr-gate${open ? " interstation-qr-gate--open" : ""}`}
      data-camera-status={cameraStatus}
      data-interstation-origin-world={originWorld}
      data-interstation-qr-gate="active"
      data-qr-scan-status={scanStatus}
      role={open ? "dialog" : undefined}
    >
      {!open ? (
        <button
          className="interstation-qr-gate__open"
          data-interstation-qr-action="open"
          onClick={() => void startScanner()}
          type="button"
        >
          {localizedCopy.open(contract.nextWorld)}
        </button>
      ) : (
        <div className="interstation-qr-gate__scanner">
          <h2>{localizedCopy.title(contract.nextWorld)}</h2>
          <div className="interstation-qr-gate__preview">
            <video autoPlay muted playsInline ref={videoRef} />
            <span
              aria-hidden="true"
              className="interstation-qr-gate__reticle"
            />
          </div>
          <p aria-live="polite" data-camera-status-message>
            <span className="sr-only">{localizedCopy.camera}: </span>
            {cameraStatusCopy[cameraStatus][language]}
          </p>
          <p aria-live="polite" data-qr-scan-message>
            <span className="sr-only">{localizedCopy.read}: </span>
            {scanStatus === "completion-error"
              ? language === "en"
                ? "Progress could not be verified. The route remains blocked."
                : "No fue posible verificar el progreso. La ruta sigue bloqueada."
              : scanMessage}
          </p>
          <div className="interstation-qr-gate__actions">
            {scanStatus === "completion-error" ? (
              <button
                data-interstation-qr-action="retry-completion"
                onClick={retryCompletion}
                type="button"
              >
                {localizedCopy.retryCompletion}
              </button>
            ) : retryableCamera ? (
              <button
                data-interstation-qr-action="retry-camera"
                onClick={() => void startScanner()}
                type="button"
              >
                {localizedCopy.retry}
              </button>
            ) : null}
            <button
              data-interstation-qr-action="close"
              onClick={closeScanner}
              type="button"
            >
              {localizedCopy.close}
            </button>
          </div>
        </div>
      )}
    </section>
  );

  return createPortal(gate, document.body);
}
