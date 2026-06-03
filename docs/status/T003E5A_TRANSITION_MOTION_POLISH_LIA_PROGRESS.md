# T003E5A - Transition motion polish Lia + progress

## 1. Resumen del ticket

T003E5A pule la base de motion de `/dev/transition-world` sin cambiar el flujo ni conectar navegacion real.

Se corrigio:

- alineacion vertical del spark de la progress bar;
- tratamiento de los spritesheets de Lia como frames recortados;
- posicion de Lia hacia el lado izquierdo del portal;
- escala visual de Lia;
- salida de Lia hacia el portal;
- destello/fade final centrado en el portal.

Estado:

`TRANSITION_MOTION_POLISH_LIA_PROGRESS_T003E5A / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E5-transition-world-motion-foundation`
- Commit base: `a45e930 feat: add transition world motion foundation`
- Rama final: `feature/003E5A-transition-motion-polish-lia-progress`

## 3. Observaciones del usuario

1. La animacion general se ve bien.
2. El spark de barra estaba por debajo del canal.
3. Los spritesheets de Lia se percibian como imagenes completas o mal recortadas.
4. Lia debia moverse a la izquierda del portal.
5. Lia debia crecer un poco.
6. La salida debia sentirse como entrada/acompaniamiento hacia el portal.
7. El cierre podia usar destello o fade calido centrado en el portal.

## 4. Correccion del spark de progress

Se agregaron variables semanticas:

```css
--transition-progress-channel-center-y: 46%;
--transition-progress-spark-y: var(--transition-progress-channel-center-y);
```

El spark conserva el desplazamiento horizontal del avance, pero ahora se centra verticalmente sobre el canal visual. El layering se mantiene:

1. fill debajo;
2. track encima;
3. spark encima.

## 5. Correccion de sprite sheet de Lia

`TransitionLiaSprite` ahora usa viewports cuadrados con background CSS:

- `lia_transition_root_idle_4f`: `data-frame-count="4"`, frame `256x256`, `background-size: 400% 100%`.
- `lia_transition_root_guide_2f`: `data-frame-count="2"`, frame `256x256`, `background-size: 200% 100%`.
- `lia_transition_root_exit_1f`: `data-frame-count="1"`, frame `256x256`.

Esto evita mostrar el spritesheet completo como varias Lias al mismo tiempo.

## 6. Reubicacion de Lia a la izquierda

Lia paso de estar a la derecha del portal a estar en el lateral izquierdo:

```css
--transition-lia-left: clamp(-14px, -2.4vw, -6px);
--transition-lia-top: 57%;
```

El componente expone:

```html
data-lia-placement="left-of-portal"
data-lia-sprite-mode="cropped-background"
```

## 7. Aumento de escala de Lia

La escala se aumento moderadamente:

```css
--transition-lia-width: clamp(90px, 25vw, 112px);
```

No se aumento el portal ni la progress bar.

## 8. Salida de Lia hacia el portal

La fase final usa `lia_transition_root_exit_1f`.

El motion desplaza a Lia hacia el portal con un movimiento horizontal controlado y reduce su opacidad al cierre para sugerir entrada/acompaniamiento sin salto brusco.

## 9. Destello/fade final centrado en portal

Se agregaron dos capas CSS sin assets nuevos:

- `TransitionFade` con `data-motion-effect="portal-centered-flash"`;
- `portal::after` con radial glow calido centrado en el portal.

El efecto usa crema, dorado y lavanda suave. No hay pantalla negra ni flash agresivo.

## 10. Reduced motion

Reduced motion conserva:

- Lia visible estatica en el lado izquierdo;
- portal open visible;
- progress final visible;
- fade suave reducido;
- sin desplazamiento largo;
- sin sprite animation continua fuerte.

La duracion tecnica sigue en `1000ms`.

## 11. Confirmaciones de alcance

- No se tocaron assets PNG/WebP aprobados.
- No se editaron imagenes runtime.
- No se creo arte nuevo.
- No se modifico Portada / Intro.
- No se modifico Carga Inicial.
- No se conecto navegacion real.
- No se navega a Mundo I.
- No se cambio tipografia global.
- No se integraron sparkles globales.
- No se agregaron dependencias.
- No se uso CDN.
- No se agrego audio.
- No se agrego video.
- No se uso Three.js ni React Three Fiber.

## 12. Pendientes excluidos

- `T003E6`: sparkles reutilizables desde Carga Inicial.
- `T003E7`: auditoria tipografica global GVO.
- `T003E8`: integracion real Portada -> Transicion -> Mundo I.
- `T003H`: sistema compartido de progress bar GVO.

## 13. Capturas generadas

- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-start-390x844.png`
- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-mid-390x844.png`
- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-final-390x844.png`
- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-start-430x932.png`
- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-mid-430x932.png`
- `docs/visual/transition-world/validation/t003e5a/transition-world-t003e5a-final-430x932.png`

## 14. Validaciones ejecutadas

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
- version DOM: `T003E5A_MOTION_POLISH_LIA_PROGRESS`
- `data-lia-placement`: `left-of-portal`
- `data-lia-sprite-mode`: `cropped-background`
- `data-progress-spark-alignment`: `channel-centered`
- `data-motion-effect`: `portal-centered-flash`
- Lia a la izquierda del portal: centro X `188` vs portal centro X `300`
- spark centrado respecto a progress: delta Y `1px`
- sin overflow horizontal
- sin botones, links, audio ni video

## 15. Estado final del repo

El cierre debe quedar publicado en `feature/003E5A-transition-motion-polish-lia-progress` con working tree limpio.
