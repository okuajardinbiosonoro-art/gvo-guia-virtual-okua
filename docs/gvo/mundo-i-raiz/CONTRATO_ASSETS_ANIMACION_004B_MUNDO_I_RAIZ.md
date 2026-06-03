# GVO - Mundo I: Raiz
## Contrato avanzado de assets, capas, estados visuales, animacion y limites tecnicos
### Ticket 004B

## 0. Estado del documento

Estado:

`CONTRATO_004B_DOCUMENTAL / SIN_IMPLEMENTACION_RUNTIME / SIN_ARTE_FINAL`

Este documento define el contrato tecnico y visual para preparar Mundo I: Raiz. No implementa la pantalla, no crea assets finales, no modifica `/estacion/1` y no declara Mundo I como implementado.

Base documental:

- Auditoria previa: `docs/gvo/mundo-i-raiz/AUDITORIA_004A_MUNDO_I_RAIZ.md`.
- Commit de auditoria versionada: `8c14460 docs(gvo): add Mundo I Raiz 004A audit`.
- Estado previo requerido: `004A1_CERRADO / MAIN_LIMPIO / AUDITORIA_004A_VERSIONADA / ORIGIN_ACTUALIZADO`.

## 1. Proposito de Mundo I

Mundo I: Raiz es una estacion narrativa, conceptual y fundacional.

Su funcion no es explicar tecnologia. Su funcion es preparar la mirada del visitante antes de que el recorrido hable de sensores, MIDI, ESP32, red o sistema central.

Idea central:

> OKUA nace de una pregunta sobre la relacion con una planta viva, no de un deseo de espectaculo.

La estacion debe comunicar:

- Una planta no debe entenderse solo como adorno.
- La vida vegetal puede estar activa aunque no la percibamos directamente.
- OKUA no busca inventar una voz para la planta.
- OKUA propone una mediacion para percibir de otra manera.
- Antes de escuchar, necesitamos aprender a mirar.

Frase central:

> Antes de escuchar, necesitamos aprender a mirar.

Secuencia pedagogica obligatoria:

`RELACION -> PERCEPCION -> MEDIACION -> Continuar`

## 2. Alcance del contrato

Este contrato define:

- Capas visuales necesarias.
- Assets obligatorios y opcionales.
- Estados visuales por asset.
- Estados funcionales de la estacion.
- Reglas para nodos conceptuales.
- Reglas para raices animables.
- Reglas para fondo y luz ambiental.
- Reglas para Lia y sus microposes.
- Reglas para dialogos, textos DOM/CSS y boton Continuar.
- Reglas de accesibilidad y reduced motion.
- Rutas y nombres sugeridos para assets futuros.
- Limites reales por herramienta.
- Riesgos, mitigaciones, bloqueos y checklist de aceptacion.

Este contrato no autoriza implementacion runtime. La futura implementacion debe partir de assets aprobados y separados por capas.

## 3. Restricciones de implementacion

Restricciones no negociables:

- No modificar `/estacion/1` en este ticket.
- No reemplazar `StationPlaceholder`.
- No crear componentes React de Mundo I.
- No crear assets artisticos finales.
- No generar imagenes.
- No inventar Lia.
- No inventar portal, planta, raices, nodos ni fondo final.
- No usar CDN.
- No cargar recursos externos.
- No agregar audio.
- No agregar video runtime pesado.
- No agregar dependencias.
- No modificar rutas existentes.
- No modificar Transicion actual.
- No modificar Carga Inicial, Portada ni Transicion.
- No tocar logica de navegacion existente.
- No hacer cambios visuales en runtime.
- No convertir una imagen de referencia en runtime final.
- No quemar textos finales dentro de imagen.
- No crear un sistema de progreso persistente nuevo sin contrato posterior.
- No cerrar la pantalla.
- No declarar Mundo I como implementado.

## 4. Principios visuales

Mundo I debe sentirse como una raiz conceptual y sensible, no como una interfaz tecnica.

Principios:

- Organico, sobrio, calido y mobile-first.
- Oscuro calido o subterraneo suave, no cueva saturada.
- Acentos pixelart coherentes con GVO, sin convertir todo en retro duro.
- Raices como guia conceptual, no como cables electricos.
- Nodos claros y pocos: exactamente tres.
- Lia pequena o media, como guia de observacion, no protagonista dominante.
- Texto breve, legible y editable.
- Animacion ambiental minima y lenta.
- Sin exceso de particulas.
- Sin audio, sin video, sin recursos externos.

