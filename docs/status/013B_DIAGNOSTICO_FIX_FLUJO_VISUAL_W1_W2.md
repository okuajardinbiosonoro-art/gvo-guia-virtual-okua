# 013B - Diagnostico y fix critico de flujo visual W1-W2

## 1. Proposito

Diagnosticar y corregir el bloqueo visual/funcional reportado al finalizar Estacion I, validar el avance W1-W2 y dejar documentadas las deudas de barra de carga, patron de avance y estrategia visual antes de avanzar a assets definitivos, Excel real, contador diario o pulido mayor.

## 2. Alcance

Ticket ejecutado: `013B - Diagnostico y correccion critica de flujo visual W1-W2`.

Tipo de ticket: `DIAGNOSTICO_FIX_CRITICO_VISUAL_SIN_FEATURE_MAYOR`.

Alcance aplicado:

- Revision de `World1Root`, `LoadingInitial`, `TransitionWorld`, `GvoProgressBar`, rutas y documentos de estado.
- Correccion minima dentro de `src/screens/World1Root/**`.
- Documentacion en `docs/status/013B_DIAGNOSTICO_FIX_FLUJO_VISUAL_W1_W2.md`.
- Sin avanzar a `012G`.
- Sin leer ni importar Excel real.
- Sin reemplazar textos `TEMP`.
- Sin crear assets finales.
- Sin activar QR/camara.
- Sin implementar contador diario.
- Sin ejecutar herramientas externas de seguridad/agentes.

## 3. Estado Git inicial

```text
## main...origin/main
```

Working tree inicial: limpio.

Ultimo commit sincronizado observado:

```text
0e63943 tools: add offline editorial Excel validator 012F
```

## 4. Archivos revisados

- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World1Root/World1RootScreen.css`
- `src/screens/World1Root/World1RootScreen.test.tsx`
- `src/screens/World1Root/layout/World1RootStageFrame.tsx`
- `src/screens/World1Root/layout/World1RootStageFrame.css`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/screens/TransitionWorld/TransitionWorld.tsx`
- `src/screens/TransitionWorld/TransitionWorld.module.css`
- `src/screens/TransitionWorld/components/TransitionProgress.tsx`
- `src/components/progress/GvoProgressBar.tsx`
- `src/components/progress/GvoProgressBar.css`
- `src/app/routes.ts`
- `src/app/router.tsx`
- `docs/status/013A_REVISION_FUNCIONAL_INTEGRAL_W1_FINAL.md`

## 5. Problema reportado por usuario

Al intentar terminar Estacion I, la parte inferior de la pantalla no cargaba visualmente y el usuario no podia avanzar con confianza hacia la transicion W1-W2.

El problema fue tratado como bug funcional critico porque el avance desde Mundo I depende de la visibilidad y disponibilidad del estado `ready_to_continue` y del control `Continuar`.

## 6. Reproduccion del bug Estacion I

Servidor local usado:

```text
npm run dev -- --host 127.0.0.1 --port 5173
```

Nota operativa: el puerto `5173` ya tenia un proceso Vite activo de este mismo repo. Se reutilizo para la reproduccion y luego se detuvo.

Rutas validadas en navegador local con Chrome:

```text
/
/portada
/transition/intro-to-station-1
/estacion/1
/transition/world-1-to-world-2
/estacion/2
/final
```

Viewports validados:

```text
mobile: 390 x 844
desktop: 1365 x 768
```

Pasos reproducidos en `/estacion/1`:

1. Cargar Estacion I.
2. Activar `RELACION`.
3. Activar `PERCEPCION`.
4. Activar `MEDIACION`.
5. Ejecutar `Cerrar raiz`.
6. Llegar a `ready_to_continue`.
7. Medir copy, boton y pseudo-elementos inferiores.
8. Ejecutar `Continuar`.
9. Confirmar navegacion a `/transition/world-1-to-world-2`.

Resultado pre-fix:

- El boton `Continuar` existia en DOM, estaba habilitado y navegaba.
- Visualmente estaba bajo una banda solida de la capa `World1RootStageFrame::after`.
- En mobile, la banda media aproximadamente `117.969px` y tenia `z-index: 20`.
- En desktop, la banda media aproximadamente `134.266px` y tenia `z-index: 20`.
- El boton quedaba dentro de esa zona inferior cubierta.

## 7. Causa tecnica encontrada

La causa exacta fue una superposicion visual en `src/screens/World1Root/layout/World1RootStageFrame.css`:

