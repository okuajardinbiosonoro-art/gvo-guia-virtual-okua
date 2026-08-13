import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createBrowserRouter,
  replace,
  type RouteObject,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  canOpenStation,
  canOpenTransition,
  canOpenFinal,
  mostAdvancedAvailableStation,
  readProgress,
} from "../domain/progress/progress.storage";
import { CoverIntroScreen } from "../screens/Cover";
import { InitialExperienceScreen } from "../screens/InitialExperience";
import { LoadingInitialScreen } from "../screens/LoadingInitial";
import { loadingInitialTimeline } from "../screens/LoadingInitial/loadingInitialTimeline";
import { StationPlaceholder } from "../screens/Station/StationPlaceholder";
import {
  introToStationOneTransition,
  worldFourToWorldFiveTransition,
  worldFiveToFinalTransition,
  worldThreeToWorldFourTransition,
  worldTwoToWorldThreeTransition,
  worldOneToWorldTwoTransition,
} from "../screens/TransitionWorld/transitionWorld.config";
import type { TransitionWorldConfig } from "../screens/TransitionWorld/transitionWorld.types";
import { screenAssetBundles } from "../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../shared/assets/useAssetPreloader";
import {
  FinalReviewContextInvalidator,
  FinalReviewModeLayout,
} from "./review/FinalReviewModeLayout";
import { clearFinalReviewContext } from "./review/finalReviewContext";
import { resolveQrNavigation } from "./qr/qrNavigation";
import {
  journeyRouteModuleLoaders,
  preloadJourneyRouteModule,
  routeModuleForDestination,
  type JourneyRouteModuleId,
} from "./routeModules";
import {
  coverToWorldOneTransitionRoute,
  finalEntryRoute,
  initialExperienceRoute,
  qrEntryRoutePattern,
  qrFallbackRoutePattern,
  stationEntryRoutes,
  worldOneEntryRoute,
  worldFiveEntryRoute,
  worldFivePlantsRoute,
  worldFiveSpaceRoute,
  worldFiveSystemRoute,
  worldFiveVisitorRoute,
  worldFiveToFinalTransitionRoute,
  worldFourToWorldFiveTransitionRoute,
  worldThreeEntryRoute,
  worldThreeToWorldFourTransitionRoute,
  worldFourEntryRoute,
  worldOneToWorldTwoTransitionRoute,
  worldTwoToWorldThreeTransitionRoute,
  worldTwoEntryRoute,
} from "./routes";
import { GlobalImmersiveShell } from "./shell/GlobalImmersiveShell";

const TransitionWorld = lazy(() =>
  journeyRouteModuleLoaders.transition().then((module) => ({
    default: module.TransitionWorld,
  })),
);
const World1RootScreen = lazy(() =>
  journeyRouteModuleLoaders.world1().then((module) => ({
    default: module.World1RootScreen,
  })),
);
const World2RootScreen = lazy(() =>
  journeyRouteModuleLoaders.world2().then((module) => ({
    default: module.World2RootScreen,
  })),
);
const World3RootScreen = lazy(() =>
  journeyRouteModuleLoaders.world3().then((module) => ({
    default: module.World3RootScreen,
  })),
);
const World4RootScreen = lazy(() =>
  journeyRouteModuleLoaders.world4().then((module) => ({
    default: module.World4RootScreen,
  })),
);
const World5RootScreen = lazy(() =>
  journeyRouteModuleLoaders.world5().then((module) => ({
    default: module.World5RootScreen,
  })),
);
const FinalRootScreen = lazy(() =>
  journeyRouteModuleLoaders.final().then((module) => ({
    default: module.FinalRootScreen,
  })),
);
const World1RootLayoutCalibrator = lazy(() =>
  import("../screens/World1Root/dev").then((module) => ({
    default: module.World1RootLayoutCalibrator,
  })),
);

function RouteModuleFallback({ moduleId }: { moduleId: string }) {
  return (
    <main
      className="mobile-shell"
      data-route-module-fallback={moduleId}
      role="status"
      aria-live="polite"
    >
      <section className="base-panel">
        <p>Preparando el recorrido</p>
      </section>
    </main>
  );
}

