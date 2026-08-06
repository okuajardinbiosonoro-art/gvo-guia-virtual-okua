# GVO_DEBT_008 — World II legibility and responsive readability — para revisión

## 1. Estado

- Estado técnico: `PENDING_HUMAN_REVIEW`.
- Baseline obligatorio y HEAD actual: `161919eeda79d42f9751da6d8411fededa2bf0e0`.
- Rama: `main`.
- Commit, push y Pull Request: no ejecutados.
- `docs/status/CURRENT_STATE.md`: no modificado.

El Ing. José David aprobó visualmente la composición directa después de los
ajustes de Planta y Señal. En la misma revisión detectó que, al regresar desde
el Mirador, algunos elementos volvían a solaparse. Esa revisita fue corregida
después de la aprobación; por separación estricta entre evidencia técnica y
gate humano, el estado canónico permanece `PENDING_HUMAN_REVIEW` para esta
última delta visual.

## 2. Alcance implementado

Se mejoró la legibilidad de las seis capas existentes de Mundo II sin
rediseñar la pantalla ni reconstruir Captura:

- tipografía efectiva y contraste de títulos, diálogos, readouts y etiquetas;
- targets mínimos de `44px` para navegación, Captura y controles de Mapeo;
- reflow vertical en portrait, landscape bajo y `320` CSS px;
- navegación de capas `3 × 2` en el flujo responsive normal;
- preservación de la navegación compacta `6 × 1` durante revisita desde
  Mirador;
- áreas de lectura seguras en Captura, Mapeo y Resultado;
- zoom de texto al `200%` sin clipping ni overflow horizontal.

No se alteraron estados, progreso, checkpoints, reset, navegación contractual
ni copy editorial.

## 3. Refinamientos de revisión humana

### 3.1 Planta

El readout expandido se desplazó a la zona izquierda y se limitó a `62%` del
ancho responsive. Su borde derecho termina antes de comenzar el rectángulo de
Lía, con aserción geométrica E2E explícita.

### 3.2 Señal antes de revelar

El asset unificado aprobado no fue modificado. En estado `idle` se ajustó solo
su posición CSS para que el punto luminoso del electrodo coincida con el mismo
punto de contacto de la planta usado en la primera capa. El estado expandido
conserva la composición previamente aprobada.

### 3.3 Regreso desde Mirador

La reproducción real desde `/final` identificó tres problemas que no estaban
cubiertos por la matriz genérica de `GVO_DEBT_007A`:

1. el dock flotante cubría el control `Onda medida`;
2. el texto de Captura invadía la fila de sus tres pasos;
3. el contador y la microcopia de Mapeo quedaban cubiertos o recortados.

Se corrigieron únicamente mediante reglas de Mundo II bajo el ancestro de
revisión activa:

- `Onda medida` ocupa la zona superior izquierda, libre del dock;
- el readout de Captura gana ancho y altura suficientes sin cubrir a Lía ni
  los tres controles;
- el contador `3 / 3` de Mapeo queda junto a su rótulo y la relación vertical
  se compacta sin reducir los pisos tipográficos.

`FinalReviewModeLayout`, el contexto de revisión y el comportamiento del
Mirador permanecen intactos.

## 4. Auditoría before/after

Matriz principal: `6` viewports × `6` capas = `36` filas.

| Métrica | Before | After |
| --- | ---: | ---: |
| Muestras de texto | 756 | 816 |
| Textos bajo su piso | 462 | 0 |
| Tamaño mínimo observado | 4,80px | 10,00px |
| Textos recortados | 8 | 0 |
| Controles medidos | 270 | 270 |
| Controles bajo `44px` | 45 | 0 |
| Ancho mínimo de control | 29,37px | 50,34px |
| Alto mínimo de control | 2,00px | 44,00px |
| Colisiones | 8 | 0 |
| Overflow horizontal máximo | 0px | 0px |

Casos especiales:

