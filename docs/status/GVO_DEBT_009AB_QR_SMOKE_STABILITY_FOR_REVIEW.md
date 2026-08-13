# GVO DEBT 009AB — Reconciliación de estabilidad del smoke QR — Para revisión

Fecha de ejecución: 2026-08-13
Estado: `PENDING_HUMAN_REVIEW`

## Resultado

Se eliminó la inestabilidad de las pruebas E2E asociada al handoff Portada → Transición → Mundo I mediante sincronización con estados DOM observables y selectores acotados a cada pantalla.

No se modificó runtime. El contrato QR de DEBT 009A, sus rutas, resolver, guards y pruebas de producción permanecen byte a byte iguales a su estado previo a este ticket.

La suite integral final terminó `141/141 PASS` en 15,3 minutos y con código de salida `0`.

## Baseline

- Baseline obligatorio: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- Rama activa: `main`.
- DEBT 009AB se aplicó sobre el worktree no publicado de DEBT 009 y DEBT 009A.
- Sin commit, push ni Pull Request.

## Investigación obligatoria

### Fallo original del smoke

- Prueba: `tests/e2e/smoke.spec.ts`, escenario `muestra la portada y ejecuta diálogos/gating base en /portada`.
- URL exacta observada durante el fallo: `/portada`.
- Estado esperado primero: Portada en `data-cover-phase="portal_1_opening_placeholder"`, con activación lista y copy `Abriendo Mundo I: Raíz...`.
- Estado esperado después: `/transition/intro-to-station-1`, raíz `data-transition-world-id="intro-to-station-1"`, título `Abriendo Mundo I` y subtítulo `Preparando la raíz.`.
- Estado observado en la corrida integral: Portada aún activa, `role="status"` con `Abriendo Mundo I: Raíz...`; el subtítulo de Transición todavía no existía.
- Estado observado en una repetición aislada: Portada aún activa, `role="status"` con `Preparando el recorrido`, CTA `Entrar a Mundo I` visible y preload crítico pendiente.
- Fase del timeline: espera entre `portal_1_ready`, `portal_1_opening_placeholder` y el montaje de `intro-to-station-1`.
- Estado de preload observado: timeouts de fallback en `coverIntroActivation`, `coverIntroCritical` y `transitionRootCritical`, todos con `failed: 0`. El runtime continuó correctamente cuando concluyó cada estado.
- Selectores anteriores: `page.getByText("Abriendo Mundo I")` y `page.getByText("Preparando la raíz.")`, globales y no acotados por pantalla.
- Clasificación: problema de sincronización y selector, con una expectativa histórica que asumía que ambos copies pertenecían simultáneamente a la misma pantalla. No fue una regresión runtime.

El selector de título anterior admitía coincidencia por substring con el copy de Portada `Abriendo Mundo I: Raíz...`. La prueba avanzaba entonces a buscar el subtítulo exclusivo de Transición antes de que el resolver de preload hubiera montado dicha pantalla.

### Hallazgo secundario durante la corrida integral

- Prueba: `tests/e2e/gvo-debt-009-immersive-qr-navigation.spec.ts`, escenario `el control desaparece fuera de estaciones y no colisiona con revisita`.
- URL exacta: `/estacion/1`, después de volver desde `/final`.
- Estado esperado: control de retorno Final y control inmersivo visibles antes de medir geometría.
- Estado observado: el snapshot accesible contenía ambos botones, pero `page.evaluate` se ejecutó durante el montaje intermedio y uno de los selectores aún no estaba disponible para la consulta síncrona.
- Copy observado: `Volver al Mirador` y `Activar pantalla completa`; Mundo I mostraba `Preparando raíz...`.
- Fase: montaje de revisita en Mundo I.
- Selectores: `[data-final-review-return="active"]` y `[data-gvo-immersive-control="fullscreen"]`.
- Clasificación: sincronización de prueba, no colisión ni regresión del shell.

## Reconciliación aplicada

Se creó el helper E2E `expectCoverToWorldOneHandoff`, que:

