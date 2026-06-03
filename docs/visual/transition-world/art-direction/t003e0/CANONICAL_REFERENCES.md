# Referencias canonicas para Transicion Mundo I: Raiz

## Resumen

El repo contiene referencias utiles, pero ninguna debe usarse directamente como asset final de transicion sin un ticket de integracion. La mejor referencia canonica de Lía es el paquete runtime de Portada / Intro. La mejor referencia de portal/glow es Portal I de Portada. La mejor referencia de motion breve y pixelart es Carga Inicial V13.

## Tabla de referencias

| Asset | Ruta | Formato | Dimensiones | Rol | Evaluacion | Uso sugerido | Riesgo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lía master portada | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png` | PNG | 941x1672, alpha | Identidad canonica | Mejor referencia de Lía | ChatGPT Images y Photopea | No es micro-rig; escala grande. |
| Lía idle portada | `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png` | PNG | 941x1672, alpha | Pose base | Canonica para silueta | Prompt y contact sheet | No usar directo en transicion por tamaño. |
| Lía point portal | `public/assets/runtime/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png` | PNG | 1024x1536, alpha | Gesto hacia portal | Referencia de intencion | Guide 2 frames | Riesgo de copiar pose demasiado grande. |
| Lía activate portal | `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png` | PNG | 941x1672, alpha | Activacion Portal I | Referencia de energia | Exit/guide frame | Pertenece a Portada, no runtime transicion. |
| Rig idle Lía | `public/assets/runtime/cover-intro/lia/rig/idle_v1/` | PNG por capa | 941x1672, alpha | Rig canonico por partes | Mejor fuente tecnica | Photopea y micro-rig derivado | Capas muy grandes; no optimizadas para 96/128px. |
| Portal I frame | `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png` | PNG | 941x1672, alpha | Portal habilitado | Mejor referencia portal/glow | ChatGPT Images y Photopea | Pertenece a Portada; no copiar como portal raiz final. |
| Portal I glow | `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png` | PNG | 941x1672, alpha | Brillo portal | Referencia de glow | Portal root glow | Puede saturar si se usa directo. |
| Fondo Portada | `public/assets/runtime/cover-intro/background/cover_bg_archivo_vivo_base_v1.png` | PNG | 941x1672, alpha | Atmosfera editorial | Referencia general | Fondo textless y paleta | No representa transicion raiz. |
| Referencia Portada | `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png` | PNG | 941x1672, sin alpha | Referencia visual | Canonica de composicion Portada | Contact sheet | Tiene contenido de Portada, no transicion. |
| Carga inicial Lia spritesheet | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png` | PNG | 2560x2560, alpha | Motion pixelart | Referencia de timing/frame registration | Analisis de suavidad | No usar como identidad de transicion. |
| Carga inicial halo | `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png` | PNG | 960x256, alpha | Halo suelo | Referencia de sutileza | Glow bajo si aplica | No es portal raiz. |
| Sparkles carga | `public/assets/runtime/loading-initial/sparkles/*.png` | PNG | 103-240px, alpha | Particulas | Referencia baja saturacion | Sparkles futuros | No saturar ni llenar pantalla. |
| Capturas T003D | `docs/visual/transition-world/validation/t003d/*.png` | PNG | 1073x2321 / 1183x2563 | Preview tecnico | Referencia negativa/parcial | Comparacion before/after | No usar como target final. |

## Mejor referencia de Lía existente

`public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png`

Complementar con:

- `public/assets/runtime/cover-intro/lia/rig/idle_v1/`
- `docs/03_IDENTIDAD_LIA.md`

## Mejor referencia de portal/glow existente

- `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png`
- `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png`

Uso: referencia de lenguaje visual, no copia directa para transicion.

## Mejor referencia pixelart/loading/cover

- `public/assets/runtime/loading-initial/lia/lia_loading_16f.png`
- `docs/visual/loading-initial/validation/v13/`
- `public/assets/runtime/cover-intro/lia/rig/idle_v1/`

Uso: entender micro-movimiento y registro, no reutilizar como sprite final.

## Assets que NO deben alimentar ChatGPT Images

- Capturas de QA que contienen textos DOM o UI (`docs/visual/cover-intro/qa/**`).
- Capturas T003D como target final, porque el usuario las califico 2.8/10.
- `public/assets/runtime/loading-initial-pre-portada.png`, porque mezcla pantalla completa y no es Lía canonica aislada.
- Assets de agua/planta de Carga Inicial para la transicion, porque pertenecen a otra escena.

## Assets utiles para contact sheet

- Lía master portada.
- Lía poses: idle, point, activate.
- Capas del rig idle V1.
- Portal I frame y glow.
- Referencia Portada.
- Capturas T003D solo como "no repetir".

## Referencia faltante

Se requiere que el usuario aporte o seleccione una Lía canonica antes de generar micro-rig si la referencia de Portada no se considera suficiente para esta transicion.
