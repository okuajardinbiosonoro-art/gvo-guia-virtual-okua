# T003E7E - Cover Intro typography tokens

## 1. Resumen del ticket

T003E7E aplica los tokens tipograficos globales GVO unicamente a Portada / Intro, disponible en:

- `/portada`

El cambio reemplaza declaraciones tipograficas locales y stacks hardcodeados por tokens globales ya definidos en `src/styles/tokens.css`. No redisenia Portada / Intro, no reabre su evaluacion visual, no cambia layout, no cambia assets, no cambia animaciones, no modifica rutas y no toca Carga Inicial ni TransitionWorld.

## 2. Rama base y rama final

- Rama base: `feature/003E7D-loading-initial-typography-tokens`
- Commit base: `4dfa660 style: apply typography tokens to loading initial`
- Rama final: `feature/003E7E-cover-intro-typography-tokens`

## 3. Estado de Portada antes del ticket

Portada / Intro llega a este ticket con estado:

`APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL`

Este ticket no cambia ese estado ni intenta cerrar la pantalla como final.

## 4. Declaraciones tipograficas encontradas en Portada / Intro

En `src/screens/Cover/CoverIntroScreen.css` se encontraron:

### Stack visual principal hardcodeado

```css
font-family:
  "Pixelify Sans Variable", "Pixelify Sans", ui-sans-serif, system-ui,
  sans-serif;
```

### Stack local de lectura

```css
--cover-readable-font:
  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Titulo/logo principal

```css
font-size: clamp(2.2rem, 14vw, 4.1rem);
line-height: 0.86;
font-weight: 700;
letter-spacing: 0;
```

### Subtitulo

```css
font-size: clamp(0.9rem, 4vw, 1.16rem);
line-height: 1;
letter-spacing: 0;
```

### Dialogos y metadata

```css
font-family: var(--cover-readable-font);
font-size: clamp(0.84rem, 3.25vw, 1rem);
font-weight: 500;
line-height: 1.25;
letter-spacing: 0;
```

Tambien existian pesos locales como `750`, `700` y `650`, ademas de multiples `font-size` y `line-height` locales en botones, estados, numeros romanos, overlay de transicion y media queries.

## 5. Tokens aplicados

Se aplicaron estos tokens globales:

- `--gvo-font-display`
- `--gvo-font-heading`
- `--gvo-font-ui`
- `--gvo-font-dialog`
- `--gvo-text-display-size`
- `--gvo-text-title-size`
- `--gvo-text-heading-size`
- `--gvo-text-subtitle-size`
- `--gvo-text-dialog-size`
- `--gvo-text-ui-size`
- `--gvo-font-weight-regular`
- `--gvo-font-weight-medium`
- `--gvo-font-weight-semibold`
- `--gvo-font-weight-bold`
- `--gvo-line-height-tight`
- `--gvo-line-height-heading`
- `--gvo-line-height-dialog`
- `--gvo-line-height-ui`
- `--gvo-letter-spacing-pixel-normal`
- `--gvo-letter-spacing-readable`

## 6. Decisiones de aplicacion

### Marca OKUA y subtitulo

La raiz `.cover-intro` usa ahora:

```css
font-family: var(--gvo-font-display);
```

La marca `OKUA` usa:

```css
font-size: var(--gvo-text-display-size);
font-weight: var(--gvo-font-weight-bold);
line-height: calc(var(--gvo-line-height-tight) - 0.14);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Se conserva el line-height compacto de la marca mediante `calc()` para no alterar la composicion aprobada.

### Dialogos de Lia

Los dialogos largos pasan a:

```css
font-family: var(--gvo-font-dialog);
font-size: var(--gvo-text-dialog-size);
font-weight: var(--gvo-font-weight-regular);
line-height: var(--gvo-line-height-dialog);
letter-spacing: var(--gvo-letter-spacing-readable);
```

Esto respeta la decision de T003E7A: stack sistema local para dialogos largos y lectura comoda.

