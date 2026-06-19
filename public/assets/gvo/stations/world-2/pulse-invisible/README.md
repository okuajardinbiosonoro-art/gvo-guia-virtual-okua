# Assets runtime Estacion II - Mundo II: Pulso invisible

## Estado

`015E_WORLD2_LAYER1_2_SEMANTIC_BASE / RUNTIME_INTEGRADO / MOBILE_ONLY`

Esta carpeta contiene los assets aprobados por el usuario e integrados en la base runtime de Estacion II.

Los archivos fueron copiados desde Descargas sin reexportar, optimizar, renombrar ni convertir formatos.

## Ruta runtime

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/
```

## Espejo obligatorio

Los mismos assets usados por la pantalla fueron copiados tambien a:

```text
public/assets/gvo/current-used/world-2-root/
```

Esto cumple `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`.

## Familias usadas

- `background/`: fondo base mobile.
- `atmosphere/`: haze y silueta botanica de primer plano.
- `plant/`: planta principal y aura viva.
- `signal/`: senal cruda, hilos, nodo y anillo de pulso.
- `route/`: captura, acondicionamiento, mapeo, resultado y ruta de mediacion.
- `dialogue/`: panel, glow, foco y cola visual del dialogo.
- `navigation/`: CTA y barra inferior de capas.
- `micro-scenes/`: burbuja lateral y reticula de captura.
- `lia-fx/`: halo, glow, wisps y trail para acompanar a Lia existente.

## Assets agregados en 015E

En `015E` se agregaron 7 assets curados para recomponer las capas 1-2 sin acumulacion visual:

- `dialogue/world2_dialogue_card_mobile_safe_v01.png`
- `plant/world2_plant_stage_anchor_v01.png`
- `signal/world2_signal_origin_contact_v01.png`
- `navigation/world2_layer_nav_token_base_v01.png`
- `navigation/world2_layer_nav_token_active_v01.png`
- `navigation/world2_layer_nav_connector_inactive_v01.png`
- `lia-fx/world2_lia_gesture_signal_spark_v01.png`

Los mismos 7 archivos fueron copiados byte-identicos al espejo obligatorio:

```text
public/assets/gvo/current-used/world-2-root/
```

## Assets deliberadamente no integrados en 015A

No se copiaron ni usaron estos assets generados como poses nuevas de Lia para W2:

- `world2_lia_idle_pose_world2_v01.png`
- `world2_lia_explain_pose_world2_v01.png`
- `world2_lia_invite_pose_world2_v01.png`

Motivo: el ticket exige reutilizar Lia 2.5D existente desde el repo y no duplicar ni alterar su identidad en esta pasada.

Tampoco se integraron assets no usados por la composicion base, como `world2_bioelectric_particle_field_v01.png` y `world2_intro_invisible_pulse_reveal_v01.png`, para evitar sobrecargar la escena inicial.

## Reglas

- No tratar estos archivos como referencias del Atlas.
- No mover ni borrar originales sin ticket.
- No cambiar imports runtime sin ticket.
- No producir assets nuevos dentro de esta carpeta.
- Mantener la organizacion por familia.
