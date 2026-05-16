# Mapa de animación — Carga inicial GVO V2

Estado objetivo del ticket: `ANIMACION_V2_IMPLEMENTADA / EN_REVISION_VISUAL`.

Esta versión refina la V1 sin generar assets nuevos. Usa los spritesheets runtime existentes para mejorar duración, entrada de Lía, composición, riego multi-stream y sparkles.

## Textos aprobados

- Título visible: `Preparando el recorrido`
- Subtítulo visible: `Cuidando el inicio...`

No se agrega diálogo, porcentaje, botones ni texto técnico. La accesibilidad usa los textos cortos aprobados mediante `aria-labelledby` y `aria-describedby`.

## Constantes

- Duración normal: `TOTAL_DURATION_MS = 12000`.
- Duración reduced motion: `REDUCED_MOTION_DURATION_MS = 1300`.
- Duración máxima permitida: 15000 ms.

## Timeline V2

| Tiempo        | Estado funcional                | Animación                                                                                                                                    |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0s a 0.8s   | `loading_initial_enter`         | Fondo y halo aparecen; maceta/planta estado 01 ya centrada; Lía permanece fuera del encuadre lateral; barra inicia en 0%.                    |
| 0.8s a 3.2s   | `lia_entry_idle`                | Lía entra flotando desde el lateral derecho/superior-derecho, reutilizando la fila idle-float.                                               |
| 3.2s a 4.6s   | `lia_prepare_watering`          | Lía usa prepare-watering; regadera se adelanta; todavía no hay agua visible.                                                                 |
| 4.6s a 8.4s   | `lia_watering` + `plant_growth` | Lía usa watering-motion en ciclos repetidos; tres streams de `water_flow_5f` se desfasan temporalmente; la planta cruza estados 02, 03 y 04. |
| 8.4s a 10.4s  | `loading_complete` parcial      | Lía pasa a observe-glow; agua desaparece; planta queda en estado 04; sparkles siguen discretos.                                              |
| 10.4s a 12.0s | `transition_to_intro` preparado | Barra llega y se mantiene en 100%; pantalla queda en hold sereno; no hay navegación automática.                                              |

## Composición V2

- Maceta/planta centrada en la zona visual superior-media.
- Halo debajo de la maceta.
- Lía entra desde fuera del encuadre y termina flotando arriba/lateral de la maceta.
- Regadera queda sobre la planta, no pegada a la base.
- Agua aparece solo durante el riego y cae hacia la zona de la planta.
- Textos quedan debajo de la escena.
- Barra queda debajo del subtítulo, fina, centrada, sin números.

## Agua

Se usan tres instancias del mismo spritesheet:

- `waterStreamA`: delay 0 ms.
- `waterStreamB`: delay 180 ms y offset leve.
- `waterStreamC`: delay 340 ms y offset leve.

Las tres instancias solo son visibles dentro de la ventana 4.6s a 8.4s.

## Sparkles

La V2 usa seis slots determinísticos y los cuatro assets aprobados. No se usa aleatoriedad runtime.

## Reduced motion

Con `prefers-reduced-motion: reduce`:

- Duración objetivo: 1300 ms.
- Lía aparece en posición final sin entrada lateral amplia.
- Planta queda en estado 04.
- Agua multi-stream no se muestra.
- Sparkles quedan estáticos y con opacidad baja.
- Barra progresa de forma simple.

## Estado

La pantalla queda en revisión visual. Este mapa no habilita portada ni cierra definitivamente la carga inicial.
