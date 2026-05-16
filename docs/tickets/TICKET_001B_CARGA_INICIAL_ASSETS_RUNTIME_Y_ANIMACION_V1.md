# TICKET 001B: Carga inicial assets runtime y animación V1

## Objetivo

Implementar la primera versión animada de la pantalla de carga inicial usando assets aprobados y normalizados desde `carga_inicial_v2`.

Estado al cierre del ticket: `ANIMACION_V1_IMPLEMENTADA / EN_REVISION_VISUAL`.

No se marca `CERRADA_APROBADA`.

## Precondición 001A

La metodología 001A debía estar integrada en `main` antes de crear la rama de este ticket.

- Rama 001A: `feature/001A-metodologia-cierre-iterativo`.
- Commit 001A: `8bf10ef docs: formalize iterative screen closure methodology`.
- Resultado: `main` no contenía `8bf10ef` al inicio. Se integró por fast-forward y se validó antes de crear `feature/001B-carga-inicial-animacion-v1`.

Validación ejecutada sobre `main` tras integrar 001A:

- `npm run lint`: OK.
- `npm run test`: OK.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run test:e2e`: OK.

## Alcance implementado

- Scripts de normalización y validación de assets.
- Spritesheet 4x4 de Lía con 16 frames.
- Spritesheet 4x1 de planta con 4 estados.
- Spritesheet 5x1 de agua con 5 frames.
- Destellos y halo runtime locales.
- Referencia visual aprobada copiada a `assets/reference/screens/loading-initial/`.
- Pantalla animada en `/` y `/carga`.
- Reduced motion.
- Pruebas de componente y e2e actualizadas.
- Estado documental actualizado.

## Fuera de alcance respetado

- Portada no implementada.
- Estaciones no implementadas.
- Transición entre mundos no implementada.
- Audio no implementado.
- Video no implementado.
- Recursos externos no usados.
- CDN no usado.
- No se abre Pull Request.

## Textos finales

- `Preparando el recorrido`
- `Cuidando el inicio...`

No se usa el texto largo rechazado por el usuario en visible, `sr-only`, `aria-label` ni `alt`.

## Rutas afectadas

- `/`: carga inicial animada V1.
- `/carga`: carga inicial animada V1.

No hay navegación automática a portada.

## Estado de revisión

La pantalla queda lista para revisión visual del usuario en navegador móvil. La aprobación final y el paso a `CERRADA_APROBADA` quedan pendientes.
