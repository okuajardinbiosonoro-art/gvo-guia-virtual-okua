/* eslint-disable */
const { chromium } = require("playwright");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = __dirname;
const baseUrl = "http://127.0.0.1:5185";
const viewports = [
  { width: 360, height: 560 },
  { width: 375, height: 559 },
  { width: 375, height: 667 },
  { width: 390, height: 650 },
  { width: 390, height: 844 },
  { width: 430, height: 740 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
];

const world1States = ["intro", "relation", "perception", "mediation"];
const world1NodeLabels = {
  relation: "Explorar RELACIÓN",
  perception: "Explorar PERCEPCIÓN",
  mediation: "Explorar MEDIACIÓN",
};

function intersects(a, b) {
  if (!a || !b) return false;
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function intersectionRatio(a, b) {
  if (!intersects(a, b)) return 0;
  const width = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
  );
  const height = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  );
  return (width * height) / (b.width * b.height);
}

function roundedBox(box) {
  if (!box) return null;
  return Object.fromEntries(
    Object.entries(box).map(([key, value]) => [key, Number(value.toFixed(2))]),
  );
}

function insideViewport(box, viewport) {
  return (
    box &&
    box.x >= 0 &&
    box.y >= 0 &&
    box.x + box.width <= viewport.width &&
    box.y + box.height <= viewport.height
  );
}

async function prepareWorld2(page) {
  await page.goto(`${baseUrl}/estacion/2`, { waitUntil: "domcontentloaded" });
  await page.locator('[data-world2-runtime-version="016R"]').waitFor();
  await page.locator('[data-critical-assets-ready="true"]').waitFor();
  await page.locator('[data-plant-contact-hotspot="016J"]').click();
  await page.locator('[data-world2-layer="senal"]').click();
  await page
    .locator('[data-world2-signal-reveal-control="onda-medida"]')
    .click();
  await page.locator('[data-world2-layer="captura"]').click();
  await page.locator('[data-world2-capture-timeline="016R"]').waitFor();
  await page.waitForTimeout(180);
}

async function swipeWorld2(page, direction) {
  const zone = page.locator(
    '[data-world2-capture-interaction="swipe-timeline"]',
  );
  const box = await zone.boundingBox();
  const centerY = box.y + box.height / 2;
  const startX =
    direction === "left" ? box.x + box.width * 0.72 : box.x + box.width * 0.28;
  const endX =
    direction === "left" ? box.x + box.width * 0.28 : box.x + box.width * 0.72;
  await page.mouse.move(startX, centerY);
  await page.mouse.down();
  await page.mouse.move(endX, centerY, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(720);
}

async function detailAround(page, locator, padding = 28) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  const x = Math.max(0, box.x - padding);
  const y = Math.max(0, box.y - padding);
  return page.screenshot({
    type: "png",
    clip: {
      x,
      y,
      width: Math.min(viewport.width - x, box.width + padding * 2),
      height: Math.min(viewport.height - y, box.height + padding * 2),
    },
  });
}

async function exposeTrailForDetail(page) {
  return page.addStyleTag({
    content: `
      .gvo-gesture-hint__fingertip-trail-glow {
        animation: none !important;
        opacity: 1 !important;
        scale: 1 !important;
      }
      .gvo-gesture-hint__fingertip-trail-tail {
        animation: none !important;
        opacity: 0.92 !important;
        scale: 1 1 !important;
      }
      .gvo-gesture-hint__fingertip-trail-shimmer {
        animation: none !important;
        opacity: 0.72 !important;
        translate: 0.28rem 0 !important;
        scale: 0.84 1 !important;
      }
    `,
  });
}

async function upscaleDetail(buffer) {
  const metadata = await sharp(buffer).metadata();
  return sharp(buffer)
    .resize({
      width: metadata.width * 4,
      height: metadata.height * 4,
      kernel: "nearest",
    })
    .png()
    .toBuffer();
}