```css
.world1-root-stage-frame::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  height: 18%;
  background: #0a0604;
  pointer-events: none;
}
```

Ese pseudo-elemento pintaba una banda solida sobre el 18% inferior del escenario. Como la capa de coordenadas interna ya contiene su propio degradado inferior en `z-index: 5`, y el copy/boton viven sobre esa capa en `z-index: 7/8`, el pseudo-elemento externo con `z-index: 20` quedaba por encima del UI.

La navegacion funcionaba por DOM porque la banda usaba `pointer-events: none`, pero visualmente ocultaba la parte inferior.

## 8. Correccion aplicada o razon de bloqueo

Correccion aplicada en:

```text
src/screens/World1Root/layout/World1RootStageFrame.css
```

Cambio minimo:

```css
.world1-root-stage-frame::after {
  content: none;
}
```

No se modificaron assets, textos, rutas, datos, dependencias ni arquitectura.

El degradado interno de `.world1-root-stage-coordinate-layer::after` se conserva como tratamiento visual inferior, pero queda detras del copy y el boton.

## 9. Validacion mobile

Viewport:

```text
390 x 844
```

Post-fix en `/estacion/1#ready`:

```text
state: ready_to_continue
continueDisabled: false
routeTarget: /transition/world-1-to-world-2
stageAfter.content: none
buttonWithinViewport: true
buttonHitTag: BUTTON.world1-root-continue world1-root-continue--ready
afterContinue.currentPath: /transition/world-1-to-world-2
```

Mediciones relevantes:

```text
stage bottom: 750.70
copy bottom: 699.70
button top: 703.70
button bottom: 737.70
viewport height: 844
```

Resultado: aprobado. La parte inferior queda visible, el boton esta dentro del viewport y el avance W1-W2 queda disponible.

## 10. Validacion desktop

Viewport:

```text
1365 x 768
```

Post-fix en `/estacion/1#ready`:

```text
state: ready_to_continue
continueDisabled: false
routeTarget: /transition/world-1-to-world-2
stageAfter.content: none
buttonWithinViewport: true
buttonHitTag: BUTTON.world1-root-continue world1-root-continue--ready
afterContinue.currentPath: /transition/world-1-to-world-2
```

Mediciones relevantes:

```text
stage bottom: 757.98
copy bottom: 706.98
button top: 709.98
button bottom: 744.98
viewport height: 768
```

Resultado: aprobado. La salida de Mundo I es visible y navegable en escritorio.

## 11. Validacion consola/pageerror

Validacion inicial:

- Sin `pageerror`.
- Se observo un mensaje 404 generico y algunas solicitudes `ERR_ABORTED` durante navegaciones rapidas entre rutas.

Validacion aislada posterior con `networkidle` en `/`, `/transition/intro-to-station-1` y `/transition/world-1-to-world-2`:

```text
httpErrors: []
failed: []
```

Resultado: no se confirmo un error de red/asset persistente asociado al fix. Las solicitudes abortadas se atribuyen al cambio rapido de ruta durante la medicion automatizada.

## 12. Resultado de avance W1-W2

Resultado post-fix:

- `/estacion/1` carga.
- Estado `ready_to_continue` alcanzable.
- `Continuar` queda habilitado.
- `data-world1-exit-target` apunta a `/transition/world-1-to-world-2`.
- Click en `Continuar` navega a `/transition/world-1-to-world-2`.
- `/transition/world-1-to-world-2` usa `GvoProgressBar` con variante `transition-world`.
- `/estacion/2` carga como experiencia temporal de Mundo II.

## 13. Diagnostico de pre-portada vs transicion

`LoadingInitial` y `TransitionWorld` usan el componente comun:

```text
src/components/progress/GvoProgressBar.tsx
```

Diferencia actual:

- `LoadingInitial` usa `variant="loading-initial"` y una barra CSS/pixel propia dentro del wrapper comun.
- `TransitionWorld` usa `variant="transition-world"` con assets visuales de track/fill/spark.
- Comparten semantica de `role="progressbar"` y contenedor comun, pero no comparten la misma familia visual de assets/tokens.

Conclusion: el fix anterior quedo como integracion parcial de componente comun, no como unificacion visual completa.

## 14. Correccion aplicada a barra de carga o deuda documentada

No se aplico correccion de barra en este ticket porque alinear visualmente pre-portada y transiciones requiere una decision de diseno mayor: reutilizar assets de barra, crear tokens visuales comunes o producir un set liviano coherente.

