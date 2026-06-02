# T003E7D - Loading Initial typography tokens

## 1. Resumen del ticket

T003E7D aplica los tokens tipograficos globales GVO unicamente a la pantalla de Carga Inicial, disponible en:

- `/`
- `/carga`

El cambio reemplaza declaraciones tipograficas locales por tokens globales ya definidos en `src/styles/tokens.css`, preservando la apariencia visual aprobada de Carga Inicial. No redisenia la pantalla, no cambia layout, no cambia animaciones, no modifica assets y no toca Portada / Intro ni TransitionWorld.

## 2. Rama base y rama final

- Rama base: `feature/003E7C-transition-world-typography-tokens`
- Commit base: `ef96a4a style: apply typography tokens to transition world`
- Rama final: `feature/003E7D-loading-initial-typography-tokens`

## 3. Declaraciones tipograficas encontradas en Carga Inicial

En `src/screens/LoadingInitial/LoadingInitialScreen.css` se encontraron declaraciones locales para el bloque de copy de Carga Inicial:

### Stack local

```css
--loading-font-pixel:
  "Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif;
```

### Titulo principal

```css
font-family: var(--loading-font-pixel);
font-size: 1.68rem;
font-weight: 590;
line-height: 1.04;
letter-spacing: 0;
```

### Subtitulo

```css
font-family: var(--loading-font-pixel);
font-size: 1.02rem;
font-weight: 500;
line-height: 1.24;
letter-spacing: 0;
```

### Ajustes responsive previos

```css
font-size: 1.44rem;
font-size: 0.9rem;
font-size: 1.38rem;
```

## 4. Tokens aplicados

Se aplicaron estos tokens globales:

- `--gvo-font-heading`
- `--gvo-font-microcopy`
- `--gvo-text-title-size`
- `--gvo-text-heading-size`
- `--gvo-text-body-size`
- `--gvo-text-microcopy-size`
- `--gvo-font-weight-semibold`
- `--gvo-font-weight-medium`
- `--gvo-line-height-heading`
- `--gvo-line-height-ui`
- `--gvo-letter-spacing-pixel-normal`

## 5. Decision de titulo principal

El titulo `Preparando el recorrido` usa ahora:

```css
font-family: var(--gvo-font-heading);
font-size: clamp(var(--gvo-text-title-size), 6.89vw, 1.68rem);
font-weight: var(--gvo-font-weight-semibold);
line-height: var(--gvo-line-height-heading);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Se mantuvo un `clamp()` local para conservar la escala previa de Carga Inicial en mobile y evitar que el token global agrande el titulo de forma notoria.

## 6. Decision de subtitulo

El subtitulo `Cuidando el inicio...` usa ahora:

```css
font-family: var(--gvo-font-microcopy);
font-size: clamp(var(--gvo-text-microcopy-size), 4.19vw, 1.02rem);
font-weight: var(--gvo-font-weight-medium);
line-height: calc(var(--gvo-line-height-ui) + 0.12);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Se mantuvo el line-height efectivo previo de `1.24` mediante `calc(var(--gvo-line-height-ui) + 0.12)` para preservar la lectura y el aire del subtitulo.

## 7. Ajustes responsive minimos

Los valores fijos de media queries se sustituyeron por `clamp()` basado en tokens:

- Titulo en viewport estrecho: `clamp(var(--gvo-text-heading-size), 6.4vw, 1.44rem)`
- Subtitulo en viewport estrecho: `clamp(calc(var(--gvo-text-body-size) - 0.1rem), 4vw, var(--gvo-text-microcopy-size))`
- Titulo en viewport bajo: `clamp(var(--gvo-text-heading-size), 6.1vw, 1.38rem)`

Estos ajustes conservan los maximos visuales anteriores y evitan overflow horizontal.

## 8. Que se preservo visualmente

- Textos visibles exactos:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- Composicion de Carga Inicial.
- Layout mobile-first.
- Maceta, Lia, halo, agua, sparkles y barra.
- Animaciones y tiempos existentes.
- Rutas `/` y `/carga`.
- Ausencia de porcentaje y numeros visibles en la barra.
- Pixelify Sans local via Fontsource, sin CDN.

## 9. Confirmaciones de alcance

- No se modifico Portada / Intro.
- No se modifico TransitionWorld.
- No se modificaron dialogos de Lia.
- No se modificaron assets runtime.
- No se agregaron fuentes, dependencias, CDN ni `@import url(...)`.
- No se modificaron rutas ni navegacion.

## 10. Capturas generadas

Capturas T003E7D generadas con Playwright contra `http://127.0.0.1:5173/carga`:

- `docs/visual/loading-initial/validation/t003e7d/loading-initial-t003e7d-390x844.png`
- `docs/visual/loading-initial/validation/t003e7d/loading-initial-t003e7d-430x932.png`

Validacion visual observada:

- Texto principal centrado y legible.
- Subtitulo centrado y sin recorte.
- Sin overflow horizontal visible.
- Barra mantiene escala fina.
- No se observan cambios de composicion ni de assets.

## 11. Validaciones ejecutadas

Comandos requeridos:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e
```

## 12. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e`: OK, 30 tests.

Nota de validacion: `npm run test:e2e` regenera capturas de Portada / Intro y TransitionWorld como parte de sus suites existentes. Esas capturas se restauraron y no forman parte de este commit porque T003E7D solo modifica Carga Inicial.

## 13. Estado final del repo

El cierre debe quedar publicado en `origin/feature/003E7D-loading-initial-typography-tokens` con working tree limpio.

## 14. Proximo paso recomendado

Siguiente paso recomendado despues de revision visual:

`T003E7E - Aplicar tokens tipograficos a Portada / Intro`

No se implementa T003E7E en este ticket.
