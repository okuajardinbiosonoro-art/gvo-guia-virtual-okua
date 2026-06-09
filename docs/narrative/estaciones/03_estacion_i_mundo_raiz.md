# Estación I — Mundo I: Raíz

![Referencia visual](../visual_refs/03_estacion_i_mundo_raiz.png)

**Especificación fuente:** `../source_txt/03_estacion_i_mundo_raiz_especificacion_v1.txt`

## 1. Función de la estación dentro de GVO

Mundo Raiz funda la logica del recorrido. Antes de explicar sonido, senal, captura, red o sistema tecnico, la pantalla ubica al visitante frente a una planta viva y le propone observarla desde tres operaciones: relacion, percepcion y mediacion.

La estacion no busca resolver como funciona toda la tecnologia de OKUA. Su tarea es preparar una actitud de lectura: mirar la planta como origen vivo, reconocer que hay procesos que no siempre se ven a simple vista y comprender que toda escucha dentro de GVO requiere una mediacion cuidadosa.

## 2. Idea central para el visitante

Antes de intentar escuchar una planta, el visitante aprende a reconocer que toda escucha requiere una relacion, una forma de percepcion y una mediacion cuidadosa.

Esta idea puede resolverse con libertad autoral. La ficha no impone estilo literario; define la funcion que debe cumplir cada texto para que la pantalla sea clara, legible en movil y coherente con el recorrido.

## 3. Qué debe comprender el visitante

- La planta es el origen vivo de la experiencia.
- La raiz representa vinculo e invisibilidad.
- Observar tambien es participar.
- No todo lo vivo es evidente a simple vista.
- Lia no reemplaza a la planta: acompana la interpretacion.
- OKUA no presenta magia ni musica directa de las plantas, sino una experiencia mediada.

## 4. Qué no debe concluir el visitante

- Que la planta canta literalmente.
- Que la planta tiene intencion humana.
- Que Lia es una persona, nina, hada o mascota.
- Que el sistema ya esta explicando toda la cadena tecnica.
- Que tocar nodos es solo un juego decorativo.
- Que la mediacion tecnologica reemplaza a la planta.

## 5. Descripción visual para escritura

La pantalla se piensa para una lectura vertical movil. En la zona superior y media aparece una planta joven como centro vivo de la escena. Desde ella o hacia ella se perciben raices luminosas, lineas organicas y conexiones suaves que sugieren actividad subterranea, vinculo e inicio.

Tres nodos conceptuales organizan la accion: RELACION, PERCEPCION y MEDIACION. No deben leerse como botones decorativos, sino como pasos de comprension. Lia aparece como guia visual unica: acompana, senala, orienta y ayuda a interpretar sin convertirse en personaje humano ni explicar todavia toda la tecnica.

El fondo debe entenderse como un entorno organico/subterraneo. La sensacion general es de inicio, cuidado y descubrimiento: el visitante entra a la raiz del recorrido, no a una explicacion tecnica completa.

## 6. Mapa semántico de la pantalla

| Elemento visual | Qué representa para escritura | Qué no representa |
| --- | --- | --- |
| Planta joven | Origen vivo | Adorno |
| Raices | Vinculos invisibles | Cableado tecnico literal |
| RELACION | Primer vinculo de observacion | Emocion romantica/humana |
| PERCEPCION | Atencion a lo no evidente | Poder magico |
| MEDIACION | Interpretacion cuidadosa | Reemplazo de la planta |
| Lia | Guia de lectura | Humana, hada, mascota |

## 7. Contrato de interacción

- Primera visita: orden secuencial obligatorio `RELACIÓN → PERCEPCIÓN → MEDIACIÓN`.
- Revision posterior: puede permitirse relectura o revision mas libre si el runtime lo define despues.
- Tocar el nodo correcto activa estado visual y texto asociado.
- Tocar un nodo bloqueado muestra bloqueo suave, sin castigo narrativo.
- Tocar fuera de los nodos no debe generar regano, error tecnico ni perdida de progreso.
- Completar los tres nodos habilita cierre y avance hacia transicion/Mundo II.
- La estacion no debe exigir audio para entender la experiencia.

## 8. Secuencia narrativa por estados

