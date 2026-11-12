import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ESSENTIAL_STORAGE_KEY, invalidateJourneyEssential, readEssentialSnapshot } from "../../app/journey/journeyEssential";
import { world3PublicSourceBindings, world3SourceOnlyBindings } from "../../content/world3EditorialSlots";
import { renderJourneyRoom, seedEssentialRoom, setMotionPreference, settleRoom } from "../World1Root/obs03TestFixture";
import { World3RootScreen } from "./World3RootScreen";
import { getStation3Content } from "./station3Content";
import { world3NotebookGeometry, world3PageTurnGeometryContract, world3RegisteredRectangle } from "./World3PageTurnLayer";
import { getWorld3CriticalAssetSources, world3RuntimeAssets } from "./world3RuntimeAssets";

const assets = vi.hoisted(() => ({ ready: true }));
vi.mock("../../shared/assets/useAssetPreloader", () => ({ useAssetPreloader: () => ({ ready: assets.ready, status: assets.ready ? "ready" : "loading", failed: 0, timedOut: 0 }) }));
vi.mock("../../app/qr/InterstationQrGate", () => ({ InterstationQrGate: ({ ready, persistCompletion }: { ready: boolean; persistCompletion: () => boolean }) => <button disabled={!ready} onClick={() => persistCompletion()}>QR 3</button> }));

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); invalidateJourneyEssential(); vi.useFakeTimers(); setMotionPreference(); assets.ready = true; });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const room = () => readEssentialSnapshot()!.stations[3];
async function openRecord(order: number) { fireEvent.click(screen.getByRole("button", { name: new RegExp(`Página ${order} de 3`) })); await settleRoom(); }
async function openIntro() { await openRecord(1); }
// Confirmation resolves before a new 680ms turn starts. Flush its full lifetime
// and the following two presentation frames before the next visitor action.
async function advance(label: string) { fireEvent.click(screen.getByRole("button", { name: label })); await settleRoom(400); }
async function reachLastFolio() { while (screen.queryByRole("button", { name: "Siguiente →" })) await advance("Siguiente →"); }
async function confirmChapter() { await reachLastFolio(); await advance("Volver al índice"); }

