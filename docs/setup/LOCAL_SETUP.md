# Instalación y ejecución local — GVO

Fecha: 2026-06-10
Estado: guía operativa para desarrollo local y trabajo con Codex.

## Propósito

Esta guía describe el orden correcto para instalar, ejecutar y validar GVO en entorno local sin agregar complejidad al repo.

GVO debe mantenerse como aplicación web local, mobile-first e insonora. Las herramientas de desarrollo pueden usar Internet para instalar dependencias, pero el runtime de la app no debe depender de Internet.

## Requisitos

- Git.
- Node.js compatible con el stack actual.
- npm.
- Navegador Chromium o compatible para pruebas manuales.
- Opcional: Playwright instalado mediante dependencias del proyecto.

## Clonar el repositorio

```powershell
git clone https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git
cd gvo-guia-virtual-okua
```

## Usar la rama baseline organizacional

```powershell
git fetch --all
git checkout baseline/funcional-organizacion-2026-06-10
```

Esta rama sirve como punto de organización, documentación y limpieza. No introduce cambios runtime por sí misma.

## Instalar dependencias

```powershell
npm install
```

No agregar dependencias nuevas durante tareas de documentación o limpieza. Cualquier dependencia nueva requiere ticket explícito y justificación.

## Ejecutar en desarrollo

```powershell
npm run dev
```

La app se sirve con Vite y `--host 0.0.0.0`, lo cual permite probar desde otros dispositivos de la red local cuando el firewall y la red lo permiten.

Rutas principales para revisión manual:

```text
/
/carga
/portada
/transition/intro-to-station-1
/estacion/1
/final
/qr/1
```

## Validar estado documental

```powershell
npm run status
```

Este comando imprime el estado del proyecto usando `tools/print_project_status.mjs` y `docs/status/ESTADO_ACTUAL_PROYECTO.md`.

## Validar código

```powershell
npm run lint
npm run test
npm run build
```

Validación combinada:

```powershell
npm run check
```

`npm run check` ejecuta lint, tests unitarios y build.

## Ejecutar pruebas e2e

```powershell
npm run test:e2e
```

Playwright usa configuración mobile Chromium y arranca el servidor en `http://127.0.0.1:4174`.

## Validar assets

Comandos existentes:

```powershell
npm run audit:assets
npm run assets:validate:loading
npm run validate:cover-intro-assets
npm run validate:transition-root-assets
```

Usar estos comandos cuando el ticket toque assets, rutas de assets o pantallas con preload.

## Orden recomendado de validación por tipo de cambio

### Solo documentación

```powershell
npm run status
```

### Refactor sin cambio visual

```powershell
npm run check
```

### Cambio de pantalla, transición o flujo visual

```powershell
npm run check
npm run test:e2e
```

### Cambio de assets

```powershell
npm run audit:assets
npm run check
npm run test:e2e
```

## Reglas de instalación

No instalar ni agregar al repo:

- librerías de audio;
- servicios externos runtime;
- CDN;
- fuentes remotas;
- paquetes 3D pesados;
- dependencias de arquitectura sin necesidad comprobada;
- herramientas que obliguen al visitante a instalar algo.

## Flujo recomendado con Codex

1. Crear o seleccionar rama.
2. Leer `README.md`, `AGENTS.md` y `docs/ai/AI_OPERATING_MANUAL.md`.
3. Definir ticket pequeño.
4. Ejecutar cambio mínimo.
5. Validar.
6. Reportar archivos, validaciones y deuda.

## Problemas comunes

### La app no abre desde el celular

Verificar:

- que `npm run dev` esté corriendo;
- que PC y celular estén en la misma red;
- que el firewall permita conexiones entrantes;
- que se use la IP local correcta de la máquina anfitriona.

### Falla Playwright

Verificar:

```powershell
npx playwright install
```

Solo ejecutar si el entorno local lo requiere.

### Falla build por TypeScript

Ejecutar:

```powershell
npm run lint
npm run test
npm run build
```

Identificar si el error viene de lint, test o build antes de modificar código.

## Criterio de cierre local

Antes de cerrar un ticket técnico, dejar registrado:

- comandos ejecutados;
- resultado;
- comandos no ejecutados;
- motivo;
- deuda restante;
- si hubo o no cambio visual.
