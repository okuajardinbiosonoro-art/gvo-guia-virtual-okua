import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

const authorityPath = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/exchanges/OBS03_MIRADOR_EN_TRANSLATION.json";
const authorityRaw = readFileSync(resolve(process.cwd(), authorityPath), "utf8");
const authority = JSON.parse(authorityRaw) as { translations: Record<string, { en: { text: string; status: string } }> };
const text = (id: string) => authority.translations[id].en.text;
const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");

/** Same declared complete shape as the final responsive fixture. It is not an
 * earned tour, visitor score or physical-device/reading/practice assertion.
 * This is the only setup that writes persisted facts. Subsequent navigation,
 * review entry/return and reset cancellation use ordinary visitor controls. */
async function installCompleteFixture(page: Page) {
  await page.addInitScript(() => {
    const order = { cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"], 1: ["intro", "relacion", "percepcion", "mediacion"], 2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"], 3: ["INTRO", "PASO A PASO", "BENEFICIOS"], 4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"], 5: ["plantas", "sistema", "espacio", "visitante", "resultado"] };
    const room = (id: keyof typeof order) => ({ contentRevision: "OBS03.2", presentedStepIds: [...order[id]], confirmedStepIds: [...order[id]], assistedPresentedStepIds: [], activeStepId: null, interactionEvidence: [], outcome: id === 4 ? "solved" : null, closed: true });
    const essential = { schemaVersion: 1, contractRevision: "OBS03.2", revision: 0, cover: room("cover"), stations: Object.fromEntries([1, 2, 3, 4, 5].map((id) => [id, room(id as 1 | 2 | 3 | 4 | 5)])), legacyRouteCredit: 5, migrationEvidence: { source: "captured_before_mount", globalStatus: "ok" }, pendingTransition: null, finalReached: true };
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem("gvo.language.v1", "en");
    localStorage.setItem("gvo.journey.essential.v1", JSON.stringify(essential));
    localStorage.setItem("gvo.progress.v1", JSON.stringify({ schemaVersion: 1, completedStations: [1, 2, 3, 4, 5], updatedAt: "2026-10-23T12:00:00.000Z" }));
    localStorage.setItem("gvo.station5.quiz.v1", JSON.stringify({ schemaVersion: 1, correctAnswers: ["plantas", "sistema", "espacio", "visitante"], answeredQuestions: ["plantas", "sistema", "espacio", "visitante"], skippedQuestions: [] }));
  });
}

async function earnedFacts(page: Page) {
  return page.evaluate(() => {
    const essential = JSON.parse(localStorage.getItem("gvo.journey.essential.v1") ?? "null");
    return { progressRaw: localStorage.getItem("gvo.progress.v1"), cover: essential?.cover, stations: essential?.stations, legacyRouteCredit: essential?.legacyRouteCredit, finalReached: essential?.finalReached, quizRaw: localStorage.getItem("gvo.station5.quiz.v1"), orderingRaw: localStorage.getItem("gvo.station4.ordering.v1"), practiceRaw: localStorage.getItem("gvo.station3.practice.v2"), language: localStorage.getItem("gvo.language.v1") };
  });
}

