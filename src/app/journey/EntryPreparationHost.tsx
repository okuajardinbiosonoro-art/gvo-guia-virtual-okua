import "./EntryPreparationHost.css";
import { Component, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CoverIntroScreen } from "../../screens/Cover";
import { LoadingInitialScreen } from "../../screens/LoadingInitial";
import { REDUCED_MOTION_DURATION_MS, TOTAL_DURATION_MS } from "../../screens/LoadingInitial/loadingInitialTimeline";
import { InitialExperienceScreen } from "../../screens/InitialExperience";
import { preloadImages } from "../../shared/assets/assetPreloader";
import { readLanguagePreference } from "../preferences/languagePreference";
import { stationEntryRoutes } from "../routes";
import { beginFinalReview, FINAL_REVIEW_CONTEXT_STORAGE_KEY } from "../review/finalReviewContext";
import { JourneyActivationProvider, JourneyActivityScope, useJourneyActivity } from "./JourneyActivation";
import { acceptJourneyIntent } from "./journeyIntent";
import { resolveJourneyAccess } from "./journeyAccess";
import { getEntryResourceManifest } from "./journeyResources";
import { captureJourneyMutationToken, coherentProgressPrefixLength, getJourneyRuntimeContext, isJourneyMutationTokenCurrent, readEssentialSnapshot } from "./journeyEssential";
import { capturePreparedImage, isPreparedImageCurrent, waitForPreparedImages, twoPreparedFrames, type PreparedImage } from "./preparedImages";

