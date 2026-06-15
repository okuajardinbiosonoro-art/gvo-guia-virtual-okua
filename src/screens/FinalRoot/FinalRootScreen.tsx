import "./FinalRootScreen.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  coverIntroRoute,
  worldFiveEntryRoute,
  worldFourEntryRoute,
  worldOneEntryRoute,
  worldThreeEntryRoute,
  worldTwoEntryRoute,
} from "../../app/routes";
import { MobileShell } from "../../components/layout/MobileShell";
import {
  FINAL_REQUIRED_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";
import type { FinalEditorialSlotId } from "../../content/finalEditorialSlots";

type FinalReviewAccessId = "i" | "ii" | "iii" | "iv" | "v";

type FinalExperienceState =
  | "final_intro"
  | "final_review"
  | "final_access_i_selected"
  | "final_access_ii_selected"
  | "final_access_iii_selected"
  | "final_access_iv_selected"
  | "final_access_v_selected"
  | "final_return"
  | "final_restart"
  | "final_restart_confirm"
  | "final_credits";

type FinalReviewAccess = {
  accessibleSlot: FinalEditorialSlotId;
  confirmSlot: FinalEditorialSlotId;
  id: FinalReviewAccessId;
  labelSlot: FinalEditorialSlotId;
  route: string;
  state: FinalExperienceState;
};

const finalReviewAccesses: ReadonlyArray<FinalReviewAccess> = [
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_I_01",
    confirmSlot: "FINAL_ACCESS_I_CONFIRM_01",
    id: "i",
    labelSlot: "FINAL_ACCESS_I_LABEL_01",
    route: worldOneEntryRoute,
    state: "final_access_i_selected",
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_II_01",
    confirmSlot: "FINAL_ACCESS_II_CONFIRM_01",
    id: "ii",
    labelSlot: "FINAL_ACCESS_II_LABEL_01",
    route: worldTwoEntryRoute,
    state: "final_access_ii_selected",
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_III_01",
    confirmSlot: "FINAL_ACCESS_III_CONFIRM_01",
    id: "iii",
    labelSlot: "FINAL_ACCESS_III_LABEL_01",
    route: worldThreeEntryRoute,
    state: "final_access_iii_selected",
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_IV_01",
    confirmSlot: "FINAL_ACCESS_IV_CONFIRM_01",
    id: "iv",
    labelSlot: "FINAL_ACCESS_IV_LABEL_01",
    route: worldFourEntryRoute,
    state: "final_access_iv_selected",
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_V_01",
    confirmSlot: "FINAL_ACCESS_V_CONFIRM_01",
    id: "v",
    labelSlot: "FINAL_ACCESS_V_LABEL_01",
    route: worldFiveEntryRoute,
    state: "final_access_v_selected",
  },
] as const;

