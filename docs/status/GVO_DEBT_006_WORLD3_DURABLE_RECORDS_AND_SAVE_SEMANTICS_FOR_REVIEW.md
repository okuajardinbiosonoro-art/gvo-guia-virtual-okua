# GVO_DEBT_006 — World III Durable Records and Save Semantics

**Estado:** `PENDING_HUMAN_REVIEW`  
**Flag:** `GVO_DEBT_006_IMPLEMENTATION_COMPLETE_FOR_REVIEW`  
**Fecha:** 2026-08-05 (`America/Bogota`)  
**Naturaleza:** implementación funcional para revisión humana; no constituye aprobación ni publicación.

## 1. Baseline

| Campo                    | Valor verificado                                                       |
| ------------------------ | ---------------------------------------------------------------------- |
| Repositorio              | `E:/OKUA/04_DESARROLLO_REPOS/gvo-guia-virtual-okua`                    |
| Rama                     | `main`                                                                 |
| `HEAD`                   | `924157ca336db2aa82ac0e50181b187a69d46b53`                             |
| Subject                  | `fix(checkpoints): publish world2 continuity`                          |
| `origin/main`            | `924157ca336db2aa82ac0e50181b187a69d46b53`                             |
| Remoto `refs/heads/main` | `924157ca336db2aa82ac0e50181b187a69d46b53`                             |
| Divergencia              | `0 0`                                                                  |
| Worktree inicial         | limpio                                                                 |
| URL `origin`             | `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git` |
| `git fetch`              | no ejecutado                                                           |

El preflight coincidió con el baseline exacto. La única consulta de red fue
`git ls-remote --heads origin refs/heads/main`; no se ejecutaron otras consultas
de red.

## 2. Arquitectura anterior

Mundo III mantenía `completed` únicamente en memoria React. Las acciones
`Guardar registro` llevaban PLANTA a `completed` antes de cualquier
persistencia y llevaban PROTOTIPO/SEÑAL a `confirmed` antes del `setCompleted`
diferido. Reload o reapertura perdían los tres registros; `AJUSTADO` dependía
del `Set` de la sesión y sólo `Continuar` escribía completion global.

La implementación reutiliza
`src/domain/checkpoints/checkpointStore.ts`. No crea un store paralelo y no
modifica el schema de `gvo.progress.v1`.

## 3. Key, schema y autoridad

Key nueva exacta:

```text
localStorage:gvo.station3.v1
```

Autoridad: `src/domain/checkpoints/world3Checkpoint.ts`.

```ts
type World3CheckpointV1 = {
  schemaVersion: 1;
  completedRecordIds: Station3RecordId[];
  updatedAt: string;
};
```

No se serializan fases narrativas, page-turns, typing, timers, foco, modalidad,
mensajes de Lía, sello transitorio, retry pendiente, geometry ni completion
global.

## 4. Prefix e invariantes

Orden único autorizado:

```text
planta → prototipo → senal
```

Estados estables válidos:

```text
[]
[planta]
[planta, prototipo]
[planta, prototipo, senal]
```

El validator rechaza IDs ajenos, inicio tardío, orden invertido, huecos,
duplicados, timestamps no ISO canónicos y campos extra. El payload debe tener
exactamente `schemaVersion`, `completedRecordIds` y `updatedAt`.

## 5. Lectura, escritura y raw preservado

Estados de lectura:

```text
empty
ok
corrupt
unknown_version
storage_unavailable
```

- JSON corrupto, versión desconocida y shape inválida preservan el raw.
- Un raw inválido nunca se sobrescribe ni se borra automáticamente.
- Excepciones de `getItem`, `setItem` y `removeItem` retornan resultados
  tipados; no son contrato normal de excepción para la UI.
- Cada write relee y compara el payload persistido.
- Cada remove relee y exige ausencia de la key.
- Un write con el mismo estado estable es idempotente y conserva el timestamp
  ya verificado.

## 6. Recovery explícito

