import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  beginFinalReview,
  clearFinalReviewContext,
  createFinalReviewContext,
  FINAL_REVIEW_CONTEXT_STORAGE_KEY,
  finalReviewWorldForPathname,
  parseFinalReviewContext,
  readFinalReviewContext,
  resolveFinalReviewContext,
} from "./finalReviewContext";

describe("finalReviewContext", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("crea y persiste el contrato versionado exacto desde Final", () => {
    const state = beginFinalReview(
      3,
      window.sessionStorage,
      () => 1_785_849_600_000,
    );

    expect(state).toEqual({
      finalReview: {
        origin: "/final",
        mode: "final-review",
        world: 3,
        startedAt: "2026-08-04T13:20:00.000Z",
        timestamp: 1_785_849_600_000,
        version: 1,
      },
    });
    expect(readFinalReviewContext()).toEqual(state.finalReview);
  });

  it("prefiere navigation state y conserva el contexto para refresh", () => {
    const navigationContext = createFinalReviewContext(
      5,
      () => 1_785_849_600_000,
    );

    expect(
      resolveFinalReviewContext(
        { finalReview: navigationContext },
        5,
        window.sessionStorage,
      ),
    ).toEqual(navigationContext);
    expect(resolveFinalReviewContext(null, 5, window.sessionStorage)).toEqual(
      navigationContext,
    );
  });

  it("elimina JSON corrupto y contratos con forma o version inválida", () => {
    window.sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      "{corrupto",
    );
    expect(readFinalReviewContext()).toBeNull();
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();

    window.sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify({
        origin: "/final",
        mode: "final-review",
        world: 1,
        startedAt: "not-a-date",
        timestamp: 0,
        version: 2,
      }),
    );
    expect(readFinalReviewContext()).toBeNull();
    expect(parseFinalReviewContext({ world: 1 })).toBeNull();

    beginFinalReview(1);
    expect(
      resolveFinalReviewContext({ finalReview: { world: 1 } }, 1),
    ).toBeNull();
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
  });

  it("invalida el contexto al abrir un Mundo diferente", () => {
    beginFinalReview(1);

    expect(resolveFinalReviewContext(null, 2)).toBeNull();
    expect(
      window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY),
    ).toBeNull();
  });

  it("tolera sessionStorage bloqueado sin impedir navigation state", () => {
    const blockedStorage = {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      removeItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      setItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    };
    const state = beginFinalReview(4, blockedStorage, () => 1_785_849_600_000);

    expect(resolveFinalReviewContext(state, 4, blockedStorage)).toEqual(
      state.finalReview,
    );
    expect(() => clearFinalReviewContext(blockedStorage)).not.toThrow();
  });

  it("reconoce sólo las rutas reales de los Mundos y subrutas de Mundo V", () => {
    expect(finalReviewWorldForPathname("/estacion/1")).toBe(1);
    expect(finalReviewWorldForPathname("/estacion/5/plantas")).toBe(5);
    expect(finalReviewWorldForPathname("/estacion/5/visitante/")).toBe(5);
    expect(finalReviewWorldForPathname("/estacion/2/inventada")).toBeNull();
    expect(finalReviewWorldForPathname("/estacion/6")).toBeNull();
    expect(finalReviewWorldForPathname("/final")).toBeNull();
  });
});