export function FinalRootScreen() {
  const navigate = useNavigate();
  const [experienceState, setExperienceState] =
    useState<FinalExperienceState>("final_intro");
  const [selectedAccessId, setSelectedAccessId] =
    useState<FinalReviewAccessId | null>(null);
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);
  const selectedAccess =
    finalReviewAccesses.find((access) => access.id === selectedAccessId) ?? null;

  function selectReviewAccess(access: FinalReviewAccess) {
    setSelectedAccessId(access.id);
    setRestartConfirmOpen(false);
    setExperienceState(access.state);
  }

  function openRestartConfirmation() {
    setSelectedAccessId(null);
    setRestartConfirmOpen(true);
    setExperienceState("final_restart_confirm");
  }

  function cancelRestart() {
    setRestartConfirmOpen(false);
    setExperienceState("final_restart");
  }

  function navigateToHome() {
    setExperienceState("final_return");
    navigate(coverIntroRoute);
  }

  function confirmRestart() {
    navigate(coverIntroRoute);
  }

  return (
    <MobileShell eyebrow="Pantalla final temporal" title="Pantalla Final — Mirador">
      <div
        className="final-root-experience"
        data-final-root="mirador_temporal"
        data-final-screen="temporary_complete_experience"
        data-final-state={experienceState}
        data-final-slot-count={FINAL_REQUIRED_SLOT_COUNT}
        data-final-editorial-source="excel_pending"
        data-final-complete-experience="temporary_complete"
        data-review-mode="direct_route_review"
        data-restart-mode="navigation_only_no_global_cleanup"
        data-daily-counter="not_implemented"
        data-qr-camera="blocked"
        data-sensitive-permissions="blocked"
        data-final-station-model="mirador_closure"
        data-final-world-six="blocked"
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
            <p className="final-root-copy__eyebrow">TEMP — Mirador</p>
            <h2
              data-final-slot-id="FINAL_TITLE_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_TITLE_01.text}
            </h2>
            <p className="final-root-state">TEMP — Cierre temporal completo</p>
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
          className="final-root-review"
          aria-label="TEMP — Revisión de mundos desde Mirador Final"
          data-final-state-equivalent="final_review"
        >
          <p
            className="final-root-note"
            data-final-slot-id="FINAL_HELP_01"
            data-editorial-status="TEMP"
          >
            {finalEditorialSlots.FINAL_HELP_01.text}
          </p>

          <div className="final-root-access-grid">
            {finalReviewAccesses.map((access) => {
              const labelSlot = finalEditorialSlots[access.labelSlot];
              const accessibleSlot = finalEditorialSlots[access.accessibleSlot];
              const isSelected = selectedAccessId === access.id;

              return (
                <button
                  aria-describedby={`final-access-${access.id}`}
                  aria-label={labelSlot.text}
                  aria-pressed={isSelected}
                  className={`final-root-access${
                    isSelected ? " final-root-access--selected" : ""
                  }`}
                  data-final-access-id={access.id}
                  data-final-access-route={access.route}
                  data-final-slot-id={labelSlot.slotId}
                  data-final-state-target={access.state}
                  data-editorial-status="TEMP"
                  key={access.id}
                  type="button"
                  onClick={() => selectReviewAccess(access)}
                >
                  <span className="final-root-access__label">
                    {labelSlot.text}
                  </span>
                  <span
                    className="final-root-sr-only"
                    id={`final-access-${access.id}`}
                    data-final-slot-id={accessibleSlot.slotId}
                    data-editorial-status="TEMP"
                  >
                    {accessibleSlot.text}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="final-root-detail"
          aria-live="polite"
          data-final-detail-state={experienceState}
        >
          {selectedAccess ? (
            <>
              <p
                className="final-root-copy__text final-root-copy__text--system"
                data-final-slot-id={selectedAccess.confirmSlot}
                data-editorial-status="TEMP"
              >
                {finalEditorialSlots[selectedAccess.confirmSlot].text}
              </p>
              <Link
                className="final-root-primary-action final-root-primary-action--review"
                data-final-action="open_direct_review_route"
                data-final-review-route={selectedAccess.route}
                to={selectedAccess.route}
              >
                {finalEditorialSlots[selectedAccess.labelSlot].text}
              </Link>
            </>
          ) : (
            <p className="final-root-note">
              TEMP — Los accesos de revisión usan rutas existentes sin crear otra
              estación.
            </p>
          )}
        </section>

        <section
          className="final-root-actions"
          aria-label="TEMP — Acciones de cierre del Mirador Final"
        >
          <button
            aria-describedby="final-back-home-help"
            className="final-root-action"
            data-editorial-status="TEMP"
            data-final-action="safe_navigation_portada"
            data-final-slot-id="FINAL_BACK_HOME_BTN_01"
            type="button"
            onClick={navigateToHome}
          >
            {finalEditorialSlots.FINAL_BACK_HOME_BTN_01.text}
          </button>
          <span
            className="final-root-sr-only"
            data-editorial-status="TEMP"
            data-final-slot-id="FINAL_ACCESSIBLE_BACK_HOME_01"
            id="final-back-home-help"
          >
            {finalEditorialSlots.FINAL_ACCESSIBLE_BACK_HOME_01.text}
          </span>
          <p
            className="final-root-note"
            data-final-slot-id="FINAL_BACK_HOME_HELP_01"
            data-editorial-status="TEMP"
          >
            {finalEditorialSlots.FINAL_BACK_HOME_HELP_01.text}
          </p>

          <button
            aria-describedby="final-restart-accessible"
            className="final-root-action final-root-action--danger"
            data-editorial-status="TEMP"
            data-final-action="open_restart_confirmation"
            data-final-slot-id="FINAL_RESTART_BTN_01"
            type="button"
            onClick={openRestartConfirmation}
          >
            {finalEditorialSlots.FINAL_RESTART_BTN_01.text}
          </button>
          <span
            className="final-root-sr-only"
            data-editorial-status="TEMP"
            data-final-slot-id="FINAL_ACCESSIBLE_RESTART_01"
            id="final-restart-accessible"
          >
            {finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text}
          </span>
        </section>

        {restartConfirmOpen ? (
          <section
            aria-label={finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text}
            className="final-root-restart"
            data-final-state-equivalent="final_restart_confirm"
          >
            <p
              className="final-root-copy__text final-root-copy__text--system"
              data-final-slot-id="FINAL_RESTART_CONFIRM_01"
              data-editorial-status="TEMP"
            >
              {finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text}
            </p>
            <div className="final-root-restart__actions">
              <button
                className="final-root-action"
                data-editorial-status="TEMP"
                data-final-action="cancel_restart"
                data-final-slot-id="FINAL_RESTART_CANCEL_BTN_01"
                type="button"
                onClick={cancelRestart}
              >
                {finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text}
              </button>
              <button
                className="final-root-action final-root-action--danger"
                data-editorial-status="TEMP"
                data-final-action="confirm_restart_navigation_only"
                data-final-slot-id="FINAL_RESTART_CONFIRM_BTN_01"
                type="button"
                onClick={confirmRestart}
              >
                {finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text}
              </button>
            </div>
          </section>
        ) : null}

        <footer
          className="final-root-credits"
          data-editorial-status="TEMP"
          data-final-slot-id="FINAL_CREDITS_01"
          data-final-state-equivalent="final_credits"
        >
          {finalEditorialSlots.FINAL_CREDITS_01.text}
        </footer>
      </div>
    </MobileShell>
  );
}
