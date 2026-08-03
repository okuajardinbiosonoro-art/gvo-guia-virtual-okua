# FINAL-LIA-GREET-001 — Brief de producción

> PREPRODUCTION — NOT RUNTIME. Documentación de producción; no es arte ni autorización de integración.

## 1. ID

`FINAL-LIA-GREET-001`.

## 2. Filename

`final_lia_greeting_4f_v01.webp`.

## 3. Función narrativa

Saludo ceremonial breve de llegada al Mirador, sin antropomorfizar a Lía.

## 4. Función visual

One-shot contenido que parte de idle y vuelve de forma compatible a idle.

## 5. Consumidor

Futuro actor Lía de `/final`; no implementado en 021G.

## 6. Estado/capa

Capa de personaje, z `74`; gesto no loop.

## 7. Canvas

`1024×256 px`.

## 8. Grid/celdas

`4×1`; cuatro celdas exactas de `256×256 px`; sin gutters.

## 9. Ratio/framing de generación

Misma estrategia del idle: una única composición horizontal en el modo nativo más ancho realmente soportado, documentando dimensiones reales y manteniendo cuatro poses coherentes.

## 10. Formato

WebP RGBA con transparencia real.

## 11. Alpha

Sí; sin matte ni entorno.

## 12. z

`74`.

## 13. Identidad invariable

Exactamente cinco pétalos; cabeza opalescente; ojos en media luna; collar ámbar; bulbo/cuerpo segmentado; silueta vegetal; sin anatomía ni rasgos humanos; una sola Lía; sin flip.

## 14. Safe area por frame

20 px por lado dentro de cada celda.

## 15. Alpha bbox objetivo

Objetivo por celda `x=34–222`, `y=20–236`; medir y reportar bbox real.

## 16. Baseline/centro

Centro visible `x=128 ±6 px`; baseline `y=232 ±4 px`; compatible con idle aprobado.

## 17. Acting por frame

F1 idle de partida; F2 inclinación ceremonial mínima; F3 apertura contenida de pétalos; F4 retorno compatible con idle.

## 18. Movimiento máximo

Duración total ≤700 ms; sin salto, drift horizontal o cambio de escala; escala entre frames ≤2 %, center drift ≤6 px y baseline drift ≤4 px.

## 19. Contenido obligatorio

Una sola Lía canónica, cuatro frames coherentes, gesto vegetal breve y retorno limpio a idle.

## 20. Contenido prohibido

Pétalos extra/faltantes; boca/nariz/cejas; brazos/manos; piernas/pies; ropa, alas o accesorios; duplicación; flip; fondo; texto; separadores; rebote; squash/stretch; blur; cambio de color/iluminación.

## 21. Referencias exactas

Ver `final_021g_lia_reference_manifest.csv`; prioridades P0 primero. H07 permanece abierto y prohíbe reutilización binaria.

## 22. Prioridad

P1, pero bloqueada hasta aprobación humana del idle.

## 23. Qué tomar

Idle aprobado como base; C03/W102/W105/W106/W304/W305 para acting; T03/T04 para coherencia técnica.

## 24. Qué no copiar

No copiar manos, reverencia humana, fondo, composición de otros mundos o frames binarios existentes.

## 25. Prompt positivo en inglés

one single Lia, exactly five petals, canonical opalescent head, crescent eyes, amber collar, segmented plant body, no human anatomy, warm poetic pixel art, true transparent background, identical scale, identical lighting, common baseline, subtle motion, no text, no separators, no labels, no numbered frames, no background, no Mirador environment baked into sprites, four poses in one continuous horizontal sprite master, exact four-frame count, equal 256 by 256 final cells, restrained ceremonial plant greeting, starts at approved idle and returns cleanly to idle, total motion under seven hundred milliseconds

## 26. Prompt negativo en inglés

extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, multiple characters, clone variation, changing anatomy, changing scale, changing colors, bounce, strong squash or stretch, gelatinous motion, asymmetrical frame crop, labels, numbers, grid lines, solid background, bloom veil, 3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, horizontal flip

## 27. Instrucciones de generación

No iniciar antes del gate humano de idle. Cuando se habilite, generar cuatro poses en una sola composición y una sola sesión; registrar el modo nativo real; detener ante variación anatómica o necesidad de redimensión >15 %.

## 28. Redimensión máxima

Una sola redimensión proporcional total ≤15 %; diferencia entre frames ≤2 %.

## 29. Criterios

4 frames; one-shot ≤700 ms; identidad exacta; inicio y retorno compatibles con idle; alpha, centro y baseline dentro de tolerancia.

## 30. Hard fails

Cualquier cambio de identidad; frame count/canvas/grid incorrectos; fondo opaco; flip; drift visible; rebote; oclusión; bloom veil; reconstrucción fuerte; >15 % de redimensión; promoción runtime.

## 31. Photopea

Superponer O06, recortar cuatro celdas exactas, alinear sin redibujar, medir bboxes/centro/baseline y probar `greeting→idle`.

## 32. Exportación

Exportar WebP RGBA `1024×256`; no promover.

## 33. Metadata/hash

Retornar dimensiones nativas de generación, dimensiones finales, modo, alpha, bytes, SHA-256, bbox alpha por frame/asset, escala por frame, center drift y baseline drift.

## 34. Plantilla de retorno

`ID | filename | native canvas | final canvas | format/mode/alpha | bytes | SHA-256 | bbox(es) | scale delta | center drift | baseline drift | QA claro/oscuro/portrait/landscape | human review status | NOT_PROMOTED`.

## 35. Dependencias

`FINAL-LIA-IDLE-001` producido, revisado y aprobado explícitamente por Ing. José David; fuentes y guías 021G.

## 36. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION / BLOCKED_BY_IDLE_HUMAN_APPROVAL`.
