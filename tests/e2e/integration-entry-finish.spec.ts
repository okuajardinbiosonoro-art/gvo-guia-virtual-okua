import { mkdir, writeFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";

const evidence =
  "docs/narrative/integracion_autonoma_2026-10-23/revision-acabado/evidence-entry/after";

test.use({ deviceScaleFactor: 1 });

for (const viewport of [
  { width: 280, height: 653 },
  { width: 375, height: 667 },
  { width: 667, height: 375 },
  { width: 568, height: 280 },
]) {
  test(`acabado de entrada: omisiones integradas y salida única ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await mkdir(evidence, { recursive: true });
    await page.setViewportSize(viewport);
    const label = `${viewport.width}x${viewport.height}`;
    const captures: unknown[] = [];
    const capture = async (name: string) => {
      if (name.startsWith("cover") || name.startsWith("intro")) {
        await page.evaluate(async () => {
          const animations =
            document
              .querySelector(".cover-intro__stage")
              ?.getAnimations({ subtree: true }) ?? [];
          await Promise.all(
            animations
              .filter(
                (animation) =>
                  animation.effect?.getTiming().iterations !== Infinity,
              )
              .map((animation) => animation.finished.catch(() => undefined)),
          );
        });
      }
      const geometry = await page.evaluate(() => ({
        viewport: { width: innerWidth, height: innerHeight },
        visualViewport: {
          width: window.visualViewport?.width,
          height: window.visualViewport?.height,
        },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        devicePixelRatio,
        route: location.pathname,
        scrollY,
        mainScroll: {
          top: document.querySelector("main")?.scrollTop,
          height: document.querySelector("main")?.scrollHeight,
          clientHeight: document.querySelector("main")?.clientHeight,
        },
      }));
      const filename = `${name}-${label}.png`;
      const png = await page.screenshot({
        path: `${evidence}/${filename}`,
        fullPage: true,
      });
      captures.push({
        filename,
        configuredViewport: viewport,
        fullPage: true,
        imagePixels: {
          width: png.readUInt32BE(16),
          height: png.readUInt32BE(20),
        },
        ...geometry,
      });
      await writeFile(
        `${evidence}/captures-${label}.json`,
        JSON.stringify(captures, null, 2),
      );
      if (viewport.width > viewport.height && geometry.route === "/portada") {
        expect(geometry.mainScroll.top).toBe(0);
        expect(
          geometry.mainScroll.height! - geometry.mainScroll.clientHeight!,
        ).toBeLessThanOrEqual(1);
      }
    };
    const freeze = () =>
      page.evaluate(() => {
        for (const animation of document.getAnimations()) {
          animation.pause();
          animation.currentTime = 7000;
        }
      });
    const expectQuietAction = async (name: string) => {
      const button = page.getByRole("button", { name, exact: true });
      await expect(button).toBeInViewport();
      const style = await button.evaluate((element) => {
        const computed = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          border: computed.borderTopWidth,
          background: computed.backgroundColor,
          height: rect.height,
          position: computed.position,
        };
      });
      expect(style.border).toBe("0px");
      expect(style.background).toBe("rgba(0, 0, 0, 0)");
      expect(style.height).toBeGreaterThanOrEqual(44);
      expect(style.position).not.toBe("fixed");
      return button;
    };

    await page.goto("/");
    await page.locator(".loading-initial-skip").waitFor();
    await freeze();
    await capture("loading");
    const loadingSkip = await expectQuietAction("Omitir presentación");
    await expect(page.locator(".loading-initial__progress-area")).toContainText(
      "Omitir presentación",
    );
    await loadingSkip.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/inicio$/, { timeout: 20000 });

    await page.goto("/portada?resetIntro=1");
    await expect(
      page.locator("main[data-critical-assets-ready='true']"),
    ).toBeVisible();
    await expectQuietAction("Entrar sin presentación");
    if (viewport.width < 320) {
      const lia = await page
        .getByRole("img", { name: "Lía, guía visual de OKÚA", exact: true })
        .boundingBox();
      expect(lia).not.toBeNull();
      expect(lia!.x).toBeGreaterThanOrEqual(0);
      expect(lia!.x + lia!.width).toBeLessThanOrEqual(viewport.width);
    }
    await expect(
      page.locator(".cover-intro__footer .cover-intro__route-help"),
    ).toHaveCount(0);
    await capture("cover");
    await page
      .getByRole("button", { name: "Empieza aquí", exact: true })
      .click();
    await expectQuietAction("Omitir presentación y entrar");
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByRole("dialog")).toContainText(
      "Recorreremos las salas en orden.",
    );
    await capture("intro-second");
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByRole("dialog").getByRole("button")).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "¡Adelante!", exact: true }),
    ).toBeInViewport();
    await capture("intro-final");

    await page.evaluate(() =>
      localStorage.setItem(
        "gvo.progress.v1",
        JSON.stringify({
          schemaVersion: 1,
          completedStations: [1, 2, 3, 4, 5],
          updatedAt: "2026-10-23T12:00:00Z",
        }),
      ),
    );
    await page.goto("/transition/world-2-to-world-3");
    await expect(
      page.locator("main[data-critical-assets-ready='true']"),
    ).toBeVisible();
    const transitionSkip = await expectQuietAction("Continuar ahora");
    await freeze();
    await capture("transition");
    await transitionSkip.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/estacion\/3$/, { timeout: 20000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  });
}