Lo que no debe aparecer:

- ESP32.
- MIDI.
- Wi-Fi/UDP.
- Router.
- Sistema central.
- Parlantes.
- Notas musicales.
- Graficas tecnicas.
- Paneles de senal.
- Planta cantando.
- Humanos.
- Varios avatares.
- Lia como hada.

## 5. Composicion base esperada

Composicion conceptual mobile 9:16:

- Parte superior: planta joven o brote, con luz tenue.
- Zona media/subterranea: sistema de raices con tres recorridos conceptuales.
- Nodos: tres anclas visuales asociadas a RELACION, PERCEPCION y MEDIACION.
- Lia: cerca de planta o a un lateral, acompanando la observacion.
- Dialogo de Lia: panel DOM/CSS vinculado visualmente a Lia, no imagen.
- Boton Continuar: DOM/CSS, visible pero bloqueado hasta completar conceptos.
- Camino luminoso: discreto, orientado hacia salida a Mundo II, solo activo al final.

La escena debe conservar espacio para texto y controles sin tapar la planta, raices ni nodos.

## 6. Inventario maestro de assets

### 6.1 Assets obligatorios

| ID contractual | Asset esperado | Formato recomendado | Separacion obligatoria | Motivo |
| --- | --- | --- | --- | --- |
| `world1_root_background_base` | Fondo base subterraneo sin texto, sin Lia, sin nodos y sin boton | WebP/PNG | Si | Permite atmosfera sin interferir con UI |
| `world1_root_ambient_glow` | Gradiente/luz calida respirando | PNG/WebP transparente o CSS | Si | Permite animacion suave por opacidad |
| `world1_root_plant_young` | Planta joven superior central | PNG/WebP transparente | Preferible | Permite brillo o enfasis sutil |
| `world1_root_roots_base` | Sistema de raices apagado | PNG/WebP transparente o SVG | Si | Estado neutro de estacion |
| `world1_root_root_relation` | Raiz izquierda/lateral para RELACION | PNG/WebP transparente o SVG | Si | Activacion conceptual 1 |
| `world1_root_root_perception` | Raiz central para PERCEPCION | PNG/WebP transparente o SVG | Si | Activacion conceptual 2 |
| `world1_root_root_mediation` | Raiz derecha para MEDIACION | PNG/WebP transparente o SVG | Si | Activacion conceptual 3 |
| `world1_root_glow_relation` | Brillo dorado para RELACION | PNG/WebP transparente | Si | Animacion separada |
| `world1_root_glow_perception` | Brillo dorado para PERCEPCION | PNG/WebP transparente | Si | Animacion separada |
| `world1_root_glow_mediation` | Brillo dorado para MEDIACION | PNG/WebP transparente | Si | Animacion separada |
| `world1_root_nodes_base` | Marcos o anclas visuales de nodos | PNG/WebP/SVG | Si | Alineacion visual con botones DOM |
| `world1_root_node_relation` | Nodo visual RELACION | PNG/WebP/SVG | Si | Boton interactivo |
| `world1_root_node_perception` | Nodo visual PERCEPCION | PNG/WebP/SVG | Si | Boton interactivo |
| `world1_root_node_mediation` | Nodo visual MEDIACION | PNG/WebP/SVG | Si | Boton interactivo |
| `world1_root_exit_path_base` | Camino luminoso tenue | PNG/WebP/SVG | Si | Preparacion de salida |
| `world1_root_exit_path_active` | Camino luminoso activo | PNG/WebP/SVG | Si | Solo aparece al final |
| `lia_root_idle` | Lia idle Mundo I | PNG/WebP/spritesheet | Si | Guia visual separada |
| `lia_root_invite_relation` | Lia invita a Relacion | PNG/WebP | Si | Direccion narrativa |
| `lia_root_point_relation` | Lia acompana RELACION | PNG/WebP | Si | Concepto 1 |
| `lia_root_look_perception` | Lia mira planta/raiz central | PNG/WebP | Si | Concepto 2 |
| `lia_root_guide_mediation` | Lia guia MEDIACION | PNG/WebP | Si | Concepto 3 |
| `lia_root_ready_continue` | Lia lista para continuar | PNG/WebP | Si | Cierre de estacion |
| `lia_root_exit` | Lia acompana salida | PNG/WebP | Si | Handoff a Mundo II |

