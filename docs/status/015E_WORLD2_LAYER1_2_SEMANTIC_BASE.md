# 015E - Base semantica curada capas 1-2 Estacion II / Mundo II

## Estado

`IMPLEMENTADO_LOCAL / VALIDADO_CON_CAPTURAS / STOP_AFTER_LAYER_2_REVIEW / SIN_PUSH / PR_NO_APLICA`

## Estado Git inicial

```text
## main...origin/main [ahead 5]
1787e5e docs: plan curated World II composition reset
b4035e1 fix: reset World II visual composition hierarchy
1c695dc fix: rebuild World II immersive station layout
f6fc078 feat: integrate World II station runtime base
94b86a9 assets: add current-used runtime asset registry
ed62302 docs: inventory existing assets for World II references 014BREF
0247c18 fix: correct loading preload and asset methodology 014A1
008c67a fix: polish loading and specify World II assets 014A
```

## Objetivo ejecutado

Se implemento el gate `015E` definido por `docs/status/015D_WORLD2_CURATED_COMPOSITION_PLAN.md`.

Alcance real:

- recomposicion runtime de capa 1 `planta_viva`;
- recomposicion runtime de capa 2 `senal`;
- copia de 7 assets nuevos autorizados desde Descargas;
- registro byte-identico de esos assets en `current-used/world-2-root/`;
- panel de dialogo nuevo;
- navegacion modular por tokens;
- preload critico actualizado;
- capturas 390x844 y 430x932 generadas para revision humana.

No se implementaron visuales semanticas de captura, acondicionamiento, mapeo ni resultado mediado. Eso queda para `015F`.

## Assets copiados

Origen:

```text
C:\Users\JOSE DAVID\Downloads\
```

Destino runtime:

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/
```

| Asset | Subcarpeta runtime | Bytes |
| --- | --- | ---: |
| `world2_dialogue_card_mobile_safe_v01.png` | `dialogue/` | 985609 |
| `world2_plant_stage_anchor_v01.png` | `plant/` | 543189 |
| `world2_signal_origin_contact_v01.png` | `signal/` | 264068 |
| `world2_layer_nav_token_base_v01.png` | `navigation/` | 259705 |
| `world2_layer_nav_token_active_v01.png` | `navigation/` | 477945 |
| `world2_layer_nav_connector_inactive_v01.png` | `navigation/` | 31344 |
| `world2_lia_gesture_signal_spark_v01.png` | `lia-fx/` | 825968 |

## Assets registrados en current-used

Los mismos 7 assets fueron copiados byte-identicos a:

```text
public/assets/gvo/current-used/world-2-root/
```

Subcarpetas usadas:

- `dialogue/`
- `plant/`
- `signal/`
- `navigation/`
- `lia-fx/`

Esto cumple `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md`.

## Cambios de runtime

Archivos modificados:

- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.css`
- `src/screens/World2Root/world2RuntimeAssets.ts`
- `src/screens/World2Root/World2RootScreen.test.tsx`
- `public/assets/gvo/stations/world-2/pulse-invisible/README.md`

Cambios principales:

- Se cambio `data-world2-runtime-version` a `015E`.
- Se elimino del nucleo visible de capa 1-2 el montaje de route fields, microescenas, haze/silhouette y glows decorativos.
- Se agrego `world2_plant_stage_anchor_v01.png` para anclar visualmente la planta.
- Se agrego `world2_signal_origin_contact_v01.png` solo en capa `senal`.
- Se mantiene `world2_raw_bioelectric_waveform_v01.png` solo en capa `senal`.
- Se agrego `world2_lia_gesture_signal_spark_v01.png` solo en capa `senal`.
- Se reemplazo el panel anterior por `world2_dialogue_card_mobile_safe_v01.png`.
- Se reemplazo visualmente la barra inferior por tokens modulares individuales.
- Se mantiene Lia 2.5D existente: `lia_pose_idle_v1.png` y `lia_pose_point_portal_1_v1.png`.
- No se uso `lia_pose_activate_portal_1_v1.png`.
- No se usaron poses W2 rechazadas.

## Cambios de preload

`world2InitialRuntimeAssetSources`, consumido por `screenAssetBundles.world2RootInitial`, quedo reducido a assets criticos iniciales:

```text
world2_background_base_mobile_v01.webp
world2_main_living_plant_v01.png
world2_plant_stage_anchor_v01.png
lia_pose_idle_v1.png
world2_dialogue_card_mobile_safe_v01.png
world2_layer_nav_token_base_v01.png
world2_layer_icon_glyphs_atlas_v01.png
```

No se carga toda Estacion II como critica.

## Capturas generadas

