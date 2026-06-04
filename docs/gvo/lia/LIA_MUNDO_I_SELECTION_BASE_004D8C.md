# GVO - Seleccion base de Lia para Mundo I
## Ticket 004D-8C

## 0. Estado

`004D-8C_SELECTION_BASE_DOCUMENTAL / SIN_RUNTIME / SIN_ASSETS_NUEVOS`

Este documento convierte la auditoria 004D-8B en una decision visual base para preparar microposes futuras de Lia en Mundo I: Raiz. No implementa `/estacion/1`, no crea assets, no modifica runtime y no cambia rutas.

## 1. Objetivo

Definir con evidencia cual set existente de Lia debe orientar la futura produccion de Mundo I, separando identidad, pose, rig, motion, escala, fallback y assets no recomendados.

## 2. Insumos revisados

- `public/assets/gvo/shared/lia/README_LIA_ASSETS.md`
- `public/assets/gvo/shared/lia/asset_manifest_lia_v1.json`
- `docs/gvo/lia/LIA_ASSET_LIBRARY_004D8A.md`
- `docs/gvo/lia/LIA_USAGE_MAP_004D8A.md`
- `docs/gvo/lia/LIA_MUNDO_I_AUDIT_004D8B.md`
- `docs/gvo/world-1/MUNDO_I_INTERACTION_UPDATE_004D8B.md`
- `docs/gvo/world-1/MUNDO_I_LIA_AND_EFFECTS_GAP_MAP_004D8B.md`
- `docs/gvo/lia/review-boards/LIA_MUNDO_I_CONTACT_SHEET_004D8C.html`
- `docs/gvo/lia/review-boards/LIA_MUNDO_I_CONTACT_SHEET_004D8C.md`

## 3. Criterios de seleccion

| Criterio | Descripcion |
| --- | --- |
| Identidad canonica | Mantiene la Lia aprobada |
| Coherencia con Mundo I | Funciona en mundo raiz |
| Escala movil | Se lee bien sin dominar |
| Potencial de animacion | Permite microvida y transicion |
| Compatibilidad con rig | Puede usarse por capas |
| Compatibilidad con teletransporte | Puede materializar/desmaterializar |
| Claridad de gesto | Puede guiar sin brazos/manos humanos |
| Limpieza de asset | Transparencia y recorte |
| Reduced-motion | Puede simplificarse sin perder sentido |

Escala documental usada:

```txt
APTO_BASE_MUNDO_I
APTO_REFERENCIA_IDENTIDAD
APTO_REFERENCIA_POSE
APTO_REFERENCIA_MOTION
APTO_REFERENCIA_ESCALA
APTO_FALLBACK
NO_RECOMENDADO_MUNDO_I
```

## 4. Comparacion por grupo

| Grupo | Identidad | Pose | Motion | Escala | Rig | Uso recomendado |
| --- | --- | --- | --- | --- | --- | --- |
| Carga Inicial | Parcial | Baja para Mundo I | Alta | Media | No | Solo timing y registro de frames |
| Portada / Intro - master | Alta | Alta | Media | Media | Parcial | Base visual e identidad canonica |
| Portada / Intro - poses | Alta | Alta | Media | Media | Parcial | Referencia de gestos y lenguaje |
| Portada / Intro - rig por capas | Alta | Media | Alta | Media | Alta | Base tecnica para microvida futura |
| Transicion entre mundos | Media | Media | Alta | Alta | No | Referencia compacta y fallback |
| Mundo I futuro | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Aun no existe; requiere aprobacion visual |

## 5. Base visual recomendada

Base principal recomendada:

```txt
lia_master_cover_reference_v1.png
+ rig idle por capas de Portada / Intro
```

Justificacion:

- Es el set mas cercano a la identidad aprobada de Lia.
- Conserva cabeza/visor opalescente, ojos media luna, cinco petalos principales, collar ambar, bulbo inferior segmentado y presencia calmada.
- El rig idle permite separar microvida, blink, collar/glow, sombra y petalos sin inventar una identidad nueva.
- Las poses de Portada ayudan a disenar gestos de invitacion, guia y explicacion.

Referencias secundarias:

- Motion compacta: `lia_transition_root_master_v1`, `lia_transition_root_idle_4f_v1`, `lia_transition_root_guide_2f_v1`, `lia_transition_root_exit_v1`.
- Timing / registro de frames: `lia_loading_16f.png`.

Restricciones:

- No usar Carga Inicial como identidad visual principal de Mundo I.
- No usar assets de Transicion como unica base si pierden detalle o expresion.
- No insertar poses de Portada como runtime directo de Mundo I sin ticket funcional, ajuste de escala y aprobacion visual.

## 6. Assets que si sirven

