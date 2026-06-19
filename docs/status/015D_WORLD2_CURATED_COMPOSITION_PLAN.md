# 015D - Plan de recomposicion curada Estacion II / Mundo II

## Estado

`PLAN_ONLY / NO_RUNTIME_CHANGES / NO_ASSET_GENERATION / SIN_PUSH / PR_NO_APLICA`

## Objetivo

Definir un plan tecnico-visual verificable para rehacer la composicion runtime de Estacion II - Mundo II: Lia y el pulso invisible, sin implementar cambios todavia.

Este documento corrige el problema metodologico detectado en 015A, 015B y 015C: la pantalla no debe volver a construirse por acumulacion de assets. Cada pieza visual debe tener una funcion pedagogica clara dentro de la secuencia:

```text
planta_viva -> senal -> captura -> acondicionamiento -> mapeo -> resultado_mediado -> ready_to_continue
```

## Estado Git inicial

```text
## main...origin/main [ahead 4]
b4035e1 fix: reset World II visual composition hierarchy
1c695dc fix: rebuild World II immersive station layout
f6fc078 feat: integrate World II station runtime base
94b86a9 assets: add current-used runtime asset registry
ed62302 docs: inventory existing assets for World II references 014BREF
0247c18 fix: correct loading preload and asset methodology 014A1
008c67a fix: polish loading and specify World II assets 014A
c1d5d62 fix: align loading visuals and define asset pipeline 013C
```

## Documentos y runtime revisados

