# TransitionWorld Root Asset Staging

Estado: `STAGING_T003D / PENDING_ASSETS`

Esta carpeta prepara el intake de assets para la transicion Portada / Intro -> Mundo I: Raiz. T003D no integra PNG, WebP ni SVG finales: solo deja manifest y criterios para que la siguiente fase pueda trabajar con archivos aprobados.

## Assets Esperados

- `lia_transition_root_idle_4f`
- `lia_transition_root_guide_2f`
- `lia_transition_root_exit_1f`
- `lia_transition_root_blink_1f` opcional
- `portal_root_base`
- `portal_root_glow`
- `symbol_root`
- `transition_root_review_capture_390x844`
- `transition_root_review_capture_430x932`

## Criterios de Aprobacion

- Sin texto incrustado.
- Sin fondo no deseado.
- Sin CDN ni recursos externos.
- Sin apariencia 3D pegada.
- Lía debe mantener cinco petalos, visor opalescente, ojos media luna, collar ambar y bulbo inferior.
- Lía no debe tener brazos, manos, piernas, pies, nariz, boca, cejas ni rasgos humanos extra.
- Portal debe ser vertical, luminoso, pixelart, con borde lavanda/dorado y simbolo raiz minimo.

## Micro-rig de Lía

No se necesita rig completo para la transicion. La recomendacion para T003E/T003F es un micro-rig pixelart:

- idle: 4 frames;
- guide/point: 2 frames;
- exit: 1 frame;
- blink: 1 frame opcional.

Hasta que esos assets esten aprobados, `TransitionWorld` usa un fallback SVG inline local.
