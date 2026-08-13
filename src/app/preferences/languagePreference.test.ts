import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyDocumentLanguage,
  GVO_LANGUAGE_STORAGE_KEY,
  isGvoLanguage,
  readLanguagePreference,
  writeLanguagePreference,
} from "./languagePreference";

describe("language preference", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.lang = "es";
  });

  it("acepta únicamente el contrato es/en", () => {
    expect(isGvoLanguage("es")).toBe(true);
    expect(isGvoLanguage("en")).toBe(true);
    expect(isGvoLanguage("ES")).toBe(false);
    expect(isGvoLanguage("fr")).toBe(false);
    expect(isGvoLanguage(null)).toBe(false);
  });

  it("persiste y aplica la preferencia sin tocar otras claves", () => {
    localStorage.setItem("gvo.progress.v1", "progress-sentinel");

    expect(writeLanguagePreference("en")).toBe(true);
    expect(readLanguagePreference()).toBe("en");
    expect(applyDocumentLanguage()).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem("gvo.progress.v1")).toBe("progress-sentinel");
  });

  it("falla seguro a es ante valor inválido o storage bloqueado", () => {
    localStorage.setItem(GVO_LANGUAGE_STORAGE_KEY, "unknown");
    expect(readLanguagePreference()).toBeNull();
    expect(applyDocumentLanguage()).toBe("es");

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readLanguagePreference()).toBeNull();
    expect(applyDocumentLanguage()).toBe("es");
  });

  it("devuelve false sin lanzar cuando no puede guardar", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    expect(writeLanguagePreference("es")).toBe(false);
  });
});
