# GVO — Narrative Workspace

Este directorio organiza los insumos narrativos y visuales para que el escritor pueda producir diálogos, textos ambientales, textos de espera, microcopy y mensajes de cierre sin depender de conocimiento técnico de programación.

## Estado runtime vigente

- El copy visible definitivo de la transición Mundo II → Mundo III es `Abriendo Mundo III` / `Preparando el Cuaderno Pixel de Pruebas…`.
- Estación III consume `src/screens/World3Root/station3Content.ts` y está cerrada por aprobación humana.
- Los 23 slots históricos `W3_*` del registro/editorial permanecen como deuda TEMP no consumida por runtime; no describen copy provisional visible.
- Los slots W3→W4 y posteriores siguen siendo gaps TEMP reales.

La fuente final de comportamiento y aprobación es [`../status/GVO_STATION3_COMPLETE.md`](../status/GVO_STATION3_COMPLETE.md). Los insumos de esta carpeta preservan contexto editorial y no sustituyen ese contrato.

## Principio de trabajo

Este paquete no impone estilo literario. Define contexto de pantalla, intención funcional, restricciones de verdad del proyecto, estados interactivos y espacios textuales. El ritmo, la sensibilidad verbal, el tono final y la formulación autoral quedan a criterio del escritor, siempre que no contradigan la experiencia ni las reglas del proyecto.

## Estructura

```text
docs/narrative/
  00_INVENTARIO_INSUMOS_GVO.md
  01_DOSSIER_GUIONIZACION_GVO.md
  02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.csv
  03_CONCEPTOS_PROTEGIDOS_Y_EVITAR.md
  04_CHECKLIST_ENTREGA_ESCRITOR.md
  05_TICKET_005A_CODEX.md
  estaciones/
  entrega_escritor_gvo_v1/
  visual_refs/
  source_txt/
```

## Uso recomendado

Las matrices CSV/XLSX son un inventario editorial heredado. En el cierre 017K-R1 se consolidaron allí los dos slots W2→W3 como `FINAL / human_approved` y se marcaron los 23 slots `W3_*` como `LEGACY / no consumido por runtime`. No deben usarse para sustituir el copy aprobado de transición ni `station3Content.ts`.

Para slots todavía abiertos en otros mundos:

1. Revisar primero `01_DOSSIER_GUIONIZACION_GVO.md`.
2. Revisar las fichas dentro de `estaciones/`.
3. Trabajar únicamente IDs cuyo estado de revisión siga pendiente y cuyo frente tenga ticket activo.
4. Validar con `04_CHECKLIST_ENTREGA_ESCRITOR.md` sin sobrescribir entradas `FINAL` o `LEGACY`.

## Entrega para escritor

La carpeta `entrega_escritor_gvo_v1/` contiene el paquete documental listo para compartir con el escritor: dossier visual, guía de diligenciamiento, checklist, matriz de trabajo y copias de las 9 referencias visuales.

Fecha de paquete original: 2026-06-09. Estado actual: paquete histórico subordinado a los contratos canónicos de runtime.
