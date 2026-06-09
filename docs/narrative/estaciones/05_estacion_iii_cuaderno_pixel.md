# Estación III — Mundo III: Cuaderno Pixel de Pruebas

![Referencia visual](../visual_refs/05_estacion_iii_cuaderno_pixel.png)

**Especificación fuente:** `../source_txt/05_estacion_iii_cuaderno_pixel_especificacion_v1.txt`

## 1. Función de la estación dentro de GVO

Mundo III muestra que OKÚA nació de observación, pruebas, errores, prototipos, revisión de señales y ajustes. No presenta el sistema como perfecto desde el inicio.

La ficha define función, contexto, interacción, concepto obligatorio, riesgo conceptual y longitud móvil sugerida. No impone estilo literario ni escribe diálogos finales.

## 2. Idea central para el visitante

OKÚA se construye probando: observar, prototipar, revisar señales y ajustar también son parte de la experiencia.

## 3. Qué debe comprender el visitante

- el proyecto tiene memoria de pruebas.
- la observación inicial importa tanto como el resultado.
- un prototipo permite descubrir límites.
- la señal necesitó revisión.
- ajustar no es fallar: es mejorar el sistema.
- el recorrido avanza hacia la cadena técnica completa.

## 4. Qué no debe concluir el visitante

- que OKÚA funcionó perfecto desde el inicio.
- que el prototipo resolvió todo por magia.
- que la señal estaba lista sin pruebas.
- que la pantalla es un minijuego complejo.
- que aquí debe explicarse toda la cadena técnica.

## 5. Descripción visual para escritura

Pantalla vertical móvil con estética de cuaderno pixel, bloques de bitácora y sello AJUSTADO. La escritura debe leer la escena como registro de proceso, no como interfaz técnica saturada ni collage sin orden.

## 6. Mapa semántico de la pantalla

| Elemento visual | Qué representa para escritura | Qué no representa |
| --- | --- | --- |
| Cuaderno | Memoria de proceso | Decoración nostálgica |
| PLANTA | Observación inicial | Objeto pasivo |
| PROTOTIPO | Prueba material | Solución perfecta |
| SEÑAL | Fenómeno revisado | Música lista |
| AJUSTADO | Aprendizaje por iteración | Final mágico |
| Lía | Guía de lectura | Inventora humana |

## 7. Contrato de interacción

- Primera visita: orden secuencial obligatorio `PLANTA → PROTOTIPO → SEÑAL → AJUSTADO`.
- El sello AJUSTADO se habilita después de completar los tres bloques principales.
- Tocar un bloque correcto abre nota o respuesta de bitácora.
- Tocar un bloque bloqueado muestra orientación suave.
- Completar AJUSTADO habilita cierre y avance hacia Mundo IV.
- No requiere audio ni explicación externa.

## 8. Secuencia narrativa por estados

| Orden | Estado | Acción del visitante | Cambio visible esperado | Función narrativa |
| --- | --- | --- | --- | --- |
| 0 | `w3_intro` | Entra al cuaderno | Cuaderno y bloques visibles | Presentar bitácora |
| 1 | `w3_planta_available` | Abre PLANTA | Bloque planta activo | Mostrar observación inicial |
| 2 | `w3_prototipo_available` | Abre PROTOTIPO | Bloque prototipo activo | Mostrar prueba material |
| 3 | `w3_senal_available` | Abre SEÑAL | Bloque señal activo | Mostrar revisión de señal |
| 4 | `w3_ajustado_available` | Lee o activa AJUSTADO | Sello visible | Cerrar iteración |
| X | `w3_block_locked` | Toca fuera de orden | Sin avance fuerte | Orientar sin frustrar |
| 5 | `w3_complete` | Toca continuar | Cuaderno completo | Pasar a Mundo IV |

## 9. Estados de pantalla y necesidades de texto

