import { useCallback, useEffect, useState } from "react";
import {
  createBrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { QrAccessPlaceholder } from "../components/qr/QrAccessPlaceholder";
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
  coverToWorldOneTransitionRoute,
  finalEntryRoute,
  worldFiveEntryRoute,
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
    const destination = shouldResetIntro
      ? "/portada?resetIntro=1"
      : "/portada";

    navigate(destination, { replace: true });
  }, [coverIntroPreload.ready, location.search, minimumDurationComplete, navigate]);

  return (
    <LoadingInitialScreen
      preloadStatus={coverIntroPreload.status}
      preloadProgress={coverIntroPreload.progress}
      preloadTarget="coverIntroCritical"
    />
  );
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
    element: <CoverIntroScreen />,
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
    element: <TransitionWorldRuntimeRoute config={introToStationOneTransition} />,
  },
  {
    path: worldOneToWorldTwoTransitionRoute,
    element: (
      <TransitionWorldRuntimeRoute config={worldOneToWorldTwoTransition} />
    ),
  },
  {
    path: worldTwoToWorldThreeTransitionRoute,
    element: (
      <TransitionWorldRuntimeRoute config={worldTwoToWorldThreeTransition} />
    ),
  },
  {
    path: worldThreeToWorldFourTransitionRoute,
    element: (
      <TransitionWorldRuntimeRoute config={worldThreeToWorldFourTransition} />
    ),
  },
  {
    path: worldFourToWorldFiveTransitionRoute,
    element: (
      <TransitionWorldRuntimeRoute config={worldFourToWorldFiveTransition} />
    ),
  },
  {
    path: worldFiveToFinalTransitionRoute,
    element: <TransitionWorldRuntimeRoute config={worldFiveToFinalTransition} />,
  },
  {
    path: "/estacion/1",
    element: <World1RootScreen />,
  },
  {
    path: worldTwoEntryRoute,
    element: <World2RootScreen />,
  },
  {
    path: worldThreeEntryRoute,
    element: <World3RootScreen />,
  },
  {
    path: worldFourEntryRoute,
    element: <World4RootScreen />,
  },
  {
    path: worldFiveEntryRoute,
    element: <World5RootScreen />,
  },
  {
    path: "/estacion/:stationId",
    element: <StationPlaceholder />,
  },
  {
    path: finalEntryRoute,
    element: <FinalRootScreen />,
  },
  {
    path: "/qr/:stationId",
    element: <QrRoute />,
  },
]);
