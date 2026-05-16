# Reporte de normalización — Carga inicial GVO V1

Script de normalización:

`npm run assets:normalize:loading`

Script de validación:

`npm run assets:validate:loading`

Herramienta local usada: `sharp` como `devDependency`.

## Salidas generadas

| Asset                                     | Dimensión | Criterio aplicado                                                                     |
| ----------------------------------------- | --------: | ------------------------------------------------------------------------------------- |
| `lia_loading_16f.png`                     | 2560x2560 | Spritesheet 4x4, 16 frames, celdas 640x640, orden row-major.                          |
| `plant_growth_4f.png`                     |  3072x768 | Spritesheet 4x1, celdas 768x768, escala de canvas conservada para estabilizar maceta. |
| `water_flow_5f.png`                       |  5120x768 | Spritesheet 5x1, celdas 1024x768, arco preservado como overlay separado.              |
| `ground_halo_01_orbital_ring.png`         |   960x256 | Canvas horizontal recortado y normalizado para uso sutil bajo la maceta.              |
| `sparkle_01_lilac_small.png`              |   189x189 | Recorte de lienzo excesivo, transparencia preservada.                                 |
| `sparkle_02_amber_small.png`              |   187x186 | Recorte de lienzo excesivo, transparencia preservada.                                 |
| `sparkle_03_lilac_medium.png`             |   240x233 | Recorte de lienzo excesivo, transparencia preservada.                                 |
| `sparkle_04_micro_white.png`              |   103x100 | Recorte de lienzo excesivo, transparencia preservada.                                 |
| `loading_initial_master_reference_v2.png` |  941x1672 | Copia documental de referencia aprobada.                                              |

## Validaciones del script

`tools/validate_loading_initial_assets.mjs` comprueba:

- Existencia de PNG y JSON esperados.
- Dimensiones exactas de spritesheets.
- Formato PNG.
- Alpha visible para evitar salidas vacías.
- Metadata mínima: `asset_id`, `columns`, `rows`, `frame_width`, `frame_height`, `total_frames`, `frame_order`, `source_files`.
- Que `source_files` no apunte a portada, estaciones, final o transición.
- Que el componente no use `loading-initial-pre-portada.png`.
- Que el texto largo rechazado no esté en los archivos de carga inicial.

## Estado

Normalización lista para revisión visual. No equivale a aprobación final de pantalla.
