# Ticket 001E - Carga inicial calibracion precisa agua y layout V4

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V4_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Base

- Rama base: `feature/001D-carga-inicial-ajuste-fino-v3`.
- Commits base verificados:
  - `cb7a251 feat: refine initial loading animation timeline`
  - `632f4c2 feat: fine tune initial loading animation composition`
- Rama de trabajo: `feature/001E-carga-inicial-calibracion-agua-layout-v4`.

## Cambios de composicion

La V4 aplica una calibracion mas decidida respecto a V3:

- Maceta/planta mas a la izquierda.
- Maceta/planta mas baja y mas asentada sobre el halo.
- Halo alineado al nuevo eje de la maceta.
- Lia mas a la derecha durante riego y observacion.
- Agua movida dentro del wrapper de Lia para anclarse a la boquilla.
- Sparkles reubicados fuera de zonas principales de Lia, maceta, planta y agua.

## Valores finales

- `--loading-plant-x: 42%`
- `--loading-plant-bottom: 8px`
- `--loading-halo-bottom: 2px`
- `--loading-lia-final-x: 70%`
- `--loading-lia-final-bottom: 170px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 79%`
- `--loading-water-width: clamp(116px, 42%, 138px)`
- `--loading-water-rotate: -10deg`

## Agua

El campo de agua ya no se posiciona como elemento centrado de escena. Ahora se renderiza dentro de `.loading-initial__lia-bob`, con:

- `data-water-anchor="lia-nozzle"`
- `data-water-target="plant"`

Los tres streams conservan el asset `water_flow_5f` existente y se desfasan alrededor de la misma trayectoria. La ventana de agua sigue dentro de 4.6s a 8.4s y se divide en tres pulsos suaves:

- 4.6s a 5.5s: primer riego.
- 5.8s a 6.8s: segundo riego.
- 7.1s a 8.2s: tercer riego.

## Sparkles

Se mantienen 10 slots determinísticos. La V4 evita estas zonas visuales:

- Maceta/planta aproximada: x 30% a 56%, y 42% a 78%.
- Lia durante riego/observacion: x 54% a 86%, y 28% a 68%.
- Agua aproximada: x 38% a 72%, y 38% a 68%.

## Capturas V4

Generadas en `docs/visual/loading-initial/validation/v4/`:

- `t_00_0s.png`
- `t_03_0s_lia_entering.png`
- `t_04_7s_water_start.png`
- `t_05_5s_watering_1.png`
- `t_06_5s_watering_2.png`
- `t_07_7s_watering_3.png`
- `t_08_4s_water_end.png`
- `t_11_5s_final_hold.png`
- `reduced_motion.png`

## Pruebas de cierre

- `npm run assets:normalize:loading`
- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video.
- No se usan recursos externos ni CDN.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V4 queda lista para revision visual manual en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
