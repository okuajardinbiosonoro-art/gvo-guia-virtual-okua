import { expect, test } from "@playwright/test";

test("muestra la base tecnica del recorrido GVO", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "GVO — Guía Virtual OKÚA",
  );
  await expect(page.getByText("Repositorio base técnico")).toBeVisible();
  await expect(
    page.getByText("Sin audio · Sin Internet · Mobile-first"),
  ).toBeVisible();
  await expect(
    page.getByText("Estación V - Mundo V: Mapa del presente"),
  ).toBeVisible();
});
