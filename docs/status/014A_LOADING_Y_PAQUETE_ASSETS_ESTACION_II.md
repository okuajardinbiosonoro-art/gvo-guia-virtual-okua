# 014A - Loading pre-portada y paquete de assets Estacion II

## Correccion 014A-FIX1

El criterio operativo fue corregido antes del push: la barra de pre-portada no debe durar `2300ms`. Debe conservar la composicion visual alineada con `TransitionWorld`, pero su duracion minima visible debe ser `12000ms` y debe operar como pantalla real de precarga.

La correccion queda documentada en:

```text
docs/status/014A_FIX1_PREPORTADA_PRELOAD_ASSETS_ESTACION_II.md
```

Resumen de la correccion:

- `LoadingInitial` conserva el ancho visual compartido con `TransitionWorld`.
- `LoadingInitial` usa `--loading-progress-duration: var(--loading-duration)`, equivalente a `12000ms`.
- La precarga interna de `LoadingInitial` se difiere hasta despues del primer frame del shell.
- El flujo `/` conserva contrato real: navegar a portada solo cuando se cumplan duracion minima y `coverIntroCritical.ready`.
- No se produjeron assets.
- No se copiaron assets desde Descargas.
- No se modificaron assets existentes.

## 1. Proposito

Corregir la fluidez visual de la barra de carga de pre-portada (`LoadingInitial`) para que pertenezca a la misma familia operativa que las transiciones `TransitionWorld`, y preparar un paquete documental exhaustivo para producir assets de Estacion II / Mundo II - Pulso invisible en un ticket posterior.

Este ticket no produce assets, no copia archivos desde Descargas y no integra herramientas externas dentro de GVO.

## 2. Alcance

Ticket ejecutado: `014A - Corregir loading pre-portada y preparar paquete de assets Estacion II`.

Alcance aplicado:

- Diagnostico de la barra `LoadingInitial` luego de la unificacion 013C.
- Ajuste del tempo y ancho de la barra de pre-portada para alinearla con `TransitionWorld`.
- Documentacion del paquete futuro de assets para Estacion II.
- Definicion de familias, naming, ubicacion, criterios de aceptacion y prompts.
- Sin generar imagenes, videos, audio, 3D, JSON, manifests runtime ni carpetas de assets.
- Sin tocar `World2Root` ni otras pantallas de mundos.
- Sin modificar `public/assets/**`, `assets/**` ni `src/assets/**`.
- Sin dependencias nuevas.
- Sin PR. `PR_NO_APLICA`.

Fuera de alcance confirmado:

- Crear Mundo II final.
- Copiar assets desde `Descargas`.
- Crear assets nuevos dentro de GVO.
- Reemplazar textos `TEMP`.
- Activar QR/camara/permisos sensibles.
- Excel real, contador diario, baseline completo o herramientas externas.
- Three.js, Rive, Lottie, glTF/GLB, video o audio runtime.

## 3. Estado Git inicial

```text
## main...origin/main
```

Working tree inicial: limpio.

Ultimos commits iniciales:

```text
c1d5d62 fix: align loading visuals and define asset pipeline 013C
13bbaa2 fix: stabilize W1 exit and loading visual flow 013B
0e63943 tools: add offline editorial Excel validator 012F
0e305f2 docs: prepare editorial Excel import plan 012E
86d5708 docs: review full W1 Final flow 013A
```

## 4. Diagnostico de barra de pre-portada

Diagnostico tecnico:

- `LoadingInitial` ya usaba `GvoProgressBar` y `GvoProgressFrame` desde 013C.
- La barra ya consumia los mismos assets locales de progreso que `TransitionWorld`.
- El problema restante no era de asset, sino de implementacion visual:
  - ancho mas estrecho en pre-portada: `min(74%, 286px)`;
  - duracion atada al timeline narrativo completo de loading: `12000ms`;
  - la transicion usa un ritmo de progreso de `2300ms`.
- La consecuencia visual era que la barra de pre-portada se percibia mas lenta, pesada y menos cercana a la fluidez de las transiciones, aunque compartiera frame y assets.

## 5. Comparacion con TransitionWorld

| Aspecto | LoadingInitial antes de 014A | TransitionWorld | Decision 014A |
| --- | --- | --- | --- |
| Assets | `transition_root_progress_track_base`, `transition_root_progress_fill_segment`, `transition_root_progress_spark` | Misma familia | Mantener assets compartidos |
| Frame | `GvoProgressFrame` | `GvoProgressFrame` | Mantener frame compartido |
| Ancho | `min(74%, 286px)` | `clamp(282px, 80vw, 360px)` | Alinear pre-portada al ancho de TransitionWorld |
| Duracion visual barra | `12000ms` | `2300ms` | Separar duracion de barra del timeline narrativo |
| Timeline escena | `12000ms` | `2300ms` para transicion | Conservar escena loading de 12s |
| Riesgo | Barra correcta pero lenta y mas pequena | Fluida y compacta | Reducir diferencia perceptual sin tocar assets |

## 6. Fix aplicado o razon de bloqueo

Fix aplicado en `src/screens/LoadingInitial/LoadingInitialScreen.css`:

- 014A agrego `--loading-progress-duration: 2300ms`; 014A-FIX1 corrigio el criterio vigente a `--loading-progress-duration: var(--loading-duration)`, equivalente a `12000ms`.
- Se agrego `--loading-progress-width: clamp(282px, 80vw, 360px)`.
- `.loading-initial__progress` ahora usa:
  - `--gvo-progress-width: var(--loading-progress-width)`;
  - `--gvo-progress-duration: var(--loading-progress-duration)`.
