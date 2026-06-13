# 008C - Retorno a desarrollo de salida de Mundo I

## Proposito

Retomar el desarrollo runtime de Mundo I con alcance minimo: estabilizar la franja visual inferior detectada en 008B y conectar el boton `Continuar` desde `ready_to_continue` hacia una salida segura ya existente.

## Alcance

- Mundo I / Estacion I.
- Salida controlada a `/estacion/2`, que permanece como placeholder.
- Validacion local en `http://localhost:5173/`.
- Sin crear Mundo II real.
- Sin activar QR, camara ni scanner.
- Sin modificar assets runtime.

## Estado Git inicial

```text
## main...origin/main
```

Ultimo commit al iniciar:

```text
f1eaf43 docs: audit Mundo I visual runtime before development 008B
```

## Archivos modificados

- `src/app/routes.ts`
- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World1Root/World1RootScreen.css`
- `src/screens/World1Root/layout/World1RootStageFrame.css`
- `src/screens/World1Root/World1RootScreen.test.tsx`

## Archivo creado

- `docs/status/008C_RETORNO_DESARROLLO_SALIDA_MUNDO_I.md`

## Cambio funcional aplicado

- Se agrego `worldTwoPlaceholderRoute = "/estacion/2"`.
- `World1RootScreen` usa `useNavigate`.
- El boton `Continuar` conserva estado deshabilitado antes de `ready_to_continue`.
- Al llegar a `ready_to_continue`, el boton expone `data-world1-exit-target="/estacion/2"` y navega a `/estacion/2`.
- La nota anterior de salida futura fue retirada del DOM.

## Cambio visual aplicado

- El fondo base dejo de renderizarse como capa absoluta independiente y paso al layer de coordenadas mediante CSS background local.
- El contenedor raiz y el frame recibieron estabilizacion de pintura: `overflow: hidden`, `contain: paint`, `isolation`, `clip-path`, `backface-visibility` y `translateZ(0)`.
- Se agregaron cubiertas inferiores dentro del stage para ocultar la cola visual conflictiva sin modificar assets.
- No se modificaron archivos bajo `public/assets/**` ni `assets/**`.

## Comportamiento anterior

- `ready_to_continue` se alcanzaba correctamente.
- `Continuar` quedaba habilitado, pero solo mostraba una nota: `La salida se activara en una fase posterior.`
- La captura visual mostraba una franja inferior con apariencia de repeticion/continuidad de escena.

## Comportamiento nuevo

- `ready_to_continue` se alcanza correctamente.
- `data-world1-exit-ready="true"` se mantiene.
- `Continuar` navega a `/estacion/2`.
- `/estacion/2` sigue siendo placeholder; no se creo Mundo II real.
- La franja inferior queda tratada con recorte/pintura y mascara dentro del stage.

## Rutas validadas

- `/`
- `/portada`
- `/transition/intro-to-station-1`
- `/estacion/1`
- `/estacion/2`
- `/qr/1`

## Resultado visual mobile

- Viewport usado: `390x844`.
- Mundo I carga y alcanza `ready_to_continue`.
- `Continuar` navega a `/estacion/2`.
- No hay duplicacion DOM de stage ni capa de fondo separada.
- Riesgo residual: la captura del Browser interno siguio mostrando una cola inferior repetida en los ultimos pixeles del frame aun despues de aplicar recorte, mascara y estabilizacion de composicion. El DOM reporta un solo stage y una sola marca de asset de fondo, por lo que se considera deuda visual residual de composicion/captura para seguimiento especifico si el usuario la sigue viendo en navegador real.

## Resultado visual desktop

- Viewport usado: `1280x720`.
- Mundo I carga y alcanza `ready_to_continue`.
- El frame queda con mascara inferior aplicada.
- No hay errores de consola.
- Riesgo residual igual al mobile: el Browser interno puede seguir reflejando una cola repetida en el borde inferior de la captura del stage.

## Resultado del boton Continuar

```text
Antes de ready_to_continue: disabled
En ready_to_continue: enabled
Destino: /estacion/2
Resultado observado: http://localhost:5173/estacion/2
```

## Confirmacion sobre QR/camara

- No se activo QR real.
- No se activo camara.
- No se solicito permiso sensible.
- Validacion DOM: `video=0`, `audio=0`, `canvas=0` en las rutas validadas y tras navegar a `/estacion/2`.

## Matriz de cambios

| Area | Archivo | Cambio aplicado | Motivo | Riesgo | Validacion |
|---|---|---|---|---|---|
| Mundo I visual inferior | `src/screens/World1Root/layout/World1RootStageFrame.css` | `clip-path`, `contain: paint`, `backface-visibility`, `translateZ(0)` y mascaras inferiores | Reducir/ocultar franja inferior con apariencia de repeticion | Medio: queda riesgo visual residual en capturas del Browser interno | Browser local mobile/desktop, recorte stage, `npm run lint`, test focalizado |
| Mundo I visual inferior | `src/screens/World1Root/World1RootScreen.css` | `overflow: hidden`, `contain: paint`, `isolation` en raiz; retiro CSS de nota futura | Estabilizar pintura y retirar CSS muerto | Bajo | Browser local, `npm run lint` |
| Flujo ready_to_continue | `src/screens/World1Root/World1RootScreen.tsx` | `useNavigate` y salida a ruta controlada | Evitar que `Continuar` quede como nota futura | Bajo | Browser local y test focalizado |
| Boton Continuar | `src/screens/World1Root/World1RootScreen.tsx` | `data-world1-exit-target="/estacion/2"` y navegacion al click | Evidencia runtime del destino | Bajo | Browser local: URL final `/estacion/2` |
| Ruta /estacion/2 | `src/app/routes.ts` | Nueva constante `worldTwoPlaceholderRoute` | Evitar string hardcodeado en Mundo I | Bajo | Test focalizado y Browser local |
| QR/camara | Sin cambios runtime QR/camara | No se activo scanner ni permisos | Mantener flujo seguro | Bajo | DOM `video=0`, `audio=0`, `canvas=0`; sin prompts |
| Assets runtime | Sin cambios en assets | Fondo usado como CSS background local desde la ruta existente | No tocar assets ni crear nuevos | Bajo/medio: cambio de forma de renderizado del fondo | Test de asset marker y Browser local |

## Matriz de validacion

| Ruta | Resultado esperado | Resultado observado | Consola | Permisos sensibles | Estado |
|---|---|---|---|---|---|
| `/` | Carga inicio/loading local | Carga `Preparando el recorrido` | Sin errores | No | PASA |
| `/portada` | Carga portada | Carga portada OKUA y estaciones | Sin errores | No | PASA |
| `/transition/intro-to-station-1` | Carga transicion existente | Carga `Abriendo Mundo I: Raiz` | Sin errores | No | PASA |
| `/estacion/1` | Carga Mundo I | Carga `intro`; flujo avanza a `ready_to_continue` | Sin errores | No | PASA |
| `/estacion/2` | Carga placeholder | Carga `Estacion placeholder` | Sin errores | No | PASA |
| `/qr/1` | Carga placeholder QR sin camara | Carga `Acceso QR placeholder`; scanner reservado | Sin errores | No | PASA |

## Validaciones ejecutadas

| Comando / validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` inicial; luego cambios esperados de 008C | PASA |
| `git log --oneline -n 5` | HEAD inicial `f1eaf43` | PASA |
| `npm run dev` | Vite local en `http://localhost:5173/` | PASA |
| Browser local mobile `390x844` | Flujo completo hasta `/estacion/2`; consola limpia | PASA |
| Browser local desktop `1280x720` | Flujo completo hasta `/estacion/2`; consola limpia | PASA |
| `npm run test -- World1RootScreen` | 1 archivo, 11 tests pasaron | PASA |
| `npm run lint` | ESLint sin errores | PASA |
| `git diff --check` | Sin errores; solo advertencias de CRLF previstas por Git en Windows | PASA |
| Comprobacion adicional con `@playwright/test` | No corrio: navegador Playwright no instalado localmente; no se ejecuto `npx playwright install` | NO EJECUTADA |

## Riesgos residuales

- La validacion visual del Browser interno sigue mostrando una cola repetida en el borde inferior de algunas capturas, aunque el DOM confirma un solo stage y una sola marca de fondo. Si el usuario la observa en navegador real, conviene abrir un ticket visual especifico para revisar composicion/captura o recalibrar altura/recorte del stage con criterio visual humano.
- La salida a `/estacion/2` es intencionalmente placeholder. No representa Mundo II final.
- No se ejecuto `npm run build` ni `npm run check` por restriccion del ticket.

## Recomendacion de siguiente ticket

Preparar `008C-PUSH — Sincronizar salida de Mundo I` solo si el usuario aprueba el PRE-CIERRE. Si la deuda visual inferior no resulta aceptable al ojo humano, preparar antes un ticket visual especifico de ajuste fino del frame inferior de Mundo I.
