# T003E3 - TransitionWorld real assets preview

## 1. Resumen

Se integraron visualmente los assets reales aprobados de transición raíz en el preview aislado:

`/dev/transition-world`

El cambio reemplaza los fallbacks inline de T003B/T003C/T003D por PNG/WebP runtime aprobados desde:

`src/assets/transition-world/root/runtime/`

Este ticket no implementa animación completa, no conecta navegación real y no modifica Portada / Intro ni Carga Inicial.

Estado final:

`TRANSITION_WORLD_REAL_ASSETS_PREVIEW_T003E3 / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E2-transition-root-assets-ingest`
- Commit base: `cdc38c5 feat: ingest approved transition root assets`
- Rama final: `feature/003E3-transition-world-real-assets-preview`

## 3. Assets integrados por categoría

### Background

Usado visualmente:

- `transition_root_background_v1.webp`
- fallback PNG: `transition_root_background_v1.png`

Decisión: usarlo como fondo full-screen con `object-fit: cover`, centrado, sin repetir y con overlay mínimo para legibilidad.

### Portal

Usado visualmente:

- `portal_root_open_v1.webp`
- fallback PNG: `portal_root_open_v1.png`

Decisión: el preview usa `state="open"` para validar la composición final luminosa. El portal abierto ya incluye símbolo raíz, por lo que `symbol_root_v1` no se superpone en esta fase.

Disponibles para animación futura:

- `portal_root_inactive_v1`
- `portal_root_activating_v1`
- `portal_root_states_3f_v1`
- `symbol_root_v1`

### Lía

Usado visualmente:

- `lia_transition_root_master_v1.webp`
- fallback PNG: `lia_transition_root_master_v1.png`

Decisión: Lía se ubica a la derecha del portal, pequeña y reconocible, para acompañar el umbral sin tapar el símbolo raíz ni los ornamentos centrales. El ancho visual usa `clamp(70px, 20vw, 88px)`.

Disponibles para animación futura:

- `lia_transition_root_idle_4f_v1`
- `lia_transition_root_guide_2f_v1`
- `lia_transition_root_exit_v1`

### Progress

Usado visualmente:

- `transition_root_progress_track_base_v1`
- `transition_root_progress_fill_segment_v1`
- `transition_root_progress_spark_v1`

Decisión: el track base ya incluye extremos/caps integrados, por eso `end_left` y `end_right` no se superponen en el preview. El fill se muestra recortado a `0.64` y el spark se posiciona sobre el punto de avance. No hay porcentaje ni números visibles.

Disponibles para animación futura:

- `transition_root_progress_end_left_v1`
- `transition_root_progress_end_right_v1`
- `transition_root_progress_center_ornament_v1`

## 4. Cambios técnicos

- `TransitionBackground` usa `<picture>` con WebP y fallback PNG.
- `TransitionPortal` usa assets reales por estado (`inactive`, `activating`, `open`) y muestra `open` en el preview.
- `TransitionLiaSprite` usa el asset real master de Lía.
- `TransitionProgress` usa track/fill/spark reales en estructura modular preparada para animación posterior.
- `transition-root-assets.ts` expone URLs resueltas con `import.meta.glob`.
- `TRANSITION_WORLD_VERSION` queda en `T003E3_REAL_ASSETS_PREVIEW`.

## 5. Textos DOM/CSS

Se conservan como texto real en DOM/CSS:

- `Abriendo Mundo I: Raíz...`
- `Preparando recorrido...`

No se incrustaron textos en imágenes.

## 6. Accesibilidad y comportamiento

Se conserva:

- `role="status"`
- `aria-live="polite"`
- anuncio accesible: `Abriendo Mundo I: Raíz. Preparando recorrido.`
- `role="progressbar"` sin porcentaje visible

No se agregaron botones, links ni foco interactivo.

## 7. Confirmación de fuera de alcance

- No se modificó Portada / Intro.
- No se modificó Carga Inicial.
- No se conectó navegación real.
- No se creó ruta funcional nueva.
- No se implementó animación completa.
- No se agregaron dependencias.
- No se usó CDN.
- No se usaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se usó Three.js, React Three Fiber, Drei, Blender ni GLB.

## 8. Capturas generadas

- `docs/visual/transition-world/validation/t003e3/transition-world-t003e3-390x844.png`
- `docs/visual/transition-world/validation/t003e3/transition-world-t003e3-430x932.png`

## 9. Validaciones ejecutadas

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

Resultados:

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 40 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

## 10. Verificación visual adicional

Se verificó en navegador local integrado:

- versión `T003E3_REAL_ASSETS_PREVIEW`;
- 6 imágenes reales cargadas;
- sin overflow horizontal;
- sin botones;
- sin links;
- sin audio;
- sin video.

## 11. Decisión para T003E4

Siguiente paso recomendado: T003E4 debe trabajar animación/motion controlado sobre estos assets reales, manteniendo `/dev/transition-world` como preview aislado hasta que exista ticket explícito de navegación real.