function RouteModuleBoundary({
  children,
  moduleId,
}: {
  children: ReactNode;
  moduleId: string;
}) {
  return (
    <Suspense fallback={<RouteModuleFallback moduleId={moduleId} />}>
      {children}
    </Suspense>
  );
}

function LazyStationRoute({
  moduleId,
  screen,
  world,
}: {
  moduleId: JourneyRouteModuleId;
  screen: ReactNode;
  world: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <FinalReviewModeLayout world={world}>
      <RouteModuleBoundary moduleId={moduleId}>{screen}</RouteModuleBoundary>
    </FinalReviewModeLayout>
  );
}

function JourneyLoadingRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const [minimumDurationComplete, setMinimumDurationComplete] = useState(false);
  const coverIntroPreload = useAssetPreloader(
    screenAssetBundles.coverIntroCritical,
    {
      timeoutMs: 9000,
    },
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const durationMs = prefersReducedMotion
      ? loadingInitialTimeline.reducedMotionDurationMs
      : loadingInitialTimeline.durationMs;
    setMinimumDurationComplete(false);
    const timeoutId = window.setTimeout(() => {
      setMinimumDurationComplete(true);
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.search]);

  useEffect(() => {
    if (!minimumDurationComplete || !coverIntroPreload.ready) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const shouldResetIntro = searchParams.get("resetIntro") === "1";
    const destination = shouldResetIntro
      ? "/portada?resetIntro=1"
      : initialExperienceRoute;

    navigate(destination, { replace: true });
  }, [
    coverIntroPreload.ready,
    location.search,
    minimumDurationComplete,
    navigate,
  ]);

  return (
    <LoadingInitialScreen
      preloadStatus={coverIntroPreload.status}
      preloadProgress={coverIntroPreload.progress}
      preloadTarget="coverIntroCritical"
    />
  );
}

export function requireFinalAccess() {
  const progress = readProgress();
  if (canOpenFinal(progress)) {
    return null;
  }

  clearFinalReviewContext();
  return replace(stationEntryRoutes[mostAdvancedAvailableStation(progress)]);
}

export function requireStationAccess(
  stationId: keyof typeof stationEntryRoutes,
) {
  const progress = readProgress();
  if (canOpenStation(stationId, progress)) {
    return null;
  }

  clearFinalReviewContext();
  return replace(stationEntryRoutes[mostAdvancedAvailableStation(progress)]);
}

export function requireTransitionAccess(
  completedOriginStation: keyof typeof stationEntryRoutes,
) {
  const progress = readProgress();
  if (canOpenTransition(completedOriginStation, progress)) {
    return null;
  }

  clearFinalReviewContext();
  return replace(stationEntryRoutes[mostAdvancedAvailableStation(progress)]);
}

export function requireQrAccess(qrId: string | null | undefined) {
  const resolution = resolveQrNavigation(qrId);
  clearFinalReviewContext();
  return replace(resolution.destination);
}

function TransitionWorldRuntimeRoute({
  config,
}: {
  config: TransitionWorldConfig;
}) {
  const navigate = useNavigate();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetModuleId = routeModuleForDestination(config.toRoute);

  useEffect(() => {
    if (targetModuleId) {
      void preloadJourneyRouteModule(targetModuleId).catch(() => undefined);
    }
  }, [targetModuleId]);

  const handleComplete = useCallback(() => {
    if (!targetModuleId) {
      navigate(config.toRoute, { replace: true });
      return;
    }

    void preloadJourneyRouteModule(targetModuleId)
      .then(() => {
        navigate(config.toRoute, { replace: true });
      })
      .catch(() => {
        window.location.replace(config.toRoute);
      });
  }, [config.toRoute, navigate, targetModuleId]);

  return (
    <RouteModuleBoundary moduleId="transition">
      <TransitionWorld
        config={config}
        variant="runtime"
        isReducedMotion={prefersReducedMotion}
        onComplete={handleComplete}
      />
    </RouteModuleBoundary>
  );
}

