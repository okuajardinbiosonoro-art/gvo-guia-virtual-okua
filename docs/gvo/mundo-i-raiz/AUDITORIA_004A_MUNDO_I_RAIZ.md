# Auditoria 004A - Mundo I: Raiz

## 1. Resumen ejecutivo

Esta auditoria revisa el estado tecnico de GVO antes de implementar la Estacion I - Mundo I: Raiz.

Resultado central:

- El flujo actual ya llega a `/estacion/1` desde Portada / Intro mediante `/transition/intro-to-station-1`.
- `/estacion/1` existe, pero solo renderiza `StationPlaceholder`; no contiene Mundo I real.
- La base tecnica permite construir una estacion narrativa mobile-first con React, rutas existentes, progreso secuencial, tokens tipograficos, reduced motion y componentes previos como referencia.
- No existe todavia un paquete de assets runtime especifico para Mundo I.
- La implementacion futura queda bloqueada por falta de assets separados para fondo, raices, nodos, estados, brillos y microposes de Lia.
- La animacion de fondo debe planearse con el mismo rigor que Lia; una imagen fusionada no alcanza para activar raices, nodos o atmosfera por estado.

Estado esperado para este ticket:

`AUDITORIA_004A_COMPLETADA / SIN_IMPLEMENTACION_FUNCIONAL`

## 2. Estado de Git y rama

Auditoria iniciada en:

- Rama activa: `main`.
- HEAD: `961b69c merge: approve transition world flow for next phase`.
- Tag de transicion disponible: `checkpoint/transition-world-v1-7p9`.
- Working tree inicial: limpio.

Ramas remotas visibles despues de limpieza T003E10:

- `origin/main`.
- `origin/feature/000-repo-base`.

No se creo rama nueva porque el ticket no define una rama de trabajo y el alcance permitido es un unico reporte documental.

## 3. Estructura real del repo

Estructura principal observada:

- `.github/`: configuracion GitHub.
- `assets/`: referencias visuales no runtime.
- `dist/`: build generado localmente.
- `docs/`: documentacion viva, tickets, handoffs, status, specs y validaciones visuales.
- `node_modules/`: dependencias locales instaladas.
- `public/`: assets runtime servidos publicamente.
- `scripts/`: scripts especificos de validacion/asset intake.
- `src/`: app React/TypeScript.
- `test-results/`: resultados Playwright.
- `tests/`: e2e.
- `tools/`: validadores y auditorias.

Estructura relevante de `src/`:

- `src/app`: `router.tsx`, `routes.ts`, `App.tsx`.
- `src/components`: `layout`, `lia`, `qr`, `transition`.
- `src/data`: `stations.ts`, `flow.ts`.
- `src/domain/progress`: progreso secuencial con `localStorage`.
- `src/screens`: `LoadingInitial`, `Cover`, `TransitionWorld`, `Station`, `Final`.
- `src/styles`: `global.css`, `tokens.css`.
- `src/assets/transition-world/root`: assets aprobados de Transicion entre mundos.

No existen carpetas `src/routes/` ni `src/pages/`; el router real vive en `src/app/router.tsx` y las pantallas viven en `src/screens/`.

## 4. Estado actual de /estacion/1

Ruta:

`/estacion/:stationId`

Componente actual:

`src/screens/Station/StationPlaceholder.tsx`

Datos usados:

`src/data/stations.ts`

Comportamiento actual para `/estacion/1`:

- Lee `stationId` desde React Router.
- Convierte el parametro a numero.
- Busca la estacion con `getStationById`.
- Si existe, renderiza `MobileShell` con eyebrow `Estacion placeholder`.
- Muestra `Estacion I - Mundo I: Raiz`.
- Muestra el texto: `Ruta base creada para navegacion secuencial y acceso por QR fisico.`
- Renderiza `TransitionPlaceholder`, que todavia dice que la transicion reutilizable esta pendiente de ticket.

Observacion:

- El texto de `TransitionPlaceholder` quedo desactualizado para el estado actual, porque la transicion real ya existe. No se corrige en este ticket por restriccion de no modificar runtime.
- `/estacion/1` no tiene estructura pedagogica `RELACION -> PERCEPCION -> MEDIACION`.
- No tiene nodos interactivos.
- No tiene dialogos de Lia.
- No tiene assets especificos de Mundo I.
- No tiene salida hacia Mundo II.

