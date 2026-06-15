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

  it("resuelve los slots temporales W2 W3, W3 W4, W4 W5, Mundo III, Mundo IV y entrada Mundo V", () => {
    expect(resolveEditorialText("TRANS_W2_W3_TITLE_01").text).toBe(
      "TEMP — Abriendo Mundo III",
    );
    expect(resolveEditorialText("TRANS_W2_W3_SUB_01").text).toBe(
      "TEMP — Preparando el cuaderno de pruebas y ajustes.",
    );
    expect(resolveEditorialText("TRANS_W3_W4_TITLE_01").text).toBe(
      "TEMP — Abriendo Mundo IV",
    );
    expect(resolveEditorialText("TRANS_W3_W4_SUB_01").text).toBe(
      "TEMP — Preparando la mesa del sistema.",
    );
    expect(resolveEditorialText("TRANS_W4_W5_TITLE_01").text).toBe(
      "TEMP — Abriendo Mundo V",
    );
    expect(resolveEditorialText("TRANS_W4_W5_SUB_01").text).toBe(
      "TEMP — Preparando el mapa del presente.",
    );
    expect(resolveEditorialText("TRANS_W5_FINAL_TITLE_01").text).toBe(
      "TEMP — Abriendo el Mirador",
    );
    expect(resolveEditorialText("TRANS_W5_FINAL_SUB_01").text).toBe(
      "TEMP — Preparando el cierre del recorrido.",
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
    expect(resolveEditorialText("FINAL_TITLE_01").text).toBe(
      "TEMP — Mirador Final",
    );
    expect(resolveEditorialText("FINAL_SUBTITLE_01").text).toBe(
      "TEMP — El recorrido queda reunido para volver a mirar.",
    );
    expect(resolveEditorialText("FINAL_LIA_MESSAGE_01").text).toBe(
      "TEMP — Desde aquí puedes revisar los mundos completados, volver al inicio o reiniciar el recorrido.",
    );
    expect(resolveEditorialText("FINAL_AMB_01").text).toBe(
      "TEMP — Los mundos quedan abiertos como memoria temporal del camino.",
    );
    expect(resolveEditorialText("FINAL_ACCESS_I_LABEL_01").text).toBe(
      "TEMP — Mundo I — Raíz",
    );
    expect(resolveEditorialText("FINAL_ACCESS_I_CONFIRM_01").text).toBe(
      "TEMP — Revisión de Mundo I preparada.",
    );
    expect(resolveEditorialText("FINAL_ACCESS_II_LABEL_01").text).toBe(
      "TEMP — Mundo II — Pulso invisible",
    );
    expect(resolveEditorialText("FINAL_ACCESS_II_CONFIRM_01").text).toBe(
      "TEMP — Revisión de Mundo II preparada.",
    );
    expect(resolveEditorialText("FINAL_ACCESS_III_LABEL_01").text).toBe(
      "TEMP — Mundo III — Cuaderno Pixel",
    );
    expect(resolveEditorialText("FINAL_ACCESS_III_CONFIRM_01").text).toBe(
      "TEMP — Revisión de Mundo III preparada.",
    );
    expect(resolveEditorialText("FINAL_ACCESS_IV_LABEL_01").text).toBe(
      "TEMP — Mundo IV — Mesa de Sistema",
    );
    expect(resolveEditorialText("FINAL_ACCESS_IV_CONFIRM_01").text).toBe(
      "TEMP — Revisión de Mundo IV preparada.",
    );
    expect(resolveEditorialText("FINAL_ACCESS_V_LABEL_01").text).toBe(
      "TEMP — Mundo V — Mapa del Presente",
    );
    expect(resolveEditorialText("FINAL_ACCESS_V_CONFIRM_01").text).toBe(
      "TEMP — Revisión de Mundo V preparada.",
    );
    expect(resolveEditorialText("FINAL_HELP_01").text).toBe(
      "TEMP — Puedes volver a mirar cualquier mundo completado sin agregar una nueva estación.",
    );
    expect(resolveEditorialText("FINAL_BACK_HOME_BTN_01").text).toBe(
      "TEMP — Volver al inicio",
    );
    expect(resolveEditorialText("FINAL_BACK_HOME_HELP_01").text).toBe(
      "TEMP — Esta acción regresa al inicio visible del recorrido.",
    );
    expect(resolveEditorialText("FINAL_RESTART_BTN_01").text).toBe(
      "TEMP — Reiniciar",
    );
    expect(resolveEditorialText("FINAL_RESTART_CONFIRM_01").text).toBe(
      "TEMP — ¿Quieres reiniciar el recorrido desde el comienzo?",
    );
    expect(resolveEditorialText("FINAL_RESTART_CANCEL_BTN_01").text).toBe(
      "TEMP — Cancelar",
    );
    expect(resolveEditorialText("FINAL_RESTART_CONFIRM_BTN_01").text).toBe(
      "TEMP — Confirmar reinicio",
    );
    expect(resolveEditorialText("FINAL_CREDITS_01").text).toBe(
      "TEMP — OKÚA Jardín Biosonoro · Guía Virtual OKÚA",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_SCENE_01").text).toBe(
      "TEMP — Pantalla final tipo mirador con cierre, accesos a mundos, regreso al inicio y reinicio preparado.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_ACCESS_I_01").text).toBe(
      "TEMP — Acceso de revisión a Mundo I.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_ACCESS_II_01").text).toBe(
      "TEMP — Acceso de revisión a Mundo II.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_ACCESS_III_01").text).toBe(
      "TEMP — Acceso de revisión a Mundo III.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_ACCESS_IV_01").text).toBe(
      "TEMP — Acceso de revisión a Mundo IV.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_ACCESS_V_01").text).toBe(
      "TEMP — Acceso de revisión a Mundo V.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_BACK_HOME_01").text).toBe(
      "TEMP — Botón para volver al inicio del recorrido.",
    );
    expect(resolveEditorialText("FINAL_ACCESSIBLE_RESTART_01").text).toBe(
      "TEMP — Acción crítica de reinicio con confirmación.",
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
