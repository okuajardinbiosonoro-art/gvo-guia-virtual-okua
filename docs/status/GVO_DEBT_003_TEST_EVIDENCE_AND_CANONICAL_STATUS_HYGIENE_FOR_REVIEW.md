# GVO_DEBT_003 — Test Evidence and Canonical Status Hygiene for Review

**Estado:** `PENDING_HUMAN_REVIEW`  
**Resultado técnico:** `GVO_DEBT_003_IMPLEMENTATION_COMPLETE_FOR_REVIEW`  
**Rama:** `main`  
**HEAD validado:** `17dd8aef2b524cb9e4850fc4c96a551fbcb32c8b`

## Alcance cerrado

GVO_DEBT_003 deja implementada la política de evidencia E2E, reconcilia los contratos legacy con la autoridad posterior, corrige la readiness runtime de la activación de Lía en Portada y demuestra una suite completa read-only. Este documento no declara aprobación humana final; concentra la evidencia para revisión.

## Historia completa

1. **Bloqueo 020B.** La primera reanudación de GVO_DEBT_003 se detuvo en `world5-st5-020b.spec.ts`: la spec histórica esperaba estados anteriores a las integraciones posteriores de Mundo V.
2. **Resolución 003A.** GVO_DEBT_003A preservó las garantías propias de 020B, sustituyó sólo expectativas superadas por la autoridad 020C–020H y permitió reanudar el ticket original.
3. **Matriz de 17 fallas.** La primera suite completa reanudada produjo `75 passed / 17 failed`. GVO_DEBT_003B inventarió cada fila antes de corregirla.
4. **Reconciliación 003B.** Las filas se resolvieron por historia vigente, sincronización/scope o adaptación de infraestructura. Las correcciones focales demostraron 36 tests únicos en PASS; F01 quedó pendiente de decisión humana sobre cuál Lía representaba el estado de apertura.
5. **Resolución humana 003C.** La autoridad humana fijó `VISIBLE_PORTAL_ACTIVATION_RIG_THEN_TRANSITION`: `cover-activation-lia` es la representación visible aprobada del Estado A; el avatar genérico permanece oculto y `data-lia-pose` no se traslada. F01 quedó clasificada como `T`.
6. **Prueba correcta del rig.** La spec separó Estado A en `/portada` de Estado B en `/transition/intro-to-station-1`, pero reveló un hallazgo posterior: bajo carga, el nodo existía sin imagen utilizable durante parte o toda la ventana ceremonial.
7. **Hallazgo R01.** GVO_DEBT_003D registró `COVER_ACTIVATION_ASSET_READINESS`: `liaActivatePortal1` no estaba en el preload previo y su primera solicitud nacía al montar el rig, después del clic.
8. **Corrección runtime mínima 003D.** Se creó un bundle dedicado de un solo asset, se inició su preload al montar Portada, se exigió `status === "ready"`, se conservó una única intención pendiente y se agregó un retry controlado sin limpiar caches globales.
9. **Suite final.** La corrida definitiva terminó `93 passed / 0 failed / 0 skipped`; la huella del worktree fue idéntica antes y después.

## Clasificación histórica final

| Categoría                                    | Total |
| -------------------------------------------- | ----: |
| H — `HISTORICAL_EXPECTATION_SUPERSEDED`      |    10 |
| T — `TEST_SYNCHRONIZATION_OR_SCOPE_ERROR`    |     5 |
| I — `GVO_DEBT_003_INFRASTRUCTURE_ADAPTATION` |     2 |
| F — `ENVIRONMENTAL_FLAKE`                    |     0 |
| R — `POSSIBLE_RUNTIME_REGRESSION`            |     0 |
| A — `AMBIGUOUS_OR_HUMAN_DECISION_REQUIRED`   |     0 |

R01 es un hallazgo runtime posterior descubierto al probar el contrato correcto de F01. No reclasifica F01 ni altera la matriz histórica.

## Evidencia R01

### Diagnóstico frío previo

- Antes del clic, el rig y `cover-activation-lia` no existían en DOM.
- Primera solicitud de `lia_pose_activate_portal_1_v1.png`: `+49 ms` después del clic.
- Respuesta HTTP 200: `+176 ms`.
- A `+54 ms`: `currentSrc` vacío, `naturalWidth: 0`, `naturalHeight: 0`, caja con altura `0` y opacidad `0`.
- Primera dimensión natural observada: `941 × 1672` a `+198 ms`.
- `complete: true`: `+445 ms`.
- La carga consumía una parte variable de los 920 ms; por tanto, el Estado A dependía de caché y contención.

