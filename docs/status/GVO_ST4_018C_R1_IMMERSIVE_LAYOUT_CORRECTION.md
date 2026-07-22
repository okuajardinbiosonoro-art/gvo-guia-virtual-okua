# GVO_ST4_018C_R1 — corrección inmersiva de Estación IV

## Estado

`IMPLEMENTADO / BROWSER Y FULLSCREEN API VALIDADOS / PWA INSTALADA NO DISPONIBLE EN LA PLATAFORMA DE QA`

Resultado contractual:

`GVO_ST4_018C_R1_PARTIAL_PLATFORM_LIMITATION`

La composición está lista para revisión humana en navegador y Fullscreen API.
No se emite el flag de éxito total porque la sesión de QA integrada no ofrece
instalación y relanzamiento como PWA del sistema; ese modo no fue simulado.

Baseline de entrada: rama `main`, `HEAD`, `origin/main` y remoto en
`b94c3287834c718e7ef970af9ec62da4789770f3`, divergencia `0/0`. El worktree
contenía únicamente la aplicación pendiente del ticket 018C. R1 no ejecutó
`commit`, `push`, `fetch`, `pull`, `merge`, `rebase`, `reset`, `checkout` ni
`stash`.

## Corrección aplicada

- El layout separa explícitamente título, ayuda de orientación, panel, mesa,
  footer y espacio final. El gap controles→mesa es
  `clamp(10px, 2dvh, 24px)`; en móvil horizontal es
  `clamp(8px, 2dvh, 16px)`.
- El tamaño efectivo usa `visualViewport`, con fallbacks `vh → svh → dvh`,
  `viewport-fit=cover` y safe areas locales.
- En portrait se mantiene un artboard único 3:2, anchors y escala uniforme. En
  mobile landscape el panel y la mesa comparten fila sin solaparse.
- Se añadió la ayuda no bloqueante
  `Gira el dispositivo para ver mejor la mesa.`, visible sólo en compact
  portrait, descartable por sesión, reactiva al giro y sin asset nuevo.
- Se añadió un control nativo accesible para solicitar/salir de Fullscreen API
  sólo desde activación explícita. Escucha `fullscreenchange` y
  `fullscreenerror`; no solicita fullscreen automáticamente.
- El modo concedido se detecta como `fullscreen`, `standalone`, `minimal-ui` o
  `browser` y queda expuesto en `data-display-mode`.
- No se incorporó `screen.orientation.lock()`: su omisión reduce riesgo y no es
  necesaria para la corrección responsive.

La máquina `entering → reading → moving → chain → exit_ready → exiting`, el
orden 1→8, locking, timers, copy, CTA y
`worldFourToWorldFiveTransitionRoute` no cambian.

## Diagnóstico de capas

Los toggles reales z1/z4/z5/z6 cerraron la atribución sin inferencia:

| Toggle             | Evidencia                                                                  | Decisión                        |
| ------------------ | -------------------------------------------------------------------------- | ------------------------------- |
| baseline vs z1 OFF | Capturas byte-idénticas; contribución visible de z1 = 0 px en ese encuadre | Conservar z1; no es el causante |
| z4 OFF             | Desaparece la base inferior; las puntas permanecen                         | Conservar z4                    |
| z5 OFF             | Desaparecen exactamente las dos protuberancias laterales                   | Excluir z5 sólo del render      |
| z6 OFF             | Quedan expuestas capas inferiores                                          | Conservar z6                    |

`world4_table_front_edge_v01.png` permanece byte-idéntico en runtime,
`current-used`, precache y manifest. El escenario expone
`front-edge-disabled-by-human-review`; z1 expone
`rear-plane-retained-after-layer-toggle`.

## Escala, gap y tono

La matriz real cubrió los 15 viewports del ticket.

- Portrait/tablet apilado: gap efectivo `11.17–20.47 px`, siempre dentro de la
  banda contractual; no hay huecos de 94–374 px.
- Mobile landscape: gap horizontal `8.00–8.59 px`.
- Stage portrait: incremento uniforme aproximado de `1–3 %`, sin alterar
  anchors.
