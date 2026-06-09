# Estación IV — Mundo IV: Mesa de Sistema

![Referencia visual](../visual_refs/06_estacion_iv_mesa_sistema.png)

**Especificación fuente:** `../source_txt/06_estacion_iv_mesa_sistema_especificacion_v1.txt`

## 1. Función de la estación dentro de GVO

Mundo IV explica por primera vez la cadena técnica completa de OKÚA. Debe ser claro, preciso y comprensible para público general, sin perder el orden de los ocho nodos obligatorios.

La ficha define función, contexto, interacción, concepto obligatorio, riesgo conceptual y longitud móvil sugerida. No impone estilo literario ni escribe diálogos finales.

## 2. Idea central para el visitante

El sonido mediado aparece porque una cadena ordenada conecta planta, captura, control, comunicación local, sistema central y resultado sonoro.

## 3. Qué debe comprender el visitante

- la cadena empieza en la planta.
- el bionosificador es un nodo nombrado y protegido.
- ESP32, MIDI, Wi‑Fi/UDP, router y sistema central cumplen funciones distintas.
- la red es local y no implica internet externo.
- el sonido es resultado mediado de toda la cadena.
- la precisión importa más que la ornamentación verbal.

## 4. Qué no debe concluir el visitante

- que se pueden saltar nodos.
- que el bionosificador es un sensor genérico.
- que la planta emite sonido directamente.
- que MIDI es audio físico.
- que se requiere internet o nube externa.
- que la poesía puede reemplazar la precisión técnica.

## 5. Descripción visual para escritura

Pantalla vertical móvil con mesa técnica, línea de flujo y ocho nodos ordenados. La escritura debe acompañar la activación de cada nodo con precisión breve, suficiente para público general y sin convertir la pantalla en manual técnico.

## 6. Mapa semántico de la pantalla

| Elemento visual | Qué representa para escritura | Qué no representa |
| --- | --- | --- |
| Planta | Origen vivo de la cadena | Fuente de audio directo |
| Bionosificador | Primer mediador/captura | Sensor genérico |
| ESP32 | Lectura y control | Sonido final |
| MIDI | Lenguaje de control/eventos | Audio directo |
| Wi‑Fi/UDP | Comunicación local de datos | Internet externo |
| Router | Orden local de comunicación | Nube |
| Sistema central | Coordinación del montaje | Caja negra mágica |
| Sonido | Resultado mediado | Canto literal |

## 7. Contrato de interacción

- Primera visita: orden secuencial obligatorio `PLANTA → BIONOSIFICADOR → ESP32 → MIDI → WI‑FI/UDP → ROUTER → SISTEMA CENTRAL → SONIDO`.
- Cada nodo correcto abre tarjeta técnica breve.
- Tocar un nodo bloqueado muestra orientación suave.
- No se omiten ni renombran nodos obligatorios.
- Completar los ocho nodos habilita cierre y avance hacia Mundo V.
- La explicación debe ser comprensible sin audio.

## 8. Secuencia narrativa por estados

| Orden | Estado | Acción del visitante | Cambio visible esperado | Función narrativa |
| --- | --- | --- | --- | --- |
| 0 | `w4_intro` | Entra a la mesa | Mesa y nodos apagados | Presentar cadena |
| 1 | `w4_planta_available` | Activa PLANTA | Nodo planta activo | Ubicar origen |
| 2 | `w4_bionosificador_available` | Activa BIONOSIFICADOR | Nodo bionosificador activo | Presentar mediación inicial |
| 3 | `w4_esp32_available` | Activa ESP32 | Nodo ESP32 activo | Explicar lectura/control |
| 4 | `w4_midi_available` | Activa MIDI | Nodo MIDI activo | Explicar lenguaje de control |
| 5 | `w4_wifi_udp_available` | Activa WI‑FI/UDP | Nodo red activo | Explicar comunicación local |
| 6 | `w4_router_available` | Activa ROUTER | Nodo router activo | Ordenar red local |
| 7 | `w4_sistema_central_available` | Activa SISTEMA CENTRAL | Nodo central activo | Coordinar montaje |
| 8 | `w4_sonido_available` | Activa SONIDO | Nodo sonido activo | Cerrar resultado mediado |
| X | `w4_node_locked` | Toca fuera de orden | Sin avance fuerte | Mantener secuencia |
| 9 | `w4_complete` | Toca continuar | Cadena completa | Pasar a Mundo V |

