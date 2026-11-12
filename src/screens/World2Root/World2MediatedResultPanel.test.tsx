import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { World2MediatedResultPanel } from "./World2MediatedResultPanel";

afterEach(() => { cleanup(); vi.useRealTimers(); });
describe("Music · active presentation and assistance", () => {
  it("does not play or acknowledge content when inactive", () => {
    vi.useFakeTimers(); const complete = vi.fn();
    const { container } = render(<World2MediatedResultPanel complete={false} active={false} onComplete={complete} />);
    act(() => vi.advanceTimersByTime(15000)); expect(complete).not.toHaveBeenCalled();
    expect(container.querySelector("[data-world2-option6-stage]")).toHaveAttribute("data-world2-option6-stage", "intensity");
  });
  it("shows the requested result before acknowledging assisted presentation", () => {
    vi.useFakeTimers(); const complete = vi.fn();
    render(<World2MediatedResultPanel complete={false} onComplete={complete} />);
    fireEvent.click(screen.getByRole("button", { name: "Ver resultado" }));
    expect(screen.getByText("Los parámetros se integran y dan forma al sonido.")).toBeVisible(); expect(complete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(50)); expect(complete).toHaveBeenCalledWith("assisted");
  });
  it("normal presentation acknowledges once and does not assert a room closure", () => {
    vi.useFakeTimers(); const complete = vi.fn();
    render(<World2MediatedResultPanel complete={false} onComplete={complete} />);
    act(() => vi.advanceTimersByTime(9100)); act(() => vi.advanceTimersByTime(50));
    expect(complete).toHaveBeenCalledTimes(1); expect(complete).toHaveBeenCalledWith("standard");
    expect(screen.queryByRole("button", { name: /Cerrar Música/ })).toBeNull();
  });
});
