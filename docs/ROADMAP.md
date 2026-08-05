# Roadmap GVO

Actualizado: 2026-08-04

## Estado consolidado

- Mundo I: funcional, con deuda visual documentada.
- Mundo II: finalizado para el alcance actual.
- Seis transiciones runtime: `TRANSITION_COPY_AUDIT_COMPLETE`, doce piezas
  finales, pasivas y automáticas.
- Mundo III / Estación III: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo IV / Estación IV: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo V: `ST5_020H_HUMAN_APPROVED` y
  `ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL`.
- Final: Gates 1–7 cerrados. Gate 5 conserva los 19 assets aprobados y sus
  mirrors; Gate 6 publica la composición estática responsive portrait/landscape
  y Gate 7 publica greeting, idle, reduced motion y visibility handling como
  `LIA MOTION / HUMAN_APPROVED / COMPLETE`. Persistencia, offline-first,
  fullscreen, retorno global y reset real siguen pendientes.

## Cierre vigente

El alcance de Estación V está humanamente aprobado:

```text
overview 4/4 + CTA Ir al cierre
→ persistencia global
→ guardas de transición y Final
→ transición W5→Final
→ arribo al Mirador temporal
```

`ST5_020I_PUBLISHED_COMPLETE` cierra el copy de todas las transiciones. 021C
aprueba humanamente la dirección visual de preproducción del Mirador.
`GVO_FINAL_021I` cierra Gate 5 con 19 assets runtime, 19 mirrors y cinco fuentes
de producción preservadas. 021J, R1 y 021K implementan la composición estática;
021L registra su aprobación humana final y publica Gate 6. 021M implementa y
documenta el motion ceremonial de Lía; 021N registra su aprobación humana y
publica Gate 7.

## Frente de preproducción completado

La secuencia 021B–021H cerró blueprint, aprobación humana, briefs de producción,
corrección de Lía y copy editorial. `GVO_FINAL_021I` verificó el paquete aprobado
por hash y metadata, registró los 19 assets canónicos y cerró Gate 5. 021J, R1,
021K y 021L implementan, refinan, aprueban y publican la composición estática
responsive. 021M y 021N implementan, aprueban y publican el motion de Lía. El
siguiente microfrente es
`GVO_FINAL_021O_REVISIT_RETURN_AND_REAL_RESET_BEHAVIOR`.

## Gates obligatorios para el Mirador

```text
Audit ✓
→ Preproduction ✓
→ Asset production ✓ (Gate 5)
→ Static composition ✓ (Gate 6)
→ Motion/ceremonial behavior ✓ (021M)
→ Human approval ✓ (021N)
→ Documentation ✓
→ Commit/push ✓
→ Revisit return and real reset behavior (021O)
```

La base existente del Mirador no permite omitir gates ni declarar visuales
procedurales como assets finales. Mobile compacto, landscape, cámara, artboard,
anchors, alpha-aware alignment, accesibilidad y reduced motion se diseñan desde
preproducción.

## Fuera del alcance inmediato

- No reabrir Estación IV salvo regresión reproducible.
- No alterar el copy final ni las rutas de transición sin ticket específico.
- No iniciar Mundo VI.
- No cerrar el Mirador final por inferencia.
- No implementar persistencia offline-first transversal ni fullscreen dentro
  del cierre de motion 021N.
- No iniciar retorno global o reset real antes del ticket 021O.
