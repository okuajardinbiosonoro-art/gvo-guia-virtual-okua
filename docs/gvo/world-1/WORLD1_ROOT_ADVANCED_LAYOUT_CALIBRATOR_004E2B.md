# GVO — Mundo I: Raiz
## Advanced layout calibrator 004E-2B

## 0. Estado

Estado del ticket: IMPLEMENTADO COMO HERRAMIENTA DEV.

La ruta `/dev/world1-root-layout` fue ampliada como calibrador avanzado de layout para Mundo I. La ruta real `/estacion/1` no recibio valores finales, controles dev, guias, nuevas interacciones, animacion, teletransporte, particulas, root flow ni focus scaling.

## 1. Objetivo

Permitir calibrar visualmente estados internos de Mundo I antes de aplicar cualquier valor al runtime real. La herramienta existe para encontrar composiciones aprobables de manera controlada, exportar CSS/JSON y guardar presets locales de trabajo.

## 2. Problema que resuelve

Despues de integrar la interaccion estatica de RELACION, la raiz activa y la pose `point_relation` de Lia pueden romper la armonia de la composicion base. El calibrador evita aplicar ajustes directos al runtime sin revision visual previa.

## 3. Ruta dev

Ruta:

```txt
/dev/world1-root-layout
```

Advertencia visible en pantalla:

```txt
Calibrador Mundo I — solo desarrollo
Estos valores no se aplican automaticamente al runtime. Copia el bloque CSS/JSON y usalo en un ticket posterior.
```

## 4. Estados visuales disponibles

- `base_intro`: fondo, luz, planta, raiz base, nodos y Lia idle sin raiz activa.
- `relation_active`: raiz activa RELACION, Lia `point_relation`, nodo RELACION activo.
- `perception_preview`: raiz activa PERCEPCION y Lia `look_perception` como preview dev.
- `mediation_preview`: raiz activa MEDIACION y Lia `guide_mediation` como preview dev.
- `all_roots_reference`: diagnostico con las tres raices activas visibles segun toggles.

## 5. Apartados de edicion

- Escena / Stage.
- Planta y raiz base.
- Raices activas.
- Nodos.
- Lia.
- Dialogo / panel inferior.
- Guias y debugging.
- Guardar / cargar / exportar.

## 6. Controles disponibles

Escena:

- `stageScale`
- `stageOffsetY`
- `showSafeArea`
- `showMobileFrame`
- `showTextBlock`
- `showDialoguePanel`
- `showContinueButton`

Planta y raiz base:

- `plantX`
- `plantY`
- `plantWidth`
- `plantAnchorX`
- `plantAnchorY`
- `rootOriginX`
- `rootOriginY`
- `rootsTop`
- `rootsWidth`

Raices activas:

- `activeRelationX`, `activeRelationY`, `activeRelationWidth`, `activeRelationOpacity`
- `activePerceptionX`, `activePerceptionY`, `activePerceptionWidth`, `activePerceptionOpacity`
- `activeMediationX`, `activeMediationY`, `activeMediationWidth`, `activeMediationOpacity`
- `showActiveRelation`
- `showActivePerception`
- `showActiveMediation`

Nodos:

- `nodeRelationX`, `nodeRelationY`, `nodeRelationScale`
- `nodePerceptionX`, `nodePerceptionY`, `nodePerceptionScale`
- `nodeMediationX`, `nodeMediationY`, `nodeMediationScale`
- estados preview: `locked`, `available`, `active`, `completed`

Lia:

- `liaIdleX`, `liaIdleY`, `liaIdleWidth`
- `liaPointRelationX`, `liaPointRelationY`, `liaPointRelationWidth`
- `liaLookPerceptionX`, `liaLookPerceptionY`, `liaLookPerceptionWidth`
- `liaGuideMediationX`, `liaGuideMediationY`, `liaGuideMediationWidth`
- `liaReadyContinueX`, `liaReadyContinueY`, `liaReadyContinueWidth`
- `liaExitX`, `liaExitY`, `liaExitWidth`
- `liaTeleportOutX`, `liaTeleportOutY`, `liaTeleportOutWidth`
- `liaTeleportInRelationX`, `liaTeleportInRelationY`, `liaTeleportInRelationWidth`
- `liaTeleportInPerceptionX`, `liaTeleportInPerceptionY`, `liaTeleportInPerceptionWidth`
- `liaTeleportInMediationX`, `liaTeleportInMediationY`, `liaTeleportInMediationWidth`

