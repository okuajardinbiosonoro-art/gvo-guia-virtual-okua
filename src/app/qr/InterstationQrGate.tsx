import "./InterstationQrGate.css";

import type { IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { readLanguagePreference } from "../preferences/languagePreference";
import { useLocation } from "react-router-dom";
import type {
  FinalReviewContext,
  FinalCoverRevisitContext,
} from "../review/finalReviewContext";
import { captureValidatedJourneyReviewContext } from "../journey/journeyAccess";
import { useJourneyActivity } from "../journey/JourneyActivation";
import {
  coherentProgressPrefixLength,
  getJourneyRuntimeContext,
  isEssentialExitReady,
  useEssentialFlow,
} from "../journey/journeyEssential";
import { acceptJourneyIntent } from "../journey/journeyIntent";
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
  onBeforeOpen?: () => boolean;
  originWorld: InterstationQrOriginWorld;
  presentation?: "dock" | "scene";
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

const roomNumber = { 2: "II", 3: "III", 4: "IV", 5: "V" } as const;

const copy = {
  es: {
    open: (room: string) => `Escanea el QR para abrir Sala ${room}`,
    title: (room: string) => `QR hacia Sala ${room}`,
    resume: (room: string) => `Continuar a Sala ${room}`,
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
    open: (room: string) => `Scan the QR to open Room ${room}`,
    title: (room: string) => `QR to Room ${room}`,
    resume: (room: string) => `Continue to Room ${room}`,
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
  "camera-not-found": {
    es: "No se encontró cámara.",
    en: "No camera found.",
  },
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

function pageVisible() {
  return !document.hidden && document.visibilityState !== "hidden";
}

export function InterstationQrGate({
  onCompleted,
  onBeforeOpen,
  originWorld,
  presentation = "dock",
  persistCompletion,
  ready,
}: InterstationQrGateProps) {
  const location = useLocation();
  const activity = useJourneyActivity();
  const essential = useEssentialFlow(originWorld);
  const runtimeActive = getJourneyRuntimeContext().active;
  const language = readLanguagePreference() ?? "es";
  const localizedCopy = copy[language];
  const contract = interstationQrContracts[originWorld];
  const destination = roomNumber[contract.nextWorld];
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const completionRef = useRef({ onCompleted, persistCompletion });
  completionRef.current = { onCompleted, persistCompletion };
  type ReviewContext = FinalReviewContext | FinalCoverRevisitContext;
  type ScanProof = {
    attemptId: string;
    reviewContext: ReviewContext | null;
    mode: typeof essential.mode;
  };
  type ScanRequest = ScanProof & { id: number; granted: boolean };
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const activeRequestRef = useRef(0);
  const requestRef = useRef<ScanRequest | null>(null);
  const proofRef = useRef<ScanProof | null>(null);
  const openRef = useRef(false);
  const mountedRef = useRef(true);
  const focusAttemptRef = useRef<string | null>(null);
  const viewRef = useRef({
    ready,
    active: activity.active,
    attemptId: activity.attemptId,
    mode: essential.mode,
  });
  viewRef.current = {
    ready,
    active: activity.active,
    attemptId: activity.attemptId,
    mode: essential.mode,
  };
  const [open, setOpen] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>(
    () => inspectCameraCapability().status,
  );
  const [scanStatus, setScanStatus] = useState<ScanStatus>("closed");

  const hasExitPermission = useCallback(
    (proof: ScanProof) => {
      const context = getJourneyRuntimeContext(),
        view = viewRef.current;
      if (
        !mountedRef.current ||
        !pageVisible() ||
        !context.active ||
        !context.authorized ||
        context.screen !== originWorld ||
        context.attemptId !== proof.attemptId ||
        !view.active ||
        view.attemptId !== proof.attemptId ||
        context.mode !== proof.mode ||
        !isEssentialExitReady(originWorld, context)
      )
        return false;
      if (context.mode === "normal") return view.ready;
      return (
        context.reviewReturnAllowed &&
        proof.reviewContext !== null &&
        captureValidatedJourneyReviewContext(`/estacion/${originWorld}`, {
          finalReview: proof.reviewContext,
        }) !== null
      );
    },
    [originWorld],
  );

  const stopScanner = useCallback(() => {
    activeRequestRef.current += 1;
    requestRef.current = null;
    controlsRef.current?.stop();
    controlsRef.current = null;
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);
  const closeScanner = useCallback(() => {
    openRef.current = false;
    proofRef.current = null;
    stopScanner();
    if (mountedRef.current) {
      setOpen(false);
      setScanStatus("closed");
    }
  }, [stopScanner]);
  const isLiveRequest = useCallback(
    (request: ScanRequest) =>
      openRef.current &&
      requestRef.current === request &&
      request.id === activeRequestRef.current &&
      !proofRef.current &&
      hasExitPermission(request),
    [hasExitPermission],
  );

  const finishAcceptedProof = useCallback(
    (proof: ScanProof) => {
      if (
        proofRef.current !== proof ||
        !openRef.current ||
        !hasExitPermission(proof)
      )
        return;
      // Read-only review never invokes a local completion writer.
      if (
        (proof.mode === "normal" &&
          !completionRef.current.persistCompletion()) ||
        !hasExitPermission(proof) ||
        !acceptJourneyIntent({
          from: originWorld,
          to: `/estacion/${originWorld + 1}`,
          kind: proof.mode === "normal" ? "qr" : "review_navigation",
          attemptId: proof.attemptId,
          canonicalPayload: contract.payload,
          ...(proof.reviewContext
            ? { reviewContext: proof.reviewContext }
            : {}),
        })
      ) {
        if (hasExitPermission(proof)) setScanStatus("completion-error");
        return;
      }
      proofRef.current = null;
      setScanStatus("completed");
      completionRef.current.onCompleted();
    },
    [hasExitPermission, originWorld, contract.payload],
  );

  const consumePayload = useCallback(
    (request: ScanRequest, payload: string) => {
      if (!request.granted || !isLiveRequest(request)) return;
      const validation = validateInterstationQrPayload(originWorld, payload);
      if (validation !== "valid") {
        setScanStatus(validation === "wrong" ? "wrong-qr" : "unknown-qr");
        return;
      }
      // Admission is checked again before stopScanner invalidates this accepted request.
      if (!isLiveRequest(request)) return;
      const proof: ScanProof = {
        attemptId: request.attemptId,
        mode: request.mode,
        reviewContext: request.reviewContext,
      };
      proofRef.current = proof;
      stopScanner();
      setCameraStatus("camera-granted");
      finishAcceptedProof(proof);
    },
    [finishAcceptedProof, isLiveRequest, originWorld, stopScanner],
  );

  const startScanner = useCallback(
    async (
      attemptId: string | null,
      reviewContext: ReviewContext | null,
      mode: ScanProof["mode"],
    ) => {
      if (!attemptId) return;
      const proof: ScanProof = {
        attemptId,
        mode,
        reviewContext,
      };
      if (!hasExitPermission(proof)) return;
      stopScanner();
      proofRef.current = null;
      const request: ScanRequest = {
        ...proof,
        id: activeRequestRef.current,
        granted: false,
      };
      requestRef.current = request;
      openRef.current = true;
      focusAttemptRef.current = attemptId;
      setOpen(true);
      setScanStatus("reading");
      setCameraStatus("camera-permission-pending");
      const result = await requestCameraStream();
      if (!isLiveRequest(request)) {
        if (result.ok) stopCameraStream(result.stream);
        return;
      }
      if (!result.ok) {
        setCameraStatus(result.status);
        return;
      }
      request.granted = true;
      streamRef.current = result.stream;
      setCameraStatus("camera-granted");
      if (import.meta.env.DEV && window.__GVO_QR_TEST_MODE__ === true) return;
      if (videoRef.current) videoRef.current.srcObject = result.stream;
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (!isLiveRequest(request) || !videoRef.current) {
          stopCameraStream(result.stream);
          return;
        }
        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromStream(
          result.stream,
          videoRef.current,
          (decoded, error) => {
            if (!isLiveRequest(request)) return;
            if (decoded) {
              consumePayload(request, decoded.getText());
              return;
            }
            // ZXing's stable kind survives minification of constructor names.
            const kind =
              typeof error?.getKind === "function" ? error.getKind() : "";
            if (
              error &&
              ![
                "NotFoundException",
                "ChecksumException",
                "FormatException",
              ].includes(kind)
            ) {
              stopScanner();
              setCameraStatus("camera-error");
            }
          },
        );
        if (!isLiveRequest(request)) controls.stop();
        else controlsRef.current = controls;
      } catch {
        if (!isLiveRequest(request)) return;
        stopScanner();
        setCameraStatus("camera-error");
      }
    },
    [consumePayload, hasExitPermission, isLiveRequest, stopScanner],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      openRef.current = false;
      proofRef.current = null;
      stopScanner();
    };
  }, [stopScanner]);
  useEffect(() => {
    if (!open || !pageVisible() || !activity.active) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("h2")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeScanner();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
      );
      const first = controls[0],
        last = controls[controls.length - 1],
        current = document.activeElement;
      if (!first || !last) return;
      if (
        event.shiftKey &&
        (current === first || !controls.includes(current as HTMLButtonElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (current === last || !controls.includes(current as HTMLButtonElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      const context = getJourneyRuntimeContext(),
        attempt = focusAttemptRef.current;
      if (
        pageVisible() &&
        context.active &&
        context.attemptId === attempt &&
        openButtonRef.current?.isConnected
      )
        window.requestAnimationFrame(() => {
          const current = getJourneyRuntimeContext();
          if (
            mountedRef.current &&
            pageVisible() &&
            current.active &&
            current.attemptId === attempt
          )
            openButtonRef.current?.focus({ preventScroll: true });
        });
    };
  }, [activity.active, closeScanner, open]);

  const retryCompletion = () => {
    const proof = proofRef.current;
    if (proof) finishAcceptedProof(proof);
  };
  useEffect(() => {
    const current = requestRef.current ?? proofRef.current;
    if (current && !hasExitPermission(current)) closeScanner();
  }, [
    activity.active,
    runtimeActive,
    activity.attemptId,
    essential.attemptId,
    essential.exitReady,
    essential.mode,
    ready,
    hasExitPermission,
    closeScanner,
  ]);
  useEffect(() => {
    const hide = () => {
      if (!pageVisible()) closeScanner();
    };
    const reset = () => closeScanner();
    const testPayload = (event: Event) => {
      if (!import.meta.env.DEV || !window.__GVO_QR_TEST_MODE__) return;
      const request = requestRef.current,
        payload = (event as CustomEvent<{ payload?: unknown }>).detail?.payload;
      if (request && typeof payload === "string")
        consumePayload(request, payload);
    };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("gvo:journey-reset-start", reset);
    window.addEventListener("gvo:journey-reset", reset);
    window.addEventListener("gvo:qr-test-payload", testPayload);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("gvo:journey-reset-start", reset);
      window.removeEventListener("gvo:journey-reset", reset);
      window.removeEventListener("gvo:qr-test-payload", testPayload);
    };
  }, [closeScanner, consumePayload]);

  const reviewContext = captureValidatedJourneyReviewContext(
    location.pathname,
    location.state,
  );
  const reviewAllowed = essential.mode !== "normal" && reviewContext !== null;
  if (
    !essential.exitReady ||
    !activity.active ||
    (!reviewAllowed && (essential.mode !== "normal" || !ready))
  )
    return null;
  if (
    essential.mode === "normal" &&
    coherentProgressPrefixLength() >= originWorld
  )
    return (
      <button
        className="gvo-journey-exit"
        type="button"
        onClick={() => {
          const attemptId = activity.attemptId;
          if (
            !attemptId ||
            !hasExitPermission({
              attemptId,
              mode: "normal",
              reviewContext: null,
            })
          )
            return;
          if (
            acceptJourneyIntent({
              from: originWorld,
              to: `/estacion/${originWorld + 1}`,
              kind: "legacy_resume",
              attemptId,
            })
          )
            completionRef.current.onCompleted();
        }}
      >
        {localizedCopy.resume(destination)}
      </button>
    );

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
      ref={dialogRef}
      aria-label={localizedCopy.title(destination)}
      aria-modal={open ? "true" : undefined}
      className={`interstation-qr-gate${open ? " interstation-qr-gate--open" : presentation === "scene" ? " interstation-qr-gate--scene" : ""}`}
      data-camera-status={cameraStatus}
      data-interstation-origin-world={originWorld}
      data-interstation-qr-gate="active"
      data-qr-scan-status={scanStatus}
      role={open ? "dialog" : undefined}
    >
      {!open ? (
        <button
          ref={openButtonRef}
          className={presentation === "scene" ? "gvo-journey-exit" : "interstation-qr-gate__open"}
          data-interstation-qr-action="open"
          aria-label={localizedCopy.open(destination)}
          aria-haspopup="dialog"
          onClick={() => {
            if (!reviewAllowed && onBeforeOpen && !onBeforeOpen()) return;
            void startScanner(
              activity.attemptId,
              reviewContext,
              essential.mode,
            );
          }}
          type="button"
        >
          {presentation === "scene" ? (
            <>
              <span
                className="interstation-qr-gate__threshold"
                aria-hidden="true"
              >
                <img
                  src="/assets/gvo/shared/navigation/runtime/gvo_transition_threshold_v02.webp"
                  data-runtime-asset="gvo-transition-threshold-v02"
                  alt=""
                  width="48"
                  height="48"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v3M12 9v3H3M12 15v6M18 12h3" />
                </svg>
              </span>
              <span>{localizedCopy.open(destination)}</span>
            </>
          ) : (
            localizedCopy.open(destination)
          )}
        </button>
      ) : (
        <div className="interstation-qr-gate__scanner">
          <h2 tabIndex={-1}>{localizedCopy.title(destination)}</h2>
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
                onClick={() =>
                  void startScanner(
                    activity.attemptId,
                    reviewContext,
                    essential.mode,
                  )
                }
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

  return presentation === "scene" && !open
    ? gate
    : createPortal(gate, document.body);
}
