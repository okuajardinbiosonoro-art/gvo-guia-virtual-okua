# T003E7C - TransitionWorld typography tokens

## 1. Resumen del ticket

T003E7C aplica los tokens tipograficos globales creados en T003E7B unicamente a `TransitionWorld`, la pantalla tecnica aislada disponible en:

`/dev/transition-world`

El cambio conserva la estetica actual de la transicion y elimina declaraciones tipograficas locales inconsistentes. No redisenia la pantalla, no cambia assets, no cambia animacion, no conecta navegacion real y no toca Carga Inicial ni Portada / Intro.

## 2. Rama base y rama final

- Rama base: `feature/003E7B-global-typography-tokens`
- Commit base: `fd2d864 style: add global gvo typography tokens`
- Rama final: `feature/003E7C-transition-world-typography-tokens`

## 3. Tokens aplicados

En `src/screens/TransitionWorld/TransitionWorld.module.css` se aplicaron:

- `--gvo-font-heading`
- `--gvo-font-microcopy`
- `--gvo-text-heading-size`
- `--gvo-text-microcopy-size`
- `--gvo-line-height-heading`
- `--gvo-line-height-ui`
- `--gvo-font-weight-semibold`
- `--gvo-font-weight-medium`
- `--gvo-letter-spacing-pixel-normal`

## 4. Declaraciones tipograficas locales reemplazadas

Se reemplazo el stack local hardcodeado:

```css
font-family: "Pixelify Sans", system-ui, sans-serif;
```

por:

```css
font-family: var(--gvo-font-heading);
```

Tambien se reemplazaron valores locales de titulo y subtitulo:

- `font-weight: 600`
- `letter-spacing: 0`
- `font-size: clamp(1.08rem, 4.4vw, 1.34rem)`
- `line-height: 1.05`
- `font-size: clamp(0.88rem, 3.8vw, 1.02rem)`
- `line-height: 1.12`

por tokens globales equivalentes.

## 5. Decision de titulo principal

El titulo principal `Abriendo Mundo I: Raíz...` usa:

```css
font-family: var(--gvo-font-heading);
font-size: var(--gvo-text-heading-size);
font-weight: var(--gvo-font-weight-semibold);
line-height: var(--gvo-line-height-heading);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Se eligio `--gvo-text-heading-size` en lugar de `--gvo-text-title-size` porque TransitionWorld necesita conservar el titulo en una linea cuando sea razonable en mobile. `--gvo-text-heading-size` preserva la escala anterior validada visualmente.

## 6. Decision de subtitulo

El subtitulo `Preparando recorrido...` usa:

```css
font-family: var(--gvo-font-microcopy);
font-size: var(--gvo-text-microcopy-size);
font-weight: var(--gvo-font-weight-medium);
line-height: var(--gvo-line-height-ui);
letter-spacing: var(--gvo-letter-spacing-pixel-normal);
```

Esto mantiene el subtitulo discreto y legible, alineado con la decision de microcopy breve pixelart.

## 7. Ajustes mínimos de spacing

No se hicieron ajustes de spacing, layout, posicion, portal, Lia, progress, sparkles ni animaciones.

## 8. Confirmacion de que no se modifico Carga Inicial

No se modifico Carga Inicial.

## 9. Confirmacion de que no se modifico Portada

No se modifico Portada / Intro.

## 10. Confirmacion de que no se modificaron assets

No se modificaron assets runtime ni assets fuente.

## 11. Confirmacion de que no se modifico navegacion

No se modifico navegacion real. `/dev/transition-world` sigue siendo un preview tecnico aislado.

La metadata DOM de `TransitionWorld` se actualizo a:

```txt
T003E7C_TYPOGRAPHY_TOKENS
```

Esto no cambia navegacion ni comportamiento; solo identifica el preview tecnico actual.

## 12. Capturas generadas

Capturas T003E7C requeridas:

- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-start-390x844.png`
- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-mid-390x844.png`
- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-final-390x844.png`
- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-start-430x932.png`
- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-mid-430x932.png`
- `docs/visual/transition-world/validation/t003e7c/transition-world-t003e7c-final-430x932.png`

## 13. Validaciones ejecutadas

Comandos requeridos:

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

## 14. Resultado de validaciones

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

Verificacion adicional en navegador interno:

- ruta: `http://127.0.0.1:5173/dev/transition-world`
- version DOM: `T003E7C_TYPOGRAPHY_TOKENS`
- titulo visible: `Abriendo Mundo I: Raíz...`
- subtitulo visible: `Preparando recorrido...`
- `font-family` computado de titulo: `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif`
- `font-family` computado de subtitulo: `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif`
- sin overflow horizontal.

## 15. Estado final del repo

El cierre debe quedar publicado en `feature/003E7C-transition-world-typography-tokens` con working tree limpio.

## 16. Recomendacion para el siguiente paso

Siguiente paso recomendado despues de revision visual:

`T003E7D - Aplicar tokens tipograficos a Carga Inicial`

No se implementa T003E7D en este ticket.
