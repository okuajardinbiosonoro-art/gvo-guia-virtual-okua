# Índice documental canónico

## Edición vigente de desarrollo

[Revisión conjunta de gerencia y escritor · 1.2.0 R2](releases/GVO_1.2.0_R2.md) · [Campo · 1.1.3](releases/GVO_1.1.3.md).

## Orientación

- [Handoff del PC de campo](field/FIELD_PC_HANDOFF.md)
- [Estado actual](status/CURRENT_STATE.md)
- [Reglas no negociables](01_REGLAS_NO_NEGOCIABLES.md)
- [Roadmap](ROADMAP.md)

## Producto y arquitectura

- [Arquitectura técnica](05_ARQUITECTURA_TECNICA.md)
- [Flujo QR y estaciones](02_FLUJO_QR_Y_ESTACIONES.md)
- [Estrategia de cámara y QR](07_ESTRATEGIA_QR_CAMARA.md)
- [QR físicos interestación](assets/qr/interstation/README.md)
- [Inventario de assets](assets/ASSET_INVENTORY.md)
- [Política de assets runtime](process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md)

## Campo y QA

- [Preparación HTTPS local de laboratorio](qa/GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md)
- [Matriz física de cámara/QR](qa/GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md)
- [ADR de HTTPS local y scanner interno](decisions/ADR-0007-https-local-dinamico-y-scanner-qr-interno.md)

## Estado y autoridad

- `status/CURRENT_STATE.md`: fuente de verdad viva.
- `HUMAN_APPROVED/PUBLISHED`: autoridad humana posterior.
- `FOR_REVIEW`: evidencia histórica del corte técnico, preservada sin
  reescritura retroactiva.
- [Índice de estados](status/README.md)

Los documentos históricos permanecen disponibles para auditoría, pero no son
parte del orden de lectura necesario para operar el PC de campo.

## Cómo interpretar el árbol

| Ubicación | Qué representa | Uso |
| --- | --- | --- |
| Raíz, reglas de producto, arquitectura y flujo QR | Contrato técnico y orientación | Comenzar por esta página y el estado vigente. |
| `releases/` | Actas fechadas y verificaciones | R2 es la copia para enviar. La primera 1.2.0 se conserva como antecedente. |
| `field/` | Operación en el jardín | Comprobar versión instalada y evidencia del equipo de campo. |
| `decisions/` y `process/` | Decisiones y políticas | Revisar la decisión específica y su fecha. |
| `tickets/`, `status/`, `qa/`, `testing/` y `evidence/` | Requisitos, cortes técnicos y pruebas fechadas | La palabra «pendiente» en un ticket antiguo describe ese corte. |
| `narrative/`, `source_specs/` y `handoffs/` | Entregas de autor, contratos y transferencias | Consultar procedencia. La visita y el catálogo se generan para cada entrega editorial. |
| `assets/`, `asset-briefs/`, `visual/`, `screens/`, `worlds/`, `fable/` y `lia/` | Material por pantalla y estudios visuales | Consultar el inventario runtime para identificar lo integrado. |
| `gvo/`, `maintenance/`, `retrospectives/` y `security/` | Contexto técnico, revisiones y mantenimiento | Leer según fecha y finalidad. |

El repositorio público contiene el producto y su documentación. Obsidian y el repositorio documental institucional enlazan el cierre por P10. Drive conserva un expediente por corte. La carpeta **GVO 1.2.0 R2 · Revisión de gerencia y escritor** contiene la documentación de esta entrega. Las compilaciones de ensayo, devoluciones y fuentes originales tienen valor de trazabilidad y se conservan por separado del material para enviar.

## Proyectos relacionados

P10 es la guía de visitantes. P09 conserva la beta visual. P11 reúne pruebas en el laboratorio Fable5. P12 conserva el espacio narrativo, el Atlas y las entregas originales. P13 corresponde al editor local de Windows. En la biblioteca institucional y en Drive se conservan los expedientes de cada uno. Para revisar la visita, la entrega que corresponde enviar es el ZIP R2 de P10 con el editor v4 de P13.
