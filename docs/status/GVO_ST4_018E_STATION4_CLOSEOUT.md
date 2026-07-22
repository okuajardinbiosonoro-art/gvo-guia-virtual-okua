# GVO_ST4_018E — cierre integral de Estación IV

## Estado del cierre

Estación IV está **aprobada por revisión humana** en composición, layout,
responsive, Fullscreen API, orientación, secuencia 1→8, interacción, motion,
ambientación, revisita y reduced motion.

El cierre contractual `018E` queda documentado aquí, pero este archivo no
afirma por sí solo que el commit o el push ya ocurrieron. Esas dos acciones y
la igualdad entre `HEAD`, `origin/main` local y `main` remoto deben comprobarse
después de crear el commit único de cierre.

```text
Estado contractual versionado:
APROBACIÓN HUMANA + VALIDACIÓN TÉCNICA 018E = PASS
IDENTIDAD, PUSH Y PARIDAD DEL COMMIT = RESOLVER EN EVIDENCIA EXTERNA POST-PUSH
```

Identidad Git autorreferencial:

- rama objetivo: `main`;
- baseline publicado anterior a Estación IV:
  `b94c3287834c718e7ef970af9ec62da4789770f3`;
- commit de cierre: **el commit que contiene este documento**;
- SHA completo, SHA corto, URL del commit, push y paridad remota: deben quedar
  registrados después del push en la evidencia externa de `018E`;
- worktree, staging, untracked y divergencia finales: no se presuponen; deben
  verificarse explícitamente.

La fórmula anterior evita escribir dentro de un commit su propio SHA, una
autorreferencia que no puede resolverse de forma estable. El paquete externo
posterior al push es la fuente verificable del hash exacto.

## Aprobación humana y preservación histórica

La aprobación humana vinculante de `018E` cierra la revisión visual que quedó
pendiente en `018D`. No reabre ni reescribe los resultados históricos:

| Etapa | Resultado histórico preservado | Aporte acumulado |
| --- | --- | --- |
| `018A` | `GVO_ST4_018A_AUDIT_AND_MASTER_ASSET_INVENTORY_COMPLETE` | Auditoría read-only, inventario, diagnóstico de la base 2.5D y blueprint de 29 slots. |
| `018B` | `GVO_ST4_018B_MF01_CAMERA_AND_REFERENCE_PACK_READY` | Cámara única, contratos de capas, anchors, reference pack y orden de producción asset-first. |
| `018C` | `GVO_ST4_018C_MF05_STATIC_COMPOSITION_READY_FOR_HUMAN_REVIEW` | Intake e integración estática de 20 assets aprobados y 20 espejos byte-idénticos. |
| `018C_R1` | `GVO_ST4_018C_R1_PARTIAL_PLATFORM_LIMITATION` | Layout inmersivo, portrait/landscape, OrientationHint, Fullscreen API y diagnóstico z1/z4/z5/z6. La PWA instalada no pudo certificarse en esa plataforma. |
| `018D` | `GVO_ST4_018D_MF06_PARTIAL_ENVIRONMENT_LIMITATION` | Ruta activa, FX 1–8, movimiento de Lía, ambiente, tap hint, cierre y reduced motion. Faltó el canal JavaScript del Browser integrado. |
| `018E` | pendiente de validación Git final | La aprobación humana actual resuelve la revisión visual; resta probar, documentar, crear el commit único, publicar y verificar limpieza/paridad. |

Los flags parciales de R1 y 018D describen fielmente sus sesiones y no se
modifican. La aprobación posterior resuelve sus gates humanos sin fingir que
aquellas plataformas ejecutaron capacidades que no tenían.

## Historia 018A → 018E

1. `018A` auditó sin modificar el repo. La base contenía la máquina funcional
   de seis fases y ocho nodos, pero fondo, mesa, ruta, nodos, tarjeta y CTA eran
   procedurales. Sólo se consumían dos poses binarias de Lía. Se diagnosticaron
   composición invertida respecto del objetivo, profundidad 2.5D, compact
   height exigente y targets insuficientes.
2. `018B` convirtió las decisiones humanas en contratos: 3D estilizado
   museográfico, texto arriba, mesa abajo, una cámara, autoridad compact
   `360×560`, soporte `1024×768`, mesa y entorno por capas, UI híbrida y dos
   poses de Lía reutilizadas.
