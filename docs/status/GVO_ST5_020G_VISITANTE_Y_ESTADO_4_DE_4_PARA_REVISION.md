# GVO ST5-020G — Visitante y estado 4/4 para revisión

Fecha: 2026-07-30

Rama de publicación: `main`

Baseline validada: `eac2d362cc2056c9fd5f459a1e88e2de2edb83d9`

Estado humano de entrada: `ST5_020F_HUMAN_APPROVED`

Estado publicado: `ST5_020G_PUBLISHED_PENDING_HUMAN_REVIEW`

## Alcance ejecutado

- Se integró `/estacion/5/visitante` con sus ambientes portrait/landscape y
  el foco alfa aprobado de la presencia dentro del aro.
- El progreso local conserva el prefijo canónico y ahora completa exactamente
  `['plantas','sistema','espacio','visitante']`.
- Visitante permanece bloqueada antes de Espacio, queda disponible en 3/4 y
  restaura `visitor_intro` o `visitor_resolved` según el progreso persistido.
- Tras la acción real, `data-station-complete` y `data-map-complete` pasan a
  `true`; las cuatro áreas quedan disponibles para revisita libre y el foco
  vuelve a Visitante al regresar al mapa.
- El estado 4/4 es interno a Estación V: no escribe el progreso global, no
  muestra `Ir al cierre`, no navega a `/transition/world-5-to-final` y no
  declara Mundo V cerrado.

## Assets Visitante

| ID | Runtime | Espejo `current-used/visitor` | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| SUB-VISITOR-BG-PORTRAIT | `world5_sub_visitor_environment_portrait_v01.webp` | sí | 166.804 | `0434D75215C7F93A0F5C1DC37AEFDFAAD9A0FB7DFA1FB1F7DC51D4FB627CE6E7` |
| SUB-VISITOR-BG-LANDSCAPE | `world5_sub_visitor_environment_landscape_v01.webp` | sí | 98.454 | `A7EC3EEB48E30003AA2E2D8817D2E7508621EBDC73648A4C632C69C6D017C3BE` |
| SUB-VISITOR-FOCUS | `world5_sub_visitor_focus_v01.webp` | sí | 132.980 | `8F0C0F3A424453081484D2B97961E4ED53375FEB931E9A5ECCE431C768B998D4` |

Los tres pares son byte-idénticos. El bundle Visitante pesa 398.238 bytes.
Después de la integración, el contrato de Estación V contiene 24 assets:
ocho de mapa, tres de Plantas, tres de Sistema, tres de Espacio, tres de
Visitante y cuatro poses aprobadas de Lía. Ningún raster fue recomprimido,
convertido o editado.

El foco mide 1536×1536, tiene alfa real y su bbox inclusiva medida es
`[288,330]..[1375,1402]`. Los márgenes transparentes son 288 px a la izquierda,
160 px a la derecha, 330 px arriba y 133 px abajo; todos superan el 8% exigido.

## Proyección y microinteracción

- Socket portrait: `[0.23,0.42,0.54,0.34]`; objetivo fuente `[720,1171]`.
  La escala uniforme base del foco es `0.538125` y el estado resuelto llega a
  `0.543506`, manteniendo el alfa dentro del socket.
- Socket landscape: `[0.15,0.22,0.40,0.66]`; objetivo preferido `[672,594]`.
  Se aplica una única corrección estable y documentada de `+125 px` en X, por
  lo que el objetivo operacional es `[797,594]`. La escala uniforme base es
  `0.421` y el estado resuelto llega a `0.42521`.
- La corrección landscape es común a toda la familia, no depende del viewport
  y evita clipping en `1024×768` sin superponer el rail.
- La deriva máxima medida respecto al objetivo operacional fue `0,0156 px`.
- La acción es un botón nativo que envuelve el raster real, con nombre
  `Reconocer la presencia del visitante dentro del recorrido.`
- Intro y resolved reutilizan el mismo foco. Resolved solo añade filtro sobrio
  y `scale(1.01)`; no hay líneas, checks, halos, partículas, SVG, canvas,
  audio ni visual procedural.
- `prefers-reduced-motion` mantiene ruta, acción, persistencia y comprensión.

## Copy y estado 4/4

En 3/4 el overview conserva `El recorrido ya tiene un lugar.` y cambia la
guía autorizada a `Toca Visitante para completar el mapa.`. En 4/4 muestra:

```text
Plantas, sistema, espacio y visitante ya forman el presente de OKÚA.
Puedes volver a mirar cualquiera de las cuatro áreas.
```

El copy de Visitante se mantiene en estado `candidate`; la evidencia técnica
no equivale a aprobación editorial o visual humana.

## Responsive y regresión protegida

Se verificaron los once viewports contractuales entre `360×560` y `1024×768`.
La matriz obtuvo:

- `121/121` capturas en PASS: 11 estados × 11 viewports;
- font mínimo `14 px` y target mínimo `44 px`;
- overflow máximo `0 px`;
- rail mínimo landscape corto `260 px`;
- altura alfa visible mínima de Lía en landscape corto `94,90 px`;
- clipping de foco `0` y alfa dentro del socket en intro/resolved;
- cero errores de consola, errores de página, requests fallidos o externos;
- dos secuencias de reflow para intro, resolved y overview 4/4 en PASS.

El ajuste de `667×320` elimina el fallback de scroll del overview y conserva
el rail lateral contractual. Las comparaciones 020F↔020G confirman que
Plantas, Sistema y Espacio no presentan drift visual; el overview 3/4 solo
incorpora el copy y la disponibilidad de Visitante autorizados por este ticket.

La evidencia reproducible vive en `docs/visual/world5/st5-020g/` e incluye 158
archivos: capturas, reflows, reduced motion, dos contact sheets, dos overlays
de socket/ancla, ocho comparaciones 020F↔020G y los JSON de métricas, assets,
navegadores y PWA.

## Validaciones

- Suite focal: 3 archivos y `37/37` tests en PASS.
- Suite global: 23 archivos y `268/268` tests en PASS.
- Playwright focal: `3/3` E2E en Chromium en PASS.
- ESLint: PASS.
- TypeScript + build Vite/PWA: PASS; se conserva el warning informativo de
  chunks mayores de 500 kB preexistente.
- Auditoría: `24/24` assets y `24/24` espejos byte-idénticos en PASS.
- PWA generada: `24/24` assets de Estación V precargados, shell precargado y
  navigation fallback presente.
- Chromium 148.0.7778.96: PASS, incluido `667×320` sin scroll.
- Firefox y WebKit: no ejecutados porque sus binarios Playwright no están
  instalados en este entorno; no se declaran validados.
- La instalación y el relanzamiento de una PWA instalada siguen siendo una
  comprobación manual de plataforma y no se declaran certificados.

## Límites preservados

- Sin dependencia nueva, CDN, fuente remota, API externa, audio o video.
- Sin cambio de identidad, escala editorial o quinta pose de Lía.
- Sin cambios visuales en Plantas, Sistema, Espacio, cavidad, rim, rótulos o
  posiciones del mapa fuera del estado autorizado de Visitante/4/4.
- Sin CTA `Ir al cierre`, transición W5→Final, pantalla Final, cierre de Mundo V
  ni afirmación de aprobación humana para 020G.

Estado técnico final: `ST5_020G_PUBLISHED_PENDING_HUMAN_REVIEW`.
