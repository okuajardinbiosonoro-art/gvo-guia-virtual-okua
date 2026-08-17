import { expect, test, type Page } from "@playwright/test";

type MobileContractMode =
  | "standard"
  | "webkit"
  | "missing"
  | "blocked"
  | "rejected";

async function installMobileContract(page: Page, mode: MobileContractMode) {
  await page.addInitScript((contractMode) => {
    const state = {
      fullscreenElement: null as Element | null,
      requests: 0,
      exits: 0,
      method: "none",
    };
    Object.defineProperty(window, "__gvoDebt014bContract", {
      configurable: true,
      value: state,
    });
    Object.defineProperty(Navigator.prototype, "userActivation", {
      configurable: true,
      get: () => ({ isActive: false, hasBeenActive: false }),
    });

    const enter = function enterFullscreen(this: Element) {
      state.requests += 1;
      if (contractMode === "rejected") {
        throw new DOMException("Denied by mobile contract", "NotAllowedError");
      }
      state.fullscreenElement = this;
      document.dispatchEvent(
        new Event(
          contractMode === "webkit"
            ? "webkitfullscreenchange"
            : "fullscreenchange",
        ),
      );
    };
    const leave = () => {
      state.exits += 1;
      state.fullscreenElement = null;
      document.dispatchEvent(
        new Event(
          contractMode === "webkit"
            ? "webkitfullscreenchange"
            : "fullscreenchange",
        ),
      );
    };

    Object.defineProperty(Document.prototype, "fullscreenElement", {
      configurable: true,
      get: () =>
        contractMode === "webkit" ? null : state.fullscreenElement,
    });
    Object.defineProperty(Document.prototype, "featurePolicy", {
      configurable: true,
      get: () => ({ allowsFeature: () => contractMode !== "blocked" }),
    });

    if (contractMode === "missing") {
      Object.defineProperty(Document.prototype, "fullscreenEnabled", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(Element.prototype, "requestFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Document.prototype, "exitFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Element.prototype, "webkitRequestFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Element.prototype, "webkitRequestFullScreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Document.prototype, "webkitExitFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Document.prototype, "webkitCancelFullScreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Document.prototype, "webkitFullscreenEnabled", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(Document.prototype, "webkitFullscreenElement", {
        configurable: true,
        get: () => null,
      });
      return;
    }

    if (contractMode === "webkit") {
      state.method = "webkit";
      Object.defineProperty(Document.prototype, "fullscreenEnabled", {
        configurable: true,
        get: () => false,
      });
      Object.defineProperty(Document.prototype, "webkitFullscreenEnabled", {
        configurable: true,
        get: () => true,
      });
      Object.defineProperty(Document.prototype, "webkitFullscreenElement", {
        configurable: true,
        get: () => state.fullscreenElement,
      });
      Object.defineProperty(Element.prototype, "requestFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Document.prototype, "exitFullscreen", {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(Element.prototype, "webkitRequestFullscreen", {
        configurable: true,
        value: enter,
      });
      Object.defineProperty(Document.prototype, "webkitExitFullscreen", {
        configurable: true,
        value: leave,
      });
      return;
    }

    state.method = "standard";
    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      configurable: true,
      get: () => contractMode !== "blocked",
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: enter,
    });
    Object.defineProperty(Document.prototype, "exitFullscreen", {
      configurable: true,
      value: leave,
    });
  }, mode);
}

