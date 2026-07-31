import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const fix2QaOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "cover-intro",
  "qa",
  "002I-FIX2",
);

async function prepareFreshCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada");
  await page.evaluate(() => {
    window.localStorage.removeItem("gvo.coverIntro.introCompleted.v1");
  });
  await page.goto("/portada?resetIntro=1");
  await expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toHaveCount(0);
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(fix2QaOutputDir, name),
  });
}

async function completeDialoguesFromStepTwo(page: Page) {
  for (let index = 0; index < 3; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }

  await page.getByRole("button", { name: "Finalizar introducción" }).click();
}

test.describe("QA visual Portada / Intro 002I-FIX2", () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeAll(() => {
    mkdirSync(fix2QaOutputDir, { recursive: true });
  });

  test("genera capturas 002I-FIX2 de diálogo y activación Portal I", async ({
    page,
  }) => {
    await prepareFreshCover(page);

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();
    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(page.getByText("1/5")).toHaveCount(0);
    await capture(page, "cover-intro-fix2-01-dialogue-01-390x844.png");

    const dialogueBox = await page
      .getByTestId("cover-dialogue-panel")
      .boundingBox();
    const liaBox = await page.locator(".cover-intro__lia").boundingBox();

    expect(dialogueBox).not.toBeNull();
    expect(liaBox).not.toBeNull();
    expect(dialogueBox!.y).toBeGreaterThan(liaBox!.y + 130);

    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
    await expect(page.getByText("2/5")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-fix2-02-dialogue-clarification-390x844.png",
    );

    await completeDialoguesFromStepTwo(page);
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toBeVisible();
    await capture(page, "cover-intro-fix2-03-portal-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
    await expect(page.getByTestId("cover-portal-activation-rig")).toBeVisible();
    await page.waitForTimeout(120);

    const activationBox = await page
      .getByTestId("cover-portal-activation-rig")
      .boundingBox();
    const portalBox = await page
      .locator('[data-portal-id="portal-1"]')
      .boundingBox();

    expect(activationBox).not.toBeNull();
    expect(portalBox).not.toBeNull();
    expect(
      Math.abs(
        activationBox!.x +
          activationBox!.width / 2 -
          (portalBox!.x + portalBox!.width / 2),
      ),
    ).toBeLessThan(32);
    expect(activationBox!.y).toBeLessThan(portalBox!.y + 8);

    await capture(page, "cover-intro-fix2-04-opening-activation-390x844.png");

    await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
      timeout: 5000,
    });
    await expect(page.getByText("Preparando la raíz.")).toBeVisible();
    await expect(page.locator("button")).toHaveCount(0);
    await expect(page.locator("a")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-fix2-05-transition-placeholder-390x844.png",
    );
  });

  test("genera captura del flujo root reset hacia portada fresca", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/portada");
    await page.evaluate(() => {
      window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
    });

    await page.goto("/?resetIntro=1");
    await expect(page).toHaveURL(/\/portada$/, { timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "Comenzar recorrido" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Entrar a Mundo I" }),
    ).toHaveCount(0);
    await capture(page, "cover-intro-fix2-06-root-reset-flow-390x844.png");
  });
});
