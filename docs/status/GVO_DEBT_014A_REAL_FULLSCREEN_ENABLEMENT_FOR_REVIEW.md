# GVO_DEBT_014A — Fullscreen real habilitado para revisión humana

Fecha de ejecución: 2026-08-16  
Estado: `PENDING_HUMAN_REVIEW`  
Resultado técnico: `REAL_FULLSCREEN_BROWSER_PASS`

## Baseline y worktree

- Rama: `main`.
- `HEAD`: `458c788843a3eb12beaee844ac407bae166f7c50`.
- `origin/main`: `458c788843a3eb12beaee844ac407bae166f7c50`.
- Divergencia: `0 / 0`.
- Cadena heredada `GVO_DEBT_013 → 013A → 013B → 013C → 014`:
  preservada.
- Instantánea pre-014A: 95 archivos heredados. Siete fueron solapamientos
  intencionales de fullscreen/pruebas; los otros 88/88 conservaron su hash de
  blob inicial.
- Sin reset, checkout, stash, clean, rebase, commit, push ni Pull Request.

## Root cause

### human failure reproduced

El estado pre-clic `disabled / unsupported` reportado por la revisión humana no
se reprodujo al abrir el build heredado directamente como documento top-level
en Chrome, Edge, Opera GX ni en el navegador integrado: en esos cuatro casos el
botón apareció habilitado y la solicitud real entró en fullscreen.

Sí quedó demostrada la ruta exacta que producía un botón deshabilitado en el
código heredado:

```text
isFullscreenAvailable() === false
→ initialFullscreenState = unsupported
→ disabled = true
```

La implementación anterior devolvía `false` cuando
`document.fullscreenEnabled` no era truthy o faltaba
`document.documentElement.requestFullscreen`. No distinguía API ausente de
policy/contexto bloqueado, por lo que el submotivo original quedó perdido al
mapear ambos a `unsupported`. Sin un probe contemporáneo del navegador usado en
esa revisión no es posible reconstruir cuál de las dos señales entregó ese
documento; no se inventa una atribución retrospectiva.

### cause

Además existía un defecto funcional concreto e independiente del atributo
`disabled`: `requestImmersiveMode()` abortaba antes de llamar a la API cuando
`navigator.userActivation.isActive === false`. La activación transitoria no es
capability persistente y el gesto del propio botón es quien debe otorgarla.

La corrección:

- elimina el preflight de `navigator.userActivation`;
- invoca `document.documentElement.requestFullscreen()` directamente dentro
  del handler explícito;
- espera la Promise y confirma `document.fullscreenElement`;
- separa `supported`, `unsupported-browser` y `blocked-by-context`;
- mantiene rechazo/error no bloqueante;
- conserva una sola autoridad compartida para `/inicio` y el shell global.

### affected code

- `src/shared/immersive/immersiveMode.ts`.
- `src/shared/immersive/ImmersiveModeControl.tsx`.
- `src/screens/InitialExperience/InitialExperienceScreen.tsx`.

### environment

- Preview real: `npm run build` + `npm run preview`.
- URL directa: `http://127.0.0.1:4173/inicio`.
- Top-level: `true`.
- Secure context de loopback: `true`.
- `window.frameElement`: `null`.
- Header `Permissions-Policy`: ausente.
- `document.featurePolicy.allowsFeature("fullscreen")`: `true`.
- No se requirió cambiar headers, Vite, PWA ni iframe.

## Capability before

Probe sobre el build heredado de 014, sin monkeypatch:

- `fullscreenEnabled`: `true` en Chrome, Edge y Opera GX.
- `requestFullscreen`: `function`.
- `exitFullscreen`: `function`.
- top-level: `true`.
- policy: permitida.
- `userActivation` antes del clic: la automatización headed reportó
  `isActive=true / hasBeenActive=true`.
- botón `disabled`: `false`.
- resultado heredado top-level: entrada, continuidad SPA y salida por control
  funcionaban; esto descarta servidor/policy como causa en el laboratorio
  directo.
- El caso contractual `userActivation=false` sí demostraba el defecto: la
  utilidad heredada no invocaba `requestFullscreen`.

## Capability after fix

- botón `disabled` antes del clic: `false`.
- capability: `supported`.
- estado inicial: `inactive`.
- clic real: Promise resuelta.
- `fullscreenElement`: `HTML`.
- estado de UI: `active`.
- eventos: `fullscreenchange` al entrar, salir y reentrar; cero
  `fullscreenerror`.
- navegación SPA `/inicio → /portada`: `fullscreenElement=HTML` y control
  global `active`.
- salida por el mismo control: `fullscreenElement=null`, estado `inactive`.
- reentrada desde Portada: `fullscreenElement=HTML`.
- API ausente: `unsupported-browser`.
- API presente con `fullscreenEnabled=false` o policy denegada:
  `blocked-by-context`.
- rechazo real/contractual: `error`, con `Iniciar recorrido` disponible.

La prueba contractual confirma expresamente:

```text
API presente + fullscreenEnabled=true + userActivation=false antes del click
→ botón habilitado
→ click invoca requestFullscreen
```

## Browser QA

