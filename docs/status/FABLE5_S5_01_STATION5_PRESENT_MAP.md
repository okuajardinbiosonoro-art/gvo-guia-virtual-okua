# FABLE5-S5-01 — Estación V / Mundo V: Mapa del presente

Fecha: 2026-07-12
Rama: `feature/fable5-s5-01-station5-present-map`
Ruta: `/estacion/5` (ya registrada; sin cambios de router)
Estado: implementado, probado y documentado; pendiente de revisión visual del usuario.

## Enfoque de implementación

Se reemplazó por completo la pantalla temporal de tarjetas de `World5Root` por
un diorama editorial cálido en 2.5D, fiel a la referencia
`docs/narrative/visual_refs/07_estacion_v_mapa_presente.png`:

- maqueta orgánica central con borde elevado, labio frontal y superficie
  rehundida (CSS 3D: `perspective` + `rotateX(30deg)` + `rotateZ(-2deg)`,
  cámara semi-cenital ≈60° de elevación, más contemplativa que Estación IV);
- cuatro zonas integradas (Plantas, Sistema, Espacio, Visitante) con suelos
  orgánicos, objetos "de pie" (billboard contrarrotado) y etiquetas píldora;
- nexo central de relación no interactivo que sube de intensidad con cada
  área completada;
- conexiones punteadas área → nexo que se encienden al activar cada área;
- Lía oficial (poses PNG compartidas de portada-intro) como guía de síntesis
  con ruta punteada de entrada, desplazamientos entre áreas y pose de cierre;
- ventana de diálogo editorial bajo el mapa (una a la vez, 2–3 líneas);
- CTA "Ir al cierre" en estilo oliva/crema, deshabilitado hasta completar.

## Arquitectura visual y técnica

- React + TypeScript + CSS 3D + SVG procedural. **Sin dependencias nuevas,
  sin Three.js** (AGENTS.md lo prohíbe sin autorización explícita), sin
  canvas, sin audio, sin red.
- `station5Content.ts`: copy aprobado (especificación V1 + ticket), áreas,
  mensajes de Lía, CTA y rutas de poses. Sustituye a los TEMP de
  `world5EditorialSlots` para esta pantalla (mismo patrón que Estación IV).
- `station5AreaArt.tsx`: visuales procedurales por área con slots
  reemplazables (`visualKey` plants/system/space/visitor,
  `data-station5-visual` en el DOM).
- `World5RootScreen.tsx`: componentes `Station5AreaZone` (escena decorativa),
  `Station5Area` (botón táctil accesible), `Station5RelationshipNexus`,
  `Station5AreaConnection`, `Station5LiaGuide`, `Station5FinalAction`.

### Capa táctil plana (decisión clave)

El hit-test 3D de Chromium falla en la mitad inferior de un plano rotado con
`preserve-3d` (los taps de Espacio/Visitante caían en la superficie, medido
con `tools/debug-station5-click.mjs`: ratio de aciertos 0/25 en la rejilla de
puntos). Por eso los **botones accesibles viven en una capa plana de
pantalla** (`.s5-touch-layer`) alineada con la proyección de sus zonas
decorativas (`areaTouchAnchors`, estable ±1% entre 360x640 y 430x932). El
diorama completo queda `pointer-events: none`. Beneficios: taps fiables en
móvil real, foco visible sin distorsión de perspectiva, targets ≥120px.

## Progresión de áreas

`entering → plants_suggested → plantas_active → (hint) → sistema_active →
(hint) → espacio_active → (hint) → visitante_active → map_integrated →
ready_to_close ⇄ revisit_mode → exiting`