Deuda documentada:

- Definir si la barra de `LoadingInitial` debe migrar a la familia visual `transition-world`.
- Evitar duplicar markup de progreso si se decide unificar.
- Mantener `GvoProgressBar` como API comun.
- No crear assets nuevos hasta aprobar pipeline visual.

## 15. Evaluacion de patron `Continuar`

El patron actual es funcional, accesible y claro, pero su estetica es mas UI convencional que escena organica. En Mundo I el boton ayuda a evitar navegacion accidental, pero puede sentirse externo a la narrativa visual.

Evaluacion:

- Claridad: alta.
- Accesibilidad: alta por ser `button` nativo, con estado `disabled` y texto visible.
- Riesgo de confusion: bajo.
- Costo tecnico: bajo.
- Compatibilidad mobile: alta.
- Compatibilidad con lector de pantalla: alta.
- Adecuacion estetica GVO: media.

Recomendacion: mantener `Continuar` como fallback accesible mientras se disena un patron visual mas integrado para tickets posteriores.

## 16. Alternativas recomendadas de avance

| Patron | Descripcion | Ventaja | Riesgo | Accesibilidad | Recomendacion |
| --- | --- | --- | --- | --- | --- |
| Continuar | Boton explicito habilitado al finalizar escena | Muy claro y facil de testear | Puede sentirse externo a la escena | Alta | Mantener como fallback hasta aprobar patron visual |
| Seguir la señal | CTA narrativo asociado a una luz/senal final | Mayor integracion estetica | Puede ser ambiguo si no parece accionable | Media si conserva boton semantico | Recomendado como evolucion visual con boton DOM subyacente |
| Abrir siguiente mundo | CTA textual orientado a mundo siguiente | Claro en flujo por mundos | Menos poetico | Alta | Opcion valida para transiciones principales |
| Entrar al siguiente mundo | CTA directo y narrativo | Buen balance claridad/narrativa | Puede anticipar demasiado el proximo mundo | Alta | Recomendado para rutas Wn-Wn+1 |
| Tocar nodo final para avanzar | El ultimo nodo habilita avance contextual | Muy organico | Riesgo de no descubrimiento | Media-baja si no hay etiqueta clara | Explorar solo con affordance visible y aria-label |
| Avance por activacion contextual | Zona iluminada o portal activa salida | Muy integrado | Puede fallar en mobile si el area no es obvia | Media | Requiere prototipo de usabilidad |
| Avance por gesto o zona iluminada | Gesto/tap en zona de escena | Cinematico | Riesgo alto para lector de pantalla y usuarios nuevos | Baja-media | No usar sin fallback visible |
| Progreso organico por escena | La escena avanza sin boton explicito | Flujo suave | Menor control del usuario | Baja si no hay control alterno | No recomendado como unico mecanismo |

Direccion recomendada: evolucionar hacia `Seguir la señal` o `Entrar al siguiente mundo` como boton DOM estilizado/integrado, manteniendo `Continuar` como fallback semantico mientras se prueba el patron.

## 17. Evaluacion de estrategia visual/animacion

| Opcion | Uso recomendado | Peso esperado | Dependencias | Riesgo repo | Riesgo mobile | Recomendacion |
| --- | --- | --- | --- | --- | --- | --- |
| CSS/SVG procedural | Microanimaciones, luces, UI, estados simples | Bajo | Ninguna si se mantiene CSS/SVG local | Bajo | Bajo-medio por performance si se abusa de filtros | Recomendado para capas livianas y prototipos |
| PNG/WebP optimizado | Fondos, personajes, estados por capas, sprites | Bajo-medio si se comprime y archiva evidencia pesada | Ninguna | Medio si no hay manifiestos/archivo historico | Bajo si se controla dimension y preload | Recomendado como base principal actual |
| Lottie/dotLottie local | Animaciones vectoriales cerradas y livianas | Medio | Runtime adicional si se integra | Medio | Medio por CPU/render | Evaluar en sandbox antes de runtime |
| Rive local | Interactividad animada avanzada | Medio | Runtime adicional | Medio-alto | Medio-alto si hay escenas complejas | No integrar sin piloto externo |
| Three.js/R3F | 3D interactivo o escenas espaciales | Alto | Dependencias pesadas | Alto | Alto | No recomendado para esta fase |
| glTF/GLB | Assets 3D optimizados si se aprueba 3D | Medio-alto | Viewer/runtime 3D | Alto | Alto | Bloquear hasta estrategia 3D formal |
| Video renderizado | Handoff, evidencia, prototipo no interactivo | Alto | Player nativo pero peso alto | Alto por archivos grandes | Alto por carga/consumo | No usar como runtime principal |

