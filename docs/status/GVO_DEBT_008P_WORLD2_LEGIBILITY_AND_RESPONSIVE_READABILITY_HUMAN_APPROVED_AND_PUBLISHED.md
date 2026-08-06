# GVO_DEBT_008P — Aprobación humana y publicación de legibilidad responsive de Mundo II

## 1. Identidad y autoridad

| Campo             | Valor                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Proyecto          | GVO — Guía Virtual OKÚA                                                                                                            |
| Fase              | `PROJECT DEBT CORRECTION`                                                                                                          |
| Fecha             | 2026-08-06 (`America/Bogota`)                                                                                                      |
| Baseline          | `161919eeda79d42f9751da6d8411fededa2bf0e0`                                                                                         |
| Informe histórico | [GVO_DEBT_008_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_FOR_REVIEW.md](GVO_DEBT_008_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_FOR_REVIEW.md) |
| Autoridad humana  | Ing. José David                                                                                                                    |
| Estado humano     | `HUMAN_APPROVED`                                                                                                                   |
| SHA publicado     | `SELF`                                                                                                                             |

El informe técnico histórico de `GVO_DEBT_008` permanece byte-idéntico,
conserva su SHA-256
`60632b165ef24913c4d51e9ab871f2edfd9a12f8756a311105cad9dc3068d2c8` y
mantiene el estado `PENDING_HUMAN_REVIEW`. Esta acta posterior registra la
aprobación humana vinculante de la implementación completa, incluida la última
delta de revisita desde el Mirador.

`SELF` identifica el único commit que contiene la implementación de
`GVO_DEBT_008`, su informe histórico, esta acta y la actualización mínima de
`CURRENT_STATE.md`. Adquiere efecto de publicación cuando ese mismo commit
queda disponible en `origin/main`.

## 2. Alcance aprobado

La aprobación humana comprende:

- legibilidad responsive de las seis capas de Mundo II;
- pisos tipográficos y contraste de títulos, diálogos, readouts y etiquetas;
- targets interactivos mínimos de `44px × 44px`;
- reflow vertical en portrait, landscape bajo y `320` CSS px;
- zoom de texto al `200%` sin clipping ni overflow horizontal;
- navegación normal `3 × 2` y navegación compacta `6 × 1` en revisita;
- áreas de lectura seguras en Captura, Mapeo y Resultado;
- preservación de las seis capas, su orden, navegación y estados existentes.

No se reconstruye Captura ni se altera su contrato funcional.

## 3. Refinamientos humanos aprobados

### 3.1 Planta

El readout expandido ocupa la zona izquierda, limitado a `62%` del ancho
responsive. Su geometría termina antes del rectángulo de Lía y evita que el
texto vuelva a cubrirla.

### 3.2 Señal antes de revelar

El asset aprobado permanece byte-idéntico. Sólo se ajusta su colocación CSS en
estado `idle`, de modo que el punto luminoso del electrodo coincide con el
contacto de la planta antes de activar `Onda medida`. El estado expandido se
conserva.

### 3.3 Revisita desde Mirador

La revisión humana posterior confirmó la corrección de los solapamientos que
reaparecían al volver desde el Mirador:

- Señal ubica `Onda medida` fuera del dock flotante;
- Captura separa su readout de Lía y de la fila de tres pasos;
- Mapeo conserva visibles el contador `3 / 3`, la microcopia y sus controles.

Las reglas quedan acotadas a Mundo II bajo el ancestro de revisión activa.
`FinalReviewModeLayout`, el contexto de revisita y el Mirador permanecen
intactos.

## 4. Métricas before/after

La matriz principal cubre `6` viewports por `6` capas, para `36` filas.

| Métrica                       | Before | After |
| ----------------------------- | -----: | ----: |
| Muestras de texto             |    756 |   816 |
| Textos bajo su piso           |    462 |     0 |
| Tamaño mínimo observado       | 4,80px | 10,00px |
| Textos recortados             |      8 |     0 |
| Controles medidos             |    270 |   270 |
| Controles bajo `44px`         |     45 |     0 |
| Ancho mínimo de control       | 29,37px | 50,34px |
| Alto mínimo de control        | 2,00px | 44,00px |
| Colisiones                    |      8 |     0 |
| Overflow horizontal máximo    |    0px |   0px |

Casos especiales:

| Caso            | Fase   | Textos bajo piso | Recortados | Controles pequeños | Colisiones | Overflow |
| --------------- | ------ | ----------------: | ---------: | ------------------: | ----------: | -------: |
| Zoom `200%`     | Before |                 1 |         11 |                   3 |          11 |      0px |
| Zoom `200%`     | After  |                 0 |          0 |                   0 |           0 |      0px |
| Reflow `320px`  | Before |                71 |          0 |                   7 |           0 |      0px |
| Reflow `320px`  | After  |                 0 |          0 |                   0 |           0 |      0px |

La auditoría posterior incluye Señal en estado `idle` y la revisita real desde
Mirador en Planta, Señal, Captura, Acondicionamiento, Mapeo y Resultado.

## 5. Evidencia técnica publicada

| Validación             | Resultado                                                   |
| ---------------------- | ----------------------------------------------------------- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio                      |
| `npm run lint`         | PASS                                                        |
| `npm run test`         | PASS — 473/473 en 34 archivos                               |
| `npm run build`        | PASS — 606 módulos, PWA `generateSW`, 278 entradas          |
| E2E focal DEBT_008     | PASS — 11/11, un worker, 2,6 min                            |
| `npm run test:e2e`     | PASS — 127/127, un worker, 13,2 min, exit code `0`          |
| `git diff --check`     | PASS                                                        |

La repetición final de la suite E2E completa cerró el proceso correctamente y
resuelve la ambigüedad histórica del timeout externo ocurrido después del
resumen `127/127` en la corrida documentada para revisión.

La evidencia visual y geométrica no tracked permanece bajo
`test-results/evidence/gvo-debt-008/`: `20` JSON y `14` PNG before; `28` JSON y
`21` PNG after. No existe ningún archivo tracked bajo ese path.

## 6. Warnings aceptados

- Build: chunk principal `817,17 kB`, superior al umbral informativo de
  `500 kB`.
- Build: warning informativo `PLUGIN_TIMINGS`.
- E2E: fallbacks de preload `coverIntroActivation`, `coverIntroCritical` y
  `transitionRootCritical`, todos con `failed: 0`.
- Git: avisos informativos de normalización potencial LF→CRLF; el diff no
  contiene errores de whitespace.

## 7. Alcance preservado

- Assets, manifests, mirrors `current-used` e identidad de Lía: intactos.
- Copy editorial FINAL: intacto.
- Checkpoints, progreso y reset: intactos.
- Mirador, contexto de revisita y `FinalReviewModeLayout`: intactos.
- Estructura, semántica y comportamiento funcional de Captura: intactos.
- PWA y QR: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- No se reescribe el informe histórico ni se declara terminada la fase
  completa `PROJECT DEBT CORRECTION`.

## 8. Estado de publicación

Antes del único commit autorizado:

```text
GVO_DEBT_008 — WORLD II LEGIBILITY AND RESPONSIVE READABILITY / HUMAN_APPROVED / READY_TO_PUBLISH
```

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_008 — WORLD II LEGIBILITY AND RESPONSIVE READABILITY / HUMAN_APPROVED / PUBLISHED
```
