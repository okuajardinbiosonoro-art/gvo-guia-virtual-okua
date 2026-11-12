import { expect, test, type Page } from "@playwright/test";

// Independent expected content, including the four active writer paragraph
// bindings. No runtime reducer/writer/DEV hook is imported by this test.
const steps = [
  {
    id: "planta",
    title: "Planta",
    text: "Todo inicia en la planta viva; ella entrega una señal que puede ser mediada, convertida en sonido musical o impulso lumínico.",
    sourceId: "TXT_4_3f6d20215ee7",
  },
  {
    id: "bionosificador",
    title: "Bionosificador",
    text: "Capta y prepara la señal de la planta para que el sistema pueda leerla con estabilidad.",
    sourceId: null,
  },
  {
    id: "esp32",
    title: "ESP32",
    text: "Interpreta la señal acondicionada y prepara eventos digitales.",
    sourceId: null,
  },
  {
    id: "midi",
    title: "MIDI",
    text: "Organiza la información como eventos. Es una forma de traducción donde se da voz a la planta.",
    sourceId: "TXT_4_a3d9fd46bf00",
  },
  {
    id: "wifi_udp",
    title: "Wi-Fi/UDP",
    text: "Transporta los eventos dentro de la red local, sin depender de internet.",
    sourceId: null,
  },
  {
    id: "router",
    title: "Router",
    text: "Organiza la comunicación local para que los datos lleguen al sistema central.",
    sourceId: null,
  },
  {
    id: "sistema_central",
    title: "Sistema central",
    text: "Recibe, organiza y reinterpreta los eventos, bajo la dirección artística de Momotto, para conseguir una experiencia placentera y relajante.",
    sourceId: "TXT_4_cafef2a7ae18",
  },
  {
    id: "sonido",
    title: "Sonido",
    text: "Aparece al final de la cadena, y es el resultado de la mediación entre la señal viva de la planta y el diseño sonoro perceptible por nuestros oídos.",
    sourceId: "TXT_4_ef71a332fb80",
  },
] as const;
const canonicalOrder = steps.map((step) => step.id);

async function installPriorRoomAccessFixture(page: Page) {
  await page.addInitScript(() => {
    // SYNTHETIC ACCESS FIXTURE ONLY: same stored shapes as the OBS03 matrix.
    // Cover/I/II/III are fabricated closed prerequisites, never earned here.
    // IV ordering and V answers are NOT seeded. All IV actions below are real UI.
    const order = {
      cover: ["saludo", "cinco_salas_y_proposito", "orden_y_revisita", "raiz"],
      1: ["intro", "relacion", "percepcion", "mediacion"],
      2: ["planta", "senal", "captura", "acondicionamiento", "mapeo", "musica"],
      3: ["INTRO", "PASO A PASO", "BENEFICIOS"],
      4: ["introduccion_mesa", "presentacion_8", "orden_resuelto", "cierre"],
      5: ["plantas", "sistema", "espacio", "visitante", "resultado"],
    };
    const room = (id: keyof typeof order, closed: boolean) => ({
      contentRevision: "OBS03.2",
      presentedStepIds: closed ? order[id] : [],
      confirmedStepIds: closed ? order[id] : [],
      assistedPresentedStepIds: [],
      activeStepId: closed ? null : order[id][0],
      interactionEvidence: [],
      outcome: null,
      closed,
    });
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("gvo.language.v1", "es");
    localStorage.setItem(
      "gvo.progress.v1",
      JSON.stringify({
        schemaVersion: 1,
        completedStations: [1, 2, 3],
        updatedAt: "2026-10-23T12:00:00.000Z",
      }),
    );
    localStorage.setItem(
      "gvo.journey.essential.v1",
      JSON.stringify({
        schemaVersion: 1,
        contractRevision: "OBS03.2",
        revision: 0,
        cover: room("cover", true),
        stations: {
          1: room(1, true),
          2: room(2, true),
          3: room(3, true),
          4: room(4, false),
          5: room(5, false),
        },
        legacyRouteCredit: 3,
        migrationEvidence: {
          source: "captured_before_mount",
          globalStatus: "ok",
        },
        pendingTransition: null,
        finalReached: false,
      }),
    );
  });
}

