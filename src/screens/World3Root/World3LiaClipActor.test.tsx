import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderJourneyRoom } from "../World1Root/obs03TestFixture";
import { World3LiaActor } from "./World3LiaActor";
import { World3LiaClipActor } from "./World3LiaClipActor";
import { world3LiaClipAssets, world3LiaClipContract, world3LiaClipForTarget } from "./world3LiaClips";
import { getWorld3CriticalAssetSources, world3RuntimeAssets } from "./world3RuntimeAssets";

const preload = vi.hoisted(() => ({ ready: true, status: "ready", calls: 0 }));
vi.mock("../../shared/assets/useAssetPreloader", () => ({ useAssetPreloader: () => { preload.calls++; return { ready: preload.ready, status: preload.status }; } }));
beforeEach(() => { localStorage.clear(); preload.ready = true; preload.status = "ready"; preload.calls = 0; });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("World3 pixel clips · registered consumer, scene acceptance remains separate", () => {
  it("declares three distinct six-frame profiles and the measured common registration", () => {
    expect(["planta", "prototipo", "senal"].map(world3LiaClipForTarget)).toEqual(["intro", "listening", "accompanying"]);
    expect(Object.values(world3LiaClipAssets).map((clip) => clip.durationMs)).toEqual([650, 1100, 850]);
    expect(world3LiaClipContract.master).toEqual({ width: 1536, height: 1024, cell: 512 });
    expect(world3LiaClipContract.exactNeutralFrames).toEqual([0, 5]); expect(world3LiaClipContract.registeredBaseBulbPivot).toEqual([128, 212]);
    for (const page of [null, "planta", "prototipo", "senal"] as const) {
      const sources = getWorld3CriticalAssetSources(page);
      const expected = world3LiaClipAssets[world3LiaClipForTarget(page ?? "index")].src;
      expect(sources).toContain(expected);
      expect(sources.filter((src) => src.includes("/lia/clips/"))).toEqual([expected]);
      expect(sources.some((src) => new Set<string>(Object.values(world3RuntimeAssets.lia)).has(src))).toBe(false);
    }
  });
  it("retains historical poses only through an explicit unused-by-room mode", () => {
    const { container } = renderJourneyRoom(<World3LiaActor target="planta" motionMode="historical-interim" />, 3);
    expect(container.querySelector('[data-lia-production-status="historical-unused-by-current-room"]')).not.toBeNull();
    expect(container.querySelector("img")).not.toBeNull(); expect(preload.calls).toBe(0);
  });
  it("has no silent fallback when clip resources are pending or fail", () => {
    preload.ready = false; preload.status = "error";
    const { container } = renderJourneyRoom(<World3LiaClipActor active reducedMotion={false} target="planta" />, 3);
    expect(container.querySelector('[data-lia-clip-status="error"]')).not.toBeNull();
    expect(container.querySelector(".s3-lia-clip__frame,img")).toBeNull();
    expect(container.querySelector('[data-lia-clip-fallback="none"]')).not.toBeNull();
  });
  it("cancels motion while inactive and returns to the current stable pose without replaying an old event", () => {
    const view = renderJourneyRoom(<World3LiaClipActor active reducedMotion={false} target="prototipo" replayKey="page-event" />, 3);
    expect(view.container.querySelector('[data-lia-clip-mode="play"]')).not.toBeNull();
    view.rerenderJourney({ active: false }); expect(view.container.querySelector('[data-lia-clip-mode="stable"]')).not.toBeNull();
    view.rerenderJourney({ active: true }); expect(view.container.querySelector('[data-lia-clip-mode="stable"]')).not.toBeNull();
    expect(localStorage.getItem("gvo.journey.essential.v1")).toBeNull();
  });
  it("uses pertinent frame3 directly in reduced motion and never confirms content or practice", () => {
    const { container } = renderJourneyRoom(<World3LiaClipActor active reducedMotion target="senal" />, 3);
    expect(container.querySelector('[data-lia-clip="accompanying"][data-lia-clip-mode="stable"][data-lia-clip-stable-frame="3"]')).not.toBeNull();
    expect(localStorage.length).toBe(0);
  });
});
