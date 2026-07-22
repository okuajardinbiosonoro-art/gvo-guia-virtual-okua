# Assets utilizados — Mundo IV / Estación IV

## Estado

`CERRADA 018E / HUMAN_APPROVED / RUNTIME / ESPEJO BYTE-IDÉNTICO / PWA INSTALADA NO CERTIFICADA`

Esta carpeta es el espejo canónico de los 20 assets aprobados que consume la
composición estática de `src/screens/World4Root/`. Los imports runtime viven en:

```text
public/assets/gvo/stations/world-4/system-table/runtime/
```

Cada ruta relativa de la tabla existe bajo esa base y bajo
`public/assets/gvo/current-used/world-4-root/`. El par conserva filename,
bytes y SHA-256. R1 no elimina ni modifica binarios: el plano posterior z1 se
mantiene y el canto frontal z5 se conserva aquí, en runtime y en manifest, pero
queda fuera del render por la decisión
`front-edge-disabled-by-human-review`. La aprobación humana expresa del ticket
018E cierra Estación IV; no se infiere de la presencia de estos archivos. La
experiencia no usa audio, ofrece reduced motion completo y mantiene como
limitación que la PWA instalada no fue certificada en la plataforma de QA.

## Inventario integrado — 20 pares

| Ruta relativa en runtime y espejo                | Formato / dimensiones | SHA-256                                                            | Función / consumidor                                         | Estado         |
| ------------------------------------------------ | --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ | -------------- |
| `environment/world4_environment_base_v01.webp`   | WEBP / 1536×1536      | `3EA217DD2CD32A60B975AAAC004A0939722B964043824C2831BB077150177B5F` | Base ambiental z0; `World4Stage.tsx`                         | Integrado 018C |
| `environment/world4_rear_depth_plane_v01.png`    | PNG / 1536×1536       | `3CD13E9EC67E65CC27E6800A56D6F43D2080543B5BC1A3E9E209B95918D76A8D` | Plano posterior z1; retenido tras toggle R1                  | Integrado R1   |
| `environment/world4_haze_overlay_v01.png`        | PNG / 1536×1536       | `A9FFC0E062A43B033D3D68F070D43D49870B88D45B085B4755E6E6F65B634894` | Bruma restringida z2; `World4Stage.tsx`                      | Integrado 018C |
| `table/world4_table_contact_shadow_v01.png`      | PNG / 1536×1024       | `8CB221897A5DF758648388B145BB18B2AFC3754475725355030B824CAC88BD1A` | Sombra de contacto z3; `World4Stage.tsx`                     | Integrado 018C |
| `table/world4_table_lower_base_v01.png`          | PNG / 1536×1024       | `0602AE857B008BE7ED415B55A80EEF7E835A4E4DA2D8E9C0A8B2A158949CCCE6` | Base inferior z4; `World4Stage.tsx`                          | Integrado 018C |
| `table/world4_table_front_edge_v01.png`          | PNG / 1536×1024       | `4FF8F9FB62AD0B2A906920EF34D75AE8CF10585CFB8B82916AE69DCFEB2D56CA` | Canto frontal z5; preservado, excluido del render R1         | Preservado R1  |
| `table/world4_table_top_v01.png`                 | PNG / 1536×1024       | `414D3DBF394ACC4C6649C46B6703400B8419E0EB912BA12ADAD36B56E9B74282` | Superficie de mesa z6; `World4Stage.tsx`                     | Integrado 018C |
| `route/world4_system_route_base_v01.png`         | PNG / 1536×1024       | `111B8855F3FFE68BE5EE27DB16317C26C389012BAA1E36B5E8202863151460AB` | Ruta pasiva z7; `World4Stage.tsx`                            | Integrado 018C |
| `nodes/world4_node_state_halo_sheet_v01.png`     | PNG / 1536×512        | `FB8378FB34392D0067E166B6697AEAE42663A2A33310701CC552DCA186C31DBE` | Sprite de halos 3×1 z8; `World4NodeStack.tsx`                | Integrado 018C |
| `nodes/world4_node_pedestal_v01.png`             | PNG / 1024×1024       | `53737E24F412E84035D491298800223236DE063CFB4B1D01828C5D20AAF53C70` | Pedestal reutilizado z9; `World4NodeStack.tsx`               | Integrado 018C |
| `objects/world4_node_plant_v01.png`              | PNG / 1024×1024       | `38106D67FD9A64296BE9E70730B9B4E20E52889016176F95F2D666DEFF222AA9` | Objeto Planta z10; `World4NodeStack.tsx`                     | Integrado 018C |
| `objects/world4_node_bionosifier_v01.png`        | PNG / 1024×1024       | `ACBF86CB92DF36CAD9B93099ACBEB515958A4C8F3EBDE34AB644659B782F2F53` | Objeto Bionosificador z10; `World4NodeStack.tsx`             | Integrado 018C |
| `objects/world4_node_esp32_v01.png`              | PNG / 1024×1024       | `07B39AF4BBBD88D070096BC20F7AD939F8303A2F9CF622674A879D39985637A0` | Objeto ESP32 z10; `World4NodeStack.tsx`                      | Integrado 018C |
| `objects/world4_node_midi_v01.png`               | PNG / 1024×1024       | `EFBF9E01170A6C9E3EF7EB60288EFDF45F1B48B04F497FFA41999165018266BD` | Objeto MIDI z10; `World4NodeStack.tsx`                       | Integrado 018C |
| `objects/world4_node_wifi_udp_v01.png`           | PNG / 1024×1024       | `9BE6A05BA181AE4879EA60B198D4FA670225B7FDD11810C0B651B08C68517AC9` | Objeto Wi-Fi/UDP z10; `World4NodeStack.tsx`                  | Integrado 018C |
| `objects/world4_node_router_v01.png`             | PNG / 1024×1024       | `4C0311E9B8C396578A17ADD5AA6574EB542D87118031995A8774E56B9CB35625` | Objeto Router z10; `World4NodeStack.tsx`                     | Integrado 018C |
| `objects/world4_node_central_system_v01.png`     | PNG / 1024×1024       | `069DDCF6DCA26053C067D649D8794A19C06D21307C0E725D2FE71AFF4DFF2EAA` | Objeto Sistema central z10; `World4NodeStack.tsx`            | Integrado 018C |
| `objects/world4_node_sound_v01.png`              | PNG / 1024×1024       | `10D16B9595489553BF3326EE610D553BA12EBA4E52672CC3BBD41B37F9B6EB82` | Objeto Sonido z10; `World4NodeStack.tsx`                     | Integrado 018C |
| `ui/world4_text_card_backplate_v01.png`          | PNG / 1536×512        | `671C85418875F6AE70EA29D5E7D1AFDA4E3A761795949C0772BE9F974D480324` | Backplate 9-slice de tarjeta z12; `World4RootScreen.tsx`     | Integrado 018C |
| `ui/world4_open_world5_button_backplate_v01.png` | PNG / 1024×512        | `BA8F1C704892A7DE229564340BCAD08CABF80946337A5458933ECFEC70ACA875` | Backplate neutral 9-slice de CTA z12; `World4RootScreen.tsx` | Integrado 018C |

