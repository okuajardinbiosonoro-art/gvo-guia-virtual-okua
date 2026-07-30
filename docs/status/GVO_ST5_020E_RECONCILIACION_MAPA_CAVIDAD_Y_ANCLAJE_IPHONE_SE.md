# GVO ST5-020E — Reconciliación de mapa, cavidad y anclaje iPhone SE

## Estado de entrada y alcance

- Baseline remoto verificado: `3b669001a1be0f57efaf5573c9b036d359754e59`.
- Rama autorizada: `main`, inicialmente limpia, alineada con `origin/main` y con divergencia `0/0`.
- Estado humano heredado: `ST5_020D_HUMAN_REJECTED_MAP_COMPOSITION_AND_PLANTS_ANCHOR`.
- Alcance ejecutado: overview de `/estacion/5`, relación sector–cavidad, rótulos, tarjeta compacta y anclaje perceptivo de Plantas.
- Sistema se trató únicamente como regresión protegida.
- Espacio, Visitante, 3/4, 4/4, cierre, Final y navegación a Final permanecen sin implementar.

## Auditoría geométrica previa

Se inspeccionaron el informe, métricas, 64 capturas individuales y ocho hojas de contacto de 020D; los contratos de MAP-01 a MAP-06; manifiesto, runtime y espejos `current-used`; implementación, pruebas y patrones editoriales de Estaciones III/IV; y la geometría fuente de preproducción 019C.

La auditoría alpha de los rasters determinó:

- artboard portrait: `1440 × 2560`; rim alpha `[48,1010]..[1339,2376]`; recinto interior observado `x=111..1280`, `y=1043..2318`;
- artboard landscape: `2560 × 1440`; rim alpha `[112,120]..[1528,1392]`; recinto interior observado `x=202..1438`, `y=154..1300`;
- alpha bbox Plantas `[336,192]..[1379,1274]`;
- alpha bbox Sistema `[369,483]..[1404,1092]`;
- alpha bbox Espacio `[189,508]..[1404,1131]`;
- alpha bbox Visitante `[264,333]..[1388,1258]`;
- focus Plantas alpha `[381,208]..[1168,1303]` sobre `1536²`.

La cavidad se formalizó con `mapRecessMaskPortrait` y `mapRecessMaskLandscape`: dos contornos seguros en coordenadas fuente, muestreados del centro transparente de MAP-03/MAP-04. El gate exacto reconstruye además la máscara irregular a partir de los tramos alpha del rim y cuenta cada píxel opaco de los sectores; no aprueba usando solo bounding boxes.

## Posiciones fuente de los cuatro clusters

Cada cluster conserva raster uniforme, rótulo próximo y target semántico. Las posiciones se proyectan desde el artboard al `mediaCanvas`:

| Orientación | Sector | `x, y` fuente | Cuadrado raster |
| --- | --- | ---: | ---: |
| portrait | Plantas | `230, 1130` | `430` |
| portrait | Sistema | `750, 1130` | `430` |
| portrait | Espacio | `230, 1650` | `430` |
| portrait | Visitante | `750, 1650` | `430` |
| landscape | Plantas | `300, 250` | `400` |
| landscape | Sistema | `870, 250` | `400` |
| landscape | Espacio | `260, 760` | `400` |
| landscape | Visitante | `870, 760` | `400` |

Resultado exacto en ambas orientaciones:

| Sector | Píxeles opacos | Dentro de cavidad | Clipping alpha |
| --- | ---: | ---: | ---: |
| Plantas | `666518` | `100%` | `0` |
| Sistema | `297145` | `100%` | `0` |
| Espacio | `406629` | `100%` | `0` |
| Visitante | `482411` | `100%` | `0` |

Los rótulos miden `4.42–10.32 px` respecto del alpha asociado. Los móviles portrait cumplen `4–12 px`; tablet `768×1024` cumple `9.87–10.22 px`; escritorio `1024×768`, `6.58–6.99 px`; y `844×390`, tratado como móvil landscape, `5.40–5.75 px`. Ningún rótulo descansa sobre el rim.

## Composición editorial compacta

El encabezado accesible `ESTACIÓN V / MUNDO PRESENTE` ocupa el aire superior del stage. La tarjeta deja de repetir `Mapa del presente` y contiene únicamente orientación breve, siguiente acción y Lía `attend_neutral`.

| Viewport | Stage | Fracción disponible | Tarjeta |
| --- | ---: | ---: | ---: |
| `360×560` | `400 px` | `73.53%` | `136 px` |
| `375×548` | `388 px` | `72.93%` | `136 px` |
| `375×667` | `507 px` | `77.88%` | `136 px` |

- Lía visible: mínimo alpha real `113.29 px` (`>=96 px`).
- Targets: mínimo `44 px`.
- Cuerpo editorial: mínimo `14 px`.
- Overflow normal horizontal/vertical: `0/0 px`.
- Reflow 200%: ancho de proxy `195 px`, sin overflow horizontal y con scroll vertical controlado; texto y Lía se ordenan en una columna.

## Autoridades y corrección perceptiva de Plantas

Las autoridades fuente son:

```text
P_PLANT_BASE = [772, 1280] sobre focus 1536×1536
P_MAIN_LEAF_TARGET = [768, 215, 430, 706]
SOIL_DARK_BAND portrait = [360, 1132, 1080, 1266] sobre 1440×1920
SOIL_TO_PLANTER_FRONT_BOUNDARY portrait = [720, 1267]
SOIL_DARK_BAND landscape = [260, 680, 1040, 790] sobre 1920×1080
SOIL_TO_PLANTER_FRONT_BOUNDARY landscape = [710, 755]
```

