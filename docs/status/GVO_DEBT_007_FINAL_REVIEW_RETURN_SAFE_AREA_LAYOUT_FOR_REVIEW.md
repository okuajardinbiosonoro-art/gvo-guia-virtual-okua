# GVO_DEBT_007 — Final review return safe-area layout — para revisión

## 1. Estado

- Estado: `PENDING_HUMAN_REVIEW`.
- Este documento registra implementación y prueba técnica; no declara aprobación
  visual humana, publicación ni cierre final.
- Commit, push y Pull Request: no ejecutados.
- `docs/status/CURRENT_STATE.md`: no modificado.

## 2. Baseline

- Branch: `main`.
- HEAD: `8b69d67b366c1810b842205b40d17c26b194f3f2`.
- `origin/main`: `8b69d67b366c1810b842205b40d17c26b194f3f2`.
- Remoto `refs/heads/main` verificado con `git ls-remote`:
  `8b69d67b366c1810b842205b40d17c26b194f3f2`.
- Divergencia HEAD...origin/main: `0 0`.
- Subject: `fix(checkpoints): publish world3 durable records`.
- Worktree inicial: limpio.
- `git fetch`: no ejecutado.

## 3. Problema anterior

El control nativo `Volver al Mirador` se superponía al layout interno de las
pantallas durante la revisita desde Final. El posicionamiento fijo no publicaba
un espacio reservado consumible por las composiciones y producía colisiones
reales con navegación, CTA, controles inmersivos y regiones vivas.

La auditoría inicial midió `72` combinaciones (`9` rutas por `8` viewports):
`52` combinaciones presentaban colisión y se detectaron `59` intersecciones.

## 4. Rutas auditadas

1. `/estacion/1`
2. `/estacion/2`
3. `/estacion/3`
4. `/estacion/4`
5. `/estacion/5`
6. `/estacion/5/plantas`
7. `/estacion/5/sistema`
8. `/estacion/5/espacio`
9. `/estacion/5/visitante`

## 5. Estrategia shared de dock

`FinalReviewModeLayout` mantiene el botón nativo y lo aloja en un dock shared
fijo, no bloqueante, medido en runtime. Cuando la revisita está activa, el
layout reserva una fila superior calculada antes del contenido de cada Mundo;
el dock queda fuera de esa fila visual. El contenedor del dock usa
`pointer-events: none` y el botón restituye `pointer-events: auto`.

- Portrait: `top-end`.
- Landscape: `top-start`.
- Separación al borde: `12px`.
- Separación entre dock y contenido: `10px`.
- Target mínimo: `44px × 44px`.
- Z-index del dock: `1000`.
- `overflow-wrap: anywhere` y ancho máximo acotado al viewport.
- Reduced motion: sin transición del control.

No se cambió copy, slots editoriales, orden DOM del contenido ni contrato de
navegación. El botón continúa después de los hijos en el DOM y conserva
`Volver al Mirador`.

## 6. Clearance y safe-area

El layout publica cuatro variables, con valor `0px` fuera de revisita:

- `--gvo-final-review-clearance-top`;
- `--gvo-final-review-clearance-right`;
- `--gvo-final-review-clearance-bottom`;
- `--gvo-final-review-clearance-left`.

En revisita, el clearance se calcula con offsets del viewport visual,
`env(safe-area-inset-*)`, gap al borde, dimensiones reales del dock y gap de
contenido. Portrait publica clearance derecho y landscape clearance izquierdo;
la fila superior compartida reserva la altura del dock en ambos casos.

Un `ResizeObserver` mide el rect real del dock. También se atienden cambios de
`window.resize`, `visualViewport.resize`, `visualViewport.scroll`,
`screen.orientation.change` y carga de fuentes. Todos los listeners y el
observer se limpian al desmontar.

## 7. Matriz inicial

### Por ruta

| Ruta                    | Filas con colisión | Intersecciones |
| ----------------------- | -----------------: | -------------: |
| `/estacion/1`           |                2/8 |              2 |
| `/estacion/2`           |                5/8 |             12 |
| `/estacion/3`           |                1/8 |              1 |
| `/estacion/4`           |                4/8 |              4 |
| `/estacion/5`           |                8/8 |              8 |
| `/estacion/5/plantas`   |                8/8 |              8 |
| `/estacion/5/sistema`   |                8/8 |              8 |
| `/estacion/5/espacio`   |                8/8 |              8 |
| `/estacion/5/visitante` |                8/8 |              8 |
| **Total**               |          **52/72** |         **59** |

### Por viewport

