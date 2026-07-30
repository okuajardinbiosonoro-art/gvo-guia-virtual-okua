import type { CSSProperties, ReactNode } from "react";

type ProjectedRasterStageProps = {
  children?: ReactNode;
  className?: string;
  fit: "contain" | "cover";
  landscapeHeight: number;
  landscapeSrc?: string;
  landscapeWidth: number;
  name: string;
  portraitHeight: number;
  portraitSrc?: string;
  portraitWidth: number;
};

export function ProjectedRasterStage({
  children,
  className = "",
  fit,
  landscapeHeight,
  landscapeSrc,
  landscapeWidth,
  name,
  portraitHeight,
  portraitSrc,
  portraitWidth,
}: ProjectedRasterStageProps) {
  const style = {
    "--s5-portrait-ratio": portraitWidth / portraitHeight,
    "--s5-landscape-ratio": landscapeWidth / landscapeHeight,
  } as CSSProperties;

  return (
    <div
      className={`s5-projected-stage ${className}`.trim()}
      data-projected-stage={name}
      data-projection-fit={fit}
    >
      <div className="s5-media-canvas" data-media-canvas={name} style={style}>
        <picture className="s5-media-background">
          <source media="(orientation: landscape)" srcSet={landscapeSrc} />
          <img
            alt=""
            data-runtime-asset={portraitSrc}
            draggable="false"
            src={portraitSrc}
          />
        </picture>
        {children}
      </div>
    </div>
  );
}
