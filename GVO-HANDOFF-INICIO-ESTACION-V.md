# GVO — Handoff de inicio de Estación V

Fecha de preparación: 2026-07-22

Proyecto: **GVO — Guía Virtual OKÚA**

Propósito: entregar a una conversación nueva el contexto técnico, visual, documental y operativo necesario para preparar Estación V sin reabrir Estación IV ni fabricar un estado inexistente.

## 1. Identidad del proyecto y Git

### Repositorio

- Repositorio local oficial: `E:\OKUA\04_DESARROLLO_REPOS\gvo-guia-virtual-okua`.
- Repositorio remoto: `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git`.
- Rama de publicación: `main`.
- Flujo del proyecto: mantenedor único, commit y push directo únicamente cuando un ticket de cierre lo autoriza; no se usan Pull Requests.

### Commit de cierre

El SHA de un commit no puede escribirse dentro del mismo árbol que determina ese SHA. Para conservar el requisito de un único commit sin inventar un identificador:

- commit completo: **el commit que contiene este documento**; resolver con `git rev-parse HEAD`;
- commit corto: resolver con `git rev-parse --short HEAD`;
- URL del commit: `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua/commit/<SHA_RESUELTO>`.

El reporte externo de cierre `GVO_ST4_018E_CLOSEOUT_REPORT.md` y `commit_and_push.md`, creados después del push, registran el SHA completo, el corto y la URL literales.

### Estado local y remoto exigido para consumir este handoff

Este handoff sólo está listo cuando el cierre 018E demuestra simultáneamente:

```text
branch = main
HEAD = origin/main local = refs/heads/main remoto
divergence = 0 0
worktree = limpio
staged = 0
modified = 0
deleted = 0
untracked = 0
```

Verificar en la copia recibida:

```bash
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git ls-remote origin refs/heads/main
git rev-list --left-right --count HEAD...origin/main
git status --short --untracked-files=all
```

Si cualquiera de esos valores difiere, no asumir que el cierre fue publicado correctamente: consultar la evidencia externa 018E.

## 2. Stack y reglas no negociables

Stack versionado en `package.json`:

- React `19.2.6` y React DOM `19.2.6`;
- React Router DOM `7.15.0`;
- TypeScript `~6.0.2`;
- Vite `8.0.12`;
- Motion `12.38.0`;
- `vite-plugin-pwa` `1.3.0`;
- Vitest `4.1.6` y Testing Library;
- Playwright `1.60.0`;
- `@zxing/browser` `0.1.5`;
- ESLint y Prettier.

Reglas que no se negocian:

- funcionamiento local-first y sin Internet;
- sin CDN, APIs, fuentes, scripts ni imágenes remotas;
- sin audio;
- mobile-first;
- Lía es la única guía y conserva exactamente cinco pétalos;
- flujo secuencial entre estaciones;
- texto, controles, labels, estados, focus y accesibilidad permanecen en DOM/CSS;
- no añadir Three.js ni dependencias pesadas sin autorización explícita;
- no crear o animar placeholders como si fueran resultado final;
- no iniciar Mundo VI.

## 3. Convenciones de assets, documentación y QA

### Assets

- Asset runtime canónico: `public/assets/gvo/stations/<world>/<screen>/runtime/`.
- Registro o espejo auditable: `public/assets/gvo/current-used/<screen>/`.
- Política: `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`.
- Inventario global: `docs/assets/ASSET_INVENTORY.md`.
- Todo asset usado debe registrar filename, dimensiones, SHA-256, función, consumidor y ruta runtime/espejo.
- El Atlas bajo `docs/narrative/atlas_visual_assets_gvo_v1/` es referencia; no sustituye un asset runtime ni su registro `current-used`.
- Capturas, videos, traces, ZIP, logs y paquetes de QA permanecen fuera del repositorio, salvo evidencia canónica expresamente autorizada.

### Documentación

- Estado vivo: `docs/status/CURRENT_STATE.md`.
- Índice: `docs/README.md` y `docs/status/README.md`.
- Roadmap: `docs/ROADMAP.md`.
- Cierre de Estación IV: `docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md`.
- Retrospectiva: `docs/retrospectives/GVO_STATION_IV_RETROSPECTIVE.md`.
- Los documentos 018C, 018C-R1 y 018D conservan sus resultados históricos; no se reescriben para simular que siempre tuvieron el estado final de 018E.

### QA

