import { expect, test } from "@playwright/test";

const mobileViewports = [
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
];

test("muestra la carga inicial en la primera ruta del recorrido", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(
    page.getByRole("progressbar", {
      name: "Preparando el recorrido",
    }),
  ).toBeVisible();
  await expect(
    page.getByTestId("loading-initial-animated-scene"),
  ).toBeVisible();
  await expect(page.getByText("Portada / Intro")).toHaveCount(0);
  await expect(page.getByText("Estación I")).toHaveCount(0);
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});

test("muestra la carga inicial en /carga", async ({ page }) => {
  await page.goto("/carga");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Preparando el recorrido",
  );
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
});

test("muestra la portada y ejecuta diálogos/gating base en /portada", async ({
  page,
}) => {
  await page.goto("/portada");

  await expect(
    page.getByRole("heading", { name: "EL ARCHIVO VIVO DE OKÚA" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Estación I, Mundo Raíz, disponible. Inicia la introducción de Lía.",
    }),
  ).toBeVisible();
  await expect(page.locator('[data-lia-avatar-mode="rig-idle"]')).toBeVisible();
  await expect(page.locator('[data-lia-rig-layer="eyes-neutral"]')).toBeVisible();
  await expect(page.locator('[data-portal-state="locked"]')).toHaveCount(4);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);

  await page.getByRole("button", { name: "Comenzar recorrido" }).click();
  await expect(
    page.getByText(
      "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("Lía", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-lia-avatar-mode="rig-idle"]')).toBeVisible();
  await expect(page.locator('[data-lia-expression="happy"]')).toBeVisible();
  await expect(page.locator('[data-lia-rig-layer="eyes-happy"]')).toBeVisible();
  await expect(page.getByText("Paso 1 de 5")).toBeVisible();
  await expect(page.getByText("1/5")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(1);

  await page.getByRole("button", { name: "Siguiente diálogo de Lía" }).click();
  await expect(
    page.getByText(
      "Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Paso 2 de 5")).toBeVisible();
  await expect(page.locator('[data-lia-expression="attentive"]')).toBeVisible();
  await expect(
    page.locator('[data-lia-rig-layer="eyes-attentive"]'),
  ).toBeVisible();
  await expect(page.getByText("2/5")).toHaveCount(0);
  await page.getByRole("button", { name: "Siguiente diálogo de Lía" }).click();
  await expect(
    page.getByText(
      "Lo que vas a recorrer es una mediación: una señal viva, una captura técnica y una interpretación.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Siguiente diálogo de Lía" }).click();
  await expect(
    page.getByText(
      "Primero seguiremos el orden de los mundos. Al final podrás volver libremente a cualquier estación.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Siguiente diálogo de Lía" }).click();
  await expect(
    page.getByText("Empecemos por la raíz: el origen y el propósito de OKÚA."),
  ).toBeVisible();
  await expect(page.locator('[data-lia-avatar-mode="pose"]')).toBeVisible();
  await expect(page.locator('[data-lia-pose="pointPortal1"]')).toBeVisible();
  await page.getByRole("button", { name: "Finalizar introducción" }).click();

  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Estación II, bloqueada hasta completar Mundo I.",
    })
    .click({ force: true });
  await expect(
    page.getByText(
      "Primero debemos entrar por Raíz. Después llegaremos al pulso invisible.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
  await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
  await expect(page.getByText("Preparando recorrido...")).toBeVisible();
  await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
    timeout: 5000,
  });
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("a")).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);

  await expect(page).toHaveURL(/\/estacion\/1$/, { timeout: 5000 });
  await expect(page.getByText("Estación placeholder")).toBeVisible();
});

test("resetIntro en /portada fuerza primera pasada", async ({ page }) => {
  await page.goto("/portada");
  await page.evaluate(() => {
    window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
  });

  await page.goto("/portada?resetIntro=1");

  await expect(page).toHaveURL(/\/portada$/);
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toHaveCount(0);
});

test("resetIntro desde / reproduce carga y llega a portada fresca", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/portada");
  await page.evaluate(() => {
    window.localStorage.setItem("gvo.coverIntro.introCompleted.v1", "true");
  });

  await page.goto("/?resetIntro=1");

  await expect(
    page.getByRole("heading", { name: "Preparando el recorrido" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/portada$/, { timeout: 5000 });
  await expect(
    page.getByRole("button", { name: "Comenzar recorrido" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toHaveCount(0);
});

test("reduced motion conserva diálogos y gating en /portada", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/portada");

  await page.getByRole("button", { name: "Comenzar recorrido" }).click();
  await expect(
    page.getByText(
      "Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.",
    ),
  ).toBeVisible();
  await expect(page.getByText("Paso 1 de 5")).toBeVisible();

  for (let index = 0; index < 4; index += 1) {
    await page
      .getByRole("button", { name: "Siguiente diálogo de Lía" })
      .click();
  }

  await page.getByRole("button", { name: "Finalizar introducción" }).click();
  await expect(
    page.getByRole("button", { name: "Entrar a Mundo I" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Entrar a Mundo I" }).click();
  await expect(page.getByText("Abriendo Mundo I: Raíz...")).toBeVisible();
  await expect(page.getByText("Preparando recorrido...")).toBeVisible();
  await expect(page).toHaveURL(/\/transition\/intro-to-station-1$/, {
    timeout: 5000,
  });
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("a")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});

for (const viewport of mobileViewports) {
  test(`sin overflow horizontal en /carga ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/carga");

    await expect(
      page.getByRole("heading", { name: "Preparando el recorrido" }),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
}

test("reduced motion mantiene la pantalla de carga sin elementos fuera de alcance", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/carga");

  await expect(page.getByText("Preparando el recorrido")).toBeVisible();
  await expect(page.getByText("Cuidando el inicio...")).toBeVisible();
  await expect(page.locator("button")).toHaveCount(0);
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
});
