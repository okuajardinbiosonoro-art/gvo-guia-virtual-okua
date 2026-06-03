# GVO - Auditoria visual de Lia para Mundo I: Raiz
## Ticket 004D-8B

## 0. Estado

Estado:

`004D-8B_AUDITORIA_LIA_DOCUMENTAL / SIN_RUNTIME / SIN_ASSETS_NUEVOS`

Esta auditoria compara los assets existentes de Lia en el repo y en la biblioteca central creada por 004D-8A. No modifica runtime, no modifica `/estacion/1`, no genera microposes nuevas y no reemplaza assets aprobados.

Base revisada:

- `public/assets/gvo/shared/lia/asset_manifest_lia_v1.json`.
- `public/assets/gvo/shared/lia/README_LIA_ASSETS.md`.
- `docs/gvo/lia/LIA_ASSET_LIBRARY_004D8A.md`.
- `docs/gvo/lia/LIA_USAGE_MAP_004D8A.md`.
- `docs/gvo/mundo-i-raiz/CONTRATO_ASSETS_ANIMACION_004B_MUNDO_I_RAIZ.md`.
- `docs/gvo/mundo-i-raiz/PREPRODUCCION_VISUAL_004C_MUNDO_I_RAIZ.md`.

## 1. Resumen ejecutivo

La mejor base visual para Lia en Mundo I es el paquete de Portada / Intro, especialmente:

- `lia_master_cover_reference_v1.png` como identidad canonica.
- `lia_pose_idle_v1.png` como pose base de presencia inicial junto a la planta.
- `lia_pose_point_portal_1_v1.png` como referencia de gesto de guia/senalamiento.
- El rig idle de Portada / Intro como fuente tecnica para microanimacion por capas: ojos, blink, collar/glow, sombra, petalos, flotacion y pequenos desplazamientos.

Los assets de Transicion entre mundos sirven como referencia de escala compacta y spritesheet breve, pero no como base principal para Mundo I porque estan optimizados para una transicion corta junto al portal, no para dialogos detallados al lado de raices ampliadas.

El spritesheet de Carga Inicial sirve como referencia de motion/timing y registro de frames, pero no conviene reutilizarlo directamente como runtime de Mundo I: contiene accion de riego y composicion propia de la carga inicial.

Mundo I todavia necesita microposes especificas y efectos propios para:

- estado inicial de Lia junto a la planta;
- desaparicion y teletransporte hacia la raiz seleccionada;
- guia lateral de RELACION, PERCEPCION y MEDIACION;
- dialogo detallado con raiz ampliada como fondo contextual;
- cierre listo para continuar.

## 2. Inventario util revisado

Resumen de biblioteca 004D-8A:

| Grupo | Cantidad | Uso principal |
| --- | ---: | --- |
| Carga Inicial | 1 | Spritesheet de riego y motion reference |
| Portada / Intro | 22 | Identidad canonica, poses, rig por capas |
| Transicion entre mundos | 8 | Escala compacta, spritesheets cortos, salida |
| Candidatos visuales detectados por busqueda | 56 | Incluye runtime, referencias y capturas |
| Grupos duplicados/equivalentes por hash | 22 | Principalmente copias canonicas documentales |

Carpetas revisadas:

- `public/assets/gvo/shared/lia/current-used/carga-inicial/`.
- `public/assets/gvo/shared/lia/current-used/portada-intro/`.
- `public/assets/gvo/shared/lia/current-used/transition-world/`.
- `public/assets/gvo/shared/lia/approved/`.
- `public/assets/gvo/shared/lia/future/mundo-i-raiz/`.

Estado de carpetas futuras:

| Carpeta | Estado |
| --- | --- |
| `approved/` | Vacia salvo `.gitkeep` |
| `future/mundo-i-raiz/` | Vacia salvo `.gitkeep`; no hay microposes de Mundo I |

## 3. Analisis comparativo por grupo de assets

### 3.1 Carga Inicial

Asset:

- `lia_loading_16f.png`.

Utilidad:

| Criterio | Resultado |
| --- | --- |
| Identidad canonica | Parcial |
| Referencia de pose | Baja para Mundo I |
| Referencia de animacion | Alta |
| Runtime reutilizable | No recomendado |
| Uso para Mundo I | Solo referencia documental |