async function measureTrailGeometry(page, hintSelector) {
  return page.evaluate((selector) => {
    const hint = document.querySelector(selector);
    const fingertip = hint?.querySelector(
      ".gvo-gesture-hint__fingertip",
    );
    const origin = hint?.querySelector(
      ".gvo-gesture-hint__fingertip-trail-origin",
    );
    const trail = hint?.querySelector(".gvo-gesture-hint__fingertip-trail");
    const motion = hint?.querySelector(".gvo-gesture-hint__motion");
    const tail = hint?.querySelector(
      ".gvo-gesture-hint__fingertip-trail-tail",
    );
    const glow = hint?.querySelector(
      ".gvo-gesture-hint__fingertip-trail-glow",
    );
    const fingertipRect = fingertip?.getBoundingClientRect();
    const originRect = origin?.getBoundingClientRect();
    const trailRect = trail?.getBoundingClientRect();
    const center = (rect) =>
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : null;
    const fingertipAnchor = center(fingertipRect);
    const trailOrigin = center(originRect);
    const trailStyle = trail ? getComputedStyle(trail) : null;
    const tailStyle = tail ? getComputedStyle(tail) : null;
    const glowStyle = glow ? getComputedStyle(glow) : null;
    const motionAnimation = motion?.getAnimations()[0];
    const ancestorClips = [];
    let ancestor = hint?.parentElement;
    while (ancestor) {
      const style = getComputedStyle(ancestor);
      if (
        [style.overflow, style.overflowX, style.overflowY].some(
          (value) => value === "hidden" || value === "clip",
        )
      ) {
        const rect = ancestor.getBoundingClientRect();
        if (
          trailRect &&
          (trailRect.left < rect.left ||
            trailRect.right > rect.right ||
            trailRect.top < rect.top ||
            trailRect.bottom > rect.bottom)
        ) {
          ancestorClips.push(ancestor.className || ancestor.tagName);
        }
      }
      ancestor = ancestor.parentElement;
    }
    const distance =
      fingertipAnchor && trailOrigin
        ? Math.hypot(
            fingertipAnchor.x - trailOrigin.x,
            fingertipAnchor.y - trailOrigin.y,
          )
        : null;
    return {
      profile: hint?.getAttribute("data-gvo-gesture-calibration-profile"),
      alignment: hint?.getAttribute("data-gvo-gesture-trail-alignment"),
      visibility: hint?.getAttribute("data-gvo-gesture-trail-visibility"),
      lengthMarker: hint?.getAttribute("data-gvo-gesture-trail-length"),
      durationMarker: hint?.getAttribute("data-gvo-gesture-cycle-duration"),
      fingertipAnchor,
      trailOrigin,
      distancePx: distance == null ? null : Number(distance.toFixed(4)),
      trailSize: trailRect
        ? {
            width: Number(trailRect.width.toFixed(3)),
            height: Number(trailRect.height.toFixed(3)),
          }
        : null,
      tailComputed: {
        width: tailStyle?.width,
        height: tailStyle?.height,
        opacity: tailStyle?.opacity,
        backgroundImage: tailStyle?.backgroundImage,
        boxShadow: tailStyle?.boxShadow,
      },
      glowComputed: {
        opacity: glowStyle?.opacity,
        backgroundImage: glowStyle?.backgroundImage,
        boxShadow: glowStyle?.boxShadow,
      },
      trailAngle: trailStyle?.getPropertyValue("--gvo-gesture-trail-angle"),
      cycleDurationMs: Number(
        motionAnimation?.effect?.getTiming().duration ?? 0,
      ),
      visibleTravelDurationMs: Number(
        (Number(motionAnimation?.effect?.getTiming().duration ?? 0) * 0.51).toFixed(2),
      ),
      insideViewport:
        !!trailRect &&
        trailRect.left >= 0 &&
        trailRect.top >= 0 &&
        trailRect.right <= window.innerWidth &&
        trailRect.bottom <= window.innerHeight,
      clipped: ancestorClips.length > 0,
      ancestorClips,
    };
  }, hintSelector);
}

