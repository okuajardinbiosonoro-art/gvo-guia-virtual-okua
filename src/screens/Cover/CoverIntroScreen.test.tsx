import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CoverIntroScreen } from "./CoverIntroScreen";
import { coverIntroAssets } from "./coverIntroAssets";
import { coverIntroPortals, coverIntroText } from "./coverIntroContent";

describe("CoverIntroScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza textos DOM principales y botón de inicio", () => {
    render(<CoverIntroScreen />);

    expect(screen.getByText(coverIntroText.logo)).toBeInTheDocument();
    expect(screen.getByText(coverIntroText.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: coverIntroText.archiveTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: coverIntroText.cta }),
    ).toBeInTheDocument();
  });

  it("renderiza cinco portales con Portal I disponible y II-V bloqueados", () => {
    const { container } = render(<CoverIntroScreen />);

    expect(container.querySelectorAll("[data-portal-id]")).toHaveLength(5);
    expect(
      screen.getByRole("button", {
        name: "Estación I, Mundo Raíz, disponible.",
      }),
    ).toHaveAttribute("data-portal-state", "available");

    for (const portal of coverIntroPortals.slice(1)) {
      expect(
        screen.getByRole("button", { name: portal.ariaLabel }),
      ).toHaveAttribute("aria-disabled", "true");
      expect(
        screen.getByRole("button", { name: portal.ariaLabel }),
      ).toHaveAttribute("data-portal-state", "locked");
    }
  });

  it("usa assets locales staged de cover-intro", () => {
    const { container } = render(<CoverIntroScreen />);

    for (const asset of Object.values(coverIntroAssets)) {
      expect(asset).toMatch(/^\/assets\/runtime\/cover-intro\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }

    expect(
      container.querySelector(
        `[data-runtime-asset="${coverIntroAssets.liaIdle}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${coverIntroAssets.portal1Frame}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll(
        `[data-runtime-asset="${coverIntroAssets.lock}"]`,
      ),
    ).toHaveLength(4);
  });

  it("renderiza números romanos como contenido DOM", () => {
    render(<CoverIntroScreen />);

    for (const portal of coverIntroPortals) {
      expect(screen.getByText(portal.roman)).toBeInTheDocument();
    }
  });

  it("no renderiza audio, video ni navegación fuera del alcance 002D", () => {
    const { container } = render(<CoverIntroScreen />);

    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });
});
