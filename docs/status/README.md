# Documentación de estado

Este directorio conserva dos clases de documentos: contratos canónicos vigentes y registros históricos numerados.

## Documentos canónicos

| Documento                                                                                                                                              | Función                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [CURRENT_STATE.md](CURRENT_STATE.md)                                                                                                                   | Resumen vigente del estado entregable del proyecto.                                                      |
| [GVO_STATION3_COMPLETE.md](GVO_STATION3_COMPLETE.md)                                                                                                   | Contrato final de Estación III, su transición de entrada, arquitectura, interacción y aprobación.        |
| [GVO_ST4_018E_STATION4_CLOSEOUT.md](GVO_ST4_018E_STATION4_CLOSEOUT.md)                                                                                 | Contrato final de Estación IV, assets, composición, motion, accesibilidad, validación y aprobación.      |
| [GVO_ST5_020A_VERTICAL_SLICE_PLANTAS.md](GVO_ST5_020A_VERTICAL_SLICE_PLANTAS.md)                                                                       | Evidencia técnica del mapa real y vertical slice Plantas, pendiente de aprobación humana.                |
| [GVO_ST5_020B_LIA_Y_VERTICAL_SLICE_SISTEMA.md](GVO_ST5_020B_LIA_Y_VERTICAL_SLICE_SISTEMA.md)                                                           | Evidencia técnica de Lía y vertical slice Sistema, pendiente de aprobación humana.                       |
| [GVO_ST5_020F_ESPACIO_Y_CORRECCION_TEXTO_LANDSCAPE.md](GVO_ST5_020F_ESPACIO_Y_CORRECCION_TEXTO_LANDSCAPE.md)                                           | Integración de Espacio y corrección acotada del rail editorial landscape, pendientes de revisión humana. |
| [GVO_ST5_020G_VISITANTE_Y_ESTADO_4_DE_4_PARA_REVISION.md](GVO_ST5_020G_VISITANTE_Y_ESTADO_4_DE_4_PARA_REVISION.md)                                     | Integración histórica de Visitante y estado interno 4/4; aprobada humanamente como entrada de 020H.      |
| [GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md](GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md)                 | Registro histórico del cierre controlado de Estación V antes de su aprobación humana.                    |
| [GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md](GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md)                                           | Cierre editorial final de las seis transiciones y aprobación humana de 020H.                             |
| [GVO_FINAL_021P_REVISIT_RESET_HUMAN_APPROVED_AND_MIRADOR_PHASE_COMPLETE.md](GVO_FINAL_021P_REVISIT_RESET_HUMAN_APPROVED_AND_MIRADOR_PHASE_COMPLETE.md) | Aprobación vinculante de 021O, publicación de retorno/reset y cierre de Gate 8.                          |
| [GVO_FINAL_MIRADOR_PHASE_COMPLETE.md](GVO_FINAL_MIRADOR_PHASE_COMPLETE.md)                                                                             | Contrato general de cierre de la fase Mirador y transferencia de deudas.                                 |
| [WORLD_II_FINAL.md](../worlds/WORLD_II_FINAL.md)                                                                                                       | Contrato final vigente de Mundo II.                                                                      |
| [Arquitectura técnica](../05_ARQUITECTURA_TECNICA.md)                                                                                                  | Arquitectura y contratos runtime actuales.                                                               |
| [Inventario de assets](../assets/ASSET_INVENTORY.md)                                                                                                   | Trazabilidad de assets runtime y copias `current-used`.                                                  |
| [Roadmap](../ROADMAP.md)                                                                                                                               | Estado de avance y umbral de revisión vigente.                                                           |

## Regla para documentos históricos

Los archivos cuyo nombre empieza por un número de ticket —por ejemplo `010A_`, `014A_`, `015B_` o `017...`— son evidencia histórica y no una especificación acumulativa vigente. Expresiones como `TEMP`, `pending`, `excel_pending`, “experiencia temporal” o conteos de pruebas dentro de esos archivos describen el corte en que fueron escritos.

Cuando un registro histórico contradiga un documento canónico, prevalecen `CURRENT_STATE.md`, el contrato final de la estación correspondiente y la implementación validada. Los archivos históricos se mantienen para auditoría; no deben editarse para simular que siempre reflejaron el estado final.

## Estado de Estación III

Estación III está `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`) en `/estacion/3`.

## Estado de Estación IV

Estación IV está `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`) en `/estacion/4` por `GVO_ST4_018E`. Los registros 018C/R1/018D conservan sus flags históricos; no se reinterpretan retroactivamente.

## Estado de Estación V

`ST5_020H_HUMAN_APPROVED` cierra Estación V para el alcance actual: mapa, cuatro
áreas, 4/4, `Ir al cierre`, persistencia global, guardas y salida al Mirador
temporal. `ST5_020I_PUBLISHED_COMPLETE` y
`TRANSITION_COPY_AUDIT_COMPLETE` formalizan las doce piezas de las seis
transiciones.

## Estado de la Pantalla Final

`GVO_FINAL_021P` registra la aprobación humana vinculante de 021O, publica el
retorno en revisita y el reset real, cierra Gate 8 y declara
`GVO FINAL — MIRADOR PHASE / COMPLETE`. Los Gates 5–8 están completos. Esto no
declara terminado todo GVO: las deudas transversales quedan transferidas a
`PROJECT DEBT CORRECTION` y el Mirador no se reabre salvo regresión demostrada.
