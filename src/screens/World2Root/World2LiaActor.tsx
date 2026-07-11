import type { CSSProperties } from "react";

import type { World2LiaLayerProfile } from "./world2LiaLayerProfiles";
import { world2RuntimeAssets } from "./world2RuntimeAssets";

type World2LiaActorStyle = CSSProperties & {
  "--world2-lia-halo-opacity": string;
  "--world2-lia-profile-scale": string;
  "--world2-lia-profile-tilt": string;
  "--world2-lia-profile-x": string;
  "--world2-lia-profile-y": string;
};

type World2LiaActorProps = {
  profile: World2LiaLayerProfile;
};

export function World2LiaActor({ profile }: World2LiaActorProps) {
  const style: World2LiaActorStyle = {
    "--world2-lia-halo-opacity": String(profile.haloOpacity),
    "--world2-lia-profile-scale": String(profile.scale),
    "--world2-lia-profile-tilt": profile.tilt,
    "--world2-lia-profile-x": profile.x,
    "--world2-lia-profile-y": profile.y,
  };

  return (
    <div
      className="world2-lia-field"
      data-world2-lia-actor="015V"
      data-lia-layer-id={profile.layerId}
      data-lia-layer-profile={profile.layerProfile}
      data-lia-attention-target={profile.attentionTarget}
      data-lia-motion-profile={profile.motionProfile}
      data-lia-placement={profile.placement}
      key={`world2-lia-actor-${profile.layerId}`}
      style={style}
    >
      <img
        className="world2-scene-asset world2-scene-asset--lia-halo"
        src={world2RuntimeAssets.liaHalo}
        alt=""
        aria-hidden="true"
        data-runtime-asset={world2RuntimeAssets.liaHalo}
        loading="lazy"
      />
      <img
        className="world2-scene-asset world2-scene-asset--lia"
        src={profile.pose}
        alt=""
        aria-hidden="true"
        data-runtime-asset={profile.pose}
        data-lia-source="repo-existing-2-5d"
        data-world2-lia-pose={profile.layerId}
        fetchPriority="high"
      />
      <span
        className="world2-lia-field__shimmer"
        aria-hidden="true"
        data-world2-lia-shimmer="015V"
      />
      {profile.showSpark ? (
        <img
          className="world2-scene-asset world2-scene-asset--lia-spark"
          src={world2RuntimeAssets.liaGestureSpark}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.liaGestureSpark}
          loading="lazy"
        />
      ) : null}
    </div>
  );
}
