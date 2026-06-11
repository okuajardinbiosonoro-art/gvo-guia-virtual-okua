# Flujo de trabajo con Codex — GVO

Fecha: 2026-06-10
Estado: guía operativa para la fase de organización y limpieza.

## Propósito

Este documento define cómo usar Codex en GVO sin complicar el repositorio. La prioridad es mejorar claridad, documentación y eficiencia antes de hacer nuevas features.

## Rama actual de trabajo

```text
baseline/funcional-organizacion-2026-06-10
```

Esta rama protege una versión funcional y agrega documentación de gobierno. No debe usarse para introducir cambios visuales o nuevas pantallas.

## Orden correcto de instalación local

Desde una copia limpia del repo:

```powershell
git clone https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git
cd gvo-guia-virtual-okua
git fetch --all
git checkout baseline/funcional-organizacion-2026-06-10
npm install
npm run status
npm run check
```

Para desarrollo visual:

```powershell
npm run dev
```

Para pruebas e2e mobile:

```powershell
npm run test:e2e
```

## Orden correcto antes de pedir una tarea a Codex

1. Definir ticket pequeño.
2. Indicar rama exacta.
3. Indicar si puede tocar código o solo documentación.
4. Indicar validación mínima esperada.
5. Indicar qué archivos debe leer antes de modificar.
6. Prohibir explícitamente nuevas dependencias salvo autorización.
7. Prohibir cambios visuales si el ticket es de limpieza.

## Archivos que Codex debe leer primero

```text
README.md
AGENTS.md
docs/ai/AI_OPERATING_MANUAL.md
docs/refactor/COMPLEXITY_BUDGET.md
docs/status/BASELINE_FUNCIONAL_2026-06-10.md
docs/status/STATUS_RECONCILIATION_2026-06-10.md
docs/refactor/REFACTORING_BACKLOG.md
```

## Plantilla de prompt para Codex

```text
Trabaja en la rama: baseline/funcional-organizacion-2026-06-10.

Objetivo del ticket:
[DESCRIBIR EN UNA FRASE]

Alcance permitido:
- [documentación / refactor sin cambio visual / test / fix puntual]

Restricciones:
- No implementar nuevas pantallas.
- No agregar dependencias.
- No cambiar rutas.
- No cambiar assets runtime.
- No cambiar identidad de Lía.
- No cambiar comportamiento visual si el ticket es de limpieza.
- No mezclar feature y refactor.

Lee antes de modificar:
- README.md
- AGENTS.md
- docs/ai/AI_OPERATING_MANUAL.md
- docs/refactor/COMPLEXITY_BUDGET.md
- docs/refactor/REFACTORING_BACKLOG.md

Validación esperada:
- npm run status
- npm run check, si se toca código

Entrega final:
- archivos creados
- archivos modificados
- validaciones ejecutadas
- validaciones no ejecutadas y motivo
- deuda restante
- riesgos
- estado final
```

## Modo recomendado para esta fase

Usar Codex en modo conservador:

- tareas cortas;
- un objetivo por ticket;
- cambios pequeños;
- documentación primero;
- refactors solo después de reconciliar estado;
- validación antes de cerrar.

## Orden de tickets sugerido

1. Reconciliar README y estado documental.
2. Crear índice de pantallas.
3. Preparar backlog de limpieza por pantalla.
4. Refactorizar router sin cambio visual.
5. Refactorizar Mundo I por contenido estático.
6. Refactorizar portada solo si sigue siendo necesario.
7. Evaluar CI mínimo.
8. Evaluar Graphify.
9. Preparar Claude Code solo cuando realmente se vaya a usar.

## Señales de que Codex se está saliendo de control

Detener la tarea si Codex intenta:

- crear arquitectura genérica;
- tocar muchas carpetas a la vez;
- crear hooks globales sin necesidad;
- agregar librerías;
- cambiar CSS en un ticket documental;
- cambiar copy narrativo sin autorización;
- abrir avance hacia otra estación;
- resolver deuda visual con placeholders.

## Cierre correcto de una tarea

Codex debe cerrar con un reporte operativo, no con recomendaciones abiertas.

Formato:

```text
Rama:
Objetivo:
Archivos creados:
Archivos modificados:
Validaciones ejecutadas:
Validaciones no ejecutadas:
Deuda restante:
Riesgos:
Estado final:
```
