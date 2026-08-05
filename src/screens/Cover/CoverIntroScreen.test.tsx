import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { coverToWorldOneTransitionRoute } from "../../app/routes";
import { screenAssetBundles } from "../../shared/assets/screenAssetBundles";
import type { ScreenAssetBundle } from "../../shared/assets/screenAssetBundles";
import { CoverIntroScreen } from "./CoverIntroScreen";
import { coverIntroAssets } from "./coverIntroAssets";
import {
  coverIntroDialogues,
  coverIntroPortals,
  coverIntroText,
  coverIntroTransitionText,
  lockedPortalMessages,
} from "./coverIntroContent";
import { COVER_INTRO_STORAGE_KEY } from "./coverIntroState";

const { navigateMock, preloaderMockState, useAssetPreloaderMock } = vi.hoisted(
  () => ({
    navigateMock: vi.fn(),
    preloaderMockState: {
      activation: {
        status: "ready",
        progress: 1,
        ready: true,
        failed: 0,
        timedOut: 0,
        total: 1,
        summary: null,
      },
    },
    useAssetPreloaderMock: vi.fn(),
  }),
);

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../shared/assets/useAssetPreloader", () => ({
  useAssetPreloader: useAssetPreloaderMock,
}));

type ActivationPreloadStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "timeout";

function setActivationPreload(status: ActivationPreloadStatus) {
  const isReady = status === "ready";
  const hasFinished = isReady || status === "error" || status === "timeout";

  preloaderMockState.activation = {
    status,
    progress: hasFinished ? 1 : 0,
    ready: hasFinished,
    failed: status === "error" ? 1 : 0,
    timedOut: status === "timeout" ? 1 : 0,
    total: 1,
    summary: null,
  };
}

function finishIntroDialogue() {
  fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));

  for (let index = 0; index < coverIntroDialogues.length - 1; index += 1) {
    fireEvent.click(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    );
  }

  fireEvent.click(
    screen.getByRole("button", { name: coverIntroText.dialogueFinish }),
  );
}

