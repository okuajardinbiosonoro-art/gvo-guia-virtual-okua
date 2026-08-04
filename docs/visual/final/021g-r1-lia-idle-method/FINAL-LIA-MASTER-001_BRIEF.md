# FINAL-LIA-MASTER-001 — Brief de producción

> PREPRODUCTION — NOT RUNTIME. Fuente de producción; no es asset runtime.

## Contrato

- ID: `FINAL-LIA-MASTER-001`.
- Filename: `final_lia_idle_master_v01.png`.
- Canvas: `1024×1024`.
- Formato: PNG RGBA, transparencia real.
- Clasificación: `PRODUCTION_SOURCE / NOT_RUNTIME`.
- Función: autoridad visual y frame reduced-motion para todo el idle final.
- Consumidor inmediato: `FINAL-LIA-IDLE-SHEET-001`; ningún consumidor runtime.

## Referencias exactas

Prioridad obligatoria:

1. `docs/03_IDENTIDAD_LIA.md` — identidad textual.
2. `public/assets/gvo/current-used/cover-intro/lia/reference/lia_master_cover_reference_v1.png` — master Cover.
3. `public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_idle_v1.png` — reposo frontal.
4. `public/assets/gvo/current-used/world-3-root/lia/lia_world3_idle_v01.png` — pixel scale aprobado.
5. `public/assets/gvo/current-used/world-5-root/lia/lia_world5_attend_neutral_v01.webp` — acting contemplativo.
6. `final_021g_r1_lia_master_safearea_1024.png` — framing obligatorio.
7. Overlays portrait/landscape 021G — escala futura, no composición binaria.

No reutilizar ningún binario como asset de `/final`.

## Identidad invariable

Una sola entidad vegetal no humana: exactamente cinco pétalos, cabeza
opalescente, ojos neutrales en media luna, collar ámbar, bulbo segmentado
completo y silueta vegetal. Sin boca, nariz, cejas, brazos, manos, piernas,
pies, ropa, alas, accesorios, sexto pétalo, duplicación o flip.

## Framing 1024×1024

- Altura visible: `58–64 %` del canvas (`594–655 px`).
- Ancho visible: `46–54 %` (`471–553 px`).
- Margen superior mínimo: `16 %` (`164 px`).
- Margen inferior mínimo: `16 %` (`164 px`).
- Márgenes laterales mínimos: `20 %` (`205 px`).
- Centro óptico: dentro del `4 %` central (`x/y 471–553`).
- Ningún alpha visible toca borde.

## Contenido obligatorio

Lía completa, frontal, contemplativa, pixelart cálido coherente con el Mirador,
ojos abiertos neutrales, iluminación estable, alpha limpio y margen amplio.

## Hard fails

Crop de pétalo o bulbo; margen insuficiente; anatomía humana; conteo distinto de
cinco pétalos; cambio de collar/cuerpo; boca/nariz/cejas; fondo; texto; entorno
del Mirador horneado; blur; mixed pixel scale; overscale; flip; reconstrucción
manual; redimensión >10 %.

## Prompt positivo en inglés

```text
one single canonical Lia, exactly five petals, complete opalescent head, neutral crescent eyes, amber collar, complete segmented plant bulb, frontal contemplative pose, warm poetic pixel art coherent with the Mirador, true transparent background, full body visible, generous alpha margins, visible height fifty-eight to sixty-four percent of a square canvas, visible width forty-six to fifty-four percent, centered optical mass, identical calm lighting, no text, no environment
```

## Prompt negativo en inglés

```text
cropped top petal, cropped bulb, edge contact, extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, clothing, wings, accessories, multiple characters, horizontal flip, asymmetrical framing, oversized character, solid background, Mirador environment, particles, bloom veil, 3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, text, labels, grid lines
```

## Producción y Photopea

Generar una sola master cuadrada. Photopea sólo puede limpiar alpha, hacer un
centrado leve, aplicar una única redimensión proporcional `≤10 %` y exportar.
No redibujar anatomía, reemplazar pétalos ni reconstruir el bulbo.

## Criterios y plantilla de retorno

Antes de aprobar: revisar fondo claro/oscuro, dimensiones, modo, alpha bbox,
ocupación, márgenes, centro óptico, identidad y pixel scale. Retornar:

```text
ID | filename | native canvas | final canvas | mode/alpha | visible bbox | visible W/H percent | margins | optical center | proportional resize | bytes | SHA-256 | human review status | NOT_RUNTIME
```

## Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_AND_ONLY_NEXT_ASSET`.