async function makeAnchorOverlay(page, hint, label) {
  const box = await hint.boundingBox();
  const viewport = page.viewportSize();
  const padding = 44;
  const clip = {
    x: Math.floor(Math.max(0, box.x - padding)),
    y: Math.floor(Math.max(0, box.y - padding)),
    width: Math.floor(Math.min(viewport.width, box.width + padding * 2)),
    height: Math.floor(Math.min(viewport.height, box.height + padding * 2)),
  };
  clip.width = Math.floor(Math.min(clip.width, viewport.width - clip.x));
  clip.height = Math.floor(Math.min(clip.height, viewport.height - clip.y));
  const geometry = await measureTrailGeometry(
    page,
    '[data-gvo-gesture-cycle="unidirectional-reset"]',
  );
  const base = await page.screenshot({ type: "png", clip });
  const fx = geometry.fingertipAnchor.x - clip.x;
  const fy = geometry.fingertipAnchor.y - clip.y;
  const ox = geometry.trailOrigin.x - clip.x;
  const oy = geometry.trailOrigin.y - clip.y;
  const overlay = Buffer.from(
    `<svg width="${clip.width}" height="${clip.height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="${clip.width - 6}" height="31" rx="3" fill="#07111ddd"/>
      <text x="8" y="15" fill="#ffffff" font-family="Arial" font-size="7.5">${label} | d ${geometry.distancePx.toFixed(3)} CSS px</text>
      <text x="8" y="27" fill="#ffffff" font-family="Arial" font-size="8">cian yema / oro origen</text>
      <line x1="${fx}" y1="${fy}" x2="${ox}" y2="${oy}" stroke="#ffffff" stroke-width="1"/>
      <line x1="${fx - 11}" y1="${fy}" x2="${fx + 11}" y2="${fy}" stroke="#55e7ff" stroke-width="1"/>
      <line x1="${fx}" y1="${fy - 11}" x2="${fx}" y2="${fy + 11}" stroke="#55e7ff" stroke-width="1"/>
      <circle cx="${fx}" cy="${fy}" r="8" fill="none" stroke="#55e7ff" stroke-width="2"/>
      <circle cx="${ox}" cy="${oy}" r="3.5" fill="#ffd76a" stroke="#161018" stroke-width="1"/>
    </svg>`,
  );
  const composed = await sharp(base).composite([{ input: overlay }]).png().toBuffer();
  const metadata = await sharp(composed).metadata();
  return sharp(composed)
    .resize({ width: metadata.width * 3, height: metadata.height * 3 })
    .png()
    .toBuffer();
}

async function setMotionPhase(page, timeMs) {
  return page.evaluate((phaseTime) => {
    const hint = document.querySelector(
      '[data-gvo-gesture-cycle="unidirectional-reset"]',
    );
    const motion = hint?.querySelector(".gvo-gesture-hint__motion");
    const animatedElements = hint?.querySelectorAll(
      ".gvo-gesture-hint__motion, .gvo-gesture-hint__fingertip-trail-tail, .gvo-gesture-hint__fingertip-trail-shimmer, .gvo-gesture-hint__fingertip-trail-glow",
    );
    animatedElements?.forEach((element) => {
      element.getAnimations().forEach((animation) => {
        animation.pause();
        animation.currentTime = phaseTime;
      });
    });
    const rect = motion?.getBoundingClientRect();
    const style = motion ? getComputedStyle(motion) : null;
    return {
      timeMs: phaseTime,
      x: Number((rect?.x ?? 0).toFixed(3)),
      y: Number((rect?.y ?? 0).toFixed(3)),
      opacity: Number(style?.opacity ?? 0),
    };
  }, timeMs);
}

async function measureUnidirectionalCycle(page, axis, direction) {
  const visibleTimes = [286, 504, 756, 1008, 1142];
  const hiddenTimes = [1310, 1445, 1674];
  const visibleSamples = [];
  const hiddenSamples = [];
  for (const timeMs of visibleTimes) {
    visibleSamples.push(await setMotionPhase(page, timeMs));
  }
  for (const timeMs of hiddenTimes) {
    hiddenSamples.push(await setMotionPhase(page, timeMs));
  }
  const resetSample = await setMotionPhase(page, 0);
  const values = visibleSamples.map((sample) => sample[axis]);
  const expectsDecrease = direction === "left" || direction === "up";
  const noVisibleReverse = values.slice(1).every((value, index) =>
    expectsDecrease
      ? value <= values[index] + 0.1
      : value >= values[index] - 0.1,
  );
  const endValue = values.at(-1);
  const hiddenAtDestination = hiddenSamples.every(
    (sample) =>
      sample.opacity <= 0.01 && Math.abs(sample[axis] - endValue) <= 1,
  );
  const resetIsInvisible = resetSample.opacity <= 0.01;
  const resetJumpDistance = Math.abs(resetSample[axis] - endValue);
  return {
    axis,
    direction,
    visibleSamples,
    hiddenSamples,
    resetSample,
    noVisibleReverse,
    hiddenAtDestination,
    resetIsInvisible,
    resetJumpDistance: Number(resetJumpDistance.toFixed(3)),
    pass:
      noVisibleReverse &&
      hiddenAtDestination &&
      resetIsInvisible &&
      resetJumpDistance >= 8,
  };
}

