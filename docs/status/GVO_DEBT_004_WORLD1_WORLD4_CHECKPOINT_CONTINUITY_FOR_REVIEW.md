# GVO_DEBT_004 — World I and World IV checkpoint continuity

Estado: `PENDING_HUMAN_REVIEW`

## 1. Baseline

- Repositorio: `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git`.
- Rama autorizada: `main`.
- `HEAD`: `9071d751e8919ffd4bfc6255e5bc5494f5fdf2b8`.
- `origin/main` local: `9071d751e8919ffd4bfc6255e5bc5494f5fdf2b8`.
- `refs/heads/main` remoto: `9071d751e8919ffd4bfc6255e5bc5494f5fdf2b8`.
- Divergencia inicial: `0 0`.
- Worktree inicial: limpio.
- Commit baseline: `fix(testing): publish read-only e2e and cover readiness`.
- `git fetch`: no ejecutado.

## 2. Arquitectura anterior

- Mundo I conservaba sólo `activeConcept` en memoria. `getNodeState` derivaba
  bloqueo y disponibilidad exclusivamente de ese valor, por lo que reload o
  revisita reiniciaban el recorrido en `intro`.
- Mundo IV conservaba `phase`, `activeIndex` y `progress` sólo en memoria. El
  asentamiento de nodo se resolvía en `onStepSettled`, la cadena en
  `onChainSettled` y la completion global en `persistStationCompletion`.
- El reset transaccional tenía cuatro entradas autorizadas.

La implementación mantiene una única autoridad nueva en
`src/domain/checkpoints/**`. No se creó una autoridad paralela bajo
`src/shared/checkpoints/**`.

## 3. Keys

- `localStorage:gvo.station1.v1`.
- `localStorage:gvo.station4.v1`.

Ambas son independientes de `localStorage:gvo.progress.v1` y entre sí.

## 4. Schemas

Mundo I:

```ts
type World1CheckpointV1 = {
  schemaVersion: 1;
  activeConcept:
    | "intro"
    | "relation"
    | "perception"
    | "mediation"
    | "ready_to_continue";
  highestReachedConcept:
    | "intro"
    | "relation"
    | "perception"
    | "mediation"
    | "ready_to_continue";
  updatedAt: string;
};
```

Mundo IV:

```ts
type World4CheckpointV1 = {
  schemaVersion: 1;
  highestSettledIndex: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  resumeMode: "reading" | "chain_pending" | "completion_retry";
  updatedAt: string;
};
```

Los timestamps deben ser ISO canónicos verificables. W1 falla cerrado si
`activeConcept` supera `highestReachedConcept`. W4 acepta `reading` sólo para
`-1..6` y exige índice `7` para `chain_pending` o `completion_retry`.

## 5. Recovery

El store común ofrece estados `empty`, `ok`, `corrupt`, `unknown_version` y
`storage_unavailable`; write y remove se releen y verifican. Las excepciones de
`getItem`, `setItem` y `removeItem` se convierten en resultados discriminados.

- `corrupt` y `unknown_version` preservan raw y no permiten sobrescritura.
- La UI informa el fallo y exige `Restablecer avance de este mundo` más
  confirmación.
- El recovery elimina y verifica únicamente la key de ese Mundo.
- `storage_unavailable` ofrece primero `Reintentar`, sin reset destructivo.
- Completion global y datos de otros Mundos se conservan.

Los copies operativos nuevos están marcados `TEMP`; no se registraron como
copy editorial final.

## 6. Reset de seis keys

Allowlist exacta y ordenada:

1. `localStorage:gvo.progress.v1` — `global-progress`.
2. `localStorage:gvo.station1.v1` — `world-one-state`.
3. `localStorage:gvo.station4.v1` — `world-four-state`.
4. `localStorage:gvo.station5.v1` — `world-five-state`.
5. `localStorage:gvo.coverIntro.introCompleted.v1` — `cover-completion`.
6. `sessionStorage:gvo.final.reviewContext.v1` — `final-review-context`.

El snapshot contiene las seis entradas. Las pruebas demuestran success,
rollback por fallo intermedio, verificación, retry con snapshot nuevo y
restauración byte-exacta incluso para raw corrupto o de versión desconocida.
No existe `localStorage.clear()` ni `sessionStorage.clear()` en runtime.

## 7. Contrato Mundo I

- Fresh: `active=intro`, `highest=intro`; no escribe al montar.
- Cada transición estable se persiste y verifica antes de cambiar la UI.
- Volver a una sección visitada cambia `active` sin reducir `highest`.
- `ready_to_continue` se persiste antes de habilitar el CTA final.
- Completion global sigue ocurriendo sólo al activar `Continuar`.
- Si completion global falla, el checkpoint final permanece y retry no repite
  narrativa.