3. La producción controlada de assets siguió el orden lookdev → entorno → mesa
   → ruta/nodos → objetos → UI, con aprobación individual y sin integrar durante
   la generación.
4. `018C` verificó el paquete aprobado por allowlist, dimensiones, alfa,
   `alpha_bbox` y SHA-256; sustituyó el arte provisional por 20 assets runtime,
   sus 20 mirrors y una composición alpha-aware sobre artboard único.
5. `018C_R1` corrigió la experiencia inmersiva. El toggle de capas demostró que
   z5 producía las protuberancias laterales: el asset se preservó, pero quedó
   excluido sólo del render. Se añadió orientación no bloqueante y fullscreen
   por gesto explícito.
6. `018D` añadió la coreografía sin cambiar pedagogía ni orden: entrada, ruta
   SVG, FX semánticos, travel de Lía, transición de tarjeta, ambiente, ayuda tap,
   cadena completa, CTA, salida y revisita.
7. `018E` recibe aprobación humana total, consolida documentación y prepara el
   único commit/push autorizado. No implementa Estación V.

## Contrato narrativo y funcional final

```text
Planta
→ Bionosificador
→ ESP32
→ MIDI
→ Wi‑Fi/UDP
→ Router
→ Sistema central
→ Sonido
```

- La planta no produce música directamente: origina una señal que atraviesa
  mediaciones técnicas.
- El progreso es secuencial; los nodos futuros permanecen bloqueados.
- Cada nodo completado puede revisitarse sin alterar la cadena.
- La CTA aparece sólo después de completar y asentar los ocho pasos.
- La salida usa `/transition/world-4-to-world-5`; no implementa ni modifica
  Estación V.
- No hay audio runtime.

## Arquitectura final

| Responsabilidad | Implementación canónica |
| --- | --- |
| Orquestación de pantalla | `src/screens/World4Root/World4RootScreen.tsx` |
| Estado temporal cancelable | `useWorld4MotionController.ts` |
| Cámara y composición | `World4Stage.tsx` + `world4Geometry.ts` |
| Nodos y hit targets | `World4NodeStack.tsx` |
| Ruta activa | `World4RoutePulse.tsx` |
| FX semánticos | `World4NodeFx.tsx` + `world4NodeFxConfig.ts` |
| Guía de Lía | `World4LiaGuide.tsx` |
| Ambiente | `World4AmbientLayer.tsx` |
| Ayuda de toque | `World4TapHint.tsx` reutilizando `GestureHint` |
| Timings | `world4MotionTokens.ts` |
| Registro runtime | `world4RuntimeAssets.ts` |
| Hashes y bboxes | `world4AssetManifest.ts` |
| Copy y semántica 1→8 | `station4Content.ts` |
| Responsive y estados visuales | `World4RootScreen.css` |
| Fullscreen | `src/shared/immersive/` |
| Orientación | `src/components/OrientationHint/` |

El controlador de motion usa operaciones cancelables, epoch, input lock y
timers independientes. Resize, orientación, fullscreen y `document.hidden`
normalizan o cancelan el movimiento sin duplicar progreso.

## Composición, cámara y capas

- Composición: **texto arriba / mesa abajo**.
- Artboard: `1536×1024`, relación `3:2` y escala CSS uniforme.
- Los ocho anchors se expresan en artboard y se normalizan; no existen offsets
  artísticos distintos por viewport.
- La alineación de objetos usa centro y baseline de contenido visible derivados
  de `alpha_bbox`, no el centro opaco del canvas completo.
- Layout R1: congelado.
- Portrait: soportado.
- Mobile landscape: recomendado cuando hay poco alto útil.
- `OrientationHint`: orientativo, descartable y no bloqueante.

Orden de capas aprobado:

```text
z0  environment
z1  rear depth plane
z2  haze
z3  contact shadow
z4  lower base
z5  front edge — preservado, excluido del render por revisión humana
z6  tabletop
z7  passive route + route overlay
z8  halo
z9  pedestal
z10 object + semantic FX
z11 Lía
z12 DOM/UI
```

Decisiones congeladas:

- `front-edge-disabled-by-human-review`;
- z1 retenido;
- pulso activo en SVG/CSS sobre la ruta pasiva;
- texto, numerales, estados y controles en DOM;
- no crear un master genérico de objetos heterogéneos.

