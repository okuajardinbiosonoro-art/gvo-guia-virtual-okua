# GVO_ST4_018D_MF06 — Interaction, motion and technical ambience

Estado técnico: `GVO_ST4_018D_MF06_PARTIAL_ENVIRONMENT_LIMITATION`.

La coreografía de Estación IV quedó implementada y validada en Chromium real
sobre el build de producción. La clasificación permanece parcial porque esta
sesión no expuso el canal JavaScript del Browser integrado exigido por el
ticket; por tanto no se emite `READY_FOR_HUMAN_REVIEW` ni se sustituye esa
certificación por tests DOM.

## Baseline y alcance congelado

- Rama observada: `main`.
- `HEAD`, `origin/main` y remoto al inicio: `b94c3287834c718e7ef970af9ec62da4789770f3`.
- Divergencia inicial: `0/0`.
- Se preservaron layout R1, artboard, anchors, escalas, copy, rutas, Mundo II,
  Estación III, transiciones pasivas, Mundo V, fullscreen/orientation/PWA y
  los 20 assets aprobados con sus 20 espejos `current-used`.
- No se añadieron assets, audio, video runtime, canvas, WebGL ni dependencia de
  animación.
- No se ejecutaron operaciones Git mutantes ni publicación.

## Arquitectura aplicada

- `useWorld4MotionController` concentra operaciones cancelables, epoch, lock y
  timers de entrada, nodo, cadena y salida sin duplicar progreso pedagógico.
- La ruta activa usa SVG sobre el PNG pasivo: siete segmentos, pulso local del
  nodo 1, traveler único, estados completed y sweep final.
- Cada nodo usa un único overlay DOM/SVG alpha-aware con configuración
  semántica; sólo existe un FX activo.
- Lía reutiliza exclusivamente `greeting` y `explain_calm`, ocho offsets de
  artboard, espejo 5–8 y travel WAAPI de tres keyframes. Resize, orientación y
  fullscreen normalizan el travel al destino estable.
- Tarjeta estable `aria-live`, swap tardío en la ventana contractual, entrada
  de título y body con stagger de 45 ms.
- Ambiente: haze, dos ribbons y densidad determinista de motes. Los motes se
  pausan mientras la ayuda tap está visible para respetar el presupuesto idle.
- La ayuda tap reutiliza `GestureHint`, aparece una vez por sesión, se consume
  por interacción previa y no compite con `OrientationHint`.

## Timings y estados

- Entrada completa: 1400 ms; entrada abreviada: 240 ms.
- Paso de nodo: 1180 ms; Lía 720 ms; ruta 520–760 ms; FX 620–920 ms.
- Card out: 120 ms; swap a 380 ms; card in: 180 ms; body +45 ms.
- Chain complete: 1280 ms; `exit_reveal` a 1040 ms.
- Salida: 650 ms con CTA bloqueada inmediatamente y presencia de cadena.
- Reduced motion: entrada 160 ms, nodo 180 ms, cadena 260 ms y salida 160 ms,
  sin traveler, drift, sway, scan, blink repetido ni respiración.

## Validación cerrada

- TypeScript: PASS.
- ESLint sin warnings: PASS.
- Suite focal Estación IV: 42/42 PASS.
- Suite completa ejecutada en lotes acotados: 20/20 archivos, 242/242 tests.
- Build Vite/PWA: PASS; 233 entradas precacheadas.
- `audit:assets`: PASS, sin URL externa, CDN ni audio.
- `git diff --check`: PASS; sólo advertencias informativas LF/CRLF.
- Chromium producción: 15/15 viewports, consola 0 errors/0 warnings, imágenes
  rotas 0, overflow 0, rapid input estable, orientación estable y Fullscreen
  API real enter/exit sin reset.
- Performance limpia: idle 11; con tap hint 9; active máximo 20; 0 long tasks
  mayores de 50 ms atribuibles a Estación IV; sin RAF global permanente.
- Reduced motion real: secuencia 1→8, CTA y revisita preservadas; 0 travelers y
  0 loops ambientales.

## Evidencia

La evidencia vive fuera del repositorio en:

`C:\Users\JOSE DAVID\Downloads\GVO_ST4_018D_MF06_INTERACTION_MOTION_QA_20260722_091624\`

Incluye 15 contact sheets de frames reales T0/T25/T50/T75/T100, video WebM del
recorrido, trazas JSON, matriz responsive, hashes, manifiestos, resultados de
tests/build y reporte final.

Deuda restante: certificación mediante el Browser integrado y aprobación
humana visual. No hay deuda funcional conocida dentro del alcance 018D.