## 9. Estados de pantalla y necesidades de texto

| Estado | Qué ve / acaba de hacer | Texto requerido | Función | Evitar |
| --- | --- | --- | --- | --- |
| `w4_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Entrada (Lía) | Presentar que ahora se verá la cadena técnica completa. | Poetizar sin precisión |
| `w4_intro` | Escena inicial con Lía y elementos principales visibles. Ingreso a la pantalla. | Texto de orientación (Sistema / ambiente) | Situar la mesa como sistema conectado y ordenado. | Saturación técnica |
| `w4_planta_available` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar el nodo PLANTA. | Empezar en la máquina |
| `w4_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar la planta como origen vivo de la cadena. | Adorno |
| `w4_planta_active` | Elemento PLANTA disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que todo parte de la planta, no del sonido. | Sonido directo |
| `w4_bionosificador_available` | Elemento BIONOSIFICADOR disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar BIONOSIFICADOR. | Sensor genérico |
| `w4_bionosificador_active` | Elemento BIONOSIFICADOR disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar captura/acondicionamiento inicial de la señal. | Renombrarlo u omitirlo |
| `w4_bionosificador_active` | Elemento BIONOSIFICADOR disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que este nodo inicia la mediación técnica. | Magia |
| `w4_esp32_available` | Elemento ESP32 disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar ESP32. | Ocultar nodo clave |
| `w4_esp32_active` | Elemento ESP32 disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar el ESP32 como nodo de lectura/control. | Confundir con sonido final |
| `w4_esp32_active` | Elemento ESP32 disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que el dato necesita organización. | Automatismo mágico |
| `w4_midi_available` | Elemento MIDI disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar MIDI. | Audio directo |
| `w4_midi_active` | Elemento MIDI disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar MIDI como lenguaje de control/eventos musicales. | Confundir con sonido físico |
| `w4_midi_active` | Elemento MIDI disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que MIDI organiza eventos, no es la planta cantando. | Planta cantante |
| `w4_wifi_udp_available` | Elemento WIFI disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar Wi‑Fi/UDP. | Internet externo |
| `w4_wifi_udp_active` | Elemento WIFI disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar transmisión local de datos por red. | Prometer Internet |
| `w4_wifi_udp_active` | Elemento WIFI disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que los datos viajan dentro del montaje. | Nube/API externa |
| `w4_router_available` | Elemento ROUTER disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar ROUTER. | Internet como requisito |
| `w4_router_active` | Elemento ROUTER disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar el router como organizador de comunicación local. | Acceso externo |
| `w4_router_active` | Elemento ROUTER disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que la red mantiene ordenado el intercambio. | Red mágica |
| `w4_sistema_central_available` | Elemento SISTEMA disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar SISTEMA CENTRAL. | Omitir coordinación |
| `w4_sistema_central_active` | Elemento SISTEMA disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar recepción, coordinación y organización del montaje. | Caja negra mágica |
| `w4_sistema_central_active` | Elemento SISTEMA disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que el sistema reúne lo que la red transporta. | Salto directo al sonido |
| `w4_sonido_available` | Elemento SONIDO disponible o activo. Visitante sigue la secuencia indicada. | Instrucción contextual (Lía) | Invitar a activar SONIDO. | Planta emite sonido |
| `w4_sonido_active` | Elemento SONIDO disponible o activo. Visitante sigue la secuencia indicada. | Tarjeta técnica breve (Lía / sistema) | Explicar el sonido como resultado organizado y mediado. | Música directa de planta |
| `w4_sonido_active` | Elemento SONIDO disponible o activo. Visitante sigue la secuencia indicada. | Confirmación breve (Lía) | Confirmar que el resultado depende de toda la cadena. | Salto mágico |
| `w4_node_locked` | Elemento fuera de orden no avanza. Visitante tocó un elemento bloqueado. | Bloqueo suave (Sistema / Lía) | Mantener el orden de la cadena. | Regaño |
| `w4_node_locked` | Elemento ya revisado recibe nuevo toque. Visitante repite un elemento completado. | Relectura / repetición (Sistema / Lía) | Indicar que ese nodo ya fue revisado. | Error técnico |
| `w4_complete` | Pantalla completa con todos los pasos activados. Visitante completó la secuencia principal. | Cierre (Lía) | Cerrar cadena técnica y preparar síntesis espacial. | Reexplicar todo |
| `w4_complete` | Pantalla completa con todos los pasos activados. Visitante completó la secuencia principal. | Cierre ambiental (Sistema / ambiente) | Confirmar que los ocho nodos forman una sola operación. | Triunfalismo técnico |
| `w4_complete` | Botón de avance habilitado. Pantalla completada. | Botón (Sistema / interfaz) | Avanzar a transición hacia Mundo V. | Ambigüedad |
| `w4_intro` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir mesa, Lía, línea de flujo y ocho nodos. | Texto excesivo |
| `w4_planta_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de PLANTA. | Adorno |
| `w4_bionosificador_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de BIONOSIFICADOR. | Sensor genérico |
| `w4_esp32_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de ESP32. | Sonido final |
| `w4_midi_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de MIDI. | Audio directo |
| `w4_wifi_udp_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de Wi‑Fi/UDP. | Internet externo |
| `w4_router_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de ROUTER. | Nube/API externa |
| `w4_sistema_central_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de SISTEMA CENTRAL. | Caja negra mágica |
| `w4_sonido_active` | Estado visual activo requiere descripción accesible. Fallback o lector de pantalla requiere descripción. | Descripción accesible (Sistema / accesibilidad) | Describir activación de SONIDO. | Planta que canta |

## 10. Slots de texto requeridos

| ID | Estado | Emisor sugerido | Tipo de texto | Función del texto | Longitud sugerida | Concepto obligatorio | Evitar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W4_INTRO_LIA_01 | `w4_intro` | Lía | Entrada | Presentar que ahora se verá la cadena técnica completa. | 90-160 caracteres | Cadena técnica | Poetizar sin precisión |
| W4_INTRO_SYS_01 | `w4_intro` | Sistema / ambiente | Texto de orientación | Situar la mesa como sistema conectado y ordenado. | 50-120 caracteres | Sistema conectado | Saturación técnica |
| W4_PLANTA_HINT_01 | `w4_planta_available` | Lía | Instrucción contextual | Invitar a activar el nodo PLANTA. | 40-90 caracteres | Planta como origen | Empezar en la máquina |
| W4_PLANTA_CARD_01 | `w4_planta_active` | Lía / sistema | Tarjeta técnica breve | Explicar la planta como origen vivo de la cadena. | 70-140 caracteres | Planta | Adorno |
| W4_PLANTA_CONFIRM_01 | `w4_planta_active` | Lía | Confirmación breve | Confirmar que todo parte de la planta, no del sonido. | 40-100 caracteres | Origen vivo | Sonido directo |
| W4_BIONOSIFICADOR_HINT_01 | `w4_bionosificador_available` | Lía | Instrucción contextual | Invitar a activar BIONOSIFICADOR. | 40-100 caracteres | Bionosificador | Sensor genérico |
| W4_BIONOSIFICADOR_CARD_01 | `w4_bionosificador_active` | Lía / sistema | Tarjeta técnica breve | Explicar captura/acondicionamiento inicial de la señal. | 70-150 caracteres | Bionosificador | Renombrarlo u omitirlo |
| W4_BIONOSIFICADOR_CONFIRM_01 | `w4_bionosificador_active` | Lía | Confirmación breve | Confirmar que este nodo inicia la mediación técnica. | 50-110 caracteres | Mediación técnica | Magia |
| W4_ESP32_HINT_01 | `w4_esp32_available` | Lía | Instrucción contextual | Invitar a activar ESP32. | 40-90 caracteres | ESP32 | Ocultar nodo clave |
| W4_ESP32_CARD_01 | `w4_esp32_active` | Lía / sistema | Tarjeta técnica breve | Explicar el ESP32 como nodo de lectura/control. | 70-140 caracteres | ESP32 | Confundir con sonido final |
| W4_ESP32_CONFIRM_01 | `w4_esp32_active` | Lía | Confirmación breve | Confirmar que el dato necesita organización. | 40-100 caracteres | Lectura/control | Automatismo mágico |
| W4_MIDI_HINT_01 | `w4_midi_available` | Lía | Instrucción contextual | Invitar a activar MIDI. | 40-90 caracteres | MIDI | Audio directo |
| W4_MIDI_CARD_01 | `w4_midi_active` | Lía / sistema | Tarjeta técnica breve | Explicar MIDI como lenguaje de control/eventos musicales. | 70-150 caracteres | MIDI | Confundir con sonido físico |
| W4_MIDI_CONFIRM_01 | `w4_midi_active` | Lía | Confirmación breve | Confirmar que MIDI organiza eventos, no es la planta cantando. | 50-120 caracteres | Control musical | Planta cantante |
| W4_WIFI_UDP_HINT_01 | `w4_wifi_udp_available` | Lía | Instrucción contextual | Invitar a activar Wi‑Fi/UDP. | 40-100 caracteres | Wi‑Fi/UDP | Internet externo |
| W4_WIFI_UDP_CARD_01 | `w4_wifi_udp_active` | Lía / sistema | Tarjeta técnica breve | Explicar transmisión local de datos por red. | 70-150 caracteres | Red local / UDP | Prometer Internet |
| W4_WIFI_UDP_CONFIRM_01 | `w4_wifi_udp_active` | Lía | Confirmación breve | Confirmar que los datos viajan dentro del montaje. | 50-110 caracteres | Comunicación local | Nube/API externa |
| W4_ROUTER_HINT_01 | `w4_router_available` | Lía | Instrucción contextual | Invitar a activar ROUTER. | 40-90 caracteres | Router | Internet como requisito |
| W4_ROUTER_CARD_01 | `w4_router_active` | Lía / sistema | Tarjeta técnica breve | Explicar el router como organizador de comunicación local. | 70-150 caracteres | Router | Acceso externo |
| W4_ROUTER_CONFIRM_01 | `w4_router_active` | Lía | Confirmación breve | Confirmar que la red mantiene ordenado el intercambio. | 50-110 caracteres | Red ordenada | Red mágica |
| W4_SISTEMA_CENTRAL_HINT_01 | `w4_sistema_central_available` | Lía | Instrucción contextual | Invitar a activar SISTEMA CENTRAL. | 40-100 caracteres | Sistema central | Omitir coordinación |
| W4_SISTEMA_CENTRAL_CARD_01 | `w4_sistema_central_active` | Lía / sistema | Tarjeta técnica breve | Explicar recepción, coordinación y organización del montaje. | 70-150 caracteres | Sistema central | Caja negra mágica |
| W4_SISTEMA_CENTRAL_CONFIRM_01 | `w4_sistema_central_active` | Lía | Confirmación breve | Confirmar que el sistema reúne lo que la red transporta. | 50-120 caracteres | Coordinación | Salto directo al sonido |
| W4_SONIDO_HINT_01 | `w4_sonido_available` | Lía | Instrucción contextual | Invitar a activar SONIDO. | 40-90 caracteres | Sonido mediado | Planta emite sonido |
| W4_SONIDO_CARD_01 | `w4_sonido_active` | Lía / sistema | Tarjeta técnica breve | Explicar el sonido como resultado organizado y mediado. | 70-150 caracteres | Resultado sonoro mediado | Música directa de planta |
| W4_SONIDO_CONFIRM_01 | `w4_sonido_active` | Lía | Confirmación breve | Confirmar que el resultado depende de toda la cadena. | 50-120 caracteres | Cadena completa | Salto mágico |
| W4_NODE_LOCKED_01 | `w4_node_locked` | Sistema / Lía | Bloqueo suave | Mantener el orden de la cadena. | 35-90 caracteres | Cadena técnica ordenada | Regaño |
| W4_NODE_REPEAT_01 | `w4_node_locked` | Sistema / Lía | Relectura / repetición | Indicar que ese nodo ya fue revisado. | 35-90 caracteres | Revisión de cadena | Error técnico |
| W4_COMPLETE_LIA_01 | `w4_complete` | Lía | Cierre | Cerrar cadena técnica y preparar síntesis espacial. | 90-160 caracteres | Mediación técnica completa | Reexplicar todo |
| W4_COMPLETE_SYS_01 | `w4_complete` | Sistema / ambiente | Cierre ambiental | Confirmar que los ocho nodos forman una sola operación. | 60-130 caracteres | Sistema completo | Triunfalismo técnico |
| W4_CONTINUE_BTN_01 | `w4_complete` | Sistema / interfaz | Botón | Avanzar a transición hacia Mundo V. | 1-4 palabras | Avance secuencial | Ambigüedad |
| W4_ACCESSIBLE_SCENE_01 | `w4_intro` | Sistema / accesibilidad | Descripción accesible | Describir mesa, Lía, línea de flujo y ocho nodos. | 90-180 caracteres | Mesa / cadena | Texto excesivo |
| W4_ACCESSIBLE_PLANTA_01 | `w4_planta_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de PLANTA. | 70-140 caracteres | Planta | Adorno |
| W4_ACCESSIBLE_BIONOSIFICADOR_01 | `w4_bionosificador_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de BIONOSIFICADOR. | 70-150 caracteres | Bionosificador | Sensor genérico |
| W4_ACCESSIBLE_ESP32_01 | `w4_esp32_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de ESP32. | 70-140 caracteres | ESP32 | Sonido final |
| W4_ACCESSIBLE_MIDI_01 | `w4_midi_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de MIDI. | 70-140 caracteres | MIDI | Audio directo |
| W4_ACCESSIBLE_WIFI_UDP_01 | `w4_wifi_udp_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de Wi‑Fi/UDP. | 70-150 caracteres | Wi‑Fi/UDP | Internet externo |
| W4_ACCESSIBLE_ROUTER_01 | `w4_router_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de ROUTER. | 70-140 caracteres | Router | Nube/API externa |
| W4_ACCESSIBLE_SISTEMA_CENTRAL_01 | `w4_sistema_central_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de SISTEMA CENTRAL. | 70-160 caracteres | Sistema central | Caja negra mágica |
| W4_ACCESSIBLE_SONIDO_01 | `w4_sonido_active` | Sistema / accesibilidad | Descripción accesible | Describir activación de SONIDO. | 70-150 caracteres | Sonido mediado | Planta que canta |

