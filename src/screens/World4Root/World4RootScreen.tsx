import "./World4RootScreen.css";

import { MobileShell } from "../../components/layout/MobileShell";
import {
  WORLD4_BASE_SLOT_COUNT,
  world4EditorialSlots,
  world4TechnicalNodes,
} from "../../content/world4EditorialSlots";

export function World4RootScreen() {
  return (
    <MobileShell eyebrow="Mundo IV preliminar" title="Mundo IV: Mesa de Sistema">
      <div
        className="world4-root-experience"
        data-world4-experience="base_entry"
        data-world4-editorial-source="excel_pending"
        data-world4-state="entry_preliminary"
        data-world4-slot-count={WORLD4_BASE_SLOT_COUNT}
        data-world4-full-experience="not_implemented"
        data-sensitive-permissions="blocked"
        data-qr-camera="blocked"
        data-daily-counter="not_implemented"
      >
        <section
          className="world4-root-scene"
          aria-label={world4EditorialSlots.W4_ACCESSIBLE_SCENE_01.text}
          data-world4-slot-id="W4_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <ol className="world4-root-system-table" aria-hidden="true">
            {world4TechnicalNodes.map((node, index) => (
              <li
                className="world4-root-node"
                data-world4-technical-node={node}
                data-testid="world4-technical-node"
                key={node}
              >
                <span className="world4-root-node__order">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="world4-root-node__label">{node}</span>
              </li>
            ))}
          </ol>

          <div className="world4-root-copy">
            <p className="world4-root-copy__eyebrow">
              Estación IV en preparación
            </p>
            <h2>Mesa de sistema</h2>
            <p
              className="world4-root-copy__text world4-root-copy__text--lia"
              data-world4-slot-id="W4_INTRO_LIA_01"
              data-editorial-status="TEMP"
            >
              {world4EditorialSlots.W4_INTRO_LIA_01.text}
            </p>
            <p
              className="world4-root-copy__text"
              data-world4-slot-id="W4_INTRO_SYS_01"
              data-editorial-status="TEMP"
            >
              {world4EditorialSlots.W4_INTRO_SYS_01.text}
            </p>
          </div>
        </section>

        <section className="world4-root-status" aria-label="Estado Mundo IV">
          <p>Mundo IV queda preparado como entrada base temporal.</p>
          <p>No hay experiencia completa, QR, cámara, contador ni recursos externos.</p>
        </section>
      </div>
    </MobileShell>
  );
}
