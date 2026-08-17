import { expect, test, type Page } from "@playwright/test";

type ContractMode = "supported" | "blocked" | "missing" | "rejected";

async function installContractEnvironment(page: Page, mode: ContractMode) {
  await page.addInitScript((contractMode) => {
    const state = {
      fullscreenElement: null as Element | null,
      requests: 0,
      exits: 0,
    };
    Object.defineProperty(window, "__gvoDebt014aContract", {
      configurable: true,
      value: state,
    });

    Object.defineProperty(Navigator.prototype, "userActivation", {
      configurable: true,
      get: () => ({ isActive: false, hasBeenActive: false }),
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
      return;
    }

    Object.defineProperty(Document.prototype, "fullscreenEnabled", {
      configurable: true,
      get: () => contractMode !== "blocked",
    });
    Object.defineProperty(Document.prototype, "fullscreenElement", {
      configurable: true,
      get: () => state.fullscreenElement,
    });
    Object.defineProperty(Document.prototype, "featurePolicy", {
      configurable: true,
      get: () => ({ allowsFeature: () => contractMode !== "blocked" }),
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: async function requestFullscreen() {
        state.requests += 1;
        if (contractMode === "rejected") {
          throw new DOMException("Denied by contract", "NotAllowedError");
        }
        state.fullscreenElement = this;
        document.dispatchEvent(new Event("fullscreenchange"));
      },
    });
    Object.defineProperty(Document.prototype, "exitFullscreen", {
      configurable: true,
      value: async () => {
        state.exits += 1;
        state.fullscreenElement = null;
        document.dispatchEvent(new Event("fullscreenchange"));
      },
    });
  }, mode);
}

test.describe("GVO_DEBT_014A CONTRACT_TESTS", () => {
  test("API disponible y userActivation false mantiene /inicio habilitado antes del click", async ({
    page,
  }) => {
    await installContractEnvironment(page, "supported");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();

    const button = page.getByRole("button", {
      name: "Activar pantalla completa",
    });
    await expect(button).toBeEnabled();
    await expect(page.locator("[data-initial-experience]" )).toHaveAttribute(
      "data-initial-fullscreen-state",
      "inactive",
    );

    await button.click();
    await expect(page.locator("[data-initial-experience]" )).toHaveAttribute(
      "data-initial-fullscreen-state",
      "active",
    );
    await expect
      .poll(() =>
        page.evaluate(() => window.__gvoDebt014aContract.requests),
      )
      .toBe(1);
  });

  test("API ausente no deja un control global muerto", async ({ page }) => {
    await installContractEnvironment(page, "missing");
    await page.goto("/portada");
    const missing = page.locator("[data-gvo-immersive-control='fullscreen']");
    await expect(missing).toHaveCount(0);
    await expect(page.locator("[data-gvo-immersive-safe-area]")).toHaveCount(0);

    await page.close();
  });

  test("policy bloqueada declara BLOCKED_BY_CONTEXT", async ({ browser }) => {
    const page = await browser.newPage();
    await installContractEnvironment(page, "blocked");
    await page.goto("/portada");
    const blocked = page.locator("[data-gvo-immersive-control='fullscreen']");
    await expect(blocked).toBeDisabled();
    await expect(blocked).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "blocked-by-context",
    );
    await expect(blocked).toHaveAttribute("data-gvo-immersive-state", "blocked");
    await page.close();
  });

  test("rechazo produce error sin bloquear Iniciar recorrido", async ({ page }) => {
    await installContractEnvironment(page, "rejected");
    await page.goto("/inicio");
    await page.getByRole("button", { name: "Español" }).click();
    await page
      .getByRole("button", { name: "Activar pantalla completa" })
      .click();

    await expect(page.locator("[data-initial-experience]" )).toHaveAttribute(
      "data-initial-fullscreen-state",
      "error",
    );
    await expect(
      page.getByRole("button", { name: "Iniciar recorrido" }),
    ).toBeEnabled();
  });

  test("/inicio y shell global comparten la misma capability authority", async ({
    page,
  }) => {
    await installContractEnvironment(page, "supported");
    await page.goto("/inicio");
    await expect(
      page.locator("[data-initial-fullscreen-action='request']"),
    ).toBeEnabled();

    await page.goto("/portada");
    const globalControl = page.locator(
      "[data-gvo-immersive-control='fullscreen']",
    );
    await expect(globalControl).toHaveCount(1);
    await expect(globalControl).toBeEnabled();
    await expect(globalControl).toHaveAttribute(
      "data-gvo-fullscreen-capability",
      "supported",
    );
  });
});

declare global {
  interface Window {
    __gvoDebt014aContract: {
      fullscreenElement: Element | null;
      requests: number;
      exits: number;
    };
  }
}
