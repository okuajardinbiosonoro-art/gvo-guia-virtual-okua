import type { ReactNode } from "react";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { JourneyActivationProvider } from "../../app/journey/JourneyActivation";
import { ESSENTIAL_STORAGE_KEY, essentialSteps, invalidateJourneyEssential, readEssentialSnapshot, type EssentialAccessMode, type EssentialScreen } from "../../app/journey/journeyEssential";

export function renderJourneyRoom(room: ReactNode, station: EssentialScreen, { active = true, mode = "normal" as EssentialAccessMode, attemptId = "unit-attempt" as string | null } = {}) {
  const tree = (next: { active: boolean; mode: EssentialAccessMode; attemptId: string | null }) => <MemoryRouter><JourneyActivationProvider context={{ ...next, screen: station, authorized: true, reviewReturnAllowed: next.mode !== "normal" }}>{room}</JourneyActivationProvider></MemoryRouter>;
  const view = render(tree({ active, mode, attemptId }));
  return { ...view, rerenderJourney: (next: { active?: boolean; mode?: EssentialAccessMode; attemptId?: string | null }) => view.rerender(tree({ active, mode, attemptId, ...next })) };
}
export async function settleRoom(ms = 300) {
  for (let i = 0; i < 3; i++) await act(async () => { vi.advanceTimersByTime(ms); await Promise.resolve(); });
  for (let i = 0; i < 2; i++) await act(async () => { vi.advanceTimersByTime(64); await Promise.resolve(); });
}
export function seedEssentialRoom(station: 1 | 2 | 3, confirmed: string[] = [], { closed = false, presented = confirmed } = {}) {
  const snapshot = structuredClone(readEssentialSnapshot()!);
  const order = essentialSteps[station];
  Object.assign(snapshot.stations[station], { confirmedStepIds: confirmed, presentedStepIds: presented, activeStepId: order[confirmed.length] ?? null, closed });
  localStorage.setItem(ESSENTIAL_STORAGE_KEY, JSON.stringify(snapshot));
  invalidateJourneyEssential();
}
export function setMotionPreference(reduced = false) {
  Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn(() => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() })) });
}
