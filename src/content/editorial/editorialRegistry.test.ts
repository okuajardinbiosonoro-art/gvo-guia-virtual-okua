import { describe, expect, it } from "vitest";

import { EDITORIAL_DEFAULT_LOCALE } from "./editorialLocales";
import { editorialRegistry } from "./editorialRegistry";
import type { EditorialSlotId } from "./editorialRegistry";
import { resolveEditorialText } from "./resolveEditorialText";

describe("editorialRegistry", () => {
  it("resuelve textos temporales en es sin fallback", () => {
    const slot = resolveEditorialText("W2_INTRO_LIA_01");

    expect(slot.slotId).toBe("W2_INTRO_LIA_01");
    expect(slot.locale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.requestedLocale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.resolvedLocale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.fallbackUsed).toBe(false);
    expect(slot.status).toBe("TEMP");
    expect(slot.source).toBe("temporary");
    expect(slot.text).toBe("TEMP — Entremos al pulso invisible de la planta.");
  });

  it("hace fallback explicito de en a es cuando no existe texto ingles", () => {
    const slot = resolveEditorialText("W2_INTRO_LIA_01", { locale: "en" });

    expect(slot.requestedLocale).toBe("en");
    expect(slot.resolvedLocale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.locale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.fallbackUsed).toBe(true);
    expect(slot.text).toBe("TEMP — Entremos al pulso invisible de la planta.");
  });

  it("normaliza locales no soportados hacia es", () => {
    const slot = resolveEditorialText("TRANS_W1_W2_TITLE_01", {
      locale: "fr",
    });

    expect(slot.requestedLocale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.resolvedLocale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(slot.fallbackUsed).toBe(false);
    expect(slot.text).toBe("Abriendo Mundo II");
  });

  it("rechaza slots editoriales no registrados", () => {
    expect(() =>
      resolveEditorialText("W2_SLOT_INEXISTENTE" as EditorialSlotId),
    ).toThrow("Editorial slot not registered: W2_SLOT_INEXISTENTE");
  });

  it("preserva todos los slots actuales como temporales con fuente temporary", () => {
    for (const localizedEntries of Object.values(editorialRegistry)) {
      const esEntry = localizedEntries.es;

      expect(esEntry).toBeDefined();
      expect(esEntry?.locale).toBe(EDITORIAL_DEFAULT_LOCALE);
      expect(esEntry?.source).toBe("temporary");
      expect(esEntry?.status).toBe("TEMP");
    }
  });
});