async function makeContactSheet(
  filename,
  title,
  items,
  columns,
  thumbWidth,
  thumbHeight,
) {
  const rows = Math.ceil(items.length / columns);
  const gap = 12;
  const headerHeight = 48;
  const labelHeight = 22;
  const width = columns * thumbWidth + (columns + 1) * gap;
  const height = headerHeight + rows * (thumbHeight + labelHeight + gap) + gap;
  const background = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#07111d"/><text x="${gap}" y="31" fill="#fff" font-family="Arial" font-size="20" font-weight="700">${title}</text></svg>`,
  );
  const composites = [];
  for (let index = 0; index < items.length; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const left = gap + column * (thumbWidth + gap);
    const top = headerHeight + row * (thumbHeight + labelHeight + gap);
    const thumbnail = await sharp(items[index].buffer)
      .resize({
        width: thumbWidth,
        height: thumbHeight,
        fit: "contain",
        background: "#07111d",
      })
      .png()
      .toBuffer();
    composites.push({ input: thumbnail, left, top });
    composites.push({
      input: Buffer.from(
        `<svg width="${thumbWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#101d2b"/><text x="7" y="15" fill="#d9e8f5" font-family="Arial" font-size="12">${items[index].label}</text></svg>`,
      ),
      left,
      top: top + thumbHeight,
    });
  }
  await sharp(background)
    .composite(composites)
    .png()
    .toFile(path.join(outDir, filename));
}

