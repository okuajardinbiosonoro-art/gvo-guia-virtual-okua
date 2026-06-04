# GVO - Direccion de movimiento de Lia en Mundo I
## Ticket 004D-8C

## 0. Estado

`004D-8C_MOTION_DIRECTION_DOCUMENTAL / SIN_RUNTIME / SIN_ASSETS_NUEVOS`

Este documento define la direccion de movimiento de Lia para Mundo I: Raiz con base en la biblioteca 004D-8A y la auditoria 004D-8B. No implementa interaccion, no modifica `/estacion/1`, no genera assets y no toca runtime.

## 1. Principio general

Lia debe sentirse como una guia pequena, calmada y organica que acompana al visitante dentro del sistema de raices. Su movimiento debe comunicar atencion y cuidado, no accion tecnica ni protagonismo excesivo.

La base visual recomendada es Portada / Intro canonical + rig idle por capas. Las referencias de Transicion aportan escala compacta y las de Carga Inicial aportan timing, no identidad principal.

## 2. Estado inicial

Estado inicial sugerido para la futura implementacion:

- Lia aparece cerca de la planta, en escala pequena/media.
- La planta y el sistema de raices son el foco principal.
- Lia flota de forma lenta y discreta.
- El collar ambar puede respirar con opacidad baja.
- Ojos media luna se mantienen calmados, con blink ocasional.
- No hay teletransporte inicial brusco.

Microposes futuras asociadas:

```txt
lia_root_idle
lia_root_invite_relation
```

## 3. Seleccion de RELACION

Cuando el usuario seleccione RELACION:

- La raiz RELACION gana foco por escala local y glow suave.
- Lia desaparece desde la zona inicial con fade corto y particulas doradas de baja densidad.
- Lia reaparece cerca de la raiz RELACION.
- Lia debe orientar el visor/cuerpo hacia la raiz, no hacia la camara.
- El gesto debe ser invitacion a observar una relacion viva, no activacion de portal.

Microposes futuras asociadas:

```txt
lia_root_invite_relation
lia_root_point_relation
lia_root_materialize_relation
```

## 4. Seleccion de PERCEPCION

Cuando el usuario seleccione PERCEPCION:

- La raiz PERCEPCION queda como foco contextual del dialogo.
- Lia reaparece cerca de esa raiz en actitud atenta.
- El movimiento debe enfatizar mirada, escucha visual y pausa.
- Los ojos pueden usar estado attentive o blink suave, siempre sin cejas ni boca.
- El dialogo debe sentirse como invitacion a mirar senales sutiles, no como analisis tecnico.

Microposes futuras asociadas:

```txt
lia_root_look_perception
lia_root_materialize_perception
```

## 5. Seleccion de MEDIACION

Cuando el usuario seleccione MEDIACION:

- Lia aparece junto a la raiz MEDIACION con gesto de acompanamiento.
- La motion debe comunicar que OKUA media la percepcion, no que inventa una voz.
- El collar puede tener un pulso ambar muy sutil al iniciar el dialogo.
- El cuerpo no debe hacer gestos humanos ni senalar con manos.

Microposes futuras asociadas:

```txt
lia_root_guide_mediation
lia_root_materialize_mediation
```

## 6. Teletransporte

La transicion de Lia entre planta y raiz seleccionada debe evitar el corte duro.

No permitido:

- `display: none` seguido de aparicion instantanea.
- Pop sin preparacion visual.
- Explosion magica.
- Particulas densas.
- Movimiento de camara global para justificar el cambio.

Permitido:

- Fade corto.
- Sombra que desaparece y reaparece.
- Glow ambar/lavanda coherente con el collar.
- Particulas doradas de baja densidad.
- Scale minimo entre 0.98 y 1.02.
- Hold breve antes de materializar junto a la raiz.

Fases sugeridas:

| Fase | Lectura |
| --- | --- |
| Preparacion | Collar/glow sube ligeramente |
| Desmaterializacion | Lia baja opacidad, sombra se apaga |
| Residuo | Particulas doradas quedan un instante |
| Traslado implicito | No se muestra camino literal ni camara |
| Materializacion | Sombra aparece, luego Lia |
| Settle | Lia flota y guia hacia raiz |

