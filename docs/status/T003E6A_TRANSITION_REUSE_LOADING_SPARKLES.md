# T003E6A - TransitionWorld reuse loading sparkles

## 1. Resumen del ticket

T003E6A corrige la capa ambiental de sparkles agregada en T003E6 para que no use formas inventadas. La pantalla tecnica aislada sigue siendo:

`/dev/transition-world`

El objetivo fue reemplazar los sparkles CSS de T003E6 por sparkles reales y coherentes con Carga Inicial, sin modificar Carga Inicial ni Portada / Intro.

Estado:

`TRANSITION_WORLD_REUSE_LOADING_SPARKLES_T003E6A / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E6-transition-world-sparkles`
- Commit base: `9f3dbc3 feat: add ambient sparkles to transition world`
- Rama final: `feature/003E6A-transition-reuse-loading-sparkles`

## 3. Observacion del usuario

Los sparkles de T003E6 se veian inventados, pequenos y desconectados del lenguaje visual de Carga Inicial. El pedido fue reutilizar los sparkles reales o replicar fielmente su geometria, markup y CSS.

## 4. Auditoria real de sparkles de Carga Inicial

Archivos revisados:

- `src/screens/LoadingInitial/loadingInitialAssets.ts`
- `src/screens/LoadingInitial/loadingInitialScene.ts`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `public/assets/runtime/loading-initial/sparkles/`

Resultado:

- No existe un componente React reusable de sparkles.
- Carga Inicial define los assets en `loadingInitialAssets.sparkles`.
- Carga Inicial define 10 slots deterministicos en `loadingInitialSparkleSlots`.
- Carga Inicial renderiza cada sparkle como `<img>`, no como CSS puro ni SVG.
- Cada `<img>` usa `alt=""`, `draggable="false"`, `data-sparkle-slot`, `data-runtime-asset` y variables CSS `--sparkle-x`, `--sparkle-y`, `--sparkle-delay`, `--sparkle-duration`.
- La animacion real es `loading-sparkle-pulse`.

Assets reales:

| Asset | Archivo | Dimension | Uso |
| --- | --- | --- | --- |
| `sparkle_01_lilac_small` | `sparkle_01_lilac_small.png` | `189x189` | lila pequeno/base |
| `sparkle_02_amber_small` | `sparkle_02_amber_small.png` | `187x186` | ambar pequeno/base |
| `sparkle_03_lilac_medium` | `sparkle_03_lilac_medium.png` | `240x233` | lila medio |
| `sparkle_04_micro_white` | `sparkle_04_micro_white.png` | `103x100` | blanco micro |

Tamanos CSS en Carga Inicial:

- Base: `18px x 18px`.
- Micro: `12px x 12px`.
- Grandes: `22px x 22px`.

Animacion real:

```css
0%, 24%  -> opacity 0, scale 0.84
42%      -> opacity 0.44, scale 1.03
58%      -> opacity 0.58, scale 1
74%      -> opacity 0.18, scale 0.98
100%     -> opacity 0, scale 0.9
```

## 5. Que se reutilizo exactamente

T003E6A reutiliza directamente:

- los mismos PNG runtime de `loadingInitialAssets.sparkles`;
- el mismo modelo de `<img>` decorativo;
- los mismos tamanos CSS principales: `12px`, `18px`, `22px`;
- los mismos delays/duraciones de slots de Carga Inicial;
- la misma curva de keyframes de `loading-sparkle-pulse`, con nombre local `transition-sparkle-loading-pulse`;
- la misma idea de reduced motion con opacidad baja y menos slots visibles.

No se importa un componente compartido porque no existe. Se importa solo la lista de assets aprobados desde `loadingInitialAssets`.

## 6. Que se elimino de T003E6

Se eliminaron:

- pseudo-elementos `::before` y `::after` que construian cruces CSS inventadas;
- tonos inventados `lilac`, `amber`, `pearl` como geometria CSS;
- tamanos mini de `5px`, `6px`, `7px`, `8px`;
- el keyframe `transition-sparkle-ambient` con opacidades propias.

## 7. Tamanos y escala aplicados

Los sparkles de TransitionWorld quedan con escalas equivalentes a Carga Inicial:

- `12px`: micro white.
- `18px`: lilac/amber small base.
- `22px`: lilac medium o slots grandes.

Esto corrige el problema de T003E6, donde los sparkles se veian como mini puntos poco legibles.

## 8. Ubicacion de sparkles en TransitionWorld

Se mantienen 8 sparkles maximos, distribuidos en zonas perifericas:

1. `sparkle-lilac-upper-left`: `14% / 18%`
2. `sparkle-amber-upper-right`: `86% / 19%`
3. `sparkle-white-upper-air`: `50% / 12%`
4. `sparkle-white-middle-left`: `8% / 40%`
5. `sparkle-amber-middle-right`: `91% / 41%`
6. `sparkle-lilac-lower-left`: `12% / 64%`
7. `sparkle-lilac-lower-right`: `88% / 66%`
8. `sparkle-lilac-bottom-right`: `78% / 82%`

La capa queda por detras de la escena principal para no tapar Lia, portal, texto ni progress.

## 9. Reduced motion

Reduced motion:

- detiene la animacion continua;
- deja opacidad baja `0.18`;
- oculta los slots desde el quinto en adelante;
- evita parpadeo continuo o flashing;
- conserva la transicion sin navegacion real.

## 10. Confirmacion sobre Carga Inicial

No se modifico Carga Inicial.

La pantalla de carga no cambia visualmente porque:

- no se tocaron sus componentes;
- no se tocaron sus CSS;
- no se tocaron sus assets;
- TransitionWorld solo importa la lista de assets aprobados.

## 11. Confirmacion sobre Portada / Intro

No se modifico Portada / Intro.

## 12. Confirmacion sobre navegacion real

No se conecto navegacion real. `/dev/transition-world` sigue siendo un preview tecnico aislado.

## 13. Capturas generadas

Capturas T003E6A esperadas:

- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-start-390x844.png`
- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-mid-390x844.png`
- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-final-390x844.png`
- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-start-430x932.png`
- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-mid-430x932.png`
- `docs/visual/transition-world/validation/t003e6a/transition-world-t003e6a-final-430x932.png`

## 14. Validaciones ejecutadas

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

## 15. Resultado de validaciones

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

Verificacion adicional en navegador interno:

- ruta: `http://127.0.0.1:5173/dev/transition-world`
- version DOM: `T003E6A_REUSE_LOADING_SPARKLES`
- sparkles: 8
- referencia: `loading-initial-runtime-assets-and-css`
- tags renderizados: `IMG`
- assets usados: `sparkle_01_lilac_small`, `sparkle_02_amber_small`, `sparkle_03_lilac_medium`, `sparkle_04_micro_white`
- tamanos CSS: `12px`, `18px`, `22px`
- sin overflow horizontal
- sin botones, links, audio ni video
- progress spark conserva alineacion: delta Y `-1px`

## 16. Estado final del repo

El cierre debe quedar publicado en `feature/003E6A-transition-reuse-loading-sparkles` con working tree limpio.