## Lía reutilizada

Estación IV conserva dos poses oficiales compartidas; no se duplican dentro de
este espejo porque ya están registradas byte-idénticas en `cover-intro`:

| Uso             | Ruta runtime compartida                                                                | Registro existente                                                                  | SHA-256                                                            |
| --------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Guía estática   | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png` | `public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_explain_calm_v1.png` | `17020FCDCE68624DB85FF173869D693D77A009E408859E323FC238D2F90B7064` |
| Cierre estático | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png`     | `public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_greeting_v1.png`     | `7A25A54FBC96852D0C5E26B4DE1FD470AE708ECCDEF7EF7352D37806E89C0AD5` |

## Contrato

- `world4RuntimeAssets.ts` define las URLs consumidas.
- `world4AssetManifest.ts` registra hashes, `alpha_bbox`, tamaños baseline,
  sprite de halos y slices de UI.
- `world4Geometry.ts` fija artboard, anchors normalizados, target mínimo y
  z-order.
- Texto, numerales, estados, botones y navegación permanecen en DOM.
- La experiencia no integra audio y conserva reduced motion completo.
- La PWA instalada no está certificada en la plataforma de QA.
- `world4_node_top_object_master_v01.png` está prohibido y no forma parte de
  runtime ni de este espejo.
- No mover, convertir, optimizar o reexportar los binarios por separado.
