import { useParams } from "react-router-dom";

import { MobileShell } from "../../components/layout/MobileShell";
import { TransitionPlaceholder } from "../../components/transition/TransitionPlaceholder";
import { getStationById } from "../../data/stations";

export function StationPlaceholder() {
  const { stationId } = useParams();
  const numericStationId = Number(stationId);
  const station = getStationById(numericStationId);

  return (
    <MobileShell eyebrow="Estación placeholder">
      {station ? (
        <>
          <h2>
            {station.label} - {station.world}
          </h2>
          <p>
            Ruta base creada para navegación secuencial y acceso por QR físico.
          </p>
          <TransitionPlaceholder />
        </>
      ) : (
        <p>Estación no reconocida en la base del recorrido.</p>
      )}
    </MobileShell>
  );
}
