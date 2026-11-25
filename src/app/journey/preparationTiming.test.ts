import { afterEach, describe, expect, it, vi } from "vitest";
import { journeyPreparationBudgetMs } from "./preparationTiming";

describe("journeyPreparationBudgetMs", () => {
  afterEach(() => vi.unstubAllGlobals());

  function timings(navigation: object[], resources: object[]) {
    vi.stubGlobal("performance", {
      getEntriesByType: (type: string) => type === "navigation" ? navigation : resources,
    });
  }

  it("keeps the regular limit for fast or cached responses", () => {
    timings([{ requestStart: 10, responseStart: 70 }], [{ transferSize: 0, requestStart: 3, responseEnd: 1200 }]);
    expect(journeyPreparationBudgetMs()).toBe(15_000);
  });

  it("budgets a cold room download after a QR even if the navigation was cached", () => {
    timings([], [{ transferSize: 0, requestStart: 3, responseEnd: 5 }]);
    expect(journeyPreparationBudgetMs(true)).toBe(45_000);
  });

  it("allows an in-progress transfer time to finish on a high-latency connection", () => {
    timings([{ requestStart: 15, responseStart: 575 }], []);
    expect(journeyPreparationBudgetMs()).toBe(45_000);
  });

  it("recognizes slow asset transfer even when the entry HTML was already cached", () => {
    timings([], [{ transferSize: 180_000, requestStart: 25, responseEnd: 1750 }]);
    expect(journeyPreparationBudgetMs()).toBe(45_000);
  });
});
