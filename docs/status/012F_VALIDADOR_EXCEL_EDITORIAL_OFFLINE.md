# 012F - Validador Excel editorial offline

## 1. Proposito

Crear una herramienta local, auditable y versionada para validar un Excel editorial `.xlsx` contra el inventario de slots de GVO antes de cualquier importacion real.

Este ticket crea un validador offline. No importa textos, no reemplaza textos `TEMP`, no modifica runtime, no modifica pantallas y no copia el Excel al repositorio.

## 2. Alcance

Tipo de ticket:

```text
HERRAMIENTA_OFFLINE_VALIDACION_EXCEL_SIN_RUNTIME
```

Alcance aplicado:

- crear `tools/editorial/validate_editorial_excel.py`;
- crear `tools/editorial/README.md`;
- crear este documento de estado;
- leer `.xlsx` como ZIP/XML usando solo librerias estandar de Python;
- extraer slots esperados desde archivos editoriales actuales en modo solo lectura;
- validar columnas, idiomas, estados, duplicados, slots desconocidos, slots ausentes y textos finales;
- generar reportes solo si el usuario pasa `--report-md` o `--report-json`;
- incluir self-test temporal sin escribir artefactos dentro del repo.

Fuera de alcance:

- importar Excel al registry;
- modificar `src/**`;
- modificar runtime;
- modificar pantallas;
- reemplazar textos visibles;
- crear traducciones `en`;
- implementar selector visible ES/EN;
- implementar contador diario;
- activar QR/camara;
- instalar dependencias;
- ejecutar scripts npm, servidor local, baseline completo o herramientas externas.

## 3. Estado Git inicial

```text
## main...origin/main
```

Working tree inicial: limpio.

HEAD inicial:

```text
0e305f2 docs: prepare editorial Excel import plan 012E
```

## 4. Ultimos commits relevantes

```text
0e305f2 docs: prepare editorial Excel import plan 012E
86d5708 docs: review full W1 Final flow 013A
f0241a2 feat: build Mirador final temporary experience 012C
4d22527 feat: prepare W5 final transition and Mirador entry 012B
446a976 feat: build Mundo V temporary experience 012A
d16fe0b feat: prepare W4 W5 transition and Mundo V entry 011B
07bf5ad feat: build Mundo IV temporary experience 011A
1dea327 feat: prepare W3 W4 transition and Mundo IV entry 010B
```

## 5. Archivos revisados

- `docs/status/012E_PREPARACION_IMPORTACION_EXCEL_EDITORIAL.md`
- `src/content/transitionEditorialSlots.ts`
- `src/content/world2EditorialSlots.ts`
- `src/content/world3EditorialSlots.ts`
- `src/content/world4EditorialSlots.ts`
- `src/content/world5EditorialSlots.ts`
- `src/content/finalEditorialSlots.ts`
- ticket adjunto `012F`

Los archivos `src/**` fueron revisados para entender el contrato de slots, pero no fueron modificados.

## 6. Archivos creados

| Archivo | Tipo | Accion | Motivo | Riesgo | Validacion |
|---|---|---|---|---|---|
| `tools/editorial/validate_editorial_excel.py` | Herramienta offline Python | Creado | Validar `.xlsx` editorial contra slots esperados sin importacion. | Medio: parser XLSX minimalista. | `python tools/editorial/validate_editorial_excel.py --help` y `--self-test`. |
| `tools/editorial/README.md` | Documentacion de herramienta | Creado | Explicar uso, limites y politica de no importar runtime. | Bajo. | Revision documental y `git diff --check`. |
| `docs/status/012F_VALIDADOR_EXCEL_EDITORIAL_OFFLINE.md` | Documento de estado | Creado | Registrar alcance, arquitectura, validaciones y riesgos. | Bajo. | `git diff --check`. |

## 7. Confirmacion de no modificacion runtime

No se modifico runtime.

No se modifico `src/**`.

No se modificaron pantallas, rutas, assets, `package.json`, lockfiles ni configuracion.

## 8. Confirmacion de no importacion de Excel

No se importo Excel.

No se copio Excel al repo.

No se leyo ningun Excel editorial real.

El self-test creo un `.xlsx` minimo en carpeta temporal del sistema y lo elimino al finalizar.

