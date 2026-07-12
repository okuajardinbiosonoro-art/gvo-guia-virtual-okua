/* global document -- se usa dentro de page.evaluate (contexto de navegador) */

/**
 * Sonda de geometría/hit-test de Estación V (FABLE5-S5-01).
 * Mide la posición proyectada de los botones táctiles y del nexo en varios
 * viewports móviles. Sirvió para detectar que el hit-test 3D de Chromium
 * falla en la mitad inferior del plano rotado y para calibrar la capa táctil
 * plana (areaTouchAnchors en World5RootScreen.tsx).
 * Uso: npx vite preview --port 4175 & node tools/debug-station5-click.mjs
 */
import { chromium } from "@playwright/test";

const BASE = process.env.S5_BASE_URL ?? "http://localhost:4175";

let browser;
try {
  browser = await chromium.launch({ channel: "chromium" });
} catch {
  browser = await chromium.launch();
}

for (const viewport of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/estacion/5`, { waitUntil: "networkidle" });
  await page.waitForSelector(
    '[data-station5-state="station5_plants_suggested"]',
  );

  const data = await page.evaluate(() => {
    const stage = document
      .querySelector(".s5-stage")
      .getBoundingClientRect();
    const out = { stage: [stage.width, stage.height].map(Math.round) };
    for (const id of ["plantas", "sistema", "espacio", "visitante"]) {
      const box = document
        .querySelector(`[data-station5-area="${id}"]`)
        .getBoundingClientRect();
      out[id] = {
        cx: Math.round(((box.x + box.width / 2 - stage.x) / stage.width) * 1000) / 10,
        cy: Math.round(((box.y + box.height / 2 - stage.y) / stage.height) * 1000) / 10,
        w: Math.round((box.width / stage.width) * 1000) / 10,
        h: Math.round((box.height / stage.height) * 1000) / 10,
      };
    }
    const nexus = document.querySelector(".s5-nexus").getBoundingClientRect();
    out.nexus = {
      cx: Math.round(((nexus.x + nexus.width / 2 - stage.x) / stage.width) * 1000) / 10,
      cy: Math.round(((nexus.y + nexus.height / 2 - stage.y) / stage.height) * 1000) / 10,
    };
    return out;
  });
  console.log(`${viewport.width}x${viewport.height}`, JSON.stringify(data));
  await context.close();
}

await browser.close();
