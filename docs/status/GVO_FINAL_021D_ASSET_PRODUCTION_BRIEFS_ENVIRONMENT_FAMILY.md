# GVO_FINAL_021D — Briefs de producción de la familia Environment

- Fecha: 2026-08-03
- Pantalla: Final — Mirador (`/final`)
- Clasificación: `PREPRODUCTION / DOCUMENTATION / NOT_RUNTIME`
- Estado: `GVO_FINAL_021D_ASSET_PRODUCTION_BRIEFS_COMPLETE`

## 1. Baseline

| Campo | Valor verificado antes de escribir |
| --- | --- |
| Rama | `main` |
| HEAD | `bd4883766a67a064f1f487df3e41fdd827495cff` |
| `origin/main` local | `bd4883766a67a064f1f487df3e41fdd827495cff` |
| `refs/heads/main` remoto | `bd4883766a67a064f1f487df3e41fdd827495cff` |
| Divergencia | `0/0` |
| Worktree | limpio |

No se ejecutó `fetch`.

## 2. Autoridad y límites

021C mantiene `HUMAN_APPROVED` el Art Bible, paleta, cámaras, wireframes,
safe areas, anchors, z-order, composición, materialidad y dirección visual. 021D
convierte esas decisiones en briefs producibles; no las reabre.

- Generación de arte final: **NO**.
- Integración o código runtime: **NO**.
- `public/assets/**` y `current-used`: **sin cambios**.
- Build, tests runtime, Playwright y navegador: **no ejecutados**.
- Los overlays son guías sobre wireframes 021B, no arte nuevo.
- Ninguna referencia se promueve como binario runtime.

## 3. Tabla canónica de assets

| Asset ID | Filename final exacto | Canvas | Formato/alpha | Orientación | z | Dependencia de producción |
| --- | --- | ---: | --- | --- | ---: | --- |
| `FINAL-ENV-P-001` | `final_environment_portrait_v01.webp` | 1440×2560 | WebP opaco | portrait | 0 | primera producción; sin asset previo |
| `FINAL-ENV-L-001` | `final_environment_landscape_v01.webp` | 2560×1440 | WebP opaco | landscape independiente | 0 | portrait producido y revisado |
| `FINAL-DEPTH-P-001` | `final_valley_depth_portrait_v01.webp` | 1440×2560 | WebP alpha | portrait | 10 | ENV-P aprobado |
| `FINAL-DEPTH-L-001` | `final_valley_depth_landscape_v01.webp` | 2560×1440 | WebP alpha | landscape independiente | 10 | ENV-L aprobado y DEPTH-P revisado |
| `FINAL-MIRADOR-P-001` | `final_mirador_foreground_portrait_v01.webp` | 1440×1280 | WebP alpha | portrait inferior | 70 | ENV-P aprobado |
| `FINAL-MIRADOR-L-001` | `final_mirador_foreground_landscape_v01.webp` | 2560×900 | WebP alpha | landscape inferior independiente | 70 | ENV-L y MIRADOR-P aprobados |

El nombre de `FINAL-ENV-P-001` publicado por 021C coincide con el inventario
021B. Los otros cinco nombres/canvas se tomaron literalmente del inventario. No
se encontraron contradicciones de naming.

## 4. Contradicciones y ambigüedades resueltas

1. **ENV frente a DEPTH:** ENV conserva cielo, sol, montañas lejanas, base
   completa del valle y río/camino continuo. DEPTH sólo añade hombros de relieve
   medio, acentos localizados de haze/luz y continuidad media alineada con ese
   río; no duplica la base ni es necesaria para comprenderla.
2. **Haze:** la atmósfera lejana natural queda horneada en ENV. Sólo el haze
   localizado que deba acompañar el parallax puede existir en DEPTH. Se prohíbe
   el velo global.
3. **Bleed DEPTH:** se fija un mínimo documental de 48 px, suficiente para
   probar el transform máximo de 1.5% en ambas cámaras; el valor real debe
   medirse y reportarse al producir.
4. **Reduced motion/fallback:** DEPTH y MIRADOR funcionan con `transform:none`.
   Si DEPTH no carga, ENV sigue siendo un paisaje completo y coherente.
5. **Estado histórico de contact sheets:** las etiquetas 021B anteriores a la
   aprobación no se reescriben. 021C las aprueba como dirección/referencia, no
   como runtime.
