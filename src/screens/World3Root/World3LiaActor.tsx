import { world3RuntimeAssets } from "./world3RuntimeAssets";

export type World3LiaPose = keyof typeof world3RuntimeAssets.lia;

type World3LiaActorProps = {
  pose?: World3LiaPose;
  reducedMotion?: boolean;
};

export function World3LiaActor({
  pose = "idle",
  reducedMotion = false,
}: World3LiaActorProps) {
  const source = world3RuntimeAssets.lia[pose] ?? world3RuntimeAssets.lia.idle;

  return (
    <div
      className="s3-lia"
      data-station3-lia="approved-pose-actor"
      data-lia-source="world3-approved-runtime-asset"
      data-lia-pose={pose}
      data-lia-reduced-motion={reducedMotion}
      aria-hidden="true"
    >
      <span className="s3-lia__halo" />
      <img
        alt=""
        className="s3-lia__sprite"
        decoding="async"
        draggable="false"
        fetchPriority={pose === "idle" ? "high" : "auto"}
        loading={pose === "idle" ? "eager" : "lazy"}
        src={source}
      />
    </div>
  );
}
