import "./World3LiaClipActor.css";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import type { ScreenAssetBundle } from "../../shared/assets/screenAssetBundles";
import { world3LiaClipAssets, world3LiaClipContract, world3LiaClipForTarget } from "./world3LiaClips";

/** Explicitly opt-in only. A missing clip stays pending/error, never falls back
 * to a still image presented as completed motion. Animation has no write callback. */
export function World3LiaClipActor({ active, reducedMotion, target, replayKey = "", motionEnabled = true, action = "present" }: { active: boolean; reducedMotion: boolean; target: string; replayKey?: string | number; motionEnabled?: boolean; action?: "attention" | "present" | "respond" }) {
  const activity = useJourneyActivity();
  const clipId = world3LiaClipForTarget(target), clip = world3LiaClipAssets[clipId];
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const eventKey = `${activity.attemptId}:${clipId}:${target}:${replayKey}`;
  const bundle = useMemo<ScreenAssetBundle>(() => ({ id: "world3Notebook", route: "/estacion/3", description: `Registered pixel Lia clip ${clipId}`, assets: [{ id: `world3-lia-${clipId}`, kind: "image", src: clip.src }] }), [clipId, clip.src]);
  const resources = useAssetPreloader(bundle, { concurrency: 1, contextKey: `${activity.attemptId}:${clipId}` });
  const consumed = useRef<string | null>(null);
  const [playEvent, setPlayEvent] = useState<string | null>(null);
  const live = active && activity.active && visible && resources.ready;
  useEffect(() => {
    const change = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!live || !motionEnabled || reducedMotion || target === "index") {
      setPlayEvent(null);
      if (live && reducedMotion) consumed.current = eventKey;
      return;
    }
    if (consumed.current === eventKey) return;
    consumed.current = eventKey; setPlayEvent(eventKey);
  }, [live, motionEnabled, reducedMotion, target, eventKey]);
  const mode = live && motionEnabled && playEvent === eventKey && !reducedMotion && target !== "index" ? "play" : "stable";
  const stableFrame = target === "index" ? 0 : world3LiaClipContract.stableReducedFrame;
  const positions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];
  const style = { "--s3-lia-clip-source": resources.ready ? `url(${clip.src})` : "none", "--s3-lia-clip-duration": `${clip.durationMs}ms`, "--s3-lia-clip-stable-position": positions[stableFrame] } as CSSProperties;
  return <div className="s3-lia s3-lia-clip" aria-hidden="true" style={style} data-station3-lia="pixel-registered-clip" data-lia-clip={clipId} data-lia-target={target} data-lia-action={action} data-lia-motion-enabled={motionEnabled} data-lia-active={live} data-lia-clip-status={resources.ready ? "ready" : resources.status} data-lia-clip-fallback="none" data-lia-clip-mode={mode} data-lia-clip-stable-frame={stableFrame + 1} data-lia-clip-attempt={activity.attemptId ?? "inactive"}>
    {resources.ready ? <span key={eventKey} className="s3-lia-clip__frame" data-runtime-asset={clip.src} /> : null}
  </div>;
}
