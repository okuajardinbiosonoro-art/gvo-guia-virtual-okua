# Slots de texto — Estación III — Mundo III: Cuaderno Pixel de Pruebas

> **INVENTARIO EDITORIAL LEGACY / NO CONSUMIDO POR RUNTIME.** Estación III usa `src/screens/World3Root/station3Content.ts`. Este archivo preserva los 23 slots `W3_*` TEMP como deuda editorial histórica; no es fuente del copy visible. Consulte [`../../status/GVO_STATION3_COMPLETE.md`](../../status/GVO_STATION3_COMPLETE.md).

## Uso

Este archivo lista los slots de texto requeridos para guionización. No contiene textos finales.

## Tabla de slots

| ID | Estado | Emisor sugerido | Tipo de texto | Contexto visual | Acción previa | Función del texto | Concepto obligatorio | Evitar | Longitud sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W3_INTRO_LIA_01 | `w3_intro` | Lía | Entrada | Escena inicial con Lía y elementos principales visibles. | Ingreso a la pantalla. | Presentar el cuaderno como memoria de pruebas y ajustes. | Bitácora / pruebas | Sistema perfecto | 90-160 caracteres |
| W3_INTRO_AMB_01 | `w3_intro` | Ambiente | Texto ambiental | Escena inicial con Lía y elementos principales visibles. | Ingreso a la pantalla. | Situar la pantalla como registro, no como laboratorio saturado. | Memoria / registro | Saturación técnica | 50-120 caracteres |
| W3_PLANTA_HINT_01 | `w3_planta_available` | Lía | Instrucción contextual | Elemento PLANTA disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a abrir el bloque PLANTA. | Observación inicial | Minijuego | 40-90 caracteres |
| W3_PLANTA_NOTE_01 | `w3_planta_active` | Cuaderno / ambiente | Nota de bitácora | Elemento PLANTA disponible o activo. | Visitante sigue la secuencia indicada. | Mostrar que el proceso comenzó observando una planta viva. | Planta / observación | Adorno | 60-130 caracteres |
| W3_PLANTA_CONFIRM_01 | `w3_planta_active` | Lía | Confirmación breve | Elemento PLANTA disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que observar fue el primer dato del desarrollo. | Observación | Conclusión automática | 50-110 caracteres |
| W3_PROTOTIPO_HINT_01 | `w3_prototipo_available` | Lía | Instrucción contextual | Elemento PROTOTIPO disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a abrir el bloque PROTOTIPO. | Prototipo | Perfección inicial | 40-90 caracteres |
| W3_PROTOTIPO_NOTE_01 | `w3_prototipo_active` | Cuaderno / ambiente | Nota de bitácora | Elemento PROTOTIPO disponible o activo. | Visitante sigue la secuencia indicada. | Mostrar que el prototipo permitió probar límites. | Prueba material | Magia técnica | 60-130 caracteres |
| W3_PROTOTIPO_CONFIRM_01 | `w3_prototipo_active` | Lía | Confirmación breve | Elemento PROTOTIPO disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que probar también es aprender del error. | Prueba / aprendizaje | Fallo como fracaso total | 50-110 caracteres |
| W3_SENAL_HINT_01 | `w3_senal_available` | Lía | Instrucción contextual | Elemento SENAL disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a abrir el bloque SEÑAL. | Señal revisada | Música directa | 40-90 caracteres |
| W3_SENAL_NOTE_01 | `w3_senal_active` | Cuaderno / ambiente | Nota de bitácora | Elemento SENAL disponible o activo. | Visitante sigue la secuencia indicada. | Mostrar que la señal debió revisarse y entenderse. | Revisión de señal | Señal lista desde el inicio | 60-130 caracteres |
| W3_SENAL_CONFIRM_01 | `w3_senal_active` | Lía | Confirmación breve | Elemento SENAL disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que la señal también mostró límites. | Límites / revisión | Triunfalismo técnico | 50-110 caracteres |
| W3_AJUSTADO_HINT_01 | `w3_ajustado_available` | Lía | Instrucción contextual | Elemento AJUSTADO disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a leer o activar el sello AJUSTADO. | Ajuste | Final mágico | 40-100 caracteres |
| W3_AJUSTADO_AMB_01 | `w3_ajustado_active` | Cuaderno / ambiente | Sello / respuesta | Elemento AJUSTADO disponible o activo. | Visitante sigue la secuencia indicada. | Expresar que ajustar forma parte de construir el sistema. | Ajuste / mejora | Perfección absoluta | 60-130 caracteres |
| W3_AJUSTADO_CONFIRM_01 | `w3_ajustado_active` | Lía | Confirmación breve | Elemento AJUSTADO disponible o activo. | Visitante sigue la secuencia indicada. | Cerrar la idea de iteración: probar, corregir y mejorar. | Iteración | Todo funcionó primero | 60-130 caracteres |
| W3_BLOCK_LOCKED_01 | `w3_block_locked` | Lía o sistema | Bloqueo suave | Elemento fuera de orden no avanza. | Visitante tocó un elemento bloqueado. | Guiar al bloque correcto. | Secuencia de bitácora | Error fuerte | 35-90 caracteres |
| W3_BLOCK_REPEAT_01 | `w3_block_locked` | Lía o sistema | Relectura / repetición | Elemento ya revisado recibe nuevo toque. | Visitante repite un elemento completado. | Indicar que ese bloque ya fue leído. | Revisión cuidadosa | Regaño | 35-90 caracteres |
| W3_COMPLETE_LIA_01 | `w3_complete` | Lía | Cierre | Pantalla completa con todos los pasos activados. | Visitante completó la secuencia principal. | Preparar paso hacia la cadena técnica completa. | Prueba / ajuste | Explicar ocho nodos aquí | 80-150 caracteres |
| W3_CONTINUE_BTN_01 | `w3_complete` | Sistema / interfaz | Botón | Botón de avance habilitado. | Pantalla completada. | Avanzar a transición hacia Mundo IV. | Avance secuencial | Ambigüedad | 1-4 palabras |
| W3_ACCESSIBLE_SCENE_01 | `w3_intro` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir cuaderno, Lía, tres bloques y sello. | Cuaderno / bloques | Texto excesivo | 90-170 caracteres |
| W3_ACCESSIBLE_PLANTA_01 | `w3_planta_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de PLANTA. | Planta | Decoración | 70-140 caracteres |
| W3_ACCESSIBLE_PROTOTIPO_01 | `w3_prototipo_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de PROTOTIPO. | Prototipo | Magia técnica | 70-140 caracteres |
| W3_ACCESSIBLE_SENAL_01 | `w3_senal_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de SEÑAL. | Señal | Música directa | 70-140 caracteres |
| W3_ACCESSIBLE_AJUSTADO_01 | `w3_ajustado_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir aparición o activación del sello AJUSTADO. | Ajuste | Perfección absoluta | 70-150 caracteres |

## Notas para implementación futura

- Los IDs son estables para revisión y futura implementación.
- `Emisor sugerido` no impone estilo literario.
- Los campos de texto final deben ser completados por el escritor en la matriz.
