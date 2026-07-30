import "./World5RootScreen.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  worldFiveEntryRoute,
  worldFivePlantsRoute,
  worldFiveSpaceRoute,
  worldFiveSystemRoute,
  worldFiveVisitorRoute,
} from "../../app/routes";
import {
  station5Areas,
  station5ContentApprovalStatus,
  station5Header,
  station5PlantsCopy,
  station5SystemCopy,
  type Station5AreaId,
} from "./station5Content";
import {
  completeWorld5Area,
  readWorld5Progress,
  type World5Progress,
} from "./world5Progress";
import { world5RuntimeAssets } from "./world5RuntimeAssets";

type TraversableArea = "plantas" | "sistema";
type AreaVisualState = "locked" | "available" | "selected" | "completed";

export type Station5RuntimeState =
  | "map_stable"
  | "map_plantas_completed"
  | "map_sistema_completed"
  | `camera_entering_${TraversableArea}`
  | `substation_${TraversableArea}_intro`
  | `substation_${TraversableArea}_interactive`
  | `substation_${TraversableArea}_resolved`
  | `substation_${TraversableArea}_storage_error`
  | `camera_returning_${TraversableArea}`;

type LiaRole = "explain" | "attend" | "lead" | "greeting";

const ENTER_DURATION_MS = 1060;
const RETURN_DURATION_MS = 820;
const REDUCED_DURATION_MS = 140;

const sectorAssets: Record<Station5AreaId, string> = {
  plantas: world5RuntimeAssets.mapSectorPlants,
  sistema: world5RuntimeAssets.mapSectorSystem,
  espacio: world5RuntimeAssets.mapSectorSpace,
  visitante: world5RuntimeAssets.mapSectorVisitor,
};

const areaRoutes: Record<TraversableArea, string> = {
  plantas: worldFivePlantsRoute,
  sistema: worldFiveSystemRoute,
};

const protectedRoutes = new Set([worldFiveSpaceRoute, worldFiveVisitorRoute]);

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

function completed(progress: World5Progress, area: TraversableArea) {
  return progress.completedAreas.includes(area);
}

function mapState(progress: World5Progress): Station5RuntimeState {
  if (completed(progress, "sistema")) return "map_sistema_completed";
  if (completed(progress, "plantas")) return "map_plantas_completed";
  return "map_stable";
}

function routeArea(pathname: string): TraversableArea | null {
  if (pathname === worldFivePlantsRoute) return "plantas";
  if (pathname === worldFiveSystemRoute) return "sistema";
  return null;
}

function initialState(pathname: string, progress: World5Progress): Station5RuntimeState {
  const area = routeArea(pathname);
  if (!area || (area === "sistema" && !completed(progress, "plantas"))) {
    return mapState(progress);
  }
  return completed(progress, area)
    ? `substation_${area}_resolved`
    : `substation_${area}_intro`;
}

function isMapState(state: Station5RuntimeState) {
  return state.startsWith("map_");
}

function isMotionState(state: Station5RuntimeState) {
  return state.startsWith("camera_");
}

