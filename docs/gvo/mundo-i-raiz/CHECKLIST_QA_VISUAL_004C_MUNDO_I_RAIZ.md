# GVO - Mundo I: Raiz
## Checklist QA visual 004C

## 0. Uso del checklist

Este checklist evalua candidatos visuales futuros para Mundo I: Raiz antes de aprobarlos como assets runtime.

Uso previsto:

- Revisar cada familia de assets por separado.
- Detectar errores de identidad, composicion, accesibilidad y animabilidad.
- Decidir si un candidato se rechaza, requiere ajustes o puede avanzar.
- Evitar que una imagen fusionada entre a runtime como solucion final.

Este documento no implementa Mundo I, no crea assets y no modifica `/estacion/1`.

## 1. Criterios globales de aceptacion

Un paquete visual candidato debe cumplir:

- Mobile-first 9:16.
- Estilo organico, calido, subterraneo y sobrio.
- Coherencia con GVO, Portada / Intro y Transicion.
- Produccion por capas.
- Sin texto incrustado en imagenes.
- Sin audio, video, recursos externos ni CDN.
- Sin tecnologia prematura como sensores, ESP32, MIDI, routers o cables.
- Lia consistente con referencia aprobada.
- Planta joven, sana y no espectacular.
- Raices organicas y animables.
- Tres nodos conceptuales claros.
- Espacio suficiente para DOM/CSS de dialogos, labels y boton.
- Reduced motion posible sin rehacer arte.

## 2. Criterios de rechazo inmediato

Rechazar sin ajustes menores si hay:

- Texto quemado en imagen.
- Nodos con texto no editable.
- Botones como imagen final.
- Lia redisenada.
- Lia como hada.
- Lia con rasgos humanos nuevos.
- Planta cantando.
- Notas musicales.
- Componentes tecnicos visibles.
- Raices como cables electricos.
- Fondo demasiado saturado.
- Ausencia de capas.
- Falta de transparencia donde aplica.
- Assets imposibles de animar.
- Composicion no mobile-first.
- Bajo contraste extremo.
- Exceso de particulas.
- Assets pesados sin justificacion.
- Inconsistencia fuerte entre estados.
- Uso de CDN, recurso externo o fuente remota.
- Video o audio runtime.

## 3. Checklist fondo base

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Vertical 9:16 |  |  |
| Atmosfera subterranea calida |  |  |
| Oscuro/dorado sin saturacion |  |  |
| Sin texto |  |  |
| Sin Lia |  |  |
| Sin nodos fusionados |  |  |
| Sin boton/UI |  |  |
| Espacio superior para planta |  |  |
| Espacio medio para raices/nodos |  |  |
| Espacio inferior para DOM |  |  |
| No parece cueva generica saturada |  |  |
| No muestra sensores/cables |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_COMO_BASE`

## 4. Checklist luz ambiental

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Overlays transparentes |  |  |
| Glow calido y bajo |  |  |
| Halo bajo planta separado |  |  |
| No usa blur pesado |  |  |
| No parece magia explosiva |  |  |
| Puede animarse por opacidad |  |  |
| Tiene version reduced-motion estable |  |  |
| No tapa textos futuros |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_COMO_BASE`

## 5. Checklist planta joven

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Planta joven, no adulta |  |  |
| Sana y fragil |  |  |
| Sin rostro |  |  |
| Sin canto/notas musicales |  |  |
| Sin comportamiento magico |  |  |
| Recorte limpio |  |  |
| Transparencia correcta |  |  |
| Compatible con fondo y raices |  |  |
| No domina toda la pantalla |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_COMO_BASE`

## 6. Checklist raices

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Raices organicas |  |  |
| No son cables ni circuitos |  |  |
| Raiz base separada |  |  |
| Raiz RELACION separada |  |  |
| Raiz PERCEPCION separada |  |  |
| Raiz MEDIACION separada |  |  |
| Glows separados |  |  |
| Estados available/active/completed posibles |  |  |
| No hay movimiento visual sugerido excesivo |  |  |
| No saturan la composicion |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_PARA_RUNTIME`

## 7. Checklist nodos

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Tres nodos claros |  |  |
| Sin texto incrustado |  |  |
| Espacio para label DOM |  |  |
| Estado locked visible |  |  |
| Estado available visible |  |  |
| Estado active visible |  |  |
| Estado completed visible |  |  |
| Tamano tactil viable |  |  |
| No parecen botones tecnicos modernos |  |  |
| No usan iconografia de sensores/audio/red |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_PARA_RUNTIME`

## 8. Checklist Lia

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Usa referencia aprobada |  |  |
| Identidad conservada |  |  |
| No es hada |  |  |
| No tiene rasgos humanos nuevos |  |  |
| Escala consistente entre microposes |  |  |
| Transparencia limpia |  |  |
| `lia_root_idle` correcta |  |  |
| `lia_root_invite_relation` correcta |  |  |
| `lia_root_point_relation` correcta |  |  |
| `lia_root_look_perception` correcta |  |  |
| `lia_root_guide_mediation` correcta |  |  |
| `lia_root_ready_continue` correcta |  |  |
| `lia_root_exit` correcta |  |  |
| Guia sin dominar la escena |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_PARA_RUNTIME`

