# Baseline funcional y organizacional — 2026-06-10

Fecha: 2026-06-10
Rama: `baseline/funcional-organizacion-2026-06-10`
Commit base detectado: `71cd6c3669dff574772510ab36de36f0a63c1f90`
Tipo de intervención: documentación, gobierno del repo y preparación de flujo con Codex.

## Propósito

Esta rama conserva una fotografía operativa de la versión funcional actual de GVO y agrega una capa documental para mejorar organización, limpieza, refactorización y trabajo asistido por IA sin modificar comportamiento runtime.

La intención no es complicar el proyecto ni introducir nuevas herramientas obligatorias. La intención es poner límites claros para que Codex, y eventualmente Claude Code u otra herramienta avanzada, trabajen con menos ambigüedad y menos tendencia a sobrediseñar.

## Alcance de esta baseline

Incluido:

- Documentación de operación para IA.
- Presupuesto de complejidad.
- Backlog inicial de refactorización segura.
- Reconciliación entre estado documental y estado real observado.
- README raíz más explícito para onboarding humano y técnico.
- Reglas reforzadas para Codex en `AGENTS.md`.

No incluido:

- No se implementan nuevas pantallas.
- No se cambia navegación runtime.
- No se agregan dependencias.
- No se agregan librerías de audio, video, 3D ni servicios externos.
- No se modifican assets runtime.
- No se refactoriza código funcional todavía.
- No se crea obligación de usar Claude Code.
- No se integra Graphify todavía.

## Estado funcional protegido

Esta baseline debe tratarse como versión de referencia para cualquier limpieza posterior. Antes de hacer refactors o nuevas features, se debe poder volver mentalmente a este punto y responder:

1. ¿Qué comportamiento ya funcionaba?
2. ¿Qué deuda estaba documentada?
3. ¿Qué estaba aprobado solo para avanzar y qué estaba cerrado final?
4. ¿Qué parte era placeholder, base funcional o pantalla final?

## Reglas de protección

Durante una fase de limpieza desde esta baseline:

- Todo cambio debe ser pequeño y reversible.
- Un ticket de limpieza no debe implementar features.
- Un ticket de documentación no debe cambiar runtime.
- Un refactor no debe cambiar visual ni flujo salvo que el ticket lo autorice explícitamente.
- Si una tarea requiere tocar más de 5 archivos, debe dividirse o justificarse por escrito antes de ejecutar.
- Si el cambio crea una nueva abstracción, debe explicar qué duplicación real elimina.
- Si no elimina duplicación real, probablemente no debe hacerse.

## Validaciones esperadas

Cuando el entorno local lo permita:

```powershell
npm install
npm run status
npm run lint
npm run test
npm run build
npm run check
npm run test:e2e
```

Validación mínima para documentación pura:

```powershell
npm run status
```

Validación técnica mínima antes de cerrar un refactor:

```powershell
npm run check
```

Validación visual recomendada antes de cerrar cambios de pantalla:

```powershell
npm run test:e2e
```

## Uso de esta rama

Esta rama puede usarse como:

- checkpoint documental;
- base de auditoría;
- punto de partida para tickets de limpieza;
- referencia para preparar Codex;
- referencia futura para Claude Code;
- punto previo a una eventual ejecución de Graphify.

No debe usarse como excusa para abrir una fase de arquitectura pesada. El objetivo es hacer el repo más claro, no más sofisticado.

## Criterio de éxito

Esta baseline se considera útil si permite que el siguiente trabajo sea más simple, más verificable y más fácil de auditar.

Se considera fallida si provoca:

- más archivos sin propósito claro;
- nuevas capas de abstracción innecesarias;
- duplicación de instrucciones entre herramientas;
- avance funcional sin ticket;
- refactors mezclados con features;
- dependencia de una herramienta que todavía no se usa.