| Orden | Estado | Acción del visitante | Cambio visible esperado | Función narrativa |
| --- | --- | --- | --- | --- |
| 0 | `w1_intro` | Entra a estacion | Mundo raiz visible | Presentar origen |
| 1 | `w1_relacion_available` | Toca RELACIÓN | Nodo/raiz de relacion se activa | Introducir vinculo |
| 2 | `w1_relacion_active` | Lee respuesta | Luz o enfasis en relacion | Confirmar primer hallazgo |
| 3 | `w1_percepcion_available` | Toca PERCEPCIÓN | Nodo disponible | Dirigir atencion |
| 4 | `w1_percepcion_active` | Lee respuesta | Luz/enfasis en percepcion | Mostrar lo invisible |
| 5 | `w1_mediacion_available` | Toca MEDIACIÓN | Nodo disponible | Preparar interpretacion |
| 6 | `w1_mediacion_active` | Lee respuesta | Luz/enfasis en mediacion | Cerrar triada |
| 7 | `w1_complete` | Toca continuar | Estado completo | Pasar a Mundo II |
| X | `w1_node_locked` | Toca nodo fuera de orden | Sin avance fuerte | Orientar sin frustrar |

## 9. Estados de pantalla y necesidades de texto

### `w1_intro`

- Que ve el visitante: planta joven, raices, tres nodos conceptuales y Lia como guia.
- Que acaba de hacer: viene de Portada/Transicion y entra por primera vez al Mundo Raiz.
- Que debe entender: OKUA empieza por mirar una planta viva antes de hablar de sonido o tecnica.
- Emisor sugerido: Lia y ambiente.
- Texto requerido: entrada de Lia y apoyo ambiental breve.
- Longitud sugerida: 70-160 caracteres por pieza.
- Evitar: explicar sensores, prometer audio o llamar a la planta decoracion.

### `w1_relacion_available`

- Que ve el visitante: el nodo RELACIÓN esta disponible como primer paso.
- Que acaba de hacer: entro a la estacion o termino de leer la entrada.
- Que debe entender: el primer gesto es reconocer un vinculo con la planta.
- Emisor sugerido: Lia.
- Texto requerido: instruccion o pista para activar RELACIÓN.
- Longitud sugerida: 40-90 caracteres.
- Evitar: orden mecanica, tono de juego o emocion romantica.

### `w1_relacion_active`

- Que ve el visitante: RELACIÓN y su raiz asociada se activan.
- Que acaba de hacer: toco el nodo correcto.
- Que debe entender: observar la planta implica relacionarse con una vida que no es adorno.
- Emisor sugerido: ambiente y confirmacion breve de Lia.
- Texto requerido: respuesta ambiental y confirmacion funcional.
- Longitud sugerida: 50-130 caracteres por pieza.
- Evitar: atribuir sentimientos humanos a la planta.

### `w1_percepcion_available`

- Que ve el visitante: PERCEPCIÓN queda disponible despues de RELACIÓN.
- Que acaba de hacer: completo el primer concepto.
- Que debe entender: ahora debe atender a lo que no se ve de inmediato.
- Emisor sugerido: Lia.
- Texto requerido: instruccion o pista para activar PERCEPCIÓN.
- Longitud sugerida: 40-90 caracteres.
- Evitar: sugerir poderes magicos o vision sobrenatural.

### `w1_percepcion_active`

- Que ve el visitante: PERCEPCIÓN se ilumina o recibe enfasis visual.
- Que acaba de hacer: activo el segundo nodo.
- Que debe entender: una planta puede parecer quieta y aun asi sostener actividad no evidente.
- Emisor sugerido: ambiente y confirmacion breve de Lia.
- Texto requerido: respuesta ambiental y confirmacion funcional.
- Longitud sugerida: 50-130 caracteres por pieza.
- Evitar: convertir la senal futura en musica directa.

### `w1_mediacion_available`

- Que ve el visitante: MEDIACIÓN queda disponible como tercer paso.
- Que acaba de hacer: completo relacion y percepcion.
- Que debe entender: falta comprender que interpretar no es reemplazar a la planta.
- Emisor sugerido: Lia.
- Texto requerido: instruccion o pista para activar MEDIACIÓN.
- Longitud sugerida: 40-90 caracteres.
- Evitar: explicar todavia ESP32, MIDI, router o cadena tecnica.

### `w1_mediacion_active`

- Que ve el visitante: MEDIACIÓN y su raiz se activan; la triada conceptual queda casi completa.
- Que acaba de hacer: activo el tercer nodo.
- Que debe entender: OKUA construye una forma mediada de acercarse a una vida, no una voz falsa de la planta.
- Emisor sugerido: ambiente y confirmacion breve de Lia.
- Texto requerido: respuesta ambiental y confirmacion funcional.
- Longitud sugerida: 50-140 caracteres por pieza.
- Evitar: decir que la tecnologia habla por la planta o la sustituye.

