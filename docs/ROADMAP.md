# Roadmap GVO

Actualizado: 2026-08-05

## Estado consolidado

- Mundo I: funcional, con deuda visual documentada.
- Mundo II: finalizado para el alcance actual.
- Seis transiciones runtime: `TRANSITION_COPY_AUDIT_COMPLETE`, doce piezas
  finales, pasivas y automáticas.
- Mundo III / Estación III: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo IV / Estación IV: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo V: `ST5_020H_HUMAN_APPROVED` y
  `ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL`.
- Final: Gates 1–8 cerrados. Gate 5 conserva los 19 assets aprobados y sus
  mirrors; Gate 6 publica la composición responsive portrait/landscape; Gate 7
  publica greeting, idle, reduced motion y visibility handling; Gate 8 publica
  retorno en revisita y reset real con snapshot, rollback y retry. La fase queda
  `GVO FINAL — MIRADOR PHASE / COMPLETE`.

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
publica Gate 7. 021O implementa el retorno en revisita y el reset real; la
aprobación humana vinculante de 021P publica el changeset, cierra Gate 8 y
finaliza la fase del Mirador.

## Frente de preproducción completado

La secuencia 021B–021H cerró blueprint, aprobación humana, briefs de producción,
corrección de Lía y copy editorial. `GVO_FINAL_021I` verificó el paquete aprobado
por hash y metadata, registró los 19 assets canónicos y cerró Gate 5. 021J, R1,
021K y 021L implementan, refinan, aprueban y publican la composición estática
responsive. 021M y 021N implementan, aprueban y publican el motion de Lía. 021O
y 021P implementan, aprueban y publican revisita, retorno y reset real. La fase
del Mirador está completa; la fase activa pasa a `PROJECT DEBT CORRECTION`.

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
→ Revisit return and real reset behavior ✓ (021O)
→ Human approval and Gate 8 publication ✓ (021P)
```

La base existente del Mirador no permite omitir gates ni declarar visuales
procedurales como assets finales. Mobile compacto, landscape, cámara, artboard,
anchors, alpha-aware alignment, accesibilidad y reduced motion se diseñan desde
preproducción.

## Siguiente fase — corrección de deudas

- No reabrir Estación IV salvo regresión reproducible.
- No alterar el copy final ni las rutas de transición sin ticket específico.
- No iniciar Mundo VI.
- No tocar el Mirador salvo regresión reproducible.
- Primera acción: `GVO_DEBT_001_PROJECT_DEBT_AUDIT_AND_PRIORITIZATION`.
- El primer ticket sólo inventariará evidencia, dependencias, riesgo, prioridad y
  roadmap; no implementará masivamente las deudas.
- Deudas transferidas: consistencia de progreso entre Mundos, persistencia
  versionada, hidratación antes de guards, recuperación tras reload/reconexión,
  continuidad offline-first, fullscreen, auditoría de Mundos I–V, optimización
  del chunk principal y documentación del reporte de plugin timings.