6. **Ratio de MIRADOR-L:** el canvas contractual es 2560×900. El brief pide la
   relación aproximada y usar sólo un modo soportado/documentado de la
   herramienta; Photopea lleva la propuesta aprobada al canvas exacto. No se
   inventan dimensiones de salida de ChatGPT Images.

## 5. Briefs

Los seis documentos contienen las 32 secciones contractuales, prompts positivos
y negativos específicos en inglés, flujo no destructivo de Photopea, checklist
visual/técnico, hard fails, metadata y plantilla de retorno.

| Brief | Estado | Orden |
| --- | --- | ---: |
| `FINAL-ENV-P-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION` | 1 |
| `FINAL-ENV-L-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION`, con gate ENV-P | 2 |
| `FINAL-DEPTH-P-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION`, con gate ENV-P | 3 |
| `FINAL-DEPTH-L-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION`, con gates previos | 4 |
| `FINAL-MIRADOR-P-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION`, con gate ENV-P | 5 |
| `FINAL-MIRADOR-L-001_BRIEF.md` | `READY_FOR_HUMAN_ASSET_PRODUCTION`, con gates previos | 6 |

`READY` describe la completitud del brief. No declara que el asset exista, esté
aprobado o pueda saltarse su dependencia.

## 6. Primer brief listo

El único asset que puede producirse primero es:

```text
FINAL-ENV-P-001 — final_environment_portrait_v01.webp
```

Adjuntar únicamente, en este orden:

1. `R01_08_pantalla_final_mirador.png` — dirección artística.
2. `O01_env_portrait_generation_overlay.png` — core y exclusiones.
3. `R13_world5_environment_portrait.webp` — disciplina de canvas/escala, sin
   copiar forma ni textura.

No iniciar `FINAL-ENV-L-001` hasta que el portrait sea revisado humanamente.

## 7. Reference manifest y H07

El manifest normativo contiene 21 filas:

- 15 referencias fuente versionadas;
- 6 overlays 021D;
- paths, hashes, dimensiones, modo y alpha recalculados;
- consumidor, procedencia, estado de licencia, uso permitido, assets servidos,
  prioridad y prohibición de copia.

Estado de H07:

```text
OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE
```

Las referencias con licencia específica no documentada permanecen limitadas a
`ART_DIRECTION_ONLY`, `COMPOSITION_REFERENCE`, `MATERIAL_REFERENCE` o
`PALETTE_REFERENCE`. Ninguna fila se marca `RUNTIME_REUSE_CANDIDATE`. Esto no
bloquea el primer brief porque 021C autorizó el uso interno de la referencia
canónica y los wireframes como dirección/composición; sí bloquea cualquier
promoción binaria de esas fuentes.

## 8. Overlays y mapas

| Archivo | Dimensión | Función |
| --- | ---: | --- |
| `final_021d_env_portrait_generation_overlay.png` | 1440×2560 | core 76%, horizonte, eje, 2–1–2 y exclusiones |
| `final_021d_env_landscape_generation_overlay.png` | 2560×1440 | core 82%×86%, arco y gate 667×375 |
| `final_021d_depth_portrait_layer_map.png` | 1440×2560 | bbox x=6%–94%, y=30%–76% y bleed 48 px |
| `final_021d_depth_landscape_layer_map.png` | 2560×1440 | bbox x=4%–96%, y=27%–78% y bleed 48 px |
| `final_021d_mirador_portrait_exclusion_map.png` | 1440×1280 | plano inferior, reservas y oclusores <=14% |
| `final_021d_mirador_landscape_exclusion_map.png` | 2560×900 | plano bajo, alto 667×375 y oclusores <=10% |

Todos muestran `PREPRODUCTION — NOT RUNTIME` y usan sólo guías/máscaras sobre
wireframes aprobados.

## 9. Paquete externo

Creado fuera del repositorio:

```text
C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021D_ENVIRONMENT_REFERENCE_PACK\
C:\Users\JOSE DAVID\Downloads\GVO_FINAL_021D_ENVIRONMENT_REFERENCE_PACK.zip
```

