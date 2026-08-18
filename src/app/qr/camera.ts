export const GVO_CAMERA_CONSTRAINTS = {
  audio: false,
  video: { facingMode: { ideal: "environment" } },
} as const satisfies MediaStreamConstraints;

export type CameraStatus =
  | "camera-supported"
  | "camera-permission-pending"
  | "camera-granted"
  | "camera-denied"
  | "camera-not-found"
  | "camera-in-use"
  | "camera-blocked-insecure-context"
  | "camera-unsupported"
  | "camera-error";

export type CameraCapabilityAudit = Readonly<{
  hasGetUserMedia: boolean;
  hasMediaDevices: boolean;
  hostname: string;
  isSecureContext: boolean;
  protocol: string;
  status:
    | "camera-supported"
    | "camera-blocked-insecure-context"
    | "camera-unsupported";
}>;

export type CameraRequestResult =
  | Readonly<{ ok: true; status: "camera-granted"; stream: MediaStream }>
  | Readonly<{ ok: false; status: Exclude<CameraStatus, "camera-granted"> }>;

function browserLocation(): Pick<Location, "hostname" | "protocol"> {
  if (typeof window === "undefined") {
    return { hostname: "", protocol: "" };
  }

  return window.location;
}

export function inspectCameraCapability(): CameraCapabilityAudit {
  const location = browserLocation();
  const isSecureContext =
    typeof window !== "undefined" && window.isSecureContext === true;
  const hasMediaDevices =
    typeof navigator !== "undefined" && navigator.mediaDevices !== undefined;
  const hasGetUserMedia =
    hasMediaDevices &&
    typeof navigator.mediaDevices?.getUserMedia === "function";

  return {
    hasGetUserMedia,
    hasMediaDevices,
    hostname: location.hostname,
    isSecureContext,
    protocol: location.protocol,
    status: !isSecureContext
      ? "camera-blocked-insecure-context"
      : hasGetUserMedia
        ? "camera-supported"
        : "camera-unsupported",
  };
}

export function cameraStatusFromError(
  error: unknown,
): Exclude<CameraStatus, "camera-granted"> {
  const errorName =
    typeof error === "object" && error !== null && "name" in error
      ? String(error.name)
      : "";

  if (errorName === "NotAllowedError" || errorName === "SecurityError") {
    return inspectCameraCapability().isSecureContext
      ? "camera-denied"
      : "camera-blocked-insecure-context";
  }
  if (errorName === "NotFoundError" || errorName === "DevicesNotFoundError") {
    return "camera-not-found";
  }
  if (errorName === "NotReadableError" || errorName === "TrackStartError") {
    return "camera-in-use";
  }

  return "camera-error";
}

export async function requestCameraStream(): Promise<CameraRequestResult> {
  const capability = inspectCameraCapability();
  if (capability.status !== "camera-supported") {
    return { ok: false, status: capability.status };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(
      GVO_CAMERA_CONSTRAINTS,
    );
    return { ok: true, status: "camera-granted", stream };
  } catch (error) {
    return { ok: false, status: cameraStatusFromError(error) };
  }
}

export function stopCameraStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((track) => track.stop());
}
