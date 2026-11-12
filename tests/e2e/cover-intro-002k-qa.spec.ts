import { expect, test } from "@playwright/test";
import { openEditorialCover, readEditorialIntro } from "./support/editorial-entry";

test("preload real conserva la intención de entrada y evita avance anticipado", async ({page}) => {
  let release:()=>void=()=>{};
  const released=new Promise<void>(resolve=>{release=resolve;});
  await page.route("**/lia_pose_activate_portal_1_v1.png",async route=>{await released;await route.continue();});
  await openEditorialCover(page);
  await page.getByRole("button",{name:"Entrar sin presentación"}).click();
  await expect(page).toHaveURL(/\/portada$/);
  await expect(page.locator("main[data-cover-phase]")).toHaveAttribute("data-cover-phase","portal_1_ready");
  release();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
});

test("la doble pulsación de entrada produce una sola transición", async ({page}) => {
  await openEditorialCover(page);
  await readEditorialIntro(page);
  let transitions=0;
  page.on("framenavigated",frame=>{if(frame===page.mainFrame()&&frame.url().endsWith("/transition/intro-to-station-1"))transitions+=1;});
  await page.getByRole("button",{name:"¡Adelante!",exact:true}).dblclick();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
  expect(transitions).toBe(1);
});
