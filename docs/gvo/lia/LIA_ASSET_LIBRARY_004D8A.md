# GVO - Biblioteca de assets de Lia
## Ticket 004D-8A

## 0. Estado

`004D-8A_COMPLETADO / BIBLIOTECA_CREADA / COPY_ONLY / SIN_RUNTIME`

## 1. Objetivo

Crear una biblioteca central de copias de assets existentes de Lia para revision, comparacion y reutilizacion controlada antes de producir microposes nuevas para Mundo I: Raiz.

## 2. Alcance

Incluye auditoria por nombre y referencias, copia de assets current-used, manifest con hash/dimensiones, README de biblioteca y mapa de uso. No implementa Mundo I ni cambia pantallas existentes.

## 3. Restricciones

- No modificar runtime.
- No modificar `/estacion/1`.
- No modificar componentes React, rutas, navegacion ni imports.
- No mover ni borrar assets originales.
- No optimizar ni alterar binariamente assets.
- No redisenar Lia.
- No crear microposes nuevas.

## 4. Carpetas creadas

```txt
public/assets/gvo/shared/lia/
public/assets/gvo/shared/lia/current-used/carga-inicial/
public/assets/gvo/shared/lia/current-used/portada-intro/
public/assets/gvo/shared/lia/current-used/transition-world/
public/assets/gvo/shared/lia/current-used/unknown/
public/assets/gvo/shared/lia/approved/
public/assets/gvo/shared/lia/candidates/
public/assets/gvo/shared/lia/future/mundo-i-raiz/
docs/gvo/lia/
```

## 5. Criterios de busqueda

Se buscaron nombres y referencias con: `lia`, `Lia`, `Lia`, `LIA`, `lia_`, `lia-`, `guide` y `avatar`.

Extensiones visuales consideradas: `.png`, `.webp`, `.jpg`, `.jpeg`, `.svg`, `.gif`.

Tambien se revisaron referencias en `src`, `public`, `docs` y `package.json`.

## 6. Assets encontrados

- Candidatos visuales encontrados por busqueda: 56.
- Assets current-used seleccionados para biblioteca: 31.
- Referencias visuales no copiadas como current-used: 25.

| Asset | Ruta original | Copia en biblioteca | Dimensiones | Alpha | Pantalla |
|---|---|---|---:|---|---|
| `lia_loading_16f` | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png` | `public/assets/gvo/shared/lia/current-used/carga-inicial/lia_loading_16f.png` | 2560x2560 | yes | Carga Inicial |
| `lia_master_cover_reference_v1` | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_master_cover_reference_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_pose_idle_v1` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_idle_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_pose_greeting_v1` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_greeting_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png` | 1086x1448 | yes | Portada / Intro |
| `lia_pose_explain_calm_v1` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_explain_calm_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png` | 1086x1448 | yes | Portada / Intro |
| `lia_pose_point_portal_1_v1` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_point_portal_1_v1.png` | 1024x1536 | yes | Portada / Intro |
| `lia_pose_activate_portal_1_v1` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_activate_portal_1_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_shadow_soft_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_shadow_soft_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_shadow_soft_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_body_bulb_segmented_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_body_bulb_segmented_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_body_bulb_segmented_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_petal_left_lower_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_lower_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_left_lower_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_petal_right_lower_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_lower_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_right_lower_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_petal_left_upper_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_upper_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_left_upper_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_petal_right_upper_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_upper_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_right_upper_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_petal_top_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_top_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_top_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_collar_amber_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_collar_amber_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_collar_amber_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_glow_collar_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_glow_collar_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_glow_collar_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_head_opal_clean_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_head_opal_clean_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_head_opal_clean_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_neutral_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_neutral_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_blink_25_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_25_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_blink_25_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_blink_50_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_blink_50_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_closed_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_closed_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_happy_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_happy_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_happy_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_rig_eyes_crescent_attentive_v1` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_attentive_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_attentive_v1.png` | 941x1672 | yes | Portada / Intro |
| `lia_transition_root_master_v1_png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_master_v1.png` | 256x256 | yes | Transicion entre mundos |
| `lia_transition_root_master_v1_webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_master_v1.webp` | 256x256 | yes | Transicion entre mundos |
| `lia_transition_root_idle_4f_v1_png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_idle_4f_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_idle_4f_v1.png` | 1024x256 | yes | Transicion entre mundos |
| `lia_transition_root_idle_4f_v1_webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_idle_4f_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_idle_4f_v1.webp` | 1024x256 | yes | Transicion entre mundos |
| `lia_transition_root_guide_2f_v1_png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_guide_2f_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_guide_2f_v1.png` | 512x256 | yes | Transicion entre mundos |
| `lia_transition_root_guide_2f_v1_webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_guide_2f_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_guide_2f_v1.webp` | 512x256 | yes | Transicion entre mundos |
| `lia_transition_root_exit_v1_png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_exit_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_exit_v1.png` | 256x256 | yes | Transicion entre mundos |
| `lia_transition_root_exit_v1_webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_exit_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_exit_v1.webp` | 256x256 | yes | Transicion entre mundos |