1. espera la raíz exacta de Portada `main[data-cover-phase="portal_1_opening_placeholder"]`;
2. confirma `/portada`, `data-activation-assets-ready="true"` y el copy exacto de Portada;
3. espera la raíz exacta de Transición `main[data-transition-world-id="intro-to-station-1"]`;
4. confirma la URL de Transición, `data-critical-assets-ready="true"`, heading y subtítulo acotados a esa raíz;
5. devuelve la raíz de Transición para verificar dentro de ella la ausencia de botones y enlaces.

El helper se reutiliza en el smoke normal y en reduced motion. No usa `waitForTimeout`, no cambia timings del producto, no oculta assertions y no aumenta timeouts globales.

Para la medición secundaria de revisita se espera explícitamente la visibilidad de ambos controles antes de ejecutar el cálculo de intersección. La aserción geométrica continúa intacta.

## Campañas de estabilidad

| Campaña                                                    | Resultado                          |
| ---------------------------------------------------------- | ---------------------------------- |
| Smoke normal + reduced motion, cinco repeticiones cada uno | `10/10 PASS`                       |
| Smoke completo + DEBT 009A, dos repeticiones               | `34/34 PASS`                       |
| Revisita y controles DEBT 009, diez repeticiones           | `10/10 PASS`                       |
| Smoke + DEBT 009 + DEBT 009A                               | `26/26 PASS`                       |
| Suite E2E integral final                                   | `141/141 PASS`, 15,3 min, exit `0` |

La primera suite integral posterior al ajuste de smoke dio `140/141`: el smoke ya pasó, pero expuso la carrera secundaria de montaje en DEBT 009 descrita arriba. Tras reconciliar esa espera, la suite integral definitiva pasó completa.

## Validaciones generales

| Validación             | Resultado                                    |
| ---------------------- | -------------------------------------------- |
| `npm run audit:assets` | PASS; sin URLs externas, CDN ni audio        |
| `npm run lint`         | PASS                                         |
| `npm test`             | PASS; 36 archivos, `482/482`                 |
| `npm run build`        | PASS; 608 módulos y precache de 278 entradas |
| `npm run test:e2e`     | PASS; `141/141`                              |
| `git diff --check`     | PASS                                         |

El build conserva las advertencias conocidas de chunk principal mayor de 500 kB y `PLUGIN_TIMINGS`.

## Integridad de DEBT 009A y evidencia visual

Las siguientes huellas SHA-256 son idénticas antes y después de DEBT 009AB:

- `src/app/qr/qrNavigation.ts`: `140bbccee7dbe8f0e287b9303b816afc7db567c036c4f890c792bb33b514870c`.
- `src/app/qr/qrNavigation.test.ts`: `746001e33578c56e23585148519659767798366beff624881fcf5022283f3f38`.
- `src/app/router.tsx`: `d7bc002139a2f292a990c0bd40a87697a2fb72eac296d043b2ee15ccba20d6b6`.
- `src/app/routes.ts`: `824899dd22073e0bbd0ab281cf7f0fb5662287e695c4473f5d072f76ac62e7a2`.
- `tests/e2e/gvo-debt-009a-production-qr-contract.spec.ts`: `9f39d2cbfcca3f34817812023af78de546f439c3bece3c9ccd106dc77d53464f`.

`docs/visual` conserva 1039 archivos y la huella agregada `2cd2c970313cbb972f0b5d7c723d51ef000e901a`.

## Archivos de DEBT 009AB

### Modificados

- `tests/e2e/smoke.spec.ts`.
- `tests/e2e/gvo-debt-009-immersive-qr-navigation.spec.ts`, sólo para sincronizar la medición de dos controles ya existentes.

### Creado

- `docs/status/GVO_DEBT_009AB_QR_SMOKE_STABILITY_FOR_REVIEW.md`.

## Alcance preservado

- Sin cambios en resolver o rutas QR.
- Sin cambios en guards, progreso, checkpoints o reset.
- Sin cambios en Portada runtime, copy, timings, assets o Transición runtime.
- Sin cambios en Mirador o shell inmersivo.
- Sin cambios en PWA, service worker, dependencias o lockfile.
- Sin cambios de red o MikroTik.
- Sin commit, push o Pull Request.
- Sin modificación del estado canónico.

## Estado

La reconciliación técnica y la suite completa quedan cerradas. El estado continúa sujeto al gate humano:

`PENDING_HUMAN_REVIEW`
