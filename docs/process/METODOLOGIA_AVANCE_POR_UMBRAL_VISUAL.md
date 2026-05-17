# Metodología de avance por umbral visual

Fecha: 2026-05-17

Esta metodología permite avanzar entre pantallas cuando una pantalla alcanza una base visual suficientemente estable, aunque conserve deuda de pulido para una etapa final.

El aprobador visual explícito del proyecto es el usuario Ing. José David.

## Estados

### APROBADA_PARA_AVANZAR

Una pantalla puede quedar en `APROBADA_PARA_AVANZAR` cuando cumple todos estos criterios:

- Calificación visual del usuario igual o superior a 7/10.
- Estabilidad técnica comprobada.
- Respeto de las reglas no negociables del proyecto.
- Sin dependencias externas no permitidas.
- Sin audio ni video runtime, salvo ticket futuro que lo autorice explícitamente.
- Deuda visual conocida documentada.
- Pruebas ejecutadas o bloqueos reportados honestamente.

Este estado permite avanzar a la siguiente pantalla, siempre mediante ticket aprobado y sin borrar la deuda visual pendiente.

### CERRADA_APROBADA_FINAL

Una pantalla puede quedar en `CERRADA_APROBADA_FINAL` cuando cumple estos criterios:

- Calificación visual objetivo igual o superior a 9/10.
- Sin deuda visual importante.
- Revisión final explícita del usuario.
- Documentación y pruebas completas.
- Lista para pulido final de conjunto o entrega.

Este estado no es obligatorio para iniciar la siguiente pantalla si ya existe `APROBADA_PARA_AVANZAR`, pero sí debe buscarse antes de cierre global del proyecto.

## Aplicación a la carga inicial

La carga inicial V13 queda como:

`APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`

No queda como:

`CERRADA_APROBADA_FINAL`

La deuda principal es la naturalidad de animación de Lía. Para alcanzar 9/10 o 10/10 probablemente se requerirán nuevos microframes o edición frame-by-frame en una fase posterior de pulido global.

## Regla de avance

Antes de iniciar una pantalla nueva, verificar que la pantalla anterior esté en uno de estos estados:

- `APROBADA_PARA_AVANZAR`
- `CERRADA_APROBADA_FINAL`

Si no está en ninguno de esos estados, detener el avance de fase y continuar la iteración de la pantalla actual.
