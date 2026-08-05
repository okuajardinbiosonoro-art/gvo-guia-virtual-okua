# GVO_DEBT_002 — Progress Core and Global Access Integrity

**Estado:** `PENDING_HUMAN_REVIEW`  
**Flag:** `GVO_DEBT_002_IMPLEMENTATION_COMPLETE_FOR_REVIEW`  
**Fecha de ejecución:** 2026-08-05

## 1. Baseline verificado

| Comprobación             | Resultado                                                              |
| ------------------------ | ---------------------------------------------------------------------- |
| Root                     | `E:\OKUA\04_DESARROLLO_REPOS\gvo-guia-virtual-okua`                    |
| Rama                     | `main`                                                                 |
| HEAD                     | `bfc4ae281533944d90184a22ddd7b7f247811380`                             |
| Commit                   | `docs(debt): publish approved project debt audit`                      |
| `origin/main` local      | `bfc4ae281533944d90184a22ddd7b7f247811380`                             |
| `refs/heads/main` remoto | `bfc4ae281533944d90184a22ddd7b7f247811380`                             |
| Divergencia              | `0 0`                                                                  |
| Worktree inicial         | limpio                                                                 |
| Origin                   | `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git` |
| `git fetch`              | no ejecutado                                                           |

La implementación partió del baseline obligatorio y no creó commits ni publicó cambios.

## 2. Arquitectura anterior

El progreso global se persistía bajo `localStorage:gvo.progress.v1`, pero el
payload no tenía versión explícita. La lectura reducía estados inválidos a un
progreso vacío y la escritura no exponía de forma discriminada corrupción,
versiones desconocidas, excepciones de storage ni fallos de verificación.

`canOpenStation()` existía como función de dominio, pero no protegía las rutas.
Mundo IV y Mundo V escribían completion global; Mundos I–III navegaban desde su
cierre sin registrar completion. Esto permitía progreso disperso y una llegada a
Final que no demostraba el prefijo completo I–V.

El contexto de revisita desde Final seguía su contrato propio, sin comprobar que
el progreso global vigente continuara autorizando Final.

## 3. Contrato implementado

### 3.1 Schema, lectura y escritura

Se mantiene la única key `gvo.progress.v1`. El documento canónico es:

```ts
type GvoProgressV1 = {
  schemaVersion: 1;
  completedStations: StationId[];
  updatedAt: string | null;
};
```

`readProgress()` devuelve un resultado discriminado con estados `empty`, `ok`,
`legacy`, `corrupt`, `unknown_version` y `storage_unavailable`.

- El payload legacy sin `schemaVersion` se normaliza sólo en memoria durante una
  lectura pura. Una escritura válida posterior lo persiste como v1.
- Los IDs no válidos se eliminan; los válidos se deduplican y ordenan.
- Un `updatedAt` inválido se normaliza a `null`.
- Una versión distinta de 1 falla cerrada y conserva el raw sin reinterpretarlo.
- JSON inválido u objeto incompatible falla cerrado y conserva el raw.
- Las excepciones de `getItem`, `setItem` y lectura posterior se convierten en
  resultados tipados, sin crash de UI.
- Una escritura se considera exitosa sólo después de releer y comprobar el
  documento persistido.
- `markStationCompleted()` es idempotente y no reescribe una estación ya
  completada.

### 3.2 Progreso disperso

La completion dispersa válida se conserva sin rellenar huecos. Por ejemplo,
`[4,5]` sigue siendo `[4,5]`; no abre Mundo IV, Mundo V ni Final. Cuando el
usuario complete I, II y III, el mismo conjunto pasa a ser coherente sin exigir
repetir IV y V.

| Completion almacenada | Prefijo coherente | Estación normal más avanzada        |
| --------------------- | ----------------: | ----------------------------------- |
| `[]`                  |                 0 | Mundo I                             |
| `[1]`                 |                 1 | Mundo II                            |
| `[1,2]`               |                 2 | Mundo III                           |
| `[1,2,3]`             |                 3 | Mundo IV                            |
| `[1,2,3,4]`           |                 4 | Mundo V                             |
| `[4,5]`               |                 0 | Mundo I                             |
| `[1,4,5]`             |                 1 | Mundo II                            |
| `[1,2,3,4,5]`         |                 5 | Final cuando la solicitud sea Final |