## 11. Conceptos protegidos

- cadena técnica.
- planta.
- bionosificador.
- ESP32.
- MIDI.
- Wi‑Fi/UDP.
- router.
- sistema central.
- sonido mediado.
- red local.

## 12. Conceptos a evitar o tratar con cuidado

- saltar nodos.
- renombrar bionosificador como sensor genérico.
- planta que emite sonido directo.
- texto saturado.
- internet externo.
- poetizar sin precisión.

## 13. Pautas de accesibilidad y público general

- Público mixto: niños, adolescentes, adultos y ancianos.
- Textos legibles en pantalla móvil.
- Frases breves, sin dependencia de tecnicismos innecesarios.
- Microcopy de acción claro para avances, bloqueos, repetición y cierre.
- Descripciones accesibles útiles para fallback o lector de pantalla.
- La experiencia debe entenderse sin audio.

## 14. Relación con estación anterior y siguiente

Viene de Mundo III, donde el visitante vio pruebas y ajustes. Prepara Mundo V, donde la cadena deja de verse como diagrama técnico y se integra en el montaje presente.

## 15. Checklist específico de aprobación

- [ ] Los ocho nodos obligatorios aparecen en orden.
- [ ] Bionosificador conserva su nombre.
- [ ] Wi‑Fi/UDP y router se explican como red local.
- [ ] MIDI no se presenta como audio físico.
- [ ] El sonido queda como resultado mediado.
- [ ] La lectura es clara para público general.
- [ ] El escritor conserva libertad autoral dentro de la función de cada slot.
