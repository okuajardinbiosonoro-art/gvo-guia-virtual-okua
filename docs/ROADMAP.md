# Roadmap GVO

Actualizado: 2026-07-22

## Estado consolidado

- Mundo I: funcional, con deuda visual documentada.
- Mundo II: finalizado para el alcance actual.
- Transición Mundo II → Mundo III: definitiva, pasiva y automática.
- Mundo III / Estación III: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo IV / Estación IV: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo V: base Fable funcional, probada y documentada; visuales de área procedurales/reemplazables, no cerrada y no aprobada por revisión humana.
- Final: experiencia temporal preexistente, no cerrada y no aprobada.

## Siguiente frente real

El siguiente frente es exclusivamente:

```text
ST5-019A — read-only audit e inventario maestro
```

Esa auditoría debe confirmar el estado real de paths, base Fable, assets, copy,
lógica, rutas, responsive, fullscreen/PWA, accesibilidad, deuda y riesgos. No
autoriza todavía generar assets ni programar Estación V.

Secuencia propuesta posterior, siempre sujeta a tickets separados y aprobación:

```text
ST5-019A — read-only audit e inventario maestro
ST5-019B — narrativa, interacción, cámara, responsive y blueprint
ST5-ASSETS — producción uno por uno
ST5-019C — static composition
ST5-019D — immersive layout
ST5-019E — motion/interaction
ST5-019F — closeout
```

## Gates obligatorios para Estación V

```text
Audit
→ Preproduction
→ Asset production
→ Static composition
→ Immersive layout
→ Motion/interaction
→ Human approval
→ Documentation
→ Commit/push
```

La base existente de Mundo V no permite omitir gates ni declarar visuales
procedurales como assets finales. Mobile compacto, landscape, cámara, artboard,
anchors, alpha-aware alignment, accesibilidad y reduced motion se diseñan desde
preproducción.

## Fuera del alcance inmediato

- No reabrir Estación IV salvo regresión reproducible.
- No alterar copy o rutas de transiciones marcadas `TEMP` sin ticket específico.
- No declarar Mundo V cerrado, asset-complete o `HUMAN_APPROVED`.
- No iniciar Mundo VI.
- No cerrar el Mirador final por inferencia.