- No se modifico el timeline narrativo de la escena (`--loading-duration: 12000ms`).
- No se modifico `TransitionWorld`.
- No se modificaron assets.

Razon: la barra de pre-portada necesitaba heredar el mismo comportamiento visual de barra que `TransitionWorld`, sin acelerar ni recortar la escena principal de loading.

## 7. Resultado mobile

Resultado validado:

- Viewport: `390x844`.
- `/`: barra `loading-initial`, familia `transition-root-assets`, ancho `312px`, duracion vigente corregida `12000ms`.
- `/transition/intro-to-station-1`: barra `transition-world`, ancho `312px`, duracion `2300ms`.
- `/transition/world-1-to-world-2`: barra `transition-world`, ancho `312px`, duracion `2300ms`.
- Movimiento no-reduced verificado en Chrome local:
  - `/`: fill `7.48px -> 84.95px`.
  - `/transition/intro-to-station-1`: fill `7.48px -> 60.16px`.
  - `/transition/world-1-to-world-2`: fill `10.27px -> 96.64px`.
- Sin overflow horizontal en `/`, `/portada`, `/transition/intro-to-station-1` ni `/transition/world-1-to-world-2`.
- Sin `pageerror`.
- Sin errores JS detectados.
- Sin assets remotos.
- Sin audio, video ni iframe.

## 8. Resultado desktop

Resultado validado:

- Viewport: `1365x768`.
- `/`: barra `loading-initial`, familia `transition-root-assets`, ancho `360px`, duracion vigente corregida `12000ms`.
- `/transition/intro-to-station-1`: barra `transition-world`, ancho `360px`, duracion `2300ms`.
- `/transition/world-1-to-world-2`: barra `transition-world`, ancho `360px`, duracion `2300ms`.
- Movimiento no-reduced verificado en Chrome local:
  - `/`: fill `8.63px -> 98.02px`.
  - `/transition/intro-to-station-1`: fill `8.73px -> 101.11px`.
  - `/transition/world-1-to-world-2`: fill `10.59px -> 109.16px`.
- Sin overflow horizontal en `/`, `/portada`, `/transition/intro-to-station-1` ni `/transition/world-1-to-world-2`.
- Sin `pageerror`.
- Sin errores JS detectados.
- Sin assets remotos.
- Sin audio, video ni iframe.

## 9. Inventario de familias de assets necesarias para Estacion II

Familias necesarias para Estacion II / Mundo II - Pulso invisible:

- Fondos y profundidad.
- Ambiente y atmosfera.
- Pulso, senal y trazas.
- Elemento interactivo principal.
- Capas de estado narrativo.
- Mediacion visual.
- Presencia de Lia.
- CTA / avance.
- Transicion de entrada/salida.
- UI auxiliar.
- Variantes responsive.
- Variantes de animacion liviana.

## 10. Lista exhaustiva de assets candidatos

### Fondos

- `world2_background_base`
- `world2_background_depth_layer_near`
- `world2_background_depth_layer_mid`
- `world2_background_depth_layer_far`
- `world2_background_mobile_safe`
- `world2_background_desktop_wide`

### Ambiente

- `world2_ambient_mist_layer`
- `world2_ambient_particles_soft`
- `world2_ambient_glow_field`
- `world2_ambient_shadow_vignette`
- `world2_ambient_lavender_haze`
- `world2_ambient_warm_amber_haze`

### Pulso y senal

- `world2_pulse_core_idle`
- `world2_pulse_core_active`
- `world2_pulse_ring_01`
- `world2_pulse_ring_02`
- `world2_pulse_ring_03`
- `world2_signal_thread_idle`
- `world2_signal_thread_active`
- `world2_signal_wave_soft`
- `world2_signal_wave_peak`
- `world2_signal_trace_dotted`
- `world2_signal_trace_continuous`

### Elemento interactivo

- `world2_interaction_node_idle`
- `world2_interaction_node_ready`
- `world2_interaction_node_active`
- `world2_interaction_node_complete`
- `world2_interaction_node_locked`
- `world2_interaction_node_repeat`

### Capas de estado

- `world2_state_intro_overlay`
- `world2_state_planta_layer`
- `world2_state_senal_layer`
- `world2_state_captura_layer`
- `world2_state_acondicionamiento_layer`
- `world2_state_mapeo_layer`
- `world2_state_resultado_layer`
- `world2_state_ready_layer`

### Mediacion

- `world2_capture_icon_soft`
- `world2_conditioning_icon_soft`
- `world2_mapping_icon_soft`
- `world2_result_icon_soft`
- `world2_system_bridge_line`
- `world2_mediation_card_frame`
- `world2_mediation_card_glow`

### Lia

- `world2_lia_presence_idle`
- `world2_lia_presence_hint`
- `world2_lia_presence_ready`
- `world2_lia_trail_soft`
- `world2_lia_marker_small`

Nota de identidad: Lia no debe representarse como humana, hada, mascota, nina, ingeniera, icono generico ni personaje nuevo. Si aparece, debe conservar identidad aprobada y rol de guia.

### CTA

- `world2_cta_pulse_ready`
- `world2_cta_orb_ready`
- `world2_cta_signal_gate`
- `world2_cta_next_world_marker`
- `world2_cta_accessible_button_frame`
- `world2_cta_focus_ring`

### Transicion

- `world2_transition_entry_halo`
- `world2_transition_entry_signal_path`
- `world2_transition_exit_pulse_gate`
- `world2_transition_exit_signal_fade`

### UI

