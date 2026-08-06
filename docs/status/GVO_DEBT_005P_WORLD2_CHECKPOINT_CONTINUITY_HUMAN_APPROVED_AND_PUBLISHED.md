# GVO_DEBT_005P — Aprobación humana y publicación de World II Checkpoint Continuity

## 1. Identidad y autoridad

| Campo | Valor |
| --- | --- |
| Proyecto | GVO — Guía Virtual OKÚA |
| Fase | `PROJECT DEBT CORRECTION` |
| Fecha | 2026-08-05 (`America/Bogota`) |
| Baseline | `6a63ea35c07621452aefb268104c31c9d50107bf` |
| Informe histórico | [GVO_DEBT_005_WORLD2_CHECKPOINT_CONTINUITY_FOR_REVIEW.md](GVO_DEBT_005_WORLD2_CHECKPOINT_CONTINUITY_FOR_REVIEW.md) |
| Autoridad humana | Ing. José David |
| Estado humano | `HUMAN_APPROVED` |
| SHA publicado | `SELF` |

El informe técnico histórico permanece byte-idéntico, conserva su SHA-256
`551a0b33aa046fdd916c922b92eb6cab5e5aeff625667b6046ae464d888d8438`
y mantiene el estado `PENDING_HUMAN_REVIEW`. Esta acta posterior registra la
aprobación humana vinculante y la publicación del changeset descrito allí.

`SELF` identifica el único commit que contiene la implementación, el informe
histórico, esta acta y la actualización mínima de `CURRENT_STATE.md`. Adquiere
efecto de publicación cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- checkpoint versionado de Mundo II en `localStorage:gvo.station2.v1`, con
  `schemaVersion: 1`, capa activa, prefix de capas visitadas, máximo
  desbloqueado, interacciones, Captura, Mapeo, Resultado y timestamp ISO;
- prefix estricto `planta_viva → senal → captura → acondicionamiento → mapeo → resultado_mediado`,
  sin huecos ni duplicados, con active y highest coherentes;
- gates durables de contacto, onda medida y Captura completa;
- restauración de Captura con paso actual y prefix visitado;
- Mapeo incompleto reiniciado desde la primera relación y Mapeo completo
  restaurado en review, conservando `3200/6400/9600 ms`;
- Resultado pending reiniciado desde `intensity` y Resultado ready restaurado
  sin repetir convergencia, conservando `2100/4200/6300/9000 ms`;
- completion global separada y escrita exclusivamente desde `Continuar`;
- reload, reapertura y revisita desde Final con restauración de estado estable;
- recovery explícito ante corrupción, versión desconocida y storage no
  disponible, con raw inválido preservado;
- error/retry idempotente, sin repetir timers ni aplicar UI antes de
  persistencia verificada;
- reset transaccional ampliado a siete keys, con snapshot, success, rollback
  byte-exacto y retry con snapshot nuevo;
- visuales, CSS, assets, copy aprobado y tiempos intactos.

## 3. Recovery y reset publicados

Los estados de lectura son `empty`, `ok`, `corrupt`, `unknown_version` y
`storage_unavailable`. El recovery elimina y verifica sólo `gvo.station2.v1`;
completion global y las demás familias permanecen preservadas. Ante storage no
disponible, la primera acción es `Reintentar`.

La allowlist publicada queda ordenada así:

1. `localStorage:gvo.progress.v1` — `global-progress`.
2. `localStorage:gvo.station1.v1` — `world-one-state`.
3. `localStorage:gvo.station2.v1` — `world-two-state`.
4. `localStorage:gvo.station4.v1` — `world-four-state`.
5. `localStorage:gvo.station5.v1` — `world-five-state`.
6. `localStorage:gvo.coverIntro.introCompleted.v1` — `cover-completion`.
7. `sessionStorage:gvo.final.reviewContext.v1` — `final-review-context`.

Preferencias, hints, accesibilidad, tema, idioma, Cache Storage/service worker,
configuración, credenciales, tokens y familias ajenas permanecen fuera del
reset. No existe key durable de Mundo III.

## 4. Evidencia técnica publicada

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS — 439/439 en 33 archivos |
| `npm run build` | PASS |
| E2E focal DEBT_005 | PASS — 4/4 |
| `npm run test:e2e` | PASS — 100/100 |
| `git diff --check` | PASS |

La comprobación read-only incluye status, name-status, stat, SHA-256 por cada
path, hash binario del diff y manifest de `docs/visual/**` antes y después de la
suite E2E completa. El worktree de 16 paths permanece idéntico.

Warnings aceptados y documentados:

- chunk principal superior a 500 kB;
- desglose informativo `PLUGIN_TIMINGS`;
- avisos informativos LF→CRLF de Git.

## 5. Alcance preservado

- No se modificaron CSS, composición visual, assets, binarios, manifests,
  identidad de Lía, copy editorial aprobado ni timings.
- Mundo I y Mundo IV sólo reciben reconciliación histórica de expectativas de
  reset/progreso; sus runtimes permanecen intactos.
- No se modificaron Mundo III, Mundo V, Final o Mirador.
- No se añadieron PWA, QR, audio, video, CDN, fuentes remotas, APIs externas,
  dependencias ni cambios de lockfile.
- No se reescribieron actas históricas ni evidencia bajo `docs/visual/**`.
- No se declaran resueltas las deudas restantes ni terminada la fase completa
  `PROJECT DEBT CORRECTION`.

## 6. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_005 — WORLD II CHECKPOINT CONTINUITY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_005 — WORLD II CHECKPOINT CONTINUITY / HUMAN_APPROVED / PUBLISHED
```