## 4. Guards globales

Los loaders de `src/app/router.tsx` resuelven el acceso antes de montar contenido
protegido. Los redirects usan `replace` y apuntan al destino seguro calculado por
el prefijo completo.

| Familia                            | Regla aplicada                                       |
| ---------------------------------- | ---------------------------------------------------- |
| `/estacion/1`                      | siempre permitida                                    |
| `/estacion/2` a `/estacion/5`      | exige todos los Mundos anteriores                    |
| cuatro subrutas tipadas de Mundo V | exigen I–IV                                          |
| Portada → Mundo I                  | permanece libre                                      |
| cinco transiciones secuenciales    | exigen completion coherente hasta su Mundo de origen |
| `/final`                           | exige explícitamente I–V                             |

La misma política de dominio alimenta `requireStationAccess()`,
`requireTransitionAccess()` y `requireFinalAccess()`. Corrupción, versión
desconocida o storage no disponible permiten únicamente el destino seguro Mundo I.
Un guard bloqueado invalida cualquier contexto de revisión de Final incompatible.

## 5. Completion por Mundo

| Mundo | Cierre real conectado                              | Comportamiento ante persistencia                              |
| ----- | -------------------------------------------------- | ------------------------------------------------------------- |
| I     | acción Continuar tras `ready_to_continue`          | marca I antes de navegar a la transición                      |
| II    | acción final tras el resultado y `journeyComplete` | no escribe por capas parciales; marca II en cierre            |
| III   | cierre posterior a tres registros y sello listo    | no persiste registros individuales; marca III al continuar    |
| IV    | asentamiento final de la cadena existente          | conserva el cierre; adapta el resultado tipado y verificado   |
| V     | cierre 4/4 existente                               | conserva `gvo.station5.v1`; marca V y sólo abre Final con I–V |

No se añadieron checkpoints parciales. Una revisita o un retry de una completion
ya persistida no duplica el registro ni repite la interacción de cierre.

## 6. Error y retry operacional

Los cinco cierres consumen el mismo contrato y copy operativo TEMP:

```text
No fue posible guardar tu progreso. Intenta nuevamente.
Reintentar
```

Ante fallo, la pantalla permanece en el cierre alcanzado, no navega y no anuncia
éxito. El retry sólo repite lectura, escritura y verificación; no reinicia
narrativa, capas, registros, nodos, motion ni áreas. El error usa el live region
existente o el patrón accesible compatible de la pantalla, y el botón nativo de
retry recibe foco de forma predecible.

No se creó modal ni CSS nuevo, y el copy no se registra como editorial `FINAL`.

## 7. Compatibilidad con revisión desde Final

Se preservan navigation state y el fallback
`sessionStorage:gvo.final.reviewContext.v1`. `FinalReviewModeLayout` valida además
que el progreso global actual autorice Final tanto al resolver el contexto como
al usar `Volver al Mirador`.

Un contexto antiguo, corrupto, dirigido a otro Mundo o asociado a progreso
incompleto se elimina y no crea overlay de retorno. Si el progreso deja de ser
coherente antes de volver, la navegación se reemplaza por el destino seguro. No
se cambió copy, CSS, posición ni apariencia del control.

## 8. Compatibilidad con reset

La allowlist sigue siendo exactamente:

```text
localStorage:gvo.progress.v1
localStorage:gvo.station5.v1
localStorage:gvo.coverIntro.introCompleted.v1
sessionStorage:gvo.final.reviewContext.v1
```

No se añadieron keys ni se modificó el runtime transaccional. Las pruebas ahora
demuestran eliminación del payload canónico v1, restauración byte por byte del
raw legacy o versionado durante rollback y preservación del snapshot nuevo al
reintentar.

## 9. Paths modificados y justificación

### Dominio y router

- `src/domain/progress/progress.types.ts`: tipos canónicos y resultados discriminados.
- `src/domain/progress/progress.storage.ts`: parsing, migración, persistencia verificada, prefijo y acceso.
- `src/app/routes.ts`: mapa tipado de rutas de estaciones usado por guards.
- `src/app/router.tsx`: loaders de estaciones, subrutas, transiciones y Final.
- `src/app/review/FinalReviewModeLayout.tsx`: integridad global de revisita y retorno.
- `src/shared/progress/progressSaveError.ts`: copy operativo TEMP compartido.