- `world2_ui_card_panel`
- `world2_ui_chip_active`
- `world2_ui_chip_complete`
- `world2_ui_chip_locked`
- `world2_ui_tooltip_frame`
- `world2_ui_accessibility_backplate`

### Responsive

- `world2_responsive_mobile_safe_area`
- `world2_responsive_desktop_wide_area`
- `world2_responsive_shared_centerpiece`
- `world2_responsive_crop_safe_mask`

### Animacion

- `world2_anim_pulse_core_css`
- `world2_anim_signal_thread_css`
- `world2_anim_trace_stroke_css`
- `world2_anim_lia_idle_sprite`
- `world2_anim_state_transition_css`
- `world2_anim_parallax_layers_css`

## 11. Clasificacion reutilizable/adaptable/nuevo/no recomendado

| Asset existente / grupo | Ruta | Uso actual | Puede reutilizarse en W2 | Condicion | Riesgo | Recomendacion |
| --- | --- | --- | --- | --- | --- | --- |
| Barra de progreso transition root | `src/assets/transition-world/root/runtime/progress/**` | LoadingInitial y TransitionWorld | Reutilizable | Mantener como componente comun de progreso | Sobregeneralizar identidad visual de todos los mundos | Mantener para loading/transiciones, no usar como unico lenguaje de W2 |
| LoadingInitial runtime | `public/assets/runtime/loading-initial/**` | Pre-portada | Adaptable como referencia | No copiar como runtime W2 sin ticket | Mezclar semantica de pre-portada con W2 | Usar solo como referencia de suavidad y ritmo |
| Lia compartida | `public/assets/gvo/shared/lia/**` | Continuidad visual de Lia | Adaptable | Validar pose/rol con identidad aprobada | Romper identidad de Lia | Usar como referencia; crear variante W2 solo con aprobacion |
| Mundo I root | `public/assets/gvo/stations/world-1-root/**` | Mundo I | No recomendado como runtime W2 | Solo referencia de calidad | Reciclar semanticamente otra estacion | No reutilizar como asset W2 final |
| Atlas visual | `docs/narrative/atlas_visual_assets_gvo_v1/**` | Referencia historica/mockups | Adaptable como referencia | Requiere optimizacion y aprobacion | Usar mockup como final sin QA | Usar para brief y comparativo, no para runtime directo |
| Manifiestos historicos | `docs/archive_manifests/**` | Trazabilidad de evidencia | Reutilizable como modelo | No modificar en 014A | Confundir archivo historico con runtime | Usar como patron de documentacion |
| Assets reference | `assets/reference/**` | Referencias versionadas | Adaptable | No tocar ni mover | Copia accidental al runtime | Mantener como referencia de QA |
| DOM/CSS actual W2 | `src/screens/World2Root/**` | Experiencia temporal | Adaptable como estructura | No tocar en 014A | Quedar como final sin assets | Usar como base futura con ticket 014B |

## 12. Naming recomendado

Convencion recomendada:

```text
world2_pulse_<familia>_<nombre>_<estado>_v1.<ext>
world2_pulse_<familia>_<nombre>_<estado>_<frames>f_v1.<ext>
```

Ejemplos:

```text
world2_pulse_background_base_idle_v1.webp
world2_pulse_background_depth_near_idle_v1.webp
world2_pulse_signal_thread_active_6f_v1.webp
world2_pulse_interaction_node_ready_v1.svg
world2_pulse_lia_presence_hint_4f_v1.webp
world2_pulse_cta_orb_ready_v1.svg
world2_pulse_ui_card_panel_idle_v1.webp
```

Reglas:

- Usar minusculas, guiones bajos y version.
- No usar espacios, acentos ni nombres genericos.
- Mantener mundo (`world2`), tema (`pulse`), familia, nombre, estado y version.
- Todo asset integrado debe aparecer en manifest futuro.

## 13. Ubicacion futura recomendada

Ubicacion runtime futura recomendada, solo si un ticket posterior lo autoriza:

```text
public/assets/gvo/stations/world-2-pulse-invisible/
```

Subcarpetas futuras posibles:

```text
background/
ambient/
signal/
interaction/
states/
mediation/
lia/
cta/
transition/
ui/
manifests/
```

Ubicacion de fuente/revision fuera de runtime:

```text
C:\Users\JOSE DAVID\Downloads\GVO_W2_ASSETS_REVIEW\
```

Nota: esa carpeta no fue leida, creada ni modificada en 014A.

## 14. Carpeta global de revision recomendada

Carpeta global recomendada para revisar assets antes de integrarlos a GVO:

```text
C:\Users\JOSE DAVID\Documents\OKUA_ASSET_REVIEW\GVO\station-2-pulse-invisible\
```

Subcarpetas sugeridas fuera de GVO:

```text
00_brief/
01_candidates/
02_selected/
03_optimized/
04_manifest_review/
05_rejected/
```

Regla: GVO solo debe recibir assets aprobados, optimizados y trazados por manifest en un ticket posterior.

## 15. Brief maestro Estacion II

`BRIEF_MASTER_ESTACION_II`

Crear un sistema visual para Estacion II / Mundo II - Pulso invisible dentro de GVO. La escena debe sentirse como una interfaz organica, suave, pixel-art refinada, con atmosfera calmada, acentos lavanda y ambar calido, y una lectura clara en mobile vertical. El concepto central es una senal invisible que emerge entre planta, lectura mediada y resultado interpretado, sin activar QR, camara ni permisos. La experiencia debe ser mobile-first, legible, ligera, sin ruido tecnico excesivo, sin texto incrustado en imagen salvo decision explicita, y con capas exportables para integracion DOM/CSS.

