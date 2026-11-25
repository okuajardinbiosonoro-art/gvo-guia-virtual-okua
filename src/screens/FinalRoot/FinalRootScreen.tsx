import "./FinalRootScreen.css";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useJourneyActivity } from "../../app/journey/JourneyActivation";
import { playJourneySound } from "../../app/audio/journeySound";
import { readLanguagePreference } from "../../app/preferences/languagePreference";
import { Link, useNavigate } from "react-router-dom";

import {
  beginFinalCoverRevisit,
  beginFinalReview,
  type FinalReviewWorld,
} from "../../app/review/finalReviewContext";
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
  getFinalEditorialSlots,
} from "../../content/finalEditorialSlots";
import type { FinalEditorialSlotId, FinalEditorialSlots } from "../../content/finalEditorialSlots";
import { finalRootAssets } from "../../shared/assets/finalRootAssets";
import { liaPreviewCopy } from "../../content/liaPreviewCopy";
import {
  liaPreviewEnabled,
  liaPreviewEntryId,
  takeLiaReturn,
} from "../../features/lia-preview/config";
import { liaPreviewRoute } from "../../app/routes";
import { FinalLiaMotion } from "./FinalLiaMotion";

const FinalLiaPhoto = lazy(() => import("./FinalLiaPhoto"));

type FinalReviewAccessId = "i" | "ii" | "iii" | "iv" | "v";

type FinalExperienceState = "final_intro" | "final_return";

type FinalReviewAccess = {
  accessibleSlot: FinalEditorialSlotId;
  asset: string;
  confirmSlot: FinalEditorialSlotId;
  id: FinalReviewAccessId;
  labelSlot: FinalEditorialSlotId;
  route: string;
  world: FinalReviewWorld;
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
    world: 1,
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
    world: 2,
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
    world: 3,
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
    world: 4,
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
    world: 5,
    x: 80,
    y: 52,
  },
] as const;

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

