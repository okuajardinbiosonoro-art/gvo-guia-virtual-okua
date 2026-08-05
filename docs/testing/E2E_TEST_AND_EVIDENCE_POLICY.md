# Política de pruebas E2E y evidencia versionada

## Autoridad y propósito

Esta guía separa la validación ordinaria de Playwright de la actualización
deliberada de evidencia histórica. No cambia el significado de las assertions ni
convierte una prueba técnica en aprobación humana.

## Suite normal read-only

```powershell
npm run test:e2e
```

La suite normal no escribe en `docs/visual`, `docs/status`, `public` ni en otro
path tracked. Capturas, JSON, métricas, contact sheets y comparaciones generados
durante una ejecución ordinaria quedan bajo:

```text
test-results/evidence/<scope>/
```

`test-results` es output ignorado de Playwright. Estos artefactos sirven para
diagnosticar la ejecución actual y no deben añadirse al repositorio.

Las evidencias tracked existentes que una spec consume como baseline son
fixtures read-only: pueden leerse, pero nunca sobrescribirse durante
`npm run test:e2e`.

## Generación explícita de evidencia tracked

La actualización de evidencia histórica usa un comando separado, exige un scope
allowlisted y ejecuta únicamente su spec asociada:

```powershell
npm run test:e2e:evidence -- --scope <scope>
```

Antes de escribir, inspeccionar el destino sin modificarlo:

```powershell
npm run test:e2e:evidence -- --scope <scope> --dry-run
```

Scopes disponibles:

```text
cover-intro-002i-fix2
cover-intro-002j-fix
cover-intro-002k
cover-intro-002l
cover-to-transition-t003e8
transition-copy-st5-020i
transition-world-t003e7c
world5-st5-020b
world5-st5-020d
world5-st5-020h
```

El wrapper es Node cross-platform: no depende de sintaxis de variables de
entorno de Bash. Rechaza ausencia de `--scope`, scopes desconocidos, argumentos
no reconocidos y selecciones fuera de la allowlist. El resolver exige además
modo, intención y scope exactos, y rechaza rutas absolutas o traversal `..`.

El comando explícito puede modificar sólo el directorio histórico asociado al
scope seleccionado. No debe ejecutarse como parte de validaciones ordinarias ni
sin un ticket que autorice actualizar esa evidencia.

## Comprobación del worktree

Antes de la suite normal, capturar en un output ignorado:

```powershell
git status --porcelain=v1 > test-results/worktree-before-status.txt
git diff --name-status > test-results/worktree-before-diff.txt
```

Después de la suite, repetir con nombres `after` y comparar:

```powershell
git status --porcelain=v1 > test-results/worktree-after-status.txt
git diff --name-status > test-results/worktree-after-diff.txt
Compare-Object (Get-Content test-results/worktree-before-status.txt) (Get-Content test-results/worktree-after-status.txt)
Compare-Object (Get-Content test-results/worktree-before-diff.txt) (Get-Content test-results/worktree-after-diff.txt)
```

Una ejecución read-only debe producir comparaciones vacías. No se permite usar
`git restore`, `git checkout`, `git clean` ni borrar evidencia tracked después
de la suite para ocultar efectos laterales.

## Aprobación

Generar o actualizar una captura, métrica o JSON no equivale a aprobación
humana. La evidencia tracked sólo adquiere autoridad cuando el ticket aplicable
la revisa, aprueba y publica mediante el flujo documental del proyecto.
