# Ticket 001L - Carga inicial escala UI motion smooth V11

Fecha: 2026-05-17

Estado al cierre: `ANIMACION_V11_ESCALA_UI_MOTION_SMOOTH / EN_REVISION_VISUAL`.

## Objetivo

Refinar de forma acotada la V10 reduciendo la escala visual del conjunto animado, limpiando la barra de carga y suavizando la direccion de movimiento sin crear nuevos assets ni tocar portada.

## Base

- Rama base: `feature/001K-carga-inicial-pixel-font-motion-director-v10`.
- Commit base verificado: `e61a69c feat: refine loading pixel typography and motion`.
- Rama de trabajo: `feature/001L-carga-inicial-escala-ui-motion-smooth-v11`.

## Cambios de escala visual

- Se agrega `--loading-visual-scale: 0.9`.
- La escala se aplica solo al escenario visual principal (`loading-initial__scene`), con origen inferior centrado.
- Textos y barra quedan fuera de esa escala para conservar legibilidad.

## Cambios de barra

- Se separan visualmente caps, track, fill y marcador.
- El track queda en `--loading-progress-track-height: 2px`.
- Los rombos quedan fuera del tramo visible del track mediante padding interno.
- El fill sigue usando gradiente ambar/lavanda y no muestra porcentaje ni numeros.

## Cambios de texto

- Se conserva Pixelify Sans local.
- Se mantienen los textos exactos:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- Se baja ligeramente peso/tamano y se suaviza la respiracion de opacidad.

## Cambios de motion

- La flotacion de Lía pasa a un ciclo mas lento.
- La pose de riego reduce micro-rotaciones para evitar brusquedad.
- El agua conserva origen/destino y tres streams, con opacidades mas delicadas.
- La planta conserva posicion y usa crossfades mas suaves.
- Los sparkles conservan posiciones/frecuencia y bajan intensidad visual.

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

## Capturas y video V11

Generados en `docs/visual/loading-initial/validation/v11/`.

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
- `loading_initial_v11_mobile.mp4`

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
- No se instalan dependencias nuevas.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V11 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
