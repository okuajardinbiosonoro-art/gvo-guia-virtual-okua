# GVO - Mundo I: Raiz
## Actualizacion documental de interaccion 004D-8B

## 0. Estado

Estado:

`004D-8B_INTERACTION_UPDATE_DOCUMENTAL / SIN_RUNTIME / SIN_ASSETS_NUEVOS`

Este documento actualiza la definicion funcional y visual de Mundo I con la logica aprobada de interaccion con raices conceptuales. No implementa `/estacion/1`, no modifica rutas y no genera assets.

## 1. Comportamiento aprobado

Mundo I inicia con:

- Fondo subterraneo calido.
- Planta joven en zona superior.
- Raices conceptuales visibles como sistema de origen.
- Tres conceptos: `RELACION`, `PERCEPCION`, `MEDIACION`.
- Lia ubicada arriba o cerca de la planta, con presencia pequena/media y no dominante.
- Particulas ambientales suaves, si existen, de baja densidad.

Cuando el usuario selecciona una raiz conceptual:

1. Lia desaparece de su posicion inicial cerca de la planta.
2. Se activa un efecto de desmaterializacion sutil.
3. La raiz seleccionada toma protagonismo por escalado local dentro de la composicion.
4. Lia aparece al lado de la raiz seleccionada.
5. Lia aparece senalando o guiando visualmente esa raiz.
6. La raiz ampliada queda como fondo contextual del bloque de dialogo.
7. Lia entrega una explicacion detallada, no generica.

## 2. Secuencia de interaccion

Secuencia aprobada:

```txt
estado inicial
-> usuario selecciona raiz
-> raiz seleccionada pasa a foco
-> Lia desaparece desde planta
-> FX de teletransporte sutil
-> Lia aparece junto a raiz seleccionada
-> raiz ampliada queda como fondo contextual
-> dialogo detallado de Lia
-> raiz queda completada
-> siguiente raiz disponible o Continuar desbloqueado
```

La estacion no debe cambiar a una pantalla completamente nueva durante el dialogo. Debe sentirse como un estado enfocado dentro del mismo Mundo I.

## 3. Foco por escalado del elemento

Regla visual obligatoria:

> El elemento no se acerca con la camara, sino que aumenta su escala dentro de la composicion.

Implicaciones:

- No usar zoom global de camara.
- No escalar todo el stage.
- No desplazar todo el fondo como si se cambiara de escena.
- La raiz seleccionada puede crecer, ampliar su trazo, aumentar glow y ocupar mas presencia.
- El resto de la escena se mantiene como contexto visual.
- El foco puede apoyarse con vineta, opacidad o blur muy sutil del fondo, pero sin convertirlo en nueva pantalla.

Estado visual recomendado:

| Elemento | Estado al seleccionar raiz |
| --- | --- |
| Raiz seleccionada | Escala local mayor, glow activo, flujo constante |
| Raices no seleccionadas | Bajan protagonismo, siguen visibles |
| Planta | Sigue como origen visual |
| Lia | Se reposiciona junto a raiz seleccionada |
| Dialogo | DOM/CSS sobre contexto, no imagen |
| Boton Continuar | Sigue bloqueado hasta completar conceptos |

## 4. Raiz ampliada como fondo contextual

Durante la explicacion detallada:

- La raiz ampliada no reemplaza toda la pantalla.
- La raiz ampliada funciona como fondo contextual del dialogo.
- Debe verse integrada a la misma composicion subterranea.
- Debe conservar suficiente contraste para texto DOM.
- Debe evitar tapar completamente a Lia.
- Debe mantener relacion con la planta y el sistema de raices base.

Lectura esperada:

El visitante siente que esta observando con mas atencion una parte del sistema de raices, no que fue transportado a otra pantalla.

## 5. Teletransporte de Lia

La desaparicion/aparicion de Lia debe verse cuidada.

No permitido:

- `display: none` seguido de aparicion dura.
- Pop instantaneo.
- Corte brusco sin efecto.
- Ruido visual exagerado.
- Explosion magica.

Permitido:

