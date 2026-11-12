import { world3RuntimeAssets } from "./world3RuntimeAssets";
import { World3LiaClipActor } from "./World3LiaClipActor";

export type World3LiaPose = keyof typeof world3RuntimeAssets.lia;

type World3LiaActorProps = {
  pose?: World3LiaPose;
  reducedMotion?: boolean;
  active?: boolean;
  action?: "attention" | "present" | "respond";
  target?: string;
  replayKey?: string | number;
  motionEnabled?: boolean;
  motionMode?: "historical-interim" | "clips";
};

export function World3LiaActor({
  pose = "idle",
  reducedMotion = false,
  active = true,
  action = "attention",
  target = "index",
  replayKey,
  motionEnabled = true,
  motionMode = "clips",
}: World3LiaActorProps) {
  // Current room states use real registered clips. Historical bitmap poses
  // remain available only through an explicit mode, never as an error fallback.
  if (motionMode === "clips") return <World3LiaClipActor active={active} motionEnabled={motionEnabled} action={action} reducedMotion={reducedMotion} target={target} replayKey={replayKey} />;
  const source = world3RuntimeAssets.lia[pose] ?? world3RuntimeAssets.lia.idle;

  return (
    <div
      className="s3-lia"
      data-station3-lia="pixel-pose-actor"
      data-lia-source="world3-original-pixel-runtime-asset"
      data-lia-pose={pose}
      data-lia-reduced-motion={reducedMotion}
      data-lia-active={active}
      data-lia-action={action}
      data-lia-target={target}
      data-lia-replay={replayKey}
      data-lia-production-status="historical-unused-by-current-room"
      aria-hidden="true"
    >
      <span className="s3-lia__halo" />
      <img
        key={`${pose}:${action}:${replayKey}`}
        alt=""
        className="s3-lia__sprite"
        decoding="async"
        draggable="false"
        fetchPriority={pose === "idle" ? "high" : "auto"}
        loading="eager"
        src={source}
      />
    </div>
  );
}