## 7. Assets copiados

Las copias se hicieron sin optimizar, reexportar ni modificar bytes.

| Archivo | Original | Biblioteca | SHA256 | Hash copia = original |
|---|---|---|---|---|
| `lia_loading_16f.png` | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png` | `public/assets/gvo/shared/lia/current-used/carga-inicial/lia_loading_16f.png` | `971e57a5a8c09124a6f55e686c9ac147430fec03943b0c43c1bed1d823ab31ce` | si |
| `lia_master_cover_reference_v1.png` | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_master_cover_reference_v1.png` | `3387e924a280eda332744b5f458dcd01468d8c35d33bedaf1846d29bf5c2e144` | si |
| `lia_pose_idle_v1.png` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_idle_v1.png` | `5ebe67cb6857eb66e8f783c40f809e19c17053726ca600baaa9de509d3f50ddf` | si |
| `lia_pose_greeting_v1.png` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_greeting_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png` | `7a25a54fbc96852d0c5e26b4de1fd470ae708eccdef7ef7352d37806e89c0ad5` | si |
| `lia_pose_explain_calm_v1.png` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_explain_calm_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png` | `17020fcdce68624db85ff173869d693d77a009e408859e323fc238d2f90b7064` | si |
| `lia_pose_point_portal_1_v1.png` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_point_portal_1_v1.png` | `00618770ee7b259dcb867a3f6758b7e0697a7d851967986a79d4ad3f8b3b1353` | si |
| `lia_pose_activate_portal_1_v1.png` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_activate_portal_1_v1.png` | `540b20575f2812088484045e1aaebc2c44e076489b5a6158e9906847f43727b4` | si |
| `lia_rig_shadow_soft_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_shadow_soft_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_shadow_soft_v1.png` | `8a1dbd2f6fb96d38a89963cebf861a6a41645eca96ad9efc0171e69ec402c896` | si |
| `lia_rig_body_bulb_segmented_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_body_bulb_segmented_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_body_bulb_segmented_v1.png` | `a32fc8bfd4e6cbc33d200efc1fe7c4ee1ad217970bcc730ebd5932326af75685` | si |
| `lia_rig_petal_left_lower_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_lower_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_left_lower_v1.png` | `1b5636a5092757326eceb3fde3e0567354c62542a42648372613d61e2c63dfa7` | si |
| `lia_rig_petal_right_lower_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_lower_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_right_lower_v1.png` | `c7ec877d82b3f86da5b7a9306847361e3a6cc7b5b7b702b63b15c36ff373cee5` | si |
| `lia_rig_petal_left_upper_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_upper_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_left_upper_v1.png` | `8858768fe51f5efcf71c8010187a04ebeb04620f45d91eae87e84b23f12becb9` | si |
| `lia_rig_petal_right_upper_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_upper_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_right_upper_v1.png` | `57f90f78951ff06a220e4d9e55f2fc823358477620cf05a9f4ce8f57d252b1c4` | si |
| `lia_rig_petal_top_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_top_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_petal_top_v1.png` | `cf4c1b31291bc76f6b6ec5e6c87827d80ec7eaf5b1632dedf6fb15bab9d00515` | si |
| `lia_rig_collar_amber_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_collar_amber_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_collar_amber_v1.png` | `50bed4928638fcbd8ba59ec04e769d4c7127986083e74ff6f48680e0d43b3592` | si |
| `lia_rig_glow_collar_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_glow_collar_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_glow_collar_v1.png` | `ed7c109044b82d9b1e4a122062a67966438e27867322f65957bd53a9f0e851d5` | si |
| `lia_rig_head_opal_clean_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_head_opal_clean_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_head_opal_clean_v1.png` | `d63712d641648228a0cbf26dfec31330f2234f6debf2fc8ffb48bd0962401b49` | si |
| `lia_rig_eyes_crescent_neutral_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_neutral_v1.png` | `894d535eca8dac0e5bcb1a2d4e6ae5ff8f8253e6abb30105689358dd4331a9ca` | si |
| `lia_rig_eyes_crescent_blink_25_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_25_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_blink_25_v1.png` | `3f277e17d5e2cebf98e9b2418c1f6adafc8257696b440fecab0d30ab765a116d` | si |
| `lia_rig_eyes_crescent_blink_50_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_blink_50_v1.png` | `4000665f86badc98e063f2e0503708e5c331d44b4494b79edc8cd076fb4dd92d` | si |
| `lia_rig_eyes_crescent_closed_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_closed_v1.png` | `8571b835606c773764ee4d42a8840a8ae876d23eaf461d9b41f3812574909ee7` | si |
| `lia_rig_eyes_crescent_happy_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_happy_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_happy_v1.png` | `3dde255910f0c68d7d16f84e573adaf10ecf7743674f83594cdd3547a3761083` | si |
| `lia_rig_eyes_crescent_attentive_v1.png` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_attentive_v1.png` | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_rig_eyes_crescent_attentive_v1.png` | `bafccef0ed05db8e3a8f846ce4ff38663ffc8b5e71f4df64d99d5f0f159c6960` | si |
| `lia_transition_root_master_v1.png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_master_v1.png` | `289e54681bbd4d390290ddd04ab308c455d5174bc2d5c31c4dc05c7d3f9ce46b` | si |
| `lia_transition_root_master_v1.webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_master_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_master_v1.webp` | `89e7a0cb1063ce2924e122a2b4b29471c0931c78b8905526917358fcda7503f0` | si |
| `lia_transition_root_idle_4f_v1.png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_idle_4f_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_idle_4f_v1.png` | `556c1169de2b3f593b3c193c29d3a39df8c234c337e4dbfde79b099d9608ee9d` | si |
| `lia_transition_root_idle_4f_v1.webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_idle_4f_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_idle_4f_v1.webp` | `01cb2547adfd3f281bbcbadc0522881c7d0fce20529b654647dbb3e93aa46013` | si |
| `lia_transition_root_guide_2f_v1.png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_guide_2f_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_guide_2f_v1.png` | `a2a7d6be91d6da7d5519185e90163980090a834f9b1c189dca295664022ec454` | si |
| `lia_transition_root_guide_2f_v1.webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_guide_2f_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_guide_2f_v1.webp` | `2f10665e3a6a20b684c938e4c157e17f8e80be33549419082bc32d1d02cc182c` | si |
| `lia_transition_root_exit_v1.png` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_exit_v1.png` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_exit_v1.png` | `090ca24aff6dc46e3e4e85baf5badae95debe4bb22541a636539a1853615bddc` | si |
| `lia_transition_root_exit_v1.webp` | `src/assets/transition-world/root/runtime/lia/lia_transition_root_exit_v1.webp` | `public/assets/gvo/shared/lia/current-used/transition-world/lia_transition_root_exit_v1.webp` | `1cd7cdb558a18fb6118a68ba93ff9d878f4764ed93c1bb1b5eec7e830ee0a2f4` | si |

## 8. Assets duplicados o equivalentes

Se detectaron equivalencias por SHA256 entre runtime y paquetes documentales/canonicos. Para evitar duplicados innecesarios, la biblioteca copia los current-used y documenta las equivalencias.

| Grupo | SHA256 | Archivos equivalentes |
|---:|---|---|
| 1 | `540b20575f2812088484045e1aaebc2c44e076489b5a6158e9906847f43727b4` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_activate_portal_1_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/00_lia_canonical/lia_canonical_cover_pose_activate_portal.png` |
| 2 | `17020fcdce68624db85ff173869d693d77a009e408859e323fc238d2f90b7064` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_explain_calm_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/00_lia_canonical/lia_canonical_cover_pose_explain_calm.png` |
| 3 | `5ebe67cb6857eb66e8f783c40f809e19c17053726ca600baaa9de509d3f50ddf` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_idle_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/00_lia_canonical/lia_canonical_cover_pose_idle.png` |
| 4 | `00618770ee7b259dcb867a3f6758b7e0697a7d851967986a79d4ad3f8b3b1353` | `public/assets/runtime/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/00_lia_canonical/lia_canonical_cover_pose_point_portal.png` |
| 5 | `3387e924a280eda332744b5f458dcd01468d8c35d33bedaf1846d29bf5c2e144` | `public/assets/runtime/cover-intro/lia/reference/lia_master_cover_reference_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/00_lia_canonical/lia_canonical_primary.png` |
| 6 | `a32fc8bfd4e6cbc33d200efc1fe7c4ee1ad217970bcc730ebd5932326af75685` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_body_bulb_segmented_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_body_bulb_segmented_v1.png` |
| 7 | `50bed4928638fcbd8ba59ec04e769d4c7127986083e74ff6f48680e0d43b3592` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_collar_amber_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_collar_amber_v1.png` |
| 8 | `bafccef0ed05db8e3a8f846ce4ff38663ffc8b5e71f4df64d99d5f0f159c6960` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_attentive_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_attentive_v1.png` |
| 9 | `3f277e17d5e2cebf98e9b2418c1f6adafc8257696b440fecab0d30ab765a116d` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_25_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_blink_25_v1.png` |
| 10 | `4000665f86badc98e063f2e0503708e5c331d44b4494b79edc8cd076fb4dd92d` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_blink_50_v1.png` |
| 11 | `8571b835606c773764ee4d42a8840a8ae876d23eaf461d9b41f3812574909ee7` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_closed_v1.png` |
| 12 | `3dde255910f0c68d7d16f84e573adaf10ecf7743674f83594cdd3547a3761083` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_happy_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_happy_v1.png` |
| 13 | `894d535eca8dac0e5bcb1a2d4e6ae5ff8f8253e6abb30105689358dd4331a9ca` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_eyes_crescent_neutral_v1.png` |
| 14 | `ed7c109044b82d9b1e4a122062a67966438e27867322f65957bd53a9f0e851d5` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_glow_collar_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_glow_collar_v1.png` |
| 15 | `d63712d641648228a0cbf26dfec31330f2234f6debf2fc8ffb48bd0962401b49` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_head_opal_clean_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_head_opal_clean_v1.png` |
| 16 | `1b5636a5092757326eceb3fde3e0567354c62542a42648372613d61e2c63dfa7` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_lower_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_petal_left_lower_v1.png` |
| 17 | `8858768fe51f5efcf71c8010187a04ebeb04620f45d91eae87e84b23f12becb9` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_left_upper_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_petal_left_upper_v1.png` |
| 18 | `c7ec877d82b3f86da5b7a9306847361e3a6cc7b5b7b702b63b15c36ff373cee5` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_lower_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_petal_right_lower_v1.png` |
| 19 | `57f90f78951ff06a220e4d9e55f2fc823358477620cf05a9f4ce8f57d252b1c4` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_right_upper_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_petal_right_upper_v1.png` |
| 20 | `cf4c1b31291bc76f6b6ec5e6c87827d80ec7eaf5b1632dedf6fb15bab9d00515` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_petal_top_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_petal_top_v1.png` |
| 21 | `8a1dbd2f6fb96d38a89963cebf861a6a41645eca96ad9efc0171e69ec402c896` | `public/assets/runtime/cover-intro/lia/rig/idle_v1/lia_rig_shadow_soft_v1.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/01_lia_rig_existing/lia_rig_shadow_soft_v1.png` |
| 22 | `971e57a5a8c09124a6f55e686c9ac147430fec03943b0c43c1bed1d823ab31ce` | `public/assets/runtime/loading-initial/lia/lia_loading_16f.png`<br>`docs/visual/transition-world/art-direction/t003e1_reference_pack/03_style_references_loading_cover/loading_lia_spritesheet_motion_reference.png` |

## 9. Referencias faltantes

| Referencia | Estado |
|---|---|
| - | No se detectaron referencias runtime faltantes para los assets copiados. |

Nota: algunas referencias documentales mencionan `lia_transition_root_blink_1f` como opcional, pero no es una referencia runtime obligatoria ni se considera faltante para 004D-8A.

## 10. Convencion futura para assets de Lia

Todo asset nuevo de Lia debe tener doble registro:

1. Copia canonica en `public/assets/gvo/shared/lia/approved/` si esta aprobado, o en `public/assets/gvo/shared/lia/candidates/` si sigue en revision.
2. Uso por pantalla documentado en `asset_manifest_lia_v1.json` y `docs/gvo/lia/LIA_USAGE_MAP_004D8A.md`.
3. Si una pantalla requiere copia runtime propia, crearla en la carpeta especifica solo mediante ticket posterior.

## 11. Reglas de uso por pantalla

- Carga Inicial conserva su spritesheet original.
- Portada / Intro conserva poses y rig idle original.
- Transicion entre mundos conserva assets PNG/WebP originales en `src/assets`.
- Mundo I no recibe microposes en este ticket.
- La biblioteca no cambia imports actuales.

## 12. Bloqueos o advertencias

- Hay capturas de validacion y paquetes documentales con Lia que no son runtime; no se copiaron como current-used.
- La carpeta `future/mundo-i-raiz/` queda preparada pero vacia salvo `.gitkeep`.
- Las futuras microposes requieren aprobacion visual y ticket especifico.

## 13. Criterio de salida

004D-8A queda completo si la biblioteca existe, el manifest registra assets copiados con hash, el mapa de uso esta documentado y el repo no tiene cambios runtime.
