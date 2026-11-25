import { playJourneySound } from "../../app/audio/journeySound";
import "./World3RootScreen.css";
import "./World3Practice.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { canUseUiStep, closeEssentialRoom, confirmEssentialStep, invalidateJourneyEssential, isEssentialExitReady, markEssentialPresented, useEssentialFlow, type EssentialWriteResult } from "../../app/journey/journeyEssential";
import { InterstationQrGate } from "../../app/qr/InterstationQrGate";
import { worldThreeToWorldFourTransitionRoute } from "../../app/routes";
import { gestureHintAssets } from "../../components/GestureHint/gestureHintAssets";
import type { Station3RecordId } from "../../domain/checkpoints/world3Checkpoint";
import type { ScreenAssetBundle } from "../../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import { World3LiaActor } from "./World3LiaActor";
import { World3PageTurnLayer, world3NotebookGeometry, world3PageTurnGeometryContract, world3RegisteredRectangle } from "./World3PageTurnLayer";
import { getStation3Content } from "./station3Content";
import { getWorld3CriticalAssetSources, world3RuntimeAssets } from "./world3RuntimeAssets";

const stepByPage = { planta: "INTRO", prototipo: "PASO A PASO", senal: "BENEFICIOS" } as const;
const pageByStep: Record<string, Station3RecordId> = { INTRO: "planta", "PASO A PASO": "prototipo", BENEFICIOS: "senal" };
const paperStyle = world3RegisteredRectangle(world3NotebookGeometry.contentPaper);
const turnStyle = world3RegisteredRectangle(world3NotebookGeometry.turnPaper);

function notebookBundle(page: Station3RecordId | null): ScreenAssetBundle {
  return { id: "world3Notebook", route: "/estacion/3", description: "Original notebook and currently visible paper illustration", assets: getWorld3CriticalAssetSources(page).map((src, i) => ({ id: `world3-${page ?? "index"}-${i}`, src, kind: "image" })) };
}

