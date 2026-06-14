# 011A - Mundo IV experiencia temporal completa

Fecha: 2026-06-14

## 1. Proposito

Convertir `/estacion/4` de entrada base preliminar a experiencia funcional temporal completa de Mundo IV / Estacion IV - Mesa de Sistema.

La experiencia implementada es navegable e interactiva, pero no editorial final. Todos los textos nuevos usan slots editoriales reales con `status: "TEMP"` y `source: "temporary"` para permitir reemplazo futuro desde Excel editorial.

## 2. Alcance

Incluido:

- Experiencia temporal interactiva de Mundo IV.
- Secuencia `intro -> planta -> bionosificador -> esp32 -> midi -> wifi_udp -> router -> sistema_central -> sonido -> ready_to_continue`.
- Ocho nodos tecnicos protegidos en orden exacto.
- Bloqueos suaves para nodos futuros.
- Relectura de nodos completados.
- Boton `Continuar` visible en `ready_to_continue`.
- Salida W4->W5 marcada como preparada para 011B sin navegacion y sin construir Mundo V.
- 40 slots editoriales temporales de Mundo IV.
- Tests enfocados y validacion local en navegador.

Excluido:

- Mundo V real.
- Transicion W4->W5 funcional.
- Slots editoriales de Mundo V.
- Importacion de Excel.
- Selector visible ES/EN.
- Contador diario.
- QR/camara reales.
- Permisos sensibles.
- Assets nuevos o modificados.
- Cambios de dependencias, lockfiles, baseline o configuracion.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimo commit sincronizado al iniciar:

```text
1dea327 feat: prepare W3 W4 transition and Mundo IV entry 010B
```

## 4. Arquitectura previa

Antes de 011A, `/estacion/4` cargaba una entrada base preliminar con tres slots:

- `W4_INTRO_LIA_01`
- `W4_INTRO_SYS_01`
- `W4_ACCESSIBLE_SCENE_01`

La pantalla presentaba la Mesa de Sistema como base, pero no tenia progresion interactiva completa ni los 40 slots de Mundo IV.

## 5. Arquitectura nueva de Mundo IV

`World4RootScreen` ahora usa estado interno temporal con:

- raiz `data-world4-experience="temporary"`;
- fuente editorial `data-world4-editorial-source="excel_pending"`;
- contador de slots `data-world4-slot-count="40"`;
- experiencia completa temporal `data-world4-full-experience="temporary_complete"`;
- permisos sensibles bloqueados;
- QR/camara bloqueados;
- contador diario no implementado;
- salida preparada `data-world4-exit-target="/transition/world-4-to-world-5"`;
- salida sin navegacion `data-world4-exit-mode="prepared_no_navigation"`.

## 6. Estados y nodos implementados

| Estado | Nodo visible | Funcion |
|---|---|---|
| `intro` | Intro | Presenta la Mesa de Sistema como cadena tecnica temporal. |
| `planta` | `PLANTA` | Origen vivo de la senal. |
| `bionosificador` | `BIONOSIFICADOR` | Primer mediador tecnico. |
| `esp32` | `ESP32` | Entrada de datos al flujo digital. |
| `midi` | `MIDI` | Organizacion de informacion como eventos. |
| `wifi_udp` | `WI-FI/UDP` | Transporte de datos. |
| `router` | `ROUTER` | Paso de datos entre puntos del sistema. |
| `sistema_central` | `SISTEMA CENTRAL` | Reune informacion y organiza respuesta. |
| `sonido` | `SONIDO` | Resultado mediado de la cadena. |
| `ready_to_continue` | Cierre | Muestra cierre temporal y boton `Continuar` preparado para 011B. |

## 7. Slots editoriales cubiertos

Se cubren los 40 slots obligatorios de Mundo IV. Todos quedan resueltos desde el registry editorial con `locale: "es"`, `status: "TEMP"` y `source: "temporary"`.

## 8. Matriz obligatoria - Slots Mundo IV

