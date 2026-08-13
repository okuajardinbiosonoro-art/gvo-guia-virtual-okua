import { expect, test, type Page } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const GLOBAL_PROGRESS_KEY = "gvo.progress.v1";
const ROUTE_MODULES = [
  "TransitionWorld",
  "World1RootScreen",
  "World2RootScreen",
  "World3RootScreen",
  "World4RootScreen",
  "World5RootScreen",
  "FinalRootScreen",
] as const;

test.describe.configure({ timeout: 180_000 });

const stationCases = [
  {
    route: "/estacion/1",
    selector: ".world1-root-screen",
    module: "World1RootScreen",
  },
  {
    route: "/estacion/2",
    selector: ".world2-root-screen",
    module: "World2RootScreen",
  },
  { route: "/estacion/3", selector: ".s3-screen", module: "World3RootScreen" },
  { route: "/estacion/4", selector: ".s4-screen", module: "World4RootScreen" },
  { route: "/estacion/5", selector: ".s5-screen", module: "World5RootScreen" },
  { route: "/final", selector: "[data-final-root]", module: "FinalRootScreen" },
] as const;

async function installCompleteProgress(page: Page) {
  await page.addInitScript((storageKey) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        completedStations: [1, 2, 3, 4, 5],
        schemaVersion: 1,
        updatedAt: "2026-08-13T12:00:00.000Z",
      }),
    );
  }, GLOBAL_PROGRESS_KEY);
}

function moduleWasRequested(urls: readonly string[], moduleName: string) {
  return urls.some((url) => {
    const decodedUrl = decodeURIComponent(url);
    return (
      decodedUrl.includes(`/${moduleName}.tsx`) ||
      decodedUrl.includes(`/assets/${moduleName}-`)
    );
  });
}

test("la primera carga y Portada no descargan rutas diferidas", async ({
  page,
}) => {
  const responses: string[] = [];
  page.on("response", (response) => responses.push(response.url()));

  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator(".loading-initial")).toBeAttached({
    timeout: 90_000,
  });

  await page.goto("/portada", { waitUntil: "commit" });
  await expect(page.locator(".cover-intro")).toBeAttached({ timeout: 30_000 });

  for (const moduleName of ROUTE_MODULES) {
    expect(moduleWasRequested(responses, moduleName)).toBe(false);
  }
});

test("cada Mundo y Mirador cargan únicamente al entrar a su ruta", async ({
  page,
}) => {
  await installCompleteProgress(page);

  for (const stationCase of stationCases) {
    const responses: string[] = [];
    const collectResponse = (response: { url(): string }) =>
      responses.push(response.url());
    page.on("response", collectResponse);

    await page.goto(stationCase.route, { waitUntil: "commit" });
    await expect
      .poll(() => moduleWasRequested(responses, stationCase.module), {
        timeout: 60_000,
      })
      .toBe(true);
    await expect(page.locator(stationCase.selector)).toBeAttached({
      timeout: 60_000,
    });

    page.off("response", collectResponse);
  }
});

test("las transiciones I–V y Mirador precargan el destino y navegan sin corte", async ({
  page,
}) => {
  await installCompleteProgress(page);
  await page.emulateMedia({ reducedMotion: "reduce" });

  const transitionCases = [
    [
      "/transition/intro-to-station-1",
      "/estacion/1",
      ".world1-root-screen",
      "World1RootScreen",
    ],
    [
      "/transition/world-1-to-world-2",
      "/estacion/2",
      ".world2-root-screen",
      "World2RootScreen",
    ],
    [
      "/transition/world-2-to-world-3",
      "/estacion/3",
      ".s3-screen",
      "World3RootScreen",
    ],
    [
      "/transition/world-3-to-world-4",
      "/estacion/4",
      ".s4-screen",
      "World4RootScreen",
    ],
    [
      "/transition/world-4-to-world-5",
      "/estacion/5",
      ".s5-screen",
      "World5RootScreen",
    ],
    [
      "/transition/world-5-to-final",
      "/final",
      "[data-final-root]",
      "FinalRootScreen",
    ],
  ] as const;

  for (const [
    transitionRoute,
    destination,
    selector,
    targetModule,
  ] of transitionCases) {
    const responses: string[] = [];
    const collectResponse = (response: { url(): string }) =>
      responses.push(response.url());
    page.on("response", collectResponse);

    await page.goto(transitionRoute, { waitUntil: "commit" });
    await expect
      .poll(() => moduleWasRequested(responses, "TransitionWorld"), {
        timeout: 60_000,
      })
      .toBe(true);
    await expect
      .poll(() => moduleWasRequested(responses, targetModule), {
        timeout: 60_000,
      })
      .toBe(true);
    await expect(page).toHaveURL(new RegExp(`${destination}$`), {
      timeout: 60_000,
    });
    await expect(page.locator(selector)).toBeAttached({ timeout: 60_000 });

    page.off("response", collectResponse);
  }
});

test("QR conserva el contrato y entrega el chunk autorizado", async ({
  page,
}) => {
  await installCompleteProgress(page);
  const responses: string[] = [];
  page.on("response", (response) => responses.push(response.url()));

  await page.goto("/qr/w5", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/estacion\/5$/);
  await expect(page.locator(".s5-screen")).toBeAttached();
  expect(moduleWasRequested(responses, "World5RootScreen")).toBe(true);
});

test("el build mantiene shell precacheado y chunks de ruta en runtime cache", async () => {
  const distRoot = path.resolve(process.cwd(), "dist");
  const assetsRoot = path.join(distRoot, "assets");
  const [indexHtml, serviceWorker, assetNames] = await Promise.all([
    readFile(path.join(distRoot, "index.html"), "utf8"),
    readFile(path.join(distRoot, "sw.js"), "utf8"),
    readdir(assetsRoot),
  ]);
  const initialScript = indexHtml.match(/assets\/(index-[^"']+\.js)/)?.[1];
  const routeChunks = assetNames.filter(
    (name) =>
      ROUTE_MODULES.some((moduleName) => name.startsWith(moduleName)) &&
      /\.(?:css|js)$/.test(name),
  );

  expect(initialScript).toBeTruthy();
  expect(serviceWorker).toContain(`assets/${initialScript}`);
  expect(serviceWorker).toContain("gvo-runtime-assets-v1");
  expect(routeChunks.length).toBeGreaterThanOrEqual(13);
  for (const routeChunk of routeChunks) {
    expect(serviceWorker).not.toContain(`assets/${routeChunk}`);
  }
});