describe("Sala III · OBS04 literal folios and existing essential chapters", () => {
  it("restores the original proportional notebook, keeps all three numbers and hides QR initially", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom();
    expect(container.querySelector<HTMLImageElement>(".s3-practice-base")?.getAttribute("src")).toBe(world3RuntimeAssets.notebook.openBase);
    expect(container.querySelector<HTMLElement>(".s3-practice-notebook")?.style.borderImageSource).toBe("");
    expect(container.querySelector('[data-lia-clip="intro"][data-lia-target="index"][data-lia-clip-mode="stable"][data-lia-clip-stable-frame="1"]')).not.toBeNull();
    expect(Array.from(container.querySelectorAll(".s3-practice-index .s3-practice-number")).map((node) => node.textContent)).toEqual(["01", "02", "03"]);
    expect(screen.getByRole("button", { name: /Página 2 de 3/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Página 3 de 3/ })).toBeDisabled();
    expect(container.querySelector('[data-record-state="current"][aria-current="page"]')).toHaveAttribute("data-station3-record", "planta");
    expect(container.querySelector('[data-station3-record="prototipo"]')).toHaveAttribute("data-record-state", "locked");
    expect(screen.queryByRole("heading", { name: "conectar" })).toBeNull();
    expect(container.querySelector(".s3-practice-kicker")).toBeNull();
    expect(world3PublicSourceBindings.find((entry) => entry.id === "TXT_3_74471ccd389d")?.text).toBe("conectar");
    expect(getStation3Content("en").connect).toBe("connect");
    expect(screen.queryByText("QR 3")).toBeNull(); expect(room().confirmedStepIds).toEqual([]);
  });
  it("presents pages in order and requires manual close before exposing QR", async () => {
    renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    expect(room().presentedStepIds).toEqual([]); expect(room().confirmedStepIds).toEqual([]);
    await confirmChapter(); expect(room().confirmedStepIds).toEqual(["INTRO"]);
    await openRecord(2);
    expect(screen.getByRole("heading", { name: "PASO A PASO" })).toBeVisible();
    await confirmChapter(); expect(room().confirmedStepIds).toEqual(["INTRO", "PASO A PASO"]);
    expect(screen.queryByText("QR 3")).toBeNull();
    await openRecord(3);
    await advance("Volver al índice"); expect(room().closed).toBe(true);
    expect(room().confirmedStepIds).toEqual(["INTRO", "PASO A PASO", "BENEFICIOS"]);
    expect(screen.getByText("QR 3")).toBeVisible(); expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("returning to index permits previous confirmed consultation without opening future pages", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro(); await confirmChapter();
    expect(screen.getByRole("button", { name: /Página 1 de 3/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Página 2 de 3/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Página 3 de 3/ })).toBeDisabled();
    expect(container.querySelector('[data-station3-record="planta"]')).toHaveAttribute("data-record-state", "completed");
    expect(container.querySelector('[data-station3-record="prototipo"]')).toHaveAttribute("aria-current", "page");
    await openIntro(); expect(room().confirmedStepIds).toEqual(["INTRO"]);
    await confirmChapter(); expect(room().confirmedStepIds).toEqual(["INTRO"]);
  });
  it("never marks presentation, changes focus or starts page motion while inactive", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3, { active: false }); await settleRoom(5000);
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(screen.getByRole("button", { name: /Página 1 de 3/ })).toBeDisabled();
    expect(room().presentedStepIds).toEqual([]); expect(container.querySelector("[data-station3-page-turn]")).toBeNull();
    expect(container.querySelector("[data-lia-active='false']")).not.toBeNull();
  });
  it("waits for the actual resource group and the finite turn before presentation", async () => {
    seedEssentialRoom(3, ["INTRO"]); assets.ready = false;
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(5000);
    expect(room().presentedStepIds).toEqual(["INTRO"]);
    expect(screen.getByRole("button", { name: /Página 2 de 3/ })).toBeDisabled();
    assets.ready = true; await act(async () => invalidateJourneyEssential()); await settleRoom();
    expect(room().presentedStepIds).toEqual(["INTRO"]);
    await openRecord(2);
    await advance("Siguiente →");
    expect(room().presentedStepIds).toEqual(["INTRO", "PASO A PASO"]);
    expect(container.querySelector("[data-critical-assets-ready='true']")).not.toBeNull();
  });
  it("leaves both legacy checkpoint versions and explicit physical declarations byte intact", async () => {
    const v1 = '{"schemaVersion":1,"completedRecordIds":["planta","prototipo"],"updatedAt":"2026-08-05T18:00:00.000Z"}';
    const v2 = '{"schemaVersion":2,"updatedAt":"2026-10-23T18:00:00.000Z","visitedPages":["prototipo"],"reviewedPages":["prototipo"],"skippedPages":[],"practiceStatus":"declared_done","activityContinued":true}';
    localStorage.setItem("gvo.station3.v1", v1); localStorage.setItem("gvo.station3.practice.v2", v2);
    renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro(); await confirmChapter();
    expect(localStorage.getItem("gvo.station3.v1")).toBe(v1); expect(localStorage.getItem("gvo.station3.practice.v2")).toBe(v2);
    expect(room().closed).toBe(false); expect(screen.queryByText("QR 3")).toBeNull();
    expect(Object.keys(room())).not.toContain("practiceStatus");
  });
  it("fails closed on confirmation write and retries the same action without losing the page", async () => {
    renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    await reachLastFolio();
    const original = Storage.prototype.setItem; let fail = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function(this: Storage, key, value) { if (key === ESSENTIAL_STORAGE_KEY && fail) throw new Error("quota"); original.call(this, key, value); });
    await confirmChapter(); expect(room().confirmedStepIds).toEqual([]);
    expect(screen.getByRole("heading", { name: "INTRO" })).toBeVisible(); expect(screen.queryByText("QR 3")).toBeNull(); expect(screen.getByRole("alert")).toBeVisible();
    fail = false; await advance("Reintentar");
    expect(room().confirmedStepIds).toEqual(["INTRO"]); expect(screen.getByRole("button", { name: /Página 2 de 3/ })).toBeEnabled();
  });
  it("supports validated Mirador consultation without rewriting essential or legacy facts", async () => {
    seedEssentialRoom(3); const before = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    renderJourneyRoom(<World3RootScreen />, 3, { mode: "legacy_review_compatible" }); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: /Página 3 de 3/ })); await settleRoom();
    expect(screen.getByRole("heading", { name: "BENEFICIOS" })).toBeVisible();
    expect(screen.getByText("QR 3")).toBeVisible(); expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
  });
  it("keeps practice optional, retains attention literally and omits all three D17 units", async () => {
    seedEssentialRoom(3, ["INTRO"]); renderJourneyRoom(<World3RootScreen />, 3); await settleRoom();
    expect(screen.queryByText("La práctica es opcional. Continúa cuando quieras.")).toBeNull();
    await openRecord(2);
    expect(screen.queryByRole("button", { name: /practicar|práctica completada|iniciar práctica/i })).toBeNull();
    await confirmChapter();
    await openRecord(3);
    expect(screen.getByText("Entrenamiento de la atención plena y la escucha profunda.")).toBeVisible();
    expect(getStation3Content("es").records[2].fragments).toEqual(["Entrenamiento de la atención plena y la escucha profunda."]);
    expect(world3SourceOnlyBindings.map((item) => item.id)).toHaveLength(3);
    expect(world3SourceOnlyBindings.every((item) => !world3PublicSourceBindings.some((entry) => (entry.id as string) === item.id))).toBe(true);
    expect(getStation3Content("es").closing).toBe("Ve a la siguiente caja y escanea el código QR para continuar tu recorrido.");
  });
  it("gives each illustration a native reversible selection without crediting completion", async () => {
    renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    const motif = screen.getByRole("button", { name: "Explorar ilustración: INTRO" });
    fireEvent.click(motif); expect(motif).toHaveAttribute("aria-pressed", "true"); expect(room().confirmedStepIds).toEqual([]);
    expect(document.querySelector('[data-lia-action="respond"]')).toHaveAttribute("data-lia-clip-mode", "play");
    fireEvent.click(motif); expect(motif).toHaveAttribute("aria-pressed", "false"); expect(room().closed).toBe(false);
    expect(document.querySelector('[data-lia-target="planta"]')).toHaveAttribute("data-lia-clip-mode", "stable");
  });
  it("uses the same confirmation requirements with reduced motion and settles resize geometry", async () => {
    setMotionPreference(true); const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: /Página 1 de 3/ }));
    expect(container.querySelector("[data-station3-page-turn-motion='reduced']")).not.toBeNull();
    fireEvent(window, new Event("resize")); await settleRoom();
    expect(container.querySelector("[data-station3-page-turn]")).toBeNull(); expect(room().confirmedStepIds).toEqual([]); expect(screen.queryByText("QR 3")).toBeNull();
  });
  it("resolves English content at render rather than publishing Spanish under en", async () => {
    localStorage.setItem("gvo.language.v1", "en"); renderJourneyRoom(<World3RootScreen />, 3); await settleRoom();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Room III · Practice notebook");
    expect(screen.getByText(/It is time to connect your energy with the energy of Nature/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Page 1 of 3/ })); await settleRoom();
    expect(screen.getByText(/Find a comfortable place/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Next →" })).toBeVisible();
    expect(screen.queryByText(/Ha llegado el momento de conectar/)).toBeNull();
  });
  it("registers the measured original and paper rectangles without consuming the rejected folio", () => {
    const { alpha, contentPaper, turnPaper } = world3NotebookGeometry;
    expect(alpha).toEqual({ left: 317, top: 13, width: 892, height: 989 });
    for (const rect of [contentPaper, turnPaper]) { expect(rect.left).toBeGreaterThanOrEqual(alpha.left); expect(rect.left + rect.width).toBeLessThanOrEqual(alpha.left + alpha.width); expect(rect.top + rect.height).toBeLessThanOrEqual(alpha.top + alpha.height); }
    expect(contentPaper.left).toBeGreaterThan(447);
    expect(contentPaper.height).toBeGreaterThan(750);
    expect(world3RegisteredRectangle(contentPaper).left).toBe(`${163 / 892 * 100}%`);
    expect(world3PageTurnGeometryContract.transformOrigin).toBe("0% 50%");
    expect([null, "planta", "prototipo", "senal"].flatMap((page) => getWorld3CriticalAssetSources(page as "planta" | "prototipo" | "senal" | null))).not.toContain(world3RuntimeAssets.notebook.folio);
  });
  it("maps six illustrated leaves without adding essential IDs", () => {
    const records = getStation3Content("es").records;
    expect(records.map((record) => record.folios.length)).toEqual([3, 2, 1]);
    expect(records.map((record) => record.id)).toEqual(["planta", "prototipo", "senal"]);
    expect(records[0].folios.map((folio) => folio.sourceId)).toEqual(["TXT_3_ea0217fac7f6", "TXT_3_d1384cb3c055", "TXT_3_f4d4d818e31e"]);
    for (const record of records) for (const folio of record.folios) {
      expect(world3PublicSourceBindings.some((binding) => binding.id === folio.sourceId)).toBe(true);
    }
    expect(getStation3Content("en").records.map((record) => record.folios.length)).toEqual([3, 2, 1]);
    expect(records.flatMap(record => record.folios.flatMap(folio => [folio.illustration, ...(folio.steps ?? []).map(step => step.illustration)])).filter(Boolean)).toHaveLength(7);
  });
  it("shows every complete INTRO block and never confirms from a leaf or animation", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    const folios = getStation3Content("es").records[0].folios;
    for (let index = 0; index < folios.length; index++) {
      expect(container.querySelector('[data-station3-page="planta"] .s3-practice-instructions p')?.textContent).toBe(folios[index].text);
      expect(container.querySelector('[data-station3-page="planta"]')).toHaveAttribute("data-station3-folio-source", folios[index].sourceId);
      expect(room().confirmedStepIds).toEqual([]); expect(room().closed).toBe(false);
      if (index < folios.length - 1) { expect(room().presentedStepIds).toEqual([]); await advance("Siguiente →"); }
    }
    expect(room().presentedStepIds).toEqual(["INTRO"]);
    await settleRoom(5000); expect(room().confirmedStepIds).toEqual([]); expect(screen.queryByText("QR 3")).toBeNull();
    await advance("Volver al índice"); expect(room().confirmedStepIds).toEqual(["INTRO"]);
  });
  it("keeps page-edge navigation outside the original reading paper", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    const navigation = screen.getByRole("navigation", { name: "Páginas del cuaderno" });
    expect(navigation.closest(".s3-practice-paper")).toBeNull();
    expect(container.querySelector('.s3-practice-paper nav')).toBeNull();
    expect(container.querySelector('[data-station3-navigation="outside-original-paper"]')).toContainElement(navigation);
    expect(screen.getByRole("status")).toHaveTextContent("INTRO · Hoja 1 de 3");
  });
  it("turns backwards and returns to the first local leaf without inventing completion", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom(); await openIntro();
    await advance("Siguiente →"); expect(container.querySelector("main")).toHaveAttribute("data-station3-folio", "2");
    await advance("Anterior"); expect(container.querySelector("main")).toHaveAttribute("data-station3-folio", "1");
    await advance("Índice");
    expect(room().confirmedStepIds).toEqual([]); expect(screen.getByRole("button", { name: /Página 2 de 3/ })).toBeDisabled();
    await openIntro(); expect(container.querySelector("main")).toHaveAttribute("data-station3-folio", "1");
    expect(screen.queryByRole("button", { name: "PASO A PASO →" })).toBeNull();
  });
  it("starts the principal clip and motif only after the authentic turn settles", async () => {
    const { container } = renderJourneyRoom(<World3RootScreen />, 3); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: /Página 1 de 3/ }));
    expect(container.querySelector("[data-station3-page-turn]")).not.toBeNull();
    expect(container.querySelector('[data-lia-target="planta"]')).toHaveAttribute("data-lia-motion-enabled", "false");
    expect(container.querySelector('[data-lia-target="planta"]')).toHaveAttribute("data-lia-clip-mode", "stable");
    expect(container.querySelector('[data-station3-page="planta"]')).toHaveAttribute("data-motif-presenting", "false");
    await settleRoom();
    expect(container.querySelector('[data-lia-target="planta"]')).toHaveAttribute("data-lia-clip-mode", "play");
    expect(container.querySelector('[data-station3-page="planta"]')).toHaveAttribute("data-motif-presenting", "true");
    expect(room().confirmedStepIds).toEqual([]);
  });
  it("revisits all six leaves without changing essential or legacy bytes", async () => {
    seedEssentialRoom(3); const before = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    const v1 = '{"schemaVersion":1,"completedRecordIds":[],"updatedAt":"2026-08-05T18:00:00.000Z"}';
    localStorage.setItem("gvo.station3.v1", v1);
    renderJourneyRoom(<World3RootScreen />, 3, { mode: "legacy_review_compatible" }); await settleRoom(); await openIntro();
    await confirmChapter(); await openRecord(2); await confirmChapter(); await openRecord(3); await advance("Volver al índice");
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before); expect(localStorage.getItem("gvo.station3.v1")).toBe(v1);
    expect(room().confirmedStepIds).toEqual([]); expect(screen.getByText("QR 3")).toBeVisible();
  });
  it("resets local leaves across attempts and cannot finish an old turn into a new chapter", async () => {
    const view = renderJourneyRoom(<World3RootScreen />, 3, { attemptId: "old-folio-attempt" }); await settleRoom(); await openIntro();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente →" }));
    view.rerenderJourney({ active: false, attemptId: null }); view.rerenderJourney({ active: true, attemptId: "new-folio-attempt" });
    await settleRoom(5000); await openIntro();
    expect(view.container.querySelector("main")).toHaveAttribute("data-station3-folio", "1");
    expect(room().presentedStepIds).toEqual([]); expect(room().confirmedStepIds).toEqual([]); expect(screen.queryByText("QR 3")).toBeNull();
  });
});
