# GVO ST5-020A — Integración vertical slice real Plantas

Fecha: 2026-07-29

Estado publicado: `ST5_020A_PUBLISHED_PENDING_HUMAN_REVIEW`

Copy: `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL`

Lía: `LIA_NOT_YET_INTEGRATED_IN_020A`

QA browser: `VISUAL_BROWSER_QA_PENDING_IF_NOT_EXECUTED = false`

## Dictamen

El mapa real de Mundo V y la subestación real Plantas quedaron integrados y
preparados como checkpoint publicable en `main` en
`/estacion/5` y `/estacion/5/plantas`. El resultado no constituye aprobación
visual ni cierre de Estación V. Sistema, Espacio, Visitante, Final y cualquier
bitmap nuevo de Lía permanecen fuera del alcance.

## Inventario validado

Todos los archivos son WebP sRGB, fueron copiados sin recomprimir y tienen el
mismo SHA-256 en origen, runtime y espejo `current-used`. El manifiesto
machine-readable completo está en
`public/assets/gvo/stations/world-5/present-map/runtime/manifest.json`.

| ID | Origen bajo `C:/Users/JOSE DAVID/Downloads` | Archivo runtime | Dimensiones | Alpha | Bytes | SHA-256 |
| --- | --- | --- | ---: | :---: | ---: | --- |
| MAP-01 | `Nueva carpeta/` | `world5_map_environment_portrait_v01.webp` | 1440×2560 | no | 87,632 | `4EA310071C8D7D6CAEBAFBF2D245DF20F8F36603D0BF61E62EBCAD5FCD3546A0` |
| MAP-02 | `Nueva carpeta (2)/` | `world5_map_environment_landscape_v01.webp` | 2560×1440 | no | 56,796 | `7EB9261B1ED1CE01B6ABAE302FA020A99DBFE2B5BA0F30A493E665F6753D938C` |
| MAP-03 | `Nueva carpeta (3)/` | `world5_map_rim_portrait_v01.webp` | 1440×2560 | sí | 86,014 | `39DB9B7A016E8839F3788FD505A51F3C33127E51AAACC3AEFE134F194C6CAF7C` |
| MAP-04 | `images6/` | `world5_map_rim_landscape_v01.webp` | 2560×1440 | sí | 357,670 | `EB838E7F7E2ED0DF6561AE2A13AD4BD26209F313DAFCA0CAD51B78D48D5B95B2` |
| MAP-05 | `images7/` | `world5_map_sector_plants_v01.webp` | 1536×1536 | sí | 303,502 | `6694571EF217B853C8A76E027F99988133315538E7A286721210BDD4D0E0A530` |
| MAP-06 | `images8/` | `world5_map_sector_system_v01.webp` | 1536×1536 | sí | 115,746 | `B1534F1E43D248A30283E0FA3A94C383F9012B1F146B329EB6F446F743805C20` |
| MAP-07 | `images9/` | `world5_map_sector_space_v01.webp` | 1536×1536 | sí | 145,786 | `5774B6A8E6BF6E4E1A14F7F97D57B42FA5928A4DD24DA165A5E9BEC2809A6145` |
| MAP-08 | `images10/` | `world5_map_sector_visitor_v01.webp` | 1536×1536 | sí | 136,976 | `D596549E9C5550A70DF7E0615790157705E14766EBCA9590A4E5934F561D4533` |
| SUB-PLANTS-BG-PORTRAIT | `images11/` | `world5_sub_plants_environment_portrait_v01.webp` | 1440×1920 | no | 158,160 | `400279CBD5A569DB261277D14A1730AA0F7B0A4410BF56C8683DC1CA62FC1612` |
| SUB-PLANTS-BG-LANDSCAPE | `images12/` | `world5_sub_plants_environment_landscape_v01.webp` | 1920×1080 | no | 115,856 | `27FBB61F3C6817990F4C049DB3879879226AC2A51291D4F93F1E11A6ADB9CB26` |
| SUB-PLANTS-FOCUS | `images13/` | `world5_sub_plants_focus_v01.webp` | 1536×1536 | sí | 154,396 | `3A3FC7759B7F51B6EAF5646F488F401C15F68C3A8540D9EF84A35862FFEEC8BE` |

Destino runtime común:
`public/assets/gvo/stations/world-5/present-map/runtime/`. Espejo común:
`public/assets/gvo/current-used/world-5-root/`. Mapa crítico: 1,290,122 bytes.
Bundle Plantas: 428,412 bytes.

## Arquitectura y estados

- Un único `button` por sector contiene raster, etiqueta y estado; no existen
  overlays táctiles paralelos.
- Plantas es el único sector recorrible. Sistema puede verse como `available`
  después de Plantas, pero conserva `disabled`; Espacio y Visitante siguen
  bloqueados.
- Estados: `map_stable`, `camera_entering_plantas`,
  `substation_plantas_intro`, `substation_plantas_interactive`,
  `substation_plantas_resolved`, `substation_plantas_storage_error`,
  `camera_returning_to_map` y `map_plantas_completed`.
