# Handoff 002G - Portada / Intro transición placeholder

Fecha: 2026-05-29

## Estado

`TRANSICION_PLACEHOLDER_IMPLEMENTADA / HANDOFF_MUNDO_I_PREPARADO / NO_CERRADA`

## Rama

`feature/002G-portada-intro-transition-handoff`

## Base usada

- Rama base: `feature/002F-portada-intro-motion-polish`
- Commit base: `cb857a9 feat: polish cover intro motion and reduced motion`

## Qué se implementó

- Nuevo estado `transition_to_station_1_placeholder`.
- Paso controlado desde `portal_1_opening_placeholder` al placeholder de transición.
- Overlay DOM accesible para preparar el handoff a Mundo I.
- Textos visibles:
  - `Abriendo Mundo I: Raíz...`
  - `Preparando recorrido...`
  - `La transición visual final se integrará en una fase posterior.`
- Acción explícita `Continuar a Mundo I`.

## Ruta placeholder usada

Se usó la ruta placeholder existente:

`/estacion/1`

Esa ruta ya existía en el router mediante `StationPlaceholder`. No se creó una ruta nueva y no se implementó Estación I real.

## Estados relacionados

- `portal_1_ready`
- `portal_1_opening_placeholder`
- `transition_to_station_1_placeholder`

## Qué no se implementó

- No se implementó transición pixelart final.
- No se implementó Estación I real.
- No se implementaron interiores de portales.
- No se desbloquearon Portales II-V.
- No se creó navegación automática.
- No se agregaron assets nuevos.
- No se modificaron PNG staged.
- No se tocó `/` ni `/carga`.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.
- No se introdujeron nuevas dependencias de animación.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 31 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 13 tests.

## Revisión visual local

Se generaron capturas temporales 390x844 del overlay `transition_to_station_1_placeholder` en motion normal y reduced motion. El overlay permanece dentro de `/portada`, muestra el handoff hacia Mundo I y no navega automáticamente.

Las capturas no se agregaron al repo.

## Próximo ticket recomendado

`TICKET_002H_PORTADA_INTRO_QA_VISUAL_Y_APROBACION_PARA_AVANZAR.md`

Ese ticket debe revisar `/portada` visualmente en mobile, validar textos, diálogos, motion/reduced motion y decidir si Portada / Intro queda `APROBADA_PARA_AVANZAR` o requiere ajustes.
