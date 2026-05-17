# Ticket 001J - Carga inicial motion UI polish V9

Fecha: 2026-05-17

Estado al cierre: `ANIMACION_V9_POLISH_UI_MOTION / EN_REVISION_VISUAL`.

## Objetivo

Refinar la animacion V8 para que la carga inicial se sienta mas natural y profesional mediante motion design y polish de UI, sin mover la composicion aprobada ni crear nuevos assets.

## Base

- Rama base: `feature/001I-carga-inicial-solo-maceta-mas-izquierda-v8`.
- Commit base verificado: `c97565e feat: shift initial loading plant further left`.
- Rama de trabajo: `feature/001J-carga-inicial-motion-ui-polish-v9`.

## Cambios de motion

- Entrada lateral de Lía refinada con easing mas suave y asentamiento leve antes de la posicion final.
- Flotacion de Lía desacelerada y suavizada con desplazamiento vertical pequeño y rotacion minima.
- Sprite de Lía conserva el timeline de filas existente y suma un brillo muy sutil durante la fase de observacion.
- Planta conserva posicion y escala global, pero sus estados ahora cruzan con fades mas organicos despues de los pulsos de riego.
- Agua conserva origen, destino, streams y geometria V8; se ajusta ventana de opacidad para tres pulsos mas suaves.
- Sparkles conservan posiciones V8 y respiran con opacidad/escala mas delicadas.

## Cambios de UI

- Textos visibles conservados exactamente:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- Texto con sombra lavanda/blanca mas sutil y fade inicial discreto.
- Barra de carga mas fina, centrada, sin porcentaje ni numeros.
- Relleno de barra con gradiente ambar/lavanda y marcador minimo tipo pixel.

## Composicion preservada

No se modificaron valores de posicion aprobados:

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

## Duracion

- Timeline normal: `12000ms`.
- Reduced motion: `1300ms`.
- Sin navegacion automatica a portada.

## Capturas V9

Generadas en `docs/visual/loading-initial/validation/v9/`.

Set esperado:

- `mobile_360x640_start.png`
- `mobile_360x640_mid.png`
- `mobile_360x640_end.png`
- `mobile_390x844_t0.png`
- `mobile_390x844_t3.png`
- `mobile_390x844_t6.png`
- `mobile_390x844_t9.png`
- `mobile_390x844_t11.png`
- `mobile_430x932_mid.png`
- `reduced_motion_390x844.png`

## Pruebas de cierre

- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

No se ejecuta normalizacion de assets porque este ticket no toca ni regenera assets runtime.

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video.
- No se usan recursos externos ni CDN.
- No se instalan dependencias de animacion nuevas.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V9 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
