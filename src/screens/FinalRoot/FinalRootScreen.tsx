import "./FinalRootScreen.css";

import { useState } from "react";

import { coverIntroRoute } from "../../app/routes";
import { MobileShell } from "../../components/layout/MobileShell";
import {
  FINAL_BASE_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";

type PreparedAction = "review" | "restart" | null;

const preparedActionMessages: Record<Exclude<PreparedAction, null>, string> = {
  restart:
    "Reinicio preparado: falta ticket específico para limpiar estado global.",
  review:
    "Revisión preparada: falta ticket específico para abrir el modo libre.",
};

export function FinalRootScreen() {
  const [preparedAction, setPreparedAction] = useState<PreparedAction>(null);

  return (
    <MobileShell
      eyebrow="Pantalla final preliminar"
      title="Pantalla Final — Mirador"
    >
      <div
        className="final-root-entry"
        data-final-root="mirador_base"
        data-final-screen="base_entry_prepared"
        data-final-slot-count={FINAL_BASE_SLOT_COUNT}
        data-final-editorial-source="excel_pending"
        data-final-complete-experience="not_implemented"
        data-review-free-mode="not_implemented"
        data-restart-mode="prepared_no_global_cleanup"
        data-daily-counter="not_implemented"
        data-qr-camera="blocked"
        data-sensitive-permissions="blocked"
        data-final-station-model="mirador_closure"
      >
        <section
          className="final-root-scene"
          aria-label={finalEditorialSlots.FINAL_ACCESSIBLE_SCENE_01.text}
          data-final-slot-id="FINAL_ACCESSIBLE_SCENE_01"
          data-editorial-status="TEMP"
        >
          <div className="final-root-horizon" aria-hidden="true">
            <span className="final-root-horizon__line" />
            <span className="final-root-horizon__mark">I</span>
            <span className="final-root-horizon__mark">II</span>
            <span className="final-root-horizon__mark">III</span>
            <span className="final-root-horizon__mark">IV</span>
            <span className="final-root-horizon__mark">V</span>
          </div>

          <div className="final-root-copy">
            <p className="final-root-copy__eyebrow">Entrada base</p>
            <h2
              data-final-slot-id="FINAL_TITLE_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_TITLE_01.text}
            </h2>
            <p className="final-root-state">Pantalla final en preparación</p>
            <p
              className="final-root-copy__text"
              data-final-slot-id="FINAL_SUBTITLE_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_SUBTITLE_01.text}
            </p>
            <p
              className="final-root-copy__text final-root-copy__text--lia"
              data-final-slot-id="FINAL_LIA_MESSAGE_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_LIA_MESSAGE_01.text}
            </p>
            <p
              className="final-root-copy__text"
              data-final-slot-id="FINAL_AMB_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_AMB_01.text}
            </p>
          </div>
        </section>

        <section
          className="final-root-actions"
          aria-label="Acciones preparadas del Mirador Final"
        >
          <button
            className="final-root-action"
            type="button"
            data-final-action="review_worlds_prepared"
            onClick={() => setPreparedAction("review")}
          >
            Revisar mundos — preparado
          </button>
          <a
            className="final-root-action final-root-action--link"
            href={coverIntroRoute}
            data-final-action="safe_navigation_portada"
          >
            Volver al inicio — preparado
          </a>
          <button
            className="final-root-action"
            type="button"
            data-final-action="restart_prepared"
            onClick={() => setPreparedAction("restart")}
          >
            Reiniciar recorrido — preparado
          </button>
        </section>

        <p className="final-root-note">
          En un ticket posterior se habilitará la revisión de mundos; esta
          entrada solo deja preparado el cierre contemplativo.
        </p>
        {preparedAction ? (
          <p className="final-root-note" role="status">
            {preparedActionMessages[preparedAction]}
          </p>
        ) : null}
      </div>
    </MobileShell>
  );
}
