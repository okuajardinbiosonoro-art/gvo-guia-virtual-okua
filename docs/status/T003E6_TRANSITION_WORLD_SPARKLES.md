# T003E6 - TransitionWorld ambient sparkles

## 1. Resumen del ticket

T003E6 agrega sparkles ambientales discretos a la pantalla tecnica aislada:

`/dev/transition-world`

El cambio no conecta navegacion real, no modifica Portada / Intro y no reabre Carga Inicial. La intencion es sumar una capa viva de fondo para la transicion entre mundos, tomando como referencia conceptual los sparkles deterministas de Carga Inicial, pero sin reutilizar ni modificar assets runtime.

Estado:

`TRANSITION_WORLD_AMBIENT_SPARKLES_T003E6 / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E5A-transition-motion-polish-lia-progress`
- Commit base: `46b6aa1 fix: polish transition motion for lia and progress`
- Rama final: `feature/003E6-transition-world-sparkles`

## 3. Que se encontro en Carga Inicial

La auditoria de Carga Inicial encontro:

- `loadingInitialScene.ts` define 10 slots deterministas de sparkles.
- `LoadingInitialScreen.tsx` renderiza los sparkles como elementos decorativos con `aria-hidden`.
- `LoadingInitialScreen.css` usa variables CSS por slot para `x`, `y`, `delay` y `duration`.
- El pulso visual se basa en opacidad baja, escala sutil y delays escalonados.
- Reduced motion no mantiene loops fuertes.

Se reutilizo el patron conceptual: slots deterministicos, delays/duraciones por slot, opacidad baja, escala sutil y reduccion en reduced motion.

No se copiaron assets PNG ni se modifico Carga Inicial.

## 4. Implementacion de sparkles en TransitionWorld

Se creo `TransitionSparkles` como capa nueva dentro de `TransitionWorld`.

Caracteristicas:

- 8 sparkles deterministicos.
- CSS puro, sin imagenes nuevas.
- Formas pixeladas construidas con pseudo-elementos cuadrados.
- Capa `ambient-background`, por detras de la escena principal.
- `aria-hidden="true"` para mantenerlos decorativos.
- `pointer-events: none` para no introducir interaccion.
- Tonos suaves: lilac, amber y pearl.

El componente expone:

```html
data-testid="transition-world-sparkles"
data-sparkle-reference="loading-initial-deterministic-slots"
data-sparkle-layer="ambient-background"
```

Cada sparkle expone:

```html
data-testid="transition-world-sparkle"
data-transition-sparkle-slot="..."
data-transition-sparkle-tone="..."
```

## 5. Slots T003E6

Los slots finales son:

1. `upper-left-air`
2. `upper-right-air`
3. `far-left-mist`
4. `far-right-mist`
5. `left-lower-air`
6. `right-lower-air`
7. `bottom-left-edge`
8. `bottom-right-edge`

Se ubicaron hacia bordes y aire de fondo para evitar tapar:

- Lia;
- portal;
- texto principal;
- texto secundario;
- progress bar;
- spark de progress.

## 6. Progress spark

No se ajusto el spark de la progress bar.

Se conserva la correccion T003E5A:

```css
--transition-progress-channel-center-y: 46%;
--transition-progress-spark-y: var(--transition-progress-channel-center-y);
```

El ticket T003E6 agrega solo sparkles ambientales, manteniendo la progress bar y su spark como estaban.

## 7. Reduced motion

Reduced motion conserva:

- sin loops fuertes;
- sparkles ambientales sin animacion;
- solo los primeros slots quedan con opacidad baja;
- sin parpadeo continuo;
- progress final visible;
- sin navegacion automatica.

La duracion tecnica de la transicion se mantiene en `1000ms` para reduced motion.

## 8. Confirmaciones de alcance

- No se modifico Carga Inicial.
- No se modifico Portada / Intro.
- No se agregaron assets PNG/WebP/SVG.
- No se instalaron dependencias.
- No se modifico tipografia.
- No se redisenio la progress bar.
- No se modifico el layout principal de TransitionWorld.
- No se agrego audio.
- No se agrego video runtime.
- No se uso CDN.
- No se usaron recursos externos.
- No se agrego Three.js, React Three Fiber ni 3D.
- No se conecto navegacion real hacia Mundo I.

## 9. Capturas generadas

Las capturas T003E6 esperadas son:

- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-start-390x844.png`
- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-mid-390x844.png`
- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-final-390x844.png`
- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-start-430x932.png`
- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-mid-430x932.png`
- `docs/visual/transition-world/validation/t003e6/transition-world-t003e6-final-430x932.png`

## 10. Validaciones

Comandos requeridos para el cierre:

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
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

Verificacion adicional en navegador interno:

- ruta: `http://127.0.0.1:5173/dev/transition-world`
- version DOM: `T003E6_AMBIENT_SPARKLES`
- sparkles ambientales: 8
- `aria-hidden`: `true`
- sin overflow horizontal
- sin botones, links, audio ni video
- progress spark conserva alineacion: delta Y `-1px`

## 11. Decision para proximos tickets

T003E7 puede avanzar a auditoria tipografica global si el usuario aprueba visualmente esta capa ambiental. T003E8 debe seguir bloqueado hasta que exista ticket explicito para conectar Portada / Intro -> TransitionWorld -> Mundo I.
