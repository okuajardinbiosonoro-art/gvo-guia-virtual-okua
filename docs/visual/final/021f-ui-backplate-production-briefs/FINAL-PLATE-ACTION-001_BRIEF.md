# FINAL-PLATE-ACTION-001 — Production brief

`PREPRODUCTION — NOT RUNTIME`

No genera arte, no autoriza integración y no modifica runtime. Presupuesto: `<=90 KiB preliminar`. Secuencia: `3`.
## 1. ID

`FINAL-PLATE-ACTION-001`

## 2. Filename

`final_action_backplate_v01.png`

## 3. Función narrativa

Sostener las dos decisiones de cierre sin depender sólo del color.

## 4. Función visual

Marco neutral 9-slice reutilizable para dos botones DOM.

## 5. Consumidor

`FinalActions`

## 6. Estado/capa

/final · z82

## 7. Canvas

`1024×256`

## 8. Ratio/framing de generación

4:1

## 9. Formato

PNG

## 10. Alpha

PNG RGBA con alpha real

## 11. z

`82`

## 12. Insets 9-slice

top=64, right=112, bottom=64, left=112 px

## 13. Zona segura DOM

x=144–880, y=56–200 px; clearance exterior 12 px para focus

## 14. Tamaños de texto simulados

botón 16 px mínimo; target renderizado >=44×44 px; icono SVG 20–24 px

## 15. Contenido obligatorio

Textos DOM exactos: ‘Volver al inicio’ y ‘Reiniciar recorrido’; iconos SVG y ayuda por código.

## 16. Contenido prohibido

Texto o iconos horneados; codificación sólo verde/violeta; escena, Lía, medallón, perspectiva o foco pintado.

## 17. Referencias

PR01, PR02, PR07–PR12, UI01, UI05, UI06, DOC03, DOC04, DOC06, DOC07.

## 18. Prioridad

P1 · después de revisión de título y créditos

## 19. Qué tomar

9-slice y escala del label; estabilidad de botón W4; diferenciación semántica mediante DOM/SVG/CSS.

## 20. Qué no copiar

No copiar binarios, iconos, color semántico, contorno exacto, copy ni panel futurista.

## 21. Prompt positivo en inglés

```text
Clean warm poetic pixel art, true transparent background, frontal reusable neutral horizontal 9-slice action backplate, exact 4:1 plate ratio inside a square artboard, stable caps and corners, uniform stretchable center, restrained dark wood, Mirador stone, parchment and aged bronze materiality, strong mobile edge readability, same apparent pixel scale as the approved access label plate, no text, no icon.
```

## 22. Prompt negativo en inglés

```text
Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, baked focus ring, green-only or purple-only semantics, strong center highlight, nonuniform center texture, futuristic panel, 3D, anime, vector, photorealism, clipped corners.
```

## 23. Instrucciones de generación

Generar una placa neutral única; el consumidor añade copy, icono, borde/acento y focus; adjuntar referencias en orden ACTION.

## 24. Framing

Placa visible cercana a 960×240 en artboard cuadrado; recorte proporcional a 1024×256; alpha exterior.

## 25. Redimensión máxima

Ampliación objetivo <=7 %; >15 %, corner reconstruction o escala no uniforme obliga a regenerar.

## 26. Criterios

Reutilización byte-idéntica por ambos botones, target >=44, focus exterior visible, seams ausentes y diferenciación no dependiente sólo del color.

## 27. Hard fails

Dos variantes artísticas; texto/icono horneado; focus cortado; target <44; centro no extensible; alpha falso; >15 % de redimensión.

## 28. Photopea

Recortar proporcionalmente; guías exactas; probar a 44/48/56 px de alto y tres anchos; simular ambos copys, SVG y focus 3 px + offset 2 px.

## 29. Exportación

PNG RGBA 1024×256, metadata documentada, objetivo <=90 KiB no bloqueante.

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

TITLE y CREDITS producidos/revisados; iconos SVG futuros; contrato de focus; label PNG canónico.

## 33. Estado

READY_FOR_HUMAN_ASSET_PRODUCTION · BLOCKED_BY_PRIOR_PLATE_REVIEWS