## 18. Recomendacion de herramientas y enfoque visual

Enfoque recomendado:

- Mantener runtime local, liviano y auditable.
- Priorizar `PNG/WebP optimizado` por capas y sprites para mundos narrativos.
- Usar `CSS/SVG procedural` para microinteracciones, brillos, progreso, transiciones y estados.
- Tratar Lottie/Rive como investigacion externa previa, nunca como integracion directa sin ticket de sandbox.
- Evitar video pesado como runtime.
- Evitar CDN, assets remotos y dependencias nuevas.
- Mantener manifiestos livianos y archivo historico externo para evidencia visual pesada.

## 19. Riesgos residuales

- La barra `LoadingInitial` y `TransitionWorld` comparten wrapper comun pero no lenguaje visual completo.
- El patron `Continuar` sigue siendo funcional, pero no plenamente integrado a la escena.
- Las estaciones II-V y Final son funcionales/temporales y visualmente basicas por alcance aprobado previo.
- La estrategia definitiva de assets/animacion aun requiere ticket dedicado.
- El proceso automatico de navegador puede abortar requests si navega rapidamente; la validacion aislada no mostro fallos persistentes.

## 20. Siguiente paso recomendado

Despues de aprobar y commitear 013B:

```text
013B-PUSH - Sincronizar fix flujo visual W1-W2
```

Luego decidir entre:

```text
013C - Definir sistema visual/animacion y pipeline de assets GVO
```

o:

```text
014A - Producir assets visuales Estacion II con pipeline aprobado
```

## Matriz obligatoria - Bug Estacion I

| Caso | Viewport | Resultado esperado | Resultado observado | Causa | Correccion | Resultado final |
| --- | --- | --- | --- | --- | --- | --- |
| Mundo I final mobile 390x844 | 390 x 844 | Parte inferior visible, boton habilitado y dentro de viewport | Pre-fix: boton funcional pero visualmente bajo banda solida inferior `z-index: 20` | `World1RootStageFrame::after` cubria 18% inferior | `content: none` en pseudo-elemento externo | Aprobado: `ready_to_continue`, boton visible, click navega |
| Mundo I final desktop 1365x768 | 1365 x 768 | Parte inferior visible, boton habilitado y dentro de viewport | Pre-fix: boton funcional pero bajo banda solida inferior `z-index: 20` | Misma superposicion visual | Misma correccion CSS | Aprobado: `ready_to_continue`, boton visible, click navega |
| Transicion W1-W2 mobile | 390 x 844 | Cargar `/transition/world-1-to-world-2` con barra de transicion | Ruta cargo con H1 `Abriendo Mundo II` y `GvoProgressBar` `transition-world` | No aplica | Sin cambio | Aprobado |
| Transicion W1-W2 desktop | 1365 x 768 | Cargar `/transition/world-1-to-world-2` con barra de transicion | Ruta cargo con H1 `Abriendo Mundo II` y `GvoProgressBar` `transition-world` | No aplica | Sin cambio | Aprobado |

## Matriz obligatoria - Loading / transicion

| Pantalla | Componente de barra | Assets / tokens visuales | Estado actual | Problema | Accion | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| LoadingInitial | `GvoProgressBar` `variant="loading-initial"` | Barra CSS/pixel propia, tokens `--loading-*` | Funcional y presente en `/` | No comparte assets visuales con transiciones | Documentar deuda, no redisenar en 013B | Deuda clara para ticket posterior |
| TransitionWorld intro-to-station-1 | `GvoProgressBar` `variant="transition-world"` | Assets locales track/fill/spark y tokens `--transition-*` | Funcional en `/transition/intro-to-station-1` | Lenguaje mas elaborado que pre-portada | Sin cambio | Aprobado |
| TransitionWorld world-1-to-world-2 | `GvoProgressBar` `variant="transition-world"` | Assets locales track/fill/spark y tokens `--transition-*` | Funcional en `/transition/world-1-to-world-2` | Sin problema critico detectado | Sin cambio | Aprobado |

## Matriz obligatoria - Patron de avance

