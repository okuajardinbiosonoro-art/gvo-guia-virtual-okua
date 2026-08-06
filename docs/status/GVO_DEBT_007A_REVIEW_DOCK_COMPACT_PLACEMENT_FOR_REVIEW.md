# GVO_DEBT_007A — Review dock compact placement — para revisión

## 1. Estado

- Estado: `PENDING_HUMAN_REVIEW`.
- Este documento registra implementación y prueba técnica; no declara aprobación
  visual humana, publicación ni cierre final.
- Commit, push y Pull Request: no ejecutados.
- `docs/status/CURRENT_STATE.md`: no modificado.

## 2. Baseline y contexto recibido

- Ticket padre: `GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT`.
- Branch: `main`.
- HEAD y `origin/main` al inicio: `8b69d67b366c1810b842205b40d17c26b194f3f2`.
- Divergencia HEAD...origin/main: `0 0`.
- `git fetch`: no ejecutado.
- El worktree ya contenía la implementación y el informe pendientes de
  `GVO_DEBT_007`; esos cambios se preservaron como contexto de trabajo.

La base técnica de `GVO_DEBT_007` mantenía cero colisiones, pero reservaba una
fila superior de `66px` en las `72` combinaciones geométricas. La observación
humana que origina este refinamiento fue la ocupación vertical excesiva de esa
franja permanente.

## 3. Alcance implementado

`FinalReviewModeLayout` conserva el botón nativo `Volver al Mirador` y aplica
una colocación compacta adaptativa:

- `top-end` flotante cuando la esquina final es segura;
- `top-start` flotante en composiciones landscape que lo permiten;
- `below-end` flotante en portrait estrecho de Mundos II y III, separado del
  encabezado;
- clearance reservado únicamente en geometrías donde la auditoría observó que
  ambas esquinas o la composición inmediata requieren protección.

El modo reservado está acotado a:

- Mundo II en landscape;
- Mundo IV en portrait;
- Mundo V overview y sus cuatro subrutas en landscape;
- Mundo II Captura mientras su timeline está visible, incluso en portrait.

Al abandonar Captura, el `MutationObserver` vuelve a medir el layout y retira la
reserva. No se cambió la interacción, el copy ni la semántica interna de
Captura.

## 4. Contrato técnico preservado

- `ResizeObserver`: mantenido.
- `visualViewport.resize` y `visualViewport.scroll`: mantenidos.
- Safe-area mediante `env(safe-area-inset-*)`: mantenida.
- Variables `--gvo-final-review-clearance-*`: mantenidas y publicadas como
  `0px` en modo flotante o normal.
- Target mínimo: `44px × 44px`.
- Dock: `pointer-events: none`; botón: `pointer-events: auto`.
- Botón nativo, foco visible, teclado Enter/Space y touch: preservados.
- Sin overflow horizontal y con dock/control dentro del viewport.

El ajuste previo de `World2RootScreen.css` permanece sin cambios respecto a
`GVO_DEBT_007`; no fue necesaria una modificación adicional específica de
Mundo II para este ticket.

## 5. Rutas y viewports auditados

Rutas:

1. `/estacion/1`
2. `/estacion/2`
3. `/estacion/3`
4. `/estacion/4`
5. `/estacion/5`
6. `/estacion/5/plantas`
7. `/estacion/5/sistema`
8. `/estacion/5/espacio`
9. `/estacion/5/visitante`

Viewports:

1. `360×640` portrait
2. `390×844` portrait
3. `412×915` portrait
4. `844×390` landscape
5. `915×412` landscape
6. `768×1024` tablet portrait
7. `1024×768` tablet landscape
8. `1280×720` desktop landscape

Total: `9 × 8 = 72` combinaciones estáticas.

## 6. Auditoría before/after

La auditoría previa se capturó antes de modificar `GVO_DEBT_007A` y conserva el
estado final del ticket padre. La auditoría posterior amplió los candidatos de
colisión para incluir encabezados visibles (`h1`, `h2`, `h3` y
`[role="heading"]`), además de controles y regiones vivas.

