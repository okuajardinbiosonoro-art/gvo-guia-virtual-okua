import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  WORLD4_REQUIRED_SLOT_COUNT,
  world4EditorialSlots,
  world4NodeDefinitions,
  world4TechnicalNodes,
} from "../../content/world4EditorialSlots";
import { World4RootScreen } from "./World4RootScreen";

describe("World4RootScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renderiza Mundo IV temporal con 40 slots editoriales y sin permisos sensibles", () => {
    const { container } = render(<World4RootScreen />);

    expect(
      screen.getByRole("heading", { name: "Mundo IV: Mesa de Sistema" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Estación IV temporal")).toBeInTheDocument();
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
      WORLD4_REQUIRED_SLOT_COUNT,
    );
    expect(
      Object.values(world4EditorialSlots).every((slot) => slot.status === "TEMP"),
    ).toBe(true);
    expect(container.querySelector("[data-world4-experience]")).toHaveAttribute(
      "data-world4-experience",
      "temporary",
    );
    expect(container.querySelector("[data-world4-state]")).toHaveAttribute(
      "data-world4-state",
      "intro",
    );
    expect(container.querySelector("[data-world4-slot-count]")).toHaveAttribute(
      "data-world4-slot-count",
      String(WORLD4_REQUIRED_SLOT_COUNT),
    );
    expect(container.querySelector("[data-world4-full-experience]"))
      .toHaveAttribute("data-world4-full-experience", "temporary_complete");
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

  it("avanza por los nodos en orden, permite relectura y llega a ready_to_continue", () => {
    const { container } = render(<World4RootScreen />);
    const getState = () =>
      container
        .querySelector("[data-world4-state]")
        ?.getAttribute("data-world4-state");

    fireEvent.click(screen.getByRole("button", { name: "Iniciar mesa temporal" }));
    expect(getState()).toBe("planta");
    expect(
      container.querySelector('[data-world4-node="bionosificador"]'),
    ).toHaveAttribute("data-node-state", "locked");

    for (const [index, node] of world4NodeDefinitions.entries()) {
      expect(getState()).toBe(node.id);
      expect(
        screen.getByText(world4EditorialSlots[node.hintSlot].text),
      ).toBeInTheDocument();
      expect(
        screen.getByText(world4EditorialSlots[node.cardSlot].text),
      ).toBeInTheDocument();

      if (index === 1) {
        fireEvent.click(
          container.querySelector(
            '[data-world4-node="planta"]',
          ) as HTMLButtonElement,
        );
        expect(
          screen.getByText(world4EditorialSlots.W4_NODE_REPEAT_01.text),
        ).toBeInTheDocument();
        expect(getState()).toBe("bionosificador");
        fireEvent.click(
          container.querySelector(
            '[data-world4-node="bionosificador"]',
          ) as HTMLButtonElement,
        );
      }

      fireEvent.click(screen.getByText(world4EditorialSlots[node.confirmSlot].text));
    }

    expect(getState()).toBe("ready_to_continue");
    expect(
      screen.getByText(world4EditorialSlots.W4_COMPLETE_LIA_01.text),
    ).toBeInTheDocument();
    expect(
      screen.getByText(world4EditorialSlots.W4_COMPLETE_SYS_01.text),
    ).toBeInTheDocument();
    expect(container.querySelector("[data-world4-exit-target]")).toHaveAttribute(
      "data-world4-exit-target",
      "/transition/world-4-to-world-5",
    );
    expect(container.querySelector("[data-world4-exit-mode]")).toHaveAttribute(
      "data-world4-exit-mode",
      "prepared_no_navigation",
    );
    fireEvent.click(
      container.querySelector('[data-world4-node="planta"]') as HTMLButtonElement,
    );
    expect(
      screen.getByText(world4EditorialSlots.W4_NODE_REPEAT_01.text),
    ).toBeInTheDocument();

    const continueButton = screen.getByRole("button", {
      name: world4EditorialSlots.W4_CONTINUE_BTN_01.text,
    });

    expect(continueButton).toHaveAttribute(
      "data-world4-exit-action",
      "prepared_for_011b",
    );
    fireEvent.click(continueButton);
    expect(
      screen.getByText(
        "Continuidad registrada: falta ticket específico para transición W4→W5.",
      ),
    ).toBeInTheDocument();
  });

  it("preserva los ocho nodos tecnicos protegidos y no usa medios", () => {
    const { container } = render(<World4RootScreen />);

    expect(
      screen
        .getAllByTestId("world4-technical-node")
        .map((node) => node.getAttribute("data-world4-technical-node")),
    ).toEqual([...world4TechnicalNodes]);
    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(container.querySelectorAll("audio")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelectorAll("canvas")).toHaveLength(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });
});
