# T003D - TransitionWorld static polish + asset staging

## 1. Resumen

T003D refina la vista tecnica no interactiva de `TransitionWorld` para acercarla a la referencia visual de la primera transicion:

`Portada / Intro -> Mundo I: Raiz`

Estado final del ticket:

`TRANSITION_WORLD_STATIC_POLISH_T003D / EN_REVISION_VISUAL`

La pantalla sigue disponible solo como preview aislado en `/dev/transition-world`. No se conecta con Portada / Intro, no navega hacia Mundo I y no implementa interaccion nueva.

## 2. Rama base y rama final

- Rama base: `feature/003C-transition-world-visual-alignment-assets`
- Commit base: `1ea3245 feat: align transition world visual direction`
- Rama final: `feature/003D-transition-world-static-polish-assets`

## 3. Problema visual abordado

T003C habia mejorado la direccion general, pero todavia tenia tres riesgos visuales:

- un poligono luminoso superior que competia como segundo foco;
- portal todavia demasiado ancho, con lectura cercana a gema/capullo;
- barra y Lía fallback con presencia insuficiente para la pausa de transicion.

T003D ataca esos puntos sin cambiar la pantalla en producto ni integrar assets finales.

## 4. Cambios principales de composicion

- Se retiro el foco visual superior grande ocultando las nieblas decorativas que generaban una segunda lectura.
- El stage se centro con mas calma vertical y el stack visual quedo menos alto.
- El portal se redibujo como arco vertical luminoso, mas parecido a una puerta/umbral.
- Lía fallback conserva su rol lateral a la izquierda del portal, con mayor legibilidad y ojos mas delicados.
- La barra de progreso gano longitud y fuerza visual sin mostrar numeros ni porcentaje.
- Los textos se conservaron exactos:
  - `Abriendo Mundo I: Raíz...`
  - `Preparando recorrido...`

## 5. Valores y decisiones tecnicas

- Version expuesta: `T003D_STATIC_POLISH`
- Ruta preview: `/dev/transition-world`
- Transition id: `intro-to-station-1`
- Duracion normal: `2300ms`
- Reduced motion: `1000ms`
- Portal width: `clamp(168px, 43vw, 198px)`
- Progress width: `clamp(226px, 66vw, 292px)`
- Barra: track de 3px, caps pixelados y marcador limpio.
- SVGs inline locales: portal y Lía fallback.
- Assets runtime finales: no integrados.

## 6. Portal

El portal conserva construccion local por SVG inline con `shapeRendering="crispEdges"`.

Cambios de T003D:

- viewBox vertical `180 x 284`;
- arco exterior mas alto;
- centro mas luminoso y menos mineral;
- simbolo raiz central mas sobrio;
- highlights internos discretos;
- sin imagen externa ni recurso remoto.

El objetivo fue que se lea como umbral hacia Mundo I: Raiz, no como gema, huevo, cueva o capullo.

## 7. Lía fallback

Lía sigue siendo placeholder temporal para la transicion.

Cambios de T003D:

- mayor escala dentro del stack visual;
- ojos convertidos a formas mas suaves;
- petalos y collar conservan identidad simplificada;
- sin brazos, manos, piernas, boca, nariz ni rasgos humanos;
- no reemplaza el micro-rig final recomendado.

Decision: la version final de transicion deberia usar un micro-rig especifico de Lía, no depender de este fallback inline.

## 8. Barra de progreso

La barra se hizo mas fuerte y mas clara para lectura mobile:

- ancho entre 58% y 72% aproximado del viewport segun tamano;
- track fino;
- relleno ambar;
- caps y marker pixelart;
- sin porcentaje;
- sin numeros;
- sin texto adicional;
- sin comportamiento funcional de navegacion.

## 9. Assets y staging

No se crearon ni integraron assets runtime finales.

Se creo staging documental en:

- `src/assets/transition-world/root/README.md`
- `src/assets/transition-world/root/asset-manifest.transition-root.json`

El manifest define assets pendientes y capturas documentales integradas:

- `lia_transition_root_idle_4f`
- `lia_transition_root_guide_2f`
- `lia_transition_root_exit_1f`
- `lia_transition_root_blink_1f`
- `portal_root_base`
- `portal_root_glow`
- `symbol_root`
- `transition_root_review_capture_390x844`
- `transition_root_review_capture_430x932`

Los assets pendientes quedan con estado `pending`. Las capturas T003D quedan con estado `integrated`, pero solo como evidencia documental, no como runtime.

## 10. Capturas generadas

- `docs/visual/transition-world/validation/t003d/transition-world-t003d-390x844.png`
- `docs/visual/transition-world/validation/t003d/transition-world-t003d-430x932.png`

Las capturas validan:

- sin segundo foco superior dominante;
- portal centrado y vertical;
- Lía visible a la izquierda del portal;
- texto principal en una linea para 390 y 430;
- barra mas larga y legible;
- sin botones ni interaccion.

## 11. Validaciones ejecutadas

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

Resultados:

- `npm run lint`: OK
- `npm run test`: OK, 5 archivos y 39 tests
- `npm run build`: OK
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests
- `npm run test:e2e`: OK, 30 tests

## 12. Fuera de alcance confirmado

- No se implemento ruta funcional de transicion.
- No se conecto con Portada / Intro.
- No se navego a Mundo I.
- No se modifico Portada / Intro.
- No se modifico Carga Inicial.
- No se crearon assets runtime finales.
- No se agregaron dependencias.
- No se uso CDN.
- No se usaron recursos externos.
- No se agrego audio.
- No se agrego video runtime.
- No se uso Three.js, React Three Fiber, Drei, Blender ni GLB.

## 13. Riesgos pendientes

- El portal inline ya es mejor como direccion visual, pero no sustituye un asset final aprobado.
- Lía fallback es suficiente para preview, pero la transicion final necesita micro-rig o asset especifico.
- La barra comunica una pausa breve, pero aun no representa progreso real de navegacion.
- La transicion sigue aislada en `/dev/transition-world`.

## 14. Decision para T003E

Pasar a T003E solo cuando el usuario apruebe visualmente esta base estatica.

Recomendacion para T003E:

1. preparar micro-rig real de Lía para transicion;
2. aprobar portal final o derivar asset runtime limpio desde la referencia;
3. mantener `/dev/transition-world` aislado hasta tener ticket explicito de integracion con Portada / Intro;
4. no conectar navegacion real hasta que el placeholder de Mundo I y el handoff esten aprobados.
