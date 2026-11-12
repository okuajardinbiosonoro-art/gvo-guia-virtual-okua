import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { JourneyActivationProvider } from "../journey/JourneyActivation";
import {
  captureValidatedJourneyReviewContext,
  resolveJourneyAccess,
} from "../journey/journeyAccess";
import {
  beginJourneyReset,
  finishJourneyReset,
  ESSENTIAL_CONTENT_REVISION,
  ESSENTIAL_STORAGE_KEY,
  essentialSteps,
  markEssentialPresented,
  confirmEssentialStep,
  closeEssentialRoom,
  invalidateJourneyEssential,
  readEssentialSnapshot,
  setJourneyRuntimeContext,
  type ValidatedJourneyContext,
} from "../journey/journeyEssential";
import { pendingJourneyNavigationState } from "../journey/journeyIntent";
import {
  createFinalReviewContext,
  FINAL_REVIEW_CONTEXT_STORAGE_KEY,
} from "../review/finalReviewContext";
import { markStationCompleted } from "../../domain/progress/progress.storage";

import { InterstationQrGate } from "./InterstationQrGate";

const zxingMock = vi.hoisted(() => ({
  decodeFromStream: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("@zxing/browser", () => ({
  BrowserQRCodeReader: class {
    decodeFromStream = zxingMock.decodeFromStream;
  },
}));

type DecoderCallback = (
  decoded: { getText: () => string } | undefined,
  error: unknown,
) => void;

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

const normalContext: ValidatedJourneyContext = {
  active: true,
  attemptId: "qr-test-1",
  screen: 1,
  mode: "normal",
  authorized: true,
  reviewReturnAllowed: false,
};
type GateOptions = {
  onCompleted?: () => void;
  onBeforeOpen?: () => boolean;
  presentation?: "dock" | "scene";
  persistCompletion?: () => boolean;
  ready?: boolean;
  context?: ValidatedJourneyContext;
  state?: unknown;
};
function GateHarness({
  onCompleted = () => {},
  onBeforeOpen,
  presentation,
  persistCompletion = () => true,
  ready = true,
  context = normalContext,
  state,
}: GateOptions) {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/estacion/1", state }]}>
      <JourneyActivationProvider context={context}>
        <InterstationQrGate
          originWorld={1}
          ready={ready}
          onBeforeOpen={onBeforeOpen}
          presentation={presentation}
          persistCompletion={persistCompletion}
          onCompleted={onCompleted}
        />
      </JourneyActivationProvider>
    </MemoryRouter>
  );
}
function renderGate(options: GateOptions = {}) {
  const onCompleted = options.onCompleted ?? vi.fn(),
    persistCompletion = options.persistCompletion ?? vi.fn(() => true);
  return {
    ...render(
      <GateHarness
        {...options}
        onCompleted={onCompleted}
        persistCompletion={persistCompletion}
      />,
    ),
    onCompleted,
    persistCompletion,
  };
}
/** Current source prerequisite is produced by real facade writers; no synthetic historical snapshot. */
async function closeSource() {
  for (const source of ["cover", 1] as const) {
    setJourneyRuntimeContext({ ...normalContext, screen: source });
    const input = {
      screen: source,
      attemptId: normalContext.attemptId,
      contentRevision: ESSENTIAL_CONTENT_REVISION,
    };
    for (const [index, stepId] of essentialSteps[source].entries()) {
      expect(
        (await markEssentialPresented({ ...input, stepId, mode: "standard" }))
          .ok,
      ).toBe(true);
      if (index < essentialSteps[source].length - 1)
        expect(
          (
            await confirmEssentialStep({
              ...input,
              stepId,
              cause: "visitor_advance",
            })
          ).ok,
        ).toBe(true);
    }
    expect(
      (await closeEssentialRoom({ ...input, cause: "visitor_close" })).ok,
    ).toBe(true);
  }
  setJourneyRuntimeContext(normalContext);
}

async function openScanner() {
  fireEvent.click(
    screen.getByRole("button", { name: /QR para abrir Sala II/i }),
  );
  await waitFor(() =>
    expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
      "data-camera-status",
      "camera-granted",
    ),
  );
}

it("mantiene el foco dentro de cámara y lo devuelve a la salida al cerrar con Escape", async () => {
  installCamera();
  renderGate({ presentation: "scene" });
  await openScanner();
  expect(
    screen.getByRole("heading", { name: "QR hacia Sala II" }),
  ).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab" });
  expect(screen.getByRole("button", { name: "Cerrar cámara" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(screen.getByRole("button", { name: "Cerrar cámara" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: /QR para abrir Sala II/ }),
    ).toHaveFocus(),
  );
  expect(screen.queryByRole("dialog")).toBeNull();
});

function scan(payload: string) {
  window.dispatchEvent(
    new CustomEvent("gvo:qr-test-payload", { detail: { payload } }),
  );
}

beforeEach(async () => {
  localStorage.clear();
  sessionStorage.clear();
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  });
  invalidateJourneyEssential();
  await closeSource();
  zxingMock.decodeFromStream.mockReset();
  zxingMock.stop.mockReset();
  zxingMock.decodeFromStream.mockResolvedValue({ stop: zxingMock.stop });
  window.__GVO_QR_TEST_MODE__ = true;
  localStorage.setItem("gvo.language.v1", "es");
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
  Reflect.deleteProperty(window, "isSecureContext");
  Reflect.deleteProperty(navigator, "mediaDevices");
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

it("mantiene el acceso en la escena y prepara la salida sin conceder avance hasta el QR válido", async () => {
  const { getUserMedia } = installCamera();
  const onBeforeOpen = vi.fn(() => true);
  const { container, persistCompletion, onCompleted } = renderGate({
    onBeforeOpen,
    presentation: "scene",
  });
  expect(
    container.querySelector(".interstation-qr-gate--scene"),
  ).not.toBeNull();
  await openScanner();
  expect(onBeforeOpen).toHaveBeenCalledTimes(1);
  expect(getUserMedia).toHaveBeenCalledTimes(1);
  expect(persistCompletion).not.toHaveBeenCalled();
  expect(container.querySelector("[data-interstation-qr-gate]")).toBeNull();
  scan("/qr/w3");
  expect(onCompleted).not.toHaveBeenCalled();
  scan("/qr/w2");
  await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
  expect(persistCompletion).toHaveBeenCalledTimes(1);
});

it("no abre la cámara cuando la preparación de salida no pudo guardarse", () => {
  const { getUserMedia } = installCamera();
  const { persistCompletion } = renderGate({
    presentation: "scene",
    onBeforeOpen: () => false,
  });
  fireEvent.click(
    screen.getByRole("button", { name: /QR para abrir Sala II/i }),
  );
  expect(getUserMedia).not.toHaveBeenCalled();
  expect(persistCompletion).not.toHaveBeenCalled();
  expect(document.querySelector("[data-qr-scan-status]")).toHaveAttribute(
    "data-qr-scan-status",
    "closed",
  );
});

it("conserva la solicitud de cámara al actualizar callbacks del padre durante la preparación", async () => {
  const { getUserMedia, stop } = installCamera();
  let grant: ((stream: MediaStream) => void) | undefined;
  getUserMedia.mockImplementationOnce(
    () =>
      new Promise<MediaStream>((resolve) => {
        grant = resolve;
      }),
  );
  const rendered = renderGate({ presentation: "scene" });
  fireEvent.click(
    screen.getByRole("button", { name: /QR para abrir Sala II/i }),
  );
  const onCompleted = vi.fn();
  rendered.rerender(
    <GateHarness presentation="scene" onCompleted={onCompleted} />,
  );
  grant?.({ getTracks: () => [{ stop }] } as unknown as MediaStream);
  await waitFor(() =>
    expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
      "data-camera-status",
      "camera-granted",
    ),
  );
  expect(stop).not.toHaveBeenCalled();
  scan("/qr/w2");
  await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
});

describe("InterstationQrGate", () => {
  it("mantiene el scanner ante errores normales de ZXing con nombre minificado y completa sólo con QR válido", async () => {
    Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
    const { stop } = installCamera();
    const { persistCompletion, onCompleted } = renderGate();
    await openScanner();
    await waitFor(() =>
      expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(1),
    );
    const callback = zxingMock.decodeFromStream.mock
      .calls[0][2] as DecoderCallback;

    for (const kind of [
      "NotFoundException",
      "ChecksumException",
      "FormatException",
    ]) {
      class r extends Error {
        getKind() {
          return kind;
        }
      }
      const failure = new r();
      expect(failure.constructor.name).not.toBe(kind);
      await act(async () => callback(undefined, failure));
      expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
        "data-camera-status",
        "camera-granted",
      );
      expect(document.querySelector("[data-qr-scan-status]")).toHaveAttribute(
        "data-qr-scan-status",
        "reading",
      );
      expect(stop).not.toHaveBeenCalled();
      expect(zxingMock.stop).not.toHaveBeenCalled();
      expect(persistCompletion).not.toHaveBeenCalled();
      expect(onCompleted).not.toHaveBeenCalled();
    }

    await act(async () => {
      callback({ getText: () => "/qr/w3" }, undefined);
      callback({ getText: () => "not-a-station" }, undefined);
    });
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    await act(async () => {
      callback({ getText: () => "/qr/w2" }, undefined);
      callback({ getText: () => "/qr/w2" }, undefined);
    });
    expect(persistCompletion).toHaveBeenCalledTimes(1);
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(zxingMock.stop).toHaveBeenCalledTimes(1);
  });

  it("detiene cámara y decoder ante error inesperado del callback y permite reintentar sin progreso", async () => {
    Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
    const { getUserMedia, stop } = installCamera();
    const { persistCompletion, onCompleted } = renderGate();
    await openScanner();
    await waitFor(() =>
      expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(1),
    );
    const callback = zxingMock.decodeFromStream.mock
      .calls[0][2] as DecoderCallback;
    await act(async () => callback(undefined, new Error("Decoder failure")));
    expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
      "data-camera-status",
      "camera-error",
    );
    expect(stop).toHaveBeenCalledTimes(1);
    expect(zxingMock.stop).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Reintentar cámara" }),
    ).toBeVisible();
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Reintentar cámara" }));
    await waitFor(() =>
      expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(2),
    );
    expect(getUserMedia).toHaveBeenCalledTimes(2);
    expect(document.querySelector("[data-camera-status]")).toHaveAttribute(
      "data-camera-status",
      "camera-granted",
    );
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    const retriedCallback = zxingMock.decodeFromStream.mock
      .calls[1][2] as DecoderCallback;
    await act(async () => {
      retriedCallback({ getText: () => "/qr/w2" }, undefined);
    });
    expect(persistCompletion).toHaveBeenCalledTimes(1);
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalledTimes(2);
    expect(zxingMock.stop).toHaveBeenCalledTimes(2);
  });

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

describe("OBS03 R3 QR callback fences and review transport", () => {
  it.each([
    "close",
    "hidden",
    "unmount",
    "reset",
    "inactive",
    "newer-attempt",
  ] as const)(
    "rejects an already queued decoder result after %s",
    async (reason) => {
      Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
      const { stop } = installCamera();
      const rendered = renderGate();
      await openScanner();
      await waitFor(() =>
        expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(1),
      );
      const callback = zxingMock.decodeFromStream.mock
        .calls[0][2] as DecoderCallback;
      const before = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
      let resetSerial: number | undefined;
      await act(async () => {
        if (reason === "close")
          fireEvent.click(
            screen.getByRole("button", { name: "Cerrar cámara" }),
          );
        if (reason === "hidden") {
          Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "hidden",
          });
          fireEvent(document, new Event("visibilitychange"));
        }
        if (reason === "unmount") rendered.unmount();
        if (reason === "reset") resetSerial = beginJourneyReset();
        if (reason === "inactive")
          setJourneyRuntimeContext({ ...normalContext, active: false });
        if (reason === "newer-attempt")
          setJourneyRuntimeContext({
            ...normalContext,
            attemptId: "newer-token",
          });
        callback({ getText: () => "/qr/w2" }, undefined);
      });
      expect(rendered.persistCompletion).not.toHaveBeenCalled();
      expect(rendered.onCompleted).not.toHaveBeenCalled();
      expect(readEssentialSnapshot()!.pendingTransition).toBeNull();
      expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
      expect(stop).toHaveBeenCalled();
      if (resetSerial !== undefined)
        act(() => finishJourneyReset(resetSerial!));
    },
  );

  it("does not let an earlier request consume the next request's decoded payload", async () => {
    Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
    installCamera();
    const { persistCompletion, onCompleted } = renderGate();
    await openScanner();
    await waitFor(() =>
      expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(1),
    );
    const oldCallback = zxingMock.decodeFromStream.mock
      .calls[0][2] as DecoderCallback;
    fireEvent.click(screen.getByRole("button", { name: "Cerrar cámara" }));
    await openScanner();
    await waitFor(() =>
      expect(zxingMock.decodeFromStream).toHaveBeenCalledTimes(2),
    );
    const currentCallback = zxingMock.decodeFromStream.mock
      .calls[1][2] as DecoderCallback;
    await act(async () => oldCallback({ getText: () => "/qr/w2" }, undefined));
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    await act(async () =>
      currentCallback({ getText: () => "/qr/w2" }, undefined),
    );
    expect(persistCompletion).toHaveBeenCalledTimes(1);
    expect(onCompleted).toHaveBeenCalledTimes(1);
  });

  it("disposes a camera granted after close and ignores payload before any grant", async () => {
    const { getUserMedia, stop } = installCamera();
    let grant: ((stream: MediaStream) => void) | undefined;
    getUserMedia.mockImplementationOnce(
      () =>
        new Promise<MediaStream>((resolve) => {
          grant = resolve;
        }),
    );
    const { persistCompletion, onCompleted } = renderGate();
    fireEvent.click(
      screen.getByRole("button", { name: /QR para abrir Sala II/i }),
    );
    scan("/qr/w2");
    expect(persistCompletion).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cerrar cámara" }));
    await act(async () => {
      grant?.({ getTracks: () => [{ stop }] } as unknown as MediaStream);
    });
    expect(stop).toHaveBeenCalledTimes(1);
    expect(zxingMock.decodeFromStream).not.toHaveBeenCalled();
    expect(onCompleted).not.toHaveBeenCalled();
    expect(readEssentialSnapshot()!.pendingTransition).toBeNull();
  });

  it("releases decoder controls that arrive after the decoder callback already completed", async () => {
    Reflect.deleteProperty(window, "__GVO_QR_TEST_MODE__");
    installCamera();
    zxingMock.decodeFromStream.mockImplementationOnce(
      async (_stream, _video, callback: DecoderCallback) => {
        callback({ getText: () => "/qr/w2" }, undefined);
        return { stop: zxingMock.stop };
      },
    );
    const { onCompleted } = renderGate();
    fireEvent.click(
      screen.getByRole("button", { name: /QR para abrir Sala II/i }),
    );
    await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
    expect(zxingMock.stop).toHaveBeenCalledTimes(1);
  });

  it("transports validated legacy review to the next room with ready=false and no local completion writes", async () => {
    for (const id of [1, 2, 3, 4, 5] as const)
      expect(markStationCompleted(id).ok).toBe(true);
    localStorage.removeItem(ESSENTIAL_STORAGE_KEY);
    invalidateJourneyEssential();
    const state = { finalReview: createFinalReviewContext(1) };
    const context: ValidatedJourneyContext = {
      ...normalContext,
      mode: "legacy_review_compatible",
      reviewReturnAllowed: true,
    };
    installCamera();
    const onBeforeOpen = vi.fn(() => false),
      persistCompletion = vi.fn(() => false);
    const before = readEssentialSnapshot()!,
      progress = localStorage.getItem("gvo.progress.v1");
    const { onCompleted } = renderGate({
      context,
      state,
      ready: false,
      onBeforeOpen,
      persistCompletion,
    });
    expect(before.stations[1].closed).toBe(false);
    await openScanner();
    scan("/qr/w2");
    await waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1));
    expect(onBeforeOpen).not.toHaveBeenCalled();
    expect(persistCompletion).not.toHaveBeenCalled();
    const after = readEssentialSnapshot()!;
    expect(after.stations).toEqual(before.stations);
    expect(after.cover).toEqual(before.cover);
    expect(after.finalReached).toBe(false);
    expect(localStorage.getItem("gvo.progress.v1")).toBe(progress);
    expect(localStorage.getItem("gvo.station5.quiz.v1")).toBeNull();
    expect(after.pendingTransition).toMatchObject({
      kind: "review_navigation",
      reviewContext: state.finalReview,
      from: 1,
      to: "/estacion/2",
    });
    const transported = pendingJourneyNavigationState();
    expect(transported).toMatchObject({
      finalReview: { ...state.finalReview, world: 2 },
    });
    expect(resolveJourneyAccess("/estacion/2", transported)).toMatchObject({
      authorized: true,
      mode: "legacy_review_compatible",
      reviewReturnAllowed: true,
    });
    expect(
      captureValidatedJourneyReviewContext("/estacion/2", transported),
    ).toMatchObject({ world: 2 });
  });

  it("does not rescue a malformed explicit review state with stale session context", () => {
    for (const id of [1, 2, 3, 4, 5] as const)
      expect(markStationCompleted(id).ok).toBe(true);
    sessionStorage.setItem(
      FINAL_REVIEW_CONTEXT_STORAGE_KEY,
      JSON.stringify(createFinalReviewContext(1)),
    );
    const { getUserMedia } = installCamera();
    renderGate({
      context: {
        ...normalContext,
        mode: "legacy_review_compatible",
        reviewReturnAllowed: true,
      },
      state: { finalReview: {} },
      ready: false,
    });
    expect(
      screen.queryByRole("button", { name: /QR para abrir Sala II/i }),
    ).toBeNull();
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("uses a verified manual continuation for an acquired normal prefix without re-opening camera", () => {
    expect(markStationCompleted(1).ok).toBe(true);
    const { getUserMedia } = installCamera();
    const { onCompleted, persistCompletion } = renderGate();
    const before = localStorage.getItem("gvo.progress.v1");
    fireEvent.click(
      screen.getByRole("button", { name: "Continuar a Sala II" }),
    );
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(persistCompletion).not.toHaveBeenCalled();
    expect(localStorage.getItem("gvo.progress.v1")).toBe(before);
    expect(readEssentialSnapshot()!.pendingTransition).toMatchObject({
      kind: "legacy_resume",
      from: 1,
      to: "/estacion/2",
    });
  });
});