async function runWorld2Qa(browser) {
  const measurements = [];
  const responsiveItems = [];
  const cycleDetailItems = [];
  let horizontalDetail = null;
  let horizontalOverlay = null;

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await prepareWorld2(page);

    const idle = await page.screenshot({ type: "png" });
    if (viewport.width === 390 && viewport.height === 844) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_option3_swipe_hint_idle.png"),
        idle,
      );
    }
    if (viewport.width === 360 && viewport.height === 560) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_360x560_option3_typography_idle.png"),
        idle,
      );
    }
    if (viewport.width === 375 && viewport.height === 667) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_375x667_option3_typography_step_1.png"),
        idle,
      );
    }
    if (viewport.width === 1024 && viewport.height === 768) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_1024x768_option3_typography_check.png"),
        idle,
      );
    }

    await page.waitForTimeout(2900);
    const hint = page.locator(
      '.world2-gesture-hint--capture-swipe[data-gvo-gesture-state="visible"]',
    );
    await hint.waitFor();
    await setMotionPhase(page, 756);
    let hintBuffer = await page.screenshot({ type: "png" });
    if (viewport.width === 390 && viewport.height === 844) {
      const cyclePhases = [
        { name: "start", timeMs: 286, label: "Inicio · derecha" },
        { name: "mid", timeMs: 756, label: "Recorrido · izquierda" },
        { name: "end", timeMs: 1142, label: "Destino · desaparece" },
      ];
      for (const phase of cyclePhases) {
        await setMotionPhase(page, phase.timeMs);
        const phaseBuffer = await page.screenshot({ type: "png" });
        fs.writeFileSync(
          path.join(
            outDir,
            `world2_016S5_option3_swipe_hint_${phase.name}.png`,
          ),
          phaseBuffer,
        );
        cycleDetailItems.push({
          buffer: await detailAround(page, hint, 34),
          label: phase.label,
        });
        if (phase.name === "mid") hintBuffer = phaseBuffer;
      }
      await setMotionPhase(page, 756);
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_option3_swipe_hint_visible.png"),
        hintBuffer,
      );
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_option3_390x844_swipe_hint.png"),
        hintBuffer,
      );
      const detailStyle = await exposeTrailForDetail(page);
      horizontalDetail = await upscaleDetail(await detailAround(page, hint));
      fs.writeFileSync(
        path.join(
          outDir,
          "world2_016S5_option3_swipe_hint_direction_detail.png",
        ),
        horizontalDetail,
      );
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_option3_trail_visibility_detail.png"),
        horizontalDetail,
      );
      await detailStyle.evaluate((element) => element.remove());
      horizontalOverlay = await makeAnchorOverlay(
        page,
        hint,
        "H alpha",
      );
      fs.writeFileSync(
        path.join(
          outDir,
          "world2_016S5_option3_fingertip_alignment_detail.png",
        ),
        horizontalOverlay,
      );
    }
    if (viewport.width === 430 && viewport.height === 932) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_option3_430x932_swipe_hint.png"),
        hintBuffer,
      );
    }

    const selectors = {
      hint,
      zone: page.locator('[data-world2-capture-interaction="swipe-timeline"]'),
      readout: page.locator('[data-world2-capture-readout="contact"]'),
      lia: page.locator("[data-lia-placement]"),
      dialogue: page.locator('[data-world2-zone="dialogue"]'),
      nav: page.locator('[data-world2-zone="nav"]'),
    };
    const boxes = {};
    for (const [name, locator] of Object.entries(selectors)) {
      boxes[name] = roundedBox(await locator.boundingBox());
    }
    const typography = await page.evaluate(() => {
      const font = (selector) =>
        getComputedStyle(document.querySelector(selector)).fontFamily;
      return {
        stepLabel: font(".world2-capture-timeline__step-label"),
        readoutTitle: font(".world2-capture-timeline__readout strong"),
        readoutBody: font(".world2-capture-timeline__readout p"),
        control: font(".world2-capture-timeline__step-control"),
      };
    });
    const rootOverflow = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth - window.innerWidth,
      height: document.documentElement.scrollHeight - window.innerHeight,
    }));
    const trailContract = await page.evaluate(() => {
      const hint = document.querySelector(
        ".world2-gesture-hint--capture-swipe",
      );
      const fingertip = hint?.querySelector(
        ".gvo-gesture-hint__fingertip",
      );
      const trail = hint?.querySelector(
        ".gvo-gesture-hint__fingertip-trail",
      );
      const fingertipStyle = fingertip ? getComputedStyle(fingertip) : null;
      const trailStyle = trail ? getComputedStyle(trail) : null;
      return {
        system: hint?.getAttribute("data-gvo-gesture-system"),
        animation: hint?.getAttribute("data-gvo-gesture-animation"),
        cycle: hint?.getAttribute("data-gvo-gesture-cycle"),
        direction: hint?.getAttribute("data-gvo-gesture-direction"),
        marker: trail?.getAttribute("data-gvo-gesture-fingertip-trail"),
        attached:
          fingertipStyle?.left === trailStyle?.left &&
          fingertipStyle?.top === trailStyle?.top,
        oldArtifactCount:
          hint?.querySelectorAll(
            "[data-gvo-gesture-fingertip-cue], .gvo-gesture-hint__trail",
          ).length ?? -1,
      };
    });
    const trailGeometry = await measureTrailGeometry(
      page,
      ".world2-gesture-hint--capture-swipe",
    );
    const cycleContract = await measureUnidirectionalCycle(
      page,
      "x",
      "left",
    );
    await setMotionPhase(page, 756);

    await swipeWorld2(page, "left");
    const hiddenAfterSwipe = await page
      .locator(".world2-gesture-hint--capture-swipe")
      .getAttribute("data-gvo-gesture-state");
    const step2 = await page.screenshot({ type: "png" });
    if (viewport.width === 375 && viewport.height === 667) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_375x667_option3_typography_step_2.png"),
        step2,
      );
    }

    await swipeWorld2(page, "left");
    const step3 = await page.screenshot({ type: "png" });
    if (viewport.width === 375 && viewport.height === 667) {
      fs.writeFileSync(
        path.join(outDir, "world2_016S5_375x667_option3_typography_step_3.png"),
        step3,
      );
    }

    const checks = {
      hintInsideViewport: insideViewport(boxes.hint, viewport),
      hintClearOfLia: !intersects(boxes.hint, boxes.lia),
      hintClearOfDialogue: !intersects(boxes.hint, boxes.dialogue),
      hintClearOfNav: !intersects(boxes.hint, boxes.nav),
      hiddenAfterSwipe: hiddenAfterSwipe === "completed",
      refinedTrailContract:
        trailContract.system === "016S5" &&
        trailContract.animation === "unidirectional-trail-r7" &&
        trailContract.cycle === "unidirectional-reset" &&
        trailContract.direction === "left" &&
        trailContract.marker === "left" &&
        trailContract.attached &&
        trailContract.oldArtifactCount === 0,
      calibratedAnchor:
        trailGeometry.profile === "horizontal-index-alpha-v1" &&
        trailGeometry.alignment === "fingertip-calibrated" &&
        trailGeometry.distancePx <= 3,
      extendedTrail:
        trailGeometry.visibility === "extended" &&
        trailGeometry.lengthMarker === "194-percent" &&
        trailGeometry.trailSize.width >= 55 &&
        trailGeometry.trailSize.height >= 10,
      acceleratedCycle:
        trailGeometry.durationMarker === "1680ms" &&
        trailGeometry.cycleDurationMs === 1680 &&
        trailGeometry.visibleTravelDurationMs === 856.8,
      trailBehindMotion: trailGeometry.trailAngle.trim() === "0deg",
      trailNotClipped:
        trailGeometry.insideViewport && !trailGeometry.clipped,
      unidirectionalCycle: cycleContract.pass,
      typographyMatchesApp: Object.values(typography).every((value) =>
        value.includes("Pixelify Sans"),
      ),
      noHorizontalOverflow: rootOverflow.width <= 0,
      noVerticalOverflow: rootOverflow.height <= 0,
      step3Complete:
        (await page
          .locator('[data-world2-capture-timeline="016R"]')
          .getAttribute("data-world2-capture-complete")) === "true",
    };
    measurements.push({
      viewport: `${viewport.width}x${viewport.height}`,
      typography,
      boxes,
      rootOverflow,
      trailContract,
      trailGeometry,
      cycleContract,
      checks,
      pass: Object.values(checks).every(Boolean),
    });
    responsiveItems.push({
      buffer: hintBuffer,
      label: `W2 horizontal · ${viewport.width}x${viewport.height}`,
    });
    await page.close();
  }

  if (!horizontalDetail) throw new Error("Horizontal trail detail missing");
  if (!horizontalOverlay) throw new Error("Horizontal anchor overlay missing");
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_horizontal_fingertip_trail_detail.png"),
    horizontalDetail,
  );
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_option3_capture_swipe_detail.png"),
    horizontalDetail,
  );
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_horizontal_fingertip_anchor_overlay.png"),
    horizontalOverlay,
  );
  await makeContactSheet(
    "gvo_016S5_unidirectional_cycle_detail_horizontal.png",
    "016S5 · Ciclo unidireccional derecha a izquierda",
    cycleDetailItems,
    3,
    260,
    210,
  );
  return { measurements, responsiveItems };
}

