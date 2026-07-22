# GVO — handoff de cierre de Estación IV

## Uso de este documento

Este handoff permite continuar el proyecto sin reconstruir decisiones de
Estación IV. Describe el resultado aprobado, sus fuentes canónicas, límites y
validaciones. No autoriza implementar Estación V ni Mundo VI.

## Identidad del proyecto

- Proyecto: GVO — Guía Virtual OKÚA.
- Repositorio local: `gvo-guia-virtual-okua`.
- Rama de cierre: `main`.
- Stack: React 19, TypeScript, Vite 8, React Router 7, Vitest 4,
  Playwright y `vite-plugin-pwa`.
- Baseline publicado anterior a Estación IV:
  `b94c3287834c718e7ef970af9ec62da4789770f3`.
- Commit final de Estación IV: **el commit que contiene este documento**.

El SHA exacto no se incrusta aquí porque cambiar el contenido cambiaría el SHA
del mismo commit. El reporte externo posterior al push debe registrar commit
completo/corto, URL GitHub, `HEAD`, `origin/main`, remoto, divergencia y status
limpio. Hasta que esa evidencia exista, este documento no afirma que commit,
push o limpieza final ya hayan ocurrido.

## Estado aprobado

La revisión humana vinculante de `018E` considera Estación IV completamente
aprobada en:

- composición estática y layout inmersivo;
- entorno, mesa, tarjeta, CTA y 20 assets runtime;
- portrait y landscape;
- Fullscreen API y OrientationHint;
- secuencia 1→8 mediante click, toque, Enter y Space;
- ruta SVG activa y FX semánticos de los ocho nodos;
- guía y movimiento de Lía;
- ambiente técnico y ayuda tap;
- chain complete, CTA, salida, revisita y reduced motion.

No reabrir diseño, layout, assets, animaciones, fullscreen, PWA, copy o
narrativa salvo que una validación reproducible demuestre una regresión.

## Flags históricos

Preservar estos resultados sin reescribirlos:

```text
018A     GVO_ST4_018A_AUDIT_AND_MASTER_ASSET_INVENTORY_COMPLETE
018B     GVO_ST4_018B_MF01_CAMERA_AND_REFERENCE_PACK_READY
018C     GVO_ST4_018C_MF05_STATIC_COMPOSITION_READY_FOR_HUMAN_REVIEW
018C_R1  GVO_ST4_018C_R1_PARTIAL_PLATFORM_LIMITATION
018D     GVO_ST4_018D_MF06_PARTIAL_ENVIRONMENT_LIMITATION
```

R1 fue parcial porque la plataforma no permitía instalar/reabrir una PWA real.
018D fue parcial porque no expuso el canal JavaScript del Browser integrado.
La aprobación humana posterior cierra el gate visual, pero no cambia lo que
esas sesiones pudieron o no pudieron ejecutar.

## Evolución resumida

- `018A`: auditó la base Fable preexistente, separó lógica útil de arte
  provisional e inventarió 29 slots potenciales.
- `018B`: fijó 3D estilizado museográfico, texto arriba/mesa abajo, cámara,
  anchors, capas, responsive y reference pack.
- Producción: generó y aprobó assets uno por uno bajo una referencia común.
- `018C`: integró 20 assets runtime, 20 mirrors y composición alpha-aware.
- `018C_R1`: resolvió layout inmersivo, tono, orientación, fullscreen y el
  diagnóstico que excluyó z5 sólo del render.
- `018D`: implementó motion, ruta, FX, Lía, ambiente, tap hint, cierre y
  reduced motion.
- `018E`: incorpora aprobación humana, documentación, retrospectiva, handoffs
  y cierre Git autorizado.

## Experiencia final

Cadena inmutable:

```text
Planta
→ Bionosificador
→ ESP32
→ MIDI
→ Wi‑Fi/UDP
→ Router
→ Sistema central
→ Sonido
```

La experiencia enseña una mediación técnica: la planta origina una señal; no
“canta” directamente. Los nodos se abren en orden, los completados son
revisables, la CTA sólo se habilita al terminar y la salida apunta a
`/transition/world-4-to-world-5`.

