# Estación II — Mundo II: Lía y el pulso invisible

![Referencia visual](../visual_refs/04_estacion_ii_pulso_invisible.png)

**Especificación fuente:** `../source_txt/04_estacion_ii_pulso_invisible_especificacion_v1.txt`

## 1. Función de la estación dentro de GVO

Mundo II muestra que una planta viva puede generar una señal bioeléctrica, pero esa señal no equivale a música por sí sola. La experiencia sonora aparece después de una mediación: captura, acondicionamiento, interpretación/mapeo y resultado mediado.

La ficha define función, contexto, interacción, concepto obligatorio, riesgo conceptual y longitud móvil sugerida. No impone estilo literario ni escribe diálogos finales.

## 2. Idea central para el visitante

La señal existe, pero todavía no es música: debe ser capturada, preparada e interpretada antes de convertirse en experiencia sonora mediada.

## 3. Qué debe comprender el visitante

- la planta sigue siendo el origen vivo del proceso.
- la señal bioeléctrica no se ve a simple vista.
- capturar no es inventar una voz para la planta.
- acondicionar prepara la señal antes de interpretarla.
- mapear implica decidir una forma de relación entre datos y sonido.
- el resultado sonoro es mediado, no directo.

## 4. Qué no debe concluir el visitante

- que la planta canta literalmente.
- que señal y música son lo mismo.
- que la bioelectricidad es magia.
- que ya se explicó toda la cadena técnica de ocho nodos.
- que el sonido aparece sin decisiones de mediación.

## 5. Descripción visual para escritura

Pantalla vertical móvil con planta y Lía como referencia superior, seis capas o pasos inferiores, y una lectura de pulso invisible que avanza por etapas. La escena debe sentirse clara, secuencial y pedagógica sin volverse laboratorio saturado.

## 6. Mapa semántico de la pantalla

| Elemento visual | Qué representa para escritura | Qué no representa |
| --- | --- | --- |
| Planta viva | Origen del proceso | Máquina o adorno |
| Señal | Actividad bioeléctrica no visible | Música terminada |
| Captura | Primer acercamiento técnico cuidadoso | Apropiación de la planta |
| Acondicionamiento | Preparación de la señal | Magia o salto automático |
| Mapeo | Interpretación de datos | Traducción literal |
| Resultado mediado | Experiencia sonora construida | Planta cantante |
| Lía | Guía de lectura | Operadora técnica exhaustiva |

## 7. Contrato de interacción

- Primera visita: orden secuencial obligatorio `PLANTA VIVA → SEÑAL → CAPTURA → ACONDICIONAMIENTO → MAPEO → RESULTADO MEDIADO`.
- Tocar la capa correcta activa texto y estado visual.
- Tocar una capa bloqueada muestra bloqueo suave.
- Una capa ya leída puede permitir relectura sin castigo.
- Completar las seis capas habilita cierre y avance hacia Mundo III.
- La estación debe entenderse sin audio.

## 8. Secuencia narrativa por estados

| Orden | Estado | Acción del visitante | Cambio visible esperado | Función narrativa |
| --- | --- | --- | --- | --- |
| 0 | `w2_intro` | Entra a Mundo II | Planta, Lía y capas visibles | Presentar pulso invisible |
| 1 | `w2_planta_available` | Toca PLANTA VIVA | Primera capa activa | Reconocer origen vivo |
| 2 | `w2_senal_available` | Toca SEÑAL | Capa de señal activa | Diferenciar señal y sonido |
| 3 | `w2_captura_available` | Toca CAPTURA | Capa de captura activa | Mostrar toma cuidadosa |
| 4 | `w2_acondicionamiento_available` | Toca ACONDICIONAMIENTO | Capa de preparación activa | Evitar lectura directa falsa |
| 5 | `w2_mapeo_available` | Toca MAPEO | Capa de mapeo activa | Explicar interpretación |
| 6 | `w2_resultado_available` | Toca RESULTADO MEDIADO | Resultado activo | Cerrar mediación sonora |
| X | `w2_layer_locked` | Toca fuera de orden | Sin avance fuerte | Orientar sin frustrar |
| 7 | `w2_complete` | Toca continuar | Capas completas | Pasar a Mundo III |

## 9. Estados de pantalla y necesidades de texto