| Estado | Qué ve / acaba de hacer | Texto requerido | Función | Evitar |
| --- | --- | --- | --- | --- |
| `w3_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Entrada (Lía) | Presentar el cuaderno como memoria de pruebas y ajustes. | Sistema perfecto |
| `w3_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Texto ambiental (Ambiente) | Situar la pantalla como registro, no como laboratorio saturado. | Saturación técnica |
| `w3_planta_available` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a abrir el bloque PLANTA. | Minijuego |
| `w3_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Nota de bitácora (Cuaderno / ambiente) | Mostrar que el proceso comenzó observando una planta viva. | Adorno |
| `w3_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que observar fue el primer dato del desarrollo. | Conclusión automática |
| `w3_prototipo_available` | Elemento PROTOTIPO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a abrir el bloque PROTOTIPO. | Perfección inicial |
| `w3_prototipo_active` | Elemento PROTOTIPO disponible o activo. Visitante sigue la secuencia indicada. | Nota de bitácora (Cuaderno / ambiente) | Mostrar que el prototipo permitió probar límites. | Magia técnica |
| `w3_prototipo_active` | Elemento PROTOTIPO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que probar también es aprender del error. | Fallo como fracaso total |
| `w3_senal_available` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a abrir el bloque SEÑAL. | Música directa |
| `w3_senal_active` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Nota de bitácora (Cuaderno / ambiente) | Mostrar que la señal debió revisarse y entenderse. | Señal lista desde el inicio |
| `w3_senal_active` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que la señal también mostró límites. | Triunfalismo técnico |
| `w3_ajustado_available` | Elemento AJUSTADO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a leer o activar el sello AJUSTADO. | Final mágico |
| `w3_ajustado_active` | Elemento AJUSTADO disponible o activo. Visitante sigue la secuencia indicada. | Sello / respuesta (Cuaderno / ambiente) | Expresar que ajustar forma parte de construir el sistema. | Perfección absoluta |
| `w3_ajustado_active` | Elemento AJUSTADO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Cerrar la idea de iteración: probar, corregir y mejorar. | Todo funcionó primero |
| `w3_block_locked` | Elemento fuera de orden no avanza. Visitante tocó un elemento bloqueado. | Bloqueo suave (Lía o sistema) | Guiar al bloque correcto. | Error fuerte |
| `w3_block_locked` | Elemento ya revisado recibe nuevo toque. Visitante repite un elemento completado. | Relectura / repetición (Lía o sistema) | Indicar que ese bloque ya fue leído. | Regaño |
| `w3_complete` | Pantalla completa con todos los pasos activados. Visitante completó la secuencia principal. | Cierre (Lía) | Preparar paso hacia la cadena técnica completa. | Explicar ocho nodos aquí |
| `w3_complete` | Botón de avance habilitado. Pantalla completada. | Botón (Sistema / interfaz) | Avanzar a transición hacia Mundo IV. | Ambigüedad |
| `w3_intro` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir cuaderno, Lía, tres bloques y sello. | Texto excesivo |
| `w3_planta_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de PLANTA. | Decoración |
| `w3_prototipo_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de PROTOTIPO. | Magia técnica |
| `w3_senal_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de SEÑAL. | Música directa |
| `w3_ajustado_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir aparición o activación del sello AJUSTADO. | Perfección absoluta |

## 10. Slots de texto requeridos

