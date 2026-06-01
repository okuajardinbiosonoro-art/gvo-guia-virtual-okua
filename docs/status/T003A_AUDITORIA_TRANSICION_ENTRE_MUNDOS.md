# T003A - Auditoria tecnica y visual para Transicion entre mundos

Fecha: 2026-06-01

Rama de auditoria: `feature/003A-auditoria-transicion-entre-mundos`

## Estado del repo

- Rama base auditada: `main`, consolidada con Portada / Intro aprobada para avanzar.
- Estado de Portada / Intro: `APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL`.
- Estado de carga inicial: `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`.
- Rutas existentes relevantes:
  - `/`: carga inicial y posterior navegacion a `/portada`.
  - `/carga`: carga inicial aislada.
  - `/portada`: Portada / Intro funcional.
  - `/estacion/:stationId`: placeholder de estacion.
  - `/final`: placeholder final.
  - `/qr/:stationId`: placeholder de acceso QR.
- Restricciones vigentes: app local, mobile-first, sin audio, sin video runtime, sin CDN, sin recursos externos, sin nuevas pantallas sin ticket.

Esta auditoria no implementa `TransitionWorld`, no crea rutas, no modifica Portada / Intro y no agrega assets.

## Archivos inspeccionados

Arquitectura y rutas:

- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/router.tsx`
- `src/components/layout/MobileShell.tsx`
- `src/components/transition/TransitionPlaceholder.tsx`
- `src/screens/Station/StationPlaceholder.tsx`
- `src/data/flow.ts`
- `src/data/stations.ts`

Carga inicial:

- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/screens/LoadingInitial/loadingInitialTimeline.ts`
- `src/screens/LoadingInitial/loadingInitialMotionTimeline.ts`
- `src/screens/LoadingInitial/liaFrameRegistration.ts`
- `src/screens/LoadingInitial/loadingInitialAssets.ts`
- `src/screens/LoadingInitial/loadingInitialCopy.ts`
- `src/screens/LoadingInitial/loadingInitialScene.ts`
- `src/screens/LoadingInitial/LoadingInitial.types.ts`
- `src/screens/LoadingInitial/LoadingInitialScreen.test.tsx`

Portada / Intro:

- `src/screens/Cover/CoverIntroScreen.tsx`
- `src/screens/Cover/CoverIntroScreen.css`
- `src/screens/Cover/LiaHybridAvatar.tsx`
- `src/screens/Cover/LiaHybridAvatar.css`
- `src/screens/Cover/coverIntroAssets.ts`
- `src/screens/Cover/coverIntroContent.ts`
- `src/screens/Cover/coverIntroState.ts`
- `src/screens/Cover/CoverIntroScreen.test.tsx`

Estilos, pruebas y validacion:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `playwright.config.ts`
- `tests/e2e/smoke.spec.ts`
- `tests/e2e/loading-initial.spec.ts`
- `tests/e2e/cover-intro-*.spec.ts`
- `package.json`
- `tools/audit_assets.mjs`
- `tools/validate_cover_intro_assets.mjs`
- `tools/validate_loading_initial_assets.mjs`

## Pantallas existentes relevantes

### Carga inicial

La carga inicial es la referencia mas solida para una pantalla breve, autonoma y no interactiva:

- Vive en `src/screens/LoadingInitial/`.
- Tiene entrypoint `index.ts`.
- Centraliza duraciones en `loadingInitialTimeline.ts` y `loadingInitialMotionTimeline.ts`.
- Usa assets locales mediante `loadingInitialAssets.ts`.
- Expone metadata semantica en DOM: `data-duration-ms`, `data-reduced-motion-duration-ms`, `data-loading-layout-version`, `data-motion-timeline-version`.
- Usa CSS custom properties para duracion, escala, posiciones, progress bar y reduced motion.
- Implementa progress bar accesible con `role="progressbar"` y sin porcentaje visible.
- Maneja reduced motion por CSS, ocultando agua multi-stream y reduciendo animaciones.
- Tiene tests unitarios y e2e que verifican rutas, textos, ausencia de audio/video y duraciones.

Patrones utiles para Transicion entre mundos:

- Timeline declarativo en TypeScript.
- Componente pantalla completo, no solo un widget.
- Textos visibles exactos y cortos.
- CSS propio de pantalla con clases prefijadas.
- Reduced motion explicito.
- Progress bar minimalista sin numeros.

### Portada / Intro

Portada / Intro es referencia para handoff hacia Mundo I, pero no debe reabrirse ni redisenarse:

- Vive en `src/screens/Cover/`.
- Centraliza assets en `coverIntroAssets.ts`.
- Centraliza copy y textos de transicion placeholder en `coverIntroContent.ts`.
- Maneja estado narrativo local en `coverIntroState.ts`.
- Actualmente contiene un overlay placeholder dentro de `CoverIntroScreen.tsx` con:
  - `Abriendo Mundo I: Raiz...`
  - `Preparando recorrido...`
  - texto pendiente de transicion visual final;
  - link manual `Continuar a Mundo I`.
- Usa `LiaHybridAvatar` como rig/pose local para Lía.
- Usa `data-cover-phase`, `data-testid` y `data-runtime-asset` para pruebas y auditoria.
- Reduced motion se resuelve por CSS apagando animaciones continuas.

Patrones utiles para Transicion entre mundos:

- Reutilizar ruta de origen `/portada` como disparador futuro.
- Reutilizar el copy ya aprobado para la transicion: `Abriendo Mundo I: Raiz...` y `Preparando recorrido...`.
- Reutilizar la idea de `data-*` para fase y version.
- Reutilizar assets locales aprobados solo si el ticket funcional lo permite.

Patrones que no deben trasladarse tal cual:

- No arrastrar dialogos, botones ni gating narrativo a la transicion.
- No usar `localStorage` para la transicion.
- No meter la transicion real como overlay permanente dentro de Portada si puede vivir como pantalla propia.
- No convertir el placeholder actual con link manual en el producto final.

## Estilos globales y tokens

El repo tiene tokens minimos en `src/styles/tokens.css`:

- colores base: `--gvo-bg`, `--gvo-surface`, `--gvo-text`, `--gvo-muted`, `--gvo-border`, `--gvo-accent`, `--gvo-amber`;
- radio y sombra base: `--gvo-radius`, `--gvo-shadow`;
- fuente global de sistema.

`src/main.tsx` importa `@fontsource-variable/pixelify-sans/index.css`, por lo que Pixelify Sans ya esta disponible localmente sin CDN. Para la transicion conviene usar esa fuente en titulos/progreso, pero no se debe instalar nada.

`src/styles/global.css` contiene estilos generales y placeholders. La nueva pantalla no deberia depender de `.base-panel` ni `.mobile-shell`, porque la transicion necesita ser inmersiva, breve y full-screen mobile-first. Debe tener CSS propio.

## Uso actual de Motion

`motion/react` aparece en `MobileShell`, usado para placeholders generales. Las pantallas visuales principales (`LoadingInitial` y `CoverIntro`) usan principalmente CSS animations, keyframes y media queries.

Decision para T003B:

- No usar Motion para `TransitionWorld` salvo que un ticket futuro lo justifique.
- Preferir CSS animations y CSS variables para mantener el mismo patron de Carga Inicial y Portada.
- No agregar GSAP, Three.js, React Three Fiber, Drei, Blender ni GLB.

## Pruebas existentes

Unitarias:

- `LoadingInitialScreen.test.tsx`
- `CoverIntroScreen.test.tsx`
- `progress.test.ts`

E2E:

- `tests/e2e/smoke.spec.ts`
- `tests/e2e/loading-initial.spec.ts`
- pruebas QA documentales de Portada / Intro.

`playwright.config.ts` corre e2e en mobile Chromium, serializado con `workers: 1`, para evitar flakiness en capturas y rutas animadas.

Para T003B, los tests minimos deberian cubrir:

- render de textos exactos;
- ausencia de botones/interaccion;
- ausencia de audio/video;
- progress bar sin numeros visibles;
- reduced motion;
- no overflow horizontal en 360/390/430;
- ruta nueva solo si el ticket funcional la autoriza.

## Scripts npm disponibles

Comandos generales:

- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run lint`
- `npm run check`
- `npm run status`
- `npm run audit:assets`
- `npm run test:e2e`

Comandos de assets existentes:

- `npm run assets:normalize:loading`
- `npm run assets:validate:loading`
- `npm run validate:cover-intro-assets`

No existe todavia validador especifico para `transition-world`. Si T003B o T003C agrega assets runtime de transicion, conviene crear despues:

- `tools/validate_transition_world_assets.mjs`
- `npm run validate:transition-world-assets`

No se recomienda crear ese script en T003A porque este ticket no agrega assets.

## Ubicacion tecnica propuesta para TransitionWorld

Crear la nueva feature como pantalla en:

```text
src/screens/TransitionWorld/
```

Motivo:

- Es una pantalla completa del flujo, no un componente generico pequeno.
- Encaja con `src/screens/LoadingInitial/` y `src/screens/Cover/`.
- Evita sobrecargar `src/components/transition/TransitionPlaceholder.tsx`, que hoy es un placeholder simple usado dentro de estaciones.
- Permite tests unitarios, CSS, config, tipos y assets mapping propios.

Estructura propuesta para T003B:

```text
src/screens/TransitionWorld/
├── TransitionWorldScreen.tsx
├── TransitionWorldScreen.css
├── TransitionBackground.tsx
├── TransitionPortal.tsx
├── TransitionLiaSprite.tsx
├── TransitionText.tsx
├── TransitionProgress.tsx
├── TransitionFade.tsx
├── transitionWorld.config.ts
├── transitionWorld.types.ts
├── TransitionWorldScreen.test.tsx
└── index.ts
```

Si el componente crece, una alternativa aceptable es:

```text
src/screens/TransitionWorld/components/
```

Pero para la primera version corta, mantener los subcomponentes en la misma carpeta facilita lectura y evita una jerarquia prematura.

## Responsabilidades propuestas por componente

### `TransitionWorldScreen`

- Pantalla principal.
- Recibe o lee una config de transicion.
- Renderiza fondo, portal, Lía/fallback, textos, barra y fade.
- Expone metadata:
  - `data-transition-world-version`;
  - `data-transition-from`;
  - `data-transition-to`;
  - `data-duration-ms`;
  - `data-reduced-motion-duration-ms`.

### `TransitionBackground`

- Fondo suave, local, sin imagen remota.
- Puede ser CSS-only en T003B.
- Debe evitar saturacion y no competir con portal/texto.

### `TransitionPortal`

- Portal central.
- Puede usar asset local aprobado de Portal I si T003B lo autoriza, o fallback CSS pixelart temporal.
- No debe activar logica de portada ni portales bloqueados.

### `TransitionLiaSprite`

- Lía pixelart pequena o fallback temporal controlado.
- Debe evitar rig complejo en primera pasada.
- Debe aceptar reduced motion.

### `TransitionText`

- Textos exactos:
  - `Abriendo Mundo I: Raiz...`
  - `Preparando recorrido...`
- Sin copy pedagogico nuevo.
- Sin dialogos.

### `TransitionProgress`

- Barra minima de progreso.
- Sin porcentaje visible.
- Sin numeros.
- Con `role="progressbar"` solo si mantiene semantica clara.

### `TransitionFade`

- Fade de entrada/salida visual.
- No debe navegar automaticamente en T003A.
- En T003B puede coordinarse con router si el ticket lo autoriza.

### `transitionWorld.config.ts`

Debe centralizar:

- version;
- duracion normal;
- duracion reduced motion;
- origen/destino;
- textos visibles;
- posible ruta destino futura;
- assets fallback si aplica.

Ejemplo conceptual para T003B:

```ts
export const transitionWorldConfig = {
  version: "t003b-v1",
  from: "cover-intro",
  to: "world-1-root",
  durationMs: 1800,
  reducedMotionDurationMs: 900,
  title: "Abriendo Mundo I: Raiz...",
  subtitle: "Preparando recorrido...",
} as const;
```

### `transitionWorld.types.ts`

Debe definir tipos para:

- origen;
- destino;
- config;
- fases visuales;
- estado de reduced motion si se modela en TS.

## Assets propuestos para fases futuras

T003A no crea assets. Para T003B, si se permite fallback temporal, se puede iniciar CSS-only. Para T003C o un ticket de staging se recomienda:

```text
public/assets/runtime/transition-world/
├── manifest.json
├── portal/
├── lia/
└── background/
```

Si se reutiliza Portal I de Portada, debe referenciarse desde `coverIntroAssets` o desde una config de transicion con rutas explicitas, sin duplicar PNG.

## Patrones a reutilizar

- Pantalla autocontenida por carpeta bajo `src/screens/`.
- `index.ts` exportando la pantalla.
- CSS dedicado con prefijo de clase propio, por ejemplo `transition-world__`.
- Timeline/config declarativo en TS.
- Textos centralizados, no hardcodeados en multiples sitios.
- Data attributes para versiones, duraciones y pruebas.
- `role="progressbar"` con `aria-valuetext`, sin porcentaje visible.
- Reduced motion por CSS y pruebas.
- Assets locales bajo `/assets/runtime/...`, nunca URLs externas.
- Pruebas unitarias con Testing Library y e2e mobile con Playwright.
- Auditoria de ausencia de audio/video/CDN con `npm run audit:assets`.

## Patrones que NO deben repetirse

- No repetir el largo ciclo de microajustes de layout de la carga inicial antes de tener una version funcional simple.
- No implementar la transicion dentro de Portada como un overlay con botones.
- No sumar dialogos, pedagogia, portales bloqueados ni estado de desbloqueo.
- No usar `localStorage` para una pantalla efimera.
- No crear una dependencia nueva para animacion.
- No agregar Three.js, R3F, Drei, Blender, GLB, video ni audio.
- No crear assets finales sin asset plan/ticket de staging.
- No depender de capturas documentales como parte obligatoria de cada test funcional.
- No usar rutas ambiguas que mezclen `/portada` con `/estacion/1` sin una pantalla de transicion explicita.

## Riesgos visuales

- Que la transicion se sienta como una segunda portada si reutiliza demasiados elementos visuales de `CoverIntro`.
- Que Lía compita con el portal si se escala demasiado grande.
- Que el fallback CSS parezca placeholder tecnico y baje la calidad visual.
- Que la barra de progreso parezca UI tecnica pesada.
- Que el texto se vea como dialogo o contenido pedagogico si se agregan frases.
- Que el portal central se vea como boton interactivo. Debe ser visual, no clickeable.

## Riesgos tecnicos

- Integrar navegacion automatica sin decision de duracion y sin tests puede romper el flujo `/portada -> /estacion/1`.
- Reutilizar `TransitionPlaceholder` actual podria arrastrar estilos de panel y no servir para una pantalla inmersiva.
- Meter estado de transicion dentro de `CoverIntroScreen` aumentaria el acoplamiento de una pantalla ya aprobada.
- E2E con capturas puede modificar archivos rastreados; si T003B genera capturas, deben restaurarse o separarse de tests funcionales.
- Si se agregan assets de transicion, `audit:assets` debe seguir sin detectar URLs externas ni audio.

## Decision tecnica para T003B

Avanzar a T003B con una implementacion base de pantalla `TransitionWorld` en `src/screens/TransitionWorld/`, sin reabrir Portada / Intro.

Decision concreta:

1. Crear pantalla y subcomponentes propuestos.
2. Empezar con fondo CSS y portal CSS/fallback o asset local aprobado si el ticket lo autoriza explicitamente.
3. Usar textos exactos:
   - `Abriendo Mundo I: Raiz...`
   - `Preparando recorrido...`
4. No incluir botones ni interaccion.
5. No navegar automaticamente en la primera implementacion salvo que T003B lo pida.
6. Agregar ruta solo en T003B si el ticket lo autoriza, por ejemplo `/transicion/mundo-i`.
7. Mantener `/portada` intacta hasta un ticket de integracion posterior.

## Comandos de validacion recomendados

Minimos para T003A:

```powershell
npm run lint
npm run test
npm run build
```

Recomendados para T003B:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e
```

Si se agregan assets:

```powershell
npm run validate:transition-world-assets
```

## Cierre de T003A

T003A deja lista la decision de arquitectura para implementar una transicion breve, local, pixelart y mobile-first sin alterar Portada / Intro.

Estado recomendado al pasar a T003B:

`TRANSICION_ENTRE_MUNDOS_AUDITADA / LISTA_PARA_IMPLEMENTACION_BASE`
