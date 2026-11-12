import { describe, expect, it } from "vitest";

import { EDITORIAL_DEFAULT_LOCALE } from "./editorialLocales";
import { editorialRegistry, type EditorialSlotId } from "./editorialRegistry";
import { resolveEditorialText } from "./resolveEditorialText";
import { finalEditorialSlots, FINAL_REQUIRED_SLOT_COUNT } from "../finalEditorialSlots";
import { ROOM_NAMES, ROOM_ROMANS } from "../roomNames";
import { transitionWorldConfigs } from "../../screens/TransitionWorld/transitionWorld.config";

describe("editorialRegistry", () => {
  it("resolves Spanish with explicit fallback and normalizes unsupported locales", () => {
    const base = resolveEditorialText("TRANS_W1_W2_TITLE_01");
    const english = resolveEditorialText("TRANS_W1_W2_TITLE_01", {locale: "en"});
    const unsupported = resolveEditorialText("TRANS_W1_W2_TITLE_01", {locale: "fr"});
    expect(base.locale).toBe(EDITORIAL_DEFAULT_LOCALE);
    expect(base.fallbackUsed).toBe(false);
    expect(english.requestedLocale).toBe("en");
    expect(english.fallbackUsed).toBe(true);
    expect(english.text).toBe(base.text);
    expect(unsupported.requestedLocale).toBe("es");
    expect(unsupported.fallbackUsed).toBe(false);
  });

  it("rejects unknown IDs instead of silently inventing a copy slot", () => {
    expect(() => resolveEditorialText("W2_SLOT_INEXISTENTE" as EditorialSlotId)).toThrow("Editorial slot not registered: W2_SLOT_INEXISTENTE");
  });

  it("keeps provenance distinct for historical, human-approved and candidate entries", () => {
    for (const [id, localized] of Object.entries(editorialRegistry)) {
      const slot = localized.es;
      expect(slot.slotId).toBe(id);
      expect(slot.locale).toBe("es");
      expect(slot.text.trim().length).toBeGreaterThan(0);
      if (slot.status === "FINAL") expect(slot.source).toBe("human_approved");
      if (slot.status === "TEMP") expect(slot.source).toBe("temporary");
      if (slot.status === "REVIEW") {
        expect(slot.source).not.toBe("human_approved");
        expect(slot.notes).toContain("revisión humana final");
      }
    }
    expect(resolveEditorialText("FINAL_TITLE_01").status).toBe("REVIEW");
    expect(resolveEditorialText("TRANS_W2_W3_TITLE_01").source).toBe("editorial_excel");
    expect(resolveEditorialText("TRANS_W5_FINAL_TITLE_01").status).toBe("FINAL");
  });

  it("uses canonical visible room names while preserving technical transition routes", () => {
    const configs = Object.values(transitionWorldConfigs);
    configs.slice(0, 5).forEach((config, index) => {
      const room = (index + 1) as 1 | 2 | 3 | 4 | 5;
      expect(config.title).toBe(`Abriendo Sala ${ROOM_ROMANS[room]} · ${ROOM_NAMES[room]}`);
      expect(config.toRoute).toBe(`/estacion/${room}`);
      expect(config.subtitle).toBe("Preparando tu recorrido");
    });
    expect(configs[5].toRoute).toBe("/final");
    expect(configs[5].title).toBe("Abriendo el Mirador");
  });

  it("keeps all final operational slots, coherent revisits, and only the requested public credit", () => {
    expect(Object.keys(finalEditorialSlots)).toHaveLength(FINAL_REQUIRED_SLOT_COUNT);
    expect(FINAL_REQUIRED_SLOT_COUNT).toBe(35);
    expect(finalEditorialSlots.FINAL_TITLE_01.text).toBe("OKÚA Jardín Biosonoro");
    for (const room of [1, 2, 3, 4, 5] as const) {
      const roman = ROOM_ROMANS[room];
      expect(resolveEditorialText(`FINAL_ACCESS_${roman}_LABEL_01` as EditorialSlotId).text).toBe(`${roman} — ${ROOM_NAMES[room]}`);
      expect(resolveEditorialText(`FINAL_ACCESSIBLE_ACCESS_${roman}_01` as EditorialSlotId).text).toBe(`Revisar Sala ${roman} · ${ROOM_NAMES[room]}`);
    }
    expect(finalEditorialSlots.FINAL_CREDITS_01.text).toBe("Desarrollado por Momotto S.A.S.");
    expect(finalEditorialSlots.FINAL_RESTART_ERROR_01.text).toContain("Tu progreso se conservó");
    expect(finalEditorialSlots.FINAL_RETURN_TO_MIRADOR_BTN_01.text).toBe("Volver al Mirador");
  });
});