test.describe("GVO_DEBT_014B MOBILE_CONTRACT_AUTOMATION — not real-device evidence", () => {
  test("LAN probe exposes the required no-DevTools diagnostic surface", async ({
    page,
  }) => {
    await page.goto("/qa/fullscreen/index.html");
    await expect(
      page.locator("[data-gvo-qa-probe='debt-014b-mobile-fullscreen']"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "PROBAR FULLSCREEN" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "SALIR FULLSCREEN" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "COPIAR DIAGNÓSTICO" }),
    ).toBeVisible();
    await expect(page.locator("#diagnostic")).toContainText(
      '"permissionsPolicyFullscreen"',
    );
    await expect(page.locator("#diagnostic")).toContainText(
      '"requestOutcome"',
    );
  });

  test("standard API: tap, SPA persistence and exit share one global authority", async ({
    page,
  }) => {
    await installMobileContract(page, "standard");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();

    const entryControl = page.getByRole("button", {
      name: "Activar pantalla completa",
    });
    await expect(entryControl).toBeEnabled();
    await entryControl.click();
    await expect(page.locator("[data-initial-experience]")).toHaveAttribute(
      "data-initial-fullscreen-state",
      "active",
    );

    await page.getByRole("button", { name: "Iniciar recorrido" }).click();
    await expect(page).toHaveURL(/\/portada$/);
    const globalControl = page.locator(
      "[data-gvo-immersive-control='fullscreen']",
    );
    await expect(globalControl).toHaveCount(1);
    await expect(globalControl).toHaveAttribute("aria-pressed", "true");
    await globalControl.click();
    await expect(globalControl).toHaveAttribute("aria-pressed", "false");
    await expect
      .poll(() => page.evaluate(() => window.__gvoDebt014bContract))
      .toMatchObject({ requests: 1, exits: 1, method: "standard" });
  });

  test("prefixed API is used only when feature detection exposes it", async ({
    page,
  }) => {
    await installMobileContract(page, "webkit");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();

    const control = page.getByRole("button", {
      name: "Activar pantalla completa",
    });
    await expect(control).toBeEnabled();
    await expect(control).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "supported",
    );
    await control.click();
    await expect(page.locator("[data-initial-experience]")).toHaveAttribute(
      "data-initial-fullscreen-state",
      "active",
    );
    await expect
      .poll(() => page.evaluate(() => window.__gvoDebt014bContract))
      .toMatchObject({ requests: 1, method: "webkit" });
  });

  test("platform without API gets honest fallback and zero global controls", async ({
    page,
  }) => {
    await installMobileContract(page, "missing");
    await page.goto("/inicio");
    await expect(
      page.locator("[data-initial-fullscreen-action='request']"),
    ).toHaveCount(0);
    await expect(
      page.locator("[data-initial-immersive-fallback='browser-optimized']"),
    ).toBeVisible();
    await expect(page.locator("[data-initial-experience]")).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "unavailable-on-platform",
    );

    await page.getByRole("button", { name: "Español" }).click();
    await expect(
      page.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Iniciar recorrido" }).click();
    await expect(
      page.locator("[data-gvo-immersive-control='fullscreen']"),
    ).toHaveCount(0);
    await expect(page.locator("[data-gvo-immersive-safe-area]")).toHaveCount(0);
  });

  test("blocked context remains distinct and diagnostic", async ({ page }) => {
    await installMobileContract(page, "blocked");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();
    const entryControl = page.getByRole("button", {
      name: "Activar pantalla completa",
    });
    await expect(entryControl).toBeDisabled();
    await expect(entryControl).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "blocked-by-context",
    );
    await expect(
      page.getByText(
        "Este contexto bloquea la pantalla completa. Abre GVO directamente en el navegador.",
      ),
    ).toBeVisible();
  });

  test("request rejection is non-blocking", async ({ page }) => {
    await installMobileContract(page, "rejected");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();
    await page
      .getByRole("button", { name: "Activar pantalla completa" })
      .click();
    await expect(page.locator("[data-initial-experience]")).toHaveAttribute(
      "data-initial-fullscreen-state",
      "error",
    );
    await expect(
      page.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
  });

  test("station routes contain exactly one shell control and no local duplicate", async ({
    page,
  }) => {
    await installMobileContract(page, "standard");
    await page.goto("/estacion/1");
    const controls = page.locator(
      "[data-gvo-immersive-control='fullscreen']",
    );
    await expect(controls).toHaveCount(1);
    await expect(
      page.locator("[data-gvo-immersive-safe-area]", { has: controls }),
    ).toHaveCount(1);
  });
});

declare global {
  interface Window {
    __gvoDebt014bContract: {
      fullscreenElement: Element | null;
      requests: number;
      exits: number;
      method: string;
    };
  }
}