function stateArea(state: Station5RuntimeState): TraversableArea | null {
  if (isMapState(state)) return null;
  if (state.endsWith("_plantas") || state.includes("_plantas_")) return "plantas";
  if (state.endsWith("_sistema") || state.includes("_sistema_")) return "sistema";
  return null;
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
  const systemButtonRef = useRef<HTMLButtonElement>(null);
  const plantsFocusRef = useRef<HTMLDivElement>(null);
  const systemFocusRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastPathnameRef = useRef(location.pathname);

  const plantsCompleted = completed(progress, "plantas");
  const systemCompleted = completed(progress, "sistema");
  const mapActive = isMapState(state);
  const motionLock = isMotionState(state);
  const activeArea = stateArea(state);
  const plantsActive = activeArea === "plantas";
  const systemActive = activeArea === "sistema";
  const renderMapAssets = mapActive || motionLock;
  const renderPlantsAssets = plantsActive;
  const renderSystemAssets = systemActive;

  const clearTimeline = useCallback(() => {
    epochRef.current += 1;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimeline, [clearTimeline]);

  useEffect(() => {
    const requestedArea = routeArea(location.pathname);
    const blockedSystem = requestedArea === "sistema" && !plantsCompleted;
    if (protectedRoutes.has(location.pathname) || blockedSystem) {
      lastPathnameRef.current = location.pathname;
      clearTimeline();
      navigate(worldFiveEntryRoute, { replace: true });
      setState(mapState(progress));
      setAnnouncement(requestedArea === "sistema" ? "Completa Plantas para habilitar Sistema." : "La ruta todavía está protegida.");
      return;
    }
    if (lastPathnameRef.current === location.pathname) return;
    lastPathnameRef.current = location.pathname;
    if (location.pathname === worldFiveEntryRoute && !mapActive) {
      clearTimeline();
      setState(mapState(progress));
      setAnnouncement("");
    }
  }, [clearTimeline, location.pathname, mapActive, navigate, plantsCompleted, progress]);

  useEffect(() => {
    if (!state.endsWith("_intro") || !activeArea) return;
    headingRef.current?.focus({ preventScroll: true });
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      setState(
        completed(progress, activeArea)
          ? `substation_${activeArea}_resolved`
          : `substation_${activeArea}_interactive`,
      );
      timerRef.current = null;
    }, reducedMotion ? REDUCED_DURATION_MS : 180);
  }, [activeArea, progress, reducedMotion, state]);

  useEffect(() => {
    if (!plantsCompleted || systemCompleted || !mapActive) return;
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    [
      portrait
        ? world5RuntimeAssets.systemEnvironmentPortrait
        : world5RuntimeAssets.systemEnvironmentLandscape,
      world5RuntimeAssets.systemFocus,
    ].forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [mapActive, plantsCompleted, systemCompleted]);

  const areaState = useCallback(
    (area: Station5AreaId): AreaVisualState => {
      if (area === "plantas") {
        if (plantsCompleted) return "completed";
        return activeArea === area ? "selected" : "available";
      }
      if (area === "sistema") {
        if (systemCompleted) return "completed";
        if (!plantsCompleted) return "locked";
        return activeArea === area ? "selected" : "available";
      }
      if (area === "espacio" && systemCompleted) return "available";
      return "locked";
    },
    [activeArea, plantsCompleted, systemCompleted],
  );

  const setFlipVariables = useCallback((area: TraversableArea) => {
    const source = (area === "plantas" ? plantsButtonRef : systemButtonRef).current?.getBoundingClientRect();
    const target = (area === "plantas" ? plantsFocusRef : systemFocusRef).current?.getBoundingClientRect();
    if (!source || !target || source.width === 0 || target.width === 0) return;
    const sourceAnchor = area === "plantas" ? [0.64, 0.37] : [0.56, 0.51];
    const targetAnchor = area === "plantas" ? [0.5, 0.34] : [0.5, 0.4];
    const sourceX = source.left + source.width * sourceAnchor[0];
    const sourceY = source.top + source.height * sourceAnchor[1];
    const targetX = target.left + target.width * targetAnchor[0];
    const targetY = target.top + target.height * targetAnchor[1];
    const scale = target.width / Math.max(source.width * 0.32, 1);
    rootRef.current?.style.setProperty("--s5-flip-x", `${targetX - sourceX}px`);
    rootRef.current?.style.setProperty("--s5-flip-y", `${targetY - sourceY}px`);
    rootRef.current?.style.setProperty("--s5-flip-scale", String(Math.min(scale, 4.8)));
    rootRef.current?.setAttribute("data-anchor-drift-px", "0");
  }, []);

  const enterArea = useCallback((area: TraversableArea) => {
    const allowed = area === "plantas" || plantsCompleted;
    if (!mapActive || motionLock || !allowed) return;
    clearTimeline();
    setFlipVariables(area);
    setAnnouncement("");
    setState(`camera_entering_${area}`);
    navigate(areaRoutes[area], { replace: true });
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      setState(`substation_${area}_intro`);
      timerRef.current = null;
    }, reducedMotion ? REDUCED_DURATION_MS : ENTER_DURATION_MS);
  }, [clearTimeline, mapActive, motionLock, navigate, plantsCompleted, reducedMotion, setFlipVariables]);

  const returnToMapImmediately = useCallback(() => {
    const focusArea = activeArea;
    clearTimeline();
    navigate(worldFiveEntryRoute, { replace: true });
    setState(mapState(progress));
    setAnnouncement("");
    window.requestAnimationFrame(() =>
      (focusArea === "sistema" ? systemButtonRef : plantsButtonRef).current?.focus({ preventScroll: true }),
    );
  }, [activeArea, clearTimeline, navigate, progress]);

  const activateArea = useCallback(() => {
    if (!activeArea || state !== `substation_${activeArea}_interactive`) return;
    const result = completeWorld5Area(activeArea);
    if (!result.ok) {
      setState(`substation_${activeArea}_storage_error`);
      setAnnouncement(activeArea === "sistema" ? station5SystemCopy.storageError : station5PlantsCopy.storageError);
      return;
    }
    setProgress(result.progress);
    setState(`substation_${activeArea}_resolved`);
    setAnnouncement(activeArea === "sistema" ? station5SystemCopy.resolvedStatus : station5PlantsCopy.resolvedStatus);
  }, [activeArea, state]);

  const retryStorage = useCallback(() => {
    if (!activeArea || state !== `substation_${activeArea}_storage_error`) return;
    setState(`substation_${activeArea}_interactive`);
    setAnnouncement("");
  }, [activeArea, state]);

  const returnToMap = useCallback(() => {
    if (!activeArea || state !== `substation_${activeArea}_resolved` || !completed(progress, activeArea)) return;
    clearTimeline();
    setFlipVariables(activeArea);
    setState(`camera_returning_${activeArea}`);
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(() => {
      if (epochRef.current !== epoch) return;
      navigate(worldFiveEntryRoute, { replace: true });
      setState(mapState(progress));
      setAnnouncement(activeArea === "sistema" ? "Sistema completada. Espacio es la siguiente área protegida." : "Plantas completada. Sistema es la siguiente área.");
      timerRef.current = null;
      window.requestAnimationFrame(() =>
        (activeArea === "sistema" ? systemButtonRef : plantsButtonRef).current?.focus({ preventScroll: true }),
      );
    }, reducedMotion ? REDUCED_DURATION_MS : RETURN_DURATION_MS);
  }, [activeArea, clearTimeline, navigate, progress, reducedMotion, setFlipVariables, state]);

  const liaRole: LiaRole = useMemo(() => {
    if (motionLock) return "lead";
    if (state.endsWith("_resolved")) return "greeting";
    if (state.endsWith("_interactive") || mapActive && (plantsCompleted || systemCompleted)) return "attend";
    return "explain";
  }, [mapActive, motionLock, plantsCompleted, state, systemCompleted]);

  const liaAsset = {
    explain: world5RuntimeAssets.liaExplainCalm,
    attend: world5RuntimeAssets.liaAttendNeutral,
    lead: world5RuntimeAssets.liaLeadForward,
    greeting: world5RuntimeAssets.liaGreeting,
  }[liaRole];

  const statusText = useMemo(() => {
    if (state.endsWith("_storage_error")) return activeArea === "sistema" ? station5SystemCopy.storageError : station5PlantsCopy.storageError;
    if (state === "substation_sistema_resolved") return station5SystemCopy.resolvedStatus;
    if (state === "substation_plantas_resolved") return station5PlantsCopy.resolvedStatus;
    if (systemCompleted) return "Plantas y Sistema completadas. Espacio es la siguiente área protegida.";
    if (plantsCompleted) return "Plantas completada. Sistema es la siguiente área.";
    return "Plantas abre el recorrido.";
  }, [activeArea, plantsCompleted, state, systemCompleted]);

  return (
    <main
      ref={rootRef}
      className="s5-screen"
      data-station5-state={state}
      data-active-area={activeArea ?? "map"}
      data-motion-lock={motionLock ? "true" : "false"}
      data-station5-reduced-motion={reducedMotion ? "true" : "false"}
      data-copy-approval={station5ContentApprovalStatus}
      data-next-area={systemCompleted ? "espacio" : plantsCompleted ? "sistema" : "plantas"}
      data-station-complete="false"
      aria-labelledby="station5-title"
    >
      <header className="s5-header">
        <p>{station5Header.eyebrow}</p>
        <h1 id="station5-title">{station5Header.title}</h1>
      </header>

      <div className="s5-layout">
        <section className="s5-stage" aria-label="Mapa del presente y subestaciones Plantas y Sistema">
          <div className="s5-map-scene" data-station5-scene="map" aria-hidden={!mapActive} inert={!mapActive ? true : undefined}>
            <picture className="s5-environment">
              <source media="(orientation: landscape)" srcSet={renderMapAssets ? world5RuntimeAssets.mapEnvironmentLandscape : undefined} />
              <img src={renderMapAssets ? world5RuntimeAssets.mapEnvironmentPortrait : undefined} alt="" data-runtime-asset={renderMapAssets ? world5RuntimeAssets.mapEnvironmentPortrait : undefined} />
            </picture>
            <div className="s5-map" data-map-complete="false">
              {station5Areas.map((area) => {
                const visualState = areaState(area.id);
                const traversable = area.id === "plantas" || area.id === "sistema";
                const protectedArea = area.id === "espacio" || area.id === "visitante";
                const disabled = motionLock || !traversable || area.id === "sistema" && !plantsCompleted;
                return (
                  <button
                    key={area.id}
                    ref={area.id === "plantas" ? plantsButtonRef : area.id === "sistema" ? systemButtonRef : undefined}
                    type="button"
                    className={`s5-sector s5-sector--${area.id}`}
                    data-station5-area={area.id}
                    data-area-state={visualState}
                    data-protected={protectedArea ? "true" : "false"}
                    data-anchor-id={area.id === "plantas" ? "A_PLANT_LEAF" : area.id === "sistema" ? "A_SYSTEM_CONNECTOR" : undefined}
                    aria-label={`${area.accessibleLabel}. ${visualState === "completed" ? "Completada" : visualState === "available" ? protectedArea ? "Siguiente área protegida" : "Disponible" : "Bloqueada"}.`}
                    disabled={disabled}
                    onClick={area.id === "plantas" ? () => enterArea("plantas") : area.id === "sistema" ? () => enterArea("sistema") : undefined}
                  >
                    <img src={renderMapAssets ? sectorAssets[area.id] : undefined} alt="" draggable="false" data-runtime-asset={renderMapAssets ? sectorAssets[area.id] : undefined} />
                    <span className="s5-sector__label">{area.title}</span>
                    <span className="s5-sector__status" aria-hidden="true">{visualState === "completed" ? "✓" : visualState === "locked" ? "🔒" : "●"}</span>
                  </button>
                );
              })}
              <span className="s5-map__nexus" aria-hidden="true" />
              <svg className="s5-map__links" viewBox="0 0 100 100" aria-hidden="true">
                <path data-link-area="plantas" data-active={plantsCompleted} d="M28 28 Q42 44 50 50" />
                <path data-link-area="sistema" data-active={systemCompleted} d="M72 28 Q58 44 50 50" />
                <path d="M28 72 Q42 56 50 50 M72 72 Q58 56 50 50" />
              </svg>
            </div>
            <picture className="s5-rim" aria-hidden="true">
              <source media="(orientation: landscape)" srcSet={renderMapAssets ? world5RuntimeAssets.mapRimLandscape : undefined} />
              <img src={renderMapAssets ? world5RuntimeAssets.mapRimPortrait : undefined} alt="" data-runtime-asset={renderMapAssets ? world5RuntimeAssets.mapRimPortrait : undefined} />
            </picture>
            <span className="s5-threshold-occluder" aria-hidden="true" />
          </div>

          <div className="s5-plants-scene" data-station5-scene="plantas" aria-hidden={!plantsActive} inert={!plantsActive ? true : undefined}>
            <picture className="s5-sub-environment">
              <source media="(orientation: landscape)" srcSet={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentLandscape : undefined} />
              <img src={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentPortrait : undefined} alt="" data-runtime-asset={renderPlantsAssets ? world5RuntimeAssets.plantsEnvironmentPortrait : undefined} />
            </picture>
            <button className="s5-back" type="button" onClick={returnToMapImmediately} disabled={state.startsWith("camera_returning")}>← Mapa</button>
            <div ref={plantsFocusRef} className="s5-plants-focus" data-anchor-id="A_PLANT_LEAF">
              <img src={renderPlantsAssets ? world5RuntimeAssets.plantsFocus : undefined} alt="" draggable="false" data-runtime-asset={renderPlantsAssets ? world5RuntimeAssets.plantsFocus : undefined} />
              <button className="s5-leaf-control" type="button" aria-label={station5PlantsCopy.leafAccessibleLabel} disabled={state !== "substation_plantas_interactive"} onClick={activateArea} />
              <svg className="s5-vital-pulse" viewBox="0 0 100 160" aria-hidden="true"><path d="M58 22 C54 42 52 58 50 78 C49 99 55 117 47 138 C39 145 31 150 20 154" pathLength={1} /></svg>
              <span className="s5-resolved-check" aria-hidden="true">✓</span>
            </div>
          </div>

          <div className="s5-system-scene" data-station5-scene="sistema" aria-hidden={!systemActive} inert={!systemActive ? true : undefined}>
            <picture className="s5-sub-environment">
              <source media="(orientation: landscape)" srcSet={renderSystemAssets ? world5RuntimeAssets.systemEnvironmentLandscape : undefined} />
              <img src={renderSystemAssets ? world5RuntimeAssets.systemEnvironmentPortrait : undefined} alt="" data-runtime-asset={renderSystemAssets ? world5RuntimeAssets.systemEnvironmentPortrait : undefined} />
            </picture>
            <button className="s5-back" type="button" onClick={returnToMapImmediately} disabled={state.startsWith("camera_returning")}>← Mapa</button>
            <button
              ref={systemFocusRef}
              className="s5-system-focus"
              type="button"
              data-anchor-id="A_SYSTEM_CONNECTOR_STABLE"
              aria-label={station5SystemCopy.actionAccessibleLabel}
              disabled={state !== "substation_sistema_interactive"}
              onClick={activateArea}
            >
              <img src={renderSystemAssets ? world5RuntimeAssets.systemFocus : undefined} alt="" draggable="false" data-runtime-asset={renderSystemAssets ? world5RuntimeAssets.systemFocus : undefined} />
              <svg className="s5-system-connection" viewBox="0 0 160 100" data-world5-connection="general" aria-hidden="true"><path d="M28 48 C58 18 104 18 135 48" /><circle cx="28" cy="48" r="7" /><circle cx="135" cy="48" r="7" /></svg>
              <span className="s5-system-indicator" aria-hidden="true">✓</span>
            </button>
          </div>
        </section>

        <section className="s5-rail" aria-label="Información de Estación V">
          <figure className={`s5-lia s5-lia--${liaRole}`} data-station5-lia={liaRole} aria-hidden="true" style={{ pointerEvents: "none" }}>
            <img src={liaAsset} alt="" draggable="false" data-runtime-asset={liaAsset} />
          </figure>
          {mapActive ? (
            <div className="s5-map-copy">
              <p className="s5-kicker">Mapa estable</p>
              <h2>{systemCompleted ? "Espacio" : plantsCompleted ? "Sistema" : "Plantas"}</h2>
              <p>{systemCompleted ? "Plantas y Sistema hacen visible el recorrido." : plantsCompleted ? station5SystemCopy.intro : station5PlantsCopy.intro}</p>
              <p>{systemCompleted ? station5SystemCopy.resolvedDescription : plantsCompleted ? station5SystemCopy.lia : station5PlantsCopy.description}</p>
              <p className="s5-status-copy">{statusText}</p>
              {systemCompleted ? <p className="s5-next-area">Espacio · siguiente área, protegida hasta otro ticket.</p> : plantsCompleted ? <p className="s5-next-area">Sistema · siguiente área disponible.</p> : null}
            </div>
          ) : activeArea === "sistema" ? (
            <div className="s5-sub-copy">
              <p className="s5-kicker">Sistema</p>
              <h2 ref={headingRef} tabIndex={-1}>{station5SystemCopy.heading}</h2>
              <p>{station5SystemCopy.intro}</p>
              <p>{station5SystemCopy.lia}</p>
              <p>{state === "substation_sistema_resolved" ? station5SystemCopy.resolvedDescription : station5SystemCopy.instruction}</p>
              <p className="s5-status-copy">{statusText}</p>
              {state === "substation_sistema_storage_error" ? <button type="button" className="s5-secondary-action" onClick={retryStorage}>{station5SystemCopy.retryLabel}</button> : null}
              <button type="button" className="s5-return" disabled={state !== "substation_sistema_resolved" || !systemCompleted} onClick={returnToMap}>{station5SystemCopy.returnLabel}</button>
            </div>
          ) : (
            <div className="s5-sub-copy">
              <p className="s5-kicker">Plantas</p>
              <h2 ref={headingRef} tabIndex={-1}>Las plantas abren el recorrido.</h2>
              <p>{station5PlantsCopy.description}</p>
              <p>{state === "substation_plantas_resolved" ? station5PlantsCopy.resolvedDescription : station5PlantsCopy.instruction}</p>
              <p className="s5-status-copy">{statusText}</p>
              {state === "substation_plantas_storage_error" ? <button type="button" className="s5-secondary-action" onClick={retryStorage}>{station5PlantsCopy.retryLabel}</button> : null}
              <button type="button" className="s5-return" disabled={state !== "substation_plantas_resolved" || !plantsCompleted} onClick={returnToMap}>{station5PlantsCopy.returnLabel}</button>
            </div>
          )}
        </section>
      </div>

      <p className="s5-sr-only" role="status" aria-live="polite">{announcement}</p>
    </main>
  );
}
