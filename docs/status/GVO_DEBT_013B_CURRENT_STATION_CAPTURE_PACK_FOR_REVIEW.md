# GVO_DEBT_013B — Current Station Capture Pack for Cover Portal Asset Generation

Estado: `PENDING_HUMAN_REVIEW`

Fecha técnica: 2026-08-16

## Resultado

`GVO_DEBT_013B_IMPLEMENTATION_COMPLETE_FOR_REVIEW`

Se creó un paquete documental de `29` capturas PNG directas de la Portada y de
las Estaciones I–V. No se generó arte, no se aplicó edición artística y no se
modificaron código, layout, assets existentes, runtime, manifests, Portada ni
Mirador.

## Baseline

| Campo                | Valor                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Rama                 | `main`                                                                                                                               |
| Baseline obligatorio | `458c788843a3eb12beaee844ac407bae166f7c50`                                                                                           |
| HEAD                 | `458c788843a3eb12beaee844ac407bae166f7c50`                                                                                           |
| `origin/main`        | `458c788843a3eb12beaee844ac407bae166f7c50`                                                                                           |
| Divergencia          | `0 ahead / 0 behind`                                                                                                                 |
| Worktree de entrada  | DEBT_013 y DEBT_013A integrados localmente, sin stage y pendientes de revisión humana                                                |
| Worktree de salida   | Se añadieron únicamente este informe y el árbol documental `generation-references/`; los archivos heredados conservaron su contenido |

Sin stage, commit, push ni PR.

## Método de captura

- Origen: aplicación local del checkout obligatorio, servida desde el mismo
  worktree.
- Navegador: Chromium headless mediante Playwright del repositorio.
- Viewport lógico: `1440×900`.
- Escala de captura: `2×`; las vistas completas resultan en `2880×1800`.
- Preferencias: español, esquema oscuro cuando aplica y movimiento reducido
  para obtener cuadros estables.
- Los crops son recortes directos de elementos o regiones visibles del DOM;
  no tienen retoque, reescalado, reconstrucción ni corrección de color.
- Antes de cada captura se esperaron fuentes, imágenes decodificadas y, donde
  existe, `data-critical-assets-ready="true"`.

Se utilizaron estados de revisión estables para exponer el contenido necesario:
Portada en `portada_idle`; Mundo I en revisita completa; Mundo II con sus capas
desbloqueadas y vistas `planta_viva`, `senal` y `mapeo`; Mundo III con los tres
registros completos; Mundo IV en revisita completa; y Mundo V en
`map_overview`, con el crop de Sistema tomado después de completar Plantas para
mostrarlo disponible. Estos estados se prepararon solo en el almacenamiento del
contexto aislado del navegador y no alteran el repositorio.

## Capture pack — Cover

| Captura                                  | Resolución | Elemento representado           | Utilidad prevista en prompt                                                            |
| ---------------------------------------- | ---------: | ------------------------------- | -------------------------------------------------------------------------------------- |
| `cover/cover_full_current_v01.png`       |  2880×1800 | Portada completa en estado idle | Paleta, iluminación, escala de Lía, jerarquía y relación general de los cinco portales |
| `cover/cover_portal_1_slot_crop_v01.png` |    236×432 | Slot activo del Portal I        | Encaje vertical, marco, centro óptico y escala aparente del primer interior            |
| `cover/cover_portal_2_slot_crop_v01.png` |    170×312 | Slot bloqueado del Portal II    | Lectura mínima y encaje dentro del frame secundario                                    |
| `cover/cover_portal_3_slot_crop_v01.png` |    170×312 | Slot bloqueado del Portal III   | Lectura mínima y encaje dentro del frame secundario                                    |
| `cover/cover_portal_4_slot_crop_v01.png` |    170×312 | Slot bloqueado del Portal IV    | Lectura mínima y encaje dentro del frame secundario                                    |
| `cover/cover_portal_5_slot_crop_v01.png` |    170×312 | Slot bloqueado del Portal V     | Lectura mínima y encaje dentro del frame secundario                                    |

## Capture pack — World I

