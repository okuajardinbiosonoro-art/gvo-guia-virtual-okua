import { expect, test } from "@playwright/test";
import { openEditorialCover, readEditorialIntro, enterAfterEditorialIntro } from "./support/editorial-entry";

test("Portada ofrece tres ideas y entrada directa sin portales redundantes", async ({page}) => {
  await openEditorialCover(page);
  await expect(page.getByRole("heading", {name: "Exposición Interactiva"})).toBeVisible();
  await expect(page.locator("[data-portal-id]")).toHaveCount(0);
  await enterAfterEditorialIntro(page);
  expect(await page.evaluate(() => localStorage.getItem("gvo.coverIntro.introCompleted.v1"))).toBe("true");
});

test("el recorrido sigue siendo local, insonoro y sin permiso de micrófono", async ({page}) => {
  const external: string[]=[];
  page.on("request", request => {const url=new URL(request.url());if(!["127.0.0.1","localhost"].includes(url.hostname)&&!["data:","blob:"].includes(url.protocol))external.push(url.href);});
  await openEditorialCover(page);
  await readEditorialIntro(page);
  await expect(page.locator("audio,video,iframe")).toHaveCount(0);
  expect(external).toEqual([]);
});
