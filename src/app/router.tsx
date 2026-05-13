import { createBrowserRouter, useParams } from "react-router-dom";

import { QrAccessPlaceholder } from "../components/qr/QrAccessPlaceholder";
import { flowSteps } from "../data/flow";
import { CoverPlaceholder } from "../screens/Cover/CoverPlaceholder";
import { FinalPlaceholder } from "../screens/Final/FinalPlaceholder";
import { LoadingInitialPlaceholder } from "../screens/LoadingInitial/LoadingInitialPlaceholder";
import { StationPlaceholder } from "../screens/Station/StationPlaceholder";

function QrRoute() {
  const { stationId } = useParams();
  return <QrAccessPlaceholder stationId={stationId ?? "sin-id"} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoadingInitialPlaceholder flowSteps={flowSteps} />,
  },
  {
    path: "/carga",
    element: <LoadingInitialPlaceholder flowSteps={flowSteps} />,
  },
  {
    path: "/portada",
    element: <CoverPlaceholder flowSteps={flowSteps} />,
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