- La evidencia bruta se crea bajo `C:\Users\JOSE DAVID\Downloads\GVO_<TICKET>_<timestamp>\`.
- Debe incluir comandos, manifiestos before/after, hashes, pruebas, build, consola, responsive, navegación, limitaciones y estado Git.
- Una prueba automática no equivale a aprobación estética.
- No se fabrica evidencia de Browser, dispositivo físico, PWA instalada o permisos que la plataforma no haya expuesto realmente.

## 4. Estado global verificable

| Tramo | Ruta principal | Estado que puede declararse |
| --- | --- | --- |
| Carga inicial | `/` y `/carga` | `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`; no cerrada final. |
| Portada / Intro | `/portada` | `APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL`. |
| Entrada a Mundo I | `/transition/intro-to-station-1` | Transición funcional integrada con deuda visual documentada. |
| Mundo I | `/estacion/1` | Runtime activo e interacción refinada; conserva deuda visual. |
| Mundo II | `/estacion/2` | Finalizado para el alcance actual. |
| Mundo II → Mundo III | `/transition/world-2-to-world-3` | Definitiva, pasiva y automática; sin CTA. |
| Mundo III | `/estacion/3` | `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`. |
| Mundo III → Mundo IV | `/transition/world-3-to-world-4` | Ruta existente; el copy global continúa marcado `TEMP`. No declararla transición editorial definitiva. |
| Mundo IV | `/estacion/4` | Estación IV cerrada por 018E con aprobación humana vinculante, sujeta a que el estado Git de cierre anterior se cumpla. |
| Mundo IV → Mundo V | `/transition/world-4-to-world-5` | Ruta existente; el copy global continúa marcado `TEMP`. |
| Mundo V | `/estacion/5` | Base Fable funcional preexistente, implementada, probada y documentada; visuales de áreas todavía procedurales y reemplazables; pendiente de revisión visual; **NO CERRADA / NO HUMAN_APPROVED**. |
| Mundo V → Final | `/transition/world-5-to-final` | Ruta existente; copy `TEMP`. |
| Mirador final | `/final` | Experiencia temporal preexistente; no cerrada ni aprobada final. |

La frase “Estación V no iniciada” sólo puede aplicarse al nuevo ciclo definitivo `ST5-019*`: 018E no lo inicia. No significa que el repositorio sea una hoja en blanco; la base Fable anterior existe y debe auditarse antes de decidir qué conservar, corregir o sustituir.

## 5. Estación IV cerrada: contrato técnico heredado

### Cadena narrativa

```text
Planta
→ Bionosificador
→ ESP32
→ MIDI
→ Wi-Fi/UDP
→ Router
→ Sistema central
→ Sonido
```

El sonido es el resultado mediado de toda la cadena; la planta no produce música de forma directa.

### Componentes y paths principales

```text
src/screens/World4Root/World4RootScreen.tsx
src/screens/World4Root/World4RootScreen.css
src/screens/World4Root/World4RootScreen.test.tsx
src/screens/World4Root/World4Stage.tsx
src/screens/World4Root/World4NodeStack.tsx
src/screens/World4Root/World4NodeFx.tsx
src/screens/World4Root/World4RoutePulse.tsx
src/screens/World4Root/World4LiaGuide.tsx
src/screens/World4Root/World4AmbientLayer.tsx
src/screens/World4Root/World4TapHint.tsx
src/screens/World4Root/useWorld4MotionController.ts
src/screens/World4Root/world4MotionTokens.ts
src/screens/World4Root/world4NodeFxConfig.ts
src/screens/World4Root/world4Geometry.ts
src/screens/World4Root/world4RuntimeAssets.ts
src/screens/World4Root/world4AssetManifest.ts
src/screens/World4Root/station4Content.ts
src/components/OrientationHint/
src/shared/immersive/
```

### Composición, cámara y anchors

- Artboard único: `1536×1024`.
- Composición: texto arriba, mesa abajo.
- Escala uniforme desde el artboard; no usar offsets independientes por viewport.
- Alineación alpha-aware: aceptar el bbox visual real cuando el asset respeta la integración, aunque el canvas transparente sea mayor.
- Layout R1 congelado.
- Portrait soportado; landscape recomendado en mobile.
- OrientationHint informativo y no bloqueante.

Anchors aprobados en píxeles del artboard; implementarlos como porcentajes normalizados:

| Nodo | X | Y | X normalizado | Y normalizado |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 170 | 500 | 0.110677 | 0.488281 |
| 2 | 340 | 470 | 0.221354 | 0.458984 |
| 3 | 510 | 445 | 0.332031 | 0.434570 |
| 4 | 680 | 430 | 0.442708 | 0.419922 |
| 5 | 856 | 430 | 0.557292 | 0.419922 |
| 6 | 1026 | 445 | 0.667969 | 0.434570 |
| 7 | 1196 | 470 | 0.778646 | 0.458984 |
| 8 | 1366 | 500 | 0.889323 | 0.488281 |

### Capas

```text
z0  environment
z1  rear depth plane
z2  haze
z3  contact shadow
z4  lower base
z5  front edge — asset preservado, excluido del render por revisión humana
z6  tabletop
z7  passive route
z8  halo
z9  pedestal
z10 object
z11 Lía
z12 DOM/UI
```

Decisiones congeladas:

- `front-edge-disabled-by-human-review`;
- z1 retenido;
- z5 se conserva en runtime y espejo, pero no se renderiza;
- pulse activo en SVG/CSS sobre la ruta aprobada;
- la UI continúa semántica en DOM;
- los estados no dependen sólo del color.

### Assets y manifests

Estación IV conserva 20 assets canónicos bajo:

```text
public/assets/gvo/stations/world-4/system-table/runtime/
```

y 20 espejos byte-idénticos bajo:

```text
public/assets/gvo/current-used/world-4-root/
```

Distribución:

- entorno: 3;
- mesa: 4;
- ruta: 1;
- sistema de nodos: 2;
- objetos semánticos: 8;
- UI: 2.

`world4AssetManifest.ts`, `world4RuntimeAssets.ts`, `docs/assets/ASSET_INVENTORY.md` y `public/assets/gvo/current-used/world-4-root/README.md` documentan filename, dimensiones, alpha bbox, SHA-256, función, consumidor, runtime path y mirror path.

El archivo rechazado `world4_node_top_object_master_v01.png` no forma parte del runtime aprobado, el precache ni `current-used`.

Lía reutiliza, sin duplicar binarios:

```text
/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png
/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png
```

### Interacción, motion y accesibilidad

Máquina visual 018D:

```text
station_enter
→ idle
→ node_departing
→ lia_travel
→ route_transfer
→ node_arrival
→ node_active
→ node_settle
→ chain_complete
→ exit_reveal
→ exiting
```

- Primera pasada secuencial 1→8; después, revisita libre.
- Pointer, toque, Enter y Space conservan el mismo gate.
- Un único nodo activo y un único traveler.
- Ruta SVG segmentada, FX semánticos distintos para ocho nodos, barrido final y ambiente técnico acotado.
- Lía acompaña cada nodo y usa `greeting` / `explain_calm`.
- Ayuda tap una vez por sesión donde el gesto no es obvio.
- CTA sólo se habilita tras completar y estabilizar la cadena.
- Controles nativos, labels accesibles, `aria-disabled`, foco visible y estado textual.
- Sin audio.
- Reduced motion conserva secuencia, explicación, CTA y revisita; elimina loops y traslados no esenciales.

### Fullscreen, orientación y PWA

- Fullscreen API sólo se activa mediante gesto explícito.
- El mismo control accesible permite entrar y salir.
- OrientationHint aparece en portrait, no bloquea y respeta descarte de sesión.
- En R1 se validaron el Browser integrado y la Fullscreen API. En 018D se
  validó la experiencia en Chromium real; aquella sesión no dispuso del canal
  JavaScript del Browser integrado, limitación histórica que no se reescribe.
- El build PWA y el precache fueron generados.
- **PWA instalada/relanzada no fue certificada** en la plataforma de QA.
- Servir por una IP LAN en HTTP no basta para afirmar instalación real o Service Worker activo. La certificación PWA en despliegue LAN requiere un origen seguro, normalmente HTTPS, y prueba en la plataforma objetivo.

### Validación y evidencia aprobada

Evidencia técnica 018D:

- focal Estación IV: 42/42;
- suite completa: 20/20 archivos, 242/242 tests;
- TypeScript: PASS;
- ESLint con 0 warnings: PASS;
- build Vite/PWA: PASS, 233 entradas precacheadas;
- auditoría de assets: PASS, sin URL externa, CDN ni audio;
- 15/15 viewports reales en Chromium;
- consola: 0 errores y 0 warnings;
- imágenes rotas: 0;
- overflow horizontal: 0;
- idle DOM writes medidos dentro del presupuesto y sin long tasks observadas;
- 20 runtime y 20 mirrors byte-idénticos;
- áreas congeladas preservadas.

Evidencia 018D:

```text
C:\Users\JOSE DAVID\Downloads\GVO_ST4_018D_MF06_INTERACTION_MOTION_QA_20260722_091624\
```

Validación final 018E del árbol preparado para publicación:

- TypeScript PASS y ESLint 0 warnings;
- focal W4 42/42 y suite completa 242/242 en 20 archivos;
- build/PWA PASS con 233 entradas y 0 referencias faltantes;
- 20 assets runtime W4 en precache, 0 mirrors y 0 master rechazado;
- enlaces Markdown 116/116, rotos 0;
- Browser integrado 9/9 superficies, las tres transiciones automáticas,
  consola 0/0, imágenes rotas 0, overflow 0, externos 0 y audio/video 0;
- 20 runtime y 20 mirrors byte-idénticos; 14 grupos congelados sin cambios.

Evidencia 018E:

```text
C:\Users\JOSE DAVID\Downloads\GVO_ST4_018E_CLOSEOUT_20260722_122342\
```

La comprobación histórica de procedencia de loading contra el paquete externo
`GVO_archivos_iniciales` no fue reproducible porque ese paquete no está en la
ruta esperada de esta máquina. El runtime congelado sí quedó cubierto por
build, precache y tests; no es una regresión de Estación IV.

La aprobación humana vinculante de 018E cierra la revisión estética pendiente. No modifica retrospectivamente los flags históricos parciales de 018C-R1 o 018D; documenta que sus limitaciones de plataforma históricas ya no bloquean el cierre humano de Estación IV. En 018E el canal Browser integrado sí estuvo disponible y produjo el smoke global descrito arriba.

## 6. Estado real y congelado de Estación V

### Qué existe

La base oficial ya contiene una implementación Fable de “Mapa del presente” introducida antes del cierre de Estación IV:

```text
src/screens/World5Root/index.ts
src/screens/World5Root/station5AreaArt.tsx
src/screens/World5Root/station5Content.ts
src/screens/World5Root/World5RootScreen.css
src/screens/World5Root/World5RootScreen.test.tsx
src/screens/World5Root/World5RootScreen.tsx
src/content/world5EditorialSlots.ts
public/assets/gvo/current-used/world-5-root/README.md
docs/status/FABLE5_S5_01_STATION5_PRESENT_MAP.md
docs/ai/station5/
docs/visual/world5/fable5-s5-01/
tools/capture-station5-fable5-s5-01.mjs
tools/debug-station5-click.mjs
```

La ruta `/estacion/5` ya está registrada. La primera pasada implementada es:

```text
Plantas → Sistema → Espacio → Visitante → Ir al cierre
```

Tras completarla, permite revisita libre. La pantalla tiene cuatro zonas, nexo central, Lía, CTA, capa táctil plana accesible y reduced motion.

### Qué sigue siendo provisional

- Los objetos de Plantas, Sistema, Espacio y Visitante son SVG/CSS procedurales con slots reemplazables.
- El registro `current-used/world-5-root` sólo referencia las dos poses compartidas de Lía; no existe todavía un paquete de assets finales de las cuatro áreas.
- La validación histórica fue técnica: 14/14 pruebas focales, suite 155/155 de aquel corte, lint, build y recorrido Chromium con 11 capturas.
- No hubo dispositivo físico iOS/Android ni aprobación visual humana final.
- La transición W4→W5 y la transición W5→Final conservan copy global `TEMP`.

Por tanto, el estado correcto es:

```text
BASE FUNCIONAL PREEXISTENTE
IMPLEMENTADA Y PROBADA EN SU CORTE HISTÓRICO
VISUAL PROVISIONAL
NO CERRADA
NO HUMAN_APPROVED
NO MODIFICADA POR 018E
```

Baseline congelado 018E para el grupo ampliado de Mundo V:

```text
archivos: 26
bytes: 8383955
SHA-256 agregado 018E: 91BC82A0CC063DBB7A0175042315A6064F14036268EE522B173E90E39BF43AF4
```

El fingerprint 018E se calcula, para las 26 rutas ordenadas, concatenando por
archivo `path + NUL + sha256 + NUL + bytes`, y aplicando SHA-256 al resultado.
No sustituye la comparación archivo por archivo. Debe verificarse nuevamente
antes de cualquier intervención.

## 7. Metodología y responsabilidades

### ChatGPT

- planifica;
- analiza outputs y evidencia;
- crea tickets Markdown descargables;
- define assets y prompts en inglés;
- exige filename, canvas, formato, fondo, referencias y criterios;
- separa criterios visuales, técnicos y narrativos;
- clasifica resultados y decide qué requiere nueva iteración;
- no confunde tests automáticos con aprobación humana;
- no inventa resultados de herramientas ni estados Git.

### Codex

- audita el estado real antes de implementar;
- trabaja por microfrentes;
- integra únicamente el alcance autorizado;
- valida código, assets, responsive, interacción, accesibilidad y build;
- genera QA externa con hashes y trazas;
- preserva áreas congeladas;
- reporta limitaciones reales;
- no fabrica evidencia;
- no hace commit/push durante iteraciones normales;
- hace commit/push sólo en un cierre expresamente autorizado;
- no crea ni sugiere Pull Requests para GVO.

### Usuario

- genera assets;
- corrige en Photopea;
- prueba la experiencia;
- aprueba o rechaza resultados visuales;
- decide si una deuda es aceptable;
- autoriza el cierre Git final.

## 8. Flujo obligatorio de assets

```text
inventario
→ blueprint
→ lookdev/camera
→ asset uno por uno
→ QA
→ aprobación
→ integración
```

No comenzar con producción masiva. Cada asset debe tener:

1. ID estable;
2. filename exacto;
3. función narrativa y visual;
4. canvas;
5. formato;
6. fondo o transparencia;
7. referencias permitidas;
8. prompt positivo en inglés;
9. prompt negativo;
10. criterios verificables;
11. instrucciones de corrección en Photopea;
12. plantilla de retorno.

Plantilla de retorno:

```text
ASSET_ID LISTO
Archivo:
Canvas:
Fondo:
Correcciones en Photopea:
```

Antes de integrar, comprobar dimensiones reales, alpha bbox, SHA-256, recorte, escala, orientación y compatibilidad con la cámara. Después de integrar, registrar runtime y `current-used`.

## 9. Criterio asset vs código

Usar asset para:

- identidad;
- material;
- volumen;
- silueta;
- iluminación;
- fondo;
- objeto;
- backplate.

Usar SVG, CSS o Python para:

- geometría exacta;
- rutas;
- sombras técnicas deterministas;
- máscaras;
- estados;
- focus;
- hit targets;
- labels;
- pulses;
- overlays;
- mediciones;
- animaciones.

No usar generación visual para resolver líneas, rutas, máscaras, sombras técnicas o geometrías que deben ser exactas y reproducibles.

## 10. Gates de una estación

```text
Audit
→ Preproduction
→ Asset production
→ Static composition
→ Immersive layout
→ Motion/interaction
→ Human approval
→ Documentation
→ Commit/push
```

Cada gate debe cerrarse antes de avanzar. Un PASS técnico no reemplaza Human approval. Commit/push es un gate final, no una actividad por microfrente.

## 11. Mantener en Estación V

- planning exhaustivo;
- mobile compacto y landscape desde preproducción;
- auditoría PWA/fullscreen temprana;
- contrato de cámara, artboard, anchors y capas;
- alineación alpha-aware;
- UI semántica en DOM;
- accesibilidad y navegación por teclado;
- reduced motion;
- static composition antes de motion;
- gate humano explícito;
- no generar assets durante implementación salvo hallazgo auditado y justificado;
- manifiestos before/after y hashes de áreas congeladas;
- evidencia externa separada del runtime.

## 12. Evitar en Estación V

- resolver la pantalla con pocos assets genéricos;
- improvisación sin blueprint;
- master genérico para categorías visuales distintas;
- IA para geometría determinista;
- considerar fullscreen o portrait al final;
- offsets independientes por viewport;
- capas ambiguas;
- glow permanente que borre jerarquía;
- animar antes de estabilizar el layout;
- aceptar QA automática como aprobación estética;
- commits por microfrente;
- iniciar Mundo VI;
- borrar o reemplazar la base Fable antes de inventariarla;
- presentar placeholders procedurales como arte final.

## 13. Próximos tickets propuestos

```text
ST5-019A — read-only audit e inventario maestro
ST5-019B — narrativa, interacción, cámara, responsive y blueprint
ST5-ASSETS — producción uno por uno
ST5-019C — static composition
ST5-019D — immersive layout
ST5-019E — motion/interaction
ST5-019F — closeout
```

`ST5-019A` debe comparar la implementación real con las especificaciones, referencias y deudas actuales. Debe auditar, como mínimo: paths, consumidores, copy efectivo, cuatro áreas, nexo, Lía, rutas, touch layer, responsive, reduced motion, accesibilidad, fullscreen/PWA, assets compartidos, placeholders, tests, evidencia histórica y frozen fingerprints. No debe implementar ni producir arte.

No comenzar a generar assets ni programar Estación V. Primero crear un ticket read-only para que Codex audite el estado real, paths, bases, assets, copy, lógica, responsive, deuda y riesgos.