No se crearon `.xlsx`, `.xls`, `.csv`, `.json`, `.jsonl`, `.db` ni `.sqlite` persistentes dentro del repo.

## 9. Arquitectura del validador

El validador esta implementado en `tools/editorial/validate_editorial_excel.py` con librerias estandar:

- `argparse`;
- `json`;
- `pathlib`;
- `re`;
- `sys`;
- `tempfile`;
- `zipfile`;
- `xml.etree.ElementTree`.

Componentes principales:

- CLI con `--excel`, `--repo-root`, `--sheet`, `--report-md`, `--report-json` y `--self-test`;
- lector `.xlsx` basado en ZIP/XML;
- parser de `xl/workbook.xml`, `xl/_rels/workbook.xml.rels`, `xl/worksheets/sheet*.xml` y `xl/sharedStrings.xml`;
- soporte de shared strings, inline strings y valores simples;
- seleccion de primera hoja por defecto y seleccion por nombre con `--sheet`;
- extractor de slots esperados desde archivos editoriales actuales mediante regex;
- normalizador de cabeceras para aceptar equivalencias simples;
- motor de validacion con severidades `ERROR`, `WARN`, `INFO`;
- salida por consola;
- reportes opcionales Markdown/JSON solo si el usuario indica ruta;
- self-test con `.xlsx` temporal y errores controlados.

## 10. Columnas esperadas

Columnas minimas:

```text
Bloque
Orden
Slot ID
Emisor
Texto base / intención
Texto final
Alternativa corta
Idioma
Estado de revisión
Notas escritor
Notas implementación
```

Equivalencias aceptadas:

| Columna esperada | Equivalencias simples |
|---|---|
| `Bloque` | `block` |
| `Orden` | `order` |
| `Slot ID` | `slotId`, `id`, `slot` |
| `Emisor` | `emitter` |
| `Texto base / intención` | `texto base intencion`, `intention`, `base text` |
| `Texto final` | `text`, `final text` |
| `Alternativa corta` | `shortText`, `short text` |
| `Idioma` | `locale`, `language` |
| `Estado de revisión` | `status`, `review status` |
| `Notas escritor` | `writer notes` |
| `Notas implementación` | `notes`, `implementation notes` |

## 11. Estados permitidos

Lista cerrada validada:

```text
TEMP
BORRADOR
EN_REVISION
APROBADO
FINAL
DESCARTADO
```

Estados finales que activan validaciones estrictas de `Texto final`:

```text
APROBADO
FINAL
```

## 12. Idiomas permitidos

Idiomas validos:

```text
es
en
```

Reglas aplicadas:

- `es` es el idioma base.
- `en` puede estar ausente.
- `en` no se genera ni se inventa.
- cualquier idioma distinto de `es` o `en` se reporta como `ERROR`.

## 13. Severidades

| Severidad | Uso |
|---|---|
| `ERROR` | Hallazgo bloqueante; el validador termina con codigo distinto de cero. |
| `WARN` | Hallazgo no bloqueante que requiere revision humana. |
| `INFO` | Informacion tecnica o de auditoria. |

## 14. Matriz obligatoria - Validaciones del Excel

| Validacion | Severidad | Que detecta | Bloquea | Como se reporta |
|---|---|---|---|---|
| Archivo `.xlsx` inexistente o ilegible | `ERROR` | Ruta invalida, ZIP corrupto, XML ilegible o estructura minima ausente. | Si | Consola y reportes opcionales. |
| Columna obligatoria faltante | `ERROR` | Falta alguna columna minima del contrato 012E. | Si | Fila de cabecera y nombre de columna. |
| `Slot ID` duplicado por idioma | `ERROR` | Misma pareja `Slot ID` + `Idioma` en mas de una fila. | Si | Fila actual y fila original. |
| `Slot ID` desconocido | `ERROR` | Slot del Excel que no existe en inventario del repo. | Si | Fila y slot. |
| `Texto final` vacio en `APROBADO` o `FINAL` | `ERROR` | Contenido final incompleto. | Si | Fila y slot. |
| `Texto final` contiene `TEMP` en estado final | `ERROR` | Placeholder en texto que pretende ser final. | Si | Fila y slot. |
| Idioma no permitido | `ERROR` | Valor distinto de `es` o `en`. | Si | Fila, slot e idioma. |
| Estado de revision no permitido | `ERROR` | Estado fuera de lista cerrada. | Si | Fila, slot y estado. |
| Slot esperado ausente | `WARN` | Slot del repo sin fila en Excel. | No | Lista de slots ausentes. |
| `Texto final` contiene `TEMP` en borrador/revision | `WARN` | Placeholder en texto no final. | No | Fila y slot. |
| Alternativa corta vacia | `WARN` | Falta `Alternativa corta`. | No | Fila y slot. |
| Notas implementacion vacias | `WARN` | Falta contexto tecnico/editorial. | No | Fila y slot. |
| Hoja no especificada | `WARN` | Se uso la primera hoja por defecto. | No | Cabecera/seleccion de hoja. |