- `docs/status/015A_WORLD2_RUNTIME_BASE.md`
- `docs/status/015B_WORLD2_IMMERSIVE_REBUILD.md`
- `docs/status/015C_WORLD2_VISUAL_COMPOSITION_RESET.md`
- `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`
- `public/assets/gvo/current-used/README.md`
- `docs/narrative/estaciones/04_estacion_ii_pulso_invisible.md`
- `docs/narrative/estaciones/04_estacion_ii_pulso_invisible_slots.md`
- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.css`
- `src/screens/World2Root/world2RuntimeAssets.ts`
- `src/shared/assets/screenAssetBundles.ts`
- `public/assets/gvo/stations/world-2/pulse-invisible/runtime/**`
- `public/assets/gvo/current-used/world-2-root/**`

## Hallazgo sobre especificacion de Estacion II

La especificacion detallada si existe versionada:

- `docs/narrative/estaciones/04_estacion_ii_pulso_invisible.md`
- `docs/narrative/estaciones/04_estacion_ii_pulso_invisible_slots.md`
- `docs/narrative/source_txt/04_estacion_ii_pulso_invisible_especificacion_v1.txt`

La idea central protegida es: la senal existe, pero no es musica todavia; debe pasar por captura, acondicionamiento, mapeo e interpretacion antes de convertirse en resultado mediado.

## 1. Inventario de assets

### Assets nuevos aprobados en Descargas

Estos assets se inventariaron desde `C:\Users\JOSE DAVID\Downloads\`. No se copiaron al repo en este ticket.

| Nombre | Origen esperado | Existe en Descargas | Existe en runtime | Dimensiones | Clasificacion | Uso propuesto | Copiar en ticket posterior | Entrar en current-used posterior | Riesgo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `world2_composition_blueprint_mobile_v01.png` | Downloads | si | no | 1080x2340 | blueprint | Guia de composicion; no runtime | no | no | Usarlo como imagen runtime romperia la regla del ticket |
| `world2_dialogue_card_mobile_safe_v01.png` | Downloads | si | no | 1400x700 | runtime nuevo | Nuevo panel de dialogo con area segura | si, 015E | si, 015E | Debe alojar texto DOM sin incrustarlo en imagen |
| `world2_plant_stage_anchor_v01.png` | Downloads | si | no | 1400x700 | runtime nuevo | Base/ancla de planta para integrarla al suelo visual | si, 015E | si, 015E | Si queda muy visible puede competir con la planta |
| `world2_signal_origin_contact_v01.png` | Downloads | si | no | 1024x1024 | runtime nuevo | Punto donde nace la senal desde la planta | si, 015E | si, 015E | Debe nacer de la planta; si flota parece pegado |
| `world2_layer_visual_capture_v01.png` | Downloads | si | no | 1400x900 | runtime nuevo | Visual semantico de captura | si, 015F | si, 015F | Reemplaza microescena anterior, no debe sumarse encima |
| `world2_layer_visual_conditioning_v01.png` | Downloads | si | no | 1400x900 | runtime nuevo | Visual semantico de acondicionamiento | si, 015F | si, 015F | Mantener bajo contraste para evitar exceso morado |
| `world2_layer_visual_mapping_v01.png` | Downloads | si | no | 1400x900 | runtime nuevo | Visual semantico de mapeo | si, 015F | si, 015F | Evitar que parezca constelacion decorativa |
| `world2_layer_visual_mediated_result_v01.png` | Downloads | si | no | 1400x900 | runtime nuevo | Visual semantico de resultado mediado | si, 015F | si, 015F | No sugerir que la planta canta literalmente |
| `world2_layer_nav_token_base_v01.png` | Downloads | si | no | 512x720 | runtime nuevo | Token base modular de navegacion | si, 015E | si, 015E | Debe ser legible a 390px |
| `world2_layer_nav_token_active_v01.png` | Downloads | si | no | 512x720 | runtime nuevo | Token activo modular | si, 015E | si, 015E | No usar como glow gigante |
| `world2_layer_nav_connector_inactive_v01.png` | Downloads | si | no | 400x160 | runtime nuevo | Conector modular inactivo entre tokens | si, 015E | si, 015E | Evitar reducir altura de tokens |
| `world2_lia_gesture_signal_spark_v01.png` | Downloads | si | no | 1024x1024 | runtime nuevo | Spark discreto conectado al gesto de Lia | si, 015E/015F | si, 015E/015F | Usar solo en capas con gesto; no convertirlo en particulas constantes |

### Assets existentes que siguen permitidos

| Nombre | Ubicacion actual | Clasificacion | Uso propuesto | Nota |
| --- | --- | --- | --- | --- |
| `world2_background_base_mobile_v01.webp` | runtime + current-used | runtime existente | Fondo base comun | Critico |
| `world2_main_living_plant_v01.png` | runtime + current-used | runtime existente | Planta principal | Critico |
| `world2_raw_bioelectric_waveform_v01.png` | runtime + current-used | runtime existente | Senal cruda desde capa 2 | Diferido |
| `world2_layer_icon_glyphs_atlas_v01.png` | runtime + current-used | runtime existente | Glyphs de navegacion | Critico |
| `world2_layer_status_lock_glyph_v01.png` | runtime + current-used | runtime existente | Estado bloqueado | Diferido o CSS fallback |
| `world2_layer_status_complete_glyph_v01.png` | runtime + current-used | runtime existente | Estado completado | Diferido o CSS fallback |
| `world2_layer_nav_connector_active_v01.png` | runtime + current-used | runtime existente | Conector activo | Diferido |
| `world2_cta_organic_pulse_button_v01.png` | runtime + current-used | runtime existente | Boton final controlado | Solo ready |
| `lia_pose_idle_v1.png` | shared Lia current-used | runtime existente | Lia capa 1 | Mantener identidad 2.5D |
| `lia_pose_greeting_v1.png` | shared Lia current-used | runtime existente | Lia cierre/resultado | Mantener identidad 2.5D |
| `lia_pose_explain_calm_v1.png` | shared Lia current-used | runtime existente | Lia explicando captura/acondicionamiento | Mantener identidad 2.5D |
| `lia_pose_point_portal_1_v1.png` | shared Lia current-used | runtime existente | Lia senal/mapeo | Mantener identidad 2.5D |

### Assets congelados o evitados

No deben ser nucleo visual de 015E/015F:

- `world2_bioelectric_particle_field_v01.png`
- `world2_lia_dialogue_focus_glow_v01.png`
- `world2_lia_signal_attention_wisps_v01.png`
- `world2_lia_transition_sparkle_trail_v01.png`
- `world2_ready_continue_signal_path_v01.png`
- `world2_micro_scene_capture_reticle_v01.png`
- `world2_signal_conditioning_field_v01.png`
- `world2_signal_mapping_constellation_v01.png`
- `world2_mediated_result_bloom_v01.png`
- `world2_layer_nav_frame_v01.png`
- `world2_layer_nav_active_slot_glow_v01.png`

No usar nunca como runtime principal de Estacion II:

- `world2_lia_idle_pose_world2_v01.png`
- `world2_lia_explain_pose_world2_v01.png`
- `world2_lia_invite_pose_world2_v01.png`

Motivo: duplican o alteran la identidad existente de Lia 2.5D.

## 2. Diagnostico de la composicion actual 015C

015C redujo saturacion y elimino parte de la acumulacion, pero sus propias metricas siguen reportando 13 a 15 imagenes por estado en varias capas. Eso mantiene el riesgo de lectura como collage y no como sistema pedagogico.

| Aspecto | Estado 015C | Decision 015D |
| --- | --- | --- |
| Jerarquia visual | Mejor que 015B, pero todavia con fondo, ruta, planta, senal, microescena, Lia, dialogo y navegacion compitiendo | Definir zonas fijas y limitar activos principales por estado |
| Escala de planta | Planta visible, izquierda/centro-izquierda | Mantener planta grande, pero anclarla con `plant_stage_anchor` para que no flote |
| Escala de Lia | Lia visible y protagonista a la derecha | Mantener 29-32% de ancho, no reducirla; dar gesto activo por capa |
| Lectura de senal | Waveform aparece desde senal, pero convive con rutas y visuales anteriores | Hacer que la senal nazca visualmente del punto de contacto en planta |
| Integracion de dialogo | Panel funciona tecnicamente, pero se siente injertado | Reemplazar por `world2_dialogue_card_mobile_safe_v01.png` con texto DOM en area segura |
| Navegacion inferior | Funcional, pero el usuario reporto que se ve pequena/comprimida | Reemplazar barra completa por tokens modulares mas altos y legibles |
| Exceso de morado | Disminuyo, pero varias capas siguen usando energia/glow morado similar | Usar morado como ambiente, no como significado unico |
| Cantidad de assets por estado | 9 en capa 1, 13-15 en capas medias/ready | Meta: 6-8 imagenes principales por estado |
| Concepto por capa | Varias capas se leen como variaciones abstractas de energia | Cada capa tendra un asset semantico principal nuevo |
| Assets pegados | Riesgo bajo segun 015C, pero microescenas siguen siendo artificiales | Sustituir microescenas por visuales semanticos integrados |

## 3. Nueva arquitectura visual

### Zonas mobile-first

| Zona | Altura objetivo | Funcion |
| --- | --- | --- |
| TOP / HEADER | 10-12% | Identificar Estacion II y titulo sin ocupar el mundo |
| HERO | 43-50% | Planta, Lia, senal y visual semantico activo |
| DIALOGUE | 18-22% | Panel integrado con texto DOM breve y accion |
| NAVIGATION | 16-20% | Tokens legibles de seis capas |
| SAFE MARGINS | 4-6% laterales | Evitar cortes en 390x844 y 430x932 |

### Formula responsive

Mantener un stage vertical con `aspect-ratio: 1080 / 2340` y coordenadas porcentuales. La composicion debe usar la misma formula en 390x844 y 430x932, con ajustes menores mediante `clamp()` solo para tipografia y tamano de tokens.

### Coordenadas base para 390x844

| Elemento | x% | y% | w% | h% | z-index | Opacidad inicial | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Titulo | 10 | 3.5 | 80 | 9 | 20 | 1 | Mantener compacto |
| Planta | 7 | 20 | 50 | 31 | 3 | 1 | Protagonista viva, no adorno |
| Base de planta | 2 | 39 | 58 | 18 | 2 | 0.78 | `world2_plant_stage_anchor_v01.png` |
| Punto origen senal | 38 | 36 | 13 | 13 | 5 | 0 desde capa 2 | Debe tocar o rozar la planta |
| Waveform | 34 | 44 | 38 | 10 | 4 | 0 desde capa 2 | No dominante en capa 1 |
| Lia | 61 | 32 | 31 | 27 | 6 | 1 | 2.5D existente |
| Spark gesto Lia | 55 | 39 | 18 | 18 | 7 | 0 desde capas con gesto | Solo senal/captura/mapeo |
| Visual semantico capa | 30 | 38 | 48 | 24 | 4 | 0.82 activo | Reemplaza microescenas |
| Panel dialogo | 6 | 61 | 88 | 20 | 8 | 1 | Nueva card segura |
| Navegacion inferior | 4 | 82 | 92 | 16 | 9 | 1 | Tokens 48-54px alto minimo |

### Coordenadas base para 430x932

| Elemento | x% | y% | w% | h% | z-index | Opacidad inicial | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Titulo | 10 | 3.4 | 80 | 9 | 20 | 1 | Igual que 390 |
| Planta | 8 | 20 | 49 | 31 | 3 | 1 | Levemente menos ancha por aire lateral |
| Base de planta | 3 | 39 | 57 | 18 | 2 | 0.78 | Ancla visual |
| Punto origen senal | 39 | 36 | 12 | 12 | 5 | 0 desde capa 2 | Mantener contacto |
| Waveform | 35 | 44 | 37 | 10 | 4 | 0 desde capa 2 | No debe invadir dialogo |
| Lia | 62 | 32 | 30 | 27 | 6 | 1 | Evitar corte derecho |
| Spark gesto Lia | 56 | 39 | 17 | 17 | 7 | 0 desde capas con gesto | Discreto |
| Visual semantico capa | 31 | 38 | 47 | 24 | 4 | 0.82 activo | Modular |
| Panel dialogo | 6 | 61 | 88 | 20 | 8 | 1 | Area texto segura |
| Navegacion inferior | 4 | 82 | 92 | 16 | 9 | 1 | Tokens 54-60px alto objetivo |

## 4. Asset stack global

Regla: no montar mas de 6-8 imagenes visuales principales por estado. Los iconos recortados desde atlas pueden contar como CSS/background cuando sea tecnicamente posible.

### Stack comun maximo

| Orden | Asset / familia | Z-index | Criticidad | Funcion |
| --- | --- | --- | --- | --- |
| 1 | `world2_background_base_mobile_v01.webp` | 0 | Critico | Mundo visual |
| 2 | `world2_main_living_plant_v01.png` | 3 | Critico | Origen vivo |
| 3 | `world2_plant_stage_anchor_v01.png` | 2 | Critico nuevo | Integrar planta con escenario |
| 4 | Lia 2.5D existente | 6 | Critico | Guia activa |
| 5 | `world2_dialogue_card_mobile_safe_v01.png` | 8 | Critico nuevo | Panel integrado |
| 6 | Navegacion modular tokens | 9 | Critico nuevo | Estado/progreso |
| 7 | Elemento semantico de capa | 4-5 | Diferido por capa | Concepto activo |
| 8 | Spark de Lia o waveform | 7 / 4 | Diferido por capa | Gesto o senal |

Eliminar del stack comun: haze pesada, silhouette, route fields, microescenas, halos y glows no semanticos. Pueden volver solo si una captura demuestra que resuelven integracion sin saturar.

## 5. Plan por capa

| Capa | Objetivo pedagogico | Texto visible de Lia | Pose de Lia | Asset semantico principal | Asset de soporte | Assets ocultos | Posicion Lia | Posicion modulo visual | Posicion panel | Navegacion activa | Microanimacion minima | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `planta_viva` | Primero hay vida y relacion | Esta es la planta viva. Antes de cualquier sonido, hay vida y relacion. | `lia_pose_idle_v1.png` | `world2_main_living_plant_v01.png` | `world2_plant_stage_anchor_v01.png` | waveform, origin contact, spark, visuales de capas | derecha 61%, y 32%, w 31% | planta izquierda, ancla debajo | x 6%, y 61%, w 88% | token 1 activo | planta sube 2px y ancla aparece por opacidad | estado fijo sin translate |
| `senal` | Esto es senal; no es musica todavia | Esto es senal. No es musica todavia. | `lia_pose_point_portal_1_v1.png` | `world2_signal_origin_contact_v01.png` | `world2_raw_bioelectric_waveform_v01.png`, `world2_lia_gesture_signal_spark_v01.png` | visuales captura/acondicionamiento/mapeo/resultado | derecha 61%, y 32%, w 31% | origen en x 38%, y 36%; waveform x 34%, y 44% | x 6%, y 61%, w 88% | token 2 activo | origin fade-in + waveform reveal 240ms | origin y waveform visibles sin movimiento |
| `captura` | La senal debe capturarse para poder leerse | El sistema capta la senal para que pueda ser leida. | `lia_pose_explain_calm_v1.png` | `world2_layer_visual_capture_v01.png` | spark discreto opcional | micro_scene_capture_reticle, old route, old capture contact | derecha 61%, y 32%, w 31% | x 30%, y 38%, w 48% | x 6%, y 61%, w 88% | token 3 activo | modulo entra con opacity + translateY -2px | modulo aparece fijo |
| `acondicionamiento` | La senal se prepara, se limpia y se estabiliza | La senal se prepara antes de interpretarse. | `lia_pose_explain_calm_v1.png` | `world2_layer_visual_conditioning_v01.png` | waveform suave al 35% | old conditioning field, particle/glow | derecha 61%, y 32%, w 31% | x 30%, y 38%, w 48% | x 6%, y 61%, w 88% | token 4 activo | opacidad 0.68 -> 0.82 | visual fijo |
| `mapeo` | La senal preparada se organiza en relaciones/eventos | Aqui la senal se interpreta y se mapea. | `lia_pose_point_portal_1_v1.png` | `world2_layer_visual_mapping_v01.png` | `world2_lia_gesture_signal_spark_v01.png` | old mapping constellation, old micro holographic base | derecha 61%, y 32%, w 31% | x 31%, y 38%, w 47% | x 6%, y 61%, w 88% | token 5 activo | spark escala 0.98 -> 1.02 una vez | spark fijo o oculto |
| `resultado_mediado` | El resultado es mediado; no sale directo de la planta | El sonido final es mediado. No sale directamente de la planta. | `lia_pose_greeting_v1.png` | `world2_layer_visual_mediated_result_v01.png` | waveform suave opcional | old mediated bloom, ready path | derecha 61%, y 32%, w 31% | x 31%, y 38%, w 47% | x 6%, y 61%, w 88% | token 6 activo | modulo estabiliza con scale 0.99 -> 1 | visual fijo |
| `ready_to_continue` | Cierre y continuidad sin saturacion | El pulso invisible ya esta mediado. Podemos continuar con el recorrido. | `lia_pose_greeting_v1.png` | `world2_cta_organic_pulse_button_v01.png` | tokens completados | ready path gigante, glows, route fields | derecha 61%, y 32%, w 31% | sin modulo extra; foco en CTA | x 6%, y 61%, w 88% | seis tokens completados | CTA ilumina una vez, no pulso infinito | CTA fijo |

## 6. Navegacion modular

Reemplazar la barra/frame completa por seis tokens individuales.

Assets:

- `world2_layer_nav_token_base_v01.png`
- `world2_layer_nav_token_active_v01.png`
- `world2_layer_nav_connector_inactive_v01.png`
- `world2_layer_nav_connector_active_v01.png`
- `world2_layer_icon_glyphs_atlas_v01.png`
- `world2_layer_status_lock_glyph_v01.png`
- `world2_layer_status_complete_glyph_v01.png`

### Layout

- Contenedor: `display: grid`, 6 columnas, area `x 4%`, `y 82%`, `w 92%`, `h 16%`.
- Token en 390x844: ancho visual 48-52px, alto visual 68-76px, hit target minimo 44x44.
- Token en 430x932: ancho visual 54-60px, alto visual 76-84px, hit target minimo 44x44.
- Conectores: posicion absoluta entre tokens, no deben reducir el ancho disponible de cada token.
- Glyph atlas: usar `background-position` por indice, no crear seis imagenes duplicadas.
- Numero: 0.68-0.78rem, alto contraste.
- Label: 0.54-0.62rem, maximo dos lineas; evitar `white-space: nowrap` para `Acond.` si produce compresion.

### Estados

| Estado | Visual | Regla |
| --- | --- | --- |
| Bloqueado | token base 48-55% opacidad + lock glyph pequeno | No parecer deshabilitado roto |
| Disponible | token base 80% opacidad + borde suave | Indica siguiente paso |
| Activo | token active + numero/glyph alto contraste | Debe ser el unico foco fuerte |
| Completado | token base + complete glyph | Mantener revisable |

## 7. Dialogo

Usar `world2_dialogue_card_mobile_safe_v01.png` como marco visual del panel y mantener todo texto en DOM/CSS.

### Coordenadas

- 390x844: x 6%, y 61%, w 88%, h 20%.
- 430x932: x 6%, y 61%, w 88%, h 20%.
- Area segura de texto: inset aproximado 9% horizontal, 13% superior, 14% inferior.

### Texto

- Tipografia: mantener `var(--gvo-font-heading)` y `var(--gvo-font-ui)`.
- Eyebrow: 0.62-0.72rem.
- Texto principal: 0.86-0.98rem, maximo 3 lineas.
- Ambiente: 0.68-0.78rem, maximo 2 lineas.
- Boton: `Siguiente` o `Continuar`, minimo 42px alto tactil.
- No mostrar `TEMP` en UI visible.
- No incrustar texto final en imagen.

### Integracion con Lia

El panel debe quedar visualmente conectado a Lia por proximidad y por el spark de gesto solo en capas donde Lia apunta o explica. No reactivar `world2_dialogue_lia_connector_tail_v01.png` por defecto; puede evaluarse en 015G si el panel queda desconectado.

## 8. Lia

Lia debe sentirse guia activa, no decoracion. Usar solo el set 2.5D existente:

- `lia_pose_idle_v1.png`
- `lia_pose_point_portal_1_v1.png`
- `lia_pose_explain_calm_v1.png`
- `lia_pose_greeting_v1.png`

| Capa | Pose | Posicion | Escala | Atencion | Spark | Microanimacion | Reduced motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `planta_viva` | idle | derecha media | 31% ancho | mira planta/usuario | no | breathing leve por translateY 1-2px | fija |
| `senal` | point | derecha media | 31% ancho | apunta origen de senal | si | spark fade-in unico | spark fijo |
| `captura` | explain calm | derecha media | 31% ancho | explica modulo | opcional | fade del modulo sincronizado | fija |
| `acondicionamiento` | explain calm | derecha media | 31% ancho | explica preparacion | no | cambio de opacidad | fija |
| `mapeo` | point | derecha media | 31% ancho | apunta relaciones | si | spark leve una vez | spark fijo |
| `resultado_mediado` | greeting | derecha media | 31% ancho | cierra mediacion | no | entrada suave | fija |
| `ready_to_continue` | greeting | derecha media | 31% ancho | invita a continuar | no | CTA una vez | fija |

No usar `lia_pose_activate_portal_1_v1.png` salvo decision explicita posterior. No usar poses W2 rechazadas.

## 9. Animacion minima

No implementar animaciones en 015D. Para tickets posteriores, mantenerlas CSS-only.

| Animacion | Elemento | Duracion | Propiedades | Reduced motion |
| --- | --- | --- | --- | --- |
| `layer-enter` | visual semantico activo | 220-280ms | opacity, translateY 2px | opacity instantanea |
| `signal-reveal` | origin contact + waveform | 260ms | opacity, scale 0.98 -> 1 | visible fijo |
| `lia-breathe` | Lia | 2800-3600ms | translateY 1-2px | none |
| `spark-once` | gesture spark | 240ms | opacity, scale 0.98 -> 1.02 | opacity fija o oculto |
| `token-active` | nav token activo | 180ms | opacity, filter leve | token fijo |
| `cta-ready` | boton continuar | 240ms una vez | opacity, scale 0.99 -> 1 | fijo |

Evitar movimientos largos, particulas constantes, pulsos fuertes infinitos, blur excesivo y ciclos que parezcan audio.

## 10. Performance y preload

### Criticos

- `world2_background_base_mobile_v01.webp`
- `world2_main_living_plant_v01.png`
- `world2_plant_stage_anchor_v01.png`
- `lia_pose_idle_v1.png`
- `world2_dialogue_card_mobile_safe_v01.png`
- `world2_layer_nav_token_base_v01.png`
- `world2_layer_icon_glyphs_atlas_v01.png`

### Diferidos por capa

- `world2_signal_origin_contact_v01.png`
- `world2_raw_bioelectric_waveform_v01.png`
- `world2_layer_visual_capture_v01.png`
- `world2_layer_visual_conditioning_v01.png`
- `world2_layer_visual_mapping_v01.png`
- `world2_layer_visual_mediated_result_v01.png`
- `world2_lia_gesture_signal_spark_v01.png`
- `world2_layer_nav_token_active_v01.png`
- `world2_layer_nav_connector_inactive_v01.png`
- `world2_layer_nav_connector_active_v01.png`
- `world2_layer_status_lock_glyph_v01.png`
- `world2_layer_status_complete_glyph_v01.png`

### Reglas

- No cargar todo como critico.
- Mantener `screenAssetBundles.world2RootInitial` con solo assets visibles de la primera escena.
- Registrar cualquier asset runtime nuevo tambien en `public/assets/gvo/current-used/world-2-root/` en el ticket que lo copie.
- No usar assets de Descargas directamente desde runtime.

## 11. Plan de implementacion por gates

### 015E - Integrar assets nuevos y composicion base capa 1-2

- Copiar assets nuevos necesarios para capa 1-2 al runtime.
- Registrar los mismos assets en `current-used/world-2-root/`.
- Reemplazar panel por `world2_dialogue_card_mobile_safe_v01.png`.
- Reemplazar navegacion por tokens modulares.
- Implementar `planta_viva` y `senal` con nueva jerarquia.
- Actualizar preload critico.
- Generar capturas 390x844 y 430x932.
- Detener para revision humana.

### 015F - Implementar capas 3-6

- Integrar `world2_layer_visual_capture_v01.png`.
- Integrar `world2_layer_visual_conditioning_v01.png`.
- Integrar `world2_layer_visual_mapping_v01.png`.
- Integrar `world2_layer_visual_mediated_result_v01.png`.
- Ajustar Lia y spark por capa.
- Generar capturas por capa y detener.

### 015G - Pulido visual y reduced-motion

- Ajustar opacidades, escalas y z-index.
- Validar reduced-motion.
- Validar flujo completo de primera pasada y revision libre.
- Confirmar sin overflow, sin imagenes rotas, sin remotos, sin audio/video/canvas.

### 015H - Fix build editorial o ticket separado

- Abordar deuda conocida de `src/content/editorial/resolveEditorialText.ts` solo si se prioriza main build-green.
- No mezclar con composicion visual si la pantalla aun no esta aprobada.

## 12. Criterios de aceptacion del plan

- No modifica runtime.
- No genera assets.
- No instala dependencias.
- Produce `docs/status/015D_WORLD2_CURATED_COMPOSITION_PLAN.md`.
- Inventaria assets nuevos y existentes.
- Define coordenadas y z-index.
- Define stack por capa.
- Define navegacion modular.
- Define dialogo integrado.
- Define Lia por capa.
- Reduce assets visibles por estado.
- Establece gates de implementacion.
- No propone Three.js como solucion inmediata.
- No usa Lia pixelart.
- No vuelve a usar poses W2 rechazadas.
- No vuelve a depender de assets decorativos como nucleo visual.

## Confirmaciones de alcance

- No se modifico `src/screens/World2Root/World2RootScreen.tsx`.
- No se modifico `src/screens/World2Root/World2RootScreen.css`.
- No se modifico `src/screens/World2Root/world2RuntimeAssets.ts`.
- No se modifico `src/shared/assets/screenAssetBundles.ts`.
- No se copiaron assets desde Descargas.
- No se modifico `public/assets/**`.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se instalaron dependencias.
- No se uso red.
- No se creo Pull Request.
- `PR_NO_APLICA`.