- Fade corto.
- Glow ambar/lavanda coherente con collar.
- Particulas doradas de baja densidad.
- Desmaterializacion por opacidad + scale minimo.
- Sombra que desaparece y reaparece.
- Pequeño desplazamiento vertical/flotacion.
- Hold breve antes de aparecer junto a la raiz.

Fases sugeridas:

| Fase | Intencion |
| --- | --- |
| Preparacion | Collar/glow sube muy poco |
| Desmaterializacion | Lia baja opacidad y escala 0.98-1.02 |
| Particulas | Motes doradas quedan un instante |
| Traslado implicito | Sin movimiento de camara |
| Materializacion | Sombra aparece, luego Lia |
| Settle | Lia flota y apunta/guia |

## 6. Particulas ambientales del mundo

Debe considerarse una capa ambiental adicional:

- Particulas doradas suaves.
- Tipo motas de luz o luciernagas abstractas.
- Baja densidad.
- Movimiento lento.
- Brillo/apagado sutil.
- Sensacion de lluvia muy lenta o suspension leve.

Restricciones:

- No deben parecer confeti.
- No deben competir con nodos.
- No deben cubrir texto.
- No deben sugerir audio/musica.
- En reduced motion deben ocultarse o quedar casi estaticas.

## 7. Flujo continuo en raices activas

La raiz seleccionada no debe verse como una imagen encendida estatica.

Debe percibirse:

- Circulacion de energia/luz a lo largo del recorrido.
- Movimiento lento y organico.
- Inicio y cierre suaves.
- Brillo mas concentrado cerca del nodo activo.

Opciones futuras posibles:

- Overlay PNG/WebP con opacidad animada.
- SVG local con `stroke-dashoffset`, solo si conserva estetica.
- Mascara CSS sobre glow.
- Sprite/overlay de flujo generado despues.

No permitido:

- Raices como cables electricos.
- Neon cyberpunk.
- Pulsos rapidos.
- Destellos fuertes.
- Lluvia de particulas densa.

## 8. Dialogo detallado de Lia

La explicacion de Lia debe ser especifica por concepto:

| Concepto | Intencion del dialogo |
| --- | --- |
| RELACION | La planta no es adorno; hay una relacion viva que se cuida |
| PERCEPCION | Antes de escuchar, se aprende a mirar senales sutiles |
| MEDIACION | OKUA media la percepcion; no inventa una voz para la planta |

Reglas:

- Dialogo como DOM/CSS, no imagen.
- Texto claro, sensible y no tecnico.
- No explicar ESP32, MIDI, sensores o red en Mundo I.
- No presentar la planta como cantante.
- No agregar audio.

## 9. Estados de raiz durante la interaccion

| Estado | Visual |
| --- | --- |
| Idle | Raiz base apagada y legible |
| Available | Contorno o glow tenue |
| Focused | Escala local mayor, raiz protagonista |
| Explaining | Raiz ampliada como fondo contextual, flujo constante |
| Completed | Luz estable, menor pulso |

## 10. Reduced motion

En reduced motion:

- No teletransporte amplio.
- No particulas moviendose en loop.
- Lia puede hacer fade simple entre posiciones.
- Raiz puede cambiar a estado enfocado sin flujo animado.
- El escalado debe ser discreto o aparecer como estado fijo.
- Dialogo mantiene legibilidad.

## 11. Accesibilidad

La futura implementacion debe preservar:

- Raices/nodos como controles reales.
- Foco visible por teclado.
- Estados no dependientes solo de color.
- Dialogo con estructura DOM y `aria-live` si aplica.
- Sin texto incrustado en assets.
- Sin flicker.
- Reduced motion respetado.

## 12. Limites del documento

Este documento:

- No implementa componentes.
- No crea assets.
- No define coordenadas finales.
- No modifica rutas.
- No cambia `/estacion/1`.
- No declara Mundo I aprobado.

Estado de salida:

`MUNDO_I_INTERACTION_UPDATE_004D8B_DOCUMENTADO / PENDIENTE_DE_RUNTIME_FUTURO`
