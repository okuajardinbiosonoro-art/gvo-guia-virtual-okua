# Handoff 002I-FIX2 - Portada / Intro diálogo integrado con Lía y activación Portal I

Fecha: 2026-05-29

## Estado

`AJUSTE_002I_FIX2 / DIALOGO_LIA_INTEGRADO / ACTIVACION_PORTAL_I_REVISADA / NO_CERRADA`

## Rama

`feature/002I-fix2-portada-intro-dialogo-lia-portal`

## Base usada

- Rama base: `feature/002I-fix-portada-intro-dialogo-layout-qa-flow`
- Commit base: `28add2a fix: refine cover intro dialogue layout and qa flow`

## Qué se corrigió

- El diálogo se refuerza como extensión visual de Lía, con conector CSS, acento ámbar/lavanda y panel menos genérico.
- El cuerpo de los diálogos deja de usar fuente decorativa/pixel y usa una fuente de lectura cómoda.
- El indicador visible deja el formato `1/5` y pasa a `Paso 1 de 5`, `Paso 2 de 5`, etc.
- En `portal_1_opening_placeholder` y `transition_to_station_1_placeholder`, Lía se renderiza anclada al Portal I.
- La activación usa una composición por capas: glow posterior del Portal I, Lía activate, velo CSS sutil y frame frontal duplicado.
- Portal I mantiene glow de respuesta durante la activación.
- El placeholder de transición hacia Mundo I se conserva.
- `Continuar a Mundo I` sigue apuntando a `/estacion/1`.

## Tipografía de lectura

Se aplica a texto principal del diálogo, botón de diálogo, mensajes de bloqueo y textos largos de transición:

`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

La identidad pixel/visual se conserva en:

- `OKÚA`.
- `GUÍA VISUAL`.
- `EL ARCHIVO VIVO DE OKÚA`.
- Números romanos de portales.

## QA manual/local

Rutas principales:

- `/portada?resetIntro=1`: fuerza primera pasada y limpia persistencia.
- `/?resetIntro=1`: muestra carga inicial y luego portada fresca.
- `/carga`: conserva QA aislado de carga inicial.

## Capturas generadas

Ruta:

`docs/visual/cover-intro/qa/002I-FIX2/`

Archivos:

- `cover-intro-fix2-01-dialogue-01-390x844.png`
- `cover-intro-fix2-02-dialogue-clarification-390x844.png`
- `cover-intro-fix2-03-portal-ready-390x844.png`
- `cover-intro-fix2-04-opening-activation-390x844.png`
- `cover-intro-fix2-05-transition-placeholder-390x844.png`
- `cover-intro-fix2-06-root-reset-flow-390x844.png`

## Qué no se corrigió todavía

- No se implementó rig facial completo.
- No se implementó blink/parpadeo.
- No se usaron ojos del rig.
- No se implementó transición pixelart final.
- No se implementó Estación I real.
- No se desbloquearon Portales II-V.

## Qué no se tocó

- No se modificaron PNG staged.
- No se generaron assets nuevos.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.
- No se modificó visualmente la carga inicial.

## Validaciones ejecutadas

- `npm run test -- src/screens/Cover/CoverIntroScreen.test.tsx`: OK, 16 tests.
- `npm run test:e2e -- tests/e2e/cover-intro-fix2-qa.spec.ts`: OK, 2 tests y capturas generadas.
- `npm run lint`: OK.
- `npm run test`: OK, 32 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run validate:cover-intro-assets`: OK, 27 rutas.
- `npm run test:e2e`: OK, 22 tests.

## Próximo ticket recomendado

Si la revisión visual aprueba este fix, continuar con:

`TICKET_002J_PORTADA_INTRO_LIA_HYBRID_RIG_FACIAL.md`

Si la activación del Portal I todavía no convence, abrir primero:

`TICKET_002I_FIX3_PORTADA_INTRO_ACTIVACION_PORTAL_I.md`
