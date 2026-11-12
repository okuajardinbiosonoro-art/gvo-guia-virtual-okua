import { interstationQrContracts } from "../qr/interstationQr";
import { parseFinalCoverRevisitContext, parseFinalReviewContext, type FinalCoverRevisitContext, type FinalReviewContext, type FinalReviewNavigationState, type FinalCoverRevisitNavigationState } from "../review/finalReviewContext";
import type { EssentialAccessMode, EssentialScreen, JourneyReceipt, VerifiedEssentialSnapshot } from "./journeyEssential";
import { hasLegacyContradiction } from "./journeyLegacyEvidence";
import { hasWorld4NewAdvanceProof } from "../../domain/checkpoints/world4ExplanationCheckpoint";

export type JourneyReviewContext = FinalReviewContext | FinalCoverRevisitContext;
export type JourneyReviewNavigationState = FinalReviewNavigationState | FinalCoverRevisitNavigationState;
export function parseJourneyReviewContext(value: unknown): JourneyReviewContext | null {
  return parseFinalReviewContext(value) ?? parseFinalCoverRevisitContext(value);
}
export function reviewContextMatchesRoute(context: JourneyReviewContext, route: string) {
  if (route === "/final") return true;
  if (context.mode === "final-cover-revisit") return route === "/portada";
  const match = /^\/estacion\/([1-5])(?:\/(plantas|sistema|espacio|visitante))?$/.exec(route);
  return Boolean(match && Number(match[1]) === context.world && (!match[2] || context.world === 5));
}
export function reviewAuthority(snapshot: VerifiedEssentialSnapshot, prefix: number): EssentialAccessMode | null {
  return hasCurrentFinalRight(snapshot, prefix) ? "obs03_review" : prefix === 5 && !hasLegacyContradiction() ? "legacy_review_compatible" : null;
}
export function hasCurrentFinalRight(snapshot: VerifiedEssentialSnapshot, prefix: number) {
  return snapshot.finalReached && prefix === 5 && snapshot.cover.closed && [1, 2, 3, 4, 5].every((world) => snapshot.stations[world as 1 | 2 | 3 | 4 | 5].closed);
}
export function navigationStateForReceipt(receipt: JourneyReceipt): JourneyReviewNavigationState | undefined {
  const context = parseJourneyReviewContext(receipt.reviewContext);
  if (receipt.kind !== "review_navigation" || !context) return undefined;
  const target = /^\/estacion\/([1-5])$/.exec(receipt.to);
  if (target) return { finalReview: { ...context, mode: "final-review", world: Number(target[1]) as 1 | 2 | 3 | 4 | 5 } };
  return context.mode === "final-review" ? { finalReview: context } : { finalCoverRevisit: context };
}

/** One authority for persisted shape and live processing; no runtime store import. */
export function validateJourneyReceipt(value: unknown, snapshot: VerifiedEssentialSnapshot, prefix: number, destination?: string, policy: "live" | "persisted_shape" = "live"): value is JourneyReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as JourneyReceipt;
  if (typeof receipt.transactionId !== "string" || !receipt.transactionId.trim() || receipt.transactionId.length > 100 ||
    !["cover", 1, 2, 3, 4, 5].includes(receipt.from) || typeof receipt.to !== "string" ||
    !["pending", "commit_verification_pending", "committed_pending_reveal", "revealed_pending_cleanup"].includes(receipt.phase) ||
    !["normal", "obs03_review", "legacy_review_compatible"].includes(receipt.acceptedAuthorizationKind) ||
    !Number.isSafeInteger(receipt.essentialRevision) || receipt.essentialRevision < 0 || receipt.essentialRevision > snapshot.revision ||
    destination !== undefined && receipt.to !== destination) return false;
  const origin = receipt.from;
  if (receipt.kind === "review_navigation") {
    const context = parseJourneyReviewContext(receipt.reviewContext);
    const originRoute = origin === "cover" ? "/portada" : `/estacion/${origin}`;
    const acceptedRight = receipt.acceptedAuthorizationKind === "obs03_review" ? hasCurrentFinalRight(snapshot, prefix) : receipt.acceptedAuthorizationKind === "legacy_review_compatible" && prefix === 5 && !hasLegacyContradiction();
    if (!context || !reviewContextMatchesRoute(context, originRoute) || !acceptedRight || !/^\/(?:estacion\/[1-5]|final)$/.test(receipt.to)) return false;
    if (receipt.canonicalPayload !== undefined && (typeof origin !== "number" || origin > 4 || receipt.to !== `/estacion/${origin + 1}` || receipt.canonicalPayload !== interstationQrContracts[origin as 1 | 2 | 3 | 4].payload)) return false;
    return true;
  }
  if (receipt.acceptedAuthorizationKind !== "normal" || receipt.reviewContext !== undefined) return false;
  const sourceClosed = snapshot.cover.closed && (origin === "cover" || Array.from({ length: origin }, (_, index) => snapshot.stations[(index + 1) as Exclude<EssentialScreen, "cover">].closed).every(Boolean));
  if (!sourceClosed) return false;
  if (receipt.kind === "portal") return origin === "cover" && receipt.to === "/estacion/1" && receipt.canonicalPayload === undefined;
  if (policy === "live" && origin === 4 && prefix < 4 && !hasWorld4NewAdvanceProof(snapshot.stations[4].outcome)) return false;
  if (typeof origin !== "number" || prefix < origin - 1) return false;
  const next = origin === 5 ? "/final" : `/estacion/${origin + 1}`;
  if (receipt.to !== next) return false;
  if ((receipt.phase === "committed_pending_reveal" || receipt.phase === "revealed_pending_cleanup") && prefix < origin) return false;
  if (receipt.kind === "qr") return origin < 5 && receipt.canonicalPayload === interstationQrContracts[origin as 1 | 2 | 3 | 4].payload;
  if (receipt.kind === "result_closure") return origin === 5 && receipt.canonicalPayload === undefined;
  if (receipt.kind === "legacy_resume") return prefix >= origin && (receipt.canonicalPayload === undefined || origin < 5 && receipt.canonicalPayload === interstationQrContracts[origin as 1 | 2 | 3 | 4].payload);
  return false;
}
