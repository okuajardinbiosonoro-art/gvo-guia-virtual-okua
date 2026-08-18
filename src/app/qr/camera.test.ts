import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GVO_CAMERA_CONSTRAINTS,
  cameraStatusFromError,
  inspectCameraCapability,
  requestCameraStream,
  stopCameraStream,
} from "./camera";

function installCamera(
  getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>,
) {
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
}

afterEach(() => {
  Reflect.deleteProperty(window, "isSecureContext");
  Reflect.deleteProperty(navigator, "mediaDevices");
  vi.restoreAllMocks();
});

describe("camera authority", () => {
  it("audita secure context y soporte sin solicitar permisos", () => {
    const getUserMedia = vi.fn();
    installCamera(getUserMedia);

    expect(inspectCameraCapability()).toMatchObject({
      hasGetUserMedia: true,
      hasMediaDevices: true,
      isSecureContext: true,
      status: "camera-supported",
    });
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("solicita sólo video environment y permite detener todos los tracks", async () => {
    const stop = vi.fn();
    const stream = {
      getTracks: () => [{ stop }, { stop }],
    } as unknown as MediaStream;
    const getUserMedia = vi.fn(async () => stream);
    installCamera(getUserMedia);

    const result = await requestCameraStream();
    expect(result).toEqual({ ok: true, status: "camera-granted", stream });
    expect(getUserMedia).toHaveBeenCalledWith(GVO_CAMERA_CONSTRAINTS);
    stopCameraStream(stream);
    expect(stop).toHaveBeenCalledTimes(2);
  });

  it("distingue causas y bloquea origen inseguro antes de getUserMedia", async () => {
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: false,
    });
    const getUserMedia = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });

    expect(await requestCameraStream()).toEqual({
      ok: false,
      status: "camera-blocked-insecure-context",
    });
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(cameraStatusFromError(new DOMException("", "NotAllowedError"))).toBe(
      "camera-blocked-insecure-context",
    );
    expect(cameraStatusFromError(new DOMException("", "NotFoundError"))).toBe(
      "camera-not-found",
    );
    expect(
      cameraStatusFromError(new DOMException("", "NotReadableError")),
    ).toBe("camera-in-use");
  });
});
