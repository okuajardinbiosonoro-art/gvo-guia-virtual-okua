# 015C - Reset de composicion visual Estacion II / Mundo II

## Estado

`IMPLEMENTADO_LOCAL / VALIDADO_CON_CAPTURAS / SIN_PUSH / PR_NO_APLICA`

## Estado inicial Git

```text
## main...origin/main [ahead 3]
1c695dc fix: rebuild World II immersive station layout
f6fc078 feat: integrate World II station runtime base
94b86a9 assets: add current-used runtime asset registry
ed62302 docs: inventory existing assets for World II references 014BREF
0247c18 fix: correct loading preload and asset methodology 014A1
```

## Decision visual

La version 015B fue rechazada visualmente por revision manual del usuario. Aunque cumplia validaciones tecnicas, seguia percibiendose como una composicion acumulada de imagenes con exceso de morado, poca jerarquia pedagogica y dialogo insuficientemente integrado.

015C resetea la composicion visual sin agregar assets nuevos.

## Archivos modificados

```text
src/screens/World2Root/World2RootScreen.tsx
src/screens/World2Root/World2RootScreen.css
src/screens/World2Root/World2RootScreen.test.tsx
docs/status/015C_WORLD2_VISUAL_COMPOSITION_RESET.md
docs/visual/world2/015C/*.png
```

## Cambios de composicion realizados

- Se redujo el numero de assets montados por estado.
- Se ocultaron microescenas en capa 1, capa 2, capa 4 y ready.
- Se limito cada microescena visible a dos assets.
- Se eliminaron badges de navegacion como imagenes y se reemplazaron por marcas CSS pequeñas.
- Se elimino el glow extra del dialogo para evitar texto pegado o fuera de panel.
- Se redujo la saturacion morada general.
- Se reposiciono planta como origen vivo a izquierda / centro-izquierda.
- Se mantuvo Lia 2.5D limpia en centro-derecha.
- Se dejo la senal entre planta y Lia, sin notas musicales ni lectura de musica directa.
- Se mantuvo stage full-screen mobile-only sin `MobileShell`, card beige ni badge global.

## Assets usados por capa

### Base comun

```text
world2_background_base_mobile_v01.webp
world2_ambient_lavender_haze_v01.png
world2_foreground_botanical_silhouette_v01.png
world2_main_living_plant_v01.png
world2_dialogue_panel_backplate_v01.png
world2_dialogue_lia_connector_tail_v01.png
world2_layer_nav_frame_v01.png
world2_layer_icon_glyphs_atlas_v01.png
world2_layer_nav_active_slot_glow_v01.png
```

### planta_viva

```text
world2_living_plant_aura_v01.png
lia_pose_idle_v1.png
```

### senal

```text
world2_bioelectric_signal_threads_v01.png
world2_raw_bioelectric_waveform_v01.png
world2_mediation_route_base_v01.png
world2_mediation_route_active_segment_v01.png
world2_lia_presence_halo_v01.png
world2_lia_signal_attention_wisps_v01.png
lia_pose_point_portal_1_v1.png
```

### captura

```text
world2_signal_capture_contact_v01.png
world2_raw_bioelectric_waveform_v01.png
world2_mediation_route_base_v01.png
world2_mediation_route_active_segment_v01.png
world2_micro_scene_bubble_frame_v01.png
world2_micro_scene_capture_reticle_v01.png
world2_lia_presence_halo_v01.png
lia_pose_explain_calm_v1.png
```

### acondicionamiento

```text
world2_signal_conditioning_field_v01.png
world2_raw_bioelectric_waveform_v01.png
world2_mediation_route_base_v01.png
world2_mediation_route_active_segment_v01.png
world2_lia_presence_halo_v01.png
lia_pose_explain_calm_v1.png
```

### mapeo

```text
world2_signal_mapping_constellation_v01.png
world2_raw_bioelectric_waveform_v01.png
world2_mediation_route_base_v01.png
world2_mediation_route_active_segment_v01.png
world2_micro_scene_bubble_frame_v01.png
world2_micro_scene_holographic_base_v01.png
world2_lia_presence_halo_v01.png
lia_pose_point_portal_1_v1.png
```

### resultado_mediado

```text
world2_mediated_result_bloom_v01.png
world2_raw_bioelectric_waveform_v01.png
world2_mediation_route_base_v01.png
world2_mediation_route_active_segment_v01.png
world2_micro_scene_bubble_frame_v01.png
world2_micro_scene_holographic_base_v01.png
world2_lia_presence_halo_v01.png
lia_pose_greeting_v1.png
```

### ready_to_continue

```text
world2_ready_continue_signal_path_v01.png
world2_cta_organic_pulse_button_v01.png
lia_pose_greeting_v1.png
```

## Assets ocultados o dejados fuera

No se usan en runtime 015C:

```text
lia_pose_activate_portal_1_v1.png
world2_lia_dialogue_focus_glow_v01.png
world2_lia_transition_sparkle_trail_v01.png
world2_dialogue_panel_reveal_glow_v01.png
world2_layer_status_lock_glyph_v01.png
world2_layer_status_complete_glyph_v01.png
world2_micro_scene_bubble_focus_glow_v01.png
world2_micro_scene_bubble_connector_v01.png
world2_pulse_core_node_v01.png
world2_pulse_expansion_ring_v01.png
```

Tampoco se usan las poses generadas para W2:

```text
world2_lia_idle_pose_world2_v01.png
world2_lia_explain_pose_world2_v01.png
world2_lia_invite_pose_world2_v01.png
```

## Mapeo de poses de Lia

```text
planta_viva: lia_pose_idle_v1.png
senal: lia_pose_point_portal_1_v1.png
captura: lia_pose_explain_calm_v1.png
acondicionamiento: lia_pose_explain_calm_v1.png
mapeo: lia_pose_point_portal_1_v1.png
resultado_mediado: lia_pose_greeting_v1.png
ready_to_continue: lia_pose_greeting_v1.png
```

Confirmacion: `lia_pose_activate_portal_1_v1.png` no se usa en la composicion runtime 015C.

## Capturas generadas

```text
docs/visual/world2/015C/world2_015C_390x844_layer_1.png
docs/visual/world2/015C/world2_015C_390x844_layer_2.png
docs/visual/world2/015C/world2_015C_390x844_layer_3.png
docs/visual/world2/015C/world2_015C_390x844_layer_4.png
docs/visual/world2/015C/world2_015C_390x844_layer_5.png
docs/visual/world2/015C/world2_015C_390x844_layer_6.png
docs/visual/world2/015C/world2_015C_390x844_ready.png
docs/visual/world2/015C/world2_015C_430x932_layer_1.png
docs/visual/world2/015C/world2_015C_430x932_ready.png
```

## Metricas de capturas

```text
390x844 layer_1: 9 imagenes, microescena none
390x844 layer_2: 14 imagenes, microescena none
390x844 layer_3: 15 imagenes, microescena captura
390x844 layer_4: 13 imagenes, microescena none
390x844 layer_5: 15 imagenes, microescena mapeo
390x844 layer_6: 15 imagenes, microescena resultado_mediado
390x844 ready: 13 imagenes, microescena none
430x932 layer_1: 9 imagenes, microescena none
430x932 ready: 13 imagenes, microescena none
```

Todas las capturas reportaron:

```text
imagenes rotas: 0
imagenes remotas: 0
TEMP visible: no
overflow horizontal: no
overflow vertical: no
audio: 0
video: 0
canvas: 0
MobileShell: no
basePanel: no
lia_pose_activate_portal_1_v1 usado: no
```

## Validacion visual interna

1. La planta se entiende como origen vivo: si.
2. Lia se ve clara y protagonista: si.
3. La senal se entiende como dato y no como musica: si, no hay notas ni pentagramas.
4. El dialogo esta dentro del panel: si.
5. La navegacion inferior se entiende como 6 capas: si.
6. Solo una capa esta focalizada: si.
7. La escena esta menos saturada que 015B: si.
8. Hay algun asset que parezca pegado sin integracion: riesgo bajo; la microescena sigue siendo el elemento mas artificial, pero ya no aparece en capa 1 ni ready y se limita a una por capa.
9. Algun texto queda encima o fuera de un contenedor: no detectado en capturas.
10. Se uso `lia_pose_activate_portal_1_v1.png`: no.

## Validaciones tecnicas

```text
npm run test -- World2Root
Resultado: PASA
Evidencia: 1 archivo de prueba, 3 pruebas pasadas.
```

```text
npm run lint
Resultado: PASA
```

```text
git diff --check
Resultado: PASA
Observacion: solo avisos normales de conversion LF -> CRLF en Windows.
```

```text
npm run build
Resultado: FALLA POR DEUDA PREEXISTENTE FUERA DEL ALCANCE 015C
Detalle: TypeScript falla en src/content/editorial/resolveEditorialText.ts por acceso de locale en entradas editoriales sin variante en.
Decision: no se corrige en 015C.
```

## Fallos o limitaciones

- La mejora visual es una base revisable, no cierre visual final.
- La referencia `estacion2.png` se uso conceptualmente por descripcion del ticket; no se encontro una ruta versionada equivalente dentro del repo.
- El build global sigue bloqueado por deuda editorial preexistente.

## Confirmaciones

- No se generaron assets visuales.
- No se copiaron nuevos assets desde Descargas.
- No se instalaron dependencias.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se introdujo Three.js/R3F/Rive/Lottie/dotLottie.
- No se uso video.
- No se uso audio.
- No se uso canvas.
- No se uso QR/camara.
- No se usaron assets remotos ni CDN.
- No se importo Excel.
- No se ejecuto `npm audit`.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto baseline completo.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
