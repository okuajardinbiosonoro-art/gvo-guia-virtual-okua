# FINAL-PLATE-DIALOG-001 — Decisión A/B/C y brief resultante

`PREPRODUCTION — NOT RUNTIME`

## Opciones evaluadas

- **A — NUEVO BACKPLATE 9-SLICE.** Binario nuevo específico del Mirador; materialidad pictórica en asset y comportamiento en DOM/CSS.
- **B — REUTILIZAR MATERIALIDAD DE OTRA PLACA CON NUEVO CONSUMIDOR.** Reutilización binaria o acoplamiento a una silueta existente W2/W4.
- **C — CSS/DOM SIN NUEVO ASSET.** Panel geométrico determinista, sin textura pictórica.

## Matriz comparativa

| Criterio | A — nuevo 9-slice | B — reutilizar | C — CSS/DOM |
| --- | --- | --- | --- |
| Materialidad Art Bible | **Alta**; Mirador propio | Baja/media; arrastra W2/W4 | Baja; panel genérico |
| 375×667 | PASS con 343 px y reflow | Riesgo por ratios ajenos | PASS técnico |
| 667×375 | PASS con máximo 560×319 | Title/credits demasiado bajos; W2/W4 deformables | PASS técnico |
| Foco/scrim/error/retry | DOM/CSS sobre centro flexible | Consumidor previo no cubre todos los estados | DOM/CSS completo |
| Peso | Un PNG nuevo; presupuesto medido | Menor sólo si se promoviera binario | Menor |
| 9-slice | Biaxial específico | No certificado para este contenido | No aplica |
| H07/licencia | Evita promoción binaria ajena | **Bloqueado** para W2/W4 | Sin binario |
| Contraste/materialidad | Gobernable por brief | Identidad ajena | Depende de CSS plano |
| Mantenimiento | Un contrato propio | Acopla consumidores | Simple pero visualmente insuficiente |

## Decisión

```text
A — NUEVO BACKPLATE 9-SLICE
FINAL-PLATE-DIALOG-001
final_restart_dialog_backplate_v01.png
1536×1024 PNG RGBA · z110
```

## Fundamento

El diálogo debe alojar título, descripción, dos botones y estados busy/error/retry en dos ejes. Las placas TITLE y CREDITS tienen ratios 3:1 y 4:1 y no ofrecen altura segura; W2/W4 conservan semántica y materialidad de otros mundos y H07 impide su promoción binaria. CSS/DOM resuelve geometría y accesibilidad, pero no la textura cálida aprobada del Mirador. Por ello A es la única opción que satisface simultáneamente arte, composición, H07 y mantenimiento. Scrim, foco, layout y estados continúan en CSS/DOM; sólo la materialidad pertenece al PNG.

## Brief resultante

## 1. ID

`FINAL-PLATE-DIALOG-001`

## 2. Filename

`final_restart_dialog_backplate_v01.png`

## 3. Función narrativa

Pedir confirmación consciente y alojar busy, error y reintento sin pérdida de contexto.

## 4. Función visual

Marco modal 9-slice con materialidad propia del Mirador y contenido DOM flexible.

## 5. Consumidor

`FinalRestartDialog`

## 6. Estado/capa

/final · final_restart_prompt · z110

## 7. Canvas

`1536×1024`

## 8. Ratio/framing de generación

3:2 source; 9-slice adaptable a portrait y landscape corto

## 9. Formato

PNG

## 10. Alpha

PNG RGBA con alpha real; scrim pertenece a CSS

## 11. z

`110`

## 12. Insets 9-slice

top=160, right=192, bottom=160, left=192 px

## 13. Zona segura DOM

x=224–1312, y=176–848 px; contenido en columna; botones en fila cuando haya ancho

## 14. Tamaños de texto simulados

título 20 px, descripción/error 16 px, botones 16 px, target >=44 px; sin scroll interno

## 15. Contenido obligatorio

Confirmación, descripción, Cancelar, Reiniciar recorrido, busy, error de reset y Reintentar como DOM; copy de error/retry sigue pendiente editorial.

## 16. Contenido prohibido

Texto, Lía, iconos operativos, scrim, spinner, focus, estados, escenas, portales, perspectiva o elemento central rígido.

## 17. Referencias

PR01, PR02, PR12, UI01–UI06, DOC04–DOC07.

## 18. Prioridad

P1 condicional resuelto a A · producir sólo después de título/créditos/acción revisados

## 19. Qué tomar

Materialidad/escala del label; sólo técnica 9-slice de W2/W4; capacidad del layout aprobado para estados y foco.

## 20. Qué no copiar

No copiar binarios, siluetas W2/W4, violeta, panel futurista, texto, botones, scrim ni semántica de otro consumidor.

## 21. Prompt positivo en inglés

```text
Clean warm poetic pixel art, true transparent background, frontal reusable two-dimensional 9-slice restart dialog backplate, exact 3:2 plate ratio, stable corners and caps, uniform stretchable center in both axes, restrained parchment center with dark wood, Mirador stone and aged bronze frame, calm modal hierarchy, mobile readability, same apparent pixel scale as the approved access label plate, generous neutral content field, no text, no icon.
```

## 22. Prompt negativo en inglés

```text
Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, scrim, spinner, focus ring, buttons, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform stretch zones, futuristic panel, purple sci-fi style, 3D, anime, vector, photorealism, clipped corners.
```

## 23. Instrucciones de generación

Generar la placa como 3:2 cerca del canvas final, con centro biaxial uniforme; scrim, layout, focus, busy/error/retry permanecen en DOM/CSS.

## 24. Framing

Placa cercana a 1440×960 o 1536×1024; recorte proporcional; render contractual 343×auto en 375×667 y hasta 560×319 en 667×375.

## 25. Redimensión máxima

Objetivo <=7 %; máximo absoluto 15 %; cualquier recomposición fuerte, reconstrucción de borde o estiramiento separado obliga a regenerar.

## 26. Criterios

9-slice biaxial sin seams; 375×667 y 667×375 sin scroll interno; foco visible; dos botones; busy/error/retry; scrim CSS; contraste y lectura.

## 27. Hard fails

Reutilización binaria W2/W4; CSS pintado dentro del PNG; texto/Lía; contenido rígido; modal >319 px en 667×375; scroll interno; focus cortado; alpha falso.

## 28. Photopea

Verificar alpha/bbox; guías; probar 343×auto, 480×auto y 560×310; simular estados base/busy/error; revisar seams y focus exterior.

## 29. Exportación

PNG RGBA 1536×1024, metadata documentada, presupuesto inicial <=220 KiB sujeto a medición; no promover.

## 30. Metadata/hash

Retornar filename, canvas, formato, modo, alpha real, bbox alpha, bytes y SHA-256. No inventar valores antes de producir.

## 31. Plantilla de retorno

```text
asset_id:
filename:
source_tool:
source_canvas:
final_canvas:
format_mode_alpha:
alpha_bbox:
bytes:
sha256:
resize_percent:
9slice_test:
dom_copy_fit:
viewports_checked:
hard_fails:
human_review:
status: CANDIDATE_NOT_RUNTIME
```

## 32. Dependencias

TITLE, CREDITS y ACTION producidos/revisados; copy error/retry aprobado; contrato modal y reset transaccional futuro.

## 33. Estado

READY_FOR_HUMAN_ASSET_PRODUCTION · DECISION_A · BLOCKED_BY_PRIOR_PLATE_REVIEWS
