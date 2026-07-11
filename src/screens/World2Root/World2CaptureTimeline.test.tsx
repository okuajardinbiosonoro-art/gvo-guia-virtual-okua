import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  captureTimelineSteps,
  type CaptureTimelineStepId,
  World2CaptureTimeline,
} from "./World2CaptureTimeline";

function CaptureTimelineHarness() {
  const [currentStepId, setCurrentStepId] =
    useState<CaptureTimelineStepId>("contact");
  const [visitedStepIds, setVisitedStepIds] = useState<
    ReadonlySet<CaptureTimelineStepId>
  >(() => new Set<CaptureTimelineStepId>(["contact"]));
  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <World2CaptureTimeline
      asset="/capture-chain.png"
      completed={visitedStepIds.size === captureTimelineSteps.length}
      currentStepId={currentStepId}
      hasInteracted={hasInteracted}
      onSelectStep={(stepId) => {
        setCurrentStepId(stepId);
        setHasInteracted(true);
        setVisitedStepIds((current) => new Set(current).add(stepId));
      }}
      visitedStepIds={visitedStepIds}
    />
  );
}

describe("World2CaptureTimeline", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("inicia en Contacto y expone los tres controles con copy DOM", () => {
    const { container } = render(<CaptureTimelineHarness />);
    const timeline = container.querySelector(
      '[data-world2-capture-timeline="016R"]',
    );

    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    expect(timeline).toHaveAttribute("data-world2-capture-visited", "contact");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-typography",
      "gvo-app-ui-016S1",
    );
    expect(
      container.querySelector("[data-world2-capture-readout='contact']"),
    ).toHaveAttribute("data-world2-capture-readout-typography", "gvo-app-ui");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Aquí comienza la lectura. El electrodo entra en contacto con la planta sin producir música todavía: solo permite percibir una variación bioeléctrica muy pequeña.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Elegir paso de Captura" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Mostrar paso/ }),
    ).toHaveLength(3);
  });

  it("ancla el hint, avanza por swipe y conserva el progreso al volver", () => {
    vi.useFakeTimers();
    const { container } = render(<CaptureTimelineHarness />);
    const timeline = container.querySelector<HTMLElement>(
      '[data-world2-capture-timeline="016R"]',
    );
    const zone = screen.getByRole("group", {
      name: /Zona de deslizamiento/,
    });
    const hint = document.querySelector(".world2-gesture-hint--capture-swipe");

    expect(hint).toHaveAttribute("data-gvo-gesture-state", "waiting");
    act(() => vi.advanceTimersByTime(2800));
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "visible");

    fireEvent.pointerDown(zone, {
      button: 0,
      clientX: 240,
      clientY: 100,
      isPrimary: true,
      pointerId: 1,
    });
    fireEvent.pointerUp(zone, {
      button: 0,
      clientX: 120,
      clientY: 102,
      isPrimary: true,
      pointerId: 1,
    });

    expect(timeline).toHaveAttribute("data-world2-capture-step", "signal");
    expect(timeline).toHaveAttribute(
      "data-world2-capture-visited",
      "contact,signal",
    );
    expect(hint).toHaveAttribute("data-gvo-gesture-state", "completed");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Mostrar paso 3: Datos al sistema",
      }),
    );
    expect(timeline).toHaveAttribute("data-world2-capture-complete", "true");

    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar paso 1: Contacto" }),
    );
    expect(timeline).toHaveAttribute("data-world2-capture-step", "contact");
    expect(timeline).toHaveAttribute("data-world2-capture-complete", "true");
  });
});