| Estado | Qué ve / acaba de hacer | Texto requerido | Función | Evitar |
| --- | --- | --- | --- | --- |
| `w2_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Entrada (Lía) | Presentar la diferencia entre planta viva, señal y música mediada. | Planta que canta |
| `w2_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Texto ambiental (Ambiente) | Situar el pulso invisible como algo que no se ve a simple vista. | Magia literal |
| `w2_planta_available` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar la capa PLANTA VIVA. | Orden agresiva |
| `w2_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Reconocer la planta como origen vivo del proceso. | Adorno |
| `w2_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que el recorrido parte de una vida, no de una máquina. | Máquina como origen |
| `w2_senal_available` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar la capa SEÑAL. | Música directa |
| `w2_senal_active` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Mostrar que hay actividad no visible en la planta. | Canto literal |
| `w2_senal_active` | Elemento SENAL disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Aclarar que señal no equivale todavía a sonido. | Confundir señal y música |
| `w2_captura_available` | Elemento CAPTURA disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar la capa CAPTURA. | Cadena completa |
| `w2_captura_active` | Elemento CAPTURA disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Mostrar que el sistema empieza a tomar la señal con cuidado. | Apropiación de la planta |
| `w2_captura_active` | Elemento CAPTURA disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que captar no es inventar una voz. | Voz falsa de la planta |
| `w2_acondicionamiento_available` | Elemento ACONDICIONAMIENTO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar la capa ACONDICIONAMIENTO. | Tecnicismo pesado |
| `w2_acondicionamiento_active` | Elemento ACONDICIONAMIENTO disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Indicar que la señal debe prepararse antes de interpretarse. | Magia |
| `w2_acondicionamiento_active` | Elemento ACONDICIONAMIENTO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que preparar la señal evita una lectura directa falsa. | Música inmediata |
| `w2_mapeo_available` | Elemento MAPEO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar la capa MAPEO. | Traducción mágica |
| `w2_mapeo_active` | Elemento MAPEO disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Mostrar que los datos se relacionan con una forma sonora. | Canto natural |
| `w2_mapeo_active` | Elemento MAPEO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que mapear es decidir cómo interpretar datos. | Equivalencia automática |
| `w2_resultado_available` | Elemento RESULTADO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar RESULTADO MEDIADO. | Resultado mágico |
| `w2_resultado_active` | Elemento RESULTADO disponible o activo. Visitante sigue la secuencia indicada. | Respuesta ambiental (Ambiente) | Cerrar el recorrido de capas como experiencia sonora mediada. | Planta cantante |
| `w2_resultado_active` | Elemento RESULTADO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que el resultado no elimina la mediación. | Sonido directo |
| `w2_layer_locked` | Elemento fuera de orden no avanza. Visitante tocó un elemento bloqueado. | Bloqueo suave (Lía o sistema) | Orientar a la capa correcta. | Regaño técnico |
| `w2_layer_locked` | Elemento ya revisado recibe nuevo toque. Visitante repite un elemento completado. | Relectura / repetición (Lía o sistema) | Indicar que esa capa ya fue leída. | Error técnico |
| `w2_complete` | Pantalla completa con todos los pasos activados. Visitante completó la secuencia principal. | Cierre (Lía) | Preparar paso hacia el cuaderno de pruebas. | Planta que canta |
| `w2_complete` | Pantalla completa con todos los pasos activados. Visitante completó la secuencia principal. | Cierre ambiental (Ambiente) | Cerrar el pulso invisible como capa comprendida. | Triunfalismo técnico |
| `w2_complete` | Botón de avance habilitado. Pantalla completada. | Botón (Sistema / interfaz) | Avanzar a transición hacia Mundo III. | Ambigüedad |
| `w2_intro` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir planta, Lía y seis capas inferiores. | Texto excesivo |
| `w2_planta_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de PLANTA VIVA. | Adorno |
| `w2_senal_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de SEÑAL. | Música directa |
| `w2_captura_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de CAPTURA. | Voz de la planta |
| `w2_acondicionamiento_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de ACONDICIONAMIENTO. | Magia |
| `w2_mapeo_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de MAPEO. | Traducción literal |
| `w2_resultado_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de RESULTADO MEDIADO. | Planta que canta |

## 10. Slots de texto requeridos

