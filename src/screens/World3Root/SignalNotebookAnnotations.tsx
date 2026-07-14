import type { CSSProperties } from "react";

import type { SignalNarrativeStage } from "./SignalNarrativeSequence";
import { world3RuntimeAssets } from "./world3RuntimeAssets";

type SignalNotebookAnnotationsProps = {
  stage: SignalNarrativeStage;
  reducedMotion: boolean;
};

type SignalAnnotationMotif = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const signalAnnotationMotifsByStage: Record<
  SignalNarrativeStage,
  readonly SignalAnnotationMotif[]
> = {
  capturing: [1, 4],
  inspecting: [2, 3, 5],
  evidence: [6, 7, 8],
  summary: [1, 2, 3, 6, 7, 8],
};

const motifBackgroundPosition: Record<SignalAnnotationMotif, string> = {
  1: "0% 0%",
  2: "33.333333% 0%",
  3: "66.666667% 0%",
  4: "100% 0%",
  5: "0% 100%",
  6: "33.333333% 100%",
  7: "66.666667% 100%",
  8: "100% 100%",
};

export function SignalNotebookAnnotations({
  stage,
  reducedMotion,
}: SignalNotebookAnnotationsProps) {
  const motifs = signalAnnotationMotifsByStage[stage];

  return (
    <div
      className="s3-signal-annotations"
      data-station3-signal-annotations={stage}
      data-station3-signal-annotation-source="sprite-sheet-v01"
      data-station3-signal-annotation-motifs={motifs.join(",")}
      data-station3-signal-annotations-motion={
        reducedMotion ? "reduced" : "normal"
      }
      aria-hidden="true"
    >
      {motifs.map((motif) => (
        <span
          className={`s3-signal-annotation-motif s3-signal-annotation-motif--${motif}`}
          data-station3-signal-annotation-motif={motif}
          key={motif}
          style={
            {
              backgroundImage: `url(${world3RuntimeAssets.signal.notebookMarksSheet})`,
              backgroundPosition: motifBackgroundPosition[motif],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