```text
docs/visual/world2/015E/world2_015E_390x844_layer_1.png
docs/visual/world2/015E/world2_015E_390x844_layer_2.png
docs/visual/world2/015E/world2_015E_390x844_locked_tap.png
docs/visual/world2/015E/world2_015E_430x932_layer_1.png
docs/visual/world2/015E/world2_015E_430x932_layer_2.png
```

## Validacion browser

Validacion ejecutada con Vite local en:

```text
http://127.0.0.1:5173/estacion/2
```

Navegador usado:

```text
Chrome local instalado
```

| Captura | Estado | Imagenes | Rotas | Remotas externas | Audio | Video | Canvas | Overflow X | Overflow Y | TEMP visible | MobileShell | Base panel |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| `390x844_layer_1` | `planta_viva` | 22 | 0 | 0 | 0 | 0 | 0 | no | no | no | no | no |
| `390x844_layer_2` | `senal` | 25 | 0 | 0 | 0 | 0 | 0 | no | no | no | no | no |
| `390x844_locked_tap` | `planta_viva` | 22 | 0 | 0 | 0 | 0 | 0 | no | no | no | no | no |
| `430x932_layer_1` | `planta_viva` | 22 | 0 | 0 | 0 | 0 | 0 | no | no | no | no | no |
| `430x932_layer_2` | `senal` | 25 | 0 | 0 | 0 | 0 | 0 | no | no | no | no | no |

Notas:

- Las URLs servidas por `127.0.0.1` son assets locales de Vite, no recursos externos.
- Capa 1 inicia activa.
- Capa 2 se desbloquea al tocar `Siguiente`.
- Tap en capa bloqueada muestra mensaje suave.
- `world2_mediation_route_base_v01.png` no aparece en capa 1-2.
- `world2_layer_nav_frame_v01.png` no aparece en capa 1-2.

## Checklist visual interna

| Pregunta | Resultado | Evidencia / riesgo |
| --- | --- | --- |
| La planta se ve anclada al mundo y no flotando | si | `world2_plant_stage_anchor_v01.png` queda bajo la planta |
| La senal nace claramente desde la planta | si | `world2_signal_origin_contact_v01.png` aparece junto a planta en capa 2 |
| La senal se entiende como dato, no como musica | si | No hay notas, pentagrama ni audio |
| Lia se ve 2.5D, limpia y activa | si | Usa poses existentes del repo |
| El spark de Lia ayuda o distrae | ayuda con riesgo bajo | Se limita a capa 2 y no es particula constante |
| El panel de dialogo contiene realmente el texto | si | Texto DOM dentro de card nueva |
| La navegacion inferior es mas legible que en 015C | si, con riesgo bajo | Tokens mas altos; labels siguen compactos por 6 capas en mobile |
| Se redujo la sensacion de collage | si | Sin route fields, microescenas ni glows decorativos en capa 1-2 |
| Hay maximo 6-8 piezas visuales principales por estado | si funcional | Navegacion cuenta como sistema modular; DOM contiene varias imagenes por token |
| Se elimino el exceso de morado no semantico | si | Morado queda como ambiente; senal usa contacto/waveform |

## Validaciones tecnicas

```text
npm run test -- World2Root
Resultado: PASA
Evidencia: 1 archivo de prueba, 4 pruebas pasadas.
```

```text
npm run lint
Resultado: PASA
```

```text
git diff --check
Resultado: PASA
Observacion: solo avisos normales LF -> CRLF en Windows.
```

## Fallos o riesgos

- Playwright no tenia navegador gestionado descargado; no se ejecuto `npx playwright install`. Se uso Chrome local instalado con Playwright.
- El primer intento de arranque de Vite con `npm run dev -- ...` fallo por argumentos; se uso el binario local `node_modules/.bin/vite.cmd` sin instalar dependencias.
- La navegacion es mas legible que 015C, pero sigue siendo un bloque denso por tener 6 capas en ancho mobile. Requiere revision humana.
- No se ejecuto `npm run build` por deuda editorial preexistente fuera del alcance (`resolveEditorialText.ts`) ya documentada en tickets previos.

## Confirmaciones de alcance

- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
- No se instalaron dependencias.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se genero ningun asset visual.
- No se crearon prompts de imagen.
- No se usaron assets remotos.
- No se uso CDN.
- No se uso audio.
- No se uso video.
- No se uso canvas.
- No se activo QR/camara.
- No se importo Excel.
- No se uso Lia pixelart.
- No se usaron poses W2 rechazadas.
- No se uso `lia_pose_activate_portal_1_v1.png`.
- Se detuvo el alcance visual en capa 2 para revision humana.

## Commit

Commit local previsto para cierre:

```text
feat: integrate curated World II layer 1 and signal base
```

El hash final se registra en la entrega de Codex, porque depende de este documento de cierre.