- Completion global existente eleva `highest` a `ready_to_continue`; un
  `active` válido previo puede conservarse para revisión.

## 8. Matriz de nodos Mundo I

Regla canónica:

| Relación entre nodo y checkpoint | Estado | Acción |
| --- | --- | --- |
| Nodo igual a `activeConcept` | `active` | botón nativo accionable |
| Nodo menor o igual a `highestReachedConcept`, no activo | `completed` | botón nativo accionable |
| Nodo inmediatamente posterior a `highestReachedConcept` | `available` | botón nativo accionable |
| Nodo posterior al siguiente | `locked` | deshabilitado |

Ejemplos verificados:

- `highest=perception`, `active=relation`: Relación active, Percepción
  completed/clickable, Mediación available.
- `highest=mediation`, `active=perception`: Relación completed, Percepción
  active, Mediación completed/clickable.
- `highest=ready_to_continue`, `active=relation`: los tres nodos están
  alcanzados; Mediación permite regresar a ready mediante `Cerrar raíz`.

## 9. Contrato Mundo IV

- Fresh conserva entry completa y secuencia 1→8.
- `reading` restaura progreso y nodo estable con entry abreviada.
- Un nodo 0..6 asentado escribe `reading` antes de desbloquear el siguiente.
- El nodo 7 asentado escribe `chain_pending` antes de iniciar la cadena.
- Completion global verificada elimina y verifica el checkpoint parcial.
- Completion global existente prevalece sobre cualquier checkpoint parcial y
  conserva la revisita publicada.

## 10. Estados estables y transitorios

Persistidos:

- W1: `activeConcept` y `highestReachedConcept`.
- W4: `highestSettledIndex` y `resumeMode`.

No persistidos:

- W1: scroll, focus, hover, preload, pose derivada y variables RAF/CSS.
- W4: `entering`, `moving`, `chain`, `exiting`, `node_arrival`,
  `node_active`, `node_settle`, epoch, timers, `cardMotion`, `liaNote`, hints,
  display mode, orientación y selección de revisita.

## 11. `chain_pending`

Representa nodo 7 asentado con cadena aún no completada. Restore usa entry
abreviada y, cuando el documento está visible, ejecuta la cadena completa desde
el inicio. `chainStartedRef` impide duplicarla. Reduced motion y visibility
handling siguen delegados al motion controller publicado.

## 12. `completion_retry`

Representa cadena ya terminada con completion global no verificada. Restore
entra en `exit_ready`, muestra error, enfoca retry y no repite la cadena. El
primer gesto de retry sólo verifica completion global y elimina el checkpoint;
la salida requiere después el CTA normal.

## 13. Reload y reopen

- W1 restaura todos los conceptos estables, active/highest y ready.
- W4 restaura índices `-1..6`, chain pendiente y completion retry sin continuar
  motion a mitad.
- La E2E focal valida reload real y nueva pestaña compartiendo el storage del
  origen.

## 14. Revisita

- W1 completado sin checkpoint abre en ready, no en intro.
- W1 completado con checkpoint válido conserva active y trata todo el Mundo
  como alcanzado.
- W4 completado conserva entry abreviada, progreso 8/8, `exit_ready` y revisión
  libre de nodos.
- La selección libre de W4 completado no se serializa.

## 15. Errores y retry

- Un write fallido de W1 mantiene la UI anterior; retry repite sólo la
  persistencia y enfoca el destino lógico.
- Un write fallido de nodo W4 mantiene el visual asentado, bloquea input y no
  aumenta el progreso durable hasta verificar retry.
- Si falla el write de nodo 7, la cadena no inicia.
- Si falla completion, se persiste `completion_retry` cuando el storage lo
  permite y no se repite la cadena.
- Si falla la eliminación posterior a completion, se bloquea la salida hasta
  verificar el cleanup mediante retry.

## 16. Paths modificados

Creados:

- `src/domain/checkpoints/checkpointStore.ts`.
- `src/domain/checkpoints/checkpointStores.test.ts`.
- `src/domain/checkpoints/world1Checkpoint.ts`.
- `src/domain/checkpoints/world4Checkpoint.ts`.
- `tests/e2e/gvo-debt-004-world1-world4-checkpoint-continuity.spec.ts`.
- `docs/status/GVO_DEBT_004_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_FOR_REVIEW.md`.

Modificados:

- `src/app/reset/journeyResetPolicy.ts`.
- `src/app/reset/resetGvoJourney.test.ts`.
- `src/screens/World1Root/World1RootScreen.tsx`.
- `src/screens/World1Root/World1RootScreen.test.tsx`.
- `src/screens/World4Root/World4RootScreen.tsx`.
- `src/screens/World4Root/World4RootScreen.test.tsx`.
- `tests/e2e/gvo-debt-002-progress-integrity.spec.ts`.

