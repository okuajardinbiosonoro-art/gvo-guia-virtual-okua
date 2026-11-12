import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import { confirmEssentialStep, invalidateJourneyEssential, markEssentialPresented, readEssentialSnapshot, setJourneyRuntimeContext, type ValidatedJourneyContext } from "../../app/journey/journeyEssential";
import { GVO_PROGRESS_STORAGE_KEY } from "../../domain/progress/progress.storage";
import { CoverIntroScreen, type CoverIntroScreenProps } from "./CoverIntroScreen";
import { coverIntroDialogues, coverIntroText } from "./coverIntroContent";
import { COVER_INTRO_STORAGE_KEY } from "./coverIntroState";

const context: ValidatedJourneyContext = { active: true, attemptId: "cover-test", screen: "cover", mode: "normal", authorized: true, reviewReturnAllowed: false };
function mount(props: CoverIntroScreenProps = {}, value = context) {
  return render(<MemoryRouter initialEntries={["/portada"]}><JourneyActivationProvider context={value}><CoverIntroScreen {...props} /></JourneyActivationProvider></MemoryRouter>);
}
async function advanceAll() {
  fireEvent.click(screen.getByRole("button", { name: "Empieza aquí" }));
  for (let index = 0; index < 4; index++) {
    await waitFor(() => expect(screen.getByTestId("cover-dialogue-panel")).toHaveAttribute("data-dialogue-id", coverIntroDialogues[index].id));
    const button = screen.getByRole("button", { name: index === 3 ? "¡Adelante!" : "Siguiente diálogo de Lía" });
    await waitFor(() => expect(button).toBeEnabled());
    await act(async () => fireEvent.click(button));
  }
}
beforeEach(() => {
  window.localStorage.clear(); window.sessionStorage.clear();
  invalidateJourneyEssential(); setJourneyRuntimeContext({ ...context, active: false });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Portada OBS03.2", () => {
  it("conserva Portal I visible bloqueado y un solo iniciador, sin omisión", () => {
    const { container } = mount();
    expect(screen.getByRole("button", { name: /Termina la presentación/ })).toBeDisabled();
    expect(container.querySelectorAll("[data-portal-id]")).toHaveLength(1);
    expect(screen.getByRole("button", { name: coverIntroText.cta })).toBeEnabled();
    expect(screen.queryByRole("button", { name: /omitir|sin presentación/i })).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(container.querySelectorAll('[data-lia-rig-layer^="petal-"]')).toHaveLength(5);
  });

  it("un flag antiguo de presentación no habilita Portal I ni se reinterpreta como OBS03", () => {
    window.localStorage.setItem(COVER_INTRO_STORAGE_KEY, "true");
    mount();
    expect(screen.getByRole("button", { name: /Termina la presentación/ })).toBeDisabled();
    expect(readEssentialSnapshot()?.cover.closed).toBe(false);
    expect(window.localStorage.getItem(COVER_INTRO_STORAGE_KEY)).toBe("true");
  });

  it("cuatro avances literales habilitan el portal; sólo el gesto posterior solicita cruce una vez", async () => {
    const enter = vi.fn();
    mount({ onPortalEnter: enter });
    await advanceAll();
    expect(enter).not.toHaveBeenCalled();
    const portal = screen.getByRole("button", { name: "Sala I · Raíz, lista para abrir." });
    expect(portal).toBeEnabled();
    expect(portal).toHaveFocus();
    expect(readEssentialSnapshot()?.cover.confirmedStepIds).toEqual(coverIntroDialogues.map((step) => step.stepId));
    expect(readEssentialSnapshot()?.cover.closed).toBe(true);
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBeNull();
    await act(async () => { fireEvent.click(portal); fireEvent.click(portal); });
    expect(enter).toHaveBeenCalledTimes(1);
  });

  it("renderiza literalmente el escritor y traza cada grupo por sus IDs", async () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Empieza aquí" }));
    for (let index = 0; index < 4; index++) {
      expect(screen.getByText(coverIntroDialogues[index].text)).toBeVisible();
      expect(screen.getByTestId("cover-dialogue-panel")).toHaveAttribute("data-source-ids", coverIntroDialogues[index].sourceIds.join(" "));
      if (index < 3) await act(async () => fireEvent.click(screen.getByRole("button", { name: "Siguiente diálogo de Lía" })));
    }
  });

  it("un fallo de guardado conserva el paso y el portal bloqueado; reintentar no inventa cierre", async () => {
    const { container } = mount();
    const fail = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Blocked", "QuotaExceededError"); });
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Empieza aquí" })));
    expect(screen.getByRole("alert")).toHaveTextContent("No fue posible guardar");
    expect(container.querySelector('[data-portal-id="portal-1"]')).toBeDisabled();
    expect(readEssentialSnapshot()?.cover.closed).toBe(false);
    fail.mockRestore();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Reintentar guardado" })));
    expect(screen.getByTestId("cover-dialogue-panel")).toHaveAttribute("data-dialogue-id", coverIntroDialogues[1].id);
    expect(readEssentialSnapshot()?.cover.confirmedStepIds).toEqual(["saludo"]);
  });

  it("restaura el siguiente segmento confirmado sin repetir ni usar flags legados", async () => {
    setJourneyRuntimeContext(context);
    await markEssentialPresented({ screen: "cover", stepId: "saludo", contentRevision: "OBS03.2", attemptId: context.attemptId, mode: "standard" });
    await confirmEssentialStep({ screen: "cover", stepId: "saludo", contentRevision: "OBS03.2", attemptId: context.attemptId, cause: "visitor_advance" });
    mount();
    expect(screen.getByText(coverIntroDialogues[1].text)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Empieza aquí" })).toBeNull();
  });

  it("preparación inactiva no escribe presentación ni recibe interacción", () => {
    mount({}, { ...context, active: false });
    expect(screen.getByRole("button", { name: "Empieza aquí" })).toBeDisabled();
    expect(readEssentialSnapshot()?.cover.presentedStepIds).toEqual([]);
    expect(window.localStorage.getItem(GVO_PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("EN se resuelve al renderizar, incluidos diálogo, portal y ayudas", async () => {
    mount({ locale: "en" });
    expect(screen.getByRole("heading", { name: "Interactive Exhibition" })).toBeVisible();
    expect(screen.getByRole("button", { name: /Complete the introduction/ })).toBeDisabled();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Start here" })));
    expect(screen.getByText(coverIntroDialogues[0].en)).toBeVisible();
    expect(screen.getByRole("button", { name: "Lía’s next dialogue" })).toBeEnabled();
    expect(screen.queryByText(coverIntroDialogues[0].text)).toBeNull();
  });

  it("revisita validada mantiene cinco accesos y no modifica esencia ni puntos", async () => {
    const revisit = vi.fn();
    mount({ onRevisitRoom: revisit }, { ...context, mode: "legacy_review_compatible", reviewReturnAllowed: true });
    const before = JSON.stringify(readEssentialSnapshot());
    for (const [index, room] of ["Raíz", "Pulso invisible", "Cuaderno de práctica", "Sistema biosonoro", "OKÚA, arte sensorial"].entries()) {
      const roman = ["I", "II", "III", "IV", "V"][index];
      fireEvent.click(screen.getByRole("button", { name: `Revisar Sala ${roman} · ${room}` }));
    }
    expect(revisit.mock.calls.map((call) => call[0])).toEqual([1, 2, 3, 4, 5]);
    expect(JSON.stringify(readEssentialSnapshot())).toBe(before);
  });
});
