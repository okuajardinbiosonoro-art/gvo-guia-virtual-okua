import { useSyncExternalStore } from "react";
import { readProgress } from "../../domain/progress/progress.storage";
import { WORLD2_REQUIRED_INTERACTION_ORDER } from "../../domain/checkpoints/world2Checkpoint";
import { hasWorld5ParticipationProof } from "../../screens/World5Root/world5Quiz";
import { WORLD4_ORDERING_TARGET, readWorld4OrderingCheckpoint } from "../../domain/checkpoints/world4OrderingCheckpoint";
import type { World4OrderingId } from "../../domain/checkpoints/world4OrderingCheckpoint";
import { WORLD4_EXPLANATION_STORAGE_KEY, WORLD4_EXPLANATION_REVISION, readWorld4ExplanationCheckpoint, writeWorld4ExplanationCheckpoint, hasWorld4NewAdvanceProof } from "../../domain/checkpoints/world4ExplanationCheckpoint";
import { validateJourneyReceipt, type JourneyReviewContext } from "./journeyReceipt";

export const ESSENTIAL_STORAGE_KEY = "gvo.journey.essential.v1";
export const ESSENTIAL_CONTENT_REVISION = "OBS03.2";
export type EssentialScreen = "cover" | 1 | 2 | 3 | 4 | 5;
export type EssentialAccessMode = "normal" | "obs03_review" | "legacy_review_compatible";
export const essentialSteps: Record<EssentialScreen, readonly string[]> = {
  cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"],
  1: ["intro", "relacion", "percepcion", "mediacion"],
  2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"],
  3: ["INTRO", "PASO A PASO", "BENEFICIOS"],
  4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"],
  5: ["plantas", "sistema", "espacio", "visitante", "resultado"],
};
export type World2UiFact = {
  kind: "required_interaction" | "capture_step" | "mapping_first_run";
  id: string;
  contentRevision: string;
  origin?: "visitor_ui";
};
export type EssentialRoom = {
  contentRevision: string;
  presentedStepIds: string[];
  confirmedStepIds: string[];
  assistedPresentedStepIds: string[];
  activeStepId: string | null;
  interactionEvidence: World2UiFact[];
  outcome: string | null;
  closed: boolean;
};
export type JourneyReceipt = {
  transactionId: string;
  from: EssentialScreen;
  to: string;
  kind: "qr" | "portal" | "result_closure" | "legacy_resume" | "review_navigation";
  acceptedAuthorizationKind: EssentialAccessMode;
  essentialRevision: number;
  canonicalPayload?: string;
  reviewContext?: JourneyReviewContext;
  phase: "pending" | "commit_verification_pending" | "committed_pending_reveal" | "revealed_pending_cleanup";
};
export type VerifiedEssentialSnapshot = {
  schemaVersion: 1;
  contractRevision: typeof ESSENTIAL_CONTENT_REVISION;
  revision: number;
  cover: EssentialRoom;
  stations: Record<1 | 2 | 3 | 4 | 5, EssentialRoom>;
  legacyRouteCredit: number;
  migrationEvidence: { source: "captured_before_mount"; globalStatus: string };
  pendingTransition: JourneyReceipt | null;
  finalReached: boolean;
};
export type ValidatedJourneyContext = {
  active: boolean;
  attemptId: string | null;
  screen: EssentialScreen | "final" | null;
  mode: EssentialAccessMode;
  authorized: boolean;
  reviewReturnAllowed: boolean;
};
export type EssentialWriteResult =
  | { ok: true; snapshot: VerifiedEssentialSnapshot; alreadyApplied: boolean }
  | { ok: false; reason: "inactive" | "read_only_review" | "unauthorized" | "out_of_order" | "stale_revision" | "storage_unverified"; snapshot: VerifiedEssentialSnapshot | null };
export type VerifiedEssentialView = {
  attemptId: string | null;
  snapshot: VerifiedEssentialSnapshot | null;
  presented: readonly string[];
  confirmed: readonly string[];
  presentedStepIds: readonly string[];
  confirmedStepIds: readonly string[];
  assistedPresentedStepIds: readonly string[];
  activeStepId: string | null;
  firstPendingStepId: string | null;
  closed: boolean;
  revision: number;
  contentRevision: string;
  mode: EssentialAccessMode;
  readOnly: boolean;
  readinessReason: "closed" | "review" | "pending" | "storage_unverified";
  exitReady: boolean;
  storageVerified: boolean;
};

