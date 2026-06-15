import "./World5RootScreen.css";

import { MobileShell } from "../../components/layout/MobileShell";
import {
  WORLD5_BASE_SLOT_COUNT,
  world5ConceptAreas,
  world5EditorialSlots,
} from "../../content/world5EditorialSlots";

export function World5RootScreen() {
  return (
    <MobileShell eyebrow="Mundo V preliminar" title="Mundo V: Mapa del Presente">
      <div
        className="world5-root-experience"
        data-world5-experience="base_entry"
        data-world5-editorial-source="excel_pending"
        data-world5-state="entry_preliminary"
        data-world5-slot-count={WORLD5_BASE_SLOT_COUNT}
        data-world5-full-experience="not_implemented"
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-daily-counter="not_implemented"
      >
        <section
          className="world5-root-scene"
          aria-label={world5EditorialSlots.W5_ACCESSIBLE_SCENE_01.text}
          data-world5-slot-id="W5_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="world5-root-map" aria-hidden="true">
            {world5ConceptAreas.map((area, index) => (
              <span
                className="world5-root-map__area"
                data-world5-area={area}
                data-world5-area-order={index + 1}
                key={area}
              >
                {area}
              </span>
            ))}
          </div>

          <div className="world5-root-copy">
            <p className="world5-root-copy__eyebrow">
              Estación V en preparación
            </p>
            <h2>Mapa del presente</h2>
            <p
              className="world5-root-copy__text world5-root-copy__text--lia"
              data-world5-slot-id="W5_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world5EditorialSlots.W5_INTRO_LIA_01.text}
            </p>
            <p
              className="world5-root-copy__text"
              data-world5-slot-id="W5_INTRO_AMB_01"
              data-editorial-status="TEMP"
            >
              {world5EditorialSlots.W5_INTRO_AMB_01.text}
            </p>
          </div>
        </section>

        <section className="world5-root-areas" aria-label="Áreas de Mundo V">
          {world5ConceptAreas.map((area, index) => (
            <article
              className="world5-root-area"
              data-world5-protected-area={area}
              key={area}
            >
              <span className="world5-root-area__order">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{area}</h2>
            </article>
          ))}
        </section>

        <p className="world5-root-note">
          Entrada base creada para validar continuidad. La experiencia completa
          de Mundo V queda pendiente de ticket específico.
        </p>
      </div>
    </MobileShell>
  );
}
