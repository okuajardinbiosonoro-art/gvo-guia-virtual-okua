# Handoff 001 - Carga inicial V13 como base de avance

Fecha: 2026-05-17

## Resumen

La carga inicial pre-portada quedó integrada en `main` como base estable V13.

- Commit consolidado: `87e048b feat: register initial loading frames timeline`
- Tag de checkpoint: `checkpoint/carga-inicial-v13-7p2`
- Rutas activas: `/` y `/carga`
- Estado de avance: `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`
- Estado final: no está `CERRADA_APROBADA_FINAL`

## Restricciones cumplidas

- Sin audio.
- Sin video runtime.
- Sin CDN.
- Sin recursos externos.
- Assets runtime locales.
- Textos visibles conservados:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`

## Resumen de iteraciones V1-V14

- V1: base inicial de carga pre-portada con composición todavía rígida.
- V2: timeline de 12s, entrada lateral de Lía, riego multi-stream, sparkles y reduced motion.
- V3: ajuste fino de maceta, halo, agua y sparkles.
- V4: calibración más precisa de agua, layout y zonas de exclusión.
- V5: halo centrado/ampliado y escena más balanceada.
- V6: maceta/planta más baja y más a la izquierda.
- V7: ajuste mínimo de maceta hacia la izquierda.
- V8: maceta desplazada a la posición aprobada de composición general.
- V9: polish de motion/UI sin mover layout base.
- V10: Pixelify Sans local, barra pixelart y dirección de motion más explícita.
- V11: reducción de escala visual y suavizado de barra/motion.
- V12: barra pixelart con caps y marker más definidos.
- V13: frame registration, timeline dirigido, holds, agua retrasada después de la inclinación y planta sincronizada con pulsos.
- V14: experimento puppet rig de Lía/regadera; descartado visualmente y no integrado en `main`.

## Deuda visual conocida

- La animación de Lía todavía se siente algo brusca.
- Para llegar a 9/10 o 10/10 probablemente se requerirán nuevos microframes o edición frame-by-frame.
- Esta deuda debe revisarse en una fase de pulido global, no bloquear indefinidamente la siguiente pantalla.

## Motivo de avance

El usuario y aprobador visual explícito, Ing. José David, validó que la carga inicial V13 alcanza un umbral visual aproximado de 7.2/10. Ese nivel permite avanzar hacia la siguiente pantalla bajo la metodología `APROBADA_PARA_AVANZAR`, con deuda visual documentada.

Avanzar evita que el proyecto quede bloqueado excesivamente en una sola pantalla antes de producir el resto del recorrido.

## Decisión

La siguiente pantalla queda desbloqueada solo para preproducción:

`PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

La Portada / Intro no debe implementarse en runtime hasta que existan assets, prompts, referencias, criterios visuales, límites técnicos y ticket funcional aprobado.

## Exclusiones

- V14 puppet rig fue rechazado visualmente y no se integró a `main`.
- La carga inicial no queda declarada como cierre final 9/10.
- No se desbloquea una implementación funcional de portada sin preproducción de assets y ticket aprobado.