### Botones y UI corta

CTA, boton de dialogo y link de transicion usan:

```css
font-family: var(--gvo-font-ui);
font-weight: var(--gvo-font-weight-bold);
line-height: var(--gvo-line-height-ui);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Los tamanos se mantienen con `clamp()` local donde era necesario preservar proporciones aprobadas.

## 7. Que se preservo visualmente

- Textos existentes.
- Logo/marca OKUA como DOM/CSS.
- Subtitulo `GUIA VISUAL`.
- CTA `Comenzar recorrido`.
- Dialogos de Lia.
- Estados de Portal I y portales bloqueados.
- Overlay placeholder de transicion.
- Layout mobile-first.
- Assets runtime.
- Animaciones existentes.
- Navegacion y gating existentes.
- Portada sigue `NO_CERRADA_FINAL`.

## 8. Ajustes minimos realizados

- Se retiro `--cover-readable-font` y se reemplazo por `--gvo-font-dialog`.
- Se retiro el stack Pixelify hardcodeado de `.cover-intro` y se reemplazo por `--gvo-font-display`.
- Se normalizaron pesos locales a tokens globales.
- Se mantuvieron limites visuales locales en `clamp()` cuando el token global necesitaba preservar escala especifica de Portada.
- No se modificaron posiciones, tamanos de assets, animaciones ni flujo.

## 9. Confirmaciones de alcance

- No se reabrio visualmente Portada / Intro.
- No se modifico Carga Inicial.
- No se modifico TransitionWorld.
- No se modificaron assets runtime.
- No se agregaron fuentes, dependencias, CDN ni `@import url(...)`.
- No se modificaron rutas ni navegacion.

## 10. Capturas generadas

Capturas T003E7E generadas con Playwright contra `http://127.0.0.1:5173/portada?resetIntro=1`:

- `docs/visual/cover-intro/validation/t003e7e/cover-intro-t003e7e-390x844.png`
- `docs/visual/cover-intro/validation/t003e7e/cover-intro-t003e7e-430x932.png`
- `docs/visual/cover-intro/validation/t003e7e/cover-intro-t003e7e-dialogue-390x844.png`
- `docs/visual/cover-intro/validation/t003e7e/cover-intro-t003e7e-dialogue-430x932.png`

Validacion visual observada:

- Marca OKUA legible y centrada.
- CTA legible y sin recorte.
- Dialogo de Lia legible.
- Sin overflow horizontal visible.
- Sin cambios de composicion fuertes.

## 11. Verificacion en navegador interno

Se verifico `http://127.0.0.1:5173/portada?resetIntro=1` en el navegador interno:

- Fase inicial: `portada_idle`.
- Marca visible: `OKUA`.
- CTA visible: `Comenzar recorrido`.
- Overflow horizontal: `0`.
- Marca resuelta con Pixelify Sans desde tokens.
- Dialogo activo resuelto con `--gvo-font-dialog`.

## 12. Validaciones ejecutadas

Comandos requeridos:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e
```

## 13. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e`: OK, 30 tests.

Nota de validacion: `npm run test:e2e` regenera capturas de QA historicas de Portada / Intro y TransitionWorld. Esas capturas se restauraron y no forman parte de este commit porque T003E7E solo conserva las nuevas capturas en `docs/visual/cover-intro/validation/t003e7e/`.

## 14. Estado final del repo

El cierre debe quedar publicado en `origin/feature/003E7E-cover-intro-typography-tokens` con working tree limpio.

## 15. Proximo paso recomendado

Siguiente paso recomendado despues de revision visual:

`T003E7F - Aplicar tokens tipograficos a dialogos de Lia si quedaron fuera de Portada, o documentar que ya quedaron cubiertos`

Segun este ticket, los dialogos de Lia dentro de Portada / Intro ya quedaron cubiertos por `--gvo-font-dialog`. T003E7F puede enfocarse en auditar dialogos compartidos o futuros fuera de Portada.