const journeyRoutes: RouteObject[] = [
  {
    path: "/",
    element: <JourneyLoadingRoute />,
  },
  {
    path: "/carga",
    element: <LoadingInitialScreen />,
  },
  {
    path: initialExperienceRoute,
    element: <InitialExperienceScreen />,
  },
  {
    path: "/portada",
    element: (
      <FinalReviewContextInvalidator>
        <CoverIntroScreen />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: "/dev/transition-world",
    element: (
      <RouteModuleBoundary moduleId="transition-preview">
        <TransitionWorld />
      </RouteModuleBoundary>
    ),
  },
  {
    path: "/dev/world1-root-layout",
    element: (
      <RouteModuleBoundary moduleId="world1-layout-calibrator">
        <World1RootLayoutCalibrator />
      </RouteModuleBoundary>
    ),
  },
  {
    path: coverToWorldOneTransitionRoute,
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={introToStationOneTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldOneToWorldTwoTransitionRoute,
    loader: () => requireTransitionAccess(1),
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={worldOneToWorldTwoTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldTwoToWorldThreeTransitionRoute,
    loader: () => requireTransitionAccess(2),
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={worldTwoToWorldThreeTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldThreeToWorldFourTransitionRoute,
    loader: () => requireTransitionAccess(3),
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={worldThreeToWorldFourTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldFourToWorldFiveTransitionRoute,
    loader: () => requireTransitionAccess(4),
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={worldFourToWorldFiveTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldFiveToFinalTransitionRoute,
    loader: requireFinalAccess,
    element: (
      <FinalReviewContextInvalidator>
        <TransitionWorldRuntimeRoute config={worldFiveToFinalTransition} />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: worldOneEntryRoute,
    loader: () => requireStationAccess(1),
    element: (
      <LazyStationRoute
        moduleId="world1"
        screen={<World1RootScreen />}
        world={1}
      />
    ),
  },
  {
    path: worldTwoEntryRoute,
    loader: () => requireStationAccess(2),
    element: (
      <LazyStationRoute
        moduleId="world2"
        screen={<World2RootScreen />}
        world={2}
      />
    ),
  },
  {
    path: worldThreeEntryRoute,
    loader: () => requireStationAccess(3),
    element: (
      <LazyStationRoute
        moduleId="world3"
        screen={<World3RootScreen />}
        world={3}
      />
    ),
  },
  {
    path: worldFourEntryRoute,
    loader: () => requireStationAccess(4),
    element: (
      <LazyStationRoute
        moduleId="world4"
        screen={<World4RootScreen />}
        world={4}
      />
    ),
  },
  {
    path: worldFiveEntryRoute,
    loader: () => requireStationAccess(5),
    element: (
      <LazyStationRoute
        moduleId="world5"
        screen={<World5RootScreen />}
        world={5}
      />
    ),
  },
  {
    path: worldFivePlantsRoute,
    loader: () => requireStationAccess(5),
    element: (
      <LazyStationRoute
        moduleId="world5"
        screen={<World5RootScreen />}
        world={5}
      />
    ),
  },
  {
    path: worldFiveSystemRoute,
    loader: () => requireStationAccess(5),
    element: (
      <LazyStationRoute
        moduleId="world5"
        screen={<World5RootScreen />}
        world={5}
      />
    ),
  },
  {
    path: worldFiveSpaceRoute,
    loader: () => requireStationAccess(5),
    element: (
      <LazyStationRoute
        moduleId="world5"
        screen={<World5RootScreen />}
        world={5}
      />
    ),
  },
  {
    path: worldFiveVisitorRoute,
    loader: () => requireStationAccess(5),
    element: (
      <LazyStationRoute
        moduleId="world5"
        screen={<World5RootScreen />}
        world={5}
      />
    ),
  },
  {
    path: "/estacion/:stationId",
    element: <StationPlaceholder />,
  },
  {
    path: finalEntryRoute,
    loader: requireFinalAccess,
    element: (
      <FinalReviewContextInvalidator>
        <RouteModuleBoundary moduleId="final">
          <FinalRootScreen />
        </RouteModuleBoundary>
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: qrEntryRoutePattern,
    loader: ({ params }) => requireQrAccess(params.qrId),
  },
  {
    path: qrFallbackRoutePattern,
    loader: ({ params }) => requireQrAccess(params["*"]),
  },
];

export const router = createBrowserRouter([
  {
    element: <GlobalImmersiveShell />,
    children: journeyRoutes,
  },
]);
