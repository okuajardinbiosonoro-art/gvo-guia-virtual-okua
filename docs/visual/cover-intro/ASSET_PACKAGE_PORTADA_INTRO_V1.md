# Asset package - Portada / Intro V1

Pantalla: `PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

Estado: `ASSETS_STAGED / NO_IMPLEMENTADA`

Fecha: 2026-05-28

## Objetivo

Registrar el paquete de assets aprobados que fue copiado al runtime del repo para preparar la futura implementación funcional de Portada / Intro.

Este paquete no implementa la pantalla. Solo deja assets locales, trazables y validables.

## Origen local

Ruta fuente:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada_intro_v1\02_aprobadas`

No se modificaron los assets fuente locales.

## Destino runtime

Ruta en repo:

`public/assets/runtime/cover-intro/`

Manifest:

`public/assets/runtime/cover-intro/manifest.json`

## Assets copiados

### Fondo

| Estado             | Runtime                                        |
| ------------------ | ---------------------------------------------- |
| `RUNTIME_SELECTED` | `background/cover_bg_archivo_vivo_base_v1.png` |

### Lía - poses completas

| Estado             | Runtime                                       |
| ------------------ | --------------------------------------------- |
| `RUNTIME_SELECTED` | `lia/poses/lia_pose_idle_v1.png`              |
| `RUNTIME_SELECTED` | `lia/poses/lia_pose_greeting_v1.png`          |
| `RUNTIME_SELECTED` | `lia/poses/lia_pose_explain_calm_v1.png`      |
| `RUNTIME_SELECTED` | `lia/poses/lia_pose_point_portal_1_v1.png`    |
| `RUNTIME_SELECTED` | `lia/poses/lia_pose_activate_portal_1_v1.png` |

### Lía - referencia maestra

| Estado              | Runtime                                           |
| ------------------- | ------------------------------------------------- |
| `RUNTIME_REFERENCE` | `lia/reference/lia_master_cover_reference_v1.png` |

### Lía - rig idle V1

| Estado             | Runtime                                                  |
| ------------------ | -------------------------------------------------------- |
| `RUNTIME_OPTIONAL` | `lia/rig/idle_v1/lia_rig_shadow_soft_v1.png`             |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_body_bulb_segmented_v1.png`     |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_petal_left_lower_v1.png`        |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_petal_right_lower_v1.png`       |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_petal_left_upper_v1.png`        |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_petal_right_upper_v1.png`       |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_petal_top_v1.png`               |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_collar_amber_v1.png`            |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_glow_collar_v1.png`             |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_head_opal_clean_v1.png`         |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png`   |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_blink_25_v1.png`  |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png`  |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png`    |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_happy_v1.png`     |
| `RUNTIME_SELECTED` | `lia/rig/idle_v1/lia_rig_eyes_crescent_attentive_v1.png` |

`lia_rig_shadow_soft_v1.png` se copió por trazabilidad, pero queda marcado como opcional. La futura implementación puede no usarlo si visualmente no funciona.

### Portal I

| Estado             | Runtime                                                |
| ------------------ | ------------------------------------------------------ |
| `RUNTIME_SELECTED` | `portals/portal_1/frame/portal_1_frame_enabled_v1.png` |
| `RUNTIME_SELECTED` | `portals/portal_1/glow/portal_1_glow_enabled_v1.png`   |

### Portales II-V

| Estado                    | Runtime                                                |
| ------------------------- | ------------------------------------------------------ |
| `RUNTIME_SELECTED_SHARED` | `portals/shared/frame/portal_locked_frame_base_v1.png` |

Decisión: Portales II, III, IV y V deben usar `portal_locked_frame_base_v1.png` en la primera implementación por consistencia visual, escala y control de layout.

### Candado

| Estado             | Runtime                       |
| ------------------ | ----------------------------- |
| `RUNTIME_SELECTED` | `locks/lock_soft_gold_v1.png` |

## Assets aprobados no seleccionados como runtime principal

Estos assets pueden existir localmente, pero no fueron copiados como runtime principal:

- `portal_3_frame_locked_v1.png`
- `portal_4_frame_locked_v1.png`
- `portal_5_frame_locked_v1.png`

Estado documental:

`APPROVED_SOURCE / NOT_RUNTIME_SELECTED`

Motivo:

Se decidió usar `portal_locked_frame_base_v1.png` para Portales II-V por consistencia visual, escala y control de implementación.

## Decisiones de implementación futura

- Textos como HTML/CSS.
- Números romanos como HTML/CSS.
- Botón `Comenzar recorrido` como HTML/CSS.
- Diálogos de Lía como HTML/CSS accesible.
- Portales II-V bloqueados con frame compartido y candado.
- Interiores de portales diferidos.
- Ningún asset de este paquete debe cargar recursos externos.

## Validación

El paquete se valida con:

```powershell
npm run validate:cover-intro-assets
```

El script lee `manifest.json`, recorre rutas runtime, valida existencia, formato PNG, dimensiones por cabecera IHDR y peso.