Para `corrupt` y `unknown_version`, los controles de registros quedan
bloqueados. La UI permite reintentar lectura o solicitar descarte; el descarte
requiere una segunda confirmación y elimina/verifica sólo
`gvo.station3.v1`. Completion global, checkpoints W1/W2/W4, W5 y familias
ajenas permanecen intactos.

Para `storage_unavailable`, la primera acción disponible es
`Reintentar acceso al guardado`; no se ofrece descarte mientras el backend no
puede verificarse.

## 7. Fresh, restore parcial y completion global

- Fresh: leer `empty` no escribe al montar.
- `[planta]`: PLANTA queda revisitable y PROTOTIPO disponible.
- `[planta, prototipo]`: PLANTA/PROTOTIPO quedan revisitables y SEÑAL
  disponible.
- Prefix completo: los tres registros quedan completados, sello `ready` y CTA
  disponible sin repetir `unlocking`.
- Completion global que contiene Mundo III prevalece sobre checkpoint vacío,
  parcial o inválido: abre los tres registros y sello `ready`, sin borrar ni
  reescribir el raw W3.

## 8. Semántica de Guardar PLANTA

Flujo implementado:

```text
ready
→ write/re-read/verify [planta]
→ confirmed
→ cierre 680 ms
→ índice con Prototipo disponible
```

Si el write falla, PLANTA permanece `ready`, `completed` no contiene PLANTA y
PROTOTIPO sigue locked. Retry repite únicamente el write pendiente: no reinicia
la narrativa, no duplica confirmation timer y no duplica page-turn.

## 9. Semántica de Guardar PROTOTIPO

```text
ready
→ write/re-read/verify [planta, prototipo]
→ confirmed
→ cierre 800 ms
→ índice con Señal disponible
```

`Pista registrada`, `confirmed` y el timer de cierre sólo aparecen después de
persistencia verificada. En fallo, PROTOTIPO permanece `ready`, el prefix sigue
en `[planta]` y SEÑAL permanece locked.

## 10. Semántica de Guardar SEÑAL

```text
ready
→ write/re-read/verify [planta, prototipo, senal]
→ confirmed
→ cierre 800 ms
→ índice
→ stamp unlocking
→ stamp ready
```

En fallo, SEÑAL permanece `ready`, el prefix sigue en dos registros, sello y
CTA permanecen ausentes. El sello no se monta antes del tercer write
verificado.

## 11. Pending action, error y retry

`PendingRecordSave` conserva sólo `recordId` y el siguiente prefix estable.
Hay como máximo una acción pendiente. El lock síncrono y la idempotencia del
store impiden writes duplicados por doble click. Retry consume la misma acción
una sola vez y no serializa estado transitorio.

La acción fallida cambia a `Reintentar`, reutiliza el live region existente y
recibe foco con `preventScroll`. El copy es operativo/TEMP y no altera el copy
editorial aprobado.

## 12. Narrativas incompletas, reload y reopen

- Reload mid-PLANTA vuelve al índice y reabre desde `observe`.
- Reload mid-PROTOTIPO vuelve al índice y reabre desde `assembly`.
- Reload mid-SEÑAL vuelve al índice y reabre desde `capturing`.
- Sólo el prefix durable previo sobrevive.
- Reload después de cada save restaura el registro como completed.
- Una pestaña nueva en el mismo origen restaura el mismo prefix.

No se añadieron stores para secuencias ni se cambiaron callbacks, holds,
typewriter, page-turn o reduced motion.

## 13. Revisita y sello

Un registro guardado abre directamente su summary estático y retorna al índice
sin write. Los tres registros pueden reabrirse en cualquier orden después del
prefix completo.

`unlocking` se conserva únicamente cuando SEÑAL se guarda durante el montaje
actual. Un checkpoint completo restaurado o completion global existente inicia
en `stampStage = ready`; no repite ceremonia ni timers.

## 14. CTA y completion global

