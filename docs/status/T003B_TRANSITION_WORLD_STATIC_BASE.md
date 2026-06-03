# T003B — TransitionWorld static base

## Estado

Estado del ticket: IMPLEMENTADO / EN_REVISION_TECNICA

Rama base: `feature/003A-auditoria-transicion-entre-mundos`

Rama de trabajo: `feature/003B-transition-world-static-base`

Este ticket crea una base visual no interactiva para la pantalla de transición entre mundos. No integra la transición con Portada / Intro, no crea navegación real hacia Mundo I y no implementa contenido de estación.

## Objetivo Cubierto

Se creó un preview técnico local para la primera transición:

- origen documental: Portada / Intro;
- destino conceptual: Mundo I: Raíz;
- texto principal visible: `Abriendo Mundo I: Raíz...`;
- texto secundario visible: `Preparando recorrido...`;
- duración normal configurada: `2300ms`;
- duración reduced motion configurada: `1000ms`;
- ruta dev aislada: `/dev/transition-world`.

La ruta dev existe solo para revisión técnica/visual. No está enlazada desde Portada / Intro ni altera el flujo funcional actual.

## Archivos Inspeccionados

- `docs/status/T003A_AUDITORIA_TRANSICION_ENTRE_MUNDOS.md`
- `src/app/router.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/loadingInitialTimeline.ts`
- `src/screens/LoadingInitial/loadingInitialMotionTimeline.ts`
- `src/screens/LoadingInitial/liaFrameRegistration.ts`
- `src/screens/Cover/CoverIntroScreen.tsx`
- `src/screens/Cover/CoverIntroScreen.css`
- `src/screens/Cover/coverIntroAssets.ts`
- `src/screens/Cover/coverIntroContent.ts`
- `src/screens/Cover/LiaHybridAvatar.tsx`
- `src/components/transition/TransitionPlaceholder.tsx`
- `src/components/layout/MobileShell.tsx`
- `tests/e2e/loading-initial.spec.ts`
- `package.json`

## Estructura Implementada

Se creó la feature en:

`src/screens/TransitionWorld/`

Archivos:

- `TransitionWorld.tsx`
- `TransitionWorld.module.css`
- `transitionWorld.config.ts`
- `transitionWorld.types.ts`
- `TransitionWorld.test.tsx`
- `index.ts`
- `components/TransitionBackground.tsx`
- `components/TransitionPortal.tsx`
- `components/TransitionLiaSprite.tsx`
- `components/TransitionText.tsx`
- `components/TransitionProgress.tsx`
- `components/TransitionFade.tsx`

La estructura sigue la decisión de T003A, pero usa `TransitionWorld.tsx` y CSS modules para mantener la base preview aislada y fácil de reemplazar cuando entren assets finales.

## Decisiones Visuales

La base T003B usa CSS/DOM local en lugar de assets finales. Esto evita integrar arte incompleto y permite probar jerarquía, composición y duración sin bloquear la dirección visual futura.

Elementos incluidos:

- fondo suave mobile-first;
- portal central pixelart por CSS;
- fallback temporal de Lía en pixelart CSS;
- textos mínimos como DOM;
- barra mínima de progreso sin porcentaje ni números;
- capa de fade ambiental;
- reduced motion simple.

Elementos no incluidos:

- assets finales;
- imágenes nuevas;
- portal exportado desde Photopea;
- Lía final de transición;
- animación funcional de handoff;
- ruta runtime hacia estación.

## Inventario de Assets

### Repo actual

Assets útiles como referencia futura, no integrados en T003B:

- `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png`
- `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png`
- `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png`
- `public/assets/runtime/cover-intro/lia/rig/`
- `public/assets/runtime/loading-initial/`
- `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png`

Estos assets pertenecen a pantallas existentes o referencias. No se reutilizaron como runtime de TransitionWorld para evitar mezclar estados visuales antes del staging T003C.

### Carpeta local externa

