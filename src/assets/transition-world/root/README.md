# TransitionWorld Root Asset Staging

Estado: `ASSETS_INGESTED_T003E2 / APPROVED_RUNTIME_READY`

Esta carpeta contiene el intake aprobado de assets para la transicion Portada / Intro -> Mundo I: Raiz. T003E2 copia PNG/WebP aprobados, actualiza manifest y agrega validacion tecnica. La pantalla `/dev/transition-world` todavia no los usa visualmente.

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

## Direccion artistica T003E0

El paquete canonico para producir y revisar assets reales vive en:

`docs/visual/transition-world/art-direction/t003e0/`

T003E0 no aprueba assets ni integra runtime. Solo documenta referencias, prompts, pipeline Photopea, checklist, micro-rig, portal y coreografia futura.

## Runtime aprobado T003E2

Estructura:

- `runtime/lia/`
- `runtime/portal/`
- `runtime/background/`
- `runtime/progress/`
- `runtime/validation/`

Validacion:

```powershell
npm run validate:transition-root-assets
```

Notas:

- No se copian PSD al runtime.
- No se copia `transition_root_progress_review_board_v1.*` al runtime.
- El simbolo raiz aprobado mide `256x256`.
- El progress fill aprobado mide `1152x96`.