Restricciones visuales:

- `soft pixel-art interface`
- `vertical mobile layout`
- `warm amber and lavender accents`
- `calm atmosphere`
- `readable UI`
- `mobile-friendly clarity`
- No human Lia.
- No fairy.
- No mascot.
- No engineer.
- No audio gear clutter.
- No browser UI.
- No headphones.
- No speakers.
- No cable clutter.
- No extra technical nodes.
- No text baked into image unless explicitly required.

## 16. Prompts por familia de asset

| Prompt ID | Familia | Objetivo | Prompt | Negative constraints | Salida esperada |
| --- | --- | --- | --- | --- | --- |
| `BRIEF_MASTER_ESTACION_II` | Global | Direccion visual completa | Soft pixel-art interface for GVO Station II, "Pulso invisible", organic signal emerging between plant, mediated reading and interpreted result, warm amber and lavender accents, calm atmosphere, readable UI, vertical mobile layout, layered export mindset, no baked text. | No human, no fairy, no mascot, no engineer, no audio gear clutter, no browser UI, no headphones, no speakers, no cable clutter, no extra technical nodes. | Guia visual maestra y moodboard de capas |
| `PROMPT_W2_BACKGROUND_MOBILE` | Fondo mobile | Fondo vertical seguro | Create a mobile vertical background for an organic pixel-art educational interface, subtle plant/signal atmosphere, warm cream base with lavender haze and amber glow, clear central safe area, no text, no UI chrome. | No characters, no browser UI, no clutter, no dark horror, no photo realism, no text. | `world2_background_mobile_safe` |
| `PROMPT_W2_BACKGROUND_DESKTOP` | Fondo desktop | Fondo wide | Create a desktop wide background companion for the same Station II soft pixel-art world, calm depth layers, central focus area, side ambience, warm amber and lavender accents, no text. | No extra panels, no people, no audio gear, no lab clutter, no QR/camera. | `world2_background_desktop_wide` |
| `PROMPT_W2_AMBIENT_LAYER` | Ambiente | Capas separadas de mist/glow | Transparent ambient layers for soft pixel-art interface: lavender haze, warm amber mist, small quiet particles, subtle vignette, designed as separate overlays. | No text, no faces, no symbols that imply hardware permission, no heavy noise. | `world2_ambient_*` |
| `PROMPT_W2_PULSE_SIGNAL` | Pulso/senal | Nucleo y ondas | Design an abstract invisible pulse signal in soft pixel-art style: gentle core, rings, dotted and continuous traces, organic bio-signal feel without audio waveform or medical monitor literalism. | No ECG monitor, no audio mixer, no speakers, no cables, no technical clutter. | `world2_pulse_*`, `world2_signal_*` |
| `PROMPT_W2_INTERACTION_NODE` | Interaccion | Nodo de accion | Create a compact interactive node state set for mobile UI: idle, ready, active, complete, locked, repeat; soft pixel-art, organic signal core, visible focus-safe silhouette. | No generic button stock style, no text baked in, no game joystick, no sci-fi overload. | `world2_interaction_node_*` |
| `PROMPT_W2_LIA_PRESENCE` | Lia | Presencia sutil | Create non-human guide presence markers for Lia continuity: soft trail, small marker, hint glow, ready glow; must preserve Lia as abstract guide presence, not a person or mascot. | No human Lia, no fairy, no mascot, no child, no engineer, no face redesign. | `world2_lia_presence_*`, `world2_lia_trail_soft` |
| `PROMPT_W2_CTA_ORGANIC` | CTA | Avance accesible | Design an organic pulse-ready CTA visual frame for a real DOM button: orb-ready, signal gate, next-world marker, focus ring, readable around text placed in HTML/CSS. | No text in image, no disabled-looking CTA, no generic web button, no hidden focus. | `world2_cta_*` |
| `PROMPT_W2_UI_CARD_FRAME` | UI | Tarjetas/capas | Create soft pixel-art UI card frames and chips for educational state layers: active, complete, locked, tooltip frame, accessibility backplate, transparent background where possible. | No dashboard corporate style, no dense data table, no text baked in, no tiny unreadable details. | `world2_ui_*` |
| `PROMPT_W2_TRANSITION_ENTRY_EXIT` | Transicion | Entrada/salida W2 | Create entry halo, entry signal path, exit pulse gate and signal fade assets for transitions into and out of Station II, matching existing GVO transition warmth. | No portal copied from W1, no 3D gate, no video frame, no text. | `world2_transition_*` |
| `PROMPT_W2_TRANSPARENT_VARIANTS` | Export | Variantes transparentes | Export selected pulse, signal, UI and Lia-presence assets with transparent background, clean alpha, crisp edges for CSS composition on mobile. | No matte fringes, no dark baked background, no text, no blur-heavy silhouettes. | PNG/WebP transparent candidates |
| `PROMPT_W2_NEGATIVE_CONSTRAINTS` | QA | Restricciones globales | Apply these negative constraints to every Station II asset: no human Lia, no fairy, no mascot, no engineer, no audio gear clutter, no browser UI, no headphones, no speakers, no cable clutter, no extra technical nodes, no text baked into image unless required. | Same as prompt. | Checklist de rechazo |

## 17. Negative prompts

Negative prompt global:

```text
no human Lia, no fairy, no mascot, no engineer, no child character, no audio gear clutter, no browser UI, no headphones, no speakers, no cable clutter, no excessive technical nodes, no QR camera screen, no medical monitor literalism, no ECG dashboard, no dark horror atmosphere, no photorealistic lab, no stock UI, no unreadable tiny text, no text baked into image unless explicitly required
```

