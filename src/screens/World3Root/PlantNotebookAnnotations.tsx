import type { CSSProperties } from "react";

import type { PlantNarrativeStage } from "./PlantNarrativeSequence";
import { world3RuntimeAssets } from "./world3RuntimeAssets";

type PlantNotebookAnnotationsProps = {
  stage: PlantNarrativeStage;
  reducedMotion: boolean;
};

type PlantAnnotationMotif = 1 | 2 | 3 | 5 | 6 | 7 | 8;

const motifsByStage: Record<PlantNarrativeStage, readonly PlantAnnotationMotif[]> = {
  "step-1": [1, 7],
  "step-2": [2, 3],
  "step-3": [5, 6, 8],
  summary: [1, 2, 3, 5, 6, 8],
};

const motifBackgroundPosition: Record<PlantAnnotationMotif, string> = {
  1: "0% 0%",
  2: "33.333333% 0%",
  3: "66.666667% 0%",
  5: "0% 100%",
  6: "33.333333% 100%",
  7: "66.666667% 100%",
  8: "100% 100%",
};

export function PlantNotebookAnnotations({
  stage,
  reducedMotion,
}: PlantNotebookAnnotationsProps) {
  const motifs = motifsByStage[stage];

  return (
    <div
      className="s3-plant-annotations"
      data-station3-plant-annotations={stage}
      data-station3-plant-annotation-source="sprite-sheet-v01"
      data-station3-plant-annotation-motifs={motifs.join(",")}
      data-station3-plant-annotations-motion={reducedMotion ? "reduced" : "normal"}
      aria-hidden="true"
    >
      {motifs.map((motif) => (
        <span
          className={`s3-annotation-motif s3-annotation-motif--${motif}`}
          data-station3-plant-annotation-motif={motif}
          key={motif}
          style={
            {
              backgroundImage: `url(${world3RuntimeAssets.plant.notebookMarksSheet})`,
              backgroundPosition: motifBackgroundPosition[motif],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
