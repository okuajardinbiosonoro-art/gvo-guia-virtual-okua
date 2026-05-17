# Ticket 001M - Carga inicial barra pixelart caps marker V12

Fecha: 2026-05-17

Estado al cierre: `ANIMACION_V12_PROGRESS_BAR_PIXELART / EN_REVISION_VISUAL`.

## Objetivo

Refinar de forma puntual la barra de carga de la pantalla inicial para que caps, track, fill y marker se perciban mas pixelart, finos e integrados con la referencia visual, sin reabrir layout ni motion general.

## Base

- Rama base: `feature/001L-carga-inicial-escala-ui-motion-smooth-v11`.
- Commit base verificado: `3845f0f feat: smooth loading scale and progress ui`.
- Rama de trabajo: `feature/001M-carga-inicial-barra-pixelart-v12`.

## Cambios de barra

- Se conserva el ancho general de V11 y el track fino de `2px`.
- Se separa el DOM interno en `progress-track`, `progress-fill` y `progress-marker`.
- El track empieza despues del cap izquierdo y termina antes del cap derecho mediante padding interno, evitando que el trazo atraviese los rombos.
- Caps y marker usan bloques CSS de 3px para formar rombos pixelart sin assets nuevos.
- El fill conserva el avance de `12000ms`, sin porcentaje, numeros ni texto adicional.

## Construccion pixelart

- CSS local, sin PNG nuevo.
- Caps y marker usan `linear-gradient` locales por celda para construir un rombo de pixeles de 3px, sin `border-radius`, `clip-path` ni rotacion suave.
- El marker acompana el fill con la misma curva temporal, sin temblor ni glow grande.
- El track base se mantiene lavanda/morado suave y el fill conserva ambar/lavanda.

## Elementos preservados

- No se movio Lía.
- No se movio maceta/planta.
- No se movio halo.
- No se movio agua.
- No se movieron sparkles.
- No se cambiaron textos ni tipografia base Pixelify Sans local.
- No se cambio el timeline normal de `12000ms`.
- No se cambio reduced motion de `1300ms`.

## Capturas V12

Generadas en `docs/visual/loading-initial/validation/v12/`.

Set esperado:

- `mobile_360x640_start.png`
- `mobile_360x640_mid.png`
- `mobile_360x640_end.png`
- `mobile_390x844_start.png`
- `mobile_390x844_mid.png`
- `mobile_390x844_end.png`
- `mobile_430x932_start.png`
- `mobile_430x932_mid.png`
- `mobile_430x932_end.png`
- `reduced_motion.png`
- `loading_initial_v12_mobile.mp4` si la generacion documental local lo permite.

## Pruebas de cierre

- `npm run assets:validate:loading`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run test:e2e`

No se ejecuta `npm run assets:normalize:loading` porque este ticket no toca ni regenera assets runtime PNG/JSON.

## Fuera de alcance confirmado

- No se implementa portada.
- No se implementan estaciones.
- No se implementa transicion entre mundos.
- No se agrega audio.
- No se agrega video runtime.
- No se usan recursos externos ni CDN.
- No se instalan dependencias nuevas.
- No se asigna `CERRADA_APROBADA`.

## Pendiente

La V12 queda lista para revision visual manual de la barra en navegador movil. La portada sigue bloqueada hasta aprobacion explicita de la carga inicial.
