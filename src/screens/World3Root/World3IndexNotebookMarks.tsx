import type { CSSProperties } from "react";

import { world3RuntimeAssets } from "./world3RuntimeAssets";

export type World3IndexProgress = 0 | 1 | 2 | 3;
export type World3IndexMotif = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const world3IndexMotifsByProgress = {
  0: [] as const,
  1: [1, 5, 6] as const,
  2: [1, 5, 6, 2, 3, 7] as const,
  3: [1, 5, 6, 2, 3, 7, 4, 8] as const,
} satisfies Record<World3IndexProgress, readonly World3IndexMotif[]>;

type World3IndexNotebookMarksProps = {
  completedCount: number;
};

function normalizeProgress(completedCount: number): World3IndexProgress {
  if (completedCount >= 3) return 3;
  if (completedCount >= 2) return 2;
  if (completedCount >= 1) return 1;
  return 0;
}

function spritePosition(motif: World3IndexMotif) {
  const zeroBased = motif - 1;
  const column = zeroBased % 4;
  const row = Math.floor(zeroBased / 4);
  return `${(column / 3) * 100}% ${row * 100}%`;
}

export function World3IndexNotebookMarks({
  completedCount,
}: World3IndexNotebookMarksProps) {
  const progress = normalizeProgress(completedCount);
  const motifs = world3IndexMotifsByProgress[progress];

  return (
    <div
      className="s3-index-marks"
      data-runtime-asset={world3RuntimeAssets.index.notebookMarksSheet}
      data-station3-index-marks="progressive"
      data-station3-index-progress={progress}
      data-station3-index-motifs={motifs.join(",")}
      aria-hidden="true"
    >
      {motifs.map((motif) => (
        <span
          className="s3-index-mark"
          data-station3-index-mark={motif}
          data-station3-index-mark-sprite={spritePosition(motif)}
          key={motif}
          style={
            {
              backgroundImage: `url(${world3RuntimeAssets.index.notebookMarksSheet})`,
              backgroundPosition: spritePosition(motif),
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