type ResourceState = { status: "loading" | "ready" | "error" | "timeout"; progress: number };
type EntryAttempt = { id: string; controller: AbortController; deadlineAt: number; token: ReturnType<typeof captureJourneyMutationToken> };
type CoverProof = { root: HTMLElement; main: HTMLElement; key: string; images: PreparedImage[]; resourceKey: string; fingerprint: string; verifiedAt: number };
class CoverBoundary extends Component<{ children: ReactNode; reset: number; onError: () => void }, { failed: boolean; reset: number }> {
  state = { failed: false, reset: this.props.reset };
  static getDerivedStateFromProps(p: { reset: number }, s: { reset: number }) { return p.reset !== s.reset ? { failed: false, reset: p.reset } : null; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? <div data-entry-cover-render-error /> : this.props.children; }
}
function EntryCoverConsumer() {
  const navigate = useNavigate(), activity = useJourneyActivity();
  return <CoverIntroScreen onPortalEnter={() => {
    if (!acceptJourneyIntent({ from: "cover", to: "/estacion/1", kind: "portal", attemptId: activity.attemptId })) throw Error("intent_unverified");
    navigate("/transition/intro-to-station-1");
  }} onRevisitRoom={(world) => {
    if (!activity.attemptId || getJourneyRuntimeContext().attemptId !== activity.attemptId || !getJourneyRuntimeContext().active) return;
    if (!readEssentialSnapshot()?.finalReached && coherentProgressPrefixLength() !== 5) return;
    navigate(stationEntryRoutes[world], { state: beginFinalReview(world) });
  }} />;
}
const fontSample = "Guía Virtual OKÚA · Relación, percepción, mediación. ¿Señal? Listening and living signals.";
async function entryFonts() {
  await Promise.all([document.fonts.load('400 16px "Pixelify Sans Variable"', fontSample), document.fonts.load('700 16px "Pixelify Sans Variable"', fontSample), document.fonts.ready]);
  if (!document.fonts.check('400 16px "Pixelify Sans Variable"', fontSample) || !document.fonts.check('700 16px "Pixelify Sans Variable"', fontSample) || Array.from(document.fonts).some((f) => f.family.includes("Pixelify") && f.status === "error")) throw Error("entry_font_unverified");
}
function coverFingerprint(root: HTMLElement) {
  const selectors = "main,header,footer,.cover-intro__scene,h1,h2,p,button";
  return JSON.stringify(Array.from(root.querySelectorAll<HTMLElement>(selectors)).map((element) => {
    const r = element.getBoundingClientRect(), css = getComputedStyle(element);
    const round = (n: number) => Math.round(n * 4) / 4;
    return { tag: element.tagName, text: element.textContent, box: [r.x,r.y,r.width,r.height].map(round), font: [css.fontFamily,css.fontSize,css.fontWeight,css.lineHeight,css.letterSpacing] };
  }));
}
export function EntryPreparationHost() {
  const location = useLocation(), navigate = useNavigate();
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const isInitialPath = path === "/inicio", isCoverPath = path === "/portada";
  const wantsPresentation = !isCoverPath;
  const [retry, setRetry] = useState(0), [resource, setResource] = useState<ResourceState>({ status: "loading", progress: 0 });
  const [ownReady, setOwnReady] = useState(false), [started, setStarted] = useState(false), [presentationDone, setPresentationDone] = useState(false);
  const [entryRevealed, setEntryRevealed] = useState(false);
  const [coverMounted, setCoverMounted] = useState(false), [presentationCycle, setPresentationCycle] = useState(0);
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [locale, setLocale] = useState(() => readLanguagePreference() ?? "es");
  const [geometry, setGeometry] = useState(() => `${innerWidth}x${innerHeight}`);
  const [proofVersion, setProofVersion] = useState(0), [checking, setChecking] = useState(false), [proofError, setProofError] = useState(false);
  const coverRoot = useRef<HTMLDivElement>(null), loadingRoot = useRef<HTMLDivElement>(null);
  const attempt = useRef<EntryAttempt | null>(null), proof = useRef<CoverProof | null>(null), verification = useRef<AbortController | null>(null);
  const resourceTimer = useRef<ReturnType<typeof setTimeout> | null>(null), decodedReady = useRef(false);
  const [fontVersion, setFontVersion] = useState(0);
  const resourcesVerified = useRef(false), ownVerified = useRef(false), elapsed = useRef(0), presentationComplete = useRef(false), delivered = useRef(false);
  const inventory = useMemo(getEntryResourceManifest, []);
  const contextKey = `${locale}:${geometry}:${fontVersion}`;
  const contextKeyRef = useRef(contextKey); contextKeyRef.current = contextKey;
  const current = useCallback((a: EntryAttempt) => attempt.current === a && !a.controller.signal.aborted && isJourneyMutationTokenCurrent(a.token), []);
  const invalidate = useCallback(() => { attempt.current?.controller.abort(); verification.current?.abort(); resourcesVerified.current = false; decodedReady.current = false; proof.current = null; setProofError(true); setResource((s) => ({ ...s, status: "error" })); }, []);
  const retryResources = () => { if (retry >= 2) return; if (!presentationComplete.current) { elapsed.current = 0; setStarted(false); setPresentationDone(false); setPresentationCycle((n) => n + 1); } setRetry((n) => n + 1); };
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const syncVisible = () => setVisible(document.visibilityState !== "hidden");
    const resize = () => setGeometry(`${innerWidth}x${innerHeight}`);
    const preference = () => setReduced(media.matches);
    const fontsChanged = () => { proof.current = null; setFontVersion((n) => n + 1); };
    const storage = (event: StorageEvent) => {
      if (event.key === "gvo.language.v1") { setLocale(readLanguagePreference() ?? "es"); return; }
      if (event.key === null || ["gvo.journey.essential.v1", "gvo.progress.v1", FINAL_REVIEW_CONTEXT_STORAGE_KEY].includes(event.key)) invalidate();
    };
    document.addEventListener("visibilitychange", syncVisible); window.addEventListener("resize", resize); media.addEventListener("change", preference);
    window.addEventListener("gvo:journey-reset-start", invalidate); window.addEventListener("storage", storage);
    document.fonts.addEventListener("loadingdone", fontsChanged); document.fonts.addEventListener("loadingerror", fontsChanged);
    return () => { document.removeEventListener("visibilitychange", syncVisible); window.removeEventListener("resize", resize); media.removeEventListener("change", preference); window.removeEventListener("gvo:journey-reset-start", invalidate); window.removeEventListener("storage", storage); document.fonts.removeEventListener("loadingdone", fontsChanged); document.fonts.removeEventListener("loadingerror", fontsChanged); };
  }, [invalidate]);
  useEffect(() => {
    const a: EntryAttempt = { id: crypto.randomUUID(), controller: new AbortController(), deadlineAt: performance.now() + 15000, token: captureJourneyMutationToken() };
    attempt.current = a; resourcesVerified.current = false; decodedReady.current = false; ownVerified.current = false; proof.current = null;
    setOwnReady(false); setProofError(false); setChecking(false); setResource({ status: "loading", progress: 0 });
    const fail = (status: "error" | "timeout") => { if (!current(a)) return; setResource((s) => ({ ...s, status })); a.controller.abort(); };
    const timer = window.setTimeout(() => { if (!resourcesVerified.current) fail("timeout"); }, 15000); resourceTimer.current = timer;
    void (async () => {
      try {
        const fonts = entryFonts().then(() => true, () => false);
        const own = await preloadImages(inventory.own, { signal: a.controller.signal, deadlineAt: a.deadlineAt, timeoutMs: 15000, concurrency: 2,
          onProgress: (p) => { if (current(a)) setResource({ status: "loading", progress: p.loaded / inventory.all.length }); } });
        if (!current(a)) return;
        if (own.status !== "ready") { fail(own.status === "timeout" ? "timeout" : "error"); return; }
        if (!await fonts) { fail("error"); return; }
        if (!current(a)) return;
        ownVerified.current = true; setOwnReady(true);
        const rest = inventory.all.filter((src) => !inventory.own.includes(src));
        const remainder = await preloadImages(rest, { signal: a.controller.signal, deadlineAt: a.deadlineAt, timeoutMs: 15000, concurrency: 2,
          onProgress: (p) => { if (current(a)) setResource({ status: "loading", progress: (own.loaded + p.loaded) / inventory.all.length }); } });
        if (!current(a)) return;
        if (remainder.status !== "ready" || performance.now() >= a.deadlineAt) { fail(remainder.status === "error" ? "error" : "timeout"); return; }
        // Mount the one real Cover only after the bounded queue has released Loading's priority.
        // Its actual IMG/font/layout proof still belongs to this original deadline.
        decodedReady.current = true; setCoverMounted(true); setResource({ status: "ready", progress: 1 });
      } catch { fail("error"); }
    })();
    return () => { clearTimeout(timer); a.controller.abort(); verification.current?.abort(); };
  }, [retry, current, inventory]);
  const validateCover = useCallback(async (): Promise<boolean> => {
    const a = attempt.current, root = coverRoot.current, key = contextKeyRef.current;
    if (!a || !root || !current(a) || !decodedReady.current) return false;
    verification.current?.abort(); const controller = new AbortController(); verification.current = controller;
    setChecking(true); proof.current = null;
    // A bounded layout/decode recheck is not a new network/resource deadline.
    const bound = resourcesVerified.current ? performance.now() + 3000 : a.deadlineAt;
    const timer = window.setTimeout(() => controller.abort(), Math.max(0, bound - performance.now()));
    const ownerCurrent = () => current(a) && verification.current === controller && contextKeyRef.current === key && root === coverRoot.current && root.isConnected;
    const live = () => ownerCurrent() && !controller.signal.aborted && performance.now() < bound;
    const abort = () => controller.abort(); a.controller.signal.addEventListener("abort", abort, { once: true });
    try {
      if (!document.fonts.check('400 16px "Pixelify Sans Variable"', fontSample) || !document.fonts.check('700 16px "Pixelify Sans Variable"', fontSample) || root.querySelector("[data-entry-cover-render-error]")) throw Error("cover_font_or_render");
      const images = Array.from(root.querySelectorAll<HTMLImageElement>("img")).filter((img) => img.getBoundingClientRect().width > 0 && getComputedStyle(img).display !== "none").map(capturePreparedImage);
      const urls = new Set(inventory.all.map((src) => new URL(src, document.baseURI).href));
      if (!images.every((x) => urls.has(x.currentSrc))) throw Error("cover_source_not_in_verified_inventory");
      if (!await waitForPreparedImages(images, { controller, deadlineAt: bound }, live)) throw Error("cover_image");
      if (!await twoPreparedFrames(controller.signal)) throw Error("cover_frames_aborted");
      if (!live()) throw Error("cover_proof_expired");
      const main = root.querySelector("main"), rect = main?.getBoundingClientRect();
      const nowImages = Array.from(root.querySelectorAll<HTMLImageElement>("img")).filter((img) => img.getBoundingClientRect().width > 0 && getComputedStyle(img).display !== "none");
      if (!rect || rect.width <= 0 || rect.height <= 0 || nowImages.length !== images.length || !nowImages.every((img, i) => img === images[i].image && isPreparedImageCurrent(images[i]))) throw Error("cover_layout_changed");
      proof.current = { root, main: main as HTMLElement, key, images, resourceKey: inventory.key, fingerprint: coverFingerprint(root), verifiedAt: performance.now() };
      resourcesVerified.current = true; if (resourceTimer.current !== null) clearTimeout(resourceTimer.current); setProofError(false); setProofVersion((n) => n + 1); return true;
    } catch { if (ownerCurrent()) setProofError(true); return false; }
    finally { clearTimeout(timer); a.controller.signal.removeEventListener("abort", abort); if (ownerCurrent()) setChecking(false); }
  }, [current, inventory]);
  useLayoutEffect(() => { if (resource.status === "ready" && coverMounted && visible) { proof.current = null; void validateCover(); } }, [resource.status, coverMounted, contextKey, visible, validateCover]);
  useLayoutEffect(() => {
    if (!ownReady || !wantsPresentation || !visible || started || presentationDone) return;
    const a = attempt.current, root = loadingRoot.current, controller = new AbortController();
    if (!a || !root) return;
    const bound = resourcesVerified.current ? performance.now() + 3000 : a.deadlineAt;
    const abort = () => controller.abort(); a.controller.signal.addEventListener("abort", abort, { once: true });
    const timer = window.setTimeout(abort, Math.max(0, bound - performance.now()));
    const live = () => !controller.signal.aborted && current(a) && ownVerified.current && root === loadingRoot.current;
    void (async () => {
      const images = Array.from(root.querySelectorAll<HTMLImageElement>("img")).map(capturePreparedImage);
      const imagesReady = await waitForPreparedImages(images, { controller, deadlineAt: bound }, live);
      const framesReady = imagesReady && await twoPreparedFrames(controller.signal);
      if (framesReady && live() && root.getBoundingClientRect().width > 0 && document.visibilityState === "visible") setStarted(true);
      else if (current(a) && root === loadingRoot.current && document.visibilityState === "visible") { setProofError(true); setResource((s) => ({ ...s, status: performance.now() >= bound ? "timeout" : "error" })); }
    })();
    return () => { clearTimeout(timer); controller.abort(); a.controller.signal.removeEventListener("abort", abort); };
  }, [ownReady, wantsPresentation, visible, started, presentationDone, current]);
  useEffect(() => {
    if (!started || presentationDone || !wantsPresentation) return;
    let raf = 0, last: number | null = null;
    const frame = (now: number) => {
      if (document.visibilityState === "visible" && resource.status !== "error" && resource.status !== "timeout") {
        if (last !== null) elapsed.current += now - last;
        last = now;
        if (elapsed.current >= (reduced ? REDUCED_MOTION_DURATION_MS : TOTAL_DURATION_MS)) { presentationComplete.current = true; setPresentationDone(true); return; }
      } else last = null;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame); return () => cancelAnimationFrame(raf);
  }, [started, presentationDone, wantsPresentation, visible, reduced, resource.status]);
  const liveProof = () => {
    const p = proof.current;
    return Boolean(p && p.root === coverRoot.current && p.root.isConnected && p.main === p.root.querySelector("main") && p.key === contextKeyRef.current && p.resourceKey === inventory.key && p.fingerprint === coverFingerprint(p.root) && document.fonts.check('400 16px "Pixelify Sans Variable"', fontSample) && document.fonts.check('700 16px "Pixelify Sans Variable"', fontSample) && p.images.every((x) => isPreparedImageCurrent(x) && x.image.complete && x.image.naturalWidth > 0 && x.image.naturalHeight > 0));
  };
  const deliveredProof = delivered.current && isCoverPath && proof.current?.root === coverRoot.current && proof.current?.key === contextKey && resourcesVerified.current;
  const coverReady = resource.status === "ready" && !checking && !proofError && (deliveredProof || liveProof());
  useEffect(() => {
    if (!wantsPresentation || !presentationDone || !coverReady) return;
    setEntryRevealed(true);
    if (!isInitialPath) navigate("/inicio", { replace: true });
  }, [wantsPresentation, isInitialPath, presentationDone, coverReady, navigate]);
  async function enterCover() {
    if (!resourcesVerified.current || (!liveProof() && !await validateCover())) { setProofError(true); throw Error("cover_unprepared"); }
    navigate("/portada");
  }
  const coverActive = isCoverPath && coverReady && visible;
  if (coverActive) delivered.current = true;
  const coverVisible = isCoverPath && (coverReady || delivered.current);
  const access = resolveJourneyAccess(path, location.state);
  const showInitial = isInitialPath && entryRevealed;
  const active = visible && (showInitial || coverActive);
  const context = useMemo(() => ({ ...access, active, attemptId: attempt.current?.id ?? null }), [access.screen, access.mode, access.authorized, access.reviewReturnAllowed, active, retry, proofVersion]);
  const failed = resource.status === "error" || resource.status === "timeout" || proofError;
  return <JourneyActivationProvider context={context} canActivate={() => Boolean(attempt.current && current(attempt.current))}>
    <div className="entry-preparation-host" data-entry-resource-state={resource.status} data-entry-presentation={presentationDone ? "complete" : started ? "running" : "pending"}>
      <div ref={coverRoot} className="gvo-prepared-tree entry-prepared-cover" data-journey-active={coverActive} data-entry-visible={coverVisible} aria-hidden={!coverActive || undefined} inert={!coverActive || undefined}>
        {coverMounted ? <JourneyActivityScope active={coverActive}><CoverBoundary reset={retry} onError={invalidate}><EntryCoverConsumer /></CoverBoundary></JourneyActivityScope> : null}
      </div>
      {showInitial ? <div className="entry-initial-surface"><InitialExperienceScreen onLocaleChange={setLocale} onEnterCover={enterCover}
        preparationStatus={failed ? "error" : coverReady ? "ready" : "loading"} onRetryPreparation={retryResources} canRetryPreparation={retry < 2} /></div> : null}
      {!showInitial && !coverVisible ? <div ref={loadingRoot} className="entry-loading-surface"><LoadingInitialScreen key={presentationCycle} preloadStatus={failed ? resource.status === "timeout" ? "timeout" : "error" : resource.status}
        preloadProgress={resource.progress} preloadTarget="entry+cover+transition" locale={locale} onRetry={retryResources} canRetry={retry < 2}
        presentationReady={ownReady && started} presentationPaused={!visible || failed} presentationComplete={presentationDone} /></div> : null}
      {isCoverPath && coverVisible && failed ? <section className="entry-local-recovery" role="alert"><p>{locale === "en" ? "The cover could not be verified." : "No fue posible verificar Portada."}</p>{retry < 2 ? <button onClick={retryResources}>{locale === "en" ? "Retry" : "Reintentar"}</button> : null}</section> : null}
    </div>
  </JourneyActivationProvider>;
}
