# Pantalla final — Mirador final del jardín

![Referencia visual](../visual_refs/08_pantalla_final_mirador.png)

**Especificación fuente:** `../source_txt/08_pantalla_final_mirador_especificacion_v1.txt`

## 1. Función de la estación dentro de GVO

El Mirador final no es una sexta estación. Cierra el recorrido, confirma avance completo, habilita revisión libre de los cinco mundos y ofrece salida clara, reinicio completo y créditos esenciales.

La ficha define función, contexto, interacción, concepto obligatorio, riesgo conceptual y longitud móvil sugerida. No impone estilo literario ni escribe diálogos finales.

## 2. Idea central para el visitante

El visitante llega a un cierre navegable: puede contemplar, revisar mundos completados, volver al inicio o reiniciar con claridad.

## 3. Qué debe comprender el visitante

- el recorrido fue completado.
- los cinco mundos quedan disponibles para revisión libre.
- volver al inicio no debe confundirse con reiniciar.
- reiniciar es una acción crítica que requiere confirmación clara.
- los créditos deben ser esenciales.
- no aparece teoría nueva.

## 4. Qué no debe concluir el visitante

- que el final es una estación nueva.
- que los mundos completados quedan bloqueados.
- que volver al inicio borra progreso automáticamente.
- que reiniciar puede expresarse de forma ambigua o poética.
- que los créditos deben saturar la pantalla.

## 5. Descripción visual para escritura

Pantalla vertical móvil de cierre contemplativo con Lía, accesos a cinco mundos y acciones de salida. La escritura debe separar texto sensible de cierre y microcopy funcional crítico.

## 6. Mapa semántico de la pantalla

| Elemento visual | Qué representa para escritura | Qué no representa |
| --- | --- | --- |
| Mirador | Cierre contemplativo | Sexta estación |
| Accesos I-V | Revisión libre | Bloqueo nuevo |
| Volver al inicio | Salida clara | Borrar progreso |
| Reiniciar | Acción crítica confirmada | Acción poética ambigua |
| Créditos | Autoría esencial | Lista saturada |
| Lía | Guía de cierre | Nueva teoría |

## 7. Contrato de interacción

- Los cinco accesos funcionan como revisión libre de mundos completados.
- Volver al inicio debe diferenciarse de reiniciar recorrido.
- Reiniciar recorrido requiere confirmación clara y opción de cancelar.
- Los créditos deben ser mínimos y legibles.
- Permanecer sin acción debe ser válido como contemplación.
- No se introduce contenido pedagógico nuevo.

## 8. Secuencia narrativa por estados

| Orden | Estado | Acción del visitante | Cambio visible esperado | Función narrativa |
| --- | --- | --- | --- | --- |
| 0 | `final_intro` | Entra al mirador | Mensaje final y Lía visibles | Confirmar cierre |
| 1 | `final_review` | Revisa accesos | Cinco mundos disponibles | Permitir revisión libre |
| 2 | `final_access_i_selected` | Selecciona Mundo I | Confirmación de regreso | Revisar Raíz |
| 3 | `final_access_ii_selected` | Selecciona Mundo II | Confirmación de regreso | Revisar Pulso |
| 4 | `final_access_iii_selected` | Selecciona Mundo III | Confirmación de regreso | Revisar Cuaderno |
| 5 | `final_access_iv_selected` | Selecciona Mundo IV | Confirmación de regreso | Revisar Mesa |
| 6 | `final_access_v_selected` | Selecciona Mundo V | Confirmación de regreso | Revisar Mapa |
| 7 | `final_return` | Toca volver | Salida a inicio | Volver sin ambigüedad |
| 8 | `final_restart_confirm` | Confirma o cancela | Diálogo de reinicio | Evitar reinicio accidental |
| 9 | `final_credits` | Lee créditos | Créditos visibles | Cerrar autoría |

## 9. Estados de pantalla y necesidades de texto

