# 014A-FIX1 - Pre-portada, preload y metodologia assets Estacion II

## 1. Proposito

Corregir el criterio operativo de 014A antes del push: la pre-portada debe aparecer rapido, mantener una barra visible por minimo `12000ms`, precargar recursos criticos en segundo plano y pasar a portada solo cuando se cumplan duracion minima y precarga critica.

Tambien se completa la metodologia de produccion externa de assets para Estacion II / Mundo II - Pulso invisible, sin producir ni integrar assets en este ticket.

## 2. Alcance

Ticket ejecutado: `014A-FIX1 - Corregir duracion/preload de pre-portada y cerrar metodologia assets Estacion II`.

Alcance aplicado:

- Ajuste de duracion de barra `LoadingInitial` a `12000ms`.
- Separacion explicita entre `first paint` y precarga interna de `LoadingInitial`.
- Documentacion del contrato de precarga real: shell inmediato, barra minima, preload critico y navegacion posterior.
- Ampliacion metodologica para produccion externa de assets Estacion II.
- Sin tocar `TransitionWorld`.
- Sin tocar `World2Root`.
- Sin producir assets.
- Sin copiar desde Descargas.
- Sin crear carpetas de assets.
- Sin push.
- Sin PR. `PR_NO_APLICA`.

## 3. Estado Git inicial

```text
## main...origin/main [ahead 1]
```

Working tree inicial: limpio.

Commit local previo:

```text
008c67a fix: polish loading and specify World II assets 014A
```

## 4. Diagnostico de demora antes de ver pre-portada

Diagnostico tecnico:

- La ruta `/` renderiza `JourneyLoadingRoute`, que devuelve `LoadingInitialScreen`.
- `JourneyLoadingRoute` ya mantiene contrato real hacia portada:
  - inicia timer de duracion minima;
  - inicia `coverIntroCritical` preload;
  - navega a `/portada` solo cuando `minimumDurationComplete` y `coverIntroPreload.ready` son verdaderos.
- No se detecto una promesa bloqueante explicita antes de renderizar `LoadingInitialScreen`.
- El riesgo perceptual estaba en no declarar ni probar el contrato de first paint y en dejar que la precarga interna de `LoadingInitial` pudiera competir con el primer frame visible.
- `LoadingInitialScreen` cargaba su bundle critico con `useAssetPreloader` inmediatamente despues del montaje. Ese hook usa `useEffect`, por lo que no bloquea render de React, pero no habia un contrato DOM verificable que separara shell visible de precarga.

Fix aplicado:

- Se agrego estado `firstPaintReady`.
- La precarga interna `loadingInitialCritical` ahora se activa solo despues de un `requestAnimationFrame`.
- El DOM expone:
  - `data-first-paint-contract="shell-before-preload"`;
  - `data-first-paint-ready`;
  - `data-loading-preload-status`;
  - `data-loading-preload-progress`;
  - `data-preload-contract="first-paint-before-critical-preload"`.

## 5. Diagnostico de duracion de barra

014A dejo la barra con `2300ms`, alineada con el tempo de `TransitionWorld`. Ese criterio fue corregido: pre-portada no es transicion corta, es una pantalla real de precarga.

Estado corregido:

- `LoadingInitial`: `12000ms`.
- `TransitionWorld`: conserva `2300ms`.
- Se mantiene el ancho compartido `clamp(282px, 80vw, 360px)`.
- Se mantiene el frame y assets de progreso compartidos.

## 6. Fix aplicado

Archivos modificados:

- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.test.tsx`
- `docs/status/014A_LOADING_Y_PAQUETE_ASSETS_ESTACION_II.md`

Archivo creado:

- `docs/status/014A_FIX1_PREPORTADA_PRELOAD_ASSETS_ESTACION_II.md`

Cambios clave:

- `--loading-progress-duration` vuelve a depender de `var(--loading-duration)`.
- `--loading-duration` se mantiene en `12000ms`.
- La precarga interna de `LoadingInitial` se activa despues del primer frame.
- Tests agregados para duracion de progreso y contrato first paint.

## 7. Metrica time_to_loading_visible_ms

Objetivo:

```text
ideal <= 800ms
aceptable <= 1200ms
```

Resultado 014A-FIX1:

- Mobile `390x844`: `774ms`, dentro de aceptable `<= 1200ms` e ideal `<= 800ms`.
- Desktop `1365x768`: `452ms`, dentro de ideal `<= 800ms`.
- Reduced motion mobile: `518ms`, dentro de ideal `<= 800ms`.

Metodo:

- Navegar a `/`.
- Medir desde `performance.getEntriesByType("navigation")[0].startTime` hasta que exista y sea visible `[data-gvo-progress-bar="loading-initial"]`.
- Registrar si el shell aparece antes de activar precarga interna.

## 8. Metrica loading_progress_duration_ms

Objetivo:

```text
minimo 12000ms
```

Resultado esperado:

```text
12000ms
```

Evidencia DOM:

- `data-progress-duration-ms="12000"`.
- CSS `--gvo-progress-duration` resuelve a `12000ms`.

Resultado 014A-FIX1:

- DOM: `data-progress-duration-ms="12000"`.
- CSS: `--gvo-progress-duration: 12000ms`.
- Animacion normal Chrome local: `fillAnimationDuration: 12s`.
- Reduced motion: `fillAnimationDuration: 0s`, pero la permanencia minima de la pantalla se mantiene en `12000ms`.

## 9. Metrica time_to_portada_ms

Objetivo:

```text
>= 12000ms salvo bypass explicito no permitido
```

Contrato:

```text
render shell inmediato
-> iniciar barra 12000ms
-> precargar recursos criticos
-> navegar a portada cuando duracion minima y coverIntroCritical.ready esten completos
```

Resultado 014A-FIX1:

- Mobile `390x844`: `12747ms`.
- Desktop `1365x768`: `12415ms`.
- Reduced motion mobile: `12437ms`.

Todos los casos cumplen `>= 12000ms`.

## 10. Resultado mobile

Viewport objetivo:

```text
390x844
```

Resultado 014A-FIX1:

- `time_to_loading_visible_ms`: `774ms`.
- `time_to_portada_ms`: `12747ms`.
- Barra `loading-initial`: `12000ms`.
- Fill avanza: `7.5px -> 30.95px` en la muestra inicial.
- Ancho barra: `312px`.
- Sin overflow horizontal.
- Sin pageerror.
- Sin assets remotos.
- Sin audio, video ni iframe.
- Un mensaje generico de recurso `404` aparecio una vez en consola mobile headless; no hubo respuestas HTTP `>= 400` registradas por Playwright, por lo que se trata como advertencia no bloqueante, probablemente recurso de navegador no critico.

## 11. Resultado desktop

Viewport objetivo:

```text
1365x768
```

Resultado 014A-FIX1:

- `time_to_loading_visible_ms`: `452ms`.
- `time_to_portada_ms`: `12415ms`.
- Barra `loading-initial`: `12000ms`.
- Fill avanza: `8.67px -> 36.66px` en la muestra inicial.
- Ancho barra: `360px`.
- Sin overflow horizontal.
- Sin pageerror.
- Sin errores JS.
- Sin assets remotos.
- Sin audio, video ni iframe.

## 12. Confirmacion de precarga como contrato

La precarga no es decorativa.

Contrato actual:

- `LoadingInitial` pinta shell y barra.
- `LoadingInitial` inicia su propia precarga critica despues del primer frame.
- `JourneyLoadingRoute` precarga `coverIntroCritical`.
- La navegacion a portada espera duracion minima y `coverIntroCritical.ready`.

Estado:

```text
preload_contract_prepared
critical_assets_defined_for_cover_intro
loading_initial_internal_preload_deferred_after_first_paint
```

## 13. Metodologia de generacion externa de assets

Flujo aprobado:

```text
ChatGPT define briefs/prompts/checklists
Usuario genera assets fuera del repo
Usuario limpia o corrige en Photopea si aplica
Usuario optimiza fuera del repo
Usuario deja assets en Descargas
Codex integra assets aprobados desde Descargas en ticket posterior
```

Reglas:

- Es mejor generar assets de sobra que llegar a integracion con assets faltantes.
- No todos los assets generados deben usarse.
- Los assets no usados deben quedar en carpeta global de revision con manifest.
- Ningun asset entra a GVO sin revision humana, naming correcto y manifest.

## 14. Herramientas recomendadas

Herramienta principal:

- `ChatGPT Images`: concept art, fondos, capas ambientales, piezas transparentes y variantes visuales.

Herramienta de correccion:

- `Photopea`: recorte, limpieza, correccion de bordes, separacion por capas, ajuste de transparencia y correccion de artefactos.

Herramienta de optimizacion:

- Squoosh, ImageOptim o herramienta local equivalente para convertir a WebP, reducir peso, preservar transparencia y validar dimensiones.

Sandbox posterior, no ahora:

- Rive.
- Lottie/dotLottie.
- Three.js/R3F.
- glTF/GLB.

No se recomienda instalar dependencias dentro de GVO para producir assets.

## 15. Paquete exhaustivo de assets Estacion II

### Fondos

- `world2_background_base_mobile_v01.webp`
- `world2_background_base_desktop_v01.webp`
- `world2_background_depth_far_v01.webp`
- `world2_background_depth_mid_v01.webp`
- `world2_background_depth_near_v01.webp`
- `world2_background_safe_crop_390x844_v01.webp`
- `world2_background_safe_crop_1365x768_v01.webp`

### Ambiente

- `world2_ambient_mist_soft_v01.webp`
- `world2_ambient_particles_sparse_v01.webp`
- `world2_ambient_particles_dense_v01.webp`
- `world2_ambient_lavender_haze_v01.webp`
- `world2_ambient_amber_haze_v01.webp`
- `world2_ambient_vignette_soft_v01.webp`
- `world2_ambient_glow_field_v01.webp`

### Pulso / senal

- `world2_pulse_core_idle_v01.png`
- `world2_pulse_core_active_v01.png`
- `world2_pulse_core_complete_v01.png`
- `world2_pulse_ring_inner_v01.svg`
- `world2_pulse_ring_mid_v01.svg`
- `world2_pulse_ring_outer_v01.svg`
- `world2_signal_thread_idle_v01.svg`
- `world2_signal_thread_active_v01.svg`
- `world2_signal_wave_soft_v01.svg`
- `world2_signal_wave_peak_v01.svg`
- `world2_signal_trace_dotted_v01.svg`
- `world2_signal_trace_continuous_v01.svg`

### Nodo interactivo

- `world2_node_idle_v01.png`
- `world2_node_ready_v01.png`
- `world2_node_active_v01.png`
- `world2_node_complete_v01.png`
- `world2_node_locked_v01.png`
- `world2_node_repeat_v01.png`
- `world2_node_focus_ring_v01.svg`

### Capas por estado

- `world2_layer_intro_v01.webp`
- `world2_layer_planta_v01.webp`
- `world2_layer_senal_v01.webp`
- `world2_layer_captura_v01.webp`
- `world2_layer_acondicionamiento_v01.webp`
- `world2_layer_mapeo_v01.webp`
- `world2_layer_resultado_v01.webp`
- `world2_layer_ready_v01.webp`

### Mediacion tecnica suave

- `world2_icon_capture_soft_v01.svg`
- `world2_icon_conditioning_soft_v01.svg`
- `world2_icon_mapping_soft_v01.svg`
- `world2_icon_result_soft_v01.svg`
- `world2_bridge_line_soft_v01.svg`
- `world2_mediation_card_frame_v01.png`
- `world2_mediation_card_glow_v01.png`

### Lia / presencia guia

No crear a Lia como humana, hada, mascota ni nina.

- `world2_lia_presence_idle_v01.png`
- `world2_lia_presence_hint_v01.png`
- `world2_lia_presence_ready_v01.png`
- `world2_lia_trail_soft_v01.svg`
- `world2_lia_marker_small_v01.png`

### CTA organico / avance

Debe conservar `button` accesible aunque se vea organico.

- `world2_cta_pulse_ready_v01.png`
- `world2_cta_orb_ready_v01.png`
- `world2_cta_signal_gate_v01.svg`
- `world2_cta_next_world_marker_v01.svg`
- `world2_cta_button_frame_v01.png`
- `world2_cta_focus_ring_v01.svg`

### Transicion entrada/salida

- `world2_transition_entry_halo_v01.webp`
- `world2_transition_entry_signal_path_v01.svg`
- `world2_transition_exit_pulse_gate_v01.webp`
- `world2_transition_exit_signal_fade_v01.webp`

### UI / overlays

- `world2_ui_card_panel_v01.png`
- `world2_ui_chip_active_v01.png`
- `world2_ui_chip_complete_v01.png`
- `world2_ui_chip_locked_v01.png`
- `world2_ui_tooltip_frame_v01.png`
- `world2_ui_accessibility_backplate_v01.png`

### Variantes extra de seguridad

- `world2_fallback_background_flat_v01.webp`
- `world2_fallback_pulse_simple_v01.svg`
- `world2_fallback_ui_frame_v01.png`
- `world2_debug_safe_crop_overlay_v01.png`

## 16. Prompts detallados

### PROMPT_MASTER_ESTACION_II

Herramienta: ChatGPT Images.

Prompt:

```text
Design a soft pixel-art interface system for GVO Station II, "Pulso invisible". The scene must feel calm, organic and educational, with warm amber and lavender accents, mobile-first vertical composition, readable UI zones, layered assets for later DOM/CSS integration, and no text baked into the image. The concept is an invisible signal emerging between plant, mediated reading and interpreted result. Create visual language, not final code.
```

### PROMPT_BACKGROUND_MOBILE

```text
Create a 390x844 mobile-safe soft pixel-art background for Station II / Pulso invisible. Calm atmosphere, warm amber and lavender haze, subtle organic depth, clear center safe area for DOM text and interaction. No text, no characters, no browser UI.
```

### PROMPT_BACKGROUND_DESKTOP

```text
Create a 1365x768 desktop-wide companion background for Station II / Pulso invisible. Keep the same soft pixel-art language, layered depth, calm organic signal ambience, safe central composition, no baked text.
```

### PROMPT_AMBIENT_TRANSPARENT_LAYERS

```text
Create transparent ambient overlay layers for Station II: soft mist, sparse particles, dense particles, lavender haze, amber haze, vignette and glow field. Assets must have clean alpha and work over a warm calm background.
```

### PROMPT_PULSE_CORE

```text
Create pulse core states in soft pixel-art style: idle, active and complete. The core should look organic and invisible-signal inspired, not like a medical monitor, audio waveform or sci-fi dashboard.
```

### PROMPT_PULSE_RINGS

```text
Create three pulse rings, inner, mid and outer, as simple SVG-like shapes suitable for CSS opacity/stroke animation. Soft amber/lavender palette, calm, clean, mobile-readable.
```

### PROMPT_SIGNAL_TRACE

```text
Create SVG-like signal threads and traces: idle, active, soft wave, peak wave, dotted trace and continuous trace. They should feel like mediated plant signal, not audio equipment, waveform dashboard or code UI.
```

### PROMPT_INTERACTION_NODE

```text
Create an interaction node state set for Station II: idle, ready, active, complete, locked, repeat and focus ring. It must work as a visual wrapper for accessible DOM interactions, not as text baked into image.
```

### PROMPT_STATE_LAYERS

```text
Create layered state overlays for intro, planta, senal, captura, acondicionamiento, mapeo, resultado and ready. Soft pixel-art, transparent or light background variants, readable on mobile, no text.
```

### PROMPT_MEDIATION_SOFT_TECH

```text
Create soft technical mediation icons and connectors: capture, conditioning, mapping, result, bridge line, mediation card frame and card glow. Calm educational interface, no heavy lab, no realistic hardware.
```

### PROMPT_LIA_PRESENCE

```text
Create abstract Lia presence markers for Station II: idle presence, hint, ready, soft trail and small marker. Lia must not appear as a human, fairy, mascot, child or engineer. Preserve the idea of a gentle guide presence.
```

### PROMPT_CTA_ORGANIC

```text
Create organic CTA visual pieces for a real accessible button: pulse-ready, orb-ready, signal gate, next-world marker, button frame and focus ring. Leave space for DOM text; do not include text in image.
```

### PROMPT_UI_OVERLAY

```text
Create UI overlay pieces for Station II: card panel, active chip, complete chip, locked chip, tooltip frame and accessibility backplate. Soft pixel-art, readable, calm, no dashboard clutter, no text.
```

### PROMPT_TRANSITION_ENTRY

```text
Create Station II transition entry assets: entry halo and signal path. They should feel related to GVO transition warmth but specific to Pulso invisible. No copied portal, no 3D, no text.
```

### PROMPT_TRANSITION_EXIT

```text
Create Station II transition exit assets: pulse gate and signal fade. Soft pixel-art, calm, suitable for CSS opacity/transform animation and future W2 to W3 handoff.
```

## 17. Negative prompt global

```text
No human character.
No fairy.
No mascot.
No engineer.
No literal headphones.
No speakers.
No audio equipment clutter.
No browser UI.
No code UI.
No cables as clutter.
No extra technical nodes.
No realistic laboratory.
No heavy 3D render.
No photorealistic humans.
No text baked into image.
No logos.
No watermarks.
No QR codes.
No camera icons.
No audio player.
No waveform dashboard.
No dark horror mood.
No neon cyberpunk overload.
```

## 18. Checklist Photopea

- Abrir candidato fuera de GVO.
- Revisar bordes y halos de transparencia.
- Separar capas si el asset combina fondo, glow y UI.
- Eliminar texto quemado.
- Revisar safe crop mobile `390x844`.
- Revisar safe crop desktop `1365x768`.
- Exportar con nombre aprobado.
- No sobrescribir fuente original.
- Marcar asset rechazado si tiene marca de agua, logo, texto no aprobado o identidad incorrecta de Lia.

## 19. Checklist optimizacion

- Convertir fondos/capas pesadas a WebP si conserva calidad.
- Conservar PNG si alpha exacto es mas seguro.
- Preferir SVG para trazos simples y focus rings.
- Revisar dimensiones reales.
- Revisar peso por archivo.
- Evitar assets gigantes sin uso definido.
- Registrar herramienta usada.
- Registrar decision humana.

## 20. Checklist entrega Descargas

Ruta esperada para 014B:

```text
C:\Users\JOSE DAVID\Downloads\GVO_WORLD2_ASSETS_INBOX
```

Checklist:

- Carpeta creada por usuario o por ticket posterior autorizado.
- Assets aprobados ubicados en esa carpeta.
- Sin archivos ejecutables.
- Sin manifests obligatorios creados en 014A-FIX1.
- Lista/ruta exacta entregada a Codex en 014B.
- Codex revisara nombres, extensiones, pesos y hashes antes de integrar.

## 21. Manifest futuro recomendado

Archivo futuro:

```text
manifest_world2_assets.csv
```

Columnas:

```text
filename
family
intended_use
format
dimensions
source_tool
approved
runtime_candidate
notes
```

No se crea manifest en 014A-FIX1.

## 22. Reglas para 014B

- No iniciar 014B sin assets aprobados en `C:\Users\JOSE DAVID\Downloads\GVO_WORLD2_ASSETS_INBOX`.
- Validar extensiones antes de copiar.
- Rechazar archivos fuera de alcance.
- Calcular pesos y hashes.
- Crear manifest.
- Integrar solo assets aprobados.
- No activar QR/camara.
- No introducir audio/video/3D runtime.
- Ejecutar pruebas focales y browser mobile/desktop.

## 23. Matriz loading

| Pantalla | First visible ms | Duracion barra | Preload real | Problema | Fix | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| `/` LoadingInitial | Mobile `774ms`; desktop `452ms`; reduced mobile `518ms` | `12000ms` | Si: `coverIntroCritical` en ruta, `loadingInitialCritical` diferido tras first paint | 014A dejo barra en `2300ms` y sin contrato first-paint verificable | Barra a `12000ms`; preload interno diferido con `requestAnimationFrame`; metadata DOM agregada | PASO: portada despues de `12747ms` mobile, `12415ms` desktop y `12437ms` reduced |
| `/carga` LoadingInitial standalone | Cubierto por contrato DOM de componente | `12000ms` | Si: `loadingInitialCritical` diferido tras first paint | No habia contrato DOM de first paint | Metadata y defer interno | PASO unitario: contrato expuesto en DOM |
| `/transition/intro-to-station-1` | No aplica | `2300ms` | Si: assets transition root | No tocar en este ticket | Sin cambios | PASO: conserva `2300ms`, sin overflow, sin remotos |
| `/transition/world-1-to-world-2` | No aplica | `2300ms` | Si: assets transition root | No tocar en este ticket | Sin cambios | PASO: conserva `2300ms`, sin overflow, sin remotos |

## 24. Matriz assets

| Familia | Asset candidato | Uso esperado | Formato | Necesario para MVP visual | Puede sobrar | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| Fondos | `world2_background_base_mobile_v01.webp` | Fondo mobile principal | WebP | Si | No | Alta |
| Fondos | `world2_background_base_desktop_v01.webp` | Fondo desktop principal | WebP | Si | No | Alta |
| Fondos | `world2_background_depth_far_v01.webp` | Profundidad lejana | WebP | No | Si | Media |
| Fondos | `world2_background_depth_mid_v01.webp` | Profundidad media | WebP | No | Si | Media |
| Fondos | `world2_background_depth_near_v01.webp` | Profundidad cercana | WebP | No | Si | Media |
| Fondos | `world2_background_safe_crop_390x844_v01.webp` | QA crop mobile | WebP | Si | No | Alta |
| Fondos | `world2_background_safe_crop_1365x768_v01.webp` | QA crop desktop | WebP | Si | No | Alta |
| Ambiente | `world2_ambient_mist_soft_v01.webp` | Niebla suave | WebP | No | Si | Media |
| Ambiente | `world2_ambient_particles_sparse_v01.webp` | Particulas discretas | WebP | No | Si | Baja |
| Ambiente | `world2_ambient_particles_dense_v01.webp` | Variante densa | WebP | No | Si | Baja |
| Ambiente | `world2_ambient_lavender_haze_v01.webp` | Color ambiente | WebP | Si | Si | Alta |
| Ambiente | `world2_ambient_amber_haze_v01.webp` | Acento calido | WebP | Si | Si | Alta |
| Ambiente | `world2_ambient_vignette_soft_v01.webp` | Control foco | WebP/CSS | No | Si | Media |
| Ambiente | `world2_ambient_glow_field_v01.webp` | Campo luminoso | WebP | No | Si | Media |
| Pulso | `world2_pulse_core_idle_v01.png` | Nucleo base | PNG | Si | No | Alta |
| Pulso | `world2_pulse_core_active_v01.png` | Nucleo activo | PNG | Si | No | Alta |
| Pulso | `world2_pulse_core_complete_v01.png` | Nucleo completo | PNG | Si | No | Alta |
| Pulso | `world2_pulse_ring_inner_v01.svg` | Anillo interno | SVG | Si | No | Alta |
| Pulso | `world2_pulse_ring_mid_v01.svg` | Anillo medio | SVG | Si | Si | Media |
| Pulso | `world2_pulse_ring_outer_v01.svg` | Anillo externo | SVG | No | Si | Media |
| Senal | `world2_signal_thread_idle_v01.svg` | Hilo base | SVG | Si | No | Alta |
| Senal | `world2_signal_thread_active_v01.svg` | Hilo activo | SVG | Si | No | Alta |
| Senal | `world2_signal_wave_soft_v01.svg` | Onda suave | SVG | No | Si | Media |
| Senal | `world2_signal_wave_peak_v01.svg` | Pico narrativo | SVG | No | Si | Media |
| Senal | `world2_signal_trace_dotted_v01.svg` | Traza punteada | SVG | No | Si | Baja |
| Senal | `world2_signal_trace_continuous_v01.svg` | Traza continua | SVG | No | Si | Baja |
| Nodo | `world2_node_idle_v01.png` | Estado idle | PNG | Si | No | Alta |
| Nodo | `world2_node_ready_v01.png` | Estado listo | PNG | Si | No | Alta |
| Nodo | `world2_node_active_v01.png` | Estado activo | PNG | Si | No | Alta |
| Nodo | `world2_node_complete_v01.png` | Estado completo | PNG | Si | No | Alta |
| Nodo | `world2_node_locked_v01.png` | Estado bloqueado | PNG | No | Si | Media |
| Nodo | `world2_node_repeat_v01.png` | Estado repetir | PNG | No | Si | Baja |
| Nodo | `world2_node_focus_ring_v01.svg` | Foco accesible | SVG | Si | No | Alta |
| Capas | `world2_layer_intro_v01.webp` | Entrada narrativa | WebP | Si | Si | Alta |
| Capas | `world2_layer_planta_v01.webp` | Capa planta | WebP | Si | No | Alta |
| Capas | `world2_layer_senal_v01.webp` | Capa senal | WebP | Si | No | Alta |
| Capas | `world2_layer_captura_v01.webp` | Capa captura | WebP | No | Si | Media |
| Capas | `world2_layer_acondicionamiento_v01.webp` | Capa acondicionamiento | WebP | No | Si | Media |
| Capas | `world2_layer_mapeo_v01.webp` | Capa mapeo | WebP | No | Si | Media |
| Capas | `world2_layer_resultado_v01.webp` | Capa resultado | WebP | Si | No | Alta |
| Capas | `world2_layer_ready_v01.webp` | Capa listo | WebP | Si | No | Alta |
| Mediacion | `world2_icon_capture_soft_v01.svg` | Icono captura | SVG | No | Si | Media |
| Mediacion | `world2_icon_conditioning_soft_v01.svg` | Icono acondicionamiento | SVG | No | Si | Media |
| Mediacion | `world2_icon_mapping_soft_v01.svg` | Icono mapeo | SVG | No | Si | Media |
| Mediacion | `world2_icon_result_soft_v01.svg` | Icono resultado | SVG | No | Si | Media |
| Mediacion | `world2_bridge_line_soft_v01.svg` | Puente visual | SVG | Si | Si | Alta |
| Mediacion | `world2_mediation_card_frame_v01.png` | Marco tarjeta | PNG | No | Si | Media |
| Mediacion | `world2_mediation_card_glow_v01.png` | Brillo tarjeta | PNG | No | Si | Baja |
| Lia | `world2_lia_presence_idle_v01.png` | Presencia guia idle | PNG | No | Si | Media |
| Lia | `world2_lia_presence_hint_v01.png` | Pista guia | PNG | No | Si | Media |
| Lia | `world2_lia_presence_ready_v01.png` | Guia lista | PNG | No | Si | Media |
| Lia | `world2_lia_trail_soft_v01.svg` | Estela guia | SVG | No | Si | Baja |
| Lia | `world2_lia_marker_small_v01.png` | Marcador pequeno | PNG | No | Si | Baja |
| CTA | `world2_cta_pulse_ready_v01.png` | CTA pulso | PNG | Si | No | Alta |
| CTA | `world2_cta_orb_ready_v01.png` | CTA orbe | PNG | Si | Si | Alta |
| CTA | `world2_cta_signal_gate_v01.svg` | Puerta senal | SVG | No | Si | Media |
| CTA | `world2_cta_next_world_marker_v01.svg` | Marcador siguiente | SVG | No | Si | Media |
| CTA | `world2_cta_button_frame_v01.png` | Marco boton | PNG | Si | No | Alta |
| CTA | `world2_cta_focus_ring_v01.svg` | Foco CTA | SVG | Si | No | Alta |
| Transicion | `world2_transition_entry_halo_v01.webp` | Entrada W2 | WebP | Si | Si | Alta |
| Transicion | `world2_transition_entry_signal_path_v01.svg` | Camino entrada | SVG | Si | Si | Alta |
| Transicion | `world2_transition_exit_pulse_gate_v01.webp` | Salida W2 | WebP | No | Si | Media |
| Transicion | `world2_transition_exit_signal_fade_v01.webp` | Fade salida | WebP | No | Si | Media |
| UI | `world2_ui_card_panel_v01.png` | Panel UI | PNG | No | Si | Media |
| UI | `world2_ui_chip_active_v01.png` | Chip activo | PNG | No | Si | Baja |
| UI | `world2_ui_chip_complete_v01.png` | Chip completo | PNG | No | Si | Baja |
| UI | `world2_ui_chip_locked_v01.png` | Chip bloqueado | PNG | No | Si | Baja |
| UI | `world2_ui_tooltip_frame_v01.png` | Tooltip | PNG | No | Si | Baja |
| UI | `world2_ui_accessibility_backplate_v01.png` | Backplate lectura | PNG | Si | Si | Alta |
| Fallback | `world2_fallback_background_flat_v01.webp` | Fondo emergencia | WebP | Si | Si | Alta |
| Fallback | `world2_fallback_pulse_simple_v01.svg` | Pulso emergencia | SVG | Si | Si | Alta |
| Fallback | `world2_fallback_ui_frame_v01.png` | UI emergencia | PNG | No | Si | Media |
| QA | `world2_debug_safe_crop_overlay_v01.png` | QA crop externo | PNG | No | Si | Baja |

## 25. Matriz prompts

| Prompt ID | Familia | Herramienta | Prompt | Negative prompt | Salida esperada |
| --- | --- | --- | --- | --- | --- |
| `PROMPT_MASTER_ESTACION_II` | Global | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Direccion visual |
| `PROMPT_BACKGROUND_MOBILE` | Fondo | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Fondo mobile |
| `PROMPT_BACKGROUND_DESKTOP` | Fondo | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Fondo desktop |
| `PROMPT_AMBIENT_TRANSPARENT_LAYERS` | Ambiente | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Capas transparentes |
| `PROMPT_PULSE_CORE` | Pulso | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Nucleos |
| `PROMPT_PULSE_RINGS` | Pulso | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Anillos SVG-like |
| `PROMPT_SIGNAL_TRACE` | Senal | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Trazos |
| `PROMPT_INTERACTION_NODE` | Nodo | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Estados nodo |
| `PROMPT_STATE_LAYERS` | Capas | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Capas estado |
| `PROMPT_MEDIATION_SOFT_TECH` | Mediacion | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Iconos y puentes |
| `PROMPT_LIA_PRESENCE` | Lia | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Presencia Lia |
| `PROMPT_CTA_ORGANIC` | CTA | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | CTA organico |
| `PROMPT_UI_OVERLAY` | UI | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | UI overlay |
| `PROMPT_TRANSITION_ENTRY` | Transicion | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Entrada W2 |
| `PROMPT_TRANSITION_EXIT` | Transicion | ChatGPT Images | Ver seccion 16 | Ver seccion 17 | Salida W2 |

## 26. Matriz entrega Descargas

| Elemento | Ruta esperada | Quien lo produce | Quien lo revisa | Quien lo integra | Estado |
| --- | --- | --- | --- | --- | --- |
| Assets aprobados W2 | `C:\Users\JOSE DAVID\Downloads\GVO_WORLD2_ASSETS_INBOX` | Usuario con ChatGPT Images / Photopea | Ing. Jose David | Codex en 014B | Pendiente 014B |
| Manifest futuro | `manifest_world2_assets.csv` | Codex en ticket autorizado | Ing. Jose David | Codex en 014B | No creado |
| Rechazados/no usados | Carpeta global de revision externa | Usuario | Ing. Jose David | No runtime | Pendiente |
| Optimizations | Fuera de GVO | Usuario / herramienta externa | Ing. Jose David | Codex valida antes de copiar | Pendiente |

## 27. Riesgos residuales

- La medicion de first paint puede variar por cache local y perfil de navegador.
- `JourneyLoadingRoute` esta fuera del alcance de modificacion de 014A-FIX1; se documenta su contrato existente, pero no se edita en este ticket.
- `LoadingInitial` sigue importando assets de la escena en el bundle, por lo que el first paint tambien depende del costo JS/CSS inicial de Vite/app.
- Assets futuros pueden exceder peso si se generan sin optimizacion externa.
- La carpeta de Descargas no existe ni se crea en este ticket.

## 28. Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| `git status --short --branch` | PASO: inicio `## main...origin/main [ahead 1]`; cambios esperados antes de commit FIX1 |
| `git log --oneline -n 8` | PASO: HEAD inicial `008c67a fix: polish loading and specify World II assets 014A` |
| `git diff --check` | PASO: sin errores; advertencias LF/CRLF informativas |
| `npm run test -- LoadingInitial` | PASO: 2 archivos, 12 pruebas |
| `npm run test -- TransitionWorld` | PASO: 1 archivo, 15 pruebas |
| `npm run test -- editorial` | PASO: 1 archivo, 6 pruebas |
| `npm run lint` | PASO: `eslint .` sin errores |
| Browser in-app mobile `390x844` | PASO: `/`, `/portada`, `/transition/intro-to-station-1`, `/transition/world-1-to-world-2`; sin overflow, sin errores, sin remotos, sin audio/video/iframe; entorno reduced-motion muestra animacion detenida |
| Browser in-app desktop `1365x768` | PASO: mismas rutas; sin overflow, sin errores, sin remotos, sin audio/video/iframe; entorno reduced-motion muestra animacion detenida |
| Chrome local no-reduced mobile `390x844` | PASO: visible `774ms`, portada `12747ms`, barra `12000ms`, fill avanza |
| Chrome local no-reduced desktop `1365x768` | PASO: visible `452ms`, portada `12415ms`, barra `12000ms`, fill avanza |
| Chrome local reduced-motion mobile `390x844` | PASO: visible `518ms`, portada `12437ms`, barra `12000ms`, animacion detenida por reduced motion |
| `PORT_5173_NO_LISTENER` | PASO: servidor detenido al cierre de validaciones |

