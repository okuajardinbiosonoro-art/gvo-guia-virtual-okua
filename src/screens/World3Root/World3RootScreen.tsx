import "./World3RootScreen.css";

import { MobileShell } from "../../components/layout/MobileShell";
import {
  WORLD3_BASE_SLOT_COUNT,
  world3ConceptSequence,
  world3EditorialSlots,
} from "../../content/world3EditorialSlots";

export function World3RootScreen() {
  return (
    <MobileShell eyebrow="Mundo III base" title="Mundo III: Cuaderno Pixel">
      <div
        className="world3-root-entry"
        data-world3-entry="preliminary"
        data-world3-editorial-source="excel_pending"
        data-world3-slot-count={WORLD3_BASE_SLOT_COUNT}
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
      >
        <section
          className="world3-root-scene"
          aria-label={world3EditorialSlots.W3_ACCESSIBLE_SCENE_01.text}
          data-world3-slot-id="W3_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="world3-root-sequence" aria-hidden="true">
            {world3ConceptSequence.map((concept) => (
              <span className="world3-root-sequence__step" key={concept}>
                {concept}
              </span>
            ))}
          </div>

          <div className="world3-root-copy">
            <p className="world3-root-copy__eyebrow">
              Estación III en preparación
            </p>
            <h2>Cuaderno de pruebas y ajustes</h2>
            <p
              className="world3-root-copy__text world3-root-copy__text--lia"
              data-world3-slot-id="W3_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world3EditorialSlots.W3_INTRO_LIA_01.text}
            </p>
            <p
              className="world3-root-copy__text"
              data-world3-slot-id="W3_INTRO_AMB_01"
              data-editorial-status="TEMP"
            >
              {world3EditorialSlots.W3_INTRO_AMB_01.text}
            </p>
          </div>
        </section>

        <p className="world3-root-note">
          Entrada preliminar: la experiencia completa de Mundo III no se
          construye en 009D.
        </p>
      </div>
    </MobileShell>
  );
}