| Viewport                     | Filas con colisión | Intersecciones |
| ---------------------------- | -----------------: | -------------: |
| `360×640` portrait           |                8/9 |             10 |
| `390×844` portrait           |                6/9 |              8 |
| `412×915` portrait           |                6/9 |              8 |
| `844×390` landscape          |                6/9 |              6 |
| `915×412` landscape          |                7/9 |              7 |
| `768×1024` tablet portrait   |                7/9 |              8 |
| `1024×768` tablet landscape  |                6/9 |              6 |
| `1280×720` desktop landscape |                6/9 |              6 |

Casos representativos confirmados: nav y CTA de Mundo II en portrait, diálogo
de Mundo II en landscape, CTA de cierre de Mundos I/III, control inmersivo de
Mundo IV y región viva/tarjetas de Mundo V.

## 8. Matriz final

- Viewports: los ocho contractuales.
- Rutas: las nueve contractuales.
- Combinaciones: `72`.
- Filas con colisión: `0/72`.
- Intersecciones: `0`.
- Overflow horizontal: `0` casos.
- Dock y botón dentro del viewport: PASS.
- Target real mínimo de `44px × 44px`: PASS.
- Placement portrait `top-end`: PASS.
- Placement landscape `top-start`: PASS.

Los controles críticos medidos incluyen botones, links, inputs, selects,
textareas, summaries, roles button/link, elementos con `tabindex` y regiones
`aria-live` visibles.

## 9. Mundo II

La matriz inicial justificó el único ajuste CSS específico de Mundo: el alto de
`.world2-stage` consume `--gvo-final-review-clearance-top`. No se modificó TSX,
copy, legibilidad interna ni arquitectura de Captura.

- Los seis controles `[data-world2-layer]` permanecen visibles y dentro del
  viewport.
- Navegación completa: PASS.
- Entrada a Captura: PASS.
- Control `signal` de Captura: accionable y actualiza el step, PASS.
- CTA `Continuar` de `resultado_mediado`: visible, PASS.
- Portrait y landscape: cero colisiones.

## 10. Otros Mundos

- Mundo I: tres nodos críticos preservados; cero colisiones finales.
- Mundo III: tres registros durables preservados; cero colisiones finales.
- Mundo IV: ocho nodos y control inmersivo visibles; cero colisiones finales.
- Mundo V overview: cuatro áreas visibles; cero colisiones finales.
- Mundo V subrutas: escena activa y `Volver al mapa` visibles en las cuatro
  subrutas; cero colisiones finales.

No se requirió CSS específico para Mundos I, III, IV o V.

## 11. Modo normal y revisita

- Revisita válida: dock activo, clearance calculado y persistencia tras reload,
  PASS.
- Entrada normal: una ruta de cada Mundo I–V comprobada con
  `data-final-review-active="false"`, sin dock y con las cuatro variables en
  `0px`, PASS.
- Contexto de otro Mundo: se invalida, no presenta dock y elimina el contexto,
  PASS.
- Slots y copy: intactos.

## 12. Accesibilidad e interacción

- Elemento: `button` nativo.
- Focus: indicador `:focus-visible` de `3px` con offset de `3px`, verificado
  mediante navegación real Tab/Shift+Tab.
- Enter: una navegación a `/final` y limpieza de contexto, PASS.
- Space: una navegación a `/final` y limpieza de contexto, PASS.
- Touch: `touch-action: manipulation` y target mínimo `44px × 44px`, PASS.
- Intercepción: dock `pointer-events: none`; control `pointer-events: auto`,
  PASS.
- Orden DOM: preservado.

## 13. Zoom y reflow

El escenario equivalente a `320` CSS px mantiene el botón y nav de Mundo II
visibles, sin colisión y sin overflow horizontal. Captura generada:
`zoom-reflow-320.png`.

## 14. Tests

| Validación             | Resultado                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio             |
| `npm run lint`         | PASS                                               |
| `npm run test`         | PASS — 470/470 en 34 archivos                      |
| `npm run build`        | PASS — 606 módulos, PWA `generateSW`, 278 entradas |
| E2E focal GVO_DEBT_007 | PASS — 13/13                                       |
| `npm run test:e2e`     | PASS — 116/116, un worker, 12.8 min                |
| `git diff --check`     | PASS                                                |

La suite global incluye los `13` casos focales; el total E2E único es `116`.

## 15. Prueba read-only de la suite E2E completa

Las huellas se tomaron inmediatamente antes y después de la ejecución final de
`npm run test:e2e`, antes de crear este informe:

