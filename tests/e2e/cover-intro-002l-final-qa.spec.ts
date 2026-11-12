import { expect, test } from "@playwright/test";
import { openEditorialCover, enterAfterEditorialIntro, seedCompletedJourney } from "./support/editorial-entry";

test("refresh después de la presentación conserva el acceso sin repetirla", async ({page}) => {
  await openEditorialCover(page);
  await enterAfterEditorialIntro(page);
  await page.goto("/portada");
  await expect(page.getByRole("button",{name:"Entrar a Sala I"})).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button",{name:"Entrar a Sala I"}).click();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
});

test("Mirador restaura las cinco salas con nombres coherentes sin iniciar cámara", async ({page}) => {
  await seedCompletedJourney(page);
  await page.goto("/final");
  await page.getByRole("button",{name:"Volver a la portada sin borrar el recorrido completado"}).click();
  await expect(page.locator("main[data-cover-revisit]")).toHaveAttribute("data-cover-revisit","active");
  await expect(page.locator('[data-portal-state="available"]')).toHaveCount(5);
  await expect(page.getByRole("button",{name:"Revisar Sala III · Cuaderno de práctica"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Revisar Sala V · OKÚA, arte sensorial"})).toBeVisible();
  await page.getByRole("button",{name:"Revisar Sala III · Cuaderno de práctica"}).click();
  await expect(page).toHaveURL(/\/estacion\/3$/);
  await expect(page.locator('[data-final-review-active="true"]')).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
});
