import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  FINAL_OPERATIONAL_SLOT_COUNT,
  FINAL_REQUIRED_SLOT_COUNT,
  finalEditorialSlots,
} from "../../content/finalEditorialSlots";
import { finalRootAssets } from "../../shared/assets/finalRootAssets";
import finalRootCss from "./FinalRootScreen.css?raw";
import { FinalRootScreen } from "./FinalRootScreen";

function LocationProbe() {
  const location = useLocation();

  return <span data-testid="current-location">{location.pathname}</span>;
}

function renderFinalRootScreen() {
  return render(
    <MemoryRouter initialEntries={["/final"]}>
      <FinalRootScreen />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe("FinalRootScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
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

  it("mantiene los 35 slots finales, un h1 y cinco operativos sin consumo", () => {
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
          slot.status === "FINAL" &&
          slot.source === "human_approved" &&
          slot.locale === "es" &&
          !slot.text.startsWith("TEMP"),
      ),
    ).toBe(true);
    expect(
      container.querySelectorAll('[data-editorial-status="TEMP"]'),
    ).toHaveLength(0);
    expect(
      container.querySelector("[data-final-operational-slots]"),
    ).toHaveAttribute(
      "data-final-operational-slots",
      "registered_not_consumed",
    );
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

    for (const access of ["I", "II", "III", "IV", "V"]) {
      expect(screen.getByText(new RegExp(`^${access} —`))).toBeInTheDocument();
    }
    const credits = container.querySelector(
      '[data-final-slot-id="FINAL_CREDITS_01"]',
    );
    expect(credits).toHaveTextContent("Desarrollado por Momotto S.A.S.");
    expect(credits).toHaveTextContent("A cargo del Ing. José David P. Z.");
    expect(credits?.querySelector("br")).toBeInTheDocument();
  });

  it("navega a cada Mundo con un Link y una sola activación", () => {
    const { container } = renderFinalRootScreen();
    const lia = container.querySelector("[data-lia-motion-phase]");
    const accessExpectations = [
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_I_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_I_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_I_LABEL_01.text,
        route: "/estacion/1",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_II_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_II_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_II_LABEL_01.text,
        route: "/estacion/2",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_III_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_III_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_III_LABEL_01.text,
        route: "/estacion/3",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_IV_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_IV_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_IV_LABEL_01.text,
        route: "/estacion/4",
      },
      {
        accessible: finalEditorialSlots.FINAL_ACCESSIBLE_ACCESS_V_01.text,
        confirm: finalEditorialSlots.FINAL_ACCESS_V_CONFIRM_01.text,
        label: finalEditorialSlots.FINAL_ACCESS_V_LABEL_01.text,
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

  it("conserva volver y reiniciar como navegación sin limpieza", () => {
    const { container, rerender } = renderFinalRootScreen();

    expect(container.querySelector("[data-review-mode]")).toHaveAttribute(
      "data-review-mode",
      "direct_link_single_activation",
    );
    expect(container.querySelector("[data-restart-mode]")).toHaveAttribute(
      "data-restart-mode",
      "navigation_only_no_global_cleanup",
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

    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_ACCESSIBLE_RESTART_01.text,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: finalEditorialSlots.FINAL_RESTART_CONFIRM_BTN_01.text,
      }),
    );
    expect(screen.getByTestId("current-location")).toHaveTextContent(
      "/portada",
    );

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
});