### 6.2 Assets opcionales

| ID contractual | Asset esperado | Uso | Condicion |
| --- | --- | --- | --- |
| `world1_root_particles_soft` | Particulas minimas | Polvo/luz sutil | Solo si no satura |
| `world1_root_vignette_focus` | Vineta/mask de enfoque | Legibilidad y foco | Debe ser suave |
| `world1_root_node_halo` | Halo por nodo | Estado activo/focus | Puede resolverse en CSS |
| `world1_root_separator_ornament` | Separador ornamental | Panel/dialogo | Solo si aporta claridad |
| `world1_root_icon_station` | Icono superior Estacion I | Identidad de pantalla | SVG/local, sin texto incrustado |

## 7. Contrato de capas

Capas minimas obligatorias:

| Capa | Asset esperado | Separacion obligatoria | Motivo |
| --- | --- | ---: | --- |
| Fondo base | Mundo subterraneo oscuro calido | Si | Permite atmosfera sin interferir con nodos/textos |
| Gradiente ambiental | Luz calida respirando | Si | Permite animacion suave por CSS/opacidad |
| Planta joven | Planta superior central | Preferible | Permite brillo o enfasis sutil |
| Raices base | Sistema de raices apagado | Si | Estado neutro de la estacion |
| Raiz Relacion | Rama/recorrido izquierdo | Si | Activacion conceptual 1 |
| Raiz Percepcion | Rama/recorrido central | Si | Activacion conceptual 2 |
| Raiz Mediacion | Rama/recorrido derecho | Si | Activacion conceptual 3 |
| Glow Relacion | Brillo dorado asociado | Si | Animacion separada |
| Glow Percepcion | Brillo dorado asociado | Si | Animacion separada |
| Glow Mediacion | Brillo dorado asociado | Si | Animacion separada |
| Nodos base | Marcos o anclas visuales | Si | DOM accesible encima o alineado |
| Nodo Relacion | Estado visual por concepto | Si | Boton interactivo |
| Nodo Percepcion | Estado visual por concepto | Si | Boton interactivo |
| Nodo Mediacion | Estado visual por concepto | Si | Boton interactivo |
| Camino luminoso | Salida hacia Mundo II | Si | Solo debe activarse al final |
| Lia | Guia visual separada | Si | Microposes y estados |
| Sombra/glow de Lia | Capa decorativa controlada | Si | Evita contaminar sprite |
| Particulas minimas | Polvo/luz sutil | Opcional | Solo si no satura |
| Mascara/vineta | Enfoque visual | Opcional | Control de legibilidad |

Reglas de separacion:

- Textos fuera de imagen.
- Nodos como botones DOM.
- Ventanas de Lia como DOM/CSS.
- Boton Continuar como DOM/CSS.
- Lia como asset independiente.
- Raices activables por separado.
- Glows como overlays independientes.
- Camino luminoso independiente.
- Fondo no dependiente de animacion pesada.
- Mockups fusionados solo como referencia visual o contact sheet, nunca runtime final.

## 8. Contrato de fondo animable

El fondo de Mundo I tambien debe animarse. No basta con animar Lia.

### 8.1 Elementos de fondo animables

- Respiracion de luz ambiental.
- Variacion leve de opacidad en gradiente dorado.
- Particulas minimas y discretas.
- Vineta o halo central.
- Glow bajo la planta.
- Brillo bajo tierra.
- Shimmer muy sutil en raices no activas.
- Fade de entrada desde Transicion.
- Fade o apertura minima hacia salida posterior.

### 8.2 Elementos que no deben animarse en exceso

- Planta creciendo.
- Raices moviendose como cables electricos.
- Particulas abundantes.
- Blur intenso.
- Zoom agresivo de camara.
- Fondos en video.
- Desplazamientos grandes de capas.
- Destellos rapidos.

### 8.3 Implementacion tecnica futura recomendada

En una fase posterior puede implementarse con:

