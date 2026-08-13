# GVO DEBT 009 — Immersive shell y navegación QR — Para revisión

Fecha de ejecución: 2026-08-06
Estado: `PENDING_HUMAN_REVIEW`

## Resultado

Se implementó un único control inmersivo compartido para las rutas autorizadas de las cinco estaciones y las cuatro vistas internas de Mundo V. También se sustituyó la entrada QR libre por cinco contratos tipados que reutilizan el núcleo canónico de progreso y fallan de forma cerrada ante progreso insuficiente, datos corruptos o identificadores manipulados.

La implementación y todas las validaciones técnicas están completas. Este documento no declara aprobación humana ni modifica el estado canónico del proyecto. No se creó commit, no se hizo push y no se abrió Pull Request.

## Baseline verificada

- Rama activa: `main`.
- `HEAD`: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- `origin/main` después de `git fetch origin main`: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- Divergencia `HEAD...origin/main`: `0 0`.
- El worktree estaba limpio al inicio y queda modificado únicamente por los archivos declarados en este informe.

## Auditoría inicial

- La ruta anterior `/qr/:stationId` aceptaba texto libre y enviaba directamente a `/estacion/:stationId` mediante un placeholder, sin resolver primero el contrato de acceso.
- El componente seguro `ImmersiveModeControl` ya existía, pero sólo estaba montado localmente en Mundo IV.
- El núcleo de progreso ya ofrecía `readProgress`, `canOpenStation` y `mostAdvancedAvailableStation`; se reutilizó sin crear una API paralela ni cambiar su esquema.
- Los guards existentes de estación, transición y Final ya constituían la autoridad canónica de acceso.
- Mirador/Final ya tenía su propio dock de revisión y tratamiento de `safe-area`; no se modificó su comportamiento interno.

## Shell inmersivo global

- `GlobalImmersiveShell` vive en el nivel superior del router y monta una sola instancia del control.
- El control sólo aparece en `/estacion/1` a `/estacion/5` y en `/estacion/5/plantas`, `/sistema`, `/espacio` y `/visitante`.
- Permanece ausente en carga, portada, transiciones, Final/Mirador, QR, rutas de desarrollo y estados inválidos.
- Conserva botón nativo, objetivo mínimo de `44 × 44 px`, etiqueta accesible, foco, teclado, toque y estado perceptible mediante glifo y `aria-label`, no sólo mediante color.
- Respeta `safe-area-inset-top` y `safe-area-inset-right`, aísla eventos con `pointer-events` y evita el dock de revisión de Final.
- Con `prefers-reduced-motion` desactiva las transiciones del control.
- `requestFullscreen()` sólo se solicita después de una acción explícita; nunca hay fullscreen automático. Si la API no existe, el control seguro existente no se muestra.
- Se retiró el montaje duplicado de Mundo IV. Su cálculo local de modo de presentación permanece intacto.
- La matriz DEBT 009 verificó cero colisiones interactivas en 9 rutas por 2 orientaciones. La regresión DEBT 007 verificó además 9 rutas en 8 viewports, 72 combinaciones.

## Contratos QR

| QR | Prefijo de estaciones completadas requerido | Destino autorizado |
| --- | --- | --- |
| `/qr/1` | Ninguno | `/estacion/1` |
| `/qr/2` | `1` | `/estacion/2` |
| `/qr/3` | `1, 2` | `/estacion/3` |
| `/qr/4` | `1, 2, 3` | `/estacion/4` |
| `/qr/5` | `1, 2, 3, 4` | `/estacion/5` |

- Sólo se aceptan identificadores estrictos `1` a `5`; valores como `01`, texto, segmentos adicionales o rutas QR incompletas son inválidos.
- Una entrada válida navega a la estación solicitada únicamente cuando el progreso canónico la autoriza.
- Ante progreso insuficiente, identificador inválido o almacenamiento corrupto, el destino es la estación autorizada más avanzada.
- Los parámetros manipulados no conceden progreso ni acceso.
- La resolución es de sólo lectura: no escribe ni repara `gvo.progress.v1`; la prueba conserva incluso el valor crudo corrupto.
- Al entrar por QR sólo se limpia el contexto efímero de revisión de Final para evitar una revisita espuria; no se altera progreso, checkpoints ni reset.
- No se incorporó escáner, cámara, `getUserMedia`, librería QR, recurso externo, red, telemetría ni permiso sensible.

