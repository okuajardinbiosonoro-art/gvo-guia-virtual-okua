# TICKET 001C: Carga inicial refinamiento timeline y composición V2

## Objetivo

Refinar la pantalla de carga inicial animada V1 para corregir duración percibida, entrada de Lía, composición, riego, sparkles, texto y barra.

Estado al cierre del ticket: `ANIMACION_V2_IMPLEMENTADA / EN_REVISION_VISUAL`.

## Base de trabajo

- Rama base obligatoria: `feature/001B-carga-inicial-animacion-v1`.
- Rama de trabajo: `feature/001C-carga-inicial-timeline-y-composicion-v2`.
- No se trabajó desde `main`.

## Cambios respecto a V1

- Duración normal explícita en `TOTAL_DURATION_MS = 12000`.
- Duración reduced motion explícita en `REDUCED_MOTION_DURATION_MS = 1300`.
- Lía ya no aparece estática desde el inicio: entra desde el lateral derecho/superior-derecho.
- Maceta/planta queda centrada en la zona visual.
- Lía termina flotando arriba/lateral de la maceta.
- Planta usa crossfade entre estados 01 a 04.
- Riego repetido con tres instancias desfasadas de `water_flow_5f`.
- Sparkles visibles y discretos mediante seis slots determinísticos.
- Título ajustado para mantenerse en una línea en anchos móviles comunes.
- Barra fina, centrada, sin porcentaje ni números.

## Textos finales

- `Preparando el recorrido`
- `Cuidando el inicio...`

No se agrega texto largo, diálogo, porcentaje, números ni botones.

## Rutas afectadas

- `/`
- `/carga`

No hay navegación automática a portada.

## Reduced motion

La variante reducida usa 1300 ms, evita entrada lateral amplia, oculta el agua multi-stream y deja sparkles estáticos de baja opacidad.

## Fuera de alcance respetado

- Portada no implementada.
- Estaciones no implementadas.
- Transición entre mundos no implementada.
- Audio no implementado.
- Video no implementado.
- Recursos externos no usados.
- CDN no usado.
- No se abre Pull Request.

## Capturas de validación

Capturas documentales esperadas en `docs/visual/loading-initial/validation/v2/`:

- `t_00_0s.png`
- `t_03_0s_lia_entering.png`
- `t_05_5s_watering.png`
- `t_08_0s_plant_growth.png`
- `t_11_5s_final_hold.png`
- `reduced_motion.png`

## Estado de revisión

La pantalla queda lista para revisión visual del usuario en navegador móvil. La aprobación final sigue pendiente y no se habilita Ticket 002.
