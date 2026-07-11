import "./GestureHint.css";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import {
  gestureHintAssets,
  type GestureHintVariant,
} from "./gestureHintAssets";

export type GestureHintDirection = "up" | "down" | "left" | "right";

export type GestureHintProps = {
  variant: GestureHintVariant;
  direction?: GestureHintDirection;
  active: boolean;
  completed?: boolean;
  delayMs?: number;
  targetLabel: string;
  anchorRef?: RefObject<HTMLElement | null>;
  className?: string;
};

type AnchorPosition = {
  x: number;
  y: number;
};

type GestureHintStyle = CSSProperties & {
  "--gvo-gesture-fingertip-x": string;
  "--gvo-gesture-fingertip-y": string;
  "--gvo-gesture-trail-origin-x": string;
  "--gvo-gesture-trail-origin-y": string;
  "--gvo-gesture-anchor-translate-x": string;
  "--gvo-gesture-anchor-translate-y": string;
};

const defaultDirectionByVariant: Record<
  GestureHintVariant,
  GestureHintDirection
> = {
  tap: "down",
  "swipe-vertical": "up",
  "swipe-horizontal": "right",
};

const fingertipCalibration: Record<
  GestureHintDirection,
  Pick<
    GestureHintStyle,
    | "--gvo-gesture-fingertip-x"
    | "--gvo-gesture-fingertip-y"
    | "--gvo-gesture-trail-origin-x"
    | "--gvo-gesture-trail-origin-y"
    | "--gvo-gesture-anchor-translate-x"
    | "--gvo-gesture-anchor-translate-y"
  >
> = {
  up: {
    "--gvo-gesture-fingertip-x": "50%",
    "--gvo-gesture-fingertip-y": "8.5%",
    "--gvo-gesture-trail-origin-x": "50%",
    "--gvo-gesture-trail-origin-y": "8.5%",
    "--gvo-gesture-anchor-translate-x": "-50%",
    "--gvo-gesture-anchor-translate-y": "-8.5%",
  },
  down: {
    "--gvo-gesture-fingertip-x": "50%",
    "--gvo-gesture-fingertip-y": "91.5%",
    "--gvo-gesture-trail-origin-x": "50%",
    "--gvo-gesture-trail-origin-y": "91.5%",
    "--gvo-gesture-anchor-translate-x": "-50%",
    "--gvo-gesture-anchor-translate-y": "-91.5%",
  },
  left: {
    "--gvo-gesture-fingertip-x": "8.5%",
    "--gvo-gesture-fingertip-y": "50%",
    "--gvo-gesture-trail-origin-x": "8.5%",
    "--gvo-gesture-trail-origin-y": "50%",
    "--gvo-gesture-anchor-translate-x": "-8.5%",
    "--gvo-gesture-anchor-translate-y": "-50%",
  },
  right: {
    "--gvo-gesture-fingertip-x": "91.5%",
    "--gvo-gesture-fingertip-y": "50%",
    "--gvo-gesture-trail-origin-x": "91.5%",
    "--gvo-gesture-trail-origin-y": "50%",
    "--gvo-gesture-anchor-translate-x": "-91.5%",
    "--gvo-gesture-anchor-translate-y": "-50%",
  },
};

const horizontalSwipeCalibration = {
  left: {
    "--gvo-gesture-fingertip-x": "11.1%",
    "--gvo-gesture-fingertip-y": "40.5%",
    "--gvo-gesture-trail-origin-x": "11.1%",
    "--gvo-gesture-trail-origin-y": "40.5%",
    "--gvo-gesture-anchor-translate-x": "-11.1%",
    "--gvo-gesture-anchor-translate-y": "-40.5%",
  },
  right: {
    "--gvo-gesture-fingertip-x": "88.9%",
    "--gvo-gesture-fingertip-y": "59.5%",
    "--gvo-gesture-trail-origin-x": "88.9%",
    "--gvo-gesture-trail-origin-y": "59.5%",
    "--gvo-gesture-anchor-translate-x": "-88.9%",
    "--gvo-gesture-anchor-translate-y": "-59.5%",
  },
} satisfies Record<"left" | "right", GestureHintStyle>;

const verticalSwipeCalibration = {
  up: {
    "--gvo-gesture-fingertip-x": "44.7%",
    "--gvo-gesture-fingertip-y": "6.8%",
    "--gvo-gesture-trail-origin-x": "44.7%",
    "--gvo-gesture-trail-origin-y": "6.8%",
    "--gvo-gesture-anchor-translate-x": "-44.7%",
    "--gvo-gesture-anchor-translate-y": "-6.8%",
  },
  down: {
    "--gvo-gesture-fingertip-x": "55.3%",
    "--gvo-gesture-fingertip-y": "93.2%",
    "--gvo-gesture-trail-origin-x": "55.3%",
    "--gvo-gesture-trail-origin-y": "93.2%",
    "--gvo-gesture-anchor-translate-x": "-55.3%",
    "--gvo-gesture-anchor-translate-y": "-93.2%",
  },
} satisfies Record<"up" | "down", GestureHintStyle>;

function resolveFingertipCalibration(
  variant: GestureHintVariant,
  direction: GestureHintDirection,
) {
  if (variant === "swipe-horizontal") {
    if (direction === "left" || direction === "right") {
      return horizontalSwipeCalibration[direction];
    }
  }
  if (variant === "swipe-vertical") {
    if (direction === "up" || direction === "down") {
      return verticalSwipeCalibration[direction];
    }
  }
  return fingertipCalibration[direction];
}

