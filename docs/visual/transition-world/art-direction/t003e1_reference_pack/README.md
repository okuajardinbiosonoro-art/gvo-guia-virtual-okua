# T003E1A - Reference pack exportable para ChatGPT Images

## Qué contiene

Este paquete reúne copias controladas de referencias existentes para producir assets reales de la transición:

`Portada / Intro -> Mundo I: Raíz`

Contiene:

- referencias canónicas de Lía;
- rig existente por capas;
- portal/glow de Portada como referencia;
- referencias de estilo de Carga Inicial y Portada;
- capturas T003D como referencia negativa/parcial;
- prompts listos para usar;
- pasos siguientes para Photopea.

## Qué abrir primero

Abrir primero:

`HOW_TO_USE_WITH_CHATGPT_IMAGES.md`

Después revisar:

`REFERENCE_PACK_INDEX.md`

## Referencias canónicas

Usar como base principal:

- `00_lia_canonical/lia_canonical_primary.png`
- `00_lia_canonical/lia_canonical_cover_pose_idle.png`
- `02_portal_existing/portal_cover_frame_reference.png`
- `02_portal_existing/portal_cover_glow_reference.png`

## Referencias negativas/parciales

La carpeta `04_transition_current_negative/` contiene capturas T003D. No son target final. Sirven para recordar qué no basta:

- Lía fallback insuficiente;
- portal todavía no final;
- falta micro-rig;
- falta riqueza visual real.

## Qué adjuntar a ChatGPT Images

Primera ronda, Lía master:

- `00_lia_canonical/lia_canonical_primary.png`
- `00_lia_canonical/lia_canonical_cover_pose_idle.png`
- opcional: `00_lia_canonical/lia_canonical_cover_pose_point_portal.png`

No adjuntar en primera ronda:

- capturas T003D negativas;
- capturas con UI final;
- assets con texto;
- screenshots de QA con diálogos o botones.

## Regla de integración

Codex no debe usar estos assets automáticamente. Este paquete es insumo para generación y revisión. Todo candidato debe pasar por Photopea, contact sheet y aprobación explícita antes de entrar a runtime.
