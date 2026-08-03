# Roadmap GVO

Actualizado: 2026-08-03

## Estado consolidado

- Mundo I: funcional, con deuda visual documentada.
- Mundo II: finalizado para el alcance actual.
- Seis transiciones runtime: `TRANSITION_COPY_AUDIT_COMPLETE`, doce piezas
  finales, pasivas y automáticas.
- Mundo III / Estación III: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo IV / Estación IV: `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.
- Mundo V: `ST5_020H_HUMAN_APPROVED` y
  `ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL`.
- Final: runtime temporal y no cerrado; preproducción con Gates 1–4 cerrados y
  Art Bible/cámara `HUMAN_APPROVED` por `GVO_FINAL_021C`, sin assets finales ni
  implementación.

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
aprueba humanamente la dirección visual de preproducción del Mirador, pero no
declara cierre ni aprobación de su runtime.

## Frente de preproducción completado

`GVO_FINAL_021E_ACCESS_AND_LABEL_ASSET_PRODUCTION_BRIEFS` audita los seis
Environment aprobados en Descargas como referencias `NOT_RUNTIME` y deja seis
briefs, cinco overlays y el reference pack de accesos I–V/placa `READY`; no
produce esos seis assets ni implementa runtime. La siguiente acción bajo ticket
posterior es producir únicamente
`FINAL-ACCESS-I-001 — final_access_world1_root_v01.webp` y revisarlo
humanamente. No iniciar ACCESS-II antes de esa revisión.

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
- No alterar el copy final ni las rutas de transición sin ticket específico.
- No iniciar Mundo VI.
- No cerrar el Mirador final por inferencia.
