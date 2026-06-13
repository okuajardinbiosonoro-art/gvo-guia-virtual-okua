# 008B - Auditoria visual/runtime de Mundo I

## 1. Identificacion

| Campo | Valor |
|---|---|
| Ticket | 008B - Auditoria visual/runtime de Mundo I antes de retomar desarrollo |
| Tipo | AUDITORIA_VISUAL_RUNTIME_SIN_CAMBIOS |
| Fecha de ejecucion | 2026-06-13 |
| Rama inicial | main |
| Estado Git inicial | `## main...origin/main` |
| Archivo creado | `docs/status/008B_AUDITORIA_VISUAL_RUNTIME_MUNDO_I.md` |
| Estado del reporte | PRE-CIERRE_DOCUMENTAL |
| PR | PR_NO_APLICA |

## 2. Resumen ejecutivo

Mundo I / Estacion I carga en `/estacion/1`, mantiene assets runtime completos y permite avanzar internamente por los estados `intro`, `relation`, `perception`, `mediation` y `ready_to_continue`.

La ruta funcional principal sigue vigente:

```text
/ -> /portada -> /transition/intro-to-station-1 -> /estacion/1
```

La transicion `/transition/intro-to-station-1` redirige correctamente a `/estacion/1`. Las rutas `/estacion/2` a `/estacion/5`, `/final` y `/qr/1` cargan como placeholders y no deben corregirse en este ticket.

La auditoria detecta una deuda visual relevante en Mundo I: en mobile y desktop se observa una franja inferior con apariencia de repeticion/continuidad de escena dentro del marco, visible bajo el bloque de texto y el boton. No rompe la carga ni el flujo, pero debe tratarse antes de conectar una salida final o retomar desarrollo visual fino.

Decision propuesta:

```text
APROBADA_CERRAR_Y_PREPARAR_008B_PUSH
```

## 3. Servidor local y alcance de observacion

Se ejecuto servidor local porque el ticket requiere auditoria visual/runtime real.

| Campo | Valor |
|---|---|
| Comando | `npm run dev` |
| URL local usada | `http://localhost:5173/` |
| Host observado | `localhost` |
| Red externa usada | No |
| Servidor detenido | Si |
| Puerto 5173 al cierre | Sin listeners |
| Logs temporales externos | Creados en `%TEMP%` para controlar arranque y eliminados al terminar |

Vite mostro direcciones de red local por defecto al usar `--host 0.0.0.0`, pero la auditoria uso solamente `http://localhost:5173/`.

## 4. Rutas auditadas

| Ruta solicitada | Resultado observado | Estado | Consola | Imagenes rotas | Permisos sensibles |
|---|---|---|---|---:|---|
| `/` | Redirige a `/portada` tras carga inicial | PASO | Sin errores | 0 | No |
| `/portada` | Carga Portada / Intro | PASO | Sin errores | 0 | No |
| `/transition/intro-to-station-1` | Completa transicion y termina en `/estacion/1` | PASO | Sin errores | 0 | No |
| `/estacion/1` | Carga Mundo I / Estacion I | PASO | Sin errores | 0 | No |
| `/estacion/2` | Placeholder Estacion II | PASO | Sin errores | 0 | No |
| `/estacion/3` | Placeholder Estacion III | PASO | Sin errores | 0 | No |
| `/estacion/4` | Placeholder Estacion IV | PASO | Sin errores | 0 | No |
| `/estacion/5` | Placeholder Estacion V | PASO | Sin errores | 0 | No |
| `/final` | Placeholder final; requiere scroll vertical por lista de flujo | PASO | Sin errores | 0 | No |
| `/qr/1` | Placeholder QR fisico; no activa scanner ni camara | PASO | Sin errores | 0 | No |

## 5. Estado visual de Mundo I

### Mobile 390x844

- `/estacion/1` cargo en estado `intro`.
- `data-critical-assets-ready="true"`.
- `data-critical-assets-status="ready"`.
- Scroll DOM observado: `390x844`, sin scroll adicional documentado por `documentElement`.
- Lía visible en zona superior derecha de la escena.
- Nodos visibles: RELACION disponible; PERCEPCION y MEDIACION bloqueados en estado inicial.
- Textos principales legibles dentro de la tarjeta inferior.
- Boton `Continuar` visible pero deshabilitado hasta `ready_to_continue`.
- Deuda visual: se observa una franja inferior con apariencia de repeticion/continuidad de escena dentro del marco.

### Desktop 1280x720

- `/estacion/1` cargo centrado como formato vertical.
- Scroll DOM observado: `1280x720`, sin scroll adicional documentado.
- Escena centrada con ancho aproximado de 394 px y alto aproximado de 700 px.
- Nodos, Lía, planta y texto se mantienen visibles.
- Deuda visual repetida: tambien aparece una franja inferior con apariencia de segunda escena o continuidad visual no deseada.

## 6. Flujo interno de Mundo I