## 17. Unit/integration tests

- `npm run test`: PASS.
- Test files: `32/32`.
- Tests: `408/408`.
- Focal storage/reset/W1/W4 previo: `116/116`.
- Cobertura agregada: read/write/remove, corrupción, unknown version, shape y
  timestamp inválidos, excepciones, idempotencia, verificación, raw preservado,
  recovery explícito, reload, active/highest, chain pending, completion retry,
  reduced motion, visibility y reset transaccional.

## 18. E2E focal

Comando:

```text
npx playwright test tests/e2e/gvo-debt-004-world1-world4-checkpoint-continuity.spec.ts
```

Resultado final: `3/3 PASS`.

- W1: fresh, write failure/retry, Relación, Percepción, vuelta atrás, reload,
  Mediación, ready, completion, Final y nueva pestaña.
- W4: partial reading, reload, fixture identificada `chain_pending`, fallo de
  completion, reload `completion_retry`, finalización y revisita libre.
- Reset: ejecución real, seis keys eliminadas y familias ajenas preservadas.

Una primera ejecución tuvo timeout ambiental durante el primer `page.goto` del
`beforeEach`; W1 no llegó a ejecutarse. Se elevó el timeout global de la spec y
las dos ejecuciones focales completas posteriores cerraron `3/3 PASS`.

## 19. E2E completa

- `npm run test:e2e`: PASS.
- Total: `96/96` con un worker Chromium.
- Duración: `9.2m`.
- La suite histórica pasó completa y las tres pruebas DEBT_004 quedaron
  incluidas como casos 24–26.

## 20. Worktree read-only

Se tomaron huellas inmediatamente antes y después de `npm run test:e2e`, antes
de crear este informe:

- Status before/after: idéntico, 7 tracked modificados y 5 untracked.
- Manifest SHA-256 de los 12 paths: before/after
  `87CBA3CFABB412AFA35063BA1E861F3E420EE3BE3E3A4703A840DBCA8845BFA9`.
- Diff binario tracked SHA-256: before/after
  `E3006D3A17ED85D3D739877C5FC8CF7BA3CE4E2D17D4E8C5A386D19E853243F5`.
- `docs/visual`: `1039` archivos before/after.
- Manifest `docs/visual` SHA-256 before/after:
  `EC4520E46B59238D07A3679A4D677C90599FA4AB53D27AF3186E97738F8322D0`.

No hubo escritura E2E en paths versionados ni en `docs/visual`.

## 21. Warnings

- Build PASS con warning conocido de chunk principal mayor a 500 kB.
- Build informó tiempos significativos en plugins `vite:asset`,
  `vite:prepare-out-dir`, `vite:css` y `vite:css-post`.
- La E2E completa emitió un warning de preload fallback por timeout de
  `coverIntroCritical`; las `96/96` pruebas pasaron.
- Git informó advertencias informativas LF→CRLF en archivos tracked del diff.
- Primera ejecución focal: timeout de arranque descrito en la sección 18;
  resuelto y no reproducido en las ejecuciones finales.

## 22. Gaps

- No quedan gaps funcionales conocidos dentro del alcance W1/W4 de este
  ticket.
- Checkpoints de W2 y W3 permanecen fuera de alcance.
- Falta exclusivamente revisión humana de esta implementación.

## 23. Riesgos residuales

- Si Web Storage permanece indisponible, el flujo queda cerrado con retry; no
  se afirma guardado ni se navega.
- Corrupción del store global `gvo.progress.v1` conserva el tratamiento ya
  publicado; este ticket no modifica su schema ni recovery.
- Los warnings de chunk/preload son deuda previa no ampliada por DEBT_004.

## 24. Control de publicación

- Commit: no creado.
- Push: no ejecutado.
- Pull Request: no creado ni sugerido.
- Stage: no ejecutado.
- `git fetch`: no ejecutado.

## 25. Estado final

- `audit:assets`: PASS, sin URL externa, CDN ni audio.
- `lint`: PASS.
- Unit/integration: `408/408 PASS`.
- Build: PASS.
- E2E focal: `3/3 PASS`.
- E2E completa: `96/96 PASS`.
- CSS/layout: sin cambios.
- Assets: sin cambios.
- Motion timings: sin cambios.
- W2/W3/W5/Final/Mirador: sin cambios funcionales.
- PWA, dependencias y lockfile: sin cambios.
- `CURRENT_STATE.md`: sin cambios.
- Estado: `PENDING_HUMAN_REVIEW`.
