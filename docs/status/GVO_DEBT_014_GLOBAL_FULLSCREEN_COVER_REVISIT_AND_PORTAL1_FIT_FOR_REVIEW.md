# GVO_DEBT_014 — Fullscreen global, revisita de Portada y ajuste de Portal I

Fecha de ejecución: 2026-08-16  
Estado: `IMPLEMENTATION_COMPLETE_FOR_REVIEW / PENDING_HUMAN_REVIEW`

## Baseline y límites

- Rama: `main`.
- `HEAD`: `458c788843a3eb12beaee844ac407bae166f7c50`.
- `origin/main`: `458c788843a3eb12beaee844ac407bae166f7c50`.
- Divergencia final `HEAD...origin/main`: `0 / 0`.
- El worktree heredado de `GVO_DEBT_013`, `013A`, `013B` y `013C` fue
  preservado. El solapamiento intencional de 014 se limita a los tres archivos
  de la pantalla de Portada (`CoverIntroScreen.tsx`, CSS y prueba); los demás
  71/71 archivos heredados conservaron su hash de blob inicial.
- `GVO_DEBT_013C`: `HUMAN_APPROVED / MINOR_DEBT_CARRIED_TO_GVO_DEBT_014`.
- Sin reset, stash, clean, rebase, commit, push ni Pull Request.
- `docs/status/CURRENT_STATE.md` y `docs/visual/` permanecen intactos.

## Portal I — medición antes y después

El WebP aprobado no fue reexportado ni transformado. La corrección se limita
al render de Portal I: su caja interior pasó de `top: 6%; height: 88%` a
`top: 8%; height: 84%` y recibió un `clip-path` mínimo de 1 px. Portales II–V
conservan la regla anterior.

| Viewport | Hueco útil del frame | Interior antes | Overflow visible antes | Interior visible después | Overflow después |
| --- | --- | --- | --- | --- | --- |
| 390×844 | x `144,305–245,695`; y `474,798–654,952` | x `169,648–220,336`; y `470,266–659,453` | arriba `4,532 px`; abajo `4,501 px` | x `169,648–220,336`; y `475,563–654,156` | `0 px` en los cuatro lados |
| 844×390 | x `379,790–464,210`; y `86,500–236,500` | x `392,500–451,500`; y `95,500–227,500` | `0 px` | x `392,500–451,500`; y `99,500–223,500` | `0 px` en los cuatro lados |
| 1440×900 | x `661,000–779,000`; y `499,542–709,208` | x `690,500–749,500`; y `509,766–698,953` | `0 px` | x `690,500–749,500`; y `515,063–693,656` | `0 px` en los cuatro lados |

La matriz visual confirmó frame y glow intactos, `object-fit: cover`, sin
letterboxing, deformación ni recorte narrativo importante.

## Binarios HUMAN_APPROVED preservados

- Paquete aprobado:
  `C:\Users\JOSE DAVID\Downloads\GVO_COVER_PORTAL_INTERIORS_APPROVED_V01.zip`.
- SHA-256 del ZIP:
  `B70B2604DD5E960A0057C10D269F756C18E3CD47411D84348B395E0F119A78CC`.
- Verificación: 15/15 binarios aprobados, 20 copias del repositorio y 5/5
  pares runtime/mirror byte-idénticos.
- Los 15 SHA-256 de source, master y runtime permanecen iguales al inventario
  aprobado de `GVO_DEBT_013C`.
- Portal I runtime:
  `31A0635850AF15531EE75DC9C2A3E4D1EDFE322FA9D4569D6D94513434255C92`.
- Portal V runtime:
  `CC95E888B472D8E14295F8B9623144262F699D7583D5A2B1062085CDD5019563`;
  su alpha aprobado permanece intacto.
- Los manifiestos runtime y `current-used` continúan equivalentes.

## Revisita Mirador → Portada

Se reutilizó la clave canónica de sesión
`gvo.final.reviewContext.v1`. El contexto ahora discrimina entre revisión de un
Mundo y `final-cover-revisit`; no se creó otro sistema de progreso ni se
agregaron query params.

Al pulsar el retorno a Portada desde Mirador, `FinalRootScreen` crea el contexto
de revisita y navega a `/portada`. La Portada sólo habilita la revisita completa
cuando coinciden:

1. contexto canónico `final-cover-revisit`; y
2. progreso global completo I–V (`canOpenFinal`).

Una sesión nueva, el progreso parcial y el progreso completo sin contexto
mantienen el gating histórico. Un contexto residual con progreso incompleto se
invalida. En una revisita válida, I–V aparecen sin lock ni opacidad bloqueada y
cada portal prepara el contexto de revisión del Mundo elegido antes de navegar
a su entrada canónica:

| Portal | Destino canónico |
| --- | --- |
| I | `/estacion/1` |
| II | `/estacion/2` |
| III | `/estacion/3` |
| IV | `/estacion/4` |
| V | `/estacion/5` |

Así se conserva el retorno posterior a Mirador y no se abre un bypass desde una
sesión nueva.

## Fullscreen global

`GlobalImmersiveShell` es la única autoridad visible después de `/inicio`.
`ImmersiveModeControl` usa la autoridad compartida de Fullscreen API, no fuerza
entrada, no persiste estado y sincroniza `fullscreenchange` y
`fullscreenerror`.

