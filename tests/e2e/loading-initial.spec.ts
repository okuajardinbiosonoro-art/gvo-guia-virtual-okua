import { expect, test } from "@playwright/test";

test("carga inicial V13 conserva rutas, textos y ausencia de portada", async ({
  page,
}) => {
  test.setTimeout(45_000);

  await page.goto("/carga");

  await expect(
    page.getByRole("heading", { name: "Preparando el recorrido" }),
  ).toBeVisible();
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("progressbar")).not.toContainText(/[\d%]/);
  await expect(page.locator("[data-sparkle-slot]")).toHaveCount(10);
  await expect(page.locator("[data-water-stream]")).toHaveCount(3);

  await page.waitForTimeout(12500);
  expect(page.url()).not.toContain("/portada");
  await expect(page.getByText("Portada / Intro")).toHaveCount(0);
});

test("la animacion normal expone duracion real de 12 segundos", async ({
  page,
}) => {
  await page.goto("/");

  const durations = await page.evaluate(() => {
    const progressFill = document.querySelector(
      ".loading-initial__progress-fill",
    );
    const progressRail = document.querySelector(
      ".loading-initial__progress-track",
    );
    const progressMarker = document.querySelector(
      ".loading-initial__progress-marker",
    );
    const liaRegistration = document.querySelector(
      ".loading-initial__lia-registration",
    );
    const liaTrack = document.querySelector(".loading-initial__lia-track");
    const scene = document.querySelector(".loading-initial__scene");
    const stage = document.querySelector(".loading-initial__stage");
    const waterField = document.querySelector(".loading-initial__water-field");
    const progressTrack = document.querySelector(".loading-initial__progress");
    const title = document.querySelector(".loading-initial h1");

    if (
      !progressFill ||
      !progressRail ||
      !progressMarker ||
      !liaRegistration ||
      !liaTrack ||
      !scene ||
      !stage ||
      !waterField ||
      !progressTrack ||
      !title
    ) {
      throw new Error("Faltan elementos de carga inicial V13.");
    }

    const sceneStyles = getComputedStyle(scene);

    return {
      progressDuration: getComputedStyle(progressFill).animationDuration,
      progressMarkerDuration:
        getComputedStyle(progressMarker).animationDuration,
      progressTrackHeight: getComputedStyle(progressTrack)
        .getPropertyValue("--loading-progress-track-height")
        .trim(),
      progressCapSize: getComputedStyle(progressTrack)
        .getPropertyValue("--loading-progress-cap-size")
        .trim(),
      progressMarkerSize: getComputedStyle(progressTrack)
        .getPropertyValue("--loading-progress-marker-size")
        .trim(),
      liaAnimationName: getComputedStyle(liaTrack).animationName,
      liaRegistrationAnimationName:
        getComputedStyle(liaRegistration).animationName,
      titleFontFamily: getComputedStyle(title).fontFamily,
      stageDuration: stage.getAttribute("data-duration-ms"),
      layoutVersion: stage.getAttribute("data-loading-layout-version"),
      motionTimelineVersion: stage.getAttribute("data-motion-timeline-version"),
      frameRegistration: liaRegistration.getAttribute(
        "data-lia-frame-registration",
      ),
      frameRegistrationAnchor: liaRegistration.getAttribute(
        "data-lia-frame-registration-anchor",
      ),
      frameCount: liaRegistration.getAttribute("data-lia-frame-count"),
      entryState: liaTrack.getAttribute("data-entry-state"),
      visualScale: sceneStyles
        .getPropertyValue("--loading-visual-scale")
        .trim(),
      plantX: sceneStyles.getPropertyValue("--loading-plant-x").trim(),
      plantBottom: sceneStyles
        .getPropertyValue("--loading-plant-bottom")
        .trim(),
      haloX: sceneStyles.getPropertyValue("--loading-halo-x").trim(),
      haloWidth: sceneStyles.getPropertyValue("--loading-halo-width").trim(),
      haloScaleX: sceneStyles.getPropertyValue("--loading-halo-scale-x").trim(),
      haloBottom: sceneStyles.getPropertyValue("--loading-halo-bottom").trim(),
      liaFinalX: sceneStyles.getPropertyValue("--loading-lia-final-x").trim(),
      liaFinalBottom: sceneStyles
        .getPropertyValue("--loading-lia-final-bottom")
        .trim(),
      waterOriginX: sceneStyles
        .getPropertyValue("--loading-water-origin-x")
        .trim(),
      waterOriginY: sceneStyles
        .getPropertyValue("--loading-water-origin-y")
        .trim(),
      waterTargetX: sceneStyles
        .getPropertyValue("--loading-water-target-x")
        .trim(),
      waterTargetY: sceneStyles
        .getPropertyValue("--loading-water-target-y")
        .trim(),
      waterAnchor: waterField.getAttribute("data-water-anchor"),
      waterTarget: waterField.getAttribute("data-water-target"),
    };
  });

  expect(durations.progressDuration).toBe("12s");
  expect(durations.progressMarkerDuration).toBe("12s");
  expect(durations.stageDuration).toBe("12000");
  expect(durations.layoutVersion).toBe("v13");
  expect(durations.motionTimelineVersion).toBe("v13");
  expect(durations.frameRegistration).toBe("v13");
  expect(durations.frameRegistrationAnchor).toBe("visor-collar");
  expect(durations.frameCount).toBe("16");
  expect(durations.visualScale).toBe("0.9");
  expect(durations.progressTrackHeight).toBe("2px");
  expect(durations.progressCapSize).toBe("9px");
  expect(durations.progressMarkerSize).toBe("9px");
  expect(durations.titleFontFamily).toContain("Pixelify Sans");
  expect(durations.liaAnimationName).toContain("loading-lia-entry-path");
  expect(durations.liaRegistrationAnimationName).toContain(
    "loading-lia-frame-registration-v13",
  );
  expect(durations.entryState).toBe("lateral-offscreen-to-plant");
  expect(durations.plantX).toBe("30%");
  expect(durations.plantBottom).toBe("-12px");
  expect(durations.haloX).toBe("50%");
  expect(durations.haloWidth).toBe("min(104%, 430px)");
  expect(durations.haloScaleX).toBe("1.14");
  expect(durations.haloBottom).toBe("-6px");
  expect(durations.liaFinalX).toBe("65%");
  expect(durations.liaFinalBottom).toBe("168px");
  expect(durations.waterOriginX).toBe("-5%");
  expect(durations.waterOriginY).toBe("80%");
  expect(durations.waterTargetX).toBe("-15%");
  expect(durations.waterTargetY).toBe("78%");
  expect(durations.waterAnchor).toBe("lia-nozzle");
  expect(durations.waterTarget).toBe("plant");
});

test("reduced motion reduce duracion y evita riego multi-stream animado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/carga");

  const reduced = await page.evaluate(() => {
    const progressFill = document.querySelector(
      ".loading-initial__progress-fill",
    );
    const progressMarker = document.querySelector(
      ".loading-initial__progress-marker",
    );
    const waterField = document.querySelector(".loading-initial__water-field");

    if (!progressFill || !progressMarker || !waterField) {
      throw new Error("Faltan elementos para reduced motion.");
    }

    return {
      progressDuration: getComputedStyle(progressFill).animationDuration,
      progressMarkerDuration:
        getComputedStyle(progressMarker).animationDuration,
      waterDisplay: getComputedStyle(waterField).display,
      overflowHorizontal:
        document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  expect(reduced.progressDuration).toBe("1.3s");
  expect(reduced.progressMarkerDuration).toBe("1.3s");
  expect(reduced.waterDisplay).toBe("none");
  expect(reduced.overflowHorizontal).toBe(false);
});
