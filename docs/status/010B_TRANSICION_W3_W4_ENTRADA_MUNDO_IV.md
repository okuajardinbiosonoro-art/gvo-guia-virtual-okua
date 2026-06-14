# 010B - Transicion W3->W4 y entrada Mundo IV

Fecha: 2026-06-14

## 1. Proposito

Preparar el tramo controlado de salida de Mundo III hacia Mundo IV sin construir la experiencia completa de Mundo IV.

El ticket deja operativa la transicion temporal `/transition/world-3-to-world-4` y convierte `/estacion/4` en una entrada base preliminar llamada `Mundo IV: Mesa de Sistema`.

## 2. Alcance

Incluido:

- Transicion W3->W4 configurada con slots `TRANS_W3_W4_TITLE_01` y `TRANS_W3_W4_SUB_01`.
- Salida de Mundo III hacia `/transition/world-3-to-world-4`.
- Ruta explicita `/estacion/4` antes del placeholder generico de estaciones.
- Pantalla base `World4RootScreen`.
- Tres slots temporales minimos de Mundo IV.
- Ocho nodos tecnicos protegidos.
- Tests enfocados y validacion local en navegador.

Excluido:

- Experiencia completa de Mundo IV.
- Los 40 slots finales de Mundo IV.
- Importacion de Excel.
- Selector visible ES/EN.
- Contador diario.
- QR/camara reales.
- Permisos sensibles.
- Nuevos assets o recursos externos.
- Cambios de dependencias, lockfiles, baseline o configuracion.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimo commit sincronizado al iniciar:

```text
1e28129 feat: build Mundo III temporary experience 010A
```

## 4. Arquitectura previa

Antes de 010B, Mundo III ya podia salir a `/transition/world-3-to-world-4`, pero `/estacion/4` caia en el placeholder generico `/estacion/:stationId`.

La transicion W3->W4 usaba copy temporal de placeholder y no existia una pantalla base especifica de Mundo IV.

## 5. Arquitectura nueva

Flujo vivo preparado:

```text
/estacion/3
-> /transition/world-3-to-world-4
-> /estacion/4
```

`/estacion/4` ahora resuelve explicitamente a `World4RootScreen` y expone:

- `data-world4-experience="base_entry"`;
- `data-world4-editorial-source="excel_pending"`;
- `data-world4-state="entry_preliminary"`;
- `data-world4-slot-count="3"`;
- `data-world4-full-experience="not_implemented"`;
- `data-sensitive-permissions="blocked"`;
- `data-qr-camera="blocked"`;
- `data-daily-counter="not_implemented"`.

## 6. Slots editoriales de transicion

| Slot ID | Texto temporal | Estado | Reemplazable por Excel |
|---|---|---|---|
| `TRANS_W3_W4_TITLE_01` | `TEMP — Abriendo Mundo IV` | `TEMP` | Si |
| `TRANS_W3_W4_SUB_01` | `TEMP — Preparando la mesa del sistema.` | `TEMP` | Si |

## 7. Slots minimos Mundo IV

| Slot ID | Emisor | Texto temporal | Funcion |
|---|---|---|---|
| `W4_INTRO_LIA_01` | `lia` | `TEMP — Aquí veremos cómo la señal recorre el sistema completo.` | Introduccion de Lia a la entrada base. |
| `W4_INTRO_SYS_01` | `sistema` | `TEMP — La cadena conecta planta, bionosificador, ESP32, MIDI, Wi-Fi/UDP, router, sistema central y sonido.` | Presentar la cadena tecnica sin activar hardware. |
| `W4_ACCESSIBLE_SCENE_01` | `interfaz` | `TEMP — Entrada visual a Mundo IV, presentada como una mesa técnica con ocho nodos ordenados.` | Descripcion accesible de la escena base. |

## 8. Nodos tecnicos protegidos

| Orden | Nodo | Estado |
|---|---|---|
| 01 | `PLANTA` | Visible como nodo declarativo. |
| 02 | `BIONOSIFICADOR` | Visible como nodo declarativo. |
| 03 | `ESP32` | Visible como nodo declarativo. |
| 04 | `MIDI` | Visible como nodo declarativo. |
| 05 | `WI-FI/UDP` | Visible como nodo declarativo. |
| 06 | `ROUTER` | Visible como nodo declarativo. |
| 07 | `SISTEMA CENTRAL` | Visible como nodo declarativo. |
| 08 | `SONIDO` | Visible como nodo declarativo. |

No se agrego integracion real con hardware, red, audio, MIDI, permisos, QR ni camara.

## 9. Matriz de cambios

| Area | Archivo | Cambio aplicado | Riesgo | Validacion |
|---|---|---|---|---|
| Registro editorial | `src/content/editorial/editorialRegistry.ts` | Actualiza copy W3->W4 y agrega slots minimos W4. | Bajo: textos TEMP. | `npm run test -- editorial`. |
| Slots Mundo IV | `src/content/world4EditorialSlots.ts` | Define tres slots W4 y ocho nodos tecnicos protegidos. | Bajo. | `npm run test -- World4RootScreen`. |
| Pantalla Mundo IV | `src/screens/World4Root/World4RootScreen.tsx` | Crea entrada base preliminar. | Medio-bajo: nueva ruta viva. | Browser local y test unitario. |
| Estilos Mundo IV | `src/screens/World4Root/World4RootScreen.css` | Layout mobile-first sin assets. | Bajo. | Browser local mobile/desktop. |
| Export Mundo IV | `src/screens/World4Root/index.ts` | Expone `World4RootScreen`. | Bajo. | Lint. |
| Router | `src/app/router.tsx` | Agrega ruta explicita `/estacion/4`. | Medio: orden de rutas. | Browser local de rutas. |
| Transicion | `src/screens/TransitionWorld/transitionWorld.config.ts` | Ajusta etiqueta de portal W3->W4. | Bajo. | `npm run test -- TransitionWorld`. |
| Mundo III | `src/screens/World3Root/World3RootScreen.tsx` | Cambia salida de placeholder a entrada base Mundo IV. | Bajo. | `npm run test -- World3RootScreen`, browser local. |
| Tests | Archivos `*.test.tsx` y `editorialRegistry.test.ts` | Cubre nuevo contrato W3->W4/W4. | Bajo. | Tests enfocados. |

