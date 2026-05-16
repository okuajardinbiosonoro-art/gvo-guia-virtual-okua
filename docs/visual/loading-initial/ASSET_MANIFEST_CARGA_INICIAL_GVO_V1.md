# Manifiesto de assets — Carga inicial GVO V1

Fuente local usada:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\carga_inicial_v2`

Solo se usaron assets de `carga_inicial_v2`. No se usaron assets de portada, estaciones, final ni transición.

## Referencia visual

| Uso                                    | Archivo                                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| Referencia visual aprobada documentada | `assets/reference/screens/loading-initial/loading_initial_master_reference_v2.png` |

## Runtime normalizado

| Grupo                  | Archivo runtime                                                                | Metadata                                                           |
| ---------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Lía                    | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png`                | `public/assets/runtime/loading-initial/lia/lia_loading_16f.json`   |
| Planta                 | `public/assets/runtime/loading-initial/plant/plant_growth_4f.png`              | `public/assets/runtime/loading-initial/plant/plant_growth_4f.json` |
| Agua                   | `public/assets/runtime/loading-initial/water/water_flow_5f.png`                | `public/assets/runtime/loading-initial/water/water_flow_5f.json`   |
| Halo                   | `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png` | No aplica                                                          |
| Destello lila pequeño  | `public/assets/runtime/loading-initial/sparkles/sparkle_01_lilac_small.png`    | No aplica                                                          |
| Destello ámbar pequeño | `public/assets/runtime/loading-initial/sparkles/sparkle_02_amber_small.png`    | No aplica                                                          |
| Destello lila medio    | `public/assets/runtime/loading-initial/sparkles/sparkle_03_lilac_medium.png`   | No aplica                                                          |
| Destello micro blanco  | `public/assets/runtime/loading-initial/sparkles/sparkle_04_micro_white.png`    | No aplica                                                          |

## Fuentes declaradas en metadata

Lía:

- `03_sprites_editables/lia_anim_rows/lia_anim_row_01_entry_idle_4frames.png`
- `03_sprites_editables/lia_anim_rows/lia_anim_row_02_prepare_watering_4frames.png`
- `03_sprites_editables/lia_anim_rows/lia_anim_row_03_watering_motion_4frames.png`
- `03_sprites_editables/lia_anim_rows/lia_anim_row_04_observe_glow_4frames.png`

Planta:

- `02_aprobadas/plant/plant_state_01_brote_minimo.png`
- `02_aprobadas/plant/plant_state_02_dos_hojas.png`
- `02_aprobadas/plant/plant_state_03_crecimiento_sutil.png`
- `02_aprobadas/plant/plant_state_04_plantita_sana.png`

Agua:

- `02_aprobadas/water/water_flow_01_start.png`
- `02_aprobadas/water/water_flow_02_soft_arc.png`
- `02_aprobadas/water/water_flow_03_medium_arc.png`
- `02_aprobadas/water/water_flow_04_full_arc.png`
- `02_aprobadas/water/water_flow_05_taper_end.png`

## Reglas cumplidas

- Assets runtime locales en `public/assets/runtime/loading-initial/`.
- No hay CDN ni recursos remotos.
- No hay audio ni video.
- La pantalla usa spritesheets normalizados, no la imagen cruda pre-portada.
- La referencia visual queda documentada, no usada como única imagen runtime animada.
