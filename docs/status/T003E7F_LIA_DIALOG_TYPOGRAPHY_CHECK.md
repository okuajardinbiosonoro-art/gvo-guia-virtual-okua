# T003E7F - Lia dialog typography check

## 1. Resumen del ticket

T003E7F verifica si quedan dialogos de Lia, burbujas narrativas, mensajes guiados o componentes de texto relacionados con Lia fuera de Portada / Intro que todavia usen tipografias hardcodeadas o stacks locales.

Resultado: no se encontraron dialogos de Lia remanentes fuera de Portada / Intro. La cobertura tipografica de dialogos de Lia queda cubierta por T003E7E mediante tokens globales en `src/screens/Cover/CoverIntroScreen.css`.

Este ticket no modifica runtime.

## 2. Rama base y rama final

- Rama base: `feature/003E7E-cover-intro-typography-tokens`
- Commit base: `9685eba style: apply typography tokens to cover intro`
- Rama final: `feature/003E7F-lia-dialog-typography-check`

## 3. Que se busco

Se buscaron en `src/` terminos asociados a dialogos, Lia y textos guiados:

- `Lia`
- `Lia`
- `lia`
- `dialogue`
- `dialog`
- `bubble`
- `speech`
- `message`
- `guide`
- `avatar`
- `narrator`
- `narrative`
- `tooltip`
- `hint`

Tambien se revisaron declaraciones tipograficas:

- `font-family`
- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- `Pixelify`
- `Inter`
- `@import url`

## 4. Archivos inspeccionados

Archivos de decision tipografica:

- `docs/status/T003E7_GVO_TYPOGRAPHY_AUDIT.md`
- `docs/status/T003E7A_TYPOGRAPHY_STACK_DECISION.md`
- `docs/status/T003E7B_GLOBAL_TYPOGRAPHY_TOKENS.md`
- `docs/status/T003E7C_TRANSITION_WORLD_TYPOGRAPHY_TOKENS.md`
- `docs/status/T003E7D_LOADING_INITIAL_TYPOGRAPHY_TOKENS.md`
- `docs/status/T003E7E_COVER_INTRO_TYPOGRAPHY_TOKENS.md`
- `src/styles/tokens.css`

Archivos runtime relevantes:

- `src/screens/Cover/CoverIntroScreen.tsx`
- `src/screens/Cover/CoverIntroScreen.css`
- `src/screens/Cover/coverIntroContent.ts`
- `src/screens/Cover/LiaHybridAvatar.tsx`
- `src/screens/Cover/LiaHybridAvatar.css`
- `src/screens/Cover/CoverPlaceholder.tsx`
- `src/components/lia/LiaPlaceholder.tsx`
- `src/styles/global.css`
- `src/screens/TransitionWorld/TransitionWorld.tsx`
- `src/screens/TransitionWorld/TransitionWorld.module.css`
- `src/screens/TransitionWorld/components/TransitionText.tsx`
- `src/screens/TransitionWorld/components/TransitionLiaSprite.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/data/stations.ts`

## 5. Hallazgos encontrados