## 15. Como se extraen slots del repo

El script lee en modo solo lectura:

```text
src/content/transitionEditorialSlots.ts
src/content/world2EditorialSlots.ts
src/content/world3EditorialSlots.ts
src/content/world4EditorialSlots.ts
src/content/world5EditorialSlots.ts
src/content/finalEditorialSlots.ts
```

Luego extrae IDs con regex de tokens de slot:

```text
TRANS_*
W2_*
W3_*
W4_*
W5_*
FINAL_*
```

No ejecuta TypeScript.

No importa modulos runtime.

No depende de build.

Inventario esperado detectado por self-test:

```text
159 slots
```

## 16. Como se lee `.xlsx` sin dependencias externas

El `.xlsx` se trata como archivo ZIP. El validador lee:

- `xl/workbook.xml`;
- `xl/_rels/workbook.xml.rels`;
- `xl/worksheets/sheet*.xml`;
- `xl/sharedStrings.xml` si existe.

Soporta:

- texto compartido (`sharedStrings`);
- texto inline;
- primera hoja por defecto;
- seleccion por nombre con `--sheet` cuando workbook metadata esta disponible.

No soporta de forma completa:

- formatos avanzados;
- celdas combinadas;
- formulas complejas;
- estilos;
- filtros;
- tablas de Excel como entidad semantica;
- validaciones nativas del archivo Excel.

## 17. Resultado de self-test

Comando ejecutado:

```text
python tools/editorial/validate_editorial_excel.py --self-test
```

Resultado:

```text
GVO Editorial Excel Validator
Slots esperados: 159
Filas leídas: 3
Errores: 2
Advertencias: 160
Estado: FAIL
Self-test: PASS (expected controlled validation errors were detected)
```

Interpretacion:

El self-test crea un `.xlsx` temporal con un slot valido, un duplicado y un slot desconocido. La validacion interna debe fallar, porque esos errores son intencionales. El self-test completo pasa porque detecta los errores controlados y termina con codigo de salida `0`.

## 18. Resultado de validaciones permitidas

| Comando | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | Inicial: `## main...origin/main`; despues de crear archivos: cambios no versionados permitidos en `tools/editorial/` y `docs/status/012F_VALIDADOR_EXCEL_EDITORIAL_OFFLINE.md`. | PASO |
| `git log --oneline -n 8` | HEAD `0e305f2 docs: prepare editorial Excel import plan 012E`. | PASO |
| `git diff --check` | Sin salida. | PASO |
| `python tools/editorial/validate_editorial_excel.py --help` | Imprimio ayuda CLI con `--excel`, `--repo-root`, `--sheet`, `--report-md`, `--report-json`, `--self-test`. | PASO |
| `python tools/editorial/validate_editorial_excel.py --self-test` | Detecto errores controlados y termino con `Self-test: PASS`. | PASO |

No se ejecutaron scripts npm, servidor local, tests npm, baseline completo ni herramientas externas.

## 19. Riesgos residuales