function FinalAccessLink({ access, slots: finalEditorialSlots }: { access: FinalReviewAccess; slots: FinalEditorialSlots }) {
  const labelSlot = finalEditorialSlots[access.labelSlot];
  const accessibleSlot = finalEditorialSlots[access.accessibleSlot];
  const roomNumberPrefix = `${access.id.toUpperCase()} — `;
  const visibleLabel = labelSlot.text.startsWith(roomNumberPrefix)
    ? labelSlot.text.slice(roomNumberPrefix.length)
    : labelSlot.text;
  const navigate = useNavigate();

  function openReview(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    const state = beginFinalReview(access.world);
    playJourneySound("interaction", { replace: true });
    navigate(access.route, { state });
  }

  return (
    <Link
      aria-label={accessibleSlot.text}
      className="final-root-access"
      data-final-access-activations="1"
      data-final-access-id={access.id}
      data-final-access-intermediate-panel="false"
      data-final-access-route={access.route}
      data-final-review-world={access.world}
      data-final-accessible-slot-id={accessibleSlot.slotId}
      data-final-slot-id={labelSlot.slotId}
      data-editorial-status={labelSlot.status}
      to={access.route}
      onClick={openReview}
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
        <span className="final-root-access__label">{visibleLabel}</span>
      </NineSlicePanel>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 11.25 12 3l9 8.25v9.25a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

export function FinalRootScreen() {
  const navigate = useNavigate();
  const { active } = useJourneyActivity();
  const locale = readLanguagePreference() ?? "es";
  const finalEditorialSlots = getFinalEditorialSlots(locale);
  const finalCredits = finalEditorialSlots.FINAL_CREDITS_01.text;
  const [experienceState, setExperienceState] =
    useState<FinalExperienceState>("final_intro");
  const [photoOpen, setPhotoOpen] = useState(false);
  const photoTriggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active && liaPreviewEnabled && takeLiaReturn())
      document.getElementById(liaPreviewEntryId)?.focus();
  }, [active]);

  function navigateToHome() {
    playJourneySound("interaction", { replace: true });
    setExperienceState("final_return");
    navigate(coverIntroRoute, { state: beginFinalCoverRevisit() });
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
        data-final-editorial-locale={locale}
        data-final-editorial-source="delegated_integration_for_review"
        data-final-operational-slots="consumed_021o"
        data-final-active={active}
        data-final-root="mirador_editorial_final"
        data-final-screen="editorial_final_complete_experience"
        data-final-slot-count={FINAL_REQUIRED_SLOT_COUNT}
        data-final-state={experienceState}
        data-final-station-model="mirador_closure"
        data-final-world-six="blocked"
        data-qr-camera="blocked"
        data-review-mode="final_review_context_single_activation"
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

        <div className="final-root-atmosphere" aria-hidden="true">
          <div className="final-root-atmosphere__canvas" />
        </div>

        <header className="final-root-title" data-final-metric="title">
          <NineSlicePanel
            asset={finalRootAssets.ui.titleBackplate}
            className="final-root-title__panel"
            insets="112 192 112 192"
          >
            <h1
              data-editorial-status={finalEditorialSlots.FINAL_TITLE_01.status}
              data-final-slot-id="FINAL_TITLE_01"
              id="final-root-title"
            >
              {finalEditorialSlots.FINAL_TITLE_01.text}
            </h1>
            <p
              data-editorial-status={finalEditorialSlots.FINAL_SUBTITLE_01.status}
              data-final-slot-id="FINAL_SUBTITLE_01"
            >
              {finalEditorialSlots.FINAL_SUBTITLE_01.text}
            </p>
          </NineSlicePanel>
        </header>

        <div className="final-root-sr-only" data-final-accessible-copy="base">
          <p
            data-editorial-status={finalEditorialSlots.FINAL_LIA_MESSAGE_01.status}
            data-final-slot-id="FINAL_LIA_MESSAGE_01"
          >
            {finalEditorialSlots.FINAL_LIA_MESSAGE_01.text}
          </p>
          <p data-editorial-status={finalEditorialSlots.FINAL_AMB_01.status} data-final-slot-id="FINAL_AMB_01">
            {finalEditorialSlots.FINAL_AMB_01.text}
          </p>
          <p data-editorial-status={finalEditorialSlots.FINAL_HELP_01.status} data-final-slot-id="FINAL_HELP_01">
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
              data-editorial-status={finalEditorialSlots[access.confirmSlot].status}
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
            <FinalAccessLink access={access} slots={finalEditorialSlots} key={access.id} />
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

        <FinalLiaMotion />
        {liaPreviewEnabled && (
          <Link
            id={liaPreviewEntryId}
            className="final-root-lia-entry"
            to={liaPreviewRoute}
            data-copy-status={liaPreviewCopy.status}
          >
            {liaPreviewCopy.entry}
          </Link>
        )}

        <section className="final-root-actions" data-final-metric="actions">
          <button
            ref={photoTriggerRef}
            className="final-root-photo-entry"
            aria-haspopup="dialog"
            type="button"
            onClick={() => { playJourneySound("interaction", { replace: true }); setPhotoOpen(true); }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <path d="M3 7h4l2-3h6l2 3h4v13H3z" />
              <circle cx="12" cy="13" r="3.4" />
            </svg>
            {locale === "en" ? "A photo with Lía" : "Una foto con Lía"}
          </button>
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
              data-editorial-status={finalEditorialSlots.FINAL_BACK_HOME_BTN_01.status}
              data-final-accessible-slot-id="FINAL_ACCESSIBLE_BACK_HOME_01"
              data-final-action="safe_navigation_portada"
              data-final-slot-id="FINAL_BACK_HOME_BTN_01"
              type="button"
              onClick={navigateToHome}
            >
              <HomeIcon />
              <span>{finalEditorialSlots.FINAL_BACK_HOME_BTN_01.text}</span>
            </button>
          </NineSlicePanel>
          <p
            className="final-root-sr-only"
            data-editorial-status={finalEditorialSlots.FINAL_BACK_HOME_HELP_01.status}
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
            data-editorial-status={finalEditorialSlots.FINAL_CREDITS_01.status}
            data-final-metric="credits"
            data-final-slot-id="FINAL_CREDITS_01"
            data-final-state-equivalent="final_credits"
          >
            {finalCredits}
          </footer>
        </NineSlicePanel>

      </section>
      {active && photoOpen && (
        <Suspense fallback={<span className="final-root-sr-only" role="status">{locale === "en" ? "Opening photo…" : "Abriendo foto…"}</span>}>
          <FinalLiaPhoto
            locale={locale}
            onClose={() => {
              setPhotoOpen(false);
              photoTriggerRef.current?.focus();
            }}
          />
        </Suspense>
      )}
    </main>
  );
}
