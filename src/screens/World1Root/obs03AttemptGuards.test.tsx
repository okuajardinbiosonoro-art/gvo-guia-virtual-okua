import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { invalidateJourneyEssential, readEssentialSnapshot } from "../../app/journey/journeyEssential";
import { World1RootScreen } from "./World1RootScreen";
import { World2RootScreen } from "../World2Root/World2RootScreen";
import { World3RootScreen } from "../World3Root/World3RootScreen";
import { renderJourneyRoom, seedEssentialRoom, setMotionPreference, settleRoom } from "./obs03TestFixture";

type Mode = "standard" | "assisted";
const panels = vi.hoisted(() => ({
  mapping: [] as Array<{ present?: (mode: Mode) => void; complete: () => void }>,
  music: [] as Array<(mode: Mode) => void>,
}));
vi.mock("../../shared/assets/useAssetPreloader", () => ({ useAssetPreloader: () => ({ ready: true, status: "ready", failed: 0, timedOut: 0 }) }));
vi.mock("../../app/qr/InterstationQrGate", () => ({ InterstationQrGate: () => null }));
// Keep callbacks from an actual consumer render, then deliberately deliver them
// after reactivation. This models an already queued task despite cleanup.
vi.mock("../World2Root/World2MappingPanel", () => ({ World2MappingPanel: ({ onPresented, onFirstRunComplete }: { onPresented?: (mode: Mode) => void; onFirstRunComplete: () => void }) => { panels.mapping.push({ present: onPresented, complete: onFirstRunComplete }); return <div />; } }));
vi.mock("../World2Root/World2MediatedResultPanel", () => ({ World2MediatedResultPanel: ({ onComplete }: { onComplete: (mode: Mode) => void }) => { panels.music.push(onComplete); return <div />; } }));

beforeEach(() => { localStorage.clear(); invalidateJourneyEssential(); vi.useFakeTimers(); setMotionPreference(true); panels.mapping = []; panels.music = []; });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("OBS03 R3 · attempt-bound consumer callbacks", () => {
  for (const station of [1, 2, 3] as const) {
    it(`does not recycle an old presentation frame into reactivated room ${station}`, async () => {
      if (station === 3) seedEssentialRoom(3, ["INTRO", "PASO A PASO"]);
      let frameId = 0;
      const queued = new Map<number, FrameRequestCallback>();
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { queued.set(++frameId, callback); return frameId; });
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
      const component = station === 1 ? <World1RootScreen /> : station === 2 ? <World2RootScreen /> : <World3RootScreen />;
      const view = renderJourneyRoom(component, station, { attemptId: "old-attempt" });
      if (station === 2) fireEvent.click(screen.getByRole("button", { name: "Abrir Punto de lectura" }));
      if (station === 3) fireEvent.click(view.container.querySelector('[data-station3-record="senal"]')!);
      if (station !== 1) await settleRoom();
      const oldFrames = [...queued.values()];
      expect(oldFrames.length).toBeGreaterThan(0);
      const before = JSON.stringify(readEssentialSnapshot()!.stations[station]);
      view.rerenderJourney({ active: false, attemptId: null });
      view.rerenderJourney({ active: true, attemptId: "new-attempt" });
      queued.clear(); // Do not execute legitimate new-attempt frames in this probe.
      await act(async () => { oldFrames.forEach((callback) => callback(1000)); await Promise.resolve(); });
      const oldNestedFrames = [...queued.values()]; queued.clear();
      await act(async () => { oldNestedFrames.forEach((callback) => callback(1016)); await Promise.resolve(); });
      expect(JSON.stringify(readEssentialSnapshot()!.stations[station])).toBe(before);
    });
  }
  it("rejects an old Mapping animation and manual completion without crediting the new attempt", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura", "acondicionamiento"]);
    const view = renderJourneyRoom(<World2RootScreen />, 2, { attemptId: "old-attempt" }); await settleRoom();
    const old = panels.mapping.at(-1)!;
    view.rerenderJourney({ active: false, attemptId: null });
    view.rerenderJourney({ active: true, attemptId: "new-attempt" });
    await act(async () => { old.present?.("assisted"); old.complete(); }); await settleRoom();
    expect(readEssentialSnapshot()!.stations[2].presentedStepIds).not.toContain("mapeo");
    expect(readEssentialSnapshot()!.stations[2].interactionEvidence).toEqual([]);
    await act(async () => panels.mapping.at(-1)!.present?.("assisted")); await settleRoom();
    expect(readEssentialSnapshot()!.stations[2].assistedPresentedStepIds).toContain("mapeo");
  });
  it("rejects an old Music completion before it can present content in the reactivated attempt", async () => {
    seedEssentialRoom(2, ["planta", "senal", "captura", "acondicionamiento", "mapeo"]);
    const view = renderJourneyRoom(<World2RootScreen />, 2, { attemptId: "old-attempt" }); await settleRoom();
    const old = panels.music.at(-1)!;
    view.rerenderJourney({ active: false, attemptId: null });
    view.rerenderJourney({ active: true, attemptId: "new-attempt" });
    await act(async () => old("assisted")); await settleRoom();
    expect(readEssentialSnapshot()!.stations[2].presentedStepIds).not.toContain("musica");
    expect(readEssentialSnapshot()!.stations[2].closed).toBe(false);
    await act(async () => panels.music.at(-1)!("assisted")); await settleRoom();
    expect(readEssentialSnapshot()!.stations[2].assistedPresentedStepIds).toContain("musica");
    expect(readEssentialSnapshot()!.stations[2].closed).toBe(false);
  });
});
