# T003E2 - Transition root assets ingest

## 1. Resumen

Se ingirieron en el repositorio los assets aprobados para la primera transición:

`Portada / Intro -> Mundo I: Raíz`

Este ticket prepara el paquete runtime de assets de transición raíz, actualiza el manifest y agrega validación dimensional. No modifica la pantalla `/dev/transition-world`, no conecta navegación real y no implementa animación.

Estado final del ticket:

`TRANSITION_ROOT_ASSETS_INGESTED_T003E2 / READY_FOR_T003E3_VISUAL_INTEGRATION`

## 2. Rama base y rama final

- Rama base: `feature/003E1A-transition-world-reference-pack`
- Commit base: `6431e8f docs: prepare transition world image reference pack`
- Rama final: `feature/003E2-transition-root-assets-ingest`

## 3. Fuente local aprobada

Los assets se copiaron desde:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\transicion_entre_mundos_v1\02_aprobadas`

Subcarpetas usadas:

- `lia_pixelart`
- `portal`
- `background`
- `progress`

No se copiaron PSD, mockups, candidatos, rechazados ni review boards al runtime del repositorio.

## 4. Estructura runtime creada

```text
src/assets/transition-world/root/runtime/
├── background/
├── lia/
├── portal/
├── progress/
└── validation/
```

## 5. Assets copiados

### Lía

- `runtime/lia/lia_transition_root_master_v1.png`
- `runtime/lia/lia_transition_root_master_v1.webp`
- `runtime/lia/lia_transition_root_idle_4f_v1.png`
- `runtime/lia/lia_transition_root_idle_4f_v1.webp`
- `runtime/lia/lia_transition_root_guide_2f_v1.png`
- `runtime/lia/lia_transition_root_guide_2f_v1.webp`
- `runtime/lia/lia_transition_root_exit_v1.png`
- `runtime/lia/lia_transition_root_exit_v1.webp`

### Portal

- `runtime/portal/portal_root_master_v1.png`
- `runtime/portal/portal_root_master_v1.webp`
- `runtime/portal/portal_root_states_3f_v1.png`
- `runtime/portal/portal_root_states_3f_v1.webp`
- `runtime/portal/portal_root_inactive_v1.png`
- `runtime/portal/portal_root_inactive_v1.webp`
- `runtime/portal/portal_root_activating_v1.png`
- `runtime/portal/portal_root_activating_v1.webp`
- `runtime/portal/portal_root_open_v1.png`
- `runtime/portal/portal_root_open_v1.webp`
- `runtime/portal/symbol_root_v1.png`
- `runtime/portal/symbol_root_v1.webp`

### Fondo

- `runtime/background/transition_root_background_v1.png`
- `runtime/background/transition_root_background_v1.webp`

### Barra de progreso

- `runtime/progress/transition_root_progress_track_base_v1.png`
- `runtime/progress/transition_root_progress_track_base_v1.webp`
- `runtime/progress/transition_root_progress_fill_segment_v1.png`
- `runtime/progress/transition_root_progress_fill_segment_v1.webp`
- `runtime/progress/transition_root_progress_spark_v1.png`
- `runtime/progress/transition_root_progress_spark_v1.webp`
- `runtime/progress/transition_root_progress_end_left_v1.png`
- `runtime/progress/transition_root_progress_end_left_v1.webp`
- `runtime/progress/transition_root_progress_end_right_v1.png`
- `runtime/progress/transition_root_progress_end_right_v1.webp`
- `runtime/progress/transition_root_progress_center_ornament_v1.png`
- `runtime/progress/transition_root_progress_center_ornament_v1.webp`

## 6. Manifest actualizado

Se actualizó:

`src/assets/transition-world/root/asset-manifest.transition-root.json`

Cambios principales:

- `version`: `t003e2`
- `status`: `approved_assets_ingested`
- `source.pipeline`: `chatgpt-images-photopea`
- assets runtime marcados como `approved` y `runtimeReady: true`
- rutas PNG/WebP relativas a `src/assets/transition-world/root`
- dimensiones reales de PNG documentadas y validadas
- omisiones documentadas para review board y PSD

También se creó:

`src/assets/transition-world/root/transition-root-assets.ts`

Este archivo expone el manifest y un índice por `id` para una futura integración controlada.

## 7. Resultado dimensional

El validador confirma las dimensiones PNG del paquete aprobado.

Dos archivos difieren del brief inicial, pero coinciden con los assets aprobados recibidos y no fueron alterados:

- `runtime/portal/symbol_root_v1.png`: `256x256`; el brief inicial sugería `128x128`.
- `runtime/progress/transition_root_progress_fill_segment_v1.png`: `1152x96`; el brief inicial sugería `960x48`.

Decisión técnica: conservar las dimensiones reales aprobadas, documentarlas en manifest y no redimensionar assets en este ticket.

## 8. Script de validación

Se creó:

`scripts/validate-transition-root-assets.mjs`

Y se agregó el script npm:

```powershell
npm run validate:transition-root-assets
```

Valida:

- manifest JSON existente y con estado `approved_assets_ingested`;
- todos los assets del manifest con `status: approved`;
- `runtimeReady: true`;
- existencia de PNG y WebP;
- dimensiones PNG por header;
- consistencia de spritesheets con `frameCount`, `frameWidth` y `frameHeight`;
- ausencia de PSD en runtime;
- ausencia de nombres con espacios;
- ausencia de nombres `mockup`, `candidate`, `rejected`, `review_board` o equivalentes.

Resultado:

```text
Transition root assets OK: 34 archivos runtime validados.
```

## 9. Assets omitidos

Se omitieron explícitamente:

- `transition_root_progress_review_board_v1.png`
- `transition_root_progress_review_board_v1.webp`
- cualquier archivo `.psd`
- cualquier mockup, candidato, rechazado o review board

Motivo: no son assets runtime finales para la app.

## 10. Cambios no realizados

- No se modificó `/dev/transition-world` visualmente.
- No se integraron los nuevos assets en la pantalla.
- No se creó animación.
- No se conectó Portada / Intro con Mundo I.
- No se creó ruta funcional nueva.
- No se modificó Portada / Intro.
- No se modificó Carga Inicial.
- No se agregaron dependencias.
- No se usó CDN.
- No se usaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se usó Three.js, React Three Fiber, Drei, Blender ni GLB.

## 11. Validaciones ejecutadas

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
```

`test:e2e` no se requiere para T003E2 porque no se modificaron rutas, pantallas, navegación ni runtime visual. Se mantiene para el próximo ticket si se integra el paquete en `/dev/transition-world`.

## 12. Decisión para T003E3

Pasar a T003E3 con una integración visual controlada del paquete aprobado en `/dev/transition-world`, todavía como preview aislado.

T003E3 debería:

1. reemplazar el fallback inline con assets runtime aprobados;
2. conservar la transición aislada en `/dev/transition-world`;
3. no conectar navegación real todavía;
4. validar mobile 360, 390 y 430;
5. mantener sin audio, sin video runtime, sin CDN y sin recursos externos.
