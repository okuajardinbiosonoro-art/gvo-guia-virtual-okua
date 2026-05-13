import { beforeEach, describe, expect, it } from "vitest";

import {
  canOpenFinal,
  canOpenStation,
  markStationCompleted,
  readProgress,
  resetProgress,
} from "./progress.storage";

describe("progress storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("lee progreso vacio cuando localStorage no tiene datos", () => {
    expect(readProgress()).toEqual({
      completedStations: [],
      updatedAt: null,
    });
  });

  it("marca estaciones completadas sin duplicarlas", () => {
    markStationCompleted(1);
    markStationCompleted(1);

    expect(readProgress().completedStations).toEqual([1]);
  });

  it("permite abrir estaciones solo en orden secuencial", () => {
    expect(canOpenStation(1)).toBe(true);
    expect(canOpenStation(2)).toBe(false);

    const afterStationOne = markStationCompleted(1);

    expect(canOpenStation(2, afterStationOne)).toBe(true);
    expect(canOpenStation(3, afterStationOne)).toBe(false);
  });

  it("permite final solo despues de completar estacion 5", () => {
    expect(canOpenFinal()).toBe(false);

    markStationCompleted(5);

    expect(canOpenFinal()).toBe(true);
  });

  it("reinicia progreso guardado", () => {
    markStationCompleted(1);
    resetProgress();

    expect(readProgress()).toEqual({
      completedStations: [],
      updatedAt: null,
    });
  });
});
