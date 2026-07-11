# 016G - Mundo I Estacion I Expanded Stage + Fixed Plant + Lia Presence R1

## Capturas

- `world1-016G-mobile-360x800-mediation-expanded.png`
- `world1-016G-mobile-390x844-mediation-expanded.png`
- `world1-016G-mobile-430x932-mediation-expanded.png`
- `world1-016G-desktop-1365x768-mediation-expanded.png`
- `world1-016G-mobile-390x844-ready-expanded.png`

## Metricas

Archivo: `qa-results.json`.

Resumen:

- `allViewportsPassed: true`
- `reducedMotionPassed: true`

## Criterios verificados

- Sin overflow horizontal.
- Etiquetas de nodos dentro del viewport en `360x800`, `390x844`, `430x932` y `1365x768`.
- Halos/rings centrados contra el orb con delta maximo `0`.
- Stage mas grande:
  - `360x800`: `0.868` del alto de viewport.
  - `390x844`: `0.896` del alto de viewport.
  - `430x932`: `0.899` del alto de viewport.
  - `1365x768`: `1.120` del alto de viewport.
- Lia ocupa `0.320` a `0.323` del ancho del stage.
- `world1-root-lia-expression` presente.
- Dos capas de luz de hoja presentes.
- Planta estable durante animacion: `dx=0`, `dy=0`, `dw=0`, `dh=0`.
- `Continuar` no existe antes de `ready_to_continue`.
- `Continuar` navega a `/transition/world-1-to-world-2`.
- `exitPath` no se renderiza.
- Reduced-motion conserva contenido visible y desactiva animaciones CSS.

