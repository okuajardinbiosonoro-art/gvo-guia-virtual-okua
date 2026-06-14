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

  it("resuelve los slots temporales W2 W3, W3 W4 y Mundo III", () => {
    expect(resolveEditorialText("TRANS_W2_W3_TITLE_01").text).toBe(
      "TEMP — Abriendo Mundo III",
    );
    expect(resolveEditorialText("TRANS_W2_W3_SUB_01").text).toBe(
      "TEMP — Preparando el cuaderno de pruebas y ajustes.",
    );
    expect(resolveEditorialText("TRANS_W3_W4_TITLE_01").text).toBe(
      "TEMP — Salida preparada de Mundo III",
    );
    expect(resolveEditorialText("TRANS_W3_W4_SUB_01").text).toBe(
      "TEMP — El siguiente espacio queda como placeholder, no como Mundo IV real.",
    );
    expect(resolveEditorialText("W3_INTRO_LIA_01").text).toBe(
      "TEMP — Este cuaderno guarda pruebas, errores y ajustes del sistema.",
    );
    expect(resolveEditorialText("W3_INTRO_AMB_01").text).toBe(
      "TEMP — Nada aparece terminado desde el inicio: cada señal deja una pista.",
    );
    expect(resolveEditorialText("W3_ACCESSIBLE_SCENE_01").text).toBe(
      "TEMP — Entrada visual a Mundo III, presentado como un cuaderno de revisión y prototipos.",
    );
    expect(resolveEditorialText("W3_PROTOTIPO_NOTE_01").text).toBe(
      "TEMP — Un prototipo no demuestra perfección: permite probar.",
    );
    expect(resolveEditorialText("W3_COMPLETE_LIA_01").text).toBe(
      "TEMP — El cuaderno ya muestra cómo una prueba se transforma en ajuste.",
    );
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
