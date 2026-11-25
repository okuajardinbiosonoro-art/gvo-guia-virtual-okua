/** A newly reached room may need a cold download even after a cached page reload. */
export function journeyPreparationBudgetMs(hasAcceptedQr = false): number {
  if (hasAcceptedQr) return 45_000;
  const navigation = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (navigation && navigation.requestStart > 0 && navigation.responseStart - navigation.requestStart >= 250) return 45_000;
  const resources = (performance.getEntriesByType?.("resource") ?? []) as PerformanceResourceTiming[];
  const slowTransfer = resources.some(entry =>
    entry.transferSize >= 64_000 && entry.responseEnd > entry.requestStart &&
    entry.transferSize / (entry.responseEnd - entry.requestStart) < 1_000
  );
  return slowTransfer ? 45_000 : 15_000;
}