| Captura                                                  | Resolución | Elemento representado                         | Utilidad prevista en prompt                                                      |
| -------------------------------------------------------- | ---------: | --------------------------------------------- | -------------------------------------------------------------------------------- |
| `world1/world1_current_station_capture_v01.png`          |  2880×1800 | Vista general actual de Mundo Raíz            | Lenguaje general, luz cálida y relación entre sujeto y encuadre vertical         |
| `world1/world1_sprout_reference_v01.png`                 |    424×526 | Brote principal                               | Silueta viva, hojas, proporción y punto focal superior                           |
| `world1/world1_roots_reference_v01.png`                  |  1060×1882 | Raíces y base orgánica visibles               | Ramificación, profundidad y lectura de suelo/conexión                            |
| `world1/world1_connection_composition_reference_v01.png` |  1060×1880 | Composición completa de raíz, vida y conexión | Relación narrativa entre brote, raíces y tres nodos sin copiar la pantalla final |

## Capture pack — World II

| Captura                                                    | Resolución | Elemento representado                         | Utilidad prevista en prompt                                            |
| ---------------------------------------------------------- | ---------: | --------------------------------------------- | ---------------------------------------------------------------------- |
| `world2/world2_current_station_capture_v01.png`            |  2880×1800 | Vista general en la capa Planta viva          | Ambiente, distribución actual, relación planta–Lía y escala de lectura |
| `world2/world2_plant_reference_v01.png`                    |   798×1252 | Planta principal                              | Silueta, densidad de follaje y proporción del sujeto vivo              |
| `world2/world2_wave_reference_v01.png`                     |   1536×560 | Onda bioeléctrica proyectada                  | Ritmo, trazo y color de la señal sin el resto de la UI                 |
| `world2/world2_core_reference_v01.png`                     |   1450×438 | Relación rasgo–núcleo de mapeo–parámetro      | Jerarquía del punto central y flujo de interpretación                  |
| `world2/world2_plant_signal_composition_reference_v01.png` |  1660×1548 | Planta, sonda y señal en una sola composición | Relación narrativa explícita `plant + signal` y dirección del pulso    |

## Capture pack — World III

| Captura                                                | Resolución | Elemento representado                            | Utilidad prevista en prompt                                           |
| ------------------------------------------------------ | ---------: | ------------------------------------------------ | --------------------------------------------------------------------- |
| `world3/world3_current_station_capture_v01.png`        |  2880×1800 | Vista general del Cuaderno Pixel de Pruebas      | Paleta, escala del cuaderno, separación de Lía y organización general |
| `world3/world3_notebook_reference_v01.png`             |  1154×1268 | Cuaderno abierto                                 | Materialidad, espiral, papel y proporción del sujeto principal        |
| `world3/world3_marks_reference_v01.png`                |   906×1132 | Página índice con registros y marcas progresivas | Densidad de símbolos, estructura de página y lenguaje pictográfico    |
| `world3/world3_notebook_composition_reference_v01.png` |  2112×1268 | Cuaderno como centro de la composición           | Balance cuaderno–guía y jerarquía del objeto editorial                |

## Capture pack — World IV

| Captura                                                    | Resolución | Elemento representado                        | Utilidad prevista en prompt                                             |
| ---------------------------------------------------------- | ---------: | -------------------------------------------- | ----------------------------------------------------------------------- |
| `world4/world4_current_station_capture_v01.png`            |  2880×1800 | Vista general completa de la Mesa de sistema | Escala global, materialidad y presencia de la cadena técnica            |
| `world4/world4_table_reference_v01.png`                    |   1740×672 | Superficie y borde principal de la mesa      | Material, perspectiva y zona libre necesaria para una síntesis compacta |
| `world4/world4_network_reference_v01.png`                  |   1740×648 | Cadena de ocho nodos y ruta                  | Lógica de red, ritmo y jerarquía entre dispositivos                     |
| `world4/world4_central_node_reference_v01.png`             |    500×500 | Segmento contextual de Sistema central       | Lectura del nodo central dentro de su relación con vecinos y ruta       |
| `world4/world4_system_logic_composition_reference_v01.png` |  1740×1162 | Mesa, red completa y Lía                     | Composición de sistema legible como una sola unidad visual              |

## Capture pack — World V

