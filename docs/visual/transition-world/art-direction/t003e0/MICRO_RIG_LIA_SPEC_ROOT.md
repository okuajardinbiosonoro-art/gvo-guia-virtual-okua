# Micro-rig de Lía - Transicion Mundo I: Raiz

## Principio

No se necesita un rig completo. La transicion dura 2300ms y requiere una Lía pequeña, estable y expresiva, no una actuacion larga.

## Set minimo

- `lia_transition_root_idle_4f.png` o `.webp`
- `lia_transition_root_guide_2f.png` o `.webp`
- `lia_transition_root_exit_1f.png` o `.webp`
- `lia_transition_root_blink_1f.png` o `.webp` opcional
- `lia_transition_root_spritesheet.json` opcional

## Escala

- Frame recomendado: 96x96 o 128x128 px.
- Fondo transparente.
- Canvas constante para todos los frames.
- Ancla visual: centro del visor/collar.

## Idle 4 frames

Uso futuro: entrada y flotacion breve.

Duracion sugerida: 900-1200ms en loop muy suave.

Movimiento permitido:

- petalos respiran 1-2px;
- collar cambia brillo sutil;
- cuerpo sube/baja maximo 2px.

## Guide 2 frames

Uso futuro: Lía indica el portal sin extremidades.

Duracion sugerida: 300-450ms.

Movimiento permitido:

- inclinacion leve del conjunto;
- collar ambar mas activo;
- petalos orientan la energia hacia el portal.

## Exit 1 frame

Uso futuro: frame de cierre antes de fade.

Debe sentirse sereno y no teatral.

## Blink opcional

Uso futuro: microvida.

Debe ser opcional para reduced motion y no obligatorio para la primera integracion.

## Mapping CSS/React futuro

La implementacion futura puede usar:

- `background-position` con `steps()` si hay spritesheet;
- `<img>` por frame si se prefiere control de opacidad;
- CSS variables para duracion y offsets;
- `data-lia-rig="root-micro"` para QA.

## JSON opcional

Ejemplo:

```json
{
  "frameSize": { "width": 128, "height": 128 },
  "anchor": { "x": 64, "y": 66 },
  "sequences": {
    "idle": { "frames": [0, 1, 2, 3], "durationMs": 960 },
    "guide": { "frames": [4, 5], "durationMs": 360 },
    "exit": { "frames": [6], "durationMs": 220 },
    "blink": { "frames": [7], "durationMs": 120 }
  }
}
```

## Prohibiciones

- No agregar brazos/manos.
- No convertir Lía en personaje humano.
- No cambiar numero de petalos.
- No usar squash/stretch exagerado.
- No hacer bounce caricaturesco.
