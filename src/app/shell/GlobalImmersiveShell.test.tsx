import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GVO_LANGUAGE_STORAGE_KEY } from "../preferences/languagePreference";
import {
  GlobalImmersiveShell,
  isImmersiveShellAuthorizedPath,
} from "./GlobalImmersiveShell";

// This suite isolates the shell's fullscreen policy. The actual entry resource
// host and route preparation have dedicated unit and compiled-browser suites.
vi.mock("../journey/JourneyPreparation", () => ({
  JourneyPreparation: ({ children }: { children: ReactNode }) => children,
}));

function installFullscreenSupport() {
  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    value: null,
  });
  Object.defineProperty(document.documentElement, "requestFullscreen", {
    configurable: true,
    value: async () => undefined,
  });
  Object.defineProperty(document, "exitFullscreen", {
    configurable: true,
    value: async () => undefined,
  });
}

function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route element={<GlobalImmersiveShell />}>
          <Route path="*" element={<main>Contenido</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.lang = "es";
  Reflect.deleteProperty(document, "fullscreenEnabled");
  Reflect.deleteProperty(document, "fullscreenElement");
  Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  Reflect.deleteProperty(document, "exitFullscreen");
});

describe("GlobalImmersiveShell", () => {
  it("authorizes Cover, Final and every real station route", () => {
    for (const pathname of [
      "/portada",
      "/estacion/1",
      "/estacion/2/",
      "/estacion/3",
      "/estacion/4",
      "/estacion/5",
      "/estacion/5/plantas",
      "/estacion/5/sistema",
      "/estacion/5/espacio",
      "/estacion/5/visitante/",
      "/final",
    ]) {
      expect(isImmersiveShellAuthorizedPath(pathname)).toBe(true);
    }

    for (const pathname of [
      "/",
      "/carga",
      "/inicio",
      "/transition/world-1-to-world-2",
      "/qr/2",
      "/estacion/6",
      "/dev/transition-world",
    ]) {
      expect(isImmersiveShellAuthorizedPath(pathname)).toBe(false);
    }
  });

  it("renders one shared native control in an authorized route", () => {
    installFullscreenSupport();
    const { container } = renderAt("/estacion/3");

    expect(container.firstElementChild).toHaveAttribute(
      "data-gvo-immersive-shell",
      "active",
    );
    expect(
      screen.getByRole("button", { name: "Activar pantalla completa" }),
    ).toHaveAttribute("data-gvo-immersive-control", "fullscreen");
    expect(
      screen.getByRole("group", { name: "Control de visualización" }),
    ).toHaveAttribute("data-gvo-immersive-safe-area", "top-inline-end");
  });

  it("keeps /inicio on its approved local CTA without a shell duplicate", () => {
    installFullscreenSupport();
    const { container } = renderAt("/inicio");

    expect(container.firstElementChild).toHaveAttribute(
      "data-gvo-immersive-shell",
      "inactive",
    );
    expect(
      screen.queryByRole("button", { name: "Activar pantalla completa" }),
    ).not.toBeInTheDocument();
  });

  it("renders exactly one global control on Cover and Final", () => {
    installFullscreenSupport();

    for (const pathname of ["/portada", "/final"]) {
      const rendered = renderAt(pathname);
      expect(
        rendered.container.querySelectorAll(
          '[data-gvo-immersive-control="fullscreen"]',
        ),
      ).toHaveLength(1);
      rendered.unmount();
    }
  });

  it("renders zero global controls and no dock when the platform has no API", () => {
    const { container } = renderAt("/portada");

    expect(
      container.querySelectorAll("[data-gvo-immersive-control='fullscreen']"),
    ).toHaveLength(0);
    expect(
      container.querySelector("[data-gvo-immersive-safe-area]"),
    ).not.toBeInTheDocument();
  });

  it("aplica la preferencia de idioma persistida al shell completo", () => {
    installFullscreenSupport();
    localStorage.setItem(GVO_LANGUAGE_STORAGE_KEY, "en");

    renderAt("/estacion/1");

    expect(document.documentElement.lang).toBe("en");
    const group = screen.getByRole("group", { name: "Display controls" });
    expect(within(group).getByRole("button", { name: "Enter fullscreen" })).toHaveAttribute("data-gvo-immersive-control", "fullscreen");
    expect(screen.queryByRole("group", { name: "Control de visualización" })).not.toBeInTheDocument();
  });
});
