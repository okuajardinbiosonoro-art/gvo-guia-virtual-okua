# Especificacion Portal Root - Mundo I: Raiz

## Objetivo

Crear un portal de transicion breve, vertical, luminoso y calido que comunique entrada a Mundo I: Raiz.

## Componentes

- `portal_root_base.svg`
- `portal_root_glow.svg`
- `portal_root_open.svg`
- `symbol_root.svg`

## Estados

### inactive

- baja opacidad;
- glow casi imperceptible;
- simbolo raiz tenue.

### activating

- glow ambar/lavanda moderado;
- centro mas luminoso;
- simbolo raiz aparece.

### open

- centro claro y estable;
- borde visible;
- sin saturacion neon.

## Paleta

- Centro: marfil/crema.
- Borde primario: dorado ambar.
- Borde secundario: lavanda suave.
- Simbolo: tierra suave.
- Glow: ambar bajo con lavanda.

## Escala

- Base recomendada: 192x288 o 224x336 px.
- Proporcion vertical: arco/umbral.
- Debe leer bien en 390x844.

## Reglas de animacion futura

- Entrada 150-450ms.
- Activacion 550-1100ms.
- Pulso final 1850-2150ms.
- Fade salida 2050-2300ms.
- Reduced motion: opacidad simple, sin pulso amplio.

## SVG/CSS vs raster

Preferir SVG si:

- los bordes se ven pixelart/crisp;
- no hay antialias moderno molesto;
- el glow puede separarse en CSS.

Usar PNG transparente si:

- el portal depende de textura organica dificil de vectorizar;
- el SVG pierde caracter visual;
- Photopea entrega mejor control de bordes.

## Prohibiciones

- No cueva.
- No gema/capullo.
- No huevo.
- No portal sci-fi.
- No texto.
- No letras falsas.
- No fondo opaco.
