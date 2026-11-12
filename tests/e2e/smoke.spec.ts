import { expect, test } from "@playwright/test";
import { openEditorialCover, enterAfterEditorialIntro, expectNoHorizontalOverflow } from "./support/editorial-entry";

for (const route of ["/", "/carga"]) {
  test(`muestra bienvenida y preparación reales en ${route}`, async ({page}) => {
    await page.goto(route);
    await expect(page.getByRole("heading",{name:"Bienvenido a OKÚA"})).toBeVisible();
    await expect(page.getByText("Preparando tu recorrido",{exact:true})).toBeVisible();
    await expect(page.getByRole("progressbar")).toBeVisible();
    await expect(page.locator("audio,video")).toHaveCount(0);
  });
}

test("se puede omitir la presentación de carga preservando la preparación real", async ({page}) => {
  await page.goto("/");
  await page.getByRole("button",{name:"Omitir presentación"}).click();
  await expect(page).toHaveURL(/\/inicio$/, {timeout:20000});
  await expect(page.getByRole("heading", {level:1})).toBeVisible();
});

test("recorre Portada sin adjudicar progreso de aprendizaje por la presentación", async ({page}) => {
  await openEditorialCover(page);
  await enterAfterEditorialIntro(page);
  await expect(page.locator("main[data-world1-root-state]")).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem("gvo.progress.v1")||'{"completedStations":[]}').completedStations)).toEqual([]);
});

test("resetIntro respeta datos ajenos y vuelve a la primera presentación", async ({page}) => {
  await page.goto("/portada");
  await page.evaluate(()=>{localStorage.setItem("gvo.coverIntro.introCompleted.v1","true");localStorage.setItem("unrelated-preference","kept");});
  await openEditorialCover(page);
  expect(await page.evaluate(()=>localStorage.getItem("gvo.coverIntro.introCompleted.v1"))).toBeNull();
  expect(await page.evaluate(()=>localStorage.getItem("unrelated-preference"))).toBe("kept");
});

test("resetIntro desde carga permite omitir y conserva la entrada fresca", async ({page}) => {
  await page.goto("/?resetIntro=1");
  await page.getByRole("button",{name:"Omitir presentación"}).click();
  await expect(page.getByRole("button",{name:"Empieza aquí"})).toBeVisible({timeout:20000});
});

test("movimiento reducido conserva contenido y omisión", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await openEditorialCover(page);
  await page.getByRole("button",{name:"Entrar sin presentación"}).click();
  await expect(page).toHaveURL(/\/estacion\/1$/, {timeout:20000});
});

for(const viewport of [{width:360,height:640},{width:375,height:667},{width:390,height:844},{width:414,height:896},{width:430,height:932}]) {
  test(`carga sin desborde horizontal ${viewport.width}×${viewport.height}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.goto("/carga");
    await expect(page.getByRole("heading",{name:"Bienvenido a OKÚA"})).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