- CSS keyframes sobre capas PNG/WebP.
- SVG local para trazos de raiz si se necesita `stroke-dashoffset`.
- Mascaras CSS simples si son viables.
- Opacidad y transformaciones minimas.
- `prefers-reduced-motion`.

Este ticket solo documenta. No implementa animacion.

## 9. Contrato de planta joven

La planta joven debe actuar como centro sensible de la escena.

Requisitos:

- Debe estar separada del fondo o tener zona de brillo preparada.
- No debe parecer planta adulta final.
- No debe cantar, hablar ni producir notas musicales.
- Puede tener brillo leve o respiracion de luz.
- No debe crecer de forma marcada durante esta estacion.
- Debe conectar visualmente con el sistema de raices.

Estados visuales sugeridos:

| Estado | Descripcion | Animacion permitida |
| --- | --- | --- |
| idle | planta visible y serena | respiracion minima de luz |
| concept_active | planta recibe atencion del concepto | glow muy leve |
| completed | planta queda estable | brillo bajo fijo |
| reduced-motion | estado fijo | sin respiracion |

## 10. Contrato de raices animables

Las raices son el centro visual y conceptual de Mundo I.

Requisitos:

1. Raices base visibles, apagadas o tenues.
2. Raiz asociada a RELACION.
3. Raiz asociada a PERCEPCION.
4. Raiz asociada a MEDIACION.
5. Glow separado para cada raiz.
6. Estado pendiente.
7. Estado disponible.
8. Estado activo.
9. Estado completado.
10. Estado reduced-motion.

### 10.1 Estados visuales de raices

| Estado | Descripcion visual | Animacion permitida |
| --- | --- | --- |
| pending | raiz tenue | ninguna o respiracion minima |
| available | leve realce | opacidad suave |
| active | recorrido luminoso | pulso o stroke local |
| completed | brillo bajo estable | sin pulso fuerte |
| blocked | muy tenue | ninguna |
| reduced-motion | cambio fijo de opacidad/borde | sin recorridos |

### 10.2 Activacion conceptual

- RELACION: raiz izquierda o lateral, brillo desde planta hacia relacion.
- PERCEPCION: raiz central, brillo subiendo hacia planta.
- MEDIACION: raiz derecha, conexion hacia camino de salida.

Reglas:

- No hacer que las raices parezcan cables electricos.
- No usar luz neon saturada.
- No animar todas las raices al mismo tiempo.
- No usar un unico glow global si cada concepto debe activarse por separado.

## 11. Contrato de nodos conceptuales

Los nodos conceptuales deben ser tres y solo tres:

1. `RELACION`
2. `PERCEPCION`
3. `MEDIACION`

Deben funcionar como botones accesibles.

### 11.1 Estados funcionales de nodos

| Nodo | Primera pasada | Revision libre |
| --- | --- | --- |
| Relacion | disponible desde inicio | disponible |
| Percepcion | bloqueado hasta completar Relacion | disponible |
| Mediacion | bloqueado hasta completar Percepcion | disponible |

### 11.2 Estados visuales de nodos

| Estado | Descripcion |
| --- | --- |
| locked | tenue, sin enfasis, no activo |
| available | visible, invitacion sutil |
| active | pulso suave, glow dorado |
| completed | brillo bajo estable |
| disabled | no interactivo, accesible como bloqueado |
| focus-visible | borde claro por teclado/accesibilidad |

### 11.3 Reglas

- No agregar mas de tres nodos.
- No convertir nodos en decoracion sin funcion.
- No quemar texto de nodos en imagen si se requiere accesibilidad.
- Se permite apoyo visual en PNG/SVG, pero el label final debe ser DOM o accesible.
- Cada nodo debe tener hit-area adecuada en movil.
- Cada nodo debe tener estado anunciado.
- No depender solo del color para diferenciar estados.

## 12. Contrato de Lia en Mundo I

Lia debe actuar como guia de observacion.

No es operadora tecnica. No activa maquinas. No explica sensores. No debe parecer hada. No debe dominar la escena.

### 12.1 Microposes minimas requeridas