| Caso | Fase | Textos bajo piso | Recortados | Controles pequeños | Colisiones | Overflow |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Zoom `200%` | Before | 1 | 11 | 3 | 11 | 0px |
| Zoom `200%` | After | 0 | 0 | 0 | 0 | 0px |
| Reflow `320px` | Before | 71 | 0 | 7 | 0 | 0px |
| Reflow `320px` | After | 0 | 0 | 0 | 0 | 0px |

La auditoría posterior también cubre el estado `idle` de Señal y una revisita
real desde Mirador en Planta, Señal expandida, Captura, Acondicionamiento,
Mapeo y Resultado.

## 5. Viewports y contratos cubiertos

- `360×640`
- `390×844`
- `412×915`
- `844×390`
- `915×412`
- `768×1024`
- zoom de texto `200%`
- reflow a `320` CSS px
- teclado Enter
- touch
- reduced motion
- revisita real desde Mirador a `390×844`

Se preservan seis capas, orden, navegación, estados de progreso, estructura de
Captura, identidad visual y contenido editorial.

## 6. Validaciones finales

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio |
| `npm run lint` | PASS |
| `npm run test` | PASS — 473/473 en 34 archivos |
| `npm run build` | PASS — 606 módulos; PWA `generateSW`, 278 entradas |
| E2E focal `GVO_DEBT_008` | PASS — 11/11 |
| Regresión `GVO_DEBT_007A` | PASS — 13/13 |
| `npm run test:e2e` | Playwright: 127/127 PASS en 14,9 min; el wrapper devolvió `124` al alcanzar 900 s durante el cierre posterior al resumen |
| `git diff --check` | PASS |

La suite global no reportó tests fallidos. El código de salida `124` pertenece
al límite externo de ejecución después de que Playwright imprimiera
`127 passed (14.9m)`; se registra como warning de teardown y no se oculta como
un PASS de proceso.

## 7. Evidencia visual y geométrica

Path ignorado: `test-results/evidence/gvo-debt-008/`.

- Before restaurado: `20` JSON y `14` PNG.
- After final: `28` JSON y `21` PNG.
- Evidencia tracked bajo ese path: `0` archivos.
- Capturas de revisita incluidas para Planta, Señal, Captura,
  Acondicionamiento, Mapeo y Resultado.

La evidencia técnica no sustituye la validación visual humana de la última
delta aplicada después del hallazgo de revisita.

## 8. Archivos modificados o creados

- `src/screens/World2Root/World2RootScreen.css`
- `src/screens/World2Root/World2CaptureTimeline.css`
- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.test.tsx`
- `tests/e2e/gvo-debt-008-world2-legibility.spec.ts`
- `docs/status/GVO_DEBT_008_WORLD2_LEGIBILITY_AND_RESPONSIVE_READABILITY_FOR_REVIEW.md`

## 9. Alcance preservado

- Assets: intactos; no se creó, movió ni reemplazó ningún archivo.
- Política runtime y registro `current-used`: revisados; sin cambios necesarios.
- Copy editorial FINAL: intacto.
- Checkpoints y progreso: intactos.
- Reset real: intacto.
- Mirador y `FinalReviewModeLayout`: intactos.
- PWA y QR: intactos.
- Dependencias, `package.json` y lockfile: intactos.
- Captura: misma estructura y semántica; no reconstruida.
- Identidad de Lía: intacta.
- Commit, push y PR: no ejecutados.

## 10. Warnings

- Build: chunk principal superior a `500 kB`, warning conocido.
- Build: warning informativo `PLUGIN_TIMINGS`.
- Git: aviso de normalización potencial LF→CRLF; `git diff --check` permanece
  limpio.
- Suite E2E completa: timeout externo de teardown descrito en la sección 6.

## 11. Estado final del repositorio

- HEAD permanece en el baseline obligatorio.
- Worktree modificado únicamente por los seis paths declarados en este
  informe.
- Sin commit, sin push y sin Pull Request.
- Estado canónico del ticket: `PENDING_HUMAN_REVIEW`.