export function World3RootScreen() {
  const navigate = useNavigate();
  const locale = readLanguagePreference() ?? "es";
  const content = getStation3Content(locale);
  const flow = useEssentialFlow(3);
  const activity = useJourneyActivity();
  const attemptId = activity.attemptId;
  const attemptRef = useRef(attemptId);
  attemptRef.current = attemptId;
  const activeRef = useRef(activity.active);
  activeRef.current = activity.active;
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const [active, setSelection] = useState<Station3RecordId | null>(null);
  const page = content.records.find((record) => record.id === active);
  const step = active ? stepByPage[active] : null;
  const [folioIndex, setFolioIndex] = useState(0);
  const [lastOpened, setLastOpened] = useState<Station3RecordId | null>(null);
  const folio = page?.folios[folioIndex];
  const lastFolio = !!page && folioIndex === page.folios.length - 1;
  const [selectedMotif, setSelectedMotif] = useState<Station3RecordId | null>(null);
  const [motifEvent, setMotifEvent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [assetRetry, setAssetRetry] = useState(0);
  const currentBundle = useMemo(() => notebookBundle(active), [active]);
  const resources = useAssetPreloader(currentBundle, { enabled: true, concurrency: 2, reuseVerified: assetRetry === 0, contextKey: `world3:${active ?? "index"}:${locale}`, retryKey: assetRetry });
  const [requestedPage, setRequestedPage] = useState<{ id: Station3RecordId; attemptId: string | null } | null>(null);
  const requestedBundle = useMemo(() => notebookBundle(requestedPage?.id ?? null), [requestedPage]);
  const requestedResources = useAssetPreloader(requestedBundle, { enabled: resources.ready && requestedPage !== null, concurrency: 2, reuseVerified: assetRetry === 0, contextKey: `world3-requested:${requestedPage?.id ?? "none"}:${requestedPage?.attemptId ?? "inactive"}:${locale}`, retryKey: assetRetry });
  const [turn, setTurn] = useState<{ key: number; direction: "open" | "close"; width: number | null; height: number | null } | null>(null);
  const turnKey = useRef(0);
  const screenRef = useRef<HTMLElement>(null);
  const turnWindow = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const readingHintRef = useRef<HTMLButtonElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [moreBelow, setMoreBelow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState(false);
  const savingRef = useRef(false);
  const retry = useRef<null | (() => Promise<void>)>(null);
  const requestKey = useRef("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const roomTitleRef = useRef<HTMLHeadingElement>(null);
  const returningToIndex = useRef(false);
  const exitLock = useRef(false);
  const presentable = activity.active && visible && resources.ready && !turn && !!step;
  const confirmedPage = !!step && flow.confirmedStepIds.includes(step);
  const presentedPage = !!step && flow.presentedStepIds.includes(step);
  const canTurnFolio = presentable && flow.storageVerified && !saving && !failure;
  const canAdvance = canTurnFolio && (!lastFolio || flow.readOnly || confirmedPage || presentedPage);
  const indexCurrent = pageByStep[flow.activeStepId ?? ""] ?? lastOpened;
  const nextChapter = flow.closed ? undefined : content.records.find(record =>
    canUseUiStep(3, stepByPage[record.id]) && !flow.confirmedStepIds.includes(stepByPage[record.id]));

  function recordState(id: Station3RecordId) {
    if (!canUseUiStep(3, stepByPage[id])) return "locked";
    if (indexCurrent === id) return "current";
    if (flow.confirmedStepIds.includes(stepByPage[id])) return "completed";
    return "available";
  }

  async function perform(action: () => Promise<EssentialWriteResult>, next?: () => void) {
    if (attemptRef.current !== attemptId || !activeRef.current || flow.readOnly || savingRef.current) return;
    savingRef.current = true; setSaving(true);
    retry.current = async () => { await perform(action, next); };
    try {
      const result = await action();
      if (attemptRef.current !== attemptId) return;
      if (!result.ok) { setFailure(true); return; }
      retry.current = null; setFailure(false);
      if (activeRef.current) next?.();
    } catch { if (attemptRef.current === attemptId) setFailure(true); }
    finally { if (attemptRef.current === attemptId) { savingRef.current = false; setSaving(false); } }
  }
  function animatePage(direction: "open" | "close") {
    if (attemptRef.current !== attemptId) return;
    playJourneySound("pageTurn");
    const rect = turnWindow.current?.getBoundingClientRect();
    setTurn({ key: ++turnKey.current, direction, width: rect?.width && rect.width > 0 ? rect.width : null, height: rect?.height && rect.height > 0 ? rect.height : null });
  }
  function open(id: Station3RecordId) {
    if (attemptRef.current !== attemptId || !activity.active || saving || failure || !resources.ready || !canUseUiStep(3, stepByPage[id])) return;
    setRequestedPage({ id, attemptId });
  }
  function alignNewPage() {
    // Page actions can follow outer-document scrolling. Align the real room
    // before its new clip starts; manual reading scroll remains unrestricted.
    screenRef.current?.scrollIntoView?.({ block: "start", inline: "nearest", behavior: "instant" });
  }
  function showIndex() {
    returningToIndex.current = true;
    alignNewPage(); setRequestedPage(null); setSelection(null); setFolioIndex(0); setSelectedMotif(null); setMotifEvent(0); animatePage("close");
    roomTitleRef.current?.focus({ preventScroll: true });
  }
  function index() {
    if (attemptRef.current !== attemptId || !activity.active || saving || failure || turn) return;
    showIndex();
  }
  function previousFolio() {
    if (attemptRef.current !== attemptId || !canTurnFolio || folioIndex === 0) return;
    alignNewPage(); setFolioIndex((value) => value - 1); setSelectedMotif(null); setMotifEvent(0); animatePage("close");
  }
  async function advance() {
    if (attemptRef.current !== attemptId || !active || !step || !canAdvance) return;
    // Local leaves never write presentation, confirmation, practice or progress.
    if (!lastFolio) {
      alignNewPage(); setFolioIndex((value) => value + 1); setSelectedMotif(null); setMotifEvent(0); animatePage("open");
      return;
    }
    if (flow.readOnly || confirmedPage) { showIndex(); return; }
    await perform(active === "senal" ? () => closeEssentialRoom({ screen: 3, contentRevision: flow.contentRevision, attemptId, cause: "visitor_close" }) : () => confirmEssentialStep({ screen: 3, stepId: step, contentRevision: flow.contentRevision, attemptId, cause: "visitor_advance" }), () => {
      showIndex();
      if (active === "senal") playJourneySound("roomComplete");
    });
  }
  function retrySave() {
    if (retry.current) void retry.current();
    else invalidateJourneyEssential();
  }
  useEffect(() => {
    savingRef.current = false; retry.current = null; requestKey.current = ""; exitLock.current = false; returningToIndex.current = false;
    setSaving(false); setFailure(false); setSelection(null); setRequestedPage(null); setTurn(null);
    setFolioIndex(0); setLastOpened(null); setSelectedMotif(null); setMotifEvent(0);
  }, [attemptId]);
  useEffect(() => {
    if (!requestedPage || requestedPage.attemptId !== attemptId || !requestedResources.ready || !activity.active || !visible || saving || failure || !canUseUiStep(3, stepByPage[requestedPage.id])) return;
    alignNewPage(); setSelection(requestedPage.id); setLastOpened(requestedPage.id); setFolioIndex(0); setRequestedPage(null); setSelectedMotif(null); setMotifEvent(0); animatePage("open");
  }, [attemptId, requestedPage, requestedResources.ready, activity.active, visible, saving, failure]);
  useEffect(() => {
    const change = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const change = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media?.addEventListener("change", change);
    return () => media?.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!turn || !activity.active || !visible) return;
    const settle = () => { if (attemptRef.current === attemptId) setTurn(null); };
    const timer = window.setTimeout(settle, reducedMotion ? world3PageTurnGeometryContract.reducedDurationMs : world3PageTurnGeometryContract.normalDurationMs);
    window.addEventListener("resize", settle);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", settle); };
  }, [attemptId, turn, activity.active, visible, reducedMotion]);
  useEffect(() => {
    if (!activity.active || !visible || !resources.ready || turn || !active) return;
    titleRef.current?.focus({ preventScroll: true });
  }, [active, folioIndex, locale, activity.active, visible, resources.ready, turn]);
  useEffect(() => {
    if (!returningToIndex.current || active || turn || saving || !activity.active || !resources.ready || !visible) return;
    const target = screenRef.current?.querySelector<HTMLButtonElement>(
      flow.exitReady ? '[data-interstation-qr-action="open"]' : '[data-open-next="true"]',
    );
    if (!target || target.disabled) return;
    returningToIndex.current = false;
    target.focus({ preventScroll: true });
    target.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "instant" });
  }, [active, turn, saving, activity.active, resources.ready, visible, flow.exitReady, nextChapter]);
  useEffect(() => {
    const viewport = viewportRef.current;
    const paper = viewport?.parentElement;
    const contents = viewport?.firstElementChild;
    if (!viewport || !paper || !contents) return;
    viewport.scrollTop = 0;
    const measure = () => {
      const style = getComputedStyle(viewport);
      // Compare the text against the FULL leaf. Reserving a bookmark for an
      // overflowing leaf must never make a short leaf appear to need one.
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const overflowsLeaf = contents.getBoundingClientRect().height + padding > paper.clientHeight + 2;
      const more = overflowsLeaf && viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop > 2;
      if (!more && document.activeElement === readingHintRef.current) viewport.focus({ preventScroll: true });
      setNeedsScroll(overflowsLeaf);
      setMoreBelow(more);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    observer?.observe(paper);
    observer?.observe(contents);
    viewport.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      viewport.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [active, folioIndex, locale, resources.ready, turn]);
  useEffect(() => {
    const key = attemptId + ":" + step;
    // A folio is UI only. The existing chapter presentation is recorded once
    // its last complete source block is actually mounted after the finite turn.
    if (!presentable || !lastFolio || !step || flow.readOnly || saving || failure || presentedPage || requestKey.current === key) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => { second = window.requestAnimationFrame(() => {
      if (attemptRef.current !== attemptId || !activeRef.current || document.visibilityState === "hidden") return;
      requestKey.current = key;
      void perform(() => markEssentialPresented({ screen: 3, stepId: step, contentRevision: flow.contentRevision, attemptId, mode: "standard" }));
    }); });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [attemptId, presentable, lastFolio, step, flow.readOnly, saving, failure, presentedPage, flow.contentRevision]);

  return <main ref={screenRef} className="s3-screen s3-practice-screen" aria-labelledby="station3-title" data-journey-active={activity.active} data-document-visible={visible} data-station3-state={active ? `station3_${active}_page` : "station3_index"} data-station3-folio={page ? folioIndex + 1 : undefined} data-station3-folio-count={page?.folios.length} data-station3-reduced-motion={reducedMotion} data-station3-essential-confirmed={flow.confirmedStepIds.join(",")} data-station3-essential-closed={flow.closed} data-critical-assets-ready={resources.ready} data-sensitive-permissions="camera-on-explicit-gesture" data-qr-camera="interstation-gate">
    <div className="s3-environment" style={{ backgroundImage: `url(${world3RuntimeAssets.environment.ambientTexture})` }} aria-hidden="true" />
    <header className="s3-title"><h1 id="station3-title" ref={roomTitleRef} tabIndex={-1}>{content.heading}</h1></header>
    <div className="s3-practice-layout" data-lia-destination={active ?? "index"}>
      <div className="s3-practice-guide" aria-hidden="true"><World3LiaActor active={activity.active && visible} motionEnabled={!turn && resources.ready && (selectedMotif !== null || motifEvent === 0)} action={selectedMotif ? "respond" : page ? "present" : "attention"} target={active ?? "index"} replayKey={`${active}:${folioIndex}:${motifEvent}`} reducedMotion={reducedMotion} motionMode="clips" /></div>
      {!active && !flow.closed ? <aside className="s3-practice-guide-dialogue" aria-label={locale === "en" ? "Lía’s dialogue" : "Diálogo de Lía"}>
        <strong>Lía</strong><p data-editorial-source-id="TXT_3_514ab0f6e29f" data-editorial-origin="word-p066">{content.indexDialogue}</p>
        {nextChapter && <p className="s3-practice-invitation">{locale === "en"
          ? `Open “${nextChapter.label}” in the notebook.`
          : `Abre «${nextChapter.label}» en el cuaderno.`}</p>}
      </aside> : null}
      <section className="s3-practice-notebook" aria-label={locale === "en" ? "Practice notebook" : "Cuaderno de práctica"} data-notebook-material="original-proportional">
        <div className="s3-practice-base-clip" aria-hidden="true"><img className="s3-practice-base" src={world3RuntimeAssets.notebook.openBase} alt="" draggable="false" /></div>
        <div className="s3-practice-paper" style={paperStyle} aria-busy={!!turn}>
          <div id="station3-reading-area" className="s3-practice-scroll" ref={viewportRef} role="region" tabIndex={needsScroll && activity.active ? 0 : -1} aria-label={locale === "en" ? "Notebook content" : "Contenido del cuaderno"}>
            {page && active && folio ? <article data-station3-page={active} data-station3-folio-source={folio.sourceId} data-motif-presenting={presentable && motifEvent === 0} key={`${active}:${folioIndex}`}>
              <header className="s3-practice-page-heading"><div><p className="s3-practice-number">{page.registro}</p><h2 ref={titleRef} tabIndex={-1} aria-describedby="station3-folio-position">{page.label}</h2><h3>{page.indexCopy}</h3></div>
                <button type="button" className="s3-practice-motif-button" data-motif-selected={selectedMotif === active} data-motif-kind={active} aria-label={`${content.ui.selectIllustration}: ${page.label}`} aria-pressed={selectedMotif === active} disabled={!canTurnFolio} onClick={() => { setSelectedMotif((value) => value === active ? null : active); setMotifEvent((value) => value + 1); }}><img key={motifEvent} className="s3-practice-motif s3-practice-motif--page" src={world3RuntimeAssets.practice[active]} alt="" draggable="false" /><span className="s3-practice-motif-response" aria-hidden="true" /></button>
              </header>
              <div className="s3-practice-instructions" data-editorial-source-id={folio.sourceId} data-editorial-operation={locale === "es" ? "writer-literal-explicit-errata" : "translation-en"}>
                {folio.benefits ? (
                  <ol className="s3-practice-benefits" data-editorial-origin="gvo-practice-benefits">
                    {folio.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                  </ol>
                ) : folio.steps ? (
                  <ol className="s3-practice-steps" start={folioIndex * 2 + 1}>
                    {folio.steps.map((item) => <li key={item.text}><p>{item.text}</p>
                      {item.illustration ? <img className="s3-practice-illustration" src={item.illustration} data-runtime-asset={item.illustration} alt="" width="320" height="256" draggable="false" /> : null}
                    </li>)}
                  </ol>
                ) : <p>{folio.text}</p>}
                {folio.illustration ? <img className="s3-practice-illustration" src={folio.illustration} data-runtime-asset={folio.illustration} alt="" width="320" height="256" draggable="false" /> : null}
              </div>
            </article> : <div data-station3-page="index">
              <ol className="s3-practice-index">{content.records.map((record) => {
                const state = recordState(record.id), completed = flow.confirmedStepIds.includes(stepByPage[record.id]);
                const stateLabel = requestedPage?.id === record.id ? content.ui.opening
                  : state === "locked" ? content.ui.locked : content.ui.openChapter;
                return <li key={record.id}><button type="button" data-station3-record={record.id} data-record-state={state} data-open-next={nextChapter?.id === record.id || undefined} data-record-confirmed={completed} aria-current={nextChapter?.id === record.id ? "step" : undefined} aria-describedby={`station3-index-state-${record.id}`} disabled={!activity.active || saving || failure || !!turn || !resources.ready || state === "locked"} onClick={() => open(record.id)} aria-label={record.accessibleLabel}><span className="s3-practice-number">{String(record.order).padStart(2, "0")}</span><img className="s3-practice-motif s3-practice-motif--index" src={world3RuntimeAssets.practice[record.id]} alt="" draggable="false" /><span className="s3-practice-index-copy"><strong>{record.label}</strong><span>{record.indexCopy}</span><span id={`station3-index-state-${record.id}`} className="s3-practice-index-state">{completed ? `✓ ${content.ui.confirmed}` : stateLabel}</span></span></button></li>;
              })}</ol>
            </div>}
          </div>
          {/* Layout-dependent guidance belongs to the active reader. The staged image set stays stable through preparation. */}
          {activity.active && needsScroll ? (
            <button
              type="button"
              ref={readingHintRef}
              className="s3-practice-scroll-cue"
              aria-label={content.ui.scroll}
              aria-controls="station3-reading-area"
              aria-hidden={!moreBelow || !visible || !!turn}
              onClick={() => {
                const viewport = viewportRef.current;
                if (viewport) viewport.scrollBy({ top: viewport.clientHeight * 0.75, behavior: reducedMotion ? "instant" : "smooth" });
              }}
            >
              <img src={gestureHintAssets["swipe-vertical"]} alt="" width="56" height="56" draggable="false" />
              <span className="s3-practice-scroll-full">{content.ui.scroll}</span>
              <span className="s3-practice-scroll-short">{locale === "en" ? "Read more" : "Leer más"}</span>
            </button>
          ) : null}
        </div>
        <div className="s3-practice-turn-window" style={turnStyle} ref={turnWindow}>{turn ? <World3PageTurnLayer key={turn.key} direction={turn.direction} reducedMotion={reducedMotion} width={turn.width} height={turn.height} asset={world3RuntimeAssets.notebook.turnPage} /> : null}</div>
      </section>
      <div className="s3-practice-paper-actions" data-station3-navigation="outside-original-paper">
        {page ? <>
          <p id="station3-folio-position" className="s3-practice-folio-position" role="status">{page.label} · {content.ui.folio} {folioIndex + 1} {content.ui.of} {page.folios.length}</p>
          <nav className="s3-practice-page-nav" aria-label={locale === "en" ? "Notebook pages" : "Páginas del cuaderno"}>
            {lastFolio ? (
              <button type="button" data-station3-confirm-chapter={step ?? undefined} data-station3-close={active === "senal" ? "" : undefined} disabled={!canAdvance} onClick={() => void advance()}>{content.ui.returnIndex}</button>
            ) : <>
              <div className="s3-practice-folio-directions">
                {folioIndex > 0 ? <button type="button" className="s3-practice-previous-folio" data-station3-folio-previous aria-label={content.ui.previousFolio} disabled={!canTurnFolio} onClick={previousFolio}>← {content.ui.previousFolio}</button> : null}
                <button type="button" data-station3-folio-next disabled={!canAdvance} onClick={() => void advance()}>{content.ui.nextFolio} →</button>
              </div>
              <button className="s3-practice-index-tab" type="button" disabled={!activity.active || saving || failure || !!turn} onClick={index}>{content.ui.index}</button>
            </>}
          </nav>
        </> : null}
      </div>
    </div>
    <footer className="s3-practice-footer">
      {!flow.storageVerified || failure ? <div role="alert"><p>{content.ui.saveError}</p><button type="button" disabled={!activity.active || saving} onClick={retrySave}>{content.ui.retry}</button></div> : null}
      {[resources.status, requestedResources.status].some((status) => status === "error" || status === "timeout") ? <div role="alert"><p>{locale === "en" ? "The notebook resources could not be prepared." : "No pudimos preparar los recursos del cuaderno."}</p><button type="button" disabled={!activity.active} onClick={() => setAssetRetry((value) => value + 1)}>{content.ui.retry}</button></div> : null}
      {activity.active && flow.exitReady ? <div className="s3-practice-room-exit"><p data-editorial-source-id="TXT_3_ff711cf372d1">{content.closing}</p><InterstationQrGate originWorld={3} presentation="scene" ready={!saving && !failure && flow.storageVerified} persistCompletion={() => attemptRef.current === attemptId && isEssentialExitReady(3)} onCompleted={() => { if (attemptRef.current !== attemptId || !activeRef.current || exitLock.current) return; exitLock.current = true; navigate(worldThreeToWorldFourTransitionRoute); }} /></div> : null}
    </footer>
  </main>;
}