Lectura:

- Tiene valor para estudiar continuidad, frame registration, flotacion y timing.
- Esta amarrado a accion de riego, agua y carga inicial.
- Puede contaminar el lenguaje de Mundo I si se usa directamente.

Decision:

`NO_RUNTIME_DIRECTO / REFERENCIA_DE_MOTION`

### 3.2 Portada / Intro

Assets principales:

- `lia_master_cover_reference_v1.png`.
- `lia_pose_idle_v1.png`.
- `lia_pose_greeting_v1.png`.
- `lia_pose_explain_calm_v1.png`.
- `lia_pose_point_portal_1_v1.png`.
- `lia_pose_activate_portal_1_v1.png`.
- Rig idle por capas: sombra, cuerpo, petalos, collar, glow, cabeza y ojos.

Utilidad:

| Criterio | Resultado |
| --- | --- |
| Identidad canonica | Alta |
| Referencia de pose | Alta |
| Referencia de animacion | Alta en rig idle |
| Runtime reutilizable | Parcial, solo con ticket funcional |
| Uso para Mundo I | Base visual recomendada |

Lectura:

- Es el set mas completo y coherente para conservar identidad.
- El rig idle permite microvida sin redisenar.
- Las capas de ojos, collar y sombra son especialmente utiles para una Lia que aparece junto a una raiz seleccionada.
- Las poses de senalamiento pueden guiar el diseno de `lia_root_point_relation`, `lia_root_look_perception` y `lia_root_guide_mediation`.

Riesgo:

- Las poses de Portada son grandes y estan asociadas a Portal I; no deben insertarse sin adaptar escala, foco y composicion.
- La pose `activate_portal` comunica activacion de portal, no necesariamente raiz; sirve como energia/intencion, no como runtime directo de Mundo I.

Decision:

`BASE_CANONICA_RECOMENDADA / REQUIERE_MICROPOSES_MUNDO_I`

### 3.3 Transicion entre mundos

Assets principales:

- `lia_transition_root_master_v1.png/.webp`.
- `lia_transition_root_idle_4f_v1.png/.webp`.
- `lia_transition_root_guide_2f_v1.png/.webp`.
- `lia_transition_root_exit_v1.png/.webp`.

Utilidad:

| Criterio | Resultado |
| --- | --- |
| Identidad canonica | Media |
| Referencia de pose | Media |
| Referencia de animacion | Alta para sprite breve |
| Runtime reutilizable | No recomendado para dialogo principal |
| Uso para Mundo I | Referencia de escala/motion compacto |

Lectura:

- Funciona para transicion breve, pequena y lateral al portal.
- El spritesheet de guia de 2 frames es util como referencia de economia de movimiento.
- No tiene variedad suficiente para dialogos detallados ni para teletransporte hacia tres raices.

Decision:

`REFERENCIA_DE_ESCALA_Y_SPRITE / NO_BASE_PRINCIPAL`

## 4. Recomendacion de base visual para Mundo I

Base visual recomendada:

`Portada / Intro canonical + rig idle por capas`

Combinacion sugerida para diseno futuro:

| Necesidad de Mundo I | Base recomendada |
| --- | --- |
| Identidad de Lia | `lia_master_cover_reference_v1.png` |
| Presencia inicial junto a planta | `lia_pose_idle_v1.png` + rig idle |
| Gestos de guia | `lia_pose_point_portal_1_v1.png` como referencia |
| Mirada/explicacion calmada | `lia_pose_explain_calm_v1.png` como referencia |
| Microvida | Rig idle de Portada: ojos, blink, collar, petalos, sombra |
| Escala compacta | Transicion root como referencia secundaria |
| Timing | Carga Inicial y Transicion como referencias tecnicas |

Proporciones y lenguaje a heredar:

- Lia debe seguir siendo pequena o media, no protagonista dominante.
- Exactamente cinco petalos.
- Cabeza cristal opalescente.
- Ojos media luna.
- Collar ambar luminoso.
- Bulbo inferior segmentado.
- Cuerpo no humano.
- Sin boca, nariz, cejas, brazos, manos, piernas, pies ni alas.