## Mapa técnico

Ruta:

```text
/estacion/4
```

Paths principales:

```text
src/screens/World4Root/
src/components/OrientationHint/
src/shared/immersive/
public/assets/gvo/stations/world-4/system-table/runtime/
public/assets/gvo/current-used/world-4-root/
```

Componentes clave:

- `World4RootScreen.tsx`: máquina pedagógica, tarjeta, CTA y navegación.
- `useWorld4MotionController.ts`: coreografía cancelable, epoch y lock.
- `World4Stage.tsx`: cámara y capas.
- `World4NodeStack.tsx`: anchors, arte alpha-aware y botones nativos.
- `World4RoutePulse.tsx`: siete segmentos y traveler.
- `World4NodeFx.tsx`: FX único y semántico por nodo.
- `World4LiaGuide.tsx`: poses, ocho offsets y travel.
- `World4AmbientLayer.tsx`: haze, ribbons y motes limitados.
- `World4TapHint.tsx`: ayuda una vez por sesión.
- `world4AssetManifest.ts`: hashes y bboxes.
- `world4Geometry.ts`: artboard, anchors y z-order.

## Composición y capas

- Texto arriba; mesa abajo.
- Artboard `1536×1024`, `aspect-ratio: 3/2`.
- Escala CSS uniforme, anchors normalizados y alineación por bbox visible.
- Portrait soportado; landscape recomendado en mobile.
- Layout R1 congelado.

```text
z0  environment
z1  rear depth plane
z2  haze
z3  contact shadow
z4  lower base
z5  front edge — preservado, no renderizado
z6  tabletop
z7  passive/active route
z8  halo
z9  pedestal
z10 object/FX
z11 Lía
z12 DOM/UI
```

Decisiones que no deben revertirse:

```text
front-edge-disabled-by-human-review
rear-plane-retained-after-layer-toggle
```

## Assets

- 20 assets aprobados en runtime.
- 20 mirrors byte-idénticos en `current-used`.
- Hash, dimensión, alfa, función y consumidor están documentados en
  [`public/assets/gvo/current-used/world-4-root/README.md`](public/assets/gvo/current-used/world-4-root/README.md).
- El inventario completo de cierre está en
  [`docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md`](docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md).
- `world4_node_top_object_master_v01.png` está rechazado; no integrarlo ni
  precachearlo.
- No mover, recomprimir, convertir o reexportar un miembro de un par por
  separado.

Lía reutiliza exclusivamente:

```text
lia_pose_explain_calm_v1.png
lia_pose_greeting_v1.png
```

## Motion

- Entrada completa `1400 ms`; revisita `240 ms`.
- Nodo `1180 ms`; travel de Lía `720 ms`.
- Cierre `1280 ms`; CTA a `1040 ms`.
- Salida `650 ms`.
- Reduced motion: `160 / 180 / 260 / 160 ms` para entrada, nodo, cierre y
  salida.
- La ruta activa es SVG/CSS sobre el PNG pasivo.
- Sólo hay un FX activo y una Lía visible.
- Resize, orientación, fullscreen y visibilidad no pueden duplicar progreso.

## Responsive, PWA y fullscreen

- `OrientationHint` es no bloqueante y descartable.
- Fullscreen sólo se solicita por activación explícita.
- El manifest usa `standalone` con override `fullscreen`.
- Los 20 assets W4 están en precache; `current-used` se excluye deliberadamente.
- PWA instalada/relanzada no fue certificada en la plataforma QA.
- Instalación PWA real sobre LAN requiere un origen seguro; una IP servida por
  HTTP no basta.

## Accesibilidad

- Contenido y estados en DOM, no horneados en imágenes.
- Botones nativos con target mínimo 44×44.
- `aria-current`, `aria-disabled`, status textual y marcas acompañan el color.
- Click, toque, Enter y Space comparten el mismo gate.
- Reduced motion conserva información, orden y navegación.
- QR/cámara y permisos sensibles siguen bloqueados.
- No hay audio runtime.

