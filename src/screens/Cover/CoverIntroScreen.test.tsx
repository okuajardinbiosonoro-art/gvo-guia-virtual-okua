import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CoverIntroScreen } from "./CoverIntroScreen";
import { coverIntroAssets } from "./coverIntroAssets";
import {
  coverIntroDialogues,
  coverIntroPortals,
  coverIntroText,
  lockedPortalMessages,
} from "./coverIntroContent";
import { COVER_INTRO_STORAGE_KEY } from "./coverIntroState";

describe("CoverIntroScreen", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renderiza textos DOM principales y botón de inicio", () => {
    render(<CoverIntroScreen />);

    expect(screen.getByText(coverIntroText.logo)).toBeInTheDocument();
    expect(screen.getByText(coverIntroText.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: coverIntroText.archiveTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: coverIntroText.cta }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
        `[data-runtime-asset="${coverIntroAssets.liaIdle}"]`,
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
    render(<CoverIntroScreen />);

    fireEvent.click(screen.getByRole("button", { name: coverIntroText.cta }));

    expect(screen.getByRole("dialog")).toHaveTextContent(
      coverIntroDialogues[0].text,
    );
    expect(screen.getByRole("dialog")).not.toHaveTextContent(
      coverIntroDialogues[1].text,
    );
    expect(
      screen.getByRole("button", { name: "Siguiente diálogo de Lía" }),
    ).toBeInTheDocument();
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

    expect(screen.getByText(coverIntroText.openingWorldOne)).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute(
      "data-cover-phase",
      "portal_1_opening_placeholder",
    );
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });

  it.each(Object.entries(lockedPortalMessages))(
    "muestra feedback breve para %s sin navegar",
    (portalId, message) => {
      const { container } = render(<CoverIntroScreen />);
      const portal = coverIntroPortals.find((item) => item.id === portalId);

      expect(portal).toBeDefined();
      fireEvent.click(screen.getByRole("button", { name: portal?.ariaLabel }));

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(container.querySelector("a")).not.toBeInTheDocument();
    },
  );

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
