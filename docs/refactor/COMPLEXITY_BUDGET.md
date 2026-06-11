# Presupuesto de complejidad — GVO

Fecha: 2026-06-10
Estado: regla operativa para Codex y refactorización.

## Propósito

Este documento define límites concretos para evitar que tareas simples generen demasiadas capas, archivos o abstracciones.

GVO es una aplicación visual secuencial, mobile-first y local. No debe convertirse en una arquitectura innecesariamente compleja.

## Regla principal

> Para cada ticket, ejecutar el cambio mínimo verificable que cumpla el objetivo sin romper reglas no negociables.

## Principios

1. Primero claridad, luego reutilización.
2. Primero comportamiento estable, luego pulido.
3. Primero ticket pequeño, luego abstracción.
4. Primero duplicación real, luego extracción.
5. Primero documentación útil, luego documentación extensa.
6. Primero assets aprobados, luego animación.
7. Primero validación técnica, luego cierre.

## Umbrales de alerta

Codex debe detenerse y justificar antes de seguir si un cambio:

- toca más de 5 archivos;
- crea más de 2 archivos nuevos;
- agrega una dependencia;
- modifica rutas;
- modifica `vite.config.ts`, `tsconfig.json`, `eslint.config.js` o `package.json`;
- cambia assets runtime;
- cambia copy narrativo aprobado;
- cambia identidad de Lía;
- crea un hook global;
- crea un provider global;
- crea una nueva carpeta arquitectónica genérica;
- mezcla documentación, refactor y feature en un solo ticket.

Estos umbrales no prohíben el cambio, pero obligan a justificarlo y dividirlo si es posible.

## Complejidad permitida

### Permitido en tickets pequeños

- Extraer contenido estático a `*.content.ts`.
- Extraer constantes locales a `*.config.ts`.
- Extraer lógica de estado local a un hook cercano.
- Separar una ruta compleja en un componente de ruta.
- Reducir un componente grande sin cambiar visual.
- Agregar documentación de estado, deuda o handoff.
- Agregar tests de comportamiento existente.

### Permitido con autorización explícita

- Cambiar flujo de rutas.
- Agregar dependencias.
- Cambiar arquitectura de carpetas.
- Cambiar estados de pantalla.
- Cambiar comportamiento visual.
- Cambiar navegación entre estaciones.
- Integrar cámara/QR real.
- Integrar Graphify.
- Preparar `CLAUDE.md` para uso real de Claude Code.

### No permitido por defecto

- Crear arquitectura enterprise.
- Crear state management global si el estado es local.
- Crear providers para datos usados en una sola pantalla.
- Crear servicios genéricos sin consumidores reales.
- Refactorizar por estética sin beneficio operativo.
- Convertir una pantalla en framework interno.
- Introducir patrones para necesidades hipotéticas.

## Regla de dos consumidores

No se debe crear una abstracción reutilizable hasta que existan al menos dos consumidores reales o una necesidad técnica verificable.

Ejemplo:

- Si solo `CoverIntroScreen` usa una lógica, mantenerla dentro de `src/screens/Cover/`.
- Si `CoverIntroScreen` y `World1RootScreen` comparten una lógica de preload, puede vivir en `src/shared/assets/`.

## Regla de cercanía

Las extracciones deben vivir cerca del código que sirven.

Preferir:

```text
src/screens/Cover/useCoverIntroController.ts
```

Evitar sin justificación:

```text
src/core/controllers/useCoverIntroController.ts
```

## Regla de refactor sin cambio visual

Un refactor debe conservar:

- layout;
- copy;
- assets;
- animaciones;
- duración;
- rutas;
- nombres de data attributes usados por QA;
- comportamiento de reduced motion.

Si cambia algo visual, ya no es refactor puro y debe tener ticket funcional o visual.

## Regla de documentación útil

Un documento nuevo debe contestar al menos una de estas preguntas:

- ¿Qué está aprobado?
- ¿Qué está bloqueado?
- ¿Qué deuda queda?
- ¿Qué puede tocar Codex?
- ¿Qué no debe tocar Codex?
- ¿Cómo se valida?
- ¿Qué decisión se tomó?
- ¿Qué debe saber un nuevo chat o nueva herramienta?

Si no responde ninguna, probablemente no debe crearse.

## Regla para README

El README raíz debe servir para onboarding rápido, no para registrar todo el historial.

El historial detallado debe vivir en:

```text
docs/status/
docs/process/
docs/tickets/
docs/decisions/
```

## Regla para estado documental

Si código y documentación se contradicen, no avanzar features.

Primero crear o actualizar un documento de reconciliación en:

```text
docs/status/
```

## Regla para ramas

Usar nombres claros:

```text
baseline/funcional-organizacion-YYYY-MM-DD
feature/<ticket>-descripcion
fix/<ticket>-descripcion
docs/<ticket>-descripcion
refactor/<ticket>-descripcion
```

No crear ramas si el ticket indica commit directo en rama existente.

## Regla para commits

Commits recomendados:

```text
docs: ...
refactor: ...
fix: ...
feat: ...
test: ...
chore: ...
```

Un commit debe tener un tema dominante. Evitar commits que mezclen `feat`, `refactor` y `docs` sin necesidad.

## Checklist antes de ejecutar Codex

- [ ] ¿Existe ticket o alcance explícito?
- [ ] ¿Se leyó `AGENTS.md`?
- [ ] ¿Se leyó este presupuesto de complejidad?
- [ ] ¿El cambio evita dependencias nuevas?
- [ ] ¿El cambio evita recursos externos?
- [ ] ¿El cambio evita audio?
- [ ] ¿El cambio evita tocar identidad de Lía?
- [ ] ¿El cambio se puede validar?
- [ ] ¿El cambio puede dividirse más?

## Checklist antes de cerrar

- [ ] Archivos modificados listados.
- [ ] Validaciones ejecutadas listadas.
- [ ] Validaciones no ejecutadas explicadas.
- [ ] Deuda restante documentada.
- [ ] No se avanzó pantalla sin aprobación.
- [ ] No se introdujo complejidad innecesaria.
- [ ] No se cambió runtime si era ticket documental.
