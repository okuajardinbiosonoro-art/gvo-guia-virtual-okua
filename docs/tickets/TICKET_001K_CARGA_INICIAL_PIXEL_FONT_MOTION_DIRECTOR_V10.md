# Ticket 001K - Carga inicial pixel font motion director V10

Fecha: 2026-05-17

Estado al cierre: `ANIMACION_V10_PIXEL_UI_MOTION_DIRECTOR / EN_REVISION_VISUAL`.

## Objetivo

Elevar la calidad percibida de la carga inicial con tipografia pixelart local, barra mas fina y direccion de motion mas clara, sin mover la composicion aprobada ni crear assets nuevos.

## Base

- Rama base: `feature/001J-carga-inicial-motion-ui-polish-v9`.
- Commit base verificado: `2fe086e feat: polish initial loading motion and ui`.
- Rama de trabajo: `feature/001K-carga-inicial-pixel-font-motion-director-v10`.

## Dependencia agregada

- `@fontsource-variable/pixelify-sans`

La fuente se importa desde npm local en `src/main.tsx`. No usa CDN ni Google Fonts remoto en runtime.

## Cambios de tipografia

- Titulo y subtitulo usan `Pixelify Sans Variable`.
- Se conservan exactamente los textos visibles:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- Se mantienen animaciones sutiles de entrada y respiracion, sin mensajes rotativos.

## Cambios de barra

- Barra mas fina, de 4px de alto visual.
- Track lavanda con extremos tipo rombo/pixel por CSS.
- Relleno ambar/lavanda con `transform: scaleX(...)` sincronizado a 12000ms.
- Marcador pixelado minimo, sin porcentaje ni numeros.

## Cambios de motion

- Se agrega capa `loading-initial__lia-pose` entre bob y sprite para micro-inclinacion controlada.
- Entrada de Lía conserva posicion final y usa easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Flotacion de Lía se vuelve mas lenta.
- Sprite de Lía conserva `steps()` y organiza las fases como entrada, preparacion, riego, observacion y cierre.

## Agua, planta y sparkles

- Agua conserva tres streams, origen y destino base V9/V8.
- Los delays de streams se ajustan para que se perciban mas organicos.
- El agua aparece solo en la ventana de riego aproximada de 5.2s a 8.2s.
- Planta conserva posicion y usa crossfades mas tardios y suaves.
- Sparkles conservan posiciones y cantidad, con respiracion de opacidad/escala mas perceptible pero discreta.

## Composicion preservada

No se modificaron los valores base aprobados:

- `--loading-plant-x: 30%`
- `--loading-plant-bottom: -12px`
- `--loading-halo-x: 50%`
- `--loading-halo-bottom: -6px`
- `--loading-lia-final-x: 65%`
- `--loading-lia-final-bottom: 168px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 80%`
- `--loading-water-target-x: -15%`
- `--loading-water-target-y: 78%`

## Capturas y video V10

Generados en `docs/visual/loading-initial/validation/v10/`.

Set esperado:

- `mobile_360x640_start.png`
- `mobile_360x640_mid.png`
- `mobile_360x640_end.png`
- `mobile_390x844_t0.png`
- `mobile_390x844_t3.png`
- `mobile_390x844_t6.png`
- `mobile_390x844_t9.png`
- `mobile_390x844_t11.png`
- `mobile_430x932_t0.png`
- `mobile_430x932_t6.png`
- `mobile_430x932_t11.png`
- `reduced_motion_390x844.png`
- `loading_initial_v10_mobile.mp4`

## Pruebas de cierre

- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

No se ejecuta normalizacion de assets porque este ticket no toca ni regenera PNG/JSON runtime.

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video runtime.
- No se usan recursos externos ni CDN.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V10 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