020D comparaba el wrapper contra un punto aproximado proyectado alrededor de `y=1312`, ya sobre la cara clara de la jardinera. 020E usa el último punto visible del tallo y lo proyecta alrededor de `y=1225.7` del fondo portrait, dentro de la tierra oscura.

- Inserción medida en móviles pequeños: `8.67–10.42 px`, dentro del contrato `6–14 px`.
- La base permanece dentro de `SOIL_DARK_BAND`, por encima del límite tierra–cara frontal.
- El hotspot sigue `P_MAIN_LEAF_TARGET` dentro del mismo raster.
- Las secuencias `375×548 → 375×667 → 375×548` y `360×560 → 360×640 → 360×560` conservan estado, proyección fuente y contacto al volver al alto inicial.
- Landscape se desplazó solo horizontalmente al `44%` del canvas para evitar clipping a `1024×768`; el anclaje vertical y la autoridad de base no cambian.

## Sistema como regresión protegida

La comparación 020D/020E a `375×667` es numéricamente idéntica para Sistema:

- stage: `485.984 px`;
- foco: `left 73.110`, `top 192.176`, `238.429 × 238.429 px`;
- tarjeta: `157.016 px`;
- rotación: `-2.5deg` portrait / `-2deg` landscape;
- escala uniforme, sombra raster, socket y orientación conservados.

No se añadió skew, escala no uniforme, `rotateX`, `rotateY`, espejo, sombra, cable, asset ni reinterpretación visual.

## Validaciones

| Gate | Resultado |
| --- | --- |
| Baseline Git inicial | PASS — `main`, SHA esperado, divergencia `0/0` |
| Suite unitaria global | PASS — 23 archivos, 255 pruebas |
| ESLint | PASS |
| TypeScript + Vite build | PASS |
| E2E Estación V 020A–020E | PASS — flujo, guards, persistencia, Back, teclado, reduced motion, storage, alturas dinámicas y reflow |
| QA Chromium | PASS — Chromium `148.0.7778.96` |
| QA WebKit | NO EJECUTADO — el ejecutable Playwright WebKit no está instalado; no se declara PASS Safari |
| QA responsive | PASS — 80 capturas, 8 estados × 10 viewports |
| Cavidad irregular | PASS — `100%` alpha dentro por sector y orientación; `0` clipping |
| Rótulo–asset | PASS — `4.42–10.32 px`, por categoría contractual |
| Tarjeta/stage/Lía/targets | PASS — límites indicados arriba |
| Plantas | PASS técnico — base fuente y overlays confirman tierra oscura; pendiente autoridad física humana |
| Sistema | PASS de regresión — geometría 020D conservada |
| Visuales procedimentales | PASS — `0` |
| Consola / page errors / 404 / red externa | PASS — `0 / 0 / 0 / 0` |
| Assets runtime/current-used | PASS — 18/18 byte-idénticos; sin assets runtime nuevos |
| Auditoría de assets | PASS — sin CDN, recursos externos ni audio |
| PWA precache | PASS — 18/18 assets, shell y navigation fallback |

La verificación PWA es estática sobre `dist/sw.js`; no declara un probe offline de navegador.

## Evidencia

`docs/visual/world5/st5-020e/` contiene:

- 80 capturas individuales de los diez viewports y ocho estados;
- diez contact sheets por viewport;
- overlays por viewport de cavidad/alpha/rótulos/targets, Plantas/tierra/base y proyección de Sistema;
- comparaciones 020D/020E del overview en `360×560`, proxy compacto `375×548` y `375×667`;
- comparación de Plantas y comparación de regresión de Sistema;
- seis capturas y `dynamic_viewport.json` para las dos secuencias dinámicas;
- evidencia de reflow 200%;
- `metrics.json`, `summary.json`, `browser_matrix.json` y `pwa_precache.json`.

## Auto-revisión visual Codex

- Los cuatro sectores se leen dentro de una misma cavidad y una retícula 2×2.
- Cada rótulo está próximo a su raster y no se presenta como texto flotante.
- El encabezado utiliza el aire superior y el mapa gana área frente a 020D.
- La tarjeta es compacta, completa y deja visible a Lía.
- La siguiente acción se entiende sin convertir el progreso en presentación automática.
- Plantas nace de la franja oscura y no de la cara clara de la jardinera.
- Sistema conserva el resultado 020D.
- No hay recorte alpha, deformación ni gráfico procedural.

```text
CODEX_VISUAL_SELF_REVIEW_PASS
PENDING_HUMAN_REVIEW
```

## Límites y deudas deliberadas

- La validación física en iPhone SE 2020 de segunda generación conserva autoridad humana y sigue pendiente.
- WebKit/Safari no fue validado porque el motor no está instalado en el entorno.
- El copy permanece candidato; no se declara `COPY_APPROVED`.
- No se implementaron Espacio, Visitante, 3/4, 4/4, cierre, Final ni navegación a Final.
- No se añadió audio, CDN, dependencia, API, asset runtime ni identidad nueva de Lía.
- Esta conformidad técnica no equivale a aprobación visual humana.

Estado técnico previsto tras publicación:

```text
ST5_020E_PUBLISHED_PENDING_HUMAN_REVIEW
```

Acción humana pendiente exacta:

```text
REVISIÓN HUMANA DE OVERVIEW + CAVIDAD + RÓTULOS + PLANTAS EN IPHONE SE + REGRESIÓN DE SISTEMA
```
