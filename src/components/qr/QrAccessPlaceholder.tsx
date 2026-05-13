import { Link } from "react-router-dom";

import { MobileShell } from "../layout/MobileShell";

interface QrAccessPlaceholderProps {
  stationId: string;
}

export function QrAccessPlaceholder({ stationId }: QrAccessPlaceholderProps) {
  return (
    <MobileShell eyebrow="Acceso QR placeholder">
      <p>
        Ruta preparada para QR físico: <strong>/qr/{stationId}</strong>.
      </p>
      <p>
        El scanner interno queda reservado como función opcional. El flujo base
        debe funcionar con la cámara nativa del celular abriendo URLs locales.
      </p>
      <Link className="text-link" to={`/estacion/${stationId}`}>
        Ver placeholder de estación
      </Link>
    </MobileShell>
  );
}