- Stage mobile landscape: ancho final `367–501 px` frente a `48–153 px` del
  baseline.
- Todos los casos: `overflowX=false`, `overflowY=false`, clipping de stage
  `false`, solapamiento panel/mesa `false` e imágenes rotas `0`.

El ajuste tonal se limita a variables locales: haze `0.25` (`0.20` en compact),
mesa `1.07`, objetos `1.08` y halo activo `1.12`. No se añadió neón, pulso,
animación o tratamiento global.

## Manifest, PWA y soporte real

El manifest generado conserva `display: "standalone"` y añade
`display_override: ["fullscreen", "standalone"]`, `lang: "es"`, theme color y
precache de WEBP/WOFF2. El espejo `assets/gvo/current-used/` queda excluido del
precache; los 20 assets aprobados de Estación IV sí están presentes.

El estándar de Web App Manifest define la cadena de fallback de display modes y
exige que `display-mode` refleje el modo aplicado:
<https://www.w3.org/TR/appmanifest/#display-modes>. Fullscreen API exige
activación transitoria y permite salida explícita:
<https://fullscreen.spec.whatwg.org/>. Service Workers requieren contexto
seguro, con excepciones de desarrollo para localhost:
<https://www.w3.org/TR/secure-contexts/#service-workers>. WebKit documenta que
un sitio añadido a Home Screen con `standalone` o `fullscreen` abre como web
app: <https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/>.

Resultados de plataforma:

| Modo                         | Resultado                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser integrado            | PASS — 15 viewports, 0 errores/warnings, 0 imágenes rotas                                                                                       |
| Fullscreen API               | PASS — clic explícito cambió a `active`, label `Salir de pantalla completa`, `data-display-mode=fullscreen`; salida volvió a `inactive/browser` |
| PWA instalada/relanzada      | NO DISPONIBLE — la plataforma integrada no ofrece instalación del artefacto; no se simuló                                                       |
| Captura raster en fullscreen | LIMITACIÓN DE EVIDENCIA — la captura 390×650 amplió el backing surface y a tamaño nativo agotó timeout; la geometría DOM real siguió correcta   |

El origen documentado del despliegue sigue siendo LAN. Un host móvil servido
por HTTP mediante IP LAN no permite afirmar Service Worker/PWA instalada; se
requiere un origen seguro real o la excepción localhost en el dispositivo.

## Validación

| Control             | Resultado                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------- |
| Suite focal R1      | PASS — 3 archivos, 39/39 tests                                                            |
| Lint completo       | PASS — `eslint .`                                                                         |
| Suite completa      | PASS — 20 archivos, 223/223 tests                                                         |
| Build/PWA           | PASS — 580 módulos, 233 entradas, `sw.js` generado                                        |
| Auditoría de assets | PASS — sin URLs externas, CDN ni audio                                                    |
| Assets Estación IV  | PASS — 20/20 hashes preservados; runtime y espejo byte-idénticos                          |
| Smoke global        | PASS — Portada, W1, W2, W2→W3, W3, W3→W4, W4, W4→W5 y W5; 0 imágenes rotas y 0 overflow X |
| Consola browser     | PASS — 0 errores, 0 warnings                                                              |
| Orientación         | PASS — visible en portrait, oculta al girar y no reaparece tras descarte en la sesión     |
| Fullscreen          | PASS — entrada/salida mediante el mismo control accesible                                 |

Mundo II, Estación III, transición W2→W3, Mundo V y los 20 binarios aprobados
permanecen congelados. La evidencia externa vive en:

`C:\Users\JOSE DAVID\Downloads\GVO_ST4_018C_R1_IMMERSIVE_LAYOUT_QA_20260717_180444`

## Cierre

La implementación técnica y la evidencia browser/fullscreen están listas para
revisión humana. El único criterio no ejecutable en esta plataforma es instalar
y relanzar la PWA real; por eso el resultado permanece exactamente:

`GVO_ST4_018C_R1_PARTIAL_PLATFORM_LIMITATION`
