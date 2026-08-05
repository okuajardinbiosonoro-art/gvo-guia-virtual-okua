import "./FinalRootScreen.css";

import type { CSSProperties, ReactNode } from "react";
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
import {
  FINAL_REQUIRED_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";
import type { FinalEditorialSlotId } from "../../content/finalEditorialSlots";
import { finalRootAssets } from "../../shared/assets/finalRootAssets";

type FinalReviewAccessId = "i" | "ii" | "iii" | "iv" | "v";

type FinalExperienceState =
  | "final_intro"
  | "final_return"
  | "final_restart"
  | "final_restart_confirm";

type FinalReviewAccess = {
  accessibleSlot: FinalEditorialSlotId;
  asset: string;
  confirmSlot: FinalEditorialSlotId;
  id: FinalReviewAccessId;
  labelSlot: FinalEditorialSlotId;
  route: string;
  x: number;
  y: number;
};

type FinalSceneStyle = CSSProperties & {
  "--final-access-x"?: number;
  "--final-access-y"?: number;
  "--final-panel-image"?: string;
  "--final-panel-slice"?: string;
};

type NineSlicePanelProps = {
  asset: string;
  children: ReactNode;
  className: string;
  insets: string;
};

const finalReviewAccesses: ReadonlyArray<FinalReviewAccess> = [
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_I_01",
    asset: finalRootAssets.access.world1Root,
    confirmSlot: "FINAL_ACCESS_I_CONFIRM_01",
    id: "i",
    labelSlot: "FINAL_ACCESS_I_LABEL_01",
    route: worldOneEntryRoute,
    x: 20,
    y: 30,
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_II_01",
    asset: finalRootAssets.access.world2Pulse,
    confirmSlot: "FINAL_ACCESS_II_CONFIRM_01",
    id: "ii",
    labelSlot: "FINAL_ACCESS_II_LABEL_01",
    route: worldTwoEntryRoute,
    x: 80,
    y: 30,
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_III_01",
    asset: finalRootAssets.access.world3Notebook,
    confirmSlot: "FINAL_ACCESS_III_CONFIRM_01",
    id: "iii",
    labelSlot: "FINAL_ACCESS_III_LABEL_01",
    route: worldThreeEntryRoute,
    x: 50,
    y: 43,
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_IV_01",
    asset: finalRootAssets.access.world4System,
    confirmSlot: "FINAL_ACCESS_IV_CONFIRM_01",
    id: "iv",
    labelSlot: "FINAL_ACCESS_IV_LABEL_01",
    route: worldFourEntryRoute,
    x: 20,
    y: 52,
  },
  {
    accessibleSlot: "FINAL_ACCESSIBLE_ACCESS_V_01",
    asset: finalRootAssets.access.world5Map,
    confirmSlot: "FINAL_ACCESS_V_CONFIRM_01",
    id: "v",
    labelSlot: "FINAL_ACCESS_V_LABEL_01",
    route: worldFiveEntryRoute,
    x: 80,
    y: 52,
  },
] as const;

const [finalCreditsPrimary, finalCreditsAttribution] =
  finalEditorialSlots.FINAL_CREDITS_01.text.split("\n");

function NineSlicePanel({
  asset,
  children,
  className,
  insets,
}: NineSlicePanelProps) {
  return (
    <div
      className={`final-root-nine-slice ${className}`}
      data-final-9slice-insets={insets}
      data-panel-asset={asset}
      data-runtime-asset={asset}
      style={
        {
          "--final-panel-image": `url("${asset}")`,
          "--final-panel-slice": insets,
        } as FinalSceneStyle
      }
    >
      {children}
    </div>
  );
}

function FinalAccessLink({ access }: { access: FinalReviewAccess }) {
  const labelSlot = finalEditorialSlots[access.labelSlot];
  const accessibleSlot = finalEditorialSlots[access.accessibleSlot];

  return (
    <Link
      aria-label={accessibleSlot.text}
      className="final-root-access"
      data-final-access-activations="1"
      data-final-access-id={access.id}
      data-final-access-intermediate-panel="false"
      data-final-access-route={access.route}
      data-final-accessible-slot-id={accessibleSlot.slotId}
      data-final-slot-id={labelSlot.slotId}
      data-editorial-status="FINAL"
      to={access.route}
      style={
        {
          "--final-access-x": access.x,
          "--final-access-y": access.y,
        } as FinalSceneStyle
      }
    >
      <img
        alt=""
        aria-hidden="true"
        className="final-root-access__art"
        data-runtime-asset={access.asset}
        draggable="false"
        src={access.asset}
      />
      <NineSlicePanel
        asset={finalRootAssets.access.labelBackplate}
        className="final-root-access__label-panel"
        insets="64 112 64 112"
      >
        <span className="final-root-access__label">{labelSlot.text}</span>
      </NineSlicePanel>
    </Link>
  );
}

