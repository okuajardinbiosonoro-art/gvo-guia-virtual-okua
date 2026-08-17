import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { evidenceDirectory } from "./support/evidence";

const qaOutputDir = evidenceDirectory("cover-intro-002j-fix");

async function ensureActivationAssetsReady(page: Page) {
  const cover = page.locator("main[data-cover-phase]");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await expect(cover).toHaveAttribute(
        "data-activation-assets-status",
        "ready",
        { timeout: 12_000 },
      );
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }

      await page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 });
      await expect(
        page.getByRole("button", { name: "Comenzar recorrido" }),
      ).toBeVisible();
    }
  }
}

async function prepareFreshCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada?resetIntro=1", {
    waitUntil: "commit",
    timeout: 30_000,
  });
  await expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible({ timeout: 60_000 });
  await ensureActivationAssetsReady(page);
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(qaOutputDir, name),
  });
}

async function finishIntroDialogue(page: Page) {
  await page.getByRole("button", { name: "Comenzar recorrido" }).click();

  for (let index = 0; index < 4; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }

  await page.getByRole("button", { name: "Finalizar introducción" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toBeVisible();
}

test.describe("QA visual Portada / Intro 002J-FIX", () => {
  test.describe.configure({ timeout: 180_000 });

  test.beforeAll(() => {
    mkdirSync(qaOutputDir, { recursive: true });
  });

  test("genera capturas 002J-FIX de microvida y diálogo revisado", async ({
    page,
  }) => {
    await prepareFreshCover(page);

    await expect(
      page.locator('[data-lia-avatar-mode="rig-idle"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="head-clean"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="eyes-neutral"]'),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Lía, guía visual de OKÚA" }),
    ).toHaveCount(1);

    await capture(page, "cover-intro-002j-fix-01-idle-rig-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();

    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(
      page.locator('[data-lia-avatar-mode="rig-idle"]'),
    ).toBeVisible();
    await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="eyes-happy"]'),
    ).toBeVisible();
    await expect(page.getByText("1/5")).toHaveCount(0);
    await capture(page, "cover-intro-002j-fix-02-dialogue-happy-390x844.png");

    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
    await expect(
      page.locator('[data-lia-expression="attentive"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="eyes-attentive"]'),
    ).toBeVisible();
    await capture(
      page,
      "cover-intro-002j-fix-03-dialogue-attentive-390x844.png",
    );

    for (let index = 0; index < 3; index += 1) {
      await page
        .getByRole("button", { name: "Siguiente diálogo de Lía" })
        .click();
    }

    await expect(page.getByText("Paso 5 de 5")).toBeVisible();
    await expect(page.locator('[data-lia-avatar-mode="pose"]')).toBeVisible();
    await expect(page.locator('[data-lia-pose="pointPortal1"]')).toBeVisible();
    await page.getByRole("button", { name: "Finalizar introducción" }).click();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toBeVisible();
    await capture(page, "cover-intro-002j-fix-04-portal-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    const openingCover = page.locator(
      'main[data-cover-phase="portal_1_opening_placeholder"]',
    );
    const activationRig = openingCover.getByTestId(
      "cover-portal-activation-rig",
    );
    const activationLia = openingCover.getByTestId("cover-activation-lia");
    const activationPortalFront = openingCover.getByTestId(
      "cover-activation-portal-front",
    );
    const activationContact = openingCover.getByTestId(
      "cover-activation-contact-light",
    );
    const portalOne = openingCover.locator('[data-portal-id="portal-1"]');
    const handoffCta = openingCover.getByRole("button", {
      name: "Entrar a Mundo I",
    });

    await expect(openingCover).toBeVisible({ timeout: 30_000 });

    await Promise.all([
      expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/),
      expect(openingCover).toBeVisible(),
      expect(openingCover.getByText("Abriendo Mundo I: Raíz...")).toBeVisible(),
      expect(activationRig).toBeVisible(),
      expect(activationLia).toBeVisible(),
      expect(activationPortalFront).toBeVisible(),
      expect(activationContact).toBeVisible(),
      expect(portalOne).toBeDisabled(),
      expect(handoffCta).toBeDisabled(),
      expect(openingCover.locator(".cover-intro__lia-wrap")).toHaveCSS(
        "opacity",
        "0",
      ),
    ]);

    const activationIdentity = await activationLia.evaluate((image) => ({
      runtimeAsset: image.getAttribute("data-runtime-asset"),
      src: image.getAttribute("src"),
    }));
    expect(activationIdentity.runtimeAsset).toBeTruthy();
    expect(activationIdentity.src).toBe(activationIdentity.runtimeAsset);
    const activationMetrics = await activationLia.evaluate((image) => {
      const element = image as HTMLImageElement;
      const rect = element.getBoundingClientRect();

      return {
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        rect: {
          width: rect.width,
          height: rect.height,
        },
      };
    });
    expect(activationMetrics.complete).toBe(true);
    expect(activationMetrics.naturalWidth).toBeGreaterThan(0);
    expect(activationMetrics.naturalHeight).toBeGreaterThan(0);
    expect(activationMetrics.rect.width).toBeGreaterThan(0);
    expect(activationMetrics.rect.height).toBeGreaterThan(0);
    await capture(
      page,
      "cover-intro-002j-fix-05-opening-activation-390x844.png",
    );

    await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
      timeout: 20_000,
    });
    const transition = page.locator(
      'main[data-transition-world-id="intro-to-station-1"]',
    );
    await expect(transition).toBeVisible({ timeout: 30_000 });
    await expect(transition.getByText("Abriendo Mundo I")).toBeVisible();
    await expect(transition.locator("#transition-world-subtitle")).toHaveText(
      "Preparando la raíz.",
    );
  });

  test("conserva readiness y handoff contractual con reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await prepareFreshCover(page);
    await finishIntroDialogue(page);

    const handoffStartedAt = Date.now();
    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    const openingCover = page.locator(
      'main[data-cover-phase="portal_1_opening_placeholder"]',
    );
    const activationRig = openingCover.getByTestId(
      "cover-portal-activation-rig",
    );
    const activationLia = openingCover.getByTestId("cover-activation-lia");

    await expect(openingCover).toBeVisible({ timeout: 30_000 });
    await expect(activationRig).toBeVisible();
    await expect(activationLia).toBeVisible();
    await expect(openingCover.locator(".cover-intro__lia-wrap")).toHaveCSS(
      "opacity",
      "0",
    );

    const activationMetrics = await activationLia.evaluate((image) => {
      const element = image as HTMLImageElement;
      const rect = element.getBoundingClientRect();
      return {
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
        width: rect.width,
        height: rect.height,
      };
    });
    expect(activationMetrics.complete).toBe(true);
    expect(activationMetrics.naturalWidth).toBeGreaterThan(0);
    expect(activationMetrics.naturalHeight).toBeGreaterThan(0);
    expect(activationMetrics.width).toBeGreaterThan(0);
    expect(activationMetrics.height).toBeGreaterThan(0);

    await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
      timeout: 15_000,
    });
    expect(Date.now() - handoffStartedAt).toBeGreaterThanOrEqual(900);
    const transition = page.locator(
      'main[data-transition-world-id="intro-to-station-1"]',
    );
    await expect(transition.getByText("Abriendo Mundo I")).toBeVisible();
    await expect(transition.locator("#transition-world-subtitle")).toHaveText(
      "Preparando la raíz.",
    );
  });
});
