# FINAL-PLATE-TITLE-001 — Production brief

`PREPRODUCTION — NOT RUNTIME`

No genera arte, no autoriza integración y no modifica runtime. Presupuesto: `<=180 KiB preliminar`. Secuencia: `1`.
## 1. ID

`FINAL-PLATE-TITLE-001`

## 2. Filename

`final_title_backplate_v01.png`

## 3. Función narrativa

Declarar el cierre del recorrido y enmarcar el nombre del Mirador.

## 4. Función visual

Placa superior de materialidad cálida, legible sin consumir demasiado cielo.

## 5. Consumidor

`FinalHeader`

## 6. Estado/capa

/final · z80

## 7. Canvas

`1536×512`

## 8. Ratio/framing de generación

3:1

## 9. Formato

PNG

## 10. Alpha

PNG RGBA con alpha real

## 11. z

`80`

## 12. Insets 9-slice

top=112, right=192, bottom=112, left=192 px

## 13. Zona segura DOM

x=224–1312, y=104–408 px; 32 px internos respecto de caps laterales

## 14. Tamaños de texto simulados

h1 28 px mínimo; subtítulo 16 px mínimo; line-height 1.15/1.35

## 15. Contenido obligatorio

Texto DOM exacto: ‘Mirador final del jardín’ y ‘Recorrido completo’.

## 16. Contenido prohibido

Texto, letras, números, logos, iconos, Lía, escenas, perspectiva y ornamento focal central.

## 17. Referencias

PR01, PR02, PR05, PR06, PR12, UI01, UI04, UI06, DOC01, DOC04, DOC06, DOC07.

## 18. Prioridad

P0 · primer y único asset habilitado después de 021F

## 19. Qué tomar

Escala de píxel y bronce del label; estabilidad técnica de caps W4; contraste contra ambos Environment.

## 20. Qué no copiar

No copiar el binario del label/W4, su contorno exacto, texto, símbolos, violeta W2 ni panel futurista.

## 21. Prompt positivo en inglés

```text
Clean warm poetic pixel art, true transparent background, frontal reusable horizontal 9-slice title backplate, exact 3:1 plate ratio inside a square artboard, stable caps and corners, uniform stretchable center, restrained parchment, dark wood, Mirador stone and aged bronze materiality, calm mobile readability, same apparent pixel scale as the approved access label plate, no central ornament, no text.
```

## 22. Prompt negativo en inglés

```text
Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform center texture, futuristic panel, purple sci-fi panel, 3D, anime, vector, photorealism, clipped corners.
```

## 23. Instrucciones de generación

Generar en artboard 1:1 con placa frontal 3:1 centrada, alpha exterior claro y centro uniforme. Adjuntar referencias en el orden del pack TITLE.

## 24. Framing

Placa visible cercana a 1440×480 dentro del artboard; recorte proporcional hacia 1536×512; ornamentos sólo en caps/esquinas.

## 25. Redimensión máxima

Ampliación objetivo <=7 %; >15 %, reconstrucción de esquinas o escala no uniforme obliga a regenerar.

## 26. Criterios

Ratio exacto, alpha real, 9-slice sin seams en tres anchos, h1/subtítulo dentro de safe area, focus exterior libre y contraste útil en seis viewports.

## 27. Hard fails

Texto o icono horneado; centro no extensible; perspectiva; alpha falso; corners cortados; seams; foco recortado; >15 % de redimensión; ocupa cielo fuera del contrato.

## 28. Photopea

Recortar proporcionalmente; verificar alpha/bbox; fijar guías; probar source, 75 %, 125 % y portrait compacto; revisar seams y focus; no reconstruir materialidad.

## 29. Exportación

PNG RGBA 1536×512, metadata de color documentada, objetivo <=180 KiB no bloqueante; no optimizar después de aprobación sin ticket.

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

021C Art Bible/cámaras; Environment y foreground aprobados; label PNG canónico; revisión humana de este primer asset.

## 33. Estado

READY_FOR_HUMAN_ASSET_PRODUCTION · FIRST_ONLY