`markStationCompleted(3)` continúa invocándose exclusivamente desde
`Continuar`. La navegación ocurre sólo después de write/relectura/verificación
global. El checkpoint W3 completo no se elimina después de completion.

Si completion global falla, los tres registros durables, el sello `ready` y la
revisita permanecen. Su retry repite únicamente completion global y no repite
narrativas, saves de registros, page-turns ni sello. Revisita desde Final abre
Mundo III completo sin reinicio.

## 15. Reset transaccional de ocho keys

La allowlist exacta queda en:

1. `localStorage:gvo.progress.v1`
2. `localStorage:gvo.station1.v1`
3. `localStorage:gvo.station2.v1`
4. `localStorage:gvo.station3.v1` — `world-three-state`
5. `localStorage:gvo.station4.v1`
6. `localStorage:gvo.station5.v1`
7. `localStorage:gvo.coverIntro.introCompleted.v1`
8. `sessionStorage:gvo.final.reviewContext.v1`

Snapshot, delete, verify, rollback y retry abarcan las ocho keys. Raw W3
corrupto o de versión desconocida se restaura byte-exacto ante fallo
intermedio. Preferencias de accesibilidad, orientación/tap hints, Cache Storage,
configuración, credenciales/tokens, datos ajenos y presets de desarrollo se
preservan.

## 16. Paths y archivos

### Creados

- `src/domain/checkpoints/world3Checkpoint.ts`
- `src/domain/checkpoints/world3Checkpoint.test.ts`
- `tests/e2e/gvo-debt-006-world3-durable-records.spec.ts`
- `docs/status/GVO_DEBT_006_WORLD3_DURABLE_RECORDS_AND_SAVE_SEMANTICS_FOR_REVIEW.md`

### Modificados

- `src/screens/World3Root/World3RootScreen.tsx`
- `src/screens/World3Root/World3RootScreen.test.tsx`
- `src/screens/World3Root/station3Content.ts`
- `src/app/reset/journeyResetPolicy.ts`
- `src/app/reset/resetGvoJourney.test.ts`
- `tests/e2e/gvo-debt-002-progress-integrity.spec.ts`

No fue necesario modificar `checkpointStore.ts`, `resetGvoJourney.ts` ni
`src/shared/progress/**`.

## 17. Unit e integration

La cobertura nueva protege:

- cuatro prefijos válidos y todas las formas inválidas requeridas;
- raw preservado, storage unavailable, write/remove verification e
  idempotencia;
- fresh sin write, restores parciales/completo y precedencia global;
- fallo/retry de PLANTA, PROTOTIPO y SEÑAL;
- orden persist → confirmed → unlock;
- doble click, foco y live region;
- restart de las tres narrativas incompletas;
- revisita, sello current-session y sello restaurado;
- completion global fallida con checkpoint intacto;
- reset de ocho keys y rollback byte-exacto W3.

Resultado formal: `34` archivos de test, `464/464` pruebas PASS.

## 18. E2E focal

`tests/e2e/gvo-debt-006-world3-durable-records.spec.ts` cubre por UI real:

- fallo/retry de PLANTA, reload y unlock de PROTOTIPO;
- save/reload de PROTOTIPO y revisita summary de PLANTA;
- fallo/retry de SEÑAL, sello y CTA;
- fallo/retry de completion global y transición a W4;
- revisita desde Final sin reinicio;
- reload durante narrativa incompleta;
- reapertura en pestaña nueva;
- reset real de ocho keys con familias ajenas preservadas.

Resultado final focal: `3/3` PASS.

## 19. Suite completa

| Validación             | Resultado                            |
| ---------------------- | ------------------------------------ |
| `npm run audit:assets` | PASS — sin URL externa, CDN ni audio |
| `npm run lint`         | PASS                                 |
| `npm run test`         | PASS — 464/464 en 34 archivos        |
| `npm run build`        | PASS — PWA `generateSW`, 606 módulos |
| E2E focal DEBT_006     | PASS — 3/3                           |
| `npm run test:e2e`     | PASS — 103/103, un worker            |
| `git diff --check`     | PASS                                 |

