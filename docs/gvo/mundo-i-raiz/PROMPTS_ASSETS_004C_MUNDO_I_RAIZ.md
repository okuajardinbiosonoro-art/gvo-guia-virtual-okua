# GVO - Mundo I: Raiz
## Prompts controlados de assets 004C

## 0. Uso previsto

Este documento contiene prompts para una fase posterior de generacion visual asistida. Codex no debe ejecutar estos prompts en 004C.

Los prompts sirven para producir candidatos por familias de assets, no para crear una pantalla final fusionada. Toda salida debe pasar por revision visual del usuario y, si aplica, limpieza/separacion en Photopea antes de cualquier uso runtime.

Estado:

`PROMPTS_004C_DOCUMENTALES / NO_EJECUTADOS / SIN_ARTE_FINAL`

## 1. Reglas generales para todos los prompts

Aplicar estas reglas a cada prompt:

- No generar pantalla final fusionada.
- No incluir texto.
- No incluir labels.
- No incluir boton.
- No incluir UI final.
- No incluir notas musicales.
- No incluir sensores ni electronica.
- No incluir ESP32, MIDI, Wi-Fi, routers, cables ni diagramas tecnicos.
- No incluir humanos.
- No incluir varios personajes.
- No saturar de particulas.
- No hacer magia excesiva.
- Usar fondo transparente cuando el asset lo requiera.
- Crear assets separados en hoja clara cuando sea kit.
- Conservar composicion mobile-first cuando sea fondo.
- Mantener estilo organico, calido, contemplativo y con acentos pixelart.
- Lia solo se genera o ajusta usando referencia aprobada.
- Si no hay referencia aprobada de Lia disponible, no generar Lia.
- Textos finales, labels, dialogos y botones deben quedar para DOM/CSS.

## 2. Prompt negativo global

```txt
No text, no labels, no numbers, no UI mockup, no buttons, no musical notes,
no speakers, no electronics, no ESP32, no MIDI, no Wi-Fi symbols, no routers,
no humans, no fairy wings, no extra characters, no singing plant, no magical
overload, no dense particles, no technical diagrams, no charts, no cables,
no neon cyberpunk, no photorealistic electronics, no fused final screen.
```

Version operativa en espanol:

```txt
Sin texto, sin etiquetas, sin numeros, sin maqueta de UI, sin botones, sin notas
musicales, sin parlantes, sin electronica, sin ESP32, sin MIDI, sin simbolos
Wi-Fi, sin routers, sin humanos, sin alas de hada, sin personajes extra, sin
planta cantando, sin magia excesiva, sin particulas densas, sin diagramas
tecnicos, sin graficas, sin cables, sin neon cyberpunk, sin electronica
fotorealista, sin pantalla final fusionada.
```

## 3. Prompt base de estilo Mundo I

```txt
Create visual assets for GVO - OKUA, World I: Root, a mobile-first vertical 9:16
organic and contemplative scene about origin, relationship, perception and
mediation with a living young plant. Warm dark underground atmosphere, soft
golden light, subtle pixelart accents, editorial organic feeling, calm and
minimal. The scene must feel local, silent, poetic and accessible. Do not include
text, labels, buttons, UI, music notes, electronics, cables, humans, technical
diagrams or magical overload. Assets must be separable by layers and suitable
for DOM/CSS text and controls on top.
```

## 4. Prompt para fondo base

```txt
Generate a vertical 9:16 background base for GVO - OKUA World I: Root. Warm,
dark underground environment, golden-brown soil, calm organic depth, subtle
pixelart accents, contemplative mood. Leave visual space in the upper center for
a young plant, middle area for root layers and three conceptual nodes, lower
area for DOM text and a continue button. No text, no labels, no Lia, no buttons,
no UI, no active glowing roots, no music notes, no electronics, no cables, no
technical diagrams, no humans. The background should work as a base layer that
can receive transparent overlays.
```

Revision esperada:

- Fondo sin elementos funcionales fusionados.
- Espacio claro para planta, nodos y texto DOM.
- No debe parecer cueva saturada ni escenario de fantasia excesiva.

## 5. Prompt para kit de luz ambiental

```txt
Create a transparent overlay kit of soft warm ambient light for GVO - OKUA World
I: Root. Include separate subtle golden glows, a soft halo under the young plant,
low underground warm light, and very gentle vignette-like focus. Transparent
background, low intensity, usable with CSS opacity animation. No text, no
labels, no particles overload, no lens flare, no magic explosion, no UI.
```

Entregables esperados:

- Halo bajo planta.
- Glow subterraneo suave.
- Overlay de foco/vineta.
- Opcional: pequenas particulas muy separadas.

## 6. Prompt para planta joven separada

```txt
Create a separate transparent asset of a young living plant for GVO - OKUA World
I: Root. The plant is fragile but healthy, small, organic, calm, not adult, not
singing, not magical. It should sit visually above underground roots, with clean
transparent edges and a style compatible with warm dark soil and subtle pixelart
accents. No pot if not necessary, no text, no labels, no musical notes, no face,
no electronics.
```

Variantes:

- Base.
- Leve enfasis con luz.
- Estado completado muy sutil, sin crecimiento fuerte.

## 7. Prompt para sistema de raices base

```txt
Create a transparent base layer of organic roots for GVO - OKUA World I: Root.
The roots are natural, calm, warm brown and golden, not electrical cables, not
circuits, not veins, not technical diagrams. They should fit under a young plant
in a vertical mobile 9:16 composition and leave space for three conceptual nodes
in the middle-lower area. No text, no labels, no UI, no bright active glow. The
layer must be separable and usable above a background.
```

Control visual:

- Raiz base apagada.
- Forma organica.
- Tres zonas posibles sin separarlas demasiado.

## 8. Prompt para raices activas por concepto

```txt
Create a transparent kit of three separate active root paths for GVO - OKUA
World I: Root. Path 1 represents RELATION, path 2 represents PERCEPTION, path 3
represents MEDIATION. Do not write these words in the image. Each path is an
organic root segment with subtle warm golden activation, low intensity, suitable
for layering over the base roots. No cables, no circuits, no neon, no magic
overload, no text, no labels, no UI. Keep the paths visually distinct but part
of the same root system.
```

Salida ideal:

- Tres capas transparentes separadas.
- Version apagada opcional.
- Version activa de bajo brillo.
- Version completada estable.

## 9. Prompt para glows por concepto

```txt
Create transparent glow overlays for three conceptual root paths in GVO - OKUA
World I: Root. Warm amber-gold, soft pixelart-compatible glow, low opacity,
designed to be animated by CSS opacity. Produce separate overlays for relation,
perception and mediation paths, without any text or labels. No neon cyberpunk,
no bright white glow, no magic explosion, no particles overload.
```

Uso previsto:

- Activacion de nodos.
- Confirmacion de completado.
- Reduced motion con estado fijo.

## 10. Prompt para nodos conceptuales

```txt
Create a transparent asset kit of three small conceptual node ornaments for GVO
- OKUA World I: Root. The nodes are tactile, warm, organic, pixelart accented,
and can work as visual anchors for DOM labels and buttons. Do not include any
text, labels, numbers, icons of sensors, music, Wi-Fi, electronics or locks that
dominate the scene. Include visual states: locked, available, active, completed.
Transparent background, consistent style, mobile-first readability.
```

Estados requeridos:

- Locked.
- Available.
- Active.
- Completed.

Nota:

Los labels `RELACION`, `PERCEPCION` y `MEDIACION` se renderizan despues como DOM/CSS.

## 11. Prompt para camino luminoso de salida

```txt
Create a transparent subtle luminous exit path for GVO - OKUA World I: Root.
The path suggests a calm continuation toward the next world, slightly toward the
right side, warm golden and organic, not a dominant portal, not a road, not a
technical cable, not a magic beam. Include a base inactive version and a softly
active version. No text, no labels, no UI, no button, no heavy glow.
```

