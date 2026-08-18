import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { InterstationQrGate } from "./InterstationQrGate";

function installCamera() {
  const stop = vi.fn();
  const stream = { getTracks: () => [{ stop }] } as unknown as MediaStream;
  const getUserMedia = vi.fn(async () => stream);
  Object.defineProperty(window, "isSecureContext", {
    configurable: true,
    value: true,
  });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  return { getUserMedia, stop };
}

function renderGate({
  onCompleted = vi.fn(),
  persistCompletion = vi.fn(() => true),
}: {
  onCompleted?: () => void;
  persistCompletion?: () => boolean;
} = {}) {
  return {
    ...render(
      <MemoryRouter>
        <InterstationQrGate
          originWorld={1}
          ready
          persistCompletion={persistCompletion}
          onCompleted={onCompleted}
        />
      </MemoryRouter>,
    ),
    onCompleted,
    persistCompletion,
  };
}

async function openScanner() {
  fireEvent.click(
    screen.getByRole("button", { name: /QR para abrir Mundo 2/i }),
  );
  await waitFor(() =>
    expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
      "data-camera-status",
      "camera-granted",
    ),
  );
}

function scan(payload: string) {
  window.dispatchEvent(
    new CustomEvent("gvo:qr-test-payload", { detail: { payload } }),
  );
}

beforeEach(() => {
  window.__GVO_QR_TEST_MODE__ = true;
  localStorage.setItem("gvo.language.v1", "es");
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
  Reflect.deleteProperty(window, "isSecureContext");
  Reflect.deleteProperty(navigator, "mediaDevices");
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("InterstationQrGate", () => {
  it("wrong y unknown no escriben ni completan", async () => {
    installCamera();
    const { persistCompletion, onCompleted } = renderGate();
    await openScanner();

    scan("/qr/w3");
    expect(
      await screen.findByText(/pertenece a otra estación/i),
    ).toBeInTheDocument();
    scan(["https:", "", "example.test", "qr", "w2"].join("/"));
    expect(await screen.findByText(/QR no reconocido/i)).toBeInTheDocument();
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
  });

  it("QR válido detiene cámara antes de escritura verificada y transición", async () => {
    const { stop } = installCamera();
    const events: string[] = [];
    const persistCompletion = vi.fn(() => {
      events.push(`persist-after-stop-${stop.mock.calls.length}`);
      return true;
    });
    const onCompleted = vi.fn(() => events.push("transition"));
    renderGate({ onCompleted, persistCompletion });
    await openScanner();

    scan("  /qr/w2 ");
    await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
    expect(events).toEqual(["persist-after-stop-1", "transition"]);
  });

  it("si la escritura falla no completa y permite retry sin reescanear", async () => {
    installCamera();
    const persistCompletion = vi
      .fn<() => boolean>()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const onCompleted = vi.fn();
    renderGate({ onCompleted, persistCompletion });
    await openScanner();

    scan("/qr/w2");
    const retry = await screen.findByRole("button", {
      name: "Reintentar guardado verificado",
    });
    expect(onCompleted).not.toHaveBeenCalled();
    fireEvent.click(retry);
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("close, hidden y unmount detienen los tracks", async () => {
    const { stop } = installCamera();
    const rendered = renderGate();
    await openScanner();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar cámara" }));
    expect(stop).toHaveBeenCalledTimes(1);

    await openScanner();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(stop).toHaveBeenCalledTimes(2);

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    await openScanner();
    rendered.unmount();
    expect(stop).toHaveBeenCalledTimes(3);
  });
});