Campaña `REAL_FULLSCREEN_BROWSER_QA`, ejecutada headed y sin redefinir
`requestFullscreen`, `exitFullscreen`, `fullscreenElement` ni
`fullscreenEnabled`. Evidencia local ignorada por Git:
`test-results/gvo-debt-014a/final/`.

| Navegador | Versión reportada | Botón habilitado | Entrada real | SPA activa | Salida por control | Reentrada | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Google Chrome | 151.0.7922.138 | Sí | `HTML` | `HTML` | `null` | `HTML` | PASS |
| Microsoft Edge | 151.0.4129.86 | Sí | `HTML` | `HTML` | `null` | `HTML` | PASS |
| Opera GX | 150.0.7871.187 | Sí | `HTML` | `HTML` | `null` | `HTML` | PASS |

- `AUTOMATED_REAL_FULLSCREEN`: `PASS`.
- `REAL_FULLSCREEN_BROWSER_PASS`: emitible; tres navegadores Chromium-family
  reales cumplieron botón → clic → elemento → SPA → salida.
- `AUTOMATED_ESCAPE`: `NOT_CERTIFIED`. Playwright no consiguió que su
  `keyboard.press("Escape")` saliera del fullscreen nativo, aunque el mismo
  control sí salió correctamente. No se simuló ni se presentó Esc como PASS.
- Navegador integrado, prueba complementaria: `inactive → active` mediante
  clic real.
- QA humano obligatorio: sí, para aprobación final y comprobación visual de
  desaparición del chrome/salida nativa con Esc. Procedimiento de menos de 60 s
  en `docs/qa/GVO_DEBT_014A_REAL_FULLSCREEN_HUMAN_QA.md`.

## Regression

- Portal I: PASS, overflow `0 px` en portrait, landscape y desktop.
- Cover revisit: PASS; Mirador desbloquea I–V sólo con contexto válido y
  progreso completo.
- Gating normal: PASS.
- Controles locales de estaciones: `0`.
- Autoridad global: exactamente un control post-`/inicio`; transitions sin
  duplicado; Mirador con control global.
- Assets: 15/15 binarios HUMAN_APPROVED byte-idénticos, 20 copias verificadas,
  cinco pares runtime/mirror.
- Manifiestos de assets: preservados y equivalentes.
- PWA/Workbox/runtime cache: sin cambios.
- Route chunking: preservado.
- Mirador visual, progreso, checkpoints, reset, QR, copy editorial, Lía y
  motion: intactos.
- `docs/visual/` y `docs/status/CURRENT_STATE.md`: intactos.

## Tests

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio |
| `npm run lint` | PASS |
| `npm test -- --maxWorkers=1` | PASS — 42 archivos / 519 pruebas |
| `npx tsc -b --pretty false` | PASS |
| `npm run build` | PASS — 609 módulos |
| `npm run test:e2e` | PASS — 169/169 en 16,4 min |
| Verificador binario 013C | PASS — 15 aprobados / 20 copias / 5 pares |
| Verificador 014 | PASS |
| Matriz visual 014 | PASS — 11/11 |
| 014A contract tests | PASS — 5/5 |
| Real browser QA | PASS — Chrome, Edge y Opera GX |
| `git diff --check` | PASS |

La primera corrida E2E terminó 167/169: una captura histórica `002J-FIX`
agotó su ventana de preload y el padre 014 todavía esperaba el antiguo estado
`unsupported`. Se estabilizó la captura esperando readiness real —sin mocks ni
cambio runtime— y se reconcilió 014 con `blocked-by-context`. Las pruebas
focales cerraron 7/7 y 2/2; la corrida global final cerró 169/169.

## PWA y performance

- Chunk principal DEBT_014: 539.191 bytes.
- Chunk principal DEBT_014A: 540.210 bytes.
- Delta: `+1.019 bytes` (`+0,19 %`).
- PWA precache: 49 entradas / 14.828,19 KiB.
- Chunks por ruta: preservados; `FinalRoot` continúa diferido en 19,11 kB.
- Dependencias, `package.json`, lockfile, VitePWA y Workbox: sin cambios.

## Archivos

### Creados

- `tools/qa/gvo_debt_014a_fullscreen_capability_probe.mjs`.
- `tests/e2e/gvo-debt-014a-real-fullscreen-enablement.spec.ts`.
- `docs/qa/GVO_DEBT_014A_REAL_FULLSCREEN_HUMAN_QA.md`.
- Este informe.

### Modificados

- Autoridad compartida `shared/immersive`, export y pruebas.
- `/inicio`, prueba y metadata de capability.
- Prueba del shell global.
- Contrato E2E padre 014 para `blocked-by-context`.
- QA histórico `002J-FIX`, sólo para esperar readiness determinista.

### Congelados / fuera de alcance

- Assets y manifiestos de Portales I–V.
- Mirador visual, progreso, checkpoints, reset, QR, PWA, Workbox, route
  chunking, copy editorial, Lía, motion, dependencias, package y lockfile.
- `CURRENT_STATE.md`.

## Estado final

```text
GVO_DEBT_014A_REAL_FULLSCREEN_IMPLEMENTATION_COMPLETE_FOR_HUMAN_REVIEW
REAL_FULLSCREEN_BROWSER_PASS
PENDING_HUMAN_REVIEW
```

Sin commit.  
Sin push.  
Sin PR.
