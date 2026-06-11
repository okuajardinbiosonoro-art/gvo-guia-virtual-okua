---
name: Ticket GVO
about: Trabajo pequeño, cerrable, documentado y probado para GVO
title: "TICKET_"
labels: ticket
assignees: ""
---

## Objetivo

## Alcance

## Fuera de alcance

## Criterios de aceptación

- [ ]

## Validación requerida

- [ ] Definir si el ticket es `SOLO_LECTURA` o `ESCRITURA_AUTORIZADA`.
- [ ] Para `SOLO_LECTURA`: usar solo inspección local y no ejecutar scripts que escriban artefactos.
- [ ] Para `ESCRITURA_AUTORIZADA`: ejecutar las validaciones que correspondan al alcance aprobado.
- [ ] `npm run lint` si el ticket toca código o reglas lint.
- [ ] `npm run test` si el ticket toca código, flujo o lógica.
- [ ] `npm run build` solo si el ticket autoriza artefactos/build.
- [ ] `npm run audit:assets` si se modifican o validan assets/runtime local.
- [ ] Reportar explícitamente cualquier validación no ejecutada y el motivo.

## Documentación a actualizar