- Primera pasada estrictamente secuencial; solo una área activa a la vez.
- **Sin botones "Siguiente"**: tras el retardo de lectura (1800 ms; 250 ms
  con reduced motion), la siguiente área recibe halo sugerido y un hint breve
  de Lía ("Mira ahora el sistema.", "Sigue hacia el espacio.", "Falta tu
  lugar en el mapa."); el visitante avanza tocándola.
- Área bloqueada → respuesta calmada de Lía (dos variantes alternadas), sin
  avance ni error agresivo.
- Área completada en primera pasada → nota "ya quedó en el mapa".
- Al completar Visitante: mapa integrado, nexo pleno, síntesis de Lía
  ("OKÚA ocurre aquí…"), CTA habilitado, revisita libre en cualquier orden.
- CTA antes de tiempo → "Antes de cerrar, revisemos las partes del presente."

## Nexo central de relación

No interactivo (`pointer-events: none`, sin rol). Halo + anillo punteado +
núcleo dorado; su opacidad escala con `--s5-nexus-level` (áreas completadas
/ 4) y solo alcanza el estado `full` (respiración suave, brillo pleno) al
completar Visitante. Expuesto para QA vía `data-station5-nexus` y
`data-station5-nexus-state`.

## Lía

- Única, oficial, con las mismas poses PNG 2.5D que usa Estación IV
  (`lia_pose_explain_calm_v1.png` guía / `lia_pose_greeting_v1.png` cierre).
- Entra arriba-derecha con ruta punteada hacia Plantas; acompaña cada área
  activa (zonas superiores por el lado interior, inferiores por el exterior
  para no tapar etiquetas ni el nexo); en el cierre se ubica al frente del
  mapa, cerca del CTA; flotación suave solo sin reduced motion.

## Arquitectura de slots para Codex

| Slot | Reemplazo |
| --- | --- |
| `Station5AreaVisual` (`data-station5-visual="plants\|system\|space\|visitor"`) | sustituir renderer en `station5AreaArt.tsx` o cambiar a `<img data-runtime-asset>` |
| Poses de Lía (`station5LiaPoses`) | rutas en `station5Content.ts` |
| Copy (`station5Areas`, `station5Lia`, `station5Cta`, `station5Header`) | `station5Content.ts` |
| Materiales de maqueta/zonas | variables `--s5-*` y bloques `.s5-tray*`/`.s5-zone*` en el CSS |
| Registro de assets | `public/assets/gvo/current-used/world-5-root/README.md` |

## Accesibilidad

- Cada área es un `<button>` real con label "Área N de 4. X.",
  `aria-disabled` cuando está bloqueada, `aria-current="step"` cuando activa
  y estado textual vía `aria-describedby` (Bloqueada/Sugerida/Activa/
  Completada) — no depende solo del color; las completadas muestran ✓.
- CTA: "Ir al cierre." / "Ir al cierre. Completa las cuatro áreas para
  continuar." según estado, con `aria-disabled`.
- Ventana de Lía `aria-live="polite"`; hints y bloqueos en `role="status"`.
- Foco visible sin transformar (capa táctil plana).

## Reduced motion

`prefers-reduced-motion: reduce` (media queries + hook para tiempos):
sin flotación de Lía, sin ruta punteada animada, sin pulsos ni transición de
desplazamiento; estados por opacidad/borde; explicaciones inmediatas
(250 ms); salida con fade simple. Cobertura en test dedicado y captura 10.

## Validación

Ver `docs/ai/station5/FABLE5_S5_01_VALIDATION_REPORT.md`. Resumen:
`npm run lint` ✓ · `npm run test` 155/155 ✓ (14 nuevas de Estación V) ·
`npm run build` ✓ · `git diff --check` ✓ · auditoría sin URLs externas/CDN/
audio ✓ · recorrido real end-to-end con Playwright (Chromium móvil) ✓.

## Capturas

`docs/visual/world5/fable5-s5-01/` (01–11): inicial, cada área activa,
tres completadas con nexo parcial, mapa integrado, CTA activo, revisita,
360x640, 430x932 y reduced motion (inicial + completado).

## Riesgos conocidos / puntos de revisión para Codex

1. **Anclas táctiles calibradas**: si cambian `--s5-tilt`, `--s5-roll`,
   `perspective` o la geometría del escenario, recalibrar `areaTouchAnchors`
   con `tools/debug-station5-click.mjs` (la proyección medida es estable
   ±1% entre 360–430 px de ancho, pero depende de esas constantes).
2. La bandeja es más circular que el "cuadrado orgánico" de la referencia;
   si se desea más fidelidad, ajustar `border-radius` de `.s5-tray`/
   `.s5-tray__surface` o sustituir por asset.
3. Los objetos de área son placeholders procedurales intencionalmente
   sobrios; Codex los reemplazará por assets curados.
4. La transición pixelart W5→final ya existía y no se tocó; el CTA navega a
   `/transition/world-5-to-final` (config previa `worldFiveToFinalTransition`).
5. `world5EditorialSlots.ts` queda sin consumidores de runtime (igual que
   ocurrió con world4EditorialSlots); decidir su futuro en un ticket de
   contenido.