describe("CoverIntroScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
    navigateMock.mockClear();
    useAssetPreloaderMock.mockReset();
    setActivationPreload("ready");
    useAssetPreloaderMock.mockImplementation((bundle: ScreenAssetBundle) =>
      bundle.id === "coverIntroActivation"
        ? preloaderMockState.activation
        : {
            status: "ready",
            progress: 1,
            ready: true,
            failed: 0,
            timedOut: 0,
            total: bundle.assets.length,
            summary: null,
          },
    );
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    cleanup();
  });

  it("inicia el preload dedicado de activación al montar Portada", () => {
    render(<CoverIntroScreen />);

    expect(useAssetPreloaderMock).toHaveBeenCalledWith(
      screenAssetBundles.coverIntroActivation,
      {
        timeoutMs: 9000,
        retryKey: 0,
      },
    );
  });

  it("renderiza textos DOM principales y botón de inicio", () => {
    const { container } = render(<CoverIntroScreen />);

    expect(screen.getByText(coverIntroText.logo)).toBeInTheDocument();
    expect(screen.getByText(coverIntroText.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: coverIntroText.archiveTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: coverIntroText.cta }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      container.querySelector("[data-cover-intro-version='002J-FIX']"),
    ).toBeInTheDocument();
  });

  it("renderiza Lía en rig-idle por capas en portada_idle", () => {
    const { container } = render(<CoverIntroScreen />);

    expect(
      screen.getByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-avatar-mode='rig-idle']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-expression='neutral']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-rig-layer='head-clean']"),
    ).toHaveAttribute("data-runtime-asset", coverIntroAssets.liaRigHeadClean);
    expect(
      container.querySelector("[data-lia-rig-layer='eyes-neutral']"),
    ).toHaveAttribute("data-runtime-asset", coverIntroAssets.liaRigEyesNeutral);
    expect(
      screen.getAllByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toHaveLength(1);
  });

  it("renderiza cinco portales con Portal I disponible y II-V bloqueados", () => {
    const { container } = render(<CoverIntroScreen />);

    expect(container.querySelectorAll("[data-portal-id]")).toHaveLength(5);
    expect(
      screen.getByRole("button", {
        name: "Estación I, Mundo Raíz, disponible. Inicia la introducción de Lía.",
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
        `[data-runtime-asset="${coverIntroAssets.liaRigHeadClean}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        `[data-runtime-asset="${coverIntroAssets.liaRigEyesNeutral}"]`,
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

  it("inicia diálogos desde Comenzar recorrido y muestra un diálogo a la vez", () => {
    const { container } = render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));

    expect(screen.getByRole("dialog")).toHaveTextContent(
      coverIntroDialogues[0].text,
    );
    expect(screen.getByText("Lía")).toBeInTheDocument();
    expect(screen.getByText("Paso 1 de 5")).toBeInTheDocument();
    expect(screen.queryByText("1/5")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).not.toHaveTextContent(
      coverIntroDialogues[1].text,
    );
    expect(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-state='rig-happy']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-avatar-mode='rig-idle']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-expression='happy']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-rig-layer='eyes-happy']"),
    ).toHaveAttribute("data-runtime-asset", coverIntroAssets.liaRigEyesHappy);
    expect(
      container.querySelector("[data-lia-avatar-mode='pose']"),
    ).not.toBeInTheDocument();
  });

  it("usa rig atento en diálogos intermedios y pose completa desde diálogo 5", () => {
    const { container } = render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));
    fireEvent.click(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    );

    expect(screen.getByText("Paso 2 de 5")).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-avatar-mode='rig-idle']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-expression='attentive']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-rig-layer='eyes-attentive']"),
    ).toHaveAttribute(
      "data-runtime-asset",
      coverIntroAssets.liaRigEyesAttentive,
    );

    for (let index = 0; index < 3; index += 1) {
      fireEvent.click(
        screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
      );
    }

    expect(screen.getByText("Paso 5 de 5")).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-avatar-mode='pose']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-pose='pointPortal1']"),
    ).toHaveAttribute("data-runtime-asset", coverIntroAssets.liaPointPortal1);
    expect(
      container.querySelector("[data-lia-rig-layer='eyes-attentive']"),
    ).not.toBeInTheDocument();
  });

  it("resetIntro=1 limpia la persistencia y muestra primera pasada", () => {
    window.localStorage.setItem(COVER_INTRO_STORAGE_KEY, "true");
    window.history.replaceState({}, "", "/portada?resetIntro=1");

    render(<CoverIntroScreen />);

    expect(window.localStorage.getItem(COVER_INTRO_STORAGE_KEY)).toBeNull();
    expect(
      screen.getByRole("button", { name: coverIntroText.cta }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: coverIntroText.enterWorldOne }),
    ).not.toBeInTheDocument();
  });

  it("inicia diálogos desde Portal I antes de dejarlo abrir", () => {
    render(<CoverIntroScreen />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Estación I, Mundo Raíz, disponible. Inicia la introducción de Lía.",
      }),
    );

    expect(screen.getByRole("dialog")).toHaveTextContent(
      coverIntroDialogues[0].text,
    );
    expect(
      screen.queryByText(coverIntroText.openingWorldOne),
    ).not.toBeInTheDocument();
  });

  it("avanza los cinco diálogos y deja Portal I listo", () => {
    const { container } = render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));

    for (const dialogue of coverIntroDialogues.slice(0, -1)) {
      expect(screen.getByRole("dialog")).toHaveTextContent(dialogue.text);
      fireEvent.click(
        screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
      );
    }

    expect(screen.getByRole("dialog")).toHaveTextContent(
      coverIntroDialogues[coverIntroDialogues.length - 1].text,
    );
    expect(screen.getByText("Paso 5 de 5")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.dialogueFinish }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Estación I, Mundo Raíz, lista para abrir.",
      }),
    ).toHaveAttribute("data-portal-state", "ready");
    expect(
      container.querySelector("[data-lia-pose='pointPortal1']"),
    ).toHaveAttribute("data-runtime-asset", coverIntroAssets.liaPointPortal1);
    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_ready",
    );
    expect(window.localStorage.getItem(COVER_INTRO_STORAGE_KEY)).toBe("true");
  });

  it("muestra placeholder controlado al abrir Portal I listo sin navegar", () => {
    const { container } = render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));
    for (let index = 0; index < coverIntroDialogues.length - 1; index += 1) {
      fireEvent.click(
        screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
      );
    }
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.dialogueFinish }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
    );

    expect(
      screen.getByText(coverIntroTransitionText.opening),
    ).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
    expect(
      screen.getByTestId("cover-portal-activation-rig"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cover-portal-activation-rig")).toHaveAttribute(
      "data-activation-stage",
      "portal-i",
    );
    expect(screen.getByTestId("cover-activation-lia")).toHaveAttribute(
      "data-runtime-asset",
      coverIntroAssets.liaActivatePortal1,
    );
    expect(screen.getByTestId("cover-activation-portal-front")).toHaveAttribute(
      "data-runtime-asset",
      coverIntroAssets.portal1Frame,
    );
    expect(
      screen.getByTestId("cover-activation-contact-light"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-lia-pose='activatePortal1']"),
    ).toHaveAttribute(
      "data-runtime-asset",
      coverIntroAssets.liaActivatePortal1,
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-activation-assets-status",
      "ready",
    );
  });

  it("mantiene una sola intención pendiente mientras carga y la consume al quedar ready", () => {
    setActivationPreload("loading");
    const { container, rerender } = render(<CoverIntroScreen />);
    finishIntroDialogue();

    const enterButton = screen.getByRole("button", {
      name: coverIntroText.enterWorldOne,
    });
    fireEvent.click(enterButton);
    fireEvent.click(enterButton);

    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_ready",
    );
    expect(
      screen.queryByText(coverIntroTransitionText.opening),
    ).not.toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();

    setActivationPreload("ready");
    rerender(<CoverIntroScreen />);
    rerender(<CoverIntroScreen />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
    expect(screen.getByTestId("cover-activation-lia")).toHaveAttribute(
      "data-runtime-asset",
      coverIntroAssets.liaActivatePortal1,
    );
  });

  it("reintenta una vez si una intención pendiente termina en timeout", () => {
    setActivationPreload("loading");
    const { container, rerender } = render(<CoverIntroScreen />);
    finishIntroDialogue();

    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
    );
    setActivationPreload("timeout");
    rerender(<CoverIntroScreen />);

    const activationCalls = useAssetPreloaderMock.mock.calls.filter(
      ([bundle]) => bundle.id === "coverIntroActivation",
    );
    expect(activationCalls.at(-1)?.[1]).toMatchObject({ retryKey: 1 });
    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_ready",
    );

    setActivationPreload("loading");
    rerender(<CoverIntroScreen />);
    setActivationPreload("ready");
    rerender(<CoverIntroScreen />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
  });

  it.each(["error", "timeout"] as const)(
    "permanece listo y solicita retry controlado después de %s",
    (status) => {
      setActivationPreload(status);
      const { container } = render(<CoverIntroScreen />);
      finishIntroDialogue();

      fireEvent.click(
        screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
      );

      expect(container.firstElementChild).toHaveAttribute(
        "data-cover-phase",
        "portal_1_ready",
      );
      expect(
        screen.queryByText(coverIntroTransitionText.opening),
      ).not.toBeInTheDocument();
      expect(navigateMock).not.toHaveBeenCalled();

      const activationCalls = useAssetPreloaderMock.mock.calls.filter(
        ([bundle]) => bundle.id === "coverIntroActivation",
      );
      expect(activationCalls.at(-1)?.[1]).toMatchObject({ retryKey: 1 });
    },
  );

  it("inicia los 920 ms sólo cuando el retry llega a ready y navega una vez", () => {
    vi.useFakeTimers();
    setActivationPreload("error");
    const { container, rerender } = render(<CoverIntroScreen />);
    finishIntroDialogue();
    const enterButton = screen.getByRole("button", {
      name: coverIntroText.enterWorldOne,
    });

    fireEvent.click(enterButton);
    act(() => {
      vi.advanceTimersByTime(920);
    });
    expect(navigateMock).not.toHaveBeenCalled();

    setActivationPreload("loading");
    rerender(<CoverIntroScreen />);
    fireEvent.click(enterButton);
    fireEvent.click(enterButton);
    setActivationPreload("ready");
    rerender(<CoverIntroScreen />);

    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
    act(() => {
      vi.advanceTimersByTime(919);
    });
    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(coverToWorldOneTransitionRoute);
  });

  it("conserva el handoff de 920 ms bajo reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );
    render(<CoverIntroScreen />);
    finishIntroDialogue();

    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
    );
    act(() => {
      vi.advanceTimersByTime(919);
    });
    expect(navigateMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });

  it("navega a la transición runtime una sola vez despues de la activación", () => {
    vi.useFakeTimers();
    const { container } = render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));
    for (let index = 0; index < coverIntroDialogues.length - 1; index += 1) {
      fireEvent.click(
        screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
      );
    }
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.dialogueFinish }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.enterWorldOne }),
    );

    act(() => {
      vi.advanceTimersByTime(920);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(coverToWorldOneTransitionRoute);
    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
    expect(
      screen.queryByText(coverIntroTransitionText.preparing),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Ruta base creada para navegación secuencial"),
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-portal-state="locked"]'),
    ).toHaveLength(4);
  });

  it("bloquea doble navegación al abrir Mundo I", () => {
    vi.useFakeTimers();
    render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));
    for (let index = 0; index < coverIntroDialogues.length - 1; index += 1) {
      fireEvent.click(
        screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
      );
    }
    fireEvent.click(
      screen.getByRole("button", { name: coverIntroText.dialogueFinish }),
    );

    const enterButton = screen.getByRole("button", {
      name: coverIntroText.enterWorldOne,
    });

    fireEvent.click(enterButton);
    fireEvent.click(enterButton);

    act(() => {
      vi.advanceTimersByTime(920);
    });

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(coverToWorldOneTransitionRoute);
  });

  it.each(Object.entries(lockedPortalMessages))(
    "muestra feedback breve para %s sin navegar",
    (portalId, message) => {
      const { container } = render(<CoverIntroScreen />);
      const portal = coverIntroPortals.find((item) => item.id === portalId);

      expect(portal).toBeDefined();
      fireEvent.click(screen.getByRole("button", { name: portal?.ariaLabel }));

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(
        container.querySelector(`[data-portal-id="${portalId}"]`),
      ).toHaveClass("cover-intro__portal--blocked-feedback");
      expect(container.querySelector("a")).not.toBeInTheDocument();
    },
  );

  it("mantiene labels accesibles en controles principales", () => {
    render(<CoverIntroScreen />);

    expect(
      screen.getByRole("button", { name: coverIntroText.cta }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));
    expect(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Paso 1 de 5")).toBeInTheDocument();
    expect(screen.queryByText("1/5")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    );
    expect(screen.getByText("Paso 2 de 5")).toBeInTheDocument();
    expect(screen.queryByText("2/5")).not.toBeInTheDocument();
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