Dialogo / panel inferior:

- `dialogPanelY`
- `dialogPanelHeight`
- `dialogPanelOpacity`
- `dialogTextScale`
- `showRelationCopy`
- `showIntroCopy`

Guias:

- `showGuides`
- `showGrid`
- `showStageCenter`
- `showRootOrigin`
- `showPlantAnchor`
- `showNodeAnchors`
- `showLiaBounds`
- `showRootBounds`
- `showActiveRootBounds`
- `showTextSafeZone`

## 7. Guardar/cargar presets

La ruta dev usa `localStorage` con la clave:

```txt
gvo-dev-world1-layout-calibrator-v2
```

Funciones disponibles:

- Guardar preset actual.
- Cargar preset guardado.
- Resetear preset guardado.
- Duplicar preset.
- Renombrar preset.

Los presets guardados no modifican `/estacion/1`.

## 8. Exportacion CSS/JSON

La herramienta muestra un bloque CSS copyable con variables agrupadas:

- Mundo I base.
- Active roots.
- Nodes.
- Lia.

Tambien muestra JSON con:

- `screen`
- `devRoute`
- `state`
- `storageKey`
- `values.stage`
- `values.plant`
- `values.roots`
- `values.activeRoots`
- `values.nodes`
- `values.lia`
- `values.dialog`
- `values.flat`
- `toggles`
- `nodeStates`

## 9. Importacion JSON

La seccion `Guardar / cargar / exportar` permite pegar JSON y cargar valores en el calibrador. La importacion es solo dev y no aplica valores al runtime.

## 10. Confirmacion de que /estacion/1 no recibio UI dev

Confirmado por implementacion y tests:

- `/estacion/1` no renderiza `Calibrador Mundo I — solo desarrollo`.
- `/estacion/1` no renderiza controles `plantX`, `rootOriginX`, `activeRelationX` ni `liaPointRelationX`.
- `/estacion/1` mantiene la interaccion estatica de RELACION existente.
- No se implementaron PERCEPCION, MEDIACION, Continuar habilitado, animacion ni teletransporte.

## 11. Validacion mobile

Viewports validados para el calibrador y runtime:

- 360 x 800.
- 390 x 844.
- 430 x 932.

Capturas de validacion:

```txt
docs/gvo/world-1/validation/004E2B/
```

Archivos generados:

- `calibrator_base_intro_390x844.png`
- `calibrator_relation_active_390x844.png`
- `calibrator_controls_390x844.png`
- `station_relation_active_390x844.png`

## 12. Elementos no implementados

- No se aplicaron valores finales a `/estacion/1`.
- No se implemento PERCEPCION.
- No se implemento MEDIACION.
- No se desbloquearon nodos nuevos.
- No se habilito Continuar.
- No se implemento animacion.
- No se implemento teletransporte.
- No se implementaron particulas.
- No se implemento root flow.
- No se implemento focus scaling.
- No se generaron ni editaron assets.
- No se agregaron dependencias.
- No se usaron CDN ni recursos externos.
- No se agrego audio ni video.

## 13. Checks ejecutados

Checks ejecutados:

```powershell
npm run lint        # OK
npm run test        # OK
npm run build       # OK
npm run audit:assets # OK
```

`npm run typecheck` no existe como script independiente en `package.json`; el typecheck se ejecuta dentro de `npm run build`.

## 14. Como debe usarla el usuario

En computador:

```powershell
npm run dev
```

Abrir:

```txt
http://127.0.0.1:5173/dev/world1-root-layout
```

Desde celular en la misma red:

```powershell
npm run dev -- --host 0.0.0.0
```

Luego abrir la IP local del computador con:

```txt
http://<IP_DEL_PC>:5173/dev/world1-root-layout
```

Flujo recomendado:

1. Elegir estado visual.
2. Ajustar stage, planta, raiz base, raiz activa, nodo y Lia.
3. Activar guias necesarias.
4. Guardar preset local.
5. Copiar CSS/JSON.
6. Revisar con el usuario antes de crear un ticket de aplicacion runtime.

## 15. Proxima accion esperada

Usar el calibrador para encontrar valores visuales aprobados por el usuario. La aplicacion de esos valores a `/estacion/1` debe ocurrir solo en un ticket posterior especifico.
