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
import { ProjectedRasterStage } from "./ProjectedRasterStage";
import {
  station5Areas,
  station5ContentApprovalStatus,
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
import {
  mapRecessMaskLandscape,
  mapRecessMaskPortrait,
  sectorSourceStyle,
  serializeSourcePolygon,
} from "./station5Geometry";
import {
  World5EditorialPanel,
  type World5LiaRole,
} from "./World5EditorialPanel";

type TraversableArea = "plantas" | "sistema";
type AreaVisualState = "locked" | "available" | "completed";
type TransitionMode = "entering" | "returning";

export type Station5PresentationState =
  | "map_overview"
  | "map_blocked_feedback"
  | "plants_intro"
  | "plants_resolved"
  | "system_intro"
  | "system_resolved"
  | "transitioning"
  | "storage_error";

export type Station5RuntimeState = Station5PresentationState;

const ENTER_DURATION_MS = 760;
const RETURN_DURATION_MS = 620;
const REDUCED_DURATION_MS = 80;

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

function routeArea(pathname: string): TraversableArea | null {
  if (pathname === worldFivePlantsRoute) return "plantas";
  if (pathname === worldFiveSystemRoute) return "sistema";
  return null;
}

function initialPresentation(
  pathname: string,
  progress: World5Progress,
): Station5PresentationState {
  const area = routeArea(pathname);
  if (area === "plantas")
    return completed(progress, area) ? "plants_resolved" : "plants_intro";
  if (area === "sistema" && completed(progress, "plantas")) {
    return completed(progress, area) ? "system_resolved" : "system_intro";
  }
  return "map_overview";
}

function stateArea(
  state: Station5PresentationState,
  transitionArea: TraversableArea | null,
  errorArea: TraversableArea | null,
): TraversableArea | null {
  if (state.startsWith("plants_")) return "plantas";
  if (state.startsWith("system_")) return "sistema";
  if (state === "transitioning") return transitionArea;
  if (state === "storage_error") return errorArea;
  return null;
}

export function World5RootScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const initialProgressRef = useRef(readWorld5Progress());
  const [progress, setProgress] = useState(initialProgressRef.current);
  const [presentation, setPresentation] = useState<Station5PresentationState>(
    () => initialPresentation(location.pathname, initialProgressRef.current),
  );
  const [transitionArea, setTransitionArea] = useState<TraversableArea | null>(
    null,
  );
  const [transitionMode, setTransitionMode] = useState<TransitionMode | null>(
    null,
  );
  const [errorArea, setErrorArea] = useState<TraversableArea | null>(null);
  const [blockedArea, setBlockedArea] = useState<Station5AreaId | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const epochRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const plantsButtonRef = useRef<HTMLButtonElement>(null);
  const systemButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingMapFocusRef = useRef<TraversableArea | null>(null);
  const lastPathnameRef = useRef(location.pathname);

  const plantsCompleted = completed(progress, "plantas");
  const systemCompleted = completed(progress, "sistema");
  const mapActive =
    presentation === "map_overview" || presentation === "map_blocked_feedback";
  const motionLock = presentation === "transitioning";
  const activeArea = stateArea(presentation, transitionArea, errorArea);
  const renderMapAssets = mapActive || motionLock;
  const renderPlantsAssets = activeArea === "plantas";
  const renderSystemAssets = activeArea === "sistema";

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
      lastPathnameRef.current = worldFiveEntryRoute;
      clearTimeline();
      navigate(worldFiveEntryRoute, { replace: true });
      setTransitionArea(null);
      setTransitionMode(null);
      setPresentation("map_overview");
      setAnnouncement(
        blockedSystem
          ? "Completa Plantas para habilitar Sistema."
          : "La ruta todavía está protegida.",
      );
      return;
    }

    if (lastPathnameRef.current === location.pathname) return;
    lastPathnameRef.current = location.pathname;
    if (location.pathname === worldFiveEntryRoute) {
      clearTimeline();
      setTransitionArea(null);
      setTransitionMode(null);
      setErrorArea(null);
      setBlockedArea(null);
      setPresentation("map_overview");
      setAnnouncement("");
    }
  }, [clearTimeline, location.pathname, navigate, plantsCompleted]);

  useEffect(() => {
    if (!presentation.endsWith("_intro") && !presentation.endsWith("_resolved"))
      return;
    headingRef.current?.focus({ preventScroll: true });
  }, [presentation]);

  useEffect(() => {
    if (presentation !== "map_overview" || !pendingMapFocusRef.current) return;
    const area = pendingMapFocusRef.current;
    pendingMapFocusRef.current = null;
    (area === "sistema" ? systemButtonRef : plantsButtonRef).current?.focus({
      preventScroll: true,
    });
  }, [presentation]);

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
      if (area === "plantas")
        return plantsCompleted ? "completed" : "available";
      if (area === "sistema") {
        if (systemCompleted) return "completed";
        return plantsCompleted ? "available" : "locked";
      }
      return "locked";
    },
    [plantsCompleted, systemCompleted],
  );

  const showBlockedFeedback = useCallback(
    (area: Station5AreaId) => {
      if (!mapActive || motionLock) return;
      setBlockedArea(area);
      setPresentation("map_blocked_feedback");
      const message =
        area === "sistema"
          ? "Completa Plantas para habilitar Sistema."
          : area === "espacio"
            ? systemCompleted
              ? "Espacio sigue protegido en este ticket."
              : "Completa Plantas y Sistema antes de Espacio."
            : "Visitante sigue protegido en este ticket.";
      setAnnouncement(message);
    },
    [mapActive, motionLock, systemCompleted],
  );

  const enterArea = useCallback(
    (area: TraversableArea) => {
      if (!mapActive || motionLock) return;
      if (area === "sistema" && !plantsCompleted) {
        showBlockedFeedback(area);
        return;
      }
      clearTimeline();
      setBlockedArea(null);
      setErrorArea(null);
      setTransitionArea(area);
      setTransitionMode("entering");
      setPresentation("transitioning");
      setAnnouncement("");
      navigate(areaRoutes[area]);
      const epoch = ++epochRef.current;
      timerRef.current = window.setTimeout(
        () => {
          if (epochRef.current !== epoch) return;
          setPresentation(
            completed(progress, area)
              ? area === "plantas"
                ? "plants_resolved"
                : "system_resolved"
              : area === "plantas"
                ? "plants_intro"
                : "system_intro",
          );
          setTransitionMode(null);
          timerRef.current = null;
        },
        reducedMotion ? REDUCED_DURATION_MS : ENTER_DURATION_MS,
      );
    },
    [
      clearTimeline,
      mapActive,
      motionLock,
      navigate,
      plantsCompleted,
      progress,
      reducedMotion,
      showBlockedFeedback,
    ],
  );

  const returnToMapImmediately = useCallback(() => {
    const focusArea = activeArea;
    clearTimeline();
    pendingMapFocusRef.current = focusArea;
    navigate(worldFiveEntryRoute, { replace: true });
    lastPathnameRef.current = worldFiveEntryRoute;
    setTransitionArea(null);
    setTransitionMode(null);
    setErrorArea(null);
    setPresentation("map_overview");
    setAnnouncement("");
  }, [activeArea, clearTimeline, navigate]);

  const activateArea = useCallback(() => {
    const introState =
      activeArea === "plantas" ? "plants_intro" : "system_intro";
    if (!activeArea || presentation !== introState) return;
    const result = completeWorld5Area(activeArea);
    if (!result.ok) {
      setErrorArea(activeArea);
      setPresentation("storage_error");
      setAnnouncement(
        activeArea === "sistema"
          ? station5SystemCopy.storageError
          : station5PlantsCopy.storageError,
      );
      return;
    }
    setProgress(result.progress);
    setPresentation(
      activeArea === "plantas" ? "plants_resolved" : "system_resolved",
    );
    setAnnouncement(
      activeArea === "sistema"
        ? station5SystemCopy.resolvedStatus
        : station5PlantsCopy.resolvedStatus,
    );
  }, [activeArea, presentation]);

  const retryStorage = useCallback(() => {
    if (!errorArea || presentation !== "storage_error") return;
    setPresentation(errorArea === "plantas" ? "plants_intro" : "system_intro");
    setAnnouncement("");
  }, [errorArea, presentation]);

  const returnToMap = useCallback(() => {
    if (!activeArea || !completed(progress, activeArea)) return;
    const expected =
      activeArea === "plantas" ? "plants_resolved" : "system_resolved";
    if (presentation !== expected) return;
    clearTimeline();
    pendingMapFocusRef.current = activeArea;
    setTransitionArea(activeArea);
    setTransitionMode("returning");
    setPresentation("transitioning");
    const epoch = ++epochRef.current;
    timerRef.current = window.setTimeout(
      () => {
        if (epochRef.current !== epoch) return;
        navigate(worldFiveEntryRoute, { replace: true });
        lastPathnameRef.current = worldFiveEntryRoute;
        setTransitionArea(null);
        setTransitionMode(null);
        setPresentation("map_overview");
        setAnnouncement(
          activeArea === "sistema"
            ? "Sistema completada. Regresaste al mapa general."
            : "Plantas completada. Regresaste al mapa general.",
        );
        timerRef.current = null;
      },
      reducedMotion ? REDUCED_DURATION_MS : RETURN_DURATION_MS,
    );
  }, [
    activeArea,
    clearTimeline,
    navigate,
    presentation,
    progress,
    reducedMotion,
  ]);

  const liaRole: World5LiaRole = motionLock
    ? "lead"
    : mapActive
      ? "attend"
      : "explain";
  const liaAsset = {
    explain: world5RuntimeAssets.liaExplainCalm,
    attend: world5RuntimeAssets.liaAttendNeutral,
    lead: world5RuntimeAssets.liaLeadForward,
  }[liaRole];

  const overviewGuidance = useMemo(() => {
    if (systemCompleted) {
      return "Plantas y Sistema ya están conectados. Espacio sigue protegido.";
    }
    if (plantsCompleted) {
      return "Plantas ya fue reconocida. Continúa con Sistema.";
    }
    return "Toca Plantas para comenzar.";
  }, [plantsCompleted, systemCompleted]);

  const blockedGuidance =
    blockedArea === "sistema"
      ? "Completa Plantas para habilitar Sistema."
      : blockedArea === "espacio"
        ? systemCompleted
          ? "Espacio todavía no forma parte del alcance publicado."
          : "Completa Plantas y Sistema antes de intentar Espacio."
        : "Visitante todavía no forma parte del alcance publicado.";

  const renderAreaAction = (area: Station5AreaId) => {
    if (area === "plantas") return () => enterArea("plantas");
    if (area === "sistema")
      return plantsCompleted
        ? () => enterArea("sistema")
        : () => showBlockedFeedback("sistema");
    return () => showBlockedFeedback(area);
  };

  return (
    <main
      className="s5-screen"
      data-active-area={activeArea ?? "map"}
      data-copy-approval={station5ContentApprovalStatus}
      data-motion-lock={motionLock ? "true" : "false"}
      data-station-complete="false"
      data-station5-reduced-motion={reducedMotion ? "true" : "false"}
      data-station5-state={presentation}
      data-transition-mode={transitionMode ?? "none"}
      aria-labelledby={mapActive ? "station5-map-title" : "station5-title"}
    >
      <div className="s5-layout">
        <section
          className="s5-stage"
          aria-label="Mapa del presente y subestaciones Plantas y Sistema"
        >
          <div
            className="s5-map-scene"
            data-station5-scene="map"
            aria-hidden={!renderMapAssets}
            inert={!renderMapAssets ? true : undefined}
          >
            <ProjectedRasterStage
              className="s5-map-projection"
              fit="contain"
              landscapeHeight={1440}
              landscapeSrc={
                renderMapAssets
                  ? world5RuntimeAssets.mapEnvironmentLandscape
                  : undefined
              }
              landscapeWidth={2560}
              name="map"
              portraitHeight={2560}
              portraitSrc={
                renderMapAssets
                  ? world5RuntimeAssets.mapEnvironmentPortrait
                  : undefined
              }
              portraitWidth={1440}
            >
              <header className="s5-map-heading">
                <p>ESTACIÓN V</p>
                <h1 id="station5-map-title">MUNDO PRESENTE</h1>
              </header>
              <div
                className="s5-map-artboard"
                data-map-complete="false"
                data-map-recess="source-derived"
                data-recess-polygon-portrait={serializeSourcePolygon(
                  mapRecessMaskPortrait,
                )}
                data-recess-polygon-landscape={serializeSourcePolygon(
                  mapRecessMaskLandscape,
                )}
              >
                {station5Areas.map((area) => {
                  const visualState = areaState(area.id);
                  const protectedArea =
                    area.id === "espacio" || area.id === "visitante";
                  return (
                    <button
                      key={area.id}
                      ref={
                        area.id === "plantas"
                          ? plantsButtonRef
                          : area.id === "sistema"
                            ? systemButtonRef
                            : undefined
                      }
                      type="button"
                      className={`s5-sector s5-sector--${area.id}`}
                      style={sectorSourceStyle(area.id)}
                      data-station5-area={area.id}
                      data-area-state={visualState}
                      data-protected={protectedArea ? "true" : "false"}
                      aria-label={`${area.accessibleLabel}. ${visualState === "completed" ? "Completada" : visualState === "available" ? "Disponible" : "Protegida"}.`}
                      disabled={motionLock}
                      onClick={renderAreaAction(area.id)}
                    >
                      <img
                        alt=""
                        data-runtime-asset={
                          renderMapAssets ? sectorAssets[area.id] : undefined
                        }
                        draggable="false"
                        src={
                          renderMapAssets ? sectorAssets[area.id] : undefined
                        }
                      />
                      <span className="s5-sector__label">{area.title}</span>
                    </button>
                  );
                })}
              </div>
              <picture className="s5-map-rim" aria-hidden="true">
                <source
                  media="(orientation: landscape)"
                  srcSet={
                    renderMapAssets
                      ? world5RuntimeAssets.mapRimLandscape
                      : undefined
                  }
                />
                <img
                  alt=""
                  data-runtime-asset={
                    renderMapAssets
                      ? world5RuntimeAssets.mapRimPortrait
                      : undefined
                  }
                  draggable="false"
                  src={
                    renderMapAssets
                      ? world5RuntimeAssets.mapRimPortrait
                      : undefined
                  }
                />
              </picture>
            </ProjectedRasterStage>
          </div>

          <div
            className="s5-plants-scene"
            data-station5-scene="plantas"
            aria-hidden={!renderPlantsAssets}
            inert={!renderPlantsAssets ? true : undefined}
          >
            <ProjectedRasterStage
              fit="cover"
              landscapeHeight={1080}
              landscapeSrc={
                renderPlantsAssets
                  ? world5RuntimeAssets.plantsEnvironmentLandscape
                  : undefined
              }
              landscapeWidth={1920}
              name="plants"
              portraitHeight={1920}
              portraitSrc={
                renderPlantsAssets
                  ? world5RuntimeAssets.plantsEnvironmentPortrait
                  : undefined
              }
              portraitWidth={1440}
            >
              <div className="s5-plants-focus" data-anchor-id="A_PLANT_CONTACT">
                <img
                  alt=""
                  data-runtime-asset={
                    renderPlantsAssets
                      ? world5RuntimeAssets.plantsFocus
                      : undefined
                  }
                  draggable="false"
                  src={
                    renderPlantsAssets
                      ? world5RuntimeAssets.plantsFocus
                      : undefined
                  }
                />
                <button
                  className="s5-leaf-control"
                  type="button"
                  aria-label={station5PlantsCopy.leafAccessibleLabel}
                  disabled={presentation !== "plants_intro"}
                  onClick={activateArea}
                />
              </div>
            </ProjectedRasterStage>
            <button
              className="s5-back"
              type="button"
              onClick={
                presentation === "plants_resolved"
                  ? returnToMap
                  : returnToMapImmediately
              }
              disabled={
                presentation === "storage_error" ||
                transitionMode === "returning"
              }
            >
              {presentation === "plants_resolved" ||
              presentation === "storage_error"
                ? station5PlantsCopy.returnLabel
                : "← Mapa"}
            </button>
          </div>

          <div
            className="s5-system-scene"
            data-station5-scene="sistema"
            aria-hidden={!renderSystemAssets}
            inert={!renderSystemAssets ? true : undefined}
          >
            <ProjectedRasterStage
              fit="cover"
              landscapeHeight={1080}
              landscapeSrc={
                renderSystemAssets
                  ? world5RuntimeAssets.systemEnvironmentLandscape
                  : undefined
              }
              landscapeWidth={1920}
              name="system"
              portraitHeight={1920}
              portraitSrc={
                renderSystemAssets
                  ? world5RuntimeAssets.systemEnvironmentPortrait
                  : undefined
              }
              portraitWidth={1440}
            >
              <button
                className="s5-system-focus"
                type="button"
                data-anchor-id="A_SYSTEM_PLANE"
                data-system-rotation="-2.5deg-portrait_-2deg-landscape"
                aria-label={station5SystemCopy.actionAccessibleLabel}
                disabled={presentation !== "system_intro"}
                onClick={activateArea}
              >
                <img
                  alt=""
                  data-runtime-asset={
                    renderSystemAssets
                      ? world5RuntimeAssets.systemFocus
                      : undefined
                  }
                  draggable="false"
                  src={
                    renderSystemAssets
                      ? world5RuntimeAssets.systemFocus
                      : undefined
                  }
                />
              </button>
            </ProjectedRasterStage>
            <button
              className="s5-back"
              type="button"
              onClick={
                presentation === "system_resolved"
                  ? returnToMap
                  : returnToMapImmediately
              }
              disabled={
                presentation === "storage_error" ||
                transitionMode === "returning"
              }
            >
              {presentation === "system_resolved" ||
              presentation === "storage_error"
                ? station5SystemCopy.returnLabel
                : "← Mapa"}
            </button>
          </div>
        </section>

        {mapActive ? (
          <World5EditorialPanel
            action={
              presentation === "map_blocked_feedback" ? (
                <button
                  className="s5-secondary-action"
                  type="button"
                  onClick={() => {
                    setBlockedArea(null);
                    setPresentation("map_overview");
                    setAnnouncement("");
                  }}
                >
                  Volver al mapa general
                </button>
              ) : undefined
            }
            context={
              presentation === "map_blocked_feedback"
                ? "RECORRIDO PROTEGIDO"
                : undefined
            }
            title={
              presentation === "map_blocked_feedback"
                ? "Área protegida"
                : undefined
            }
            titleAs="h2"
            lead={
              presentation === "map_blocked_feedback"
                ? blockedGuidance
                : "Descubre cómo la vida se convierte en señal."
            }
            support={
              presentation === "map_blocked_feedback"
                ? "Tu avance y tu ubicación no cambiaron."
                : overviewGuidance
            }
            liaAsset={liaAsset}
            liaRole={liaRole}
          />
        ) : activeArea === "sistema" ? (
          <World5EditorialPanel
            action={
              presentation === "storage_error" ? (
                <button
                  className="s5-secondary-action"
                  type="button"
                  onClick={retryStorage}
                >
                  {station5SystemCopy.retryLabel}
                </button>
              ) : undefined
            }
            context="SISTEMA · ÁREA 2 DE 4"
            title={station5SystemCopy.heading}
            headingRef={headingRef}
            lead={station5SystemCopy.lia}
            support={
              presentation === "system_resolved"
                ? station5SystemCopy.resolvedDescription
                : station5SystemCopy.instruction
            }
            status={
              presentation === "system_resolved"
                ? station5SystemCopy.resolvedStatus
                : presentation === "storage_error"
                  ? station5SystemCopy.storageError
                  : undefined
            }
            liaAsset={liaAsset}
            liaRole={liaRole}
          />
        ) : (
          <World5EditorialPanel
            action={
              presentation === "storage_error" ? (
                <button
                  className="s5-secondary-action"
                  type="button"
                  onClick={retryStorage}
                >
                  {station5PlantsCopy.retryLabel}
                </button>
              ) : undefined
            }
            context="PLANTAS · ÁREA 1 DE 4"
            title="Plantas"
            headingRef={headingRef}
            lead={station5PlantsCopy.description}
            support={
              presentation === "plants_resolved"
                ? station5PlantsCopy.resolvedDescription
                : station5PlantsCopy.instruction
            }
            status={
              presentation === "plants_resolved"
                ? station5PlantsCopy.resolvedStatus
                : presentation === "storage_error"
                  ? station5PlantsCopy.storageError
                  : undefined
            }
            liaAsset={liaAsset}
            liaRole={liaRole}
          />
        )}
      </div>

      <p className="s5-sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </main>
  );
}
