/** Test the actual built Workbox worker on an owned loopback static server. */
import assert from "node:assert/strict";
import http from "node:http";
import { URL } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const [rootArg, portArg, reportArg, mode = "on"] = process.argv.slice(2);
const root = path.resolve(rootArg); const port = Number(portArg);
assert(port >= 49152 && port <= 49215);
const origin = `http://127.0.0.1:${port}`;
let calls = 0;
const mime = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/lia-api/")) {
    calls++; req.resume();
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ count: calls })); return;
  }
  try {
    const pathname = decodeURIComponent((req.url || "/").split("?")[0]);
    let target = path.resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    if (!path.extname(target)) target = path.join(root, "index.html");
    const data = await readFile(target);
    res.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" }); res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
let browser; const result = { mode, passed: false, host: "127.0.0.1", port };
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
  await context.addInitScript(() => globalThis.localStorage.setItem("gvo.progress.v1", JSON.stringify({ completedStations: [1,2,3,4,5], schemaVersion: 1, updatedAt: "2026-09-11T00:00:00.000Z" })));
  const page = await context.newPage();
  await page.goto(origin + "/final");
  await page.locator("[data-final-root]").waitFor();
  if (mode === "off") {
    assert.equal(await page.locator("#lia-preview-entry").count(), 0);
    await page.goto(origin + "/final/lia");
    await page.waitForURL(origin + "/final");
    await page.locator("[data-final-root]").waitFor();
    assert.equal(await page.locator("[data-lia-preview]").count(), 0);
    assert.equal(await page.locator("[data-final-review-world]").count(), 5);
    result.flag_off_preserves_final = true;
  } else {
    await page.locator("#lia-preview-entry").click();
    await page.locator("[data-lia-preview]").waitFor();
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => { await globalThis.navigator.serviceWorker.register("/sw.js"); await globalThis.navigator.serviceWorker.ready; });
    await page.reload();
    await page.waitForFunction(() => !!globalThis.navigator.serviceWorker.controller);
    const counts = await page.evaluate(async () => {
      const values = [];
      for (const method of ["GET", "GET", "POST", "POST"]) {
        const response = await globalThis.fetch("/lia-api/healthz", { method, ...(method === "POST" ? { headers: { "Content-Type": "application/json" }, body: "{}" } : {}) });
        values.push((await response.json()).count);
      }
      const cached = [];
      for (const name of await globalThis.caches.keys()) for (const request of await (await globalThis.caches.open(name)).keys()) if (new URL(request.url).pathname.startsWith("/lia-api")) cached.push(request.url);
      return { values, cached };
    });
    assert.equal(new Set(counts.values).size,4); assert.deepEqual(counts.cached,[]);
    result.api_not_cached = true; result.network_responses = counts.values;
    await page.goto(origin + "/final"); await page.locator("[data-final-root]").waitFor();
    await page.waitForLoadState("networkidle"); await context.setOffline(true);
    await page.goto(origin + "/final"); await page.locator("[data-final-root]").waitFor();
    await page.locator("#lia-preview-entry").click(); await page.locator("[data-lia-preview]").waitFor();
    await page.locator("#lia-question").fill("¿Las plantas hacen música por sí solas?");
    await page.getByRole("button",{name:"Enviar pregunta"}).click();
    await page.locator('[data-lia-state="unavailable"]').waitFor();
    result.visited_offline_navigation = true; result.offline_api_unavailable = true;
  }
  result.passed = true;
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
  result.listener_closed = !server.listening;
  await writeFile(reportArg, JSON.stringify(result, null, 2));
}
assert(result.passed && result.listener_closed);
console.log(JSON.stringify(result));
