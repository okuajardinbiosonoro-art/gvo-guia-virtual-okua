import { beforeEach, describe, expect, it } from "vitest";
import { invalidateJourneyEssential } from "../../app/journey/journeyEssential";
import { getJourneyResourceManifest } from "../../app/journey/journeyResources";
import { gestureHintAssets } from "../../components/GestureHint/gestureHintAssets";
import { liaJourneyMotionAssets } from "../../components/LiaJourneyMotion/LiaJourneyMotion";
import { coverIntroAssets } from "../../screens/Cover/coverIntroAssets";
import { getWorld1CriticalAssetSources, world1RootAssets } from "../../screens/World1Root/world1RootAssets";
import { world3RuntimeAssets } from "../../screens/World3Root/world3RuntimeAssets";
import { screenAssetBundles } from "./screenAssetBundles";

beforeEach(() => { localStorage.clear(); invalidateJourneyEssential(); });
const manifest = (route: string) => getJourneyResourceManifest({ route, locale: "es", orientation: "portrait" }).images;

describe("OBS03 · actual consumer resource lists", () => {
  it("prepares I base, current rig and swipe once, with only the actual root added per state", () => {
    const initial = screenAssetBundles.world1RootInitial.assets.map((item) => item.src);
    expect(initial).toEqual(expect.arrayContaining([...getWorld1CriticalAssetSources("intro"), ...liaJourneyMotionAssets, gestureHintAssets["swipe-vertical"]]));
    expect(screenAssetBundles.world1RootRelation.assets.map((item) => item.src)).toEqual([world1RootAssets.activeRelation]);
    expect(screenAssetBundles.world1RootPerception.assets.map((item) => item.src)).toEqual([world1RootAssets.activePerception]);
    expect(screenAssetBundles.world1RootMediation.assets.map((item) => item.src)).toEqual([world1RootAssets.activeMediation]);
    expect(screenAssetBundles.world1RootReady.assets).toEqual([]);
    const all = [screenAssetBundles.world1RootInitial, screenAssetBundles.world1RootRelation, screenAssetBundles.world1RootPerception, screenAssetBundles.world1RootMediation, screenAssetBundles.world1RootReady].flatMap((bundle) => bundle.assets.map((item) => item.src));
    expect(all.some((src) => src.includes("/world-1-root/lia/"))).toBe(false);
    expect(initial.length).toBe(new Set(initial).size);
  });
  it("includes the portal activation bitmap while Cover still renders it and uses only the v03 idle rig", () => {
    const images = manifest("/portada");
    expect(images).toContain(coverIntroAssets.liaActivatePortal1);
    expect(images).toEqual(expect.arrayContaining(liaJourneyMotionAssets));
    expect(images.some((src) => src.includes("/lia/rig/idle_v1/"))).toBe(false);
    expect(images.length).toBe(new Set(images).size);
  });
  it("declares only actual gesture variants and keeps the rejected III folio out of preparation", () => {
    for (const route of ["/estacion/1", "/estacion/3"]) {
      expect(manifest(route)).toContain(gestureHintAssets["swipe-vertical"]);
      expect(manifest(route)).not.toContain(gestureHintAssets.tap);
    }
    expect(manifest("/estacion/2")).toEqual(expect.arrayContaining([gestureHintAssets.tap, gestureHintAssets["swipe-horizontal"]]));
    expect(manifest("/estacion/3")).toContain(world3RuntimeAssets.notebook.openBase);
    expect(manifest("/estacion/3")).not.toContain(world3RuntimeAssets.notebook.folio);
  });
});
