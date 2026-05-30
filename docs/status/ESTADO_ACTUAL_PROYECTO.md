# Estado actual del proyecto

Fecha: 2026-05-29

Estado: carga inicial V13 consolidada en `main` como base de avance; Portada / Intro con QA final 002L generado y candidata a aprobación para avanzar, pendiente de confirmación visual final del usuario; sin transición pixelart final ni Estación I real.

## Implementado

- App Vite + React + TypeScript.
- Router con rutas placeholder del recorrido.
- Pantalla de carga inicial animada V13 en `/` y `/carga`.
- Assets runtime normalizados de carga inicial en `public/assets/runtime/loading-initial/`.
- Capa mínima de progreso secuencial con `localStorage`.
- PWA mínima sin push notifications.
- Documentación inicial del proyecto.
- Reglas no negociables.
- Identidad de Lía documentada.
- Estrategia QR/cámara documentada.
- Metodología de tickets.
- Metodología de cierre por pantalla.
- Metodología de avance por umbral visual.
- Handoff documental de carga inicial V13 como base de avance.
- Preproducción documental inicial de Portada / Intro.
- Especificación fuente de Portada / Intro copiada a `docs/source_specs/002_portada_intro_archivo_vivo_v1.txt`.
- Referencia visual de Portada / Intro copiada a `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png`.
- Asset plan, prompt pack y checklist visual de Portada / Intro.
- Assets runtime staged de Portada / Intro en `public/assets/runtime/cover-intro/`.
- Manifest de assets de Portada / Intro en `public/assets/runtime/cover-intro/manifest.json`.
- Validador de assets de Portada / Intro en `tools/validate_cover_intro_assets.mjs`.
- Base visual de Portada / Intro en `/portada`.
- Diálogos introductorios de Lía y gating narrativo base de Portal I en `/portada`.
- Motion polish base de Portada / Intro con reduced motion robusto.
- Transición placeholder de Portada / Intro hacia Mundo I en `/portada`.
- QA visual documental 002H de Portada / Intro con ocho capturas 390x844.
- Diálogo premium base 002I con etiqueta Lía, progreso inicial y panel museográfico integrado.
- Recomposición visual 002I de portales con mayor protagonismo de Portal I.
- Corrección 002I-FIX con `resetIntro=1`, flujo `/` a `/portada` y capturas QA nuevas.
- Corrección 002I-FIX2 con progreso `Paso X de 5`, tipografía de lectura en diálogos, panel más asociado a Lía y activación de Lía anclada al Portal I.
- Lía hybrid rig facial 002J en `portada_idle`, con capas locales staged, parpadeo controlado, glow sutil de collar y poses completas preservadas para estados narrativos.
- Corrección 002J-FIX con rig idle en diálogos seguros, expresiones `happy`/`attentive`, blink más perceptible, glow de collar reforzado y panel de diálogo sin línea/flecha/triángulo ordinario.
- Coreografía 002K del Portal I con sandwich visual por capas, Lía `activatePortal1` anclada al portal, frame frontal duplicado como rim, luz CSS de contacto y overlay placeholder posterior al contacto.
- QA final 002L de Portada / Intro con capturas 390x844, matriz visual, handoff de reaprobación y borrador de decisión visual.

## No implementado todavía

- Transición real de Portada / Intro hacia Mundo I.
- Estaciones reales.
- Final real.
- Scanner interno con cámara.
- Assets finales del resto del recorrido.
- Cierre visual/narrativo/documental completo de la carga inicial.

## Estado Git/GitHub

- Rama base estable esperada: main.
- Rama del Ticket 000: feature/000-repo-base.
- Commit base aprobado: 4f6fa03.
- Próximo trabajo recomendado: revisar visualmente 002L y confirmar si Portada / Intro queda `APROBADA_PARA_AVANZAR`, `AJUSTE_VISUAL_REQUERIDO` o `CERRADA_APROBADA_FINAL`.
- Repositorio público por decisión operativa consciente del usuario para permitir revisión desde ChatGPT.

## Cierre de contexto Ticket 000B

- Se creó HANDOFF_000_REPO_BASE_GVO.txt.
- Se creó PROMPT_NUEVO_CHAT_001_CARGA_INICIAL_GVO.txt.
- El siguiente trabajo funcional preparado en ese cierre fue TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.
- La rama funcional preparada en ese cierre fue feature/001-carga-inicial.

## Ticket 001 / 001B / 001C / 001D / 001E / 001F / 001G / 001H / 001I / 001J / 001K / 001L / 001M / 001N: Carga inicial

