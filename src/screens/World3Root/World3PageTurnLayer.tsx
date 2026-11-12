import type { CSSProperties } from "react";

/** Measured alpha > 8 in the untouched 1536×1024 original (inclusive bounds).
 * Paper/content rectangles are conservative registrations inside that bitmap;
 * they are not nine-slice regions and never stretch the notebook image. */
export const world3NotebookGeometry = {
  canvas: { width: 1536, height: 1024 },
  alpha: { left: 317, top: 13, width: 892, height: 989 },
  turnPaper: { left: 447, top: 65, width: 711, height: 860 },
  // Inset from the ring binding and below the real top-right clip. Navigation
  // lives outside this rectangle; the original image still scales uniformly.
  contentPaper: { left: 480, top: 156, width: 650, height: 772 },
} as const;

export function world3RegisteredRectangle(rect: { left: number; top: number; width: number; height: number }): CSSProperties {
  const alpha = world3NotebookGeometry.alpha;
  return {
    left: `${(rect.left - alpha.left) / alpha.width * 100}%`,
    top: `${(rect.top - alpha.top) / alpha.height * 100}%`,
    width: `${rect.width / alpha.width * 100}%`,
    height: `${rect.height / alpha.height * 100}%`,
  };
}

export const world3TurnPageAlphaBounds = {
  canvas: { width: 1024, height: 1024 },
  left: 177,
  top: 37,
  width: 676,
  height: 941,
} as const;

export const world3TurnPageTextureNormalization = {
  left: "-26.18343195%",
  top: "-3.93198725%",
  width: "151.47928994%",
  height: "108.82040383%",
} as const;

export const world3PageTurnGeometryContract = {
  transformOrigin: "0% 50%",
  perspective: "clamp(1100px, 220vw, 1800px)",
  normalDurationMs: 680,
  reducedDurationMs: 120,
  easing: "cubic-bezier(0.45, 0, 0.55, 1)",
  openDegrees: [0, -180],
  closeDegrees: [-180, 0],
  textureSizing: "alpha-normalized-absolute",
} as const;

type World3PageTurnLayerProps = {
  direction: "open" | "close";
  reducedMotion: boolean;
  width: number | null;
  height: number | null;
  asset: string;
};

export function World3PageTurnLayer({
  direction,
  reducedMotion,
  width,
  height,
  asset,
}: World3PageTurnLayerProps) {
  const frozenGeometry =
    width !== null && height !== null && width > 0 && height > 0
      ? ({ width: `${width}px`, height: `${height}px` } as CSSProperties)
      : undefined;
  const stageStyle = {
    ...frozenGeometry,
    "--s3-turn-texture-left": world3TurnPageTextureNormalization.left,
    "--s3-turn-texture-top": world3TurnPageTextureNormalization.top,
    "--s3-turn-texture-width": world3TurnPageTextureNormalization.width,
    "--s3-turn-texture-height": world3TurnPageTextureNormalization.height,
    "--s3-page-perspective": world3PageTurnGeometryContract.perspective,
    "--s3-page-turn-duration": `${
      reducedMotion
        ? world3PageTurnGeometryContract.reducedDurationMs
        : world3PageTurnGeometryContract.normalDurationMs
    }ms`,
    "--s3-page-turn-easing": world3PageTurnGeometryContract.easing,
  } as CSSProperties;

  return (
    <div
      className="s3-page-turn-stage"
      style={stageStyle}
      data-station3-page-turn={direction}
      data-station3-page-turn-motion={reducedMotion ? "reduced" : "normal"}
      data-station3-page-geometry="stable"
      aria-hidden="true"
      inert
    >
      <div
        className={`s3-page-turn-plane s3-page-turn-plane--${direction}`}
        data-station3-page-turn-plane="normalized"
        data-station3-turn-hinge="normalized-left-edge"
      >
        <div className="s3-page-turn__face s3-page-turn__face--front">
          <img
            alt=""
            className="s3-page-turn__texture"
            data-station3-turn-texture="alpha-normalized"
            decoding="async"
            draggable="false"
            src={asset}
          />
        </div>
        <div className="s3-page-turn__face s3-page-turn__face--back">
          <img
            alt=""
            className="s3-page-turn__texture"
            data-station3-turn-texture="alpha-normalized"
            decoding="async"
            draggable="false"
            src={asset}
          />
        </div>
      </div>
    </div>
  );
}
