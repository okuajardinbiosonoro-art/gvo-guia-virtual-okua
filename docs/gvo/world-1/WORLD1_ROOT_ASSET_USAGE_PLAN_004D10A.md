# GVO - Mundo I: Raiz
## Plan de uso de assets 004D-10A

## 0. Estado

`004D-10A_USAGE_PLAN_DOCUMENTAL / SIN_RUNTIME / SIN_CSS_FINAL`

Este documento describe el uso previsto de los assets ingeridos para una futura implementacion de `/estacion/1`. No implementa runtime, no define CSS final y no sustituye el ticket funcional futuro.

## 1. Capas de escena

Orden conceptual sugerido:

```txt
1. background base
2. ambient light overlays
3. plant
4. roots base
5. active root selected
6. node ornaments
7. exit path
8. Lia
9. teleport FX / particles
10. DOM/CSS labels, dialogue and button
```

## 2. Assets por capa

| Categoria | Asset | Rol previsto | Ruta | Runtime |
| --- | --- | --- | --- | --- |
| background | `world1_root_background_base_approved_v1.png` | base background | `public/assets/gvo/stations/world-1-root/background/world1_root_background_base_approved_v1.png` | not_integrated |
| ambient_light | `world1_root_ambient_light_kit_approved_v1.png` | ambient light overlay kit | `public/assets/gvo/stations/world-1-root/light/world1_root_ambient_light_kit_approved_v1.png` | not_integrated |
| plant | `world1_root_young_plant_approved_v1.png` | young plant origin | `public/assets/gvo/stations/world-1-root/plant/world1_root_young_plant_approved_v1.png` | not_integrated |
| roots_base | `world1_root_roots_base_approved_v1.png` | base roots system | `public/assets/gvo/stations/world-1-root/roots/world1_root_roots_base_approved_v1.png` | not_integrated |
| roots_active | `world1_root_active_relation_approved_v1.png` | active relation root | `public/assets/gvo/stations/world-1-root/roots/world1_root_active_relation_approved_v1.png` | not_integrated |
| roots_active | `world1_root_active_perception_approved_v1.png` | active perception root | `public/assets/gvo/stations/world-1-root/roots/world1_root_active_perception_approved_v1.png` | not_integrated |
| roots_active | `world1_root_active_mediation_approved_v1.png` | active mediation root | `public/assets/gvo/stations/world-1-root/roots/world1_root_active_mediation_approved_v1.png` | not_integrated |
| nodes | `world1_root_node_state_kit_approved_v1.png` | root node states kit | `public/assets/gvo/stations/world-1-root/nodes/world1_root_node_state_kit_approved_v1.png` | not_integrated |
| exit_path | `world1_root_exit_path_approved_v1.png` | exit path visual | `public/assets/gvo/stations/world-1-root/exit-path/world1_root_exit_path_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_idle_approved_v1.png` | idle_initial | `public/assets/gvo/stations/world-1-root/lia/lia_root_idle_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_invite_relation_approved_v1.png` | invite_relation | `public/assets/gvo/stations/world-1-root/lia/lia_root_invite_relation_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_point_relation_approved_v1.png` | point_relation | `public/assets/gvo/stations/world-1-root/lia/lia_root_point_relation_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_look_perception_approved_v1.png` | look_perception | `public/assets/gvo/stations/world-1-root/lia/lia_root_look_perception_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_guide_mediation_approved_v1.png` | guide_mediation | `public/assets/gvo/stations/world-1-root/lia/lia_root_guide_mediation_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_ready_continue_approved_v1.png` | ready_continue | `public/assets/gvo/stations/world-1-root/lia/lia_root_ready_continue_approved_v1.png` | not_integrated |
| lia_pose | `lia_root_exit_approved_v1.png` | exit_soft | `public/assets/gvo/stations/world-1-root/lia/lia_root_exit_approved_v1.png` | not_integrated |
| lia_teleport | `lia_root_teleport_out_approved_v1.png` | teleport_out | `public/assets/gvo/stations/world-1-root/lia/lia_root_teleport_out_approved_v1.png` | not_integrated |
| lia_teleport | `lia_root_teleport_in_relation_approved_v1.png` | teleport_in_relation | `public/assets/gvo/stations/world-1-root/lia/lia_root_teleport_in_relation_approved_v1.png` | not_integrated |
| lia_teleport | `lia_root_teleport_in_perception_approved_v1.png` | teleport_in_perception | `public/assets/gvo/stations/world-1-root/lia/lia_root_teleport_in_perception_approved_v1.png` | not_integrated |
| lia_teleport | `lia_root_teleport_in_mediation_approved_v1.png` | teleport_in_mediation | `public/assets/gvo/stations/world-1-root/lia/lia_root_teleport_in_mediation_approved_v1.png` | not_integrated |

## 3. Secuencia de Lia

Secuencia conceptual, sin implementacion:

```txt
initial:
  lia_root_idle
intro:
  lia_root_invite_relation
relation:
  teleport_out -> teleport_in_relation -> point_relation
perception:
  teleport_out -> teleport_in_perception -> look_perception
mediation:
  teleport_out -> teleport_in_mediation -> guide_mediation
ready:
  ready_continue
exit:
  exit_soft
```

## 4. Regla de foco

Regla aprobada:

> El elemento no se acerca con la cámara, sino que aumenta su escala dentro de la composición.

La futura implementacion debe escalar el elemento de raiz seleccionado dentro de la composicion, no hacer zoom global de camara ni cambiar a una pantalla separada.

## 5. Textos y UI

- Textos, labels, dialogos y boton deben ir como DOM/CSS.
- No incrustar textos finales en las imagenes.
- No cambiar la tipografia oficial del proyecto.
- No usar CDN ni fuentes remotas.

## 6. Reduced motion

La futura implementacion debe poder degradar:

- teletransporte a fade simple;
- flujo de raices a glow estable;
- particulas a estado casi estatico u oculto;
- cambios de escala a estados discretos sin loops amplios.

## 7. No implementacion

Este documento no implementa runtime, no define CSS final y no sustituye el ticket funcional futuro. Los assets estan disponibles como `not_integrated` hasta que un ticket posterior autorice `/estacion/1`.
