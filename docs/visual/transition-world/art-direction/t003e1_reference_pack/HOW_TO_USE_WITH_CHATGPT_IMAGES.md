# Cómo usar este paquete con ChatGPT Images

## Regla central

No usar la captura T003D como referencia principal. T003D fue calificada `2.8/10`; solo sirve como recordatorio de lo que no basta.

## Ronda 1 - Lía master

Objetivo: generar 3 candidatos de Lía master para transición.

Adjuntar:

- `00_lia_canonical/lia_canonical_primary.png`
- `00_lia_canonical/lia_canonical_cover_pose_idle.png`
- opcional: `00_lia_canonical/lia_canonical_cover_pose_point_portal.png`

No adjuntar:

- `04_transition_current_negative/*`
- capturas con diálogos;
- capturas con UI final;
- assets con texto.

Prompt:

`05_prompts_ready_to_use/01_LIA_MASTER_PIXELART_PROMPT.md`

Guardar resultados como:

- `lia_master_candidate_A.png`
- `lia_master_candidate_B.png`
- `lia_master_candidate_C.png`

## Ronda 2 - Micro-rig desde Lía master aprobada

Objetivo: generar idle 4 frames y guide 2 frames solo después de aprobar una Lía master.

Adjuntar:

- Lía master aprobada;
- opcional: `01_lia_rig_existing/` como referencia de partes.

Prompts:

- `05_prompts_ready_to_use/02_LIA_IDLE_4F_PROMPT.md`
- `05_prompts_ready_to_use/03_LIA_GUIDE_2F_PROMPT.md`
- `05_prompts_ready_to_use/04_LIA_EXIT_PROMPT.md`

## Ronda 3 - Portal master

Objetivo: generar portal raíz final.

Adjuntar:

- `02_portal_existing/portal_cover_frame_reference.png`
- `02_portal_existing/portal_cover_glow_reference.png`
- opcional: `03_style_references_loading_cover/cover_intro_reference_01.png`

Prompt:

`05_prompts_ready_to_use/05_PORTAL_ROOT_MASTER_PROMPT.md`

## Ronda 4 - Estados de portal

Objetivo: inactive, activating y open.

Adjuntar:

- portal master aprobado.

Prompt:

`05_prompts_ready_to_use/06_PORTAL_ROOT_STATES_PROMPT.md`

## Ronda 5 - Fondo y mockup sin texto

Objetivo: crear atmósfera y composición sin UI incrustada.

Adjuntar:

- Lía master aprobada;
- portal master aprobado;
- `03_style_references_loading_cover/cover_background_reference_01.png`.

Prompts:

- `05_prompts_ready_to_use/08_BACKGROUND_ATMOSPHERE_PROMPT.md`
- `05_prompts_ready_to_use/09_TEXTLESS_REFERENCE_MOCKUP_PROMPT.md`

## Después de ChatGPT Images

Pasar por Photopea:

- limpiar bordes;
- normalizar canvas;
- separar capas;
- crear contact sheet;
- exportar PNG/WebP/SVG según corresponda.

Usar:

- `06_photopea_next_steps/PHOTOPEA_CLEANUP_NEXT_STEPS.md`
- `06_photopea_next_steps/CONTACT_SHEET_TEMPLATE_REQUIREMENTS.md`
