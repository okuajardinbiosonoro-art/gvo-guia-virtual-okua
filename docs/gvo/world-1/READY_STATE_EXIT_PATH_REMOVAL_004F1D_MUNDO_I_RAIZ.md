# GVO - Mundo I: Raiz

## Retiro temporal del camino luminoso de salida 004F-1D

## 0. Estado

004F-1D retira temporalmente del runtime visible de Mundo I el camino luminoso de salida en `ready_to_continue`.

El layout mobile base de Mundo I queda conservado tras 004F-1C. La pantalla sigue sin cierre final y requiere revision visual manual para cualquier decision posterior sobre una alternativa de salida.

## 1. Objetivo

Dejar el estado `ready_to_continue` funcionando sin el asset visual de camino luminoso, manteniendo la secuencia funcional actual:

```txt
intro -> RELACION -> PERCEPCION -> MEDIACION -> ready_to_continue
```

## 2. Motivo de la decision

La revision manual en mobile real confirmo que el layout ya funciona satisfactoriamente, pero el camino luminoso de salida se percibe como una capa sobrepuesta/pegada y rompe la armonia visual del cierre.

La decision de este ticket es retirarlo temporalmente del runtime, no redisenarlo ni reemplazarlo.

## 3. Asset afectado

Asset afectado:

```txt
public/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png
```

El asset `world1_root_exit_path_approved_v1.png` no se elimina del repo ni del manifest. Solo se retira temporalmente del runtime visible porque no se integra visualmente bien en mobile.

## 4. Cambios aplicados

- Se retiro el render del `<img>` de salida en `ready_to_continue`.
- Se retiro `exitPath` de `world1RootRenderedAssetKeys`.
- Se retiro `world1_exit_path` del bundle critico `world1RootReady`.
- Se mantuvo `world1RootAssets.exitPath` para conservar la referencia del asset aprobado en el repo.
- Se actualizaron tests para validar que el camino ya no aparece.

## 5. Estado ready_to_continue resultante

En `ready_to_continue` quedan:

- RELACION: completed.
- PERCEPCION: completed.
- MEDIACION: completed.
- Lia: `lia_root_ready_continue_approved_v1.png`.
- Dialogo: cierre de Mundo I.
- Boton `Continuar`: visible, preparado y sin navegacion.
- Camino luminoso: no visible.

## 6. Preload/bundles

`world1RootReady` conserva solo los assets criticos visibles del estado listo. El asset `world1_root_exit_path_approved_v1.png` ya no se precarga como critico porque no se renderiza visualmente.

## 7. Validacion mobile

Se generaron capturas y metricas en:

```txt
docs/gvo/world-1/validation/004F1D/
```

Viewports basicos validados:

- 360x800.
- 390x844.
- 430x932.

Perfiles simulados validados:

- iPhone SE.
- iPhone 12/13.
- Pixel-like.
- Samsung-like.
- Small Android.

Validaciones automáticas incluyeron:

- sin overflow horizontal;
- sin UI dev en `/estacion/1`;
- nodos sin solapar el panel;
- Lia visible en cierre;
- boton `Continuar` visible;
- camino luminoso ausente en `ready_to_continue`;
- audio/video ausentes.

## 8. Elementos no implementados

Este ticket no implementa navegación de salida, animación, teletransporte, partículas, root flow ni focus scaling.

Tampoco:

- genera assets;
- edita assets;
- borra assets;
- agrega dependencias;
- cambia tipografias oficiales;
- toca Carga Inicial, Portada / Intro ni Transicion entre mundos.

## 9. Checks ejecutados

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run audit:assets`
- `npm run typecheck`: no disponible en `package.json`.

## 10. Deudas pendientes

- Definir en un ticket futuro una alternativa visual de salida si el flujo de Mundo I necesita una senal de continuidad.
- Mantener la revision manual mobile real como criterio visual final.
