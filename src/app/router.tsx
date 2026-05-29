import { createBrowserRouter, useParams } from "react-router-dom";

import { QrAccessPlaceholder } from "../components/qr/QrAccessPlaceholder";
import { flowSteps } from "../data/flow";
import { CoverIntroScreen } from "../screens/Cover";
import { FinalPlaceholder } from "../screens/Final/FinalPlaceholder";
import { LoadingInitialScreen } from "../screens/LoadingInitial";
import { StationPlaceholder } from "../screens/Station/StationPlaceholder";

function QrRoute() {
  const { stationId } = useParams();
  return <QrAccessPlaceholder stationId={stationId ?? "sin-id"} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoadingInitialScreen />,
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
