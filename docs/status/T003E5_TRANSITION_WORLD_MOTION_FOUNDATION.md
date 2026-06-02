# T003E5 - TransitionWorld motion foundation

## 1. Resumen del ticket

T003E5 implementa la primera base de motion local para la pantalla tecnica:

`/dev/transition-world`

La transicion sigue siendo un preview aislado. No se conecta con Portada / Intro, no navega hacia Mundo I y no agrega interaccion.

Estado:

`TRANSITION_WORLD_MOTION_FOUNDATION_T003E5 / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E4A-progress-fill-alignment`
- Commit base: `a0b6cf8 fix: align transition progress fill`
- Rama final: `feature/003E5-transition-world-motion-foundation`

## 3. Objetivo motion

La pantalla debe empezar a sentirse como:

`Lia acompana mientras se abre Mundo I: Raiz.`

La implementacion usa CSS animations, CSS variables y `data-*` attributes locales. No se agrego una maquina de estados compleja ni timers de navegacion.

## 4. Timeline implementado

- `0ms-250ms`: background y textura entran con fade calido.
- `150ms-450ms`: portal aparece en estado inicial sin zoom fuerte.
- `300ms-650ms`: Lia aparece con entrada suave desde la derecha.
- `550ms-1100ms`: portal cruza de inactive a activating y luego open.
- `850ms-1200ms`: Lia usa capa guide 2f durante un gesto breve.
- `1000ms-1850ms`: progress avanza con fill animado y spark alineado.
- `1850ms-2150ms`: progress llega a estado final y portal emite pulso bajo.
- `2050ms-2300ms`: Lia usa capa exit y aparece un fade final claro.
- Despues de `2300ms`: pantalla queda estable, sin ruta nueva ni navegacion.

## 5. Como se anima portal

`TransitionPortal` renderiza tres capas aprobadas:

- `portal_root_inactive`
- `portal_root_activating`
- `portal_root_open`

El cambio entre estados se resuelve por crossfade CSS con `steps(1, end)` para evitar interpolaciones borrosas. El portal no rota, no se deforma y conserva el foco central.

## 6. Como se anima Lia

`TransitionLiaSprite` ahora usa assets reales aprobados:

- `lia_transition_root_idle_4f`
- `lia_transition_root_guide_2f`
- `lia_transition_root_exit_1f`

La posicion y escala externa de Lia se conservan. El motion se limita a:

- entrada suave;
- idle por spritesheet 4f;
- guide breve por spritesheet 2f;
- exit final;
- flotacion leve posterior.

No se agregaron particulas pegadas a Lia.

## 7. Como se anima progress

`TransitionProgress` conserva la correccion T003E4A:

- fill debajo;
- track encima;
- spark encima;
- clip interno alineado al canal del track;
- sin porcentaje ni numeros visibles.

El fill pasa de inicio bajo a final completo y el spark se desplaza con la punta del avance.

## 8. Como funciona fade final

`TransitionFade` aplica un tint claro/lavanda/dorado al cierre. No usa pantalla negra, no oculta abruptamente textos y no dispara navegacion.

## 9. Reduced motion

Cuando `isReducedMotion` o `prefers-reduced-motion` aplican:

- se desactivan loops y desplazamientos largos;
- el portal queda en estado open;
- Lia queda en idle estatico;
- progress queda visible en estado final;
- fade se mantiene suave;
- duracion tecnica sigue en `1000ms`.

## 10. Confirmacion de no navegacion real

La ruta `/dev/transition-world` no navega automaticamente a `/mundo-i-raiz`.

No se agregaron botones ni enlaces.

## 11. Confirmacion de alcance

- No se modifico Portada / Intro.
- No se modifico Carga Inicial.
- No se modifico tipografia global.
- No se integraron sparkles globales.
- No se agregaron dependencias.
- No se uso CDN.
- No se agrego audio.
- No se agrego video.
- No se uso Three.js, React Three Fiber ni assets 3D.
- No se tocaron PNG/WebP runtime.

## 12. Capturas generadas

- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-start-390x844.png`
- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-mid-390x844.png`
- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-final-390x844.png`
- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-start-430x932.png`
- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-mid-430x932.png`
- `docs/visual/transition-world/validation/t003e5/transition-world-t003e5-final-430x932.png`

## 13. Validaciones ejecutadas

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

Resultados finales:

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 40 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

Verificacion adicional en navegador interno:

- ruta: `http://127.0.0.1:5173/dev/transition-world`
- version DOM: `T003E5_MOTION_FOUNDATION`
- motion mode: `css-timeline`
- progress motion: `fill-and-spark`
- sin overflow horizontal
- sin botones, links, audio ni video
- imagenes cargadas correctamente

## 14. Estado final del repo

El cierre debe quedar publicado en `feature/003E5-transition-world-motion-foundation` con working tree limpio.

## 15. Pendientes para siguientes tickets

- `T003E6`: sparkles reutilizables desde Carga Inicial.
- `T003E7`: auditoria tipografica global GVO.
- `T003E8`: integracion real Portada -> Transicion -> Mundo I.
- `T003H`: sistema compartido de progress bar GVO.
