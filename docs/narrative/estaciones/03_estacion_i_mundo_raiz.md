# Estación I — Mundo I: Raíz

![Referencia visual](../visual_refs/03_estacion_i_mundo_raiz.png)

**Especificación fuente:** `../source_txt/03_estacion_i_mundo_raiz_especificacion_v1.txt`

## Intención

Presentar el origen de OKÚA como una experiencia de observación y mediación cuidadosa para aprender a relacionarse con una planta viva antes de intentar escucharla.

## Función dentro del recorrido

Fundar la experiencia: antes de hablar de señal, técnica o sonido, el visitante aprende a mirar la planta como vida activa y relación.

## Interacción esperada

Activar tres nodos en orden: RELACIÓN → PERCEPCIÓN → MEDIACIÓN. Leer textos breves y continuar hacia Estación II.

## Modo de uso

Interactivo secuencial en primera pasada; revisión libre posterior.

## Emisor textual principal

Lía como guía conceptual; ambiente para respuestas de raíz; interfaz para botón y bloqueo.

## Secuencia funcional sugerida

1. Entrada a Mundo I.
2. Nodo RELACIÓN disponible.
3. Nodo PERCEPCIÓN disponible.
4. Nodo MEDIACIÓN disponible.
5. Cierre y continuar.

## Estados de pantalla para escritura

| Estado | Qué se ve / momento | Función del texto |
| --- | --- | --- |
| w1_intro | Planta/raíz y Lía visibles | Presentar origen |
| w1_relacion | Nodo Relación disponible/activo | Hablar de vínculo |
| w1_percepcion | Nodo Percepción disponible/activo | Hablar de atención e invisibilidad |
| w1_mediacion | Nodo Mediación disponible/activo | Preparar paso a señal |
| w1_complete | Tres nodos activados | Cerrar Mundo I |

## Textos que debe producir o revisar el escritor

- Entrada de Lía.
- Instrucción por nodo.
- Respuesta ambiental por nodo.
- Mensaje de bloqueo suave.
- Cierre de estación.
- Botón continuar.

## Conceptos que deben quedar protegidos

- planta viva.
- observación.
- relación.
- percepción.
- mediación.
- origen de OKÚA.

## Conceptos o decisiones que deben evitarse

- sensores.
- ESP32.
- MIDI.
- red.
- cadena técnica completa.
- planta como adorno.
- planta que canta literalmente.

## Nota para escritura

La pauta anterior no define el estilo final. Define qué necesita resolver cada texto dentro de la pantalla. El escritor puede modificar ritmo, voz, metáfora y construcción verbal, siempre que no se pierda la función de pantalla ni se contradigan los conceptos protegidos.
