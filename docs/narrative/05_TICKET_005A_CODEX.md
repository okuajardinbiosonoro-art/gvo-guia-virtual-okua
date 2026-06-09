# TICKET 005A — Organización narrativa de insumos GVO para escritor

## Objetivo

Crear en el repo la base documental `docs/narrative/` para organizar los insumos de guionización de GVO y preparar el trabajo del escritor de diálogos/textos sin modificar pantallas runtime, lógica React, assets en producción ni rutas.

## Alcance permitido

- Crear carpeta `docs/narrative/`.
- Agregar documentos Markdown de inventario, dossier, conceptos protegidos, checklist y fichas por pantalla.
- Agregar matriz base de textos en CSV y, si se entrega dentro del paquete, conservar XLSX como archivo documental.
- Copiar referencias visuales a `docs/narrative/visual_refs/`.
- Copiar especificaciones fuente a `docs/narrative/source_txt/`.

## Prohibido

- No modificar `src/`.
- No modificar `public/`.
- No modificar assets runtime aprobados.
- No mover ni borrar documentación existente.
- No implementar estaciones nuevas.
- No cambiar textos runtime actuales.
- No cambiar rutas.
- No agregar dependencias.
- No ejecutar rediseños visuales.

## Archivos esperados

```text
docs/narrative/
  README.md
  00_INVENTARIO_INSUMOS_GVO.md
  01_DOSSIER_GUIONIZACION_GVO.md
  02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.csv
  02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.xlsx
  03_CONCEPTOS_PROTEGIDOS_Y_EVITAR.md
  04_CHECKLIST_ENTREGA_ESCRITOR.md
  05_TICKET_005A_CODEX.md
  estaciones/
    00_carga_inicial.md
    01_portada_archivo_vivo.md
    02_transicion_entre_mundos.md
    03_estacion_i_mundo_raiz.md
    04_estacion_ii_pulso_invisible.md
    05_estacion_iii_cuaderno_pixel.md
    06_estacion_iv_mesa_sistema.md
    07_estacion_v_mapa_presente.md
    08_pantalla_final_mirador.md
  visual_refs/
  source_txt/
```

## Criterios de aceptación

1. `git status --short` muestra solo archivos nuevos bajo `docs/narrative/`.
2. No hay cambios en código runtime.
3. Todas las referencias visuales están copiadas y enlazadas desde las fichas.
4. La matriz tiene IDs únicos.
5. El dossier explica que la pauta no impone estilo literario, solo define función de pantalla.
6. Las interacciones por pantalla quedan documentadas.
7. Conceptos protegidos y conceptos a evitar quedan documentados.
8. El paquete es entendible para un escritor sin conocimiento de programación.
9. El repo queda limpio después del commit.

## Comandos de verificación sugeridos

```bash
git status --short
find docs/narrative -maxdepth 3 -type f | sort
python - <<'PY'
from pathlib import Path
import csv
p = Path('docs/narrative/02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.csv')
ids = []
with p.open(encoding='utf-8') as f:
    for row in csv.DictReader(f):
        ids.append(row['ID'])
print('rows', len(ids))
print('unique_ids', len(set(ids)))
assert len(ids) == len(set(ids))
PY
```

## Salida esperada de Codex

Responder con:

1. Rama activa final.
2. Estado inicial y final de Git.
3. Archivos creados.
4. Confirmación de que no se modificó runtime.
5. Número de filas de la matriz y confirmación de IDs únicos.
6. Commit hash final, si se hizo commit.
