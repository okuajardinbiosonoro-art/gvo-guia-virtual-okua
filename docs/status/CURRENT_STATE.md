# Estado actual del proyecto

Actualizado: 2026-08-18

## Estado canónico

```text
FASE = FIELD DEPLOYMENT PREPARATION
RAMA OPERATIVA = main
GVO_DEBT_001→015 = HUMAN_APPROVED / PUBLISHED / RECONCILED
REPOSITORY HANDOFF = READY
FIELD DEPLOYMENT = PENDING PHYSICAL AND NETWORK GATES
```

El repositorio está preparado para continuar en el PC de campo. Esto no
significa que la red, el TLS o la cámara estén certificados en el lugar.

## Contrato vigente del producto

```text
QR → navegador → experiencia
INSTALACIONES EN EL DISPOSITIVO = 0
```

El flujo normal es:

```text
Carga → /inicio → idioma + cámara → Portada → Mundo I
→ QR /qr/w2 → Mundo II
→ QR /qr/w3 → Mundo III
→ QR /qr/w4 → Mundo IV
→ QR /qr/w5 → Mundo V
→ Mirador
```

No existen botones de avance interestación entre Mundos I–V. Los QR inválidos
no escriben progreso ni navegan. Mundo V → Mirador conserva el cierre
automático aprobado.

## Estado del recorrido

| Área | Estado canónico |
| --- | --- |
| Carga, `/inicio` y Portada | `HUMAN_APPROVED / PUBLISHED` |
| Mundos I–V | Recorrido funcional, secuencial, durable y publicado |
| Transiciones | Copy final, automáticas y publicadas |
| Mirador | Gates 5–8 completos; revisita y reset real publicados |
| Progreso y checkpoints | Versionados, fail-closed y verificados |
| Shell y fullscreen | Compartidos; deuda de plataforma iPhone aceptada y pendiente de certificación de campo |
| PWA/cache | Build local-first y route chunking publicados |
| Cámara y QR | `GVO_DEBT_015 / HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT / PUBLISHED` |

## Cierre de deuda GVO_DEBT_001→015

| Tramo | Resultado vigente |
| --- | --- |
| 001–003 | Auditoría, integridad global, evidencia y estados canónicos publicados |
| 004–006 | Checkpoints durables de Mundos I–IV y semántica de guardado publicados |
| 007–008 | Revisita/safe-area y legibilidad responsive publicadas |
| 009–010 | Shell inmersivo, contrato QR de entrada y footprint PWA publicados |
| 011 | `HUMAN_APPROVED / IMPLEMENTATION_PRESENT_ON_MAIN / STATUS_RECONCILED` |
| 012–014 | Entrada, assets visuales y fullscreen global publicados |
| 015 | Scanner interno, cámara y handoff QR interestación aprobados y publicados |

La reconciliación vinculante de GVO_DEBT_011 está en
[`GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md`](GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md).
Su informe `FOR_REVIEW` permanece histórico.

La aprobación vinculante de GVO_DEBT_015 está en
[`GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md`](GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md).
El cierre del repositorio y handoff está en
[`GVO_DEBT_015P_FIELD_HANDOFF_REPOSITORY_CANONICALIZATION_PUBLISHED.md`](GVO_DEBT_015P_FIELD_HANDOFF_REPOSITORY_CANONICALIZATION_PUBLISHED.md).

## Deudas abiertas exclusivamente de campo

- `FIELD TRUSTED HTTPS WITHOUT CLIENT INSTALLATION`.
- `FIELD HOSTNAME / DNS`.
- `MIKROTIK VISITOR ACCESS`.
- `QR NETWORK + APP START`.
- `PHYSICAL FIELD CAMERA CERTIFICATION` en iPhone y Android.
- `MOBILE FULLSCREEN` como certificación/limitación de plataforma.

No permanece deuda editorial `TEMP` en las transiciones canónicas.

## Límites de despliegue

- La CA creada por `npm run dev` es sólo `LAB / DEVELOPMENT QA`.
- El visitante no instala CA, certificado, PWA ni app.
- El host provisional es `gvo`; el FQDN final debe ser
  `gvo.<dominio-real-controlado-por-OKÚA>`.
- `.local` no es la solución de TLS confiable de campo.
- Ningún QR canónico contiene IP ni hostname absoluto.
- Los QR de red y `/qr/start` siguen diferidos.

## Fuentes canónicas

- [Handoff del PC de campo](../field/FIELD_PC_HANDOFF.md)
- [Arquitectura técnica](../05_ARQUITECTURA_TECNICA.md)
- [Flujo QR y estaciones](../02_FLUJO_QR_Y_ESTACIONES.md)
- [Roadmap](../ROADMAP.md)
- [Índice documental](../README.md)

Los informes `FOR_REVIEW` conservan su estado histórico. Una aprobación o
reconciliación posterior no los reescribe: prevalecen esta fuente viva y las
actas humanas publicadas.
