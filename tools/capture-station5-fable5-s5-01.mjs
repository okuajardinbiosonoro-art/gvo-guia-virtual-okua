import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.env.S5_BASE_URL ?? "http://127.0.0.1:4175";
const OUT = resolve(
  "E:/OKUA/04_DESARROLLO_REPOS/gvo-guia-virtual-okua/docs/visual/world5/fable5-s5-01",
);
mkdirSync(OUT, { recursive: true });

let browser;
try {
  browser = await chromium.launch({ channel: "chromium" });
} catch {
  browser = await chromium.launch();
}

async function newPage(viewport, reducedMotion = "no-preference") {
  const context = await browser.newContext({
    viewport,
    reducedMotion,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/estacion/5`, { waitUntil: "networkidle" });
  return { context, page };
}

const shot = (page, name) =>
  page.screenshot({ path: `${OUT}/${name}.png` });

const waitState = (page, state) =>
  page.waitForSelector(`[data-station5-state="${state}"]`, { timeout: 20000 });

const waitArea = (page, id, state) =>
  page.waitForSelector(
    `[data-station5-area="${id}"][data-area-state="${state}"]`,
    { timeout: 20000 },
  );

const tapArea = (page, id) => page.click(`[data-station5-area="${id}"]`);

// --- Recorrido principal en 390x844 ------------------------------------
{
  const { context, page } = await newPage({ width: 390, height: 844 });
  await waitState(page, "station5_plants_suggested");
  await page.waitForTimeout(700);
  await shot(page, "01_initial_plants_suggested_390x844");

  await tapArea(page, "plantas");
  await waitState(page, "station5_plantas_active");
  await page.waitForTimeout(900);
  await shot(page, "02_plantas_active_390x844");

  await waitArea(page, "sistema", "suggested");
  await tapArea(page, "sistema");
  await waitState(page, "station5_sistema_active");
  await page.waitForTimeout(1000);
  await shot(page, "03_sistema_active_390x844");

  await waitArea(page, "espacio", "suggested");
  await tapArea(page, "espacio");
  await waitState(page, "station5_espacio_active");
  await page.waitForTimeout(1000);
  await shot(page, "04_espacio_active_390x844");

  await waitArea(page, "visitante", "suggested");
  await tapArea(page, "visitante");
  await waitState(page, "station5_visitante_active");
  await page.waitForTimeout(1000);
  await shot(page, "05_visitante_active_three_completed_partial_nexus_390x844");

  await waitState(page, "station5_map_integrated");
  await page.waitForTimeout(600);
  await shot(page, "06_map_integrated_390x844");

  await waitState(page, "station5_ready_to_close");
  await page.waitForTimeout(1000);
  await shot(page, "07_cta_ready_390x844");

  await tapArea(page, "espacio");
  await waitState(page, "station5_revisit_mode");
  await page.waitForTimeout(1000);
  await shot(page, "08_revisit_mode_espacio_390x844");

  await context.close();
}

// --- Estado inicial en 360x640 y 430x932 --------------------------------
for (const viewport of [
  { width: 360, height: 640 },
  { width: 430, height: 932 },
]) {
  const { context, page } = await newPage(viewport);
  await waitState(page, "station5_plants_suggested");
  await page.waitForTimeout(700);
  await shot(page, `09_initial_${viewport.width}x${viewport.height}`);
  await context.close();
}

// --- Reduced motion: inicial y mapa integrado ----------------------------
{
  const { context, page } = await newPage(
    { width: 390, height: 844 },
    "reduce",
  );
  await waitState(page, "station5_plants_suggested");
  await shot(page, "10_reduced_motion_initial_390x844");

  await tapArea(page, "plantas");
  await waitArea(page, "sistema", "suggested");
  await tapArea(page, "sistema");
  await waitArea(page, "espacio", "suggested");
  await tapArea(page, "espacio");
  await waitArea(page, "visitante", "suggested");
  await tapArea(page, "visitante");
  await waitState(page, "station5_ready_to_close");
  await shot(page, "11_reduced_motion_ready_390x844");
  await context.close();
}

await browser.close();
console.log("capturas listas en", OUT);