## Inventario aprobado de 20 assets

Bases comunes:

```text
runtime: public/assets/gvo/stations/world-4/system-table/runtime/
mirror:  public/assets/gvo/current-used/world-4-root/
```

La ruta relativa de cada fila se concatena a ambas bases. `alpha_bbox` usa
`[left, top, right, bottom]`; el fondo WEBP es opaco y por eso no aplica bbox
alfa.

| Ruta relativa / filename | Dimensiones | `alpha_bbox` | SHA-256 |
| --- | ---: | --- | --- |
| `environment/world4_environment_base_v01.webp` | 1536×1536 | opaco / N/A | `3EA217DD2CD32A60B975AAAC004A0939722B964043824C2831BB077150177B5F` |
| `environment/world4_rear_depth_plane_v01.png` | 1536×1536 | `[55, 755, 1487, 976]` | `3CD13E9EC67E65CC27E6800A56D6F43D2080543B5BC1A3E9E209B95918D76A8D` |
| `environment/world4_haze_overlay_v01.png` | 1536×1536 | `[24, 545, 1502, 1220]` | `A9FFC0E062A43B033D3D68F070D43D49870B88D45B085B4755E6E6F65B634894` |
| `table/world4_table_contact_shadow_v01.png` | 1536×1024 | `[78, 825, 1460, 1005]` | `8CB221897A5DF758648388B145BB18B2AFC3754475725355030B824CAC88BD1A` |
| `table/world4_table_lower_base_v01.png` | 1536×1024 | `[90, 627, 1448, 876]` | `0602AE857B008BE7ED415B55A80EEF7E835A4E4DA2D8E9C0A8B2A158949CCCE6` |
| `table/world4_table_front_edge_v01.png` | 1536×1024 | `[55, 453, 1479, 635]` | `4FF8F9FB62AD0B2A906920EF34D75AE8CF10585CFB8B82916AE69DCFEB2D56CA` |
| `table/world4_table_top_v01.png` | 1536×1024 | `[38, 144, 1496, 825]` | `414D3DBF394ACC4C6649C46B6703400B8419E0EB912BA12ADAD36B56E9B74282` |
| `route/world4_system_route_base_v01.png` | 1536×1024 | `[138, 410, 1400, 526]` | `111B8855F3FFE68BE5EE27DB16317C26C389012BAA1E36B5E8202863151460AB` |
| `nodes/world4_node_state_halo_sheet_v01.png` | 1536×512 | `[39, 152, 1508, 380]` | `FB8378FB34392D0067E166B6697AEAE42663A2A33310701CC552DCA186C31DBE` |
| `nodes/world4_node_pedestal_v01.png` | 1024×1024 | `[59, 297, 963, 712]` | `53737E24F412E84035D491298800223236DE063CFB4B1D01828C5D20AAF53C70` |
| `objects/world4_node_plant_v01.png` | 1024×1024 | `[198, 126, 833, 893]` | `38106D67FD9A64296BE9E70730B9B4E20E52889016176F95F2D666DEFF222AA9` |
| `objects/world4_node_bionosifier_v01.png` | 1024×1024 | `[193, 292, 832, 746]` | `ACBF86CB92DF36CAD9B93099ACBEB515958A4C8F3EBDE34AB644659B782F2F53` |
| `objects/world4_node_esp32_v01.png` | 1024×1024 | `[177, 279, 830, 755]` | `07B39AF4BBBD88D070096BC20F7AD939F8303A2F9CF622674A879D39985637A0` |
| `objects/world4_node_midi_v01.png` | 1024×1024 | `[80, 180, 946, 817]` | `EFBF9E01170A6C9E3EF7EB60288EFDF45F1B48B04F497FFA41999165018266BD` |
| `objects/world4_node_wifi_udp_v01.png` | 1024×1024 | `[118, 230, 915, 818]` | `9BE6A05BA181AE4879EA60B198D4FA670225B7FDD11810C0B651B08C68517AC9` |
| `objects/world4_node_router_v01.png` | 1024×1024 | `[98, 196, 935, 766]` | `4C0311E9B8C396578A17ADD5AA6574EB542D87118031995A8774E56B9CB35625` |
| `objects/world4_node_central_system_v01.png` | 1024×1024 | `[247, 136, 771, 835]` | `069DDCF6DCA26053C067D649D8794A19C06D21307C0E725D2FE71AFF4DFF2EAA` |
| `objects/world4_node_sound_v01.png` | 1024×1024 | `[277, 279, 748, 713]` | `10D16B9595489553BF3326EE610D553BA12EBA4E52672CC3BBD41B37F9B6EB82` |
| `ui/world4_text_card_backplate_v01.png` | 1536×512 | `[31, 26, 1505, 485]` | `671C85418875F6AE70EA29D5E7D1AFDA4E3A761795949C0772BE9F974D480324` |
| `ui/world4_open_world5_button_backplate_v01.png` | 1024×512 | `[53, 72, 972, 440]` | `BA8F1C704892A7DE229564340BCAD08CABF80946337A5458933ECFEC70ACA875` |

