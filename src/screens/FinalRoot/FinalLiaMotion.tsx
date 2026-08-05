import { useEffect, useRef, useState, type CSSProperties } from "react";

import { finalRootAssets } from "../../shared/assets/finalRootAssets";

export type FinalLiaMotionPhase =
  | "greeting"
  | "idle"
  | "reduced_static"
  | "hidden_paused";

type FinalLiaMotionState = {
  frame: number;
  phase: FinalLiaMotionPhase;
};

type FinalLiaStripStyle = CSSProperties & {
  "--final-lia-strip-offset": string;
  "--final-lia-strip-width": string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const FINAL_LIA_GREETING_FRAME_DURATIONS_MS = [
  160, 160, 160, 160,
] as const;
export const FINAL_LIA_IDLE_FRAME_DURATIONS_MS = [
  4200, 180, 160, 160, 180, 320,
] as const;
export const FINAL_LIA_GREETING_TOTAL_MS = 640;
export const FINAL_LIA_IDLE_CYCLE_MS = 5200;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function isDocumentHidden() {
  return typeof document !== "undefined" && document.hidden;
}

function stripStyle(frameCount: number, frame: number): FinalLiaStripStyle {
  return {
    "--final-lia-strip-offset": `${-((frame - 1) * 100) / frameCount}%`,
    "--final-lia-strip-width": `${frameCount * 100}%`,
  };
}

export function FinalLiaMotion() {
  const initialStateRef = useRef<{
    documentHidden: boolean;
    reducedMotion: boolean;
  } | null>(null);
  if (initialStateRef.current === null) {
    initialStateRef.current = {
      documentHidden: isDocumentHidden(),
      reducedMotion: prefersReducedMotion(),
    };
  }

  const [documentHidden, setDocumentHidden] = useState(
    initialStateRef.current.documentHidden,
  );
  const [reducedMotion, setReducedMotion] = useState(
    initialStateRef.current.reducedMotion,
  );
  const [motion, setMotion] = useState<FinalLiaMotionState>(() => {
    if (initialStateRef.current?.documentHidden) {
      return { frame: 1, phase: "hidden_paused" };
    }
    if (initialStateRef.current?.reducedMotion) {
      return { frame: 1, phase: "reduced_static" };
    }
    return { frame: 1, phase: "greeting" };
  });
  const timerRef = useRef<number | null>(null);
  const greetingPlayCountRef = useRef(motion.phase === "greeting" ? 1 : 0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleReducedMotionChange);
    return () => {
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentHidden(isDocumentHidden());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setMotion((current) => {
      if (documentHidden) {
        return current.phase === "hidden_paused" && current.frame === 1
          ? current
          : { frame: 1, phase: "hidden_paused" };
      }
      if (reducedMotion) {
        return current.phase === "reduced_static" && current.frame === 1
          ? current
          : { frame: 1, phase: "reduced_static" };
      }
      if (current.phase === "greeting") return current;
      return current.phase === "idle" && current.frame === 1
        ? current
        : { frame: 1, phase: "idle" };
    });
  }, [documentHidden, reducedMotion]);

  useEffect(() => {
    if (motion.phase !== "greeting" && motion.phase !== "idle") return;

    const durations =
      motion.phase === "greeting"
        ? FINAL_LIA_GREETING_FRAME_DURATIONS_MS
        : FINAL_LIA_IDLE_FRAME_DURATIONS_MS;
    const duration = durations[motion.frame - 1];
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setMotion((current) => {
        if (current.phase !== motion.phase || current.frame !== motion.frame) {
          return current;
        }
        if (current.phase === "greeting") {
          return current.frame === FINAL_LIA_GREETING_FRAME_DURATIONS_MS.length
            ? { frame: 1, phase: "idle" }
            : { frame: current.frame + 1, phase: "greeting" };
        }
        return {
          frame:
            current.frame === FINAL_LIA_IDLE_FRAME_DURATIONS_MS.length
              ? 1
              : current.frame + 1,
          phase: "idle",
        };
      });
    }, duration);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [motion.frame, motion.phase]);

  const greetingActive = motion.phase === "greeting";
  const idleFrame = greetingActive ? 1 : motion.frame;
  const activeDuration =
    motion.phase === "greeting"
      ? FINAL_LIA_GREETING_FRAME_DURATIONS_MS[motion.frame - 1]
      : motion.phase === "idle"
        ? FINAL_LIA_IDLE_FRAME_DURATIONS_MS[motion.frame - 1]
        : 0;
  const activeSource = greetingActive
    ? finalRootAssets.lia.greeting4f
    : finalRootAssets.lia.idleContemplative6f;

  return (
    <div
      aria-hidden="true"
      className="final-root-lia"
      data-final-lia-frame={motion.frame}
      data-final-lia-mode="greeting_then_idle_021m"
      data-lia-active-timers={
        motion.phase === "greeting" || motion.phase === "idle" ? 1 : 0
      }
      data-lia-frame-duration-ms={activeDuration}
      data-lia-greeting-play-count={greetingPlayCountRef.current}
      data-lia-layout-contract="static_021l_locked"
      data-lia-motion-frame={motion.frame}
      data-lia-motion-phase={motion.phase}
      data-lia-motion-source={activeSource}
      data-lia-reduced-motion={reducedMotion ? "true" : "false"}
      data-lia-visibility={documentHidden ? "hidden" : "visible"}
    >
      <img
        alt=""
        aria-hidden="true"
        className="final-root-lia__glow"
        data-lia-glow-behavior="static"
        data-runtime-asset={finalRootAssets.lia.glowShadow}
        draggable="false"
        src={finalRootAssets.lia.glowShadow}
      />
      <span className="final-root-lia__viewport">
        <img
          alt=""
          aria-hidden="true"
          className="final-root-lia__strip"
          data-lia-strip="greeting"
          data-lia-strip-active={greetingActive ? "true" : "false"}
          data-runtime-asset={finalRootAssets.lia.greeting4f}
          draggable="false"
          src={finalRootAssets.lia.greeting4f}
          style={stripStyle(4, greetingActive ? motion.frame : 1)}
        />
        <img
          alt=""
          aria-hidden="true"
          className="final-root-lia__strip"
          data-final-sprite-frame={idleFrame}
          data-lia-strip="idle"
          data-lia-strip-active={greetingActive ? "false" : "true"}
          data-runtime-asset={finalRootAssets.lia.idleContemplative6f}
          draggable="false"
          src={finalRootAssets.lia.idleContemplative6f}
          style={stripStyle(6, idleFrame)}
        />
      </span>
    </div>
  );
}