Control:

- Debe poder aparecer al completar los tres conceptos.
- No debe competir con la planta ni nodos.
- Debe funcionar con opacidad CSS.

## 12. Prompt para microposes de Lia

Condicion obligatoria:

Si no hay referencia aprobada de Lia disponible, no generar Lia.

Prompt base:

```txt
Using the approved Lia reference for GVO - OKUA, create separate transparent
microposes for World I: Root. Keep Lia's identity exactly consistent: same
character, same visual language, same calm guide presence. Do not redesign Lia,
do not make Lia human, do not add fairy wings, do not add extra characters. The
poses are subtle and small: idle near a young plant, inviting observation,
pointing gently to a root/node, looking at the plant, guiding mediation, ready
to continue, and exit companion pose. Transparent background, no text, no UI, no
magic overload.
```

Microposes requeridas:

```txt
lia_root_idle
lia_root_invite_relation
lia_root_point_relation
lia_root_look_perception
lia_root_guide_mediation
lia_root_ready_continue
lia_root_exit
```

Criterios:

- Lia debe verse como guia, no protagonista.
- Gestos pequenos.
- No rasgos humanos nuevos.
- No cambio de identidad.
- Transparencia limpia.
- Consistencia de escala entre poses.

## 13. Prompt para hoja de revision/contact sheet

```txt
Create a clean contact sheet for reviewing GVO - OKUA World I: Root asset
candidates by family. Arrange each asset on a neutral dark background with no
embedded labels inside the artwork itself. The sheet may use external captions
outside each asset preview only for review, not as runtime artwork. Show
background candidate, light overlays, young plant, base roots, active root paths,
node states, exit path states and Lia microposes if approved reference is
available. Keep all assets visually consistent, warm, organic and mobile-first.
```

Reglas:

- Las captions de revision no son runtime.
- Contact sheet no se debe usar como asset final.
- Debe ayudar a elegir familias completas.

## 14. Prompt para preparacion en Photopea

```txt
Prepare these GVO - OKUA World I: Root visual candidates for layer separation in
Photopea. Isolate background, ambient light, young plant, roots base, active root
paths, glows, nodes, Lia microposes and exit path into separate transparent
layers. Remove accidental text, labels, UI, buttons and artifacts. Preserve soft
organic edges without adding blur-heavy modern effects. Keep file names clear and
consistent for future runtime export.
```

Checklist de limpieza:

- Transparencia real donde aplica.
- Bordes sin halos sucios.
- Sin textos accidentales.
- Sin nodos fusionados al fondo.
- Sin Lia fusionada con fondo.
- Sin camino de salida fusionado con raices.

## 15. Criterios de rechazo de resultados generados

Rechazar inmediatamente si aparece:

- Texto incrustado en imagen.
- Labels o numeros dentro de nodos.
- Boton o UI final quemada.
- Lia redisenada.
- Lia como hada.
- Humanos o personajes extra.
- Planta cantando o con rostro.
- Notas musicales.
- Sensores, ESP32, MIDI, Wi-Fi, routers o cables.
- Raices como cables electricos.
- Fondo saturado o neon.
- Particulas densas.
- Magia excesiva.
- Falta de capas separables.
- Falta de transparencia donde aplica.
- Composicion no mobile-first.
- Bajo contraste para futuros textos DOM.
- Asset demasiado pesado sin razon.
- Estilo inconsistente entre estados.

Decision operativa:

- Codex no produce arte final.
- Codex no evalua sensibilidad visual final como usuario.
- La aprobacion visual final la hace el usuario.
- ChatGPT Images u otra herramienta visual puede generar candidatos.
- Photopea u otra herramienta grafica puede separar y limpiar assets.
- Codex puede organizar nombres, rutas, contratos, manifiestos futuros y runtime solo cuando exista ticket funcional aprobado.