| Métrica                     |       Before |        After |       Variación |
| --------------------------- | -----------: | -----------: | --------------: |
| Combinaciones               |           72 |           72 |               0 |
| Combinaciones flotantes     |            0 |           44 |             +44 |
| Combinaciones con reserva   |           72 |           28 |             -44 |
| Colisiones                  |            0 |            0 |               0 |
| Área reservada acumulada    | 3.559.842px² | 1.736.328px² | `-1.823.514px²` |
| Reducción de área reservada |            — |            — |        `51,22%` |
| Altura reservada promedio   |      66,00px |      25,67px |       `-61,11%` |

Distribución final de la matriz estática:

- Mundo I: `8/8` flotante.
- Mundo II: `4/8` flotante y `4/8` reservado.
- Mundo III: `8/8` flotante.
- Mundo IV: `4/8` flotante y `4/8` reservado.
- Mundo V overview: `4/8` flotante y `4/8` reservado.
- Cada subruta de Mundo V: `4/8` flotante y `4/8` reservado.

Resultado geométrico final:

- Intersecciones con controles, regiones vivas y encabezados: `0px²`.
- Filas con colisión: `0/72`.
- Overflow horizontal: `0` casos.
- Target, dock y botón dentro del viewport: PASS.
- Modo normal sin revisita: sin dock y clearance `0px`, PASS.

## 7. Estado dinámico de Mundo II Captura

La prueba focal entra por la UI real a Captura y confirma que:

1. el timeline visible activa `data-final-review-clearance-mode="reserved"`;
2. el dock usa `top-end` sin colisión;
3. el control `signal` sigue accionable y actualiza el step;
4. al salir hacia `resultado_mediado`, la reserva se elimina;
5. el dock vuelve a `below-end` flotante sin colisión.

Esto protege la geometría existente sin resolver ni rediseñar la legibilidad o
el contenido de Captura.

## 8. Accesibilidad e interacción

- Enter: una navegación a `/final` y limpieza del contexto, PASS.
- Space: una navegación a `/final` y limpieza del contexto, PASS.
- Touch: `touch-action: manipulation` y target mínimo, PASS.
- Foco visible: preservado.
- Reload de revisita válida: dock conservado, PASS.
- Contexto inválido: dock ausente, clearance cero y contexto eliminado, PASS.
- Reflow equivalente a `320` CSS px: visible, sin colisión ni overflow, PASS.

## 9. Validaciones

| Validación             | Resultado                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio             |
| `npm run lint`         | PASS                                               |
| `npm run test`         | PASS — 473/473 en 34 archivos                      |
| `npm run build`        | PASS — 606 módulos, PWA `generateSW`, 278 entradas |
| E2E focal GVO_DEBT_007 | PASS — 13/13, 2,3 min                              |
| `npm run test:e2e`     | PASS — 116/116, un worker, 12,5 min                |
| `git diff --check`     | PASS                                               |

La suite focal fue repetida después de añadir la comprobación explícita de que
el clearance se retira al salir de Captura. La suite E2E completa se repitió
después de ese último ajuste.

## 10. Prueba read-only de la suite E2E completa

Las huellas se tomaron inmediatamente antes y después de la ejecución final de
`npm run test:e2e`, antes de crear este informe:

| Evidencia                         | Before                                                             | After    |
| --------------------------------- | ------------------------------------------------------------------ | -------- |
| status SHA-256                    | `00f09dedddef78d37a9f355a2588c714781314d7cf2c95be3f6c0cabbf59279a` | idéntico |
| name-status SHA-256               | `fcb90a9d52dc6c2995b7f8b4d621e279b91c6ce76bf5b82467fff8dc5326c412` | idéntico |
| stat SHA-256                      | `5e257adb6614b8556d7b170a10dec80300c3ade26970ec1a05848179a13d1f18` | idéntico |
| hash binario Git del diff         | `1fe446c678a9a2053c3ed828c825826dbf13f1d6`                         | idéntico |
| manifest SHA-256 de 6 paths       | `5ba8dd4987d919cb654f4774a4d62b4bbb25d099b8e40fe7738e052c7a78054e` | idéntico |
| archivos en `docs/visual`         | `1039`                                                             | `1039`   |
| manifest SHA-256 de `docs/visual` | `78f5f44afe454a8fa889435167a3926e2f183a5fdbb9f183d8bdb22828fa9e45` | idéntico |