| Slot ID | Funcion temporal | Estado/nodo | Texto temporal | Reemplazable por Excel | Riesgo conceptual |
|---|---|---|---|---|---|
| `W4_INTRO_LIA_01` | Introduccion de Lia | `intro` | TEMP - Esta mesa muestra como la senal recorre el sistema completo. | Si | Bajo: no promete audio real. |
| `W4_INTRO_SYS_01` | Introduccion de sistema | `intro` | TEMP - La cadena ordena ocho pasos: PLANTA, BIONOSIFICADOR, ESP32, MIDI, WI-FI/UDP, ROUTER, SISTEMA CENTRAL y SONIDO. | Si | Bajo: preserva nodos exactos. |
| `W4_ACCESSIBLE_SCENE_01` | Descripcion accesible | `intro` | TEMP - Entrada visual a Mundo IV, presentada como una mesa tecnica con ocho nodos ordenados. | Si | Bajo. |
| `W4_PLANTA_HINT_01` | Guia de nodo | `planta` | TEMP - Comienza por la planta como origen vivo de la senal. | Si | Bajo: no dice que la planta canta. |
| `W4_PLANTA_CARD_01` | Tarjeta de nodo | `planta` | TEMP - La planta inicia el recorrido: no produce musica directa, genera una senal que debe ser mediada. | Si | Bajo: protege contra musica directa. |
| `W4_PLANTA_CONFIRM_01` | Confirmacion | `planta` | TEMP - Nodo PLANTA registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_PLANTA_01` | Accesible | `planta` | TEMP - Nodo PLANTA: origen vivo de una senal que requiere mediacion tecnica. | Si | Bajo. |
| `W4_BIONOSIFICADOR_HINT_01` | Guia de nodo | `bionosificador` | TEMP - Revisa el BIONOSIFICADOR como primer mediador tecnico. | Si | Bajo: conserva termino protegido. |
| `W4_BIONOSIFICADOR_CARD_01` | Tarjeta de nodo | `bionosificador` | TEMP - El BIONOSIFICADOR prepara la senal para que el sistema pueda interpretarla. | Si | Bajo. |
| `W4_BIONOSIFICADOR_CONFIRM_01` | Confirmacion | `bionosificador` | TEMP - Nodo BIONOSIFICADOR registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_BIONOSIFICADOR_01` | Accesible | `bionosificador` | TEMP - Nodo BIONOSIFICADOR: mediacion inicial que prepara la senal para interpretacion. | Si | Bajo. |
| `W4_ESP32_HINT_01` | Guia de nodo | `esp32` | TEMP - Sigue la senal hacia el ESP32. | Si | Bajo. |
| `W4_ESP32_CARD_01` | Tarjeta de nodo | `esp32` | TEMP - El ESP32 recibe datos y permite que la senal entre al flujo digital. | Si | Bajo. |
| `W4_ESP32_CONFIRM_01` | Confirmacion | `esp32` | TEMP - Nodo ESP32 registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_ESP32_01` | Accesible | `esp32` | TEMP - Nodo ESP32: entrada digital de datos dentro de la cadena tecnica. | Si | Bajo. |
| `W4_MIDI_HINT_01` | Guia de nodo | `midi` | TEMP - Observa el paso hacia MIDI. | Si | Bajo. |
| `W4_MIDI_CARD_01` | Tarjeta de nodo | `midi` | TEMP - MIDI organiza la informacion como eventos que el sistema puede usar. | Si | Bajo. |
| `W4_MIDI_CONFIRM_01` | Confirmacion | `midi` | TEMP - Nodo MIDI registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_MIDI_01` | Accesible | `midi` | TEMP - Nodo MIDI: organizacion de datos como eventos utilizables por el sistema. | Si | Bajo. |
| `W4_WIFI_UDP_HINT_01` | Guia de nodo | `wifi_udp` | TEMP - Revisa el envio por WI-FI/UDP. | Si | Bajo: conserva nombre exacto. |
| `W4_WIFI_UDP_CARD_01` | Tarjeta de nodo | `wifi_udp` | TEMP - WI-FI/UDP transporta los datos para mantener la cadena en movimiento. | Si | Bajo: no promete Internet. |
| `W4_WIFI_UDP_CONFIRM_01` | Confirmacion | `wifi_udp` | TEMP - Nodo WI-FI/UDP registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_WIFI_UDP_01` | Accesible | `wifi_udp` | TEMP - Nodo WI-FI/UDP: transporte de datos dentro de la cadena temporal. | Si | Bajo. |
| `W4_ROUTER_HINT_01` | Guia de nodo | `router` | TEMP - Ubica el ROUTER dentro del recorrido. | Si | Bajo. |
| `W4_ROUTER_CARD_01` | Tarjeta de nodo | `router` | TEMP - El ROUTER sostiene el paso de datos entre los puntos del sistema. | Si | Bajo. |
| `W4_ROUTER_CONFIRM_01` | Confirmacion | `router` | TEMP - Nodo ROUTER registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_ROUTER_01` | Accesible | `router` | TEMP - Nodo ROUTER: punto que sostiene el paso de datos en el recorrido. | Si | Bajo. |
| `W4_SISTEMA_CENTRAL_HINT_01` | Guia de nodo | `sistema_central` | TEMP - Revisa como llega la senal al SISTEMA CENTRAL. | Si | Bajo: conserva nombre exacto. |
| `W4_SISTEMA_CENTRAL_CARD_01` | Tarjeta de nodo | `sistema_central` | TEMP - El SISTEMA CENTRAL reune la informacion y organiza la respuesta. | Si | Bajo. |
| `W4_SISTEMA_CENTRAL_CONFIRM_01` | Confirmacion | `sistema_central` | TEMP - Nodo SISTEMA CENTRAL registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_SISTEMA_CENTRAL_01` | Accesible | `sistema_central` | TEMP - Nodo SISTEMA CENTRAL: reunion de datos y organizacion de la respuesta. | Si | Bajo. |
| `W4_SONIDO_HINT_01` | Guia de nodo | `sonido` | TEMP - Cierra la cadena observando el SONIDO. | Si | Bajo. |
| `W4_SONIDO_CARD_01` | Tarjeta de nodo | `sonido` | TEMP - El SONIDO es el resultado mediado de la cadena, no una voz directa de la planta. | Si | Bajo: no promete canto literal. |
| `W4_SONIDO_CONFIRM_01` | Confirmacion | `sonido` | TEMP - Nodo SONIDO registrado. | Si | Bajo. |
| `W4_ACCESSIBLE_SONIDO_01` | Accesible | `sonido` | TEMP - Nodo SONIDO: resultado mediado de la cadena tecnica completa. | Si | Bajo. |
| `W4_NODE_LOCKED_01` | Bloqueo suave | Nodos futuros | TEMP - Antes de abrir este nodo, revisa el paso anterior. | Si | Bajo. |
| `W4_NODE_REPEAT_01` | Relectura | Nodos completados | TEMP - Puedes volver a leer este nodo antes de continuar. | Si | Bajo. |
| `W4_COMPLETE_LIA_01` | Cierre de Lia | `ready_to_continue` | TEMP - La cadena ya muestra como una senal se convierte en experiencia organizada. | Si | Bajo. |
| `W4_COMPLETE_SYS_01` | Cierre de sistema | `ready_to_continue` | TEMP - Recorrido tecnico completo registrado. | Si | Bajo. |
| `W4_CONTINUE_BTN_01` | Boton de continuidad | `ready_to_continue` | Continuar | Si | Bajo: preparado, sin construir Mundo V. |

## 9. Textos temporales agregados

Todos los textos agregados son temporales, estan asociados a slots reales y se cargan desde el registry editorial. No son copy final.

## 10. Confirmaciones editoriales

| Confirmacion | Estado |
|---|---|
| Textos no finales | Confirmado. Son `TEMP`. |
| Excel como fuente final futura | Confirmado. Mundo IV declara `excel_pending`. |
| ES/EN visible no implementado | Confirmado. No se agrego selector de idioma. |
| Contador diario no implementado | Confirmado. No se agregaron eventos, tracking, base de datos ni archivos operativos. |
| Mundo V no construido | Confirmado. Solo se deja salida preparada para 011B. |
| Ocho nodos tecnicos exactos | Confirmado. Se mantienen `PLANTA`, `BIONOSIFICADOR`, `ESP32`, `MIDI`, `WI-FI/UDP`, `ROUTER`, `SISTEMA CENTRAL`, `SONIDO`. |

## 11. Matriz obligatoria - Cambios

| Area | Archivo | Cambio aplicado | Motivo | Riesgo | Validacion |
|---|---|---|---|---|---|
| World4RootScreen | `src/screens/World4Root/World4RootScreen.tsx` | Entrada base reemplazada por experiencia temporal completa. | Cumplir 011A. | Medio: cambio runtime de pantalla viva. | `npm run test -- World4RootScreen`, browser local. |
| Estados/nodos Mundo IV | `src/content/world4EditorialSlots.ts` | Definicion de 40 slots y 8 nodos. | Contrato editorial/funcional. | Bajo. | Test Mundo IV. |
| Contenido temporal | `src/content/editorial/editorialRegistry.ts` | Slots `W4_*` temporales. | Sustitucion futura por Excel. | Medio-bajo: copy temporal. | `npm run test -- editorial`. |
| Nodos tecnicos protegidos | `src/content/world4EditorialSlots.ts` | Lista exacta de 8 nodos. | Evitar omisiones o renombres. | Bajo. | Browser local y test unitario. |
| Bloqueos suaves | `src/screens/World4Root/World4RootScreen.tsx` | Nodos futuros deshabilitados hasta completar anterior. | Guiar secuencia obligatoria. | Bajo. | Browser local y test unitario. |
| Relectura/repeticion | `src/screens/World4Root/World4RootScreen.tsx` | Nodos completados siguen seleccionables sin romper cierre. | Permitir revision. | Bajo. | Browser local y test unitario. |
| Ready to continue | `src/screens/World4Root/World4RootScreen.tsx` | Estado final y salida preparada. | Cerrar Mundo IV temporal. | Bajo. | Browser local. |
| Salida Mundo IV | `src/screens/World4Root/World4RootScreen.tsx` | `Continuar` preparado para 011B sin navegacion. | No construir Mundo V en 011A. | Bajo. | Browser local. |
| QR/camara | `src/screens/World4Root/World4RootScreen.tsx` | Atributos declarativos `blocked`. | Evidenciar bloqueo. | Bajo. | Browser local. |
| Assets runtime | No aplica | No se crearon ni modificaron assets. | Mantener alcance. | Bajo. | `git diff --name-only`. |
| Gates parciales | Tests y lint autorizados | Se ejecutaron solo gates permitidos. | Probar sin baseline completo. | Bajo. | Ver validaciones. |

## 12. Matriz obligatoria - Validacion

| Ruta | Resultado esperado | Resultado observado | Consola | Permisos sensibles | Estado |
|---|---|---|---|---|---|
| `/` | Carga inicial local. | Renderiza `Preparando el recorrido`. | Sin error JS; 404 residual de recurso estatico del dev server. | No solicitados. | PASS con advertencia favicon/recurso estatico. |
| `/portada` | Portada viva. | Carga portada OKUA. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/transition/intro-to-station-1` | Transicion a Mundo I. | Renderiza `Abriendo Mundo I: Raiz`. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/estacion/1` | Mundo I operativo. | Flujo de raiz completado. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/transition/world-1-to-world-2` | Transicion W1->W2. | Renderiza `Abriendo Mundo II`. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/estacion/2` | Mundo II operativo. | Capas completadas hasta salida W2->W3. | Sin error JS; 404 residual de recurso estatico. | `blocked`. | PASS con advertencia residual. |
| `/transition/world-2-to-world-3` | Transicion W2->W3. | Renderiza `TEMP - Abriendo Mundo III`. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/estacion/3` | Mundo III operativo. | Bloques completados hasta salida W3->W4. | Sin error JS; 404 residual de recurso estatico. | `blocked`. | PASS con advertencia residual. |
| `/transition/world-3-to-world-4` | Transicion W3->W4. | Renderiza `TEMP - Abriendo Mundo IV`. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |
| `/estacion/4` | Mundo IV temporal completo. | 40 slots, 8 nodos, `ready_to_continue`. | Sin error JS; 404 residual de recurso estatico. | `blocked`. | PASS con advertencia residual. |
| `/qr/1` | Placeholder QR sin camara real. | Carga placeholder sin pedir permisos. | Sin error JS; 404 residual de recurso estatico. | No solicitados. | PASS con advertencia residual. |

