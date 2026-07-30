# GVO ST5-020D — Recomposición editorial, guía y anclajes responsive

## Estado de entrada

- Baseline verificado: `8023063507b7b3d3518bc27f5fe1064d559feabe`.
- Rama de trabajo: `main`, alineada con `origin/main` y limpia antes de editar.
- Estado humano heredado: `ST5_020C_HUMAN_REJECTED_VISUAL_UX`.
- Alcance: únicamente `/estacion/5`, mapa overview y vertical slices reales de Plantas y Sistema.
- Espacio, Visitante y Final permanecen protegidos; este ticket no los implementa ni avanza de fase.

## Auditoría visual previa de ST5-020C

Se revisaron las 56 combinaciones registradas en `docs/visual/world5/st5-020c/metrics.json`, sus cuatro hojas de contacto y los recortes de tarjeta, Plantas y Sistema. La evidencia confirma:

1. El progreso persistido controla indebidamente la presentación inicial: después de Plantas se muestra automáticamente la ficha de Sistema y después de Sistema la ficha protegida de Espacio.
2. El mapa se compone contra el viewport (`inset` y cuadrado responsive), no contra el rectángulo realmente renderizado de MAP-01/MAP-02. El perímetro del asset se recorta o deforma según orientación.
3. La guía de 020C son fragmentos sobre el fondo general, no una tarjeta atómica. El encabezado técnico y `Mapa del presente` se repiten incluso dentro de las subestaciones.
4. La caja declarada de Lía incluye grandes márgenes transparentes. En `lia_world5_attend_neutral_v01.webp` el sujeto opaco ocupa solo 791/1536 de alto; por eso una caja de 104 px produce cerca de 54 px visibles, no los 96 px mínimos.
5. Plantas conserva contacto aceptable en las capturas, pero el ancla depende de porcentajes de la escena recortada y no de la caja `cover` común.
6. Sistema aparece sobredimensionado y frontal. Su sombra horneada queda separada de la lectura del plano y el pequeño socket del fondo compite con el foco.
7. Las capturas no reportan scroll, 404, requests externos ni visuales procedimentales, pero esa conformidad técnica no equivale a aprobación visual humana.

## Patrones reutilizados de Estaciones III y IV

- De Estación III se reutiliza la arquitectura semántica de una única guía viva: `aside.s3-guide-rail` + `role="status"`/`aria-atomic`, manteniendo orientación y acción en DOM.
- De Estación IV se reutiliza la tarjeta única y estable: `article.s4-card`, jerarquía contexto/título/cuerpo/resultado y actualización atómica `aria-live="polite"`.
- No se reutilizan los bitmaps de backplate, gradientes, símbolos SVG, colores ni estética pixel de III/IV. ST5-020D adapta únicamente la arquitectura editorial a una superficie cálida CSS.

## Contrato de presentación separado del progreso

El progreso persistido continúa en `gvo.station5.v1`. La presentación usa estados propios:

- `map_overview`
- `map_blocked_feedback`
- `plants_intro`
- `plants_resolved`
- `system_intro`
- `system_resolved`
- `transitioning`
- `storage_error`

Entrar, recargar, volver o restaurar progreso en `/estacion/5` siempre produce `map_overview`. Solo un intento explícito sobre un sector protegido produce `map_blocked_feedback`; no cambia ruta ni progreso. La navegación a una subestación no completa nada: únicamente el target real ejecuta la persistencia.

## ProjectedRasterStage

Mapa y subestaciones comparten un único principio de proyección:

- El contenedor de escena establece una caja de consulta (`container-type: size`).
- Un `mediaCanvas` calcula su tamaño real con unidades de consulta del contenedor.
- `contain`: `min(100cqw, 100cqh × ratio)` y su altura recíproca.
- `cover`: `max(100cqw, 100cqh × ratio)` y su altura recíproca.
- Fondo, rim, sectores, labels, targets y focos se posicionan dentro del mismo `mediaCanvas`, nunca contra el viewport.
- Ratios intrínsecos: mapa `1440/2560` portrait y `2560/1440` landscape; subestaciones `1440/1920` portrait y `1920/1080` landscape.

