# Transición entre mundos

![Referencia visual](../visual_refs/02_transicion_entre_mundos.png)

**Especificación fuente:** `../source_txt/02_transicion_entre_mundos_especificacion_v1.txt`

## Estado vigente W2 → W3

Este tramo está `FINAL / HUMAN_APPROVED`. Es pasivo, automático y no ofrece CTA:

- Título: `Abriendo Mundo III`.
- Subtítulo: `Preparando el Cuaderno Pixel de Pruebas…`.
- Movimiento normal: 2300 ms.
- Reduced motion: 1000 ms.

Los tramos W3→W4, W4→W5 y W5→Final conservan copy TEMP y no deben presentarse como cerrados.

## Intención

Pausa pixelart breve y minimalista donde Lía acompaña la apertura de un portal para conectar narrativamente una estación con la siguiente.

## Función dentro del recorrido

Dar continuidad, ocultar cambio de ruta y mantener sensación de cruce sin introducir contenido pedagógico nuevo.

## Interacción esperada

Sin interacción. Bloquea taps repetidos. Avance automático al destino.

## Modo de uso

Automático reutilizable.

## Emisor textual principal

Ambiente / sistema visual. Lía acompaña visualmente.

## Secuencia funcional sugerida

1. Entrada.
2. Apertura del portal.
3. Preparación/carga visual.
4. Salida hacia estación.

## Estados de pantalla para escritura

| Estado | Qué se ve / momento | Función del texto |
| --- | --- | --- |
| transition_enter | Portal tenue | Nombrar el destino |
| transition_loading | Barra mínima avanza | Mantener espera |
| transition_exit | Portal abierto | Cerrar el cruce |

## Textos que debe producir o revisar el escritor

- Texto principal por destino.
- Texto secundario breve por destino.
- Mensaje accesible si aplica.

## Conceptos que deben quedar protegidos

- cruce.
- portal.
- continuidad.
- brevedad.
- destino claro.

## Conceptos o decisiones que deben evitarse

- diálogos largos.
- botones.
- información nueva.
- menú.
- opciones.
- navegación hacia mundos bloqueados.

## Nota para escritura

La pauta anterior no define el estilo final. Define qué necesita resolver cada texto dentro de la pantalla. El escritor puede modificar ritmo, voz, metáfora y construcción verbal, siempre que no se pierda la función de pantalla ni se contradigan los conceptos protegidos.