## 13. Resultado del flujo manual

Flujo validado en Chrome local contra `http://127.0.0.1:5173`:

```text
/estacion/1
-> completar Mundo I
-> /transition/world-1-to-world-2
-> /estacion/2
-> completar Mundo II
-> /transition/world-2-to-world-3
-> /estacion/3
-> completar Mundo III
-> /transition/world-3-to-world-4
-> /estacion/4
-> completar Mundo IV
-> ready_to_continue
```

Resultado:

- Mundo I sigue funcionando.
- Transicion W1->W2 sigue funcionando.
- Mundo II sigue funcionando.
- Transicion W2->W3 sigue funcionando.
- Mundo III sigue funcionando.
- Transicion W3->W4 sigue funcionando.
- Mundo IV carga como experiencia temporal completa.
- Mundo IV respeta exactamente los ocho nodos tecnicos.
- Mundo IV avanza por la secuencia esperada.
- Bloqueo suave verificado: `BIONOSIFICADOR` inicia bloqueado.
- Relectura verificada despues de completar la cadena.
- `ready_to_continue` alcanzado.
- Boton `Continuar` visible y preparado sin navegacion.
- No se activo QR/camara.
- No se solicitaron permisos sensibles.

## 14. Resultado visual mobile

Se valido `/estacion/4` con viewport `390x844`.