function resolveCalibrationProfile(variant: GestureHintVariant) {
  if (variant === "swipe-horizontal") return "horizontal-index-alpha-v1";
  if (variant === "swipe-vertical") return "vertical-index-alpha-v1";
  return "tap-generic-v1";
}

export function GestureHint({
  variant,
  direction = defaultDirectionByVariant[variant],
  active,
  completed = false,
  delayMs = 2800,
  targetLabel,
  anchorRef,
  className,
}: GestureHintProps) {
  const [visible, setVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition | null>(
    null,
  );

  useEffect(() => {
    setVisible(false);

    if (!active || completed) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [active, completed, delayMs, direction, variant]);

  const state = completed ? "completed" : visible ? "visible" : "waiting";

  useLayoutEffect(() => {
    const target = anchorRef?.current;
    if (!target) {
      setAnchorPosition(null);
      return;
    }

    let animationFrame = 0;
    const measure = () => {
      const rect = target.getBoundingClientRect();
      const nextPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setAnchorPosition((currentPosition) => {
        if (
          currentPosition &&
          Math.abs(currentPosition.x - nextPosition.x) < 0.25 &&
          Math.abs(currentPosition.y - nextPosition.y) < 0.25
        ) {
          return currentPosition;
        }
        return nextPosition;
      });
    };
    const scheduleMeasure = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("resize", scheduleMeasure);
    window.visualViewport?.addEventListener("scroll", scheduleMeasure);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleMeasure);
    resizeObserver?.observe(target);
    if (target.parentElement) {
      resizeObserver?.observe(target.parentElement);
    }

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(scheduleMeasure);
    if (target.parentElement) {
      mutationObserver?.observe(target.parentElement, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("resize", scheduleMeasure);
      window.visualViewport?.removeEventListener("scroll", scheduleMeasure);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [anchorRef]);

  useEffect(() => {
    const target = anchorRef?.current;
    if (!target) {
      return;
    }

    target.setAttribute("data-gvo-gesture-target", variant);
    target.setAttribute("data-gvo-gesture-attention", state);

    return () => {
      if (target.getAttribute("data-gvo-gesture-target") === variant) {
        target.removeAttribute("data-gvo-gesture-target");
        target.removeAttribute("data-gvo-gesture-attention");
      }
    };
  }, [anchorRef, state, variant]);

  const style: GestureHintStyle = {
    ...resolveFingertipCalibration(variant, direction),
    ...(anchorPosition
      ? {
          left: `${anchorPosition.x}px`,
          top: `${anchorPosition.y}px`,
        }
      : {}),
  };
  const hint = (
    <span
      className={["gvo-gesture-hint", className].filter(Boolean).join(" ")}
      style={style}
      data-gvo-gesture-hint={variant}
      data-gvo-gesture-direction={direction}
      data-gvo-gesture-state={state}
      data-gvo-gesture-system="016S5"
      data-gvo-gesture-animation={
        variant === "tap" ? "tap-guidance-r2" : "unidirectional-trail-r7"
      }
      data-gvo-gesture-cycle={
        variant === "tap" ? "press-return" : "unidirectional-reset"
      }
      data-gvo-gesture-anchor={anchorRef ? "target-ref" : "inline"}
      data-gvo-gesture-anchor-state={
        anchorRef ? (anchorPosition ? "ready" : "measuring") : "inline"
      }
      data-gvo-gesture-scale="85-percent"
      data-gvo-gesture-calibration-profile={resolveCalibrationProfile(variant)}
      data-gvo-gesture-trail-alignment={
        variant === "tap" ? "not-applicable" : "fingertip-calibrated"
      }
      data-gvo-gesture-trail-visibility={
        variant === "tap" ? "not-applicable" : "extended"
      }
      data-gvo-gesture-trail-length={
        variant === "tap" ? "not-applicable" : "194-percent"
      }
      data-gvo-gesture-cycle-duration={
        variant === "tap" ? "2600ms" : "1680ms"
      }
      data-gvo-gesture-target-label={targetLabel}
      aria-hidden="true"
    >
      <span className="gvo-gesture-hint__motion">
        <span className="gvo-gesture-hint__direction">
          <img
            className="gvo-gesture-hint__hand"
            src={gestureHintAssets[variant]}
            alt=""
            data-runtime-asset={gestureHintAssets[variant]}
            draggable={false}
          />
        </span>
        <span
          className="gvo-gesture-hint__fingertip"
          data-gvo-gesture-fingertip="calibrated"
        />
        {variant === "tap" ? null : (
          <span
            className="gvo-gesture-hint__fingertip-trail"
            data-gvo-gesture-fingertip-trail={direction}
          >
            <span
              className="gvo-gesture-hint__fingertip-trail-origin"
              data-gvo-gesture-trail-origin="calibrated"
            />
            <span className="gvo-gesture-hint__fingertip-trail-glow" />
            <span className="gvo-gesture-hint__fingertip-trail-tail" />
            <span className="gvo-gesture-hint__fingertip-trail-shimmer" />
          </span>
        )}
      </span>
      {variant === "tap" ? <span className="gvo-gesture-hint__ripple" /> : null}
    </span>
  );

  if (anchorRef && typeof document !== "undefined") {
    return createPortal(hint, document.body);
  }

  return hint;
}
