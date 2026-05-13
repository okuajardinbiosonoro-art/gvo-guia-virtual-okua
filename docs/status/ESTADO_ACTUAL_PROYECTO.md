# Estado actual del proyecto

Fecha: 2026-05-13

Estado: repositorio base técnico.

## Implementado

- App Vite + React + TypeScript.
- Router con rutas placeholder del recorrido.
- Pantalla de carga inicial estática en `/` y `/carga`.
- Capa mínima de progreso secuencial con `localStorage`.
- PWA mínima sin push notifications.
- Documentación inicial del proyecto.
- Reglas no negociables.
- Identidad de Lía documentada.
- Estrategia QR/cámara documentada.
- Metodología de tickets.

## No implementado todavía

- Portada real.
- Estaciones reales.
- Final real.
- Scanner interno con cámara.
- Assets finales del recorrido.

## Estado Git/GitHub

- Rama base estable esperada: main.
- Rama del Ticket 000: feature/000-repo-base.
- Commit base aprobado: 4f6fa03.
- Próximo trabajo funcional: TICKET_002_PORTADA_DEFINICION_Y_BASE_VISUAL.
- Repositorio público por decisión operativa consciente del usuario para permitir revisión desde ChatGPT.

## Cierre de contexto Ticket 000B

- Se creó HANDOFF_000_REPO_BASE_GVO.txt.
- Se creó PROMPT_NUEVO_CHAT_001_CARGA_INICIAL_GVO.txt.
- El siguiente trabajo funcional preparado en ese cierre fue TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.
- La rama funcional preparada en ese cierre fue feature/001-carga-inicial.

## Ticket 001: Carga inicial

- Estado: COMPLETADO.
- Insumos usados: `docs/source_specs/001_carga_inicial_pre_portada.txt` y `assets/reference/screens/001_carga_inicial_pre_portada.png`.
- Pantalla de carga inicial estática: implementada en `/` y `/carga`.
- La pantalla usa recurso local en `public/assets/runtime/loading-initial-pre-portada.png`.
- Portada, estaciones, transición y final siguen no implementados.
- Rama funcional creada: feature/001-carga-inicial.

## Próximo ticket recomendado

TICKET_002_PORTADA_DEFINICION_Y_BASE_VISUAL.
