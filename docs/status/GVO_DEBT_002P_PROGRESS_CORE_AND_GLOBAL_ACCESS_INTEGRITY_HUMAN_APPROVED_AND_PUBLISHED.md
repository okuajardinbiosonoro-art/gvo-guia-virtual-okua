# GVO_DEBT_002P — Aprobación humana y publicación de Progress Core and Global Access Integrity

## 1. Identidad y autoridad

| Campo             | Valor                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Proyecto          | GVO — Guía Virtual OKÚA                                                                                                                      |
| Fase              | `PROJECT DEBT CORRECTION`                                                                                                                    |
| Fecha             | 2026-08-05 (`America/Bogota`)                                                                                                                |
| Baseline          | `bfc4ae281533944d90184a22ddd7b7f247811380`                                                                                                   |
| Informe histórico | [GVO_DEBT_002_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_FOR_REVIEW.md](GVO_DEBT_002_PROGRESS_CORE_AND_GLOBAL_ACCESS_INTEGRITY_FOR_REVIEW.md) |
| Autoridad humana  | Ing. José David                                                                                                                              |
| Estado humano     | `HUMAN_APPROVED`                                                                                                                             |
| SHA publicado     | `SELF`                                                                                                                                       |

El informe técnico histórico se conserva byte-idéntico, incluido su estado
`PENDING_HUMAN_REVIEW`. Esta acta posterior registra la aprobación humana
vinculante y la publicación de la implementación descrita por ese informe.

`SELF` identifica el único commit que contiene la implementación, el informe
histórico, esta acta y la actualización mínima de `CURRENT_STATE.md`. Adquiere
efecto de publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Comportamiento aprobado

La aprobación humana comprende los siguientes comportamientos:

- Mundos I, II y III registran completion global únicamente desde su cierre real.
- Mundo IV conserva su cierre y motion; Mundo V conserva `gvo.station5.v1`, su
  flujo 4/4 y su transición al Mirador.
- Escribir directamente una URL no permite saltar Mundos anteriores.
- Las estaciones y las cinco transiciones secuenciales exigen el prefijo global
  completo correspondiente antes de montar contenido protegido.
- Final requiere completion explícita de Mundos I–V.
- Un progreso heredado disperso, como `[4,5]`, se conserva sin autocompletar
  huecos y sin habilitar Mundo V o Final.
- Una revisita desde el Mirador sólo permanece válida mientras el progreso global
  continúe autorizando Final.
- Si falla la persistencia, el Mundo conserva su cierre, no navega como si hubiera
  guardado y ofrece un retry que sólo repite escritura y verificación.
- Un payload corrupto o de versión desconocida falla cerrado, conserva su raw y
  no se sobrescribe silenciosamente.
- Cada escritura exitosa se relee para comprobar su persistencia efectiva.

El recorrido normal `Mundo I → Mundo II → Mundo III → Mundo IV → Mundo V →
Mirador` mantiene prácticamente la misma experiencia visual. Esta publicación
corrige invariantes de progreso, persistencia y acceso; no implementa checkpoints
parciales, no cambia visuales y no reabre el Mirador ni Gates 5–8.

## 3. Contrato publicado

### 3.1 Progreso global

- Key preservada: `localStorage:gvo.progress.v1`.
- Schema canónico: `schemaVersion: 1`, `completedStations` y `updatedAt`.
- Payload legacy sin versión: normalizado en memoria y persistido como v1 sólo
  durante una escritura posterior válida.
- Corrupción, versión desconocida o storage no disponible: fail closed mediante
  resultados discriminados, sin usar excepciones como contrato normal de UI.
- Escritura: verificada mediante relectura y comparación del payload persistido.
- Completion I–V: idempotente, ordenada y sin duplicados.
- Progreso disperso: preservado sin inventar estaciones faltantes.

### 3.2 Acceso global

- Mundo I permanece disponible.
- Mundos II–V exigen todos sus predecesores.
- Las cuatro subrutas tipadas de Mundo V exigen I–IV.
- Las cinco transiciones secuenciales exigen completion coherente hasta su Mundo
  de origen.
- Final y la transición Mundo V → Final comparten el requisito I–V.
- Los bloqueos usan `replace` y el destino seguro calculado por el prefijo
  coherente.
- El contexto de revisita se invalida cuando no coincide con el Mundo o cuando el
  progreso global deja de autorizar Final.

### 3.3 Reset

La allowlist contractual permanece exactamente:

```text
localStorage:gvo.progress.v1
localStorage:gvo.station5.v1
localStorage:gvo.coverIntro.introCompleted.v1
sessionStorage:gvo.final.reviewContext.v1
```

No se añadieron keys, clears globales ni cambios al runtime transaccional. Las
pruebas demuestran eliminación del payload v1 y restauración byte-exacta del raw
legacy o versionado durante rollback.

## 4. Evidencia técnica publicada

| Validación                   | Resultado                     |
| ---------------------------- | ----------------------------- |
| `npm run audit:assets`       | PASS                          |
| `npm run lint`               | PASS                          |
| `npm run test`               | PASS — 349/349 en 30 archivos |
| `npm run build`              | PASS — PWA `generateSW`       |
| Chromium focal               | PASS — 7/7                    |
| Suite E2E histórica completa | `NOT_RUN`                     |

La suite E2E histórica completa no se ejecutó porque mantiene specs con efectos
laterales tracked en `docs/visual/**`. La spec focal de GVO_DEBT_002 cubre guards,
completion I–V, progreso legacy disperso, Final, revisita, fallo/retry y reset sin
crear evidencia tracked.

Warnings conocidos y aceptados:

- chunk JavaScript superior a 500 kB;
- desglose `PLUGIN_TIMINGS` del build;
- avisos Git LF→CRLF sin error en `git diff --check`.

## 5. Alcance preservado

- No se implementaron checkpoints parciales de W1–W4.
- No se corrigieron visuales, composición, layout, halos, assets ni copy editorial
  `FINAL`.
- No se modificaron Mirador, Gates 5–8, Lía, Loading, QR, fullscreen, PWA,
  precache ni route chunking.
- No se resolvieron las deudas visuales de Mundo II ni se hicieron durables los
  registros parciales de Mundo III.
- No se añadieron dependencias ni se modificaron `package.json` o lockfiles.
- La fase completa `PROJECT DEBT CORRECTION` no se declara terminada.

## 6. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_002 — PROGRESS CORE AND GLOBAL ACCESS INTEGRITY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_002 — PROGRESS CORE AND GLOBAL ACCESS INTEGRITY / HUMAN_APPROVED / PUBLISHED
```
