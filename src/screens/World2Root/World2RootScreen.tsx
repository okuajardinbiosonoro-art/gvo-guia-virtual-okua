import "./World2RootScreen.css";

import { MobileShell } from "../../components/layout/MobileShell";
import { getStationById } from "../../data/stations";

const worldTwoStation = getStationById(2);

export function World2RootScreen() {
  return (
    <MobileShell
      eyebrow="Mundo II preparado"
      title={worldTwoStation?.world ?? "Mundo II"}
    >
      <div
        className="world2-root-entry"
        data-world2-entry="prepared"
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
      >
        <h2>Estación II en preparación</h2>
        <p className="world2-root-entry__intro">
          La ruta desde Mundo I ya está conectada. La experiencia completa de
          este mundo se construirá en una fase posterior.
        </p>

        <dl className="world2-root-entry__status">
          <div className="world2-root-entry__row">
            <dt className="world2-root-entry__label">Entrada</dt>
            <dd className="world2-root-entry__value">
              /estacion/2 responde como punto de arranque preliminar.
            </dd>
          </div>
          <div className="world2-root-entry__row">
            <dt className="world2-root-entry__label">Alcance</dt>
            <dd className="world2-root-entry__value">
              Base visual mínima, sin experiencia completa de Mundo II.
            </dd>
          </div>
          <div className="world2-root-entry__row">
            <dt className="world2-root-entry__label">QR y cámara</dt>
            <dd className="world2-root-entry__value">
              Bloqueados en esta fase.
            </dd>
          </div>
        </dl>

        <p className="world2-root-entry__note">
          No se cargan assets nuevos ni recursos externos.
        </p>
      </div>
    </MobileShell>
  );
}
