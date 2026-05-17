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

## Deuda visual conocida

- La animación de Lía todavía se siente algo brusca.
- Para llegar a 9/10 o 10/10 probablemente se requerirán nuevos microframes o edición frame-by-frame.
- Esta deuda debe revisarse en una fase de pulido global, no bloquear indefinidamente la siguiente pantalla.

## Motivo de avance

El usuario y aprobador visual explícito, Ing. José David, validó que la carga inicial V13 alcanza un umbral visual aproximado de 7.2/10. Ese nivel permite avanzar hacia la siguiente pantalla bajo la metodología `APROBADA_PARA_AVANZAR`, con deuda visual documentada.

Avanzar evita que el proyecto quede bloqueado excesivamente en una sola pantalla antes de producir el resto del recorrido.

## Exclusiones

- V14 puppet rig fue rechazado visualmente y no se integró a `main`.
- La carga inicial no queda declarada como cierre final 9/10.
- No se desbloquea una implementación funcional de portada sin preproducción de assets y ticket aprobado.
