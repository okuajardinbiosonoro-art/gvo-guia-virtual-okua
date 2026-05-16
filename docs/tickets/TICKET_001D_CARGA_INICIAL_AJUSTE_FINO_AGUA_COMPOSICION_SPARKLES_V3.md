# Ticket 001D - Carga inicial ajuste fino agua, composicion y sparkles V3

Fecha: 2026-05-16

Estado al cierre: `ANIMACION_V3_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Base

- Rama base: `feature/001C-carga-inicial-timeline-y-composicion-v2`.
- Commit base verificado: `cb7a251 feat: refine initial loading animation timeline`.
- Rama de trabajo: `feature/001D-carga-inicial-ajuste-fino-v3`.

## Alcance aplicado

Esta iteracion refina la V2 sin generar assets nuevos y sin modificar el flujo de pantallas. La carga inicial sigue siendo la pantalla visible en `/` y `/carga`.

Cambios principales:

- Maceta/planta movida ligeramente hacia la izquierda para romper el centrado rigido.
- Halo alineado con el nuevo eje de la maceta y bajado levemente.
- Lía conserva entrada lateral, pero su posicion final queda un poco mas a la derecha.
- Agua reposicionada para originarse visualmente cerca de la boquilla y caer hacia planta/tierra.
- Tres streams de agua conservados con offsets, rotaciones, escalas y desfases explicitos.
- Ciclo de agua sincronizado con la ventana real de riego.
- Sparkles ampliados de 6 a 10 slots determinísticos, distribuidos por aire superior, laterales, escena central y zona baja.
- Duracion normal conservada en 12000 ms.
- Reduced motion conservado en 1300 ms, sin agua multi-stream animada.

## Capturas de validacion V3

Generadas en `docs/visual/loading-initial/validation/v3/`:

- `t_00_0s_initial.png`
- `t_02_5s_lia_entering.png`
- `t_04_8s_water_start_alignment.png`
- `t_05_8s_water_cycle_a.png`
- `t_06_8s_water_cycle_b.png`
- `t_07_8s_water_cycle_c.png`
- `t_09_5s_observe_sparkles.png`
- `t_11_5s_final_hold.png`
- `reduced_motion.png`

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video.
- No se usan recursos externos ni CDN.
- No se cambia el estado a cierre visual definitivo.

## Pendiente

La V3 queda lista para revision visual manual en navegador movil. El siguiente avance de pantalla continua bloqueado hasta aprobacion explicita de la carga inicial.
