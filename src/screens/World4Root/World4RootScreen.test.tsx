import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD4_BASE_SLOT_COUNT,
  world4EditorialSlots,
  world4TechnicalNodes,
} from "../../content/world4EditorialSlots";
import { World4RootScreen } from "./World4RootScreen";

describe("World4RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza entrada base de Mundo IV con tres slots temporales", () => {
    const { container } = render(<World4RootScreen />);

    expect(
      screen.getByRole("heading", { name: "Mundo IV: Mesa de Sistema" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación IV en preparación")).toBeInTheDocument();
    expect(
      screen.getByText(world4EditorialSlots.W4_INTRO_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world4EditorialSlots.W4_INTRO_SYS_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(world4EditorialSlots.W4_ACCESSIBLE_SCENE_01.text),
    ).toBeInTheDocument();
    expect(Object.keys(world4EditorialSlots)).toHaveLength(
      WORLD4_BASE_SLOT_COUNT,
    );
    expect(
      Object.values(world4EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world4-experience]")).toHaveAttribute(
      "data-world4-experience",
      "base_entry",
    );
    expect(container.querySelector("[data-world4-state]")).toHaveAttribute(
      "data-world4-state",
      "entry_preliminary",
    );
    expect(container.querySelector("[data-world4-slot-count]")).toHaveAttribute(
      "data-world4-slot-count",
      String(WORLD4_BASE_SLOT_COUNT),
    );
    expect(container.querySelector("[data-world4-full-experience]"))
      .toHaveAttribute("data-world4-full-experience", "not_implemented");
    expect(container.querySelector("[data-sensitive-permissions]"))
      .toHaveAttribute("data-sensitive-permissions", "blocked");
    expect(container.querySelector("[data-qr-camera]")).toHaveAttribute(
      "data-qr-camera",
      "blocked",
    );
    expect(container.querySelector("[data-daily-counter]")).toHaveAttribute(
      "data-daily-counter",
      "not_implemented",
    );
  });

  it("preserva los ocho nodos tecnicos protegidos y no usa medios", () => {
    const { container } = render(<World4RootScreen />);

    expect(
      screen.getAllByTestId("world4-technical-node").map((node) => node.textContent),
    ).toEqual(
      world4TechnicalNodes.map((node, index) =>
        `${String(index + 1).padStart(2, "0")}${node}`,
      ),
    );
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });
});
