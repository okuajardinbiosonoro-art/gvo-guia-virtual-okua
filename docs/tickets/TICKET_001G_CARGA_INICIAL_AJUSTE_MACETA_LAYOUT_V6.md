# Ticket 001G - Carga inicial ajuste maceta layout V6

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V6_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Objetivo

Realizar un ajuste visual fino y acotado sobre la V5 de carga inicial, moviendo solo la maceta/planta mas hacia la izquierda y mas abajo para que se perciba mejor asentada sobre el halo.

## Base

- Rama base: `feature/001F-carga-inicial-layout-halo-centrado-v5`.
- Commit base verificado: `9579565 feat: center initial loading layout and halo`.
- Rama de trabajo: `feature/001G-carga-inicial-ajuste-maceta-layout-v6`.

## Valores V5 iniciales

- `--loading-plant-x: 38%`
- `--loading-plant-bottom: -4px`
- `--loading-halo-x: 50%`
- `--loading-halo-width: min(104%, 430px)`
- `--loading-halo-scale-x: 1.14`
- `--loading-halo-bottom: -6px`
- `--loading-lia-final-x: 65%`
- `--loading-lia-final-bottom: 168px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 80%`
- `--loading-water-target-x: -15%`
- `--loading-water-target-y: 78%`

## Valores V6 finales

- `--loading-plant-x: 35%`
- `--loading-plant-bottom: -12px`
- `max-width: 374px`: plant x 34%, plant bottom -12px.
- `max-height: 690px`: plant x 35%, plant bottom -14px.

Sin cambios respecto a V5:

- `--loading-halo-x: 50%`
- `--loading-halo-width: min(104%, 430px)`
- `--loading-halo-scale-x: 1.14`
- `--loading-halo-bottom: -6px`
- `--loading-lia-final-x: 65%`
- `--loading-lia-final-bottom: 168px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 80%`
- `--loading-water-target-x: -15%`
- `--loading-water-target-y: 78%`

## Confirmacion de alcance

Solo se ajusto la posicion de maceta/planta y el atributo de version de layout (`data-loading-layout-version="v6"`).

No se tocaron:

- Assets runtime PNG/JSON.
- Lía ni su posicion final.
- Regadera.
- Origen del agua.
- Target del agua.
- Cantidad de streams.
- Timing del agua.
- Halo.
- Sparkles.
- Textos.
- Barra.
- Rutas.
- Timeline normal de 12000ms.
- Reduced motion de 1300ms.

## Capturas V6

Generadas en `docs/visual/loading-initial/validation/v6/`:

- `mobile_360x640_start.png`
- `mobile_360x640_mid.png`
- `mobile_360x640_end.png`
- `mobile_390x844_start.png`
- `mobile_390x844_mid.png`
- `mobile_390x844_end.png`
- `mobile_430x932_start.png`
- `mobile_430x932_mid.png`
- `mobile_430x932_end.png`

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
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V6 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