Se valido el flujo:

```text
intro -> relation -> perception -> mediation -> ready_to_continue
```

Resultado:

- `relation`: boton disponible desde `intro`.
- `perception`: se habilita despues de `relation`.
- `mediation`: se habilita despues de `perception`.
- `Cerrar raiz`: aparece en `mediation` y lleva a `ready_to_continue`.
- `ready_to_continue`: se alcanza correctamente y registra `data-world1-exit-ready="true"`.
- `Continuar`: se habilita, no navega a otra ruta y muestra la nota documentada:

```text
La salida se activara en una fase posterior.
```

Este comportamiento coincide con lo documentado en 008A.

## 7. Assets runtime

En `/estacion/1` se observaron assets completos y con dimensiones naturales validas para:

- background;
- ambient light;
- roots base;
- plant;
- Lía idle;
- Lía ready continue;
- estados visuales de nodos.

No se detectaron imagenes rotas en las rutas auditadas. No se modifico `public/assets/**`, `src/assets/**` ni `assets/**`.

## 8. Archivos revisados

Archivos existentes revisados en modo lectura:

- `src/app/router.tsx`
- `src/app/routes.ts`
- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World1Root/World1RootScreen.css`
- `src/screens/World1Root/world1RootAssets.ts`
- `src/screens/World1Root/**`
- `src/screens/LoadingInitial/**`
- `src/screens/Cover/**`
- `src/screens/TransitionWorld/**`
- `src/components/qr/QrAccessPlaceholder.tsx`
- `src/screens/Station/StationPlaceholder.tsx`
- `src/screens/Final/FinalPlaceholder.tsx`
- `src/data/stations.ts`
- `public/assets/**`
- `docs/status/008A_REVISION_ESTADO_FUNCIONAL_POST_GOBERNANZA.md`
- `docs/status/ESTADO_ACTUAL_PROYECTO.md`

Archivos listados por el ticket que no existen con esa ruta/nombre:

- `src/screens/World1Root/world1RootContent.ts`
- `src/screens/World1Root/world1RootProgress.ts`
- `src/screens/World1Root/world1RootScene.ts`
- `src/screens/World1Root/world1RootTelemetry.ts`
- `src/screens/QrAccessPlaceholder.tsx`
- `src/screens/StationPlaceholder.tsx`
- `src/content/stations.ts`

Rutas reales detectadas:

- `src/components/qr/QrAccessPlaceholder.tsx`
- `src/screens/Station/StationPlaceholder.tsx`
- `src/data/stations.ts`

## 9. Matriz visual/runtime

| Area | Ruta / archivo | Estado observado | Evidencia | Riesgo | Accion recomendada | Ticket sugerido |
|---|---|---|---|---|---|---|
| Carga inicial | `/` | Redirige a `/portada`; sin errores de consola | Ruta auditada en localhost | Bajo | Mantener sin cambios | No aplica |
| Portada / Intro | `/portada` | Carga viva; 24 imagenes observadas; sin roturas | Browser local, DOM y consola | Medio por deuda visual historica | No tocar salvo continuidad | 008E si aplica |
| Transicion intro-to-station-1 | `/transition/intro-to-station-1` | Completa y llega a `/estacion/1` | Ruta final `/estacion/1` | Bajo-medio | Mantener; no tocar assets archivados | 008C si se conecta salida |
| Mundo I / Estacion I | `/estacion/1` | Carga en `intro`, assets completos | `World1RootScreen`, DOM, captura visual | Medio-alto por deuda visual inferior | Auditar/corregir antes de conectar salida | 008C |
| Flujo interno Mundo I | `World1RootScreen.tsx` | Avanza por relation, perception, mediation | Clicks locales y estados DOM | Bajo funcional, medio visual | Mantener comportamiento; documentar salida pendiente | 008C |
| Ready to continue | `/estacion/1` | Estado alcanzado; `data-world1-exit-ready="true"` | DOM y texto visible | Medio por salida no conectada | Conectar salida solo con ticket | 008C |
| Boton Continuar | `/estacion/1` | Se habilita en ready y muestra nota; no navega | Nota visible tras click | Medio si usuario espera avance real | Implementar decision de salida futura | 008C |
| Placeholders estaciones II-V | `/estacion/2` a `/estacion/5` | Cargan placeholders sin romper | Rutas auditadas | Bajo | No corregir en este ticket | Futuro Mundo II |
| QR placeholder | `/qr/1` | Placeholder; no scanner, no camara | Ruta auditada; sin video/canvas/input capture | Bajo, alto si se activa prematuro | Mantener bloqueado hasta politica QR/camara | Ticket QR/camara futuro |
| Assets runtime | `public/assets/**` | Imagenes completas; 0 rotas en rutas auditadas | DOM image naturalWidth > 0 | Medio si se renombran/podan | No tocar assets runtime | 008C con validacion |
| Mobile layout | 390x844 | Legible y sin scroll DOM; franja inferior repetida visible | Captura visual y metricas DOM | Medio-alto | Corregir o validar frame/crop antes de salida | 008C |
| Desktop layout | 1280x720 | Centrado y legible; misma franja inferior repetida | Captura visual y metricas DOM | Medio | Revisar CSS/layout del frame | 008C |
| Consola / errores | Todas las rutas auditadas | Sin errores ni warnings observados | Logs navegador por ruta | Bajo | Mantener control en 008C | 008C |
| Permisos sensibles | `/qr/1`, `/estacion/1` | No video, canvas, capture ni solicitud de camara | DOM auditado | Bajo | No activar permisos | Ticket QR/camara futuro |

## 10. Matriz de decision de continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 008C - Retomar desarrollo de salida de Mundo I | Conectar o preparar la salida desde `ready_to_continue` | Ataca el bloqueo funcional real | Puede arrastrar deuda visual si no corrige franja inferior | Recomendada despues de push de 008B, incluyendo correccion/validacion visual | 008C |
| 008D - Validar baseline de seguridad antes de runtime | Revisar impacto de `e669a28/cbc0d8b` | Reduce riesgo de gates mal aplicados | Puede retrasar salida de Mundo I sin resolver deuda visual | Hacer despues de 008C si 008C mantiene alcance limitado | 008D |
| 008E - Revisar portada/intro | Reabrir deuda visual de portada/intro | Mejora continuidad previa a Mundo I | Puede distraer del bloqueo actual en `/estacion/1` | No prioritaria salvo que 008C dependa de continuidad previa | 008E opcional |
| 008F - Preparar flujo hacia Mundo II | Preparar siguiente pantalla/flujo | Avanza roadmap | Prematuro si salida de Mundo I no esta lista | No recomendado todavia | Despues de 008C |

## 11. Riesgos encontrados

1. Deuda visual en Mundo I: franja inferior con apariencia de repeticion/continuidad de escena en mobile y desktop.
2. `Continuar` no navega, por diseno actual; si se retoma desarrollo, debe decidirse destino/transicion.
3. Algunos archivos esperados por el ticket no existen con esa ruta/nombre; hay diferencia entre ticket y estructura real.
4. `/final` placeholder requiere scroll vertical en mobile por lista de flujo; no bloquea Mundo I.
5. QR/camara siguen bloqueados y no deben activarse sin politica y ticket propio.

## 12. Recomendacion principal

Preparar `008C - Retomar desarrollo de salida de Mundo I`, pero con alcance inicial de correccion/validacion visual del frame inferior y conexion de salida desde `ready_to_continue`. No avanzar a Mundo II ni activar QR/camara todavia.

## 13. Comandos y validaciones ejecutadas

| Comando / validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` | PASO |
| `git log --oneline -n 5` | HEAD `bab0755 docs: review functional state after governance 008A` | PASO |
| `npm run dev` | Servidor local Vite en `http://localhost:5173/` | PASO |
| Navegacion local `http://localhost:5173/...` | Rutas obligatorias auditadas | PASO |
| Detener servidor local | PID npm/cmd y proceso Vite detenidos; puerto 5173 sin listeners | PASO |
| `Test-Path docs/status/008B_AUDITORIA_VISUAL_RUNTIME_MUNDO_I.md` | `False` antes de crear reporte | PASO |
| `Get-Content -Raw src/app/router.tsx` | Lectura realizada | PASO |
| `Get-Content -Raw src/app/routes.ts` | Lectura realizada | PASO |
| `Get-Content -Raw src/screens/World1Root/World1RootScreen.tsx` | Lectura realizada | PASO |
| `Get-ChildItem src/screens/World1Root -Recurse -File` | Lectura realizada | PASO |
| `Get-ChildItem public/assets -Recurse -File` | Lectura realizada durante auditoria 008B | PASO |
| `git diff --stat` | Sin cambios antes de crear reporte | PASO |

Validaciones no ejecutadas:

- `npm run build`: prohibido por ticket.
- `npm run check`: prohibido por ticket.
- `npm run format`: prohibido por ticket.
- `npm install`, `npm update`, `npx`, `npm audit`: prohibidos por ticket.

## 14. Confirmaciones de cumplimiento

- No se modifico runtime.
- No se modifico `src/**`.
- No se modifico `public/**`.
- No se modifico `assets/**`.
- No se modifico Atlas 006I.
- No se modifico `package.json`.
- No se modifico `package-lock.json`.
- No se modifico `.gitignore`.
- No se modifico `.pre-commit-config.yaml`.
- No se modifico `requirements-security.txt`.
- No se modifico `scripts/run_security_checks.ps1`.
- No se instalaron dependencias.
- No se uso red externa.
- No se ejecutaron Graphify, SkillCheck, Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se crearon carpetas de agentes, skills ni MCP.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- PR_NO_APLICA.