Contenido: 9 copias fuente curadas, 6 overlays byte-idénticos a los versionados,
`REFERENCE_PACK_README.md` y `reference_manifest.json`. Los wireframes fuente no
se duplican en Descargas porque cada overlay incorpora su contrato exacto. El
ZIP no se versiona.

- Archivos externos: 17.
- Imágenes adjuntables: 15.
- SHA-256 ZIP: `900069B3C0F35610A8012CCEAE3D97A7967575528702FAED831492886C03741D`.

## 10. Manifiesto SHA-256 del paquete versionado

| Archivo | SHA-256 |
| --- | --- |
| `FINAL-ENV-P-001_BRIEF.md` | `2F61BA44285C9B322D7BD4A8AEF43B7332A8BDF624BB5037479696A228623828` |
| `FINAL-ENV-L-001_BRIEF.md` | `11C8C7FDC1129DAF6E1B86AB5910F277896526DFA292E2392EFC8E43AA901FA8` |
| `FINAL-DEPTH-P-001_BRIEF.md` | `EA3EF76C51E81791290950B0256F996B40D6AE2365BCDD9670F9063044458C85` |
| `FINAL-DEPTH-L-001_BRIEF.md` | `E20344197CD220618889E393C33410324F19909F0FC04E53A37197CE9F77690B` |
| `FINAL-MIRADOR-P-001_BRIEF.md` | `F7B3D80F7AE2175F0F25AABF3870C4BD40E00AC06E1F9C94BA8E9575D5712D6A` |
| `FINAL-MIRADOR-L-001_BRIEF.md` | `39C8E7F075BEA24EFDEEDE22AFA50EF6618D647248EFFBDBDFB743590C7E4159` |
| `final_021d_env_portrait_generation_overlay.png` | `033B0B8AFAD6C98D3F8773896FBF09570AA3DE7F36C4EB2BC48A56A0024CD021` |
| `final_021d_env_landscape_generation_overlay.png` | `232D7EDF8B1E860B9D65BAEAB09AD72658D6F3A40A2B68DB8AE969BCEF2A9D03` |
| `final_021d_depth_portrait_layer_map.png` | `7C146B91B3B4F79483F6469EEBFF59BC79254F0EEC040FAED046152388406C87` |
| `final_021d_depth_landscape_layer_map.png` | `C780DC36C908671EC1633FC9F476B1B4872A6F0FCC2ED556F674099D506D3852` |
| `final_021d_mirador_portrait_exclusion_map.png` | `4A5B4BD666A29B0787364271B05465AF839EE5B63B6408422218B204AAC0CB8C` |
| `final_021d_mirador_landscape_exclusion_map.png` | `3D961E5998F95EB257FE6654AC1050607C8B38FC01AA196051593222291A171F` |
| `final_021d_environment_family_manifest.csv` | `E2FBD1CE57E9DD6A46E7D099E5D316321BDDBA167DFD101ACDD2AA7C55B4E052` |
| `final_021d_environment_reference_manifest.csv` | `30CDC5245F87A22AE4932F152779131EDCAAD8307A65C1B2B293A8B431A7480B` |
| `final_021d_environment_family_summary.json` | `5A576A1D8A860AB7E8D8CC1E490FCB4D4848AEBE627CD114FF8C35F4AE7C0901` |
| `generate_final_021d_asset_briefs.py` | `5FA2B54F771193C284C04CAD7F3300AF622ADCE8EB0202FC2BDE074C41D7EE8A` |

El hash del presente documento se calcula después de cerrar su contenido y se
reporta en la salida final de 021D.

## 11. Validación y estado final documental

- Seis briefs con 32 secciones: PASS.
- IDs, filenames, canvas, formato, alpha, orientación y z-order: PASS.
- Prompts positivos/negativos específicos: PASS.
- Photopea, export, visual QA, técnico QA, hard fails y retorno: PASS.
- Reference manifest: 21 referencias, sin paths/hash inventados.
- External pack: creado y ZIP verificable.
- Assets finales producidos: 0.
- Runtime/current-used tocado: 0.

## 12. Siguiente acción controlada

Producir únicamente `FINAL-ENV-P-001` con ChatGPT Images siguiendo su brief y
el set exacto R01→O01→R13. No iniciar `FINAL-ENV-L-001` hasta revisión humana
del portrait. La producción requiere un ticket posterior; 021D no la ejecuta.
