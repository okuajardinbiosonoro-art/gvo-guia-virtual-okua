# T003E0 - Paquete de direccion artistica para Transicion Mundo I: Raiz

## Objetivo

Preparar un paquete canonico para producir assets reales de la transicion:

`Portada / Intro -> Mundo I: Raiz`

Este paquete existe porque T003D no se considera visualmente aprobado. La calificacion manual del usuario fue `2.8/10`, y esa evaluacion manda sobre cualquier resultado tecnico o automatico.

## Diagnostico

T003D es util como preview tecnico, pero no como base visual final:

- el portal sigue siendo SVG inventado por codigo;
- Lía sigue siendo fallback inline, no asset real;
- falta micro-rig especifico;
- falta portal final;
- falta una metodologia de produccion visual;
- seguir puliendo con CSS sin assets reales no resolvera el problema principal.

## Regla de trabajo

- Codex no debe inventar arte fino.
- ChatGPT Images produce candidatos visuales.
- Photopea limpia, recorta, normaliza, organiza capas y exporta.
- Codex integra solo assets aprobados y documentados.
- Ningun asset generado pasa a runtime sin aprobacion explicita del usuario.

## Alcance de este paquete

Incluye:

- referencias canonicas existentes;
- brief de produccion;
- prompts para ChatGPT Images;
- pipeline Photopea;
- checklist de aceptacion;
- especificacion de micro-rig de Lía;
- especificacion de portal raiz;
- coreografia futura;
- requisitos de review board.

No incluye:

- animacion implementada;
- assets runtime nuevos;
- conexion real con Portada;
- navegacion a Mundo I;
- cambios de Carga Inicial o Portada.

## Estado recomendado

`ART_DIRECTION_PACK_T003E0 / READY_FOR_ASSET_PRODUCTION / NO_RUNTIME_ASSETS`

## Uso

1. Revisar `CANONICAL_REFERENCES.md`.
2. Generar candidatos con `CHATGPT_IMAGES_PROMPTS_ROOT.md`.
3. Limpiar y normalizar con `PHOTOPEA_PIPELINE_ROOT.md`.
4. Revisar contra `ASSET_ACCEPTANCE_CHECKLIST_ROOT.md`.
5. Aprobar assets antes de cualquier ticket funcional.
