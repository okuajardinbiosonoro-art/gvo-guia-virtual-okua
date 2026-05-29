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
  "002J",
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

test.describe("QA visual Portada / Intro 002J", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeAll(() => {
    mkdirSync(qaOutputDir, { recursive: true });
  });

  test("genera captura idle con rig facial seguro", async ({ page }) => {
    await prepareFreshCover(page);

    await expect(page.locator('[data-lia-avatar-mode="rig-idle"]')).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="head-clean"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-lia-rig-layer="eyes-neutral"]'),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: "Lía, guía visual de OKÚA" }))
      .toHaveCount(1);

    await capture(page, "cover-intro-002j-01-idle-rig-390x844.png");
  });

  test("genera captura de diálogo con pose completa sin ojos superpuestos", async ({
    page,
  }) => {
    await prepareFreshCover(page);
    await page.getByRole("button", { name: "Comenzar recorrido" }).click();

    await expect(page.getByText("Paso 1 de 5")).toBeVisible();
    await expect(page.locator('[data-lia-avatar-mode="pose"]')).toBeVisible();
    await expect(page.locator('[data-lia-pose="greeting"]')).toBeVisible();
    await expect(page.locator('[data-lia-rig-layer="eyes-neutral"]')).toHaveCount(
      0,
    );

    await capture(page, "cover-intro-002j-02-dialogue-greeting-390x844.png");
  });
});
