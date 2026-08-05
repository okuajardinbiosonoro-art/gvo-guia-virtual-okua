# GVO_DEBT_003P — Aprobación humana y publicación de Test Evidence and Canonical Status Hygiene

## 1. Identidad y autoridad

| Campo | Valor |
| --- | --- |
| Proyecto | GVO — Guía Virtual OKÚA |
| Fase | `PROJECT DEBT CORRECTION` |
| Fecha | 2026-08-05 (`America/Bogota`) |
| Baseline | `17dd8aef2b524cb9e4850fc4c96a551fbcb32c8b` |
| Informe histórico | [GVO_DEBT_003_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_FOR_REVIEW.md](GVO_DEBT_003_TEST_EVIDENCE_AND_CANONICAL_STATUS_HYGIENE_FOR_REVIEW.md) |
| Autoridad humana | Ing. José David |
| Estado humano | `HUMAN_APPROVED` |
| SHA publicado | `SELF` |

El informe técnico histórico permanece byte-idéntico y conserva su estado
`PENDING_HUMAN_REVIEW`. Esta acta posterior registra la aprobación humana
vinculante y la publicación del changeset descrito allí.

`SELF` identifica el único commit que contiene la implementación, el informe
histórico, esta acta y la actualización mínima de `CURRENT_STATE.md`. Adquiere
efecto de publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- una suite E2E normal read-only, cuyos outputs productores quedan bajo
  `test-results/evidence/<scope>/` y no modifican evidencia tracked;
- una política separada para generar evidencia tracked únicamente por comando
  explícito, scope allowlisted, intención exacta y destino acotado;
- el smoke de Loading reconciliado con su DOM y timeline canónicos;
- la reconciliación de contratos históricos según la matriz final H/T/I:
  10 expectativas superadas, 5 errores de sincronización o scope y 2
  adaptaciones de infraestructura, sin flakes, regresiones ni ambigüedades
  pendientes;
- la documentación viva de assets y `current-used` reconciliada sin reescribir
  actas históricas;
- el hallazgo R01 `COVER_ACTIVATION_ASSET_READINESS` y su corrección runtime
  mínima: preload temprano de la pose aprobada, readiness real, una intención
  pendiente, retry controlado y fallo cerrado;
- CSS, assets, identidad de Lía y timing ceremonial de 920 ms intactos;
- 358/358 pruebas unitarias e integración y 93/93 pruebas E2E en PASS;
- worktree estable antes y después de la suite E2E completa.

La generación explícita de evidencia tracked no se ejecuta en esta publicación.
Una prueba técnica o una captura no sustituye aprobación humana.

## 3. Historial consolidado de bloqueos y resoluciones

1. La reanudación original se bloqueó en 020B por expectativas históricas
   anteriores a las integraciones posteriores de Mundo V.
2. GVO_DEBT_003A preservó las garantías propias de 020B y sustituyó únicamente
   las expectativas superadas por 020C–020H.
3. La suite reanudada produjo una matriz de 17 fallas: `75 passed / 17 failed`.
4. GVO_DEBT_003B clasificó cada fila antes de corregirla y dejó 36 pruebas
   focales únicas en PASS; F01 quedó sujeto a decisión humana.
5. GVO_DEBT_003C fijó `VISIBLE_PORTAL_ACTIVATION_RIG_THEN_TRANSITION` como la
   representación aprobada del Estado A y clasificó F01 como `T`.
6. La prueba correcta reveló R01: la pose de activación podía montar sin imagen
   utilizable porque su solicitud empezaba después del clic.
7. GVO_DEBT_003D añadió el bundle dedicado, preload temprano, readiness estricta
   y retry controlado sin modificar CSS, assets ni timing ceremonial.
8. La suite final terminó `93 passed / 0 failed / 0 skipped` y dejó una huella
   de worktree idéntica antes y después.

Este documento consolida 003A, 003B, 003C y 003D; no se crean actas separadas
para esos tickets intermedios.

## 4. Evidencia técnica publicada

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS — 358/358 en 31 archivos |
| `npm run build` | PASS |
| Smoke | PASS — 12/12 |
| Cover focal cold/repeat/reduced | PASS |
| `npm run test:e2e` | PASS — 93/93 |
| `git diff --check` | PASS |

Warning aceptado: chunk JavaScript superior a 500 kB.

La comprobación read-only incluye inventario de paths, SHA-256 individual,
hash binario del diff y ausencia de cambios en `docs/visual/**` y `src/**` entre
los snapshots anterior y posterior. No se usó el modo de evidencia tracked.

## 5. Alcance preservado

- No se modificaron CSS, composición visual, assets, binarios, copy runtime,
  timings ceremoniales ni identidad de Lía.
- No se añadieron audio, video, CDN, fuentes remotas, APIs externas,
  dependencias, manifests o lockfiles.
- No se reescribieron actas históricas ni evidencia bajo `docs/visual/**`.
- No se declaran resueltas las deudas restantes ni terminada la fase completa
  `PROJECT DEBT CORRECTION`.

## 6. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_003 — TEST EVIDENCE AND CANONICAL STATUS HYGIENE / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_003 — TEST EVIDENCE AND CANONICAL STATUS HYGIENE / HUMAN_APPROVED / PUBLISHED
```
