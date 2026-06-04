# GVO - Lia Mundo I
## Actualizacion de registro 004D-10A

## 0. Estado

`004D-10A_LIA_REGISTRY_UPDATED / PRE_RUNTIME / SIN_MICROPOSES_NUEVAS`

Este documento registra que los 11 assets aprobados de Lia para Mundo I fueron copiados a la carpeta de pantalla y a la biblioteca central sin modificar bytes.

## 1. Carpeta de pantalla

```txt
public/assets/gvo/stations/world-1-root/lia/
```

## 2. Biblioteca central

```txt
public/assets/gvo/shared/lia/future/mundo-i-raiz/
```

## 3. Assets registrados

| Rol | Asset canonico | Biblioteca central |
| --- | --- | --- |
| idle_initial | `lia_root_idle_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_idle_approved_v1.png` |
| invite_relation | `lia_root_invite_relation_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_invite_relation_approved_v1.png` |
| point_relation | `lia_root_point_relation_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_point_relation_approved_v1.png` |
| look_perception | `lia_root_look_perception_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_look_perception_approved_v1.png` |
| guide_mediation | `lia_root_guide_mediation_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_guide_mediation_approved_v1.png` |
| ready_continue | `lia_root_ready_continue_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_ready_continue_approved_v1.png` |
| exit_soft | `lia_root_exit_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_exit_approved_v1.png` |
| teleport_out | `lia_root_teleport_out_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_teleport_out_approved_v1.png` |
| teleport_in_relation | `lia_root_teleport_in_relation_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_teleport_in_relation_approved_v1.png` |
| teleport_in_perception | `lia_root_teleport_in_perception_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_teleport_in_perception_approved_v1.png` |
| teleport_in_mediation | `lia_root_teleport_in_mediation_approved_v1.png` | `public/assets/gvo/shared/lia/future/mundo-i-raiz/lia_root_teleport_in_mediation_approved_v1.png` |

## 4. Manifest actualizado

```txt
public/assets/gvo/shared/lia/asset_manifest_lia_v1.json
```

Los assets quedan con `status: approved_for_mundo_i_pre_runtime` y `runtimeStatus: not_integrated`.

## 5. Alcance

- No se implementa `/estacion/1`.
- No se modifica runtime.
- No se generan ni editan assets.
- No se agregan imports.
