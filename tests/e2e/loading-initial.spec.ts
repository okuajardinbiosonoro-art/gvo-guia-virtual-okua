import { expect, test } from "@playwright/test";

test("carga inicial V2 conserva rutas, textos y ausencia de portada", async ({
  page,
}) => {
  await page.goto("/carga");

  await expect(
    page.getByRole("heading", { name: "Preparando el recorrido" }),
  ).toBeVisible();
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.locator("[data-sparkle-slot]")).toHaveCount(6);
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
    const liaTrack = document.querySelector(".loading-initial__lia-track");
    const stage = document.querySelector(".loading-initial__stage");

    if (!progressFill || !liaTrack || !stage) {
      throw new Error("Faltan elementos de carga inicial V2.");
    }

    return {
      progressDuration: getComputedStyle(progressFill).animationDuration,
      liaAnimationName: getComputedStyle(liaTrack).animationName,
      stageDuration: stage.getAttribute("data-duration-ms"),
      entryState: liaTrack.getAttribute("data-entry-state"),
    };
  });

  expect(durations.progressDuration).toBe("12s");
  expect(durations.stageDuration).toBe("12000");
  expect(durations.liaAnimationName).toContain("loading-lia-entry-path");
  expect(durations.entryState).toBe("lateral-offscreen-to-plant");
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
    const waterField = document.querySelector(".loading-initial__water-field");

    if (!progressFill || !waterField) {
      throw new Error("Faltan elementos para reduced motion.");
    }

    return {
      progressDuration: getComputedStyle(progressFill).animationDuration,
      waterDisplay: getComputedStyle(waterField).display,
      overflowHorizontal:
        document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  expect(reduced.progressDuration).toBe("1.3s");
  expect(reduced.waterDisplay).toBe("none");
  expect(reduced.overflowHorizontal).toBe(false);
});
