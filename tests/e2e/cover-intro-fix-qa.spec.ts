import { expect, test } from "@playwright/test";
import { openEditorialCover } from "./support/editorial-entry";

test("omitir desde el inicio no acredita presentación ni actividad leída", async ({page}) => {
  await openEditorialCover(page);
  await page.getByRole("button", {name: "Entrar sin presentación"}).click();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
  expect(await page.evaluate(() => localStorage.getItem("gvo.coverIntro.introCompleted.v1"))).toBeNull();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gvo.progress.v1")||'{"completedStations":[]}').completedStations)).toEqual([]);
});

test("omitir durante el diálogo interrumpe la presentación sin espera añadida", async ({page}) => {
  await openEditorialCover(page);
  await page.getByRole("button", {name:"Empieza aquí"}).click();
  await page.getByRole("button", {name:"Omitir presentación y entrar"}).click();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
  expect(await page.evaluate(() => localStorage.getItem("gvo.coverIntro.introCompleted.v1"))).toBeNull();
});