| ID | Estado | Emisor sugerido | Tipo de texto | Función del texto | Longitud sugerida | Concepto obligatorio | Evitar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W3_INTRO_LIA_01 | `w3_intro` | Lía | Entrada | Presentar el cuaderno como memoria de pruebas y ajustes. | 90-160 caracteres | Bitácora / pruebas | Sistema perfecto |
| W3_INTRO_AMB_01 | `w3_intro` | Ambiente | Texto ambiental | Situar la pantalla como registro, no como laboratorio saturado. | 50-120 caracteres | Memoria / registro | Saturación técnica |
| W3_PLANTA_HINT_01 | `w3_planta_available` | Lía | Instrucción contextual | Invitar a abrir el bloque PLANTA. | 40-90 caracteres | Observación inicial | Minijuego |
| W3_PLANTA_NOTE_01 | `w3_planta_active` | Cuaderno / ambiente | Nota de bitácora | Mostrar que el proceso comenzó observando una planta viva. | 60-130 caracteres | Planta / observación | Adorno |
| W3_PLANTA_CONFIRM_01 | `w3_planta_active` | Lía | Confirmación breve | Confirmar que observar fue el primer dato del desarrollo. | 50-110 caracteres | Observación | Conclusión automática |
| W3_PROTOTIPO_HINT_01 | `w3_prototipo_available` | Lía | Instrucción contextual | Invitar a abrir el bloque PROTOTIPO. | 40-90 caracteres | Prototipo | Perfección inicial |
| W3_PROTOTIPO_NOTE_01 | `w3_prototipo_active` | Cuaderno / ambiente | Nota de bitácora | Mostrar que el prototipo permitió probar límites. | 60-130 caracteres | Prueba material | Magia técnica |
| W3_PROTOTIPO_CONFIRM_01 | `w3_prototipo_active` | Lía | Confirmación breve | Confirmar que probar también es aprender del error. | 50-110 caracteres | Prueba / aprendizaje | Fallo como fracaso total |
| W3_SENAL_HINT_01 | `w3_senal_available` | Lía | Instrucción contextual | Invitar a abrir el bloque SEÑAL. | 40-90 caracteres | Señal revisada | Música directa |
| W3_SENAL_NOTE_01 | `w3_senal_active` | Cuaderno / ambiente | Nota de bitácora | Mostrar que la señal debió revisarse y entenderse. | 60-130 caracteres | Revisión de señal | Señal lista desde el inicio |
| W3_SENAL_CONFIRM_01 | `w3_senal_active` | Lía | Confirmación breve | Confirmar que la señal también mostró límites. | 50-110 caracteres | Límites / revisión | Triunfalismo técnico |
| W3_AJUSTADO_HINT_01 | `w3_ajustado_available` | Lía | Instrucción contextual | Invitar a leer o activar el sello AJUSTADO. | 40-100 caracteres | Ajuste | Final mágico |
| W3_AJUSTADO_AMB_01 | `w3_ajustado_active` | Cuaderno / ambiente | Sello / respuesta | Expresar que ajustar forma parte de construir el sistema. | 60-130 caracteres | Ajuste / mejora | Perfección absoluta |
| W3_AJUSTADO_CONFIRM_01 | `w3_ajustado_active` | Lía | Confirmación breve | Cerrar la idea de iteración: probar, corregir y mejorar. | 60-130 caracteres | Iteración | Todo funcionó primero |
| W3_BLOCK_LOCKED_01 | `w3_block_locked` | Lía o sistema | Bloqueo suave | Guiar al bloque correcto. | 35-90 caracteres | Secuencia de bitácora | Error fuerte |
| W3_BLOCK_REPEAT_01 | `w3_block_locked` | Lía o sistema | Relectura / repetición | Indicar que ese bloque ya fue leído. | 35-90 caracteres | Revisión cuidadosa | Regaño |
| W3_COMPLETE_LIA_01 | `w3_complete` | Lía | Cierre | Preparar paso hacia la cadena técnica completa. | 80-150 caracteres | Prueba / ajuste | Explicar ocho nodos aquí |
| W3_CONTINUE_BTN_01 | `w3_complete` | Sistema / interfaz | Botón | Avanzar a transición hacia Mundo IV. | 1-4 palabras | Avance secuencial | Ambigüedad |
| W3_ACCESSIBLE_SCENE_01 | `w3_intro` | Sistema / accesibilidad | Descripción accesible | Describir cuaderno, Lía, tres bloques y sello. | 90-170 caracteres | Cuaderno / bloques | Texto excesivo |
| W3_ACCESSIBLE_PLANTA_01 | `w3_planta_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de PLANTA. | 70-140 caracteres | Planta | Decoración |
| W3_ACCESSIBLE_PROTOTIPO_01 | `w3_prototipo_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de PROTOTIPO. | 70-140 caracteres | Prototipo | Magia técnica |
| W3_ACCESSIBLE_SENAL_01 | `w3_senal_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de SEÑAL. | 70-140 caracteres | Señal | Música directa |
| W3_ACCESSIBLE_AJUSTADO_01 | `w3_ajustado_active` | Sistema / accesibilidad | Descripción accesible | Describir aparición o activación del sello AJUSTADO. | 70-150 caracteres | Ajuste | Perfección absoluta |

## 11. Conceptos protegidos

- bitácora.
- observación.
- pruebas.
- errores.
- prototipo.
- revisión de señal.
- ajuste.
- iteración.
- Lía como guía única.

## 12. Conceptos a evitar o tratar con cuidado

- sistema perfecto desde el inicio.
- magia del prototipo.
- exceso técnico.
- minijuego complejo.
- triunfalismo técnico.
- señal lista sin pruebas.

## 13. Pautas de accesibilidad y público general

- Público mixto: niños, adolescentes, adultos y ancianos.
- Textos legibles en pantalla móvil.
- Frases breves, sin dependencia de tecnicismos innecesarios.
- Microcopy de acción claro para avances, bloqueos, repetición y cierre.
- Descripciones accesibles útiles para fallback o lector de pantalla.
- La experiencia debe entenderse sin audio.

## 14. Relación con estación anterior y siguiente

Viene de Mundo II, donde la señal fue presentada como mediada. Prepara Mundo IV, donde la cadena técnica completa se ordena con precisión por nodos.

## 15. Checklist específico de aprobación

- [ ] La pantalla se lee como bitácora de proceso.
- [ ] No se presenta el sistema como perfecto desde el inicio.
- [ ] El sello AJUSTADO tiene función narrativa.
- [ ] El texto no explica los ocho nodos de Mundo IV.
- [ ] El cierre prepara la cadena técnica.
- [ ] La lectura funciona en móvil sin audio.
- [ ] El escritor conserva libertad autoral dentro de la función de cada slot.
