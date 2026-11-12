import { expect, test } from "@playwright/test";
import { openEditorialCover, enterAfterEditorialIntro, expectNoHorizontalOverflow } from "./support/editorial-entry";

test("movimiento reducido conserva presentación y salida manual", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await openEditorialCover(page);
  await enterAfterEditorialIntro(page);
  await expect(page.locator("main[data-world1-root-state]")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("los controles de presentación funcionan con teclado", async ({page}) => {
  await openEditorialCover(page);
  await page.getByRole("button", {name:"Empieza aquí"}).focus();
  await page.keyboard.press("Enter");
  const next=page.getByRole("button", {name:"Siguiente diálogo de Lía"});
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Paso 2 de 3")).toBeVisible();
  await page.getByRole("button", {name:"Omitir presentación y entrar"}).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
});
