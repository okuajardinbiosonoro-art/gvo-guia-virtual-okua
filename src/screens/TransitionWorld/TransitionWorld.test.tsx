import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TransitionWorld } from "./TransitionWorld";
import { transitionWorldConfigs } from "./transitionWorld.config";

const configs = Object.values(transitionWorldConfigs);
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", (media: string) => ({ matches: false, media, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16));
  vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ x:0,y:0,width:390,height:844,top:0,left:0,right:390,bottom:844,toJSON:()=>({}) });
  vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
  vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(640);
  vi.spyOn(HTMLImageElement.prototype, "naturalHeight", "get").mockReturnValue(640);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); window.localStorage.clear(); });
async function advance(ms: number) { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); }

describe("six protected transition UIs OBS03.2", () => {
  it.each(configs)("$id has a concrete destination, preserved portal/Lía and no skip", (config) => {
    const { container } = render(<TransitionWorld config={config} variant="runtime" />);
    expect(screen.getByRole("heading", { name: config.title })).toBeVisible();
    expect(container.querySelector("main")).toHaveAttribute("data-target-preload", config.targetPreload);
    expect(config.targetPreload).not.toBe("none");
    expect(container.querySelector("main")).toHaveAttribute("data-target-assets-ready", "false");
    expect(screen.getByTestId("transition-world-portal")).toBeInTheDocument();
    expect(screen.getByTestId("transition-world-lia-sprite")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Lía" })).toHaveAttribute("data-testid", "transition-world-lia-sprite");
    expect(container.querySelector("button, a, audio, video, canvas")).toBeNull();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it.each(configs)("$id completes only after first-frame proof plus its visible minimum", async (config) => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const { container } = render(<TransitionWorld config={config} variant="runtime" preloadStatus="loading" preloadProgress={0.2} onComplete={complete} />);
    await advance(80);
    expect(container.querySelector("main")).toHaveAttribute("data-motion-state", "runtime-sequence");
    await advance(config.durationMs - 1);
    expect(complete).not.toHaveBeenCalled();
    await advance(17);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(container.querySelector("main")).toHaveAttribute("data-target-assets-ready", "false");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "20");
    act(() => vi.advanceTimersByTime(15000));
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("preview never reports completion; unmount cancels a runtime timer", () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const first = render(<TransitionWorld onComplete={complete} />);
    act(() => vi.advanceTimersByTime(10000));
    expect(complete).not.toHaveBeenCalled();
    first.unmount();
    const second = render(<TransitionWorld variant="runtime" onComplete={complete} />);
    second.unmount();
    act(() => vi.advanceTimersByTime(10000));
    expect(complete).not.toHaveBeenCalled();
  });

  it("reduced motion preserves a finite visible minimum and actual progress", async () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    render(<TransitionWorld variant="runtime" isReducedMotion preloadProgress={0.37} onComplete={complete} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "37");
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-progress-preview", "real");
    await advance(80); await advance(999);
    expect(complete).not.toHaveBeenCalled();
    await advance(17);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("root status updates do not restart the ceremony; a new attempt does", async () => {
    vi.useFakeTimers();
    const complete = vi.fn();
    const { rerender } = render(<TransitionWorld variant="runtime" attemptId="one" onComplete={complete} />);
    await advance(1000);
    rerender(<TransitionWorld variant="runtime" attemptId="one" preloadStatus="ready" onComplete={complete} />);
    await advance(1400);
    expect(complete).toHaveBeenCalledTimes(1);
    rerender(<TransitionWorld variant="runtime" attemptId="two" onComplete={complete} />);
    await advance(2400);
    expect(complete).toHaveBeenCalledTimes(2);
  });

  it("timeout recovery delegates retry/back and respects the exhausted retry budget", () => {
    const retry = vi.fn(), back = vi.fn();
    const { rerender } = render(<TransitionWorld variant="runtime" preloadStatus="timeout" onRetry={retry} onBack={back} />);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    fireEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(retry).toHaveBeenCalledTimes(1); expect(back).toHaveBeenCalledTimes(1);
    rerender(<TransitionWorld variant="runtime" preloadStatus="error" canRetry={false} onRetry={retry} onBack={back} />);
    expect(screen.queryByRole("button", { name: "Reintentar" })).toBeNull();
    expect(screen.getByRole("button", { name: "Volver" })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /continuar|omitir/i })).toBeNull();
  });

  it.each(configs)("$id resolves EN at render, including the recovery and portal labels", (config) => {
    render(<TransitionWorld config={config} locale="en" preloadStatus="error" onRetry={() => undefined} onBack={() => undefined} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Opening");
    expect(screen.getByRole("heading")).not.toHaveTextContent("Abriendo");
    expect(screen.getByRole("img", { name: "Lía" })).toHaveAttribute("data-testid", "transition-world-lia-sprite");
    expect(screen.queryByRole("img", { name: /aprobada|pixelart/i })).toBeNull();
    expect(screen.getByRole("button", { name: "Retry" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Back" })).toBeVisible();
    expect(screen.getByTestId("transition-world-portal")).toHaveAttribute("aria-label", expect.stringMatching(/^Portal to /));
  });
});