## Evidencia técnica disponible

Último cierre runtime (`018D`):

- focal W4: 42/42;
- suite completa: 242/242 en 20 archivos;
- TypeScript, ESLint, build/PWA y `audit:assets`: PASS;
- 233 entradas precache;
- Chromium producción: 15/15 viewports;
- consola: 0 errores y 0 warnings;
- imágenes rotas: 0; overflow: 0;
- fullscreen real y orientación durante movimiento: estables;
- idle `11`, tap hint `9`, actividad máxima `20`, long tasks `>50 ms`: 0;
- 20 runtime + 20 mirrors y áreas congeladas preservados.

Evidencia 018D externa:

```text
C:\Users\JOSE DAVID\Downloads\GVO_ST4_018D_MF06_INTERACTION_MOTION_QA_20260722_091624\
```

Validación final 018E sobre el árbol preparado para el commit:

- TypeScript y ESLint 0 warnings: PASS;
- focal W4: 42/42; suite completa: 242/242 en 20 archivos;
- build/PWA: PASS, 233 entradas, 0 referencias faltantes;
- manifest/precache: 20 runtime W4, 0 mirrors, 0 master rechazado;
- `audit:assets`: PASS; Portada/Intro 27 rutas y Transition Root 34 runtime;
- enlaces Markdown: 116/116, rotos 0;
- Browser integrado: 9/9 superficies, tres transiciones automáticas, consola
  0/0, imágenes rotas 0, overflow 0, externos 0 y audio/video 0;
- 20 runtime + 20 mirrors byte-idénticos y 14 grupos congelados preservados.

Evidencia 018E externa:

```text
C:\Users\JOSE DAVID\Downloads\GVO_ST4_018E_CLOSEOUT_20260722_122342\
```

El verificador histórico `assets:validate:loading` no pudo repetir la
procedencia contra el paquete fuente externo ausente `GVO_archivos_iniciales`.
Los runtime de carga no cambiaron y sí pasaron build, precache y tests; esta
limitación no afecta Estación IV.

## Congelados y exclusiones

No modificar durante el cierre:

- Mundo II;
- Estación III;
- transiciones pasivas y rutas de navegación;
- copy global;
- biblioteca compartida de Lía;
- artboard, anchors, geometry y layout R1;
- PWA/fullscreen/orientación;
- 20 runtime, 20 mirrors y manifest W4;
- paths, lógica, pantalla, tests, assets o documentación preexistentes de Mundo
  V.

No iniciar Estación V dentro de `018E`. El próximo trabajo de Estación V debe
comenzar con una auditoría read-only, no con código ni generación de assets.

## Limitaciones y deuda

- Certificación de PWA instalada en dispositivo/plataforma real: pendiente.
- Despliegue LAN instalable: requiere HTTPS/origen seguro.
- Safari/iOS real: no certificado.
- Warning de chunk mayor de 500 kB: conocido, no bloqueante.
- Revalidación de procedencia del loading contra su paquete fuente externo:
  no reproducible en esta máquina; runtime congelado y validado por los gates
  integrados.
- No hay deuda funcional conocida en el alcance humano aprobado de Estación IV.

La retrospectiva completa está en
[`docs/retrospectives/GVO_STATION_IV_RETROSPECTIVE.md`](docs/retrospectives/GVO_STATION_IV_RETROSPECTIVE.md).

## Protocolo Git final

Antes de declarar cierre:

1. ejecutar todas las validaciones sobre el contenido definitivo;
2. confirmar que no existe ruta ambigua ni cambio de Mundo V;
3. crear un único commit autorizado en `main`;
4. ejecutar `git push origin main` sin `--force`;
5. comprobar:

   ```text
   HEAD = origin/main local = main remoto
   divergencia = 0 0
   worktree = vacío
   staging = 0
   untracked = 0
   ```

6. registrar SHA, URL, stats, validaciones, ZIP y hash del ZIP en la evidencia
   externa.

Este handoff queda asociado al **commit que contiene este documento**. Sólo la
verificación post-push autoriza emitir el flag contractual final de `018E`.
