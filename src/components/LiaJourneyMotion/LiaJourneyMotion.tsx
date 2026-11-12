import "./LiaJourneyMotion.css";
import "../../screens/Cover/LiaHybridAvatar.css";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { coverIntroAssets } from "../../screens/Cover/coverIntroAssets";
export type LiaJourneyAction = "attention" | "present" | "respond";
function registeredDerivative(src: string) { return `/assets/gvo/shared/lia/runtime/articulated-v03/${src.split("/").pop()!.replace(/_v1.png$/, "_v03.webp")}`; }
const layers = [
  ["shadow", coverIntroAssets.liaRigShadow], ["body", coverIntroAssets.liaRigBody],
  ["petal-left-lower", coverIntroAssets.liaRigPetalLeftLower], ["petal-right-lower", coverIntroAssets.liaRigPetalRightLower],
  ["petal-left-upper", coverIntroAssets.liaRigPetalLeftUpper], ["petal-right-upper", coverIntroAssets.liaRigPetalRightUpper], ["petal-top", coverIntroAssets.liaRigPetalTop],
  ["collar", coverIntroAssets.liaRigCollar], ["collar-glow", coverIntroAssets.liaRigCollarGlow], ["head-clean", coverIntroAssets.liaRigHeadClean],
] as const;
const eyes = { neutral: coverIntroAssets.liaRigEyesNeutral, attentive: coverIntroAssets.liaRigEyesAttentive, happy: coverIntroAssets.liaRigEyesHappy };
const blink = [["blink-25", coverIntroAssets.liaRigEyesBlink25], ["blink-50", coverIntroAssets.liaRigEyesBlink50], ["closed", coverIntroAssets.liaRigEyesClosed]] as const;
export const liaJourneyMotionAssets = [...new Set([...layers.map(([, src]) => src), ...Object.values(eyes), ...blink.map(([, src]) => src)].map(registeredDerivative))];
export function LiaJourneyMotion({ action = "attention", active: requestedActive = true, target, className = "", replayKey = "", direction = "right" }: { action?: LiaJourneyAction; active?: boolean; target: string; className?: string; replayKey?: string | number; direction?: "left" | "right" }) {
  const activity = useJourneyActivity();
  const active = requestedActive && activity.active;
  const expression = action === "respond" ? "happy" : action === "present" ? "attentive" : "neutral";
  return <div className={`gvo-lia-journey ${className}`} data-lia-action={action} data-lia-active={active} data-lia-target={target} data-lia-direction={direction} aria-hidden="true">
    <div key={`${action}:${replayKey}`} className="lia-hybrid lia-hybrid--rig-idle" data-lia-avatar-mode="articulated-v03" data-lia-expression={expression}>
      {layers.filter(([name]) => name !== "head-clean").map(([name, original]) => <img key={name} className={`lia-hybrid__layer lia-hybrid__layer--${name}`} src={registeredDerivative(original)} alt="" data-lia-rig-layer={name} data-runtime-asset={registeredDerivative(original)} />)}
      <div className="gvo-lia-journey__face">
        <img className="lia-hybrid__layer lia-hybrid__layer--head-clean" src={registeredDerivative(coverIntroAssets.liaRigHeadClean)} alt="" data-lia-rig-layer="head-clean" data-runtime-asset={registeredDerivative(coverIntroAssets.liaRigHeadClean)} />
        <img className={`lia-hybrid__layer lia-hybrid__eye lia-hybrid__eye--base lia-hybrid__eye--${expression}`} src={registeredDerivative(eyes[expression])} alt="" data-lia-rig-layer={`eyes-${expression}`} data-runtime-asset={registeredDerivative(eyes[expression])} />
        {blink.map(([name, original]) => <img key={name} className={`lia-hybrid__layer lia-hybrid__eye lia-hybrid__eye--${name}`} src={registeredDerivative(original)} alt="" data-lia-rig-layer={`eyes-${name}`} data-runtime-asset={registeredDerivative(original)} />)}
      </div>
    </div>
  </div>;
}