| Estado | Qué ve / acaba de hacer | Texto requerido | Función | Evitar |
| --- | --- | --- | --- | --- |
| `final_intro` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Título (Sistema / interfaz) | Nombrar el cierre del recorrido. | Nueva estación |
| `final_intro` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Subtítulo (Sistema / interfaz) | Confirmar recorrido completo. | Teoría nueva |
| `final_intro` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Mensaje final (Lía) | Confirmar recorrido completo y abrir revisión libre. | Nueva teoría |
| `final_intro` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Cierre ambiental (Ambiente) | Dar sensación de contemplación y conjunto. | Urgencia |
| `final_review` | Accesos a mundos completados visibles. Recorrido completado; revisión libre disponible. | Label de acceso (Sistema / interfaz) | Nombrar acceso a Mundo I en revisión libre. | Texto excesivo |
| `final_access_i_selected` | Acceso de revisión seleccionado. Visitante tocó un acceso de mundo. | Confirmación breve (Sistema / Lía) | Confirmar regreso a Mundo I en modo revisión. | Bloqueo |
| `final_review` | Accesos a mundos completados visibles. Recorrido completado; revisión libre disponible. | Label de acceso (Sistema / interfaz) | Nombrar acceso a Mundo II en revisión libre. | Texto excesivo |
| `final_access_ii_selected` | Acceso de revisión seleccionado. Visitante tocó un acceso de mundo. | Confirmación breve (Sistema / Lía) | Confirmar regreso a Mundo II en modo revisión. | Bloqueo |
| `final_review` | Accesos a mundos completados visibles. Recorrido completado; revisión libre disponible. | Label de acceso (Sistema / interfaz) | Nombrar acceso a Mundo III en revisión libre. | Texto excesivo |
| `final_access_iii_selected` | Acceso de revisión seleccionado. Visitante tocó un acceso de mundo. | Confirmación breve (Sistema / Lía) | Confirmar regreso a Mundo III en modo revisión. | Bloqueo |
| `final_review` | Accesos a mundos completados visibles. Recorrido completado; revisión libre disponible. | Label de acceso (Sistema / interfaz) | Nombrar acceso a Mundo IV en revisión libre. | Texto excesivo |
| `final_access_iv_selected` | Acceso de revisión seleccionado. Visitante tocó un acceso de mundo. | Confirmación breve (Sistema / Lía) | Confirmar regreso a Mundo IV en modo revisión. | Bloqueo |
| `final_review` | Accesos a mundos completados visibles. Recorrido completado; revisión libre disponible. | Label de acceso (Sistema / interfaz) | Nombrar acceso a Mundo V en revisión libre. | Texto excesivo |
| `final_access_v_selected` | Acceso de revisión seleccionado. Visitante tocó un acceso de mundo. | Confirmación breve (Sistema / Lía) | Confirmar regreso a Mundo V en modo revisión. | Bloqueo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Ayuda breve (Lía) | Explicar que puede volver a cualquier mundo completado. | Bloqueo innecesario |
| `final_return` | Acción de volver al inicio visible. Visitante evalúa salir al inicio. | Botón (Sistema / interfaz) | Volver a portada o inicio según diseño. | Confundir con reinicio |
| `final_return` | Acción de volver al inicio visible. Visitante evalúa salir al inicio. | Ayuda breve (Sistema / interfaz) | Aclarar que volver al inicio no es necesariamente borrar progreso. | Ambigüedad |
| `final_restart` | Acción de reinicio o confirmación visible. Visitante tocó reiniciar recorrido. | Botón (Sistema / interfaz) | Iniciar flujo de reinicio completo. | Ambigüedad |
| `final_restart_confirm` | Acción de reinicio o confirmación visible. Visitante tocó reiniciar recorrido. | Confirmación (Sistema / interfaz) | Evitar reinicio accidental. | Poetizar acción crítica |
| `final_restart_confirm` | Acción de reinicio o confirmación visible. Visitante tocó reiniciar recorrido. | Botón secundario (Sistema / interfaz) | Cancelar reinicio completo. | Ambigüedad |
| `final_restart_confirm` | Acción de reinicio o confirmación visible. Visitante tocó reiniciar recorrido. | Botón crítico (Sistema / interfaz) | Confirmar reinicio completo. | Ambigüedad |
| `final_credits` | Créditos esenciales visibles. Visitante abre o llega a créditos. | Créditos (Sistema / interfaz) | Mostrar autoría mínima y clara. | Lista larga saturada |
| `final_intro` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir mirador, Lía, accesos y botones. | Texto excesivo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir acceso a Mundo I. | Texto largo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir acceso a Mundo II. | Texto largo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir acceso a Mundo III. | Texto largo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir acceso a Mundo IV. | Texto largo |
| `final_review` | Mirador final con Lía, accesos y acciones visibles. Visitante llegó al cierre. | Descripción accesible (Sistema / accesibilidad) | Describir acceso a Mundo V. | Texto largo |
| `final_return` | Acción de volver al inicio visible. Visitante evalúa salir al inicio. | Descripción accesible (Sistema / accesibilidad) | Describir acción de volver al inicio. | Reinicio accidental |
| `final_restart_confirm` | Acción de reinicio o confirmación visible. Visitante tocó reiniciar recorrido. | Descripción accesible (Sistema / accesibilidad) | Describir acción crítica de reinicio. | Ambigüedad |