### `w1_node_locked`

- Que ve el visitante: un nodo fuera de orden no avanza.
- Que acaba de hacer: toco PERCEPCION o MEDIACION antes de tiempo, o repitio un nodo ya leido.
- Que debe entender: la secuencia tiene un orden de lectura, sin castigo.
- Emisor sugerido: Lia o sistema/interfaz.
- Texto requerido: bloqueo suave y mensaje de repeticion si aplica.
- Longitud sugerida: 35-90 caracteres.
- Evitar: regano, error tecnico o lenguaje de falla.

### `w1_complete`

- Que ve el visitante: tres nodos activados, raiz completa y boton de continuar habilitado.
- Que acaba de hacer: termino MEDIACION.
- Que debe entender: ya puede pasar al Mundo II, donde aparecera la senal bioelectrica como siguiente capa de comprension.
- Emisor sugerido: Lia, ambiente y sistema/interfaz.
- Texto requerido: cierre de Lia, cierre ambiental y boton continuar.
- Longitud sugerida: 60-150 caracteres para cierres; 1-4 palabras para boton.
- Evitar: adelantar toda la cadena tecnica o prometer audio.

## 10. Slots de texto requeridos

| ID | Estado | Emisor sugerido | Tipo de texto | Funcion | Longitud sugerida | Concepto obligatorio | Evitar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W1_INTRO_LIA_01 | `w1_intro` | Lia | Entrada | Presentar el origen vivo de OKUA | 90-160 caracteres | Planta viva / origen | Tecnica avanzada |
| W1_INTRO_AMB_01 | `w1_intro` | Ambiente | Texto ambiental | Situar raiz y observacion | 50-110 caracteres | Raiz / cuidado | Decoracion |
| W1_RELACION_HINT_01 | `w1_relacion_available` | Lia | Instruccion contextual | Invitar a activar RELACIÓN | 40-90 caracteres | Relacion | Orden agresiva |
| W1_RELACION_AMB_01 | `w1_relacion_active` | Ambiente | Respuesta ambiental | Conectar planta y visitante desde el vinculo | 50-120 caracteres | Relacion | Emocion humana literal |
| W1_RELACION_CONFIRM_01 | `w1_relacion_active` | Lia | Confirmacion breve | Confirmar primer hallazgo | 40-90 caracteres | Observacion / vinculo | Juego decorativo |
| W1_PERCEPCION_HINT_01 | `w1_percepcion_available` | Lia | Instruccion contextual | Invitar a activar PERCEPCIÓN | 40-90 caracteres | Percepcion | Poder magico |
| W1_PERCEPCION_AMB_01 | `w1_percepcion_active` | Ambiente | Respuesta ambiental | Mostrar actividad no evidente | 50-120 caracteres | Percepcion | Planta que canta |
| W1_PERCEPCION_CONFIRM_01 | `w1_percepcion_active` | Lia | Confirmacion breve | Confirmar atencion a lo invisible | 40-90 caracteres | Lo no evidente | Sobrenatural |
| W1_MEDIACION_HINT_01 | `w1_mediacion_available` | Lia | Instruccion contextual | Invitar a activar MEDIACIÓN | 40-90 caracteres | Mediacion | Cadena tecnica completa |
| W1_MEDIACION_AMB_01 | `w1_mediacion_active` | Ambiente | Respuesta ambiental | Preparar interpretacion sin reemplazo | 50-130 caracteres | Mediacion | Sustituir la planta |
| W1_MEDIACION_CONFIRM_01 | `w1_mediacion_active` | Lia | Confirmacion breve | Cerrar la triada conceptual | 40-100 caracteres | Experiencia mediada | Voz falsa de la planta |
| W1_NODE_LOCKED_01 | `w1_node_locked` | Lia o sistema | Bloqueo suave | Orientar al nodo correcto | 35-90 caracteres | Secuencia pedagogica | Regano |
| W1_NODE_REPEAT_01 | `w1_node_locked` | Lia o sistema | Relectura / repeticion | Indicar que ese nodo ya fue leido | 35-90 caracteres | Revision cuidadosa | Error tecnico |
| W1_COMPLETE_LIA_01 | `w1_complete` | Lia | Cierre | Preparar paso hacia Mundo II | 80-150 caracteres | Antes de escuchar, aprender a mirar | Explicar senal completa |
| W1_COMPLETE_AMB_01 | `w1_complete` | Ambiente | Cierre ambiental | Cerrar raiz como origen | 50-120 caracteres | Origen / raiz | Triunfalismo tecnico |
| W1_CONTINUE_BTN_01 | `w1_complete` | Sistema / interfaz | Boton | Avanzar a transicion hacia Mundo II | 1-4 palabras | Avance secuencial | Ambiguedad |
| W1_ACCESSIBLE_SCENE_01 | `w1_intro` | Sistema / accesibilidad | Descripcion accesible | Describir la escena para fallback o lector | 90-170 caracteres | Planta, raiz, Lia | Texto excesivo |
| W1_ACCESSIBLE_RELACION_01 | `w1_relacion_active` | Sistema / accesibilidad | Descripcion accesible | Describir activacion de RELACION | 70-140 caracteres | Relacion | Decoracion |
| W1_ACCESSIBLE_PERCEPCION_01 | `w1_percepcion_active` | Sistema / accesibilidad | Descripcion accesible | Describir activacion de PERCEPCION | 70-140 caracteres | Percepcion | Magia literal |
| W1_ACCESSIBLE_MEDIACION_01 | `w1_mediacion_active` | Sistema / accesibilidad | Descripcion accesible | Describir activacion de MEDIACION | 70-140 caracteres | Mediacion | Reemplazo de la planta |