### Cierres de Mundos

- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World3Root/World3RootScreen.tsx`
- `src/screens/World4Root/World4RootScreen.tsx`
- `src/screens/World5Root/World5RootScreen.tsx`

Cada archivo conecta únicamente su cierre real con completion verificada y retry.

### Pruebas

- `src/domain/progress/progress.test.ts`
- `src/app/router.test.tsx`
- `src/app/review/FinalReviewModeLayout.test.tsx`
- `src/app/reset/resetGvoJourney.test.ts`
- pruebas `World1RootScreen.test.tsx` a `World5RootScreen.test.tsx`
- `tests/e2e/gvo-debt-002-progress-integrity.spec.ts`

El presente informe es el único documento nuevo tracked. No se modificó
`CURRENT_STATE.md` ni documentación histórica.

## 10. Validación técnica

| Comando                              | Resultado                                                   |
| ------------------------------------ | ----------------------------------------------------------- |
| `npm run audit:assets`               | PASS                                                        |
| `npm run lint`                       | PASS                                                        |
| `npm run test`                       | PASS — 30 archivos, 349 tests                               |
| `npm run build`                      | PASS — Vite y PWA `generateSW`                              |
| Chromium focal                       | PASS — 7/7 tests, ejecución final completa de la spec nueva |
| `git diff --check` previo al informe | PASS                                                        |

El primer intento completo de Chromium obtuvo 4/7 por sincronización de la spec:
navegación directa repetida con `ERR_ABORTED`, una comprobación de W4 antes del
callback y un locator estricto sobre texto duplicado. Se corrigió sólo la prueba
focal; los tres casos fallidos pasaron de forma dirigida y la ejecución final
completa pasó 7/7 en aproximadamente 3,5 minutos.

La evidencia Chromium cubre entradas directas y transición bloqueada; cierres UI
de W1–W3; W4/W5; legacy disperso; fallo de `setItem`, foco y retry; revisita,
refresh e invalidación; reset y guards posteriores. Los fixtures de storage se
usan sólo dentro de la prueba automatizada.

No se ejecutó la suite E2E histórica completa porque sus specs todavía escriben
evidencia tracked en `docs/visual`. La spec focal nueva escribe únicamente en
outputs ignorados de Playwright y no dejó artefactos tracked.

## 11. Warnings, gaps y riesgos residuales

- Build: warning conocido por chunk JavaScript mayor de 500 kB y desglose
  `PLUGIN_TIMINGS`; no apareció un warning funcional nuevo.
- Git informa conversión futura LF → CRLF en archivos tocados; `diff --check`
  permanece limpio.
- El estado de error usa la presentación mínima ya disponible y queda pendiente
  de aprobación humana visual/editorial.
- No se ejecutó la E2E histórica completa por el side effect documental descrito;
  la cobertura obligatoria del ticket se concentró en la nueva spec 7/7.
- Corrupción o versión desconocida se preservan deliberadamente y requieren una
  decisión explícita posterior para recuperación; este ticket no borra evidencia.

## 12. Control de alcance

- Checkpoints parciales W1–W4: no implementados.
- Visuales, CSS, halos, layout, geometría y responsive: intactos.
- Assets, manifests, mirrors y `current-used`: intactos.
- Mirador y Gates 5–8: intactos.
- `FinalRootScreen`, `FinalLiaMotion`, QR, Loading, PWA y route chunking: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- Allowlist de reset: sin ampliación.
- `localStorage.clear()` / `sessionStorage.clear()`: no usados.
- Paths fuera de alcance: ninguno modificado.
- Commit: no realizado.
- Push: no realizado.
- Pull Request: no creado.
- `git fetch`: no ejecutado.

## 13. Estado

La implementación queda en `PENDING_HUMAN_REVIEW`. Este documento no declara
`HUMAN_APPROVED`, `PUBLISHED` ni cierre global de la fase.

`GVO_DEBT_002_IMPLEMENTATION_COMPLETE_FOR_REVIEW`