## 7. Enfoque por escalado del elemento

Regla visual obligatoria:

> El elemento no se acerca con la cámara, sino que aumenta su escala dentro de la composición.

Implicaciones:

- No usar zoom global de camara.
- No escalar todo el stage.
- No desplazar todo el mundo como cambio de escena.
- La raiz seleccionada aumenta escala local, glow y presencia.
- Raices no seleccionadas bajan protagonismo pero siguen visibles.
- La planta se mantiene como origen visual.
- Lia se reposiciona junto a la raiz seleccionada.

## 8. Root focus background

Durante el dialogo:

- La raiz seleccionada funciona como fondo contextual.
- No reemplaza toda la pantalla.
- Debe mantener continuidad con el sistema subterraneo.
- Debe dejar contraste suficiente para texto DOM/CSS.
- No debe tapar completamente a Lia.
- La composicion debe leerse como foco dentro del mismo Mundo I.

## 9. Dialogos detallados

Los dialogos deben ser especificos por concepto:

| Concepto | Intencion |
| --- | --- |
| RELACION | La planta no es adorno; hay una relacion viva que se cuida. |
| PERCEPCION | Antes de escuchar, se aprende a mirar senales sutiles. |
| MEDIACION | OKUA media la percepcion; no inventa una voz para la planta. |

Reglas:

- Dialogo como DOM/CSS, no imagen.
- Texto sensible y no tecnico.
- No explicar ESP32, MIDI, sensores ni red.
- No presentar la planta como cantante.
- No agregar audio.

## 10. Particulas doradas ambientales

Las particulas son ambiente, no protagonista.

Requisitos:

- Baja densidad.
- Movimiento lento.
- Opacidad suave.
- Distribucion que no cubra texto ni nodos.
- Coherencia ambar/dorada con collar y flujo de raiz.

Evitar:

- Confeti.
- Lluvia densa.
- Neon cyberpunk.
- Destellos rapidos.
- Particulas que parezcan UI tecnica.

## 11. Flujo continuo de raices activas

Las raices activas no deben verse como imagenes encendidas estaticas.

Lectura deseada:

- Energia circulando lentamente por el trayecto.
- Glow concentrado cerca del nodo activo.
- Inicio y cierre suaves.
- Pulso organico, no electrico.

Opciones futuras posibles:

- Overlay PNG/WebP con opacidad animada.
- Mascara CSS sobre glow.
- SVG local con `stroke-dashoffset`, solo si conserva la estetica organica.
- Sprite/overlay de flujo generado despues y aprobado visualmente.

## 12. Reduced-motion

En reduced-motion:

- No teletransporte amplio.
- No particulas en loop intenso.
- Lia puede hacer fade simple entre posiciones.
- La raiz puede entrar en foco como estado fijo.
- El escalado debe ser discreto o ya resuelto como estado enfocado.
- El flujo de raices puede quedar como glow estable.
- El dialogo mantiene legibilidad.

## 13. Assets faltantes

No existen todavia assets aprobados para microposes de Lia en Mundo I. La carpeta futura sigue vacia salvo `.gitkeep`.

Assets/estados faltantes documentados:

```txt
lia_root_idle
lia_root_invite_relation
lia_root_point_relation
lia_root_look_perception
lia_root_guide_mediation
lia_root_ready_continue
lia_root_exit
lia_root_dematerialize_start
lia_root_dematerialize_mid
lia_root_materialize_relation
lia_root_materialize_perception
lia_root_materialize_mediation
```

Faltan tambien, para ticket posterior:

- efecto de teletransporte aprobado;
- variantes de materializacion por concepto;
- flujo visual de raices activas;
- particulas doradas ambientales compatibles con reduced-motion.

## 14. Confirmacion de alcance

- No se implementa `/estacion/1`.
- No se modifican componentes React.
- No se modifican rutas.
- No se modifican imports.
- No se modifican assets runtime.
- No se generan nuevos assets artisticos.
- No se agregan dependencias.
- No se usan CDN, recursos externos, audio ni video.
