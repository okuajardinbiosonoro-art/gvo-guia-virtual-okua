# T003E1A - Reference pack ready para ChatGPT Images

## 1. Resumen

Se creó un paquete exportable de referencias canónicas para producir assets reales de la transición `Portada / Intro -> Mundo I: Raíz` con ChatGPT Images y Photopea.

Este ticket no implementa animación, no integra assets runtime y no modifica la pantalla `/dev/transition-world`.

## 2. Rama base y rama final

- Rama base: `feature/003E0-transition-world-art-direction-pack`
- Commit base: `6832c48 docs: add transition world art direction pack`
- Rama final: `feature/003E1A-transition-world-reference-pack`

## 3. Referencias copiadas

### Lía

- `00_lia_canonical/lia_canonical_primary.png`
- `00_lia_canonical/lia_canonical_cover_pose_idle.png`
- `00_lia_canonical/lia_canonical_cover_pose_point_portal.png`
- `00_lia_canonical/lia_canonical_cover_pose_activate_portal.png`
- `00_lia_canonical/lia_canonical_cover_pose_explain_calm.png`
- capas del rig existente en `01_lia_rig_existing/`

### Portal

- `02_portal_existing/portal_cover_frame_reference.png`
- `02_portal_existing/portal_cover_glow_reference.png`
- `02_portal_existing/portal_locked_frame_context.png`

### Estilo

- `03_style_references_loading_cover/cover_intro_reference_01.png`
- `03_style_references_loading_cover/cover_background_reference_01.png`
- `03_style_references_loading_cover/loading_style_reference_master.png`
- `03_style_references_loading_cover/loading_v13_motion_reference_390x844.png`
- `03_style_references_loading_cover/loading_lia_spritesheet_motion_reference.png`

### Negativas/parciales

- `04_transition_current_negative/transition_current_t003d_negative_390x844.png`
- `04_transition_current_negative/transition_current_t003d_negative_430x932.png`

## 4. Referencias faltantes

- Lía master específica de transición raíz.
- Micro-rig idle 4f.
- Micro-rig guide 2f.
- Portal raíz final.
- Portal states.
- Fondo textless específico.
- Contact sheet aprobado.

## 5. Qué adjuntar en ChatGPT Images

Primera ronda:

- `00_lia_canonical/lia_canonical_primary.png`
- `00_lia_canonical/lia_canonical_cover_pose_idle.png`
- opcional: `00_lia_canonical/lia_canonical_cover_pose_point_portal.png`

## 6. Qué NO adjuntar

- Capturas T003D como referencia principal.
- Capturas con textos DOM.
- Capturas con diálogos, botones o UI final.
- Assets con letras falsas.

## 7. Prompts preparados

Se crearon 9 prompts separados en `05_prompts_ready_to_use/`.

El primer prompt a usar:

`01_LIA_MASTER_PIXELART_PROMPT.md`

## 8. Siguiente paso

Generar 3 candidatos de Lía master:

- `lia_master_candidate_A.png`
- `lia_master_candidate_B.png`
- `lia_master_candidate_C.png`

Después, revisar en Photopea y armar contact sheet antes de cualquier integración.

## 9. Validaciones ejecutadas

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
```

`test:e2e` se omitió porque no se modificó runtime, rutas ni componentes.

## 10. Estado final

`REFERENCE_PACK_T003E1A_READY / NO_RUNTIME_CHANGES / READY_FOR_CHATGPT_IMAGES`
