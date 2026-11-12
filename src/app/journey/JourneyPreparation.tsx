import "./JourneyPreparation.css";
import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { preloadImages } from "../../shared/assets/assetPreloader";
import { markStationCompleted } from "../../domain/progress/progress.storage";
import { readLanguagePreference } from "../preferences/languagePreference";
import { preloadJourneyRouteModule, routeModuleForDestination } from "../routeModules";
import { TransitionWorld } from "../../screens/TransitionWorld/TransitionWorld";
import { introToStationOneTransition, worldOneToWorldTwoTransition, worldTwoToWorldThreeTransition, worldThreeToWorldFourTransition, worldFourToWorldFiveTransition, worldFiveToFinalTransition } from "../../screens/TransitionWorld/transitionWorld.config";
import { JourneyActivationProvider } from "./JourneyActivation";
import { captureJourneyMutationToken, isJourneyMutationTokenCurrent, isJourneySnapshotCurrent, invalidateJourneyEssential, coherentProgressPrefixLength, getJourneyRuntimeContext, persistJourneyReceipt, readEssentialSnapshot, recordVerifiedFinalArrival, setJourneyRuntimeContext, subscribeEssential, isJourneyResetInProgress, type JourneyReceipt, type JourneyMutationToken } from "./journeyEssential";
import { resolveJourneyAccess } from "./journeyAccess";
import { getJourneyResourceManifest, getTransitionResourceSources, getWorld5ResourceView } from "./journeyResources";
import { receiptStartedAt, readEntryPreparationDeadline, finishEntryPreparation } from "./journeyIntent";
import { validateJourneyReceipt } from "./journeyReceipt";
import { capturePreparedImage, isPreparedImageCurrent, waitForPreparedImages } from "./preparedImages";
import { EntryPreparationHost } from "./EntryPreparationHost";

