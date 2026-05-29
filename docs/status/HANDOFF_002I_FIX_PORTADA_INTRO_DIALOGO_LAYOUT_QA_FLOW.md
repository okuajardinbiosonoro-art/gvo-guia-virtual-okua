# Handoff 002I-FIX - Portada / Intro diálogo, layout y QA flow

Fecha: 2026-05-29

## Estado

`AJUSTE_002I_FIX / DIALOGO_PREMIUM_REVISADO / QA_FLOW_CORREGIDO / NO_CERRADA`

## Rama

`feature/002I-fix-portada-intro-dialogo-layout-qa-flow`

## Base usada

- Rama base: `feature/002I-portada-intro-dialogo-premium-layout`
- Commit base: `9750cd7 feat: refine cover intro dialogue and portal layout`

## Qué se corrigió

- Se agregó soporte para `resetIntro=1` en `/portada`.
- Se limpia `gvo.coverIntro.introCompleted.v1` al usar el reset.
- Después de procesar `resetIntro=1`, la URL queda limpia como `/portada`.
- Se agregó flujo de revisión local desde `/` hacia `/portada`.
- Se preserva `/carga` como ruta aislada de QA de la carga inicial.
- El panel de diálogo se reposicionó para no tapar el rostro/cabeza de Lía.
- El panel quedó más compacto, translúcido y menos blanco plano.
- Portal I y portales bloqueados mantienen mayor escala y legibilidad.
- Se generaron capturas nuevas en `docs/visual/cover-intro/qa/002I-FIX/`.

## Cómo probar primera pasada

Ruta directa recomendada:

`/portada?resetIntro=1`

Resultado esperado:

- Limpia la intro completada.
- Muestra `Comenzar recorrido`.
- No muestra `Entrar a Mundo I` inicialmente.
- Permite revisar los cinco diálogos desde cero.

## Cómo probar flujo local completo

Ruta recomendada:

`/?resetIntro=1`

Resultado esperado:

- Muestra carga inicial.
- En motion normal espera la duración V13 de carga.
- En reduced motion avanza con duración reducida.
- Luego navega a `/portada`.
- La portada aparece fresca, con `Comenzar recorrido`.

## Capturas generadas

Ruta:

`docs/visual/cover-intro/qa/002I-FIX/`

Archivos:

- `cover-intro-fix-01-idle-fresh-390x844.png`
- `cover-intro-fix-02-dialogue-01-390x844.png`
- `cover-intro-fix-03-dialogue-clarification-390x844.png`
- `cover-intro-fix-04-portal-ready-390x844.png`
- `cover-intro-fix-05-transition-placeholder-390x844.png`
- `cover-intro-fix-06-root-loading-to-portada-390x844.png`

## Qué no se corrigió todavía

- No se implementó rig facial.
- No se implementó blink/parpadeo.
- No se usaron ojos del rig.
- No se implementó coreografía física completa del Portal I.
- No se implementó transición pixelart final.
- No se implementó Estación I real.
- No se crearon interiores de portales.

## Qué no se tocó

- No se modificaron PNG staged.
- No se agregaron assets runtime nuevos.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.
- No se modificó visualmente la carga inicial.

## Validaciones ejecutadas

- `npm run test -- src/screens/Cover/CoverIntroScreen.test.tsx`: OK, 16 tests.
- `npm run test:e2e -- tests/e2e/cover-intro-fix-qa.spec.ts`: OK, 2 tests y capturas generadas.
- `npm run lint`: OK.
- `npm run test`: OK, 32 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run validate:cover-intro-assets`: OK, 27 rutas.
- `npm run test:e2e`: OK, 20 tests.

## Próximo ticket recomendado

`TICKET_002J_PORTADA_INTRO_LIA_HYBRID_RIG_FACIAL.md`

Ese ticket debe esperar revisión visual de este fix antes de iniciar.
