# GVO ST5-020B — Lía + vertical slice real Sistema

Fecha: 2026-07-30

Estados: `ST5_020A_PUBLISHED_PENDING_HUMAN_REVIEW` y
`ST5_020B_PUBLISHED_PENDING_HUMAN_REVIEW`

Flags: `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL` ·
`LIA_WORLD5_APPROVED_ASSETS_INTEGRATED_PENDING_HUMAN_RUNTIME_REVIEW` ·
`SPACE_ROUTE_PROTECTED` · `VISITOR_ROUTE_PROTECTED` ·
`FINAL_4_OF_4_OUT_OF_SCOPE`

## Publicación y alcance

El baseline remoto fue `76eee69ec040d80e211204bc76f68a06ef51e839`. El
Checkpoint A publicó ST5-020A mediante commit
`365bd4aaa79ebcba9fdd596abca6a6bc97578468`, empujado directamente a
`origin/main`. El Checkpoint B es el commit que contiene este documento; su SHA
y confirmación remota se registran en la salida de cierre porque un commit no
puede contener de forma autorreferencial su propio hash.

ST5-020B integra las cuatro poses aprobadas de Lía y habilita únicamente Sistema
después de Plantas. No implementa contenido de Espacio o Visitante, no deriva
3/4 ni 4/4, no completa Estación V y no navega a Final. No se creó Pull Request.

## Inventario nuevo

Todos los pares runtime/`current-used` fueron copiados sin transformar y la
prueba ejecutable valida formato real, canvas, alpha, bytes, SHA-256 e igualdad
byte a byte.

| ID | Origen | Destino runtime | Canvas | Alpha | Bytes | SHA-256 |
| --- | --- | --- | ---: | :---: | ---: | --- |
| SUB-SYSTEM-BG-PORTRAIT | `Downloads/images14/` | `system/world5_sub_system_environment_portrait_v01.webp` | 1440×1920 | no | 91.210 | `F9C5978400F3DEB37E027CDBC9AEB0D6754E6FA04441BE641F83561496326BCB` |
| SUB-SYSTEM-BG-LANDSCAPE | `Downloads/images15/` (contenido aprobado de `images15(2).zip`) | `system/world5_sub_system_environment_landscape_v01.webp` | 1920×1080 | no | 51.930 | `9AF9FEF48649CBFCD650513EB5F7662FEDC584079800616F7E6C4AB652C231D3` |
| SUB-SYSTEM-FOCUS | `Downloads/images16/` | `system/world5_sub_system_focus_v01.webp` | 1536×1536 | sí | 185.742 | `680392B58B8A6C9B13C5AA36783FF481303B31712F3646471DCC4375AE3390B2` |
| LIA-EXPLAIN-CALM | pose canónica existente | `lia/lia_pose_explain_calm_v1.png` | 1086×1448 | sí | 727.614 | `17020FCDCE68624DB85FF173869D693D77A009E408859E323FC238D2F90B7064` |
| LIA-GREETING | pose canónica existente | `lia/lia_pose_greeting_v1.png` | 1086×1448 | sí | 702.541 | `7A25A54FBC96852D0C5E26B4DE1FD470AE708ECCDEF7EF7352D37806E89C0AD5` |
| LIA-LEAD-FORWARD | `Downloads/LIA_LEAD_FORWARD_APPROVED_FINAL/` | `lia/lia_world5_lead_forward_v01.webp` | 1536×1536 | sí | 120.244 | `58696A77F16BDE395FB093771790377F3B44FC788FF9D1B661080E92806A009E` |
| LIA-ATTEND-NEUTRAL | `Downloads/LIA_ATTEND_NEUTRAL_APPROVED_FINAL/` | `lia/lia_world5_attend_neutral_v01.webp` | 1536×1536 | sí | 135.910 | `BFD5C5E3EB4DE9B9A908C6DAA7730EA9005AF912ABB58CE735C81DDCAA451316` |

Sistema pesa 328.882 bytes y Lía 1.686.309 bytes. Ningún archivo supera 4 MiB.
Los bundles tipados son `world5MapCritical`, `world5Plants`, `world5System` y
`world5Lia`; el service worker generado se audita por las 18 URLs exactas.

## Runtime, rutas y persistencia

La máquina única usa área tipada (`plantas | sistema`) y fases explícitas de
mapa, entrada, intro, interacción, resolución, error de storage y retorno. Cada
timeline conserva epoch/cancelación; el retorno sólo se habilita después de
escritura y relectura verificadas. El focus de Sistema es el único botón
contextual y muestra una conexión general SVG, check y el anuncio
`Mediación visible.` sin depender sólo del color.

Rutas activas: `/estacion/5`, `/estacion/5/plantas` y
`/estacion/5/sistema`. Sistema exige el prefijo `['plantas']`.
`/estacion/5/espacio` y `/estacion/5/visitante` redirigen con `replace` al mapa
y no montan contenido. Después de Sistema, Espacio se ve disponible pero
permanece `disabled` y protegido.

La clave `gvo.station5.v1` acepta sólo el prefijo canónico y después de Sistema
contiene `completedAreas: ['plantas','sistema']`. Desconocidos, duplicados y
saltos se normalizan. `gvo.progress.v1` no se modifica.

Lía asigna poses a explicación, atención, entrada/retorno y resolución. Su
wrapper es decorativo, `aria-hidden`, `pointer-events:none`, no es target, no se
espeja ni se deforma y en reduced motion queda en la posición terminal.

## Validación y QA

- TypeScript directo: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS, 22 archivos y 254/254 pruebas.
- `npm run build`: PASS, 252 entradas de precache; conserva únicamente la
  advertencia preexistente de chunk JS mayor a 500 kB.
- `npm run audit:assets`: PASS, sin URLs externas, CDN ni audio.
- E2E focal ST5-020A + ST5-020B: PASS, 7/7; cubre flujo, rutas protegidas,
  teclado, responsive, landscape nativo, reduced motion, consola y red.
- `git diff --check`: PASS en el cierre final.
- Build PWA: 18/18 rutas runtime de Mundo V quedan presentes de forma
  root-equivalente en `dist/sw.js`; no se precargan espejos `current-used`.

Evidencia visual reproducible:

- [Mapa tras Sistema 390×844](../visual/world5/st5-020b/map_after_system_390x844.png)
- [Sistema landscape 844×390](../visual/world5/st5-020b/system_844x390.png)
- [Sistema reduced motion 390×844](../visual/world5/st5-020b/reduced_motion_system_390x844.png)

El control del navegador embebido no estaba expuesto en esta sesión; la QA se
ejecutó en Chromium local mediante Playwright y las tres capturas se
inspeccionaron visualmente a resolución original. No se declara PWA instalada
ni QA física en dispositivo.

## Revisión humana conjunta exacta

Revisar Plantas + Lía + Sistema en conjunto: mapa inicial, entrada a Plantas,
retorno, entrada a Sistema, conector, síntesis, retorno con foco, refresh,
390×844, 844×390, teclado, 200% y reduced motion. Este reporte es evidencia
técnica y no equivale a `HUMAN_APPROVED` ni a cierre de Estación V.