| ID | Estado | Emisor sugerido | Tipo de texto | Función del texto | Longitud sugerida | Concepto obligatorio | Evitar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W2_INTRO_LIA_01 | `w2_intro` | Lía | Entrada | Presentar la diferencia entre planta viva, señal y música mediada. | 90-160 caracteres | Señal bioeléctrica / mediación | Planta que canta |
| W2_INTRO_AMB_01 | `w2_intro` | Ambiente | Texto ambiental | Situar el pulso invisible como algo que no se ve a simple vista. | 50-120 caracteres | Invisibilidad / pulso | Magia literal |
| W2_PLANTA_HINT_01 | `w2_planta_available` | Lía | Instrucción contextual | Invitar a activar la capa PLANTA VIVA. | 40-90 caracteres | Planta viva | Orden agresiva |
| W2_PLANTA_AMB_01 | `w2_planta_active` | Ambiente | Respuesta ambiental | Reconocer la planta como origen vivo del proceso. | 50-120 caracteres | Vida / origen | Adorno |
| W2_PLANTA_CONFIRM_01 | `w2_planta_active` | Lía | Confirmación breve | Confirmar que el recorrido parte de una vida, no de una máquina. | 40-100 caracteres | Origen vivo | Máquina como origen |
| W2_SENAL_HINT_01 | `w2_senal_available` | Lía | Instrucción contextual | Invitar a activar la capa SEÑAL. | 40-90 caracteres | Señal bioeléctrica | Música directa |
| W2_SENAL_AMB_01 | `w2_senal_active` | Ambiente | Respuesta ambiental | Mostrar que hay actividad no visible en la planta. | 50-130 caracteres | Bioelectricidad | Canto literal |
| W2_SENAL_CONFIRM_01 | `w2_senal_active` | Lía | Confirmación breve | Aclarar que señal no equivale todavía a sonido. | 50-110 caracteres | Señal no es música | Confundir señal y música |
| W2_CAPTURA_HINT_01 | `w2_captura_available` | Lía | Instrucción contextual | Invitar a activar la capa CAPTURA. | 40-90 caracteres | Captura | Cadena completa |
| W2_CAPTURA_AMB_01 | `w2_captura_active` | Ambiente | Respuesta ambiental | Mostrar que el sistema empieza a tomar la señal con cuidado. | 50-130 caracteres | Captura cuidadosa | Apropiación de la planta |
| W2_CAPTURA_CONFIRM_01 | `w2_captura_active` | Lía | Confirmación breve | Confirmar que captar no es inventar una voz. | 50-110 caracteres | Captura / mediación | Voz falsa de la planta |
| W2_ACONDICIONAMIENTO_HINT_01 | `w2_acondicionamiento_available` | Lía | Instrucción contextual | Invitar a activar la capa ACONDICIONAMIENTO. | 40-100 caracteres | Acondicionamiento | Tecnicismo pesado |
| W2_ACONDICIONAMIENTO_AMB_01 | `w2_acondicionamiento_active` | Ambiente | Respuesta ambiental | Indicar que la señal debe prepararse antes de interpretarse. | 50-130 caracteres | Preparación de señal | Magia |
| W2_ACONDICIONAMIENTO_CONFIRM_01 | `w2_acondicionamiento_active` | Lía | Confirmación breve | Confirmar que preparar la señal evita una lectura directa falsa. | 50-120 caracteres | Señal preparada | Música inmediata |
| W2_MAPEO_HINT_01 | `w2_mapeo_available` | Lía | Instrucción contextual | Invitar a activar la capa MAPEO. | 40-90 caracteres | Mapeo | Traducción mágica |
| W2_MAPEO_AMB_01 | `w2_mapeo_active` | Ambiente | Respuesta ambiental | Mostrar que los datos se relacionan con una forma sonora. | 50-130 caracteres | Interpretación / mapeo | Canto natural |
| W2_MAPEO_CONFIRM_01 | `w2_mapeo_active` | Lía | Confirmación breve | Confirmar que mapear es decidir cómo interpretar datos. | 50-120 caracteres | Interpretación | Equivalencia automática |
| W2_RESULTADO_HINT_01 | `w2_resultado_available` | Lía | Instrucción contextual | Invitar a activar RESULTADO MEDIADO. | 40-100 caracteres | Resultado mediado | Resultado mágico |
| W2_RESULTADO_AMB_01 | `w2_resultado_active` | Ambiente | Respuesta ambiental | Cerrar el recorrido de capas como experiencia sonora mediada. | 60-140 caracteres | Sonido mediado | Planta cantante |
| W2_RESULTADO_CONFIRM_01 | `w2_resultado_active` | Lía | Confirmación breve | Confirmar que el resultado no elimina la mediación. | 50-120 caracteres | Mediación | Sonido directo |
| W2_LAYER_LOCKED_01 | `w2_layer_locked` | Lía o sistema | Bloqueo suave | Orientar a la capa correcta. | 35-90 caracteres | Secuencia por capas | Regaño técnico |
| W2_LAYER_REPEAT_01 | `w2_layer_locked` | Lía o sistema | Relectura / repetición | Indicar que esa capa ya fue leída. | 35-90 caracteres | Revisión cuidadosa | Error técnico |
| W2_COMPLETE_LIA_01 | `w2_complete` | Lía | Cierre | Preparar paso hacia el cuaderno de pruebas. | 80-150 caracteres | Señal mediada | Planta que canta |
| W2_COMPLETE_AMB_01 | `w2_complete` | Ambiente | Cierre ambiental | Cerrar el pulso invisible como capa comprendida. | 50-120 caracteres | Pulso / mediación | Triunfalismo técnico |
| W2_CONTINUE_BTN_01 | `w2_complete` | Sistema / interfaz | Botón | Avanzar a transición hacia Mundo III. | 1-4 palabras | Avance secuencial | Ambigüedad |
| W2_ACCESSIBLE_SCENE_01 | `w2_intro` | Sistema / accesibilidad | Descripción accesible | Describir planta, Lía y seis capas inferiores. | 90-170 caracteres | Planta, Lía, capas | Texto excesivo |
| W2_ACCESSIBLE_PLANTA_01 | `w2_planta_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de PLANTA VIVA. | 70-140 caracteres | Planta viva | Adorno |
| W2_ACCESSIBLE_SENAL_01 | `w2_senal_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de SEÑAL. | 70-140 caracteres | Señal bioeléctrica | Música directa |
| W2_ACCESSIBLE_CAPTURA_01 | `w2_captura_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de CAPTURA. | 70-140 caracteres | Captura | Voz de la planta |
| W2_ACCESSIBLE_ACONDICIONAMIENTO_01 | `w2_acondicionamiento_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de ACONDICIONAMIENTO. | 70-150 caracteres | Señal preparada | Magia |
| W2_ACCESSIBLE_MAPEO_01 | `w2_mapeo_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de MAPEO. | 70-140 caracteres | Mapeo | Traducción literal |
| W2_ACCESSIBLE_RESULTADO_01 | `w2_resultado_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de RESULTADO MEDIADO. | 70-150 caracteres | Resultado mediado | Planta que canta |

