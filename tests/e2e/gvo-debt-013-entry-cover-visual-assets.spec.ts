import { expect, test, type Page } from "@playwright/test";

const initialViewports = [
  { name: "portrait", width: 390, height: 844 },
  { name: "landscape", width: 844, height: 390 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const coverViewports = [
  { name: "portrait", width: 390, height: 844 },
  { name: "landscape", width: 844, height: 390 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

async function waitForStationAssets(page: Page) {
  const assets = page.locator("[data-entry-cover-station-asset]");
  await expect(assets).toHaveCount(5);
  await expect
    .poll(
      async () =>
        assets.evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth === 1024 &&
              image.currentSrc.startsWith(window.location.origin),
          ),
        ),
      { timeout: 20_000 },
    )
    .toBe(true);
}

async function waitForCoverPortalInteriors(page: Page) {
  const assets = page.locator("[data-cover-portal-interior]");
  await expect(assets).toHaveCount(5);
  await expect
    .poll(
      async () =>
        assets.evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth === 1024 &&
              image.naturalHeight === 1872 &&
              image.currentSrc.startsWith(window.location.origin) &&
              getComputedStyle(image).objectFit === "cover",
          ),
        ),
      { timeout: 20_000 },
    )
    .toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectMinimumTargets(page: Page) {
  const undersized = await page.locator("button").evaluateAll((buttons) =>
    buttons
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          label: button.getAttribute("aria-label") ?? button.textContent,
          width: rect.width,
          height: rect.height,
        };
      })
      .filter((button) => button.width < 44 || button.height < 44),
  );
  expect(undersized).toEqual([]);
}

for (const viewport of initialViewports) {
  test(`/inicio ${viewport.name} integra identidad, controles y cinco estaciones`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/inicio", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator("[data-initial-experience-visual='debt-013']"),
    ).toBeVisible();
    await waitForStationAssets(page);

    const sources = await page
      .locator("[data-entry-cover-station-asset]")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("data-runtime-asset")),
      );
    expect(new Set(sources).size).toBe(5);
    expect(
      sources.every((source) =>
        source?.startsWith("/assets/gvo/stations/final-root/access/"),
      ),
    ).toBe(true);

    await expect(page.getByRole("button", { name: "Español" })).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Pantalla completa / Fullscreen",
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Español" }).click();
    await expect(
      page.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();

    await expectNoHorizontalOverflow(page);
    await expectMinimumTargets(page);
    await expect(page.locator("audio")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
  });
}

for (const viewport of coverViewports) {
  test(`Portada ${viewport.name} diferencia Portal I–V y preserva Lía y CTA`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/portada?resetIntro=1", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.locator("[data-cover-phase='portada_idle']"),
    ).toBeVisible();
    await waitForCoverPortalInteriors(page);

    const sources = await page
      .locator("[data-cover-portal-interior]")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("data-runtime-asset")),
      );
    expect(
      sources.every((source) =>
        source?.startsWith("/assets/runtime/cover-intro/portals/"),
      ),
    ).toBe(true);
    expect(
      sources.some((source) => source?.includes("/final-root/access/")),
    ).toBe(false);

    const geometry = await page
      .locator("[data-portal-id]")
      .evaluateAll((portals) => {
        const ctaRect = document
          .querySelector(".cover-intro__cta")
          ?.getBoundingClientRect();
        const intersects = (
          first: DOMRect | undefined,
          second: DOMRect | undefined,
        ) =>
          Boolean(first && second) &&
          first.left < second.right &&
          first.right > second.left &&
          first.top < second.bottom &&
          first.bottom > second.top;

        return portals.map((portal) => {
          const portalRect = portal.getBoundingClientRect();
          const representation = portal.querySelector(
            "[data-cover-portal-interior]",
          );
          const representationRect = representation?.getBoundingClientRect();

          return {
            portalId: portal.getAttribute("data-portal-id"),
            assetId: representation?.getAttribute("data-cover-portal-interior"),
            centerInside:
              Boolean(representationRect) &&
              representationRect.left + representationRect.width / 2 >=
                portalRect.left &&
              representationRect.left + representationRect.width / 2 <=
                portalRect.right &&
              representationRect.top + representationRect.height / 2 >=
                portalRect.top &&
              representationRect.top + representationRect.height / 2 <=
                portalRect.bottom,
            overlapsCta: intersects(representationRect, ctaRect),
          };
        });
      });

    expect(geometry).toHaveLength(5);
    expect(new Set(geometry.map((item) => item.assetId)).size).toBe(5);
    expect(geometry.every((item) => item.centerInside)).toBe(true);
    expect(geometry.some((item) => item.overlapsCta)).toBe(false);
    await expect(page.getByTestId("cover-lia-stage")).toBeVisible();
    await expect(page.locator(".cover-intro__cta")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectMinimumTargets(page);

    await page.locator(".cover-intro__cta").click();
    await expect(
      page.getByRole("dialog", { name: "Diálogo de Lía" }),
    ).toBeVisible();
    await expect(page.locator("[data-cover-portal-interior]")).toHaveCount(5);
  });
}

test("/inicio conserva reflow a zoom de texto 200 %", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.goto("/inicio", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await page.getByRole("button", { name: "English" }).click();
  await expect(
    page.getByRole("button", { name: "Start journey" }),
  ).toBeEnabled();
  await waitForStationAssets(page);
  await expectNoHorizontalOverflow(page);
  await expectMinimumTargets(page);
});
