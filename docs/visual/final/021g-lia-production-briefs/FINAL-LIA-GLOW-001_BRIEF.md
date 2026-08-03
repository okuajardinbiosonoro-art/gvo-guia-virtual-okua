# FINAL-LIA-GLOW-001 — Brief de producción

> PREPRODUCTION — NOT RUNTIME. Documentación de producción; no es arte ni autorización de integración.

## 1. ID

`FINAL-LIA-GLOW-001`.

## 2. Filename

`final_lia_glow_shadow_v01.png`.

## 3. Función narrativa

Asentar a Lía en el Mirador con presencia opalescente tenue y contacto espacial.

## 4. Función visual

Glow y sombra inferior estáticos que acompañan, nunca sustituyen, la silueta.

## 5. Consumidor

Futura capa decorativa vinculada al actor Lía en `/final`; no implementada en 021G.

## 6. Estado/capa

Capa bajo personaje; z `72`; estática y animable sólo por opacity/transform en código.

## 7. Canvas

`1024×512 px`.

## 8. Grid/celdas

Un frame; sin sprite grid.

## 9. Ratio/framing de generación

Composición horizontal 2:1 o modo nativo equivalente cercano realmente soportado; registrar dimensiones reales y recortar a 1024×512 sin reconstruir.

## 10. Formato

PNG RGBA canónico.

## 11. Alpha

Sí; gradientes alpha limpios y sin matte.

## 12. z

`72`.

## 13. Identidad invariable

Exactamente cinco pétalos; cabeza opalescente; ojos en media luna; collar ámbar; bulbo/cuerpo segmentado; silueta vegetal; sin anatomía ni rasgos humanos; una sola Lía; sin flip.

## 14. Safe area por frame

Zona de trabajo recomendada `x=180–844`, `y=280–470`; conservar margen transparente amplio.

## 15. Alpha bbox objetivo

Masa alpha-aware inferior aproximada `x=180–844`, `y=280–470`; centro compatible con Lía, sujeto a medición real.

## 16. Baseline/centro

Centro conceptual `(512, 380)`; sombra alineada con el contacto inferior del alpha bbox del idle aprobado.

## 17. Acting por frame

No aplica por frames. Un solo estado estático; el runtime futuro podrá variar opacity/transform.

## 18. Movimiento máximo

Ninguno horneado. El PNG no contiene partículas ni secuencia.

## 19. Contenido obligatorio

Glow opalescente muy tenue, sombra de contacto o halo inferior y masa alpha-aware sin silueta de Lía.

## 20. Contenido prohibido

Pétalos extra/faltantes; boca/nariz/cejas; brazos/manos; piernas/pies; ropa, alas o accesorios; duplicación; flip; fondo; texto; separadores; rebote; squash/stretch; blur; cambio de color/iluminación.

## 21. Referencias exactas

Ver `final_021g_lia_reference_manifest.csv`; prioridades P0 primero. H07 permanece abierto y prohíbe reutilización binaria.

## 22. Prioridad

P2, bloqueada hasta aprobación humana del idle.

## 23. Qué tomar

R08/R13 para material y sombra; idle aprobado para centro/contacto; I01–I06 para prueba sobre paisajes; O07 para encuadre.

## 24. Qué no copiar

No copiar silueta, collar, personaje, particles, motas, fondo, paisaje o bloom veil.

## 25. Prompt positivo en inglés

a single subtle opalescent contact glow and soft lower shadow for canonical Lia, true transparent background, alpha-aware mass, restrained warm poetic pixel-art material, no character silhouette, no text, no particles, no environment

## 26. Prompt negativo en inglés

extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, multiple characters, clone variation, changing anatomy, changing scale, changing colors, bounce, strong squash or stretch, gelatinous motion, asymmetrical frame crop, labels, numbers, grid lines, solid background, bloom veil, 3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, horizontal flip

## 27. Instrucciones de generación

No iniciar antes del gate humano de idle. Producir una única composición 2:1 cercana, registrar dimensiones nativas reales y detener si exige reconstrucción o >15 % de redimensión.

## 28. Redimensión máxima

Una sola redimensión proporcional total ≤15 %.

## 29. Criterios

PNG 1024×512; alpha real; visible sobre fondos claros/oscuros y environments; no lava paisaje; no sustituye silueta.

## 30. Hard fails

Cualquier cambio de identidad; frame count/canvas/grid incorrectos; fondo opaco; flip; drift visible; rebote; oclusión; bloom veil; reconstrucción fuerte; >15 % de redimensión; promoción runtime.

## 31. Photopea

Superponer O07, centrar por contacto del idle, limpiar alpha sin redibujar, probar sobre fondos claro/oscuro y environment, medir bbox.

## 32. Exportación

Exportar PNG RGBA `1024×512`; reportar bbox, bytes y SHA-256; no promover.

## 33. Metadata/hash

Retornar dimensiones nativas de generación, dimensiones finales, modo, alpha, bytes, SHA-256, bbox alpha por frame/asset, escala por frame, center drift y baseline drift.

## 34. Plantilla de retorno

`ID | filename | native canvas | final canvas | format/mode/alpha | bytes | SHA-256 | bbox(es) | scale delta | center drift | baseline drift | QA claro/oscuro/portrait/landscape | human review status | NOT_PROMOTED`.

## 35. Dependencias

Idle producido y aprobado; centro/bbox medidos del idle; validación humana del material sobre environments.

## 36. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION / BLOCKED_BY_IDLE_HUMAN_APPROVAL`.