## 29. Confirmaciones de alcance

- Codex no produjo assets.
- Codex no copio assets desde Descargas.
- No se crearon assets finales.
- No se modificaron assets existentes.
- No se agregaron assets remotos.
- No se uso CDN.
- No se instalo ninguna dependencia.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se introdujo Three.js/R3F al runtime.
- No se introdujo Rive al runtime.
- No se introdujo Lottie/dotLottie al runtime.
- No se implemento audio.
- No se implemento video.
- No se importo Excel.
- No se reemplazaron textos TEMP.
- No se implemento contador diario.
- No se activo QR/camara.
- No se ejecuto baseline completo.
- No se ejecuto npm audit.
- No se ejecuto pre-commit.
- No se ejecuto gitleaks.
- No se ejecuto scripts/run_security_checks.ps1.
- No se ejecutaron herramientas externas dentro de GVO.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- PR_NO_APLICA.

## 30. Siguiente paso recomendado

Despues de aprobacion humana de 014A-FIX1:

```text
014A-FIX1-PUSH - Sincronizar correccion preload/metodologia assets
```

Luego:

```text
014B - Integrar assets Estacion II desde Descargas
```

Condicion para 014B:

```text
El usuario debe colocar assets aprobados en C:\Users\JOSE DAVID\Downloads\GVO_WORLD2_ASSETS_INBOX
```
