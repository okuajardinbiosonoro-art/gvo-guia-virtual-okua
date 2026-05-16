# Mapa de animación — Carga inicial GVO V1

Estado objetivo del ticket: `ANIMACION_V1_IMPLEMENTADA / EN_REVISION_VISUAL`.

Esta versión anima la carga inicial pre-portada con assets runtime normalizados. No implementa portada, estaciones ni transición entre mundos.

## Textos aprobados

Textos visibles y accesibles:

- Título: `Preparando el recorrido`
- Subtítulo: `Cuidando el inicio...`

No se usa el texto largo rechazado por el usuario en HTML visible, `sr-only`, `aria-label` ni `alt`.

## Timeline

Duración normal: 12 segundos.

| Tiempo        | Estado funcional                | Animación                                                                       |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| 0.0s a 0.4s   | `loading_initial_enter`         | Entrada suave de escena, halo bajo, planta estado 01, barra en 0%.              |
| 0.4s a 1.8s   | `lia_entry_idle`                | Lía usa frames 01 a 04 con flotación leve.                                      |
| 1.8s a 3.4s   | `lia_prepare_watering`          | Lía usa frames 05 a 08. La regadera se prepara, sin agua visible.               |
| 3.4s a 6.8s   | `lia_watering` + `plant_growth` | Lía usa frames 09 a 12, aparece agua sutil, la planta pasa por estados 02 y 03. |
| 6.8s a 9.6s   | `loading_complete` parcial      | Lía usa frames 13 a 16, agua desaparece, planta estado 04, destellos mínimos.   |
| 9.6s a 10.8s  | `loading_complete`              | Barra llega a 100%, escena queda serena, sin texto nuevo.                       |
| 10.8s a 12.0s | `transition_to_intro` preparado | Fade final muy leve. No navega a portada.                                       |

## Reduced motion

Con `prefers-reduced-motion: reduce`:

- Lía queda en el último frame.
- Planta queda en estado 04.
- Agua y destellos no se muestran.
- La barra progresa con una animación corta de 1.2s.
- No hay desplazamientos amplios ni loops largos.

## Rutas

- `/`: muestra carga inicial animada V1.
- `/carga`: muestra carga inicial animada V1.

La portada sigue bloqueada porque la carga inicial requiere revisión visual del usuario antes de `CERRADA_APROBADA`.
