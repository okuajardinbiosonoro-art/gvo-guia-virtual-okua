# GVO_ST4_018C_MF05 — composición estática de Estación IV

> Registro histórico de la integración base. La corrección visual, responsive e
> inmersiva posterior está documentada en
> `GVO_ST4_018C_R1_IMMERSIVE_LAYOUT_CORRECTION.md`.

## Estado

`IMPLEMENTADO / VALIDACIÓN TÉCNICA CERRADA / REVISIÓN HUMANA PENDIENTE`

Baseline de entrada: `main` en
`b94c3287834c718e7ef970af9ec62da4789770f3`, igual a `origin/main`, con
divergencia `0/0` y worktree limpio.

## Auditoría previa cerrada

| Área                                                                 | Decisión 018C                                        |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Máquina `entering → reading → moving → chain → exit_ready → exiting` | Conservar sin cambiar semántica                      |
| Progreso 1→8, locking, hint, revisión libre y timers                 | Conservar                                            |
| Copy, labels, estado accesible y botones nativos                     | Conservar en DOM                                     |
| CTA y `worldFourToWorldFiveTransitionRoute`                          | Conservar condición y ruta exactas                   |
| Poses Lía `explain_calm` / `greeting`                                | Reutilizar sin modificar; Lía queda estática en 018C |
| Arte procedural de mesa, ruta, pedestales, objetos y halos           | Sustituir por los 20 assets aprobados                |
| Anclas antiguas basadas en profundidad                               | Sustituir por los ocho anchors 1536×1024 aprobados   |
| Mundo II, Estación III, transición W2→W3 y Mundo V                   | No tocar                                             |

Manifest externo previo de archivos, bytes y SHA-256:
`before_file_manifest.csv` dentro de la carpeta QA de este ticket.

Hashes de guarda calculados antes de editar, sobre manifests ordenados de paths
tracked:

| Alcance congelado                              | Archivos |      Bytes | SHA-256                                                            |
| ---------------------------------------------- | -------: | ---------: | ------------------------------------------------------------------ |
| Mundo II                                       |      115 | 87,042,092 | `f809991a38e36d6720ae967b6f0c169092aeb0abf1990bef8fc607be3dd1ff10` |
| Estación III                                   |       54 | 14,990,259 | `aff7bb5d48a84490bdb1a7821932307513b4d6f3de46b221415721342df6ba1f` |
| Transición W2→W3 y soporte compartido auditado |       89 | 10,916,130 | `80486f9b5369274eb0a4f90d114584f7c7c98d64ae0af2a7238aa232cba18799` |
| Paths preexistentes de Mundo V                 |       12 |     90,082 | `aef085609b820bc32bd37ccf837930192eca387f38a59a6303490fd79e5bbf9e` |

## Intake canónico

Fuente exclusiva:
`GVO_ST4_APPROVED_RUNTIME_ASSETS_V1.zip` (SHA-256
`25263DCC74F3D8E84220431F7015588669E2D12CD18223535AD0B9032316E7A1`).

- 20/20 assets runtime validados contra CSV y JSON.
- SHA-256, filename, dimensiones, modo, alfa, opacidad y `alpha_bbox`
  coincidentes.
- Manifests CSV y JSON equivalentes tras normalizar tipos.
- Extracción sin paths absolutos ni traversal.
- Copia realizada sólo desde `runtime/` mediante allowlist explícita.
- Variantes homónimas sueltas en Descargas y
  `world4_node_top_object_master_v01.png` fueron excluidos.

Los 20 binarios quedaron integrados en
`public/assets/gvo/stations/world-4/system-table/runtime/` y espejados byte a
byte en `public/assets/gvo/current-used/world-4-root/`. Cada árbol contiene 20
archivos y 9,240,496 bytes; la verificación de SHA-256 cerró 20/20 sin
desviaciones entre fuente, runtime y espejo.

## Arquitectura implementada

- `world4RuntimeAssets.ts`: 20 URLs runtime y dos poses compartidas de Lía.
- `world4AssetManifest.ts`: hashes, `alpha_bbox`, tamaños baseline, halo y
  contratos 9-slice.
- `world4Geometry.ts`: artboard 1536×1024, anchors normalizados, target mínimo
  y z-order.
- `World4Stage.tsx`: una sola cámara y capas z0–z11.
- `World4NodeStack.tsx`: halo, pedestal, objeto alpha-aware y botón nativo.
- `World4RootScreen.tsx`: conserva estado, copy, status y CTA DOM en z12.
- `World4RootScreen.css`: composición estática, responsive y sin pulsos,
  floats ni coreografía de Lía.