async function activeRoom(page: Page, selector: string) {
  const root = page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${selector}`);
  await expect(root).toBeVisible({ timeout: 25_000 });
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  await page.evaluate(async () => { await document.fonts.ready; await new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))); });
  await expect(root).toBeVisible();
  await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
  expect(await root.evaluate((node) => !node.closest('[inert],[aria-hidden="true"]'))).toBe(true);
  return root;
}

async function inspectResetDialog(dialog: Locator) {
  // Scroll only actual scrollable ancestors using native DOM behavior. Never
  // change overflow, dimensions or styles to force a clipped target reachable.
  const lines = await dialog.evaluate(async (scope) => {
    const records = [];
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = []; while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const element = node.parentElement!;
      element.scrollIntoView({ block: "nearest", inline: "nearest" });
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        let left = 0, top = 0, right = innerWidth, bottom = innerHeight;
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
          const s = getComputedStyle(parent), b = parent.getBoundingClientRect();
          if (s.overflowX !== "visible") { left = Math.max(left, b.left + parent.clientLeft); right = Math.min(right, b.left + parent.clientLeft + parent.clientWidth); }
          if (s.overflowY !== "visible") { top = Math.max(top, b.top + parent.clientTop); bottom = Math.min(bottom, b.top + parent.clientTop + parent.clientHeight); }
        }
        records.push({ text: node.textContent?.trim(), rect: r.toJSON(), clip: { left, top, right, bottom }, reachable: r.left >= left - 1 && r.right <= right + 1 && r.top >= top - 1 && r.bottom <= bottom + 1 });
      }
    }
    return records;
  });
  expect(lines.length).toBeGreaterThan(0);
  for (const line of lines) expect(line.reachable, `EN reset text: ${line.text}`).toBe(true);
  const controls = [];
  for (const control of await dialog.getByRole("button").all()) {
    await expect(control).toHaveAttribute("data-editorial-status", "REVIEW");
    await control.scrollIntoViewIfNeeded(); await control.focus();
    const result = await control.evaluate((node) => {
      const r = node.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { label: node.textContent?.trim(), rect: r.toJSON(), focused: document.activeElement === node, reachable: r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1, target44: r.width >= 44 && r.height >= 44, hit: Boolean(hit && (hit === node || node.contains(hit))) };
    });
    expect(result).toMatchObject({ focused: true, reachable: true, target44: true, hit: true });
    controls.push(result);
  }
  expect(controls).toHaveLength(2);
  return { lines, controls };
}

for (const viewport of [{ width: 390, height: 844 }, { width: 568, height: 280 }]) {
test(`OBS03 D16 Mirador EN ${viewport.width}×${viewport.height} · synthetic complete fixture, real review dock and cancelled reset`, async ({ page, baseURL }, info) => {
  test.setTimeout(120_000);
  await page.setViewportSize(viewport);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installCompleteFixture(page);
  const indexBody = await (await page.request.get("/")).body();
  expect(indexBody.toString("utf8")).not.toContain("/@vite/client");
  const indexBefore = digest(indexBody), phases: unknown[] = [], captures: unknown[] = [];
  const httpErrors: string[] = [], pageErrors: string[] = [], external: string[] = [];
  page.on("response", (response) => { if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => { const url = new URL(request.url()); if (/^https?:$/.test(url.protocol) && url.origin !== new URL(baseURL!).origin) external.push(request.url()); });
  const capture = async (name: string) => {
    await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
    const png = await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: false, scale: "css" });
    await expect(page.locator(".gvo-preparation-curtain")).toHaveCount(0);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([viewport.width, viewport.height]);
    captures.push({ name, configuredViewport: viewport, fullPage: false, imagePixels: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) }, pngSha256: digest(png), route: new URL(page.url()).pathname });
  };
  try {
    await page.goto("/final");
    let root = await activeRoom(page, "main.final-root-shell");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("group", { name: "Display controls", exact: true })).toBeVisible();
    await expect(root.locator("[data-final-editorial-locale]")).toHaveAttribute("data-final-editorial-locale", "en");
    await expect(root.getByRole("heading", { name: text("FINAL_TITLE_01"), exact: true })).toBeVisible();
    for (const id of ["FINAL_SUBTITLE_01", "FINAL_LIA_MESSAGE_01", "FINAL_AMB_01", "FINAL_HELP_01", "FINAL_CREDITS_01", "FINAL_BACK_HOME_HELP_01"]) {
      await expect(root.locator(`[data-final-slot-id="${id}"]`)).toHaveText(text(id));
      await expect(root.locator(`[data-final-slot-id="${id}"]`)).toHaveAttribute("data-editorial-status", "REVIEW");
    }
    await expect(root.getByLabel(text("FINAL_ACCESSIBLE_SCENE_01"), { exact: true })).toBeVisible();
    for (const roman of ["I", "II", "III", "IV", "V"]) {
      const link = root.getByRole("link", { name: text(`FINAL_ACCESSIBLE_ACCESS_${roman}_01`), exact: true });
      await expect(link).toBeVisible(); await expect(link).toHaveText(text(`FINAL_ACCESS_${roman}_LABEL_01`));
      await expect(link).toHaveAttribute("data-editorial-status", "REVIEW");
      await expect(root.locator(`[data-final-slot-id="FINAL_ACCESS_${roman}_CONFIRM_01"]`)).toHaveText(text(`FINAL_ACCESS_${roman}_CONFIRM_01`));
    }
    await expect(root.locator("[data-final-access-confirm-templates]")).toHaveAttribute("aria-hidden", "true");
    await expect(root.getByRole("button", { name: text("FINAL_ACCESSIBLE_BACK_HOME_01"), exact: true })).toHaveText(text("FINAL_BACK_HOME_BTN_01"));
    const restart = root.getByRole("button", { name: text("FINAL_ACCESSIBLE_RESTART_01"), exact: true });
    await expect(restart).toHaveText(text("FINAL_RESTART_BTN_01")); await expect(restart).toBeEnabled();
    await expect(page.locator("[data-final-review-return='active']")).toHaveCount(0);
    await expect(page.locator("[data-interstation-qr-action='open']")).toHaveCount(0);
    const before = await earnedFacts(page); phases.push({ phase: "initial_synthetic_complete_EN", facts: before });
    await capture("01-Mirador-EN-visible-and-accessible-copy");

    await restart.click();
    const dialog = root.locator('[data-final-reset-state="confirm"]');
    await expect(dialog).toBeVisible(); await expect(dialog).toHaveAccessibleName(text("FINAL_RESTART_CONFIRM_01"));
    await expect(dialog.locator('[data-final-slot-id="FINAL_RESTART_CONFIRM_01"]')).toHaveText(text("FINAL_RESTART_CONFIRM_01"));
    await expect(dialog.locator('[data-final-slot-id="FINAL_RESTART_CONFIRM_01"]')).toHaveAttribute("data-editorial-status", "REVIEW");
    const cancel = dialog.getByRole("button", { name: text("FINAL_RESTART_CANCEL_BTN_01"), exact: true });
    await expect(cancel).toBeFocused();
    await expect(dialog.getByRole("button", { name: text("FINAL_RESTART_CONFIRM_BTN_01"), exact: true })).toBeEnabled();
    const dialogGeometry = await inspectResetDialog(dialog);
    expect(await earnedFacts(page)).toEqual(before);
    await capture("02-Mirador-EN-reset-confirmation-not-confirmed");
    await cancel.click();
    await expect(dialog).toHaveCount(0); await expect(restart).toBeFocused();
    expect(await earnedFacts(page)).toEqual(before);
    phases.push({ phase: "EN_confirmation_cancelled_focus_recovered", facts: await earnedFacts(page), dialogGeometry });

    await root.getByRole("link", { name: text("FINAL_ACCESSIBLE_ACCESS_I_01"), exact: true }).click();
    await expect(page).toHaveURL(/\/estacion\/1$/);
    await activeRoom(page, "main.world1-root-screen");
    const dock = page.getByRole("button", { name: text("FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01"), exact: true });
    await expect(dock).toBeVisible(); await expect(dock).toHaveText(text("FINAL_RETURN_TO_MIRADOR_BTN_01"));
    await expect(dock).toHaveAttribute("data-editorial-status", "REVIEW");
    await expect(page.locator('[data-final-review-active="true"]')).toBeVisible();
    expect(await earnedFacts(page)).toEqual(before);
    await capture("03-Room-I-authorized-review-English-dock");
    phases.push({ phase: "real_Root_review_link_EN_dock", facts: await earnedFacts(page) });
    await dock.click();
    await expect(page).toHaveURL(/\/final$/);
    root = await activeRoom(page, "main.final-root-shell");
    await expect(root.locator('[data-final-slot-id="FINAL_CREDITS_01"]')).toHaveText(text("FINAL_CREDITS_01"));
    await expect(root.getByRole("link", { name: text("FINAL_ACCESSIBLE_ACCESS_I_01"), exact: true })).toBeVisible();
    await expect(page.locator("[data-final-review-return='active']")).toHaveCount(0);
    expect(await earnedFacts(page)).toEqual(before);
    await capture("04-Mirador-EN-return-facts-unchanged");
    phases.push({ phase: "returned_Mirador_no_new_facts_or_bits", facts: await earnedFacts(page) });
    expect(httpErrors).toEqual([]); expect(pageErrors).toEqual([]); expect(external).toEqual([]);
  } finally {
    const indexAfter = digest(await (await page.request.get("/")).body());
    await info.attach("OBS03-Mirador-EN-fixture-review-cancel-evidence", { body: JSON.stringify({ qualification: "Synthetic complete persisted fixture identical in shape to the final responsive fixture; ordinary UI review link/dock/return and reset cancellation afterwards. No earned tour/visitor points, DEV flag, runtime API invocation, post-initial fact seed, reset confirmation, physical device or reading/practice validation claimed.", authority: { path: authorityPath, sha256: digest(authorityRaw), status: "REVIEW", writerLiteral: false }, viewport, indexBefore, indexAfter, captures, phases, finalFacts: await earnedFacts(page), httpErrors, pageErrors, external }, null, 2), contentType: "application/json" });
    expect(indexAfter).toBe(indexBefore);
  }
});
}
