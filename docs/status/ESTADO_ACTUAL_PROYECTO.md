# Estado actual del proyecto

Fecha: 2026-05-17

Estado: carga inicial animada V13 con frame registration de Lía y timeline de motion dirigido; pendiente de revisión visual.

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

## No implementado todavía

- Portada real.
- Estaciones reales.
- Final real.
- Scanner interno con cámara.
- Assets finales del resto del recorrido.
- Cierre visual/narrativo/documental completo de la carga inicial.

## Estado Git/GitHub

- Rama base estable esperada: main.
- Rama del Ticket 000: feature/000-repo-base.
- Commit base aprobado: 4f6fa03.
- Próximo trabajo funcional: revisión visual de la animación V13 de carga inicial y refinamiento si el usuario lo solicita.
- Repositorio público por decisión operativa consciente del usuario para permitir revisión desde ChatGPT.

## Cierre de contexto Ticket 000B

- Se creó HANDOFF_000_REPO_BASE_GVO.txt.
- Se creó PROMPT_NUEVO_CHAT_001_CARGA_INICIAL_GVO.txt.
- El siguiente trabajo funcional preparado en ese cierre fue TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.
- La rama funcional preparada en ese cierre fue feature/001-carga-inicial.

## Ticket 001 / 001B / 001C / 001D / 001E / 001F / 001G / 001H / 001I / 001J / 001K / 001L / 001M / 001N: Carga inicial

- Estado: ANIMACION_V13_FRAME_REGISTRATION / EN_REVISION_VISUAL.
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
- Cierre final: pendiente. No está marcada como CERRADA_APROBADA.
- Pendientes: revisión visual mobile-first por el usuario, refinamientos si aplican y aprobación explícita.
- La pantalla usa assets locales normalizados en `public/assets/runtime/loading-initial/`.
- Portada, estaciones, transición y final siguen no implementados.
- Rama funcional actual: feature/001N-carga-inicial-frame-registration-timeline-v13.

## Matriz de estados por pantalla

| Pantalla                  | Estado de madurez                                     | Bloqueo / avance permitido                     |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Carga inicial pre-portada | ANIMACION_V13_FRAME_REGISTRATION / EN_REVISION_VISUAL | Revisión visual del usuario                    |
| Portada / Intro           | NO_INICIADA                                           | BLOQUEADA hasta carga inicial CERRADA_APROBADA |
| Transición entre mundos   | NO_INICIADA                                           | BLOQUEADA hasta autorización posterior         |
| Estación I                | NO_INICIADA                                           | BLOQUEADA                                      |
| Estación II               | NO_INICIADA                                           | BLOQUEADA                                      |
| Estación III              | NO_INICIADA                                           | BLOQUEADA                                      |
| Estación IV               | NO_INICIADA                                           | BLOQUEADA                                      |
| Estación V                | NO_INICIADA                                           | BLOQUEADA                                      |
| Final                     | NO_INICIADA                                           | BLOQUEADO                                      |

## Bloqueo de avance

No se puede iniciar TICKET_002_PORTADA_DEFINICION_Y_BASE_VISUAL ni crear `feature/002-portada` hasta que la carga inicial esté documentada como CERRADA_APROBADA y aprobada explícitamente por el usuario.

## Próximo ticket recomendado

Revisar visualmente la carga inicial animada V13 en navegador móvil. Si el usuario aprueba, documentar cierre; si pide ajustes, crear una iteración acotada de refinamiento de carga inicial.