Resultado:

- sin overflow horizontal;
- `data-world4-state="intro"` al cargar;
- `data-world4-slot-count="40"`;
- `data-world4-full-experience="temporary_complete"`;
- `img`, `audio`, `video`, `canvas` e `iframe`: `0`;
- QR/camara y permisos sensibles declarados como `blocked`.

## 15. Resultado visual desktop

Se valido `/estacion/4` con viewport `1366x768`.

Resultado:

- sin overflow horizontal;
- experiencia temporal visible;
- nodos organizados en grilla responsive;
- sin assets nuevos ni medios runtime.

## 16. Resultado de consola

Chrome local reporto un 404 residual de recurso estatico del dev server. No se detectaron errores JS de runtime ni `pageerror`.

## 17. Confirmacion QR/camara

No se activo QR real, no se activo camara y no se solicitaron permisos sensibles.

## 18. Gates parciales ejecutados

| Gate | Resultado |
|---|---|
| `git diff --check` | PASS, sin errores; advertencias LF/CRLF normales de Git en Windows. |
| `npm run test -- editorial` | PASS, 1 archivo, 6 tests. |
| `npm run test -- TransitionWorld` | PASS, 1 archivo, 13 tests. |
| `npm run test -- World4RootScreen` | PASS, 1 archivo, 3 tests. |
| `npm run lint` | PASS, ESLint sin errores. |
| Browser local Chrome | PASS, rutas y flujo manual completo. |
| Servidor local | PASS, puerto 5173 sin listener final. |

