import { mkdirSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const qaOutputDir = path.join(
  process.cwd(),
  "docs",
  "visual",
  "cover-intro",
  "qa",
  "002J-FIX",
);

async function prepareFreshCover(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/portada?resetIntro=1");
  await expect(page).toHaveURL(/\/portada$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible();
}

async function capture(page: Page, name: string) {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: path.join(qaOutputDir, name),
  });
}

test.describe("QA visual Portada / Intro 002J-FIX", () => {
  test.describe.configure({ timeout: 60_000 });

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
    await expect(page.getByRole("img", { name: "Lía, guía visual de OKÚA" }))
      .toHaveCount(1);

    await capture(page, "cover-intro-002j-fix-01-idle-rig-390x844.png");

    await page.getByRole("button", { name: "Comenzar recorrido" }).click();

    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(
      page.locator('[data-lia-avatar-mode="rig-idle"]'),
    ).toBeVisible();
    await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
    await expect(page.locator('[data-lia-rig-layer="eyes-happy"]')).toBeVisible();
    await expect(page.getByText("1/5")).toHaveCount(0);
    await capture(page, "cover-intro-002j-fix-02-dialogue-happy-390x844.png");

    await page.getByRole("button", { name: "Siguiente diálogo de Lía" }).click();
    await expect(page.getByText("Paso 2 de 5")).toBeVisible();
    await expect(page.locator('[data-lia-expression="attentive"]')).toBeVisible();
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
    await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
    await expect(page.locator('[data-lia-pose="activatePortal1"]')).toBeVisible();
    await page.waitForTimeout(120);
    await capture(
      page,
      "cover-intro-002j-fix-05-opening-activation-390x844.png",
    );
  });
});