## 5. Componentes reutilizables encontrados

Componentes/patrones utiles:

- `MobileShell`: shell movil simple con `motion.main`, panel base, `aria-labelledby` y texto de estado local/offline.
- `CoverIntroScreen`: ejemplo completo de gating narrativo, botones accesibles, portales con estados, dialogo de Lia, `aria-live`, `localStorage` de intro y reduced motion.
- `LiaHybridAvatar`: referencia de rig seguro de Lia por capas para idle/expresiones en Portada.
- `TransitionWorld`: composicion por capas con background, sparkles, portal, Lia, texto, progress y callback de finalizacion.
- `TransitionProgress`: progress bar accesible con `role="progressbar"`, `aria-valuetext` y assets locales.
- `TransitionSparkles`: reutiliza sparkles reales de Carga Inicial.
- `LoadingInitialScreen`: referencia de escena animada con CSS variables, spritesheets, progress, reduced motion y textos DOM.
- `progress.storage.ts`: base para gating secuencial entre estaciones.
- `stations.ts` y `flow.ts`: fuente unica de rutas y nombres base de estaciones.

Patrones que no deben repetirse:

- No usar `StationPlaceholder` como base visual final.
- No animar `TransitionPlaceholder`.
- No quemar textos dentro de imagenes.
- No usar una composicion fusionada como fondo runtime final si hay raices/nodos activos.
- No duplicar la logica de progreso en varios componentes sin contrato.
- No mover contenido pedagogico a assets raster.

## 6. Estilos, layout y patrones existentes

Estilos globales:

- `src/styles/tokens.css` define tokens GVO de tipografia, color, radius y sombra.
- `--gvo-font-display`, `--gvo-font-heading`, `--gvo-font-ui` y `--gvo-font-microcopy` usan Pixelify Sans local.
- `--gvo-font-body` y `--gvo-font-dialog` usan stack legible de sistema para cuerpos largos.
- `src/styles/global.css` define shell mobile, panel base, typography global simple y placeholders.

Patrones mobile-first:

- `MobileShell` limita ancho a `480px`.
- Carga Inicial, Portada y TransitionWorld usan viewports moviles y `clamp`.
- Tests e2e ya validan ausencia de overflow horizontal en Carga.

Reduced motion:

- Carga Inicial tiene `@media (prefers-reduced-motion: reduce)`.
- Portada tiene `@media (prefers-reduced-motion: reduce)`.
- LiaHybridAvatar tiene reduced motion para blink/glow.
- TransitionWorld acepta `isReducedMotion` y tiene CSS reduced motion.
- Router detecta reduced motion para Carga Inicial y TransitionWorld runtime.

Accesibilidad:

- Hay uso consistente de `aria-labelledby`, `aria-describedby`, `role="status"`, `aria-live`, `role="dialog"`, `role="img"`, `aria-hidden`, `aria-disabled` y progressbar.
- Los patrones actuales son suficientes para una futura estacion con nodos accesibles, siempre que se creen botones reales y no areas raster sin semantica.

## 7. Assets encontrados

No se encontro paquete runtime especifico de Mundo I. Los assets relevantes disponibles pertenecen a Carga Inicial, Portada / Intro y Transicion hacia Mundo I.

### 7.1 Referencias visuales

| Archivo | Ruta | Formato | Dimensiones | Peso aprox. | Uso aparente | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `001_carga_inicial_pre_portada.png` | `assets/reference/screens/` | PNG | 941x1672 | 1419 KB | Referencia Carga Inicial | referencia |
| `002_portada_intro_archivo_vivo_reference.png` | `assets/reference/screens/` | PNG | 941x1672 | 1982 KB | Referencia Portada / Intro | referencia |
| `loading_initial_master_reference_v2.png` | `assets/reference/screens/loading-initial/` | PNG | 941x1672 | 1326 KB | Referencia Carga Inicial V2 | referencia |

### 7.2 Carga Inicial