Todas las capas de mesa ocupan el mismo artboard, comparten `inset`, tamaño,
transform y `transform-origin`; no existen correcciones independientes por
breakpoint.

## Contratos visuales

- Artboard: `1536×1024`, `aspect-ratio: 3/2`, escala uniforme.
- Anchors: `(170,500)`, `(340,470)`, `(510,445)`, `(680,430)`,
  `(856,430)`, `(1026,445)`, `(1196,470)`, `(1366,500)`.
- Halo: sprite real 3×1, celdas 0 disponible, 1 activo, 2 completado;
  bloqueado no renderiza halo.
- Pedestal: canvas lógico 136 px; un asset reutilizado ocho veces.
- Objetos: 112, 96, 98, 88, 84, 84, 92 y 102 px de ancho lógico.
- Anclaje de objeto: centro visible y baseline visible derivados de
  `alpha_bbox`; no se recortó ni reexportó ningún PNG.
- Tarjeta: `border-image-slice: 128 192 fill`, copy íntegro en DOM.
- CTA: `border-image-slice: 144 192 fill`, label/estados/foco/navegación en
  DOM/CSS.
- Target: botón nativo mínimo 44×44 px; en compacto alterna filas invisibles
  para evitar solapamiento sin mover el arte.

## Alcance no modificado

- Mundo II.
- Estación III.
- Transición W2→W3.
- Rutas, pantalla y assets preexistentes de Mundo V.
- Assets compartidos de Lía.
- Configuración global.

## Deuda diferida por contrato

No forman parte de 018C: pulso activo animado, trayectoria de Lía, coreografías,
transición de cierre, SVG/CSS de flujo activo, hand hint, partículas, nuevos
assets o refactor completo de la máquina de estado.

## Validación

| Control                        | Resultado                                                   |
| ------------------------------ | ----------------------------------------------------------- |
| Suite focal Estación IV        | PASS — 1 archivo, 22/22 tests                               |
| Lint completo                  | PASS — `eslint .`                                           |
| Suite completa                 | PASS — 18 archivos, 206/206 tests                           |
| Build/PWA                      | PASS — 574 módulos; 373 entradas precache; `sw.js` generado |
| Auditoría de assets            | PASS — sin URLs externas, CDN ni audio                      |
| `git diff --check`             | PASS — sin errores; avisos LF→CRLF no bloqueantes           |
| Hashes runtime/espejo          | PASS — 20/20; 9,240,496 bytes por árbol                     |
| Áreas congeladas               | PASS — 4/4 hashes finales iguales al baseline               |
| QA real 10 viewports           | PASS — overflow/scroll/overlaps/clipping/broken = 0         |
| Anchors / alpha-aware          | PASS — delta máximo 0.0078125 / 0.0078278 px                |
| Consola / teclado / navegación | PASS — 0 errores, 0 warnings; Enter/Space/CTA verificados   |

Carpeta de evidencia externa:
`C:\Users\JOSE DAVID\Downloads\GVO_ST4_018C_MF05_STATIC_COMPOSITION_QA_20260717_160715`.

## Git después

- Rama `main`; `HEAD`, `origin/main` y remoto permanecen en
  `b94c3287834c718e7ef970af9ec62da4789770f3`.
- Divergencia final `0/0`; staging vacío.
- 55 archivos de trabajo dentro del alcance autorizado: 9 tracked y 46
  untracked; 0 rutas fuera de alcance.
- No se ejecutaron commit, push, fetch, pull, merge, rebase, reset ni checkout.
- Los hashes finales de Mundo II, Estación III, transición W2→W3 y paths
  preexistentes de Mundo V coinciden exactamente con los cuatro hashes de
  guarda registrados al inicio.

## Incidencias resueltas y limitaciones

- La CTA declara `disabled` nativo y estilo propio durante `exiting`; su
  aparición, label y ruta no cambiaron.
- La prueba de integridad lee en paralelo los 20 pares binarios para conservar
  la cobertura SHA-256 completa dentro del timeout de la suite global.
- Vite conserva el warning preexistente de chunks superiores a 500 kB; no hay
  error de compilación ni afecta este microfrente.
- La aprobación estética final no puede automatizarse y permanece pendiente de
  revisión humana, tal como exige el ticket.

## Resultado técnico

`GVO_ST4_018C_MF05_STATIC_COMPOSITION_READY_FOR_HUMAN_REVIEW`

La aprobación visual final permanece en manos de revisión humana.
