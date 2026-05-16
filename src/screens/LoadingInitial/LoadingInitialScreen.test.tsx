import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LoadingInitialScreen } from "./LoadingInitialScreen";
import { loadingInitialAssets } from "./loadingInitialAssets";
import { loadingInitialCopy } from "./loadingInitialCopy";

describe("LoadingInitialScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza texto principal, subtitulo y barra de carga", () => {
    render(<LoadingInitialScreen />);

    expect(
      screen.getByRole("heading", { name: loadingInitialCopy.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(loadingInitialCopy.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: loadingInitialCopy.title,
      }),
    ).toBeInTheDocument();
  });

  it("renderiza escena animada con assets runtime locales", () => {
    const { container } = render(<LoadingInitialScreen />);
    const scene = screen.getByTestId("loading-initial-animated-scene");

    expect(scene).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.lia.src}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.plant.src}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${loadingInitialAssets.water.src}"]`,
      ),
    ).toBeInTheDocument();

    for (const asset of [
      loadingInitialAssets.lia.src,
      loadingInitialAssets.plant.src,
      loadingInitialAssets.water.src,
      ...loadingInitialAssets.sparkles.map((sparkle) => sparkle.src),
      loadingInitialAssets.ground.src,
    ]) {
      expect(asset).toMatch(/^\/assets\/runtime\/loading-initial\//);
      expect(asset).not.toMatch(/^https?:\/\//);
    }
  });

  it("no renderiza texto largo rechazado ni controles fuera de alcance", () => {
    const { container } = render(<LoadingInitialScreen />);
    const rejectedCopyParts = ["Lía cuida", "planta joven", "mientras se"];

    expect(
      screen.queryByText((content) =>
        rejectedCopyParts.every((part) => content.includes(part)),
      ),
    ).not.toBeInTheDocument();
    expect(container.querySelector("button")).not.toBeInTheDocument();
    expect(container.querySelector("audio")).not.toBeInTheDocument();
    expect(container.querySelector("video")).not.toBeInTheDocument();
  });

  it("conecta aria-labelledby y aria-describedby a los textos aprobados", () => {
    render(<LoadingInitialScreen />);

    const main = screen.getByRole("main");
    const title = screen.getByRole("heading", {
      name: loadingInitialCopy.title,
    });
    const subtitle = screen.getByText(loadingInitialCopy.subtitle);

    expect(main).toHaveAttribute("aria-labelledby", title.id);
    expect(main).toHaveAttribute("aria-describedby", subtitle.id);
    expect(subtitle).toHaveAttribute("id", "loading-initial-description");
  });
});
