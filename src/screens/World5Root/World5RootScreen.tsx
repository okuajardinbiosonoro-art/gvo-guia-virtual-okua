import "./World5RootScreen.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { worldFiveEntryRoute, worldFivePlantsRoute } from "../../app/routes";
import {
  station5Areas,
  station5ContentApprovalStatus,
  station5Header,
  station5PlantsCopy,
  type Station5AreaId,
} from "./station5Content";
import {
  completeWorld5Area,
  readWorld5Progress,
  type World5Progress,
} from "./world5Progress";
import { world5RuntimeAssets } from "./world5RuntimeAssets";

export type Station5RuntimeState =
  | "map_stable"
  | "camera_entering_plantas"
  | "substation_plantas_intro"
  | "substation_plantas_interactive"
  | "substation_plantas_resolved"
  | "substation_plantas_storage_error"
  | "camera_returning_to_map"
  | "map_plantas_completed";

type AreaVisualState = "locked" | "available" | "selected" | "completed";

const ENTER_DURATION_MS = 1060;
const RETURN_DURATION_MS = 820;
const REDUCED_DURATION_MS = 140;

const sectorAssets: Record<Station5AreaId, string> = {
  plantas: world5RuntimeAssets.mapSectorPlants,
  sistema: world5RuntimeAssets.mapSectorSystem,
  espacio: world5RuntimeAssets.mapSectorSpace,
  visitante: world5RuntimeAssets.mapSectorVisitor,
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function hasCompletedPlants(progress: World5Progress) {
  return progress.completedAreas.includes("plantas");
}

function initialState(pathname: string, progress: World5Progress): Station5RuntimeState {
  if (pathname === worldFivePlantsRoute) {
    return hasCompletedPlants(progress)
      ? "substation_plantas_resolved"
      : "substation_plantas_intro";
  }
  return hasCompletedPlants(progress) ? "map_plantas_completed" : "map_stable";
}

function isMapState(state: Station5RuntimeState) {
  return state === "map_stable" || state === "map_plantas_completed";
}

function isMotionState(state: Station5RuntimeState) {
  return state === "camera_entering_plantas" || state === "camera_returning_to_map";
}

export function World5RootScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const initialProgressRef = useRef(readWorld5Progress());
  const [progress, setProgress] = useState(initialProgressRef.current);
  const [state, setState] = useState<Station5RuntimeState>(() =>
    initialState(location.pathname, initialProgressRef.current),
  );
  const [announcement, setAnnouncement] = useState("");
  const epochRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const plantsButtonRef = useRef<HTMLButtonElement>(null);
  const plantsFocusRef = useRef<HTMLDivElement>(null);
  const plantsHeadingRef = useRef<HTMLHeadingElement>(null);
  const lastPathnameRef = useRef(location.pathname);

  const plantsCompleted = hasCompletedPlants(progress);
  const mapActive = isMapState(state);
  const plantsActive = !mapActive;
  const motionLock = isMotionState(state);
  const renderMapAssets = mapActive || motionLock;
  const renderPlantsAssets = plantsActive;

  const clearTimeline = useCallback(() => {
    epochRef.current += 1;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimeline, [clearTimeline]);

  useEffect(() => {
    if (lastPathnameRef.current === location.pathname) return;
    lastPathnameRef.current = location.pathname;
    if (location.pathname === worldFiveEntryRoute && !isMapState(state)) {
      clearTimeline();
      setState(plantsCompleted ? "map_plantas_completed" : "map_stable");
      setAnnouncement("");
    }
  }, [clearTimeline, location.pathname, plantsCompleted, state]);

  useEffect(() => {
    if (state !== "substation_plantas_intro") return;
    plantsHeadingRef.current?.focus({ preventScroll: true });
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      setState(plantsCompleted ? "substation_plantas_resolved" : "substation_plantas_interactive");
      timerRef.current = null;
    }, reducedMotion ? REDUCED_DURATION_MS : 180);
  }, [plantsCompleted, reducedMotion, state]);

  const areaState = useCallback(
    (area: Station5AreaId): AreaVisualState => {
      if (area === "plantas") {
        if (plantsCompleted) return "completed";
        return mapActive ? "available" : "selected";
      }
      if (area === "sistema" && plantsCompleted) return "available";
      return "locked";
    },
    [mapActive, plantsCompleted],
  );

  const setFlipVariables = useCallback(() => {
    const source = plantsButtonRef.current?.getBoundingClientRect();
    const target = plantsFocusRef.current?.getBoundingClientRect();
    if (!source || !target || source.width === 0 || target.width === 0) return;

    const sourceX = source.left + source.width * 0.64;
    const sourceY = source.top + source.height * 0.37;
    const targetX = target.left + target.width * 0.5;
    const targetY = target.top + target.height * 0.34;
    const scale = target.width / Math.max(source.width * 0.28, 1);
    const root = rootRef.current;
    root?.style.setProperty("--s5-flip-x", `${targetX - sourceX}px`);
    root?.style.setProperty("--s5-flip-y", `${targetY - sourceY}px`);
    root?.style.setProperty("--s5-flip-scale", String(Math.min(scale, 4.8)));
    root?.setAttribute("data-anchor-drift-px", "0");
  }, []);

  const enterPlants = useCallback(() => {
    if (!isMapState(state) || motionLock) return;
    clearTimeline();
    setFlipVariables();
    setAnnouncement("");
    setState("camera_entering_plantas");
    navigate(worldFivePlantsRoute, { replace: true });
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      setState("substation_plantas_intro");
      timerRef.current = null;
    }, reducedMotion ? REDUCED_DURATION_MS : ENTER_DURATION_MS);
  }, [clearTimeline, motionLock, navigate, reducedMotion, setFlipVariables, state]);

  const returnToMapImmediately = useCallback(() => {
    clearTimeline();
    navigate(worldFiveEntryRoute, { replace: true });
    setState(plantsCompleted ? "map_plantas_completed" : "map_stable");
    setAnnouncement("");
    window.requestAnimationFrame(() =>
      plantsButtonRef.current?.focus({ preventScroll: true }),
    );
  }, [clearTimeline, navigate, plantsCompleted]);

  const handleBack = useCallback(() => {
    if (state === "camera_returning_to_map") return;
    returnToMapImmediately();
  }, [returnToMapImmediately, state]);

  const activateLeaf = useCallback(() => {
    if (state !== "substation_plantas_interactive") return;
    const result = completeWorld5Area("plantas");
    if (!result.ok) {
      setState("substation_plantas_storage_error");
      setAnnouncement(station5PlantsCopy.storageError);
      return;
    }
    setProgress(result.progress);
    setState("substation_plantas_resolved");
    setAnnouncement(station5PlantsCopy.resolvedStatus);
  }, [state]);

  const retryStorage = useCallback(() => {
    if (state !== "substation_plantas_storage_error") return;
    setState("substation_plantas_interactive");
    setAnnouncement("");
  }, [state]);

  const returnToMap = useCallback(() => {
    if (state !== "substation_plantas_resolved" || !plantsCompleted) return;
    clearTimeline();
    setFlipVariables();
    setState("camera_returning_to_map");
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      navigate(worldFiveEntryRoute, { replace: true });
      setState("map_plantas_completed");
      setAnnouncement("Plantas completada. Sistema es la siguiente área.");
      timerRef.current = null;
      window.requestAnimationFrame(() =>
        plantsButtonRef.current?.focus({ preventScroll: true }),
      );
    }, reducedMotion ? REDUCED_DURATION_MS : RETURN_DURATION_MS);
  }, [clearTimeline, navigate, plantsCompleted, reducedMotion, setFlipVariables, state]);

  const statusText = useMemo(() => {
    if (state === "substation_plantas_storage_error") return station5PlantsCopy.storageError;
    if (state === "substation_plantas_resolved") return station5PlantsCopy.resolvedStatus;
    if (state === "map_plantas_completed") return "Plantas completada. Sistema es la siguiente área.";
    return "Plantas abre el recorrido.";
  }, [state]);

  return (
    <main
      ref={rootRef}
      className="s5-screen"
      data-station5-state={state}
      data-motion-lock={motionLock ? "true" : "false"}
      data-station5-reduced-motion={reducedMotion ? "true" : "false"}
      data-copy-approval={station5ContentApprovalStatus}
      data-next-area={plantsCompleted ? "sistema" : "plantas"}
      data-sensitive-permissions="blocked"
      data-qr-camera="blocked"
      aria-labelledby="station5-title"
    >
      <header className="s5-header">
        <p>{station5Header.eyebrow}</p>
        <h1 id="station5-title">{station5Header.title}</h1>
      </header>

      <div className="s5-layout">
        <section className="s5-stage" aria-label="Mapa del presente y subestación Plantas">
          <div
            className="s5-map-scene"
            data-station5-scene="map"
            aria-hidden={!mapActive}
            inert={!mapActive ? true : undefined}
          >
            <picture className="s5-environment">
              <source media="(orientation: landscape)" srcSet={renderMapAssets ? world5RuntimeAssets.mapEnvironmentLandscape : undefined} />
              <img src={renderMapAssets ? world5RuntimeAssets.mapEnvironmentPortrait : undefined} alt="" data-runtime-asset={renderMapAssets ? world5RuntimeAssets.mapEnvironmentPortrait : undefined} />
            </picture>

            <div className="s5-map" data-map-complete="true">
              {station5Areas.map((area) => {
                const visualState = areaState(area.id);
                const disabled = area.id !== "plantas" || motionLock;
                return (
                  <button
                    key={area.id}
                    ref={area.id === "plantas" ? plantsButtonRef : undefined}
                    type="button"
                    className={`s5-sector s5-sector--${area.id}`}
                    data-station5-area={area.id}
                    data-area-state={visualState}
                    data-anchor-id={area.id === "plantas" ? "A_PLANT_LEAF" : undefined}
                    aria-label={`${area.accessibleLabel}. ${visualState === "completed" ? "Completada" : visualState === "available" ? "Disponible" : "Bloqueada"}.`}
                    disabled={disabled}
                    onClick={area.id === "plantas" ? enterPlants : undefined}
                  >
                    <img src={renderMapAssets ? sectorAssets[area.id] : undefined} alt="" draggable="false" data-runtime-asset={renderMapAssets ? sectorAssets[area.id] : undefined} />
                    <span className="s5-sector__label">{area.title}</span>
                    <span className="s5-sector__status" aria-hidden="true">
                      {visualState === "completed" ? "✓" : visualState === "locked" ? "🔒" : "●"}
                    </span>
                  </button>
                );
              })}
              <span className="s5-map__nexus" aria-hidden="true" />
              <svg className="s5-map__links" viewBox="0 0 100 100" aria-hidden="true">
                <path d="M28 28 Q42 44 50 50 M72 28 Q58 44 50 50 M28 72 Q42 56 50 50 M72 72 Q58 56 50 50" />
              </svg>
            </div>

            <picture className="s5-rim" aria-hidden="true">
              <source media="(orientation: landscape)" srcSet={renderMapAssets ? world5RuntimeAssets.mapRimLandscape : undefined} />
              <img src={renderMapAssets ? world5RuntimeAssets.mapRimPortrait : undefined} alt="" data-runtime-asset={renderMapAssets ? world5RuntimeAssets.mapRimPortrait : undefined} />
            </picture>
            <span className="s5-threshold-occluder" aria-hidden="true" />
          </div>

          <div
            className="s5-plants-scene"
            data-station5-scene="plantas"
            aria-hidden={!plantsActive}
            inert={!plantsActive ? true : undefined}
          >
            <picture className="s5-plants-environment">
              <source media="(orientation: landscape)" srcSet={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentLandscape : undefined} />
              <img src={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentPortrait : undefined} alt="" data-runtime-asset={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentPortrait : undefined} />
            </picture>
            <button className="s5-back" type="button" onClick={handleBack} disabled={state === "camera_returning_to_map"}>
              ← Mapa
            </button>
            <div ref={plantsFocusRef} className="s5-plants-focus" data-anchor-id="A_PLANT_LEAF">
              <img src={renderPlantsAssets ? world5RuntimeAssets.plantsFocus : undefined} alt="" draggable="false" data-runtime-asset={renderPlantsAssets ? world5RuntimeAssets.plantsFocus : undefined} />
              <button
                className="s5-leaf-control"
                type="button"
                aria-label={station5PlantsCopy.leafAccessibleLabel}
                disabled={state !== "substation_plantas_interactive"}
                onClick={activateLeaf}
              />
              <svg className="s5-vital-pulse" viewBox="0 0 100 160" aria-hidden="true">
                <path d="M58 22 C54 42 52 58 50 78 C49 99 55 117 47 138 C39 145 31 150 20 154" pathLength={1} />
              </svg>
              <span className="s5-resolved-check" aria-hidden="true">✓</span>
            </div>
            <div className="s5-lia-envelope" data-lia-gate="pending" aria-hidden="true" />
          </div>
        </section>

        <section className="s5-rail" aria-label="Información de Estación V">
          {mapActive ? (
            <div className="s5-map-copy">
              <p className="s5-kicker">Mapa estable</p>
              <h2>Plantas</h2>
              <p>{station5PlantsCopy.intro}</p>
              <p>{station5PlantsCopy.description}</p>
              <p className="s5-status-copy">{statusText}</p>
              {plantsCompleted ? <p className="s5-next-area">Sistema · siguiente área, aún no disponible en este vertical slice.</p> : null}
            </div>
          ) : (
            <div className="s5-plants-copy">
              <p className="s5-kicker">Plantas</p>
              <h2 ref={plantsHeadingRef} tabIndex={-1}>Las plantas abren el recorrido.</h2>
              <p>{station5PlantsCopy.description}</p>
              <p>{state === "substation_plantas_resolved" ? station5PlantsCopy.resolvedDescription : station5PlantsCopy.instruction}</p>
              <p className="s5-status-copy">{statusText}</p>
              {state === "substation_plantas_storage_error" ? (
                <button type="button" className="s5-secondary-action" onClick={retryStorage}>{station5PlantsCopy.retryLabel}</button>
              ) : null}
              <button
                type="button"
                className="s5-return"
                disabled={state !== "substation_plantas_resolved" || !plantsCompleted}
                onClick={returnToMap}
              >
                {station5PlantsCopy.returnLabel}
              </button>
            </div>
          )}
        </section>
      </div>

      <p className="s5-sr-only" role="status" aria-live="polite">{announcement}</p>
    </main>
  );
}
