# Ticket 001N - Carga inicial frame registration timeline V13

Fecha: 2026-05-17

Estado al cierre: `ANIMACION_V13_FRAME_REGISTRATION / EN_REVISION_VISUAL`.

## Objetivo

Refinar tecnicamente la animacion de Lía para reducir la sensacion de saltos entre sprites y mejorar la sincronizacion entre gesto, agua, planta y cierre, sin crear assets nuevos ni mover el layout aprobado.

## Base

- Rama base: `feature/001M-carga-inicial-barra-pixelart-v12`.
- Commit base verificado: `2d6508c feat: refine initial loading pixel progress bar`.
- Rama de trabajo: `feature/001N-carga-inicial-frame-registration-timeline-v13`.

## Problema abordado

La V12 ya tenia composicion, tipografia y barra en buen nivel, pero Lía todavia podia sentirse como una capa PNG con cambios bruscos. La V13 introduce un registro visual de frames para estabilizar la lectura del visor/collar y un timeline explicito con holds mas claros.

## Frame registration V13

- Archivo: `src/screens/LoadingInitial/liaFrameRegistration.ts`.
- Version: `v13`.
- Ancla visual: `visor-collar`.
- Frames registrados: 16.
- Correcciones aplicadas por CSS variables:
  - `xPx` y `yPx` maximos de pocos pixeles.
  - `scale` entre `0.998` y `1.002`.
  - `rotateDeg` minimo, sin deformar identidad de Lía.
- Aplicacion visual: capa `.loading-initial__lia-registration` con `loading-lia-frame-registration-v13`.
- No se edito ni regenero el spritesheet.

## Timeline dirigido V13

- Archivo: `src/screens/LoadingInitial/loadingInitialMotionTimeline.ts`.
- Duracion normal: `12000ms`.
- Reduced motion: `1300ms`.
- Fases:
  - `initial_enter`: 0ms-900ms.
  - `lia_entry_idle`: 900ms-3100ms.
  - `lia_settle_hold`: 3100ms-4200ms.
  - `lia_prepare_watering`: 4200ms-5200ms.
  - `lia_watering`: 5200ms-8200ms.
  - `observe_settle`: 8200ms-10100ms.
  - `final_hold`: 10100ms-12000ms.

## Cambios de timing

- La entrada de Lía conserva posicion final, pero llega con una curva y asentamiento mas suave.
- La preparacion de regadera tiene hold antes de mostrar agua.
- El agua inicia `160ms` despues del gesto de inclinacion.
- Se mantienen tres streams con desfases.
- La planta cambia despues de cada pulso de riego, no al inicio.
- Se conservan sparkles actuales sin aumentar cantidad.

## Elementos preservados

- Textos visibles:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- Barra pixelart V12 sin porcentaje ni numeros.
- Pixelify Sans local.
- Posicion final de Lía.
- Posicion de maceta/planta.
- Halo.
- Agua como asset runtime local.
- Sparkles y sus posiciones.
- Rutas `/` y `/carga`.

## Capturas V13

Generadas en `docs/visual/loading-initial/validation/v13/`.

Set esperado:

- `mobile_360x640_start.png`
- `mobile_360x640_mid.png`
- `mobile_360x640_end.png`
- `mobile_390x844_start.png`
- `mobile_390x844_mid.png`
- `mobile_390x844_end.png`
- `mobile_430x932_start.png`
- `mobile_430x932_mid.png`
- `mobile_430x932_end.png`
- `reduced_motion.png`
- `loading_initial_v13_mobile.mp4` si la generacion documental local lo permite.

## Pruebas de cierre

- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

No se ejecuta `npm run assets:normalize:loading` porque este ticket no toca ni regenera assets runtime PNG/JSON.

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

La V13 queda lista para revision visual manual de la calidad de animacion de Lía en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
