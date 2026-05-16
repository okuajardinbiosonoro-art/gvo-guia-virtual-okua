# Mapa de animacion - Carga inicial GVO V5

Estado objetivo del ticket: `ANIMACION_V5_IMPLEMENTADA / EN_REVISION_VISUAL`.

La V5 conserva la animacion V4 como base y ajusta solo composicion espacial: halo centrado y ampliado, maceta mas baja e izquierda, Lia desplazada hacia el centro sin dejar de quedar a la derecha de la maceta, y agua recalibrada para caer en la planta/tierra despues del nuevo layout.

## Textos aprobados

- Titulo visible: `Preparando el recorrido`
- Subtitulo visible: `Cuidando el inicio...`

No se agregan dialogos, porcentajes, botones ni textos tecnicos. La accesibilidad usa los textos cortos aprobados con `aria-labelledby` y `aria-describedby`.

## Constantes

- Duracion normal: `TOTAL_DURATION_MS = 12000`.
- Duracion reduced motion: `REDUCED_MOTION_DURATION_MS = 1300`.
- Duracion maxima permitida: 15000 ms.

## Timeline V5

| Tiempo        | Estado funcional                | Animacion                                                                                                                        |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 0.0s a 0.8s   | `loading_initial_enter`         | Fondo y halo aparecen; maceta/planta estado 01 queda baja y a la izquierda; Lia permanece fuera del encuadre lateral.           |
| 0.8s a 3.2s   | `lia_entry_idle`                | Lia entra flotando desde lateral derecho/superior-derecho, reutilizando idle-float.                                              |
| 3.2s a 4.6s   | `lia_prepare_watering`          | Lia prepara la regadera; no hay agua visible.                                                                                    |
| 4.6s a 8.4s   | `lia_watering` + `plant_growth` | Tres streams de agua se anclan a la boquilla y caen hacia planta/tierra en tres pulsos suaves.                                  |
| 8.4s a 10.4s  | `loading_complete` parcial      | Agua desaparece; Lia observa; planta queda en estado 04; sparkles discretos.                                                     |
| 10.4s a 12.0s | `transition_to_intro` preparado | Barra llega a 100%; pantalla mantiene hold sereno; no hay navegacion automatica.                                                 |

## Variables de composicion

Valores base para viewport normal:

- `data-loading-layout-version="v5"`
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
- `--loading-water-width: clamp(116px, 42%, 138px)`
- `--loading-water-rotate: -10deg`

Valores responsive principales:

- `max-width: 374px`: plant x 37%, plant bottom -6px, halo x 50%, halo bottom -8px, Lia x 65%, Lia bottom 156px.
- `max-height: 690px`: plant x 38%, plant bottom -8px, halo x 50%, halo bottom -10px, Lia x 65%, Lia bottom 146px.

## Composicion V5

- El halo queda centrado en el stage visual (`50%`) y crece respecto a V4 para funcionar como base comun.
- La maceta/planta baja respecto a V4 y queda mas cerca del halo.
- La maceta/planta queda mas a la izquierda que V4.
- Lia tambien se desplaza hacia la izquierda, pero conserva una posicion a la derecha de la maceta.
- El centro de peso visual de Lia y maceta queda mas cerca del centro del viewport.
- Los textos y la barra conservan ubicacion inferior, sin porcentaje ni numeros.

## Anclaje del agua

El agua conserva la estrategia V4: `.loading-initial__water-field` se renderiza dentro de `.loading-initial__lia-bob`, no como capa centrada de escena.

- Origin: boquilla/punta de regadera de Lia.
- Target: planta/tierra.
- Atributos de validacion: `data-water-anchor="lia-nozzle"` y `data-water-target="plant"`.
- Streams: tres instancias del asset runtime `water_flow_5f`.
- Recalibracion V5: el origen queda en `-5% / 80%`, con rotacion `-10deg`, para mantener la caida del agua sobre la maceta desplazada a la izquierda.

Pulsos:

- 4.6s a 5.5s: primer riego.
- 5.8s a 6.8s: segundo riego.
- 7.1s a 8.2s: tercer riego suave.

## Sparkles

Se mantienen 10 slots determinísticos con los cuatro assets aprobados. La V5 conserva sparkles en fondo y evita elementos principales:

- Maceta/planta aproximada: x 26% a 52%, y 42% a 82%.
- Lia durante riego/observacion: x 48% a 80%, y 28% a 68%.
- Agua aproximada: x 34% a 68%, y 38% a 68%.
- Textos y barra: zona inferior funcional.

No se usa aleatoriedad runtime.

## Debug visual

No se implemento query param de debug. La calibracion se hace con capturas Playwright y revision visual local.

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

Capturas V5 generadas en `docs/visual/loading-initial/validation/v5/`.

## Estado

La pantalla queda en revision visual. Este mapa no habilita portada ni cierra definitivamente la carga inicial.
