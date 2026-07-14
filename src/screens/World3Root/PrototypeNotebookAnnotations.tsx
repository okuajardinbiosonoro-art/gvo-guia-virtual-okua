import type { CSSProperties } from "react";

import type { PrototypeNarrativeStage } from "./PrototypeNarrativeSequence";
import { world3RuntimeAssets } from "./world3RuntimeAssets";

type PrototypeNotebookAnnotationsProps = {
  stage: PrototypeNarrativeStage;
  reducedMotion: boolean;
};

type PrototypeAnnotationMotif = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const motifsByStage: Record<
  PrototypeNarrativeStage,
  readonly PrototypeAnnotationMotif[]
> = {
  assembly: [1, 2, 4],
  testing: [3, 5, 8],
  learning: [6, 7, 4],
  summary: [1, 3, 5, 6, 7, 8],
};

const motifBackgroundPosition: Record<PrototypeAnnotationMotif, string> = {
  1: "0% 0%",
  2: "33.333333% 0%",
  3: "66.666667% 0%",
  4: "100% 0%",
  5: "0% 100%",
  6: "33.333333% 100%",
  7: "66.666667% 100%",
  8: "100% 100%",
};

export function PrototypeNotebookAnnotations({
  stage,
  reducedMotion,
}: PrototypeNotebookAnnotationsProps) {
  const motifs = motifsByStage[stage];

  return (
    <div
      className="s3-prototype-annotations"
      data-station3-prototype-annotations={stage}
      data-station3-prototype-annotation-source="sprite-sheet-v01"
      data-station3-prototype-annotation-motifs={motifs.join(",")}
      data-station3-prototype-annotations-motion={reducedMotion ? "reduced" : "normal"}
      aria-hidden="true"
    >
      {motifs.map((motif) => (
        <span
          className={`s3-prototype-annotation-motif s3-prototype-annotation-motif--${motif}`}
          data-station3-prototype-annotation-motif={motif}
          key={motif}
          style={
            {
              backgroundImage: `url(${world3RuntimeAssets.prototype.notebookMarksSheet})`,
              backgroundPosition: motifBackgroundPosition[motif],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