## 11. Conceptos protegidos

- planta viva.
- señal bioeléctrica.
- invisibilidad.
- captura.
- acondicionamiento.
- mapeo.
- resultado mediado.
- Lía como guía única.

## 12. Conceptos a evitar o tratar con cuidado

- planta que canta literalmente.
- señal ya convertida en música.
- magia literal.
- explicar toda la cadena de ocho nodos.
- tecnicismo pesado.
- prometer audio en la app.

## 13. Pautas de accesibilidad y público general

- Público mixto: niños, adolescentes, adultos y ancianos.
- Textos legibles en pantalla móvil.
- Frases breves, sin dependencia de tecnicismos innecesarios.
- Microcopy de acción claro para avances, bloqueos, repetición y cierre.
- Descripciones accesibles útiles para fallback o lector de pantalla.
- La experiencia debe entenderse sin audio.

## 14. Relación con estación anterior y siguiente

Viene de Mundo I, donde el visitante aprendió relación, percepción y mediación. Prepara Mundo III mostrando que la señal mediada todavía necesita pruebas, revisión y ajustes.

## 15. Checklist específico de aprobación

- [ ] La diferencia entre señal y música queda clara.
- [ ] No se afirma que la planta canta.
- [ ] Las seis capas se entienden en orden.
- [ ] El texto evita saturación técnica.
- [ ] El cierre prepara el cuaderno de pruebas.
- [ ] La lectura funciona sin audio y en móvil.
- [ ] El escritor conserva libertad autoral dentro de la función de cada slot.
