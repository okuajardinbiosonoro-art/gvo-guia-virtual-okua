import { beforeEach, describe, expect, it, vi } from "vitest";

import { GVO_PROGRESS_STORAGE_KEY } from "../domain/progress/progress.storage";
import { requireFinalAccess } from "./router";
import { worldFiveEntryRoute } from "./routes";

function expectWorldFiveReplace(result: Response | null) {
  expect(result).toBeInstanceOf(Response);

  const response = result as Response;
  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(worldFiveEntryRoute);
  expect(response.headers.get("X-Remix-Replace")).toBe("true");
}

describe("requireFinalAccess", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("redirige con replace cuando la Estacion V no esta completada", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        completedStations: [1, 2, 3, 4],
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    );

    expectWorldFiveReplace(requireFinalAccess());
  });

  it("permite el acceso cuando la Estacion V esta completada", () => {
    window.localStorage.setItem(
      GVO_PROGRESS_STORAGE_KEY,
      JSON.stringify({
        completedStations: [1, 2, 3, 4, 5],
        updatedAt: "2026-07-30T12:00:00.000Z",
      }),
    );

    expect(requireFinalAccess()).toBeNull();
  });

  it("falla cerrado cuando el progreso contiene JSON corrupto", () => {
    window.localStorage.setItem(GVO_PROGRESS_STORAGE_KEY, "{corrupto");

    expectWorldFiveReplace(requireFinalAccess());
  });

  it("falla cerrado cuando localStorage.getItem lanza una excepcion", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expectWorldFiveReplace(requireFinalAccess());
  });
});