Negative prompt de export:

```text
no matte edges, no alpha halo artifacts, no cropped subject, no low contrast CTA, no illegible mobile details, no hidden focus target, no huge empty margins, no overcompressed noise, no remote brand marks, no watermarks
```

## 18. Criterios de aceptacion visual

- Coherencia con GVO y con el lenguaje aprobado de Mundo I/transiciones.
- Mobile-first: lectura clara en `390x844`.
- Desktop aceptable en `1365x768` sin perder foco.
- Fondos no deben competir con texto DOM.
- Ningun asset debe contener texto final incrustado salvo decision explicita.
- La presencia de Lia debe respetar identidad aprobada.
- El pulso invisible debe sentirse organico y mediado, no como audio, laboratorio medico o dashboard corporativo.
- CTA debe poder envolver un `button` real con label textual y foco visible.
- El movimiento futuro debe ser realizable con CSS/SVG/sprites livianos.
- No debe requerir audio, video, 3D, permisos sensibles ni librerias pesadas.

## 19. Criterios de optimizacion

- Preferir WebP para fondos y capas raster pesadas.
- Usar PNG transparente cuando la limpieza de alpha sea prioritaria.
- Usar SVG local solo para trazos, chips, focus rings o formas simples auditables.
- Mantener dimensiones por uso real mobile/desktop.
- Evitar assets gigantes sin version optimizada.
- Cada asset candidato debe registrar dimensiones, peso, formato, fuente, estado y decision.
- Todo archivo final debe pasar por revision visual y tecnica antes de integrarse.
- No usar CDN ni recursos remotos.

## 20. Manifiesto futuro recomendado

Columnas recomendadas para manifest futuro:

```text
asset_id
file_name
family
state
format
width
height
bytes
sha256
source_path
runtime_path
intended_screen
responsive_role
animation_role
approval_status
approved_by
ticket
notes
```

Estado permitido sugerido:

- `CANDIDATE`
- `SELECTED_FOR_REVIEW`
- `APPROVED_FOR_RUNTIME`
- `REJECTED`
- `ARCHIVED_REFERENCE`

## 21. Reglas de integracion futura desde Descargas

- No copiar desde `Descargas` sin ticket especifico.
- Antes de copiar, listar archivos candidatos y revisar extensiones.
- Rechazar `.json`, `.jsonl`, `.db`, `.sqlite`, `.glb`, `.gltf`, `.riv`, `.lottie` salvo ticket explicito.
- Copiar solo assets aprobados por el usuario.
- Calcular hash y peso antes/despues de integrar.
- Optimizar fuera de runtime cuando aplique.
- Crear manifest con rutas y hashes.
- Integrar por ruta local versionada.
- Ejecutar pruebas focales y validacion browser mobile/desktop.
- Confirmar que no hay recursos remotos, audio, video, iframe, QR/camara ni permisos sensibles.

## 22. Matriz loading

| Pantalla | Componente | Assets usados | Problema observado | Fix aplicado | Resultado mobile | Resultado desktop |
| --- | --- | --- | --- | --- | --- | --- |
| `/` LoadingInitial | `GvoProgressBar` + `GvoProgressFrame` | `transition_root_progress_track_base`, `transition_root_progress_fill_segment`, `transition_root_progress_spark` | Barra visualmente correcta pero el criterio 014A de `2300ms` fue corregido por 014A-FIX1 | 014A-FIX1: `--loading-progress-duration: var(--loading-duration)` y ancho `clamp(282px, 80vw, 360px)` | PASO corregido: ancho `312px`, duracion `12000ms`, visible `774ms`, portada `12747ms`, sin overflow | PASO corregido: ancho `360px`, duracion `12000ms`, visible `452ms`, portada `12415ms`, sin overflow |
| `/portada` Cover | No aplica barra de loading | No aplica | Debe seguir accesible despues de loading | No se modifica | PASO: sin overflow, sin audio/video/iframe, sin assets remotos | PASO: sin overflow, sin audio/video/iframe, sin assets remotos |
| `/transition/intro-to-station-1` | `TransitionProgress` | Misma familia progress root | Referencia de fluidez | No se modifica | PASO: ancho `312px`, duracion `2300ms`, fill `7.48px -> 60.16px`, sin overflow | PASO: ancho `360px`, duracion `2300ms`, fill `8.73px -> 101.11px`, sin overflow |
| `/transition/world-1-to-world-2` | `TransitionProgress` | Misma familia progress root | Referencia de fluidez | No se modifica | PASO: ancho `312px`, duracion `2300ms`, fill `10.27px -> 96.64px`, sin overflow | PASO: ancho `360px`, duracion `2300ms`, fill `10.59px -> 109.16px`, sin overflow |

## 23. Matriz assets Estacion II