La suite completa incluye los 3 E2E focales; se ejecutaron además por separado
como comando obligatorio.

## 20. Prueba read-only de E2E

Las huellas se tomaron inmediatamente antes y después de
`npm run test:e2e`, antes de crear este informe:

| Evidencia                      | Before                                                             | After    |
| ------------------------------ | ------------------------------------------------------------------ | -------- |
| status SHA-256                 | `173eddc9bd84a643f52597f3a919c9bb9e6bab8e21d1da720ca52efe511ee68b` | idéntico |
| name-status SHA-256            | `6580f7b9eb053efa8cdf6ac31c740877ff8097589125b6041a30ca05a248c837` | idéntico |
| stat SHA-256                   | `f9a56f65acf396ac75fca460d79c31b69a76c9d227a858443af7f15df38a8883` | idéntico |
| diff binario Git hash          | `d1595b498b6173332fe1f8e603d9f685c8ad01b2`                         | idéntico |
| manifest SHA-256 de 9 paths    | `8a8ba303eb46b366507824ba88e8159c4f1ee99809f85723e63bc216453bd895` | idéntico |
| `docs/visual` manifest SHA-256 | `cf40c095e695e26ba96a0e1c95ade4ca758e620b68ea2fb4c734924c87a21bbc` | idéntico |

Cada SHA-256 por path también coincidió before/after. La suite no produjo
mutaciones tracked ni alteró `docs/visual/**`; los outputs normales quedaron en
paths ignorados.

## 21. Visuales, assets, copy y timings

- Cero CSS modificado.
- Cero assets, manifests de assets o binarios modificados.
- Cero copy editorial aprobado modificado.
- Sólo se añadió copy operativo/TEMP de error y recovery.
- Cierre PLANTA: `680 ms`, intacto.
- Cierre PROTOTIPO: `800 ms`, intacto.
- Cierre SEÑAL: `800 ms`, intacto.
- Page-turn normal/reduced: `680/120 ms`, intacto.
- Sello normal/reduced: `1500/320 ms`, intacto.
- Holds, typewriter, trace y callbacks narrativos: intactos.
- Cero audio, CDN, servicios externos, permisos o dependencias nuevas.

## 22. Warnings

- Build: chunk principal `813.85 kB` minificado, warning >500 kB ya conocido.
- Build: desglose informativo `PLUGIN_TIMINGS`.
- E2E focal: warning operativo de preload de portada por timeout, con cero
  assets fallidos; la prueba y la suite completa pasaron.
- Git: avisos informativos LF→CRLF; `git diff --check` pasa.

## 23. Gaps

No quedan gaps conocidos dentro del alcance funcional de GVO_DEBT_006. No se
declara aprobación humana, publicación ni cierre global de deuda.

## 24. Riesgos residuales

- Web Storage puede quedar indisponible por cuota o política de plataforma; el
  runtime falla cerrado y ofrece retry, pero no puede garantizar disponibilidad
  del navegador.
- El copy operativo permanece TEMP por contrato.
- El warning de tamaño de bundle/PWA y coste de precache permanece fuera de
  alcance.

## 25. Alcance preservado

- W1, W2, W4, W5, Final y Mirador: runtime intacto.
- Guards y schema global: intactos.
- CSS, visuales, assets, identidad de Lía, PWA, QR, dependencias y lockfile:
  intactos.
- `docs/visual/**`: intacto.
- `docs/status/CURRENT_STATE.md`: intacto.
- No se creó acta de aprobación.

## 26. Control Git y estado final

- Commit: no ejecutado.
- Push: no ejecutado.
- Pull Request: no creado.
- `git fetch`: no ejecutado.
- Stage: vacío.
- Rama: `main`.
- Estado: `PENDING_HUMAN_REVIEW`.

`GVO_DEBT_006_IMPLEMENTATION_COMPLETE_FOR_REVIEW`
