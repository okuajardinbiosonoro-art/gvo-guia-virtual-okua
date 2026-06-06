# GVO — Mundo I: Raiz
## Aplicacion de calibracion manual de raices activas

## Estado

Aplicado como calibracion base de CSS en `/estacion/1` y como valores por defecto del calibrador avanzado `/dev/world1-root-layout`.

La calibracion prepara las tres raices activas con valores aprobados por revision manual del usuario. En runtime, solo RELACION sigue renderizandose porque PERCEPCION y MEDIACION continuan bloqueadas en esta fase.

## Fuente

Valores entregados por el usuario desde el calibrador avanzado luego de acomodar las raices de los tres nodos.

JSON fuente:

```txt
C:\Users\JOSE DAVID\.codex\attachments\efa7c3fb-cc27-49f3-aeef-d138e732db2d\pasted-text.txt
```

## Valores aplicados

```css
/* Active roots */
--world1-active-relation-x: 49.4%;
--world1-active-relation-y: 70.1%;
--world1-active-relation-width: 96.2%;
--world1-active-relation-opacity: 1;
--world1-active-perception-x: 50%;
--world1-active-perception-y: 72%;
--world1-active-perception-width: 99.5%;
--world1-active-perception-opacity: 1;
--world1-active-mediation-x: 50%;
--world1-active-mediation-y: 69.4%;
--world1-active-mediation-width: 91.5%;
--world1-active-mediation-opacity: 1;
```

## Archivos sincronizados

- `src/screens/World1Root/World1RootScreen.css`
- `src/screens/World1Root/dev/World1RootLayoutCalibrator.tsx`

## Confirmacion funcional

- RELACION conserva la interaccion estatica actual.
- PERCEPCION sigue bloqueada.
- MEDIACION sigue bloqueada.
- `Continuar` sigue deshabilitado.
- No se implementaron nuevas rutas.
- No se implemento animacion.
- No se implemento teletransporte.
- No se implementaron particulas.
- No se implemento root flow.
- No se modificaron assets.
- No se agregaron dependencias.
- No se agrego audio, video, CDN ni recursos externos.

## Nota de alcance

Los valores de PERCEPCION y MEDIACION quedan disponibles como variables CSS y defaults del calibrador para que, cuando exista un ticket funcional posterior, esos estados puedan partir de la calibracion visual aprobada sin recalibrar desde cero.
