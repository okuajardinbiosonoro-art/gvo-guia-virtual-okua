# Mapa de animacion - Carga inicial GVO V3

Estado objetivo del ticket: `ANIMACION_V3_IMPLEMENTADA / EN_REVISION_VISUAL`.

La V3 es un ajuste fino de la V2. Mantiene los mismos assets runtime normalizados y corrige composicion, origen del agua, repeticion del riego y distribucion de sparkles.

## Textos aprobados

- Titulo visible: `Preparando el recorrido`
- Subtitulo visible: `Cuidando el inicio...`

No se agregan dialogos, porcentajes, botones ni textos tecnicos. La accesibilidad sigue usando `aria-labelledby` y `aria-describedby` con los textos cortos aprobados.

## Constantes

- Duracion normal: `TOTAL_DURATION_MS = 12000`.
- Duracion reduced motion: `REDUCED_MOTION_DURATION_MS = 1300`.
- Duracion maxima permitida: 15000 ms.

## Timeline V3

| Tiempo        | Estado funcional                | Animacion                                                                                                                                    |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0s a 0.8s   | `loading_initial_enter`         | Fondo y halo aparecen; maceta/planta estado 01 queda levemente a la izquierda; Lia permanece fuera del encuadre lateral.                    |
| 0.8s a 3.2s   | `lia_entry_idle`                | Lia entra flotando desde el lateral derecho/superior-derecho, reutilizando la fila idle-float.                                               |
| 3.2s a 4.6s   | `lia_prepare_watering`          | Lia prepara la regadera; no hay agua visible; la planta sigue pequena.                                                                       |
| 4.6s a 8.4s   | `lia_watering` + `plant_growth` | Lia usa watering-motion; tres streams de `water_flow_5f` se desfasan y se reinician dentro de la ventana de riego; la planta crece.          |
| 8.4s a 10.4s  | `loading_complete` parcial      | Lia observa; agua desaparece; planta queda en estado 04; sparkles siguen discretos.                                                          |
| 10.4s a 12.0s | `transition_to_intro` preparado | Barra llega a 100%; pantalla mantiene hold sereno; no hay navegacion automatica.                                                             |

## Variables de composicion

La escena consolida variables CSS semanticas:

- `--loading-plant-x: 46%`
- `--loading-plant-bottom: 20px`
- `--loading-halo-x: var(--loading-plant-x)`
- `--loading-halo-bottom: 16px`
- `--loading-lia-final-x: 65%`
- `--loading-lia-final-bottom: 178px`
- `--loading-water-x: 49%`
- `--loading-water-bottom: 146px`
- `--loading-water-width: clamp(194px, 57%, 252px)`
- `--loading-water-rotate: -7deg`

En viewports bajos o estrechos, estas variables se ajustan con media queries para evitar overflow y mantener la escena dentro del area util.

## Composicion V3

- La maceta/planta ya no queda en `50%`; se mueve levemente hacia la izquierda.
- El halo acompana el eje de la maceta y queda mas asentado bajo la base.
- Lia mantiene entrada lateral, pero su llegada final queda mas a la derecha para no cubrir tanto la maceta.
- La regadera queda sobre la zona de la planta.
- El agua se ubica desde la boquilla hacia planta/tierra y no desde el centro de pantalla.
- Los textos y la barra se mantienen debajo de la escena.

## Agua

Se conservan tres instancias del mismo spritesheet:

- `waterStreamA`: delay 0 ms, offset base.
- `waterStreamB`: delay 180 ms, offset leve y rotacion negativa.
- `waterStreamC`: delay 340 ms, offset leve y rotacion positiva.

Cada stream expone variables de offset, rotacion, escala y duracion de ciclo. La animacion del spritesheet arranca con la ventana de riego para que el riego se perciba sostenido entre 4.6s y 8.4s.

## Sparkles

La V3 usa 10 slots determinísticos y los 4 assets aprobados. La distribucion cubre:

- aire superior izquierdo/derecho;
- zona superior central;
- laterales medios;
- entorno de Lia/planta;
- zona baja lateral;
- un micro sparkle cerca del halo.

No se usa aleatoriedad runtime.

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

Capturas V3 generadas en `docs/visual/loading-initial/validation/v3/`.

## Estado

La pantalla queda en revision visual. Este mapa no habilita portada ni cierra definitivamente la carga inicial.
