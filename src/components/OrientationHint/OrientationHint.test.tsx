import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { OrientationHint } from "./OrientationHint";

const COMPACT_PORTRAIT_QUERY = "(max-width: 480px) and (orientation: portrait)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type QueryState = {
  listeners: Set<(event: MediaQueryListEvent) => void>;
  matches: boolean;
};

function installMatchMedia(initial: Record<string, boolean>) {
  const states = new Map<string, QueryState>();

  const stateFor = (query: string) => {
    const current = states.get(query);
    if (current) {
      return current;
    }
    const created = {
      listeners: new Set<(event: MediaQueryListEvent) => void>(),
      matches: initial[query] ?? false,
    };
    states.set(query, created);
    return created;
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => {
      const state = stateFor(query);
      return {
        get matches() {
          return state.matches;
        },
        media: query,
        onchange: null,
        addEventListener: (
          type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => {
          if (type === "change") {
            state.listeners.add(listener);
          }
        },
        removeEventListener: (
          type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => {
          if (type === "change") {
            state.listeners.delete(listener);
          }
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }),
  });

  return {
    set(query: string, matches: boolean) {
      const state = stateFor(query);
      state.matches = matches;
      const event = { matches, media: query } as MediaQueryListEvent;
      act(() => {
        for (const listener of state.listeners) {
          listener(event);
        }
      });
    },
  };
}

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
  vi.restoreAllMocks();
  Reflect.deleteProperty(window, "matchMedia");
});

describe("OrientationHint", () => {
  it("muestra el copy DOM por defecto en compact portrait y expone hooks", () => {
    installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: true });

    const { container } = render(
      <OrientationHint
        className="s4-orientation-hint"
        dataHook="world4-stage"
        storageKey="test:orientation:default"
      />,
    );

    const hint = screen.getByLabelText("Recomendación de orientación");
    expect(hint).toHaveClass("gvo-orientation-hint", "s4-orientation-hint");
    expect(hint).toHaveAttribute("data-gvo-orientation-hook", "world4-stage");
    expect(hint).toHaveTextContent(
      "Gira el dispositivo para ver mejor la mesa.",
    );
    expect(
      container.querySelector("img, picture, svg"),
    ).not.toBeInTheDocument();
  });

  it("acepta copy y label de descarte configurables", () => {
    installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: true });
    render(
      <OrientationHint
        dismissLabel="Ocultar recomendación"
        message="Usa landscape para ampliar el tablero."
        storageKey="test:orientation:copy"
      />,
    );

    expect(
      screen.getByText("Usa landscape para ampliar el tablero."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ocultar recomendación" }),
    ).toBeInTheDocument();
  });

  it("se oculta al rotar y reaparece al volver a portrait si no fue descartado", () => {
    const media = installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: true });
    render(<OrientationHint storageKey="test:orientation:rotation" />);

    expect(
      screen.getByLabelText("Recomendación de orientación"),
    ).toBeInTheDocument();

    media.set(COMPACT_PORTRAIT_QUERY, false);
    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();

    media.set(COMPACT_PORTRAIT_QUERY, true);
    expect(
      screen.getByLabelText("Recomendación de orientación"),
    ).toBeInTheDocument();
  });

  it("permanece oculto durante la sesión después de descartarlo", () => {
    const media = installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: true });
    const storageKey = "test:orientation:dismissed";
    const view = render(<OrientationHint storageKey={storageKey} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Descartar ayuda de orientación",
      }),
    );
    expect(window.sessionStorage.getItem(storageKey)).toBe("1");
    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();

    media.set(COMPACT_PORTRAIT_QUERY, false);
    media.set(COMPACT_PORTRAIT_QUERY, true);
    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();

    view.unmount();
    render(<OrientationHint storageKey={storageKey} />);
    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();
  });

  it("conserva el descarte en memoria si sessionStorage está bloqueado", () => {
    installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: true });
    const storageKey = "test:orientation:storage-blocked";
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    const view = render(<OrientationHint storageKey={storageKey} />);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Descartar ayuda de orientación",
      }),
    );
    view.unmount();

    render(<OrientationHint storageKey={storageKey} />);
    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();
  });

  it("no se renderiza fuera de compact portrait", () => {
    installMatchMedia({ [COMPACT_PORTRAIT_QUERY]: false });
    render(<OrientationHint storageKey="test:orientation:wide" />);

    expect(
      screen.queryByLabelText("Recomendación de orientación"),
    ).not.toBeInTheDocument();
  });

  it("expone reduced motion para aplicar el contrato sin animación", () => {
    installMatchMedia({
      [COMPACT_PORTRAIT_QUERY]: true,
      [REDUCED_MOTION_QUERY]: true,
    });
    render(<OrientationHint storageKey="test:orientation:reduced" />);

    expect(
      screen.getByLabelText("Recomendación de orientación"),
    ).toHaveAttribute("data-gvo-orientation-motion", "reduced");
  });
});
