# Portada — El Archivo Vivo de OKÚA

![Referencia visual](../visual_refs/01_portada_archivo_vivo.png)

**Especificación fuente:** `../source_txt/01_portada_archivo_vivo_especificacion_v1.txt`

## Intención

Entrada narrativa al recorrido mediante cinco portales y a Lía como guía inicial, preparando al visitante para avanzar secuencialmente hacia Mundo I: Raíz.

## Función dentro del recorrido

Presentar GVO, introducir a Lía, ordenar la primera pasada y evitar que la experiencia se entienda como menú libre inicial.

## Interacción esperada

Tocar Comenzar recorrido o Portal I; avanzar diálogos de Lía; tocar portales bloqueados solo genera feedback; después de completar la introducción se abre Portal I.

## Modo de uso

Interactivo secuencial en primera pasada; modo revisión libre después de completar el recorrido.

## Emisor textual principal

Lía para la introducción; sistema/interfaz para botones y estados; Lía o interfaz para bloqueos breves.

## Secuencia funcional sugerida

1. Portada idle.
2. Inicio de diálogos.
3. Cinco mensajes introductorios.
4. Portal I listo.
5. Portal I abriendo.
6. Transición a Estación I.

## Estados de pantalla para escritura

| Estado | Qué se ve / momento | Función del texto |
| --- | --- | --- |
| portada_idle | Portales visibles y Portal I disponible | Invitar a comenzar |
| intro_dialogue_active | Panel de Lía activo | Presentar GVO y mediación |
| portal_blocked | Portal II-V tocado en primera pasada | Orientar sin regañar |
| portal_1_opening | Portal I iluminado | Confirmar entrada a Raíz |
| free_review_mode | Todos los portales habilitados | Permitir revisión libre |

## Textos que debe producir o revisar el escritor

- Título y subtítulo fijo.
- Botón principal.
- Cinco diálogos de Lía.
- Mensajes de portales bloqueados.
- Texto de entrada a Mundo I.
- Texto de modo libre.

## Conceptos que deben quedar protegidos

- Archivo Vivo.
- Lía como guía.
- cinco mundos.
- primera pasada secuencial.
- mediación.
- entrada por Raíz.

## Conceptos o decisiones que deben evitarse

- menú libre completo en primera pasada.
- omitir diálogos obligatorios.
- texto largo.
- cadena técnica de 8 nodos.
- prometer audio o magia.

## Nota para escritura

La pauta anterior no define el estilo final. Define qué necesita resolver cada texto dentro de la pantalla. El escritor puede modificar ritmo, voz, metáfora y construcción verbal, siempre que no se pierda la función de pantalla ni se contradigan los conceptos protegidos.
