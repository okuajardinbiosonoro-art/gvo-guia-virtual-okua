import "./GvoProgressBar.css";

import type { CSSProperties, ReactNode } from "react";

export type GvoProgressBarVariant = "loading-initial" | "transition-world";

type GvoProgressBarProps = {
  ariaLabelledBy?: string;
  ariaValueNow?: number;
  ariaValueText: string;
  children: ReactNode;
  className?: string;
  dataMotionLayer?: string;
  dataProgressMotion?: string;
  dataProgressPreview?: string;
  dataProgressSparkAlignment?: string;
  isReducedMotion?: boolean;
  style?: CSSProperties;
  testId?: string;
  variant: GvoProgressBarVariant;
};

export function GvoProgressBar({
  ariaLabelledBy,
  ariaValueNow,
  ariaValueText,
  children,
  className = "",
  dataMotionLayer,
  dataProgressMotion,
  dataProgressPreview,
  dataProgressSparkAlignment,
  isReducedMotion,
  style,
  testId,
  variant,
}: GvoProgressBarProps) {
  const classes = ["gvo-progress-bar", `gvo-progress-bar--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      data-gvo-progress-bar={variant}
      data-motion-layer={dataMotionLayer}
      data-progress-motion={dataProgressMotion}
      data-progress-preview={dataProgressPreview}
      data-progress-spark-alignment={dataProgressSparkAlignment}
      data-reduced-motion={
        typeof isReducedMotion === "boolean"
          ? isReducedMotion
            ? "true"
            : "false"
          : undefined
      }
      data-testid={testId}
      role="progressbar"
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={ariaValueNow}
      aria-valuetext={ariaValueText}
      style={style}
    >
      {children}
    </div>
  );
}
