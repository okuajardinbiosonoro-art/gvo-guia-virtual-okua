# T003E4A - Progress fill alignment

## 1. Resumen

Se corrigió únicamente el alineamiento fino del `fill segment` dentro del track de la progress bar en:

`/dev/transition-world`

Este ticket no modifica escala general, portal, Lía, background, textos, assets ni navegación real.

Estado final:

`TRANSITION_PROGRESS_FILL_ALIGNMENT_T003E4A / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E4-transition-preview-static-corrections`
- Commit base: `4b3ce23 fix: correct transition preview scale and progress layering`
- Rama final: `feature/003E4A-progress-fill-alignment`

## 3. Observación del usuario

La barra ya no tenía el fill tapando el contorno izquierdo, pero el fill quedó demasiado corrido hacia la derecha y dejaba un hueco visible al inicio. Además, el relleno todavía no calzaba con precisión dentro del contorno.

## 4. Diagnóstico del problema

La geometría T003E4 usaba:

- `--transition-progress-inner-inset: 7%`
- `--transition-preview-fill-width: 54%`
- fill renderizado desde su propio `x=0` dentro del clip
- clip vertical a alto completo (`top: 0`, `bottom: 0`)

Eso producía dos efectos:

1. El clip iniciaba demasiado a la derecha, creando el hueco izquierdo visible.
2. El fill no estaba alineado contra el sistema completo del track, sino contra el inicio del clip.
3. El alto completo del clip permitía que el fill/glow quedara menos contenido por el canal visual.

## 5. Ajustes aplicados

Se separaron variables semánticas para la geometría interna:

```css
--transition-progress-track-inset-left: 3.6%;
--transition-progress-track-inset-right: 5.2%;
--transition-progress-channel-inset-y: 17%;
--transition-progress-fill-offset-x: var(--transition-progress-track-inset-left);
--transition-progress-fill-scale: 1;
--transition-preview-fill-width: 58.6%;
--transition-preview-spark-x: 62.2%;
```

Cambios de comportamiento:

- El clip del fill ahora inicia más cerca del inicio útil del canal.
- El fill se compensa con offset negativo para alinearse con la geometría full-width del track.
- El clip usa inset vertical para contener mejor el fill dentro del canal.
- El track sigue encima del fill (`z-index: 3`).
- El spark sigue encima de ambos (`z-index: 4`) y se alinea con la punta del avance.

## 6. Confirmaciones de alcance

- No se modificaron PNG/WebP runtime.
- No se reexportaron assets.
- No se modificó escala general.
- No se modificó portal.
- No se modificó Lía.
- No se modificó background.
- No se modificaron textos.
- No se modificó Portada / Intro.
- No se modificó Carga Inicial.
- No se conectó navegación real.
- No se agregó audio.
- No se agregó video.
- No se agregó CDN.
- No se agregaron dependencias.

## 7. Pendiente futuro

Queda registrado como pendiente futuro:

`T003H - Sistema compartido de progress bar GVO`

Alcance recomendado:

- revisar barra de Carga Inicial;
- revisar barra de Transición;
- definir componente compartido;
- preservar variantes visuales;
- evitar romper pantallas existentes.

Este ticket no implementa ese sistema compartido porque afectaría más de una pantalla y requiere auditoría visual separada.

## 8. Capturas generadas

- `docs/visual/transition-world/validation/t003e4a/transition-world-t003e4a-390x844.png`
- `docs/visual/transition-world/validation/t003e4a/transition-world-t003e4a-430x932.png`

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

## 10. Estado final del repo

El cierre del ticket debe quedar publicado en `feature/003E4A-progress-fill-alignment` con working tree limpio.

Verificación adicional en navegador interno:

- ruta: `http://127.0.0.1:5173/dev/transition-world`
- versión DOM: `T003E4A_PROGRESS_FILL_ALIGNMENT`
- `data-progress-preview`: `0.62`
- sin overflow horizontal
- sin botones, links, audio ni video
- imágenes cargadas correctamente
