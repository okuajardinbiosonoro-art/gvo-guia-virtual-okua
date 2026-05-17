# Estado actual del proyecto

Fecha: 2026-05-17

Estado: carga inicial V13 consolidada en `main` como base de avance; Portada / Intro en preproducción documental, sin implementación visual.

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

## No implementado todavía

- Portada real runtime.
- Estaciones reales.
- Final real.
- Scanner interno con cámara.
- Assets finales del resto del recorrido.
- Cierre visual/narrativo/documental completo de la carga inicial.

## Estado Git/GitHub

- Rama base estable esperada: main.
- Rama del Ticket 000: feature/000-repo-base.
- Commit base aprobado: 4f6fa03.
- Próximo trabajo funcional: preproducción de Portada / Intro antes de cualquier implementación runtime.
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

- Estado: PREPRODUCCION_DOCUMENTAL_INICIADA / SIN_IMPLEMENTACION.
- Rama documental: feature/002A-portada-intro-handoff-preproduccion.
- Se crea handoff de carga inicial V13 como base de avance.
- Se crea metodología de avance por umbral visual.
- Se crea prompt autocontenido para nuevo chat de Portada / Intro.
- Se crea plantilla de preproducción de Portada / Intro.
- No se implementa portada.
- No se crea ruta nueva.
- No se toca la carga inicial funcional.
- No se tocan assets runtime.

## Matriz de estados por pantalla

| Pantalla                  | Estado de madurez                                            | Bloqueo / avance permitido               |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| Carga inicial pre-portada | APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA | Avance permitido; deuda a pulido global  |
| Portada / Intro           | PREPRODUCCION_DOCUMENTAL_INICIADA / SIN_IMPLEMENTACION       | No implementar runtime sin preproducción |
| Transición entre mundos   | NO_INICIADA                                                  | BLOQUEADA hasta autorización posterior   |
| Estación I                | NO_INICIADA                                                  | BLOQUEADA                                |
| Estación II               | NO_INICIADA                                                  | BLOQUEADA                                |
| Estación III              | NO_INICIADA                                                  | BLOQUEADA                                |
| Estación IV               | NO_INICIADA                                                  | BLOQUEADA                                |
| Estación V                | NO_INICIADA                                                  | BLOQUEADA                                |
| Final                     | NO_INICIADA                                                  | BLOQUEADO                                |

## Regla de avance

La carga inicial V13 queda aprobada para avanzar, pero no cerrada como pantalla final 9/10. La siguiente fase puede trabajar Portada / Intro solo desde preproducción documental y tickets aprobados. No se debe implementar portada runtime sin definición previa de assets, narrativa, referencias visuales y criterios de listo.

## Próximo ticket recomendado

Preparar la preproducción visual y narrativa de Portada / Intro antes de abrir un ticket funcional de implementación.
