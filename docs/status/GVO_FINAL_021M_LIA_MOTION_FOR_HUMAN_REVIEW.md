# GVO_FINAL_021M — Motion de Lía para revisión humana

Fecha: `2026-08-04`

Estado: `GVO_FINAL_021M_LIA_MOTION_READY_FOR_HUMAN_REVIEW`

Gate 7: `PENDING_HUMAN_REVIEW`

## Baseline

- Branch: `main`.
- HEAD: `d69d9fa886e4184c17a183dd010c575e42cce26c`.
- `origin/main` local y `refs/heads/main` remoto: mismo SHA.
- Divergencia inicial: `0/0`.
- Worktree inicial: limpio, `0` paths.
- Staged inicial: `0`.
- No se ejecutó `fetch`, stage, commit ni push.

## Implementación

`FinalLiaMotion` reemplaza únicamente el render estático interno de Lía en
`FinalRootScreen`; el wrapper, sus offsets y la composición aprobada en 021L
permanecen sin cambios.

Se consumen los tres assets canónicos ya registrados:

- `final_lia_greeting_4f_v01.webp` — strip `4×1`, `256×256` por frame;
- `final_lia_idle_contemplative_6f_v01.webp` — strip `6×1`, `256×256` por frame;
- `final_lia_glow_shadow_v01.png` — glow estático.

Ambos strips permanecen montados y precargados; el frame se selecciona con
viewport recortado y desplazamiento discreto. No se cambia `src` por frame, no
se añadieron dependencias, canvas, WebGL, audio, video, intervalos ni RAF.

## Fases y timing

| Fase             | Frames | Duraciones por frame (ms)            | Total/ciclo |
| ---------------- | ------ | ------------------------------------ | ----------- |
| `greeting`       | F1–F4  | `160 / 160 / 160 / 160`              | `640 ms`    |
| `idle`           | F1–F6  | `4200 / 180 / 160 / 160 / 180 / 320` | `5200 ms`   |
| `reduced_static` | F1     | sin scheduler                        | estático    |
| `hidden_paused`  | F1     | sin scheduler                        | pausado     |

El greeting ocurre una vez por montaje y pasa de F4 a idle F1. Restart,
resize, `orientationchange` y rerender no lo repiten. Idle enlaza F6→F1. El
scheduler usa un único `setTimeout` encadenado, con máximo un timer activo por
instancia y cleanup en cada transición/unmount.

## Reduced motion y visibilidad

La consulta reactiva es
`(prefers-reduced-motion: reduce)`:

- reduce inicial: `reduced_static`, idle F1, greeting omitido y `0` timers;
- cambio a reduce: cancela timer y normaliza inmediatamente a idle F1;
- cambio desde reduce: inicia idle F1 sin repetir greeting;
- documento hidden: `hidden_paused`, F1 y `0` timers;
- regreso visible: idle F1, sin catch-up y sin greeting;
- unmount: timer y listeners `matchMedia`/`visibilitychange` retirados.

La captura Chromium se ejecutó en un host con reduce activo de forma nativa y
confirmó `reduced_static`, F1, duración `0`, greeting count `0` y timers `0`.

## Responsive y composición

Se midieron los ocho viewports obligatorios:

| Portrait  | Landscape |
| --------- | --------- |
| `375×667` | `667×375` |
| `390×844` | `800×360` |
| `360×640` | `844×390` |
| `375×548` | `932×430` |

Resultados agregados:

- scroll/overflow: `0/8` fallos;
- clipping alpha de los 10 frames: `0`;
- clipping del glow: `0`;
- imágenes fallidas: `0`;
- overlaps nuevos: `0`;
- layout shift del wrapper entre frames: `0 px`;
- eje X de Lía y plataforma: `0.5` normalizado en los ocho viewports;
- offsets aprobados de accesos/Lía: sin cambios.

La variante estándar se inspeccionó en el servidor de desarrollo mediante un
override temporal de la preferencia y un hold temporal para capturas
deterministas de los frames cortos. Ambos se revirtieron antes de pruebas,
build y auditoría final. No forman parte del diff entregado.

## Interacción y accesibilidad

- Lía y glow permanecen decorativos, `aria-hidden="true"` y con
  `pointer-events: none`.
- Accesos I–V conservan rutas directas `/estacion/1`…`/estacion/5`, una sola
  activación, foco y semántica Link; la prueba los activa en greeting e idle.
- Restart permanece operativo en greeting e idle y conserva
  `navigation_only_no_global_cleanup`.
- Los cinco slots operativos permanecen registrados y no consumidos.
- Copy, orden DOM, targets y ausencia de Mundo VI se preservan.

## Evidencia

Carpeta: `docs/visual/final/021m-lia-motion/`.

- Portrait `375×667`: seis capturas y contact sheet.
- Landscape `667×375`: tres capturas y contact sheet.
- Reduced motion: dos capturas idle F1 y contact sheet.
- Timing: `final_021m_motion_timing_metrics.json`.
- Layout: `final_021m_motion_layout_metrics.json`.
- Evidencia animada opcional: no creada.

El JSON de layout incluye bboxes wrapper, alpha de cada frame, glow y
plataforma, scroll, clipping, overlap, layout shift, consola, recursos externos
y assets fallidos. El JSON temporal registra fases, timestamps relativos,
duraciones, desviaciones, transiciones, reduced motion, visibilidad, timers y
errores.

## Validación

- FinalLiaMotion focal: `6/6 PASS`.
- FinalRoot focal: `6/6 PASS`.
- Registry/assets/editorial focal: `13/13 PASS`.
- Suite global: `309/309 PASS` en `27/27` archivos.
- TypeScript: PASS.
- ESLint: PASS.
- Prettier focalizado: PASS.
- Build/PWA: PASS; `595` módulos y `278` entradas de precache.
- Greeting, idle y glow en `dist`: PASS, byte-identical con `public`.
- Greeting, idle y glow en precache: `3/3 PASS`.
- Auditoría de assets: PASS; sin URLs externas, CDN ni audio.
- Chromium portrait/landscape/reduced motion: PASS.
- Consola warnings/errors: `0`.
- URLs externas en DOM/runtime inspeccionado: `0`.
- Assets fallidos: `0`.
- `git diff --check`: PASS.

Sólo permanecen los warnings históricos del chunk principal mayor de 500 kB
y del reporte de tiempos de plugins de Vite.

## Deudas fuera de alcance

No implementadas ni modificadas:

- persistencia o storage;
- offline-first adicional;
- fullscreen;
- retorno global al Mirador;
- reset real;
- service worker o configuración PWA;
- Portada, Mundos I–V, transiciones, router/guards;
- editorial, CSV/XLSX, assets públicos o fuentes de producción.

## Gate 7 y Git

- Gate 7: `PENDING_HUMAN_REVIEW`.
- El PASS técnico no declara aprobación humana del motion.
- Staged: `0`.
- Commit: `NO`.
- Push: `NO`.
- HEAD requerido al cierre: `d69d9fa886e4184c17a183dd010c575e42cce26c`.
- Worktree esperado: `22` paths exactos de 021M.
- Paths inesperados/prohibidos esperados: `0/0`.
