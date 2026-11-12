import { playJourneySound, stopJourneySound } from "../../app/audio/journeySound";
import "./World2RootScreen.css";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { InterstationQrGate } from "../../app/qr/InterstationQrGate";
import { worldTwoToWorldThreeTransitionRoute } from "../../app/routes";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { canUseUiStep, closeEssentialRoom, confirmEssentialStep, invalidateJourneyEssential, isEssentialExitReady, markEssentialPresented, recordWorld2UiFact, useEssentialFlow, type EssentialWriteResult, type World2UiFact } from "../../app/journey/journeyEssential";
import { GestureHint } from "../../components/GestureHint/GestureHint";
import { getWorld2Content, world2LayerDefinitions, type World2LayerId } from "../../content/world2EditorialSlots";
import type { CaptureTimelineStepId, RequiredInteractionId } from "../../domain/checkpoints/world2Checkpoint";
import { useAssetPreloader } from "../../shared/assets/useAssetPreloader";
import type { ScreenAssetBundle } from "../../shared/assets/screenAssetBundles";
import { World2CaptureTimeline } from "./World2CaptureTimeline";
import { World2LiaActor } from "./World2LiaActor";
import { World2MappingPanel } from "./World2MappingPanel";
import { World2MediatedResultPanel } from "./World2MediatedResultPanel";
import { world2LiaLayerProfiles, world2LiaReadyProfile } from "./world2LiaLayerProfiles";
import { getWorld2CriticalAssetSources, world2RuntimeAssets } from "./world2RuntimeAssets";
import { world2SemanticAssetManifest } from "./world2SemanticAssetManifest";

const world2LayerCount = world2LayerDefinitions.length;
const filterDemoDurationMs = 3300;
const preparedExitTarget = worldTwoToWorldThreeTransitionRoute;
type LayerStatus = "locked" | "next" | "active" | "completed";
type LayerGlyphStyle = CSSProperties & { "--world2-layer-glyph": string; "--world2-layer-glyph-position": string };
type World2FocusStyle = CSSProperties & { "--world2-focus-scale": string; "--world2-focus-x": string; "--world2-focus-y": string; "--world2-focus-brightness": string; "--world2-focus-spot-x": string; "--world2-focus-spot-y": string; "--world2-lia-shift-x": string; "--world2-lia-shift-y": string; "--world2-lia-scale": string };
type World2RootStyle = CSSProperties & { "--world2-visual-vh": string };
type LayerVisualAsset = { asset: string; role: "aura" | "origin" | "wave" | "focus" | "field" | "trail" | "contact-node" | "semantic-signal" | "acquisition-chain" | "conditioning-chain" | "support-wave" };
type LayerCallout = { anchor: "contact" | "input" | "data" | "noise" | "filter" | "stable"; label: string };
const visualAssetsByLayer: Record<World2LayerId, LayerVisualAsset[]> = {
  planta_viva: [
    { asset: world2RuntimeAssets.plantAura, role: "aura" },
    {
      asset: world2RuntimeAssets.plantBioelectricContactNode,
      role: "contact-node",
    },
  ],
  senal: [
    {
      asset: world2RuntimeAssets.signalProbeCableWaveformUnified,
      role: "semantic-signal",
    },
  ],
  captura: [
    {
      asset: world2RuntimeAssets.captureAcquisitionChain,
      role: "acquisition-chain",
    },
    { asset: world2RuntimeAssets.microCaptureReticle, role: "field" },
  ],
  acondicionamiento: [
    {
      asset: world2RuntimeAssets.conditioningNoisyToClean,
      role: "conditioning-chain",
    },
    {
      asset: world2RuntimeAssets.signalWaveformNoisyRaw,
      role: "support-wave",
    },
  ],
  mapeo: [],
  resultado_mediado: [],
};

const focusProfileByLayer: Record<World2LayerId, World2FocusStyle> = {
  planta_viva: {
    "--world2-focus-scale": "1.13",
    "--world2-focus-x": "-8%",
    "--world2-focus-y": "4%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "23%",
    "--world2-focus-spot-y": "57%",
    "--world2-lia-shift-x": "6%",
    "--world2-lia-shift-y": "3%",
    "--world2-lia-scale": "0.9",
  },
  senal: {
    "--world2-focus-scale": "1.09",
    "--world2-focus-x": "3%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.05",
    "--world2-focus-spot-x": "58%",
    "--world2-focus-spot-y": "39%",
    "--world2-lia-shift-x": "-10%",
    "--world2-lia-shift-y": "-2%",
    "--world2-lia-scale": "0.92",
  },
  captura: {
    "--world2-focus-scale": "1.07",
    "--world2-focus-x": "2%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "52%",
    "--world2-focus-spot-y": "43%",
    "--world2-lia-shift-x": "-11%",
    "--world2-lia-shift-y": "-3%",
    "--world2-lia-scale": "0.88",
  },
  acondicionamiento: {
    "--world2-focus-scale": "1.06",
    "--world2-focus-x": "1%",
    "--world2-focus-y": "-2%",
    "--world2-focus-brightness": "1.04",
    "--world2-focus-spot-x": "54%",
    "--world2-focus-spot-y": "45%",
    "--world2-lia-shift-x": "-10%",
    "--world2-lia-shift-y": "-2%",
    "--world2-lia-scale": "0.88",
  },
  mapeo: {
    "--world2-focus-scale": "1.1",
    "--world2-focus-x": "1%",
    "--world2-focus-y": "-6%",
    "--world2-focus-brightness": "1.02",
    "--world2-focus-spot-x": "45%",
    "--world2-focus-spot-y": "34%",
    "--world2-lia-shift-x": "2%",
    "--world2-lia-shift-y": "1%",
    "--world2-lia-scale": "0.88",
  },
  resultado_mediado: {
    "--world2-focus-scale": "1.11",
    "--world2-focus-x": "3%",
    "--world2-focus-y": "-4%",
    "--world2-focus-brightness": "1.03",
    "--world2-focus-spot-x": "54%",
    "--world2-focus-spot-y": "38%",
    "--world2-lia-shift-x": "-2%",
    "--world2-lia-shift-y": "2%",
    "--world2-lia-scale": "0.95",
  },
};

const visualCalloutsByLayer: Partial<Record<World2LayerId, LayerCallout[]>> = {
  planta_viva: [{ anchor: "contact", label: "Toca aquí" }],
};

