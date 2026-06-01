# T003C - TransitionWorld visual alignment + asset intake

## 1. Resumen del ticket

T003C reorienta la base no interactiva de `TransitionWorld` creada en T003B para acercarla a la referencia ideal de transición hacia Mundo I: Raíz.

Estado final del ticket: `TRANSITION_WORLD_VISUAL_ALIGNMENT_T003C / EN_REVISION_VISUAL`

La pantalla sigue siendo preview técnico en `/dev/transition-world`. No se integra con Portada / Intro y no navega a Mundo I.

## 2. Rama base y rama final

- Rama base: `feature/003B-transition-world-static-base`
- Commit base: `e5d0e85 feat: add static transition world preview`
- Rama final: `feature/003C-transition-world-visual-alignment-assets`

## 3. Diagnóstico visual de T003B

T003B era técnicamente correcto, pero visualmente se desviaba de la referencia:

- paleta demasiado oscura;
- sensación de cueva o portal mineral;
- portal con contorno rocoso;
- Lía fallback muy pequeña y poco reconocible;
- composición con texto demasiado partido en algunos contextos;
- atmósfera poco cálida para Mundo I: Raíz.

## 4. Referencia ideal como dirección

La referencia se interpretó como dirección visual, no como asset runtime:

- fondo claro, crema y cálido;
- portal central vertical luminoso;
- borde lavanda/dorado;
- centro brillante y cálido;
- símbolo raíz interno;
- Lía a la izquierda del portal;
- texto debajo del portal;
- barra mínima inferior;
- pausa breve, bella y funcional.

No se usó la referencia como imagen de fondo.

## 5. Decisiones visuales tomadas

- Se cambió la paleta a crema, marfil, dorado suave, lavanda tenue y tierra clara.
- Se reemplazó la construcción visual del portal por un SVG inline local dentro del componente.
- Se conservó `role="img"` en el portal, con `shapeRendering="crispEdges"` para mantener lectura pixelart.
- Se reemplazó la Lía fallback de cajas CSS por un SVG inline local temporal con cinco pétalos, visor opalescente, ojos media luna, collar ámbar y bulbo inferior.
- Se mantuvieron los textos como DOM/CSS, sin texto incrustado en imágenes.
- Se conservó la ruta dev aislada `/dev/transition-world`.

## 6. Cambios en fondo

`TransitionBackground` mantiene la estructura de T003B, pero la hoja CSS cambió:

- fondo crema/marfil;
- brillo central cálido detrás del portal;
- lavanda muy tenue como atmósfera;
- grilla pixelart sutil;
- pequeños destellos de baja saturación;
- sin masas laterales oscuras;
- sin sensación de cueva.

## 7. Cambios en portal

`TransitionPortal` ahora usa SVG inline local:

- arco vertical central;
- aura clara;
- marco dorado;
- marco lavanda;
- centro crema/dorado;
- símbolo raíz mínimo;
- highlights internos discretos;
- estado `data-portal-state="open"` conservado.

No se integró `portal_root_base.svg` porque el manifest externo aún lo marca como `pending_approval`.

## 8. Cambios en Lía fallback

`TransitionLiaSprite` ahora usa SVG inline local temporal:

- cinco pétalos simplificados;
- pétalos crema/marfil con puntas lavanda;
- cabeza/visor opalescente;
- ojos media luna mínimos;
- collar ámbar;
- bulbo inferior;
- sin boca, nariz, cejas, brazos, manos, piernas ni pies.

Sigue siendo placeholder temporal. No reemplaza un micro-rig final.

## 9. Cambios en texto/layout

- Texto principal exacto: `Abriendo Mundo I: Raíz...`
- Texto secundario exacto: `Preparando recorrido...`
- En 390x844 y 430x932 el texto principal queda en una línea.
- El portal queda como foco central.
- Lía queda a la izquierda del portal, visible y menor que el portal.
- La zona inferior conserva barra mínima y aire visual.

## 10. Cambios en barra

`TransitionProgress` conserva estructura accesible, pero la CSS se ajustó:

- barra horizontal más delicada;
- track claro;
- relleno dorado suave;
- endpoints tipo pixel/rombo;
- sin números;
- sin porcentaje;
- estado preview sin progreso real funcional.

## 11. Inventario de assets encontrados

### Repo