| ID sugerido | Uso | Descripcion |
| --- | --- | --- |
| `lia_root_idle` | idle inicial | Lia flota calmada cerca de la planta |
| `lia_root_invite_relation` | invitacion inicial | Lia orienta atencion hacia Relacion |
| `lia_root_point_relation` | concepto 1 | Lia senala o acompana nodo Relacion |
| `lia_root_look_perception` | concepto 2 | Lia mira hacia planta/raiz central |
| `lia_root_guide_mediation` | concepto 3 | Lia guia hacia Mediacion |
| `lia_root_ready_continue` | listo | Lia mira hacia camino de salida |
| `lia_root_exit` | salida | Lia acompana transicion hacia Mundo II |

### 12.2 Reglas de movimiento

- Flotacion sutil.
- Inclinaciones minimas.
- Desplazamientos cortos.
- No vuelos amplios por toda la pantalla.
- No cambios bruscos de PNG completos.
- No deformar identidad.
- No agregar brazos, manos, piernas, rostro humano, boca, nariz o cejas.
- Mantener cinco petalos.
- Mantener cabeza opalescente, ojos media luna, collar ambar y bulbo inferior.

### 12.3 Limitacion tecnica

Si no existen microposes, una implementacion futura solo podria usar:

- sprite idle aprobado como fallback parcial;
- transformaciones CSS muy leves;
- sin inventar estados visuales nuevos.

Esto debe tratarse como deuda, no como solucion final.

## 13. Contrato de ventanas de dialogo

Las ventanas de dialogo deben ser DOM/CSS, no imagen.

Reglas:

- Una ventana a la vez.
- Maximo 2 o 3 lineas.
- Sin scroll.
- Tono claro y fundacional.
- Sin tecnicismos.
- Sin repetir completo el texto fijo.
- Conectada visualmente con Lia.
- Accesible para lectores de pantalla.
- Con `aria-live` o patron equivalente.
- Sin texto quemado en fondos.

Mensajes sugeridos:

| Momento | Mensaje sugerido |
| --- | --- |
| Inicial | `Empecemos por la raiz de OKUA.` |
| Inicial alterno | `Antes de escuchar, miremos de donde nace esta pregunta.` |
| Relacion | `Primero esta la relacion: mirar la planta como vida, no como decoracion.` |
| Percepcion | `Estar quieta no significa estar inactiva. A veces necesitamos aprender a percibir.` |
| Mediacion | `La mediacion no inventa la vida de la planta: ayuda a percibirla.` |
| Continuar bloqueado | `Primero miremos las raices de esta pregunta.` |
| Continuar bloqueado alterno | `Aun falta una idea antes de seguir.` |
| Revision libre | `Puedes volver a mirar cualquiera de estas raices.` |

## 14. Contrato de textos DOM/CSS

Los textos finales deben ser DOM/CSS.

Textos base:

- `ESTACION I`
- `MUNDO I - RAIZ`
- `Origen y proposito`
- `RELACION`
- `PERCEPCION`
- `MEDIACION`
- `OKUA nace de una pregunta sobre la relacion con una planta viva, no de un deseo de espectaculo.`
- `La mediacion no inventa la vida de la planta: ayuda a percibirla.`
- `Antes de escuchar, necesitamos aprender a mirar.`
- `Continuar`

Reglas:

- No quemar textos en imagen.
- No depender de una captura fusionada.
- Mantener legibilidad movil.
- Evitar texto tecnico extenso.
- Evitar saturacion visual.
- Asegurar contraste.
- Usar Pixelify Sans local solo donde funcione para identidad o UI corta.
- Usar stack legible local para textos largos si la lectura lo exige.

## 15. Contrato de boton Continuar

El boton `Continuar` debe existir como DOM/CSS.

Estados:

| Estado | Descripcion |
| --- | --- |
| disabled_initial | visible pero atenuado |
| blocked_feedback | muestra mensaje de Lia si se toca antes de completar |
| enabled | activo despues de tres conceptos |
| pressed | respuesta visual breve |
| exiting | inicia salida hacia transicion |
| reduced_motion | sin brillo animado; cambio fijo |

Reglas:

- En primera pasada, Continuar no debe avanzar hasta completar los tres conceptos.
- Puede estar visible desde el inicio, pero deshabilitado.
- Debe ser accesible.
- Debe indicar estado deshabilitado.
- Al habilitarse puede ganar brillo dorado suave.
- No debe activar Mundo II si la transicion posterior no existe.
- No debe ser imagen.

## 16. Contrato de camino luminoso de salida

