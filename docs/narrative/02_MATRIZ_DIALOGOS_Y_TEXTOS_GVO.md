# 02 — Matriz de diálogos y textos GVO

La matriz editable se entrega en:

- `02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.csv`
- `02_MATRIZ_DIALOGOS_Y_TEXTOS_GVO.xlsx`

## Columnas

| Columna                     | Uso                                                                     |
| --------------------------- | ----------------------------------------------------------------------- |
| ID                          | Identificador único para implementación y revisión.                     |
| Pantalla / estación         | Bloque donde aparece el texto.                                          |
| Estado                      | Momento funcional exacto.                                               |
| Emisor sugerido             | Lía, ambiente o sistema/interfaz. Es sugerido, no estilístico.          |
| Tipo de texto               | Diálogo, instrucción, bloqueo, botón, título, etc.                      |
| Contexto visual             | Qué está viendo el visitante.                                           |
| Acción previa del visitante | Qué ocurrió justo antes del texto.                                      |
| Función del texto           | Qué debe resolver el texto.                                             |
| Concepto obligatorio        | Idea que no debe perderse.                                              |
| Evitar                      | Riesgo conceptual o funcional.                                          |
| Longitud sugerida           | Referencia por legibilidad móvil; puede ajustarse si diseño lo permite. |
| Texto final                 | Lo completa el escritor.                                                |
| Alternativa corta           | Versión reducida para pantallas pequeñas.                               |
| Notas escritor              | Dudas o justificación autoral.                                          |
| Estado de revisión          | Pendiente escritor / En revisión / Aprobado / Ajustar.                  |

## Conteo actual

- Filas de texto: 202.
- IDs únicos: 202.

## Distribución por pantalla

| Pantalla / estación            | Filas |
| ------------------------------ | ----: |
| Carga inicial                  |     3 |
| Portada                        |    13 |
| Transición entre mundos        |    12 |
| Estación I — Mundo Raíz        |    20 |
| Estación II — Pulso invisible  |    32 |
| Estación III — Cuaderno Pixel  |    23 |
| Estación IV — Mesa de Sistema  |    40 |
| Estación V — Mapa del Presente |    24 |
| Pantalla final — Mirador       |    35 |

## Actualización 005C

Las filas de Estaciones II-V y Pantalla final fueron reemplazadas por los slots definitivos de guionización. Se conservaron sin cambios las filas de Carga inicial, Portada, Transición entre mundos y Estación I — Mundo Raíz.

Los campos `Texto final`, `Alternativa corta` y `Notas escritor` quedan vacíos para los slots nuevos. `Estado de revisión` queda como `Pendiente escritor`.

## Cierre editorial de Pantalla final — 2026-08-04

- Los 30 slots base y los cinco slots operativos adicionales tienen copy
  `FINAL / human_approved / es`.
- Los 13 textos por debajo de las longitudes sugeridas fueron aprobados
  explícitamente sin reescritura.
- Los cinco slots operativos adicionales están registrados, pero no autorizan
  ni implementan retorno global, busy, rollback, error o reintento.
- El paquete heredado `entrega_escritor_gvo_v1/` permanece como snapshot legacy
  de 197 filas y no se reescribe.
