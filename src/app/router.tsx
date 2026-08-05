import { useCallback, useEffect, useState } from "react";
import {
  createBrowserRouter,
  replace,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { QrAccessPlaceholder } from "../components/qr/QrAccessPlaceholder";
import {
  canOpenStation,
  canOpenTransition,
  canOpenFinal,
  mostAdvancedAvailableStation,
  readProgress,
} from "../domain/progress/progress.storage";
import { CoverIntroScreen } from "../screens/Cover";
import { FinalRootScreen } from "../screens/FinalRoot";
import { LoadingInitialScreen } from "../screens/LoadingInitial";
import { loadingInitialTimeline } from "../screens/LoadingInitial/loadingInitialTimeline";
import { StationPlaceholder } from "../screens/Station/StationPlaceholder";
import { TransitionWorld } from "../screens/TransitionWorld";
import {
  introToStationOneTransition,
  worldFourToWorldFiveTransition,
  worldFiveToFinalTransition,
  worldThreeToWorldFourTransition,
  worldTwoToWorldThreeTransition,
  worldOneToWorldTwoTransition,
} from "../screens/TransitionWorld/transitionWorld.config";
import type { TransitionWorldConfig } from "../screens/TransitionWorld/transitionWorld.types";
import { World1RootScreen } from "../screens/World1Root";
import { World1RootLayoutCalibrator } from "../screens/World1Root/dev";
import { World2RootScreen } from "../screens/World2Root";
import { World3RootScreen } from "../screens/World3Root";
import { World4RootScreen } from "../screens/World4Root";
import { World5RootScreen } from "../screens/World5Root";
import { screenAssetBundles } from "../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../shared/assets/useAssetPreloader";
import {
  FinalReviewContextInvalidator,
  FinalReviewModeLayout,
} from "./review/FinalReviewModeLayout";
import { clearFinalReviewContext } from "./review/finalReviewContext";
import {
  coverToWorldOneTransitionRoute,
  finalEntryRoute,
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

function QrRoute() {
  const { stationId } = useParams();
  return <QrAccessPlaceholder stationId={stationId ?? "sin-id"} />;
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
    const destination = shouldResetIntro ? "/portada?resetIntro=1" : "/portada";

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

function TransitionWorldRuntimeRoute({
  config,
}: {
  config: TransitionWorldConfig;
}) {
  const navigate = useNavigate();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const handleComplete = useCallback(() => {
    navigate(config.toRoute, { replace: true });
  }, [config.toRoute, navigate]);

  return (
    <TransitionWorld
      config={config}
      variant="runtime"
      isReducedMotion={prefersReducedMotion}
      onComplete={handleComplete}
    />
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <JourneyLoadingRoute />,
  },
  {
    path: "/carga",
    element: <LoadingInitialScreen />,
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
    element: <TransitionWorld />,
  },
  {
    path: "/dev/world1-root-layout",
    element: <World1RootLayoutCalibrator />,
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
      <FinalReviewModeLayout world={1}>
        <World1RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldTwoEntryRoute,
    loader: () => requireStationAccess(2),
    element: (
      <FinalReviewModeLayout world={2}>
        <World2RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldThreeEntryRoute,
    loader: () => requireStationAccess(3),
    element: (
      <FinalReviewModeLayout world={3}>
        <World3RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFourEntryRoute,
    loader: () => requireStationAccess(4),
    element: (
      <FinalReviewModeLayout world={4}>
        <World4RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFiveEntryRoute,
    loader: () => requireStationAccess(5),
    element: (
      <FinalReviewModeLayout world={5}>
        <World5RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFivePlantsRoute,
    loader: () => requireStationAccess(5),
    element: (
      <FinalReviewModeLayout world={5}>
        <World5RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFiveSystemRoute,
    loader: () => requireStationAccess(5),
    element: (
      <FinalReviewModeLayout world={5}>
        <World5RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFiveSpaceRoute,
    loader: () => requireStationAccess(5),
    element: (
      <FinalReviewModeLayout world={5}>
        <World5RootScreen />
      </FinalReviewModeLayout>
    ),
  },
  {
    path: worldFiveVisitorRoute,
    loader: () => requireStationAccess(5),
    element: (
      <FinalReviewModeLayout world={5}>
        <World5RootScreen />
      </FinalReviewModeLayout>
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
        <FinalRootScreen />
      </FinalReviewContextInvalidator>
    ),
  },
  {
    path: "/qr/:stationId",
    element: <QrRoute />,
  },
]);