El camino luminoso hacia la derecha representa preparacion para la siguiente estacion.

Debe estar:

- apagado o muy tenue al inicio;
- parcialmente sugerido durante Mediacion;
- activo cuando los tres conceptos esten completos;
- asociado al estado `station1_ready_to_continue`;
- conectado visualmente con Lia y el boton Continuar.

No debe ser:

- carretera literal;
- portal nuevo inventado;
- luz excesiva;
- efecto magico saturado;
- salida a Mundo II implementada sin ticket.

## 17. Estados funcionales de la estacion

Tipo documentado para una implementacion futura:

```ts
type Station1State =
  | "station1_entering"
  | "station1_idle"
  | "station1_relation_available"
  | "station1_relation_active"
  | "station1_relation_completed"
  | "station1_perception_available"
  | "station1_perception_active"
  | "station1_perception_completed"
  | "station1_mediation_available"
  | "station1_mediation_active"
  | "station1_mediation_completed"
  | "station1_ready_to_continue"
  | "station1_exiting"
  | "station1_revisit_mode";
```

No implementar este tipo en codigo durante 004B.

## 18. Estados visuales por concepto

| Concepto | Estado inicial | Estado activo | Estado completado | Relacion visual |
| --- | --- | --- | --- | --- |
| RELACION | disponible | raiz izquierda iluminada | brillo bajo estable | planta como vida, no decoracion |
| PERCEPCION | bloqueado | raiz central iluminada | brillo bajo estable | actividad no siempre perceptible |
| MEDIACION | bloqueado | raiz derecha iluminada | brillo bajo estable | ayuda a percibir, no inventa vida |

Reglas:

- Un solo concepto activo a la vez.
- El concepto activo debe modificar nodo, raiz y dialogo.
- El concepto completado debe quedar visible sin pulso fuerte.
- En reduced motion, el cambio debe ser fijo y comprensible.

## 19. Secuencia de primera pasada

1. Entra Mundo I.
2. Fondo aparece.
3. Planta aparece iluminada.
4. Raices base se revelan suavemente.
5. Lia aparece cerca de planta.
6. Nodos aparecen en baja intensidad.
7. Lia invita a tocar Relacion.
8. Usuario toca RELACION.
9. Se activa raiz/nodo Relacion.
10. Lia muestra dialogo breve.
11. Se completa Relacion.
12. Se desbloquea PERCEPCION.
13. Usuario toca PERCEPCION.
14. Se activa raiz/nodo Percepcion.
15. Lia muestra dialogo breve.
16. Se completa Percepcion.
17. Se desbloquea MEDIACION.
18. Usuario toca MEDIACION.
19. Se activa raiz/nodo Mediacion.
20. Se completa Mediacion.
21. Boton Continuar queda activo.
22. Camino luminoso gana presencia.
23. Usuario toca Continuar.
24. La estacion prepara salida hacia transicion a Mundo II.

## 20. Revision libre

Despues de completar la estacion o si existe estado persistente futuro:

- Los tres conceptos pueden revisarse libremente.
- Continuar puede estar activo desde el inicio.
- Lia puede mostrar mensaje breve de revision.
- No se fuerza orden.
- No se repite toda la secuencia inicial.
- La revision libre debe seguir siendo accesible.

Este ticket solo documenta el contrato. No implementa persistencia.

## 21. Reduced motion

Con `prefers-reduced-motion`:

- Lia no debe desplazarse ampliamente.
- Raices no deben usar recorridos largos.
- Particulas en movimiento se desactivan.
- Glows pasan a cambios de opacidad fijos.
- Nodos usan borde/estado estable.
- Salida usa fade simple.
- Comprension pedagogica se mantiene.
- No hay loops intensos.
- No hay parpadeos rapidos.
- No hay zoom de camara.

Alternativa por estado:

| Elemento | Motion normal | Reduced motion |
| --- | --- | --- |
| Fondo | respiracion lenta | opacidad fija |
| Raiz activa | pulso o recorrido local | estado iluminado fijo |
| Nodo activo | pulso suave | borde/fill estable |
| Lia | flotacion minima | pose fija |
| Particulas | pocas y lentas | apagadas |
| Salida | fade/camino activo | fade simple |

## 22. Accesibilidad

Requisitos:

- Cada nodo como boton accesible.
- Nombre claro.
- Estado anunciado.
- Bloqueos anunciados.
- Ventana de Lia anunciable.
- Boton Continuar con estado disabled claro.
- Foco visible.
- No depender solo del color.
- Hit areas aptas para movil.
- Textos DOM legibles.
- Orden logico de navegacion.
- Decoracion con `aria-hidden`.
- Estado activo comunicado por texto/ARIA, no solo glow.

Labels sugeridos:

- `Relacion. Idea uno de tres. Disponible.`
- `Percepcion. Idea dos de tres. Bloqueada hasta completar Relacion.`
- `Mediacion. Idea tres de tres. Bloqueada hasta completar Percepcion.`
- `Continuar. Completa las tres ideas para avanzar.`
- `Continuar a Mundo II.`

## 23. Formatos, rutas y nombres de archivos

Rutas futuras sugeridas. No crear estas carpetas durante 004B.

```txt
public/assets/gvo/stations/world-1-root/
  background/
  roots/
  nodes/
  lia/
  light/
  particles/
  exit-path/
  manifests/
```

Archivos sugeridos como contrato:

```txt
world1_root_background_base_v1.webp
world1_root_ambient_glow_v1.png
world1_root_plant_young_v1.png
world1_root_roots_base_v1.png
world1_root_root_relation_v1.png
world1_root_root_perception_v1.png
world1_root_root_mediation_v1.png
world1_root_glow_relation_v1.png
world1_root_glow_perception_v1.png
world1_root_glow_mediation_v1.png
world1_root_node_relation_base_v1.png
world1_root_node_perception_base_v1.png
world1_root_node_mediation_base_v1.png
world1_root_exit_path_base_v1.png
world1_root_exit_path_active_v1.png
lia_root_idle_v1.png
lia_root_invite_relation_v1.png
lia_root_point_relation_v1.png
lia_root_look_perception_v1.png
lia_root_guide_mediation_v1.png
lia_root_ready_continue_v1.png
lia_root_exit_v1.png
```

Manifest futuro sugerido como esquema documental:

```txt
world1_root_asset_manifest_v1.json
```

Campos minimos recomendados para manifest futuro:

```json
{
  "screen": "world-1-root",
  "version": "v1",
  "status": "contract_defined",
  "assets": [
    {
      "id": "world1_root_background_base",
      "type": "background",
      "path": "background/world1_root_background_base_v1.webp",
      "required": true,
      "state": "base",
      "textless": true,
      "runtimeReady": false
    }
  ]
}
```

No crear manifest durante 004B.

## 24. Limites tecnicos por herramienta

### CSS/DOM

Adecuado para:

- Opacidad.
- Transform.
- Fade.
- Respiracion de luz.
- Estados de boton.
- Estados de nodos.
- Reduced motion.
- Composicion responsive.

Limitado para:

- Animar trazos organicos complejos si estan fusionados.
- Deformaciones pixelart finas.
- Morphing de raices.
- Efectos complejos sin costo visual.

### SVG local

Adecuado para:

- Rutas de raices si se quiere `stroke-dashoffset`.
- Mascaras simples.
- Lineas vectoriales suaves.
- Iconos locales.

Limitado para:

- Conservar pixelart si el estilo final exige raster puro.
- Organico con textura si no se disena cuidadosamente.
- Evitar lectura de red electrica.

### PNG/WebP transparentes

Adecuado para:

- Capas visuales.
- Glows.
- Sprites de Lia.
- Raices raster.
- Fondo optimizado.

Limitado para:

- Animacion de recorrido si no hay capas separadas.
- Estados interactivos si todo esta fusionado.
- Escalado excesivo en movil.

### Photopea

Adecuado para:

- Organizar PSD por grupos.
- Exportar capas.
- Generar contact sheets.
- Recortar assets.
- Preparar transparentes.

Limitado para:

- Animacion runtime.
- Validacion de accesibilidad.
- Logica interactiva.
- Produccion automatica de estados complejos.

### Generacion de imagenes

Adecuada para:

- Candidatos visuales.
- Fondos.
- Piezas base.
- Variaciones controladas.

Limitada para:

- Consistencia perfecta entre estados.
- Separacion limpia si el prompt no la exige.
- Microposes coherentes de Lia.
- Assets tecnicos finales sin revision manual.

