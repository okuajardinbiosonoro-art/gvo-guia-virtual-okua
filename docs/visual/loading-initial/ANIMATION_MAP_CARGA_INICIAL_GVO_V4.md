# Mapa de animacion - Carga inicial GVO V4

Estado objetivo del ticket: `ANIMACION_V4_IMPLEMENTADA / EN_REVISION_VISUAL`.

La V4 conserva la duracion, entrada lateral, riego repetido, multi-stream, textos exactos, barra fina y reduced motion de V2/V3. Su cambio principal es la calibracion precisa del layout y el anclaje del agua.

## Textos aprobados

- Titulo visible: `Preparando el recorrido`
- Subtitulo visible: `Cuidando el inicio...`

No se agregan dialogos, porcentajes, botones ni textos tecnicos. La accesibilidad usa los textos cortos aprobados con `aria-labelledby` y `aria-describedby`.

## Constantes

- Duracion normal: `TOTAL_DURATION_MS = 12000`.
- Duracion reduced motion: `REDUCED_MOTION_DURATION_MS = 1300`.
- Duracion maxima permitida: 15000 ms.

## Timeline V4

| Tiempo        | Estado funcional                | Animacion                                                                                                                          |
| ------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 0.0s a 0.8s   | `loading_initial_enter`         | Fondo y halo aparecen; maceta/planta estado 01 queda mas baja y a la izquierda; Lia permanece fuera del encuadre lateral.         |
| 0.8s a 3.2s   | `lia_entry_idle`                | Lia entra flotando desde lateral derecho/superior-derecho, reutilizando idle-float.                                                |
| 3.2s a 4.6s   | `lia_prepare_watering`          | Lia prepara la regadera; no hay agua visible.                                                                                      |
| 4.6s a 8.4s   | `lia_watering` + `plant_growth` | Tres streams de agua se anclan a la boquilla de la regadera y caen hacia planta/tierra en tres pulsos suaves.                      |
| 8.4s a 10.4s  | `loading_complete` parcial      | Agua desaparece; Lia observa; planta queda en estado 04; sparkles discretos.                                                       |
| 10.4s a 12.0s | `transition_to_intro` preparado | Barra llega a 100%; pantalla mantiene hold sereno; no hay navegacion automatica.                                                   |

## Variables de composicion

Valores base para viewport normal:

- `--loading-plant-x: 42%`
- `--loading-plant-bottom: 8px`
- `--loading-halo-x: var(--loading-plant-x)`
- `--loading-halo-bottom: 2px`
- `--loading-lia-final-x: 70%`
- `--loading-lia-final-bottom: 170px`
- `--loading-water-origin-x: -5%`
- `--loading-water-origin-y: 79%`
- `--loading-water-target-x: -14%`
- `--loading-water-target-y: 78%`
- `--loading-water-width: clamp(116px, 42%, 138px)`
- `--loading-water-rotate: -10deg`

Valores responsive principales:

- `max-width: 374px`: plant x 41%, plant bottom 6px, halo bottom 0, Lia x 71%, Lia bottom 156px.
- `max-height: 690px`: plant x 42%, plant bottom 4px, halo bottom 0, Lia x 70%, Lia bottom 146px.

## Composicion V4

- La maceta/planta queda mas a la izquierda que V3.
- La maceta/planta queda mas baja que V3 y se percibe mas asentada sobre el halo.
- Lia termina mas a la derecha y no queda encima de la maceta.
- La regadera se orienta hacia la zona de la planta.
- Los textos y la barra conservan ubicacion inferior, sin porcentaje ni numeros.

## Anclaje del agua

El agua usa la opcion A del ticket: `.loading-initial__water-field` se renderiza dentro de `.loading-initial__lia-bob`, no como capa centrada de escena.

- Origin: boquilla/punta de regadera de Lia.
- Target: planta/tierra.
- Atributos de validacion: `data-water-anchor="lia-nozzle"` y `data-water-target="plant"`.
- Streams: tres instancias del asset runtime `water_flow_5f`.

Pulsos:

- 4.6s a 5.5s: primer riego.
- 5.8s a 6.8s: segundo riego.
- 7.1s a 8.2s: tercer riego suave.

## Sparkles

Se mantienen 10 slots determinísticos con los cuatro assets aprobados. La V4 evita superponer sparkles sobre:

- Maceta/planta aproximada: x 30% a 56%, y 42% a 78%.
- Lia durante riego/observacion: x 54% a 86%, y 28% a 68%.
- Agua aproximada: x 38% a 72%, y 38% a 68%.

Posiciones V4:

- upper-far-left: x 13%, y 18%
- upper-center: x 50%, y 12%
- upper-far-right: x 87%, y 19%
- middle-far-left: x 16%, y 38%
- middle-far-right: x 90%, y 41%
- lower-left: x 14%, y 63%
- lower-right: x 88%, y 67%
- bottom-left: x 24%, y 82%
- bottom-right: x 76%, y 82%
- halo-micro-low: x 48%, y 88%

No se usa aleatoriedad runtime.

## Debug visual

No se implemento query param de debug. La calibracion se hizo con capturas Playwright y revision visual local.

## Reduced motion

Con `prefers-reduced-motion: reduce`:

- Duracion objetivo: 1300 ms.
- Lia aparece en posicion final sin entrada lateral amplia.
- Planta queda en estado 04.
- Agua multi-stream no se muestra.
- Sparkles quedan estaticos y de baja opacidad.
- Barra progresa de forma simple.
- No hay overflow horizontal.

## Validacion visual

Capturas V4 generadas en `docs/visual/loading-initial/validation/v4/`.

## Estado

La pantalla queda en revision visual. Este mapa no habilita portada ni cierra definitivamente la carga inicial.
