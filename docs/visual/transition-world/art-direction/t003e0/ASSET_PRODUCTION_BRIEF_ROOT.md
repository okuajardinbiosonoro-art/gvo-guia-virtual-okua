# Brief de produccion de assets - Transicion Mundo I: Raiz

## Objetivo narrativo

Crear una pausa breve, bella y clara que comunique que el recorrido sale de Portada / Intro y entra a Mundo I: Raiz.

La transicion no explica contenido pedagogico. Solo abre el umbral.

## Estructura visual

- Fondo claro, calido, organico y sobrio.
- Portal central vertical como umbral luminoso.
- Lía pequeña, canonica y cercana al portal.
- Simbolo raiz minimo dentro o cerca del portal.
- Barra de progreso delicada.
- Textos finales como DOM/CSS, no incrustados.

## Paleta

- Crema claro: fondo principal.
- Marfil: centro luminoso del portal.
- Ambar suave: progreso, collar, pulso.
- Lavanda suave: borde secundario y acento.
- Tierra tenue: simbolo raiz y pequenas sombras.

Evitar negro dominante, azul oscuro, cueva mineral, verde saturado o glow neon.

## Escala movil

- Target principal: 390x844.
- Debe funcionar tambien en 360x640 y 430x932.
- Portal visible sin ocupar toda la pantalla.
- Lía menor que portal, pero reconocible.
- Textos en DOM debajo de la escena.

## Jerarquia visual

1. Portal raiz central.
2. Lía como guia lateral.
3. Texto principal.
4. Barra minima.
5. Sparkles/ambiente, solo si no compiten.

## Prohibiciones

- Texto incrustado en imagen.
- Logos inventados.
- Letras falsas.
- Lía con brazos, manos, piernas, pies, boca, nariz o cejas.
- Estilo 3D, render brillante o muñeco.
- Portal oscuro/cueva/mineral.
- Fondo saturado.
- CDN o recursos externos.
- Audio/video runtime.

## Assets requeridos

- `lia_transition_root_master.png`
- `lia_transition_root_idle_4f.png` o `.webp`
- `lia_transition_root_guide_2f.png` o `.webp`
- `lia_transition_root_exit_1f.png` o `.webp`
- `lia_transition_root_blink_1f.png` o `.webp` opcional
- `lia_transition_root_spritesheet.json` opcional
- `portal_root_base.svg`
- `portal_root_glow.svg`
- `portal_root_open.svg`
- `symbol_root.svg`
- `transition_root_background_reference.png`
- `transition_root_progress_reference.png`
- `transition_root_contact_sheet_v1.png`

## Formato esperado

- Lía: PNG/WebP con transparencia.
- Portal: SVG preferido si conserva estetica pixelart; PNG transparente aceptable si SVG no funciona visualmente.
- Glow: SVG/PNG separado.
- Fondo referencia: PNG sin texto.
- Contact sheet: PNG.
- JSON opcional: frame metadata simple.

## Tamaños recomendados

- Lía frame: 96x96 o 128x128 px transparente.
- Portal base: 192x288 o 224x336 px equivalente.
- Fondo referencia: 390x844 y 430x932.
- Contact sheet: 1440x2560.

## Criterios de descarte

Descartar si:

- no se reconoce Lía;
- hay rasgos humanos o extremidades;
- portal parece gema, capullo, cueva, huevo o ventana futurista;
- contiene texto;
- no es mobile-first;
- no respeta paleta;
- se ve como stock art o UI generica;
- no soporta fondo transparente donde aplica.
