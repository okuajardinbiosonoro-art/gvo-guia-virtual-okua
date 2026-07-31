# Roadmap GVO

Actualizado: 2026-07-30

## Estado consolidado

- Mundo I: funcional, con deuda visual documentada.
- Mundo II: finalizado para el alcance actual.
- Transición Mundo II → Mundo III: definitiva, pasiva y automática.
- Mundo III / Estación III: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo IV / Estación IV: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo V: mapa, cuatro áreas y 4/4 bajo `ST5_020G_HUMAN_APPROVED`; cierre global y salida publicados como `ST5_020H_PUBLISHED_PENDING_HUMAN_REVIEW`.
- Final: experiencia temporal preexistente, no cerrada y no aprobada.

## Revisión activa

El único umbral abierto es la revisión humana de 020H:

```text
overview 4/4 + CTA Ir al cierre
→ persistencia global
→ guardas de transición y Final
→ transición W5→Final
→ arribo al Mirador temporal
```

No se declara todavía aprobación humana de 020H, cierre aprobado de Final ni
autorización para construir el Mirador.

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
- No promover 020H a `HUMAN_APPROVED` sin decisión explícita del usuario.
- No iniciar Mundo VI.
- No cerrar el Mirador final por inferencia.