| Captura                                               | Resolución | Elemento representado                        | Utilidad prevista en prompt                                   |
| ----------------------------------------------------- | ---------: | -------------------------------------------- | ------------------------------------------------------------- |
| `world5/world5_current_station_capture_v01.png`       |  2880×1800 | Vista general actual del Mapa del presente   | Distribución de escenario, mapa, guía y panel editorial       |
| `world5/world5_map_reference_v01.png`                 |   1640×924 | Artboard completo del mapa                   | Geometría, balance de áreas y jerarquía espacial              |
| `world5/world5_plants_sector_reference_v01.png`       |    258×296 | Sector Plantas disponible                    | Silueta y densidad mínima del sector vivo                     |
| `world5/world5_system_sector_reference_v01.png`       |    258×296 | Sector Sistema disponible después de Plantas | Silueta, escala y contraste del sector técnico                |
| `world5/world5_spatial_composition_reference_v01.png` |  1638×1732 | Mapa y composición espacial general          | Relación entre los cuatro sectores, título y recinto del mapa |

## Prompt preparation

### Portal I attachments

Orden recomendado para el primer caso:

1. `cover/cover_full_current_v01.png` — tomar únicamente luz, paleta, escala y
   materialidad general.
2. `cover/cover_portal_1_slot_crop_v01.png` — usar como contrato visual de
   encaje; no copiar ni hornear frame o número romano.
3. `world1/world1_current_station_capture_v01.png` — conservar la identidad
   vigente de Mundo Raíz sin reproducir la pantalla.
4. `world1/world1_connection_composition_reference_v01.png` — tomar la
   relación vertical entre brote, raíz y conexión.
5. `world1/world1_sprout_reference_v01.png` — orientar la silueta del sujeto
   superior sin copiarla.
6. `world1/world1_roots_reference_v01.png` — orientar ramificación y base
   orgánica sin copiarla.
7. `MIR-I`, definido por DEBT_013A como
   `public/assets/gvo/current-used/final-root/access/final_access_world1_root_v01.webp`,
   solo al final y únicamente como memoria de familia; reutilizarlo o
   reencuadrarlo continúa siendo hard fail.

El frame activo `COV-FRAME-A` inventariado por DEBT_013A puede mantenerse como
referencia técnica adicional si la herramienta admite otra entrada, pero el
crop del slot ya documenta el encaje actual. Ni frame, glow, lock, número, Lía
ni UI deben aparecer dentro del arte futuro.

### Missing captures

Ninguna. Las `29/29` capturas planificadas existen, decodifican como PNG y son
byte-distintas entre sí.

### Naming

Todos los nombres mínimos obligatorios del ticket están presentes. Además se
incluyeron cinco archivos de composición explícita para evitar que la vista
general tenga que cumplir simultáneamente como referencia de sujeto y de
relación narrativa.

### Storage path

`docs/assets/cover-intro/generation-references/`

Las capturas son documentación de generación. No se copiaron a
`public/assets/runtime/`, `public/assets/gvo/current-used/` ni a ningún manifest.

## Files

### Created

- `docs/assets/cover-intro/generation-references/cover/` — 6 PNG.
- `docs/assets/cover-intro/generation-references/world1/` — 4 PNG.
- `docs/assets/cover-intro/generation-references/world2/` — 5 PNG.
- `docs/assets/cover-intro/generation-references/world3/` — 4 PNG.
- `docs/assets/cover-intro/generation-references/world4/` — 5 PNG.
- `docs/assets/cover-intro/generation-references/world5/` — 5 PNG.
- `docs/status/GVO_DEBT_013B_CURRENT_STATION_CAPTURE_PACK_FOR_REVIEW.md`.

Total: `30` archivos creados por DEBT_013B (`29` capturas + `1` informe).

### Modified

Ninguno por DEBT_013B. Los cambios locales heredados de DEBT_013 y el informe
de DEBT_013A no se alteraron.

## Validación

- Baseline HEAD/origin/divergencia: PASS.
- PNG esperados: `29/29`.
- Nombres mínimos obligatorios: completos.
- Decodificación y dimensiones: PASS.
- Capturas vacías: `0`.
- Duplicados byte-idénticos: `0`.
- Inspección visual de Portada, slots y muestras de todos los Mundos: PASS.
- Overlays de devtools o barras de navegador: `0`.
- Arte generado o edición artística: `0`.
- Archivos de runtime, manifests, código, layout, Portada o Mirador modificados
  por DEBT_013B: `0`.
- Pruebas runtime: no aplican; este ticket agrega exclusivamente evidencia
  documental de captura.

## Estado

`PENDING_HUMAN_REVIEW`

Sin generación artística. Sin commit. Sin push. Sin PR.
