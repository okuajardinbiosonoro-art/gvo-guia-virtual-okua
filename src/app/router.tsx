import { useCallback, useEffect } from "react";
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
import { coverToWorldOneTransitionRoute } from "./routes";

function QrRoute() {
  const { stationId } = useParams();
  return <QrAccessPlaceholder stationId={stationId ?? "sin-id"} />;
}

function JourneyLoadingRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldResetIntro = searchParams.get("resetIntro") === "1";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const durationMs = prefersReducedMotion
      ? loadingInitialTimeline.reducedMotionDurationMs
      : loadingInitialTimeline.durationMs;
    const destination = shouldResetIntro
      ? "/portada?resetIntro=1"
      : "/portada";
    const timeoutId = window.setTimeout(() => {
      navigate(destination, { replace: true });
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.search, navigate]);

  return <LoadingInitialScreen />;
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
    path: coverToWorldOneTransitionRoute,
    element: <TransitionWorldRuntimeRoute />,
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