async function snapshot(page: Page) {
  return page.evaluate(() => ({
    essential: JSON.parse(
      localStorage.getItem("gvo.journey.essential.v1") ?? "null",
    ),
    ordering: JSON.parse(
      localStorage.getItem("gvo.station4.ordering.v1") ?? "null",
    ),
    progress: JSON.parse(localStorage.getItem("gvo.progress.v1") ?? "null"),
    progressRaw: localStorage.getItem("gvo.progress.v1"),
    quiz: JSON.parse(localStorage.getItem("gvo.station5.quiz.v1") ?? "null"),
    quizRaw: localStorage.getItem("gvo.station5.quiz.v1"),
    legacyPracticeRaw: localStorage.getItem("gvo.station3.practice.v2"),
  }));
}

test("OBS03 IV manual success · real swaps, writer review8 and verified close from declared prior-access fixture", async ({
  page,
}, info) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await installPriorRoomAccessFixture(page);
  const swaps: Array<{
    position: number;
    before: string[];
    after: string[];
    selectedId: string;
    selectedFocused: boolean;
  }> = [];
  const reviewed: Array<{
    id: string;
    title: string;
    text: string;
    sourceId: string | null;
  }> = [];
  let phase = "preparation";
  let solvedBeforeReview: Awaited<ReturnType<typeof snapshot>> | null = null;
  let baseline: Awaited<ReturnType<typeof snapshot>> | null = null;
  try {
    await page.goto("/estacion/4");
    const room = page.locator(
      '.gvo-prepared-tree[data-journey-active="true"] main.s4-ordering',
    );
    await expect(room).toBeVisible({ timeout: 25_000 });
    await expect(room).toHaveAttribute(
      "data-station4-ordering-phase",
      "introduction",
    );
    const objects = room.locator("[data-ordering-object]");
    const domOrder = () =>
      objects.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-ordering-object")!),
      );
    await expect(objects).toHaveCount(8);
    const start = room.getByRole("button", { name: "Comenzar", exact: true });
    await expect(start).toBeEnabled();
    await expect(
      page.locator('[data-interstation-qr-action="open"]'),
    ).toHaveCount(0);
    baseline = await snapshot(page);
    expect(baseline.ordering).toBeNull();
    expect(baseline.quizRaw).toBeNull();
    expect(baseline.progress.completedStations).toEqual([1, 2, 3]);
    await page.screenshot({
      path: info.outputPath("IV-manual-00-introduction.png"),
    });

    await start.focus();
    await start.click();
    phase = "playing";
    await expect(room).toHaveAttribute(
      "data-station4-ordering-phase",
      "playing",
    );
    await expect(objects.first()).toBeFocused();
    const shuffled = await domOrder();
    expect([...shuffled].sort()).toEqual([...canonicalOrder].sort());
    expect(shuffled).not.toEqual(canonicalOrder);

    // Solve only from current DOM positions through two native clicks per swap.
    // No storage writes, permutation injection, clock change or forced click.
    for (let index = 0; index < canonicalOrder.length; index += 1) {
      const before = await domOrder();
      const wanted = canonicalOrder[index];
      if (before[index] === wanted) continue;
      const sourceIndex = before.indexOf(wanted);
      expect(sourceIndex).toBeGreaterThan(index);
      const expected = [...before];
      [expected[index], expected[sourceIndex]] = [
        expected[sourceIndex],
        expected[index],
      ];
      const wantedPiece = room.locator(`[data-ordering-object="${wanted}"]`);
      await wantedPiece.click();
      await expect(wantedPiece).toHaveAttribute("aria-pressed", "true");
      const selectedFocused = await wantedPiece.evaluate(
        (node) => document.activeElement === node,
      );
      expect(selectedFocused).toBe(true);
      expect((await snapshot(page)).ordering.selectedObjectId).toBe(wanted);
      await room.locator(`[data-ordering-object="${before[index]}"]`).click();
      await expect.poll(domOrder).toEqual(expected);
      swaps.push({
        position: index + 1,
        before,
        after: await domOrder(),
        selectedId: wanted,
        selectedFocused,
      });
      await expect(
        page.locator('[data-interstation-qr-action="open"]'),
      ).toHaveCount(0);
    }

    phase = "solved_before_optional_review";
    await expect(room).toHaveAttribute(
      "data-station4-ordering-phase",
      "success",
    );
    await expect(room).toHaveAttribute(
      "data-station4-outcome",
      "solved_by_visitor",
    );
    await expect(
      room.getByText(steps[7].text, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      room.getByRole("button", { name: "Cerrar", exact: true }),
    ).toBeEnabled();
    await expect(
      page.locator('[data-interstation-qr-action="open"]'),
    ).toHaveCount(0);
    solvedBeforeReview = await snapshot(page);
    expect(solvedBeforeReview.ordering.permutation).toEqual(canonicalOrder);
    expect(solvedBeforeReview.ordering.outcome).toBe("solved_by_visitor");
    expect(solvedBeforeReview.ordering.remainingActiveMs).toBeGreaterThan(0);
    expect(solvedBeforeReview.ordering.closed).toBe(false);
    expect(solvedBeforeReview.essential.stations[4].closed).toBe(false);
    expect(solvedBeforeReview.progressRaw).toBe(baseline.progressRaw);
    expect(solvedBeforeReview.quizRaw).toBeNull();
    await page.screenshot({
      path: info.outputPath("IV-manual-01-solved-before-review.png"),
    });

    // The direct Close was available. Choose the existing optional review to
    // verify all eight displayed paragraphs without reclassifying this as help.
    await room
      .getByRole("button", { name: "Repasar los ocho pasos", exact: true })
      .click();
    await expect(room).toHaveAttribute(
      "data-station4-ordering-phase",
      "review",
    );
    for (const [index, step] of steps.entries()) {
      phase = `manual_review_${index + 1}`;
      await expect(
        room.getByText(`Repaso ${index + 1}/8`, { exact: true }),
      ).toBeVisible();
      const title = room.locator(".s4-ordering-description h2");
      await expect(title).toHaveText(step.title);
      await expect(title).toBeFocused();
      await expect(room.getByText(step.text, { exact: true })).toBeVisible();
      const state = await snapshot(page);
      expect(state.ordering.outcome).toBe("solved_by_visitor");
      expect(state.ordering.closed).toBe(false);
      expect(state.ordering.confirmedReviewSteps).toEqual(
        canonicalOrder.slice(0, index),
      );
      expect(state.progressRaw).toBe(baseline.progressRaw);
      expect(state.quizRaw).toBeNull();
      await expect(
        page.locator('[data-interstation-qr-action="open"]'),
      ).toHaveCount(0);
      reviewed.push({
        id: step.id,
        title: await title.innerText(),
        text: await room.getByText(step.text, { exact: true }).innerText(),
        sourceId: step.sourceId,
      });
      if (index < steps.length - 1)
        await room
          .getByRole("button", { name: "Siguiente", exact: true })
          .click();
    }
    await page.screenshot({
      path: info.outputPath("IV-manual-02-eighth-review-before-close.png"),
    });
    phase = "manual_close";
    await room.getByRole("button", { name: "Cerrar", exact: true }).click();
    await expect(room).toHaveAttribute("data-station4-ordering-closed", "true");
    const qr = page.locator('[data-interstation-qr-action="open"]');
    await expect(qr).toBeVisible();
    await expect(qr).toBeEnabled();
    const end = await snapshot(page);
    expect(end.ordering.outcome).toBe("solved_by_visitor");
    expect(end.ordering.closed).toBe(true);
    expect(end.ordering.confirmedReviewSteps).toEqual(canonicalOrder);
    expect(end.essential.stations[4]).toMatchObject({
      outcome: "solved",
      closed: true,
      assistedPresentedStepIds: [],
    });
    expect(end.progressRaw).toBe(baseline.progressRaw);
    expect(end.progress.completedStations).toEqual([1, 2, 3]);
    expect(end.quizRaw).toBeNull();
    expect(end.quiz?.correctAnswers ?? []).toEqual([]);
    expect(end.essential.stations[5].confirmedStepIds).toEqual([]);
    expect(end.legacyPracticeRaw).toBe(baseline.legacyPracticeRaw);
    expect(pageErrors).toEqual([]);
    expect(reviewed).toHaveLength(8);
    await expect(page).toHaveURL(/\/estacion\/4$/);
    await page.screenshot({
      path: info.outputPath("IV-manual-03-reviewed-close-QR.png"),
    });
    phase = "completed_manual_fixture_case";
  } finally {
    await info.attach("OBS03-IV-manual-success-evidence", {
      contentType: "application/json",
      body: JSON.stringify(
        {
          qualification:
            "Synthetic prior-access fixture only; this IV permutation is solved through real native UI swaps, then optional review8/manual close. No prior rooms earned here, no physical understanding/camera validation, no QR scan or global IV credit.",
          writerBindingQualification:
            "Expected writer source IDs are contract provenance; the visible DOM paragraphs are compared exactly, without claiming sourceId metadata is exposed in the DOM.",
          phase,
          baseline,
          swaps,
          reviewed,
          solvedBeforeReview,
          finalSnapshot: page.isClosed() ? null : await snapshot(page),
          pageErrors,
        },
        null,
        2,
      ),
    });
  }
});
