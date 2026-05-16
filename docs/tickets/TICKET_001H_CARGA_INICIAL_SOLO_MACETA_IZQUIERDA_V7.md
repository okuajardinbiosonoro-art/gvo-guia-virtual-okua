# Ticket 001H - Carga inicial solo maceta izquierda V7

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V7_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Objetivo

Aplicar un ajuste visual minimo, controlado y reversible: mover unicamente la maceta/planta mas hacia la izquierda, conservando intactos Lía, regadera, agua, halo, sparkles, textos, barra, duracion normal y reduced motion.

## Base

- Rama base: `feature/001G-carga-inicial-ajuste-maceta-layout-v6`.
- Commit base verificado: `8fb0a80 feat: tune initial loading plant placement`.
- Rama de trabajo: `feature/001H-carga-inicial-solo-maceta-izquierda-v7`.

## Cambio de composicion

- Valor anterior de `--loading-plant-x`: `35%`.
- Valor nuevo de `--loading-plant-x`: `32%`.
- `--loading-plant-bottom` no cambia: se conserva en `-12px` para viewport base.
- Equivalentes responsive horizontales:
  - `max-width: 374px`: plant x pasa de `34%` a `32%`.
  - `max-height: 690px`: plant x pasa de `35%` a `32%`.
- Los valores responsive de `plantBottom` se conservan como en V6.

## Elementos no modificados

- Lía: sin cambios de posición ni sprites.
- Regadera: sin cambios.
- Agua: sin cambios de origen, target, streams, timing ni asset.
- Halo: sin cambios de posición, ancho, escala, opacidad ni respiración.
- Sparkles: sin cambios de cantidad, posición ni animación.
- Textos: sin cambios.
- Barra: sin cambios.
- Timeline normal: conserva 12000ms.
- Reduced motion: conserva 1300ms.

## Capturas V7

Generadas en `docs/visual/loading-initial/validation/v7/`:

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

La V7 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
