# Estado actual del proyecto

Fecha: 2026-05-17

Estado: carga inicial V13 consolidada en `main` como base de avance; Portada / Intro reabierta visualmente con diálogo premium base y recomposición de portales 002I, sin transición pixelart final ni Estación I real.

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
- Diálogo premium base 002I con etiqueta Lía, progreso 1/5 y panel museográfico integrado.
- Recomposición visual 002I de portales con mayor protagonismo de Portal I.

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
- Próximo trabajo recomendado: `TICKET_002J_PORTADA_INTRO_LIA_HYBRID_RIG_FACIAL.md`.
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

## Matriz de estados por pantalla

| Pantalla                  | Estado de madurez                                                       | Bloqueo / avance permitido              |
| ------------------------- | ----------------------------------------------------------------------- | --------------------------------------- |
| Carga inicial pre-portada | APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA            | Avance permitido; deuda a pulido global |
| Portada / Intro           | AJUSTE_VISUAL_D3_PARCIAL / DIALOGO_PREMIUM_BASE / RECOMPOSICION_PORTALES / NO_CERRADA | Siguiente: L2 rig facial de Lía         |
| Transición entre mundos   | NO_INICIADA                                                             | BLOQUEADA hasta autorización posterior  |
| Estación I                | NO_INICIADA                                                             | BLOQUEADA                               |
| Estación II               | NO_INICIADA                                                             | BLOQUEADA                               |
| Estación III              | NO_INICIADA                                                             | BLOQUEADA                               |
| Estación IV               | NO_INICIADA                                                             | BLOQUEADA                               |
| Estación V                | NO_INICIADA                                                             | BLOQUEADA                               |
| Final                     | NO_INICIADA                                                             | BLOQUEADO                               |

## Regla de avance

La carga inicial V13 queda aprobada para avanzar, pero no cerrada como pantalla final 9/10. Portada / Intro ya tiene base visual, diálogos introductorios, gating narrativo, motion polish, transición placeholder hacia Mundo I, QA visual 002H y primera reapertura visual 002I en `/portada`, pero la aprobación visual para avanzar, la transición pixelart final y Estación I real quedan pendientes.

## Próximo ticket recomendado

Abrir `TICKET_002J_PORTADA_INTRO_LIA_HYBRID_RIG_FACIAL.md` para cubrir L2: microvida de Lía con rig facial, blink y estados de ojos, sin modificar assets ni implementar coreografía física completa.