| Familia | Asset candidato | Funcion | Reutilizacion posible | Nuevo requerido | Formato recomendado | Animacion sugerida | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fondos | `world2_background_base` | Base visual de Estacion II | Atlas como referencia | Si | WebP + fuente PNG | Parallax CSS sutil | Alta |
| Fondos | `world2_background_depth_layer_near` | Profundidad cercana | No directa | Si | WebP/PNG alpha | Translate/opacity | Alta |
| Fondos | `world2_background_depth_layer_mid` | Profundidad media | No directa | Si | WebP/PNG alpha | Translate/opacity | Media |
| Fondos | `world2_background_depth_layer_far` | Profundidad lejana | No directa | Si | WebP | Parallax minimo | Media |
| Fondos | `world2_background_mobile_safe` | Variante vertical segura | No directa | Si | WebP | Estatica o scale leve | Alta |
| Fondos | `world2_background_desktop_wide` | Variante desktop | No directa | Si | WebP | Estatica | Media |
| Ambiente | `world2_ambient_mist_layer` | Niebla suave | Referencia loading | Si | PNG/WebP alpha | Opacity | Alta |
| Ambiente | `world2_ambient_particles_soft` | Particulas discretas | Referencia sparkles | Si | PNG/WebP alpha | Opacity/translate | Media |
| Ambiente | `world2_ambient_glow_field` | Campo luminoso | Referencia transicion | Si | PNG/WebP alpha | Opacity/filter | Media |
| Ambiente | `world2_ambient_shadow_vignette` | Control de foco | CSS posible | Opcional | CSS/SVG/PNG | Estatica | Media |
| Ambiente | `world2_ambient_lavender_haze` | Color identidad W2 | No directa | Si | PNG/WebP alpha | Opacity | Alta |
| Ambiente | `world2_ambient_warm_amber_haze` | Acento calido | Referencia progress | Si | PNG/WebP alpha | Opacity | Alta |
| Pulso | `world2_pulse_core_idle` | Nucleo base | No directa | Si | SVG/PNG | Scale/opacity | Alta |
| Pulso | `world2_pulse_core_active` | Nucleo activo | No directa | Si | SVG/PNG | Scale/opacity | Alta |
| Pulso | `world2_pulse_ring_01` | Anillo externo | CSS/SVG posible | Si | SVG | Stroke/opacity | Alta |
| Pulso | `world2_pulse_ring_02` | Anillo medio | CSS/SVG posible | Si | SVG | Stroke/opacity | Alta |
| Pulso | `world2_pulse_ring_03` | Anillo fino | CSS/SVG posible | Si | SVG | Stroke/opacity | Media |
| Senal | `world2_signal_thread_idle` | Hilo de senal quieto | No directa | Si | SVG/PNG alpha | Stroke-dashoffset | Alta |
| Senal | `world2_signal_thread_active` | Hilo activo | No directa | Si | SVG/PNG alpha | Stroke-dashoffset | Alta |
| Senal | `world2_signal_wave_soft` | Onda suave | No directa | Si | SVG | Stroke/opacity | Media |
| Senal | `world2_signal_wave_peak` | Pico narrativo | No directa | Si | SVG | Stroke/opacity | Media |
| Senal | `world2_signal_trace_dotted` | Traza punteada | CSS/SVG posible | Si | SVG | Dashoffset | Media |
| Senal | `world2_signal_trace_continuous` | Traza continua | CSS/SVG posible | Si | SVG | Dashoffset | Media |
| Interaccion | `world2_interaction_node_idle` | Estado base | No directa | Si | SVG/PNG | Scale | Alta |
| Interaccion | `world2_interaction_node_ready` | Estado listo | No directa | Si | SVG/PNG | Glow/scale | Alta |
| Interaccion | `world2_interaction_node_active` | Estado activo | No directa | Si | SVG/PNG | Pulse | Alta |
| Interaccion | `world2_interaction_node_complete` | Estado completado | No directa | Si | SVG/PNG | Check/opacity | Alta |
| Interaccion | `world2_interaction_node_locked` | Estado bloqueado | No directa | Si | SVG/PNG | Opacity | Media |
| Interaccion | `world2_interaction_node_repeat` | Repeticion | No directa | Si | SVG/PNG | Rotate/opacity | Baja |
| Estados | `world2_state_intro_overlay` | Entrada narrativa | CSS posible | Si | PNG/WebP alpha | Fade | Alta |
| Estados | `world2_state_planta_layer` | Capa planta | No directa | Si | PNG/WebP | Fade/translate | Alta |
| Estados | `world2_state_senal_layer` | Capa senal | No directa | Si | PNG/SVG | Fade/stroke | Alta |
| Estados | `world2_state_captura_layer` | Capa captura | No directa | Si | PNG/SVG | Fade | Media |
| Estados | `world2_state_acondicionamiento_layer` | Capa acondicionamiento | No directa | Si | PNG/SVG | Fade | Media |
| Estados | `world2_state_mapeo_layer` | Capa mapeo | No directa | Si | PNG/SVG | Fade | Media |
| Estados | `world2_state_resultado_layer` | Capa resultado | No directa | Si | PNG/SVG | Fade | Alta |
| Estados | `world2_state_ready_layer` | Capa listo | No directa | Si | PNG/SVG | Glow | Alta |
| Mediacion | `world2_capture_icon_soft` | Icono captura | CSS/SVG posible | Si | SVG | Opacity | Media |
| Mediacion | `world2_conditioning_icon_soft` | Icono acondicionamiento | CSS/SVG posible | Si | SVG | Opacity | Media |
| Mediacion | `world2_mapping_icon_soft` | Icono mapeo | CSS/SVG posible | Si | SVG | Opacity | Media |
| Mediacion | `world2_result_icon_soft` | Icono resultado | CSS/SVG posible | Si | SVG | Opacity | Media |
| Mediacion | `world2_system_bridge_line` | Linea de puente | CSS/SVG posible | Si | SVG | Stroke | Alta |
| Mediacion | `world2_mediation_card_frame` | Marco tarjeta | No directa | Si | WebP/SVG | Estatica | Media |
| Mediacion | `world2_mediation_card_glow` | Halo tarjeta | CSS posible | Opcional | PNG/CSS | Opacity | Media |
| Lia | `world2_lia_presence_idle` | Presencia guia | Lia compartida como referencia | Probable | PNG/WebP | Sprite/CSS | Media |
| Lia | `world2_lia_presence_hint` | Pista | Lia compartida como referencia | Probable | PNG/WebP | Opacity | Media |
| Lia | `world2_lia_presence_ready` | Listo | Lia compartida como referencia | Probable | PNG/WebP | Glow | Media |
| Lia | `world2_lia_trail_soft` | Estela | No directa | Si | PNG/WebP alpha | Translate/opacity | Baja |
| Lia | `world2_lia_marker_small` | Marcador pequeno | CSS/SVG posible | Si | SVG/PNG | Opacity | Baja |
| CTA | `world2_cta_pulse_ready` | Senal CTA | No directa | Si | SVG/PNG | Pulse | Alta |
| CTA | `world2_cta_orb_ready` | Orbe avance | No directa | Si | SVG/PNG | Scale/glow | Alta |
| CTA | `world2_cta_signal_gate` | Puerta de senal | No directa | Si | SVG/PNG | Stroke/fade | Media |
| CTA | `world2_cta_next_world_marker` | Marcador siguiente | No directa | Si | SVG | Translate | Media |
| CTA | `world2_cta_accessible_button_frame` | Frame boton real | CSS/SVG posible | Si | SVG/CSS | Hover/focus | Alta |
| CTA | `world2_cta_focus_ring` | Foco accesible | CSS posible | Opcional | CSS/SVG | Focus-visible | Alta |
| Transicion | `world2_transition_entry_halo` | Entrada W2 | Transition root como referencia | Si | PNG/WebP | Scale/fade | Alta |
| Transicion | `world2_transition_entry_signal_path` | Camino entrada | Transition root como referencia | Si | SVG/PNG | Stroke | Alta |
| Transicion | `world2_transition_exit_pulse_gate` | Salida W2-W3 | No directa | Si | SVG/PNG | Scale/fade | Alta |
| Transicion | `world2_transition_exit_signal_fade` | Fade salida | No directa | Si | PNG/WebP alpha | Opacity | Media |
| UI | `world2_ui_card_panel` | Panel suave | No directa | Si | WebP/SVG | Estatica | Media |
| UI | `world2_ui_chip_active` | Chip activo | CSS posible | Si | SVG/CSS | State | Media |
| UI | `world2_ui_chip_complete` | Chip completo | CSS posible | Si | SVG/CSS | State | Media |
| UI | `world2_ui_chip_locked` | Chip bloqueado | CSS posible | Si | SVG/CSS | State | Media |
| UI | `world2_ui_tooltip_frame` | Tooltip | CSS posible | Opcional | SVG/CSS | Fade | Baja |
| UI | `world2_ui_accessibility_backplate` | Fondo lectura | CSS posible | Si | CSS/SVG | Estatica | Alta |