SHA-256 individual before/after:

| Path                                                                          | SHA-256                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/status/GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT_FOR_REVIEW.md` | `bdd994c3f0c01f3e72f8dc28ffa8fa03397ab28cdb4af3517d6f279ea3e64702` |
| `src/app/review/FinalReviewModeLayout.css`                                    | `47d0dede5b0c02fa1270da22e6b180ad5ff0b3b6f8793b33797c6b7077074ff6` |
| `src/app/review/FinalReviewModeLayout.test.tsx`                               | `51e71f69980b9673d614ba55ac0e3f97a73dab4270955fe19e4c7d2037e5d55c` |
| `src/app/review/FinalReviewModeLayout.tsx`                                    | `1312044c13d0aeff0ed771963536532c632438dd187044f07a80fbb76766d51d` |
| `src/screens/World2Root/World2RootScreen.css`                                 | `142721eb970f74b4164407b09979b06120e6cee86baf71425183a7d989137c84` |
| `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts`                | `3579cd547dbe70e1d98517e1d5f714f7fb7018c3205155244e111facf29e496c` |

La suite no produjo mutaciones tracked ni alteró `docs/visual/**`. Sus outputs
quedaron bajo paths ignorados.

## 11. Evidencia visual no tracked

Path: `test-results/evidence/gvo-debt-007a/`.

- `8` JSON before: `72` filas del estado padre.
- `8` JSON after: `72` filas del estado compacto.
- `10` screenshots before.
- `12` screenshots after, incluidos Mundo IV portrait reservado y Mundo II
  Captura reservado.
- Archivos tracked bajo ese path: `0`.

La evidencia técnica y las capturas no sustituyen la revisión visual real del
Ing. José David.

## 12. Paths

### Modificados por GVO_DEBT_007A

- `src/app/review/FinalReviewModeLayout.tsx`.
- `src/app/review/FinalReviewModeLayout.css`.
- `src/app/review/FinalReviewModeLayout.test.tsx`.
- `tests/e2e/gvo-debt-007-final-review-return-safe-area.spec.ts`.

### Creado por GVO_DEBT_007A

- `docs/status/GVO_DEBT_007A_REVIEW_DOCK_COMPACT_PLACEMENT_FOR_REVIEW.md`.

### Cambios recibidos y preservados de GVO_DEBT_007

- `src/screens/World2Root/World2RootScreen.css`.
- `docs/status/GVO_DEBT_007_FINAL_REVIEW_RETURN_SAFE_AREA_LAYOUT_FOR_REVIEW.md`.

## 13. Alcance preservado

- Progreso y checkpoints: intactos.
- Reset: intacto.
- `finalReviewContext`: intacto.
- Mirador: intacto.
- Navegación contractual: intacta.
- Copy y slots editoriales: intactos.
- Legibilidad y diseño interno de Mundo II Captura: no abordados.
- Assets e identidad de Lía: intactos.
- PWA y QR: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- `docs/visual/**`: intacto.
- `CURRENT_STATE.md`: intacto.
- No se creó acta de aprobación.

## 14. Warnings

- Build: chunk principal `817,06 kB` minificado, warning conocido por superar
  `500 kB`.
- Build: warning informativo `PLUGIN_TIMINGS`.
- Suite E2E final: fallback de preload `coverIntroCritical` por timeout, con
  `failed: 0`; la suite terminó PASS.
- Git informó normalización potencial LF→CRLF; se valida aparte con
  `git diff --check`.

## 15. Gaps, riesgos y revisión humana

- Gaps técnicos conocidos dentro del alcance: ninguno.
- Gate pendiente: revisión visual humana obligatoria.
- Debe comprobarse menor ocupación vertical, composición más limpia,
  navegación y CTA visibles, y ausencia de interferencia con Lía y elementos
  principales.
- Riesgo residual: Chromium emula los viewports y el contrato CSS de safe-area,
  pero no sustituye una comprobación física en hardware con notch o barras del
  sistema.
- La aprobación estética corresponde al Ing. José David.

## 16. Control Git

- Commit: no ejecutado.
- Push: no ejecutado.
- Pull Request: no creado.
- Estado de entrega: `PENDING_HUMAN_REVIEW`.