Ruta inspeccionada:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\transicion_entre_mundos_v1`

Estructura relevante encontrada:

- `00_especificacion/`
- `01_referencias_chatgpt/`
- `02_aprobadas/background/`
- `02_aprobadas/effects/`
- `02_aprobadas/lia_pixelart/`
- `02_aprobadas/portal/`
- `02_aprobadas/progress/`
- `02_aprobadas/symbols/`
- `03_editables_photopea/`
- `04_runtime_export/json/`
- `04_runtime_export/manifest/`
- `04_runtime_export/png/`
- `04_runtime_export/svg/`
- `04_runtime_export/webp/`
- `05_descartadas/`
- `06_notas_revision/`

Archivos runtime ya presentes en export externo:

- `04_runtime_export/json/transition_root_palette.tokens.json`
- `04_runtime_export/manifest/asset_manifest_transition_root.json`
- `04_runtime_export/manifest/assets_required_transition_root.csv`

Los directorios de PNG/SVG/WebP existen, pero T003B no copia ni normaliza assets finales.

## Patrones Reutilizados

De Carga Inicial:

- duración explícita en config;
- reduced motion con duración propia;
- textos mínimos y estables;
- barra sin porcentaje ni números;
- composición mobile-first;
- no audio, no video, no CDN.

De Portada / Intro:

- enfoque por componentes pequeños;
- runtime aislado por pantalla;
- data attributes para QA;
- texto final como DOM;
- separación entre preview técnico y navegación real.

## Patrones que No se Repiten

- No se reutiliza el placeholder genérico de estación como pantalla final.
- No se crea interacción ni botón.
- No se abre Mundo I.
- No se enlaza desde Portada.
- No se copian assets de Portada para simular una transición final.
- No se instala ninguna dependencia.

## API Técnica Inicial

`TransitionWorld` acepta:

- `config?: TransitionWorldConfig`
- `variant?: "preview" | "runtime"`
- `isReducedMotion?: boolean`

Config principal:

- `id: "intro-to-station-1"`
- `fromRoute: "/portada"`
- `toRoute: "/mundo-i-raiz"`
- `durationMs: 2300`
- `reducedMotionDurationMs: 1000`

La ruta `toRoute` es placeholder documental. No existe integración funcional hacia esa ruta en T003B.

## Accesibilidad

- La pantalla usa `main` con `aria-labelledby` y `aria-describedby`.
- El portal tiene `role="img"` con etiqueta corta.
- Lía fallback tiene `role="img"` con etiqueta temporal explícita.
- La barra usa `role="progressbar"` y `aria-valuetext`, sin mostrar porcentaje ni números en UI.
- No hay botones ni enlaces en la pantalla.

## Riesgos Visuales y Técnicos

- El portal CSS es solo una maqueta; no reemplaza el arte final.
- Lía fallback es temporal y debe ser sustituida por asset aprobado o rig ligero en T003C/T003D.
- `/dev/transition-world` no debe enlazarse desde navegación pública.
- `toRoute: "/mundo-i-raiz"` es una intención de flujo, no ruta funcional.
- La duración de `2300ms` debe validarse visualmente cuando haya assets finales.

## Validación Recomendada

Comandos para cierre de T003B:

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

Se recomienda ejecutar `npm run audit:assets` si se quiere comprobar de nuevo que no se introdujeron recursos externos, aunque T003B no agrega assets runtime.

## Decisión Técnica para T003C

Pasar a T003C con una tarea acotada de staging/normalización de assets de transición:

1. revisar `transicion_entre_mundos_v1/04_runtime_export/manifest/asset_manifest_transition_root.json`;
2. copiar solo assets aprobados al repo;
3. crear `src/screens/TransitionWorld/transitionWorldAssets.ts`;
4. reemplazar el portal CSS y Lía fallback solo cuando existan assets aprobados;
5. mantener `/dev/transition-world` como ruta de QA hasta que la integración con Portada tenga ticket funcional.

T003B queda como base de montaje, no como pantalla visual aprobada.