- Estado: APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA.
- Commit consolidado en `main`: `87e048b feat: register initial loading frames timeline`.
- Tag checkpoint: `checkpoint/carga-inicial-v13-7p2`.
- Insumos usados: `docs/source_specs/001_carga_inicial_pre_portada.txt` y `assets/reference/screens/001_carga_inicial_pre_portada.png`.
- Insumos 001B usados: `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\carga_inicial_v2`.
- Pantalla de carga inicial animada V13: integrada en `/` y `/carga` para revisión visual.
- Refinamiento 001C: duración real de 12s, entrada lateral de Lía, composición centrada, riego multi-stream, sparkles determinísticos y reduced motion de 1300ms.
- Refinamiento 001D: maceta/halo ligeramente a la izquierda, Lía mas a la derecha, agua alineada a la boquilla, riego sostenido y 10 sparkles determinísticos.
- Refinamiento 001E: maceta/planta mas baja y mas a la izquierda, Lía mas a la derecha, agua anclada al wrapper de Lía con origen en boquilla y destino planta/tierra, sparkles fuera de zonas principales.
- Refinamiento 001F: halo centrado y ampliado como base común, maceta/planta mas baja y mas a la izquierda, Lía desplazada hacia el centro sin perder relación derecha, agua recalibrada para el nuevo layout, timeline normal de 12000ms y reduced motion de 1300ms conservados.
- Refinamiento 001G: ajuste exclusivo de maceta/planta, bajándola y desplazándola mas a la izquierda; Lía, regadera, agua, halo, sparkles, textos, barra, timeline normal de 12000ms y reduced motion de 1300ms se conservan.
- Refinamiento 001H: ajuste horizontal mínimo de maceta/planta hacia la izquierda; plantBottom, Lía, regadera, agua, halo, sparkles, textos, barra, timeline normal de 12000ms y reduced motion de 1300ms se conservan.
- Refinamiento 001I: ajuste horizontal puntual de maceta/planta de 32% a 30%; plantBottom, Lía, regadera, agua, halo, sparkles, textos, barra, timeline normal de 12000ms y reduced motion de 1300ms se conservan.
- Refinamiento 001J: polish de motion/UI sin mover la composición aprobada; mejora easing de entrada de Lía, flotación, crossfade de planta, pulsos de agua, respiración de sparkles, texto y barra, conservando timeline normal de 12000ms y reduced motion de 1300ms.
- Refinamiento 001K: integra Pixelify Sans local mediante Fontsource, afina barra pixelart, agrega capa de pose para micro-inclinación de Lía, reordena staging de riego/planta/sparkles y conserva layout base, timeline normal de 12000ms y reduced motion de 1300ms.
- Refinamiento 001L: reduce escala visual del escenario a 0.90, separa caps/track/fill/marker de la barra, suaviza bob/pose/agua/planta/sparkles y conserva textos, rutas, assets, timeline normal de 12000ms y reduced motion de 1300ms.
- Refinamiento 001M: ajuste puntual de barra; caps y marker usan bloques CSS de 3px para formar rombos pixelart, el track empieza despues del cap izquierdo para evitar superposicion, se conserva altura fina de 2px, sin porcentaje ni numeros.
- Refinamiento 001N: agrega frame registration V13 para los 16 frames de Lía con ancla visor/collar, timeline dirigido por fases, holds de preparación/riego/observación, agua retrasada después de la inclinación y crecimiento de planta después de los pulsos.
- Cierre final: pendiente. No está marcada como CERRADA_APROBADA_FINAL.
- Deuda visual conocida: la animación de Lía todavía se siente algo brusca; para 9/10 o 10/10 se requerirán nuevos microframes o edición frame-by-frame.
- Motivo de avance: el usuario Ing. José David aprobó avanzar con umbral visual aproximado 7.2/10 para evitar bloqueo excesivo en una sola pantalla.
- Pendientes: conservar deuda visual para pulido global y no declarar cierre final hasta aprobación explícita.
- La pantalla usa assets locales normalizados en `public/assets/runtime/loading-initial/`.
- Portada, estaciones, transición y final siguen no implementados en runtime.
- Rama consolidada: main.

## Ticket 002A: Portada / Intro handoff y preproducción