async function runWorld1Qa(browser) {
  const measurements = [];
  const contactItems = [];
  const responsiveItems = [];
  const verticalCycleDetailItems = [];
  let verticalDetail = null;
  let verticalOverlay = null;

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`${baseUrl}/estacion/1`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator('[data-critical-assets-ready="true"]').waitFor();

    for (const state of world1States) {
      if (state !== "intro") {
        await page
          .getByRole("button", { name: world1NodeLabels[state] })
          .click();
      }
      await page.waitForTimeout(160);

      const scrollViewport = page.locator(
        '[data-world1-scroll-viewport="manual"]',
      );
      const track = page.locator(".world1-root-narrative__track");
      const scrollMetrics = await scrollViewport.evaluate((element) => ({
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        scrollTop: element.scrollTop,
      }));
      const needsScroll =
        scrollMetrics.scrollHeight > scrollMetrics.clientHeight + 2;
      const expectedHint =
        viewport.width <= 480 && viewport.height <= 844 && needsScroll;
      let hintBox = null;
      let screenshot = null;
      let textOverlapRatio = 0;
      let hiddenAfterScroll = true;
      let trailContract = null;
      let cycleContract = null;
      let trailGeometry = null;

      if (expectedHint) {
        const hint = page.locator(
          '.world1-root-gesture-hint[data-gvo-gesture-state="visible"]',
        );
        await hint.waitFor({ timeout: 4000 });
        if (
          viewport.width === 360 &&
          viewport.height === 560 &&
          state === "relation"
        ) {
          const verticalPhases = [
            { timeMs: 286, label: "Inicio · abajo" },
            { timeMs: 756, label: "Recorrido · arriba" },
            { timeMs: 1142, label: "Destino · desaparece" },
          ];
          for (const phase of verticalPhases) {
            await setMotionPhase(page, phase.timeMs);
            verticalCycleDetailItems.push({
              buffer: await detailAround(page, hint, 34),
              label: phase.label,
            });
          }
        }
        await setMotionPhase(page, 756);
        hintBox = roundedBox(await hint.boundingBox());
        const trackBox = roundedBox(await track.boundingBox());
        textOverlapRatio = Number(
          intersectionRatio(hintBox, trackBox).toFixed(4),
        );
        trailContract = await page.evaluate(() => {
          const hint = document.querySelector(".world1-root-gesture-hint");
          const fingertip = hint?.querySelector(
            ".gvo-gesture-hint__fingertip",
          );
          const trail = hint?.querySelector(
            ".gvo-gesture-hint__fingertip-trail",
          );
          const fingertipStyle = fingertip
            ? getComputedStyle(fingertip)
            : null;
          const trailStyle = trail ? getComputedStyle(trail) : null;
          return {
            system: hint?.getAttribute("data-gvo-gesture-system"),
            animation: hint?.getAttribute("data-gvo-gesture-animation"),
            cycle: hint?.getAttribute("data-gvo-gesture-cycle"),
            direction: hint?.getAttribute("data-gvo-gesture-direction"),
            marker: trail?.getAttribute("data-gvo-gesture-fingertip-trail"),
            attached:
              fingertipStyle?.left === trailStyle?.left &&
              fingertipStyle?.top === trailStyle?.top,
            oldArtifactCount:
              hint?.querySelectorAll(
                "[data-gvo-gesture-fingertip-cue], .gvo-gesture-hint__trail",
              ).length ?? -1,
          };
        });
        trailGeometry = await measureTrailGeometry(
          page,
          ".world1-root-gesture-hint",
        );
        cycleContract = await measureUnidirectionalCycle(page, "y", "up");
        await setMotionPhase(page, 756);
        screenshot = await page.screenshot({ type: "png" });

        if (
          viewport.width === 360 &&
          viewport.height === 560 &&
          ["relation", "perception", "mediation"].includes(state)
        ) {
          fs.writeFileSync(
            path.join(outDir, `world1_016S5_${state}_vertical_hint.png`),
            screenshot,
          );
        }

        if (
          viewport.width === 360 &&
          viewport.height === 560 &&
          state === "relation"
        ) {
          fs.writeFileSync(
            path.join(
              outDir,
              "world1_016S5_small_screen_swipe_hint_candidate_1.png",
            ),
            screenshot,
          );
          const detailStyle = await exposeTrailForDetail(page);
          verticalDetail = await upscaleDetail(await detailAround(page, hint));
          await detailStyle.evaluate((element) => element.remove());
          verticalOverlay = await makeAnchorOverlay(
            page,
            hint,
            "V alpha",
          );
          fs.writeFileSync(
            path.join(
              outDir,
              "world1_016S5_vertical_fingertip_alignment_detail.png",
            ),
            verticalOverlay,
          );
        }
        if (
          viewport.width === 390 &&
          viewport.height === 650 &&
          state === "mediation"
        ) {
          fs.writeFileSync(
            path.join(
              outDir,
              "world1_016S5_small_screen_swipe_hint_candidate_2.png",
            ),
            screenshot,
          );
        }

        await scrollViewport.evaluate((element) => {
          element.scrollTop = Math.min(24, element.scrollHeight);
          element.dispatchEvent(new Event("scroll", { bubbles: true }));
        });
        await page.waitForTimeout(80);
        hiddenAfterScroll =
          (await page
            .locator(".world1-root-gesture-hint")
            .getAttribute("data-gvo-gesture-state")) === "completed";
      } else {
        screenshot = await page.screenshot({ type: "png" });
      }

      const rootOverflow = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth - window.innerWidth,
        height: document.documentElement.scrollHeight - window.innerHeight,
      }));
      const actualHintCount = await page
        .locator(".world1-root-gesture-hint")
        .count();
      const rootHintState = await page
        .locator(".world1-root-screen")
        .getAttribute("data-world1-swipe-hint-state");
      const checks = {
        correctEligibility: expectedHint
          ? actualHintCount === 1
          : actualHintCount === 0,
        hintInsideViewport: expectedHint
          ? insideViewport(hintBox, viewport)
          : true,
        textOverlapAcceptable: expectedHint ? textOverlapRatio <= 0.1 : true,
        hiddenAfterScroll,
        refinedTrailContract: expectedHint
          ? trailContract?.system === "016S5" &&
            trailContract?.animation === "unidirectional-trail-r7" &&
            trailContract?.cycle === "unidirectional-reset" &&
            trailContract?.direction === "up" &&
            trailContract?.marker === "up" &&
            trailContract?.attached &&
            trailContract?.oldArtifactCount === 0
          : true,
        unidirectionalCycle: expectedHint ? cycleContract?.pass === true : true,
        calibratedAnchor: expectedHint
          ? trailGeometry?.profile === "vertical-index-alpha-v1" &&
            trailGeometry?.alignment === "fingertip-calibrated" &&
            trailGeometry?.distancePx <= 3
          : true,
        extendedTrail: expectedHint
          ? trailGeometry?.visibility === "extended" &&
            trailGeometry?.lengthMarker === "194-percent" &&
            trailGeometry?.trailSize.width >= 10 &&
            trailGeometry?.trailSize.height >= 55
          : true,
        acceleratedCycle: expectedHint
          ? trailGeometry?.durationMarker === "1680ms" &&
            trailGeometry?.cycleDurationMs === 1680 &&
            trailGeometry?.visibleTravelDurationMs === 856.8
          : true,
        trailBehindMotion: expectedHint
          ? trailGeometry?.trailAngle.trim() === "90deg"
          : true,
        trailNotClipped: expectedHint
          ? trailGeometry?.insideViewport && !trailGeometry?.clipped
          : true,
        noHorizontalOverflow: rootOverflow.width <= 0,
        noVerticalOverflow: rootOverflow.height <= 0,
        rootStateConsistent: expectedHint
          ? rootHintState === "completed"
          : rootHintState === "inactive",
      };
      measurements.push({
        viewport: `${viewport.width}x${viewport.height}`,
        state,
        scrollMetrics,
        needsScroll,
        expectedHint,
        hintBox,
        textOverlapRatio,
        trailContract,
        cycleContract,
        trailGeometry,
        rootOverflow,
        checks,
        pass: Object.values(checks).every(Boolean),
      });

      if (
        (viewport.width === 360 && viewport.height === 560) ||
        (viewport.width === 430 && viewport.height === 932)
      ) {
        contactItems.push({
          buffer: screenshot,
          label: `W1 ${state} · ${viewport.width}x${viewport.height}${expectedHint ? " · hint" : " · sin hint"}`,
        });
      }
      if (state === "relation") {
        responsiveItems.push({
          buffer: screenshot,
          label: `W1 vertical · ${viewport.width}x${viewport.height}`,
        });
      }
    }
    await page.close();
  }

  if (!verticalDetail) throw new Error("Vertical trail detail missing");
  if (!verticalOverlay) throw new Error("Vertical anchor overlay missing");
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_vertical_fingertip_trail_detail.png"),
    verticalDetail,
  );
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_world1_swipe_detail.png"),
    verticalDetail,
  );
  fs.writeFileSync(
    path.join(outDir, "gvo_016S5_vertical_fingertip_anchor_overlay.png"),
    verticalOverlay,
  );
  await makeContactSheet(
    "gvo_016S5_unidirectional_cycle_detail_vertical.png",
    "016S5 · Ciclo unidireccional abajo a arriba",
    verticalCycleDetailItems,
    3,
    210,
    260,
  );
  await makeContactSheet(
    "world1_016S5_swipe_hint_contact_sheet.png",
    "016S5 · Mundo I · integración por overflow y altura",
    contactItems,
    4,
    210,
    330,
  );
  return { measurements, responsiveItems };
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const world2 = await runWorld2Qa(browser);
  const world1 = await runWorld1Qa(browser);
  await browser.close();

  const combinedResponsive = [];
  for (let index = 0; index < viewports.length; index += 1) {
    combinedResponsive.push(world2.responsiveItems[index]);
    combinedResponsive.push(world1.responsiveItems[index]);
  }
  await makeContactSheet(
    "gvo_016S5_gesture_hint_contact_sheet.png",
    "016S5 · GestureHint horizontal + vertical",
    combinedResponsive,
    6,
    180,
    260,
  );
  await makeContactSheet(
    "gvo_016S5_trail_length_before_after.png",
    "016S5 · Longitud de estela sobre fondo real",
    [
      {
        buffer: fs.readFileSync(
          path.join(
            outDir,
            "..",
            "016S4",
            "gvo_016S4_horizontal_fingertip_trail_detail.png",
          ),
        ),
        label: "Antes · 016S4 · 1.8rem",
      },
      {
        buffer: fs.readFileSync(
          path.join(outDir, "gvo_016S5_horizontal_fingertip_trail_detail.png"),
        ),
        label: "Despues · 016S5 · 3.5rem",
      },
    ],
    2,
    320,
    320,
  );

  const failedWorld2 = world2.measurements.filter((item) => !item.pass);
  const failedWorld1 = world1.measurements.filter((item) => !item.pass);
  const output = {
    ticket: "016S5",
    generatedAt: new Date().toISOString(),
    viewportPolicy: {
      world1MaxWidth: 480,
      world1MaxEffectiveHeight: 844,
      requiresRealOverflow: true,
    },
    baselineComparison: {
      trailLengthRem: {
        ticket016S4: 1.8,
        ticket016S5: 3.5,
        increasePercent: 94.44,
      },
      cycleDurationMs: {
        ticket016S4: 2800,
        ticket016S5: 1680,
        reductionPercent: 40,
      },
      visibleTravelDurationMs: {
        ticket016S4: 1428,
        ticket016S5: 856.8,
        reductionPercent: 40,
      },
    },
    result: {
      world2Passed: world2.measurements.length - failedWorld2.length,
      world2Total: world2.measurements.length,
      world1Passed: world1.measurements.length - failedWorld1.length,
      world1Total: world1.measurements.length,
      failed: failedWorld2.length + failedWorld1.length,
    },
    world2: world2.measurements,
    world1: world1.measurements,
  };
  fs.writeFileSync(
    path.join(outDir, "gesture_hint_layout_measurements_016S5.json"),
    `${JSON.stringify(output, null, 2)}\n`,
  );
  console.log(JSON.stringify(output.result));
  if (output.result.failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