## 24. Matriz prompts

| Prompt ID | Familia | Objetivo | Prompt | Negative constraints | Salida esperada |
| --- | --- | --- | --- | --- | --- |
| `BRIEF_MASTER_ESTACION_II` | Global | Establecer tono y restricciones | Ver seccion 15. | Ver seccion 17. | Brief maestro para produccion externa |
| `PROMPT_W2_BACKGROUND_MOBILE` | Fondo | Producir fondo vertical | Soft pixel-art interface background, vertical mobile layout, calm Station II atmosphere, organic invisible pulse, warm amber and lavender accents, readable central safe area, no text. | No human, no fairy, no mascot, no browser UI, no clutter. | Fondo mobile candidato |
| `PROMPT_W2_BACKGROUND_DESKTOP` | Fondo | Producir fondo desktop | Wide desktop companion background for Station II, layered depth, calm atmosphere, warm amber/lavender accents, centered safe composition, no text. | No panels, no people, no hardware clutter. | Fondo desktop candidato |
| `PROMPT_W2_AMBIENT_LAYER` | Ambiente | Producir overlays | Transparent ambient overlays: lavender haze, amber glow, mist, particles, vignette, soft pixel-art edges. | No text, no faces, no heavy noise. | Capas alpha |
| `PROMPT_W2_PULSE_SIGNAL` | Pulso | Producir sistema de senal | Abstract invisible pulse core, rings and signal threads for an organic educational interface, soft pixel-art, readable mobile clarity. | No ECG, no audio waveform, no cables, no speakers. | Nucleo, anillos y trazas |
| `PROMPT_W2_INTERACTION_NODE` | Interaccion | Producir estados nodo | Interaction node state set: idle, ready, active, complete, locked, repeat; organic pulse shape, focus-safe silhouette. | No stock buttons, no text baked in. | Estados de nodo |
| `PROMPT_W2_LIA_PRESENCE` | Lia | Producir presencia no humana | Subtle Lia presence markers: hint glow, trail, ready marker, abstract guide continuity, no character redesign. | No human Lia, no fairy, no mascot, no child, no engineer. | Marcadores Lia |
| `PROMPT_W2_CTA_ORGANIC` | CTA | Producir frame de avance | Organic pulse-ready CTA frame for a real DOM button, visible focus ring, room for HTML/CSS label. | No text in image, no generic web button. | CTA visual accesible |
| `PROMPT_W2_UI_CARD_FRAME` | UI | Producir marcos | Soft pixel-art UI card frames, chips and accessibility backplates for state layers. | No dashboard corporate, no dense tables, no text baked in. | Marcos UI |
| `PROMPT_W2_TRANSITION_ENTRY_EXIT` | Transicion | Producir entrada/salida | Entry halo, signal path, exit pulse gate and signal fade for Station II transitions, coherent with GVO warmth. | No copied W1 portal, no 3D, no video, no text. | Assets transicion |
| `PROMPT_W2_TRANSPARENT_VARIANTS` | Export | Solicitar alpha limpio | Export selected assets as transparent PNG/WebP with clean alpha, crisp edge, mobile-safe crop. | No matte fringes, no dark baked background, no watermark. | Variantes transparentes |
| `PROMPT_W2_NEGATIVE_CONSTRAINTS` | QA | Filtrar candidatos | Apply global negative constraints before acceptance. | Ver seccion 17. | Checklist de descarte |