## Anclajes y alternativa de Sistema

### Plantas

El raster alpha ocupa `[381,208]..[1168,1303]` sobre 1536². El punto inferior real se fija al borde de tierra/jardinera dentro del `mediaCanvas`; el target de hoja permanece en el mismo raster. La orientación puede cambiar coordenadas por tratarse de dos fondos distintos, pero no depende de la altura recortada del viewport.

### Sistema

El raster alpha ocupa `[192,389]..[1224,1143]` e incluye su propia sombra. La alternativa 020D:

- reduce la escala respecto de 020C;
- alinea la base opaca y la sombra al plano de la mesa;
- desplaza el foco hacia la relación socket/caja existente;
- aplica solo una rotación Z estática pequeña y documentada (`-2.5deg` portrait, `-2deg` landscape);
- conserva escala uniforme, orientación y oclusión originales.

No se permite `skew`, escala no uniforme, `rotateX`, `rotateY`, espejo, sombra, cable u objeto nuevo. La decisión de publicación depende de la comparación QA 020C/alternativa y del overlay de ejes/plano, ambos exclusivamente documentales.

## Mapa de poses de Lía

| Presentación                                    | Pose aprobada    |
| ----------------------------------------------- | ---------------- |
| Overview, siguiente sector y feedback bloqueado | `attend_neutral` |
| Explicación/resolución de Plantas y Sistema     | `explain_calm`   |
| Entrada o retorno durante transición            | `lead_forward`   |

`greeting` se reserva para una síntesis/CTA posterior y no se renderiza en el alcance actual. No hay espejo, deformación, recorte anatómico ni animación de reposo.

## Decisiones editoriales

- Una tarjeta cálida real, sólida/semitransparente, contiene contexto, título, cuerpo, estado/resultado, acción y Lía.
- Máximo de cuatro roles tipográficos visibles.
- El título dominante del overview es `Mapa del presente`; Plantas y Sistema usan su propio título sin duplicar el del mapa.
- El overview narra la orientación general y el siguiente paso sin sustituirse por una ficha de subestación.
- El feedback protegido usa solo copy y la pose aprobada de Lía.

## Validación y estado final

### AUTOMATED_GATES

| Gate | Resultado |
| --- | --- |
| Baseline inicial | PASS — `8023063507b7b3d3518bc27f5fe1064d559feabe`, `main`, divergencia `0/0` |
| Suite unitaria global | PASS — 22 archivos, 252 pruebas |
| Unit focal ST5 | PASS — 24/24 |
| ESLint | PASS |
| TypeScript + Vite build | PASS |
| E2E Estación V 020A–020D | PASS — 23/23; incluye flujo nuevo, refresh, Back, teclado, reduced motion, storage/retry, altura dinámica y reflow 200% |
| QA responsive | PASS — 64 capturas, 8 estados × 8 viewports |
| Scroll normal | PASS — overflow horizontal máximo `0 px`, vertical máximo `0 px` |
| Targets | PASS — dimensión mínima `44 px` |
| Lía visible | PASS — altura alpha visible mínima `113.294 px` |
| Cuerpo editorial | PASS — mínimo `14 px` |
| Artboard/proyección | PASS — deriva máxima de ratio `0.000086` |
| Contacto Plantas | PASS — deriva máxima `0.135 px` |
| Sistema | PASS — escala uniforme, sombra raster conservada y Z estática `-2.5deg` portrait / `-2deg` landscape |
| Visuales procedimentales | PASS — `0` en 64 estados |
| Consola / page errors / 404 / red externa | PASS — `0 / 0 / 0 / 0` |
| Assets runtime/current-used | PASS — 18/18 `BYTE_IDENTICAL`, sin assets nuevos |
| PWA precache | PASS — 18/18 assets ST5, shell, manifest, `registerSW` y navigation fallback presentes en `dist/sw.js` |