Los 20 runtime y los 20 mirrors deben permanecer byte-idénticos. El inventario
detallado y sus consumidores viven en
[`public/assets/gvo/current-used/world-4-root/README.md`](../../public/assets/gvo/current-used/world-4-root/README.md).

`world4_node_top_object_master_v01.png` es un asset rechazado: no debe existir
como archivo aprobado, import, consumidor o entrada de precache. Su nombre
puede aparecer únicamente en controles negativos que documenten la exclusión.

## Lía

Estación IV no duplica ni regenera a Lía. Reutiliza dos poses oficiales:

| Uso | Ruta | SHA-256 |
| --- | --- | --- |
| Guía | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png` | `17020FCDCE68624DB85FF173869D693D77A009E408859E323FC238D2F90B7064` |
| Cierre | `public/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png` | `7A25A54FBC96852D0C5E26B4DE1FD470AE708ECCDEF7EF7352D37806E89C0AD5` |

En motion, Lía usa ocho posiciones de artboard, espejo para nodos 5–8 y travel
WAAPI de tres keyframes. En revisión permanece una sola Lía visible.

## Motion e interacción

Fases visuales:

```text
station_enter
→ idle
→ node_departing
→ lia_travel
→ route_transfer
→ node_arrival
→ node_active
→ node_settle
→ chain_complete
→ exit_reveal
→ exiting
```

Timings de referencia:

- entrada completa `1400 ms`; revisita abreviada `240 ms`;
- paso de nodo `1180 ms`; travel de Lía `720 ms`;
- ruta `520–760 ms`; FX `620–920 ms`;
- card out `120 ms`, swap `380 ms`, card in `180 ms`, body `+45 ms`;
- cierre `1280 ms`, CTA revelada a `1040 ms`;
- salida `650 ms`.

Reduced motion conserva orden, contenido, CTA y revisita con entrada `160 ms`,
nodo `180 ms`, cierre `260 ms` y salida `160 ms`. Elimina traveler, drift,
sway, scan, blink repetido, respiración y loops ambientales.

La ayuda tap aparece una vez por sesión, se consume con interacción previa y no
compite con la ayuda de orientación. El input queda bloqueado durante las
ventanas críticas; clicks, toque, Enter y Space comparten la misma progresión.

## PWA, fullscreen y orientación

- Manifest: `display: standalone`, `display_override: [fullscreen,
  standalone]`, `lang: es`, `scope: /`, `start_url: /`.
- Fullscreen API: sólo se solicita desde un gesto explícito y permite salida
  explícita; nunca se activa automáticamente.
- `OrientationHint`: no bloqueante, descartable por sesión y reactiva a cambio
  de orientación.
- La PWA instalada y relanzada no fue certificada en la plataforma QA.
- Un despliegue LAN mediante IP y HTTP no autoriza afirmar instalación PWA:
  Service Worker requiere origen seguro, salvo la excepción de desarrollo para
  localhost.
- El espejo `current-used` se excluye del precache; los 20 assets runtime de W4
  deben estar incluidos.

## Accesibilidad

- Títulos, copy, estados, numerales, status y CTA permanecen en DOM.
- Botones nativos con targets mínimos `44×44 px`.
- Secuencia y bloqueo se expresan mediante `disabled`/`aria-disabled`,
  `aria-current`, texto accesible y marcas; ningún estado depende sólo del
  color.
- La tarjeta usa una región estable `aria-live`.
- Teclado: Enter y Space activan exclusivamente el nodo permitido.
- Reduced motion mantiene toda la información y la navegación.
- QR/cámara y permisos sensibles permanecen bloqueados en esta pantalla.

## Validación y performance

Validación final `018E` sobre el árbol exacto preparado para el commit:

| Control | Resultado 018E |
| --- | --- |
| TypeScript | PASS |
| ESLint | PASS, 0 warnings |
| Suite focal W4 | PASS, 42/42 |
| Suite completa | PASS, 20/20 archivos y 242/242 tests, ejecutados en lotes acotados |
| Build/PWA | PASS, 233 entradas de precache, 0 referencias faltantes |
| Auditoría de assets | PASS, sin URL externa, CDN ni audio |
| Validadores complementarios | Portada/Intro PASS 27 rutas; Transition Root PASS 34 runtime |
| Manifest/precache | PASS; 20 runtime W4 incluidos, 0 mirrors `current-used`, 0 master rechazado |
| Enlaces Markdown relativos | PASS, 116/116; rotos 0 |
| Browser integrado de producción | PASS, 9/9 superficies; consola 0/0, imágenes rotas 0, overflow 0, externos 0, audio/video 0 |
| Transiciones pasivas | PASS, W2→W3, W3→W4 y W4→W5 redirigen automáticamente |
| Runtime y mirrors | PASS, 20/20 + 20/20 byte-idénticos |
| Congelados auditados | PASS, hashes before/after idénticos en 14 grupos de control |

Performance registrada:

- actividad idle estable: `11`;
- con tap hint visible: `9`;
- actividad máxima durante nodo: `20`, bajo presupuesto `36`;
- long tasks `>50 ms` atribuibles a Estación IV: `0`;
- RAF global permanente: `0`.

La matriz responsive/performance exhaustiva de `018D` permanece como evidencia
histórica válida porque `018E` no cambió runtime después de ella. `018E` repitió
los gates críticos y el smoke global con el Browser integrado. Los resultados,
manifiestos y hashes se consolidan en:

```text
C:\Users\JOSE DAVID\Downloads\GVO_ST4_018E_CLOSEOUT_20260722_122342\
```

## Alcance congelado para 018E

- Mundo II y sus assets.
- Estación III y sus assets.
- transición W2→W3 y transiciones pasivas;
- navegación y copy global;
- biblioteca compartida de Lía;
- paths, pantalla y lógica preexistentes de Mundo V;
- 20 assets runtime W4 y 20 mirrors;
- manifest, artboard, anchors y geometry W4;
- layout R1, fullscreen, orientación y motion 018D.

No se implementa Estación V, no se activan rutas nuevas y no se inicia Mundo
VI.

## Limitaciones y deuda conocida

- PWA instalada/relanzada: no certificada en la plataforma QA.
- Producción móvil LAN: requiere origen seguro para instalación PWA real.
- El warning de chunk JavaScript mayor de `500 kB` es conocido y no bloqueó el
  build; sigue siendo deuda de optimización, no una regresión de W4.
- Safari/iOS real no forma parte de la certificación registrada.
- `assets:validate:loading` no pudo repetir la comprobación de procedencia
  contra `GVO_archivos_iniciales` porque ese paquete fuente externo no existe
  en la ruta esperada de esta máquina. Los binarios runtime de carga no fueron
  modificados por 018E y sí quedaron cubiertos por build, precache y tests; la
  limitación no afecta el alcance de Estación IV.
- No existe deuda funcional conocida dentro del alcance aprobado de Estación
  IV.

## Documentos de cierre

- [Retrospectiva de Estación IV](../retrospectives/GVO_STATION_IV_RETROSPECTIVE.md).
- [Handoff de cierre](../../GVO-HANDOFF-CIERRE-ESTACION-IV.md).
- Estado histórico de [018C](GVO_ST4_018C_MF05_STATIC_COMPOSITION.md),
  [018C_R1](GVO_ST4_018C_R1_IMMERSIVE_LAYOUT_CORRECTION.md) y
  [018D](GVO_ST4_018D_MF06_INTERACTION_AND_MOTION.md).

## Condición para emitir el flag de éxito

Sólo después de validación, commit y push deben cumplirse simultáneamente:

```text
HEAD = origin/main local = refs/heads/main remoto
divergencia = 0 0
worktree = vacío
staging = 0
untracked = 0
```

Hasta que la evidencia externa lo demuestre, este documento no emite ni
anticipa el flag final de éxito de `018E`.
