import { act, cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { World2MappingPanel } from "./World2MappingPanel";

describe("World2MappingPanel 016U", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("presenta una sola relación y avanza automáticamente por los tres mapeos", () => {
    vi.useFakeTimers();
    const onFirstRunComplete = vi.fn();
    function Harness() {
      const [complete, setComplete] = useState(false);
      return (
        <World2MappingPanel
          cleanSignalAsset="/clean-signal.png"
          firstRunComplete={complete}
          onFirstRunComplete={() => {
            onFirstRunComplete();
            setComplete(true);
          }}
        />
      );
    }
    const { container } = render(
      <Harness />,
    );
    const panel = screen.getByRole("group", {
      name: "Mapeo secuencial: un rasgo de la señal se interpreta como un parámetro sonoro",
    });

    expect(panel).toHaveAttribute(
      "data-world2-mapping-mode",
      "sequential-pedagogic-r2",
    );
    expect(panel).toHaveAttribute("data-mapping-pedagogy", "016U-R5");
    expect(panel).toHaveAttribute(
      "data-world2-mapping-layout",
      "full-width-horizontal",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-composition-centered",
      "true",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-support-copy-animation",
      "consistent-restarting-double-pulse-glow",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-parameter-polish",
      "restored-centered-circular",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-support-copy-min-scale",
      "1",
    );
    expect(panel).toHaveAttribute("data-world2-mapping-lia-role", "guide");
    expect(panel).toHaveAttribute("data-world2-mapping-step-count", "3");
    expect(panel).toHaveAttribute("data-world2-mapping-step", "1");
    expect(panel).toHaveAttribute(
      "data-world2-mapping-relation",
      "amplitude-intensity",
    );
    expect(screen.getByText("AMPLITUD")).toBeInTheDocument();
    expect(screen.getByText("INTENSIDAD")).toBeInTheDocument();
    const step1Copy = screen.getByText("Más fuerza, más intensidad.");
    expect(step1Copy.parentElement).toHaveAttribute(
      "data-world2-mapping-support-copy-relation",
      "amplitude-intensity",
    );
    expect(
      container.querySelectorAll("[data-mapping-active-relation]"),
    ).toHaveLength(1);
    expect(panel).toHaveAttribute("data-world2-mapping-first-run", "active");
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "review");
    const reviewButtons = screen.getAllByRole("button", { name: /^Revisar relación/ });
    expect(reviewButtons).toHaveLength(3);
    reviewButtons.forEach((button) => expect(button).toBeEnabled());
    expect(
      container.querySelector(".world2-mapping-sequence__feature-scan"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-feature-accent="amplitud"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-mapping-parameter-visual="intensity-bars"]',
      ),
    ).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3200));
    expect(panel).toHaveAttribute("data-world2-mapping-step", "2");
    const step2Copy = screen.getByText("El cambio organiza el ritmo.");
    expect(step2Copy).not.toBe(step1Copy);
    expect(step2Copy.parentElement).toHaveAttribute(
      "data-world2-mapping-support-copy-relation",
      "variation-rhythm",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-relation",
      "variation-rhythm",
    );
    expect(
      container.querySelector(
        '[data-mapping-parameter-visual="accented-beat-sequence"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-feature-accent="variacion"]'),
    ).toBeInTheDocument();
    reviewButtons.forEach((button) => expect(button).toBeEnabled());

    act(() => vi.advanceTimersByTime(3200));
    expect(panel).toHaveAttribute("data-world2-mapping-step", "3");
    const step3Copy = screen.getByText("El rango orienta la altura.");
    expect(step3Copy).not.toBe(step2Copy);
    expect(step3Copy.parentElement).toHaveAttribute(
      "data-world2-mapping-support-copy-relation",
      "range-pitch",
    );
    expect(panel).toHaveAttribute(
      "data-world2-mapping-relation",
      "range-pitch",
    );
    expect(
      container.querySelector(
        '[data-mapping-parameter-visual="ascending-pitch-levels"]',
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-world2-feature-accent="rango"]'),
    ).toBeInTheDocument();
    reviewButtons.forEach((button) => expect(button).toBeEnabled());

    act(() => vi.advanceTimersByTime(3200));
    expect(onFirstRunComplete).not.toHaveBeenCalled();
    expect(panel).toHaveAttribute("data-world2-mapping-first-run", "active");
    expect(panel).toHaveAttribute("data-mapping-result-presented", "true");
    expect(panel).toHaveAttribute("data-world2-mapping-controls", "review");
    expect(panel).toHaveAttribute("data-world2-mapping-review-enabled", "true");
    reviewButtons.forEach((button) => expect(button).toBeEnabled());

    const relationBeforeReview = container.querySelector(
      "[data-mapping-active-relation]",
    );
    act(() => reviewButtons[0].click());
    expect(panel).toHaveAttribute("data-world2-mapping-step", "1");
    expect(panel).toHaveAttribute(
      "data-world2-mapping-relation",
      "amplitude-intensity",
    );
    expect(container.querySelector("[data-mapping-active-relation]")).not.toBe(
      relationBeforeReview,
    );
    const revisitedStep1Copy = screen.getByText("Más fuerza, más intensidad.");
    expect(revisitedStep1Copy).not.toBe(step1Copy);
    expect(revisitedStep1Copy.parentElement).toHaveAttribute(
      "data-world2-mapping-support-copy-revision",
      "1",
    );
    expect(
      container.querySelector("[data-mapping-active-relation]"),
    ).toHaveAttribute("data-mapping-animation-revision", "1");
    expect(
      container.querySelectorAll("[data-mapping-active-relation]"),
    ).toHaveLength(1);
  });

  it("inicia en revisión completa al remontarse dentro de la misma sesión", () => {
    render(
      <World2MappingPanel
        cleanSignalAsset="/clean-signal.png"
        firstRunComplete
        onFirstRunComplete={vi.fn()}
      />,
    );
    const panel = screen.getByRole("group");

    expect(panel).toHaveAttribute("data-world2-mapping-first-run", "complete");
    expect(panel).toHaveAttribute("data-world2-mapping-step", "3");
    screen
      .getAllByRole("button")
      .forEach((button) => expect(button).toBeEnabled());
  });
});