- Estado: PREPRODUCCION_DESBLOQUEADA / NO_IMPLEMENTADA.
- Rama documental: feature/002A-portada-intro-handoff-preproduccion.
- Se crea handoff de carga inicial V13 como base de avance.
- Se crea metodología de avance por umbral visual.
- Se copia la especificación fuente de Portada / Intro.
- Se copia la referencia visual `portada.png` como referencia no runtime.
- Se crea prompt autocontenido para nuevo chat de Portada / Intro.
- Se crea plantilla de preproducción de Portada / Intro.
- Se crea asset plan de Portada / Intro.
- Se crea prompt pack para ChatGPT Images.
- Se crea checklist visual de Portada / Intro.
- No se implementa portada.
- No se crea ruta nueva.
- No se toca la carga inicial funcional.
- No se tocan assets runtime.

## Ticket 002C: Portada / Intro asset staging y normalización

- Estado: ASSETS_STAGED / NO_IMPLEMENTADA.
- Rama técnica: feature/002C-portada-intro-asset-staging.
- Se crea `public/assets/runtime/cover-intro/`.
- Se copian assets aprobados desde `portada_intro_v1/02_aprobadas`.
- Se crea manifest runtime de assets.
- Se crea script `tools/validate_cover_intro_assets.mjs`.
- Se agrega comando `npm run validate:cover-intro-assets`.
- Se documenta el paquete de assets aprobado.
- No se implementa portada funcional.
- No se crea ruta nueva.
- No se toca la carga inicial funcional.

## Ticket 002D: Portada / Intro base visual

- Estado: BASE_VISUAL_IMPLEMENTADA / SIN_DIALOGOS / SIN_GATING_FINAL / NO_CERRADA.
- Rama funcional: feature/002D-portada-intro-base-visual.
- Se reemplaza el placeholder de `/portada` por una base visual funcional.
- Se usan assets staged desde `public/assets/runtime/cover-intro/`.
- Se muestran fondo Archivo Vivo, Lía, Portal I disponible, Portales II-V bloqueados, candados, botón y textos DOM.
- Se agrega reduced motion básico.
- No se implementan diálogos completos.
- No se implementa gating final.
- No se implementa transición a Mundo I.
- No se toca `/` ni `/carga`.

## Ticket 002E: Portada / Intro diálogos y gating

- Estado: DIALOGOS_BASE_IMPLEMENTADOS / GATING_PORTAL_I_BASE / SIN_TRANSICION_REAL / NO_CERRADA.
- Rama funcional: feature/002E-portada-intro-dialogos-gating.
- Se implementa la secuencia obligatoria de cinco diálogos de Lía.
- `Comenzar recorrido` inicia la introducción.
- Portal I inicia la misma introducción en primera pasada.
- Al completar los diálogos, Portal I queda listo y el botón cambia a `Entrar a Mundo I`.
- Al tocar `Entrar a Mundo I` o Portal I listo, se muestra `Abriendo Mundo I: Raíz...` como placeholder controlado.
- No existe navegación real ni transición a Estación I.
- Portales II-V conservan bloqueo y muestran feedback breve al toque.
- Lía cambia de pose usando assets staged existentes.
- Se agrega persistencia mínima `gvo.coverIntro.introCompleted.v1` para recordar introducción completada sin desbloquear estaciones.
- No se modifican assets staged.
- No se toca `/` ni `/carga`.

## Ticket 002F: Portada / Intro motion polish y reduced motion

- Estado: MOTION_POLISH_BASE / DIALOGOS_BASE_IMPLEMENTADOS / SIN_TRANSICION_REAL / NO_CERRADA.
- Rama funcional: feature/002F-portada-intro-motion-polish.
- Se separa flotación de Lía y transición de pose mediante wrapper CSS.
- Se suaviza el cambio entre poses completas con fade/settle breve.
- Portal I mantiene pulso bajo en idle, mayor claridad en `portal_1_ready` y glow controlado en `portal_1_opening_placeholder`.
- Portales II-V conservan bloqueo y agregan feedback visual sutil de candado/portal al toque.
- Tarjeta de diálogo y mensajes de estado usan entrada suave por opacidad y desplazamiento mínimo.
- Botón principal y controles de diálogo agregan transiciones de pressed/focus sin rebote.
- Reduced motion desactiva animaciones continuas y conserva diálogos/gating por estado.
- No se implementa transición real a Mundo I.
- No se modifican assets staged.
- No se toca `/` ni `/carga`.

## Ticket 002G: Portada / Intro transición placeholder y handoff a Mundo I