| Ruta | Contrato final |
| --- | --- |
| `/` y `/carga` | shell oculto; sin duplicados |
| `/inicio` | conserva únicamente su CTA local aprobado; shell oculto |
| `/portada` | exactamente un control global |
| `/transition/*` | shell oculto durante la composición; el estado nativo puede continuar en la navegación SPA |
| `/estacion/1` | exactamente un control global; 0 locales |
| `/estacion/2` | exactamente un control global; 0 locales |
| `/estacion/3` | exactamente un control global; 0 locales |
| `/estacion/4` | exactamente un control global; 0 locales |
| `/estacion/5` y subvistas | exactamente un control global; 0 locales |
| `/final` / Mirador | exactamente un control global |

La auditoría de World I–V confirmó cero imports locales de
`ImmersiveModeControl`, cero botones fullscreen equivalentes y cero controles
ocultos duplicados. Los listeners fullscreen que permanecen en lógica de Mundo
IV sólo actualizan geometría/ayudas táctiles; no crean autoridad ni UI paralela.

Estados soportados: `unsupported`, `inactive`, `pending`, `active` y `error`.
El estado `active` sólo se declara con `document.fullscreenElement` presente.
`unsupported` y el rechazo de la API muestran un estado no bloqueante. El mismo
botón entra y sale; Esc o la salida nativa lo devuelve a `inactive`.

Copy del control:

- ES: `Activar pantalla completa` / `Salir de pantalla completa`.
- EN: `Enter fullscreen` / `Exit fullscreen`.

El botón es nativo, tiene `aria-label`, `aria-pressed`, foco visible, target
mínimo 44×44 y posicionamiento con safe areas. La matriz no encontró colisiones
con CTA, Lía, controles esenciales ni el dock de revisión final.

## QA visual y E2E

La evidencia local se generó bajo
`test-results/gvo-debt-014/visual-matrix/` y está ignorada por Git.

La matriz focal cerró 11/11 escenarios: `/inicio`; Portada normal en portrait,
landscape y desktop; Portada en revisita; Mundos I–V; y Mirador. Confirmó máximo
un control visible, cero controles locales, gating normal, unlock I–V, 0 px de
overflow en Portal I, ausencia de colisiones interactivas, solicitudes externas
y errores de consola.

El E2E dedicado usa stubs de la Fullscreen API únicamente para comprobar de
forma determinista los estados activo, salida, rechazo y unsupported, porque el
navegador headless no ofrece una sesión fullscreen real estable. Navegación,
DOM, gating, destinos y persistencia SPA se prueban contra la aplicación real.

Dos contratos históricos fueron reconciliados sin ocultar regresiones:

- `GVO_DEBT_009` ahora reconoce la ampliación explícita de la autoridad global
  a Portada y Mirador, manteniendo ocultos `/carga`, `/inicio` y rutas no
  autorizadas.
- `COVER_INTRO_002L` espera la carga diferida por `DOMContentLoaded` con un
  límite de 30 s para evitar un falso negativo de arranque frío; su aserción
  funcional no cambió.

## Validaciones

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio |
| `npm run lint` | PASS |
| `npx vitest run --maxWorkers=1` | PASS — 42 archivos / 514 pruebas |
| `npx tsc -b --pretty false` | PASS |
| `npm run build` | PASS — 609 módulos, PWA generada |
| Verificador binario `GVO_DEBT_013C` | PASS — 15 aprobados, 20 copias, 5 pares runtime/mirror |
| Verificador `GVO_DEBT_014` | PASS |
| Matriz visual `GVO_DEBT_014` | PASS — 11/11 |
| E2E focal `GVO_DEBT_014` | PASS — 5/5 |
| `npm run test:e2e` | PASS — 164/164 en 17,1 min |
| `docs/visual/` y `CURRENT_STATE.md` | Intactos |

La primera corrida E2E global terminó 162/164: un contrato histórico de
fullscreen había sido superado explícitamente por 014 y una precarga diferida
agotó 15 s en arranque frío. Tras las dos reconciliaciones descritas, la corrida
global completa cerró 164/164.

## PWA y rendimiento

- No se cambiaron Workbox, VitePWA, precache strategy, runtime cache ni route
  chunking.
- No se añadieron dependencias.
- Chunk principal: 536.979 → 539.191 bytes; delta `+2.212 bytes` (`+0,412 %`).
- Precache: 49 entradas / 14.827,13 KiB.
- `FinalRoot` continúa diferido (19,11 kB); los chunks por ruta permanecen
  separados.
- El build conserva la advertencia histórica de chunk principal mayor a 500 kB.

## Archivos de GVO_DEBT_014

### Creados

- `src/screens/Cover/coverRevisitPolicy.ts` y su prueba.
- `tests/e2e/gvo-debt-014-global-fullscreen-cover-revisit.spec.ts`.
- `tools/qa/gvo_debt_014_verify_global_experience.mjs`.
- `tools/qa/gvo_debt_014_visual_matrix.mjs`.
- Este informe de revisión.

### Modificados

- Contexto de revisión final y sus pruebas.
- Router y shell inmersivo global con sus pruebas.
- Portada: componente, contenido, CSS y pruebas.
- Mirador: retorno a Portada y pruebas.
- Control fullscreen compartido: componente, CSS y pruebas.
- Dos E2E históricos reconciliados con el contrato explícito de 014.

### Preservados / fuera de alcance

- Los 15 binarios HUMAN_APPROVED, sus cinco mirrors y ambos manifiestos.
- Interiores, frames, glow, números, labels e identidad de Lía salvo el recorte
  de render específico de Portal I.
- Progreso, checkpoints, reset, QR, copy editorial, audio, navegación ajena al
  ticket, PWA, dependencias, `docs/visual/` y `CURRENT_STATE.md`.

## Estado final

`GVO_DEBT_014_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

El ticket queda `PENDING_HUMAN_REVIEW`, sin declarar publicación ni aprobación
visual humana de GVO_DEBT_014.