| Archivo | Ruta | Formato | Dimensiones | Peso aprox. | Uso aparente | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `lia_loading_16f.png` | `public/assets/runtime/loading-initial/lia/` | PNG | 2560x2560 | 2519 KB | spritesheet Lia Carga Inicial | aprobado para Carga |
| `plant_growth_4f.png` | `public/assets/runtime/loading-initial/plant/` | PNG | 3072x768 | 560 KB | crecimiento planta | aprobado para Carga |
| `water_flow_5f.png` | `public/assets/runtime/loading-initial/water/` | PNG | 5120x768 | 119 KB | agua multi-stream | aprobado para Carga |
| `ground_halo_01_orbital_ring.png` | `public/assets/runtime/loading-initial/ground/` | PNG | 960x256 | 64 KB | halo suelo | aprobado para Carga |
| `sparkle_01_lilac_small.png` | `public/assets/runtime/loading-initial/sparkles/` | PNG | 189x189 | 21 KB | sparkle decorativo | aprobado para Carga/Transicion |
| `sparkle_02_amber_small.png` | `public/assets/runtime/loading-initial/sparkles/` | PNG | 187x186 | 24 KB | sparkle decorativo | aprobado para Carga/Transicion |
| `sparkle_03_lilac_medium.png` | `public/assets/runtime/loading-initial/sparkles/` | PNG | 240x233 | 22 KB | sparkle decorativo | aprobado para Carga/Transicion |
| `sparkle_04_micro_white.png` | `public/assets/runtime/loading-initial/sparkles/` | PNG | 103x100 | 7 KB | sparkle decorativo | aprobado para Carga/Transicion |

### 7.3 Portada / Intro

