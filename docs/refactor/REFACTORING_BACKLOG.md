# Backlog de refactorización segura — GVO

Fecha: 2026-06-10
Estado: backlog inicial, no ejecutado.

## Propósito

Este backlog ordena oportunidades de limpieza y refactorización sin cambiar comportamiento runtime. No autoriza por sí mismo ningún cambio. Cada ítem debe ejecutarse mediante ticket pequeño, cerrable y validado.

## Criterios de prioridad

Prioridad alta:

- reduce ambigüedad;
- reduce riesgo de que Codex sobrediseñe;
- mejora onboarding;
- no toca visual;
- no toca assets;
- no requiere dependencias.

Prioridad baja:

- requiere tocar muchas pantallas;
- puede cambiar comportamiento visual;
- depende de decisiones artísticas;
- requiere assets nuevos;
- mezcla limpieza con feature.

## R0 — Reconciliación documental

### R0.1 Actualizar estado real de Mundo I

Tipo: documentación.
Riesgo: bajo.
Archivos esperados:

```text
docs/status/ESTADO_ACTUAL_PROYECTO.md
docs/status/STATUS_RECONCILIATION_2026-06-10.md
README.md
```

Problema:

La documentación histórica indica que `/estacion/1` es placeholder técnico, pero el código reciente contiene una implementación de `World1RootScreen` con estados conceptuales, interacción y assets.

Objetivo:

Definir si el estado correcto es:

```text
PLACEHOLDER_TECNICO
```

 o:

```text
BASE_FUNCIONAL_MUNDO_I / NO_CERRADA_FINAL
```

Criterio de cierre:

- Estado actualizado sin cambiar código.
- Deuda de Mundo I documentada.
- Validación `npm run status` ejecutada o bloqueo reportado.

## R1 — Organización de instrucciones para IA

### R1.1 Consolidar reglas compartidas para Codex y herramientas futuras

Tipo: documentación.
Riesgo: bajo.
Archivos esperados:

```text
AGENTS.md
docs/ai/AI_OPERATING_MANUAL.md
docs/refactor/COMPLEXITY_BUDGET.md
```

Objetivo:

Evitar duplicación de instrucciones y preparar un camino futuro para Claude Code sin depender de él en la fase actual.

Criterio de cierre:

- `AGENTS.md` apunta al manual común.
- El manual común no contradice reglas no negociables.
- No existe `CLAUDE.md` todavía salvo decisión explícita de usar Claude Code.

## R2 — Router

### R2.1 Extraer componentes de ruta desde `src/app/router.tsx`

Tipo: refactor sin cambio visual.
Riesgo: medio-bajo.
Archivos candidatos:

```text
src/app/router.tsx
src/app/routes/QrRoute.tsx
src/app/routes/JourneyLoadingRoute.tsx
src/app/routes/TransitionWorldRuntimeRoute.tsx
```

Problema:

`router.tsx` mezcla definición de rutas, preload, timers, navegación y componentes de ruta.

Objetivo:

Reducir concentración de responsabilidades sin cambiar rutas ni comportamiento.

No cambiar:

- paths;
- navegación;
- tiempos;
- preload;
- reduced motion;
- imports funcionales.

Validación mínima:

```powershell
npm run check
```

Validación recomendada:

```powershell
npm run test:e2e
```

## R3 — Portada / Intro

### R3.1 Extraer controlador local de portada

Tipo: refactor sin cambio visual.
Riesgo: medio.
Archivos candidatos:

```text
src/screens/Cover/CoverIntroScreen.tsx
src/screens/Cover/useCoverIntroController.ts
src/screens/Cover/coverIntroViewModel.ts
```

Problema:

`CoverIntroScreen.tsx` concentra estado, timers, preload, selección de pose, navegación, gating y render.

Objetivo:

Separar lógica de control y derivaciones sin alterar visual, copy, assets, clases ni data attributes.

Restricciones:

- No cambiar CSS.
- No cambiar assets.
- No cambiar textos.
- No cambiar fases.
- No cambiar persistencia.
- No cambiar rutas.

Validación mínima:

```powershell
npm run check
```

Validación recomendada:

```powershell
npm run test:e2e
```

## R4 — Mundo I

### R4.1 Extraer contenido estático de Mundo I

Tipo: refactor sin cambio visual.
Riesgo: medio-bajo.
Archivos candidatos:

```text
src/screens/World1Root/World1RootScreen.tsx
src/screens/World1Root/world1RootContent.ts
```

Problema:

El componente contiene copy, nodos, estados derivados y render.

Objetivo:

Mover contenido estático a un archivo cercano para facilitar revisión narrativa sin tocar layout.

Restricciones:

- No cambiar copy sin aprobación.
- No cambiar estados.
- No cambiar assets.
- No cambiar interacción.

### R4.2 Extraer lógica de estado de nodos

Tipo: refactor sin cambio visual.
Riesgo: medio.
Archivos candidatos:

```text
src/screens/World1Root/World1RootScreen.tsx
src/screens/World1Root/world1RootState.ts
```

Objetivo:

Mover `getNodeState` y tipos relacionados a módulo cercano.

Validación mínima:

```powershell
npm run check
```

## R5 — Documentación de pantallas

### R5.1 Crear índice de pantallas

Tipo: documentación.
Riesgo: bajo.
Archivo sugerido:

```text
docs/screens/SCREEN_INDEX.md
```

Objetivo:

Tener una vista corta del estado de cada pantalla, rutas, assets, madurez, deuda y siguiente restricción.

No reemplaza:

```text
docs/status/ESTADO_ACTUAL_PROYECTO.md
```

Debe actuar como índice rápido.

## R6 — Validación y CI

### R6.1 Agregar workflow CI mínimo

Tipo: infraestructura.
Riesgo: medio.
Archivo candidato:

```text
.github/workflows/ci.yml
```

Objetivo:

Ejecutar `npm ci` y `npm run check` en push/manual.

Condición:

Solo hacerlo si el usuario autoriza usar GitHub Actions. El repo puede necesitar cuidar tiempos, consumo y privacidad operativa.

No hacer por defecto en esta baseline.

## R7 — Graphify futuro

### R7.1 Preparar exclusiones para análisis de grafo

Tipo: documentación/configuración futura.
Riesgo: bajo-medio.

Objetivo:

Documentar cómo ejecutar Graphify sin indexar assets pesados ni carpetas generadas.

Exclusiones sugeridas:

```text
node_modules/
dist/
playwright-report/
test-results/
public/assets/runtime/
assets/reference/
```

Condición:

No ejecutar hasta que el repo tenga estado documental reconciliado y el usuario autorice la instalación/uso.

## Orden recomendado de ejecución

1. R0.1 — Reconciliación documental.
2. R1.1 — Consolidar reglas IA.
3. R5.1 — Índice de pantallas.
4. R2.1 — Router.
5. R4.1 — Contenido estático Mundo I.
6. R4.2 — Estado Mundo I.
7. R3.1 — Controlador portada.
8. R6.1 — CI mínimo, solo si se autoriza.
9. R7.1 — Graphify, solo después de limpieza.

## Regla de cierre

Cada ítem debe cerrarse con:

- resumen;
- archivos modificados;
- validaciones;
- deudas;
- riesgos;
- confirmación de que no hubo cambio visual si era refactor.
