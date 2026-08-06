# GVO_DEBT_004P — Aprobación humana y publicación de World I and World IV Checkpoint Continuity

## 1. Identidad y autoridad

| Campo | Valor |
| --- | --- |
| Proyecto | GVO — Guía Virtual OKÚA |
| Fase | `PROJECT DEBT CORRECTION` |
| Fecha | 2026-08-05 (`America/Bogota`) |
| Baseline | `9071d751e8919ffd4bfc6255e5bc5494f5fdf2b8` |
| Informe histórico | [GVO_DEBT_004_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_FOR_REVIEW.md](GVO_DEBT_004_WORLD1_WORLD4_CHECKPOINT_CONTINUITY_FOR_REVIEW.md) |
| Autoridad humana | Ing. José David |
| Estado humano | `HUMAN_APPROVED` |
| SHA publicado | `SELF` |

El informe técnico histórico permanece byte-idéntico, conserva su SHA-256
`79d0fcefff494b7ab15890ba85495941d729ff780e93400192ad5ca64babd7ce`
y mantiene el estado `PENDING_HUMAN_REVIEW`. Esta acta posterior registra la
aprobación humana vinculante y la publicación del changeset descrito allí.

`SELF` identifica el único commit que contiene la implementación, el informe
histórico, esta acta y la actualización mínima de `CURRENT_STATE.md`. Adquiere
efecto de publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- store versionado de Mundo I en `localStorage:gvo.station1.v1` con
  `schemaVersion: 1`, `activeConcept`, `highestReachedConcept` y timestamp ISO;
- restauración de W1 tras reload, reapertura y revisita desde Final; nodos
  visitados accionables, no alcanzados bloqueados y máximo que nunca disminuye;
- `ready_to_continue` durable antes del CTA, con completion global separada y
  escrita exclusivamente desde `Continuar`;
- store versionado de Mundo IV en `localStorage:gvo.station4.v1` con
  `schemaVersion: 1`, `highestSettledIndex`, `resumeMode` y timestamp ISO;
- persistencia de W4 limitada a `reading`, `chain_pending` y
  `completion_retry`, sin serializar timers, epoch, fases de motion ni card
  motion;
- `chain_pending` reiniciado desde el principio una sola vez y
  `completion_retry` restaurado sin repetir la cadena;
- completion global como autoridad final y eliminación verificada del
  checkpoint parcial después de completion;
- lectura, escritura y eliminación verificadas, resultados tipados y recovery
  explícito ante corrupción, versión desconocida o storage no disponible;
- raw corrupto o desconocido preservado hasta confirmación humana de reset;
- reset transaccional ampliado a seis keys, con snapshot, success, rollback
  byte-exacto y retry con snapshot nuevo;
- visuales, CSS, layout, assets, identidad de Lía, motion timings, reduced
  motion y visibility handling intactos.

## 3. Contrato de recovery y reset

El recovery de cada Mundo elimina únicamente su key después de confirmación y
verifica el resultado. Completion global y los demás Mundos se preservan.
Cuando Web Storage no está disponible, la primera acción es `Reintentar`; no se
anuncia persistencia ni se navega.

La allowlist publicada queda ordenada así:

1. `localStorage:gvo.progress.v1` — `global-progress`.
2. `localStorage:gvo.station1.v1` — `world-one-state`.
3. `localStorage:gvo.station4.v1` — `world-four-state`.
4. `localStorage:gvo.station5.v1` — `world-five-state`.
5. `localStorage:gvo.coverIntro.introCompleted.v1` — `cover-completion`.
6. `sessionStorage:gvo.final.reviewContext.v1` — `final-review-context`.

Preferencias, hints, accesibilidad, tema, idioma, Cache Storage/service worker,
configuración, credenciales, tokens y familias ajenas permanecen fuera del
reset.

## 4. Evidencia técnica publicada

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS — 408/408 en 32 archivos |
| `npm run build` | PASS |
| E2E focal DEBT_004 | PASS — 3/3 |
| `npm run test:e2e` | PASS — 96/96 |
| `git diff --check` | PASS |

La comprobación read-only incluye status, name-status, stat, SHA-256 por cada
path, hash binario del diff y manifest de `docs/visual/**` antes y después de la
suite E2E completa. El worktree de 15 paths debe permanecer idéntico.

Warnings aceptados y documentados:

- chunk principal superior a 500 kB;
- tiempos informativos de plugins;
- preload fallback puntual con suite completa en PASS;
- avisos informativos LF→CRLF de Git;
- un timeout ambiental inicial de arranque, no reproducido en las corridas
  focales finales y sin clasificación de fallo funcional.

## 5. Alcance preservado

- No se modificaron CSS, composición visual, halos, assets, binarios, manifests,
  copy editorial aprobado, identidad de Lía ni motion timings.
- No se modificaron Mundo II, Mundo III, Mundo V, Final o Mirador.
- No se añadieron PWA, QR, audio, video, CDN, fuentes remotas, APIs externas,
  dependencias o cambios de lockfile.
- No se reescribieron actas históricas ni evidencia bajo `docs/visual/**`.
- No se declaran resueltas las deudas restantes ni terminada la fase completa
  `PROJECT DEBT CORRECTION`.

## 6. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_004 — WORLD I AND WORLD IV CHECKPOINT CONTINUITY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_004 — WORLD I AND WORLD IV CHECKPOINT CONTINUITY / HUMAN_APPROVED / PUBLISHED
```