- La cámara usa el wrapper de Plantas y el ancla `A_PLANT_LEAF`; la medición
  FLIP se hace con `DOMRect`, sólo anima transform/opacity y registra drift 0 px.
- El foreground A es CSS/SVG y no introduce `SUB-PLANTS-FG-01`.
- La única acción de escena es la hoja real. El pulso SVG recorre
  hoja→tallo→suelo y anuncia la resolución mediante `aria-live`.
- Durante solapamiento se cargan mapa y Plantas; al estabilizar sólo se asignan
  fuentes a la escena vigente. Portrait y landscape usan variantes propias.

## Persistencia, acceso y límites

`gvo.station5.v1` usa schema 1, normalización de prefijo, escritura verificada e
idempotencia. Sólo puede persistir `completedAreas: ["plantas"]`. El retorno se
habilita después de confirmar storage. `gvo.progress.v1` no se modifica, por lo
que Estación V y Final no se completan. El foco vuelve al wrapper Plantas.

Los controles nativos tienen foco visible y target mínimo 44×44 px. El árbol
inactivo queda `inert` y `aria-hidden`. La variante `prefers-reduced-motion`
elimina travel largo, conserva estado, ruta, feedback, persistencia y retorno.
No se solicitaron permisos, cámara, QR, audio o video.

## Responsive y QA visual

Se validaron 360×560, 360×640, 375×559, 375×667, 390×650, 390×844,
430×740, 430×932, 768×1024, 1024×768, 844×390 y 1440×900. Todos conservaron
0 px de overflow horizontal y targets de al menos 44 px. En alturas compactas
el contenido usa scroll vertical. El proxy de reflow 200% (viewport CSS mínimo
240×422) produjo scroll vertical y 0 px horizontal.

Evidencia:

- [Flujo completo 390×844](../visual/world5/st5-020a/contact_sheet_flow_390x844.png)
- [Contact sheet responsive](../visual/world5/st5-020a/contact_sheet_responsive.png)
- [Landscape Plantas 844×390](../visual/world5/st5-020a/plants_844x390.png)
- [Reflow 200%](../visual/world5/st5-020a/reflow_200pct_proxy_195x422.png)
- [Wrappers, safe area y envelope Lía](../visual/world5/st5-020a/diagnostic_wrappers_safe_lia_390x844.png)
- [Crop ancla mapa](../visual/world5/st5-020a/crop_anchor_map_390x844.png)
- [Crop ancla Plantas](../visual/world5/st5-020a/crop_anchor_plants_390x844.png)

## PWA, red y validación

Los bundles `world5MapCritical` y `world5Plants` registran las once URLs. El
build oficial genera el service worker; la auditoría final comprueba que las
once están en el precache. La prueba E2E registra 0 requests externas y 0
errores de consola. La navegación local cubre mapa, entrada, pulso, storage,
refresh, retorno, foco, responsive y reduced motion.

Resultados finales:

- `npm run lint`: PASS.
- `npm run test`: PASS, 21 archivos y 241/241 tests.
- `npm run build`: PASS; TypeScript y Vite/PWA, 245 entradas de precache.
- `npm run audit:assets`: PASS, sin URLs externas, CDN ni audio.
- E2E focal ST5-020A: PASS, 3/3.
- E2E global: 32/37. Los cinco fallos se reprodujeron aislados y están fuera de
  Mundo V: dos selectores de elementos históricos de Carga V13, un timeout de
  `resetIntro` y dos selectores estrictos duplicados de “Preparando recorrido...”
  en Transición. No se modificaron esos frentes dentro de ST5-020A.
- Precache audit: 11/11 nombres exactos presentes en `dist/sw.js`.

No se declara QA físico ni PWA instalada en dispositivo. El build mantiene la
advertencia preexistente de chunk JS mayor a 500 kB; no bloquea la generación.

## Revisión humana exacta

1. Abrir `/estacion/5` en 390×844 y verificar legibilidad, seams, safe areas y
   que únicamente Plantas sea accionable.
2. Activar Plantas y observar selección, match-cut, umbral y escena estable.
3. Tocar la hoja una vez; confirmar pulso hoja→tallo→suelo y check final.
4. Volver al mapa; confirmar foco en Plantas, check persistente y Sistema visible
   como siguiente área pero todavía bloqueado.
5. Recargar `/estacion/5/plantas`; confirmar estado resuelto sin frame intermedio.
6. Repetir en 844×390, teclado, zoom 200% y reduced motion del sistema.
7. Evaluar copy y presencia futura de Lía por separado; no interpretar este
   reporte como aprobación humana.

## Limitaciones vigentes

- `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL`.
- `LIA_NOT_YET_INTEGRATED_IN_020A` y sin bitmap nuevo de Lía.
- Sistema, Espacio, Visitante, cierre de Estación V y Final fuera de alcance.
- QA físico y PWA instalada pendientes.
- La prohibición histórica de commit/push de 020A fue reemplazada por la
  autorización explícita de publicación de 020B. No se usa Pull Request.
