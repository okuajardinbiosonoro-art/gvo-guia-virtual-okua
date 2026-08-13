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

function installFullscreenStub() {
  let fullscreenElement: Element | null = null;
  const requestFullscreen = vi.fn(async () => {
    fullscreenElement = document.documentElement;
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
  Object.defineProperty(navigator, "userActivation", {
    configurable: true,
    value: { isActive: true },
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
  Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  Reflect.deleteProperty(navigator, "userActivation");
  vi.restoreAllMocks();
});

describe("InitialExperienceScreen", () => {
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

  it("solicita fullscreen sólo desde el botón nativo explícito", async () => {
    const requestFullscreen = installFullscreenStub();
    renderScreen();

    expect(requestFullscreen).not.toHaveBeenCalled();
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

  it("mantiene la entrada disponible si fullscreen o persistencia fallan", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    renderScreen();

    expect(
      screen.getByRole("button", { name: "Pantalla completa / Fullscreen" }),
    ).toBeDisabled();
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
