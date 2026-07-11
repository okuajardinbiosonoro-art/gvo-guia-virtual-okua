import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { World2MediatedResultPanel } from "./World2MediatedResultPanel";

describe("World2MediatedResultPanel 016V", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("converge en una sola escena y completa el gate solo al finalizar", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { container } = render(
      <World2MediatedResultPanel complete={false} onComplete={onComplete} />,
    );
    const panel = screen.getByRole("group", {
      name: "Convergencia sonora final de intensidad, ritmo y altura",
    });

    expect(panel).toHaveAttribute("data-world2-option6-stage", "intensity");
    expect(panel).toHaveAttribute(
      "data-world2-option6-simultaneous-primary-scenes",
      "1",
    );
    expect(
      container.querySelectorAll("[data-world2-option6-primary-scene]"),
    ).toHaveLength(1);
    expect(
      container.querySelector(".world2-mediated-panel"),
    ).not.toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(2100));
    expect(panel).toHaveAttribute("data-world2-option6-stage", "rhythm");
    expect(screen.getByText("RITMO")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2100));
    expect(panel).toHaveAttribute("data-world2-option6-stage", "pitch");
    expect(screen.getByText("ALTURA")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(2100));
    expect(panel).toHaveAttribute("data-world2-option6-stage", "resolved");
    expect(screen.getByText("RESULTADO SONORO")).toBeInTheDocument();
    expect(
      screen.getByText("Los parámetros se integran y dan forma al sonido."),
    ).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(2699));
    expect(onComplete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
