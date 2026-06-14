# 008G - Transicion W1 W2 y barra comun de carga

## 1. Proposito

Restaurar el flujo funcional entre Mundo I y Mundo II para que la salida de `ready_to_continue` pase por una transicion breve antes de llegar a `/estacion/2`, y unificar el contrato de barra de progreso usado por `LoadingInitial` y `TransitionWorld`.

## 2. Alcance

Ticket ejecutado como `RUNTIME_CONTROLADO_TRANSICION_Y_CARGA`.

Alcance aplicado:

- Barra comun de progreso para carga inicial y transiciones.
- Ruta funcional `/transition/world-1-to-world-2`.
- Salida de Mundo I hacia la transicion antes de `/estacion/2`.
- Textos temporales por slot editorial.
- Pruebas focalizadas y validacion local en navegador.

Fuera de alcance confirmado:

- Mundo II completo.
- Selector ES/EN e i18n completo.
- Contador diario de uso.
- QR/camara real.
- Assets nuevos o cambios en assets runtime.
- Dependencias nuevas.
- Build, check, format, audit, baseline completo y herramientas externas.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimos commits iniciales:

```text
8d2e6f0 feat: prepare Mundo II entry flow 008F
d7aaa0b docs: formalize security baseline decision 008H
39540a2 docs: test security baseline in sandbox 008E
00bbb28 docs: validate security baseline 008D
fad7cd4 feat: connect Mundo I exit flow 008C
```

## 4. Arquitectura previa

Antes de 008G:

- `LoadingInitial` renderizaba su barra de progreso directamente en `LoadingInitialScreen.tsx`.
- `TransitionWorld` renderizaba una barra de progreso propia basada en assets de transicion.
- Mundo I llegaba a `ready_to_continue`, pero el boton `Continuar` podia saltar conceptualmente directo al destino final de Mundo II.
- `/estacion/2` ya estaba conectado a `World2RootScreen` por 008F.

## 5. Cambio aplicado en barra de carga

Se creo `GvoProgressBar` como componente comun de contrato y accesibilidad para barras de progreso GVO.

La unificacion no crea assets nuevos y mantiene las diferencias visuales de cada pantalla mediante children, clases y variantes:

- variante `loading-initial`;
- variante `transition-world`;
- atributo comun `data-gvo-progress-bar`;
- rol `progressbar`;
- atributos ARIA existentes o equivalentes.

## 6. Componente comun usado o creado

Componente creado:

```text
src/components/progress/GvoProgressBar.tsx
src/components/progress/GvoProgressBar.css
src/components/progress/index.ts
```

Uso aplicado:

- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/TransitionWorld/components/TransitionProgress.tsx`

## 7. Cambio aplicado en flujo Mundo I -> Mundo II

`World1RootScreen` mantiene el estado `ready_to_continue`, pero el destino del boton `Continuar` pasa a:

```text
/transition/world-1-to-world-2
```

La transicion termina en:

```text
/estacion/2
```

## 8. Ruta de transicion usada

Ruta usada:

```text
/transition/world-1-to-world-2
```

Convencion usada:

- Se reutilizo `TransitionWorld`.
- Se agrego configuracion `worldOneToWorldTwoTransition`.
- Se mantuvo `/transition/intro-to-station-1` para la entrada a Mundo I.

## 9. Destino final de la transicion

Destino final:

```text
/estacion/2
```

Pantalla final observada:

```text
Mundo II: Lia y el pulso invisible
Estacion II en preparacion
```

## 10. Textos temporales agregados

Textos temporales:

```text
Abriendo Mundo II
Preparando el pulso invisible.
```

Archivo:

```text
src/content/transitionEditorialSlots.ts
```

## 11. Slots editoriales usados

Slots:

```text
TRANS_W1_W2_TITLE_01
TRANS_W1_W2_SUB_01
```

Los slots se exponen en DOM mediante:

```text
data-title-slot="TRANS_W1_W2_TITLE_01"
data-subtitle-slot="TRANS_W1_W2_SUB_01"
data-editorial-copy="temporary"
```

## 12. Confirmacion de textos no definitivos

Los textos nuevos quedaron marcados como temporales y reemplazables por matriz editorial futura.

No se trataron como copy definitivo.

## 13. Confirmacion ES/EN

No se implemento selector ES/EN.

No se implemento i18n completo.

La estructura creada permite migrar los textos temporales a una matriz de contenido por idioma sin reescribir componentes.

## 14. Confirmacion contador diario

No se implemento contador diario de uso.

Queda documentado como requerimiento futuro:

- contador diario de uso en PC host;
- sesion valida;
- integracion futura con QR;
- comparacion futura con flujo de caja/contabilidad.

## 15. Rutas validadas

URL local usada:

```text
http://127.0.0.1:5173
```

Rutas validadas:

- `/`
- `/portada`
- `/transition/intro-to-station-1`
- `/estacion/1`
- `/transition/world-1-to-world-2`
- `/estacion/2`
- `/qr/1`

## 16. Resultado del flujo manual

Flujo validado:

```text
/estacion/1
Explorar RELACION
Explorar PERCEPCION
Explorar MEDIACION
Cerrar raiz
Continuar
/transition/world-1-to-world-2
/estacion/2
```

Resultado observado:

- Mundo I llego a `ready_to_continue`.
- `data-world1-exit-ready="true"`.
- `data-world1-exit-target="/transition/world-1-to-world-2"`.
- Despues de `Continuar`, primero aparecio `/transition/world-1-to-world-2`.
- La transicion mostro `Abriendo Mundo II`.
- La transicion mostro `Preparando el pulso invisible.`.
- La transicion uso `data-gvo-progress-bar="transition-world"`.
- La transicion termino en `/estacion/2`.
- `/estacion/2` cargo `World2RootScreen`.

## 17. Resultado visual mobile

Validacion mobile con viewport `390x844` usando Chrome local existente:

- `/estacion/1`: sin overflow horizontal.
- `/transition/world-1-to-world-2`: sin overflow horizontal.
- Barra comun visible en mobile con rect aproximado `x=39`, `y=570`, `width=312`, `height=26`.
- `/estacion/2`: sin overflow horizontal.
- Sin imagenes rotas.
- Sin `audio`, `video` ni `canvas`.
- Sin errores de consola mobile.

## 18. Resultado visual desktop

Validacion desktop con viewport `1280x720`:

- Todas las rutas obligatorias cargaron.
- Sin overflow horizontal en rutas validadas.
- La barra de `LoadingInitial` expone `data-gvo-progress-bar="loading-initial"`.
- La barra de `TransitionWorld` expone `data-gvo-progress-bar="transition-world"`.
- Sin imagenes rotas.
- Sin recursos externos en imagenes/source.
- Sin `audio`, `video` ni `canvas`.

## 19. Resultado de consola

Resultado funcional:

- Sin errores JavaScript de la transicion.
- Sin errores JavaScript de Mundo I.
- Sin errores JavaScript de Mundo II.
- Sin errores en mobile.

Residual observado en Chrome local:

```text
GET http://127.0.0.1:5173/favicon.ico 404
```

Clasificacion:

- Residual preexistente/fuera de alcance.
- No corresponde a assets de 008G.
- No se corrigio porque `index.html` y `public/**` no estaban dentro de archivos permitidos.

## 20. Confirmacion QR/camara

No se activo QR real.

No se activo camara.

No se solicitaron permisos sensibles.

La ruta `/qr/1` siguio cargando como placeholder.

## 21. Gates parciales ejecutados

| Comando | Resultado | Estado |
| --- | --- | --- |
| `git status --short --branch` | `## main...origin/main` antes de cambios | Paso |
| `git log --oneline -n 5` | Ultimo commit sincronizado `8d2e6f0` | Paso |
| `git diff --check` | Sin errores de whitespace; advertencias LF/CRLF de Git en Windows | Paso |
| `npm run lint` | ESLint sin errores tras correccion | Paso |
| `npm run test -- LoadingInitial` | 2 archivos, 11 tests pasados | Paso |
| `npm run test -- TransitionWorld` | 1 archivo, 11 tests pasados | Paso |
| `npm run test -- World1RootScreen` | 1 archivo, 11 tests pasados | Paso |
| `npm run test -- World2RootScreen` | 1 archivo, 1 test pasado | Paso |
| `npm run dev -- --host 127.0.0.1` | Vite disponible en `http://127.0.0.1:5173/` | Paso |

## 22. Gates no ejecutados

No ejecutados por prohibicion del ticket:

- `npm run build`
- `npm run check`
- `npm run format`
- `npm audit`
- `npm install`
- `npm update`
- `npx`
- baseline completo
- `pre-commit`
- `gitleaks`
- `scripts/run_security_checks.ps1`
- Graphify
- SkillCheck
- Claude Code
- Spec-kit
- Gstack
- Claude Council
- MCP

## 23. Riesgos residuales

| Riesgo | Estado | Mitigacion |
| --- | --- | --- |
| `favicon.ico` 404 en Chrome local | Residual fuera de alcance | Documentar; corregir solo con ticket que permita tocar `index.html` o `public/**`. |
| Textos temporales W1 -> W2 | Aceptado por ticket | Marcados con slots editoriales reemplazables. |
| Mundo II sigue como entrada base, no experiencia completa | Aceptado por ticket | Mantener hasta ticket de diseno/implementacion Mundo II. |
| No se implemento ES/EN | Aceptado por ticket | Estructura de slots permite migracion posterior. |
| No se implemento contador diario | Aceptado por ticket | Documentado para ticket futuro. |

## 24. Matriz obligatoria - Cambios

| Area | Archivo | Cambio aplicado | Motivo | Riesgo | Validacion |
| --- | --- | --- | --- | --- | --- |
| Barra comun de carga | `src/components/progress/GvoProgressBar.tsx` | Componente comun con variante, ARIA y data contract | Unificar LoadingInitial y TransitionWorld | Bajo | Lint, tests y navegador |
| Barra comun de carga | `src/components/progress/GvoProgressBar.css` | Base minima `box-sizing` | Evitar duplicacion visual invasiva | Bajo | Lint |
| Barra comun de carga | `src/components/progress/index.ts` | Export publico local | Mantener import limpio | Bajo | Lint |
| LoadingInitial / pre-portada | `src/screens/LoadingInitial/LoadingInitialScreen.tsx` | Reemplazo de wrapper progress por `GvoProgressBar` | Usar contrato comun | Medio | `npm run test -- LoadingInitial` |
| LoadingInitial / pre-portada | `src/screens/LoadingInitial/LoadingInitialScreen.test.tsx` | Verificacion de `data-gvo-progress-bar="loading-initial"` | Cubrir contrato nuevo | Bajo | `npm run test -- LoadingInitial` |
| TransitionWorld | `src/screens/TransitionWorld/components/TransitionProgress.tsx` | Uso de `GvoProgressBar` preservando assets existentes | Unificar barra sin cambiar assets | Medio | `npm run test -- TransitionWorld` |
| TransitionWorld | `src/screens/TransitionWorld/TransitionWorld.tsx` | Configurable por preload de destino | Permitir transicion W1 -> W2 sin cargar Mundo I | Medio | Tests y navegador |
| TransitionWorld | `src/screens/TransitionWorld/transitionWorld.config.ts` | Config `worldOneToWorldTwoTransition` | Crear transicion funcional nueva | Medio | Tests y navegador |
| TransitionWorld | `src/screens/TransitionWorld/transitionWorld.types.ts` | Slots y target preload tipados | Preparar copy temporal y preload controlado | Bajo | Lint |
| TransitionWorld | `src/screens/TransitionWorld/components/TransitionText.tsx` | Exposicion de metadata editorial temporal | Auditar slots en DOM | Bajo | Test y navegador |
| TransitionWorld | `src/screens/TransitionWorld/index.ts` | Export de config si se requiere | Mantener acceso local | Bajo | Lint |
| Transicion Mundo I -> Mundo II | `src/app/routes.ts` | Ruta `/transition/world-1-to-world-2` | Formalizar transicion funcional | Medio | Navegador |
| Transicion Mundo I -> Mundo II | `src/app/router.tsx` | Ruta runtime para W1 -> W2 | Conectar transicion al router | Medio | Navegador |
| Salida desde Mundo I | `src/screens/World1Root/World1RootScreen.tsx` | `Continuar` navega a transicion | Evitar salto directo a `/estacion/2` | Medio | `npm run test -- World1RootScreen`, navegador |
| Salida desde Mundo I | `src/screens/World1Root/World1RootScreen.test.tsx` | Test de destino de salida | Cubrir flujo corregido | Bajo | `npm run test -- World1RootScreen` |
| Entrada `/estacion/2` | `src/screens/World2Root/**` | Sin cambios | Mantener entrada base 008F | Bajo | `npm run test -- World2RootScreen`, navegador |
| Textos temporales | `src/content/transitionEditorialSlots.ts` | Slots W1 -> W2 temporales | Evitar hardcode definitivo | Bajo | Tests y navegador |
| Slots editoriales | `src/screens/TransitionWorld/TransitionWorld.test.tsx` | Verificacion de slots temporales | Evidencia de migrabilidad futura | Bajo | `npm run test -- TransitionWorld` |
| QR/camara | Sin cambios runtime QR/camara | No se activo flujo real | Cumplir prohibicion | Bajo | `/qr/1`, conteo sin permisos |
| Assets runtime | Sin cambios en `public/assets/**` ni `assets/**` | Reuso de assets existentes | Evitar expansion visual no aprobada | Bajo | Git status y navegador |
| Gates parciales | Validaciones permitidas | Lint, tests focalizados, navegador local | Cierre tecnico seguro | Bajo | Gates pasados |

## 25. Matriz obligatoria - Validacion

| Ruta | Resultado esperado | Resultado observado | Consola | Permisos sensibles | Estado |
| --- | --- | --- | --- | --- | --- |
| `/` | Carga inicial con barra comun | `data-gvo-progress-bar="loading-initial"` | Sin error JS; favicon 404 residual | No | Paso |
| `/portada` | Portada existente | `EL ARCHIVO VIVO DE OKUA` | Sin error JS; favicon 404 residual | No | Paso |
| `/transition/intro-to-station-1` | Transicion existente a Mundo I | `data-gvo-progress-bar="transition-world"` y destino `/estacion/1` | Sin error JS; favicon 404 residual | No | Paso |
| `/estacion/1` | Mundo I inicial | Renderiza `Antes de escuchar...` | Sin error JS; favicon 404 residual | No | Paso |
| `/transition/world-1-to-world-2` | Transicion nueva W1 -> W2 | `Abriendo Mundo II`, slot title/subtitle y destino `/estacion/2` | Sin error JS; favicon 404 residual | No | Paso |
| `/estacion/2` | Entrada base Mundo II | `Mundo II: Lia y el pulso invisible` | Sin error JS; favicon 404 residual | No | Paso |
| `/qr/1` | Placeholder QR | Placeholder `GVO - Guia Virtual OKUA` | Sin error JS; favicon 404 residual | No | Paso |

## 26. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
| --- | --- | --- | --- | --- | --- |
| `008G-PUSH` | Sincronizar transicion W1 -> W2 y barra comun | Publica el commit aprobado | Bajo si 008G queda aprobado | Ejecutar primero | `008G-PUSH - Sincronizar transicion W1->W2 y barra comun` |
| `009A` | Disenar experiencia completa de Mundo II con estructura editorial temporal | Retoma desarrollo funcional | Alto si se hace antes de sincronizar 008G | Esperar a 008G-PUSH | `009A - Disenar experiencia completa de Mundo II` |
| `009B` | Preparar arquitectura de contenido editorial ES/EN | Ordena migracion de textos | Medio por alcance transversal | Programar despues de estabilizar Mundo II base | `009B - Arquitectura de contenido editorial ES/EN` |
| `009C` | Disenar contador diario de uso | Atiende control operativo del PC host | Medio por privacidad/estado local | Mantener separado de Mundo II visual | `009C - Contador diario de uso` |
| `008I` | Preparar entorno externo de seguridad | Refuerza gates fuera del runtime | Medio por tooling externo | Hacer solo si se pausa desarrollo visual | `008I - Entorno externo de seguridad` |

## 27. Siguiente paso recomendado

Preparar:

```text
008G-PUSH - Sincronizar transicion W1->W2 y barra comun
```

No avanzar a `009A` antes de cerrar y sincronizar 008G.

## 28. Confirmaciones finales del reporte

- No se hizo push.
- No se creo rama.
- No se creo commit todavia.
- No se creo Pull Request.
- `PR_NO_APLICA`.
- No se instalaron dependencias.
- No se ejecuto red externa.
- No se tocaron `package.json` ni lockfiles.
- No se tocaron `public/assets/**`.
- No se tocaron `assets/**`.
- No se tocaron Atlas 006I.
- No se activaron QR/camara ni permisos sensibles.
- No se ejecuto `okua-delivery-md`.
- Servidor local detenido al cierre de validacion.
- Puerto `5173` confirmado sin listeners tras validacion.
