import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GVO_LANGUAGE_STORAGE_KEY } from "../preferences/languagePreference";
import {
  GlobalImmersiveShell,
  isImmersiveShellAuthorizedPath,
} from "./GlobalImmersiveShell";

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
});

describe("GlobalImmersiveShell", () => {
  it("authorizes only the real station routes, including trailing slashes", () => {
    for (const pathname of [
      "/estacion/1",
      "/estacion/2/",
      "/estacion/3",
      "/estacion/4",
      "/estacion/5",
      "/estacion/5/plantas",
      "/estacion/5/sistema",
      "/estacion/5/espacio",
      "/estacion/5/visitante/",
    ]) {
      expect(isImmersiveShellAuthorizedPath(pathname)).toBe(true);
    }

    for (const pathname of [
      "/",
      "/carga",
      "/inicio",
      "/portada",
      "/transition/world-1-to-world-2",
      "/final",
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

  it("removes the control outside an authorized route", () => {
    installFullscreenSupport();
    const { container } = renderAt("/final");

    expect(container.firstElementChild).toHaveAttribute(
      "data-gvo-immersive-shell",
      "inactive",
    );
    expect(
      screen.queryByRole("button", { name: "Activar pantalla completa" }),
    ).not.toBeInTheDocument();
  });

  it("aplica la preferencia de idioma persistida al shell completo", () => {
    localStorage.setItem(GVO_LANGUAGE_STORAGE_KEY, "en");

    renderAt("/estacion/1");

    expect(document.documentElement.lang).toBe("en");
  });
});
