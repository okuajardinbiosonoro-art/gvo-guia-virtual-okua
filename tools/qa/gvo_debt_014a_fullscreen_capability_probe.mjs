/* global URL, document, navigator, window */

import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const browserExecutables = {
  chrome: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  edge: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  opera: `${process.env.LOCALAPPDATA ?? ""}/Programs/Opera GX/opera.exe`,
};

const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, "").split("=");
    return [key, value.join("=") || "true"];
  }),
);

const browserName = args.browser ?? "chrome";
const executablePath = args.executable ?? browserExecutables[browserName];
const baseUrl = (args["base-url"] ?? "http://127.0.0.1:4173").replace(/\/$/, "");
const headed = args.headed !== "false";
const outputPath = args.output ? path.resolve(args.output) : null;

if (!executablePath) {
  throw new Error(`No executable configured for browser: ${browserName}`);
}

const browser = await chromium.launch({
  executablePath,
  headless: !headed,
  args: ["--disable-features=Translate"],
});

const context = await browser.newContext({ viewport: null });
const page = await context.newPage();
await page.addInitScript(() => {
  window.localStorage.setItem("gvo.language.v1", "es");
});
const consoleMessages = [];
let mainDocumentHeaders = null;

page.on("console", (message) => {
  consoleMessages.push({ type: message.type(), text: message.text() });
});

page.on("response", async (response) => {
  if (response.request().resourceType() !== "document") {
    return;
  }

  const url = new URL(response.url());
  if (url.pathname !== "/inicio") {
    return;
  }

  mainDocumentHeaders = {
    status: response.status(),
    url: response.url(),
    permissionsPolicy: response.headers()["permissions-policy"] ?? null,
  };
});

function capabilitySnapshot() {
  const documentWithPolicy = document;
  const frame = window.frameElement;

  return {
    href: window.location.href,
    protocol: window.location.protocol,
    topLevel: window.top === window.self,
    secureContext: window.isSecureContext,
    fullscreenEnabled: document.fullscreenEnabled,
    fullscreenElement: document.fullscreenElement
      ? document.fullscreenElement.tagName
      : null,
    requestFullscreenType: typeof document.documentElement.requestFullscreen,
    exitFullscreenType: typeof document.exitFullscreen,
    userActivation: navigator.userActivation
      ? {
          isActive: navigator.userActivation.isActive,
          hasBeenActive: navigator.userActivation.hasBeenActive,
        }
      : null,
    permissionsPolicyAllowsFullscreen:
      typeof documentWithPolicy.permissionsPolicy?.allowsFeature === "function"
        ? documentWithPolicy.permissionsPolicy.allowsFeature("fullscreen")
        : null,
    featurePolicyAllowsFullscreen:
      typeof documentWithPolicy.featurePolicy?.allowsFeature === "function"
        ? documentWithPolicy.featurePolicy.allowsFeature("fullscreen")
        : null,
    frameElement: frame
      ? {
          tag: frame.tagName,
          allow: frame.getAttribute("allow"),
          allowFullscreen: frame.hasAttribute("allowfullscreen"),
          embedderOrigin: document.referrer
            ? new URL(document.referrer).origin
            : null,
        }
      : null,
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    },
  };
}

async function readCapability() {
  return page.evaluate(capabilitySnapshot);
}

async function waitForFullscreen(expected, timeout = 6000) {
  try {
    await page.waitForFunction(
      (shouldBeActive) => Boolean(document.fullscreenElement) === shouldBeActive,
      expected,
      { timeout },
    );
    return true;
  } catch {
    return false;
  }
}

const result = {
  ticket: "GVO_DEBT_014A",
  campaign: "REAL_FULLSCREEN_BROWSER_QA",
  browser: browserName,
  executablePath,
  headed,
  browserVersion: browser.version(),
  monkeypatches: false,
  url: `${baseUrl}/inicio`,
  mainDocumentHeaders: null,
  beforeClick: null,
  duringClick: null,
  afterEnter: null,
  afterSpaNavigation: null,
  afterControlExit: null,
  afterReentry: null,
  afterEscape: null,
  automatedEscapeCertified: false,
  events: [],
  consoleMessages,
  pass: false,
};