const configs = [introToStationOneTransition, worldOneToWorldTwoTransition, worldTwoToWorldThreeTransition, worldThreeToWorldFourTransition, worldFourToWorldFiveTransition, worldFiveToFinalTransition];
type Attempt = { id: string; navigationKey: string; contextKey: string; deadlineAt: number; controller: AbortController; transactionId: string | null; mutationToken: JourneyMutationToken };
type PreparationState = { status: "loading" | "ready" | "error" | "timeout"; progress: number; detail?: string };
class PreparedTreeBoundary extends Component<{ children: ReactNode; resetKey: string; onError: () => void }, { failed: boolean; key: string }> {
  state = { failed: false, key: this.props.resetKey };
  static getDerivedStateFromProps(props: { resetKey: string }, state: { key: string }) { return props.resetKey !== state.key ? { failed: false, key: props.resetKey } : null; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? <div data-preparation-render-error /> : this.props.children; }
}
let currentLayoutReporter: ((input: { attemptId: string; contextKey: string; criticalRoot: HTMLElement; layoutResult: boolean }) => void) | null = null;
export function reportPreparedLayout(input: { attemptId: string; contextKey: string; criticalRoot: HTMLElement; layoutResult: boolean }) { currentLayoutReporter?.(input); }
function liveReceipt(transactionId: string, destination?: string) {
  const snapshot = readEssentialSnapshot(), receipt = snapshot?.pendingTransition;
  return snapshot && receipt?.transactionId === transactionId && validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength(), destination) ? receipt : null;
}
function verifyCommit(receipt: JourneyReceipt, mayStartWrite: () => boolean): boolean {
  if (isJourneyResetInProgress() || !mayStartWrite() || !liveReceipt(receipt.transactionId, receipt.to)) return false;
  // Review and acquired-route resume do not grant new bits.
  if (receipt.kind === "legacy_resume" || receipt.kind === "review_navigation" || receipt.from === "cover") return true;
  const snapshot = readEssentialSnapshot();
  if (!snapshot || !snapshot.stations[receipt.from].closed || receipt.acceptedAuthorizationKind !== "normal") return false;
  const prefix = coherentProgressPrefixLength();
  if (prefix >= receipt.from) return true;
  if (prefix !== receipt.from - 1) return false;
  if (!mayStartWrite()) return false;
  const written = markStationCompleted(receipt.from);
  return written.ok && coherentProgressPrefixLength() >= receipt.from;
}
export function JourneyPreparation({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return ["/", "/carga", "/inicio", "/portada"].includes(pathname.replace(/\/+$/, "") || "/")
    ? <EntryPreparationHost /> : <PreparedRouteController>{children}</PreparedRouteController>;
}
function PreparedRouteController({ children }: { children: ReactNode }) {
  const location = useLocation(), navigate = useNavigate();
  const pathname = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
  const rootRef = useRef<HTMLDivElement>(null), attemptRef = useRef<Attempt | null>(null);
  const deliveredAttempt = useRef<string | null>(null);
  const [retry, setRetry] = useState(0), retries = useRef(0);
  const [generation, setGeneration] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [documentVisible, setDocumentVisible] = useState(() => document.visibilityState !== "hidden");
  const [orientation, setOrientation] = useState(() => window.innerWidth >= window.innerHeight ? "landscape" : "portrait");
  const [state, setState] = useState<PreparationState>({ status: "loading", progress: 0 });
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [mountedNavigationKey, setMountedNavigationKey] = useState<string | null>(null);
  const [shellReadyKey, setShellReadyKey] = useState<string | null>(null);
  const ceremonyDone = useRef<string | null>(null), ceremonyWaiter = useRef<{ key: string; resolve: () => void } | null>(null);
  const budgetRef = useRef<{ navigation: string; retry: number; deadlineAt: number } | null>(null);
  const locale = readLanguagePreference() ?? "es";
  const access = resolveJourneyAccess(pathname, location.state);
  const snapshot = readEssentialSnapshot(), receipt = snapshot?.pendingTransition;
  const applicableReceipt = snapshot && validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength(), pathname) ? receipt : null;
  const transitionRoute = pathname.startsWith("/transition/");
  const displayReceipt = snapshot && validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength()) && (transitionRoute || applicableReceipt) ? receipt : null;
  const transitionConfig = displayReceipt ? configs.find((c) => c.toRoute === displayReceipt.to) : null;
  const visualKey = displayReceipt ? `${displayReceipt.transactionId}:${retry}` : "none";
  const shellReady = shellReadyKey === visualKey;
  // Freeze the normalized restored state for this preparation. Visible room advances use their local critical-resource boundary.
  const quizView = useMemo(() => access.screen === 5 ? getWorld5ResourceView(pathname) : undefined, [access.screen, location.key, pathname, generation]);
  const manifest = useMemo(() => getJourneyResourceManifest({ route: pathname, locale, orientation, quizView }), [location.key, pathname, locale, orientation, quizView, retry, generation]);
  const routeKey = `${location.key}:${manifest.contextKey}`;
  const routeKeyRef = useRef(routeKey); routeKeyRef.current = routeKey;
  const statefulRoute = access.screen !== null || pathname === "/inicio";
  const active = documentVisible && (!statefulRoute || (state.status === "ready" && revealedKey === routeKey && access.authorized));
  const context = useMemo(() => ({ ...access, active, attemptId }), [access.screen, access.authorized, access.mode, access.reviewReturnAllowed, active, generation, attemptId]);
  useLayoutEffect(() => {
    const attempt = attemptRef.current;
    if (!statefulRoute || !active || !attempt || deliveredAttempt.current === attempt.id) return;
    if (performance.now() >= attempt.deadlineAt) {
      setJourneyRuntimeContext({ ...context, active: false });
      setState({ status: "timeout", progress: 0, detail: "activation_deadline" });
      setRevealedKey(null);
      return;
    }
    deliveredAttempt.current = attempt.id;
    if (pathname === "/inicio") finishEntryPreparation();
  }, [active, context, statefulRoute]);

  useEffect(() => {
    const visibility = () => setDocumentVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", visibility);
    const resize = () => setOrientation(window.innerWidth >= window.innerHeight ? "landscape" : "portrait");
    window.addEventListener("resize", resize);
    const unsubscribe = subscribeEssential(() => {
      // Semantic step changes are handled within a room. External/reset changes must invalidate any preparation token.
      const attempt = attemptRef.current;
      if (attempt && !attempt.controller.signal.aborted && !readEssentialSnapshot()) attempt.controller.abort();
    });
    const external = () => { attemptRef.current?.controller.abort(); setJourneyRuntimeContext({ ...getJourneyRuntimeContext(), active: false }); setRevealedKey(null); setGeneration((v) => v + 1); };
    const resetStarted = () => { attemptRef.current?.controller.abort(); setRevealedKey(null); setState({ status: "loading", progress: 0 }); };
    window.addEventListener("storage", external);
    window.addEventListener("gvo:journey-reset", external);
    window.addEventListener("gvo:journey-reset-start", resetStarted);
    return () => { document.removeEventListener("visibilitychange", visibility); window.removeEventListener("resize", resize); window.removeEventListener("storage", external); window.removeEventListener("gvo:journey-reset", external); window.removeEventListener("gvo:journey-reset-start", resetStarted); unsubscribe(); };
  }, []);

  useLayoutEffect(() => {
    if (!statefulRoute) { setState({ status: "ready", progress: 1 }); return; }
    const previous = attemptRef.current;
    const transactionId = applicableReceipt?.transactionId ?? null;
    // Only the same delivered navigation can adapt its geometry. A new receipt
    // retains its acceptance clock even when the previous room was delivered.
    // After delivery the receipt may already be cleaned up on that same tree.
    const adaptingDeliveredTree = previous && previous.navigationKey === location.key && deliveredAttempt.current === previous.id && (!transactionId || previous.transactionId === transactionId);
    previous?.controller.abort();
    // A context change shares the original attempt deadline; explicit retry gets a fresh budget.
    const navigation = transactionId ?? location.key;
    if (adaptingDeliveredTree || !budgetRef.current || budgetRef.current.navigation !== navigation) {
      retries.current = 0;
      budgetRef.current = { navigation, retry, deadlineAt: adaptingDeliveredTree ? performance.now() + 15000 : transactionId ? receiptStartedAt(transactionId) + 15000 : pathname === "/inicio" ? readEntryPreparationDeadline() ?? performance.now() + 15000 : performance.now() + 15000 };
    } else if (budgetRef.current.retry !== retry) budgetRef.current = { navigation, retry, deadlineAt: performance.now() + 15000 };
    const deadlineAt = budgetRef.current.deadlineAt;
    const attempt: Attempt = { id: crypto.randomUUID(), navigationKey: location.key, contextKey: manifest.contextKey, deadlineAt, controller: new AbortController(), transactionId, mutationToken: captureJourneyMutationToken() };
    attemptRef.current = attempt;
    setAttemptId(attempt.id);
    setRevealedKey(null); setState({ status: "loading", progress: 0 });
    const isCurrent = () => attemptRef.current === attempt && !attempt.controller.signal.aborted && routeKeyRef.current === routeKey && isJourneyMutationTokenCurrent(attempt.mutationToken);
    const fail = (detail: string) => { if (isCurrent()) setState({ status: performance.now() >= deadlineAt ? "timeout" : "error", progress: 0, detail }); };
    const timer = window.setTimeout(() => { if (isCurrent()) { setState({ status: "timeout", progress: 0, detail: "deadline" }); attempt.controller.abort(); } }, Math.max(0, deadlineAt - performance.now()));
    let layoutResolver: ((okay: boolean) => void) | null = null;
    currentLayoutReporter = (input) => { if (isCurrent() && input.attemptId === attempt.id && input.contextKey === attempt.contextKey && input.criticalRoot === rootRef.current) layoutResolver?.(input.layoutResult); };
    void (async () => {
      if (!access.authorized) { fail("unauthorized"); return; }
      if (receipt?.to === pathname && !applicableReceipt) { fail("invalid_receipt"); return; }
      const moduleId = routeModuleForDestination(pathname.startsWith("/estacion/5/") ? "/estacion/5" : pathname);
      try {
        // Imports include their local CSS. Fonts and images must settle successfully before measuring the real target tree.
        // Local fontsource registers language-specific subsets. Load only the
        // current copy's glyphs, but do not discard a failed required face.
        const sample = locale === "es" ? "Guía Virtual OKÚA · Relación, percepción, mediación. ¿Señal?" : "OKÚA Virtual Guide · Listening and living signals.";
        const fontFamilies = Array.from(document.fonts).filter((font) => font.family.replaceAll('"', "").includes("Pixelify Sans"));
        await Promise.all([moduleId ? preloadJourneyRouteModule(moduleId) : Promise.resolve(), document.fonts.load('400 16px "Pixelify Sans Variable"', sample), document.fonts.load('700 16px "Pixelify Sans Variable"', sample), document.fonts.ready]);
        if (!fontFamilies.length || !document.fonts.check('400 16px "Pixelify Sans Variable"', sample) || fontFamilies.some((font) => font.status === "error")) throw new Error("font_not_loaded");
        if (!isCurrent()) return;
        const ownSources = applicableReceipt ? getTransitionResourceSources() : [];
        const targetSources = manifest.images.filter((src) => !ownSources.includes(src));
        const total = ownSources.length + targetSources.length;
        let ownLoaded = 0;
        if (ownSources.length) {
          const own = await preloadImages(ownSources, { signal: attempt.controller.signal, deadlineAt, timeoutMs: 8000, concurrency: 2, onProgress: (p) => { if (isCurrent()) setState({ status: "loading", progress: p.loaded / total }); } });
          if (!isCurrent()) return;
          if (own.status !== "ready") { fail("transition_" + own.status); return; }
          ownLoaded = own.loaded; setShellReadyKey(transactionId + ":" + retry);
        }
        if (applicableReceipt && !ownSources.length) setShellReadyKey(transactionId + ":" + retry);
        const images = await preloadImages(targetSources, { signal: attempt.controller.signal, deadlineAt, timeoutMs: 8000, concurrency: 2, onProgress: (p) => { if (isCurrent()) setState({ status: "loading", progress: (ownLoaded + p.loaded) / total }); } });
        if (!isCurrent()) return;
        if (images.status !== "ready") { fail(images.status); return; }
        // First mount only after critical resource proof. From this point through
        // activation the target has one type/key/position and remains the same tree.
        setMountedNavigationKey(location.key);
        const layout = await new Promise<boolean>((resolve) => {
          layoutResolver = resolve;
          const measure = async () => {
            if (!isCurrent()) { resolve(false); return; }
            const root = rootRef.current;
            if (root?.querySelector("[data-preparation-render-error]")) { resolve(false); return; }
            if (!root || !root.firstElementChild || root.querySelector("[data-route-module-fallback]")) { requestAnimationFrame(measure); return; }
            // Preloading proves the resource; mounted IMG elements can still
            // revalidate/load independently. Settle these same real elements
            // before the final two frames, under the original attempt budget.
            const shownImages = () => Array.from(root.querySelectorAll<HTMLImageElement>("img")).filter((img) => img.getBoundingClientRect().width > 0 && getComputedStyle(img).display !== "none");
            const sources = shownImages().map(capturePreparedImage);
            if (!await waitForPreparedImages(sources, attempt, isCurrent)) { resolve(false); return; }
            if (!isCurrent()) { resolve(false); return; }
            requestAnimationFrame(() => requestAnimationFrame(() => {
              if (!isCurrent()) { resolve(false); return; }
              if (root.querySelector("[data-preparation-render-error]")) { resolve(false); return; }
              const critical = root.querySelector<HTMLElement>("main, [data-gvo-critical-root]") ?? root.firstElementChild as HTMLElement | null;
              const rect = critical?.getBoundingClientRect();
              const finalImages = shownImages();
              const valid = Boolean(rect && rect.width > 0 && rect.height > 0 && finalImages.length === sources.length && finalImages.every((image, index) => image === sources[index].image && isPreparedImageCurrent(sources[index]) && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0));
              reportPreparedLayout({ attemptId: attempt.id, contextKey: attempt.contextKey, criticalRoot: root, layoutResult: valid });
            }));
          }; void measure();
        });
        if (!isCurrent()) return;
        if (!layout || performance.now() >= deadlineAt) { fail("layout"); return; }
        const config = applicableReceipt ? configs.find((item) => item.toRoute === applicableReceipt.to) : null;
        if (config && transactionId) {
          const ceremonyKey = transactionId + ":" + retry;
          if (ceremonyDone.current !== ceremonyKey) await new Promise<void>((resolve) => {
            ceremonyWaiter.current = { key: ceremonyKey, resolve };
            attempt.controller.signal.addEventListener("abort", () => resolve(), { once: true });
          });
        }
        if (!isCurrent()) return;
        const mayStartWrite = () => isCurrent() && !isJourneyResetInProgress() && document.visibilityState !== "hidden" && isJourneySnapshotCurrent(attempt.mutationToken) && performance.now() < deadlineAt;
        const pending = transactionId ? liveReceipt(transactionId, pathname) : null;
        if (transactionId && !pending) { fail("receipt_changed"); return; }
        if (pending) {
          if (pending.phase === "pending" || pending.phase === "commit_verification_pending") {
            // Persist the indeterminate phase before any global write. Read-back failure leaves a reconcilable receipt.
            if (!mayStartWrite()) { fail("deadline_or_inactive"); return; }
            if (!persistJourneyReceipt({ ...pending, phase: "commit_verification_pending" }, attempt.mutationToken).ok || !verifyCommit(pending, mayStartWrite)) { fail("commit_verification"); return; }
            if (!persistJourneyReceipt({ ...pending, phase: "committed_pending_reveal" }, attempt.mutationToken).ok) { fail("commit_receipt"); return; }
          } else if (!verifyCommit(pending, mayStartWrite)) { fail("commit_reconciliation"); return; }
        }
        if (!isCurrent() || performance.now() >= deadlineAt) { fail("deadline"); return; }
        window.clearTimeout(timer);
        setState({ status: "ready", progress: 1 }); setRevealedKey(routeKey);
      } catch { fail("resource_import_or_font"); }
    })();
    return () => { window.clearTimeout(timer); attempt.controller.abort(); layoutResolver?.(false); currentLayoutReporter = null; };
    // Readiness never persists, and semantic changes during visible use do not remount/reprepare a room.
  }, [location.key, pathname, locale, orientation, retry, generation]);

  useEffect(() => {
    if (!active || !applicableReceipt || !attemptRef.current || applicableReceipt.transactionId !== attemptRef.current.transactionId) return;
    // The very same tree is now active and visible. Cleanup is not a readiness gate.
    const attempt = attemptRef.current;
    const afterActivation = requestAnimationFrame(() => {
      const current = liveReceipt(applicableReceipt.transactionId, pathname);
      const runtime = getJourneyRuntimeContext();
      if (!current || attemptRef.current !== attempt || attempt.controller.signal.aborted || !isJourneySnapshotCurrent(attempt.mutationToken) || !runtime.active || runtime.attemptId !== attempt.id || document.visibilityState === "hidden") return;
      if (current.phase !== "revealed_pending_cleanup" && !persistJourneyReceipt({ ...current, phase: "revealed_pending_cleanup" }, attempt.mutationToken).ok) return;
      if (pathname === "/final" && current.kind === "result_closure" && !recordVerifiedFinalArrival(current.transactionId, attempt.id).ok) return;
      persistJourneyReceipt(null, attempt.mutationToken);
    });
    return () => cancelAnimationFrame(afterActivation);
  }, [active, applicableReceipt?.transactionId, pathname]);
  const retryPreparation = () => {
    if (attemptRef.current?.id !== attemptId || retries.current >= 2) return;
    attemptRef.current.controller.abort();
    invalidateJourneyEssential();
    retries.current++; setRetry((v) => v + 1);
  };
  const back = () => {
    const attempt = attemptRef.current;
    if (!attempt || attempt.id !== attemptId) return;
    attempt.controller.abort();
    const current = readEssentialSnapshot()?.pendingTransition;
    if (current?.phase === "pending") persistJourneyReceipt(null, attempt.mutationToken);
    const from = current?.from;
    navigate(from === "cover" ? "/portada" : typeof from === "number" ? `/estacion/${from}` : "/", { replace: true });
  };
  const config = transitionConfig;
  const renderError = useCallback(() => { if (attemptRef.current?.id !== attemptId) return; attemptRef.current.controller.abort(); setJourneyRuntimeContext({ ...getJourneyRuntimeContext(), active: false }); setState({ status: "error", progress: 0, detail: "render_error" }); }, [attemptId]);
  const permitActivation = useCallback(() => !statefulRoute || Boolean(attemptRef.current && !attemptRef.current.controller.signal.aborted && isJourneySnapshotCurrent(attemptRef.current.mutationToken) && document.visibilityState !== "hidden" && (deliveredAttempt.current === attemptRef.current.id || performance.now() < attemptRef.current.deadlineAt)), [statefulRoute]);
  const rejectActivation = useCallback(() => { attemptRef.current?.controller.abort(); setRevealedKey(null); setState({ status: "timeout", progress: 0, detail: "activation_deadline" }); }, []);
  return <JourneyActivationProvider context={context} canActivate={permitActivation} onActivationRejected={rejectActivation}>
    <div ref={rootRef} className="gvo-prepared-tree" data-journey-active={active} aria-hidden={statefulRoute && !active ? true : undefined} inert={statefulRoute && !active ? true : undefined}><PreparedTreeBoundary resetKey={`${location.key}:${retry}`} onError={renderError}>{!statefulRoute || mountedNavigationKey === location.key ? children : null}</PreparedTreeBoundary></div>
    {(statefulRoute && !active || transitionRoute && Boolean(config)) ? <div className="gvo-preparation-curtain" role="status" aria-live="polite">
      {config ? <TransitionWorld key={visualKey} config={config} variant="runtime" attemptId={visualKey} locale={locale} shellAssetsReady={shellReady}
        deadlineAt={displayReceipt ? attemptRef.current?.transactionId === displayReceipt.transactionId ? attemptRef.current.deadlineAt : receiptStartedAt(displayReceipt.transactionId) + 15000 : undefined}
        onComplete={() => { ceremonyDone.current = visualKey; if (ceremonyWaiter.current?.key === visualKey) ceremonyWaiter.current.resolve(); }}
        onVisualError={() => { const attempt = attemptRef.current; if (attempt && displayReceipt && attempt.transactionId === displayReceipt.transactionId && !attempt.controller.signal.aborted) { attempt.controller.abort(); setState((previous) => ({ status: performance.now() >= attempt.deadlineAt ? "timeout" : "error", progress: previous.progress, detail: "transition_visual" })); } }}
        preloadStatus={transitionRoute ? "loading" : state.status} preloadProgress={state.progress} onRetry={retryPreparation} onBack={back} canRetry={retries.current < 2} /> : <section className="gvo-preparation-card"><p>{state.status === "loading" ? locale === "en" ? "Preparing your room…" : "Preparando tu sala…" : locale === "en" ? "This room could not be prepared." : "No fue posible preparar esta sala."}</p><progress value={state.progress} max={1} />{state.status !== "loading" ? <div>{retries.current < 2 ? <button onClick={retryPreparation}>{locale === "en" ? "Retry" : "Reintentar"}</button> : null}<button onClick={back}>{locale === "en" ? "Back" : "Volver"}</button></div> : null}</section>}
    </div> : null}
  </JourneyActivationProvider>;
}
