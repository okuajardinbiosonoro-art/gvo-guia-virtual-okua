/*
 * These unit tests exercise local orchestration with controlled DOM stubs.
 * Real Fullscreen API support and user activation still require browser QA.
 */
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ImmersiveModeControl } from "./ImmersiveModeControl";
import {
  exitImmersiveMode,
  getDisplayMode,
  isImmersiveMode,
  requestImmersiveMode,
} from "./immersiveMode";

type FullscreenStub = {
  requestFullscreen: ReturnType<typeof vi.fn>;
  exitFullscreen: ReturnType<typeof vi.fn>;
  setElement: (element: Element | null) => void;
};

function installFullscreenStub(): FullscreenStub {
  let fullscreenElement: Element | null = null;
  const requestFullscreen = vi.fn(async () => {
    fullscreenElement = document.documentElement;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  const exitFullscreen = vi.fn(async () => {
    fullscreenElement = null;
    document.dispatchEvent(new Event("fullscreenchange"));
  });

  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    get: () => fullscreenElement,
  });
  Object.defineProperty(document.documentElement, "requestFullscreen", {
    configurable: true,
    value: requestFullscreen,
  });
  Object.defineProperty(document, "exitFullscreen", {
    configurable: true,
    value: exitFullscreen,
  });

  return {
    requestFullscreen,
    exitFullscreen,
    setElement: (element) => {
      fullscreenElement = element;
    },
  };
}

function installMatchMedia(activeModes: string[]) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: activeModes.some((mode) =>
        query.includes(`display-mode: ${mode}`),
      ),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(document, "fullscreenEnabled");
  Reflect.deleteProperty(document, "fullscreenElement");
  Reflect.deleteProperty(document, "exitFullscreen");
  Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  Reflect.deleteProperty(window, "matchMedia");
  Reflect.deleteProperty(navigator, "userActivation");
  Reflect.deleteProperty(navigator, "standalone");
  vi.restoreAllMocks();
});

describe("immersive mode utilities", () => {
  it("reports only the fullscreen state actually granted by the document", () => {
    const stub = installFullscreenStub();

    expect(isImmersiveMode()).toBe(false);
    stub.setElement(document.documentElement);
    expect(isImmersiveMode()).toBe(true);
  });

  it("requests fullscreen only when the browser reports active user activation", async () => {
    const stub = installFullscreenStub();
    Object.defineProperty(navigator, "userActivation", {
      configurable: true,
      value: { isActive: false },
    });

    await expect(requestImmersiveMode()).resolves.toBe(false);
    expect(stub.requestFullscreen).not.toHaveBeenCalled();

    Object.defineProperty(navigator, "userActivation", {
      configurable: true,
      value: { isActive: true },
    });
    await expect(requestImmersiveMode()).resolves.toBe(true);
    expect(stub.requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("degrades to false when a controlled fullscreen request is denied", async () => {
    const stub = installFullscreenStub();
    stub.requestFullscreen.mockRejectedValueOnce(
      new DOMException("Denied by test stub", "NotAllowedError"),
    );

    await expect(requestImmersiveMode()).resolves.toBe(false);
    expect(isImmersiveMode()).toBe(false);
  });

  it("exits an active controlled state and treats an inactive state as a no-op", async () => {
    const stub = installFullscreenStub();

    await expect(exitImmersiveMode()).resolves.toBe(true);
    expect(stub.exitFullscreen).not.toHaveBeenCalled();

    stub.setElement(document.documentElement);
    await expect(exitImmersiveMode()).resolves.toBe(true);
    expect(stub.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(isImmersiveMode()).toBe(false);
  });

  it("detects the granted display-mode with fullscreen priority", () => {
    const fullscreen = installFullscreenStub();
    fullscreen.setElement(document.documentElement);
    installMatchMedia([]);
    expect(getDisplayMode()).toBe("fullscreen");

    fullscreen.setElement(null);
    installMatchMedia(["standalone", "fullscreen"]);
    expect(getDisplayMode()).toBe("fullscreen");

    installMatchMedia(["standalone"]);
    expect(getDisplayMode()).toBe("standalone");

    installMatchMedia([]);
    expect(getDisplayMode()).toBe("browser");
  });
});

describe("ImmersiveModeControl", () => {
  it("does not render a control when the standard API is unavailable", () => {
    render(<ImmersiveModeControl />);

    expect(
      screen.queryByRole("button", { name: "Activar pantalla completa" }),
    ).not.toBeInTheDocument();
  });

  it("uses a native button and requests only after its explicit click", async () => {
    const stub = installFullscreenStub();
    render(<ImmersiveModeControl />);
    const button = screen.getByRole("button", {
      name: "Activar pantalla completa",
    });

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(stub.requestFullscreen).not.toHaveBeenCalled();

    await act(async () => fireEvent.click(button));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Salir de pantalla completa" }),
      ).toHaveAttribute("aria-pressed", "true"),
    );
    expect(stub.requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("updates from fullscreenchange and exits from the same accessible control", async () => {
    const stub = installFullscreenStub();
    render(<ImmersiveModeControl />);

    stub.setElement(document.documentElement);
    act(() => document.dispatchEvent(new Event("fullscreenchange")));
    const exitButton = screen.getByRole("button", {
      name: "Salir de pantalla completa",
    });

    await act(async () => fireEvent.click(exitButton));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Activar pantalla completa" }),
      ).toHaveAttribute("aria-pressed", "false"),
    );
    expect(stub.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it("handles fullscreenerror without throwing or blocking the control", async () => {
    const stub = installFullscreenStub();
    stub.requestFullscreen.mockImplementationOnce(async () => {
      document.dispatchEvent(new Event("fullscreenerror"));
      throw new DOMException("Denied by test stub", "NotAllowedError");
    });
    render(<ImmersiveModeControl />);

    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Activar pantalla completa" }),
      ),
    );

    const button = screen.getByRole("button", {
      name: "Activar pantalla completa",
    });
    expect(button).toHaveAttribute("data-gvo-immersive-state", "error");
    expect(button).not.toBeDisabled();
  });
});