| Funcion | Asset o grupo | Clasificacion | Uso futuro |
| --- | --- | --- | --- |
| Identidad | `lia_master_cover_reference_v1.png` | `APTO_BASE_MUNDO_I`, `APTO_REFERENCIA_IDENTIDAD` | Referencia principal de Lia |
| Pose base | `lia_pose_idle_v1.png` | `APTO_REFERENCIA_POSE` | Base para `lia_root_idle` |
| Invitacion | `lia_pose_greeting_v1.png` | `APTO_REFERENCIA_POSE` | Referencia para `lia_root_invite_relation` |
| Explicacion | `lia_pose_explain_calm_v1.png` | `APTO_REFERENCIA_POSE` | Referencia para dialogos de raiz |
| Guia / senalamiento | `lia_pose_point_portal_1_v1.png` | `APTO_REFERENCIA_POSE` | Referencia para apuntar o guiar sin manos humanas |
| Energia / foco | `lia_pose_activate_portal_1_v1.png` | `APTO_REFERENCIA_POSE`, `APTO_FALLBACK` | Referencia de intencion, no de portal literal |
| Rig / microvida | rig idle de Portada | `APTO_BASE_MUNDO_I`, `APTO_REFERENCIA_MOTION` | Ojos, blink, collar, sombra, petalos |
| Escala compacta | assets de Transicion | `APTO_REFERENCIA_ESCALA`, `APTO_FALLBACK` | Guia de tamano y fallback controlado |
| Timing | `lia_loading_16f.png` | `APTO_REFERENCIA_MOTION` | Ritmo, registro y continuidad |

## 7. Assets que solo sirven como referencia

| Grupo | Motivo |
| --- | --- |
| `lia_loading_16f.png` | Tiene accion de riego y composicion propia de carga inicial; no corresponde a Mundo I. |
| Transicion PNG/WebP | Funcionan en pantalla breve y compacta; no alcanzan para dialogo detallado. |
| `lia_pose_activate_portal_1_v1.png` | Comunica activacion de portal; debe traducirse a raiz para no mezclar semanticas. |
| Capturas y paquetes documentales duplicados | Son evidencia historica; no deben duplicarse como runtime. |

## 8. Assets que no conviene usar directamente

| Asset o grupo | Clasificacion | Riesgo |
| --- | --- | --- |
| `lia_loading_16f.png` como runtime de Mundo I | `NO_RECOMENDADO_MUNDO_I` | Haría que Mundo I herede lectura de riego/carga inicial. |
| Transicion como unica base de Lia | `NO_RECOMENDADO_MUNDO_I` | Puede perder detalle, expresion y consistencia con la Lia canonica. |
| Poses de Portada sin adaptacion | `NO_RECOMENDADO_MUNDO_I` | Pueden verse grandes, fuera de contexto o demasiado ligadas al portal. |
| Assets generados sin esta base | `NO_RECOMENDADO_MUNDO_I` | Alto riesgo de cambiar identidad de Lia. |

## 9. Microposes necesarias para Mundo I

Estas microposes/estados no se generan en este ticket. Quedan documentadas para produccion futura:

```txt
lia_root_idle
lia_root_invite_relation
lia_root_point_relation
lia_root_look_perception
lia_root_guide_mediation
lia_root_ready_continue
lia_root_exit
lia_root_dematerialize_start
lia_root_dematerialize_mid
lia_root_materialize_relation
lia_root_materialize_perception
lia_root_materialize_mediation
```

Lectura esperada:

- `relation`: invitacion y guia suave hacia relacion viva.
- `perception`: mirada atenta hacia senales sutiles.
- `mediation`: gesto de acompanamiento, no de explicacion tecnica.
- `exit` y dematerializacion: transicion sutil sin desaparecer de golpe.

## 10. Reglas de consistencia visual

- No hacer Lia humana.
- No agregar brazos, manos, piernas, pies, boca, nariz o cejas.
- No convertirla en hada.
- No convertirla en mascota.
- Conservar 5 petalos principales.
- Conservar cabeza/visor opalescente.
- Conservar ojos en media luna.
- Conservar collar/anillo ambar.
- Conservar presencia calmada.
- No hacer gestos exagerados.
- Mantener textos como DOM/CSS cuando corresponda.
- No usar assets inventados como base final.

## 11. Riesgos si se genera Lia sin esta base

- Perdida de identidad canonica entre pantallas.
- Gestos demasiado humanos o demasiado caricaturescos.
- Escala incorrecta junto a raices y dialogos.
- Teletransporte con pop brusco o lectura de efecto magico exagerado.
- Uso de la Lia de carga como si fuera la Lia de Mundo I.
- Duplicacion innecesaria de runtime o assets equivalentes.
- Inconsistencia con reduced-motion si no se piensa por capas.

## 12. Decision pendiente del usuario

Queda pendiente la aprobacion visual explicita del usuario sobre esta seleccion base antes de generar microposes nuevas para Mundo I.

Decision documental actual:

```txt
BASE_RECOMENDADA: Portada / Intro canonical + rig idle por capas
REFERENCIA_MOTION: Carga Inicial + Transicion entre mundos
REFERENCIA_ESCALA: Transicion entre mundos
MICROPOSES_MUNDO_I: PENDIENTES / NO_GENERADAS
```

## 13. Confirmacion de alcance

- `/estacion/1` sin cambios.
- Runtime sin cambios.
- Imports sin cambios.
- No nuevos assets artisticos.
- No dependencias nuevas.
- No URLs externas.
- No CDN.
- No audio.
- No video.
