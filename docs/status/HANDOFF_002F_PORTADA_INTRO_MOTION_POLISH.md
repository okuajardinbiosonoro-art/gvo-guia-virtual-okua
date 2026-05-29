# Handoff 002F - Portada / Intro motion polish y reduced motion

Fecha: 2026-05-29

## Estado

`MOTION_POLISH_BASE / DIALOGOS_BASE_IMPLEMENTADOS / SIN_TRANSICION_REAL / NO_CERRADA`

## Rama

`feature/002F-portada-intro-motion-polish`

## Base usada

- Rama base: `feature/002E-portada-intro-dialogos-gating`
- Commit base: `985f39c feat: add cover intro dialogues and portal gating`

## Qué se mejoró

- Motion suave de Lía sin cambiar layout ni assets.
- Separación entre flotación de Lía y transición de pose.
- Fade/settle breve al cambiar entre poses completas staged.
- Pulso controlado de Portal I en estado inicial.
- Estado `portal_1_ready` más claro sin abrir el portal.
- Estado `portal_1_opening_placeholder` con glow moderado y texto de apertura.
- Feedback visual sutil para Portales II-V bloqueados.
- Entrada suave de tarjeta de diálogo y mensajes de estado.
- Transiciones de pressed/focus en botón principal y controles de diálogo.
- Reduced motion robusto para desactivar animaciones continuas sin eliminar contenido.

## Decisiones de motion

- Lía sigue usando poses completas staged, no rig por capas.
- La flotación queda en `.cover-intro__lia-wrap`.
- El cambio de pose queda en `.cover-intro__lia` con animación breve `cover-lia-pose-settle`.
- Portal I usa intensidades distintas entre idle, ready y opening placeholder.
- Portales bloqueados usan oscilación máxima de 2px y pulso mínimo del candado.
- Los diálogos no usan typing effect ni scroll interno.

## Reduced motion

`prefers-reduced-motion: reduce` mantiene los diálogos y gating, pero corta:

- flotación continua de Lía;
- pulso continuo de Portal I;
- shake de portales bloqueados;
- transiciones prolongadas.

## Qué no se hizo

- No se implementó transición real a Mundo I.
- No se navegó a Estación I.
- No se implementaron estaciones.
- No se desbloquearon Portales II-V.
- No se crearon interiores de portales.
- No se agregaron assets nuevos.
- No se modificaron PNG staged.
- No se tocó `/` ni `/carga`.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.
- No se introdujeron nuevas dependencias de animación.

## Validaciones ejecutadas

- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 30 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 13 tests.

## Revisión visual local

Se generaron capturas temporales 390x844 de `/portada` para revisar estado inicial, diálogo 1, Portal I listo, placeholder de apertura y reduced motion. La composición mantiene la base 002E, conserva los portales visibles y no introduce navegación real.

Las capturas no se agregaron al repo.

## Próximo ticket recomendado

`TICKET_002G_PORTADA_INTRO_TRANSICION_PLACEHOLDER_Y_HANDOFF_MUNDO_I.md`

Ese ticket debería conectar el estado `portal_1_opening_placeholder` con una transición controlada o handoff hacia Mundo I, sin implementar todavía Estación I completa salvo autorización explícita.
