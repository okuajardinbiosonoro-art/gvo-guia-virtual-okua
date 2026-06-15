# 011B - Transicion W4->W5 y entrada Mundo V

Fecha: 2026-06-14

## 1. Proposito

Preparar el tramo controlado de salida de Mundo IV hacia Mundo V sin construir la experiencia completa de Mundo V.

El ticket deja operativa la transicion temporal `/transition/world-4-to-world-5` y registra `/estacion/5` como entrada base preliminar llamada `Mundo V: Mapa del Presente`.

## 2. Alcance

Incluido:

- Transicion W4->W5 configurada con slots `TRANS_W4_W5_TITLE_01` y `TRANS_W4_W5_SUB_01`.
- Salida de Mundo IV desde estado `ready_to_continue` hacia `/transition/world-4-to-world-5`.
- Ruta explicita `/estacion/5` antes del placeholder generico de estaciones.
- Pantalla base `World5RootScreen`.
- Tres slots temporales minimos de Mundo V.
- Cuatro areas conceptuales protegidas: `PLANTAS`, `SISTEMA`, `ESPACIO`, `VISITANTE`.
- Tests enfocados, suite completa, lint y validacion local en navegador.

Excluido:

- Experiencia completa de Mundo V.
- Veinticuatro slots completos de Mundo V.
- Pantalla final.
- Importacion de Excel.
- Selector visible ES/EN.
- Contador diario.
- QR/camara reales.
- Permisos sensibles.
- Nuevos assets, nuevos recursos externos, CDN, audio o video.
- Cambios de dependencias, lockfiles, baseline, pre-commit, gitleaks o configuracion.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimo commit sincronizado al iniciar:

```text
07bf5ad feat: build Mundo IV temporary experience 011A
```

## 4. Arquitectura previa

Antes de 011B, Mundo IV exponia `ready_to_continue` y anunciaba la salida W4->W5, pero el boton `Continuar` solo registraba continuidad local. La ruta `/transition/world-4-to-world-5` aun no estaba registrada en el router y `/estacion/5` caia en el placeholder generico.

## 5. Arquitectura nueva

Flujo vivo preparado:

```text
/estacion/4
-> completar Mundo IV
-> ready_to_continue
-> Continuar
-> /transition/world-4-to-world-5
-> /estacion/5
```

`/estacion/5` ahora resuelve explicitamente a `World5RootScreen` y expone:

- `data-world5-experience="base_entry"`;
- `data-world5-editorial-source="excel_pending"`;
- `data-world5-state="entry_preliminary"`;
- `data-world5-slot-count="3"`;
- `data-world5-full-experience="not_implemented"`;
- `data-sensitive-permissions="blocked"`;
- `data-qr-camera="blocked"`;
- `data-daily-counter="not_implemented"`.

## 6. Slots editoriales de transicion

| Slot ID | Texto temporal | Estado | Reemplazable por Excel |
|---|---|---|---|
| `TRANS_W4_W5_TITLE_01` | `TEMP — Abriendo Mundo V` | `TEMP` | Si |
| `TRANS_W4_W5_SUB_01` | `TEMP — Preparando el mapa del presente.` | `TEMP` | Si |

## 7. Slots minimos Mundo V

| Slot ID | Emisor | Texto temporal | Funcion |
|---|---|---|---|
| `W5_INTRO_LIA_01` | `lia` | `TEMP — Este mapa reúne lo que ya viste: plantas, sistema, espacio y visitante.` | Introduccion de Lia al mapa del presente. |
| `W5_INTRO_AMB_01` | `ambiente` | `TEMP — El presente de OKÚA aparece como un montaje vivo, no como una sola pieza aislada.` | Contexto ambiental de la entrada base. |
| `W5_ACCESSIBLE_SCENE_01` | `interfaz` | `TEMP — Entrada visual a Mundo V, presentada como un mapa del presente con cuatro áreas: plantas, sistema, espacio y visitante.` | Descripcion accesible de la escena base. |

## 8. Areas protegidas de Mundo V

| Orden | Area | Estado |
|---|---|---|
| 01 | `PLANTAS` | Visible como area declarativa de la entrada base. |
| 02 | `SISTEMA` | Visible como area declarativa de la entrada base. |
| 03 | `ESPACIO` | Visible como area declarativa de la entrada base. |
| 04 | `VISITANTE` | Visible como area declarativa de la entrada base. |

Mundo V no repite la cadena tecnica completa de Mundo IV. La validacion confirma ausencia de `BIONOSIFICADOR`, `ESP32`, `MIDI`, `WI-FI/UDP`, `ROUTER`, `SISTEMA CENTRAL` y `SONIDO` dentro de `/estacion/5`.

