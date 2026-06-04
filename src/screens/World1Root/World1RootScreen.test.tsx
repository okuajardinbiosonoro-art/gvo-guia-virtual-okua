import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { World1RootScreen } from "./World1RootScreen";
import { world1RootAssets } from "./world1RootAssets";

describe("World1RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza la base estatica de Mundo I con textos DOM y assets reales", () => {
    const { container } = render(<World1RootScreen />);

    expect(
      screen.getByRole("heading", {
        name: "Antes de escuchar, necesitamos aprender a mirar.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("RELACIÓN")).toBeInTheDocument();
    expect(screen.getByText("PERCEPCIÓN")).toBeInTheDocument();
    expect(screen.getByText("MEDIACIÓN")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continuar" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toHaveAttribute("src", world1RootAssets.liaIdle);

    for (const asset of Object.values(world1RootAssets)) {
      expect(asset).toMatch(/^\/assets\/gvo\/stations\/world-1-root\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.background}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.ambientLight}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.plant}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.rootsBase}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        `[data-runtime-asset="${world1RootAssets.nodeKit}"]`,
      ),
    ).toHaveLength(3);
  });

  it("no renderiza assets futuros, controles interactivos ni medios runtime", () => {
    const { container } = render(<World1RootScreen />);

    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeRelation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activePerception}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.activeMediation}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${world1RootAssets.exitPath}"]`,
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
  });

  it("mantiene el boton Continuar sin navegacion ni handler", () => {
    render(<World1RootScreen />);

    const button = screen.getByRole("button", { name: "Continuar" });

    expect(button).toBeDisabled();
    expect((button as HTMLButtonElement).onclick).toBeNull();
  });
});
