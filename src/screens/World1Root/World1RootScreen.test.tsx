import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ESSENTIAL_STORAGE_KEY, invalidateJourneyEssential, readEssentialSnapshot } from "../../app/journey/journeyEssential";
import { getWorld1Editorial, world1Obs03Sources } from "../../content/world1EditorialSlots";
import { World1RootScreen } from "./World1RootScreen";
import { renderJourneyRoom, seedEssentialRoom, setMotionPreference, settleRoom } from "./obs03TestFixture";

vi.mock("../../shared/assets/useAssetPreloader", () => ({ useAssetPreloader: () => ({ ready: true, status: "ready", failed: 0, timedOut: 0 }) }));
vi.mock("../../app/qr/InterstationQrGate", () => ({ InterstationQrGate: ({ originWorld, ready, persistCompletion, onCompleted }: { originWorld: number; ready: boolean; persistCompletion: () => boolean; onCompleted: () => void }) => <button disabled={!ready} onClick={() => { if (persistCompletion()) onCompleted(); }}>{`QR ${originWorld}`}</button> }));

beforeEach(() => { localStorage.clear(); invalidateJourneyEssential(); vi.useFakeTimers(); setMotionPreference(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const room = () => readEssentialSnapshot()!.stations[1];
async function advance(label = "Continuar") { fireEvent.click(screen.getByRole("button", { name: label })); await settleRoom(); }

describe("Sala I · OBS03 essential flow", () => {
  it("does not mount QR or confirm anything at initial presentation", async () => {
    renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    expect(room().presentedStepIds).toEqual(["intro"]);
    expect(room().confirmedStepIds).toEqual([]);
    expect(screen.queryByText("QR 1")).toBeNull();
    expect(screen.getByRole("button", { name: "PERCEPCIÓN bloqueada en esta fase" })).toBeDisabled();
  });
  it("requires all four manual advances and closes only at Mediation", async () => {
    renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    await advance(); expect(room().confirmedStepIds).toEqual(["intro"]);
    await advance(); expect(room().confirmedStepIds).toEqual(["intro", "relacion"]);
    await advance(); expect(room().confirmedStepIds).toEqual(["intro", "relacion", "percepcion"]);
    expect(screen.queryByText("QR 1")).toBeNull();
    await advance("Cerrar"); expect(room().closed).toBe(true);
    expect(screen.getByText("QR 1")).toBeVisible();
    expect(localStorage.getItem("gvo.progress.v1")).toBeNull();
  });
  it("opening a root cannot skip the current unconfirmed block", async () => {
    const { container } = renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    const root = container.querySelector<HTMLButtonElement>('[data-world1-root-node="relation"]')!;
    expect(root).toBeDisabled(); fireEvent.click(root); await settleRoom();
    expect(room().confirmedStepIds).toEqual([]);
    expect(room().activeStepId).toBe("intro");
  });
  it("keeps More outside the scroll viewport, preserves literal continuation and makes it optional", async () => {
    const { container } = renderJourneyRoom(<World1RootScreen />, 1); await settleRoom(); await advance();
    const more = screen.getByRole("button", { name: "+ Más" });
    expect(container.querySelector("[data-world1-scroll-viewport]")?.contains(more)).toBe(false);
    fireEvent.click(more);
    expect(screen.getByText(getWorld1Editorial("es").details.relation!)).toBeVisible();
    expect(room().confirmedStepIds).toEqual(["intro"]);
    expect(room().closed).toBe(false);
  });
  it("mounts and measures a passive scene without writing or running arrival", async () => {
    renderJourneyRoom(<World1RootScreen />, 1, { active: false }); await settleRoom(5000);
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBeNull();
    expect(room().presentedStepIds).toEqual([]);
    expect(screen.queryByText("QR 1")).toBeNull();
  });
  it("does not trust legacy optional continuation or global bits as essential closure", async () => {
    const raw = JSON.stringify({ schemaVersion: 1, activeConcept: "intro", highestReachedConcept: "intro", visitedConcepts: [], activityContinued: true, updatedAt: "2026-08-05T12:00:00.000Z" });
    localStorage.setItem("gvo.station1.v1", raw); localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1], updatedAt: "2026-08-05T12:00:00.000Z" })); invalidateJourneyEssential();
    renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    expect(room().activeStepId).toBe("intro"); expect(room().closed).toBe(false);
    expect(localStorage.getItem("gvo.station1.v1")).toBe(raw); expect(screen.queryByText("QR 1")).toBeNull();
  });
  it("preserves verified state on write failure and retries only the pending confirmation", async () => {
    renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    const original = Storage.prototype.setItem; let fail = true;
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function(this: Storage, key, value) { if (key === ESSENTIAL_STORAGE_KEY && fail) throw new Error("quota"); original.call(this, key, value); });
    await advance(); expect(room().confirmedStepIds).toEqual([]); expect(screen.queryByText("QR 1")).toBeNull();
    fail = false; fireEvent.click(screen.getByRole("button", { name: "Reintentar" })); await settleRoom();
    expect(room().confirmedStepIds).toEqual(["intro"]);
  });
  it("permits validated read-only review without semantic writes", async () => {
    seedEssentialRoom(1); const before = localStorage.getItem(ESSENTIAL_STORAGE_KEY);
    renderJourneyRoom(<World1RootScreen />, 1, { mode: "legacy_review_compatible" }); await settleRoom();
    fireEvent.click(screen.getByRole("button", { name: "Explorar MEDIACIÓN" })); await settleRoom();
    expect(screen.getByText("QR 1")).toBeVisible();
    expect(localStorage.getItem(ESSENTIAL_STORAGE_KEY)).toBe(before);
  });
  it("renders English narrative and controls from the render-time locale", async () => {
    localStorage.setItem("gvo.language.v1", "en"); renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
    expect(screen.getByText("Before listening, we must learn to observe:")).toBeVisible();
    expect(screen.getByRole("button", { name: "+ More" })).toBeVisible();
    expect(screen.queryByText("Antes de escuchar, debemos aprender a observar:")).toBeNull();
  });
  it.each([
    { locale: "es" as const, prefix: "Lectura vertical", narrativeLabel: "Narrativa de Sala I con desplazamiento vertical manual" },
    { locale: "en" as const, prefix: "Vertical reading", narrativeLabel: "Room I narrative with manual vertical scrolling" },
  ])("localizes the vertical hint metadata while preserving its decorative semantics ($locale)", async ({ locale, prefix, narrativeLabel }) => {
    // jsdom has no layout. Supply only the small-viewport/overflow measurement
    // needed to mount the actual hint; do not replace the shared consumer.
    vi.stubGlobal("innerWidth", 320); vi.stubGlobal("innerHeight", 568); vi.stubGlobal("visualViewport", undefined);
    vi.spyOn(Element.prototype, "scrollHeight", "get").mockImplementation(function(this: Element) { return this.hasAttribute("data-world1-scroll-viewport") ? 400 : 0; });
    vi.spyOn(Element.prototype, "clientHeight", "get").mockImplementation(function(this: Element) { return this.hasAttribute("data-world1-scroll-viewport") ? 100 : 0; });
    try {
      localStorage.setItem("gvo.language.v1", locale);
      renderJourneyRoom(<World1RootScreen />, 1); await settleRoom();
      const hint = document.querySelector(".world1-root-gesture-hint");
      expect(hint).not.toBeNull();
      expect(hint).toHaveAttribute("data-gvo-gesture-target-label", `${prefix}: ${getWorld1Editorial(locale).conceptCopy.intro.title.text}`);
      expect(hint).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByLabelText(narrativeLabel)).toHaveAttribute("tabindex", "0");
      expect(room().confirmedStepIds).toEqual([]); expect(room().closed).toBe(false);
    } finally { vi.unstubAllGlobals(); }
  });
  it("supports reduced motion with the same manual confirmation requirements", async () => {
    setMotionPreference(true); renderJourneyRoom(<World1RootScreen />, 1); await settleRoom(); await advance();
    expect(room().presentedStepIds).toContain("relacion"); expect(room().confirmedStepIds).toEqual(["intro"]); expect(room().closed).toBe(false);
  });
  it("keeps writer source spans immutable and applies the registered errata only to display", () => {
    const source = world1Obs03Sources.find((entry) => entry.id === "TXT_1_08d39e75680b")!;
    expect(source.writerText).toContain("percebir");
    expect(getWorld1Editorial("es").conceptCopy.mediation.body.text).toContain("percibir");
    for (const entry of world1Obs03Sources) for (const segment of entry.segments) expect(entry.writerText.slice(segment.start, segment.end)).toBe(segment.text);
  });
});