const focusTargetByLayer: Record<World2LayerId, string> = {
  planta_viva: "plant-contact",
  senal: "clean-technical-waveform",
  captura: "acquisition-chain",
  acondicionamiento: "noise-filter-stable-signal",
  mapeo: "mapping-module",
  resultado_mediado: "mediated-microstory",
};


const stepByLayer: Record<World2LayerId, string> = { planta_viva: "planta", senal: "senal", captura: "captura", acondicionamiento: "acondicionamiento", mapeo: "mapeo", resultado_mediado: "musica" };
const layerByStep: Record<string, World2LayerId> = { planta: "planta_viva", senal: "senal", captura: "captura", acondicionamiento: "acondicionamiento", mapeo: "mapeo", musica: "resultado_mediado" };
function getLayerGlyphStyle(index: number): LayerGlyphStyle { return { "--world2-layer-glyph": `url(${world2RuntimeAssets.layerGlyphAtlas})`, "--world2-layer-glyph-position": `${index * 20}% 0%` }; }

export function World2RootScreen() {
  const navigate = useNavigate();
  const locale = readLanguagePreference() ?? "es";
  const en = locale === "en";
  const content = getWorld2Content(locale);
  const { ui } = content;
  const layerCopy = content.layers;
  const world2IntegrationCopy = content.layers;
  const world2ReadoutCopy = content.readouts;
  const flow = useEssentialFlow(2);
  const activity = useJourneyActivity();
  const attemptId = activity.attemptId;
  const attemptRef = useRef(attemptId);
  attemptRef.current = attemptId;
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const activeRef = useRef(activity.active); activeRef.current = activity.active;
  const rootRef = useRef<HTMLElement>(null);
  const filterLabelRef = useRef<HTMLSpanElement>(null);
  const plantContactHotspotRef = useRef<HTMLButtonElement>(null);
  const signalRevealControlRef = useRef<HTMLButtonElement>(null);
  const [selection, setSelection] = useState<World2LayerId | null>(null);
  const activeLayerId = selection ?? layerByStep[flow.activeStepId ?? "musica"] ?? "planta_viva";
  const activeLayer = world2LayerDefinitions.find((layer) => layer.id === activeLayerId)!;
  const [readout, setReadout] = useState<"plant" | "signal" | null>(null);
  const [captureTimelineStepId, setCaptureTimelineStepId] = useState<CaptureTimelineStepId>("contact");
  const [captureIntent, setCaptureIntent] = useState<CaptureTimelineStepId | null>(null);
  const [captureDemo, setCaptureDemo] = useState(false);
  const [filterDemo, setFilterDemo] = useState<"idle" | "running" | "complete">("idle");
  const [mappingPresented, setMappingPresented] = useState(false);
  const [sonicConvergenceComplete, setSonicConvergenceComplete] = useState(false);
  const [resultRequested, setResultRequested] = useState(false);
  const [presentationMode, setPresentationMode] = useState<"standard" | "assisted">("standard");
  const [failure, setFailure] = useState(false);
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const pendingActions = useRef<Array<{ attemptId: string | null; action: () => Promise<EssentialWriteResult>; next?: () => void }>>([]);
  const failedWrite = useRef(false);
  const retry = useRef<null | (() => Promise<void>)>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const requestKey = useRef("");
  const [softMessage, setSoftMessage] = useState<string | null>(null);
  const facts = flow.snapshot?.stations[2].interactionEvidence ?? [];
  const completedRequiredInteractions = new Set(facts.filter((fact) => fact.kind === "required_interaction").map((fact) => fact.id as RequiredInteractionId));
  const captureVisitedStepIds = new Set(facts.filter((fact) => fact.kind === "capture_step").map((fact) => fact.id as CaptureTimelineStepId));
  const mappingFirstRunComplete = facts.some((fact) => fact.kind === "mapping_first_run");
  const captureTimelineCompleted = captureVisitedStepIds.size === 3;
  const captureTimelineInteracted = captureVisitedStepIds.size > 0;
  const plantContactReadoutState = readout === "plant" ? "expanded" : "idle";
  const signalRevealState = readout === "signal" ? "expanded" : "idle";
  const visitedLayerIds = new Set(flow.presentedStepIds.map((step) => layerByStep[step]));
  const highestUnlockedLayerOrder = flow.readOnly ? 6 : Math.min(flow.confirmedStepIds.length + 1, 6);
  const completedRequiredInteractionList = [...completedRequiredInteractions].join(",");
  const visitedLayerOrderList = world2LayerDefinitions.filter((layer) => visitedLayerIds.has(layer.id)).map((layer) => layer.order).join(",");
  const isReadyToContinue = flow.closed && selection === null;
  const activityContinued = flow.closed;
  const world2State = isReadyToContinue ? "ready_to_continue" : activeLayerId;
  const resultState = flow.closed ? "ready_to_continue" : activeLayerId === "resultado_mediado" ? "convergence_pending" : "not_started";
  const checkpointInputBlocked = !activity.active || saving || failure || !flow.storageVerified;
  const activeCopy = layerCopy[activeLayerId];
  const activeLiaProfile = isReadyToContinue ? world2LiaReadyProfile : world2LiaLayerProfiles[activeLayerId];
  const activeVisualAssets = visualAssetsByLayer[activeLayerId];
  const activeFocusProfile = focusProfileByLayer[activeLayerId];
  const activeCallouts = (visualCalloutsByLayer[activeLayerId] ?? []).map((callout) => ({ ...callout, label: ui.tap }));
  const activeLayerContent = isReadyToContinue ? "closure" : { planta_viva: "plant", senal: "signal", captura: "capture", acondicionamiento: "conditioning", mapeo: "mapping", resultado_mediado: "result" }[activeLayerId];
  const showSignalCinema = activeLayerId === "senal" && !isReadyToContinue;
  const showAcquisitionCinema = activeLayerId === "captura" && !isReadyToContinue;
  const showConditioningCinema = activeLayerId === "acondicionamiento" && !isReadyToContinue;
  const sceneHasSemanticComponent = true;
  const world2EditorialSlots = world2LayerDefinitions;
  const cleanMessages = { locked: en ? "Continue through the current layer first." : "Continúa primero por la capa actual.", lockedHint: ui.advance, complete: content.readouts.complete.text };
  const isLockedMessage = softMessage === cleanMessages.locked;
  const expandedReadout = readout === "plant" ? content.readouts.plant : readout === "signal" ? content.readouts.signal : activeLayerId === "captura" ? { ...content.capture.find((step) => step.id === captureTimelineStepId)!, title: content.capture.find((step) => step.id === captureTimelineStepId)!.label, text: captureDemo ? content.capture.map((step) => step.readout).join(" ") : content.capture.find((step) => step.id === captureTimelineStepId)!.readout, origin: "legacy:World2CaptureTimeline:" + captureTimelineStepId } : null;
  const sceneReadout = activeLayerId === "captura" || readout === "signal" ? expandedReadout : null;
  const activeDialogue = failure || !flow.storageVerified ? ui.saveError : softMessage ?? (isReadyToContinue ? content.readouts.complete.text : sceneReadout ? "" : expandedReadout?.text ?? activeCopy.dialogue);
  const activeHint = activeLayerId === "resultado_mediado" ? ui.musicHint : activeCopy.hint;
  const [visualViewportHeight, setVisualViewportHeight] = useState<number | null>(null);
  const world2RootStyle = visualViewportHeight ? { "--world2-visual-vh": `${visualViewportHeight}px` } as World2RootStyle : undefined;
  const bundle = useMemo<ScreenAssetBundle>(() => ({ id: "world2RootInitial", route: "/estacion/2", description: "OBS03 actual visible layer", assets: getWorld2CriticalAssetSources(activeLayerId).map((src, index) => ({ id: "world2-visible-" + index, src, kind: "image" as const })) }), [activeLayerId]);
  const initialPreload = useAssetPreloader(bundle, { concurrency: 2, retryKey: retryRevision, reuseVerified: retryRevision === 0, contextKey: activeLayerId + ":" + locale });
  const resourcesReady = initialPreload.status === "ready";
  const nextLayerId = flow.confirmedStepIds.includes(stepByLayer[activeLayerId])
    ? layerByStep[flow.activeStepId ?? "musica"]
    : world2LayerDefinitions[Math.min(activeLayer.order, 5)].id;
  const nextBundle = useMemo<ScreenAssetBundle>(() => ({ id: "world2RootInitial", route: "/estacion/2", description: "OBS03 next layer before explicit advance", assets: getWorld2CriticalAssetSources(nextLayerId).map((src, index) => ({ id: "world2-next-" + index, src, kind: "image" as const })) }), [nextLayerId]);
  const nextPreload = useAssetPreloader(nextBundle, { enabled: activity.active && resourcesReady && nextLayerId !== activeLayerId, concurrency: 2, retryKey: retryRevision, reuseVerified: retryRevision === 0, contextKey: "next:" + nextLayerId + ":" + locale });
  const advanceAssetsReady = resourcesReady && (nextLayerId === activeLayerId || nextPreload.status === "ready");
  const previouslyConfirmed = flow.readOnly || flow.confirmedStepIds.includes(stepByLayer[activeLayerId]);
  const visualReadyByLayer: Record<World2LayerId, boolean> = {
    planta_viva: previouslyConfirmed || completedRequiredInteractions.has("plant_contact_readout_seen"),
    senal: previouslyConfirmed || completedRequiredInteractions.has("signal_measured_wave_seen"),
    captura: captureDemo || captureTimelineCompleted,
    acondicionamiento: previouslyConfirmed || filterDemo === "complete",
    mapeo: mappingPresented,
    resultado_mediado: sonicConvergenceComplete || flow.closed,
  };
  const essentialVisualReady = visualReadyByLayer[activeLayerId];
  const presentable = activity.active && visible && resourcesReady && essentialVisualReady;

  async function drainWrites() {
    if (attemptRef.current !== attemptId || lock.current || failedWrite.current || !activeRef.current) return;
    lock.current = true; setSaving(true);
    while (pendingActions.current.length && activeRef.current && attemptRef.current === attemptId) {
      const pending = pendingActions.current[0];
      if (pending.attemptId !== attemptId) { pendingActions.current.shift(); continue; }
      try {
        const result = await pending.action();
        if (attemptRef.current !== attemptId) return;
        if (!result.ok) { failedWrite.current = true; setFailure(true); break; }
      } catch { if (attemptRef.current !== attemptId) return; failedWrite.current = true; setFailure(true); break; }
      pendingActions.current.shift();
      if (activeRef.current) pending.next?.();
    }
    lock.current = false; setSaving(false);
    if (!failedWrite.current) { setFailure(false); retry.current = null; }
  }
  async function perform(action: () => Promise<EssentialWriteResult>, next?: () => void) {
    if (attemptRef.current !== attemptId || !activeRef.current || flow.readOnly) return;
    pendingActions.current.push({ attemptId, action, next });
    retry.current = async () => { failedWrite.current = false; setFailure(false); await drainWrites(); };
    await drainWrites();
  }
  async function record(kind: World2UiFact["kind"], id: string) {
    if (flow.readOnly) return;
    await perform(() => recordWorld2UiFact({ kind, id, origin: "visitor_ui", contentRevision: flow.contentRevision, attemptId }));
  }
  function selectLayer(layer: World2LayerId) {
    if (attemptRef.current !== attemptId) return;
    if (!activity.active || saving || failure || !canUseUiStep(2, stepByLayer[layer])) { setSoftMessage(cleanMessages.locked); return; }
    playJourneySound("interaction");
    setSelection(layer); setReadout(null); setSoftMessage(null); setResultRequested(false); setPresentationMode("standard");
    setCaptureDemo(false); setFilterDemo("idle"); setMappingPresented(false); setSonicConvergenceComplete(false);
  }
  function getLayerStatus(layer: World2LayerId): LayerStatus { return !canUseUiStep(2, stepByLayer[layer]) ? "locked" : layer === activeLayerId ? "active" : flow.confirmedStepIds.includes(stepByLayer[layer]) ? "completed" : "next"; }
  function getStatusLabel(status: LayerStatus) { return en ? { locked: "locked", active: "active", completed: "confirmed", next: "available" }[status] : { locked: "bloqueada", active: "activa", completed: "confirmada", next: "disponible" }[status]; }
  function expandPlantContactReadout() { if (attemptRef.current !== attemptId || !activity.active || !resourcesReady) return; playJourneySound("interaction"); setReadout("plant"); }
  function expandSignalReveal() { if (attemptRef.current !== attemptId || !activity.active || !resourcesReady) return; playJourneySound("interaction"); setReadout("signal"); }
  function selectCaptureTimelineStep(step: CaptureTimelineStepId) { if (attemptRef.current !== attemptId || !activity.active || !resourcesReady || lock.current) return; playJourneySound("interaction"); setCaptureTimelineStepId(step); setCaptureIntent(step); }
  function completeMappingFirstRun() { if (attemptRef.current === attemptId) void record("mapping_first_run", "mapping_first_run"); }
  function completeSonicConvergence(mode: "standard" | "assisted") { if (attemptRef.current !== attemptId) return; setPresentationMode(mode); setSonicConvergenceComplete(true); }
  async function advance() {
    if (attemptRef.current !== attemptId || !presentable || !advanceAssetsReady || saving) return;
    if (flow.readOnly || flow.confirmedStepIds.includes(stepByLayer[activeLayerId])) { setSelection(null); return; }
    await perform(activeLayerId === "resultado_mediado" ? () => closeEssentialRoom({ screen: 2, contentRevision: flow.contentRevision, attemptId, cause: "visitor_close" }) : () => confirmEssentialStep({ screen: 2, stepId: stepByLayer[activeLayerId], contentRevision: flow.contentRevision, attemptId, cause: "visitor_advance" }), () => {
      if (activeLayerId === "resultado_mediado") playJourneySound("roomComplete");
      setSelection(null); setReadout(null); setSoftMessage(null); setPresentationMode("standard"); setResultRequested(false); setCaptureDemo(false); setFilterDemo("idle"); setMappingPresented(false); setSonicConvergenceComplete(false);
    });
  }
  function showResult() { if (attemptRef.current !== attemptId || !activity.active || !resourcesReady) return; setPresentationMode("assisted"); if (activeLayerId === "captura") { setCaptureDemo(true); setCaptureTimelineStepId("system"); } else setResultRequested(true); }
  function retryAction() { if (retry.current) void retry.current(); else { invalidateJourneyEssential(); setRetryRevision((r) => r + 1); } }
  useEffect(() => {
    if (activeLayerId !== "acondicionamiento" || isReadyToContinue || !activity.active) stopJourneySound("conditioning");
    return () => stopJourneySound("conditioning");
  }, [activeLayerId, isReadyToContinue, activity.active]);
  useEffect(() => {
    pendingActions.current = []; lock.current = false; failedWrite.current = false; retry.current = null; requestKey.current = "";
    setSaving(false); setFailure(false); setSelection(null); setReadout(null); setSoftMessage(null);
    setCaptureIntent(null); setCaptureTimelineStepId("contact"); setCaptureDemo(false); setFilterDemo("idle");
    setMappingPresented(false); setSonicConvergenceComplete(false); setResultRequested(false); setPresentationMode("standard");
  }, [attemptId]);
  useEffect(() => {
    const update = () => setVisualViewportHeight(Math.round(window.visualViewport?.height ?? window.innerHeight));
    update(); window.addEventListener("resize", update); window.visualViewport?.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); window.visualViewport?.removeEventListener("resize", update); };
  }, []);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (filterDemo !== "running") return;
    if (!activity.active || !visible || !resourcesReady || activeLayerId !== "acondicionamiento") {
      setFilterDemo("idle");
      return;
    }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      if (attemptRef.current === attemptId && activeRef.current && document.visibilityState !== "hidden") setFilterDemo("complete");
    }, reduced ? 0 : filterDemoDurationMs);
    return () => window.clearTimeout(timer);
  }, [filterDemo, activity.active, visible, resourcesReady, activeLayerId, attemptId]);
  useEffect(() => {
    if (!activity.active || !visible || !resourcesReady || flow.readOnly || !captureIntent || captureDemo || activeLayerId !== "captura" || captureVisitedStepIds.has(captureIntent)) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => { second = window.requestAnimationFrame(() => { if (activeRef.current && document.visibilityState !== "hidden") void record("capture_step", captureIntent); }); });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [attemptId, activity.active, visible, resourcesReady, flow.readOnly, captureIntent, captureDemo, activeLayerId, flow.revision]);
  useEffect(() => {
    if (!activity.active || !visible || !resourcesReady || flow.readOnly || !captureTimelineCompleted || completedRequiredInteractions.has("capture_data_readout_seen")) return;
    void record("required_interaction", "capture_data_readout_seen");
  }, [attemptId, activity.active, visible, resourcesReady, flow.readOnly, captureTimelineCompleted, completedRequiredInteractionList]);
  useEffect(() => {
    if (!presentable || flow.readOnly || isReadyToContinue) return;
    const stepId = stepByLayer[activeLayerId], key = attemptId + ":" + stepId + ":" + presentationMode;
    if (requestKey.current === key || (flow.presentedStepIds.includes(stepId) && (presentationMode !== "assisted" || flow.assistedPresentedStepIds.includes(stepId)))) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => { second = window.requestAnimationFrame(() => { if (attemptRef.current !== attemptId || !activeRef.current || document.visibilityState === "hidden") return; requestKey.current = key; void perform(() => markEssentialPresented({ screen: 2, stepId, contentRevision: flow.contentRevision, attemptId, mode: presentationMode })); }); });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [attemptId, presentable, flow.readOnly, isReadyToContinue, activeLayerId, presentationMode, flow.contentRevision, flow.presentedStepIds, flow.assistedPresentedStepIds]);
  useEffect(() => {
    if (!activity.active || !visible || !resourcesReady || flow.readOnly || !readout) return;
    const id = readout === "plant" ? "plant_contact_readout_seen" : "signal_measured_wave_seen";
    if (completedRequiredInteractions.has(id)) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => { second = window.requestAnimationFrame(() => { if (activeRef.current) void record("required_interaction", id); }); });
    return () => { window.cancelAnimationFrame(first); window.cancelAnimationFrame(second); };
  }, [attemptId, activity.active, visible, resourcesReady, flow.readOnly, readout, completedRequiredInteractionList]);
  return (
    <main
      ref={rootRef}
      className="world2-root-screen"
      style={world2RootStyle}
      data-journey-active={activity.active}
      data-lia-action={essentialVisualReady ? "present" : "attention"}
      data-lia-target={activeLayerId}
      data-world2-experience="option6-closure-centering-post-completion-revisit-fix-r2"
      data-world2-runtime-version="016V-R2"
      data-world2-post-completion-revisit="enabled"
      data-world2-active-layer-content={activeLayerContent}
      data-world2-option6-overlay-visible={
        activeLayer.id === "resultado_mediado" ? "true" : "false"
      }
      data-world2-editorial-source="editorial_excel"
      data-world2-editorial-status="REVIEW"
      data-world2-option12-visual-polish="016K"
      data-world2-option3-capture-final-polish="016L"
      data-world2-option3-capture-swipe-timeline="016R"
      data-world2-responsive-parity="016M"
      data-world2-legibility="debt-008-responsive"
      data-world2-required-interactions="016R"
      data-capture-cinema="016R"
      data-world2-completed-required-interactions={
        completedRequiredInteractionList || "none"
      }
      data-world2-state={world2State}
      data-world2-active-layer={activeLayer.id}
      data-world2-current-layer={activeLayer.order}
      data-world2-highest-unlocked-layer={highestUnlockedLayerOrder}
      data-world2-visited-layers={visitedLayerOrderList}
      data-world2-completed-count={visitedLayerIds.size}
      data-world2-checkpoint-blocked={checkpointInputBlocked ? "true" : "false"}
      data-world2-checkpoint-pending={saving ? "essential_write" : "none"}
      data-world2-checkpoint-recovery={flow.storageVerified ? "none" : "storage_unverified"}
      data-world2-mapping-first-run-complete={
        mappingFirstRunComplete ? "true" : "false"
      }
      data-world2-result-state={resultState}
      data-world2-semantic-layer-count={world2SemanticAssetManifest.length}
      data-world2-slot-count={Object.keys(world2EditorialSlots).length}
      data-world2-label-system="015V"
      data-world2-nav-mode="stable-visible-row"
      data-sensitive-permissions="camera-on-explicit-gesture"
      data-qr-camera="interstation-gate"
      data-world2-activity-continued={activityContinued}
      data-critical-assets-ready={initialPreload.ready ? "true" : "false"}
      data-critical-assets-status={initialPreload.status}
      data-world2-exit-target={
        isReadyToContinue ? preparedExitTarget : undefined
      }
      aria-labelledby="world2-root-title"
    >
      {initialPreload.ready ? null : (
        <p className="world2-root-preload-status" role="status">
          {en ? "Preparing the invisible pulse…" : "Preparando pulso invisible…"}
        </p>
      )}
      <section
        className="world2-stage"
        aria-label={en ? "Interactive Room II scene with six layers: plant, signal, capture, conditioning, mapping and music." : "Escena interactiva de Sala II con seis capas: planta viva, señal, captura, acondicionamiento, mapeo y música."}
        data-world2-layout="adaptive-zones"
        data-world2-slot-id="W2_ACCESSIBLE_SCENE_01"
      >
        <img
          className="world2-scene-asset world2-scene-asset--background"
          src={world2RuntimeAssets.background}
          alt=""
          aria-hidden="true"
          data-runtime-asset={world2RuntimeAssets.background}
          fetchPriority="high"
        />
        <header className="world2-scene-title" data-world2-zone="header">
          <h1
            id="world2-root-title"
            data-editorial-origin="TXT_2_8263a577d1f3"
            data-editorial-status="REVIEW"
            data-editorial-source="editorial_excel"
          >
            {ui.heading}
          </h1>
        </header>

        <section
          className="world2-scene-zone"
          aria-hidden={sceneHasSemanticComponent ? undefined : true}
          data-world2-zone="scene"
          data-world2-scene-layer={activeLayer.id}
          data-active-layer={activeLayer.order}
          data-active-layer-id={activeLayer.id}
          data-world2-focus-profile={activeLayer.id}
          data-world2-focus-target={focusTargetByLayer[activeLayer.id]}
          data-world2-cinematic-layer-focus="015V"
          data-plant-contact-readout-state={
            activeLayer.id === "planta_viva"
              ? plantContactReadoutState
              : undefined
          }
          data-capture-readout-state={
            activeLayer.id === "captura"
              ? captureTimelineCompleted
                ? "expanded"
                : "idle"
              : undefined
          }
          data-world2-capture-step={
            activeLayer.id === "captura" ? captureTimelineStepId : undefined
          }
          style={activeFocusProfile}
        >
          <div className="world2-scene-field">
            <div
              className="world2-semantic-focus"
              data-world2-semantic-focus={activeLayer.id}
            >
              <img
                className="world2-scene-asset world2-scene-asset--plant-anchor"
                src={world2RuntimeAssets.plantStageAnchor}
                alt=""
                aria-hidden="true"
                data-runtime-asset={world2RuntimeAssets.plantStageAnchor}
                fetchPriority="high"
              />
              <img
                className="world2-scene-asset world2-scene-asset--plant"
                src={world2RuntimeAssets.plant}
                alt=""
                aria-hidden="true"
                data-runtime-asset={world2RuntimeAssets.plant}
                fetchPriority="high"
              />
              <span
                className="world2-contact-pulse"
                aria-hidden="true"
                data-world2-focus-pulse={activeLayer.id}
              />
              {activeLayer.id === "planta_viva" && !isReadyToContinue ? (
                <>
                  <button
                    ref={plantContactHotspotRef}
                    className="world2-plant-contact-hotspot"
                    type="button"
                    data-plant-contact-hotspot="016J"
                    data-plant-contact-readout-state={plantContactReadoutState}
                    aria-label={en ? "Open reading point" : "Abrir Punto de lectura"}
                    aria-expanded={plantContactReadoutState === "expanded"}
                    disabled={!activity.active || !resourcesReady || saving}
                    onClick={expandPlantContactReadout}
                  >
                    <span
                      className="world2-plant-contact-hotspot__ring"
                      aria-hidden="true"
                    />
                    <span
                      className="world2-plant-contact-hotspot__cue"
                      aria-hidden="true"
                    />
                  </button>
                  <GestureHint
                    active={activity.active && plantContactReadoutState === "idle"}
                    anchorRef={plantContactHotspotRef}
                    className="world2-gesture-hint world2-gesture-hint--plant-contact"
                    completed={plantContactReadoutState === "expanded"}
                    targetLabel={en ? "Reading point" : "Punto de lectura"}
                    variant="tap"
                  />
                </>
              ) : null}
              <span
                className="world2-focus-thread"
                aria-hidden="true"
                data-world2-focus-thread={activeLayer.id}
              />
              {showSignalCinema ? (
                <div
                  className="world2-signal-cinema"
                  data-signal-cinema="016J"
                  data-signal-reveal-state={signalRevealState}
                  data-world2-signal-base-mode="static-unified-probe-leaf-attached"
                  data-world2-signal-contact-alignment="probe-to-plant"
                  data-world2-signal-expanded-mode="scene-focus-large-projected-waveform-moving-alpha-mask"
                  data-world2-signal-contact-source="unified-image-asset"
                  data-world2-primary-signal-asset={
                    world2RuntimeAssets.signalProbeCableWaveformUnified
                  }
                  data-world2-expanded-signal-asset={
                    world2RuntimeAssets.signalWaveformCleanTechnical
                  }
                  data-world2-signal-read-style="scene-focus-large-projected-waveform-moving-alpha-mask"
                  data-world2-signal-readout-safe-area="016I"
                  data-world2-signal-scan="moving-alpha-mask"
                  data-world2-reduced-motion-safe="visible-content"
                  key={`world2-signal-cinema-${activeLayer.id}`}
                >
                  <span className="world2-signal-cinema__ambient" />
                  <img
                    className="world2-signal-cinema__static-base"
                    src={world2RuntimeAssets.signalProbeCableWaveformUnified}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={
                      world2RuntimeAssets.signalProbeCableWaveformUnified
                    }
                    data-world2-layer-visual={activeLayer.id}
                    data-world2-visual-role="unified-probe-cable-waveform"
                    data-world2-signal-base="static-unified-probe-leaf-attached"
                    loading="lazy"
                  />
                  <div
                    className="world2-signal-cinema__projection"
                    aria-hidden="true"
                    data-world2-signal-projection="expanded-clean-waveform"
                  >
                    <img
                      className="world2-signal-cinema__projected-wave world2-signal-cinema__projected-wave--base"
                      src={world2RuntimeAssets.signalWaveformCleanTechnical}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.signalWaveformCleanTechnical
                      }
                      data-world2-signal-projection-layer="base"
                      loading="lazy"
                    />
                    <img
                      className="world2-signal-cinema__projected-wave world2-signal-cinema__projected-wave--scan"
                      src={world2RuntimeAssets.signalWaveformCleanTechnical}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.signalWaveformCleanTechnical
                      }
                      data-world2-signal-reveal="projected-clean-waveform"
                      data-world2-signal-scan="moving-alpha-mask"
                      loading="lazy"
                    />
                  </div>
                  <button
                    ref={signalRevealControlRef}
                    className="world2-signal-cinema__label world2-micro-label world2-micro-label--bright world2-micro-label--asset-anchored world2-micro-label--subtle-motion"
                    type="button"
                    data-world2-label-anchor="signal-waveform"
                    data-world2-signal-reveal-control="onda-medida"
                    aria-label={en ? "Expand measured wave" : "Expandir señal medida"}
                    aria-pressed={signalRevealState === "expanded"}
                    disabled={!activity.active || !resourcesReady || saving}
                    onClick={expandSignalReveal}
                  >
                    <span
                      className="world2-signal-cinema__cue"
                      data-world2-signal-cue="onda-medida"
                      aria-hidden="true"
                    />
                    <span className="world2-micro-label__text">
                      {ui.wave}
                    </span>
                  </button>
                  <GestureHint
                    active={activity.active && signalRevealState === "idle"}
                    anchorRef={signalRevealControlRef}
                    className="world2-gesture-hint world2-gesture-hint--signal-wave"
                    completed={signalRevealState === "expanded"}
                    targetLabel={ui.wave}
                    variant="tap"
                  />
                </div>
              ) : showAcquisitionCinema ? (
                <World2CaptureTimeline
                  asset={world2RuntimeAssets.captureAcquisitionChain}
                  readoutPlacement="dialogue"
                  completed={captureTimelineCompleted}
                  active={activity.active && resourcesReady}
                  locale={locale}
                  currentStepId={captureTimelineStepId}
                  hasInteracted={captureTimelineInteracted}
                  onSelectStep={selectCaptureTimelineStep}
                  visitedStepIds={captureVisitedStepIds}
                />
              ) : showConditioningCinema ? (
                <div
                  className="world2-conditioning-cinema"
                  style={{ "--world2-filter-duration": `${filterDemoDurationMs}ms` } as CSSProperties}
                  data-conditioning-cinema="016T-R2"
                  data-world2-conditioning-animation="moving-alpha-mask-transformation"
                  data-world2-conditioning-sequence="integrated-noise-filter-stable"
                  data-world2-conditioning-interactions="visual-demo"
                  data-world2-filter-demo={filterDemo}
                  data-world2-conditioning-pulse-count="1"
                  data-world2-conditioning-source-copies="2"
                  data-world2-primary-conditioning-asset={
                    world2RuntimeAssets.conditioningNoisyToClean
                  }
                  key={`world2-conditioning-cinema-${activeLayer.id}`}
                  aria-hidden="true"
                >
                  <span className="world2-conditioning-cinema__ambient" />
                  <div
                    className="world2-conditioning-cinema__stage"
                    data-world2-conditioning-stage="asset-moving-mask-flow"
                  >
                    <img
                      className="world2-layer-asset world2-layer-asset--conditioning-chain world2-conditioning-cinema__asset world2-conditioning-cinema__asset--base"
                      src={world2RuntimeAssets.conditioningNoisyToClean}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.conditioningNoisyToClean
                      }
                      data-world2-layer-visual={activeLayer.id}
                      data-world2-visual-role="conditioning-asset-base"
                      loading="lazy"
                    />
                    <img
                      className="world2-layer-asset world2-layer-asset--conditioning-chain world2-conditioning-cinema__asset world2-conditioning-cinema__asset--scan"
                      src={world2RuntimeAssets.conditioningNoisyToClean}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={
                        world2RuntimeAssets.conditioningNoisyToClean
                      }
                      data-world2-layer-visual={activeLayer.id}
                      data-world2-visual-role="conditioning-asset-intense-scan"
                      data-world2-conditioning-flow="single-moving-alpha-mask"
                      data-world2-conditioning-mask="horizontal-window"
                      loading="lazy"
                    />
                    <span
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--noise"
                      data-world2-label-anchor="conditioning-noise"
                    >
                      {en ? "NOISE" : "RUIDO"}
                    </span>
                    <span
                      ref={filterLabelRef}
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--filter"
                      data-world2-label-anchor="conditioning-filter"
                      data-world2-label-legibility="uppercase-explicit"
                    >
                      {en ? "FILTER" : "FILTRO"}
                    </span>
                    <span
                      className="world2-conditioning-cinema__label world2-conditioning-cinema__label--stable"
                      data-world2-label-anchor="conditioning-stable"
                    >
                      {en ? "STABLE SIGNAL" : "SEÑAL ESTABLE"}
                    </span>
                  </div>
                </div>
              ) : (
                activeVisualAssets.map((visual) => (
                  <img
                    className={`world2-layer-asset world2-layer-asset--${visual.role}`}
                    src={visual.asset}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={visual.asset}
                    data-world2-layer-visual={
                      isReadyToContinue ? "ready_to_continue" : activeLayer.id
                    }
                    data-world2-visual-role={visual.role}
                    key={`${activeLayer.id}-${visual.role}-${visual.asset}`}
                    loading="lazy"
                  />
                ))
              )}
              {activeLayer.id === "mapeo" && !isReadyToContinue ? (
                <World2MappingPanel
                  key={`mapping:${attemptId}`}
                  cleanSignalAsset={
                    world2RuntimeAssets.signalWaveformCleanTechnical
                  }
                  firstRunComplete={mappingFirstRunComplete}
                  active={activity.active && resourcesReady}
                  locale={locale}
                  showResultRequested={resultRequested}
                  onPresented={(mode) => { if (attemptRef.current !== attemptId) return; setMappingPresented(true); setPresentationMode(mode); }}
                  interactionBlocked={checkpointInputBlocked}
                  onFirstRunComplete={completeMappingFirstRun}
                />
              ) : null}
              {activeLayer.id === "resultado_mediado" || isReadyToContinue ? (
                <World2MediatedResultPanel
                  key={`music:${attemptId}`}
                  complete={sonicConvergenceComplete || flow.closed}
                  active={activity.active && resourcesReady}
                  locale={locale}
                  showResultRequested={resultRequested}
                  onComplete={completeSonicConvergence}
                />
              ) : null}
              {activeCallouts.length > 0 ? (
                <div className="world2-layer-callouts" aria-hidden="true">
                  {activeCallouts.map((callout) => (
                    <span
                      className={`world2-layer-callout world2-layer-callout--${callout.anchor} world2-micro-label world2-micro-label--bright world2-micro-label--asset-anchored world2-micro-label--subtle-motion`}
                      data-world2-callout={callout.anchor}
                      data-world2-label-anchor={`plant-${callout.anchor}`}
                      key={`${activeLayer.id}-${callout.anchor}`}
                    >
                      <span className="world2-micro-label__text">
                        {callout.label}
                      </span>
                    </span>
                  ))}
                </div>
              ) : null}
              <World2LiaActor profile={activeLiaProfile} active={activity.active && visible && resourcesReady} action={readout || captureIntent || filterDemo === "complete" || sonicConvergenceComplete ? "respond" : essentialVisualReady ? "present" : "attention"} replayKey={`${activeLayerId}:${readout}:${captureTimelineStepId}:${filterDemo}:${mappingPresented}:${sonicConvergenceComplete}`} />
            </div>
          </div>
          {sceneReadout ? (
            <div className="world2-scene-readout" role="status">
              <p data-editorial-origin={sceneReadout.origin} data-world2-capture-readout={activeLayerId === "captura" ? captureTimelineStepId : undefined}>{sceneReadout.text}</p>
              {activeLayerId === "captura" && captureTimelineStepId === "signal" ? (
                <ul className="world2-capture-traits" aria-label={en ? "Signal features" : "Rasgos de la señal"}>
                  {(en ? ["Amplitude", "Variation", "Range"] : ["Amplitud", "Variación", "Rango"]).map((trait) => <li key={trait}>{trait}</li>)}
                </ul>
              ) : null}
            </div>
          ) : null}
        </section>

        <article
          className="world2-dialogue"
          aria-live="polite"
          data-world2-zone="dialogue"
          data-world2-dialogue-layer={activeLayer.id}
          data-world2-closure-layout={
            isReadyToContinue ? "centered-balanced" : undefined
          }
          data-world2-closure-title-count={isReadyToContinue ? "1" : undefined}
        >
          <img
            className="world2-dialogue__asset world2-dialogue__asset--backplate"
            src={world2RuntimeAssets.dialogueCard}
            alt=""
            aria-hidden="true"
            data-runtime-asset={world2RuntimeAssets.dialogueCard}
          />
          <div className="world2-dialogue__content">
            <div className="world2-dialogue__safe">
              <div
                className="world2-dialogue__copy-block"
                data-plant-contact-readout-state={
                  activeLayer.id === "planta_viva" && expandedReadout
                    ? "expanded"
                    : undefined
                }
                data-world2-required-interaction={
                  activeLayer.id === "planta_viva" && expandedReadout
                    ? "plant_contact_readout_seen"
                    : undefined
                }
                data-world2-signal-readout={
                  activeLayer.id === "senal" && expandedReadout
                    ? "expanded"
                    : undefined
                }
                data-world2-reading-surface="dialogue"
              >
                <p className="world2-dialogue__eyebrow">
                  {isReadyToContinue
                    ? ui.heading
                    : `${ui.layer} ${activeLayer.order} ${ui.of} ${world2LayerCount}`}
                </p>
                <p
                  className="world2-dialogue__title"
                  data-world2-text-sweep={activeLayer.id}
                  key={`world2-title-${world2State}-${activeDialogue}`}
                >
                  {isLockedMessage
                    ? (en ? "Step by step" : "Paso a paso")
                    : isReadyToContinue
                      ? ui.heading
                      : (expandedReadout?.title ?? activeCopy.title)}
                </p>
                {activeDialogue ? <p
                  className="world2-dialogue__copy"
                  data-world2-slot-id={
                    failure || !flow.storageVerified
                      ? undefined
                      : isReadyToContinue
                        ? "W2_COMPLETE_LIA_01"
                        : activeLayer.hintSlot
                  }
                  data-progress-save-error={
                    failure
                      ? "true"
                      : undefined
                  }
                  data-world2-text-sweep={activeLayer.id}
                  data-editorial-origin={
                    isReadyToContinue
                      ? world2ReadoutCopy.complete.origin
                      : activeLayer.id === "captura"
                        ? world2IntegrationCopy.captura.origin
                        : (expandedReadout?.origin ??
                          world2IntegrationCopy[activeLayer.id].origin)
                  }
                  data-editorial-source="editorial_excel"
                  data-editorial-status="REVIEW"
                  key={`world2-copy-${world2State}-${activeDialogue}`}
                >
                  {activeDialogue}
                </p> : null}

              </div>
              {!isReadyToContinue && activeHint && (!essentialVisualReady || activeLayerId === "resultado_mediado") ? (
                <p className="world2-dialogue__hint">{activeHint}</p>
              ) : null}
              <div className="world2-dialogue__actions">
                {!isReadyToContinue && activeLayerId === "resultado_mediado" && sonicConvergenceComplete ? (
                  <button className="world2-reading-assist" type="button" disabled={!activity.active || !resourcesReady}
                    onClick={() => playJourneySound("mediatedMusic")}>
                    {en ? "Listen to mediated music" : "Escuchar música mediada"}
                  </button>
                ) : null}
                {showConditioningCinema ? <button className="world2-reading-assist" type="button"
                  disabled={checkpointInputBlocked || !visible || !resourcesReady || filterDemo === "running"}
                  onClick={() => {
                    const label = filterLabelRef.current;
                    if (label) {
                      const bounds = label.getBoundingClientRect();
                      const viewportTop = window.visualViewport?.offsetTop ?? 0;
                      const viewportBottom = viewportTop + (window.visualViewport?.height ?? window.innerHeight);
                      if (bounds.top < viewportTop + 12 || bounds.bottom > viewportBottom - 12) {
                        label.scrollIntoView?.({ block: "center", inline: "nearest", behavior: "instant" });
                      }
                    }
                    setFilterDemo("running");
                    playJourneySound("conditioning");
                  }}>{en ? "View filtering" : "Ver filtrado"}</button> : null}
                {failure || !flow.storageVerified || [initialPreload.status, nextPreload.status].some((status) => status === "error" || status === "timeout") ? <button className="world2-action world2-action--continue" type="button" onClick={retryAction}>{ui.retry}</button>
                : !isReadyToContinue && !essentialVisualReady ? activeLayerId === "captura" ? <button className="world2-reading-assist" type="button" onClick={showResult} disabled={!activity.active || !resourcesReady || saving}>{ui.assist}</button> : null
                : !isReadyToContinue ? <button className="world2-reading-advance" type="button" disabled={!presentable || !advanceAssetsReady || saving || (!flow.readOnly && !flow.presentedStepIds.includes(stepByLayer[activeLayerId]))} onClick={() => { void advance(); }}>{activeLayerId === "resultado_mediado" ? ui.close : ui.advance}</button> : null}
                {flow.exitReady && activity.active ? <div className="world2-scene-exit"><InterstationQrGate originWorld={2} ready={flow.exitReady && resourcesReady && !failure && !saving} presentation="scene" persistCompletion={() => attemptRef.current === attemptId && isEssentialExitReady(2)} onCompleted={() => { if (attemptRef.current === attemptId && activeRef.current) navigate(worldTwoToWorldThreeTransitionRoute); }} /></div> : null}
              </div>
            </div>
          </div>
        </article>

        <nav
          className="world2-layer-nav world2-layer-nav--stable"
          aria-label={en ? "Room II layers" : "Capas de Sala II"}
          data-world2-zone="nav"
          data-world2-nav-mode="stable-visible-row"
        >
          <div className="world2-layer-nav__items" id="world2-layer-nav-items">
            {world2LayerDefinitions.map((layer, index) => {
              const status = getLayerStatus(layer.id);
              const isLocked = status === "locked";
              const copy = layerCopy[layer.id];
              const connectorSrc = layer.order < highestUnlockedLayerOrder ? world2RuntimeAssets.layerConnector : world2RuntimeAssets.layerNavConnectorInactive;
              return (
                <div className="world2-layer-nav__item" key={layer.id}>
                  <button
                    className={`world2-layer-button world2-layer-button--${status}`}
                    data-world2-layer={layer.id}
                    data-layer-id={layer.order}
                    data-layer-state={status}
                    data-layer-locked={isLocked}
                    type="button"
                    aria-pressed={status === "active"}
                    aria-disabled={
                      isLocked || checkpointInputBlocked
                    }
                    aria-label={`${ui.layer} ${layer.order} ${ui.of} ${world2LayerCount}. ${copy.accessibleLabel}. ${getStatusLabel(status)}.`}
                    aria-describedby={`world2-accessible-${layer.id}`}
                    onClick={() => selectLayer(layer.id)}
                  >
                    <img
                      className="world2-layer-button__token world2-layer-button__token--base"
                      src={world2RuntimeAssets.layerNavTokenBase}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={world2RuntimeAssets.layerNavTokenBase}
                      loading="lazy"
                    />
                    {status === "active" ? (
                      <img
                        className="world2-layer-button__token world2-layer-button__token--active"
                        src={world2RuntimeAssets.layerNavTokenActive}
                        alt=""
                        aria-hidden="true"
                        data-runtime-asset={
                          world2RuntimeAssets.layerNavTokenActive
                        }
                        loading="lazy"
                      />
                    ) : null}
                    <span
                      className="world2-layer-button__glyph"
                      aria-hidden="true"
                      data-runtime-asset={world2RuntimeAssets.layerGlyphAtlas}
                      style={getLayerGlyphStyle(index)}
                    />
                    <span className="world2-layer-button__order">
                      {layer.order}
                    </span>
                    <span className="world2-layer-button__label">
                      {copy.navLabel}
                    </span>
                    {isLocked ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--locked"
                        aria-hidden="true"
                      >
                        -
                      </span>
                    ) : null}
                    {status === "completed" ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--complete"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    ) : null}
                    {status === "next" ? (
                      <span
                        className="world2-layer-button__state-badge world2-layer-button__state-badge--next"
                        aria-hidden="true"
                      >
                        &gt;
                      </span>
                    ) : null}

                    <span
                      className="world2-root-sr-only"
                      id={`world2-accessible-${layer.id}`}
                      data-world2-slot-id={layer.accessibleSlot}
                      data-editorial-status="TEMP"
                    >
                      {`${copy.title}: ${copy.dialogue}`}
                    </span>
                  </button>
                  {index < world2LayerCount - 1 ? (
                    <img
                      className="world2-layer-nav__connector"
                      src={connectorSrc}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={connectorSrc}
                      loading="lazy"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>
      </section>
    </main>
  );
}