| Riesgo | Impacto | Probabilidad | Bloqueante | Mitigacion | Ticket sugerido |
|---|---|---|---|---|---|
| Parser XLSX minimalista puede no cubrir todos los formatos avanzados | Medio | Media | No para 012F | Documentar limites y probar con Excel real autorizado antes de importar. | 012G |
| Excel con celdas combinadas | Medio | Media | Puede bloquear validacion completa | Pedir estructura tabular simple para el paquete editorial. | 012G |
| Excel con multiples hojas | Medio | Media | No si se usa `--sheet` | Usar `--sheet` cuando se autorice Excel real. | 012G |
| Cabeceras renombradas | Alto | Media | Si falta equivalencia | Mantener alias simples y ampliar solo con evidencia del Excel real. | 012G |
| Diferencia entre `Slot ID` del Excel y registry | Alto | Media | Si | Bloquear slots desconocidos y reportar faltantes. | 012G |
| Duplicados por idioma | Alto | Media | Si | Error bloqueante por `Slot ID` + `Idioma`. | 012F/012G |
| Textos finales vacios | Alto | Media | Si en estados finales | Error bloqueante para `APROBADO` y `FINAL`. | 012F/012G |
| Traducciones EN incompletas | Medio | Alta | No si fallback ES se mantiene | Reportar cobertura EN antes de estrategia de traduccion. | 012I |
| Riesgo de usar reporte como importacion sin aprobacion | Alto | Baja/media | Si | README y documento reiteran que el flujo permitido es validacion offline. | 012H |
| Riesgo de copiar Excel al repo por error humano | Medio | Media | Si no hay autorizacion | Mantener Excel fuera de GVO y usar rutas locales externas. | 012G |

## 20. Uso futuro recomendado

Cuando el Excel editorial real sea autorizado, ejecutar una validacion sin copiarlo al repo:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\externa\editorial.xlsx" --repo-root .
```

Si el archivo tiene una hoja especifica:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\externa\editorial.xlsx" --repo-root . --sheet "Editorial"
```

Si se quiere guardar reporte, pasar rutas explicitas decididas por el usuario:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\externa\editorial.xlsx" --repo-root . --report-md "C:\ruta\reporte.md" --report-json "C:\ruta\reporte.json"
```

## 21. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| `012F-PUSH` | Sincronizar validador offline Excel. | Publica la herramienta aprobada. | Bajo si el commit queda limpio. | Recomendado inmediato tras aprobar 012F. | `012F-PUSH` |
| `012G` | Generar reporte Excel vs registry con Excel real autorizado. | Prueba el validador contra evidencia real sin importar runtime. | Requiere autorizacion explicita de lectura del Excel real. | Recomendado despues de push. | `012G` |
| `012H` | Importacion controlada de textos ES aprobados. | Permite sustituir TEMP por contenido aprobado. | Alto si se hace antes del diff revisado. | No ejecutar antes de 012G aprobado. | `012H` |
| `012I` | Preparar estrategia EN/fallback. | Ordena traducciones y fallback. | Riesgo de inventar traducciones si se apresura. | Ejecutar despues de resolver ES o con criterio editorial aprobado. | `012I` |
| `012D` | Prototipo controlado de contador diario sin QR real. | Atiende deuda funcional separada. | Distrae de deuda editorial. | Alternativa si se pausa flujo Excel. | `012D` |
| `013B` | Pulido funcional menor W1 -> Final. | Corrige residuales UX/funcionales. | Puede mezclar pulido con editorial si no se acota. | Alternativa si se prioriza estabilidad visual. | `013B` |

## 22. Siguiente paso recomendado

```text
012F-PUSH — Sincronizar validador offline Excel
```

Luego decidir entre:

```text
012G — Generar reporte Excel vs registry con Excel real autorizado
```

o:

```text
012D — Prototipo controlado de contador diario sin QR real
```

## 23. Confirmaciones obligatorias

- No se importo Excel.
- No se copio Excel al repo.
- No se modifico runtime.
- No se modifico `src/**`.
- No se modificaron pantallas.
- No se reemplazaron textos `TEMP`.
- No se crearon traducciones `en`.
- No se implemento selector visible ES/EN.
- No se implemento contador diario.
- No se activo QR/camara.
- No se creo base de datos.
- No se crearon `.db`, `.sqlite`, `.jsonl` ni `.csv` operativos.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se instalaron dependencias.
- No se ejecutaron scripts npm.
- No se ejecuto servidor local.
- No se ejecuto baseline completo.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto `npm audit`.
- No se ejecuto `scripts/run_security_checks.ps1`.
- No se ejecutaron herramientas externas dentro de GVO.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
- No se ejecuto `okua-delivery-md` antes de aprobacion humana.
