# Ticket 001I - Carga inicial solo maceta mas izquierda V8

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V8_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Objetivo

Mover solo la maceta/planta un poco mas hacia la izquierda, sin modificar Lía, regadera, agua, halo, sparkles, textos, barra, duracion normal ni reduced motion.

## Base

- Rama base: `feature/001H-carga-inicial-solo-maceta-izquierda-v7`.
- Commit base verificado: `349fee9 feat: shift initial loading plant left`.
- Rama de trabajo: `feature/001I-carga-inicial-solo-maceta-mas-izquierda-v8`.

## Cambio aplicado

- Valor anterior de `--loading-plant-x`: `32%`.
- Valor nuevo de `--loading-plant-x`: `30%`.
- `--loading-plant-bottom` no cambia: se conserva en `-12px` para viewport base.
- Equivalentes responsive horizontales:
  - `max-width: 374px`: plant x pasa de `32%` a `30%`.
  - `max-height: 690px`: plant x pasa de `32%` a `30%`.

## Elementos no modificados

- Lía: sin cambios.
- Regadera: sin cambios.
- Agua: sin cambios de origen, target, streams, timing, ancho, rotacion ni asset.
- Halo: sin cambios.
- Sparkles: sin cambios.
- Textos: sin cambios.
- Barra: sin cambios.
- Timeline normal: conserva 12000ms.
- Reduced motion: conserva 1300ms.

## Capturas V8

Generadas en `docs/visual/loading-initial/validation/v8/`:

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

La V8 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