## 9. Matriz de cambios

| Area | Archivo | Cambio aplicado | Riesgo | Validacion |
|---|---|---|---|---|
| Rutas | `src/app/routes.ts` | Agrega `/transition/world-4-to-world-5` y `/estacion/5`. | Bajo-medio: nuevas rutas vivas. | Browser smoke y tests. |
| Router | `src/app/router.tsx` | Registra transicion W4->W5 y `World5RootScreen`. | Medio: orden antes del placeholder generico. | Browser smoke. |
| Registro editorial | `src/content/editorial/editorialRegistry.ts` | Agrega slots W4->W5 y slots minimos W5. | Bajo: textos TEMP. | `npm run test -- editorialRegistry`. |
| Slots de transicion | `src/content/transitionEditorialSlots.ts` | Expone copy temporal W4->W5. | Bajo. | `npm run test -- TransitionWorld`. |
| Slots Mundo V | `src/content/world5EditorialSlots.ts` | Define tres slots W5 y cuatro areas protegidas. | Bajo. | `npm run test -- World5RootScreen`. |
| Transicion | `src/screens/TransitionWorld/transitionWorld.config.ts` | Agrega config `world-4-to-world-5`. | Bajo. | `npm run test -- TransitionWorld`. |
| Mundo IV | `src/screens/World4Root/World4RootScreen.tsx` | Cambia `Continuar` de registro local a navegacion W4->W5. | Medio: cambia salida funcional. | Test unitario y browser flow. |
| Mundo V | `src/screens/World5Root/World5RootScreen.tsx` | Crea entrada base preliminar. | Medio-bajo: nueva pantalla viva. | Test unitario y browser flow. |
| Estilos Mundo V | `src/screens/World5Root/World5RootScreen.css` | Layout mobile-first sin assets ni medios. | Bajo. | Browser mobile/desktop. |
| Export Mundo V | `src/screens/World5Root/index.ts` | Expone `World5RootScreen`. | Bajo. | Lint. |
| Tests | Archivos `*.test.tsx` y `editorialRegistry.test.ts` | Cubre nuevo contrato W4->W5/W5. | Bajo. | Tests enfocados y suite completa. |

## 10. Matriz de rutas validadas

| Ruta | Resultado esperado | Resultado observado | Estado |
|---|---|---|---|
| `/` | Carga inicial local. | Renderiza `Preparando el recorrido`. | PASS |
| `/portada?resetIntro=1` | Portada viva. | Redirige a `/portada` y carga OKUA. | PASS |
| `/transition/intro-to-station-1` | Transicion a Mundo I. | Renderiza `Abriendo Mundo I: Raíz`. | PASS |
| `/estacion/1` | Mundo I operativo. | Carga `Mundo I: Raíz`. | PASS |
| `/transition/world-1-to-world-2` | Transicion W1->W2. | Renderiza `Abriendo Mundo II`. | PASS |
| `/estacion/2` | Mundo II operativo. | Carga `Mundo II: Lía y el pulso invisible`. | PASS |
| `/transition/world-2-to-world-3` | Transicion W2->W3. | Renderiza `TEMP — Abriendo Mundo III`. | PASS |
| `/estacion/3` | Mundo III operativo. | Carga `Mundo III: Cuaderno Pixel`. | PASS |
| `/transition/world-3-to-world-4` | Transicion W3->W4. | Renderiza `TEMP — Abriendo Mundo IV`. | PASS |
| `/estacion/4` | Mundo IV operativo. | Carga `Mundo IV: Mesa de Sistema`. | PASS |
| `/transition/world-4-to-world-5` | Transicion W4->W5. | Renderiza `TEMP — Abriendo Mundo V`. | PASS |
| `/estacion/5` | Entrada base Mundo V. | Carga `Mundo V: Mapa del Presente`. | PASS |
| `/qr/1` | Placeholder QR sin camara. | Carga placeholder sin solicitar permisos. | PASS |

## 11. Flujo manual validado

Flujo validado en Chrome local contra `http://127.0.0.1:5173`:

```text
/estacion/4
-> Iniciar mesa temporal
-> confirmar PLANTA
-> confirmar BIONOSIFICADOR
-> confirmar ESP32
-> confirmar MIDI
-> confirmar WI-FI/UDP
-> confirmar ROUTER
-> confirmar SISTEMA CENTRAL
-> confirmar SONIDO
-> ready_to_continue
-> Continuar
-> /transition/world-4-to-world-5
-> /estacion/5
```

Resultado final:

```text
http://127.0.0.1:5173/estacion/5
```

## 12. Resultado visual/runtime Mundo V

Se valido `/estacion/5` en:

