import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createBrowserRouter,
  replace,
  type RouteObject,
  useNavigate,
} from "react-router-dom";



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

import {
  FinalReviewContextInvalidator,
  FinalReviewModeLayout,
} from "./review/FinalReviewModeLayout";
import {
  journeyRouteModuleLoaders,
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
import { liaPreviewEnabled } from "../features/lia-preview/config";
import { liaPreviewRoute } from "./routes";


import { acceptQrRouteIntent, pendingJourneyNavigationState } from "./journey/journeyIntent";
import { coherentProgressPrefixLength, readEssentialSnapshot } from "./journey/journeyEssential";
import { essentialRecoveryRoute, resolveJourneyAccess } from "./journey/journeyAccess";
import { validateJourneyReceipt } from "./journey/journeyReceipt";

import { readLanguagePreference } from "./preferences/languagePreference";
import { interstationQrContracts } from "./qr/interstationQr";

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
const LiaPreviewScreen = lazy(() =>
  journeyRouteModuleLoaders
    .liaPreview()
    .then((module) => ({ default: module.LiaPreviewScreen })),
);
const World1RootLayoutCalibrator = lazy(() =>
  import("../screens/World1Root/dev").then((module) => ({
    default: module.World1RootLayoutCalibrator,
  })),
);

function RouteModuleFallback({ moduleId }: { moduleId: string }) {
  const locale = readLanguagePreference() ?? "es";
  return (
    <main
      className="mobile-shell"
      data-route-module-fallback={moduleId}
      role="status"
      aria-live="polite"
    >
      <section className="base-panel">
        <p>{locale === "en" ? "Preparing your journey" : "Preparando el recorrido"}</p>
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

export function requireFinalAccess() {
  const state = typeof window === "undefined" ? null : window.history.state?.usr;
  if (resolveJourneyAccess("/final", state).authorized) return null;
  return replace(essentialRecoveryRoute());
}
export function requireStationAccess(stationId: keyof typeof stationEntryRoutes) {
  const state = typeof window === "undefined" ? null : window.history.state?.usr;
  if (resolveJourneyAccess(stationEntryRoutes[stationId], state).authorized) return null;
  return replace(essentialRecoveryRoute());
}
export function requireTransitionAccess(completedOriginStation: keyof typeof stationEntryRoutes | "cover") {
  const snapshot = readEssentialSnapshot(), pending = snapshot?.pendingTransition;
  const target = completedOriginStation === "cover" ? "/estacion/1" : completedOriginStation === 5 ? "/final" : `/estacion/${completedOriginStation + 1}`;
  if (snapshot && pending?.from === completedOriginStation && validateJourneyReceipt(pending, snapshot, coherentProgressPrefixLength(), target)) return null;
  return replace(essentialRecoveryRoute());
}
export function requireQrAccess(qrId: string | null | undefined) {
  if (qrId === "start") return replace("/");
  const target = /^w([2-5])$/.exec(qrId ?? "");
  if (target) {
    const origin = (Number(target[1]) - 1) as 1 | 2 | 3 | 4;
    const snapshot = readEssentialSnapshot(), receipt = snapshot?.pendingTransition;
    const contract = interstationQrContracts[origin];
    const to = stationEntryRoutes[(origin + 1) as 2 | 3 | 4 | 5];
    if (snapshot && receipt?.from === origin && receipt.canonicalPayload === contract.payload && validateJourneyReceipt(receipt, snapshot, coherentProgressPrefixLength(), to)) return replace(contract.transitionRoute);
    const state = typeof window === "undefined" ? null : window.history.state?.usr;
    if (acceptQrRouteIntent(origin, state)) return replace(contract.transitionRoute);
    return replace(essentialRecoveryRoute());
  }
  return replace(essentialRecoveryRoute());
}
function TransitionWorldRuntimeRoute({ config }: { config: TransitionWorldConfig }) {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  useEffect(() => {
    const snapshot = readEssentialSnapshot(), pending = snapshot?.pendingTransition;
    if (!snapshot || !validateJourneyReceipt(pending, snapshot, coherentProgressPrefixLength(), config.toRoute)) { setError(true); return; }
    navigate(config.toRoute, { replace: true, state: pendingJourneyNavigationState() });
  }, [config.toRoute, navigate]);
  if (!error) return null;
  return <RouteModuleBoundary moduleId="transition"><TransitionWorld config={config} variant="runtime" preloadStatus={error ? "error" : "loading"} preloadProgress={0} onBack={() => navigate(config.fromRoute, { replace: true })} canRetry={false} /></RouteModuleBoundary>;
}

const journeyRoutes: RouteObject[] = [
  {
    path: "/",
    element: null,
  },
  {
    path: "/carga",
    element: null,
  },
  {
    path: initialExperienceRoute,
    element: null,
  },
  {
    path: "/portada",
    element: null,
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
    loader: () => requireTransitionAccess("cover"),
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
    loader: () => requireTransitionAccess(5),
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
    path: liaPreviewRoute,
    loader: () =>
      liaPreviewEnabled ? requireFinalAccess() : replace(finalEntryRoute),
    element: (
      <FinalReviewContextInvalidator>
        <RouteModuleBoundary moduleId="liaPreview">
          <LiaPreviewScreen />
        </RouteModuleBoundary>
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: finalEntryRoute,
    loader: requireFinalAccess,
    element: (
        <RouteModuleBoundary moduleId="final">
          <FinalRootScreen />
        </RouteModuleBoundary>
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
