# FINAL-LIA-IDLE-001 — Brief de producción

> PREPRODUCTION — NOT RUNTIME. Documentación de producción; no es arte ni autorización de integración.

## 1. ID

`FINAL-LIA-IDLE-001`.

## 2. Filename

`final_lia_idle_contemplative_6f_v01.webp`.

## 3. Función narrativa

Sostener la contemplación ceremonial de Lía en el Mirador sin competir con los cinco accesos.

## 4. Función visual

Loop sobrio de reposo con microflotación, un parpadeo sutil y anatomía completamente estable.

## 5. Consumidor

Futuro actor Lía de `/final`; 021G no implementa ni registra consumidor runtime.

## 6. Estado/capa

Capa de personaje principal; z contractual `74`; loop contemplativo.

## 7. Canvas

`1536×256 px`.

## 8. Grid/celdas

`6×1`; seis celdas exactas de `256×256 px`; sin gutters.

## 9. Ratio/framing de generación

Un solo master horizontal en el modo nativo horizontal más ancho realmente soportado por la herramienta. Registrar sus dimensiones reales; no inventarlas. Mantener las seis Lías dentro de una única composición y recortar con la guía 6f.

## 10. Formato

WebP RGBA con transparencia real.

## 11. Alpha

Sí. Sin matte, fondo sólido ni píxeles opacos fuera del sujeto.

## 12. z

`74`.

## 13. Identidad invariable

Exactamente cinco pétalos; cabeza opalescente; ojos en media luna; collar ámbar; bulbo/cuerpo segmentado; silueta vegetal; sin anatomía ni rasgos humanos; una sola Lía; sin flip.

## 14. Safe area por frame

20 px por lado dentro de cada celda.

## 15. Alpha bbox objetivo

Objetivo por celda `x=34–222`, `y=20–236`; medir el bbox real de alpha y reportarlo, no forzarlo si una desviación menor no tiene impacto material.

## 16. Baseline/centro

Centro visible `x=128 ±6 px`; baseline `y=232 ±4 px`; anchor futuro por alpha bbox.

## 17. Acting por frame

F1 reposo neutral y frame reduced; F2 ascenso mínimo; F3 punto alto con blink apenas iniciado; F4 descenso mínimo; F5 reposo bajo; F6 retorno compatible con F1.

## 18. Movimiento máximo

Desplazamiento vertical visible máximo 4–7 % de la altura visible; center drift horizontal ≤6 px; baseline drift ≤4 px; diferencia de escala entre frames ≤2 %.

## 19. Contenido obligatorio

Una sola Lía; cinco pétalos; cabeza opalescente; ojos media luna; collar ámbar; bulbo segmentado; cuerpo vegetal; seis frames coherentes; F1 estable.

## 20. Contenido prohibido

Pétalos extra/faltantes; boca/nariz/cejas; brazos/manos; piernas/pies; ropa, alas o accesorios; duplicación; flip; fondo; texto; separadores; rebote; squash/stretch; blur; cambio de color/iluminación.

## 21. Referencias exactas

Ver `final_021g_lia_reference_manifest.csv`; prioridades P0 primero. H07 permanece abierto y prohíbe reutilización binaria.

## 22. Prioridad

P0. Primer y único asset posterior habilitado por 021G.

## 23. Qué tomar

Identidad de C01 y rig R01–R13; reposo C02/W101/W301; coherencia multiframe L01/T02; encaje de I01–I11 y overlays O03/O04.

## 24. Qué no copiar

No copiar binarios, cámara, acting de riego, composición de otro mundo, fondo, UI ni assets del Mirador dentro del strip.

## 25. Prompt positivo en inglés

one single Lia, exactly five petals, canonical opalescent head, crescent eyes, amber collar, segmented plant body, no human anatomy, warm poetic pixel art, true transparent background, identical scale, identical lighting, common baseline, subtle motion, no text, no separators, no labels, no numbered frames, no background, no Mirador environment baked into sprites, six poses in one continuous horizontal sprite master, exact six-frame count, equal 256 by 256 final cells, restrained contemplative idle, frame one stable for reduced motion, maximum visible vertical travel four to seven percent, one subtle blink

## 26. Prompt negativo en inglés

extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, multiple characters, clone variation, changing anatomy, changing scale, changing colors, bounce, strong squash or stretch, gelatinous motion, asymmetrical frame crop, labels, numbers, grid lines, solid background, bloom veil, 3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, horizontal flip

## 27. Instrucciones de generación

Abrir una sola sesión/composición. Usar el modo horizontal nativo más ancho disponible y documentar sus dimensiones. Generar las seis poses juntas, sin separadores horneados. Detener si la herramienta no conserva anatomía/escala o si una celda exigiría >15 % de redimensión proporcional.

## 28. Redimensión máxima

Una sola redimensión proporcional total ≤15 %. Si requiere más, detener y devolver evidencia; no reconstruir frames.

## 29. Criterios

6 frames legibles; loop 3.5–5 s; identidad exacta; F1 apto para reduced motion; escala por frame ±2 %; center/baseline dentro de tolerancia; alpha limpio.

## 30. Hard fails

Cualquier cambio de identidad; frame count/canvas/grid incorrectos; fondo opaco; flip; drift visible; rebote; oclusión; bloom veil; reconstrucción fuerte; >15 % de redimensión; promoción runtime.

## 31. Photopea

Superponer O05, recortar strip exacto, alinear sin redibujar anatomía, comprobar seis celdas 256×256, alpha, bboxes, centro, baseline y loop. No interpolar con IA tras aprobación.

## 32. Exportación

Exportar WebP RGBA `1536×256`; conservar un master fuente; no promover ni copiar a `current-used`.

## 33. Metadata/hash

Retornar dimensiones nativas de generación, dimensiones finales, modo, alpha, bytes, SHA-256, bbox alpha por frame/asset, escala por frame, center drift y baseline drift.

## 34. Plantilla de retorno

`ID | filename | native canvas | final canvas | format/mode/alpha | bytes | SHA-256 | bbox(es) | scale delta | center drift | baseline drift | QA claro/oscuro/portrait/landscape | human review status | NOT_PROMOTED`.

## 35. Dependencias

Autoridad D01; fuentes C/R/L/T/W; references I01–I16; guías O01–O05/O08/O09. Greeting y glow dependen de aprobación humana de este idle.

## 36. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_ONLY`.