function FinalStaticLia() {
  return (
    <div
      aria-hidden="true"
      className="final-root-lia"
      data-final-lia-frame="1"
      data-final-lia-mode="static_idle_frame_1"
    >
      <img
        alt=""
        aria-hidden="true"
        className="final-root-lia__glow"
        data-runtime-asset={finalRootAssets.lia.glowShadow}
        draggable="false"
        src={finalRootAssets.lia.glowShadow}
      />
      <span className="final-root-lia__viewport">
        <img
          alt=""
          aria-hidden="true"
          className="final-root-lia__strip"
          data-final-sprite-frame="1"
          data-runtime-asset={finalRootAssets.lia.idleContemplative6f}
          draggable="false"
          src={finalRootAssets.lia.idleContemplative6f}
        />
      </span>
    </div>
  );
}

function FinalActionIcon({ type }: { type: "home" | "restart" }) {
  return type === "home" ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 11.25 12 3l9 8.25v9.25a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M19.4 7.4A8 8 0 1 0 20 16h-2.3a6 6 0 1 1-.1-6.6L14 13h8V5z" />
    </svg>
  );
}

export function FinalRootScreen() {
  const navigate = useNavigate();
  const [experienceState, setExperienceState] =
    useState<FinalExperienceState>("final_intro");
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);

  function openRestartConfirmation() {
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
    <main
      aria-labelledby="final-root-title"
      className="final-root-shell"
      data-final-landscape-status="human_approved_published_021l"
      data-final-portrait-status="human_approved_with_carryover_applied"
    >
      <section
        aria-label={finalEditorialSlots.FINAL_ACCESSIBLE_SCENE_01.text}
        className="final-root-experience"
        data-daily-counter="not_implemented"
        data-final-complete-experience="editorial_final"
        data-final-composition="static_portrait_landscape_human_approved_021l"
        data-final-editorial-locale="es"
        data-final-editorial-source="human_approved"
        data-final-operational-slots="registered_not_consumed"
        data-final-root="mirador_editorial_final"
        data-final-screen="editorial_final_complete_experience"
        data-final-slot-count={FINAL_REQUIRED_SLOT_COUNT}
        data-final-state={experienceState}
        data-final-station-model="mirador_closure"
        data-final-world-six="blocked"
        data-qr-camera="blocked"
        data-restart-mode="navigation_only_no_global_cleanup"
        data-review-mode="direct_link_single_activation"
        data-sensitive-permissions="blocked"
      >
        <picture
          aria-hidden="true"
          className="final-root-environment"
          data-final-layer="z0-environment"
        >
          <source
            data-final-orientation-asset="landscape"
            data-runtime-asset={finalRootAssets.environment.landscape}
            media="(orientation: landscape)"
            srcSet={finalRootAssets.environment.landscape}
          />
          <img
            alt=""
            aria-hidden="true"
            className="final-root-layer-image"
            data-final-orientation-asset="portrait"
            data-runtime-asset={finalRootAssets.environment.portrait}
            draggable="false"
            src={finalRootAssets.environment.portrait}
          />
        </picture>
        <picture
          aria-hidden="true"
          className="final-root-depth"
          data-final-layer="z10-depth"
        >
          <source
            data-final-orientation-asset="landscape"
            data-runtime-asset={
              finalRootAssets.environment.valleyDepthLandscape
            }
            media="(orientation: landscape)"
            srcSet={finalRootAssets.environment.valleyDepthLandscape}
          />
          <img
            alt=""
            aria-hidden="true"
            className="final-root-layer-image"
            data-final-orientation-asset="portrait"
            data-runtime-asset={finalRootAssets.environment.valleyDepthPortrait}
            draggable="false"
            src={finalRootAssets.environment.valleyDepthPortrait}
          />
        </picture>

        <header className="final-root-title" data-final-metric="title">
          <NineSlicePanel
            asset={finalRootAssets.ui.titleBackplate}
            className="final-root-title__panel"
            insets="112 192 112 192"
          >
            <h1
              data-editorial-status="FINAL"
              data-final-slot-id="FINAL_TITLE_01"
              id="final-root-title"
            >
              {finalEditorialSlots.FINAL_TITLE_01.text}
            </h1>
            <p
              data-editorial-status="FINAL"
              data-final-slot-id="FINAL_SUBTITLE_01"
            >
              {finalEditorialSlots.FINAL_SUBTITLE_01.text}
            </p>
          </NineSlicePanel>
        </header>

        <div className="final-root-sr-only" data-final-accessible-copy="base">
          <p
            data-editorial-status="FINAL"
            data-final-slot-id="FINAL_LIA_MESSAGE_01"
          >
            {finalEditorialSlots.FINAL_LIA_MESSAGE_01.text}
          </p>
          <p data-editorial-status="FINAL" data-final-slot-id="FINAL_AMB_01">
            {finalEditorialSlots.FINAL_AMB_01.text}
          </p>
          <p data-editorial-status="FINAL" data-final-slot-id="FINAL_HELP_01">
            {finalEditorialSlots.FINAL_HELP_01.text}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="final-root-sr-only"
          data-final-access-confirm-templates="registered_for_future_transition"
        >
          {finalReviewAccesses.map((access) => (
            <p
              data-editorial-status="FINAL"
              data-final-slot-id={access.confirmSlot}
              key={access.confirmSlot}
            >
              {finalEditorialSlots[access.confirmSlot].text}
            </p>
          ))}
        </div>

        <div
          className="final-root-accesses"
          data-final-metric="accesses"
          data-final-state-equivalent="final_review"
        >
          {finalReviewAccesses.map((access) => (
            <FinalAccessLink access={access} key={access.id} />
          ))}
        </div>

        <picture
          aria-hidden="true"
          className="final-root-foreground"
          data-final-layer="z70-foreground"
        >
          <source
            data-final-orientation-asset="landscape"
            data-runtime-asset={
              finalRootAssets.environment.miradorForegroundLandscape
            }
            media="(orientation: landscape)"
            srcSet={finalRootAssets.environment.miradorForegroundLandscape}
          />
          <img
            alt=""
            aria-hidden="true"
            className="final-root-foreground__image"
            data-final-orientation-asset="portrait"
            data-runtime-asset={
              finalRootAssets.environment.miradorForegroundPortrait
            }
            draggable="false"
            src={finalRootAssets.environment.miradorForegroundPortrait}
          />
        </picture>

        <FinalStaticLia />

        <section className="final-root-actions" data-final-metric="actions">
          <NineSlicePanel
            asset={finalRootAssets.ui.actionBackplate}
            className="final-root-action-panel final-root-action-panel--home"
            insets="64 112 64 112"
          >
            <button
              aria-label={
                finalEditorialSlots.FINAL_ACCESSIBLE_BACK_HOME_01.text
              }
              className="final-root-action"
              data-editorial-status="FINAL"
              data-final-accessible-slot-id="FINAL_ACCESSIBLE_BACK_HOME_01"
              data-final-action="safe_navigation_portada"
              data-final-slot-id="FINAL_BACK_HOME_BTN_01"
              type="button"
              onClick={navigateToHome}
            >
              <FinalActionIcon type="home" />
              <span>{finalEditorialSlots.FINAL_BACK_HOME_BTN_01.text}</span>
            </button>
          </NineSlicePanel>
          <NineSlicePanel
            asset={finalRootAssets.ui.actionBackplate}
            className="final-root-action-panel final-root-action-panel--restart"
            insets="64 112 64 112"
          >
            <button
              aria-label={finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text}
              className="final-root-action final-root-action--restart"
              data-editorial-status="FINAL"
              data-final-accessible-slot-id="FINAL_ACCESSIBLE_RESTART_01"
              data-final-action="open_restart_confirmation"
              data-final-slot-id="FINAL_RESTART_BTN_01"
              type="button"
              onClick={openRestartConfirmation}
            >
              <FinalActionIcon type="restart" />
              <span>{finalEditorialSlots.FINAL_RESTART_BTN_01.text}</span>
            </button>
          </NineSlicePanel>
          <p
            className="final-root-sr-only"
            data-editorial-status="FINAL"
            data-final-slot-id="FINAL_BACK_HOME_HELP_01"
          >
            {finalEditorialSlots.FINAL_BACK_HOME_HELP_01.text}
          </p>
        </section>

        <NineSlicePanel
          asset={finalRootAssets.ui.creditsBackplate}
          className="final-root-credits"
          insets="96 192 96 192"
        >
          <footer
            data-editorial-status="FINAL"
            data-final-metric="credits"
            data-final-slot-id="FINAL_CREDITS_01"
            data-final-state-equivalent="final_credits"
          >
            {finalCreditsPrimary}
            <br />
            {finalCreditsAttribution}
          </footer>
        </NineSlicePanel>

        {restartConfirmOpen ? (
          <div
            className="final-root-restart-scrim"
            data-final-restart-open="true"
          >
            <section
              aria-label={finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text}
              className="final-root-restart"
              data-final-metric="restart-dialog"
              data-final-state-equivalent="final_restart_confirm"
            >
              <NineSlicePanel
                asset={finalRootAssets.ui.restartDialogBackplate}
                className="final-root-restart__panel"
                insets="160 192 160 192"
              >
                <p
                  data-editorial-status="FINAL"
                  data-final-slot-id="FINAL_RESTART_CONFIRM_01"
                >
                  {finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text}
                </p>
                <div className="final-root-restart__actions">
                  <button
                    className="final-root-dialog-action"
                    data-editorial-status="FINAL"
                    data-final-action="cancel_restart"
                    data-final-slot-id="FINAL_RESTART_CANCEL_BTN_01"
                    type="button"
                    onClick={cancelRestart}
                  >
                    {finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text}
                  </button>
                  <button
                    className="final-root-dialog-action final-root-dialog-action--confirm"
                    data-editorial-status="FINAL"
                    data-final-action="confirm_restart_navigation_only"
                    data-final-slot-id="FINAL_RESTART_CONFIRM_BTN_01"
                    type="button"
                    onClick={confirmRestart}
                  >
                    {finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text}
                  </button>
                </div>
              </NineSlicePanel>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