## Validación ejecutada

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS; sin URL externa, CDN ni audio |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS; 36 archivos, 480/480 pruebas |
| `npm run build` | PASS; 608 módulos transformados; PWA `generateSW` con 278 entradas |
| E2E focal DEBT 009 | PASS; 9/9 |
| Regresión DEBT 007 | PASS; 13/13 |
| Regresión visual histórica W5 020G/020H | PASS; 3/3 |
| `npm run test:e2e` integral | PASS; 136/136 en 13,7 min; código de salida 0 |
| `git diff --check` | PASS |

La primera invocación directa de la suite integral fue interrumpida por el límite externo del ejecutor a los cinco minutos, no por Playwright. Se detuvieron los procesos huérfanos identificados y se repitió la misma suite mediante un wrapper con captura de código de salida; la corrida final completa es la registrada arriba.

La comparación visual histórica de ST5-020H se mantiene deliberadamente centrada en el contenido de estación: oculta sólo el nuevo shell global durante las cuatro capturas legadas 020G/020H. El shell se valida por separado en DEBT 009 y el contenido histórico volvió a pasar sin deriva.

## Prueba de no mutación por E2E

Antes y después de la corrida integral final:

- Conjunto de archivos del ticket: 15 rutas, idéntico.
- Huella SHA-256 agregada del contenido del ticket: `66a9d2911eb579a68c48cb16ebb0abda98e19609`, idéntica.
- `docs/visual`: 1039 archivos, idéntico.
- Huella SHA-256 agregada de `docs/visual`: `2cd2c970313cbb972f0b5d7c723d51ef000e901a`, idéntica.

El presente informe se creó después de esa comprobación y constituye la ruta 16 del ticket.

## Archivos del ticket

### Creados

- `docs/status/GVO_DEBT_009_IMMERSIVE_SHELL_AND_QR_NAVIGATION_FOR_REVIEW.md`
- `src/app/qr/qrNavigation.ts`
- `src/app/qr/qrNavigation.test.ts`
- `src/app/shell/GlobalImmersiveShell.tsx`
- `src/app/shell/GlobalImmersiveShell.css`
- `src/app/shell/GlobalImmersiveShell.test.tsx`
- `tests/e2e/gvo-debt-009-immersive-qr-navigation.spec.ts`

### Modificados

- `docs/02_FLUJO_QR_Y_ESTACIONES.md`
- `docs/05_ARQUITECTURA_TECNICA.md`
- `src/app/router.tsx`
- `src/app/routes.ts`
- `src/screens/World4Root/World4RootScreen.tsx`
- `src/screens/World4Root/World4RootScreen.css`
- `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts`
- `tests/e2e/world5-st5-020h.spec.ts`

### Eliminado

- `src/components/qr/QrAccessPlaceholder.tsx`, reemplazado por la resolución QR tipada y sus loaders/guards.

## Alcance preservado y advertencias

- Sin cambios en assets runtime, PWA, precache, service worker, dependencias o lockfile.
- Sin cambios en esquema de progreso, checkpoints, reset, copy FINAL, comportamiento de estaciones ni internals de Mirador.
- Sin cámara, audio, video pesado, recurso externo ni permisos nuevos.
- Sin modificación de identidad de Lía.
- `CURRENT_STATE` no fue modificado.
- El build conserva las advertencias existentes de chunk principal de `818.11 kB` y `PLUGIN_TIMINGS`; no impiden el PASS.
- Durante E2E, el preload registró un timeout con `failed: 0`; no hubo fallo de asset ni de prueba.
- Git advierte conversión futura LF a CRLF en algunos archivos ya rastreados; `git diff --check` permanece limpio.

## Gate humano

La evidencia técnica queda completa, pero la ubicación visual del control global en las estaciones y el comportamiento observable de los enlaces QR/fallback requieren revisión humana. Hasta esa aprobación explícita, el estado final es:

`PENDING_HUMAN_REVIEW`

No existe commit, push ni Pull Request para este ticket.
