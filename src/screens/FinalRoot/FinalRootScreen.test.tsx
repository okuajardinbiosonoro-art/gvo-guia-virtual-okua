import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { JourneyResetResult } from "../../app/reset/resetGvoJourney";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import {
  FINAL_OPERATIONAL_SLOT_COUNT,
  FINAL_REQUIRED_SLOT_COUNT,
  finalEditorialSlots,
  getFinalEditorialSlots,
} from "../../content/finalEditorialSlots";
import { applyDocumentLanguage, writeLanguagePreference } from "../../app/preferences/languagePreference";
import { finalRootAssets } from "../../shared/assets/finalRootAssets";
import finalRootCss from "./FinalRootScreen.css?raw";
import { FinalRootScreen, type FinalRootScreenProps } from "./FinalRootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

// Consumer-unit fixture: the real provider publishes an explicitly active final
// screen. Preparation/admission are tested separately; bare consumers are inert.
const activeFinalContext = { active: true, attemptId: "final-consumer-unit", screen: "final", mode: "normal", authorized: true, reviewReturnAllowed: false } as const;
function ActiveFinalFixture({ children }: { children: ReactNode }) {
  return <JourneyActivationProvider context={activeFinalContext}>{children}</JourneyActivationProvider>;
}

function renderFinalRootScreen(props: FinalRootScreenProps = {}) {
  return render(
    <MemoryRouter initialEntries={["/final"]}>
      <FinalRootScreen {...props} />
      <LocationProbe />
    </MemoryRouter>,
    { wrapper: ActiveFinalFixture },
  );
}

