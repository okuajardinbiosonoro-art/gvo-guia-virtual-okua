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
  "002K",
);

async function completeIntro(page: Page) {
  await page.goto("/portada?resetIntro=1");
  await expect(page).toHaveURL(/\/portada(?:\?resetIntro=1)?$/);
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

async function capture(page: Page, name: string) {
  await page.screenshot({
    fullPage: true,
    path: path.join(qaOutputDir, name),
  });
}

test.describe("QA visual Portada / Intro 002K", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeAll(() => {
    mkdirSync(qaOutputDir, { recursive: true });
  });

  test("genera capturas de coreografía Portal I y transition placeholder", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await completeIntro(page);

    await expect(
      page.locator('[data-cover-phase="portal_1_ready"]'),
    ).toBeVisible();
    await expect(page.locator('[data-lia-pose="pointPortal1"]')).toBeVisible();
    await capture(page, "cover-intro-002k-01-portal-ready-390x844.png");

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(
      page.locator('[data-cover-phase="portal_1_opening_placeholder"]'),
    ).toBeVisible();
    await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
    await expect(
      page.getByTestId("cover-portal-activation-rig"),
    ).toHaveAttribute("data-activation-stage", "portal-i");
    await expect(page.getByTestId("cover-activation-lia")).toBeVisible();
    await expect(
      page.getByTestId("cover-activation-portal-front"),
    ).toBeVisible();
    await expect(
      page.getByTestId("cover-activation-contact-light"),
    ).toBeVisible();
    await page.waitForTimeout(160);
    await capture(page, "cover-intro-002k-02-activation-opening-390x844.png");

    await expect(
      page.locator('[data-cover-phase="transition_to_station_1_placeholder"]'),
    ).toBeVisible();
    await expect(page.getByText("Preparando recorrido...")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar a Mundo I" }),
    ).toHaveAttribute("href", "/estacion/1");
    await capture(
      page,
      "cover-intro-002k-03-transition-placeholder-390x844.png",
    );
  });

  test("genera captura reduced motion de opening sin romper gating", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await completeIntro(page);

    await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
    await expect(
      page.locator('[data-cover-phase="portal_1_opening_placeholder"]'),
    ).toBeVisible();
    await expect(page.getByTestId("cover-portal-activation-rig")).toBeVisible();
    await expect(page.locator("audio")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
    await capture(
      page,
      "cover-intro-002k-04-reduced-motion-opening-390x844.png",
    );
  });
});
