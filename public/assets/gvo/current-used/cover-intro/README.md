# Portada — interiores visuales dedicados de Portal I–V

Estado del consumidor: `GVO_DEBT_013 / INTEGRATED_FOR_REVIEW / PENDING_HUMAN_REVIEW`.

Los cinco interiores de Portada proceden del paquete humano aprobado
`GVO_COVER_PORTAL_INTERIORS_APPROVED_V01.zip` (SHA-256
`B70B2604DD5E960A0057C10D269F756C18E3CD47411D84348B395E0F119A78CC`).
Cada WebP runtime conserva un mirror físico byte-idéntico en este árbol. Las
fuentes y masters aprobados permanecen fuera de `public`, en
`docs/assets/cover-intro/production-sources/portal_1..5/`.

Esta integración desacopla explícitamente Portada del Mirador: `/inicio`
conserva las cinco representaciones de `final-root/access`, mientras
`CoverIntroScreen` consume únicamente los interiores dedicados enumerados a
continuación. Ningún binario fue transformado.

| ID de uso               | Ruta relativa bajo runtime y mirror                                        | Formato / dimensiones | SHA-256                                                            | Función / consumidor                                | Estado                                           |
| ----------------------- | -------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------ |
| `COVER-PORTAL-I-013C`   | `portals/portal_1/interior/cover_portal_world1_root_interior_v01.webp`     | WEBP RGB / 1024×1872  | `31A0635850AF15531EE75DC9C2A3E4D1EDFE322FA9D4569D6D94513434255C92` | Interior full-bleed Portal I / `CoverIntroScreen`   | Asset aprobado; consumidor pendiente de revisión |
| `COVER-PORTAL-II-013C`  | `portals/portal_2/interior/cover_portal_world2_pulse_interior_v01.webp`    | WEBP RGB / 1024×1872  | `50C605CDC891F8B21D9ED792D299A8BE14A28954A78D1BD25C85BB1915F3A941` | Interior full-bleed Portal II / `CoverIntroScreen`  | Asset aprobado; consumidor pendiente de revisión |
| `COVER-PORTAL-III-013C` | `portals/portal_3/interior/cover_portal_world3_notebook_interior_v01.webp` | WEBP RGB / 1024×1872  | `D2298B810E358474B75FE3DF60FF92B0ECE15A2B7B06C85BDAF2AAF8CBDD6659` | Interior full-bleed Portal III / `CoverIntroScreen` | Asset aprobado; consumidor pendiente de revisión |
| `COVER-PORTAL-IV-013C`  | `portals/portal_4/interior/cover_portal_world4_system_interior_v01.webp`   | WEBP RGB / 1024×1872  | `96A961322FE58371C60B078DF03A11B240F6672929359AFED539BF485E1CE939` | Interior full-bleed Portal IV / `CoverIntroScreen`  | Asset aprobado; consumidor pendiente de revisión |
| `COVER-PORTAL-V-013C`   | `portals/portal_5/interior/cover_portal_world5_map_interior_v01.webp`      | WEBP RGBA / 1024×1872 | `CC95E888B472D8E14295F8B9623144262F699D7583D5A2B1062085CDD5019563` | Interior full-bleed Portal V / `CoverIntroScreen`   | Asset aprobado; consumidor pendiente de revisión |

Los números romanos, locks, labels, estados y controles permanecen en DOM o en
los assets históricos aprobados de Portada. El Atlas no sustituye este registro.
