# GVO_DEBT_007AP — Aprobación humana y publicación de Review Dock Compact Placement

## 1. Identidad y autoridad

| Campo             | Valor                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Proyecto          | GVO — Guía Virtual OKÚA                                                                                                |
| Fase              | `PROJECT DEBT CORRECTION`                                                                                              |
| Fecha             | 2026-08-06 (`America/Bogota`)                                                                                          |
| Baseline          | `8b69d67b366c1810b842205b40d17c26b194f3f2`                                                                             |
| Informe histórico | [GVO_DEBT_007A_REVIEW_DOCK_COMPACT_PLACEMENT_FOR_REVIEW.md](GVO_DEBT_007A_REVIEW_DOCK_COMPACT_PLACEMENT_FOR_REVIEW.md) |
| Autoridad humana  | Ing. José David                                                                                                        |
| Estado humano     | `HUMAN_APPROVED`                                                                                                       |
| SHA publicado     | `SELF`                                                                                                                 |

El informe técnico histórico de `GVO_DEBT_007A` permanece byte-idéntico,
conserva su SHA-256
`62dd1c6c419fa1dd247718dccfe33f341a6e990edfd24b08cd4e89f250c06ac8` y
mantiene el estado `PENDING_HUMAN_REVIEW`. Esta acta posterior registra la
aprobación humana vinculante y la publicación del changeset descrito allí.

`SELF` identifica el único commit que contiene la implementación acumulada de
`GVO_DEBT_007` y `GVO_DEBT_007A`, sus informes históricos, esta acta y la
actualización mínima de `CURRENT_STATE.md`. Adquiere efecto de publicación
cuando ese mismo commit queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- dock compacto compartido `Volver al Mirador` en las nueve rutas de revisita;
- `44/72` combinaciones flotantes y `28/72` con reserva dinámica;
- `0/72` combinaciones con colisión;
- reducción del área reservada acumulada de `3.559.842px²` a
  `1.736.328px²`, equivalente a `51,22%`;
- reducción de la altura reservada promedio de `66,00px` a `25,67px`,
  equivalente a `61,11%`;
- placement adaptativo `top-end`, `top-start` y `below-end` según la geometría
  real;
- clearance reservado sólo para Mundo II landscape, Mundo IV portrait, Mundo V
  landscape y el estado visible de Mundo II Captura;
- retirada automática de la reserva al abandonar Captura;
- safe-area, visual viewport, reflow y botón dentro del viewport;
- botón nativo, foco visible, Enter, Space, touch y target mínimo `44px × 44px`;
- modo normal sin dock y con las cuatro variables de clearance en `0px`.

La implementación mantiene `ResizeObserver`, listeners de `visualViewport` y
las variables `--gvo-final-review-clearance-*`. El dock no intercepta eventos
fuera del botón.

## 3. Evidencia geométrica y visual

La matriz publicada cubre ocho viewports por nueve rutas:

- portrait: `360×640`, `390×844`, `412×915`;
- landscape: `844×390`, `915×412`;
- tablet: `768×1024`, `1024×768`;
- desktop: `1280×720`.

Los candidatos de colisión incluyen controles interactivos, regiones
`aria-live` y encabezados visibles. El área de intersección final es `0px²`, no
existe overflow horizontal y el dock/control permanecen dentro del viewport.

La evidencia no tracked queda bajo
`test-results/evidence/gvo-debt-007a/`: ocho JSON y diez capturas before, ocho
JSON y doce capturas after. La evidencia técnica no sustituye la aprobación
humana; esta acta incorpora la decisión explícita del Ing. José David.

## 4. Safe-area, accesibilidad y modo normal

- Safe-area: PASS mediante `env(safe-area-inset-*)` y offsets del viewport
  visual.
- Reflow equivalente a `320` CSS px: PASS.
- Enter y Space: una sola navegación a `/final` y limpieza del contexto, PASS.
- Touch y target mínimo: PASS.
- Reload de revisita válida: PASS.
- Contexto inválido: fail closed, sin dock y con clearance cero, PASS.
- Entrada normal en Mundos I–V: sin dock ni clearance residual, PASS.

## 5. Evidencia técnica publicada

| Validación             | Resultado                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio             |
| `npm run lint`         | PASS                                               |
| `npm run test`         | PASS — 473/473 en 34 archivos                      |
| `npm run build`        | PASS — 606 módulos, PWA `generateSW`, 278 entradas |
| E2E focal DEBT_007     | PASS — 13/13, 2,2 min                              |
| `npm run test:e2e`     | PASS — 116/116, un worker, 12,4 min                |
| `git diff --check`     | PASS                                               |

La comprobación read-only de la suite E2E completa incluye status,
name-status, stat, hash binario del diff, SHA-256 por path y manifiesto de
`docs/visual/**` antes y después. La suite no produce mutaciones tracked.

Warnings aceptados y documentados:

- chunk principal `817,06 kB`, superior al umbral informativo de `500 kB`;
- desglose informativo `PLUGIN_TIMINGS`;
- fallbacks de preload `coverIntroActivation`, `coverIntroCritical` y
  `transitionRootCritical` con `failed: 0` durante E2E;
- avisos informativos LF→CRLF de Git.

## 6. Alcance preservado

- Progreso, checkpoints y reset: intactos.
- `finalReviewContext`, Mirador y navegación contractual: intactos.
- Copy, slots editoriales y modo normal: intactos.
- Legibilidad y diseño interno de Mundo II Captura: no abordados.
- Assets, manifests e identidad de Lía: intactos.
- PWA, QR, dependencias y lockfile: intactos.
- `docs/visual/**`: intacto.
- No se reescriben los informes históricos ni se declara terminada la fase
  completa `PROJECT DEBT CORRECTION`.

## 7. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_007A — REVIEW DOCK COMPACT PLACEMENT / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_007A — REVIEW DOCK COMPACT PLACEMENT / HUMAN_APPROVED / PUBLISHED
```