### Estrategia implementada

- Bundle anterior: `coverIntroCritical`, sin `liaActivatePortal1`.
- Bundle nuevo: `coverIntroActivation`, compuesto exclusivamente por `coverIntroAssets.liaActivatePortal1`.
- Inicio de preload: al montar `CoverIntroScreen`, antes de que el usuario complete el diálogo.
- Condición real de éxito: `activationPreload.status === "ready"`; timeout/error no habilitan el handoff aunque el booleano genérico de fallback haya terminado.
- Clic durante `loading`: registra una sola intención, conserva `portal_1_ready`, no inicia timer y no navega.
- Paso a `ready`: consume la intención una sola vez e inicia automáticamente `portal_1_opening_placeholder`.
- Error/timeout: conserva Portada segura y permite retry explícito; si una intención pendiente termina en fallo, ejecuta como máximo un retry automático controlado.
- Caché: sólo se expulsa el resultado fallido de la fuente afectada; los resultados exitosos continúan deduplicados.
- Timer: los 920 ms empiezan únicamente después de readiness y entrada real al Estado A.

### Prueba visual y funcional

- Caché fría A: PASS; rig visible, imagen completa, dimensiones naturales positivas y caja positiva.
- Repetición limpia B: PASS.
- Reduced motion C: PASS; misma readiness, mismo handoff y duración contractual preservada.
- Estado A: `/portada`, rig visible, Portal I y CTA deshabilitados, avatar genérico con opacidad `0`.
- Estado B: `/transition/intro-to-station-1`, copy `Abriendo Mundo I` / `Preparando la raíz.`.
- Ruta posterior y navegación única: PASS.
- Doble clic: no duplica timer ni navegación.

## Protección visual y técnica

- CSS modificado: no.
- Assets modificados o sustituidos: no.
- Timing ceremonial de 920 ms: no modificado.
- Posición, escala, opacidad final y composición por capas: sin cambios.
- Identidad de Lía: sin cambios.
- `data-lia-pose`: permanece en el avatar genérico; no se trasladó al rig de activación.
- Audio, video, CDN, fuentes remotas, APIs externas y dependencias nuevas: ninguno.
- `docs/visual/**`: intacto.
- `package-lock.json`: intacto.
- `docs/status/CURRENT_STATE.md`: intacto.

## Validaciones finales

| Validación                                    | Resultado                              |
| --------------------------------------------- | -------------------------------------- |
| `npm run audit:assets`                        | PASS — sin URLs externas, CDN ni audio |
| `npm run lint`                                | PASS                                   |
| `npm run test`                                | PASS — 31 archivos, 358 tests          |
| `npm run build`                               | PASS — TypeScript y Vite               |
| `npx playwright test tests/e2e/smoke.spec.ts` | PASS — 12/12                           |
| Cover focal, caché fría A                     | PASS — 2/2, incluye reduced motion     |
| Cover focal, repetición B                     | PASS — 2/2, incluye reduced motion     |
| `npm run test:e2e`                            | PASS — 93/93                           |
| `git diff --check`                            | PASS                                   |

El build conservó únicamente la advertencia informativa de chunk superior a 500 kB; no produjo error.

## Estabilidad del worktree

- Antes/después de la suite E2E final: 34 paths en ambos snapshots.
- Hash binario del diff antes/después: `639af89ab61764b99678c427104b4f9fe12bd860`.
- SHA-256 de cada path: idénticos antes/después.
- Stage: vacío.
- Rama/HEAD/origin: `main` / `17dd8aef2b524cb9e4850fc4c96a551fbcb32c8b` / mismo SHA.
- Divergencia: `0 0`.
- La suite completa fue read-only.
- Este informe se creó después de demostrar esa estabilidad y es el único documento de cierre añadido por 003D.

## Incidencias intermedias registradas

- Intento global 1: `91 passed / 2 failed`; timeout de activación y presupuesto insuficiente de observación. El runtime falló cerrado en `portal_1_ready`.
- Intento global 2: `92 passed / 1 failed`; el copy `Preparando la raíz.` aparecía legítimamente en status temporal y subtítulo, generando un selector ambiguo.
- Corrección final test-only: selector acotado a `#transition-world-subtitle`, sin debilitar contenido ni cambiar runtime.
- Corrida definitiva: `93 passed / 0 failed / 0 skipped`.

## Estado de revisión

`PENDING_HUMAN_REVIEW`

No se realizó commit, push ni Pull Request.