- Estado: TRANSICION_PLACEHOLDER_IMPLEMENTADA / HANDOFF_MUNDO_I_PREPARADO / NO_CERRADA.
- Rama funcional: feature/002G-portada-intro-transition-handoff.
- Se agrega el estado `transition_to_station_1_placeholder`.
- Al presionar `Entrar a Mundo I`, la portada pasa por `portal_1_opening_placeholder` y luego muestra un overlay DOM de transición.
- El overlay muestra `Abriendo Mundo I: Raíz...`, `Preparando recorrido...` y una nota de que la transición visual final se integrará después.
- Se usa la ruta placeholder existente `/estacion/1` como acción explícita `Continuar a Mundo I`.
- No hay navegación automática a Estación I.
- Estación I sigue siendo placeholder, no una estación real.
- Portales II-V siguen bloqueados.
- No se implementa transición pixelart final.
- No se modifican assets staged.
- No se toca `/` ni `/carga`.

## Ticket 002H: Portada / Intro QA visual y aprobación para avanzar

- Estado: QA_VISUAL_GENERADO / PENDIENTE_APROBACION_USUARIO / NO_CERRADA.
- Rama técnica: feature/002H-portada-intro-qa-visual.
- Se crea `tests/e2e/cover-intro-qa.spec.ts` para recorrer estados clave de `/portada`.
- Se generan ocho capturas documentales en `docs/visual/cover-intro/qa/002H/`.
- Se documenta matriz QA visual con criterios OK/OBSERVACIÓN/AJUSTE_REQUERIDO/NO_APLICA.
- Se valida idle, diálogos, aclaración de mediación, Portal I listo, opening placeholder, transition placeholder, portal bloqueado y reduced motion.
- La decisión visual queda pendiente del usuario Ing. José David.
- No se implementa Estación I real.
- No se implementa transición pixelart final.
- No se modifican PNG staged.
- No se toca `/` ni `/carga`.

Resultado posterior de revisión manual:

- Decisión del usuario: AJUSTE_VISUAL_REQUERIDO.
- Estrategia global aprobada para reapertura: D3 + L2 + P3.

## Ticket 002I: Portada / Intro diálogo premium y recomposición

- Estado: AJUSTE_VISUAL_D3_PARCIAL / DIALOGO_PREMIUM_BASE / RECOMPOSICION_PORTALES / NO_CERRADA.
- Rama funcional: feature/002I-portada-intro-dialogo-premium-layout.
- Cubre D3 y P3 parcial.
- Se reemplaza el cuadro de diálogo oscuro por un panel anfitriona / ficha museográfica.
- El diálogo incluye etiqueta `Lía` e indicador de progreso `1/5`, `2/5`, etc.
- El botón de diálogo queda integrado al panel y conserva label accesible.
- Se agregan capas `cover-lia-stage`, `cover-lia-layer`, `cover-portal-stage`, `cover-portal-group` y `cover-activation-stage`.
- Portal I queda como `cover-intro__portal--primary`, más grande y protagonista.
- Portales II-V siguen bloqueados, visibles y con candados.
- El placeholder de transición hacia Mundo I sigue funcionando.
- No se implementa rig facial ni blink.
- No se implementa coreografía física completa del Portal I.
- No se implementa Estación I real ni transición pixelart final.
- No se modifican assets staged.
- No se toca `/` ni `/carga`.

## Ticket 002I-FIX: Portada / Intro diálogo, layout y QA flow

- Estado: AJUSTE_002I_FIX / DIALOGO_PREMIUM_REVISADO / QA_FLOW_CORREGIDO / NO_CERRADA.
- Rama correctiva: feature/002I-fix-portada-intro-dialogo-layout-qa-flow.
- Se agrega `/portada?resetIntro=1` para limpiar `gvo.coverIntro.introCompleted.v1`.
- Se agrega soporte para `/?resetIntro=1`: muestra carga inicial y luego navega a `/portada` en primera pasada.
- `/carga` sigue disponible como QA aislado de carga inicial.
- El panel de diálogo se reposiciona para no tapar el rostro/cabeza de Lía.
- El panel se compacta y se integra mejor con crema translúcido, borde fino y acento suave.
- Portal I y portales bloqueados conservan mayor escala y legibilidad.
- Se generan capturas QA en `docs/visual/cover-intro/qa/002I-FIX/`.
- No se implementa rig facial ni blink.
- No se implementa coreografía física completa.
- No se implementa Estación I real ni transición pixelart final.
- No se modifican PNG staged.

## Ticket 002I-FIX2: Portada / Intro diálogo integrado con Lía y activación Portal I

