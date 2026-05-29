import "./LiaHybridAvatar.css";

import { coverIntroAssets } from "./coverIntroAssets";

export type LiaAvatarMode = "rig-idle" | "pose";
export type LiaRigExpression = "neutral" | "attentive" | "happy";

type LiaHybridAvatarProps =
  | {
      alt?: string;
      className?: string;
      expression?: LiaRigExpression;
      mode: "rig-idle";
    }
  | {
      alt?: string;
      className?: string;
      mode: "pose";
      poseName: string;
      poseSrc: string;
    };

const rigLayers = [
  ["shadow", coverIntroAssets.liaRigShadow],
  ["body", coverIntroAssets.liaRigBody],
  ["petal-left-lower", coverIntroAssets.liaRigPetalLeftLower],
  ["petal-right-lower", coverIntroAssets.liaRigPetalRightLower],
  ["petal-left-upper", coverIntroAssets.liaRigPetalLeftUpper],
  ["petal-right-upper", coverIntroAssets.liaRigPetalRightUpper],
  ["petal-top", coverIntroAssets.liaRigPetalTop],
  ["collar", coverIntroAssets.liaRigCollar],
  ["collar-glow", coverIntroAssets.liaRigCollarGlow],
  ["head-clean", coverIntroAssets.liaRigHeadClean],
] as const;

const expressionEyes = {
  attentive: coverIntroAssets.liaRigEyesAttentive,
  happy: coverIntroAssets.liaRigEyesHappy,
  neutral: coverIntroAssets.liaRigEyesNeutral,
} as const satisfies Record<LiaRigExpression, string>;

const blinkEyes = [
  ["neutral", coverIntroAssets.liaRigEyesNeutral],
  ["blink-25", coverIntroAssets.liaRigEyesBlink25],
  ["blink-50", coverIntroAssets.liaRigEyesBlink50],
  ["closed", coverIntroAssets.liaRigEyesClosed],
] as const;

export function LiaHybridAvatar(props: LiaHybridAvatarProps) {
  const alt = props.alt ?? "Lía, guía visual de OKÚA";
  const className = props.className ? ` ${props.className}` : "";

  if (props.mode === "pose") {
    return (
      <img
        className={`lia-hybrid lia-hybrid--pose${className}`}
        src={props.poseSrc}
        alt={alt}
        data-lia-avatar-mode="pose"
        data-lia-pose={props.poseName}
        data-runtime-asset={props.poseSrc}
      />
    );
  }

  const expression = props.expression ?? "neutral";

  return (
    <div
      className={`lia-hybrid lia-hybrid--rig-idle${className}`}
      role="img"
      aria-label={alt}
      data-lia-avatar-mode="rig-idle"
      data-lia-expression={expression}
      data-testid="lia-hybrid-avatar"
    >
      {rigLayers.map(([layerName, src]) => (
        <img
          key={layerName}
          className={`lia-hybrid__layer lia-hybrid__layer--${layerName}`}
          src={src}
          alt=""
          aria-hidden="true"
          data-lia-rig-layer={layerName}
          data-runtime-asset={src}
        />
      ))}

      {expression === "neutral" ? (
        blinkEyes.map(([layerName, src]) => (
          <img
            key={layerName}
            className={`lia-hybrid__layer lia-hybrid__eye lia-hybrid__eye--${layerName}`}
            src={src}
            alt=""
            aria-hidden="true"
            data-lia-rig-layer={`eyes-${layerName}`}
            data-runtime-asset={src}
          />
        ))
      ) : (
        <img
          className={`lia-hybrid__layer lia-hybrid__eye lia-hybrid__eye--static lia-hybrid__eye--${expression}`}
          src={expressionEyes[expression]}
          alt=""
          aria-hidden="true"
          data-lia-rig-layer={`eyes-${expression}`}
          data-runtime-asset={expressionEyes[expression]}
        />
      )}
    </div>
  );
}
