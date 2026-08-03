# FINAL-PLATE-CREDITS-001 — Production brief

`PREPRODUCTION — NOT RUNTIME`

No genera arte, no autoriza integración y no modifica runtime. Presupuesto: `<=140 KiB preliminar`. Secuencia: `2`.
## 1. ID

`FINAL-PLATE-CREDITS-001`

## 2. Filename

`final_credits_backplate_v01.png`

## 3. Función narrativa

Reconocer autoría sin competir con el cierre ni las acciones.

## 4. Función visual

Franja inferior sobria, baja y extensible.

## 5. Consumidor

`FinalCredits`

## 6. Estado/capa

/final · z82

## 7. Canvas

`1536×384`

## 8. Ratio/framing de generación

4:1

## 9. Formato

PNG

## 10. Alpha

PNG RGBA con alpha real

## 11. z

`82`

## 12. Insets 9-slice

top=96, right=176, bottom=96, left=176 px

## 13. Zona segura DOM

x=208–1328, y=72–312 px

## 14. Tamaños de texto simulados

dos líneas a 14 px mínimo; line-height >=1.35

## 15. Contenido obligatorio

Texto DOM exacto: ‘Desarrollado por Momotto S.A.S.’ y ‘A cargo del Ing. José David Pérez Zapata.’

## 16. Contenido prohibido

Texto horneado, logotipos, firmas, iconos, Lía, medallón central, gran altura y contraste inferior al contractual.

## 17. Referencias

PR01, PR02, PR05, PR06, PR12, UI01, UI04, UI06, DOC02, DOC04, DOC06, DOC07.

## 18. Prioridad

P1 · sólo después de revisión humana del título

## 19. Qué tomar

Sobriedad y escala del label; borde estable W4; contraste de Environment y foreground.

## 20. Qué no copiar

No copiar binarios, contornos exactos, ornamentos dominantes, copy, firmas ni tratamiento futurista.

## 21. Prompt positivo en inglés

```text
Clean warm poetic pixel art, true transparent background, frontal reusable horizontal 9-slice credits backplate, exact 4:1 plate ratio inside a square artboard, stable low-profile caps and corners, uniform stretchable center, restrained parchment, dark wood, Mirador stone and aged bronze materiality, quiet footer hierarchy, mobile readability at 14 pixels, same apparent pixel scale as the approved access label plate, no text.
```

## 22. Prompt negativo en inglés

```text
Text, letters, numbers, logos, signatures, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform center texture, futuristic panel, 3D, anime, vector, photorealism, clipped corners.
```

## 23. Instrucciones de generación

Generar en artboard 1:1 con placa frontal 4:1 centrada; conservar centro largo y sobrio; adjuntar referencias en orden CREDITS.

## 24. Framing

Placa visible cercana a 1440×360; recorte proporcional a 1536×384; alpha exterior; altura visual menor que TITLE.

## 25. Redimensión máxima

Ampliación objetivo <=7 %; >15 %, corners reconstruidos o escala no uniforme obliga a regenerar.

## 26. Criterios

Dos líneas DOM a 14 px, sin scroll, tres anchos sin seams, contraste sobre ambos fondos, franja menor que TITLE y focus/flujo no interferidos.

## 27. Hard fails

Texto o firma horneados; exceso de altura; centro ornamentado; seams; alpha falso; contraste insuficiente; >15 % de redimensión.

## 28. Photopea

Recortar proporcionalmente; verificar alpha/bbox; aplicar insets; probar 9-slice a 60/100/140 %; simular dos líneas; revisar 375×667 y 667×375.

## 29. Exportación

PNG RGBA 1536×384, metadata documentada, objetivo <=140 KiB no bloqueante.

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

TITLE producido y revisado; 021C; Environment; label PNG canónico.

## 33. Estado

READY_FOR_HUMAN_ASSET_PRODUCTION · BLOCKED_BY_TITLE_REVIEW