let runtime: ValidatedJourneyContext = { active: false, attemptId: null, screen: null, mode: "normal", authorized: false, reviewReturnAllowed: false };
const listeners = new Set<() => void>();
let initialized = false;
let verified: VerifiedEssentialSnapshot | null = null;
let rawAtLastRead: string | null = null;
let storageProblem = false;
let epoch = 0;
let resetBarrier = false;
let resetSerial = 0;
let storeVersion = 0;
const emptyRoom = (screen: EssentialScreen): EssentialRoom => ({ contentRevision: ESSENTIAL_CONTENT_REVISION, presentedStepIds: [], confirmedStepIds: [], assistedPresentedStepIds: [], activeStepId: essentialSteps[screen][0], interactionEvidence: [], outcome: null, closed: false });

export function coherentProgressPrefixLength(): number {
  const result = readProgress();
  const ids = result.progress?.completedStations ?? [];
  let length = 0;
  while (ids.includes((length + 1) as 1 | 2 | 3 | 4 | 5) && length < 5) length++;
  return length;
}
function freshSnapshot(): VerifiedEssentialSnapshot {
  return { schemaVersion: 1, contractRevision: ESSENTIAL_CONTENT_REVISION, revision: 0,
    cover: emptyRoom("cover"), stations: { 1: emptyRoom(1), 2: emptyRoom(2), 3: emptyRoom(3), 4: emptyRoom(4), 5: emptyRoom(5) },
    legacyRouteCredit: coherentProgressPrefixLength(), migrationEvidence: { source: "captured_before_mount", globalStatus: readProgress().status }, pendingTransition: null, finalReached: false };
}
function roomOf(snapshot: VerifiedEssentialSnapshot, screen: EssentialScreen) { return screen === "cover" ? snapshot.cover : snapshot.stations[screen]; }
function isStringArray(value: unknown): value is string[] { return Array.isArray(value) && value.every((id) => typeof id === "string") && new Set(value).size === value.length; }
function validWorld2Fact(value: unknown): value is World2UiFact {
  if (!value || typeof value !== "object") return false;
  const fact = value as World2UiFact;
  if (fact.contentRevision !== ESSENTIAL_CONTENT_REVISION || fact.origin !== "visitor_ui") return false;
  return fact.kind === "required_interaction" ? (WORLD2_REQUIRED_INTERACTION_ORDER as readonly string[]).includes(fact.id) : fact.kind === "capture_step" ? ["contact", "signal", "system"].includes(fact.id) : fact.kind === "mapping_first_run" && fact.id === "mapping_first_run";
}
export function parseEssentialSnapshot(raw: string): VerifiedEssentialSnapshot | null {
  try {
    const s = JSON.parse(raw) as VerifiedEssentialSnapshot;
    if (s.schemaVersion !== 1 || s.contractRevision !== ESSENTIAL_CONTENT_REVISION || !Number.isSafeInteger(s.revision) || s.revision < 0 || !s.stations || !Number.isInteger(s.legacyRouteCredit) || s.legacyRouteCredit < 0 || s.legacyRouteCredit > 5 || typeof s.finalReached !== "boolean") return null;
    for (const screen of ["cover", 1, 2, 3, 4, 5] as const) {
      const r = roomOf(s, screen), order = essentialSteps[screen];
      if (!r || r.contentRevision !== ESSENTIAL_CONTENT_REVISION || !isStringArray(r.presentedStepIds) || !isStringArray(r.confirmedStepIds) || !isStringArray(r.assistedPresentedStepIds) || !Array.isArray(r.interactionEvidence) || r.interactionEvidence.length > 40 || typeof r.closed !== "boolean") return null;
      if (r.presentedStepIds.some((id) => !order.includes(id)) || r.assistedPresentedStepIds.some((id) => !r.presentedStepIds.includes(id)) || r.confirmedStepIds.some((id, index) => id !== order[index] || !r.presentedStepIds.includes(id)) || (r.closed && r.confirmedStepIds.length !== order.length)) return null;
      if (r.activeStepId !== (order[r.confirmedStepIds.length] ?? null)) return null;
      if (r.outcome !== null && typeof r.outcome !== "string") return null;
      if (screen === 4 && ((r.outcome !== null && !["solved", "assisted_review_completed"].includes(r.outcome)) || (r.closed && r.outcome === null))) return null;
      if (r.interactionEvidence.some((fact) => !validWorld2Fact(fact)) || new Set(r.interactionEvidence.map((fact) => `${fact.kind}:${fact.id}`)).size !== r.interactionEvidence.length || (screen !== 2 && r.interactionEvidence.length !== 0)) return null;
    }
    if (s.finalReached && (!s.cover.closed || ![1, 2, 3, 4, 5].every((world) => s.stations[world as 1 | 2 | 3 | 4 | 5].closed))) return null;
    if (s.pendingTransition !== null && !validateJourneyReceipt(s.pendingTransition, s, coherentProgressPrefixLength(), undefined, "persisted_shape")) return null;
    return s;
  } catch { return null; }
}
function emit() { storeVersion++; for (const listener of listeners) listener(); }
function storage() { try { return window.localStorage; } catch { return null; } }
export function initializeJourneyEssential(): VerifiedEssentialSnapshot | null {
  if (initialized) return verified;
  initialized = true;
  const target = storage();
  if (!target) { storageProblem = true; return null; }
  try {
    rawAtLastRead = target.getItem(ESSENTIAL_STORAGE_KEY);
    verified = rawAtLastRead === null ? freshSnapshot() : parseEssentialSnapshot(rawAtLastRead);
    storageProblem = !verified;
  } catch { storageProblem = true; }
  return verified;
}
export function readEssentialSnapshot() { return initializeJourneyEssential(); }
export function setJourneyRuntimeContext(context: ValidatedJourneyContext) { runtime = resetBarrier ? { ...context, active: false, authorized: false, attemptId: null } : context; emit(); }
export function getJourneyRuntimeContext() { return runtime; }
export function isJourneyResetInProgress() { return resetBarrier; }
export type JourneyMutationToken = Readonly<{ epoch: number; resetSerial: number }>;
export function captureJourneyMutationToken(): JourneyMutationToken { return { epoch, resetSerial }; }
export function isJourneyMutationTokenCurrent(token: JourneyMutationToken) { return !resetBarrier && token?.epoch === epoch && token?.resetSerial === resetSerial; }
/** Exact persisted bytes must still match the verified cache at a commit boundary. */
export function isJourneySnapshotCurrent(token: JourneyMutationToken) {
  if (!isJourneyMutationTokenCurrent(token) || !initialized || !verified || storageProblem) return false;
  try { const target = storage(); return Boolean(target && target.getItem(ESSENTIAL_STORAGE_KEY) === rawAtLastRead); } catch { return false; }
}
export function beginJourneyReset() {
  resetBarrier = true; resetSerial++; epoch++;
  runtime = { ...runtime, active: false, authorized: false, attemptId: null };
  emit();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("gvo:journey-reset-start"));
  return resetSerial;
}
export function finishJourneyReset(serial: number) {
  if (serial !== resetSerial) return;
  resetBarrier = false;
  runtime = { ...runtime, active: false, authorized: false, attemptId: null };
  invalidateJourneyEssential();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("gvo:journey-reset"));
}
export function invalidateJourneyEssential() {
  epoch++; initialized = false; verified = null; rawAtLastRead = null; storageProblem = false;
  initializeJourneyEssential(); emit();
}
if (typeof window !== "undefined") window.addEventListener("storage", (event) => {
  if (event.key === ESSENTIAL_STORAGE_KEY || event.key === "gvo.progress.v1" || event.key === WORLD4_EXPLANATION_STORAGE_KEY || event.key === null) invalidateJourneyEssential();
});
export function subscribeEssential(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function failure(reason: Extract<EssentialWriteResult, { ok: false }>["reason"]): EssentialWriteResult { return { ok: false, reason, snapshot: verified }; }
function writeVerified(next: VerifiedEssentialSnapshot): EssentialWriteResult {
  const target = storage();
  if (!target || storageProblem) return failure("storage_unverified");
  const token = epoch;
  try {
    if (target.getItem(ESSENTIAL_STORAGE_KEY) !== rawAtLastRead) { invalidateJourneyEssential(); return failure("stale_revision"); }
    const raw = JSON.stringify(next);
    if (resetBarrier || token !== epoch) return failure("stale_revision");
    target.setItem(ESSENTIAL_STORAGE_KEY, raw);
    if (token !== epoch || target.getItem(ESSENTIAL_STORAGE_KEY) !== raw || !parseEssentialSnapshot(raw)) return failure("storage_unverified");
    rawAtLastRead = raw; verified = next; storageProblem = false; emit();
    return { ok: true, snapshot: next, alreadyApplied: false };
  } catch { return failure("storage_unverified"); }
}
function semanticGuard(screen: EssentialScreen, contentRevision: string, attemptId: string | null): EssentialWriteResult | null {
  initializeJourneyEssential();
  if (resetBarrier || !runtime.active || (typeof document !== "undefined" && document.visibilityState === "hidden")) return failure("inactive");
  if (!attemptId || runtime.attemptId !== attemptId) return failure("stale_revision");
  if (runtime.mode !== "normal") return failure("read_only_review");
  if (!runtime.authorized || runtime.screen !== screen) return failure("unauthorized");
  if (contentRevision !== ESSENTIAL_CONTENT_REVISION) return failure("stale_revision");
  if (!verified || storageProblem) return failure("storage_unverified");
  return null;
}
function cloneForWrite() { const next = structuredClone(verified!); next.revision++; return next; }
export type World4ExplanationMutationInput = {
  stepId: World4OrderingId;
  contentRevision: typeof WORLD4_EXPLANATION_REVISION;
  attemptId: string | null;
};
export function refreshWorld4ExplanationFlow() { emit(); }
export function useWorld4ExplanationFlow() {
  useSyncExternalStore(subscribeEssential, () => storeVersion, () => 0);
  const read = readWorld4ExplanationCheckpoint();
  const readOnly = runtime.mode !== "normal";
  return { status: read.status, presentedStepIds: read.checkpoint.presentedStepIds,
    confirmedStepIds: read.checkpoint.confirmedStepIds, activeStepId: read.checkpoint.activeStepId,
    complete: read.status === "ok" && read.checkpoint.complete,
    required: !readOnly && coherentProgressPrefixLength() < 4 && !(read.status === "ok" && read.checkpoint.complete),
    readOnly, contentRevision: WORLD4_EXPLANATION_REVISION as typeof WORLD4_EXPLANATION_REVISION };
}
async function mutateWorld4Explanation(input: World4ExplanationMutationInput, confirm: boolean): Promise<{ ok: boolean; reason?: string }> {
  if (input.contentRevision !== WORLD4_EXPLANATION_REVISION) return { ok: false, reason: "stale_revision" };
  const denied = semanticGuard(4, ESSENTIAL_CONTENT_REVISION, input.attemptId);
  if (denied && !denied.ok) return { ok: false, reason: denied.reason };
  if (coherentProgressPrefixLength() >= 4) return { ok: false, reason: "read_only_review" };
  const token = captureJourneyMutationToken();
  if (!isJourneySnapshotCurrent(token)) return { ok: false, reason: "stale_revision" };
  const read = readWorld4ExplanationCheckpoint();
  if (!["ok", "empty"].includes(read.status)) return { ok: false, reason: "storage_unverified" };
  const current = read.checkpoint, target = confirm ? current.confirmedStepIds : current.presentedStepIds;
  if (target.includes(input.stepId)) return { ok: true };
  if (current.activeStepId !== input.stepId || (confirm && !current.presentedStepIds.includes(input.stepId))) return { ok: false, reason: "out_of_order" };
  const presentedStepIds = confirm ? [...current.presentedStepIds] : [...current.presentedStepIds, input.stepId];
  const confirmedStepIds = confirm ? [...current.confirmedStepIds, input.stepId] : [...current.confirmedStepIds];
  const result = writeWorld4ExplanationCheckpoint({ ...current, revision: current.revision + 1, presentedStepIds, confirmedStepIds,
    activeStepId: WORLD4_ORDERING_TARGET[confirmedStepIds.length] ?? null, complete: confirmedStepIds.length === WORLD4_ORDERING_TARGET.length }, read.raw,
    () => isJourneySnapshotCurrent(token) && runtime.active && runtime.attemptId === input.attemptId && runtime.screen === 4 && runtime.mode === "normal" && runtime.authorized && document.visibilityState !== "hidden");
  emit();
  return result;
}
export function markWorld4ExplanationPresented(input: World4ExplanationMutationInput) { return mutateWorld4Explanation(input, false); }
export function confirmWorld4ExplanationStep(input: World4ExplanationMutationInput) { return mutateWorld4Explanation(input, true); }
export async function markEssentialPresented(input: { screen: EssentialScreen; stepId: string; contentRevision: string; attemptId: string | null; mode: "standard" | "assisted" }): Promise<EssentialWriteResult> {
  const denied = semanticGuard(input.screen, input.contentRevision, input.attemptId); if (denied) return denied;
  const current = roomOf(verified!, input.screen);
  if (!canUseUiStep(input.screen, input.stepId, runtime)) return failure("out_of_order");
  if (current.presentedStepIds.includes(input.stepId) && (input.mode !== "assisted" || current.assistedPresentedStepIds.includes(input.stepId))) return { ok: true, snapshot: verified!, alreadyApplied: true };
  const next = cloneForWrite(), room = roomOf(next, input.screen);
  if (!room.presentedStepIds.includes(input.stepId)) room.presentedStepIds.push(input.stepId);
  if (input.mode === "assisted" && !room.assistedPresentedStepIds.includes(input.stepId)) room.assistedPresentedStepIds.push(input.stepId);
  return writeVerified(next);
}
export async function confirmEssentialStep(input: { screen: EssentialScreen; stepId: string; contentRevision: string; attemptId: string | null; cause: "visitor_advance" }): Promise<EssentialWriteResult> {
  const denied = semanticGuard(input.screen, input.contentRevision, input.attemptId); if (denied) return denied;
  const room = roomOf(verified!, input.screen);
  if (room.confirmedStepIds.includes(input.stepId)) return { ok: true, snapshot: verified!, alreadyApplied: true };
  if (input.cause !== "visitor_advance" || room.activeStepId !== input.stepId || !room.presentedStepIds.includes(input.stepId)) return failure("out_of_order");
  if (input.screen === 5 && input.stepId !== "resultado") {
    if (!hasWorld5ParticipationProof(input.stepId as "plantas")) return failure("out_of_order");
  }
  const next = cloneForWrite(), changed = roomOf(next, input.screen);
  changed.confirmedStepIds.push(input.stepId); changed.activeStepId = essentialSteps[input.screen][changed.confirmedStepIds.length] ?? null;
  return writeVerified(next);
}
export async function closeEssentialRoom(input: { screen: EssentialScreen; contentRevision: string; attemptId: string | null; cause: "visitor_close" }): Promise<EssentialWriteResult> {
  const denied = semanticGuard(input.screen, input.contentRevision, input.attemptId); if (denied) return denied;
  const room = roomOf(verified!, input.screen), steps = essentialSteps[input.screen];
  if (room.closed) return { ok: true, snapshot: verified!, alreadyApplied: true };
  if (input.cause !== "visitor_close" || room.confirmedStepIds.length < steps.length - 1 || !room.presentedStepIds.includes(steps[steps.length - 1])) return failure("out_of_order");
  if (input.screen === 4 && !["solved", "assisted_review_completed"].includes(room.outcome ?? "")) return failure("out_of_order");
  if (input.screen === 4 && coherentProgressPrefixLength() < 4 && !hasWorld4NewAdvanceProof(room.outcome)) return failure("out_of_order");
  const next = cloneForWrite(), changed = roomOf(next, input.screen);
  changed.confirmedStepIds = [...steps]; changed.activeStepId = null; changed.closed = true;
  return writeVerified(next);
}
export async function recordEssentialOutcome(input: { screen: 4; contentRevision: string; attemptId: string | null; outcome: "solved" | "assisted_review_completed" }): Promise<EssentialWriteResult> {
  const denied = semanticGuard(input.screen, input.contentRevision, input.attemptId); if (denied) return denied;
  const local = readWorld4OrderingCheckpoint();
  if (local.status !== "ok" || !local.checkpoint.closed ||
    (input.outcome === "solved" ? local.checkpoint.outcome !== "solved_by_visitor" : !["assisted_timeout", "assisted_requested"].includes(local.checkpoint.outcome ?? "") || local.checkpoint.confirmedReviewSteps.length !== WORLD4_ORDERING_TARGET.length)) return failure("out_of_order");
  if (roomOf(verified!, 4).outcome === input.outcome) return { ok: true, snapshot: verified!, alreadyApplied: true };
  const next = cloneForWrite(); next.stations[4].outcome = input.outcome; return writeVerified(next);
}
export async function recordWorld2UiFact(fact: World2UiFact & { attemptId: string | null }): Promise<EssentialWriteResult> {
  const denied = semanticGuard(2, fact.contentRevision, fact.attemptId); if (denied) return denied;
  if (!validWorld2Fact({ ...fact, origin: "visitor_ui" })) return failure("unauthorized");
  const list = verified!.stations[2].interactionEvidence;
  if (list.some((old) => old.kind === fact.kind && old.id === fact.id)) return { ok: true, snapshot: verified!, alreadyApplied: true };
  if (list.length >= 40) return failure("out_of_order");
  const next = cloneForWrite(); next.stations[2].interactionEvidence.push({ kind: fact.kind, id: fact.id, contentRevision: fact.contentRevision, origin: "visitor_ui" }); return writeVerified(next);
}
export function isEssentialExitReady(screen: EssentialScreen, context: ValidatedJourneyContext = runtime): boolean {
  const snapshot = initializeJourneyEssential();
  return Boolean(snapshot && context.authorized && context.screen === screen && ((context.mode === "normal" && roomOf(snapshot, screen).closed && (screen !== 4 || coherentProgressPrefixLength() >= 4 || hasWorld4NewAdvanceProof(snapshot.stations[4].outcome))) || (context.mode !== "normal" && context.reviewReturnAllowed)));
}
export function canUseUiStep(screen: EssentialScreen, stepId: string, context: ValidatedJourneyContext = runtime): boolean {
  const snapshot = initializeJourneyEssential();
  if (!snapshot || !context.authorized || context.screen !== screen || !essentialSteps[screen].includes(stepId)) return false;
  if (context.mode !== "normal") return context.reviewReturnAllowed;
  const room = roomOf(snapshot, screen);
  return room.confirmedStepIds.includes(stepId) || room.activeStepId === stepId;
}
export function useEssentialFlow(screen: EssentialScreen): VerifiedEssentialView {
  useSyncExternalStore(subscribeEssential, () => storeVersion, () => 0);
  const snapshot = readEssentialSnapshot();
  const room = snapshot ? roomOf(snapshot, screen) : null;
  const readOnly = runtime.mode !== "normal";
  const exitReady = isEssentialExitReady(screen, runtime);
  return { attemptId: runtime.attemptId, snapshot, presented: room?.presentedStepIds ?? [], confirmed: room?.confirmedStepIds ?? [], presentedStepIds: room?.presentedStepIds ?? [], confirmedStepIds: room?.confirmedStepIds ?? [], assistedPresentedStepIds: room?.assistedPresentedStepIds ?? [], activeStepId: room?.activeStepId ?? null, firstPendingStepId: room?.activeStepId ?? null, closed: room?.closed ?? false, revision: snapshot?.revision ?? 0, contentRevision: ESSENTIAL_CONTENT_REVISION, mode: runtime.mode, readOnly, readinessReason: !snapshot ? "storage_unverified" : exitReady ? readOnly ? "review" : "closed" : "pending", exitReady, storageVerified: Boolean(snapshot) && !storageProblem };
}

/** Root-only receipt persistence; it never credits presentation, answers or practice. */
export function persistJourneyReceipt(receipt: JourneyReceipt | null, token: JourneyMutationToken): EssentialWriteResult {
  if (resetBarrier) return failure("inactive");
  if (!isJourneyMutationTokenCurrent(token)) return failure("stale_revision");
  initializeJourneyEssential(); if (!verified || storageProblem) return failure("storage_unverified");
  if (receipt !== null && !validateJourneyReceipt(receipt, verified, coherentProgressPrefixLength())) return failure("unauthorized");
  const next = cloneForWrite(); next.pendingTransition = receipt; return writeVerified(next);
}
export function recordVerifiedFinalArrival(transactionId: string, attemptId: string | null): EssentialWriteResult {
  initializeJourneyEssential();
  if (!verified || storageProblem) return failure("storage_unverified");
  if (resetBarrier || !runtime.active || !attemptId || runtime.attemptId !== attemptId || runtime.screen !== "final" || runtime.mode !== "normal" || !runtime.authorized || verified.pendingTransition?.transactionId !== transactionId || verified.pendingTransition.phase !== "revealed_pending_cleanup" || !verified.stations[5].closed) return failure("unauthorized");
  if (verified.finalReached) return { ok: true, snapshot: verified, alreadyApplied: true };
  const next = cloneForWrite(); next.finalReached = true; return writeVerified(next);
}
