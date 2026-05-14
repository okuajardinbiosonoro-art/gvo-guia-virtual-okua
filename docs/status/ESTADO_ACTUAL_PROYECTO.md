# Estado actual del proyecto

Fecha: 2026-05-13

Estado: repositorio base técnico con carga inicial en iteración visual.

## Implementado

- App Vite + React + TypeScript.
- Router con rutas placeholder del recorrido.
- Pantalla de carga inicial estática en `/` y `/carga` como base visual inicial.
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
- Assets finales del recorrido.
- Animación completa de la carga inicial.
- Cierre visual/narrativo/documental completo de la carga inicial.

## Estado Git/GitHub

- Rama base estable esperada: main.
- Rama del Ticket 000: feature/000-repo-base.
- Commit base aprobado: 4f6fa03.
- Próximo trabajo funcional: continuar iterando TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL hasta cierre completo.
- Repositorio público por decisión operativa consciente del usuario para permitir revisión desde ChatGPT.

## Cierre de contexto Ticket 000B

- Se creó HANDOFF_000_REPO_BASE_GVO.txt.
- Se creó PROMPT_NUEVO_CHAT_001_CARGA_INICIAL_GVO.txt.
- El siguiente trabajo funcional preparado en ese cierre fue TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.
- La rama funcional preparada en ese cierre fue feature/001-carga-inicial.

## Ticket 001: Carga inicial

- Estado: BASE_VISUAL / EN_ITERACION_VISUAL.
- Insumos usados: `docs/source_specs/001_carga_inicial_pre_portada.txt` y `assets/reference/screens/001_carga_inicial_pre_portada.png`.
- Pantalla de carga inicial estática: integrada en `main` como base visual estable en `/` y `/carga`.
- Cierre final: pendiente. No está marcada como CERRADA_APROBADA.
- Pendientes: composición final, textos definitivos, animación completa, validación fina de Lía, validación visual mobile-first y aprobación explícita del usuario.
- La pantalla usa recurso local en `public/assets/runtime/loading-initial-pre-portada.png`.
- Portada, estaciones, transición y final siguen no implementados.
- Rama funcional usada: feature/001-carga-inicial.

## Matriz de estados por pantalla

| Pantalla                  | Estado de madurez                 | Bloqueo / avance permitido                     |
| ------------------------- | --------------------------------- | ---------------------------------------------- |
| Carga inicial pre-portada | BASE_VISUAL / EN_ITERACION_VISUAL | Continuar iterando carga inicial               |
| Portada / Intro           | NO_INICIADA                       | BLOQUEADA hasta carga inicial CERRADA_APROBADA |
| Transición entre mundos   | NO_INICIADA                       | BLOQUEADA hasta autorización posterior         |
| Estación I                | NO_INICIADA                       | BLOQUEADA                                      |
| Estación II               | NO_INICIADA                       | BLOQUEADA                                      |
| Estación III              | NO_INICIADA                       | BLOQUEADA                                      |
| Estación IV               | NO_INICIADA                       | BLOQUEADA                                      |
| Estación V                | NO_INICIADA                       | BLOQUEADA                                      |
| Final                     | NO_INICIADA                       | BLOQUEADO                                      |

## Bloqueo de avance

No se puede iniciar TICKET_002_PORTADA_DEFINICION_Y_BASE_VISUAL ni crear `feature/002-portada` hasta que la carga inicial esté documentada como CERRADA_APROBADA y aprobada explícitamente por el usuario.

## Próximo ticket recomendado

Continuar iteración de carga inicial dentro de TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.
