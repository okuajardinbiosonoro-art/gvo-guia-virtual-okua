import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { capturePreparedImage, isPreparedImageCurrent, waitForPreparedImages } from "./preparedImages";

function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function mountedPicture() {
  const picture = document.createElement("picture"), source = document.createElement("source"), image = document.createElement("img");
  source.media = "(orientation: landscape)"; source.srcset = "/landscape.webp";
  image.src = "/portrait.webp";
  picture.append(source, image); document.body.append(picture);
  const state = { selected: "", complete: false };
  const decoding = deferred(), decode = vi.fn(() => decoding.promise);
  Object.defineProperties(image, {
    currentSrc: { configurable: true, get: () => state.selected },
    complete: { configurable: true, get: () => state.complete },
    naturalWidth: { configurable: true, get: () => state.complete ? 2560 : 0 },
    naturalHeight: { configurable: true, get: () => state.complete ? 900 : 0 },
    decode: { configurable: true, value: decode },
  });
  const load = () => { state.selected = new URL("/landscape.webp", document.baseURI).href; state.complete = true; image.dispatchEvent(new Event("load")); };
  return { picture, source, image, state, decoding, decode, load };
}
beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("mounted responsive image preparation", () => {
  it("accepts the initial picture selection only after load and decode of the same mounted IMG", async () => {
    const target = mountedPicture(), captured = capturePreparedImage(target.image);
    const controller = new AbortController(), deadlineAt = performance.now() + 15000;
    const promise = waitForPreparedImages([captured], { controller, deadlineAt }, () => true);
    let finished = false; void promise.then(() => { finished = true; });
    expect(target.decode).not.toHaveBeenCalled();
    target.load(); await Promise.resolve();
    expect(target.decode).toHaveBeenCalledTimes(1);
    expect(finished).toBe(false);
    target.decoding.resolve();
    expect(await promise).toBe(true);
    expect(captured.currentSrc).toBe(target.state.selected);
    expect(isPreparedImageCurrent(captured)).toBe(true);
    expect(controller.signal.aborted).toBe(false);
    expect(deadlineAt).toBeLessThanOrEqual(performance.now() + 15000);
  });

  it.each(["srcset", "sizes", "source-media"] as const)("rejects a changed %s configuration before initial selection settles", async (attribute) => {
    const target = mountedPicture(), captured = capturePreparedImage(target.image);
    const promise = waitForPreparedImages([captured], { controller: new AbortController(), deadlineAt: performance.now() + 15000 }, () => true);
    if (attribute === "source-media") target.source.media = "(min-width: 1px)";
    else target.image.setAttribute(attribute, attribute === "sizes" ? "100vw" : "/replacement.webp 2x");
    target.load(); target.decoding.resolve();
    expect(await promise).toBe(false);
    expect(target.decode).not.toHaveBeenCalled();
  });

  it("rejects a selected source changed during decode and keeps its failed proof unsealed", async () => {
    const target = mountedPicture(); target.load();
    const captured = capturePreparedImage(target.image);
    const promise = waitForPreparedImages([captured], { controller: new AbortController(), deadlineAt: performance.now() + 15000 }, () => true);
    expect(target.decode).toHaveBeenCalledTimes(1);
    target.state.selected = new URL("/different-landscape.webp", document.baseURI).href;
    target.decoding.resolve();
    expect(await promise).toBe(false);
    expect(isPreparedImageCurrent(captured)).toBe(false);
  });

  it.each(["abort", "stale-context", "deadline"] as const)("rejects initial selection when %s occurs during decode", async (cause) => {
    const target = mountedPicture(), captured = capturePreparedImage(target.image);
    let current = true;
    const controller = new AbortController(), deadlineAt = performance.now() + 100;
    const promise = waitForPreparedImages([captured], { controller, deadlineAt }, () => current);
    target.load();
    expect(target.decode).toHaveBeenCalledTimes(1);
    if (cause === "abort") controller.abort();
    else if (cause === "stale-context") current = false;
    else await vi.advanceTimersByTimeAsync(101);
    target.decoding.resolve();
    expect(await promise).toBe(false);
  });

  it("rejects a native decode failure after initial selection", async () => {
    const target = mountedPicture(), captured = capturePreparedImage(target.image);
    const promise = waitForPreparedImages([captured], { controller: new AbortController(), deadlineAt: performance.now() + 15000 }, () => true);
    target.load();
    expect(target.decode).toHaveBeenCalledTimes(1);
    target.decoding.reject(new Error("native decode failed"));
    expect(await promise).toBe(false);
  });
});