### Runtime local offline

Adecuado para:

- Assets locales.
- DOM/CSS.
- SVG local.
- PNG/WebP optimizado.

Limitado por:

- Tamano de assets.
- Rendimiento movil.
- Exceso de blur.
- Exceso de capas.
- Dependencias externas prohibidas.

## 25. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Imagen fusionada como runtime | Bloquea estados y accesibilidad | Separar capas desde preproduccion |
| Textos quemados | Mala accesibilidad y mantenimiento | DOM/CSS |
| Nodos decorativos | Pierde interaccion pedagogica | Botones accesibles |
| Lia decorativa | Pierde rol narrativo | Microposes y dialogos |
| Animar placeholders | Baja calidad visual | No implementar hasta tener assets |
| Fondo estatico pobre | Mundo sin vida | Capas de luz y ambiente |
| Fondo demasiado animado | Saturacion y fatiga | Animacion lenta y minima |
| Raices como cables electricos | Error conceptual | Brillo organico sutil |
| Exceso de particulas | Ruido visual | Particulas opcionales y minimas |
| Reutilizacion debil de Lia | Incoherencia visual | Microposes especificas |
| Falta de reduced-motion | Accesibilidad incompleta | Estados alternativos |
| Assets pesados | Bajo rendimiento movil | WebP/PNG optimizados |
| Inventar Mundo II | Adelanto indebido | Solo documentar salida generica |

## 26. Checklist de aceptacion visual previa

- [ ] Existe referencia visual aprobada de Mundo I.
- [ ] La referencia no contiene textos finales quemados.
- [ ] La escena expresa raiz, relacion, percepcion y mediacion sin tecnicismos.
- [ ] Fondo no parece bosque magico saturado.
- [ ] Planta no canta ni emite notas musicales.
- [ ] Raices se leen organicas, no electricas.
- [ ] Solo hay tres nodos conceptuales.
- [ ] Lia conserva identidad aprobada.
- [ ] Lia no parece hada, humana ni operadora tecnica.
- [ ] Boton Continuar tiene ubicacion clara.
- [ ] Camino luminoso no se confunde con portal nuevo.
- [ ] Hay version o estados reduced-motion pensados.

## 27. Checklist de aceptacion tecnica previa

- [ ] Assets separados por capas.
- [ ] Fondo base textless.
- [ ] Raices separadas por concepto.
- [ ] Glows separados por concepto.
- [ ] Nodos visuales separados o definibles con CSS/SVG.
- [ ] Botones DOM previstos para nodos.
- [ ] Dialogos DOM/CSS previstos.
- [ ] Boton Continuar DOM/CSS previsto.
- [ ] Lia separada.
- [ ] Microposes de Lia definidas.
- [ ] Nombres de archivo consistentes.
- [ ] Peso de assets revisado.
- [ ] Manifest futuro definido antes de integrar.
- [ ] Validador de assets futuro definido antes de integrar.
- [ ] Sin CDN, sin recursos externos, sin audio, sin video runtime pesado.

## 28. Bloqueos antes de implementacion

No implementar Mundo I hasta resolver:

- Falta de assets por capas.
- Falta de referencia visual aprobada para Mundo I.
- Falta de raices separadas.
- Falta de nodos con estados.
- Falta de microposes de Lia.
- Falta de camino luminoso de salida.
- Falta de contrato de manifest runtime.
- Falta de validador de assets Mundo I.
- Falta de decision sobre SVG vs raster para raices animables.
- Falta de criterio visual para reduced-motion.

## 29. Criterio de salida de 004B

004B se considera completo cuando:

- Existe este documento.
- No se modifico runtime.
- No se modifico `/estacion/1`.
- No se crearon assets finales.
- No se agregaron dependencias.
- Fondo animable queda documentado con el mismo rigor que Lia.
- Raices, nodos, Lia, dialogos, Continuar y camino de salida quedan especificados.
- Accesibilidad y reduced-motion quedan definidos.
- Limites por herramienta quedan documentados.
- Riesgos y bloqueos quedan visibles.
- Los checks disponibles del repo pasan o quedan reportados honestamente.

Resultado esperado:

`004B_CONTRATO_DOCUMENTAL_COMPLETO / MUNDO_I_SIN_IMPLEMENTACION_RUNTIME`