describe("FinalRootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
    window.sessionStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("mantiene los 35 slots finales y registra el consumo operativo 021O", () => {
    const { container } = renderFinalRootScreen();
    const headings = screen.getAllByRole("heading");

    expect(headings).toHaveLength(1);
    expect(headings[0]?.tagName).toBe("H1");
    expect(headings[0]).toHaveTextContent(
      finalEditorialSlots.FINAL_TITLE_01.text,
    );
    expect(
      screen.getByText(finalEditorialSlots.FINAL_SUBTITLE_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_LIA_MESSAGE_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_AMB_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(finalEditorialSlots.FINAL_ACCESSIBLE_SCENE_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(finalEditorialSlots)).toHaveLength(
      FINAL_REQUIRED_SLOT_COUNT,
    );
    expect(Object.keys(finalEditorialSlots)).toHaveLength(35);
    expect(FINAL_OPERATIONAL_SLOT_COUNT).toBe(5);
    expect(
      Object.values(finalEditorialSlots).every(
        (slot) =>
          ["FINAL", "REVIEW"].includes(slot.status) &&
          ["human_approved", "editorial_excel"].includes(slot.source) &&
          slot.locale === "es" &&
          !slot.text.startsWith("TEMP"),
      ),
    ).toBe(true);
    expect(
      container.querySelectorAll('[data-editorial-status="TEMP"]'),
    ).toHaveLength(0);
    expect(
      container.querySelector("[data-final-operational-slots]"),
    ).toHaveAttribute("data-final-operational-slots", "consumed_021o");
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_BUSY_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_ERROR_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RESTART_RETRY_BTN_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text,
    );
    expect(container).not.toHaveTextContent(
      finalEditorialSlots.FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01.text,
    );
  });

  it("selecciona assets canónicos por orientación y mantiene texto en DOM", () => {
    const { container } = renderFinalRootScreen();
    const runtimeAssets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-runtime-asset]"),
      (element) => element.dataset.runtimeAsset,
    );
    const expectedAccessAssets = Object.values(finalRootAssets.access).filter(
      (asset) => asset !== finalRootAssets.access.labelBackplate,
    );

    expect(runtimeAssets).toContain(finalRootAssets.environment.portrait);
    expect(runtimeAssets).toContain(finalRootAssets.environment.landscape);
    expect(runtimeAssets).toContain(
      finalRootAssets.environment.valleyDepthPortrait,
    );
    expect(runtimeAssets).toContain(
      finalRootAssets.environment.valleyDepthLandscape,
    );
    expect(runtimeAssets).toContain(
      finalRootAssets.environment.miradorForegroundPortrait,
    );
    expect(runtimeAssets).toContain(
      finalRootAssets.environment.miradorForegroundLandscape,
    );
    for (const asset of expectedAccessAssets) {
      expect(runtimeAssets).toContain(asset);
    }
    expect(
      container.querySelectorAll("a[data-final-access-id] img"),
    ).toHaveLength(5);
    expect(runtimeAssets).toContain(finalRootAssets.access.labelBackplate);
    expect(runtimeAssets).toContain(finalRootAssets.ui.titleBackplate);
    expect(runtimeAssets).toContain(finalRootAssets.ui.creditsBackplate);
    expect(runtimeAssets).toContain(finalRootAssets.ui.actionBackplate);
    expect(runtimeAssets).toContain(finalRootAssets.lia.idleContemplative6f);
    expect(runtimeAssets).toContain(finalRootAssets.lia.greeting4f);
    expect(runtimeAssets).toContain(finalRootAssets.lia.glowShadow);
    expect(container.innerHTML).not.toContain("current-used");
    const landscapeSources = Array.from(
      container.querySelectorAll<HTMLSourceElement>(
        'source[data-final-orientation-asset="landscape"]',
      ),
    );
    const portraitFallbacks = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        'picture img[data-final-orientation-asset="portrait"]',
      ),
    );
    expect(landscapeSources).toHaveLength(3);
    expect(portraitFallbacks).toHaveLength(3);
    expect(
      landscapeSources.map((source) => source.getAttribute("srcset")),
    ).toEqual([
      finalRootAssets.environment.landscape,
      finalRootAssets.environment.valleyDepthLandscape,
      finalRootAssets.environment.miradorForegroundLandscape,
    ]);
    expect(
      landscapeSources.every(
        (source) => source.media === "(orientation: landscape)",
      ),
    ).toBe(true);
    expect(portraitFallbacks.map((image) => image.getAttribute("src"))).toEqual(
      [
        finalRootAssets.environment.portrait,
        finalRootAssets.environment.valleyDepthPortrait,
        finalRootAssets.environment.miradorForegroundPortrait,
      ],
    );
    expect(
      landscapeSources.some((source) => source.srcset.includes("_portrait_")),
    ).toBe(false);
    expect(
      portraitFallbacks.some((image) => image.src.includes("_landscape_")),
    ).toBe(false);
    expect(container.querySelector("[data-final-lia-frame]")).toHaveAttribute(
      "data-final-lia-frame",
      "1",
    );
    expect(container.querySelector("[data-lia-motion-phase]")).toHaveAttribute(
      "data-lia-motion-phase",
      "greeting",
    );
    expect(
      container.querySelector("[data-final-sprite-frame]"),
    ).toHaveAttribute("data-final-sprite-frame", "1");
    expect(
      container.querySelector(
        '[data-final-landscape-status="human_approved_published_021l"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-final-portrait-status="human_approved_with_carryover_applied"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-final-composition="static_portrait_landscape_human_approved_021l"]',
      ),
    ).toBeInTheDocument();

    expect(Array.from(container.querySelectorAll(".final-root-access__label"), label => label.textContent)).toEqual([
      "Raíz", "Pulso invisible", "Cuaderno de práctica", "Sistema biosonoro", "OKÚA, arte sensorial",
    ]);
    const credits = container.querySelector(
      '[data-final-slot-id="FINAL_CREDITS_01"]',
    );
    expect(credits).toHaveTextContent("Desarrollado por Momotto S.A.S.");
    expect(credits).not.toHaveTextContent("A cargo del Ing. José David P. Z.");
    expect(credits?.querySelector("br")).not.toBeInTheDocument();
  });

  it("navega a cada Mundo con un Link y una sola activación", () => {
    const { container } = renderFinalRootScreen();
    const lia = container.querySelector("[data-lia-motion-phase]");
    const accessExpectations = [
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_I_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_I_CONFIRM_01.text,
        label: "Raíz",
        route: "/estacion/1",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_II_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_II_CONFIRM_01.text,
        label: "Pulso invisible",
        route: "/estacion/2",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_III_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_III_CONFIRM_01.text,
        label: "Cuaderno de práctica",
        route: "/estacion/3",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_IV_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_IV_CONFIRM_01.text,
        label: "Sistema biosonoro",
        route: "/estacion/4",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_V_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_V_CONFIRM_01.text,
        label: "OKÚA, arte sensorial",
        route: "/estacion/5",
      },
    ];

    expect(lia).toHaveAttribute("data-lia-motion-phase", "greeting");
    for (const access of accessExpectations) {
      const accessLink = screen.getByRole("link", {
        name: access.accessible,
      });
      expect(accessLink.tagName).toBe("A");
      expect(accessLink).toHaveAttribute("href", access.route);
      expect(accessLink).toHaveAttribute("data-final-access-activations", "1");
      expect(accessLink).toHaveAttribute(
        "data-final-access-intermediate-panel",
        "false",
      );
      expect(accessLink).not.toHaveAttribute("aria-pressed");
      expect(screen.getByText(access.label)).toBeInTheDocument();
      expect(screen.getByText(access.confirm)).toBeInTheDocument();
      fireEvent.click(accessLink);
      expect(screen.getByTestId("current-location")).toHaveTextContent(
        access.route,
      );
    }

    for (let frame = 0; frame < 4; frame += 1) {
      act(() => vi.advanceTimersByTime(160));
    }
    expect(lia).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(lia).toHaveAttribute("data-lia-motion-frame", "1");
    for (const access of accessExpectations) {
      fireEvent.click(
        screen.getByRole("link", {
          name: access.accessible,
        }),
      );
      expect(screen.getByTestId("current-location")).toHaveTextContent(
        access.route,
      );
    }

    expect(container.querySelectorAll("a[data-final-access-id]")).toHaveLength(
      5,
    );
    expect(
      container.querySelectorAll(
        '[data-final-access-confirm-templates] [data-final-slot-id$="_CONFIRM_01"]',
      ),
    ).toHaveLength(5);
    expect(
      container.querySelector("[data-final-access-confirm-templates]"),
    ).toHaveAttribute(
      "data-final-access-confirm-templates",
      "registered_for_future_transition",
    );
    expect(
      container.querySelector("[data-final-metric='selection-feedback']"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".final-root-primary-action")).toBeNull();
  });

  it("preserva volver a Portada y ejecuta el reinicio allowlist real", async () => {
    const { container, rerender } = renderFinalRootScreen();

    expect(container.querySelector("[data-review-mode]")).toHaveAttribute(
      "data-review-mode",
      "final_review_context_single_activation",
    );
    expect(container.querySelector("[data-restart-mode]")).toHaveAttribute(
      "data-restart-mode",
      "allowlist_snapshot_rollback",
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    expect(container.querySelector("[data-final-state]")).toHaveAttribute(
      "data-final-state",
      "final_restart_confirm",
    );
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-panel-asset]")).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll("[data-panel-asset]"), (element) =>
        element.getAttribute("data-panel-asset"),
      ),
    ).toContain(finalRootAssets.ui.restartDialogBackplate);

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text,
      }),
    );
    expect(container.querySelector("[data-final-state]")).toHaveAttribute(
      "data-final-state",
      "final_restart",
    );
    expect(
      screen.queryByText(finalEditorialSlots.FINAL_RESTART_CONFIRM_01.text),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    ).toHaveFocus();

    window.localStorage.setItem("gvo.progress.v1", "progress");
    window.localStorage.setItem("gvo.station5.v1", "world-five");
    window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
    window.localStorage.setItem("preference.theme", "dark");
    window.sessionStorage.setItem("gvo.final.reviewContext.v1", "review");
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
        }),
      );
      await Promise.resolve();
    });
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );
    expect(window.localStorage.getItem("gvo.progress.v1")).toBeNull();
    expect(window.localStorage.getItem("gvo.station5.v1")).toBeNull();
    expect(
      window.localStorage.getItem("gvo.coverIntro.introCompleted.v1"),
    ).toBeNull();
    expect(window.localStorage.getItem("preference.theme")).toBe("dark");
    expect(
      window.sessionStorage.getItem("gvo.final.reviewContext.v1"),
    ).toBeNull();

    rerender(
      <MemoryRouter initialEntries={["/final"]}>
        <FinalRootScreen />
        <LocationProbe />
      </MemoryRouter>,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_BACK_HOME_01.text,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );
    expect(
      JSON.parse(
        window.sessionStorage.getItem("gvo.final.reviewContext.v1") ?? "null",
      ),
    ).toMatchObject({
      mode: "final-cover-revisit",
      origin: "/final",
      version: 1,
    });
  });

  it("expone busy accesible, deshabilita controles y bloquea doble ejecución", async () => {
    let resolveReset: (value: JourneyResetResult) => void = () => undefined;
    const resetJourney = vi.fn(
      () =>
        new Promise<JourneyResetResult>((resolve) => {
          resolveReset = resolve;
        }),
    );
    const { container } = renderFinalRootScreen({ resetJourney });

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    const confirm = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
    });
    fireEvent.click(confirm);
    fireEvent.click(confirm);

    expect(resetJourney).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-final-reset-state]")).toHaveAttribute(
      "data-final-reset-state",
      "busy",
    );
    expect(container.querySelector("[aria-busy='true']")).toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_BUSY_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
      }),
    ).toBeDisabled();

    await act(async () => {
      resolveReset({
        deleted: [],
        durationMs: 1,
        ok: true,
        snapshotCount: 4,
        verifiedInitialState: true,
      });
      await Promise.resolve();
    });
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );
  });

  it("muestra copy de conservación sólo con rollback verificado y reintenta con snapshot nuevo", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const resetJourney = vi
      .fn()
      .mockResolvedValueOnce({
        copySafe: true,
        durationMs: 2,
        errorCode: "delete_failed",
        failedStage: "delete",
        ok: false,
        rollbackAttempted: true,
        rollbackVerified: true,
        snapshotCount: 4,
        snapshotCreated: true,
      })
      .mockResolvedValueOnce({
        deleted: [],
        durationMs: 1,
        ok: true,
        snapshotCount: 4,
        verifiedInitialState: true,
      });
    const { container } = renderFinalRootScreen({ resetJourney });

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
        }),
      );
      await Promise.resolve();
    });

    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_ERROR_01.text),
    ).toBeInTheDocument();
    const retry = screen.getByRole("button", {
      name: finalEditorialSlots.FINAL_RESTART_RETRY_BTN_01.text,
    });
    expect(retry).toHaveFocus();
    expect(
      container.querySelector("[data-final-reset-copy-gap]"),
    ).toHaveAttribute("data-final-reset-copy-gap", "none");

    await act(async () => {
      fireEvent.click(retry);
      await Promise.resolve();
    });
    expect(resetJourney).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it("no muestra copy engañoso cuando rollback no queda verificado", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const resetJourney = vi.fn().mockResolvedValue({
      copySafe: false,
      durationMs: 2,
      errorCode: "rollback_failed",
      failedStage: "rollback",
      ok: false,
      rollbackAttempted: true,
      rollbackVerified: false,
      snapshotCount: 4,
      snapshotCreated: true,
    });
    const { container } = renderFinalRootScreen({ resetJourney });

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
        }),
      );
      await Promise.resolve();
    });

    expect(
      screen.queryByText(finalEditorialSlots.FINAL_RESTART_ERROR_01.text),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_RETRY_BTN_01.text),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-final-reset-copy-gap]"),
    ).toHaveAttribute(
      "data-final-reset-copy-gap",
      "GVO_FINAL_021O_ROLLBACK_COPY_GAP",
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent("/final");
  });

  it("sale de busy correctamente bajo React StrictMode", async () => {
    const resetJourney = vi.fn().mockResolvedValue({
      copySafe: true,
      durationMs: 2,
      errorCode: "delete_failed",
      failedStage: "delete",
      ok: false,
      rollbackAttempted: true,
      rollbackVerified: true,
      snapshotCount: 4,
      snapshotCreated: true,
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <StrictMode>
        <MemoryRouter initialEntries={["/final"]}>
          <FinalRootScreen resetJourney={resetJourney} />
          <LocationProbe />
        </MemoryRouter>
      </StrictMode>,
      { wrapper: ActiveFinalFixture },
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
        }),
      );
      await Promise.resolve();
    });

    expect(
      screen.getByText(finalEditorialSlots.FINAL_RESTART_ERROR_01.text),
    ).toBeInTheDocument();
  });

  it("no repite greeting por restart, resize, orientación o rerender", () => {
    const { container, rerender } = renderFinalRootScreen();
    const lia = container.querySelector("[data-lia-motion-phase]");

    act(() => vi.advanceTimersByTime(160));
    expect(lia).toHaveAttribute("data-lia-motion-phase", "greeting");
    expect(lia).toHaveAttribute("data-lia-motion-frame", "2");

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text,
      }),
    );
    act(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("orientationchange"));
    });
    rerender(
      <MemoryRouter initialEntries={["/final"]}>
        <FinalRootScreen />
        <LocationProbe />
      </MemoryRouter>,
    );

    expect(lia).toHaveAttribute("data-lia-motion-frame", "2");
    expect(lia).toHaveAttribute("data-lia-greeting-play-count", "1");
    for (let frame = 0; frame < 3; frame += 1) {
      act(() => vi.advanceTimersByTime(160));
    }
    expect(lia).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(lia).toHaveAttribute("data-lia-motion-frame", "1");

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    expect(lia).toHaveAttribute("data-lia-motion-phase", "idle");
    expect(lia).toHaveAttribute("data-lia-greeting-play-count", "1");
  });

  it("no añade medios, Mundo VI, permisos, red ni motion CSS externo", () => {
    const { container } = renderFinalRootScreen();

    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("alt", "");
      expect(image).toHaveAttribute("aria-hidden", "true");
    }
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container).not.toHaveTextContent(/Mundo VI/i);
    expect(container).not.toHaveTextContent(/sexta estación/i);
    expect(container).not.toHaveTextContent(/QR/i);
    expect(container).not.toHaveTextContent(/contador diario/i);
    expect(container.querySelector("[data-final-world-six]")).toHaveAttribute(
      "data-final-world-six",
      "blocked",
    );
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(
      container.querySelector("[data-sensitive-permissions]"),
    ).toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(finalRootCss).not.toMatch(
      /@keyframes|\banimation\s*:|\btransition\s*:/i,
    );
  });

  it("elige EN después de importar y vuelve a ES sin remontar Lía ni cambiar los accesos", () => {
    writeLanguagePreference("en");
    applyDocumentLanguage();
    const en = getFinalEditorialSlots("en");
    const { container, rerender } = renderFinalRootScreen();
    const lia = container.querySelector("[data-lia-motion-phase]");
    expect(document.documentElement.lang).toBe("en");
    expect(container.querySelector("[data-final-editorial-locale]")).toHaveAttribute("data-final-editorial-locale", "en");
    for (const id of ["FINAL_TITLE_01", "FINAL_SUBTITLE_01", "FINAL_LIA_MESSAGE_01", "FINAL_AMB_01", "FINAL_HELP_01", "FINAL_CREDITS_01", "FINAL_BACK_HOME_HELP_01"] as const) {
      expect(container.querySelector(`[data-final-slot-id="${id}"]`)).toHaveTextContent(en[id].text);
      expect(container.querySelector(`[data-final-slot-id="${id}"]`)).toHaveAttribute("data-editorial-status", "REVIEW");
    }
    expect(screen.getByLabelText(en.FINAL_ACCESSIBLE_SCENE_01.text)).toBeInTheDocument();
    for (const [roman, label] of [["I", "Root"], ["II", "Invisible pulse"], ["III", "Practice notebook"], ["IV", "Biosonic system"], ["V", "OKÚA, sensory art"]] as const) {
      const accessible = en[`FINAL_ACCESSIBLE_ACCESS_${roman}_01`];
      expect(screen.getByRole("link", { name: accessible.text })).toHaveTextContent(label);
      expect(container.querySelector(`[data-final-slot-id="FINAL_ACCESS_${roman}_CONFIRM_01"]`)).toHaveTextContent(en[`FINAL_ACCESS_${roman}_CONFIRM_01`].text);
    }
    expect(container.querySelector("[data-final-access-confirm-templates]")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: en.FINAL_ACCESSIBLE_BACK_HOME_01.text })).toHaveTextContent("Back to home");
    expect(screen.getByRole("button", { name: en.FINAL_ACCESSIBLE_RESTART_01.text })).toHaveTextContent("Restart tour");
    const routes = Array.from(container.querySelectorAll("a[data-final-access-id]"), (link) => link.getAttribute("href"));
    writeLanguagePreference("es");
    applyDocumentLanguage();
    rerender(<MemoryRouter initialEntries={["/final"]}><FinalRootScreen /><LocationProbe /></MemoryRouter>);
    expect(container.querySelector("[data-lia-motion-phase]")).toBe(lia);
    expect(container.querySelector("[data-final-editorial-locale]")).toHaveAttribute("data-final-editorial-locale", "es");
    expect(document.documentElement.lang).toBe("es");
    expect(screen.getByText(finalEditorialSlots.FINAL_CREDITS_01.text)).toBeInTheDocument();
    expect(Array.from(container.querySelectorAll("a[data-final-access-id]"), (link) => link.getAttribute("href"))).toEqual(routes);
  });

  it("mantiene suspendidos el greeting y el foco cuando el consumidor aún no está activado", () => {
    const { container } = render(<MemoryRouter initialEntries={["/final"]}><FinalRootScreen /></MemoryRouter>);
    const lia = container.querySelector("[data-lia-motion-phase]");
    act(() => vi.advanceTimersByTime(640));
    expect(lia).toHaveAttribute("data-lia-motion-phase", "greeting");
    expect(lia).toHaveAttribute("data-lia-motion-frame", "1");
    fireEvent.click(screen.getByRole("button", { name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text }));
    expect(screen.getByRole("button", { name: finalEditorialSlots.FINAL_RESTART_CANCEL_BTN_01.text })).not.toHaveFocus();
  });

  it.each([true, false])("localiza busy/error/retry EN y conserva la condición copySafe=%s", async (copySafe) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    writeLanguagePreference("en");
    const en = getFinalEditorialSlots("en");
    let finish!: (result: JourneyResetResult) => void;
    const resetJourney = vi.fn().mockImplementationOnce(() => new Promise<JourneyResetResult>((resolve) => { finish = resolve; })).mockResolvedValueOnce({ deleted: [], durationMs: 1, ok: true, snapshotCount: 0, verifiedInitialState: true });
    const { container } = renderFinalRootScreen({ resetJourney });
    fireEvent.click(screen.getByRole("button", { name: en.FINAL_ACCESSIBLE_RESTART_01.text }));
    expect(screen.getByLabelText(en.FINAL_RESTART_CONFIRM_01.text)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: en.FINAL_RESTART_CONFIRM_BTN_01.text }));
    expect(screen.getByText(en.FINAL_RESTART_BUSY_01.text)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await act(async () => { finish({ copySafe, durationMs: 1, errorCode: "rollback_failed", failedStage: "rollback", ok: false, rollbackAttempted: true, rollbackVerified: copySafe, snapshotCount: 1, snapshotCreated: true }); await Promise.resolve(); });
    expect(container.querySelector('[data-final-slot-id="FINAL_RESTART_ERROR_01"]') !== null).toBe(copySafe);
    if (copySafe) expect(screen.getByRole("status")).toHaveTextContent(en.FINAL_RESTART_ERROR_01.text);
    else expect(container).not.toHaveTextContent("Your progress was preserved");
    const retry = screen.getByRole("button", { name: "Retry" });
    expect(retry).toHaveAttribute("data-editorial-status", "REVIEW");
    await act(async () => { fireEvent.click(retry); await Promise.resolve(); });
    expect(resetJourney).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("current-location")).toHaveTextContent("/portada");
  });
});
