# Assets runtime — world-5-root

Estado: `ST5_020A_PUBLISHED_PENDING_HUMAN_REVIEW + ST5_020B_PUBLISHED_PENDING_HUMAN_REVIEW / NO_HUMAN_APPROVAL`.

Los dieciocho assets integrados en `public/assets/gvo/stations/world-5/present-map/runtime/`
tienen aquí una copia byte-idéntica para revisión. El runtime importa únicamente
la ruta `stations/world-5/present-map/runtime`; esta carpeta no es fuente de imports.

| ID | Archivo | Dimensiones | Alpha | Bytes | SHA-256 |
|---|---|---:|:---:|---:|---|
| MAP-01 | `world5_map_environment_portrait_v01.webp` | 1440×2560 | no | 87.632 | `4EA310071C8D7D6CAEBAFBF2D245DF20F8F36603D0BF61E62EBCAD5FCD3546A0` |
| MAP-02 | `world5_map_environment_landscape_v01.webp` | 2560×1440 | no | 56.796 | `7EB9261B1ED1CE01B6ABAE302FA020A99DBFE2B5BA0F30A493E665F6753D938C` |
| MAP-03 | `world5_map_rim_portrait_v01.webp` | 1440×2560 | sí | 86.014 | `39DB9B7A016E8839F3788FD505A51F3C33127E51AAACC3AEFE134F194C6CAF7C` |
| MAP-04 | `world5_map_rim_landscape_v01.webp` | 2560×1440 | sí | 357.670 | `EB838E7F7E2ED0DF6561AE2A13AD4BD26209F313DAFCA0CAD51B78D48D5B95B2` |
| MAP-05 | `world5_map_sector_plants_v01.webp` | 1536×1536 | sí | 303.502 | `6694571EF217B853C8A76E027F99988133315538E7A286721210BDD4D0E0A530` |
| MAP-06 | `world5_map_sector_system_v01.webp` | 1536×1536 | sí | 115.746 | `B1534F1E43D248A30283E0FA3A94C383F9012B1F146B329EB6F446F743805C20` |
| MAP-07 | `world5_map_sector_space_v01.webp` | 1536×1536 | sí | 145.786 | `5774B6A8E6BF6E4E1A14F7F97D57B42FA5928A4DD24DA165A5E9BEC2809A6145` |
| MAP-08 | `world5_map_sector_visitor_v01.webp` | 1536×1536 | sí | 136.976 | `D596549E9C5550A70DF7E0615790157705E14766EBCA9590A4E5934F561D4533` |
| SUB-PLANTS-BG-PORTRAIT | `world5_sub_plants_environment_portrait_v01.webp` | 1440×1920 | no | 158.160 | `400279CBD5A569DB261277D14A1730AA0F7B0A4410BF56C8683DC1CA62FC1612` |
| SUB-PLANTS-BG-LANDSCAPE | `world5_sub_plants_environment_landscape_v01.webp` | 1920×1080 | no | 115.856 | `27FBB61F3C6817990F4C049DB3879879226AC2A51291D4F93F1E11A6ADB9CB26` |
| SUB-PLANTS-FOCUS | `world5_sub_plants_focus_v01.webp` | 1536×1536 | sí | 154.396 | `3A3FC7759B7F51B6EAF5646F488F401C15F68C3A8540D9EF84A35862FFEEC8BE` |
| SUB-SYSTEM-BG-PORTRAIT | `system/world5_sub_system_environment_portrait_v01.webp` | 1440×1920 | no | 91.210 | `F9C5978400F3DEB37E027CDBC9AEB0D6754E6FA04441BE641F83561496326BCB` |
| SUB-SYSTEM-BG-LANDSCAPE | `system/world5_sub_system_environment_landscape_v01.webp` | 1920×1080 | no | 51.930 | `9AF9FEF48649CBFCD650513EB5F7662FEDC584079800616F7E6C4AB652C231D3` |
| SUB-SYSTEM-FOCUS | `system/world5_sub_system_focus_v01.webp` | 1536×1536 | sí | 185.742 | `680392B58B8A6C9B13C5AA36783FF481303B31712F3646471DCC4375AE3390B2` |
| LIA-EXPLAIN-CALM | `lia/lia_pose_explain_calm_v1.png` | 1086×1448 | sí | 727.614 | `17020FCDCE68624DB85FF173869D693D77A009E408859E323FC238D2F90B7064` |
| LIA-GREETING | `lia/lia_pose_greeting_v1.png` | 1086×1448 | sí | 702.541 | `7A25A54FBC96852D0C5E26B4DE1FD470AE708ECCDEF7EF7352D37806E89C0AD5` |
| LIA-LEAD-FORWARD | `lia/lia_world5_lead_forward_v01.webp` | 1536×1536 | sí | 120.244 | `58696A77F16BDE395FB093771790377F3B44FC788FF9D1B661080E92806A009E` |
| LIA-ATTEND-NEUTRAL | `lia/lia_world5_attend_neutral_v01.webp` | 1536×1536 | sí | 135.910 | `BFD5C5E3EB4DE9B9A908C6DAA7730EA9005AF912ABB58CE735C81DDCAA451316` |

Presupuestos: mapa crítico 1.290.122 bytes; Plantas 428.412 bytes; Sistema
328.882 bytes; Lía 1.686.309 bytes. No se integró `SUB-PLANTS-FG-01`.
Runtime consume únicamente las rutas canónicas; `current-used` no es fuente de
imports. Las cuatro poses de Lía permanecen sin mirror CSS, recomprensión ni
deformación.