- Estado: AJUSTE_002I_FIX2 / DIALOGO_LIA_INTEGRADO / ACTIVACION_PORTAL_I_REVISADA / NO_CERRADA.
- Rama correctiva: feature/002I-fix2-portada-intro-dialogo-lia-portal.
- El indicador visible cambia de `1/5` a `Paso 1 de 5`, `Paso 2 de 5`, etc.
- El cuerpo de diálogo, botones de diálogo, mensajes de bloqueo y textos largos de transición usan tipografía de lectura `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- El panel de diálogo suma conector visual y acento ámbar/lavanda para sentirse asociado a Lía.
- En `portal_1_opening_placeholder` y `transition_to_station_1_placeholder`, Lía usa una capa de activación anclada al Portal I.
- La activación usa un sandwich visual con glow de Portal I, Lía activate, velo CSS sutil y frame frontal duplicado; no se crean assets nuevos.
- Se generan capturas QA en `docs/visual/cover-intro/qa/002I-FIX2/`.
- `/portada?resetIntro=1`, `/?resetIntro=1` y `/carga` se conservan.
- No se implementa rig facial ni blink.
- No se implementa transición pixelart final ni Estación I real.
- No se modifican PNG staged.

## Ticket 002J: Portada / Intro Lía hybrid rig facial

- Estado: LIA_HYBRID_RIG_IDLE_IMPLEMENTADO / DIALOGO_LIA_INTEGRADO / NO_CERRADA.
- Rama funcional: feature/002J-portada-intro-lia-hybrid-rig-facial.
- Se agrega `LiaHybridAvatar` como componente seguro con dos modos: `rig-idle` y `pose`.
- En `portada_idle`, Lía usa rig por capas desde `public/assets/runtime/cover-intro/lia/rig/idle_v1/`.
- El rig idle renderiza cuerpo, pétalos, collar, glow, cabeza limpia y ojos del rig como capas `aria-hidden`.
- El parpadeo se implementa solo en rig idle con secuencia CSS `neutral -> blink_25 -> blink_50 -> closed -> blink_50 -> blink_25 -> neutral`.
- El glow del collar se anima de forma sutil solo en rig idle.
- En diálogos, Portal I listo, opening placeholder y transition placeholder se conservan poses completas staged (`greeting`, `explainCalm`, `pointPortal1`, `activatePortal1`).
- No se superponen ojos del rig sobre poses completas, evitando doble ojo o manchas visuales.
- Reduced motion desactiva parpadeo automático y pulso del collar, manteniendo a Lía visible.
- Se generan capturas QA en `docs/visual/cover-intro/qa/002J/`.
- No se crean assets nuevos.
- No se modifican PNG staged.
- No se implementa coreografía física avanzada del Portal I.
- No se implementa transición pixelart final ni Estación I real.

## Ticket 002J-FIX: Portada / Intro microvida de Lía y diálogo sin conector ordinario

- Estado: AJUSTE_002J_FIX / LIA_MICROVIDA_REFORZADA / DIALOGO_ANCHOR_REVISADO / NO_CERRADA.
- Rama correctiva: feature/002J-fix-lia-microvida-dialogue-anchor.
- Se extiende el uso de `rig-idle` a estados seguros de diálogo.
- Diálogo 1 usa rig idle con expresión `happy`.
- Diálogos 2-4 usan rig idle con expresión `attentive`.
- Diálogo 5 conserva pose completa `pointPortal1`.
- Portal listo conserva pose completa `pointPortal1`.
- Opening y transition placeholder conservan pose completa `activatePortal1`.
- El blink ahora vuelve a la expresión base activa y no siempre a neutral.
- El intervalo del blink se reduce a 4.2s y el cierre queda más perceptible sin exagerarse.
- El glow del collar sube de presencia de forma controlada.
- Se elimina el conector lineal, la flecha y el triángulo pegado del panel de diálogo.
- El panel queda asociado a Lía por badge, ubicación, paleta, acento superior y nodo ámbar-lavanda integrado.
- Se generan capturas QA en `docs/visual/cover-intro/qa/002J-FIX/`.
- No se crean assets nuevos.
- No se modifican PNG staged.
- No se implementa coreografía física avanzada del Portal I.
- No se implementa transición pixelart final ni Estación I real.

## Ticket 002K: Portada / Intro coreografía de activación Portal I

- Estado: COREOGRAFIA_PORTAL_I_BASE / LIA_MICROVIDA_OK / NO_CERRADA.
- Rama funcional: feature/002K-portada-intro-coreografia-portal-i.
- Base: `feature/002J-fix-lia-microvida-dialogue-anchor`.
- Se conserva la microvida aprobada de Lía en `portada_idle` y diálogos seguros.
- Se conserva el diálogo sin línea/flecha/triángulo ordinario.
- En `portal_1_opening_placeholder`, la activación usa una estructura por capas:
  - glow de Portal I detrás;
  - frame de Portal I back;
  - Lía `activatePortal1` anclada al contenedor del Portal I;
  - luz CSS de contacto;
  - frame frontal duplicado como rim.
- El paso a `transition_to_station_1_placeholder` se retrasa a 920ms para que el contacto se lea antes del overlay.
- `Continuar a Mundo I` sigue apuntando a `/estacion/1`.
- Portales II-V siguen bloqueados.
- No se crean assets nuevos.
- No se modifican PNG staged.
- No se implementa transición pixelart final ni Estación I real.

## Ticket 002L: Portada / Intro QA visual final y reaprobación

- Estado: QA_FINAL_002L_GENERADO / CANDIDATA_APROBADA_PARA_AVANZAR / PENDIENTE_CONFIRMACION_FINAL_USUARIO.
- Rama técnica: feature/002L-portada-intro-qa-reaprobacion.
- Base: `feature/002K-portada-intro-coreografia-portal-i`.
- Se crea `tests/e2e/cover-intro-002l-final-qa.spec.ts`.
- Se generan capturas finales en `docs/visual/cover-intro/qa/002L/`.
- Se valida flujo `/?resetIntro=1`: carga inicial y llegada a `/portada` fresca.
- Se valida `/portada?resetIntro=1`.
- Se valida diálogo 1, diálogo 2, Portal I listo, activación Portal I, transition placeholder, feedback de Portal II bloqueado, reduced motion y `/estacion/1` placeholder.
- Se crea `QA_VISUAL_PORTADA_INTRO_002L.md`.
- Se crea `HANDOFF_002L_PORTADA_INTRO_QA_REAPROBACION.md`.
- Se crea `DECISION_VISUAL_002L_PORTADA_INTRO.md`.
- Decisión técnica de Codex: `CANDIDATA_APROBADA_PARA_AVANZAR`.
- Decisión visual final del usuario: `PENDIENTE`.
- No se implementa Estación I real.
- No se implementa transición pixelart final.
- No se modifican assets staged.

## Matriz de estados por pantalla

| Pantalla                  | Estado de madurez                                                                               | Bloqueo / avance permitido                      |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Carga inicial pre-portada | APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA                                    | Avance permitido; deuda a pulido global         |
| Portada / Intro           | QA_FINAL_002L_GENERADO / CANDIDATA_APROBADA_PARA_AVANZAR / PENDIENTE_CONFIRMACION_FINAL_USUARIO | Pendiente decisión visual explícita del usuario |
| Transición entre mundos   | NO_INICIADA                                                                                     | BLOQUEADA hasta autorización posterior          |
| Estación I                | NO_INICIADA                                                                                     | BLOQUEADA                                       |
| Estación II               | NO_INICIADA                                                                                     | BLOQUEADA                                       |
| Estación III              | NO_INICIADA                                                                                     | BLOQUEADA                                       |
| Estación IV               | NO_INICIADA                                                                                     | BLOQUEADA                                       |
| Estación V                | NO_INICIADA                                                                                     | BLOQUEADA                                       |
| Final                     | NO_INICIADA                                                                                     | BLOQUEADO                                       |

## Regla de avance

La carga inicial V13 queda aprobada para avanzar, pero no cerrada como pantalla final 9/10. Portada / Intro ya tiene base visual, diálogos introductorios, gating narrativo, motion polish, transición placeholder hacia Mundo I, QA visual 002H, primera reapertura visual 002I, correcciones 002I-FIX/002I-FIX2, rig facial seguro 002J, ajuste 002J-FIX de microvida/dialogue anchor, coreografía base 002K de activación del Portal I y QA final 002L generado. La decisión visual final del usuario, la transición pixelart final y Estación I real quedan pendientes.

## Próximo ticket recomendado

Revisar las capturas de `docs/visual/cover-intro/qa/002L/` y confirmar una decisión visual: `APROBADA_PARA_AVANZAR`, `AJUSTE_VISUAL_REQUERIDO` o `CERRADA_APROBADA_FINAL`. No iniciar Mundo I real ni transición pixelart final antes de esa decisión.