## 10. Matriz de rutas validadas

| Ruta | Resultado esperado | Resultado observado | Estado |
|---|---|---|---|
| `/` | Carga inicial local. | Renderiza `Preparando el recorrido`. | PASS |
| `/portada` | Portada viva. | Carga portada OKUA. | PASS |
| `/transition/intro-to-station-1` | Transicion a Mundo I. | Renderiza `Abriendo Mundo I: Raiz`. | PASS |
| `/estacion/1` | Mundo I operativo. | Carga y permite completar la raiz. | PASS |
| `/transition/world-1-to-world-2` | Transicion W1->W2. | Renderiza `Abriendo Mundo II`. | PASS |
| `/estacion/2` | Mundo II operativo. | Carga y permite completar capas temporales. | PASS |
| `/transition/world-2-to-world-3` | Transicion W2->W3. | Renderiza `TEMP — Abriendo Mundo III`. | PASS |
| `/estacion/3` | Mundo III operativo. | Carga `Mundo III: Cuaderno Pixel`. | PASS |
| `/transition/world-3-to-world-4` | Transicion W3->W4. | Renderiza `TEMP — Abriendo Mundo IV`. | PASS |
| `/estacion/4` | Entrada base Mundo IV. | Renderiza `Mundo IV: Mesa de Sistema`. | PASS |
| `/qr/1` | Placeholder QR sin camara. | Carga placeholder sin solicitar permisos. | PASS |

## 11. Flujo manual validado

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
```

Resultado final:

```text
http://127.0.0.1:5173/estacion/4
```

## 12. Resultado visual/runtime Mundo IV

Se valido `/estacion/4` en:

- mobile: `390x844`;
- desktop: `1366x768`.

Resultado:

- sin overflow horizontal en mobile;
- sin overflow horizontal en desktop;
- titulo visible: `Mundo IV: Mesa de Sistema`;
- estado visible: `Estación IV en preparación`;
- tres slots temporales W4 visibles o expuestos;
- ocho nodos tecnicos exactos preservados;
- `img`, `audio`, `video`, `canvas` e `iframe`: `0`.

## 13. Validaciones ejecutadas

| Comando o validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | Rama `main`, estado inicial `## main...origin/main`. | PASS |
| `git log --oneline -n 5` | HEAD inicial `1e28129 feat: build Mundo III temporary experience 010A`. | PASS |
| `npm run test -- editorial` | 1 archivo, 6 tests pasados. | PASS |
| `npm run test -- TransitionWorld` | 1 archivo, 13 tests pasados. | PASS |
| `npm run test -- World3RootScreen` | 1 archivo, 3 tests pasados. | PASS |
| `npm run test -- World4RootScreen` | 1 archivo, 2 tests pasados. | PASS |
| `npm run lint` | ESLint finaliza sin errores. | PASS |
| `git diff --check` | Sin errores; advertencias LF/CRLF propias de Git en Windows. | PASS con advertencia |
| `npm run dev -- --host 127.0.0.1` | Servidor local iniciado en puerto 5173. | PASS |
| Browser local Chrome | Rutas y flujo W1->W4 validados. | PASS |
| Stop server | Puerto 5173 queda sin listener. | PASS |

Nota: el Chromium descargado de Playwright no estaba disponible localmente y no se instalo por regla del ticket. La validacion se ejecuto con Chrome local instalado.

## 14. Confirmaciones de alcance

| Confirmacion | Estado |
|---|---|
| No se implemento experiencia completa de Mundo IV. | Confirmado |
| No se implementaron 40 slots finales de Mundo IV. | Confirmado |
| No se importo Excel. | Confirmado |
| No se creo selector ES/EN. | Confirmado |
| No se creo contador diario. | Confirmado |
| No se activo QR/camara. | Confirmado |
| No se pidieron permisos sensibles. | Confirmado |
| No se agregaron assets. | Confirmado |
| No se modificaron assets existentes. | Confirmado |
| No se usaron recursos externos. | Confirmado |
| No se instalaron dependencias. | Confirmado |
| No se ejecuto baseline, pre-commit, gitleaks, Graphify, SkillCheck, Claude Code, Spec-kit ni MCP. | Confirmado |
| No se ejecuto `okua-delivery-md` antes de aprobacion humana. | Confirmado |
| No se hizo commit. | Confirmado |
| No se hizo push. | Confirmado |

## 15. Riesgos y pendientes

Riesgos:

- Mundo IV sigue siendo una entrada base temporal; no debe presentarse como experiencia final.
- Los textos son `TEMP` y requieren sustitucion futura desde Excel editorial.
- La integracion real de hardware, audio, QR, camara o contador diario queda fuera de este ticket.

Pendientes:

- Aprobacion humana de 010B.
- Commit runtime/documental despues de aprobacion.
- Entrega final cerrada con `okua-delivery-md` despues de aprobacion.

## 16. Decision recomendada

```text
APROBAR_PARA_COMMIT_Y_CIERRE_010B
```