| Evidencia                         | Before                                                             | After    |
| --------------------------------- | ------------------------------------------------------------------ | -------- |
| status SHA-256                    | `ae4aed7e068c9ac639c30a8274eb434e89e529979d69bb74c3ce514ed0c1a52c` | idéntico |
| name-status SHA-256               | `fcb90a9d52dc6c2995b7f8b4d621e279b91c6ce76bf5b82467fff8dc5326c412` | idéntico |
| stat SHA-256                      | `912d3da1b625ce7973a9d27331813549db5ffaa267e74eae5f3d7d8a0e61a5f7` | idéntico |
| hash binario Git del diff         | `1cec06c9ab42d54288fdfded92e6d9a91a5aca04`                         | idéntico |
| manifest SHA-256 de 5 paths       | `e58a3af49547b25f7c13fdfe5aa164e58c90e25057d06aac73d6545db8f070f2` | idéntico |
| archivos en `docs/visual`         | `1039`                                                             | `1039`   |
| manifest SHA-256 de `docs/visual` | `78f5f44afe454a8fa889435167a3926e2f183a5fdbb9f183d8bdb22828fa9e45` | idéntico |

SHA-256 individual before/after:

| Path                                                           | SHA-256                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `src/app/review/FinalReviewModeLayout.css`                     | `ff96f5ad948eb61645646374cbe9c874a3a58415ee253131a1b1f044941936dd` |
| `src/app/review/FinalReviewModeLayout.test.tsx`                | `91c58563db79ddd7a4876eac6e2c52afe24a610f6cdf61a6f657ce48648cac16` |
| `src/app/review/FinalReviewModeLayout.tsx`                     | `8069794ff3835be396177182b3a0d91ab255df95820cb242c4b4c86cc1a5e34b` |
| `src/screens/World2Root/World2RootScreen.css`                  | `142721eb970f74b4164407b09979b06120e6cee86baf71425183a7d989137c84` |
| `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts` | `a39b09b2fe1cc26df328f9354ff6c229ecc0018d2b6e2863af123af6cb0e18c1` |

La suite no produjo mutaciones tracked ni alteró `docs/visual/**`. Sus outputs
quedaron bajo paths ignorados.

## 16. Evidencia visual no tracked

Path: `test-results/evidence/gvo-debt-007/`.

- 8 JSON de matriz inicial: `72` filas, `52` filas con colisión, `59`
  intersecciones.
- 8 JSON de matriz final: `72` filas, `0` colisiones.
- 10 screenshots: Mundo I portrait; Mundo II portrait y landscape; Mundo III
  portrait; Mundo IV landscape; Mundo V overview y subruta portrait; tablet
  portrait; desktop landscape; zoom/reflow 320.
- Archivos tracked bajo ese path: `0`.

La evidencia técnica y las capturas no sustituyen la revisión visual real del
Ing. José David.

## 17. Paths

### Creados

- `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts`.
- `docs/status/GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT_FOR_REVIEW.md`.

### Modificados

- `src/app/review/FinalReviewModeLayout.tsx`.
- `src/app/review/FinalReviewModeLayout.css`.
- `src/app/review/FinalReviewModeLayout.test.tsx`.
- `src/screens/World2Root/World2RootScreen.css`.

El único CSS específico de Mundo es Mundo II y está respaldado por colisiones
iniciales observadas. Todos los paths están autorizados por el ticket.

## 18. Alcance preservado

- Progreso: intacto.
- Checkpoints: intactos.
- Reset: intacto.
- `finalReviewContext`: intacto.
- Mirador y runtime de Final: intactos salvo el layout shared de revisita
  autorizado.
- Copy y slots editoriales: intactos.
- Legibilidad de Mundo II: no abordada.
- Captura de Mundo II: no rediseñada.
- Assets, identidad de Lía y manifests: intactos.
- PWA y QR: intactos.
- Dependencias y lockfile: intactos.
- `docs/visual/**`: intacto.
- `CURRENT_STATE.md`: intacto.
- No se creó acta de aprobación.

## 19. Warnings

- Build: chunk principal `815.93 kB` minificado, warning conocido por superar
  `500 kB`.
- Build: warning informativo `PLUGIN_TIMINGS`.
- Focal E2E: fallback de preload `coverIntroActivation` por timeout, con
  `failed: 0`; PASS.
- Suite E2E final: fallback de preload `coverIntroCritical` por timeout, con
  `failed: 0`; PASS.
- Git informó normalización potencial LF→CRLF; no se detectaron errores de
  whitespace en la comprobación final.

## 20. Gaps y riesgos

- Gaps técnicos conocidos dentro del alcance: ninguno.
- Gate pendiente: revisión visual humana obligatoria.
- Riesgo residual: Chromium emula los viewports y el contrato CSS de safe-area,
  pero no sustituye una comprobación física en hardware con notch o barras del
  sistema.
- La posición visible es deliberadamente compartida y sobria, pero su aprobación
  estética corresponde al Ing. José David.

## 21. Control Git

- Commit: no ejecutado.
- Push: no ejecutado.
- Pull Request: no creado.
- `git fetch`: no ejecutado.
- Estado de entrega: `PENDING_HUMAN_REVIEW`.
