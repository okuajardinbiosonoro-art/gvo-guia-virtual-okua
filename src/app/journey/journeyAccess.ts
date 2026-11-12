import { FINAL_REVIEW_CONTEXT_STORAGE_KEY } from "../review/finalReviewContext";
import { coherentProgressPrefixLength, readEssentialSnapshot, type EssentialScreen, type ValidatedJourneyContext } from "./journeyEssential";
import { hasCurrentFinalRight, navigationStateForReceipt, parseJourneyReviewContext, reviewAuthority, reviewContextMatchesRoute, validateJourneyReceipt } from "./journeyReceipt";
export { hasLegacyContradiction } from "./journeyLegacyEvidence";
export function screenForRoute(route: string): EssentialScreen | "final" | null {
  route = route === "/" ? route : route.replace(/\/+$/, "");
  if (route === "/portada") return "cover";
  if (route === "/final") return "final";
  const match = /^\/estacion\/([1-5])(?:\/(plantas|sistema|espacio|visitante))?$/.exec(route);
  if (!match || (match[2] && match[1] !== "5")) return null;
  return Number(match[1]) as 1 | 2 | 3 | 4 | 5;
}
function rawSessionContext(): unknown {
  try { const raw = window.sessionStorage.getItem(FINAL_REVIEW_CONTEXT_STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function captureValidatedJourneyReviewContext(route: string, navigationState: unknown) {
  route = route === "/" ? route : route.replace(/\/+$/, "");
  const snapshot = readEssentialSnapshot();
  if (!snapshot || !reviewAuthority(snapshot, coherentProgressPrefixLength())) return null;
  const state = navigationState && typeof navigationState === "object" ? navigationState as Record<string, unknown> : null;
  const hasContext = state && ("finalReview" in state || "finalCoverRevisit" in state);
  const raw = hasContext ? ("finalReview" in state ? state.finalReview : state.finalCoverRevisit) : rawSessionContext();
  const parsed = parseJourneyReviewContext(raw);
  return parsed && reviewContextMatchesRoute(parsed, route) ? parsed : null;
}
export function resolveJourneyAccess(route: string, navigationState: unknown): ValidatedJourneyContext {
  route = route === "/" ? route : route.replace(/\/+$/, "");
  const screen = screenForRoute(route), snapshot = readEssentialSnapshot(), prefix = coherentProgressPrefixLength();
  const finalRight = Boolean(snapshot && hasCurrentFinalRight(snapshot, prefix));
  const receipt = snapshot?.pendingTransition;
  const pendingAccess = Boolean(snapshot && validateJourneyReceipt(receipt, snapshot, prefix, route));
  const transported = pendingAccess && receipt?.kind === "review_navigation" ? navigationStateForReceipt(receipt) : undefined;
  const review = captureValidatedJourneyReviewContext(route, transported ?? navigationState);
  const mode = review && snapshot ? reviewAuthority(snapshot, prefix)! : "normal";
  const authorized = screen === null || mode !== "normal" ||
    (screen === "cover") ||
    (screen === "final" ? finalRight || pendingAccess : typeof screen === "number" ?
      Boolean(snapshot?.cover.closed && Array.from({ length: screen - 1 }, (_, index) => snapshot.stations[(index + 1) as 1 | 2 | 3 | 4].closed).every(Boolean) && (screen === 1 || prefix >= screen - 1 || pendingAccess)) : false);
  return { active: false, attemptId: null, screen, mode, authorized, reviewReturnAllowed: mode !== "normal" };
}

/** The acquired bit is preserved; recovery resumes the first still-unconfirmed essence. */
export function essentialRecoveryRoute() {
  const snapshot = readEssentialSnapshot(), prefix = coherentProgressPrefixLength();
  if (!snapshot?.cover.closed) return "/portada";
  for (let world = 1; world <= 5; world++) {
    const id = world as 1 | 2 | 3 | 4 | 5;
    if (!snapshot.stations[id].closed) return `/estacion/${Math.max(1, Math.min(world, prefix + 1))}`;
    if (prefix < world) return `/estacion/${world}`;
  }
  return snapshot.finalReached ? "/final" : "/estacion/5";
}
