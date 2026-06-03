# Prompt nuevo chat 004 - Mundo I: Raiz post Transicion

Vas a continuar el proyecto GVO - Guia Visual OKUA.

## Estado actual real

El repositorio ya tiene tres pantallas aprobadas para avanzar:

1. Carga Inicial.
2. Portada / Intro.
3. Transicion entre mundos.

La Transicion entre mundos cubre el flujo:

`Portada / Intro -> Transicion -> Mundo I: Raiz`

Estado de Transicion:

`APROBADA_PARA_AVANZAR / 7.9_DE_10 / FUNCIONAL_INTEGRADA / DEUDA_VISUAL_DOCUMENTADA`

La pantalla no esta cerrada como 9/10 final, pero el usuario Ing. Jose David autorizo avanzar por umbral visual.

## Rutas actuales

- `/`: Carga Inicial con handoff a Portada.
- `/carga`: Carga Inicial aislada.
- `/portada`: Portada / Intro.
- `/transition/intro-to-station-1`: Transicion runtime hacia Mundo I.
- `/dev/transition-world`: preview tecnico aislado de la transicion.
- `/estacion/1`: placeholder tecnico actual de Mundo I: Raiz.

## Restricciones no negociables

- La app debe funcionar localmente dentro de red MikroTik, sin Internet.
- No usar CDN.
- No cargar recursos externos.
- No agregar audio.
- No agregar video runtime pesado.
- Mobile-first.
- Textos finales como DOM/CSS.
- Codex no inventa arte fino, Lia, portales ni assets finales.
- No iniciar implementacion sin assets, criterios y ticket funcional aprobado.

## Metodologia obligatoria

- Un paso por interaccion.
- No adelantar pasos futuros.
- Codex no recomienda el siguiente paso.
- La planificacion del siguiente ticket la define el usuario con Ari.
- Al cerrar pantalla se genera documento de cierre, handoff y validacion tecnica final.
- El usuario califica visualmente.
- `APROBADA_PARA_AVANZAR` permite avanzar con deuda visual documentada.
- `CERRADA_APROBADA_FINAL` queda reservada para 9/10 o mas y sin deuda visual importante.

## Aprendizajes criticos

- No animar placeholders.
- No pedir assets fusionados si deben animarse por piezas.
- Producir assets por piezas, frames o estados cuando haya animacion.
- Mejorar metodologia de animacion antes de estaciones.
- Lia requiere mejor planificacion de rig/motion en pantallas futuras.
- Revisar assets y referencias antes de implementar.
- Primero auditar; despues preproducir; despues implementar.

## Proxima pantalla/fase

Mundo I: Raiz.

## Instruccion para este nuevo chat

No empezar Codex de inmediato.

Primero auditar repo, estado, assets disponibles, objetivos pedagogicos, metodologia y riesgos. Luego proponer un plan de trabajo y pedir aprobacion del usuario antes de emitir un ticket funcional para Codex.
