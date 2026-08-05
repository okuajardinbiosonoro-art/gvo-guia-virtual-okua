import { beforeEach, describe, expect, it, vi } from "vitest";

import { GVO_PROGRESS_STORAGE_KEY } from "../domain/progress/progress.storage";
import {
  requireFinalAccess,
  requireStationAccess,
  requireTransitionAccess,
} from "./router";
import {
  stationEntryRoutes,
  worldFiveEntryRoute,
  worldOneEntryRoute,
  worldTwoEntryRoute,
} from "./routes";
import { FINAL_REVIEW_CONTEXT_STORAGE_KEY } from "./review/finalReviewContext";

function expectReplace(result: Response | null, destination: string) {
  expect(result).toBeInstanceOf(Response);

  const response = result as Response;
  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(destination);
  expect(response.headers.get("X-Remix-Replace")).toBe("true");
}

function seedProgress(completedStations: number[], schemaVersion: 1 | 2 = 1) {
  window.localStorage.setItem(
    GVO_PROGRESS_STORAGE_KEY,
    JSON.stringify({
      schemaVersion,
      completedStations,
      updatedAt: "2026-08-05T12:00:00.000Z",
    }),
  );
}

describe("global journey access guards", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("permite Mundo I con estado vacío y bloquea W2–W5 hacia W1", () => {
    expect(requireStationAccess(1)).toBeNull();
    for (const stationId of [2, 3, 4, 5] as const) {
      expectReplace(requireStationAccess(stationId), worldOneEntryRoute);
    }
  });

  it("exige el prefijo completo y calcula el Mundo seguro más avanzado", () => {
    const cases = [
      { completed: [1], allowed: 2, blocked: [3, 4, 5], safe: 2 },
      { completed: [1, 2], allowed: 3, blocked: [4, 5], safe: 3 },
      { completed: [1, 2, 3], allowed: 4, blocked: [5], safe: 4 },
      { completed: [1, 2, 3, 4], allowed: 5, blocked: [], safe: 5 },
    ] as const;

    for (const testCase of cases) {
      seedProgress([...testCase.completed]);
      expect(requireStationAccess(testCase.allowed)).toBeNull();
      for (const stationId of testCase.blocked) {
        expectReplace(
          requireStationAccess(stationId),
          stationEntryRoutes[testCase.safe],
        );
      }
    }
  });

  it("preserva completion dispersa pero no permite saltar huecos", () => {
    for (const testCase of [
      { completed: [5], safe: worldOneEntryRoute },
      { completed: [4, 5], safe: worldOneEntryRoute },
      { completed: [1, 4, 5], safe: worldTwoEntryRoute },
    ]) {
      seedProgress(testCase.completed);
      expectReplace(requireStationAccess(5), testCase.safe);
      expectReplace(requireFinalAccess(), testCase.safe);
    }
  });

  it("protege las cinco transiciones con el mismo prefijo secuencial", () => {
    for (const origin of [1, 2, 3, 4, 5] as const) {
      seedProgress(Array.from({ length: origin }, (_, index) => index + 1));
      expect(requireTransitionAccess(origin)).toBeNull();

      seedProgress(
        origin === 1
          ? []
          : Array.from({ length: origin - 1 }, (_, index) => index + 1),
      );
      expectReplace(
        requireTransitionAccess(origin),
        stationEntryRoutes[origin],
      );
    }
  });

  it("Final exige explícitamente I–V y usa el mismo destino seguro", () => {
    seedProgress([1, 2, 3, 4]);
    expectReplace(requireFinalAccess(), worldFiveEntryRoute);

    seedProgress([1, 2, 3, 4, 5]);
    expect(requireFinalAccess()).toBeNull();
    expect(requireTransitionAccess(5)).toBeNull();
  });

  it("falla cerrado ante corrupción, versión desconocida y storage bloqueado", () => {
    window.localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, "{corrupto");
    expectReplace(requireStationAccess(5), worldOneEntryRoute);
    expectReplace(requireFinalAccess(), worldOneEntryRoute);

    seedProgress([1, 2, 3, 4, 5], 2);
    expectReplace(requireStationAccess(5), worldOneEntryRoute);
    expectReplace(requireFinalAccess(), worldOneEntryRoute);

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    expectReplace(requireStationAccess(5), worldOneEntryRoute);
    expectReplace(requireFinalAccess(), worldOneEntryRoute);
  });

  it("invalida el contexto de revisita cuando un guard bloquea acceso", () => {
    window.sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      "contexto-sintacticamente-ajeno",
    );
    seedProgress([1]);

    expectReplace(requireStationAccess(5), worldTwoEntryRoute);
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
  });
});
