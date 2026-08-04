import { describe, expect, it } from "vitest";

import { EDITORIAL_DEFAULT_LOCALE } from "./editorialLocales";
import { editorialRegistry } from "./editorialRegistry";
import type { EditorialSlotId } from "./editorialRegistry";
import { resolveEditorialText } from "./resolveEditorialText";
import {
  WORLD1_REQUIRED_SLOT_COUNT,
  world1EditorialSlots,
} from "../world1EditorialSlots";
import { finalEditorialSlots } from "../finalEditorialSlots";

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

  it("resuelve el copy final de todas las transiciones y conserva los gaps de estaciones", () => {
    expect(resolveEditorialText("TRANS_COVER_W1_TITLE_01").text).toBe(
      "Abriendo Mundo I",
    );
    expect(resolveEditorialText("TRANS_COVER_W1_SUB_01").text).toBe(
      "Preparando la raíz.",
    );
    expect(resolveEditorialText("TRANS_W1_W2_TITLE_01").text).toBe(
      "Abriendo Mundo II",
    );
    expect(resolveEditorialText("TRANS_W1_W2_SUB_01").text).toBe(
      "Preparando el pulso invisible.",
    );
    expect(resolveEditorialText("TRANS_W2_W3_TITLE_01").text).toBe(
      "Abriendo Mundo III",
    );
    expect(resolveEditorialText("TRANS_W2_W3_SUB_01").text).toBe(
      "Preparando el cuaderno de pruebas.",
    );
    expect(resolveEditorialText("TRANS_W2_W3_TITLE_01").status).toBe("FINAL");
    expect(resolveEditorialText("TRANS_W2_W3_SUB_01").source).toBe(
      "human_approved",
    );
    expect(resolveEditorialText("TRANS_W3_W4_TITLE_01").text).toBe(
      "Abriendo Mundo IV",
    );
    expect(resolveEditorialText("TRANS_W3_W4_SUB_01").text).toBe(
      "Preparando la mesa de sistema.",
    );
    expect(resolveEditorialText("TRANS_W4_W5_TITLE_01").text).toBe(
      "Abriendo Mundo V",
    );
    expect(resolveEditorialText("TRANS_W4_W5_SUB_01").text).toBe(
      "Preparando el mapa del presente.",
    );
    expect(resolveEditorialText("TRANS_W5_FINAL_TITLE_01").text).toBe(
      "Abriendo el Mirador",
    );
    expect(resolveEditorialText("TRANS_W5_FINAL_SUB_01").text).toBe(
      "Preparando el cierre del recorrido.",
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
    expect(resolveEditorialText("W4_INTRO_LIA_01").text).toBe(
      "TEMP — Esta mesa muestra cómo la señal recorre el sistema completo.",
    );
    expect(resolveEditorialText("W4_INTRO_SYS_01").text).toBe(
      "TEMP — La cadena ordena ocho pasos: PLANTA, BIONOSIFICADOR, ESP32, MIDI, WI-FI/UDP, ROUTER, SISTEMA CENTRAL y SONIDO.",
    );
    expect(resolveEditorialText("W4_ACCESSIBLE_SCENE_01").text).toBe(
      "TEMP — Entrada visual a Mundo IV, presentada como una mesa técnica con ocho nodos ordenados.",
    );
    expect(resolveEditorialText("W4_BIONOSIFICADOR_CARD_01").text).toBe(
      "TEMP — El BIONOSIFICADOR prepara la señal para que el sistema pueda interpretarla.",
    );
    expect(resolveEditorialText("W4_WIFI_UDP_CONFIRM_01").text).toBe(
      "TEMP — Nodo WI-FI/UDP registrado.",
    );
    expect(resolveEditorialText("W4_SONIDO_CARD_01").text).toBe(
      "TEMP — El SONIDO es el resultado mediado de la cadena, no una voz directa de la planta.",
    );
    expect(resolveEditorialText("W4_CONTINUE_BTN_01").text).toBe("Continuar");
    expect(resolveEditorialText("W5_INTRO_LIA_01").text).toBe(
      "TEMP — Este mapa reúne lo que ya viste: plantas, sistema, espacio y visitante.",
    );
    expect(resolveEditorialText("W5_INTRO_AMB_01").text).toBe(
      "TEMP — OKÚA aparece como un montaje vivo, no como una sola pieza aislada.",
    );
    expect(resolveEditorialText("W5_ACCESSIBLE_SCENE_01").text).toBe(
      "TEMP — Entrada visual a Mundo V, presentada como un mapa del presente con cuatro áreas: plantas, sistema, espacio y visitante.",
    );
    expect(resolveEditorialText("W5_PLANTAS_HINT_01").text).toBe(
      "TEMP — Comienza por las plantas como presencia viva del recorrido.",
    );
    expect(resolveEditorialText("W5_SISTEMA_HINT_01").text).toBe(
      "TEMP — Revisa el sistema como mediación, sin repetir toda la cadena técnica.",
    );
    expect(resolveEditorialText("W5_ESPACIO_CONFIRM_01").text).toBe(
      "TEMP — Área ESPACIO registrada.",
    );
    expect(resolveEditorialText("W5_VISITANTE_AMB_01").text).toBe(
      "TEMP — La experiencia termina de tomar forma cuando alguien la recorre, mira y escucha.",
    );
    expect(resolveEditorialText("W5_COMPLETE_LIA_01").text).toBe(
      "TEMP — El mapa ya muestra cómo OKÚA reúne plantas, sistema, espacio y visitante.",
    );
    expect(resolveEditorialText("W5_FINAL_BTN_01").text).toBe("Continuar");
    const expectedFinalCopy = {
      FINAL_TITLE_01: "Mirador final del jardín",
      FINAL_SUBTITLE_01: "Recorrido completo",
      FINAL_LIA_MESSAGE_01:
        "Llegaste al final del recorrido. Puedes volver a cualquier mundo cuando quieras.",
      FINAL_AMB_01: "El jardín queda abierto para volver a mirarlo.",
      FINAL_ACCESS_I_LABEL_01: "I — Raíz",
      FINAL_ACCESS_I_CONFIRM_01: "Reabriendo Mundo I: Raíz…",
      FINAL_ACCESS_II_LABEL_01: "II — Pulso invisible",
      FINAL_ACCESS_II_CONFIRM_01: "Reabriendo Mundo II: Pulso invisible…",
      FINAL_ACCESS_III_LABEL_01: "III — Cuaderno de pruebas",
      FINAL_ACCESS_III_CONFIRM_01: "Reabriendo Mundo III: Cuaderno de pruebas…",
      FINAL_ACCESS_IV_LABEL_01: "IV — Mesa de sistema",
      FINAL_ACCESS_IV_CONFIRM_01: "Reabriendo Mundo IV: Mesa de sistema…",
      FINAL_ACCESS_V_LABEL_01: "V — Mapa del presente",
      FINAL_ACCESS_V_CONFIRM_01: "Reabriendo Mundo V: Mapa del presente…",
      FINAL_HELP_01: "Elige un mundo para revisarlo libremente.",
      FINAL_BACK_HOME_BTN_01: "Volver al inicio",
      FINAL_BACK_HOME_HELP_01: "Regresa a la portada sin borrar tu recorrido.",
      FINAL_RESTART_BTN_01: "Reiniciar recorrido",
      FINAL_RESTART_CONFIRM_01:
        "¿Quieres reiniciar el recorrido completo? Volverás a comenzar desde el inicio.",
      FINAL_RESTART_CANCEL_BTN_01: "Cancelar",
      FINAL_RESTART_CONFIRM_BTN_01: "Reiniciar recorrido",
      FINAL_CREDITS_01:
        "Desarrollado por Momotto S.A.S.\nA cargo del Ing. José David Pérez Zapata.",
      FINAL_ACCESSIBLE_SCENE_01:
        "Mirador final del jardín con cinco accesos de revisión, Lía, regreso a la portada y reinicio del recorrido.",
      FINAL_ACCESSIBLE_ACCESS_I_01: "Revisar Mundo I: Raíz",
      FINAL_ACCESSIBLE_ACCESS_II_01: "Revisar Mundo II: Pulso invisible",
      FINAL_ACCESSIBLE_ACCESS_III_01: "Revisar Mundo III: Cuaderno de pruebas",
      FINAL_ACCESSIBLE_ACCESS_IV_01: "Revisar Mundo IV: Mesa de sistema",
      FINAL_ACCESSIBLE_ACCESS_V_01: "Revisar Mundo V: Mapa del presente",
      FINAL_ACCESSIBLE_BACK_HOME_01:
        "Volver a la portada sin borrar el recorrido completado",
      FINAL_ACCESSIBLE_RESTART_01:
        "Reiniciar el recorrido completo después de confirmar",
      FINAL_RETURN_TO_MIRADOR_BTN_01: "Volver al Mirador",
      FINAL_ACCESSIBLE_RETURN_TO_MIRADOR_01:
        "Volver al Mirador final desde este mundo",
      FINAL_RESTART_BUSY_01: "Reiniciando recorrido…",
      FINAL_RESTART_ERROR_01:
        "No pudimos reiniciar el recorrido. Tu progreso se conservó.",
      FINAL_RESTART_RETRY_BTN_01: "Reintentar",
    } as const;

    for (const [slotId, text] of Object.entries(expectedFinalCopy)) {
      const slot = resolveEditorialText(slotId as EditorialSlotId);

      expect(slot.text).toBe(text);
      expect(slot.status).toBe("FINAL");
      expect(slot.source).toBe("human_approved");
      expect(slot.locale).toBe("es");
    }
  });

  it("registra los 18 slots temporales de Mundo I sin prefijo visual TEMP", () => {
    expect(Object.keys(world1EditorialSlots)).toHaveLength(
      WORLD1_REQUIRED_SLOT_COUNT,
    );
    expect(WORLD1_REQUIRED_SLOT_COUNT).toBe(18);
    expect(world1EditorialSlots.W1_INTRO_TITLE_01.text).toBe(
      "Antes de escuchar, necesitamos aprender a mirar.",
    );
    expect(world1EditorialSlots.W1_CONTINUE_BTN_01.text).toBe("Continuar");

    for (const slot of Object.values(world1EditorialSlots)) {
      expect(slot.status).toBe("TEMP");
      expect(slot.source).toBe("temporary");
      expect(slot.text).not.toMatch(/^TEMP\s+—/);
    }
  });

  it("rechaza slots editoriales no registrados", () => {
    expect(() =>
      resolveEditorialText("W2_SLOT_INEXISTENTE" as EditorialSlotId),
    ).toThrow("Editorial slot not registered: W2_SLOT_INEXISTENTE");
  });

  it("preserva metadata final solo para las transiciones cerradas y deja temporales los gaps reales", () => {
    const finalSlotIds = new Set<string>([
      "TRANS_COVER_W1_TITLE_01",
      "TRANS_COVER_W1_SUB_01",
      "TRANS_W1_W2_TITLE_01",
      "TRANS_W1_W2_SUB_01",
      "TRANS_W2_W3_TITLE_01",
      "TRANS_W2_W3_SUB_01",
      "TRANS_W3_W4_TITLE_01",
      "TRANS_W3_W4_SUB_01",
      "TRANS_W4_W5_TITLE_01",
      "TRANS_W4_W5_SUB_01",
      "TRANS_W5_FINAL_TITLE_01",
      "TRANS_W5_FINAL_SUB_01",
      ...Object.keys(finalEditorialSlots),
    ]);

    for (const localizedEntries of Object.values(editorialRegistry)) {
      const esEntry = localizedEntries.es;

      expect(esEntry).toBeDefined();
      expect(esEntry?.locale).toBe(EDITORIAL_DEFAULT_LOCALE);
      if (esEntry && finalSlotIds.has(esEntry.slotId)) {
        expect(esEntry.source).toBe("human_approved");
        expect(esEntry.status).toBe("FINAL");
      } else {
        expect(esEntry?.source).toBe("temporary");
        expect(esEntry?.status).toBe("TEMP");
      }
    }
  });
});