| Patron | Descripcion | Ventaja | Riesgo | Accesibilidad | Recomendacion |
| --- | --- | --- | --- | --- | --- |
| Continuar | Boton nativo al cierre de escena | Claro, testeable, accesible | Estetica externa a escena | Alta | Mantener como fallback |
| Seguir la señal | CTA narrativo asociado a senal visual | Mas organico | Puede no parecer boton | Media-alta si conserva `button` | Explorar como evolucion |
| Abrir siguiente mundo | CTA literal hacia proxima pantalla | Claro | Menos poetico | Alta | Valido para transiciones |
| Entrar al siguiente mundo | CTA narrativo y directo | Buen balance | Puede anticipar demasiado | Alta | Recomendado |
| Tocar nodo final para avanzar | Nodo final activa salida | Integrado a Mundo I | Descubribilidad baja | Media si hay aria-label | Solo con fallback |
| Avance por activacion contextual | Portal/zona iluminada habilita salida | Muy visual | Ambiguo sin guia | Media | Prototipar despues |
| Avance por gesto o zona iluminada | Tap/gesto sobre zona de escena | Cinematico | Riesgo alto en mobile/lector | Baja-media | No usar solo |
| Progreso organico por escena | Autoavance o avance casi invisible | Fluido | Quita control | Baja | No recomendado como unico patron |

## Matriz obligatoria - Estrategia visual

| Opcion | Uso recomendado | Peso esperado | Dependencias | Riesgo repo | Riesgo mobile | Recomendacion |
| --- | --- | --- | --- | --- | --- | --- |
| CSS/SVG procedural | UI, estados, luces, microanimaciones | Bajo | Ninguna | Bajo | Bajo-medio | Usar para capas livianas |
| PNG/WebP optimizado | Escenas, fondos, personajes, sprites | Bajo-medio | Ninguna | Medio si se versiona evidencia pesada | Bajo | Base recomendada |
| Lottie/dotLottie local | Animaciones vectoriales cerradas | Medio | Runtime adicional | Medio | Medio | Solo evaluar en sandbox |
| Rive local | Estados animados interactivos | Medio | Runtime adicional | Medio-alto | Medio-alto | No integrar aun |
| Three.js/R3F | 3D interactivo | Alto | Dependencias pesadas | Alto | Alto | No recomendado |
| glTF/GLB | 3D optimizado futuro | Medio-alto | Runtime 3D | Alto | Alto | Bloquear hasta ADR/pipeline |
| Video renderizado | Evidencia/prototipo offline | Alto | Ninguna adicional si solo evidencia | Alto | Alto | No usar como runtime |

## Validaciones ejecutadas

| Comando | Resultado |
| --- | --- |
| `git status --short --branch` | Paso. Inicial: `## main...origin/main`. |
| `git log --oneline -n 8` | Paso. HEAD inicial: `0e63943 tools: add offline editorial Excel validator 012F`. |
| Navegador local Chrome mobile 390x844 | Paso. Rutas minimas y `/final` cargaron; W1 ready navego a W1-W2. |
| Navegador local Chrome desktop 1365x768 | Paso. Rutas minimas y `/final` cargaron; W1 ready navego a W1-W2. |
| `npm run test -- World1RootScreen` | Paso. 1 archivo, 11 tests. |
| `npm run test -- TransitionWorld` | Paso. 1 archivo, 15 tests. |
| `npm run test -- editorial` | Paso. 1 archivo, 6 tests. |
| `npm run lint` | Paso. Sin errores reportados. |
| `git diff --check` | Paso. Sin errores de whitespace; Git reporto aviso autocrlf de Windows para el CSS modificado. |
| `PORT_5173_NO_LISTENER` | Paso. El proceso Vite de este repo fue detenido y el puerto quedo sin listener. |

## Confirmaciones de alcance

- No se crearon assets.
- No se modificaron `public/assets/**`.
- No se modificaron `assets/**`.
- No se modificaron `docs/archive_manifests/**`.
- No se modificaron `docs/visual/**`.
- No se modificaron `docs/gvo/world-1/validation/**`.
- No se modifico `package.json`.
- No se modifico `package-lock.json`.
- No se modifico `.gitignore`.
- No se modifico `.pre-commit-config.yaml`.
- No se modifico `requirements-security.txt`.
- No se ejecuto `scripts/run_security_checks.ps1`.
- No se ejecuto `npm audit`.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto Graphify, SkillCheck, Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se instalaron dependencias.
- No se uso red externa.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