## 9. Checklist camino luminoso

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Es sutil |  |  |
| No es portal dominante |  |  |
| No es carretera literal |  |  |
| No parece cable |  |  |
| Tiene estado base |  |  |
| Tiene estado activo |  |  |
| Puede animarse por opacidad |  |  |
| No tapa nodos ni texto |  |  |
| Funciona en reduced motion |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_COMO_BASE`

## 10. Checklist composicion integrada

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Planta, raices, nodos y Lia conviven |  |  |
| Centro visual claro |  |  |
| Tres conceptos se leen en orden |  |  |
| Espacio inferior para dialogo |  |  |
| Boton Continuar no invade escena |  |  |
| Camino de salida aparece como cierre |  |  |
| Sin saturacion de glow |  |  |
| Sin exceso de particulas |  |  |
| Sin texto quemado |  |  |
| Mobile 360px viable |  |  |
| Mobile 390px viable |  |  |
| Mobile 430px viable |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_COMO_BASE`

## 11. Checklist accesibilidad visual

| Criterio | Cumple | Observaciones |
| --- | --- | --- |
| Contraste suficiente para textos DOM |  |  |
| Areas tactiles previstas |  |  |
| Estados no dependen solo de color |  |  |
| Foco visible posible |  |  |
| Labels DOM no chocan con assets |  |  |
| Dialogo no tapa nodos clave |  |  |
| No hay flicker |  |  |
| No hay destellos rapidos |  |  |
| Reduced motion viable |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_PARA_RUNTIME`

## 12. Checklist reduced-motion

| Familia | Requisito | Cumple | Observaciones |
| --- | --- | --- | --- |
| Fondo | Estado estatico o fade simple |  |  |
| Luz | Sin respiracion continua intensa |  |  |
| Raices | Cambio de estado sin shimmer |  |  |
| Nodos | Active/completed estables |  |  |
| Lia | Pose estable o microvida minima |  |  |
| Camino salida | Aparicion simple |  |  |
| Particulas | Ocultas o estaticas |  |  |
| Textos | DOM legible sin movimiento |  |  |

Resultado sugerido:

`RECHAZADO / REQUIERE_AJUSTES / APROBADO_PARA_RUNTIME`

## 13. Matriz de puntuacion

Puntuacion de 1 a 10 por familia.

| Familia | Peso sugerido |
| --- | ---: |
| Fondo y atmosfera | 15% |
| Planta joven | 10% |
| Raices y origen | 20% |
| Nodos conceptuales | 15% |
| Lia | 15% |
| Luz ambiental | 10% |
| Camino de salida | 5% |
| Coherencia pedagogica | 10% |

Guia de lectura:

- 1-4: no usable.
- 5-6: base debil, requiere redireccion.
- 7-7.9: aprobable para avanzar con deuda documentada.
- 8-8.9: buena base para runtime.
- 9-10: candidato de cierre visual final.

Formula sugerida:

```txt
puntaje_total = suma(puntaje_familia * peso_familia)
```

## 14. Estados de aprobacion

Estados posibles:

```txt
RECHAZADO
REQUIERE_AJUSTES
APROBADO_COMO_BASE
APROBADO_PARA_RUNTIME
APROBADO_FINAL_VISUAL
```

Definiciones:

| Estado | Significado |
| --- | --- |
| `RECHAZADO` | Incumple reglas no negociables o rompe identidad |
| `REQUIERE_AJUSTES` | Tiene direccion util, pero necesita correccion |
| `APROBADO_COMO_BASE` | Puede orientar produccion, aun no runtime |
| `APROBADO_PARA_RUNTIME` | Puede pasar a ticket funcional de montaje |
| `APROBADO_FINAL_VISUAL` | Califica para cierre visual alto |

Condiciones minimas para `APROBADO_PARA_RUNTIME`:

- Sin criterios de rechazo inmediato.
- Capas separadas.
- Lia consistente.
- Textos fuera de imagen.
- Raices y nodos animables.
- Reduced motion viable.
- Puntaje total recomendado >= 7/10.
- Aprobacion visual explicita del usuario.

Nota operativa:

Codex puede documentar, organizar nombres, preparar manifiestos futuros y montar runtime cuando haya ticket funcional aprobado. Codex no produce arte final y no reemplaza la aprobacion visual del usuario.
