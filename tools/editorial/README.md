# GVO Editorial Excel Validator

## Proposito

`validate_editorial_excel.py` valida un archivo `.xlsx` editorial local contra el inventario actual de slots editoriales de GVO.

La herramienta existe para revisar el Excel antes de cualquier importacion real. No reemplaza textos, no modifica runtime y no copia el Excel al repositorio.

## Que valida

- Columnas minimas requeridas.
- `Slot ID` existentes en el inventario esperado del repo.
- Duplicados por `Slot ID` + `Idioma`.
- Slots desconocidos.
- Slots esperados ausentes.
- Texto final vacio en estados `APROBADO` o `FINAL`.
- Prefijo `TEMP` en textos que pretenden ser finales.
- Idiomas permitidos: `es`, `en`.
- Estados permitidos: `TEMP`, `BORRADOR`, `EN_REVISION`, `APROBADO`, `FINAL`, `DESCARTADO`.
- Advertencias para alternativa corta vacia, notas de implementacion vacias y uso automatico de la primera hoja.

## Que no hace

- No importa Excel al registry.
- No modifica `src/**`.
- No modifica pantallas.
- No reemplaza textos `TEMP`.
- No crea traducciones `en`.
- No implementa selector visible ES/EN.
- No crea reportes por defecto.
- No copia el Excel al repo.
- No instala dependencias.
- No usa red.

## Como ejecutarlo

Desde la raiz del repo GVO:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\al\archivo.xlsx" --repo-root .
```

Con hoja especifica:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\al\archivo.xlsx" --repo-root . --sheet "Editorial"
```

Con reportes explicitos fuera o dentro de una ruta decidida por el usuario:

```powershell
python tools/editorial/validate_editorial_excel.py --excel "C:\ruta\al\archivo.xlsx" --repo-root . --report-md "C:\ruta\reporte.md" --report-json "C:\ruta\reporte.json"
```

La herramienta no escribe reportes si no se pasan `--report-md` o `--report-json`.

## Self-test

El self-test crea un `.xlsx` minimo en la carpeta temporal del sistema, valida un caso con un slot valido y errores controlados, y elimina el temporal al terminar:

```powershell
python tools/editorial/validate_editorial_excel.py --self-test
```

Un self-test correcto debe terminar con:

```text
Self-test: PASS (expected controlled validation errors were detected)
```

## Salida esperada

La consola imprime un resumen:

```text
GVO Editorial Excel Validator
Excel: <ruta>
Slots esperados: N
Filas leidas: N
Errores: N
Advertencias: N
Estado: PASS/FAIL
```

Si hay hallazgos, imprime una lista acotada de `ERROR`, `WARN` e `INFO`.

## Limites conocidos

- El parser `.xlsx` es minimalista y usa `zipfile` + XML interno.
- Soporta `xl/workbook.xml`, `xl/worksheets/sheet*.xml`, `xl/sharedStrings.xml`, texto compartido e inline strings.
- Usa la primera hoja por defecto si no se pasa `--sheet`.
- No cubre todos los formatos avanzados de Excel.
- Celdas combinadas, formulas complejas, estilos, filtros, tablas y formatos enriquecidos pueden requerir una fase posterior.
- La seleccion por nombre de hoja depende de que el `.xlsx` tenga metadata de workbook legible.

## Politica de no importar runtime

El flujo permitido es:

```text
Excel -> validacion offline -> reporte auditable
```

El flujo prohibido es:

```text
Excel -> registry
Excel -> runtime
Excel -> textos visibles
Excel -> src/content/*.ts modificado automaticamente
```

## Politica de no copiar Excel al repo

El Excel editorial debe permanecer en la ruta local indicada por el usuario. La herramienta lo lee desde esa ruta, no lo copia, no lo modifica y no crea fixtures persistentes dentro de GVO.