try {
  await page.goto(`${baseUrl}/inicio`, { waitUntil: "domcontentloaded" });

  const enterButton = page.getByRole("button", {
    name: "Activar pantalla completa",
  });
  await enterButton.waitFor({ state: "visible" });

  result.beforeClick = {
    ...(await readCapability()),
    buttonDisabled: await enterButton.isDisabled(),
    buttonLabel: await enterButton.getAttribute("aria-label"),
  };

  await page.evaluate(() => {
    window.__gvoDebt014aProbe = { duringClick: null, events: [] };
    const button = document.querySelector(
      "[data-initial-fullscreen-action='request']",
    );

    button?.addEventListener(
      "click",
      () => {
        window.__gvoDebt014aProbe.duringClick = {
          isActive: navigator.userActivation?.isActive ?? null,
          hasBeenActive: navigator.userActivation?.hasBeenActive ?? null,
          fullscreenEnabled: document.fullscreenEnabled,
          fullscreenElement: document.fullscreenElement?.tagName ?? null,
        };
      },
      { capture: true, once: true },
    );

    document.addEventListener("fullscreenchange", () => {
      window.__gvoDebt014aProbe.events.push({
        type: "fullscreenchange",
        fullscreenElement: document.fullscreenElement?.tagName ?? null,
      });
    });
    document.addEventListener("fullscreenerror", () => {
      window.__gvoDebt014aProbe.events.push({
        type: "fullscreenerror",
        fullscreenElement: document.fullscreenElement?.tagName ?? null,
      });
    });
  });

  await enterButton.click();
  const entered = await waitForFullscreen(true);
  result.duringClick = await page.evaluate(
    () => window.__gvoDebt014aProbe.duringClick,
  );
  result.afterEnter = {
    ...(await readCapability()),
    entered,
    routeState: await page
      .locator("[data-initial-experience]")
      .getAttribute("data-initial-fullscreen-state"),
  };

  await page.getByRole("button", { name: "Iniciar recorrido" }).click();
  await page.waitForURL("**/portada");
  const globalControl = page.locator("[data-gvo-immersive-control='fullscreen']");
  await globalControl.waitFor({ state: "visible" });
  result.afterSpaNavigation = {
    ...(await readCapability()),
    controlCount: await globalControl.count(),
    controlDisabled: await globalControl.isDisabled(),
    controlLabel: await globalControl.getAttribute("aria-label"),
    controlState: await globalControl.getAttribute("data-gvo-immersive-state"),
  };

  await globalControl.click();
  const exitedByControl = await waitForFullscreen(false);
  result.afterControlExit = {
    ...(await readCapability()),
    exitedByControl,
    controlLabel: await globalControl.getAttribute("aria-label"),
    controlState: await globalControl.getAttribute("data-gvo-immersive-state"),
  };

  await globalControl.click();
  const reentered = await waitForFullscreen(true);
  result.afterReentry = {
    ...(await readCapability()),
    reentered,
    controlLabel: await globalControl.getAttribute("aria-label"),
    controlState: await globalControl.getAttribute("data-gvo-immersive-state"),
  };

  await page.keyboard.press("Escape");
  const exitedByEscape = await waitForFullscreen(false);
  result.afterEscape = {
    ...(await readCapability()),
    exitedByEscape,
    controlLabel: await globalControl.getAttribute("aria-label"),
    controlState: await globalControl.getAttribute("data-gvo-immersive-state"),
  };
  result.automatedEscapeCertified = exitedByEscape;

  result.events = await page.evaluate(
    () => window.__gvoDebt014aProbe.events,
  );
  result.mainDocumentHeaders = mainDocumentHeaders;
  result.pass = Boolean(
    result.beforeClick?.buttonDisabled === false &&
      result.beforeClick?.fullscreenEnabled === true &&
      result.beforeClick?.requestFullscreenType === "function" &&
      result.duringClick?.isActive === true &&
      result.afterEnter?.fullscreenElement &&
      result.afterSpaNavigation?.fullscreenElement &&
      result.afterControlExit?.fullscreenElement === null &&
      result.afterReentry?.fullscreenElement,
  );
} catch (error) {
  result.error = error instanceof Error ? error.stack : String(error);
  result.mainDocumentHeaders = mainDocumentHeaders;
} finally {
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, serialized, "utf8");
  }
  process.stdout.write(serialized);
  await browser.close();
}

if (!result.pass) {
  process.exitCode = 1;
}