## 5. Assets que sirven, no sirven o sirven como referencia

| Grupo | Sirve para Mundo I | Modo de uso |
| --- | --- | --- |
| Master de Portada | Si | Identidad canonica y referencia principal |
| Poses de Portada | Si, parcialmente | Referencia de pose y direccion visual |
| Rig idle Portada | Si | Base tecnica de microanimacion por capas |
| Transicion root Lia | Parcial | Referencia de escala compacta y sprite breve |
| Carga Inicial Lia | Parcial | Referencia de timing/frame registration |
| Capturas de validacion | No | Solo evidencia historica |
| Paquetes documentales canonicos duplicados | Si, como referencia | No duplicar runtime; usar hash/equivalencia |
| `future/mundo-i-raiz/` | Aun no | Preparada para assets futuros |

## 6. Microposes nuevas requeridas

Las microposes futuras no existen todavia y no se generaron en este ticket.

Microposes minimas:

```txt
lia_root_idle
lia_root_invite_relation
lia_root_point_relation
lia_root_look_perception
lia_root_guide_mediation
lia_root_ready_continue
lia_root_exit
```

Microposes adicionales recomendables para la interaccion aprobada:

```txt
lia_root_dematerialize_start
lia_root_materialize_near_relation
lia_root_materialize_near_perception
lia_root_materialize_near_mediation
lia_root_explain_relation_detail
lia_root_explain_perception_detail
lia_root_explain_mediation_detail
```

Nota:

Las microposes deben generarse despues con referencia aprobada, no desde cero ni por interpretacion libre.

## 7. FX y soportes visuales faltantes

Faltan assets/soportes para:

- Desmaterializacion de Lia en posicion inicial.
- Materializacion elegante al lado de la raiz seleccionada.
- Particulas doradas suaves compatibles con mundo raiz.
- Glow puntual de Lia durante teletransporte.
- Sombra o ancla visual de aparicion.
- Mascara/foco local para raiz seleccionada.
- Flujo luminoso constante sobre raiz activa.
- Estados visuales de raiz ampliada como fondo contextual.

Estos efectos pueden resolverse con CSS/JS propio, sprites/overlays futuros o una combinacion. No se integran en este ticket.

## 8. Reutilizacion tecnica posible

| Fuente | Reutilizable | Condicion |
| --- | --- | --- |
| Rig idle Portada | Si | Usar capas, no redisenar |
| Ojos/blink Portada | Si | Microvida y atencion |
| Collar/glow Portada | Si | Pulso sutil, no magia excesiva |
| Sombra Portada | Si | Ancla de flotacion/materializacion |
| Transicion sprites | Parcial | Escala y economia de frames |
| Carga Inicial spritesheet | Parcial | Timing y registro, no runtime directo |
| CSS/JS particles propios | Si | Baja densidad, local, sin dependencia |
| Assets publicos externos | Solo documental futuro | Licencia compatible, integracion local, sin CDN |

## 9. Riesgos

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Reusar pose de Portada sin adaptar | Lia parece fuera de escena | Crear microposes Mundo I |
| Teletransporte con `pop` duro | Sensacion amateur | Usar glow, fade, particulas y sombra |
| Raiz ampliada como zoom global | Rompe composicion aprobada | Escalar elemento, no camara |
| Usar Transicion como base principal | Lia queda demasiado pequena/simple | Usarla solo como referencia secundaria |
| Usar Carga Inicial como runtime | Se mezcla accion de riego | Usarla solo como referencia de motion |
| Exceso de particulas | Satura la estacion | Baja densidad y reduced motion |

## 10. Criterio de salida de la auditoria

La auditoria deja como decision:

- Base visual principal: Portada / Intro canonical + rig idle.
- Referencias tecnicas secundarias: Transicion y Carga Inicial.
- Runtime directo actual para Mundo I: ninguno aprobado todavia.
- Faltantes: microposes especificas, FX de teletransporte, particulas ambientales, foco local y flujo de raiz activa.

Estado:

`004D-8B_LIA_AUDIT_COMPLETADA / MUNDO_I_SIN_RUNTIME_LIA`