| Ruta | Tipo | Tamano | Transparencia | Evaluacion |
| --- | --- | --- | --- | --- |
| `public/assets/runtime/cover-intro/portals/portal_1/frame/portal_1_frame_enabled_v1.png` | PNG portal portada | 941x1672 | si | Candidato futuro, no integrado porque pertenece a Portada. |
| `public/assets/runtime/cover-intro/portals/portal_1/glow/portal_1_glow_enabled_v1.png` | PNG glow portada | 941x1672 | si | Candidato futuro, no integrado porque pertenece a Portada. |
| `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png` | PNG Lía pose | 941x1672 | si | Candidato de referencia; escala/formato no ideal para transición breve. |
| `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png` | PNG Lía pose | 941x1672 | si | Candidato de referencia; no micro-rig. |
| `public/assets/runtime/cover-intro/lia/rig/idle_v1/` | PNG rig por capas | 941x1672 por capa | si | Candidato para T003D si se decide reutilizar rig de Portada. |
| `public/assets/runtime/loading-initial/lia/lia_loading_16f.png` | PNG spritesheet | 2560x2560 | si | Rechazado para transición; pertenece a carga inicial. |
| `public/assets/runtime/loading-initial/ground/ground_halo_01_orbital_ring.png` | PNG halo | 960x256 | si | Rechazado por no corresponder a portal raíz. |

### Carpeta externa local

Ruta inspeccionada:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\transicion_entre_mundos_v1`

Archivos útiles encontrados:

- `04_runtime_export/manifest/asset_manifest_transition_root.json`
- `04_runtime_export/manifest/assets_required_transition_root.csv`
- `04_runtime_export/json/transition_root_palette.tokens.json`

El manifest declara assets esperados, pero su estado es `pending_approval`.

## 12. Assets integrados

No se integraron assets raster ni SVG externos.

Se usaron únicamente:

- CSS local;
- SVG inline local en React;
- tokens de paleta tomados como guía desde `transition_root_palette.tokens.json`.

## 13. Assets rechazados o pendientes

Pendientes para T003D/T003C-assets:

- `lia_transition_idle_root.webp/png`
- `lia_transition_point_root.webp/png`
- `portal_root_base.svg`
- `portal_root_glow.svg`
- `symbol_root.svg`
- `transition_root_background.css/svg/png`
- `transition_progress.css`
- `transition_sparkles.css`

Motivo: el manifest externo los marca como `pending_approval` y las carpetas aprobadas no contienen todavía archivos finales distintos de `.gitkeep`.

## 14. Requisitos adicionales de assets

No se requiere rig completo para Lía en esta etapa.

Sí se recomienda micro-rig pixelart para versión final:

- `lia_transition_root_idle_4f.png` o `.webp`
- `lia_transition_root_guide_2f.png` o `.webp`
- `lia_transition_root_exit_1f.png` o `.webp`
- `lia_transition_root_blink_1f.png` o `.webp` opcional
- `lia_transition_root_spritesheet.json` opcional

Requisitos:

- pixelart real;
- fondo transparente;
- cinco pétalos;
- visor opalescente;
- ojos media luna;
- collar ámbar;
- bulbo inferior;
- sin extremidades ni rasgos humanos.

## 15. Decisión sobre micro-rig de Lía

T003C no implementa micro-rig.

Decisión: avanzar a T003D con un ticket de assets/motion que defina si Lía usa:

1. micro-rig nuevo específico de transición; o
2. reutilización controlada del rig de Portada ajustado a escala de transición.

La opción recomendada es micro-rig específico.

## 16. Riesgos pendientes antes de animación

- El portal SVG inline es una base visual, no asset final.
- Lía fallback es digna para preview, pero no final.
- El símbolo raíz aún debe pulirse con asset final.
- La barra está en estado preview, no representa progreso real.
- La ruta destino `/mundo-i-raiz` sigue siendo documental.

## 17. Cómo abrir preview

```powershell
npm run dev
```

Abrir:

`http://127.0.0.1:5173/dev/transition-world`

## 18. Capturas generadas

- `docs/visual/transition-world/validation/t003c/transition-world-t003c-390x844.png`
- `docs/visual/transition-world/validation/t003c/transition-world-t003c-430x932.png`

Las capturas se generan desde `tests/e2e/transition-world.spec.ts`.

## 19. Comandos de validación ejecutados

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

Resultados:

- `npm run lint`: OK.
- `npm run test`: OK, 38 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

## 20. Estado final del repo

Cambios esperados:

- alineación visual de `TransitionWorld`;
- capturas T003C;
- documentación T003C;
- pruebas actualizadas.

No se modificó Portada / Intro.
No se modificó Carga Inicial.
No se agregaron dependencias.
No se integraron assets finales.

## 21. Recomendación para T003D

Crear T003D como ticket de animación/motion controlado o asset staging final:

1. aprobar o producir micro-rig de Lía para transición;
2. aprobar `portal_root_base.svg`, `portal_root_glow.svg` y `symbol_root.svg`;
3. reemplazar fallback inline solo cuando los assets estén limpios;
4. definir animación breve de 2300ms;
5. mantener `/dev/transition-world` hasta integración funcional con Portada.
