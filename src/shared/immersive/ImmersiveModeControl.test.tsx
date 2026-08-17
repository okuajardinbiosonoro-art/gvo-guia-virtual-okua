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

import { GVO_LANGUAGE_STORAGE_KEY } from "../../app/preferences/languagePreference";
import { ImmersiveModeControl } from "./ImmersiveModeControl";
import {
  exitFullscreen,
  getFullscreenCapability,
  getFullscreenExitMethod,
  getFullscreenRequestMethod,
  getDisplayMode,
  isFullscreenActive,
  requestFullscreenFromUserGesture,
} from "./immersiveMode";

type FullscreenStub = {
  requestFullscreen: ReturnType<typeof vi.fn>;
  exitFullscreen: ReturnType<typeof vi.fn>;
  setElement: (element: Element | null) => void;
};

type FullscreenStubOptions = {
  enabled?: boolean;
  policyAllowsFullscreen?: boolean;
  userActivation?: boolean;
};

function installFullscreenStub(
  options: FullscreenStubOptions = {},
): FullscreenStub {
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
    value: options.enabled ?? true,
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
  Object.defineProperty(document, "featurePolicy", {
    configurable: true,
    value:
      options.policyAllowsFullscreen === undefined
        ? undefined
        : {
            allowsFeature: vi.fn(
              () => options.policyAllowsFullscreen as boolean,
            ),
          },
  });
  Object.defineProperty(navigator, "userActivation", {
    configurable: true,
    value: {
      isActive: options.userActivation ?? false,
      hasBeenActive: options.userActivation ?? false,
    },
  });

  return {
    requestFullscreen,
    exitFullscreen,
    setElement: (element) => {
      fullscreenElement = element;
    },
  };
}

function installWebkitFullscreenStub() {
  let fullscreenElement: Element | null = null;
  const requestFullscreen = vi.fn(() => {
    fullscreenElement = document.documentElement;
    document.dispatchEvent(new Event("webkitfullscreenchange"));
  });
  const exitFullscreen = vi.fn(() => {
    fullscreenElement = null;
    document.dispatchEvent(new Event("webkitfullscreenchange"));
  });

  Object.defineProperty(document, "webkitFullscreenEnabled", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(document, "webkitFullscreenElement", {
    configurable: true,
    get: () => fullscreenElement,
  });
  Object.defineProperty(document.documentElement, "webkitRequestFullscreen", {
    configurable: true,
    value: requestFullscreen,
  });
  Object.defineProperty(document, "webkitExitFullscreen", {
    configurable: true,
    value: exitFullscreen,
  });

  return { requestFullscreen, exitFullscreen };
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
  Reflect.deleteProperty(document, "featurePolicy");
  Reflect.deleteProperty(document, "webkitFullscreenEnabled");
  Reflect.deleteProperty(document, "webkitFullscreenElement");
  Reflect.deleteProperty(document, "webkitExitFullscreen");
  Reflect.deleteProperty(document, "webkitCancelFullScreen");
  Reflect.deleteProperty(document.documentElement, "requestFullscreen");
  Reflect.deleteProperty(document.documentElement, "webkitRequestFullscreen");
  Reflect.deleteProperty(document.documentElement, "webkitRequestFullScreen");
  Reflect.deleteProperty(window, "matchMedia");
  Reflect.deleteProperty(navigator, "userActivation");
  Reflect.deleteProperty(navigator, "standalone");
  localStorage.clear();
  document.documentElement.lang = "es";
  vi.restoreAllMocks();
});

describe("immersive mode utilities", () => {
  it("reports only the fullscreen state actually granted by the document", () => {
    const stub = installFullscreenStub();

    expect(isFullscreenActive()).toBe(false);
    stub.setElement(document.documentElement);
    expect(isFullscreenActive()).toBe(true);
  });

  it("keeps capability supported before click even when transient activation is false", async () => {
    const stub = installFullscreenStub({ userActivation: false });

    expect(getFullscreenCapability()).toBe("supported");
    await expect(requestFullscreenFromUserGesture()).resolves.toBe(true);
    expect(stub.requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("distinguishes a missing API from a policy-blocked context", () => {
    expect(getFullscreenCapability()).toBe("unavailable-on-platform");

    installFullscreenStub({ policyAllowsFullscreen: false });
    expect(getFullscreenCapability()).toBe("blocked-by-context");
  });

  it("uses a demonstrated prefixed contract only when the standard API is absent", async () => {
    const stub = installWebkitFullscreenStub();

    expect(getFullscreenRequestMethod()).toBe("webkit");
    expect(getFullscreenExitMethod()).toBe("webkit");
    expect(getFullscreenCapability()).toBe("supported");
    await expect(requestFullscreenFromUserGesture()).resolves.toBe(true);
    expect(stub.requestFullscreen).toHaveBeenCalledTimes(1);
    await expect(exitFullscreen()).resolves.toBe(true);
    expect(stub.exitFullscreen).toHaveBeenCalledTimes(1);
  });

  it("reports a capable API with fullscreenEnabled false as blocked by context", () => {
    installFullscreenStub({ enabled: false });
    expect(getFullscreenCapability()).toBe("blocked-by-context");
  });

  it("degrades to false when a controlled fullscreen request is denied", async () => {
    const stub = installFullscreenStub();
    stub.requestFullscreen.mockRejectedValueOnce(
      new DOMException("Denied by test stub", "NotAllowedError"),
    );

    await expect(requestFullscreenFromUserGesture()).resolves.toBe(false);
    expect(isFullscreenActive()).toBe(false);
  });

  it("exits an active controlled state and treats an inactive state as a no-op", async () => {
    const stub = installFullscreenStub();

    await expect(exitFullscreen()).resolves.toBe(true);
    expect(stub.exitFullscreen).not.toHaveBeenCalled();

    stub.setElement(document.documentElement);
    await expect(exitFullscreen()).resolves.toBe(true);
    expect(stub.exitFullscreen).toHaveBeenCalledTimes(1);
    expect(isFullscreenActive()).toBe(false);
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
  it("renders no dead control when fullscreen is unavailable on the platform", () => {
    const { container } = render(<ImmersiveModeControl />);

    expect(
      container.querySelector("[data-gvo-immersive-control='fullscreen']"),
    ).not.toBeInTheDocument();
  });

  it("distinguishes a policy-blocked context from an unsupported browser", () => {
    installFullscreenStub({ policyAllowsFullscreen: false });
    render(<ImmersiveModeControl />);

    const button = screen.getByRole("button", {
      name: "Pantalla completa bloqueada en este contexto",
    });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-gvo-immersive-state", "blocked");
    expect(button).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "blocked-by-context",
    );
  });

  it("respects gvo.language.v1 for English enter and exit labels", () => {
    const stub = installFullscreenStub({ userActivation: false });
    localStorage.setItem(GVO_LANGUAGE_STORAGE_KEY, "en");
    const { rerender } = render(<ImmersiveModeControl />);

    expect(
      screen.getByRole("button", { name: "Enter fullscreen" }),
    ).toBeInTheDocument();
    stub.setElement(document.documentElement);
    act(() => document.dispatchEvent(new Event("fullscreenchange")));
    rerender(<ImmersiveModeControl />);
    expect(
      screen.getByRole("button", { name: "Exit fullscreen" }),
    ).toHaveAttribute("aria-pressed", "true");
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
    expect(button).toBeEnabled();
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