| Archivo | Componente / zona | Tipo de texto | Dialogo de Lia | Usa tokens globales | Font hardcodeada | Requiere cambio |
| --- | --- | --- | --- | --- | --- | --- |
| `src/screens/Cover/coverIntroContent.ts` | `coverIntroDialogues` | Contenido de dialogos de Lia | Si | Se renderiza en Portada cubierta por CSS T003E7E | No | No |
| `src/screens/Cover/CoverIntroScreen.tsx` | `role="dialog"` / `cover-intro__dialogue-*` | Panel de dialogo de Lia | Si | Si, desde `CoverIntroScreen.css` | No | No |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue`, `.cover-intro__dialogue-text`, `.cover-intro__dialogue-button` | Dialogo, speaker, paso y boton | Si | Si: `--gvo-font-dialog`, `--gvo-font-ui`, `--gvo-text-dialog-size`, `--gvo-line-height-dialog` | No | No |
| `src/screens/Cover/LiaHybridAvatar.tsx` | Avatar de Lia | Imagen/rig, alt accesible | No es dialogo | No aplica | No | No |
| `src/screens/Cover/LiaHybridAvatar.css` | Capas visuales de Lia | Sin texto visible | No | No aplica | No | No |
| `src/components/lia/LiaPlaceholder.tsx` | `LiaPlaceholder` | Placeholder tecnico | No es dialogo final | Hereda global | No | No, fuera de alcance visual final |
| `src/styles/global.css` | `.lia-placeholder` | Estilo placeholder global | No es dialogo final | Hereda `:root` y tokens globales de color | No hay stack local | No |
| `src/screens/TransitionWorld/components/TransitionLiaSprite.tsx` | Sprite de Lia en transicion | Alt accesible breve | No es dialogo | No aplica | No | No |
| `src/screens/TransitionWorld/TransitionWorld.module.css` | Titulo/subtitulo de transicion | Texto de pantalla, no Lia | No | Si, migrado en T003E7C | No | No |
| `src/screens/LoadingInitial/LoadingInitialScreen.css` | Titulo/subtitulo de carga | Texto de pantalla, no Lia | No | Si, migrado en T003E7D | No | No |
| `src/data/stations.ts` | `Mundo II: Lia y el pulso invisible` | Nombre de mundo | No | No aplica | No | No |

## 6. Componentes cubiertos por T003E7E

T003E7E cubrio los dialogos reales de Lia en Portada / Intro:

- `coverIntroDialogues`
- panel `cover-intro__dialogue`
- metadata `cover-intro__dialogue-meta`
- speaker `cover-intro__dialogue-speaker`
- paso `cover-intro__dialogue-step`
- cuerpo `cover-intro__dialogue-text`
- boton `cover-intro__dialogue-button`
- mensajes bloqueados `cover-intro__blocked-message`
- copy de overlay `cover-intro__transition-copy`

Tokens relevantes ya aplicados:

- `--gvo-font-dialog`
- `--gvo-text-dialog-size`
- `--gvo-line-height-dialog`
- `--gvo-font-weight-regular`
- `--gvo-font-ui`
- `--gvo-text-ui-size`
- `--gvo-line-height-ui`

## 7. Componentes remanentes

No hay dialogos de Lia remanentes fuera de Portada / Intro.

El unico componente fuera de Portada que menciona Lia es `src/components/lia/LiaPlaceholder.tsx`. Se clasifica como placeholder tecnico heredado del sistema global, no como burbuja narrativa, dialogo final ni pantalla visual aprobada. No se modifica en este ticket para evitar alterar runtime sin necesidad.

## 8. Cambios aplicados

No se aplicaron cambios runtime.

Se creo solo este documento de cierre:

- `docs/status/T003E7F_LIA_DIALOG_TYPOGRAPHY_CHECK.md`

## 9. Confirmaciones de alcance

- No se rediseno Portada / Intro.
- No se modifico Carga Inicial.
- No se modifico TransitionWorld.
- No se modificaron dialogos.
- No se modificaron animaciones.
- No se modificaron assets.
- No se modificaron rutas.
- No se modifico navegacion.
- No se agregaron fuentes.
- No se agregaron dependencias.
- No se uso CDN.
- No se uso `@import url(...)`.
- No se modificaron tokens globales.

## 10. Estado de cierre tipografico de dialogos de Lia

Estado: `COBERTURA_DOCUMENTADA / SIN_REMANENTES_RUNTIME`.

Los dialogos de Lia existentes en runtime quedan cubiertos por T003E7E. Cualquier dialogo futuro de Lia debera usar:

```css
font-family: var(--gvo-font-dialog);
font-size: var(--gvo-text-dialog-size);
line-height: var(--gvo-line-height-dialog);
font-weight: var(--gvo-font-weight-regular);
```

Para microcopy o UI corta asociada a Lia:

```css
font-family: var(--gvo-font-microcopy);
font-family: var(--gvo-font-ui);
```

segun corresponda.

## 11. Validaciones ejecutadas

Comandos requeridos para cierre documental sin cambios runtime:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
```

`npm run test:e2e` se omite porque este ticket no modifica runtime, CSS funcional, comportamiento visual, rutas ni assets.

## 12. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e`: omitido, sin cambios runtime.

## 13. Estado final del repo

El cierre debe quedar publicado en `origin/feature/003E7F-lia-dialog-typography-check` con working tree limpio.

## 14. Proximo paso recomendado

Siguiente paso recomendado:

`T003E7G - Validacion visual comparativa de tipografia en Carga Inicial, Portada y TransitionWorld`

Ese ticket deberia comparar visualmente las tres pantallas ya migradas sin redisenarlas.