## 10. Slots de texto requeridos

| ID | Estado | Emisor sugerido | Tipo de texto | Función del texto | Longitud sugerida | Concepto obligatorio | Evitar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FINAL_TITLE_01 | `final_intro` | Sistema / interfaz | Título | Nombrar el cierre del recorrido. | 2-7 palabras | Mirador final | Nueva estación |
| FINAL_SUBTITLE_01 | `final_intro` | Sistema / interfaz | Subtítulo | Confirmar recorrido completo. | 2-8 palabras | Recorrido completo | Teoría nueva |
| FINAL_LIA_MESSAGE_01 | `final_intro` | Lía | Mensaje final | Confirmar recorrido completo y abrir revisión libre. | 90-170 caracteres | Cierre / revisión libre | Nueva teoría |
| FINAL_AMB_01 | `final_intro` | Ambiente | Cierre ambiental | Dar sensación de contemplación y conjunto. | 50-130 caracteres | Cierre sereno | Urgencia |
| FINAL_ACCESS_I_LABEL_01 | `final_review` | Sistema / interfaz | Label de acceso | Nombrar acceso a Mundo I en revisión libre. | 2-6 palabras | Raíz | Texto excesivo |
| FINAL_ACCESS_I_CONFIRM_01 | `final_access_i_selected` | Sistema / Lía | Confirmación breve | Confirmar regreso a Mundo I en modo revisión. | 40-100 caracteres | Revisión de Raíz | Bloqueo |
| FINAL_ACCESS_II_LABEL_01 | `final_review` | Sistema / interfaz | Label de acceso | Nombrar acceso a Mundo II en revisión libre. | 2-6 palabras | Pulso invisible | Texto excesivo |
| FINAL_ACCESS_II_CONFIRM_01 | `final_access_ii_selected` | Sistema / Lía | Confirmación breve | Confirmar regreso a Mundo II en modo revisión. | 40-100 caracteres | Revisión de Pulso invisible | Bloqueo |
| FINAL_ACCESS_III_LABEL_01 | `final_review` | Sistema / interfaz | Label de acceso | Nombrar acceso a Mundo III en revisión libre. | 2-6 palabras | Cuaderno de pruebas | Texto excesivo |
| FINAL_ACCESS_III_CONFIRM_01 | `final_access_iii_selected` | Sistema / Lía | Confirmación breve | Confirmar regreso a Mundo III en modo revisión. | 40-100 caracteres | Revisión de Cuaderno | Bloqueo |
| FINAL_ACCESS_IV_LABEL_01 | `final_review` | Sistema / interfaz | Label de acceso | Nombrar acceso a Mundo IV en revisión libre. | 2-6 palabras | Mesa de sistema | Texto excesivo |
| FINAL_ACCESS_IV_CONFIRM_01 | `final_access_iv_selected` | Sistema / Lía | Confirmación breve | Confirmar regreso a Mundo IV en modo revisión. | 40-100 caracteres | Revisión de Mesa | Bloqueo |
| FINAL_ACCESS_V_LABEL_01 | `final_review` | Sistema / interfaz | Label de acceso | Nombrar acceso a Mundo V en revisión libre. | 2-6 palabras | Mapa del presente | Texto excesivo |
| FINAL_ACCESS_V_CONFIRM_01 | `final_access_v_selected` | Sistema / Lía | Confirmación breve | Confirmar regreso a Mundo V en modo revisión. | 40-100 caracteres | Revisión de Mapa | Bloqueo |
| FINAL_HELP_01 | `final_review` | Lía | Ayuda breve | Explicar que puede volver a cualquier mundo completado. | 60-130 caracteres | Revisión libre | Bloqueo innecesario |
| FINAL_BACK_HOME_BTN_01 | `final_return` | Sistema / interfaz | Botón | Volver a portada o inicio según diseño. | 1-4 palabras | Salida clara | Confundir con reinicio |
| FINAL_BACK_HOME_HELP_01 | `final_return` | Sistema / interfaz | Ayuda breve | Aclarar que volver al inicio no es necesariamente borrar progreso. | 50-120 caracteres | Volver / conservar | Ambigüedad |
| FINAL_RESTART_BTN_01 | `final_restart` | Sistema / interfaz | Botón | Iniciar flujo de reinicio completo. | 1-4 palabras | Reinicio | Ambigüedad |
| FINAL_RESTART_CONFIRM_01 | `final_restart_confirm` | Sistema / interfaz | Confirmación | Evitar reinicio accidental. | 60-130 caracteres | Confirmación clara | Poetizar acción crítica |
| FINAL_RESTART_CANCEL_BTN_01 | `final_restart_confirm` | Sistema / interfaz | Botón secundario | Cancelar reinicio completo. | 1-3 palabras | Cancelar | Ambigüedad |
| FINAL_RESTART_CONFIRM_BTN_01 | `final_restart_confirm` | Sistema / interfaz | Botón crítico | Confirmar reinicio completo. | 1-4 palabras | Confirmar reinicio | Ambigüedad |
| FINAL_CREDITS_01 | `final_credits` | Sistema / interfaz | Créditos | Mostrar autoría mínima y clara. | Variable | Créditos esenciales | Lista larga saturada |
| FINAL_ACCESSIBLE_SCENE_01 | `final_intro` | Sistema / accesibilidad | Descripción accesible | Describir mirador, Lía, accesos y botones. | 90-180 caracteres | Mirador / revisión | Texto excesivo |
| FINAL_ACCESSIBLE_ACCESS_I_01 | `final_review` | Sistema / accesibilidad | Descripción accesible | Describir acceso a Mundo I. | 50-110 caracteres | Acceso Raíz | Texto largo |
| FINAL_ACCESSIBLE_ACCESS_II_01 | `final_review` | Sistema / accesibilidad | Descripción accesible | Describir acceso a Mundo II. | 50-110 caracteres | Acceso Pulso | Texto largo |
| FINAL_ACCESSIBLE_ACCESS_III_01 | `final_review` | Sistema / accesibilidad | Descripción accesible | Describir acceso a Mundo III. | 50-120 caracteres | Acceso Cuaderno | Texto largo |
| FINAL_ACCESSIBLE_ACCESS_IV_01 | `final_review` | Sistema / accesibilidad | Descripción accesible | Describir acceso a Mundo IV. | 50-120 caracteres | Acceso Mesa | Texto largo |
| FINAL_ACCESSIBLE_ACCESS_V_01 | `final_review` | Sistema / accesibilidad | Descripción accesible | Describir acceso a Mundo V. | 50-120 caracteres | Acceso Mapa | Texto largo |
| FINAL_ACCESSIBLE_BACK_HOME_01 | `final_return` | Sistema / accesibilidad | Descripción accesible | Describir acción de volver al inicio. | 50-120 caracteres | Volver | Reinicio accidental |
| FINAL_ACCESSIBLE_RESTART_01 | `final_restart_confirm` | Sistema / accesibilidad | Descripción accesible | Describir acción crítica de reinicio. | 50-130 caracteres | Reinicio completo | Ambigüedad |

