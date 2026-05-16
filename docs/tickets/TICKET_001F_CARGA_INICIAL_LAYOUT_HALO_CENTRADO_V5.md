# Ticket 001F - Carga inicial layout halo centrado V5

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V5_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Objetivo

Refinar de forma acotada la composicion espacial de la carga inicial animada V4 para que la escena se perciba mas centrada y cercana a la referencia visual aprobada.

## Base

- Rama base: `feature/001E-carga-inicial-calibracion-agua-layout-v4`.
- Commit base verificado: `573cefc feat: calibrate initial loading water and layout`.
- Rama de trabajo: `feature/001F-carga-inicial-layout-halo-centrado-v5`.

## Observaciones del usuario

- La maceta estaba demasiado arriba respecto al aro/halo de suelo.
- La escena completa se percibia cargada hacia la derecha.
- Lia y la maceta debian desplazarse hacia la izquierda.
- La maceta debia quedar un poco mas a la izquierda que Lia para recibir mejor el agua.
- El halo debia crecer, centrarse y funcionar como base comun de Lia y maceta.
- Primero se corrige layout y alineacion; la calidad fina de la animacion queda para revision posterior.

## Cambios realizados

- Halo centrado en el stage visual y ampliado respecto a V4.
- Maceta/planta desplazada mas hacia la izquierda y bajada hacia el halo.
- Lia desplazada hacia la izquierda, conservando su relacion a la derecha de la maceta.
- Agua recalibrada dentro del wrapper de Lia para mantener origen en boquilla y caida sobre planta/tierra.
- Se conserva la estrategia de 3 streams y 3 pulsos suaves.
- Se conserva la lista de 10 sparkles determinísticos, con zonas de exclusion ajustadas en documentacion.
- Se agrega `data-loading-layout-version="v5"` para validacion automatica estable.

## Valores finales de composicion

- `--loading-halo-x: 50%`
- `--loading-halo-width: min(104%, 430px)`
- `--loading-halo-scale-x: 1.14`
- `--loading-halo-bottom: -6px`
- `--loading-plant-x: 38%`
- `--loading-plant-bottom: -4px`
- `--loading-lia-final-x: 65%`
- `--loading-lia-final-bottom: 168px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 80%`
- `--loading-water-target-x: -15%`
- `--loading-water-target-y: 78%`
- `--loading-water-rotate: -10deg`

## Agua

El campo de agua sigue renderizado dentro de `.loading-initial__lia-bob`, con:

- `data-water-anchor="lia-nozzle"`
- `data-water-target="plant"`

Los tres streams conservan el asset `water_flow_5f` existente y se desfasan alrededor de la misma trayectoria. La ventana de agua sigue dentro de 4.6s a 8.4s:

- 4.6s a 5.5s: primer riego.
- 5.8s a 6.8s: segundo riego.
- 7.1s a 8.2s: tercer riego.

## Capturas V5

Generadas en `docs/visual/loading-initial/validation/v5/`:

- `mobile_360x640_t0.png`
- `mobile_360x640_t6.png`
- `mobile_390x844_t0.png`
- `mobile_390x844_t4.png`
- `mobile_390x844_t6.png`
- `mobile_390x844_t8.png`
- `mobile_430x932_t6.png`
- `reduced_motion_390x844.png`
- `final_state_390x844.png`

## Pruebas de cierre

- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

No se ejecuta normalizacion de assets porque este ticket no toca ni regenera PNG runtime.

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video.
- No se usan recursos externos ni CDN.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V5 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
