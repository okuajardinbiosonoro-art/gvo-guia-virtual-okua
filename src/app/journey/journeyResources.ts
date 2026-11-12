import { transitionRootAssetUrlsById } from "../../assets/transition-world/root/transition-root-assets";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import { finalRootAssets } from "../../shared/assets/finalRootAssets";
import { getWorld3CriticalAssetSources } from "../../screens/World3Root/world3RuntimeAssets";
import { world4RuntimeAssets } from "../../screens/World4Root/world4RuntimeAssets";
import { world4OrderingObjectAssets } from "../../screens/World4Root/world4OrderingContent";
import { getWorld5CriticalAssetSources } from "../../screens/World5Root/world5RuntimeAssets";
import { readWorld5Rounds } from "../../screens/World5Root/world5Quiz";
import { resolveWorld5QuizView, type World5QuizView } from "../../screens/World5Root/world5QuizView";
import { getWorld1CriticalAssetSources } from "../../screens/World1Root/world1RootAssets";
import { getWorld2CriticalAssetSources } from "../../screens/World2Root/world2RuntimeAssets";
import { readEssentialSnapshot, ESSENTIAL_CONTENT_REVISION, canUseUiStep } from "./journeyEssential";
import { screenForRoute, resolveJourneyAccess } from "./journeyAccess";
import { liaJourneyMotionAssets } from "../../components/LiaJourneyMotion/LiaJourneyMotion";
import { entryCoverBackdropAsset, entryCoverStationAssets } from "../../shared/assets/entryCoverAssets";
import { gestureHintAssets } from "../../components/GestureHint/gestureHintAssets";
export type JourneyResourceManifest = { contextKey: string; images: string[]; route: string };
function paths(value: unknown): string[] {
  if (typeof value === "string") return value.startsWith("/assets/") ? [value] : [];
  return value && typeof value === "object" ? Object.values(value).flatMap(paths) : [];
}
export function getWorld5ResourceView(route: string): World5QuizView {
  const context = resolveJourneyAccess(route, typeof window === "undefined" ? null : window.history.state?.usr);
  return resolveWorld5QuizView({ pathname: route, read: readWorld5Rounds(), readOnly: context.mode !== "normal", pendingStepId: readEssentialSnapshot()?.stations[5].activeStepId ?? null, canUseStep: id => canUseUiStep(5, id, context) });
}
export function getJourneyResourceManifest({ route, locale, orientation, restoredState, quizView, contentRevision = ESSENTIAL_CONTENT_REVISION }: { route: string; locale: string; orientation: string; restoredState?: unknown; quizView?: World5QuizView; contentRevision?: string }): JourneyResourceManifest {
  route = route === "/" ? route : route.replace(/\/+$/, "");
  const screen = screenForRoute(route), s = readEssentialSnapshot();
  let images: string[];
  let world5View: World5QuizView | undefined;
  if (route === "/inicio") images = [entryCoverBackdropAsset, ...entryCoverStationAssets.map((asset) => asset.src)];
  // Both the v03 rig and the still-rendered portal activation pose are real
  // consumers. Path-wide /lia/ filtering would silently drop the latter.
  else if (screen === "cover") images = [...screenAssetBundles.coverIntroCritical.assets, ...screenAssetBundles.coverIntroActivation.assets].map((a) => a.src);
  else if (screen === 1) {
    const step = s?.stations[1].activeStepId;
    const concept = step === "relacion" ? "relation" : step === "percepcion" ? "perception" : step === "mediacion" ? "mediation" : "intro";
    images = getWorld1CriticalAssetSources(concept);
  } else if (screen === 2) {
    const step = s?.stations[2].activeStepId;
    images = getWorld2CriticalAssetSources(step === "planta" || !step ? "planta_viva" : step === "musica" ? "resultado_mediado" : step as "senal");
  } else if (screen === 3) {
    const room = s?.stations[3];
    const pageByStep = { INTRO: "planta", "PASO A PASO": "prototipo", BENEFICIOS: "senal" } as const;
    const page = room && room.confirmedStepIds.length > 0 && !room.closed ? pageByStep[room.activeStepId as keyof typeof pageByStep] ?? null : null;
    images = getWorld3CriticalAssetSources(page);
  }
  else if (screen === 4) images = [world4RuntimeAssets.environment.portraitTable, ...Object.values(world4OrderingObjectAssets)];
  else if (screen === 5) {
    world5View = quizView ?? getWorld5ResourceView(route);
    images = getWorld5CriticalAssetSources(world5View, orientation as "portrait" | "landscape");
  }
  else if (screen === "final") images = paths(finalRootAssets).filter((path) => !path.includes(orientation === "portrait" ? "landscape" : "portrait"));
  else images = screenAssetBundles.loadingInitialCritical.assets.map((a) => a.src);
  // Asset identity follows the rendered quiz view, not its score revision.
  // Saving an answer must not deactivate its own still-visible question.
  const normalized = screen === 5 ? world5View : restoredState ?? (typeof screen === "number" ? s?.stations[screen].activeStepId : screen === "cover" ? s?.cover.activeStepId : null);
  if (screen === 1 || screen === 2 || screen === 4 || screen === 5 || screen === "cover") images.push(...liaJourneyMotionAssets);
  if (screen === 1 || screen === 3) images.push(gestureHintAssets["swipe-vertical"]);
  if (screen === 2) images.push(...Object.values(gestureHintAssets));
  return { route, images: [...new Set(images)], contextKey: JSON.stringify({ route, locale, orientation, normalized, contentRevision, assetRevision: "OBS03.2-v03" }) };
}

/** Entry-only immutable source inventory: loading first, one deduplicated worker queue. */
export function getEntryResourceManifest() {
  const progress = ["transition_root_progress_track_base", "transition_root_progress_fill_segment", "transition_root_progress_spark"].map((id) => transitionRootAssetUrlsById[id].urls.webp);
  const own = [...new Set([...screenAssetBundles.loadingInitialCritical.assets.map((a) => a.src), ...progress])];
  const cover = [...screenAssetBundles.coverIntroCritical.assets, ...screenAssetBundles.coverIntroActivation.assets].map((a) => a.src);
  const transition = getTransitionResourceSources();
  const all = [...new Set([...own, ...cover, entryCoverBackdropAsset, ...entryCoverStationAssets.map((a) => a.src), ...transition])];
  return { revision: "OBS04-entry-1", own, cover: [...new Set(cover)], all, key: JSON.stringify(["OBS04-entry-1", all]) };
}

export function getTransitionResourceSources() {
  return [...new Set(screenAssetBundles.transitionRootCritical.assets.map((a) => a.id === "transition_progress_spark_png" ? transitionRootAssetUrlsById.transition_root_progress_spark.urls.webp : a.src))];
}