## 11. Conceptos protegidos

- recorrido completo.
- mirador final.
- revisión libre.
- cinco mundos.
- volver al inicio.
- reinicio completo.
- confirmación clara.
- créditos esenciales.

## 12. Conceptos a evitar o tratar con cuidado

- nueva teoría.
- sexta estación.
- bloquear mundos completados.
- confundir volver con reiniciar.
- créditos saturados.
- poetizar acciones críticas.

## 13. Pautas de accesibilidad y público general

- Público mixto: niños, adolescentes, adultos y ancianos.
- Textos legibles en pantalla móvil.
- Frases breves, sin dependencia de tecnicismos innecesarios.
- Microcopy de acción claro para avances, bloqueos, repetición y cierre.
- Descripciones accesibles útiles para fallback o lector de pantalla.
- La experiencia debe entenderse sin audio.

## 14. Relación con estación anterior y siguiente

Viene del Mapa del Presente y cierra todo el recorrido. Su función es permitir revisión libre y salida clara, no abrir otra capa narrativa.

## 15. Checklist específico de aprobación

- [ ] El final no se lee como sexta estación.
- [ ] Los cinco mundos quedan disponibles para revisión.
- [ ] Volver al inicio y reiniciar quedan diferenciados.
- [ ] El reinicio tiene confirmación y cancelación claras.
- [ ] Los créditos son esenciales.
- [ ] No se introduce teoría nueva.
- [ ] El escritor conserva libertad autoral dentro de la función de cada slot.
