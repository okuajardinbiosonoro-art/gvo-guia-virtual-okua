import { useCallback, useEffect, useState } from "react";
import {
  createBrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { QrAccessPlaceholder } from "../components/qr/QrAccessPlaceholder";
import { flowSteps } from "../data/flow";
import { CoverIntroScreen } from "../screens/Cover";
import { FinalPlaceholder } from "../screens/Final/FinalPlaceholder";
import { LoadingInitialScreen } from "../screens/LoadingInitial";
import { loadingInitialTimeline } from "../screens/LoadingInitial/loadingInitialTimeline";
import { StationPlaceholder } from "../screens/Station/StationPlaceholder";
import { TransitionWorld } from "../screens/TransitionWorld";
import { introToStationOneTransition } from "../screens/TransitionWorld/transitionWorld.config";
import { World1RootScreen } from "../screens/World1Root";
import { World1RootLayoutCalibrator } from "../screens/World1Root/dev";
import { World2RootScreen } from "../screens/World2Root";
import { screenAssetBundles } from "../shared/assets/screenAssetBundles";
import { useAssetPreloader } from "../shared/assets/useAssetPreloader";
import {
  coverToWorldOneTransitionRoute,
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

function TransitionWorldRuntimeRoute() {
  const navigate = useNavigate();
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const handleComplete = useCallback(() => {
    navigate(introToStationOneTransition.toRoute, { replace: true });
  }, [navigate]);

  return (
    <TransitionWorld
      config={introToStationOneTransition}
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
    element: <TransitionWorldRuntimeRoute />,
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
    path: "/estacion/:stationId",
    element: <StationPlaceholder />,
  },
  {
    path: "/final",
    element: <FinalPlaceholder flowSteps={flowSteps} />,
  },
  {
    path: "/qr/:stationId",
    element: <QrRoute />,
  },
]);