describe("World2MappingPanel · OBS03 truthful presentation", () => {
  afterEach(() => { cleanup(); vi.useRealTimers(); });
  it("does not run a demonstration under the preparation curtain", () => {
    vi.useFakeTimers(); const manual = vi.fn(), presented = vi.fn();
    const { container } = render(<World2MappingPanel cleanSignalAsset="/signal.png" active={false} firstRunComplete={false} onFirstRunComplete={manual} onPresented={presented} />);
    act(() => vi.advanceTimersByTime(20000));
    expect(container.querySelector("[data-world2-mapping-step]")).toHaveAttribute("data-world2-mapping-step", "1");
    expect(manual).not.toHaveBeenCalled(); expect(presented).not.toHaveBeenCalled();
  });
  it("marks assistance only after its complete result has rendered and never calls manual completion", () => {
    vi.useFakeTimers(); const manual = vi.fn(), presented = vi.fn();
    render(<World2MappingPanel cleanSignalAsset="/signal.png" firstRunComplete={false} onFirstRunComplete={manual} onPresented={presented} />);
    act(() => screen.getByRole("button", { name: "Ver resultado" }).click());
    expect(screen.getByText("Amplitud → Intensidad · Variación → Ritmo · Rango → Altura")).toBeVisible();
    expect(presented).not.toHaveBeenCalled(); act(() => vi.advanceTimersByTime(50));
    expect(presented).toHaveBeenCalledWith("assisted"); expect(manual).not.toHaveBeenCalled();
  });
  it("does not credit all manual relationships from one selection", () => {
    const manual = vi.fn(); render(<World2MappingPanel cleanSignalAsset="/signal.png" firstRunComplete={false} onFirstRunComplete={manual} />);
    const buttons = screen.getAllByRole("button", { name: /^Revisar relación/ });
    act(() => buttons[2].click()); expect(manual).not.toHaveBeenCalled();
    act(() => buttons[0].click()); expect(manual).not.toHaveBeenCalled();
    act(() => buttons[1].click()); expect(manual).toHaveBeenCalledTimes(1);
  });
  it("localises the mapping interaction instead of changing only document language", () => {
    render(<World2MappingPanel locale="en" cleanSignalAsset="/signal.png" firstRunComplete={false} onFirstRunComplete={vi.fn()} />);
    expect(screen.getByText("AMPLITUDE")).toBeVisible(); expect(screen.getByText("INTENSITY")).toBeVisible();
    expect(screen.getByRole("button", { name: "Show result" })).toBeVisible();
  });
});
