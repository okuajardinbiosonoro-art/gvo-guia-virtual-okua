import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ESSENTIAL_STORAGE_KEY, invalidateJourneyEssential, readEssentialSnapshot } from "../../app/journey/journeyEssential";
import { getWorld2Content, world2Obs03Sources } from "../../content/world2EditorialSlots";
import { World2RootScreen } from "./World2RootScreen";
import { renderJourneyRoom, seedEssentialRoom, setMotionPreference, settleRoom } from "../World1Root/obs03TestFixture";

vi.mock("../../shared/assets/useAssetPreloader", () => ({ useAssetPreloader: () => ({ ready: true, status: "ready", failed: 0, timedOut: 0 }) }));
vi.mock("../../app/qr/InterstationQrGate", () => ({ InterstationQrGate: ({ originWorld, ready, persistCompletion, onCompleted }: { originWorld: number; ready: boolean; persistCompletion: () => boolean; onCompleted: () => void }) => <button disabled={!ready} onClick={() => { if (persistCompletion()) onCompleted(); }}>{`QR ${originWorld}`}</button> }));
beforeEach(() => { localStorage.clear(); invalidateJourneyEssential(); vi.useFakeTimers(); setMotionPreference(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const room = () => readEssentialSnapshot()!.stations[2];
async function advance() { fireEvent.click(screen.getByRole("button", { name: "Continuar" })); await settleRoom(); }
async function showResult() { fireEvent.click(screen.getByRole("button", { name: "Ver resultado" })); await settleRoom(); }
async function openReadout(name: string) { fireEvent.click(screen.getByRole("button", { name })); await settleRoom(); }
async function startCapture() {
  renderJourneyRoom(<World2RootScreen />, 2);
  await settleRoom();
  await openReadout("Abrir Punto de lectura");
  await advance();
  await openReadout("Expandir señal medida");
  await advance();
}

describe("Sala II · OBS03 ordered presentation", () => {
  it("presents Plant without enabling QR or writing the legacy checkpoint", async () => {
    renderJourneyRoom(<World2RootScreen />, 2); await settleRoom();
    expect(room().presentedStepIds).toEqual([]); expect(room().confirmedStepIds).toEqual([]);
    expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
    expect(localStorage.getItem("gvo.station2.v1")).toBeNull(); expect(screen.queryByText("QR 2")).toBeNull();
  });
  it("keeps future layers locked despite arbitrary old completed global bits", async () => {
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1,2], updatedAt: "2026-08-05T12:00:00.000Z" })); invalidateJourneyEssential();
    const { container } = renderJourneyRoom(<World2RootScreen />, 2); await settleRoom();
    fireEvent.click(container.querySelector('[data-world2-layer="resultado_mediado"]')!); await settleRoom();
    expect(room().confirmedStepIds).toEqual([]); expect(room().closed).toBe(false); expect(screen.queryByText("QR 2")).toBeNull();
  });
  it("completes assisted content in order without inventing manual microinteractions", async () => {
    await startCapture(); await showResult();
    expect(room().assistedPresentedStepIds).toContain("captura");
    expect(room().interactionEvidence.map(fact => fact.id)).toEqual(["plant_contact_readout_seen", "signal_measured_wave_seen"]);
    await advance();
    await openReadout("Ver filtrado");
    await settleRoom(3400);
    await advance();
    await showResult(); expect(room().assistedPresentedStepIds).toContain("mapeo"); await advance();
    await showResult(); expect(room().assistedPresentedStepIds).toContain("musica");
    expect(screen.queryByText("QR 2")).toBeNull(); expect(room().closed).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar Música" })); await settleRoom();
    expect(room().closed).toBe(true); expect(screen.getByText("QR 2")).toBeVisible();
    expect(room().confirmedStepIds).toEqual(["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"]);
    expect(room().interactionEvidence.map(fact => fact.id)).toEqual(["plant_contact_readout_seen", "signal_measured_wave_seen"]); expect(localStorage.getItem("gvo.station2.v1")).toBeNull();
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("records only the capture steps really shown after explicit actions", async () => {
    await startCapture();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar paso 3: Datos al sistema" })); await settleRoom();
    expect(room().interactionEvidence.filter((fact) => fact.kind === "capture_step").map((fact) => fact.id)).toEqual(["system"]);
    expect(room().presentedStepIds).not.toContain("captura");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar paso 1: Contacto" })); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: "Mostrar paso 2: Señal tomada" })); await settleRoom();
    expect(room().interactionEvidence.filter((fact) => fact.kind === "capture_step").map((fact) => fact.id)).toEqual(["system", "contact", "signal"]);
    expect(room().interactionEvidence.some((fact) => fact.id === "capture_data_readout_seen")).toBe(true);
    expect(room().interactionEvidence.some((fact) => fact.id === "plant_contact_readout_seen")).toBe(true);
    expect(room().assistedPresentedStepIds).not.toContain("captura");
  });
  it("records plant/signal readouts only after the content is shown, without legacy writes", async () => {
    renderJourneyRoom(<World2RootScreen />, 2); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: "Abrir Punto de lectura" })); await settleRoom();
    expect(room().interactionEvidence.map((fact) => fact.id)).toEqual(["plant_contact_readout_seen"]);
    expect(screen.getByText(getWorld2Content("es").readouts.plant.text)).toBeVisible(); await advance();
    fireEvent.click(screen.getByRole("button", { name: "Expandir señal medida" })); await settleRoom();
    expect(room().interactionEvidence.map((fact) => fact.id)).toEqual(["plant_contact_readout_seen", "signal_measured_wave_seen"]);
    expect(localStorage.getItem("gvo.station2.v1")).toBeNull();
  });
  it("preserves legacy bytes even after new manual or assisted actions", async () => {
    const raw = JSON.stringify({ schemaVersion: 1, activeLayerId: "planta_viva", visitedLayerIds: ["planta_viva"], highestUnlockedLayerOrder: 2, completedRequiredInteractions: [], capture: { currentStepId: "contact", visitedStepIds: ["contact"] }, mappingFirstRunComplete: false, resultState: "not_started", activityContinued: true, updatedAt: "2026-08-05T12:00:00.000Z" });
    localStorage.setItem("gvo.station2.v1", raw); await startCapture(); await showResult(); await advance();
    expect(localStorage.getItem("gvo.station2.v1")).toBe(raw); expect(room().closed).toBe(false);
  });
  it("writes no presentation or interaction while mounted for preparation", async () => {
    renderJourneyRoom(<World2RootScreen />, 2, { active: false }); await settleRoom(20000);
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull(); expect(room().presentedStepIds).toEqual([]); expect(room().interactionEvidence).toEqual([]);
    expect(screen.queryByText("QR 2")).toBeNull();
  });
  it("allows visible read-only legacy review without changing semantic bytes", async () => {
    seedEssentialRoom(2); const raw = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    const { container } = renderJourneyRoom(<World2RootScreen />, 2, { mode: "legacy_review_compatible" }); await settleRoom();
    fireEvent.click(container.querySelector('[data-world2-layer="captura"]')!); await settleRoom(); await showResult();
    expect(screen.getByText("QR 2")).toBeVisible(); expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(raw);
  });
  it("returns already-closed read-only Music to closure without replaying or writing semantic facts", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], { closed: true });
    const raw = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    const { container } = renderJourneyRoom(<World2RootScreen />, 2, { mode: "legacy_review_compatible" });
    await settleRoom();
    fireEvent.click(container.querySelector('[data-world2-layer="resultado_mediado"]')!);
    await settleRoom(10000);
    expect(container.querySelector('[data-world2-option6-stage="resolved"]')).toHaveAttribute("data-world2-option6-complete", "true");
    const close = screen.getByRole("button", { name: "Cerrar Música" });
    expect(close).toBeEnabled();
    fireEvent.click(close); await settleRoom();
    expect(container.querySelector("main")).toHaveAttribute("data-world2-state", "ready_to_continue");
    expect(screen.getByText("QR 2")).toBeVisible();
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(raw);
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
    expect(localStorage.getItem("gvo.station2.v1")).toBeNull();
  });
  it("does not advance after a failed essential write and retries the same step", async () => {
    renderJourneyRoom(<World2RootScreen />, 2); await settleRoom();
    await openReadout("Abrir Punto de lectura");
    const original = Storage.prototype.setItem; let fail = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function(this: Storage, key, value) { if (key === ESSENTIAL_STORAGE_KEY && fail) throw new Error("quota"); original.call(this, key, value); });
    await advance(); expect(room().confirmedStepIds).toEqual([]); expect(screen.queryByText("QR 2")).toBeNull();
    fail = false; fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await settleRoom(); expect(room().confirmedStepIds).toEqual(["planta"]);
  });
  it("requires an explicit visual filter and cancels when the page is hidden", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura"]);
    const {container} = renderJourneyRoom(<World2RootScreen />, 2);
    await settleRoom();
    expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
    await openReadout("Ver filtrado");
    expect(container.querySelector('[data-world2-filter-demo="running"]')).toBeInTheDocument();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    fireEvent(document, new Event("visibilitychange"));
    await settleRoom(3000);
    expect(room().presentedStepIds).not.toContain("acondicionamiento");
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    fireEvent(document, new Event("visibilitychange"));
    await openReadout("Ver filtrado");
    await settleRoom(500);
    expect(container.querySelector('[data-world2-filter-demo="running"]')).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continuar" })).toBeNull();
    await settleRoom(700);
    expect(screen.getByRole("button", {name:"Continuar"})).toBeEnabled();
    expect(room().confirmedStepIds).not.toContain("acondicionamiento");
    expect(container.querySelector("audio")).toBeNull();
  });
  it("normal convergence presents the result but never closes Music by timer", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura", "acondicionamiento", "mapeo"]);
    renderJourneyRoom(<World2RootScreen />, 2); await settleRoom(4000);
    expect(room().presentedStepIds).toContain("musica"); expect(room().closed).toBe(false); expect(screen.queryByText("QR 2")).toBeNull();
    expect(screen.getByRole("button", { name: "Cerrar Música" })).toBeVisible();
  });
  it("hidden time cannot finish convergence or close Music", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura", "acondicionamiento", "mapeo"]);
    renderJourneyRoom(<World2RootScreen />, 2); await settleRoom(200);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" }); fireEvent(document, new Event("visibilitychange"));
    await settleRoom(15000); expect(room().presentedStepIds).not.toContain("musica"); expect(room().closed).toBe(false);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" }); fireEvent(document, new Event("visibilitychange"));
    await settleRoom(4000); expect(room().presentedStepIds).toContain("musica"); expect(room().closed).toBe(false);
  });
  it("renders English narrative and capture controls without Spanish fallback", async () => {
    localStorage.setItem("gvo.language.v1", "en"); renderJourneyRoom(<World2RootScreen />, 2); await settleRoom();
    expect(screen.getByText(getWorld2Content("en").layers.planta_viva.dialogue)).toBeVisible();
    await openReadout("Open reading point");
    expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
    expect(screen.queryByText(getWorld2Content("es").layers.planta_viva.dialogue)).toBeNull();
  });
  it("keeps both historical keep literals out of replacement text", () => {
    const entry = world2Obs03Sources.find((source) => source.id === "TXT_2_cd264feb015e")!;
    expect(entry.action).toBe("keep"); expect(getWorld2Content("es").capture[0].readout).toContain("una variación bioeléctrica muy pequeña");
    expect(getWorld2Content("es").layers.senal.dialogue).toContain("susceptible");
    for (const source of world2Obs03Sources) for (const segment of source.segments) expect(source.writerText.slice(segment.start, segment.end)).toBe(segment.text);
  });
});
