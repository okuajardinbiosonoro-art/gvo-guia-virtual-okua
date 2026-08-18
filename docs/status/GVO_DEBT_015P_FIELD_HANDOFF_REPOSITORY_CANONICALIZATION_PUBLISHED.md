# GVO_DEBT_015P — Field Handoff and Repository Canonicalization Published

Fecha: 2026-08-18
Autoridad humana: Ing. José David

```text
GVO_DEBT_015P_FIELD_HANDOFF_READY
HUMAN_APPROVED / PUBLISHED
```

## Baseline

- Starting branch: `main`.
- Starting HEAD: `490ad60017511bfb7cd1b2ba082ab1ba3609593f`.
- Starting origin/main: `490ad60017511bfb7cd1b2ba082ab1ba3609593f`.
- Starting divergence: `0 0`.
- Starting worktree: cambios locales intencionales de GVO_DEBT_015.

## Publicación GVO_DEBT_015

- Aprobación: `HUMAN_APPROVED_WITH_FIELD_DEPLOYMENT_DEBT`.
- Commit A: `975719b0de50d17baadc67c7096aa8c19d08a7f3`.
- Mensaje: `feat(qr): publish in-app interstation scanner flow`.
- Unit: `45` archivos, `532/532`.
- E2E focal: `10/10`.
- E2E global final: `186/186`.
- QR verifier: cuatro SVG, cuatro PNG, ocho decodificaciones, `PASS`.
- Push: verificado directamente en `origin/main`.

El acta humana es
[`GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md`](GVO_DEBT_015P_IN_APP_QR_SCANNER_HUMAN_APPROVED_AND_PUBLISHED.md).
El informe `FOR_REVIEW` permanece histórico e intacto.

## Canonicalización documental

- `README.md`: onboarding desde clone limpio, flujo real y política `main`.
- `AGENTS.md`: modos PC de desarrollo y PC de campo.
- `docs/README.md`: índice corto canónico.
- `docs/status/README.md`: jerarquía de autoridad documental.
- `CURRENT_STATE.md`: fase de campo y deudas abiertas reconciliadas.
- `docs/ROADMAP.md`: completado 001→015 y gates F1→F8.
- `docs/05_ARQUITECTURA_TECNICA.md`: arquitectura actual, cámara, QR y PWA.
- `docs/02_FLUJO_QR_Y_ESTACIONES.md`: avance QR-only y payloads canónicos.
- `docs/field/FIELD_PC_HANDOFF.md`: bootstrap y trabajo exclusivo de campo.
- `tools/qa/gvo_field_handoff_docs_audit.mjs`: auditoría reproducible.

El Commit B que contiene este documento es `SELF`, con mensaje
`docs(repo): prepare canonical field handoff`. `SELF` evita una referencia
criptográficamente imposible de autoinscribir; el SHA se resuelve mediante
`field-handoff-2026-08-18` y `origin/main`.

## Reconciliación GVO_DEBT_011

- Informe histórico: preservado sin cambios.
- Autoridad posterior: ticket GVO_DEBT_015P, Ing. José David.
- Implementación presente desde:
  `458c788843a3eb12beaee844ac407bae166f7c50`.
- Estado canónico:
  `HUMAN_APPROVED / IMPLEMENTATION_PRESENT_ON_MAIN / STATUS_RECONCILED`.
- Acta de reconciliación:
  [`GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md`](GVO_DEBT_011R_ROUTE_CHUNKING_STATUS_RECONCILIATION.md).

## Higiene de certificados

- Archivos rastreados bajo `.gvo-dev-certs/`: `0`.
- Private keys, PFX, passwords y metadata machine-specific: excluidos.
- Scripts reproducibles: publicados.
- Procedimiento local: rotulado `LAB / DEVELOPMENT QA ONLY`.
- Instalación requerida al visitante: `0`.

La CA local no es una solución de deployment ni se transfiere como identidad
criptográfica de campo.

## Higiene de ramas

Estado observado antes de publicar:

| Rama remota | Ahead propio | Behind de main |
| --- | ---: | ---: |
| `feature/000-repo-base` | 0 | 194 |
| `feature/fable5-s5-01-station5-present-map` | 0 | 34 |
| `baseline/funcional-organizacion-2026-06-10` | 7 | 99 |

- Tip baseline preservado:
  `2ddd9eb6fb16edd60e0c44f0727f5a347f4e047a`.
- Tag de archivo:
  `archive/baseline-funcional-organizacion-2026-06-10`.
- Principios vigentes recuperados: cambio mínimo, documentación accionable,
  abstracciones cercanas, validación y separación de autoridades.
- Estados, rutas y roadmap de junio: no copiados.
- Ramas remotas eliminadas después de verificar y archivar:
  `feature/000-repo-base`, `feature/fable5-s5-01-station5-present-map` y
  `baseline/funcional-organizacion-2026-06-10`.
- Ramas locales finales: `main` únicamente.
- Ramas remotas finales: `origin/main` únicamente.

## Handoff de campo

- Commit B: `SELF`.
- Tag final: `field-handoff-2026-08-18`.
- Mensaje del tag:
  `GVO field handoff: QR flow published, canonical docs reconciled, deployment pending on field PC`.
- GitHub: `main`, archive tag y field-handoff tag verificados remotamente.

El repositorio queda listo para clone/pull en el PC de campo. La palabra
`READY` califica el handoff del repositorio, no la certificación física del
deployment.

## Deudas abiertas de campo

- MikroTik e inventario de red.
- Hostname/FQDN bajo dominio real controlado por OKÚA.
- TLS confiable sin instalación en dispositivos visitantes.
- Certificación física de cámara en iPhone y Android.
- QR de red y `/qr/start` después de cerrar red/TLS.
- Fullscreen iPhone como certificación o limitación aceptada.
- Recorrido físico I→V→Mirador y soak offline/reconexión.

```text
GVO_DEBT_015P_FIELD_HANDOFF_READY
HUMAN_APPROVED / PUBLISHED
```
