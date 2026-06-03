# GVO - Mundo I: Raiz
## Matriz de faltantes Lia, FX y soportes visuales 004D-8B

## 0. Estado

Estado:

`004D-8B_GAP_MAP_DOCUMENTAL / SIN_RUNTIME / SIN_ASSETS_NUEVOS`

Este mapa lista faltantes tecnico-artisticos para una futura implementacion de Mundo I. No genera assets, no descarga recursos y no modifica `/estacion/1`.

## 1. Resumen de brechas

La biblioteca actual de Lia sirve para definir identidad, motion de referencia y algunos patrones de rig. No contiene aun microposes especificas para Mundo I ni FX de teletransporte, particulas ambientales o flujo constante de raices.

Prioridades:

- Alta: microposes de Lia y teletransporte.
- Alta: foco local de raiz seleccionada.
- Alta: flujo de raiz activa.
- Media: particulas ambientales.
- Media: soporte visual de dialogo con raiz ampliada.
- Baja: fuentes externas publicas; solo documentables si hay licencia y trazabilidad.

## 2. Microposes faltantes

| Faltante | Prioridad | Base de referencia | Observaciones |
| --- | --- | --- | --- |
| `lia_root_idle` | Alta | `lia_pose_idle_v1`, rig idle Portada | Estado inicial junto a planta |
| `lia_root_invite_relation` | Alta | `lia_pose_greeting_v1` | Invita a seleccionar/observar primera raiz |
| `lia_root_point_relation` | Alta | `lia_pose_point_portal_1_v1` | Debe apuntar a RELACION sin parecer portal |
| `lia_root_look_perception` | Alta | `lia_pose_explain_calm_v1` | Mirada/atencion a planta o raiz central |
| `lia_root_guide_mediation` | Alta | `lia_pose_point_portal_1_v1` + `lia_transition_root_guide_2f` | Guia hacia MEDIACION |
| `lia_root_ready_continue` | Media | `lia_pose_explain_calm_v1` | Cierre sereno |
| `lia_root_exit` | Media | `lia_transition_root_exit_v1` | Salida hacia siguiente fase |
| `lia_root_dematerialize_start` | Alta | rig idle + collar/glow | Frame/estado de salida desde planta |
| `lia_root_materialize_near_relation` | Alta | rig idle + pose point | Aparicion lateral de RELACION |
| `lia_root_materialize_near_perception` | Alta | rig idle + explain calm | Aparicion lateral de PERCEPCION |
| `lia_root_materialize_near_mediation` | Alta | rig idle + guide | Aparicion lateral de MEDIACION |
| `lia_root_explain_relation_detail` | Media | pose explain calm | Dialogo detallado especifico |
| `lia_root_explain_perception_detail` | Media | pose explain calm | Dialogo detallado especifico |
| `lia_root_explain_mediation_detail` | Media | pose explain calm | Dialogo detallado especifico |

Regla:

Ninguna microposicion debe crearse sin referencia aprobada y ticket de generacion/edicion visual.

## 3. Efectos faltantes para teletransporte

| Faltante | Prioridad | Posible soporte | Criterio |
| --- | --- | --- | --- |
| Desmaterializacion de Lia | Alta | CSS opacity/scale + glow | Sin pop duro |
| Materializacion junto a raiz | Alta | CSS opacity + sombra + particulas | Entrada elegante |
| Glow de collar elevado | Alta | Reutilizar `lia_rig_glow_collar_v1` o CSS | Coherente con identidad |
| Sombra de aparicion | Media | `lia_rig_shadow_soft_v1` o overlay futuro | Ancla visual |
| Motes de traslado | Media | CSS/JS propio o sprite futuro | Baja densidad |
| Hold de llegada | Media | CSS timing | Evita sensacion amateur |

No permitido:

- Explosion magica.
- Destellos rapidos.
- Audio.
- Video.
- Dependencia externa.

## 4. Particulas ambientales faltantes

