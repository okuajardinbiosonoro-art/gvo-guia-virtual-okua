# Índice del reference pack T003E1A

Prioridades:

- `P0`: usar siempre como referencia.
- `P1`: usar si ayuda.
- `P2`: solo contexto.
- `N`: referencia negativa/no usar para generación principal.

| Archivo | Carpeta | Tipo | Origen | Uso recomendado | Riesgo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| `lia_canonical_primary.png` | `00_lia_canonical` | Lía master | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png` | Referencia principal para Lía master | Escala grande, no micro-rig | P0 |
| `lia_canonical_cover_pose_idle.png` | `00_lia_canonical` | Pose Lía | `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png` | Silueta y proporción | No usar directo como transición | P0 |
| `lia_canonical_cover_pose_point_portal.png` | `00_lia_canonical` | Pose Lía | `public/assets/runtime/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png` | Intención de guía | Puede llevar a gesto demasiado literal | P1 |
| `lia_canonical_cover_pose_activate_portal.png` | `00_lia_canonical` | Pose Lía | `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png` | Energía de activación | Pertenece a Portada | P1 |
| `lia_canonical_cover_pose_explain_calm.png` | `00_lia_canonical` | Pose Lía | `public/assets/runtime/cover-intro/lia/poses/lia_pose_explain_calm_v1.png` | Calma visual | No es pose de transición | P1 |
| `lia_rig_*.png` | `01_lia_rig_existing` | Capas rig | `public/assets/runtime/cover-intro/lia/rig/idle_v1/` | Consistencia de pétalos, ojos, collar y bulbo | Canvas grande; requiere Photopea | P0 |
| `portal_cover_frame_reference.png` | `02_portal_existing` | Portal frame | `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png` | Lenguaje visual del portal | No es portal raíz final | P0 |
| `portal_cover_glow_reference.png` | `02_portal_existing` | Glow portal | `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png` | Referencia de brillo | Puede saturar si se copia | P1 |
| `portal_locked_frame_context.png` | `02_portal_existing` | Portal bloqueado | `public/assets/runtime/cover-intro/portals/shared/frame/portal_locked_frame_base_v1.png` | Contexto de sistema de portales | No usar para portal raíz abierto | P2 |
| `cover_intro_reference_01.png` | `03_style_references_loading_cover` | Referencia pantalla | `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png` | Dirección editorial/orgánica | Tiene composición de Portada, no transición | P1 |
| `cover_background_reference_01.png` | `03_style_references_loading_cover` | Fondo | `public/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png` | Paleta y atmósfera | No representa raíz | P1 |
| `loading_style_reference_master.png` | `03_style_references_loading_cover` | Referencia pantalla | `assets/reference/screens/loading-initial/loading_initial_master_reference_v2.png` | Lenguaje pixelart suave | No copiar composición | P2 |
| `loading_v13_motion_reference_390x844.png` | `03_style_references_loading_cover` | Captura QA | `docs/visual/loading-initial/validation/v13/mobile_390x844_mid.png` | Motion/staging | Screenshot con UI completa | P2 |
| `loading_lia_spritesheet_motion_reference.png` | `03_style_references_loading_cover` | Spritesheet | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png` | Timing/frame registration | No usar como identidad final | P2 |
| `transition_current_t003d_negative_390x844.png` | `04_transition_current_negative` | Captura negativa | `docs/visual/transition-world/validation/t003d/transition-world-t003d-390x844.png` | Recordar qué no basta | No usar como target ni prompt principal | N |
| `transition_current_t003d_negative_430x932.png` | `04_transition_current_negative` | Captura negativa | `docs/visual/transition-world/validation/t003d/transition-world-t003d-430x932.png` | Recordar qué no basta | No usar como target ni prompt principal | N |

## Faltantes

- `lia_transition_root_master.png`
- `lia_transition_root_idle_4f.png`
- `lia_transition_root_guide_2f.png`
- `portal_root_base.svg/png`
- `portal_root_glow.svg/png`
- `transition_root_contact_sheet_v1.png`
