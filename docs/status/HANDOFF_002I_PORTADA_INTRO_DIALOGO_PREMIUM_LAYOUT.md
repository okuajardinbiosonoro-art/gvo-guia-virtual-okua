# Handoff 002I - Portada / Intro diálogo premium y recomposición

Fecha: 2026-05-29

## Estado

`AJUSTE_VISUAL_D3_PARCIAL / DIALOGO_PREMIUM_BASE / RECOMPOSICION_PORTALES / NO_CERRADA`

## Rama

`feature/002I-portada-intro-dialogo-premium-layout`

## Base usada

- Rama base: `feature/002H-portada-intro-qa-visual`
- Commit base: `f8c3325 test: add cover intro visual qa evidence`

## Decisión que abre este ticket

La revisión posterior al QA 002H quedó como:

`AJUSTE_VISUAL_REQUERIDO`

Motivos documentados:

- Los cuadros de diálogo se veían poco profesionales.
- Los colores de los diálogos no armonizaban con la pantalla.
- La presentación de diálogos se sentía superficial.
- Lía todavía no se siente suficientemente viva.
- Los portales eran demasiado pequeños.
- La activación de Portal I aún no tiene coreografía convincente.

## Estrategia visual

Estrategia global aprobada:

`D3 + L2 + P3`

Este ticket cubre:

- `D3`: sistema de diálogo premium tipo anfitriona / ficha museográfica.
- `P3 parcial`: recomposición visual de portales y mayor protagonismo de Portal I.

Queda fuera:

- `L2 completo`: rig facial, blink y microvida de Lía.
- `P3 completo`: coreografía física de activación del Portal I.

## Cambios en diálogos

- El diálogo pasa de popup oscuro genérico a panel anfitriona/museográfico.
- Se agregan variables CSS locales de paleta crema, lavanda y ámbar.
- El panel usa fondo crema translúcido, borde fino lavanda/ámbar, sombra cálida ligera y blur suave.
- Se agrega etiqueta `Lía`.
- Se agrega indicador de progreso `1/5`, `2/5`, etc.
- El botón `Siguiente` queda integrado visualmente al panel.
- Reduced motion conserva el flujo y elimina movimiento perceptible por la regla existente.

## Cambios en composición de portales

- Se agrega estructura de escena para futura coreografía:
  - `cover-lia-stage`
  - `cover-lia-layer`
  - `cover-portal-stage`
  - `cover-portal-group`
  - `cover-activation-stage`
- Portal I pasa a ser `cover-intro__portal--primary`.
- Portal I queda más grande y protagonista.
- Portales II-V quedan como `cover-intro__portal--locked-secondary`.
- Portales bloqueados siguen visibles, con candados y feedback al toque.
- Se preserva el handoff placeholder hacia Mundo I.

## Qué no se cambió

- No se generaron assets nuevos.
- No se modificaron PNG staged.
- No se implementó rig facial ni parpadeo.
- No se usaron ojos del rig de Lía.
- No se implementó coreografía física completa del Portal I.
- No se implementó transición pixelart final.
- No se implementó Estación I real.
- No se desbloquearon Portales II-V.
- No se crearon interiores de portales.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos ni CDN.
- No se tocó `/` ni `/carga`.
- No se modificó la carga inicial V13.

## Validaciones ejecutadas

- `npm run test -- src/screens/Cover/CoverIntroScreen.test.tsx`: OK, 15 tests.
- `npm run test:e2e -- tests/e2e/cover-intro-qa.spec.ts`: OK, 3 tests.
- `npm run lint`: OK.
- `npm run test`: OK, 4 archivos y 31 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
- `npm run validate:cover-intro-assets`: OK, 27 rutas PNG validadas.
- `npm run test:e2e`: OK, 16 tests.

## Próximo ticket recomendado

`TICKET_002J_PORTADA_INTRO_LIA_HYBRID_RIG_FACIAL.md`

Objetivo esperado:

- uso controlado del rig facial de Lía;
- parpadeo;
- ojos neutral / happy / attentive;
- glow de collar si aporta;
- microvida sin saturar;
- sin modificar assets;
- sin coreografía física completa todavía.
