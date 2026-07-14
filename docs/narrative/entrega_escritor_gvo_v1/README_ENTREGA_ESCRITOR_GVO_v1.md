# Entrega para escritor GVO v1

Estado del paquete: `LEGACY — snapshot de autoría; no es fuente de verdad runtime`.

> Aviso 017K-R1: la transición W2→W3 y Estación III ya están cerradas. Las matrices reflejan los dos slots W2→W3 como `FINAL / human_approved` y los 23 slots `W3_*` como `LEGACY / no consumido por runtime`. No editar esas filas ni usarlas para reemplazar `src/screens/World3Root/station3Content.ts`. Este paquete solo puede reactivarse para otros slots mediante un ticket independiente.

## Propósito

Este paquete reúne los insumos necesarios para que el escritor produzca diálogos, textos ambientales, microcopy de interacción, mensajes de bloqueo, textos de carga, cierres y alternativas cortas para GVO sin depender de conocimiento de programación.

La entrega no impone estilo literario. Ordena función, contexto visual, restricciones conceptuales y necesidades de interfaz. La voz final, el ritmo, la sensibilidad verbal y las soluciones literarias quedan a criterio del escritor, siempre que no contradigan la experiencia ni los conceptos protegidos.

## Archivos incluidos

- `00_LEER_PRIMERO_ESCRITOR_GVO_v1.md`: encargo y límites de escritura.
- `01_DOSSIER_VISUAL_GUIONIZACION_GVO_v1.md`: documento principal de contexto visual y narrativo.
- `02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO_PARA_ESCRITOR.csv`: matriz editable de trabajo.
- `02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO_PARA_ESCRITOR.xlsx`: versión de matriz para hoja de cálculo.
- `03_GUIA_DILIGENCIAMIENTO_MATRIZ_GVO_v1.md`: guía para llenar columnas.
- `04_CONCEPTOS_PROTEGIDOS_Y_CUIDADOS_GVO_v1.md`: límites conceptuales.
- `05_CHECKLIST_ENTREGA_TEXTOS_GVO_v1.md`: checklist para entrega del escritor.
- `06_INDICE_VISUAL_REFERENCIAS_GVO_v1.md`: índice de las 9 referencias visuales.
- `manifest_entrega_escritor_gvo_v1.json`: manifest de trazabilidad.
- `visual_refs/`: copias de las 9 referencias visuales aprobadas.

## Orden recomendado de lectura

1. Leer `00_LEER_PRIMERO_ESCRITOR_GVO_v1.md`.
2. Revisar `01_DOSSIER_VISUAL_GUIONIZACION_GVO_v1.md`.
3. Consultar `06_INDICE_VISUAL_REFERENCIAS_GVO_v1.md` junto con las imágenes.
4. Leer `04_CONCEPTOS_PROTEGIDOS_Y_CUIDADOS_GVO_v1.md`.
5. Llenar únicamente filas todavía pendientes y autorizadas por un ticket activo, con ayuda de `03_GUIA_DILIGENCIAMIENTO_MATRIZ_GVO_v1.md`.
6. Validar la entrega con `05_CHECKLIST_ENTREGA_TEXTOS_GVO_v1.md`.

## Trabajo en la matriz

Si un ticket independiente reactiva este paquete, el escritor debe trabajar únicamente filas todavía pendientes, preferiblemente en la versión `.xlsx`.

Columnas editables:

- `Texto final`
- `Alternativa corta`
- `Notas escritor`

No cambiar:

- IDs.
- Nombres de pantalla.
- Estados.
- Columnas estructurales.
- Orden o cantidad de filas.
- Filas `FINAL / human_approved`.
- Filas `LEGACY / no consumido por runtime`.

Este paquete no es documentación técnica de programación. No requiere modificar rutas, pantallas, lógica, componentes ni archivos runtime.