## 19. Gates no ejecutados

No se ejecutaron:

- `npm run build`
- `npm run check`
- `npm run format`
- `npm audit`
- `npm install`
- `npm update`
- `npx`
- baseline completo
- `pre-commit`
- `gitleaks`
- `scripts/run_security_checks.ps1`
- Graphify
- SkillCheck
- Claude Code
- Spec-kit
- Gstack
- Claude Council
- MCP

## 20. Riesgos residuales

- Mundo IV sigue siendo experiencia temporal, no version editorial final.
- Los textos `TEMP` deben reemplazarse desde Excel editorial en un ticket posterior.
- La salida W4->W5 queda preparada pero no navega; requiere 011B.
- 404 residual de recurso estatico del dev server sigue apareciendo como advertencia de consola, sin error JS de runtime.

## 21. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| `011A-PUSH` | Sincronizar experiencia temporal Mundo IV. | Publica el avance aprobado. | Bajo si el working tree queda limpio. | Recomendada despues de aprobacion y commit. | `011A-PUSH` |
| `011B` | Disenar transicion W4->W5 y entrada Mundo V. | Conecta la continuidad preparada. | Medio: no construir Mundo V completo sin ticket. | Recomendada despues del push. | `011B` |
| `011C` | Preparar importacion futura del Excel editorial. | Ordena sustitucion de textos TEMP. | Medio: tocar arquitectura editorial. | Alternativa si se pausa runtime. | `011C` |
| `011D` | Prototipo controlado de contador diario sin QR real. | Avanza arquitectura de uso. | Medio-alto: evitar tracking real prematuro. | No antes de cerrar continuidad W4. | `011D` |
| `008I` | Preparar entorno externo de seguridad. | Mejora validacion fuera de GVO. | Bajo si permanece externo. | Opcional, no bloquea 011A. | `008I` |

## 22. Siguiente paso recomendado

```text
011A-PUSH — Sincronizar experiencia temporal Mundo IV
```

Despues de sincronizar, decidir entre:

```text
011B — Diseñar transición W4→W5 y entrada Mundo V
```

o:

```text
011C — Preparar importación futura del Excel editorial
```