## 11. Conceptos protegidos

- Planta viva: origen sensible del recorrido; nunca decoracion ni personaje humano.
- Raiz: imagen de vinculo, inicio e invisibilidad; no cable tecnico literal.
- Relacion: primer gesto de observacion y cuidado; no romance ni emocion humana proyectada.
- Percepcion: atencion a procesos no evidentes; no poder magico.
- Mediacion: forma cuidadosa de interpretar; no reemplazo de la planta.
- Observacion: accion activa del visitante, no contemplacion pasiva.
- Cuidado: actitud de aproximacion responsable.
- Origen: Mundo I explica desde donde nace OKUA.
- Experiencia mediada: principio transversal que evita la idea de musica directa de plantas.
- Lia como guia unica: acompana y orienta sin volverse humana, hada, nina o mascota.

## 12. Conceptos a evitar o tratar con cuidado

- Planta que canta literalmente: contradice la mediacion.
- Magia literal: puede existir sensibilidad poetica, no explicacion magica.
- Emociones humanas atribuidas a la planta: reducen la planta a personaje humano.
- Tecnicismo prematuro: esta estacion aun no desarrolla la cadena tecnica.
- Sensores/ESP32/MIDI/red/router en esta estacion: pertenecen a explicaciones posteriores, sobre todo Estación IV.
- Promesa de audio: la app debe entenderse sin sonido.
- Lia antropomorfica: no debe ser nina, mujer, hada, mascota ni flor parlante.
- "Juego" como lectura superficial: tocar nodos es una accion de comprension, no un minijuego decorativo.

## 13. Pautas de accesibilidad y público general

- El publico incluye ninos, adolescentes, adultos y ancianos.
- Los textos deben poder leerse en pantalla movil.
- Evitar frases excesivamente largas o con demasiadas ideas simultaneas.
- Evitar dependencia de tecnicismos.
- No usar instrucciones ambiguas para la accion del visitante.
- El microcopy de accion debe ser claro y breve.
- La experiencia no debe depender de sonido para entenderse.
- Incluir descripciones accesibles utiles para fallback o lector de pantalla.

## 14. Relación con estación anterior y siguiente

Mundo I viene de Portada/Transicion: el visitante ya conoce a Lia y el Archivo Vivo como marco de entrada. Esta estacion no debe volver a presentar todo el sistema ni abrir portales nuevos; debe enfocar la atencion en el origen vivo de OKUA.

Todavia no se debe explicar la cadena tecnica completa. Mundo I prepara Estacion II, donde aparece la senal bioelectrica y la diferencia entre senal y experiencia sonora mediada. La salida debe dejar listo al visitante para comprender que mirar y relacionarse son pasos previos a interpretar una senal.

## 15. Checklist específico de aprobación para Estación I

- [ ] La estacion se entiende sin audio.
- [ ] El orden Relación → Percepción → Mediación queda claro.
- [ ] Los textos no dicen que la planta canta literalmente.
- [ ] Los textos no vuelven humana a Lia.
- [ ] No se adelanta la cadena tecnica de Estacion IV.
- [ ] Hay bloqueo suave para nodos fuera de orden.
- [ ] Hay cierre que prepara Mundo II.
- [ ] La lectura funciona en pantalla movil.
- [ ] El escritor conserva libertad autoral dentro de la funcion de cada slot.
