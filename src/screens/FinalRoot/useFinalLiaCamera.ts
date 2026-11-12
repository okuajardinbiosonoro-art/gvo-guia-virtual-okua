import { useCallback, useEffect, useRef, useState } from "react";
import { requestCameraStream, stopCameraStream, type CameraStatus } from "../../app/qr/camera";

const selfieConstraints = {
  audio: false,
  video: { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 1600 } },
} as const satisfies MediaStreamConstraints;

type CameraState =
  | { phase: "idle" | "opening" }
  | { phase: "live"; stream: MediaStream }
  | { phase: "error"; reason: CameraStatus };

export function useFinalLiaCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>(null);
  const requestVersion = useRef(0);
  const requested = useRef(false);
  const [state, setState] = useState<CameraState>({ phase: "idle" });
  const [playingStream, setPlayingStream] = useState<MediaStream>();
  const stream = state.phase === "live" ? state.stream : undefined;
  const ready = Boolean(stream && playingStream === stream);

  const release = useCallback(() => {
    requestVersion.current += 1;
    requested.current = false;
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const cancel = useCallback(() => {
    release();
    setPlayingStream(undefined);
    setState({ phase: "idle" });
  }, [release]);

  const fail = useCallback((reason: CameraStatus) => {
    release();
    setPlayingStream(undefined);
    setState({ phase: "error", reason });
  }, [release]);

  useEffect(() => {
    function suspend() {
      if (requested.current) cancel();
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") suspend();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", suspend);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", suspend);
      release();
    };
  }, [cancel, release]);

  useEffect(() => {
    const video = videoRef.current;
    if (!stream || !video) return;

    const timeout = window.setTimeout(onFailure, 10_000);
    function markReady() {
      if (streamRef.current !== stream || !video || video.readyState < 2 || !video.videoWidth) return;
      window.clearTimeout(timeout);
      setPlayingStream(stream);
    }
    function onFailure() {
      if (streamRef.current === stream) fail("camera-error");
    }

    const tracks = stream.getVideoTracks();
    tracks.forEach((track) => track.addEventListener("ended", onFailure));
    video.addEventListener("playing", markReady);
    video.addEventListener("error", onFailure);
    video.srcObject = stream;
    void video.play().then(markReady, () => {
      // The playing event can still arrive from autoplay on iOS.
    });

    return () => {
      window.clearTimeout(timeout);
      tracks.forEach((track) => track.removeEventListener("ended", onFailure));
      video.removeEventListener("playing", markReady);
      video.removeEventListener("error", onFailure);
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [stream, fail]);

  async function open() {
    if (requested.current) return;
    requested.current = true;
    const version = ++requestVersion.current;
    setPlayingStream(undefined);
    setState({ phase: "opening" });
    const result = await requestCameraStream(selfieConstraints);
    if (version !== requestVersion.current) {
      if (result.ok) stopCameraStream(result.stream);
      return;
    }
    if (!result.ok) {
      fail(result.status);
      return;
    }

    streamRef.current = result.stream;
    const track = result.stream.getVideoTracks()[0];
    if (!track || track.readyState !== "live") {
      fail("camera-not-found");
      return;
    }
    const facing = track.getSettings().facingMode;
    if (facing && facing !== "user") {
      fail("camera-not-found");
      return;
    }
    setState({ phase: "live", stream: result.stream });
  }

  function capture(): HTMLCanvasElement | undefined {
    const video = videoRef.current;
    if (state.phase !== "live" || !ready) return;
    if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      fail("camera-error");
      return;
    }
    const frame = document.createElement("canvas");
    const scale = Math.min(1, 1600 / Math.max(video.videoWidth, video.videoHeight));
    frame.width = Math.max(1, Math.round(video.videoWidth * scale));
    frame.height = Math.max(1, Math.round(video.videoHeight * scale));
    const context = frame.getContext("2d", { alpha: false });
    if (!context) {
      fail("camera-error");
      return;
    }
    context.translate(frame.width, 0);
    context.scale(-1, 1);
    try {
      context.drawImage(video, 0, 0, frame.width, frame.height);
    } catch {
      fail("camera-error");
      return;
    }
    cancel();
    return frame;
  }

  return { state, ready, videoRef, open, cancel, capture };
}