## 25. Matriz continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
| --- | --- | --- | --- | --- | --- |
| `014A-PUSH` | Sincronizar fix loading y documento de paquete assets | Cierra la correccion actual | Requiere commit aprobado primero | Ejecutar solo despues de aprobacion y commit local de 014A | `014A-PUSH` |
| `014B` | Integrar assets aprobados desde Descargas | Convierte paquete en runtime real | Alto si no hay assets aprobados/manifiesto | Solo despues de assets revisados y aprobados | `014B - Integrar assets Estacion II` |
| `014B-REVIEW` | Revisar carpeta global de candidatos antes de tocar GVO | Reduce riesgo de basura visual/runtime | Requiere preparar carpeta externa | Recomendado si hay muchos candidatos | `014B-REVIEW` |
| `014C` | Reemplazar experiencia temporal de Mundo II | Mejora pantalla final | Bloqueado sin assets y criterios | Solo despues de 014B | `014C` |
| `013C-RETRO` | Revisar sistema de barra comun | Baja deuda de progress | Puede duplicar trabajo | Solo si browser detecta regresion | No recomendado ahora |

## 26. Riesgos residuales

Seguridad:

- La integracion futura desde Descargas puede introducir archivos no deseados si no se filtran extensiones, hashes y pesos.
- Los assets generados por herramientas externas deben revisarse fuera de GVO antes de entrar al repo.

Visual:

- Unificar tempo de la barra mejora fluidez, pero no resuelve aun la identidad final de Mundo II.
- La estacion necesita assets propios para dejar de sentirse temporal.

Arquitectura:

- `LoadingInitial` sigue usando assets de `transition-world/root/progress`; es aceptable para una barra comun, pero debe mantenerse como pieza compartida y no como acoplamiento de logica.

Accesibilidad:

- El futuro CTA visual debe conservar `button`, label textual, foco visible y navegacion por teclado.

Performance:

- Fondos/capas futuras deben tener presupuesto de peso y variantes mobile/desktop para no degradar carga.

## 27. Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| `git status --short --branch` | PASO: inicio `## main...origin/main`; cambios esperados en CSS y documento 014A antes de commit |
| `git log --oneline -n 8` | PASO: HEAD inicial `c1d5d62 fix: align loading visuals and define asset pipeline 013C` |
| `git diff --check` | PASO: sin errores; advertencia esperada CRLF/LF en CSS |
| `npm run test -- LoadingInitial` | PASO: 2 archivos, 11 pruebas |
| `npm run test -- TransitionWorld` | PASO: 1 archivo, 15 pruebas |
| `npm run test -- editorial` | PASO: 1 archivo, 6 pruebas |
| `npm run lint` | PASO: `eslint .` sin errores |
| `npm run dev -- --host 127.0.0.1 --port 5173` | PASO: servidor levantado tras detener un Vite previo del mismo repo en 5173 |
| Browser in-app mobile `390x844` | PASO para layout, overflow, media y remotos; entorno reporto `prefers-reduced-motion`, por lo que la animacion se observo desactivada |
| Browser in-app desktop `1365x768` | PASO para layout, overflow, media y remotos; entorno reporto `prefers-reduced-motion`, por lo que la animacion se observo desactivada |
| Chrome local headless no-reduced mobile `390x844` | 014A-FIX1 corrige loading a `12000ms`; transiciones conservan `2300ms`; fill avanza, sin overflow |
| Chrome local headless no-reduced desktop `1365x768` | 014A-FIX1 corrige loading a `12000ms`; transiciones conservan `2300ms`; fill avanza, sin overflow |
| `pageerror` | PASO: ninguno detectado |
| Errores JS | PASO: ninguno detectado; un mensaje generico de recurso 404 aparecio una vez en consola headless, sin `pageerror` y sin respuestas HTTP >= 400 en verificacion posterior |
| Recursos remotos | PASO: ninguno detectado |
| Audio/video/iframe | PASO: conteo `0` en rutas revisadas |
| Cierre servidor local | PASO: `PORT_5173_NO_LISTENER` |

## 28. Confirmaciones de alcance

- No se produjeron assets finales.
- No se crearon carpetas de assets.
- No se copiaron archivos desde Descargas.
- No se modificaron `public/assets/**`.
- No se modificaron `assets/**`.
- No se modificaron `src/assets/**`.
- No se modifico `World2Root`.
- No se modificaron pantallas de mundos fuera de LoadingInitial.
- No se modifico `package.json`.
- No se modifico `package-lock.json`.
- No se instalaron dependencias.
- No se ejecuto red.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request. `PR_NO_APLICA`.

## 29. Siguiente paso recomendado

Despues de aprobacion humana de 014A:

```text
014A-PUSH - Sincronizar fix loading y paquete documental de assets Estacion II
```

Si se decide revisar assets externos antes de runtime:

```text
014B-REVIEW - Revisar candidatos de assets Estacion II fuera de GVO
```
