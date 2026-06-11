# Manual operativo para IA — GVO

Fecha: 2026-06-10
Aplica a: Codex ahora; Claude Code u otras herramientas en fases posteriores.

## Propósito

Este documento es la fuente común para asistentes de IA que trabajen sobre GVO. Su función es reducir ambigüedad, evitar sobrediseño y proteger las reglas no negociables del proyecto.

`AGENTS.md` puede contener reglas específicas para Codex. Un futuro `CLAUDE.md` puede contener reglas específicas para Claude Code. Ambos deben apuntar a este manual en vez de duplicar instrucciones divergentes.

## Descripción corta del proyecto

GVO — Guía Virtual OKÚA es una aplicación web local, mobile-first e insonora para acompañar un recorrido físico mediante QR dentro de una red MikroTik sin Internet.

El visitante abre la guía desde el navegador móvil. No instala nada. La experiencia debe funcionar sin CDN, APIs externas, fuentes remotas, imágenes remotas ni servicios en línea durante runtime.

## Reglas no negociables

La fuente canónica está en:

```text
docs/01_REGLAS_NO_NEGOCIABLES.md
```

Resumen operativo:

1. Sin Internet en runtime.
2. Sin descarga ni instalación para visitante.
3. Mobile-first.
4. Sin audio.
5. Sin recursos externos.
6. Lía es el único avatar guía.
7. Lía conserva exactamente cinco pétalos.
8. Flujo secuencial.
9. Tickets pequeños.
10. Documentación obligatoria para cambios de arquitectura, flujo, identidad u operación.

## Orden de lectura obligatorio antes de trabajar

Antes de ejecutar cambios, leer:

```text
README.md
AGENTS.md
docs/01_REGLAS_NO_NEGOCIABLES.md
docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md
docs/status/ESTADO_ACTUAL_PROYECTO.md
docs/status/BASELINE_FUNCIONAL_2026-06-10.md
docs/refactor/COMPLEXITY_BUDGET.md
```

Si el ticket toca pantallas, leer también la documentación específica de esa pantalla y los handoffs aplicables.

## Principio de trabajo

La IA debe actuar como ejecutor técnico disciplinado, no como arquitecto autónomo del producto.

La IA puede:

- ordenar documentación;
- proponer micro-refactors;
- ejecutar cambios acotados;
- mejorar legibilidad;
- crear checklists;
- detectar discrepancias;
- reportar deuda;
- validar con comandos existentes.

La IA no puede sin ticket explícito:

- crear pantallas nuevas;
- cambiar flujo de estaciones;
- inventar assets finales;
- alterar identidad visual de Lía;
- agregar servicios externos;
- agregar dependencias pesadas;
- introducir audio, video runtime pesado o 3D;
- declarar una pantalla como final sin aprobación explícita del usuario Ing. José David.

## Presupuesto de complejidad

La fuente detallada está en:

```text
docs/refactor/COMPLEXITY_BUDGET.md
```

Regla corta:

> Para tareas simples, preferir el cambio mínimo verificable antes que una nueva abstracción.

## Política de refactorización

Un refactor válido debe cumplir:

- Sin cambio visual salvo autorización explícita.
- Sin cambio narrativo salvo autorización explícita.
- Sin cambio de rutas salvo autorización explícita.
- Sin nuevas dependencias salvo autorización explícita.
- Sin mezclar feature y limpieza.
- Con validación técnica reportada.

Tipos de refactor permitidos por defecto:

- mover lógica pura a archivo cercano;
- extraer constantes o contenido estático;
- reducir tamaño de componentes grandes;
- eliminar duplicación real;
- mejorar nombres sin cambiar comportamiento;
- agrupar documentación dispersa con índices claros.

Tipos de refactor prohibidos por defecto:

- reescribir arquitectura completa;
- introducir state machines globales;
- crear providers globales sin necesidad comprobada;
- mover todo a una arquitectura genérica;
- crear frameworks internos;
- crear capas `core`, `domain`, `services` o similares si no hay dolor real demostrado.

## Política de documentación

La documentación debe ayudar a decidir y ejecutar. No debe convertirse en burocracia.

Cada documento nuevo debe tener:

- propósito claro;
- fecha;
- alcance;
- relación con archivos existentes;
- estado o criterio de uso;
- instrucciones accionables cuando aplique.

No crear documentos duplicados si ya existe uno equivalente.

## Política de archivos grandes

Si un archivo funcional supera una responsabilidad clara, preferir extracción local y cercana.

Ejemplo aceptable:

```text
src/screens/Cover/CoverIntroScreen.tsx
src/screens/Cover/useCoverIntroController.ts
src/screens/Cover/coverIntroViewModel.ts
```

Ejemplo no aceptable sin justificación fuerte:

```text
src/core/application/useCases/coverIntro/...
src/domain/entities/...
src/infrastructure/adapters/...
```

GVO no requiere arquitectura enterprise para resolver pantallas visuales secuenciales.

## Política de assets

Los assets runtime deben permanecer locales.

Antes de usar o mover assets:

- verificar ruta;
- verificar que el asset sea aprobado o autorizado;
- no renombrar masivamente sin necesidad;
- no reemplazar identidad visual;
- no incrustar texto final en imagen si puede vivir en DOM/CSS;
- no animar placeholders como si fueran assets finales.

## Política de rutas

Las rutas existentes son parte del contrato operativo del proyecto.

Cambios de rutas requieren ticket explícito y documentación.

Rutas relevantes actuales:

```text
/
/carga
/portada
/transition/intro-to-station-1
/dev/transition-world
/dev/world1-root-layout
/estacion/1
/estacion/:stationId
/final
/qr/:stationId
```

## Flujo de trabajo recomendado con Codex

1. Leer contexto.
2. Confirmar alcance del ticket.
3. Identificar archivos tocados.
4. Ejecutar el cambio mínimo.
5. Ejecutar validaciones disponibles.
6. Reportar exactamente:
   - archivos creados;
   - archivos modificados;
   - validaciones ejecutadas;
   - validaciones no ejecutadas;
   - riesgos;
   - deuda restante;
   - estado final.

## Preparación futura para Claude Code

Cuando se use Claude Code, crear un `CLAUDE.md` breve con:

```md
# Claude Code — GVO

Lee primero `docs/ai/AI_OPERATING_MANUAL.md`.
Respeta `AGENTS.md` cuando trabajes en tareas equivalentes a Codex.
No dupliques instrucciones; usa el manual común como fuente principal.
```

No crear `CLAUDE.md` todavía si la herramienta no se va a usar en la fase actual.

## Uso futuro de Graphify

Graphify puede ser útil después de una primera limpieza documental y de código.

No usarlo como requisito para avanzar ahora.

Si se usa, excluir directorios ruidosos:

```text
node_modules/
dist/
playwright-report/
test-results/
public/assets/runtime/
assets/reference/
```

El resultado deseable sería un mapa técnico para onboarding y análisis de impacto, no una nueva fuente de verdad que reemplace la documentación del repo.

## Criterio de éxito para IA

La intervención de IA es exitosa si:

- reduce ambigüedad;
- reduce archivos innecesarios;
- preserva reglas del proyecto;
- facilita revisar cambios;
- mantiene tickets cerrables;
- deja validaciones claras;
- permite que el usuario decida visual y narrativamente.

La intervención falla si:

- agrega arquitectura por gusto;
- mezcla features con limpieza;
- crea documentos redundantes;
- cambia la experiencia sin aprobación;
- aumenta dependencias;
- vuelve más difícil explicar el estado del proyecto.
