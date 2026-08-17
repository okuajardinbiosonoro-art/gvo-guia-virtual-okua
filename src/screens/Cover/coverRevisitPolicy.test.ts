import { describe, expect, it } from "vitest";

import { createFinalCoverRevisitContext } from "../../app/review/finalReviewContext";
import type { GvoProgress } from "../../domain/progress/progress.types";
import { isCoverRevisitUnlocked } from "./coverRevisitPolicy";

const completeProgress: GvoProgress = {
  schemaVersion: 1,
  completedStations: [1, 2, 3, 4, 5],
  updatedAt: "2026-08-16T12:00:00.000Z",
};

describe("coverRevisitPolicy", () => {
  it("exige simultáneamente contexto canónico y progreso global completo", () => {
    const context = createFinalCoverRevisitContext(() => 1_787_000_000_000);

    expect(isCoverRevisitUnlocked(context, completeProgress)).toBe(true);
    expect(isCoverRevisitUnlocked(null, completeProgress)).toBe(false);
    expect(
      isCoverRevisitUnlocked(context, {
        ...completeProgress,
        completedStations: [1, 2, 3, 4],
      }),
    ).toBe(false);
  });
});