La prueba estática PWA está registrada en `docs/visual/world5/st5-020d/pwa_precache.json`. Se intentó además un probe Chromium offline adicional: el contexto reportó service worker controlador pero no estabilizó `CacheStorage`, por lo que fue descartado y **no se declara como PASS**, conforme al límite explícito del ticket. No se modificó la configuración PWA.

### CODEX_VISUAL_SELF_REVIEW

Se inspeccionaron las capturas individuales, las ocho hojas responsive, las hojas de Plantas y tarjeta/Lía, la comparación 020C/020D y el overlay de proyección de Sistema.

- El mapa vuelve a ser siempre overview y conserva el perímetro intrínseco en ambas orientaciones.
- La tarjeta es una unidad cálida legible; no existe franja técnica separada ni título de mapa duplicado en subestaciones.
- Lía es claramente visible, no interactiva y usa `attend_neutral`, `explain_calm` o `lead_forward` según el contrato.
- Plantas conserva contacto con tierra/jardinera en todos los viewports y estados.
- Sistema deja de dominar la escena; la escala reducida, la base opaca, la sombra horneada y la rotación Z mínima se leen de forma coherente con el plano y el socket existentes.
- No se añadió sombra, cable, skew, escala no uniforme, espejo, `rotateX`, `rotateY` ni visual procedimental.

```text
CODEX_VISUAL_SELF_REVIEW_PASS
```

### Evidencia

- `docs/visual/world5/st5-020d/metrics.json` — 64 registros completos.
- `docs/visual/world5/st5-020d/summary.json` — métricas agregadas.
- `docs/visual/world5/st5-020d/<viewport>_<estado>.png` — 64 capturas individuales.
- `docs/visual/world5/st5-020d/contact_sheet_<viewport>.jpg` — ocho hojas por viewport.
- `docs/visual/world5/st5-020d/contact_sheet_plants_multi_viewport.jpg` — contacto de Plantas.
- `docs/visual/world5/st5-020d/contact_sheet_card_lia_multi_viewport.jpg` — tarjeta y Lía.
- `docs/visual/world5/st5-020d/comparison_020c_020d_flow_390x844.jpg` — flujo comparado.
- `docs/visual/world5/st5-020d/comparison_020c_020d_system_390x844.jpg` — Sistema 020C/020D.
- `docs/visual/world5/st5-020d/qa_system_projection_axes_390x844.png` — canvas, plano y foco; QA únicamente.
- `docs/visual/world5/st5-020d/refresh_completed_overview_390x844.png` — refresh con `['plantas','sistema']` que conserva overview.
- `docs/visual/world5/st5-020d/pwa_precache.json` — precache generado.

### Deudas deliberadas y límites preservados

- Copy permanece `candidate`; no se declara `COPY_APPROVED`.
- Espacio y Visitante solo ofrecen feedback protegido después de interacción explícita.
- No se implementaron 3/4, 4/4, cierre, Final ni navegación a Final.
- No se añadió audio, CDN, dependencia, API, asset runtime ni identidad nueva de Lía.
- `greeting` queda reservado para una síntesis/CTA futura y no se usa aquí.

### PENDING_HUMAN_REVIEW

Estado técnico de publicación previsto:

```text
ST5_020D_PUBLISHED_PENDING_HUMAN_REVIEW
```

Este estado no equivale a `HUMAN_APPROVED`, `STATION5_COMPLETE`, `SPACE_COMPLETE`, `VISITOR_COMPLETE` ni `FINAL_COMPLETE`.

Acción humana pendiente exacta:

```text
REVISIÓN HUMANA DE MAPA OVERVIEW + TARJETA + GUÍA + PLANTAS + SISTEMA
```
