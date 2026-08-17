import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GVO_LANGUAGE_STORAGE_KEY } from "../../app/preferences/languagePreference";
import {
  entryCoverBackdropAsset,
  entryCoverStationAssets,
} from "../../shared/assets/entryCoverAssets";
import { InitialExperienceScreen } from "./InitialExperienceScreen";

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/inicio"]}>
      <Routes>
        <Route path="/inicio" element={<InitialExperienceScreen />} />
        <Route path="/portada" element={<main>Portada alcanzada</main>} />
      </Routes>
    </MemoryRouter>,
  );
}

function installFullscreenStub({
  policyAllowsFullscreen,
  rejectRequest = false,
  userActivation = false,
}: {
  policyAllowsFullscreen?: boolean;
  rejectRequest?: boolean;
  userActivation?: boolean;
} = {}) {
  let fullscreenElement: Element | null = null;
  const requestFullscreen = vi.fn(async () => {
    if (rejectRequest) {
      throw new DOMException("Denied by test stub", "NotAllowedError");
    }
    fullscreenElement = document.documentElement;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  const exitFullscreen = vi.fn(async () => {
    fullscreenElement = null;
    document.dispatchEvent(new Event("fullscreenchange"));
  });

  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    get: () => fullscreenElement,
  });
  Object.defineProperty(document.documentElement, "requestFullscreen", {
    configurable: true,
    value: requestFullscreen,
  });
  Object.defineProperty(document, "exitFullscreen", {
    configurable: true,
    value: exitFullscreen,
  });
  Object.defineProperty(document, "featurePolicy", {
    configurable: true,
    value:
      policyAllowsFullscreen === undefined
        ? undefined
        : { allowsFeature: vi.fn(() => policyAllowsFullscreen) },
  });
  Object.defineProperty(navigator, "userActivation", {
    configurable: true,
    value: { isActive: userActivation, hasBeenActive: userActivation },
  });

  return requestFullscreen;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "es";
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "fullscreenEnabled");
  Reflect.deleteProperty(document, "fullscreenElement");
  Reflect.deleteProperty(document, "exitFullscreen");
  Reflect.deleteProperty(document, "featurePolicy");
  Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  Reflect.deleteProperty(navigator, "userActivation");
  vi.restoreAllMocks();
});

describe("InitialExperienceScreen", () => {
  it("integra el fondo aprobado y las cinco estaciones como decoración local", () => {
    const { container } = renderScreen();

    expect(container.querySelector("[data-initial-experience-visual='debt-013']"))
      .toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${entryCoverBackdropAsset}"]`,
      ),
    ).toBeInTheDocument();

    const stationAssets = container.querySelectorAll(
      "[data-entry-cover-station-asset]",
    );
    expect(stationAssets).toHaveLength(5);
    expect(
      Array.from(stationAssets).map((asset) =>
        asset.getAttribute("data-runtime-asset"),
      ),
    ).toEqual(entryCoverStationAssets.map((asset) => asset.src));
    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("exige selección explícita y enfoca el encabezado al entrar", () => {
    renderScreen();

    const heading = screen.getByRole("heading", {
      name: "Selecciona tu idioma / Choose your language",
    });
    expect(heading).toHaveFocus();
    expect(
      screen.getByRole("button", { name: "Iniciar / Start" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Español" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("guarda English, actualiza lang y entra a Portada sin mutar progreso", () => {
    localStorage.setItem("gvo.progress.v1", "progress-sentinel");
    renderScreen();

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(localStorage.getItem(GVO_LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("button", { name: "Start journey" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Start journey" }));
    expect(screen.getByText("Portada alcanzada")).toBeInTheDocument();
    expect(localStorage.getItem("gvo.progress.v1")).toBe("progress-sentinel");
  });

  it("restaura la selección persistida en una nueva instancia", () => {
    localStorage.setItem(GVO_LANGUAGE_STORAGE_KEY, "en");
    renderScreen();

    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Start journey" })).toBeEnabled();
    expect(document.documentElement.lang).toBe("en");
  });

  it("mantiene el botón habilitado antes del gesto y solicita fullscreen desde su click", async () => {
    const requestFullscreen = installFullscreenStub({ userActivation: false });
    renderScreen();

    expect(requestFullscreen).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Pantalla completa / Fullscreen" }),
    ).toBeEnabled();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Pantalla completa / Fullscreen" }),
      );
    });

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Pantalla completa / Fullscreen" }),
      ).toHaveAttribute("aria-pressed", "true"),
    );
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("distingue policy bloqueada de API ausente sin bloquear el recorrido", () => {
    installFullscreenStub({ policyAllowsFullscreen: false });
    renderScreen();
    fireEvent.click(screen.getByRole("button", { name: "Español" }));

    expect(
      screen.getByRole("button", { name: "Activar pantalla completa" }),
    ).toBeDisabled();
    expect(
      screen.getByText(
        "Este contexto bloquea la pantalla completa. Abre GVO directamente en el navegador.",
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-initial-experience]"),
    ).toHaveAttribute("data-initial-fullscreen-state", "blocked");
  });

  it("sustituye una API ausente por fallback honesto y mantiene el CTA disponible", () => {
    renderScreen();

    expect(
      screen.queryByRole("button", {
        name: "Pantalla completa / Fullscreen",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "La vista de navegador ya está optimizada para este dispositivo. / The browser view is already optimized for this device.",
      ),
    ).toHaveAttribute(
      "data-initial-immersive-fallback",
      "browser-optimized",
    );

    fireEvent.click(screen.getByRole("button", { name: "Español" }));
    expect(
      screen.getByText(
        "La vista de navegador ya está optimizada para este dispositivo.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
    expect(document.querySelector("[data-initial-experience]"))
      .toHaveAttribute(
        "data-gvo-fullscreen-capability",
        "unavailable-on-platform",
      );
  });

  it("mantiene Iniciar recorrido disponible si la solicitud se rechaza", async () => {
    installFullscreenStub({ rejectRequest: true });
    renderScreen();
    fireEvent.click(screen.getByRole("button", { name: "Español" }));

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Activar pantalla completa" }),
      );
    });

    await waitFor(() =>
      expect(
        document.querySelector("[data-initial-experience]"),
      ).toHaveAttribute("data-initial-fullscreen-state", "error"),
    );
    expect(
      screen.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
  });

  it("mantiene la entrada disponible si fullscreen o persistencia fallan", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    renderScreen();

    expect(
      screen.queryByRole("button", {
        name: "Pantalla completa / Fullscreen",
      }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Español" }));

    expect(screen.getByRole("status")).toHaveAttribute(
      "data-language-persistence-status",
      "memory-only",
    );
    expect(
      screen.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
  });
});