- mobile: `390x844`;
- desktop: `1365x768`.

Resultado:

- sin overflow horizontal en mobile;
- sin overflow horizontal en desktop;
- titulo visible: `Mundo V: Mapa del Presente`;
- estado visible: `Estación V en preparación`;
- tres slots temporales W5 visibles o expuestos;
- cuatro areas exactas preservadas: `PLANTAS`, `SISTEMA`, `ESPACIO`, `VISITANTE`;
- `img`, `audio`, `video`, `canvas`, `iframe` y `button`: `0`;
- no se repite la cadena tecnica completa de Mundo IV.

Capturas temporales de validacion local fuera del repo:

- `%TEMP%\gvo-011b-w5-mobile.png`;
- `%TEMP%\gvo-011b-w5-desktop.png`.

## 13. Validaciones ejecutadas

| Comando o validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | Rama `main`, estado inicial `## main...origin/main`. | PASS |
| `git log --oneline -n 5` | HEAD inicial `07bf5ad feat: build Mundo IV temporary experience 011A`. | PASS |
| `npm run test -- editorialRegistry` | 1 archivo, 6 tests pasados. | PASS |
| `npm run test -- TransitionWorld` | 1 archivo, 14 tests pasados. | PASS |
| `npm run test -- World4RootScreen` | 1 archivo, 3 tests pasados. | PASS |
| `npm run test -- World5RootScreen` | 1 archivo, 3 tests pasados. | PASS |
| `npm run lint` | ESLint finaliza sin errores. | PASS |
| `npm run test` | 13 archivos, 88 tests pasados. | PASS |
| `npm run status` | Ejecutado en modo lectura; muestra estado documental historico del proyecto. | PASS |
| `npm run audit:assets` | `Auditoria de assets OK: sin URLs externas, CDN ni uso de audio.` | PASS |
| `git diff --check` | Sin errores; advertencias LF/CRLF propias de Git en Windows. | PASS con advertencia |
| `npm run dev -- --host 127.0.0.1 --port 5173` | Servidor local iniciado en puerto 5173. | PASS |
| Browser local Chrome | 13 rutas smoke renderizan `main` y flujo W4->W5 termina en `/estacion/5`. | PASS |
| Browser console | Sin errores de aplicacion; se ignora `favicon.ico` 404 residual. | PASS con advertencia |
| Stop server | Puerto 5173 queda sin listener. | PASS |

No se ejecuto `npm run build`, `npm run check`, `npm run format`, `npm install`, `npm update`, `npx` ni `npm audit`.

## 14. Advertencias

- Chrome reporta `http://127.0.0.1:5173/favicon.ico` con 404. Se clasifica como advertencia residual de favicon, no como fallo de ruta, asset runtime o flujo 011B.
- `git diff --check` reporta advertencias de normalizacion LF/CRLF en Windows, sin whitespace errors.

## 15. Confirmaciones de alcance

| Confirmacion | Estado |
|---|---|
| No se implemento experiencia completa de Mundo V. | Confirmado |
| No se implementaron 24 slots completos de Mundo V. | Confirmado |
| No se implemento pantalla final. | Confirmado |
| No se importo Excel. | Confirmado |
| No se creo selector ES/EN visible. | Confirmado |
| No se creo contador diario. | Confirmado |
| No se activo QR/camara. | Confirmado |
| No se pidieron permisos sensibles. | Confirmado |
| No se agregaron assets. | Confirmado |
| No se modificaron assets existentes. | Confirmado |
| No se usaron recursos externos, CDN ni red de runtime. | Confirmado |
| No se instalaron dependencias. | Confirmado |
| No se ejecuto baseline, pre-commit, gitleaks, Graphify, SkillCheck, Claude Code, Spec-kit, Gstack, Claude Council ni MCP. | Confirmado |
| No se ejecuto `okua-delivery-md` antes de aprobacion humana. | Confirmado |
| No se creo rama. | Confirmado |
| No se hizo commit. | Confirmado |
| No se hizo push. | Confirmado |
| `PR_NO_APLICA`. | Confirmado |

## 16. Riesgos y pendientes

Riesgos:

- Mundo V queda como entrada base preliminar; no debe presentarse como experiencia final.
- Los textos son `TEMP` y requieren sustitucion futura desde Excel editorial.
- El favicon 404 sigue como advertencia residual no corregida en este ticket por estar fuera del alcance permitido.

Pendientes:

- Aprobacion humana de 011B.
- Commit runtime/documental despues de aprobacion.
- Entrega final cerrada con `okua-delivery-md` despues de aprobacion.

## 17. Decision recomendada

```text
APROBAR_PARA_COMMIT_Y_CIERRE_011B
```
