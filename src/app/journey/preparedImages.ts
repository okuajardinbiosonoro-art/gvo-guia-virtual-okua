export type PreparedImage = { image: HTMLImageElement; src: string; currentSrc: string; selectionPending: boolean; configuration: string; picture: HTMLElement | null };
function pictureFor(image: HTMLImageElement) { return image.parentElement?.tagName === "PICTURE" ? image.parentElement : null; }
function imageConfiguration(image: HTMLImageElement) {
  const attributes = (element: Element, names: string[]) => names.map((name) => [name, element.getAttribute(name)]);
  return JSON.stringify({ image: attributes(image, ["src", "srcset", "sizes"]), sources: Array.from(pictureFor(image)?.children ?? []).filter((element) => element.tagName === "SOURCE").map((element) => attributes(element, ["srcset", "sizes", "media", "type"])) });
}
export function capturePreparedImage(image: HTMLImageElement): PreparedImage {
  return { image, src: image.src, currentSrc: image.currentSrc || image.src, selectionPending: !image.currentSrc, configuration: imageConfiguration(image), picture: pictureFor(image) };
}
function isImageConfigurationCurrent(source: PreparedImage) { return source.image.isConnected && source.image.src === source.src && pictureFor(source.image) === source.picture && imageConfiguration(source.image) === source.configuration; }
export function isPreparedImageCurrent(source: PreparedImage) { return !source.selectionPending && isImageConfigurationCurrent(source) && (source.image.currentSrc || source.image.src) === source.currentSrc; }
export async function waitForPreparedImages(sources: PreparedImage[], attempt: { controller: AbortController; deadlineAt: number }, isCurrent: () => boolean): Promise<boolean> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  attempt.controller.signal.addEventListener("abort", abort, { once: true });
  if (attempt.controller.signal.aborted) abort();
  const timer = window.setTimeout(abort, Math.max(0, attempt.deadlineAt - performance.now()));
  try {
    const settleImage = (source: PreparedImage) => new Promise<boolean>((resolve) => {
      const { image } = source;
      let finished = false, decoding = false;
      const valid = () => !controller.signal.aborted && isCurrent() && performance.now() < attempt.deadlineAt && isImageConfigurationCurrent(source) && (source.selectionPending || isPreparedImageCurrent(source));
      const finish = (okay: boolean) => {
        if (finished) return;
        finished = true;
        image.removeEventListener("load", load); image.removeEventListener("error", error);
        controller.signal.removeEventListener("abort", cancelled);
        resolve(okay);
        if (!okay) controller.abort();
      };
      const cancelled = () => finish(false);
      const error = () => finish(false);
      const load = () => {
        if (decoding || finished) return;
        if (!valid() || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) { finish(false); return; }
        // A newly mounted picture can have no selected currentSrc yet. Its
        // fallback src is not proof of the browser's eventual selection. Seal
        // that first selection only after this same IMG loads and decodes.
        const selected = image.currentSrc || image.src;
        const decoded = () => {
          if (!valid() || (image.currentSrc || image.src) !== selected || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) { finish(false); return; }
          source.currentSrc = selected; source.selectionPending = false;
          finish(true);
        };
        if (typeof image.decode !== "function") { decoded(); return; }
        decoding = true;
        try { void image.decode().then(decoded).catch(error); }
        catch { error(); }
      };
      image.addEventListener("load", load); image.addEventListener("error", error);
      controller.signal.addEventListener("abort", cancelled, { once: true });
      if (!valid()) finish(false);
      else if (image.complete) load();
    });
    // The preload phase has already finished. Bound this second proof over the
    // same mounted IMG elements too, rather than starting every decode at once.
    let next = 0;
    const worker = async () => {
      while (!controller.signal.aborted && next < sources.length) {
        if (!await settleImage(sources[next++])) return false;
      }
      return !controller.signal.aborted;
    };
    const settled = await Promise.all(Array.from({ length: Math.min(2, sources.length) }, worker));
    return settled.every(Boolean);
  } finally { window.clearTimeout(timer); attempt.controller.signal.removeEventListener("abort", abort); }
}

/** A cancellable frame boundary; hidden tabs cannot leave the caller pending forever. */
export function twoPreparedFrames(signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    let first = 0, second = 0, done = false;
    const finish = (okay: boolean) => { if (done) return; done = true; cancelAnimationFrame(first); cancelAnimationFrame(second); signal.removeEventListener("abort", abort); resolve(okay); };
    const abort = () => finish(false);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { finish(false); return; }
    first = requestAnimationFrame(() => { second = requestAnimationFrame(() => finish(true)); });
  });
}