| Archivo | Ruta | Formato | Dimensiones | Peso aprox. | Uso aparente | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `cover_bg_archivo_vivo_base_v1.png` | `public/assets/runtime/cover-intro/background/` | PNG | 941x1672 | 2993 KB | fondo Portada | aprobado para Portada |
| `lia_pose_idle_v1.png` | `public/assets/runtime/cover-intro/lia/poses/` | PNG | 941x1672 | 651 KB | pose Lia Portada | aprobado para Portada |
| `lia_pose_greeting_v1.png` | `public/assets/runtime/cover-intro/lia/poses/` | PNG | 1086x1448 | 686 KB | saludo/dialogo | aprobado para Portada |
| `lia_pose_explain_calm_v1.png` | `public/assets/runtime/cover-intro/lia/poses/` | PNG | 1086x1448 | 711 KB | explicacion calmada | aprobado para Portada |
| `lia_pose_point_portal_1_v1.png` | `public/assets/runtime/cover-intro/lia/poses/` | PNG | 1024x1536 | 703 KB | senalar Portal I | aprobado para Portada |
| `lia_pose_activate_portal_1_v1.png` | `public/assets/runtime/cover-intro/lia/poses/` | PNG | 941x1672 | 676 KB | activar Portal I | aprobado para Portada |
| `lia_rig_*` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/` | PNG | 941x1672 | 13-177 KB | rig idle por capas | aprobado para Portada |
| `portal_1_frame_enabled_v1.png` | `public/assets/runtime/cover-intro/portals/portal_1/frame/` | PNG | 941x1672 | 340 KB | frame Portal I | aprobado para Portada |
| `portal_1_glow_enabled_v1.png` | `public/assets/runtime/cover-intro/portals/portal_1/glow/` | PNG | 941x1672 | 438 KB | glow Portal I | aprobado para Portada |
| `lock_soft_gold_v1.png` | `public/assets/runtime/cover-intro/locks/` | PNG | 941x1672 | 427 KB | candado Portada | aprobado para Portada |

### 7.4 Transicion entre mundos

| Archivo | Ruta | Formato | Dimensiones | Peso aprox. | Uso aparente | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `transition_root_background_v1.webp` | `src/assets/transition-world/root/runtime/background/` | WebP | 1440x2560 | 45 KB | fondo Transicion | aprobado para Transicion |
| `transition_root_background_v1.png` | misma | PNG | 1440x2560 | 2805 KB | fallback/fuente | aprobado para Transicion |
| `lia_transition_root_idle_4f_v1.webp` | `src/assets/transition-world/root/runtime/lia/` | WebP | 1024x256 | 35 KB | Lia idle 4 frames | aprobado para Transicion |
| `lia_transition_root_guide_2f_v1.webp` | misma | WebP | 512x256 | 12 KB | Lia guia 2 frames | aprobado para Transicion |
| `lia_transition_root_exit_v1.webp` | misma | WebP | 256x256 | 4 KB | Lia salida | aprobado para Transicion |
| `portal_root_states_3f_v1.webp` | `src/assets/transition-world/root/runtime/portal/` | WebP | 1536x768 | 48 KB | portal 3 estados | aprobado para Transicion |
| `symbol_root_v1.webp` | misma | WebP | 256x256 | 3 KB | simbolo raiz | aprobado para Transicion |
| `transition_root_progress_*` | `src/assets/transition-world/root/runtime/progress/` | PNG/WebP | 96-1152 px | 3-58 KB | barra Transicion | aprobado para Transicion |

Referencias desde codigo:

- `transition-root-assets.ts` importa el manifest y resuelve PNG/WebP con `import.meta.glob`.
- `TransitionWorld` consume componentes que usan estos assets.
- `TransitionSparkles` reutiliza sparkles de Carga Inicial.
- `CoverIntroScreen` usa assets de `coverIntroAssets.ts` y manifest de Portada.

## 8. Assets faltantes para Mundo I

No existen en el repo assets runtime especificos de Mundo I para:

1. Fondo base sin texto, sin Lia, sin nodos y sin boton.
2. Suelo / corte subterraneo base.
3. Planta joven con zona preparada para brillo sutil.
4. Raices base apagadas.
5. Raiz izquierda asociada a RELACION.
6. Raiz central asociada a PERCEPCION.
7. Raiz derecha asociada a MEDIACION.
8. Overlays de brillo para raices activas.
9. Nodos conceptuales separados.
10. Estados visuales de nodo: bloqueado, pendiente, disponible, activo, completado.
11. Halo o pulso de nodo separado.
12. Camino luminoso hacia salida / transicion a Mundo II.
13. Overlays de luz ambiental calida.
14. Particulas minimas controlables.
15. Lia separada para Mundo I.
16. Microposes de Lia: idle, observando planta, senalando relacion, mirando percepcion, guiando mediacion, salida.
17. Ventanas de dialogo como DOM/CSS.
18. Boton Continuar como DOM/CSS.
19. Separadores ornamentales SVG/CSS/local asset si se requieren.
20. Iconos superiores locales, si se reutilizan.

Piezas parcialmente reutilizables pero no suficientes:

- El rig idle de Lia de Portada puede informar metodologia, pero no garantiza poses pedagogicas de Mundo I.
- El simbolo `symbol_root_v1` puede servir como referencia visual, no como nodo conceptual completo.
- Sparkles de Carga pueden reutilizarse como particulas minimas si no invaden la escena.
- Progress bar de Transicion puede informar patron, pero Mundo I probablemente necesita progreso conceptual, no barra temporal.

Si solo se parte de una imagen fusionada:

- No se podran activar raices por concepto.
- No se podran bloquear/desbloquear nodos con estados visuales independientes.
- No se podra respirar la luz de fondo sin overlays artificiales.
- No se podra separar el camino luminoso de salida.
- Los textos y botones correrian riesgo de quedar quemados o inaccesibles.

## 9. Viabilidad de animacion de fondo

La animacion de fondo es viable, pero requiere assets por capas o SVG local.

### CSS/DOM

Viable para:

- Respiracion de luz calida con overlays.
- Halo suave de nodos.
- Pulso de botones.
- Transiciones de opacidad/transform.
- Particulas muy pocas con PNG/SVG local o CSS ligero.

Limites:

- No dibuja raices organicas complejas con calidad sin assets adecuados.
- Blurs/filtros grandes pueden afectar rendimiento movil.
- Sombras multiples y filtros sobre capas 9:16 grandes deben limitarse.

### SVG local

Viable para:

- Trazos de raices animables con `stroke-dashoffset`.
- Caminos conceptuales.
- Lineas hacia nodos.
- Iconos ornamentales.

Limites:

- Requiere paths dibujados manualmente o exportados con criterio.
- Debe evitar verse como red electrica agresiva.
- Necesita accesibilidad separada: SVG decorativo `aria-hidden` o botones DOM encima.

### PNG/WebP transparentes por capas

Viable para:

- Fondo atmosferico.
- Suelo/subsuelo.
- Brillos de raices.
- Planta y overlays calidos.
- Camino luminoso.

Limites:

- Muchas capas 9:16 pueden aumentar peso.
- Se necesita naming consistente y dimensiones compatibles.
- Si las capas vienen fusionadas, se pierde control por estado.

### Canvas

No se recomienda como primera opcion tecnica para Mundo I con el estado actual del repo.

Motivos:

- No hay base canvas en el proyecto.
- Aumenta complejidad de accesibilidad.
- DOM/CSS/SVG/capas raster cubren mejor la necesidad previsible.

## 10. Viabilidad de animacion de Lia

Patrones existentes:

- Carga Inicial usa spritesheet completo y frame registration.
- Portada usa `LiaHybridAvatar` con rig idle por capas y poses completas.
- Transicion usa spritesheets pequenos recortados de 256x256.

Viabilidad para Mundo I:

- Alta si se reciben poses/microframes especificos de Lia para la estacion.
- Media si se intenta reutilizar poses de Portada: pueden no comunicar relacion, percepcion y mediacion.
- Baja si se pretende inventar Lia desde Codex o usar placeholders.

Requisitos futuros:

- Lia separada del fondo.
- Estados o microposes coherentes: idle, observando planta, senalando relacion, mirando percepcion, guiando mediacion, salida.
- Mantener identidad: cinco petalos, cabeza opalescente, ojos media luna, collar ambar, bulbo inferior.
- Dialogo como DOM/CSS, no imagen.
- Reduced motion con poses estaticas equivalentes, no loops intensos.

Riesgo heredado:

- En Carga Inicial y Transicion, la naturalidad de Lia fue deuda visual. Mundo I deberia evitar depender de cambios bruscos de PNG completos para comunicar acciones sutiles.

## 11. Viabilidad de nodos interactivos

Estados futuros auditados:

- `station1_entering`
- `station1_idle`
- `station1_relation_active`
- `station1_perception_active`
- `station1_mediation_active`
- `station1_concept_completed`
- `station1_ready_to_continue`
- `station1_exiting`
- `station1_revisit_mode`

Viabilidad tecnica:

- Alta con React state local o reducer.
- Alta con botones DOM posicionados sobre nodos visuales.
- Alta con `progress.storage.ts` para desbloqueo secuencial global entre estaciones.
- Media para revision libre posterior: requiere distinguir progreso persistido de estado de primera pasada.

Reglas futuras viables:

- Un concepto activo a la vez.
- RELACION primero.
- PERCEPCION bloqueada hasta completar RELACION.
- MEDIACION bloqueada hasta completar PERCEPCION.
- Continuar bloqueado hasta completar los tres conceptos.
- Revisit mode posterior.
- Salida hacia transicion a Mundo II.

Riesgo:

- Si los nodos solo existen dentro del fondo raster, no seran botones accesibles ni controlables.

## 12. Viabilidad de textos DOM/CSS

Viabilidad alta.

Patrones existentes:

- Carga Inicial: textos DOM.
- Portada: titulos, dialogos, botones y mensajes DOM.
- TransitionWorld: titulo/subtitulo/progress DOM.
- Tokens tipograficos locales en `src/styles/tokens.css`.

Para Mundo I:

- Dialogos de Lia deben ir en DOM/CSS.
- Labels de nodos deben ir en DOM/ARIA.
- Boton Continuar debe ser DOM/CSS.
- Ningun texto pedagogico debe venir quemado en imagen.

## 13. Accesibilidad y reduced-motion

Arquitectura actual permite:

- Botones accesibles para cada nodo.
- `disabled` o `aria-disabled` segun necesidad.
- `aria-live` para dialogo de Lia.
- `role="status"` para cambios de estado narrativo.
- `role="progressbar"` si se usa progreso conceptual o temporal.
- `aria-labelledby` y `aria-describedby` por pantalla.
- Reduced motion por CSS y deteccion en router/componentes.

Labels futuros viables:

- `Relacion. Idea uno de tres. Disponible.`
- `Percepcion. Idea dos de tres. Bloqueada hasta completar Relacion.`
- `Mediacion. Idea tres de tres. Bloqueada hasta completar Percepcion.`
- `Continuar. Completa las tres ideas para avanzar.`
- `Continuar a Mundo II.`

Riesgos:

- No depender solo del color para estados de nodo.
- Verificar contraste sobre fondo oscuro/subterraneo.
- Evitar que particulas o brillos reduzcan legibilidad.
- En reduced motion, la comprension debe conservarse sin animacion ambiental compleja.

## 14. Operacion local/offline

Estado actual:

- Dependencias instaladas son locales.
- Pixelify Sans se sirve via Fontsource local.
- `audit_assets.mjs` existe para bloquear URLs externas, CDN y audio.
- Build Vite/PWA precachea recursos del bundle.
- No hay audio runtime detectado por auditorias previas.

Riesgos de peso:

- Los fondos PNG grandes existentes alcanzan 2.8-3 MB.
- Los WebP equivalentes son mucho mas livianos.
- Una estacion con multiples capas 9:16 PNG podria aumentar el peso rapidamente.
- Conviene priorizar WebP/PNG transparentes solo donde sea necesario.

Operacion MikroTik/offline:

- Viable si todos los assets de Mundo I quedan en repo/runtime local.
- No se debe usar Google Fonts remoto, CDN, imagenes remotas ni APIs.

## 15. Riesgos tecnicos

Riesgos principales:

1. Implementar Mundo I con una imagen fusionada impediria animar raices/nodos por estado.
2. Reutilizar poses de Lia fuera de contexto puede degradar direccion narrativa.
3. Animar placeholders reforzaria una deuda metodologica ya detectada.
4. Exceso de blurs, filtros y particulas puede afectar rendimiento movil.
5. Nodos raster sin botones DOM romperian accesibilidad.
6. Textos incrustados en imagen perderian nitidez, accesibilidad y editabilidad.
7. Revisit mode puede complicarse si no se separa progreso persistente de estado local de pantalla.
8. Transicion a Mundo II no existe todavia; debe quedar como contrato futuro, no improvisarse.
9. `TransitionPlaceholder` en `/estacion/1` esta desactualizado frente al estado real de Transicion.
10. No hay validador de assets especifico para Mundo I.

## 16. Bloqueos para implementacion

Bloqueos actuales:

- No existe paquete aprobado de assets Mundo I por capas.
- No existen raices separadas por concepto.
- No existen estados visuales de nodos.
- No existen overlays de brillo para raices activas.
- No existen microposes de Lia especificas para RELACION, PERCEPCION y MEDIACION.
- No existe especificacion runtime final de Mundo I en el repo.
- No existe transicion de salida hacia Mundo II.
- No existe manifest/validador de assets de Mundo I.

Estos bloqueos no impiden documentar; si impiden una implementacion visual correcta.

## 17. Deudas heredadas relevantes

- Carga Inicial: deuda de naturalidad de animacion de Lia.
- Portada / Intro: aprobada para avanzar, no cerrada final.
- Transicion entre mundos: aprobada 7.9/10, no cerrada final.
- Lia requiere mejor planificacion de rig/motion para pantallas futuras.
- Sistema compartido de progress bar GVO pendiente.
- `/estacion/1` placeholder tecnico sigue mostrando un texto de transicion pendiente.
- Estaciones II-V y final no existen.

## 18. Checks ejecutados

Checks de auditoria ejecutados:

- `git status --short`: OK al inicio, sin cambios.
- `git branch --show-current`: OK, `main`.
- `git log --oneline --decorate -5`: OK, HEAD `961b69c`.
- `git tag --list checkpoint/transition-world-v1-7p9`: OK.
- `rg --files src`: OK, estructura real inspeccionada.
- `rg --files public`: OK, assets runtime inspeccionados.
- `rg` sobre `prefers-reduced-motion`, `aria`, `audio`, `video`, `https`, `@import`, `cdn`, `google`: OK como auditoria textual.
- Inventario Node + `sharp`: OK, dimensiones/peso de imagenes relevantes obtenidos.

Checks de validacion tecnica ejecutados despues de crear el reporte:

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 45 tests.
- `npm run build`: OK; incluye `tsc -b` y build Vite/PWA.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni uso de audio.

Comandos no disponibles:

- `npm run typecheck`: NO_DISPONIBLE; `package.json` no define script `typecheck`. El typecheck se ejecuta dentro de `npm run build` mediante `tsc -b`.

## 19. Archivos tocados

Creado:

- `docs/gvo/mundo-i-raiz/AUDITORIA_004A_MUNDO_I_RAIZ.md`

No se tocaron:

- `src/`
- `public/`
- `assets/`
- `package.json`
- `package-lock.json`
- rutas
- componentes runtime
- tests
- docs de estado existentes

## 20. Estado final de Git

Estado al cerrar la auditoria:

- Rama activa: `main`.
- Working tree: solo este reporte documental como cambio esperado.
- Sin cambios funcionales.
- Sin assets nuevos.
- Sin dependencias nuevas.
- Sin commits creados por este ticket.
