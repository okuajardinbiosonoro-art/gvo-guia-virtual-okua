import { expect, test } from "@playwright/test";

test("muestra la carga inicial en la primera ruta del recorrido", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(
    page.getByRole("progressbar", {
      name: "Progreso de preparación del recorrido",
    }),
  ).toBeVisible();
  await expect(page.getByText("Portada / Intro")).toHaveCount(0);
  await expect(page.getByText("Estación I")).toHaveCount(0);
});

test("muestra la carga inicial en /carga", async ({ page }) => {
  await page.goto("/carga");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
});
