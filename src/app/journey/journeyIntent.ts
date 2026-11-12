import { interstationQrContracts } from "../qr/interstationQr";
import { captureJourneyMutationToken, coherentProgressPrefixLength, getJourneyRuntimeContext, isEssentialExitReady, isJourneyResetInProgress, isJourneySnapshotCurrent, persistJourneyReceipt, readEssentialSnapshot, type EssentialScreen, type JourneyReceipt } from "./journeyEssential";
import { captureValidatedJourneyReviewContext, resolveJourneyAccess } from "./journeyAccess";
import { navigationStateForReceipt, validateJourneyReceipt, type JourneyReviewContext } from "./journeyReceipt";
const transactionStarts = new Map<string, number>();
let entryDeadline: number | null = null;
export function startEntryPreparation() { entryDeadline = performance.now() + 15000; return entryDeadline; }
export function readEntryPreparationDeadline() { return entryDeadline; }
export function finishEntryPreparation() { entryDeadline = null; }
export function receiptStartedAt(id: string) { if (!transactionStarts.has(id)) transactionStarts.set(id, performance.now()); return transactionStarts.get(id)!; }
if (typeof window !== "undefined") window.addEventListener("gvo:journey-reset-start", () => { transactionStarts.clear(); entryDeadline = null; });

export function pendingJourneyNavigationState() {
  const snapshot = readEssentialSnapshot(), receipt = snapshot?.pendingTransition;
  return snapshot && validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength()) ? navigationStateForReceipt(receipt) : undefined;
}

function persistIntent(receipt: JourneyReceipt, token: ReturnType<typeof captureJourneyMutationToken>) {
  const snapshot = readEssentialSnapshot();
  if (!snapshot || !validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength())) return false;
  if (!isJourneySnapshotCurrent(token)) return false;
  const pending = snapshot.pendingTransition;
  if (pending) {
    const acquiredQrResume = pending.kind === "qr" && receipt.kind === "legacy_resume" && pending.acceptedAuthorizationKind === "normal" && receipt.acceptedAuthorizationKind === "normal";
    return validateJourneyReceipt(pending, snapshot, coherentProgressPrefixLength()) && pending.from === receipt.from && pending.to === receipt.to && (pending.kind === receipt.kind || acquiredQrResume);
  }
  if (!persistJourneyReceipt(receipt, token).ok) return false;
  transactionStarts.set(receipt.transactionId, performance.now());
  return true;
}

/** The OS URL is explicit technical intent. It never fabricates source activity. */
export function acceptQrRouteIntent(origin: 1 | 2 | 3 | 4, navigationState?: unknown) {
  if (isJourneyResetInProgress()) return false;
  const token = captureJourneyMutationToken(), snapshot = readEssentialSnapshot();
  if (!snapshot) return false;
  const source = `/estacion/${origin}`, to = `/estacion/${origin + 1}`;
  const access = resolveJourneyAccess(source, navigationState);
  if (!access.authorized) return false;
  const reviewContext = captureValidatedJourneyReviewContext(source, navigationState);
  const receipt: JourneyReceipt = {
    transactionId: crypto.randomUUID(), from: origin, to,
    kind: access.mode !== "normal" ? "review_navigation" : coherentProgressPrefixLength() >= origin ? "legacy_resume" : "qr",
    acceptedAuthorizationKind: access.mode, canonicalPayload: interstationQrContracts[origin].payload,
    essentialRevision: snapshot.revision, phase: "pending", ...(reviewContext ? { reviewContext } : {}),
  };
  return persistIntent(receipt, token);
}

export type JourneyIntentInput = {
  from: EssentialScreen;
  to: string;
  kind: JourneyReceipt["kind"];
  attemptId: string | null;
  canonicalPayload?: string;
  reviewContext?: JourneyReviewContext | null;
};
/** UI callbacks must supply the attempt captured when they were scheduled. */
export function acceptJourneyIntent(input: JourneyIntentInput) {
  const { from, to, kind, attemptId, canonicalPayload, reviewContext } = input;
  const token = captureJourneyMutationToken(), context = getJourneyRuntimeContext(), snapshot = readEssentialSnapshot();
  if (isJourneyResetInProgress() || !attemptId || context.attemptId !== attemptId || !context.active || !context.authorized || context.screen !== from || document.visibilityState === "hidden" || !isEssentialExitReady(from, context) || !snapshot) return false;
  if (kind === "qr" && (typeof from !== "number" || from === 5 || canonicalPayload !== interstationQrContracts[from].payload || to !== `/estacion/${from + 1}`)) return false;
  const acquired = typeof from === "number" && coherentProgressPrefixLength() >= from;
  const resolvedKind = context.mode !== "normal" ? "review_navigation" : acquired && kind === "qr" ? "legacy_resume" : kind;
  const receipt: JourneyReceipt = {
    transactionId: crypto.randomUUID(), from, to, kind: resolvedKind,
    acceptedAuthorizationKind: context.mode, essentialRevision: snapshot.revision,
    ...(canonicalPayload !== undefined ? { canonicalPayload } : {}),
    ...(reviewContext ? { reviewContext } : {}), phase: "pending",
  };
  return persistIntent(receipt, token);
}