| Faltante | Prioridad | Implementacion futura posible | Restriccion |
| --- | --- | --- | --- |
| Motes doradas lentas | Media | CSS/JS propio | Baja densidad |
| Luciernagas abstractas | Media | CSS o sprite generado despues | Sin saturar |
| Particulas de teletransporte | Media | CSS/JS propio o overlay PNG | Solo cerca de Lia |
| Reduced motion variant | Alta | Estado estatico/oculto | Obligatorio |

Calidad esperada:

- Movimiento muy lento.
- Opacidad baja.
- Encendido/apagado suave.
- No cubrir dialogo ni nodos.

## 5. Apoyos visuales para foco y raiz ampliada

| Faltante | Prioridad | Posible soporte | Observaciones |
| --- | --- | --- | --- |
| Escala local de raiz | Alta | CSS transform por capa | No zoom global |
| Mascara/foco de raiz | Alta | CSS mask/overlay futuro | Mantener escena visible |
| Glow de raiz activa | Alta | PNG/WebP overlay o SVG local | Flujo constante |
| Fondo contextual de dialogo | Alta | Estado visual de raiz ampliada | No reemplaza pantalla |
| Atenuacion del resto | Media | Opacity/vignette | Sin oscurecer demasiado |
| Hit area DOM de raiz | Alta | Boton real | No raster interactivo |

Regla directiva:

> El elemento no se acerca con la camara, sino que aumenta su escala dentro de la composicion.

## 6. Flujo constante de raices activas

Faltantes:

- Overlay de flujo por RELACION.
- Overlay de flujo por PERCEPCION.
- Overlay de flujo por MEDIACION.
- Timing diferenciado por estado.
- Variante reduced motion estable.

Opciones tecnicas futuras:

| Enfoque | Ventaja | Riesgo |
| --- | --- | --- |
| PNG/WebP glow animado por opacidad | Conserva estilo organico | Puede verse estatico si no hay mascara |
| SVG local con stroke | Flujo real por recorrido | Puede verse demasiado vectorial |
| CSS mask sobre glow | Controlable y local | Complejidad visual |
| Sprite/overlay generado despues | Look organico consistente | Requiere asset nuevo aprobado |

## 7. Observaciones de reutilizacion

| Fuente | Reutilizacion recomendada | Prioridad |
| --- | --- | --- |
| Rig idle Portada | Ojos, collar, sombra, petalos, microvida | Alta |
| Poses Portada | Referencia para gesto/explicacion | Alta |
| Transicion Lia | Escala compacta y economia de frames | Media |
| Carga Inicial | Timing, frame registration, suavidad | Media |
| CSS/JS propio | Particulas y fades locales | Media |
| Assets publicos externos | Solo opcion futura documentada | Baja |

Condicion para assets publicos externos:

- Licencia compatible.
- Integracion local.
- Sin CDN.
- Sin descarga automatica en runtime.
- Trazabilidad documental.
- Aprobacion explicita antes de integrar.

## 8. Prioridad consolidada

| Area | Prioridad | Motivo |
| --- | --- | --- |
| Microposes de Lia por raiz | Alta | La interaccion depende de guia clara |
| Teletransporte de Lia | Alta | Evita aparicion brusca |
| Foco por escalado local | Alta | Regla visual aprobada |
| Flujo de raiz activa | Alta | Evita imagen estatica |
| Particulas ambientales | Media | Eleva atmosfera si no satura |
| Soporte de dialogo contextual | Media | Mejora comprension |
| Assets externos | Baja | Solo si lo local no alcanza y con licencia |

## 9. Bloqueos

- No hay microposes especificas de Mundo I.
- No hay assets de teletransporte.
- No hay particulas ambientales propias de Mundo I.
- No hay overlays de flujo constante para raices activas.
- No hay definicion runtime de coordenadas o estados para raiz ampliada.

Estos bloqueos son documentales y no impiden cerrar 004D-8B, porque el ticket no implementa runtime.

## 10. Criterio de salida

004D-8B deja identificadas:

- La base visual recomendada de Lia.
- Los grupos de assets existentes que sirven o no sirven.
- La interaccion aprobada para seleccion de raices.
- Las brechas de microposes, FX, particulas y foco local.

Estado:

`004D-8B_GAP_MAP_COMPLETADO / MUNDO_I_LIA_ASSETS_PENDIENTES`
