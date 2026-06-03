# T003E7B - Global typography tokens

## 1. Resumen del ticket

T003E7B crea la base tecnica de tokens tipograficos globales para GVO en `src/styles/tokens.css`. El cambio retira la referencia no respaldada a `Inter` y deja preparado un sistema comun para aplicar despues por pantalla.

Este ticket no redisenia pantallas ni aplica los tokens manualmente a Carga Inicial, Portada / Intro o TransitionWorld. La migracion visual por pantalla queda reservada para tickets posteriores.

## 2. Rama base y rama final

- Rama base: `feature/003E7A-typography-stack-decision`
- Commit base: `9a1c5f8 docs: decide gvo typography stack policy`
- Rama final: `feature/003E7B-global-typography-tokens`

## 3. Decision tomada desde T003E7A

Se implementa la decision documental de T003E7A:

- Fuente de identidad provisional: `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif`.
- Stack provisional para body/dialogos largos: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- `Inter` no debe declararse como fuente global porque no existe como dependencia, asset local ni import real.

## 4. Confirmacion de import local de Pixelify

`src/main.tsx` ya importa la fuente local:

```ts
import "@fontsource-variable/pixelify-sans/index.css";
```

No se modifico `src/main.tsx`.

## 5. Tokens creados

### Fuentes

Se agregaron estos tokens globales:

```css
--gvo-font-display
--gvo-font-heading
--gvo-font-ui
--gvo-font-microcopy
--gvo-font-system-readable
--gvo-font-body
--gvo-font-dialog
```

Valores base:

- `--gvo-font-display`: `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif`.
- `--gvo-font-heading`: `var(--gvo-font-display)`.
- `--gvo-font-ui`: `var(--gvo-font-display)`.
- `--gvo-font-microcopy`: `var(--gvo-font-display)`.
- `--gvo-font-system-readable`: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- `--gvo-font-body`: `var(--gvo-font-system-readable)`.
- `--gvo-font-dialog`: `var(--gvo-font-system-readable)`.

### Escala tipografica

Se agregaron estos tokens de tamano:

```css
--gvo-text-display-size
--gvo-text-title-size
--gvo-text-heading-size
--gvo-text-subtitle-size
--gvo-text-body-size
--gvo-text-dialog-size
--gvo-text-ui-size
--gvo-text-microcopy-size
```

### Line-height

Se agregaron:

```css
--gvo-line-height-tight
--gvo-line-height-heading
--gvo-line-height-body
--gvo-line-height-dialog
--gvo-line-height-ui
```

### Pesos

Se agregaron:

```css
--gvo-font-weight-regular
--gvo-font-weight-medium
--gvo-font-weight-semibold
--gvo-font-weight-bold
```

### Letter-spacing

Se agregaron:

```css
--gvo-letter-spacing-pixel-tight
--gvo-letter-spacing-pixel-normal
--gvo-letter-spacing-readable
--gvo-letter-spacing-ui
```

## 6. Inter retirado

Se retiro `Inter` de `src/styles/tokens.css`.

Antes, `:root` declaraba `Inter` como primera fuente aunque no existia localmente. Ahora `font-family` usa:

```css
font-family: var(--gvo-font-body);
```

Esto evita un fallback silencioso y deja la tipografia global alineada con la politica documentada.

## 7. Compatibilidad con tokens existentes

No existian tokens tipograficos globales previos del tipo `--font-family`, `--font-heading`, `--text-title` o similares usados por pantallas.

Se preservaron sin cambios los tokens globales ya existentes:

- `--gvo-bg`
- `--gvo-surface`
- `--gvo-text`
- `--gvo-muted`
- `--gvo-border`
- `--gvo-accent`
- `--gvo-amber`
- `--gvo-radius`
- `--gvo-shadow`

Las pantallas finales siguen usando sus estilos locales actuales hasta que los tickets de aplicacion gradual migren cada pantalla.

## 8. Que NO se aplico todavia

- No se modifico `LoadingInitialScreen.css`.
- No se modifico `CoverIntroScreen.css`.
- No se modifico `TransitionWorld.module.css`.
- No se modificaron componentes React.
- No se modificaron dialogos.
- No se modificaron botones.
- No se modificaron rutas.
- No se modifico navegacion.
- No se agregaron fuentes.
- No se agregaron dependencias.
- No se tocaron assets.

## 9. Riesgos visuales evitados

- No se hizo una migracion masiva de pantalla por pantalla.
- No se reemplazo la tipografia de dialogos sin comparativa visual.
- No se forzo Pixelify Sans en textos largos.
- No se instalo una nueva fuente sin ticket propio.
- No se mantuvo `Inter` como fuente fantasma.

## 10. Proximo ticket recomendado

Proximo ticket recomendado:

`T003E7C - Aplicar tokens tipograficos a TransitionWorld`

Motivo:

- TransitionWorld es la pantalla mas acotada.
- Ya usa Pixelify, pero con stack incompleto.
- Es el lugar mas seguro para validar tokens sin reabrir Carga Inicial ni Portada / Intro.

No se implementa T003E7C en este ticket.

## 11. Validaciones ejecutadas

Comandos requeridos:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

## 12. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

Nota de alcance: `npm run test:e2e` regenera capturas PNG de evidencia visual. Esas capturas no se conservaron en este commit porque T003E7B no es un ticket de QA visual ni de actualizacion de screenshots.

## 13. Estado final del repo

El cierre debe quedar publicado en `feature/003E7B-global-typography-tokens` con working tree limpio.
